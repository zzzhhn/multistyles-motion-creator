// 39 点彩 · 1886 年 · 兜山遇怪 — 第五十至五十二回：悟空画地为牢护住师父，师父出了圈，误入金兜山；独角兕大王祭起金刚琢，
// 天兵的枪剑斧叉一件件被套走，悟空举棒要打，金箍棒也被琢吸了去。整幅按修拉的办法画：平涂底稿 → 21 色纯色板两两并置的点
// （视觉混色）加补色点，四周一圈修拉自己点的深蓝边框；队伍是两层对齐画框的点阵（主色点＋邻色点），点位固定、颜色穿过点。
(() => {
  'use strict';
  const XY = window.XY, K = XY.KIT_E, TAU = XY.TAU;
  const PITCH = 6, RING = [786, 190], YANK = 4.9, FLASH = 5.8;
  const HEX = ['#1a2058', '#2a3a9a', '#3f6fd0', '#6aaee6', '#1f6a52', '#2f9a5a', '#a8c83a', '#f2cf3a', '#f08a2a', '#e0432a', '#c0306a', '#7a4aa8', '#f8f4e8', '#e8b48a',
    '#f6e49a', '#f6c48a', '#cfe08a', '#b0cff0', '#f2b8c8', '#c99a4a', '#9a7ac8'];
  const PAL = HEX.map(h => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)]);
  const LUM = c => 0.3 * c[0] + 0.59 * c[1] + 0.11 * c[2];
  // complement of the same value: invert the hue, keep the lightness (orange flecks in blue sky, not navy ones)
  const COMP = PAL.map(c => { const inv = c.map(v => 255 - v), dl = LUM(c) - LUM(inv), q = inv.map(v => XY.clamp(v + dl, 0, 255)); let b = 0, bd = 1e9;
    PAL.forEach((p, i) => { const d = (p[0] - q[0]) ** 2 + (p[1] - q[1]) ** 2 + (p[2] - q[2]) ** 2; if (d < bd) { bd = d; b = i; } }); return b; });
  const cache = new Map();
  // the optical-mix pair for a target colour: two palette colours and the share of the second
  const pairFor = (r, g, b) => {
    const key = ((r >> 3) << 10) | ((g >> 3) << 5) | (b >> 3); let v = cache.get(key); if (v) return v;
    let best = 1e18; v = [0, 0, 0];
    for (let i = 0; i < PAL.length; i++) for (let j = i; j < PAL.length; j++) {
      const P = PAL[i], Q = PAL[j], dx = Q[0] - P[0], dy = Q[1] - P[1], dz = Q[2] - P[2], dd = dx * dx + dy * dy + dz * dz;
      let w = dd ? ((r - P[0]) * dx + (g - P[1]) * dy + (b - P[2]) * dz) / dd : 0; w = i === j ? 0 : XY.clamp(w, 0.2, 0.8);
      const ex = P[0] + dx * w - r, ey = P[1] + dy * w - g, ez = P[2] + dz * w - b, err = ex * ex + ey * ey + ez * ez + 0.011 * dd;
      if (err < best) { best = err; v = [i, j, w]; }
    }
    cache.set(key, v); return v;
  };
  // dot a flat base canvas (one pixel per dot cell) onto g: hex grid, equal dots, complementary flecks
  const pointillize = (g, base, W, H, seed) => {
    const bw = base.width, bh = base.height, d = base.getContext('2d').getImageData(0, 0, bw, bh).data, paths = PAL.map(() => new Path2D()), rh = PITCH * 0.866;
    for (let j = 0, y = 0; y < H + PITCH; j++, y = j * rh) for (let i = 0; ; i++) {
      const x = i * PITCH + (j % 2) * PITCH / 2; if (x > W + PITCH) break;
      const bx = Math.min(bw - 1, Math.floor(x / W * bw)), by = Math.min(bh - 1, Math.floor(y / H * bh)), o = (by * bw + bx) * 4, h = XY.hash(i, j, seed), dj = (XY.hash(i, j, seed + 1) - 0.5) * 40;
      const [a, b, w] = pairFor(XY.clamp(d[o] + dj, 0, 255), XY.clamp(d[o + 1] + dj * 0.8, 0, 255), XY.clamp(d[o + 2] - dj * 0.6, 0, 255));
      let k = h < w ? b : a; const lum = 0.3 * d[o] + 0.59 * d[o + 1] + 0.11 * d[o + 2]; if (lum > 40 && XY.hash(i, j, seed + 2) < 0.07) k = COMP[k];
      const px = x + (XY.hash(i, j, seed + 3) - 0.5) * 2.4, py = y + (XY.hash(i, j, seed + 4) - 0.5) * 2.4;
      paths[k].moveTo(px + 2.7, py); paths[k].arc(px, py, 2.7, 0, TAU);
    }
    paths.forEach((p, k) => { g.fillStyle = HEX[k]; g.fill(p); });
  };
  // dot tiles for the procession (60×60, rows 5 apart, odd rows offset)
  const dotTile = (S, key, r0, keepP, off, seed = 9) => K.tile(key, S, 60, (g, T) => { for (let j = 0; j < 12; j++) for (let i = 0; i < 10; i++) {
    if (XY.hash(i, j, seed) > keepP) continue; const x = i * 6 + ((j % 2) ? 3 : 0) + off + (XY.hash(i, j, 5) - 0.5) * 1.6, y = j * 5 + off * 0.6 + (XY.hash(i, j, 6) - 0.5) * 1.6, r = r0 * (0.85 + 0.3 * XY.hash(i, j, 7));
    g.fillStyle = '#000'; K.wrap(T, x, y, r, (X, Y) => { g.beginPath(); g.arc(X, Y, r, 0, TAU); g.fill(); }); } });
  const C1 = { fur: '#c0702e', face: '#f0c090', wkshirt: '#e0432a', tiger: '#f2cf3a', stripe: '#1a2058', gold: '#f2cf3a', staff: '#e0432a', ink: '#1a2058', horse: '#f8f4e8', horse2: '#b0cff0',
    mane: '#f8f4e8', hoof: '#1a2058', saddle: '#c0306a', red: '#e0432a', robe: '#f2cf3a', kasaya: '#e0432a', skin: '#f6c48a', metal: '#f2cf3a', bjrobe: '#1a2058', bjpants: '#1a2058',
    pig: '#f2b8c8', pig2: '#e8b48a', wood: '#c99a4a', ssrobe: '#2a3a9a', ssrobe2: '#1f6a52', skin2: '#c99a4a', ssh: '#e0432a', ssbeard: '#e0432a', skull: '#f8f4e8', bundle: '#f2cf3a' };
  const C2 = { fur: '#2a3a9a', face: '#f2b8c8', wkshirt: '#f08a2a', tiger: '#f08a2a', stripe: '#7a4aa8', gold: '#f8f4e8', staff: '#c0306a', ink: '#2a3a9a', horse: '#b0cff0', horse2: '#f6e49a',
    mane: '#f6e49a', hoof: '#7a4aa8', saddle: '#7a4aa8', red: '#c0306a', robe: '#f6c48a', kasaya: '#f08a2a', skin: '#f2b8c8', metal: '#c99a4a', bjrobe: '#7a4aa8', bjpants: '#2a3a9a',
    pig: '#f6c48a', pig2: '#c0306a', wood: '#2a3a9a', ssrobe: '#1f6a52', ssrobe2: '#2a3a9a', skin2: '#f08a2a', ssh: '#c0306a', ssbeard: '#7a4aa8', skull: '#b0cff0', bundle: '#f08a2a' };
  const lighten = h => { const c = [1, 3, 5].map(k => parseInt(h.slice(k, k + 2), 16)); return `rgb(${c.map(v => Math.round(v + (236 - v) * 0.38)).join(',')})`; };
  const CU = {}; Object.keys(C1).forEach(k => { CU[k] = lighten(C1[k]); });
  const PEN1 = { color: r => C1[r] || '#f8f4e8', shade: false }, PEN2 = { color: r => C2[r] || '#b0cff0', shade: false, fine: false }, PENU = { color: r => CU[r] || '#ece4d0', shade: 'rgba(42,58,154,0.25)' };
  // a weapon or the staff as a dotted bar (design units, around its centre)
  const dotBar = (g, x, y, a, len, cols, r = 2.6) => { const n = Math.max(2, Math.round(len / 5)), c = Math.cos(a), s = Math.sin(a);
    for (let k = 0; k <= n; k++) { const q = k / n - 0.5; g.fillStyle = cols[Math.min(cols.length - 1, Math.floor((k / (n + 1)) * cols.length))]; g.beginPath(); g.arc(x + c * q * len, y + s * q * len, r, 0, TAU); g.fill(); } };
  const WEAP = [ // [colours along the shaft, length, start (soldier's hand), depart beat]
    [['#f8f4e8', '#b0cff0', '#e0432a', '#c99a4a', '#c99a4a', '#c99a4a'], 70, [404, 142], 1.6], [['#f8f4e8', '#b0cff0', '#b0cff0', '#f2cf3a'], 40, [470, 136], 2.4],
    [['#b0cff0', '#f8f4e8', '#c99a4a', '#c99a4a', '#c99a4a'], 54, [536, 140], 3.2], [['#f2cf3a', '#f8f4e8', '#c99a4a', '#c99a4a', '#c99a4a', '#c99a4a'], 66, [602, 134], 3.8]];
  const cap = (g, a, b, r1, r2) => { XY.path(g, XY.RIG.capsule(a, b, r1, r2), true); g.fill(); };
  // 独角兕大王 (太上老君's blue ox), profile facing left, feet at (0,0): one thick ivory horn, red armour, violet cape, ring held up
  const siPaint = (g, alt) => {
    const C = alt ? { skin: '#1f6a52', dark: '#7a4aa8', arm: '#f08a2a', gold: '#f8f4e8', cape: '#c0306a', horn: '#f6e49a', eye: '#f2cf3a', muz: '#b0cff0', spear: '#7a4aa8' }
      : { skin: '#2a3a9a', dark: '#1a2058', arm: '#e0432a', gold: '#f2cf3a', cape: '#7a4aa8', horn: '#f8f4e8', eye: '#e0432a', muz: '#6aaee6', spear: '#1a2058' };
    g.fillStyle = C.cape; K.blob(g, [-30, -196, 30, -196, 52, -120, 60, -36, 10, -48, -20, -120]);
    g.strokeStyle = C.spear; g.lineWidth = 6; g.beginPath(); g.moveTo(50, -312); g.lineTo(38, 10); g.stroke(); g.fillStyle = C.gold; g.beginPath(); g.moveTo(50, -340); g.lineTo(58, -306); g.lineTo(42, -306); g.fill();
    g.fillStyle = C.dark; cap(g, [-12, -92], [-22, 0], 15, 11); cap(g, [14, -92], [18, 0], 15, 11);
    g.fillStyle = C.arm; K.blob(g, [-40, -92, -44, -150, -32, -198, 8, -206, 36, -182, 38, -92]); g.fillStyle = C.gold; g.fillRect(-42, -112, 82, 10);
    g.fillStyle = C.arm; K.blob(g, [-48, -96, 48, -96, 56, -40, -56, -40]); g.fillStyle = C.gold; for (let k = 0; k < 6; k++) g.fillRect(-48 + k * 18, -66, 8, 8);
    g.fillStyle = C.skin; cap(g, [24, -182], [42, -132], 10, 9); cap(g, [-22, -188], [-46, -228], 11, 9); cap(g, [-46, -228], [-58, -272], 9, 8);
    g.fillStyle = C.skin; K.blob(g, [-2, -202, -30, -206, -60, -208, -78, -220, -74, -238, -46, -250, -14, -256, 6, -236]);
    g.fillStyle = C.muz; K.blob(g, [-58, -208, -78, -214, -80, -230, -64, -232]);
    g.fillStyle = C.horn; K.blob(g, [-48, -242, -60, -266, -72, -300, -60, -276, -40, -248]);
    g.fillStyle = C.skin; K.blob(g, [-6, -246, 10, -262, 12, -240]); g.fillStyle = C.eye; g.beginPath(); g.arc(-44, -234, 4.5, 0, TAU); g.fill();
    g.fillStyle = C.gold; g.beginPath(); g.arc(-58, -276, 7, 0, TAU); g.fill();
  };
  // four 天兵 on a cloud (they hold the weapons until the ring takes them), 300×120 local, feet on y 92
  const soldiersPaint = (g, alt) => { for (let k = 0; k < 4; k++) { const x = 34 + k * 66, c = alt ? ['#c0306a', '#f6e49a', '#2a3a9a'] : ['#e0432a', '#f2cf3a', '#1a2058'];
    g.fillStyle = c[2]; cap(g, [x - 4, 64], [x - 7, 92], 4, 3); cap(g, [x + 4, 64], [x + 6, 92], 4, 3); g.fillStyle = c[0]; K.blob(g, [x - 12, 66, x - 10, 40, x, 32, x + 10, 40, x + 12, 66]);
    g.fillStyle = c[1]; g.fillRect(x - 12, 50, 24, 5); g.beginPath(); g.arc(x, 24, 8, 0, TAU); g.fill(); g.fillStyle = c[0]; g.beginPath(); g.moveTo(x - 9, 22); g.lineTo(x, 8); g.lineTo(x + 9, 22); g.fill();
    g.fillStyle = c[2]; cap(g, [x + 6, 40], [x + 16, 48], 3, 3); } };
  // paint shapes into an offscreen and keep only dots of it (two dot layers: main and accent)
  const dotted = (g, S, x0, y0, w, h, paint, scale = 1) => {
    [[false, dotTile(S, 'c39bgA', 2.6, 0.97, 0, 11)], [true, dotTile(S, 'c39bgB', 2, 0.4, 3, 12)]].forEach(([alt, tile]) => {
      const cv = XY.mk(w * S, h * S), q = cv.getContext('2d'); q.scale(S, S); q.lineCap = 'round'; paint(q, alt);
      q.setTransform(1, 0, 0, 1, 0, 0); q.globalCompositeOperation = 'destination-in'; const p = q.createPattern(tile, 'repeat'); p.setTransform(new DOMMatrix([scale, 0, 0, scale, 0, 0])); q.fillStyle = p; q.fillRect(0, 0, cv.width, cv.height);
      g.drawImage(cv, x0, y0, w, h); });
  };
  const MTN = [560, 610, 650, 420, 760, 300, 860, 172, 918, 142, 962, 176, 1020, 236, 1082, 218, 1140, 290, 1162, 330, 1162, 610];

  XY.STYLES.pointillism = {
    hits: [YANK, FLASH],
    post(cv, g, e) { K.punch(cv, g, e, RING[0] - 60, RING[1] + 200, 1 + 0.1 * K.env(e.beat, YANK + 0.3, 0.3, 1.4)); },
    bg(g, W, H, c, S) {
      const bw = Math.ceil(W / PITCH), bh = Math.ceil(H / (PITCH * 0.866)), base = XY.mk(bw, bh), b = base.getContext('2d'); b.scale(bw / W, bh / H);
      b.fillStyle = '#22306e'; b.fillRect(0, 0, W, H);
      b.save(); b.beginPath(); b.rect(22, 22, W - 44, H - 44); b.clip();
      let gr = b.createLinearGradient(0, 22, 0, 470); gr.addColorStop(0, '#8fb0e0'); gr.addColorStop(0.6, '#d8dce8'); gr.addColorStop(1, '#f2e2b8'); b.fillStyle = gr; b.fillRect(0, 0, W, 480);
      [[500, 150, 190, 46], [880, 90, 120, 26], [190, 260, 110, 22], [1080, 150, 70, 18]].forEach(([x, y, rx, ry]) => { b.fillStyle = '#c8c4dc'; b.beginPath(); b.ellipse(x + 10, y + ry * 0.5, rx, ry * 0.8, 0, 0, TAU); b.fill(); b.fillStyle = '#f6f2e6'; b.beginPath(); b.ellipse(x, y, rx * 0.92, ry, 0, 0, TAU); b.fill(); });
      b.fillStyle = '#3e6a5a'; b.beginPath(); b.moveTo(22, 474); for (let x = 22; x <= 700; x += 14) b.lineTo(x, 470 - 14 - 18 * Math.abs(XY.noise1(x / 40, 3))); b.lineTo(700, 474); b.fill();
      gr = b.createLinearGradient(0, 470, 0, 566); gr.addColorStop(0, '#a8c8ec'); gr.addColorStop(1, '#4a7cc0'); b.fillStyle = gr; b.fillRect(22, 470, 700, 96);
      // 金兜山: sunlit gold on the left face, violet in shadow, strata, the cave
      XY.path(b, MTN, true); b.fillStyle = '#d8a040'; b.fill(); b.save(); XY.path(b, MTN, true); b.clip();
      b.fillStyle = '#7a5a9a'; b.beginPath(); b.moveTo(918, 142); b.lineTo(1000, 330); b.lineTo(1080, 610); b.lineTo(1170, 610); b.lineTo(1170, 140); b.fill();
      b.strokeStyle = '#b07a3a'; b.lineWidth = 5; for (let k = 0; k < 8; k++) { b.beginPath(); b.moveTo(600, 330 + k * 36); b.quadraticCurveTo(820, 300 + k * 40, 1170, 340 + k * 30); b.stroke(); }
      b.fillStyle = '#e8c070'; b.beginPath(); b.moveTo(860, 172); b.lineTo(800, 330); b.lineTo(760, 330); b.fill(); b.restore();
      b.fillStyle = '#2a2440'; b.beginPath(); b.ellipse(1012, 500, 50, 62, 0, 0, TAU); b.fill(); b.fillStyle = '#b07a3a'; b.fillRect(760, 556, 330, 12);
      // meadow, a sandy path, Seurat's stiff trees
      gr = b.createLinearGradient(0, 560, 0, 760); gr.addColorStop(0, '#5e9a48'); gr.addColorStop(0.5, '#86b048'); gr.addColorStop(1, '#4e8a40'); b.fillStyle = gr; b.fillRect(0, 560, W, 220);
      b.fillStyle = '#2f6a4a'; [[300, 610, 120], [640, 600, 80]].forEach(([x, y, r]) => { b.beginPath(); b.ellipse(x + 20, y, r, 16, 0, 0, TAU); b.fill(); });
      b.fillStyle = '#d8c890'; b.beginPath(); b.moveTo(0, 690); b.bezierCurveTo(400, 680, 800, 698, W, 690); b.lineTo(W, 730); b.bezierCurveTo(800, 736, 400, 722, 0, 732); b.fill();
      [[300, 330, 84, 112], [640, 400, 54, 74]].forEach(([x, y, rx, ry]) => { b.fillStyle = '#5a3e2e'; b.fillRect(x - 7, y, 14, 610 - y); b.fillStyle = '#2e5a3e'; b.beginPath(); b.ellipse(x, y, rx, ry, 0, 0, TAU); b.fill();
        b.fillStyle = '#4e8a4a'; b.beginPath(); b.ellipse(x - rx * 0.3, y - ry * 0.3, rx * 0.5, ry * 0.45, 0, 0, TAU); b.fill(); });
      b.restore();
      // ground: the blurred lay-in shows between the dots, then the dots
      g.imageSmoothingEnabled = true; g.drawImage(base, 0, 0, W, H); g.fillStyle = 'rgba(240,232,210,0.35)'; g.fillRect(0, 0, W, H);
      pointillize(g, base, W, H, 3901);
      // Wukong's protective circle on the ground (画地为牢), bright dots
      for (let k = 0; k < 120; k++) { const a = k / 120 * TAU, x = 300 + Math.cos(a) * 250, y = 712 + Math.sin(a) * 24; g.fillStyle = k % 3 ? '#f8f4e8' : '#f2cf3a'; g.beginPath(); g.arc(x, y, 2.8, 0, TAU); g.fill(); }
      dotted(g, S, 360, 82, 300, 120, soldiersPaint, 0.62);
      dotted(g, S, 690, 150, 300, 420, (q, alt) => { q.translate(160, 410); q.scale(1.15, 1.15); siPaint(q, alt); });
      // the title and the count, made of dots
      const T1 = K.textGrid('c39t', '金兜', XY.font(118, XY.cnFont.hei, '600'), 4.4), T2 = K.textGrid('c39n', '第三十九难', XY.font(30, XY.cnFont.hei, '600'), 2.2);
      for (let k = 0; k < T1.pts.length; k += 2) { const h = XY.hash(k, 39); g.fillStyle = h < 0.14 ? '#2a3a9a' : h < 0.55 ? '#f08a2a' : '#f2cf3a'; g.beginPath(); g.arc(36 + T1.pts[k], 38 + T1.pts[k + 1], 2.15, 0, TAU); g.fill(); }
      for (let k = 0; k < T2.pts.length; k += 2) { g.fillStyle = XY.hash(k, 40) < 0.2 ? '#e0432a' : '#1a2058'; g.beginPath(); g.arc(44 + T2.pts[k], 196 + T2.pts[k + 1], 1.15, 0, TAU); g.fill(); }
      void c;
    },
    draw(g, e) {
      const { t, u, beat, S } = e, f6 = K.step(t, 6), dot = (x, y, r, c) => { g.fillStyle = c; g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill(); };
      // ---- loops: light trembling on the lake, a sail drifting, the ring turning
      for (let k = 0; k < 90; k++) { const h = XY.hash(k, f6, 3); if (h < 0.55) continue; dot(30 + XY.hash(k, 1) * 680, 478 + XY.hash(k, 2) * 82, 2.6, h < 0.8 ? '#f8f4e8' : '#b0cff0'); }
      // the heavenly host's banners on the far shore, waving (a pennant of dots on each pole)
      [[96, 0], [150, 1], [204, 2], [258, 0]].forEach(([x, k]) => { for (let j = 0; j < 14; j++) dot(x, 470 - j * 5, 2, '#1a2058');
        for (let r = 0; r < 6; r++) for (let c = 0; c < 8 - r; c++) { const q = c / 8, wv = 4 * Math.sin(t * 5 - q * 4 + k); dot(x + 4 + c * 5, 408 + r * 5 + q * 6 + wv, 2.3, ['#e0432a', '#f2cf3a', '#c0306a'][k] === undefined ? '#e0432a' : (c + r) % 5 ? ['#e0432a', '#f2cf3a', '#c0306a'][k] : '#f8f4e8'); } });
      const flashAt = [...WEAP.map(w => w[3] + 1.1), FLASH].reduce((m, b) => Math.max(m, K.hit(beat, b, 3)), 0), RR = 44 + 16 * K.hit(beat, FLASH, 2);
      for (let k = 0; k < 48; k++) { const a = k / 48 * TAU + t * 1.6, r = RR + 2 * Math.sin(t * 4 + k); dot(RING[0] + Math.cos(a) * (r + 5), RING[1] + Math.sin(a) * (r + 5) * 0.86, 2.4, k % 2 ? '#1a2058' : '#7a4aa8'); dot(RING[0] + Math.cos(a) * r, RING[1] + Math.sin(a) * r * 0.86, 3.1 + 1.5 * flashAt, ['#f8f4e8', '#f2cf3a', '#f08a2a', '#f2cf3a'][k % 4]); }
      for (let k = 0; k < 26; k++) { const a = XY.hash(k, 4) * TAU - t * 0.7, r = RR + 10 + 18 * XY.hash(k, 5) + 60 * flashAt, tw = XY.hash(k, f6, 6); if (tw < 0.4) continue; dot(RING[0] + Math.cos(a) * r, RING[1] + Math.sin(a) * r * 0.86, 1.8 + 1.4 * flashAt, k % 2 ? '#f6e49a' : '#f8f4e8'); }
      // ---- the heavenly soldiers' weapons, taken one by one along a spiral
      WEAP.forEach(([cols, len, st, b0]) => { if (beat < b0) { dotBar(g, st[0], st[1] - 8, -1.25, len * 1.3, cols, 2.6); return; } const p = (beat - b0) / 1.1; if (p >= 1) return;
        const pos = q => { const eq = XY.smooth(q), sp = Math.sin(Math.PI * q) * 110, a = q * 6; return [XY.lerp(st[0], RING[0], eq) + Math.sin(a) * sp, XY.lerp(st[1], RING[1], eq) - Math.cos(a) * sp * 0.6 + 60 * Math.sin(Math.PI * q)]; };
        for (let k = 1; k <= 10; k++) { const [x, y] = pos(Math.max(0, p - k * 0.03)); g.globalAlpha = 1 - k / 11; dot(x, y, 2.4, k % 2 ? '#f8f4e8' : '#f6e49a'); } g.globalAlpha = 1;
        const [x, y] = pos(p), L = len * 1.6 * (1 - 0.75 * p); dotBar(g, x, y, -1.25 + p * 9, L + 8, ['#f8f4e8'], 4.4 * (1 - 0.4 * p)); dotBar(g, x, y, -1.25 + p * 9, L, cols, 3 * (1 - 0.4 * p)); });
      // ---- the procession as two dot layers over a pale lay-in; 悟空 raises the staff and the ring takes it
      const acts = { wukong: { raise: K.ramp(beat, 4.0, 4.5) * (1 - K.ramp(beat, YANK + 0.4, YANK + 0.9)), shade: K.ramp(beat, YANK + 0.8, YANK + 1.3) * (1 - K.ramp(u, 0.95, 1.06)) },
        monk: { palm: K.ramp(beat, YANK - 0.1, YANK + 0.3) * (1 - K.ramp(u, 0.92, 1.02)) }, bajie: { scratch: K.ramp(beat, 1.5, 1.9) * (1 - K.ramp(beat, 2.8, 3.2)) }, shaseng: { lift: K.ramp(beat, 6.2, 6.7) * (1 - K.ramp(beat, 7.4, 7.9)) } };
      if (beat >= YANK) acts.cast = { staff: false };
      const xf = {};
      const LU = K.procLayer('c39u', e, 340, 40), LA = K.procLayer('c39a', e, 340, 40), LB = K.procLayer('c39b', e, 340, 40);
      K.drawProc(LU.g, e, PENU, acts, { xf }); K.drawProc(LA.g, e, PEN1, acts, { xf }); K.drawProc(LB.g, e, PEN2, acts, { xf });
      K.pat(LA, dotTile(S, 'c39A', 2.7, 0.98, 0, 21), 'destination-in'); K.pat(LB, dotTile(S, 'c39B', 2.1, 0.42, 3, 22), 'destination-in', 1, (f6 % 2) * 3 * S, 0);
      K.put(g, LU, 'source-over', 0.85); K.put(g, LA); K.put(g, LB);
      // suction just before the yank, then the staff tumbling up into the ring
      const tip = K.at(e, 'wukong.staffTip', acts), end = K.at(e, 'wukong.staffEnd', acts);
      if (beat > YANK - 0.6 && beat < YANK + 0.2) { const a = XY.clamp((beat - (YANK - 0.6)) / 0.5) * (1 - XY.clamp((beat - YANK) / 0.2));
        for (let l = 0; l < 3; l++) for (let k = 0; k < 16; k++) { const q = ((k / 16) + t * 1.8 + l / 3) % 1, x = XY.lerp(tip[0], RING[0], q) + Math.sin(q * 9 + l * 2) * 26 * (1 - q), y = XY.lerp(tip[1], RING[1], q) + Math.cos(q * 9 + l * 2) * 12 * (1 - q);
          g.globalAlpha = a; dot(x, y, 2.2, ['#f6e49a', '#f8f4e8', '#f2cf3a'][l]); } g.globalAlpha = 1; }
      { const p = (beat - YANK) / 0.95; if (p >= 0 && p < 1) { const c0 = [(tip[0] + end[0]) / 2, (tip[1] + end[1]) / 2], a0 = Math.atan2(tip[1] - end[1], tip[0] - end[0]), ep = XY.easeIn(p);
        const pos = q => { const e2 = XY.easeIn(q); return [XY.lerp(c0[0], RING[0], e2) - 230 * Math.sin(Math.PI * q), XY.lerp(c0[1], RING[1], e2) - 120 * Math.sin(Math.PI * q)]; };
        for (let k = 1; k <= 14; k++) { const q = Math.max(0, p - k * 0.025), [x, y] = pos(q); g.globalAlpha = 1 - k / 15; dot(x + (XY.hash(k, 9) - 0.5) * 10, y + (XY.hash(k, 10) - 0.5) * 10, 2.6, k % 2 ? '#f8f4e8' : '#f6e49a'); } g.globalAlpha = 1;
        const [x, y] = pos(p), a = a0 + p * TAU * 2.5, L = 150 * (1 - 0.8 * p); dotBar(g, x, y, a, L + 8, ['#f8f4e8'], 4.6 * (1 - 0.4 * p));
        dotBar(g, x, y, a, L, ['#f2cf3a', '#e0432a', '#e0432a', '#c0306a', '#e0432a', '#e0432a', '#f2cf3a'], 3.2 * (1 - 0.4 * p)); void ep; } }
      // ---- entrance: the picture crystallises into dots, outward from the ring
      { const R0 = 1500 * XY.easeIn(K.ramp(u, -0.45, 0.06)); if (R0 < 1460) { g.save(); g.beginPath(); g.rect(0, 0, e.W, e.H); g.arc(RING[0], RING[1], Math.max(0, R0), 0, TAU, true); g.fillStyle = '#efe6d0'; g.fill('evenodd'); g.restore();
        for (let k = 0; k < 160; k++) { const a = k / 160 * TAU, rr = R0 + 18 * XY.hash(k, 7) - 4; dot(RING[0] + Math.cos(a) * rr, RING[1] + Math.sin(a) * rr, 2 + 2.5 * XY.hash(k, 8), HEX[Math.floor(XY.hash(k, 9) * 21)]); } } }
      // ---- a butterfly over the meadow
      { const x = 170 + 100 * Math.sin(t * 0.8), y = 618 + 26 * Math.sin(t * 2.3), fl = Math.abs(Math.sin(t * 17));
        [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([sx, sy]) => { dot(x + sx * 5 * fl, y + sy * 3 - 2, 2.4, sy < 0 ? '#f08a2a' : '#e0432a'); dot(x + sx * 9 * fl, y + sy * 5 - 3, 2, '#f2cf3a'); }); dot(x, y, 1.6, '#1a2058'); }
    },
  };
})();
