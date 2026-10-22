"""Measure the sounding pitch, length and level of every Chinese-instrument sample render-score2 uses.
Usage: <venv>/bin/python -I tools/jq2/probe_samples.py   -> writes tools/jq2/tuning.json (read by render_jq2.py)
Pitch: median YIN f0 over the stable part (0.35 s .. min(len - 0.4, 3.0) s; plucks 0.2 .. 1.0 s), voiced frames only,
as a fractional MIDI number. The renderer shifts every note by (target - measured) semitones, so the per-note corrections
in samples-cn/REPORT.md (dizi about +40 c, xiao C#5 file = C5 +49 c, erhu file octave +1, Dan Tranh file octave -1) are
applied from this file, never guessed. Read-only on the sample folders.
"""
import json, os, re, sys
import numpy as np, soundfile as sf, librosa

AT = os.environ.get('AUDIO_TOOLS') or os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', '..', '_audio-tools'))   # sample libraries and the venv; default: next to the project
CN = os.path.join(AT, 'samples-cn')
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'tuning.json')
NAMES = {'c': 0, 'db': 1, 'd': 2, 'eb': 3, 'e': 4, 'f': 5, 'gb': 6, 'g': 7, 'ab': 8, 'a': 9, 'bb': 10, 'b': 11}
PCS = {'C': 0, 'C#': 1, 'D': 2, 'D#': 3, 'E': 4, 'F': 5, 'F#': 6, 'G': 7, 'G#': 8, 'A': 9, 'A#': 10, 'B': 11}
nm = lambda p, o: 12 * (o + 1) + p


def sets():
    d = f'{CN}/mdm-dizi/extracted/MDM Dizi v1.1/samples'
    for f in sorted(os.listdir(d)):
        m = re.match(r'\[Pitch ([A-G]#?)(\d)\]', f)
        if m: yield 'dizi', f'{d}/{f}', nm(PCS[m[1]], int(m[2])), 'sus'
    e = f'{CN}/aliexpress-erhu/extracted/aliexpress-erhu-HEAD/Samples'
    for art in ('sus', 'stac'):
        for f in sorted(os.listdir(f'{e}/{art}')):
            m = re.match(r'erhu_([a-g]b?)(\d)_' + art + r'_rr(\d)\.wav', f)
            if m: yield 'erhu_' + art, f'{e}/{art}/{f}', nm(NAMES[m[1]], int(m[2]) - 1), art   # file octave is one too high
    x = f'{CN}/oga-beixiao-cc0/extracted/wav'
    for f in sorted(os.listdir(x)):
        m = re.search(r' ([A-G]#?)(\d) 1\.wav$', f)
        if m: yield 'xiao', f'{x}/{f}', nm(PCS[m[1]], int(m[2])), 'sus'
    z = f'{CN}/vcsl-cc0/Chordophones/Zithers/Dan Tranh'
    for sub, art in (('Normal', 'pluck'), ('Tremolo', 'trem')):
        for f in sorted(os.listdir(f'{z}/{sub}')):
            m = re.match(r'([A-Ga-g]#?)(\d)_(mf|f|ff|Trem)_1\.wav', f)
            if m: yield 'zheng_' + (m[3].lower() if art == 'pluck' else 'trem'), f'{z}/{sub}/{f}', nm(PCS[m[1].upper()], int(m[2]) + 1), art   # file octave one too low


def measure(path, nominal, art):
    x, sr = sf.read(path, always_2d=True, dtype='float64'); mono = x.mean(1); n = len(mono)
    a, b = (0.2, 1.0) if art == 'pluck' else (0.12, 0.6) if art == 'stac' else (0.35, min(n / sr - 0.4, 3.0))
    seg = mono[int(a * sr):int(b * sr)]
    f0 = librosa.midi_to_hz(nominal); lo, hi = f0 / 1.5, f0 * 1.5
    f = librosa.yin(seg, fmin=lo, fmax=hi, sr=sr, frame_length=4096, hop_length=256)   # continuous (parabolic) estimate
    mm = librosa.hz_to_midi(f[np.isfinite(f)]); mm = mm[np.abs(mm - np.median(mm)) < 0.5] if len(mm) else mm   # drop octave/attack outliers
    mid = float(np.median(mm)) if len(mm) > 3 else None
    spread = float(np.percentile(mm, 90) - np.percentile(mm, 10)) * 100 if len(mm) > 3 else None
    env = np.abs(mono); on = int(np.argmax(env > 0.1 * env.max()))
    rms = float(np.sqrt(np.mean(seg ** 2))) if len(seg) else 0.0
    w = int(0.05 * sr); ev = np.sqrt(np.convolve(mono ** 2, np.ones(w) / w, 'same') + 1e-20)    # 50 ms RMS envelope
    ref = np.median(ev[int(a * sr):int(b * sr)]) if b > a else ev.max(); ok = np.nonzero(ev >= ref * 0.5)[0]
    sus_end = float(ok[-1] / sr) if len(ok) else n / sr                                           # last time within -6 dB of the held level
    return {'sus_end': round(sus_end, 3), 'file': os.path.relpath(path, CN), 'nominal': nominal, 'midi': None if mid is None else round(mid, 3), 'p10p90_cents': None if spread is None else round(spread, 1),
            'sr': sr, 'ch': x.shape[1], 'len': round(n / sr, 3), 'onset': round(on / sr, 4), 'rms': round(rms, 6), 'peak': round(float(np.abs(x).max()), 4)}


res = {}
for inst, path, nominal, art in sets():
    r = measure(path, nominal, art); res.setdefault(inst, []).append(r)
    dev = None if r['midi'] is None else round((r['midi'] - nominal) * 100)
    print(f"{inst:12s} {os.path.basename(path)[:34]:34s} nominal {nominal} measured {r['midi']} ({dev:+} c) spread {r['p10p90_cents']} len {r['len']}" if dev is not None else f'{inst} {path} UNVOICED')
json.dump(res, open(OUT, 'w'), indent=1)
print('wrote', OUT)
