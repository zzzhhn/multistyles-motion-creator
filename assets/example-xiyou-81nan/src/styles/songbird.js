// 18 宋院体花鸟 · 五庄观中 — an academy painting on silk: the 人参果 tree reaches in from the top right with
// plantain-like leaves (layered greens, parallel veins, a worm hole, a scorched edge) and fruit that are babies,
// kicking and nodding on their stalks; a Taihu rock and garden soil below, a Huizong-style inscription in the
// empty silk. Beat 2: a small bird lands on a twig, it dips and springs, the babies swing. Beat 3: Wukong raps a
// low fruit with his staff; it drops, touches the earth and burrows in (遇土而入); Bajie grabs at nothing.
(() => {
  'use strict';
  const XY = window.XY, TAU = XY.TAU, K = XY.KIT_B;
  const INK = '#33281C', LEAF = '#5E7E4A', LEAF2 = '#3E5E36', LEAFL = '#9AB07A', BARK = '#5A4632';
  const sp = (pts, n = 5) => XY.RIG.spline(pts, true, n);
  const stroke = (g, pts, w, col) => { g.strokeStyle = col; g.lineWidth = w; XY.path(g, pts, false); g.stroke(); };
  const lerpP = (a, b, q) => [XY.lerp(a[0], b[0], q), XY.lerp(a[1], b[1], q)];
  // ------------------------------------------------------------ the tree (static): limbs as tapered ink-and-ochre strokes
  const LIMBS = [
    { p: [1200, 40, 1080, 110, 960, 150, 820, 170, 680, 200, 560, 260, 470, 300], w: [46, 10] },
    { p: [1000, 140, 960, 230, 900, 320, 850, 400, 820, 460], w: [20, 6] },
    { p: [760, 184, 720, 120, 660, 80, 600, 70], w: [14, 4] },
    { p: [640, 222, 600, 300, 590, 360], w: [10, 3] },
  ];
  const limb = (g, L) => { const c = XY.RIG.spline(L.p, false, 8), rb = XY.RIG.ribbon(c, L.w[0], L.w[1]);
    XY.path(g, rb, true); const gr = g.createLinearGradient(0, 60, 0, 300); gr.addColorStop(0, '#6A5440'); gr.addColorStop(1, '#8A7054'); g.fillStyle = gr; g.fill(); g.strokeStyle = INK; g.lineWidth = 1.1; g.stroke();
    for (let k = 4; k < c.length - 4; k += 10) { const a = Math.atan2(c[k + 3] - c[k + 1], c[k + 2] - c[k]) + Math.PI / 2, w = XY.lerp(L.w[0], L.w[1], k / c.length) * 0.35; stroke(g, [c[k] - Math.cos(a) * w, c[k + 1] - Math.sin(a) * w, c[k] + Math.cos(a) * w * 0.4 + 3, c[k + 1] + Math.sin(a) * w * 0.4], 0.8, 'rgba(51,40,28,0.55)'); }
    for (let k = 0; k < 14; k++) { const i = 2 * Math.floor(XY.hash(k, L.w[0], 18) * (c.length / 2 - 1)); g.fillStyle = 'rgba(70,90,50,0.55)'; g.beginPath(); g.ellipse(c[i], c[i + 1], 3, 1.6, 0, 0, TAU); g.fill(); } };
  // a plantain-like leaf: long blade, layered green wash, midrib and parallel veins, sometimes a worm hole or scorched tip
  const leaf = (g, x, y, a, l, w, k) => {
    g.save(); g.translate(x, y); g.rotate(a);
    const pts = sp([0, 0, l * 0.18, -w * 0.48, l * 0.6, -w * 0.56, l * 0.94, -w * 0.34, l, -w * 0.02, l * 0.93, w * 0.32, l * 0.6, w * 0.52, l * 0.18, w * 0.44], 6), under = k % 4 === 1;
    const gr = g.createLinearGradient(0, -w * 0.5, 0, w * 0.5); gr.addColorStop(0, under ? LEAFL : LEAF2); gr.addColorStop(0.5, under ? '#B8C894' : LEAF); gr.addColorStop(1, under ? LEAFL : LEAF2);
    XY.path(g, pts, true); g.fillStyle = gr; g.fill(); g.strokeStyle = '#2E4426'; g.lineWidth = 1; g.stroke();
    stroke(g, [0, 0, l * 0.5, -w * 0.02, l * 0.98, -w * 0.05], 1.3, under ? '#6A8050' : '#C8C890');
    for (let j = 1; j < 9; j++) { const q = j / 9; stroke(g, [l * q * 0.95, -w * 0.02, l * (q * 0.95 + 0.06), -w * 0.46 * Math.sin(Math.PI * Math.min(1, q + 0.08))], 0.6, 'rgba(40,60,30,0.55)');
      stroke(g, [l * q * 0.95, -w * 0.02, l * (q * 0.95 + 0.06), w * 0.42 * Math.sin(Math.PI * Math.min(1, q + 0.08))], 0.6, 'rgba(40,60,30,0.55)'); }
    for (let j = 0; j < 3; j++) { const q = 0.3 + 0.22 * j + 0.05 * Math.sin(k + j), sd = (k + j) % 2 ? 1 : -1; if ((k + j) % 3 === 0) continue;
      stroke(g, [l * q, sd * w * 0.5 * Math.sin(Math.PI * q) * 1.02, l * (q - 0.03), sd * w * 0.12], 1.4, 'rgba(212,188,144,0.95)'); }
    if (k % 5 === 2) { g.fillStyle = '#D9C29A'; g.beginPath(); g.ellipse(l * 0.55, w * 0.18, 4, 2.6, 0.3, 0, TAU); g.fill(); g.strokeStyle = '#6A5A3A'; g.lineWidth = 0.8; g.stroke(); }
    if (k % 3 === 0) { g.save(); XY.path(g, pts, true); g.clip(); const sg = g.createLinearGradient(l * 0.78, 0, l, 0); sg.addColorStop(0, 'rgba(150,110,50,0)'); sg.addColorStop(1, 'rgba(150,110,50,0.75)'); g.fillStyle = sg; g.fillRect(l * 0.7, -w, l * 0.3, 2 * w); g.restore(); }
    g.restore();
  };
  const LEAVES = []; { const R = XY.rng(1801); for (let k = 0; k < 22; k++) { const L = LIMBS[k % 4], c = XY.RIG.spline(L.p, false, 8), i = 2 * Math.floor((0.15 + 0.8 * R()) * (c.length / 2 - 1));
    LEAVES.push({ x: c[i], y: c[i + 1], a: (R() < 0.5 ? -1 : 1) * (0.5 + R() * 1.2) + Math.PI * (R() < 0.3 ? 1 : 0) + 0.5, l: 110 + R() * 70, w: 42 + R() * 16, s: R() * 9 }); } }
  // the fruit: a baby on a stalk — round head with a tuft, body, kicking arms and legs, rosy cheeks
  const baby = (g, x, y, s, t, k, sway) => {
    g.save(); g.translate(x, y); g.rotate(sway); g.scale(s, s);
    stroke(g, [0, -26, 0, -12], 1.4, '#5A6A3A'); g.fillStyle = '#6A8A4A'; g.beginPath(); g.ellipse(-5, -22, 5, 2.4, -0.5, 0, TAU); g.fill();
    const kick = Math.sin(t * 6 + k * 1.7), nod = 0.18 * Math.sin(t * 4 + k);
    const skin = '#F4E2CA', ln = 'rgba(120,70,40,0.85)';
    [[-6, 14, -12 - 3 * kick, 26], [6, 14, 12 + 3 * kick, 25 - 2 * kick]].forEach(([a, b, c, d]) => { stroke(g, [a, b, c, d], 5, ln); stroke(g, [a, b, c, d], 3.4, skin); });
    [[-7, 2, -15, 8 + 4 * kick], [7, 2, 15, 7 - 4 * kick]].forEach(([a, b, c, d]) => { stroke(g, [a, b, c, d], 4.4, ln); stroke(g, [a, b, c, d], 3, skin); });
    g.fillStyle = skin; g.beginPath(); g.ellipse(0, 7, 9, 11, 0, 0, TAU); g.fill(); g.strokeStyle = ln; g.lineWidth = 0.9; g.stroke();
    g.save(); g.rotate(nod); g.fillStyle = skin; g.beginPath(); g.arc(0, -6, 8.5, 0, TAU); g.fill(); g.stroke();
    g.fillStyle = 'rgba(230,140,130,0.5)'; g.beginPath(); g.arc(-4.4, -4, 2.4, 0, TAU); g.arc(4.4, -4, 2.4, 0, TAU); g.fill();
    stroke(g, [-3.4, -7, -1.6, -7], 0.9, INK); stroke(g, [1.6, -7, 3.4, -7], 0.9, INK); stroke(g, [-1.4, -2.4, 0, -1.6, 1.4, -2.4], 0.8, '#B04A3A');
    g.fillStyle = INK; g.beginPath(); g.ellipse(0, -14, 3, 2, 0, 0, TAU); g.fill(); g.restore();
    g.restore();
  };
  const FRUIT = [[520, 300, 0.95], [600, 372, 1.0], [700, 228, 1.05], [790, 214, 0.95], [880, 192, 1.0], [930, 330, 1.05], [610, 104, 0.9], [990, 170, 0.95]];
  const TARGET = [818, 470];   // the low fruit Wukong raps at beat 3
  const LAND = [560, 260];     // the twig the bird lands on
  // a small academy bird (a bulbul): black cap, white nape patch, olive back, pale belly; perched or flying
  const bird = (g, x, y, dir, fly, t, look) => {
    g.save(); g.translate(x, y); g.scale(dir * 1.15, 1.15);
    const ln = 'rgba(40,30,20,0.9)';
    if (fly > 0) { const w = Math.sin(t * 26); [[-1, '#7A7A52'], [1, '#8A8A60']].forEach(([s, c]) => { g.fillStyle = c; XY.path(g, sp([-4, -4, -14, -18 - 18 * w * s, 6, -26 - 16 * w * s, 12, -6], 4), true); g.fill(); g.strokeStyle = ln; g.lineWidth = 0.8; g.stroke();
      for (let k = 0; k < 4; k++) stroke(g, [-2 + k * 3, -6, -10 + k * 5, -18 - 14 * w * s], 0.5, 'rgba(40,30,20,0.6)'); }); }
    g.fillStyle = '#6E6E4A'; XY.path(g, [-14, 2, -40, 14, -38, 18, -12, 8], true); g.fill(); g.strokeStyle = ln; g.lineWidth = 0.8; g.stroke();
    for (let k = 0; k < 3; k++) stroke(g, [-16, 4 + k, -38, 15 + k * 1.2], 0.5, 'rgba(40,30,20,0.6)');
    g.fillStyle = '#E8E2D0'; g.beginPath(); g.ellipse(0, 4, 16, 10, -0.15, 0, TAU); g.fill(); g.stroke();
    g.fillStyle = '#7E7E54'; XY.path(g, sp([-14, 0, -4, -8, 10, -6, 6, 4, -8, 6], 4), true); g.fill(); g.stroke();
    for (let k = 0; k < 5; k++) stroke(g, [-10 + k * 3.4, -3, -12 + k * 3.4, 4], 0.5, 'rgba(40,30,20,0.55)');
    g.save(); g.translate(13, -6); g.rotate(look * 0.25);
    g.fillStyle = '#1E1A16'; g.beginPath(); g.arc(0, 0, 7, 0, TAU); g.fill(); g.fillStyle = '#F2EEE4'; g.beginPath(); g.ellipse(-3, -2, 3, 2.2, 0, 0, TAU); g.fill();
    g.fillStyle = '#2A2016'; XY.path(g, [6, -1, 13, 1, 6, 2], true); g.fill(); g.fillStyle = '#F4E8C0'; g.beginPath(); g.arc(3, -1, 1.3, 0, TAU); g.fill(); g.restore();
    if (fly <= 0) { stroke(g, [-2, 12, -4, 18], 1, '#6A4A30'); stroke(g, [4, 12, 4, 18], 1, '#6A4A30'); }
    g.restore();
  };
  // a Taihu rock the academy way (v10): pale ink-wash body darkening into the hollows and along the contour, dry-brush
  // texture strokes (皴擦) following the folds, white unpainted ridges, moss dots along the top edges
  const taihu = g => {
    const P = sp([36, 702, 18, 640, 46, 590, 24, 530, 52, 478, 44, 430, 88, 410, 120, 444, 164, 420, 206, 452, 190, 500, 226, 548, 204, 610, 236, 660, 222, 702], 6);
    XY.path(g, P, true); g.fillStyle = '#C8C6B4'; g.fill();
    g.save(); XY.path(g, P, true); g.clip();
    for (let k = 0; k < 14; k++) { const x = 20 + XY.hash(k, 5, 181) * 220, y = 410 + XY.hash(k, 6, 181) * 290, r = 26 + XY.hash(k, 7, 181) * 50, rg = g.createRadialGradient(x, y, 0, x, y, r);
      rg.addColorStop(0, 'rgba(70,74,66,0.32)'); rg.addColorStop(1, 'rgba(70,74,66,0)'); g.fillStyle = rg; g.fillRect(x - r, y - r, 2 * r, 2 * r); }
    g.strokeStyle = 'rgba(50,48,40,0.35)'; g.lineWidth = 16; XY.path(g, P, true); g.stroke();
    // dry-brush strokes: broken parallel hairs along curving folds
    for (let k = 0; k < 18; k++) { const x0 = 30 + XY.hash(k, 1, 183) * 190, y0 = 420 + XY.hash(k, 2, 183) * 260, a = 1.2 + 0.5 * (XY.hash(k, 3, 183) - 0.5), l = 30 + 40 * XY.hash(k, 4, 183);
      for (let j = 0; j < 6; j++) { const P2 = []; for (let q = 0; q <= 8; q++) { const s = q / 8; P2.push(x0 + j * 2.2 + Math.cos(a) * l * s + 6 * Math.sin(s * 3 + k), y0 + Math.sin(a) * l * s); }
        g.save(); g.setLineDash([4 + 6 * XY.hash(k, j, 184), 3 + 4 * XY.hash(j, k, 185)]); stroke(g, P2, 0.9, `rgba(42,36,28,${0.25 + 0.25 * XY.hash(k, j, 186)})`); g.restore(); } }
    // unpainted ridges
    [[60, 470, 120, 450], [150, 470, 196, 500], [40, 560, 90, 600], [170, 590, 210, 640]].forEach(([a, b, c, d]) => stroke(g, XY.RIG.spline([a, b, (a + c) / 2, (b + d) / 2 - 8, c, d], false, 4), 4, 'rgba(240,236,220,0.6)'));
    g.restore();
    [[86, 500, 15, 24], [150, 540, 21, 13], [64, 610, 11, 17], [176, 626, 10, 14], [128, 462, 8, 10], [110, 660, 13, 8]].forEach(([x, y, rx, ry]) => {
      const rg = g.createRadialGradient(x, y - 3, 1, x, y, Math.max(rx, ry) * 1.6); rg.addColorStop(0, 'rgba(30,30,26,0.95)'); rg.addColorStop(0.6, 'rgba(60,62,54,0.7)'); rg.addColorStop(1, 'rgba(90,92,80,0)');
      g.fillStyle = rg; g.beginPath(); g.ellipse(x, y, rx * 1.5, ry * 1.5, 0.3, 0, TAU); g.fill();
      g.fillStyle = 'rgba(24,24,20,0.9)'; g.beginPath(); g.ellipse(x, y, rx, ry, 0.3, 0, TAU); g.fill();
      stroke(g, XY.RIG.spline([x - rx, y, x - rx * 0.4, y - ry * 1.1, x + rx * 0.6, y - ry, x + rx, y], false, 3), 1.2, INK); });
    g.strokeStyle = INK; g.lineWidth = 1.5; XY.path(g, P, true); g.stroke();
    for (let k = 0; k < 40; k++) { const i = 2 * Math.floor(XY.hash(k, 1, 187) * 13), x = P[i * 5 % (P.length - 2)] , y = P[i * 5 % (P.length - 2) + 1]; if (y > 640) continue;
      g.fillStyle = k % 3 ? 'rgba(30,34,24,0.85)' : 'rgba(70,100,50,0.8)'; g.beginPath(); g.ellipse(x + (XY.hash(k, 2, 187) - 0.5) * 12, y + 2 + XY.hash(k, 3, 187) * 5, 2.4, 1.6, 0, 0, TAU); g.fill(); }
  };
  const soil = (g, W, H) => {
    const P = sp([-20, 700, 300, 694, 600, 700, 900, 692, W + 20, 698, W + 20, H + 20, -20, H + 20], 6); XY.path(g, P, true);
    const gr = g.createLinearGradient(0, 690, 0, H); gr.addColorStop(0, 'rgba(150,110,60,0.55)'); gr.addColorStop(1, 'rgba(110,80,40,0.6)'); g.fillStyle = gr; g.fill();
    for (let k = 0; k < 200; k++) { g.fillStyle = `rgba(60,80,40,${0.3 + 0.4 * XY.hash(k, 3, 182)})`; g.beginPath(); g.ellipse(XY.hash(k, 1, 182) * W, 700 + XY.hash(k, 2, 182) * 70, 2, 1.2, 0, 0, TAU); g.fill(); }
    for (let k = 0; k < 18; k++) { const x = 260 + k * 52 + XY.hash(k, 4, 182) * 20; for (let j = 0; j < 5; j++) stroke(g, [x, 704, x + (j - 2) * 5, 690 - 6 * XY.hash(k, j, 183)], 0.9, '#4E6A3A'); }
  };
  const inscription = g => {
    K.vtext(g, '人参果', 132, 86, 58, XY.cnFont.kai, 'rgba(36,28,20,0.9)', 1.08);
    K.vtext(g, '第十八难', 70, 92, 26, XY.cnFont.kai, 'rgba(36,28,20,0.85)', 1.1);
    // 天下一人 cipher signature (花押)
    g.strokeStyle = 'rgba(36,28,20,0.85)'; g.lineWidth = 2.6; g.lineCap = 'round';
    stroke(g, [106, 300, 158, 296], 2.6, 'rgba(36,28,20,0.85)'); stroke(g, XY.RIG.spline([132, 300, 128, 316, 116, 330, 140, 322, 150, 334], false, 4), 2.4, 'rgba(36,28,20,0.85)'); stroke(g, [96, 344, 168, 340], 3, 'rgba(36,28,20,0.85)');
    K.seal(g, 116, 360, 36, '御书', true);
  };
  const PEN = K.pen({ fur: '#9A7448', face: '#F2DCC0', wkshirt: '#B8503A', tiger: '#D8A458', stripe: INK, gold: '#C8A04A', staff: '#B8503A', ink: INK, horse: '#F6F0E2', horse2: '#E0D6C2', mane: '#EEE6D4',
    hoof: '#5A4A3A', saddle: '#7A4A30', red: '#B8503A', robe: '#EAD6A0', kasaya: '#B8402E', skin: '#F4DEC4', metal: '#C8A04A', bjrobe: '#4A5260', bjpants: '#3E4450', pig: '#F0C4B6', pig2: '#DCA898',
    wood: '#8A6A44', ssrobe: '#5A6E6A', ssrobe2: '#4A5C58', skin2: '#C8A07E', ssh: '#A84A30', ssbeard: '#94402A', skull: '#F0E8D8', bundle: '#C8A060' }, { outline: INK, ow: 0.85, shade: 'rgba(120,70,30,0.16)' });

  // pale academy colouring for the pilgrims (淡彩): colours mixed toward the silk, fine ink line, darker 分染 at edges
  const mixC = (hex, k) => { const n = parseInt(hex.slice(1), 16), s = [212, 188, 144], c = [n >> 16, (n >> 8) & 255, n & 255].map((v, i) => Math.round(v + (s[i] - v) * k)); return `rgb(${c[0]},${c[1]},${c[2]})`; };
  const PALE = (() => { const o = {}; Object.keys(XY.DEFAULT_COLORS).forEach(r => { const v = PEN.color(r); o[r] = typeof v === 'string' && v[0] === '#' && r !== 'ink' && r !== 'stripe' ? mixC(v, 0.28) : v; }); return o; })();
  const PEN2 = { ...PEN, ow: 0.75, color: r => PALE[r] };
  // 清风 and 明月: two Daoist boys with double topknots, a lacquer tray with two fruit
  const boy = (g, x, y, col, k, t, tray) => {
    g.save(); g.translate(x, y);
    const ln = 'rgba(51,40,28,0.9)', st = Math.sin(t * 8 + k) * (tray ? 0 : 1);
    stroke(g, [-6, -30, -10 + 6 * st, 0], 5, ln); stroke(g, [6, -30, 8 - 6 * st, 0], 5, ln);
    XY.path(g, sp([-18, -26, -16, -70, -8, -86, 8, -86, 16, -70, 18, -26], 4), true); g.fillStyle = col; g.fill(); g.strokeStyle = ln; g.lineWidth = 1; g.stroke();
    stroke(g, [-14, -50, 14, -50], 3, '#B8503A');
    g.beginPath(); g.arc(0, -98, 12, 0, TAU); g.fillStyle = '#F4E2CA'; g.fill(); g.stroke();
    [-9, 9].forEach(d => { g.beginPath(); g.arc(d, -110, 6, 0, TAU); g.fillStyle = '#2A2016'; g.fill(); });
    g.fillStyle = INK; g.beginPath(); g.arc(-5, -99, 1.3, 0, TAU); g.fill(); stroke(g, [-7, -92, -3, -91], 0.8, '#B04A3A');
    if (tray) { stroke(g, [-14, -64, -34, -62], 6, col); g.fillStyle = '#7A2A1E'; g.beginPath(); g.ellipse(-40, -64, 22, 5, 0, 0, TAU); g.fill(); g.strokeStyle = ln; g.stroke(); }
    g.restore();
  };
  const tipAt = (c, u) => { const t = c.t0 + u * c.dur, w = XY.walkPhase(t), a = XY.anchor('wukong.staffEnd', w, { wukong: { strike: 1 } }); return [XY.procWorldX(t) - c.x + a[0], XY.LAYOUT.GROUND + a[1]]; };

  XY.STYLES.songbird = {
    hits: [2.5, 4, 4.8],
    thumb: 6,
    bg(g, W, H) {
      K.silk(g, W, H, { seed: 1801, base: '#D4BC90', age: 0.42, creases: 2 });
      g.lineCap = 'round'; g.lineJoin = 'round';
      soil(g, W, H); taihu(g); inscription(g);
      LIMBS.forEach(L => limb(g, L));
      K.seal(g, W - 86, 724, 40, '宣和', false);
    },
    draw(g, e) {
      const { W, u, t, cell } = e, d = cell.dur; g.lineCap = 'round'; g.lineJoin = 'round';
      // beats 0–2.4: 清风明月 offer two fruit; Tang Seng recoils with his palm up; they shrug and carry them off to the right
      const go = XY.easeIn((u - 0.18) / 0.16);
      if (go < 1) [[1010, '#E8DCC0', 0], [1066, '#C8D4CC', 1]].forEach(([x, col, k]) => { const bx = x + 300 * go; boy(g, bx, e.groundY, col, k, t, go < 0.05);
        if (go < 0.05) for (let j = 0; j < 2; j++) baby(g, bx - 48 + j * 18, e.groundY - 78, 0.62, t, 20 + j + k * 2, 0.2 * Math.sin(t * 3 + j)); });
      // the bird lands at beat 2.5 (the twig dips and springs) and bolts when the fruit is struck (beat 4)
      const fu = XY.clamp((u - 0.12) / 0.19), landed = u >= 0.3125, flee = XY.clamp((u - 0.505) / 0.2), dt = Math.max(0, u - 0.3125) * d;
      const dip = landed ? 14 * Math.exp(-dt * 4) * Math.cos(dt * 16) + 4 * (flee > 0 ? 0 : 1) : 0, sway = landed ? 0.14 * Math.exp(-dt * 2.5) * Math.sin(dt * 9) : 0;
      LEAVES.forEach((L, k) => leaf(g, L.x, L.y, L.a + 0.04 * Math.sin(t * 1.3 + L.s) + (k % 6 === 0 ? sway * 0.5 : 0), L.l, L.w, k));
      const tw0 = [620, 236], tw1 = [LAND[0], LAND[1] + dip];
      stroke(g, [tw0[0], tw0[1], (tw0[0] + tw1[0]) / 2, (tw0[1] + tw1[1]) / 2 - 3, tw1[0], tw1[1]], 3.4, '#6A5440'); leaf(g, (tw0[0] + tw1[0]) / 2, (tw0[1] + tw1[1]) / 2 - 2, -2.2 + dip * 0.01, 54, 18, 3);
      FRUIT.forEach(([x, y, s], k) => baby(g, x, y + (k < 2 ? dip * 0.5 : 0), s, t, k, 0.08 * Math.sin(t * 2 + k) + (k < 3 ? sway : sway * 0.3)));
      // the low fruit hangs on a long drooping twig exactly where Wukong's staff will strike (beat 4)
      const [TX, TY] = tipAt(cell, 0.5), FX = TX + 6, FY = TY - 20;
      stroke(g, XY.RIG.spline([960, 300, 950, 400, FX + 4, FY - 80, FX, FY - 30], false, 5), 2.4, '#6A5440'); leaf(g, 952, 420, 2.2, 70, 24, 7);
      const hit = u >= 0.5, fall = XY.clamp((u - 0.5) / 0.0625), burrow = XY.clamp((u - 0.5625) / 0.0625), GX = FX + 30;
      if (!hit) baby(g, FX, FY, 1.6, t, 9, 0.12 * Math.sin(t * 2.6));
      else if (burrow < 1) { const q = XY.easeIn(fall), x = XY.lerp(FX, GX, q), y = XY.lerp(FY, e.groundY - 18, q) + 34 * burrow, rot = 4 * fall + 14 * burrow;
        g.save(); g.beginPath(); g.rect(0, 0, W, e.groundY + 2); g.clip(); baby(g, x, y, 1.6 * (1 - 0.3 * burrow), t, 9, rot); g.restore();
        if (burrow > 0) for (let k = 0; k < 26; k++) { const a = -Math.PI * (0.1 + 0.8 * XY.hash(k, 1, 18)), v = 30 + 90 * XY.hash(k, 2, 18), ph = (burrow * 2 + XY.hash(k, 3, 18)) % 1;
          g.fillStyle = `rgba(110,80,40,${0.9 * (1 - ph)})`; g.fillRect(GX + Math.cos(a) * v * ph, e.groundY - 4 + Math.sin(a) * v * ph + 60 * ph * ph, 3.4, 3.4); } }
      if (u >= 0.5 && u < 0.54) { const a = (u - 0.5) / 0.04; g.strokeStyle = `rgba(226,180,60,${1 - a})`; g.lineWidth = 3; for (let k = 0; k < 10; k++) { const an = k / 10 * TAU; g.beginPath(); g.moveTo(FX + Math.cos(an) * 14, FY + Math.sin(an) * 14); g.lineTo(FX + Math.cos(an) * (24 + 30 * a), FY + Math.sin(an) * (24 + 30 * a)); g.stroke(); } }
      if (u >= 0.5625) { const a = XY.clamp((u - 0.625) / 0.3); g.fillStyle = 'rgba(70,50,26,0.85)'; g.beginPath(); g.ellipse(GX, e.groundY + 2, 14, 4, 0, 0, TAU); g.fill();
        g.strokeStyle = `rgba(90,60,30,${0.8 * (1 - a)})`; g.lineWidth = 1.2; for (let k = 0; k < 3; k++) { g.beginPath(); g.ellipse(GX, e.groundY + 2, 18 + 50 * a + k * 9, 4 + 7 * a + k * 1.6, 0, 0, TAU); g.stroke(); } }
      // the bird
      if (!landed) { const q = XY.easeOut(fu), x = XY.lerp(-60, LAND[0] + 4, q), y = XY.lerp(140, LAND[1] + dip - 18, q) - 70 * Math.sin(q * Math.PI); if (fu > 0) bird(g, x, y, 1, 1, t, 0); }
      else if (flee <= 0) bird(g, LAND[0] + 4, LAND[1] + dip - 18, Math.floor(t * 1.2) % 3 === 2 ? -1 : 1, 0, t, Math.sin(t * 3));
      else if (flee < 1) { const q = XY.easeIn(flee); bird(g, LAND[0] + 4 - 700 * q, LAND[1] - 18 - 260 * q + 40 * Math.sin(q * 9), -1, 1, t, 0); }
      // Bajie: leaps over the horse at the falling fruit (beat 4.2), belly-flops on the empty hole (beat 4.8), sits up
      // empty-handed scratching, hops back into line (beat 6.4–6.9)
      const out = u >= 0.52 && u < 0.865, slot = (uu) => XY.procWorldX(cell.t0 + uu * d) - cell.x - 150;
      const acts = { wukong: { strike: XY.smooth((u - 0.47) / 0.03) * (1 - XY.smooth((u - 0.56) / 0.05)), shade: XY.smooth((u - 0.6) / 0.04) * (1 - XY.smooth((u - 0.74) / 0.05)) },
        monk: { palm: XY.smooth((u - 0.02) / 0.06) * (1 - XY.smooth((u - 0.26) / 0.06)) }, bajie: { scratch: XY.smooth((u - 0.86) / 0.04) * (1 - XY.smooth((u - 1) / 0.06)) }, shaseng: { lift: XY.smooth((u - 0.7) / 0.1) }, cast: { bajie: !out } };
      K.shadedTeam(g, e, PEN2, acts, null, [[3, 2.5, 'rgba(140,80,30,0.26)'], [-2, -1.5, 'rgba(255,250,236,0.3)'], [1.2, 1, 'rgba(90,60,30,0.18)']]);
      if (out) { const w = XY.walkPhase(e.t);
        let x, y, rot = 0, kneel = 0, sc = 0;
        if (u < 0.6) { const q = XY.easeIO((u - 0.52) / 0.08); x = XY.lerp(slot(0.52), GX - 40, q); y = XY.lerp(e.groundY, e.groundY, q) - 260 * Math.sin(q * Math.PI); rot = 1.4 * q; }
        else if (u < 0.78) { x = GX - 40; y = e.groundY; const up = XY.smooth((u - 0.66) / 0.05); rot = 1.4 * (1 - up); kneel = up; sc = up * (0.5 + 0.5 * Math.sin(t * 9)); }
        else { const q = XY.easeIO((u - 0.78) / 0.085); x = XY.lerp(GX - 40, slot(0.865), q); y = e.groundY - 200 * Math.sin(q * Math.PI); rot = -0.3 * Math.sin(q * Math.PI); }
        K.figure(g, 'bajie', w, x, y, PEN2, { bajie: { scratch: sc } }, { rot, kneel, flip: u > 0.78 ? false : false });
        if (u >= 0.6 && u < 0.64) { const a = (u - 0.6) / 0.04; for (let k = 0; k < 16; k++) { const an = Math.PI + k / 15 * Math.PI, r = 30 + 90 * a; g.fillStyle = `rgba(110,80,40,${1 - a})`; g.beginPath(); g.arc(GX - 10 + Math.cos(an) * r, e.groundY + Math.sin(an) * r * 0.3, 3.4, 0, TAU); g.fill(); } } }
    },
    post(canvas, g, e) { const [TX, TY] = tipAt(e.cell, 0.5); K.zoomPost(canvas, g, e, TX, TY + 60, K.zoom(e.u, [0.46, 0.53, 0.74], 1.12)); },
  };
})();
