// 81 当代生成艺术 · 老鼋落水 — the last cell (12 beats). Plotter ink on paper: 通天河 and the sky are flow fields, 老鼋's shell
// a recursive hex tessellation, the pilgrims a dot matrix read back from a 1/3-resolution buffer.
//  0–1.6  the turtle ferries them; wind lines in the sky, the 9×9 ledger reads 80 / 81
//  1.6–2.5 it turns its head and asks (a "?" of dots) — 唐僧 forgot to ask the Buddha its age
//  2.5–3.6 一晃: the shell rocks harder and harder, the pilgrims sway with it
//  3.6    it dives (hit): they sink under the surface, a crown of spray, the scriptures fly out; the ledger fills its 81st square
//  3.7–6  the characters leave the pages as particles, swirl down the current and up the wind; on beat 6 (hit) they lock into 九九归真
//  6.3–8  晒经石 prints itself out of the water layer by layer and lifts the pilgrims back up, dripping
//  8–12   pages spread to dry on the rock (one torn: 天地不全), a drop falls from the wet words on every beat, the turtle swims off
(() => {
  'use strict';
  const XY = window.XY, K = XY.KIT_I, TAU = XY.TAU, { sin, cos, PI, floor } = Math;
  const PAPER = '#F3EFE6', INKC = '#1B1F2A', BLUE = '#1F4E8C', VERM = '#D2462E', GOLD = '#C29A2E', HZ = 540, SURF = 726;
  const ASK = 1.6, SWAY = 2.5, DIVE = 3.6, FORM = 6, RISE = 6.3, DRY = 8, sm = XY.smooth, win = K.win;
  const field = (x, y) => 0.22 * XY.noise2(x / 260, y / 70, 81) + 0.08 * sin(x / 90 + y / 40);
  const wind = (x, y) => 0.32 * XY.noise2(x / 380, y / 150, 83) - 0.06;

  // streamlines: the river (thicker and sparser toward us) and the wind over it
  let LINES = null;
  const streamlines = W => { if (LINES && LINES.W === W) return LINES; const r = XY.rng(8101), L = [], A = [];
    for (let k = 0; k < 150; k++) { const v = Math.pow(r(), 0.8), pts = []; let x = -60 + r() * (W + 60), y = HZ + 6 + v * (780 - HZ);
      for (let i = 0; i < 90; i++) { pts.push(x, y); const a = field(x, y); x += cos(a) * 7; y += sin(a) * 7 * (0.3 + v); if (x > W + 40) break; } L.push({ pts, v }); }
    for (let k = 0; k < 64; k++) { const pts = []; let x = -80 + r() * (W + 80), y = 40 + r() * 470;
      for (let i = 0; i < 110; i++) { pts.push(x, y); const a = wind(x, y); x += cos(a) * 8; y += sin(a) * 8; if (x > W + 40) break; } A.push({ pts, v: r() }); }
    return (LINES = { W, L, A }); };
  const bg = (g, W, H) => {
    g.fillStyle = PAPER; g.fillRect(0, 0, W, H);
    const r = XY.rng(811); g.fillStyle = 'rgba(60,50,30,0.06)'; for (let k = 0; k < 2600; k++) g.fillRect(r() * W, r() * H, 1, 1);
    g.fillStyle = 'rgba(27,31,42,0.12)'; for (let x = 24; x < W; x += 24) for (let y = 24; y < HZ - 10; y += 24) g.fillRect(x - 0.8, y - 0.8, 1.6, 1.6);
    const SL = streamlines(W);
    SL.A.forEach(({ pts, v }) => { g.strokeStyle = `rgba(90,110,140,${0.16 + 0.16 * v})`; g.lineWidth = 0.6 + 0.8 * v; XY.path(g, pts, false); g.stroke(); });
    g.strokeStyle = 'rgba(27,31,42,0.45)'; g.lineWidth = 1; g.beginPath(); g.moveTo(0, HZ); g.lineTo(W, HZ); g.stroke();
    for (let x = 0; x < W; x += 5) { const h = 8 + 26 * Math.max(0, XY.fbm(x / 140, 2, 82, 3) + 0.2); for (let y = 0; y < h; y += 4) { g.fillStyle = `rgba(31,78,140,${0.18 + 0.3 * (y / h)})`; g.fillRect(x, HZ - h + y, 1.4, 1.4); } }
    SL.L.forEach(({ pts, v }) => { g.strokeStyle = `rgba(31,78,140,${0.14 + 0.22 * v})`; g.lineWidth = 0.6 + 1.6 * v; XY.path(g, pts, false); g.stroke(); });
  };

  // ------------------------------------------------------------ the fall, as functions of the cell beat
  const tilt = b => 0.22 * sin((b - SWAY) * TAU * 1.3) * sm(win(b, SWAY, SWAY + 0.6)) * (1 - sm(win(b, DIVE - 0.05, DIVE + 0.3))) + 0.12 * sm(win(b, DIVE, DIVE + 0.4)) * (1 - sm(win(b, DIVE + 0.9, DIVE + 1.5)));
  const sinkOf = b => 200 * sm(win(b, DIVE, DIVE + 0.9)) * (1 - sm(win(b, RISE, RISE + 1.3)));
  const scatOf = b => sm(win(b, DIVE + 0.6, DIVE + 1.4)) * (1 - sm(win(b, RISE - 0.2, RISE + 1.1)));
  const actsAt = b => ({ monk: { palm: sm(win(b, ASK + 0.3, ASK + 0.8)) * (1 - sm(win(b, SWAY + 0.4, SWAY + 0.9))) + sm(win(b, 8.2, 8.8)) },
    wukong: { shade: sm(win(b, ASK, ASK + 0.4)) * (1 - sm(win(b, SWAY, SWAY + 0.4))) + sm(win(b, 7.0, 7.5)) * (1 - sm(win(b, 9.0, 9.6))), raise: sm(win(b, DIVE - 0.4, DIVE)) * (1 - sm(win(b, DIVE + 0.6, DIVE + 1))) },
    bajie: { scratch: sm(win(b, 7.6, 8.2)) }, shaseng: { lift: sm(win(b, DIVE - 0.3, DIVE)) * (1 - sm(win(b, DIVE + 0.5, DIVE + 0.9))) + sm(win(b, 8.5, 8.9)) * (1 - sm(win(b, 9.6, 10))) } });
  const xfOf = (e, b) => { const a = tilt(b), dy = sinkOf(b), c = cos(a), s = sin(a), ox = e.procX, oy = e.groundY;
    return { a, dy, M: [c, s, -s, c, ox - (c * ox - s * oy), oy + dy - (s * ox + c * oy)] }; };

  // ------------------------------------------------------------ 老鼋: a long low shell of recursive hexagons, flippers, neck and head
  const hexes = (() => { const o = []; for (let q = -9; q <= 9; q++) for (let r = 0; r < 3; r++) o.push([q * 42 + (r % 2 ? 21 : 0), 10 + r * 20]); return o; })();
  const turtle = (g, cx, top, sink, look, t) => {
    g.save(); g.translate(cx, top + sink);
    [[-300, 0.0], [260, 1.7]].forEach(([fx, ph]) => { const a = 0.5 * sin(t * 3 + ph); g.save(); g.translate(fx, 28); g.rotate(a); g.strokeStyle = INKC; g.lineWidth = 1.2;
      for (let k = 0; k < 3; k++) { g.beginPath(); g.ellipse(-20 + k * 2, 14, 46 - k * 12, 12 - k * 3, 0.25, 0, TAU); if (!k) { g.fillStyle = '#E4E8DC'; g.fill(); } g.stroke(); } g.restore(); });
    g.beginPath(); g.moveTo(-440, 56); g.quadraticCurveTo(-424, 2, -340, 0); g.lineTo(340, 0); g.quadraticCurveTo(424, 2, 440, 56); g.closePath();
    g.fillStyle = '#E4E8DC'; g.fill(); g.save(); g.clip();
    hexes.forEach(([x, y], k) => { for (let ring = 0; ring < 3; ring++) { const R = 22 - ring * 6.5; g.strokeStyle = ring ? `rgba(31,78,140,${0.5 - ring * 0.12})` : INKC; g.lineWidth = ring ? 0.9 : 1.4; g.beginPath();
      for (let i = 0; i < 6; i++) { const a = i / 6 * TAU + PI / 6 + ring * 0.12 * sin(t * 0.8 + k); i ? g.lineTo(x + cos(a) * R, y + sin(a) * R * 0.62) : g.moveTo(x + cos(a) * R, y + sin(a) * R * 0.62); } g.closePath(); g.stroke(); } });
    g.restore(); g.strokeStyle = INKC; g.lineWidth = 2; g.stroke();
    const hx = 480 - 34 * look, hy = -26 + 6 * sin(t * 2), hs = 1.25;
    g.lineWidth = 1.2; for (let i = 0; i < 7; i++) { const v = i / 6, x = XY.lerp(424, hx - 22, v), y = XY.lerp(44, hy + 8, v); g.beginPath(); g.ellipse(x, y, (10 - 3 * v) * hs, (14 - 4 * v) * hs, 0.4, 0, TAU); g.fillStyle = '#E4E8DC'; g.fill(); g.stroke(); }
    g.beginPath(); g.ellipse(hx, hy, 28 * hs, 18 * hs, -0.15 - 0.3 * look, 0, TAU); g.fillStyle = '#E4E8DC'; g.fill(); g.lineWidth = 1.8; g.stroke();
    for (let k = 1; k < 4; k++) { g.lineWidth = 0.7; g.beginPath(); g.ellipse(hx + 2, hy + 1, (28 - k * 6) * hs, (18 - k * 4) * hs, -0.15 - 0.3 * look, 0, TAU); g.stroke(); }
    g.fillStyle = INKC; g.beginPath(); g.arc(hx + 12 - 28 * look, hy - 5, 3.6, 0, TAU); g.fill();
    g.restore();
    return [cx + hx, top + sink + hy];
  };

  // ------------------------------------------------------------ scriptures: ten pages fly out of the luggage, float, then dry on the rock
  const NP = 10, TXT = { w: 820, h: 230, font: XY.font(176, '"Songti SC", serif', '900') };
  let SC = null;
  const scene = e => { if (SC && SC.n === e.cell.n) return SC;
    const tD = e.cell.t0 + DIVE * XY.BEAT, ph = XY.walkPhase(tD), A = actsAt(DIVE), px = XY.procWorldX(tD) - e.cell.x;
    const at = k => { const p = XY.anchor(k, ph, A); return [px + p[0], e.groundY + p[1]]; }, src = [at('shaseng.bundleL'), at('shaseng.bundleR'), at('monk.saddle')];
    const pages = []; for (let k = 0; k < NP; k++) { const s = src[k % 3], h = XY.hash(k, 1);
      pages.push({ s: [s[0] + (h - 0.5) * 20, s[1] - 10], land: [150 + k * 80 + 30 * XY.hash(k, 2), SURF + 8 + 14 * XY.hash(k, 3)], dry: [250 + (k % 8) * 128 + 20 * XY.hash(k, 4), 712 + (k % 2) * 12], h, torn: k === 5, keepFloat: k >= 8 }); }
    const T = K.textPts('i81txt', ['九九归真'], TXT.font, TXT.w, TXT.h, 4), N = T.length / 2, ox = e.W / 2 - TXT.w / 2, oy = 150, P = [];
    for (let i = 0; i < N; i++) { const h = XY.hash(i, 9); P.push({ tx: ox + T[2 * i] + (XY.hash(i, 7) - 0.5) * 3.4, ty: oy + T[2 * i + 1] + (XY.hash(i, 8) - 0.5) * 3.4, sz: 0.6 + 0.8 * XY.hash(i, 10), pg: i % NP,
      lx: (XY.hash(i, 3) - 0.5) * 30, ly: (XY.hash(i, 4) - 0.5) * 40, h, h2: XY.hash(i, 5), h3: XY.hash(i, 6), col: h < 0.08 ? 1 : h < 0.14 ? 2 : 0 }); }
    const Q = K.textPts('i81q', ['?'], XY.font(96, '"Songti SC", serif', '900'), 70, 110, 5);
    return (SC = { n: e.cell.n, pages, P, Q, ox, oy, turtleX: px - 40 }); };
  const bez2 = (a, c, b, v) => { const w = 1 - v; return [w * w * a[0] + 2 * w * v * c[0] + v * v * b[0], w * w * a[1] + 2 * w * v * c[1] + v * v * b[1]]; };
  const pageAt = (pg, b, t) => {
    if (b < DIVE + 0.05) return null; const fly = win(b, DIVE + 0.05, DIVE + 0.7);
    if (fly < 1) { const c = [(pg.s[0] + pg.land[0]) / 2, Math.min(pg.s[1], pg.land[1]) - 190 - 80 * pg.h]; return { p: bez2(pg.s, c, pg.land, fly), rot: (pg.h - 0.5) * 2 + fly * 7 * (pg.h - 0.5), w: 34, h: 44, fly: true }; }
    const fl = [pg.land[0] + 14 * (b - DIVE - 0.7), pg.land[1] + 2 * sin(t * 2 + pg.h * 9)];
    if (pg.keepFloat) return { p: [fl[0] + 26 * Math.max(0, b - DRY), fl[1]], rot: 0, w: 40, h: 12 };
    const d = sm(win(b, DRY + pg.h * 0.6, DRY + 1.1 + pg.h * 0.6)), p = bez2(fl, [(fl[0] + pg.dry[0]) / 2, Math.min(fl[1], pg.dry[1]) - 90], pg.dry, d);
    return { p, rot: 0, w: XY.lerp(40, 58, d), h: XY.lerp(12, 26, d) }; };
  const drawPage = (g, st, torn) => { g.save(); g.translate(st.p[0], st.p[1]); g.rotate(st.rot);
    const w = st.w, h = st.h, pts = torn && !st.fly ? [-w / 2, -h / 2, w / 2 - 16, -h / 2, w / 2, -h / 2 + 10, w / 2, h / 2, -w / 2, h / 2] : [-w / 2, -h / 2, w / 2, -h / 2, w / 2, h / 2, -w / 2, h / 2];
    if (!st.fly) g.transform(1, 0, -0.45, 1, 0, 0);
    g.fillStyle = 'rgba(27,31,42,0.12)'; XY.path(g, pts.map((v, i) => v + (i % 2 ? 3 : 3)), true); g.fill();
    XY.path(g, pts, true); g.fillStyle = '#FBF8F1'; g.fill(); g.strokeStyle = INKC; g.lineWidth = 1; g.stroke();
    g.fillStyle = 'rgba(27,31,42,0.45)'; for (let k = 1; k < 6; k++) for (let j = 0; j < 5; j++) { const x = -w / 2 + k * w / 6, y = -h / 2 + 4 + j * (h - 8) / 5; if (st.fly || (k + j) % 3) g.fillRect(x - 0.8, y, 1.6, 1.6); }
    g.restore(); };
  const partAt = (q, pages, b, t) => {
    if (b < DIVE + 0.05) return null;
    if (b < DIVE + 0.7) { const st = pageAt(pages[q.pg], b, t), c = cos(st.rot), s = sin(st.rot), x = q.lx * 0.9, y = q.ly * 0.9; return [st.p[0] + c * x - s * y, st.p[1] + s * x + c * y, 1]; }
    const tf = b - DIVE - 0.7, base = pages[q.pg].land, fx = base[0] + q.lx + 110 * tf * (0.5 + q.h2) + 50 * sin(tf * 2.4 + q.h * TAU), fy = base[1] + q.ly * 0.4 + 28 * sin(tf * 3.2 + q.h3 * TAU) - 120 * tf * (0.4 + q.h3);
    const v = XY.easeIO(win(b, 4.8 + 0.3 * q.h3, FORM)), jx = b >= FORM ? 0.7 * (XY.hash(floor(q.tx * 7 + q.ty), floor(t * 12)) - 0.5) : 0;
    return [XY.lerp(fx, q.tx, v) + jx, XY.lerp(fy, q.ty, v), (v >= 1 ? 2.3 : 1.8) * q.sz]; };
  const DPEN = { color: r => ({ horse: '#CFD8E4', horse2: '#B4C0D0', mane: '#C8D2DE', robe: '#E3B44A', kasaya: '#C83A2C', skin: '#E9C9A8', face: '#E2C29A', bundle: '#D9A441', skull: '#E9E3D3' })[r] || XY.DEFAULT_COLORS[r], outline: INKC, ow: 1.8 };

  // ------------------------------------------------------------ 晒经石: contour layers stacking up out of the water, with boulders at the waterline
  const NL = 16, layerY = k => 750 - (k + 1) * 3;
  const rockEdges = (W, k) => { const v = Math.pow(k / NL, 1.6); return [120 + 70 * v + 8 * XY.noise1(k * 0.6, 3), W - 40 - 80 * v + 8 * XY.noise1(k * 0.6, 4)]; };
  const BOULD = [[170, 744, 46], [400, 750, 38], [730, 748, 52], [1020, 752, 40], [1270, 746, 48]], BACK = [[230, 706, 92], [520, 706, 70], [860, 706, 104], [1150, 706, 84], [1330, 712, 60]];
  const rock = (g, W, top, t) => {
    if (top < 0) return;
    BACK.forEach(([x, y, r], k) => { const s = sm(win(top, k * 2 + 2, k * 2 + 7)); if (s <= 0) return; const ry = r * 0.62 * s;   // boulders of the shore behind the drying rock
      for (let i = 0; i < 5; i++) { g.beginPath(); g.ellipse(x + i * 4, y - i * ry * 0.12, r * s * (1 - i * 0.17), ry * (1 - i * 0.17), 0, PI, TAU); if (!i) { g.fillStyle = '#DCD3C0'; g.fill(); } g.strokeStyle = `rgba(27,31,42,${0.75 - i * 0.12})`; g.lineWidth = i ? 0.8 : 1.6; g.stroke(); }
      g.fillStyle = 'rgba(27,31,42,0.3)'; for (let j = 0; j < 40; j++) { const a = PI + XY.hash(j, k, 9) * PI, rr = Math.sqrt(XY.hash(j, k, 8)); g.fillRect(x + cos(a) * r * s * rr, y + sin(a) * ry * rr, 1.3, 1.3); } });
    g.fillStyle = '#E6DFD0'; g.beginPath(); g.moveTo(rockEdges(W, 0)[0], 752); for (let k = 0; k <= top; k++) g.lineTo(rockEdges(W, k)[0], layerY(k)); for (let k = top; k >= 0; k--) g.lineTo(rockEdges(W, k)[1], layerY(k)); g.lineTo(rockEdges(W, 0)[1], 752); g.fill();
    for (let k = 0; k <= top; k++) { const [a, b] = rockEdges(W, k), y = layerY(k); g.strokeStyle = k === NL - 1 ? INKC : `rgba(27,31,42,${0.3 + 0.025 * k})`; g.lineWidth = k === NL - 1 ? 1.8 : 1; g.beginPath();
      for (let x = a; x <= b; x += 12) g.lineTo(x, y + 1.2 * XY.noise2(x / 30, k, 7)); g.stroke(); }
    g.fillStyle = 'rgba(27,31,42,0.25)'; for (let k = 0; k < 420; k++) { const x = 130 + XY.hash(k, 61) * (W - 180), y = 752 - Math.pow(XY.hash(k, 62), 1.8) * 48; if (y < layerY(top)) continue; g.fillRect(x, y, 1.3, 1.3); }
    g.strokeStyle = 'rgba(27,31,42,0.4)'; g.lineWidth = 1; [[300, 0.4], [640, 0.7], [960, 0.5], [1180, 0.8]].forEach(([x, f]) => { if (top < NL * f) return; g.beginPath(); g.moveTo(x, layerY(floor(NL * f))); g.lineTo(x + 6, 736); g.lineTo(x - 2, 752); g.stroke(); });
    BOULD.forEach(([x, y, r], k) => { const s = sm(win(top, k * 2, k * 2 + 4)); if (s <= 0) return; for (let i = 0; i < 4; i++) { g.beginPath(); g.ellipse(x, y, r * s * (1 - i * 0.22), r * 0.55 * s * (1 - i * 0.22), 0, PI, TAU); if (!i) { g.fillStyle = '#DED6C4'; g.fill(); } g.strokeStyle = `rgba(27,31,42,${0.7 - i * 0.15})`; g.lineWidth = i ? 0.8 : 1.5; g.stroke(); } });
  };

  XY.STYLES.generative = {
    bg,
    hits: [DIVE, FORM],
    thumb: 10.5,   // 九九归真 formed, pilgrims on the drying rock: the last thumbnail, the outro zooms out from here
    draw(g, e) {
      const { W, H, t, u, lt, beat, S } = e, sc = scene(e), A = actsAt(beat), X = xfOf(e, beat), SL = streamlines(W);
      // particles riding the wind lines and the current
      const flow = (lines, n, front, col, lw, sp) => { const p = new Path2D(); for (let k = 0; k < n; k++) { const ln = lines[k % lines.length], m = ln.pts.length / 2; if (m < 4) continue; if (front != null && (ln.pts[1] > SURF) !== front) continue;
          const i = floor((XY.hash(k, 3) * m + lt * (sp + 18 * ln.v)) % (m - 2)), j = Math.min(m - 1, i + 2); p.moveTo(ln.pts[2 * i], ln.pts[2 * i + 1]); p.lineTo(ln.pts[2 * j], ln.pts[2 * j + 1]); }
        g.strokeStyle = col; g.lineWidth = lw; g.lineCap = 'round'; g.stroke(p); };
      flow(SL.A, 240, null, 'rgba(70,96,140,0.6)', 1.4, 10); flow(SL.L, 460, false, 'rgba(31,78,140,0.7)', 1.4, 14);
      // the ledger: 9×9 squares, eighty filled; the 81st fills with a flash when they hit the water
      { const x0 = 56, y0 = 50, s = 10, gp = 4, done = beat >= DIVE, pop = K.outBack(win(beat, DIVE, DIVE + 0.25), 2.4), fl = K.hit(beat, DIVE, 2.2);
        if (fl > 0.01) { const cx = x0 + 8 * (s + gp) + s / 2, cy = y0 + 8 * (s + gp) + s / 2, rg = g.createRadialGradient(cx, cy, 2, cx, cy, 90); rg.addColorStop(0, `rgba(210,70,46,${0.6 * fl})`); rg.addColorStop(1, 'rgba(210,70,46,0)'); g.fillStyle = rg; g.fillRect(cx - 90, cy - 90, 180, 180); }
        for (let k = 0; k < 81; k++) { const x = x0 + (k % 9) * (s + gp), y = y0 + floor(k / 9) * (s + gp);
          if (k < 80) { g.fillStyle = 'rgba(27,31,42,0.82)'; g.fillRect(x, y, s, s); } else if (done) { g.fillStyle = VERM; g.fillRect(x + s / 2 - s * pop / 2, y + s / 2 - s * pop / 2, s * pop, s * pop); } else { g.strokeStyle = INKC; g.lineWidth = 1; g.strokeRect(x + 0.5, y + 0.5, s - 1, s - 1); } }
        g.fillStyle = INKC; g.font = XY.font(30, XY.cnFont.hei, '600'); g.textAlign = 'left'; g.textBaseline = 'alphabetic'; g.fillText('第八十一难', 196, 78);
        g.font = XY.font(26, '"Menlo", monospace', 'bold'); g.fillStyle = done ? VERM : 'rgba(27,31,42,0.55)'; g.fillText(done ? '81 / 81' : '80 / 81', 196, 116); }
      // 晒经石 printing out of the water
      { let top = -1; for (let k = 0; k < NL; k++) if (beat >= RISE - 0.1 + k * 0.075) top = k; rock(g, W, top, t); }
      // 老鼋: carries them in, turns to ask (a "?" of dots), rocks (一晃), dives; later it swims off far right
      { const sink = 130 * sm(win(beat, DIVE, DIVE + 0.6)); if (sink < 128) { const cx = beat < DIVE ? e.procX - 40 : sc.turtleX, look = sm(win(beat, ASK, ASK + 0.5));
          g.save(); g.translate(e.procX, e.groundY); g.rotate(X.a); g.translate(-e.procX, -e.groundY); const hd = turtle(g, cx, e.groundY, sink, look, t); g.restore();
          const qv = 1.6 * K.outBack(win(beat, ASK + 0.3, ASK + 0.55), 2) * (1 - sm(win(beat, SWAY + 0.5, SWAY + 0.75)));
          if (qv > 0.01) { g.fillStyle = INKC; for (let i = 0; i < sc.Q.length; i += 2) { const j = 0.8 * sin(t * 6 + i); g.fillRect(hd[0] - 35 * qv + sc.Q[i] * qv + j - 1.8, hd[1] - 60 - 110 * qv + sc.Q[i + 1] * qv - 1.8, 3.6, 3.6); } } }
        const sw = win(beat, 9.0, 13.0); if (sw > 0) { const x = 1080 + 300 * sw, y = 600 + 2 * sin(t * 2); g.strokeStyle = INKC; g.lineWidth = 1.4; g.fillStyle = '#E4E8DC';
          g.beginPath(); g.ellipse(x - 60, y + 8, 70, 16, 0, PI, TAU); g.fill(); g.stroke(); for (let k = 0; k < 4; k++) { g.beginPath(); g.moveTo(x - 110 + k * 30, y + 8); g.lineTo(x - 100 + k * 30, y - 4); g.stroke(); }
          g.beginPath(); g.ellipse(x + 26, y - 4, 22, 14, -0.2, 0, TAU); g.fill(); g.stroke(); g.fillStyle = INKC; g.beginPath(); g.arc(x + 36, y - 8, 2.6, 0, TAU); g.fill(); } }
      // the pilgrims as a dot matrix (1/3-resolution buffer read back): they sway, sink under the surface, scatter, reform and rise dripping
      const drips = [];
      { const q = 3, bw = Math.ceil(W * S / q), bh = Math.ceil(H * S / q), buf = XY.scratch('i81buf', bw, bh, { read: true }), bc = buf.getContext('2d', { willReadFrequently: true });
        bc.setTransform(S / q, 0, 0, S / q, 0, 0); bc.transform(...X.M); K.draw(bc, e.phase, e.procX, e.groundY, DPEN, A);
        const x0 = Math.max(0, floor((e.procX - 480) * S / q)), x1 = Math.min(bw, Math.ceil((e.procX + 440) * S / q)), y0 = Math.max(0, floor(380 * S / q)), y1 = bh;
        if (x1 > x0 && y1 > y0) { const d = bc.getImageData(x0, y0, x1 - x0, y1 - y0).data, w = x1 - x0, paths = new Map(), amp = (16 * K.hit(beat, DIVE, 3) + 34 * scatOf(beat)) * S, ds = 2.5 * S * q / 4, sY = SURF * S;
          for (let j = 0; j < y1 - y0; j++) for (let i = 0; i < w; i++) { const o = (j * w + i) * 4; if (d[o + 3] < 110) continue;
            const key = ((d[o] >> 4) << 8) | ((d[o + 1] >> 4) << 4) | (d[o + 2] >> 4); let p = paths.get(key); if (!p) paths.set(key, p = new Path2D());
            let x = (x0 + i) * q + q / 2, y = (y0 + j) * q + q / 2; if (amp > 0.3) { x += amp * (XY.hash(i, j, 11) - 0.5) * 2; y += amp * (XY.hash(i, j, 12) - 0.6) * 2; }
            if (y > sY) x += 5 * S * sin(y / (12 * S) + t * 3);
            if (((i * 31 + j * 17) % 151) === 0) drips.push([x / S, y / S]);
            p.rect(x - ds / 2, y - ds / 2, ds, ds); }
          g.save(); g.setTransform(1, 0, 0, 1, 0, 0); paths.forEach((p, key) => { g.fillStyle = `rgb(${(key >> 8) * 17},${((key >> 4) & 15) * 17},${(key & 15) * 17})`; g.fill(p); }); g.restore(); } }
      // water running off them as they rise
      { const dv = win(beat, RISE + 0.5, RISE + 2.4); if (dv > 0 && dv < 1) { g.fillStyle = BLUE; drips.forEach(([x, y], k) => { const f = (t * 1.6 + XY.hash(k, 51)) % 1; if (y > SURF) return; g.globalAlpha = 1 - dv; g.fillRect(x - 1, y + f * 60, 2, 4); }); g.globalAlpha = 1; } }
      // the crown of spray when the turtle goes down
      { const d = (beat - DIVE) * XY.BEAT; if (d > 0 && d < 1.1) { const p = new Path2D(); for (let k = 0; k < 300; k++) { const x0 = sc.turtleX - 420 + 840 * XY.hash(k, 21), vx = (XY.hash(k, 22) - 0.5) * 300, vy = -350 - 600 * XY.hash(k, 23);
          const x = x0 + vx * d, y = SURF + vy * d + 1500 * d * d; if (y > SURF + 4) continue; const r = 1.2 + 2.8 * XY.hash(k, 24); p.moveTo(x + r, y); p.arc(x, y, r, 0, TAU); } g.fillStyle = BLUE; g.fill(p); } }
      // near: the water surface in front (everything under it shows faded through), its lines and current, rings, bubbles
      g.fillStyle = 'rgba(228,234,236,0.72)'; g.fillRect(0, SURF, W, H - SURF);
      g.save(); g.beginPath(); g.rect(0, SURF, W, H - SURF); g.clip(); SL.L.forEach(({ pts, v }) => { if (pts[1] < SURF - 20) return; g.strokeStyle = `rgba(31,78,140,${0.18 + 0.25 * v})`; g.lineWidth = 0.6 + 1.6 * v; XY.path(g, pts, false); g.stroke(); }); g.restore();
      flow(SL.L, 460, true, 'rgba(31,78,140,0.7)', 2.2, 14);
      g.strokeStyle = INKC; g.lineWidth = 1.3; g.beginPath(); g.moveTo(0, SURF); g.lineTo(W, SURF); g.stroke();
      const ring = (x, y, v, R) => { if (v <= 0 || v >= 1) return; g.globalAlpha = (1 - v) * 0.75; g.beginPath(); g.ellipse(x, y, 8 + R * v, (8 + R * v) * 0.18, 0, 0, TAU); g.stroke(); g.globalAlpha = 1; };
      g.strokeStyle = BLUE; g.lineWidth = 1.3;
      if (beat > DIVE) for (let k = 0; k < 6; k++) ring(sc.turtleX - 375 + k * 150, SURF + 10, win(beat, DIVE + k * 0.05, DIVE + 1.8 + k * 0.05), 190);
      if (beat > DIVE + 0.3 && beat < RISE + 0.8) { g.strokeStyle = 'rgba(31,78,140,0.6)'; g.lineWidth = 1; for (let k = 0; k < 26; k++) { const p = (beat * 0.8 + XY.hash(k, 41)) % 1, x = sc.turtleX - 340 + 680 * XY.hash(k, 42), y = SURF + 50 - 54 * p; g.beginPath(); g.arc(x, y, 1.5 + 3 * XY.hash(k, 43), 0, TAU); g.stroke(); } }
      const CX = [-1.5, -0.5, 0.5, 1.5].map(k => W / 2 + k * 192);
      for (let b = DRY; b <= floor(beat) + 1; b++) { const x = CX[b % 4] + 30 * (XY.hash(b, 31) - 0.5), y1 = SURF + 36 + 8 * XY.hash(b, 32);
        for (let r = 0; r < 3; r++) ring(x, y1, win(beat, b + r * 0.22, b + 2.4 + r * 0.22), 160);
        const f = win(beat, b - 0.6, b); if (f > 0 && f < 1) { const y = XY.lerp(360, y1, f * f); g.fillStyle = BLUE; g.beginPath(); g.moveTo(x, y - 10); g.quadraticCurveTo(x + 6, y, x, y + 5); g.quadraticCurveTo(x - 6, y, x, y - 10); g.fill(); } }
      // the pages, and the characters coming off them into 九九归真; a pulse runs through the words on each beat
      sc.pages.forEach(pg => { const st = pageAt(pg, beat, t); if (st) drawPage(g, st, pg.torn); });
      { const paths = [new Path2D(), new Path2D(), new Path2D()], on = beat >= FORM, sweep = sc.ox + ((beat % 1 + 1) % 1) * TXT.w * 1.2 - 60;
        sc.P.forEach(q => { const p = partAt(q, sc.pages, beat, t); if (!p) return; let s = p[2] * (on ? 1.25 : 1); if (on) s += 1.4 * Math.exp(-Math.pow((q.tx - sweep) / 50, 2)); paths[q.col].rect(p[0] - s / 2, p[1] - s / 2, s, s); });
        [INKC, VERM, GOLD].forEach((c, k) => { g.fillStyle = c; g.fill(paths[k]); }); }
      { const v = win(beat, FORM, FORM + 1.4); if (v > 0 && v < 1) { g.strokeStyle = `rgba(27,31,42,${0.55 * (1 - v)})`; g.lineWidth = 1.4; g.beginPath(); g.ellipse(W / 2, 262, 420 + 320 * v, 120 + 100 * v, 0, 0, TAU); g.stroke(); } }
    },
  };
})();
