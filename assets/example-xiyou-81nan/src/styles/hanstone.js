// 09 汉画像石 · 陡涧换马 — a rubbing (拓片) of a Han relief slab. Raised stone prints as mottled black ink with white
// incised lines, the chiselled ground as grey striations, beyond the broken edge plain paper with a colophon and seals.
// The ravine 鹰愁涧 runs along the bottom as a band of travelling waves; eagles wheel above 蛇盘山. On beat 2 the dragon
// of the ravine leaps out and swallows Tang Seng's horse from under him — he hangs in the air, palm raised, 悟空 strikes;
// 观音 appears on a cloud and pours from her vase; on beat 3 the water bursts and the dragon comes up as the white horse,
// which in a rubbing means the one shape left un-inked: paper white with an ink outline. The rubbing is dabbed in as we arrive.
(() => {
  'use strict';
  const XY = window.XY, K = XY.KIT_A, TAU = XY.TAU;
  const INK = '#17140F', PAPER = '#EEE8DA', GREY = '#BDB6AA', SEAL = '#B8372A';
  const rev = (u, a, d) => XY.clamp((u - a) / d);
  const fp = (g, pts, c = INK) => { XY.path(g, pts, true); g.fillStyle = c; g.fill(); };
  const wl = (g, pts, w = 1.6) => K.stroke(g, pts, PAPER, w);           // an incised (white) line on inked stone
  // the slab: full height, its right edge broken off; paper beyond
  const SLAB = (() => { const p = [-20, 22], R = XY.rng(9); for (let y = 22; y <= 768; y += 28) p.push(1104 + 16 * (R() - 0.5) + (y > 300 && y < 420 ? -26 : 0), y); p.push(-20, 768); return p; })();

  // ------------------------------------------------------------ the carved stone (static, inked)
  const mountain = (g, x, y, s, flip) => { g.save(); g.translate(x, y); g.scale(flip ? -s : s, s);
    [[0, 0, 90], [70, -40, 110], [150, 10, 80]].forEach(([dx, dy, h], k) => { fp(g, [dx - 50, dy + 40, dx - 30, dy - h * 0.5, dx - 12, dy - h, dx + 16, dy - h * 0.94, dx + 34, dy - h * 0.4, dx + 56, dy + 40]);
      for (let j = 1; j < 4; j++) wl(g, [dx - 40 + j * 6, dy + 30 - j * 26, dx + 6, dy - h * 0.2 - j * 18, dx + 46 - j * 6, dy + 30 - j * 26], 1.3);
      fp(g, [dx - 4, dy - h - 2, dx + 2, dy - h - 18, dx + 8, dy - h - 2]); if (k === 1) { wl(g, [dx - 30, dy - 10, dx + 30, dy - 26], 2.4); wl(g, [dx - 28, dy - 36, dx + 26, dy - 52], 2.4); wl(g, [dx - 22, dy - 62, dx + 18, dy - 74], 2.4); } });
    g.restore(); };
  const cartouche = (g, x, y, w, h, str, px) => { fp(g, [x, y, x + w, y, x + w, y + h, x, y + h]); wl(g, [x + 5, y + 5, x + w - 5, y + 5, x + w - 5, y + h - 5, x + 5, y + h - 5, x + 5, y + 5], 1.4);
    g.fillStyle = PAPER; g.font = XY.font(px, XY.cnFont.li); g.textAlign = 'center'; g.textBaseline = 'top'; K.vtext(g, str, x + w / 2, y + 12, px, 1.08); g.textAlign = 'left'; };
  const staticInk = (g, W) => {
    // top: double frame lines, hanging curtain (垂幛) and a lozenge band (菱形纹)
    g.fillStyle = INK; g.fillRect(0, 26, W, 8); g.fillRect(0, 92, W, 6);
    for (let x = 0; x < W; x += 40) { fp(g, [x, 34, x + 40, 34, x + 20, 62]); fp(g, XY.ellipse(x + 20, 68, 4, 6, 8)); }
    for (let x = 0; x < W; x += 30) { K.stroke(g, [x, 72, x + 15, 88, x + 30, 72], INK, 3); K.stroke(g, [x, 88, x + 15, 72, x + 30, 88], INK, 3); }
    mountain(g, 120, 470, 1.25, false); mountain(g, 930, 456, 1.1, true);
    // the ground the procession walks on, the banks of the ravine
    g.fillRect(0, 702, W, 10);
    cartouche(g, 452, 114, 64, 150, '换马', 56); cartouche(g, 1012, 120, 50, 112, '第九', 40);
  };
  // a snake coiled round the left peak (蛇盘山), its head swaying
  const snake = (g, t) => { const cx = 210, cy = 360, P = []; for (let k = 0; k <= 40; k++) { const q = k / 40, a = q * TAU * 1.6 + 0.5; P.push(cx + Math.cos(a) * (44 - 10 * q), cy + 60 - q * 110 + Math.sin(a) * 12); }
    const hx = P[P.length - 2] + 10 * Math.sin(t * 3), hy = P[P.length - 1] - 8; P.push(hx, hy); K.stroke(g, P, PAPER, 9); K.stroke(g, P, INK, 6); fp(g, XY.ellipse(hx + 4, hy, 9, 5, 10)); };
  // clouds (云气纹): hooked scrolls drifting along the sky band
  const clouds = (g, t, W) => { for (let k = 0; k < 7; k++) { const x = ((k * 190 + t * 22) % (W + 200)) - 100, y = 126 + 34 * (k % 3); const P = [];
    for (let q = 0; q <= 20; q++) { const a = q / 20 * TAU * 1.1; P.push(x + q * 5, y - 8 * Math.sin(q * 0.5)); } for (let q = 0; q <= 14; q++) { const a = -Math.PI / 2 + q / 14 * TAU * 0.9, r = 14 - q * 0.7; P.push(x + 100 + Math.cos(a) * r, y - 6 + Math.sin(a) * r); }
    K.stroke(g, P, INK, 7); wl(g, P, 1.2); } };
  const eagle = (g, x, y, s, flap) => { g.save(); g.translate(x, y); g.scale(s, s); const w = flap ? -30 : 10;
    fp(g, [-34, 0, -10, -6, 20, -4, 34, -8, 40, -2, 26, 4, -4, 8, -26, 8]); fp(g, [-6, -4, 14, -4, 2, w - 10, -20, w - 6]); fp(g, [-4, 4, 12, 4, 8, -w + 6, -14, -w + 10]);
    for (let k = 0; k < 3; k++) wl(g, [-2 + k * 5, -4, -6 + k * 4, w * 0.8 - 6], 1.1); g.fillStyle = PAPER; g.beginPath(); g.arc(32, -5, 1.6, 0, TAU); g.fill(); g.restore(); };
  // the waves of the ravine (水波纹): curling crests running left to right
  const waves = (g, t, W, y0) => { g.fillStyle = INK; g.fillRect(0, y0, W, 54); const off = (t * 40) % 60;
    for (let x = -60 + off; x < W + 60; x += 60) { const P = []; for (let k = 0; k <= 18; k++) { const a = Math.PI - k / 18 * TAU * 0.85, r = 18 - k * 0.6; P.push(x + 30 + Math.cos(a) * r, y0 + 24 + Math.sin(a) * r * 0.9); }
      wl(g, [x - 10, y0 + 46, x + 10, y0 + 34, x + 12, y0 + 24].concat(P), 2.2); wl(g, [x, y0 + 50, x + 60, y0 + 50], 1.2); } };

  // ------------------------------------------------------------ the dragon of 鹰愁涧 (Han 应龙: long scaled body, horn, mane, gaping jaws)
  // drain ∈ [0,1]: how much of the body (from the head back) has lost its ink to 观音's water — drained parts print paper-white with an ink edge
  const dragon = (g, S, open, t, drain = 0) => {     // S: spine points from the head back (flat list), open: jaw angle 0..1
    const n = S.length / 2; if (n < 3) return; const W0 = 46, W1 = 8, col = k => (k / (n - 1) < drain ? PAPER : INK);
    const side = (k, sd) => { const a = Math.max(0, k - 1), b = Math.min(n - 1, k + 1), dx = S[2 * b] - S[2 * a], dy = S[2 * b + 1] - S[2 * a + 1], l = Math.hypot(dx, dy) || 1, w = XY.lerp(W0, W1, k / (n - 1)) / 2;
      return [S[2 * k] - dy / l * w * sd, S[2 * k + 1] + dx / l * w * sd]; };
    // dorsal crest and fins first (they sit behind the body), then the body segment by segment, each with its own ink state
    for (let k = 1; k < n - 2; k += 2) { const p = side(k, -1), a = Math.atan2(S[2 * k + 1] - S[2 * k + 3], S[2 * k] - S[2 * k + 2]) - Math.PI / 2, L = 34 * (1 - k / n) + 10;
      fp(g, [p[0], p[1], p[0] + Math.cos(a - 0.5) * L, p[1] + Math.sin(a - 0.5) * L, p[0] + Math.cos(a) * 10 + 12 * Math.cos(a + Math.PI / 2), p[1] + Math.sin(a) * 10 + 12 * Math.sin(a + Math.PI / 2)], INK); }
    [[3, 1], [Math.floor(n * 0.62), -1]].forEach(([k, sd]) => { const x = S[2 * k], y = S[2 * k + 1], f = [x + 22 * sd, y + 52 + 6 * Math.sin(t * 9 + k)];
      K.stroke(g, [x, y, (x + f[0]) / 2 - 8, (y + f[1]) / 2, f[0], f[1]], INK, 11); if (col(k) === PAPER) K.stroke(g, [x, y, (x + f[0]) / 2 - 8, (y + f[1]) / 2, f[0], f[1]], PAPER, 6); for (let c = -1; c <= 1; c++) K.stroke(g, [f[0], f[1], f[0] + 14 + c * 2, f[1] + 6 + c * 7], INK, 3.6); });
    for (let k = 0; k < n - 1; k++) { const l0 = side(k, -1), r0 = side(k, 1), l1 = side(k + 1, -1), r1 = side(k + 1, 1); XY.path(g, [...l0, ...l1, ...r1, ...r0], true); g.fillStyle = col(k); g.fill(); g.strokeStyle = col(k); g.lineWidth = 1.5; g.stroke(); }
    { const L = [], R = []; for (let k = 0; k < n; k++) { L.push(...side(k, -1)); R.push(...side(k, 1)); } K.stroke(g, L, INK, 3); K.stroke(g, R, INK, 3);
      for (let k = 1; k < n - 1; k++) { const c = col(k) === PAPER ? INK : PAPER, x = S[2 * k], y = S[2 * k + 1], a = Math.atan2(S[2 * k + 1] - S[2 * k - 1], S[2 * k] - S[2 * k - 2]), w = XY.lerp(W0, W1, k / (n - 1)) / 2;
        for (let j = -1; j <= 1; j++) { g.strokeStyle = c; g.lineWidth = 1.4; g.beginPath(); g.arc(x + Math.cos(a + Math.PI / 2) * j * w * 0.5, y + Math.sin(a + Math.PI / 2) * j * w * 0.5, w * 0.34, a + Math.PI * 0.55, a + Math.PI * 1.45); g.stroke(); } }
      const B = []; for (let k = 0; k < n; k++) { const p = side(k, 0.55); B.push(p[0], p[1]); } K.stroke(g, B, col(0) === PAPER ? INK : PAPER, 1.6); }
    // the head: horn, mane, eye, gaping jaws with teeth
    const hx = S[0], hy = S[1], a = Math.atan2(S[1] - S[3], S[0] - S[2]), hc = col(0), lc = hc === PAPER ? INK : PAPER;
    g.save(); g.translate(hx, hy); g.rotate(a);
    for (let k = 0; k < 6; k++) fp(g, [-10 - k * 12, -18, -28 - k * 12, -44 - 6 * Math.sin(t * 7 + k), -20 - k * 12, -14], INK);
    const jaw = (pts, rot, teeth, up) => { g.save(); g.rotate(rot); XY.path(g, pts, true); g.fillStyle = hc; g.fill(); g.strokeStyle = INK; g.lineWidth = 2.6; g.stroke();
      g.fillStyle = PAPER; for (let k = 0; k < teeth; k++) { g.beginPath(); g.moveTo(40 + k * 13, up ? -4 : 10); g.lineTo(46 + k * 13, up ? 7 : -1); g.lineTo(52 + k * 13, up ? -4 : 10); g.fill(); g.strokeStyle = INK; g.lineWidth = 1; g.stroke(); } g.restore(); };
    jaw([-6, -18, 54, -28, 122, -14, 128, -2, 56, -4, -4, 4], -0.55 * open, 6, true); jaw([-6, 4, 52, 10, 112, 8, 114, 18, 50, 30, -4, 24], 0.45 * open, 5, false);
    g.save(); g.rotate(-0.55 * open); wl(g, [20, -22, 80, -20], 1.2); if (hc === PAPER) K.stroke(g, [20, -22, 80, -20], INK, 1.2); K.stroke(g, [92, -16, 132, -42, 154, -32], INK, 3);
      g.fillStyle = PAPER; g.beginPath(); g.arc(30, -14, 6.5, 0, TAU); g.fill(); g.strokeStyle = INK; g.lineWidth = 1.6; g.stroke(); fp(g, XY.ellipse(31, -14, 2.8, 2.8, 8)); K.stroke(g, [10, -22, -26, -60, -42, -52], INK, 8); g.restore();
    void lc; g.restore(); };
  // the dragon's spine for each phase (head first): lurking humps; the lunge onto the horse (swallowed on beat 3.3); the dive back;
  // rising again under the floating monk while its ink drains, curling into the horse's place (beats 4–4.8); then it is the horse
  const spineAt = (u, t, hx) => { const N = 18, P = [];
    if (u < 0.34) { const x0 = 760 + 120 * Math.sin(t * 0.7); for (let k = 0; k < N; k++) { const x = x0 + k * 24, y = 736 - 44 * Math.max(0, Math.sin(k * 0.55 - t * 2.4)); P.push(x, y); } return P; }
    let H, B0, C, amp = 26; if (u < 0.41) { const q = rev(u, 0.34, 0.07), qq = XY.easeIO(q); H = [XY.lerp(hx + 180, hx + 6, qq), 760 - 380 * Math.sin(Math.PI * Math.min(1, q * 1.15)) * (q < 0.87 ? 1 : 0.75) + 150 * qq]; B0 = [hx + 420, 790]; C = [hx + 330, 360]; }
    else if (u < 0.5) { const q = XY.easeIn(rev(u, 0.41, 0.09)); H = [hx + 6 + 240 * q, 610 + 240 * q]; B0 = [hx + 420 + 120 * q, 790 + 40 * q]; C = [hx + 300 + 60 * q, 420 + 200 * q]; }
    else if (u < 0.61) { const q = XY.easeOut(rev(u, 0.5, 0.1)), sh = 1 - 0.45 * q; H = [hx + XY.lerp(240, 110, q), XY.lerp(780, 590, q)]; C = [hx + XY.lerp(330, 20, q), XY.lerp(560, 690, q)]; B0 = [hx + XY.lerp(460, -150, q), XY.lerp(800, 660, q)]; amp = 26 * sh; }
    else return P;
    for (let k = 0; k < N; k++) { const q = k / (N - 1), a = (1 - q) * (1 - q), b = 2 * (1 - q) * q, c = q * q, x = a * H[0] + b * C[0] + c * B0[0], y = a * H[1] + b * C[1] + c * B0[1];
      const dx = 2 * (1 - q) * (C[0] - H[0]) + 2 * q * (B0[0] - C[0]), dy = 2 * (1 - q) * (C[1] - H[1]) + 2 * q * (B0[1] - C[1]), l = Math.hypot(dx, dy) || 1, w = amp * Math.sin(q * 9.5 - t * 8) * Math.min(1, q * 3);
      P.push(x - dy / l * w, y + dx / l * w); }
    return P; };
  // 观音 on a cloud scroll, in Han robes, tipping her vase
  const guanyin = (g, x, y, pour) => { K.stroke(g, [x - 70, y + 50, x - 20, y + 40, x + 30, y + 52, x + 70, y + 40], INK, 10); wl(g, [x - 66, y + 50, x + 66, y + 42], 1.2);
    fp(g, [x - 22, y + 44, x - 12, y - 30, x + 12, y - 30, x + 26, y + 44, x + 6, y + 36, x - 4, y + 48]); for (let k = 0; k < 4; k++) wl(g, [x - 8 + k * 6, y - 20, x - 12 + k * 9, y + 40], 1.1);
    fp(g, XY.ellipse(x, y - 42, 11, 12, 14)); fp(g, [x - 8, y - 52, x, y - 70, x + 8, y - 52]); K.stroke(g, [x - 12, y - 30, x - 40, y - 60, x - 60, y - 54], INK, 4);   // ribbon
    g.save(); g.translate(x + 24, y - 14); g.rotate(0.9 * pour); fp(g, [-6, -10, 6, -10, 9, 10, -9, 10]); fp(g, [-3, -16, 3, -16, 3, -10, -3, -10]); g.restore(); K.stroke(g, [x + 10, y - 26, x + 24, y - 20], INK, 5);
    K.stroke(g, [x - 16, y - 24, x - 30, y - 6, x - 34, y - 34], INK, 3); };
  const horseState = u => (u < 0.41 ? 'dark' : u < 0.605 ? 'gone' : 'white');
  const penFor = st => ({ outline: PAPER, ow: 1.3, shade: false, color: r => (r === 'ink' || r === 'stripe' || r === 'gold' || r === 'metal' || r === 'skull' ? PAPER : INK),
    part(ctx, p) { if (p.fig !== 'monk' || p.rider || st === 'dark') return false; if (st === 'gone') return true;
      if (p.k === 'dot') { ctx.fillStyle = INK; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, TAU); ctx.fill(); return true; }
      XY.path(ctx, p.pts, p.k === 'poly' || !!p.closed);
      if (p.k === 'poly') { ctx.fillStyle = p.role === 'hoof' || p.role === 'saddle' || p.role === 'red' || p.role === 'ink' ? INK : PAPER; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 2.4; ctx.stroke(); }
      else { ctx.strokeStyle = INK; ctx.lineWidth = p.w; ctx.stroke(); } return true; } });
  const actsAt = u => ({ wukong: { shade: K.win(u, 0.26, 0.38, 0.04), raise: K.win(u, 0.36, 0.47, 0.03), strike: K.win(u, 0.46, 0.58, 0.03) }, monk: { palm: K.win(u, 0.4, 0.78, 0.04) } });

  // ------------------------------------------------------------ the rubbing: ink mottle, the dabbing pad, the static carved layer
  let MOT = null;
  const mottle = W => { if (MOT && MOT.W === W) return MOT; const c = K.pix(Math.ceil(W / 4), 195, (i, j, o) => { const x = i * 4, y = j * 4, v = XY.fbm(x * 0.012, y * 0.012, 121, 4), s = XY.hash(i, j, 123);
    o[0] = 238; o[1] = 232; o[2] = 218; o[3] = 255 * Math.min(0.75, XY.clamp((v + 0.05) * 1.1) * 0.42 + (s < 0.05 ? 0.5 : 0) + 0.18 * XY.clamp((XY.fbm(x * 0.05, y * 0.05, 127, 2) - 0.2) * 3)); });
    return (MOT = { W, c }); };
  const DABS = []; for (let c = 0; c < 10; c++) for (let r = 0; r < 4; r++) DABS.push([60 + c * 118 + 30 * (XY.hash(c, r, 1) - 0.5), 100 + r * 196 + 40 * (XY.hash(c, r, 2) - 0.5), -0.16 + 0.3 * (c / 9) + 0.016 * r + 0.012 * XY.hash(c, r, 3)]);
  const inkStatic = (W, S) => XY.cached(`hs-ink:${W}:${S.toFixed(4)}`, W * S, 780 * S, cv => { const g = cv.getContext('2d'); g.scale(S, S); staticInk(g, W); });
  const pad = (g, x, y, lift) => { g.save(); g.fillStyle = 'rgba(20,16,10,0.25)'; g.beginPath(); g.ellipse(x + 14 + 20 * lift, y + 18 + 20 * lift, 46, 20, 0, 0, TAU); g.fill();
    g.translate(x, y - 50 * lift); const rg = g.createRadialGradient(-12, -14, 4, 0, 0, 46); rg.addColorStop(0, '#6A645A'); rg.addColorStop(1, '#1E1A14'); g.fillStyle = rg; g.beginPath(); g.ellipse(0, 0, 44, 34, 0, 0, TAU); g.fill();
    K.stroke(g, [-30, -14, 0, -32, 30, -14], 'rgba(220,210,190,0.35)', 2); fp(g, [-10, -30, 10, -30, 6, -58, -6, -58], '#4A3E30'); K.stroke(g, [-8, -46, 8, -40], '#2A2218', 3); g.restore(); };

  XY.STYLES.hanstone = {
    bg(g, W, H) {
      g.fillStyle = PAPER; g.fillRect(0, 0, W, H);
      for (let k = 0; k < 700; k++) { const x = XY.hash(k, 1) * W, y = XY.hash(k, 2) * H, a = XY.hash(k, 3) * 3; g.strokeStyle = `rgba(150,138,118,${0.12 + 0.12 * XY.hash(k, 4)})`; g.lineWidth = 0.8; g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + Math.cos(a) * 9, y + Math.sin(a) * 9 + 4, x + Math.cos(a) * 18, y + Math.sin(a) * 18); g.stroke(); }
      g.save(); XY.path(g, SLAB, true); g.clip(); g.fillStyle = 'rgba(96,90,80,0.42)'; g.fillRect(0, 0, W, H);
      for (let x = 0; x < W; x += 3) { const a = 0.16 + 0.26 * XY.hash(x, 7); for (let y = 30; y < 770; y += 30 + 50 * XY.hash(x, y)) { g.fillStyle = `rgba(40,36,30,${a})`; g.fillRect(x, y, 1.4, 22 + 46 * XY.hash(x, y, 2)); } }
      for (let k = 0; k < 500; k++) { g.fillStyle = 'rgba(238,232,218,0.35)'; g.fillRect(XY.hash(k, 61) * W, 30 + XY.hash(k, 62) * 740, 1.2, 4 + 8 * XY.hash(k, 63)); }
      g.restore();
      XY.path(g, SLAB.slice(2, SLAB.length - 2), false); g.strokeStyle = 'rgba(23,20,15,0.55)'; g.lineWidth = 3; g.stroke();
      // the margin: a colophon in 楷书 and two collectors' seals
      g.fillStyle = '#3A3228'; g.font = XY.font(21, XY.cnFont.kai); g.textAlign = 'center'; g.textBaseline = 'top'; K.vtext(g, '陡涧换马图', 1158, 60, 21, 1.1); K.vtext(g, '汉画像石拓本', 1134, 120, 19, 1.1); g.textAlign = 'left';
      g.fillStyle = SEAL; g.fillRect(1118, 420, 46, 46); g.fillStyle = PAPER; g.font = XY.font(18, XY.cnFont.li); g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('金石', 1141, 432); g.fillText('之寿', 1141, 454);
      g.fillStyle = SEAL; g.beginPath(); g.arc(1142, 540, 20, 0, TAU); g.fill(); g.fillStyle = PAPER; g.font = XY.font(16, XY.cnFont.li); g.fillText('鹰愁', 1142, 541); g.textAlign = 'left';
    },
    draw(g, e) {
      const { W, H, u, t, S } = e, acts = actsAt(u), st = horseState(u), hx = e.procX + 40;
      const [lc, lg] = K.layer('hs-ink', e); lg.save(); XY.path(lg, SLAB, true); lg.clip();
      lg.drawImage(inkStatic(W, S), 0, 0, W, H); lg.save(); lg.beginPath(); lg.rect(0, 100, 440, 120); lg.rect(530, 100, 470, 120); lg.clip(); clouds(lg, t, W); lg.restore(); snake(lg, t);
      for (let k = 0; k < 3; k++) { const a = t * 0.8 + k * 2.1, x = 800 + Math.cos(a) * 150, y = 262 + Math.sin(a) * 44; lg.save(); lg.translate(x, y); lg.scale(Math.sin(a) > 0 ? -1 : 1, 1); eagle(lg, 0, 0, 0.9, K.step(t + k * 0.2, 5) % 2); lg.restore(); }
      if (u > 0.44 && u < 0.72) { const a = XY.smooth(rev(u, 0.44, 0.04)) * (1 - XY.smooth(rev(u, 0.66, 0.06))); lg.save(); lg.globalAlpha = a; guanyin(lg, 600, 170, K.win(u, 0.5, 0.62, 0.03)); lg.restore(); }
      XY.drawProcession(lg, e.phase, e.procX, e.groundY, penFor(st), acts);
      const sp = spineAt(u, t, hx); if (sp.length) dragon(lg, sp, u < 0.34 ? 0.15 : u < 0.405 ? 1 : u < 0.5 ? 0.1 : 0.3, t, XY.smooth(rev(u, 0.51, 0.08)));
      waves(lg, t, W, 712);
      lg.restore();
      lg.save(); lg.setTransform(1, 0, 0, 1, 0, 0); lg.globalCompositeOperation = 'source-atop'; lg.imageSmoothingQuality = 'high'; lg.drawImage(mottle(W).c, 0, 0, W * S, 780 * S); lg.restore();
      // the rubbing is dabbed in as we arrive: a faint embossed impression, then the inked pad patches
      if (u < 0.24) { K.blit(g, lc, 0, 0, 0.1); K.blit(g, K.masked('hs-mask', e, lc, mg => { mg.fillStyle = '#000';
        DABS.forEach(([x, y, d], k) => { const f = rev(u, d, 0.045); if (f <= 0) return; const r = 158 * XY.easeOut(f); XY.path(mg, XY.wobble(XY.ellipse(x, y, r, r * 0.9, 18), 0.16 * r, k), true); mg.fill(); }); })); }
      else K.blit(g, lc);
      // water: 观音's vase pours on the ravine; on beat 3 it bursts white under the monk as the dragon comes up as the horse
      if (u > 0.5 && u < 0.62) for (let k = 0; k < 14; k++) { const q = ((u - 0.5) * 9 + k / 14) % 1, x = XY.lerp(632, hx, q), y = XY.lerp(160, 700, q) - 120 * Math.sin(Math.PI * q);
        g.fillStyle = PAPER; g.strokeStyle = INK; g.lineWidth = 1.2; g.beginPath(); g.ellipse(x, y, 4, 6, 0, 0, TAU); g.fill(); g.stroke(); }
      const sb = rev(u, 0.585, 0.12); if (sb > 0 && sb < 1) for (let k = 0; k < 36; k++) { const a = -Math.PI * (0.1 + 0.8 * XY.hash(k, 51)), v = 160 + 260 * XY.hash(k, 52), x = hx + Math.cos(a) * v * sb, y = 708 + Math.sin(a) * v * sb + 600 * sb * sb, r = (3 + 6 * XY.hash(k, 53)) * (1 - sb * 0.6);
        g.fillStyle = PAPER; g.strokeStyle = INK; g.lineWidth = 1.4; g.beginPath(); g.ellipse(x, y, r, r * 1.3, a, 0, TAU); g.fill(); g.stroke(); }
      // near: a collector's seal on the image, and the pad while the rubbing is being made
      g.fillStyle = 'rgba(184,55,42,0.86)'; g.fillRect(30, 108, 48, 48); g.fillStyle = PAPER; g.font = XY.font(30, XY.cnFont.li); g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('拓', 54, 133); g.textAlign = 'left';
      if (u < 0.2) { let cur = null; DABS.forEach(dd => { const f = rev(u, dd[2], 0.045); if (f > 0 && (!cur || dd[2] > cur[0][2])) cur = [dd, f]; }); if (cur) pad(g, cur[0][0], cur[0][1], Math.abs(Math.sin(Math.PI * cur[1]))); }
      // the swallow and the change: a white flash where the dragon bites (beat 3.3) and where the horse appears (beat 4.8)
      [[3.3, 0.36], [4.8, 0.6]].forEach(([hb, uu]) => { const f = K.hit(e.beat, hb, 0.5); if (f <= 0) return; const x = XY.procWorldX(e.cell.t0 + uu * e.cell.dur) - e.cell.x + 60;
        g.save(); g.globalCompositeOperation = 'lighter'; const rg = g.createRadialGradient(x, 600, 6, x, 600, 260); rg.addColorStop(0, `rgba(255,250,236,${0.5 * f})`); rg.addColorStop(1, 'rgba(255,250,236,0)'); g.fillStyle = rg; g.fillRect(x - 260, 340, 520, 520); g.restore(); });
    },
    hits: [3.3, 4.8],
    post(canvas, g, e) { const c = e.cell, x1 = XY.procWorldX(c.t0 + 0.41 * c.dur) - c.x + 60, x2 = XY.procWorldX(c.t0 + 0.6 * c.dur) - c.x + 60;
      K.zoom(canvas, g, e, Math.max(K.push(e.beat, 2.9, 3.3, 4.0, 0.1), K.push(e.beat, 4.3, 4.8, 6.3, 0.15)), e.beat < 4.1 ? x1 : x2, 600); },
  };
})();
