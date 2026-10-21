// 21 波斯细密画 · 1400 年 · 黑松林失散 — a Timurid-style page: gold sky with Chinese-style cloud ribbons, a horizon of
// sponge-like pastel rocks, the ground tilted up into stacked terraces of black pines, flower tufts and a tarnished
// silver stream, a golden pagoda whose ground floor is cut open to show the sleeping 黄袍怪 on his stone bed.
// With 悟空 gone, the pilgrims scatter over the terraces like pieces on a board: 八戒 wanders up and falls asleep in
// the flowers (a hoopoe lands on his belly on beat 3), 沙僧 climbs to look for him, and 唐僧 rides on alone to the
// pagoda door just as the demon opens his eyes. Entry: the page starts as an ink underdrawing; flat colour is laid
// in terrace by terrace. Text panel 黑松林, counter ۲۱ in a gold shamsa, a cypress breaks out of the frame.
(() => {
  'use strict';
  const XY = window.XY, K = XY.KIT_C, TAU = XY.TAU;
  const INK = '#2A1C14', PAPER = '#EFE4C8', GOLD = '#CFA43F', GOLD2 = '#A8802A', LAPIS = '#24408E', TURQ = '#2E9CA0';
  let LINE = false;                                   // underdrawing pass: fills become paper
  const F = c => (LINE ? PAPER : c);
  const COL = { horse: '#F6F2E8', horse2: '#DCD6C8', mane: '#ECE6D8', hoof: '#3A2E26', saddle: '#7A2A3A', red: '#C8322A', robe: '#E8B53A', kasaya: '#C8322A',
    skin: '#F2D6B4', metal: '#CFA43F', gold: '#E4BC4A', ink: INK, bjrobe: '#2B4A8C', bjpants: '#22356A', pig: '#F0B8A8', pig2: '#D8908A', wood: '#8A5A32',
    ssrobe: '#2E8A6E', ssrobe2: '#226A54', skin2: '#C8946A', ssh: '#B83A26', ssbeard: '#9A3020', skull: '#F2ECDC', bundle: '#D9A441' };
  const PEN = { color: r => COL[r] || XY.DEFAULT_COLORS[r], outline: INK, ow: 1.1, wob: 0, shade: false };
  const PG = [944, 652];   // golden pagoda: centre x, base y
  const TIERS = [[236, 166], [150, 62], [122, 54], [98, 46], [76, 40]];

  // ------------------------------------------------------------ motifs
  const blob = (g, cx, cy, rx, ry, seed, fill, line = INK) => { const R = XY.rng(seed), p = [];
    for (let k = 0; k < 14; k++) { const a = k / 14 * TAU, r = 1 + (R() - 0.5) * 0.35; p.push(cx + Math.cos(a) * rx * r, cy + Math.sin(a) * ry * r); }
    XY.path(g, XY.RIG.spline(p, true, 4), true); g.fillStyle = F(fill); g.fill(); g.strokeStyle = line; g.lineWidth = 1.2; g.stroke(); };
  // sponge rock: a lumpy mass with curled hollows (Timurid rocks are pastel and porous)
  const shade = (hexc, f) => { const n = parseInt(hexc.slice(1), 16), r = (n >> 16) & 255, gg = (n >> 8) & 255, bb = n & 255; return `rgb(${Math.round(r * f)},${Math.round(gg * f)},${Math.round(bb * f)})`; };
  const rock = (g, cx, cy, w, h, seed, col) => {   // faceted sponge rock: stacked lobes, each with a darker underside and porous curls
    const R = XY.rng(seed);
    for (let k = 0; k < 4; k++) { const x = cx + (R() - 0.5) * w * 0.6, y = cy - k * h * 0.2, rx = w * (0.42 - k * 0.07), ry = h * (0.3 - k * 0.03);
      blob(g, x, y, rx, ry, seed * 7 + k, col);
      if (!LINE) { g.save(); XY.path(g, XY.ellipse(x, y, rx * 0.98, ry * 0.98, 18), true); g.clip(); g.fillStyle = shade(col, 0.82); g.beginPath(); g.ellipse(x + rx * 0.35, y + ry * 0.55, rx * 0.9, ry * 0.6, -0.3, 0, TAU); g.fill(); g.restore(); }
      g.strokeStyle = 'rgba(42,28,20,0.55)'; g.lineWidth = 1; for (let q = 0; q < 3; q++) { const px = x + (XY.hash(seed, k * 3 + q) - 0.5) * rx, py = y - XY.hash(seed + 1, k * 3 + q) * ry * 0.6; g.beginPath(); g.arc(px, py, 2.5 + 3 * XY.hash(seed + 2, q), 0.4, 4.6); g.stroke(); } }
  };
  const blackPine = (g, x, y, s, seed) => {
    const R = XY.rng(seed), top = [x + (R() - 0.5) * 30 * s, y - 230 * s];
    g.strokeStyle = INK; g.lineWidth = 9 * s + 2; g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + 24 * s, y - 120 * s, top[0], top[1]); g.stroke();
    g.strokeStyle = F('#4A3226'); g.lineWidth = 9 * s; g.stroke();
    for (let k = 0; k < 6; k++) { const f = k / 5, px = XY.lerp(x + 10 * s, top[0], f) + (k % 2 ? 1 : -1) * 26 * s, py = XY.lerp(y - 90 * s, top[1], f), rx = (52 - k * 6) * s, ry = 15 * s;
      g.fillStyle = F('#1C3024'); g.strokeStyle = INK; g.lineWidth = 1; g.beginPath(); g.ellipse(px, py, rx, ry, (R() - 0.5) * 0.2, 0, TAU); g.fill(); g.stroke();
      g.strokeStyle = LINE ? INK : '#4E8058'; g.lineWidth = 1;
      for (let q = 0; q < 16; q++) { const a = Math.PI + q / 15 * Math.PI, ex = px + Math.cos(a) * rx, ey = py + Math.sin(a) * ry * 0.9; g.beginPath(); g.moveTo(px + Math.cos(a) * rx * 0.6, py + Math.sin(a) * ry * 0.5); g.lineTo(ex, ey - 3 * s); g.stroke(); }
      if (!LINE) { g.fillStyle = GOLD; for (let q = 0; q < 4; q++) { g.beginPath(); g.arc(px + (XY.hash(seed, k * 4 + q) - 0.5) * rx, py - ry * 0.6, 1.3, 0, TAU); g.fill(); } } }
  };
  const cypress = (g, x, y, h, w) => {
    g.fillStyle = F('#1E3A2A'); g.strokeStyle = INK; g.lineWidth = 1.4; g.beginPath(); g.moveTo(x, y - h);
    g.bezierCurveTo(x + w * 0.7, y - h * 0.7, x + w * 0.62, y - h * 0.2, x + 6, y); g.lineTo(x - 6, y); g.bezierCurveTo(x - w * 0.62, y - h * 0.2, x - w * 0.7, y - h * 0.7, x, y - h); g.fill(); g.stroke();
    g.strokeStyle = LINE ? INK : '#47785A'; g.lineWidth = 1; for (let k = 0; k < 40; k++) { const yy = y - 20 - k * (h - 40) / 40, ww = w * 0.5 * Math.sin(Math.PI * (yy - (y - h)) / h); g.beginPath(); g.moveTo(x - ww, yy); g.quadraticCurveTo(x, yy - 8, x + ww, yy); g.stroke(); }
  };
  const tuft = (g, x, y, s, R) => { const cols = ['#C8322A', '#F4EEE0', '#2D4FA0', '#E8B53A', '#D86A8A'], c = cols[Math.floor(R() * cols.length)];
    g.strokeStyle = LINE ? INK : '#3E6A3A'; g.lineWidth = 1; for (let k = -2; k <= 2; k++) { g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + k * 3 * s, y - 8 * s, x + k * 5 * s, y - 14 * s); g.stroke();
      if (!LINE) { g.fillStyle = c; g.beginPath(); g.arc(x + k * 5 * s, y - 15 * s, 2.4 * s, 0, TAU); g.fill(); } } };
  const STREAM = [28, 330, 200, 360, 380, 404, 520, 470, 600, 540, 662, 590];
  const AW = 88, AH = 150;   // the door of the pagoda's cut-open ground floor
  const archClip = g => { const ax = PG[0], ay = PG[1]; g.beginPath(); g.moveTo(ax - AW, ay); g.lineTo(ax - AW, ay - AH * 0.62); g.quadraticCurveTo(ax - AW * 0.92, ay - AH * 0.92, ax, ay - AH); g.quadraticCurveTo(ax + AW * 0.92, ay - AH * 0.92, ax + AW, ay - AH * 0.62); g.lineTo(ax + AW, ay); g.closePath(); };
  const pagodaPath = (() => { const p = new Path2D(); let y = PG[1];
    TIERS.forEach(([w, h]) => { p.rect(PG[0] - w / 2, y - h, w, h); p.moveTo(PG[0] - w / 2 - 26, y - h); p.lineTo(PG[0] - w / 2 - 30, y - h - 14); p.lineTo(PG[0] + w / 2 + 30, y - h - 14); p.lineTo(PG[0] + w / 2 + 26, y - h); p.closePath(); y -= h + 16; });
    p.rect(PG[0] - 4, y - 50, 8, 52); return p; })();
  const pagoda = g => {
    let y = PG[1];
    TIERS.forEach(([w, h], i) => {
      const x0 = PG[0] - w / 2;
      g.fillStyle = F(GOLD); g.fillRect(x0, y - h, w, h); g.strokeStyle = INK; g.lineWidth = 1.2; g.strokeRect(x0, y - h, w, h);
      g.fillStyle = F(TURQ); g.fillRect(x0, y - h + 4, w, 10); g.strokeRect(x0, y - h + 4, w, 10);
      if (!LINE) { g.fillStyle = '#F4EEE0'; for (let x = x0 + 6; x < x0 + w - 4; x += 10) { g.beginPath(); g.moveTo(x, y - h + 9); g.lineTo(x + 4, y - h + 5.5); g.lineTo(x + 8, y - h + 9); g.lineTo(x + 4, y - h + 12.5); g.fill(); } }
      if (i > 0) for (let k = 0; k < 3; k++) { const wx = x0 + w * (k + 0.5) / 3; g.fillStyle = F('#3A1E1A'); g.beginPath(); g.moveTo(wx - 7, y - 6); g.lineTo(wx - 7, y - h + 26); g.quadraticCurveTo(wx, y - h + 16, wx + 7, y - h + 26); g.lineTo(wx + 7, y - 6); g.fill(); g.stroke(); }
      // eave: lapis roof with upturned gold tips
      const ry = y - h; g.fillStyle = F(LAPIS); g.beginPath(); g.moveTo(x0 - 26, ry); g.quadraticCurveTo(x0 - 34, ry - 4, x0 - 38, ry - 12); g.lineTo(x0 - 14, ry - 16); g.lineTo(x0 + w + 14, ry - 16); g.lineTo(x0 + w + 38, ry - 12); g.quadraticCurveTo(x0 + w + 34, ry - 4, x0 + w + 26, ry); g.closePath(); g.fill(); g.stroke();
      g.strokeStyle = LINE ? INK : GOLD; g.lineWidth = 2; g.beginPath(); g.moveTo(x0 - 26, ry); g.lineTo(x0 + w + 26, ry); g.stroke();
      y -= h + 16;
    });
    g.strokeStyle = INK; g.lineWidth = 4; g.beginPath(); g.moveTo(PG[0], y); g.lineTo(PG[0], y - 52); g.stroke(); g.strokeStyle = LINE ? INK : GOLD; g.lineWidth = 2.4; g.stroke();
    [0, 12, 24].forEach(d => { g.fillStyle = F(GOLD); g.beginPath(); g.arc(PG[0], y - 10 - d, 5 - d / 10, 0, TAU); g.fill(); g.strokeStyle = INK; g.lineWidth = 1; g.stroke(); });
    // the ground floor is cut away: an arched opening into the demon's chamber
    g.fillStyle = F('#5A1E22'); archClip(g); g.fill(); g.strokeStyle = INK; g.lineWidth = 1.6; g.stroke();
  };
  const cartouche = (g, x, y, w, h) => {
    g.fillStyle = F(LAPIS); g.fillRect(x - 6, y - 6, w + 12, h + 12); g.fillStyle = F('#E8C66A'); g.fillRect(x, y, w, h);
    g.strokeStyle = LINE ? INK : '#C8322A'; g.lineWidth = 2.4; g.strokeRect(x + 3, y + 3, w - 6, h - 6); g.strokeStyle = INK; g.lineWidth = 1; g.strokeRect(x - 6, y - 6, w + 12, h + 12);
    [[x, y, 1, 1], [x + w, y, -1, 1], [x, y + h, 1, -1], [x + w, y + h, -1, -1]].forEach(([cx, cy, sx, sy]) => { g.fillStyle = F(GOLD); g.beginPath(); g.moveTo(cx, cy); g.lineTo(cx + sx * 30, cy); g.lineTo(cx, cy + sy * 30); g.fill();
      if (!LINE) { g.fillStyle = LAPIS; g.beginPath(); g.arc(cx + sx * 8, cy + sy * 8, 3, 0, TAU); g.fill(); } });
    g.fillStyle = INK; g.font = XY.font(54, XY.cnFont.xing); g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('黑松林', x + w / 2, y + h / 2 + 3); g.textAlign = 'left'; g.textBaseline = 'alphabetic';
  };
  const shamsa = (g, cx, cy, r) => {   // gold sunburst medallion holding the Persian numeral
    g.fillStyle = F(GOLD); g.strokeStyle = INK; g.lineWidth = 1; g.beginPath();
    for (let k = 0; k < 32; k++) { const a = k / 32 * TAU, rr = k % 2 ? r * 0.8 : r; k ? g.lineTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr) : g.moveTo(cx + rr, cy); } g.closePath(); g.fill(); g.stroke();
    g.fillStyle = F(LAPIS); g.beginPath(); g.arc(cx, cy, r * 0.66, 0, TAU); g.fill(); g.stroke();
    g.strokeStyle = LINE ? INK : GOLD; g.lineWidth = 1.4; g.beginPath(); g.arc(cx, cy, r * 0.58, 0, TAU); g.stroke();
    g.fillStyle = LINE ? INK : '#F2D27A'; g.font = XY.font(30, XY.cnFont.kai, 'bold'); g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('廿一', cx, cy + 2); g.textAlign = 'left'; g.textBaseline = 'alphabetic';
  };
  const B = 24;   // margin; the painting sits inside the rulings
  const page = (g, W, H) => {
    g.fillStyle = PAPER; g.fillRect(0, 0, W, H);
    const R = XY.rng(2121), Q = XY.rng(2122);   // Q: colour-pass-only decoration, so R stays in step in both passes
    if (!LINE) for (let k = 0; k < 260; k++) { const x = Q() * W, y = Q() * H; if (x > B && x < W - B && y > B && y < H - B) continue; g.fillStyle = `rgba(200,160,64,${0.5 + Q() * 0.5})`; g.fillRect(x, y, 1 + Q() * 3, 1 + Q() * 3); }
    g.save(); g.beginPath(); g.rect(B, B, W - 2 * B, H - 2 * B); g.clip();
    // gold sky with punched dots
    g.fillStyle = F(GOLD); g.fillRect(B, B, W - 2 * B, 170);
    if (!LINE) { for (let k = 0; k < 500; k++) { g.fillStyle = Q() < 0.5 ? 'rgba(140,100,30,0.25)' : 'rgba(255,236,160,0.35)'; g.fillRect(B + Q() * (W - 2 * B), B + Q() * 150, 1.4, 1.4); } }
    // the tilted ground
    g.fillStyle = F('#6A8458'); g.beginPath(); g.moveTo(B, 230); for (let x = B; x <= W; x += 30) g.lineTo(x, 214 + 14 * Math.sin(x / 80) + 8 * Math.sin(x / 23)); g.lineTo(W, H); g.lineTo(B, H); g.fill();
    if (!LINE) { g.fillStyle = 'rgba(70,100,50,0.18)'; for (let k = 0; k < 900; k++) { g.beginPath(); g.arc(B + Q() * W, 230 + Q() * 520, 1 + Q() * 1.6, 0, TAU); g.fill(); } }
    // horizon of pastel sponge rocks
    const rc = ['#B9A3C9', '#E2A7A0', '#D9B26A', '#C7B8D8'];
    for (let x = 10, k = 0; x < W; x += 80 + 40 * XY.hash(k, 9), k++) rock(g, x, 222 + 10 * Math.sin(k), 104, 86, 40 + k, rc[k % 4]);
    [60, 160, 260, 360, 460, 560, 650, 760, 1000, 1090].forEach((x, k) => blackPine(g, x, 300 + 10 * Math.sin(k * 2), 0.5, 60 + k));
    [30, 230, 440, 700, 1060].forEach((x, k) => blackPine(g, x, 400 + 8 * Math.sin(k), 0.6, 160 + k));
    // terrace ledges with rocks
    [[40, 352], [150, 344], [960, 348], [1060, 340]].forEach(([x, y], k) => rock(g, x, y, 80, 54, 80 + k, rc[(k + 2) % 4]));
    // the silver stream (tarnished almost black, as old miniature silver is) into an octagonal pool
    const sp = XY.RIG.spline(STREAM, false, 8);
    g.lineCap = 'round'; g.lineJoin = 'round'; XY.path(g, sp, false); g.strokeStyle = INK; g.lineWidth = 30; g.stroke(); g.strokeStyle = F('#6E7A80'); g.lineWidth = 26; g.stroke();
    g.fillStyle = INK; const oc = []; for (let k = 0; k < 8; k++) { const a = k / 8 * TAU + Math.PI / 8; oc.push(690 + Math.cos(a) * 52, 606 + Math.sin(a) * 30); }
    XY.path(g, oc, true); g.fillStyle = F('#6E7A80'); g.fill(); g.strokeStyle = INK; g.lineWidth = 2; g.stroke();
    XY.path(g, oc.map((v, i) => (i % 2 ? 606 + (v - 606) * 1.18 : 690 + (v - 690) * 1.1)), true); g.strokeStyle = LINE ? INK : '#E6DCC4'; g.lineWidth = 5; g.stroke();
    [90, 360, 520].forEach((x, k) => blackPine(g, x, 470 + k * 6, 0.62, 70 + k));
    // 八戒's flower bed on the middle terrace
    g.fillStyle = F('#8EA470'); g.beginPath(); g.ellipse(230, 474, 120, 26, 0, 0, TAU); g.fill(); g.strokeStyle = 'rgba(42,28,20,0.4)'; g.lineWidth = 1; g.stroke();
    const R2 = XY.rng(31); for (let k = 0; k < 40; k++) tuft(g, 120 + R2() * 220, 462 + R2() * 30, 0.9, R2);
    [[60, 600], [200, 616], [330, 592]].forEach(([x, y], k) => rock(g, x, y, 96, 64, 90 + k, rc[(k + 1) % 4]));
    blackPine(g, 600, 640, 0.86, 77); blackPine(g, 770, 664, 0.8, 78);
    pagoda(g);
    for (let k = 0; k < 160; k++) tuft(g, B + R() * (W - 2 * B), 250 + R() * 490, 0.7 + R() * 0.5, R);
    for (let x = B + 8; x < W - B; x += 26) tuft(g, x + R() * 10, 728 + R() * 14, 1.1, R);
    g.restore();
    // rulings: gold, lapis, red, ink
    [[B - 3, GOLD, 4], [B - 8, LAPIS, 2.5], [B - 11, '#C8322A', 1]].forEach(([o, c, w]) => { g.strokeStyle = LINE ? INK : c; g.lineWidth = w; g.strokeRect(o, o, W - 2 * o, H - 2 * o); });
    g.strokeStyle = INK; g.lineWidth = 0.8; g.strokeRect(B, B, W - 2 * B, H - 2 * B);
    cartouche(g, 330, 44, 260, 76); shamsa(g, 1006, 92, 50);
    cypress(g, 1112, 712, 706, 64);   // breaks out of the frame into the margin, as miniatures do
  };
  // ------------------------------------------------------------ living pieces
  const tchi = (g, x, y, s, t) => {   // Chinese-style cloud (introduced to Persian painting from Yuan art): a fat ribbon knotted into curls
    const p = []; for (let k = 0; k <= 20; k++) { const u = k / 20; p.push(x + (u - 0.5) * 210 * s, y + 12 * s * Math.sin(u * TAU * 1.5 + t * 0.8) - 8 * s * Math.sin(u * Math.PI)); }
    const curl = (cx, cy, r, d) => { const q = []; for (let k = 0; k <= 22; k++) { const a = d * k / 22 * TAU * 1.25, rr = r * (1 - k / 30); q.push(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr); } return q; };
    const strokes = [p, curl(p[0] - 10 * s, p[1], 18 * s, -1), curl(p[40] + 10 * s, p[41], 18 * s, 1), curl(x, y - 16 * s, 12 * s, 1)];
    g.lineCap = 'round'; g.lineJoin = 'round';
    [[INK, 19], ['#F4EEE0', 15], ['#9DB4E0', 4]].forEach(([c, w]) => { g.strokeStyle = c; g.lineWidth = w * s; strokes.forEach(q => { XY.path(g, q, false); g.stroke(); }); });
  };
  const demon = (g, wake, reach, t) => {   // 黄袍怪 (奎木狼) asleep behind the door: a blue face that fills the arch, flame-red hair
    const ax = PG[0], ay = PG[1], cx = ax, cy = ay - 72 - 6 * wake, br = 1 + 0.03 * Math.sin(t * 2.2) * (1 - wake);
    if (wake > 0) { const gr = g.createRadialGradient(cx, cy, 10, cx, cy, 150); gr.addColorStop(0, `rgba(255,214,120,${0.8 * wake})`); gr.addColorStop(1, 'rgba(255,170,60,0)'); g.fillStyle = gr; g.fillRect(ax - AW, ay - AH, 2 * AW, AH); }
    g.fillStyle = '#B83A26'; g.strokeStyle = INK; g.lineWidth = 1.4; g.beginPath();
    for (let k = 0; k <= 16; k++) { const a = Math.PI * (0.95 + k / 16 * 1.1), r = k % 2 ? 70 : 96 + 6 * Math.sin(t * 3 + k); g.lineTo(cx + Math.cos(a) * r, cy - 6 + Math.sin(a) * r * 0.9); } g.closePath(); g.fill(); g.stroke();
    g.fillStyle = '#3E62B0'; g.beginPath(); g.ellipse(cx, cy + 6, 72 * br, 66 * br, 0, 0, TAU); g.fill(); g.stroke();
    g.fillStyle = '#5A80C8'; g.beginPath(); g.ellipse(cx - 26, cy - 10, 18, 10, -0.3, 0, TAU); g.fill();
    g.strokeStyle = INK; g.lineWidth = 3; g.beginPath(); g.moveTo(cx - 52, cy - 30); g.quadraticCurveTo(cx - 30, cy - 46 - 8 * wake, cx - 8, cy - 32); g.moveTo(cx + 52, cy - 30); g.quadraticCurveTo(cx + 30, cy - 44, cx + 8, cy - 32); g.stroke();
    // eyes: both shut; on waking the left one snaps open — yellow with a red pupil, and it glows
    g.lineWidth = 2.4; g.beginPath(); g.arc(cx + 30, cy - 12, 12, 0.25, Math.PI - 0.25); g.stroke();
    if (wake < 0.5) { g.beginPath(); g.arc(cx - 30, cy - 12, 12, 0.25, Math.PI - 0.25); g.stroke(); }
    else { g.save(); g.globalCompositeOperation = 'lighter'; const eg = g.createRadialGradient(cx - 30, cy - 14, 2, cx - 30, cy - 14, 40); eg.addColorStop(0, 'rgba(255,230,140,0.9)'); eg.addColorStop(1, 'rgba(255,200,80,0)'); g.fillStyle = eg; g.fillRect(cx - 70, cy - 54, 80, 80); g.restore();
      g.fillStyle = '#FFE070'; g.beginPath(); g.ellipse(cx - 30, cy - 14, 16, 12 * wake, 0, 0, TAU); g.fill(); g.lineWidth = 1.6; g.stroke();
      g.fillStyle = '#C8322A'; g.beginPath(); g.arc(cx - 34, cy - 14, 6 * wake, 0, TAU); g.fill(); g.fillStyle = INK; g.beginPath(); g.arc(cx - 34, cy - 14, 2.6 * wake, 0, TAU); g.fill(); }
    g.fillStyle = '#2E4A8A'; g.beginPath(); g.ellipse(cx, cy + 14, 14, 10, 0, 0, TAU); g.fill(); g.fillStyle = INK; [-6, 6].forEach(dx => { g.beginPath(); g.arc(cx + dx, cy + 16, 3, 0, TAU); g.fill(); });
    g.strokeStyle = INK; g.lineWidth = 2.4; g.beginPath(); g.moveTo(cx - 34, cy + 40); g.quadraticCurveTo(cx, cy + 52 + 6 * wake, cx + 34, cy + 40); g.stroke();
    g.fillStyle = '#F4EEE0'; [[-24, 1], [24, -1]].forEach(([dx]) => { g.beginPath(); g.moveTo(cx + dx - 6, cy + 42); g.lineTo(cx + dx, cy + 22 - 6 * wake); g.lineTo(cx + dx + 6, cy + 42); g.closePath(); g.fill(); g.lineWidth = 1; g.stroke(); });
    if (wake < 0.5) { g.fillStyle = INK; g.font = XY.font(22, XY.cnFont.kai, 'bold'); g.fillText('z', cx + 64, cy - 60 - 6 * Math.sin(t * 2)); g.font = XY.font(16, XY.cnFont.kai, 'bold'); g.fillText('z', cx + 80, cy - 78 - 6 * Math.sin(t * 2 + 1)); }
    g.fillStyle = '#E2B830'; g.fillRect(ax - AW, ay - 24, 2 * AW, 24); g.strokeStyle = INK; g.lineWidth = 1.2; g.strokeRect(ax - AW, ay - 24, 2 * AW, 24);
    for (let x = ax - AW + 10; x < ax + AW; x += 16) { g.strokeStyle = '#C8322A'; g.beginPath(); g.moveTo(x, ay - 22); g.lineTo(x + 8, ay - 4); g.stroke(); }
    void reach;
  };
  const doors = (g, shut) => { if (shut <= 0) return; const ax = PG[0], ay = PG[1], w = AW * shut;   // the pagoda's red-and-gold doors swing shut
    g.save(); archClip(g); g.clip(); [[-1, ax - AW], [1, ax + AW]].forEach(([s, x0]) => { const x1 = x0 - s * w; g.fillStyle = '#9A2A22'; g.fillRect(Math.min(x0, x1), ay - AH, Math.abs(x1 - x0), AH);
      g.strokeStyle = GOLD; g.lineWidth = 3; g.strokeRect(Math.min(x0, x1) + 6, ay - AH + 30, Math.abs(x1 - x0) - 12, AH - 40);
      g.fillStyle = GOLD; for (let r = 0; r < 4; r++) for (let c = 0; c < 3; c++) { g.beginPath(); g.arc(XY.lerp(x0, x1, (c + 0.6) / 3.4), ay - AH + 50 + r * 26, 3, 0, TAU); g.fill(); } });
    g.restore(); };
  const demonArm = (g, wake, reach) => {   // the long yellow sleeve reaches out of the chamber toward the monk
    const ax = PG[0], ay = PG[1], sh = [ax - AW + 14, ay - 40], hand = [XY.lerp(ax - AW + 10, ax - AW - 150, reach), XY.lerp(ay - 40, ay - 120, reach)], el = [XY.lerp(sh[0], hand[0], 0.5), XY.lerp(sh[1], hand[1], 0.5) - 14 * reach];
    g.lineCap = 'round'; g.lineJoin = 'round'; g.strokeStyle = INK; g.lineWidth = 19; g.beginPath(); g.moveTo(...sh); g.quadraticCurveTo(...el, ...hand); g.stroke(); g.strokeStyle = '#E2B830'; g.lineWidth = 15; g.stroke();
    g.strokeStyle = '#C8322A'; g.lineWidth = 2.4; g.beginPath(); g.moveTo(...sh); g.quadraticCurveTo(...el, ...hand); g.stroke();
    g.fillStyle = '#3E62B0'; g.beginPath(); g.arc(hand[0], hand[1], 11, 0, TAU); g.fill(); g.strokeStyle = INK; g.lineWidth = 1; g.stroke();
    if (reach > 0.2) { g.strokeStyle = '#F4EEE0'; g.lineWidth = 2; for (let k = -1; k <= 1; k++) { g.beginPath(); g.moveTo(hand[0] - 5, hand[1] + k * 4); g.quadraticCurveTo(hand[0] - 12, hand[1] + k * 5 - 4, hand[0] - 16, hand[1] + k * 6); g.stroke(); } }
  };
  const hoopoe = (g, x, y, flap, s = 1, flip = 1) => {   // the hoopoe, bird of Persian poetry
    g.save(); g.translate(x, y); g.scale(s * flip, s); g.strokeStyle = INK; g.lineWidth = 1;
    g.fillStyle = '#D9885A'; g.beginPath(); g.ellipse(0, 0, 11, 7, -0.15, 0, TAU); g.fill(); g.stroke();
    g.fillStyle = '#D9885A'; g.beginPath(); g.arc(10, -7, 5, 0, TAU); g.fill(); g.stroke();
    for (let k = 0; k < 5; k++) { const a = -2.4 + k * 0.32; g.strokeStyle = '#E09A5A'; g.lineWidth = 3; g.beginPath(); g.moveTo(10, -10); g.lineTo(10 + Math.cos(a) * 12, -10 + Math.sin(a) * 12); g.stroke(); g.fillStyle = INK; g.beginPath(); g.arc(10 + Math.cos(a) * 12, -10 + Math.sin(a) * 12, 1.4, 0, TAU); g.fill(); }
    g.strokeStyle = INK; g.lineWidth = 1.4; g.beginPath(); g.moveTo(14, -7); g.quadraticCurveTo(22, -5, 27, -1); g.stroke();
    g.save(); g.translate(-2, -3); g.rotate(-0.3 - flap * 0.9); g.fillStyle = '#F4EEE0'; g.beginPath(); g.ellipse(-6, 0, 12, 5, 0, 0, TAU); g.fill(); g.stroke();
    g.fillStyle = INK; for (let k = 0; k < 3; k++) g.fillRect(-14 + k * 6, -4, 2.6, 8); g.restore();
    g.strokeStyle = INK; g.lineWidth = 3; g.beginPath(); g.moveTo(-10, 2); g.lineTo(-20, 6); g.stroke();
    g.restore();
  };
  const lineLayer = (W, H, scale) => XY.cached(`fa-line:${scale.toFixed(4)}`, W * scale, H * scale, cv => { const g = cv.getContext('2d'); g.setTransform(scale, 0, 0, scale, 0, 0); LINE = true; page(g, W, H); LINE = false; });
  const SPOT_B = [236, 470], SPOT_S = [452, 566];
  const SP = XY.RIG.spline(STREAM, false, 8);

  XY.STYLES.persian = {
    hits: [4.8, 5.5],
    bg(g, W, H) { LINE = false; page(g, W, H); K.fibres(g, 0, 0, W, H, 1400, 211, ['rgba(120,90,50,0.07)', 'rgba(255,250,236,0.18)'], [3, 9], [0.4, 0.8]); },
    draw(g, e) {
      const { W, H, t, u } = e, b = e.beat, S = e.S;
      const acts = { monk: { palm: K.bump(b, 4.6, 4.9, 6.4, 6.9) }, bajie: { scratch: K.bump(b, 6.4, 6.7, 7.4, 7.8) }, shaseng: { lift: K.bump(b, 3.6, 3.8, 4.6, 5.0) } };
      K.push(g, e, PG[0] - 60, PG[1] - 90, K.pushOf(b, 4.4, 4.9, 6.4, 0.12));   // push toward the door as the eye opens
      // ---- sky: drifting cloud ribbons and a slow glint across the gold
      g.save(); g.beginPath(); g.rect(B, B, W - 2 * B, 168); g.clip();
      tchi(g, 170 + 26 * Math.sin(t * 0.31), 108, 0.8, t); tchi(g, 770 + 22 * Math.sin(t * 0.27 + 1), 74, 0.7, t + 2); tchi(g, 650 + 18 * Math.sin(t * 0.35 + 2), 150, 0.5, t + 4);
      { const gx = ((t * 150) % (W + 700)) - 350, gr = g.createLinearGradient(gx - 90, 0, gx + 90, 60); gr.addColorStop(0, 'rgba(255,240,180,0)'); gr.addColorStop(0.5, 'rgba(255,240,180,0.32)'); gr.addColorStop(1, 'rgba(255,240,180,0)');
        g.globalCompositeOperation = 'lighter'; g.fillStyle = gr; g.fillRect(0, 0, W, 200); }
      g.restore();
      // ---- silver stream: curls travel downstream; rings on the pool
      g.strokeStyle = '#D4DCE0'; g.lineWidth = 1.4; const n = SP.length / 2;
      for (let k = 0; k < 16; k++) { const f = (k / 16 + t * 0.06) % 1, i = Math.floor(f * (n - 1)), x = SP[2 * i], y = SP[2 * i + 1]; g.beginPath(); g.arc(x, y + (k % 3 - 1) * 6, 5, Math.PI * 1.1, Math.PI * 1.9); g.stroke(); }
      for (let k = 0; k < 2; k++) { const r = ((t * 0.5 + k / 2) % 1); g.strokeStyle = `rgba(220,226,230,${1 - r})`; g.beginPath(); g.ellipse(690, 606, 10 + 36 * r, 6 + 20 * r, 0, 0, TAU); g.stroke(); }
      // ---- falling petals and two birds among the pines
      for (let k = 0; k < 12; k++) { const x = 60 + XY.hash(k, 3) * (W - 160) + 20 * Math.sin(t * 1.3 + k), y = 240 + ((XY.hash(k, 4) * 460 + t * 28) % 460), r = t * 2 + k;
        g.save(); g.translate(x, y); g.rotate(r); g.fillStyle = k % 2 ? '#F4EEE0' : '#E8A0A8'; g.beginPath(); g.ellipse(0, 0, 3.4, 1.8, 0, 0, TAU); g.fill(); g.restore(); }
      for (let k = 0; k < 2; k++) { const ph = t * 0.4 + k * 0.5, x = 120 + ((ph * 300) % 760), y = 280 + 30 * Math.sin(ph * 5) - k * 30, fl = Math.sin(t * 16 + k * 2);
        g.strokeStyle = INK; g.lineWidth = 1.4; g.fillStyle = k ? '#2D4FA0' : '#C8322A'; g.beginPath(); g.ellipse(x, y, 5, 3, 0, 0, TAU); g.fill(); g.stroke(); g.beginPath(); g.moveTo(x - 2, y); g.lineTo(x - 8, y - 7 * fl); g.moveTo(x + 2, y); g.lineTo(x + 6, y - 6 * fl); g.stroke(); }
      // ---- the demon in the cut-open chamber wakes on beat 3; the pagoda's gold flares as he opens his eyes
      const wake = XY.smooth((b - 4.75) / 0.1), reach = K.bump(b, 5.1, 5.5, 6.4, 6.9), shut = XY.smooth((b - 6.9) / 0.5);
      // the forest closes in: from beat 1.5 the black pines darken sky and ground; the pagoda keeps its gold
      { const dk = 0.5 * XY.smooth((b - 1.5) / 2.0); if (dk > 0) { g.save(); g.fillStyle = `rgba(16,28,30,${dk})`;
        const m = new Path2D(); m.rect(0, 0, W, H); m.addPath(pagodaPath); g.clip(m, 'evenodd'); g.fillRect(0, 0, W, H); g.restore(); } }
      g.save(); archClip(g); g.clip(); demon(g, wake, reach, t); g.restore(); if (wake > 0 && shut < 1) demonArm(g, wake, reach); doors(g, shut);
      { const f = (b - 4.75) / 0.45, per = (t * 0.2) % 1, gx = f > 0 && f < 1 ? XY.lerp(800, 1090, f) : XY.lerp(780, 1110, per), a = f > 0 && f < 1 ? 0.7 : 0.28;
        g.save(); g.clip(pagodaPath); const gr = g.createLinearGradient(gx - 50, 0, gx + 50, 40); gr.addColorStop(0, 'rgba(255,240,180,0)'); gr.addColorStop(0.5, `rgba(255,244,200,${a})`); gr.addColorStop(1, 'rgba(255,240,180,0)');
        g.globalCompositeOperation = 'lighter'; g.fillStyle = gr; g.fillRect(790, 130, 330, 530); g.restore(); }
      // ---- entry: the ink underdrawing gets its flat colours terrace by terrace
      const fill = XY.clamp((u + 0.4) / 0.3);
      if (fill < 1) { const Y = [0, 170, 250, 360, 500, 640, 780][Math.floor(fill * 6)];
        g.save(); g.beginPath(); g.rect(0, Y, W, H - Y); g.clip(); g.setTransform(1, 0, 0, 1, 0, 0); g.drawImage(lineLayer(W, H, S), 0, 0); g.restore(); }
      // ---- the pilgrims scatter over the terraces
      const wAt = bb => XY.walkPhase(e.cell.t0 + bb * XY.BEAT), hB = K.home(e, 'bajie'), hS = K.home(e, 'shaseng'), hM = K.home(e, 'monk');
      const bj = { x: hB[0], y: hB[1], s: 1, rot: 0, w: null }, go = XY.smooth((b - 1.6) / 0.9), back = XY.smooth((b - 6.6) / 0.7);
      const lie = XY.smooth((b - 2.6) / 0.35) * (1 - XY.smooth((b - 6.3) / 0.15));
      if (b > 1.6 && b < 6.6) { bj.x = XY.lerp(hB[0], SPOT_B[0], go); bj.y = XY.lerp(hB[1], SPOT_B[1], go); bj.s = XY.lerp(1, 0.72, go); }
      if (b >= 6.6) { bj.x = XY.lerp(SPOT_B[0], hB[0], back); bj.y = XY.lerp(SPOT_B[1], hB[1], back); bj.s = XY.lerp(0.72, 1, back); }
      if (lie > 0 && b > 2.6) { bj.rot = (-Math.PI / 2 * 0.94 + 0.02 * Math.sin(t * 2.4)) * lie; bj.y -= 22 * bj.s * lie; bj.w = wAt(2.6); }
      const sg = { x: hS[0], y: hS[1], s: 1, flip: b > 4.2 && b < 5.0 }, sgo = XY.smooth((b - 2.4) / 1.0), sback = XY.smooth((b - 6.2) / 1.0);
      if (b > 2.4 && b < 6.2) { sg.x = XY.lerp(hS[0], SPOT_S[0], sgo); sg.y = XY.lerp(hS[1], SPOT_S[1], sgo); sg.s = XY.lerp(1, 0.8, sgo); }
      if (b >= 6.2) { sg.x = XY.lerp(SPOT_S[0], hS[0], sback); sg.y = XY.lerp(SPOT_S[1], hS[1], sback); sg.s = XY.lerp(0.8, 1, sback); }
      const drawB = () => { K.fig(g, e, acts, 'bajie', PEN, bj.x, bj.y, bj);
        if (lie > 0.3) { const R = XY.rng(5151); for (let k = 0; k < 9; k++) tuft(g, SPOT_B[0] - 110 + k * 16 + R() * 6, SPOT_B[1] + 6 + R() * 6, 0.9, R); } };
      const drawS = () => K.fig(g, e, acts, 'shaseng', PEN, sg.x, sg.y, sg);
      if (sg.y < bj.y - 1) { drawS(); drawB(); } else { drawB(); drawS(); }
      K.fig(g, e, acts, 'monk', PEN, hM[0], hM[1]);
      // ---- the hoopoe: perched on a pine, lands on the sleeping belly on beat 3, flies when he wakes
      const perch0 = [362, 344], belly = K.figPoint(e, acts, 'bajie', 'belly', bj.x, bj.y, bj), perch1 = [belly[0], belly[1] - 25 * bj.s - 6 + 1.5 * Math.sin(t * 2.4)];
      let hx = perch0[0], hy = perch0[1] + 1.5 * Math.sin(t * 3), fl = 0, hf = 1;
      if (b > 3.2 && b < 4.0) { const f = XY.easeIO((b - 3.2) / 0.8); hx = XY.lerp(perch0[0], perch1[0], f); hy = XY.lerp(perch0[1], perch1[1], f) - 60 * Math.sin(f * Math.PI); fl = Math.abs(Math.sin(t * 22)); hf = perch1[0] < perch0[0] ? -1 : 1; }
      else if (b >= 4.0 && b < 6.22) { hx = perch1[0]; hy = perch1[1]; }
      else if (b >= 6.22) { const f = XY.easeIn((b - 6.22) / 0.8); hx = XY.lerp(perch1[0], 760, f); hy = XY.lerp(perch1[1], 180, f); fl = Math.abs(Math.sin(t * 22)); }
      if (b < 7.0) hoopoe(g, hx, hy, fl, 1.3, hf);
    },
  };
})();
