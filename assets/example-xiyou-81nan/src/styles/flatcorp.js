// 79 商务扁平 · 铜台府监禁 — a corporate explainer illustration: mint ground, soft blobs, long-shadow icons. A flow chart
// tells the story (斋僧 → 遇盗 → 诬告 → 监禁) while 寇府 and the 铜台府 yamen stand behind; a constable points at the loot on
// 八戒's rake (beat 2), and on beat 3 a rounded cage drops over the whole procession, the padlock clicks, a toast slides in.
(() => {
  'use strict';
  const XY = window.XY, K = XY.KIT_I, TAU = XY.TAU, { sin, cos, PI, hypot, atan2 } = Math;
  const BG = '#EAF4EF', INK = '#26324A', CORAL = '#FF7A6B', TEAL = '#2BB3A3', YEL = '#FFC94A', BLUE = '#4F7CFF', LAV = '#B9A8F5', MINT = '#BFE6D6', SAND = '#F6E2C8';
  const sm = XY.smooth, W_ = K.win, HEI = XY.cnFont.hei;
  const rr = (g, x, y, w, h, r, col) => { g.beginPath(); g.roundRect(x, y, w, h, r); g.fillStyle = col; g.fill(); };
  const circ = (g, x, y, r, col) => { g.beginPath(); g.arc(x, y, r, 0, TAU); g.fillStyle = col; g.fill(); };
  // the long shadow of a disc toward the lower right
  const longShadow = (g, x, y, r, L, col) => { g.save(); g.beginPath(); g.arc(x, y, r, 0, TAU); g.clip(); g.fillStyle = col; g.beginPath(); g.moveTo(x - r * 0.707, y + r * 0.707); g.lineTo(x + r * 0.707, y - r * 0.707); g.lineTo(x + r * 0.707 + L, y - r * 0.707 + L); g.lineTo(x - r * 0.707 + L, y + r * 0.707 + L); g.fill(); g.restore(); };
  // four flat icons, drawn in a 60 px box centred at 0,0, white
  const ICONS = [
    g => { g.fillStyle = '#FFF'; g.beginPath(); g.arc(0, 4, 20, 0, PI); g.fill(); g.fillRect(-24, 2, 48, 4); g.fillRect(-12, 22, 24, 4); [-8, 0, 8].forEach(x => { g.beginPath(); g.ellipse(x, -10 - Math.abs(x) * 0.2, 2.4, 6, 0, 0, TAU); g.fill(); }); },   // 斋: a rice bowl, steam
    g => { g.fillStyle = '#FFF'; g.beginPath(); g.arc(-6, -2, 16, 0, TAU); g.fill(); g.fillStyle = 'rgba(20,30,60,0.55)'; g.fillRect(-22, -9, 32, 9); g.fillStyle = '#FFF'; g.beginPath(); g.arc(-12, -5, 2.6, 0, TAU); g.arc(-1, -5, 2.6, 0, TAU); g.fill();
      g.beginPath(); g.arc(16, 14, 10, 0, TAU); g.fill(); g.fillRect(12, 0, 8, 6); g.fillStyle = 'rgba(20,30,60,0.4)'; g.fillRect(13, 11, 6, 6); },                                         // 盗: a masked bandit with a club
    g => { g.fillStyle = '#FFF'; g.fillRect(-16, -22, 32, 40); g.fillStyle = 'rgba(0,0,0,0.22)'; for (let k = 0; k < 4; k++) g.fillRect(-10, -14 + k * 8, 20 - (k === 3 ? 8 : 0), 3); g.fillStyle = '#FFF'; g.save(); g.translate(12, 14); g.rotate(-0.8); g.fillRect(-3, -16, 6, 22); g.restore(); },   // 诬告: a complaint and a brush
    g => { g.fillStyle = '#FFF'; g.lineWidth = 6; g.strokeStyle = '#FFF'; g.beginPath(); g.arc(0, -6, 11, PI, TAU); g.stroke(); g.beginPath(); g.roundRect(-16, -6, 32, 26, 5); g.fill(); g.fillStyle = 'rgba(0,0,0,0.3)'; g.beginPath(); g.arc(0, 4, 4, 0, TAU); g.fill(); g.fillRect(-1.5, 4, 3, 8); },   // 监禁: a padlock
  ];
  const STEPS = [['设斋', CORAL], ['遇盗', BLUE], ['诬告', YEL], ['监禁', TEAL]], FX = [434, 580, 726, 872], FY = 96;

  // ------------------------------------------------------------ static
  const tree = (g, x, y, r, col, trunk) => { rr(g, x - 4, y - r * 1.4, 8, r * 1.4, 4, trunk); circ(g, x, y - r * 1.8, r, col); g.save(); g.beginPath(); g.arc(x, y - r * 1.8, r, 0, TAU); g.clip(); g.fillStyle = 'rgba(0,0,0,0.08)'; g.fillRect(x, y - r * 3, r * 2, r * 3); g.restore(); };
  const bg = (g, W, H) => {
    g.fillStyle = BG; g.fillRect(0, 0, W, H);
    [[180, 300, 260, 180, '#D7EEE5'], [980, 250, 300, 200, '#E3E0FB'], [620, 520, 520, 140, '#D7EEE5'], [1080, 600, 200, 120, '#FCE7DA']].forEach(([x, y, a, b, c], k) => { g.fillStyle = c; XY.path(g, XY.RIG.spline(XY.wobble(XY.ellipse(x, y, a, b, 10), 30, k, 0.01), true, 6), true); g.fill(); });
    circ(g, 1070, 150, 54, '#FFD98A'); circ(g, 1070, 150, 38, '#FFC94A');
    [[90, 196], [250, 160], [880, 210], [1150, 280]].forEach(([x, y], k) => { rr(g, x - 50, y, 100, 26, 13, '#FFFFFF'); circ(g, x - 12, y + 2, 20, '#FFFFFF'); circ(g, x + 18, y + 6, 15, '#FFFFFF'); });
    // 寇府 on the left: white wall, roof, red lanterns, the plaque
    rr(g, 30, 480, 300, 222, 6, '#FFFFFF'); g.fillStyle = '#E5ECEA'; g.fillRect(180, 480, 150, 222);
    g.fillStyle = INK; g.beginPath(); g.moveTo(10, 486); g.lineTo(60, 440); g.lineTo(300, 440); g.lineTo(350, 486); g.fill(); g.fillStyle = '#3A4866'; g.fillRect(10, 482, 340, 8);
    rr(g, 140, 560, 80, 142, 40, '#8C5A44'); rr(g, 146, 566, 32, 136, 30, '#A26A50');
    rr(g, 140, 500, 80, 38, 6, YEL); g.fillStyle = INK; g.font = XY.font(26, HEI, '900'); g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('寇', 180, 520);
    [[100, 520], [260, 520]].forEach(([x, y]) => { g.fillStyle = INK; g.fillRect(x - 1, y - 20, 2, 12); rr(g, x - 14, y - 8, 28, 34, 12, CORAL); g.fillStyle = 'rgba(0,0,0,0.12)'; g.fillRect(x, y - 8, 14, 34); });
    // 铜台府 yamen on the right: steps, pillars, roof, plaque, the drum of grievances
    rr(g, 730, 470, 380, 232, 6, '#FFFFFF'); g.fillStyle = '#E5ECEA'; g.fillRect(920, 470, 190, 232);
    g.fillStyle = INK; g.beginPath(); g.moveTo(700, 478); g.lineTo(760, 420); g.lineTo(1080, 420); g.lineTo(1140, 478); g.fill(); g.fillStyle = '#3A4866'; g.fillRect(700, 474, 440, 8);
    [770, 850, 990, 1070].forEach(x => rr(g, x - 9, 486, 18, 200, 9, CORAL));
    rr(g, 870, 548, 100, 154, 8, '#3A4866'); rr(g, 870, 548, 50, 154, 8, '#46557A');
    rr(g, 845, 488, 150, 44, 8, YEL); g.fillStyle = INK; g.font = XY.font(28, HEI, '900'); g.fillText('铜台府', 920, 511);
    [[684, 1150, 692], [700, 1134, 682]].forEach(([a, b, y]) => rr(g, a, y, b - a, 12, 4, '#D3DCDA'));
    circ(g, 1062, 598, 26, '#E0A050'); circ(g, 1062, 598, 18, '#F2C27A'); g.fillStyle = INK; g.fillRect(1060, 624, 4, 54);
    tree(g, 400, 664, 40, TEAL, '#8C6A55'); tree(g, 466, 664, 30, '#5CCCB9', '#8C6A55'); tree(g, 650, 664, 34, '#5CCCB9', '#8C6A55');
    // ground
    g.fillStyle = '#CFE7DC'; g.fillRect(0, 702, W, H - 702); g.fillStyle = '#B9DCCD'; g.fillRect(0, 702, W, 6);
    g.fillStyle = 'rgba(38,50,74,0.07)'; [[30, 330], [730, 1110]].forEach(([a0, a1]) => { g.beginPath(); g.moveTo(a0, 708); g.lineTo(a1, 708); g.lineTo(a1 + 70, H); g.lineTo(a0 + 70, H); g.fill(); });   // flat long shadows
    const sl = g.createRadialGradient(1070, 150, 40, 1070, 150, 1000); sl.addColorStop(0, 'rgba(255,236,200,0.35)'); sl.addColorStop(1, 'rgba(255,236,200,0)'); g.fillStyle = sl; g.fillRect(0, 0, W, H);   // soft light
    // flow-chart track
    rr(g, FX[0], FY - 4, FX[3] - FX[0], 8, 4, '#D3DCDA');
  };

  const FC = { fur: '#B07A50', face: '#FFD9B8', wkshirt: CORAL, tiger: YEL, stripe: INK, gold: YEL, staff: CORAL, ink: INK, horse: '#FFFFFF', horse2: '#DDE6E3', mane: '#EEF3F1', hoof: INK, saddle: '#8C5A44',
    red: CORAL, robe: YEL, kasaya: '#F2554A', skin: '#FFD9B8', metal: YEL, bjrobe: INK, bjpants: '#1E2840', pig: '#FFB8B0', pig2: '#F29A90', wood: '#8C6A55', ssrobe: TEAL, ssrobe2: '#239485', skin2: '#E0A982',
    ssh: CORAL, ssbeard: '#E55A4A', skull: '#FFFFFF', bundle: YEL };
  const PEN = { color: r => FC[r] || INK, fine: false, shade: 'rgba(30,40,70,0.13)' };
  // v10 (8 beats): steps light at 0.6 斋僧, 1.6 遇盗, 2.6 诬告 (a constable points at the loot); the cage drops at 3.7 and locks on 4 (hit);
  // on 5.4 (hit) 寇员外 is back from the dead: the lock pops, the cage lifts away, the toast flips to 已释放
  const ON = [0.6, 1.6, 2.6, 4.0], DROP = 3.7, LOCK = 4.0, FREE = 5.4;
  const actsAt = b => ({ wukong: { shade: sm(W_(b, 2.0, 2.4)) * (1 - sm(W_(b, 3.2, 3.5))), raise: sm(W_(b, FREE, FREE + 0.3)) * (1 - sm(W_(b, 6.6, 7.2))) }, monk: { palm: sm(W_(b, 2.8, 3.1)) * (1 - sm(W_(b, FREE + 0.2, FREE + 0.8))) },
    bajie: { scratch: sm(W_(b, 4.3, 4.7)) * (1 - sm(W_(b, FREE, FREE + 0.4))) }, shaseng: { lift: sm(W_(b, LOCK, LOCK + 0.2)) * (1 - sm(W_(b, 4.6, 5.0))) } });
  const guard = (g, x, y, point, k) => {
    g.fillStyle = 'rgba(38,50,74,0.1)'; g.beginPath(); g.ellipse(x, y + 2, 26, 6, 0, 0, TAU); g.fill();
    rr(g, x - 10, y - 46, 9, 46, 4, '#1E2840'); rr(g, x + 1, y - 46, 9, 46, 4, '#26324A');
    rr(g, x - 17, y - 104, 34, 62, 12, '#3A4866'); g.fillStyle = CORAL; g.fillRect(x - 17, y - 66, 34, 7);
    circ(g, x, y - 118, 14, '#F2C29A'); rr(g, x - 16, y - 138, 32, 12, 4, '#1E2840'); rr(g, x - 6, y - 146, 12, 10, 3, CORAL);
    g.strokeStyle = '#8C6A55'; g.lineWidth = 4; g.lineCap = 'round'; g.beginPath(); g.moveTo(x + 22, y); g.lineTo(x + 22, y - 170); g.stroke(); g.fillStyle = '#C9D3D1'; XY.path(g, [x + 16, y - 168, x + 22, y - 192, x + 28, y - 168], true); g.fill();
    const a = -PI / 2 - 1.25 * point; g.strokeStyle = '#3A4866'; g.lineWidth = 10; g.beginPath(); g.moveTo(x - 10, y - 96); g.lineTo(x - 10 + cos(a + PI) * -0 + sin(a) * 0 - 36 * point, y - 96 + 28 * (1 - point) - 6 * point); g.stroke();
    circ(g, x - 10 - 36 * point, y - 96 + 28 * (1 - point) - 6 * point, 6, '#F2C29A'); };

  XY.STYLES.flatcorp = {
    bg,
    hits: [LOCK, FREE],
    thumb: 4.7,   // locked in, before the release
    draw(g, e) {
      const { W, H, t, u, beat, S } = e, A = actsAt(beat), drop = K.outBack(W_(beat, DROP, LOCK), 1.2) * (1 - XY.easeIn(W_(beat, FREE + 0.15, FREE + 0.6))), dy = -460 * (1 - drop);
      // floating corporate confetti
      for (let k = 0; k < 16; k++) { const x = 40 + XY.hash(k, 1) * (W - 80), y = 230 + XY.hash(k, 2) * 200 + 8 * sin(t * 1.4 + k), c = [CORAL, TEAL, YEL, LAV, BLUE][k % 5], kind = k % 3;
        g.save(); g.translate(x, y); g.rotate(0.3 * sin(t + k)); if (kind === 0) circ(g, 0, 0, 5, c); else if (kind === 1) { g.fillStyle = c; g.fillRect(-7, -2, 14, 4); g.fillRect(-2, -7, 4, 14); }
        else { g.strokeStyle = c; g.lineWidth = 3; g.lineCap = 'round'; g.beginPath(); for (let i = 0; i <= 12; i++) g.lineTo(-14 + i * 2.4, 4 * sin(i * 1.1)); g.stroke(); } g.restore(); }
      // the flow chart fills like a progress bar; each step's badge pops when its beat comes
      { const cur = ON.reduce((n, b, k) => (beat >= b ? k : n), -1), fillTo = cur < 0 ? FX[0] : cur >= 3 ? FX[3] : XY.lerp(FX[cur], FX[cur + 1], sm(W_(beat, ON[cur], ON[cur + 1])));
        rr(g, FX[0], FY - 4, fillTo - FX[0], 8, 4, TEAL);
        STEPS.forEach(([lab, col], k) => { const on = beat >= ON[k], s = on ? K.outBack(W_(beat, ON[k], ON[k] + 0.25), 2) : 1, x = FX[k];
          g.save(); g.translate(x, FY); g.scale(s, s);
          if (on) { circ(g, 0, 0, 44, col); longShadow(g, 0, 0, 44, 70, 'rgba(0,0,0,0.12)'); ICONS[k](g); }
          else { circ(g, 0, 0, 44, '#FFFFFF'); g.strokeStyle = '#D3DCDA'; g.lineWidth = 4; g.beginPath(); g.arc(0, 0, 42, 0, TAU); g.stroke(); g.globalAlpha = 0.35; g.save(); g.scale(0.9, 0.9); ICONS[k](g); g.restore(); g.globalAlpha = 1; }
          g.restore();
          g.fillStyle = on ? INK : '#9AA8A4'; g.font = XY.font(24, HEI, 'bold'); g.textAlign = 'center'; g.textBaseline = 'top'; g.fillText(lab, x, FY + 56); }); }
      // title with a highlighter bar, and the count in a chip
      g.fillStyle = YEL; g.fillRect(48, 108, 196, 30); g.fillStyle = INK; g.font = XY.font(98, HEI, '900'); g.textAlign = 'left'; g.textBaseline = 'alphabetic'; g.fillText('监禁', 44, 136);
      rr(g, 50, 160, 138, 42, 21, TEAL); g.fillStyle = '#FFFFFF'; g.font = XY.font(26, HEI, 'bold'); g.textBaseline = 'middle'; g.fillText('第79难', 70, 182);
      { const n = 9990 + Math.floor(10 * sm(W_(beat, -0.2, 1.2))), dead = beat >= ON[1];   // a data card: 寇员外 has fed his ten-thousandth monk
        g.save(); g.shadowColor = 'rgba(38,50,74,0.14)'; g.shadowBlur = 14 * e.S; g.shadowOffsetY = 5 * e.S; rr(g, 50, 228, 250, 84, 16, '#FFFFFF'); g.restore();
        circ(g, 88, 270, 22, dead ? '#E4E9EF' : CORAL); g.save(); g.translate(88, 270); g.scale(0.6, 0.6); ICONS[0](g); g.restore();
        g.fillStyle = dead ? CORAL : '#7A8796'; g.font = XY.font(20, HEI, 'bold'); g.textAlign = 'left'; g.textBaseline = 'middle'; g.fillText(dead ? '寇员外 · 遇害' : '寇员外 · 斋僧', 124, 252);
        g.fillStyle = INK; g.font = XY.font(32, '"Avenir Next", "PingFang SC", sans-serif', '700'); g.fillText(n.toLocaleString('en-US') + ' 人', 124, 288);
        if (dead) { g.strokeStyle = CORAL; g.lineWidth = 3; g.beginPath(); g.moveTo(122, 288); g.lineTo(122 + 150 * sm(W_(beat, ON[1], ON[1] + 0.3)), 288); g.stroke(); } }
      // the constables at the yamen; one points at the loot on beat 2
      const pt = sm(W_(beat, 2.6, 2.85)) * (1 - sm(W_(beat, 4.4, 4.8)));
      g.save(); g.translate(0, 676); g.scale(0.82, 0.82); g.translate(0, -676); guard(g, 1408, 676, 0, 1); guard(g, 1342, 676, pt, 0); g.restore();
      if (beat > 2.75 && beat < 4.2) { const s = K.outBack(W_(beat, 2.75, 2.95), 2); g.save(); g.translate(1080, 520); g.scale(s, s); rr(g, -24, -40, 48, 40, 14, '#FFFFFF'); XY.path(g, [-6, -2, 6, -2, -10, 12], true); g.fill();
        g.fillStyle = CORAL; g.fillRect(-3, -33, 6, 18); circ(g, 0, -9, 3.4, CORAL); g.restore(); }
      // the cage: back bars (behind them), then the pilgrims with flat ground shadows, then front bars and the lock
      const x0 = e.procX - 424, x1 = e.procX + 352, top = 402 + dy, bars = [];
      for (let x = x0 + 24; x < x1 - 10; x += 46) bars.push(x);
      if (drop > 0) { bars.forEach(x => rr(g, x + 16, top + 22, 8, 702 - top - 22, 4, '#AEB9C9')); rr(g, x0 + 16, top + 14, x1 - x0, 16, 8, '#AEB9C9'); }
      g.fillStyle = 'rgba(38,50,74,0.1)'; [[-300, 44], [-150, 40], [40, 74], [245, 38]].forEach(([dx, r]) => { g.beginPath(); g.ellipse(e.procX + dx, 704, r, 7, 0, 0, TAU); g.fill(); });
      K.draw(g, e.phase, e.procX, e.groundY, PEN, A);
      // the evidence: a sack of 铜钱 hanging from the rake
      { const rh = e.at('bajie.rakeHead', A), sw = 0.15 * sin(t * 4.2), sx = rh[0] + 4 + 26 * sin(sw), sy = rh[1] + 26 * cos(sw);
        g.strokeStyle = '#8C6A55'; g.lineWidth = 2; g.beginPath(); g.moveTo(rh[0] + 4, rh[1]); g.lineTo(sx, sy); g.stroke();
        g.fillStyle = '#C98A4A'; XY.path(g, XY.RIG.spline([sx - 6, sy, sx + 6, sy, sx + 20, sy + 26, sx + 12, sy + 40, sx - 12, sy + 40, sx - 20, sy + 26], true, 4), true); g.fill();
        g.fillStyle = 'rgba(0,0,0,0.12)'; XY.path(g, XY.RIG.spline([sx, sy, sx + 6, sy, sx + 20, sy + 26, sx + 12, sy + 40, sx, sy + 40], true, 4), true); g.fill();
        circ(g, sx, sy + 24, 9, YEL); g.fillStyle = '#C98A4A'; g.fillRect(sx - 3, sy + 21, 6, 6); }
      if (drop > 0) {
        bars.forEach(x => { rr(g, x, top + 20, 10, 702 - top - 18, 5, INK); g.fillStyle = 'rgba(255,255,255,0.18)'; g.fillRect(x + 2, top + 24, 2.5, 702 - top - 28); });
        rr(g, x0, top, x1 - x0, 24, 12, INK); rr(g, x0 + 10, top + 4, x1 - x0 - 20, 6, 3, '#3A4866'); rr(g, x0, 690, x1 - x0, 14, 7, INK);
        rr(g, (x0 + x1) / 2 - 46, top - 40, 92, 44, 10, CORAL); g.fillStyle = '#FFFFFF'; g.font = XY.font(28, HEI, '900'); g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('牢', (x0 + x1) / 2, top - 18);
        // padlock on the door at the right; the shackle clicks shut on beat 3
        const lx = x1 - 30, ly = 548 + dy, cl = sm(W_(beat, LOCK - 0.1, LOCK)) * (1 - sm(W_(beat, FREE - 0.1, FREE))), bo = 8 * K.hit(beat, LOCK, 7);
        g.strokeStyle = '#3A4866'; g.lineWidth = 7; g.beginPath(); g.arc(lx, ly - 14 - 14 * (1 - cl), 14, PI, TAU); g.lineTo(lx + 14, ly - 6 - 14 * (1 - cl) * 0.2); g.stroke();
        rr(g, lx - 22, ly - 12 + bo, 44, 38, 8, YEL); g.fillStyle = 'rgba(0,0,0,0.12)'; g.fillRect(lx, ly - 12 + bo, 22, 38); circ(g, lx, ly + 2 + bo, 4.5, INK); g.fillStyle = INK; g.fillRect(lx - 1.5, ly + 2 + bo, 3, 10);
        const fb = beat > FREE ? FREE : LOCK; if (beat > fb && beat < fb + 0.6) { g.strokeStyle = beat > FREE ? TEAL : YEL; g.lineWidth = 3; g.lineCap = 'round'; const f = W_(beat, fb, fb + 0.6); for (let k = 0; k < 6; k++) { const a = -PI / 2 + (k - 2.5) * 0.45, r0 = 34 + 26 * f; g.globalAlpha = 1 - f;
          g.beginPath(); g.moveTo(lx + cos(a) * r0, ly + sin(a) * r0); g.lineTo(lx + cos(a) * (r0 + 14), ly + sin(a) * (r0 + 14)); g.stroke(); } g.globalAlpha = 1; } }
      // near: a big potted plant in the corner
      { const px = 60, py = 780; rr(g, px - 40, py - 78, 80, 78, 10, '#F2F2F2'); g.fillStyle = 'rgba(0,0,0,0.08)'; g.fillRect(px, py - 78, 40, 78);
        for (let k = 0; k < 6; k++) { const a = -PI / 2 + (k - 2.5) * 0.42 + 0.05 * sin(t * 1.2 + k), L = 90 + 20 * (k % 2), cx = px + cos(a) * L * 0.6, cy = py - 78 + sin(a) * L * 0.6;
          g.save(); g.translate(cx, cy); g.rotate(a + PI / 2); g.fillStyle = k % 2 ? '#2BB3A3' : '#1F9384'; g.beginPath(); g.ellipse(0, 0, 18, L * 0.42, 0, 0, TAU); g.fill(); g.strokeStyle = 'rgba(255,255,255,0.35)'; g.lineWidth = 2; g.beginPath(); g.moveTo(0, -L * 0.38); g.lineTo(0, L * 0.38); g.stroke(); g.restore(); } }
      // the toast notification
      if (beat >= LOCK + 0.3) { const v = XY.easeOut(W_(beat, LOCK + 0.3, LOCK + 0.6)), x = W - 340 + 370 * (1 - v), y = 318, fr = beat >= FREE;
        g.save(); g.shadowColor = 'rgba(38,50,74,0.18)'; g.shadowBlur = 16 * S; g.shadowOffsetY = 6 * S; rr(g, x, y, 300, 74, 16, '#FFFFFF'); g.restore();
        circ(g, x + 38, y + 37, 20, TEAL); g.strokeStyle = '#FFFFFF'; g.lineWidth = 4; g.lineCap = 'round'; g.beginPath(); g.moveTo(x + 28, y + 37); g.lineTo(x + 35, y + 44); g.lineTo(x + 48, y + 30); g.stroke();
        g.fillStyle = INK; g.font = XY.font(26, HEI, 'bold'); g.textAlign = 'left'; g.textBaseline = 'middle'; g.fillText(fr ? '已释放 · 冤情得雪' : '已收监 · 4 人', x + 72, y + 37); }
    },
  };
})();
