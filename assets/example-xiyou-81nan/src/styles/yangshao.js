// 02 仰韶彩陶纹 · 出胎几杀 — the belly of a 马家窑 painted jar. In the right-hand whirl-circle lies the newborn 江流儿
// as a 半坡 人面鱼纹 face; 刘洪, a black-slip shadow, rises with a half-moon stone knife. 南极星君's white star flares and
// on beat 3 the two fish circling the baby bite the falling blade; a whirl opens under 刘洪 and spins him into pattern.
// Everything is slip on burnished clay: one paint layer, chipped, then shaded by the jar's curve and its polish sheen.
(() => {
  'use strict';
  const XY = window.XY, K = XY.KIT_A, TAU = XY.TAU;
  const BLK = '#1F1712', RED = '#8C2D1C', WHT = '#EDE1C6', CLAY = '#C6743C', CLAYL = '#D88E55';
  const T = 3;
  const rimY = x => 40 + 0.00024 * (x - 590) * (x - 590);
  const CIRC = [[245, 352, 100, 0.55], [600, 318, 116, -0.4], [944, 312, 122, 0]], BABY = [944, 312], WHIRL = [1090, 566], SHX = 1108;
  const rev = (u, a, d) => XY.clamp((u - a) / d);

  // ------------------------------------------------------------ static textures (once)
  let TEX = null;
  const tex = W => {
    if (TEX && TEX.W === W) return TEX;
    const H = 780, w = Math.ceil(W / T), h = Math.ceil(H / T), A = K.hex('#C97A42'), B = K.hex('#A65A2E'), Cl = K.hex('#5A3A26');
    const clay = K.pix(w, h, (i, j, o) => { const x = i * T, y = j * T;
      let c = K.mixc(B, A, XY.clamp(0.55 + 0.8 * XY.fbm(x * 0.004, y * 0.004, 51, 4)));
      c = K.mixc(c, Cl, 0.45 * XY.clamp((XY.fbm(x * 0.0025 + 3, y * 0.0025, 57, 3) - 0.18) * 2.2));     // fire clouds from an uneven firing
      const st = 0.04 * XY.noise2(x * 0.004, y * 0.25, 61); o[0] = c[0] * (1 + st); o[1] = c[1] * (1 + st); o[2] = c[2] * (1 + st); });   // burnish strokes run round the jar
    // jar shading (multiply) and polish sheen (screen); outside the jar both are neutral
    const shade = K.pix(Math.ceil(W / 6), Math.ceil(H / 6), (i, j, o) => { const x = i * 6, y = j * 6, d = y - rimY(x);
      let v = d < -4 ? 1 : (0.86 + 0.16 * Math.cos((x - 380) / 900 * Math.PI)) * (1 + 0.1 * Math.exp(-Math.max(0, d) / 80)) * (1 - 0.26 * Math.pow(x / W, 3)) * (y > 712 ? 0.82 - 0.0015 * (y - 712) : 1);
      v = Math.min(1, v) * 255; o[0] = v; o[1] = v * 0.98; o[2] = v * 0.95; });
    const sheen = K.pix(Math.ceil(W / 6), Math.ceil(H / 6), (i, j, o) => { const x = i * 6, y = j * 6, d = y - rimY(x);
      const a = d < 10 || y > 700 ? 0 : 0.2 * Math.exp(-Math.pow((x - 350) / 46, 2)) + 0.09 * Math.exp(-Math.pow((x - 430) / 18, 2)) + 0.05 * Math.exp(-Math.pow((y - rimY(x) - 40) / 24, 2));
      o[0] = 255; o[1] = 246; o[2] = 228; o[3] = a * 255 * XY.clamp(d / 40); });
    return (TEX = { W, w, h, clay, shade, sheen });
  };
  const chips = S => XY.keep(`ys-chips:${S.toFixed(4)}`, 256, 256, cv => { const g = cv.getContext('2d'), R = XY.rng(91);
    for (let i = 0; i < 260; i++) { g.fillStyle = `rgba(0,0,0,${0.35 + 0.6 * R()})`; g.beginPath(); g.ellipse(R() * 256, R() * 256, (0.6 + 2.2 * R() * R()) * S, (0.4 + 1.2 * R()) * S, R() * 3, 0, TAU); g.fill(); } });

  // ------------------------------------------------------------ motifs
  const fill = (g, pts, col) => { XY.path(g, pts, true); g.fillStyle = col; g.fill(); };
  const curve = (x0, x1, f, n = 60) => { const P = []; for (let k = 0; k <= n; k++) { const x = XY.lerp(x0, x1, k / n); P.push(x, f(x)); } return P; };
  // a 舞蹈纹 dancer: round head with a braid, triangle skirt with a tail, hands joined to the neighbours
  const dancer = (g, x, y, s, sway) => {
    g.save(); g.translate(x, y); g.rotate(sway); g.scale(s, s); g.lineCap = 'round';
    g.fillStyle = BLK; g.beginPath(); g.arc(0, -27, 4.6, 0, TAU); g.fill();
    K.stroke(g, [-2, -30, -8, -27 + 3 * sway * 10, -11, -22], BLK, 2);
    fill(g, [-3, -21, 3, -21, 6, -6, -6, -6], BLK); K.stroke(g, [-5, -7, -10, -3], BLK, 2.2);
    K.stroke(g, [-2, -6, -3, 0], BLK, 2.4); K.stroke(g, [2, -6, 3, 0], BLK, 2.4);
    K.stroke(g, [-12, -16, 0, -19, 12, -16], BLK, 2.4);
    g.restore();
  };
  const ring = (g, x, y, r, f) => { if (f <= 0 || r < 18) return; const a0 = -Math.PI * 0.6;
    g.lineCap = 'round'; g.strokeStyle = BLK; g.lineWidth = 19; g.beginPath(); g.arc(x, y, r, a0, a0 + TAU * f); g.stroke();
    g.strokeStyle = RED; g.lineWidth = 3.2; g.beginPath(); g.arc(x, y, r - 17, a0, a0 + TAU * f); g.stroke();
    if (f > 0.9) for (let k = 0; k < 12; k++) { const a = k / 12 * TAU; g.fillStyle = WHT; g.beginPath(); g.arc(x + Math.cos(a) * r, y + Math.sin(a) * r, 2.6, 0, TAU); g.fill(); } };
  const spiral = (g, x, y, r, ang, f, w = 9) => { if (r <= 2) return; const P = [];
    for (let k = 0; k <= 70; k++) { const q = k / 70, a = ang + q * TAU * 2.1, rr = r * (0.14 + 0.62 * q); P.push(x + Math.cos(a) * rr, y + Math.sin(a) * rr); }
    K.stroke(g, K.partial(P, f), BLK, w); if (f > 0.2) { g.fillStyle = BLK; g.beginPath(); g.arc(x, y, r * 0.12, 0, TAU); g.fill(); } };
  const bez = (p0, p1, p2, p3, n = 40) => { const P = []; for (let k = 0; k <= n; k++) { const t = k / n, a = (1 - t) ** 3, b = 3 * (1 - t) ** 2 * t, c = 3 * (1 - t) * t * t, d = t ** 3;
    P.push(a * p0[0] + b * p1[0] + c * p2[0] + d * p3[0], a * p0[1] + b * p1[1] + c * p2[1] + d * p3[1]); } return P; };
  const offset = (P, d) => { const o = []; for (let k = 0; k < P.length; k += 2) { const a = Math.max(0, k - 2), b = Math.min(P.length - 2, k + 2), dx = P[b] - P[a], dy = P[b + 1] - P[a + 1], l = Math.hypot(dx, dy) || 1; o.push(P[k] - dy / l * d, P[k + 1] + dx / l * d); } return o; };
  const FLOWS = [bez([307, 274], [380, 190], [450, 480], [528, 409]), bez([672, 227], [745, 150], [800, 480], [868, 407]), bez([1020, 217], [1070, 150], [1130, 260], [1190, 250]), bez([-10, 470], [60, 470], [120, 470], [183, 430])];
  const flow = (g, P, f) => { if (f <= 0) return; const Q = K.partial(P, f); K.stroke(g, Q, BLK, 22); K.stroke(g, offset(Q, 19), RED, 3); K.stroke(g, offset(Q, -19), RED, 3); };
  // 半坡 fish, facing +x: black triangle head with a reserved eye, net-hatched body, forked tail
  const fish = (g, x, y, a, s, open = 0, halo = false) => {
    g.save(); g.translate(x, y); g.rotate(a); g.scale(s, s); g.lineJoin = 'round';
    const body = [-30, 0, -14, -11, 6, -12, 14, -10, 14, 10, 6, 12, -14, 11];
    if (halo) { [[-30, 0, -48, -14, -42, 0, -48, 14], body, [12, -12, 36, -6, 36, 6, 12, 12], [-4, -11, 6, -21, 12, -11]].forEach(p => { XY.path(g, p, true); g.fillStyle = g.strokeStyle = CLAY; g.lineWidth = 10; g.fill(); g.stroke(); }); g.restore(); return; }
    fill(g, [-30, 0, -46, -12, -42, 0, -46, 12], BLK); fill(g, [-4, -11, 6, -20, 12, -11], BLK); fill(g, [-6, 11, 2, 18, 8, 11], BLK);
    fill(g, body, CLAYL); g.save(); XY.path(g, body, true); g.clip(); g.strokeStyle = BLK; g.lineWidth = 1.5;
    for (let k = -40; k < 30; k += 7) { g.beginPath(); g.moveTo(k, -14); g.lineTo(k + 16, 14); g.moveTo(k + 16, -14); g.lineTo(k, 14); g.stroke(); } g.restore();
    XY.path(g, body, true); g.strokeStyle = BLK; g.lineWidth = 2.6; g.stroke();
    fill(g, [12, -11, 34, -4 - 5 * open, 26, 0, 34, 4 + 5 * open, 12, 11], BLK);
    g.fillStyle = CLAYL; g.beginPath(); g.arc(20, -3, 3.4, 0, TAU); g.fill(); g.fillStyle = BLK; g.beginPath(); g.arc(21, -3, 1.6, 0, TAU); g.fill();
    g.restore();
  };
  // the newborn as a 人面鱼纹 face: pointed fish-bone headdress, black brow cap, closed eyes, fish at the mouth corners
  const baby = (g, x, y, smile) => {
    g.save(); g.translate(x, y); g.lineCap = 'round';
    fill(g, [-15, -40, 0, -82, 15, -40], BLK);
    for (let k = 0; k < 4; k++) { const q = (k + 1) / 5, yy = -40 - 42 * q, hw = 15 * (1 - q); K.stroke(g, [-hw, yy, -hw - 10, yy + 5], BLK, 2.4); K.stroke(g, [hw, yy, hw + 10, yy + 5], BLK, 2.4); }
    [-1, 1].forEach(d => { fish(g, d * 40, 38, d > 0 ? Math.PI + 0.45 : -0.45, 0.46); K.stroke(g, [d * 43, -8, d * 56, -16, d * 57, 2, d * 50, 6], BLK, 3.2); });
    g.beginPath(); g.arc(0, 0, 44, 0, TAU); g.fillStyle = CLAYL; g.fill(); g.lineWidth = 3.6; g.strokeStyle = BLK; g.stroke();
    g.save(); g.beginPath(); g.arc(0, 0, 44, 0, TAU); g.clip(); fill(g, [-50, -14, -50, -50, 50, -50, 50, -14, 9, -14, 0, -29, -9, -14], BLK); g.restore();
    [-1, 1].forEach(d => { g.beginPath(); g.moveTo(d * 7, -2); g.quadraticCurveTo(d * 16, -2 + 7 * smile, d * 25, -2 - 2 * smile); g.strokeStyle = BLK; g.lineWidth = 3.4; g.stroke(); });
    K.stroke(g, [0, -9, 0, 8], BLK, 3); K.stroke(g, [-5, 8, 5, 8], BLK, 3);
    fill(g, [-15, 20, 0, 15 + 3 * smile, 15, 20, 0, 27 + 3 * smile], BLK);
    g.restore();
  };
  // 刘洪 as a towering black-slip figure, feet at (x, 702); c crouch, ra knife raised, st strike; halo = the reserved clay border
  const shadowPose = (c, ra, st) => { const H = 470 * (1 - 0.45 * c), S = [SHX - 14 - 30 * c - 8 * st, 702 - 0.8 * H];
    const hand = XY.RIG.mix(XY.RIG.mix([S[0] - 26, S[1] + 92], [S[0] + 24, S[1] - 122], ra), [S[0] - 80, S[1] - 70], st);
    return { H, S, hand, ang: XY.lerp(XY.lerp(Math.PI / 2, -Math.PI / 2, ra), -Math.PI * 1.22, st) }; };
  const shadowMan = (g, P, c, halo) => {
    const col = halo ? CLAY : BLK, a = halo ? 9 : 0, { H, S, hand } = P, hip = [SHX + 10 * c, 702 - 0.45 * H], hd = [S[0] - 10 - 10 * c, S[1] - 40];
    const el = [(S[0] + hand[0]) / 2 + 22, (S[1] + hand[1]) / 2 + 16];
    g.save(); g.lineCap = g.lineJoin = 'round';
    K.stroke(g, [hip[0] - 10, hip[1], SHX - 30 - 16 * c, 700], col, 14 + a); K.stroke(g, [hip[0] + 10, hip[1], SHX + 32, 700], col, 14 + a);
    XY.path(g, [S[0] - 24, S[1] + 2, S[0] + 24, S[1] + 2, hip[0] + 58, 702 - 0.1 * H, hip[0] - 60, 702 - 0.1 * H], true); g.fillStyle = col; g.fill(); if (halo) { g.lineWidth = 2 * a; g.strokeStyle = col; g.stroke(); }
    K.stroke(g, [hip[0] + 48, 702 - 0.14 * H, hip[0] + 72, 702 - 0.06 * H], col, 6 + a);
    K.stroke(g, [S[0] + 16, S[1] + 8, S[0] + 34, S[1] + 80, S[0] + 22, S[1] + 126], col, 12 + a);
    g.fillStyle = col; g.beginPath(); g.arc(hd[0], hd[1], 26 + a * 0.6, 0, TAU); g.fill(); g.beginPath(); g.arc(hd[0] + 12, hd[1] - 27, 11 + a * 0.6, 0, TAU); g.fill();
    K.stroke(g, [S[0], S[1] + 4, el[0], el[1], hand[0], hand[1]], col, 13 + a);
    if (!halo) { g.fillStyle = WHT; g.beginPath(); g.ellipse(hd[0] - 11, hd[1] - 4, 6, 3.6, -0.2, 0, TAU); g.fill(); g.fillStyle = BLK; g.beginPath(); g.arc(hd[0] - 13, hd[1] - 4, 2, 0, TAU); g.fill(); }
    g.restore();
  };
  // 半月形双孔石刀: half-moon stone knife, held by its straight back; a = the way the cutting edge faces
  const knife = (g, x, y, a, halo, s = 1.4) => {
    g.save(); g.translate(x, y); g.rotate(a); g.scale(s, s); g.beginPath(); g.moveTo(0, -31); g.arc(0, 0, 31, -Math.PI / 2, Math.PI / 2); g.closePath();
    if (halo) { g.lineWidth = 16; g.strokeStyle = CLAY; g.stroke(); } else { g.fillStyle = '#D9CDB4'; g.fill(); g.lineWidth = 3; g.strokeStyle = BLK; g.stroke();
      g.fillStyle = BLK; g.beginPath(); g.arc(8, -9, 3.2, 0, TAU); g.arc(8, 9, 3.2, 0, TAU); g.fill(); K.stroke(g, [24, -18, 29, -6], 'rgba(255,255,255,0.7)', 2); }
    g.restore();
  };
  const star = (g, x, y, fl) => { for (let k = 0; k < 8; k++) { const a = k / 8 * TAU; for (let j = 1; j <= 3; j++) { const r = j * (7 + 5 * fl); g.fillStyle = WHT; g.beginPath(); g.arc(x + Math.cos(a) * r, y + Math.sin(a) * r, 3.4 - 0.5 * j + 1.4 * fl, 0, TAU); g.fill(); } }
    g.beginPath(); g.arc(x, y, 5 + 3 * fl, 0, TAU); g.fill(); };
  const COL = { horse: RED, horse2: '#6A2214', mane: BLK, hoof: BLK, saddle: BLK, red: BLK, robe: WHT, kasaya: RED, skin: CLAYL, skin2: CLAYL, face: CLAYL, gold: WHT, metal: WHT, ink: BLK };
  const PEN = { outline: BLK, ow: 1.7, wob: 0.6, seed: 7, color: r => COL[r] || BLK };
  const HALO = { outline: CLAY, ow: 6, fine: false, shade: false, color: () => CLAY };
  const actsAt = u => ({ monk: { palm: K.win(u, 0.42, 0.86, 0.06) } });
  const STRIKE = shadowPose(0, 1, 1), BC = [STRIKE.hand[0] + 22 * Math.cos(STRIKE.ang), STRIKE.hand[1] + 22 * Math.sin(STRIKE.ang)], PHI0 = Math.atan2(BC[1] - BABY[1], BC[0] - BABY[0]);
  const STAR = [806, 176];

  XY.STYLES.yangshao = {
    bg(g, W, H) {
      const X = tex(W); g.imageSmoothingQuality = 'high'; g.drawImage(X.clay, 0, 0, X.w * T, X.h * T);
      K.specks(g, 3, 2600, 0, 0, W, H, '#5A2E16', 0.4, 1.6, 0.08, 0.3); K.specks(g, 4, 1200, 0, 0, W, H, '#F4C090', 0.4, 1.4, 0.06, 0.25);
      // a crack from the rim, mended in antiquity: drilled hole pairs tied with cord
      const Rn = XY.rng(29); let x = 760, y = rimY(760); const P = [x, y]; for (let s = 0; s < 17; s++) { x += (Rn() - 0.5) * 9; y += 11; P.push(x, y); }
      K.cut(g, P, 2, 'rgba(50,24,10,0.75)', 'rgba(255,214,170,0.45)', 1.4);
      [3, 8, 13].forEach(k => { const xx = P[2 * k], yy = P[2 * k + 1]; K.stroke(g, [xx - 13, yy, xx + 13, yy], 'rgba(96,64,34,0.75)', 2.2);
        [-13, 13].forEach(d => { g.fillStyle = 'rgba(255,214,170,0.5)'; g.beginPath(); g.arc(xx + d + 1, yy + 1, 4.6, 0, TAU); g.fill(); g.fillStyle = '#3A1E10'; g.beginPath(); g.arc(xx + d, yy, 4, 0, TAU); g.fill(); }); });
      // beyond the jar's shoulder: the rammed-earth wall of a pit house, sheaves of millet hung to dry
      g.save(); XY.path(g, [0, -2].concat(curve(0, W, x => rimY(x) - 3), [W, -2]), true); g.clip();
      g.fillStyle = '#2C2018'; g.fillRect(0, 0, W, 140); K.specks(g, 8, 700, 0, 0, W, 140, '#6E5238', 0.5, 1.6, 0.3, 0.7);
      const R2 = XY.rng(8); for (let i = 0; i < 160; i++) { const sx = R2() * W, sy = R2() * 130, a = R2() * 3; K.stroke(g, [sx, sy, sx + Math.cos(a) * 9, sy + Math.sin(a) * 9], 'rgba(150,118,70,0.35)', 1.2); }
      [[58, 1], [1122, -1]].forEach(([mx, d]) => { for (let k = 0; k < 9; k++) { const a = (k - 4) * 0.1 * d, ex = mx + Math.sin(a) * 90, ey = 6 + Math.cos(a) * 82;
        K.stroke(g, [mx, -4, (mx + ex) / 2, 40, ex, ey], '#7A6036', 1.6); for (let j = 0; j < 6; j++) { g.fillStyle = j % 2 ? '#C8A050' : '#B08840'; g.beginPath(); g.ellipse(ex - d * j * 2, ey - j * 5, 3.4, 4.6, 0.4 * d, 0, TAU); g.fill(); } }
        K.stroke(g, [mx - 12, 8, mx + 12, 10], '#3A2A18', 4); });
      g.restore();
      K.stroke(g, curve(0, W, x => rimY(x) - 1.5), 'rgba(255,226,186,0.55)', 2.5);
    },
    draw(g, e) {
      const { W, u, t, S } = e, X = tex(W), acts = actsAt(u);
      const [pc, pg] = K.layer('ys-paint', e); pg.lineCap = pg.lineJoin = 'round';
      // rim band with a frieze of joined-hands dancers, neck sawtooth with white dots
      fill(pg, curve(0, W, rimY).concat(curve(W, 0, x => rimY(x) + 9)), BLK);
      fill(pg, curve(0, W, x => rimY(x) + 40).concat(curve(W, 0, x => rimY(x) + 47)), BLK);
      [190, 590, 990].forEach((cx, gi) => { for (let k = -2; k <= 2; k++) { const x = cx + k * 24; dancer(pg, x, rimY(x) + 39, 1, (K.step(t, 4) + k + gi) % 2 ? 0.08 : -0.08); } });
      for (let x = -13; x < W + 26; x += 26) { const y0 = rimY(x) + 46; fill(pg, [x, y0, x + 26, rimY(x + 26) + 46, x + 13, y0 + 32], BLK); pg.fillStyle = WHT; pg.beginPath(); pg.arc(x + 26, y0 + 20, 3, 0, TAU); pg.fill(); }
      // lower belly: a band of 半坡 fish swimming round the jar; the waist band is the ground; hanging arcs under it
      K.stroke(pg, [0, 470, W, 470], BLK, 5); K.stroke(pg, [0, 552, W, 552], BLK, 5);
      for (let k = 0; k < 5; k++) { const x = ((k * 280 + t * 46) % (W + 220)) - 110; fish(pg, x, 511 + 4 * Math.sin(t * 3 + k), 0.04 * Math.sin(t * 4 + k), 1.05, 0.5 + 0.5 * Math.sin(t * 6 + k)); }
      fill(pg, [0, 694, W, 694, W, 711, 0, 711], BLK); K.stroke(pg, [0, 718, W, 718], RED, 4);
      for (let x = 0; x < W; x += 62) { pg.beginPath(); pg.arc(x + 31, 722, 27, 0, Math.PI); pg.strokeStyle = BLK; pg.lineWidth = 5; pg.stroke(); pg.fillStyle = BLK; pg.beginPath(); pg.arc(x + 31, 734, 4, 0, TAU); pg.fill(); }
      // the whirls, brushed on as the procession comes in; the baby's circle is there all along
      CIRC.forEach(([x, y, r, sp], k) => { ring(pg, x, y, r, k === 2 ? 1 : rev(u, -0.04 + 0.08 * k, 0.14)); if (k === 0) spiral(pg, x, y, r - 22, t * sp + k, rev(u, 0.02, 0.12)); });
      // 殷温娇 in the middle whirl, reaching toward her child; she flinches when the knife goes up
      { const f = rev(u, 0.08, 0.14), fear = K.win(u, 0.3, 0.62, 0.04), [mx, my] = [CIRC[1][0] - 8, CIRC[1][1] + 70]; if (f > 0) { pg.save(); pg.globalAlpha = Math.min(1, f * 1.5); pg.translate(mx, my); pg.lineCap = 'round';
        fill(pg, [-30, 0, 0, -96, 30, 0], BLK); K.stroke(pg, [-26, -6, 26, -6], RED, 3); fill(pg, XY.ellipse(2, -112, 15, 16, 16), BLK); fill(pg, XY.ellipse(-8, -132, 10, 9, 12), BLK);
        K.stroke(pg, [0, -84, 34 + 10 * fear, -100 - 22 * fear, 60 + 6 * fear, -118 - 30 * fear], BLK, 7); K.stroke(pg, [0, -80, 30, -70 - 10 * fear, 56, -84 - 18 * fear], BLK, 7);
        pg.fillStyle = WHT; pg.beginPath(); pg.ellipse(8, -114, 4.5, 2.6, 0, 0, TAU); pg.fill(); for (let k = 0; k < 4; k++) { pg.beginPath(); pg.arc(-20 + k * 13, -30, 2.4, 0, TAU); pg.fill(); }
        if (fear > 0.3) for (let k = 0; k < 2; k++) { const q = (t * 1.2 + k * 0.5) % 1; pg.fillStyle = WHT; pg.beginPath(); pg.arc(14, -110 + 30 * q, 2.4, 0, TAU); pg.fill(); } pg.restore(); } }
      FLOWS.slice(0, 3).forEach((P, k) => flow(pg, P, rev(u, 0.0 + 0.07 * k, 0.12)));
      // the title, brushed downward in black slip
      pg.save(); pg.beginPath(); pg.rect(0, 205, 140, 196 * rev(u, 0.04, 0.18)); pg.clip(); pg.fillStyle = BLK; pg.font = XY.font(84, XY.cnFont.wei); pg.textBaseline = 'top'; K.vtext(pg, '出胎', 22, 214, 84, 1.06); pg.restore();
      // 南极星君's star flares; dotted lines run from it to the fish
      const fl = K.win(u, 0.47, 0.64, 0.03); star(pg, STAR[0], STAR[1], fl);
      // the fish round the baby: circling → dart to the blade → carry the knife round the ring
      const baseA = k => t * 1.7 + k * Math.PI, orbit = (a, r = 88) => [BABY[0] + r * Math.cos(a), BABY[1] + r * 0.95 * Math.sin(a)];
      const dart = XY.smooth(rev(u, 0.53, 0.07)), yank = XY.smooth(rev(u, 0.6, 0.07)), phiK = PHI0 + 1.25 * Math.max(0, u - 0.6) * e.cell.dur;
      const kc = u < 0.6 ? null : XY.RIG.mix(BC, orbit(phiK, 74), yank), ka = u < 0.6 ? 0 : XY.lerp(STRIKE.ang, phiK, yank);
      const fishAt = k => { const sd = k ? -1 : 1;
        if (u < 0.6) { const a = baseA(k), o = orbit(a), n = [-Math.sin(STRIKE.ang) * sd, Math.cos(STRIKE.ang) * sd], tg = [BC[0] + n[0] * 40, BC[1] + n[1] * 40];
          return [XY.lerp(o[0], tg[0], dart), XY.lerp(o[1], tg[1], dart), XY.lerp(a + Math.PI / 2, Math.atan2(-n[1], -n[0]), dart), 0.5 + 0.5 * dart]; }
        const n = [-Math.sin(ka) * sd, Math.cos(ka) * sd]; return [kc[0] + n[0] * 38, kc[1] + n[1] * 38, Math.atan2(-n[1], -n[0]), 0]; };
      if (fl > 0) { pg.setLineDash([2, 9]); [0, 1].forEach(k => { const f = fishAt(k); K.stroke(pg, [STAR[0], STAR[1], f[0], f[1]], `rgba(237,225,198,${fl})`, 3.4); }); pg.setLineDash([]); }
      baby(pg, BABY[0], BABY[1], XY.smooth(rev(u, 0.7, 0.1)));
      if (kc) { knife(pg, kc[0], kc[1], ka, true); [0, 1].forEach(k => { const f = fishAt(k); fish(pg, f[0], f[1], f[2], 1.05, 0, true); }); knife(pg, kc[0], kc[1], ka, false); }
      [0, 1].forEach(k => { const f = fishAt(k); fish(pg, f[0], f[1], f[2], 1.05, f[3]); });
      const bf = rev(u, 0.6, 0.08); if (bf > 0 && bf < 1) for (let j = 0; j < 14; j++) { const a = j / 14 * TAU, r = 26 + 62 * XY.easeOut(bf); pg.fillStyle = WHT; pg.beginPath(); pg.arc(BC[0] + Math.cos(a) * r, BC[1] + Math.sin(a) * r, 4.6 * (1 - bf) + 0.8, 0, TAU); pg.fill(); }
      // 刘洪: crouched in wait → rises → knife up on beat 2 → strike on beat 3 → recoils, a whirl opens and spins him into pattern
      const c = 1 - XY.smooth(rev(u, 0.12, 0.24)), ra = XY.smooth(rev(u, 0.28, 0.12)), st = XY.easeIn(rev(u, 0.54, 0.06)), P = shadowPose(c, ra, st);
      const wr = 80 * XY.easeOut(rev(u, 0.6, 0.06)) * (1 - XY.smooth(rev(u, 0.8, 0.1))), spin = XY.clamp((u - 0.63) / 0.12);
      if (wr > 14) { ring(pg, WHIRL[0], WHIRL[1] + 80 * XY.smooth(rev(u, 0.8, 0.1)), wr, 1); spiral(pg, WHIRL[0], WHIRL[1] + 80 * XY.smooth(rev(u, 0.8, 0.1)), wr - 10, -t * (2 + 9 * (1 - XY.clamp((u - 0.75) / 0.4))), 1, 8); }
      if (spin > 0 && spin < 1) for (let j = 0; j < 3; j++) { const P2 = []; for (let k = 0; k <= 24; k++) { const q = k / 24, a = -t * 9 + j * TAU / 3 + q * 2.4, r = 150 - 60 * q; P2.push(WHIRL[0] + Math.cos(a) * r, WHIRL[1] + Math.sin(a) * r * 0.9); } K.stroke(pg, P2, BLK, 7 * (1 - spin) + 2); }
      if (spin < 1) { pg.save();
        if (spin > 0) { const sc = Math.pow(1 - spin, 1.3); pg.translate(WHIRL[0], WHIRL[1]); pg.rotate(-XY.easeIn(spin) * TAU * 2.2); pg.scale(sc, sc); pg.translate(-WHIRL[0], -WHIRL[1]); }
        if (u > 0.6) { const rc = 0.2 * XY.smooth(rev(u, 0.6, 0.03)); pg.translate(SHX, 702); pg.rotate(rc); pg.translate(-SHX, -702); }
        shadowMan(pg, P, c, true); if (u < 0.6) knife(pg, P.hand[0], P.hand[1], P.ang, true);
        shadowMan(pg, P, c, false); if (u < 0.6) knife(pg, P.hand[0], P.hand[1], P.ang, false);
        pg.restore(); }
      // the procession, painted in reserve (a clay border keeps it off the pattern)
      XY.drawProcession(pg, e.phase, e.procX, e.groundY, HALO, acts); XY.drawProcession(pg, e.phase, e.procX, e.groundY, PEN, acts);
      // 第二难: two potter's marks scratched into the clay of the rim frieze
      [1088, 1104].forEach(x => K.cut(pg, [x, rimY(x) + 13, x - 2, rimY(x) + 38], 4.5, 'rgba(66,32,14,0.85)', 'rgba(255,220,180,0.6)', 1.5));
      // chips in the slip, then the jar's curve and polish over everything
      pg.save(); pg.setTransform(1, 0, 0, 1, 0, 0); pg.globalCompositeOperation = 'destination-out'; pg.fillStyle = pg.createPattern(chips(S), 'repeat'); pg.fillRect(0, 0, pc.width, pc.height); pg.restore();
      K.blit(g, pc);
      g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.imageSmoothingQuality = 'high'; g.globalCompositeOperation = 'multiply'; g.drawImage(X.shade, 0, 0, X.shade.width * 6 * S, X.shade.height * 6 * S);
      g.globalCompositeOperation = 'screen'; g.globalAlpha = 0.85 + 0.15 * XY.noise1(t * 2, 5); g.drawImage(X.sheen, 0, 0, X.sheen.width * 6 * S, X.sheen.height * 6 * S); g.restore();
      // the strike flash: the jar's slip lights up white around the bitten blade
      const sf = K.hit(e.beat, 4.8, 0.5); if (sf > 0) { g.save(); g.globalCompositeOperation = 'lighter'; const rg = g.createRadialGradient(BC[0], BC[1], 4, BC[0], BC[1], 200); rg.addColorStop(0, `rgba(255,236,200,${0.75 * sf})`); rg.addColorStop(1, 'rgba(255,200,150,0)'); g.fillStyle = rg; g.fillRect(BC[0] - 200, BC[1] - 200, 400, 400); g.restore(); }
    },
    hits: [4.8, 5.8],
    post(canvas, g, e) { K.zoom(canvas, g, e, K.push(e.beat, 4.2, 4.8, 6.4, 0.16), 1000, 340); },
  };
})();
