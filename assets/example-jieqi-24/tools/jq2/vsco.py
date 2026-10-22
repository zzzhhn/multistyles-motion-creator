"""vsco: VSCO-2 CE notes through sfizz, as _audio-tools/scripts/render_vs.py does it: one synth per instrument, every note
rendered from sample 0 of its own buffer (freewheeling, deterministic), level normalised per note (RMS of the held part,
or of the first 120 ms after the onset for short articulations; VSCO raw levels differ by up to ~30 dB), sustains longer
than 5.5 s re-bowed (4.6 s segments, 0.6 s crossfades: the samples are 6-11 s and unlooped), a release fade after note-off.
Notes outside an instrument's sampled range raise instead of being folded (folding would change the score's octave).
"""
import numpy as np
from pysfizz import _sfizz
from jq2lib import SR, BS, VS

SYN, KEYS, CACHE = {}, {}, {}
GLK = -12                                  # measured in an earlier project: VSCO's glockenspiel sounds an octave above its key


def synth(name):
    if name not in SYN:
        s = _sfizz.Synth(SR, BS); s.enable_freewheeling(); s.set_num_voices(64); s.set_sample_quality(3)
        assert s.load_sfz_file(f'{VS}/{name}.sfz'), name
        SYN[name] = s; KEYS[name] = {k for k in range(128) if len(s.get_regions_for_note(k)) > 0}
    return SYN[name]


def raw(name, m, vel, hold, tail):
    s = synth(name)
    if m not in KEYS[name]: raise ValueError(f'{name}: key {m} is outside the sampled range')
    n = int(round((hold + tail) * SR)); off = int(round(hold * SR)); L, R = [], []
    s.note_on(0, int(m), int(vel))
    for b in range((n + BS - 1) // BS):
        if b * BS <= off < (b + 1) * BS: s.note_off(off - b * BS, int(m), 0)
        l, r = s.render_block(); L.append(np.asarray(l)); R.append(np.asarray(r))
    s.all_sound_off()
    for _ in range(4): s.render_block()
    return np.stack([np.concatenate(L)[:n], np.concatenate(R)[:n]]).astype(np.float64)


def onset(x, win=0.4):
    e = np.abs(x).max(0)[:int(win * SR)]
    return int(np.argmax(e > 0.1 * e.max())) if e.max() > 0 else 0


def note(name, m, vel, d, rel=0.35, short=False):
    """-> (y, on): y starts at note-on, normalised (held RMS = 1); on = attack onset in samples"""
    key = (name, m, vel, round(d, 4), rel)
    if short and key in CACHE: return CACHE[key]
    tail = 1.6 if short else rel + 0.2
    if not short and d > 5.5:
        segs, s0 = [], 0.0
        while s0 < d - 1e-6: segs.append((s0, min(d - s0, 4.6))); s0 += 4.0
        x = np.zeros((2, int(round((d + tail) * SR)) + 1))
        for j, (a, l) in enumerate(segs):
            y = raw(name, m, vel, l, tail if j == len(segs) - 1 else 0.7); ia = int(round(a * SR)); f = int(0.6 * SR)
            if j: y[:, :f] *= np.sin(np.linspace(0, np.pi / 2, f)) ** 2
            if j < len(segs) - 1: k0 = int(round(4.0 * SR)); y[:, k0:k0 + f] *= np.cos(np.linspace(0, np.pi / 2, f)) ** 2; y[:, k0 + f:] = 0
            b = min(x.shape[1], ia + y.shape[1]); x[:, ia:b] += y[:, :b - ia]
    else:
        x = raw(name, m, vel, max(0.04, d), tail)
    on = onset(x)
    a0, a1 = (on, on + int(0.12 * SR)) if short else (on + int(0.05 * SR), on + max(int(0.1 * SR), int(min(d, 0.8) * SR)))
    x /= np.sqrt((x[:, a0:a1] ** 2).mean()) + 1e-9
    if not short:
        k0 = int(round(d * SR)); fl = int(max(rel, 0.05) * SR)
        if k0 < x.shape[1]:
            env = np.ones(x.shape[1]); m1 = min(x.shape[1], k0 + fl); env[k0:m1] = np.linspace(1, 0, m1 - k0) ** 1.5; env[m1:] = 0; x *= env
    if short:
        if len(CACHE) > 48: CACHE.clear()
        CACHE[key] = (x.astype(np.float32), on)
        return CACHE[key]
    return x, on


def vel_of_dyn(d): return int(round(min(124, 30 + 12 * d)))
