// 23 达芬奇手稿 · 1490 年 · 金銮殿变虎 — a Leonardo notebook opening on buff paper: iron-gall ink with left-handed
// "\" hatching, red-chalk studies, mirror-written Italian notes, a comparative physiognomy row (Tang Seng's head
// turning into a tiger's in five steps), a caged tiger study, a gear train, water-vortex studies, Vitruvian
// circle-and-square construction around the horse and rider. On beat 3 the 黄袍怪 — here a handsome scholar —
// spits enchanted water (drawn as Leonardo's water studies) at the monk: his head runs through the five steps of the
// study and becomes a tiger's, his robe grows stripes, and an iron cage is drawn round him bar by bar.
// Everything drawn is composited with multiply, so white fills occlude and only the ink and chalk show.
(() => {
  'use strict';
  const XY = window.XY, K = XY.KIT_C, TAU = XY.TAU;
  const INK = '#3A2716', SEPIA = 'rgba(70,46,26,0.85)', SANG = '#B0583A', W0 = '#FFFFFF';
  const MONO = '"Apple Chancery", "Snell Roundhand", serif';
  // hatch tiles: left-handed hatching runs "\" (upper left → lower right)
  const hatch = (key, gap, col, w, cross) => XY.keep(key, 24, 24, cv => { const g = cv.getContext('2d'); g.fillStyle = '#FFFFFF'; g.fillRect(0, 0, 24, 24); g.strokeStyle = col; g.lineWidth = w;
    for (let k = -24; k <= 48; k += gap) { g.beginPath(); g.moveTo(k, 0); g.lineTo(k + 24, 24); g.stroke(); if (cross) { g.beginPath(); g.moveTo(k + 24, 0); g.lineTo(k, 24); g.stroke(); } } });
  const tigerTile = () => XY.keep('dv-tig', 32, 32, cv => { const g = cv.getContext('2d'); g.fillStyle = '#F2C8A8'; g.fillRect(0, 0, 32, 32); g.strokeStyle = '#8A3A22'; g.lineWidth = 3.2;
    [4, 16, 28].forEach(y => { g.beginPath(); g.moveTo(-2, y); g.quadraticCurveTo(10, y - 6, 18, y + 1); g.quadraticCurveTo(26, y + 6, 34, y); g.stroke(); }); });
  const ROLE = { ink: 'solid', stripe: 'solid', hoof: 'dark', bjrobe: 'dark', bjpants: 'dark', saddle: 'mid', kasaya: 'mid', red: 'mid', ssrobe: 'mid', ssrobe2: 'dark',
    ssh: 'mid', ssbeard: 'mid', wood: 'mid', metal: 'mid', gold: 'light', robe: 'light', horse2: 'light', pig2: 'light', skin2: 'light', bundle: 'light' };
  const penFor = (g, tiger) => {
    const P = { light: g.createPattern(hatch('dv-h1', 7, SEPIA, 0.8), 'repeat'), mid: g.createPattern(hatch('dv-h2', 4, SEPIA, 0.9), 'repeat'), dark: g.createPattern(hatch('dv-h3', 4, SEPIA, 0.9, true), 'repeat') };
    const tg = g.createPattern(tigerTile(), 'repeat'), sh = g.createPattern(hatch('dv-s1', 4, SANG, 1), 'repeat');
    return { outline: INK, ow: 1.2, wob: 0.9, seed: 23, shade: false,
      color: (r, p) => { if (p && p.k !== 'poly') return r === 'ink' || r === 'stripe' ? INK : r === 'gold' || r === 'red' ? '#6A4A2A' : INK;
        if (tiger && (r === 'robe' || r === 'kasaya')) return tg; if (tiger && r === 'skin') return sh;
        const k = ROLE[r]; return k === 'solid' ? INK : k ? P[k] : W0; },
      part: (ctx, p, c, id) => { if (p.k !== 'poly') return false; const pts = XY.wobble(XY.densify(p.pts, 8, true), 0.9, 23 + id * 7);
        XY.path(ctx, pts, true); ctx.fillStyle = W0; ctx.fill(); if (c !== W0) { ctx.fillStyle = c; ctx.fill(); } ctx.strokeStyle = INK; ctx.lineWidth = 1.15; ctx.stroke(); return true; } };
  };

  // ------------------------------------------------------------ the physiognomy study: one outline morphing from monk to tiger
  const HUM = [-30, 40, -36, 10, -34, -20, -20, -42, 0, -50, 20, -44, 30, -30, 33, -14, 46, 4, 36, 9, 37, 15, 42, 20, 35, 25, 35, 33, 24, 44, 8, 46, -6, 40];
  const TIG = [-44, 44, -54, 8, -46, -26, -28, -42, 0, -40, 20, -30, 34, -18, 58, -12, 68, -2, 66, 10, 54, 16, 58, 24, 50, 34, 36, 40, 20, 52, 0, 56, -22, 52];
  const head = (g, x, y, s, m, dash) => {   // dash: 0..1 drawing progress (entry); m: 0 human … 1 tiger
    g.save(); g.translate(x, y); g.scale(s, s); g.lineCap = 'round'; g.lineJoin = 'round';
    const pts = HUM.map((v, i) => XY.lerp(v, TIG[i], m)), out = XY.RIG.spline(pts, true, 4);
    const L = dash == null ? null : 900 * dash; if (L != null) { g.setLineDash([L, 2000]); }
    XY.path(g, out, true); g.fillStyle = W0; g.fill();
    if (dash == null || dash > 0.85) { g.save(); g.clip(); g.fillStyle = g.createPattern(hatch('dv-h2', 4, SEPIA, 0.9), 'repeat'); g.beginPath(); g.ellipse(-30, 10, 34, 46, 0, 0, TAU); g.fill(); g.restore(); }
    g.strokeStyle = INK; g.lineWidth = 1.4 / s; XY.path(g, out, true); g.stroke();
    // ear: a human ear shrinks, a round tiger ear rises on top
    g.lineWidth = 1.1 / s; g.beginPath(); g.ellipse(-6, -2, 6 * (1 - m) + 0.1, 10 * (1 - m) + 0.1, 0, -1.4, 1.8); g.stroke();
    if (m > 0.25) { const e = XY.clamp((m - 0.25) / 0.5); g.beginPath(); g.moveTo(-34, -30); g.quadraticCurveTo(-34 - 6 * e, -30 - 26 * e, -16, -38 - 4 * e); g.stroke(); }
    const ex = XY.lerp(16, 26, m), ey = XY.lerp(-12, -16, m); g.beginPath(); g.moveTo(ex - 6, ey + 1); g.quadraticCurveTo(ex, ey - 4, ex + 6, ey - 1 - 2 * m); g.quadraticCurveTo(ex, ey + 3, ex - 6, ey + 1); g.stroke();
    g.fillStyle = INK; g.beginPath(); g.arc(ex + 1, ey, 1.6, 0, TAU); g.fill();
    if (m < 0.5) { g.globalAlpha = 1 - m * 2; for (let k = -2; k <= 2; k++) { g.beginPath(); g.moveTo(-14 + k * 7, -44); g.lineTo(-11 + k * 7, -58); g.lineTo(-8 + k * 7, -44); g.stroke(); } g.globalAlpha = 1; }
    if (m > 0.35) { g.globalAlpha = XY.clamp((m - 0.35) / 0.4); g.strokeStyle = SANG; g.lineWidth = 3 / s;
      [[-24, -30, -8, -24], [-30, -12, -12, -8], [-34, 10, -14, 12], [6, -34, 14, -22], [20, -2, 30, 6]].forEach(l => { g.beginPath(); g.moveTo(l[0], l[1]); g.quadraticCurveTo((l[0] + l[2]) / 2 + 4, (l[1] + l[3]) / 2 - 6, l[2], l[3]); g.stroke(); });
      g.globalAlpha = 1; g.strokeStyle = INK; }
    if (m > 0.6) { g.globalAlpha = XY.clamp((m - 0.6) / 0.3); g.lineWidth = 0.8 / s; for (let k = 0; k < 4; k++) { g.beginPath(); g.moveTo(52, 14 + k * 3); g.quadraticCurveTo(66, 10 + k * 5, 80, 8 + k * 8); g.stroke(); } g.globalAlpha = 1; }
    if (m > 0.8) { g.fillStyle = W0; g.lineWidth = 1 / s; g.beginPath(); g.moveTo(46, 26); g.lineTo(49, 36); g.lineTo(52, 26); g.fill(); g.stroke(); }
    g.setLineDash([]); g.restore();
  };
  // a second comparison study: the white horse's head beside the dragon it really is (白龙马 is the Dragon King's son)
  const HORSE = [-30, 20, -26, -6, -14, -24, 4, -30, 22, -22, 40, -6, 50, 8, 46, 16, 30, 16, 10, 12, -8, 24, -16, 36];
  const DRAG = [-34, 20, -30, -8, -16, -28, 6, -34, 26, -26, 48, -14, 66, -4, 62, 12, 40, 18, 14, 14, -8, 26, -18, 38];
  const gears = (g, x, y, t) => {
    [0, 0.5, 1].forEach((m, k) => { const cx = x + k * 92, pts = XY.RIG.spline(HORSE.map((v, i) => XY.lerp(v, DRAG[i], m)), true, 4);
      g.save(); g.translate(cx, y); XY.path(g, pts, true); g.fillStyle = W0; g.fill(); g.strokeStyle = INK; g.lineWidth = 1.2; g.stroke();
      g.save(); g.clip(); g.fillStyle = g.createPattern(hatch('dv-h1', 7, SEPIA, 0.8), 'repeat'); g.fillRect(-40, 4, 100, 40); g.restore();
      g.fillStyle = INK; g.beginPath(); g.arc(14, -14, 2, 0, TAU); g.fill(); g.beginPath(); g.moveTo(-6, -24); g.lineTo(-2 - 6 * m, -40 - 10 * m); g.lineTo(4, -26); g.stroke();
      if (m > 0) { g.globalAlpha = m; g.beginPath(); g.moveTo(-10, -26); g.quadraticCurveTo(-20, -52, -6, -60); g.moveTo(2, -30); g.quadraticCurveTo(-2, -56, 14, -62); g.stroke();
        g.beginPath(); g.moveTo(58, 8); g.bezierCurveTo(76, 4 + 6 * Math.sin(t * 2 + k), 88, 20, 96, 12 + 6 * Math.sin(t * 2.4)); g.stroke(); g.globalAlpha = 1; }
      g.restore(); if (k < 2) { g.beginPath(); g.moveTo(cx + 56, y); g.lineTo(cx + 70, y); g.lineTo(cx + 65, y - 4); g.moveTo(cx + 70, y); g.lineTo(cx + 65, y + 4); g.strokeStyle = INK; g.stroke(); } });
  };
  const vortex = (g, x, y, r, t, n = 3) => { g.strokeStyle = SEPIA; g.lineWidth = 0.9;
    for (let k = 0; k < n; k++) { g.beginPath(); for (let q = 0; q <= 60; q++) { const a = q / 60 * TAU * 2.2 + t * 1.6 + k * 2.1, rr = r * (1 - q / 70); g.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr * 0.6); } g.stroke(); } };
  const tigerStudy = (g, x, y, t, roar) => {   // red-chalk tiger crouching in the cage study, tail flicking
    g.save(); g.translate(x, y); g.strokeStyle = SANG; g.lineWidth = 1.5; g.lineCap = 'round'; g.lineJoin = 'round';
    g.beginPath(); g.ellipse(0, -34, 70, 25, 0.04, 0, TAU); g.fillStyle = W0; g.fill(); g.stroke();
    g.save(); g.clip(); g.fillStyle = g.createPattern(hatch('dv-s1', 4, SANG, 1), 'repeat'); g.beginPath(); g.ellipse(10, -16, 70, 14, 0, 0, TAU); g.fill(); g.restore();
    for (let k = 0; k < 7; k++) { const sx = -46 + k * 15; g.lineWidth = 3; g.beginPath(); g.moveTo(sx, -58); g.quadraticCurveTo(sx + 6, -38, sx - 2, -16); g.stroke(); }
    g.lineWidth = 1.5; [[-50, -14, -56, 0], [-38, -12, -42, 0], [40, -16, 46, 0], [54, -16, 60, 0]].forEach(l => { g.beginPath(); g.moveTo(l[0], l[1]); g.lineTo(l[2], l[3]); g.lineTo(l[2] - 8, l[3]); g.stroke(); });
    const tw = 0.5 * Math.sin(t * 2.6); g.lineWidth = 4; g.beginPath(); g.moveTo(66, -40); g.bezierCurveTo(96, -50, 96 + 10 * tw, -86, 80 + 20 * tw, -98); g.stroke();
    g.lineWidth = 1.5; g.save(); g.translate(-80, -56); g.beginPath(); const hp = XY.RIG.spline(TIG.map((v, i) => v * 0.5 * (i % 2 ? 1 : -1)), true, 4); XY.path(g, hp, true); g.fillStyle = W0; g.fill(); g.stroke();
    g.beginPath(); g.moveTo(14, -18); g.quadraticCurveTo(20, -32, 8, -22); g.stroke(); g.lineWidth = 2.6; [[-4, -14, 4, -8], [6, -16, 12, -6], [-10, 2, -2, 4]].forEach(l => { g.beginPath(); g.moveTo(l[0], l[1]); g.lineTo(l[2], l[3]); g.stroke(); });
    g.lineWidth = 1.5; g.beginPath(); g.moveTo(-30, 10); g.quadraticCurveTo(-22, 14 + 10 * roar, -10, 16 + 8 * roar); g.stroke();
    g.fillStyle = SANG; g.beginPath(); g.arc(-12, -8, 2.2, 0, TAU); g.fill(); g.restore();
    g.restore();
  };
  const scholar = (g, x, y, t, cup, puff) => {   // 黄袍怪 as the handsome scholar: drapery study, curled hair, scholar's cap
    g.save(); g.translate(x, y); g.strokeStyle = INK; g.lineWidth = 1.2; g.lineCap = 'round'; g.lineJoin = 'round';
    const robe = [-46, 0, 40, 0, 30, -60, 22, -140, 10, -170, -18, -170, -30, -140, -36, -70];
    XY.path(g, XY.RIG.spline(robe, true, 4), true); g.fillStyle = W0; g.fill(); g.stroke();
    g.save(); g.clip(); g.fillStyle = g.createPattern(hatch('dv-h2', 4, SEPIA, 0.9), 'repeat'); g.fillRect(4, -180, 60, 190); g.restore();
    for (let k = 0; k < 6; k++) { const fx = -34 + k * 13; g.beginPath(); g.moveTo(fx + 4, -150 + k * 6); g.bezierCurveTo(fx - 4, -100, fx + 8, -50, fx + (k % 2 ? 4 : -4), 0); g.stroke(); }
    // arm with the cup: lowered → raised to the mouth (2.5–2.85) → lowered as he sprays
    const ax = XY.lerp(-30, -40, cup), ay = XY.lerp(-96, -176, cup);
    g.lineWidth = 9; g.strokeStyle = INK; g.beginPath(); g.moveTo(-10, -150); g.quadraticCurveTo(-38, -130, ax, ay); g.stroke(); g.lineWidth = 7; g.strokeStyle = W0; g.stroke(); g.strokeStyle = INK; g.lineWidth = 1.2;
    g.beginPath(); g.moveTo(ax - 8, ay - 10); g.lineTo(ax + 8, ay - 10); g.lineTo(ax + 5, ay + 4); g.lineTo(ax - 5, ay + 4); g.closePath(); g.fillStyle = W0; g.fill(); g.stroke();
    // head in profile facing left, cheeks puffed before the spray
    g.beginPath(); g.moveTo(-4, -170); g.quadraticCurveTo(-26 - 4 * puff, -172, -24 - 3 * puff, -186); g.lineTo(-28, -194); g.quadraticCurveTo(-24, -210, -6, -212); g.quadraticCurveTo(12, -208, 10, -186); g.quadraticCurveTo(8, -172, -4, -170); g.fillStyle = W0; g.fill(); g.stroke();
    g.beginPath(); g.moveTo(-20, -200); g.lineTo(-14, -201); g.stroke(); g.fillStyle = INK; g.beginPath(); g.arc(-17, -200, 1.3, 0, TAU); g.fill();
    for (let k = 0; k < 6; k++) { const hx = 4 + k * 3, hy = -206 + k * 7; g.beginPath(); g.arc(hx, hy, 5, 0.2 + t * 0.3 % 0.01, 4.8); g.stroke(); }
    g.beginPath(); g.moveTo(-14, -212); g.lineTo(-12, -226); g.lineTo(12, -226); g.lineTo(12, -208); g.fillStyle = W0; g.fill(); g.stroke();
    g.restore();
  };
  const mtext = (g, s, x, y, size, a = 0.8) => { g.save(); g.translate(x, y); g.scale(-1, 1); g.globalAlpha = a; g.fillStyle = INK; g.font = XY.font(size, XY.cnFont.kai); g.fillText(s, 0, 0); g.restore(); };   // mirror-written Chinese, right to left
  const NOTES = [['人何以化为虎', 330, 196, 21], ['妖以咒水噀之', 330, 224, 21], ['马头与龙首', 330, 362, 18],
    ['铁笼长三尺', 1250, 396, 19], ['虎之性', 1250, 420, 18], ['咒水之旋', 960, 340, 18], ['花果山', 430, 330, 16]];
  const HEADS = [390, 520, 650, 780, 910];
  const atB = (e, b, key, acts) => { const t2 = e.cell.t0 + b * XY.BEAT, a = XY.anchor(key, XY.walkPhase(t2), acts); return [XY.procWorldX(t2) - e.cell.x + a[0], e.groundY + a[1]]; };

  XY.STYLES.davinci = {
    hits: [4.0, 5.4],
    bg(g, W, H, c, scale) {
      K.paint(g, K.pix(W, H, scale, 3, (x, y) => { const n = XY.fbm(x / 160, y / 120, 23, 4), m = XY.fbm(x / 14, y / 14, 24, 2), ed = Math.min(x, W - x, y, H - y), e = ed < 60 ? (60 - ed) / 60 : 0;
        const gut = Math.exp(-Math.pow((x - 708) / 26, 2)), v = 1 + 0.05 * n + 0.02 * m - 0.12 * e - 0.1 * gut; return [234 * v, 214 * v, 172 * v - 8 * e]; }), W, H);
      const R = XY.rng(2323);
      for (let k = 0; k < 70; k++) { const x = R() * W, y = R() * H, r = 1 + R() * 4; g.fillStyle = `rgba(150,96,50,${0.12 + R() * 0.2})`; g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill(); }
      [[200, 600, 120], [1100, 180, 160], [620, 720, 90]].forEach(([x, y, r]) => { const gr = g.createRadialGradient(x, y, r * 0.6, x, y, r); gr.addColorStop(0, 'rgba(170,120,60,0)'); gr.addColorStop(0.9, 'rgba(170,120,60,0.07)'); gr.addColorStop(1, 'rgba(170,120,60,0)'); g.fillStyle = gr; g.fillRect(x - r, y - r, 2 * r, 2 * r); });
      g.strokeStyle = 'rgba(120,90,60,0.35)'; g.lineWidth = 1; g.beginPath(); g.moveTo(708, 0); g.lineTo(709, H); g.stroke();
      // the other side of the leaf shows through: its mirror writing reads the right way round, faintly
      g.save(); g.globalAlpha = 0.045; g.fillStyle = INK; g.font = XY.font(20, MONO);
      g.font = XY.font(20, XY.cnFont.kai); ['虎复为人', '须得行者', '方解此难'].forEach((s, k) => { g.fillText(s, 60 + k * 20, 744 + k * 10); }); g.restore();
      // title, numerals, notes
      g.fillStyle = INK; g.font = XY.font(66, XY.cnFont.xing); g.fillText('变虎', 60, 116);
      g.font = XY.font(42, MONO); g.fillText('23', 1352, 62); g.strokeStyle = INK; g.lineWidth = 1; g.beginPath(); g.moveTo(1348, 70); g.lineTo(1398, 68); g.stroke();
      NOTES.forEach(([s, x, y, z]) => mtext(g, s, x, y, z));
      // the caged-tiger study: bars and dimension line in ink
      g.strokeStyle = INK; g.lineWidth = 1.3; g.beginPath(); g.moveTo(1010, 352); g.lineTo(1010, 140); g.quadraticCurveTo(1130, 50, 1250, 140); g.lineTo(1250, 352); g.closePath(); g.stroke();
      for (let k = 1; k < 8; k++) { const x = 1010 + k * 30, top = 140 - 84 * Math.sin(Math.PI * k / 8) * 0.95; g.beginPath(); g.moveTo(x, 352); g.lineTo(x, top); g.stroke(); }
      [200, 280].forEach(y => { g.beginPath(); g.moveTo(1010, y); g.lineTo(1250, y); g.stroke(); });
      g.lineWidth = 2.2; g.beginPath(); g.moveTo(1100, 352); g.lineTo(1100, 236); g.lineTo(1160, 236); g.lineTo(1160, 352); g.stroke(); g.lineWidth = 1.3;   // the cage door
      g.beginPath(); g.moveTo(1010, 368); g.lineTo(1250, 368); g.moveTo(1010, 362); g.lineTo(1010, 374); g.moveTo(1250, 362); g.lineTo(1250, 374); g.stroke();
      // 花果山 in the margin: a crag with a tiny monkey on top — the one who is missing from the page
      g.save(); g.translate(-860, -200);
      g.beginPath(); g.moveTo(1300, 620); g.lineTo(1322, 560); g.lineTo(1338, 572); g.lineTo(1352, 500); g.lineTo(1370, 540); g.lineTo(1392, 620); g.stroke();
      for (let k = 0; k < 9; k++) { g.beginPath(); g.moveTo(1330 + k * 6, 600); g.lineTo(1340 + k * 6, 560 + k * 3); g.stroke(); }
      g.fillStyle = INK; g.beginPath(); g.arc(1352, 492, 4, 0, TAU); g.fill(); g.beginPath(); g.moveTo(1348, 496); g.lineTo(1346, 506); g.lineTo(1358, 506); g.lineTo(1356, 496); g.fill(); g.beginPath(); g.moveTo(1358, 504); g.quadraticCurveTo(1368, 500, 1364, 490); g.stroke(); g.restore();
      // a quill lying across the bottom margin, with its shadow
      g.save(); g.translate(1140, 750); g.rotate(-0.06);
      g.fillStyle = 'rgba(80,56,30,0.25)'; g.beginPath(); g.ellipse(6, 8, 230, 9, 0, 0, TAU); g.fill();
      g.fillStyle = '#EDE6D6'; g.strokeStyle = INK; g.lineWidth = 1; g.beginPath(); g.moveTo(-240, 0); g.quadraticCurveTo(-60, -22, 200, -8); g.quadraticCurveTo(-60, 14, -240, 0); g.fill(); g.stroke();
      for (let k = 0; k < 40; k++) { const x = -200 + k * 10; g.beginPath(); g.moveTo(x, -2); g.lineTo(x + 8, -12 + Math.abs(k - 20) * 0.3); g.moveTo(x, 2); g.lineTo(x + 8, 10 - Math.abs(k - 20) * 0.3); g.stroke(); }
      g.lineWidth = 2; g.beginPath(); g.moveTo(-240, 0); g.lineTo(-270, 2); g.stroke(); g.fillStyle = INK; g.beginPath(); g.arc(-272, 2, 2, 0, TAU); g.fill();
      g.restore();
      // arrows of the physiognomy row
      g.strokeStyle = INK; g.lineWidth = 1; HEADS.slice(0, 4).forEach(x => { g.beginPath(); g.moveTo(x + 70, 150); g.lineTo(x + 84, 150); g.lineTo(x + 79, 146); g.moveTo(x + 84, 150); g.lineTo(x + 79, 154); g.stroke(); });
    },
    draw(g, e) {
      const { t, u } = e, b = e.beat;
      const acts = { monk: { palm: K.bump(b, 3.2, 3.6, 3.95, 4.05) }, bajie: { scratch: K.bump(b, 5.6, 5.9, 6.8, 7.3) }, shaseng: { lift: K.bump(b, 4.9, 5.1, 5.7, 6.1) } };
      const gone = b > 4.8, A2 = gone ? K.cast(acts, { rider: false }) : acts;   // the tiger leaps off: the horse walks on with an empty saddle
      { const T4 = atB(e, 4.1, 'monk.head', acts); K.push(g, e, T4[0] + 170, T4[1] - 90, K.pushOf(b, 3.6, 4.1, 5.4, 0.12)); }
      const [cv, lg] = K.layer(e, 'dv-ink'), d = XY.clamp((u + 0.4) / 0.36);
      // ---- the studies: physiognomy row (traced in on entry), horse and dragon, the enchanted water, the cage
      HEADS.forEach((x, k) => { const dk = XY.clamp(d * 1.7 - k * 0.17), hl = K.bump(b, 4.0 + k * 0.12, 4.08 + k * 0.12, 4.2 + k * 0.12, 4.5 + k * 0.12);
        if (dk > 0) head(lg, x, 150, 0.95, k / 4, dk < 1 ? dk : null);
        if (hl > 0) { lg.save(); lg.strokeStyle = `rgba(176,88,58,${hl})`; lg.lineWidth = 3; lg.beginPath(); lg.ellipse(x, 150, 60, 58, 0, 0, TAU); lg.stroke(); lg.restore(); } });   // each step lights up as he passes it
      gears(lg, 90, 300, t); vortex(lg, 800, 300, 40, t); vortex(lg, 872, 320, 24, -t * 1.3, 2);
      // the tiger: leaps off the saddle at 4.8 in a red-chalk arc and lands in the cage study at 5.4; the door bars are drawn shut
      const sd = e.at('monk.saddle', A2), sd48 = atB(e, 4.8, 'monk.saddle', acts), jf = (b - 4.8) / 0.6;
      if (jf >= 1) tigerStudy(lg, 1132, 342, t, K.hit(e, 5.4, 0.5));
      else if (jf > 0) { const q = XY.easeIO(jf), x = XY.lerp(sd48[0] + 20, 1132, q), y = XY.lerp(sd48[1] + 10, 342, q) - 200 * Math.sin(q * Math.PI);
        lg.save(); lg.translate(x, y); lg.rotate(-0.5 * Math.sin(q * Math.PI)); lg.scale(-1 + 0 * q, 1); lg.scale(-1, 1); tigerStudy(lg, 0, 0, t * 3, 1); lg.restore();
        lg.save(); lg.strokeStyle = 'rgba(176,88,58,0.5)'; lg.setLineDash([5, 7]); lg.lineWidth = 1.6; lg.beginPath();
        for (let k = 0; k <= 24; k++) { const qq = k / 24 * q; lg.lineTo(XY.lerp(sd48[0] + 20, 1132, qq), XY.lerp(sd48[1] + 10, 342, qq) - 200 * Math.sin(qq * Math.PI) - 40); } lg.stroke(); lg.restore(); }
      if (b > 5.4) { lg.strokeStyle = INK; lg.lineWidth = 2.6; for (let k = 0; k < 3; k++) { if (b < 5.4 + k * 0.08) break; const x = 1110 + k * 20; lg.beginPath(); lg.moveTo(x, 352); lg.lineTo(x, 238); lg.stroke(); } }
      // ---- proportion of horse and rider: circle and square that travel with him
      const C0 = [sd[0] + 8, sd[1] - 6];
      lg.save(); lg.strokeStyle = 'rgba(70,46,26,0.42)'; lg.lineWidth = 1; if (d < 1) lg.setLineDash([1200 * d, 3000]);
      lg.beginPath(); lg.arc(C0[0], C0[1], 152, 0, TAU); lg.stroke(); lg.strokeRect(C0[0] - 132, C0[1] - 132, 264, 264 - (C0[1] + 132 - 704 > 0 ? C0[1] + 132 - 704 : 0));
      lg.setLineDash([4, 5]); lg.beginPath(); lg.moveTo(C0[0], C0[1] - 160); lg.lineTo(C0[0], 702); lg.moveTo(C0[0] - 160, C0[1]); lg.lineTo(C0[0] + 160, C0[1]); lg.stroke(); lg.setLineDash([]);
      for (let k = 0; k <= 8; k++) { const y = C0[1] - 132 + k * 33; lg.beginPath(); lg.moveTo(C0[0] - 138, y); lg.lineTo(C0[0] - 126, y); lg.stroke(); }
      lg.restore();
      const T4s = atB(e, 4.05, 'monk.head', acts); if (b >= 4.05) {   // ink spattered on the page where the spray hit (under the pilgrims)
        const R = XY.rng(303); lg.fillStyle = 'rgba(40,26,14,0.85)';
        for (let k = 0; k < 11; k++) { const x = T4s[0] + (R() - 0.5) * 110, y = T4s[1] + (R() - 0.6) * 70, r = 2 + R() * 6; lg.beginPath(); lg.ellipse(x, y, r, r * (0.7 + R() * 0.5), R() * 3, 0, TAU); lg.fill();
          for (let q = 0; q < 3; q++) { lg.beginPath(); lg.arc(x + (R() - 0.5) * r * 4, y + (R() - 0.5) * r * 4, 0.8 + R(), 0, TAU); lg.fill(); } } }
      // ---- the procession in pen and hatching; after the spray the monk's robe and hands turn to tiger, then the rider is gone
      const tiger = b > 4.3;
      XY.drawProcession(lg, e.phase, e.procX, e.groundY, penFor(lg, tiger), A2);
      const m = XY.smooth((b - 4.0) / 0.6), mh = e.at('monk.head', acts);
      if (b > 3.99 && !gone) head(lg, mh[0] + 3, mh[1] + 2, XY.lerp(0.36, 0.44, m), m, null);
      if (gone) { lg.save(); lg.translate(sd[0] + 4, sd[1] - 6); lg.rotate(-0.3); lg.fillStyle = W0; lg.strokeStyle = INK; lg.lineWidth = 1;   // the 毗卢帽 left on the empty saddle
        for (let k = -2; k <= 2; k++) { lg.beginPath(); lg.moveTo(k * 6 - 3, 0); lg.lineTo(k * 6, -12 + Math.abs(k) * 2); lg.lineTo(k * 6 + 3, 0); lg.closePath(); lg.fill(); lg.stroke(); }
        lg.beginPath(); lg.moveTo(-16, 0); lg.lineTo(16, 0); lg.stroke(); lg.restore(); }
      // ---- the scholar (the 黄袍怪 in disguise) stands in the sketch area above: drinks at 3.2, puffs, sprays on beat 4
      const SX = 1330, SY = 446, cup = K.bump(b, 3.2, 3.6, 3.85, 4.1), puff = K.bump(b, 3.6, 3.75, 3.95, 4.02);
      scholar(lg, SX, SY, t, cup, puff);
      const M = [SX - 28, SY - 186], T = atB(e, 4.05, 'monk.head', acts), f = XY.clamp((b - 3.97) / 0.12), fade = 1 - XY.clamp((b - 4.2) / 0.3);
      if (f > 0 && fade > 0) { lg.save(); lg.globalAlpha = fade; lg.strokeStyle = INK; lg.lineWidth = 1.3;
        for (let k = 0; k < 9; k++) { const o = (k - 4) * 6; lg.beginPath();
          for (let q = 0; q <= 30; q++) { const s = q / 30 * f, x = XY.lerp(M[0], T[0], s), y = XY.lerp(M[1], T[1], s) - 90 * Math.sin(s * Math.PI) + o * (0.3 + s) + 4 * Math.sin(s * 18 + k + t * 8); q ? lg.lineTo(x, y) : lg.moveTo(x, y); }
          lg.stroke(); }
        const fx = XY.lerp(M[0], T[0], f), fy = XY.lerp(M[1], T[1], f) - 90 * Math.sin(f * Math.PI); vortex(lg, fx, fy, 22, t * 3, 2); vortex(lg, fx + 12, fy - 16, 14, -t * 3, 1);
        lg.restore(); }
      // ---- a hand writes a new mirrored line in the bottom margin, right to left
      { const s = '记：妖之咒水能易人形', x1 = 660, ph = (t * 0.3) % 1.25, pr = XY.clamp(ph);
        lg.font = XY.font(19, XY.cnFont.kai); const tw = lg.measureText(s).width, xe = x1 - tw * pr;
        lg.save(); lg.beginPath(); lg.rect(xe, 720, x1 - xe + 2, 34); lg.clip(); mtext(lg, s, x1, 744, 19, 0.85); lg.restore();
        if (ph < 1) { lg.strokeStyle = INK; lg.lineWidth = 1.4; lg.beginPath(); lg.moveTo(xe, 742); lg.lineTo(xe + 30, 700); lg.stroke(); } }
      K.blit(e.S ? g : g, cv, 1, 'multiply');
    },
    post(canvas, g, e) {   // a candle beside the desk: the warm light breathes over the page
      const fl = 0.5 + 0.3 * XY.noise1(e.t * 2.2, 5) + 0.2 * XY.noise1(e.t * 7, 6), w = canvas.width, h = canvas.height;
      const gr = g.createRadialGradient(w * 0.55, h * 0.4, h * 0.2, w * 0.55, h * 0.45, w * 0.75); gr.addColorStop(0, 'rgba(255,240,210,0)'); gr.addColorStop(1, `rgba(120,80,40,${0.16 + 0.08 * fl})`);
      g.save(); g.globalCompositeOperation = 'multiply'; g.fillStyle = gr; g.fillRect(0, 0, w, h); g.restore();
    },
  };
})();
