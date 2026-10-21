// 16 凯尔特泥金 · 收得沙僧 — a vellum page in the manner of the Book of Kells. A huge initial 沙 built of knotwork
// bands, triskele discs and red-lead dotting, followed by display letters 悟净; 木叉 stands in an arch holding the red
// gourd. 沙悟净's bald head and red beard peep out from behind the strokes; at beat 2 he pops up, at beat 3 he leaps out
// of the initial straight into his place in the line; then the gourd and his nine skulls become the 法船 that carries
// everyone across the spiral-wave river. The knotwork slides through the bands like rope.
(() => {
  'use strict';
  const XY = window.XY, TAU = XY.TAU, K = XY.KIT_B;
  const VELLUM = '#EADBB8', BK = '#1A1410', ORP = '#E2B840', VERD = '#3E8A6A', MIN = '#C8462A', WOAD = '#5A4A8A', PINK = '#D88A8A';
  const stroke = (g, pts, w, col) => { g.strokeStyle = col; g.lineWidth = w; XY.path(g, pts, false); g.stroke(); };
  const spl = (p, n = 8) => XY.RIG.spline(p, false, n);
  // a ribbon whose width runs w0 → w1 along a spline (one brush stroke of the initial)
  const band = (pts, w0, w1) => XY.RIG.ribbon(spl(pts), w0, w1);
  // ------------------------------------------------------------ knotwork: a two-strand plait tile with true over/under
  const plait = (S, fg, bgc, T = 40) => XY.keep(`celt-plait:${fg}:${bgc}:${S.toFixed(3)}`, Math.round(T * S), Math.round(T * S), cv => {
    const g = cv.getContext('2d'); g.scale(cv.width / T, cv.height / T); g.fillStyle = bgc; g.fillRect(0, 0, T, T); g.lineCap = 'butt';
    const seg = (x0, y0, x1, y1) => { for (const dx of [-T, 0, T]) for (const dy of [-T, 0, T]) { g.beginPath(); g.moveTo(x0 + dx, y0 + dy); g.lineTo(x1 + dx, y1 + dy); g.stroke(); } };
    const draw = (x0, y0, x1, y1) => { g.strokeStyle = BK; g.lineWidth = 12; seg(x0, y0, x1, y1); g.strokeStyle = fg; g.lineWidth = 7.5; seg(x0, y0, x1, y1); };
    draw(-T, -T, 2 * T, 2 * T); draw(-T, 0, T, 2 * T); draw(0, -T, 2 * T, T);        // strands ↘
    draw(-T, 2 * T, 2 * T, -T); draw(-T, T, T, -T); draw(0, 2 * T, 2 * T, 0);         // strands ↗ (on top everywhere so far)
    const c = T * 0.17; [[0, 0], [T, 0], [0, T], [T, T]].forEach(([x, y]) => draw(x - c, y - c, x + c, y + c));   // ↘ back on top at the corners
  });
  const pat = (g, S, fg, bgc, ox, oy) => { const p = g.createPattern(plait(S, fg, bgc), 'repeat'); p.setTransform(new DOMMatrix().translateSelf(ox * S, oy * S).scaleSelf(1 / S)); return p; };
  // red-lead dotting along an outline
  const dots = (g, pts, step, r, col = MIN) => { g.fillStyle = col; let acc = 0; g.beginPath();
    for (let k = 2; k < pts.length; k += 2) { const dx = pts[k] - pts[k - 2], dy = pts[k + 1] - pts[k - 1], d = Math.hypot(dx, dy); acc += d;
      while (acc >= step) { acc -= step; const f = 1 - acc / Math.max(d, 1e-6), x = pts[k - 2] + dx * f, y = pts[k - 1] + dy * f; g.moveTo(x + r, y); g.arc(x, y, r, 0, TAU); } }
    g.fill(); };
  // outward offset of a closed polygon (approximate: push each vertex away from the centroid)
  const grow = (pts, d) => { let cx = 0, cy = 0; const n = pts.length / 2; for (let k = 0; k < pts.length; k += 2) { cx += pts[k]; cy += pts[k + 1]; } cx /= n; cy /= n;
    const o = []; for (let k = 0; k < pts.length; k += 2) { const dx = pts[k] - cx, dy = pts[k + 1] - cy, l = Math.hypot(dx, dy) || 1; o.push(pts[k] + dx / l * d, pts[k + 1] + dy / l * d); } return o; };
  // a triskele disc: three spiral arms in a ring
  const triskele = (g, x, y, r, rot, c1, c2) => {
    g.beginPath(); g.arc(x, y, r + 4, 0, TAU); g.fillStyle = BK; g.fill(); g.beginPath(); g.arc(x, y, r, 0, TAU); g.fillStyle = c1; g.fill();
    for (let a = 0; a < 3; a++) { const P = []; for (let k = 0; k <= 30; k++) { const q = k / 30, ang = rot + a * TAU / 3 + q * 4.2, rr = r * (0.08 + 0.86 * q); P.push(x + Math.cos(ang) * rr, y + Math.sin(ang) * rr); }
      g.strokeStyle = BK; g.lineWidth = r * 0.16; XY.path(g, P, false); g.stroke(); g.strokeStyle = c2; g.lineWidth = r * 0.08; XY.path(g, P, false); g.stroke(); }
    g.beginPath(); g.arc(x, y, r * 0.14, 0, TAU); g.fillStyle = MIN; g.fill();
  };
  // ------------------------------------------------------------ the initial 沙 (氵 + 小 + 丿)
  const STROKES = [
    { p: [62, 424, 104, 384, 172, 316], w: [56, 16], fg: ORP, bg: WOAD },                       // 氵 rising tick
    { p: [344, 52, 342, 200, 338, 326, 322, 352, 288, 336], w: [58, 22], fg: ORP, bg: VERD },     // 小 vertical + hook
    { p: [252, 150, 230, 206, 212, 252], w: [26, 50], fg: PINK, bg: WOAD },                      // left dot
    { p: [432, 136, 456, 190, 478, 236], w: [26, 50], fg: PINK, bg: WOAD },                      // right dot
    { p: [490, 296, 424, 372, 306, 428, 196, 452], w: [58, 12], fg: ORP, bg: MIN },              // 丿 the long sweep
  ];
  const DISCS = [[132, 118, 46, 1], [112, 236, 42, -1]];
  const POLYS = STROKES.map(s => band(s.p, s.w[0], s.w[1]));
  const initial = (g, S, t) => {
    const slide = t * 9;
    STROKES.forEach((s, i) => { const P = POLYS[i];
      XY.path(g, grow(P, 3), true); g.fillStyle = BK; g.fill();
      XY.path(g, P, true); g.fillStyle = pat(g, S, s.fg, s.bg, slide * (i % 2 ? 1 : -1), slide * 0.5); g.fill();
      g.strokeStyle = BK; g.lineWidth = 2.4; g.stroke(); });
    DISCS.forEach(([x, y, r, d], i) => triskele(g, x, y, r, d * t * 0.6 + i, i ? VERD : ORP, i ? ORP : VERD));
  };
  const initialDots = g => { POLYS.forEach(P => dots(g, grow(XY.densify(P, 4, true), 9), 9, 2.3)); DISCS.forEach(([x, y, r]) => dots(g, XY.ellipse(x, y, r + 12, r + 12, 60), 9, 2.3)); };
  // ------------------------------------------------------------ static page
  const page = (g, W, H, S) => {
    g.fillStyle = VELLUM; g.fillRect(0, 0, W, H);
    const R = XY.rng(1601); for (let k = 0; k < 60; k++) { const x = R() * W, y = R() * H, r = 10 + R() * 60, rg = g.createRadialGradient(x, y, 0, x, y, r); rg.addColorStop(0, 'rgba(160,120,70,0.10)'); rg.addColorStop(1, 'rgba(160,120,70,0)'); g.fillStyle = rg; g.fillRect(x - r, y - r, 2 * r, 2 * r); }
    for (let k = 0; k < 900; k++) { g.fillStyle = `rgba(120,90,50,${0.05 + 0.08 * R()})`; g.fillRect(R() * W, R() * H, 1 + R() * 2, 1); }
    // knotwork border
    const B = 26, I = 8; g.fillStyle = BK; g.fillRect(I - 3, I - 3, W - 2 * I + 6, B + 6); g.fillRect(I - 3, H - I - B - 3, W - 2 * I + 6, B + 6); g.fillRect(I - 3, I - 3, B + 6, H - 2 * I + 6); g.fillRect(W - I - B - 3, I - 3, B + 6, H - 2 * I + 6);
    const pb = pat(g, S, ORP, VERD, 0, 0); g.fillStyle = pb; g.fillRect(I, I, W - 2 * I, B); g.fillRect(I, H - I - B, W - 2 * I, B); g.fillRect(I, I, B, H - 2 * I); g.fillRect(W - I - B, I, B, H - 2 * I);
    g.fillStyle = VELLUM; g.fillRect(I + B + 3, I + B + 3, W - 2 * (I + B + 3), H - 2 * (I + B + 3));
    [[I + B / 2, I + B / 2], [W - I - B / 2, I + B / 2], [I + B / 2, H - I - B / 2], [W - I - B / 2, H - I - B / 2]].forEach(([x, y], k) => triskele(g, x, y, 22, k, MIN, ORP));
    // display letters after the initial, the count panel
    g.save(); g.font = XY.font(96, XY.cnFont.kai, 'bold'); g.textBaseline = 'alphabetic';
    [['悟', 548, 262, WOAD], ['净', 664, 262, VERD]].forEach(([c, x, y, col]) => { g.lineWidth = 7; g.strokeStyle = BK; g.strokeText(c, x, y); g.fillStyle = col; g.fillText(c, x, y); });
    g.restore();
    g.fillStyle = ORP; g.fillRect(548, 296, 270, 70); g.strokeStyle = BK; g.lineWidth = 3; g.strokeRect(548, 296, 270, 70);
    g.fillStyle = BK; g.font = XY.font(46, '"Luminari", "Apple Chancery", serif'); g.textBaseline = 'middle'; g.fillText('XVI', 562, 333); g.font = XY.font(28, XY.cnFont.kai); g.fillText('第十六难', 674, 333); g.textBaseline = 'alphabetic';
    dots(g, [540, 288, 826, 288, 826, 374, 540, 374, 540, 288], 9, 2.3);
    // (v10) no evangelist-portrait arch: the right of the page is a stippled panel with two interlaced long-necked birds
    // (zoomorphic interlace is the page's ornament, not a subject); 木叉 now flies in over it on a cloud
    g.save(); g.fillStyle = '#F0E2C0'; g.fillRect(860, 70, 280, 380); g.strokeStyle = BK; g.lineWidth = 3; g.strokeRect(860, 70, 280, 380); g.restore();
    for (let y = 84; y < 444; y += 10) for (let x = 872 + ((y / 10) % 2) * 5; x < 1132; x += 10) { g.fillStyle = 'rgba(200,70,42,0.32)'; g.beginPath(); g.arc(x, y, 1.6, 0, TAU); g.fill(); }
    const bird = (sx, flip, col) => { const P = [], s = flip ? -1 : 1; for (let k = 0; k <= 40; k++) { const q = k / 40; P.push(1000 + s * (90 * Math.sin(q * TAU * 0.9 + 0.5) * (1 - q * 0.4)), 100 + q * 320); }
      const rb = XY.RIG.ribbon(XY.RIG.spline(P, false, 4), 26, 8); XY.path(g, rb, true); g.fillStyle = BK; g.lineWidth = 5; g.strokeStyle = BK; g.stroke(); g.fillStyle = col; g.fill();
      XY.path(g, XY.RIG.ribbon(XY.RIG.spline(P, false, 4), 9, 3), true); g.fillStyle = ORP; g.fill();
      const hx = P[0], hy = P[1]; g.beginPath(); g.arc(hx, hy, 16, 0, TAU); g.fillStyle = BK; g.fill(); g.beginPath(); g.arc(hx, hy, 12, 0, TAU); g.fillStyle = col; g.fill();
      g.fillStyle = BK; XY.path(g, [hx + s * 10, hy - 4, hx + s * 30, hy + 4, hx + s * 10, hy + 6], true); g.fill(); g.fillStyle = '#F2EADA'; g.beginPath(); g.arc(hx + s * 3, hy - 3, 3.4, 0, TAU); g.fill(); g.fillStyle = BK; g.beginPath(); g.arc(hx + s * 3.6, hy - 3, 1.6, 0, TAU); g.fill();
      void sx; };
    bird(0, false, VERD); bird(0, true, WOAD);
    dots(g, [852, 62, 1148, 62, 1148, 458, 852, 458, 852, 62], 9, 2.3);
    // lower left: a stippled field with a knot of two hounds biting each other's tails, faint, behind the road
    g.save(); g.globalAlpha = 0.42; g.fillStyle = '#F0E2C0'; g.fillRect(50, 470, 420, 220); g.strokeStyle = BK; g.lineWidth = 2; g.strokeRect(50, 470, 420, 220);
    for (let y = 482; y < 686; y += 12) for (let x = 60 + ((y / 12) % 2) * 6; x < 466; x += 12) { g.fillStyle = 'rgba(200,70,42,0.5)'; g.beginPath(); g.arc(x, y, 1.8, 0, TAU); g.fill(); }
    [[0, PINK], [Math.PI / 3, VERD]].forEach(([ph, col]) => { const P = []; for (let k = 0; k <= 90; k++) { const q = k / 90, a = q * TAU + ph; P.push(260 + Math.sin(3 * a) * 170, 580 + Math.sin(2 * a) * 82); }
      const rb = XY.RIG.ribbon(XY.RIG.spline(P, false, 3), 22, 6); XY.path(g, rb, true); g.strokeStyle = BK; g.lineWidth = 5; g.stroke(); g.fillStyle = col; g.fill(); });
    g.restore();
  };
  const GOURD = (g, x, y, s) => { g.save(); g.translate(x, y); g.scale(s, s);
    g.fillStyle = BK; g.beginPath(); g.arc(0, 8, 17, 0, TAU); g.arc(0, -14, 11, 0, TAU); g.fill();
    g.fillStyle = MIN; g.beginPath(); g.arc(0, 8, 14, 0, TAU); g.fill(); g.beginPath(); g.arc(0, -14, 8.5, 0, TAU); g.fill();
    g.fillStyle = ORP; g.fillRect(-6, -4, 12, 4); stroke(g, [0, -22, 2, -30], 2.4, '#6A4A2A'); g.fillStyle = 'rgba(255,230,200,0.6)'; g.beginPath(); g.arc(-5, 4, 4, 0, TAU); g.fill(); g.restore(); };
  const SKULL = (g, x, y, s) => { g.fillStyle = BK; g.beginPath(); g.arc(x, y, 9 * s, 0, TAU); g.fill(); g.fillStyle = '#F2EADA'; g.beginPath(); g.arc(x, y, 7 * s, 0, TAU); g.fill();
    g.fillStyle = BK; g.beginPath(); g.arc(x - 2.6 * s, y - 0.5 * s, 1.8 * s, 0, TAU); g.arc(x + 2.6 * s, y - 0.5 * s, 1.8 * s, 0, TAU); g.fill(); g.fillRect(x - 2 * s, y + 3.4 * s, 4 * s, 1.2 * s); };
  const river = (g, W, t) => {
    g.fillStyle = BK; g.fillRect(34, 703, W - 68, 42); g.fillStyle = WOAD; g.fillRect(34, 706, W - 68, 37);
    g.save(); g.beginPath(); g.rect(34, 706, W - 68, 37); g.clip();
    for (let x = 20 - ((t * 26) % 60); x < W; x += 60) { const P = []; for (let k = 0; k <= 26; k++) { const q = k / 26, a = q * 9, r = 3 + 13 * q; P.push(x + Math.cos(a) * r, 726 + Math.sin(a) * r * 0.8); }
      g.strokeStyle = BK; g.lineWidth = 5; XY.path(g, P, false); g.stroke(); g.strokeStyle = '#8AB8C8'; g.lineWidth = 2.4; XY.path(g, P, false); g.stroke(); }
    g.restore();
  };
  const COL = { fur: '#B8742A', face: '#EED6AC', wkshirt: MIN, tiger: ORP, stripe: BK, gold: ORP, staff: MIN, ink: BK, horse: '#F4ECD6', horse2: '#DCCFB2', mane: '#ECE2C8', hoof: BK,
    saddle: WOAD, red: MIN, robe: ORP, kasaya: MIN, skin: '#EED6AC', metal: ORP, bjrobe: WOAD, bjpants: '#3E3264', pig: '#E8A090', pig2: '#D08070', wood: '#8A5A2A',
    ssrobe: VERD, ssrobe2: '#2E6A52', skin2: '#D8B088', ssh: MIN, ssbeard: '#B83A22', skull: '#F2EADA', bundle: ORP };
  const PEN = { outline: BK, ow: 2.2, shade: 'rgba(30,20,10,0.22)', color: r => (COL[r] !== undefined ? COL[r] : XY.DEFAULT_COLORS[r]) };
  // red-lead dots around every shape (drawn first; the figures then cover the inner half of each dot)
  const DOTS = { color: () => MIN, part(ctx, p) { if (p.k === 'dot' || p.fine) return true; ctx.setLineDash([0, 10]); ctx.lineCap = 'round'; ctx.strokeStyle = MIN; ctx.lineWidth = 6.8;
    XY.path(ctx, p.pts, p.k === 'poly' || !!p.closed); ctx.stroke(); ctx.setLineDash([]); return true; } };
  // 木叉 (惠岸行者) on a cloud, drawn the insular way: frontal, colour fields, a red-dotted halo, the red gourd held up
  const mucha = (g, x, y, t, hold) => {
    g.save(); g.translate(x, y);
    const cl = XY.RIG.spline([-70, 40, -40, 22, 0, 30, 40, 20, 74, 38, 40, 52, -30, 52], true, 5); XY.path(g, cl, true); g.fillStyle = '#F6EEDA'; g.fill(); g.strokeStyle = BK; g.lineWidth = 3; g.stroke();
    [[-70, 40, -1], [74, 38, 1]].forEach(([a, b, s]) => { const P = []; for (let k = 0; k <= 16; k++) { const q = k / 16, an = q * 7, r = 14 * (1 - q * 0.8); P.push(a + s * (8 + Math.cos(an) * r), b - 6 + Math.sin(an) * r); } stroke(g, P, 3, BK); });
    g.beginPath(); g.arc(0, -72, 30, 0, TAU); g.fillStyle = ORP; g.fill(); g.stroke(); dots(g, XY.ellipse(0, -72, 40, 40, 40), 9, 2.2);
    XY.path(g, [-34, 30, -28, -30, -14, -44, 14, -44, 28, -30, 34, 30], true); g.fillStyle = VERD; g.fill(); g.stroke();
    XY.path(g, [-14, 30, -8, -36, 8, -36, 14, 30], true); g.fillStyle = WOAD; g.fill(); g.stroke();
    for (let k = 0; k < 4; k++) stroke(g, [-26 + k * 3, -16 + k * 12, -16, -8 + k * 12], 2, BK);
    g.beginPath(); g.ellipse(0, -66, 15, 19, 0, 0, TAU); g.fillStyle = '#F2D8B8'; g.fill(); g.stroke();
    for (let k = -1; k <= 1; k++) { g.beginPath(); g.arc(k * 8, -84, 4.4, 0, TAU); g.fillStyle = '#8A3A1A'; g.fill(); g.stroke(); }
    g.fillStyle = BK; [-6, 6].forEach(d => { g.beginPath(); g.ellipse(d, -66, 3.2, 2, 0, 0, TAU); g.fill(); }); stroke(g, [-4, -56, 4, -56], 1.6, MIN);
    stroke(g, [24, -26, 44, -48 - 10 * hold], 7, VERD); stroke(g, [-24, -26, -40, -8], 7, VERD);
    g.restore();
    return [x + 46, y - 58 - 10 * hold];
  };
  const LAND = 0.5, PEN2 = { ...PEN, color: (r, p, n) => (n === 'shaseng' && r === 'skull' ? null : PEN.color(r)) };

  XY.STYLES.celtic = {
    hits: [2, 4, 5.5],
    bg(g, W, H, c, S) { g.lineCap = 'round'; g.lineJoin = 'round'; page(g, W, H, S); initialDots(g); },
    draw(g, e) {
      const { W, u, t, cell } = e; g.lineCap = 'round'; g.lineJoin = 'round';
      // 木叉 glides in on his cloud (beats 0–1.6) and calls 悟净 (beat 2); he flies off after the boat is made
      const mi = XY.easeOut((u + 0.3) / 0.5), mo = XY.easeIn((u - 0.82) / 0.2), MX = XY.lerp(1300, 1000, mi) + 260 * mo, MY = XY.lerp(80, 250, mi) - 220 * mo + 6 * Math.sin(t * 2);
      // 沙悟净 behind the initial: peeping → pops up head and shoulders (beat 2) → leaps out (beats 3–4) into his place
      const tl = cell.t0 + LAND * cell.dur, tx = XY.procWorldX(tl) - cell.x - 300, ph = XY.walkPhase(tl);
      const jump = XY.clamp((u - 0.375) / (LAND - 0.375)), pop = XY.easeOut((u - 0.22) / 0.05);
      if (u < LAND) {
        if (jump <= 0) { g.save(); g.beginPath(); g.rect(0, 0, W, 432); g.clip();
          K.figure(g, 'shaseng', ph, 256 + 3 * Math.sin(t * 2), 570 - 90 * pop + 4 * Math.sin(t * 3.1), PEN, { shaseng: { lift: pop } }, { scale: 1.1 }); g.restore(); }
      }
      initial(g, e.S, t);
      if (u < LAND && jump > 0) { const q = XY.easeIO(jump), x = XY.lerp(256, tx, q), y = XY.lerp(480, e.groundY, q) - 280 * Math.sin(q * Math.PI);
        for (let k = 1; k < 6; k++) { const qq = Math.max(0, q - k * 0.05); g.fillStyle = `rgba(200,70,42,${0.5 - k * 0.08})`; g.beginPath(); g.arc(XY.lerp(256, tx, qq), XY.lerp(480, e.groundY, qq) - 280 * Math.sin(qq * Math.PI) - 80, 6 - k * 0.6, 0, TAU); g.fill(); }
        K.figure(g, 'shaseng', ph, x, y, PEN, {}, { rot: -0.6 * Math.sin(q * Math.PI), scale: XY.lerp(1.1, 1, q) }); }
      const hand = mucha(g, MX, MY, t, XY.smooth((u - 0.2) / 0.06));
      // beat 4.5 the gourd is thrown down; the nine skulls leave 沙悟净's neck and roll into the river; beat 5.5 a knotwork
      // cord laces through them and the gourd, and the 法船 carries the line along the river
      const throwU = XY.clamp((u - 0.56) / 0.07), roll = XY.clamp((u - 0.56) / 0.1), lace = XY.easeIO((u - 0.66) / 0.06);
      if (throwU <= 0) GOURD(g, hand[0], hand[1], 1.3);
      river(g, W, t);
      const bx = e.procX + 40, by = 716 + 2 * Math.sin(t * 3), slots = [...Array(9)].map((_, i) => [bx - 330 + (i < 4 ? i : i + 1) * 64, by + 10]);
      const neck = e.at('shaseng.chest');
      if (lace > 0) { const x0 = bx - 372, x1 = bx + 332, hull = XY.RIG.spline([x0 - 30, by - 52, x0, by - 8, (x0 + x1) / 2, by - 8, x1, by - 8, x1 + 30, by - 52, x1 + 6, by - 20, x1 - 40, by + 26, (x0 + x1) / 2, by + 34, x0 + 40, by + 26, x0 - 6, by - 20], true, 5);
        g.save(); g.beginPath(); g.rect(x0 - 40, 600, (x1 - x0 + 80) * lace, 200); g.clip();
        XY.path(g, hull, true); g.fillStyle = BK; g.fill(); g.save(); g.translate(0, 0); XY.path(g, grow(hull, -4), true); g.fillStyle = pat(g, e.S, ORP, VERD, t * 9, 0); g.fill(); g.restore();
        dots(g, grow(XY.densify(hull, 4, true), 8), 9, 2.3);
        [[x0 - 30, by - 52, -1], [x1 + 30, by - 52, 1]].forEach(([a, b, sd]) => { const P = []; for (let k = 0; k <= 18; k++) { const q = k / 18, an = q * 8, r = 16 * (1 - q * 0.85); P.push(a + sd * Math.cos(an) * r, b + Math.sin(an) * r); } stroke(g, P, 6, BK); stroke(g, P, 3, MIN); });
        g.restore(); }
      if (roll > 0) slots.forEach(([x, y], i) => { const q = XY.easeOut(XY.clamp(roll * 1.6 - i * 0.07)); if (q <= 0) return;
        const sx = XY.lerp(neck[0], x, q), sy = XY.lerp(neck[1], y, q) - 120 * Math.sin(q * Math.PI); SKULL(g, sx, sy + 1.5 * Math.sin(t * 3 + i), 1.9); });
      if (throwU > 0 && throwU < 1) { const q = XY.easeIO(throwU); GOURD(g, XY.lerp(hand[0], bx, q), XY.lerp(hand[1], by - 6, q) - 180 * Math.sin(q * Math.PI), 1.3 + 0.4 * Math.sin(q * Math.PI)); }
      else if (throwU >= 1) GOURD(g, bx, by + 4, 1.8);
      // the pilgrims: dotted in red lead, outlined in black, flat insular colours; 沙悟净 walks with them from the landing
      const acts = { wukong: { shade: XY.smooth((u - 0.2) / 0.06) * (1 - XY.smooth((u - 0.36) / 0.06)) }, monk: { palm: XY.smooth((u - 0.5) / 0.05) * (1 - XY.smooth((u - 0.8) / 0.1)) },
        bajie: { scratch: XY.smooth((u - 0.3) / 0.05) * (1 - XY.smooth((u - 0.45) / 0.06)) }, shaseng: { lift: XY.smooth((u - 0.7) / 0.08) }, cast: { shaseng: u >= LAND } };
      const pn = roll > 0 ? PEN2 : PEN;
      K.team(g, e.phase, e.procX, e.groundY, DOTS, acts);
      K.team(g, e.phase, e.procX, e.groundY, pn, acts);
      if (u >= LAND && u < LAND + 0.08) { const a = (u - LAND) / 0.08; for (let k = 0; k < 16; k++) { const an = Math.PI + k / 15 * Math.PI, r = 24 + 80 * a; g.fillStyle = `rgba(200,70,42,${1 - a})`; g.beginPath(); g.arc(tx + (XY.procWorldX(e.t) - XY.procWorldX(tl)) + Math.cos(an) * r, e.groundY - 4 + Math.sin(an) * r * 0.35, 4, 0, TAU); g.fill(); } }
    },
    post(canvas, g, e) { const c = e.cell, tx = XY.procWorldX(c.t0 + LAND * c.dur) - c.x - 300; K.zoomPost(canvas, g, e, tx + 60, 560, K.zoom(e.u, [0.42, 0.5, 0.64], 1.1)); },
  };
})();
