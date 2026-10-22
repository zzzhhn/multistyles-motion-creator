"""voices: the written lines (lead, the doubling lead, the counter line) with the brief's idioms and nothing else.
dizi  legato (crossfade into the next sample past its attack); tongued at phrase starts and repeated pitches; breath (a
      release) at rests; 倚音: the next pentatonic tone above, <= 70 ms, taken from the previous note's time, on notes
      >= 2 beats that begin a phrase; vibrato (12 c, 5.2 Hz, faded in) only on notes >= 2 beats, after 0.3 s.
erhu  sustain samples legato; notes < 0.75 beat staccato samples; 滑音 80-150 ms into legato notes approached by >= 3
      semitones; no added vibrato. Notes longer than one sample continue on the other take (a bow change, 0.2 s).
xiao  sustain samples, 0.12 s soft attack, 0.45 s release, no ornaments.
zheng every note plucked (mf / f / ff from dyn); notes >= 1.5 beats on the 摇指 tremolo samples; 按滑音 from a whole tone
      below, 80-120 ms, into notes approached by >= 3 semitones; a string rings 0.25 s past its written length.
violins VSCO violin section SusVib, legato by overlapping 0.1 s crossfades past the attack.
Phrase starts: a section's first note, a note after a rest, a note on a term's first downbeat (the score: one phrase per term).
"""
import numpy as np
from jq2lib import SR, play, ramp, pan, amp_of_dyn
import vsco

PAN = {('solo', 'any'): 0.0, ('double', 'violins'): -0.3, ('double', 'dizi'): 0.15, ('double', 'zheng'): -0.25, ('counter', 'dizi'): 0.3}
SOLO_NOTES, IDIOMS = [], {}
count = lambda k: IDIOMS.__setitem__(k, IDIOMS.get(k, 0) + 1)


