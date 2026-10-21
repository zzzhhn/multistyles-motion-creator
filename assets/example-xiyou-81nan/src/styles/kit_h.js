// kit_h.js — shared helpers for team H's cells (64–72). Namespace: XY.KIT_H
// 5×7 bitmap font, low-res sprite pass (alpha threshold, palette snap, 1px outline), per-figure procession drawing
// (so a cell can lift the rider off the horse or transform one pilgrim), vector stroke digits, timing windows.
(() => {
  'use strict';
  const XY = window.XY, TAU = XY.TAU;
  const K = XY.KIT_H = {};

  // ------------------------------------------------------------ timing
  K.win = (u, a, b, r = 0.06) => XY.smooth((u - a) / r) * (1 - XY.smooth((u - b) / r));   // 0→1 at a, 1→0 at b
  K.step = (t, fps) => Math.floor(t * fps) / fps;

  // ------------------------------------------------------------ 5×7 bitmap font
  const G5 = {
    '0': '.###.#...##..###.#.###..##...#.###.', '1': '..#...##....#....#....#....#...###.', '2': '.###.#...#....#...#...#...#...#####',
    '3': '#####...#...#.....#....##...#.###.', '4': '...#...##..#.#.#..#.#####...#....#.', '5': '######....####.....#....##...#.###.',
    '6': '..##..#...#....####.#...##...#.###.', '7': '#####....#...#...#...#....#....#...', '8': '.###.#...##...#.###.#...##...#.###.',
    '9': '.###.#...##...#.####....#...#..##..', A: '.###.#...##...#######...##...##...#', B: '####.#...##...#####.#...##...#####.',
    C: '.###.#...##....#....#....#...#.###.', D: '###..#..#.#...##...##...##..#.###..', E: '######....#....####.#....#....#####',
    F: '######....#....####.#....#....#....', G: '.###.#...##....#.####...##...#.####', H: '#...##...##...#######...##...##...#',
    I: '.###...#....#....#....#....#...###.', J: '..###...#....#....#....##..#..##...', K: '#...##..#.#.#..##...#.#..#..#.#...#',
    L: '#....#....#....#....#....#....#####', M: '#...###.###.#.##.#.##...##...##...#', N: '#...##...###..##.#.##..###...##...#',
    O: '.###.#...##...##...##...##...#.###.', P: '####.#...##...#####.#....#....#....', Q: '.###.#...##...##...##.#.##..#..##.#',
    R: '####.#...##...#####.#.#..#..#.#...#', S: '.#####....#.....###.....#....#####.', T: '#####..#....#....#....#....#....#..',
    U: '#...##...##...##...##...##...#.###.', V: '#...##...##...##...##...#.#.#...#..', W: '#...##...##...##.#.##.#.##.#..#.#.',
    X: '#...##...#.#.#...#...#.#.#...##...#', Y: '#...##...#.#.#...#....#....#....#..', Z: '#####....#...#...#...#...#....#####',
    ':': '......##...##.........##...##......', '-': '...............#####...............', '.': '.........................##...##..',
    '/': '....#....#...#...#...#...#....#....', 'x': '..........#...#.#.#...#...#.#.#...#', '!': '..#....#....#....#....#.........#..',
    '?': '.###.#...#....#...#...#.........#..', '+': '.......#....#..#####..#....#.......', '>': '#....##...###..####.###..##...#....',
    '<': '....#...##..###.####..###...##....#', 'h': '......#.#.#####################.###...#..', '*': '.....#.#.#.###.#####.###.#.#.#.....',
    '=': '..........#####.....#####..........', ' ': '...................................', '%': '##...##..#...#...#...#...#..##...##',
    ',': '.....................##...##..#....', "'": '..#....#...#........................', '|': '..#....#....#....#....#....#....#..',
  };
  G5.h = '......#.#.##########.###...#.......';                       // heart
  const R5 = (...rows) => rows.join('');
  G5['3'] = R5('#####', '...#.', '..#..', '...#.', '....#', '#...#', '.###.'); G5.W = R5('#...#', '#...#', '#...#', '#.#.#', '#.#.#', '#.#.#', '.#.#.');
  G5['.'] = R5('.....', '.....', '.....', '.....', '.....', '.##..', '.##..'); G5[':'] = R5('.....', '.##..', '.##..', '.....', '.##..', '.##..', '.....');
  const BITS = {}; for (const k in G5) { const s = G5[k], b = []; for (let i = 0; i < 35; i++) if (s[i] === '#') b.push(i % 5, Math.floor(i / 5)); BITS[k] = b; }
  K.pixW = (s, p) => s.length * 6 * p - p;
  // draw string s with pixel size p at (x, y) top-left; returns the advance width
  K.pixText = (g, s, x, y, p, col, shadow, sp = 6) => {
    s = String(s);
    const pass = (dx, c) => { g.fillStyle = c; for (let i = 0; i < s.length; i++) { const b = BITS[s[i]] || BITS[s[i].toUpperCase()] || BITS['?'], ox = x + i * sp * p + dx;
      for (let k = 0; k < b.length; k += 2) g.fillRect(ox + b[k] * p, y + b[k + 1] * p + (dx ? p : 0), p, p); } };
    if (shadow) pass(p, shadow);
    pass(0, col);
    return s.length * sp * p - p;
  };

  // ------------------------------------------------------------ low-res layers and the sprite pass
  // Canvases we read back (getImageData) are created CPU-backed from the start: Chrome may otherwise move a canvas from
  // GPU to CPU after a few readbacks, which changes path anti-aliasing and would make the same t render differently.
  const cpuPool = new Map();
  K.cpu = (key, w, h) => { w = Math.max(1, Math.round(w)); h = Math.max(1, Math.round(h)); const k = `${key}:${w}x${h}`; let c = cpuPool.get(k);
    if (!c) { c = document.createElement('canvas'); c.width = w; c.height = h; c.getContext('2d', { willReadFrequently: true }); cpuPool.set(k, c); }
    const g = c.getContext('2d'); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over'; g.filter = 'none'; g.clearRect(0, 0, w, h); return c; };
  const kjPool = new Map();
  // thresholded bitmap kanji (cartridge / camcorder-titler look): rendered once at px pixels, alpha cut hard
  K.kanji = (s, px, col, weight) => { const key = `${s}:${px}:${col}:${weight || ''}`; if (kjPool.has(key)) return kjPool.get(key);
    const cv = document.createElement('canvas'); cv.width = Math.ceil(px * s.length * 1.04) + 2; cv.height = px + 3;
    const g = cv.getContext('2d', { willReadFrequently: true }), small = px < 15, thr = small ? 150 : 120;
    g.font = XY.font(px, '"PingFang SC", "Heiti SC", sans-serif', weight || (small ? '600' : '900'));   // PingFang only: a GB fallback rendered 难 as a 難-like blob
    g.textBaseline = 'top'; g.fillStyle = col; g.fillText(s, 1, 1);
    const im = g.getImageData(0, 0, cv.width, cv.height), d = im.data, [r, gg, b] = K.hex(col);
    for (let i = 0; i < d.length; i += 4) { if (d[i + 3] < thr) d[i + 3] = 0; else { d[i] = r; d[i + 1] = gg; d[i + 2] = b; d[i + 3] = 255; } }
    g.putImageData(im, 0, 0); kjPool.set(key, cv); return cv; };
  // a scratch layer of ceil(W/k)×ceil(H/k) pixels whose context is pre-scaled to design units
  K.lo = (key, W, H, k) => { const c = XY.scratch(key, Math.ceil(W / k), Math.ceil(H / k)), g = c.getContext('2d'); g.setTransform(1 / k, 0, 0, 1 / k, 0, 0); return [c, g]; };
  K.hex = h => { h = h.replace('#', ''); return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]; };
  // alpha threshold → hard edges; optional palette snap (array of [r,g,b]); optional 1px outer outline [r,g,b]
  K.spriteize = (c, pal, out, thr = 110) => {
    const w = c.width, h = c.height, g = c.getContext('2d'), im = g.getImageData(0, 0, w, h), d = im.data, n = w * h, m = new Uint8Array(n);
    for (let i = 0; i < n; i++) { const o = i * 4; if (d[o + 3] < thr) { d[o + 3] = 0; continue; } m[i] = 1;
      const a = d[o + 3] / 255; let r = d[o] / a, gg = d[o + 1] / a, b = d[o + 2] / a;   // un-premultiply edge pixels
      if (a > 0.99) { r = d[o]; gg = d[o + 1]; b = d[o + 2]; }
      if (pal) { let best = 0, bd = 1e9; for (let q = 0; q < pal.length; q++) { const p = pal[q], dr = r - p[0], dg = gg - p[1], db = b - p[2], dd = dr * dr * 0.3 + dg * dg * 0.59 + db * db * 0.11; if (dd < bd) { bd = dd; best = q; } }
        r = pal[best][0]; gg = pal[best][1]; b = pal[best][2]; }
      d[o] = r; d[o + 1] = gg; d[o + 2] = b; d[o + 3] = 255; }
    if (out) for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const i = y * w + x; if (m[i]) continue;
      if ((x > 0 && m[i - 1]) || (x < w - 1 && m[i + 1]) || (y > 0 && m[i - w]) || (y < h - 1 && m[i + w])) { const o = i * 4; d[o] = out[0]; d[o + 1] = out[1]; d[o + 2] = out[2]; d[o + 3] = 255; } }
    g.putImageData(im, 0, 0); return c;
  };
  // blit a low-res layer onto a design-unit context with hard pixels
  K.blit = (g, c, x, y, w, h) => { g.save(); g.imageSmoothingEnabled = false; g.drawImage(c, x, y, w, h); g.restore(); };

  // ------------------------------------------------------------ the procession, figure by figure
  // Same painting rules as XY.drawProcession, plus: xf(F, ctx) may transform a figure (return false to skip it),
  // pen.skip(part, index, F) drops single parts. Lets a cell lift the rider off the horse, shrink one pilgrim, etc.
  K.drawFigs = (ctx, w, ox, oy, pen, acts, xf) => {
    pen = pen || {}; const col = pen.color || (r => XY.DEFAULT_COLORS[r]);
    ctx.save(); ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    const cast = Object.assign({}, XY.CURRENT_CAST || {}, (acts && acts.cast) || {});   // same membership rule as XY.drawProcession
    XY.procParts(w, acts).forEach((F, fi) => {
      if (cast[F.name] === false) return;
      ctx.save(); ctx.translate(ox + F.x, oy + F.y);
      if (xf && xf(F, ctx) === false) { ctx.restore(); return; }
      F.parts.forEach((p, pi) => {
        if (p.rider && cast.rider === false) return; if (p.prop && cast[p.prop] === false) return;
        if (pen.skip && pen.skip(p, pi, F)) return;
        if (p.shade) { if (pen.shade === false || p.k !== 'poly') return; XY.path(ctx, p.pts, true); ctx.fillStyle = pen.shade || `rgba(20,12,4,${p.shade})`; ctx.fill(); return; }
        if (p.fine && pen.fine === false) return;
        const c = col(p.role, p); if (c == null) return;
        if (pen.part && pen.part(ctx, p, c, fi * 1000 + pi, F) !== false) return;
        const seed = (pen.seed || 0) + fi * 1000 + pi * 7;
        if (p.k === 'dot') { ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, TAU); ctx.fillStyle = c; ctx.fill(); return; }
        let pts = p.pts; if (pen.wob) pts = XY.wobble(XY.densify(pts, 8, p.k === 'poly' || p.closed), pen.wob, seed);
        if (p.k === 'poly') { XY.path(ctx, pts, true); ctx.fillStyle = c; ctx.fill(); if (pen.outline) { ctx.strokeStyle = pen.outline; ctx.lineWidth = pen.ow || 2; ctx.stroke(); } }
        else { XY.path(ctx, pts, !!p.closed); if (pen.outline && !pen.thinLines && !p.fine) { ctx.strokeStyle = pen.outline; ctx.lineWidth = p.w + 2 * (pen.ow || 2); ctx.stroke(); } ctx.strokeStyle = c; ctx.lineWidth = p.w; ctx.stroke(); }
      });
      ctx.restore();
    });
    ctx.restore();
  };
  // index of the first part of Tang Seng himself inside the 'monk' figure (everything before it is horse and tack)
  K.riderStart = F => { const i = F.parts.findIndex(p => p.rider); return i < 0 ? F.parts.length : i; };   // rig marks the rider's parts with p.rider
  // post-pass push-in: scale the finished panel by z around design point (cx, cy); call from a style's post(canvas, g, e)
  // (draws the canvas onto itself: Chrome snapshots the source first; a separate temp canvas made the first use render differently)
  K.zoomPost = (canvas, g, e, cx, cy, z) => { if (z <= 1.0005) return; const w = canvas.width, h = canvas.height;
    g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.imageSmoothingEnabled = true; const X = cx * e.S, Y = cy * e.S;
    g.drawImage(canvas, X - X * z, Y - Y * z, w * z, h * z); g.restore(); };
  // a push-in envelope: rises over `rise` beats from b0, holds, falls back to 1 by b1 (keep b1 well before u = 0.85)
  K.push = (beat, b0, b1, amt = 0.14, rise = 0.25) => 1 + amt * XY.smooth((beat - b0) / rise) * (1 - XY.smooth((beat - (b1 - 0.6)) / 0.6));
  K.fig = (w, acts, name) => XY.procParts(w, acts).find(F => F.name === name);
  K.pen = (map, outline, ow, extra) => Object.assign({ color: r => (r in map ? map[r] : XY.DEFAULT_COLORS[r]), outline, ow }, extra || {});

  // ------------------------------------------------------------ vector stroke digits (4 wide × 6 tall box)
  const V = { '0': [[0, 0, 4, 0, 4, 6, 0, 6, 0, 0], [4, 0, 0, 6]], '1': [[1, 1, 2, 0, 2, 6], [1, 6, 3, 6]], '2': [[0, 1, 1, 0, 3, 0, 4, 1, 4, 2, 0, 6, 4, 6]],
    '3': [[0, 0, 4, 0, 2, 2.6, 4, 4, 3.6, 5.6, 2.8, 6, 0, 6]], '4': [[3, 6, 3, 0, 0, 4, 4, 4]], '5': [[4, 0, 0, 0, 0, 2.6, 3, 2.6, 4, 3.6, 4, 5, 3, 6, 0, 6]],
    '6': [[3.6, 0, 1, 0, 0, 1.6, 0, 6, 4, 6, 4, 3, 0, 3]], '7': [[0, 0, 4, 0, 1.4, 6]], '8': [[0, 0, 4, 0, 4, 2.6, 0, 2.6, 0, 0], [0, 2.6, 0, 6, 4, 6, 4, 2.6]],
    '9': [[4, 3, 0, 3, 0, 0, 4, 0, 4, 4.4, 3, 6, 0.4, 6]], '-': [[0.6, 3, 3.4, 3]], '/': [[4, 0, 0, 6]], ' ': [] };
  K.vecText = (g, s, x, y, h, lw) => { const k = h / 6; g.lineWidth = lw; g.lineJoin = 'round'; g.lineCap = 'round'; let ox = x;
    for (const ch of String(s)) { (V[ch] || []).forEach(L => { g.beginPath(); for (let i = 0; i < L.length; i += 2) g[i ? 'lineTo' : 'moveTo'](ox + L[i] * k, y + L[i + 1] * k); g.stroke(); }); ox += 6 * k; }
    return ox - x - 2 * k; };
})();
