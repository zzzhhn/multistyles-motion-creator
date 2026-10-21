// kit_e.js — shared helpers for team E's cells (37–45: cyanotype → klimt). Namespace: XY.KIT_E
// · drawProc: XY.drawProcession re-implemented on XY.procParts (honouring XY.CURRENT_CAST / acts.cast) so single figures, the rider
//   apart from the horse, or Wukong's staff apart from Wukong can be moved and scaled, and extra shapes injected between parts.
// · layer/pat/put: device-pixel scratch layers over a design rect, pattern masks aligned to the panel, compositing.
// · small helpers: ramps and beat hits, tapered brush strokes, cached tiles, offscreen text masks.
(() => {
  'use strict';
  const XY = window.XY, TAU = XY.TAU, K = XY.KIT_E = {};
  const { cos, sin, exp, max, min } = Math;

  // ------------------------------------------------------------ timing
  K.ramp = (u, a, b) => XY.smooth((u - a) / (b - a));
  K.hit = (beat, b, k = 3) => (beat < b ? 0 : exp(-(beat - b) * k));          // 1 at the beat, decays after
  K.bump = (x, c, w) => max(0, 1 - Math.abs(x - c) / w);
  K.step = (t, fps) => Math.floor(t * fps);

  // ------------------------------------------------------------ procession
  // groups: 'wukong', 'wukong.staff', 'monk' (the horse), 'monk.rider', 'bajie', 'shaseng'
  const groupFn = F => {
    const P = F.parts;
    if (F.name === 'monk') { const r = P.findIndex(p => p.rider), c = r >= 0 ? r : P.findIndex(p => p.role === 'saddle') + 1; return i => (i >= c ? 'monk.rider' : 'monk'); }
    if (F.name === 'wukong') { const s = P.findIndex(p => p.role === 'staff'); return i => (i >= s && i <= s + 2 ? 'wukong.staff' : 'wukong'); }
    return () => F.name;
  };
  K.paintPart = (ctx, p, pen, fi, pi) => {
    if (p.shade) { if (pen.shade === false || p.k !== 'poly') return; XY.path(ctx, p.pts, true); ctx.fillStyle = pen.shade || `rgba(20,12,4,${p.shade})`; ctx.fill(); return; }
    if (p.fine && pen.fine === false) return;
    const c = pen.color ? pen.color(p.role, p) : XY.DEFAULT_COLORS[p.role]; if (c == null) return;
    if (pen.part && pen.part(ctx, p, c, fi * 1000 + pi) !== false) return;
    if (p.k === 'dot') { ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, TAU); ctx.fillStyle = c; ctx.fill(); return; }
    let pts = p.pts; if (pen.wob) pts = XY.wobble(XY.densify(pts, 8, p.k === 'poly' || p.closed), pen.wob, (pen.seed || 0) + fi * 1000 + pi * 7);
    if (p.k === 'poly') { XY.path(ctx, pts, true); ctx.fillStyle = c; ctx.fill(); if (pen.outline) { ctx.strokeStyle = pen.outline; ctx.lineWidth = pen.ow || 2; ctx.stroke(); } return; }
    XY.path(ctx, pts, !!p.closed);
    if (pen.outline && !pen.thinLines && !p.fine) { ctx.strokeStyle = pen.outline; ctx.lineWidth = p.w + 2 * (pen.ow || 2); ctx.stroke(); }
    ctx.strokeStyle = c; ctx.lineWidth = p.w; ctx.stroke();
  };
  // figure-local transform of a group: { dx, dy, rot, s, px, py (pivot, figure-local), hide, alpha }
  const apply = (ctx, T) => { if (!T) return; ctx.translate(T.dx || 0, T.dy || 0); if (T.rot || (T.s != null && T.s !== 1)) { const px = T.px || 0, py = T.py || 0; ctx.translate(px, py); ctx.rotate(T.rot || 0); const s = T.s == null ? 1 : T.s; ctx.scale(s, s); ctx.translate(-px, -py); } };
  const mapPt = (T, p) => { if (!T) return p; let x = p[0], y = p[1]; const px = T.px || 0, py = T.py || 0, s = T.s == null ? 1 : T.s, r = T.rot || 0;
    x -= px; y -= py; const X = (x * cos(r) - y * sin(r)) * s + px, Y = (x * sin(r) + y * cos(r)) * s + py; return [X + (T.dx || 0), Y + (T.dy || 0)]; };
  const parentOf = g => (g === 'monk.rider' ? 'monk' : g === 'wukong.staff' ? 'wukong' : null);
  const hidden = (xf, g) => { const a = xf[g], p = parentOf(g), b = p && xf[p]; return !!((a && a.hide) || (b && b.hide && !(a && a.show))); };
  K.only = (...groups) => { const o = { wukong: { hide: 1 }, monk: { hide: 1 }, bajie: { hide: 1 }, shaseng: { hide: 1 } }; groups.forEach(g => { o[g] = { show: 1 }; }); return o; };
  // opts.xf: per-group transforms; opts.inject: { name: [{ at, fn(ctx, F) }] } (at < 0 counts from the end) — drawn in figure space
  K.drawProc = (ctx, e, pen, acts, opts = {}, ox = e.procX, oy = e.groundY) => {
    const xf = opts.xf || {}, inj = opts.inject || {}, cast = Object.assign({}, XY.CURRENT_CAST || {}, (acts && acts.cast) || {});   // honour the engine's cast
    ctx.save(); ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    XY.procParts(e.phase, acts).forEach((F, fi) => {
      if (cast[F.name] === false) return;
      const grp = groupFn(F), P = F.parts, n = P.length, J = (inj[F.name] || []).map(j => ({ at: j.at === 'end' ? n : j.at < 0 ? n + j.at : j.at, fn: j.fn }));
      let cur = null, alpha0 = ctx.globalAlpha;
      for (let i = 0; i <= n; i++) {
        const g = i < n ? grp(i) : cur;
        if (g !== cur) {
          if (cur !== null) ctx.restore();
          cur = g; ctx.save(); ctx.translate(ox + F.x, oy + F.y);
          const pa = parentOf(g); if (pa) apply(ctx, xf[pa]); apply(ctx, xf[g]);
          const al = (pa && xf[pa] && xf[pa].alpha != null ? xf[pa].alpha : 1) * (xf[g] && xf[g].alpha != null ? xf[g].alpha : 1); ctx.globalAlpha = alpha0 * al;
        }
        if (hidden(xf, g)) continue;
        for (const j of J) if (j.at === i) j.fn(ctx, F);
        if (i < n && !(P[i].rider && cast.rider === false) && !(P[i].prop && cast[P[i].prop] === false)) K.paintPart(ctx, P[i], pen, fi, i);
      }
      if (cur !== null) ctx.restore();
    });
    ctx.restore();
  };
  const ANCH = { 'wukong.staffTip': 'wukong.staff', 'wukong.staffEnd': 'wukong.staff', 'monk.horseHead': 'monk', 'monk.horseChest': 'monk', 'monk.saddle': 'monk' };
  // anchor in panel coordinates, honouring the same transforms
  K.at = (e, key, acts, xf = {}, ox = e.procX, oy = e.groundY) => {
    const [n, k] = key.split('.'), F = XY.procParts(e.phase, acts).find(f => f.name === n); let p = F && F.anchors[k]; if (!p) return [ox, oy];
    const g = ANCH[key] || (n === 'monk' ? 'monk.rider' : n), pa = parentOf(g);
    p = mapPt(xf[g], p); if (pa) p = mapPt(xf[pa], p);
    return [ox + F.x + p[0], oy + F.y + p[1]];
  };
  K.fig = (e, name, acts) => XY.procParts(e.phase, acts).find(f => f.name === name);
  // is a cast member / prop present this frame (engine cast + per-frame override)
  K.has = (key, acts) => Object.assign({}, XY.CURRENT_CAST || {}, (acts && acts.cast) || {})[key] !== false;
  // local push-in for post(): scale the finished panel by z around design point (cx, cy); keep z back at 1 before u ≈ 0.85
  K.punch = (cv, g, e, cx, cy, z) => { if (z <= 1.0005) return; const S = e.S, sc = XY.scratch('kE-punch', cv.width, cv.height); sc.getContext('2d').drawImage(cv, 0, 0);
    const X = cx * S, Y = cy * S; g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.drawImage(sc, X - X * z, Y - Y * z, cv.width * z, cv.height * z); g.restore(); };
  // envelope for a push: rises over `rise` beats to the peak at b, falls back by b + fall
  K.env = (beat, b, rise = 0.25, fall = 1.2) => (beat < b - rise ? 0 : beat < b ? XY.smooth((beat - b + rise) / rise) : 1 - XY.smooth((beat - b) / fall));

  // ------------------------------------------------------------ layers (device pixels over a design rect)
  K.layer = (key, e, x0, y0, w, h) => {
    const S = e.S, X = Math.floor(x0 * S), Y = Math.floor(y0 * S), cv = XY.scratch(key, Math.ceil(w * S) + 2, Math.ceil(h * S) + 2), g = cv.getContext('2d');
    const L = { cv, g, X, Y, S, x0, y0, w, h, design() { g.setTransform(S, 0, 0, S, -X, -Y); return g; }, dev() { g.setTransform(1, 0, 0, 1, 0, 0); return g; } };
    L.design(); return L;
  };
  K.procLayer = (key, e, top = 330, bot = 40, left = 420, right = 350) => K.layer(key, e, e.procX - left, e.groundY - top, left + right, top + bot);
  // fill a layer with a panel-aligned tile pattern under composite op
  K.pat = (L, tile, op = 'source-atop', alpha = 1, ox = 0, oy = 0) => {
    const g = L.dev(); g.save(); g.globalCompositeOperation = op; g.globalAlpha = alpha;
    const p = g.createPattern(tile, 'repeat'); p.setTransform(new DOMMatrix([1, 0, 0, 1, -L.X + ox, -L.Y + oy])); g.fillStyle = p; g.fillRect(0, 0, L.cv.width, L.cv.height); g.restore(); L.design();
  };
  K.fill = (L, col, op = 'source-atop', alpha = 1) => { const g = L.dev(); g.save(); g.globalCompositeOperation = op; g.globalAlpha = alpha; g.fillStyle = col; g.fillRect(0, 0, L.cv.width, L.cv.height); g.restore(); L.design(); };
  // copy layer B onto layer A (same rect) under op
  K.over = (A, B, op = 'source-over', alpha = 1, dx = 0, dy = 0) => { const g = A.dev(); g.save(); g.globalCompositeOperation = op; g.globalAlpha = alpha; g.drawImage(B.cv, dx * A.S, dy * A.S); g.restore(); A.design(); };
  K.put = (g, L, op = 'source-over', alpha = 1, dx = 0, dy = 0, filter) => {
    g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = op; g.globalAlpha = alpha; if (filter) g.filter = filter;
    g.drawImage(L.cv, L.X + dx * L.S, L.Y + dy * L.S); g.restore();
  };
  // a soft (blurred) copy: shrink by k then draw back up, smoothing does the blur
  K.soft = (g, L, k = 6, op = 'source-over', alpha = 1, dx = 0, dy = 0) => {
    const w = Math.max(2, Math.ceil(L.cv.width / k)), h = Math.max(2, Math.ceil(L.cv.height / k)), sm = XY.scratch('kE-soft' + k, w, h), sg = sm.getContext('2d');
    sg.imageSmoothingEnabled = true; sg.drawImage(L.cv, 0, 0, w, h);
    g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = op; g.globalAlpha = alpha; g.imageSmoothingEnabled = true; g.imageSmoothingQuality = 'high';
    g.drawImage(sm, 0, 0, w, h, L.X + dx * L.S - k / 2, L.Y + dy * L.S - k / 2, w * k, h * k); g.restore();
  };

  // ------------------------------------------------------------ tiles and masks (cached at device resolution)
  // tile(key, S, size, paint(g, size)) → canvas of size×size design px painted in design units, seamless if paint wraps
  K.tile = (key, S, size, paint) => XY.keep(`kE:${key}:${S.toFixed(3)}`, size * S, size * S, cv => { const g = cv.getContext('2d'); g.scale(S, S); paint(g, size); });
  // draw something 9 times so it wraps across a tile's edges
  K.wrap = (size, x, y, r, fn) => { for (const dx of [-size, 0, size]) for (const dy of [-size, 0, size]) { const X = x + dx, Y = y + dy; if (X < -r || X > size + r || Y < -r || Y > size + r) continue; fn(X, Y); } };
  // a stroke-texture tile: n short strokes, colours from cols, angle from ang(x,y,r)
  K.strokeTile = (key, S, size, n, cols, o = {}) => K.tile(key, S, size, (g, T) => {
    const R = XY.rng(o.seed || 7), L0 = o.len || 9, W0 = o.w || 3; g.lineCap = 'round';
    for (let i = 0; i < n; i++) { const x = R() * T, y = R() * T, a = o.ang ? o.ang(x, y, R) : R() * Math.PI, l = L0 * (0.6 + 0.8 * R()), w = W0 * (0.7 + 0.6 * R()), c = cols[Math.floor(R() * cols.length)];
      g.strokeStyle = c; g.lineWidth = w; K.wrap(T, x, y, l, (X, Y) => { g.beginPath(); g.moveTo(X - cos(a) * l / 2, Y - sin(a) * l / 2); g.quadraticCurveTo(X + sin(a) * w * 0.4, Y - cos(a) * w * 0.4, X + cos(a) * l / 2, Y + sin(a) * l / 2); g.stroke(); }); }
  });
  // speckle / grain tile
  K.grainTile = (key, S, size, n, cols, rMin = 0.4, rMax = 1.4, seed = 3) => K.tile(key, S, size, (g, T) => {
    const R = XY.rng(seed); for (let i = 0; i < n; i++) { const x = R() * T, y = R() * T, r = rMin + (rMax - rMin) * R(); g.fillStyle = cols[Math.floor(R() * cols.length)]; K.wrap(T, x, y, r, (X, Y) => { g.beginPath(); g.arc(X, Y, r, 0, TAU); g.fill(); }); }
  });
  // fill the whole panel (design units, current transform) with a tile pattern
  K.panelPat = (g, e, tile, op = 'source-over', alpha = 1) => {
    g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = op; g.globalAlpha = alpha; g.fillStyle = g.createPattern(tile, 'repeat'); g.fillRect(0, 0, Math.ceil(e.W * e.S), Math.ceil(e.H * e.S)); g.restore();
  };

  // ------------------------------------------------------------ brushes (design units)
  // one tapered, slightly bent stroke
  K.dab = (g, x, y, a, l, w, col, bend = 0.3) => {
    const c = cos(a), s = sin(a), hx = c * l / 2, hy = s * l / 2, nx = -s * w * bend, ny = c * w * bend;
    g.strokeStyle = col; g.lineWidth = w; g.beginPath(); g.moveTo(x - hx, y - hy); g.quadraticCurveTo(x + nx, y + ny, x + hx, y + hy); g.stroke();
  };
  // a jittered grid over [x0,x1]×[y0,y1]; fn(x, y, R) paints a stroke (R: seeded rng)
  K.field = (x0, y0, x1, y1, step, seed, fn) => {
    const R = XY.rng(seed);
    for (let y = y0; y < y1; y += step) for (let x = x0; x < x1; x += step) fn(x + (R() - 0.5) * step, y + (R() - 0.5) * step, R);
  };
  // pick from a palette by noise so neighbouring strokes vary but regions stay coherent
  K.pick = (pal, x, y, R, sc = 0.02, seed = 1) => { const v = XY.clamp(0.5 + 0.6 * XY.noise2(x * sc, y * sc, seed) + (R() - 0.5) * 0.7, 0, 0.999); return pal[Math.floor(v * pal.length)]; };
  // flow-field streamline as a tapered ribbon: dir(x, y) → angle; returns the point list
  K.stream = (x, y, steps, len, dir) => { const pts = [x, y]; for (let k = 0; k < steps; k++) { const a = dir(x, y); x += cos(a) * len; y += sin(a) * len; pts.push(x, y); } return pts; };
  K.ribbonFill = (g, pts, w0, w1, col) => { if (pts.length < 4) return; g.fillStyle = col; XY.path(g, XY.RIG.ribbon(pts, w0, w1), true); g.fill(); };
  // smooth closed shape through points (design units)
  K.blob = (g, pts, col, n = 5) => { XY.path(g, XY.RIG.spline(pts, true, n), true); if (col !== null) { if (col) g.fillStyle = col; g.fill(); } };   // col undefined: current fill; null: path only
  K.curve = (g, pts, col, w, n = 5) => { XY.path(g, XY.RIG.spline(pts, false, n), false); g.strokeStyle = col; g.lineWidth = w; g.stroke(); };

  // ------------------------------------------------------------ text
  // text rendered into a kept offscreen at device resolution: returns { cv, w, h } (design size)
  K.textCv = (key, S, txt, font, col, o = {}) => {
    const pad = o.pad || 10, m = XY.mk(4, 4).getContext('2d'); m.font = font; const tw = Math.ceil(m.measureText(txt).width) + pad * 2, th = o.h || Math.ceil(parseFloat(font.match(/(\d+(\.\d+)?)px/)[1]) * 1.35) + pad * 2;
    const cv = XY.keep(`kEtx:${key}:${S.toFixed(3)}`, tw * S, th * S, c => { const g = c.getContext('2d'); g.scale(S, S); g.font = font; g.textBaseline = 'middle'; g.lineJoin = 'round';
      if (o.stroke) { g.strokeStyle = o.stroke; g.lineWidth = o.sw || 4; g.strokeText(txt, pad, th / 2); } g.fillStyle = col; g.fillText(txt, pad, th / 2); });
    return { cv, w: tw, h: th, pad };
  };
  // read a kept text canvas as a low-res alpha grid (for dotting, stitching, tiling)
  K.textGrid = (key, txt, font, step) => {
    const k = `kEgrid:${key}`; if (K[k]) return K[k];
    const m = XY.mk(4, 4).getContext('2d'); m.font = font; const w = Math.ceil(m.measureText(txt).width) + 20, h = Math.ceil(parseFloat(font.match(/(\d+(\.\d+)?)px/)[1]) * 1.4);
    const cw = Math.ceil(w / step), ch = Math.ceil(h / step), cv = XY.mk(cw, ch), g = cv.getContext('2d');
    g.scale(1 / step, 1 / step); g.font = font; g.textBaseline = 'middle'; g.fillStyle = '#000'; g.fillText(txt, 10, h / 2);
    const d = g.getImageData(0, 0, cw, ch).data, pts = []; for (let j = 0; j < ch; j++) for (let i = 0; i < cw; i++) if (d[(j * cw + i) * 4 + 3] > 110) pts.push(i * step, j * step);
    return (K[k] = { pts, w, h });
  };
})();
