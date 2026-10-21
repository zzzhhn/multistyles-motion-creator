// 01 洞窟岩画 · 金蝉遭贬 — 如来 slaps his palm onto the rock and knocks 金蝉子 out of the sun disc; the golden
// cicada spirals down, dotting its trail like a cave-art dot row, and drops into Tang Seng's 毗卢帽 on beat 3.
// Everything painted lives on one pigment layer that the rock relief shades; a real fire in front flickers across
// the wall. As the opening zoom lands the picture paints itself: stencils are blown, charcoal runs, the
// procession is sprayed on, the title is dabbed in finger dots.
(() => {
  'use strict';
  const XY = window.XY, K = XY.KIT_A, TAU = XY.TAU;
  const OCHRE = '#9C3B22', OCHRE2 = '#76281A', YEL = '#C98A34', GOLD = '#F0C24A', CHAR = '#21150D', KAOLIN = '#E9DCC2';
  const T = 2.5;                          // rock texel (design px)
  const FIRE = [104, 700], SUN = [905, 172], SUNR = 58, PALM = [1028, 150];
  const rev = (u, a, d) => XY.clamp((u - a) / d);

  // ------------------------------------------------------------ rock (height field → colour, pigment shading, fire-lit relief)
  let ROCK = null;
  const rock = W => {
    if (ROCK && ROCK.W === W) return ROCK;
    const H = 780, w = Math.ceil(W / T), h = Math.ceil(H / T), hole = (x, y) => Math.exp(-Math.pow((x - 680) / 120, 2) - Math.pow((y + 10) / 95, 2));
    const f = K.field(w, h, (i, j) => { const x = i * T, y = j * T;
      return XY.fbm(x * 0.0036, y * 0.0036, 11, 4) + 0.07 * XY.fbm(x * 0.02, y * 0.02, 15, 3) + 0.035 * XY.noise2(x * 0.03, y * 0.004, 19) - 0.9 * hole(x, y) + (y > 702 ? -0.15 - 0.002 * (y - 702) : 0); });
    const top = K.lit(f, w, h, 16), fire = K.lit(f, w, h, 16, [-0.75, 0.5, 0.45]);
    const A = K.hex('#CF955C'), B = K.hex('#6E4426'), Rr = K.hex('#B6643A'), Cc = K.hex('#E4D6B8');
    const col = K.pix(w, h, (i, j, o) => { const x = i * T, y = j * T, s = top[j * w + i];
      let c = K.mixc(B, A, XY.clamp(0.6 + 0.9 * XY.fbm(x * 0.002, y * 0.002, 23, 3)));
      c = K.mixc(c, Rr, XY.clamp(XY.fbm(x * 0.006 + 7, y * 0.006, 29, 3) * 1.6) * 0.55);
      c = K.mixc(c, Cc, 0.45 * XY.clamp((XY.noise2(x * 0.03, y * 0.0045, 31) - 0.4) * 3) * XY.clamp(1 - y / 520));   // calcite flowstone
      const edge = Math.max(0, 1 - Math.min(x, W - x, y * 1.5, (H - y) * 2.2) / 150), m = (0.8 + 0.42 * s) * (1 - 0.8 * hole(x, y)) * (1 - 0.4 * edge) * (y > 702 ? 0.72 : 1);
      o[0] = c[0] * m; o[1] = c[1] * m; o[2] = c[2] * m; });
    const tex = K.pix(w, h, (i, j, o) => { const v = top[j * w + i], pit = XY.hash(i, j, 41) < 0.05;
      if (v < 0.5 || pit) { o[0] = 26; o[1] = 12; o[2] = 6; o[3] = Math.min(255, (0.5 - v) * 240 + (pit ? 60 : 0)); } else { o[0] = 255; o[1] = 236; o[2] = 205; o[3] = (v - 0.5) * 100; } });
    const lit = K.pix(w, h, (i, j, o) => { const v = 40 + fire[j * w + i] * 175; o[0] = o[1] = o[2] = v; });
    return (ROCK = { W, w, h, col, tex, lit });
  };
  const holes = S => XY.keep(`cave-holes:${S.toFixed(4)}`, 256, 256, cv => { const g = cv.getContext('2d'), R = XY.rng(77);
    for (let i = 0; i < 900; i++) { g.fillStyle = `rgba(0,0,0,${0.25 + 0.6 * R()})`; g.beginPath(); g.arc(R() * 256, R() * 256, 0.5 + 1.6 * R() * R() * S, 0, TAU); g.fill(); } });

  // ------------------------------------------------------------ marks
  // palm + fingers, each filled separately (one path would cancel under nonzero winding); gap = index of a shortened finger
  const handPath = (g, x, y, s, rot, seed, gap = -1) => {
    g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s); g.lineCap = 'round';
    XY.path(g, XY.wobble(XY.ellipse(0, 0, 26, 30, 18), 2, seed), true); g.fill();
    [[-0.36, 48, 13], [-0.11, 56, 13.5], [0.12, 53, 13], [0.36, 42, 11.5], [-1.2, 36, 13]].forEach(([a, l, w], k) => {
      if (gap === k) l *= 0.5; const bx = k === 4 ? -21 : -17 + k * 11.3, by = k === 4 ? 6 : -19;
      g.lineWidth = w; g.beginPath(); g.moveTo(bx, by); g.lineTo(bx + Math.sin(a) * l, by - Math.cos(a) * l); g.stroke(); });
    g.restore();
  };
  // negative hand stencil: blown pigment with the hand masked out (sprite in device px, centre at 130,130 design)
  const stencil = (k, S, col) => XY.keep(`cave-st${k}:${S.toFixed(4)}`, 260 * S, 260 * S, cv => {
    const g = cv.getContext('2d'), R = XY.rng(300 + k); g.scale(S, S); g.translate(130, 125); g.fillStyle = col;
    for (let i = 0; i < 4200; i++) { const a = R() * TAU, d = i < 2600 ? 66 * Math.sqrt(R()) : 66 + 30 * Math.abs(Math.sqrt(-2 * Math.log(R() + 1e-6)) * Math.cos(TAU * R()));
      g.globalAlpha = (i < 2600 ? 0.16 : 0.07) + 0.2 * R(); g.beginPath(); g.arc(Math.cos(a) * d, Math.sin(a) * d * 1.12 - 8, 0.8 + 2.6 * R(), 0, TAU); g.fill(); }
    g.globalAlpha = 1; g.globalCompositeOperation = 'destination-out'; g.fillStyle = g.strokeStyle = '#000'; handPath(g, 0, 10, 1, 0, 300 + k, [-1, -1, 1, -1, 3][k]);
  });
  const STENCILS = [[64, 392, 0.82, -0.32, OCHRE], [158, 372, 0.95, -0.1, CHAR], [258, 386, 0.78, 0.12, OCHRE], [352, 366, 1.0, -0.2, OCHRE2], [446, 388, 0.86, 0.28, CHAR]];

  // animals, all facing right; each pose is a fill outline + charcoal strokes (local units)
  const HORSE = [-70, -14, -62, -28, -36, -34, -6, -36, 14, -40, 30, -50, 42, -72, 48, -82, 52, -74, 58, -66, 68, -52, 76, -38, 76, -30, 64, -28, 48, -34, 40, -16, 34, 0, 22, 10, -6, 16, -36, 14, -56, 6, -68, -2];
  const BISON = [-74, -6, -66, -24, -46, -36, -20, -44, 4, -62, 24, -66, 42, -56, 56, -40, 66, -26, 74, -8, 76, 8, 68, 18, 56, 22, 44, 14, 30, 22, 6, 24, -24, 22, -50, 20, -70, 12];
  const IBEX = [-44, -4, -36, -18, -10, -22, 18, -22, 32, -30, 42, -44, 52, -47, 60, -39, 56, -31, 46, -23, 40, -9, 30, 3, -4, 6, -32, 6, -46, 2];
  const shape = (g, pts, seed, fill, f, lw = 4.2) => {      // charcoal outline drawn on to fraction f, fill washes in behind it
    const P = XY.wobble(XY.densify(pts, 6, true), 1.6, seed); P.push(P[0], P[1]);
    if (fill && f > 0.55) { g.globalAlpha = XY.smooth((f - 0.55) / 0.45); XY.path(g, P, true); g.fillStyle = fill; g.fill(); g.globalAlpha = 1; }
    K.stroke(g, K.partial(P, f), CHAR, lw);
  };
  const legs = (g, L, f, lw = 4) => { if (f < 0.7) return; g.globalAlpha = XY.smooth((f - 0.7) / 0.3); L.forEach(l => K.stroke(g, l, CHAR, lw)); g.globalAlpha = 1; };
  const horse = (g, x, y, s, pose, nod, f, seed) => {      // Lascaux "Chinese horse": round yellow belly, black head and bristly mane
    g.save(); g.translate(x, y); g.scale(s, s); g.lineCap = g.lineJoin = 'round';
    legs(g, pose ? [[34, 2, 46, 40], [22, 8, 12, 42], [-54, 0, -66, 38], [-44, 8, -34, 42]] : [[34, 2, 32, 42], [22, 8, 26, 42], [-54, 0, -54, 40], [-44, 8, -46, 42]], f, 4.4);
    shape(g, HORSE, seed, YEL, f, 4.4);
    if (f > 0.8) { const a = XY.smooth((f - 0.8) / 0.2); g.globalAlpha = a;
      g.save(); g.translate(30, -40); g.rotate(nod); g.translate(-30, 40);
      XY.path(g, XY.wobble(XY.densify([30, -44, 42, -72, 50, -78, 58, -66, 74, -46, 76, -34, 62, -30, 46, -36, 36, -24], 6, true), 1.4, seed + 1), true); g.fillStyle = CHAR; g.fill();
      for (let k = 0; k < 11; k++) { const q = k / 10, px = XY.lerp(-6, 44, q), py = XY.lerp(-38, -74, q) - 3; K.stroke(g, [px, py, px - 6, py - 11], CHAR, 3.2); }
      g.fillStyle = KAOLIN; g.beginPath(); g.arc(56, -58, 2.2, 0, TAU); g.fill(); g.restore();
      K.stroke(g, [-66, -10, -84, 4, -80, 26], CHAR, 5);
      g.globalAlpha = 0.45 * a; K.stroke(g, [-48, 8, -10, 14, 24, 8], CHAR, 8); g.globalAlpha = 1; }
    g.restore();
  };
  const bison = (g, x, y, s, pose, f, seed) => {
    g.save(); g.translate(x, y); g.scale(s, s); g.lineCap = g.lineJoin = 'round';
    const L = pose ? [[40, 18, 50, 52], [26, 20, 16, 54], [-46, 18, -58, 50], [-60, 12, -68, 46]] : [[40, 18, 34, 54], [26, 20, 30, 54], [-46, 18, -40, 52], [-60, 12, -54, 48]];
    const Lg = pose ? [[40, 18, 34, 54], [-46, 18, -40, 52]] : [[40, 18, 50, 52], [-46, 18, -58, 50]];
    if (f > 0.7) { g.globalAlpha = 0.3; Lg.forEach(l => K.stroke(g, l, CHAR, 3.4)); g.globalAlpha = 1; }   // the "eight legs" of Chauvet
    legs(g, L, f);
    shape(g, BISON, seed, OCHRE, f, 4.6);
    if (f > 0.8) { g.globalAlpha = 0.85 * XY.smooth((f - 0.8) / 0.2);
      XY.path(g, XY.wobble(XY.densify([4, -62, 24, -66, 42, -56, 56, -40, 66, -26, 74, -8, 76, 8, 68, 18, 56, 22, 50, 4, 34, -20, 10, -40], 6, true), 1.5, seed + 3), true); g.fillStyle = CHAR; g.fill();
      g.globalAlpha = 1; K.stroke(g, [52, -42, 64, -58, 56, -70], CHAR, 4); K.stroke(g, [-74, -6, -86, 4, -84, 18], CHAR, 3);
      g.fillStyle = KAOLIN; g.beginPath(); g.arc(62, -12, 2.6, 0, TAU); g.fill(); }
    g.restore();
  };
  const ibex = (g, x, y, s, pose, f, seed) => {
    g.save(); g.translate(x, y); g.scale(s, s); g.lineCap = g.lineJoin = 'round';
    legs(g, pose ? [[30, 2, 42, 34], [24, 4, 14, 36], [-30, 4, -40, 34], [-38, 2, -30, 34]] : [[30, 2, 28, 36], [24, 4, 26, 36], [-30, 4, -32, 36], [-38, 2, -36, 34]], f, 3.4);
    shape(g, IBEX, seed, YEL, f, 3.8);
    if (f > 0.8) { const a = XY.smooth((f - 0.8) / 0.2); g.globalAlpha = a; g.strokeStyle = CHAR; g.lineWidth = 5; g.beginPath(); g.moveTo(48, -46); g.bezierCurveTo(44, -86, 0, -84, -6, -52); g.stroke();
      for (let k = 0; k < 5; k++) { const q = 0.2 + k * 0.15, hx = XY.lerp(46, -2, q), hy = -46 - 34 * Math.sin(q * Math.PI); K.stroke(g, [hx - 4, hy + 2, hx + 5, hy - 4], CHAR, 2.4); }
      g.fillStyle = CHAR; g.beginPath(); g.arc(50, -38, 2.4, 0, TAU); g.fill(); g.globalAlpha = 1; }
    g.restore();
  };
  const MAMMOTH = [-96, 24, -100, -10, -84, -46, -44, -68, 0, -74, 36, -64, 60, -44, 72, -18, 76, 8, 72, 42, 64, 56, 56, 44, 60, 16, 50, 12, 42, 34, 22, 34, 12, 12, -40, 12, -50, 34, -72, 34, -80, 16];
  const dot = (g, x, y, r, col = OCHRE, seed = 0) => { if (r <= 0.2) return; g.fillStyle = col; g.beginPath(); g.ellipse(x, y, r, r * (0.8 + 0.2 * XY.hash(seed, 9)), XY.hash(seed, 8) * 3, 0, TAU); g.fill(); };
  const dancer = (g, x, y, s, pose, cheer, f) => {          // stick figure by the fire; one arm up, one down → both up on the cheer
    if (f <= 0) return;
    g.save(); g.translate(x, y - 7 * cheer); g.scale(s, s); g.lineCap = 'round'; g.strokeStyle = g.fillStyle = OCHRE2; g.lineWidth = 5.5;
    const leg = pose ? 1 : -1, A = [XY.lerp(pose ? -2.3 : 2.5, -2.15, cheer), XY.lerp(pose ? 0.7 : -0.8, -0.95, cheer)];
    const P = [[0, -46, 0, -18], [0, -18, -10 - 4 * leg, 0], [0, -18, 9 - 4 * leg, 0]].concat(A.map(a => [0, -40, Math.cos(a) * 21, -40 + Math.sin(a) * 21]));
    P.forEach(L => K.stroke(g, K.partial(L, f * 1.6), OCHRE2, 5.5));
    if (f > 0.5) { g.beginPath(); g.arc(0, -55, 6.5, 0, TAU); g.fill(); }
    g.restore();
  };
  // ---- 灵山法会 in cave-painting language: 如来 in the sun, listeners in a row, 金蝉子 dozing; 普贤's elephant, 文殊's lion
  const buddha = (g, x, y, f, lift, t) => { if (f <= 0) return; g.save(); g.translate(x, y); g.lineCap = g.lineJoin = 'round'; g.globalAlpha = Math.min(1, f * 1.5);
    const body = [-46, 40, -30, 0, -22, -34, 22, -34, 30, 0, 46, 40]; XY.path(g, XY.wobble(XY.densify(body, 6, true), 1.4, 3), true); g.fillStyle = KAOLIN; g.fill(); g.strokeStyle = CHAR; g.lineWidth = 4; g.stroke();
    XY.path(g, XY.wobble(XY.ellipse(0, 40, 54, 14, 18), 1.4, 4), true); g.fill(); g.stroke();
    XY.path(g, XY.wobble(XY.densify([-28, -30, 22, -34, 40, 36, 10, 40], 6, true), 1.2, 6), true); g.fillStyle = OCHRE; g.fill(); g.stroke();   // the kasaya over one shoulder
    XY.path(g, XY.wobble(XY.ellipse(0, -56, 22, 24, 16), 1.2, 5), true); g.fillStyle = KAOLIN; g.fill(); g.stroke(); g.fillStyle = CHAR; g.beginPath(); g.arc(0, -82, 8, 0, TAU); g.fill();
    K.stroke(g, [-6, -54, -2, -54], CHAR, 2.6); K.stroke(g, [6, -54, 2, -54], CHAR, 2.6);
    K.stroke(g, [-22, -26, -34, 0, -10, 18], CHAR, 6); const a = -1.2 - 1.1 * lift; K.stroke(g, [22, -26, 22 + Math.cos(a + 0.6) * 22, -26 + Math.sin(a + 0.6) * 22, 22 + Math.cos(a + 0.6) * 22 + Math.cos(a) * 26, -26 + Math.sin(a + 0.6) * 22 + Math.sin(a) * 26], CHAR, 6);
    for (let k = 0; k < 12; k++) { const q = k / 12 * TAU + t * 0.4; g.fillStyle = YEL; g.beginPath(); g.arc(Math.cos(q) * 30, -54 + Math.sin(q) * 30, 3, 0, TAU); g.fill(); }
    g.restore(); };
  const listener = (g, x, y, f, nod, doze, t) => { if (f <= 0) return; g.save(); g.translate(x, y); g.globalAlpha = Math.min(1, f * 1.6); g.lineCap = 'round';
    const col = doze ? GOLD : OCHRE2; XY.path(g, [-13, 0, 0, -30, 13, 0], true); g.fillStyle = col; g.fill(); g.strokeStyle = CHAR; g.lineWidth = 2.4; g.stroke();
    const hx = doze ? 7 : 0, hy = doze ? -30 : -37 - nod; g.fillStyle = col; g.beginPath(); g.arc(hx, hy, 7.5, 0, TAU); g.fill(); g.stroke();
    for (let k = 0; k < 7; k++) { const q = -Math.PI + k / 6 * Math.PI; g.fillStyle = doze ? YEL : OCHRE; g.beginPath(); g.arc(hx + Math.cos(q) * 13, hy + Math.sin(q) * 13, 2, 0, TAU); g.fill(); }
    if (doze) for (let k = 0; k < 3; k++) { const q = ((t * 0.6 + k / 3) % 1); g.fillStyle = CHAR; g.globalAlpha = Math.min(1, f) * (1 - q); g.beginPath(); g.arc(hx + 12 + 14 * q, hy - 10 - 34 * q, 2 + 3 * q, 0, TAU); g.fill(); }
    g.restore(); };
  const ELE = [-70, 30, -76, -10, -60, -40, -20, -54, 24, -52, 58, -40, 76, -22, 86, 4, 90, 34, 96, 56, 86, 62, 78, 40, 70, 22, 60, 30, -40, 30];
  const elephant = (g, x, y, s, pose, f, seed) => { g.save(); g.translate(x, y); g.scale(s, s); g.lineCap = g.lineJoin = 'round';
    legs(g, pose ? [[-50, 26, -58, 62], [-30, 28, -24, 64], [30, 28, 24, 62], [50, 26, 58, 62]] : [[-50, 26, -50, 62], [-30, 28, -32, 64], [30, 28, 32, 62], [50, 26, 50, 62]], f, 8);
    shape(g, ELE, seed, KAOLIN, f, 4.6);
    if (f > 0.8) { const a = XY.smooth((f - 0.8) / 0.2); g.globalAlpha = a; [0, 1, 2].forEach(k => K.stroke(g, [72 - k * 4, 10 + k * 4, 96 + k * 6, 20 + k * 6, 110 + k * 6, 4 + k * 6], '#F6EEDC', 4)); g.globalAlpha = 1;
      g.fillStyle = CHAR; g.beginPath(); g.arc(52, -14, 3.6, 0, TAU); g.fill(); K.stroke(g, [10, -40, 30, -10, 20, 14], CHAR, 3); for (let k = 0; k < 6; k++) dot(g, -40 + k * 14, -60 - 8 * Math.sin(k), 3, OCHRE, k + seed); }
    g.restore(); };
  const LION = [-64, 0, -54, -24, -20, -30, 24, -30, 42, -40, 62, -42, 74, -30, 72, -10, 60, -2, 44, 8, 0, 12, -40, 12, -60, 10];
  const lion = (g, x, y, s, pose, roar, f, seed) => { g.save(); g.translate(x, y); g.scale(s, s); g.lineCap = g.lineJoin = 'round';
    legs(g, pose ? [[40, 8, 54, 40], [28, 10, 20, 42], [-40, 8, -54, 40], [-50, 6, -42, 40]] : [[40, 8, 38, 42], [28, 10, 30, 42], [-40, 8, -40, 40], [-50, 6, -50, 40]], f, 5);
    shape(g, LION, seed, '#4A4E52', f, 4.4);
    if (f > 0.8) { const a = XY.smooth((f - 0.8) / 0.2); g.globalAlpha = a; for (let k = 0; k < 14; k++) { const q = k / 14 * TAU, r = 26 + 6 * (k % 2); const cx = 52 + Math.cos(q) * r, cy = -26 + Math.sin(q) * r * 0.95; g.fillStyle = '#2E5A5E'; g.beginPath(); g.arc(cx, cy, 7.5, 0, TAU); g.fill(); g.strokeStyle = CHAR; g.lineWidth = 2.6; g.beginPath(); g.arc(cx, cy, 5, q, q + 4.2); g.stroke(); }
      XY.path(g, XY.wobble(XY.ellipse(56, -26, 22, 18, 14), 1.2, seed + 2), true); g.fillStyle = '#4A4E52'; g.fill(); g.strokeStyle = CHAR; g.lineWidth = 3.4; g.stroke();
      K.stroke(g, [72, -12, 84, -6 + 10 * roar, 72, 2], CHAR, 3.4); g.fillStyle = KAOLIN; g.beginPath(); g.arc(64, -30, 3, 0, TAU); g.fill(); K.stroke(g, [-64, 0, -84, -18, -80, -36, -72, -30], CHAR, 4); g.globalAlpha = 1; }
    g.restore(); };
  const cicada = (g, x, y, s, rot, flap) => {
    g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s); g.lineJoin = 'round';
    [-1, 1].forEach(d => { g.save(); g.rotate(d * (0.3 + 0.4 * flap)); g.beginPath(); g.ellipse(-16, d * 9, 27, 8.5, 0, 0, TAU); g.fillStyle = 'rgba(240,222,170,0.82)'; g.fill();
      g.strokeStyle = CHAR; g.lineWidth = 1.8; g.stroke(); g.lineWidth = 1.1; g.beginPath(); g.moveTo(-2, d * 6); g.lineTo(-38, d * 10); g.moveTo(-14, d * 4); g.lineTo(-30, d * 15); g.stroke(); g.restore(); });
    g.beginPath(); g.ellipse(0, 0, 17, 8.5, 0, 0, TAU); g.fillStyle = GOLD; g.fill(); g.strokeStyle = CHAR; g.lineWidth = 2.2; g.stroke();
    g.lineWidth = 1.4; for (let k = 0; k < 3; k++) { g.beginPath(); g.moveTo(-9 + k * 5, -7.5); g.lineTo(-9 + k * 5, 7.5); g.stroke(); }
    g.beginPath(); g.ellipse(14, 0, 6.5, 9, 0, 0, TAU); g.fillStyle = YEL; g.fill(); g.stroke();
    g.fillStyle = CHAR; g.beginPath(); g.arc(17, -6.5, 2.6, 0, TAU); g.arc(17, 6.5, 2.6, 0, TAU); g.fill();
    g.restore();
  };
  const sun = (g, t, f, shake) => {
    if (f <= 0) return;
    const st = K.step(t, 8), sx = SUN[0] + shake, sy = SUN[1];
    for (let k = 0; k < 16; k++) { if (k / 16 > f * 1.5) break; const a = k / 16 * TAU + 0.05 * (XY.hash(k, st) - 0.5), r0 = SUNR + 20, r1 = SUNR + (k % 2 ? 40 : 54) + 5 * XY.hash(k, st + 1);
      K.stroke(g, [sx + Math.cos(a) * r0, sy + Math.sin(a) * r0, sx + Math.cos(a) * r1, sy + Math.sin(a) * r1], CHAR, 5.5); }
    if (f > 0.35) for (let k = 0; k < 20; k++) dot(g, sx + Math.cos(k / 20 * TAU + 0.15) * (SUNR + 10), sy + Math.sin(k / 20 * TAU + 0.15) * (SUNR + 10), 3.4 * XY.smooth((f - 0.35) / 0.3), YEL, k);
    if (f > 0.5) { g.globalAlpha = XY.smooth((f - 0.5) / 0.4); XY.path(g, XY.wobble(XY.ellipse(sx, sy, SUNR, SUNR, 30), 2.4, 3), true); g.fillStyle = OCHRE; g.fill(); g.strokeStyle = CHAR; g.lineWidth = 4.5; g.stroke(); g.globalAlpha = 1; }
  };
  // cells 1–8: 唐僧 rides alone on an ordinary horse (chestnut ochre, charcoal mane — the white dragon horse comes in 9)
  const COL = { horse: '#A0602E', horse2: '#7E4622', mane: CHAR, hoof: CHAR, saddle: OCHRE, red: OCHRE, robe: YEL, kasaya: OCHRE, skin: '#C7955E', skin2: '#A8774E', face: '#D6A46C',
    fur: '#7A4A2A', wkshirt: OCHRE, tiger: YEL, stripe: CHAR, staff: OCHRE, gold: '#E2AE44', metal: '#D9A441', pig: '#C98A6A', pig2: '#B07050', bjrobe: CHAR, bjpants: '#3A2A1E',
    ssrobe: '#5A4632', ssrobe2: '#4A3A2A', ssh: OCHRE, ssbeard: OCHRE2, skull: KAOLIN, bundle: YEL, wood: '#5A3A22', ink: CHAR };
  const PEN = { seed: 11, wob: 2.2, outline: CHAR, ow: 2.3, color: r => COL[r] || CHAR };
  const FUZZ = { seed: 11, wob: 3.2, outline: 'rgba(33,21,13,0.16)', ow: 7, fine: false, shade: false, color: () => 'rgba(0,0,0,0)' };
  const U_SLAP = 4 / 12, U_LAND = 7 / 12, JZ = [604, 316], APEX = [740, 96];
  const actsAt = u => ({ monk: { palm: K.win(u, U_LAND - 0.05, 0.94, 0.05) } });
  // the cicada's flight: 金蝉子 is struck on beat 4, flung up to an apex, spirals down into the monk's crown on beat 7 (fixed per cell)
  const LAND = new Map();
  const landing = e => { const c = e.cell; if (LAND.has(c.n)) return LAND.get(c.n);
    const tl = c.t0 + U_LAND * c.dur, p = XY.anchor('monk.head', XY.walkPhase(tl), actsAt(U_LAND)), L = [XY.procWorldX(tl) - c.x + p[0] + 2, e.groundY + p[1] - 20]; LAND.set(c.n, L); return L; };
  const fallPos = (f, L) => { if (f < 0.22) { const q = XY.easeOut(f / 0.22); return [XY.lerp(JZ[0], APEX[0], q), XY.lerp(JZ[1], APEX[1], q) - 40 * Math.sin(Math.PI * q)]; }
    const g2 = (f - 0.22) / 0.78, k = 0.4 * XY.easeIn(g2) + 0.6 * g2, a = g2 * TAU * 1.5 + 0.6, r = 90 * Math.sin(Math.PI * g2) * (1 - 0.4 * g2);
    return [XY.lerp(APEX[0], L[0], k) + Math.cos(a) * r, XY.lerp(APEX[1], L[1], k) + Math.sin(a) * r * 0.62]; };

  // ------------------------------------------------------------ near layer
  const DRIPS = [[38, 70, 16], [96, 40, 11], [210, 88, 18], [262, 46, 10], [560, 64, 14], [610, 120, 20], [668, 88, 15], [730, 140, 22], [790, 58, 12], [1090, 42, 10], [1170, 76, 16]];
  const stalactites = (g, fl) => DRIPS.forEach(([x, l, w], k) => {
    const P = XY.wobble(XY.densify([x - w, -6, x - w * 0.45, l * 0.6, x + 2, l, x + w * 0.4, l * 0.55, x + w, -6], 9), 2.5, 60 + k);
    XY.path(g, P, true); g.fillStyle = '#2C1A10'; g.fill(); g.strokeStyle = `rgba(255,178,108,${0.28 * fl})`; g.lineWidth = 2.2; XY.path(g, P.slice(0, 6), false); g.stroke(); });
  const fire = (g, t, fl) => {
    const [fx, fy] = FIRE;
    g.save(); g.globalCompositeOperation = 'lighter';
    let rg = g.createRadialGradient(fx, fy - 40, 4, fx, fy - 40, 240); rg.addColorStop(0, `rgba(255,150,60,${0.42 * fl})`); rg.addColorStop(1, 'rgba(255,120,40,0)'); g.fillStyle = rg; g.fillRect(fx - 240, fy - 280, 480, 400);
    g.restore();
    [[-56, 16, 50, -4], [-46, -2, 58, 16], [-10, 18, 12, -14]].forEach(L => { K.stroke(g, [fx + L[0], fy + L[1], fx + L[2], fy + L[3]], '#1A0E08', 11); K.stroke(g, [fx + L[0] + 4, fy + L[1] - 3, fx + L[2] - 4, fy + L[3] - 3], `rgba(255,110,40,${0.6 + 0.3 * fl})`, 2.4); });
    // flame tongues: three layers (red → orange → yellow core), each a few teardrops swaying on their own noise
    const tongue = (x0, w, h, lean, col) => { const P = [x0 - w, fy + 4, x0 - w * 0.62 + lean * 0.25, fy - h * 0.34, x0 - w * 0.22 + lean * 0.7, fy - h * 0.74, x0 + lean, fy - h,
      x0 + w * 0.3 + lean * 0.55, fy - h * 0.58, x0 + w * 0.72 + lean * 0.2, fy - h * 0.28, x0 + w, fy + 4]; XY.path(g, XY.RIG.spline(P, false, 4), true); g.fillStyle = col; g.fill(); };
    [['#A8341A', 1.0, 1.0], ['#E0782A', 0.72, 0.8], ['#FAD068', 0.42, 0.55]].forEach(([c, hk, wk], j) => {
      [[-26, 30, 92], [4, 36, 128], [32, 28, 84], [-48, 18, 56], [52, 18, 60]].forEach(([dx, w, h], k) => {
        const n = XY.noise1(t * (5.5 + k * 0.7) + k * 3, 9 + j + k * 5), hh = h * hk * (0.82 + 0.3 * n), ln = 22 * XY.noise1(t * 3.8 + k, 4 + j) * hk + 6;
        tongue(fx + dx * (0.6 + 0.4 * hk), w * wk, hh, ln, c); }); });
    g.save(); g.globalCompositeOperation = 'lighter';
    for (let k = 0; k < 14; k++) { const a = 0.35 + 0.65 * Math.abs(XY.noise1(t * 6 + k * 1.7, 30)); g.fillStyle = `rgba(255,${120 + 90 * XY.hash(k, 21) | 0},50,${a})`; g.beginPath(); g.arc(fx - 46 + 92 * XY.hash(k, 22), fy + 6 + 7 * XY.hash(k, 23), 2.5 + 3 * XY.hash(k, 24), 0, TAU); g.fill(); }
    for (let k = 0; k < 26; k++) { const P = 1.4 + XY.hash(k, 2), q = ((t + XY.hash(k, 1) * P) % P) / P, x = fx - 30 + 60 * XY.hash(k, 3) + q * (90 + 120 * XY.hash(k, 4)) + 14 * Math.sin(t * 3 + k), y = fy - 30 - q * (260 + 220 * XY.hash(k, 5));
      g.fillStyle = `rgba(255,${190 + 50 * XY.hash(k, 6) | 0},110,${0.9 * Math.sin(Math.PI * q) * (0.4 + 0.6 * Math.abs(Math.sin(t * 7 + k)))})`; g.beginPath(); g.arc(x, y, 1.4 + 2.2 * XY.hash(k, 7), 0, TAU); g.fill(); }
    g.restore();
  };

  // ------------------------------------------------------------ the cell
  XY.STYLES.cave = {
    bg(g, W, H, c) {
      const R = rock(W); g.imageSmoothingQuality = 'high'; g.drawImage(R.col, 0, 0, R.w * T, R.h * T);
      K.specks(g, 5, 3200, 0, 0, W, H, '#2A160A', 0.4, 2.2, 0.06, 0.3);
      K.specks(g, 6, 1600, 0, 0, W, H, '#FFF0D8', 0.4, 1.8, 0.05, 0.22);
      const Rn = XY.rng(c.n * 31);
      for (let k = 0; k < 10; k++) { let x = Rn() * W, y = 40 + Rn() * 600, a = Rn() * TAU; const P = [x, y];
        for (let s = 0; s < 20; s++) { a += (Rn() - 0.5) * 0.9; x += Math.cos(a) * 13; y += Math.sin(a) * 13; P.push(x, y); }
        K.cut(g, P, 1.7, 'rgba(48,26,12,0.5)', 'rgba(255,236,206,0.32)', 1.5); }
      // older marks, mostly flaked away: red bars and finger dots
      g.globalAlpha = 0.22; for (let k = 0; k < 7; k++) K.stroke(g, [760 + k * 16, 520 + 8 * XY.hash(k, 1), 764 + k * 16, 560 + 8 * XY.hash(k, 2)], OCHRE, 7);
      for (let k = 0; k < 18; k++) { g.fillStyle = OCHRE; g.beginPath(); g.arc(880 + (k % 6) * 22, 600 + Math.floor(k / 6) * 22, 5, 0, TAU); g.fill(); } g.globalAlpha = 1;
      // finger flutings in the soft moonmilk
      for (let k = 0; k < 4; k++) { const P = []; for (let s = 0; s <= 30; s++) { const q = s / 30; P.push(18 + k * 11 + 26 * Math.sin(q * 7.5 + k * 0.15), 420 + q * 120); }
        K.cut(g, P, 6, 'rgba(250,236,210,0.2)', 'rgba(60,34,18,0.22)', -1.5); }
      // the floor: a darker clay ledge with a child's footprints
      let gr = g.createLinearGradient(0, 700, 0, H); gr.addColorStop(0, 'rgba(30,16,8,0.1)'); gr.addColorStop(1, 'rgba(30,16,8,0.5)'); g.fillStyle = gr; g.fillRect(0, 702, W, H - 702);
      for (let k = 0; k < 5; k++) { const x = 420 + k * 62, y = 742 + (k % 2) * 16; g.fillStyle = 'rgba(40,20,10,0.35)'; g.beginPath(); g.ellipse(x, y, 11, 5.5, 0.1, 0, TAU); g.fill(); g.beginPath(); g.ellipse(x + 13, y - 1, 3.4, 3, 0, 0, TAU); g.fill(); }
    },
    draw(g, e) {
      const { W, H, u, t, S, beat } = e, R = rock(W), acts = actsAt(u);
      const fl = 0.78 + 0.13 * XY.noise1(t * 8.5, 3) + 0.09 * XY.noise1(t * 21, 4);
      // ---- the pigment layer: everything painted, later shaded by the rock
      const [pc, pg] = K.layer('cave-paint', e); pg.lineCap = pg.lineJoin = 'round';
      K.stroke(pg, K.partial(XY.wobble(XY.densify([0, 704, W, 704], 20), 1.5, 9), rev(u, -0.32, 0.3)), OCHRE2, 5);
      STENCILS.forEach(([x, y, s, r, col], k) => { const f = rev(u, -0.36 + 0.06 * k, 0.1); if (f <= 0) return;
        pg.save(); pg.globalAlpha = Math.min(1, f * 1.4); pg.translate(x, y); pg.rotate(r); pg.scale(s * (0.8 + 0.2 * XY.easeOut(f)), s * (0.8 + 0.2 * XY.easeOut(f))); pg.drawImage(stencil(k, S, col), -130, -125, 260, 260); pg.restore(); });
      // the ledge the listeners sit on, painted as a dotted line
      const df = rev(u, -0.16, 0.16); for (let k = 0; k < 16; k++) { if (k / 16 >= df) break; dot(pg, 572 + k * 16, 324 + 3 * Math.sin(k), 3.6, OCHRE, k); }
      const pose = K.step(t, 6) % 2, preach = K.win(u, 0.0, U_SLAP + 0.02, 0.03), warn = XY.smooth(rev(u, 0.2, 0.12));
      elephant(pg, 196, 262 + (pose ? -2 : 1), 1.15, pose, rev(u, -0.28, 0.16), 5);
      lion(pg, 470, 214 + (pose ? 1 : -1), 1.3, 1 - pose, K.win(u, 0.18, 0.4, 0.03) * (K.step(t, 5) % 2), rev(u, -0.22, 0.14), 20);
      // dancers by the fire, high on the wall behind the procession
      [[30, 588, 0.9], [68, 582, 1.0], [214, 560, 0.85], [262, 556, 0.8], [310, 560, 0.86], [358, 556, 0.8]].forEach(([x, y, s], k) =>
        dancer(pg, x, y, s, (K.step(t, 4) + k) % 2, K.win(u, U_LAND + 0.01 * k, 0.94, 0.025), rev(u, -0.2 + 0.03 * k, 0.1)));
      const sf = rev(u, -0.12, 0.2), shake = 7 * K.hit(beat, 4, 0.5) * Math.sin(t * 90);
      sun(pg, t, sf, shake); buddha(pg, SUN[0] + shake, SUN[1] + 18, rev(u, -0.1, 0.16), warn, t);
      // the assembly: listeners nod in time; 金蝉子 at the back dozes until the palm comes down on beat 4
      for (let k = 0; k < 5; k++) listener(pg, 650 + k * 40, 322, rev(u, -0.08 + 0.02 * k, 0.1), preach * 3 * ((K.step(t * 1.5, 1) + k) % 2), false, t);
      if (u < U_SLAP) listener(pg, JZ[0], 322, rev(u, -0.1, 0.1), 0, true, t);
      // 如来's palm: a shadow of it gathers over 金蝉子 (beats 2.6–4), slams down on beat 4 and stays on the rock
      const pre = rev(beat, 2.6, 1.4); if (pre > 0 && beat < 4) { pg.save(); pg.globalAlpha = 0.22 + 0.35 * pre; pg.fillStyle = pg.strokeStyle = OCHRE;
        handPath(pg, XY.lerp(SUN[0] - 40, JZ[0], XY.easeIn(pre)), XY.lerp(SUN[1] + 20, JZ[1] - 20, XY.easeIn(pre)), 2.4 - 0.8 * pre, -0.3 + 0.2 * pre, 4); pg.restore(); }
      if (beat >= 4) { const k = XY.clamp((beat - 4) / 0.12), s = 1.6 * (1.16 - 0.16 * XY.easeOut(k));
        pg.fillStyle = pg.strokeStyle = OCHRE; pg.globalAlpha = 0.94; handPath(pg, JZ[0], JZ[1] - 20, s, -0.1, 4); pg.globalAlpha = 1;
        const b = XY.clamp((beat - 4) / 0.7); if (b < 1) for (let j = 0; j < 18; j++) { const a = j / 18 * TAU, r = 100 + 90 * XY.easeOut(b); dot(pg, JZ[0] + Math.cos(a) * r, JZ[1] - 20 + Math.sin(a) * r * 0.9, 5 * (1 - b), OCHRE, j); } }
      // the cicada: struck out of 金蝉子 on beat 4, flung up, spiralling down, into the crown on beat 7
      const L = landing(e), ff = XY.clamp((u - U_SLAP) / (U_LAND - U_SLAP)), flap = Math.abs(Math.sin(t * 34));
      for (let k = 0; k < 28; k++) { const q = (k + 0.6) / 29; if (q > ff || q > 0.92 || u < U_SLAP) break; const p = fallPos(q, L); dot(pg, p[0], p[1], 4 + 1.8 * XY.hash(k, 7), OCHRE, k + 50); }
      if (u >= U_SLAP && u < U_LAND) { const p = fallPos(ff, L), p2 = fallPos(Math.min(1, ff + 0.02), L); cicada(pg, p[0], p[1], 2.0 - 0.8 * ff, Math.atan2(p2[1] - p[1], p2[0] - p[0]), flap); }
      // the procession, sprayed on while the opening zoom lands
      const [prc, prg] = K.layer('cave-pr', e);
      XY.drawProcession(prg, e.phase, e.procX, e.groundY, FUZZ, acts); XY.drawProcession(prg, e.phase, e.procX, e.groundY, PEN, acts);
      const src = u >= 0.14 ? prc : K.masked('cave-prm', e, prc, mg => { mg.fillStyle = '#000';
        for (let k = 0; k < 12; k++) { const f = rev(u, -0.17 + 0.021 * k, 0.12); if (f <= 0) continue; const r = 165 * XY.easeOut(f);
          XY.path(mg, XY.wobble(XY.ellipse(e.procX - 380 + 62 * k + 20 * XY.hash(k, 1), e.groundY - 50 - 180 * XY.hash(k, 2), r, r * 0.95, 22), 0.12 * r, k), true); mg.fill(); } });
      K.blit(pg, src);
      if (u >= U_LAND) { const hd = e.at('monk.head', acts), k = XY.clamp((u - U_LAND) / 0.07), ha = XY.smooth((u - U_LAND - 0.01) / 0.05);
        if (k < 1) for (let j = 0; j < 24; j++) { const a = j / 24 * TAU + 0.3, r = 22 + 120 * XY.easeOut(k); dot(pg, hd[0] + Math.cos(a) * r, hd[1] - 16 + Math.sin(a) * r * 0.9, 5 * (1 - k) + 1.5, YEL, j); }
        for (let j = 0; j < 14; j++) { const a = j / 14 * TAU + t * 0.9; dot(pg, hd[0] + Math.cos(a) * 31, hd[1] - 12 + Math.sin(a) * 31, 3.3 * ha, GOLD, j); } }
      // the title in finger dots, dabbed top to bottom
      const G = K.glyphPts('金蝉', XY.cnFont.wei, 112, 8.6, true), N = G.pts.length / 3;
      for (let k = 0; k < N; k++) { const f = (u - 0.02 - 0.3 * k / N) / 0.03; if (f < 0) break; dot(pg, 1054 + G.pts[3 * k], 250 + G.pts[3 * k + 1], (3.9 + 1.3 * XY.hash(k, 3)) * (1 + 0.9 * (1 - XY.clamp(f))), '#D2522C', k); }
      // rock shading on the pigment, pigment lost in the pits
      pg.save(); pg.setTransform(1, 0, 0, 1, 0, 0); pg.globalCompositeOperation = 'source-atop'; pg.imageSmoothingQuality = 'high'; pg.drawImage(R.tex, 0, 0, R.w * T * S, R.h * T * S);
      pg.globalCompositeOperation = 'destination-out'; pg.fillStyle = pg.createPattern(holes(S), 'repeat'); pg.fillRect(0, 0, pc.width, pc.height); pg.restore();
      K.blit(g, pc, 0, 0, 0.95);
      // the tally notch (第一难), cut into the rock
      const cf = rev(u, -0.1, 0.1); if (cf > 0) K.cut(g, K.partial([1144, 28, 1146, 66, 1150, 106], cf), 9, 'rgba(36,18,10,0.85)', 'rgba(255,236,206,0.6)', 2.2);
      // ---- light: fire-lit relief, stalactites, smoke, darkness away from the fire, warm overlay, the fire itself
      g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'soft-light'; g.globalAlpha = 0.6 * fl; g.imageSmoothingQuality = 'high'; g.drawImage(R.lit, 0, 0, R.w * T * S, R.h * T * S); g.restore();
      stalactites(g, fl);
      for (let k = 0; k < 5; k++) { const q = (t * 0.2 + k / 5) % 1, x = FIRE[0] + 40 + q * 420 + 30 * Math.sin(t * 0.9 + k), y = FIRE[1] - 110 - q * 520, r = 40 + 130 * q, a = 0.15 * Math.sin(Math.PI * q);
        const rg = g.createRadialGradient(x, y, 0, x, y, r); rg.addColorStop(0, `rgba(36,24,16,${a})`); rg.addColorStop(1, 'rgba(36,24,16,0)'); g.fillStyle = rg; g.fillRect(x - r, y - r, 2 * r, 2 * r); }
      const dark = 0.16 + 0.2 * (1 - fl) + 0.6 * (1 - XY.smooth(rev(u, -0.5, 0.32)));
      let rg = g.createRadialGradient(FIRE[0], FIRE[1] - 60, 80, FIRE[0] + 300, FIRE[1] - 200, 1500);
      rg.addColorStop(0, 'rgba(18,8,3,0)'); rg.addColorStop(0.5, `rgba(18,8,3,${0.45 * dark})`); rg.addColorStop(1, `rgba(18,8,3,${Math.min(0.92, dark + 0.12)})`); g.fillStyle = rg; g.fillRect(0, 0, W, H);
      g.save(); g.globalCompositeOperation = 'overlay'; rg = g.createRadialGradient(FIRE[0], FIRE[1] - 40, 10, FIRE[0], FIRE[1] - 40, 720);
      rg.addColorStop(0, `rgba(255,150,70,${0.55 * fl})`); rg.addColorStop(1, 'rgba(255,150,70,0)'); g.fillStyle = rg; g.fillRect(0, 0, W, H); g.restore();
      if (u > U_LAND - 0.01 && u < U_LAND + 0.26) { const hd = e.at('monk.head', acts), k = XY.clamp((u - U_LAND) / 0.24); g.save(); g.globalCompositeOperation = 'lighter';
        rg = g.createRadialGradient(hd[0], hd[1] - 16, 2, hd[0], hd[1] - 16, 170); rg.addColorStop(0, `rgba(255,214,110,${0.9 * (1 - k)})`); rg.addColorStop(1, 'rgba(255,190,80,0)'); g.fillStyle = rg; g.fillRect(hd[0] - 170, hd[1] - 190, 340, 340); g.restore(); }
      { const sl = K.hit(beat, 4, 0.6); if (sl > 0) { g.save(); g.globalCompositeOperation = 'lighter'; rg = g.createRadialGradient(JZ[0], JZ[1] - 20, 4, JZ[0], JZ[1] - 20, 220); rg.addColorStop(0, `rgba(255,170,110,${0.7 * sl})`); rg.addColorStop(1, 'rgba(255,120,60,0)'); g.fillStyle = rg; g.fillRect(JZ[0] - 220, JZ[1] - 240, 440, 440); g.restore(); } }
      fire(g, t, fl);
    },
    hits: [4, 7],
    post(canvas, g, e) { const L = landing(e); K.zoom(canvas, g, e, Math.max(K.push(e.beat, 3.6, 4.1, 5.4, 0.12), K.push(e.beat, 6.5, 7.1, 8.8, 0.15)), e.beat < 6 ? JZ[0] : L[0], e.beat < 6 ? JZ[1] : L[1]); },
  };
})();
