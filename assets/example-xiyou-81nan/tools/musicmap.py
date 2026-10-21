"""Structure map of a soundtrack: energy arc, novelty (section changes), chroma repetition, key centre over time.
usage: python3 tools/musicmap.py <video> <out.png-prefix>"""
import subprocess, sys
import numpy as np
src, pre = sys.argv[1], sys.argv[2]
sr = 22050
x = np.frombuffer(subprocess.run(["ffmpeg", "-v", "error", "-i", src, "-ac", "1", "-ar", str(sr), "-f", "f32le", "-"], capture_output=True, check=True).stdout, np.float32)
hop, n = 2048, 8192
fr = np.lib.stride_tricks.sliding_window_view(x, n)[::hop] * np.hanning(n)
S = np.abs(np.fft.rfft(fr, axis=1)); freqs = np.fft.rfftfreq(n, 1 / sr); fps = sr / hop
rms = np.sqrt((fr ** 2).mean(axis=1)); db = 20 * np.log10(rms + 1e-9)
# chroma
ch = np.zeros((len(S), 12)); m = (freqs > 60) & (freqs < 4000)
pc = np.round(12 * np.log2(freqs[m] / 440.0)).astype(int) % 12
for k in range(12): ch[:, k] = S[:, m][:, pc == k].sum(axis=1)
ch = ch / (ch.sum(axis=1, keepdims=True) + 1e-9)
# per-second summaries
sec = int(len(S) / fps)
def per_sec(a): return np.array([a[int(i * fps):int((i + 1) * fps)].mean(axis=0) for i in range(sec)])
cs, dbs = per_sec(ch), per_sec(db)
cent = per_sec((S * freqs).sum(axis=1) / (S.sum(axis=1) + 1e-9))
# key estimate per 8 s window (Krumhansl minor/major profiles)
maj = np.array([6.35, 2.23, 3.48, 2.33, 4.38, 4.09, 2.52, 5.19, 2.39, 3.66, 2.29, 2.88]); mnr = np.array([6.33, 2.68, 3.52, 5.38, 2.6, 3.53, 2.54, 4.75, 3.98, 2.69, 3.34, 3.17])
names = "C C# D Eb E F F# G Ab A Bb B".split()
keys = []
for i in range(0, sec, 8):
    v = cs[i:i + 8].mean(axis=0); best = max(((np.corrcoef(v, np.roll(p, k))[0, 1], names[(9 + k) % 12] + (" maj" if p is maj else " min")) for p in (maj, mnr) for k in range(12)))   # chroma bin 0 is A, not C
    keys.append(f"{i:>3}s {best[1]}")
# self-similarity of chroma (1 s), and repetition period
cn = cs / (np.linalg.norm(cs, axis=1, keepdims=True) + 1e-9); ssm = cn @ cn.T
lagsim = [np.mean(np.diag(ssm, L)) for L in range(1, min(60, sec - 1))]
# novelty: chroma change between 4 s windows
nov = [1 - float(cn[max(0, i - 4):i].mean(0) @ cn[i:i + 4].mean(0) / (np.linalg.norm(cn[max(0, i - 4):i].mean(0)) * np.linalg.norm(cn[i:i + 4].mean(0)) + 1e-9)) if i >= 4 else 0 for i in range(sec - 4)]
peaks = [i for i in range(1, len(nov) - 1) if nov[i] > nov[i - 1] and nov[i] >= nov[i + 1] and nov[i] > np.percentile(nov, 85)]
print(f"{src.split('/')[-1]}: {sec}s")
print("loudness arc (dB per 10 s):", " ".join(f"{dbs[i:i+10].mean():.0f}" for i in range(0, sec, 10)))
print("brightness arc (centroid Hz per 10 s):", " ".join(f"{cent[i:i+10].mean():.0f}" for i in range(0, sec, 10)))
print("key windows:", " | ".join(keys))
print("chroma self-similarity by lag (1..20 s):", " ".join(f"{v:.2f}" for v in lagsim[:20]))
print("section-change candidates (s):", peaks)
try:
    import matplotlib; matplotlib.use("Agg"); import matplotlib.pyplot as plt
    fig, ax = plt.subplots(3, 1, figsize=(16, 9), gridspec_kw={"height_ratios": [1, 2, 3]})
    ax[0].plot(dbs); ax[0].set_ylabel("dB"); ax[1].imshow(cs.T, aspect="auto", origin="lower", cmap="magma"); ax[1].set_yticks(range(12)); ax[1].set_yticklabels(names)
    ax[2].imshow(ssm, cmap="viridis", origin="lower"); fig.tight_layout(); fig.savefig(pre + "_map.png", dpi=80); print("plot", pre + "_map.png")
except Exception as e: print("no plot:", e)
