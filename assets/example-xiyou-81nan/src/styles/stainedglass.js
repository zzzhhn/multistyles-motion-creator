// 20 哥特彩色玻璃 · 1220 年 · 贬退心猿 — a Chartres-style window: blue lozenge ground with red fillets, four narrative
// medallions (the White Bone Demon as village girl, old woman, old man; Tang Seng writing the letter of dismissal),
// a row of canopy towers, iron saddle bars, and a stone sill catching the coloured light. 悟空 strikes three times
// (each disguise shatters into bones), Tang Seng recites the band spell, the 贬 letter flies down into 悟空's hand,
// and on beat 3 the light goes out of him: his glass turns dead grey while the others glow. He turns, bows, and
// somersaults out through the border. The pilgrims are leaded glass: thick cames, inner lead lines, mottled pot-metal.
(() => {
  'use strict';
  const XY = window.XY, K = XY.KIT_C, TAU = XY.TAU;
  const LEAD = '#14110F', GRIS = 'rgba(40,24,14,0.85)';
  const COL = { fur: '#8C4A1E', face: '#EBCDA8', wkshirt: '#B8161C', tiger: '#E6A51E', stripe: LEAD, gold: '#F4C632', staff: '#B8161C', ink: '#24160E',
    horse: '#E9EEE2', horse2: '#BCC8B8', mane: '#DCE4D4', hoof: '#2A2420', saddle: '#6A1A48', red: '#C41C24', robe: '#E8B21E', kasaya: '#B8161C',
    skin: '#EDD0AE', metal: '#D9B33A', bjrobe: '#3A2A62', bjpants: '#2C2150', pig: '#E8A6A2', pig2: '#C87470', wood: '#7A4A20', ssrobe: '#1E6E3C', ssrobe2: '#165432',
    skin2: '#C88E5E', ssh: '#C42C1A', ssbeard: '#A22A18', skull: '#F2F0E2', bundle: '#DCA41E' };
  const DEAD = '#5E626E';
  const penFor = dim => ({ color: r => (dim > 0 ? K.mix(COL[r] || XY.DEFAULT_COLORS[r], r === 'ink' || r === 'stripe' ? LEAD : DEAD, dim) : COL[r] || XY.DEFAULT_COLORS[r]),
    outline: LEAD, ow: 3, wob: 0.35, seed: 20, shade: 'rgba(30,14,40,0.28)' });
  const PEN = penFor(0);
  const MED = [[177, 196], [531, 196], [885, 196], [1239, 196]], MR = 136;
  const HIT = [2.2, 3.0, 3.8];   // the three strikes (beats; 12-beat cell)

  // one leaded piece: fill + a light core (glass is brighter in the middle of a piece than at its came)
  const piece = (g, pts, col, hi = 0.18) => {
    XY.path(g, pts, true); g.fillStyle = col; g.fill();
    if (hi > 0) { let cx = 0, cy = 0; const n = pts.length / 2; for (let k = 0; k < pts.length; k += 2) { cx += pts[k]; cy += pts[k + 1]; } cx /= n; cy /= n;
      [[0.72, 0.3], [0.42, 0.55]].forEach(([f, a]) => { const o = []; for (let k = 0; k < pts.length; k += 2) o.push(cx + (pts[k] - cx) * f - 1.5, cy + (pts[k + 1] - cy) * f - 2);
        XY.path(g, o, true); g.fillStyle = `rgba(255,255,236,${hi * a})`; g.fill(); }); }
  };
  const ring = (g, cx, cy, r0, r1, n, cols, gap = 1.6, a0 = 0) => {
    for (let k = 0; k < n; k++) { const a = a0 + k / n * TAU, b = a0 + (k + 1) / n * TAU, da = gap / r1, pts = [];
      for (let q = 0; q <= 4; q++) { const t = XY.lerp(a + da, b - da, q / 4); pts.push(cx + Math.cos(t) * (r1 - gap), cy + Math.sin(t) * (r1 - gap)); }
      for (let q = 4; q >= 0; q--) { const t = XY.lerp(a + da * r1 / r0, b - da * r1 / r0, q / 4); pts.push(cx + Math.cos(t) * (r0 + gap), cy + Math.sin(t) * (r0 + gap)); }
      piece(g, pts, cols[k % cols.length], 0.14); }
  };
  // background: lozenges of blue pot-metal glass, a red fillet every fourth row, grisaille quatrefoil dots
  const ground = (g, W, H) => {
    const D = 48, R = XY.rng(2020), blues = ['#1D3B8E', '#173279', '#2547A2', '#1B378A', '#223F96'];
    for (let j = -1; j < H / (D / 2) + 1; j++) for (let i = -1; i < W / D + 1; i++) {
      const x = i * D + (j % 2 ? D / 2 : 0), y = j * D / 2, gp = 1.8, red = (((i + j) % 7) + 7) % 7 === 0;
      piece(g, [x, y - D / 2 + gp, x + D / 2 - gp, y, x, y + D / 2 - gp, x - D / 2 + gp, y], red ? '#A5161E' : blues[Math.floor(R() * blues.length)], 0.16);
      g.fillStyle = GRIS; for (let q = 0; q < 4; q++) { const a = q * Math.PI / 2; g.beginPath(); g.arc(x + Math.cos(a) * 5, y + Math.sin(a) * 5, 2.4, 0, TAU); g.fill(); }
    }
  };
  const medallionFrame = (g, cx, cy) => {
    g.fillStyle = LEAD; g.beginPath(); g.arc(cx, cy, MR + 4, 0, TAU); g.fill();
    ring(g, cx, cy, MR - 16, MR, 28, ['#F2EBD0', '#E8B21E']);                            // pearl band
    ring(g, cx, cy, MR - 24, MR - 16, 20, ['#1E6E3C', '#B8161C', '#1E6E3C', '#E8B21E'], 1.2, 0.1);
    for (let k = 0; k < 6; k++) { const a = k / 6 * TAU + 0.26; ring(g, cx, cy, 8 + k * 18, 8 + (k + 1) * 18 - 0.01, 6 + k * 4, k % 2 ? ['#A5161E', '#B51C24'] : ['#B51C24', '#9A1219'], 1.6, a); }
    g.strokeStyle = GRIS; g.lineWidth = 1.4;                                              // grisaille foliage scrolls on the red
    for (let k = 0; k < 8; k++) { const a = k / 8 * TAU; g.beginPath(); g.arc(cx + Math.cos(a) * 80, cy + Math.sin(a) * 80, 12, a, a + 4.2); g.stroke(); }
  };
  const border = (g, W, H) => {
    const B = 24, cols = ['#E8B21E', '#1E6E3C', '#B8161C', '#F2EBD0'];
    g.fillStyle = LEAD; g.fillRect(0, 0, W, B); g.fillRect(0, H - 78 - B, W, B); g.fillRect(0, 0, B, H - 78); g.fillRect(W - B, 0, B, H - 78);
    let k = 0;
    for (let x = 0; x < W; x += 34, k++) { piece(g, [x + 2, 2, x + 32, 2, x + 32, B - 2, x + 2, B - 2], cols[k % 4], 0.2); piece(g, [x + 2, H - 78 - B + 2, x + 32, H - 78 - B + 2, x + 32, H - 80, x + 2, H - 80], cols[(k + 2) % 4], 0.2); }
    for (let y = B; y < H - 78 - B; y += 34, k++) { piece(g, [2, y + 2, B - 2, y + 2, B - 2, y + 32, 2, y + 32], cols[k % 4], 0.2); piece(g, [W - B + 2, y + 2, W - 2, y + 2, W - 2, y + 32, W - B + 2, y + 32], cols[(k + 1) % 4], 0.2); }
    g.fillStyle = '#F2EBD0'; for (let x = 17; x < W; x += 34) { g.beginPath(); g.arc(x, B / 2, 4, 0, TAU); g.fill(); }
  };
  // 白虎岭 in glass between the medallions and the pilgrims: peaks, pines, and one white ridge striped like a tiger's back
  const ridge = (g, W) => {
    const R = XY.rng(4747);
    for (let x0 = 24, k = 0; x0 < W - 24; x0 += 96, k++) { const h = 54 + R() * 26, top = 416 - h;
      piece(g, [x0 - 6, 416, x0 + 30, top + 8, x0 + 48, top, x0 + 66, top + 10, x0 + 104, 416], k % 3 === 1 ? '#BCC8D8' : '#8E9CB8', 0.28);
      piece(g, [x0 + 30, top + 10, x0 + 48, top + 2, x0 + 64, top + 12, x0 + 50, top + 22], '#F2F0E6', 0.3);
      piece(g, [x0 + 78, 416, x0 + 86, 382, x0 + 94, 416], '#1E6E3C', 0.2); piece(g, [x0 + 4, 416, x0 + 12, 388, x0 + 20, 416], '#2E7E3A', 0.2); }
    const mx = W / 2; piece(g, [mx - 170, 416, mx - 90, 352, mx, 338, mx + 90, 352, mx + 170, 416], '#F2F0E6', 0.35);   // the white tiger ridge
    g.strokeStyle = LEAD; g.lineWidth = 5; g.lineCap = 'round'; for (let k = -3; k <= 3; k++) { const x = mx + k * 42, y = 346 + Math.abs(k) * 7; g.beginPath(); g.moveTo(x - 10, y + 2); g.quadraticCurveTo(x + 6, y + 12, x - 2, y + 30); g.stroke(); }
    g.fillStyle = LEAD; g.fillRect(0, 414, W, 4);
  };
  // ------------------------------------------------------------ medallion scenes (figures leaded over the red ground)
  const pc = (g, pts, col, hi = 0.2) => { piece(g, pts, col, hi); XY.path(g, pts, true); g.strokeStyle = LEAD; g.lineWidth = 3; g.stroke(); };
  const disc = (g, x, y, r, col) => pc(g, XY.ellipse(x, y, r, r, 18), col, 0.25);
  const face = (g, x, y, r, beard) => { disc(g, x, y, r, '#EDD0AE'); g.strokeStyle = GRIS; g.lineWidth = 1.3;
    g.beginPath(); g.moveTo(x + 2, y - 3); g.lineTo(x + 8, y - 4); g.moveTo(x + 4, y + 6); g.lineTo(x + 9, y + 5); g.stroke(); g.fillStyle = GRIS; g.beginPath(); g.arc(x + 6, y - 1, 1.6, 0, TAU); g.fill();
    if (beard) pc(g, [x - 4, y + 6, x + 12, y + 4, x + 8, y + 30, x + 2, y + 34, x - 4, y + 20], '#F2F0E2'); };
  const girl = (g, x, y, t) => {   // 村姑: green robe, red apron, a blue jar and a green bottle of food
    pc(g, [x - 28, y + 92, x + 28, y + 92, x + 16, y - 30, x - 16, y - 30], '#1E6E3C');
    pc(g, [x - 16, y + 88, x + 18, y + 88, x + 10, y + 10, x - 8, y + 10], '#B8161C');
    const sw = 3 * Math.sin(t * 2.2);
    pc(g, [x + 14, y - 22, x + 40, y + 4 + sw, x + 34, y + 12 + sw, x + 12, y - 8], '#1E6E3C');
    pc(g, XY.ellipse(x + 44, y + 18 + sw, 13, 15, 16), '#2547A2'); pc(g, [x + 36, y + 2 + sw, x + 52, y + 2 + sw, x + 50, y - 6 + sw, x + 38, y - 6 + sw], '#2547A2');
    pc(g, [x - 14, y - 22, x - 36, y + 6, x - 30, y + 12, x - 12, y - 6], '#1E6E3C'); pc(g, [x - 40, y + 2, x - 26, y + 2, x - 28, y + 30, x - 38, y + 30], '#3E9A5A');
    face(g, x, y - 48, 17); disc(g, x - 10, y - 66, 10, '#2A1E1A'); disc(g, x - 2, y - 64, 8, '#2A1E1A');
  };
  const oldwoman = (g, x, y, t) => {   // 老妇: bent, white hair, purple robe, tapping a bamboo cane
    const tap = Math.max(0, Math.sin(t * 3.4)) * 4;
    pc(g, [x - 30, y + 92, x + 26, y + 92, x + 22, y - 6, x + 4, y - 30, x - 16, y - 20], '#6A1A48');
    pc(g, [x - 14, y + 88, x + 10, y + 88, x + 6, y + 20, x - 10, y + 22], '#8E3A6A');
    g.strokeStyle = LEAD; g.lineWidth = 7; g.beginPath(); g.moveTo(x + 22, y - 2 - tap); g.lineTo(x + 34, y + 92 - tap); g.stroke(); g.strokeStyle = '#E8B21E'; g.lineWidth = 3.4; g.stroke();
    pc(g, [x + 4, y - 20, x + 26, y - 4, x + 22, y + 6, x + 2, y - 8], '#6A1A48');
    face(g, x + 12, y - 40, 15); pc(g, [x - 2, y - 52, x + 14, y - 58, x + 24, y - 50, x + 4, y - 34, x - 6, y - 38], '#F2F0E2');
  };
  const oldman = (g, x, y, t) => {   // 老翁: amber robe, white beard, prayer beads swinging
    pc(g, [x - 26, y + 92, x + 26, y + 92, x + 18, y - 28, x - 18, y - 28], '#8C4A1E');
    pc(g, [x - 22, y - 26, x + 22, y - 26, x + 12, y + 10, x - 12, y + 10], '#E6A51E');
    const sw = 0.4 * Math.sin(t * 2.6);
    for (let k = 0; k < 9; k++) { const a = Math.PI / 2 + sw + (k - 4) * 0.28; disc(g, x + 26 + Math.cos(a) * 18, y - 2 + Math.sin(a) * 18, 3.4, '#F2EBD0'); }
    face(g, x, y - 48, 17, true); pc(g, [x - 18, y - 56, x - 4, y - 72, x + 16, y - 66, x + 18, y - 58], '#3A2A62');
  };
  const bone = (g, x0, y0, x1, y1) => { g.strokeStyle = LEAD; g.lineWidth = 9; g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.stroke(); g.strokeStyle = '#F2F0E2'; g.lineWidth = 4.5; g.stroke();
    [[x0, y0], [x1, y1]].forEach(([x, y]) => { disc(g, x - 2, y, 4.6, '#F2F0E2'); disc(g, x + 3, y + 2, 4.6, '#F2F0E2'); }); };
  const bones = (g, x, y, k, a) => {   // what is left after each strike; the third pile is named on its spine
    g.globalAlpha = a;
    pc(g, [x - 46, y + 94, x + 48, y + 94, x + 36, y + 82, x - 34, y + 84], '#E6E2CE');
    bone(g, x - 40, y + 76, x + 10, y + 60); bone(g, x - 6, y + 80, x + 44, y + 72); bone(g, x - 30, y + 54, x + 2, y + 86);
    for (let q = 0; q < 4; q++) { g.strokeStyle = LEAD; g.lineWidth = 7; g.beginPath(); g.arc(x - 4, y + 50 + q * 8, 18 - q * 2, Math.PI * 1.05, Math.PI * 1.95); g.stroke(); g.strokeStyle = '#F2F0E2'; g.lineWidth = 3.4; g.stroke(); }
    g.strokeStyle = LEAD; g.lineWidth = 7; g.beginPath(); g.moveTo(x - 4, y + 34); g.lineTo(x - 4, y + 84); g.stroke(); g.strokeStyle = '#E6E2CE'; g.lineWidth = 3.6; g.stroke();
    // skull: cranium, cheekbone, jaw, sockets and teeth (seen in profile, lying by the pile)
    pc(g, [x + 10, y + 46, x + 18, y + 22, x + 36, y + 16, x + 52, y + 26, x + 54, y + 44, x + 46, y + 56, x + 26, y + 58], '#F2F0E2', 0.35);
    pc(g, [x + 28, y + 56, x + 46, y + 56, x + 44, y + 66, x + 30, y + 66], '#E6E2CE');
    g.fillStyle = LEAD; g.beginPath(); g.ellipse(x + 40, y + 36, 6, 7, 0, 0, TAU); g.fill(); g.beginPath(); g.moveTo(x + 48, y + 44); g.lineTo(x + 52, y + 50); g.lineTo(x + 45, y + 50); g.fill();
    g.strokeStyle = GRIS; g.lineWidth = 1.2; for (let q = 0; q < 4; q++) { g.beginPath(); g.moveTo(x + 32 + q * 4, y + 57); g.lineTo(x + 32 + q * 4, y + 63); g.stroke(); }
    if (k === 2) { g.fillStyle = '#2A1A10'; g.font = XY.font(15, XY.cnFont.song, 'bold'); g.save(); g.translate(x - 10, y + 40); g.rotate(Math.PI / 2); g.fillText('白骨夫人', 0, 0); g.restore(); }
    g.globalAlpha = 1;
  };
  // the letter of dismissal: a white glass scroll with 贬 in grisaille and a red seal
  const letter = (g, x, y, s, rot) => {
    g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s);
    pc(g, [-34, -46, 34, -46, 34, 46, -34, 46], '#F2EEDC', 0.35);
    [-50, 50].forEach(yy => pc(g, [-40, yy - 5, 40, yy - 5, 40, yy + 5, -40, yy + 5], '#E8B21E'));
    g.fillStyle = '#2A1A10'; g.font = XY.font(64, XY.cnFont.kai, 'bold'); g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('贬', 0, -2);
    pc(g, [14, 26, 28, 26, 28, 40, 14, 40], '#C41C24', 0.1);
    g.restore();
  };
  const scribe = (g, x, y, t, hasLetter) => {   // Tang Seng seated, writing the letter
    pc(g, [x - 70, y + 92, x - 6, y + 92, x - 14, y + 30, x - 40, y - 24, x - 60, y - 20], '#E8B21E');
    pc(g, [x - 66, y + 90, x - 30, y + 90, x - 24, y + 20, x - 44, y - 16, x - 62, y - 10], '#B8161C');
    face(g, x - 46, y - 42, 16);
    for (let k = -2; k <= 2; k++) pc(g, [x - 46 + k * 7 - 4, y - 56, x - 46 + k * 7 + 4, y - 56, x - 46 + k * 7, y - 70], '#F4C632', 0.1);
    pc(g, [x - 30, y - 6, x - 2, y + 4 + 2 * Math.sin(t * 4), x - 4, y + 12, x - 32, y + 6], '#E8B21E');
    if (hasLetter) letter(g, x + 34, y + 10, 0.92, 0.06);
  };
  const SCENES = [girl, oldwoman, oldman];
  const mottle = () => XY.keep('sg-mot', 160, 160, cv => { const g = cv.getContext('2d'), R = XY.rng(5);
    for (let k = 0; k < 90; k++) { const x = R() * 160, y = R() * 160, r = 6 + R() * 22, li = R() < 0.5; for (const dx of [-160, 0, 160]) for (const dy of [-160, 0, 160]) {
      const gr = g.createRadialGradient(x + dx, y + dy, 0, x + dx, y + dy, r); gr.addColorStop(0, li ? 'rgba(255,250,220,0.16)' : 'rgba(10,6,20,0.14)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(x + dx - r, y + dy - r, 2 * r, 2 * r); } } });
  const leads = () => XY.keep('sg-lead', 300, 300, cv => { const g = cv.getContext('2d'); K.cracks(g, -20, -20, 340, 340, 9, 31, 'rgba(20,17,15,0.92)', 2.6, 12, 14); });
  const restX = e => XY.procWorldX(e.cell.t0 + 8.3 * XY.BEAT) - e.cell.x + K.FX.wukong;

  XY.STYLES.stainedglass = {
    hits: [3.8, 7.2],
    bg(g, W, H, c, scale) {
      g.fillStyle = LEAD; g.fillRect(0, 0, W, H);
      ground(g, W, 702);
      MED.forEach(([x, y]) => medallionFrame(g, x, y));
      ridge(g, W);
      // green ground pieces with flowers, the pilgrims walk on it
      const R = XY.rng(88);
      for (let x = 0; x < W; x += 58) { const y0 = 640 + 10 * Math.sin(x / 70), y1 = 640 + 10 * Math.sin((x + 58) / 70);
        piece(g, [x + 1.5, y0 + 2, x + 56.5, y1 + 2, x + 56.5, 700, x + 1.5, 700], ['#1E6E3C', '#2E7E3A', '#185C34'][Math.floor(R() * 3)], 0.18);
        g.fillStyle = '#E8B21E'; g.beginPath(); g.arc(x + 20 + R() * 20, y0 + 22 + R() * 20, 4, 0, TAU); g.fill(); g.strokeStyle = LEAD; g.lineWidth = 1.5; g.stroke(); }
      border(g, W, H);
      // the window's own number in a roundel: XX in Lombardic letters
      g.fillStyle = LEAD; g.beginPath(); g.arc(54, 54, 33, 0, TAU); g.fill(); pc(g, XY.ellipse(54, 54, 29, 29, 24), '#F2EBD0', 0.3);
      g.fillStyle = '#A5161E'; g.font = XY.font(34, 'Luminari, "Apple Chancery", serif'); g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('XX', 54, 56); g.textAlign = 'left'; g.textBaseline = 'alphabetic';
      // pot-metal mottling over the glass
      g.save(); g.beginPath(); g.rect(0, 0, W, 702); g.clip();
      K.paint(g, K.pix(W, 702, scale, 4, (x, y) => { const n = XY.fbm(x / 70, y / 70, 7, 3), s = XY.noise2(x / 9, y / 140, 4); const v = 255 * (0.84 + 0.12 * n + 0.04 * s); return [v, v, v * 0.98]; }), W, 702, 'multiply');
      g.restore();
      // stone sill under the window: sandstone blocks, a shadowed rebate, coloured light already lying on it
      // a dressed-stone sill: ashlar blocks with chiselled edges, and hard-edged pools of coloured light lying on them
      g.fillStyle = '#2A2420'; g.fillRect(0, 702, W, 78);
      for (let row = 0; row < 2; row++) for (let x = row ? -60 : 0, k = 0; x < W; x += 168, k++) { const y0 = 706 + row * 38, c = ['#B8AA92', '#AE9F86', '#C2B49C'][(k + row) % 3];
        g.fillStyle = c; g.fillRect(x + 2, y0, 164, 34); g.fillStyle = 'rgba(255,248,230,0.35)'; g.fillRect(x + 2, y0, 164, 3); g.fillStyle = 'rgba(40,30,20,0.35)'; g.fillRect(x + 2, y0 + 30, 164, 4);
        g.strokeStyle = 'rgba(60,48,36,0.35)'; g.lineWidth = 0.8; for (let q = 0; q < 10; q++) { const tx = x + 10 + q * 16; g.beginPath(); g.moveTo(tx, y0 + 6); g.lineTo(tx + 6, y0 + 28); g.stroke(); } }
      g.save(); g.globalCompositeOperation = 'screen'; g.globalAlpha = 0.45;
      [[150, '#2547A2'], [470, '#B8161C'], [820, '#2547A2'], [1180, '#E8B21E']].forEach(([x, col]) => { g.fillStyle = col; g.beginPath(); g.moveTo(x - 60, 712); g.lineTo(x + 70, 712); g.lineTo(x + 110, 776); g.lineTo(x - 40, 776); g.closePath(); g.fill(); });
      g.restore();
    },
    draw(g, e) {
      const { W, H, t, u } = e, b = e.beat, S = e.S;
      const strike = Math.max(...HIT.map(h => K.bump(b, h - 0.3, h - 0.05, h + 0.15, h + 0.4))), spell = K.bump(b, 5.0, 5.3, 6.6, 6.9);
      const acts = { wukong: { strike, shade: spell }, monk: { palm: K.bump(b, 4.8, 5.1, 7.0, 7.6) }, bajie: { scratch: K.bump(b, 5.2, 5.5, 6.4, 6.9) }, shaseng: { lift: K.bump(b, 7.6, 8.0, 9.0, 9.6) } };
      // ---- medallions: each disguise shatters into bones on its strike
      MED.forEach(([x, y], k) => {
        g.save(); g.beginPath(); g.arc(x, y, MR - 24, 0, TAU); g.clip();
        g.translate(x, y + 92); g.scale(1.14, 1.14); g.translate(-x, -y - 92);
        if (k === 3) scribe(g, x, y, t, b < 6.0);
        else { const h = HIT[k], after = b - h;
          if (after < 0.06) SCENES[k](g, x, y, t); else bones(g, x, y, k, XY.clamp((after - 0.06) / 0.12));
          if (after > 0 && after < 0.7) { const R = XY.rng(300 + k);
            for (let q = 0; q < 14; q++) { const a = R() * TAU, v = 140 + R() * 160, d = v * after * 0.5, px = x + Math.cos(a) * d, py = y - 10 + Math.sin(a) * d + 260 * after * after;
              g.save(); g.translate(px, py); g.rotate(after * (R() * 12 - 6)); pc(g, [-8, -6, 9, -4, 0, 10], ['#1E6E3C', '#B8161C', '#6A1A48', '#8C4A1E', '#EDD0AE'][q % 5], 0.3); g.restore(); }
            const fl = Math.exp(-after / 0.1), gr = g.createRadialGradient(x, y, 4, x, y, MR); gr.addColorStop(0, `rgba(255,252,230,${fl})`); gr.addColorStop(1, 'rgba(255,240,200,0)');
            g.globalCompositeOperation = 'lighter'; g.fillStyle = gr; g.fillRect(x - MR, y - MR, 2 * MR, 2 * MR); g.globalCompositeOperation = 'source-over'; } }
        g.restore();
      });
      // ---- the glass pilgrims: everyone but 悟空, then 悟空 on his own path (and losing his light on beat 3)
      const fk = (b - 7.0) / 0.25, dim = fk <= 0 ? 0 : fk >= 1 ? 1 : (Math.floor(fk * 7) % 2 ? 0.25 : 0.9) * (0.4 + 0.6 * fk);
      const [cv, lg] = K.layer(e, 'sg-proc');
      XY.drawProcession(lg, e.phase, e.procX, e.groundY, PEN, K.cast(acts, { wukong: false }));
      const home = K.home(e, 'wukong'), q = XY.easeIO((b - 8.3) / 1.7), flip = b > 7.5, bow = K.bump(b, 7.6, 7.85, 8.0, 8.3);
      let wx = home[0] + 2.2 * Math.sin(t * 70) * spell, wy = home[1], ws = 1, spin = -0.55 * bow;
      if (q > 0) { const p1 = [W + 70, 210]; wx = XY.lerp(home[0], p1[0], q); wy = XY.lerp(home[1], p1[1], q) - 140 * Math.sin(q * Math.PI); ws = XY.lerp(1, 0.62, q); spin = -TAU * q; }   // a leaded glass silhouette leaping out through the border
      if (q < 1) { lg.save(); lg.translate(wx, wy - 60 * ws); lg.rotate(spin);
        if (dim > 0.5) [[-3, 0], [3, 0], [0, -3], [0, 3]].forEach(([dx, dy]) => K.fig(lg, e, acts, 'wukong', { color: () => 'rgba(242,238,220,0.9)', shade: false }, dx, 60 * ws + dy, { s: ws, flip }));   // a pale came outline so the dead glass still reads
        K.fig(lg, e, acts, 'wukong', penFor(dim), 0, 60 * ws, { s: ws, flip }); lg.restore(); }
      K.tint(lg, (() => { const p = lg.createPattern(mottle(), 'repeat'); p.setTransform(new DOMMatrix().translateSelf(e.procX * S, 0)); return p; })());
      K.tint(lg, (() => { const p = lg.createPattern(leads(), 'repeat'); p.setTransform(new DOMMatrix().translateSelf(e.procX * S, 0)); return p; })());
      K.tint(lg, (() => { const gr = lg.createLinearGradient(0, 380 * S, 0, 702 * S); gr.addColorStop(0, 'rgba(255,250,230,0.10)'); gr.addColorStop(1, 'rgba(20,10,40,0.22)'); return gr; })());
      K.blit(g, cv);
      const sm = K.shrink(cv, 8, 'sg-bl');
      g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'lighter'; g.globalAlpha = 0.32; g.drawImage(sm, 0, 0, cv.width, cv.height); g.restore();
      // ---- the three strikes: a bolt from the staff tip into each medallion
      HIT.forEach((h, k) => { const d = b - h; if (d < -0.05 || d > 0.2) return; const tip = e.at('wukong.staffEnd', acts), m = MED[k], R = XY.rng(Math.floor(t * 30) + k);
        g.save(); g.globalCompositeOperation = 'lighter'; g.strokeStyle = 'rgba(255,236,160,0.95)'; g.lineWidth = 5; g.beginPath(); g.moveTo(...tip);
        for (let q = 1; q <= 7; q++) g.lineTo(XY.lerp(tip[0], m[0], q / 7) + (q < 7 ? (R() - 0.5) * 40 : 0), XY.lerp(tip[1], m[1], q / 7) + (q < 7 ? (R() - 0.5) * 30 : 0));
        g.stroke(); g.strokeStyle = 'rgba(255,255,255,0.9)'; g.lineWidth = 2; g.stroke(); g.restore(); });
      // ---- the band spell: gold rings tighten around his head
      if (spell > 0.01) { const hd = e.at('wukong.head', acts); g.save(); g.globalCompositeOperation = 'lighter';
        for (let k = 0; k < 3; k++) { const ph = (t * 2.4 + k / 3) % 1, r = XY.lerp(70, 18, ph); g.strokeStyle = `rgba(255,214,90,${spell * (1 - ph) * 0.9})`; g.lineWidth = 4; g.beginPath(); g.ellipse(hd[0] - 2, hd[1] - 8, r, r * 0.42, -0.1, 0, TAU); g.stroke(); }
        g.restore(); }
      // ---- somersault-cloud trail as he leaves through the border
      if (q > 0 && q < 1.25) for (let k = 2; k < 8; k++) { const qq = XY.clamp(q - k * 0.05); if (qq <= 0) continue;
        const x = XY.lerp(home[0], W + 70, qq), y = XY.lerp(home[1], 210, qq) - 140 * Math.sin(qq * Math.PI) - 10, r = (20 - k * 2) * XY.lerp(1, 0.6, qq) * (1 - XY.clamp((q - 1) * 4));
        if (r > 1) pc(g, XY.ellipse(x - 10, y + 20, r * 1.4, r * 0.8, 14), '#F2EEDC', 0.4); }
      // ---- the letter: out of the fourth medallion into his hand, then it falls and lies on the sill of the glass
      if (b >= 6.0) { let lx, ly, ls = 0.9, lr = 0;
        const hand = e.at('wukong.handFar', acts), held = [flip ? 2 * home[0] - hand[0] - 56 : hand[0] + 56, hand[1] - 40];
        if (b < 6.8) { const f = XY.easeIO((b - 6.0) / 0.8), p0 = [MED[3][0] + 34, MED[3][1] + 10]; lx = XY.lerp(p0[0], held[0], f); ly = XY.lerp(p0[1], held[1], f) - 80 * Math.sin(f * Math.PI); lr = 0.6 * Math.sin(f * 6); ls = XY.lerp(0.92, 0.76, f); }
        else if (b < 8.3) { lx = held[0]; ly = held[1]; ls = 0.76; lr = 0.1; }
        else { const f = XY.easeOut((b - 8.3) / 0.7), rx = restX(e), x0 = rx + (flip ? -1 : 1) * 20; lx = XY.lerp(x0, rx + 40, f); ly = XY.lerp(home[1] - 70, 652, f); ls = XY.lerp(0.76, 0.8, f); lr = XY.lerp(0.1, -0.22, f) + 0.3 * Math.sin(f * 9) * (1 - f); }
        letter(g, lx, ly, ls, lr); }
      // ---- the light leaves him: motes stream up out of the grey glass
      { const d = b - 7.0; if (d > 0 && d < 1.1) { g.save(); g.globalCompositeOperation = 'lighter'; g.globalAlpha = 0.5;
        for (let k = 0; k < 24; k++) { const f = XY.clamp(d / 1.1 - XY.hash(k, 81) * 0.3); if (f <= 0) continue; const x = home[0] + (XY.hash(k, 82) - 0.5) * 70 + 40 * f * (XY.hash(k, 83) - 0.5), y = home[1] - 20 - XY.hash(k, 84) * 110 - 320 * f;
          const r = 3.5 * (1 - f) + 1.5, gr = g.createRadialGradient(x, y, 0, x, y, r * 2); gr.addColorStop(0, `rgba(255,206,96,${0.85 * (1 - f)})`); gr.addColorStop(1, 'rgba(255,170,60,0)'); g.fillStyle = gr; g.fillRect(x - r * 2, y - r * 2, r * 4, r * 4); }
        g.restore(); } }
      // ---- coloured light the pilgrims throw onto the stone sill
      g.save(); g.beginPath(); g.rect(0, 712, W, 68); g.clip(); g.setTransform(S, 0, 0.18 * S, -0.1 * S, 0, S * 772.2); g.globalCompositeOperation = 'screen'; g.globalAlpha = 0.4;
      g.drawImage(cv, 0, 0, W, H); g.restore();
      // ---- living light: a cloud shadow drifting over the window, glints on single pieces, dust in the beam
      { const cx = ((t * 80) % (W + 1100)) - 550, gr = g.createRadialGradient(cx, 330, 30, cx, 330, 560); gr.addColorStop(0, 'rgba(70,70,110,0.55)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
        g.save(); g.globalCompositeOperation = 'multiply'; g.fillStyle = gr; g.fillRect(0, 0, W, H); g.restore(); }
      g.save(); g.globalCompositeOperation = 'lighter';
      for (let k = 0; k < 40; k++) { const x = 30 + XY.hash(k, 61) * (W - 60), y = 30 + XY.hash(k, 62) * 640, s = Math.sin(t * (2.5 + 2 * XY.hash(k, 63)) + k * 7); if (s < 0.82) continue;
        const a = (s - 0.82) / 0.18, gr = g.createRadialGradient(x, y, 0, x, y, 18); gr.addColorStop(0, `rgba(255,250,220,${0.8 * a})`); gr.addColorStop(1, 'rgba(255,250,220,0)'); g.fillStyle = gr; g.fillRect(x - 18, y - 18, 36, 36); }
      for (let k = 0; k < 34; k++) { const x = (XY.hash(k, 71) * W + t * (6 + 8 * XY.hash(k, 72))) % W, y = 380 + XY.hash(k, 73) * 380 + 10 * Math.sin(t * 0.7 + k);
        g.fillStyle = `rgba(255,245,215,${0.25 + 0.35 * Math.abs(Math.sin(t * 1.3 + k))})`; g.fillRect(x, y, 2.2, 2.2); }
      g.restore();
      // ---- iron saddle bars across the window
      [[336, 0, W], [470, 0, W]].forEach(([y, x0, x1]) => { g.fillStyle = LEAD; g.fillRect(x0, y - 4, x1 - x0, 8); g.fillStyle = 'rgba(120,120,130,0.5)'; g.fillRect(x0, y - 3, x1 - x0, 1.5); });
      [354, 708, 1062].forEach(x => { g.fillStyle = LEAD; g.fillRect(x - 4, 24, 8, 312); });
      // ---- entry: the sun comes down the window, row by row
      const F = XY.lerp(-40, 760, XY.smooth((u + 0.4) / 0.3));
      if (F < 760) { g.fillStyle = 'rgba(14,12,26,0.82)'; g.fillRect(0, Math.max(0, F), W, H - Math.max(0, F));
        const gr = g.createLinearGradient(0, F - 50, 0, F); gr.addColorStop(0, 'rgba(255,240,190,0)'); gr.addColorStop(1, 'rgba(255,240,190,0.55)');
        g.save(); g.globalCompositeOperation = 'lighter'; g.fillStyle = gr; g.fillRect(0, F - 50, W, 50); g.restore(); }
    },
    post(canvas, g, e) {
      const sm = K.shrink(canvas, 10, 'sg-post');
      g.save(); g.globalCompositeOperation = 'lighter'; g.globalAlpha = 0.2; g.imageSmoothingQuality = 'high'; g.drawImage(sm, 0, 0, canvas.width, canvas.height); g.restore();
    },
  };
})();
