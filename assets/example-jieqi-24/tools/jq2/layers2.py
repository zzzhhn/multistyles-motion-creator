"""layers2: guzheng layers, bells, percussion and the picture accents.
zarp     guzheng 8ths on the bar's voicing pitch classes: 4 rising from the bass's octave + 1, then 4 falling from the top
         ([p0 p1 p2 p3 p4 p3 p2 p1]); plucked (mf / f / ff by dyn). The ladder starts at A2 at the lowest (the sampled
         Đàn Tranh reaches A2 within the brief's +-2 semitone transposition), so G1 / F1 basses start on the next voicing tone.
zrun     one rising 8th-note run on the section's 5 tones over the listed bars, as near to E3..E6 as the zheng's sampled range
         (top C#6 = B5 + 2) allows: 16 notes C3..C6 for the intro's two bars.
bells    one soft stroke on beat 1: the melody's first note of the bar (the note sounding on the downbeat, else its first
         onset), an octave up; tubular bells if every stroke of the section is <= G5, else glockenspiel (key an octave down,
         notes below its lowest key G4 rendered on G4 and transposed down <= 3 semitones).
glints   大暑: 3 or 4 soft glockenspiel notes per bar on the off-beat 8ths (there are 4), pitch classes of the voicing, octave 6,
         chosen by a deterministic hash of bar and beat.
wood / drum / gong / timpRoll / swellInto and the 24 accents: see the brief; one-shots are levelled against the dyn target.
"""
import numpy as np, soundfile as sf
from jq2lib import SR, CN, VS, play, ramp, pan, amp_of_dyn, lufs_of_dyn, hash01, momentary_max
import vsco
from layers import chord_at

PERC = VS + '/Percussion/'; IDIO = CN + '/vcsl-cc0/Idiophones/Struck Idiophones/'
ACCENTS = []


def wav(f):
    x, sr = sf.read(f, always_2d=True, dtype='float64'); x = x.T
    return play(x, sr, 0.0, int(x.shape[1] * SR / sr) - 4, 0.0) if sr != SR else x


def norm(y, ms=0.12):                      # RMS of the first ms after the onset = 1
    e = np.abs(y).max(0); on = int(np.argmax(e > 0.1 * e.max())); return y / (np.sqrt((y[:, on:on + int(ms * SR)] ** 2).mean()) + 1e-9), on


def level(y, target):                      # one-shot: momentary max (K-weighted, 400 ms) = target LUFS
    return y * 10 ** ((target - momentary_max(y)) / 20)


def pluck(bank, m, dyn, ring):
    r = bank.pick('zheng_' + ('mf' if dyn < 4.5 else 'f' if dyn < 6.5 else 'ff'), m); sh = m - r['midi']
    if abs(sh) > 2.5: raise ValueError(f'zheng {m}: nearest sample is {sh:+.2f} st away')
    x, sr = bank.load(r['file']); n = int((ring + 0.3) * SR); y = play(x, sr, max(0.0, r['onset'] - 0.005) * sr, n, sh)
    return y / attack_rms(y) * ramp(n, int(0.3 * SR), False)


def attack_rms(y):                         # plucks are levelled by their first 150 ms (the decays differ by up to 20 dB)
    return np.sqrt((y[:, :int(0.155 * SR)] ** 2).mean()) / 1.4 + 1e-9


def ladder(b, v):
    pcs, out, m = {u % 12 for u in v}, [], max(b + 12, 45)
    while len(out) < 5:
        if m % 12 in pcs: out.append(m)
        m += 1
    return out


def zarp(sc, secs, bank, bus):
    for s in secs:
        if 'zhengArp' not in s['layers']: continue
        for k in range(s['nb']):
            for e, j in enumerate([0, 1, 2, 3, 4, 3, 2, 1]):
                t = s['t0'] + (4 * k + e / 2) * sc.BEAT; _, _, _, b, v = chord_at(sc, s, t); d = sc.dyn_at(s, t)
                bus.add(t - 0.005, pan(pluck(bank, ladder(b, v)[j], d, 1.0) * amp_of_dyn(d) * (1 if e % 2 == 0 else 0.85), -0.3))


