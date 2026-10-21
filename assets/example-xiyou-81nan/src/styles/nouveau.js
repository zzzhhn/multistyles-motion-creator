// 43 新艺术 · 1896 年 · 西梁国留婚 — 第五十四回：西梁女国的女王见唐僧一表人才，愿以一国之富招他为王；悟空定下假亲脱网计，
// 八戒在旁也想留下。画成慕夏的石版海报：奶油底上的圆环点花纹、马赛克光轮、金框鞭线角饰；女王侧像在右，她的长发是一束束
// 外粗内细的鞭线卷发，第 3 拍一路垂下，在唐僧身上缠一圈半（前半圈压在他身前），第 4 拍后慢慢松开（假亲脱网）。
(() => {
  'use strict';
  const XY = window.XY, K = XY.KIT_E, TAU = XY.TAU;
  const LINE = '#4e3320', GOLD = '#c9a24a', GOLD2 = '#9c7a2e', CREAM = '#f6eedb', HAIR = '#e8bf55', HAIRHI = '#f6dc8a', HAIRDK = '#b9862a';
  const HEAD = [986, 250], REACH = 3.3, BIND = 4.5, PUSH = 5.5, LET = 6.2, FLOOR = 702;
  const COL = { fur: '#c08a4a', face: '#f6dcc4', wkshirt: '#d0644e', tiger: '#e8b04a', stripe: LINE, gold: '#d9b04e', staff: '#b8473a', ink: LINE, horse: '#f6eedb', horse2: '#e2d6bc',
    mane: '#f2e6cc', hoof: '#6a4a30', saddle: '#9a4a3a', red: '#b8473a', robe: '#e9c46a', kasaya: '#c8574a', skin: '#f6dcc4', metal: '#c9a24a', bjrobe: '#3a3e4a', bjpants: '#2e323c',
    pig: '#f0bcb0', pig2: '#dc9c92', wood: '#9a6a3a', ssrobe: '#5f8a80', ssrobe2: '#4a7066', skin2: '#d0a07a', ssh: '#b8573a', ssbeard: '#a4472f', skull: '#f6f0e0', bundle: '#e2b05a' };
  const PEN = { color: r => COL[r], outline: LINE, ow: 1.3, shade: 'rgba(110,70,40,0.18)' };
  // tapered stroke whose width swells in the middle (the breathing Mucha line)
  const swell = (pts, w0, wm, w1) => { const n = pts.length / 2, L = [], R = [];
    for (let i = 0; i < n; i++) { const a = Math.max(0, i - 1), b = Math.min(n - 1, i + 1), dx = pts[2 * b] - pts[2 * a], dy = pts[2 * b + 1] - pts[2 * a + 1], d = Math.hypot(dx, dy) || 1, q = i / Math.max(1, n - 1);
      const w = (q < 0.4 ? XY.lerp(w0, wm, Math.sin(q / 0.4 * Math.PI / 2)) : XY.lerp(w1, wm, Math.cos((q - 0.4) / 0.6 * Math.PI / 2))) / 2;
      L.push(pts[2 * i] - dy / d * w, pts[2 * i + 1] + dx / d * w); R.push(pts[2 * i] + dy / d * w, pts[2 * i + 1] - dx / d * w); }
    const o = L.slice(); for (let i = R.length - 2; i >= 0; i -= 2) o.push(R[i], R[i + 1]); return o; };
  const fillPath = (g, pts, col) => { XY.path(g, pts, true); g.fillStyle = col; g.fill(); };
  const spiral = (cx, cy, r0, a0, turns, dir, n = 24) => { const o = []; for (let k = 0; k <= n; k++) { const q = k / n, a = a0 + dir * q * turns * TAU, r = r0 * (1 - 0.85 * q); o.push(cx + Math.cos(a) * r, cy + Math.sin(a) * r); } return o; };
  // a lock of hair: S-curve with a travelling wave, ending in a spiral; drawn dark edge → gold → cream core
  const lockPts = (x, y, ang, len, ph, t, curl = 1) => { const o = [], c = Math.cos(ang), s = Math.sin(ang);
    for (let k = 0; k <= 14; k++) { const q = k / 14, off = Math.sin(7.4 * q + ph - 2.4 * t) * (4 + 18 * q); o.push(x + c * len * q - s * off, y + s * len * q + c * off); }
    const ex = o[o.length - 2], ey = o[o.length - 1], ea = ang + curl * Math.PI / 2, r = 10 + 3 * Math.sin(ph);
    return o.concat(spiral(ex + Math.cos(ea) * r, ey + Math.sin(ea) * r, r, ea + Math.PI, 1.2, -curl).slice(2)); };
  const hairStroke = (g, pts, w) => { fillPath(g, swell(pts, w * 0.5 + 2.4, w + 3, 3), LINE); fillPath(g, swell(pts, w * 0.5, w, 1.4), HAIR);
    fillPath(g, swell(pts, w * 0.12, w * 0.34, 0.4), HAIRHI); };
  // the circle-and-heart dot pattern, the mosaic floor band, the gold frame (static)
  const frame = (g, W, H, f = 1) => { const ins = 14; g.save(); g.lineJoin = 'round';
    const per = 2 * (W + H - 4 * ins); if (f < 1) { g.setLineDash([per * f, per]); }
    g.strokeStyle = LINE; g.lineWidth = 2; g.strokeRect(ins - 5, ins - 5, W - 2 * ins + 10, H - 2 * ins + 10); g.strokeStyle = GOLD; g.lineWidth = 6; g.strokeRect(ins, ins, W - 2 * ins, H - 2 * ins);
    g.strokeStyle = LINE; g.lineWidth = 2; g.strokeRect(ins + 5, ins + 5, W - 2 * ins - 10, H - 2 * ins - 10); g.restore();
    if (f < 0.9) return;
    [[ins + 5, ins + 5, 1, 1], [W - ins - 5, ins + 5, -1, 1], [ins + 5, H - ins - 5, 1, -1], [W - ins - 5, H - ins - 5, -1, -1]].forEach(([x, y, sx, sy]) => {
      g.save(); g.translate(x, y); g.scale(sx, sy); const p = [0, 64]; for (let k = 1; k <= 10; k++) { const q = k / 10; p.push(20 * Math.sin(q * 2.4) + 4 * q, 64 - 60 * q); }
      const tail = p.concat(spiral(p[p.length - 2] + 12, p[p.length - 1] + 2, 12, Math.PI, 1.1, 1).slice(2)); fillPath(g, swell(tail, 1.4, 6, 1), GOLD);
      const p2 = [64, 0]; for (let k = 1; k <= 10; k++) { const q = k / 10; p2.push(64 - 60 * q, 20 * Math.sin(q * 2.4) + 4 * q); }
      fillPath(g, swell(p2.concat(spiral(p2[p2.length - 2] + 2, p2[p2.length - 1] + 12, 12, -Math.PI / 2, 1.1, -1).slice(2)), 1.4, 6, 1), GOLD); g.restore(); }); };
  // the queen in profile (facing left): gown with gold trim, sleeve, crown with a phoenix crest (static, drawn over her hair mass)
  const queen = g => { g.lineJoin = 'round';
    const out = (pts, fill, w = 2) => { const P = XY.RIG.spline(pts, true, 5); XY.path(g, P, true); g.fillStyle = fill; g.fill(); g.strokeStyle = LINE; g.lineWidth = w; g.stroke(); };
    out([940, 330, 980, 300, 1050, 300, 1100, 360, 1130, 470, 1150, 610, 1060, 640, 960, 630, 900, 600, 920, 470], '#f2d6cc', 3.4);
    for (let k = 0; k < 6; k++) { g.strokeStyle = 'rgba(150,90,80,0.45)'; g.lineWidth = 1.6; g.beginPath(); g.moveTo(980 + k * 22, 330 + k * 4); g.bezierCurveTo(970 + k * 26, 430, 960 + k * 30, 520, 930 + k * 36, 620); g.stroke(); }
    out([946, 334, 1000, 320, 1050, 330, 1040, 352, 996, 346, 950, 356], GOLD, 2);
    out([926, 360, 954, 350, 964, 420, 944, 478, 912, 488, 904, 470, 916, 430], '#e6aaa5', 2.4);
    out([906, 470, 930, 478, 926, 494, 902, 488], '#f6dcc4', 1.8);
    out([968, 262, 958, 290, 964, 300, 990, 312, 1010, 300, 1004, 270], '#f6dcc4', 2.2);
    out([1000, 210, 1010, 240, 1004, 276, 990, 290, 972, 290, 964, 276, 956, 266, 960, 252, 956, 242, 966, 226, 980, 210], '#f6dcc4', 2.6);
    g.strokeStyle = LINE; g.lineWidth = 1.6; g.beginPath(); g.moveTo(966, 244); g.quadraticCurveTo(972, 240, 978, 244); g.stroke(); g.beginPath(); g.moveTo(968, 249); g.quadraticCurveTo(973, 252, 978, 249); g.stroke();
    g.fillStyle = '#c8574a'; g.beginPath(); g.ellipse(962, 272, 4, 2.2, 0, 0, TAU); g.fill(); g.fillStyle = 'rgba(230,140,130,0.35)'; g.beginPath(); g.arc(980, 264, 8, 0, TAU); g.fill();
    out([964, 214, 976, 188, 1000, 174, 1030, 190, 1030, 214, 1000, 206], GOLD, 2.2);
    for (let k = 0; k < 5; k++) { const x = 970 + k * 14, y = 192 - 6 * Math.sin(k / 4 * Math.PI); out([x - 5, y + 6, x, y - 14, x + 5, y + 6], k % 2 ? '#d9b04e' : GOLD2, 1.4); }
    out([1000, 168, 1010, 150, 1024, 156, 1016, 172], '#b8473a', 1.6); g.fillStyle = '#5f9a8a'; g.beginPath(); g.arc(982, 200, 4, 0, TAU); g.fill();
    for (let k = 0; k < 7; k++) { g.fillStyle = k % 2 ? '#5f9a8a' : '#c8574a'; g.beginPath(); g.arc(950 + k * 16, 336, 3, 0, TAU); g.fill(); } };
  const HOUSE = [[70, 548, 60, 90], [150, 586, 44, 52], [480, 570, 70, 70], [600, 540, 50, 100], [700, 580, 60, 60]];

  XY.STYLES.nouveau = {
    hits: [BIND, PUSH],
    thumb: 6.15,   // hair still round him, push-in already settled
    post(cv, g, e) { K.punch(cv, g, e, e.procX + 20, e.groundY - 160, 1 + 0.1 * K.env(e.beat, BIND + 0.1, 0.3, 1.5)); },
    bg(g, W, H) {
      let gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, '#b9cba0'); gr.addColorStop(0.45, '#cfd3a6'); gr.addColorStop(1, '#ecc9a2'); g.fillStyle = gr; g.fillRect(0, 0, W, H);
      g.strokeStyle = 'rgba(120,140,100,0.38)'; g.fillStyle = 'rgba(120,140,100,0.38)'; g.lineWidth = 1.6;
      for (let r = 0, y = 30; y < H; r++, y += 54) for (let x = (r % 2) * 31; x < W + 31; x += 62) { g.beginPath(); g.arc(x, y, 10, 0, TAU); g.stroke(); g.beginPath(); g.arc(x, y, 2.6, 0, TAU); g.fill(); }
      const R = XY.rng(4301); for (let i = 0; i < 700; i++) { g.fillStyle = R() < 0.5 ? 'rgba(110,80,50,0.06)' : 'rgba(255,250,235,0.10)'; g.beginPath(); g.arc(R() * W, R() * H, 4 + R() * 26, 0, TAU); g.fill(); }
      // the towers of 西梁女国 in pale sage, a green banner of roses behind the procession
      HOUSE.forEach(([x, y, w, h], k) => { g.fillStyle = k % 2 ? '#a9bb94' : '#9fb38c'; g.fillRect(x, y, w, h); g.strokeStyle = 'rgba(78,51,32,0.45)'; g.lineWidth = 1.6; g.strokeRect(x, y, w, h);
        g.beginPath(); g.moveTo(x - 8, y); g.quadraticCurveTo(x + w / 2, y - 10, x + w / 2, y - 34 - (k % 2) * 16); g.quadraticCurveTo(x + w / 2, y - 10, x + w + 8, y); g.closePath(); g.fillStyle = '#c6a76a'; g.fill(); g.stroke();
        g.fillStyle = 'rgba(78,51,32,0.35)'; g.beginPath(); g.ellipse(x + w / 2, y + h * 0.45, w * 0.14, h * 0.18, 0, 0, TAU); g.fill(); });
      g.fillStyle = '#8fac80'; g.beginPath(); g.moveTo(0, 630); g.bezierCurveTo(300, 600, 700, 660, W, 610); g.lineTo(W, FLOOR); g.lineTo(0, FLOOR); g.fill();
      g.strokeStyle = LINE; g.lineWidth = 2; g.beginPath(); g.moveTo(0, 630); g.bezierCurveTo(300, 600, 700, 660, W, 610); g.stroke();
      for (let k = 0; k < 14; k++) { const x = 40 + k * 82, y = 652 + 10 * Math.sin(k * 1.7); for (let j = 0; j < 6; j++) { const a = j / 6 * TAU; g.fillStyle = k % 3 ? '#d9706a' : '#e6aaa5'; g.beginPath(); g.ellipse(x + Math.cos(a) * 7, y + Math.sin(a) * 7, 7, 4.5, a, 0, TAU); g.fill(); }
        g.fillStyle = '#3f6a4a'; g.beginPath(); g.arc(x, y, 3.4, 0, TAU); g.fill(); g.fillStyle = GOLD; g.beginPath(); g.arc(x, y, 1.4, 0, TAU); g.fill(); }
      // mosaic floor band (the procession walks on it)
      g.fillStyle = '#e8d8b8'; g.fillRect(0, FLOOR, W, H - FLOOR);
      const M = ['#c9a24a', '#5f9a8a', '#d9706a', '#f6eedb', '#3d7763', '#e6aaa5', '#9c7a2e', '#ebb8b2', '#8fac80'];
      for (let r = 0; r < 3; r++) for (let k = 0; k * 20 < W + 20; k++) { const n = k + r * 7; g.fillStyle = M[(n * 7 + (n >> 2)) % 9]; g.fillRect(k * 20 + (r % 2) * 10, FLOOR + 6 + r * 24, 18, 22); }
      g.strokeStyle = LINE; g.lineWidth = 2; g.beginPath(); g.moveTo(0, FLOOR + 2); g.lineTo(W, FLOOR + 2); g.stroke();
      // the title banner with rolled ends, the count on a small scroll
      const ban = [40, 50, 330, 44, 336, 140, 46, 146]; g.fillStyle = '#8fac80'; XY.path(g, ban, true); g.fill(); g.strokeStyle = LINE; g.lineWidth = 2.4; g.stroke();
      [[40, 50, 46, 146], [330, 44, 336, 140]].forEach(([a, b, c, d], k) => { g.fillStyle = '#6e8e62'; g.beginPath(); g.ellipse((a + c) / 2 + (k ? 8 : -8), (b + d) / 2, 12, 50, 0, 0, TAU); g.fill(); g.stroke(); });
      g.font = XY.font(78, '"Yuanti SC", "PingFang SC", sans-serif', 'bold'); g.textBaseline = 'alphabetic'; g.lineJoin = 'round';
      g.strokeStyle = GOLD; g.lineWidth = 12; g.strokeText('留婚', 92, 126); g.strokeStyle = LINE; g.lineWidth = 6; g.strokeText('留婚', 92, 126); g.fillStyle = CREAM; g.fillText('留婚', 92, 126);
      g.fillStyle = CREAM; XY.path(g, [70, 158, 300, 156, 302, 190, 72, 192], true); g.fill(); g.strokeStyle = LINE; g.lineWidth = 1.8; g.stroke();
      g.font = XY.font(26, '"Yuanti SC", "PingFang SC", sans-serif', 'bold'); g.fillStyle = LINE; g.fillText('第四十三难', 118, 184);
    },
    draw(g, e) {
      const { W, H, t, u, beat, S } = e;
      const reach = XY.smooth((beat - REACH) / (BIND - REACH)), rel = XY.smooth((beat - LET) / 0.9), f = reach * (1 - rel), hold = K.ramp(beat, BIND - 0.25, BIND + 0.15) * (1 - rel);
      // ---- the queen's 凤辇 on its terrace: posts, a canopy with upturned eaves, and the gold phoenix on top whose tail plumes
      //      unfurl into whiplash curves (the Art Nouveau line grows out of the novel's own phoenix carriage)
      const unf = XY.smooth((beat - 1.6) / 1.8), gr = XY.easeOut(K.ramp(u, -0.45, 0.05));
      { const T = [[760, 640, 1180, 640, 1180, 660, 760, 660]]; fillPath(g, T[0], '#c6a76a'); g.strokeStyle = LINE; g.lineWidth = 2; g.strokeRect(760, 640, 420, 20);
        for (let k = 0; k < 21; k++) { g.fillStyle = ['#c9a24a', '#5f9a8a', '#d9706a', '#f6eedb'][k % 4]; g.fillRect(764 + k * 20, 644, 16, 12); } }
      [[890, 0], [1158, 1]].forEach(([x]) => { fillPath(g, [x - 7, 640, x + 7, 640, x + 6, 124, x - 6, 124], '#b8473a'); g.strokeStyle = LINE; g.lineWidth = 2; g.strokeRect(x - 7, 124, 14, 516); g.fillStyle = GOLD; g.fillRect(x - 9, 200, 18, 8); g.fillRect(x - 9, 580, 18, 8); });
      { const cy = 124; fillPath(g, [858, cy + 12, 900, cy - 12, 1150, cy - 12, 1190, cy + 12, 1170, cy - 2, 1024, cy - 40, 878, cy - 2], '#3d7763'); g.strokeStyle = LINE; g.lineWidth = 2.4; XY.path(g, [858, cy + 12, 900, cy - 12, 1150, cy - 12, 1190, cy + 12, 1170, cy - 2, 1024, cy - 40, 878, cy - 2], true); g.stroke();
        for (let k = 0; k < 12; k++) { const x = 880 + k * 24, y = cy + 6 + 8 * Math.abs(Math.sin(k)); g.strokeStyle = GOLD; g.lineWidth = 2; g.beginPath(); g.moveTo(x, cy - 2); g.lineTo(x, y + 4 * Math.sin(t * 2 + k)); g.stroke(); g.fillStyle = '#d9706a'; g.beginPath(); g.arc(x, y + 4 * Math.sin(t * 2 + k) + 3, 3.4, 0, TAU); g.fill(); } }
      { const px = 1060, py = 96 - 4 * Math.sin(t * 1.5);
        for (let k = 0; k < 5; k++) { const len = (240 + 70 * k) * (0.15 + 0.85 * unf), pts = [];
          for (let j = 0; j <= 16; j++) { const q = j / 16, x = px - 20 - len * q, y = py - 6 + (8 + 14 * k) * Math.sin(Math.PI * q * 0.9) * (q < 0.5 ? -1.4 : 1) + 6 * Math.sin(t * 2 + q * 6 + k) * q; pts.push(x, y); }
          const ex = pts[32], ey = pts[33], sp = spiral(ex - 12, ey + 2, 12 + 3 * unf, 0, 1.15, k % 2 ? 1 : -1);
          const P = pts.concat(sp.slice(2)); fillPath(g, swell(P, 2, 13, 2), LINE); fillPath(g, swell(P, 1, 9, 1), [GOLD, '#d9706a', '#5f9a8a', GOLD, '#b8473a'][k]);
          fillPath(g, swell(P, 0.4, 3, 0.4), '#f6dc8a'); if (unf > 0.6) { g.fillStyle = '#3d7763'; g.beginPath(); g.arc(ex - 12, ey + 2, 4, 0, TAU); g.fill(); } }
        g.save(); g.translate(px, py); g.scale(-1.5, 1.5); g.strokeStyle = LINE; g.lineWidth = 1.6;
        const body = [-26, 6, -10, -18, 18, -20, 30, -6, 14, 10]; fillPath(g, XY.RIG.spline(body, true, 4), GOLD); XY.path(g, XY.RIG.spline(body, true, 4), true); g.stroke();
        const neck = [-22, -10, -36, -34, -46, -30, -38, -14]; fillPath(g, XY.RIG.spline(neck, true, 4), GOLD); XY.path(g, XY.RIG.spline(neck, true, 4), true); g.stroke();
        fillPath(g, [-46, -30, -58, -26, -46, -24], '#b8473a'); fillPath(g, [-40, -36, -34, -52, -30, -38], '#d9706a'); fillPath(g, [-36, -40, -26, -54, -28, -40], '#d9706a');
        const wing = [-6, -12, 8, -40 - 6 * Math.sin(t * 3), 24, -30, 20, -10]; fillPath(g, XY.RIG.spline(wing, true, 4), '#d9706a'); XY.path(g, XY.RIG.spline(wing, true, 4), true); g.stroke();
        g.fillStyle = LINE; g.beginPath(); g.arc(-40, -30, 2, 0, TAU); g.fill(); g.restore(); }
      // two palace maids with round fans on long poles (fans sway)
      [[812, 0], [852, 1]].forEach(([x, k]) => { const y = 640, sw = 0.12 * Math.sin(t * 1.6 + k * 2);
        fillPath(g, [x - 16, y, x - 10, y - 70, x, y - 82, x + 10, y - 70, x + 16, y], k ? '#5f9a8a' : '#e6aaa5'); g.strokeStyle = LINE; g.lineWidth = 1.8; XY.path(g, [x - 16, y, x - 10, y - 70, x, y - 82, x + 10, y - 70, x + 16, y], true); g.stroke();
        fillPath(g, XY.ellipse(x, y - 92, 9, 10, 12), '#f6dcc4'); g.stroke(); fillPath(g, XY.ellipse(x - 1, y - 104, 9, 6, 10), '#4e3320');
        g.save(); g.translate(x + 8, y - 60); g.rotate(sw); g.strokeStyle = LINE; g.lineWidth = 3; g.beginPath(); g.moveTo(0, 0); g.lineTo(0, -120); g.stroke();
        fillPath(g, XY.ellipse(0, -140, 26, 30, 20), k ? GOLD : '#d9706a'); g.lineWidth = 2; XY.path(g, XY.ellipse(0, -140, 26, 30, 20), true); g.stroke();
        g.strokeStyle = LINE; g.lineWidth = 1.4; XY.path(g, spiral(0, -140, 18, 0, 1.4, 1), false); g.stroke(); g.restore(); });
      // ---- her hair: a mass flowing down her back with a breathing edge; locks with spiral ends over her shoulder
      { const m = [985, 185, 1030, 166, 1078, 186, 1104, 236, 1116, 300, 1132, 362, 1124, 424, 1098, 456, 1076, 414, 1062, 350, 1040, 300, 1010, 282];
        for (let k = 0; k < m.length; k += 2) if (m[k] > 1060) m[k] += 6 * Math.sin(t * 1.6 + m[k + 1] * 0.035);
        XY.path(g, XY.RIG.spline(m, true, 4), true); g.fillStyle = HAIRDK; g.fill(); g.strokeStyle = LINE; g.lineWidth = 2.4; g.stroke();
        for (let k = 0; k < 3; k++) hairStroke(g, lockPts(1096 + k * 10, 200 + k * 30, 0.35 + 0.25 * k, 70 + 12 * k, k * 1.9, t, -1), 10); }
      // ---- the reaching lock: from her hair down to the master, round him one and a half times
      const acts = { monk: { palm: K.ramp(beat, PUSH - 0.25, PUSH + 0.1) * (1 - K.ramp(beat, LET + 0.8, LET + 1.4)) }, wukong: { shade: K.ramp(beat, PUSH - 0.1, PUSH + 0.3) * (1 - K.ramp(beat, 7.2, 7.7)) },
        bajie: { scratch: K.ramp(beat, 1.8, 2.2) * (1 - K.ramp(beat, 3.4, 3.8)) } };
      const sad = K.fig(e, 'monk', acts).anchors.saddle, xf = { 'monk.rider': { rot: 0.11 * hold + 0.02 * hold * Math.sin(t * 7), px: sad[0], py: sad[1] } };
      let lock = null; if (f > 0.01) { const mc = K.at(e, 'monk.chest', acts, xf), c = [mc[0] + 2, mc[1] + 14], rx = 24, ry = 8, P = [], ws = [];
        const a0 = -0.25, e0 = [c[0] + Math.cos(a0) * rx, c[1] + Math.sin(a0) * ry - 6], b = [[1060, 214], [1010, 70], [Math.max(mc[0] + 140, 760), 200], e0];
        for (let k = 0; k <= 30; k++) { const q = k / 30, iq = 1 - q, x = iq * iq * iq * b[0][0] + 3 * iq * iq * q * b[1][0] + 3 * iq * q * q * b[2][0] + q * q * q * b[3][0], y = iq * iq * iq * b[0][1] + 3 * iq * iq * q * b[1][1] + 3 * iq * q * q * b[2][1] + q * q * q * b[3][1];
          const wv = Math.sin(q * 9 - t * 4) * 10 * Math.sin(Math.PI * q); P.push(x + wv * 0.6, y + wv); ws.push(16 - 6 * q); }
        const front = []; for (let k = 1; k <= 40; k++) { const q = k / 40, a = a0 - q * 3 * Math.PI; P.push(c[0] + Math.cos(a) * rx, c[1] + Math.sin(a) * ry - 6 + 22 * q); ws.push(10 - 5 * q); front.push(Math.sin(a) > 0); }
        const n = Math.max(2, Math.round(f * P.length / 2)); lock = { P: P.slice(0, 2 * n), ws: ws.slice(0, n), front, n0: 31 }; }
      const ribW = (pts, ws, k) => { const n = pts.length / 2, L = [], R = []; for (let i = 0; i < n; i++) { const a = Math.max(0, i - 1), b = Math.min(n - 1, i + 1), dx = pts[2 * b] - pts[2 * a], dy = pts[2 * b + 1] - pts[2 * a + 1], d = Math.hypot(dx, dy) || 1, w = ws[i] * k / 2;
        L.push(pts[2 * i] - dy / d * w, pts[2 * i + 1] + dx / d * w); R.push(pts[2 * i] + dy / d * w, pts[2 * i + 1] - dx / d * w); } const o = L.slice(); for (let i = R.length - 2; i >= 0; i -= 2) o.push(R[i], R[i + 1]); return o; };
      const drawLock = (pts, ws) => { if (pts.length < 4) return; fillPath(g, ribW(pts, ws.map(w => w + 3), 1), LINE); fillPath(g, ribW(pts, ws, 1), HAIR); fillPath(g, ribW(pts, ws, 0.3), HAIRHI); };
      if (lock) { const n = lock.ws.length, m = Math.min(n, 31); [[9, 5, 0.5, 1.4], [-7, 8, 0.42, 2.6]].forEach(([ox, oy, k, ph]) => { const P2 = [], W2 = [];
          for (let i = 0; i < m; i++) { const q = i / 30; P2.push(lock.P[2 * i] + ox * Math.sin(q * 6 + ph + t * 2), lock.P[2 * i + 1] + oy * Math.cos(q * 5 + ph)); W2.push(lock.ws[i] * k); } drawLock(P2, W2); });
        drawLock(lock.P, lock.ws); }
      g.drawImage(XY.keep(`c43q:${S.toFixed(3)}`, 320 * S, 520 * S, cv => { const q = cv.getContext('2d'); q.scale(S, S); q.translate(-850, -140); queen(q); }), 850, 140, 320, 520);
      for (let k = 0; k < 4; k++) hairStroke(g, lockPts(1084 + k * 9, 300 + k * 34, 1.25 + 0.08 * k, 120 + 26 * k, k * 1.3 + 2, t, k % 2 ? 1 : -1), 12 - k);
      // ---- the procession, Mucha-style: thin inner lines, a thick outer contour from three offset silhouettes
      const L = K.procLayer('c43', e, 330, 40), M = K.procLayer('c43m', e, 330, 40); K.drawProc(L.g, e, PEN, acts, { xf });
      K.over(M, L); K.fill(M, LINE, 'source-in'); [[-1.5, -1.5], [3.5, 4.5], [2, 2.5]].forEach(([dx, dy]) => K.put(g, M, 'source-over', 1, dx, dy)); K.put(g, L);
      // the front half of every turn passes in front of him
      if (lock) { let run = []; const flush = () => { if (run.length >= 2) drawLock(run.flatMap(i => [lock.P[2 * i], lock.P[2 * i + 1]]), run.map(i => lock.ws[i])); run = []; };
        for (let i = lock.n0; i < lock.ws.length; i++) { if (lock.front[i - lock.n0]) { if (!run.length && i > lock.n0) run.push(i - 1); run.push(i); } else { if (run.length) run.push(i); flush(); } } flush(); }
      // ---- peonies in the two near corners (in front of everything), swaying
      [[30, 1], [W - 30, -1]].forEach(([x0, s2], ci) => { for (let k = 0; k < 3; k++) { const x = x0 + s2 * k * 26, sw = 6 * Math.sin(t * 2 + k + ci * 2), top = [x + sw + s2 * 8, H - 70 - 26 * k];
          fillPath(g, swell(XY.RIG.spline([x, H, x + sw * 0.4, H - 40, top[0], top[1]], false, 6), 4, 6, 3), '#3d7763');
          [[-1, 0.8], [1, 0.6]].forEach(([d, a]) => fillPath(g, swell(XY.RIG.spline([x, H - 20, x + d * 26, H - 44 - 10 * k, x + d * 40, H - 36 - 10 * k], false, 6), 2, 14, 1), '#5f8a5a'));
          for (let j = 0; j < 7; j++) { const a = j / 7 * TAU + sw * 0.05, r = 15; const P = XY.ellipse(top[0] + Math.cos(a) * r * 0.7, top[1] + Math.sin(a) * r * 0.55, 13, 9, 12, a); XY.path(g, P, true); g.fillStyle = k % 2 ? '#e6aaa5' : '#d9706a'; g.fill(); g.strokeStyle = LINE; g.lineWidth = 1.2; g.stroke(); }
          for (let j = 0; j < 4; j++) { const a = j / 4 * TAU + 0.4; XY.path(g, XY.ellipse(top[0] + Math.cos(a) * 5, top[1] + Math.sin(a) * 4, 8, 6, 10, a), true); g.fillStyle = '#ebb8b2'; g.fill(); g.stroke(); }
          g.fillStyle = GOLD; g.beginPath(); g.arc(top[0], top[1], 4, 0, TAU); g.fill(); } });
      // ---- peony petals: a few always drifting, a burst when the hair closes round him
      const burst = K.hit(beat, BIND, 0.9), mc = K.at(e, 'monk.chest', acts, xf);
      for (let k = 0; k < 34; k++) { const isB = k < 22; if (isB && burst < 0.02) continue; const life = isB ? 1 - burst : (t * 0.12 + XY.hash(k, 3)) % 1;
        const x = isB ? mc[0] + (XY.hash(k, 4) - 0.5) * 60 + (XY.hash(k, 5) - 0.5) * 300 * life : XY.hash(k, 6) * W + 40 * Math.sin(t + k), y = isB ? mc[1] - 260 * life + 140 * life * life : 30 + life * 640;
        g.save(); g.translate(x, y); g.rotate(t * (1 + XY.hash(k, 7)) + k); g.scale(1, 0.5 + 0.5 * Math.abs(Math.sin(t * 3 + k))); g.globalAlpha = isB ? Math.min(1, burst * 2) : 0.85;
        g.fillStyle = k % 3 ? '#e6aaa5' : '#d9706a'; g.beginPath(); g.ellipse(0, 0, 7, 4.5, 0, 0, TAU); g.fill(); g.strokeStyle = 'rgba(78,51,32,0.6)'; g.lineWidth = 0.8; g.stroke(); g.restore(); }
      // ---- the gold frame draws itself in as the panel arrives
      frame(g, W, H, XY.clamp(K.ramp(u, -0.4, 0.08) * 1.02));
    },
  };
})();
