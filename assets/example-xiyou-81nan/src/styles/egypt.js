// 04 古埃及墓画 · 寻亲报冤 (v10) — the story told in the program of an Egyptian tomb wall (registers, profile with frontal
// eye, frontal shoulders, flat colour inside a black line, a cartouche holding the name), but every figure and object is
// from the novel. Top: 江流 kneels at the 江州 gate holding up his mother's blood letter and she knows him; by the river
// 殷开山 beheads 刘洪 before 陈光蕊's spirit tablet. Middle: the golden carp 陈光蕊 once set free — the 洪江 Dragon King —
// leaps the register line and drops the 定颜珠 on his body; he sits up alive; 玄奘 licks his blind grandmother's eyes open.
// Bottom: Tang Seng rides past 殷开山's army marching on 江州 under the 「殷」 banner. Figures paint themselves in as the
// Egyptian crews did: red sketch, black master line, flat colour.
(() => {
  'use strict';
  const XY = window.XY, K = XY.KIT_A, TAU = XY.TAU;
  const INK = '#1E1814', RED = '#B03A2A', BLU = '#2A5AA8', GRN = '#2E8A5A', YEL = '#E0B040', WHT = '#F4EEDE', SKM = '#B0603A', SKF = '#E2B278', GOLD = '#E8A830';
  const R1 = 248, R2 = 408, T = 3, NB = 8;
  const rev = (x, a, d) => XY.clamp((x - a) / d);

  // ------------------------------------------------------------ plaster
  let TEX = null;
  const tex = W => {
    if (TEX && TEX.W === W) return TEX;
    const H = 780, w = Math.ceil(W / T), h = Math.ceil(H / T), A = K.hex('#ECE0C4'), B = K.hex('#D2C098'), M = K.hex('#8A6A48');
    const c = K.pix(w, h, (i, j, o) => { const x = i * T, y = j * T; let c = K.mixc(B, A, XY.clamp(0.6 + 0.8 * XY.fbm(x * 0.006, y * 0.006, 81, 4)));
      const loss = XY.fbm(x * 0.01 + 4, y * 0.01, 87, 3); if (loss > 0.55) c = K.mixc(c, M, XY.clamp((loss - 0.55) * 8) * 0.8);
      const m = 1 + 0.03 * XY.noise2(x * 0.1, y * 0.1, 83); o[0] = c[0] * m; o[1] = c[1] * m; o[2] = c[2] * m; });
    return (TEX = { W, w, h, c });
  };

  // ------------------------------------------------------------ painting in stages: PF ∈ [0,1] is the current figure's progress
  let PF = 1;
  const close = pts => pts.concat([pts[0], pts[1]]);
  const sh = (g, pts, fill, lw = 2.2, closed = true) => {
    if (PF <= 0) return; const P = closed ? close(pts) : pts;
    if (PF < 0.4) { K.stroke(g, K.partial(P, PF / 0.4), 'rgba(190,60,36,0.85)', 1.5); return; }
    if (PF >= 0.62 && fill && closed) { XY.path(g, pts, true); g.fillStyle = fill; g.globalAlpha = XY.clamp((PF - 0.62) / 0.1); g.fill(); g.globalAlpha = 1; }
    if (PF < 0.62) K.stroke(g, P, 'rgba(190,60,36,0.55)', 1.2);
    K.stroke(g, K.partial(P, (PF - 0.4) / 0.22), INK, lw);
  };
  const dot = (g, x, y, r, col) => { if (PF < 0.62) return; g.fillStyle = col; g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill(); };
  const caps = (a, b, r1, r2) => XY.RIG.capsule(a, b, r1, r2, 5);
  const eye = (g, x, y, s = 1, open = 1) => { if (PF < 0.5) return;
    g.save(); g.translate(x, y); g.scale(s, s);
    if (open > 0.15) { g.fillStyle = WHT; g.beginPath(); g.moveTo(-5, 0); g.quadraticCurveTo(0, -3.4 * open, 5, -0.4); g.quadraticCurveTo(0, 2.6 * open, -5, 0); g.fill(); g.fillStyle = INK; g.beginPath(); g.arc(0.6, -0.4, 2.1 * open, 0, TAU); g.fill(); }
    K.stroke(g, [-5, 0, -1, -2.6 * open, 5, -0.6, 8, -1.6], INK, 1.5); K.stroke(g, [-5, 0, -11, 1.4], INK, 1.6); K.stroke(g, [-6, -6, 0, -7.4, 6, -5.6], INK, 1.4);
    g.restore(); };

  // ------------------------------------------------------------ a figure in the Egyptian program, dressed from the novel (facing +x; feet at 0; ~150 tall)
  // o.head 'bun' | 'futou' | 'helmet' | 'bald' | 'scarf'; o.dress 'robe' | 'skirt' | 'armor' | 'kasaya' | 'tunic'; o.kneel; o.aB/aF [shoulder, elbow]; o.cloth colour
  const armPts = (S, a) => { const E = [S[0] + Math.sin(a[0]) * 26, S[1] + Math.cos(a[0]) * 26], H = [E[0] + Math.sin(a[0] + a[1]) * 24, E[1] + Math.cos(a[0] + a[1]) * 24]; return [S, E, H]; };
  const figure = (g, x, y, s, flip, o) => {
    g.save(); g.translate(x, y); if (o.rot) g.rotate(o.rot); g.scale(flip ? -s : s, s); g.lineJoin = 'round';
    const kn = o.kneel ? 1 : 0, dy = 30 * kn, sh0 = -112 + dy, wa = -82 + dy, hip = -62 + dy, hd = [9, -133 + dy], skin = o.skin || SKM, cl = o.cloth || WHT, long = o.dress === 'robe' || o.dress === 'skirt' || o.dress === 'kasaya';
    const SB = [-11, sh0 + 3], SF = [17, sh0 + 3], AB = armPts(SB, o.aB || [0.1, 0.1]), AF = armPts(SF, o.aF || [0.15, 0.1]);
    const arm = A => { if (long || o.dress === 'armor') { sh(g, caps(A[0], A[1], 6, 5.4), cl); sh(g, [A[1][0] - 6, A[1][1], A[1][0] + 6, A[1][1], A[2][0] + 7, A[2][1] - 2, A[2][0] - 7, A[2][1] - 2], cl, 1.8); }
      else { sh(g, caps(A[0], A[1], 4.6, 4), skin); sh(g, caps(A[1], A[2], 4, 3.4), skin); } sh(g, XY.ellipse(A[2][0], A[2][1], 4.6, 4, 10), skin); };
    arm(AB);
    if (long) { if (kn) sh(g, [-16, sh0 + 6, 20, sh0 + 6, 30, hip + 6, 40, -2, -20, -2, -22, hip + 10], cl);
      else sh(g, [-15, sh0, 21, sh0, 22, -40, 30, -4, -22, -4, -16, -40], cl);
      sh(g, [26, 0, 40, 0, 38, -6, 24, -6], INK, 1.2); if (!kn) sh(g, [-20, 0, -8, 0, -9, -6, -21, -6], INK, 1.2);
      if (o.dress === 'skirt') { sh(g, [-14, sh0 + 22, 20, sh0 + 22, 20, sh0 + 28, -14, sh0 + 28], RED, 1.4); K.stroke(g, PF > 0.62 ? [-4, sh0 + 30, 2, -50, -2, -20] : [], 'rgba(30,24,20,0.4)', 1.1); }
      if (o.dress === 'kasaya') { sh(g, [-15, sh0, 4, sh0, 22, wa + 30, 10, wa + 40], RED, 1.6); if (PF > 0.7) for (let k = 0; k < 3; k++) K.stroke(g, [-10 + k * 9, sh0 + 6 + k * 14, 16, wa + 18 + k * 10], YEL, 1.4); }
      if (o.dress === 'robe') sh(g, [-15, wa - 2, 21, wa - 2, 21, wa + 4, -15, wa + 4], o.belt || RED, 1.2); }
    else { if (kn) { sh(g, caps([0, hip], [-18, -6], 7, 5), skin); sh(g, caps([6, hip], [26, hip + 4], 8, 6), skin); sh(g, caps([26, hip + 4], [24, -4], 6, 4.6), skin); }
      else { const k = o.step ? 0.45 : 1; sh(g, caps([-2, hip], [-14 * k, -6], 7, 4.6), o.dress === 'armor' ? INK : skin); sh(g, caps([6, hip], [6 + 10 * k, -6], 7, 4.6), o.dress === 'armor' ? INK : skin);
        sh(g, [-22 * k, 0, -16 * k, -8, -8 * k, -6, -2 * k, 0], INK, 1.2); sh(g, [10 * k, 0, 4 + 10 * k, -8, 12 + 10 * k, -6, 22 + 10 * k, 0], INK, 1.2); }
      sh(g, [-15, sh0, 21, sh0, 13, wa, -6, wa], o.dress === 'armor' ? '#8E6A3A' : cl);
      if (o.dress === 'armor') { if (PF > 0.7) for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) K.stroke(g, [-10 + c * 8, sh0 + 8 + r * 8, -6 + c * 8, sh0 + 12 + r * 8, -2 + c * 8, sh0 + 8 + r * 8], INK, 1);
        sh(g, [-10, wa - 2, 16, wa - 2, 22, hip + 18, -14, hip + 18], RED, 1.6); sh(g, [-12, wa - 4, 18, wa - 4, 18, wa + 2, -12, wa + 2], YEL, 1.2); }
      else sh(g, [-8, wa - 2, 14, wa - 2, 22, hip + 16, -11, hip + 16], cl); }
    const H = (lx, ly) => [hd[0] + lx, hd[1] + ly];
    sh(g, [...H(-9, -2), ...H(-6, -11), ...H(6, -11), ...H(10, -5), ...H(14, 0), ...H(11, 2), ...H(12, 5), ...H(8, 10), ...H(0, 9), ...H(4, 15), ...H(-4, 15)], skin);
    if (o.head === 'bun') { sh(g, [...H(8, -10), ...H(0, -15), ...H(-12, -8), ...H(-12, 6), ...H(-4, 6), ...H(-2, -4), ...H(6, -6)], INK); sh(g, XY.ellipse(...H(-4, -24), 9, 12, 14), INK); sh(g, [...H(-14, -26), ...H(8, -28), ...H(8, -25), ...H(-14, -23)], GOLD, 1.2); }
    else if (o.head === 'futou') { sh(g, [...H(8, -8), ...H(4, -18), ...H(-10, -18), ...H(-12, -4), ...H(-2, -4)], INK); sh(g, [...H(-10, -12), ...H(-28, -6), ...H(-28, -2), ...H(-10, -8)], INK, 1.2); }
    else if (o.head === 'helmet') { sh(g, [...H(12, -6), ...H(8, -18), ...H(-4, -22), ...H(-14, -14), ...H(-16, 8), ...H(-6, 8), ...H(-4, -4), ...H(10, -4)], '#8E6A3A'); sh(g, [...H(-2, -22), ...H(2, -34), ...H(6, -22)], RED, 1.2); }
    else if (o.head === 'scarf') sh(g, [...H(8, -8), ...H(0, -14), ...H(-12, -8), ...H(-14, 4), ...H(-22, 10), ...H(-10, 2), ...H(4, -4)], o.scarf || BLU);
    else if (o.head === 'white') sh(g, [...H(8, -10), ...H(0, -15), ...H(-12, -8), ...H(-12, 10), ...H(-4, 8), ...H(-2, -4), ...H(6, -6)], '#E8E4DC');
    eye(g, ...H(5, -3), 0.8, o.eyeOpen == null ? 1 : o.eyeOpen);
    arm(AF);
    if (o.hold) o.hold(g, AB[2], AF[2]);
    g.restore();
  };

  // ------------------------------------------------------------ writing, buildings, objects
  // Chinese characters set in columns the way hieroglyphs are painted: each sign flat-coloured inside a black line
  const charCol = (g, x, y0, str, px, seed = 0) => { if (PF < 0.4) return; g.font = XY.font(px, XY.cnFont.li); g.textAlign = 'center'; g.textBaseline = 'top'; g.lineJoin = 'round';
    [...str].forEach((ch, i) => { const y = y0 + i * px * 1.06; if (PF >= 0.62) { g.globalAlpha = XY.clamp((PF - 0.62) / 0.1); g.fillStyle = [BLU, GRN, RED, YEL][(i + seed) % 4]; g.fillText(ch, x, y); g.globalAlpha = 1; }
      g.strokeStyle = PF < 0.62 ? 'rgba(190,60,36,0.8)' : INK; g.lineWidth = 1.3; g.strokeText(ch, x, y); }); g.textAlign = 'left'; };
  const cartouche = (g, x, y, str) => { sh(g, XY.ellipse(x, y, 30, 74, 30), WHT, 3); if (PF > 0.62) { K.stroke(g, [x - 22, y + 82, x + 22, y + 82], INK, 3.5);
    g.fillStyle = BLU; g.font = XY.font(46, XY.cnFont.li); g.textAlign = 'center'; g.textBaseline = 'middle'; g.globalAlpha = XY.clamp((PF - 0.62) / 0.1); g.fillText(str[0], x, y - 26); g.fillText(str[1], x, y + 28); g.globalAlpha = 1; g.textAlign = 'left'; } };
  // the gate of the 江州 house: red posts, lintel, a tiled roof with upturned eaves
  const gateHouse = (g, x0, x1, top, base) => { sh(g, [x0 + 6, base, x0 + 6, top + 26, x0 + 18, top + 26, x0 + 18, base], RED); sh(g, [x1 - 18, base, x1 - 18, top + 26, x1 - 6, top + 26, x1 - 6, base], RED);
    sh(g, [x0, top + 20, x1, top + 20, x1, top + 30, x0, top + 30], YEL, 1.6); sh(g, [x0 - 22, top + 22, x0 + 6, top + 2, x1 - 6, top + 2, x1 + 22, top + 22, x1 + 8, top + 14, x0 - 8, top + 14], GRN, 1.8);
    if (PF > 0.7) for (let x = x0; x < x1; x += 10) K.stroke(g, [x, top + 4, x - 3, top + 16], INK, 1); sh(g, [x0 + 18, base, x0 + 18, top + 32, x0 + 40, top + 40, x0 + 40, base], '#7A4A26', 1.4); };
  // 陈光蕊's spirit tablet on the offering table, an incense burner, a bowl for the heart
  const altar = (g, x, y) => { sh(g, [x - 46, y, x - 40, y - 52, x + 40, y - 52, x + 46, y], RED); sh(g, [x - 52, y - 52, x + 52, y - 52, x + 52, y - 60, x - 52, y - 60], YEL, 1.6);
    sh(g, [x - 14, y - 60, x - 14, y - 142, x + 14, y - 142, x + 14, y - 60], YEL); sh(g, [x - 18, y - 142, x + 18, y - 142, x + 12, y - 152, x - 12, y - 152], RED, 1.4);
    if (PF > 0.62) { g.fillStyle = INK; g.font = XY.font(14, XY.cnFont.li); g.textAlign = 'center'; g.textBaseline = 'top'; K.vtext(g, '陈光蕊之位', x, y - 138, 14, 1.12); g.textAlign = 'left'; }
    sh(g, [x + 22, y - 60, x + 26, y - 74, x + 44, y - 74, x + 48, y - 60], '#8E6A3A', 1.4); sh(g, [x - 48, y - 60, x - 44, y - 70, x - 26, y - 70, x - 22, y - 60], BLU, 1.4); };
  const sabre = (g, H, ang) => { g.save(); g.translate(H[0], H[1]); g.rotate(ang); sh(g, [0, -3, 20, -3, 20, 3, 0, 3], INK, 1.2); sh(g, [18, -7, 24, -7, 24, 7, 18, 7], YEL, 1.2);
    sh(g, [24, -5, 86, -9, 100, -2, 86, 6, 24, 4], '#C8CED6', 1.6); g.restore(); };
  // the golden carp — the 洪江 Dragon King 陈光蕊 once bought from a fisherman and set free
  const carp = (g, x, y, a, s, t) => { g.save(); g.translate(x, y); g.rotate(a); g.scale(s, s); const sw = 0.25 * Math.sin(t * 14);
    g.save(); g.translate(-58, 0); g.rotate(sw); sh(g, [0, 0, -40, -34, -30, 0, -40, 34], RED, 2); g.restore();
    sh(g, [-10, -24, 10, -48, 30, -26], RED, 1.6); sh(g, [0, 22, 14, 42, 24, 22], RED, 1.6);
    sh(g, [-60, 0, -30, -26, 20, -32, 54, -18, 66, 0, 54, 16, 20, 30, -30, 24], GOLD, 2.4);
    if (PF > 0.7) for (let r = -1; r <= 1; r++) for (let c = 0; c < 6; c++) { g.strokeStyle = 'rgba(30,24,20,0.6)'; g.lineWidth = 1.3; g.beginPath(); g.arc(-34 + c * 13, r * 12, 7, -Math.PI * 0.45, Math.PI * 0.45); g.stroke(); }
    K.stroke(g, [40, -24, 44, 0, 40, 18], INK, 1.6); eye(g, 50, -8, 0.7); K.stroke(g, [64, 4, 78, 14, 84, 6], INK, 2); K.stroke(g, [62, 8, 72, 22], INK, 2);
    g.restore(); };
  // 江州's city gate, small in the back row: rammed-earth wall with an arch, a red-columned tower under a green roof
  const cityGate = (g, x0, x1, base, top) => { sh(g, [x0, base, x0 + 8, top + 40, x1 - 8, top + 40, x1, base], '#D8B878'); sh(g, [(x0 + x1) / 2 - 20, base, (x0 + x1) / 2 - 20, base - 40, (x0 + x1) / 2, base - 56, (x0 + x1) / 2 + 20, base - 40, (x0 + x1) / 2 + 20, base], '#5A3E28', 1.6);
    for (let x = x0 + 12; x < x1 - 8; x += 16) sh(g, [x, top + 40, x, top + 32, x + 9, top + 32, x + 9, top + 40], '#D8B878', 1.2);
    const cx = (x0 + x1) / 2; [-34, -12, 12, 34].forEach(dx => sh(g, [cx + dx - 3, top + 32, cx + dx - 3, top + 12, cx + dx + 3, top + 12, cx + dx + 3, top + 32], RED, 1.1));
    sh(g, [cx - 64, top + 14, cx - 40, top - 4, cx + 40, top - 4, cx + 64, top + 14, cx + 48, top + 8, cx - 48, top + 8], GRN, 1.6); };
  const reeds = (g, x0, n, base, t) => { for (let k = 0; k < n; k++) { const x = x0 + k * 13 + 6 * XY.hash(k, 1), top = base - 70 - 30 * XY.hash(k, 2), sw = (K.step(t + k * 0.07, 3) % 2) ? 2 : -2;
    sh(g, [x, base, x + sw, top], null, 2, false); sh(g, XY.ellipse(x + sw, top - 6, 3.4, 9, 8), '#8E5A2E', 1); } };
  const COL = { horse: '#8E4E2C', horse2: '#6E3A20', mane: INK, hoof: INK, saddle: BLU, red: RED, robe: YEL, kasaya: RED, skin: SKM, skin2: SKM, face: SKM, gold: YEL, metal: YEL, ink: INK };
  const PEN = { outline: INK, ow: 2, color: r => COL[r] || INK,
    part(ctx, p) { if (p.role === 'ink' && p.k === 'poly' && p.pts.length === 20) { let cx = 0, cy = 0; for (let k = 0; k < 20; k += 2) { cx += p.pts[k]; cy += p.pts[k + 1]; } eye(ctx, cx / 10, cy / 10, 0.6); return true; } return false; } };
  const actsAt = b => ({ monk: { palm: K.win(b, 3.8, 6.6, 0.3) } });
  const heart = (g, x, y, s = 1) => { g.save(); g.translate(x, y); g.scale(s, s); sh(g, [-7, -14, 7, -14, 9, -6, 6, 4, 0, 8, -6, 4, -9, -6], RED, 1.8); sh(g, [-5, -18, 5, -18, 5, -14, -5, -14], RED, 1.2); g.restore(); };
  const splash = (g, x, y, q, n = 14) => { if (q <= 0 || q >= 1) return; for (let k = 0; k < n; k++) { const a = -Math.PI * (0.15 + 0.7 * XY.hash(k, 3)), v = 50 + 90 * XY.hash(k, 4), px = x + Math.cos(a) * v * q, py = y + Math.sin(a) * v * q + 160 * q * q;
    g.fillStyle = WHT; g.strokeStyle = BLU; g.lineWidth = 1.4; g.beginPath(); g.ellipse(px, py, 4, 6, a, 0, TAU); g.fill(); g.stroke(); } };

  XY.STYLES.egypt = {
    hits: [4, 5],
    bg(g, W, H) {
      const X = tex(W); g.imageSmoothingQuality = 'high'; g.drawImage(X.c, 0, 0, X.w * T, X.h * T);
      K.specks(g, 41, 1800, 0, 0, W, H, '#7A5A3A', 0.4, 1.5, 0.08, 0.3);
      g.strokeStyle = 'rgba(176,58,42,0.1)'; g.lineWidth = 1; for (let x = 0; x < W; x += 24) { g.beginPath(); g.moveTo(x, 70); g.lineTo(x, 702); g.stroke(); } for (let y = 70; y < 702; y += 24) { g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke(); }
      g.fillStyle = '#1C2C58'; g.fillRect(0, 0, W, 28);
      for (let x = 14; x < W; x += 34) { const y = 10 + (Math.round(x / 34) % 2) * 8; g.fillStyle = YEL; g.beginPath(); for (let k = 0; k < 10; k++) { const a = -Math.PI / 2 + k * Math.PI / 5, r = k % 2 ? 2.4 : 6; g.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r); } g.fill(); }
      for (let x = 0; x < W; x += 18) { const c = [RED, GRN, BLU][Math.round(x / 18) % 3]; XY.path(g, [x + 2, 62, x + 2, 40, x + 9, 30, x + 16, 40, x + 16, 62], true); g.fillStyle = c; g.fill(); g.strokeStyle = INK; g.lineWidth = 1.4; g.stroke(); g.fillStyle = WHT; g.fillRect(x + 6, 44, 6, 4); g.fillRect(x + 6, 52, 6, 3); }
      for (let x = 0; x < W; x += 20) { g.fillStyle = [RED, BLU, GRN, YEL][Math.round(x / 20) % 4]; g.fillRect(x + 1, 62, 18, 8); }
      [[R1, 8], [R2, 8]].forEach(([y, h]) => { g.fillStyle = INK; g.fillRect(0, y, W, 3); for (let x = 0; x < W; x += 20) { g.fillStyle = [RED, BLU, GRN, YEL][Math.round(x / 20) % 4]; g.fillRect(x + 1, y + 3, 18, h - 3); } });
      g.fillStyle = INK; g.fillRect(0, 700, W, 5); g.fillStyle = YEL; g.fillRect(0, 705, W, 22); g.fillStyle = RED; g.fillRect(0, 727, W, 9); g.fillStyle = INK; g.fillRect(0, 736, W, 4);
      for (let x = 0; x < W; x += 30) { g.fillStyle = BLU; g.fillRect(x + 2, 744, 12, 30); g.fillStyle = GRN; g.fillRect(x + 16, 744, 12, 30); }
      g.fillStyle = INK; g.fillRect(150, 559, W - 150, 2);   // the back-row ground line in the bottom register
    },
    draw(g, e) {
      const { W, t } = e, b = e.beat, acts = actsAt(b);
      // ---- top, left: at the 江州 gate the son kneels with the blood letter; his mother knows him and weeps
      PF = rev(b, -1.4, 1.8);
      cartouche(g, 74, 160, '寻亲'); gateHouse(g, 132, 256, 92, R1);
      const unroll = XY.smooth(rev(b, 1.0, 1.3)), know = XY.smooth(rev(b, 2.4, 0.4));
      figure(g, 198, R1, 1.0, false, { head: 'bun', skin: SKF, dress: 'skirt', cloth: '#F2E8D4', aB: [0.5 + 2.1 * know, 0.3 - 0.3 * know], aF: [1.15 + 1.4 * know, 0.2] });
      if (know > 0.5) for (let k = 0; k < 3; k++) { const q = ((t * 1.3 + k / 3) % 1); dot(g, 212 - 2 * k, R1 - 136 + 46 * q, 2.6 * (1 - q * 0.5), BLU); }
      figure(g, 338, R1, 1.0, true, { head: 'bald', skin: SKM, dress: 'kasaya', cloth: YEL, kneel: true, aB: [1.25, 0.3], aF: [1.05, 0.45], hold: (g2, hb, hf) => {
        const ln = 18 + 64 * unroll; sh(g2, [hf[0] - 2, hf[1] - 12, hf[0] + ln, hf[1] - 16, hf[0] + ln, hf[1] + 8, hf[0] - 2, hf[1] + 10], '#F2E6C4', 1.6);
        if (PF > 0.7 && unroll > 0.6) { g2.save(); g2.translate(hf[0] + 14 + ln * 0.5, hf[1] - 3); g2.scale(-1, 1); g2.fillStyle = '#A8241A'; g2.font = XY.font(16, XY.cnFont.kai, 'bold'); g2.textAlign = 'center'; g2.textBaseline = 'middle'; g2.fillText('血书', 0, 0); g2.restore(); } } });
      charCol(g, 410, 96, '十八年', 30, 0); charCol(g, 446, 96, '血书为证', 30, 1);
      // ---- top, right: by the river 殷开山 cuts down 刘洪 before 陈光蕊's spirit tablet; the heart goes to the altar
      PF = rev(b, -0.8, 1.8);
      altar(g, 548, R1);
      const settle = XY.smooth(rev(b, 5.0, 0.9)), raise = XY.smooth(rev(b, 2.7, 0.7)) * (1 - settle), swing = XY.easeIn(rev(b, 3.82, 0.18)) * (1 - settle), fall = XY.smooth(rev(b, 4.0, 0.35)), hq = XY.smooth(rev(b, 4.05, 0.75));
      figure(g, 704, R1, 1.0, true, { head: 'scarf', scarf: '#5A6A3A', skin: SKM, dress: 'tunic', cloth: '#C8B890', kneel: true, aB: [-0.7, -0.6], aF: [-0.5, -0.8], rot: -1.3 * fall });
      if (fall < 0.4) K.stroke(g, [716, R1 - 68, 728, R1 - 62, 722, R1 - 56], '#C8A060', 2.4);
      if (b > 4.05) heart(g, XY.lerp(690, 592, hq), XY.lerp(R1 - 84, R1 - 74, hq) - 70 * Math.sin(Math.PI * hq), 1.4);
      figure(g, 790, R1, 1.05, true, { head: 'helmet', skin: SKM, dress: 'armor', aF: [1.45, 0.55], aB: [XY.lerp(XY.lerp(0.4, 2.95, raise), 1.55, swing), XY.lerp(0.3, 0.5, raise)], hold: (g2, hb) => sabre(g2, hb, XY.lerp(XY.lerp(0.5, -2.1, raise), -0.3, swing)) });
      [866, 926].forEach((x, k) => figure(g, x, R1, 0.95, true, { head: 'helmet', skin: SKM, dress: 'armor', aF: [0.8, -0.9], aB: [0.2, 0.2], hold: (g2, hb, hf) => { sh(g2, [hf[0] - 1.5, hf[1] + 30, hf[0] - 1.5, hf[1] - 104, hf[0] + 1.5, hf[1] - 104, hf[0] + 1.5, hf[1] + 30], '#8E5A2E', 1); sh(g2, [hf[0], hf[1] - 118, hf[0] - 5, hf[1] - 104, hf[0] + 5, hf[1] - 104], '#C8CED6', 1.2); dot(g2, hf[0], hf[1] - 100, 4, RED); } }));
      const fl = K.hit(b, 4, 0.6); if (fl > 0) { g.save(); g.globalCompositeOperation = 'lighter'; const rg = g.createRadialGradient(700, R1 - 70, 4, 700, R1 - 70, 120); rg.addColorStop(0, `rgba(255,90,60,${0.8 * fl})`); rg.addColorStop(1, 'rgba(255,60,30,0)'); g.fillStyle = rg; g.fillRect(580, R1 - 190, 240, 240); g.restore(); }
      charCol(g, 996, 132, '殷开山', 30, 2); charCol(g, 1032, 132, '擒刘洪', 30, 3); charCol(g, 1068, 132, '祭光蕊', 30, 0);
      g.fillStyle = YEL; g.fillRect(1086, 82, 60, 42); g.strokeStyle = INK; g.lineWidth = 2; g.strokeRect(1086, 82, 60, 42); [1098, 1110, 1122, 1134].forEach(x => K.stroke(g, [x, 90, x, 116], RED, 5));
      // ---- middle: the river; the golden carp leaps the register line and drops the 定颜珠; 陈光蕊 rises; the grandmother sees again
      PF = rev(b, -0.2, 1.8);
      for (let x = 40; x < 600; x += 20) { const s = (K.step(t, 4) % 2) * 10; g.fillStyle = BLU; g.fillRect(x, 368, 20, 38); K.stroke(g, [x, 380, x + 5, 374, x + 10, 380, x + 15, 374, x + 20, 380], INK, 1.2); K.stroke(g, [x + (s ? 10 : 0), 394, x + 5 + (s ? 10 : 0), 388, x + 10 + (s ? 10 : 0), 394], INK, 1.2); }
      reeds(g, 600, 6, R2, t);
      const cq = rev(b, 4.5, 1.0), sit = XY.smooth(rev(b, 5.35, 0.7));
      if (b > 3.4 && cq <= 0) for (let k = 0; k < 4; k++) dot(g, 180 + ((t * 70 + k * 40) % 200), 384 + 8 * Math.sin(t * 3 + k), 3, GOLD);
      figure(g, 724, R2, 0.95, false, { head: 'futou', skin: SKM, dress: 'robe', cloth: '#E8D8B0', rot: -1.45 * (1 - sit), aF: [0.4 + 1.6 * sit, 0.2], aB: [0.2, 0.2] });
      if (cq > 0 && cq < 1) { const a = (1 - cq) * (1 - cq), m = 2 * (1 - cq) * cq, z = cq * cq, x = a * 250 + m * 400 + z * 560, y = a * 420 + m * 90 + z * 420, d = Math.atan2((m * 0 + 2 * (1 - cq) * (90 - 420) + 2 * cq * (420 - 90)), 2 * (1 - cq) * 150 + 2 * cq * 160);
        carp(g, x, y, d, 1.3, t); }
      splash(g, 260, 404, rev(b, 4.5, 0.6)); splash(g, 556, 404, rev(b, 5.5, 0.6));
      if (b > 4.95) { const pq = XY.smooth(rev(b, 5.0, 0.35)), px = b < 5.35 ? XY.lerp(400, 600, pq) : XY.lerp(600, 720 + 14, sit), py = b < 5.35 ? XY.lerp(240, 394, pq) : XY.lerp(394, R2 - 128, sit);
        g.save(); g.globalCompositeOperation = 'lighter'; const rg = g.createRadialGradient(px, py, 1, px, py, 30 + 20 * sit); rg.addColorStop(0, 'rgba(220,240,255,0.85)'); rg.addColorStop(1, 'rgba(160,200,255,0)'); g.fillStyle = rg; g.fillRect(px - 50, py - 50, 100, 100); g.restore(); dot(g, px, py, 6, '#EAF4FF'); }
      const lick = K.win(b, 5.5, 6.1, 0.15), opened = XY.smooth(rev(b, 6.0, 0.3));
      sh(g, [906, R2, 906, 372, 960, 372, 964, R2], '#8E5A2E', 1.6);
      figure(g, 938, R2 + 4, 0.95, true, { head: 'white', skin: SKF, dress: 'skirt', cloth: '#C8D8E8', kneel: true, eyeOpen: opened, aF: [1.2 + 0.5 * opened, 0.2] });
      figure(g, 846 + 8 * lick, R2, 0.9, false, { head: 'bald', skin: SKM, dress: 'kasaya', cloth: YEL, rot: 0.18 * lick, aF: [1.0, 0.4] });
      if (opened > 0) for (let k = 0; k < 6; k++) { const a = -Math.PI * 0.9 + k * 0.32, r0 = 14, r1 = 14 + 16 * opened; K.stroke(g, [912 + Math.cos(a) * r0, R2 - 102 + Math.sin(a) * r0, 912 + Math.cos(a) * r1, R2 - 102 + Math.sin(a) * r1], YEL, 2.4); }
      charCol(g, 1010, 270, '外婆', 28, 1); charCol(g, 1046, 270, '舔目', 28, 2); charCol(g, 1082, 270, '复明', 28, 3);
      // ---- bottom: the back row — reeds with startled birds, 殷开山's army under the 「殷」 banner, 江州's gate — and Tang Seng in front
      PF = rev(b, -3.6, 1.8);
      reeds(g, 30, 9, 559, t);
      for (let k = 0; k < 3; k++) { const q = ((t * 0.45 + k * 0.33) % 1), bx = 120 + 330 * q + 40 * k, by = 520 - 80 * q - 20 * Math.sin(q * 6 + k), f = K.step(t + k * 0.1, 8) % 2;
        sh(g, [bx - 12, by, bx, by - 5, bx + 14, by - 2, bx + 2, by + 4], '#5E6E8E', 1.4); sh(g, [bx - 2, by - 2, bx - 10, by - (f ? 18 : -10), bx + 6, by - 2], '#8EA0C0', 1.2); }
      cityGate(g, 978, 1150, 559, 436);
      for (let k = 0; k < 6; k++) { const x = 190 + k * 56 + 22 * e.lt;
        figure(g, x, 559, 0.6, false, { head: 'helmet', skin: SKM, dress: 'armor', step: (K.step(t, 3) + k) % 2, aF: [0.8, -0.9], aB: [0.3, 0.3], hold: (g2, hb, hf) => {
          if (k === 2) { sh(g2, [hf[0] - 2, hf[1] + 40, hf[0] - 2, hf[1] - 170, hf[0] + 2, hf[1] - 170, hf[0] + 2, hf[1] + 40], '#8E5A2E', 1.4); const wv = 6 * Math.sin(t * 5);
            sh(g2, [hf[0] + 2, hf[1] - 168, hf[0] + 92, hf[1] - 160 + wv, hf[0] + 88, hf[1] - 84 + wv, hf[0] + 2, hf[1] - 90], RED, 2); if (PF > 0.62) { g2.fillStyle = YEL; g2.font = XY.font(56, XY.cnFont.li); g2.textAlign = 'center'; g2.textBaseline = 'middle'; g2.fillText('殷', hf[0] + 46, hf[1] - 126 + wv * 0.5); g2.textAlign = 'left'; } }
          else { sh(g2, [hf[0] - 1.5, hf[1] + 30, hf[0] - 1.5, hf[1] - 104, hf[0] + 1.5, hf[1] - 104, hf[0] + 1.5, hf[1] + 30], '#8E5A2E', 1); sh(g2, [hf[0], hf[1] - 118, hf[0] - 5, hf[1] - 104, hf[0] + 5, hf[1] - 104], '#C8CED6', 1.2); dot(g2, hf[0], hf[1] - 100, 4, RED); } } }); }
      PF = 1;
      XY.drawProcession(g, e.phase, e.procX, e.groundY, PEN, acts);
      const hd = e.at('monk.head', acts); eye(g, hd[0] + 6.5, hd[1] - 2.5, 0.62);
      // ---- near: the painted block border down both edges, lamp flicker
      [0, W - 18].forEach(x0 => { for (let y = 70; y < 700; y += 22) { g.fillStyle = [RED, BLU, GRN, YEL][Math.round(y / 22) % 4]; g.fillRect(x0, y, 18, 20); } g.fillStyle = INK; g.fillRect(x0 + (x0 ? 0 : 16), 70, 2, 630); });
      const fk = 0.5 + 0.5 * XY.noise1(t * 6, 3); g.save(); g.globalCompositeOperation = 'soft-light'; const lg = g.createRadialGradient(W * 0.5, 820, 100, W * 0.5, 820, 900); lg.addColorStop(0, `rgba(255,190,110,${0.25 + 0.12 * fk})`); lg.addColorStop(1, 'rgba(40,20,0,0.4)'); g.fillStyle = lg; g.fillRect(0, 0, W, 780); g.restore();
    },
    post(canvas, g, e) { K.zoom(canvas, g, e, K.push(e.beat, 4.5, 5.0, 6.3, 0.14), 400, 280); },
  };
})();
