"""layers: the string layers of the score's vocabulary (pad, drone, bass, trem, pizz, ost), VSCO-2 CE through sfizz.
pad   strings on exactly the bar's voicing (padOct -1: an octave lower); a pitch held across slots is one sustained note
      (re-bowed past 5.5 s); a pitch that changes cross-fades over 0.25 s at the change (bar line or '@beat').
      Section by register: >= D4 violins, C3..C#4 violas, C2..B2 celli, below C2 basses (the cello's lowest string is C2).
drone celli divisi on the bass and the voicing note a fifth above it (basses take a bass below C2), very soft.
bass  one bow per slot, legato bow changes (0.2 s overlap), so repeated bass notes sound sustained: celli on the bass
      note, basses an octave below when the bass is >= E2; below E2 the basses double at pitch (the octave below is
      off the instrument), and below C2 the basses play it alone (off the cello).
trem  violins tremolo on the voicing an octave up, same continuity rule as the pad.
pizz  beats 1 and 3: the bass, then the fifth above the bass (in the voicing); celli, basses below C2.
ost   violas + celli spiccato in unison, 8ths, chord degrees [1,1,5,1,8,5,1,5] from the bass pitch class in octave 3.
Every level here is a per-note amplitude from the dyn ramp; the mixer calibrates each layer per section.
"""
import numpy as np
from jq2lib import SR, ramp, pan, amp_of_dyn
import vsco

SEAT = {'ViolinEns': -0.35, 'ViolaEns': 0.1, 'CelloEns': 0.3, 'Contrabass': 0.45}


def sect(m, quiet):
    q = '-Quiet' if quiet else ''
    return f'ViolinEnsSusVib{q}' if m >= 62 else f'ViolaEnsSusVib{q}' if m >= 48 else f'CelloEnsSusVib{q}' if m >= 36 else f'ContrabassSusVB{q}'


def seat(name): return next(v for k, v in SEAT.items() if name.startswith(k))


def slot_list(sc, secs, active):
    out = []
    for s in secs:
        for (b, t0, t1, bass, v) in sc.slots(s): out.append(dict(s=s, b=b, t0=t0, t1=t1, bass=bass, v=v, on=active(s, b)))
    return out


def held(sc, bus, s, t0s, t1s, m, name, cin, cout, xf, rel, gain=1.0):
    """one held string note on [t0s, t1s]: cross-faded in/out (xf, centred on the boundary) or entering (0.3 s fade-in)
    and releasing (rel); the level follows the dyn ramp underneath it"""
    t0 = t0s - (xf / 2 if cin else 0.0); t1 = t1s + (xf / 2 if cout else 0.0); dyn = sc.dyn_at(s, t0s)
    y, on = vsco.note(name, m, vsco.vel_of_dyn(dyn), (t1 - t0) + 0.4, 0.05)       # held past t1: the fades are applied here
    k0 = max(0, on - int(0.02 * SR)) if cin else on
    e = int(round((t1 - t0 + (0.0 if cout else rel)) * SR)); y = y[:, k0:k0 + e].copy(); L = y.shape[1]
    y *= ramp(L, int((xf if cin else 0.3) * SR), True)
    if cout: y *= ramp(L, int(xf * SR), False)
    else: k = int(rel * SR); y[:, L - k:] *= np.linspace(1, 0, k) ** 1.5
    tt = t0 + np.arange(0, L, 2400) / SR                                        # follow the dyn ramp (50 ms grid)
    env = np.array([amp_of_dyn(sc.dyn_at(sec_at(sc, u), u)) for u in tt])
    y *= np.interp(np.arange(L), np.arange(len(env)) * 2400, env) * gain
    bus.add(t0, pan(y, seat(name)))


def sustain(sc, bus, slots, voices, name_of, cyc, xf=0.25, rel=0.6):
    """voices(slot) -> pitches; a pitch present in consecutive active slots is one note (never merged across the loop seam)"""
    n = len(slots)
    for i, sl in enumerate(slots):
        if not sl['on']: continue
        P = slots[i - 1] if (i > 0 or cyc) else None; cin = P is not None and P['on']
        pv = set(voices(P)) if (cin and i > 0) else set()
        for m in voices(sl):
            if m in pv: continue
            j = i
            while j + 1 < n and slots[j + 1]['on'] and m in voices(slots[j + 1]): j += 1
            Q = slots[(j + 1) % n] if (j + 1 < n or cyc) else None; cout = Q is not None and Q['on']
            held(sc, bus, sl['s'], sl['t0'], slots[j]['t1'], m, name_of(m, sc.dyn_at(sl['s'], sl['t0'])), cin, cout, xf, rel)


