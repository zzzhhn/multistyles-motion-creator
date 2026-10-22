"""Film jump scan: decode a film at 64x36 grayscale and report frame-to-frame differences, grouped by where they happen.
usage: <python with numpy> -I scan.py <film.mp4> [--t0 10.667] [--unit 8] [--n 24] [--before 0.45] [--after 0.85] [--fps 60]
  --t0: start of unit 1 (seconds); --unit: unit length; --n: number of units; --before/--after: transition window
  around each unit boundary (the boundary of unit k is t0 + (k-1)*unit, plus the end of the last unit).
Groups: 'end' = the last 0.15 s of each transition window (a snap at the end of a transition shows here; it should look
like the 'in' values or lower), 'in' = inside transition windows, 'out' = everything else (look at the biggest ones:
they are either designed flashes or bugs). Prints the 6 largest per group. Designed in the 二十四节气 film, where the
end-of-transition maximum fell from 15.5 to 4.6 after the fix.
"""
import argparse, subprocess
import numpy as np

ap = argparse.ArgumentParser()
ap.add_argument('film'); ap.add_argument('--t0', type=float, default=32 / 3); ap.add_argument('--unit', type=float, default=8.0)
ap.add_argument('--n', type=int, default=24); ap.add_argument('--before', type=float, default=0.45); ap.add_argument('--after', type=float, default=0.85)
ap.add_argument('--fps', type=float, default=60.0)
a = ap.parse_args()
raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', a.film, '-vf', 'scale=64:36,format=gray', '-f', 'rawvideo', '-'], capture_output=True, check=True).stdout
f = np.frombuffer(raw, np.uint8).reshape(-1, 36, 64).astype(np.float32)
d = np.abs(np.diff(f, axis=0)).mean(axis=(1, 2))                     # d[i] = change from frame i to frame i + 1
t = (np.arange(len(d)) + 1) / a.fps
bounds = [a.t0 + k * a.unit for k in range(a.n + 1)]
if a.t0 <= 1e-6: bounds = bounds[1:]                                   # a loop cut has no boundary at 0 (it wraps instead)
def where(x):
    for b in bounds:
        if b + a.after - 0.15 <= x <= b + a.after + 0.05: return 'end'
        if b - a.before <= x < b + a.after - 0.15: return 'in'
    return 'out'
groups = {'end': [], 'in': [], 'out': []}
for x, v in zip(t, d): groups[where(x)].append((float(v), float(x)))
print(f'{a.film}: {len(f)} frames, median diff {np.median(d):.2f}, p99 {np.percentile(d, 99):.2f}, max {d.max():.2f}')
for k in ('end', 'in', 'out'):
    top = sorted(groups[k], reverse=True)[:6]
    print(f'  {k:>3}: ' + '  '.join(f'{x:7.2f}s {v:5.2f}' for v, x in top))
