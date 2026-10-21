// 66 中国水墨动画 · 1988 年 · 辨认真邪 — 柳林坡 on xuan paper. The 国丈 waits under the nine-forked poplar whose root
// hides the 清华洞 door; his shadow already wears antlers. 寿星 sails in on a cloud; on beat 2, as 悟空's staff comes down,
// the old man bursts into a splash of ink and a white deer is left in it as bare paper (墨中留白); the ink drains away,
// leaving a few pale lines; the deer bounds onto the cloud and is led off. Pilgrims: ink tones, wobbling hairline,
// multiplied onto the paper so the white horse is the paper itself, with a soft bleed under them.
(() => {
  'use strict';
  const XY = window.XY, K = XY.KIT_H, TAU = XY.TAU, { sin, cos, PI, hypot } = Math;
  const PAPER = '#EFE7D4', INK = '16,14,12';
  const GZ = [1048, 702];               // 国丈 stands here (feet), in front of the 清华洞 door at the poplar's root
  const INKPEN = K.pen({ fur: '#8C7864', face: '#EDE2CE', wkshirt: '#B8664E', tiger: '#CCA474', stripe: '#3A342E', gold: '#BC9A58', staff: '#5A3C30', ink: '#1E1A16',
    horse: '#FFFFFF', horse2: '#ECE6DA', mane: '#E2DCD0', hoof: '#3A342E', saddle: '#6A5A4A', red: '#A83A2A', robe: '#DCCCA4', kasaya: '#B24432', skin: '#EFE2CE',
    metal: '#9A8A6A', bjrobe: '#4E4A44', bjpants: '#3E3A36', pig: '#E6D0C8', pig2: '#CCAEA6', wood: '#7A6A58', ssrobe: '#6E7E84', ssrobe2: '#5C6A70', skin2: '#CCB49C',
    ssh: '#8A4A3A', ssbeard: '#7A3A2E', skull: '#F4EEE4', bundle: '#BCA484' }, 'rgba(30,26,22,0.85)', 1.1, { wob: 0.9, seed: 66, shade: 'rgba(40,34,28,0.10)' });

  // ------------------------------------------------------------ a dry brush: wet core ribbon + bristle lines that break into 飞白
  const brush = (g, pts, w, tone, dry, seed) => {
    const P = XY.RIG.spline(pts, false, 6), n = P.length / 2, nx = [], ny = [];
    for (let i = 0; i < n; i++) { const a = Math.max(0, i - 1), b = Math.min(n - 1, i + 1), dx = P[2 * b] - P[2 * a], dy = P[2 * b + 1] - P[2 * a + 1], d = hypot(dx, dy) || 1; nx.push(-dy / d); ny.push(dx / d); }
    const prof = q => XY.smooth(q / 0.15) * (1 - 0.65 * XY.smooth((q - 0.7) / 0.3)) * (0.85 + 0.15 * XY.noise1(q * 9, seed));
    g.save(); g.lineCap = 'butt'; g.lineJoin = 'round';
    const L = [], R = []; for (let i = 0; i < n; i++) { const q = i / (n - 1), hw = w * 0.5 * prof(q) * (1 - 0.6 * dry * q); L.push(P[2 * i] + nx[i] * hw, P[2 * i + 1] + ny[i] * hw); R.push(P[2 * i] - nx[i] * hw, P[2 * i + 1] - ny[i] * hw); }
    const poly = L.slice(); for (let i = n - 1; i >= 0; i--) poly.push(R[2 * i], R[2 * i + 1]);
    XY.path(g, poly, true); g.fillStyle = `rgba(${INK},${tone * 0.5})`; g.fill();
    const nb = Math.max(3, Math.round(w / 1.8)); g.lineWidth = Math.max(0.8, w / nb * 0.9); g.strokeStyle = `rgba(${INK},${tone * 0.55})`;
    for (let b = 0; b < nb; b++) { const o = (b / (nb - 1) - 0.5) * 0.95; let on = false; g.beginPath();
      for (let i = 0; i < n; i++) { const q = i / (n - 1), hw = w * prof(q), gap = XY.noise2(i * 0.12, b * 1.7, seed) * 0.5 + 0.5 < dry * Math.pow(q, 1.2) * 0.95 + 0.05;
        const x = P[2 * i] + nx[i] * o * hw, y = P[2 * i + 1] + ny[i] * o * hw; if (gap) { on = false; continue; } if (on) g.lineTo(x, y); else { g.moveTo(x, y); on = true; } }
      g.stroke(); }
    g.restore();
  };
  // soft wash: a shape blurred onto the paper
  const wash = (g, pts, col, blur, scale) => { g.save(); g.filter = `blur(${Math.max(0.5, blur * scale)}px)`; XY.path(g, pts, true); g.fillStyle = col; g.fill(); g.restore(); };
  const ridge = (W, base, amp, f, seed) => { const o = [0, 780]; for (let x = -20; x <= W + 20; x += 14) o.push(x, base - amp * (0.55 + 0.45 * XY.fbm(x * f, 1, seed, 3)) - amp * 0.8 * Math.max(0, XY.noise1(x * f * 0.6, seed + 4))); o.push(W + 20, 780); return o; };

  const paintBg = (g, W, H, scale) => {
    g.fillStyle = PAPER; g.fillRect(0, 0, W, H);
    const r = XY.rng(6601);
    for (let k = 0; k < 60; k++) { const x = r() * W, y = r() * H, rr = 40 + r() * 160, rg = g.createRadialGradient(x, y, 0, x, y, rr); rg.addColorStop(0, `rgba(${r() < 0.5 ? '200,180,140' : '255,252,240'},${0.06 + 0.06 * r()})`); rg.addColorStop(1, 'rgba(200,180,140,0)'); g.fillStyle = rg; g.fillRect(x - rr, y - rr, rr * 2, rr * 2); }
    for (let k = 0; k < 2200; k++) { const x = r() * W, y = r() * H, a = r() * PI, l = 3 + r() * 12; g.strokeStyle = r() < 0.5 ? 'rgba(120,96,60,0.08)' : 'rgba(255,253,244,0.3)'; g.lineWidth = 0.5 + r() * 0.6; g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + cos(a) * l * 0.5 + 2, y + sin(a) * l * 0.5, x + cos(a) * l, y + sin(a) * l); g.stroke(); }
    // far mountains: three pale washes, darker at the crest, fading into mist below
    [[470, 150, 0.004, 3, 'rgba(110,116,120,0.20)', 10], [540, 120, 0.006, 7, 'rgba(80,84,86,0.26)', 7], [610, 80, 0.009, 11, 'rgba(60,62,60,0.30)', 5]].forEach(([b, a, f, s, c, bl]) => {
      const P = ridge(W, b, a, f, s); wash(g, P, c, bl, scale);
      g.save(); XY.path(g, P, true); g.clip(); const gr = g.createLinearGradient(0, b - a * 1.6, 0, b + 40); gr.addColorStop(0, 'rgba(239,231,212,0)'); gr.addColorStop(1, 'rgba(239,231,212,0.85)'); g.fillStyle = gr; g.fillRect(0, b - a * 2, W, 400); g.restore(); });
    // the far willow (pale) and the near willow trunk; the nine-forked poplar with the cave door in its root
    brush(g, [640, 676, 646, 590, 636, 470, 650, 330], 16, 0.45, 0.5, 31); brush(g, [646, 420, 690, 360, 720, 330], 7, 0.4, 0.6, 32); brush(g, [640, 450, 600, 380, 580, 350], 6, 0.4, 0.6, 33);
    brush(g, [170, 684, 182, 600, 160, 470, 178, 330], 30, 0.85, 0.45, 41); brush(g, [172, 430, 120, 360, 96, 330], 12, 0.8, 0.55, 42); brush(g, [176, 400, 230, 340, 262, 318], 13, 0.8, 0.55, 43);
    wash(g, XY.wobble(XY.ellipse(176, 380, 130, 70, 30), 16, 44), 'rgba(96,110,84,0.16)', 14, scale); wash(g, XY.wobble(XY.ellipse(646, 380, 86, 48, 24), 12, 45), 'rgba(96,110,84,0.10)', 12, scale);
    [[176, 360, 110, 300], [180, 350, 240, 296], [172, 380, 130, 290], [178, 372, 216, 284], [646, 380, 610, 330], [648, 372, 690, 320]].forEach((p, k) => brush(g, [p[0], p[1], (p[0] + p[2]) / 2 + 6, (p[1] + p[3]) / 2 - 10, p[2], p[3]], 4, 0.6, 0.6, 46 + k));
    brush(g, [1100, 690, 1094, 560, 1104, 420, 1096, 360], 34, 0.9, 0.4, 51);
    for (let k = 0; k < 9; k++) { const a = -PI / 2 + (k - 4) * 0.2, l = 150 + 70 * XY.hash(k, 52), x0 = 1096 + (k - 4) * 3, y0 = 370;
      const bend = (k - 4) * 0.05, ex = x0 + cos(a + bend) * l, ey = y0 + sin(a + bend) * l;
      brush(g, [x0, y0, x0 + cos(a) * l * 0.5 + 6 * sin(k), y0 + sin(a) * l * 0.5, ex, ey], 9 - Math.abs(k - 4), 0.75, 0.6, 53 + k);
      for (let j = 0; j < 3; j++) { const f = 0.45 + j * 0.2, tx = x0 + (ex - x0) * f, ty = y0 + (ey - y0) * f, ta = a + (j % 2 ? 0.7 : -0.7); brush(g, [tx, ty, tx + cos(ta) * 22, ty + sin(ta) * 22], 2.4, 0.6, 0.5, 60 + k * 3 + j);
        wash(g, XY.ellipse(tx + cos(ta) * 24, ty + sin(ta) * 24, 6, 4, 8, ta), 'rgba(66,80,58,0.35)', 1.5, scale); } }
    wash(g, XY.ellipse(1098, 668, 18, 30, 16), 'rgba(16,14,12,0.75)', 3, scale);
    // ground: one long dry stroke on the wall's gold line, grass, stones
    brush(g, [-10, 703, 300, 701, 700, 704, 1190, 702], 9, 0.55, 0.85, 61);
    for (let k = 0; k < 40; k++) { const x = r() * W, h = 10 + r() * 26, lean = (r() - 0.5) * 14; brush(g, [x, 706, x + lean * 0.4, 706 - h * 0.5, x + lean, 706 - h], 2.6, 0.6, 0.4, 70 + k); }
    [[60, 724, 40], [420, 740, 26], [860, 732, 34], [1150, 748, 30]].forEach(([x, y, rr], k) => { wash(g, XY.wobble(XY.ellipse(x, y, rr, rr * 0.45, 18), 5, 80 + k), 'rgba(60,58,52,0.35)', 2, scale); brush(g, [x - rr, y + 4, x, y - rr * 0.4, x + rr, y + 2], 3, 0.7, 0.5, 90 + k); });
  };

  // ------------------------------------------------------------ characters painted once per scale as wash sprites
  // 国丈: dark official robe, 乌纱帽, long white beard left as paper, dragon-head staff; facing left, feet at (90, 270)
  const gzSprite = S => XY.keep(`ink-gz:${S.toFixed(4)}`, 180 * S, 290 * S, cv => {
    const g = cv.getContext('2d'); g.scale(S, S); g.translate(90, 270);
    brush(g, [-48, 0, -44, -100, -50, -190, -44, -236], 7, 0.95, 0.3, 7);
    brush(g, [-44, -236, -58, -248, -66, -236, -58, -224, -48, -230], 5, 0.95, 0.2, 8); g.fillStyle = `rgba(${INK},0.9)`; g.beginPath(); g.arc(-62, -238, 2, 0, TAU); g.fill();
    wash(g, XY.RIG.spline([-24, -168, -36, -96, -50, -4, -10, 4, 42, -2, 34, -92, 26, -166, 0, -176], true, 4), 'rgba(44,44,54,0.82)', 1.6, S);
    [[-10, -150, -18, -60, -22, 0], [8, -150, 12, -70, 18, 0], [-30, -40, 0, -30, 34, -38]].forEach((p, k) => brush(g, p, 3, 0.7, 0.6, 9 + k));
    wash(g, [-14, -162, -40, -144, -56, -122, -50, -108, -30, -112, -6, -132], 'rgba(30,30,38,0.9)', 1.2, S);
    g.fillStyle = 'rgba(236,222,196,0.95)'; g.beginPath(); g.ellipse(-50, -118, 6, 5, 0, 0, TAU); g.fill();
    brush(g, [-28, -100, 0, -96, 28, -100], 5, 0.35, 0.3, 12);
    wash(g, XY.ellipse(-4, -192, 14, 17, 16), 'rgba(236,220,196,1)', 0.6, S);
    g.fillStyle = 'rgba(236,220,196,1)'; g.beginPath(); g.moveTo(-14, -196); g.lineTo(-22, -188); g.lineTo(-14, -184); g.fill();
    g.fillStyle = PAPER; g.beginPath(); g.moveTo(-16, -182); g.quadraticCurveTo(-30, -150, -24, -112); g.quadraticCurveTo(-10, -130, 4, -178); g.fill();
    g.strokeStyle = `rgba(${INK},0.55)`; g.lineWidth = 0.9; for (let k = 0; k < 5; k++) { g.beginPath(); g.moveTo(-14 + k * 3, -182); g.quadraticCurveTo(-26 + k * 3, -150, -22 + k * 4, -114 - k * 3); g.stroke(); }
    g.lineWidth = 1.4; g.beginPath(); g.moveTo(-12, -196); g.lineTo(-6, -197); g.stroke(); g.beginPath(); g.moveTo(-14, -201); g.quadraticCurveTo(-6, -205, 0, -200); g.stroke();
    wash(g, XY.ellipse(-4, -210, 16, 11, 14), 'rgba(16,14,12,0.92)', 0.8, S); wash(g, XY.ellipse(-28, -206, 12, 3, 10), 'rgba(16,14,12,0.85)', 0.6, S); wash(g, XY.ellipse(20, -206, 12, 3, 10), 'rgba(16,14,12,0.85)', 0.6, S);
  });
  // 寿星 on his cloud: towering bald forehead, white brows and beard, ochre robe, gnarled staff with a gourd; feet at (130, 230)
  const sxSprite = S => XY.keep(`ink-sx:${S.toFixed(4)}`, 280 * S, 300 * S, cv => {
    const g = cv.getContext('2d'); g.scale(S, S); g.translate(130, 230);
    // cloud: four curls and a streaming tail
    wash(g, XY.wobble(XY.ellipse(10, 18, 92, 22, 28), 6, 3), 'rgba(239,231,212,0.95)', 2, S);
    [[-60, 14, 16], [-26, 6, 20], [14, 10, 18], [52, 16, 15]].forEach(([x, y, r], k) => { const P = []; for (let j = 0; j <= 26; j++) { const a = j / 26 * TAU * 1.25 + k, rr = r * (1 - j / 34); P.push(x + cos(a) * rr, y + sin(a) * rr * 0.75); } brush(g, P, 4, 0.7, 0.3, 20 + k); });
    brush(g, [60, 22, 120, 26, 170, 18, 220, 24], 5, 0.5, 0.7, 25); brush(g, [40, 32, 110, 38, 180, 34], 4, 0.4, 0.8, 26);
    // staff and gourd
    brush(g, [-44, 12, -40, -60, -48, -140, -44, -196], 7, 0.9, 0.35, 27); g.fillStyle = `rgba(${INK},0.9)`; g.beginPath(); g.arc(-44, -198, 6, 0, TAU); g.fill();
    brush(g, [-44, -186, -54, -176], 2, 0.8, 0.2, 28); wash(g, XY.ellipse(-56, -166, 6, 6, 12), 'rgba(184,96,58,0.85)', 0.6, S); wash(g, XY.ellipse(-56, -150, 9, 10, 14), 'rgba(184,96,58,0.85)', 0.6, S);
    // paper reserve so branches behind do not show through, then robe and sleeves
    g.fillStyle = PAPER; XY.path(g, XY.RIG.spline([-22, -110, -36, -54, -46, 2, -4, 8, 38, 2, 32, -52, 22, -110, 0, -120], true, 4), true); g.fill(); g.beginPath(); g.ellipse(-4, -150, 21, 34, 0, 0, TAU); g.fill();
    wash(g, XY.RIG.spline([-22, -110, -36, -54, -46, 2, -4, 8, 38, 2, 32, -52, 22, -110, 0, -120], true, 4), 'rgba(198,150,96,0.62)', 1.6, S);
    wash(g, [-12, -104, -40, -88, -50, -62, -40, -56, -18, -74], 'rgba(176,74,52,0.62)', 1.2, S);
    [[-8, -100, -14, -40, -18, 2], [10, -100, 14, -40, 20, 2]].forEach((p, k) => brush(g, p, 3, 0.55, 0.6, 30 + k));
    // head: the forehead dome, face, brows, beard (paper)
    wash(g, XY.ellipse(-4, -154, 19, 30, 22), 'rgba(242,224,196,1)', 0.7, S); wash(g, XY.ellipse(-8, -126, 15, 13, 16), 'rgba(242,224,196,1)', 0.6, S);
    g.strokeStyle = `rgba(${INK},0.65)`; g.lineWidth = 1.1; g.beginPath(); g.ellipse(-4, -154, 19, 30, 0, PI * 0.95, PI * 2.05); g.stroke();
    g.beginPath(); g.moveTo(-22, -134); g.quadraticCurveTo(-30, -126, -24, -120); g.stroke();
    g.fillStyle = PAPER; g.beginPath(); g.moveTo(-20, -118); g.quadraticCurveTo(-30, -84, -18, -58); g.quadraticCurveTo(-6, -84, 6, -118); g.fill();
    for (let k = 0; k < 5; k++) { g.beginPath(); g.moveTo(-18 + k * 4, -118); g.quadraticCurveTo(-26 + k * 4, -90, -18 + k * 3, -62 + k * 2); g.stroke(); }
    g.lineWidth = 1.6; g.beginPath(); g.moveTo(-18, -134); g.quadraticCurveTo(-12, -138, -6, -133); g.stroke(); g.beginPath(); g.moveTo(-20, -138); g.quadraticCurveTo(-30, -132, -34, -122); g.stroke();
    // smiling closed eyes, nose, long earlobe, rosy cheek, the wrinkles on the towering forehead
    g.strokeStyle = `rgba(${INK},0.9)`; g.lineWidth = 1.8; g.beginPath(); g.moveTo(-19, -129); g.quadraticCurveTo(-15, -126, -11, -129); g.stroke(); g.beginPath(); g.moveTo(-6, -129); g.quadraticCurveTo(-2, -126, 2, -129); g.stroke();
    g.lineWidth = 1.4; g.beginPath(); g.moveTo(-9, -126); g.quadraticCurveTo(-13, -119, -8, -118); g.stroke(); g.beginPath(); g.moveTo(5, -130); g.quadraticCurveTo(10, -122, 6, -112); g.stroke();
    g.fillStyle = 'rgba(200,90,70,0.35)'; g.beginPath(); g.ellipse(-18, -121, 4, 2.6, 0, 0, TAU); g.fill();
    g.strokeStyle = `rgba(${INK},0.4)`; g.lineWidth = 1; [-158, -166, -174].forEach(y => { g.beginPath(); g.moveTo(-16, y); g.quadraticCurveTo(-4, y - 3, 8, y); g.stroke(); });
    g.fillStyle = 'rgba(255,252,240,0.6)'; g.beginPath(); g.ellipse(-10, -168, 6, 10, -0.3, 0, TAU); g.fill();
  });
  // the white deer (facing right, body centre at the origin); w = walk phase, ink = outline alpha
  const deerShape = (w, amp = 1) => {
    const body = XY.RIG.spline([-50, -4, -36, -16, 0, -18, 36, -14, 48, -6, 46, 10, 20, 16, -20, 16, -46, 10], true, 4);
    const neck = XY.RIG.capsule([38, -8], [54, -46], 10, 7), head = XY.RIG.spline([48, -58, 60, -66, 78, -58, 81, -51, 66, -45, 52, -46], true, 3);
    const legs = [[-34, 8, 0], [-24, 10, 0.5], [30, 8, 0.25], [40, 10, 0.75]].map(([x, y, o]) => { const a = 0.45 * amp * sin(TAU * (w + o)), k = [x + sin(a) * 26, y + cos(a) * 26], b = a - 0.35 * Math.max(0, sin(TAU * (w + o) + 1));
      return [x, y, k[0], k[1], k[0] + sin(b) * 25, k[1] + cos(b) * 25]; });
    const antl = [[58, -64, 54, -84, 46, -102, 40, -112], [54, -84, 64, -96], [48, -98, 56, -112], [63, -64, 67, -86, 63, -104], [67, -86, 78, -94], [65, -97, 72, -108]];
    return { body, neck, head, legs, antl, ear: [52, -62, 42, -72, 50, -66] };
  };
  // ds: scale (negative = facing left)
  const deerFill = (g, D, sh, col, legW, ds = 1) => { g.save(); g.translate(D[0], D[1]); g.scale(ds, Math.abs(ds)); g.fillStyle = col; g.strokeStyle = col;
    [sh.body, sh.neck, sh.head, sh.ear].forEach(p => { XY.path(g, p, true); g.fill(); });
    g.lineCap = 'round'; g.lineWidth = legW; sh.legs.forEach(L => { XY.path(g, L, false); g.stroke(); }); g.lineWidth = legW * 0.9; sh.antl.forEach(L => { XY.path(g, L, false); g.stroke(); }); g.restore(); };
  const deerHalo = (g, D, sh, ds, a, S) => { if (a <= 0.01) return; g.save(); g.filter = `blur(${10 * S}px)`; g.globalAlpha = a; deerFill(g, D, sh, `rgba(${INK},0.32)`, 16, ds * 1.06); g.restore(); };
  const deerLine = (g, D, sh, a, ds = 1) => { g.save(); g.translate(D[0], D[1]); g.scale(ds, Math.abs(ds)); g.lineJoin = 'round'; g.lineCap = 'round';
    g.fillStyle = `rgba(${INK},${0.12 * a})`; g.beginPath(); g.ellipse(4, 10, 42, 7, 0, 0, TAU); g.fill();
    g.strokeStyle = `rgba(${INK},${0.75 * a})`; g.lineWidth = 1.4; [sh.body, sh.neck, sh.head, sh.ear].forEach(p => { XY.path(g, XY.wobble(p, 0.8, 7), true); g.stroke(); });
    g.strokeStyle = `rgba(${INK},${0.92 * a})`; g.lineWidth = 2.6; sh.legs.forEach(L => { XY.path(g, L, false); g.stroke(); });
    g.lineWidth = 3.4; sh.antl.forEach(L => { XY.path(g, L, false); g.stroke(); });
    g.fillStyle = `rgba(${INK},${a})`; g.beginPath(); g.arc(64, -57, 2.2, 0, TAU); g.arc(80, -52, 1.8, 0, TAU); g.fill();
    sh.legs.forEach(L => { g.beginPath(); g.arc(L[4], L[5], 2.6, 0, TAU); g.fill(); }); g.restore(); };
  const mistSprite = S => XY.keep(`ink-mist:${S.toFixed(4)}`, 660 * S, 100 * S, cv => { const g = cv.getContext('2d'); g.scale(S, S); g.filter = `blur(${14 * S}px)`; g.fillStyle = 'rgba(239,231,212,0.92)'; g.beginPath(); g.ellipse(330, 50, 290, 20, 0, 0, TAU); g.fill(); });
  const charSprite = (ch, S) => XY.keep(`ink-ch:${ch}:${S.toFixed(4)}`, 124 * S, 124 * S, cv => { const g = cv.getContext('2d'); g.scale(S, S);
    g.font = XY.font(106, XY.cnFont.xing); g.textBaseline = 'middle'; g.textAlign = 'center'; g.shadowColor = 'rgba(16,14,12,0.5)'; g.shadowBlur = 4 * S; g.fillStyle = 'rgba(20,18,16,0.93)'; g.fillText(ch, 62, 64); g.shadowBlur = 0;
    g.globalCompositeOperation = 'destination-out'; const r = XY.rng(ch.charCodeAt(0)); for (let k = 0; k < 110; k++) { const x = r() * 124, y = r() * 124, l = 6 + r() * 18; g.strokeStyle = `rgba(0,0,0,${0.3 + 0.5 * r()})`; g.lineWidth = 0.6 + r() * 0.9; g.beginPath(); g.moveTo(x, y); g.lineTo(x + l, y + l * 0.3 * (r() - 0.5)); g.stroke(); } });
  // drooping willow threads: a hairline of ink and a dashed run of leaves, swinging more toward the tip
  const willow = (g, cx, cy, n, spread, len, t, tone, seed) => {
    g.save(); g.lineCap = 'round';
    for (let k = 0; k < n; k++) { const q = k / (n - 1), x0 = cx + (q - 0.5) * spread * 2, y0 = cy + 34 * Math.pow(Math.abs(q - 0.5) * 2, 2) - 14 * XY.hash(k, seed);
      const L = len * (0.45 + 0.75 * XY.hash(k, seed + 1)), sw = 0.11 * sin(t * 1.3 + k * 0.6 + seed) + 0.05 * sin(t * 2.9 + k), out = (q - 0.5) * 0.6;
      g.beginPath(); let x = x0, y = y0; g.moveTo(x, y);
      for (let j = 1; j <= 9; j++) { const f = j / 9, a = PI / 2 - out * (1 - f) * 2 + sw * f * f * 2.2; x += cos(a) * L / 9; y += sin(a) * L / 9; g.lineTo(x, y); }
      g.setLineDash([]); g.strokeStyle = `rgba(${INK},${0.42 * tone})`; g.lineWidth = 1.1; g.stroke();
      g.setLineDash(k % 2 ? [3, 5, 1.6, 7, 2.4, 4] : [2, 6, 3.4, 4, 1.4, 8]); g.lineDashOffset = k * 3.7; g.strokeStyle = `rgba(66,80,58,${(0.32 + 0.16 * XY.hash(k, seed + 2)) * tone})`; g.lineWidth = 4 + 2.5 * XY.hash(k, seed + 3); g.stroke(); }
    g.restore(); };
  const crane = (g, x, y, f) => { g.save(); g.translate(x, y); g.lineJoin = 'round'; g.lineCap = 'round';
    const tip = -44 * f, ink = `rgba(${INK},0.85)`;
    g.fillStyle = PAPER; g.strokeStyle = ink; g.lineWidth = 1.2;
    g.beginPath(); g.moveTo(-6, -3); g.quadraticCurveTo(-26, tip * 0.6 - 6, -40, tip); g.quadraticCurveTo(-18, tip * 0.4, 12, -2); g.fill(); g.stroke();
    g.lineWidth = 4; g.beginPath(); g.moveTo(-40, tip); g.lineTo(-30, tip * 0.75 - 2); g.stroke();
    g.lineWidth = 1.2; g.beginPath(); g.ellipse(0, 0, 22, 7, -0.05, 0, TAU); g.fill(); g.stroke();
    g.lineWidth = 2; g.beginPath(); g.moveTo(18, -3); g.quadraticCurveTo(40, -12, 56, -8); g.stroke(); g.beginPath(); g.moveTo(56, -8); g.lineTo(70, -5); g.stroke();
    g.fillStyle = '#B23A2A'; g.beginPath(); g.arc(55, -10, 2.4, 0, TAU); g.fill();
    g.lineWidth = 1.4; g.beginPath(); g.moveTo(-18, 3); g.lineTo(-54, 8); g.moveTo(-18, 5); g.lineTo(-52, 11); g.stroke(); g.restore(); };

  // ------------------------------------------------------------ timeline (8 beats at 90 BPM, u = beat / 8)
  const HIT = 0.5, BL = [1040, 600], D0 = [1046, 614], DS = 1.5, SX0 = [860, 268];
  const sxPos = u => { if (u < 0.8) { const k = XY.easeOut((u - 0.2) / 0.22); return [XY.lerp(1300, SX0[0], k), XY.lerp(-80, SX0[1], k) + 4 * sin(u * 24)]; }
    const k = XY.easeIn((u - 0.8) / 0.25); return [XY.lerp(SX0[0], 1360, k), XY.lerp(SX0[1] + 4 * sin(u * 24), 10, k)]; };
  const SXK = 1.25;
  // ink pilgrims: tiles for the fur's dry brush, uneven wash and broken (飞白) lines, made once per scale in device pixels
  const tile = (key, S, n, paint) => XY.keep(`${key}:${S.toFixed(4)}`, n, n, cv => paint(cv.getContext('2d'), n, XY.rng(n + key.length)));
  const furTile = S => tile('ink-fur', S, Math.round(90 * S), (g, n, r) => { g.fillStyle = 'rgba(70,62,54,0.55)'; g.fillRect(0, 0, n, n); g.lineCap = 'round';
    for (let k = 0; k < 160; k++) { const x = r() * n, y = r() * n, a = -0.5 + r() * 0.5, l = (6 + r() * 14) * S / 1.33; g.strokeStyle = `rgba(20,17,14,${0.4 + 0.5 * r()})`; g.lineWidth = (0.8 + r()) * S / 1.33;
      for (const dx of [-n, 0, n]) for (const dy of [-n, 0, n]) { g.beginPath(); g.moveTo(x + dx, y + dy); g.lineTo(x + dx + cos(a) * l, y + dy + sin(a) * l); g.stroke(); } } });
  const blotTile = S => tile('ink-blotchy', S, 256, (g, n, r) => { for (let k = 0; k < 40; k++) { const x = r() * n, y = r() * n, rr = 10 + r() * 40;
    for (const dx of [-n, 0, n]) for (const dy of [-n, 0, n]) { const gr = g.createRadialGradient(x + dx, y + dy, 0, x + dx, y + dy, rr); gr.addColorStop(0, `rgba(0,0,0,${0.18 + 0.2 * r()})`); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(x + dx - rr, y + dy - rr, 2 * rr, 2 * rr); } } });
  const dryTile = S => tile('ink-dry', S, 200, (g, n, r) => { g.lineCap = 'butt'; for (let k = 0; k < 120; k++) { const x = r() * n, y = r() * n, l = 4 + r() * 16, a = -0.35 + r() * 0.7;
    g.strokeStyle = `rgba(0,0,0,${0.5 + 0.5 * r()})`; g.lineWidth = 0.6 + r() * 1.2; for (const dx of [-n, 0, n]) for (const dy of [-n, 0, n]) { g.beginPath(); g.moveTo(x + dx, y + dy); g.lineTo(x + dx + cos(a) * l, y + dy + sin(a) * l); g.stroke(); } } });
  const LINEPEN = { color: r => (r === 'ink' || r === 'stripe' ? 'rgba(18,15,12,0.95)' : 'rgba(0,0,0,0)'), outline: 'rgba(20,17,14,0.42)', ow: 0.8, wob: 1.3, seed: 66, shade: false };

  XY.STYLES.inkanim = {
    hits: [4],
    post(canvas, g, e) { K.zoomPost(canvas, g, e, BL[0] - 40, BL[1] - 20, K.push(e.beat, 3.85, 6.4, 0.12)); },
    bg(g, W, H, c, scale) { paintBg(g, W, H, scale); },
    draw(g, e) {
      const { W, t, u } = e, S = e.S;
      const M = mistSprite(S); [[440, 26, 0.55], [500, 40, 0.5], [560, 18, 0.45]].forEach(([y, sp, a], k) => { const x = ((t * sp + k * 420) % (W + 700)) - 660; g.globalAlpha = a; g.drawImage(M, x, y - 50, 660, 100); }); g.globalAlpha = 1;
      willow(g, 645, 336, 16, 70, 150, t, 0.55, 3); willow(g, 174, 330, 26, 110, 230, t, 1, 9);
      crane(g, XY.lerp(-140, W + 160, (u + 0.5) / 2), 150 + 26 * sin(u * 4), sin(t * 7));
      // the tell: on beats 2–3 the old man's shadow on the poplar sprouts antlers, and twitches an ear
      const sh = 0.45 * (1 - XY.smooth((u - 0.48) / 0.04)), grow = XY.easeOut((u - 0.24) / 0.1);
      if (sh > 0.01) { g.save(); g.fillStyle = `rgba(${INK},${sh})`; g.beginPath(); g.ellipse(1168, 488, 13, 16, 0.2, 0, TAU); g.fill(); g.beginPath(); g.ellipse(1176, 540, 22, 34, 0.1, 0, TAU); g.fill();
        if (grow > 0) { g.strokeStyle = `rgba(${INK},${sh})`; g.lineWidth = 3.4; g.lineCap = 'round'; g.save(); g.translate(1168, 476); g.scale(1, grow);
          [[-6, 0, -20, -28, -28, -54], [-18, -24, -34, -32], [-24, -42, -10, -52], [6, 0, 18, -30, 14, -56], [16, -26, 32, -36], [16, -44, 28, -58]].forEach(L => { XY.path(g, L, false); g.stroke(); }); g.restore();
          const tw = Math.floor(t * 3) % 4 === 0 ? 0.4 : 0; g.beginPath(); g.ellipse(1154, 474, 9, 4, -0.6 - tw, 0, TAU); g.fill(); } g.restore(); }
      const sx = sxPos(u); if (u > 0.19 && u < 1.08) g.drawImage(sxSprite(S), sx[0] - 130 * SXK, sx[1] - 230 * SXK, 280 * SXK, 300 * SXK);
      this.trueForm(g, e, sx);
      this.pilgrims(g, e);
      this.title(g, e);
    },
    // 国丈 swallowed by a splash of ink → a white deer left in it as bare paper → the ink drains → the deer bounds onto 寿星's cloud
    trueForm(g, e, sx) {
      const { u, t } = e, S = e.S;
      if (u < HIT + 0.03) { g.save(); g.translate(GZ[0], GZ[1]); const sk = u < HIT ? 0.006 * sin(t * 2.2) : 0.05 * sin(t * 40); g.scale(1, 1 + sk); g.drawImage(gzSprite(S), -90, -270, 180, 290); g.restore(); }
      if (u < HIT) return;
      let D = D0, w = 0, amp = 0, ds = -DS; const jump = XY.clamp((u - 0.68) / 0.12);
      if (u > 0.68) { const Dc = [sx[0] + 66, sx[1] - 46]; ds = -XY.lerp(DS, 0.95, jump); if (jump < 1) { D = [XY.lerp(D0[0], Dc[0], jump), XY.lerp(D0[1], Dc[1], jump) - 150 * sin(jump * PI)]; w = 0.15; amp = 1; } else D = Dc; }
      else if (u > 0.6) { w = (u - 0.6) * 5; amp = 0.25; }
      const shp = deerShape(w, amp), fade = 1 - XY.smooth((u - 0.62) / 0.18);
      if (u < 1.08 && u > 0.53) { deerHalo(g, D, shp, ds, (1 - fade) * (u < 0.86 ? 1 : 1 - (u - 0.86) / 0.2), S); deerFill(g, D, shp, PAPER, 6, ds); }
      if (u < 0.82) {
        const k = XY.easeOut((u - HIT) / 0.05), r = 166 * k * (1 + 0.1 * XY.clamp((u - 0.55) / 0.25));
        const bx = BL[0] - 260, by = BL[1] - 260, bw = 520, bh = 460, B = XY.scratch('ink-blot', bw * S, bh * S), b = B.getContext('2d'); b.setTransform(S, 0, 0, S, -bx * S, -by * S);
        const edge = XY.wobble(XY.wobble(XY.ellipse(BL[0], BL[1], r, r * 0.9, 96), r * 0.15 + 1, 66, 0.016), 3 + r * 0.04, 67, 0.09);
        b.fillStyle = `rgba(${INK},0.88)`; XY.path(b, edge, true); b.fill(); b.strokeStyle = `rgba(${INK},0.95)`; b.lineWidth = 7; b.lineJoin = 'round'; b.stroke();
        const cg = b.createRadialGradient(BL[0] - r * 0.2, BL[1] - r * 0.25, 2, BL[0], BL[1], r); cg.addColorStop(0, 'rgba(90,86,80,0.32)'); cg.addColorStop(1, 'rgba(90,86,80,0)'); b.globalCompositeOperation = 'destination-out'; b.fillStyle = cg; b.fill(); b.globalCompositeOperation = 'source-over'; b.fillStyle = `rgba(${INK},0.9)`;
        for (let j = 0; j < 30; j++) { const a = XY.hash(j, 1) * TAU, d = r * (1.02 + 0.45 * XY.hash(j, 2)), rr = (2 + 9 * XY.hash(j, 3)) * k; b.beginPath(); b.arc(BL[0] + cos(a) * d, BL[1] + sin(a) * d * 0.9, rr, 0, TAU); b.fill(); }
        for (let j = 0; j < 5; j++) { const x = BL[0] - r * 0.6 + j * r * 0.3, y0 = BL[1] + r * 0.55, l = (40 + 60 * XY.hash(j, 4)) * XY.clamp((u - 0.52) / 0.12); b.fillRect(x - 2, y0, 4 + 2 * XY.hash(j, 5), l); }
        b.globalCompositeOperation = 'destination-out'; b.globalAlpha = XY.smooth((u - 0.52) / 0.04); deerFill(b, D, shp, '#000', 6, ds); b.globalAlpha = 1; b.globalCompositeOperation = 'source-over';
        g.save(); g.globalCompositeOperation = 'multiply';
        g.globalAlpha = 0.5 * fade; g.filter = `blur(${(6 + 30 * (1 - fade)) * S}px)`; g.drawImage(B, bx, by, bw, bh);
        g.filter = 1 - fade > 0.05 ? `blur(${12 * (1 - fade) * S}px)` : 'none'; g.globalAlpha = fade; g.drawImage(B, bx, by, bw, bh); g.restore();
      }
      const la = XY.smooth((u - 0.58) / 0.1); if (la > 0 && u < 1.08) deerLine(g, D, shp, la, ds);
    },
    // pilgrims in ink: wash fills (uneven, with a bleed), dense-ink outlines broken by 飞白, dry-brush fur, paper reserved under them
    pilgrims(g, e) {
      const { u } = e, S = e.S, px = e.procX, gy = e.groundY, bx = px - 410, by = gy - 300, bw = 760, bh = 312;
      if (bx > e.W + 10 || bx + bw < -10) return;
      const w = Math.ceil(bw * S), h = Math.ceil(bh * S);
      const acts = { wukong: { shade: K.win(u, 0.22, 0.38, 0.04), raise: K.win(u, 0.38, 0.5, 0.03), strike: K.win(u, 0.48, 0.58, 0.025) }, monk: { palm: K.win(u, 0.5, 0.95, 0.05) }, bajie: { scratch: K.win(u, 0.82, 1.1, 0.05) }, shaseng: { lift: K.win(u, 0.5, 0.58, 0.025) } };
      const fur = g.createPattern(furTile(S), 'repeat'); fur.setTransform(new DOMMatrix().scaleSelf(1 / S, 1 / S));
      const FILL = Object.assign({}, INKPEN, { outline: null, fine: false, wob: 0.6, part(c, p) { if (p.role !== 'fur' || p.k !== 'poly') return false; XY.path(c, p.pts, true); c.fillStyle = fur; c.fill(); return true; } });
      const lay = XY.scratch('ink-lay', w, h), lg = lay.getContext('2d'); lg.setTransform(S, 0, 0, S, -bx * S, -by * S); XY.drawProcession(lg, e.phase, px, gy, FILL, acts);
      lg.setTransform(1, 0, 0, 1, 0, 0); lg.globalCompositeOperation = 'destination-out'; lg.fillStyle = lg.createPattern(blotTile(S), 'repeat'); lg.fillRect(0, 0, w, h); lg.globalCompositeOperation = 'source-over';
      const ln = XY.scratch('ink-line', w, h), ng = ln.getContext('2d'); ng.setTransform(S, 0, 0, S, -bx * S, -by * S); XY.drawProcession(ng, e.phase, px, gy, LINEPEN, acts);
      // the outer contour in dense ink: the silhouette grown by ~2.4 px minus itself, broken by 飞白
      const sil = XY.scratch('ink-sil', w, h), sg = sil.getContext('2d'); sg.drawImage(lay, 0, 0); sg.drawImage(ln, 0, 0); sg.globalCompositeOperation = 'source-in'; sg.fillStyle = 'rgb(18,15,12)'; sg.fillRect(0, 0, w, h);
      const ring = XY.scratch('ink-ring', w, h), rgx = ring.getContext('2d'), dd = 2.4 * S; for (let k = 0; k < 8; k++) rgx.drawImage(sil, cos(k * PI / 4) * dd, sin(k * PI / 4) * dd);
      rgx.globalCompositeOperation = 'destination-out'; rgx.drawImage(sil, 0, 0); rgx.fillStyle = rgx.createPattern(dryTile(S), 'repeat'); rgx.globalAlpha = 0.75; rgx.fillRect(0, 0, w, h); rgx.globalAlpha = 1;
      ng.setTransform(1, 0, 0, 1, 0, 0); ng.drawImage(ring, 0, 0);
      const q = XY.scratch('ink-halo', w / 4, h / 4), qg = q.getContext('2d'); qg.filter = 'blur(2px)'; qg.drawImage(lay, 0, 0, q.width, q.height); qg.drawImage(ln, 0, 0, q.width, q.height);
      const rs = XY.scratch('ink-res', w, h), rg = rs.getContext('2d'); rg.drawImage(lay, 0, 0); rg.drawImage(ln, 0, 0); rg.globalCompositeOperation = 'source-in'; rg.fillStyle = PAPER; rg.fillRect(0, 0, w, h);
      g.drawImage(rs, bx, by, bw, bh);
      g.save(); g.globalCompositeOperation = 'multiply'; g.globalAlpha = 0.45; g.drawImage(q, bx - 2, by + 2, bw, bh); g.globalAlpha = 1; g.drawImage(lay, bx, by, bw, bh); g.drawImage(ln, bx, by, bw, bh); g.restore();
    },
    // 真邪 brushed in top-down, the 第六十六难 inscription, the 南极 seal pressed on
    title(g, e) {
      const { u, S } = e;
      ['真', '邪'].forEach((ch, k) => { const f = XY.clamp((u + 0.04 - k * 0.07) / 0.08); if (f <= 0) return; const sp = charSprite(ch, S); g.drawImage(sp, 0, 0, sp.width, sp.height * f, 40, 34 + k * 112, 124, 124 * f); });
      const ia = XY.smooth((u - 0.1) / 0.06);
      if (ia > 0) { g.save(); g.globalAlpha = ia * 0.85; g.fillStyle = 'rgb(20,18,16)'; g.font = XY.font(30, XY.cnFont.kai); g.textAlign = 'center'; g.textBaseline = 'middle'; [...'第六十六难'].forEach((c, k) => g.fillText(c, 184, 62 + k * 33)); g.restore(); }
      const sa = XY.clamp((u - 0.16) / 0.03);
      if (sa > 0) { const s = 1 + 0.4 * (1 - XY.easeOut(sa)); g.save(); g.translate(184, 262); g.scale(s, s); g.globalAlpha = Math.min(1, sa * 1.6);
        XY.path(g, XY.wobble([-25, -25, 25, -25, 25, 25, -25, 25], 1.5, 5, 0.2), true); g.fillStyle = 'rgba(184,40,30,0.9)'; g.fill();
        g.fillStyle = PAPER; g.font = XY.font(21, XY.cnFont.li); g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('南', 0, -11); g.fillText('极', 0, 12); g.restore(); }
    },
  };
})();
