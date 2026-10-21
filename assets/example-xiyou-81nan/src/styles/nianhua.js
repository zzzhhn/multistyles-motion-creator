// 32 清代年画 · 黑河沉没 — a woodblock New-Year print: black key block, flat red / green / yellow colour blocks printed
// a little off register, rice paper. On the 黑水河 the ferryman's boat flips, his hat flies, and the 鼍龙 bursts from
// the fish-scale waves, snaps 唐僧 off the saddle and drags him under; a whirlpool and the floating hat remain.
(() => {
  'use strict';
  const XY = window.XY, K = XY.KIT_D, TAU = XY.TAU;
  const GY = 702, RIV0 = 452, RIV1 = 688, REG = [2.6, -1.8];
  const C = { red: '#D8282A', pink: '#F06A8A', green: '#1E9A50', lgreen: '#7AC24A', yellow: '#F2C230', blue: '#2A5AB0', purple: '#7A3A9A', ink: '#151515', orange: '#F08A20', paper: '#F2E6CC', white: '#FBF6EA' };
  const COL = { fur: '#D8862A', face: '#F8D8B0', wkshirt: C.red, tiger: C.yellow, stripe: C.ink, gold: C.yellow, staff: C.red, ink: C.ink,
    horse: C.white, horse2: '#E8DCC4', mane: '#F4ECDA', hoof: C.ink, saddle: C.green, red: C.red, robe: C.yellow, kasaya: C.red,
    skin: '#FAD2B4', metal: C.yellow, bjrobe: C.blue, bjpants: '#1E3E80', pig: '#F8B8C0', pig2: C.pink, wood: '#A8642A',
    ssrobe: C.green, ssrobe2: '#147A3E', skin2: '#E2A878', ssh: C.red, ssbeard: '#B81E1E', skull: C.white, bundle: C.purple };
  const COLOR_PEN = { outline: null, shade: false, fine: false, color: r => COL[r] || XY.DEFAULT_COLORS[r] };
  const DETAIL_PEN = { outline: null, shade: false, color: r => (r === 'ink' || r === 'stripe' ? C.ink : null) };
  const KEY_PEN = { outline: C.ink, ow: 2, shade: false, color: r => (r === 'ink' || r === 'stripe' ? C.ink : 'rgba(0,0,0,0)') };

  // a colour block printed off register, then the key line on top
  let KEYONLY = false;   // while true, blk prints only the key block (used to cache the bare line print for the entrance)
  const blk = (g, pts, col, lw = 2.4, closed = true) => {
    if (!KEYONLY) { g.save(); g.translate(REG[0], REG[1]); XY.path(g, pts, closed); g.fillStyle = col; g.fill(); g.restore(); }
    XY.path(g, pts, closed); g.strokeStyle = C.ink; g.lineWidth = lw; g.lineJoin = 'round'; g.stroke();
  };
  const xiangyun = (g, x, y, s, col) => {   // 祥云: a lucky cloud of linked spirals
    g.save(); g.translate(x, y); g.scale(s, s);
    const P = []; [[0, 0, 18], [26, -8, 14], [48, 2, 12], [20, 12, 12]].forEach(([cx, cy, r]) => { for (let k = 0; k <= 12; k++) { const a = Math.PI * (0.9 + k / 12 * 1.2); P.push(cx + Math.cos(a) * r, cy + Math.sin(a) * r); } });
    blk(g, XY.RIG.spline(P, true, 2), col, 2.4 / s);
    g.strokeStyle = C.ink; g.lineWidth = 1.8 / s; [[0, 0, 10], [26, -8, 7]].forEach(([cx, cy, r]) => { g.beginPath(); for (let a = 0; a < 7; a += 0.3) g.lineTo(cx + Math.cos(a) * r * (1 - a / 8), cy + Math.sin(a) * r * (1 - a / 8)); g.stroke(); });
    g.restore();
  };
  const willow = (g, x, y, h) => {
    g.strokeStyle = C.ink; g.lineWidth = 7; g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + 10, y - h * 0.5, x - 4, y - h); g.stroke(); g.strokeStyle = '#7A4A22'; g.lineWidth = 4; g.stroke();
    for (let k = 0; k < 14; k++) { const sx = x - 4 + (k - 7) * 6, sy = y - h + Math.abs(k - 7) * 4, L = 50 + 30 * XY.hash(k, x);
      g.strokeStyle = k % 2 ? C.green : C.lgreen; g.lineWidth = 2.6; g.beginPath(); g.moveTo(sx, sy); g.quadraticCurveTo(sx + (k - 7) * 6, sy + L * 0.4, sx + (k - 7) * 3, sy + L); g.stroke(); }
  };
  // fish-scale waves: rows of arcs, white crest line over the black
  // 卷浪: rows of wave lines whose crests roll over into small curls, white over the black river
  const scales = (g, x0, x1, y0, y1, ph) => {
    g.lineCap = 'round';
    for (let r = 0, y = y0; y < y1; r++, y += 24) { const L = 70 + r * 8, A = 5 + r * 0.8, off = ((ph * (1 + r * 0.12) + r * 31) % L + L) % L;
      g.strokeStyle = 'rgba(250,246,234,0.85)'; g.lineWidth = 1.8 + r * 0.15; g.beginPath();
      for (let x = x0 - L; x <= x1 + L; x += 6) { const q = (x - off) / L * TAU; g.lineTo(x, y + A * Math.sin(q)); } g.stroke();
      g.lineWidth = 1.6; for (let x = x0 - L + off + L * 0.75; x < x1 + L; x += L) { const cy = y - A; g.beginPath(); for (let a = 0; a < 7; a += 0.35) g.lineTo(x + Math.cos(a + Math.PI) * a * 1.3, cy + Math.sin(a + Math.PI) * a * 1.0); g.stroke(); }
      g.strokeStyle = 'rgba(90,110,150,0.55)'; g.lineWidth = 1.2; g.beginPath(); for (let x = x0 - L; x <= x1 + L; x += 8) g.lineTo(x, y + 9 + A * 0.6 * Math.sin((x - off) / L * TAU + 1)); g.stroke(); }
  };

  // the near bank and the foreground inlet, cached as their own strip so the river action can sink behind them
  const bankPaint = (g, W, H) => {
      // near bank: green with tufts and red flowers, the gallery line along its lip
      blk(g, [0, RIV1 - 4, 300, RIV1 - 10, 640, RIV1 - 2, 900, RIV1 - 8, W, RIV1 - 2, W, H, 0, H], C.green, 2.6);
      { const R = XY.rng(5); for (let k = 0; k < 40; k++) { const x = R() * W, y = 712 + R() * 50; g.strokeStyle = C.ink; g.lineWidth = 1.6; g.beginPath(); g.moveTo(x - 6, y); g.lineTo(x, y - 12); g.lineTo(x + 2, y); g.lineTo(x + 8, y - 10); g.stroke();
        if (k % 3 === 0) { g.fillStyle = k % 2 ? C.red : C.yellow; g.beginPath(); g.arc(x + 1 + REG[0], y - 14 + REG[1], 4, 0, TAU); g.fill(); g.strokeStyle = C.ink; g.lineWidth = 1.2; g.beginPath(); g.arc(x + 1, y - 14, 4, 0, TAU); g.stroke(); } } }
      g.fillStyle = 'rgba(21,21,21,0.85)'; g.fillRect(0, GY, W, 2.5);
      // a small inlet in the foreground with lotus leaves (the carp jumps from it)
      blk(g, XY.ellipse(170, 750, 120, 24, 22), '#2A3A5A', 2.4);
      [[90, 748, 26], [250, 744, 22]].forEach(([x, y, r]) => { blk(g, XY.ellipse(x, y, r, r * 0.4, 16), C.lgreen, 2); g.strokeStyle = C.ink; g.lineWidth = 1.2; for (let k = 0; k < 5; k++) { g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(k * 1.25) * r, y + Math.sin(k * 1.25) * r * 0.4); g.stroke(); } });
  };
  const bankLayer = (W, H, S) => XY.cached('kd32-bank:' + S.toFixed(4), W * S, (H - 660) * S, cv => { const g = cv.getContext('2d'); g.setTransform(S, 0, 0, S, 0, -660 * S); bankPaint(g, W, H); });

  XY.STYLES.nianhua = {
    bg(g, W, H) {
      g.fillStyle = C.paper; g.fillRect(0, 0, W, H);
      K.grain(g, W, H, 32, 2400, 'rgba(150,120,70,0.16)', 'rgba(255,252,240,0.5)', 9);
      xiangyun(g, 420, 92, 1.3, C.pink); xiangyun(g, 700, 140, 1, '#8AB8E8'); xiangyun(g, 1000, 80, 1.2, C.yellow);
      // far hills and a village: blue-green peaks with key lines, red-roofed houses
      [[160, 420, 150, 150, '#4A8AC8'], [420, 420, 130, 190, '#2E9A8A'], [800, 420, 170, 170, '#4A8AC8'], [1060, 420, 140, 130, '#2E9A8A']].forEach(([x, y, w, h, c]) => {
        blk(g, [x - w, y, x - w * 0.4, y - h * 0.7, x, y - h, x + w * 0.45, y - h * 0.6, x + w, y], c, 2.4);
        g.strokeStyle = C.white; g.lineWidth = 2; g.beginPath(); g.moveTo(x - w * 0.15, y - h * 0.9); g.lineTo(x - w * 0.35, y - h * 0.5); g.stroke(); });
      [[230, 436], [290, 430], [950, 434], [1010, 428]].forEach(([x, y], k) => { blk(g, [x - 22, y, x + 22, y, x + 22, y - 22, x - 22, y - 22], C.white, 2); blk(g, [x - 30, y - 20, x + 30, y - 20, x + 18, y - 38, x - 18, y - 38], k % 2 ? C.red : C.blue, 2); g.fillStyle = C.ink; g.fillRect(x - 6, y - 14, 12, 14); });
      // far shore: a green band with willows, a little red pagoda
      blk(g, [0, 440, 180, 420, 420, 432, 700, 418, 960, 430, W, 420, W, RIV0, 0, RIV0], C.lgreen);
      [[120, 444, 120], [330, 444, 100], [880, 440, 110], [1080, 440, 120]].forEach(([x, y, h]) => willow(g, x, y, h));
      { const px = 600, py = 436; for (let k = 0; k < 5; k++) { const w = 40 - k * 6, y = py - k * 26; blk(g, [px - w / 2, y, px + w / 2, y, px + w / 2 - 3, y - 18, px - w / 2 + 3, y - 18], k % 2 ? C.yellow : C.red, 2);
        blk(g, [px - w / 2 - 10, y - 18, px + w / 2 + 10, y - 18, px, y - 30], C.green, 2); } }
      // the black river
      g.fillStyle = '#1A1A22'; g.fillRect(0, RIV0, W, RIV1 - RIV0);
      g.strokeStyle = C.ink; g.lineWidth = 3; g.beginPath(); g.moveTo(0, RIV0); g.lineTo(W, RIV0); g.stroke();
    },
    hits: [4.4],
    draw(g, e) {
      const { W, H, t, u, beat } = e, S = e.S, WL = 512;   // WL: the waterline out in mid-river
      // the print goes down: the bare key block first, the colour plates stamped on at beat 0.8
      if (beat < 0.8) g.drawImage(keyLayer(W, H, S, this.bg), 0, 0, W, H);
      g.save(); g.beginPath(); g.rect(0, RIV0 + 2, W, RIV1 - RIV0); g.clip(); scales(g, 0, W, RIV0 + 8, RIV1, -t * 40); g.restore();
      const acts = { wukong: { shade: K.win(beat, 1.0, 1.6) * (1 - K.win(beat, 2.6, 3)), raise: K.win(beat, 4.5, 4.9) * (1 - K.win(beat, 5.6, 5.9)), strike: K.win(beat, 5.6, 5.9) * (1 - K.win(beat, 7.2, 7.8)) },
        monk: { palm: 0 }, bajie: { scratch: K.win(beat, 3.0, 3.4) * (1 - K.win(beat, 4.2, 4.6)) }, shaseng: { lift: K.win(beat, 4.4, 4.8) * (1 - K.win(beat, 6.6, 7.2)) } };
      // the ferry: waits mid-river, comes in to the bank (2.0–2.6), takes 唐僧 aboard (2.6–3.3), poles out (3.3–4.3)
      const DOCK = [K.procAt(e, 2.6 / 8) + 440, 652], MID = [820, WL - 6], inn = XY.smooth((beat - 1.6) / 1.0), out = XY.smooth((beat - 3.3) / 1.0);
      const B = beat < 3.3 ? [XY.lerp(MID[0], DOCK[0], inn), XY.lerp(MID[1], DOCK[1], inn), XY.lerp(0.7, 1, inn)] : [XY.lerp(DOCK[0], MID[0], out), XY.lerp(DOCK[1], MID[1], out), XY.lerp(1, 0.7, out)];
      const board = XY.smooth((beat - 2.6) / 0.7), HIT = 4.4, fall = beat - HIT, grab = XY.smooth((beat - 5.6) / 0.6);
      if (beat >= 2.6) acts.cast = { rider: false };
      const sb = K.sub(e, e.phase, acts, 2, 'rider', 'saddle');
      const rider = (x, y, a, sc) => { K.paintSub(g, sb, COLOR_PEN, x + REG[0], y + REG[1], a, sc); K.paintSub(g, sb, DETAIL_PEN, x, y, a, sc); };
      // what happens out on the water is clipped at the waterline, so things can go under
      g.save(); g.beginPath(); g.rect(0, 0, W, WL + (beat < HIT ? 200 : 0)); g.clip();
      if (beat >= HIT && grab < 1) dragon(g, t, [MID[0] + 30 - 250 * grab, XY.lerp(WL - 270, WL + 160, grab) - 60 * Math.sin(Math.PI * grab)], XY.lerp(-1.7, -4.4, grab) + 0.08 * Math.sin(t * 6), grab > 0 ? 0.15 : 1, [MID[0] + 110, WL + 40], XY.easeOut(fall / 0.3));
      if (beat >= HIT) {   // 唐僧 in the black water: thrown, struggling with his head going under and up, then dragged down
        const th = XY.clamp(fall / 0.4), sx = XY.lerp(MID[0], MID[0] - 190, th), sy = XY.lerp(MID[1] - 60, WL + 22, th) - 90 * Math.sin(Math.PI * th) + 14 * Math.sin(beat * 9) * (1 - grab) + 120 * grab;
        rider(sx, sy, 0.45 * Math.sin(beat * 7) * (1 - grab) + TAU * th, 0.75);
        if (fall > 0.4 && grab < 1) { g.strokeStyle = 'rgba(250,246,234,0.9)'; g.lineWidth = 2; for (let r = 0; r < 3; r++) { const q = ((beat * 1.4 + r / 3) % 1); g.beginPath(); g.ellipse(sx, WL + 2, 20 + 40 * q, 4 + 6 * q, 0, 0, TAU); g.stroke(); } } }
      g.restore();
      boat(g, t, beat, B, HIT);
      if (beat >= 2.6 && beat < HIT) { const sx = XY.lerp(sb.at[0], B[0] - 10 * B[2], board), sy = XY.lerp(sb.at[1], B[1] - 30 * B[2], board) - 170 * Math.sin(Math.PI * board); rider(sx, sy, 0, XY.lerp(1, 0.7, out)); }
      if (beat >= HIT) splash(g, t, beat, [MID[0] + 20, WL]);
      if (beat >= 0.8) g.drawImage(bankLayer(W, H, S), 0, 660, W, H - 660);
      carp(g, t);
      // the procession, printed: one merged key-line contour, the colour plate a hair off register, the fine lines on top
      const sil = K.sil(e, C.ink, acts, { key: 'kd32-sil' });
      g.save(); g.setTransform(1, 0, 0, 1, 0, 0); for (let k = 0; k < 8; k++) { const a = k / 8 * TAU; g.drawImage(sil.cv, sil.X + Math.cos(a) * 2.6 * S, sil.Y + Math.sin(a) * 2.6 * S); } g.restore();
      XY.drawProcession(g, e.phase, e.procX + REG[0] * 0.6, e.groundY + REG[1] * 0.6, COLOR_PEN, acts);
      XY.drawProcession(g, e.phase, e.procX, e.groundY, DETAIL_PEN, acts);
      for (let k = 0; k < 2; k++) { const bx = ((t * 60 + k * 520) % (W + 200)) - 100, by = 210 + k * 60 + 18 * Math.sin(t * 3 + k), fl = Math.sin(t * 14 + k);   // red bats (福) flapping across
        g.save(); g.translate(bx, by); blk(g, [-30, -4 - 10 * fl, -16, 2, -6, -2, 0, 4, 6, -2, 16, 2, 30, -4 - 10 * fl, 18, 10, 0, 6, -18, 10], C.red, 2); g.restore(); }
      K.zoom(g, e, MID[0], WL - 110, 1 + 0.15 * K.env(beat, 4.1, 4.6, 5.9, 6.5));
      g.drawImage(frame(W, H, S), 0, 0, W, H);
    },
  };

  // the bare key-block print (lines and the black river only), for the first beat
  const keyLayer = (W, H, S, bg) => XY.cached('kd32-key:' + S.toFixed(4), W * S, H * S, cv => { const g = cv.getContext('2d'); g.setTransform(S, 0, 0, S, 0, 0);
    KEYONLY = true; try { bg(g, W, H); g.drawImage(bankLayerKey(W, H, S), 0, 660, W, H - 660); } finally { KEYONLY = false; } });
  const bankLayerKey = (W, H, S) => { KEYONLY = true; const c = XY.mk(W * S, (H - 660) * S), g = c.getContext('2d'); g.setTransform(S, 0, 0, S, 0, -660 * S); bankPaint(g, W, H); return c; };
  // the ferry with the boatman (斗笠, 蓑衣) poling and beckoning. He is the 鼍龙 himself: on the hit he is gone in a burst,
  // his hat flies, the boat is flung up end over end and lands keel-up
  function boat(g, t, beat, B, HIT) {
    const f = XY.clamp((beat - HIT) / 0.9), bob = 3 * Math.sin(t * 2.2), x = B[0] + 100 * f, y = B[1] + bob - 230 * Math.sin(Math.PI * f) + (f >= 1 ? 6 : 0), rot = Math.PI * XY.smooth(f) + 0.04 * Math.sin(t * 2.2);
    g.save(); g.translate(x, y); g.scale(B[2], B[2]); g.rotate(rot);
    blk(g, [-90, -8, 90, -8, 74, 16, -74, 16], C.red); blk(g, [-96, -14, 96, -14, 90, -6, -90, -6], C.yellow, 2);
    if (beat < HIT) {   // the boatman at the stern
      const wv = Math.sin(t * 6) * 0.5, pole = beat > 1.6 && beat < 2.6 || beat > 3.3 ? Math.sin(t * 4) * 0.2 : 0;
      g.save(); g.translate(56, -10);
      g.strokeStyle = C.ink; g.lineWidth = 4; g.beginPath(); g.moveTo(-40 + 30 * pole, -130); g.lineTo(10 - 30 * pole, 40); g.stroke();
      blk(g, [-14, -2, 14, -2, 20, -60, 0, -74, -20, -60], '#5A7A3A'); g.strokeStyle = C.ink; g.lineWidth = 1.2; for (let k = 0; k < 6; k++) { g.beginPath(); g.moveTo(-16 + k * 6, -58); g.lineTo(-18 + k * 7, -4); g.stroke(); }
      blk(g, XY.ellipse(0, -84, 10, 11, 12), '#F2C8A0', 2); blk(g, [-30, -88, 30, -88, 0, -110], C.yellow, 2);
      if (beat < 1.6) { g.strokeStyle = C.ink; g.lineWidth = 5; g.beginPath(); g.moveTo(-14, -60); g.lineTo(-34, -82 + 12 * wv); g.lineTo(-44, -96 + 16 * wv); g.stroke(); }
      g.restore(); }
    g.restore();
    if (beat >= HIT) {   // his hat, flung up, then floating and spinning; a puff where he stood
      const h = XY.clamp((beat - HIT) / 1.4), hx = XY.lerp(B[0] + 56, B[0] - 200, h), hy = XY.lerp(B[1] - 100, 516, h) - 200 * Math.sin(Math.PI * h);
      g.save(); g.translate(hx, hy); g.rotate(beat * 3 * (1 - h) + 0.1 * Math.sin(t * 2)); blk(g, [-30, 4, 30, 4, 0, -18], C.yellow, 2); g.restore();
      const p = XY.clamp((beat - HIT) / 0.5); if (p < 1) { g.fillStyle = `rgba(250,246,234,${1 - p})`; for (let k = 0; k < 7; k++) { const a = k / 7 * TAU; g.beginPath(); g.arc(B[0] + 56 + Math.cos(a) * 40 * p, B[1] - 60 + Math.sin(a) * 30 * p, 16 * (1 - p) + 6, 0, TAU); g.fill(); } } }
  }
  // 鼍龙: green-scaled alligator dragon, red maw, white teeth, curling red whiskers and mane, crest of red fins
  function dragon(g, t, hd, ang, jaw, E, grow = 1) {
    if (grow < 1) hd = [hd[0], XY.lerp(E[1] + 60, hd[1], grow)];
    const back = [hd[0] - Math.cos(ang) * 30, hd[1] - Math.sin(ang) * 30], C1 = [(E[0] + back[0]) / 2 + 60, (E[1] + back[1]) / 2 + 20];
    const sp = []; for (let k = 0; k <= 16; k++) { const s = k / 16; sp.push(XY.lerp(XY.lerp(E[0], C1[0], s), XY.lerp(C1[0], back[0], s), s), XY.lerp(XY.lerp(E[1], C1[1], s), XY.lerp(C1[1], back[1], s), s)); }
    for (let k = 1; k < 16; k += 2) { const x = sp[2 * k], y = sp[2 * k + 1]; blk(g, [x - 10, y - 18, x, y - 40, x + 10, y - 18], C.red, 2); }
    blk(g, XY.RIG.ribbon(sp, 92, 64), C.green, 2.6);
    g.strokeStyle = C.yellow; g.lineWidth = 2; for (let k = 1; k < 16; k++) { g.beginPath(); g.arc(sp[2 * k], sp[2 * k + 1], 9, 0.2, Math.PI - 0.2); g.stroke(); }
    g.save(); g.translate(hd[0], hd[1]); g.rotate(ang); g.scale(1.8, 1.8);
    for (let k = 0; k < 5; k++) blk(g, [-30, -10 + k * 6, -58 - 10 * Math.sin(t * 8 + k), -26 + k * 12, -40, 4 + k * 4], k % 2 ? C.orange : C.red, 1.8);
    g.save(); g.rotate(0.45 * jaw); blk(g, [-6, 6, 80, 8, 86, 16, -4, 22], C.green); g.fillStyle = C.white; for (let k = 0; k < 6; k++) { g.beginPath(); g.moveTo(14 + k * 12, 8); g.lineTo(20 + k * 12, 1); g.lineTo(26 + k * 12, 8); g.fill(); } g.restore();
    blk(g, [-6, 2, 74, 0, 84, -10, 70, -22, 30, -26, -10, -30, -30, -14], C.green);
    if (jaw > 0.5) { g.fillStyle = '#E8384A'; g.beginPath(); g.moveTo(0, 4); g.lineTo(76, 2); g.lineTo(70, 16); g.fill(); }
    g.fillStyle = C.white; for (let k = 0; k < 6; k++) { g.beginPath(); g.moveTo(14 + k * 12, 1); g.lineTo(20 + k * 12, 9); g.lineTo(26 + k * 12, 1); g.fill(); }
    blk(g, XY.ellipse(10, -26, 13, 12, 14), C.white, 2.4); g.fillStyle = C.ink; g.beginPath(); g.arc(14, -26, 5.5, 0, TAU); g.fill(); g.strokeStyle = C.red; g.lineWidth = 2.5; g.beginPath(); g.arc(10, -26, 15, Math.PI * 1.05, Math.PI * 1.95); g.stroke();
    g.strokeStyle = C.yellow; g.lineWidth = 1.6; [[30, -18], [46, -20], [60, -16]].forEach(([x, y]) => { g.beginPath(); g.arc(x, y, 5, Math.PI, TAU); g.stroke(); });
    g.strokeStyle = C.red; g.lineWidth = 3; [[80, -12, 1], [78, -6, -1]].forEach(([x, y, s], k) => { g.beginPath(); for (let a = 0; a < 9; a += 0.35) g.lineTo(x + a * 5 + Math.cos(a + t * 4) * 6, y - s * (a * 2.2) + Math.sin(a + t * 4 + k) * 6); g.stroke(); });
    g.restore();
  }
  // the burst: tall white-crested curls of black water, flung drops, then a whirlpool where he went under
  function splash(g, t, beat, P) {
    beat = beat - 4.4 + 2;   // authored for a strike on beat 2
    const b = XY.clamp((beat - 2) / 0.4), fade = 1 - XY.smooth((beat - 3.2) / 0.8);
    if (fade > 0) for (let k = 0; k < 7; k++) { const a = Math.PI * (1.15 + k / 6 * 0.7), h = (60 + 90 * XY.hash(k, 4)) * b * fade, x = P[0] + Math.cos(a) * 70, y = P[1];
      g.save(); g.translate(x, y); g.rotate(a + Math.PI / 2);
      blk(g, [-12, 0, -8, -h * 0.6, 0, -h, 10, -h * 0.7, 12, 0], '#5A78B8', 2.2);
      g.strokeStyle = C.white; g.lineWidth = 2.6; g.beginPath(); for (let q = 0; q < 7; q += 0.4) g.lineTo(Math.cos(q) * q * 1.6, -h + Math.sin(q) * q * 1.6); g.stroke(); g.restore(); }
    if (fade > 0) { g.fillStyle = C.white; for (let k = 0; k < 18; k++) { const s = XY.clamp((beat - 2) / 1.1), a = Math.PI * (1.1 + XY.hash(k, 6) * 0.8), d = 40 + 220 * s * XY.hash(k, 7);
      const x = P[0] + Math.cos(a) * d, y = P[1] + Math.sin(a) * d * 0.9 + 260 * s * s; if (y < RIV1) { g.beginPath(); g.ellipse(x, y, 5, 3.4, a, 0, TAU); g.fill(); g.strokeStyle = C.ink; g.lineWidth = 1; g.stroke(); } } }
    if (beat > 3) { const w = XY.smooth((beat - 3) / 0.5); g.strokeStyle = 'rgba(250,246,234,0.9)'; g.lineWidth = 2.4;
      for (let r = 0; r < 4; r++) { g.beginPath(); for (let a = 0; a < 5.6; a += 0.2) { const rr = (14 + r * 16) * w * (1 - a / 14); g.lineTo(P[0] + 60 + Math.cos(a + t * 3 + r) * rr * 2.2, P[1] - 2 + Math.sin(a + t * 3 + r) * rr * 0.5); } g.stroke(); } }
  }
  // 鲤鱼: a red carp leaping from the foreground inlet, again and again
  function carp(g, t) {
    const ph = (t / 1.8) % 1; if (ph > 0.55) return;
    const s = ph / 0.55, x = XY.lerp(110, 230, s), y = 748 - 120 * Math.sin(Math.PI * s), a = XY.lerp(-1.0, 1.0, s);
    g.save(); g.translate(x, y); g.rotate(a);
    blk(g, [-26, 0, -6, -12, 18, -10, 30, 0, 18, 10, -6, 12], C.red, 2.2); blk(g, [-24, 0, -40, -14, -36, 0, -40, 14], C.orange, 2);
    blk(g, [-2, -11, 8, -22, 12, -10], C.yellow, 1.6); g.strokeStyle = C.yellow; g.lineWidth = 1.4; for (let k = 0; k < 3; k++) { g.beginPath(); g.arc(-4 + k * 8, 0, 5, -1, 1); g.stroke(); }
    g.fillStyle = C.ink; g.beginPath(); g.arc(20, -3, 2.2, 0, TAU); g.fill();
    g.restore();
    if (s < 0.15 || s > 0.85) { const sx = s < 0.5 ? 110 : 230; g.strokeStyle = C.white; g.lineWidth = 2; for (let k = 0; k < 3; k++) { g.beginPath(); g.ellipse(sx, 750, 10 + k * 8, 3 + k, 0, Math.PI, TAU); g.stroke(); } }
  }
  // the printed border: red band with yellow four-petal flowers, green corner blocks, the title cartouche and shop seal
  function frame(W, H, S) {
    return XY.cached('kd32-fr:' + S.toFixed(4), W * S, H * S, cv => { const g = cv.getContext('2d'); g.setTransform(S, 0, 0, S, 0, 0);
      g.fillStyle = C.red; g.fillRect(0, 0, W, 18); g.fillRect(0, H - 18, W, 18); g.fillRect(0, 0, 18, H); g.fillRect(W - 18, 0, 18, H);
      const fl = (x, y) => { g.fillStyle = C.yellow; for (let k = 0; k < 4; k++) { const a = k * Math.PI / 2; g.beginPath(); g.ellipse(x + Math.cos(a) * 4, y + Math.sin(a) * 4, 3.4, 2, a, 0, TAU); g.fill(); } g.fillStyle = C.ink; g.beginPath(); g.arc(x, y, 1.6, 0, TAU); g.fill(); };
      for (let x = 34; x < W - 20; x += 32) { fl(x, 9); fl(x, H - 9); } for (let y = 34; y < H - 20; y += 32) { fl(9, y); fl(W - 9, y); }
      [[0, 0], [W - 26, 0], [0, H - 26], [W - 26, H - 26]].forEach(([x, y]) => { g.fillStyle = C.green; g.fillRect(x, y, 26, 26); fl(x + 13, y + 13); });
      g.strokeStyle = C.ink; g.lineWidth = 2.4; g.strokeRect(1.2, 1.2, W - 2.4, H - 2.4); g.strokeRect(18, 18, W - 36, H - 36);
      g.save(); g.translate(38, 34); blk(g, [0, 0, 176, 0, 182, 46, 176, 92, 0, 92, -6, 46], C.orange, 2.6);
      g.fillStyle = C.ink; g.font = XY.font(64, XY.cnFont.wei, 'bold'); g.textBaseline = 'alphabetic'; g.fillText('黑河', 14, 72);
      g.restore(); g.fillStyle = C.ink; g.font = XY.font(24, XY.cnFont.kai, 'bold'); K.vtext(g, '第三十二难', 236, 52, 26); K.seal(g, 250, 190, 30, '年画', '#C81E1E', true);
      K.grain(g, W, H, 320, 900, 'rgba(150,120,70,0.10)', 'rgba(255,252,240,0.25)', 8);
    });
  }
})();
