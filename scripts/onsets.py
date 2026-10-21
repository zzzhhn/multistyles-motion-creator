"""Rough onset strength + tempo estimate from a video's audio (numpy only).
usage: python3 onsets.py <video>"""
import subprocess, sys
import numpy as np
sr = 22050
raw = subprocess.run(["ffmpeg", "-v", "error", "-i", sys.argv[1], "-ac", "1", "-ar", str(sr), "-f", "f32le", "-"], capture_output=True, check=True).stdout
x = np.frombuffer(raw, np.float32)
hop, n = 512, 2048
frames = np.lib.stride_tricks.sliding_window_view(x, n)[::hop] * np.hanning(n)
S = np.log1p(np.abs(np.fft.rfft(frames, axis=1)))
flux = np.maximum(0, np.diff(S, axis=0)).sum(axis=1)
flux = (flux - flux.mean()) / (flux.std() + 1e-9)
fps = sr / hop
ac = np.correlate(flux, flux, "full")[len(flux) - 1:]
lo, hi = int(fps * 60 / 180), int(fps * 60 / 60)
lag = lo + np.argmax(ac[lo:hi])
print(f"{sys.argv[1].split('/')[-1]}: {len(x)/sr:.1f}s, tempo ~{60*fps/lag:.1f} BPM (or x2 / /2)")
