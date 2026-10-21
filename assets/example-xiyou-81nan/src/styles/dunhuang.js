// 12 敦煌北魏壁画 · 收降八戒 — an earth-red Northern Wei wall: valance and rows of thousand Buddhas above, sawtooth
// hills, apsaras flying flat with streaming scarves. Told in continuous narration: the fight on the clouds (top left),
// 高老庄 with 翠兰 at the window, the burning 云栈洞 (top right) — and in the road Zhu Bajie kneeling with his rake laid
// down. Beat 2 he knocks his head to the ground; beat 3 the cartouche beside him loses 猪刚鬣 and is rewritten 八戒;
// then he rises, turns, and falls into his place in the line. Faces are oxidised dark with white nose and eyes.
(() => {
  'use strict';
  const XY = window.XY, TAU = XY.TAU, K = XY.KIT_B;
  const EARTH = '#92342D', EARTH2 = '#7E2A24', WH = '#E6DCC8', GRN = '#4E8A6E', BLU = '#3E7E8C', BK = '#1E1814', OCH = '#C08A4A', DARK = '#5C4A44';
  const LINE = '#2A1C16';
  const sp = (pts, n = 5) => XY.RIG.spline(pts, true, n);
  const fillP = (g, pts, col, line = LINE, lw = 1.4) => { XY.path(g, pts, true); g.fillStyle = col; g.fill(); if (line) { g.strokeStyle = line; g.lineWidth = lw; g.stroke(); } };
  const stroke = (g, pts, w, col) => { g.strokeStyle = col; g.lineWidth = w; XY.path(g, pts, false); g.stroke(); };

  // ------------------------------------------------------------ static wall
  const valance = (g, W) => {
    g.fillStyle = '#5A2A22'; g.fillRect(0, 0, W, 40);
    const C = [GRN, WH, BLU, EARTH, OCH];
    for (let x = 0, k = 0; x < W; x += 28, k++) { fillP(g, [x, 10, x + 28, 10, x + 14, 38], C[k % 5], LINE, 1); g.fillStyle = OCH; g.beginPath(); g.arc(x + 14, 38, 2.4, 0, TAU); g.fill(); }
    g.fillStyle = '#3A1E18'; g.fillRect(0, 0, W, 10); for (let x = 6; x < W; x += 12) { g.fillStyle = WH; g.beginPath(); g.arc(x, 5, 2, 0, TAU); g.fill(); }
  };
  // thousand Buddhas: halo + aureole + seated figure, colours rotating in the Northern Wei sequence
  const thousand = (g, W) => {
    const C = [[GRN, WH, EARTH], [BLU, EARTH, WH], [WH, BK, GRN], [EARTH, GRN, BLU], [BK, OCH, WH]];
    for (let r = 0; r < 2; r++) for (let k = 0; k < 30; k++) { const x = 20 + k * 39 + (r ? 19 : 0), y = 62 + r * 50; if (x > W - 16) continue;
      const [a, b, c] = C[(k + r * 2) % 5];
      fillP(g, XY.ellipse(x, y + 14, 16, 22, 18), a, LINE, 1); fillP(g, XY.ellipse(x, y - 6, 9, 9, 14), b, LINE, 1);
      fillP(g, sp([x - 12, y + 30, x - 9, y + 14, x - 4, y + 4, x + 4, y + 4, x + 9, y + 14, x + 12, y + 30], 3), c, LINE, 1);
      fillP(g, XY.ellipse(x, y - 6, 4.6, 5.2, 10), DARK, null); stroke(g, [x, y - 8, x, y - 4], 1.4, WH);
      fillP(g, [x - 6, y - 22, x, y - 34, x + 6, y - 22], a, LINE, 1); fillP(g, XY.ellipse(x, y - 12, 2.6, 2.6, 8), BK, null);
      fillP(g, sp([x - 7, y + 20, x, y + 14, x + 7, y + 20, x, y + 24], 3), DARK, null); stroke(g, [x - 4, y + 9, x, y + 13, x + 4, y + 9], 1, c === WH ? BK : WH);
      fillP(g, [x - 14, y + 30, x + 14, y + 30, x + 10, y + 36, x - 10, y + 36], EARTH2, LINE, 0.8); }
    g.fillStyle = '#2E1A14'; g.fillRect(0, 150, W, 18); const S = [WH, GRN, BK, BLU, OCH];
    S.forEach((c, k) => { g.fillStyle = c; g.fillRect(0, 150 + k * 3.4, W, 2.6); });
    for (let x = 6; x < W; x += 14) { g.fillStyle = WH; g.beginPath(); g.arc(x, 166, 2.4, 0, TAU); g.fill(); }
  };
  // sawtooth hills: each peak one flat colour, one flank darker, red ground showing between
  const hills = (g, x0, x1, base, h, seed) => {
    const R = XY.rng(seed), C = [GRN, BLU, WH, OCH, '#3A6A58'];
    for (let x = x0; x < x1;) { const w = 22 + R() * 26, hh = h * (0.55 + 0.45 * R()), c = C[Math.floor(R() * C.length)], tip = x + w * (0.4 + 0.2 * R());
      fillP(g, [x, base, tip, base - hh, x + w, base], c, LINE, 1.2);
      g.fillStyle = 'rgba(20,10,6,0.28)'; XY.path(g, [tip, base - hh, x + w, base, tip + 2, base], true); g.fill();
      x += w * 0.72; }
  };
  const house = g => {
    // 高老庄: a hall with owl-tail ridge ends, red pillars, a lattice window with 翠兰 behind it
    fillP(g, [86, 600, 86, 470, 252, 470, 252, 600], '#B89A72');
    fillP(g, sp([60, 470, 96, 430, 168, 418, 242, 430, 278, 470, 168, 462], 6), BK);
    fillP(g, [64, 424, 70, 400, 82, 420], BK); fillP(g, [274, 424, 268, 400, 256, 420], BK);
    [92, 160, 232].forEach(x => fillP(g, [x, 600, x, 472, x + 14, 472, x + 14, 600], EARTH2));
    fillP(g, [114, 494, 154, 494, 154, 548, 114, 548], '#2A1A14');
    fillP(g, XY.ellipse(134, 512, 8, 9, 12), DARK, null); stroke(g, [134, 510, 134, 515], 1.6, WH);
    fillP(g, sp([122, 548, 126, 526, 142, 526, 146, 548], 3), GRN, null);
    for (let k = 0; k < 4; k++) stroke(g, [114 + k * 13.3, 494, 114 + k * 13.3, 548], 1.4, OCH); stroke(g, [114, 521, 154, 521], 1.4, OCH);
    fillP(g, [176, 600, 176, 500, 218, 500, 218, 600], '#3A2218');
  };
  const cave = g => {
    // 云栈洞 in its own hill, burning (flames are animated in draw)
    hills(g, 930, 1140, 330, 120, 1207);
    fillP(g, sp([980, 330, 990, 270, 1040, 248, 1090, 270, 1100, 330], 5), '#1A0E0A');
  };
  const cartouche = (g, x, y, w, h) => { fillP(g, [x, y, x + w, y, x + w, y + h, x, y + h], '#E8E0CC', LINE, 1.6); g.strokeStyle = 'rgba(120,90,60,0.4)'; g.lineWidth = 1; g.strokeRect(x + 4, y + 4, w - 8, h - 8); };
  const yakshas = (g, W) => {
    g.fillStyle = '#3A1E18'; g.fillRect(0, 702, W, 78); [WH, GRN, BK, EARTH].forEach((c, k) => { g.fillStyle = c; g.fillRect(0, 704 + k * 3, W, 2.4); });
    for (let k = 0; k < 13; k++) { const x = 40 + k * 92, y = 774, s = k % 2 ? 1 : -1;
      fillP(g, sp([x - 18, y, x - 22, y - 26, x - 12, y - 42, x + 12, y - 42, x + 22, y - 26, x + 18, y], 3), k % 3 ? '#6A4A40' : '#4A3A34', LINE, 1.2);
      fillP(g, XY.ellipse(x, y - 52, 10, 10, 12), '#5C4A44', LINE, 1.2); stroke(g, [x - 14, y - 38, x - 30 * s, y - 62], 6, '#5C4A44'); stroke(g, [x + 14, y - 38, x + 26 * s, y - 60], 6, '#5C4A44');
      stroke(g, [x - 2, y - 54, x + 2, y - 54], 2, WH); fillP(g, [x - 20, y - 6, x + 20, y - 6, x + 16, y - 18, x - 16, y - 18], k % 2 ? GRN : WH, null); }
  };
  // wall decay: cracks, flaking (起甲) and salt bloom, as one static overlay
  const decay = (W, H, S) => XY.cached(`dh-decay:${S.toFixed(3)}`, W * S, H * S, cv => {
    const g = cv.getContext('2d'); g.scale(S, S); const R = XY.rng(1221);
    for (let k = 0; k < 12; k++) { const x = R() * W, y = 170 + R() * 520, r = 14 + R() * 34;
      for (let j = 0; j < 70; j++) { const a = R() * TAU, d = r * Math.sqrt(R()); g.fillStyle = `rgba(232,222,200,${0.15 + 0.3 * R()})`; g.fillRect(x + Math.cos(a) * d, y + Math.sin(a) * d * 0.7, 1 + R() * 2.5, 1 + R() * 2); } }
    for (let k = 0; k < 26; k++) { const x = R() * W, y = R() * H, p = XY.wobble(XY.ellipse(x, y, 6 + R() * 12, 4 + R() * 8, 10), 3, k);
      XY.path(g, p, true); g.fillStyle = R() < 0.5 ? 'rgba(200,150,120,0.55)' : 'rgba(60,30,20,0.45)'; g.fill(); }
    g.strokeStyle = 'rgba(30,14,10,0.5)'; g.lineWidth = 1;
    for (let k = 0; k < 14; k++) { let x = R() * W, y = R() * H, a = R() * TAU; g.beginPath(); g.moveTo(x, y); for (let s = 0; s < 22; s++) { a += (R() - 0.5) * 1.1; x += Math.cos(a) * 8; y += Math.sin(a) * 8; g.lineTo(x, y); } g.stroke(); }
  });
  const grain = (W, H) => XY.keep('dh-grain', Math.ceil(W / 3), Math.ceil(H / 3), cv => {
    const g = cv.getContext('2d'), w = cv.width, h = cv.height, im = g.createImageData(w, h), d = im.data;
    for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) { const n = XY.fbm(i / 22, j / 22, 71, 4), f = XY.fbm(i / 4, j / 4, 73, 2), v = 0.89 + 0.08 * n + 0.04 * f, o = (j * w + i) * 4;
      d[o] = 255 * v; d[o + 1] = 244 * v; d[o + 2] = 228 * v; d[o + 3] = 255; }
    g.putImageData(im, 0, 0);
  });
  // ------------------------------------------------------------ moving parts
  const ribbonS = (pts, w0, w1) => XY.RIG.ribbon(XY.RIG.spline(pts, false, 6), w0, w1);
  // an apsara flying flat: head first, the skirt trailing into a long tail, two scarves streaming up and back
  const apsara = (g, x, y, dir, t, k) => {
    g.save(); g.translate(x, y); g.scale(dir, 1);
    const w = q => 8 * Math.sin(t * 2.4 + k * 2 + q * 3);
    [[-4, [26, -8, 6, -34, -40, -52 + w(1), -100, -40 + w(2), -170, -56 + w(3)], WH], [2, [20, -2, -10, -18, -60, -12 + w(1.5), -130, -24 + w(2.5), -200, -8 + w(3.5)], EARTH]].forEach(([dy, p, c]) => {
      fillP(g, ribbonS(p.map((v, i) => i % 2 ? v + dy : v), 8, 4), c, LINE, 1.1); });
    fillP(g, ribbonS([6, 4, -30, 10, -70, 14 + w(1), -110, 10 + w(2), -150, 18 + w(3)], 30, 6), GRN, LINE, 1.3);
    for (let j = 0; j < 3; j++) stroke(g, XY.RIG.spline([-10 - j * 8, 2 + j * 5, -60, 8 + j * 4 + w(1) * 0.6, -120, 12 + j * 2 + w(2.4) * 0.8], false, 5), 1.2, WH);
    fillP(g, sp([4, 10, 6, -6, 22, -14, 38, -10, 34, 6, 18, 12]), DARK, LINE, 1.3);
    stroke(g, [24, -6, 48, 4 + 3 * Math.sin(t * 3 + k)], 5, DARK);
    fillP(g, XY.ellipse(50, 4 + 3 * Math.sin(t * 3 + k), 5, 4, 8), EARTH, LINE, 1);
    fillP(g, XY.ellipse(40, -20, 10, 11, 14), DARK, LINE, 1.3); fillP(g, XY.ellipse(34, -30, 7, 6, 10), BK, null); fillP(g, sp([30, -26, 36, -32, 48, -28, 44, -22], 3), BK, null);
    stroke(g, [46, -24, 49, -16], 1.8, WH); stroke(g, [41, -24, 45, -24], 1.4, WH);
    g.restore();
  };
  const flower = (g, x, y, r, rot, col) => { g.save(); g.translate(x, y); g.rotate(rot); g.fillStyle = col; for (let k = 0; k < 4; k++) { g.beginPath(); g.ellipse(Math.cos(k * TAU / 4) * r, Math.sin(k * TAU / 4) * r, r * 0.8, r * 0.5, k * TAU / 4, 0, TAU); g.fill(); } g.fillStyle = OCH; g.beginPath(); g.arc(0, 0, r * 0.5, 0, TAU); g.fill(); g.restore(); };
  // wind-leaf trees: a trunk and a fan of comma leaves that flip in the wind
  const windTree = (g, x, y, s, t, k) => {
    stroke(g, [x, y, x + 2, y - 40 * s], 3, '#3A2418');
    for (let j = 0; j < 7; j++) { const a = -Math.PI / 2 + (j - 3) * 0.42 + 0.12 * Math.sin(t * 3 + k + j), l = 26 * s;
      g.save(); g.translate(x + 2, y - 40 * s); g.rotate(a); fillP(g, sp([0, 0, l * 0.5, -6 * s, l, -2 * s, l * 0.8, 4 * s, l * 0.4, 3 * s], 3), j % 2 ? GRN : '#3A6A58', LINE, 1); g.restore(); }
  };
  const tongue = (g, x, y, h, t, k) => { const sw = 8 * Math.sin(t * 9 + k * 1.7);
    fillP(g, sp([x - 12, y, x - 8, y - h * 0.5, x + sw, y - h, x + 8, y - h * 0.45, x + 12, y], 4), EARTH, LINE, 1.2);
    fillP(g, sp([x - 6, y, x - 3, y - h * 0.4, x + sw * 0.6, y - h * 0.7, x + 5, y - h * 0.35, x + 6, y], 3), OCH, null);
    fillP(g, sp([x - 2, y, x + sw * 0.3, y - h * 0.35, x + 3, y], 3), WH, null); };
  const COL = { fur: '#6A4A38', face: '#7A5E52', wkshirt: EARTH, tiger: OCH, stripe: BK, gold: OCH, staff: EARTH, ink: BK, horse: WH, horse2: '#C8BCA8',
    mane: '#D8CCB6', hoof: BK, saddle: '#5A2A22', red: EARTH, robe: OCH, kasaya: EARTH, skin: DARK, metal: '#9AA8A0', wood: '#6A4A30', bjrobe: '#24302C', bjpants: '#1E2622',
    pig: '#7E5E5C', pig2: '#664846', ssrobe: BLU, ssrobe2: '#2E5E68', skin2: DARK, ssh: EARTH, ssbeard: EARTH2, skull: WH, bundle: OCH };
  const PEN = { outline: LINE, ow: 1.5, shade: 'rgba(30,10,6,0.28)', color: r => (COL[r] !== undefined ? COL[r] : XY.DEFAULT_COLORS[r]) };
  const KNEEL = [1100, 712];
  const mergeU = c => { if (c._dhMerge) return c._dhMerge; let lo = 0.5, hi = 1.3; for (let k = 0; k < 30; k++) { const m = (lo + hi) / 2; if (XY.procWorldX(c.t0 + m * c.dur) - c.x - 150 < KNEEL[0]) lo = m; else hi = m; } return (c._dhMerge = lo); };
  // the 白 of the "small-character face": white nose ridge and eye on the oxidised dark skin
  const whites = (g, e, acts, joined) => {
    g.strokeStyle = 'rgba(240,232,214,0.9)'; g.lineCap = 'round';
    const m = e.at('monk.head', acts), w = e.at('wukong.head', acts);
    g.lineWidth = 2; XY.path(g, [m[0] + 12, m[1] - 4, m[0] + 13, m[1] + 3], false); g.stroke(); XY.path(g, [m[0] + 4, m[1] - 3, m[0] + 9, m[1] - 3], false); g.stroke();
    XY.path(g, [w[0] + 15, w[1] - 6, w[0] + 18, w[1] + 2], false); g.stroke();
    if (joined) { const b = e.at('bajie.head', acts); XY.path(g, [b[0] + 18, b[1] - 4, b[0] + 30, b[1] - 3], false); g.stroke(); }
  };

  XY.STYLES.dunhuang = {
    bg(g, W, H) {
      g.fillStyle = EARTH; g.fillRect(0, 0, W, H);
      g.lineCap = 'round'; g.lineJoin = 'round';
      valance(g, W); thousand(g, W);
      hills(g, 20, W - 10, 702, 92, 1201); hills(g, 300, 420, 340, 60, 1203); cave(g); house(g); yakshas(g, W);
      // the cloud of the past fight (top left): an elongated Dunhuang cloud with a curled head
      fillP(g, sp([70, 300, 110, 278, 190, 284, 250, 270, 300, 284, 320, 300, 250, 312, 150, 312], 6), WH, LINE, 1.4);
      stroke(g, XY.RIG.spline([300, 284, 330, 262, 322, 244, 304, 252, 312, 266], false, 4), 3, WH);
      stroke(g, XY.RIG.spline([90, 304, 60, 318, 40, 312], false, 4), 3, WH);
      // the counter on its own cartouche
      cartouche(g, 24, 184, 46, 196); g.fillStyle = BK; g.font = XY.font(36, XY.cnFont.wei); g.textAlign = 'center'; g.textBaseline = 'middle';
      ['第', '十', '二', '难'].forEach((c, k) => g.fillText(c, 47, 208 + k * 46)); g.textAlign = 'start'; g.textBaseline = 'alphabetic';
    },
    hits: [4, 5, 6.5],
    draw(g, e) {
      const { W, H, u, t, cell } = e; g.lineCap = 'round'; g.lineJoin = 'round';
      // wind-leaf trees on the hills, flames in the mouth of 云栈洞, the fight still going on in the clouds
      [[360, 702, 1.1], [600, 702, 0.9], [890, 702, 1.2], [1110, 702, 1], [330, 340, 0.8], [1120, 330, 0.8]].forEach(([x, y, s], k) => windTree(g, x, y, s, t, k));
      const blaze = 1 + 1.4 * XY.smooth((u - 0.3) / 0.05) * (1 - 0.5 * XY.smooth((u - 0.9) / 0.2)); for (let k = 0; k < 5; k++) tongue(g, 994 + k * 22, 330, (50 + 26 * Math.sin(k * 1.3 + 1) + 10 * XY.noise1(t * 6, k)) * blaze, t, k);
      const lunge = Math.sin(t * 5.2), fp = { ...PEN, ow: 1 };
      K.figure(g, 'wukong', t * 1.3, 150 + 14 * lunge, 286, fp, { wukong: { strike: 0.5 + 0.5 * lunge } }, { scale: 0.48 });
      K.figure(g, 'bajie', t * 1.3 + 0.5, 262 - 10 * lunge, 286, fp, {}, { scale: 0.48, flip: true });
      // apsaras flying in, scattering flowers (a burst at beat 3)
      const ax = [820 - 120 * u, 640 - 90 * u], ay = [214 + 8 * Math.sin(t * 1.7), 296 + 8 * Math.sin(t * 1.9 + 1)];
      for (let k = 0; k < 2; k++) apsara(g, ax[k], ay[k], -1, t, k);
      const burst = XY.clamp((u - 0.625) / 0.35);
      for (let k = 0; k < 40; k++) { const ex = k < 18; if (ex && burst <= 0) continue;
        const ph = ex ? burst * (0.6 + 0.4 * XY.hash(k, 2)) : (t * 0.22 + XY.hash(k, 3)) % 1, src = ex ? [ax[k % 2] - 50, ay[k % 2]] : [180 + XY.hash(k, 4) * 900, 180];
        const x = src[0] + (XY.hash(k, 5) - 0.5) * (ex ? 300 : 80) * ph + 18 * Math.sin(t * 2 + k), y = src[1] + ph * (ex ? 300 : 500);
        if (y > 690) continue; flower(g, x, y, 4 + 2 * XY.hash(k, 6), t * 2 + k, k % 3 ? WH : '#C85A4A'); }
      // Zhu Bajie (v10): kneels far ahead of the line, flinches at Wukong's staff (beat 2), kowtows (beat 4), is renamed
      // as Wukong points (beat 5), then rides a little cloud over the horse into his place (lands beat 6.5)
      const LU = 0.8125, joined = u >= LU, tl = cell.t0 + LU * cell.dur, slot = XY.procWorldX(tl) - cell.x - 150, ph = XY.walkPhase(tl);
      const acts = { wukong: { raise: XY.smooth((u - 0.2) / 0.06) * (1 - XY.smooth((u - 0.42) / 0.06)), strike: 0.55 * XY.smooth((u - 0.6) / 0.03) * (1 - XY.smooth((u - 0.72) / 0.05)) },
        monk: { palm: XY.smooth((u - 0.46) / 0.05) * (1 - XY.smooth((u - 0.8) / 0.1)) }, bajie: { scratch: joined ? XY.smooth((u - LU - 0.02) / 0.06) * (1 - XY.smooth((u - LU - 0.3) / 0.1)) : 0 } };
      // the cartouche: 猪刚鬣 is washed out and 八戒 is written in its place at beat 5
      const cx = 1100, cy = 318, wipe = XY.clamp((u - 0.6) / 0.025), write = XY.clamp((u - 0.625) / 0.05), wglow = Math.max(0, 1 - Math.abs(u - 0.65) / 0.06);
      if (wglow > 0) { g.save(); g.globalCompositeOperation = 'screen'; const rg = g.createRadialGradient(cx + 32, cy + 95, 10, cx + 32, cy + 95, 150); rg.addColorStop(0, `rgba(255,236,190,${0.55 * wglow})`); rg.addColorStop(1, 'rgba(255,220,170,0)'); g.fillStyle = rg; g.fillRect(cx - 120, cy - 60, 300, 310); g.restore(); }
      cartouche(g, cx, cy, 64, 190); g.fillStyle = BK; g.textAlign = 'center'; g.textBaseline = 'middle';
      if (wipe < 1) { g.save(); g.beginPath(); g.rect(cx, cy + 190 * wipe, 64, 190); g.clip(); g.font = XY.font(42, XY.cnFont.wei); ['猪', '刚', '鬣'].forEach((c, k) => g.fillText(c, cx + 32, cy + 38 + k * 56)); g.restore(); }
      if (write > 0) { g.save(); g.beginPath(); g.rect(cx, cy, 64, 190 * write); g.clip(); g.font = XY.font(58, XY.cnFont.wei); g.fillText('八', cx + 32, cy + 52); g.fillText('戒', cx + 32, cy + 134); g.restore(); }
      g.textAlign = 'start'; g.textBaseline = 'alphabetic';
      K.shadedTeam(g, e, PEN, { ...acts, cast: { bajie: joined } }, null, [[4, 3, 'rgba(40,10,6,0.42)'], [-3, -2, 'rgba(40,10,6,0.22)']]);
      whites(g, e, acts, joined);
      const cloud = (x, y, s, a) => { g.save(); g.globalAlpha = a; g.translate(x, y); g.scale(s, s);
        fillP(g, sp([-60, 0, -40, -14, -10, -10, 14, -18, 44, -10, 62, 2, 30, 12, -24, 12], 5), WH, LINE, 1.4);
        stroke(g, XY.RIG.spline([62, 2, 84, -8, 80, -24, 66, -20, 70, -10], false, 4), 3, WH); stroke(g, XY.RIG.spline([-60, 0, -82, 8, -100, 2 + 4 * Math.sin(t * 6)], false, 4), 3, WH); g.restore(); };
      if (!joined) {
        const flinch = Math.max(0, 1 - Math.abs(u - 0.29) / 0.06), bow = 0.15 + 0.8 * Math.max(Math.sin(Math.PI * XY.clamp((u - 0.44) / 0.12)), Math.sin(Math.PI * XY.clamp((u - 0.6) / 0.08)) * 0.7);
        const rise = XY.smooth((u - 0.68) / 0.04), fq = XY.clamp((u - 0.7) / (LU - 0.7)), q = XY.easeIO(fq);
        if (rise < 1) { g.save(); g.translate(KNEEL[0], KNEEL[1]); stroke(g, [-150, -4, -20, 0], 5, '#6A4A30'); stroke(g, [-150, -22, -150, 14], 7, '#9AA8A0');
          for (let k = 0; k < 9; k++) stroke(g, [-150, -20 + k * 4.2, -166, -21 + k * 4.4], 2.4, '#9AA8A0'); g.restore(); }
        const x = XY.lerp(KNEEL[0], slot, q), y = XY.lerp(KNEEL[1], e.groundY, q) - 390 * Math.sin(q * Math.PI);
        if (fq > 0) cloud(x, y + 6, 1.1, Math.min(1, fq * 6) * (1 - XY.smooth((fq - 0.85) / 0.15)));
        K.figure(g, 'bajie', fq > 0 ? ph : XY.walkPhase(cell.t0 + 0.6 * cell.dur), x + 10 * flinch, y, PEN, {}, { flip: fq <= 0 && rise < 0.5, kneel: 1 - rise, bow: bow * (1 - rise) - 0.3 * flinch, skip: p => rise < 1 && (p.role === 'wood' || p.role === 'metal') });
      } else if (u < LU + 0.06) cloud(slot + (XY.procWorldX(e.t) - XY.procWorldX(tl)), e.groundY + 6, 1.1 + (u - LU) * 6, 1 - (u - LU) / 0.06);
      g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'multiply'; g.drawImage(grain(W, H), 0, 0, W * e.S, H * e.S);
      g.globalCompositeOperation = 'source-over'; g.drawImage(decay(W, H, e.S), 0, 0); g.restore();
    },
    post(canvas, g, e) { K.zoomPost(canvas, g, e, 1060, 560, K.zoom(e.u, [0.6, 0.645, 0.78], 1.1)); },
  };
})();
