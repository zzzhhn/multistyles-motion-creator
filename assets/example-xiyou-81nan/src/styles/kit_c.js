// kit_c.js — shared helpers for team C's cells (19–27). Namespace: XY.KIT_C
// Figure isolation (draw one pilgrim on his own path / hide one), scratch layers in device pixels, cheap blur,
// low-resolution pixel textures for bg(), paper fibres, crack networks, vertical text and beat envelopes.
(() => {
  'use strict';
  const XY = window.XY, TAU = XY.TAU;
  const K = XY.KIT_C = {};
  K.FX = { shaseng: -300, bajie: -150, monk: 40, wukong: 245 };   // figure offsets inside the procession (rig.js FIGS)

  // Who is drawn is decided by rig.js's cast (XY.CURRENT_CAST from film.js, overridden per call with acts.cast).
  // K.cast(acts, { wukong: false }) → acts with a cast override merged in; the rig memo ignores cast, so this is free.
  K.cast = (acts, cast) => Object.assign({}, acts, { cast: Object.assign({}, (acts && acts.cast) || {}, cast) });
  K.solo = name => { const c = {}; Object.keys(K.FX).forEach(n => { c[n] = n === name; }); return c; };
  // one figure with its feet origin at (x, y) in panel units; o = { s, rot, flip, w } (w: freeze/override walk phase)
  K.fig = (g, e, acts, name, pen, x, y, o = {}) => {
    const w = o.w == null ? e.phase : o.w, s = o.s == null ? 1 : o.s;
    g.save(); g.translate(x, y); if (o.rot) g.rotate(o.rot); g.scale(s * (o.flip ? -1 : 1), s);
    XY.drawProcession(g, w, -K.FX[name], 0, pen, K.cast(acts, K.solo(name)));
    g.restore();
  };
  // panel position of a figure's rig anchor when that figure is drawn with K.fig(…, x, y, o)
  K.figPoint = (e, acts, name, key, x, y, o = {}) => {
    const w = o.w == null ? e.phase : o.w, s = o.s == null ? 1 : o.s, p = XY.anchor(name + '.' + key, w, acts), r = o.rot || 0;
    const lx = (p[0] - K.FX[name]) * s * (o.flip ? -1 : 1), ly = p[1] * s;
    return [x + lx * Math.cos(r) - ly * Math.sin(r), y + lx * Math.sin(r) + ly * Math.cos(r)];
  };
  // Rider only: rig.js tags 唐僧's rider parts with p.rider; cast { rider: false } hides them (horse walks on saddled),
  // and this pen draws nothing but them (for a rider lifted off the horse).
  K.riderPen = pen => Object.assign({}, pen, { shade: false, color: (r, p) => (p && p.rider ? (pen.color ? pen.color(r, p) : XY.DEFAULT_COLORS[r]) : null) });
  // figure foot origin in panel coordinates when it walks in the procession
  K.home = (e, name) => [e.procX + K.FX[name], e.groundY];

  // ------------------------------------------------------------ layers (device pixels)
  // Local push-in (v10): K.push(g, e, cx, cy, k) at the top of draw() zooms the whole panel about (cx, cy) by k —
  // it re-blits the cached bg under the zoom, and every K.layer created this frame inherits the same zoom.
  K.PUSH = null;
  K.push = (g, e, cx, cy, k) => {
    K.PUSH = null; if (!(k > 1.0005)) return false;
    const st = XY.STYLES[e.cell.style], c = e.cell;
    const bg = st.bg ? XY.cached(`bg:${c.n}:${e.S.toFixed(4)}`, c.w * e.S, e.H * e.S, cv => { const q = cv.getContext('2d'); q.setTransform(e.S, 0, 0, e.S, 0, 0); st.bg(q, c.w, e.H, c, e.S); }) : null;
    g.translate(cx, cy); g.scale(k, k); g.translate(-cx, -cy); if (bg) g.drawImage(bg, 0, 0, e.W, e.H);
    K.PUSH = [cx, cy, k, c.n, e.t]; return true;   // stamped: only this panel at this time inherits the zoom
  };
  K.pushOf = (b, b0, b1, b2, amt) => 1 + amt * XY.smooth((b - b0) / (b1 - b0)) * (1 - XY.smooth((b - b1 - 0.6) / (b2 - b1 - 0.6)));   // ramp in b0→b1, hold 0.6, out by b2
  K.layer = (e, key) => { const cv = XY.scratch(key, Math.round(e.W * e.S), Math.round(e.H * e.S)), lg = cv.getContext('2d'); lg.setTransform(e.S, 0, 0, e.S, 0, 0); lg.lineJoin = 'round'; lg.lineCap = 'round';
    const P = K.PUSH; if (P && P[3] === e.cell.n && P[4] === e.t) { lg.translate(P[0], P[1]); lg.scale(P[2], P[2]); lg.translate(-P[0], -P[1]); } return [cv, lg]; };
  K.blit = (g, cv, alpha = 1, op = 'source-over') => { g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = alpha; g.globalCompositeOperation = op; g.drawImage(cv, 0, 0); g.restore(); };
  // cheap blur: shrink by k (two steps) and stretch back; returns a small canvas to draw scaled with K.blitSoft
  K.shrink = (cv, k, key) => {
    const w1 = Math.max(1, Math.round(cv.width / 2)), h1 = Math.max(1, Math.round(cv.height / 2)), a = XY.scratch(key + 'a', w1, h1);
    a.getContext('2d').drawImage(cv, 0, 0, w1, h1);
    const w2 = Math.max(1, Math.round(cv.width / k)), h2 = Math.max(1, Math.round(cv.height / k)), b = XY.scratch(key + 'b', w2, h2), bg = b.getContext('2d');
    bg.imageSmoothingQuality = 'high'; bg.drawImage(a, 0, 0, w2, h2); return b;
  };
  K.blitSoft = (g, cv, k, alpha = 1, op = 'source-over', key = 'kc-soft', dx = 0, dy = 0) => {
    const sm = K.shrink(cv, k, key);
    g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = alpha; g.globalCompositeOperation = op; g.imageSmoothingQuality = 'high';
    g.drawImage(sm, dx, dy, cv.width, cv.height); g.restore();
  };
  // fill everything already on a layer with css/pattern (keeps alpha): tint, or knock to a silhouette
  K.tint = (lg, fill, alpha = 1, op = 'source-atop') => { lg.save(); lg.setTransform(1, 0, 0, 1, 0, 0); lg.globalAlpha = alpha; lg.globalCompositeOperation = op; lg.fillStyle = fill; lg.fillRect(0, 0, lg.canvas.width, lg.canvas.height); lg.restore(); };

  // ------------------------------------------------------------ textures for bg()
  // per-pixel texture at 1/k of the device resolution; fn(x, y) in design units → [r, g, b, a(0..255)]
  K.pix = (W, H, scale, k, fn) => {
    const w = Math.max(1, Math.ceil(W * scale / k)), h = Math.max(1, Math.ceil(H * scale / k)), cv = XY.mk(w, h), g = cv.getContext('2d'), im = g.createImageData(w, h), d = im.data, f = k / scale;
    for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) { const c = fn(i * f, j * f), o = (j * w + i) * 4; d[o] = c[0]; d[o + 1] = c[1]; d[o + 2] = c[2]; d[o + 3] = c.length > 3 ? c[3] : 255; }
    g.putImageData(im, 0, 0); return cv;
  };
  K.paint = (g, cv, W, H, op = 'source-over', alpha = 1) => { g.save(); g.globalCompositeOperation = op; g.globalAlpha = alpha; g.imageSmoothingQuality = 'high'; g.drawImage(cv, 0, 0, W, H); g.restore(); };
  // paper fibres / brush hairs: n short strokes
  K.fibres = (g, x0, y0, w, h, n, seed, cols, len = [4, 16], lw = [0.4, 1.1], ang = null) => {
    const R = XY.rng(seed);
    for (let i = 0; i < n; i++) {
      const x = x0 + R() * w, y = y0 + R() * h, a = ang == null ? R() * Math.PI : ang + (R() - 0.5) * 0.5, l = len[0] + R() * (len[1] - len[0]);
      g.strokeStyle = cols[Math.floor(R() * cols.length)]; g.lineWidth = lw[0] + R() * (lw[1] - lw[0]);
      g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + Math.cos(a) * l * 0.5 + (R() - 0.5) * 3, y + Math.sin(a) * l * 0.5 + (R() - 0.5) * 3, x + Math.cos(a) * l, y + Math.sin(a) * l); g.stroke();
    }
  };
  // a crack network: random-walk polylines with branches (fresco plaster, glaze crackle, varnish craquelure)
  K.cracks = (g, x0, y0, w, h, n, seed, col, lw = 1, step = 9, len = 26) => {
    const R = XY.rng(seed); g.strokeStyle = col; g.lineCap = 'round'; g.lineJoin = 'round';
    const walk = (x, y, a, m, wd) => {
      g.lineWidth = wd; g.beginPath(); g.moveTo(x, y);
      for (let k = 0; k < m; k++) { a += (R() - 0.5) * 0.9; x += Math.cos(a) * step; y += Math.sin(a) * step; g.lineTo(x, y);
        if (R() < 0.12 && wd > 0.35) { g.stroke(); walk(x, y, a + (R() < 0.5 ? 1 : -1) * (0.8 + R() * 0.8), Math.floor(m * 0.5), wd * 0.7); g.lineWidth = wd; g.beginPath(); g.moveTo(x, y); } }
      g.stroke();
    };
    for (let i = 0; i < n; i++) walk(x0 + R() * w, y0 + R() * h, R() * TAU, Math.floor(len * (0.5 + R())), lw * (0.6 + R() * 0.6));
  };
  // grain tile (device px) for post(): monochrome noise, alpha in [0, amp]
  K.grainTile = (key, T, seed, amp, dark = true) => XY.keep(key, T, T, cv => {
    const g = cv.getContext('2d'), im = g.createImageData(T, T), d = im.data;
    for (let i = 0; i < T * T; i++) { const v = XY.hash(i, seed); d[i * 4] = d[i * 4 + 1] = d[i * 4 + 2] = dark ? 20 : 250; d[i * 4 + 3] = Math.floor(255 * amp * v * v); }
    g.putImageData(im, 0, 0);
  });
  K.grain = (g, canvas, tile, t, fps = 12, op = 'source-over', alpha = 1) => {
    const f = Math.floor(t * fps), pat = g.createPattern(tile, 'repeat');
    pat.setTransform(new DOMMatrix().translateSelf(Math.floor(XY.hash(f, 1) * tile.width), Math.floor(XY.hash(f, 2) * tile.height)));
    g.save(); g.globalCompositeOperation = op; g.globalAlpha = alpha; g.fillStyle = pat; g.fillRect(0, 0, canvas.width, canvas.height); g.restore();
  };

  // ------------------------------------------------------------ text and timing
  K.vtext = (g, s, x, y, size, gap = 1.08) => { g.save(); g.textAlign = 'center'; g.textBaseline = 'middle'; [...s].forEach((ch, i) => g.fillText(ch, x, y + size * (0.5 + i * gap))); g.restore(); };
  K.win = (u, a, b) => XY.smooth((u - a) / (b - a));
  K.bump = (u, a, b, c, d) => XY.smooth((u - a) / (b - a)) * (1 - XY.smooth((u - c) / (d - c)));
  K.back = (x, s = 1.7) => { x = XY.clamp(x); const y = x - 1; return 1 + (s + 1) * y * y * y + s * y * y; };   // ease-out with overshoot
  // envelope that snaps on at beat b and decays (beats); 0 before
  K.hit = (e, b, decay = 0.6) => { const k = e.beat - b; return k < 0 ? 0 : Math.exp(-k / decay); };
  // colour mix of two #rrggbb → rgb() string
  const hx = h => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
  K.mix = (a, b, f) => { const A = hx(a), B = hx(b); return `rgb(${Math.round(XY.lerp(A[0], B[0], f))},${Math.round(XY.lerp(A[1], B[1], f))},${Math.round(XY.lerp(A[2], B[2], f))})`; };
  // quantised time for frame-stable jitter
  K.tick = (t, fps = 12) => Math.floor(t * fps);
})();
