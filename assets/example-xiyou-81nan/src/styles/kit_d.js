// kit_d.js — shared helpers for team D's cells (28–36). Namespace: XY.KIT_D
// • procession layers sized to the procession's bounding box (device px), lit with offset-silhouette bands
// • part tagging: figure/part indices on every part, and 悟空's head (_head) so it can be painted on its own.
//   The rider (唐僧 off the horse) uses the rig's own p.rider tag and acts.cast.rider; K.sub(…, 'rider', …) paints him elsewhere.
// • small texture / lettering helpers used by several cells (grain, craquelure, seals, vertical text)
(() => {
  'use strict';
  const XY = window.XY, TAU = XY.TAU;
  const K = XY.KIT_D = {};
  K.step = (t, fps) => Math.floor(t * fps) / fps;
  K.pulse = (beat, at, w = 0.5) => { const d = (beat - at) / w; return d < 0 || d > 1 ? 0 : Math.sin(Math.PI * d); };
  K.win = (u, a, b) => XY.clamp((u - a) / (b - a));
  // v10: 0 before a, eases to 1 by b, holds, eases back to 0 between c and d
  K.env = (x, a, b, c, d) => XY.smooth((x - a) / (b - a)) * (1 - XY.smooth((x - c) / (d - c)));
  // v10: a local push-in. Copies what the panel holds so far (bg + draw) and paints it back scaled by z about the
  // design point (cx, cy). Call it before the painted frame overlay so the frame stays put; inset clips to the frame.
  K.zoom = (g, e, cx, cy, z, inset = 0) => {
    if (!(z > 1.001)) return;
    const cv = g.canvas, S = e.S, cp = XY.scratch('kd-zoom', cv.width, cv.height); cp.getContext('2d').drawImage(cv, 0, 0);
    g.save(); g.setTransform(1, 0, 0, 1, 0, 0);
    if (inset) { g.beginPath(); g.rect(inset * S, inset * S, cv.width - 2 * inset * S, cv.height - 2 * inset * S); g.clip(); }
    g.drawImage(cp, cx * S * (1 - z), cy * S * (1 - z), cv.width * z, cv.height * z); g.restore();
  };
  // the procession centre (panel x) at a given cell-local u, for aiming events that happen at a fixed moment
  K.procAt = (e, u) => XY.procWorldX(e.cell.t0 + u * e.cell.dur) - e.cell.x;

  // ------------------------------------------------------------ part tags on the rig's memoised output
  // FIGS order in rig.js: 0 shaseng, 1 bajie, 2 monk (horse + rider), 3 wukong
  K.tag = (ph, acts) => {
    const F = XY.procParts(ph, acts); if (F._kd) return F; F._kd = true;
    F.forEach((f, fi) => f.parts.forEach((p, pi) => { p._fi = fi; p._pi = pi; }));
    const w = F[3].parts, ih = w.findIndex(p => p.role === 'fur' && p.k === 'poly' && p.pts.length === 44), is = w.findIndex(p => p.role === 'staff');
    w.forEach((p, k) => { if (k >= ih && k < is) p._head = 1; });
    return F;
  };
  // pen that skips parts carrying any of the flags (e.g. K.hide(PEN, '_head'))
  K.hide = (pen, ...flags) => Object.assign({}, pen, { color: (r, p) => (p && flags.some(f => p[f])) ? null : (pen.color ? pen.color(r, p) : XY.DEFAULT_COLORS[r]) });
  // paint a list of rig parts with the same rules as XY.drawProcession (figure-local coordinates)
  K.paint = (ctx, parts, pen) => {
    const col = pen.color || (r => XY.DEFAULT_COLORS[r]);
    ctx.save(); ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    for (const p of parts) {
      if (p.shade) { if (pen.shade === false || p.k !== 'poly') continue; XY.path(ctx, p.pts, true); ctx.fillStyle = pen.shade || `rgba(20,12,4,${p.shade})`; ctx.fill(); continue; }
      if (p.fine && pen.fine === false) continue;
      const c = col(p.role, p); if (c == null) continue;
      if (pen.part && pen.part(ctx, p, c, p._fi * 100 + p._pi) !== false) continue;
      if (p.k === 'dot') { ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, TAU); ctx.fillStyle = c; ctx.fill(); continue; }
      let pts = p.pts; if (pen.wob) pts = XY.wobble(XY.densify(pts, 8, p.k === 'poly' || p.closed), pen.wob, (pen.seed || 0) + p._fi * 1000 + p._pi * 7);
      XY.path(ctx, pts, p.k === 'poly' || !!p.closed);
      if (p.k === 'poly') { ctx.fillStyle = c; ctx.fill(); if (pen.outline) { ctx.strokeStyle = pen.outline; ctx.lineWidth = pen.ow || 2; ctx.stroke(); } }
      else { if (pen.outline && !pen.thinLines && !p.fine) { ctx.strokeStyle = pen.outline; ctx.lineWidth = p.w + 2 * (pen.ow || 2); ctx.stroke(); } ctx.strokeStyle = c; ctx.lineWidth = p.w; ctx.stroke(); }
    }
    ctx.restore();
  };
  // a tagged subset of one figure, with its pivot in panel coordinates (procession at procX, groundY)
  K.sub = (e, ph, acts, fig, flag, pivotKey) => {
    const F = K.tag(ph, acts), f = F[fig], pv = f.anchors[pivotKey];
    return { parts: f.parts.filter(p => p[flag]), pivot: pv, at: [e.procX + f.x + pv[0], e.groundY + f.y + pv[1]], fx: f.x };
  };
  // paint a subset moved so that its pivot lands on (x, y), rotated by a and scaled by s
  K.paintSub = (g, sb, pen, x, y, a = 0, s = 1) => {
    g.save(); g.translate(x, y); g.rotate(a); g.scale(s, s); g.translate(-sb.pivot[0], -sb.pivot[1]); K.paint(g, sb.parts, pen); g.restore();
  };

  // ------------------------------------------------------------ procession layers (bounding box only, device px)
  K.boxLayer = (key, e, pad = 0, x = e.procX, y = e.groundY) => {
    const S = e.S, X = Math.floor((x - 400 - pad) * S), Y = Math.floor((y - 300 - pad) * S);
    const cv = XY.scratch(key, Math.ceil((740 + 2 * pad) * S) + 2, Math.ceil((330 + 2 * pad) * S) + 2), g = cv.getContext('2d');
    g.setTransform(S, 0, 0, S, -X, -Y); return { cv, g, X, Y };
  };
  K.put = (g, L, alpha = 1, op) => { g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = alpha; if (op) g.globalCompositeOperation = op; g.drawImage(L.cv, L.X, L.Y); g.restore(); };
  const SIL = { color: () => '#000', shade: false };
  // o: { ph, x, y, pad, hide: ['_head'], bands: [[dx, dy, css], …] (source-atop, carved by the offset silhouette), atop(g, L) }
  K.lit = (e, pen, acts, o = {}) => {
    const ph = o.ph != null ? o.ph : e.phase, px = o.x != null ? o.x : e.procX, gy = o.y != null ? o.y : e.groundY, pad = o.pad || 0, hide = o.hide || [];
    K.tag(ph, acts);
    const P = hide.length ? K.hide(pen, ...hide) : pen, Sl = hide.length ? K.hide(SIL, ...hide) : SIL;
    const L = K.boxLayer('kd-lay', e, pad, px, gy); XY.drawProcession(L.g, ph, px, gy, P, acts);
    const band = (dx, dy, col, key, blur) => { const M = K.boxLayer(key, e, pad, px, gy), mg = M.g;
      mg.save(); mg.setTransform(1, 0, 0, 1, 0, 0); mg.fillStyle = col; mg.fillRect(0, 0, M.cv.width, M.cv.height); mg.restore();
      if (blur) { const Q = K.boxLayer(key + 'q', e, pad, px, gy); XY.drawProcession(Q.g, ph, px + dx, gy + dy, Sl, acts);
        mg.save(); mg.setTransform(1, 0, 0, 1, 0, 0); mg.globalCompositeOperation = 'destination-out'; mg.filter = `blur(${(blur * e.S).toFixed(1)}px)`; mg.drawImage(Q.cv, 0, 0); mg.restore(); }
      else { mg.globalCompositeOperation = 'destination-out'; XY.drawProcession(mg, ph, px + dx, gy + dy, Sl, acts); }
      return M.cv; };
    L.g.save(); L.g.setTransform(1, 0, 0, 1, 0, 0); L.g.globalCompositeOperation = 'source-atop';
    (o.bands || []).forEach((b, i) => L.g.drawImage(band(b[0], b[1], b[2], 'kd-b' + i, b[3]), 0, 0));
    if (o.atop) { L.g.setTransform(e.S, 0, 0, e.S, -L.X, -L.Y); o.atop(L.g, L); }
    L.g.restore(); return L;
  };
  // a solid silhouette of the procession (for cast shadows, blur halos, masks)
  K.sil = (e, col, acts, o = {}) => {
    const ph = o.ph != null ? o.ph : e.phase, px = o.x != null ? o.x : e.procX, gy = o.y != null ? o.y : e.groundY, hide = o.hide || [];
    if (hide.length) K.tag(ph, acts);
    const L = K.boxLayer(o.key || 'kd-sil', e, o.pad || 0, px, gy), pen = { color: () => col, shade: false };
    XY.drawProcession(L.g, ph, px, gy, hide.length ? K.hide(pen, ...hide) : pen, acts); return L;
  };

  // ------------------------------------------------------------ textures (call from bg only)
  // per-pixel texture at reduced resolution: f(x, y) → [r, g, b, a] in design units, k = design px per texel
  K.texture = (W, H, k, f) => {
    const w = Math.ceil(W / k), h = Math.ceil(H / k), cv = XY.mk(w, h), g = cv.getContext('2d'), im = g.createImageData(w, h), d = im.data;
    for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) { const c = f(i * k, j * k), o = (j * w + i) * 4; d[o] = c[0]; d[o + 1] = c[1]; d[o + 2] = c[2]; d[o + 3] = c[3]; }
    g.putImageData(im, 0, 0); return cv;
  };
  // fine grain + fibres overlay: dark and light flecks, drawn straight onto g (design units)
  K.grain = (g, W, H, seed, n, dark, light, len = 6) => {
    const R = XY.rng(seed);
    for (let i = 0; i < n; i++) { const x = R() * W, y = R() * H, a = R() * Math.PI, l = 1 + R() * len;
      g.strokeStyle = R() < 0.5 ? dark : light; g.lineWidth = 0.5 + R() * 0.7; g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l); g.stroke(); }
  };
  // craquelure: a loose network of short broken polylines
  K.cracks = (g, W, H, seed, n, col, lw = 0.7) => {
    const R = XY.rng(seed); g.strokeStyle = col; g.lineWidth = lw; g.lineCap = 'round';
    for (let i = 0; i < n; i++) { let x = R() * W, y = R() * H, a = R() * TAU; g.beginPath(); g.moveTo(x, y);
      const m = 3 + Math.floor(R() * 6); for (let k = 0; k < m; k++) { a += (R() - 0.5) * 1.6; const l = 6 + R() * 16; x += Math.cos(a) * l; y += Math.sin(a) * l; g.lineTo(x, y); } g.stroke(); }
  };
  // canvas weave: two sets of faint threads
  K.weave = (g, W, H, step, col) => { g.strokeStyle = col; g.lineWidth = 0.6; g.beginPath();
    for (let x = 0; x < W; x += step) { g.moveTo(x, 0); g.lineTo(x, H); } for (let y = 0; y < H; y += step) { g.moveTo(0, y); g.lineTo(W, y); } g.stroke(); };
  // v10 painterly pass (bg only): loaded strokes in the colours already painted underneath, so flat gradients turn into
  // brushwork. o: { x0, y0, x1, y1, len: [a, b], w: [a, b], alpha, jit, dir(x, y) → angle, mask(x, y) → bool }
  K.brush = (g, W, H, n, seed, o = {}) => {
    const cv = g.canvas, S = cv.width / W, d = g.getImageData(0, 0, cv.width, cv.height).data, R = XY.rng(seed), c8 = v => Math.max(0, Math.min(255, Math.round(v)));
    const x0 = o.x0 || 0, y0 = o.y0 || 0, x1 = o.x1 == null ? W : o.x1, y1 = o.y1 == null ? H : o.y1, L = o.len || [6, 18], Wd = o.w || [1.5, 4], al = o.alpha || 0.5, jit = o.jit == null ? 22 : o.jit;
    g.save(); g.lineCap = 'round';
    for (let k = 0; k < n; k++) { const x = x0 + R() * (x1 - x0), y = y0 + R() * (y1 - y0); if (o.mask && !o.mask(x, y)) continue;
      const i = (Math.min(cv.height - 1, Math.floor(y * S)) * cv.width + Math.min(cv.width - 1, Math.floor(x * S))) * 4; if (d[i + 3] < 200) continue; const a = o.dir ? o.dir(x, y) : XY.noise2(x / 140, y / 140, seed) * Math.PI;
      const l = L[0] + R() * (L[1] - L[0]), v = (R() - 0.5) * jit, cx = Math.cos(a) * l / 2, cy = Math.sin(a) * l / 2, bend = (R() - 0.5) * l * 0.3;
      g.strokeStyle = `rgba(${c8(d[i] + v)},${c8(d[i + 1] + v)},${c8(d[i + 2] + v * 0.8)},${al})`; g.lineWidth = Wd[0] + R() * (Wd[1] - Wd[0]);
      g.beginPath(); g.moveTo(x - cx, y - cy); g.quadraticCurveTo(x - cy * bend / l, y + cx * bend / l, x + cx, y + cy); g.stroke(); }
    g.restore();
  };
  // impasto: a thick lit dab with its own little shadow, for highlights on metal, glass, fruit
  K.impasto = (g, x, y, l, a, col = 'rgba(255,250,232,0.78)') => { const cx = x + Math.cos(a) * l / 2, cy = y + Math.sin(a) * l / 2;
    g.save(); g.translate(cx, cy); g.rotate(a); g.fillStyle = 'rgba(40,24,10,0.28)'; g.beginPath(); g.ellipse(1.2, 1.6, l / 2, 2.6, 0, 0, TAU); g.fill();
    g.fillStyle = col; g.beginPath(); g.ellipse(0, 0, l / 2, 2.4, 0, 0, TAU); g.fill(); g.fillStyle = 'rgba(255,255,255,0.5)'; g.beginPath(); g.ellipse(-l * 0.12, -0.6, l * 0.22, 1, 0, 0, TAU); g.fill(); g.restore(); };

  // ------------------------------------------------------------ lettering
  K.vtext = (g, s, x, y, step) => { [...s].forEach((ch, i) => g.fillText(ch, x, y + i * step)); };
  // square seal; white = 白文 (red ground, white characters) else 朱文 (red characters in a red ring)
  K.seal = (g, x, y, s, chars, col = '#B8231A', white = true, font = XY.cnFont.li) => {
    g.save(); g.translate(x, y);
    const R = XY.rng(chars.length * 31 + Math.round(s)), ed = [];
    for (let k = 0; k < 16; k++) { const a = k / 16 * TAU, r = s * 0.5 * (0.98 + 0.04 * R()) / Math.max(Math.abs(Math.cos(a)), Math.abs(Math.sin(a))); ed.push(Math.cos(a) * Math.min(r, s * 0.72), Math.sin(a) * Math.min(r, s * 0.72)); }
    XY.path(g, ed, true);
    if (white) { g.fillStyle = col; g.fill(); g.fillStyle = 'rgba(250,236,214,0.92)'; } else { g.strokeStyle = col; g.lineWidth = s * 0.07; g.stroke(); g.fillStyle = col; }
    const n = chars.length, cols = n > 2 ? 2 : 1, rows = Math.ceil(n / cols), fs = s * 0.8 / Math.max(rows, cols);
    g.font = XY.font(fs, font, 'bold'); g.textAlign = 'center'; g.textBaseline = 'middle';
    [...chars].forEach((ch, i) => { const c = cols - 1 - Math.floor(i / rows), r = i % rows; g.fillText(ch, (c - (cols - 1) / 2) * fs * 1.05, (r - (rows - 1) / 2) * fs * 1.05); });
    g.restore();
  };
})();
