// 10 犍陀罗佛像 · 夜被火烧 — a grey-green schist frieze at night. The 观音院 is carved in relief: a seated Buddha
// with a plain disc halo, arched niches, monks hauling firewood, the abbot's chamber with the kasaya on its rack.
// Flame tongues rise and curl into acanthus scrolls; a stone mandorla (the borrowed 辟火罩) drops over Tang Seng,
// Wukong's breath unfurls like the Kushan wind god's scarf, and the fire scrolls across the whole frieze;
// in the afterglow the black bear reaches over the roof and takes the kasaya. Everything is carved: shadow + lip + face.
(() => {
  'use strict';
  const XY = window.XY, TAU = XY.TAU, K = XY.KIT_B;
  const ST = '#69716A', ST2 = '#5A625C', HI = 'rgba(196,204,186,0.75)', LO = 'rgba(22,26,24,0.8)', DEEP = '#2A302C';
  const CIN = '#A2412E', GILT = '#B39A5C';

  // ------------------------------------------------------------ carving primitives
  const carve = (g, build, d, fill) => {
    g.save(); g.translate(d, d); build(g); g.fillStyle = LO; g.fill(); g.restore();
    g.save(); g.translate(-d * 0.55, -d * 0.55); build(g); g.fillStyle = HI; g.fill(); g.restore();
    build(g); g.fillStyle = fill; g.fill();
  };
  const poly = pts => g => XY.path(g, pts, true);
  const line = (g, pts, w, col) => { g.strokeStyle = col; g.lineWidth = w; XY.path(g, pts, false); g.stroke(); };
  const ridge = (g, pts, w) => { g.save(); g.translate(1.1, 1.1); line(g, pts, w, LO); g.restore(); g.save(); g.translate(-0.7, -0.7); line(g, pts, w * 0.8, HI); g.restore(); };
  const groove = (g, pts, w) => { g.save(); g.translate(0.9, 0.9); line(g, pts, w, HI); g.restore(); line(g, pts, w, DEEP); };
  const arcPts = (cx, cy, rx, ry, a0, a1, n = 18) => { const o = []; for (let k = 0; k <= n; k++) { const a = XY.lerp(a0, a1, k / n); o.push(cx + Math.cos(a) * rx, cy + Math.sin(a) * ry); } return o; };

  // a small seated Buddha (head, plain halo, robe over both shoulders, dhyana hands, crossed legs)
  const buddha = (g, x, y, s, d = 2.2) => {
    g.save(); g.translate(x, y); g.scale(s, s);
    carve(g, poly(XY.ellipse(0, -96, 64, 64, 40)), d * 0.6, '#717A72');
    carve(g, poly([-100, 120, -92, 84, -60, 62, -40, 20, -46, -30, -30, -52, 30, -52, 46, -30, 40, 20, 60, 62, 92, 84, 100, 120]), d, ST);
    carve(g, poly(XY.ellipse(0, -96, 30, 37, 28)), d, '#7D867D');
    carve(g, poly([-20, -126, -14, -146, 0, -152, 14, -146, 20, -126]), d * 0.7, '#666E67');
    for (let k = -2; k <= 2; k++) groove(g, arcPts(k * 6, -134, 12, 10, Math.PI * 1.1, Math.PI * 1.9, 6), 1.4);
    groove(g, [-14, -100, -5, -98], 1.6); groove(g, [5, -98, 14, -100], 1.6); groove(g, [-4, -78, 4, -78], 1.4); ridge(g, [0, -96, -2, -84, 2, -82], 1.6);
    groove(g, [-30, -80, -31, -66], 2); groove(g, [30, -80, 31, -66], 2);
    for (let k = 0; k < 6; k++) ridge(g, arcPts(-14 + k * 6, -58 + k * 3, 20 + k * 11, 14 + k * 12, Math.PI * (0.08 + k * 0.02), Math.PI * (0.8 + k * 0.03), 14), 2.4);
    ridge(g, [-44, -28, -20, -40, 10, -52], 2.4); groove(g, [-8, -86, -2, -84, 0, -86, 2, -84, 8, -86], 1.4);
    carve(g, poly(XY.ellipse(0, 46, 34, 14, 18)), d, '#7A837A');
    for (let k = 0; k < 4; k++) ridge(g, arcPts(0, 86, 40 + k * 18, 10 + k * 5, Math.PI * 1.05, Math.PI * 1.95, 12), 2);
    g.restore();
  };
  // a monk hauling a bundle of firewood (narrative register)
  const hauler = (g, x, y, s, k) => {
    g.save(); g.translate(x, y); g.scale(s, s);
    carve(g, poly([-26, -60, 30, -84, 36, -68, -20, -44]), 2, '#6E665A');
    for (let j = 0; j < 4; j++) groove(g, [-22 + j * 14, -54 - j * 6, -18 + j * 14, -44 - j * 6], 1.2);
    carve(g, poly([-14, 0, -18, -30, -10, -58, 8, -60, 16, -34, 14, 0]), 2, ST);
    carve(g, poly(XY.ellipse(4, -70, 9, 10, 14)), 1.6, '#7F887F');
    ridge(g, [-12, -40, 4, -30, 12, -10], 1.6); ridge(g, [-8, -54, 8, -44], 1.4);
    carve(g, poly([-8, 0, -14, 4, -4, 4]), 1, ST2); carve(g, poly([10, 0, 18, 4, 6, 4]), 1, ST2);
    g.restore(); void k;
  };

  // ------------------------------------------------------------ static frieze
  const frame = (g, W, H) => {
    // garland band with rosettes
    carve(g, poly([0, 0, W, 0, W, 64, 0, 64]), 2, '#626A63');
    const gy = x => 30 + 13 * Math.sin((x - 60) / 120 * Math.PI);
    for (let x = 50; x < W - 50; x += 7) carve(g, poly(XY.ellipse(x, gy(x), 9, 11, 10, 0.5)), 1.4, x % 14 < 7 ? '#727B73' : '#6A726B');
    for (let x = 60; x < W - 50; x += 240) { carve(g, poly(XY.ellipse(x + 120, 48, 13, 13, 16)), 1.6, '#7A837A'); for (let k = 0; k < 8; k++) groove(g, [x + 120, 48, x + 120 + Math.cos(k / 8 * TAU) * 11, 48 + Math.sin(k / 8 * TAU) * 11], 1); }
    for (let x = 60; x < W - 50; x += 240) { carve(g, poly([x - 11, 40, x - 9, 20, x - 4, 10, x + 4, 10, x + 9, 20, x + 11, 40]), 1.6, '#727B73'); carve(g, poly(XY.ellipse(x, 44, 4, 4, 10)), 1, '#7D867D'); groove(g, [x, 4, x, 10], 1.6); }
    carve(g, poly([0, 64, W, 64, W, 72, 0, 72]), 1.6, '#737C74');
    for (let x = 4; x < W; x += 12) groove(g, [x, 66, x, 70], 1);
    // Indo-Corinthian pilasters
    [6, W - 50].forEach(px => {
      carve(g, poly([px, 72, px + 44, 72, px + 44, 708, px, 708]), 2.4, '#646C65');
      for (let k = 0; k < 4; k++) groove(g, [px + 9 + k * 9, 132, px + 9 + k * 9, 684], 2.2);
      carve(g, poly([px - 4, 72, px + 48, 72, px + 44, 124, px, 124]), 2, '#6C756D');
      for (let r = 0; r < 2; r++) for (let k = 0; k < 4; k++) { const lx = px + 4 + k * 12 + r * 6, ly = 120 - r * 22;
        carve(g, poly([lx - 6, ly, lx - 7, ly - 14, lx, ly - 24, lx + 7, ly - 14, lx + 6, ly]), 1.4, r ? '#7A837A' : '#737C74'); groove(g, [lx, ly - 2, lx, ly - 18], 1); }
      carve(g, poly([px - 6, 76, px + 6, 84, px + 4, 74]), 1.2, '#7A837A'); carve(g, poly([px + 50, 76, px + 38, 84, px + 40, 74]), 1.2, '#7A837A');
      carve(g, poly([px - 4, 684, px + 48, 684, px + 50, 708, px - 6, 708]), 2, '#6C756D');
    });
    // plinth: dentils and stepped merlons
    carve(g, poly([0, 708, W, 708, W, H, 0, H]), 2, '#5E665F');
    for (let x = 4; x < W; x += 22) carve(g, poly([x, 714, x + 14, 714, x + 14, 730, x, 730]), 1.6, '#6E776F');
    for (let x = 10; x < W; x += 56) carve(g, poly([x, 776, x, 760, x + 8, 760, x + 8, 750, x + 16, 750, x + 16, 740, x + 28, 740, x + 28, 750, x + 36, 750, x + 36, 760, x + 44, 760, x + 44, 776]), 1.8, '#68706A');
  };
  const temple = (g, W) => {
    // big seated Buddha on a pedestal, flanked by trapezoid-arched niches
    carve(g, poly([470, 404, 730, 404, 744, 440, 456, 440]), 2.4, '#646C65');
    for (let k = 0; k < 5; k++) { const x = 492 + k * 52; carve(g, poly([x, 410, x + 10, 410, x + 10, 436, x, 436]), 1.4, '#727B73'); }
    buddha(g, 600, 300, 1.05, 2.6);
    [[400, 1], [800, -1]].forEach(([x]) => {
      carve(g, poly([x - 62, 440, x - 62, 290, x - 40, 236, x + 40, 236, x + 62, 290, x + 62, 440]), 2.4, '#5D655F');
      ridge(g, [x - 62, 290, x - 40, 236, x + 40, 236, x + 62, 290], 3);
      g.fillStyle = 'rgba(20,24,22,0.35)'; XY.path(g, [x - 52, 436, x - 52, 296, x - 34, 248, x + 34, 248, x + 52, 296, x + 52, 436], true); g.fill();
      buddha(g, x, 380, 0.5, 1.6);
      carve(g, poly([x - 66, 440, x + 66, 440, x + 66, 448, x - 66, 448]), 1.4, '#6C756D');
    });
    // the abbot's chamber with the kasaya on its rack (polychromy traces survive)
    carve(g, poly([892, 440, 892, 230, 940, 170, 1070, 170, 1118, 230, 1118, 440]), 2.6, '#5D655F');
    ridge(g, [892, 230, 940, 170, 1070, 170, 1118, 230], 3.4);
    for (let k = 0; k < 6; k++) groove(g, [915 + k * 36, 186, 905 + k * 40, 224], 1.2);
    g.fillStyle = 'rgba(20,24,22,0.42)'; XY.path(g, [904, 436, 904, 240, 946, 190, 1064, 190, 1106, 240, 1106, 436], true); g.fill();
    // firewood haulers in the left register
    hauler(g, 120, 432, 1.15, 0); hauler(g, 210, 432, 1.1, 1); hauler(g, 296, 432, 1.05, 2);
    carve(g, poly([60, 440, 330, 440, 330, 448, 60, 448]), 1.4, '#6C756D');
    // low-relief colonnade behind the procession
    for (let x = 90; x < W - 60; x += 78) { g.fillStyle = 'rgba(120,130,118,0.18)'; g.fillRect(x, 470, 16, 232); g.fillStyle = 'rgba(14,18,16,0.22)'; g.fillRect(x + 16, 470, 3, 232); g.fillRect(x - 6, 462, 28, 8); }
    g.fillStyle = 'rgba(14,18,16,0.2)'; g.fillRect(60, 456, W - 120, 5);
  };
  // stone grain, pits, mica and the night falloff: one multiply layer over everything (static, 1/3 design res)
  const grain = (W, H) => XY.keep('gandhara-grain', Math.ceil(W / 3), Math.ceil(H / 3), cv => {
    const g = cv.getContext('2d'), w = cv.width, h = cv.height, im = g.createImageData(w, h), d = im.data;
    for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
      const n = XY.fbm(i / 26, j / 26, 41, 4), f = XY.fbm(i / 5, j / 5, 43, 2), pit = XY.hash(i, j, 47) < 0.012 ? 0.7 : 1;
      const vx = (i / w - 0.5), vy = (j / h - 0.45), night = 0.8 - 0.3 * Math.min(1, vx * vx * 2.4 + vy * vy * 2.8);
      const v = (0.9 + 0.1 * n + 0.05 * f) * pit * night, o = (j * w + i) * 4;
      d[o] = Math.min(255, 222 * v); d[o + 1] = Math.min(255, 238 * v); d[o + 2] = Math.min(255, 252 * v); d[o + 3] = 255;
    }
    g.putImageData(im, 0, 0);
  });
  // the tabula ansata: 火 cut deep with cinnabar traces, 第十难 and the Kharosthi sign for ten
  const tablet = g => {
    carve(g, poly([92, 84, 300, 84, 300, 198, 92, 198]), 2.6, '#6C756D');
    carve(g, poly([92, 112, 66, 92, 66, 190, 92, 170]), 2, '#68706A'); carve(g, poly([300, 112, 326, 92, 326, 190, 300, 170]), 2, '#68706A');
    ridge(g, [100, 92, 292, 92, 292, 190, 100, 190, 100, 92], 2.4);
    g.font = XY.font(96, XY.cnFont.wei); g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillStyle = HI; g.fillText('火', 160, 144); g.fillStyle = DEEP; g.fillText('火', 162, 142);
    g.fillStyle = CIN; g.globalAlpha = 0.78; g.fillText('火', 162.5, 142.5); g.globalAlpha = 1;
    const R = XY.rng(1010); g.fillStyle = '#4D5550'; for (let k = 0; k < 70; k++) { g.beginPath(); g.arc(118 + R() * 88, 98 + R() * 90, 0.8 + R() * 2.4, 0, TAU); g.fill(); }
    g.font = XY.font(27, XY.cnFont.wei); g.textAlign = 'left';
    ['第', '十', '难'].forEach((c, k) => { g.fillStyle = HI; g.fillText(c, 233, 109 + k * 30); g.fillStyle = DEEP; g.fillText(c, 234, 108 + k * 30); });
    g.lineCap = 'round'; groove(g, XY.RIG.spline([266, 102, 290, 98, 298, 120, 282, 134, 282, 176], false, 5), 4.6); groove(g, [270, 184, 294, 184], 4);
    g.textAlign = 'start'; g.textBaseline = 'alphabetic';
  };
  // fire spots (v10): carved flame tongues — stone cut in relief, warmed from below by the firelight — 3–4 uneven
  // tongues per spot, incised flame lines inside, acanthus lobes on the outer edge; smoke rises as carved scrolls
  const FL = []; { const R = XY.rng(1077); [96, 190, 290, 372, 466, 548, 660, 736, 846, 952, 1056].forEach((x, k) => FL.push({ x: x + (R() - 0.5) * 18, h: 90 + R() * 190, ign: -0.12 + k * 0.042, s: R() * 9, n: R() < 0.5 ? 4 : 3 })); }
  const tongue = (x, y, h, lean, dir, tt, sd, wind) => {
    const n = 22, o = [x, y]; let a = -Math.PI / 2 + lean;
    for (let i = 1; i <= n; i++) { const s = i / n; a += 0.16 * Math.sin(s * 6 + tt + sd) * (1 - s) + dir * (s > 0.58 ? (0.06 + 0.95 * Math.pow((s - 0.58) / 0.42, 1.5)) * (1 + 0.5 * wind) : 0);
      const st = h / n * (1 - 0.62 * s * s); x += Math.cos(a) * st; y += Math.sin(a) * st; o.push(x, y); }
    return o;
  };
  const lobed = (pts, w0, w1, lobes, side, frac = 1) => { const n = pts.length / 2, A = [], B = [];
    for (let i = 0; i < n; i++) { const a = Math.max(0, i - 1), b = Math.min(n - 1, i + 1), dx = pts[2 * b] - pts[2 * a], dy = pts[2 * b + 1] - pts[2 * a + 1], d = Math.hypot(dx, dy) || 1, s = i / (n - 1);
      const w = XY.lerp(w0, w1, Math.pow(s, 0.8)) / 2 * frac, lw = w * (1 + 0.55 * Math.pow(Math.max(0, Math.sin(s * Math.PI * lobes)), 0.6) * (1 - s) * (frac === 1 ? 1 : 0)), nx = -dy / d, ny = dx / d;
      A.push(pts[2 * i] + nx * (side > 0 ? lw : w), pts[2 * i + 1] + ny * (side > 0 ? lw : w)); B.push(pts[2 * i] - nx * (side > 0 ? w : lw), pts[2 * i + 1] - ny * (side > 0 ? w : lw)); }
    return [A, B]; };
  const closeAB = ([A, B]) => { const o = A.slice(); for (let i = B.length / 2 - 1; i >= 0; i--) o.push(B[2 * i], B[2 * i + 1]); return o; };
  const fireRib = (g, pts, w0, w1, side = 1, hot = 1, h = 120) => {
    const rb = closeAB(lobed(pts, w0, w1, 3.5, side));
    g.save(); g.translate(3, 3); XY.path(g, rb, true); g.fillStyle = 'rgba(14,8,4,0.72)'; g.fill(); g.restore();
    g.save(); g.translate(-1.4, 1.6); XY.path(g, rb, true); g.fillStyle = `rgba(255,190,118,${0.45 + 0.4 * hot})`; g.fill(); g.restore();
    const y0 = pts[1], gr = g.createLinearGradient(0, y0, 0, y0 - h); gr.addColorStop(0, `rgb(${168 + 52 * hot | 0},${100 + 34 * hot | 0},62)`); gr.addColorStop(0.55, '#8E6A50'); gr.addColorStop(1, '#5E5A52');
    XY.path(g, rb, true); g.fillStyle = gr; g.fill();
    const inner = lobed(pts, w0, w1, 0, 1, 0.42);   // two incised flame lines inside the tongue
    [inner[0], inner[1]].forEach(L => { const m = L.slice(0, Math.floor(L.length * 0.85 / 2) * 2); g.save(); g.translate(0.9, -0.9); line(g, m, 1.3, 'rgba(255,200,130,0.45)'); g.restore(); line(g, m, 1.3, 'rgba(30,14,6,0.7)'); });
  };
  const glow = () => XY.keep('gandhara-glow', 128, 128, cv => { const g = cv.getContext('2d'), rg = g.createRadialGradient(64, 64, 2, 64, 64, 64);
    rg.addColorStop(0, 'rgba(255,150,60,0.8)'); rg.addColorStop(0.35, 'rgba(230,100,40,0.35)'); rg.addColorStop(1, 'rgba(200,60,20,0)'); g.fillStyle = rg; g.fillRect(0, 0, 128, 128); });
  const flame = (g, f, k, u, t, wind, halo) => {
    const grow = XY.easeOut((u - f.ign) / 0.16); if (grow <= 0) return 0;
    const push = halo.on * Math.max(0, 1 - Math.abs(f.x - halo.x) / 230), side = f.x < halo.x ? -1 : 1, fl = 0.86 + 0.16 * XY.noise1(t * 2.6 + f.s, k);
    const h = f.h * grow * (1 + 0.85 * wind) * (1 - 0.4 * push) * fl, lean = -0.75 * wind + side * 0.6 * push;
    g.save(); g.globalCompositeOperation = 'lighter'; g.globalAlpha = 0.3 * grow * fl; const r = h * 1.1; g.drawImage(glow(), f.x - r, 442 - h * 0.5 - r, 2 * r, 2 * r); g.restore();
    const T = f.n === 4 ? [[-26, 0.5, -0.4, -1], [24, 0.66, 0.34, 1], [-8, 0.82, -0.12, -1], [8, 1, 0.06, 1]] : [[-18, 0.58, -0.32, -1], [18, 0.72, 0.3, 1], [0, 1, 0.02, k % 2 ? 1 : -1]];
    T.forEach(([dx, hk, ln, dir], j) => { const hh = h * hk * (0.9 + 0.12 * XY.noise1(t * 3.4 + j * 3, k + 40)), dd = wind > 0.4 ? -1 : dir;
      fireRib(g, tongue(f.x + dx, 444, hh, ln + lean, dd, t * 2.2 + j, f.s + j, wind), 12 + hh * 0.13, 1.6, -dd, grow, hh); });
    return grow * h;
  };
  // smoke: carved scroll clouds that rise from the burning ledge and wear away
  const smoke = (g, u, t) => { for (let k = 0; k < 8; k++) { const f = FL[(k * 3) % FL.length]; if (u < f.ign + 0.12) continue;
    const ph = (t * 0.16 + XY.hash(k, 2, 10)) % 1, x = f.x + 30 * Math.sin(ph * 4 + k), y = 330 - ph * 250, r = 12 + 26 * ph, a = 0.75 * Math.sin(ph * Math.PI);
    g.save(); g.globalAlpha = a; const P = []; for (let j = 0; j <= 26; j++) { const q = j / 26, an = q * 9 + k, rr = r * (1 - q * 0.85); P.push(x + Math.cos(an) * rr, y + Math.sin(an) * rr * 0.75); }
    ridge(g, P, 7); line(g, P, 5, '#6A6F68'); g.restore(); } };
  // the kasaya (v10: bright red ground with gilt 田相 grid — the polychromy survives on the stolen robe)
  const kasaya = (g, x, y, rot, s = 1.5) => {
    g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s);
    carve(g, poly([-46, -40, 46, -40, 52, 36, 30, 48, 0, 40, -30, 48, -52, 36]), 2, '#B83A28');
    g.strokeStyle = '#E2B84E'; g.lineWidth = 2.2; for (let k = -1; k <= 1; k++) { g.beginPath(); g.moveTo(k * 22, -38); g.lineTo(k * 24, 42); g.stroke(); }
    [-6, 18].forEach(y_ => { g.beginPath(); g.moveTo(-50, y_); g.lineTo(50, y_); g.stroke(); });
    g.lineWidth = 3; XY.path(g, [-46, -40, 46, -40, 52, 36, 30, 48, 0, 40, -30, 48, -52, 36], true); g.stroke();
    g.fillStyle = '#F2D27A'; [[-33, -23], [11, -23], [-11, 6], [33, 6], [-33, 30], [11, 30]].forEach(([a, b]) => { g.beginPath(); g.arc(a, b, 2.6, 0, TAU); g.fill(); });
    g.restore();
  };
  const abbot = (g, x, y, panic, t) => {
    carve(g, poly([x - 16, y, x - 20, y - 50, x - 10, y - 84, x + 12, y - 84, x + 20, y - 46, x + 16, y]), 2, ST);
    carve(g, poly(XY.ellipse(x + 2, y - 96, 11, 12, 16)), 1.6, '#7F887F');
    ridge(g, [x - 10, y - 70, x + 4, y - 52, x + 12, y - 14], 1.6); groove(g, [x + 6, y - 98, x + 11, y - 97], 1.2);
    const hx = panic ? x + 24 : x + 26, hy = panic ? y - 112 : y - 90;
    ridge(g, [x + 10, y - 76, hx, hy], 5); carve(g, poly(XY.ellipse(hx, hy, 4, 4, 8)), 1, '#7F887F');
    if (panic) { ridge(g, [x - 8, y - 76, x - 24, y - 110], 5); carve(g, poly(XY.ellipse(x - 24, y - 110, 4, 4, 8)), 1, '#7F887F'); }
    else { g.strokeStyle = '#4F4A40'; g.lineWidth = 4; XY.path(g, [hx, hy, hx + 8, hy - 30], false); g.stroke();
      const fh = 22 + 5 * XY.noise1(t * 9, 3); fireRib(g, tongue(hx + 8, hy - 28, fh, 0, 1, t * 5, 3, 0), 9, 1.2, 1, 1, fh); }
  };
  // the black bear spirit (熊罴怪), standing, in dark polished schist with the white crescent on its chest.
  // feet at (x, y), scale s, facing left; hands: [near, far] world points; step: leg phase while running
  const BK = '#3E3833';
  const bear = (g, x, y, s, hands, step) => {
    const P = (lx, ly) => [x + lx * s, y + ly * s], sh = [P(-34, -150), P(18, -156)];
    carve(g, poly(XY.RIG.capsule(sh[1], hands[1], 17 * s, 12 * s)), 2.4, '#2C322E');
    const lg = (dx, a) => carve(g, poly(XY.RIG.capsule(P(dx, -78), P(dx + 26 * Math.sin(a), -4 + 6 * Math.min(0, Math.cos(a))), 20 * s, 15 * s)), 2.4, BK);
    lg(16, step + Math.PI); lg(-14, step);
    const rim = pts => { g.save(); g.translate(-1.5, 1.5); g.strokeStyle = 'rgba(255,168,96,0.7)'; g.lineWidth = 3.2; XY.path(g, pts, true); g.stroke(); g.restore(); };
    const body = XY.ellipse(...P(0, -112), 54 * s, 66 * s, 30, 0.12), head = XY.ellipse(...P(-20, -186), 38 * s, 34 * s, 26);
    rim(body); carve(g, poly(body), 3, BK);
    ridge(g, XY.RIG.spline([...P(-40, -150), ...P(-14, -136), ...P(14, -150)], false, 6), 6 * s); line(g, XY.RIG.spline([...P(-40, -150), ...P(-14, -136), ...P(14, -150)], false, 6), 5 * s, '#C8C2A8');
    carve(g, poly(XY.ellipse(...P(-44, -212), 13 * s, 13 * s, 14)), 2, BK); carve(g, poly(XY.ellipse(...P(4, -218), 13 * s, 13 * s, 14)), 2, BK);
    rim(head); carve(g, poly(head), 2.6, BK);
    carve(g, poly(XY.ellipse(...P(-50, -176), 20 * s, 14 * s, 18, 0.15)), 2, '#4A524C');
    g.fillStyle = '#1A1E1C'; g.beginPath(); g.ellipse(...P(-66, -180), 6 * s, 4.4 * s, 0, 0, TAU); g.fill();
    g.fillStyle = '#E2CF8E'; g.beginPath(); g.arc(...P(-34, -196), 4 * s, 0, TAU); g.fill(); groove(g, [...P(-44, -204), ...P(-28, -206)], 2);
    groove(g, [...P(-62, -168), ...P(-46, -164)], 2);
    carve(g, poly(XY.RIG.capsule(sh[0], hands[0], 19 * s, 13 * s)), 2.6, BK);
    hands.forEach(([hx, hy]) => { for (let k = -1; k <= 1; k++) groove(g, [hx - 6 + k * 8, hy - 2, hx - 12 + k * 9, hy + 8], 1.8); });
  };
  // Wukong's breath: carved wind scrolls racing left along the ledge, each a wave of grooves ending in a curl
  const windScrolls = (g, wh, u, t, wind) => {
    for (let k = 0; k < 8; k++) { const ph = (t * 0.55 + k / 8) % 1, x0 = wh[0] - 40 - ph * 1000, y0 = 250 + (k % 4) * 46 + 14 * Math.sin(t * 2 + k), a = wind * Math.sin(Math.PI * Math.min(1, ph * 1.2));
      if (a < 0.03 || x0 < -200) continue; const P = [];
      for (let j = 0; j <= 18; j++) { const q = j / 18; P.push(x0 + q * 260, y0 + 9 * Math.sin(q * 9 - t * 8 + k)); }
      for (let j = 1; j <= 12; j++) { const an = Math.PI * 0.5 + j * 0.52, r = 26 * (1 - j / 14); P.unshift(x0 + Math.cos(an) * r + 4, y0 - 20 + Math.sin(an) * r); }
      g.save(); g.globalAlpha = a; ridge(g, P, 9); line(g, P, 7, '#7E877C'); groove(g, P, 1.4); g.restore(); }
    // the blast leaving his mouth
    if (wind > 0.05) for (let k = -1; k <= 1; k++) { const P = []; for (let j = 0; j <= 10; j++) { const q = j / 10; P.push(wh[0] + 10 - q * 120, wh[1] - 6 + k * 16 * q - 40 * q * q + 5 * Math.sin(q * 8 - t * 10)); }
      g.save(); g.globalAlpha = wind; ridge(g, P, 6); line(g, P, 4.6, '#858E83'); g.restore(); }
  };
  const PEN = K.pen({ fur: '#6F776E', face: '#8E968B', wkshirt: '#79675C', tiger: '#857D65', stripe: DEEP, gold: GILT, staff: '#6D5A50', ink: DEEP,
    horse: '#9CA398', horse2: '#858D82', mane: '#8E968B', hoof: '#4A514B', saddle: '#5E5650', red: '#8E5446', robe: '#80867A', kasaya: '#8A8C7C',
    skin: '#8E968B', metal: '#908A6E', bjrobe: '#4E5650', bjpants: '#464D48', pig: '#878E84', pig2: '#767D74', wood: '#6A6A5E',
    ssrobe: '#58605A', ssrobe2: '#4D554F', skin2: '#7E857B', ssh: '#6E6258', ssbeard: '#665A50', skull: '#9CA397', bundle: '#7C7A68' }, { outline: '#323833', ow: 1.1 });

  XY.STYLES.gandhara = {
    bg(g, W, H) {
      g.fillStyle = ST; g.fillRect(0, 0, W, H);
      g.lineCap = 'round'; g.lineJoin = 'round';
      temple(g, W); frame(g, W, H); tablet(g);
      // chisel marks on the open field
      const R = XY.rng(1033); g.strokeStyle = 'rgba(30,36,32,0.16)'; g.lineWidth = 1;
      for (let k = 0; k < 260; k++) { const x = 60 + R() * (W - 120), y = 460 + R() * 240, a = 0.9 + R() * 0.3; g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(a) * 7, y + Math.sin(a) * 7); g.stroke(); }
    },
    hits: [2.5, 4, 5],
    draw(g, e) {
      const { W, H, u, t } = e; g.lineCap = 'round'; g.lineJoin = 'round';
      const mh = e.at('monk.head'), halo = { x: mh[0] - 4, y: e.groundY - 150, on: 0 };
      // ---- beat 2.5: the borrowed 辟火罩 drops over Tang Seng and the white horse
      const dp = XY.clamp((u - 0.25) / 0.0625), landed = u >= 0.3125 ? 1 : 0, lt0 = e.lt - 0.3125 * e.cell.dur;
      halo.on = landed * (1 - XY.smooth((u - 1.25) / 0.2));
      const hy = halo.y - (1 - XY.easeIn(dp)) * 760 + (landed ? 12 * Math.exp(-lt0 * 6) * Math.sin(lt0 * 26) : 0);
      // ---- beat 4: Wukong's wind; beats 4.2–7: the bear rears over the abbot's roof, takes the kasaya (beat 5), leaps away
      const wind = XY.smooth((u - 0.49) / 0.03) * (1 - XY.smooth((u - 0.86) / 0.2));
      // the bear slides into the burning chamber from behind its right wall, grabs the kasaya at beat 5, lifts it, leaps out
      const enter = XY.easeOut((u - 0.5) / 0.07), reach = XY.easeIO((u - 0.585) / 0.04), pull = XY.easeIO((u - 0.625) / 0.06), leap = XY.easeIO((u - 0.7) / 0.25);
      const s = 1.05, fx = XY.lerp(XY.lerp(1230, 1062, enter), 1340, leap), fy = XY.lerp(436, 300, leap) - 120 * Math.sin(leap * Math.PI);
      const rest = [fx - 62 * s, fy - 118 * s], rack = [1012, 282];
      let hand = XY.lerp(rest[0], rack[0], reach), handY = XY.lerp(rest[1], rack[1], reach);
      if (pull > 0) { hand = XY.lerp(rack[0], fx - 30 * s, pull); handY = XY.lerp(rack[1], fy - 262 * s, pull); }
      const up = pull > 0.5 || leap > 0, hands = [[hand, handY], up ? [fx + 12 * s, fy - 262 * s] : [fx + 40 * s, fy - 110 * s]];
      carve(g, poly([946, 268, 1074, 268, 1074, 276, 946, 276]), 1.4, '#6A5E52'); carve(g, poly([1006, 268, 1014, 268, 1014, 436, 1006, 436]), 1.4, '#6A5E52');
      const onRack = u < 0.625;
      if (u > 0.5) { if (leap <= 0) { g.save(); XY.path(g, [904, 436, 904, 240, 946, 190, 1064, 190, 1106, 240, 1106, 436], true); g.clip(); bear(g, fx, fy, s, hands, 0); g.restore(); }
        else bear(g, fx, fy, s, hands, t * 14); }
      if (onRack) kasaya(g, 1010, 332, 0);
      else kasaya(g, (hands[0][0] + hands[1][0]) / 2 - 8, Math.min(hands[0][1], hands[1][1]) + 44, 0.3 * Math.sin(t * 9) - 0.2 * leap, 1.5);
      if (u > 0.5 && leap <= 0 && reach > 0) carve(g, poly(XY.RIG.capsule([fx - 34 * s, fy - 150 * s], hands[0], 19 * s, 13 * s)), 2.6, BK);
      abbot(g, 930, 438, u > 0.15, t);
      // ---- the stone mandorla behind Tang Seng and the white horse, its petals arching over them
      if (dp > 0 && halo.on > 0) {
        g.save(); g.globalAlpha = halo.on;
        carve(g, poly(XY.ellipse(halo.x, hy, 132, 162, 48)), 3, '#737C73'); carve(g, poly(XY.ellipse(halo.x, hy, 112, 142, 48)), 2, '#7C857B');
        for (let k = 0; k < 22; k++) { const a = Math.PI + k / 21 * Math.PI; carve(g, poly(XY.ellipse(halo.x + Math.cos(a) * 122, hy + Math.sin(a) * 152, 9, 13, 10, a + Math.PI / 2)), 1.2, '#858E84'); }
        g.restore();
      }
      // ---- the procession, carved: drop shadow, lit lip, face
      const acts = { wukong: { shade: XY.smooth((u - 0.12) / 0.08) * (1 - XY.smooth((u - 0.3) / 0.05)), raise: XY.smooth((u - 0.6) / 0.06) * (1 - XY.smooth((u - 0.95) / 0.12)) },
        monk: { palm: XY.smooth((u - 0.29) / 0.05) * (1 - XY.smooth((u - 1.1) / 0.2)) } };
      K.team(g, e.phase, e.procX + 6, e.groundY + 5, K.SIL('rgba(16,20,18,0.35)'), acts);
      K.team(g, e.phase, e.procX + 3, e.groundY + 3, K.SIL(LO), acts);
      K.team(g, e.phase, e.procX - 1.6, e.groundY - 1.6, K.SIL(HI), acts);
      K.team(g, e.phase, e.procX, e.groundY, PEN, acts);
      if (dp > 0 && halo.on > 0) { g.save(); g.globalAlpha = halo.on; for (let k = 0; k < 11; k++) { const a = Math.PI * (1.22 + k * 0.056); carve(g, poly(XY.ellipse(halo.x + Math.cos(a) * 124, hy + Math.sin(a) * 154, 9, 15, 10, a + Math.PI / 2)), 1.4, '#7A837A'); }
        carve(g, poly([halo.x - 8, hy - 168, halo.x, hy - 196, halo.x + 8, hy - 168]), 1.6, '#858E84'); g.restore(); }
      const dust = XY.clamp(1 - (u - 0.3125) / 0.08); if (u >= 0.3125 && dust > 0) for (let k = 0; k < 18; k++) { const a = XY.hash(k, 7) * Math.PI, d = 40 + 170 * (1 - dust);
        g.fillStyle = `rgba(150,156,140,${0.55 * dust})`; g.beginPath(); g.arc(halo.x + Math.cos(a) * d * 1.3, e.groundY - 6 - Math.sin(a) * d * 0.25, 4 + 7 * XY.hash(k, 8), 0, TAU); g.fill(); }
      // ---- stone grain + night falloff over everything, then the carved fire, its smoke, the wind and the firelight
      g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'multiply'; g.drawImage(grain(W, H), 0, 0, W * e.S, H * e.S); g.restore();
      let heat = 0; FL.forEach((f, k) => { heat += flame(g, f, k, u, t, wind, { x: halo.x, on: halo.on }); }); heat = XY.clamp(heat / 2000);
      smoke(g, u, t);
      if (wind > 0.01) windScrolls(g, e.at('wukong.head', acts), u, t, wind);
      for (let k = 0; k < 46; k++) { const f = FL[k % FL.length]; if (u < f.ign + 0.05) continue; const ph = (t * (0.45 + 0.4 * XY.hash(k, 3)) + XY.hash(k, 4)) % 1;
        const x = f.x + (XY.hash(k, 5) - 0.5) * 60 - 60 * ph * (0.3 + wind * 3), y = 430 - ph * (260 + 120 * XY.hash(k, 6));
        g.fillStyle = `rgba(255,${180 + 60 * XY.hash(k, 9) | 0},90,${0.9 * (1 - ph)})`; g.fillRect(x, y, 2.8, 2.8); }
      const fl = 0.8 + 0.2 * XY.noise1(t * 7, 5) * (0.6 + 0.4 * XY.noise1(Math.floor(t * 12) * 0.7, 6));
      g.save(); g.globalCompositeOperation = 'screen';
      const ul = g.createLinearGradient(0, 452, 0, 120); ul.addColorStop(0, `rgba(255,150,70,${0.34 * heat * fl})`); ul.addColorStop(1, 'rgba(255,140,60,0)'); g.fillStyle = ul; g.fillRect(56, 120, W - 112, 332);
      if (halo.on > 0) { const rg = g.createRadialGradient(halo.x, e.groundY - 130, 10, halo.x, e.groundY - 130, 260); rg.addColorStop(0, `rgba(255,190,110,${0.16 * halo.on * fl})`); rg.addColorStop(1, 'rgba(255,170,90,0)'); g.fillStyle = rg; g.fillRect(halo.x - 260, e.groundY - 390, 520, 520); }
      g.restore();
      void H;
    },
    post(canvas, g, e) { K.zoomPost(canvas, g, e, 1010, 330, K.zoom(e.u, [0.58, 0.64, 0.8], 1.12)); },
  };
})();