def zrun(sc, secs, bank, bus):
    for s in secs:
        bars = s.get('extra', {}).get('zhengRun')
        if not bars: continue
        tones = [m for m in range(40, 90) if m % 12 in s['set']]; n = 8 * len(bars); i0 = next(i for i, m in enumerate(tones) if m >= 52)
        while tones[i0 + n - 1] > 85: i0 -= 1
        for k in range(n):
            t = sc.bar_t(bars[0]) + k * sc.BEAT / 2; d = sc.dyn_at(s, t)
            bus.add(t - 0.005, pan(pluck(bank, tones[i0 + k], d, 1.2) * amp_of_dyn(d), -0.2 + 0.4 * k / n))


def strike(name, key, vel, tail=4.0, shift=0.0):
    y = vsco.raw(name, key, vel, 0.1, tail)
    if shift: y = play(y, SR, 0.0, y.shape[1], shift)
    return norm(y, 0.12)


def bells(sc, secs, bus):
    for s in secs:
        if 'bells' not in s['layers']: continue
        L, hits = sc.line(s), []
        for k in range(s['nb']):
            tb = sc.bar_t(s['at'] + k); held = [n for n in L if n[2] is not None and n[0] <= tb + 1e-6 < n[0] + n[1]]
            first = held or [n for n in L if n[2] is not None and tb <= n[0] < tb + sc.BAR]
            if first: hits.append((tb, first[0][2] + 12))
        tub = all(m <= 79 for _, m in hits)
        for tb, m in hits:
            d = sc.dyn_at(s, tb); key = m if tub else max(67, m - 12)
            y, on = strike('TubularBells' if tub else 'Glockenspiel', key, 40 + 6 * int(d), 4.0 if tub else 2.5, 0.0 if tub else (m - 12) - key)
            bus.add(tb - on / SR, pan(y * amp_of_dyn(d), 0.25))
        s['_bells'] = 'tubular' if tub else 'glockenspiel'


def glints(sc, secs, bus):
    for s in secs:
        if 'glints' not in s['layers']: continue
        for k in range(s['nb']):
            b = s['at'] + k; cnt = 3 + int(hash01('n', b) < 0.5)
            pos = sorted(sorted([0.5, 1.5, 2.5, 3.5], key=lambda p: hash01('p', b, p))[:cnt])
            for p in pos:
                t = sc.bar_t(b) + p * sc.BEAT; _, _, _, _, v = chord_at(sc, s, t); pcs = sorted({u % 12 for u in v})
                pc = pcs[int(hash01('c', b, p) * len(pcs))]; d = sc.dyn_at(s, t)
                y, on = strike('Glockenspiel', 72 + pc, 36, 2.0)
                bus.add(t - on / SR, pan(y * amp_of_dyn(d) * 0.8, 0.4 if hash01('s', b, p) < 0.5 else -0.4))


def pattern(sc, secs, bus, layer, hits):   # wood / drum: in the bars listed in extra, else the whole section
    for s in secs:
        bars = s.get('extra', {}).get(layer) or (list(range(s['at'], s['at'] + s['nb'])) if layer in s['layers'] else [])
        for b in bars:
            for off, kind in hits:
                t = sc.bar_t(b) + off * sc.BEAT; d = sc.dyn_at(s, t); y, on, g, p = kind(b, off, d)
                bus.add(t - on / SR, pan(y * amp_of_dyn(d) * g, p))


def wood_hit(b, off, d):
    f = ('wood_click_pp_rr%d.wav' % (1 + (2 * b + int(off)) % 3)) if d < 4.5 else 'wood_click_mp.wav' if d < 5.5 else 'wood_click_f_rr%d.wav' % (1 + b % 2)
    y, on = norm(wav(IDIO + 'Woodblock/' + f), 0.06); return y, on, 0.8, 0.35


def drum_hit(b, off, d):
    v = int(min(7, max(1, round(d)))) - (2 if off == 1.5 else 0)
    y, on = norm(wav(PERC + 'BDrumNewhit_v%d_rr%d_Sum.wav' % (max(1, v), 1 + b % 2)), 0.12); return y, on, (0.5 if off == 1.5 else 1.0), -0.1
