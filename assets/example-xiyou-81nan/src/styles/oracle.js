// 05 甲骨卜辞 · 出城逢虎 — a Shang tortoise plastron in a dark divining room. The inscription asks the question of the
// chapter: 「癸卯卜，贞：王出，亡祸？王占曰：有虎」. A heated bronze rod touches a hollow, the 卜-shaped crack runs to the
// cinnabar-filled 虎 on beat 1; the glyph wakes on beat 2, tears itself off the bone on beat 3 and turns from the upright
// pictograph into a real leaping tiger in front of Tang Seng's horse; on beat 4 the 星 of 太白金星 flashes, the tiger shrinks
// back into the bone and the verification 「允有虎」 is cut beside it. Everything is incised: dark cut, light lower lip.
(() => {
  'use strict';
  const XY = window.XY, K = XY.KIT_A, TAU = XY.TAU;
  const BONE = '#E3D3B1', CUT = '#4A3020', LIP = 'rgba(255,248,228,0.85)', CIN = '#B0301E';
  const rev = (u, a, d) => XY.clamp((u - a) / d);

  // oracle-bone pictographs on a 100×100 box (polylines; circles as [cx, cy, r] with a leading 'o')
  const G = {
    hu: [[40, 22, 31, 9, 48, 3, 64, 8, 70, 20, 66, 30], [40, 22, 27, 27, 38, 32, 44, 30], [31, 12, 34, 17, 30, 20, 34, 24], [62, 6, 68, -1, 71, 9],
      [44, 30, 40, 50, 42, 72, 46, 86, 58, 86, 62, 70, 64, 50, 66, 30], [56, 14, 57, 14], [64, 38, 52, 43], [63, 50, 50, 55], [62, 62, 49, 67], [60, 74, 50, 78],
      [42, 44, 30, 50, 28, 60, 21, 63], [44, 78, 32, 84, 30, 94, 23, 96], [52, 86, 58, 96, 70, 98, 78, 90, 74, 82]],
    gui: [[20, 20, 80, 80], [80, 20, 20, 80], [20, 20, 10, 32], [80, 20, 90, 32], [20, 80, 10, 68], [80, 80, 90, 68]],
    mao: [[42, 16, 30, 50, 42, 84], [58, 16, 70, 50, 58, 84], [42, 16, 48, 28], [58, 16, 52, 28]],
    bu: [[48, 8, 48, 92], [48, 40, 76, 28]],
    zhen: [[30, 22, 30, 62], [70, 22, 70, 62], [30, 22, 70, 22], [30, 42, 70, 42], [30, 62, 70, 62], [36, 62, 26, 90], [64, 62, 74, 90]],
    wang: [[28, 18, 72, 18], [50, 18, 50, 76], [20, 70, 50, 88, 80, 70]],
    chu: [[44, 8, 42, 42, 64, 44], [42, 26, 30, 20], [48, 16, 58, 10], [20, 52, 24, 90, 76, 90, 80, 52]],
    wangx: [[62, 10, 40, 50], [40, 50, 40, 90, 74, 90]],
    huo: [[48, 8, 48, 92], [48, 46, 78, 30], [48, 62, 22, 50], [30, 20, 40, 30]],
    you: [[30, 86, 58, 22], [58, 22, 74, 36], [58, 22, 46, 30], [58, 22, 72, 20]],
    yue: [[24, 40, 76, 40, 76, 82, 24, 82, 24, 40], [40, 24, 62, 30]],
    yun: [[50, 10, 50, 40], [32, 26, 68, 26], [40, 40, 28, 90], [52, 40, 72, 88]],
    yin: [[50, 8, 50, 92], [36, 24, 50, 8, 64, 24], [38, 78, 50, 92, 62, 78], [32, 50, 68, 50], [32, 40, 32, 60], [68, 40, 68, 60]],
    niu: [[50, 32, 50, 92], [16, 8, 26, 40, 50, 30, 74, 40, 84, 8], [28, 62, 72, 62]],
    xiong: [[30, 20, 40, 10, 48, 20], [40, 12, 46, 40, 40, 70, 46, 92], [46, 40, 70, 34, 80, 44], [44, 60, 70, 58, 78, 70], [40, 26, 26, 34], [46, 92, 30, 96]],
    xing: [['o', 26, 26, 13], ['o', 74, 26, 13], ['o', 50, 58, 13], [50, 71, 50, 96], [32, 84, 68, 84]],
    wu: [[18, 14, 82, 14], [18, 86, 82, 86], [30, 14, 70, 86], [70, 14, 30, 86]],
  };
  // a glyph as incised strokes at (x, y), box scale s; cut colour (cinnabar-filled when col is red), optional lip, draw-on fraction f
  const glyph = (g, key, x, y, s, w, col = CUT, lip = true, f = 1, rot = 0) => {
    const L = G[key], n = L.length; g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s); g.lineCap = g.lineJoin = 'round';
    const pass = (dx, dy, c, lw) => { g.strokeStyle = c; g.lineWidth = lw / s; L.forEach((P, i) => { const fi = XY.clamp(f * n - i); if (fi <= 0) return; g.beginPath();
      if (P[0] === 'o') g.arc(P[1] + dx, P[2] + dy, P[3], -Math.PI / 2, -Math.PI / 2 + TAU * fi); else { const Q = K.partial(P, fi); g.moveTo(Q[0] + dx, Q[1] + dy); for (let k = 2; k < Q.length; k += 2) g.lineTo(Q[k] + dx, Q[k + 1] + dy); } g.stroke(); }); };
    if (lip) pass(1.6 / s, 1.6 / s, LIP, w); if (col !== CUT) pass(0, 0, CUT, w + 2.4); pass(0, 0, col, w);
    g.restore(); };

  // the plastron: a squarish oval, cropped by the panel's bottom edge, with the axillary and inguinal notches
  const plastron = () => { const p = [], cx = 590, cy = 540, rx = 575, ry = 520;
    for (let k = 0; k < 90; k++) { const a = k / 90 * TAU, c = Math.cos(a), s = Math.sin(a), q = 2.7;
      let x = cx + rx * Math.sign(c) * Math.pow(Math.abs(c), 2 / q), y = cy + ry * Math.sign(s) * Math.pow(Math.abs(s), 2 / q);
      const notch = Math.exp(-Math.pow((y - 330) / 40, 2)) * 30 + Math.exp(-Math.pow((y - 610) / 46, 2)) * 22; x -= Math.sign(c) * notch * Math.pow(Math.abs(c), 0.5);
      if (y < 120) x = cx + (x - cx) * (0.94 + 0.06 * Math.sin(a * 9)); p.push(x, y); }
    return p; };
  const PL = plastron();
  const HOLES = []; [200, 360, 520].forEach((y, r) => [-1, 1].forEach(sd => HOLES.push({ x: 590 + sd * (70 + 6 * r), y, sd })));
  const HOT = HOLES[3];   // right of the seam at y 360: the one the rod burns
  const crackOf = (h, seed) => { const R = XY.rng(seed), v = [h.x, h.y - 40], br = [h.x, h.y + 4];
    for (let k = 1; k <= 7; k++) v.push(h.x + (R() - 0.5) * 7, h.y - 40 + k * 12); let bx = h.x, by = h.y + 4;
    for (let k = 1; k <= (h === HOT ? 13 : 6); k++) { bx += h.sd * (12 + R() * 4); by += (R() - 0.62) * 10; br.push(bx, by); } return [v, br]; };
  const CRACKS = HOLES.map((h, i) => crackOf(h, 40 + i));
  const HU = [780, 130, 3];                                   // the big 虎: box origin and scale
  const COLS = [[150, ['gui', 'mao', 'bu', 'zhen']], [225, ['wang', 'chu', 'wangx', 'huo']], [300, ['wang', 'yue', 'you', 'hu']]];
  const VERIFY = [1112, ['yun', 'you', 'hu']];
  const PEN = { outline: CUT, ow: 2, wob: 0.5, seed: 5,
    color: r => (r === 'kasaya' || r === 'red' || r === 'staff' ? CIN : r === 'ink' || r === 'stripe' || r === 'hoof' || r === 'mane' ? CUT : r === 'horse' || r === 'horse2' ? '#C4A678' : r === 'saddle' ? '#A8885E' : r === 'gold' || r === 'metal' ? '#EADCB6' : '#D8C6A1') };
  const actsAt = u => ({ monk: { palm: K.win(u, 0.46, 0.9, 0.06) } });
  // where the tiger is: carved (0) → lifting and turning (0.5–0.6) → crouched in front of the horse → back into its groove (0.8–0.92)
  const tigerAt = u => { const home = [HU[0], HU[1], HU[2], 0], land = [880, 470, 2.3, -Math.PI / 2 + 0.1];
    if (u < 0.5) return { p: home, lift: 0 };
    if (u < 0.6) { const q = XY.easeIO(rev(u, 0.5, 0.1)); return { p: [XY.lerp(home[0], land[0], q), XY.lerp(home[1], land[1], q) - 120 * Math.sin(Math.PI * q), XY.lerp(home[2], land[2], q), XY.lerp(0, land[3], q)], lift: q }; }
    if (u < 0.8) return { p: land, lift: 1 };
    const q = XY.easeIO(rev(u, 0.8, 0.12)); return { p: [XY.lerp(land[0], home[0], q), XY.lerp(land[1], home[1], q) - 60 * Math.sin(Math.PI * q), XY.lerp(land[2], home[2], q), XY.lerp(land[3], 0, q)], lift: 1 - q }; };
  // draw the 虎 with its box centre as the pivot
  const tiger = (g, p, w, col, lip, jitter, t) => { const s = p[2], cx = 50 * s, cy = 50 * s;
    g.save(); g.translate(p[0] + cx, p[1] + cy); g.rotate(p[3]); g.translate(-cx, -cy);
    if (jitter) { const j = K.step(t, 12); g.translate(1.5 * Math.sin(j * 2.1), 1.5 * Math.cos(j * 1.7)); }
    glyph(g, 'hu', 0, 0, s, w, col, lip); g.restore(); };

  XY.STYLES.oracle = {
    bg(g, W, H, c) {
      g.fillStyle = '#1A1410'; g.fillRect(0, 0, W, H);
      // far: an ox scapula and a carapace fragment in the dark beyond the plastron's shoulders
      g.save(); g.globalAlpha = 0.5; XY.path(g, [-20, 40, 160, -10, 230, 30, 120, 150, -20, 240], true); g.fillStyle = '#5A4A38'; g.fill();
      XY.path(g, [1000, -10, 1200, -20, 1200, 160, 1110, 120], true); g.fill(); g.restore();
      K.specks(g, 3, 300, 0, 0, W, 220, '#8A7458', 0.5, 1.6, 0.2, 0.5);
      g.save(); XY.path(g, PL, true); g.shadowColor = 'rgba(0,0,0,0.7)'; g.shadowBlur = 34; g.shadowOffsetY = 8; g.fillStyle = BONE; g.fill(); g.restore();
      g.save(); XY.path(g, PL, true); g.clip();
      const R = XY.rng(c.n * 13);
      for (let k = 0; k < 1100; k++) { const x = R() * W, y = R() * H, v = XY.fbm(x / 170, y / 170, 3, 3); g.fillStyle = v > 0 ? `rgba(160,118,64,${0.05 + 0.09 * v})` : `rgba(255,250,236,${0.08 * -v})`; g.beginPath(); g.arc(x, y, 6 + R() * 24, 0, TAU); g.fill(); }
      K.specks(g, 7, 2400, 0, 0, W, H, '#8A6A44', 0.3, 1.2, 0.15, 0.45);
      { const Rc = XY.rng(97); g.strokeStyle = 'rgba(96,66,40,0.28)'; g.lineWidth = 0.9;    // craquelure: short hairline cracks meeting at angles
        for (let k = 0; k < 260; k++) { let x = Rc() * W, y = Rc() * H, a = Rc() * TAU; g.beginPath(); g.moveTo(x, y); for (let s = 0; s < 4; s++) { a += (Rc() - 0.5) * 1.4; x += Math.cos(a) * (8 + Rc() * 14); y += Math.sin(a) * (8 + Rc() * 14); g.lineTo(x, y); } g.stroke(); } }
      const eg = g.createRadialGradient(590, 480, 220, 590, 520, 680); eg.addColorStop(0, 'rgba(120,80,40,0)'); eg.addColorStop(0.7, 'rgba(120,78,36,0.28)'); eg.addColorStop(1, 'rgba(92,56,24,0.62)'); g.fillStyle = eg; g.fillRect(0, 0, W, H);
      for (let k = 0; k < 7; k++) { const x = 80 + XY.hash(k, 61) * 1020, y = 80 + XY.hash(k, 62) * 620, r = 30 + 60 * XY.hash(k, 63); const sg = g.createRadialGradient(x, y, 0, x, y, r); sg.addColorStop(0, 'rgba(110,70,36,0.18)'); sg.addColorStop(1, 'rgba(110,70,36,0)'); g.fillStyle = sg; g.fillRect(x - r, y - r, 2 * r, 2 * r); }
      // growth lines inside the scutes, the scute furrows (natural grooves) and the bony sutures
      const furrow = (y0, amp, w, col) => { const P = []; for (let x = 0; x <= W; x += 16) P.push(x, y0 + amp * Math.sin(x / 90) + 4 * XY.noise1(x / 40, y0)); K.cut(g, P, w, col, 'rgba(255,248,228,0.5)', 1.2); };
      [[130, 20], [250, 10], [452, 6], [610, 8], [704, 3]].forEach(([y, a]) => furrow(y, a, y === 704 ? 3 : 2.2, 'rgba(96,64,36,0.6)'));
      [[190, 6], [304, 8], [526, 6], [660, 5]].forEach(([y, a]) => { const P = []; for (let x = 0; x <= W; x += 10) P.push(x, y + a * Math.sin(x / 50) + ((x / 10) % 2 ? 3 : -3)); K.stroke(g, P, 'rgba(110,80,50,0.25)', 1.2); });
      for (let k = 0; k < 18; k++) { const cy = [190, 350, 530, 650][k % 4], cx = k < 9 ? 330 : 850, r = 30 + (k % 5) * 26; g.strokeStyle = 'rgba(150,112,70,0.12)'; g.lineWidth = 1.3; g.beginPath(); g.ellipse(cx, cy, r * 1.6, r * 0.5, 0, 0, TAU); g.stroke(); }
      { const P = []; for (let y = 20; y <= H; y += 14) P.push(590 + 4 * XY.noise1(y / 30, 2) + ((y / 14) % 2 ? 2 : -2), y); K.cut(g, P, 2.6, 'rgba(90,58,32,0.6)', 'rgba(255,248,228,0.5)', 1.2); }
      // hollows: chiselled oval (凿) beside a drilled round pit (钻) with its old scorch; old cracks
      HOLES.forEach((h, i) => { const hg = g.createRadialGradient(h.x, h.y - 4, 2, h.x, h.y, 24); hg.addColorStop(0, '#2A1A10'); hg.addColorStop(0.7, '#6A4428'); hg.addColorStop(1, 'rgba(120,80,45,0)');
        g.fillStyle = hg; g.beginPath(); g.ellipse(h.x, h.y, 13, 23, 0, 0, TAU); g.fill();
        const sg = g.createRadialGradient(h.x + h.sd * 20, h.y + 4, 1, h.x + h.sd * 20, h.y + 4, 22); sg.addColorStop(0, 'rgba(30,16,8,0.9)'); sg.addColorStop(0.5, 'rgba(60,34,16,0.5)'); sg.addColorStop(1, 'rgba(60,34,16,0)');
        g.fillStyle = sg; g.beginPath(); g.arc(h.x + h.sd * 20, h.y + 4, 22, 0, TAU); g.fill();
        if (h !== HOT) { const [v, br] = CRACKS[i]; K.cut(g, v, 2, CUT, LIP, 1.3); K.cut(g, br, 2, CUT, LIP, 1.3); } });
      // the question in three columns, a cinnabar 虎 at its end; 寅 and 牛 by the great tiger; the 五 count
      COLS.forEach(([x, ks]) => ks.forEach((k, j) => glyph(g, k, x - 30, 112 + j * 74, 0.6, 3.6, k === 'hu' ? CIN : CUT)));
      // an older divination lower down (weathered), and one still only brushed in red ink, never cut
      [[392, ['gui', 'you', 'bu', 'zhen']], [446, ['yue', 'wangx', 'huo']]].forEach(([x, ks]) => ks.forEach((k, j) => { g.globalAlpha = 0.7; glyph(g, k, x - 22, 104 + j * 56, 0.44, 3, CUT); g.globalAlpha = 1; }));
      glyph(g, 'yin', 694, 132, 0.5, 3.4); glyph(g, 'xiong', 694, 276, 0.5, 3.4); glyph(g, 'wu', 1018, 214, 0.44, 4.4, CIN);
      g.restore();
      // a broken edge on the right where a piece has flaked off
      XY.path(g, [1150, 380, 1128, 400, 1136, 432, 1118, 452, 1132, 486, 1160, 500, 1190, 440], true); g.fillStyle = '#1A1410'; g.fill(); K.stroke(g, [1150, 380, 1128, 400, 1136, 432, 1118, 452, 1132, 486, 1160, 500], 'rgba(255,240,210,0.5)', 1.5);
    },
    draw(g, e) {
      const { u, t, beat } = e, acts = actsAt(u), W = e.W, H = e.H, hx = HOT.x + HOT.sd * 20, hy = HOT.y + 4;
      const fl = 0.7 + 0.3 * XY.noise1(t * 5, 7);
      // the burn: glow on the drilled pit while the rod touches it
      const heat = K.win(u, -0.14, 0.24, 0.06);
      if (heat > 0) { const rg = g.createRadialGradient(hx, hy, 1, hx, hy, 56); rg.addColorStop(0, `rgba(255,200,110,${heat})`); rg.addColorStop(0.4, `rgba(255,110,30,${0.6 * heat})`); rg.addColorStop(1, 'rgba(255,90,20,0)'); g.fillStyle = rg; g.fillRect(hx - 60, hy - 60, 120, 120); }
      // the 卜 crack: the stem first, then on beat 1 the branch races to the tiger
      const [v, br] = CRACKS[3], fv = rev(u, 0.1, 0.08), fb = XY.easeOut(rev(u, 0.2, 0.1));
      if (fv > 0) K.cut(g, K.partial(v, fv), 2.6, CUT, LIP, 1.3); if (fb > 0) K.cut(g, K.partial(br, fb), 2.8, CUT, LIP, 1.3);
      const pok = rev(beat, 1.6, 0.3); if (pok > 0 && pok < 1) { g.strokeStyle = `rgba(255,246,220,${1 - pok})`; g.lineWidth = 3; g.beginPath(); g.arc(hx, hy, 10 + 50 * pok, 0, TAU); g.stroke();
        for (let k = 0; k < 7; k++) { const a = XY.hash(k, 3) * TAU, r = 14 + 60 * pok; g.fillStyle = `rgba(232,214,176,${1 - pok})`; g.fillRect(hx + Math.cos(a) * r, hy + Math.sin(a) * r, 3, 3); } }
      // 牛 (特处士) twitches on beat 2; the tiger's groove stays in the bone while it is away; the verification is cut afterwards
      const T = tigerAt(u), wake = rev(u, 0.28, 0.1), crouch = K.win(u, 0.4, 0.5, 0.03);
      const nj = K.win(u, 0.4, 0.56, 0.02) * ((K.step(t, 10) % 2) ? 2 : -2); glyph(g, 'niu', 694 + nj, 204 - Math.abs(nj), 0.5, 3.4);
      if (T.lift > 0) glyph(g, 'hu', HU[0], HU[1], HU[2], 7, CUT, true);
      VERIFY[1].forEach((k, j) => { const f = rev(u, 0.9 + j * 0.05, 0.06); if (f > 0) glyph(g, k, VERIFY[0] - 28, 196 + j * 66, 0.5, 3.4, k === 'hu' ? CIN : CUT, true, f); });
      // the procession, cut into the bone (袈裟 filled with cinnabar)
      const [pc, pg] = K.layer('or-pr', e); XY.drawProcession(pg, e.phase, e.procX, e.groundY, PEN, acts); K.sunken(g, e, pc, 1.6, LIP, 'rgba(70,40,20,0.45)', 'or-pr');
      // the tiger: dull cinnabar → glowing and twitching → off the bone with a shadow → crouched growling → back into the groove
      const hot = `rgb(${Math.round(176 + 70 * wake)},${Math.round(48 + 50 * wake)},30)`;
      if (T.lift <= 0) { g.save(); if (wake > 0 && u < 0.95) { g.shadowColor = `rgba(255,120,40,${0.8 * wake * fl})`; g.shadowBlur = 24; }
        tiger(g, [HU[0], HU[1] + 10 * crouch, HU[2], 0.06 * crouch], 7, u < 0.28 || u > 0.95 ? CIN : hot, true, wake > 0 && u > 0.3 && u < 0.5, t); g.restore(); }
      else { tiger(g, [T.p[0] + 26 * T.lift, T.p[1] + 34 * T.lift, T.p[2], T.p[3]], 10, 'rgba(26,14,6,0.32)', false, false, t);
        g.save(); g.shadowColor = 'rgba(255,110,40,0.7)'; g.shadowBlur = 18; tiger(g, T.p, 8, hot, false, u > 0.6 && u < 0.8, t); g.restore(); }
      const dust = rev(u, 0.6, 0.08); if (dust > 0 && dust < 1) for (let k = 0; k < 16; k++) { const a = XY.hash(k, 3) * Math.PI, d = 30 + 110 * dust; g.fillStyle = `rgba(214,190,150,${0.7 * (1 - dust)})`; g.beginPath(); g.arc(900 + Math.cos(a) * d * 1.6, 690 - Math.sin(a) * d * 0.5, 3 + XY.hash(k, 4) * 5, 0, TAU); g.fill(); }
      // 太白金星: the 星 flashes over the monk on beat 4 and calls the tiger home
      const st = K.win(u, 0.78, 0.94, 0.02); if (st > 0) { g.save(); g.globalCompositeOperation = 'lighter'; const sg = g.createRadialGradient(640, 330, 4, 640, 330, 130); sg.addColorStop(0, `rgba(255,240,190,${0.7 * st})`); sg.addColorStop(1, 'rgba(255,220,140,0)'); g.fillStyle = sg; g.fillRect(500, 190, 280, 280); g.restore();
        glyph(g, 'xing', 600, 290, 0.8 * (0.9 + 0.1 * st), 5, '#FFF0C0', false); }
      // smoke from the burn, the brazier's light from below
      for (let k = 0; k < 5; k++) { const q = (t * 0.3 + k / 5) % 1, a = 0.22 * Math.sin(Math.PI * q) * XY.smooth(rev(u, -0.12, 0.1)), x = hx + 30 * q + 14 * Math.sin(t * 1.3 + k), y = hy - 20 - 300 * q, r = 14 + 60 * q;
        if (a <= 0) continue; const sg = g.createRadialGradient(x, y, 0, x, y, r); sg.addColorStop(0, `rgba(70,60,52,${a})`); sg.addColorStop(1, 'rgba(70,60,52,0)'); g.fillStyle = sg; g.fillRect(x - r, y - r, 2 * r, 2 * r); }
      g.save(); g.globalCompositeOperation = 'soft-light'; const lg = g.createRadialGradient(590, 980, 120, 590, 900, 900); lg.addColorStop(0, `rgba(255,170,90,${0.5 * fl})`); lg.addColorStop(1, 'rgba(20,10,4,0.55)'); g.fillStyle = lg; g.fillRect(0, 0, W, H); g.restore();
      // near: the heated bronze rod slides in from the upper left, touches the pit, withdraws
      const rin = XY.smooth(rev(u, -0.26, 0.12)) * (1 - XY.smooth(rev(u, 0.17, 0.12)));
      if (rin > 0) { const d = [-0.5, -0.866], tip = [hx + d[0] * 340 * (1 - rin), hy + d[1] * 340 * (1 - rin)], end = [tip[0] + d[0] * 700, tip[1] + d[1] * 700];
        K.stroke(g, [tip[0] + 22, tip[1] + 16, end[0] + 22, end[1] + 16], 'rgba(10,6,2,0.35)', 16);
        K.stroke(g, [tip[0], tip[1], end[0], end[1]], '#4E5A3E', 14); K.stroke(g, [tip[0] - 3, tip[1] - 1, end[0] - 3, end[1] - 1], 'rgba(200,210,160,0.45)', 3);
        const tg = g.createRadialGradient(tip[0], tip[1], 1, tip[0], tip[1], 30); tg.addColorStop(0, 'rgba(255,240,200,0.95)'); tg.addColorStop(0.35, 'rgba(255,130,40,0.8)'); tg.addColorStop(1, 'rgba(255,90,20,0)'); g.fillStyle = tg; g.fillRect(tip[0] - 30, tip[1] - 30, 60, 60); }
      // the pounce: a red flash as the tiger hits the ground in front of the horse
      const pf = K.hit(beat, 4.8, 0.5); if (pf > 0) { g.save(); g.globalCompositeOperation = 'lighter'; const rg = g.createRadialGradient(900, 520, 10, 900, 520, 320); rg.addColorStop(0, `rgba(255,110,50,${0.55 * pf})`); rg.addColorStop(1, 'rgba(255,80,30,0)'); g.fillStyle = rg; g.fillRect(580, 200, 640, 640); g.restore(); }
    },
    hits: [1.6, 4.8, 6.3],
    post(canvas, g, e) { K.zoom(canvas, g, e, K.push(e.beat, 4.2, 4.8, 6.0, 0.15), 880, 520); },
  };
})();
