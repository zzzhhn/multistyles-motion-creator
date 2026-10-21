#!/usr/bin/env python3
"""Read an X (Twitter) post through the public fxtwitter API and optionally download its videos.

WebFetch on x.com returns HTTP 402; api.fxtwitter.com returns the post text, author, metrics, X Article blocks and direct
mp4 variants. Only GET requests to api.fxtwitter.com and video.twimg.com / pbs.twimg.com are made.

usage:
  python3 fetch_x.py <post url or id> [--download DIR] [--json OUT.json]
examples:
  python3 fetch_x.py https://x.com/chetaslua/status/2105757136219504862
  python3 fetch_x.py 2105757136219504862 --download refs/cases --json refs/cases/chetaslua.json
"""
import json, os, re, sys, urllib.request

UA = {"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)"}


def get(url, timeout=60):
    with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=timeout) as r:
        return r.read()


def main():
    args = sys.argv[1:]
    if not args or args[0] in ("-h", "--help"):
        print(__doc__); return 2
    m = re.search(r"(\d{8,})", args[0])
    if not m:
        print("cannot find a post id in", args[0]); return 2
    pid = m.group(1)
    dl = args[args.index("--download") + 1] if "--download" in args else None
    js = args[args.index("--json") + 1] if "--json" in args else None
    d = json.loads(get(f"https://api.fxtwitter.com/status/{pid}"))
    t = d.get("tweet") or {}
    if not t:
        print("no post:", d.get("message")); return 1
    a = t.get("author") or {}
    print(f"@{a.get('screen_name')} · {t.get('created_at')} · likes {t.get('likes')} · views {t.get('views')}")
    print(t.get("text") or "")
    art = t.get("article")
    if art:
        print(f"[X Article] {art.get('title')}\n{art.get('preview_text')}")
    q = t.get("quote")
    if q:
        print(f"[quote @{(q.get('author') or {}).get('screen_name')}] {q.get('text')}")
    vids = []
    for src in [t] + ([q] if q else []):
        for mm in ((src.get("media") or {}).get("all") or []):
            if mm.get("type") != "video":
                print("media", mm.get("type"), mm.get("url")); continue
            fm = [f for f in (mm.get("formats") or mm.get("variants") or []) if "mp4" in (f.get("container", "") + f.get("content_type", "") + f.get("url", ""))]
            best = max(fm, key=lambda f: f.get("bitrate", f.get("bit_rate", 0)) or 0) if fm else {"url": mm.get("url")}
            vids.append(best.get("url"))
            print("video", mm.get("width"), "x", mm.get("height"), f"{mm.get('duration')} s", best.get("url"))
    if js:
        os.makedirs(os.path.dirname(os.path.abspath(js)), exist_ok=True)
        with open(js, "w", encoding="utf-8") as f:
            json.dump(d, f, ensure_ascii=False, indent=1)
        print("saved", js)
    if dl:
        os.makedirs(dl, exist_ok=True)
        for i, u in enumerate(vids):
            out = os.path.join(dl, f"{a.get('screen_name', 'x')}-{pid}{'-' + str(i + 1) if len(vids) > 1 else ''}.mp4")
            with urllib.request.urlopen(urllib.request.Request(u, headers=UA), timeout=600) as r, open(out, "wb") as f:
                while True:
                    b = r.read(1 << 20)
                    if not b: break
                    f.write(b)
            print("downloaded", out, os.path.getsize(out), "bytes")
    return 0


if __name__ == "__main__":
    sys.exit(main())
