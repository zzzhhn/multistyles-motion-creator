// 37 蓝晒 · 1840 年 · 身落天河 — 第四十八回：灵感大王一夜冻住通天河，商旅踏冰西去，唐僧踏冰过河，行至河心冰裂，
// 三人一马落水，悟空纵身跳在空中，唐僧被金鱼精拖进水底。整幅是一张阿特金斯式的蓝晒照相底片：普鲁士蓝底、
// 物体是白色负像、药膜边缘刷痕晕开；入场时一道清水把未冲洗的黄绿药膜冲成蓝色。队伍是贴在感光纸上的白色剪影。
(() => {
  'use strict';
  const XY = window.XY, K = XY.KIT_E, TAU = XY.TAU;
  const HZ = 452, SLAB = 700, WL = 710, CRACK = 4.5, GRAB = 5.3, CREAK = [2.6, 3.4];
  const PAPER = '#EEEADB', B0 = '#0B2457', B1 = '#123A7C', B2 = '#1E4E95', B3 = '#3C6EAF', B4 = '#8DB0D8', WH = '#F2F5EE';
  const T0 = '#F3F5EE', T1 = '#D4E2EE', T2 = '#A9C4E0', T3 = '#5F88BF';
  const TONE = { horse: T0, mane: T1, horse2: T1, skull: T0, bundle: T1, face: T0, skin: T0, skin2: T0, pig: T0, gold: '#FFFFFF', metal: T1,
    robe: T1, wkshirt: T1, ssrobe: T1, kasaya: T2, red: T2, tiger: T1, ssrobe2: T2, bjrobe: T2, bjpants: T2, fur: T2, pig2: T1, saddle: T2,
    wood: T2, staff: T1, ssh: T2, ssbeard: T2, ink: T3, stripe: T3, hoof: T2 };
  const PEN = { color: r => TONE[r] || T1, shade: 'rgba(30,78,149,0.16)' };

  // ------------------------------------------------------------ static pieces
  const coat = (W, H) => { const p = [], m = (x, s) => 11 + 7 * XY.noise1(x / 70, s) + 3 * XY.noise1(x / 11, s + 5);
    for (let x = 0; x <= W; x += 12) p.push(x, m(x, 1)); for (let y = 0; y <= H; y += 12) p.push(W - m(y, 2), y);
    for (let x = W; x >= 0; x -= 12) p.push(x, H - m(x, 3)); for (let y = H; y >= 0; y -= 12) p.push(m(y, 4), y); return p; };
  const frond = (g, x, y, a, len, w, d, R) => {
    const x1 = x + Math.cos(a) * len, y1 = y + Math.sin(a) * len, b = (R() - 0.5) * 0.6;
    g.lineWidth = w; g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo((x + x1) / 2 + Math.sin(a) * len * b * 0.4, (y + y1) / 2 - Math.cos(a) * len * b * 0.4, x1, y1); g.stroke();
    if (d <= 0) { g.beginPath(); g.ellipse(x1, y1, 3.4, 1.5, a, 0, TAU); g.fill(); return; }
    const n = R() < 0.3 ? 3 : 2; for (let k = 0; k < n; k++) frond(g, x1, y1, a + (k - (n - 1) / 2) * (0.42 + R() * 0.3) + b * 0.4, len * (0.7 + R() * 0.14), w * 0.74, d - 1, R);
  };
  const frondSprite = (S, k) => XY.keep(`c37fr${k}:${S.toFixed(3)}`, 300 * S, 360 * S, cv => { const g = cv.getContext('2d'); g.scale(S, S); g.lineCap = 'round';
    g.strokeStyle = 'rgba(243,245,238,0.8)'; g.fillStyle = 'rgba(243,245,238,0.75)'; frond(g, 150, 0, Math.PI / 2 + (k ? 0.12 : -0.1), k ? 50 : 58, k ? 3.2 : 4, 6, XY.rng(37 + k)); });
  // a lotus stem from Guanyin's pond as a photogram: veined round leaf, seed pod or flower, translucent overlaps (300×360, hangs from the top)
  const lotusSprite = (S, k) => XY.keep(`c37lo${k}:${S.toFixed(3)}`, 300 * S, 360 * S, cv => { const g = cv.getContext('2d'), R = XY.rng(370 + k); g.scale(S, S); g.lineCap = 'round';
    const W0 = 'rgba(243,245,238,'; g.strokeStyle = W0 + '0.85)'; g.lineWidth = 3; g.beginPath(); g.moveTo(150, 0); g.bezierCurveTo(140, 90, 170, 160, 150, k ? 250 : 210); g.stroke();
    g.beginPath(); g.moveTo(150, 30); g.bezierCurveTo(110, 90, 80, 120, 70, 150); g.stroke();
    const leaf = (x, y, r) => { g.fillStyle = W0 + '0.32)'; g.beginPath(); g.ellipse(x, y, r, r * 0.8, -0.3, 0, TAU); g.fill(); g.strokeStyle = W0 + '0.7)'; g.lineWidth = 1.2;
      for (let j = 0; j < 14; j++) { const a = j / 14 * TAU; g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(a) * r * 0.95, y + Math.sin(a) * r * 0.76); g.stroke(); } g.lineWidth = 2; g.beginPath(); g.ellipse(x, y, r, r * 0.8, -0.3, 0, TAU); g.stroke(); };
    leaf(74, 186, 62);
    if (k) { for (let j = 0; j < 8; j++) { const a = -Math.PI / 2 + (j - 3.5) * 0.36, r = 30 + 6 * R(); g.fillStyle = W0 + '0.4)'; g.beginPath(); g.ellipse(150 + Math.cos(a) * r * 0.6, 280 + Math.sin(a) * r * 0.6, 9, r * 0.6, a + Math.PI / 2, 0, TAU); g.fill(); }
      g.fillStyle = W0 + '0.9)'; g.beginPath(); g.ellipse(150, 282, 12, 16, 0, 0, TAU); g.fill(); }
    else { g.fillStyle = W0 + '0.85)'; g.beginPath(); g.moveTo(126, 214); g.lineTo(174, 214); g.lineTo(162, 246); g.lineTo(138, 246); g.closePath(); g.fill();
      g.fillStyle = 'rgba(30,78,149,0.6)'; for (let j = 0; j < 7; j++) { g.beginPath(); g.arc(136 + (j % 4) * 9 + (j > 3 ? 4 : 0), 222 + (j > 3 ? 9 : 0), 2.6, 0, TAU); g.fill(); } } });
  // 灵感大王 as a photogram goldfish (facing left), 440×240, body centre (200,120)
  const fishSprite = S => XY.keep(`c37fish:${S.toFixed(3)}`, 440 * S, 240 * S, cv => { const g = cv.getContext('2d'); g.scale(S, S); g.lineCap = 'round';
    for (let k = 0; k < 5; k++) { const a = -0.75 + k * 0.38; g.fillStyle = 'rgba(243,245,238,0.28)';
      g.beginPath(); g.moveTo(300, 120); g.bezierCurveTo(330 + Math.cos(a) * 60, 120 + Math.sin(a) * 90, 380 + Math.cos(a) * 70, 120 + Math.sin(a) * 120, 420, 120 + Math.sin(a) * 110); g.bezierCurveTo(400, 120 + Math.sin(a) * 50, 350, 120 + Math.sin(a) * 30, 300, 120); g.fill();
      g.strokeStyle = 'rgba(243,245,238,0.5)'; g.lineWidth = 1; for (let j = 0; j < 6; j++) { const q = a + (j - 2.5) * 0.06; g.beginPath(); g.moveTo(300, 120); g.quadraticCurveTo(350 + Math.cos(q) * 40, 120 + Math.sin(q) * 70, 410, 120 + Math.sin(q) * 105); g.stroke(); } }
    g.fillStyle = 'rgba(243,245,238,0.35)'; K.blob(g, [150, 70, 200, 26, 262, 40, 280, 78, 220, 74]); K.blob(g, [170, 150, 210, 196, 236, 186, 226, 150]);
    g.fillStyle = 'rgba(243,245,238,0.94)'; K.blob(g, [70, 118, 92, 86, 150, 66, 230, 72, 296, 104, 312, 122, 292, 140, 226, 166, 150, 170, 92, 152]);
    g.strokeStyle = 'rgba(60,110,175,0.45)'; g.lineWidth = 1.6;
    for (let r = 0; r < 4; r++) for (let c = 0; c < 8; c++) { const x = 150 + c * 18 + (r % 2) * 9, y = 92 + r * 18; if (y > 160 || x > 290) continue; g.beginPath(); g.arc(x, y, 9, -1.2, 1.2); g.stroke(); }
    g.strokeStyle = 'rgba(30,78,149,0.55)'; g.lineWidth = 2.4; g.beginPath(); g.arc(140, 110, 46, 2.2, 4.1); g.stroke();
    g.fillStyle = WH; g.beginPath(); g.arc(102, 104, 14, 0, TAU); g.fill(); g.fillStyle = B2; g.beginPath(); g.arc(100, 104, 7, 0, TAU); g.fill();
    g.strokeStyle = 'rgba(30,78,149,0.6)'; g.lineWidth = 2; g.beginPath(); g.moveTo(72, 124); g.quadraticCurveTo(84, 132, 98, 128); g.stroke(); });
  const slabSprite = (S, W) => XY.keep(`c37slab:${W}:${S.toFixed(3)}`, W * S, 30 * S, cv => { const g = cv.getContext('2d'), R = XY.rng(4); g.scale(S, S);
    g.fillStyle = '#C9DAEA'; g.beginPath(); g.moveTo(0, 3); for (let x = 0; x <= W; x += 10) g.lineTo(x, 2 + 1.6 * XY.noise1(x / 13, 2)); g.lineTo(W, 24); for (let x = W; x >= 0; x -= 10) g.lineTo(x, 22 + 3 * XY.noise1(x / 21, 3)); g.fill();
    for (let i = 0; i < 260; i++) { g.fillStyle = R() < 0.5 ? 'rgba(255,255,255,0.5)' : 'rgba(60,110,175,0.25)'; g.fillRect(R() * W, 3 + R() * 18, 1 + R() * 3, 1 + R() * 9); }
    g.fillStyle = WH; g.fillRect(0, 1, W, 2.4); });
  // crack network from (0,0) spreading over the ice in perspective; each polyline: { pts, d0 } (d0 = delay in 0..1)
  const CRACKS = (() => { const R = XY.rng(4837), o = [];
    const grow = (x, y, a, len, d0, depth) => { const pts = [x, y]; let L = 0; while (L < len) { a += (R() - 0.5) * 0.5; const s = 12 + R() * 10; x += Math.cos(a) * s; y += Math.sin(a) * s * 0.42; pts.push(x, y); L += s;
        if (depth > 0 && R() < 0.12) grow(x, y, a + (R() < 0.5 ? -1 : 1) * (0.5 + R() * 0.6), len * 0.45, d0 + 0.6 * L / len * 0.5, depth - 1); }
      o.push({ pts, d0 }); };
    for (let k = 0; k < 8; k++) grow((R() - 0.5) * 60, 0, -Math.PI + 0.25 + k / 7 * (Math.PI - 0.5) + (R() - 0.5) * 0.2, 220 + R() * 300, 0, 2);
    return o; })();
  const partial = (L, f) => { const n = L.length / 2, m = Math.max(1, (n - 1) * XY.clamp(f)), i = Math.floor(m), o = L.slice(0, 2 * (i + 1)); if (i < n - 1) { const r = m - i; o.push(XY.lerp(L[2 * i], L[2 * i + 2], r), XY.lerp(L[2 * i + 1], L[2 * i + 3], r)); } return o; };
  const crackX = e => XY.procWorldX(e.cell.t0 + CRACK * XY.BEAT) - e.cell.x;

  XY.STYLES.cyanotype = {
    hits: [CRACK, GRAB],
    post(cv, g, e) { const cx = crackX(e); K.punch(cv, g, e, cx, SLAB - 60, 1 + 0.12 * K.env(e.beat, CRACK, 0.2, 1.6)); },
    bg(g, W, H, c, S) {
      const R = XY.rng(3701);
      g.fillStyle = PAPER; g.fillRect(0, 0, W, H);
      for (let i = 0; i < 500; i++) { g.strokeStyle = R() < 0.5 ? 'rgba(150,135,100,0.10)' : 'rgba(255,255,250,0.5)'; g.lineWidth = 0.6; const x = R() * W, y = R() * H, a = R() * TAU; g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(a) * 9, y + Math.sin(a) * 9); g.stroke(); }
      const CP = coat(W, H);
      // brush hairs where the sensitizer was laid on past the coat edge
      g.lineCap = 'round';
      for (let i = 0; i < 160; i++) { const side = i % 4, q = R(), l = 8 + R() * 26; g.strokeStyle = `rgba(18,58,124,${0.25 + R() * 0.45})`; g.lineWidth = 0.8 + R() * 2.2; g.beginPath();
        if (side === 0) { const x = q * W; g.moveTo(x, 14); g.lineTo(x + (R() - 0.5) * 6, 14 - l * 0.5); } else if (side === 2) { const x = q * W; g.moveTo(x, H - 14); g.lineTo(x + (R() - 0.5) * 6, H - 14 + l * 0.5); }
        else if (side === 1) { const y = q * H; g.moveTo(W - 14, y); g.lineTo(W - 14 + l * 0.5, y + (R() - 0.5) * 4); } else { const y = q * H; g.moveTo(14, y); g.lineTo(14 - l * 0.5, y + (R() - 0.5) * 4); } g.stroke(); }
      g.save(); XY.path(g, CP, true); g.clip();
      // sky: Prussian blue, deepest where the sun hit hardest
      let gr = g.createLinearGradient(0, 0, 0, HZ); gr.addColorStop(0, B0); gr.addColorStop(0.7, B1); gr.addColorStop(1, B2); g.fillStyle = gr; g.fillRect(0, 0, W, HZ + 2);
      for (let i = 0; i < 170; i++) { const x = R() * W, y = R() * (HZ - 40), r = 0.6 + Math.pow(R(), 3) * 2.6; g.fillStyle = `rgba(243,245,238,${0.45 + R() * 0.5})`; g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill(); }
      const mx = 905, my = 142; gr = g.createRadialGradient(mx, my, 30, mx, my, 150); gr.addColorStop(0, 'rgba(220,232,244,0.5)'); gr.addColorStop(1, 'rgba(220,232,244,0)'); g.fillStyle = gr; g.fillRect(mx - 160, my - 160, 320, 320);
      g.fillStyle = WH; g.beginPath(); g.arc(mx, my, 40, 0, TAU); g.fill(); g.fillStyle = 'rgba(141,176,216,0.45)'; [[-12, -8, 9], [10, 6, 6], [-4, 14, 5]].forEach(([dx, dy, r]) => { g.beginPath(); g.arc(mx + dx, my + dy, r, 0, TAU); g.fill(); });
      // far bank: mountains, then 陈家庄 as pressed white silhouettes
      g.fillStyle = 'rgba(141,176,216,0.35)'; g.beginPath(); g.moveTo(0, HZ); for (let x = 0; x <= W; x += 16) g.lineTo(x, HZ - 34 - 40 * Math.max(0, XY.noise1(x / 160, 9)) - 14 * XY.noise1(x / 40, 8)); g.lineTo(W, HZ); g.fill();
      g.fillStyle = 'rgba(243,245,238,0.82)';
      const roof = (x, yb, w, rh) => { g.beginPath(); g.moveTo(x - 9, yb + 1); g.quadraticCurveTo(x - 1, yb - 1, x + 5, yb - rh); g.lineTo(x + w - 5, yb - rh); g.quadraticCurveTo(x + w + 1, yb - 1, x + w + 9, yb + 1); g.quadraticCurveTo(x + w / 2, yb - 3, x - 9, yb + 1); g.fill(); };
      for (let k = 0; k < 10; k++) { const big = k === 5, s = big ? 1.8 : 0.8 + 0.4 * XY.hash(k, 4), x = 120 + k * 50 + 16 * XY.hash(k, 1), w = (22 + 12 * XY.hash(k, 2)) * s, h = (8 + 5 * XY.hash(k, 3)) * s, y = HZ - 1;
        g.fillRect(x, y - h, w, h); roof(x, y - h, w, 8 * s); if (big) { g.fillRect(x + w * 0.22, y - h - 8 * s - 8, w * 0.56, 8); roof(x + w * 0.18, y - h - 8 * s - 8, w * 0.64, 7 * s); g.fillRect(x + w / 2 - 1, y - h - 15 * s - 18, 2, 8); }
        g.fillStyle = 'rgba(30,78,149,0.5)'; for (let j = 0; j < (big ? 3 : 1); j++) g.fillRect(x + w * (0.3 + j * 0.2) - 2, y - h * 0.7, 4, h * 0.7); g.fillStyle = 'rgba(243,245,238,0.82)'; }
      g.strokeStyle = 'rgba(243,245,238,0.7)'; [[90, 20], [640, 26], [700, 18], [1010, 24]].forEach(([x, h], k) => { const RR = XY.rng(70 + k); frond(g, x, HZ, -Math.PI / 2, h * 0.5, 2.2, 4, RR); });
      // the frozen river in perspective: plate seams, snow streaks, frost
      gr = g.createLinearGradient(0, HZ, 0, SLAB); gr.addColorStop(0, B2); gr.addColorStop(0.5, B1); gr.addColorStop(1, '#16407F'); g.fillStyle = gr; g.fillRect(0, HZ, W, SLAB - HZ + 2);
      const VP = [W * 0.52, HZ - 70]; g.strokeStyle = 'rgba(141,176,216,0.16)'; g.lineWidth = 1.2;
      for (let x = -900; x <= W + 900; x += 95) { const t0 = (HZ + 3 - VP[1]) / (SLAB - VP[1]); g.beginPath(); g.moveTo(XY.lerp(VP[0], x, t0), HZ + 3); g.lineTo(x, SLAB); g.stroke(); }
      for (let k = 1; k < 9; k++) { const y = HZ + (SLAB - HZ) * Math.pow(k / 9, 1.8); g.globalAlpha = 0.5; g.beginPath(); g.moveTo(0, y); for (let x = 0; x <= W; x += 30) g.lineTo(x, y + 2 * XY.noise1(x / 50, k)); g.stroke(); g.globalAlpha = 1; }
      for (let i = 0; i < 420; i++) { const q = Math.pow(R(), 0.7), y = HZ + 4 + q * (SLAB - HZ - 8), l = (12 + R() * 70) * (0.3 + q), a = 0.04 * (R() - 0.5);
        g.strokeStyle = `rgba(243,245,238,${0.05 + 0.2 * R() * q})`; g.lineWidth = 0.8 + 2.5 * q * R(); const x = R() * W; g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l); g.stroke(); }
      // water below the near ice, with caustic lines
      g.fillStyle = '#0A2150'; g.fillRect(0, SLAB + 18, W, H - SLAB);
      g.strokeStyle = 'rgba(141,176,216,0.18)'; g.lineWidth = 1.4; for (let k = 0; k < 7; k++) { g.beginPath(); for (let x = 0; x <= W; x += 14) { const y = SLAB + 30 + k * 8 + 3 * Math.sin(x / 37 + k * 2); x ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke(); }
      // uneven exposure: blotches and brush streaks in the coat
      for (let i = 0; i < 380; i++) { const x = R() * W, y = R() * H, r = 10 + R() * 60, v = XY.fbm(x / 200, y / 200, 7, 3); g.fillStyle = v > 0 ? `rgba(8,26,70,${0.1 * v})` : `rgba(141,176,216,${-0.08 * v})`; g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill(); }
      for (let i = 0; i < 70; i++) { const y = R() * H, x = R() * W * 0.6; g.strokeStyle = R() < 0.6 ? 'rgba(141,176,216,0.06)' : 'rgba(5,20,60,0.10)'; g.lineWidth = 4 + R() * 16; g.beginPath(); g.moveTo(x, y); g.lineTo(x + 200 + R() * 500, y + (R() - 0.5) * 10); g.stroke(); }
      // the handwritten specimen label, printed white like the rest
      g.fillStyle = WH; g.font = XY.font(78, '"Xingkai SC", "Kaiti SC", serif'); g.textBaseline = 'alphabetic'; g.fillText('天河', 56, 118);
      g.strokeStyle = 'rgba(243,245,238,0.85)'; g.lineWidth = 2; g.beginPath(); g.moveTo(58, 136); g.bezierCurveTo(120, 130, 180, 142, 236, 132); g.stroke();
      g.font = XY.font(30, '"Kaiti SC", serif'); g.fillText('第三十七难', 62, 174);
      g.restore();
      // the coat's soft edge into the paper
      g.save(); XY.path(g, CP, true); g.strokeStyle = 'rgba(30,78,149,0.35)'; g.lineWidth = 5; g.stroke(); g.restore();
      void S; void c;
    },
    draw(g, e) {
      const { W, H, t, u, beat, S } = e, cx = crackX(e), hx0 = cx - 330, hx1 = cx + 135, tau = (beat - CRACK) * XY.BEAT, on = tau >= 0;
      // ---- who sinks, who jumps
      const inHole = x => (on ? XY.clamp((x - hx0) / 40) * XY.clamp((hx1 - x) / 40) : 0), drop = on ? XY.easeOut(tau / 0.28) : 0;
      const sink = (dx, d, k) => { const h = inHole(e.procX + dx) * drop; return h * (d + 2.5 * Math.sin(t * 5.5 + k)); };
      const lp = on ? XY.clamp(tau / 1.05) : 0, pull = inHole(e.procX + 40) * drop * K.ramp(beat, GRAB - 0.1, GRAB + 0.3) * (1 - 0.7 * K.ramp(beat, GRAB + 0.9, GRAB + 1.7));   // the demon drags at the master
      const F = K.fig(e, 'monk', {}), sad = F.anchors.saddle;
      const xf = { shaseng: { dy: sink(-300, 60, 1) }, bajie: { dy: sink(-150, 50, 2) }, monk: { dy: sink(40, 58, 3) },
        'monk.rider': { dy: 30 * pull, rot: -0.22 * pull + 0.05 * pull * Math.sin(t * 9), px: sad[0], py: sad[1] }, wukong: { dy: -175 * Math.sin(Math.PI * lp) } };
      const acts = { monk: { palm: K.ramp(beat, CRACK - 0.6, CRACK - 0.1) }, wukong: { shade: Math.max(K.ramp(beat, 1.8, 2.3) * (1 - K.ramp(beat, 3.3, 3.8)), on ? K.ramp(tau, 0.12, 0.4) * (1 - K.ramp(u, 0.93, 1.05)) : 0) },
        bajie: { scratch: K.ramp(u, 0.64, 0.72) * (1 - K.ramp(u, 0.92, 1)) }, shaseng: { lift: XY.clamp(inHole(e.procX - 300) * drop * 1.4) } };
      // ---- far: twinkling stars, merchants pushing carts west over the ice
      for (let k = 0; k < 14; k++) { const x = XY.hash(k, 71) * W, y = 30 + XY.hash(k, 72) * (HZ - 120), a = 0.5 + 0.5 * Math.sin(t * (1.5 + 2 * XY.hash(k, 73)) + k * 2), r = 2 + 5 * a;
        g.strokeStyle = `rgba(243,245,238,${0.3 + 0.6 * a})`; g.lineWidth = 1.2; g.beginPath(); g.moveTo(x - r, y); g.lineTo(x + r, y); g.moveTo(x, y - r); g.lineTo(x, y + r); g.stroke(); }
      g.fillStyle = 'rgba(243,245,238,0.85)'; g.strokeStyle = 'rgba(243,245,238,0.85)'; g.lineWidth = 1.6;
      for (let k = 0; k < 5; k++) { const sp = 11 + 4 * XY.hash(k, 81), x = ((XY.hash(k, 82) * (W + 160) + t * sp) % (W + 160)) - 80, y = HZ + 14 + k * 7, s = 0.55 + k * 0.1, st = Math.sin(t * 6 + k) * 3 * s;
        g.beginPath(); g.arc(x, y - 22 * s, 3.2 * s, 0, TAU); g.fill(); g.fillRect(x - 3 * s, y - 19 * s, 6 * s, 11 * s);
        g.beginPath(); g.moveTo(x, y - 8 * s); g.lineTo(x - st, y); g.moveTo(x, y - 8 * s); g.lineTo(x + st, y); g.stroke();
        if (k % 2) { g.fillRect(x + 6 * s, y - 13 * s, 18 * s, 9 * s); g.beginPath(); g.arc(x + 15 * s, y - 2 * s, 3 * s, 0, TAU); g.fill(); }
        else { g.beginPath(); g.moveTo(x - 14 * s, y - 18 * s); g.lineTo(x + 14 * s, y - 18 * s); g.stroke(); g.fillRect(x - 17 * s, y - 16 * s, 6 * s, 7 * s); g.fillRect(x + 11 * s, y - 16 * s, 6 * s, 7 * s); } }
      // ---- the goldfish demon under the ice: lurking, then turning away with the master in its mouth
      { const fs = fishSprite(S); let x, y, sc, dir;
        if (beat < CRACK - 0.1) { x = XY.lerp(W + 280, cx + 320, XY.easeOut(XY.clamp((beat + 4) / 6))) - 350 * XY.smooth((beat - 2.2) / 2.1); y = 590 + 26 * XY.smooth((beat - 2.2) / 2.1) + 10 * Math.sin(t * 1.7); sc = 0.95; dir = 1; }
        else { const q = XY.clamp((beat - 5.6) / 2.6), m = XY.smooth(q); x = XY.lerp(cx + 40, W + 140, m); y = XY.lerp(622, 500, XY.easeOut(q)); sc = XY.lerp(0.95, 0.45, XY.easeOut(q)); dir = -1; }
        const wig = 0.05 * Math.sin(t * 5);
        g.save(); g.translate(x, y); g.rotate(wig); g.scale(sc * dir, sc); g.globalAlpha = 0.5; g.drawImage(fs, -200, -120, 440, 240); g.restore();
      }
      // ---- creaking before the break: a thump under the ice, two hairline cracks just ahead of the horse
      { const th = K.bump(beat, 3.1, 0.45); if (th > 0) { const rg = g.createRadialGradient(cx + 60, 650, 4, cx + 60, 650, 200); rg.addColorStop(0, `rgba(243,245,238,${0.8 * th})`); rg.addColorStop(1, 'rgba(243,245,238,0)'); g.fillStyle = rg; g.fillRect(cx - 140, 560, 400, 150);
          const f = XY.clamp((beat - 2.75) / 0.8); g.strokeStyle = `rgba(243,245,238,${0.9 * (1 - f)})`; g.lineWidth = 3; g.beginPath(); g.ellipse(cx + 60, 668, 30 + 190 * f, 8 + 40 * f, 0, 0, TAU); g.stroke(); }
        if (!on) CREAK.forEach((b0, i) => { const f = XY.clamp((beat - b0) / 0.25); if (f <= 0) return; g.save(); g.translate(cx + 60, SLAB - 2); g.scale(0.5 + 0.22 * i, 0.5 + 0.22 * i);
          CRACKS.slice(i * 3, i * 3 + 4).forEach(c => { g.strokeStyle = 'rgba(243,245,238,0.95)'; g.lineWidth = 3.6; XY.path(g, partial(c.pts, f), false); g.stroke(); }); g.restore(); }); }
      // ---- the crack races over the ice like a pressed alga
      if (on) { g.save(); g.translate(cx, SLAB - 2); g.lineCap = 'round';
        CRACKS.forEach(c => { const f = XY.clamp((tau - c.d0 * 0.3) / 0.32); if (f <= 0) return; const p = partial(c.pts, f);
          g.strokeStyle = 'rgba(8,26,70,0.7)'; g.lineWidth = 2.2; g.save(); g.translate(1.2, 1.4); XY.path(g, p, false); g.stroke(); g.restore();
          g.strokeStyle = `rgba(243,245,238,${0.95 - 0.3 * XY.clamp((tau - 1) / 2)})`; g.lineWidth = 1.8; XY.path(g, p, false); g.stroke(); });
        const fl = K.hit(beat, CRACK, 5); if (fl > 0.01) { const rg = g.createRadialGradient(0, 0, 4, 0, 0, 260); rg.addColorStop(0, `rgba(243,245,238,${0.7 * fl})`); rg.addColorStop(1, 'rgba(243,245,238,0)'); g.fillStyle = rg; g.fillRect(-260, -140, 520, 160); }
        g.restore(); }
      // ---- the procession as white photograms: soft penumbra under a crisp print, mottled exposure
      { const L = K.procLayer('c37', e, 480, 100); K.drawProc(L.g, e, PEN, acts, { xf });
        const wk = K.at(e, 'wukong.head', acts, xf); if (on && lp < 1) { const c = Math.sin(Math.PI * lp); L.g.fillStyle = `rgba(243,245,238,${0.75 * c})`; K.blob(L.g, [wk[0] - 50, wk[1] + 110, wk[0] - 20, wk[1] + 92, wk[0] + 20, wk[1] + 96, wk[0] + 48, wk[1] + 112, wk[0] + 10, wk[1] + 122, wk[0] - 30, wk[1] + 120]); }
        K.pat(L, K.grainTile('c37mot', S, 200, 46, ['rgba(30,78,149,0.10)', 'rgba(60,110,175,0.09)', 'rgba(255,255,255,0.08)'], 8, 24, 37), 'source-atop');
        K.soft(g, L, 8, 'source-over', 0.5); K.put(g, L); }
      // ---- near ice: the slab in section, broken open over the hole
      const sl = slabSprite(S, W);
      if (!on) g.drawImage(sl, 0, SLAB - 2, W, 30);
      else {
        g.drawImage(sl, 0, 0, hx0 * S, sl.height, 0, SLAB - 2, hx0, 30); g.drawImage(sl, hx1 * S, 0, (W - hx1) * S, sl.height, hx1, SLAB - 2, W - hx1, 30);
        g.fillStyle = 'rgba(10,33,80,0.62)'; g.fillRect(hx0, WL, hx1 - hx0, H - WL);
        g.strokeStyle = 'rgba(243,245,238,0.75)'; g.lineWidth = 1.6; g.beginPath(); for (let x = hx0; x <= hx1; x += 8) { const y = WL + 2 * Math.sin(x / 19 + t * 4) + 1.2 * Math.sin(x / 7 - t * 7); x === hx0 ? g.moveTo(x, y) : g.lineTo(x, y); } g.stroke();
        [-300, -150, 40].forEach((dx, k) => { const x = e.procX + dx; if (inHole(x) < 0.3) return; for (let j = 0; j < 2; j++) { const f = (t * 0.9 + j * 0.5 + k * 0.3) % 1;
          g.strokeStyle = `rgba(243,245,238,${0.6 * (1 - f)})`; g.lineWidth = 1.3; g.beginPath(); g.ellipse(x, WL + 2, 24 + 60 * f, 4 + 6 * f, 0, 0, TAU); g.stroke(); } });
        for (let k = 0; k < 5; k++) { const x = XY.lerp(hx0 + 30, hx1 - 30, (k + 0.5) / 5) + 6 * Math.sin(t + k) + 30 * (XY.hash(k, 6) - 0.5), sgn = k % 2 ? 1 : -1, w = 22 + 20 * XY.hash(k, 5);
          const y = SLAB + 2 + 9 * XY.easeOut(tau / 0.45) + 1.6 * Math.sin(t * 2.6 + k), r = sgn * (0.7 * Math.exp(-tau * 2.2) + 0.1 + 0.05 * Math.sin(t * 1.9 + k));
          g.save(); g.translate(x, y); g.rotate(r); g.fillStyle = 'rgba(214,228,240,0.7)'; g.beginPath(); g.moveTo(-w / 2, -6); g.lineTo(w / 2 - 4, -8); g.lineTo(w / 2, 4); g.lineTo(-w / 2 + 5, 7); g.fill();
          g.fillStyle = WH; g.fillRect(-w / 2, -7, w - 4, 2); g.restore(); }
        [hx0, hx1].forEach((x, k) => { const s = k ? 1 : -1; g.fillStyle = '#C9DAEA'; g.beginPath(); g.moveTo(x, SLAB); g.lineTo(x - s * 6, SLAB + 9); g.lineTo(x + s * 4, SLAB + 14); g.lineTo(x - s * 3, SLAB + 22); g.lineTo(x + s * 14, SLAB + 22); g.lineTo(x + s * 14, SLAB); g.fill(); });
        if (tau < 1.4) for (let k = 0; k < 80; k++) { const x0 = XY.lerp(hx0, hx1, XY.hash(k, 91)), vy = 230 + 420 * XY.hash(k, 92), vx = (XY.hash(k, 93) - 0.5) * 180, y = WL - vy * tau + 520 * tau * tau;
          if (y > WL + 2) continue; const r = 1.4 + 3 * XY.hash(k, 94); g.fillStyle = `rgba(243,245,238,${0.9 - 0.4 * tau})`; g.beginPath(); g.arc(x0 + vx * tau, y, r, 0, TAU); g.fill(); }
        const bub = XY.clamp(tau / 0.4) * (1 - XY.clamp((tau - 2.5) / 1)); if (bub > 0) for (let k = 0; k < 16; k++) { const f = (t * 0.7 + XY.hash(k, 95)) % 1, x = cx + 40 + (XY.hash(k, 96) - 0.5) * 60 + 6 * Math.sin(t * 3 + k), y = H + 10 - f * (H + 10 - WL);
          g.strokeStyle = `rgba(243,245,238,${0.7 * bub})`; g.lineWidth = 1.2; g.beginPath(); g.arc(x, y, 2 + 3 * XY.hash(k, 97), 0, TAU); g.stroke(); }
      }
      // ---- the demon breaches: the white goldfish lunges up out of the hole at the master, then drags him down
      { const up = XY.easeOut(K.ramp(beat, GRAB - 0.35, GRAB)) * (1 - XY.easeIn(K.ramp(beat, GRAB + 0.5, GRAB + 1.3))); if (up > 0.01) { const mc = K.at(e, 'monk.chest', acts, xf), c = [mc[0] + 36, mc[1] + 98 + 170 * (1 - up)];
        const fishAt = al => { g.save(); g.globalAlpha = al; g.translate(c[0], c[1]); g.rotate(1.25 + 0.08 * Math.sin(t * 9)); g.scale(0.8, 0.8); g.drawImage(fishSprite(S), -200, -120, 440, 240); g.restore(); };
        g.save(); g.beginPath(); g.rect(hx0, 0, hx1 - hx0, WL + 2); g.clip(); fishAt(0.97); g.restore(); g.save(); g.beginPath(); g.rect(hx0, WL + 2, hx1 - hx0, H); g.clip(); fishAt(0.45); g.restore();
        for (let k = 0; k < 26; k++) { const a = Math.PI + XY.hash(k, 98) * Math.PI, d = 20 + 90 * up * XY.hash(k, 99); g.fillStyle = `rgba(243,245,238,${0.8 * up})`; g.beginPath(); g.arc(c[0] - 30 + Math.cos(a) * d, WL - 4 + Math.sin(a) * d * 0.6, 1.5 + 2.5 * XY.hash(k, 97), 0, TAU); g.fill(); } } }
      // ---- foreground: lotus from Guanyin's pond (where the goldfish came from), pressed as photograms; snow
      [[W - 18, 40, 0], [W - 20, 190, 1]].forEach(([x, y, k]) => { g.save(); g.translate(x, y); g.rotate(1.15 + 0.05 * Math.sin(t * 1.1 + k * 2) + (k ? 0.25 : 0)); g.drawImage(lotusSprite(S, k), -150, 0, 300, 360); g.restore(); });
      g.fillStyle = 'rgba(243,245,238,0.85)';
      for (let k = 0; k < 70; k++) { const sp = 18 + 26 * XY.hash(k, 61), x = (XY.hash(k, 62) * W + 16 * Math.sin(t * 0.8 + k)) % W, y = (XY.hash(k, 63) * H + t * sp) % H, r = 0.8 + 1.8 * XY.hash(k, 64);
        g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill(); }
      // ---- signature entrance: a sheet of clear water washes the yellow-green sensitizer into Prussian blue
      const wf = K.ramp(u, -0.3, 0.08); if (wf < 1) { const fx = XY.lerp(-90, W + 90, wf), edge = y => fx + 22 * Math.sin(y / 46 + 1.3) + 12 * XY.noise1(y / 17, 5);
        g.save(); g.beginPath(); g.moveTo(W + 10, -10); for (let y = -10; y <= H + 10; y += 12) g.lineTo(edge(y), y); g.lineTo(W + 10, H + 10); g.closePath();
        g.globalCompositeOperation = 'color'; g.fillStyle = '#9C9E5E'; g.fill(); g.globalCompositeOperation = 'source-over';
        g.strokeStyle = 'rgba(8,26,70,0.45)'; g.lineWidth = 7; g.beginPath(); for (let y = -10; y <= H + 10; y += 12) { const x = edge(y) - 3; y < 0 ? g.moveTo(x, y) : g.lineTo(x, y); } g.stroke();
        g.restore(); }
    },
  };
})();