def sec_at(sc, t): return sc.sec_of_bar(max(1, int(t // sc.BAR) + 1)) if t < sc.S['bars'] * sc.BAR else sc.secs[-1]


def pad(sc, secs, cyc, bus):
    sl = slot_list(sc, secs, lambda s, b: 'pad' in s['layers'])
    sustain(sc, bus, sl, lambda x: [m + 12 * x['s'].get('padOct', 0) for m in x['v']], lambda m, d: sect(m, d <= 4), cyc)


def fifth(x):
    f = [m for m in x['v'] if (m - x['bass']) % 12 == 7]; return min(f) if f else None


def drone(sc, secs, cyc, bus):
    sl = slot_list(sc, secs, lambda s, b: 'drone' in s['layers'])
    sustain(sc, bus, sl, lambda x: [x['bass']] + ([fifth(x)] if fifth(x) else []), lambda m, d: sect(min(m, 47), True), cyc)


def trem(sc, secs, cyc, bus):
    on = lambda s, b: 'trem' in s['layers'] or b in s.get('extra', {}).get('trem', [])
    sl = slot_list(sc, secs, on)
    sustain(sc, bus, sl, lambda x: [m + 12 for m in x['v']], lambda m, d: 'ViolinEnsTrem', cyc, xf=0.25, rel=0.4)


def bass(sc, secs, cyc, bus):
    sl = slot_list(sc, secs, lambda s, b: 'bass' in s['layers']); n = len(sl)
    for i, x in enumerate(sl):
        if not x['on']: continue
        P = sl[i - 1] if (i > 0 or cyc) else None; Q = sl[(i + 1) % n] if (i + 1 < n or cyc) else None
        cin, cout = P is not None and P['on'], Q is not None and Q['on']
        dyn = sc.dyn_at(x['s'], x['t0']); q = dyn <= 4
        parts = ([(sect(x['bass'], q), x['bass'])] if x['bass'] >= 36 else []) + [(sect(20, q), x['bass'] - 12 if x['bass'] >= 40 else x['bass'])]
        for name, m in parts: held(sc, bus, x['s'], x['t0'], x['t1'], m, name, cin, cout, 0.2, 0.5)


def chord_at(sc, s, t):                    # the chord slot sounding at score time t inside section s
    return next(x for x in reversed(sc.slots(s)) if x[1] <= t + 1e-9)


def short(bus, name, m, vel, t, a, p):     # a short articulation, its onset on the grid (moved earlier by <= 40 ms)
    y, on = vsco.note(name, m, vel, 0.25, short=True); sh = min(on, int(0.04 * SR))
    bus.add(t - sh / SR, pan(y * a, p))


def pizz(sc, secs, cyc, bus):
    for s in secs:
        if 'pizz' not in s['layers']: continue
        for k in range(s['nb']):
            for bt in (0, 2):
                t = s['t0'] + (4 * k + bt) * sc.BEAT; _, _, _, b, v = chord_at(sc, s, t); m = b
                if bt == 2 and any((u - b) % 12 == 7 for u in v): m = b + 7
                d = sc.dyn_at(s, t); name = 'CelloEnsPizz' if m >= 36 else 'ContrabassPizz'
                short(bus, name, m, vsco.vel_of_dyn(d), t, amp_of_dyn(d) * (1.0 if bt == 0 else 0.9), seat(name))


def ost(sc, secs, cyc, bus):
    PAT = [0, 0, 7, 0, 12, 7, 0, 7]                                     # chord degrees 1 1 5 1 8 5 1 5 from the bass
    for s in secs:
        if 'ost' not in s['layers']: continue
        for k in range(s['nb']):
            for e in range(8):
                t = s['t0'] + (4 * k + e / 2) * sc.BEAT; _, _, _, b, v = chord_at(sc, s, t); r = 48 + (b % 12)
                d = sc.dyn_at(s, t); a = amp_of_dyn(d) * (0.86 if e % 2 else 1.0)
                for name in ('ViolaEnsSpic', 'CelloEnsSpic'): short(bus, name, r + PAT[e], vsco.vel_of_dyn(d), t, a, seat(name))
