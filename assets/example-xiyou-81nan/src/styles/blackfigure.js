// 07 希腊黑绘陶 · 双叉岭上 — the frieze of an Attic black-figure amphora. On the forked ridge (双叉岭) a tiger crouches,
// snakes slide over the rock, a second tiger peers from behind it. 刘伯钦 the hunter runs in with his 钢叉 like Herakles
// at a lion; on beat 3 the leaping tiger is caught on the trident above Tang Seng's horse and the scene locks into a
// textbook vase composition while the meander keeps turning; then he shoulders the tiger and leads the monk home.
// Black glaze silhouettes, incised clay lines, added purple-red and white. The pot comes out of its firing as we arrive:
// all black from the reduction, then the clay re-oxidises back to orange from the foot up.
(() => {
  'use strict';
  const XY = window.XY, K = XY.KIT_A, TAU = XY.TAU;
  const BLK = '#1B120D', CLAY = '#D86A30', INC = '#EE9A58', PUR = '#7E2632', WHT = '#F2E4CC';
  const rev = (u, a, d) => XY.clamp((u - a) / d);
  const fillP = (g, pts, c = BLK) => { XY.path(g, pts, true); g.fillStyle = c; g.fill(); };
  const inc = (g, pts, w = 1.6) => K.stroke(g, pts, INC, w);
  const dots = (g, pts, r = 2.2) => { g.fillStyle = WHT; for (let k = 0; k < pts.length; k += 2) { g.beginPath(); g.arc(pts[k], pts[k + 1], r, 0, TAU); g.fill(); } };
  const loc = (x, y, a, s, P) => { const c = Math.cos(a), sn = Math.sin(a), o = []; for (let k = 0; k < P.length; k += 2) o.push(x + (P[k] * c - P[k + 1] * sn) * s, y + (P[k] * sn + P[k + 1] * c) * s); return o; };

  // ------------------------------------------------------------ the bands
  const MEANDER = [4, 30, 4, 2, 52, 2, 52, 24, 20, 24, 20, 12, 38, 12, 38, 16];   // one key unit, period 60
  const meander = (g, y0, off) => { K.stroke(g, [0, y0, 1180, y0], BLK, 3.5); K.stroke(g, [0, y0 + 36, 1180, y0 + 36], BLK, 3.5);
    const o = ((off % 60) + 60) % 60; for (let x = -60 - o; x < 1240; x += 60) { const P = []; for (let k = 0; k < MEANDER.length; k += 2) P.push(x + MEANDER[k], y0 + 2 + MEANDER[k + 1]); K.stroke(g, P, BLK, 5); } };
  const rays = (g, y0, off) => { const o = ((off % 76) + 76) % 76;
    for (let x = -76 + o; x < 1260; x += 38) { const k = Math.round((x - o) / 38); fillP(g, [x - 13, 780, x, y0 + 26, x + 13, 780]);
      fillP(g, [x + 19 - 6, y0 + 22, x + 19, y0 + 4, x + 19 + 6, y0 + 22], (k % 2) ? PUR : BLK); g.fillStyle = BLK; g.beginPath(); g.arc(x + 19, y0 + 24, 3, 0, TAU); g.fill(); }
    K.stroke(g, [0, y0, 1180, y0], BLK, 3); };

  // ------------------------------------------------------------ the tiger (facing left); p = 0 crouched … 1 leaping; jaw open 0..1
  const tiger = (g, x, y, a, s, p, jaw, t, eyeOpen = 1) => { g.save(); g.translate(x, y); g.rotate(a); g.scale(s, s); g.lineCap = g.lineJoin = 'round';
    const L = (k0, k1) => XY.RIG.mix(k0, k1, p), sw = Math.sin(t * 7) * 0.25;
    const legs = [[[-44, 10], L([-58, 40], [-118, 6])], [[-30, 12], L([-40, 42], [-104, 22])], [[44, 10], L([34, 42], [116, 30])], [[56, 6], L([54, 40], [128, 12])]];
    legs.forEach(([h, f], i) => { const kn = [(h[0] + f[0]) / 2 + (i < 2 ? 6 : -6), (h[1] + f[1]) / 2 + 6]; K.stroke(g, [h[0], h[1], kn[0], kn[1], f[0], f[1]], BLK, i % 2 ? 11 : 13); for (let c = -1; c <= 1; c++) inc(g, [f[0] - 4, f[1] + c * 3, f[0] - 10, f[1] + c * 4], 1.2); });
    { const T0 = [], n = 10; for (let k = 0; k <= n; k++) { const q = k / n; T0.push(66 + q * 70, -4 - 46 * Math.sin(q * 2.4 + sw) * q); } K.stroke(g, T0, BLK, 7); }
    fillP(g, [-56, -6, -40, -28, 0, -32, 44, -28, 70, -12, 70, 14, 40, 22, 0, 22, -40, 22, -58, 12]);
    fillP(g, [-56, 10, -30, 20, 20, 21, 46, 16, 20, 12, -30, 12], PUR);
    for (let k = 0; k < 7; k++) { const sx = -30 + k * 13; inc(g, [sx, -28, sx - 4, -14, sx + 2, 2], 1.6); }
    // head with the ruff, jaws, ears
    g.save(); g.translate(-72, -12);
    fillP(g, XY.ellipse(10, 4, 24, 26, 18), PUR); fillP(g, XY.ellipse(0, 0, 21, 19, 18));
    fillP(g, [-4, -16, 6, -30, 12, -14]); fillP(g, [8, -16, 20, -28, 22, -12]);
    g.save(); g.rotate(-0.12 * jaw); fillP(g, [-14, -6, -42, -4, -40, 6, -12, 6]); g.restore(); g.save(); g.rotate(0.35 * jaw); fillP(g, [-14, 4, -38, 8, -36, 14, -12, 12]); g.fillStyle = WHT; [-34, -26, -18].forEach(tx => { g.beginPath(); g.moveTo(tx, 8); g.lineTo(tx + 3, 4); g.lineTo(tx + 6, 8); g.fill(); }); g.restore();
    g.fillStyle = WHT; [-36, -28, -20].forEach(tx => { g.beginPath(); g.moveTo(tx, 6); g.lineTo(tx + 3, 10); g.lineTo(tx + 6, 6); g.fill(); });
    if (eyeOpen) { g.fillStyle = WHT; g.beginPath(); g.arc(-6, -6, 4.2, 0, TAU); g.fill(); g.fillStyle = BLK; g.beginPath(); g.arc(-7, -6, 2, 0, TAU); g.fill(); } else inc(g, [-10, -6, -2, -6], 1.6);
    inc(g, [-14, 2, -18, 14], 1.2); inc(g, [6, -10, 14, 8], 1.2); g.restore();
    g.restore(); };

  // ------------------------------------------------------------ 刘伯钦 (facing left): leopard-skin cap, short chiton with a purple dotted hem, quiver; holds the 钢叉
  // pose: run 0..1 (stride swing), the fork's head H and butt B in panel coords; carry: the tiger across his shoulders
  const hunter = (g, x, y, run, H, B, t) => { g.save(); g.lineCap = g.lineJoin = 'round';
    const st = Math.sin(run * TAU), hip = [x, y - 100], sh = [x - 4, y - 166], hd = [x - 12, y - 190];
    // legs in deer-hide boots (麂皮靴): calves and boot tops incised, lunging stride
    [[-1, -26 - 22 * st, -44 - 12 * st], [1, 22 + 16 * st, 34 + 20 * st]].forEach(([sd, kx, fx]) => { const kn = [x + kx, y - 52], ft = [x + fx, y - 4];
      fillP(g, XY.RIG.capsule([hip[0] + sd * 6, hip[1]], kn, 14, 9, 6)); fillP(g, XY.RIG.capsule(kn, ft, 10, 8, 6)); fillP(g, [ft[0] - 18, y + 1, ft[0] + 6, y + 1, ft[0] + 4, y - 11, ft[0] - 8, y - 11]);
      inc(g, [(kn[0] + ft[0]) / 2 - 9, (kn[1] + ft[1]) / 2 - 4, (kn[0] + ft[0]) / 2 + 9, (kn[1] + ft[1]) / 2 - 2], 1.4); inc(g, [kn[0] - 6, kn[1] - 4, kn[0] + 2, kn[1] + 6], 1.2); });
    fillP(g, [x + 24, y - 176, x + 42, y - 174, x + 40, y - 116, x + 24, y - 118]); inc(g, [x + 30, y - 166, x + 36, y - 124], 1.2); K.stroke(g, [x + 30, y - 178, x + 26, y - 192], BLK, 3);   // quiver, arrows
    // a knee-length wool brocade coat (叵罗衣) with wide sleeves; a lion-buckled belt (狮蛮带) in purple with white studs
    fillP(g, [sh[0] - 28, sh[1] - 2, sh[0] + 26, sh[1], sh[0] + 26, sh[1] + 30, x + 16, y - 122, x - 16, y - 122, sh[0] - 24, sh[1] + 30]);
    fillP(g, [x - 18, y - 124, x + 18, y - 124, x + 38, y - 58, x - 40, y - 58]); fillP(g, [x - 40, y - 64, x + 38, y - 64, x + 39, y - 56, x - 41, y - 56], PUR);
    for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) { const cx = x - 22 + c * 15 + (r % 2) * 7, cy = y - 110 + r * 16; inc(g, [cx - 4, cy, cx, cy - 4, cx + 4, cy, cx, cy + 4, cx - 4, cy], 1.1); }   // brocade lozenges
    fillP(g, [x - 22, y - 128, x + 22, y - 128, x + 22, y - 118, x - 22, y - 118], PUR); dots(g, [x - 16, y - 123, x - 8, y - 123, x + 8, y - 123, x + 16, y - 123], 1.8);
    g.fillStyle = WHT; g.beginPath(); g.arc(x, y - 123, 6, 0, TAU); g.fill(); g.fillStyle = BLK; g.beginPath(); g.arc(x - 2, y - 124, 1.4, 0, TAU); g.arc(x + 2, y - 124, 1.4, 0, TAU); g.fill();
    inc(g, [sh[0] - 14, sh[1] + 14, sh[0] - 2, sh[1] + 20, sh[0] + 10, sh[1] + 14], 1.3); for (let k = 0; k < 3; k++) inc(g, [x - 30 + k * 26, y - 100, x - 34 + k * 30, y - 66], 1.1);
    // head: leopard-skin cap (purple, white spots), pointed beard, incised eye and ear
    fillP(g, XY.ellipse(hd[0], hd[1], 14, 15, 16)); fillP(g, [hd[0] - 18, hd[1] + 2, hd[0] - 10, hd[1] + 24, hd[0] + 2, hd[1] + 12]); fillP(g, [hd[0] - 16, hd[1] + 2, hd[0] - 22, hd[1] - 2, hd[0] - 14, hd[1] - 6]);
    fillP(g, [hd[0] - 16, hd[1] - 6, hd[0] - 6, hd[1] - 26, hd[0] + 12, hd[1] - 24, hd[0] + 16, hd[1] - 6], PUR); dots(g, [hd[0] - 8, hd[1] - 14, hd[0] + 2, hd[1] - 19, hd[0] + 10, hd[1] - 12], 2);
    g.strokeStyle = INC; g.lineWidth = 1.4; g.beginPath(); g.ellipse(hd[0] - 6, hd[1] - 1, 3.4, 2.2, 0, 0, TAU); g.stroke(); inc(g, [hd[0] + 4, hd[1] - 2, hd[0] + 7, hd[1] + 4, hd[0] + 3, hd[1] + 6], 1.2); inc(g, [hd[0] - 12, hd[1] + 8, hd[0] - 6, hd[1] + 18], 1.1);
    // the fork: shaft, three prongs; both hands on the shaft
    const d = [H[0] - B[0], H[1] - B[1]], l = Math.hypot(d[0], d[1]), n = [d[0] / l, d[1] / l], pp = [-n[1], n[0]];
    K.stroke(g, [B[0], B[1], H[0], H[1]], BLK, 5); K.stroke(g, [H[0] - pp[0] * 16, H[1] - pp[1] * 16, H[0] + pp[0] * 16, H[1] + pp[1] * 16], BLK, 5);
    [-16, 0, 16].forEach(o => K.stroke(g, [H[0] + pp[0] * o, H[1] + pp[1] * o, H[0] + pp[0] * o + n[0] * 30, H[1] + pp[1] * o + n[1] * 30], BLK, 4));
    const h1 = [B[0] + d[0] * 0.55, B[1] + d[1] * 0.55], h2 = [B[0] + d[0] * 0.3, B[1] + d[1] * 0.3];
    K.stroke(g, [sh[0] - 12, sh[1] + 4, (sh[0] + h1[0]) / 2 - 6, (sh[1] + h1[1]) / 2 + 10, h1[0], h1[1]], BLK, 10); K.stroke(g, [sh[0] + 10, sh[1] + 6, (sh[0] + h2[0]) / 2 + 8, (sh[1] + h2[1]) / 2 + 12, h2[0], h2[1]], BLK, 10);
    inc(g, [sh[0] - 12, sh[1] + 8, (sh[0] + h1[0]) / 2 - 6, (sh[1] + h1[1]) / 2 + 10], 1.2);
    void t; g.restore(); };

  // ------------------------------------------------------------ the ridge, snakes, pine, filler rosettes, a bird
  const ROCK = [840, 702, 878, 560, 918, 420, 950, 300, 986, 332, 1010, 420, 1040, 330, 1090, 250, 1130, 330, 1180, 450, 1180, 702];
  const rock = g => { fillP(g, ROCK, '#E07A40'); K.stroke(g, ROCK.slice(0, 20), BLK, 4);
    [[880, 600, 1170, 560], [900, 520, 1010, 470], [1030, 480, 1170, 500], [930, 400, 980, 380], [1060, 380, 1120, 360], [870, 660, 1176, 640]].forEach(([x0, y0, x1, y1], k) => {
      const P = []; for (let q = 0; q <= 12; q++) { const x = XY.lerp(x0, x1, q / 12); P.push(x, XY.lerp(y0, y1, q / 12) + 6 * Math.sin(q * 1.3 + k)); } K.stroke(g, P, BLK, 2.4); });
    [[960, 600, 30], [1100, 600, 26], [1010, 520, 18]].forEach(([x, y, r]) => fillP(g, XY.ellipse(x, y, r, r * 0.55, 14), PUR));
    for (let k = 0; k < 40; k++) { g.fillStyle = BLK; g.beginPath(); g.arc(880 + XY.hash(k, 1) * 290, 380 + XY.hash(k, 2) * 310, 1.6, 0, TAU); g.fill(); } };
  const snake = (g, x0, y0, x1, y1, ph, flick, seed) => { const P = []; for (let k = 0; k <= 26; k++) { const q = k / 26, nx = -(y1 - y0), ny = x1 - x0, l = Math.hypot(nx, ny);
      const w = 14 * Math.sin(q * TAU * 1.5 - ph); P.push(XY.lerp(x0, x1, q) + nx / l * w, XY.lerp(y0, y1, q) + ny / l * w); }
    K.stroke(g, P, INC, 13); for (let k = 0; k < P.length - 2; k += 2) K.stroke(g, [P[k], P[k + 1], P[k + 2], P[k + 3]], BLK, 10 - 7 * k / P.length);
    dots(g, P.filter((v, i) => i % 6 < 2 && i < P.length - 6), 1.8);
    const hx = P[P.length - 2], hy = P[P.length - 1], a = Math.atan2(hy - P[P.length - 3], hx - P[P.length - 4]);
    fillP(g, loc(hx, hy, a, 1, [-6, -7, 12, -2, 12, 3, -6, 7])); if (flick) K.stroke(g, loc(hx, hy, a, 1, [12, 0, 24, 0, 28, -4, 24, 0, 28, 4]), PUR, 1.8); void seed; };
  const pine = (g, x, sway) => { K.stroke(g, [x, 702, x + 6, 600, x - 4, 480, x + 4, 360], BLK, 12);
    [[360, 70], [420, 92], [490, 110], [560, 86]].forEach(([y, w], k) => { g.save(); g.translate(x + 4, y); g.rotate(sway * (1 + k * 0.3)); fillP(g, [-w, 14, -w * 0.5, -10, 0, -18, w * 0.5, -10, w, 14, 0, 6]);
      for (let j = -3; j <= 3; j++) inc(g, [j * w / 4, 8, j * w / 3.2, -6], 1.1); g.restore(); }); };
  const rosette = (g, x, y, r) => { fillP(g, XY.ellipse(x, y, r, r, 16)); for (let k = 0; k < 6; k++) { const a = k / 6 * TAU; inc(g, [x, y, x + Math.cos(a) * r * 0.9, y + Math.sin(a) * r * 0.9], 1.2); } g.fillStyle = PUR; g.beginPath(); g.arc(x, y, r * 0.3, 0, TAU); g.fill(); };
  const bird = (g, x, y, flap) => { const w = 0.3 + 0.7 * flap;   // a long-necked water bird, wings beating
    fillP(g, [x - 26, y + 2, x - 6, y - 6, x + 22, y - 6, x + 30, y - 2, x + 22, y + 6, x - 4, y + 8]); fillP(g, [x - 30, y - 2, x - 44, y - 8, x - 40, y + 4]);
    K.stroke(g, [x + 22, y - 4, x + 36, y - 10, x + 46, y - 8], BLK, 4); fillP(g, [x + 44, y - 12, x + 60, y - 8, x + 44, y - 4]);
    [-1, 1].forEach(s => { fillP(g, [x - 8, y - 4, x + 14, y - 4, x + 6 - 10 * s * w, y - 4 - 44 * w * (s > 0 ? 1 : 0.7), x - 22, y - 4 - 30 * w * (s > 0 ? 1 : 0.7)], s > 0 ? BLK : PUR); });
    for (let k = 0; k < 3; k++) inc(g, [x - 4 + k * 6, y - 6, x - 10 + k * 5, y - 6 - 26 * w], 1.1);
    g.fillStyle = WHT; g.beginPath(); g.arc(x + 46, y - 9, 1.6, 0, TAU); g.fill(); };
  const PEN = { outline: INC, ow: 1.3, color: r => ({ kasaya: PUR, red: PUR, saddle: PUR, gold: WHT, metal: WHT, skull: WHT, ink: INC })[r] || BLK };
  const actsAt = u => ({ monk: { palm: K.win(u, 0.42, 0.9, 0.05) } });
  const C = [800, 470];
  // choreography: the hunter's x, run phase, the fork's head/butt; the tiger's centre, angle, scale, pose, jaw
  const plan = (e, u, t) => { const y = 702, c = e.cell, pAt = uu => XY.procWorldX(c.t0 + uu * c.dur) - c.x;
    let x = 905, run = 0, H, B; if (u < 0.55) { x = XY.lerp(1260, 905, XY.easeOut(rev(u, 0.3, 0.25))); run = t * 2.2; }
    else if (u > 0.66) { x = 905 + 360 * XY.smooth(rev(u, 0.66, 0.24)) + Math.max(0, pAt(u) - pAt(0.84)); run = t * 1.6; }
    const ready = [[x - 70, y - 262], [x + 34, y - 92]], aim = [C, [x + 36, y - 112]], carry = [[x - 16, y - 268], [x + 18, y - 12]];
    const q1 = XY.easeIn(rev(u, 0.55, 0.05)), q2 = XY.smooth(rev(u, 0.68, 0.12));
    H = XY.RIG.mix(XY.RIG.mix(ready[0], aim[0], q1), carry[0], q2); B = XY.RIG.mix(XY.RIG.mix(ready[1], aim[1], q1), carry[1], q2);
    let T; const sh = [x - 6, y - 210];
    if (u < 0.4) T = { p: [962, 268], a: 0, s: 0.9, pose: 0.1 * K.win(u, 0.3, 0.4, 0.03), jaw: K.win(u, 0.28, 0.42, 0.03) * (0.6 + 0.4 * Math.sin(t * 20)) };
    else if (u < 0.6) { const q = XY.easeIO(rev(u, 0.4, 0.2)), a = (1 - q) * (1 - q), b = 2 * (1 - q) * q, d = q * q; T = { p: [a * 962 + b * 880 + d * (C[0] + 14), a * 268 + b * 170 + d * (C[1] - 22)], a: -0.45 * q, s: 0.9, pose: Math.min(1, q * 1.6), jaw: 1 }; }
    else if (u < 0.68) { const w = Math.sin(t * 30) * 0.15; T = { p: [C[0] + 14, C[1] - 22], a: -0.5 + w * 0.3, s: 0.9, pose: 0.7 + w, jaw: 1 }; }
    else { const q = q2; T = { p: XY.RIG.mix([C[0] + 14, C[1] - 22], [sh[0] + 6, sh[1]], q), a: XY.lerp(-0.5, Math.PI + 0.06, q), s: XY.lerp(0.9, 0.82, q), pose: XY.lerp(0.7, 0.35, q), jaw: XY.lerp(1, 0.3, q), dead: q > 0.6 }; }
    return { x, y, run, H, B, T }; };
  const vtext = (g, str, x, y, px) => { g.font = XY.font(px, '"PingFang SC", "Heiti SC", sans-serif', '300'); g.fillStyle = BLK; g.textAlign = 'center'; g.textBaseline = 'top'; K.vtext(g, str, x, y, px, 1.04); g.textAlign = 'left'; };

  XY.STYLES.blackfigure = {
    bg(g, W, H) {
      g.fillStyle = CLAY; g.fillRect(0, 0, W, H);
      for (let k = 0; k < 900; k++) { const x = XY.hash(k, 1) * W, y = XY.hash(k, 2) * H, v = XY.fbm(x / 200, y / 200, 5, 3); g.fillStyle = v > 0 ? `rgba(150,60,20,${0.05 + 0.08 * v})` : `rgba(255,200,150,${0.07 * -v})`; g.beginPath(); g.arc(x, y, 8 + 26 * XY.hash(k, 3), 0, TAU); g.fill(); }
      for (let k = 0; k < 260; k++) { const y = XY.hash(k, 7) * H, x = XY.hash(k, 8) * W; g.strokeStyle = k % 3 ? 'rgba(120,48,16,0.07)' : 'rgba(255,214,170,0.09)'; g.lineWidth = 1; g.beginPath(); g.moveTo(x, y); g.lineTo(x + 120 + 500 * XY.hash(k, 9), y + 2); g.stroke(); }
      K.specks(g, 3, 1400, 0, 0, W, H, '#7A2C10', 0.3, 1.3, 0.1, 0.35);
      // the neck: black glaze with a palmette–lotus chain; the shoulder's tongues
      g.fillStyle = BLK; g.fillRect(0, 0, W, 46);
      for (let x = 0; x < W + 80; x += 80) { g.save(); g.translate(x, 40); for (let k = -3; k <= 3; k++) { g.save(); g.rotate(k * 0.32); fillP(g, [-3, 0, 0, -30 + Math.abs(k) * 3, 3, 0], k % 2 ? PUR : CLAY); g.restore(); }
        fillP(g, [34, 0, 40, -24, 46, 0], PUR); K.stroke(g, [6, -2, 22, 4, 34, -2], CLAY, 2); K.stroke(g, [46, -2, 60, 4, 74, -2], CLAY, 2); g.restore(); }
      for (let x = 0; x < W; x += 22) { XY.path(g, [x + 2, 48, x + 20, 48, x + 20, 58, x + 11, 64, x + 2, 58], true); g.fillStyle = (x / 22) % 2 ? PUR : BLK; g.fill(); }
      K.stroke(g, [0, 64, W, 64], BLK, 2);
    },
    draw(g, e) {
      const { W, H, u, t } = e, acts = actsAt(u), tf = u > 0.6 && u < 0.66 ? e.cell.t0 + 0.6 * e.cell.dur : t;
      // the bands roll on even while the scene holds still; at the start they spin down like the wheel
      meander(g, 66, 34 * t + 340 * XY.easeOut(rev(u, -0.45, 0.6)));
      rays(g, 712, -26 * t - 300 * XY.easeOut(rev(u, -0.45, 0.6)));
      [[262, 168, 10], [520, 138, 8], [640, 232, 9], [350, 262, 7], [770, 140, 7]].forEach(([x, y, r]) => rosette(g, x, y, r));
      bird(g, 120 + ((tf * 70) % 820), 196 + 18 * Math.sin(tf * 1.4), Math.abs(Math.sin(tf * 6)));
      pine(g, 150, 0.04 * Math.sin(tf * 1.7));
      tiger(g, 1046, 356, -0.1, 0.6, 0, 0.3 * (K.step(tf, 3) % 2), tf, (tf * 0.4) % 1 < 0.94);
      rock(g);
      { const rt = XY.smooth(rev(u, 0.5, 0.2)); snake(g, XY.lerp(872, 940, rt), XY.lerp(650, 430, rt), XY.lerp(938, 990, rt), XY.lerp(474, 300, rt), tf * (5 + 6 * rt), K.step(tf, 6) % 3 === 0, 1);
        snake(g, XY.lerp(1060, 1120, rt), XY.lerp(664, 470, rt), XY.lerp(1172, 1190, rt), XY.lerp(596, 380, rt), tf * (5 + 6 * rt) + 2, K.step(tf + 0.2, 6) % 3 === 0, 2); }
      vtext(g, '双叉岭', 1012, 136, 50);
      g.font = XY.font(34, '"Gill Sans", "Optima", sans-serif', '300'); g.fillStyle = BLK; g.textBaseline = 'top'; g.fillText('ΠΙΙ', 30, 116);
      // Tang Seng in black glaze, incised, purple kasaya; then the hunter and the tiger in front
      XY.drawProcession(g, e.phase, e.procX, e.groundY, PEN, acts);
      const P = plan(e, u, t);
      if (P.x < 1250) { hunter(g, P.x, P.y, P.run, P.H, P.B, t); vtext(g, '刘伯钦', P.x + 66, P.y - 250, 26); }
      tiger(g, P.T.p[0], P.T.p[1], P.T.a, P.T.s, P.T.pose, P.T.jaw, tf, !P.T.dead);
      if (u > 0.6 && u < 0.66) { const k = rev(u, 0.6, 0.06); g.strokeStyle = `rgba(242,228,204,${0.8 * (1 - k)})`; g.lineWidth = 3; for (let j = 0; j < 8; j++) { const a = j / 8 * TAU, r0 = 30 + 40 * k; g.beginPath(); g.moveTo(C[0] + Math.cos(a) * r0, C[1] + Math.sin(a) * r0); g.lineTo(C[0] + Math.cos(a) * (r0 + 24), C[1] + Math.sin(a) * (r0 + 24)); g.stroke(); } }
      // the glaze: a vertical sheen, the pot's curve darkening the edges
      g.save(); g.globalCompositeOperation = 'multiply'; let lg = g.createLinearGradient(0, 0, W, 0); lg.addColorStop(0, 'rgb(150,112,96)'); lg.addColorStop(0.22, '#fff'); lg.addColorStop(0.7, '#fff'); lg.addColorStop(1, 'rgb(140,104,88)'); g.fillStyle = lg; g.fillRect(0, 0, W, H);
      g.globalCompositeOperation = 'screen'; lg = g.createLinearGradient(300, 0, 440, 0); lg.addColorStop(0, 'rgba(255,240,220,0)'); lg.addColorStop(0.5, 'rgba(255,240,220,0.16)'); lg.addColorStop(1, 'rgba(255,240,220,0)'); g.fillStyle = lg; g.fillRect(300, 0, 140, H); g.restore();
      // the firing: black all over from the reduction, re-oxidising back to clay from the foot up as the cell arrives
      const fr = rev(u, -0.34, 0.42); if (fr < 1) { const fy = XY.lerp(820, -60, XY.easeIO(fr)), bg = g.createLinearGradient(0, fy - 50, 0, fy + 50);
        bg.addColorStop(0, 'rgba(20,12,8,0.96)'); bg.addColorStop(1, 'rgba(20,12,8,0)'); g.fillStyle = bg; g.fillRect(0, 0, W, Math.max(0, fy + 50));
        g.save(); g.globalCompositeOperation = 'lighter'; const hg = g.createLinearGradient(0, fy - 30, 0, fy + 30); hg.addColorStop(0, 'rgba(255,110,30,0)'); hg.addColorStop(0.5, 'rgba(255,120,40,0.5)'); hg.addColorStop(1, 'rgba(255,110,30,0)'); g.fillStyle = hg; g.fillRect(0, fy - 30, W, 60); g.restore(); }
    },
    hits: [3.2, 4.8],
    post(canvas, g, e) { K.zoom(canvas, g, e, K.push(e.beat, 4.3, 4.8, 6.2, 0.16), C[0], C[1] + 40); },
  };
})();
