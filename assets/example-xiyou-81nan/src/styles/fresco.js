// 22 文艺复兴湿壁画 · 1480 年 · 宝象国捎书 — a one-point-perspective piazza of 宝象国 painted in buon fresco: faded
// azurite sky, a domed temple on the vanishing point, the princess 百花羞 at a high window of the palazzo on the left,
// the king in a Corinthian loggia on the right. Beat 2: her letter slides down an incised gold ray (an Annunciation
// device) and lands in Tang Seng's raised palm. Beat 4: it hops into the king's hand, unfolds, and he weeps.
// Medium: lime plaster grain, giornata seams, a crack network, and a loss in the lower left where the paint has
// flaked to the red sinopia underdrawing — the pilgrims turn into sinopia lines while they walk across it.
// Entry: the fresco is painted giornata by giornata, top to bottom, over wet grey plaster with sinopia drawing.
(() => {
  'use strict';
  const XY = window.XY, K = XY.KIT_C, TAU = XY.TAU;
  const VP = [590, 330], HZ = 330, SIN = '#9A4630', INKF = '#4A2E1E';
  let SINO = false;                                     // sinopia pass: no colour, red-brown drawing only
  const fl = (g, col) => { if (!SINO) { g.fillStyle = col; g.fill(); } };
  const ln = (g, w = 1, a = 0.3) => { g.strokeStyle = SINO ? SIN : `rgba(70,44,28,${a})`; g.lineWidth = SINO ? Math.max(1.3, w) : w; g.stroke(); };
  const shape = (g, pts, col, w = 1, a = 0.3) => { XY.path(g, pts, true); fl(g, col); ln(g, w, a); };
  const P = (xf, z, Y) => [VP[0] + (xf - VP[0]) / z, HZ + (Y - HZ) / z];   // a point at depth z on the plane through front-plane (xf, Y)
  const quad = (a, b, c, d) => [...a, ...b, ...c, ...d];
  const COL = { horse: '#EDE6D6', horse2: '#D2C8B6', mane: '#E4DCCB', hoof: '#5A4636', saddle: '#7A3A2A', red: '#A8432E', robe: '#D6B068', kasaya: '#A8432E',
    skin: '#E6C6A2', metal: '#B89A58', gold: '#C9A458', ink: INKF, bjrobe: '#535A6E', bjpants: '#464C5E', pig: '#E2B2A0', pig2: '#C99482', wood: '#8A6440',
    ssrobe: '#6E8A6A', ssrobe2: '#5A745A', skin2: '#C09474', ssh: '#9A4630', ssbeard: '#8A3E2A', skull: '#ECE4D2', bundle: '#C8A060' };
  const PEN = { color: r => COL[r] || XY.DEFAULT_COLORS[r], outline: '#6A4630', ow: 1.2, wob: 0.5, seed: 22, shade: 'rgba(90,50,30,0.16)' };
  const SPEN = { color: r => (r === 'ink' ? SIN : 'rgba(0,0,0,0)'), outline: SIN, ow: 1.5, wob: 1.4, seed: 23, shade: false, fine: true };

  // ------------------------------------------------------------ the painted architecture
  const sky = (g, W) => {
    if (SINO) { g.strokeStyle = SIN; g.lineWidth = 1.3; g.beginPath(); g.moveTo(0, HZ); g.lineTo(W, HZ); g.stroke(); return; }
    const gr = g.createLinearGradient(0, 24, 0, HZ); gr.addColorStop(0, '#8EA2B2'); gr.addColorStop(0.7, '#B9C2C2'); gr.addColorStop(1, '#DCD6C2'); g.fillStyle = gr; g.fillRect(0, 0, W, HZ + 4);
    [[300, 120, 90], [760, 90, 120], [1010, 140, 70]].forEach(([x, y, w]) => { g.fillStyle = 'rgba(240,236,224,0.55)'; for (let k = 0; k < 4; k++) { g.beginPath(); g.ellipse(x + (k - 1.5) * w * 0.45, y - (k % 2) * 8, w * 0.38, 16, 0, 0, TAU); g.fill(); } });
  };
  const hills = (g, W) => {
    g.beginPath(); g.moveTo(0, HZ + 2); for (let x = 0; x <= W; x += 20) g.lineTo(x, HZ - 18 - 26 * Math.max(0, Math.sin(x / 150 + 1)) - 10 * Math.sin(x / 43)); g.lineTo(W, HZ + 2); g.closePath(); fl(g, '#A7A47A'); ln(g, 1, 0.25);
    for (let k = 0; k < 16; k++) { const x = 30 + k * 72 + 20 * Math.sin(k * 3), y = HZ - 14 - 20 * Math.max(0, Math.sin(x / 150 + 1)), h = 26 + 10 * XY.hash(k, 4);
      g.beginPath(); g.moveTo(x, y - h); g.quadraticCurveTo(x + 6, y - h * 0.4, x + 1, y); g.quadraticCurveTo(x - 6, y - h * 0.4, x, y - h); fl(g, '#4E5A3A'); ln(g, 0.8, 0.3); }
  };
  const pavement = g => {
    const zs = []; for (let z = 1; z < 3.6; z *= 1.16) zs.push(z);
    for (let i = 0; i < zs.length - 1; i++) for (let k = -9; k < 12; k++) {
      const x0 = VP[0] + k * 110 - 55, x1 = x0 + 110, a = P(x0, zs[i], 702), b = P(x1, zs[i], 702), c = P(x1, zs[i + 1], 702), d = P(x0, zs[i + 1], 702);
      shape(g, quad(a, b, c, d), (i + k) % 2 ? '#D6B4A0' : '#CAC4B4', 0.8, 0.25);
    }
  };
  const roofT = (g, cx, y, w, h, col) => {   // a Chinese hip roof with upturned eaves, softly modelled in fresco
    XY.path(g, [cx - w / 2 - 14, y, cx - w / 2 + 6, y - h, cx + w / 2 - 6, y - h, cx + w / 2 + 14, y, cx + w / 2 + 22, y - 8, cx - w / 2 - 22, y - 8], true); fl(g, col); ln(g, 1, 0.45);
    for (let k = 1; k < 10; k++) { const x = cx - w / 2 + k * w / 10; g.beginPath(); g.moveTo(x, y - h + 2); g.lineTo(x + (x - cx) * 0.06, y - 2); ln(g, 0.7, 0.25); }
    shape(g, [cx - w / 2 + 4, y - h - 4, cx + w / 2 - 4, y - h - 4, cx + w / 2 - 4, y - h + 2, cx - w / 2 + 4, y - h + 2], '#8A5A3A', 0.8, 0.4);
  };
  const temple = g => {   // 宝象国's city gate on the vanishing point: wall, arched gate, a two-storey tower
    const z = 2.6, L = 330, R = 850, f = (x, Y) => P(x, z, Y);
    shape(g, quad(f(L - 30, 702), f(R + 30, 702), f(R + 30, 420), f(L - 30, 420)), '#C9B08A');
    for (let k = 0; k < 7; k++) { const a = f(L - 30, 702 - k * 40), b = f(R + 30, 702 - k * 40); g.beginPath(); g.moveTo(...a); g.lineTo(...b); ln(g, 0.7, 0.2); }
    const g0 = f(530, 702), g1 = f(650, 520); g.beginPath(); g.moveTo(g0[0], g0[1]); g.lineTo(g0[0], g1[1] + 14); g.quadraticCurveTo((g0[0] + g1[0]) / 2, g1[1] - 10, g1[0], g1[1] + 14); g.lineTo(g1[0], g0[1]); g.closePath(); fl(g, '#4A3426'); ln(g, 1, 0.4);
    const t0 = f(400, 420), t1 = f(780, 300); shape(g, [t0[0], t0[1], t1[0], t0[1], t1[0], t1[1], t0[0], t1[1]], '#B8443A', 1, 0.4);
    for (let k = 1; k < 6; k++) { const x = XY.lerp(t0[0], t1[0], k / 6); shape(g, [x - 3, t0[1], x + 3, t0[1], x + 3, t1[1], x - 3, t1[1]], '#8A2E24', 0.6, 0.3); }
    const cx = (t0[0] + t1[0]) / 2, w = t1[0] - t0[0]; roofT(g, cx, t1[1], w + 30, 22, '#C9A458');
    shape(g, [cx - w * 0.36, t1[1] - 22, cx + w * 0.36, t1[1] - 22, cx + w * 0.36, t1[1] - 52, cx - w * 0.36, t1[1] - 52], '#B8443A', 1, 0.4);
    roofT(g, cx, t1[1] - 52, w * 0.82, 20, '#C9A458');
    return [cx, t1[1] - 76];
  };
  const palazzo = g => {   // left: the cliff of 波月洞, with the princess's carved window and the cave gate below
    const pts = [0, 110, 120, 96, 210, 130, 262, 180, 250, 300, 276, 420, 258, 560, 282, 702, 0, 702]; XY.path(g, XY.RIG.spline(pts, false, 4), false); g.lineTo(0, 702); g.closePath();
    fl(g, SINO ? null : (() => { const gr = g.createLinearGradient(0, 0, 280, 0); gr.addColorStop(0, '#8A6E52'); gr.addColorStop(0.7, '#B8987A'); gr.addColorStop(1, '#7A5E46'); return gr; })()); ln(g, 1.4, 0.45);
    for (let k = 0; k < 9; k++) { const y = 150 + k * 62; g.beginPath(); g.moveTo(0, y); g.bezierCurveTo(80, y - 14, 160, y + 12, 250, y - 6); ln(g, 0.9, 0.25); }
    g.beginPath(); g.moveTo(84, 322); g.lineTo(84, 232); g.quadraticCurveTo(146, 160, 208, 232); g.lineTo(208, 322); g.closePath(); fl(g, '#3E3028'); ln(g, 1.4, 0.5);
    g.beginPath(); g.moveTo(76, 326); g.lineTo(76, 230); g.quadraticCurveTo(146, 146, 216, 230); g.lineTo(216, 326); ln(g, 3, 0.45);
    shape(g, [70, 322, 222, 322, 214, 344, 78, 344], '#C8B49A', 1, 0.45);
    g.beginPath(); g.moveTo(30, 702); g.lineTo(30, 600); g.quadraticCurveTo(100, 546, 170, 600); g.lineTo(170, 702); g.closePath(); fl(g, '#3A2C22'); ln(g, 1.2, 0.45);
    shape(g, [52, 560, 148, 560, 148, 586, 52, 586], '#D8C8A8', 1, 0.45);
    g.fillStyle = SINO ? SIN : '#5A3A28'; g.font = XY.font(20, XY.cnFont.kai, 'bold'); g.textAlign = 'center'; g.fillText('波 月 洞', 100, 580); g.textAlign = 'left';
    for (let k = 0; k < 5; k++) { const x = 200 + k * 14, y = 140 + k * 6; g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + 10, y - 20, x + 22, y - 12); ln(g, 1.2, 0.4); }
  };
  const KX = 1074, KY = 516;   // the king's throne stands on the palace terrace, above the pilgrims' heads
  const loggia = g => {   // right: 宝象国's 金銮殿 on a raised terrace with a stair, red columns, a golden roof
    shape(g, [870, KY, 1180, KY, 1180, 702, 930, 702], '#C8B496', 1, 0.4);
    for (let k = 0; k < 8; k++) { const y = KY + 8 + k * 23, x = XY.lerp(870, 930, (y - KY) / (702 - KY)); g.beginPath(); g.moveTo(x - 10, y); g.lineTo(x + 34, y); ln(g, 1, 0.35); }
    for (let y = KY + 26; y < 702; y += 26) { const x0 = XY.lerp(870, 930, (y - KY) / (702 - KY)) + 30; g.beginPath(); g.moveTo(x0, y); g.lineTo(1180, y); ln(g, 0.8, 0.28);
      for (let x = x0 + ((y / 26) % 2) * 30; x < 1180; x += 60) { g.beginPath(); g.moveTo(x, y); g.lineTo(x, y - 26); ln(g, 0.6, 0.22); } }
    g.beginPath(); g.moveTo(870, KY); g.lineTo(930, 702); g.moveTo(900, KY); g.lineTo(960, 702); ln(g, 1.6, 0.45);
    shape(g, [862, KY - 14, 1180, KY - 14, 1180, KY, 862, KY], '#E2D6BC', 1, 0.4);
    for (let x = 870; x < 1180; x += 22) shape(g, [x, KY - 40, x + 8, KY - 40, x + 8, KY - 14, x, KY - 14], '#E2D6BC', 0.8, 0.35);
    shape(g, [862, KY - 46, 1180, KY - 46, 1180, KY - 40, 862, KY - 40], '#E2D6BC', 0.8, 0.35);
    shape(g, [960, KY - 46, 1180, KY - 46, 1180, 150, 960, 150], '#6A4A3A', 1, 0.35);
    [970, 1040, 1110, 1170].forEach(x => shape(g, [x - 9, KY - 46, x + 9, KY - 46, x + 8, 150, x - 8, 150], '#B8382A', 1, 0.4));
    roofT(g, 1080, 150, 250, 40, '#D4AA52');
    shape(g, [1010, 74, 1150, 74, 1150, 106, 1010, 106], '#3E5446', 1.2, 0.5);
    g.fillStyle = SINO ? SIN : '#E2C26A'; g.font = XY.font(22, XY.cnFont.kai, 'bold'); g.textAlign = 'center'; g.fillText('金 銮 殿', 1080, 98); g.textAlign = 'left';
  };
  const dado = (g, W) => {
    shape(g, [0, 702, W, 702, W, 714, 0, 714], '#B8A48A', 1, 0.35);
    for (let k = 0; k < 5; k++) { const x0 = 18 + k * (W - 36) / 5, x1 = x0 + (W - 36) / 5 - 14; shape(g, [x0, 722, x1, 722, x1, 774, x0, 774], k % 2 ? '#C8B09A' : '#B9A6A0', 1.4, 0.45);
      if (!SINO) { const R = XY.rng(60 + k); g.strokeStyle = 'rgba(120,80,64,0.45)'; g.lineWidth = 1; for (let q = 0; q < 5; q++) { g.beginPath(); let x = x0 + R() * (x1 - x0), y = 722; g.moveTo(x, y); while (y < 774) { x += (R() - 0.5) * 20; y += 6 + R() * 8; g.lineTo(x, Math.min(774, y)); } g.stroke(); } } }
  };
  const frame = (g, W) => {
    shape(g, [0, 0, W, 0, W, 24, 0, 24], '#7A3A2A', 1, 0.4); shape(g, [0, 24, 14, 24, 14, 702, 0, 702], '#7A3A2A'); shape(g, [W - 14, 24, W, 24, W, 702, W - 14, 702], '#7A3A2A');
    for (let x = 8; x < W; x += 22) { g.beginPath(); g.ellipse(x, 12, 6, 7, 0, 0, TAU); fl(g, '#C9A060'); ln(g, 0.8, 0.4); g.beginPath(); g.moveTo(x + 11, 4); g.lineTo(x + 11, 20); ln(g, 1.4, 0.5); }
    // a lacquered plaque (匾) with the cell's words, and the cell number in the painted frame
    const x0 = 450, x1 = 730, y0 = 14, y1 = 96;
    shape(g, [x0, y0, x1, y0, x1, y1, x0, y1], '#7A2A22', 2.4, 0.6); shape(g, [x0 + 9, y0 + 9, x1 - 9, y0 + 9, x1 - 9, y1 - 9, x0 + 9, y1 - 9], '#2E3E36', 1.2, 0.5);
    g.fillStyle = SINO ? SIN : '#E2C26A'; g.font = XY.font(52, XY.cnFont.kai, 'bold'); g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('捎 书', (x0 + x1) / 2, (y0 + y1) / 2 + 2);
    g.font = XY.font(28, 'Optima, "Gill Sans", serif', '600'); g.fillStyle = SINO ? SIN : '#E2C9A0'; g.fillText('XXII', W - 62, 50); g.textAlign = 'left'; g.textBaseline = 'alphabetic';
  };
  let LANTERN = [590, 200];
  const farGround = (g, W) => {   // the land beyond the piazza and a crenellated city wall
    shape(g, [0, HZ, W, HZ, W, 446, 0, 446], '#BFB38C', 0.8, 0.2);
    shape(g, [0, 404, W, 404, W, 436, 0, 436], '#D2C4A4', 1, 0.3);
    for (let x = 0; x < W; x += 18) shape(g, [x, 404, x + 10, 404, x + 10, 396, x, 396], '#D2C4A4', 0.8, 0.3);
    [160, 420, 760, 1000].forEach(x => { shape(g, [x - 14, 436, x + 14, 436, x + 14, 380, x - 14, 380], '#CDBE9C', 1, 0.3); shape(g, [x - 16, 380, x + 16, 380, x, 362], '#A8432E', 1, 0.3); });
  };
  const scene = (g, W, H) => { sky(g, W); hills(g, W); farGround(g, W); pavement(g); LANTERN = temple(g); palazzo(g); loggia(g); dado(g, W); frame(g, W); void H; };
  // giornate: the day-patches of plaster, painted top to bottom; seams stay faintly visible
  const hb = (y0, x) => y0 + 12 * XY.noise1(x / 70, y0);
  const vb = (x0, y) => x0 + 14 * XY.noise1(y / 60, x0 + 3);
  const ROWS = [-10, 300, 560, 790], SPLITS = [[600], [380, 800], [560]];
  const GIOR = []; ROWS.slice(0, 3).forEach((y0, r) => { const xs = [-10, ...SPLITS[r], 1200];
    for (let k = 0; k < xs.length - 1; k++) { const p = [], a = xs[k], b = xs[k + 1], y1 = ROWS[r + 1];
      for (let x = a; x <= b; x += 20) p.push(x, r === 0 ? -10 : hb(y0, x));
      for (let y = y0; y <= y1; y += 20) p.push(k === xs.length - 2 ? 1200 : vb(b, y), y);
      for (let x = b; x >= a; x -= 20) p.push(x, r === 2 ? 790 : hb(y1, x));
      for (let y = y1; y >= y0; y -= 20) p.push(k === 0 ? -10 : vb(a, y), y);
      GIOR.push(p); } });
  const LOSS = [[420, 250, 58, 40, 1], [826, 116, 64, 34, 2], [1146, 300, 26, 40, 3]].map(([cx, cy, rx, ry, s]) => { const p = [];
    for (let k = 0; k < 28; k++) { const a = k / 28 * TAU, r = 1 + 0.28 * XY.noise1(k * 0.7, s) + 0.12 * XY.noise1(k * 2.3, s + 9); p.push(cx + Math.cos(a) * rx * r, cy + Math.sin(a) * ry * r); } return p; });
  const sinoLayer = (W, H, scale) => XY.cached(`fr-sino:${scale.toFixed(4)}`, W * scale, H * scale, cv => { const g = cv.getContext('2d'); g.setTransform(scale, 0, 0, scale, 0, 0);
    K.paint(g, K.pix(W, H, scale, 3, (x, y) => { const n = XY.fbm(x / 30, y / 30, 4, 4), v = 0.86 + 0.12 * n; return [196 * v, 176 * v, 150 * v]; }), W, H);
    SINO = true; scene(g, W, H); SINO = false; });
  const crackLayer = (W, H, scale) => XY.cached(`fr-crk:${scale.toFixed(4)}`, W * scale, H * scale, cv => { const g = cv.getContext('2d'); g.setTransform(scale, 0, 0, scale, 0, 0);
    g.save(); g.translate(0.8, 0.8); K.cracks(g, 0, 30, W, 660, 9, 2222, 'rgba(255,248,232,0.45)', 0.8, 11, 26); g.restore(); K.cracks(g, 0, 30, W, 660, 9, 2222, 'rgba(70,46,30,0.42)', 0.8, 11, 26); });
  const grainTile = () => XY.keep('fr-grain', 128, 128, cv => { const g = cv.getContext('2d'), im = g.createImageData(128, 128);
    for (let i = 0; i < 128 * 128; i++) { const v = XY.hash(i, 77); im.data[i * 4] = v < 0.5 ? 70 : 255; im.data[i * 4 + 1] = v < 0.5 ? 50 : 250; im.data[i * 4 + 2] = v < 0.5 ? 34 : 236; im.data[i * 4 + 3] = Math.floor(26 * Math.abs(v - 0.5)); }
    g.putImageData(im, 0, 0); });
  // ------------------------------------------------------------ painted figures (soft fresco modelling, no hard outline)
  const soft = (g, pts, col, sh) => { XY.path(g, pts, true); g.fillStyle = col; g.fill(); if (sh) { g.save(); g.clip(); g.fillStyle = sh; g.fillRect(-2000, -2000, 4000, 4000); g.restore(); } g.strokeStyle = 'rgba(80,50,30,0.35)'; g.lineWidth = 1; g.stroke(); };
  const vshade = (g, x0, x1) => { const gr = g.createLinearGradient(x0, 0, x1, 0); gr.addColorStop(0, 'rgba(255,248,230,0.25)'); gr.addColorStop(0.55, 'rgba(0,0,0,0)'); gr.addColorStop(1, 'rgba(70,40,24,0.3)'); return gr; };
  const princess = (g, t, reach) => {   // 百花羞 leaning on the balcony: red gown, pearl-netted hair, a blue veil in the wind
    const x = 146, y = 316;
    soft(g, [x - 40, y + 2, x + 40, y + 2, x + 30, y - 34, x - 30, y - 34], '#B4442E', vshade(g, x - 40, x + 40));
    g.strokeStyle = '#C9A458'; g.lineWidth = 2; g.beginPath(); g.moveTo(x - 16, y - 34); g.quadraticCurveTo(x, y - 24, x + 16, y - 34); g.stroke();
    const hx = XY.lerp(x + 26, x + 60, reach), hy = XY.lerp(y - 4, y + 6, reach);
    g.strokeStyle = '#A23C28'; g.lineWidth = 9; g.lineCap = 'round'; g.beginPath(); g.moveTo(x + 22, y - 28); g.quadraticCurveTo(x + 40, y - 14, hx, hy); g.stroke();
    g.fillStyle = '#E8CCAA'; g.beginPath(); g.arc(hx, hy, 4.5, 0, TAU); g.fill();
    g.fillStyle = '#E8CCAA'; g.beginPath(); g.ellipse(x, y - 50, 12, 14, 0, 0, TAU); g.fill(); g.strokeStyle = 'rgba(80,50,30,0.4)'; g.lineWidth = 1; g.stroke();
    g.fillStyle = '#A07040'; g.beginPath(); g.ellipse(x - 2, y - 58, 13, 9, 0, Math.PI, TAU); g.fill();
    g.fillStyle = '#F4EEE0'; for (let k = 0; k < 7; k++) { g.beginPath(); g.arc(x - 12 + k * 4, y - 62 + Math.abs(k - 3), 1.2, 0, TAU); g.fill(); }
    g.fillStyle = 'rgba(80,50,30,0.6)'; g.fillRect(x + 3, y - 52, 3, 1.3); g.fillRect(x - 5, y - 52, 3, 1.3);
    const vw = Math.sin(t * 2.2), vv = Math.sin(t * 3.1 + 1);
    g.fillStyle = 'rgba(110,140,180,0.85)'; g.beginPath(); g.moveTo(x - 12, y - 64); g.quadraticCurveTo(x + 30, y - 76 + 6 * vw, x + 54 + 6 * vv, y - 50 + 8 * vw); g.quadraticCurveTo(x + 30, y - 46, x + 12, y - 40); g.quadraticCurveTo(x + 4, y - 62, x - 12, y - 64); g.fill();
  };
  const king = (g, t, reach, weep) => {   // the king of 宝象国 on his throne in the loggia
    const x = KX, y = KY;
    soft(g, [x - 40, y, x + 40, y, x + 34, y - 150, x - 34, y - 150], '#C9A458', vshade(g, x - 40, x + 40));
    soft(g, [x - 46, y - 150, x + 46, y - 150, x + 44, y - 166, x - 44, y - 166], '#B89A58');
    soft(g, [x - 30, y, x + 34, y, x + 26, y - 110, x - 6, y - 128, x - 30, y - 110], '#A8432E', vshade(g, x - 30, x + 34));
    soft(g, [x - 22, y - 108, x + 22, y - 108, x + 26, y - 50, x - 26, y - 50], '#D6B068', vshade(g, x - 26, x + 26));
    const hx = XY.lerp(x - 14, x - 30, reach), hy = XY.lerp(y - 70, y - 142, reach);
    g.strokeStyle = '#B04A36'; g.lineWidth = 10; g.lineCap = 'round'; g.beginPath(); g.moveTo(x - 14, y - 100); g.quadraticCurveTo(x - 30, y - 90, hx, hy); g.stroke();
    g.fillStyle = '#E6C6A2'; g.beginPath(); g.arc(hx, hy, 5, 0, TAU); g.fill();
    g.fillStyle = '#E6C6A2'; g.beginPath(); g.ellipse(x - 2, y - 124, 12, 14, 0, 0, TAU); g.fill(); g.strokeStyle = 'rgba(80,50,30,0.4)'; g.lineWidth = 1; g.stroke();
    g.fillStyle = '#D8D2C4'; g.beginPath(); g.moveTo(x - 12, y - 118); g.quadraticCurveTo(x - 4, y - 92, x + 8, y - 116); g.closePath(); g.fill();
    g.fillStyle = '#2A2420'; g.beginPath(); g.ellipse(x - 2, y - 136, 13, 9, 0, Math.PI, TAU); g.fill(); g.fillRect(x - 15, y - 137, 26, 5); [-1, 1].forEach(sd => { g.beginPath(); g.ellipse(x - 2 + sd * 20, y - 140, 8, 4.4, sd * 0.3, 0, TAU); g.fill(); });   // 翼善冠
    g.fillStyle = 'rgba(80,50,30,0.6)'; g.fillRect(x - 9, y - 127, 4, 1.3); g.fillRect(x + 1, y - 127, 4, 1.3);
    if (weep > 0) for (let k = 0; k < 4; k++) { const f = (t * 1.6 + k / 4) % 1; g.fillStyle = `rgba(120,160,200,${weep * (1 - f)})`; g.beginPath(); g.ellipse(x - 7 + (k % 2) * 10, y - 124 + f * 30, 1.8, 2.6, 0, 0, TAU); g.fill(); }
    return [hx, hy];
  };
  const townsman = (g, x, y, s, col, hat, step) => {
    g.save(); g.translate(x, y); g.scale(s, s);
    soft(g, [-12, 0, 12, 0, 8, -46, -8, -46], col, vshade(g, -12, 12));
    g.strokeStyle = 'rgba(80,50,30,0.6)'; g.lineWidth = 2; g.beginPath(); g.moveTo(-4, 0); g.lineTo(-4 - 3 * step, 6); g.moveTo(4, 0); g.lineTo(4 + 3 * step, 6); g.stroke();
    g.fillStyle = '#E2C29E'; g.beginPath(); g.arc(0, -53, 7, 0, TAU); g.fill(); g.fillStyle = hat; g.beginPath(); g.ellipse(0, -59, 9, 4, 0, 0, TAU); g.fill(); g.fillRect(-6, -66, 12, 7);
    g.restore();
  };
  const letter = (g, x, y, s, rot, open) => {   // the princess's letter home: a 60 px envelope with a red seal, opening into a written sheet
    g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s);
    const w = 64 + 34 * open, h = 42 + 40 * open; g.fillStyle = 'rgba(60,30,20,0.25)'; g.fillRect(-w / 2 + 3, -h / 2 + 4, w, h);
    g.fillStyle = '#F2EAD6'; g.strokeStyle = 'rgba(80,50,30,0.7)'; g.lineWidth = 1.4; g.fillRect(-w / 2, -h / 2, w, h); g.strokeRect(-w / 2, -h / 2, w, h);
    if (open < 0.5) { g.beginPath(); g.moveTo(-w / 2, -h / 2); g.lineTo(0, 4); g.lineTo(w / 2, -h / 2); g.stroke(); g.fillStyle = '#A8261C'; g.beginPath(); g.arc(0, 4, 9, 0, TAU); g.fill(); g.fillStyle = '#E8B8A8'; g.fillRect(-3, 1, 6, 6);
      g.fillStyle = '#8A2E20'; g.font = XY.font(12, XY.cnFont.kai, 'bold'); g.textAlign = 'center'; g.fillText('家书', 0, h / 2 - 6); g.textAlign = 'left'; }
    else { g.strokeStyle = 'rgba(60,40,30,0.75)'; g.lineWidth = 1.6; for (let k = 0; k < 6; k++) { const x0 = w / 2 - 10 - k * 14; for (let q = 0; q < 6; q++) { g.beginPath(); g.moveTo(x0 - 3, -h / 2 + 8 + q * 11); g.lineTo(x0 + 3, -h / 2 + 12 + q * 11); g.stroke(); } } }
    g.restore();
  };
  const actsAt = b => ({ monk: { palm: K.bump(b, 4.3, 4.75, 5.7, 6.1) }, shaseng: { lift: K.bump(b, 6.6, 6.9, 7.6, 8.0) }, bajie: { scratch: K.bump(b, 7.0, 7.2, 7.8, 8.2) } });
  const handAt = (e, b) => { const t2 = e.cell.t0 + b * XY.BEAT, a = XY.anchor('monk.handFar', XY.walkPhase(t2), actsAt(b)); return [XY.procWorldX(t2) - e.cell.x + a[0], e.groundY + a[1]]; };

  XY.STYLES.fresco = {
    hits: [4.8, 6.0],
    bg(g, W, H, c, scale) {
      SINO = false; scene(g, W, H);
      K.paint(g, K.pix(W, H, scale, 3, (x, y) => { const v = 255 * (0.9 + 0.05 * XY.fbm(x / 9, y / 9, 6, 3) + 0.05 * XY.fbm(x / 120, y / 90, 8, 3)); return [v, v * 0.985, v * 0.96]; }), W, H, 'multiply');
      g.fillStyle = 'rgba(244,236,218,0.10)'; g.fillRect(0, 0, W, H);                                     // the chalky bloom of lime
      g.strokeStyle = 'rgba(90,64,44,0.22)'; g.lineWidth = 1; GIOR.forEach(p => { XY.path(g, p, true); g.stroke(); });
      const sl = sinoLayer(W, H, scale);
      LOSS.forEach(p => { g.save(); XY.path(g, p, true); g.clip(); g.drawImage(sl, 0, 0, W, H); g.restore();
        g.save(); g.translate(1.2, 1.6); XY.path(g, p, true); g.strokeStyle = 'rgba(255,250,240,0.7)'; g.lineWidth = 1.6; g.stroke(); g.restore(); XY.path(g, p, true); g.strokeStyle = 'rgba(70,46,30,0.55)'; g.lineWidth = 1; g.stroke(); });
    },
    draw(g, e) {
      const { W, H, t, u } = e, b = e.beat, S = e.S, acts = actsAt(b);
      { const h48 = handAt(e, 4.8); K.push(g, e, h48[0], h48[1] - 30, K.pushOf(b, 4.2, 4.8, 6.0, 0.12)); }
      // ---- the piazza lives: townsfolk, pigeons round the dome, the pennant on the lantern
      [[0, '#6E8A6A', '#A8432E'], [1, '#B4442E', '#3E4A68'], [2, '#8A7A5A', '#C9A458']].forEach(([k, col, hat]) => {
        const ph = t * (0.07 + 0.02 * k) + k * 0.33, f = Math.abs(((ph % 1) + 1) % 1 * 2 - 1), x = XY.lerp(380 + k * 40, 540 + k * 50, f), z = 1.7 + 0.25 * k, y = HZ + (702 - HZ) / z;
        townsman(g, x, y, 0.95 / z * 1.4, col, hat, Math.sin(t * 6 + k)); });
      const L = LANTERN, pw = Math.sin(t * 4);
      g.strokeStyle = 'rgba(80,50,30,0.6)'; g.lineWidth = 1.2; g.beginPath(); g.moveTo(L[0], L[1]); g.lineTo(L[0], L[1] - 30); g.stroke();
      g.fillStyle = '#A8432E'; g.beginPath(); g.moveTo(L[0], L[1] - 30); g.quadraticCurveTo(L[0] + 14, L[1] - 30 + 4 * pw, L[0] + 30, L[1] - 24 + 3 * pw); g.lineTo(L[0], L[1] - 20); g.fill();
      for (let k = 0; k < 4; k++) { const a = t * 0.9 + k * TAU / 4, x = L[0] + Math.cos(a) * 80, y = L[1] + 20 + Math.sin(a) * 22 - 10 * Math.sin(a * 2), fl = Math.sin(t * 14 + k);
        g.strokeStyle = '#E8E2D4'; g.lineWidth = 2; g.beginPath(); g.moveTo(x - 6, y - 4 * fl); g.quadraticCurveTo(x, y - 1, x + 6, y - 4 * fl); g.stroke(); }
      // ---- the princess and the gold ray her letter slides down
      const tip0 = [204, 316], tip1 = handAt(e, 4.8);
      princess(g, t, K.bump(b, 2.4, 3.0, 4.8, 5.4));
      // her red silk sash unrolls from the window down to the monk's raised palm; the letter slides down it
      const rib = XY.clamp((b - 3.0) / 0.4) * (1 - XY.clamp((b - 4.95) / 0.3)), ribAt = f => { const x = XY.lerp(tip0[0], tip1[0], f), y = XY.lerp(tip0[1], tip1[1], f) + 70 * Math.sin(f * Math.PI) + 6 * Math.sin(f * 9 + t * 3) * (1 - f); return [x, y]; };
      if (rib > 0) { const n = Math.ceil(30 * XY.clamp((b - 3.0) / 0.4)), pa = []; for (let q = 0; q <= n; q++) pa.push(...ribAt(q / 30));
        g.save(); g.globalAlpha = Math.min(1, rib * 2); g.lineCap = 'round'; XY.path(g, pa, false); g.strokeStyle = 'rgba(90,30,20,0.6)'; g.lineWidth = 9; g.stroke(); g.strokeStyle = '#B83A2A'; g.lineWidth = 6.5; g.stroke(); g.strokeStyle = 'rgba(255,200,170,0.5)'; g.lineWidth = 1.6; g.stroke(); g.restore(); }
      // ---- the king in the loggia (behind the pilgrims) receives the letter on beat 4, opens it and weeps
      const kr = K.bump(b, 5.5, 5.9, 7.0, 7.4), kh = king(g, t, kr, XY.clamp((b - 6.4) / 0.3) * (1 - XY.clamp((b - 7.6) / 0.3)));
      // ---- the procession, painted into the plaster; where the paint has flaked it is only sinopia
      const [cv, lg] = K.layer(e, 'fr-proc');
      XY.drawProcession(lg, e.phase, e.procX, e.groundY, PEN, acts);
      K.tint(lg, lg.createPattern(grainTile(), 'repeat'));
      K.tint(lg, 'rgba(244,236,218,0.12)');
      lg.save(); lg.globalCompositeOperation = 'destination-out'; LOSS.forEach(p => { XY.path(lg, p, true); lg.fill(); }); lg.restore();
      K.blit(g, cv);
      g.save(); g.beginPath(); LOSS.forEach(p => { g.moveTo(p[0], p[1]); for (let k = 2; k < p.length; k += 2) g.lineTo(p[k], p[k + 1]); g.closePath(); }); g.clip();
      XY.drawProcession(g, e.phase, e.procX, e.groundY, SPEN, acts); g.restore();
      // ---- the letter: down the ray (1.2 → 2.0), held in the raised palm, hops to the king (3.9 → 4.0), unfolds
      if (b > 0.6) { let lx, ly, s = 0.9, r = 0, open = 0;
        const hand = e.at('monk.handFar', acts);
        if (b < 3.4) { const pr = K.bump(b, 2.4, 3.0, 4.8, 5.4); lx = XY.lerp(176, 210, pr); ly = XY.lerp(310, 318, pr); s = 0.6; }
        else if (b < 4.8) { const f = XY.easeIn((b - 3.4) / 1.4), p = ribAt(f); lx = p[0]; ly = p[1] - 16; r = 0.25 * Math.sin(b * 7); s = XY.lerp(0.6, 1, f); }
        else if (b < 5.8) { lx = hand[0]; ly = hand[1] - 20; }
        else if (b < 6.0) { const f = XY.smooth((b - 5.8) / 0.2); lx = XY.lerp(hand[0], kh[0], f); ly = XY.lerp(hand[1] - 20, kh[1] - 10, f) - 90 * Math.sin(f * Math.PI); r = f * 0.6; }
        else { open = XY.smooth((b - 6.05) / 0.3) * (1 - XY.smooth((b - 6.9) / 0.3)); lx = kh[0] + 4 * open; ly = kh[1] - 6 - 14 * open; s = 1 + 0.4 * open; r = 0.6 * (1 - open); }
        letter(g, lx, ly, s, r, open); }
      // ---- the wall's cracks run over everything painted on it
      g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.drawImage(crackLayer(W, H, S), 0, 0); g.restore();
      // ---- entry: giornate laid and painted top to bottom; the rest is still sinopia on the rough coat
      const done = Math.floor((u + 0.42) / 0.045);
      if (done < GIOR.length) { g.save(); g.beginPath(); GIOR.forEach((p, k) => { if (k < Math.max(0, done)) return; g.moveTo(p[0], p[1]); for (let q = 2; q < p.length; q += 2) g.lineTo(p[q], p[q + 1]); g.closePath(); }); g.clip();
        g.setTransform(1, 0, 0, 1, 0, 0); g.drawImage(sinoLayer(W, H, S), 0, 0); g.restore(); }
    },
  };
})();
