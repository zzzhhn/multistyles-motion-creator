// 06 商周青铜饕餮 · 折从落坑 — one face of a Shang 方鼎. Its 饕餮 mask is the three demons of chapter 13 fused into one:
// 特处士's bull horns, 熊山君's round bear ears, 寅将军's tiger fangs; its jaw is the ground. Tang Seng's two attendants wait
// under a hanging bell with a lantern, walk on ahead of his horse, and on beat 2 the floor drops open as the mask's mouth;
// on beat 3 it clangs shut a stride in front of the horse, the copper-inlaid eyes flare and roll down to look at the monk.
// The vessel is poured at the start: it glows molten and cools from the edges in. Everything is cast relief under patina.
(() => {
  'use strict';
  const XY = window.XY, K = XY.KIT_A, TAU = XY.TAU;
  const GND = '#2F4A3C', REL = '#6E8E74', RELH = '#B8BC8C', DK = '#141E18', CU = '#B0563A', LIPC = 'rgba(214,226,190,0.55)';
  const CX = 840, PX0 = 742, PX1 = 938, T = 3;
  const rev = (u, a, d) => XY.clamp((u - a) / d);
  const M = (pts, s) => { const o = []; for (let k = 0; k < pts.length; k += 2) o.push(CX + s * pts[k], pts[k + 1]); return o; };   // half-mask → panel, s = ±1

  // ------------------------------------------------------------ relief helpers
  let DEPTH = 1;   // the mask is cast deeper than the ground ornament
  const rel = (g, pts, fill = REL, d0 = 2.4) => { const d = d0 * DEPTH;
    g.save(); g.translate(d * 1.6, d * 1.6); XY.path(g, pts, true); g.fillStyle = 'rgba(6,10,8,0.35)'; g.fill(); g.restore();
    g.save(); g.translate(d, d); XY.path(g, pts, true); g.fillStyle = 'rgba(6,10,8,0.62)'; g.fill(); g.restore();
    g.save(); g.translate(-d * 0.6, -d * 0.6); XY.path(g, pts, true); g.fillStyle = 'rgba(226,232,196,0.55)'; g.fill(); g.restore(); XY.path(g, pts, true); g.fillStyle = fill; g.fill();
    if (DEPTH > 1) { g.save(); XY.path(g, pts, true); g.clip(); g.translate(d * 0.9, d * 0.9); XY.path(g, pts, true); g.strokeStyle = 'rgba(232,236,200,0.5)'; g.lineWidth = d * 1.2; g.stroke(); g.restore(); XY.path(g, pts, true); g.strokeStyle = 'rgba(10,16,12,0.5)'; g.lineWidth = 1.2; g.stroke(); } };
  const relC = (g, x, y, r, fill = REL, d = 2.4) => rel(g, XY.ellipse(x, y, r, r, 28), fill, d);
  const groove = (g, pts, w = 2.2) => K.cut(g, pts, w, DK, LIPC, 1.2);
  const leiPts = (x, y, s) => [x + 4 * s, y + 4 * s, x + 28 * s, y + 4 * s, x + 28 * s, y + 28 * s, x + 8 * s, y + 28 * s, x + 8 * s, y + 10 * s, x + 22 * s, y + 10 * s, x + 22 * s, y + 22 * s, x + 14 * s, y + 22 * s, x + 14 * s, y + 16 * s];
  const leiField = (g, x0, y0, x1, y1, s = 1) => { for (let y = y0; y < y1; y += 32 * s) for (let x = x0; x < x1; x += 32 * s) { const flip = ((x - x0) / (32 * s) + (y - y0) / (32 * s)) % 2 ? -1 : 1;
    const P = leiPts(0, 0, s); for (let k = 0; k < P.length; k += 2) { P[k] = x + (flip > 0 ? P[k] : 32 * s - P[k]); P[k + 1] += y; } groove(g, P, 1.8); } };
  // a squared spiral disc (the cheek 雷纹), raised, turned by a
  const spiralDisc = (g, x, y, r, a) => { relC(g, x, y, r, REL); g.save(); g.translate(x, y); g.rotate(a); const P = [];
    for (let k = 0; k <= 13; k++) { const rr = r * (0.86 - k * 0.06), q = k * Math.PI / 2; P.push(Math.cos(q) * rr, Math.sin(q) * rr); } groove(g, P, 3); g.restore(); };

  // ------------------------------------------------------------ the mask (right half; mirrored)
  const HORN = [40, 304, 18, 252, 34, 200, 84, 160, 156, 134, 236, 120, 312, 100, 262, 140, 190, 158, 130, 184, 92, 222, 82, 266, 96, 302];
  const BROW = [46, 318, 120, 304, 214, 306, 222, 326, 120, 324, 50, 336];
  const SOCK = [50, 344, 206, 344, 224, 372, 206, 420, 84, 420, 62, 446, 46, 422, 46, 362];
  const SNOUT = [16, 468, 70, 498, 92, 560, 64, 604, 16, 604];
  const BODY = [236, 420, 296, 396, 330, 416, 330, 540, 302, 520, 268, 470];
  const LIPU = [16, 612, 196, 612, 258, 640, 272, 690, 240, 700, 200, 662, 16, 652];
  const mask = (g, s) => {
    rel(g, M(HORN, s), REL); for (let k = 1; k < 6; k++) { const a = [HORN[2 * k], HORN[2 * k + 1]], b = [HORN[24 - 2 * k], HORN[25 - 2 * k]]; groove(g, M([XY.lerp(a[0], b[0], 0.12), XY.lerp(a[1], b[1], 0.12), XY.lerp(a[0], b[0], 0.88), XY.lerp(a[1], b[1], 0.88)], s), 2.4); }
    groove(g, M([60, 290, 52, 230, 96, 186, 170, 150, 250, 128, 300, 106], s), 1.6);
    relC(g, CX + s * 256, 266, 38); relC(g, CX + s * 256, 266, 20, RELH, 1.6); groove(g, XY.ellipse(CX + s * 256, 266, 30, 30, 24).concat([CX + s * 286, 266]), 1.4);
    rel(g, M(BROW, s)); rel(g, M(SOCK, s)); rel(g, XY.ellipse(CX + s * 128, 382, 54, 30, 30), RELH, 1.8);
    groove(g, M([62, 356, 200, 356, 214, 374, 200, 408, 86, 408, 66, 430], s), 1.6);
    rel(g, M(SNOUT, s)); groove(g, M([18, 480, 64, 506, 82, 558, 58, 594], s), 1.6);
    { const P = []; for (let k = 0; k <= 30; k++) { const a = k / 30 * TAU * 1.6, r = 18 - k * 0.5; P.push(CX + s * (52 + Math.cos(a) * r), 560 + Math.sin(a) * r); } groove(g, P, 2.6); }
    rel(g, M(BODY, s)); groove(g, M([248, 432, 300, 412, 320, 430, 320, 520], s), 1.6);
    { const P = M([290, 532, 296, 600, 304, 644], s); K.stroke(g, P, 'rgba(6,10,8,0.6)', 18); K.stroke(g, P, REL, 14); [-1, 0, 1].forEach(j => groove(g, M([304 + j * 10, 644, 310 + j * 12, 664, 300 + j * 12, 676], s), 3)); }
    rel(g, M(LIPU, s)); groove(g, M([20, 630, 190, 630, 240, 652, 252, 684], s), 1.6);
    [[70, 652, 50, 702, 18], [114, 652, 36, 684, 12], [148, 654, 30, 680, 10], [180, 660, 26, 682, 9]].forEach(([dx, y0, _, y1, w]) => rel(g, M([dx - w, y0, dx + w, y0, dx, y1], s), RELH, 1.6));
    { const P = []; for (let k = 0; k <= 24; k++) { const a = k / 24 * TAU * 1.3, r = 16 - k * 0.5; P.push(CX + s * (246 + Math.cos(a) * r), 672 + Math.sin(a) * r); } groove(g, P, 2.4); }
  };
  const flange = (g, x, y0, y1) => { for (let y = y0; y < y1; y += 40) { rel(g, [x - 14, y, x + 14, y, x + 14, y + 28, x + 6, y + 28, x + 6, y + 34, x - 6, y + 34, x - 6, y + 28, x - 14, y + 28], REL, 2.6); groove(g, [x, y + 4, x, y + 24], 1.4); } };
  // 夔龙: a one-legged dragon in profile (148×84 box), facing left; mirrored units face each other
  const kui = (g, x, y, flip) => { const F = pts => { const o = []; for (let k = 0; k < pts.length; k += 2) o.push(x + (flip ? 148 - pts[k] : pts[k]), y + pts[k + 1]); return o; };
    rel(g, F([10, 20, 46, 20, 46, 64, 12, 64])); rel(g, F([0, 26, 12, 26, 12, 40, 2, 38])); rel(g, F([0, 56, 12, 54, 12, 66, 4, 64]));
    rel(g, F([44, 32, 124, 32, 124, 48, 44, 48])); for (let k = 0; k < 5; k++) rel(g, F([52 + k * 14, 32, 58 + k * 14, 22, 62 + k * 14, 32]), REL, 1.4);
    { const P = []; for (let k = 0; k <= 18; k++) { const a = Math.PI / 2 - k / 18 * TAU * 0.9, r = 18 - k * 0.6; P.push(130 + Math.cos(a) * r, 26 + Math.sin(a) * r); } const Q = F(P); K.stroke(g, Q, 'rgba(6,10,8,0.6)', 12); K.stroke(g, Q, REL, 9); }
    rel(g, F([80, 48, 92, 48, 96, 72, 84, 76])); groove(g, F([84, 76, 76, 80, 72, 74]), 2);
    relC(g, x + (flip ? 148 - 28 : 28), y + 40, 8, RELH, 1.4); groove(g, F([50, 40, 118, 40]), 1.4);
  };
  // 太白金星 (who comes to 唐僧's rescue in chapter 13): an old man with a long beard and a gourd staff, inlaid in gold as he appears
  const jinxing = (g, x, y, f, glow, t) => { if (f <= 0) return; const col = `rgb(${XY.lerp(110, 226, f) | 0},${XY.lerp(142, 186, f) | 0},${XY.lerp(116, 92, f) | 0})`;
    g.save(); g.globalAlpha = Math.min(1, f * 2); DEPTH = 1.6;
    rel(g, [x - 30, y, x - 22, y - 112, x + 18, y - 112, x + 32, y], col); groove(g, [x - 12, y - 100, x - 18, y - 4], 1.6); groove(g, [x + 6, y - 100, x + 14, y - 4], 1.6);
    rel(g, XY.RIG.capsule([x + 10, y - 104], [x + 40, y - 70], 9, 7), col); relC(g, x + 2, y - 128, 16, col); rel(g, [x - 16, y - 136, x - 8, y - 156, x + 14, y - 156, x + 20, y - 136], col);
    rel(g, [x + 4, y - 118, x + 20, y - 116, x + 14, y - 74, x + 6, y - 82], RELH); K.stroke(g, [x + 8, y - 132, x + 13, y - 132], DK, 2);
    K.stroke(g, [x + 44, y + 2, x + 50, y - 176], DK, 7); K.stroke(g, [x + 44, y + 2, x + 50, y - 176], col, 4.5); relC(g, x + 51, y - 186, 9, col); relC(g, x + 51, y - 200, 6, col);
    DEPTH = 1; g.restore();
    if (glow > 0) { g.save(); g.globalCompositeOperation = 'lighter'; const sx = x + 2, sy = y - 230, rg = g.createRadialGradient(sx, sy, 4, sx, sy, 140); rg.addColorStop(0, `rgba(255,236,160,${0.9 * glow})`); rg.addColorStop(1, 'rgba(255,210,120,0)'); g.fillStyle = rg; g.fillRect(sx - 140, sy - 140, 280, 280);
      g.fillStyle = `rgba(255,240,180,${glow})`; g.beginPath(); for (let k = 0; k < 10; k++) { const a = -Math.PI / 2 + k * Math.PI / 5 + t * 0.6, r = k % 2 ? 9 : 24; g.lineTo(sx + Math.cos(a) * r, sy + Math.sin(a) * r); } g.fill(); g.restore(); } };
  // 甬钟: a chime bell with bosses, on its rope; near layer
  const bell = (g, x, y, a) => { g.save(); g.translate(x, y); g.rotate(a);
    K.stroke(g, [0, -260, 0, -46], '#3A2A1A', 3); rel(g, [-7, -48, 7, -48, 7, 0, -7, 0], '#8A9E78', 1.6); rel(g, [-12, -30, 12, -30, 12, -24, -12, -24], RELH, 1.2);
    const body = [-44, 0, 44, 0, 56, 124, 30, 112, 0, 106, -30, 112, -56, 124]; g.save(); g.shadowColor = 'rgba(0,0,0,0.45)'; g.shadowBlur = 18; g.shadowOffsetX = 14; g.shadowOffsetY = 10; XY.path(g, body, true); g.fillStyle = '#5E7E66'; g.fill(); g.restore();
    rel(g, body, '#6E9076', 2); rel(g, [-11, 8, 11, 8, 13, 92, -13, 92], '#8EA684', 1.4);
    [-1, 1].forEach(sd => { for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) { const bx = sd * (20 + c * 10 + r * 1.5), by = 16 + r * 26; relC(g, bx, by, 4.2, RELH, 1.4); } groove(g, [sd * 16, 28, sd * (48 + 3), 30], 1.2); groove(g, [sd * 16, 54, sd * 50, 57], 1.2); });
    groove(g, [-30, 108, -14, 98, 0, 104, 14, 98, 30, 108], 1.6); g.restore(); };
  // Tang Seng's two attendants (从者): little cast figures with a lantern and the luggage pole
  const attendant = (g, x, y, face, step, lantern, fall) => { g.save(); g.translate(x, y); if (fall) g.rotate(face * fall * 1.6); g.scale(face * 1.2, 1.2);
    const st = step ? 1 : -1, up = fall > 0;
    rel(g, XY.RIG.capsule([-2, -42], [-8 * st, 0], 5, 4)); rel(g, XY.RIG.capsule([2, -42], [8 * st, 0], 5, 4));
    rel(g, [-12, -74, 12, -74, 17, -34, -17, -34]); groove(g, [-12, -50, 14, -50], 1.4);
    relC(g, 3, -86, 11, RELH); relC(g, -4, -100, 5, REL, 1.4); K.stroke(g, [7, -88, 10, -88], DK, 2.2);
    if (up) { rel(g, XY.RIG.capsule([8, -70], [20, -108], 4, 3.4)); rel(g, XY.RIG.capsule([-8, -70], [-18, -110], 4, 3.4)); }
    else if (lantern) { rel(g, XY.RIG.capsule([8, -70], [24, -56], 4, 3.4)); K.stroke(g, [24, -56, 26, -40], '#3A2A1A', 1.6); rel(g, [18, -40, 34, -40, 32, -20, 20, -20], '#C8A050', 1.4); }
    else { K.stroke(g, [-34, -84, 26, -70], 'rgba(6,10,8,0.6)', 7); K.stroke(g, [-34, -84, 26, -70], '#7A6A44', 5); relC(g, -32, -74, 13, '#7E8A62'); rel(g, XY.RIG.capsule([8, -70], [18, -74], 4, 3.4)); }
    g.restore(); };
  const lanternGlow = (g, x, y, a) => { g.save(); g.globalCompositeOperation = 'lighter'; const rg = g.createRadialGradient(x, y, 2, x, y, 90); rg.addColorStop(0, `rgba(255,200,110,${0.7 * a})`); rg.addColorStop(1, 'rgba(255,160,60,0)'); g.fillStyle = rg; g.fillRect(x - 90, y - 90, 180, 180); g.restore(); };

  // ------------------------------------------------------------ patina, the molten pour, the pen
  let TEX = null;
  const tex = W => { if (TEX && TEX.W === W) return TEX;
    const H = 780, w = Math.ceil(W / T), h = Math.ceil(H / T), crust = K.hex('#B8A47A'), mal = K.hex('#5EB282'), azu = K.hex('#4A7AAE'), cup = K.hex('#8E4630');
    const pat = K.pix(w, h, (i, j, o) => { const x = i * T, y = j * T, a = XY.fbm(x * 0.008, y * 0.008, 101, 4), b = XY.fbm(x * 0.016 + 9, y * 0.016, 103, 3), c = XY.fbm(x * 0.03, y * 0.03, 107, 2);
      let col = null, al = 0; if (a > 0.3) { col = crust; al = XY.clamp((a - 0.3) * 3) * 0.6; } else if (b > 0.36) { col = mal; al = XY.clamp((b - 0.36) * 4) * 0.55; } else if (c > 0.5) { col = azu; al = XY.clamp((c - 0.5) * 4) * 0.5; } else if (c < -0.52) { col = cup; al = XY.clamp((-c - 0.52) * 4) * 0.45; }
      if (!col) { o[3] = 0; return; } o[0] = col[0]; o[1] = col[1]; o[2] = col[2]; o[3] = al * 255; });
    // cooling order for the pour: edges first, then inward with a noisy front
    const ord = (x, y) => XY.clamp(Math.min(x, W - x, y * 1.3, (H - y) * 1.3) / 330 + 0.22 * XY.fbm(x * 0.01, y * 0.01, 111, 3));
    const hot = []; for (let q = 0; q < 6; q++) hot.push(K.pix(Math.ceil(W / 8), Math.ceil(H / 8), (i, j, o) => { const d = ord(i * 8, j * 8) - q / 6, v = XY.clamp(d * 7), core = XY.clamp(d * 3);
      o[0] = 240; o[1] = 70 + 120 * core; o[2] = 20 + 50 * core; o[3] = v * 220; }));
    return (TEX = { W, w, h, pat, hot }); };
  const COL = { horse: '#86885E', horse2: '#6C7050', mane: '#2E3A30', hoof: DK, saddle: '#5E6E50', red: CU, robe: '#A89A62', kasaya: CU, skin: '#B4A672', skin2: '#B4A672', face: '#B4A672', gold: '#D8C27A', metal: '#D8C27A', ink: DK };
  const PEN = { outline: '#1E2C24', ow: 1.6, wob: 0.4, seed: 9, color: r => COL[r] || REL };
  const actsAt = u => ({ monk: { palm: K.win(u, 0.4, 0.9, 0.05) } });
  const STAND = [[470, 1], [398, 0]];   // attendants wait here (x, has lantern)
  const OFFS = new Map();               // per cell: their offsets ahead of the procession so both are over the jaw on beat 2
  const offsets = c => { if (OFFS.has(c.n)) return OFFS.get(c.n); const p = XY.procWorldX(c.t0 + 0.4 * c.dur) - c.x, o = [892 - p, 800 - p]; OFFS.set(c.n, o); return o; };

  XY.STYLES.bronze = {
    bg(g, W, H) {
      const X = tex(W);
      g.fillStyle = '#0E0C0A'; g.fillRect(0, 0, W, 40);
      for (let k = 0; k < 4; k++) { const rg = g.createRadialGradient(200 + k * 260, 30, 2, 200 + k * 260, 30, 90); rg.addColorStop(0, 'rgba(90,80,70,0.25)'); rg.addColorStop(1, 'rgba(90,80,70,0)'); g.fillStyle = rg; g.fillRect(100 + k * 260, -60, 200, 120); }
      g.fillStyle = GND; g.fillRect(0, 40, W, H - 40);
      leiField(g, 0, 56, W, H, 1);
      rel(g, [0, 40, W, 40, W, 56, 0, 56], '#7E9A80', 2.4);
      rel(g, [0, 56, W, 56, W, 61, 0, 61], REL, 1.4); rel(g, [0, 143, W, 143, W, 149, 0, 149], REL, 1.4);
      for (let k = 0; k < 9; k++) kui(g, k * 148 - 40, 60, k % 2);
      // the inscription: a sunk panel with the cast title, the three demons' names and the count 六 in bronze script
      g.fillStyle = '#1E3026'; g.fillRect(52, 170, 240, 292); rel(g, [46, 164, 298, 164, 298, 170, 46, 170], REL, 1.6); rel(g, [46, 462, 298, 462, 298, 468, 46, 468], REL, 1.6);
      rel(g, [46, 164, 52, 164, 52, 468, 46, 468], REL, 1.6); rel(g, [292, 164, 298, 164, 298, 468, 292, 468], REL, 1.6);
      g.textBaseline = 'top'; g.textAlign = 'center';
      const cast = (str, x, y, px, fam, lead) => { g.font = XY.font(px, fam); [...str].forEach((ch, i) => { g.fillStyle = LIPC; g.fillText(ch, x + 1.6, y + i * px * lead + 1.6); g.fillStyle = '#0C1410'; g.fillText(ch, x, y + i * px * lead); }); };
      cast('落坑', 232, 182, 88, XY.cnFont.wei, 1.04); [['寅将军', 158], ['熊山君', 118], ['特处士', 78]].forEach(([s, x]) => cast(s, x, 186, 32, XY.cnFont.li, 1.1));
      g.textAlign = 'left'; [[64, 424, 86, 404, 108, 424], [74, 418, 68, 450], [98, 418, 104, 450]].forEach(P => groove(g, P, 4.4));
      // the mask is cast proud of the ground; a broad bulge of light shows its volume; heavy notched flanges on the vessel's corners
      DEPTH = 1.9; flange(g, CX, 160, 600); mask(g, 1); mask(g, -1); DEPTH = 1;
      g.save(); g.globalCompositeOperation = 'soft-light'; const vg = g.createRadialGradient(CX - 60, 330, 40, CX, 420, 420); vg.addColorStop(0, 'rgba(255,240,200,0.5)'); vg.addColorStop(0.6, 'rgba(120,120,100,0.05)'); vg.addColorStop(1, 'rgba(0,0,0,0.45)'); g.fillStyle = vg; g.fillRect(CX - 360, 150, 720, 560); g.restore();
      DEPTH = 2.2; [12, W - 12].forEach(x => { for (let y = 60; y < 700; y += 48) rel(g, [x - 13, y, x + 13, y, x + 13, y + 34, x + 5, y + 34, x + 5, y + 42, x - 5, y + 42, x - 5, y + 34, x - 13, y + 34], REL, 2.6); }); DEPTH = 1;
      // the ground band; under the mask it is the closed lower jaw with its teeth
      rel(g, [0, 700, W, 700, W, 712, 0, 712], '#7E9A80', 2.2);
      rel(g, [PX0 - 6, 712, PX1 + 6, 712, PX1 - 2, 778, PX0 + 2, 778], REL, 2); [36, 66, 92].forEach(dx => [-1, 1].forEach(s => rel(g, [CX + s * (dx - 12), 776, CX + s * (dx + 12), 776, CX + s * dx, 716], RELH, 1.4)));
      g.save(); g.beginPath(); g.rect(0, 40, W, H - 40); g.clip(); g.imageSmoothingQuality = 'high'; g.drawImage(X.pat, 0, 0, X.w * T, X.h * T); g.restore();
      K.specks(g, 7, 1400, 0, 40, W, H - 40, '#C8D2A8', 0.3, 1.2, 0.06, 0.22);
      g.save(); g.globalCompositeOperation = 'soft-light'; const lg = g.createRadialGradient(CX - 120, 300, 60, CX - 120, 380, 900); lg.addColorStop(0, 'rgba(255,236,180,0.55)'); lg.addColorStop(0.55, 'rgba(120,120,90,0.1)'); lg.addColorStop(1, 'rgba(0,0,0,0.6)');
      g.fillStyle = lg; g.fillRect(0, 40, W, H - 40); g.restore();
    },
    draw(g, e) {
      const { W, u, t, beat, S } = e, X = tex(W), acts = actsAt(u), off = offsets(e.cell);
      const open = XY.smooth(rev(u, 0.36, 0.04)) * (1 - XY.smooth(rev(u, 0.596, 0.012))), flash = K.win(u, 0.6, 0.76, 0.02), spin = XY.easeOut(rev(u, 0.6, 0.14));
      // the mask's living parts: cheek spirals turning, eyes watching (the attendants → down into the pit → the monk), dragons blinking
      [-1, 1].forEach(s => spiralDisc(g, CX + s * 230, 480, 44, s * (t * 0.7 + 7 * spin)));
      const look = u < 0.34 ? [-9, 2] : u < 0.6 ? [-3, 10] : [-12, 8], sleep = XY.smooth(rev(beat, 6.5, 0.6));
      [-1, 1].forEach(s => { const x = CX + s * 128 + look[0], y = 382 + look[1];
        g.fillStyle = DK; g.beginPath(); g.ellipse(x, y, 14, 23, 0, 0, TAU); g.fill(); g.fillStyle = CU; g.beginPath(); g.ellipse(x, y, 6.5, 14, 0, 0, TAU); g.fill();
        if (sleep > 0) { g.save(); g.beginPath(); g.ellipse(CX + s * 128, 382, 56, 31, 0, 0, TAU); g.clip(); g.fillStyle = RELH; g.fillRect(CX + s * 128 - 60, 350, 120, 64 * sleep); K.stroke(g, [CX + s * 128 - 54, 350 + 64 * sleep, CX + s * 128 + 54, 350 + 64 * sleep], DK, 3); g.restore(); }
        if (flash > 0) { g.save(); g.globalCompositeOperation = 'lighter'; const rg = g.createRadialGradient(x, y, 2, x, y, 60); rg.addColorStop(0, `rgba(255,120,60,${0.9 * flash})`); rg.addColorStop(1, 'rgba(255,80,30,0)'); g.fillStyle = rg; g.fillRect(x - 60, y - 60, 120, 120); g.restore(); } });
      for (let k = 0; k < 9; k++) if ((t * 0.35 + k * 0.37) % 1 < 0.05) { const ex = k * 148 - 40 + (k % 2 ? 120 : 28); K.stroke(g, [ex - 9, 100, ex + 9, 100], REL, 7); }
      // the pit: the lower jaw drops away on beat 2 and snaps shut on beat 3
      const oh = 78 * open;
      if (oh > 0.5) { g.save(); g.beginPath(); g.rect(0, 0, W, 780); g.clip(); const top = 702 - 74 * open;
        const cg = g.createLinearGradient(0, top, 0, 780); cg.addColorStop(0, '#05070A'); cg.addColorStop(1, '#3A120A'); g.fillStyle = cg; XY.path(g, [PX0 - 30, 702, PX0 + 10, top, PX1 - 10, top, PX1 + 30, 702, PX1 + 8, 790, PX0 - 8, 790], true); g.fill();
        rel(g, [PX0 - 6, 702 + oh, PX1 + 6, 702 + oh, PX1 - 2, 790 + oh, PX0 + 2, 790 + oh], REL, 2); [36, 66, 92].forEach(dx => [-1, 1].forEach(s => rel(g, [CX + s * (dx - 12), 708 + oh, CX + s * (dx + 12), 708 + oh, CX + s * dx, 702 + oh - 54 * open], RELH, 1.4)));
        rel(g, [PX0 + 6, top - 10, PX1 - 6, top - 10, PX1 - 10, top + 4, PX0 + 10, top + 4], REL, 2); [16, 44, 72].forEach(dx => [-1, 1].forEach(s => rel(g, [CX + s * (dx - 12), top + 2, CX + s * (dx + 12), top + 2, CX + s * dx, top + 2 + 50 * open], RELH, 1.4))); g.restore(); }
      // the attendants and the procession, cast in relief
      const [pc, pg] = K.layer('br-pr', e);
      STAND.forEach(([sx, lan], i) => { const xw = Math.max(sx, e.procX + off[i]), moving = e.procX + off[i] > sx, ft = Math.max(0, (u - 0.4) * e.cell.dur);
        const x0 = Math.max(sx, XY.procWorldX(e.cell.t0 + 0.4 * e.cell.dur) - e.cell.x + off[i]), x = u < 0.4 ? xw : x0 + 30 * ft, y = 702 + 560 * ft * ft;
        if (y > 900) return; pg.save(); if (u >= 0.4) { pg.beginPath(); pg.rect(0, 0, W, 702); pg.rect(PX0 - 10, 702, PX1 - PX0 + 20, 90 * open); pg.clip(); }
        attendant(pg, x, y, moving || u >= 0.4 ? 1 : -1, moving ? Math.floor(e.phase * 2 + i) % 2 : 0, lan, Math.min(1, ft * 2.5)); pg.restore();
        if (lan && u < 0.42) lanternGlow(g, x + (moving ? 28 : -28), y - 30, 0.8 + 0.2 * Math.sin(t * 9)); });
      XY.drawProcession(pg, e.phase, e.procX, e.groundY, PEN, acts);
      pg.save(); pg.setTransform(1, 0, 0, 1, 0, 0); pg.globalCompositeOperation = 'source-atop'; pg.globalAlpha = 0.6; pg.drawImage(X.pat, 0, 0, X.w * T * S, X.h * T * S); pg.restore();
      K.raised(g, e, pc, 2.2, 'rgba(230,236,200,0.55)', 'rgba(4,8,6,0.65)', 'br-pr');
      // the clang: rings off the jaw, verdigris shaken loose
      const ck = rev(u, 0.6, 0.12); if (ck > 0 && ck < 1) { for (let j = 0; j < 3; j++) { const r = 40 + 260 * XY.easeOut(XY.clamp(ck * 1.4 - j * 0.15)); g.strokeStyle = `rgba(220,230,190,${0.5 * (1 - ck)})`; g.lineWidth = 3; g.beginPath(); g.arc(CX, 704, r, Math.PI * 1.05, Math.PI * 1.95); g.stroke(); }
        for (let k = 0; k < 30; k++) { const fx = CX - 300 + 600 * XY.hash(k, 5), fy = 160 + 400 * XY.hash(k, 6) + 260 * ck * ck; g.fillStyle = `rgba(110,190,140,${0.8 * (1 - ck)})`; g.fillRect(fx, fy, 3, 3); } }
      // near: the chime bell swinging (it rings when the jaw shuts), firelight sliding over the bronze
      const kick = beat > 4.8 ? Math.exp(-(beat - 4.8) * 2.2) * Math.sin((beat - 4.8) * 9) : 0;
      jinxing(g, 404, 452, XY.smooth(rev(beat, 5.6, 0.9)), K.win(beat, 6.1, 7.6, 0.25), t);
      bell(g, 436, 54, 0.045 * Math.sin(t * 2.1) + 0.22 * kick);
      const sx = ((t * 130) % 1900) - 360; g.save(); g.globalCompositeOperation = 'soft-light'; const sg = g.createLinearGradient(sx - 160, 0, sx + 160, 0); sg.addColorStop(0, 'rgba(255,240,200,0)'); sg.addColorStop(0.5, 'rgba(255,240,200,0.45)'); sg.addColorStop(1, 'rgba(255,240,200,0)'); g.fillStyle = sg; g.fillRect(0, 40, W, 740); g.restore();
      // the pour: the vessel glows molten as it comes into view and cools from the edges inward
      const Q = rev(u, -0.34, 0.48) * 6; if (Q < 6) { const k = Math.floor(Q), f = Q - k; g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.imageSmoothingQuality = 'high';
        const dw = X.hot[0].width * 8 * S, dh = X.hot[0].height * 8 * S; g.globalAlpha = 1 - f; g.drawImage(X.hot[k], 0, 0, dw, dh); if (k < 5) { g.globalAlpha = f; g.drawImage(X.hot[k + 1], 0, 0, dw, dh); }
        g.globalCompositeOperation = 'lighter'; g.globalAlpha = 0.35 * (1 - f); g.drawImage(X.hot[k], 0, 0, dw, dh); g.restore(); }
    },
    hits: [3.2, 4.8, 6.4],
    post(canvas, g, e) { K.zoom(canvas, g, e, Math.max(K.push(e.beat, 4.3, 4.8, 6.0, 0.16), K.push(e.beat, 2.9, 3.2, 4.0, 0.06)), CX, 640); },
  };
})();