def plan(sc, secs, cyc, period):
    """every written note of every line, in play order, with its idiom flags"""
    out = []
    for s in secs:
        lines = [(s['lead'][0], 'solo', s['mel'])] + ([(s['lead'][1], 'double', s['mel'])] if len(s['lead']) > 1 else [])
        if s.get('counter'): lines.append((s['counterLead'], 'counter', s['counter']))
        for inst, bus, key in lines:
            tr = -12 if inst.endswith('8vb') else 0; inst = inst.replace('8vb', '')
            L = sc.line(s, 'counter' if bus == 'counter' else 'mel'); prev = None
            for i, (t, d, m, beats, x) in enumerate(L):
                if m is None: prev = None; continue
                b = s['at'] + int(x // 4); term0 = abs(x % 4) < 1e-9 and 5 <= b <= 76 and (b - 5) % 3 == 0
                ps = prev is None or term0
                nx = L[i + 1] if i + 1 < len(L) else None
                n = dict(t=t, d=d, m=m + tr, beats=beats, s=s, inst=inst, bus=bus, ps=ps, prev=None if ps else prev, cut=0.0,
                         grace=sc.above(s, m) + tr if (inst == 'dizi' and ps and beats >= 2) else None, nxt='end')
                if nx is not None:
                    nps = nx[2] is not None and abs(nx[4] % 4) < 1e-9 and (s['at'] + int(nx[4] // 4) - 5) % 3 == 0 and 5 <= s['at'] + int(nx[4] // 4) <= 76
                    n['nxt'] = 'rest' if nx[2] is None else 'tongue' if (nps or nx[2] + tr == m + tr) else 'legato'
                    n['next_t'] = nx[0]
                out.append(n); prev = m + tr
    for n in out:                         # the 倚音 takes its time from whatever the same instrument plays just before
        if n['grace'] is None: continue
        g0 = n['t'] - 0.07
        for p in out:
            if p is n or p['inst'] != n['inst']: continue
            w = period if cyc and p['t'] > n['t'] else 0.0; e = p['t'] + p['d'] - w      # the loop: bar 76 runs into bar 5
            if abs(e - n['t']) < 1e-6: p['cut'] = max(p['cut'], 0.08); p['nxt'] = 'tongue'; p['next_t'] = n['t'] + w
    return out


def _stream(bank, inst, r, pos0, n, semis):
    """play sample r from pos0 for n samples; if it runs out, continue on the other take (bow change, 0.2 s crossfade)"""
    x, sr = bank.load(r['file']); avail = int((r['sus_end'] - 0.05) * sr - pos0); need = int(n * sr / SR * 1.03) + 8
    if avail >= need or inst != 'erhu_sus': return play(x, sr, pos0, n, semis)
    k = min(max(int(0.5 * SR), int(avail * SR / sr) - int(0.2 * SR)), n - int(0.2 * SR) - 1); y = np.zeros((2, n)); sv = np.broadcast_to(np.asarray(semis, float), (n,))
    y[:, :k + int(0.2 * SR)] = play(x, sr, pos0, k + int(0.2 * SR), sv[:k + int(0.2 * SR)]) * ramp(k + int(0.2 * SR), int(0.2 * SR), False)
    r2 = bank.pick(inst, r['nominal']); r2 = r2 if r2['file'] != r['file'] else bank.pick(inst, r['nominal'])
    rest = _stream(bank, inst, r2, (r2['onset'] + 0.3) * bank.load(r2['file'])[1], n - k, sv[k:] + (r['midi'] - r2['midi']))
    y[:, k:] += rest * ramp(n - k, int(0.2 * SR), True); return y


def render(n, sc, bank, buses):
    s, inst, t, d = n['s'], n['inst'], n['t'], n['d']
    dyn = sc.dyn_at(s, t); a = amp_of_dyn(dyn); end = t + d - n['cut']
    legato_in = n['prev'] is not None and n['prev'] != n['m'] and inst in ('dizi', 'erhu', 'violins')
    if inst == 'violins': return _violins(n, sc, buses, dyn, a, legato_in, end)
    if inst == 'erhu' and n['beats'] < 0.75: kind = 'erhu_stac'
    elif inst == 'zheng': kind = 'zheng_trem' if n['beats'] >= 1.5 else 'zheng_' + ('mf' if dyn < 4.5 else 'f' if dyn < 6.5 else 'ff')
    else: kind = 'erhu_sus' if inst == 'erhu' else inst
    if kind == 'erhu_stac': legato_in = False
    r = bank.pick(kind, n['m']); x, sr = bank.load(r['file']); sh = n['m'] - r['midi']; g = a / (r['rms'] + 1e-9)
    if inst == 'zheng' and abs(sh) > 2.5: raise ValueError(f"zheng {n['m']}: nearest sample is {sh:+.2f} st away")
    XF = {'dizi': 0.05, 'erhu': 0.08}.get(inst, 0.0); LEG = {'dizi': 0.25, 'erhu': 0.30}.get(inst, 0.0)
    if n['grace'] is not None:            # 倚音: attack on the grace note, legato into the main note
        rg = bank.pick('dizi', n['grace']); xg, sg = bank.load(rg['file']); ng = int(0.0975 * SR)   # [t-90 ms, t+7.5 ms]
        yg = play(xg, sg, max(0, rg['onset'] - 0.02) * sg, ng, n['grace'] - rg['midi']) * ramp(ng, int(0.015 * SR), False)
        buses[n['bus']].add(t - 0.07 - 0.02, pan(yg * (a / (rg['rms'] + 1e-9)), PAN.get((n['bus'], inst), 0.0)))
        legato_in, XF, XO = True, 0.015, XF
    else: XO = XF
    if legato_in or (inst == 'erhu' and n['prev'] == n['m']):
        t0, p0, fin = t - XF / 2, (r['onset'] + LEG) * sr, max(XF, 0.06 if n['prev'] == n['m'] else XF)
    else:
        lead = 0.005 if inst == 'zheng' else 0.02
        t0, p0, fin = t - lead, max(0.0, r['onset'] - lead) * sr, 0.12 if inst == 'xiao' else 0.004
    nx = n['nxt']
    if inst == 'zheng': t1, fout = end + 0.25, 0.25
    elif inst == 'xiao': t1, fout = end + (0.45 if nx in ('rest', 'end') else 0.25), 0.004   # release curve below
    elif kind == 'erhu_stac': t1, fout = min(end + 0.25, t0 + r['len'] - r['onset']), 0.1
    elif nx == 'legato': t1, fout = n['next_t'] + XO / 2, XO
    elif nx == 'tongue': t1, fout = min(end, n.get('next_t', end)) - 0.02, 0.04
    else: t1, fout = end + (0.12 if inst == 'dizi' else 0.15), 0.15 if inst == 'dizi' else 0.2
    N = int(round((t1 - t0) * SR)); tau = (np.arange(N) / SR) + (t0 - t); semis = np.full(N, sh)
    if inst == 'dizi' and n['beats'] >= 2:
        dep = 0.12 * np.clip((tau - 0.3) / 0.4, 0, 1); semis += dep * np.sin(2 * np.pi * 5.2 * np.maximum(tau - 0.3, 0))
    iv = 0 if n['prev'] is None else n['m'] - n['prev']
    if abs(iv) >= 3 and ((inst == 'erhu' and legato_in) or inst == 'zheng'):
        S = 0.08 + 0.07 * min(1, (abs(iv) - 3) / 4) if inst == 'erhu' else 0.08 + 0.04 * min(1, (abs(iv) - 3) / 4)
        frm = -iv if inst == 'erhu' else -2.0; u = np.clip((tau - (t0 - t)) / S, 0, 1); semis += frm * (1 - (3 * u * u - 2 * u ** 3))
        n['slide'] = round(S * 1000)
    y = _stream(bank, kind, r, p0, N, semis)
    if kind in ('zheng_mf', 'zheng_f', 'zheng_ff'): y *= 1.4 * a / (np.sqrt((y[:, :int(0.155 * SR)] ** 2).mean()) + 1e-9)   # as layers2.pluck
    else: y *= g
    y *= ramp(N, int(fin * SR), True) * ramp(N, int(fout * SR), False)
    if inst == 'xiao': kr = int(round((t1 - end) * SR)); y[:, N - kr:] *= np.linspace(1, 0, kr) ** 2
    buses[n['bus']].add(t0, pan(y, PAN.get((n['bus'], inst), 0.0)))
    count(f'{inst} notes'); count(f'{inst} {kind}') if kind != inst else None
    if n['grace'] is not None: count(f'{inst} grace (倚音)')
    if n.get('slide'): count(f'{inst} slide')
    if legato_in and n['grace'] is None: count(f'{inst} legato in')
    if inst == 'dizi' and n['beats'] >= 2: count('dizi vibrato')
    if n['bus'] == 'solo': SOLO_NOTES.append(dict(t=t, d=d, m=n['m'], inst=inst, sec=s['name'], kind=kind))


def _violins(n, sc, buses, dyn, a, legato_in, end):
    XF = 0.1; vel = vsco.vel_of_dyn(dyn); nx = n['nxt']
    t1 = n['next_t'] - XF / 2 if nx == 'legato' else (min(end, n.get('next_t', end)) - 0.08 if nx == 'tongue' else end)   # release starts at t1
    rel = XF if nx == 'legato' else 0.05 if nx == 'tongue' else 0.35
    t0 = n['t'] - XF / 2 if legato_in else n['t'] - 0.01
    y, on = vsco.note('ViolinEnsSusVib', n['m'], vel, (t1 - t0) + 0.35, 0.1)       # held past t1; the release is applied here
    k0 = on + int(0.12 * SR) if legato_in else max(0, on - int(0.01 * SR))
    L = int(round((t1 - t0 + rel) * SR)); y = y[:, k0:k0 + L] * a
    y *= ramp(y.shape[1], int(XF * SR), True) if legato_in else 1.0
    y *= ramp(y.shape[1], int(rel * SR), False)
    buses[n['bus']].add(t0, pan(y, PAN.get((n['bus'], 'violins'), 0.0))); count('violins notes'); count('violins legato in') if legato_in else None
    if n['bus'] == 'solo': SOLO_NOTES.append(dict(t=n['t'], d=n['d'], m=n['m'], inst='violins', sec=n['s']['name'], kind='vsco'))
