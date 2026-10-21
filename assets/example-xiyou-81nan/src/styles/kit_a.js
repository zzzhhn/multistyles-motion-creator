// kit_a.js — shared helpers for team A's cells (01 cave … 09 hanstone). Namespace: XY.KIT_A
// Carved, pressed, painted-on-mineral media: lit height fields for the bg, procession layers with relief
// (raised / sunken) edges, masked reveals for "the picture draws itself", glyphs sampled into dots or tiles.
(() => {
  'use strict';
  const XY = window.XY, TAU = XY.TAU;
  const K = XY.KIT_A = {};

  // ------------------------------------------------------------ timing
  K.win = (u, a, b, r = 0.04) => XY.smooth((u - a) / r) * (1 - XY.smooth((u - b) / r));   // 0 → 1 at a, back to 0 at b
  K.hit = (beat, b, len = 0.5) => (beat < b ? 0 : Math.max(0, 1 - (beat - b) / len));        // 1 on beat b, decays over len beats
  K.step = (t, fps) => Math.floor(t * fps);                                                   // integer time for frame-stepped jitter
  // v10: a local push-in on the finished panel (call from style.post). s ≥ 1 about design point (cx, cy); everything —
  // bg, layers, procession — scales together, so nothing drifts. Keep s back at 1 before u ≈ 0.85 so the seam lines up.
  K.zoom = (canvas, g, e, s, cx, cy) => { if (!(s > 1.0005)) return; const sc = XY.scratch('kit-a-zoom', canvas.width, canvas.height); sc.getContext('2d').drawImage(canvas, 0, 0);
    const X = cx * e.S, Y = cy * e.S; g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, canvas.width, canvas.height); g.imageSmoothingQuality = 'high';
    g.drawImage(sc, X - X * s, Y - Y * s, canvas.width * s, canvas.height * s); };
  // a push envelope in beats: eases in over [b0, b1], holds, eases back out by b2; peak = extra scale (0.1–0.2)
  K.push = (beat, b0, b1, b2, peak) => 1 + peak * XY.smooth((beat - b0) / Math.max(1e-3, b1 - b0)) * (1 - XY.smooth((beat - b1 - (b2 - b1) * 0.35) / ((b2 - b1) * 0.65)));

  // ------------------------------------------------------------ pixel textures (bg only)
  // fn(i, j, o) writes o = [r, g, b, a] (0..255) for texel (i, j)
  K.pix = (w, h, fn) => {
    w = Math.max(1, Math.round(w)); h = Math.max(1, Math.round(h));
    const c = XY.mk(w, h), g = c.getContext('2d'), im = g.createImageData(w, h), d = im.data, o = [0, 0, 0, 255];
    for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) { o[3] = 255; fn(i, j, o); const k = (j * w + i) * 4; d[k] = o[0]; d[k + 1] = o[1]; d[k + 2] = o[2]; d[k + 3] = o[3]; }
    g.putImageData(im, 0, 0); return c;
  };
  K.field = (w, h, fn) => { const f = new Float32Array(w * h); for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) f[j * w + i] = fn(i, j); return f; };
  // lambert term of a height field (k = slope gain), light from L (default upper-left); 0.5 ≈ flat
  K.lit = (f, w, h, k = 1, L = [-0.55, -0.62, 0.56]) => {
    const s = new Float32Array(w * h), ll = Math.hypot(L[0], L[1], L[2]), lx = L[0] / ll, ly = L[1] / ll, lz = L[2] / ll, flat = lz;
    for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
      const a = f[j * w + Math.max(0, i - 1)], b = f[j * w + Math.min(w - 1, i + 1)], c = f[Math.max(0, j - 1) * w + i], d = f[Math.min(h - 1, j + 1) * w + i];
      const nx = -(b - a) * k, ny = -(d - c) * k, nl = Math.hypot(nx, ny, 1);
      s[j * w + i] = XY.clamp(0.5 + ((nx * lx + ny * ly + lz) / nl - flat) * 1.4);
    }
    return s;
  };
  K.mixc = (a, b, u) => [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, a[2] + (b[2] - a[2]) * u];
  K.hex = h => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
  K.rgba = (c, a = 1) => `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a})`;
  // sprinkle n specks of colour col in [x0,x0+w]×[y0,y0+h] (design units)
  K.specks = (g, seed, n, x0, y0, w, h, col, r0, r1, a0 = 1, a1 = 1) => {
    const R = XY.rng(seed); g.fillStyle = col;
    for (let i = 0; i < n; i++) { g.globalAlpha = a0 + (a1 - a0) * R(); g.beginPath(); g.arc(x0 + R() * w, y0 + R() * h, r0 + (r1 - r0) * R() * R(), 0, TAU); g.fill(); }
    g.globalAlpha = 1;
  };

  // ------------------------------------------------------------ device-pixel layers
  K.dev = e => [Math.round(e.W * e.S), Math.round(e.H * e.S)];
  K.layer = (key, e) => { const [w, h] = K.dev(e), c = XY.scratch(key, w, h), g = c.getContext('2d'); g.setTransform(e.S, 0, 0, e.S, 0, 0); return [c, g]; };
  K.blit = (g, c, dx = 0, dy = 0, alpha = 1, op = 'source-over') => { g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = alpha; g.globalCompositeOperation = op; g.drawImage(c, dx, dy); g.restore(); };
  K.tint = (key, src, col) => { const c = XY.scratch(key, src.width, src.height), g = c.getContext('2d'); g.drawImage(src, 0, 0); g.globalCompositeOperation = 'source-in'; g.fillStyle = col; g.fillRect(0, 0, c.width, c.height); return c; };
  K.proc = (key, e, pen, acts, dx = 0, dy = 0) => { const [c, g] = K.layer(key, e); XY.drawProcession(g, e.phase, e.procX + dx, e.groundY + dy, pen, acts); return c; };
  // raised relief: lit rim up-left, cast shadow down-right (d in design px)
  K.raised = (g, e, src, d, hi, lo, key) => { const D = d * e.S; if (lo) K.blit(g, K.tint(key + ':lo', src, lo), D, D); if (hi) K.blit(g, K.tint(key + ':hi', src, hi), -D * 0.5, -D * 0.5); K.blit(g, src); };
  // sunken relief / intaglio: shadowed inner band along the up-left edge, lit lip along the down-right edge
  K.sunken = (g, e, src, d, hi, lo, key) => {
    const D = d * e.S; if (hi) K.blit(g, K.tint(key + ':hi', src, hi), D * 0.7, D * 0.7);
    K.blit(g, src);
    if (lo) { const b = XY.scratch(key + ':band', src.width, src.height), bg = b.getContext('2d'); bg.drawImage(src, 0, 0); bg.globalCompositeOperation = 'destination-out'; bg.drawImage(src, D, D);
      bg.globalCompositeOperation = 'source-in'; bg.fillStyle = lo; bg.fillRect(0, 0, b.width, b.height); K.blit(g, b); }
  };
  // keep only the parts of src covered by paint(mg) (mg is in design units)
  K.masked = (key, e, src, paint) => { const [c, g] = K.layer(key, e); paint(g); g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'source-in'; g.drawImage(src, 0, 0); return c; };
  // (who walks in the procession is decided by XY.castAt / acts.cast in rig.js — never hide figures with the pen)
  K.horseIdx = (e, acts) => XY.procParts(e.phase, acts).find(f => f.name === 'monk').parts.findIndex(p => p.role === 'robe');   // parts before this are the horse

  // ------------------------------------------------------------ polylines
  K.len = pts => { let s = 0; for (let k = 2; k < pts.length; k += 2) s += Math.hypot(pts[k] - pts[k - 2], pts[k + 1] - pts[k - 1]); return s; };
  K.partial = (L, f) => {
    f = XY.clamp(f); if (f >= 1) return L; const tot = K.len(L) * f, o = [L[0], L[1]]; let s = 0;
    for (let k = 2; k < L.length; k += 2) { const d = Math.hypot(L[k] - L[k - 2], L[k + 1] - L[k - 1]); if (s + d >= tot) { const r = d ? (tot - s) / d : 0; o.push(XY.lerp(L[k - 2], L[k], r), XY.lerp(L[k - 1], L[k + 1], r)); return o; } s += d; o.push(L[k], L[k + 1]); }
    return o;
  };
  K.stroke = (g, pts, col, w, closed) => { if (pts.length < 4) return; XY.path(g, pts, closed); g.strokeStyle = col; g.lineWidth = w; g.stroke(); };
  // an incised line: light lip offset down-right, dark cut on top
  K.cut = (g, pts, w, cut, lip, d = 1.4) => { if (pts.length < 4) return; if (lip) { g.save(); g.translate(d, d); K.stroke(g, pts, lip, w); g.restore(); } K.stroke(g, pts, cut, w); };

  // ------------------------------------------------------------ glyphs → sample points
  // str drawn in font at px, sampled every `step` design px; returns { pts: [x, y, horiz(0/1), …], w, h } in a box at (0,0)
  const gcache = new Map();
  K.glyphPts = (str, family, px, step, vertical = false, weight = '') => {
    const key = [str, family, px, step, vertical, weight].join('|'); if (gcache.has(key)) return gcache.get(key);
    const n = [...str].length, w = Math.ceil(vertical ? px * 1.1 : px * n * 1.05), h = Math.ceil(vertical ? px * n * 1.05 : px * 1.15), c = XY.mk(w, h), g = c.getContext('2d');
    g.fillStyle = '#000'; g.font = XY.font(px, family, weight); g.textBaseline = 'top';
    [...str].forEach((ch, i) => g.fillText(ch, vertical ? 0.04 * px : i * px * 1.02, vertical ? i * px * 1.02 : 0.04 * px));
    const d = g.getImageData(0, 0, w, h).data, on = (x, y) => x >= 0 && y >= 0 && x < w && y < h && d[(Math.round(y) * w + Math.round(x)) * 4 + 3] > 110, pts = [];
    for (let y = step / 2; y < h; y += step) for (let x = step / 2; x < w; x += step) if (on(x, y)) {
      let hr = 0, vr = 0; for (let k = 1; k < 8; k++) { hr += on(x + k * step * 0.4, y) + on(x - k * step * 0.4, y); vr += on(x, y + k * step * 0.4) + on(x, y - k * step * 0.4); }
      pts.push(x, y, hr >= vr ? 1 : 0);
    }
    const r = { pts, w, h }; gcache.set(key, r); return r;
  };
  // vertical text, one glyph under another
  K.vtext = (g, str, x, y, px, lead = 1.02) => { [...str].forEach((ch, i) => g.fillText(ch, x, y + i * px * lead)); };
})();
