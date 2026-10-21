// kit_b.js — shared helpers for team B's cells (10–18). Namespace: XY.KIT_B
// team(): the procession with per-figure control (hide / transform / alpha / skip parts) — same pen semantics as
// XY.drawProcession. figure(): one pilgrim drawn anywhere (kneeling, hanging, rising from water).
// Textures (silk, plaster, vellum), seals, vertical text, low-res layers.
(() => {
  'use strict';
  const XY = window.XY, TAU = XY.TAU;
  const NAMES = ['shaseng', 'bajie', 'monk', 'wukong'];

  // ------------------------------------------------------------ pilgrims
  const drawParts = (ctx, F, fi, pen, skip, cast) => {
    const col = pen.color || (r => XY.DEFAULT_COLORS[r]);
    F.parts.forEach((p, pi) => {
      if (skip && skip(p, pi)) return;
      if (cast && ((p.rider && cast.rider === false) || (p.prop && cast[p.prop] === false))) return;
      if (p.shade) { if (pen.shade === false || p.k !== 'poly') return; XY.path(ctx, p.pts, true); ctx.fillStyle = pen.shade || `rgba(20,12,4,${p.shade})`; ctx.fill(); return; }
      if (p.fine && pen.fine === false) return;
      const c = col(p.role, p, F.name); if (c == null) return;
      if (pen.part && pen.part(ctx, p, c, fi * 100 + pi, F.name) !== false) return;
      const seed = (pen.seed || 0) + fi * 1000 + pi * 7;
      if (p.k === 'dot') { ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, TAU); ctx.fillStyle = c; ctx.fill(); return; }
      let pts = p.pts; if (pen.wob) pts = XY.wobble(XY.densify(pts, 8, p.k === 'poly' || p.closed), pen.wob, seed);
      if (p.k === 'poly') {
        XY.path(ctx, pts, true); ctx.fillStyle = c; ctx.fill();
        if (pen.outline) { ctx.strokeStyle = pen.outline; ctx.lineWidth = pen.ow || 2; ctx.stroke(); }
      } else {
        XY.path(ctx, pts, !!p.closed);
        if (pen.outline && !pen.thinLines && !p.fine) { ctx.strokeStyle = pen.outline; ctx.lineWidth = p.w + 2 * (pen.ow || 2); ctx.stroke(); }
        ctx.strokeStyle = c; ctx.lineWidth = p.w; ctx.stroke();
      }
    });
  };
  // Membership follows the engine: XY.CURRENT_CAST (set by film.js per cell) overridden by acts.cast, as in drawProcession.
  // opt: { xf: {bajie: (ctx, F) => …}, alpha: {shaseng: 0.5}, skip: (name, part) => bool }
  const team = (ctx, w, ox, oy, pen, acts, opt) => {
    pen = pen || {}; opt = opt || {};
    const cast = Object.assign({}, XY.CURRENT_CAST || {}, (acts && acts.cast) || {});
    ctx.save(); ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    XY.procParts(w, acts).forEach((F, fi) => {
      if (cast[F.name] === false) return;
      const a = opt.alpha && opt.alpha[F.name] != null ? opt.alpha[F.name] : 1; if (a <= 0) return;
      ctx.save(); ctx.translate(ox + F.x, oy + F.y); if (a < 1) ctx.globalAlpha *= a;
      if (opt.xf && opt.xf[F.name]) opt.xf[F.name](ctx, F);
      drawParts(ctx, F, fi, pen, opt.skip ? (p => opt.skip(F.name, p)) : null, cast);
      ctx.restore();
    });
    ctx.restore();
  };
  // a single pilgrim with its feet at (x, y); o: { flip, kneel (0–1), bow (rad), rot, scale, skip }
  const LEGROLE = { bajie: 'bjpants', shaseng: 'ssrobe2', wukong: 'fur' };
  const figure = (ctx, name, w, x, y, pen, acts, o = {}) => {
    const F = XY.procParts(w, acts).find(f => f.name === name), fi = NAMES.indexOf(name); if (!F) return;
    pen = pen || {};
    ctx.save(); ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.translate(x, y);
    if (o.rot) ctx.rotate(o.rot);
    if (o.scale) ctx.scale(o.scale, o.scale);
    if (o.flip) ctx.scale(-1, 1);
    const kn = o.kneel || 0, legs = o.legs || (name === 'shaseng' ? 43 : 28);
    let skip = o.skip || null;
    if (kn > 0) {
      // legs folded under: drop the hips by the shin length, hide the standing legs, draw thigh + shin on the ground
      const drop = legs * 0.95 * kn, hipY = (name === 'shaseng' ? -79 : -51) + drop, lr = LEGROLE[name] || 'bjpants';
      const col = (pen.color || (r => XY.DEFAULT_COLORS[r]))(lr, null, name);
      const meanY = p => { if (p.k !== 'poly') return -999; let m = 0; for (let k = 1; k < p.pts.length; k += 2) m += p.pts[k]; return m / (p.pts.length / 2); };
      const legCut = name === 'shaseng' ? -80 : name === 'wukong' ? -50 : -1e3;
      skip = (p, pi) => (o.skip && o.skip(p, pi)) || (kn > 0.5 && ((p.role === lr && meanY(p) > legCut) || ((p.role === 'ink' || p.role === 'face') && meanY(p) > -20)));
      if (col && kn > 0.5) {
        const th = name === 'shaseng' ? 8 : 8.5;
        ctx.fillStyle = col; ctx.strokeStyle = pen.outline || 'rgba(0,0,0,0)'; ctx.lineWidth = pen.ow || 1.5;
        const knee = [legs * 0.75, -9], heel = [-legs * 0.55, -7];
        [[[4, hipY + 6], knee, th, th * 0.85], [knee, heel, th * 0.8, th * 0.6]].forEach(([a, b, r1, r2]) => { XY.path(ctx, XY.RIG.capsule(a, b, r1, r2), true); ctx.fill(); if (pen.outline) ctx.stroke(); });
        ctx.fillStyle = (pen.color || (r => XY.DEFAULT_COLORS[r]))('ink', null, name) || '#1C1712';
        XY.path(ctx, XY.ellipse(heel[0] - 6, heel[1] + 2, 9, 5, 12), true); ctx.fill();
      }
      ctx.translate(0, drop);
      if (o.bow) { const hp = name === 'shaseng' ? -79 : -51; ctx.translate(0, hp); ctx.rotate(o.bow); ctx.translate(0, -hp); }
    } else if (o.bow) { const hp = name === 'shaseng' ? -79 : -51; ctx.translate(0, hp); ctx.rotate(o.bow); ctx.translate(0, -hp); }
    drawParts(ctx, F, fi, pen, skip, Object.assign({}, XY.CURRENT_CAST || {}, (acts && acts.cast) || {}));
    ctx.restore();
  };
  // anchor of one figure drawn by figure() with the same options (approximate: kneel/bow ignored except the drop)
  const pen = (map, base = {}) => Object.assign({ color: (r, p, n) => (map[r] !== undefined ? map[r] : XY.DEFAULT_COLORS[r]) }, base);
  const SIL = col => ({ color: () => col });
  // device-pixel scratch layer with design transform; k = downsample factor (1 = full res)
  const layer = (key, e, k = 1) => { const S = e.S / k, cv = XY.scratch(key, Math.ceil(e.W * S), Math.ceil(e.H * S)), g = cv.getContext('2d'); g.setTransform(S, 0, 0, S, 0, 0); return [cv, g]; };
  const blit = (g, cv, e, alpha = 1, op) => { g.save(); g.setTransform(1, 0, 0, 1, 0, 0); if (op) g.globalCompositeOperation = op; g.globalAlpha = alpha; g.imageSmoothingEnabled = true; g.drawImage(cv, 0, 0, e.W * e.S, e.H * e.S); g.restore(); };

  // the procession painted into its own layer, then modelled: each band = [dx, dy, css] is the area NOT covered by the
  // silhouette shifted by (dx, dy) — i.e. a rim on the far side of every shape (shadow or light), clipped to the figures.
  // draw(lg) optionally paints the figures itself (e.g. extra figures); default is team() with pen/acts/opt.
  const shadedTeam = (g, e, pen, acts, opt, bands, draw) => {
    const [lay, lg] = layer('kb-lay', e), paint = (cx, pn, dx, dy) => draw ? draw(cx, pn, dx, dy) : team(cx, e.phase, e.procX + dx, e.groundY + dy, pn, acts, opt);
    paint(lg, pen, 0, 0);
    lg.setTransform(1, 0, 0, 1, 0, 0); lg.globalCompositeOperation = 'source-atop';
    bands.forEach(([dx, dy, col], i) => {
      const [m, mg] = layer('kb-band' + i, e); mg.setTransform(1, 0, 0, 1, 0, 0); mg.fillStyle = col; mg.fillRect(0, 0, m.width, m.height);
      mg.globalCompositeOperation = 'destination-out'; mg.setTransform(e.S, 0, 0, e.S, 0, 0); paint(mg, SIL('#000'), dx, dy);
      lg.drawImage(m, 0, 0);
    });
    blit(g, lay, e);
  };

  // ------------------------------------------------------------ media
  // silk (绢): base tone, warp and weft threads, slubs, age browning toward the edges, a few creases. Static (bg).
  const silk = (g, W, H, o = {}) => {
    const R = XY.rng(o.seed || 1501), base = o.base || '#D9C29A';
    g.fillStyle = base; g.fillRect(0, 0, W, H);
    g.globalAlpha = 1;
    for (let y = 0; y < H; y += 2.2) { g.fillStyle = `rgba(${R() < 0.5 ? '255,248,226' : '110,80,40'},${0.035 + 0.04 * R()})`; g.fillRect(0, y, W, 1); }
    for (let x = 0; x < W; x += 2.4) { g.fillStyle = `rgba(${R() < 0.5 ? '255,248,226' : '110,80,40'},${0.03 + 0.03 * R()})`; g.fillRect(x, 0, 1, H); }
    for (let k = 0; k < 160; k++) { g.fillStyle = 'rgba(120,90,50,0.10)'; g.fillRect(R() * W, R() * H, 6 + R() * 30, 1.2); }
    const vg = g.createRadialGradient(W * 0.5, H * 0.45, H * 0.25, W * 0.5, H * 0.5, W * 0.72); vg.addColorStop(0, 'rgba(110,70,30,0)'); vg.addColorStop(1, `rgba(90,56,24,${o.age == null ? 0.38 : o.age})`);
    g.fillStyle = vg; g.fillRect(0, 0, W, H);
    for (let k = 0; k < (o.creases || 3); k++) { const x = R() * W; g.strokeStyle = 'rgba(80,50,20,0.12)'; g.lineWidth = 2; g.beginPath(); g.moveTo(x, 0); for (let y = 0; y <= H; y += 30) g.lineTo(x + 6 * XY.noise1(y / 90, k + 7), y); g.stroke();
      g.strokeStyle = 'rgba(255,246,220,0.12)'; g.lineWidth = 1.4; g.stroke(); }
    for (let k = 0; k < 26; k++) { const x = R() * W, y = R() * H, r = 3 + R() * 18, rg = g.createRadialGradient(x, y, 0, x, y, r); rg.addColorStop(0, 'rgba(120,80,30,0.16)'); rg.addColorStop(1, 'rgba(120,80,30,0)'); g.fillStyle = rg; g.fillRect(x - r, y - r, 2 * r, 2 * r); }
  };
  // a red seal: 1–2 chars stacked, or 4 chars in 2×2 read right column first (白文 = white on red, 朱文 = red lines)
  const seal = (g, x, y, s, chars, white = true, col = '#B8301E') => {
    const cs = [...chars], four = cs.length > 2, n = four ? 2 : cs.length;
    g.save(); g.translate(x, y); g.globalAlpha = 0.86;
    if (white) { g.fillStyle = col; g.fillRect(0, 0, s, s); } else { g.strokeStyle = col; g.lineWidth = s * 0.07; g.strokeRect(s * 0.04, s * 0.04, s * 0.92, s * 0.92); }
    g.fillStyle = white ? '#F2E6CE' : col; g.font = XY.font((four ? s / 2 : s / n) * 0.82, XY.cnFont.li); g.textAlign = 'center'; g.textBaseline = 'middle';
    cs.forEach((c, k) => { const cx = four ? (k < 2 ? 0.75 : 0.25) * s : s / 2, cy = four ? (k % 2 ? 0.75 : 0.25) * s : (k + 0.5) * s / n; g.fillText(c, cx, cy); });
    g.restore();
  };
  const vtext = (g, str, x, y, px, family, col, lead = 1.08) => { g.save(); g.fillStyle = col; g.font = XY.font(px, family); g.textAlign = 'center'; g.textBaseline = 'middle';
    [...str].forEach((c, k) => g.fillText(c, x, y + k * px * lead)); g.restore(); };

  // ------------------------------------------------------------ local push-in (v10): call from a style's post()
  // zoom(u, [u0, u1, u2], zmax): 1 → zmax (ease out) over u0..u1, back to 1 by u2 (keep u2 < 0.85 so the seam lines up)
  const zoom = (u, k, zmax) => { const [u0, u1, u2] = k; if (u <= u0 || u >= u2) return 1; return u < u1 ? 1 + (zmax - 1) * XY.easeOut((u - u0) / (u1 - u0)) : 1 + (zmax - 1) * (1 - XY.smooth((u - u1) / (u2 - u1))); };
  // re-draw the finished panel scaled by z about the design point (cx, cy)
  const zoomPost = (canvas, g, e, cx, cy, z) => {
    if (!(z > 1.0005)) return;
    const cp = XY.scratch('kb-zoom', canvas.width, canvas.height); cp.getContext('2d').drawImage(canvas, 0, 0);
    g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'source-over'; g.globalAlpha = 1; g.clearRect(0, 0, canvas.width, canvas.height);
    const ox = cx * e.S, oy = cy * e.S; g.imageSmoothingQuality = 'high'; g.drawImage(cp, ox - ox * z, oy - oy * z, canvas.width * z, canvas.height * z); g.restore();
  };
  const B = b => b / 8;   // beat (of an 8-beat cell) → u

  XY.KIT_B = { team, figure, drawParts, pen, SIL, layer, blit, shadedTeam, silk, seal, vtext, zoom, zoomPost, B, NAMES };
})();
