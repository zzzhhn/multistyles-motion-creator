// 11 阿旃陀壁画 · 失却袈裟 — a lime-plaster cave wall seen by lamplight. The lotus-bearing Avalokiteshvara (观音,
// Ajanta's Padmapani) looks down; left, a monk in the burnt chamber holds the empty clothes rack; right, among blocky
// painted rocks, the black bear of 黑风洞 sits in the stolen red kasaya. At beat 2 she opens her eyes, at beat 3 a gold
// fillet (禁箍) flies from her lotus onto the bear's head; the kasaya tumbles back across the wall onto Tang Seng.
(() => {
  'use strict';
  const XY = window.XY, TAU = XY.TAU, K = XY.KIT_B;
  const FIELD = '#5A2A19', RO = '#9A3B22', YO = '#C8902F', TV = '#5F7048', LAP = '#3E5E8E', WH = '#E8DCC0', BK = '#22140C', LINE = '#4A2414';
  const SKIN = '#C08A4E', SKD = 'rgba(92,46,18,0.55)';

  // fill, then darken the inside of the contour (Ajanta modelling: shade gathers at the edges of every form)
  const mod = (g, pts, base, dark = SKD, w = 14, line = LINE, lw = 1.6) => {
    XY.path(g, pts, true); g.fillStyle = base; g.fill();
    g.save(); XY.path(g, pts, true); g.clip(); g.strokeStyle = dark; g.lineWidth = w; g.stroke(); g.restore();
    if (line) { g.strokeStyle = line; g.lineWidth = lw; XY.path(g, pts, true); g.stroke(); }
  };
  const sp = (pts, n = 5) => XY.RIG.spline(pts, true, n);
  const stroke = (g, pts, w, col) => { g.strokeStyle = col; g.lineWidth = w; XY.path(g, pts, false); g.stroke(); };
  const pearls = (g, x0, y0, x1, y1, n, r, col = WH) => { g.fillStyle = col; for (let k = 0; k <= n; k++) { g.beginPath(); g.arc(XY.lerp(x0, x1, k / n), XY.lerp(y0, y1, k / n), r, 0, TAU); g.fill(); } };

  // a painted goose (hamsa): white body, lotus-red beak, wings in one of two beats
  const goose = (g, x, y, s, flap) => {
    g.save(); g.translate(x, y); g.scale(s, s);
    mod(g, sp([-30, 0, -10, -10, 18, -8, 30, -16, 36, -14, 30, -4, 12, 8, -18, 8]), WH, 'rgba(120,90,60,0.4)', 6, LINE, 1.4);
    g.fillStyle = RO; XY.path(g, [36, -14, 46, -12, 36, -10], true); g.fill();
    mod(g, sp(flap ? [-8, -6, 4, -40, 14, -36, 12, -8] : [-8, -4, 10, 22, 18, 18, 12, -2]), '#D9CBAA', 'rgba(120,90,60,0.4)', 5, LINE, 1.2);
    g.fillStyle = BK; g.beginPath(); g.arc(31, -14, 1.4, 0, TAU); g.fill();
    g.restore();
  };
  // blocky rocks (the Ajanta mountain formula): prisms with a lit top face and a dark side face
  const rock = (g, x, y, w, h, col) => {
    const d = Math.min(18, w * 0.25);
    g.fillStyle = col; g.fillRect(x, y, w, h);
    g.fillStyle = 'rgba(255,236,190,0.35)'; XY.path(g, [x, y, x + d, y - d, x + w + d, y - d, x + w, y], true); g.fill();
    g.fillStyle = 'rgba(30,12,6,0.45)'; XY.path(g, [x + w, y, x + w + d, y - d, x + w + d, y + h - d, x + w, y + h], true); g.fill();
    g.strokeStyle = LINE; g.lineWidth = 1.4; g.strokeRect(x, y, w, h);
  };

  // ------------------------------------------------------------ static wall
  const borders = (g, W, H) => {
    g.fillStyle = RO; g.fillRect(0, 0, W, 58); g.fillStyle = '#7A2C18'; g.fillRect(0, 50, W, 8);
    pearls(g, 6, 6, W - 6, 6, 98, 2.6); pearls(g, 6, 54, W - 6, 54, 98, 2.6);
    for (let k = 0; k < 9; k++) { const x = 70 + k * 130; g.fillStyle = YO; g.beginPath(); g.arc(x, 30, 17, 0, TAU); g.fill(); g.strokeStyle = LINE; g.lineWidth = 1.4; g.stroke();
      for (let j = 0; j < 8; j++) { const a = j / 8 * TAU; g.fillStyle = j % 2 ? WH : '#D8B060'; g.beginPath(); g.ellipse(x + Math.cos(a) * 10, 30 + Math.sin(a) * 10, 6, 3, a, 0, TAU); g.fill(); }
      g.fillStyle = RO; g.beginPath(); g.arc(x, 30, 4, 0, TAU); g.fill();
    }
    // ground: terre verte with lotus buds, then a lower band
    g.fillStyle = TV; g.fillRect(0, 702, W, 40); g.fillStyle = 'rgba(30,40,20,0.35)'; g.fillRect(0, 702, W, 4);
    for (let x = 30; x < W; x += 64) { stroke(g, [x, 740, x + 4, 722, x + 2, 712], 1.4, '#3C4A2C'); mod(g, sp([x - 1, 714, x + 2, 702, x + 6, 714, x + 2, 718], 3), '#D89A8A', 'rgba(140,50,40,0.4)', 4, LINE, 1); }
    g.fillStyle = RO; g.fillRect(0, 742, W, 38); pearls(g, 6, 748, W - 6, 748, 98, 2.4); pearls(g, 6, 774, W - 6, 774, 98, 2.4);
    for (let x = 0; x < W; x += 40) { g.strokeStyle = YO; g.lineWidth = 2.4; g.beginPath(); g.moveTo(x, 768); g.bezierCurveTo(x + 10, 752, x + 22, 752, x + 26, 760); g.stroke(); }
  };
  const chamber = g => {
    // burnt chamber: slender pillars with bracket capitals, a curved roof, soot
    g.fillStyle = '#2E160E'; g.fillRect(70, 196, 230, 248);
    [[70], [282]].forEach(([x]) => { mod(g, [x, 444, x, 200, x + 18, 200, x + 18, 444], '#B07A44', SKD, 6); g.fillStyle = RO; g.fillRect(x - 4, 196, 26, 12); g.fillRect(x - 2, 300, 22, 6); });
    mod(g, sp([56, 200, 100, 162, 185, 150, 270, 162, 314, 200, 185, 192], 6), RO, 'rgba(40,10,4,0.5)', 10);
    for (let k = 0; k < 6; k++) stroke(g, [90 + k * 38, 170 - (k > 2 ? 6 - k : k) * 3, 92 + k * 38, 192], 1.2, '#5A1E10');
    const R = XY.rng(1101); for (let k = 0; k < 14; k++) { const x = 80 + R() * 210, y = 150 + R() * 120, r = 20 + R() * 40, rg = g.createRadialGradient(x, y, 2, x, y, r);
      rg.addColorStop(0, 'rgba(14,8,4,0.55)'); rg.addColorStop(1, 'rgba(14,8,4,0)'); g.fillStyle = rg; g.fillRect(x - r, y - r, 2 * r, 2 * r); }
    // the monk with the empty rack
    const x = 180, y = 440;
    mod(g, sp([x - 30, y, x - 34, y - 70, x - 20, y - 118, x + 18, y - 118, x + 30, y - 66, x + 28, y]), YO, 'rgba(110,60,10,0.5)', 10);
    mod(g, sp([x - 22, y - 116, x + 16, y - 118, x + 24, y - 80, x + 4, y - 60, x - 18, y - 84]), RO, 'rgba(60,14,6,0.5)', 8);
    mod(g, XY.ellipse(x - 2, y - 136, 15, 18, 18), SKIN, SKD, 6);
    stroke(g, [x - 10, y - 138, x - 4, y - 136], 1.4, BK); stroke(g, [x + 2, y - 136, x + 8, y - 138], 1.4, BK); stroke(g, [x - 4, y - 126, x + 2, y - 128, x + 6, y - 126], 1.2, '#6A2414');
    g.fillStyle = '#7A5530'; g.fillRect(x + 36, y - 168, 5, 168); g.fillRect(x + 6, y - 168, 66, 5);
    mod(g, XY.ellipse(x + 30, y - 92, 7, 6, 10), SKIN, SKD, 3); mod(g, XY.ellipse(x + 34, y - 112, 7, 6, 10), SKIN, SKD, 3);
    stroke(g, [x + 14, y - 104, x + 30, y - 92], 7, YO); stroke(g, [x + 10, y - 110, x + 34, y - 112], 7, YO);
  };
  // the lotus-bearing bodhisattva: tall crown, inclined head, tribhanga torso, pearl thread; eyes are drawn per frame
  const GY = { x: 470, y: 172, tilt: -0.1 };
  const bodhisattva = g => {
    const { x, y } = GY;
    // hair falling on the shoulders, then torso and arms
    g.fillStyle = BK; XY.path(g, sp([x - 50, y - 30, x - 64, y + 40, x - 70, y + 92, x - 40, y + 84, x - 30, y + 20]), true); g.fill();
    XY.path(g, sp([x + 46, y - 34, x + 62, y + 30, x + 70, y + 88, x + 42, y + 82, x + 30, y + 20]), true); g.fill();
    // golden skin modelled toward the contour: a soft light from the upper left, the edges sink into the dark ground
    const skinG = (cx, cy, r) => { const gr = g.createRadialGradient(cx - r * 0.3, cy - r * 0.3, r * 0.1, cx, cy, r); gr.addColorStop(0, '#E0AE6E'); gr.addColorStop(0.55, SKIN); gr.addColorStop(1, '#7E4E26'); return gr; };
    const limb = (pts, w0, w1) => { const c = XY.RIG.spline(pts, false, 6); return XY.RIG.ribbon(c, w0, w1); };
    // tribhanga: shoulders tilt one way, the hip swings out the other
    const torso = sp([x - 18, y + 58, x - 84, y + 84, x - 108, y + 112, x - 96, y + 150, x - 70, y + 196, x - 52, y + 238, x - 50, y + 276, x + 70, y + 276, x + 62, y + 232, x + 74, y + 190, x + 92, y + 142, x + 102, y + 104, x + 78, y + 80, x + 18, y + 58]);
    mod(g, torso, skinG(x, y + 160, 170), 'rgba(92,46,18,0.35)', 16);
    stroke(g, [x - 62, y + 150, x - 34, y + 166, x - 8, y + 158], 1.4, 'rgba(90,40,14,0.55)'); stroke(g, [x + 6, y + 156, x + 32, y + 164, x + 60, y + 148], 1.4, 'rgba(90,40,14,0.55)');
    stroke(g, [x + 4, y + 214, x + 8, y + 222], 1.6, 'rgba(90,40,14,0.6)'); stroke(g, [x - 30, y + 250, x + 10, y + 240, x + 54, y + 246], 1.4, 'rgba(90,40,14,0.4)');
    // arms (v10): soft and bent — the left hangs with the elbow out and the hand turned open (varada), the right
    // folds up from a lifted elbow, wrist bent back, thumb and forefinger pinching the lotus stem
    const seg = (pts, w0, w1, cx, cy, r) => { mod(g, limb(pts, w0, w1), skinG(cx, cy, r), 'rgba(92,46,18,0.32)', 7); const c = XY.RIG.spline(pts, false, 6);
      stroke(g, c.map((v, i) => v + (i % 2 ? -w0 * 0.12 : -w0 * 0.1)), 2.2, 'rgba(255,224,170,0.45)'); };
    seg([x - 96, y + 106, x - 120, y + 148, x - 132, y + 194], 31, 20, x - 118, y + 150, 70);
    seg([x - 132, y + 192, x - 128, y + 228, x - 108, y + 256], 20, 11, x - 122, y + 226, 50);
    mod(g, sp([x - 112, y + 252, x - 96, y + 256, x - 86, y + 270, x - 92, y + 278, x - 106, y + 272], 4), skinG(x - 98, y + 264, 24), 'rgba(92,46,18,0.3)', 3);
    [[0, 6, 22], [5, 8, 24], [10, 9, 22], [15, 8, 18]].forEach(([dx, sx, l]) => { const bx = x - 104 + dx * 0.9, by = y + 272; stroke(g, [bx, by, bx + sx * 0.5, by + l * 0.6, bx + sx, by + l], 3.6, SKIN); stroke(g, [bx + sx * 0.2, by + l * 0.3, bx + sx, by + l], 0.8, LINE); });
    stroke(g, [x - 108, y + 262, x - 118, y + 274, x - 116, y + 284], 3.4, SKIN);
    seg([x + 92, y + 104, x + 124, y + 138, x + 142, y + 178], 29, 19, x + 120, y + 140, 66);
    seg([x + 142, y + 176, x + 144, y + 138, x + 130, y + 100], 18, 11, x + 138, y + 140, 48);
    mod(g, sp([x + 120, y + 100, x + 130, y + 86, x + 142, y + 80, x + 140, y + 94, x + 132, y + 104], 4), skinG(x + 132, y + 92, 20), 'rgba(92,46,18,0.3)', 3);
    stroke(g, [x + 138, y + 82, x + 136, y + 70, x + 130, y + 66], 3.2, SKIN); stroke(g, [x + 126, y + 90, x + 128, y + 76, x + 132, y + 68], 3, SKIN);
    stroke(g, [x + 142, y + 88, x + 152, y + 84, x + 156, y + 76], 3, SKIN); stroke(g, [x + 140, y + 94, x + 150, y + 94, x + 156, y + 88], 2.8, SKIN);
    // the uttariya: a sheer scarf over the left shoulder, across the breast, its end falling over the left forearm
    g.save(); g.globalAlpha = 0.55; mod(g, XY.RIG.ribbon(XY.RIG.spline([x - 96, y + 94, x - 40, y + 140, x + 30, y + 196, x + 74, y + 230], false, 6), 18, 12), '#EDE2C6', 'rgba(120,90,50,0.3)', 4, LINE, 1);
    g.restore();
    for (let k = 0; k < 5; k++) stroke(g, [x - 80 + k * 30, y + 112 + k * 23, x - 70 + k * 30, y + 120 + k * 23], 1, 'rgba(168,58,36,0.6)');
    // ornaments: necklace, sacred pearl thread, armlets, a striped dhoti at the hip
    g.strokeStyle = YO; g.lineWidth = 5; g.beginPath(); g.ellipse(x - 4, y + 82, 54, 34, 0, 0.15, Math.PI - 0.15); g.stroke();
    pearls(g, x - 46, y + 98, x + 40, y + 98, 10, 3); g.fillStyle = RO; g.beginPath(); g.arc(x - 4, y + 118, 7, 0, TAU); g.fill(); g.fillStyle = LAP; g.beginPath(); g.arc(x - 4, y + 118, 3.4, 0, TAU); g.fill();
    for (let k = 0; k <= 22; k++) { const q = k / 22; g.fillStyle = k % 3 ? WH : RO; g.beginPath(); g.arc(XY.lerp(x - 70, x + 50, q), XY.lerp(y + 84, y + 270, q) - 30 * Math.sin(q * Math.PI), 2.6, 0, TAU); g.fill(); }
    [[x - 118, y + 150], [x + 122, y + 140]].forEach(([ax, ay]) => { g.fillStyle = YO; g.fillRect(ax - 18, ay - 4, 36, 8); g.fillStyle = RO; g.beginPath(); g.arc(ax, ay, 5, 0, TAU); g.fill(); });
    mod(g, [x - 60, y + 262, x + 52, y + 262, x + 70, y + 280, x - 76, y + 280], '#C9B48A', 'rgba(80,50,20,0.4)', 6);
    for (let k = 0; k < 9; k++) stroke(g, [x - 62 + k * 15, y + 264, x - 70 + k * 16.5, y + 280], 2, k % 2 ? RO : LAP);
    // neck, head, face (tilted), crown
    mod(g, [x - 16, y + 34, x + 14, y + 34, x + 18, y + 72, x - 20, y + 72], SKIN, SKD, 8);
    g.save(); g.translate(x, y); g.rotate(GY.tilt);
    mod(g, sp([0, -46, 26, -40, 36, -10, 30, 22, 14, 44, 0, 48, -14, 44, -30, 22, -36, -10, -26, -40]), SKIN, SKD, 12);
    stroke(g, [2, -8, 4, 14, 0, 20], 2.4, 'rgba(255,226,170,0.75)'); stroke(g, [-6, 22, 0, 24, 8, 22], 1.6, LINE);
    g.fillStyle = '#A83A24'; XY.path(g, sp([-9, 30, 0, 27, 9, 30, 0, 34], 3), true); g.fill();
    stroke(g, [-24, -16, -14, -21, -4, -18], 1.8, BK); stroke(g, [6, -18, 16, -21, 26, -16], 1.8, BK);
    mod(g, XY.ellipse(-37, 8, 6, 12, 10), YO, 'rgba(90,50,10,0.4)', 3); mod(g, XY.ellipse(37, 8, 6, 12, 10), YO, 'rgba(90,50,10,0.4)', 3);
    mod(g, [-32, -38, 32, -38, 40, -96, 30, -104, 18, -126, 6, -108, 0, -134, -6, -108, -18, -126, -30, -104, -40, -96], YO, 'rgba(110,60,10,0.5)', 10);
    for (let k = -2; k <= 2; k++) { stroke(g, [k * 14, -40, k * 16, -100], 1.2, '#7A4A14'); }
    for (let r = 0; r < 3; r++) { g.fillStyle = r === 1 ? RO : '#7A4A14'; g.fillRect(-32 + r * 1.5, -50 - r * 20, 64 - r * 3, 5); pearls(g, -28 + r, -44 - r * 20, 28 - r, -44 - r * 20, 8, 2.2); }
    [[-20, -66, LAP], [0, -70, RO], [20, -66, LAP], [0, -112, TV], [-18, -110, RO], [18, -110, RO]].forEach(([gx, gy, c]) => { g.fillStyle = c; g.beginPath(); g.arc(gx, gy, 5.5, 0, TAU); g.fill(); g.strokeStyle = WH; g.lineWidth = 1.2; g.stroke(); });
    g.restore();
  };
  // the Black Wind Cave among the rocks
  const cave = (g, W) => {
    const R = XY.rng(1111), cols = ['#8A6A3E', '#6E5A34', '#5F7048', '#7E4A2C', '#9A7A4A'];
    for (let r = 0; r < 4; r++) for (let k = 0; k < 6; k++) { const w = 44 + R() * 40, h = 40 + R() * 50, x = 770 + k * 66 + R() * 20 - r * 10, y = 90 + r * 92 + R() * 20; rock(g, x, y, w, h, cols[(k + r) % cols.length]); }
    const cm = sp([860, 446, 868, 320, 920, 232, 1000, 214, 1070, 236, 1110, 320, 1116, 446], 6), cg = g.createRadialGradient(990, 380, 30, 990, 360, 190);
    cg.addColorStop(0, '#A24A28'); cg.addColorStop(0.7, '#6E2A18'); cg.addColorStop(1, '#3A140C'); XY.path(g, cm, true); g.fillStyle = cg; g.fill();
    g.strokeStyle = LINE; g.lineWidth = 3; g.stroke();
    for (let k = 0; k < 9; k++) { const a = Math.PI * (1.05 + k * 0.1); stroke(g, [990 + Math.cos(a) * 150, 430 + Math.sin(a) * 190, 990 + Math.cos(a) * 118, 430 + Math.sin(a) * 150], 1.2, 'rgba(40,14,8,0.5)'); }
    for (let k = 0; k < 5; k++) rock(g, 770 + k * 80 + XY.hash(k, 3) * 12, 412 - XY.hash(k, 4) * 14, 46 + XY.hash(k, 5) * 24, 40, cols[k % cols.length]);
    void W;
  };
  // a slender colonnade with attendants behind the procession (kept low-contrast)
  const colonnade = (g, W) => {
    g.fillStyle = '#4A2416'; g.fillRect(56, 456, W - 112, 246);
    for (let x = 70; x < W - 60; x += 96) { g.fillStyle = '#7A4A2A'; g.fillRect(x, 470, 12, 232); g.fillStyle = '#9A6A3A'; g.fillRect(x - 6, 466, 24, 8); g.fillRect(x - 3, 560, 18, 4); }
    g.fillStyle = '#6A3220'; g.fillRect(56, 452, W - 112, 14); pearls(g, 60, 459, W - 60, 459, 80, 2, 'rgba(232,220,192,0.6)');
    // the 佛衣会 guests at the cave mouth (above the procession): 凌虚子 the Daoist with his tray of elixir pills, 白衣秀士 in white
    const guest = (x, y, robe, hat, k) => { mod(g, sp([x - 16, y, x - 18, y - 50, x - 10, y - 80, x + 10, y - 80, x + 18, y - 48, x + 16, y], 4), robe, 'rgba(40,20,10,0.4)', 7);
      mod(g, XY.ellipse(x + 2, y - 92, 10, 12, 12), SKIN, SKD, 4); g.fillStyle = hat; g.fillRect(x - 8, y - 110, 20, 9);
      if (k === 0) { stroke(g, [x + 10, y - 62, x + 34, y - 66], 4, robe); g.fillStyle = YO; g.beginPath(); g.ellipse(x + 40, y - 68, 16, 4, 0, 0, TAU); g.fill(); [[-6], [0], [6]].forEach(([d]) => { g.fillStyle = '#E8C060'; g.beginPath(); g.arc(x + 40 + d, y - 73, 3, 0, TAU); g.fill(); }); }
      else { stroke(g, [x + 10, y - 60, x + 24, y - 44], 4, robe); stroke(g, [x + 24, y - 44, x + 26, y - 30], 1.4, LINE); } };
    guest(800, 446, '#6A6A5A', BK, 0); guest(842, 446, WH, '#3A3A3A', 1);
  };
  // the inscription cartouche: 袈裟, 第十一难 and the Brahmi signs for 10 + 1
  const cartouche = g => {
    g.strokeStyle = 'rgba(232,220,192,0.75)'; g.lineWidth = 2; g.strokeRect(662, 70, 152, 118); g.lineWidth = 1; g.strokeRect(668, 76, 140, 106);
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.font = XY.font(56, XY.cnFont.kai, 'bold'); g.fillStyle = 'rgba(40,14,6,0.55)'; g.fillText('袈裟', 740, 116); g.fillStyle = '#EADCB8'; g.fillText('袈裟', 738, 113);
    g.font = XY.font(26, XY.cnFont.kai); g.fillStyle = '#D8A84A'; g.fillText('第十一难', 738, 162);
    g.textAlign = 'start'; g.textBaseline = 'alphabetic';
  };

  // plaster grain (multiply, static) and the losses where the plaster has fallen to the grey rock (on top, static)
  const grain = (W, H) => XY.keep('ajanta-grain', Math.ceil(W / 3), Math.ceil(H / 3), cv => {
    const g = cv.getContext('2d'), w = cv.width, h = cv.height, im = g.createImageData(w, h), d = im.data;
    for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) { const n = XY.fbm(i / 30, j / 30, 61, 4), f = XY.fbm(i / 4, j / 4, 63, 2), st = XY.fbm(i / 60, j / 14, 65, 3);
      const v = 0.86 + 0.09 * n + 0.05 * f - 0.08 * Math.max(0, st), o = (j * w + i) * 4; d[o] = 255 * v; d[o + 1] = 246 * v; d[o + 2] = 226 * v; d[o + 3] = 255; }
    g.putImageData(im, 0, 0);
  });
  const losses = (W, H, S) => XY.cached(`ajanta-loss:${S.toFixed(3)}`, W * S, H * S, cv => {
    const g = cv.getContext('2d'); g.scale(S, S);
    [[690, 62, 70, 40, 3], [40, 300, 26, 60, 5], [1150, 120, 30, 60, 11], [560, 760, 60, 18, 7]].forEach(([x, y, rx, ry, sd]) => {
      const p = XY.wobble(XY.densify(XY.ellipse(x, y, rx, ry, 18), 6, true), Math.min(rx, ry) * 0.35, sd, 0.08);
      g.save(); XY.path(g, p, true); g.fillStyle = '#8C8478'; g.fill(); g.clip();
      const R = XY.rng(sd); for (let k = 0; k < 60; k++) { g.fillStyle = R() < 0.5 ? 'rgba(60,54,48,0.4)' : 'rgba(200,192,176,0.4)'; g.fillRect(x - rx + R() * rx * 2, y - ry + R() * ry * 2, 2 + R() * 4, 1.5); }
      g.restore(); g.strokeStyle = 'rgba(240,226,196,0.85)'; g.lineWidth = 2.2; XY.path(g, p, true); g.stroke();
      g.strokeStyle = 'rgba(40,24,12,0.5)'; g.lineWidth = 1; g.save(); g.translate(1.5, 1.5); XY.path(g, p, true); g.stroke(); g.restore(); });
    const R = XY.rng(1123); g.strokeStyle = 'rgba(40,20,10,0.45)'; g.lineWidth = 1;
    for (let k = 0; k < 10; k++) { let x = R() * W, y = R() * H, a = R() * TAU; g.beginPath(); g.moveTo(x, y); for (let s = 0; s < 18; s++) { a += (R() - 0.5) * 0.8; x += Math.cos(a) * 9; y += Math.sin(a) * 9; g.lineTo(x, y); } g.stroke(); }
  });
  // the black bear spirit (v10), painted the Ajanta way: a dark mass modelled lighter toward its middle, a pale
  // contour so it reads against the cave, three-quarter head turned to the pilgrims with a long muzzle.
  // roar 0–1 opens the jaw; pain 0–1 brings the paws up to the fillet; bow 0–1 folds it forward in submission
  const FUR = '#4E3628', FURD = 'rgba(16,8,4,0.6)', RIM = 'rgba(244,214,160,0.85)';
  const bear = (g, x, y, t, roar, pain, robed, bow) => {
    const sh = pain * (1 - bow) * 0.1 * Math.sin(t * 34), rimmed = (pts, base, w) => { g.save(); g.translate(-2, -1.5); g.strokeStyle = RIM; g.lineWidth = 3; XY.path(g, pts, true); g.stroke(); g.restore(); mod(g, pts, base, FURD, w, '#140A06', 1.6); };
    g.save(); g.translate(x, y + 40); g.rotate(-0.5 * bow); g.translate(-x, -(y + 40));
    const body = sp([x - 84, y + 48, x - 78, y - 30, x - 44, y - 92, x + 20, y - 98, x + 72, y - 54, x + 92, y + 20, x + 84, y + 48], 6);
    rimmed(body, FUR, 26);
    if (robed > 0) { g.save(); g.globalAlpha = robed; mod(g, sp([x - 80, y + 46, x - 70, y - 24, x - 40, y - 84, x + 8, y - 64, x + 52, y - 4, x + 84, y + 46], 5), '#B03A24', 'rgba(60,10,4,0.5)', 12);
      g.strokeStyle = '#E2B84E'; g.lineWidth = 2.2; for (let k = 0; k < 4; k++) { g.beginPath(); g.moveTo(x - 64 + k * 36, y + 44); g.lineTo(x - 50 + k * 26, y - 40 + k * 14); g.stroke(); }
      g.beginPath(); g.moveTo(x - 74, y + 6); g.lineTo(x + 70, y + 18); g.stroke(); g.restore(); }
    // hind paws on the cave floor
    [[-58, 46], [52, 46]].forEach(([dx, dy]) => rimmed(XY.ellipse(x + dx, y + dy, 26, 13, 14), FUR, 6));
    // head: skull, ears, a long pale muzzle pointing left, small eye
    g.save(); g.translate(x - 26, y - 118); g.rotate(sh - 0.1);
    rimmed(XY.ellipse(26, -36, 15, 15, 14), FUR, 6); rimmed(XY.ellipse(-14, -38, 14, 14, 14), FUR, 6);
    rimmed(sp([-46, -6, -30, -36, 6, -46, 40, -30, 46, 4, 26, 30, -6, 34, -36, 22], 5), FUR, 14);
    const jaw = 14 * roar;
    if (roar > 0.05) { g.fillStyle = '#7A1A10'; XY.path(g, sp([-48, 8, -78, 10, -84, 18 + jaw * 0.5, -70, 22 + jaw, -48, 22 + jaw * 0.6], 3), true); g.fill();
      g.fillStyle = WH; [[-76, 12], [-64, 12], [-74, 20 + jaw], [-62, 20 + jaw]].forEach(([a, b]) => { g.beginPath(); g.moveTo(a, b); g.lineTo(a + 3, b + (b > 15 ? -6 : 6)); g.lineTo(a + 6, b); g.fill(); }); }
    mod(g, sp([-36, -10, -74, -4, -86, 6, -78, 14, -40, 18], 4), '#8A6A50', 'rgba(40,20,10,0.4)', 5, '#140A06', 1.4);
    if (roar > 0.05) mod(g, sp([-40, 18, -72, 18 + jaw, -66, 26 + jaw, -36, 26], 3), '#7A5A44', 'rgba(40,20,10,0.4)', 4, '#140A06', 1.2);
    g.fillStyle = '#140A06'; g.beginPath(); g.ellipse(-84, 4, 6, 4.6, 0, 0, TAU); g.fill();
    g.fillStyle = pain > 0.5 ? WH : '#E8C060'; g.beginPath(); g.ellipse(-24, -14, pain > 0.5 ? 5 : 4, 3.4, -0.2, 0, TAU); g.fill(); g.fillStyle = '#140A06'; g.beginPath(); g.arc(-25, -14, 1.8, 0, TAU); g.fill();
    stroke(g, [-36, -24, -16, -26], 2.4, '#140A06');
    if (pain > 0) { g.save(); g.globalCompositeOperation = 'screen'; g.fillStyle = `rgba(255,214,110,${0.45 * pain * (1 - bow)})`; g.beginPath(); g.ellipse(4, -34, 66, 26, 0, 0, TAU); g.fill(); g.restore();
      g.strokeStyle = '#F0C24A'; g.lineWidth = 9; g.beginPath(); g.ellipse(4, -34, 50 - 6 * pain, 13, -0.08, 0, TAU); g.stroke(); g.strokeStyle = LINE; g.lineWidth = 1.4; g.stroke(); }
    g.restore();
    // fore paws: on the knees, clawing the air while roaring, clutching the head in pain
    const rest = [[x - 70, y - 10], [x + 30, y - 6]], up = [[x - 128, y - 70], [x + 74, y - 150]], grip = [[x - 92, y - 140], [x + 36, y - 150]];
    [0, 1].forEach(k => { const a = [x + (k ? 36 : -50), y - 70], p = rest[k].map((v, i) => XY.lerp(XY.lerp(v, up[k][i], roar * (1 - pain)), grip[k][i], pain * (1 - bow)));
      rimmed(XY.RIG.capsule(a, p, 20, 16), FUR, 8); for (let c = -1; c <= 1; c++) stroke(g, [p[0] - 10 + c * 7, p[1] + 10, p[0] - 16 + c * 8, p[1] + 18], 2, WH); });
    g.restore();
  };
  const kasayaCloth = (g, x, y, s, rot, fl) => {
    g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s * (0.35 + 0.65 * Math.abs(fl)));
    mod(g, [-60, -36, 60, -36, 66, 36, -66, 36], '#B03A24', 'rgba(60,10,4,0.5)', 10);
    g.strokeStyle = YO; g.lineWidth = 2; for (let k = -2; k <= 2; k++) { g.beginPath(); g.moveTo(k * 24, -36); g.lineTo(k * 25, 36); g.stroke(); }
    g.beginPath(); g.moveTo(-62, 0); g.lineTo(62, 0); g.stroke(); pearls(g, -56, -30, 56, -30, 8, 2, '#E8C060');
    g.restore();
  };
  const COL = { fur: '#6E4226', face: '#C99A64', wkshirt: RO, tiger: YO, stripe: BK, gold: '#D2A23E', staff: RO, ink: BK, horse: '#E6DCC4', horse2: '#C9BC9E',
    mane: '#E0D4B8', hoof: '#3A2A1E', saddle: '#6A2A18', red: RO, robe: YO, kasaya: '#A83A24', skin: '#C99A64', metal: '#C9A040', wood: '#7A5530' };
  const penFor = back => ({ outline: LINE, ow: 1.3, shade: 'rgba(70,30,10,0.22)',
    color: (r, p, n) => { if (n === 'monk' && !back) { if (r === 'kasaya') return '#C08A36'; if (r === 'gold' && p && p.fine) return null; } return COL[r] !== undefined ? COL[r] : XY.DEFAULT_COLORS[r]; } });
  const BEAR = [985, 392];

  XY.STYLES.ajanta = {
    bg(g, W, H) {
      g.fillStyle = FIELD; g.fillRect(0, 0, W, H);
      g.lineCap = 'round'; g.lineJoin = 'round';
      colonnade(g, W); cave(g, W); chamber(g); bodhisattva(g); borders(g, W, H); cartouche(g);
    },
    hits: [2.5, 4.5, 6],
    draw(g, e) {
      const { W, H, u, t } = e; g.lineCap = 'round'; g.lineJoin = 'round';
      for (let k = 0; k < 8; k++) goose(g, 135 + k * 130, 34, 0.42, (Math.floor(t * 4) + k) % 2);
      // her eyes: downcast → open at beat 3.5 → lowered again in the afterglow
      const op = XY.smooth((u - 0.42) / 0.035) * (1 - XY.smooth((u - 1.0) / 0.15));
      g.save(); g.translate(GY.x, GY.y); g.rotate(GY.tilt);
      [-14, 14].forEach(ex => {
        if (op > 0.05) { g.save(); XY.path(g, sp([ex - 10, -9, ex, -9 - 1 * op, ex + 10, -9, ex, -9 + 6 * op], 4), true); g.fillStyle = '#EDE2C6'; g.fill(); g.clip();
          g.fillStyle = BK; g.beginPath(); g.arc(ex + 2.5, -7 + 2 * op, 3.6, 0, TAU); g.fill(); g.restore(); }
        stroke(g, [ex - 11, -9, ex - 4, -10.5 + 2.5 * (1 - op), ex + 4, -10.5 + 2.5 * (1 - op), ex + 11, -9], 2.2, BK);
        stroke(g, [ex - 8, -8 + 5 * op, ex + 8, -8 + 5 * op], 0.9, 'rgba(60,20,10,0.6)');
      });
      g.restore();
      if (op > 0 && op < 1) { g.save(); g.globalCompositeOperation = 'screen'; const rg = g.createRadialGradient(GY.x, GY.y - 8, 2, GY.x, GY.y - 8, 110); rg.addColorStop(0, `rgba(255,220,140,${0.6 * Math.sin(op * Math.PI)})`); rg.addColorStop(1, 'rgba(255,200,120,0)'); g.fillStyle = rg; g.fillRect(GY.x - 110, GY.y - 118, 220, 220); g.restore(); }
      // the blue lotus in her raised hand; it flares as the fillet leaves it (beat 4)
      const sw = 0.06 * Math.sin(t * 1.6), hx = GY.x + 134, hy = GY.y + 70, fx = hx + Math.sin(sw) * 120 + 14, fy = hy - Math.cos(sw) * 120, flare = Math.max(0, 1 - Math.abs(u - 0.5) / 0.04);
      stroke(g, [hx, hy, (hx + fx) / 2 + 6, (hy + fy) / 2, fx, fy + 10], 3, '#3C4A2C');
      for (let k = -3; k <= 3; k++) { const a = -Math.PI / 2 + k * (0.3 + 0.12 * flare) + sw, l = 46 - Math.abs(k) * 4;
        mod(g, sp([fx, fy + 8, fx + Math.cos(a - 0.2) * l * 0.5, fy + 8 + Math.sin(a - 0.2) * l * 0.5, fx + Math.cos(a) * l, fy + 8 + Math.sin(a) * l, fx + Math.cos(a + 0.2) * l * 0.5, fy + 8 + Math.sin(a + 0.2) * l * 0.5], 3), Math.abs(k) % 2 ? LAP : '#6A88B8', 'rgba(20,30,60,0.45)', 4, LINE, 1); }
      // beat 2: the bear roars and the black wind pours out of the cave over the road (beat 2.5)
      const roar = Math.sin(Math.PI * XY.clamp((u - 0.22) / 0.2)), bw = XY.clamp((u - 0.27) / 0.2);
      if (bw > 0 && bw < 1) for (let k = 0; k < 7; k++) { const q = XY.clamp(bw * 1.4 - k * 0.06), A = Math.sin(Math.PI * q); if (A <= 0) continue; const P = [];
        for (let j = 0; j <= 20; j++) { const s = j / 20, x = XY.lerp(900, 120, q * s + q * 0.2), y = 330 + k * 34 + 30 * Math.sin(s * 7 + t * 6 + k) + s * 120; P.push(x, y); }
        g.save(); g.globalAlpha = 0.9 * A; g.strokeStyle = 'rgba(232,220,192,0.5)'; g.lineWidth = 32 - 2 * k; XY.path(g, P, false); g.stroke(); g.strokeStyle = '#140A06'; g.lineWidth = 28 - 2 * k; g.stroke();
          g.strokeStyle = 'rgba(120,70,40,0.6)'; g.lineWidth = 2; g.stroke(); const hx_ = P[0], hy_ = P[1]; const C = []; for (let j = 0; j <= 14; j++) { const an = j * 0.55, r = 26 * (1 - j / 16); C.push(hx_ + Math.cos(an + Math.PI) * r, hy_ + Math.sin(an + Math.PI) * r); }
          g.strokeStyle = '#140A06'; g.lineWidth = 10; XY.path(g, C, false); g.stroke(); g.restore(); }
      // beat 4: the fillet leaves the lotus, beat 4.5: it closes on the bear's head
      const fly = XY.clamp((u - 0.5) / 0.0625), pain = XY.smooth((u - 0.5625) / 0.02), bow = XY.smooth((u - 0.8) / 0.12);
      if (fly > 0 && fly < 1) { const q = XY.easeIO(fly), rx = XY.lerp(fx, BEAR[0] - 22, q), ry = XY.lerp(fy, BEAR[1] - 152, q) - 160 * Math.sin(q * Math.PI), spin = e.lt * 18;
        for (let k = 1; k < 8; k++) { const qq = Math.max(0, q - k * 0.035), tx = XY.lerp(fx, BEAR[0] - 22, qq), ty = XY.lerp(fy, BEAR[1] - 152, qq) - 160 * Math.sin(qq * Math.PI); g.fillStyle = `rgba(250,214,110,${0.5 - k * 0.06})`; g.beginPath(); g.arc(tx, ty, 12 - k, 0, TAU); g.fill(); }
        g.save(); g.globalCompositeOperation = 'screen'; g.fillStyle = 'rgba(255,214,120,0.45)'; g.beginPath(); g.arc(rx, ry, 56, 0, TAU); g.fill(); g.restore();
        g.strokeStyle = '#F0C24A'; g.lineWidth = 10; g.beginPath(); g.ellipse(rx, ry, 42, 42 * Math.abs(Math.cos(spin)) + 4, 0.3, 0, TAU); g.stroke(); g.strokeStyle = LINE; g.lineWidth = 1.4; g.stroke(); }
      // the bear; beat 5 the kasaya tears loose and sails across the wall onto Tang Seng (beat 6)
      const kf = XY.clamp((u - 0.625) / 0.125), back = u >= 0.75;
      bear(g, BEAR[0], BEAR[1] + 4, t, roar, pain, u < 0.625 ? 1 : 0, bow);
      // the plaster losses belong to the wall, so they go under the pilgrims
      g.drawImage(losses(W, H, e.S), 0, 0, W, H);
      const acts = { wukong: { shade: XY.smooth((u - 0.26) / 0.06) * (1 - XY.smooth((u - 0.44) / 0.05)), strike: XY.smooth((u - 0.47) / 0.05) * (1 - XY.smooth((u - 0.7) / 0.08)) },
        monk: { palm: XY.smooth((u - 0.4) / 0.06) * (1 - XY.smooth((u - 0.95) / 0.1)) } };
      K.shadedTeam(g, e, penFor(back), acts, null, [[5, 4, 'rgba(60,24,8,0.4)'], [-3, -3, 'rgba(255,226,170,0.3)']]);
      if (kf > 0 && kf < 1) { const mc = e.at('monk.chest', acts), q = XY.easeIO(kf), x = XY.lerp(BEAR[0] - 10, mc[0], q), y = XY.lerp(BEAR[1] - 30, mc[1], q) - 220 * Math.sin(q * Math.PI);
        kasayaCloth(g, x, y, XY.lerp(1.5, 0.7, q), Math.sin(e.lt * 5) * 0.6 + q * 4, Math.cos(e.lt * 13)); }
      if (u >= 0.75 && u < 0.92) { const mc = e.at('monk.chest', acts), a = XY.clamp((u - 0.75) / 0.17); for (let k = 0; k < 18; k++) { const an = k / 18 * TAU, r = 24 + 110 * a;
        g.fillStyle = `rgba(240,200,96,${1 - a})`; g.beginPath(); g.arc(mc[0] + Math.cos(an) * r, mc[1] + Math.sin(an) * r * 0.8, 4.4, 0, TAU); g.fill(); } }
      // plaster grain, then the oil lamp: it drifts, and swings toward the cave for the climax
      g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'multiply'; g.drawImage(grain(W, H), 0, 0, W * e.S, H * e.S); g.restore();
      const foc = XY.smooth((u - 0.3) / 0.15) * (1 - XY.smooth((u - 0.82) / 0.15)), lx = XY.lerp(600 + 300 * Math.sin(t * 0.45), 900, foc), ly = XY.lerp(380 + 50 * Math.sin(t * 0.7), 360, foc), fl = 1 + 0.05 * XY.noise1(t * 9, 2) + 0.03 * XY.noise1(Math.floor(t * 12), 4);
      g.save(); g.globalCompositeOperation = 'multiply'; let rg = g.createRadialGradient(lx, ly, 200 * fl, lx, ly, 1000 * fl);
      rg.addColorStop(0, 'rgb(255,252,244)'); rg.addColorStop(0.5, 'rgb(220,198,168)'); rg.addColorStop(1, 'rgb(120,88,66)'); g.fillStyle = rg; g.fillRect(0, 0, W, H);
      g.globalCompositeOperation = 'screen'; rg = g.createRadialGradient(lx, ly, 10, lx, ly, 420 * fl); rg.addColorStop(0, 'rgba(255,200,120,0.16)'); rg.addColorStop(1, 'rgba(255,190,110,0)'); g.fillStyle = rg; g.fillRect(0, 0, W, H);
      g.restore();
      void H;
    },
    post(canvas, g, e) { K.zoomPost(canvas, g, e, BEAR[0] - 40, BEAR[1] - 80, K.zoom(e.u, [0.5, 0.57, 0.72], 1.12)); },
  };
})();
