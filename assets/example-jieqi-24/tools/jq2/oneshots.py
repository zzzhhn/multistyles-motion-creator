"""oneshots: score events that happen once (gongHit, timpRoll, swellInto) and the 24 picture accents. Each is levelled
against the dyn target at its peak (K-weighted momentary max = target + offset), so the mixer's section calibration of
the continuous layers does not touch them.
gongHit   VCSL Gong 1 (mf) on beat 1, rings ~8 s.                                       peak = target - 4 LU
timpRoll  VSCO timpani roll on the chord's bass pitch class (D2..C#3), crescendo -24 -> 0 dB from beatFrom to beatTo,
          stopping on that beat (0.35 s release).                                        peak = target - 4 LU
swellInto VSCO suspended-cymbal crescendo (Median) cut to the bar before, peaking on beat 1 of the bar.  peak = target - 8 LU
accent    at every term's impact: one tubular-bell stroke on the section's 宫 in octave 5 (C5 D5 F5 G5), plus a swell
          peaking exactly on it: suspended cymbal (Short crescendo) for terms 1-12, a soft gong swell for 13-24 (VCSL Gong 1
          p: its held sound faded up from -30 dB over 1.6 s; there is no recorded gong roll in the CC0 libraries).
          bell : swell = 0 : -3 dB; the accent's peak = target - 5 LU ("about 5 dB under the bed").
"""
import numpy as np
from jq2lib import SR, ramp, pan, lufs_of_dyn
import vsco
from layers import chord_at, sec_at
from layers2 import wav, norm, level, PERC, IDIO

ACCENTS = []


def peak_at(y):                            # index of the 50 ms RMS envelope maximum
    w = int(0.05 * SR); e = np.convolve((y ** 2).sum(0), np.ones(w) / w, 'same'); return int(np.argmax(e))


def cym(kind, t_peak, t_from, after=0.6):
    y = wav(PERC + f'susCymb1-cresc-{kind}_v1.wav'); k = peak_at(y); a = max(0, k - int((t_peak - t_from) * SR))
    y = y[:, a:k + int((after + 0.5) * SR)].copy(); L = y.shape[1]
    y *= ramp(L, int(0.2 * SR), True) * ramp(L, int(0.5 * SR), False); return y, t_peak - (k - a) / SR


def gong_swell(t_peak, rise=1.6, after=2.0):
    x = wav(IDIO + 'Gong 1/gong_p.wav'); a = int(0.45 * SR); n = int((rise + after + 1.5) * SR); y = x[:, a:a + n].copy()
    u = np.arange(n) / SR; env = np.where(u < rise, 10 ** ((-30 + 30 * u / rise) / 20), 1.0)
    y *= env * ramp(n, int(1.5 * SR), False); return y, t_peak - rise


def oneshots(sc, secs, buses):
    for s in secs:
        x = s.get('extra', {}); T = lambda t: lufs_of_dyn(sc.dyn_at(sec_at(sc, t), t))
        for b in x.get('gongHit', []):
            t = sc.bar_t(b); y, on = norm(wav(IDIO + 'Gong 1/gong_mf.wav')[:, :int(10 * SR)])
            y *= ramp(y.shape[1], int(3 * SR), False); buses['gong'].add(t - on / SR, level(y, T(t) - 4))
        for b, f0, f1 in x.get('timpRoll', []):
            ta, tz = sc.bar_t(b) + f0 * sc.BEAT, sc.bar_t(b) + f1 * sc.BEAT; _, _, _, bs, _ = chord_at(sc, s, tz - 1e-3)
            m = 38 + (bs % 12 - 2) % 12; y = vsco.raw('TimpaniRolls', m, 100, tz - ta + 0.05, 1.0); n = y.shape[1]
            u = np.arange(n) / SR; env = np.where(u < tz - ta, 10 ** ((-24 + 24 * u / (tz - ta)) / 20), 1.0)
            k = int((tz - ta) * SR); env[k:] *= np.exp(-(u[k:] - u[k]) / 0.12); y *= env
            buses['timp'].add(ta, pan(level(y, T(tz - 0.01) - 4), 0.15))
        if x.get('swellInto'):
            b = x['swellInto']; tp = sc.bar_t(b); y, t0 = cym('Median', tp, tp - sc.BAR)
            buses['swell'].add(t0, level(y, T(tp - 0.01) - 8))


def accents(sc, secs, buses):
    bars = {b for s in secs for b in range(s['at'], s['at'] + s['nb'])}
    for tm in sc.terms:
        if tm['bar'] not in bars: continue
        s = sc.sec_of_bar(tm['bar']); t = tm['impact']; g = s['set'][0]; key = 72 + g
        yb = vsco.raw('TubularBells', key, 70, 0.1, 5.0); yb, on = norm(yb, 0.12)
        yb *= ramp(yb.shape[1], int(1.0 * SR), False)
        ys, ts = cym('Short', t, t - 1.4) if tm['n'] <= 12 else gong_swell(t)
        ys = ys * 10 ** ((momentary_db(yb) - 3 - momentary_db(ys)) / 20)
        tb = t - on / SR; a = min(tb, ts); L = int(round((max(tb + yb.shape[1] / SR, ts + ys.shape[1] / SR) - a) * SR)) + 2
        y = np.zeros((2, L)); i = int(round((tb - a) * SR)); y[:, i:i + yb.shape[1]] += yb
        j = int(round((ts - a) * SR)); y[:, j:j + ys.shape[1]] += ys
        target = lufs_of_dyn(sc.dyn_at(s, t)) - 5; y = level(y, target)
        buses['accent'].add(a, y)
        ACCENTS.append(dict(n=tm['n'], name=tm['name'], t=round(t, 4), bell=key, swell='cymbal' if tm['n'] <= 12 else 'gong', target=round(target, 1)))


def momentary_db(y):
    from jq2lib import momentary_max
    return momentary_max(y)
