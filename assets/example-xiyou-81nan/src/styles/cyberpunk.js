// 64 赛博朋克霓虹 · 1982 年 · 请佛收魔 — 狮驼城 as a rain-soaked neon megacity. The 大鹏金翅雕 waits on a tower
// top as a dead sign; the city's neon stutters on; the roc dives at Tang Seng and, on beat 2, a golden neon hand of
// the Buddha stabs down through the smog and touches it: flash, shock ring, the roc locked in a ring of 佛光, its
// wings shorting like failing tubes, carried off on the fingertip ("只在佛顶上，不能远遁").
// Pilgrims: night-darkened colours, cyan and magenta rim light, a gold top light under the Buddha, wet reflections.
(() => {
  'use strict';
  const XY = window.XY, K = XY.KIT_H, TAU = XY.TAU, { sin, cos, PI } = Math;
  const CY = '#46F0FF', MG = '#FF3CA8', VI = '#9A6BFF', AM = '#FFB040', GD = '#FFD45A';
  const GY = 702, HZ = 640;

  const NIGHT = { fur: '#5E3C3C', face: '#C49484', wkshirt: '#962848', tiger: '#B87632', stripe: '#120A10', gold: '#FFD25A', staff: '#C8203E', ink: '#0A0610',
    horse: '#BEB8D6', horse2: '#8C86AE', mane: '#AEA8CC', hoof: '#201A28', saddle: '#4E1A2C', red: '#C8203E', robe: '#B49452', kasaya: '#B8203C', skin: '#CCA290',
    metal: '#CCA444', bjrobe: '#1C1E30', bjpants: '#151722', pig: '#C68C96', pig2: '#A46A76', wood: '#5E3C2A', ssrobe: '#26405A', ssrobe2: '#1C2C3E',
    skin2: '#8E6652', ssh: '#962C32', ssbeard: '#7E2428', skull: '#DCD4E6', bundle: '#9E7C3C' };
  const PEN = K.pen(NIGHT, '#05030C', 1.2);
  const SIL = { color: () => '#000' };

  // ------------------------------------------------------------ static city
  const towers = W => { const R = XY.rng(6401), o = []; let x = -30;
    while (x < W + 40) { const w = 46 + R() * 80, h = 220 + R() * 330, top = HZ - h; o.push({ x, w, top, ant: R() < 0.35, step: R() < 0.4, seed: Math.floor(R() * 1e6) }); x += w * (0.7 + R() * 0.5); }
    return o; };
  const MID = [[-10, 300, 190], [175, 380, 150], [330, 340, 120], [455, 420, 140], [600, 360, 130], [735, 400, 160], [900, 330, 135], [1040, 390, 160]];

  const drawCity = (g, W) => {
    let gr = g.createLinearGradient(0, 0, 0, HZ); gr.addColorStop(0, '#05041A'); gr.addColorStop(0.45, '#170C3A'); gr.addColorStop(0.8, '#3A1450'); gr.addColorStop(1, '#5C1A58');
    g.fillStyle = gr; g.fillRect(0, 0, W, GY);
    // smog clouds lit from below
    const R = XY.rng(64);
    for (let k = 0; k < 26; k++) { const x = R() * W, y = 40 + R() * 260, rx = 120 + R() * 220, ry = 18 + R() * 30, rg = g.createRadialGradient(x, y + ry, 2, x, y, rx);
      rg.addColorStop(0, `rgba(${R() < 0.5 ? '190,60,160' : '90,70,200'},${0.10 + 0.08 * R()})`); rg.addColorStop(1, 'rgba(40,10,60,0)'); g.fillStyle = rg; g.beginPath(); g.ellipse(x, y, rx, ry, 0, 0, TAU); g.fill(); }
    // far megatowers with window grids
    towers(W).forEach(T => {
      g.fillStyle = '#120C2C'; g.fillRect(T.x, T.top, T.w, HZ - T.top + 2);
      if (T.step) g.fillRect(T.x + T.w * 0.2, T.top - 40, T.w * 0.6, 42);
      g.fillStyle = '#251A52'; g.fillRect(T.x, T.top, 3, HZ - T.top);
      if (T.ant) { g.strokeStyle = '#2A2050'; g.lineWidth = 2; g.beginPath(); g.moveTo(T.x + T.w / 2, T.top - (T.step ? 40 : 0)); g.lineTo(T.x + T.w / 2, T.top - 90); g.stroke(); }
      const r = XY.rng(T.seed);
      for (let y = T.top + 8; y < HZ - 6; y += 9) for (let x = T.x + 5; x < T.x + T.w - 5; x += 6) { const v = r(); if (v > 0.24) continue;
        g.fillStyle = v < 0.05 ? 'rgba(255,190,110,0.75)' : v < 0.11 ? 'rgba(120,230,255,0.55)' : 'rgba(255,120,200,0.45)'; g.fillRect(x, y, 2.6, 3.4); }
    });
    // ground haze in front of the far city
    gr = g.createLinearGradient(0, HZ - 160, 0, HZ + 10); gr.addColorStop(0, 'rgba(120,40,140,0)'); gr.addColorStop(1, 'rgba(150,50,150,0.55)'); g.fillStyle = gr; g.fillRect(0, HZ - 160, W, 170);
    // mid street blocks
    MID.forEach(([x, top, w], i) => {
      const r = XY.rng(6420 + i);
      g.fillStyle = i % 2 ? '#0B0918' : '#0E0B1E'; g.fillRect(x, top, w, GY - top);
      g.fillStyle = 'rgba(70,240,255,0.10)'; g.fillRect(x, top, 2, GY - top); g.fillStyle = 'rgba(255,60,168,0.10)'; g.fillRect(x + w - 2, top, 2, GY - top);
      g.fillStyle = '#17132C'; g.fillRect(x - 4, top - 6, w + 8, 8);
      for (let y = top + 26; y < GY - 70; y += 54) {
        for (let wx = x + 14; wx < x + w - 34; wx += 40) { const lit = r() < 0.45, warm = r() < 0.6;
          g.fillStyle = lit ? (warm ? 'rgba(255,170,90,0.55)' : 'rgba(120,200,255,0.45)') : '#08060F'; g.fillRect(wx, y, 26, 30);
          if (lit) { g.fillStyle = 'rgba(0,0,0,0.45)'; for (let s = 0; s < 30; s += 5) g.fillRect(wx, y + s, 26, 1.6); }
          g.strokeStyle = '#1E1838'; g.lineWidth = 1.5; g.strokeRect(wx, y, 26, 30); }
        if (r() < 0.55) { const ax = x + 8 + r() * (w - 48); g.fillStyle = '#221C3A'; g.fillRect(ax, y + 34, 34, 18); g.strokeStyle = '#3A3060'; g.lineWidth = 1.2;
          g.beginPath(); g.arc(ax + 11, y + 43, 6, 0, TAU); g.stroke(); g.beginPath(); g.moveTo(ax + 5, y + 43); g.lineTo(ax + 17, y + 43); g.stroke(); }
      }
      if (i === 2 || i === 5) { g.strokeStyle = '#2A2244'; g.lineWidth = 2; for (let y = top + 60; y < GY - 60; y += 54) { g.beginPath(); g.moveTo(x + 6, y); g.lineTo(x + w - 6, y + 40); g.stroke(); g.strokeRect(x + 4, y + 40, w - 8, 3); } }
      g.fillStyle = '#05040B'; g.fillRect(x + w * 0.3, GY - 64, Math.min(54, w * 0.4), 64);
    });
    // overhead cables
    g.strokeStyle = 'rgba(10,6,20,0.9)'; g.lineWidth = 2;
    [[0, 250, W, 300, 60], [0, 330, W, 280, 40], [180, 300, 760, 360, 30]].forEach(([x0, y0, x1, y1, sag]) => { g.beginPath(); g.moveTo(x0, y0); g.quadraticCurveTo((x0 + x1) / 2, (y0 + y1) / 2 + sag, x1, y1); g.stroke(); });
    // wet street: dark asphalt, sheen, curb
    gr = g.createLinearGradient(0, GY, 0, 780); gr.addColorStop(0, '#120C22'); gr.addColorStop(1, '#06040C'); g.fillStyle = gr; g.fillRect(0, GY, W, 80);
    for (let k = 0; k < 80; k++) { const x = R() * W, y = GY + 6 + R() * 70, w = 20 + R() * 120; g.fillStyle = `rgba(${R() < 0.5 ? '70,240,255' : '255,60,168'},${0.04 + 0.06 * R()})`; g.fillRect(x, y, w, 1.5); }
  };
  // the 狮驼 spire the roc perches on, drawn over the far city
  const drawSpire = g => {
    g.fillStyle = '#100A26'; g.beginPath(); g.moveTo(226, HZ); g.lineTo(232, 210); g.lineTo(248, 168); g.lineTo(282, 168); g.lineTo(298, 210); g.lineTo(304, HZ); g.fill();
    g.fillStyle = '#1A1238'; for (let k = 0; k < 3; k++) { const y = 230 + k * 120; g.beginPath(); g.moveTo(214, y + 16); g.lineTo(265, y - 4); g.lineTo(316, y + 16); g.lineTo(304, y + 22); g.lineTo(226, y + 22); g.fill(); }
    g.fillStyle = 'rgba(255,190,110,0.6)'; for (let y = 250; y < HZ - 10; y += 14) { g.fillRect(244, y, 3, 5); if (y % 28 < 14) g.fillRect(282, y, 3, 5); }
  };

  // ------------------------------------------------------------ neon signs as cached sprites (lit at full strength)
  const SIGNS = [   // text, colour, vertical, glyph px, x, y, fill(true) or tube outline(false)
    ['狮驼', CY, true, 40, 126, 322, true], ['青狮', CY, true, 34, 338, 478, true], ['白象', '#FFD0F4', false, 30, 724, 492, true], ['佛', GD, false, 34, 934, 352, true],
    ['收魔', MG, true, 72, 1060, 396, false]];
  const PAD = 26;
  const signSize = s => { const n = s[0].length, px = s[3]; return s[2] ? [px * 1.36, px * 1.12 * n + px * 0.42] : [px * 1.12 * n + px * 0.6, px * 1.5]; };
  const signSprite = (i, S) => { const s = SIGNS[i], [w, h] = signSize(s);
    return XY.keep(`cp-sign:${i}:${S.toFixed(4)}`, (w + 2 * PAD) * S, (h + 2 * PAD) * S, cv => {
      const g = cv.getContext('2d'); g.scale(S, S); g.translate(PAD, PAD);
      g.fillStyle = 'rgba(8,4,18,0.88)'; g.fillRect(0, 0, w, h);
      g.shadowColor = s[1]; g.shadowBlur = 12 * S; g.strokeStyle = s[1]; g.lineWidth = 2.4; g.strokeRect(3, 3, w - 6, h - 6);
      g.font = XY.font(s[3], XY.cnFont.hei, '900'); g.textAlign = 'center'; g.textBaseline = 'middle';
      const at = k => s[2] ? [w / 2, s[3] * 0.72 + k * s[3] * 1.12] : [s[3] * 0.86 + k * s[3] * 1.12, h / 2 + 1];
      for (let pass = 0; pass < 2; pass++) for (let k = 0; k < s[0].length; k++) { const [x, y] = at(k);
        if (s[6]) { g.fillStyle = pass ? '#FFF6FB' : s[1]; g.globalAlpha = pass ? 0.55 : 1; g.fillText(s[0][k], x, y); }
        else { g.strokeStyle = pass ? '#FFF2FA' : s[1]; g.lineWidth = pass ? 1.6 : 5; g.fillStyle = 'rgba(255,60,168,0.16)'; if (!pass) g.fillText(s[0][k], x, y); g.strokeText(s[0][k], x, y); } }
    }); };
  // 青狮 and 白象 were taken by 文殊 and 普贤 in the same chapter: their signs short out and die before the roc moves
  const DEATH = { 1: 0.22, 2: 0.31 };
  const signLit = (k, u, t) => { const u0 = -0.03 + 0.04 * k;
    if (u < u0 - 0.06) return 0.1; if (u < u0) return XY.hash(Math.floor(t * 24), k, 3) < 0.5 ? 1 : 0.1;
    const d = DEATH[k]; if (d != null && u >= d) return u < d + 0.04 ? (XY.hash(Math.floor(t * 30), k, 5) < 0.45 ? 1.2 : 0.1) : 0.08;
    if (k === 3 && XY.hash(Math.floor(t * 9), 7) < 0.25) return 0.25; return 1; };

  // ------------------------------------------------------------ the Buddha's hand (fingertip at the origin, pointing +y)
  const HAND = [0, 6, 14, -4, 18, -50, 20, -112, 34, -108, 50, -114, 60, -132, 58, -150, 70, -150, 82, -162, 84, -182, 92, -186, 100, -200, 98, -224,
    104, -260, 100, -310, 92, -360, -56, -360, -62, -300, -60, -258, -78, -236, -98, -206, -100, -182, -86, -170, -60, -180, -36, -158, -20, -112, -16, -52, -12, -4];
  const CREASE = [[-15, -40, 16, -40], [-17, -80, 18, -80], [20, -112, 36, -128, 52, -146], [58, -150, 72, -168, 84, -182], [-36, -158, -52, -196], [-58, -300, 98, -300]];
  const SLEEVE = [[-58, -360, -90, -520, -130, -900], [94, -360, 140, -520, 190, -900], [-20, -380, -30, -560, -40, -900], [40, -380, 56, -600, 70, -900]];
  const WHEEL = (() => { const o = [XY.ellipse(22, -262, 28, 28, 24).concat([50, -262])]; for (let k = 0; k < 8; k++) { const a = k / 8 * TAU; o.push([22 + cos(a) * 8, -262 + sin(a) * 8, 22 + cos(a) * 26, -262 + sin(a) * 26]); } return o; })();
  // ------------------------------------------------------------ the roc (origin at the body, facing +x); f = wing beat −1…1
  const rocLines = (f, droop, fold) => {
    const L = [[70, -8, 50, -16, 10, -14, -40, -8, -70, 0, -40, 10, 10, 14, 50, 10, 70, 4], [70, -8, 84, -14, 96, -10, 110, -1, 101, 1, 98, 7, 84, 8, 70, 4],
      [80, -14, 66, -36], [88, -13, 84, -32], [-70, 0, -134, -22, -120, -4, -140, 2, -120, 8, -134, 24, -70, 4], [18, 12, 24, 30, 34, 36], [-2, 12, 2, 30, 12, 36]];
    const wing = (ox, oy, a, s) => { const P = [0, 0, 60, -12, 130, -16, 184, 0, 162, 20, 150, 10, 132, 34, 118, 20, 98, 42, 84, 24, 62, 40, 42, 22, 10, 24], o = [];
      for (let k = 0; k < P.length; k += 2) { const x = P[k] * s, y = P[k + 1] * s; o.push(ox + x * cos(a) - y * sin(a), oy + x * sin(a) + y * cos(a)); } return o; };
    const aN = XY.lerp(-PI / 2 - 0.25 + 0.75 * f, fold ? PI - 0.12 : PI * 0.58, droop), aF = XY.lerp(-PI / 2 - 0.75 + 0.6 * f, fold ? PI - 0.02 : PI * 0.68, droop);
    return { body: L, near: wing(18, -12, aN, 1), far: wing(4, -12, aF - 0.2, 0.8) };
  };
  const polys = (c, L, closed) => { c.beginPath(); for (const P of L) { c.moveTo(P[0], P[1]); for (let i = 2; i < P.length; i += 2) c.lineTo(P[i], P[i + 1]); if (closed) c.closePath(); } };
  // a neon stroke on the frame (tube + white-hot core) and, wider, on the quarter-res glow layer G
  const neon = (g, G, xf, L, col, lw, a = 1, closed = false) => {
    for (const [c, w, cc, aa] of [[G, lw * 4.5, col, a], [g, lw * 1.5, col, a], [g, lw * 0.5, '#FFFFFF', a * 0.85]]) {
      c.save(); c.translate(xf[0], xf[1]); c.rotate(xf[2]); c.scale(xf[3], xf[3]); c.globalAlpha = aa; c.strokeStyle = cc; c.lineWidth = w / xf[3];
      c.lineJoin = 'round'; c.lineCap = 'round'; polys(c, L, closed); c.stroke(); c.restore(); } };

  // ------------------------------------------------------------ timeline (cell-local u)
  const TOUCH = 0.5, T_PT = [580, 330], WR = [1120, -200];
  const DIR = (() => { const dx = T_PT[0] - WR[0], dy = T_PT[1] - WR[1], d = Math.hypot(dx, dy); return [dx / d, dy / d]; })(), ROT = Math.atan2(-DIR[0], DIR[1]);
  const handTip = u => { const k = u < TOUCH ? 1 - XY.easeOut((u - 0.38) / (TOUCH - 0.38)) : XY.easeIn((u - 0.72) / 0.25); return [T_PT[0] - DIR[0] * 1150 * k, T_PT[1] - DIR[1] * 1150 * k]; };
  const P0 = [268, 152], CTRL = [300, 430];
  const rocAt = (u, t) => {   // → { x, y, a, s, f, droop, lit }
    if (u < 0.36) { const sp = XY.smooth((u - 0.31) / 0.04);   // perched as a dead sign, lights up, then spreads its wings and screeches
      return { x: P0[0], y: P0[1], a: 0, s: 0.7, f: sp, droop: 1 - sp, fold: true, lit: u < 0.1 ? 0.22 : u < 0.14 ? (XY.hash(Math.floor(t * 30), 5) < 0.5 ? 1 : 0.2) : 1 }; }
    const tip = handTip(u), C = [tip[0] + DIR[0] * 64, tip[1] + DIR[1] * 64];
    if (u < TOUCH) { const q = XY.easeIn((u - 0.36) / (TOUCH - 0.36) * 0.7 + 0.3 * ((u - 0.36) / (TOUCH - 0.36))), m = 1 - q;
      const x = m * m * P0[0] + 2 * m * q * CTRL[0] + q * q * C[0], y = m * m * P0[1] + 2 * m * q * CTRL[1] + q * q * C[1];
      const dx = 2 * m * (CTRL[0] - P0[0]) + 2 * q * (C[0] - CTRL[0]), dy = 2 * m * (CTRL[1] - P0[1]) + 2 * q * (C[1] - CTRL[1]);
      return { x, y, a: 0.6 * Math.atan2(dy, Math.abs(dx) + 1e-3), s: XY.lerp(0.7, 0.95, q), f: sin(t * 15), droop: 0, lit: 1 }; }
    const k = XY.clamp((u - TOUCH) / 0.15), jit = XY.hash(Math.floor(t * 20), 9);   // pinned like a spread eagle, head bowed, tubes shorting
    return { x: C[0], y: C[1], a: 0.22 * k + 0.05 * (jit - 0.5), s: XY.lerp(0.95, 0.88, XY.easeOut(k)), f: 0.62 + 0.18 * (jit - 0.5), droop: 0, pinned: true, lit: jit < 0.15 ? 0.3 : 1 };
  };
  let TW = null;

  XY.STYLES.cyberpunk = {
    hits: [4],
    post(canvas, g, e) { K.zoomPost(canvas, g, e, T_PT[0], T_PT[1] + 60, K.push(e.beat, 3.85, 6.2, 0.13)); },
    bg(g, W) { drawCity(g, W); drawSpire(g); },
    draw(g, e) {
      const { W, H, t, u } = e, S = e.S, Wd = Math.round(W * S), Hd = Math.round(H * S), gy = e.groundY;
      const tT = e.cell.t0 + TOUCH * e.cell.dur, rainT = t < tT ? t : t < tT + 0.6 ? tT : t - 0.6, frz = K.win(t - tT, 0, 0.6, 0.02);
      const gold = K.win(u, 0.48, 0.8, 0.04), flash = u > TOUCH ? Math.exp(-(u - TOUCH) * 55) : 0;
      const Gc = XY.scratch('cp-glow', Wd / 4, Hd / 4), G = Gc.getContext('2d'); G.setTransform(S / 4, 0, 0, S / 4, 0, 0);
      TW = TW || towers(W);
      // searchlights and the smog they cut
      g.save(); g.globalCompositeOperation = 'screen';
      [[150, 0.7, 0], [860, 0.55, 2.1]].forEach(([x, sp, ph], k) => { const a = -PI / 2 + 0.42 * sin(t * sp + ph), gr = g.createLinearGradient(x, HZ, x + cos(a) * 700, HZ + sin(a) * 700);
        gr.addColorStop(0, `rgba(${k ? '255,120,210' : '140,220,255'},0.20)`); gr.addColorStop(1, 'rgba(120,80,200,0)'); g.fillStyle = gr;
        g.beginPath(); g.moveTo(x, HZ); g.lineTo(x + cos(a - 0.06) * 800, HZ + sin(a - 0.06) * 800); g.lineTo(x + cos(a + 0.06) * 800, HZ + sin(a + 0.06) * 800); g.fill(); });
      g.restore();
      TW.forEach((T, k) => { if (T.ant && (Math.floor(t * 1.6 + k * 0.37) % 2)) { const y = T.top - 90; g.fillStyle = '#FF3040'; g.fillRect(T.x + T.w / 2 - 2, y - 2, 4, 4); G.fillStyle = '#FF3040'; G.fillRect(T.x + T.w / 2 - 6, y - 6, 12, 12); } });
      // 大鹏航空 hologram billboard: grounded (停航) once the roc is caught
      { const x = 392, y = 92, w = 226, h = 92, gl = XY.hash(Math.floor(t * 12), 31) < 0.12, down = u > TOUCH + 0.04, ox = gl ? 8 * (XY.hash(Math.floor(t * 12), 32) - 0.5) : 0;
        g.save(); g.globalAlpha = 0.6 + (gl ? -0.3 : 0); g.fillStyle = down ? 'rgba(255,60,90,0.16)' : 'rgba(70,240,255,0.14)'; g.fillRect(x + ox, y, w, h);
        g.strokeStyle = down ? '#FF5070' : CY; g.lineWidth = 1.5; g.strokeRect(x + ox, y, w, h);
        g.fillStyle = down ? '#FF7088' : '#9FF8FF'; g.font = XY.font(34, XY.cnFont.hei, '900'); g.textBaseline = 'middle';
        g.fillText(down ? (Math.floor(t * 4) % 2 ? '停 航' : '') : '大鹏航空', x + 70 + ox, y + h / 2 + 1);
        g.strokeStyle = g.fillStyle; g.lineWidth = 3; g.beginPath(); g.moveTo(x + 14 + ox, y + 54); g.lineTo(x + 34 + ox, y + 34); g.lineTo(x + 58 + ox, y + 44); g.moveTo(x + 34 + ox, y + 34); g.lineTo(x + 30 + ox, y + 62); g.stroke();
        g.fillStyle = 'rgba(0,0,0,0.35)'; for (let s = 0; s < h; s += 4) g.fillRect(x + ox, y + s, w, 1.5);
        if (u > TOUCH + 0.03 && u < TOUCH + 0.06) { g.globalAlpha = 1; g.fillStyle = 'rgba(255,240,250,0.85)'; g.fillRect(x, y, w, h); } g.restore();
        G.fillStyle = down ? 'rgba(255,60,90,0.35)' : 'rgba(70,240,255,0.35)'; G.fillRect(x, y, w, h); }
      // a 狮驼城 demon patrol drifting across on a neon cloud, waving a command flag
      { const x = W + 160 - ((t * 120 + 420) % (W + 520)), y = 256 + 10 * sin(t * 1.1), cl = [];
        for (let k = 0; k <= 5; k++) { const el = XY.ellipse(x + k * 18, y + 14, 16, 9, 12); cl.push(el.slice(12).concat(el.slice(0, 2))); }
        neon(g, G, [0, 0, 0, 1], cl, CY, 1.6, 0.85);
        g.fillStyle = '#0C0818'; g.beginPath(); g.ellipse(x + 46, y - 4, 12, 16, 0, 0, TAU); g.fill(); g.beginPath(); g.moveTo(x + 38, y - 18); g.lineTo(x + 34, y - 32); g.lineTo(x + 44, y - 20); g.moveTo(x + 52, y - 20); g.lineTo(x + 60, y - 32); g.lineTo(x + 56, y - 18); g.fill();
        g.fillStyle = '#FF3040'; g.fillRect(x + 40, y - 8, 3, 3); g.fillRect(x + 48, y - 8, 3, 3);
        const fl = []; for (let k = 0; k <= 6; k++) fl.push(x + 62 + k * 5, y - 44 + 3 * sin(t * 8 - k));
        neon(g, G, [0, 0, 0, 1], [[x + 60, y + 4, x + 62, y - 46]], AM, 1.4, 0.9); neon(g, G, [0, 0, 0, 1], [fl.concat([x + 92, y - 30, x + 62, y - 30])], MG, 1.6, 0.9, true); }
      // neon signs (entrance: they stutter on one by one) and their light on the wet street
      SIGNS.forEach((s, k) => { const lit = signLit(k, u, t) * (k === 4 && flash > 0.05 ? 1.25 : 1), [w, h] = signSize(s), sp = signSprite(k, S);
        g.save(); g.globalAlpha = Math.min(1, lit); g.drawImage(sp, s[4] - PAD, s[5] - PAD, w + 2 * PAD, h + 2 * PAD); g.restore();
        const dd = DEATH[k]; if (dd != null && u > dd && u < dd + 0.1) { const q = (u - dd) / 0.1; g.fillStyle = '#FFE6A0';
          for (let j = 0; j < 14; j++) { const x = s[4] + w * XY.hash(j, k, 1), y = s[5] + h + q * (60 + 140 * XY.hash(j, k, 2)) + 260 * q * q; g.globalAlpha = 1 - q; g.fillRect(x, y, 3, 3); G.fillStyle = AM; G.fillRect(x - 3, y - 3, 9, 9); } g.globalAlpha = 1; }
        if (lit > 0.5) { G.globalAlpha = 0.3; G.fillStyle = s[1]; G.fillRect(s[4], s[5], w, h); G.globalAlpha = 1;
          g.save(); g.globalCompositeOperation = 'lighter'; g.fillStyle = s[1];
          for (let y = gy + 6; y < 778; y += 5) { const q = (y - gy) / 76; g.globalAlpha = 0.22 * (1 - q); g.fillRect(s[4] + w / 2 - w * 0.4 + 7 * sin(y * 0.35 + t * 5 + k), y, w * 0.8 * (0.6 + 0.4 * sin(y * 0.9 + k)), 2); }
          g.restore(); } });
      // golden haze where the hand breaks through the smog
      const tip = handTip(u), hv = u > 0.25 && u < 0.98;
      if (hv || gold > 0) { g.save(); g.globalCompositeOperation = 'screen'; const rg = g.createRadialGradient(W - 220, 40, 10, W - 220, 40, 520); rg.addColorStop(0, `rgba(255,200,90,${0.45 * Math.max(gold, hv ? 0.5 : 0)})`); rg.addColorStop(1, 'rgba(255,160,60,0)'); g.fillStyle = rg; g.fillRect(0, 0, W, H); g.restore(); }
      this.handRoc(g, G, e, tip, hv);
      this.pilgrims(g, e, gold);
      this.rain(g, G, W, H, rainT, frz, gold);
      // white flash and shock ring on the touch
      if (u > TOUCH && u < TOUCH + 0.14) { const q = (u - TOUCH) / 0.14, C = [tip[0] + DIR[0] * 64, tip[1] + DIR[1] * 64];
        g.fillStyle = `rgba(255,248,230,${0.7 * flash})`; g.fillRect(0, 0, W, H);
        neon(g, G, [C[0], C[1], 0, 1], [XY.ellipse(0, 0, 40 + 520 * q, 40 + 520 * q, 48).concat([40 + 520 * q, 0])], GD, 6 * (1 - q), 1 - q); }
      this.chrome(g, G, e);
      // bloom: blur the quarter-res glow layer and add it
      const B = XY.scratch('cp-glow2', Wd / 4, Hd / 4), bg2 = B.getContext('2d'); bg2.filter = `blur(${Math.max(1, 3 * S)}px)`; bg2.drawImage(Gc, 0, 0);
      g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'lighter'; g.globalAlpha = 0.85; g.drawImage(B, 0, 0, Wd, Hd); g.globalAlpha = 0.3; g.drawImage(Gc, 0, 0, Wd, Hd); g.restore();
    },
    // the roc (dead sign → lit → diving → caught in a ring of 佛光) and the golden hand
    handRoc(g, G, e, tip, hv) {
      const { u, t } = e, R = rocAt(u, t), rl = rocLines(R.f, R.droop, R.fold), xf = [R.x, R.y, R.a, R.s];
      if (u < 1.02 || R.x < e.W) {
        g.save(); g.translate(R.x, R.y); g.rotate(R.a); g.scale(R.s, R.s); g.fillStyle = 'rgba(18,6,30,0.75)'; polys(g, [rl.body[0], rl.body[1], rl.near, rl.far], true); g.fill(); g.restore();
        neon(g, G, xf, [rl.far], VI, 2.2, R.lit * 0.8, true);
        neon(g, G, xf, rl.body, CY, 2.6, R.lit);
        neon(g, G, xf, [rl.near], MG, 2.6, R.lit, true);
        const ex = R.x + (88 * cos(R.a) + 6 * sin(R.a)) * R.s, ey = R.y + (88 * sin(R.a) - 6 * cos(R.a)) * R.s, blink = u < 0.22 && Math.floor(t * 1.3) % 3 === 0 ? 0.2 : 1;
        g.fillStyle = `rgba(255,40,60,${blink})`; g.beginPath(); g.arc(ex, ey, 4.5 * R.s + 1, 0, TAU); g.fill(); G.fillStyle = '#FF2840'; G.globalAlpha = blink; G.beginPath(); G.arc(ex, ey, 14, 0, TAU); G.fill(); G.globalAlpha = 1;
      }
      if (u > TOUCH) {   // ring of 佛光 locking the roc
        const k = XY.easeOut((u - TOUCH) / 0.07), r = (118 * R.s + 12) * (0.6 + 0.4 * k), sp = t * 1.4;
        neon(g, G, [R.x, R.y, 0, 1], [XY.ellipse(0, 0, r, r, 48).concat([r, 0])], GD, 3, k);
        const segs = []; for (let i = 0; i < 12; i++) { const a0 = sp + i * TAU / 12, pts = []; for (let j = 0; j <= 4; j++) { const a = a0 + j * TAU / 80; pts.push(cos(a) * (r - 12), sin(a) * (r - 12)); } segs.push(pts); }
        neon(g, G, [R.x, R.y, 0, 1], segs, AM, 2, k * 0.9);
        for (let i = 0; i < 8; i++) { const a = -sp * 0.6 + i * TAU / 8; segs.length = 0; segs.push([cos(a) * (r + 6), sin(a) * (r + 6), cos(a) * (r + 22), sin(a) * (r + 22)]); neon(g, G, [R.x, R.y, 0, 1], segs, GD, 1.8, k * 0.8); }
        // chains of light from the ring to both wing tips and the talons: the roc stays a bird, pinned spread-eagled
        const W2 = p => { const c = cos(R.a), s2 = sin(R.a); return [R.x + (p[0] * c - p[1] * s2) * R.s, R.y + (p[0] * s2 + p[1] * c) * R.s]; };
        [W2([rl.near[6], rl.near[7]]), W2([rl.far[6], rl.far[7]]), W2([24, 34])].forEach(tp => { const an = Math.atan2(tp[1] - R.y, tp[0] - R.x), a0 = [R.x + cos(an) * r, R.y + sin(an) * r], ch = [];
          for (let j = 0; j < 6; j++) { const q0 = j / 6, q1 = (j + 0.6) / 6; ch.push([XY.lerp(a0[0], tp[0], q0), XY.lerp(a0[1], tp[1], q0), XY.lerp(a0[0], tp[0], q1), XY.lerp(a0[1], tp[1], q1)]); }
          neon(g, G, [0, 0, 0, 1], ch, AM, 1.6, k); });
      }
      if (!hv) return;
      const hx = [tip[0], tip[1], ROT, 0.92];
      g.save(); g.translate(tip[0], tip[1]); g.rotate(ROT); g.scale(0.92, 0.92);
      g.fillStyle = 'rgba(70,38,8,0.6)'; g.beginPath(); g.moveTo(-58, -360); g.lineTo(94, -360); g.lineTo(190, -900); g.lineTo(-130, -900); g.fill();
      const gr = g.createLinearGradient(0, 0, 0, -360); gr.addColorStop(0, 'rgba(255,200,90,0.55)'); gr.addColorStop(1, 'rgba(140,80,20,0.5)'); g.fillStyle = gr; XY.path(g, HAND, true); g.fill();
      g.restore();
      neon(g, G, hx, SLEEVE, AM, 2.2, 0.75);
      neon(g, G, hx, [HAND], GD, 3.4, 1, true);
      neon(g, G, hx, CREASE, AM, 1.7, 0.9);
      neon(g, G, hx, WHEEL, GD, 1.5, 0.9);
      G.fillStyle = '#FFE6A0'; G.beginPath(); G.arc(tip[0], tip[1], 26 + 10 * sin(t * 9), 0, TAU); G.fill();
    },
    // pilgrims: darkened colours, cyan rim from the left, magenta from the right, gold from above under the hand; mirrored in the wet street
    pilgrims(g, e, gold) {
      const { u } = e, S = e.S, px = e.procX, gy = e.groundY, bx = px - 410, by = gy - 300, bw = 760, bh = 312, w = Math.ceil(bw * S), h = Math.ceil(bh * S);
      if (bx > e.W + 10 || bx + bw < -10) return;
      const acts = { wukong: { shade: K.win(u, 0.18, 0.4, 0.05), raise: K.win(u, 0.41, 0.6, 0.04) }, monk: { palm: K.win(u, 0.5, 0.95, 0.05) }, bajie: { scratch: K.win(u, 0.8, 1.1, 0.06) }, shaseng: { lift: K.win(u, 0.49, 0.58, 0.03) } };
      const lay = XY.scratch('cp-lay', w, h), lg = lay.getContext('2d'); lg.setTransform(S, 0, 0, S, -bx * S, -by * S);
      XY.drawProcession(lg, e.phase, px, gy, PEN, acts);
      const band = (dx, dy, col, key) => { const m = XY.scratch(key, w, h), mg = m.getContext('2d'); mg.fillStyle = col; mg.fillRect(0, 0, w, h); mg.globalCompositeOperation = 'destination-out';
        mg.setTransform(S, 0, 0, S, -bx * S, -by * S); XY.drawProcession(mg, e.phase, px + dx, gy + dy, SIL, acts); return m; };
      lg.setTransform(1, 0, 0, 1, 0, 0); lg.globalCompositeOperation = 'source-atop';
      lg.drawImage(band(3.5, 0.5, 'rgba(70,240,255,0.95)', 'cp-c'), 0, 0);
      lg.drawImage(band(-3.5, 0.5, 'rgba(255,60,168,0.9)', 'cp-m'), 0, 0);
      if (gold > 0.01) { lg.globalAlpha = gold; lg.drawImage(band(-1, 6, 'rgba(255,214,100,1)', 'cp-g'), 0, 0); lg.globalAlpha = 1; }
      g.save(); g.beginPath(); g.rect(0, gy, e.W, e.H - gy); g.clip(); g.translate(0, 2 * gy); g.scale(1, -1); g.globalAlpha = 0.3; g.drawImage(lay, bx, by, bw, bh); g.restore();
      g.drawImage(lay, bx, by, bw, bh);
    },
    // rain (it stops in mid-air for one beat when the Buddha touches the roc), splashes, puddle ripples
    rain(g, G, W, H, T, frz, gold) {
      g.save(); g.lineCap = 'round';
      for (let b = 0; b < 3; b++) { g.beginPath();
        for (let k = b; k < 270; k += 3) { const sp = 900 + 520 * XY.hash(k, 1), L = (16 + 26 * XY.hash(k, 3)) * (1 - 0.88 * frz), span = H + 140;
          const y = ((XY.hash(k, 4) * span + T * sp) % span) - 70, x = XY.hash(k, 2) * (W + 160) - 0.22 * y; g.moveTo(x, y); g.lineTo(x - 0.22 * L, y + L); }
        g.strokeStyle = frz > 0.3 ? `rgba(255,222,150,${0.55 + 0.15 * b})` : `rgba(${160 + 40 * b},${200 + 20 * b},255,${0.16 + 0.1 * b})`; g.lineWidth = 1 + 0.6 * b + 2 * frz; g.stroke(); }
      g.strokeStyle = 'rgba(170,220,255,0.45)'; g.lineWidth = 1.2; g.beginPath();
      for (let k = 0; k < 40; k++) { const ph = (T * 2.2 + XY.hash(k, 7)) % 1, x = XY.hash(k, 8) * W, y = 708 + XY.hash(k, 9) * 66; if (ph > 0.35) continue; const r = 2 + ph * 22; g.moveTo(x - r, y - r * 0.6); g.lineTo(x, y); g.lineTo(x + r, y - r * 0.6); }
      g.stroke();
      for (let k = 0; k < 14; k++) { const ph = (T * 1.3 + XY.hash(k, 17)) % 1, x = 40 + XY.hash(k, 18) * (W - 80), y = 712 + XY.hash(k, 19) * 60, r = 4 + 30 * ph;
        g.strokeStyle = k % 2 ? `rgba(70,240,255,${0.5 * (1 - ph)})` : `rgba(255,60,168,${0.45 * (1 - ph)})`; g.beginPath(); g.ellipse(x, y, r, r * 0.24, 0, 0, TAU); g.stroke(); }
      g.restore();
    },
    // counter: neon tube digits and a small neon 第六十四难
    chrome(g, G, e) {
      const lit = signLit(0, e.u, e.t);
      g.save(); g.globalAlpha = 0.9; g.fillStyle = 'rgba(8,4,18,0.85)'; g.fillRect(26, 24, 264, 74); g.strokeStyle = 'rgba(70,240,255,0.5)'; g.lineWidth = 1.5; g.strokeRect(29, 27, 258, 68); g.restore();
      g.save(); g.globalAlpha = lit; G.globalAlpha = lit;
      G.strokeStyle = CY; K.vecText(G, '64', 44, 38, 46, 10); g.strokeStyle = CY; K.vecText(g, '64', 44, 38, 46, 4.5); g.strokeStyle = '#E8FFFF'; K.vecText(g, '64', 44, 38, 46, 1.6);
      g.font = XY.font(28, XY.cnFont.hei, '900'); g.textBaseline = 'middle'; g.fillStyle = MG; G.font = g.font; G.textBaseline = 'middle'; G.fillStyle = MG; G.fillText('第六十四难', 138, 62);
      g.fillText('第六十四难', 138, 62); g.globalAlpha = lit * 0.6; g.fillStyle = '#FFE0F2'; g.font = XY.font(28, XY.cnFont.hei, '500'); g.fillText('第六十四难', 138, 62);
      g.restore(); G.globalAlpha = 1;
    },
  };
})();
