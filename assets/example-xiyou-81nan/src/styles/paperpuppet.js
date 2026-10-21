// 72 定格纸偶 · 2000 年 · 凤仙郡求雨 — a stop-motion paper set: painted cardboard sky, a paper sun on a stick, cut-paper
// hills and cracked houses, the 郡侯 kowtowing at an incense table, and hung on strings up in 披香殿 the three things the
// Jade Emperor set: a rice hill a chick is pecking, a flour hill a golden dog is licking, a gold lock whose bar a lamp
// flame is burning. Beat 3: last grain, last lick, the bar snaps; the paper clouds flip to rain clouds and it rains
// paper confetti; cracked tiles darken, cellophane puddles spread, dry grass flips green. Everything steps at 12 fps.
// Pilgrims: paper colours, white cut edge, brass split pins at the rig's joints, fibre texture, a soft shadow on the set.
(() => {
  'use strict';
  const XY = window.XY, K = XY.KIT_H, TAU = XY.TAU, { sin, cos, PI, floor, round } = Math;
  const PAPER = '#FBF6EA', SNAP = 0.5;   // beat 4 of 8: the lock bar snaps and the rain starts
  const PEN = K.pen({ fur: '#A87444', face: '#F2D2AA', wkshirt: '#D24A34', tiger: '#E8A23A', robe: '#EAC66C', kasaya: '#C83A2C', horse: '#F2EEE2', horse2: '#D8D0BE',
    mane: '#E8E2D2', pig: '#F0B4A8', pig2: '#D8948A', bjrobe: '#3A4050', ssrobe: '#4A6474', skin: '#F2D6B4', skin2: '#C89A72', gold: '#E2B03C', metal: '#C8A040' }, PAPER, 2.1, { shade: false, fine: false });

  const fiber = () => XY.keep('pp-fiber', 200, 200, cv => { const g = cv.getContext('2d'), r = XY.rng(72);
    for (let k = 0; k < 700; k++) { const x = r() * 200, y = r() * 200, a = r() * PI, l = 2 + r() * 8; g.strokeStyle = r() < 0.5 ? 'rgba(90,60,30,0.22)' : 'rgba(255,255,245,0.5)'; g.lineWidth = 0.6 + r() * 0.6;
      for (const dx of [-200, 0, 200]) for (const dy of [-200, 0, 200]) { g.beginPath(); g.moveTo(x + dx, y + dy); g.lineTo(x + dx + cos(a) * l, y + dy + sin(a) * l); g.stroke(); } } });
  // a cut-paper shape: soft shadow on the layer behind, white cut edge, flat colour, paper fibre
  const cut = (g, pts, col, o = {}) => {
    g.save(); if (o.blur !== false) { g.shadowColor = 'rgba(50,30,10,0.35)'; g.shadowBlur = (o.blur || 8) * (o.S || 1); g.shadowOffsetX = (o.dx || 5) * (o.S || 1); g.shadowOffsetY = (o.dy || 6) * (o.S || 1); }
    XY.path(g, pts, true); g.fillStyle = col; g.fill(); g.restore();
    g.save(); XY.path(g, pts, true); g.lineJoin = 'round'; g.strokeStyle = o.edge || PAPER; g.lineWidth = o.ew || 2.2; g.stroke();
    if (o.tex !== false) { g.clip(); g.globalAlpha = 0.55; g.fillStyle = g.createPattern(fiber(), 'repeat'); g.fillRect(-50, -50, 1400, 900); }
    g.restore(); };
  const jag = (pts, amp, seed) => XY.wobble(XY.densify(pts, 14, true), amp, seed, 0.08);

  // ------------------------------------------------------------ the static set
  const paintBg = (g, W, H, S) => {
    g.fillStyle = '#E6C484'; g.fillRect(0, 0, W, H);
    const r = XY.rng(7201);
    for (let k = 0; k < 90; k++) { const y = r() * 620, x = r() * W - 100, w = 120 + r() * 360; g.strokeStyle = r() < 0.5 ? 'rgba(255,236,190,0.35)' : 'rgba(190,140,70,0.25)'; g.lineWidth = 6 + r() * 16; g.lineCap = 'round';
      g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + w / 2, y + (r() - 0.5) * 20, x + w, y + (r() - 0.5) * 10); g.stroke(); }
    const vg = g.createRadialGradient(W * 0.4, 260, 80, W * 0.4, 300, 900); vg.addColorStop(0, 'rgba(255,240,200,0.35)'); vg.addColorStop(1, 'rgba(120,70,20,0.3)'); g.fillStyle = vg; g.fillRect(0, 0, W, H);
    // cut-paper hills, two layers
    cut(g, jag([-20, 520, 160, 420, 330, 470, 520, 380, 700, 450, 880, 400, 1060, 440, 1200, 410, 1200, 640, -20, 640], 4, 1), '#C8986A', { S });
    cut(g, jag([-20, 580, 120, 520, 300, 560, 470, 500, 640, 560, 820, 520, 1000, 560, 1200, 530, 1200, 660, -20, 660], 4, 2), '#B0784A', { S });
    // houses with cracked walls and striped paper roofs
    [[40, 470, 150, 170], [210, 500, 120, 140], [420, 486, 140, 154]].forEach(([x, y, w, h], k) => {
      cut(g, [x, y, x + w, y, x + w, y + h, x, y + h], '#EAD8B6', { S });
      for (let c = 0; c < 3; c++) { const cx = x + 20 + c * w / 3, P = [cx, y + 20]; for (let j = 1; j < 6; j++) P.push(cx + (j % 2 ? 6 : -4), y + 20 + j * 16); g.strokeStyle = '#7A5A3A'; g.lineWidth = 1.6; XY.path(g, P, false); g.stroke(); }
      cut(g, [x - 16, y + 4, x + w / 2, y - 46, x + w + 16, y + 4], '#6E5E54', { S });
      g.strokeStyle = 'rgba(30,20,16,0.5)'; g.lineWidth = 2; for (let s = 1; s < 5; s++) { g.beginPath(); g.moveTo(x - 16 + s * (w + 32) / 10, y + 4 - s * 10); g.lineTo(x + w + 16 - s * (w + 32) / 10, y + 4 - s * 10); g.stroke(); }
      cut(g, [x + w / 2 - 18, y + h - 60, x + w / 2 + 18, y + h - 60, x + w / 2 + 18, y + h, x + w / 2 - 18, y + h], '#8A5A34', { S, blur: 3, dx: 2, dy: 2 });
      cut(g, [x + 14, y + 30, x + 44, y + 30, x + 44, y + 58, x + 14, y + 58], '#4A3A30', { S, blur: 3, dx: 2, dy: 2 }); });
    // withered trees
    [[370, 640, 1], [700, 650, -1]].forEach(([x, y, d], k) => { const br = (x0, y0, a, l, n) => { if (n === 0) return; const x1 = x0 + cos(a) * l, y1 = y0 + sin(a) * l;
      cut(g, XY.RIG.capsule([x0, y0], [x1, y1], n * 2.2, n * 1.6), '#7A5034', { S, blur: 4, dx: 3, dy: 3, ew: 1.4 }); br(x1, y1, a - 0.5 * d, l * 0.7, n - 1); br(x1, y1, a + 0.45 * d, l * 0.62, n - 1); };
      br(x, y, -PI / 2, 70, 4); });
    // cracked earth tiles (two depths) and the gold paper strip on the walking line
    g.fillStyle = '#5E4028'; g.fillRect(0, 640, W, 140);
    const tiles = (y0, y1, wd, sd) => { const R = XY.rng(sd); for (let x = -20; x < W + 20;) { const w = wd * (0.7 + R() * 0.6), j = () => (R() - 0.5) * 6;
      cut(g, [x + 3 + j(), y0 + 3 + j(), x + w - 3 + j(), y0 + 3 + j(), x + w - 3 + j(), y1 - 3 + j(), x + 3 + j(), y1 - 3 + j()], R() < 0.5 ? '#DCB888' : '#D2AE7E', { S, blur: false, ew: 1.2, edge: '#E8CCA0' }); x += w; } };
    tiles(640, 672, 46, 3); tiles(672, 702, 60, 4); tiles(704, 742, 84, 5); tiles(742, 780, 104, 6);
    cut(g, [0, 699, W, 699, W, 705, 0, 705], '#D8A848', { S, blur: 4, dx: 0, dy: 3, ew: 1 });
  };

  // ------------------------------------------------------------ moving set pieces (all on the 12 fps clock tq; uq = cell progress at tq)
  const str = (g, x0, y0, x1, y1) => { g.strokeStyle = 'rgba(70,60,50,0.75)'; g.lineWidth = 1; g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.stroke(); };
  const lite = { blur: 5, dx: 3, dy: 4 };
  // 披香殿: a paper cloud shelf on strings carrying the rice hill + chick, the flour hill + golden dog, the gold lock + lamp
  const heaven = (g, uq, tq, S) => {
    const o = Object.assign({ S }, lite), eat = 1 - XY.easeIn((uq - 0.1) / (SNAP - 0.1)), fr = floor(tq * 6) % 2;
    [660, 900, 1140].forEach(x => str(g, x, 0, x, 214));
    const shelf = []; for (let x = 640; x <= 1160; x += 26) shelf.push(x, 236 + 8 * sin(x * 0.2)); shelf.push(1160, 212, 640, 212); cut(g, shelf, '#F4F0E6', o);
    cut(g, [846, 236, 954, 236, 954, 268, 846, 268], '#7A2A20', Object.assign({}, o, { blur: 4 })); g.font = XY.font(24, XY.cnFont.kai, 'bold'); g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = '#F0D070'; g.fillText('披香殿', 900, 253); g.textAlign = 'left'; g.textBaseline = 'alphabetic';
    // rice hill and the chick
    if (eat > 0.02) { const h = 80 * eat; cut(g, [670, 214, 730, 214 - h, 790, 214], '#F2ECD8', o); g.fillStyle = '#D8CCA8'; for (let k = 0; k < 18; k++) { const q = XY.hash(k, 1), y = 214 - h * q * 0.9, hw = 60 * (1 - q * 0.9) * XY.hash(k, 2); g.fillRect(730 - 60 * (1 - q) + 2 * hw, y, 3, 2); } }
    { const x = 800, y = 210, pk = fr && uq < SNAP + 0.02; cut(g, XY.ellipse(x, y - 10, 14, 10, 12), '#F0C850', o); cut(g, XY.ellipse(x - 12, y - (pk ? 10 : 22), 7, 7, 10), '#F0C850', o);
      g.fillStyle = '#D83020'; g.beginPath(); g.arc(x - 12, y - (pk ? 17 : 29), 3, 0, TAU); g.fill(); g.fillStyle = '#E88A20'; g.beginPath(); g.moveTo(x - 19, y - (pk ? 10 : 22)); g.lineTo(x - 26, y - (pk ? 6 : 21)); g.lineTo(x - 18, y - (pk ? 7 : 19)); g.fill(); }
    // flour hill and the golden dog
    if (eat > 0.02) { const h = 70 * eat; cut(g, XY.RIG.spline([846, 214, 870, 214 - h * 0.7, 900, 214 - h, 930, 214 - h * 0.7, 954, 214], false, 4).concat([954, 214]), '#FFFFFF', o); }
    { const x = 980, y = 210, lk = fr && uq < SNAP + 0.02; cut(g, XY.ellipse(x, y - 14, 22, 12, 14), '#E0A848', o); cut(g, XY.ellipse(x - 22, y - 24, 11, 10, 12), '#E0A848', o);
      cut(g, XY.ellipse(x - 16, y - 32, 5, 9, 8, 0.4), '#B07A30', o); g.fillStyle = '#2A1A10'; g.beginPath(); g.arc(x - 27, y - 26, 1.8, 0, TAU); g.fill();
      if (lk) { g.fillStyle = '#E8607A'; g.beginPath(); g.ellipse(x - 34, y - 18, 3, 6, 0.3, 0, TAU); g.fill(); } [x - 14, x + 12].forEach(lx => cut(g, [lx - 3, y - 6, lx + 3, y - 6, lx + 3, y + 2, lx - 3, y + 2], '#E0A848', Object.assign({}, o, { blur: false }))); }
  };
  const lock = (g, uq, tq, S, tSnap) => {
    const o = Object.assign({ S }, lite), heat = XY.smooth((uq - 0.25) / (SNAP - 0.25)), d = Math.max(0, tq - tSnap), broke = uq >= SNAP;
    const sw = broke ? Math.min(1.1, d * 3) : 0, by = broke ? 140 + Math.min(70, d * d * 600) : 140; str(g, 1060, 0, 1060, by);
    cut(g, [1040, by, 1080, by, 1080, by + 34, 1040, by + 34], '#E2B03C', o); g.fillStyle = '#7A5014'; g.beginPath(); g.arc(1060, by + 14, 4, 0, TAU); g.fill(); g.fillRect(1058, by + 14, 4, 12);
    g.save(); g.translate(1046, by); g.rotate(-sw); g.strokeStyle = '#C89A30'; g.lineWidth = 5; g.beginPath(); g.arc(14, 0, 14, PI, TAU); g.stroke(); g.restore();
    // the bar (锁梃) running out of the lock over the lamp; red hot, then two pieces falling
    const col = `rgb(${round(90 + 160 * heat)},${round(80 - 30 * heat)},${round(70 - 40 * heat)})`;
    if (!broke) cut(g, [1080, by + 22, 1150, by + 22, 1150, by + 30, 1080, by + 30], col, Object.assign({}, o, { tex: false }));
    else [[1080, 1114, -1], [1116, 1150, 1]].forEach(([x0, x1, s]) => { g.save(); g.translate((x0 + x1) / 2, by + 26 + d * d * 900); g.rotate(s * d * 6); cut(g, [x0 - (x0 + x1) / 2, -4, x1 - (x0 + x1) / 2, -4, x1 - (x0 + x1) / 2, 4, x0 - (x0 + x1) / 2, 4], col, Object.assign({}, o, { tex: false })); g.restore(); });
    // the lamp and its flame
    cut(g, [1100, 196, 1140, 196, 1132, 206, 1108, 206], '#8A6A3A', o); cut(g, [1116, 206, 1124, 206, 1124, 214, 1116, 214], '#6A4A2A', Object.assign({}, o, { blur: false }));
    if (!broke || d < 0.3) { const fh = (broke ? 1 - d / 0.3 : 1) * (26 + 6 * (floor(tq * 12) % 3)); cut(g, [1110, 196, 1120, 196 - fh, 1130, 196], '#F8A030', Object.assign({}, o, { blur: false, tex: false })); cut(g, [1115, 196, 1120, 196 - fh * 0.55, 1125, 196], '#FFE070', Object.assign({}, o, { blur: false, tex: false })); }
    if (broke && d < 0.4) for (let k = 0; k < 16; k++) { const a = XY.hash(k, 1) * TAU, r = 20 + d * 260 * (0.5 + XY.hash(k, 2)), x = 1115 + cos(a) * r, y = by + 26 + sin(a) * r * 0.7 + d * d * 300;
      g.fillStyle = k % 2 ? '#F8C040' : '#F06020'; g.beginPath(); g.moveTo(x, y - 5); g.lineTo(x + 4, y + 3); g.lineTo(x - 4, y + 3); g.fill(); }
  };
  // a paper cloud on a string: white side up in the drought, flips over to its blue-grey rain side on the snap
  const cloud = (g, x, y, s, flip, sway, S) => { g.save(); g.translate(x, y); str(g, 0, -y, 0, -30 * s);
    g.rotate(0.04 * sway); g.scale(1, Math.cos(flip * PI) || 0.02);
    const P = XY.RIG.spline([-70, 10, -66, -14, -40, -30, -10, -24, 10, -40, 44, -30, 66, -10, 72, 12], true, 4).map(v => v * s);
    cut(g, P, flip < 0.5 ? '#FFFFFF' : '#7E8CA4', { S, blur: 6, dx: 4, dy: 5 }); g.restore(); };
  // the 郡侯 kneeling at the incense table, kowtowing on the 12 fps clock
  const official = (g, tq, S, rain) => { const o = Object.assign({ S }, lite), ph = floor(tq * 12) % 12, bow = rain ? -0.15 : ph < 4 ? 0 : ph < 8 ? 1 : 0.4 * (12 - ph) / 4, x = 1000, y = 0;
    g.save(); g.translate(1990, 640); g.scale(-0.9, 0.9);   // set back a layer (base y 640) and turned to face the table on his left
    cut(g, [x + 40, y - 46, x + 120, y - 46, x + 120, y - 38, x + 40, y - 38], '#8A3A24', o); cut(g, [x + 46, y - 38, x + 52, y - 38, x + 52, y, x + 46, y], '#6A2A1A', o); cut(g, [x + 108, y - 38, x + 114, y - 38, x + 114, y, x + 108, y], '#6A2A1A', o);
    cut(g, [x + 66, y - 62, x + 94, y - 62, x + 90, y - 46, x + 70, y - 46], '#B88A3A', o); for (let k = 0; k < 3; k++) { str(g, x + 74 + k * 6, y - 62, x + 74 + k * 6, y - 84); if (!rain) { g.fillStyle = '#F06020'; g.fillRect(x + 73 + k * 6, y - 86, 2, 2); } }
    g.save(); g.translate(x, y); g.scale(1.3, 1.3); cut(g, [-34, 0, 18, 0, 14, -26, -30, -30], '#3A5A8A', o);
    g.rotate(bow * 0.9); cut(g, [-16, -24, 10, -24, 14, -62, -12, -64], '#3A5A8A', o); cut(g, XY.ellipse(4, -74, 12, 12, 12), '#F0D0A8', o); cut(g, [-10, -82, 16, -82, 14, -92, -8, -92], '#1A1A20', o);
    cut(g, [-14, -88, -26, -86, -26, -82, -12, -84], '#1A1A20', Object.assign({}, o, { blur: false })); cut(g, [14, -88, 28, -86, 28, -82, 14, -84], '#1A1A20', Object.assign({}, o, { blur: false })); g.restore(); g.restore(); };
  // the whole commandery repents: paper townsfolk pop up behind the hills with incense, and throw up their arms when it rains
  const townsfolk = (g, uq, tq, S) => { for (let k = 0; k < 9; k++) { const x = 600 + k * 62 + 14 * XY.hash(k, 3), q = XY.clamp((uq - 0.2 - k * 0.018) / 0.06); if (q <= 0) continue;
    const y = 590 - 44 * XY.easeOut(q) + (uq >= SNAP ? -6 * Math.abs(sin(tq * 9 + k)) : 0), o = { S, blur: 3, dx: 2, dy: 2, ew: 1.4 }, cheer = uq >= SNAP + 0.02;
    cut(g, [x - 13, y + 30, x - 11, y, x + 11, y, x + 13, y + 30], ['#6A7A9A', '#9A5A3A', '#5A8A6A'][k % 3], o); cut(g, XY.ellipse(x, y - 10, 9, 10, 10), '#F0D0A8', o);
    if (cheer) { cut(g, [x - 10, y + 4, x - 22, y - 26, x - 16, y - 28, x - 6, y + 2], '#F0D0A8', o); cut(g, [x + 10, y + 4, x + 22, y - 26, x + 16, y - 28, x + 6, y + 2], '#F0D0A8', o); }
    else { str(g, x + 8, y + 4, x + 12, y - 30); g.fillStyle = '#F06020'; g.fillRect(x + 11, y - 32, 3, 3); const sq = (tq * 0.8 + k * 0.3) % 1; g.strokeStyle = `rgba(250,246,234,${0.8 * (1 - sq)})`; g.lineWidth = 2; g.beginPath(); g.arc(x + 12 + 4 * sin(sq * 6), y - 36 - 26 * sq, 3 + 3 * sq, 0, TAU); g.stroke(); } } };
  // 求 雨 cards on a line, the 第七十二难 tag
  const cards = (g, uq, S) => { const drop = q => { if (q <= 0) return -260; if (q >= 1) return 0; return -260 * (1 - q) * (1 - q) + 30 * sin(q * PI * 3) * (1 - q); };
    g.strokeStyle = 'rgba(70,60,50,0.8)'; g.lineWidth = 1.4; g.beginPath(); g.moveTo(0, 40); g.quadraticCurveTo(170, 66, 340, 40); g.stroke();
    ['求', '雨'].forEach((ch, k) => { const q = XY.clamp((uq + 0.05 - k * 0.05) / 0.14), x = 50 + k * 110, y = 56 + drop(q), rot = (k ? 0.06 : -0.05);
      g.save(); g.translate(x + 46, y); g.rotate(rot); str(g, 0, -30, 0, 0); g.translate(-46, 0); cut(g, [0, 0, 92, 0, 92, 92, 0, 92], '#C8302A', { S, blur: 6, dx: 4, dy: 5 });
      g.font = XY.font(66, XY.cnFont.hei, '900'); g.textAlign = 'center'; g.textBaseline = 'middle'; g.lineWidth = 6; g.strokeStyle = PAPER; g.lineJoin = 'round'; g.strokeText(ch, 46, 50); g.fillStyle = '#C8302A'; g.fillText(ch, 46, 50); g.restore(); });
    const q = XY.clamp((uq - 0.02) / 0.14), y = 64 + drop(q); g.save(); g.translate(286, y); g.rotate(0.08); str(g, 0, -30, 0, 0);
    cut(g, [-16, 0, 16, 0, 22, 12, 22, 196, -22, 196, -22, 12], '#F2E6C8', { S, blur: 5, dx: 3, dy: 4 }); g.fillStyle = '#8A6A4A'; g.beginPath(); g.arc(0, 10, 3, 0, TAU); g.fill();
    g.font = XY.font(28, XY.cnFont.kai, 'bold'); g.fillStyle = '#3A2A1A'; g.textAlign = 'center'; g.textBaseline = 'middle'; [...'第七十二难'].forEach((c, k) => g.fillText(c, 0, 36 + k * 32)); g.restore(); };

  // ------------------------------------------------------------ the cell
  const PINS = { wukong: [0, 1, 3, 4], monk: [0, 1, 2, 3, 7, 8], bajie: [0, 1, 3, 4], shaseng: [0, 1, 3, 4] };
  XY.STYLES.paperpuppet = {
    hits: [4],
    post(canvas, g, e) { K.zoomPost(canvas, g, e, 900, 330, K.push(e.beat, 3.85, 5.8, 0.08)); },
    bg(g, W, H, c, S) { paintBg(g, W, H, S); },
    draw(g, e) {
      const { W, H, t } = e, S = e.S, c = e.cell, tq = Math.floor(t * 12) / 12, uq = (tq - c.t0) / c.dur, tSnap = c.t0 + SNAP * c.dur, rain = uq >= SNAP, rr = XY.clamp((tq - tSnap) / 0.5);
      const jx = (XY.hash(floor(t * 12), 1) - 0.5) * 1.2, jy = (XY.hash(floor(t * 12), 2) - 0.5) * 1.2;
      g.save(); g.translate(jx, jy);
      if (rain) { g.fillStyle = `rgba(70,90,120,${0.35 * rr})`; g.fillRect(0, 0, W, 640); }
      // the paper sun on its stick: wobbling, then pulled down out of the sky once it rains
      { const sy = 150 - (rain ? 320 * XY.easeIn(rr) : 0) + 4 * sin(tq * 3), sx = 470;   // the paper sun hangs on a string and is hauled up out of the sky when it rains
        str(g, sx, -10, sx, sy - 56);
        const ray = []; for (let k = 0; k < 24; k++) { const a = k / 24 * TAU + tq * 0.4, r = k % 2 ? 46 : 60; ray.push(sx + cos(a) * r, sy + sin(a) * r); }
        cut(g, ray, '#F0A030', { S }); cut(g, XY.ellipse(sx, sy, 38, 38, 20), '#F8D048', { S, blur: false }); }
      [[380, 92, 0.75], [600, 62, 0.85], [810, 84, 0.9], [1050, 66, 0.8]].forEach(([x, y, s], k) => cloud(g, x + 6 * sin(tq * 1.1 + k), y, s, rain ? XY.smooth((tq - tSnap - k * 0.05) / 0.25) : 0, sin(tq * 1.3 + k), S));
      heaven(g, uq, tq, S); lock(g, uq, tq, S, tSnap);
      townsfolk(g, uq, tq, S);
      official(g, tq, S, rain);
      this.ground(g, e, rr, rain);
      this.pilgrims(g, e);
      this.grass(g, e, uq);
      if (rain) this.rain(g, W, H, tq - tSnap);
      cards(g, uq, S);
      g.restore();
    },
    // wet earth and cellophane puddles once it rains
    ground(g, e, rr, rain) {
      if (!rain) return; const W = e.W;
      g.save(); g.globalCompositeOperation = 'multiply'; g.fillStyle = `rgba(150,120,96,${0.5 * rr})`; g.fillRect(0, 640, W, 140); g.restore();
      [[120, 728, 60], [380, 762, 46], [640, 722, 70], [880, 754, 52], [1100, 734, 58], [260, 690, 30]].forEach(([x, y, r], k) => { const R = r * rr;
        g.fillStyle = 'rgba(140,196,240,0.55)'; g.beginPath(); g.ellipse(x, y, R, R * 0.22, 0, 0, TAU); g.fill(); g.strokeStyle = 'rgba(255,255,255,0.8)'; g.lineWidth = 1.6; g.beginPath(); g.ellipse(x - R * 0.2, y - R * 0.05, R * 0.5, R * 0.08, 0, PI * 1.1, PI * 1.6); g.stroke();
        const ph = (floor(e.t * 12) + k * 5) % 8 / 8; g.strokeStyle = `rgba(255,255,255,${0.6 * (1 - ph)})`; g.beginPath(); g.ellipse(x + R * 0.3, y, 4 + 18 * ph, (4 + 18 * ph) * 0.25, 0, 0, TAU); g.stroke(); });
    },
    // paper grass in front: limp and yellow in the drought, flipped to green and upright one by one after the snap
    grass(g, e, uq) {
      for (let k = 0; k < 16; k++) { const x = 30 + k * 74 + 20 * XY.hash(k, 1), y = 714 + 58 * XY.hash(k, 2), f = XY.clamp((uq - SNAP - 0.03 - 0.014 * k) / 0.03), green = f > 0.5, sx = Math.max(0.06, Math.abs(cos(f * PI)));
        g.save(); g.translate(x, y); g.fillStyle = 'rgba(60,40,20,0.25)'; g.beginPath(); g.ellipse(3, 2, 16, 3, 0, 0, TAU); g.fill(); g.scale(sx, 1);
        for (let b = 0; b < 5; b++) { const a = -PI / 2 + (b - 2) * (green ? 0.26 : 0.5) + (green ? 0 : 0.35), L = green ? 32 + 10 * XY.hash(k, b + 3) : 20 + 4 * XY.hash(k, b + 3), bx = (b - 2) * 3;
          XY.path(g, [bx - 2.6, 0, bx + 2.6, 0, bx + cos(a) * L, sin(a) * L], true); g.fillStyle = green ? '#6AA84A' : '#C8A04A'; g.fill(); g.strokeStyle = PAPER; g.lineWidth = 1; g.stroke(); }
        g.restore(); }
    },
    // rain as paper confetti: strips and dots tumbling out of the clouds, stepped at 12 fps
    rain(g, W, H, dt) {
      const n = Math.min(170, floor(dt * 700) + 24), C = ['#9CC8F0', '#FFFFFF', '#6A9AD8'];
      for (let k = 0; k < n; k++) { const sp = 380 + 260 * XY.hash(k, 1), y0 = 70 + 60 * XY.hash(k, 2), tt = dt - XY.hash(k, 3) * 0.3; if (tt < 0) continue;
        const y = y0 + (tt * sp) % (H - y0 + 20), x = XY.hash(k, 4) * W + 14 * sin(tt * 3 + k); g.save(); g.translate(x, y); g.rotate(tt * 5 + k); g.fillStyle = C[k % 3];
        if (k % 3 === 1) { g.beginPath(); g.arc(0, 0, 2.8, 0, TAU); g.fill(); } else g.fillRect(-5, -1.6, 10, 3.2); g.restore(); }
    },
    // pilgrims as paper puppets: white cut edge, fibre, brass split pins at the rig's joints, a soft shadow on the set
    pilgrims(g, e) {
      const { u } = e, S = e.S, px = e.procX, gy = e.groundY, bx = px - 410, by = gy - 300, bw = 760, bh = 312;
      if (bx > e.W + 10 || bx + bw < -10) return;
      const w = Math.ceil(bw * S), h = Math.ceil(bh * S), acts = { wukong: { shade: K.win(u, 0.18, 0.46, 0.05), raise: K.win(u, 0.52, 0.85, 0.04) }, monk: { palm: K.win(u, 0.22, 0.52, 0.05) }, bajie: { scratch: K.win(u, 0.6, 0.98, 0.05) }, shaseng: { lift: K.win(u, 0.5, 0.58, 0.025) } };
      const phq = round(e.phase * 12) / 12, lay = XY.scratch('pp-lay', w, h), lg = lay.getContext('2d'); lg.setTransform(S, 0, 0, S, -bx * S, -by * S);
      XY.drawProcession(lg, phq, px, gy, PEN, acts);
      lg.save(); lg.globalCompositeOperation = 'source-atop'; lg.globalAlpha = 0.45; lg.fillStyle = lg.createPattern(fiber(), 'repeat'); lg.fillRect(bx, by, bw, bh); lg.restore();
      XY.procParts(phq, acts).forEach(F => { const idx = PINS[F.name]; if (!idx || (XY.CURRENT_CAST && XY.CURRENT_CAST[F.name] === false)) return;
        F.bones.forEach((b, bi) => { if (!idx.includes(bi)) return; for (let k = 2; k < b.length - 2; k += 2) { const x = px + F.x + b[k], y = gy + b[k + 1];
          lg.fillStyle = '#C8A040'; lg.beginPath(); lg.arc(x, y, 2.6, 0, TAU); lg.fill(); lg.fillStyle = '#6A4A10'; lg.beginPath(); lg.arc(x, y, 1, 0, TAU); lg.fill(); } }); });
      g.save(); g.shadowColor = 'rgba(50,30,10,0.38)'; g.shadowBlur = 8 * S; g.shadowOffsetX = 6 * S; g.shadowOffsetY = 5 * S; g.drawImage(lay, bx, by, bw, bh); g.restore();
    },
  };
})();
