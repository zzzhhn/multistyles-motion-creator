// 46 立体主义 · 1912 年 · 难辨猕猴（12 拍）— analytic-cubist planes in ochre and grey. A monkey head that is front view and
// profile at once assembles out of scattered windows; 六耳猕猴 walks in as Wukong's exact mirror image and the staffs cross
// on beat 4.5: the space shatters into shards, half of them flipped left-right (and still identical), 真 and 假 start
// trading places. The fake hops back, the monk recites the 紧箍咒 and both clutch their heads alike; on 8 如来's light
// shows the fake's head from six viewpoints (六耳), on 8.5 the golden bowl scoops it up and 假 breaks off, leaving 真.
(() => {
  'use strict';
  const XY = window.XY, TAU = XY.TAU;
  const C = { paper: '#d6c8ac', cream: '#ece3cf', ochre: '#b8975f', brown: '#6e5538', dbrown: '#3a2c1e', grey: '#a8a395', bgrey: '#8e9eab', dgrey: '#5a5852', ink: '#2e241a', gold: '#c9a256' };
  const K = () => XY.KIT_F;
  const poly = (g, pts) => { g.beginPath(); g.moveTo(pts[0][0], pts[0][1]); for (let k = 1; k < pts.length; k++) g.lineTo(pts[k][0], pts[k][1]); g.closePath(); };
  // a cubist plane: light → colour → dark along a random pair of its vertices
  const plane = (g, pts, col, alpha, R, light = 0.28, dark = 0.42) => {
    const a = pts[0], b = pts[1 + Math.floor(R() * (pts.length - 1))], gr = g.createLinearGradient(a[0], a[1], b[0], b[1]), k = K();
    gr.addColorStop(0, k.mix(col, '#faf4e4', light, alpha)); gr.addColorStop(0.55, k.mix(col, col, 0, alpha)); gr.addColorStop(1, k.mix(col, '#2d2319', dark, alpha));
    g.fillStyle = gr; poly(g, pts); g.fill(); };
  // straight contour segments that overshoot their ends (the cubist line runs past the form)
  const segs = (g, pts, ext, col, w, closed) => { g.strokeStyle = col; g.lineWidth = w; g.lineCap = 'round'; g.beginPath();
    const n = pts.length - (closed ? 0 : 1);
    for (let i = 0; i < n; i++) { const a = pts[i], b = pts[(i + 1) % pts.length], L = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1, ux = (b[0] - a[0]) / L, uy = (b[1] - a[1]) / L;
      g.moveTo(a[0] - ux * ext, a[1] - uy * ext); g.lineTo(b[0] + ux * ext, b[1] + uy * ext); } g.stroke(); };
  const wood = (g, x, y, w, h, seed) => { const R = XY.rng(seed);
    g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip(); g.fillStyle = '#b08350'; g.fillRect(x, y, w, h);
    for (let i = 0; i < h / 5; i++) { g.strokeStyle = R() < 0.5 ? 'rgba(110,72,36,0.55)' : 'rgba(150,104,58,0.5)'; g.lineWidth = 0.8 + R() * 1.4; g.beginPath();
      for (let s = 0; s <= w; s += 8) { const u = s / w, off = i * 5 + Math.sin(u * 9 + i * 0.5) * 2.5 + 11 * Math.exp(-Math.pow(u - 0.31, 2) / 0.004) * Math.sign(i * 5 - h * 0.45) + 9 * Math.exp(-Math.pow(u - 0.74, 2) / 0.003) * Math.sign(i * 5 - h * 0.6);
        s ? g.lineTo(x + s, y + off) : g.moveTo(x + s, y + off); } g.stroke(); }
    [[0.31, 0.45], [0.74, 0.6]].forEach(([a, b]) => { for (let k = 0; k < 4; k++) { g.strokeStyle = 'rgba(96,60,30,0.7)'; g.lineWidth = 1.4; g.beginPath(); g.ellipse(x + w * a, y + h * b, 12 + k * 6, 3 + k * 2.4, 0, 0, TAU); g.stroke(); } });
    g.restore(); };

  // ---------------------------------------------------------------- the double monkey head (cached per scale)
  const FW = 470, FH = 470;
  const face = S => XY.cached('cub-face:' + S.toFixed(4), FW * S, FH * S, cv => {
    const g = cv.getContext('2d'); g.setTransform(S, 0, 0, S, 0, 0); const R = XY.rng(4612);
    const head = [[236, 50], [338, 70], [402, 150], [418, 252], [380, 352], [300, 412], [236, 424], [168, 410], [118, 368], [62, 338], [30, 292], [54, 252], [96, 238], [82, 184], [104, 120], [160, 70]];
    // fur planes: the head cut into many hard wedges from two centres (front view, profile), dark analytic browns
    for (let k = 0; k < head.length; k++) { const a = head[k], b = head[(k + 1) % head.length], cx = k < 7 ? [300, 240] : [150, 260], m = [(a[0] + b[0]) / 2 + (R() - 0.5) * 30, (a[1] + b[1]) / 2 + (R() - 0.5) * 30];
      plane(g, [cx, a, m], [C.dbrown, '#5a4430', C.brown, C.dgrey][k % 4], 0.96, R, 0.18, 0.5); plane(g, [cx, m, b], [C.brown, C.dgrey, C.dbrown, '#5a4430'][k % 4], 0.96, R, 0.22, 0.5); }
    // front-view mask (right half): three planes in grey-ochre; profile muzzle (left half): a sharp wedge snout
    plane(g, [[246, 168], [300, 150], [300, 250], [236, 236]], '#a8946e', 0.96, R, 0.3, 0.4); plane(g, [[300, 150], [356, 168], [370, 230], [300, 250]], '#c2ad84', 0.96, R, 0.35, 0.3);
    plane(g, [[236, 236], [300, 250], [370, 230], [338, 320], [300, 360], [262, 320]], '#8e7a58', 0.96, R, 0.2, 0.45);
    plane(g, [[14, 300], [70, 246], [130, 232], [186, 252], [196, 314], [160, 360], [84, 350]], '#b49a6c', 0.97, R, 0.3, 0.4);
    plane(g, [[14, 300], [130, 232], [120, 300]], '#d2bc90', 0.7, R); plane(g, [[84, 350], [160, 360], [120, 316]], C.dbrown, 0.8, R);
    // the split: a hard vertical edge, a cold blue-grey plane over the profile's brow
    plane(g, [[226, 40], [246, 40], [250, 436], [222, 436]], '#2e241a', 0.7, R); plane(g, [[150, 80], [226, 60], [226, 250], [130, 236]], C.bgrey, 0.55, R);
    // 金箍: one band seen from the front, one from the side, at different tilts (bold, with dark lower edge)
    g.fillStyle = C.gold; poly(g, [[244, 124], [400, 142], [402, 164], [244, 148]]); g.fill(); poly(g, [[80, 172], [226, 112], [228, 134], [86, 198]]); g.fill();
    g.fillStyle = '#7a5a22'; poly(g, [[244, 140], [402, 158], [402, 164], [244, 148]]); g.fill(); poly(g, [[84, 190], [228, 128], [228, 134], [86, 198]]); g.fill();
    // eyes: narrow dark slits with one hard glint (front view), a frontal almond set into the profile (Picasso)
    const eye = (x, y, w, h, rot) => { g.save(); g.translate(x, y); g.rotate(rot); g.fillStyle = '#1e160e'; g.beginPath(); g.moveTo(-w, 0); g.lineTo(-w * 0.2, -h); g.lineTo(w, -h * 0.2); g.lineTo(w * 0.3, h * 0.6); g.closePath(); g.fill();
      g.fillStyle = '#e8d8b0'; poly(g, [[w * 0.05, -h * 0.55], [w * 0.45, -h * 0.35], [w * 0.15, -h * 0.05]]); g.fill(); g.restore(); };
    eye(278, 210, 22, 10, 0.2); eye(338, 208, 20, 9, -0.2); eye(126, 258, 26, 13, -0.35);
    // heavy brow wedges angled down to the nose (fierce), slit nostrils, mouths with fangs
    g.fillStyle = '#1e160e'; poly(g, [[244, 178], [300, 196], [298, 186], [250, 166]]); g.fill(); poly(g, [[372, 176], [314, 194], [318, 184], [366, 164]]); g.fill(); poly(g, [[86, 236], [168, 228], [164, 216], [94, 222]]); g.fill();
    g.fillStyle = '#1e160e'; [[294, 272, 0.4], [314, 272, -0.4], [28, 298, 0.6]].forEach(([x, y, r]) => { g.save(); g.translate(x, y); g.rotate(r); g.fillRect(-2, -7, 4, 14); g.restore(); });
    segs(g, [[262, 306], [300, 318], [340, 302]], 4, '#1e160e', 4); segs(g, [[40, 330], [110, 340], [158, 326]], 4, '#1e160e', 4);
    g.fillStyle = '#ece3cf'; [[[280, 309], [288, 309], [284, 324]], [[318, 310], [326, 309], [322, 324]], [[96, 338], [106, 339], [100, 354]]].forEach(p => { poly(g, p); g.fill(); });
    // six ears from six viewpoints, angular: two front-view, one profile, three ghost planes
    const ear = (x, y, s, r, al) => { g.save(); g.translate(x, y); g.rotate(r); g.scale(s, s); g.globalAlpha = al;
      g.fillStyle = '#4a3826'; poly(g, [[0, -28], [26, -6], [10, 26], [-8, 4]]); g.fill(); g.fillStyle = '#a8946e'; poly(g, [[4, -14], [16, -4], [8, 12]]); g.fill();
      g.strokeStyle = C.ink; g.lineWidth = 2.4; poly(g, [[0, -28], [26, -6], [10, 26], [-8, 4]]); g.stroke(); g.restore(); };
    ear(424, 236, 1.2, 0.1, 1); ear(214, 196, 1.1, 0, 1); ear(48, 226, 1, Math.PI, 0.9); ear(410, 118, 0.8, -0.6, 0.6); ear(180, 90, 0.75, -1.2, 0.55); ear(92, 118, 0.8, Math.PI + 0.4, 0.55);
    segs(g, head, 10, 'rgba(30,22,14,0.85)', 3, true);
    g.globalAlpha = 1; g.strokeStyle = 'rgba(46,36,26,0.5)'; g.lineWidth = 1.2; [[[0, 120], [470, 330]], [[60, 0], [330, 470]], [[470, 60], [140, 470]]].forEach(L => segs(g, L, 0, g.strokeStyle, 1.2));
  });
  // stencil letters (Braque's lettering): text with bridges cut out of the strokes
  const stencil = (S, txt, px) => XY.cached('cub-st:' + txt + S.toFixed(4), px * 1.12 * S, px * 1.15 * S, cv => {
    const g = cv.getContext('2d'); g.setTransform(S, 0, 0, S, 0, 0); g.font = XY.font(px, XY.cnFont.hei, '900'); g.textBaseline = 'top'; g.fillStyle = C.dbrown; g.fillText(txt, px * 0.06, px * 0.06);
    g.globalCompositeOperation = 'destination-out'; g.fillRect(0, px * 0.38, px * 1.2, px * 0.05); g.fillRect(px * 0.53, 0, px * 0.045, px * 1.2); g.fillRect(0, px * 0.8, px * 1.2, px * 0.04); });
  // newspaper fragment with the counter as its headline
  const paperScrap = S => XY.cached('cub-news:' + S.toFixed(4), 300 * S, 196 * S, cv => {
    const g = cv.getContext('2d'); g.setTransform(S, 0, 0, S, 0, 0); g.fillStyle = '#e6dcc2'; poly(g, [[0, 6], [292, 0], [300, 188], [8, 196]]); g.fill();
    g.fillStyle = '#26201a'; g.font = XY.font(64, XY.cnFont.song, '900'); g.textBaseline = 'top'; g.fillText('遊日報', -18, 4);
    g.fillRect(8, 76, 284, 3); g.font = XY.font(34, XY.cnFont.song, 'bold'); g.fillText('第四十六难', 14, 86);
    g.font = XY.font(15, XY.cnFont.song); g.fillText('真假美猴王 · 二心攪亂大乾坤', 14, 128);
    const R = XY.rng(46); for (let c = 0; c < 3; c++) for (let l = 0; l < 4; l++) { g.fillStyle = 'rgba(40,32,24,0.42)'; g.fillRect(14 + c * 94, 152 + l * 9, 70 + R() * 16, 4); }
  });

  const PEN = { outline: C.ink, ow: 1.5, seed: 46,
    color: r => ({ fur: '#8a6a42', face: '#d9c49a', wkshirt: '#9c5a3c', tiger: '#c49a52', stripe: C.ink, gold: C.gold, staff: '#7a3a26', ink: C.ink, horse: '#e6dcc4', horse2: '#c9bfa6',
      mane: '#d8cdb2', hoof: '#4a3c2c', saddle: '#6e3a26', red: '#8e3a26', robe: '#c9a85e', kasaya: '#9a4a30', skin: '#e2cfae', metal: '#a8905a', bjrobe: '#4a4a48', bjpants: '#3a3a38',
      pig: '#d9a898', pig2: '#c08a7c', wood: '#7a5a3a', ssrobe: '#5f7385', ssrobe2: '#4c5c6a', skin2: '#b8936a', ssh: '#8e4a30', ssbeard: '#7a3a26', skull: C.cream, bundle: C.ochre })[r] || C.ochre };
  const BC = 4.5, BR = 8.5;   // the clash, and the bowl (12-beat cell)
  const FACET_LV = [['rgba(255,248,230,0.34)', 1], ['rgba(255,248,230,0.16)', 1.4], [null, 1.6], ['rgba(40,28,16,0.2)', 1.5], ['rgba(40,28,16,0.38)', 1]];

  XY.STYLES.cubism = {
    bg(g, W, H, c) {
      K().paper(g, W, H, C.paper, 4601, 1800);
      const R = XY.rng(1912);
      const big = [[[[0, 0], [360, 0], [210, 330], [0, 270]], C.grey, 0.6], [[[300, 0], [640, 0], [470, 150]], C.cream, 0.55], [[[0, 300], [230, 340], [140, 702], [0, 702]], C.dgrey, 0.42],
        [[[180, 380], [420, 470], [330, 702], [150, 640]], C.ochre, 0.5], [[[560, 0], [760, 0], [700, 260], [520, 200]], C.bgrey, 0.45], [[[1020, 0], [1416, 0], [1416, 260], [1180, 300]], C.cream, 0.45],
        [[[1100, 240], [1416, 300], [1416, 702], [1240, 702]], C.ochre, 0.42], [[[460, 400], [760, 470], [720, 702], [430, 702]], C.cream, 0.4], [[[820, 430], [1120, 380], [1180, 702], [860, 702]], C.dgrey, 0.32],
        [[[1240, 60], [1416, 40], [1416, 220]], C.dbrown, 0.3], [[[620, 180], [900, 120], [980, 420], [700, 480]], C.grey, 0.38]];
      big.forEach(([p, col, a]) => plane(g, p, col, a, R));
      for (let i = 0; i < 70; i++) { const cx = R() * W, cy = R() * 690, n = 3 + (R() < 0.5), r = 40 + R() * 120, a0 = R() * TAU, pts = [];
        for (let k = 0; k < n; k++) { const a = a0 + k / n * TAU + (R() - 0.5) * 0.9, rr = r * (0.5 + R() * 0.7); pts.push([cx + Math.cos(a) * rr, Math.min(700, cy + Math.sin(a) * rr)]); }
        plane(g, pts, [C.ochre, C.grey, C.cream, C.brown, C.bgrey, C.dgrey][Math.floor(R() * 6)], 0.18 + R() * 0.4, R); }
      // radial fan of planes rising from under the floor (alternating light/dark)
      for (let k = 0; k < 9; k++) { const a0 = Math.PI * (1.12 + k * 0.085), a1 = a0 + 0.07; plane(g, [[760, 900], [760 + Math.cos(a0) * 900, 900 + Math.sin(a0) * 900], [760 + Math.cos(a1) * 900, 900 + Math.sin(a1) * 900]], k % 2 ? C.cream : C.brown, 0.18, R); }
      // Braque's sand dashes, dotted and hatched planes
      for (let i = 0; i < 7000; i++) { const x = R() * W, y = R() * 700, l = 3 + R() * 5; g.fillStyle = R() < 0.55 ? 'rgba(236,227,207,0.28)' : 'rgba(58,44,30,0.16)'; g.fillRect(x, y, l, 1.4); }
      [[90, 420, 150, 110], [980, 110, 120, 140], [1200, 420, 140, 120]].forEach(([x, y, w, h], k) => { g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip();
        if (k === 1) { g.fillStyle = 'rgba(58,44,30,0.35)'; for (let j = 0; j < h; j += 9) for (let i = (j / 9) % 2 * 4.5; i < w; i += 9) { g.beginPath(); g.arc(x + i, y + j, 1.6, 0, TAU); g.fill(); } }
        else { g.strokeStyle = 'rgba(58,44,30,0.3)'; g.lineWidth = 1; for (let i = -h; i < w; i += 7) { g.beginPath(); g.moveTo(x + i, y + h); g.lineTo(x + i + h, y); g.stroke(); } } g.restore(); });
      // passage: long thin straight lines through everything
      g.strokeStyle = 'rgba(46,36,26,0.5)'; g.lineWidth = 1.3;
      for (let i = 0; i < 40; i++) { const x0 = R() * W, y0 = R() * 700, a = R() * Math.PI, l = 120 + R() * 420; g.beginPath(); g.moveTo(x0, y0); g.lineTo(x0 + Math.cos(a) * l, Math.min(702, y0 + Math.sin(a) * l)); g.stroke(); }
      // the floor: Braque's comb-painted faux bois, its top edge cut into planes
      wood(g, 0, 702, W, H - 702, 46);
      g.fillStyle = 'rgba(58,44,30,0.5)'; g.fillRect(0, 700, W, 4);
      for (let k = 0; k < 7; k++) { const x = k * 220 + R() * 60; plane(g, [[x, 704], [x + 90 + R() * 60, 704], [x + 40 + R() * 60, H]], k % 2 ? C.dbrown : C.cream, 0.28, R); }
      g.strokeStyle = 'rgba(46,36,26,0.8)'; g.lineWidth = 6; g.strokeRect(3, 3, W - 6, H - 6);
    },
    draw(g, e) {
      const { W, H, t, u, beat } = e, k = K(), S = e.S, cell = e.cell, BT = XY.BEAT;
      const st8 = k.step(t, 8), st12 = k.step(t, 12), procAt = b => XY.procWorldX(cell.t0 + b * BT) - cell.x;
      // ---- clash geometry: the real Wukong's position on beat 4.5; the mirror line 110 px ahead of him
      const pxC = procAt(BC), realXc = pxC + 245, mx = realXc + 110, Py = e.groundY - 112, shat = k.hitDecay(beat, BC, 1.0);
      // ---- the double head: scattered windows that assemble over the first beats, then slide against each other
      const asm = 1 - XY.smooth((beat + 1) / 2.5), fx = W * 0.6 - FW / 2, fy = 14, F = face(S);
      const wins = [[[0, 0], [190, 0], [150, 470], [0, 470]], [[190, 0], [300, 0], [250, 250], [160, 230]], [[300, 0], [470, 0], [470, 210], [250, 250]], [[160, 230], [250, 250], [300, 470], [150, 470]], [[250, 250], [470, 210], [470, 470], [300, 470]]];
      wins.forEach((w, i) => { const dx = 11 * Math.sin(t * 1.9 + i * 1.3) + (XY.hash(st12, i) - 0.5) * 3 + shat * 40 * (XY.hash(i, 7) - 0.5) + asm * 260 * (XY.hash(i, 9) - 0.5);
        const dy = 7 * Math.cos(t * 1.4 + i) + shat * 24 * (XY.hash(i, 8) - 0.5) + asm * 160 * (XY.hash(i, 10) - 0.5), rot = asm * 0.7 * (XY.hash(i, 11) - 0.5);
        g.save(); g.translate(fx + 235, fy + 235); g.rotate(rot); g.translate(-235, -235); poly(g, w); g.clip(); if (shat > 0.25 && i % 2 === 1) { g.translate(FW, 0); g.scale(-1, 1); }
        g.drawImage(F, dx, dy, FW, FH); g.restore(); });
      if (asm < 0.3) { g.save(); g.translate(fx, fy); [[[190, 0], [150, 470]], [[300, 0], [250, 250]], [[160, 230], [250, 250], [470, 210]], [[250, 250], [300, 470]]].forEach(L => segs(g, L, 8, 'rgba(46,36,26,0.5)', 1.6)); g.restore(); }
      // ---- collage: newspaper (counter); stencilled 真 假 trading places every beat from the clash; on 8.5 the 假 breaks off and 真 is left
      g.save(); g.translate(46 + 168, 36 + 98); g.rotate(-0.045 + 0.012 * Math.sin(st8 * 1.7)); g.drawImage(paperScrap(S), -150, -98, 300, 196);
      g.fillStyle = 'rgba(214,200,172,0.9)'; const fl = 14 + 8 * Math.sin(t * 7); g.beginPath(); g.moveTo(150, -98); g.lineTo(150 - fl, -98); g.lineTo(150, -98 + fl); g.fill(); g.restore();
      const swAt = b => b < BC ? 0 : (Math.floor(b - BC) % 2 === 0 ? XY.smooth((b - BC - Math.floor(b - BC)) / 0.18) : 1 - XY.smooth((b - BC - Math.floor(b - BC)) / 0.18));
      const reveal = BR, sw = swAt(Math.min(beat, reveal)), settle = XY.easeOut((beat - reveal) / 0.6);
      [['真', 0], ['假', 1]].forEach(([ch, j]) => { const pos = XY.lerp(j, 1 - j, sw), x0 = 1100 + pos * 150, y0 = 56;
        if (j === 1 && beat >= reveal) { const f = (beat - reveal) / 1.6, T = stencil(S, ch, 128);   // 假 splits into three strips flung up and away
          [0, 1, 2].forEach(p => { g.save(); g.translate(x0 + 66 + f * (120 + p * 80), y0 + 66 - f * (260 + p * 90) + f * f * 80); g.rotate(f * (2 + p) * (p % 2 ? -1 : 1));
            g.drawImage(T, 0, T.height * p / 3, T.width, T.height / 3, -72, -74 + 49 * p, 143, 49); g.restore(); }); return; }
        const x = j === 0 ? XY.lerp(x0, 1175, settle) : x0, sc = 1 + 0.2 * settle;
        g.save(); g.translate(x + 66 + (XY.hash(st12, j, 3) - 0.5) * 8 * (1 - settle), y0 + 66 + (XY.hash(st12, j, 4) - 0.5) * 10 * (1 - settle) - 40 * Math.sin(Math.PI * sw) * (j ? 1 : -1));
        g.rotate((XY.hash(st12, j, 5) - 0.5) * 0.12 * (1 - settle)); g.scale(sc, sc); g.drawImage(stencil(S, ch, 128), -72, -74, 128 * 1.12, 128 * 1.15); g.restore(); });
      // ---- acts: approach with staffs up, strike on 4.5, a second exchange, both clutch their heads at the 紧箍咒, then look up at the bowl
      const pr = (a, b, r = 0.3) => XY.smooth((beat - a) / r) * (1 - XY.smooth((beat - b) / r));
      const acts = { wukong: { raise: pr(2.8, 4.3, 0.5) + pr(5.0, 5.55, 0.2) + pr(7.2, 8.0, 0.3), strike: pr(4.3, 4.95, 0.18) + pr(5.55, 6.0, 0.15), shade: pr(6.15, 7.15, 0.25) + pr(8.7, 10.6, 0.3) },
        monk: { palm: pr(5.8, 7.5, 0.3) }, bajie: { scratch: k.pulse(beat, 1.0, 1.2) + k.pulse(beat, 10, 1) }, shaseng: { lift: k.pulse(beat, 4.6, 0.6) } };
      // ---- 六耳猕猴: Wukong's mirror image about x = mx until the clash; then (frozen footing, live arms) it hops back ahead of him,
      //      stands its ground between hops, leaps on 8.15 and is scooped up by the bowl on 8.5 — never left standing in the road
      const phC = XY.walkPhase(cell.t0 + BC * BT), rx = b => procAt(b) + 245, HOP = [5.2, 6.4, 7.6], ST = [realXc + 220, rx(6.6) + 172, rx(7.8) + 172, rx(8.6) + 172];
      let fc, fy0 = 0;
      if (beat < BC) fc = 2 * mx - (e.procX + 245);
      else { let i = 0; HOP.forEach(h => { if (beat >= h + 0.35) i++; }); fc = ST[i];
        HOP.forEach((h, j) => { if (beat >= h && beat < h + 0.35) { const f = (beat - h) / 0.35; fc = XY.lerp(ST[j], ST[j + 1], XY.smooth(f)); fy0 = -52 * Math.sin(Math.PI * f); } });
        if (beat >= 8.15) { const f = XY.easeOut((beat - 8.15) / 0.35); fc = ST[3] + 24 * f; fy0 = -150 * f; } }
      const fe = beat < BC ? e : { ...e, phase: phC, procX: pxC }, m = beat < BC ? mx : (fc + pxC + 245) / 2;
      const facetsOn = (lg, x0, y0, x1, y1, seed) => { lg.save(); lg.globalCompositeOperation = 'source-atop'; k.facets(lg, x0, y0, x1, y1, 22, seed, FACET_LV, 'rgba(46,36,26,0.32)', st8, 0.22); lg.restore(); };
      // 如来's light finds the fake on 7.9: a wedge of gold planes from the top edge
      const beam = k.pulse(beat, 8.2, 0.6); if (beam > 0) { const R2 = XY.rng(4688); for (let j = 0; j < 5; j++) plane(g, [[fc - 130 + j * 50, 0], [fc - 80 + j * 50, 0], [fc + 30 - j * 15, e.groundY - 200 + fy0]], j % 2 ? C.gold : '#f2dc9a', 0.62 * beam, R2, 0.5, 0.05); }
      let L1 = null; const hp = fe.at('wukong.head', acts), fhx = 2 * m - hp[0], fhy = hp[1] + fy0;
      if (fc < W + 160 && beat < BR) {
        const [cv1, l1] = k.layer(e, 'cub-fake'); L1 = cv1;
        l1.save(); l1.translate(0, fy0); k.mirrorWukong(l1, fe, PEN, acts, m); l1.restore();
        const pop = XY.easeOut((beat - 8.0) / 0.2);   // 如来点破: the fake's head from six viewpoints at once — six ears
        if (pop > 0) for (let j = 0; j < 6; j++) { const a = -Math.PI / 2 + (j - 2.5) * 0.55, r = 22 + 7 * (j % 2);
          l1.save(); l1.translate(fhx + Math.cos(a) * r * pop, fhy + Math.sin(a) * r * pop); l1.rotate(a + Math.PI / 2); l1.scale(1.4 * pop, 1.4 * pop);
          l1.fillStyle = j % 2 ? '#5a4430' : '#3a2c1e'; poly(l1, [[0, -14], [11, -4], [9, 10], [-6, 9], [-9, -4]]); l1.fill(); l1.fillStyle = '#a8946e'; poly(l1, [[0, -6], [5, -1], [4, 5], [-3, 4]]); l1.fill();
          l1.strokeStyle = C.ink; l1.lineWidth = 1.6; poly(l1, [[0, -14], [11, -4], [9, 10], [-6, 9], [-9, -4]]); l1.stroke(); l1.restore(); }
        facetsOn(l1, fc - 160, e.groundY - 320 + fy0, fc + 160, e.groundY + 6 + fy0, 77); k.blit(g, cv1); }
      // the 紧箍咒: gold rings tighten round both heads alike — still no telling them apart
      const jin = k.pulse(beat, 6.65, 0.6); if (jin > 0) [e.at('wukong.head', acts), [fhx, fhy]].forEach(([hx, hy]) => { for (let j = 0; j < 3; j++) { const ph = (t * 2.2 + j / 3) % 1;
        g.strokeStyle = K().rgba(C.gold, jin * (1 - ph)); g.lineWidth = 4; g.beginPath(); g.ellipse(hx - 2, hy - 8, 50 - ph * 30, 22 - ph * 12, 0, 0, TAU); g.stroke(); } });
      // ---- the pilgrims, cut into facets
      const [cv2, l2] = k.layer(e, 'cub-proc');
      XY.drawProcession(l2, e.phase, e.procX, e.groundY, PEN, acts);
      facetsOn(l2, e.procX - 400, e.groundY - 292, e.procX + 340, e.groundY + 6, 46); k.blit(g, cv2);
      // ---- the clash shatters the space into shards; every other shard is the scene flipped about the mirror line
      if (shat > 0.04) { const Rw = XY.rng(4644), n = 9, ring = [];
        for (let j = 0; j < n; j++) { const a = (j + 0.5 * Rw()) / n * TAU, r = 130 + 120 * Rw(); ring.push([mx + Math.cos(a) * r, Math.min(e.groundY + 4, Py + Math.sin(a) * r * 0.85)]); }
        g.save(); g.globalAlpha = Math.min(1, shat * 1.5);
        for (let j = 0; j < n; j++) { if (j % 4 === 3) continue; const dx = shat * 34 * (Rw() - 0.5), dy = shat * 22 * (Rw() - 0.5), ap = [mx + (Rw() - 0.5) * 50, Py + (Rw() - 0.5) * 40], wp = [ap, ring[j], ring[(j + 1) % n]];
          g.save(); poly(g, wp); g.clip(); plane(g, wp, [C.paper, C.grey, C.cream, C.ochre][j % 4], 0.8, Rw);
          g.setTransform(1, 0, 0, 1, 0, 0); if (j % 2) { g.translate(2 * mx * S, 0); g.scale(-1, 1); } g.translate(dx * S, dy * S); if (L1) g.drawImage(L1, 0, 0); g.drawImage(cv2, 0, 0); g.restore();
          segs(g, wp, 12, C.ink, 2.2, true); }
        g.restore(); }
      // ---- 如来's golden bowl: swoops down on 8.25, closes over the leaping fake on 8.5, and is carried straight back up out of the frame
      if (beat > 8.2 && beat < 10.4) { const capRim = e.groundY - 84, down = XY.easeIn((beat - 8.2) / 0.3), up = XY.easeIn((beat - 8.75) / 1.4);
        const by = beat < 8.5 ? XY.lerp(-60, capRim, down) : XY.lerp(capRim, -40, up), bx = ST[3] + 24, rxb = 92, ryb = 196, Rb = XY.rng(4699);
        g.save(); g.translate(bx, by); const dome = []; for (let j = 0; j <= 10; j++) { const a = Math.PI + j / 10 * Math.PI; dome.push([Math.cos(a) * rxb, Math.sin(a) * ryb * (j % 2 ? 0.97 : 1)]); }
        for (let j = 0; j < 10; j++) plane(g, [[0, -ryb * 0.35], dome[j], dome[j + 1]], j % 3 ? C.gold : '#8a6a2e', 0.97, Rb, 0.4, 0.45);
        plane(g, [[-rxb - 10, 0], [rxb + 10, 0], [rxb, -16], [-rxb, -16]], '#a8822e', 1, Rb); segs(g, dome, 6, C.ink, 2.4, false); segs(g, [[-rxb - 10, 0], [rxb + 10, 0]], 8, C.ink, 2.4);
        g.restore();
        const ring = k.hitDecay(beat, BR, 0.7); if (ring > 0.03) { g.strokeStyle = `rgba(201,162,86,${ring})`; g.lineWidth = 3;
          for (let j = 0; j < 14; j++) { const a = j / 14 * TAU, r0 = 130 + 90 * (1 - ring); g.beginPath(); g.moveTo(bx + Math.cos(a) * r0, by - 90 + Math.sin(a) * r0 * 0.8); g.lineTo(bx + Math.cos(a) * (r0 + 60), by - 90 + Math.sin(a) * (r0 + 60) * 0.8); g.stroke(); } } }
      // ---- translucent planes laid over the figures, sliding against them (embeds the pilgrims in the space)
      [[[200, 470], [520, 430], [470, 702], [160, 702]], [[700, 520], [980, 470], [1040, 702], [740, 702]], [[1100, 430], [1300, 520], [1260, 702], [1080, 702]]].forEach((p, j) => {
        const o = 24 * Math.sin(t * 1.6 + j * 2); plane(g, p.map(q => [q[0] + o, q[1]]), [C.cream, C.bgrey, C.ochre][j], 0.16, XY.rng(4610 + j)); });
      e._zoom = [mx, Py, k.push(beat, 4.35, 0.15, 0.45, 1.0), ST[3], e.groundY - 260, k.push(beat, 7.9, 0.25, 0.4, 0.9)];
    },
    // local push-in on the two climaxes (whole panel, bg included); back to 1 well before u = 0.85
    post(canvas, g, e) { const z = e._zoom; if (!z) return; if (z[2] > 0) K().postZoom(canvas, g, e, z[0], z[1], 1 + 0.14 * z[2]); else if (z[5] > 0) K().postZoom(canvas, g, e, z[3], z[4], 1 + 0.12 * z[5]); },
    hits: [BC, BR],
    thumb: 6.6,   // overview thumbnail: a clear frame with no in-panel push-in active
  };
})();
