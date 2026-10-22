"""jq2lib: shared pieces of the 《二十四节气》 v2 offline renderer (tools/jq2/render_jq2.py).
Score access (bars, chords, melodies, dyn), the sample bank with measured tuning (tools/jq2/tuning.json), a 4-point
Hermite resampler that plays a sample at any (time-varying) pitch, VSCO-2 notes through sfizz (per-note RMS
normalisation and re-bowing as in _audio-tools/scripts/render_vs.py), panning, buses that wrap for the loop, and a
BS.1770 K-weighted momentary loudness. Everything is deterministic: no randomness except seeded hashes.
"""
import json, os
import numpy as np, soundfile as sf
from scipy.signal import lfilter
from pysfizz import _sfizz

SR, BS = 48000, 256
HERE = os.path.dirname(os.path.abspath(__file__))
AT = os.environ.get('AUDIO_TOOLS') or os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', '..', '_audio-tools'))   # sample libraries and the venv; default: next to the project
VS = os.path.join(AT, 'vsco2')
CN = os.path.join(AT, 'samples-cn')
PCN = {'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11}


def pcof(s):
    return (PCN[s[0]] + (1 if s[1:2] == '#' else -1 if s[1:2] == 'b' else 0)) % 12


def midi(s):
    s = s.strip(); acc = 1 if s[1:2] == '#' else -1 if s[1:2] == 'b' else 0
    return 12 * (int(s[-1]) + 1) + PCN[s[0]] + acc


def lufs_of_dyn(d):                       # brief: dyn 1..8 -> -30 -27 -24 -21 -18 -15 -12 -10 LUFS short-term, linear between
    d = min(8.0, max(1.0, d)); return -30 + 3 * (d - 1) if d <= 7 else -12 + 2 * (d - 7)


def amp_of_dyn(d):                        # per-note amplitude (RMS of the held part); the mixer calibrates sections on top
    return 0.1 * 10 ** ((lufs_of_dyn(d) + 20) / 20)


def hash01(*k):                           # deterministic hash in [0, 1) (FNV-1a over the key's text)
    h = 0x811c9dc5
    for ch in repr(k).encode(): h = ((h ^ ch) * 16777619) & 0xffffffff
    return h / 2 ** 32


class Score:
    def __init__(self, path):
        S = self.S = json.load(open(path)); self.BEAT, self.BAR = S['beat'], S['bar']
        self.secs = S['sections']; self.terms = S['terms']
        for s in self.secs:
            s['t0'], s['t1'] = (s['at'] - 1) * self.BAR, (s['at'] - 1 + s['nb']) * self.BAR
            s['set'] = [pcof(p) for p in S['gong'][s['gong']]]

    def bar_t(self, b): return (b - 1) * self.BAR

    def sec_of_bar(self, b): return next(s for s in self.secs if s['at'] <= b < s['at'] + s['nb'])

    def dyn_at(self, s, t):
        x = min(1.0, max(0.0, (t - s['t0']) / (s['t1'] - s['t0']))); return s['dyn'][0] + (s['dyn'][1] - s['dyn'][0]) * x

    def slots(self, s):                   # chord slots [(bar, t0, t1, bass, [voicing])], '@beat' splits a bar
        out = []
        for i, c in enumerate(s['chords']):
            b = s['at'] + i; parts = c.split('@'); halves = []
            for j, h in enumerate(parts):
                h = h.strip(); off = 0.0
                if j: off, h = float(h.split()[0]), h.split(None, 1)[1]
                bass, v = h.split('|'); halves.append((off, midi(bass), [midi(p) for p in v.split()]))
            for j, (off, bass, v) in enumerate(halves):
                end = halves[j + 1][0] if j + 1 < len(halves) else 4.0
                out.append((b, self.bar_t(b) + off * self.BEAT, self.bar_t(b) + end * self.BEAT, bass, v))
        return out

    def line(self, s, key='mel'):         # [(t, d, midi or None, beats, beat offset in section)]
        out, x = [], 0.0
        for p, d in s[key]:
            out.append((s['t0'] + x * self.BEAT, d * self.BEAT, None if p == 'r' else midi(p), d, x)); x += d
        return out

    def above(self, s, m):                # the next pentatonic tone above m in the section's 5 tones
        k = m + 1
        while k % 12 not in s['set']: k += 1
        return k


class Bank:                               # Chinese-instrument samples, played at measured pitch -> target pitch
    def __init__(self):
        self.T = json.load(open(os.path.join(HERE, 'tuning.json'))); self.cache = {}; self.rr = {}

    def load(self, f):
        f = f if os.path.isabs(f) else os.path.join(CN, f)            # tuning.json stores paths relative to samples-cn
        if f not in self.cache:
            x, sr = sf.read(f, always_2d=True, dtype='float32'); self.cache[f] = (np.ascontiguousarray(x.T), sr)
        return self.cache[f]

    def pick(self, inst, m, rr=True):     # nearest measured pitch; round-robin among takes of the same note
        c = self.T[inst]; nom = min(c, key=lambda q: abs(q['midi'] - m))['nominal']; takes = [r for r in c if r['nominal'] == nom]
        k = self.rr.get((inst, nom), 0); self.rr[(inst, nom)] = k + 1
        return takes[k % len(takes)] if rr else takes[0]

    def clear(self): self.cache.clear()


def play(x, sr_in, pos0, n, semis):
    """Read x (ch, len) from sample position pos0 for n output samples at SR, shifted by semis (scalar or array)."""
    inc = (sr_in / SR) * np.power(2.0, np.asarray(semis, dtype=np.float64) / 12.0) * np.ones(n)
    pos = pos0 + np.concatenate([[0.0], np.cumsum(inc[:-1])])
    i = np.floor(pos).astype(np.int64); f = pos - i; L = x.shape[1]
    ok = (i >= 1) & (i < L - 2); i = np.clip(i, 1, L - 3)
    xm, x0, x1, x2 = x[:, i - 1], x[:, i], x[:, i + 1], x[:, i + 2]
    c1 = 0.5 * (x1 - xm); c2 = xm - 2.5 * x0 + 2 * x1 - 0.5 * x2; c3 = 0.5 * (x2 - xm) + 1.5 * (x0 - x1)
    return (((c3 * f + c2) * f + c1) * f + x0) * ok


def ramp(n, k, up=True):                  # equal-power (sin^2 / cos^2 in amplitude) ramp of k samples inside length n
    e = np.ones(n); k = max(1, min(k, n)); r = np.sin(np.linspace(0, np.pi / 2, k)) ** 2
    if up: e[:k] = r
    else: e[n - k:] = r[::-1]
    return e


def pan(y, p):                            # mono: constant power; stereo: balance (render_vs.py)
    if y.shape[0] == 1:
        a = (p + 1) * np.pi / 4; return np.vstack([y[0] * np.cos(a), y[0] * np.sin(a)]) * np.sqrt(2)
    y = y.copy()
    if p > 0: y[0] *= 1 - p
    elif p < 0: y[1] *= 1 + p
    return y


class Bus:
    def __init__(self, N, cyc, off):      # off: score seconds of output sample 0; cyc: the loop (wrap past N onto 0)
        self.N, self.cyc, self.off, self.a = N, cyc, off, np.zeros((2, N), np.float32)

    def add(self, t, y):
        i0 = int(round((t - self.off) * SR)); n = y.shape[1]
        if self.cyc:
            k = 0
            while k < n:
                j = (i0 + k) % self.N; m = min(n - k, self.N - j); self.a[:, j:j + m] += y[:, k:k + m]; k += m
            return
        a, b = max(0, i0), min(self.N, i0 + n)
        if b > a: self.a[:, a:b] += y[:, a - i0:b - i0]


KB = ([1.53512485958697, -2.69169618940638, 1.19839281085285], [1.0, -1.69065929318241, 0.73248077421585])
KH = ([1.0, -2.0, 1.0], [1.0, -1.99004745483398, 0.99007225036621])


def momentary_max(y):                     # max 400 ms K-weighted loudness (LUFS) of a stereo event, 100 ms hop
    z = lfilter(*KH, lfilter(*KB, y, axis=1), axis=1); p = (z ** 2).sum(0); w, h = int(0.4 * SR), int(0.1 * SR)
    c = np.concatenate([[0.0], np.cumsum(p)]); k = np.arange(0, max(1, len(p) - w + 1), h)
    e = (c[np.minimum(k + w, len(p))] - c[k]) / w
    return -0.691 + 10 * np.log10(e.max() + 1e-20)
