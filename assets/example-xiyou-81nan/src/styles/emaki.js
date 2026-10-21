// 19 日本绘卷 · 1130 年 · 难活人参 — a handscroll unrolls right to left (the way an emaki is read). In the 五庄观
// garden 悟空 shoves the 人参果树 over (beat 1, the fruits sink into the earth), 观音 descends on a raigō cloud and
// flicks sweet dew from her willow sprig (beat 2): the tree springs upright and baby-shaped fruits pop out; one drops
// straight into 八戒's mouth (beat 3) and he gulps it whole. 清风明月 stamp in the roofless (吹抜屋台) hall,
// gold suyari-gasumi mist bands drift between the scenes, a 詞書 text section on gold-flecked paper opens the cell.
(() => {
  'use strict';
  const XY = window.XY, K = XY.KIT_C, TAU = XY.TAU;
  const INK = '#2B2118', GOLD = '#C9A458', MIST = 'rgba(214,180,104,0.86)', MISTLINE = '#A98642';
  const COL = { fur: '#8E6A46', face: '#F0DEC2', wkshirt: '#C2553C', tiger: '#D8A64C', stripe: INK, gold: '#C9A24A', staff: '#A8402E', ink: INK,
    horse: '#F4EFE3', horse2: '#DCD3C1', mane: '#E8E1D0', hoof: '#4A3E30', saddle: '#7A3A28', red: '#B4442E', robe: '#D8BC74', kasaya: '#B23C2C',
    skin: '#F1DCC0', metal: '#B39A5C', bjrobe: '#454A58', bjpants: '#3A3E4A', pig: '#ECC4B4', pig2: '#D9A28F', wood: '#8A6440', ssrobe: '#5E726B', ssrobe2: '#4C5D58',
    skin2: '#C79E79', ssh: '#A84A30', ssbeard: '#94402A', skull: '#EFE7D5', bundle: '#C8A052' };
  const PEN = { color: r => COL[r] || XY.DEFAULT_COLORS[r], outline: INK, ow: 1.25, wob: 0.7, seed: 19, shade: 'rgba(70,45,20,0.13)' };
  const TREE = [640, 644], GY = 702, KH = 470;   // KH: bottom of the 詞書 column, kept above the pilgrims' heads
  const OB = [0.62, -0.42];   // oblique projection for the hall: one unit of depth moves up-right

  // ------------------------------------------------------------ shapes
  const cap = (g, x, y, w, h) => { const r = h / 2; g.moveTo(x + r, y - r); g.lineTo(x + w - r, y - r); g.arc(x + w - r, y, r, -Math.PI / 2, Math.PI / 2); g.lineTo(x + r, y + r); g.arc(x + r, y, r, Math.PI / 2, Math.PI * 1.5); g.closePath(); };
  // suyari-gasumi: a long band with stepped lobes at both ends; union outline = stroke all, then fill all
  const mistPath = (g, x, y, w, h) => { g.beginPath(); cap(g, x, y, w, h); cap(g, x - h * 0.9, y - h * 0.42, w * 0.34, h * 0.62); cap(g, x + w * 0.7, y + h * 0.4, w * 0.36 + h, h * 0.6); };
  const mist = (g, x, y, w, h, seed, flick = 0) => {
    mistPath(g, x, y, w, h); g.strokeStyle = MISTLINE; g.lineWidth = 2.4; g.stroke(); g.fillStyle = MIST; g.fill();
    const R = XY.rng(seed); g.fillStyle = '#E9CF84';
    for (let k = 0; k < Math.floor(w / 9); k++) { const fx = x + R() * w, fy = y + (R() - 0.5) * h * 0.7, s = 1.2 + R() * 3.2, on = Math.sin(flick * 3 + k * 1.7) > 0.7;
      g.globalAlpha = on ? 1 : 0.55; g.fillStyle = on ? '#FFF1BE' : '#E7C878'; g.fillRect(fx, fy, s, s * (0.6 + R())); }
    g.globalAlpha = 1;
  };
  // an emaki pine: red-brown crooked trunk, flat ink-green needle pads
  const pine = (g, x, y, s, seed) => {
    const R = XY.rng(seed); g.strokeStyle = '#6E4630'; g.lineWidth = 4 * s; g.beginPath(); g.moveTo(x, y);
    let px = x, py = y; for (let k = 0; k < 4; k++) { px += (R() - 0.4) * 16 * s; py -= 22 * s; g.lineTo(px, py); } g.stroke();
    for (let k = 0; k < 5; k++) { const cx = px + (R() - 0.5) * 50 * s, cy = py + k * 12 * s - 10 * s, rx = (18 + R() * 14) * s;
      g.fillStyle = k % 2 ? '#56704E' : '#4A6345'; g.beginPath(); g.ellipse(cx, cy, rx, rx * 0.36, (R() - 0.5) * 0.3, 0, TAU); g.fill();
      g.strokeStyle = 'rgba(30,40,25,0.6)'; g.lineWidth = 0.8; g.stroke(); }
  };
  // 人参果: a newborn-shaped fruit hanging by its stem (pivot at the stem top)
  const baby = (g, x, y, s, rot, kick) => {
    g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s);
    g.strokeStyle = '#5A6B3A'; g.lineWidth = 1.2; g.beginPath(); g.moveTo(0, -4); g.lineTo(0, 2); g.stroke();
    g.fillStyle = '#F1E4BC'; g.strokeStyle = INK; g.lineWidth = 0.9;
    g.beginPath(); g.ellipse(0, 7, 5.2, 5, 0, 0, TAU); g.fill(); g.stroke();
    g.beginPath(); g.ellipse(0, 17, 5.6, 7, 0, 0, TAU); g.fill(); g.stroke();
    g.lineWidth = 2.2; g.strokeStyle = '#E6D29E';
    [[-4, 13, -9, 9 - 3 * kick], [4, 13, 9, 9 + 3 * kick], [-2, 23, -4, 30 + 2 * kick], [2, 23, 5, 30 - 2 * kick]].forEach(l => { g.beginPath(); g.moveTo(l[0], l[1]); g.lineTo(l[2], l[3]); g.stroke(); });
    g.strokeStyle = INK; g.lineWidth = 0.7; g.beginPath(); g.moveTo(-2.6, 7); g.lineTo(-1, 7); g.moveTo(1, 7); g.lineTo(2.6, 7); g.stroke();
    g.restore();
  };

  // ------------------------------------------------------------ the ginseng tree (local: root at 0,0, up = −y)
  const R0 = XY.rng(1919);
  const BR = [[0, 0, -6, -96, 15], [-6, -96, 4, -190, 12], [4, -190, -2, -276, 9], [-2, -276, 6, -350, 6],
    [-4, -140, -96, -216, 7], [-96, -216, -150, -232, 4], [2, -150, 104, -206, 7], [104, -206, 150, -236, 4],
    [3, -228, -92, -300, 5], [-92, -300, -124, -322, 3], [1, -236, 98, -300, 5], [98, -300, 130, -312, 3], [0, -296, -46, -352, 3.5], [3, -300, 52, -360, 3.5]];
  const LEAVES = []; BR.slice(4).forEach((b, i) => { for (let k = 0; k < 6; k++) { const f = 0.25 + k * 0.17; LEAVES.push([XY.lerp(b[0], b[2], f) + (R0() - 0.5) * 34, XY.lerp(b[1], b[3], f) - 8 + (R0() - 0.5) * 34, (R0() - 0.5) * 2.8 - 1.2, 24 + R0() * 16, i * 6 + k]); } });
  const FRUIT = [[-120, -222], [-70, -200], [120, -222], [70, -196], [-104, -306], [-50, -276], [104, -296], [48, -280], [-30, -340], [30, -346], [140, -232], [-140, -228]];
  const DROP = 1;   // the fruit that falls into 八戒's mouth
  const rotP = (p, a, sq = 1) => [TREE[0] + p[0] * Math.cos(a) - p[1] * Math.sin(a), TREE[1] + sq * (p[0] * Math.sin(a) + p[1] * Math.cos(a))];   // sq: the fallen tree lies back into the garden

  // ------------------------------------------------------------ static scroll
  const paper = (W, H, scale) => K.pix(W, H, scale, 4, (x, y) => {
    const n = XY.fbm(x / 210, y / 160, 3, 4), m = XY.fbm(x / 34, y / 30, 5, 2), edge = Math.min(y, H - y) < 40 ? (40 - Math.min(y, H - y)) / 40 : 0;
    const v = 1 + 0.05 * n + 0.025 * m - 0.07 * edge;
    return [234 * v, 220 * v, 190 * v - 6 * n];
  });
  const hall = g => {   // 吹抜屋台: a roofless hall seen from above at a slant
    const X = 36, Y = 600, w = 300, d = 190, P = (x, z, h = 0) => [X + x + OB[0] * z, Y + OB[1] * z - h];
    const quad = (a, b, c, dd, fill) => { g.beginPath(); g.moveTo(...a); g.lineTo(...b); g.lineTo(...c); g.lineTo(...dd); g.closePath(); g.fillStyle = fill; g.fill(); g.strokeStyle = INK; g.lineWidth = 1.1; g.stroke(); };
    quad(P(0, 0), P(w, 0), P(w, d), P(0, d), '#D9C69B');                                          // plank floor
    g.strokeStyle = 'rgba(90,60,30,0.35)'; g.lineWidth = 0.8; for (let k = 1; k < 12; k++) { g.beginPath(); g.moveTo(...P(0, d * k / 12)); g.lineTo(...P(w, d * k / 12)); g.stroke(); }
    quad(P(0, d), P(w, d), P(w, d, 150), P(0, d, 150), '#EDE3CC');                               // back wall: painted sliding doors
    for (let k = 0; k < 4; k++) { const a = P(w * k / 4 + 6, d, 14), b = P(w * (k + 1) / 4 - 6, d, 136); g.strokeStyle = '#7A5A3A'; g.lineWidth = 1.4; g.strokeRect(a[0], b[1], b[0] - a[0], a[1] - b[1]);
      g.strokeStyle = 'rgba(70,90,70,0.55)'; g.lineWidth = 1.2; g.beginPath(); g.moveTo(a[0] + 4, a[1] - 30); g.quadraticCurveTo(a[0] + 22, a[1] - 70 - k * 6, b[0] - 4, a[1] - 40); g.stroke(); }
    [[0, 0], [w, 0], [0, d], [w, d], [w / 2, d]].forEach(([x, z]) => { const a = P(x, z), b = P(x, z, 170); g.strokeStyle = INK; g.lineWidth = 7; g.beginPath(); g.moveTo(...a); g.lineTo(...b); g.stroke(); g.strokeStyle = '#C2462E'; g.lineWidth = 5; g.stroke(); });
    [0, d].forEach(z => { const a = P(-10, z, 170), b = P(w + 10, z, 170); g.strokeStyle = INK; g.lineWidth = 8; g.beginPath(); g.moveTo(...a); g.lineTo(...b); g.stroke(); g.strokeStyle = '#C2462E'; g.lineWidth = 6; g.stroke(); });
    // roof only over the back: cypress-bark eave strip, the rest is "blown off"
    quad(P(-24, d - 10, 170), P(w + 24, d - 10, 170), P(w + 34, d + 40, 196), P(-14, d + 40, 196), '#6B5040');
    g.strokeStyle = 'rgba(30,20,12,0.5)'; g.lineWidth = 0.7; for (let k = 0; k < 30; k++) { const a = P(-20 + k * 11.5, d - 10, 170), b = P(-10 + k * 11.5, d + 40, 196); g.beginPath(); g.moveTo(...a); g.lineTo(...b); g.stroke(); }
    // front veranda railing (高欄)
    const r0 = P(-8, -8, 0), r1 = P(w + 8, -8, 0); g.strokeStyle = INK; g.lineWidth = 2; g.beginPath(); g.moveTo(r0[0], r0[1] - 26); g.lineTo(r1[0], r1[1] - 26); g.moveTo(r0[0], r0[1] - 12); g.lineTo(r1[0], r1[1] - 12); g.stroke();
    g.strokeStyle = '#B4442E'; g.lineWidth = 1.2; g.beginPath(); g.moveTo(r0[0], r0[1] - 26); g.lineTo(r1[0], r1[1] - 26); g.stroke();
    for (let k = 0; k <= 10; k++) { const x = XY.lerp(r0[0], r1[0], k / 10); g.strokeStyle = INK; g.lineWidth = 1.6; g.beginPath(); g.moveTo(x, r0[1]); g.lineTo(x, r0[1] - 28); g.stroke(); }
    g.fillStyle = '#E6D7B4'; g.strokeStyle = INK; g.lineWidth = 1; g.fillRect(...P(-14, -18), w + 28, 12); g.strokeRect(...P(-14, -18), w + 28, 12);
  };
  const KOTO = 994;   // the 詞書 text section starts here
  const koto = (g, W, H) => {
    g.fillStyle = '#DCDDC6'; g.fillRect(KOTO, 14, W - KOTO, KH - 14);
    const R = XY.rng(77);
    for (let k = 0; k < 110; k++) { const x = KOTO + R() * (W - KOTO), y = 20 + R() * (KH - 40), s = 2 + R() * 9; g.fillStyle = R() < 0.75 ? `rgba(206,170,84,${0.5 + R() * 0.5})` : 'rgba(200,200,196,0.8)'; g.fillRect(x, y, s, s * (0.5 + R() * 0.8)); }
    for (let k = 0; k < 10; k++) { const x = KOTO + R() * (W - KOTO), y = 20 + R() * (KH - 40); g.strokeStyle = 'rgba(196,160,80,0.8)'; g.lineWidth = 1.2; g.beginPath(); g.moveTo(x, y); g.lineTo(x + 12 + R() * 30, y + (R() - 0.5) * 6); g.stroke(); }
    // mica arabesque printed into the paper (karakami)
    g.strokeStyle = 'rgba(255,255,245,0.35)'; g.lineWidth = 1.4;
    for (let y = 40; y < KH - 20; y += 64) for (let x = KOTO + 20; x < W; x += 64) { g.beginPath(); g.arc(x + (y / 64 % 2) * 32, y, 16, 0.3, 2.8); g.stroke(); g.beginPath(); g.arc(x + (y / 64 % 2) * 32, y + 8, 7, 3.4, 6); g.stroke(); }
    g.strokeStyle = 'rgba(60,40,20,0.55)'; g.lineWidth = 1.2; g.beginPath(); g.moveTo(KOTO, 14); g.lineTo(KOTO, KH); g.lineTo(W, KH); g.stroke();
    g.fillStyle = INK;
    g.font = XY.font(27, '"Hiragino Mincho ProN", "Songti SC", serif', '600'); K.vtext(g, '第十九難', 1150, 56, 27, 1.12);
    g.fillStyle = '#1E1610'; g.font = XY.font(62, XY.cnFont.xing); K.vtext(g, '人参', 1104, 52, 62, 1.0);
    g.globalAlpha = 0.78; g.font = XY.font(19, '"Hiragino Mincho ProN", serif');
    K.vtext(g, '三千年一开花三千年一结果', 1050, 64, 19, 1.06);
    K.vtext(g, '行者推倒宝树菩萨甘露医活', 1022, 64, 19, 1.06);
    g.globalAlpha = 1;
  };

  // ------------------------------------------------------------ animated pieces
  const boy = (g, x, y, hop, arms, flip, robe) => {   // 清風・明月: small acolytes with twin hair loops
    y -= hop; g.save(); g.translate(x, y); g.scale(flip, 1); g.strokeStyle = INK; g.lineWidth = 1;
    g.fillStyle = robe; g.beginPath(); g.moveTo(-9, 0); g.lineTo(9, 0); g.lineTo(6, -26); g.lineTo(-6, -26); g.closePath(); g.fill(); g.stroke();
    g.lineWidth = 2.2; g.strokeStyle = robe; const a = arms; g.beginPath(); g.moveTo(-5, -22); g.lineTo(-12 - 4 * Math.cos(a), -22 - 12 * Math.sin(a)); g.moveTo(5, -22); g.lineTo(12 + 4 * Math.cos(a), -22 - 12 * Math.sin(a)); g.stroke();
    g.fillStyle = '#F1DCC0'; g.strokeStyle = INK; g.lineWidth = 0.9; g.beginPath(); g.arc(0, -32, 6.5, 0, TAU); g.fill(); g.stroke();
    g.fillStyle = INK; [-6, 6].forEach(s => { g.beginPath(); g.arc(s, -38, 3, 0, TAU); g.fill(); });
    g.beginPath(); g.moveTo(1, -32); g.lineTo(4, -32); g.stroke(); g.restore();
  };
  const raigo = (g, x, y, t, flick) => {   // 観音 on a descending cloud, white robe, vase and willow sprig
    g.save(); g.translate(x, y);
    // cloud: puffy head, long tail trailing up-right (she comes down from there)
    g.fillStyle = '#F7F2E6'; g.strokeStyle = INK; g.lineWidth = 1.2;
    g.beginPath(); g.moveTo(-58, 8); for (let k = 0; k <= 6; k++) { const a = Math.PI + k / 6 * Math.PI; g.arc(-48 + k * 16, 4 + 4 * Math.sin(k + t * 2), 12, a - 0.6, a + 0.9); }
    g.quadraticCurveTo(90, -6, 128 + 6 * Math.sin(t * 1.3), -78); g.quadraticCurveTo(84, 8, 44, 22); g.quadraticCurveTo(0, 30, -58, 8); g.closePath(); g.fill(); g.stroke();
    g.strokeStyle = 'rgba(43,33,24,0.45)'; g.lineWidth = 0.8; for (let k = 0; k < 3; k++) { g.beginPath(); g.arc(-30 + k * 26, 8, 8, Math.PI * 1.1, Math.PI * 1.9); g.stroke(); }
    // halo
    g.fillStyle = 'rgba(232,206,130,0.45)'; g.beginPath(); g.arc(2, -96, 24, 0, TAU); g.fill(); g.strokeStyle = GOLD; g.lineWidth = 2; g.stroke();
    // robe body
    g.fillStyle = '#FBF8F0'; g.strokeStyle = INK; g.lineWidth = 1.2;
    g.beginPath(); g.moveTo(-20, 0); g.quadraticCurveTo(-24, -50, -12, -78); g.quadraticCurveTo(0, -112, 13, -80); g.quadraticCurveTo(24, -48, 22, 0); g.closePath(); g.fill(); g.stroke();
    g.lineWidth = 0.8; [[-12, -10, -6, -60], [0, -4, 2, -64], [12, -8, 8, -56]].forEach(l => { g.beginPath(); g.moveTo(l[0], l[1]); g.quadraticCurveTo(l[0] + 4, (l[1] + l[3]) / 2, l[2], l[3]); g.stroke(); });
    // scarf (披帛) fluttering
    g.strokeStyle = '#C2553C'; g.lineWidth = 2; g.beginPath(); g.moveTo(-14, -66); g.bezierCurveTo(-40, -50, -36 + 6 * Math.sin(t * 2.4), -20, -52 + 8 * Math.sin(t * 2.1), 6); g.stroke();
    g.beginPath(); g.moveTo(14, -66); g.bezierCurveTo(36, -46, 30 + 6 * Math.sin(t * 2.2 + 1), -16, 44 + 8 * Math.sin(t * 1.9 + 2), 10); g.stroke();
    // head with veil
    g.fillStyle = '#F4E2C6'; g.strokeStyle = INK; g.lineWidth = 1; g.beginPath(); g.ellipse(2, -92, 8, 9.5, 0, 0, TAU); g.fill(); g.stroke();
    g.fillStyle = '#FBF8F0'; g.beginPath(); g.moveTo(-10, -84); g.quadraticCurveTo(-8, -110, 4, -108); g.quadraticCurveTo(16, -106, 14, -84); g.quadraticCurveTo(10, -102, 2, -103); g.quadraticCurveTo(-6, -102, -10, -84); g.fill(); g.stroke();
    g.beginPath(); g.moveTo(-1, -92); g.lineTo(2, -92); g.moveTo(5, -92); g.lineTo(8, -92); g.stroke();
    // vase (浄瓶) in the left hand, willow sprig flicked by the right
    g.fillStyle = '#9DB59A'; g.beginPath(); g.ellipse(-18, -48, 6, 8, 0, 0, TAU); g.fill(); g.stroke(); g.fillRect(-19.5, -64, 3, 10); g.strokeRect(-19.5, -64, 3, 10);
    const wa = -0.5 - 1.3 * flick, wx = 20 + Math.cos(wa) * 34, wy = -60 + Math.sin(wa) * 34;
    g.strokeStyle = '#5E7444'; g.lineWidth = 1.3; g.beginPath(); g.moveTo(16, -60); g.quadraticCurveTo(26, -62 - 20 * flick, wx, wy); g.stroke();
    for (let k = 0; k < 7; k++) { const f = 0.3 + k * 0.1, lx = XY.lerp(16, wx, f), ly = XY.lerp(-60, wy, f) + 4 + 2 * Math.sin(t * 3 + k); g.fillStyle = '#7B9356'; g.beginPath(); g.ellipse(lx, ly + 4, 1.4, 5, 0.2 + 0.4 * flick, 0, TAU); g.fill(); }
    g.restore();
    return [x + wx, y + wy];
  };
  const coverTile = () => XY.keep('emk-cover', 48, 48, cv => { const g = cv.getContext('2d'); g.fillStyle = '#4F6D78'; g.fillRect(0, 0, 48, 48);
    g.strokeStyle = 'rgba(214,184,110,0.75)'; g.lineWidth = 1.2; [[12, 12], [36, 36]].forEach(([x, y]) => { for (let k = 0; k < 4; k++) { g.beginPath(); g.ellipse(x, y, 6, 2.4, k * Math.PI / 4, 0, TAU); g.stroke(); } }); });
  const fibreTile = () => XY.keep('emk-fib', 256, 256, cv => { const g = cv.getContext('2d'); K.fibres(g, 0, 0, 256, 256, 520, 9, ['rgba(120,90,50,0.22)', 'rgba(255,250,236,0.35)'], [3, 10], [0.4, 0.9]); });

  XY.STYLES.emaki = {
    hits: [1.8, 4.4, 5.6],
    bg(g, W, H, c, scale) {
      K.paint(g, paper(W, H, scale), W, H);
      K.fibres(g, 0, 0, W, H, 2400, 191, ['rgba(140,110,70,0.10)', 'rgba(255,250,236,0.30)'], [3, 12], [0.4, 1]);
      g.fillStyle = 'rgba(110,80,44,0.30)'; g.fillRect(0, 0, W, 5); g.fillRect(0, H - 5, W, 5);
      // roll creases and the paper joins (紙継ぎ) of a handscroll
      for (let x = 70; x < W; x += 150 + 30 * XY.hash(x, 3)) { g.strokeStyle = 'rgba(120,96,60,0.10)'; g.lineWidth = 2; g.beginPath(); g.moveTo(x, 6); g.lineTo(x + 2, H - 6); g.stroke(); g.strokeStyle = 'rgba(255,250,236,0.25)'; g.lineWidth = 1; g.beginPath(); g.moveTo(x + 2, 6); g.lineTo(x + 4, H - 6); g.stroke(); }
      [380, 760].forEach(x => { g.fillStyle = 'rgba(120,90,50,0.07)'; g.fillRect(x, 0, 6, H); g.strokeStyle = 'rgba(110,80,44,0.28)'; g.lineWidth = 0.8; g.beginPath(); g.moveTo(x, 0); g.lineTo(x, H); g.stroke(); });
      // far hills with pines, washed out toward their foot
      [[300, 470, 230, 110], [520, 452, 280, 150], [760, 470, 250, 100], [930, 462, 190, 120]].forEach(([cx, base, w, h], i) => {
        const gr = g.createLinearGradient(0, base - h, 0, base); gr.addColorStop(0, 'rgba(112,140,110,0.42)'); gr.addColorStop(1, 'rgba(112,140,110,0)');
        g.fillStyle = gr; g.beginPath(); g.moveTo(cx - w, base); g.bezierCurveTo(cx - w * 0.5, base - h * 1.1, cx + w * 0.3, base - h * 1.25, cx + w, base); g.fill();
        g.strokeStyle = 'rgba(43,33,24,0.55)'; g.lineWidth = 1.1; g.beginPath(); g.moveTo(cx - w * 0.8, base - h * 0.32); g.bezierCurveTo(cx - w * 0.45, base - h * 0.95, cx + w * 0.25, base - h * 1.02, cx + w * 0.7, base - h * 0.38); g.stroke();
        for (let k = 0; k < 3; k++) pine(g, cx - w * 0.3 + k * w * 0.28, base - h * (0.62 + 0.14 * Math.sin(k * 2 + i)), 0.55, i * 10 + k);
      });
      mist(g, 260, 452, 620, 30, 5);
      // 築地塀: plastered garden wall with a tiled cap, behind the tree
      g.fillStyle = '#EEE6D2'; g.fillRect(420, 566, 600, 48); g.strokeStyle = INK; g.lineWidth = 1; g.strokeRect(420, 566, 600, 48);
      g.strokeStyle = 'rgba(200,190,170,1)'; g.lineWidth = 1.4; [578, 590, 602].forEach(y => { g.beginPath(); g.moveTo(420, y); g.lineTo(1020, y); g.stroke(); });
      g.fillStyle = '#5B5249'; g.beginPath(); g.moveTo(412, 568); g.lineTo(1028, 568); g.lineTo(1018, 552); g.lineTo(424, 552); g.closePath(); g.fill(); g.stroke();
      g.strokeStyle = 'rgba(230,220,200,0.35)'; g.lineWidth = 0.8; for (let x = 428; x < 1018; x += 9) { g.beginPath(); g.moveTo(x, 553); g.lineTo(x - 2, 567); g.stroke(); }
      hall(g);
      mist(g, -40, 330, 300, 34, 6);
      // ground: washed earth banks, contour strokes, grass tufts
      g.fillStyle = 'rgba(176,170,112,0.30)'; g.beginPath(); g.moveTo(0, 640); for (let x = 0; x <= W; x += 40) g.lineTo(x, 626 + 10 * Math.sin(x / 90) + 6 * Math.sin(x / 31)); g.lineTo(W, H - 14); g.lineTo(0, H - 14); g.fill();
      const R = XY.rng(4040);
      for (let k = 0; k < 26; k++) { const x = R() * W, y = 650 + R() * 100, l = 30 + R() * 60; g.strokeStyle = 'rgba(70,52,30,0.55)'; g.lineWidth = 0.9 + R() * 0.8; g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + l * 0.5, y - 8 - R() * 8, x + l, y + 2); g.stroke(); }
      for (let k = 0; k < 70; k++) { const x = R() * W, y = 640 + R() * 115; g.strokeStyle = R() < 0.5 ? '#6E8A4E' : '#5A7542'; g.lineWidth = 1.1;
        for (let j = 0; j < 4; j++) { g.beginPath(); g.moveTo(x + j * 2.4, y); g.quadraticCurveTo(x + j * 2.4 + 2, y - 6, x + j * 3.6 - 3 + R() * 6, y - 9 - R() * 6); g.stroke(); } }
      // stream in the foreground (流水文)
      g.fillStyle = 'rgba(176,196,190,0.55)'; g.beginPath(); g.moveTo(600, 728); g.bezierCurveTo(720, 712, 860, 740, 1010, 722); g.lineTo(1010, 756); g.bezierCurveTo(860, 770, 720, 744, 600, 760); g.fill();
      koto(g, W, H);
    },
    draw(g, e) {
      const { W, t, u } = e, b = e.beat;
      const acts = { wukong: { strike: K.bump(b, 1.4, 1.8, 1.95, 2.3), shade: K.bump(b, 2.8, 3.2, 4.4, 4.9) }, monk: { palm: K.bump(b, 3.2, 3.6, 4.6, 5.2) },
        bajie: { scratch: K.bump(b, 5.8, 6.1, 7.2, 7.8) }, shaseng: { lift: 0.7 * K.bump(b, 1.9, 2.1, 2.6, 3.0) } };
      // ---- push in on 八戒 as the fruit drops into his mouth (back to 1 by beat 6.6, u 0.83)
      { const t5 = e.cell.t0 + 5.6 * XY.BEAT, a = XY.anchor('bajie.head', XY.walkPhase(t5), acts); K.push(g, e, XY.procWorldX(t5) - e.cell.x + a[0] + 20, e.groundY + a[1] - 40, K.pushOf(b, 5.0, 5.5, 6.6, 0.14)); }
      // ---- tree state: shoved over on beat 1.85 — it falls straight away from us into the garden (foreshortened), clear of the path — revived on 4.4
      const fall = XY.easeIn(XY.clamp((b - 1.85) / 0.35)), land = b - 2.2, bounce = land > 0 && b < 4.4 ? 0.07 * Math.exp(-land * 5) * Math.abs(Math.sin(land * 14)) : 0;
      const rise = b < 4.4 ? 0 : K.back((b - 4.4) / 0.45, 2.2), th = 0.24 * fall * (1 - rise) - 0.3 * bounce, sq = 1 - 0.8 * fall * (1 - rise) + 0.5 * bounce, wilt = fall * (1 - XY.smooth((b - 4.4) / 0.4));
      // ---- a skein of geese crossing the empty sky over the hall
      { const fx = 560 - ((t * 34) % 760); g.strokeStyle = INK; g.lineWidth = 1.5;
        for (let k = 0; k < 7; k++) { const row = Math.ceil(k / 2), side = k % 2 ? 1 : -1, x = fx + row * 26, y = 196 + side * row * 13 - row * 4, fl = 4 * Math.sin(t * 7 + k);
          g.beginPath(); g.moveTo(x - 9, y - fl); g.quadraticCurveTo(x - 3, y - 2, x, y); g.quadraticCurveTo(x + 4, y - 2, x + 9, y - fl * 0.8); g.stroke(); } }
      // ---- drifting mist bands (behind)
      g.save(); g.beginPath(); g.rect(0, 0, KOTO, e.H); g.clip();   // the mist stops at the 詞書 paper
      mist(g, 300 + 18 * Math.sin(t * 0.21), 112, 560, 32, 7, t);
      mist(g, 690 - 14 * Math.sin(t * 0.17 + 1), 520, 300, 26, 8, t + 1); g.restore();
      // ---- 清風・明月: scold, wail-hop while the tree is down, clap once it stands again
      const down = b > 2.0 && b < 4.7, clap = b > 4.8;
      [[176, 566, 1, '#7E9AA0', 0], [272, 554, -1, '#9DA97E', 0.5]].forEach(([x, y, fl, robe, ph]) => {
        const hop = down ? 7 * Math.abs(Math.sin(t * 9 + ph * 3)) : clap ? 2 * Math.abs(Math.sin(t * 6 + ph)) : 0;
        const arms = down ? 1.3 + 0.2 * Math.sin(t * 12 + ph) : clap ? 0.9 + 0.5 * Math.abs(Math.sin(t * 7 + ph)) : 0.2 + 0.1 * Math.sin(t * 3 + ph);
        boy(g, x, y, hop, arms, fl, robe); });
      // ---- the hole the roots tear out
      if (th > 0.05) { g.fillStyle = `rgba(60,42,24,${0.55 * XY.clamp(th / 0.6)})`; g.beginPath(); g.ellipse(TREE[0] - 6, TREE[1] + 3, 30, 7, 0, 0, TAU); g.fill(); }
      // ---- the tree in its own rotated frame
      g.save(); g.translate(TREE[0], TREE[1]); g.scale(1, sq); g.rotate(th); g.lineCap = 'round';
      if (th > 0.05) { g.globalAlpha = XY.clamp(th / 0.5); g.strokeStyle = '#5A3E2A'; g.lineWidth = 3;
        [[-44, 22], [-24, 36], [0, 40], [22, 34], [42, 20]].forEach(([x, y]) => { g.beginPath(); g.moveTo(0, 0); g.quadraticCurveTo(x * 0.4, y * 0.7, x, y); g.stroke(); }); g.globalAlpha = 1; }
      BR.forEach(([x0, y0, x1, y1, w]) => { g.strokeStyle = INK; g.lineWidth = w * 2 + 2.2; g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.stroke(); g.strokeStyle = '#6E4C34'; g.lineWidth = w * 2; g.stroke(); });
      g.strokeStyle = 'rgba(240,220,190,0.35)'; g.lineWidth = 2; g.beginPath(); g.moveTo(-4, -10); g.lineTo(-9, -96); g.lineTo(0, -188); g.stroke();
      const gc = [111, 143, 85], wc = [180, 154, 90], lc = gc.map((v, i) => Math.round(XY.lerp(v, wc[i], wilt))), lcol = `rgb(${lc})`, ls = 1 - 0.18 * wilt;
      LEAVES.forEach(([x, y, a, l, id]) => { const sw = 0.08 * Math.sin(t * 2.2 + id * 0.7) + 0.5 * wilt;
        g.save(); g.translate(x, y); g.rotate(a + sw); g.scale(ls, ls); g.fillStyle = lcol; g.strokeStyle = INK; g.lineWidth = 0.8;
        g.beginPath(); g.ellipse(l * 0.5, 0, l * 0.55, l * 0.2, 0, 0, TAU); g.fill(); g.stroke(); g.beginPath(); g.moveTo(0, 0); g.lineTo(l * 1.02, 0); g.stroke(); g.restore(); });
      // fruits still on the branch: before the fall lands, and after they re-grow
      FRUIT.forEach(([x, y], i) => {
        const tg = 4.7 + i * 0.06, grown = b < 2.2 ? 1 : b >= tg ? K.back((b - tg) / 0.2, 2) : 0;
        if (grown <= 0 || (i === DROP && b >= 5.2)) return;
        baby(g, x, y + 4, 1.35 * grown, -th * 0.9 + 0.12 * Math.sin(t * 2.6 + i) + (i === DROP && b > 4.95 ? 0.35 * Math.sin(t * 40) : 0), Math.sin(t * 8 + i));
      });
      g.restore();
      // fruits shaken loose on impact sink into the earth (遇土而入)
      if (b > 2.2 && b < 3.2) FRUIT.forEach(([x, y], i) => {
        const p = rotP([x, y], 0.24, 0.2), d = XY.easeIn(XY.clamp((b - 2.2) / 0.2)), gy = 652 + (i % 4) * 4, yy = XY.lerp(p[1], Math.max(p[1], gy), d), sink = XY.clamp((b - 2.45 - i * 0.02) / 0.4);
        if (sink >= 1) return;
        g.save(); g.beginPath(); g.rect(p[0] - 40, 0, 80, gy + 2); g.clip(); baby(g, p[0], yy + 30 * sink, 1.35, 0.4, 0); g.restore();
        if (sink > 0) { g.strokeStyle = `rgba(90,64,36,${0.6 * (1 - sink)})`; g.lineWidth = 1; g.beginPath(); g.ellipse(p[0], gy + 2, 6 + 16 * sink, 2 + 3 * sink, 0, 0, TAU); g.stroke(); }
      });
      // ---- 観音: descends from the upper right, winds the willow back, flicks on 1.8; the dew lands on beat 2
      const arr = XY.easeOut((u - 0.2) / 0.24), lv = XY.easeIn((u - 0.8) / 0.3);
      const gx = XY.lerp(XY.lerp(1240, 846, arr), 1200, lv), gy = XY.lerp(XY.lerp(-90, 214, arr), -140, lv);
      const flick = b < 4.0 ? XY.smooth((b - 3.6) / 0.4) : Math.exp(-(b - 4.0) / 0.35);
      if (gy > -130) {
        const tip = raigo(g, gx, gy, t, flick), tgt = [TREE[0] + 26, TREE[1] - 16], f0 = (b - 4.0) / 0.3;
        if (f0 > 0 && f0 < 1.6) { const ta = XY.clamp(1.6 - f0); g.strokeStyle = `rgba(255,255,255,${0.9 * ta})`; g.lineWidth = 2.4; g.beginPath();
          for (let q = 0; q <= 24; q++) { const f = q / 24 * XY.clamp(f0), x = XY.lerp(tip[0], tgt[0], f), y = XY.lerp(tip[1], tgt[1], f) - 120 * Math.sin(f * Math.PI); q ? g.lineTo(x, y) : g.moveTo(x, y); }
          g.stroke(); g.strokeStyle = `rgba(110,150,170,${0.8 * ta})`; g.lineWidth = 0.9; g.stroke(); }
        if (f0 > 0 && f0 < 1.6) for (let k = 0; k < 12; k++) { const f = XY.clamp(f0 - k * 0.05); if (f <= 0 || f >= 1) continue;
          const x = XY.lerp(tip[0], tgt[0], f), y = XY.lerp(tip[1], tgt[1], f) - 120 * Math.sin(f * Math.PI);
          g.fillStyle = 'rgba(150,190,200,0.9)'; g.strokeStyle = INK; g.lineWidth = 0.6; g.beginPath(); g.ellipse(x, y, 4, 5.4, 0, 0, TAU); g.fill(); g.stroke();
          g.fillStyle = '#FFFFFF'; g.fillRect(x - 0.8, y - 1.6, 1.2, 1.2); }
      }
      // the spring that wells up at the root when the dew lands
      const sp = b - 4.4; if (sp > 0 && sp < 1.4) { const a = 1 - sp / 1.4;
        for (let k = 0; k < 3; k++) { const r = (sp * 70 + k * 18) % 90; g.strokeStyle = `rgba(110,150,160,${a * (1 - r / 90)})`; g.lineWidth = 1.4; g.beginPath(); g.ellipse(TREE[0] + 14, TREE[1] + 4, r, r * 0.22, 0, 0, TAU); g.stroke(); }
        g.strokeStyle = `rgba(120,165,175,${a})`; g.lineWidth = 1.6; [-1, 0, 1].forEach(s => { g.beginPath(); g.moveTo(TREE[0] + 14, TREE[1]); g.quadraticCurveTo(TREE[0] + 14 + s * 16, TREE[1] - 40 * a - 10, TREE[0] + 14 + s * 30, TREE[1] - 4); g.stroke(); }); }
      // ---- the procession, painted on the paper: ink line, mineral washes, paper fibre on top
      const [cv, lg] = K.layer(e, 'emk-proc');
      XY.drawProcession(lg, e.phase, e.procX, e.groundY, PEN, acts);
      const pat = lg.createPattern(fibreTile(), 'repeat'); K.tint(lg, pat, 0.7);
      K.blit(g, cv, 0.96);
      // ---- one fruit drops off the revived tree straight into 八戒's mouth (beat 3) and is swallowed whole
      const fd = (b - 5.2) / 0.4;
      if (fd > 0 && fd < 1) { const p0 = rotP(FRUIT[DROP], th), hd = e.at('bajie.head', acts), m = [hd[0] + 33, hd[1] + 4];
        const x = XY.lerp(p0[0], m[0], fd), y = XY.lerp(p0[1] + 6, m[1] - 8, fd * fd);
        g.strokeStyle = 'rgba(43,33,24,0.7)'; g.lineWidth = 1.4; [-8, 0, 8].forEach((dx, k) => { g.beginPath(); g.moveTo(x + dx, y - 16 - k % 2 * 6); g.lineTo(x + dx * 1.2, y - 40 - 20 * fd); g.stroke(); });
        baby(g, x, y, 1.75, fd * 4, Math.sin(t * 14)); }
      const gulp = b - 5.6; if (gulp > 0 && gulp < 0.9) { const hd = e.at('bajie.head', acts), a = 1 - gulp / 0.9;
        g.strokeStyle = `rgba(43,33,24,${a})`; g.lineWidth = 2.2; [[-0.9, 34], [-0.45, 42], [0, 44], [0.45, 38]].forEach(([ang, r]) => { const x = hd[0] + 30, y = hd[1] - 6;
          g.beginPath(); g.moveTo(x + Math.cos(ang - 0.6) * r * 0.6, y + Math.sin(ang - 0.6) * r * 0.6); g.lineTo(x + Math.cos(ang - 0.6) * (r + 18 + 14 * gulp), y + Math.sin(ang - 0.6) * (r + 18 + 14 * gulp)); g.stroke(); });
        const bl = e.at('bajie.belly', acts); g.strokeStyle = `rgba(43,33,24,${0.7 * a})`; g.lineWidth = 1.2; g.beginPath(); g.arc(bl[0] + 8, bl[1] + 4, 9 + 4 * gulp, -0.8, 0.8); g.stroke(); }
      // ---- foreground mist and the stream's curls
      g.strokeStyle = 'rgba(43,33,24,0.55)'; g.lineWidth = 1;
      for (let k = 0; k < 9; k++) { const x = 620 + ((k * 46 + t * 22) % 400), y = 738 + 5 * Math.sin(x / 50); g.beginPath(); g.arc(x, y, 6, Math.PI, Math.PI * 1.8); g.stroke(); g.beginPath(); g.moveTo(x - 6, y); g.quadraticCurveTo(x - 20, y + 4, x - 30, y + 1); g.stroke(); }
      mist(g, -80 + 16 * Math.sin(t * 0.23 + 2), 748, 520, 28, 9, t + 2);
      // ---- entry: the scroll unrolls from right to left; the cover silk and the roller sweep off the left edge
      const rx = XY.lerp(W + 40, -40, XY.smooth((u + 0.42) / 0.26));
      if (rx > -34) {
        g.fillStyle = g.createPattern(coverTile(), 'repeat'); g.fillRect(0, 0, Math.max(0, rx), e.H);
        const gr = g.createLinearGradient(rx - 24, 0, rx + 24, 0); gr.addColorStop(0, '#B8A27A'); gr.addColorStop(0.35, '#F2E6CA'); gr.addColorStop(0.7, '#D2BE94'); gr.addColorStop(1, '#8E7650');
        g.fillStyle = gr; g.fillRect(rx - 24, 6, 48, e.H - 12); g.strokeStyle = 'rgba(80,60,30,0.6)'; g.lineWidth = 1; g.strokeRect(rx - 24, 6, 48, e.H - 12);
        for (let k = 1; k < 5; k++) { g.beginPath(); g.moveTo(rx - 24 + k * 10, 8); g.lineTo(rx - 24 + k * 10, e.H - 8); g.strokeStyle = 'rgba(120,96,60,0.25)'; g.stroke(); }
        [2, e.H - 2].forEach(y => { g.fillStyle = '#E8E2D6'; g.strokeStyle = INK; g.beginPath(); g.ellipse(rx, y, 13, 9, 0, 0, TAU); g.fill(); g.stroke(); });
      }
    },
  };
})();
