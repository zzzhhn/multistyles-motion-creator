// kit_i.js — shared helpers for team I's cells (73–81). Namespace: XY.KIT_I
// K.draw is XY.drawProcession's loop with per-part control (hide / extra transform / tags), so a cell can take
// a weapon out of a hand, lift the rider off the horse or let a figure fall, while the rig still builds every shape.
(() => {
  'use strict';
  const XY = window.XY, TAU = XY.TAU;
  const K = XY.KIT_I = {};
  K.FIG = { shaseng: 0, bajie: 1, monk: 2, wukong: 3 };

  // ------------------------------------------------------------ part tags (structure of rig.js, read-only)
  // monk figure: parts after the saddle are the rider ('monk'), before it the horse ('horse');
  // wukong: the staff capsule + its two gold caps ('staff'); bajie: the shaft, bar, ring and nine teeth ('rake');
  // shaseng: the shoulder pole ('pole') and the two bundles ('bundle').
  const tagCache = new WeakMap();
  K.tags = (f, fi) => {
    let T = tagCache.get(f.parts); if (T) return T;
    const P = f.parts; T = new Array(P.length).fill('');
    if (fi === 2) { const s = P.findIndex(p => p.role === 'saddle'), hasR = P.some(p => p.rider); for (let i = 0; i < P.length; i++) T[i] = (hasR ? P[i].rider : i > s) ? 'monk' : 'horse'; }
    else if (fi === 3) { const s = P.findIndex(p => p.role === 'staff'); if (s >= 0) T[s] = T[s + 1] = T[s + 2] = 'staff'; }
    else if (fi === 1) { const s = P.findIndex(p => p.role === 'wood'); if (s >= 0) for (let i = s; i < P.length && (i === s || P[i].role === 'metal'); i++) T[i] = 'rake'; }
    else if (fi === 0) P.forEach((p, i) => { if (p.role === 'wood') T[i] = 'pole'; else if (p.role === 'bundle') T[i] = 'bundle'; });
    tagCache.set(f.parts, T); return T;
  };

  // paint one rig part exactly the way XY.drawProcession does
  K.paint = (ctx, p, c, pen, seed) => {
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
  };

  // the procession with per-part control.
  //   pen.color(role, part, fi, tag) → css | null;  pen.part(ctx, part, col, fi, pi, tag) → true if painted
  //   opt.skip(fi, pi, part, tag) → true hides the part (shading included)
  //   opt.xf(fi, pi, part, tag) → [a,b,c,d,e,f] extra transform in figure-local units, or null
  //   opt.only = figure index to draw just one figure
  K.draw = (ctx, w, ox, oy, pen, acts, opt) => {
    pen = pen || {}; opt = opt || {};
    const col = pen.color || (r => XY.DEFAULT_COLORS[r]);
    const F = XY.procParts(w, acts), cast = Object.assign({}, XY.CURRENT_CAST || {}, (acts && acts.cast) || {});
    ctx.save(); ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    F.forEach((f, fi) => {
      if (opt.only != null && opt.only !== fi) return;
      if (cast[f.name] === false && !opt.ignoreCast) return;   // same membership rule as XY.drawProcession (film.js sets XY.CURRENT_CAST)
      const T = K.tags(f, fi);
      ctx.save(); ctx.translate(ox + f.x, oy + f.y);
      f.parts.forEach((p, pi) => {
        const tag = T[pi];
        if (p.rider && cast.rider === false && !opt.ignoreCast) return;   // engine flags: rider off the horse, props taken away
        if (p.prop && cast[p.prop] === false && !opt.ignoreCast) return;
        if (opt.skip && opt.skip(fi, pi, p, tag)) return;
        const m = opt.xf && opt.xf(fi, pi, p, tag);
        if (m) { ctx.save(); ctx.transform(m[0], m[1], m[2], m[3], m[4], m[5]); }
        if (p.shade) {
          if (pen.shade !== false && p.k === 'poly') { XY.path(ctx, p.pts, true); ctx.fillStyle = pen.shade || `rgba(20,12,4,${p.shade})`; ctx.fill(); }
        } else if (!(p.fine && pen.fine === false)) {
          const c = col(p.role, p, fi, tag);
          if (c != null && !(pen.part && pen.part(ctx, p, c, fi, pi, tag))) K.paint(ctx, p, c, pen, (pen.seed || 0) + fi * 1000 + pi * 7);
        }
        if (m) ctx.restore();
      });
      ctx.restore();
    });
    ctx.restore();
  };
  // figure x offsets inside the procession (procession-local → figure-local is p - [figX, 0])
  K.figX = (w, acts, fi) => XY.procParts(w, acts)[fi].x;
  // matrix: rotate by a and scale by s about pivot (px, py), then translate by (dx, dy)
  K.around = (px, py, a, s, dx, dy) => { const c = Math.cos(a) * s, sn = Math.sin(a) * s; return [c, sn, -sn, c, px + dx - (c * px - sn * py), py + dy - (sn * px + c * py)]; };

  // ------------------------------------------------------------ device-pixel layers
  K.layer = (e, key) => { const c = XY.scratch(key, Math.round(e.W * e.S), Math.round(e.H * e.S)), g = c.getContext('2d'); g.setTransform(e.S, 0, 0, e.S, 0, 0); return [c, g]; };
  K.blit = (g, cv, alpha = 1, op, dx = 0, dy = 0) => { g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = alpha; if (op) g.globalCompositeOperation = op; g.drawImage(cv, dx, dy); g.restore(); };
  K.tint = (src, key, col) => { const c = XY.scratch(key, src.width, src.height), g = c.getContext('2d'); g.drawImage(src, 0, 0); g.globalCompositeOperation = 'source-in'; g.fillStyle = col; g.fillRect(0, 0, c.width, c.height); return c; };
  // a solid border of radius r (device px) around a layer's silhouette, returned as its own layer (draw it under the source)
  K.border = (src, key, col, r, n = 12) => {
    const t = K.tint(src, key + ':t', col), c = XY.scratch(key, src.width, src.height), g = c.getContext('2d');
    for (let k = 0; k < n; k++) { const a = k / n * TAU; g.drawImage(t, Math.cos(a) * r, Math.sin(a) * r); }
    g.drawImage(t, 0, 0); return c;
  };
  // cel band: the part of a layer's silhouette not covered by the same silhouette shifted by (dx, dy) device px, tinted;
  // shift right → band on the left edges. Paint it onto the layer with K.blitOn(layer, band, 'source-atop').
  K.edge = (src, key, dx, dy, col) => {
    const c = XY.scratch(key, src.width, src.height), g = c.getContext('2d');
    g.drawImage(src, 0, 0); g.globalCompositeOperation = 'destination-out'; g.drawImage(src, dx, dy);
    g.globalCompositeOperation = 'source-in'; g.fillStyle = col; g.fillRect(0, 0, c.width, c.height); return c;
  };
  K.blitOn = (dst, src, op = 'source-atop', alpha = 1) => { const g = dst.getContext('2d'); g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = op; g.globalAlpha = alpha; g.drawImage(src, 0, 0); g.restore(); };
  // texture a layer in place: pattern drawn source-atop (only where the layer has paint)
  K.texture = (cv, tile, alpha = 1, op = 'source-atop', ox = 0, oy = 0) => {
    const g = cv.getContext('2d'), p = g.createPattern(tile, 'repeat');
    g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = op; g.globalAlpha = alpha; g.translate(ox, oy); g.fillStyle = p; g.fillRect(-ox, -oy, cv.width, cv.height); g.restore();
  };
  // seeded noise tile (device px), painted once: dots of the given colours
  K.speckle = (key, size, n, cols, rmin, rmax, seed) => XY.keep(key, size, size, cv => {
    const g = cv.getContext('2d'), r = XY.rng(seed);
    for (let i = 0; i < n; i++) { const x = r() * size, y = r() * size, rr = rmin + r() * (rmax - rmin); g.fillStyle = cols[Math.floor(r() * cols.length)];
      for (const dx of [-size, 0, size]) for (const dy of [-size, 0, size]) g.fillRect(x + dx, y + dy, rr, rr); }
  });

  // ------------------------------------------------------------ text → points (cached, design units relative to box origin)
  const tp = new Map();
  K.textPts = (key, lines, font, w, h, step, lh) => {
    if (tp.has(key)) return tp.get(key);
    const k = 2, cv = XY.mk(w * k, h * k), g = cv.getContext('2d');
    g.scale(k, k); g.fillStyle = '#000'; g.font = font; g.textBaseline = 'middle'; g.textAlign = 'center';
    lines.forEach((s, i) => g.fillText(s, w / 2, h / 2 + (i - (lines.length - 1) / 2) * (lh || h)));
    const d = g.getImageData(0, 0, cv.width, cv.height).data, o = [];
    for (let y = 0; y < h; y += step) for (let x = 0; x < w; x += step) { const i = (Math.round(y * k) * cv.width + Math.round(x * k)) * 4 + 3; if (d[i] > 120) o.push(x, y); }
    const a = new Float32Array(o); tp.set(key, a); return a;
  };

  // ------------------------------------------------------------ timing
  K.hit = (beat, k, dec = 6) => (beat < k ? 0 : Math.exp(-(beat - k) * dec));      // spike on beat k
  K.win = (x, a, b) => XY.clamp((x - a) / (b - a));
  K.outBack = (u, s = 1.70158) => { u = XY.clamp(u); const v = u - 1; return 1 + (s + 1) * v * v * v + s * v * v; };
  K.step = (t, fps) => Math.floor(t * fps) / fps;                                   // stop-motion time
  K.tri = x => 1 - Math.abs(((x % 2) + 2) % 2 - 1);
})();
