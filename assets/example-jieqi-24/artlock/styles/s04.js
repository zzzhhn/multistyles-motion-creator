// s04 春分 · 宋元界画 (ruled-line painting). Old silk, light colour. House, wall, gate and stone bridge are drawn with a ruler:
// fine straight lines for tile rows, eave tiles, rafter ends, railings, brick courses and door studs. Hills, rocks and the
// old tree are Song brushwork: pale ink texture strokes and washes, laid on a reduced layer and softened before they go back.
// 春分: the left half is day; the right half is night (one more layer of ink-green wash and a thin moon).
// Moment (始电): the first lightning is one crooked freehand line across a sheet of ruled straight lines; the only line in
// the picture not drawn with a ruler. Swallows (玄鸟至) skim the field toward the eaves.
(function () {
  const JQ = window.JQ, S = JQ.SCENE, L = JQ.L, TAU = Math.PI * 2;
  const SILK = '#D5C095', INK = '#2A241D', MID = 960;
  const spline = (P, step = 6) => {
    const out = [];
    for (let i = 0; i < P.length - 1; i++) {
      const p0 = P[Math.max(0, i - 1)], p1 = P[i], p2 = P[i + 1], p3 = P[Math.min(P.length - 1, i + 2)];
      const n = Math.max(2, Math.ceil(Math.hypot(p2[0] - p1[0], p2[1] - p1[1]) / step));
      for (let j = 0; j < n; j++) { const u = j / n, u2 = u * u, u3 = u2 * u; out.push([0, 1].map(k => 0.5 * (2 * p1[k] + (-p0[k] + p2[k]) * u + (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * u2 + (-p0[k] + 3 * p1[k] - 3 * p2[k] + p3[k]) * u3))); }
    }
    out.push(P[P.length - 1]); return out;
  };
  // a brush line: presses in, swells, lifts; width breathes with the hand
  const brush = (g, ctrl, w, seed = 1, col = INK, raw = false) => {
    const P = raw ? ctrl : spline(ctrl), n = P.length; if (n < 2) return;
    const A = [], B = [];
    for (let i = 0; i < n; i++) {
      const a = P[Math.max(0, i - 1)], b = P[Math.min(n - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], d = Math.hypot(dx, dy) || 1, q = i / (n - 1);
      const hw = 0.5 * w * (0.35 + 0.65 * JQ.smooth(0, 0.15, q)) * (1 - 0.7 * JQ.smooth(0.7, 1, q)) * (0.7 + 0.6 * JQ.noise(i * 0.1, 0.4, seed));
      A.push([P[i][0] - dy / d * hw, P[i][1] + dx / d * hw]); B.push([P[i][0] + dy / d * hw, P[i][1] - dx / d * hw]);
    }
    const p = new Path2D(); [...A, ...B.reverse()].forEach(([x, y], i) => i ? p.lineTo(x, y) : p.moveTo(x, y)); p.closePath();
    g.fillStyle = col; g.fill(p);
  };
  // ruled lines are gathered into one path and stroked once: same width, same tone, dead straight
  const Ruler = () => { const p = new Path2D(); return { p, l(x0, y0, x1, y1) { p.moveTo(x0, y0); p.lineTo(x1, y1); }, box(x0, y0, x1, y1) { p.rect(x0, y0, x1 - x0, y1 - y0); }, o(x, y, r) { p.moveTo(x + r, y); p.arc(x, y, r, 0, TAU); } }; };
  const inkRule = (g, R, w = 1.25, a = 0.85) => { g.strokeStyle = `rgba(42,36,29,${a})`; g.lineWidth = w; g.lineCap = 'butt'; g.lineJoin = 'miter'; g.stroke(R.p); };
  const silk = (g, Sx) => {
    g.fillStyle = SILK; g.fillRect(0, 0, JQ.W, JQ.H);
    const v = g.createRadialGradient(960, 520, 300, 960, 540, 1150); v.addColorStop(0, 'rgba(120,90,50,0)'); v.addColorStop(1, 'rgba(110,80,40,0.32)'); g.fillStyle = v; g.fillRect(0, 0, JQ.W, JQ.H);
    const R = JQ.rng(404);
    for (let i = 0; i < 14; i++) { const x = R() * 1920, y = R() * 1080, r = 60 + R() * 200, gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, 'rgba(130,95,50,0.09)'); gr.addColorStop(1, 'rgba(130,95,50,0)'); g.fillStyle = gr; g.fillRect(x - r, y - r, 2 * r, 2 * r); }
    g.fillStyle = 'rgba(90,70,40,0.07)'; for (let y = 0; y < 1080; y += 3) g.fillRect(0, y, 1920, 1); for (let x = 0; x < 1920; x += 3) g.fillRect(x, 0, 1, 1080);
    g.fillStyle = 'rgba(255,245,220,0.06)'; for (let i = 0; i < 300; i++) g.fillRect(R() * 1920, R() * 1080, 30 + R() * 140, 1);
  };
  // soft ink: draw fn on a half-size layer, blur it, lay it back
  const soft = (g, Sx, blur, fn, alpha = 1) => {
    const Lr = JQ.layer('s04soft', Sx, { res: 0.5 }); Lr.g.filter = `blur(${blur * Sx.scale * 0.5}px)`; fn(Lr.g); Lr.g.filter = 'none';
    g.save(); g.globalAlpha = alpha; JQ.blit(g, Lr); g.restore();
  };
  JQ._s04 = { SILK, INK, MID, spline, brush, Ruler, inkRule, silk, soft };
})();
(function () {
  const JQ = window.JQ, S = JQ.SCENE, L = JQ.L, TAU = Math.PI * 2, K = JQ._s04, { INK, brush, soft } = K;
  const landscape = (g, Sx) => {
    // mountains: pale ink body, mineral blue on the upper slopes, then texture strokes and a living contour
    soft(g, Sx, 10, w => {
      w.fillStyle = 'rgba(95,105,98,0.32)'; w.fill(S.mountains.path);
      w.save(); w.clip(S.mountains.path); w.fillStyle = 'rgba(70,130,135,0.42)'; w.fill(JQ.P([...S.ridge.pts.map(([x, y]) => [x, y - 10]), ...S.ridge.pts.slice().reverse().map(([x, y]) => [x, y + 46])])); w.restore();
      w.fillStyle = 'rgba(105,140,100,0.38)'; w.fill(S.hills.path);
      w.fillStyle = 'rgba(175,160,110,0.28)'; w.fill(S.field.path);   // fallow loess; the ploughed part is laid on below
      w.fillStyle = 'rgba(150,120,80,0.14)'; for (let i = 0; i < 9; i++) { w.beginPath(); w.ellipse(100 + i * 220, 760 + (i % 3) * 90, 180, 50, 0, 0, TAU); w.fill(); }
      w.fillStyle = 'rgba(80,130,140,0.32)'; w.fill(S.pond.path); w.fill(S.stream.path);
    });
    const rg = S.ridge.pts;
    soft(g, Sx, 1.4, w => {
      for (let j = 0; j < 150; j++) { const i = 2 + Math.floor(JQ.hash(j, 1, 3) * (rg.length - 5)), [x, y] = rg[i], [x2, y2] = rg[i + 1], sl = Math.atan2(y2 - y, x2 - x), d = 6 + Math.pow(JQ.hash(j, 2, 3), 1.6) * 70, l = 10 + JQ.hash(j, 3, 3) * 26, a = (sl > 0 ? 1.9 : 1.25) + (JQ.hash(j, 4, 3) - 0.5) * 0.5;
        brush(w, [[x, y + d], [x + Math.cos(a) * l * 0.5 + 3, y + d + Math.sin(a) * l * 0.5], [x + Math.cos(a) * l, y + d + Math.sin(a) * l]], 1.6 + JQ.hash(j, 5, 3) * 2.4, j, `rgba(42,36,29,${0.22 + JQ.hash(j, 6, 3) * 0.25})`); }
      for (let j = 0; j < 60; j++) { const i = 2 + Math.floor(JQ.hash(j, 7, 3) * (rg.length - 5)), [x, y] = rg[i]; w.fillStyle = 'rgba(30,40,30,0.55)'; w.beginPath(); w.ellipse(x + (JQ.hash(j, 8, 3) - 0.5) * 10, y + 2, 3, 2, 0, 0, TAU); w.fill(); }
    });
    for (let s = 0; s < rg.length - 1; s += 22) brush(g, rg.slice(s, Math.min(rg.length, s + 24)), 3.6, 11 + s, 'rgba(42,36,29,0.62)', true);
    brush(g, S.hills.pts.slice(0, -2).filter((_, i) => i % 2 === 0), 2, 13, 'rgba(42,36,29,0.38)');
    // field: hand-drawn furrow lines, slightly wavering (these are brush, not ruler)
    S.furrows.forEach((f, k) => { if (k % 2) return; const [p0, p1, p2] = f.pts, pts = []; for (let x = 0; x <= 1920; x += 60) { const y = x < p1[0] ? JQ.lerp(p0[1], p1[1], x / p1[0]) : JQ.lerp(p1[1], p2[1], (x - p1[0]) / (p2[0] - p1[0])); pts.push([x, y + (JQ.noise(x * 0.01, k, 4) - 0.5) * 12]); }
      for (let s0 = 0; s0 < pts.length - 2; s0 += 5 + (k % 3)) brush(g, pts.slice(s0, s0 + 5), 2.2, 20 + k * 7 + s0, 'rgba(42,36,29,0.3)'); });
    K.ploughed(g, Sx);
    soft(g, Sx, 1.2, w => { for (let i = 0; i < 500; i++) { const x = JQ.hash(i, 1, 21) * 1920, y = 440 + JQ.hash(i, 2, 21) * 230; if (y > 690 - x * 0.04) continue; w.fillStyle = `rgba(110,85,55,${0.2 + JQ.hash(i, 3, 21) * 0.25})`; w.beginPath(); w.ellipse(x, y, 2.6, 1.6, 0, 0, TAU); w.fill(); } });
    // pond and stream: a brush bank, then fine net-like water lines
    const pp = S.pond.pts; brush(g, pp.slice(0, 50), 3.2, 30, 'rgba(42,36,29,0.7)', true); brush(g, pp.slice(50).concat([pp[0]]), 2.2, 31, 'rgba(42,36,29,0.5)', true);
    g.save(); g.clip(S.pond.path); g.strokeStyle = 'rgba(42,60,60,0.35)'; g.lineWidth = 1;
    for (let y = 790; y < 980; y += 11) { g.beginPath(); for (let x = 670; x < 1320; x += 6) { const yy = y + Math.sin(x * 0.045 + y * 0.3) * 3.2; x === 670 ? g.moveTo(x, yy) : g.lineTo(x, yy); } g.stroke(); }
    g.restore();
    const sn = S.stream.center.length; brush(g, S.stream.pts.slice(0, sn), 2, 32, 'rgba(42,36,29,0.55)', true); brush(g, S.stream.pts.slice(sn).reverse(), 2, 33, 'rgba(42,36,29,0.55)', true);
    g.save(); g.clip(S.stream.path); g.strokeStyle = 'rgba(42,60,60,0.35)'; g.lineWidth = 1; S.stream.center.forEach(([x, y], i) => { if (i % 2) return; g.beginPath(); g.moveTo(x - 40, y - 4); g.quadraticCurveTo(x, y + 6, x + 40, y - 4); g.stroke(); }); g.restore();
    // rocks by the pond in axe-cut texture (斧劈皴): pale wash, then short slanting strokes
    [[690, 940, 46], [1300, 900, 38], [770, 1000, 34]].forEach(([x, y, r], i) => {
      soft(g, Sx, 3, w => { w.fillStyle = 'rgba(80,90,85,0.45)'; w.beginPath(); w.moveTo(x - r, y + r * 0.5); w.lineTo(x - r * 0.7, y - r * 0.5); w.lineTo(x + r * 0.2, y - r * 0.8); w.lineTo(x + r, y - r * 0.1); w.lineTo(x + r * 0.9, y + r * 0.5); w.closePath(); w.fill(); });
      brush(g, [[x - r, y + r * 0.5], [x - r * 0.7, y - r * 0.5], [x + r * 0.2, y - r * 0.8], [x + r, y - r * 0.1]], 3, 40 + i, 'rgba(42,36,29,0.7)');
      for (let k = 0; k < 5; k++) brush(g, [[x - r * 0.5 + k * r * 0.25, y - r * 0.4 + k * 3], [x - r * 0.7 + k * r * 0.25, y + r * 0.3]], 4, 50 + i * 9 + k, 'rgba(42,36,29,0.4)');
    });
  };
  // the old tree: brush trunk with scale-bark, crab-claw branches, fresh leaf dots of early spring
  const crown = (g, Sx) => {
    soft(g, Sx, 10, w => { w.fillStyle = 'rgba(120,150,95,0.30)'; S.clumps.forEach(c => { w.beginPath(); w.ellipse(c.x, c.y, c.r * 0.8, c.r * 0.6, 0, 0, TAU); w.fill(); }); });
    S.branches.forEach((b, i) => { const mx = (b.x1 + b.x2) / 2 + (JQ.hash(i, 1, 9) - 0.5) * 16, my = (b.y1 + b.y2) / 2 + (JQ.hash(i, 2, 9) - 0.5) * 10;
      brush(g, [[b.x1, b.y1], [mx, my], [b.x2, b.y2]], Math.max(1.4, b.w * 0.75), 100 + i, 'rgba(42,36,29,0.85)');
      if (b.depth >= 4) brush(g, [[b.x2, b.y2], [b.x2 + 6, b.y2 - 10], [b.x2 + 2, b.y2 - 16]], 1.6, 300 + i, 'rgba(42,36,29,0.8)'); });
    soft(g, Sx, 0.8, w => { S.tips.forEach(([x, y], i) => { for (let k = 0; k < 4; k++) { const a = JQ.hash(i, k, 13) * TAU, d = 4 + JQ.hash(i, k, 14) * 12; w.fillStyle = k % 2 ? 'rgba(70,110,50,0.7)' : 'rgba(42,50,30,0.7)'; w.beginPath(); w.ellipse(x + Math.cos(a) * d, y + Math.sin(a) * d, 4, 2.4, a, 0, TAU); w.fill(); } }); });
  };
  const tree = (g, Sx, part) => {             // part: 'crown' (cached background) or 'trunk' (drawn at the family's depth, opaque)
    if (part !== 'trunk') return crown(g, Sx);
    g.fillStyle = K.SILK; g.fill(S.trunk.path); g.fillStyle = 'rgba(150,120,80,0.25)'; g.fill(S.trunk.path);
    soft(g, Sx, 2, w => { w.fillStyle = 'rgba(85,70,55,0.55)'; w.fill(S.trunk.path); });
    const tp = S.trunk.pts, h = tp.length / 2; brush(g, tp.slice(0, h), 4, 60, INK, true); brush(g, tp.slice(h).reverse(), 3.2, 61, INK, true);
    for (let i = 0; i < 22; i++) { const y = 500 + JQ.hash(i, 1, 6) * 320, x = 452 + JQ.hash(i, 2, 6) * 26 + (830 - y) * 0.08, r = 6 + JQ.hash(i, 3, 6) * 6; brush(g, [[x - r, y + 2], [x - r * 0.3, y - r * 0.6], [x + r * 0.6, y - r * 0.3], [x + r, y + 3]], 1.8, 70 + i, 'rgba(42,36,29,0.5)'); }
  };
  Object.assign(K, { landscape, tree });
  // 春分: most of the field is already ploughed (earlier passes, rows above the near edge); the near row is still being
  // turned and follows the plough share (the trail), finishing where the plough stops at 3.6 s
  const fyB = x => x < 1180 ? JQ.lerp(690, 640, x / 1180) : JQ.lerp(640, 590, (x - 1180) / 740), X0 = 1218, XA = 30, XB = 1250;
  K.ploughed = (g, Sx) => {
    const top = [], bot = []; for (let x = XA; x <= XB; x += 20) { top.push([x, 520 - x * 0.02 + (JQ.noise(x * 0.012, 3, 7) - 0.5) * 22]); bot.push([x, fyB(x) - 38]); }
    top.push([XB + 30, 560]); const reg = JQ.P([...top, ...bot.reverse()]);
    soft(g, Sx, 16, w => { w.fillStyle = 'rgba(130,95,55,0.34)'; w.fill(reg); });
    for (let k = 0; k < 7; k++) { const pts = [], xe = XB - 10 - JQ.hash(k, 2, 4) * 70; for (let x = xe; x >= XA + 10; x -= 40) { const yb = fyB(x) - 46, yt = 524 - x * 0.02; pts.push([x, JQ.lerp(yb, yt, Math.pow(k / 6.4, 1.25)) + (JQ.noise(x * 0.01, k, 6) - 0.5) * 6]); }
      for (let s0 = 0; s0 < pts.length - 2; s0 += 4) brush(g, pts.slice(s0, s0 + 5), 2.4 - k * 0.15, 900 + k * 13 + s0, 'rgba(70,50,30,0.42)'); }
  };
  let END = null;
  const shareX = CA => { const pl = CA.items.find(it => it.kind === 'plow'), m = pl && pl.parts.find(p => p.role === 'metal'); return m ? Math.min(...m.pts.map(q => q[0])) : null; };
  K.trail = (g, CA) => {
    let x1 = shareX(CA);
    if (x1 == null) { const st = CA.state; if (st.term < 4 || (st.term === 4 && st.t < 1)) return; if (END == null) END = shareX(JQ.cast(4, 3.59)) || 470; x1 = END; }
    if (x1 >= X0 - 4) return;
    const top = [], bot = []; for (let x = x1; x <= X0; x += 14) { top.push([x, fyB(x) - 40]); bot.push([x, fyB(x) + 2]); } top.push([X0, fyB(X0) - 40]); bot.push([X0, fyB(X0) + 2]);
    g.fillStyle = 'rgba(115,82,48,0.36)'; g.fill(JQ.P([...top, ...bot.reverse()]));
    for (let r = 0; r < 3; r++) { const row = []; for (let x = X0; x >= x1 + 2; x -= 30) row.push([x, fyB(x) - 32 + r * 12 + (JQ.noise(x * 0.02, r, 9) - 0.5) * 4]); if (row.length > 1) brush(g, row, 2.2, 950 + r, 'rgba(60,42,25,0.55)', true); }
  };
})();
(function () {
  const JQ = window.JQ, S = JQ.SCENE, L = JQ.L, TAU = Math.PI * 2, K = JQ._s04, { INK, Ruler, inkRule } = K, H = L.house, B = L.bridge;
  const wash = (g, path, col) => { g.fillStyle = col; g.fill(path); };
  const house = g => {
    wash(g, S.roof.path, 'rgba(70,85,92,0.32)'); wash(g, S.houseFront.path, 'rgba(215,202,170,0.62)'); wash(g, S.wall.path, 'rgba(200,188,155,0.6)');
    wash(g, S.gate.path, 'rgba(160,62,40,0.55)'); wash(g, S.gateRoof.path, 'rgba(70,85,92,0.35)'); wash(g, S.wallCap.path, 'rgba(70,85,92,0.35)');
    wash(g, S.bridge.path, 'rgba(190,180,155,0.62)'); wash(g, S.window.path, 'rgba(60,50,40,0.35)'); wash(g, S.chimney.path, 'rgba(70,85,92,0.35)');
    const R = Ruler(), r0 = H.roofX0, r1 = H.roofX1, q0 = H.roofX0 + 46, q1 = H.roofX1 - 40, ey = k => H.eaveY - Math.pow(Math.abs(k - 0.5) * 2, 6) * 12;
    // roof: paired tile rows from ridge to eave, round eave tiles, square rafter ends, a banded ridge with end blocks
    for (let i = 0; i < 46; i++) { const k = (i + 0.5) / 46; [-0.0035, 0.0035].forEach(d => R.l(JQ.lerp(q0, q1, k + d), H.ridgeY + 5, JQ.lerp(r0, r1, k + d), ey(k + d) - 3)); R.o(JQ.lerp(r0, r1, k), ey(k) + 1, 3.2); }
    for (let i = 0; i < 46; i++) { const k = i / 46, x = JQ.lerp(r0, r1, k); R.box(x - 2.4, ey(k) + 6, x + 2.4, ey(k) + 11); }
    R.l(r0, ey(0) - 3, r1, ey(1) - 3); R.l(r0 + 10, H.eaveY + 13, r1 - 10, H.eaveY + 13);
    R.box(q0 - 4, H.ridgeY - 8, q1 + 4, H.ridgeY + 5); R.l(q0 - 4, H.ridgeY - 2, q1 + 4, H.ridgeY - 2); R.box(q0 - 12, H.ridgeY - 26, q0 + 4, H.ridgeY + 5); R.box(q1 - 4, H.ridgeY - 26, q1 + 12, H.ridgeY + 5);
    R.l(r0, ey(0) - 3, q0 - 4, H.ridgeY + 5); R.l(r1, ey(1) - 3, q1 + 4, H.ridgeY + 5);
    // front: lintel, columns, lattice doors and windows
    R.l(H.roofX0 + 22, H.eaveY + 18, H.roofX1 - 10, H.eaveY + 18); R.l(H.roofX0 + 22, H.eaveY + 23, H.roofX1 - 10, H.eaveY + 23);
    const cols = [1500, 1590, 1680, 1770, 1862]; cols.forEach(x => { R.l(x - 4, H.eaveY + 14, x - 4, 586); R.l(x + 4, H.eaveY + 14, x + 4, 586); });
    for (let c = 0; c < cols.length - 1; c++) { const a = cols[c] + 10, b = cols[c + 1] - 10; R.box(a, 560, b, 584); for (let x = a + 6; x < b; x += 6) R.l(x, 560, x, 584); for (let y = 566; y < 584; y += 6) R.l(a, y, b, y); }
    R.box(1560, H.ridgeY - 52, 1590, H.ridgeY + 4); for (let y = H.ridgeY - 44; y < H.ridgeY; y += 8) R.l(1560, y, 1590, y);
    // wall: coping tiles, brick courses, a plinth
    R.box(H.wallX0 - 10, H.wallTop - 14, H.wallX1, H.wallTop + 6); for (let x = H.wallX0 - 6; x < H.wallX1; x += 8) R.l(x, H.wallTop - 14, x, H.wallTop - 4);
    for (let y = H.wallTop + 16, r = 0; y < H.wallBot - 16; y += 10, r++) { R.l(H.wallX0, y, H.wallX1, y); for (let x = H.wallX0 + (r % 2) * 12; x < H.wallX1; x += 24) { if (x > H.gateX0 - 4 && x < H.gateX1 + 4 && y > H.gateTop - 12) continue; R.l(x, y, x, y + 10); } }
    R.l(H.wallX0, H.wallBot - 16, H.wallX1, H.wallBot - 16); R.box(H.wallX0, H.wallTop, H.wallX1, H.wallBot);
    // gate tower: tiles, eave tiles, brackets, studded doors, steps
    const gx0 = H.gateX0, gx1 = H.gateX1, gm = (gx0 + gx1) / 2, gt = H.gateTop;
    for (let i = 0; i <= 18; i++) { const k = i / 18, xe = JQ.lerp(gx0 - 34, gx1 + 34, k), xt = JQ.lerp(gm - 6, gm + 6, k), yt = gt - 40 + Math.abs(k - 0.5) * 4; R.l(xt, yt, xe, gt - 6 + 0); R.o(xe, gt - 2, 2.6); }
    R.l(gx0 - 34, gt - 6, gx1 + 34, gt - 6); R.l(gx0 - 24, gt + 4, gx1 + 24, gt + 4);
    for (let x = gx0 - 18; x <= gx1 + 18; x += 14) R.box(x - 4, gt + 4, x + 4, gt + 12);
    R.box(gx0 + 4, gt + 18, gx1 - 4, H.wallBot); R.l(gm, gt + 18, gm, H.wallBot);
    for (let j = 0; j < 6; j++) for (let i = 0; i < 3; i++) { R.o(gx0 + 12 + i * 10, gt + 34 + j * 16, 2.2); R.o(gm + 8 + i * 10, gt + 34 + j * 16, 2.2); }
    R.o(gm - 7, gt + 84, 5); R.o(gm + 7, gt + 84, 5);
    R.box(gx0 - 16, H.wallBot, gx1 + 16, H.wallBot + 9); R.box(gx0 - 28, H.wallBot + 9, gx1 + 28, H.wallBot + 18);
    inkRule(g, R, 1.15, 0.82);
  };
  // the bridge: compass arches, ruled voussoirs, stone courses and a railing
  const bridge = g => {
    const R = Ruler(), ry = B.archBase - B.archTop, rx = B.half - 18;
    for (let a = Math.PI + 0.12; a < TAU - 0.05; a += 0.2) R.l(B.cx + Math.cos(a) * rx, B.archBase + Math.sin(a) * ry, B.cx + Math.cos(a) * (rx + 16), B.archBase + Math.sin(a) * (ry + 14));
    R.p.moveTo(B.cx + rx + 16, B.archBase); R.p.ellipse(B.cx, B.archBase, rx + 16, ry + 14, 0, 0, Math.PI, true);
    R.p.moveTo(B.cx + rx, B.archBase); R.p.ellipse(B.cx, B.archBase, rx, ry, 0, 0, Math.PI, true);
    [B.deckY + 14, B.deckY + 24].forEach(y => { R.l(B.cx - B.half, y, B.cx - rx - 18, y); R.l(B.cx + rx + 18, y, B.cx + B.half, y); });
    R.l(B.cx - B.half - 24, B.deckY + 18, B.cx - B.half, B.deckY); R.l(B.cx - B.half, B.deckY, B.cx + B.half, B.deckY); R.l(B.cx + B.half, B.deckY, B.cx + B.half + 24, B.deckY + 18);
    R.l(B.cx - B.half, B.deckY + 6, B.cx + B.half, B.deckY + 6); R.l(B.cx - B.half, B.deckY, B.cx - B.half, B.archBase); R.l(B.cx + B.half, B.deckY, B.cx + B.half, B.archBase);
    for (let x = B.cx - B.half; x <= B.cx + B.half; x += 15.33) R.box(x - 2, B.deckY - 22, x + 2, B.deckY);
    [B.deckY - 17, B.deckY - 9].forEach(y => R.l(B.cx - B.half, y, B.cx + B.half, y));
    R.l(B.cx - B.half - 24, B.deckY + 4, B.cx - B.half, B.deckY - 17); R.l(B.cx + B.half, B.deckY - 17, B.cx + B.half + 24, B.deckY + 4);
    inkRule(g, R, 1.15, 0.85);
  };
  Object.assign(K, { house, bridge });
})();
(function () {
  const JQ = window.JQ, S = JQ.SCENE, L = JQ.L, TAU = Math.PI * 2, K = JQ._s04, { INK, MID, brush } = K;
  const FILL = { skin: 'rgba(238,205,170,0.8)', hair: INK, coat: 'rgba(110,150,160,0.6)', pants: 'rgba(90,85,80,0.45)', ox: 'rgba(185,135,80,0.55)', oxDark: 'rgba(80,60,45,0.6)', horn: 'rgba(240,230,205,0.9)', eye: INK, hat: 'rgba(190,160,100,0.6)',
    apron: 'rgba(235,226,200,0.85)', scarf: 'rgba(160,70,55,0.6)', straw: 'rgba(200,170,105,0.65)', cape: 'rgba(140,115,80,0.6)', calf: 'rgba(200,150,95,0.5)', calfDark: 'rgba(80,60,45,0.55)',
    prop: 'rgba(125,92,60,0.75)', metal: 'rgba(90,95,100,0.8)', red: 'rgba(185,52,40,0.88)', line: INK };
  const gongbi = (g, parts, who) => { for (const p of parts) { if (p.role === 'line') { g.fillStyle = 'rgba(42,36,29,0.85)'; g.fill(p.path); continue; } const f = who === 'woman' && p.role === 'coat' ? 'rgba(80,105,140,0.55)' : FILL[p.role] || FILL[JQ.ROLE_FALLBACK[p.role]]; if (!f) continue; g.fillStyle = K.SILK; g.fill(p.path); g.fillStyle = f; g.fill(p.path); if (p.role !== 'eye' && p.role !== 'hair') { g.strokeStyle = 'rgba(42,36,29,0.9)'; g.lineWidth = 1.5; g.lineJoin = 'round'; g.stroke(p.path); } } };
  const title = g => {
    g.fillStyle = INK; g.textAlign = 'center'; g.textBaseline = 'top';
    g.font = '84px "Kaiti SC", "STKaiti", serif'; JQ.vtext(g, '春分', 180, 640, 88);
    g.fillStyle = 'rgba(176,50,38,0.85)'; g.fillRect(158, 828, 44, 44); g.fillStyle = 'rgba(213,192,149,0.95)'; g.font = '30px "Songti SC", serif'; g.fillText('春', 180, 835);
  };
  // a ruled bamboo fence on the left (day) half, so the ruler is at work on both halves
  const fence = g => {
    const R = K.Ruler(), x0 = 236, x1 = 540, y = x => 744 - (x - x0) * 0.02;
    g.fillStyle = 'rgba(175,150,100,0.42)'; for (let x = x0; x <= x1; x += 24) g.fillRect(x - 3, y(x) - 6, 6, 62);
    for (let x = x0; x <= x1; x += 24) { R.box(x - 3, y(x) - 6, x + 3, y(x) + 56); R.l(x - 3, y(x) - 6, x, y(x) - 12); R.l(x, y(x) - 12, x + 3, y(x) - 6); R.l(x - 3, y(x) + 14, x + 3, y(x) + 14); }
    [10, 34].forEach(d => { R.l(x0 - 8, y(x0) + d, x1 + 8, y(x1) + d); R.l(x0 - 8, y(x0) + d + 5, x1 + 8, y(x1) + d + 5); });
    for (let x = x0; x < x1; x += 48) { R.l(x, y(x) + 20, x + 24, y(x + 24) + 44); R.l(x + 24, y(x + 24) + 20, x, y(x) + 44); }
    K.inkRule(g, R, 1.1, 0.8);
  };
  const base = (g, Sx) => {
    K.silk(g, Sx); K.landscape(g, Sx); fence(g);
    g.save(); g.translate(470, 830); g.scale(0.93, 0.93); g.translate(-470, -830); K.tree(g, Sx, 'crown'); g.restore();   // a little smaller: the crown clears the mount
    title(g);
  };
  // night: one more layer of ink-green wash over the right half, a thin moon, a lamp in the window
  const night = (g, Sx) => {
    const gr = g.createLinearGradient(MID - 40, 0, MID + 40, 0); gr.addColorStop(0, 'rgba(22,36,44,0)'); gr.addColorStop(1, 'rgba(22,36,44,0.46)');
    g.fillStyle = gr; g.fillRect(MID - 40, 0, 80, 1080); g.fillStyle = 'rgba(22,36,44,0.46)'; g.fillRect(MID + 40, 0, 1920, 1080);
    g.save(); g.beginPath(); g.arc(1720, 132, 38, 0, TAU); g.clip(); g.fillStyle = 'rgba(240,230,196,0.95)'; g.beginPath(); g.arc(1720, 132, 38, 0, TAU); g.arc(1738, 122, 36, 0, TAU); g.fill('evenodd'); g.restore();
  };
  const mount = g => {
    const M = 34; g.fillStyle = '#525A4A'; g.fillRect(0, 0, 1920, M); g.fillRect(0, 1080 - M, 1920, M); g.fillRect(0, 0, M, 1080); g.fillRect(1920 - M, 0, M, 1080);
    g.fillStyle = 'rgba(255,255,255,0.05)'; for (let i = 0; i < 1920; i += 4) { g.fillRect(i, 0, 1, M); g.fillRect(i, 1080 - M, 1, M); }
    g.strokeStyle = '#B9A675'; g.lineWidth = 2; g.strokeRect(M + 3, M + 3, 1920 - 2 * M - 6, 1080 - 2 * M - 6);
  };
  // a swallow in fine line: blue-black back, chestnut throat, sickle wings, long tail streamers
  const swallow = (g, x, y, s, flap, a) => {
    if (a <= 0.01) return; g.save(); g.globalAlpha = a; g.translate(x, y); g.scale(s, s);
    const wy = -34 + flap * 48, body = new Path2D(); body.ellipse(0, 0, 20, 7, 0, 0, TAU);
    const wing = sg => { const p = new Path2D(); p.moveTo(-4, -2 * sg); p.quadraticCurveTo(-18, wy * 0.6 * sg, -46, wy * sg); p.quadraticCurveTo(-14, wy * 0.3 * sg, 8, 2 * sg); p.closePath(); return p; };
    const tail = new Path2D(); tail.moveTo(-16, -3); tail.lineTo(-52, -12); tail.lineTo(-24, 0); tail.lineTo(-52, 12); tail.lineTo(-16, 3); tail.closePath();
    [wing(-1), tail, body, wing(1)].forEach(p => { g.fillStyle = 'rgba(28,34,48,0.92)'; g.fill(p); g.strokeStyle = INK; g.lineWidth = 1.1; g.stroke(p); });
    g.fillStyle = 'rgba(160,62,36,0.95)'; g.beginPath(); g.ellipse(16, 2, 5, 4, 0, 0, TAU); g.fill(); g.fillStyle = 'rgba(240,232,215,0.95)'; g.beginPath(); g.ellipse(4, 4, 9, 3, 0, 0, TAU); g.fill();
    g.restore();
  };
  // the lightning: a crooked freehand stroke of split hairs (flying white) over the ruled lines
  const BOLT = JQ.resample([[1306, 214], [1270, 246], [1392, 330], [1358, 380], [1500, 520], [1472, 566], [1592, 700], [1566, 738], [1640, 818]], 7, false)
    .map(([x, y], i) => [x + (JQ.noise(i * 0.3, 1, 8) - 0.5) * 7, y + (JQ.noise(i * 0.3, 2, 8) - 0.5) * 5]);
  const bolt = (g, u, glow, a) => {
    const n = Math.max(2, Math.floor(BOLT.length * u)), pts = BOLT.slice(0, n);
    if (glow > 0.01) { g.save(); g.strokeStyle = `rgba(255,246,214,${0.3 * glow})`; g.lineCap = 'round'; g.lineJoin = 'round'; [46, 26].forEach(w => { g.lineWidth = w; g.beginPath(); pts.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.stroke(); }); g.restore(); }
    g.save(); g.globalAlpha = a; brush(g, pts, 9, 77, 'rgba(24,20,16,0.95)', true);
    g.lineCap = 'butt'; for (let k = -3; k <= 3; k++) { if (!k) continue; const off = k * 2.6; g.strokeStyle = 'rgba(24,20,16,0.85)'; g.lineWidth = 1.8; g.setLineDash([18 + JQ.hash(k, 1) * 50, 4 + JQ.hash(k, 2) * 14]);
      g.beginPath(); pts.forEach(([x, y], i) => { const b = pts[Math.min(pts.length - 1, i + 1)], c = pts[Math.max(0, i - 1)], dx = b[0] - c[0], dy = b[1] - c[1], d = Math.hypot(dx, dy) || 1; const px = x - dy / d * off, py = y + dx / d * off; i ? g.lineTo(px, py) : g.moveTo(px, py); }); g.stroke(); }
    g.setLineDash([]); g.restore();
  };
  const BAR = 8 / 3, IMP = 2 * BAR + 4 / 3, HOU = JQ.TERMS[3].hou, RUM = BAR + 4 / 3;
  // 玄鸟至: a swallow come home, sitting on the lintel under the eaves
  const perched = (g, x, y, s) => {
    g.save(); g.translate(x, y); g.scale(s, s);
    const b = new Path2D(); b.ellipse(0, 0, 15, 7, -0.6, 0, TAU);
    const tail = new Path2D(); tail.moveTo(-8, 6); tail.lineTo(-20, 32); tail.lineTo(-11, 13); tail.lineTo(-3, 32); tail.lineTo(-1, 8); tail.closePath();
    const wing = new Path2D(); wing.moveTo(9, -7); wing.quadraticCurveTo(-6, 0, -15, 22); wing.quadraticCurveTo(-1, 9, 11, -2); wing.closePath();
    const head = new Path2D(); head.arc(10, -11, 7, 0, TAU);
    [tail, b, head, wing].forEach(p => { g.fillStyle = 'rgba(28,34,48,0.94)'; g.fill(p); g.strokeStyle = INK; g.lineWidth = 1; g.stroke(p); });
    g.fillStyle = 'rgba(160,62,36,0.95)'; g.beginPath(); g.ellipse(14, -6, 4.5, 3.4, 0, 0, TAU); g.fill(); g.fillStyle = 'rgba(240,232,215,0.95)'; g.beginPath(); g.ellipse(4, 3, 7, 3.2, -0.6, 0, TAU); g.fill();
    g.fillStyle = INK; g.beginPath(); g.moveTo(16, -12); g.lineTo(21, -10); g.lineTo(16, -9); g.fill();
    g.restore();
  };
  // 雷乃发声: Song-style outlined cloud (勾云): grey ink lobes, each with a fine contour and a curl
  const LOBES = [[-170, 34, 60], [-92, -6, 78], [8, -28, 92], [112, 0, 80], [190, 36, 56], [40, 52, 72], [-62, 54, 64]];
  const cloud = (g, cx, cy, sc, dark, lit) => {
    g.save(); g.translate(cx, cy); g.scale(sc, sc);
    const body = new Path2D(); LOBES.forEach(([x, y, r]) => { body.moveTo(x + r, y); body.arc(x, y, r, 0, TAU); });
    g.save(); g.beginPath(); g.rect(-300, -160, 600, 252); g.clip();
    g.fillStyle = `rgba(${Math.round(118 - dark * 40 + lit * 110)},${Math.round(116 - dark * 40 + lit * 104)},${Math.round(104 - dark * 36 + lit * 80)},0.93)`; g.fill(body);
    LOBES.forEach(([x, y, r], i) => {
      brush(g, Array.from({ length: 22 }, (_, k) => { const a = Math.PI * (1.02 + k / 21 * 0.96); return [x + Math.cos(a) * r, y + Math.sin(a) * r]; }), 2.6, 500 + i, 'rgba(42,36,29,0.85)', true);
      brush(g, Array.from({ length: 26 }, (_, k) => { const a = Math.PI * 0.2 + k / 25 * Math.PI * 1.7, rr = r * (0.62 - k / 25 * 0.42); return [x + Math.cos(a) * rr, y - r * 0.1 + Math.sin(a) * rr]; }), 1.8, 520 + i, 'rgba(42,36,29,0.6)', true);
    });
    g.restore();
    brush(g, [[-232, 90], [-60, 94], [120, 90], [248, 86]], 2.2, 540, 'rgba(42,36,29,0.55)');
    g.restore();
  };
  const houText = (g, t) => {
    const h = Math.min(2, Math.floor(t / BAR)), b0 = h * BAR;
    g.fillStyle = INK; g.textAlign = 'center'; g.textBaseline = 'top'; g.font = '54px "Kaiti SC", "STKaiti", serif';
    [...HOU[h]].forEach((ch, i) => { const a = h ? JQ.smooth(b0 + i * 0.12, b0 + i * 0.12 + 0.14, t) : 1; if (a <= 0) return; g.globalAlpha = a; g.fillText(ch, 96, 652 + i * 58); });
    g.globalAlpha = 1;
  };
  JQ.ART[4] = { key: IMP, keyHou: JQ.TERMS[3].keyHou, focus: [[760, 580], [1290, 160], [1500, 520]], frame: true, draw(g, t, Sx) {
    t = JQ.clamp(t, 0, 9); const h = Math.min(2, Math.floor(t / BAR));
    const pulse = Math.exp(-Math.pow((t - RUM) / 0.12, 2)), sh = Math.abs(t - RUM) < 0.4 ? Math.sin(t * 95) * 3 * (1 - Math.abs(t - RUM) / 0.4) : 0;
    g.save(); g.translate(sh, sh * 0.4);
    JQ.blit(g, JQ.cached('s04-base-v6', Sx, base));
    houText(g, t);
    const grow = JQ.clamp((t - (IMP - 0.09)) / 0.09), flash = JQ.smooth(IMP - 0.03, IMP + 0.01, t) * (1 - JQ.smooth(IMP + 0.08, IMP + 0.75, t));
    g.save(); g.globalAlpha = 1 - flash * 0.85; JQ.blit(g, JQ.cached('s04-night', Sx, night)); g.restore();
    JQ.blit(g, JQ.cached('s04-arch', Sx, a => { K.bridge(a); K.house(a); }));
    const la = 0.5 * (1 - flash) * (1 - 0.7 * pulse) * (t > RUM && t < RUM + 0.6 ? 0.75 + 0.25 * Math.sin(t * 40) : 1);
    const lamp = g.createRadialGradient(1760, 575, 0, 1760, 575, 80); lamp.addColorStop(0, `rgba(245,195,100,${la})`); lamp.addColorStop(1, 'rgba(245,195,100,0)'); g.fillStyle = lamp; g.fillRect(1680, 495, 160, 160);
    // 雷: rings run across the pond at the clap
    if (t > RUM) { g.save(); g.clip(S.pond.path); for (let k = 0; k < 3; k++) { const u = (t - RUM - k * 0.16) / 1.4; if (u <= 0 || u >= 1) continue; g.strokeStyle = `rgba(42,60,60,${0.6 * (1 - u)})`; g.lineWidth = 1.6; g.beginPath(); g.ellipse(L.pond.cx, L.pond.cy, 30 + u * 320, (30 + u * 320) * 0.32, 0, 0, TAU); g.stroke(); } g.restore(); }
    for (let i = 0; i < 2; i++) { const u = JQ.clamp((t - 0.1 - i * 0.15) / 2.2), px = 1540 + i * 56, py = 562;
      if (u < 1) swallow(g, JQ.lerp(-60, px, u), JQ.lerp(560 - i * 30, py, u) - Math.sin(u * Math.PI) * 80 + Math.sin(t * 2.4 + i * 2) * 10 * (1 - u), JQ.lerp(1.25, 0.8, u) - i * 0.1, (Math.sin(t * 13 + i * 1.7) + 1) / 2, JQ.smooth(0, 0.12, u));
      else perched(g, px, py - 12, 1.25); }
    if (grow > 0) bolt(g, grow, flash, 1);
    const ck = JQ.ease(JQ.clamp((t - BAR) / 0.9));
    if (ck > 0) { g.save(); g.globalAlpha = ck; cloud(g, JQ.lerp(1560, 1290, ck), 172, JQ.lerp(0.65, 0.9, ck) * (1 + 0.05 * pulse), JQ.clamp(pulse + (t > RUM ? 0.35 : 0)), flash); g.restore(); }
    const CA = JQ.castFor(Sx, t); K.trail(g, CA);
    // the trunk is drawn at its own depth (its foot is at y 830): the ploughing team passes behind it, the family resting under it is in front
    const trunk = () => JQ.blit(g, JQ.cached('s04-trunk', Sx, a => { a.translate(470, 830); a.scale(0.93, 0.93); a.translate(-470, -830); K.tree(a, Sx, 'trunk'); }));
    let tr = false; for (const it of CA.items) { if (!tr && it.y >= 830) { trunk(); tr = true; } g.save(); if (it.alpha != null && it.alpha < 1) g.globalAlpha = it.alpha; gongbi(g, it.parts, it.who); g.restore(); }
    if (!tr) trunk();
    g.restore();
    JQ.blit(g, JQ.cached('s04-mount', Sx, mount));
  } };
})();
