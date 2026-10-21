// 71 低多边形 · 1995 年 · 隐雾山遇魔 — a PS1-era fogged mountain: flat-shaded triangle fans, vertices snapped to a coarse
// grid, distance fog, the frame rendered at 1/2.5 and blown up with hard pixels over a Bayer dither. Beat 2: the facets
// round the cave on 隐雾山 break loose and fly together into a low-poly leopard (艾叶花皮豹子精) that pounces down the slope.
// Beat 3: a pink five-petal plum blossom flashes behind it and it splits — 分瓣梅花计 — three flickering fakes run at 悟空,
// 八戒 and 沙僧 and shatter, the real one stays crouched, eyes on Tang Seng. Pilgrims: each part cut to ≤ 7 vertices, snapped, fan-shaded.
(() => {
  'use strict';
  const XY = window.XY, K = XY.KIT_H, TAU = XY.TAU, { sin, cos, PI, hypot, round, floor } = Math;
  const KP = 2.5, LX = -0.6, LY = -0.8, FOG = [184, 196, 200];
  const RGB = {}; const rgbOf = c => RGB[c] || (RGB[c] = c[0] === '#' ? K.hex(c) : c.match(/\d+/g).slice(0, 3).map(Number));
  const sn = v => round(v / 3) * 3;
  const mixc = (a, b, f) => [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, a[2] + (b[2] - a[2]) * f];
  // fan-triangulate a polygon from its centroid; each facet lit by the direction of its outer edge; fog mixes toward FOG
  const facet = (g, pts, rgb, fog = 0, k = 1, snap = true) => {
    const n = pts.length / 2; let cx = 0, cy = 0; for (let i = 0; i < n; i++) { cx += pts[2 * i]; cy += pts[2 * i + 1]; } cx /= n; cy /= n;
    if (snap) { cx = sn(cx); cy = sn(cy); }
    for (let i = 0; i < n; i++) { const j = (i + 1) % n, ax = snap ? sn(pts[2 * i]) : pts[2 * i], ay = snap ? sn(pts[2 * i + 1]) : pts[2 * i + 1], bx = snap ? sn(pts[2 * j]) : pts[2 * j], by = snap ? sn(pts[2 * j + 1]) : pts[2 * j + 1];
      const mx = (ax + bx) / 2 - cx, my = (ay + by) / 2 - cy, d = hypot(mx, my) || 1, f = 0.8 + 0.34 * k * (mx * LX + my * LY) / d, c = mixc(rgb.map(v => Math.min(255, v * f)), FOG, fog);
      g.fillStyle = g.strokeStyle = `rgb(${c[0] | 0},${c[1] | 0},${c[2] | 0})`; g.beginPath(); g.moveTo(cx, cy); g.lineTo(ax, ay); g.lineTo(bx, by); g.closePath(); g.fill(); g.lineWidth = 0.8; g.stroke(); } };
  const tri = (g, p, rgb, f = 1, fog = 0) => { const c = mixc(rgb.map(v => Math.min(255, v * f)), FOG, fog); g.fillStyle = g.strokeStyle = `rgb(${c[0] | 0},${c[1] | 0},${c[2] | 0})`;
    g.beginPath(); g.moveTo(p[0], p[1]); g.lineTo(p[2], p[3]); g.lineTo(p[4], p[5]); g.closePath(); g.fill(); g.lineWidth = 0.8; g.stroke(); };
  // pilgrims through the same pipe: polygons reduced to ≤ 7 vertices, snapped, fan-shaded
  const reduce = pts => { const n = pts.length / 2, st = Math.max(1, round(n / 7)), o = []; for (let i = 0; i < n; i += st) o.push(pts[2 * i], pts[2 * i + 1]); return o.length >= 6 ? o : pts; };
  const PEN = { shade: false, fine: false, color: r => XY.DEFAULT_COLORS[r], part(ctx, p, c) { if (p.k !== 'poly') return false; facet(ctx, reduce(p.pts), rgbOf(c), 0.06); return true; } };

  // ------------------------------------------------------------ the mountains (static facets, painted once at frame resolution)
  const ridge = (x0, x1, base, peaks, seed) => { const R = XY.rng(seed), o = []; let x = x0; while (x < x1) { const w = 60 + R() * 120, h = peaks * (0.5 + R() * 0.6); o.push([x, base, x + w * (0.4 + R() * 0.2), base - h, x + w, base]); x += w * (0.6 + R() * 0.3); } return o; };
  const scene = (W, H, S) => XY.keep(`lp-scene2:${W}:${S.toFixed(4)}`, Math.round(W * S), Math.round(H * S), cv => {   // full resolution: facet edges stay sharp
    const g = cv.getContext('2d'); g.scale(S, S);
    const gr = g.createLinearGradient(0, 0, 0, 520); gr.addColorStop(0, '#7E8EA2'); gr.addColorStop(1, '#C4CCCC'); g.fillStyle = gr; g.fillRect(0, 0, W, H);
    [[60, 90, 150, 30], [520, 60, 200, 26], [900, 120, 160, 22]].forEach(([x, y, w, h], k) => facet(g, [x, y, x + w * 0.3, y - h, x + w * 0.75, y - h * 0.8, x + w, y, x + w * 0.5, y + h * 0.4], [236, 240, 244], 0.2, 0.5));
    [[-40, W + 60, 470, 220, 11, 0.72], [-40, W + 60, 540, 170, 12, 0.5]].forEach(([a, b, base, pk, sd, fog]) => ridge(a, b, base, pk, sd).forEach(([x0, y0, px, py, x1]) => {
      tri(g, [x0, y0, px, py, (x0 + px) / 2 + 10, y0], [96, 112, 120], 1.15, fog); tri(g, [(x0 + px) / 2 + 10, y0, px, py, x1, y0], [96, 112, 120], 0.82, fog);
      tri(g, [px, py, px - (px - x0) * 0.25, py + (y0 - py) * 0.3, px + (x1 - px) * 0.2, py + (y0 - py) * 0.25], [230, 236, 240], 1, fog * 0.6); }));
    for (let x = -60, k = 0; x < W + 60; x += 90, k++) { tri(g, [x, 660, x + 45, 530 + 12 * XY.hash(k, 9), x + 90, 660], [110, 136, 96], 0.95 + 0.15 * XY.hash(k, 8), 0.45); tri(g, [x + 45, 530 + 12 * XY.hash(k, 9), x + 135, 534 + 12 * XY.hash(k + 1, 9), x + 90, 660], [110, 136, 96], 0.8, 0.45); }
    // 隐雾山 itself, right of centre: big faceted massif with the cave mouth
    const M = [[760, 640, 860, 330, 930, 640], [860, 330, 1010, 250, 960, 470], [860, 330, 960, 470, 930, 640], [1010, 250, 1120, 360, 1060, 470], [960, 470, 1010, 250, 1060, 470],
      [930, 640, 960, 470, 1060, 470], [930, 640, 1060, 470, 1080, 640], [1060, 470, 1120, 360, 1200, 520], [1060, 470, 1200, 520, 1080, 640], [1080, 640, 1200, 520, 1200, 650]];
    M.forEach((p, k) => tri(g, p, [104, 116, 108], [1.2, 1.05, 0.9, 0.78, 1.0, 0.86, 0.72, 0.7, 0.62, 0.66][k], 0.18));
    tri(g, [990, 470, 1016, 420, 1046, 470], [26, 24, 30], 1, 0); tri(g, [984, 476, 1016, 420, 990, 470], [40, 38, 44], 1, 0);
    // forest floor in triangles, rocks, near fog
    for (let x = -60, k = 0; x < W + 60; x += 70, k++) { const y0 = 600 + 30 * XY.hash(k, 1), y1 = 610 + 30 * XY.hash(k + 1, 1);
      tri(g, [x, 780, x, y0, x + 70, y1], [92, 120, 70], 0.9 + 0.2 * XY.hash(k, 2), 0.1); tri(g, [x, 780, x + 70, y1, x + 70, 780], [92, 120, 70], 0.75 + 0.2 * XY.hash(k, 3), 0.05); }
    tri(g, [0, 702, W, 700, W, 712], [140, 122, 84], 1.1); tri(g, [0, 702, W, 712, 0, 716], [140, 122, 84], 0.9);
    [[120, 660, 40], [560, 650, 30], [700, 742, 26], [1130, 690, 44]].forEach(([x, y, r], k) => facet(g, [x - r, y + r * 0.5, x - r * 0.6, y - r * 0.4, x + r * 0.2, y - r * 0.7, x + r, y - r * 0.1, x + r * 0.7, y + r * 0.5], [130, 128, 118], 0.08));
  });

  // ------------------------------------------------------------ pines: trunk + three stacked cones, tips snapping as they sway
  const PINES = [[40, 640, 1.2, 0.05], [230, 610, 0.8, 0.3], [330, 600, 0.7, 0.4], [470, 630, 1.0, 0.15], [640, 600, 0.75, 0.35], [760, 640, 1.1, 0.1], [880, 600, 0.7, 0.4], [1160, 650, 1.3, 0.05]];
  const pine = (g, x, y, s, fog, t, k) => { const sw = sn(4 * s * sin(t * 1.3 + k));
    tri(g, [x - 4 * s, y, x + 4 * s, y, x, y - 40 * s], [90, 60, 40], 0.8, fog);
    for (let j = 0; j < 3; j++) { const by = y - 26 * s - j * 30 * s, w = (40 - j * 9) * s, tx = x + sw * (j + 1) / 3, ty = by - 46 * s;
      tri(g, [sn(x - w), sn(by), sn(tx), sn(ty), sn(x), sn(by + 6 * s)], [52, 96, 60], 1.1, fog); tri(g, [sn(x), sn(by + 6 * s), sn(tx), sn(ty), sn(x + w), sn(by)], [52, 96, 60], 0.72, fog); } };

  // ------------------------------------------------------------ the leopard: joints blended between crouch (0) and stretch (1), skinned as facets
  const FUR = [200, 144, 52], BELLY = [236, 206, 150], SPOT = [86, 56, 24];
  const leoTris = (pose, t, open) => {
    const o = [], P = (a, b) => [a[0] + (b[0] - a[0]) * pose, a[1] + (b[1] - a[1]) * pose], push = (p, rgb, f) => o.push([p, rgb, f]);
    const fan = (pts, rgb) => { const n = pts.length / 2; let cx = 0, cy = 0; for (let i = 0; i < n; i++) { cx += pts[2 * i]; cy += pts[2 * i + 1]; } cx /= n; cy /= n;
      for (let i = 0; i < n; i++) { const j = (i + 1) % n, mx = (pts[2 * i] + pts[2 * j]) / 2 - cx, my = (pts[2 * i + 1] + pts[2 * j + 1]) / 2 - cy, d = hypot(mx, my) || 1;
        push([cx, cy, pts[2 * i], pts[2 * i + 1], pts[2 * j], pts[2 * j + 1]], my > 6 ? BELLY : rgb, 0.8 + 0.34 * (mx * LX + my * LY) / d); } };
    const quad = (a, b, w0, w1, rgb) => { const dx = b[0] - a[0], dy = b[1] - a[1], d = hypot(dx, dy) || 1, nx = -dy / d, ny = dx / d;
      const A = [a[0] + nx * w0, a[1] + ny * w0], B = [a[0] - nx * w0, a[1] - ny * w0], Cc = [b[0] + nx * w1, b[1] + ny * w1], D = [b[0] - nx * w1, b[1] - ny * w1];
      push([...A, ...B, ...Cc], rgb, 1.05); push([...B, ...D, ...Cc], rgb, 0.78); };
    const leg = (s0, s1, e0, e1, p0, p1, far) => { const S = P(s0, s1), E = P(e0, e1), Pw = P(p0, p1), c = far ? FUR.map(v => v * 0.78) : FUR; quad(S, E, 8, 6, c); quad(E, Pw, 6, 4, c); push([Pw[0] - 8, Pw[1] + 3, Pw[0] + 4, Pw[1] - 3, Pw[0] + 6, Pw[1] + 4], SPOT, 1); };
    leg([-26, 2], [-40, 4], [-34, 24], [-70, 28], [-40, 36], [-104, 40], true); leg([30, 4], [42, 4], [46, 22], [70, 28], [38, 36], [96, 44], true);
    const tb = [60, -14], tail = [tb]; for (let k = 1; k <= 5; k++) tail.push([tb[0] + k * 17, tb[1] - 10 * sin(k * 0.6) + 8 * sin(t * 4 - k * 0.7) * k / 5 - pose * 6 * k]);
    for (let k = 0; k < 5; k++) quad(tail[k], tail[k + 1], 6 - k, 5 - k, k % 2 ? SPOT : FUR);
    fan([-40, -34, 0, -32, 44, -30, 62, -14, 40, 12, 0, 16, -40, 12, -62, 0, -56, -28].map((v, i) => i % 2 ? v - pose * 2 : v * (1 + pose * 0.08)), FUR);
    [[-20, -22], [6, -24], [30, -20], [-6, -6], [20, -4], [44, -10]].forEach(([x, y], k) => push([x - 7, y + 3, x, y - 6, x + 7, y + 4], SPOT, 1));
    leg([-38, 0], [-50, 0], [-48, 20], [-84, 18], [-56, 34], [-122, 30], false); leg([40, 2], [50, 0], [56, 18], [80, 20], [46, 34], [110, 34], false);
    const h = P([-62, -22], [-92, -28]), j = 4 + 8 * open;
    fan([h[0] - 26, h[1] - 2, h[0] - 18, h[1] - 14, h[0] - 4, h[1] - 18, h[0] + 4, h[1] - 26, h[0] + 12, h[1] - 12, h[0] + 12, h[1] + 4, h[0] - 6, h[1] + 10, h[0] - 22, h[1] + j], FUR);
    push([h[0] - 24, h[1] + 2, h[0] - 8, h[1] + 4, h[0] - 20, h[1] + j + 2], [120, 40, 40], 1);
    push([h[0] - 28, h[1] - 4, h[0] - 22, h[1] - 6, h[0] - 24, h[1] + 1], [30, 20, 16], 1); push([h[0] - 14, h[1] - 9, h[0] - 6, h[1] - 11, h[0] - 8, h[1] - 6], [255, 220, 60], 1.2);
    return o; };
  // draw a leopard mesh at (X, Y) scale s; morph ∈ [0,1] from scattered shards; jit = glitch; fade alpha
  const drawLeo = (g, tris, X, Y, s, a, jit, seed, morph = 1, shatter = 0) => { g.save(); g.globalAlpha = a;
    tris.forEach(([p, rgb, f], i) => { const q = []; const sx = 900 + 220 * XY.hash(i, 3), sy = 300 + 320 * XY.hash(i, 4), ang = XY.hash(i, 5) * TAU, d = 18;
      for (let v = 0; v < 3; v++) { let x = X + p[2 * v] * s, y = Y + p[2 * v + 1] * s;
        if (morph < 1) { const m = XY.easeIO(morph), srcx = sx + cos(ang + v * 2.1) * d, srcy = sy + sin(ang + v * 2.1) * d; x = XY.lerp(srcx, x, m); y = XY.lerp(srcy, y, m); }
        if (shatter > 0) { const dx = (XY.hash(i, 6) - 0.5) * 300, dy = -120 - 140 * XY.hash(i, 7); x += dx * shatter; y += dy * shatter + 500 * shatter * shatter; }
        if (jit) { x += (XY.hash(i, v, seed) - 0.5) * jit; y += (XY.hash(i, v + 3, seed) - 0.5) * jit; }
        q.push(sn(x), sn(y)); }
      tri(g, q, rgb, f, 0); });
    g.restore(); };
  const blossom = (g, x, y, r, a) => { g.save(); g.globalAlpha = a;
    for (let k = 0; k < 5; k++) { const an = -PI / 2 + k * TAU / 5, cx = x + cos(an) * r * 0.55, cy = y + sin(an) * r * 0.55;
      facet(g, XY.ellipse(cx, cy, r * 0.42, r * 0.36, 6, an), [244, 160, 186], 0, 1, false); }
    facet(g, XY.ellipse(x, y, r * 0.2, r * 0.2, 6), [250, 214, 80], 0, 1, false); g.restore(); };
  const bayer = (w, h) => XY.keep(`lp-bayer:${w}x${h}`, w, h, cv => { const g = cv.getContext('2d'), im = g.createImageData(w, h), d = im.data, B = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const b = B[(y % 4) * 4 + (x % 4)] / 15, o = (y * w + x) * 4, v = b > 0.5 ? 255 : 0; d[o] = d[o + 1] = d[o + 2] = v; d[o + 3] = Math.abs(b - 0.5) * 34; } g.putImageData(im, 0, 0); });

  // ------------------------------------------------------------ the cell
  // flat faceted fog: a strip of triangles with ragged edges; gap = [x, half-width] tears it open and pushes the halves apart
  const fogBand = (g, y, h, off, a, seed, gap) => { const n = 26, step = 70;
    for (let i = 0; i < n; i++) { let x0 = -140 + i * step + off % step, x1 = x0 + step; const j = k => 10 * XY.hash(i + k + Math.floor(off / step), seed);
      if (gap) { const m = (x0 + x1) / 2; if (Math.abs(m - gap[0]) < gap[1]) continue; const push = (m < gap[0] ? -1 : 1) * gap[2] * Math.exp(-Math.abs(m - gap[0]) / 300); x0 += push; x1 += push; }
      const t0 = y - h / 2 + 2.2 * j(0), t1 = y - h / 2 + 2.2 * j(1), b0 = y + h / 2 - 1.6 * j(2), b1 = y + h / 2 - 1.6 * j(3);
      g.globalAlpha = a; g.beginPath(); g.moveTo(x0, t0); g.lineTo(x1, t1); g.lineTo(x0, b0); g.closePath(); g.fillStyle = 'rgb(226,232,234)'; g.fill();
      g.beginPath(); g.moveTo(x1, t1 - 0.5); g.lineTo(x1, b1); g.lineTo(x0, b0 + 0.5); g.closePath(); g.fillStyle = 'rgb(204,212,216)'; g.fill(); }
    g.globalAlpha = 1; };
  const ASM = 0.4, SPLIT = 0.6, HIT = 0.7, A = [1000, 470], L = [1066, 640], S0 = 1.5, S1 = 1.22, BC = [1040, 530];
  XY.STYLES.lowpoly = {
    hits: [4, 5.6],
    post(canvas, g, e) { K.zoomPost(canvas, g, e, 960, 600, K.push(e.beat, 3.85, 6.0, 0.1)); },
    draw(g, e) {
      const { W, H, t, u } = e, c = e.cell, f = g;
      f.drawImage(scene(W, H, e.S), 0, 0, W, H);
      // loose facets round the cave shiver, rocks tumble down the slope, then the facets fly off to make the leopard
      if (u > 0.26 && u < ASM) { const a = (u - 0.26) / 0.14; for (let k = 0; k < 10; k++) { const x = 940 + 140 * XY.hash(k, 21), y = 380 + 200 * XY.hash(k, 22), j = 10 * a * (XY.hash(k, floor(t * 20)) - 0.5);
        tri(f, [x + j, y, x + 26 + j, y - 18, x + 30, y + 14], [120, 132, 120], 1.1 - 0.4 * XY.hash(k, 23), 0); }
        for (let k = 0; k < 4; k++) { const q = XY.clamp((u - 0.3 - 0.02 * k) / 0.1), x = 1010 - 40 * k - 150 * q, y = 480 + 190 * q * q - 30 * Math.abs(sin(q * 9)); if (q > 0 && q < 1) facet(f, XY.ellipse(x, y, 10 + 3 * k, 8 + 2 * k, 5, q * 9), [120, 118, 108], 0); } }
      PINES.forEach(([x, y, s, fog], k) => pine(f, x, y, s, fog, t, k));
      // faceted fog bands drifting behind the pilgrims; the pounce tears them open
      const tear = u > 0.47 ? { x: XY.lerp(A[0], L[0], XY.clamp((u - 0.47) / 0.08)), w: 90 * XY.easeOut((u - 0.47) / 0.06) * (1 - XY.smooth((u - 0.8) / 0.15)) } : null;
      [[440, 46, 22, 0.42, 3], [520, 40, -16, 0.4, 5], [600, 34, 12, 0.36, 7]].forEach(([y, h, sp, a, sd]) => fogBand(f, y, h, t * sp, a, sd, tear && tear.w > 1 ? [tear.x, tear.w, tear.w * 1.2] : null));
      const fogAll = 0.82 * (1 - XY.smooth((u + 0.12) / 0.3)); if (fogAll > 0.01) { f.fillStyle = `rgba(${FOG},${fogAll})`; f.fillRect(0, 0, W, H); }
      if (u < ASM) { const bl = floor(t * 1.4) % 4 === 0 ? 0.3 : 1; [1004, 1024].forEach(x => tri(f, [x - 5, 454, x + 5, 451, x + 1, 458], [255, 220, 60], bl * 1.2, 0)); }
      if (u > SPLIT - 0.01 && u < SPLIT + 0.1) blossom(f, BC[0], BC[1], 175 * XY.easeOut((u - SPLIT + 0.01) / 0.04), 1 - XY.smooth((u - SPLIT) / 0.1));
      const real = this.leopard(u, t);
      if (real) drawLeo(f, leoTris(real.pose, t, real.open), real.x, real.y, real.s, 1, 0, 0, real.morph);
      this.pilgrims(f, e);
      if (u > SPLIT && u < HIT + 0.1) { const tq = c.t0 + HIT * c.dur, pq = XY.procWorldX(tq) - c.x, tg = [pq + 315, pq - 95, pq - 245];
        tg.forEach((tx, k) => { const an = -PI / 2 + (k + 1) * TAU / 5, st = [BC[0] + cos(an) * 110, BC[1] + 30 + sin(an) * 70], q = XY.clamp((u - SPLIT) / (HIT - SPLIT)), sh = XY.clamp((u - HIT) / 0.1);
          const x = XY.lerp(st[0], tx, XY.easeIn(q)), y = XY.lerp(st[1], 690, q) - 40 * sin(q * PI * 3) * (1 - q);
          drawLeo(f, leoTris(0.5 + 0.5 * sin(t * 22 + k * 2), t, 1), x, y, S1, (floor(t * 30) % 2 ? 0.35 : 0.6) * (1 - sh), 7, floor(t * 30) + k, 1, sh); }); }
      // one low fog band in front of the pilgrims' feet
      fogBand(f, 742, 30, -t * 26 + 300, 0.3, 11, tear && tear.w > 1 ? [tear.x, tear.w * 0.8, tear.w] : null);
      this.chrome(f, e);
    },
    // the real 南山大王: assembled from the mountain's facets on beat 2, pounces down, crouches and watches Tang Seng
    leopard(u, t) {
      if (u < ASM) return null;
      if (u < 0.47) return { x: A[0], y: A[1], s: S0, pose: 1, open: 1, morph: (u - ASM) / 0.07 };
      if (u < 0.55) { const q = (u - 0.47) / 0.08; return { x: XY.lerp(A[0], L[0], q), y: XY.lerp(A[1], L[1], q) - 90 * sin(q * PI), s: XY.lerp(S0, S1, q), pose: 1 - XY.smooth((q - 0.6) / 0.4), open: 1, morph: 1 }; }
      const back = XY.easeIO((u - 0.76) / 0.14);   // slinks back up to the cave mouth before the pilgrims reach him
      return { x: XY.lerp(L[0], 1016, back) + 2 * sin(t * 2), y: XY.lerp(L[1], 470, back) + 1.5 * sin(t * 3), s: XY.lerp(S1, 0.55, back), pose: 0.08 + 0.06 * sin(t * 3) + 0.5 * back * (1 - back) * 4, open: 0.5 + 0.5 * sin(t * 3.4), morph: 1 };
    },
    pilgrims(f, e) {
      const { u } = e, px = e.procX; if (px - 410 > e.W + 10 || px + 330 < -10) return;
      const acts = { wukong: { shade: K.win(u, 0.3, 0.42, 0.04), raise: K.win(u, 0.54, 0.66, 0.03), strike: K.win(u, 0.66, 0.78, 0.03) }, monk: { palm: K.win(u, 0.58, 0.96, 0.05) }, bajie: { scratch: K.win(u, 0.72, 0.92, 0.05) }, shaseng: { lift: K.win(u, 0.68, 0.76, 0.025) } };
      f.save(); f.fillStyle = 'rgba(40,50,40,0.35)'; [[-300, 34], [-150, 34], [40, 80], [245, 34]].forEach(([dx, rx]) => { f.beginPath(); f.ellipse(px + dx, e.groundY + 3, rx, 6, 0, 0, TAU); f.fill(); }); f.restore();
      XY.drawProcession(f, e.phase, px, e.groundY, PEN, acts);
    },
    // 1995 3D-logo title, a faceted hex badge for the count
    chrome(f, e) {
      const { W } = e; f.save(); f.font = XY.font(84, XY.cnFont.hei, '900'); f.textBaseline = 'top';
      for (let k = 9; k > 0; k--) { f.fillStyle = `rgb(${30 + k * 5},${40 + k * 5},${62 + k * 6})`; f.fillText('隐雾山', 46 + k * 1.3, 40 + k * 1.5); }
      const gr = f.createLinearGradient(0, 40, 0, 128); gr.addColorStop(0, '#F2FAFF'); gr.addColorStop(0.5, '#B8D2EA'); gr.addColorStop(0.5, '#5E80A8'); gr.addColorStop(1, '#9CB8D8'); f.fillStyle = gr; f.fillText('隐雾山', 46, 40);
      f.lineWidth = 2; f.strokeStyle = '#1C2A40'; f.strokeText('隐雾山', 46, 40);
      const hx = W - 120, hy = 86; facet(f, XY.ellipse(hx, hy, 74, 56, 6, PI / 6), [176, 140, 70], 0, 1.2, false);
      f.font = XY.font(30, XY.cnFont.hei, '900'); f.textAlign = 'center'; f.textBaseline = 'middle'; f.fillStyle = '#2A1C0C'; f.fillText('第71难', hx + 2, hy + 2); f.fillStyle = '#FFF4D8'; f.fillText('第71难', hx, hy);
      f.restore();
    },
  };
})();
