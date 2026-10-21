// kit_f.js — shared helpers for team F's cells (46–54, the modernist run). Namespace: XY.KIT_F
// Everything is a pure function of its arguments (no Math.random / Date); layers come from XY.scratch / XY.keep.
(() => {
  'use strict';
  const XY = window.XY, TAU = XY.TAU;
  const K = XY.KIT_F = {};

  // ------------------------------------------------------------ layers
  // device-pixel scratch layer covering the panel, transform set to design units
  K.layer = (e, key) => { const cv = XY.scratch('kf-' + key, e.W * e.S, e.H * e.S), g = cv.getContext('2d'); g.setTransform(e.S, 0, 0, e.S, 0, 0); return [cv, g]; };
  K.blit = (g, cv, alpha = 1, op = 'source-over', dx = 0, dy = 0) => {
    g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = alpha; g.globalCompositeOperation = op; g.drawImage(cv, dx, dy); g.restore(); };

  // ------------------------------------------------------------ rig helpers
  // the part objects of the named figures at this phase/acts (the same objects drawProcession iterates over)
  K.partSet = (phase, acts, names) => { const s = new Set(); XY.procParts(phase, acts).forEach(F => { if (names.includes(F.name)) F.parts.forEach(p => s.add(p)); }); return s; };
  // a pen that skips the parts in `set` (used for props only, e.g. the staff when Wukong holds the fan; characters
  // leave or join through the rig's acts.cast override instead)
  K.exceptPen = (pen, set) => ({ ...pen, color: (r, p) => (set.has(p) ? null : (pen.color ? pen.color(r, p) : XY.DEFAULT_COLORS[r])) });
  // 如意金箍棒 parts (shaft + two gold caps) so a cell can hand Wukong something else to hold
  K.staffSet = (phase, acts) => { const F = XY.procParts(phase, acts).find(f => f.name === 'wukong'), s = new Set();
    const i = F.parts.findIndex(p => p.role === 'staff'); if (i >= 0) [0, 1, 2].forEach(k => s.add(F.parts[i + k])); return s; };
  // Wukong alone, mirrored about the vertical line x = mx (the reflection walks toward the mirror as he does).
  // Uses the rig's per-frame cast override, so his own shading and pen are kept.
  K.ONLY_WUKONG = { monk: false, bajie: false, shaseng: false, wukong: true };
  K.mirrorWukong = (g, e, pen, acts, mx) => {
    g.save(); g.translate(2 * mx, 0); g.scale(-1, 1); XY.drawProcession(g, e.phase, e.procX, e.groundY, pen, { ...acts, cast: K.ONLY_WUKONG }); g.restore(); };
  // anchor of the mirrored Wukong
  K.mirrorAt = (e, key, acts, mx) => { const p = e.at(key, acts); return [2 * mx - p[0], p[1]]; };

  // ------------------------------------------------------------ timing
  K.pulse = (beat, b, w = 0.5) => Math.max(0, 1 - Math.abs(beat - b) / w);          // tent around beat b
  K.after = (beat, b, len = 0.5) => XY.clamp((beat - b) / len);                        // ramp starting on beat b
  K.hitDecay = (beat, b, len = 1) => (beat < b ? 0 : Math.exp(-(beat - b) / len * 3)); // impact on beat b, decays
  K.step = (t, fps) => Math.floor(t * fps);
  // push-in envelope: 0 before b0, up to 1 over `rise` beats, held for `hold`, back to 0 over `fall` (smooth)
  K.push = (beat, b0, rise = 0.2, hold = 0.5, fall = 0.9) => beat < b0 ? 0 : beat < b0 + rise ? XY.easeOut((beat - b0) / rise)
    : beat < b0 + rise + hold ? 1 : 1 - XY.smooth((beat - b0 - rise - hold) / fall);
  // local push-in on the whole panel (bg + draw), used from a style's post(): scale z about the design point (cx, cy)
  K.postZoom = (canvas, g, e, cx, cy, z) => { if (z <= 1.0005) return;
    const tmp = XY.scratch('kf-zoom', canvas.width, canvas.height); tmp.getContext('2d').drawImage(canvas, 0, 0);
    const S = e.S, px = cx * S, py = cy * S; g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.imageSmoothingQuality = 'high';
    g.drawImage(tmp, px - px * z, py - py * z, canvas.width * z, canvas.height * z); g.restore(); };

  // ------------------------------------------------------------ geometry
  K.poly = (g, pts) => { g.beginPath(); g.moveTo(pts[0][0], pts[0][1]); for (let k = 1; k < pts.length; k++) g.lineTo(pts[k][0], pts[k][1]); g.closePath(); };
  K.wedge = (g, cx, cy, r0, r1, a0, a1) => { g.beginPath(); g.arc(cx, cy, r1, a0, a1); g.arc(cx, cy, r0, a1, a0, true); g.closePath(); };
  K.hex = c => { const n = parseInt(c.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };
  K.mix = (a, b, u, al = 1) => { const A = K.hex(a), B = K.hex(b); return `rgba(${Math.round(XY.lerp(A[0], B[0], u))},${Math.round(XY.lerp(A[1], B[1], u))},${Math.round(XY.lerp(A[2], B[2], u))},${al})`; };
  K.rgba = (c, a) => { const A = K.hex(c); return `rgba(${A[0]},${A[1]},${A[2]},${a})`; };

  // Jittered triangle facets over a box, bucketed into a few shade levels so each level is one fill.
  // Paint on a layer with 'source-atop' to facet whatever is already there (the procession, a face...).
  // levels: [[css, weight], ...]; edges: css or null. `st` re-seeds a fraction of facets (boil).
  K.facets = (g, x0, y0, x1, y1, cell, seed, levels, edges, st = 0, boil = 0.2, ew = 1) => {
    const nx = Math.ceil((x1 - x0) / cell), ny = Math.ceil((y1 - y0) / cell), R = XY.rng(seed), P = [];
    for (let j = 0; j <= ny; j++) for (let i = 0; i <= nx; i++) { const ed = i === 0 || j === 0 || i === nx || j === ny ? 0 : 0.8;
      P.push([x0 + i * cell + (R() - 0.5) * cell * ed, y0 + j * cell + (R() - 0.5) * cell * ed]); }
    const tot = levels.reduce((a, l) => a + l[1], 0), paths = levels.map(() => new Path2D()), ep = edges ? new Path2D() : null;
    const tri = (pa, a, b, c) => { pa.moveTo(a[0], a[1]); pa.lineTo(b[0], b[1]); pa.lineTo(c[0], c[1]); pa.closePath(); };
    for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
      const A = P[j * (nx + 1) + i], B = P[j * (nx + 1) + i + 1], C = P[(j + 1) * (nx + 1) + i], D = P[(j + 1) * (nx + 1) + i + 1], diag = R() < 0.5;
      const T = diag ? [[A, B, D], [A, D, C]] : [[A, B, C], [B, D, C]];
      T.forEach((t3, k) => { let v = R() * tot; if (boil && XY.hash(i * 31 + j, k, st + seed) < boil) v = XY.hash(i, j * 7 + k, st * 13 + seed) * tot;
        let li = 0; while (li < levels.length - 1 && v > levels[li][1]) { v -= levels[li][1]; li++; }
        tri(paths[li], t3[0], t3[1], t3[2]); if (ep) tri(ep, t3[0], t3[1], t3[2]); });
    }
    levels.forEach((l, k) => { if (l[0]) { g.fillStyle = l[0]; g.fill(paths[k]); } });
    if (ep) { g.strokeStyle = edges; g.lineWidth = ew; g.stroke(ep); }
  };

  // ------------------------------------------------------------ textures
  // small tileable noise tile (kept forever) → pattern; draw it with a per-frame offset for grain / boil
  K.noiseTile = (key, T, fn) => XY.keep('kf-tile:' + key, T, T, cv => { const g = cv.getContext('2d'), im = g.createImageData(T, T);
    for (let j = 0; j < T; j++) for (let i = 0; i < T; i++) { const o = (j * T + i) * 4, v = fn(i, j); im.data[o] = v[0]; im.data[o + 1] = v[1]; im.data[o + 2] = v[2]; im.data[o + 3] = v[3]; }
    g.putImageData(im, 0, 0); });
  K.grain = (g, e, tile, alpha, fps = 24, op = 'source-over') => {
    const st = K.step(e.t, fps), pat = g.createPattern(tile, 'repeat'), ox = Math.floor(XY.hash(st, 1, e.cell.n) * tile.width), oy = Math.floor(XY.hash(st, 2, e.cell.n) * tile.height);
    pat.setTransform(new DOMMatrix().translateSelf(ox, oy));
    g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = alpha; g.globalCompositeOperation = op; g.fillStyle = pat; g.fillRect(0, 0, Math.round(e.W * e.S), Math.round(e.H * e.S)); g.restore();
  };
  // speckle + fibre paper for bg (design units)
  K.paper = (g, W, H, base, seed, n = 2600, dark = 'rgba(90,70,40,0.07)', light = 'rgba(255,252,240,0.25)') => {
    g.fillStyle = base; g.fillRect(0, 0, W, H); const R = XY.rng(seed);
    for (let i = 0; i < n; i++) { const x = R() * W, y = R() * H, a = R() * Math.PI, l = 2 + R() * 9; g.strokeStyle = R() < 0.5 ? dark : light; g.lineWidth = 0.6 + R();
      g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l); g.stroke(); }
  };
  // low-res fbm mottling drawn up (for plaster, old paper, film base); cached by key
  K.mottle = (g, key, W, H, k, seed, fn) => { const w = Math.ceil(W / k), h = Math.ceil(H / k);
    const cv = XY.keep('kf-mottle:' + key, w, h, c => { const gg = c.getContext('2d'), im = gg.createImageData(w, h);
      for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) { const o = (j * w + i) * 4, v = fn(XY.fbm(i * k / 140, j * k / 140, seed, 5), XY.fbm(i * k / 24, j * k / 24, seed + 5, 3), i * k, j * k);
        im.data[o] = v[0]; im.data[o + 1] = v[1]; im.data[o + 2] = v[2]; im.data[o + 3] = v[3]; }
      gg.putImageData(im, 0, 0); });
    g.save(); g.imageSmoothingEnabled = true; g.imageSmoothingQuality = 'high'; g.drawImage(cv, 0, 0, w * k, h * k); g.restore();
  };
  K.TAU = TAU;
})();
