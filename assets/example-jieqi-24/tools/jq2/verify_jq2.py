"""verify_jq2.py: the brief's measurements of a render-score2 build. Usage: <venv>/bin/python -I tools/jq2/verify_jq2.py <workdir> <out.json>
1 durations of jq2-full.wav / jq2-loop.wav; integrated LUFS, LRA, true peak (ffmpeg ebur128, peak=true)
2 per section, the solo stem (dry, full render): YIN pitch of every written solo note over its middle (30..85 % of the
  note, >= 80 ms; zheng plucks 130..450 ms, past the slide while the new string dominates the previous one's ring) -> cents error against the score after the per-sample corrections; and a frame-based pitch-class
  histogram of the whole solo stem (energy-gated YIN frames) against the section's five tones
3 accent onsets: the bell attack in the accent stem (largest 2 ms rise of the log 1 ms envelope above 1 kHz, +-60 ms) - impact
4 loop seam: RMS of the last vs first 50 ms / 2 s of jq2-loop.wav, and the sample step across the join vs the median step
"""
import json, os, re, subprocess, sys
import numpy as np, soundfile as sf, librosa
from scipy.signal import butter, sosfilt

W, OUT = sys.argv[1], sys.argv[2]; SR = 48000; FF = os.path.expanduser('~/.local/bin/ffmpeg')
NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']; PCN = {'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11}
pcof = lambda s: (PCN[s[0]] + (1 if s[1:2] == '#' else 0)) % 12
rep = {}


def ebur(f):
    r = subprocess.run([FF, '-nostats', '-hide_banner', '-i', f, '-filter_complex', 'ebur128=peak=true', '-f', 'null', '-'], capture_output=True, text=True).stderr
    s = r[r.rfind('Summary:'):]; g = lambda k: float(re.search(k + r':\s+(-?[\d.]+|-inf)', s).group(1))
    return {'integratedLufs': g('I'), 'lra': g('LRA'), 'truePeakDbtp': g('Peak')}


for m in ('full', 'loop'):
    f = os.path.join(W, f'jq2-{m}.wav'); info = sf.info(f)
    rep[m] = dict(duration=info.frames / info.samplerate, sampleRate=info.samplerate, channels=info.channels, **ebur(f))

meta = json.load(open(os.path.join(W, 'full', 'meta.json')))
solo = np.fromfile(os.path.join(W, 'full', 'solo.L.f32'), '<f4').astype(np.float64) + np.fromfile(os.path.join(W, 'full', 'solo.R.f32'), '<f4')
errs, secrep = [], []
for s in meta['sections']:
    notes = [n for n in meta['solo_notes'] if n['sec'] == s['name']]; e = []
    for n in notes:
        a = n['t'] + 0.3 * n['d']; b = max(a + 0.08, n['t'] + 0.85 * n['d'])
        if n['kind'] in ('zheng_mf', 'zheng_f', 'zheng_ff'): a, b = n['t'] + 0.13, n['t'] + max(0.25, min(0.45, 0.9 * n['d']))   # after the slide, before the ring fades
        seg = solo[int(a * SR):int(b * SR)]
        f0 = librosa.midi_to_hz(n['m']); y = librosa.yin(seg, fmin=f0 / 1.4, fmax=f0 * 1.4, sr=SR, frame_length=2048, hop_length=256)
        mm = librosa.hz_to_midi(y[np.isfinite(y)]); mm = mm[np.abs(mm - np.median(mm)) < 0.5]
        if len(mm): c = float((np.median(mm) - n['m']) * 100); e.append(c); errs.append((abs(c), s['name'], n['t'], n['m'], n['kind'], round(c, 1)))
    seg = solo[int(s['t0'] * SR):int(s['t1'] * SR)]
    y = librosa.yin(seg, fmin=180, fmax=1100, sr=SR, frame_length=2048, hop_length=480)
    rms = librosa.feature.rms(y=seg, frame_length=2048, hop_length=480)[0][:len(y)]
    ok = rms > rms.max() * 10 ** (-30 / 20); pcs = np.round(librosa.hz_to_midi(y[ok])).astype(int) % 12
    h = np.bincount(pcs, minlength=12) / max(1, len(pcs)); tones = {pcof(t) for t in s['tones']}
    secrep.append(dict(section=s['name'], inst=sorted({n['inst'] for n in notes}), notes=len(notes), measured=len(e),
                       centsMedianAbs=round(float(np.median(np.abs(e))), 1) if e else None, centsMaxAbs=round(float(np.max(np.abs(e))), 1) if e else None,
                       inScaleShare=round(float(sum(h[p] for p in tones)), 3), tones=s['tones'],
                       histogram={NAMES[p]: round(float(h[p]), 3) for p in np.argsort(-h)[:6] if h[p] > 0.005}))
allc = [x[0] for x in errs]
rep['solo'] = dict(notes=len(meta['solo_notes']), measured=len(allc), centsMedianAbs=round(float(np.median(allc)), 1), centsMaxAbs=round(float(np.max(allc)), 1),
                   worst=[dict(section=x[1], t=round(x[2], 3), midi=x[3], kind=x[4], cents=x[5]) for x in sorted(errs, reverse=True)[:6]], sections=secrep)

hp = butter(4, 1000, 'highpass', fs=SR, output='sos')
for m in ('full', 'loop'):
    mt = json.load(open(os.path.join(W, m, 'meta.json'))); x = np.fromfile(os.path.join(W, m, 'accent.L.f32'), '<f4') + np.fromfile(os.path.join(W, m, 'accent.R.f32'), '<f4')
    on = []
    for a in mt['accents']:
        i0 = int((a['t'] - 0.2) * SR); seg = sosfilt(hp, x[max(0, i0):int((a['t'] + 0.2) * SR)].astype(np.float64)); k = int(0.002 * SR)
        k = int(0.001 * SR); env = np.log(np.sqrt(np.convolve(seg ** 2, np.ones(k) / k, 'full')[:len(seg)]) + 1e-9)   # causal 1 ms RMS
        lo, hi, g = int(0.14 * SR), int(0.26 * SR), int(0.002 * SR); d = env[lo:hi] - env[lo - g:hi - g]               # rise over 2 ms
        j = lo + int(np.argmax(d)) - g // 2; on.append(round((j - 0.2 * SR) / SR * 1000, 1))
    rep[m]['accentOnsetMs'] = on; rep[m]['accentMaxAbsMs'] = float(np.max(np.abs(on)))

L, sr = sf.read(os.path.join(W, 'jq2-loop.wav')); L = L.mean(1); rms = lambda v: 20 * np.log10(np.sqrt(np.mean(v ** 2)) + 1e-12)
w, w2 = int(0.05 * SR), int(2 * SR); step = np.abs(np.diff(L)); med = float(np.median(step))
rep['loop']['seam'] = dict(rms50msEnd=round(rms(L[-w:]), 2), rms50msStart=round(rms(L[:w]), 2), jump50msDb=round(rms(L[:w]) - rms(L[-w:]), 2),
                           rms2sEnd=round(rms(L[-w2:]), 2), rms2sStart=round(rms(L[:w2]), 2), jump2sDb=round(rms(L[:w2]) - rms(L[-w2:]), 2),
                           stepAcrossJoin=round(float(abs(L[0] - L[-1])), 5), medianStep=round(med, 5), p99Step=round(float(np.percentile(step, 99)), 5))
json.dump(rep, open(OUT, 'w'), indent=1, ensure_ascii=False)
print(json.dumps({k: {q: v for q, v in rep[k].items() if q not in ('sections', 'accentOnsetMs', 'worst')} for k in rep}, ensure_ascii=False, indent=1))
