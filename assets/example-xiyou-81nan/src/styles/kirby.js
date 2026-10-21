// 62 美漫 Kirby · 怪分三色 — a 1965 cosmic splash page: violet space with magenta dots, radiating lines, Kirby krackle,
// heavy black spotting, colour plates printed a hair off the key line. The three demons of 狮驼洞 loom over the road,
// each in its own colour of energy: 青狮 green, 白象 white with yellow tusks, 大鹏 gold. Beat 2 the elephant's trunk
// whips down and hoists 八戒 (legs still walking); beat 3 悟空's staff lands on the trunk — 轰!! — and 八戒 drops.
(() => {
  'use strict';
  const XY = window.XY, K = XY.KIT_G, TAU = XY.TAU;
  const BK = '#121012', WH = '#FFFDF4', YL = '#FFD52E', RD = '#E8352A', GR = '#3DBE52', GR2 = '#23853A', GD = '#F4B41E', GD2 = '#D9771C', EL = '#ECE8F4', EL2 = '#A9A4C8', VI = '#3A1E6E';
  const GRAB = 3, HIT = 4.5, ROAR = 1.9, OFF = [2.5, 1.8];   // v10: 8 beats — demons pop in 0.2/0.6/1.0, lion roars 1.9, trunk grabs 八戒 3, 悟空 smashes it 4.5
  const LION = [262, 330], ROC = [650, 176], ELE = [990, 222];

  // colour plate offset from the key line, Kirby-thick outline
  const ink = (g, pts, fill, lw = 4.5) => { if (fill) { g.save(); g.translate(OFF[0], OFF[1]); XY.path(g, pts, true); g.fillStyle = fill; g.fill(); g.restore(); }
    XY.path(g, pts, true); g.strokeStyle = BK; g.lineWidth = lw; g.lineJoin = 'round'; g.stroke(); };
  const blot = (g, pts) => { XY.path(g, pts, true); g.fillStyle = BK; g.fill(); };
  // Kirby krackle: a cluster of black dots, bigger toward the centre, reseeded 12 times a second
  const krackle = (g, cx, cy, R, n, seed, t, col = BK) => { const r = XY.rng(seed * 131 + K.step(t, 12)); g.fillStyle = col;
    for (let i = 0; i < n; i++) { const d = R * Math.pow(r(), 0.7), a = r() * TAU, rr = R * (0.05 + 0.2 * (1 - d / R)) * (0.8 + 0.4 * Math.sin(t * 18 + i)); g.beginPath(); g.arc(cx + Math.cos(a) * d, cy + Math.sin(a) * d, Math.max(1.2, rr), 0, TAU); g.fill(); } };
  const aura = (g, x, y, r, col, seed, t) => { const p = 1 + 0.05 * Math.sin(t * 7 + seed);
    ink(g, K.burst(x, y, r * 0.86 * p, r * 1.1 * p, 22, seed + K.step(t, 6) % 3, t * 0.15, 0.22), col, 4);
    for (let k = 0; k < 5; k++) { const a = k / 5 * TAU + t * 0.4 + seed, d = r * (0.95 + 0.1 * Math.sin(t * 3 + k)); krackle(g, x + Math.cos(a) * d, y + Math.sin(a) * d, 26, 14, seed * 10 + k, t); } };

  // ------------------------------------------------------------ the three demons
  const lion = (g, t, roar) => { const [x, y] = LION; g.save(); g.translate(x, y);
    // mane: a ring of curled locks (Kirby / Lichtenstein C-curls), jagged back edge
    ink(g, K.burst(0, 4, 112, 150, 17, 621, Math.sin(t * 3) * 0.04, 0.3), GR2, 5);
    for (let k = 0; k < 16; k++) { const a = k / 16 * TAU + 0.1 * Math.sin(t * 3 + k) * roar, cx = Math.cos(a) * 104, cy = 8 + Math.sin(a) * 108, r = 30 + 4 * Math.sin(k * 2.3);
      ink(g, XY.ellipse(cx, cy, r, r, 14), k % 2 ? GR : '#52CF63', 4); g.strokeStyle = BK; g.lineWidth = 4.5; g.beginPath(); g.arc(cx, cy, r * 0.62, a + 0.6, a + 4.6); g.stroke(); g.lineWidth = 3; g.beginPath(); g.arc(cx, cy, r * 0.25, a + 2, a + 5.5); g.stroke(); }
    ink(g, XY.ellipse(0, 12, 76, 80, 26), '#8DD26E', 5);
    blot(g, [-64, -24, -12, -6, -16, 6, -60, -6]); blot(g, [64, -24, 12, -6, 16, 6, 60, -6]);
    ink(g, XY.ellipse(-30, 8, 14, 10, 14), YL, 3); ink(g, XY.ellipse(30, 8, 14, 10, 14), YL, 3); g.fillStyle = BK; g.beginPath(); g.arc(-27, 9, 5.5, 0, TAU); g.arc(33, 9, 5.5, 0, TAU); g.fill();
    // a broad lion's muzzle: two puffed cheek pads with whisker dots, the big dark nose pad on top
    ink(g, XY.ellipse(-20, 50, 26, 20, 16), '#B6E39A', 4); ink(g, XY.ellipse(20, 50, 26, 20, 16), '#B6E39A', 4);
    g.fillStyle = BK; [[-30, 46], [-20, 54], [-34, 56], [30, 46], [20, 54], [34, 56]].forEach(([a, b2]) => { g.beginPath(); g.arc(a, b2, 2.4, 0, TAU); g.fill(); });
    ink(g, XY.RIG.spline([-26, 16, 26, 16, 22, 30, 0, 42, -22, 30], true, 4), '#23302A', 4); g.fillStyle = WH; g.beginPath(); g.ellipse(-10, 22, 6, 3, -0.3, 0, TAU); g.fill();
    const m = 14 + 22 * roar; ink(g, [-34, 68, 34, 68, 22, 68 + m, -22, 68 + m], '#7A1420', 4);
    g.fillStyle = WH; [[-28, 68, -22, 82], [28, 68, 22, 82]].forEach(([a, b2, c, d]) => { g.beginPath(); g.moveTo(a, b2); g.lineTo(a + (a < 0 ? 12 : -12), b2); g.lineTo(c, d + 6 * roar); g.fill(); });
    g.restore(); };
  const roc = (g, t) => { const [x, y] = ROC, f = Math.sin(t * 6) * 0.18; g.save(); g.translate(x, y);
    [-1, 1].forEach(sd => { g.save(); g.scale(sd, 1); g.rotate(-f); const w = [20, -10, 90, -80, 200, -110, 250, -70, 230, -50, 210, -30, 186, -14, 160, 2, 130, 12, 90, 18, 30, 20];
      ink(g, XY.RIG.spline(w, true, 3), GD, 5); blot(g, [40, 18, 90, 16, 130, 10, 160, 0, 120, 4, 70, 8]);
      g.strokeStyle = BK; g.lineWidth = 3; for (let k = 0; k < 5; k++) { const a = 150 + k * 22; g.beginPath(); g.moveTo(a - 40, -40 + k * 6); g.lineTo(a + 10, -6 + k * 3); g.stroke(); }
      ink(g, [196, -60, 250, -70, 230, -50], GD2, 3); g.restore(); });
    ink(g, XY.ellipse(0, 10, 34, 50, 20), GD2, 5); ink(g, XY.ellipse(0, -46, 26, 24, 18), GD, 4.5);
    ink(g, [-10, -70, -4, -96, 4, -74, 12, -100, 16, -68], RD, 3.5);
    ink(g, [-8, -40, 8, -40, 4, -14, 0, -6, -4, -14], '#E9852A', 3.5);
    ink(g, XY.ellipse(-12, -50, 7, 6, 12), WH, 2.5); ink(g, XY.ellipse(12, -50, 7, 6, 12), WH, 2.5); g.fillStyle = RD; g.beginPath(); g.arc(-11, -49, 3, 0, TAU); g.arc(11, -49, 3, 0, TAU); g.fill();
    blot(g, [-22, -60, -2, -52, -4, -56, -20, -64]); blot(g, [22, -60, 2, -52, 4, -56, 20, -64]);
    g.restore(); };
  const elephant = (g, t) => { const [x, y] = ELE, fl = Math.sin(t * 2.4) * 0.06; g.save(); g.translate(x, y);
    [-1, 1].forEach(sd => { g.save(); g.scale(sd, 1); g.rotate(fl * sd); ink(g, XY.RIG.spline([40, -50, 120, -80, 170, -30, 160, 50, 110, 90, 60, 60], true, 4), EL, 5); blot(g, [110, 86, 160, 46, 150, 70, 116, 94]); g.restore(); });
    ink(g, XY.RIG.spline([-60, -60, 0, -90, 60, -60, 64, 20, 30, 70, -30, 70, -64, 20], true, 4), EL, 5);
    [-1, 1].forEach(sd => { ink(g, [sd * 26, 56, sd * 34, 64, sd * 64, 120, sd * 70, 150, sd * 52, 116], YL, 3.5); });
    // Kirby eye sockets: heavy black shields, a white eye, a small pupil, an angry brow
    [-1, 1].forEach(sd => { blot(g, [sd * 12, -6, sd * 50, -20, sd * 56, 4, sd * 44, 22, sd * 14, 18]); ink(g, XY.ellipse(sd * 32, 6, 12, 9, 14), WH, 2.5);
      g.fillStyle = BK; g.beginPath(); g.arc(sd * 28, 7, 4.5, 0, TAU); g.fill(); blot(g, [sd * 8, -14, sd * 60, -32, sd * 62, -22, sd * 10, -6]); });
    g.strokeStyle = BK; g.lineWidth = 3; for (let k = 0; k < 3; k++) { g.beginPath(); g.moveTo(-30, -40 + k * 12); g.quadraticCurveTo(0, -50 + k * 12, 30, -40 + k * 12); g.stroke(); }
    g.restore(); };

  // ------------------------------------------------------------ page, pen, trunk
  const page = (g, W, H, S) => {
    g.fillStyle = VI; g.fillRect(0, 0, W, H); g.fillStyle = K.dots(S, '#7B2FA0', null, 12, 3.3, 15); g.fillRect(0, 0, W, H);
    // 狮驼岭 rock, blocky, spotted black
    g.fillStyle = '#C9712E'; g.fillRect(0, 690, W, H - 690);
    const R = XY.rng(6201); for (let x = -20; x < W; x += 70 + R() * 40) { const w = 80 + R() * 60, h = 20 + R() * 40;
      ink(g, [x, 700, x + 10, 700 - h, x + w * 0.6, 694 - h - 10 * R(), x + w, 700 - h * 0.6, x + w + 6, 712], R() < 0.5 ? '#E08E3C' : '#B85E26', 4);
      blot(g, [x + w * 0.62, 700 - h * 0.7, x + w, 700 - h * 0.5, x + w + 4, 708, x + w * 0.7, 704]); }
    g.fillStyle = '#E08E3C'; g.fillRect(0, 702, W, 4); g.fillStyle = BK; g.fillRect(0, 706, W, 3);
    for (let k = 0; k < 9; k++) { const x = R() * W, y = 720 + R() * 50; g.strokeStyle = BK; g.lineWidth = 3; g.beginPath(); g.moveTo(x, y); g.lineTo(x + 20, y + 8); g.lineTo(x + 36, y + 4); g.stroke(); }
    g.strokeStyle = BK; g.lineWidth = 7; g.strokeRect(8, 8, W - 16, H - 16);
  };
  const title = g => {   // 三色: extruded block letters, yellow over red, and the caption box
    const F = XY.font(132, '"PingFang SC", "Heiti SC", sans-serif', '600');
    for (let k = 9; k > 0; k--) K.text(g, '三色', 40 + k * 1.1, 160 + k * 1.3, F, BK, { stroke: BK, lw: 6 });
    K.text(g, '三色', 40, 160, F, YL, { stroke: BK, lw: 6 });
    g.save(); g.beginPath(); g.rect(30, 112, 320, 60); g.clip(); K.text(g, '三色', 40, 160, F, RD); g.restore();
    K.text(g, '三色', 40, 160, F, null, { stroke: BK, lw: 3 });
    ink(g, [34, 186, 446, 186, 446, 228, 34, 228], YL, 3.5);
    K.text(g, '第62难 · 狮驼洞前三魔齐至!', 48, 218, XY.font(27, '"HanziPen SC", "Wawati SC", sans-serif', 'bold'), BK);
  };
  const PAL = { fur: '#B8582A', face: '#F6C99A', skin: '#F6C99A', skin2: '#D79A6A', wkshirt: RD, kasaya: RD, staff: RD, red: RD, tiger: YL, gold: YL, metal: YL, robe: YL, bundle: YL,
    horse: WH, horse2: '#CFCBE0', mane: WH, bjrobe: '#2B3A8C', bjpants: '#1E2766', pig: '#F7A6B4', pig2: '#E07A8E', ssrobe: '#2E8FB8', ssrobe2: '#226E8E', ssh: RD, ssbeard: '#B3261E',
    saddle: '#7A3A1E', wood: '#7A3A1E', skull: WH, hoof: BK, ink: BK, stripe: BK };
  const PEN = { color: r => PAL[r] || WH, outline: BK, ow: 2.4, shade: 'rgba(10,6,20,0.62)' };
  const actsAt = b => ({ wukong: { shade: K.win(b, 1.2, 2.7, 0.25), raise: K.win(b, HIT - 0.65, HIT - 0.05, 0.1), strike: K.win(b, HIT - 0.05, HIT + 0.9, 0.1) }, monk: { palm: K.win(b, GRAB, HIT + 1, 0.2) }, shaseng: { lift: K.win(b, GRAB + 0.2, HIT + 0.8, 0.2) }, bajie: { scratch: K.win(b, 6, 9, 0.3) } });
  const bez = (P, s) => { const q = 1 - s; return [q * q * q * P[0][0] + 3 * q * q * s * P[1][0] + 3 * q * s * s * P[2][0] + s * s * s * P[3][0], q * q * q * P[0][1] + 3 * q * q * s * P[1][1] + 3 * q * s * s * P[2][1] + s * s * s * P[3][1]]; };
  // how high 八戒 hangs, beat by beat
  const liftAt = b => b < GRAB ? 0 : b < HIT ? 150 * XY.easeOut((b - GRAB) / 0.6) + (b > GRAB + 0.6 ? 10 * Math.sin((b - GRAB) * 7) : 0) : Math.max(0, 150 * (1 - XY.easeIn((b - HIT) / 0.35))) + (b > HIT + 0.35 && b < HIT + 0.6 ? 14 * Math.sin(Math.PI * (b - HIT - 0.35) / 0.25) : 0);
  const jumpAt = b => (b > HIT - 0.45 && b < HIT + 0.65 ? 210 * Math.sin(Math.PI * (b - HIT + 0.45) / 1.1) : 0);   // 悟空 leaps at the trunk
  const trunkAt = (b, belly) => { const P0 = [ELE[0] - 4, ELE[1] + 60], rest = [ELE[0] - 30, ELE[1] + 250];
    const ext = b < HIT ? XY.easeOut(K.ramp(b, GRAB - 0.3, 0.3)) : 1 - XY.easeOut(K.ramp(b, HIT, 0.7)), tip = [XY.lerp(rest[0], belly[0] + 6, ext), XY.lerp(rest[1], belly[1], ext)];
    const wig = b > HIT ? 30 * Math.sin((b - HIT) * 14) * Math.exp(-(b - HIT) * 2) : 0;
    return [P0, [P0[0] - 20, P0[1] + 210], [tip[0] + 190, tip[1] - 230 + wig], tip]; };
  const drawTrunk = (g, P, coil) => {
    const c = []; for (let k = 0; k <= 26; k++) c.push(...bez(P, k / 26));
    const rib = XY.RIG.ribbon(c, 46, 18); ink(g, rib, EL, 4.5);
    g.strokeStyle = BK; g.lineWidth = 2.6; for (let k = 2; k < 26; k += 2) { const p = bez(P, k / 26), q = bez(P, (k + 1) / 26), a = Math.atan2(q[1] - p[1], q[0] - p[0]) + Math.PI / 2, w = XY.lerp(20, 8, k / 26);
      g.beginPath(); g.moveTo(p[0] + Math.cos(a) * w, p[1] + Math.sin(a) * w); g.lineTo(p[0] - Math.cos(a) * w * 0.6, p[1] - Math.sin(a) * w * 0.6); g.stroke(); }
    if (coil) { const [x, y] = P[3]; g.save(); g.lineWidth = 16; g.strokeStyle = BK; g.beginPath(); g.ellipse(x, y, 34, 16, -0.2, 0.3, TAU - 0.4); g.stroke(); g.lineWidth = 10; g.strokeStyle = EL; g.stroke(); g.restore(); }
  };
  const sfx = (g, s, x, y, px, sc, rot, fill, j) => { g.save(); g.translate(x + j[0], y + j[1]); g.rotate(rot); g.scale(sc, sc); const F = XY.font(px, '"PingFang SC", "Heiti SC", sans-serif', '600');
    for (let k = 8; k > 0; k--) K.text(g, s, k * 1.4, k * 1.6, F, BK, { align: 'center', stroke: BK, lw: 8 }); K.text(g, s, 0, 0, F, fill, { align: 'center', stroke: BK, lw: 7 }); g.restore(); };

  XY.STYLES.kirby = {
    hits: [GRAB, HIT],
    bg(g, W, H, c, scale) { page(g, W, H, scale); },
    draw(g, e) {
      const { W, H, t, u } = e, b = e.beat, acts = actsAt(b), f12 = K.step(t, 12), jit = k => [(XY.hash(f12, k) - 0.5) * 6, (XY.hash(f12, k + 1) - 0.5) * 6];
      // radiating lines behind the demons
      g.save(); g.beginPath(); g.rect(0, 0, W, 692); g.clip(); g.translate(640, 290); g.rotate(t * 0.08); g.fillStyle = 'rgba(18,6,40,0.5)';
      for (let k = 0; k < 20; k++) { const a = k / 20 * TAU; g.beginPath(); g.moveTo(0, 0); g.lineTo(Math.cos(a - 0.05) * 1500, Math.sin(a - 0.05) * 1500); g.lineTo(Math.cos(a + 0.05) * 1500, Math.sin(a + 0.05) * 1500); g.fill(); }
      g.restore();
      // the three, each in its own colour of energy
      // the three pop in one after another (Kirby splash entrance), each inside its own colour of energy
      const pop = (c, b0, draw) => { const q = K.ramp(b, b0, 0.35); if (q <= 0) return; const s = q < 1 ? 1 + 1.7 * Math.pow(q - 1, 3) + 0.7 * Math.pow(q - 1, 2) : 1;
        g.save(); g.translate(c[0], c[1]); g.scale(s, s); g.translate(-c[0], -c[1]); draw(); g.restore(); };
      pop(LION, 0.2, () => { aura(g, LION[0], LION[1], 165, GR, 1, t); lion(g, t, K.win(b, ROAR, ROAR + 0.9, 0.1) + K.hit(b, HIT, 0.5)); });
      pop(ROC, 0.6, () => { aura(g, ROC[0], ROC[1] - 20, 200, GD, 2, t); roc(g, t); });
      pop(ELE, 1.0, () => { aura(g, ELE[0], ELE[1], 185, EL, 3, t); elephant(g, t); });
      if (b >= ROAR && b < ROAR + 0.9) { const q = (b - ROAR) / 0.9; sfx(g, '吼!', LION[0] + 120, LION[1] + 150, 70, XY.easeOut(q * 4) * (1 - 0.15 * q), 0.15, GR, jit(7));
        g.strokeStyle = BK; g.lineWidth = 3; for (let k = 0; k < 7; k++) { const a = -0.6 + k * 0.2, r0 = 170 + 60 * q; g.beginPath(); g.moveTo(LION[0] + Math.cos(a) * r0, LION[1] + 70 + Math.sin(a) * r0); g.lineTo(LION[0] + Math.cos(a) * (r0 + 40), LION[1] + 70 + Math.sin(a) * (r0 + 40)); g.stroke(); } }
      // the trunk: hanging, then whipping down to 八戒 (beat 2), smashed at beat 3 and recoiling
      const belly0 = e.at('bajie.belly', acts), lift = liftAt(b), belly = [belly0[0], belly0[1] - lift], P = trunkAt(b, belly);
      if (b > GRAB - 0.3 && b < GRAB + 0.1) { g.strokeStyle = BK; g.lineWidth = 3; for (let k = 0; k < 6; k++) { const p = bez(P, 0.3 + k * 0.1), q = bez(P, 0.36 + k * 0.1); g.beginPath(); g.moveTo(p[0] + 40, p[1] - 30); g.lineTo(q[0] + 90, q[1] - 70); g.stroke(); } }
      drawTrunk(g, P, false);
      // the pilgrims; while he hangs, 八戒 is drawn on his own, lifted and tilted, legs still walking
      const up = lift > 0.5, jump = jumpAt(b), hop = jump > 0.5;
      XY.drawProcession(g, e.phase, e.procX, e.groundY, PEN, Object.assign({}, acts, { cast: { bajie: !up, wukong: !hop } }));
      if (up) { g.save(); g.translate(belly[0], belly[1]); g.rotate(-0.28 * Math.min(1, lift / 150)); g.translate(-belly[0], -belly[1]);
        XY.drawProcession(g, e.phase, e.procX, e.groundY - lift, PEN, Object.assign({}, acts, { cast: { shaseng: false, monk: false, wukong: false } })); g.restore(); }
      if (b >= GRAB && b < HIT) drawTrunk(g, P, true);
      // 嗖! on the grab, 轰!! on the hit
      if (b >= GRAB && b < GRAB + 0.7) { const q = (b - GRAB) / 0.7; sfx(g, '嗖!', belly[0] - 110, belly[1] - 70, 64, XY.easeOut(q * 4) * (1 - 0.2 * q), -0.2, YL, jit(3)); }
      if (b >= HIT && b < HIT + 1.8) {
        const tH = e.cell.t0 + HIT * XY.BEAT, pxH = XY.procWorldX(tH) - e.cell.x, aH = XY.anchor('bajie.belly', XY.walkPhase(tH), actsAt(HIT));
        const aW = XY.anchor('wukong.staffEnd', XY.walkPhase(tH), actsAt(HIT)), sE = [pxH + aW[0], e.groundY + aW[1] - jumpAt(HIT)], PT = trunkAt(HIT - 1e-3, [pxH + aH[0], e.groundY + aH[1] - liftAt(HIT - 1e-3)]);
        let Hp = bez(PT, 0), bd = 1e9; for (let k = 0; k <= 30; k++) { const p = bez(PT, k / 30), d = Math.hypot(p[0] - sE[0], p[1] - sE[1]); if (d < bd) { bd = d; Hp = [(p[0] + sE[0]) / 2, (p[1] + sE[1]) / 2]; } }
        const q = (b - HIT) / 1.8, s = 0.62 * (q < 0.1 ? XY.lerp(0.3, 1.15, q / 0.1) : q < 0.2 ? XY.lerp(1.15, 1, (q - 0.1) / 0.1) : 1);
        krackle(g, Hp[0], Hp[1], 190 * s, 60, 77, t);
        g.save(); g.translate(Hp[0], Hp[1]); g.scale(s, s); ink(g, K.burst(0, 0, 90, 170, 16, 623 + f12 % 2, 0.1, 0.4), YL, 6); ink(g, K.burst(0, 0, 60, 110, 12, 624, -0.2, 0.3), RD, 0); g.restore();
        sfx(g, '轰!!', Hp[0] + 120, Hp[1] - 40, 128, s, -0.08, YL, jit(5));
      }
      if (hop) { const h = e.at('wukong.chest', acts); g.save(); g.translate(h[0], h[1] - jump); g.rotate(-0.3 * jump / 210); g.translate(-h[0], -(h[1] - jump));
        XY.drawProcession(g, e.phase, e.procX, e.groundY - jump, PEN, Object.assign({}, acts, { cast: { shaseng: false, monk: false, bajie: false } }));
        g.strokeStyle = BK; g.lineWidth = 3; for (let k = 0; k < 4; k++) { g.beginPath(); g.moveTo(h[0] - 30 + k * 14, h[1] - jump + 60); g.lineTo(h[0] - 40 + k * 14, h[1] - jump + 120); g.stroke(); } g.restore(); }
      title(g);
      K.grain(g, e, K.noiseTile('kirby', 256, (d, n) => { for (let i = 0; i < n * n; i++) { const h = XY.hash(i, 6202), o = i * 4, v = h < 0.04 ? 70 : h > 0.97 ? 230 : 128; d[o] = d[o + 1] = d[o + 2] = v; d[o + 3] = 255; } }), 'overlay', 0.3, 0);
    },
  };
})();
