// 26 明代版画 · 1592 年 · 乌鸡国救主 — a double-page woodcut in the manner of the Wanli-era 世德堂 edition: heavy 四周双边
// frame, a 版心 with fish-tail marks down the fold, 回目 couplet strips at both sides, a title box 「救主」. A night garden:
// black wood-grain sky with a white moon, palace roofs, a moon gate, Taihu rocks, the 芭蕉 tree over the octagonal
// glazed well. 八戒 knocks the banana tree down (beat 1.2), is let down the well on 悟空's rope, and on beat 3 bursts
// back up with the dead king of 乌鸡国 across his back (冲天冠, dragon robe, the 定颜珠 glowing in his mouth). On 4.2
// the king revives, climbs down and bows by the well. Black ink, carved white lines in the solids, uneven inking.
// Entry: a palm-fibre brush rubs the paper from right to left and the print appears behind it.
(() => {
  'use strict';
  const XY = window.XY, K = XY.KIT_C, TAU = XY.TAU;
  const INK = '#141110', PAPER = '#EFE6D2', WELL = [480, 642], WS = 1.5;   // the well is drawn 1.5× about WELL
  const tile = (key, paint) => XY.keep(key, 24, 24, cv => paint(cv.getContext('2d')));
  const cutTile = () => tile('mp-cut', g => { g.fillStyle = INK; g.fillRect(0, 0, 24, 24); g.strokeStyle = PAPER; g.lineWidth = 1; for (let k = -24; k <= 48; k += 6) { g.beginPath(); g.moveTo(k, 0); g.lineTo(k + 24, 24); g.stroke(); } });
  const hatchTile = () => tile('mp-hat', g => { g.fillStyle = PAPER; g.fillRect(0, 0, 24, 24); g.strokeStyle = INK; g.lineWidth = 1.3; for (let k = -24; k <= 48; k += 5) { g.beginPath(); g.moveTo(k + 24, 0); g.lineTo(k, 24); g.stroke(); } });
  const dotTile = () => tile('mp-dot', g => { g.fillStyle = PAPER; g.fillRect(0, 0, 24, 24); g.fillStyle = INK; [[4, 4], [16, 10], [8, 18], [20, 22]].forEach(([x, y]) => { g.beginPath(); g.arc(x, y, 1.3, 0, TAU); g.fill(); }); });
  const ROLE = { ink: 'black', stripe: 'black', hoof: 'black', bjrobe: 'cut', bjpants: 'black', ssh: 'black', ssbeard: 'black', mane: 'white', saddle: 'cut', kasaya: 'hatch', red: 'hatch',
    wkshirt: 'hatch', staff: 'black', ssrobe: 'hatch', ssrobe2: 'cut', fur: 'dot', tiger: 'dot', wood: 'hatch', metal: 'white', gold: 'white', robe: 'white', bundle: 'dot' };
  const penFor = g => { const P = { cut: g.createPattern(cutTile(), 'repeat'), hatch: g.createPattern(hatchTile(), 'repeat'), dot: g.createPattern(dotTile(), 'repeat'), black: INK, white: PAPER };
    return { color: (r, p) => (p && p.k !== 'poly' ? INK : P[ROLE[r] || 'white']), outline: INK, ow: 2.3, wob: 0.8, seed: 26, shade: false }; };

  // ------------------------------------------------------------ carved motifs
  const L = (g, pts, w = 2, closed = false) => { XY.path(g, pts, closed); g.strokeStyle = INK; g.lineWidth = w; g.stroke(); };
  const F = (g, pts, fill) => { XY.path(g, pts, true); g.fillStyle = fill; g.fill(); g.strokeStyle = INK; g.lineWidth = 2; g.stroke(); };
  const cloud = (g, x, y, s) => {   // woodcut scroll cloud: white body, hooked curls
    g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = PAPER; g.strokeStyle = INK; g.lineWidth = 2 / s;
    g.beginPath(); g.moveTo(-60, 10); g.bezierCurveTo(-70, -14, -40, -26, -24, -14); g.bezierCurveTo(-20, -36, 14, -36, 16, -16); g.bezierCurveTo(34, -30, 64, -16, 54, 6); g.quadraticCurveTo(70, 20, 40, 22); g.lineTo(-50, 22); g.quadraticCurveTo(-70, 20, -60, 10); g.closePath(); g.fill(); g.stroke();
    [[-30, -4, 9], [8, -12, 10], [38, 0, 8]].forEach(([cx, cy, r]) => { g.beginPath(); g.arc(cx, cy, r, 0.4, TAU * 0.85); g.stroke(); g.beginPath(); g.arc(cx + 2, cy + 1, r * 0.45, 0.4, TAU * 0.8); g.stroke(); });
    g.restore();
  };
  const bananaLeaf = (g, x, y, len, ang, droop) => {   // a big leaf with parallel carved veins
    g.save(); g.translate(x, y); g.rotate(ang); const pts = [];
    for (let k = 0; k <= 10; k++) { const f = k / 10; pts.push(f * len, -Math.sin(f * Math.PI) * len * 0.22 + droop * f * f * len * 0.4); }
    for (let k = 10; k >= 0; k--) { const f = k / 10; pts.push(f * len, Math.sin(f * Math.PI) * len * 0.1 + droop * f * f * len * 0.4 + 4); }
    F(g, pts, PAPER); g.strokeStyle = INK; g.lineWidth = 1.3;
    for (let k = 1; k < 12; k++) { const f = k / 12, mx = f * len, my = droop * f * f * len * 0.4 + 2; g.beginPath(); g.moveTo(mx, my); g.lineTo(mx + len * 0.06, my - Math.sin(f * Math.PI) * len * 0.2); g.stroke(); }
    L(g, [0, 2, len * 0.5, droop * 0.1 * len + 2, len, droop * len * 0.4 + 2], 1.8);
    g.restore();
  };
  const rockery = (g, x, y, w, h, seed) => { const R = XY.rng(seed), p = [];
    for (let k = 0; k < 16; k++) { const a = Math.PI + k / 15 * Math.PI, r = 1 + (R() - 0.5) * 0.4; p.push(x + Math.cos(a) * w * r, y + Math.sin(a) * h * r); }
    F(g, XY.RIG.spline(p, true, 3), PAPER);
    g.save(); XY.path(g, XY.RIG.spline(p, true, 3), true); g.clip(); g.fillStyle = g.createPattern(hatchTile(), 'repeat'); g.beginPath(); g.ellipse(x + w * 0.4, y - h * 0.2, w * 0.6, h * 0.8, 0, 0, TAU); g.fill(); g.restore();
    for (let k = 0; k < 4; k++) { const hx = x + (R() - 0.5) * w * 1.1, hy = y - h * (0.25 + R() * 0.55), r = 7 + R() * 9, q = [];   // eroded holes: irregular, hatched, no 'eyes'
      for (let j = 0; j < 9; j++) { const a = j / 9 * TAU, rr = r * (0.6 + 0.7 * XY.hash(seed, k * 9 + j)); q.push(hx + Math.cos(a) * rr * 1.2, hy + Math.sin(a) * rr * 0.9); }
      XY.path(g, q, true); g.fillStyle = g.createPattern(cutTile(), 'repeat'); g.fill(); g.strokeStyle = INK; g.lineWidth = 2; g.stroke(); }
  };
  const roof = (g, x0, x1, y, h) => {   // a palace hall roof: tiles, ridge with 鸱吻, upturned eaves, a wall with lattice under it
    const m = (x0 + x1) / 2; F(g, [x0 - 30, y + h, x0 - 10, y + 8, x1 + 10, y + 8, x1 + 30, y + h, x1 + 46, y + h - 14, x0 - 46, y + h - 14], PAPER);
    g.strokeStyle = INK; g.lineWidth = 1.2; for (let x = x0 - 18; x < x1 + 20; x += 9) { g.beginPath(); g.moveTo(x, y + 10); g.lineTo(x + (x - m) * 0.08, y + h - 12); g.stroke(); }
    F(g, [x0 - 14, y + 10, x1 + 14, y + 10, x1 + 10, y, x0 - 10, y], INK);
    [[x0 - 14, -1], [x1 + 14, 1]].forEach(([x, s]) => F(g, [x, y + 10, x - s * 2, y - 20, x - s * 16, y - 26, x - s * 12, y - 10, x - s * 14, y], INK));
    F(g, [x0 + 10, y + h, x1 - 10, y + h, x1 - 10, y + h + 70, x0 + 10, y + h + 70], PAPER);
    for (let x = x0 + 22; x < x1 - 20; x += 40) { g.strokeStyle = INK; g.lineWidth = 1.2; g.strokeRect(x, y + h + 12, 28, 46); for (let q = 1; q < 4; q++) { g.beginPath(); g.moveTo(x + q * 7, y + h + 12); g.lineTo(x + q * 7, y + h + 58); g.moveTo(x, y + h + 12 + q * 11.5); g.lineTo(x + 28, y + h + 12 + q * 11.5); g.stroke(); } }
  };
  const scaled = (g, f) => { g.save(); g.translate(WELL[0], WELL[1]); g.scale(WS, WS); g.translate(-WELL[0], -WELL[1]); f(); g.restore(); };
  const wellBack0 = g => { const [x, y] = WELL;   // octagonal glazed well: opening with black water, the back half of the rim
    g.fillStyle = INK; g.beginPath(); g.ellipse(x, y, 54, 15, 0, 0, TAU); g.fill();
    g.strokeStyle = PAPER; g.lineWidth = 1.2; g.beginPath(); g.ellipse(x, y + 2, 40, 9, 0, Math.PI * 1.1, Math.PI * 1.9); g.stroke();
    g.strokeStyle = INK; g.lineWidth = 2.4; g.beginPath(); g.ellipse(x, y, 62, 19, 0, Math.PI, TAU); g.stroke(); };
  const wellBack = g => scaled(g, () => wellBack0(g));
  const wellFront = g => scaled(g, () => wellFront0(g));
  const wellFront0 = g => { const [x, y] = WELL, oc = []; for (let k = 0; k <= 4; k++) { const a = k / 4 * Math.PI; oc.push(x + Math.cos(a) * 62, y + Math.sin(a) * 19); }
    const face = oc.concat([x - 62, y + 56, x - 44, y + 68, x, y + 74, x + 44, y + 68, x + 62, y + 56]); F(g, face, PAPER);
    [[-62, -44], [-44, 0], [0, 44], [44, 62]].forEach(([a, b], k) => { g.save(); XY.path(g, [x + a, y + (k === 0 || k === 3 ? 0 : 14), x + b, y + (k === 1 || k === 2 ? 19 : 14), x + b, y + 70, x + a, y + 66], true); g.clip();
      g.strokeStyle = INK; g.lineWidth = 1; for (let q = 0; q < 6; q++) { g.beginPath(); g.moveTo(x - 70, y + 20 + q * 9); g.lineTo(x + 70, y + 20 + q * 9); g.stroke(); } for (let q = -70; q < 70; q += 10) { g.beginPath(); g.moveTo(x + q + (k % 2) * 5, y + 10); g.lineTo(x + q + (k % 2) * 5, y + 74); g.stroke(); } g.restore(); });
    g.strokeStyle = INK; g.lineWidth = 2.4; g.beginPath(); g.ellipse(x, y, 62, 19, 0, 0, Math.PI); g.stroke(); [-44, 0, 44].forEach(dx => L(g, [x + dx, y + (dx ? 14 : 19), x + dx, y + 70], 2)); };
  const page = (g, W, H) => {
    g.fillStyle = PAPER; g.fillRect(0, 0, W, H);
    // night sky: black block with wood grain and a white moon
    g.fillStyle = INK; g.fillRect(33, 33, W - 66, 270);
    g.strokeStyle = '#2C2622'; g.lineWidth = 1.2; for (let y = 40; y < 300; y += 7) { g.beginPath(); for (let x = 33; x <= W - 33; x += 24) { const yy = y + 2.5 * Math.sin(x / 90 + y / 23) + 1.5 * XY.noise1(x / 40, y); x === 33 ? g.moveTo(x, yy) : g.lineTo(x, yy); } g.stroke(); }
    g.fillStyle = PAPER; g.beginPath(); g.arc(770, 118, 44, 0, TAU); g.fill(); g.strokeStyle = INK; g.lineWidth = 2; g.beginPath(); g.arc(770, 118, 36, 0, TAU); g.stroke();
    // palace hall (left page) and a garden wall with a moon gate (right page)
    roof(g, 130, 470, 206, 62);
    F(g, [610, 300, 1100, 300, 1100, 430, 610, 430], PAPER); F(g, [604, 290, 1106, 290, 1106, 302, 604, 302], INK);
    g.strokeStyle = INK; g.lineWidth = 1; for (let y = 312; y < 430; y += 12) for (let x = 612 + (y / 12 % 2) * 12; x < 1098; x += 24) g.strokeRect(x, y, 24, 12);
    g.beginPath(); g.arc(980, 380, 56, 0, TAU); g.fillStyle = PAPER; g.fill(); g.lineWidth = 3; g.stroke(); g.lineWidth = 1.2; g.beginPath(); g.arc(980, 380, 62, 0, TAU); g.stroke();
    for (let k = 0; k < 5; k++) { g.beginPath(); g.moveTo(940 + k * 18, 436); g.quadraticCurveTo(944 + k * 18, 360, 960 + k * 10, 340); g.stroke(); }
    roof(g, 700, 860, 222, 46);
    // paving: two families of diagonal joints
    g.save(); g.beginPath(); g.rect(33, 430, W - 66, 317); g.clip(); g.strokeStyle = INK; g.lineWidth = 1;
    for (let k = -40; k < 60; k++) { g.beginPath(); g.moveTo(33 + k * 30, 430); g.lineTo(33 + k * 30 - 320, 750); g.stroke(); g.beginPath(); g.moveTo(33 + k * 30, 430); g.lineTo(33 + k * 30 + 320, 750); g.stroke(); }
    g.restore();
    L(g, [33, 430, W - 33, 430], 2.4);
    g.fillStyle = PAPER; g.beginPath(); g.ellipse(WELL[0], WELL[1] + 50, 170, 70, 0, 0, TAU); g.fill();   // the paving is left uncut round the well (white ground sets it off)
    g.strokeStyle = INK; g.lineWidth = 1.4; g.beginPath(); g.ellipse(WELL[0], WELL[1] + 50, 170, 70, 0, Math.PI * 1.05, Math.PI * 1.95); g.stroke();
    rockery(g, 216, 620, 74, 150, 61); rockery(g, 1010, 640, 62, 120, 62); rockery(g, 470, 560, 40, 70, 63);
    // grass tufts carved as short strokes
    const R = XY.rng(2626); g.strokeStyle = INK; g.lineWidth = 1.4; for (let k = 0; k < 40; k++) { const x = 40 + R() * (W - 80), y = 470 + R() * 270; for (let q = -1; q <= 1; q++) { g.beginPath(); g.moveTo(x, y); g.lineTo(x + q * 5, y - 9); g.stroke(); } }
    // 版心 down the fold: two rules, fish-tail marks, title and the 难 number
    g.fillStyle = PAPER; g.fillRect(576, 33, 28, H - 66); L(g, [576, 33, 576, H - 33], 1.6); L(g, [604, 33, 604, H - 33], 1.6);
    [[150, 1], [600, -1]].forEach(([y, s]) => F(g, [576, y, 604, y, 604, y + s * 22, 590, y + s * 12, 576, y + s * 22], INK));
    g.fillStyle = INK; g.font = XY.font(20, XY.cnFont.song, 'bold'); K.vtext(g, '西游记', 590, 52, 20, 1.08);
    g.font = XY.font(24, XY.cnFont.song, 'bold'); K.vtext(g, '第二十六难', 590, 190, 24, 1.06);
    // couplet strips (right first) and the title box
    [[1104, '婴儿问母知邪正'], [34, '金木参玄见假真']].forEach(([x, s]) => { F(g, [x, 33, x + 42, 33, x + 42, 300, x, 300], PAPER); g.fillStyle = INK; g.font = XY.font(28, XY.cnFont.song, 'bold'); K.vtext(g, s, x + 21, 46, 28, 1.2); });
    F(g, [884, 40, 1092, 40, 1092, 112, 884, 112], PAPER); g.strokeStyle = INK; g.lineWidth = 1.2; g.strokeRect(890, 46, 196, 60);
    g.fillStyle = INK; g.font = XY.font(52, XY.cnFont.song, 'bold'); g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('救 主', 988, 78); g.textAlign = 'left'; g.textBaseline = 'alphabetic';
    // 四周双边: thick outer rule, thin inner rule
    g.fillStyle = INK; g.fillRect(16, 16, W - 32, 10); g.fillRect(16, H - 26, W - 32, 10); g.fillRect(16, 16, 10, H - 32); g.fillRect(W - 26, 16, 10, H - 32);
    g.strokeStyle = INK; g.lineWidth = 2; g.strokeRect(31, 31, W - 62, H - 62);
  };
  const king = (g, x, y, rot, awake, standing, bow) => {   // the king of 乌鸡国: 冲天冠, dragon robe, the 定颜珠
    g.save(); g.translate(x, y); g.rotate(rot); g.scale(1.35, 1.35);
    if (!standing) {   // lying across a back: head to the left
      F(g, [-40, -10, 44, -12, 56, 2, 46, 12, -36, 12], g.createPattern(hatchTile(), 'repeat'));
      g.beginPath(); g.arc(18, 0, 9, 0, TAU); g.fillStyle = PAPER; g.fill(); g.stroke(); g.beginPath(); g.moveTo(12, -6); g.lineTo(24, 6); g.moveTo(24, -6); g.lineTo(12, 6); g.stroke();
      F(g, [56, -6, 66, -8, 70, 6, 58, 8], INK);
      g.beginPath(); g.arc(-52, 0, 12, 0, TAU); g.fillStyle = PAPER; g.fill(); g.stroke();
      F(g, [-62, -8, -60, -22, -44, -22, -42, -8], INK); L(g, [-60, -18, -76, -30], 2.4); L(g, [-46, -18, -34, -32], 2.4);
      if (awake) { g.fillStyle = INK; g.beginPath(); g.arc(-56, 2, 1.8, 0, TAU); g.arc(-50, 2, 1.8, 0, TAU); g.fill(); } else L(g, [-58, 2, -54, 3, -48, 2], 1.4);
    } else {
      g.rotate(-0.35 * bow);
      F(g, [-22, 0, 22, 0, 16, -70, -16, -70], g.createPattern(hatchTile(), 'repeat'));
      g.beginPath(); g.arc(0, -40, 9, 0, TAU); g.fillStyle = PAPER; g.fill(); g.stroke(); g.beginPath(); g.moveTo(-6, -46); g.lineTo(6, -34); g.moveTo(6, -46); g.lineTo(-6, -34); g.stroke();
      F(g, [-26, -66, -14, -60, -10, -40, -24, -44], PAPER); F(g, [26, -66, 14, -60, 10, -40, 24, -44], PAPER);
      g.beginPath(); g.arc(0, -84, 12, 0, TAU); g.fillStyle = PAPER; g.fill(); g.stroke();
      F(g, [-10, -94, -8, -108, 8, -108, 10, -94], INK); L(g, [-8, -104, -20, -120], 2.4); L(g, [8, -104, 20, -120], 2.4);
      g.fillStyle = INK; g.beginPath(); g.arc(5, -85, 1.8, 0, TAU); g.fill(); L(g, [-2, -76, 6, -76], 1.4);
    }
    g.restore();
  };
  const banana = (g, t, fall) => {   // the 芭蕉 over the well; knocked over on beat 1.2 it lies to the right
    const bx = 590, by = 648, rot = 0.22 * fall; g.save(); g.translate(bx, by); g.scale(1, 1 - 0.55 * fall); g.rotate(rot);   // it falls to the left and lies in the garden behind
    F(g, [-14, 0, 14, 0, 9, -220, -7, -220], PAPER); g.strokeStyle = INK; g.lineWidth = 1.2; for (let k = 1; k < 9; k++) { g.beginPath(); g.moveTo(-12 + k * 0.6, -k * 24); g.quadraticCurveTo(0, -k * 24 - 8, 11 - k * 0.5, -k * 24); g.stroke(); }
    [[-0.8, 150, 0.6], [-2.2, 160, -0.3], [-1.6, 180, 0.2], [-0.3, 140, 0.8], [-2.8, 130, -0.6], [-1.1, 170, 0.4]].forEach(([a, l, d], k) => bananaLeaf(g, 0, -210, l, a + 0.06 * Math.sin(t * 1.8 + k) * (1 - fall), d));
    g.restore();
  };
  const speckTile = () => XY.keep('mp-speck', 96, 96, cv => { const g = cv.getContext('2d'); for (let k = 0; k < 26; k++) { g.fillStyle = 'rgba(239,230,210,0.8)'; g.beginPath(); g.arc(XY.hash(k, 1) * 96, XY.hash(k, 2) * 96, 0.5 + XY.hash(k, 3) * 1.1, 0, TAU); g.fill(); } });
  const SPOT_B = [560, 692];

  XY.STYLES.mingprint = {
    hits: [2.0, 4.8, 6.4],
    bg(g, W, H, c, scale) {
      page(g, W, H);
      K.paint(g, K.pix(W, H, scale, 3, (x, y) => { const n = XY.fbm(x / 120, y / 90, 26, 3), m = XY.noise2(x / 3, y / 40, 7); const v = 255 * (0.95 + 0.04 * n + 0.015 * m); return [v, v * 0.985, v * 0.95]; }), W, H, 'multiply');
      g.save(); g.fillStyle = g.createPattern(speckTile(), 'repeat'); g.fillRect(0, 0, W, H); g.restore();
      const R = XY.rng(262); for (let k = 0; k < 7; k++) { const x = 60 + R() * (W - 120), y = 60 + R() * (H - 120); g.fillStyle = 'rgba(120,80,40,0.35)'; g.beginPath(); g.ellipse(x, y, 3 + R() * 3, 2 + R() * 2, R() * 3, 0, TAU); g.fill(); g.fillStyle = 'rgba(40,28,18,0.7)'; g.beginPath(); g.arc(x, y, 1.4, 0, TAU); g.fill(); }
    },
    draw(g, e) {
      const { W, H, t, u } = e, b = e.beat;
      const acts = { monk: { palm: K.bump(b, 4.8, 5.1, 6.4, 6.9) }, shaseng: { lift: K.bump(b, 4.8, 4.95, 5.3, 5.6) }, wukong: { shade: K.bump(b, 3.6, 3.9, 4.4, 4.7) },
        bajie: { scratch: K.bump(b, 6.8, 7.0, 7.6, 7.9) } };
      K.push(g, e, WELL[0] + 40, WELL[1] - 90, K.pushOf(b, 4.2, 4.8, 6.2, 0.16));
      // ---- night: stars, clouds over the moon, a crow on the ridge
      g.save(); g.beginPath(); g.rect(76, 33, 500, 270); g.rect(604, 33, 500, 270); g.clip();
      for (let k = 0; k < 22; k++) { const x = 90 + XY.hash(k, 11) * (W - 180), y = 50 + XY.hash(k, 12) * 150, tw = Math.sin(t * (1.5 + XY.hash(k, 13) * 2) + k); if (tw < -0.3 || (x > 880 && y < 120)) continue;
        const s = 3 + 3 * tw; g.strokeStyle = PAPER; g.lineWidth = 1.6; g.beginPath(); g.moveTo(x - s, y); g.lineTo(x + s, y); g.moveTo(x, y - s); g.lineTo(x, y + s); g.stroke(); }
      cloud(g, 560 + ((t * 26) % 700), 128, 0.9); cloud(g, 120 + ((t * 18 + 300) % 760), 70, 0.7);
      g.restore();
      { const fl = Math.max(0, Math.sin(t * 1.1)) > 0.9, x = 300, y = 196; g.fillStyle = INK; g.beginPath(); g.ellipse(x, y, 11, 6, 0, 0, TAU); g.fill(); g.beginPath(); g.arc(x + 10, y - 5, 4.5, 0, TAU); g.fill();
        g.beginPath(); g.moveTo(x + 14, y - 5); g.lineTo(x + 21, y - 3); g.lineTo(x + 14, y - 2); g.fill(); g.beginPath(); g.moveTo(x - 4, y - 2); g.lineTo(x - 22, fl ? y - 22 : y - 4); g.lineTo(x + 4, y - 4); g.fill(); }
      // ---- 八戒's path: to the tree, swing, down the well on the rope, up with the king, back into line
      const hB = K.home(e, 'bajie'), fall = XY.easeIn(XY.clamp((b - 1.95) / 0.35));
      let bx = hB[0], by = hB[1], br = 0, bin = false, carry = b > 4.5 && b < 6.4;
      if (b > 1.0 && b <= 2.4) { const f = XY.smooth((b - 1.0) / 0.5); bx = XY.lerp(hB[0], SPOT_B[0], f); by = XY.lerp(hB[1], SPOT_B[1], f); br = 0.45 * K.bump(b, 1.8, 1.95, 2.0, 2.2); }
      else if (b > 2.4 && b <= 4.5) { const f = XY.smooth((b - 2.4) / 0.2); bx = XY.lerp(SPOT_B[0], WELL[0], f); by = XY.lerp(SPOT_B[1], 650, f) + 220 * XY.easeIn(XY.clamp((b - 2.7) / 0.7)); bin = true; }
      else if (b > 4.5 && b <= 5.3) { if (b < 4.85) { bx = WELL[0]; by = XY.lerp(870, 628, K.back((b - 4.55) / 0.25, 2)); bin = true; } else { const f = XY.smooth((b - 4.85) / 0.45); bx = XY.lerp(WELL[0], hB[0], f); by = XY.lerp(628, 702, f) - 50 * Math.sin(f * Math.PI); } }
      else if (b > 5.3 && b < 6.4) { bx = hB[0]; by = 702; }
      const solo = b > 1.0 && b < 6.4, wB = bin ? XY.walkPhase(e.cell.t0 + 2.4 * XY.BEAT) : e.phase;
      // ---- the well, the tree, 八戒 (clipped while inside), the rope from 悟空's hand
      wellBack(g);
      if (b > 3.2 && b < 4.5) for (let k = 0; k < 3; k++) { const r = ((t * 1.2 + k / 3) % 1); g.strokeStyle = `rgba(239,230,210,${1 - r})`; g.lineWidth = 1.4; g.beginPath(); g.ellipse(WELL[0], WELL[1], 10 + 64 * r, 3 + 16 * r, 0, 0, TAU); g.stroke(); }
      const pen = penFor(g), drawB = () => { const pBelly = K.figPoint(e, acts, 'bajie', 'chest', bx, by, { rot: br, w: wB });
        K.fig(g, e, acts, 'bajie', pen, bx, by, { rot: br, w: wB });
        if (carry) king(g, pBelly[0] - 10, pBelly[1] - 40, -0.08 + 0.04 * Math.sin(t * 8), b > 6.0, false, 0); };
      if (bin) { g.save(); g.beginPath(); g.rect(0, 0, W, WELL[1]); g.ellipse(WELL[0], WELL[1], 54 * WS, 15 * WS, 0, 0, TAU); g.clip(); drawB(); g.restore(); }
      wellFront(g);
      if (b > 2.4 && b < 4.8) { const hand = e.at('wukong.handFar', acts), end = bin && by < 700 ? K.figPoint(e, acts, 'bajie', 'head', bx, by, { w: wB }) : [WELL[0], WELL[1]];
        g.strokeStyle = INK; g.lineWidth = 2.4; g.beginPath(); g.moveTo(hand[0], hand[1]); g.quadraticCurveTo((hand[0] + end[0]) / 2, Math.max(hand[1], end[1]) + 20, end[0], end[1] - 10); g.stroke(); }
      banana(g, t, fall);
      // ---- the procession (八戒 drawn on his own path while he is away) with uneven inking
      XY.drawProcession(g, e.phase, e.procX, e.groundY, pen, solo ? K.cast(acts, { bajie: false }) : acts);
      if (solo && !bin) drawB();
      // the splash and the pearl's rays when he bursts out on beat 3
      const sp = b - 4.7; if (sp > 0 && sp < 0.7) { const a = 1 - sp / 0.7; g.strokeStyle = INK; g.lineWidth = 2;
        for (let k = 0; k < 13; k++) { const ang = Math.PI * (1.05 + k * 0.075), r0 = 50 + 130 * sp, x0 = WELL[0] + Math.cos(ang) * r0, y0 = WELL[1] + Math.sin(ang) * r0 * 0.9;
          g.fillStyle = PAPER; g.beginPath(); g.ellipse(x0, y0 + 90 * sp * sp, 6 * a + 1.5, 9 * a + 1.5, ang, 0, TAU); g.fill(); g.stroke(); } }
      if (carry) { const pc = K.figPoint(e, acts, 'bajie', 'chest', bx, by, { rot: br, w: wB }), mx = pc[0] - 84, my = pc[1] - 42, a = b < 5.6 ? 1 : 0.5;
        g.strokeStyle = INK; g.lineWidth = 1.4; for (let k = 0; k < 10; k++) { const ang = k / 10 * TAU + t; g.globalAlpha = a; g.beginPath(); g.moveTo(mx + Math.cos(ang) * 10, my + Math.sin(ang) * 10); g.lineTo(mx + Math.cos(ang) * (18 + 4 * Math.sin(t * 9 + k)), my + Math.sin(ang) * (18 + 4 * Math.sin(t * 9 + k))); g.stroke(); } g.globalAlpha = 1; }
      // ---- revived, the king climbs down and bows to the monk by the well
      if (b >= 6.4) { const f = XY.smooth((b - 6.4) / 0.35); king(g, XY.lerp(K.home(e, 'bajie')[0] - 10, 420, f), XY.lerp(650, 702, f), 0, true, true, f * (0.5 + 0.5 * Math.sin(t * 2.6))); }
      // ---- entry: the brush rubs the print onto the sheet, right to left
      const bf = XY.lerp(W + 60, -90, XY.smooth((u + 0.42) / 0.3));
      if (bf > -80) { g.fillStyle = PAPER; g.fillRect(0, 0, Math.max(0, bf), H);
        const yy = 390 + 200 * Math.sin(t * 9); g.save(); g.translate(bf, yy); g.rotate(-0.2); g.fillStyle = '#5A3A22'; g.fillRect(-26, -110, 52, 220); g.strokeStyle = '#2A1A10'; g.lineWidth = 1;
          for (let k = -24; k < 26; k += 4) { g.beginPath(); g.moveTo(k, -110); g.lineTo(k + 2, 110); g.stroke(); } g.fillStyle = '#8A5A34'; g.fillRect(-34, -16, 68, 32); g.restore(); }
    },
    post(canvas, g) { g.save(); g.globalCompositeOperation = 'source-atop'; g.fillStyle = g.createPattern(speckTile(), 'repeat'); g.globalAlpha = 0.35; g.fillRect(0, 0, canvas.width, canvas.height); g.restore(); },
  };
})();
