// 03 楔形泥板 · 满月抛江 (v10) — the story pressed into a clay tablet. A cylinder seal rolls the top frieze in (mother, plank on
// water, willow, full moon); below the text rows a river is incised, and the baby 江流 drifts on his plank with a blood-stained
// letter toward 金山寺 on its island, where 法明 waits. On beat 3.2 the red line of the blood letter lifts off as a flock of
// wedge-birds; on beat 4.8 they stab back into the clay as the wedge-written title 「抛江」. Everything is pressed or incised.
(() => {
  'use strict';
  const XY = window.XY, K = XY.KIT_A, TAU = XY.TAU;
  const CLAY = '#C9A57A', CLAYL = '#DCBE92', CUT = '#5E4128', LIP = 'rgba(255,244,222,0.72)', MAT = '#3A2A1A';
  const TB = { x0: 26, y0: 16, x1: 1154, y1: 764, r: 54 }, BAND = [36, 124], P = 236, T = 3;
  const RIVER = [416, 556], PLANK_Y = 474;
  const rev = (u, a, d) => XY.clamp((u - a) / d);
  const rr = (g, x0, y0, x1, y1, r) => { g.beginPath(); g.moveTo(x0 + r, y0); g.arcTo(x1, y0, x1, y1, r); g.arcTo(x1, y1, x0, y1, r); g.arcTo(x0, y1, x0, y0, r); g.arcTo(x0, y0, x1, y0, r); g.closePath(); };
  const sdBox = (x, y) => { const cx = (TB.x0 + TB.x1) / 2, cy = (TB.y0 + TB.y1) / 2, hx = (TB.x1 - TB.x0) / 2 - TB.r, hy = (TB.y1 - TB.y0) / 2 - TB.r;
    const qx = Math.abs(x - cx) - hx, qy = Math.abs(y - cy) - hy; return Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0) - TB.r; };

  // ------------------------------------------------------------ textures: clay (with fingerprints), pillow relief map (soft-light), reed mat
  let TEX = null;
  const tex = W => {
    if (TEX && TEX.W === W) return TEX;
    const H = 780, w = Math.ceil(W / T), h = Math.ceil(H / T), A = K.hex('#CDA97E'), B = K.hex('#B08A5E');
    const clay = K.pix(w, h, (i, j, o) => { const x = i * T, y = j * T; let c = K.mixc(B, A, XY.clamp(0.6 + 0.7 * XY.fbm(x * 0.005, y * 0.005, 71, 4)));
      const fp = Math.sin(Math.hypot(x - 90, y - 700) * 0.9) * Math.exp(-Math.hypot(x - 90, y - 700) / 40) + Math.sin(Math.hypot(x - 1090, y - 80) * 0.9) * Math.exp(-Math.hypot(x - 1090, y - 80) / 36);
      const m = 1 + 0.035 * fp + 0.03 * XY.noise2(x * 0.08, y * 0.08, 73); o[0] = c[0] * m; o[1] = c[1] * m; o[2] = c[2] * m; });
    const pil = K.pix(Math.ceil(W / 4), Math.ceil(H / 4), (i, j, o) => { const x = i * 4, y = j * 4, d = sdBox(x, y);
      let v; if (d > 0) v = 0.5 - 0.3 * Math.exp(-d / 14) * XY.clamp(0.5 + 0.5 * ((x - 590) / 600 + (y - 390) / 400));
      else { const e = 2, gx = sdBox(x + e, y) - sdBox(x - e, y), gy = sdBox(x, y + e) - sdBox(x, y - e), gl = Math.hypot(gx, gy) || 1, sl = Math.exp(d / 30);
        v = 0.5 + 0.34 * sl * (gx / gl * -0.6 + gy / gl * -0.8) + 0.05 * (1 - Math.min(1, -d / 300)) - 0.04 * ((x - 590) / 600 + (y - 390) / 400); }
      v = XY.clamp(v) * 255; o[0] = o[1] = o[2] = v; });
    return (TEX = { W, w, h, clay, pil });
  };

  // ------------------------------------------------------------ impressions
  const L = [-0.6, -0.8], PAL = { dk: '#6A4A2E', lt: '#E4C89E' }, BLOOD = { dk: '#6E2618', lt: '#B85A3C' };
  // a stylus wedge: triangular head at (x, y), tail running toward angle a; the pit wall on the light side is shadowed
  const wedge = (g, x, y, a, s, pal = PAL) => {
    const ca = Math.cos(a), sa = Math.sin(a), p = (lx, ly) => [x + (lx * ca - ly * sa) * s, y + (lx * sa + ly * ca) * s];
    const b0 = p(0, -4.2), b1 = p(0, 4.2), ap = p(7.5, 0), c = p(2.2, 0), tl = p(17, 0), upLight = sa * L[0] - ca * L[1] > 0;
    g.fillStyle = upLight ? pal.dk : pal.lt; g.beginPath(); g.moveTo(b0[0], b0[1]); g.lineTo(ap[0], ap[1]); g.lineTo(c[0], c[1]); g.fill();
    g.fillStyle = upLight ? pal.lt : pal.dk; g.beginPath(); g.moveTo(b1[0], b1[1]); g.lineTo(ap[0], ap[1]); g.lineTo(c[0], c[1]); g.fill();
    g.fillStyle = pal.dk; g.beginPath(); g.moveTo(b0[0], b0[1]); g.lineTo(c[0], c[1]); g.lineTo(b1[0], b1[1]); g.lineTo(p(-0.8, 0)[0], p(-0.8, 0)[1]); g.fill();
    g.lineCap = 'round'; g.strokeStyle = LIP; g.lineWidth = 1.2 * s; g.beginPath(); g.moveTo(ap[0] + 0.9, ap[1] + 0.9); g.lineTo(tl[0] + 0.9, tl[1] + 0.9); g.stroke();
    g.strokeStyle = pal.dk; g.lineWidth = 1.3 * s; g.beginPath(); g.moveTo(ap[0], ap[1]); g.lineTo(tl[0], tl[1]); g.stroke();
  };
  // a row of signs (clusters of 2–5 wedges: horizontals, verticals, Winkelhaken)
  const signs = (seed, x0, x1, y) => { const R = XY.rng(seed), out = []; let x = x0;
    while (x < x1) { const m = 2 + Math.floor(R() * 4);
      for (let k = 0; k < m; k++) { const q = R(), a = q < 0.48 ? 0 : q < 0.82 ? Math.PI / 2 : Math.PI / 4;
        out.push([x + k * (a === 0 ? 8 : 6.5) + R() * 3, y + (a === 0 ? (R() - 0.5) * 18 : -9 + (R() - 0.5) * 5), a, 0.95 + 0.3 * R()]); }
      x += 16 + m * 7 + R() * 12; }
    return out; };
  const ROWS = [signs(5, 64, 1030, 150), signs(9, 64, 980, 192), signs(13, 64, 1120, 234)];
  const ROWB = signs(29, 70, 1100, 740);
  // incised line: dark cut with a light lower lip
  const inc = (g, pts, w = 2.2) => K.cut(g, pts, w, CUT, LIP, 1.3);
  // raised relief from a fill path builder (cylinder-seal impressions are positive)
  const relief = (g, build, fill = CLAYL) => { g.save(); g.translate(1.8, 1.8); build(g); g.fillStyle = 'rgba(70,46,26,0.5)'; g.fill(); g.restore();
    g.save(); g.translate(-1.2, -1.2); build(g); g.fillStyle = 'rgba(255,246,226,0.75)'; g.fill(); g.restore(); build(g); g.fillStyle = fill; g.fill(); };
  const poly = pts => g => XY.path(g, pts, true);
  // one period of the seal's frieze (0..P × 0..88): the mother kneels with the child, a plank on waves, a date palm, the full moon over a crescent
  const sealScene = g => {
    relief(g, poly([18, 80, 20, 52, 28, 38, 36, 32, 44, 36, 46, 52, 52, 66, 58, 80]));            // the mother's flounced skirt and body
    relief(g, g2 => { g2.beginPath(); g2.arc(38, 24, 8, 0, TAU); });
    relief(g, poly([46, 40, 64, 30, 72, 34, 56, 46]));                                            // arms holding the child
    relief(g, g2 => { g2.beginPath(); g2.ellipse(70, 30, 9, 5, -0.3, 0, TAU); });
    for (let k = 0; k < 3; k++) relief(g, poly([90 + k * 16, 72, 98 + k * 16, 64, 106 + k * 16, 72, 98 + k * 16, 70]));   // waves
    relief(g, poly([88, 58, 140, 58, 140, 63, 88, 63])); relief(g, g2 => { g2.beginPath(); g2.ellipse(112, 53, 11, 5, 0, 0, TAU); });
    relief(g, poly([168, 82, 170, 36, 176, 36, 178, 82]));                                        // a willow: trunk, drooping strands
    [-22, -12, -2, 8, 18].forEach(dx => relief(g, poly([172 + dx * 0.3, 34, 172 + dx, 40, 172 + dx * 1.2, 74, 172 + dx * 1.2 + 4, 74, 172 + dx + 4, 40]), '#D8BC90', 1.4));
    relief(g, g2 => { g2.beginPath(); g2.arc(212, 26, 13, 0, TAU); });                            // 满月
    relief(g, g2 => { g2.beginPath(); g2.arc(212, 58, 12, 0.2, Math.PI - 0.2); g2.arc(212, 52, 10, Math.PI - 0.4, 0.4, true); g2.closePath(); });
  };
  const sealTile = S => XY.keep(`cu-seal:${S.toFixed(4)}`, P * S, 88 * S, cv => { const g = cv.getContext('2d'); g.scale(S, S); sealScene(g); });

  // ------------------------------------------------------------ incised scene
  // 金山寺 on its island in the river: a hall with sweeping eaves and a seven-storey pagoda, in raised relief
  const jinshan = g => { relief(g, poly([890, 410, 920, 384, 990, 370, 1080, 372, 1130, 390, 1150, 410]), '#D2B486');
    relief(g, poly([930, 384, 934, 340, 1010, 340, 1014, 384])); for (let x = 942; x < 1006; x += 14) inc(g, [x, 346, x, 382], 1.2); inc(g, [962, 384, 962, 360, 982, 360, 982, 384], 1.4);
    relief(g, poly([912, 344, 930, 326, 1014, 326, 1032, 344, 1020, 338, 924, 338])); inc(g, [906, 348, 914, 342], 2); inc(g, [1038, 348, 1030, 342], 2);
    for (let k = 0; k < 7; k++) { const w = 34 - k * 3.4, y = 384 - k * 20; relief(g, poly([1080 - w * 0.62, y, 1080 - w * 0.62, y - 13, 1080 + w * 0.62, y - 13, 1080 + w * 0.62, y]));
      relief(g, poly([1080 - w, y - 12, 1080 + w, y - 12, 1080 + w * 0.7, y - 20, 1080 - w * 0.7, y - 20]), '#D6B68A'); inc(g, [1080 - w - 4, y - 10, 1080 - w, y - 13], 1.4); inc(g, [1080 + w + 4, y - 10, 1080 + w, y - 13], 1.4); }
    inc(g, [1080, 244, 1080, 222], 2.4); g.fillStyle = CUT; g.beginPath(); g.arc(1080, 220, 3.4, 0, TAU); g.fill();
    for (let k = 0; k < 9; k++) { const x = 900 + k * 28; inc(g, [x, 412, x + 14, 408, x + 28, 412], 1.2); } };
  // a willow on the bank: trunk and hanging strands that sway
  const willow = (g, x, y, h, t, k) => { const top = [x + 6, y - h]; inc(g, [x, y, x + 3, y - h * 0.5, top[0], top[1]], 5); inc(g, [top[0], top[1] + 20, top[0] - 30, top[1] - 6], 3); inc(g, [top[0], top[1] + 30, top[0] + 34, top[1] + 4], 3);
    for (let j = 0; j < 13; j++) { const ax = top[0] - 52 + j * 9, ay = top[1] - 6 + Math.abs(j - 6) * 4, sw = 5 * Math.sin(t * 2.2 + j * 0.6 + k), L = 46 + 22 * XY.hash(j, k + 3), P2 = [];
      for (let q = 0; q <= 6; q++) { const s = q / 6; P2.push(ax + sw * s * s, ay + L * s); } inc(g, P2, 1.4); for (let q = 1; q < 6; q += 2) inc(g, [P2[2 * q], P2[2 * q + 1], P2[2 * q] + 3, P2[2 * q + 1] + 5], 1); } };
  // 殷温娇 kneeling on the bank in Tang dress: high chignon, long sleeves raised in farewell; facing right
  const mother = (g, x, y, t) => { const up = (K.step(t, 3) % 2) ? 4 : 0;
    g.save(); g.translate(x, y); g.fillStyle = 'rgba(120,86,54,0.18)'; XY.path(g, [-36, 0, -30, -40, -14, -62, 8, -62, 16, -40, 32, -16, 38, 0], true); g.fill();
    inc(g, [-36, 0, -30, -40, -14, -62, 8, -62, 16, -40, 32, -16, 38, 0, -36, 0], 2.4); for (let k = 0; k < 4; k++) inc(g, [-26 + k * 14, -2, -18 + k * 12, -48], 1.1); inc(g, [-30, -30, 20, -30], 1.6);
    g.beginPath(); g.arc(0, -76, 12, 0, TAU); g.strokeStyle = CUT; g.lineWidth = 2.4; g.stroke(); g.fillStyle = CUT; g.beginPath(); g.ellipse(5, -78, 3.4, 2.2, 0, 0, TAU); g.fill();
    inc(g, [-8, -84, -10, -104, 2, -112, 8, -98, 2, -86], 2.4); inc(g, [-14, -100, 14, -106], 1.6);
    inc(g, [6, -56, 22, -72 - up, 30, -92 - up, 42, -100 - up], 2.6); inc(g, [2, -54, 18, -66 - up, 26, -84 - up], 2.2); inc(g, [30, -92 - up, 26, -70 - up, 40, -64 - up], 1.4);
    g.restore(); };
  // a fishing boat on the far bank (the fisherman who later sold 陈光蕊 the golden carp)
  const boat = (g, x, y, t) => { const bob = 2 * Math.sin(t * 2.4); g.save(); g.translate(x, y + bob);
    inc(g, [-70, -14, -54, 0, 54, 0, 72, -16], 2.6); inc(g, [-60, -8, 60, -8], 1.2); inc(g, [-6, -10, -6, -60], 2); inc(g, [-6, -58, 30, -20, -6, -20], 1.6);
    g.beginPath(); g.arc(40, -28, 7, 0, TAU); g.strokeStyle = CUT; g.lineWidth = 2; g.stroke(); inc(g, [26, -30, 54, -38], 2.4); inc(g, [36, -20, 44, -10, 34, -2], 2); inc(g, [52, -36, 92, -52, 96, -10], 1.2); g.restore(); };
  // 法明长老 at the foot of the tower: bows, lifts the child
  const faming = (g, x, y, bow, hold) => { g.save(); g.translate(x, y); g.rotate(-0.35 * bow);
    inc(g, [-16, 0, -12, -52, 12, -52, 18, 0, -16, 0], 2.4); for (let k = 1; k < 4; k++) inc(g, [-14 + k, -k * 13, 16 - k, -k * 13], 1.1);
    g.beginPath(); g.arc(-2, -64, 11, 0, TAU); g.strokeStyle = CUT; g.lineWidth = 2.4; g.stroke(); g.fillStyle = CUT; g.beginPath(); g.arc(-7, -66, 2, 0, TAU); g.fill();
    inc(g, [-6, -46, -22, -38 + 10 * hold, -28, -50 + 6 * hold], 2.4);
    g.restore(); };
  const babyOnPlank = (g, x, y, a, onPlank, baby = true) => { g.save(); g.translate(x, y); g.rotate(a); g.scale(1.35, 1.35);
    if (onPlank) { g.fillStyle = 'rgba(110,76,44,0.22)'; g.fillRect(-48, 4, 96, 13); inc(g, [-48, 4, 48, 4, 48, 17, -48, 17, -48, 4], 2.2); for (let k = 0; k < 3; k++) inc(g, [-42, 8 + k * 3, 40, 8 + k * 3 + (k - 1)], 0.9);
      g.fillStyle = 'rgba(150,50,30,0.55)'; g.fillRect(28, -9, 16, 12); inc(g, [28, -9, 44, -9, 44, 3, 28, 3, 28, -9], 1.6); for (let k = 0; k < 3; k++) wedge(g, 31 + k * 4.5, -4, Math.PI / 2, 0.45, BLOOD); }
    if (!baby) { g.restore(); return; }
    g.fillStyle = 'rgba(244,228,196,0.5)'; g.beginPath(); g.ellipse(-4, -2, 26, 9, 0, 0, TAU); g.fill(); g.strokeStyle = CUT; g.lineWidth = 2.2; g.stroke();
    for (let k = -2; k <= 2; k++) inc(g, [-6 + k * 9, -10, 2 + k * 9, 6], 1.3);
    g.beginPath(); g.arc(-34, -4, 8.5, 0, TAU); g.fillStyle = 'rgba(244,228,196,0.6)'; g.fill(); g.stroke(); inc(g, [-37, -5, -33, -5], 1.2);
    g.restore(); };
  const fishI = (g, x, y, s) => { g.save(); g.translate(x, y); g.scale(s, s); inc(g, [-20, 0, -8, -7, 8, -6, 18, 0, 8, 6, -8, 7, -20, 0, -28, -7, -26, 0, -28, 7, -20, 0], 2); for (let k = -8; k < 8; k += 5) inc(g, [k, -4, k + 3, 4], 1); g.fillStyle = CUT; g.beginPath(); g.arc(11, -1, 1.6, 0, TAU); g.fill(); g.restore(); };
  // a wedge in flight: arrow-head body, two flapping tail-wings
  const bird = (g, x, y, a, s, flap) => { const ca = Math.cos(a), sa = Math.sin(a), p = (lx, ly) => [x + (lx * ca - ly * sa) * s, y + (lx * sa + ly * ca) * s];
    const w = 3 + 11 * flap; g.lineCap = 'round'; g.strokeStyle = BLOOD.dk; g.lineWidth = 1.8 * s;
    g.beginPath(); const a0 = p(-2, -3), a1 = p(-10, -w), b0 = p(-2, 3), b1 = p(-10, w); g.moveTo(a0[0], a0[1]); g.quadraticCurveTo(p(-4, -w)[0], p(-4, -w)[1], a1[0], a1[1]); g.moveTo(b0[0], b0[1]); g.quadraticCurveTo(p(-4, w)[0], p(-4, w)[1], b1[0], b1[1]); g.stroke();
    const h0 = p(8, 0), h1 = p(-2, -4.5), h2 = p(-2, 4.5); g.fillStyle = BLOOD.lt; g.beginPath(); g.moveTo(h0[0], h0[1]); g.lineTo(h1[0], h1[1]); g.lineTo(h2[0], h2[1]); g.fill();
    g.fillStyle = BLOOD.dk; g.beginPath(); g.moveTo(h0[0], h0[1]); g.lineTo(h1[0], h1[1]); g.lineTo(p(0, 0)[0], p(0, 0)[1]); g.fill(); };
  const COL = { horse: '#A47E56', horse2: '#94704C', mane: '#6E5034', hoof: CUT, saddle: '#8C5A3E', red: '#8C5A3E', robe: '#D8BC92', kasaya: '#A8664A', skin: '#CFAF85', skin2: '#CFAF85', face: '#CFAF85', gold: '#DEC69A', metal: '#D8C090', ink: CUT };
  const PEN = { outline: CUT, ow: 1.8, wob: 0.5, seed: 3, color: r => COL[r] || '#B89068' };
  const actsAt = u => ({ monk: { palm: K.win(u, 0.45, 0.86, 0.06) } });
  const plankX = u => Math.min(850, 330 + 980 * u);
  const grain = S => XY.keep(`cu-grain:${S.toFixed(4)}`, 256, 256, cv => { const g = cv.getContext('2d'), R = XY.rng(17);
    for (let i = 0; i < 700; i++) { g.fillStyle = R() < 0.5 ? `rgba(70,46,26,${0.15 + 0.25 * R()})` : `rgba(255,240,215,${0.15 + 0.25 * R()})`; g.beginPath(); g.arc(R() * 256, R() * 256, (0.5 + 1.2 * R()) * S, 0, TAU); g.fill(); } });
  const bz = (p0, p1, p2, p3, t) => { const a = (1 - t) ** 3, b = 3 * (1 - t) ** 2 * t, c = 3 * (1 - t) * t * t, d = t ** 3; return [a * p0[0] + b * p1[0] + c * p2[0] + d * p3[0], a * p0[1] + b * p1[1] + c * p2[1] + d * p3[1]]; };
  // the title's wedge positions (from the glyph shapes) and the blood-letter line with the same number of wedges
  let TG = null, BL = null;
  const title = () => { if (TG) return;
    const G = K.glyphPts('抛江', XY.cnFont.hei, 120, 8.2, false, '600'); TG = []; for (let k = 0; k < G.pts.length; k += 3) TG.push([322 + G.pts[k], 262 + G.pts[k + 1], G.pts[k + 2] ? 0 : Math.PI / 2]);
    TG.sort((a, b) => a[0] - b[0]); BL = signs(17, 64, 1110, 192); };
  // the cylinder seal: a lapis cylinder whose circumference is one frieze period; the carved scene turns on its face as it rolls
  const sealObj = (g, x, S) => {
    const y0 = BAND[0] - 12, y1 = BAND[1] + 12, R = P / TAU, rot = ((x / (TAU * R)) * P % P + P) % P;
    g.save(); g.fillStyle = 'rgba(24,14,6,0.35)'; rr(g, x - R + 12, y0 + 12, x + R + 18, y1 + 10, 12); g.fill();
    const gr = g.createLinearGradient(x - R, 0, x + R, 0); gr.addColorStop(0, '#141E44'); gr.addColorStop(0.3, '#3D60AE'); gr.addColorStop(0.42, '#7C9ADA'); gr.addColorStop(0.7, '#2A4590'); gr.addColorStop(1, '#0E162E');
    rr(g, x - R, y0, x + R, y1, 9); g.fillStyle = gr; g.fill();
    const tile = sealTile(S); g.save(); rr(g, x - R, y0, x + R, y1, 9); g.clip(); g.globalCompositeOperation = 'multiply';
    for (let k = 0; k < 18; k++) { const a0 = -Math.PI / 2 + k * Math.PI / 18, a1 = a0 + Math.PI / 18, X0 = x + R * Math.sin(a0), X1 = x + R * Math.sin(a1), sw = P / 36;
      const su = Math.min(P - sw, ((rot - (a0 + Math.PI / 2) / TAU * P) % P + P) % P); g.drawImage(tile, su * S, 0, sw * S, 88 * S, X0, BAND[0], Math.max(0.6, X1 - X0), 88); }
    g.restore();
    for (let k = 0; k < 14; k++) { const fx = x + R * Math.sin(-1.4 + 2.8 * XY.hash(k, 1)), fy = y0 + 6 + (y1 - y0 - 12) * XY.hash(k, 2); g.fillStyle = 'rgba(240,200,90,0.9)'; g.beginPath(); g.arc(fx, fy, 1.2 + 1.2 * XY.hash(k, 3), 0, TAU); g.fill(); }
    g.fillStyle = '#0A0E1C'; g.beginPath(); g.ellipse(x, y0 + 3, 6, 2.6, 0, 0, TAU); g.fill();
    K.stroke(g, [x, y0 + 2, x - 12, y0 - 18, x - 40, -14], '#8A6A3A', 2.6);
    g.restore();
  };

  XY.STYLES.cuneiform = {
    bg(g, W, H) {
      const X = tex(W);
      g.fillStyle = MAT; g.fillRect(0, 0, W, H);
      for (let k = -40; k < 70; k++) { g.strokeStyle = k % 2 ? 'rgba(130,98,56,0.32)' : 'rgba(14,8,4,0.35)'; g.lineWidth = 10; g.beginPath(); g.moveTo(k * 24, 0); g.lineTo(k * 24 + H, H); g.stroke(); }
      g.setLineDash([24, 24]); for (let k = -40; k < 80; k++) { g.strokeStyle = 'rgba(150,112,64,0.3)'; g.lineWidth = 10; g.beginPath(); g.moveTo(k * 24, 0); g.lineTo(k * 24 - H, H); g.stroke(); } g.setLineDash([]);
      g.save(); rr(g, TB.x0, TB.y0, TB.x1, TB.y1, TB.r); g.clip(); g.imageSmoothingQuality = 'high'; g.drawImage(X.clay, 0, 0, X.w * T, X.h * T);
      K.specks(g, 21, 2400, 0, 0, W, H, '#6A4A2E', 0.4, 1.5, 0.08, 0.3); K.specks(g, 22, 1200, 0, 0, W, H, '#FFF2DA', 0.4, 1.3, 0.08, 0.3);
      const Rc = XY.rng(23); for (let k = 0; k < 9; k++) { const side = k % 4; let x = side === 0 ? TB.x0 + 2 : side === 1 ? TB.x1 - 2 : 80 + Rc() * 1020, y = side < 2 ? 80 + Rc() * 600 : side === 2 ? TB.y0 + 2 : TB.y1 - 2;
        const P2 = [x, y], a0 = side === 0 ? 0 : side === 1 ? Math.PI : side === 2 ? Math.PI / 2 : -Math.PI / 2; let a = a0; for (let s = 0; s < 6; s++) { a = a0 + (Rc() - 0.5) * 1.2; x += Math.cos(a) * 8; y += Math.sin(a) * 8; P2.push(x, y); } inc(g, P2, 1.4); }
      inc(g, [TB.x0 + 14, BAND[0] - 4, TB.x1 - 14, BAND[0] - 4], 1.6); inc(g, [TB.x0 + 14, BAND[1] + 4, TB.x1 - 14, BAND[1] + 4], 1.6);
      g.save(); g.beginPath(); g.rect(TB.x0 + 10, BAND[0], TB.x1 - TB.x0 - 20, BAND[1] - BAND[0]); g.clip(); for (let x = TB.x0 - 40; x < TB.x1; x += P) { g.save(); g.translate(x, BAND[0]); sealScene(g); g.restore(); } g.restore();
      [130, 172, 214, 256].forEach(y => inc(g, [TB.x0 + 18, y, TB.x1 - 18, y], 1.4));
      [ROWS[0], ROWS[2]].forEach(Rw => Rw.forEach(w => wedge(g, w[0], w[1], w[2], w[3])));
      [0, 1, 2].forEach(k => wedge(g, 1072 + k * 22, 134, Math.PI / 2, 2.0));                     // 𒐈 = 3
      inc(g, [TB.x0 + 18, RIVER[0] - 6, TB.x1 - 18, RIVER[0] - 6], 2.2); inc(g, [TB.x0 + 18, RIVER[1] + 6, TB.x1 - 18, RIVER[1] + 6], 2.2);
      inc(g, [TB.x0 + 18, 704, TB.x1 - 18, 704], 2.6); inc(g, [TB.x0 + 18, 712, TB.x1 - 18, 712], 1.3);
      ROWB.forEach(w => wedge(g, w[0], w[1], w[2], w[3] * 0.85));
      jinshan(g);
      // the empty ruled case that the title will fill
      inc(g, [312, 262, 582, 262, 582, 400, 312, 400, 312, 262], 1.6);
      g.restore();
      rr(g, TB.x0, TB.y0, TB.x1, TB.y1, TB.r); g.strokeStyle = 'rgba(40,24,12,0.6)'; g.lineWidth = 2; g.stroke();
    },
    draw(g, e) {
      const { W, u, t, S } = e, X = tex(W), acts = actsAt(u); title();
      // the seal rolls the frieze in from the left: blank clay ahead of it
      const sr = XY.smooth(rev(u, -0.08, 0.34)), sx = TB.x0 + 20 + (TB.x1 - TB.x0 + 80) * sr;
      if (sr < 1) { const x0 = Math.max(TB.x0, sx); g.save(); g.beginPath(); g.rect(x0, BAND[0] - 1, TB.x1 - x0, BAND[1] - BAND[0] + 2); g.clip(); g.drawImage(X.clay, 0, 0, X.w * T, X.h * T); g.restore(); }
      // the river flowing right, fish, reeds on the near bank, palms on the far bank
      for (let k = 0; k < 7; k++) { const y = RIVER[0] + 12 + k * 20, P2 = []; for (let x = TB.x0 + 20; x <= TB.x1 - 20; x += 8) P2.push(x, y + 4 * Math.sin(x * 0.05 - t * (2.2 + 0.25 * k) + k * 0.9)); inc(g, P2, 1.8); }
      for (let k = 0; k < 3; k++) fishI(g, TB.x0 + 40 + ((k * 390 + t * (40 + 12 * k)) % (TB.x1 - TB.x0 - 80)), RIVER[0] + 34 + k * 42, 1);
      for (let k = 0; k < 11; k++) { const x = 70 + k * 100 + 34 * XY.hash(k, 3), sw = (K.step(t + k * 0.1, 3) % 2) ? 3 : -3;
        for (let j = 0; j < 3; j++) { const dd = x + j * 7 - e.procX - 40, part = 26 * Math.sign(dd) * Math.exp(-Math.abs(dd) / 110), lean = (j - 1) * 9 + 6 * XY.hash(k, j + 7) + part, top = 584 + 30 * XY.hash(k, j + 4) + (j === 1 ? -14 : 0), bx = x + j * 7;
          inc(g, [bx, 700, bx + lean * 0.4 + sw * 0.4, 646, bx + lean + sw, top], 1.6); for (let q = 0; q < 4; q++) inc(g, [bx + lean + sw, top + q * 6, bx + lean + sw + (j - 1 || 1) * 7, top + q * 6 + 5], 1); }
        for (let q = 0; q < 4; q++) inc(g, [x - 14 + q * 9, 700, x - 10 + q * 9, 688], 1.1); }
      willow(g, 252, 410, 118, t, 0); willow(g, 824, 410, 104, t, 1); boat(g, 700, 410, t);
      mother(g, 150, 410, t);
      // the child drifts to the tower; 法明 bows and lifts him out
      const px = plankX(u), bob = 0.05 * Math.sin(t * 3.1), py = PLANK_Y + 3 * Math.sin(t * 3.1 + 1), lift = XY.smooth(rev(u, 0.63, 0.1));
      faming(g, 906, 410, K.win(u, 0.55, 0.8, 0.05), lift);
      babyOnPlank(g, px, py, bob, true, lift <= 0);
      if (lift > 0) babyOnPlank(g, XY.lerp(px - 4, 878, lift), XY.lerp(py - 2, 352, lift), XY.lerp(bob, -0.35, lift), false);
      // the blood letter: trembles → flies up as wedge-birds on beat 2 → stabs back in as 「抛江」 on beat 3
      if (u < 0.4) { const tr = u > 0.3 ? ((K.step(t, 15) % 2) ? 0.9 : -0.9) * XY.smooth(rev(u, 0.3, 0.06)) : 0; BL.forEach((w, i) => wedge(g, w[0] + tr * (i % 2 ? 1 : -1), w[1] - Math.abs(tr), w[2], w[3], BLOOD)); }
      else if (u < 0.6) BL.forEach((w, i) => { const h = XY.hash(i, 5), q = XY.easeIO(XY.clamp((u - 0.4 - 0.04 * h) / (0.2 - 0.04 * h))), E = TG[Math.floor(i * TG.length / BL.length)], a2 = XY.hash(i, 8) * TAU;
        const c1 = [w[0] - 40 + 80 * XY.hash(i, 6), w[1] - 40 - 50 * XY.hash(i, 7)], c2 = [plankX(0.52) + Math.cos(a2) * (50 + 70 * XY.hash(i, 9)), 420 + Math.sin(a2) * 44];
        const p = bz(w, c1, c2, E, q), p2 = bz(w, c1, c2, E, Math.min(1, q + 0.02)); bird(g, p[0], p[1], Math.atan2(p2[1] - p[1], p2[0] - p[0]), 1.3, Math.abs(Math.sin(t * 26 + i * 1.7))); });
      else { TG.forEach(w => wedge(g, w[0], w[1], w[2], 0.82, BLOOD)); const d = rev(u, 0.6, 0.07);
        if (d < 1) TG.forEach((w, i) => { if (i % 5) return; for (let j = 0; j < 3; j++) { const a = XY.hash(i, j) * TAU, r = 6 + 24 * XY.easeOut(d); g.fillStyle = `rgba(150,112,72,${0.8 * (1 - d)})`; g.beginPath(); g.arc(w[0] + 4 + Math.cos(a) * r, w[1] + Math.sin(a) * r, 2.2, 0, TAU); g.fill(); } }); }
      // the procession pressed into the clay
      const [pc, pg] = K.layer('cu-pr', e); XY.drawProcession(pg, e.phase, e.procX, e.groundY, PEN, acts);
      pg.save(); pg.setTransform(1, 0, 0, 1, 0, 0); pg.globalCompositeOperation = 'source-atop'; pg.fillStyle = pg.createPattern(grain(S), 'repeat'); pg.fillRect(0, 0, pc.width, pc.height); pg.restore();
      K.sunken(g, e, pc, 1.8, LIP, 'rgba(60,36,18,0.5)', 'cu-pr');
      // the tablet's pillow shape lights everything; the seal rolls over it
      g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'soft-light'; g.imageSmoothingQuality = 'high'; g.drawImage(X.pil, 0, 0, X.pil.width * 4 * S, X.pil.height * 4 * S); g.restore();
      if (sr > 0 && sr < 1) sealObj(g, sx, S);
    },
    hits: [3.2, 4.8],
    post(canvas, g, e) { K.zoom(canvas, g, e, K.push(e.beat, 4.3, 4.8, 6.4, 0.16), 447, 331); },
  };
})();
