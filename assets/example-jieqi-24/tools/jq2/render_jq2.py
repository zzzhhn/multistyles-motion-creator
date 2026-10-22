"""render_jq2.py: render the v2 score (artlock/score-jq2.js, exported by score2json.cjs) with real samples into dry stems.
Usage: <venv>/bin/python -I tools/jq2/render_jq2.py <score.json> <outdir> full|loop
full = bars 1-81 from 0 s (216 s); loop = bars 5-76 from 0 s (192 s), cyclic: every tail that runs past the end wraps onto
the start, and the lines / layers treat bar 76 as the bar before bar 5. Writes <outdir>/<bus>.L.f32 / .R.f32 (float32 LE,
48 kHz, film length) for every bus, and meta.json (sections, roles, solo notes, accents, stats) for mix_jq2.cjs and
verify_jq2.py. One bus group in memory at a time. Deterministic (no randomness; round-robins by counters).
"""
import json, os, sys, time
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import numpy as np
from jq2lib import SR, Score, Bank, Bus, lufs_of_dyn
import voices, layers, layers2, oneshots, vsco

ROLE = {'solo': 0, 'double': -4, 'counter': -3, 'pad': -5, 'trem': -5, 'drone': -8, 'bass': -7, 'pizz': -8, 'ost': -6,
        'zarp': -3, 'zrun': -3, 'bells': -11, 'glints': -13, 'wood': -13, 'drum': -8}
SHOTS = ['gong', 'timp', 'swell', 'accent']
SEND = {'solo': 0.2, 'double': 0.3, 'counter': 0.28, 'pad': 0.5, 'trem': 0.45, 'drone': 0.5, 'bass': 0.3, 'pizz': 0.4, 'ost': 0.32,
        'zarp': 0.4, 'zrun': 0.45, 'bells': 0.55, 'glints': 0.6, 'wood': 0.3, 'drum': 0.28, 'gong': 0.45, 'timp': 0.35, 'swell': 0.45, 'accent': 0.5}
LAYER_BUS = {'zhengArp': 'zarp'}


def active(s):                            # buses a section declares (the mixer calibrates only these)
    x = s.get('extra', {}); out = {'solo'}
    if len(s['lead']) > 1: out.add('double')
    if s.get('counter'): out.add('counter')
    out |= {LAYER_BUS.get(l, l) for l in s['layers']}
    for k, b in (('trem', 'trem'), ('wood', 'wood'), ('drum', 'drum'), ('zhengRun', 'zrun')):
        if x.get(k): out.add(b)
    return sorted(out)


def main(score, outdir, mode):
    t_start = time.time(); sc = Score(score); bank = Bank(); os.makedirs(outdir, exist_ok=True)
    if mode == 'full': secs, off, cyc = sc.secs, 0.0, False; N = int(round(sc.S['bars'] * sc.BAR * SR))
    else:
        a, b = sc.S['loopBars']; secs = [s for s in sc.secs if a <= s['at'] and s['at'] + s['nb'] - 1 <= b]; off, cyc = sc.bar_t(a), True
        N = int(round((b - a + 1) * sc.BAR * SR))
    period = N / SR; stats = {}
    groups = [(['solo', 'double', 'counter'], lambda B: [voices.render(n, sc, bank, B) for n in voices.plan(sc, secs, cyc, period)]),
              (['pad'], lambda B: layers.pad(sc, secs, cyc, B['pad'])), (['drone'], lambda B: layers.drone(sc, secs, cyc, B['drone'])),
              (['bass'], lambda B: layers.bass(sc, secs, cyc, B['bass'])), (['trem'], lambda B: layers.trem(sc, secs, cyc, B['trem'])),
              (['pizz'], lambda B: layers.pizz(sc, secs, cyc, B['pizz'])), (['ost'], lambda B: layers.ost(sc, secs, cyc, B['ost'])),
              (['zarp'], lambda B: layers2.zarp(sc, secs, bank, B['zarp'])), (['zrun'], lambda B: layers2.zrun(sc, secs, bank, B['zrun'])),
              (['bells'], lambda B: layers2.bells(sc, secs, B['bells'])), (['glints'], lambda B: layers2.glints(sc, secs, B['glints'])),
              (['wood'], lambda B: layers2.pattern(sc, secs, B['wood'], 'wood', [(1.5, layers2.wood_hit), (3.5, layers2.wood_hit)])),
              (['drum'], lambda B: layers2.pattern(sc, secs, B['drum'], 'drum', [(0, layers2.drum_hit), (1.5, layers2.drum_hit), (2, layers2.drum_hit)])),
              (['gong', 'timp', 'swell'], lambda B: oneshots.oneshots(sc, secs, B)), (['accent'], lambda B: oneshots.accents(sc, secs, B))]
    for names, fn in groups:
        t0 = time.time(); B = {k: Bus(N, cyc, off) for k in names}; fn(B)
        for k, bus in B.items():
            for c, ch in ((0, 'L'), (1, 'R')): bus.a[c].astype('<f4').tofile(os.path.join(outdir, f'{k}.{ch}.f32'))
            stats[k] = {'peak': round(float(np.abs(bus.a).max()), 4), 'rms': round(float(np.sqrt((bus.a.astype(np.float64) ** 2).mean())), 6)}
        print(f'  {mode} {",".join(names):18s} {time.time() - t0:6.1f} s  peak {[stats[k]["peak"] for k in names]}', flush=True)
        del B; bank.clear()
    film = lambda t: round((t - off) % period if cyc else t - off, 4)
    meta = {'mode': mode, 'SR': SR, 'N': N, 'cyc': cyc, 'off': off, 'bar': sc.BAR, 'beat': sc.BEAT, 'roles': ROLE, 'shots': SHOTS, 'send': SEND,
            'buses': list(ROLE) + SHOTS, 'stats': stats, 'renderS': round(time.time() - t_start, 1),
            'sections': [dict(name=s['name'], at=s['at'], nb=s['nb'], t0=film(s['t0']), t1=round(s['t1'] - off, 4), dyn=s['dyn'], lead=s['lead'],
                              gong=s['gong'], mode=s['mode'], tones=sc.S['gong'][s['gong']], active=active(s), bells=s.get('_bells'),
                              target=[lufs_of_dyn(s['dyn'][0]), lufs_of_dyn(s['dyn'][1])]) for s in secs],
            'idioms': voices.IDIOMS, 'bells': {s['name']: s.get('_bells') for s in secs if s.get('_bells')},
            'solo_notes': [dict(n, t=film(n['t'])) for n in voices.SOLO_NOTES],
            'accents': [dict(a, t=film(a['t'])) for a in oneshots.ACCENTS]}
    json.dump(meta, open(os.path.join(outdir, 'meta.json'), 'w'), indent=1, ensure_ascii=False)
    print(f'render_jq2 {mode}: {len(secs)} sections, {len(voices.SOLO_NOTES)} solo notes, {len(oneshots.ACCENTS)} accents, {meta["renderS"]} s')


if __name__ == '__main__':
    main(*sys.argv[1:4])
