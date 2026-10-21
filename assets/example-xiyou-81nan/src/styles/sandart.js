// 73 沙画 · 失落兵器 — a lightbox sand painting. Sand darkens the backlight; every highlight is sand pushed away by a
// finger. Night in 玉华州: the pilgrims' weapons glow, a sand whirlwind from 豹头山 tears 金箍棒 and 九齿钉钯 out of
// their hands, the weapons fall apart into grains that stream back to 虎口洞 and settle there (with 降妖宝杖), glowing.
(() => {
  'use strict';
  const XY = window.XY, K = XY.KIT_I, TAU = XY.TAU, { sin, cos, PI, hypot, atan2 } = Math;
  const SAND = '#22110A', THICK = '#2C170B', THIN = '#6E3D1B', MIDT = '#9C5E2A', CLEAR = '#FFE7B4';
  const MOON = [470, 148, 54], CAVE = [990, 330];
  const holes = () => K.speckle('i73holes', 256, 3200, ['#000'], 0.8, 1.7, 731);
  const grit = () => K.speckle('i73grit', 256, 900, ['rgba(30,14,6,0.9)', 'rgba(30,14,6,0.5)'], 1, 2.2, 732);

  // a sand layer at device resolution: paint thickness as black alpha, punch grain holes, tint brown
  const sandLayer = (W, H, scale, paint, holeA = 0.5) => {
    const cv = XY.mk(W * scale, H * scale), s = cv.getContext('2d');
    s.setTransform(scale, 0, 0, scale, 0, 0); s.lineCap = s.lineJoin = 'round'; paint(s, scale);
    s.setTransform(1, 0, 0, 1, 0, 0); s.filter = 'none';
    s.globalCompositeOperation = 'destination-out'; s.globalAlpha = holeA; s.fillStyle = s.createPattern(holes(), 'repeat'); s.fillRect(0, 0, cv.width, cv.height);
    s.globalAlpha = 1; s.globalCompositeOperation = 'source-in'; s.fillStyle = SAND; s.fillRect(0, 0, cv.width, cv.height);
    return cv;
  };
  // a finger dragged through sand: a cleared groove with sand heaped along both edges
  const finger = (s, pts, w, ridge = 0.8) => {
    s.save(); XY.path(s, pts, false); s.strokeStyle = `rgba(0,0,0,${ridge})`; s.lineWidth = w + 3.4; s.stroke();
    s.globalCompositeOperation = 'destination-out'; s.lineWidth = w; s.stroke(); s.restore();
  };
  const fill = (s, pts, a, blur, scale) => { s.save(); s.filter = blur ? `blur(${blur * scale}px)` : 'none'; s.fillStyle = `rgba(0,0,0,${a})`; XY.path(s, pts, true); s.fill(); s.restore(); };
  const ridgeY = x => 470 - 270 * Math.exp(-Math.pow((x - 985) / 150, 2)) - 120 * Math.exp(-Math.pow((x - 1150) / 80, 2)) - 40 * Math.exp(-Math.pow((x - 820) / 60, 2)) + 9 * XY.noise1(x / 23, 4);

  // ------------------------------------------------------------ static: lightbox, night sky, 豹头山, ground
  const bg = (g, W, H, c, scale) => {
    const gr = g.createRadialGradient(W * 0.46, H * 0.46, 30, W * 0.5, H * 0.5, W * 0.72);
    gr.addColorStop(0, '#FFF8DE'); gr.addColorStop(0.3, '#FFDE9C'); gr.addColorStop(0.66, '#F5A853'); gr.addColorStop(1, '#A04E1B');
    g.fillStyle = gr; g.fillRect(0, 0, W, H);
    // far: a thin wash of sand for the night sky (thicker at the top), the moon and stars cleared out of it, the mountain
    g.drawImage(sandLayer(W, H, scale, (s, sc) => {
      const sg = s.createLinearGradient(0, 0, 0, 500); sg.addColorStop(0, 'rgba(0,0,0,0.36)'); sg.addColorStop(1, 'rgba(0,0,0,0.04)');
      s.fillStyle = sg; s.fillRect(0, 0, W, 500);
      for (let k = 0; k < 7; k++) { const y = 60 + k * 58 + 20 * XY.hash(k, 3), x0 = -40 + 300 * XY.hash(k, 4), L = 380 + 300 * XY.hash(k, 5);   // palm-smeared cloud streaks
        const p = []; for (let i = 0; i <= 20; i++) { const x = x0 + L * i / 20; p.push(x, y + 14 * sin(i / 3 + k) + 10 * (i / 20 - 0.5) ** 2 * 40); }
        s.save(); s.filter = `blur(${5 * sc}px)`; s.strokeStyle = 'rgba(0,0,0,0.11)'; s.lineWidth = 16 + 10 * XY.hash(k, 6); XY.path(s, p, false); s.stroke(); s.restore(); }
      const m = []; for (let x = -10; x <= W + 10; x += 8) m.push(x, ridgeY(x) - 34 * Math.exp(-Math.pow((x - 170) / 130, 2)));
      m.push(W + 10, 620, -10, 620);
      const mg = s.createLinearGradient(0, 0, 0, 620); mg.addColorStop(0, 'rgba(0,0,0,0.44)'); mg.addColorStop(0.76, 'rgba(0,0,0,0.44)'); mg.addColorStop(1, 'rgba(0,0,0,0.06)');
      s.save(); s.filter = `blur(${2.2 * sc}px)`; s.fillStyle = mg; XY.path(s, m, true); s.fill(); s.restore();
      for (let k = 0; k < 6; k++) { const x = 800 + k * 62 + 20 * XY.hash(k, 9), y = ridgeY(x) + 50 + 30 * XY.hash(k, 10), p = [];   // finger-drawn rock folds
        for (let i = 0; i <= 8; i++) p.push(x - i * 9, y + i * 11 + 4 * sin(i + k)); finger(s, p, 1.8, 0.22); }
      // 虎口洞: the tiger-mouth cave, thick sand with jagged fangs of rock
      const [cx, cy] = CAVE, mouth = [cx - 52, cy + 30]; for (let k = 0; k <= 12; k++) { const a = PI + k / 12 * PI; mouth.push(cx + cos(a) * 52, cy + 6 + sin(a) * 40); }
      mouth.push(cx + 52, cy + 30); fill(s, mouth, 0.95, 0.8, sc);
      for (let k = 0; k < 6; k++) { const x = cx - 42 + k * 17; fill(s, [x - 6, cy - 22 - 8 * sin(k), x, cy - 6 + 3 * (k % 2), x + 6, cy - 22 - 8 * sin(k)], 0.95, 0, sc); }
      s.save(); s.globalCompositeOperation = 'destination-out'; s.globalAlpha = 0.8;   // fangs of rock cleared in the mouth: 虎口
      for (let k = 0; k < 5; k++) { const x = cx - 34 + k * 17, top = cy - 30 + Math.abs(k - 2) * 6; XY.path(s, [x - 5, top, x + 5, top, x, top + 15 + 3 * (k % 2)], true); s.fill(); }
      for (let k = 0; k < 4; k++) { const x = cx - 26 + k * 17; XY.path(s, [x - 5, cy + 30, x + 5, cy + 30, x, cy + 17], true); s.fill(); }
      s.restore();
      s.save(); s.globalCompositeOperation = 'destination-out';
      s.filter = `blur(${2.5 * sc}px)`; s.beginPath(); s.arc(MOON[0], MOON[1], MOON[2], 0, TAU); s.fill();
      s.filter = 'none'; const r = XY.rng(73); for (let k = 0; k < 60; k++) { const x = r() * W, y = r() * 430; if (hypot(x - MOON[0], y - MOON[1]) < 90 || y > ridgeY(x) - 10) continue; s.beginPath(); s.arc(x, y, 0.9 + 1.6 * r(), 0, TAU); s.fill(); }
      s.restore();
      // a finger spiral around the moon
      const sp = []; for (let i = 0; i <= 90; i++) { const a = i / 90 * TAU * 1.6 + 0.6, rr = MOON[2] + 14 + i * 0.5; sp.push(MOON[0] + cos(a) * rr, MOON[1] + sin(a) * rr * 0.92); }
      finger(s, sp, 3, 0.5);
    }, 0.22), 0, 0, W, H);
    // near: thick sand ground with finger-swept grooves
    g.drawImage(sandLayer(W, H, scale, (s, sc) => {
      const top = [-10, H + 10]; for (let x = -10; x <= W + 10; x += 10) { top.push(x, 699 + 3 * XY.noise1(x / 30, 7)); }
      top.push(W + 10, H + 10); fill(s, top, 0.92, 1.6, sc);
      for (let k = 0; k < 9; k++) { const y = 716 + k * 7.5, p = []; for (let x = -20 + 40 * XY.hash(k, 1); x < W + 20; x += 18) p.push(x, y + 3 * sin(x / 60 + k)); finger(s, p, 1.6 + XY.hash(k, 2) * 1.6, 0.6); }
      for (let k = 0; k < 14; k++) { const x = 30 + k * 84 + 30 * XY.hash(k, 21), y = 706; finger(s, [x, y + 12, x + 4, y - 4, x + 11, y - 14], 1.4, 0.5); finger(s, [x + 14, y + 12, x + 13, y - 2, x + 7, y - 10], 1.2, 0.5); }
    }, 0.4), 0, 0, W, H);
    g.fillStyle = 'rgba(32,15,6,0.75)'; const r = XY.rng(74);   // loose grains on the plate
    for (let k = 0; k < 900; k++) { const x = r() * W, y = Math.pow(r(), 0.6) * H, s = 0.7 + r() * 1.6; g.fillRect(x, y, s, s); }
  };

  // ------------------------------------------------------------ mid: 玉华州 — wall, gate tower, pagoda, the prince's hall
  const WIN = [];
  const roof = (s, cx, y, hw, h, a, sc) => {
    const p = [cx - hw - 14, y - 9, cx - hw, y, cx + hw, y, cx + hw + 14, y - 9, cx + hw * 0.85, y - h * 0.35, cx + hw * 0.7, y - h * 0.75, cx + hw * 0.6, y - h,
      cx - hw * 0.6, y - h, cx - hw * 0.7, y - h * 0.75, cx - hw * 0.85, y - h * 0.35];
    fill(s, p, a, 0.7, sc);
    for (let x = cx - hw + 8; x < cx + hw - 4; x += 9) finger(s, [x, y - h * 0.7 * (1 - Math.abs(x - cx) / hw), x + 1, y - 3], 1.1, 0.25);
    fill(s, [cx - hw * 0.62 - 4, y - h - 2, cx - hw * 0.62 - 9, y - h - 12, cx - hw * 0.62 + 2, y - h], a, 0, sc);
    fill(s, [cx + hw * 0.62 + 4, y - h - 2, cx + hw * 0.62 + 9, y - h - 12, cx + hw * 0.62 - 2, y - h], a, 0, sc);
  };
  const clearBox = (s, x, y, w, h) => { WIN.push([x, y, w, h]); s.save(); s.globalCompositeOperation = 'destination-out'; s.fillRect(x, y, w, h); s.restore(); };
  const city = (W, H, S) => XY.cached('i73city:' + S.toFixed(4), W * S, H * S, cv => {
    WIN.length = 0;
    cv.getContext('2d').drawImage(sandLayer(W, H, S, (s, sc) => {
      const A = 0.6;
      // pagoda inside the walls, seven tiers
      for (let k = 0; k < 7; k++) { const yb = 592 - k * 30, w = 60 - k * 6; fill(s, [110 - w * 0.36, yb, 110 - w * 0.36, yb - 22, 110 + w * 0.36, yb - 22, 110 + w * 0.36, yb], A, 0.6, sc); roof(s, 110, yb - 20, w / 2 + 4, 9, A, sc); clearBox(s, 107, yb - 16, 6, 9); }
      s.fillStyle = `rgba(0,0,0,${A})`; s.fillRect(108.5, 330, 3, 46); [338, 350, 362].forEach(y => { s.beginPath(); s.arc(110, y, 5, 0, TAU); s.fill(); });
      // trees
      [[452, 566, 34], [500, 574, 26], [205, 572, 30]].forEach(([x, y, r], k) => { fill(s, XY.wobble(XY.ellipse(x, y, r, r * 0.8, 24), 5, k + 40, 0.08), 0.52, 1.4, sc);
        const sp = []; for (let i = 0; i <= 40; i++) { const a = i / 40 * TAU * 2, rr = r * 0.75 * (1 - i / 48); sp.push(x + cos(a) * rr, y + sin(a) * rr * 0.75); } finger(s, sp, 1.4, 0.2); });
      // the prince's hall (王府) where the weapons were laid out
      fill(s, [492, 594, 492, 524, 712, 524, 712, 594], A, 0.8, sc); roof(s, 602, 526, 122, 36, A, sc);
      for (let k = 0; k < 6; k++) clearBox(s, 512 + k * 33, 540, 14, 22);
      // the wall and its crenellations, the gate with a cleared arch
      const wall = [-20, 712, -20, 590]; for (let x = -20; x < 770; x += 28) wall.push(x, 590, x, 576, x + 15, 576, x + 15, 590);
      wall.push(770, 590, 770, 712); fill(s, wall, A + 0.08, 1, sc);
      for (let y = 604; y < 700; y += 16) finger(s, [-20, y, 770, y + 1.5], 0.9, 0.18);
      // gate tower: two storeys of eaves
      fill(s, [264, 592, 264, 528, 376, 528, 376, 592], A, 0.8, sc); roof(s, 320, 530, 80, 26, A, sc);
      fill(s, [288, 506, 288, 486, 352, 486, 352, 506], A, 0.6, sc); roof(s, 320, 488, 60, 24, A, sc);
      clearBox(s, 280, 546, 16, 22); clearBox(s, 312, 546, 16, 22); clearBox(s, 344, 546, 16, 22); clearBox(s, 304, 490, 10, 11); clearBox(s, 326, 490, 10, 11);
      const arch = [300, 702]; for (let k = 0; k <= 10; k++) { const a = PI + k / 10 * PI; arch.push(320 + cos(a) * 20, 650 + sin(a) * 22); } arch.push(340, 702);
      s.save(); s.globalCompositeOperation = 'destination-out'; s.globalAlpha = 0.85; XY.path(s, arch, true); s.fill(); s.restore(); finger(s, arch, 1.2, 0.6);
    }, 0.42), 0, 0);
  });

  // ------------------------------------------------------------ the title patch: palm-spread sand, 「失」 written by a finger
  const PATCH = [36, 34, 300, 330];
  const patch = (S, written) => XY.cached(`i73patch:${written}:${S.toFixed(4)}`, PATCH[2] * S, PATCH[3] * S, cv => {
    cv.getContext('2d').drawImage(sandLayer(PATCH[2], PATCH[3], S, (s, sc) => {
      fill(s, XY.wobble(XY.ellipse(148, 168, 104, 122, 40, -0.12), 18, 5, 0.03), 0.62, 11, sc);   // one palm-spread mound, soft all round
      for (let k = 0; k < 6; k++) { const cx = 110 + 80 * XY.hash(k, 61), cy = 90 + 150 * XY.hash(k, 62);
        fill(s, XY.wobble(XY.ellipse(cx, cy, 40 + 26 * XY.hash(k, 63), 34 + 26 * XY.hash(k, 64), 22), 8, k, 0.05), 0.3, 8, sc); }
      for (let k = 0; k < 5; k++) { const y = 80 + k * 44; s.save(); s.filter = `blur(${2.5 * sc}px)`; s.strokeStyle = 'rgba(0,0,0,0.28)'; s.lineWidth = 14; XY.path(s, [70 + 10 * k, y, 150, y + 8, 236 - 12 * k, y - 5], false); s.stroke(); s.restore(); }
      if (!written) return;
      s.font = XY.font(176, XY.cnFont.xing, 'bold'); s.textAlign = 'center'; s.textBaseline = 'alphabetic';
      s.strokeStyle = 'rgba(0,0,0,0.85)'; s.lineWidth = 7; s.strokeText('失', 140, 214);
      fill(s, XY.wobble(XY.densify([44, 258, 236, 252, 240, 300, 40, 304], 12, true), 4, 9, 0.06), 0.92, 2, sc);
      s.font = XY.font(36, XY.cnFont.xing, 'bold'); s.lineWidth = 3.4; s.strokeText('第七十三难', 140, 290);
      s.globalCompositeOperation = 'destination-out'; s.font = XY.font(176, XY.cnFont.xing, 'bold'); s.fillText('失', 140, 214);
      s.font = XY.font(36, XY.cnFont.xing, 'bold'); s.fillText('第七十三难', 140, 290);
    }, 0.5), 0, 0);
  });

  // ------------------------------------------------------------ the pilgrims in three thicknesses of sand; hairlines are finger-cleared
  const TONE = { fur: THICK, face: THIN, wkshirt: THICK, tiger: THIN, stripe: THICK, gold: CLEAR, staff: THIN, ink: THICK, horse: MIDT, horse2: THIN, mane: THIN,
    hoof: THICK, saddle: THICK, red: THICK, robe: THIN, kasaya: THICK, skin: MIDT, metal: THIN, bjrobe: THICK, bjpants: THICK, pig: MIDT, pig2: THIN, wood: THIN,
    ssrobe: THICK, ssrobe2: THICK, skin2: THIN, ssh: THICK, ssbeard: THICK, skull: CLEAR, bundle: THIN };
  // v10 timing (8 beats): glow 1.0–3.0, the lion's eyes 2.4, the whirlwind 3.0–5.6 (reaches them at 4.2), the theft TB = 4.5 (hit):
  // the three weapons are torn from the hands and hang, enlarged, at the edge of the vortex, then fall apart into grains (5.0)
  // that stream into 虎口洞 and settle as a big crossed trophy (LAND = 6.3, hit)
  const TB = 4.5, BREAK = 5.0, LAND = 6.3;
  const actsAt = b => ({ wukong: { raise: 0.8 * XY.smooth(K.win(b, 3.4, 4.1)) * (1 - XY.smooth(K.win(b, 4.5, 4.9))), shade: XY.smooth(K.win(b, 5.0, 5.5)) * (1 - 0.6 * K.win(b, 7.2, 8)) },
    monk: { palm: XY.smooth(K.win(b, 4.6, 5.1)) }, bajie: { scratch: XY.smooth(K.win(b, 5.6, 6.2)) }, shaseng: { lift: XY.smooth(K.win(b, 4.3, 4.6)) * (1 - XY.smooth(K.win(b, 5.2, 5.8))) } });
  const bez = (a, b, c, d, u) => { const v = 1 - u; return v * v * v * a + 3 * v * v * u * b + 3 * v * u * u * c + u * u * u * d; };
  const gustAt = (tau, V) => tau < 0.5 ? [bez(CAVE[0], 880, V[0] + 160, V[0], tau * 2), bez(CAVE[1], 240, V[1] - 140, V[1], tau * 2)]
    : [bez(V[0], V[0] - 140, 760, CAVE[0], tau * 2 - 1), bez(V[1], V[1] + 30, 220, CAVE[1], tau * 2 - 1)];
  // the weapons as point lists in their own frame (x along the shaft, 0 → 1 = butt → head), scaled when drawn
  const shapes = (() => { const r = XY.rng(7303), S = { staff: [], rake: [], zhang: [] };
    for (let i = 0; i < 150; i++) S.staff.push([i / 149, (r() - 0.5) * 0.045]);
    for (let i = 0; i < 90; i++) S.rake.push([-0.1 + 1.1 * i / 89, (r() - 0.5) * 0.03]);
    for (let i = 0; i < 40; i++) S.rake.push([1 + (r() - 0.5) * 0.02, (i / 39 - 0.5) * 0.32]);
    for (let k = 0; k < 9; k++) for (let i = 1; i <= 5; i++) S.rake.push([1 - i * 0.022, ((k / 8 - 0.5) * 0.32) - i * 0.012]);
    for (let i = 0; i < 120; i++) S.zhang.push([i / 119, (r() - 0.5) * 0.04]);
    for (let i = 0; i < 40; i++) { const a = i / 40 * TAU; S.zhang.push([1.06 + cos(a) * 0.07, sin(a) * 0.07]); }
    return S; })();
  // pose = [x0, y0, x1, y1] butt → head in panel units
  const ptOn = (p, q) => { const dx = p[2] - p[0], dy = p[3] - p[1]; return [p[0] + dx * q[0] - dy * q[1], p[1] + dy * q[0] + dx * q[1]]; };
  const HANG = { staff: [700, 470, 840, 300], rake: [620, 300, 760, 420], zhang: [790, 470, 940, 470] };   // spread at the vortex edge, about half a pilgrim tall
  const TROPHY = { staff: [912, 410, 1068, 236], rake: [1068, 410, 920, 246], zhang: [918, 414, 1062, 414] };
  let SRC = null;
  const handPoses = e => {
    if (SRC && SRC.n === e.cell.n) return SRC;
    const tb = e.cell.t0 + (TB - 0.1) * XY.BEAT, ph = XY.walkPhase(tb), px = XY.procWorldX(tb) - e.cell.x, A = actsAt(TB - 0.1);
    const at = k => { const p = XY.anchor(k, ph, A); return [px + p[0], e.groundY + p[1]]; };
    const s0 = at('wukong.staffTip'), s1 = at('wukong.staffEnd'), bh = at('bajie.hand'), rh = at('bajie.rakeHead'), sh = at('shaseng.bundleR');
    return (SRC = { n: e.cell.n, pose: { staff: [s0[0], s0[1], s1[0], s1[1]], rake: [bh[0], bh[1], rh[0], rh[1]], zhang: [sh[0] - 70, sh[1] - 10, sh[0] + 70, sh[1] - 10] }, V: [HANG.staff[0] + 40, 380] });
  };
  const lerpPose = (a, b, v) => a.map((x, i) => XY.lerp(x, b[i], v));
  const drawWeapon = (g, k, pose, lw, col, alpha) => { g.save(); g.globalAlpha = alpha; g.strokeStyle = col; g.fillStyle = col; g.lineCap = 'round';
    const P = q => ptOn(pose, q), ln = (a, b, w) => { const A = P(a), B = P(b); g.lineWidth = w; g.beginPath(); g.moveTo(A[0], A[1]); g.lineTo(B[0], B[1]); g.stroke(); };
    if (k === 'staff') { ln([0, 0], [1, 0], lw); ln([0, 0], [0.09, 0], lw * 1.7); ln([0.91, 0], [1, 0], lw * 1.7); }
    else if (k === 'rake') { ln([-0.1, 0], [1, 0], lw * 0.8); ln([1, -0.17], [1, 0.17], lw); for (let j = 0; j < 9; j++) { const y = (j / 8 - 0.5) * 0.32; ln([1, y], [0.89, y - 0.06], lw * 0.5); } }
    else { ln([0, 0], [1, 0], lw * 0.9); const c = P([1.06, 0]), r = Math.hypot(pose[2] - pose[0], pose[3] - pose[1]) * 0.07; g.lineWidth = lw * 0.6; g.beginPath(); g.arc(c[0], c[1], r, 0, TAU); g.stroke(); ln([0.82, -0.03], [0.82, 0.03], lw * 1.2); }
    g.restore(); };

  XY.STYLES.sandart = {
    bg,
    hits: [TB, LAND],
    draw(g, e) {
      const { W, H, t, u, beat, S } = e, src = handPoses(e), stolen = beat >= TB, A = Object.assign(actsAt(beat), stolen ? { cast: { staff: false } } : {});
      // mid: the city, poured in from the left behind a falling stream of sand
      const rv = XY.easeIO(K.win(u, -0.42, 0.14)), fx = -60 + (W + 140) * rv, cv = city(W, H, S), front = y => fx + 26 * sin(y / 80 + 1.3);
      if (rv > 0) { g.save(); if (rv < 1) { g.beginPath(); g.moveTo(-10, -10); for (let y = -10; y <= H + 10; y += 30) g.lineTo(front(y), y); g.lineTo(-10, H + 10); g.clip(); }
        g.drawImage(cv, 0, 0, W, H); g.restore(); }
      g.fillStyle = THICK;
      WIN.forEach(([x, y, w, h], k) => { if (x > fx) return; const f = 0.5 + 0.5 * XY.noise1(t * 5 + k * 3.1, 9); if (f < 0.4) return; g.globalAlpha = 0.6 * (f - 0.4); g.fillRect(x, y, w, h); });
      g.globalAlpha = 1;
      if (rv > 0 && rv < 1) { const r = XY.rng(Math.floor(t * 30) + 11); g.fillStyle = SAND;
        for (let k = 0; k < 110; k++) { const y = r() * 600, x = front(y) + (r() - 0.5) * 12 * (y / 600 + 0.3); g.fillRect(x, y, 1.8, 1.8); }
        g.globalAlpha = 0.45; g.fillRect(front(300) - 1, 0, 2, 600); g.globalAlpha = 1; }
      // the title patch: spread by the palm, then written by the finger, top to bottom
      const pa = XY.smooth(K.win(u, -0.48, -0.28)), wr = XY.easeOut(K.win(u, -0.12, 0.24)), yw = PATCH[1] + (wr > 0 ? 40 + 260 * wr : 0);
      if (pa > 0) { g.save(); g.globalAlpha = pa; g.beginPath(); g.rect(0, yw, W, H); g.clip(); g.drawImage(patch(S, 0), PATCH[0], PATCH[1], PATCH[2], PATCH[3]); g.restore(); }
      if (wr > 0) { g.save(); g.beginPath(); g.rect(0, 0, W, yw); g.clip(); g.drawImage(patch(S, 1), PATCH[0], PATCH[1], PATCH[2], PATCH[3]); g.restore(); }
      // the finger circling the moon, twinkling pinholes
      g.lineCap = 'round'; const ma = t * 0.9;
      g.strokeStyle = CLEAR; g.globalAlpha = 0.8; g.lineWidth = 2.8; g.beginPath(); g.ellipse(MOON[0], MOON[1], MOON[2] + 7, MOON[2] + 6, 0, ma, ma + 1.5); g.stroke();
      g.strokeStyle = THICK; g.globalAlpha = 0.45; g.lineWidth = 1.5; g.beginPath(); g.ellipse(MOON[0], MOON[1], MOON[2] + 10.5, MOON[2] + 9.5, 0, ma, ma + 1.5); g.stroke();
      g.strokeStyle = CLEAR; g.lineWidth = 1.4;
      for (let k = 0; k < 8; k++) { const x = 360 + 560 * XY.hash(k, 81), y = 40 + 160 * XY.hash(k, 82), tw = Math.pow(0.5 + 0.5 * sin(t * 3.5 + k * 2.3), 6); if (tw < 0.05) continue;
        g.globalAlpha = tw; g.beginPath(); g.moveTo(x - 6, y); g.lineTo(x + 6, y); g.moveTo(x, y - 6); g.lineTo(x, y + 6); g.stroke(); }
      g.globalAlpha = 1;
      // 黄狮精 in 虎口洞: eyes catch the glow, later a mane of sand
      const eye = Math.max(K.hit(beat, 2.4, 2.2), beat > LAND ? 0.6 + 0.4 * K.hit(beat, LAND, 2) : 0), mane = XY.smooth(K.win(beat, LAND - 0.2, LAND + 0.6));
      if (mane > 0) { g.strokeStyle = THICK; g.lineWidth = 7;
        for (let k = 0; k < 15; k++) { const a = PI + 0.12 + k / 14 * (PI - 0.24), r0 = 46, r1 = r0 + (18 + 16 * XY.hash(k, 90)) * mane, wv = 0.16 * sin(t * 3 + k), cy = CAVE[1] + 10;
          g.globalAlpha = 0.85 * mane; g.beginPath(); g.moveTo(CAVE[0] + cos(a) * r0, cy + sin(a) * r0 * 0.8);
          g.quadraticCurveTo(CAVE[0] + cos(a + wv) * (r0 + r1) / 2, cy + sin(a + wv) * (r0 + r1) / 2 * 0.8, CAVE[0] + cos(a + 2 * wv) * r1, cy + sin(a + 2 * wv) * r1 * 0.8); g.stroke(); }
        g.globalAlpha = 1; }
      if (eye > 0.02) { const gr = g.createRadialGradient(CAVE[0], CAVE[1] + 6, 2, CAVE[0], CAVE[1] + 6, 40); gr.addColorStop(0, `rgba(255,231,180,${0.5 * eye})`); gr.addColorStop(1, 'rgba(255,231,180,0)');
        g.fillStyle = gr; g.fillRect(CAVE[0] - 40, CAVE[1] - 34, 80, 80);
        g.fillStyle = CLEAR; g.globalAlpha = eye; [-15, 15].forEach(dx => { g.beginPath(); g.ellipse(CAVE[0] + dx, CAVE[1] + 6, 9.5, 3.4, dx * -0.016, 0, TAU); g.fill(); }); g.globalAlpha = 1; }
      // grains creeping along the ground
      g.fillStyle = SAND; g.globalAlpha = 0.85;
      for (let k = 0; k < 80; k++) { const sp = 30 + 50 * XY.hash(k, 106), x = ((XY.hash(k, 105) * (W + 60) + t * sp) % (W + 60)) - 30, y = 703 + 9 * XY.hash(k, 107) - 2.5 * Math.abs(sin(t * 4 + k)); g.fillRect(x, y, 1.6, 1.6); }
      g.globalAlpha = 1;
      // the weapons shine (霞光): sand cleared into a halo and a beam to the sky
      const glow = stolen ? 0 : XY.smooth(K.win(beat, 1.0, 2.0));
      const sa = e.at('wukong.staffEnd', A), sb = e.at('wukong.staffTip', A), lights = [[(sa[0] + sb[0]) / 2, (sa[1] + sb[1]) / 2], e.at('bajie.rakeHead', A)];
      if (glow > 0) lights.forEach(c => {
        const gr = g.createRadialGradient(c[0], c[1], 4, c[0], c[1], 95); gr.addColorStop(0, `rgba(255,236,190,${0.8 * glow})`); gr.addColorStop(1, 'rgba(255,236,190,0)'); g.fillStyle = gr; g.fillRect(c[0] - 95, c[1] - 95, 190, 190);
        const bm = g.createLinearGradient(0, c[1], 0, 0); bm.addColorStop(0, `rgba(255,236,190,${0.45 * glow})`); bm.addColorStop(1, 'rgba(255,236,190,0)'); g.fillStyle = bm;
        g.beginPath(); g.moveTo(c[0] - 6, c[1]); g.lineTo(c[0] - 30, 0); g.lineTo(c[0] + 30, 0); g.lineTo(c[0] + 6, c[1]); g.fill(); });
      // the procession in sand, with a soft scatter of loose grains around it
      const [pl, pg] = K.layer(e, 'i73proc');
      // the white horse is thin sand with a heaped edge, so it still reads light
      const horsePart = (ctx, p, c, fi, pi, tag) => { if (tag !== 'horse' || p.k !== 'poly' || (p.role !== 'horse' && p.role !== 'horse2' && p.role !== 'mane')) return false;
        XY.path(ctx, p.pts, true); ctx.fillStyle = p.role === 'horse' ? '#D79D5A' : p.role === 'mane' ? '#B57538' : '#C2864A'; ctx.fill(); ctx.strokeStyle = THICK; ctx.lineWidth = 1.5; ctx.stroke(); return true; };
      K.draw(pg, e.phase, e.procX, e.groundY, { part: horsePart, color: (r, p, fi, tag) => ((tag === 'staff' || tag === 'rake') && glow > 0.4) || p.fine ? CLEAR : TONE[r] || THICK, shade: 'rgba(20,8,2,0.35)' },
        A, { skip: (fi, pi, p, tag) => stolen && (tag === 'staff' || tag === 'rake') });
      K.texture(pl, holes(), 0.22, 'destination-out');
      g.save(); g.filter = `blur(${2.4 * S}px)`; K.blit(g, pl, 0.55); g.restore(); K.blit(g, pl);
      if (glow > 0) { g.strokeStyle = CLEAR; g.lineWidth = 1.8; lights.forEach((c, j) => { for (let k = 0; k < 14; k++) { const a = k / 14 * TAU + t * 0.4 * (j ? -1 : 1), l = 20 + 34 * (0.6 + 0.4 * sin(t * 6 + k * 1.7));
        g.globalAlpha = 0.75 * glow; g.beginPath(); g.moveTo(c[0] + cos(a) * 18, c[1] + sin(a) * 18); g.lineTo(c[0] + cos(a) * (18 + l), c[1] + sin(a) * (18 + l)); g.stroke(); } }); g.globalAlpha = 1; }
      // the whirlwind from 豹头山: a vortex of grains with finger swipes through it
      const gs = beat < 4.2 ? 0.5 * K.win(beat, 3.0, 4.2) : beat < 5.0 ? 0.5 : 0.5 + 0.5 * K.win(beat, 5.0, 5.9);
      if (gs > 0 && gs < 1) {
        const env = sin(PI * gs), C = gustAt(gs, src.V), p = new Path2D();
        const core = g.createRadialGradient(C[0], C[1], 4, C[0], C[1], 150 * (0.4 + 0.6 * env)); core.addColorStop(0, `rgba(34,17,10,${0.55 * env})`); core.addColorStop(1, 'rgba(34,17,10,0)');
        g.save(); g.translate(C[0], C[1]); g.scale(1.5, 0.75); g.translate(-C[0], -C[1]); g.fillStyle = core; g.fillRect(C[0] - 160, C[1] - 160, 320, 320); g.restore();
        for (let k = 0; k < 1500; k++) { const h1 = XY.hash(k, 111), h2 = XY.hash(k, 112), h3 = XY.hash(k, 113), w = TAU * 3.2 * (0.7 + 0.6 * h2), a = h1 * TAU + gs * w, rr = (10 + 130 * h3) * (0.3 + 0.7 * env);
          const x = C[0] + cos(a) * rr * 1.5, y = C[1] + sin(a) * rr * 0.7 - (h3 - 0.5) * 80 * env, a2 = a - 0.09;   // each grain streaks along its orbit
          p.moveTo(x, y); p.lineTo(C[0] + cos(a2) * rr * 1.5, C[1] + sin(a2) * rr * 0.7 - (h3 - 0.5) * 80 * env); }
        g.strokeStyle = SAND; g.lineWidth = 2; g.stroke(p);
        g.strokeStyle = CLEAR; g.lineWidth = 3;
        for (let j = 0; j < 5; j++) { const rr = (26 + j * 20) * (0.4 + 0.6 * env), a0 = gs * TAU * 2.4 + j * 1.3; g.globalAlpha = 0.65 * env; g.beginPath(); g.ellipse(C[0], C[1], rr * 1.5, rr * 0.7, 0, a0, a0 + 1.2); g.stroke(); }
        g.globalAlpha = 1;
      }
      // the theft: torn from the hands (TB), hung big and glowing at the vortex edge, burst into grains (BREAK), settled as a trophy (LAND)
      if (stolen) { const KS = ['staff', 'rake', 'zhang'], hang = (k, b) => { const P = HANG[k], cx = (P[0] + P[2]) / 2, cy = (P[1] + P[3]) / 2, a = 0.18 * sin(t * 2.6 + KS.indexOf(k) * 2) + 0.5 * (b - TB), c = cos(a), sn = sin(a);
          const r = (x, y) => [cx + (x - cx) * c - (y - cy) * sn, cy + (x - cx) * sn + (y - cy) * c], A0 = r(P[0], P[1]), B0 = r(P[2], P[3]); return [A0[0], A0[1], B0[0], B0[1]]; };
        if (beat < BREAK) { const v = XY.easeOut(K.win(beat, TB, TB + 0.3));
          KS.forEach(k => { const pose = lerpPose(src.pose[k], hang(k, beat), v), c = [(pose[0] + pose[2]) / 2, (pose[1] + pose[3]) / 2];
            const gr = g.createRadialGradient(c[0], c[1], 6, c[0], c[1], 130); gr.addColorStop(0, 'rgba(255,236,190,0.65)'); gr.addColorStop(1, 'rgba(255,236,190,0)'); g.fillStyle = gr; g.fillRect(c[0] - 130, c[1] - 130, 260, 260);
            drawWeapon(g, k, pose, 12, THICK, 0.9); drawWeapon(g, k, pose, 7, CLEAR, 1); }); }
        const fly = new Path2D(), lit = new Path2D(), bp = {}; KS.forEach(k => { bp[k] = hang(k, BREAK); });
        if (beat >= BREAK && beat < LAND + 0.4) KS.forEach((k, w) => shapes[k].forEach((q, i) => { const d = 0.35 * XY.hash(i, w, 5), tau = K.win(beat, BREAK + d, BREAK + d + 0.95), S0 = ptOn(bp[k], q), T0 = ptOn(TROPHY[k], q);
          if (tau >= 1) { lit.rect(T0[0] - 1.6, T0[1] - 1.6, 3.2, 3.2); return; }
          const h = XY.hash(i, w, 6), h2 = XY.hash(i, w, 7), pos = vv => { const wv = 16 * sin(PI * vv) * sin(i * 1.7 + vv * 9), ww = XY.easeIO(vv), burst = 40 * sin(PI * Math.min(1, vv * 3)) * (h - 0.5);
            return [bez(S0[0], S0[0] + 60 + 80 * h, T0[0] - 90 - 60 * h2, T0[0], ww) + wv + burst, bez(S0[1], S0[1] - 160 - 60 * h2, T0[1] - 150, T0[1], ww) - wv * 0.5 + burst * 0.6]; };
          const a2 = pos(tau), b2 = pos(Math.max(0, tau - 0.02)); fly.moveTo(b2[0], b2[1]); fly.lineTo(a2[0] + 0.01, a2[1]); }));
        g.strokeStyle = SAND; g.lineWidth = 2.6; g.lineCap = 'round'; g.stroke(fly);
        const la = K.win(beat, LAND - 0.5, LAND + 0.2);
        if (la > 0) { const gr = g.createRadialGradient(990, 360, 6, 990, 360, 170); gr.addColorStop(0, `rgba(255,236,190,${0.5 * la})`); gr.addColorStop(1, 'rgba(255,236,190,0)'); g.fillStyle = gr; g.fillRect(820, 190, 340, 340); }
        g.fillStyle = CLEAR; g.fill(lit);
        if (beat >= LAND) { const v = XY.smooth(K.win(beat, LAND, LAND + 0.4)); KS.forEach(k => { drawWeapon(g, k, TROPHY[k], 10, THICK, 0.8 * v); drawWeapon(g, k, TROPHY[k], 6, CLEAR, v); }); }
      }
    },
  };
})();
