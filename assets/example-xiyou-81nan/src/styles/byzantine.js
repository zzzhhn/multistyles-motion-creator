// 13 拜占庭镶嵌 · 黄风怪阻 (v10) — a Ravenna-style mosaic: gold ground, a deep-blue inscription band, green meadow,
// a perspective-meander border. In the centre the dark arch of 黄风洞 frames 黄风大王, set frontal in the icon manner
// but dressed as the novel has him: gold helmet with pheasant plumes, gold scale armour, a goose-yellow robe, the
// heart-guard mirror, deer-skin boots, the three-pronged steel fork. Beat 2 his tiger vanguard springs from the cave,
// beat 3 Wukong's staff bursts it and only the empty skin is left (金蝉脱壳); beat 4 he blows the 三昧神风: a vortex
// of umber and ochre tesserae drives at Wukong's eyes and, at beat 5, tears the gold tiles off the wall into its
// spiral; they fly home in the aftermath. Static picture tessellated once in bg; figures are set in finer tesserae.
(() => {
  'use strict';
  const XY = window.XY, TAU = XY.TAU, K = XY.KIT_B;
  const GOLD = '#C9A040', BLUE = '#1E2C5C', GREEN = '#4E7A3A', WHITE = '#EEE6D2', RED = '#A8302A', BK = '#1C1410', GROUT = '#3A3026';
  const sp = (pts, n = 5) => XY.RIG.spline(pts, true, n);
  const fillP = (g, pts, col, line = 0) => { XY.path(g, pts, true); g.fillStyle = col; g.fill(); if (line) { g.strokeStyle = BK; g.lineWidth = line; g.stroke(); } };
  const stroke = (g, pts, w, col) => { g.strokeStyle = col; g.lineWidth = w; XY.path(g, pts, false); g.stroke(); };
  const KX = 900, MOUTH = [KX, 276];

  // ------------------------------------------------------------ 黄风大王 as the novel describes him, in icon frontality
  const king = g => {
    const x = KX;
    // jewelled footstool, deer-skin boots
    fillP(g, [x - 78, 566, x + 78, 566, x + 72, 598, x - 72, 598], '#D8B040', 4); [-50, -18, 18, 50].forEach((d, k) => fillP(g, XY.ellipse(x + d, 582, 8, 7, 10), k % 2 ? RED : '#2E7A5A'));
    fillP(g, [x - 46, 528, x - 10, 528, x - 8, 566, x - 52, 566], '#B07A3A', 4); fillP(g, [x + 10, 528, x + 46, 528, x + 52, 566, x + 8, 566], '#B07A3A', 4);
    // goose-yellow robe falling over the armour, folds as hard dark lines
    fillP(g, [x - 70, 400, x + 70, 400, x + 92, 536, x - 92, 536], '#E6D68C', 5);
    for (let k = -3; k <= 3; k++) stroke(g, [x + k * 16, 412, x + k * 24, 532], 3, '#9A8A4A');
    // gold scale cuirass, red 勒甲绦 belt, the heart-guard mirror
    fillP(g, [x - 64, 312, x + 64, 312, x + 70, 412, x - 70, 412], '#C89A30', 5);
    for (let r = 0; r < 5; r++) for (let c = -3; c <= 3; c++) { g.strokeStyle = '#6A4A14'; g.lineWidth = 2.6; g.beginPath(); g.arc(x + c * 18 + (r % 2) * 9, 326 + r * 18, 9, 0.15, Math.PI - 0.15); g.stroke(); }
    fillP(g, [x - 72, 402, x + 72, 402, x + 72, 420, x - 72, 420], RED, 3); fillP(g, XY.ellipse(x, 411, 12, 10, 12), '#D8B040', 2);
    fillP(g, XY.ellipse(x, 356, 26, 26, 24), '#9AA2A6', 4); fillP(g, XY.ellipse(x, 356, 17, 17, 20), '#DCE2E4'); fillP(g, XY.ellipse(x - 6, 350, 6, 6, 10), WHITE);
    // pauldrons, arms; the fork in his right hand (viewer's right), the left hand on the hip
    fillP(g, XY.ellipse(x - 70, 322, 26, 20, 16), '#D8B040', 4); fillP(g, XY.ellipse(x + 70, 322, 26, 20, 16), '#D8B040', 4);
    fillP(g, XY.RIG.capsule([x - 80, 336], [x - 98, 400], 15, 13), '#E6D68C', 4); fillP(g, XY.RIG.capsule([x - 98, 400], [x - 70, 430], 13, 11), '#E6D68C', 4); fillP(g, XY.ellipse(x - 66, 432, 12, 11, 12), '#D89A38', 3);
    stroke(g, [x + 118, 610, x + 118, 150], 12, BK); stroke(g, [x + 118, 610, x + 118, 150], 7, '#7A5A34');
    stroke(g, [x + 92, 160, x + 92, 186, x + 144, 186, x + 144, 160], 11, BK); stroke(g, [x + 92, 160, x + 92, 186, x + 144, 186, x + 144, 160], 6, '#C8C8C0');
    [[x + 92, 150], [x + 118, 132], [x + 144, 150]].forEach(([a, b]) => { fillP(g, [a - 8, b + 14, a, b - 16, a + 8, b + 14], '#C8C8C0', 3); });
    fillP(g, XY.RIG.capsule([x + 80, 336], [x + 104, 388], 15, 13), '#E6D68C', 4); fillP(g, XY.RIG.capsule([x + 104, 388], [x + 118, 352], 13, 11), '#E6D68C', 4); fillP(g, XY.ellipse(x + 118, 352, 13, 12, 12), '#D89A38', 3);
    // neck, the marten head: long face, pointed ears, white muzzle, huge almond icon eyes under heavy brows
    fillP(g, [x - 18, 288, x + 18, 288, x + 22, 316, x - 22, 316], '#D89A38', 3);
    fillP(g, [x - 56, 196, x - 34, 140, x - 22, 196], '#C88A30', 4); fillP(g, [x + 56, 196, x + 34, 140, x + 22, 196], '#C88A30', 4);
    fillP(g, [x - 46, 190, x - 36, 160, x - 28, 190], '#7A4A20'); fillP(g, [x + 46, 190, x + 36, 160, x + 28, 190], '#7A4A20');
    fillP(g, sp([x, 170, x + 40, 186, x + 50, 220, x + 40, 256, x + 18, 288, x, 298, x - 18, 288, x - 40, 256, x - 50, 220, x - 40, 186], 5), '#D89A38', 5);
    fillP(g, sp([x - 24, 252, x, 240, x + 24, 252, x + 18, 282, x, 294, x - 18, 282], 4), WHITE, 3);
    [-1, 1].forEach(d => { const ex = x + d * 21; fillP(g, sp([ex - 16, 224, ex - 2 * d, 212, ex + 16, 222, ex + 2 * d, 234], 3), WHITE, 3.4); fillP(g, XY.ellipse(ex + d * 2, 223, 6.5, 7.5, 12), BK);
      stroke(g, [ex - 18 * d, 206, ex + 14 * d, 198 + 2], 5, '#5A3414'); });
    fillP(g, XY.ellipse(x, 262, 7, 5, 10), BK); stroke(g, [x, 266, x, 278], 3, BK);
    // gold helmet with cheek guards and two pheasant-tail plumes
    fillP(g, sp([x - 52, 204, x - 50, 166, x - 30, 146, x, 140, x + 30, 146, x + 50, 166, x + 52, 204, x + 40, 190, x, 182, x - 40, 190], 5), '#D8B040', 5);
    fillP(g, [x - 52, 200, x - 40, 196, x - 44, 250, x - 56, 244], '#D8B040', 3); fillP(g, [x + 52, 200, x + 40, 196, x + 44, 250, x + 56, 244], '#D8B040', 3);
    fillP(g, XY.ellipse(x, 160, 10, 9, 12), RED, 3);
    [-1, 1].forEach(d => { const P = XY.RIG.spline([x + d * 8, 146, x + d * 30, 96, x + d * 80, 64, x + d * 140, 66, x + d * 176, 86], false, 6), R_ = XY.RIG.ribbon(P, 16, 6);
      fillP(g, R_, '#8A5A2A', 4); for (let k = 2; k < P.length - 4; k += 6) stroke(g, [P[k] - 6, P[k + 1] - 6, P[k] + 6, P[k + 1] + 6], 3, '#EEE6D2'); });
  };
  const scene = (g, W, H) => {
    g.fillStyle = GOLD; g.fillRect(0, 0, W, H);
    g.fillStyle = '#5A1E1A'; g.fillRect(0, 0, W, 36);
    for (let x = 14; x < W; x += 44) { fillP(g, XY.ellipse(x, 18, 9, 12, 12), RED); fillP(g, [x + 18, 10, x + 30, 10, x + 30, 26, x + 18, 26], '#2E7A5A'); fillP(g, XY.ellipse(x + 24, 4, 3, 3, 8), WHITE); fillP(g, XY.ellipse(x + 24, 32, 3, 3, 8), WHITE); }
    g.fillStyle = BLUE; g.fillRect(0, 40, W, 84); g.fillStyle = GOLD; g.fillRect(0, 36, W, 4); g.fillRect(0, 124, W, 4);
    g.fillStyle = WHITE; g.font = XY.font(78, XY.cnFont.hei, '600'); g.textBaseline = 'middle'; g.textAlign = 'center'; g.fillText('黄 风', 420, 84);
    g.fillStyle = '#E2C060'; g.font = XY.font(46, '"Times New Roman", serif', 'bold'); g.fillText('ΙΓʹ', 610, 86);
    [270, 540].forEach(cx => fillP(g, [cx - 12, 84, cx, 72, cx + 12, 84, cx, 96], WHITE));
    g.textAlign = 'start'; g.textBaseline = 'alphabetic';
    // stepped rocks of 黄风岭 at the left
    [[40, 600, 220, 120, '#8A7A6A'], [70, 480, 160, 120, '#A89A8A'], [100, 380, 100, 100, '#C8BCA8']].forEach(([x, y, w, h, c]) => {
      fillP(g, [x, y, x + 16, y - h, x + w - 16, y - h, x + w, y], c); stroke(g, [x + 16, y - h, x + w - 16, y - h], 4, WHITE); stroke(g, [x + w - 16, y - h, x + w, y], 4, '#5A4E44'); });
    // 黄风洞: a dark arch framed by a rim of red and white tesserae
    const arch = sp([KX - 168, 604, KX - 168, 300, KX - 120, 176, KX, 128, KX + 120, 176, KX + 168, 300, KX + 168, 604], 6);
    fillP(g, arch, '#2A1C10'); g.strokeStyle = RED; g.lineWidth = 18; XY.path(g, arch.slice(0, arch.length - 2), false); g.stroke();
    g.save(); g.setLineDash([9, 9]); g.strokeStyle = WHITE; g.lineWidth = 8; XY.path(g, arch.slice(0, arch.length - 2), false); g.stroke(); g.restore();
    for (let k = 0; k < 14; k++) fillP(g, sp([KX - 140 + (k % 7) * 40, 220 + Math.floor(k / 7) * 200, KX - 116 + (k % 7) * 40, 206 + Math.floor(k / 7) * 200, KX - 100 + (k % 7) * 40, 236 + Math.floor(k / 7) * 200], 3), '#3E2A18');
    // meadow, cypress-like mountain trees, flowers, the perspective-meander border
    g.fillStyle = GREEN; g.fillRect(0, 600, W, 104); g.fillStyle = '#3A6A2E'; g.fillRect(0, 600, W, 10);
    [[290, 600], [470, 600], [620, 600]].forEach(([x, y]) => { stroke(g, [x, y + 6, x, y - 40], 10, '#6A4A2A'); fillP(g, sp([x, y - 230, x + 34, y - 120, x + 38, y - 40, x, y - 30, x - 38, y - 40, x - 34, y - 120], 4), '#2E6A3A');
      for (let j = 0; j < 4; j++) stroke(g, [x - 24 + j * 3, y - 60 - j * 40, x, y - 80 - j * 40, x + 24 - j * 3, y - 60 - j * 40], 4, '#5A9A4A'); });
    for (let k = 0; k < 30; k++) { const x = 20 + k * 40 + XY.hash(k, 1) * 16, y = 640 + XY.hash(k, 2) * 50; fillP(g, XY.ellipse(x, y, 6, 6, 8), k % 3 ? WHITE : RED); fillP(g, XY.ellipse(x, y, 2.4, 2.4, 6), '#E2C060'); }
    g.fillStyle = '#2A2016'; g.fillRect(0, 704, W, 76);
    for (let x = 0, k = 0; x < W; x += 52, k++) { const c = [RED, '#2E7A5A', '#D8B040', BLUE][k % 4];
      fillP(g, [x, 742, x + 26, 716, x + 52, 742, x + 26, 768], c); fillP(g, [x + 26, 716, x + 52, 742, x + 52, 716], WHITE); fillP(g, [x, 742, x + 26, 768, x, 768], '#7A6A5A'); }
    king(g);
  };
  // ------------------------------------------------------------ cutting it into tesserae
  const PW = 1180, PH = 780, T8 = 8, TF = 4.2;
  const src = () => XY.keep('byz-src-v10', PW, PH, cv => scene(cv.getContext('2d'), PW, PH));
  let SD = null; const sdata = () => SD || (SD = src().getContext('2d').getImageData(0, 0, PW, PH).data);
  const tile = (x, y, ts, seed) => {
    const d = sdata(), cx = XY.clamp(Math.round(x + ts / 2), 0, PW - 1), cy = XY.clamp(Math.round(y + ts / 2), 0, PH - 1), o = (cy * PW + cx) * 4;
    const R = d[o], G = d[o + 1], B = d[o + 2], h = XY.hash(Math.round(x * 3), Math.round(y * 3), seed), gold = R > 170 && G > 130 && B < 110 && G < 190;
    const j = gold ? 0.78 + 0.5 * h * h + (XY.hash(Math.round(x), Math.round(y), seed + 5) < 0.04 ? 0.3 : 0) : 0.9 + 0.2 * h;
    return { c: `rgb(${Math.min(255, R * j) | 0},${Math.min(255, G * j) | 0},${Math.min(255, B * j) | 0})`, gold, gp: 0.9 + 0.7 * XY.hash(Math.round(x), Math.round(y), seed + 1), jx: (XY.hash(Math.round(x), Math.round(y), seed + 2) - 0.5) * 0.9, jy: (XY.hash(Math.round(x), Math.round(y), seed + 3) - 0.5) * 0.9 };
  };
  const tess = (g, x0, y0, x1, y1, ts, seed) => {
    g.save(); g.beginPath(); g.rect(x0, y0, x1 - x0, y1 - y0); g.clip(); g.fillStyle = GROUT; g.fillRect(x0, y0, x1 - x0, y1 - y0);
    for (let y = y0, r = 0; y < y1; y += ts, r++) for (let x = x0 - (r % 2) * ts * 0.5; x < x1; x += ts) {
      const q = tile(x, y, ts, seed); g.fillStyle = q.c; g.fillRect(x + q.gp / 2 + q.jx, y + q.gp / 2 + q.jy, ts - q.gp, ts - q.gp); }
    g.restore();
  };
  // the vortex centre and the gold tesserae it will tear off (same grid as the base pass, gold ground only)
  const VC = [560, 400];
  let HOLE = null;
  const hole = () => HOLE || (HOLE = (() => { const o = [];
    for (let y = 136, r = 17; y < 600; y += T8, r++) for (let x = -(r % 2) * T8 * 0.5; x < KX - 190; x += T8) {
      const dx = (x - 500) / 330, dy = (y - 330) / 150; if (dx * dx + dy * dy > 1 + 0.45 * XY.fbm(x / 70, y / 50, 81, 3)) continue;
      const q = tile(x, y, T8, 1301); if (!q.gold) continue;
      const d = Math.hypot(x - VC[0], (y - VC[1]) * 1.6);
      o.push({ x, y, c: q.c, s: T8 - q.gp, t0: 0.6 + 0.05 * XY.clamp(d / 420) + 0.012 * XY.hash(x | 0, y, 3), t1: 0.8 + 0.12 * XY.clamp(d / 420) + 0.02 * XY.hash(x | 0, y, 4), a: XY.hash(x | 0, y, 5) * TAU, r: d }); }
    return o; })());
  const grout = S => XY.cached(`byz-grout:${S.toFixed(3)}`, PW * S, PH * S, cv => {
    const g = cv.getContext('2d'); g.scale(S, S); g.strokeStyle = 'rgba(40,30,20,0.55)'; g.lineWidth = 0.9;
    g.beginPath(); for (let x = 0; x <= PW; x += TF) { g.moveTo(x, 0); g.lineTo(x, PH); } for (let y = 0; y <= PH; y += TF) { g.moveTo(0, y); g.lineTo(PW, y); } g.stroke();
  });
  const jitter = (w, h) => XY.keep(`byz-jit:${w}x${h}`, w, h, cv => { const g = cv.getContext('2d'), im = g.createImageData(w, h), d = im.data;
    for (let k = 0; k < w * h; k++) { const v = XY.hash(k, 7, 1301), o = k * 4; if (v < 0.5) { d[o + 3] = 50 * (0.5 - v); } else { d[o] = d[o + 1] = d[o + 2] = 255; d[o + 3] = 44 * (v - 0.5); } }
    g.putImageData(im, 0, 0); });
  // the tiger vanguard (drawn into the fine-tesserae layer): pose 0 running / 1 leaping; dir −1 faces left
  const tiger = (g, x, y, s, pose, dir, t) => {
    g.save(); g.translate(x, y); g.scale(dir * s, s);
    const OR = '#D8822A', ST_ = '#2A1A10', run = Math.sin(t * 16);
    const legs = pose ? [[40, -40, 96, -30], [30, -40, 84, -14], [-40, -40, -100, -20], [-50, -36, -104, -44]] : [[40, -40, 50 + 16 * run, 0], [30, -40, 20 - 16 * run, 0], [-40, -40, -30 + 16 * run, 0], [-50, -36, -60 - 16 * run, 0]];
    legs.forEach(([a, b, c, d]) => { stroke(g, [a, b, c, d], 20, BK); stroke(g, [a, b, c, d], 14, OR); });
    fillP(g, sp([-80, -70, -30, -86, 30, -84, 70, -76, 84, -54, 60, -32, -20, -28, -76, -36], 5), OR, 5);
    fillP(g, sp([-60, -38, 0, -30, 50, -36, 30, -28, -30, -26], 3), WHITE);
    for (let k = 0; k < 6; k++) stroke(g, [-62 + k * 22, -84, -56 + k * 22, -60, -64 + k * 22, -44], 6, ST_);
    stroke(g, XY.RIG.spline([-78, -64, -110, -80, -128, -60 + 10 * Math.sin(t * 9), -140, -86], false, 4), 9, BK); stroke(g, XY.RIG.spline([-78, -64, -110, -80, -128, -60 + 10 * Math.sin(t * 9), -140, -86], false, 4), 5, OR);
    fillP(g, XY.ellipse(92, -76, 30, 26, 18), OR, 5); fillP(g, [74, -98, 80, -116, 92, -100], OR, 3); fillP(g, [100, -100, 112, -114, 114, -96], OR, 3);
    fillP(g, XY.ellipse(108, -66, 16, 12, 12), WHITE); fillP(g, XY.ellipse(96, -84, 5, 4, 8), '#F2E070'); fillP(g, XY.ellipse(97, -84, 2.4, 3.4, 8), BK);
    fillP(g, [112, -62, 128, -60, 112, -54], RED); stroke(g, [84, -100, 92, -88], 4, ST_); stroke(g, [98, -100, 100, -90], 4, ST_);
    g.restore();
  };
  const skin = (g, x, y) => { fillP(g, sp([x - 110, y - 4, x - 70, y - 14, x + 40, y - 16, x + 90, y - 10, x + 120, y - 2, x + 80, y + 2, x - 90, y + 2], 5), '#D8822A', 3);
    for (let k = 0; k < 7; k++) stroke(g, [x - 80 + k * 26, y - 14, x - 74 + k * 26, y], 5, '#2A1A10'); fillP(g, XY.ellipse(x + 112, y - 8, 14, 8, 12), '#D8822A', 3); };
  const COL = { fur: '#8A5A30', face: '#E2BC92', wkshirt: '#B03028', tiger: '#D89030', stripe: BK, gold: '#E2C060', staff: '#B03028', ink: BK, horse: '#F2EEE2', horse2: '#D2CABA',
    mane: '#E6E0D0', hoof: '#3A3026', saddle: '#7A2A1E', red: RED, robe: '#E2C060', kasaya: '#B02820', skin: '#EAC8A0', metal: '#D8B040', bjrobe: '#2A3460', bjpants: '#222844', pig: '#E6A49A', pig2: '#C8847A', wood: '#7A5A34' };
  const PEN = { outline: '#2A1A14', ow: 2.2, shade: 'rgba(30,20,40,0.25)', color: r => (COL[r] !== undefined ? COL[r] : XY.DEFAULT_COLORS[r]) };
  const WIND = ['#5A3A1A', '#7A5228', '#3A2410', '#9A6A2E', '#2A1A0C', '#B88A44'];
  const bez = (a, b, c, s) => { const m = 1 - s; return [m * m * a[0] + 2 * m * s * b[0] + s * s * c[0], m * m * a[1] + 2 * m * s * b[1] + s * s * c[1]]; };

  XY.STYLES.byzantine = {
    hits: [3, 4, 5],
    bg(g, W, H) {
      tess(g, 0, 0, W, H, T8, 1301);
      tess(g, 0, 40, W, 124, TF, 1307);                       // the inscription in finer tesserae
      tess(g, KX - 190, 56, KX + 190, 604, TF, 1309);         // so are the king and his fork
    },
    draw(g, e) {
      const { W, H, u, t, cell } = e, d = cell.dur;
      const tq = (x, y, s, c) => { g.fillStyle = c; g.fillRect(x - s / 2, y - s / 2, s - 0.9, s - 0.9); };
      // ---- the king puffs his cheeks (beat 3.4) and blows (beat 4): a ring of dark tiles opens his mouth
      const puff = XY.smooth((u - 0.42) / 0.07) * (1 - XY.smooth((u - 0.76) / 0.05)), blow = XY.smooth((u - 0.49) / 0.015) * (1 - XY.smooth((u - 0.74) / 0.06)), wind = blow;
      if (puff > 0) for (const sx of [-1, 1]) for (let k = 0; k < 12; k++) { const a = k / 12 * TAU; tq(KX + sx * (46 + 10 * puff) + Math.cos(a) * 14 * puff, 256 + Math.sin(a) * 14 * puff, TF, k % 2 ? '#E8AA48' : '#D89A38'); }
      if (blow > 0) { const r = 5 + 10 * blow; for (let k = 0; k < 16; k++) { const a = k / 16 * TAU; tq(KX + Math.cos(a) * r, 280 + Math.sin(a) * r * 0.8, TF, '#5A1A14'); } tq(KX, 280, TF * 2, BK); }
      // ---- beat 5: the wind tears the gold off the wall — the bare red setting bed, ruled by the mosaicist
      const H_ = hole(); let any = false; g.beginPath();
      for (const q of H_) if (u >= q.t0 && u < q.t1) { g.rect(q.x - 0.5, q.y - 0.5, T8 + 1, T8 + 1); any = true; }
      if (any) { g.save(); g.fillStyle = '#B9806A'; g.fill(); g.clip(); g.strokeStyle = 'rgba(120,40,24,0.55)'; g.lineWidth = 1.2;
        for (let y = 140; y < 600; y += 24) { g.beginPath(); g.moveTo(0, y); g.lineTo(KX, y); g.stroke(); } for (let k = 0; k < 160; k++) { g.fillStyle = 'rgba(90,40,24,0.35)'; g.fillRect(XY.hash(k, 1) * KX, 136 + XY.hash(k, 2) * 460, 3, 2); } g.restore(); }
      // ---- the fine-tesserae layer: the tiger vanguard, its empty skin, the pilgrims
      const acts = { wukong: { strike: XY.smooth((u - 0.33) / 0.03) * (1 - XY.smooth((u - 0.43) / 0.05)), shade: XY.smooth((u - 0.5) / 0.025) * (1 - XY.smooth((u - 0.8) / 0.06)) },
        monk: { palm: XY.smooth((u - 0.5) / 0.05) * (1 - XY.smooth((u - 0.86) / 0.08)) }, bajie: { scratch: XY.smooth((u - 0.8) / 0.06) } };
      const sway = 3 * wind * Math.sin(t * 9), WX = XY.procWorldX(cell.t0 + 0.375 * d) - cell.x + 245, TL = [WX + 150, 702];
      const [lo, lg] = K.layer('byz-lo', e, e.S * TF);
      const burst = u >= 0.375;
      if (u > 0.12 && !burst) { const em = XY.clamp((u - 0.12) / 0.13), lp = XY.clamp((u - 0.25) / 0.08), q = XY.easeIO(lp);
        const x = XY.lerp(XY.lerp(KX + 20, KX - 20, em), TL[0], q), y = XY.lerp(600, TL[1], q) - 150 * Math.sin(q * Math.PI), s = XY.lerp(0.62, 1.15, XY.clamp(em * 0.4 + q * 0.6));
        tiger(lg, x, y, s, lp > 0 && lp < 1 ? 1 : 0, -1, t); }
      if (burst) skin(lg, TL[0] + 10, 704);
      const mh = e.at('monk.head', acts);
      lg.fillStyle = '#F2E2A8'; lg.beginPath(); lg.arc(mh[0] - 2, mh[1] - 2, 27, 0, TAU); lg.fill(); lg.strokeStyle = RED; lg.lineWidth = 4.5; lg.stroke();
      K.team(lg, e.phase, e.procX + sway, e.groundY, PEN, acts);
      lg.setTransform(1, 0, 0, 1, 0, 0); lg.globalCompositeOperation = 'source-atop'; lg.drawImage(jitter(lo.width, lo.height), 0, 0);
      const [big, bgx] = K.layer('byz-big', e, 1); bgx.setTransform(1, 0, 0, 1, 0, 0); bgx.imageSmoothingEnabled = false;
      bgx.drawImage(lo, 0, 0, lo.width * TF * e.S, lo.height * TF * e.S); bgx.globalCompositeOperation = 'source-atop'; bgx.drawImage(grout(e.S), 0, 0);
      K.blit(g, big, e);
      // the vanguard bursts into tiles under the staff (beat 3); only the skin is left lying on the meadow
      if (burst && u < 0.5) { const a = (u - 0.375) / 0.125; for (let k = 0; k < 90; k++) { const an = XY.hash(k, 1, 13) * TAU, v = 80 + 260 * XY.hash(k, 2, 13), x = TL[0] - 20 + Math.cos(an) * v * a, y = 620 + Math.sin(an) * v * a * 0.7 + 260 * a * a;
        g.fillStyle = k % 4 ? '#D8822A' : (k % 8 ? BK : WHITE); g.globalAlpha = 1 - a; g.fillRect(x, y, 6, 6); } g.globalAlpha = 1; }
      // ---- the 三昧神风: a jet of umber tiles from the mouth into Wukong's eyes, opening into a vortex over the road
      if (wind > 0) {
        const eye = e.at('wukong.head', acts), E_ = [eye[0] + 12, eye[1] - 4], grow = XY.easeOut((u - 0.49) / 0.06), ctl = [KX - 60, 470];
        for (let k = 0; k < 220; k++) { const s = (t * 1.6 + XY.hash(k, 3, 13)) % 1, p = bez(MOUTH, ctl, E_, s), j = 26 * s * (XY.hash(k, 4, 13) - 0.5);
          if (s > grow) continue; tq(p[0] + j, p[1] + j * 0.6, 7 + 6 * (1 - s), WIND[k % WIND.length]); }
        g.save(); g.lineCap = 'round'; for (let a = 0; a < 3; a++) { const P = []; for (let j = 0; j <= 40; j++) { const rr = (20 + 300 * j / 40) * grow, an = a * TAU / 3 + rr * 0.013 + e.lt * (5.2 - rr / 110); P.push(VC[0] + Math.cos(an) * rr, VC[1] + Math.sin(an) * rr * 0.6); }
          g.strokeStyle = `rgba(58,34,14,${0.6 * wind})`; g.lineWidth = 46; XY.path(g, P, false); g.stroke(); g.strokeStyle = `rgba(120,80,34,${0.5 * wind})`; g.lineWidth = 16; g.stroke(); } g.restore();
        for (let k = 0; k < 900; k++) { if (XY.hash(k, 9, 13) > wind) continue; const arm = k % 3, rr = (20 + 310 * Math.sqrt(XY.hash(k, 1, 14))) * grow;
          const an = arm * TAU / 3 + rr * 0.013 + e.lt * (5.2 - rr / 110) + XY.hash(k, 2, 14) * 0.4, x = VC[0] + Math.cos(an) * rr, y = VC[1] + Math.sin(an) * rr * 0.6;
          tq(x, y, k % 5 === 0 ? 3.4 : 8 + 4 * XY.hash(k, 3, 14), k % 5 === 0 ? '#F0D890' : WIND[k % WIND.length]); }
        // tears from the stung eye
        if (acts.wukong.shade > 0.5) for (let k = 0; k < 4; k++) { const ph = (e.lt * 1.4 + k / 4) % 1; tq(E_[0] - 4, E_[1] + 8 + ph * 34, 4, '#BFE0F0'); }
      }
      // torn gold tiles: whirled round the vortex, then flown home and set again
      for (const q of H_) { if (u < q.t0 || u >= q.t1) continue; const age = (u - q.t0) * d, back = XY.easeIO(XY.clamp((u - (q.t1 - 0.06)) / 0.06)), gr = XY.easeOut(age / 0.4);
        const an = q.a + age * (4.2 - q.r / 200), rr = XY.lerp(q.r, 50 + 0.55 * q.r, gr), ox = VC[0] + Math.cos(an) * rr, oy = VC[1] + Math.sin(an) * rr * 0.6;
        const x = XY.lerp(XY.lerp(q.x, ox, gr), q.x, back), y = XY.lerp(XY.lerp(q.y, oy, gr), q.y, back), sw = back > 0.9 ? 1 : Math.abs(Math.cos(age * 9 + q.a));
        g.fillStyle = q.c; g.fillRect(x, y, q.s * (0.25 + 0.75 * sw), q.s); }
      // glints on the gold
      g.save(); g.globalCompositeOperation = 'lighter';
      for (let k = 0; k < 34; k++) { const x = 30 + XY.hash(k, 21) * (W - 60), y = 140 + XY.hash(k, 22) * 440, p = Math.pow(Math.max(0, Math.sin(t * 2.2 + k * 1.9)), 12);
        if (p < 0.02 || (x > KX - 180 && x < KX + 180)) continue; g.fillStyle = `rgba(255,236,170,${0.75 * p})`; g.fillRect(x - 3, y - 3, 7, 7); }
      g.restore();
      void H;
    },
    post(canvas, g, e) { K.zoomPost(canvas, g, e, 700, 470, K.zoom(e.u, [0.5, 0.58, 0.78], 1.1)); },
  };
})();
