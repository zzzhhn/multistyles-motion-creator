// 15 盛唐工笔 · 流沙难渡 — warm silk; far bank of blue-and-green peaks with gold contour lines and white cloud bands;
// the whole middle is the 流沙河 drawn in hair-fine 游丝 lines — rows of fish-scale waves with sand grains in the
// troughs, rolling left; the stele 流沙河 with its four lines stands on the near bank among reeds. Beat 2: a goose
// feather drifts down onto the sand-waves and sinks at once (鹅毛飘不起). Beat 3: the waves part and the red-haired,
// indigo-faced river ogre leaps out at Tang Seng; Wukong meets him with the staff; he dives back under.
(() => {
  'use strict';
  const XY = window.XY, TAU = XY.TAU, K = XY.KIT_B;
  const INK = '#3A2A1E', GOLDL = '#C8A048', QING = '#2E6A8A', LV = '#4E8A72', ZHU = '#C8402E', ZHE = '#B07A4A';
  const WATER = 640;   // near edge of the river
  const sp = (pts, n = 5) => XY.RIG.spline(pts, true, n);
  const stroke = (g, pts, w, col) => { g.strokeStyle = col; g.lineWidth = w; XY.path(g, pts, false); g.stroke(); };
  // 晕染: fill a shape with a wash that deepens toward one edge, then a fine contour
  const wash = (g, pts, c0, c1, y0, y1, line = INK, lw = 0.9) => { const gr = g.createLinearGradient(0, y0, 0, y1); gr.addColorStop(0, c0); gr.addColorStop(1, c1);
    XY.path(g, pts, true); g.fillStyle = gr; g.fill(); if (line) { g.strokeStyle = line; g.lineWidth = lw; g.stroke(); } };

  // ------------------------------------------------------------ static silk painting
  // far bank (v10): blue-and-green peaks the Tang way — 赭石 underpainting, 石绿 then 石青 laid in layers from the
  // summit down, a firm ink contour with 泥金 lines inside it, ink texture strokes, gold at the foot
  const peak = (g, x, base, h, w, k, near) => {
    const pts = sp([x - w, base, x - w * 0.5, base - h * 0.55, x - w * 0.15, base - h, x + w * 0.2, base - h * 0.82, x + w * 0.55, base - h * 0.4, x + w, base], 6);
    XY.path(g, pts, true); g.fillStyle = '#B88A56'; g.fill();
    g.save(); XY.path(g, pts, true); g.clip();
    const gr = g.createLinearGradient(0, base - h, 0, base); gr.addColorStop(0, near ? '#3E8A66' : '#4E9A7A'); gr.addColorStop(0.65, near ? 'rgba(62,138,102,0.75)' : 'rgba(78,154,122,0.7)'); gr.addColorStop(1, 'rgba(78,154,122,0)');
    g.fillStyle = gr; g.fillRect(x - w, base - h, 2 * w, h);
    const inner = sp([x - w * 0.6, base - h * 0.2, x - w * 0.35, base - h * 0.62, x - w * 0.12, base - h * 1.02, x + w * 0.18, base - h * 0.84, x + w * 0.4, base - h * 0.5, x + w * 0.1, base - h * 0.3], 5);
    const gq = g.createLinearGradient(0, base - h, 0, base - h * 0.25); gq.addColorStop(0, near ? '#1E5A86' : '#2E6E9A'); gq.addColorStop(1, 'rgba(46,110,154,0)');
    XY.path(g, inner, true); g.fillStyle = gq; g.fill();
    const gl = g.createLinearGradient(0, base - 24, 0, base); gl.addColorStop(0, 'rgba(214,170,80,0)'); gl.addColorStop(1, 'rgba(214,170,80,0.85)'); g.fillStyle = gl; g.fillRect(x - w, base - 24, 2 * w, 24);
    for (let j = 0; j < 9; j++) { const sx = x - w * 0.55 + j * w * 0.13, top = base - h * (0.9 - 0.08 * Math.abs(j - 4)); stroke(g, XY.RIG.spline([sx, top, sx + 8, top + h * 0.2, sx + 2, top + h * 0.45, sx + 10, base - 8], false, 3), 1, 'rgba(30,40,40,0.55)');
      stroke(g, [sx + 3, top + h * 0.12, sx + 9, top + h * 0.3], 1, 'rgba(214,170,80,0.85)'); }
    g.restore();
    g.strokeStyle = INK; g.lineWidth = near ? 2 : 1.6; XY.path(g, pts.slice(2, -2), false); g.stroke();
    g.save(); g.translate(0, 3); g.strokeStyle = 'rgba(214,170,80,0.9)'; g.lineWidth = 1.2; XY.path(g, pts.slice(4, -4), false); g.stroke(); g.restore();
    for (let j = 0; j < 7; j++) { const dx = (XY.hash(k, j, 3) - 0.5) * w * 0.9, dy = -h * (0.25 + 0.6 * XY.hash(k, j, 4)); g.fillStyle = 'rgba(20,50,40,0.7)'; g.beginPath(); g.ellipse(x + dx, base + dy, 3, 1.6, 0, 0, TAU); g.fill(); }
  };
  const peaks = (g, W) => {
    [[60, 250, 120], [170, 250, 170], [300, 255, 120], [430, 252, 190], [560, 256, 130], [700, 250, 210], [840, 255, 140], [960, 252, 180], [1090, 256, 130]].forEach(([x, base, h], k) => peak(g, x, base, h, 90 + h * 0.5, k, false));
    const mist = g.createLinearGradient(0, 196, 0, 252); mist.addColorStop(0, 'rgba(246,240,224,0)'); mist.addColorStop(1, 'rgba(246,240,224,0.7)'); g.fillStyle = mist; g.fillRect(0, 196, W, 56);
    [[120, 254, 60], [380, 256, 70], [620, 254, 56], [900, 256, 66], [1150, 254, 50]].forEach(([x, base, h], k) => peak(g, x, base, h, 110 + h, k + 20, true));
    wash(g, [0, 250, W, 250, W, 276, 0, 276], '#D8BE88', '#C8A870', 250, 276, null);
    stroke(g, [0, 252, W, 252], 0.9, INK);
  };
  const bank = (g, W, H) => {
    wash(g, sp([-20, WATER + 6, 200, WATER - 4, 420, WATER + 4, 700, WATER - 2, 960, WATER + 6, W + 20, WATER, W + 20, H + 10, -20, H + 10], 6), '#D6B886', '#B89060', WATER, H, INK, 1);
    // rocks with blue-green 晕染 and fine contour, reeds behind them
    [[250, 700, 60, 30], [610, 706, 44, 22], [890, 702, 70, 34], [1130, 704, 50, 26]].forEach(([x, y, w, h]) => {
      wash(g, sp([x - w, y, x - w * 0.6, y - h, x, y - h * 1.2, x + w * 0.7, y - h * 0.8, x + w, y], 5), 'rgba(46,106,138,0.75)', 'rgba(176,122,74,0.6)', y - h, y, INK, 1);
      stroke(g, [x - w * 0.3, y - h * 0.9, x - w * 0.1, y - h * 0.4], 0.8, INK); });
    g.fillStyle = 'rgba(90,60,30,0.35)'; for (let k = 0; k < 260; k++) g.fillRect(XY.hash(k, 1, 15) * W, WATER + 14 + XY.hash(k, 2, 15) * 120, 1.6, 1.6);
  };
  const stele = g => {
    wash(g, sp([150, 438, 205, 452, 216, 480, 216, 664, 84, 664, 84, 480, 95, 452], 4), '#C8C2B0', '#9A9484', 438, 664, INK, 1.2);
    wash(g, [70, 664, 230, 664, 240, 690, 60, 690], '#A8A090', '#8A8274', 664, 690, INK, 1);
    g.strokeStyle = 'rgba(58,42,30,0.5)'; g.lineWidth = 0.8; g.strokeRect(98, 486, 104, 170);
    K.vtext(g, '流沙河', 150, 520, 46, XY.cnFont.kai, '#2A1E14', 1.12);
    K.vtext(g, '八百流沙界三千弱水深', 110, 496, 13.5, XY.cnFont.kai, 'rgba(42,30,20,0.85)', 1.12);
    K.vtext(g, '鹅毛飘不起芦花定底沉', 190, 496, 13.5, XY.cnFont.kai, 'rgba(42,30,20,0.85)', 1.12);
    for (let k = 0; k < 30; k++) { g.fillStyle = 'rgba(90,84,70,0.35)'; g.beginPath(); g.arc(90 + XY.hash(k, 5) * 120, 450 + XY.hash(k, 6) * 210, 1 + XY.hash(k, 7) * 2, 0, TAU); g.fill(); }
  };
  // reeds: long fine blades and plumes; sway is per frame
  const REEDS = []; { const R = XY.rng(1511); for (let k = 0; k < 26; k++) REEDS.push({ x: 20 + R() * 1140, h: 70 + R() * 90, s: R() * 9, lean: (R() - 0.5) * 0.3 }); }
  const reeds = (g, t) => REEDS.forEach(r => { const sw = r.lean + 0.06 * Math.sin(t * 1.8 + r.s), y = WATER + 8, tx = r.x + Math.sin(sw) * r.h, ty = y - Math.cos(sw) * r.h;
    stroke(g, [r.x, y, (r.x + tx) / 2 + 4, (y + ty) / 2, tx, ty], 1, '#6A5A30');
    stroke(g, [r.x + 2, y, r.x + 18 + 10 * Math.sin(t * 2 + r.s), y - r.h * 0.5], 0.9, '#7A7038');
    for (let j = 0; j < 6; j++) stroke(g, [tx, ty + j * 3, tx + 8 + 2 * Math.sin(t * 3 + j), ty + j * 3 - 6], 0.8, 'rgba(240,232,214,0.95)'); });
  // ------------------------------------------------------------ the flowing sand: rows of fish-scale waves
  const ROWS = 17;
  const waves = (g, W, t, part) => {   // part: cut-out around the ogre (x, halfwidth, amount) parts the crests
    for (let j = 0; j < ROWS; j++) {
      const q = j / (ROWS - 1), y = 284 + 352 * Math.pow(q, 1.3), r = 7 + 15 * q, v = 10 + 46 * q, ph = ((t * v + j * 37) % (2 * r));
      const pathA = new Path2D(), pathB = new Path2D(), dots = new Path2D();
      for (let x = -2 * r + ph - 2 * r; x < W + 2 * r; x += 2 * r) {
        const ci = Math.round((x - ph) / (2 * r)), hv = XY.hash(ci, j, 1515); let yy = y + 1.6 * Math.sin(x / 70 + t * 1.3 + j) - 3 * hv * q, rr = r * (0.8 + 0.4 * hv);
        if (part && part.a > 0) { const d = (x - part.x) / part.w; if (Math.abs(d) < 1.6 && y > part.y0) { const k = Math.exp(-d * d * 2) * part.a; yy += 26 * k * (1 + q); rr *= 1 - 0.5 * k; } }
        pathA.moveTo(x + rr, yy); pathA.arc(x, yy, rr, 0, Math.PI, true);
        pathB.moveTo(x + rr * 0.62, yy); pathB.arc(x, yy, rr * 0.62, 0, Math.PI, true); pathB.moveTo(x + rr * 0.28, yy); pathB.arc(x, yy, rr * 0.28, 0, Math.PI, true);
        const gx = x + r, gy = yy + r * 0.25; dots.rect(gx - 0.8, gy, 1.5, 1.5); dots.rect(gx + r * 0.4, gy - r * 0.2, 1.3, 1.3); dots.rect(gx - r * 0.5, gy - r * 0.3, 1.2, 1.2);
      }
      g.strokeStyle = `rgba(74,54,34,${0.42 + 0.3 * q})`; g.lineWidth = 0.7 + 0.6 * q; g.stroke(pathA);
      g.strokeStyle = `rgba(74,54,34,${0.2 + 0.2 * q})`; g.lineWidth = 0.6 + 0.3 * q; g.stroke(pathB);
      g.fillStyle = `rgba(150,110,50,${0.55 + 0.3 * Math.sin(t * 2 + j)})`; g.fill(dots);
    }
    // long 游丝 current lines threading through the scales
    for (let k = 0; k < 9; k++) { const q = (k + 0.5) / 9, y = 290 + 340 * Math.pow(q, 1.2), v = 14 + 40 * q, P = [];
      for (let x = -20; x <= W + 20; x += 16) P.push(x, y + 7 * Math.sin((x + t * v) / (60 + 30 * q) + k * 1.7) + 4 * Math.sin((x - t * v * 0.6) / 23 + k));
      g.strokeStyle = `rgba(74,54,34,${0.35 + 0.25 * q})`; g.lineWidth = 0.8; XY.path(g, P, false); g.stroke();
      g.strokeStyle = 'rgba(250,244,226,0.35)'; g.lineWidth = 2.2; g.save(); g.translate(0, -3); XY.path(g, P, false); g.stroke(); g.restore(); }
  };
  // the river ogre (the future 沙悟净) drawn from the rig: indigo face, red flame hair, goose-yellow cloak, nine skulls.
  // (x, y) = feet, k = extra scale, lean = forward lean toward the pilgrims (rad), staff = 0 held up, 1 swung down
  const OGRE = K.pen({ skin2: '#4A6A9A', ssh: '#D8402A', ssbeard: '#C83A26', ssrobe: '#E6CE72', ssrobe2: '#B89A50', skull: '#F2EADA', ink: INK, gold: GOLDL, bundle: null, wood: null }, { outline: INK, ow: 1 });
  const ogre = (g, e, x, y, k, lean, staff, t) => {
    g.save(); g.translate(x, y); g.scale(k, k); g.translate(0, -95); g.rotate(-lean); g.translate(0, 95);
    K.figure(g, 'shaseng', e.phase, 0, 0, OGRE, { shaseng: { lift: 0 } }, { flip: true, scale: 1.2, skip: p => p.role === 'ink' && p.k === 'line' && (p.w < 1.5 || Math.abs(p.pts[0]) > 40 || Math.abs(p.pts[2]) > 40) });
    const hx = -7, hy = -192;
    for (let j = 0; j < 11; j++) { const a = -Math.PI * 1.0 + j * 0.1 * Math.PI, l = 20 + 10 * Math.sin(t * 9 + j);
      g.fillStyle = j % 2 ? '#D8402A' : '#E8702A'; g.beginPath(); g.moveTo(hx + Math.cos(a - 0.2) * 13, hy + Math.sin(a - 0.2) * 13); g.lineTo(hx + Math.cos(a) * (13 + l), hy + Math.sin(a) * (13 + l)); g.lineTo(hx + Math.cos(a + 0.2) * 13, hy + Math.sin(a + 0.2) * 13); g.fill(); g.strokeStyle = INK; g.lineWidth = 0.7; g.stroke(); }
    g.fillStyle = '#F6E07A'; g.beginPath(); g.arc(hx - 10, hy + 2, 5, 0, TAU); g.fill(); g.fillStyle = INK; g.beginPath(); g.arc(hx - 11, hy + 2, 2.2, 0, TAU); g.fill();
    // 降妖宝杖: held high, then swung down at Wukong
    const a = XY.lerp(-1.95, -0.55, staff), gx = -46, gy = -86, ex = gx + Math.cos(a) * 250, ey = gy + Math.sin(a) * 250, bx = gx - Math.cos(a) * 40, by = gy - Math.sin(a) * 40;
    stroke(g, [bx, by, ex, ey], 6, INK); stroke(g, [bx, by, ex, ey], 4, '#8A6A3A');
    const n = a + Math.PI / 2; stroke(g, XY.RIG.spline([ex + Math.cos(n) * 22, ey + Math.sin(n) * 22, ex + Math.cos(a) * 12, ey + Math.sin(a) * 12, ex - Math.cos(n) * 22, ey - Math.sin(n) * 22], false, 4), 6, '#C8C8C0');
    g.restore();
  };
  const whirl = (g, x, y, r, open, t) => { if (open <= 0) return; g.save(); g.globalAlpha = open;
    for (let a = 0; a < 3; a++) { const P = []; for (let j = 0; j <= 40; j++) { const q = j / 40, rr = r * (1 - q) * open, an = a * TAU / 3 + q * 7 - t * 3; P.push(x + Math.cos(an) * rr, y + Math.sin(an) * rr * 0.32); }
      stroke(g, P, 1.2, INK); g.save(); g.translate(0, -2); stroke(g, P, 2.4, 'rgba(250,244,226,0.45)'); g.restore(); }
    const rg = g.createRadialGradient(x, y, 2, x, y, r * 0.5 * open); rg.addColorStop(0, 'rgba(70,46,24,0.55)'); rg.addColorStop(1, 'rgba(70,46,24,0)'); g.fillStyle = rg; g.beginPath(); g.ellipse(x, y, r * 0.5 * open, r * 0.17 * open, 0, 0, TAU); g.fill();
    g.restore(); };
  // a driftwood log that bobs, tips and slides under (芦花定底沉: nothing floats here)
  const log = (g, x, y, l, rot, sink) => { g.save(); g.beginPath(); g.rect(x - l, 276, 2 * l, y - 276 + 4); g.clip(); g.translate(x, y + 26 * sink); g.rotate(rot + 0.5 * sink);
    XY.path(g, sp([-l / 2, -5, l / 2, -6, l / 2 + 4, 0, l / 2, 6, -l / 2, 5], 3), true); g.fillStyle = '#8A6A44'; g.fill(); g.strokeStyle = INK; g.lineWidth = 1; g.stroke();
    for (let j = 0; j < 4; j++) stroke(g, [-l / 2 + 8 + j * l / 4, -3, -l / 2 + 18 + j * l / 4, -2], 0.7, INK); g.restore(); };
  const PEN = K.pen({ fur: '#B08858', face: '#F2DCC0', wkshirt: ZHU, tiger: '#E0A860', stripe: INK, gold: GOLDL, staff: ZHU, ink: INK, horse: '#F6F0E2', horse2: '#E2D8C4', mane: '#EEE6D4',
    hoof: '#5A4A3A', saddle: '#8A4A30', red: ZHU, robe: '#F0DCA0', kasaya: '#C8402E', skin: '#F4DEC4', metal: '#C8A048', bjrobe: '#4A5868', bjpants: '#3A4654', pig: '#F2C4B8', pig2: '#E2A89C', wood: '#8A6A44' },
    { outline: INK, ow: 0.8, shade: 'rgba(120,70,30,0.16)' });
  const FEATHER = (g, x, y, rot, s) => { g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s);
    XY.path(g, sp([0, -22, 6, -12, 7, 6, 2, 22, -3, 10, -5, -8], 4), true); g.fillStyle = 'rgba(252,248,238,0.95)'; g.fill(); g.strokeStyle = INK; g.lineWidth = 0.7; g.stroke();
    stroke(g, [0, -22, 1, 24], 0.8, INK); for (let k = 0; k < 6; k++) stroke(g, [1, -14 + k * 6, 6, -10 + k * 6], 0.5, 'rgba(58,42,30,0.6)'); g.restore(); };

  XY.STYLES.tanggongbi = {
    bg(g, W, H) {
      K.silk(g, W, H, { seed: 1501, base: '#D8BE8E' });
      g.lineCap = 'round'; g.lineJoin = 'round';
      peaks(g, W);
      const rv = g.createLinearGradient(0, 276, 0, WATER); rv.addColorStop(0, 'rgba(214,196,150,0.55)'); rv.addColorStop(1, 'rgba(176,140,90,0.55)'); g.fillStyle = rv; g.fillRect(0, 276, W, WATER - 270);
      for (let k = 0; k < 6; k++) { const y = 320 + k * 52 + 14 * XY.hash(k, 1, 151), x0 = XY.hash(k, 2, 151) * 300; const gr = g.createLinearGradient(0, y - 18, 0, y + 18);
        gr.addColorStop(0, 'rgba(120,80,40,0)'); gr.addColorStop(0.5, `rgba(120,80,40,${0.12 + 0.1 * XY.hash(k, 3, 151)})`); gr.addColorStop(1, 'rgba(120,80,40,0)'); g.fillStyle = gr; g.fillRect(x0, y - 18, 500 + 400 * XY.hash(k, 4, 151), 36); }
      bank(g, W, H); stele(g);
      K.vtext(g, '第十五难', W - 44, 96, 30, XY.cnFont.kai, '#2A1E14', 1.1);
      K.seal(g, W - 60, 236, 32, '盛唐', true); K.seal(g, 16, 730, 34, '内府图书', false); K.seal(g, W - 90, 724, 40, '流沙', true);
    },
    hits: [2, 4, 5],
    thumb: 4.5,
    draw(g, e) {
      const { W, H, u, t, cell } = e; g.lineCap = 'round'; g.lineJoin = 'round';
      // white cloud bands drifting before the far peaks, fine-lined
      for (let k = 0; k < 3; k++) { const cx = ((k * 470 + t * (8 + 4 * k)) % (W + 500)) - 250, cy = 150 + k * 34;
        const pts = sp([cx - 160, cy, cx - 90, cy - 18, cx, cy - 10, cx + 90, cy - 22, cx + 170, cy, cx + 60, cy + 12, cx - 60, cy + 10], 6);
        XY.path(g, pts, true); g.fillStyle = 'rgba(250,246,234,0.82)'; g.fill(); g.strokeStyle = 'rgba(58,42,30,0.45)'; g.lineWidth = 0.8; g.stroke();
        stroke(g, XY.RIG.spline([cx - 60, cy - 4, cx - 44, cy - 14, cx - 30, cy - 6, cx - 38, cy - 2], false, 4), 0.7, 'rgba(58,42,30,0.45)'); }
      // timeline (v10): beat 2 the feather sinks; beat 3 a whirlpool opens ahead of the line; beat 4 the ogre bursts out
      // of it, beat 4.6 lands on the near bank; beat 5 staff meets staff; beat 5.5 he springs back and dives (beat 6.3)
      const d = cell.dur, WK = XY.procWorldX(cell.t0 + 0.625 * d) - cell.x + 245, OX = Math.min(W - 110, WK + 165), WY = 560, LX = OX - 20;
      const open = XY.smooth((u - 0.36) / 0.06) * (1 - XY.smooth((u - 0.82) / 0.1));
      const rise = XY.easeOut((u - 0.5) / 0.045), fly = XY.easeIO((u - 0.545) / 0.035), back = XY.easeOut((u - 0.69) / 0.05), dive = XY.easeIn((u - 0.74) / 0.05);
      const part = { x: OX, w: 80, a: open * (u < 0.8 ? 1 : 0), y0: 440 };
      if (u < 0.5) { const gl = 0.5 + 0.5 * Math.sin(t * 5); g.fillStyle = `rgba(246,214,90,${(0.35 + 0.4 * gl) * (1 - open * 0.3)})`; [[OX - 14, WY - 8], [OX + 6, WY - 10]].forEach(([x, y]) => { g.beginPath(); g.ellipse(x, y, 5, 3, 0, 0, TAU); g.fill(); }); }
      waves(g, W, t, part);
      whirl(g, OX, WY, 150, open, t); whirl(g, 260, 420, 70, 0.7, t * 0.7);
      [[380, 470, 70, 0.1, 0.5], [760, 390, 54, -0.15, 0.2], [620, 600, 80, 0.06, 0.8]].forEach(([x, y, l, r, ph], k) => log(g, x - ((t * (20 + 10 * k)) % 200) + 100, y + 2 * Math.sin(t * 2 + k), l, r + 0.05 * Math.sin(t * 1.7 + k), XY.clamp(((t * 0.18 + ph) % 1 - 0.7) / 0.3)));
      let ox = OX, oy = WY + 300, lean = 0, staff = 0, clip = true;
      if (u >= 0.5 && u < 0.79) {
        if (u < 0.545) { ox = OX; oy = XY.lerp(WY + 320, 470, rise); }
        else if (u < 0.69) { ox = XY.lerp(OX, LX, fly); oy = XY.lerp(470, 702, fly) - 120 * Math.sin(fly * Math.PI); clip = fly < 0.4; lean = 0.25 * XY.smooth((u - 0.58) / 0.04); staff = XY.smooth((u - 0.6) / 0.025) * (1 - XY.smooth((u - 0.64) / 0.04)) * 0.9; lean -= 0.35 * XY.smooth((u - 0.632) / 0.02) * (1 - XY.smooth((u - 0.68) / 0.02)); }
        else if (u < 0.74) { ox = XY.lerp(LX, OX + 10, back); oy = XY.lerp(702, 450, back) - 60 * Math.sin(back * Math.PI); clip = back > 0.6; lean = -0.2; }
        else { ox = OX; oy = XY.lerp(450, WY + 320, dive); clip = true; }
        g.save(); if (clip) { g.beginPath(); g.rect(0, 0, W, WY + 10); g.clip(); } ogre(g, e, ox, oy, 1.25, lean, staff, t); g.restore();
        const sa = XY.clamp((u - 0.5) / 0.15); if (sa < 1) for (let k = 0; k < 130; k++) { const a = -Math.PI * (0.1 + 0.8 * XY.hash(k, 1, 15)), v = 160 + 360 * XY.hash(k, 2, 15);
          g.fillStyle = `rgba(130,92,40,${1 - sa})`; g.fillRect(OX + Math.cos(a) * v * sa, WY - 10 + Math.sin(a) * v * sa + 380 * sa * sa, 3, 3); }
      }
      // the clash of staff on staff (beat 5): a white flash and flying sand
      const clash = Math.max(0, 1 - Math.abs(u - 0.632) / 0.03);
      if (clash > 0) { const cx = WK + 78, cy = 560; g.save(); g.globalCompositeOperation = 'screen'; const rg = g.createRadialGradient(cx, cy, 4, cx, cy, 110); rg.addColorStop(0, `rgba(255,250,230,${0.85 * clash})`); rg.addColorStop(1, 'rgba(255,240,200,0)'); g.fillStyle = rg; g.fillRect(cx - 130, cy - 130, 260, 260); g.restore();
        g.strokeStyle = INK; g.lineWidth = 1.2; for (let k = 0; k < 12; k++) { const a = k / 12 * TAU, r0 = 20 + 30 * (1 - clash); stroke(g, [cx + Math.cos(a) * r0, cy + Math.sin(a) * r0, cx + Math.cos(a) * (r0 + 40), cy + Math.sin(a) * (r0 + 40)], 1.4, INK); } }
      // the goose feather drifts down and sinks the moment it touches the sand (beat 2), then reed flowers sink too
      const fd = XY.clamp((u + 0.3) / 0.55), fx = 540 + 60 * Math.sin(fd * 9) * (1 - fd), fy = XY.lerp(40, 342, fd), sink = XY.clamp((u - 0.25) / 0.05);
      if (sink < 1) { g.save(); g.beginPath(); g.rect(0, 0, W, 344); g.clip(); FEATHER(g, fx, fy + 30 * sink, 0.6 * Math.sin(fd * 9) + 1.2 * sink, 1.5); g.restore(); }
      if (u >= 0.25 && u < 0.5) { const ra = (u - 0.25) / 0.25; g.strokeStyle = `rgba(58,42,30,${0.8 * (1 - ra)})`; g.lineWidth = 1; for (let k = 0; k < 3; k++) { g.beginPath(); g.ellipse(540, 346, 14 + 70 * ra + k * 12, 4 + 12 * ra + k * 2.5, 0, 0, TAU); g.stroke(); } }
      reeds(g, t);
      // the pilgrims in fine line and pale colour, washed toward their contours
      const acts = { wukong: { raise: XY.smooth((u - 0.52) / 0.04) * (1 - XY.smooth((u - 0.6) / 0.025)), strike: XY.smooth((u - 0.6) / 0.025) * (1 - XY.smooth((u - 0.74) / 0.06)), shade: XY.smooth((u - 0.36) / 0.05) * (1 - XY.smooth((u - 0.5) / 0.04)) },
        monk: { palm: XY.smooth((u - 0.5) / 0.04) * (1 - XY.smooth((u - 0.9) / 0.1)) } };
      K.shadedTeam(g, e, PEN, acts, null, [[3, 2.5, 'rgba(140,80,30,0.22)'], [-2, -1.5, 'rgba(255,250,236,0.28)']]);
      void H;
    },
    post(canvas, g, e) { const c = e.cell, WK = XY.procWorldX(c.t0 + 0.625 * c.dur) - c.x + 245; K.zoomPost(canvas, g, e, Math.min(e.W - 110, WK + 165) - 80, 520, K.zoom(e.u, [0.6, 0.635, 0.74], 1.12)); },
  };
})();
