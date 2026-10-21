"""Per-frame gray difference of a video (192x108), for finding segment cuts.
usage: python3 framediff.py <video> <fps> <out.npy>"""
import subprocess, sys
import numpy as np
src, fps, out = sys.argv[1], float(sys.argv[2]), sys.argv[3]
W, H = 192, 108
cmd = ["ffmpeg", "-v", "error", "-i", src, "-vf", f"fps={fps},scale={W}:{H},format=gray", "-f", "rawvideo", "-"]
raw = subprocess.run(cmd, capture_output=True, check=True).stdout
fr = np.frombuffer(raw, np.uint8).reshape(-1, H, W).astype(np.float32)
d = np.abs(np.diff(fr, axis=0)).mean(axis=(1, 2))
np.save(out, d)
print(f"{src}: {len(fr)} frames @ {fps} fps, diff mean {d.mean():.2f}, p95 {np.percentile(d,95):.2f}, max {d.max():.2f}")
