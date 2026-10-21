"""Tile JPEG stills into one sheet. usage: python3 tools/tile.py out.jpg cols width_each img1 img2 ..."""
import subprocess, sys
out, cols, w, imgs = sys.argv[1], int(sys.argv[2]), int(sys.argv[3]), sys.argv[4:]
args = []
for f in imgs: args += ["-i", f]
n = len(imgs); h = round(w * 9 / 16)
pre = "".join(f"[{i}:v]scale={w}:{h}[s{i}];" for i in range(n))
lay = "|".join(f"{(i % cols) * w}_{(i // cols) * h}" for i in range(n))
subprocess.run(["ffmpeg", "-v", "error", "-y", *args, "-filter_complex", pre + "".join(f"[s{i}]" for i in range(n)) + f"xstack=inputs={n}:layout={lay}:fill=black[v]", "-map", "[v]", out], check=True)
print(out)
