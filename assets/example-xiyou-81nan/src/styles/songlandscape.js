// 17 宋山水 · 四圣显化 — a Northern Song hanging-scroll landscape on browned silk: a towering central peak in
// rain-dot texture with a waterfall, mist belts, crab-claw trees; in the valley the widow's manor with mother and three
// daughters waving at the gate (a tiny blindfolded Bajie lunging inside). Beat 3: a mist sweeps the valley, the manor
// is a pine wood, four auspicious clouds lift the four sages away, and Bajie hangs trussed upside down from the big
// pine over the path — until the rope snaps and he drops into his place in the line.
(() => {
  'use strict';
  const XY = window.XY, TAU = XY.TAU, K = XY.KIT_B;
  const INK = '#2A221A', SILK = '#CDB48A';
  const sp = (pts, n = 5) => XY.RIG.spline(pts, true, n);
  const stroke = (g, pts, w, col) => { g.strokeStyle = col; g.lineWidth = w; XY.path(g, pts, false); g.stroke(); };
  const ink = a => `rgba(42,34,26,${a})`;
  const ridge = (x0, x1, base, top, seed, rough) => { const o = [x0, base]; for (let k = 0; k <= 40; k++) { const q = k / 40, x = XY.lerp(x0, x1, q), h = Math.pow(Math.sin(q * Math.PI), 1.6);
    o.push(x, base - (base - top) * h * (0.86 + 0.14 * XY.fbm(q * 6, 1, seed, 3)) - rough * Math.abs(XY.noise1(q * 30, seed))); } o.push(x1, base); return o; };
  // ink mass: gradient from a pale lit side to a dark side, then rain-dot texture clipped inside
  const mass = (g, pts, a0, a1, lx, dots, seed, dotA) => {
    const xs = pts.filter((v, i) => i % 2 === 0), x0 = Math.min(...xs), x1 = Math.max(...xs), gr = g.createLinearGradient(x0, 0, x1, 0);
    gr.addColorStop(0, ink(a0)); gr.addColorStop(lx, ink(a0 * 0.6)); gr.addColorStop(1, ink(a1));
    g.save(); XY.path(g, pts, true); g.fillStyle = gr; g.fill(); g.clip();
    const R = XY.rng(seed), ys = pts.filter((v, i) => i % 2 === 1), y0 = Math.min(...ys), y1 = Math.max(...ys);
    for (let k = 0; k < dots; k++) { const x = x0 + R() * (x1 - x0), y = y0 + R() * (y1 - y0), d = (x - x0) / (x1 - x0); if (R() > 0.35 + 0.65 * d) continue;
      g.fillStyle = ink(dotA * (0.5 + R() * 0.5)); g.fillRect(x, y, 0.9 + R() * 1.1, 1.4 + R() * 2.4); }
    // curling cloud-texture strokes (卷云皴)
    for (let k = 0; k < dots / 120; k++) { const cx = x0 + R() * (x1 - x0), cy = y0 + R() * (y1 - y0) * 0.9, r = 14 + R() * 30, P = [];
      for (let j = 0; j <= 14; j++) { const a = Math.PI * (0.9 + j / 14 * 1.3), rr = r * (1 - j / 30); P.push(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr * 0.7); } stroke(g, P, 1.2, ink(0.35)); }
    g.restore();
    g.strokeStyle = ink(0.5); g.lineWidth = 1.3; XY.path(g, pts.slice(2, -2), false); g.stroke();
    for (let k = 4; k < pts.length - 4; k += 6) { if (R() < 0.45) continue; for (let j = 0; j < 4; j++) { g.fillStyle = ink(0.55 + 0.3 * R()); g.beginPath(); g.ellipse(pts[k] + (R() - 0.5) * 10, pts[k + 1] + 2 + R() * 6, 1.6 + R() * 1.4, 1.1 + R(), 0, 0, TAU); g.fill(); } }
  };
  const mist = (g, y, h, W, a, seed = 7) => { const R = XY.rng(seed * 31 + y | 0);
    for (let x = -80; x < W + 80; x += 46 + R() * 40) { const r = h * (1.6 + R() * 1.6), yy = y + (R() - 0.5) * h * 0.6, A = a * (0.45 + 0.55 * R());
      g.save(); g.translate(x, yy); g.scale(1, 0.32); const rg = g.createRadialGradient(0, 0, 0, 0, 0, r); rg.addColorStop(0, `rgba(240,232,212,${A})`); rg.addColorStop(0.55, `rgba(240,232,212,${A * 0.55})`); rg.addColorStop(1, 'rgba(240,232,212,0)');
      g.fillStyle = rg; g.fillRect(-r, -r, 2 * r, 2 * r); g.restore(); } };
  // a crab-claw tree (郭熙蟹爪枝): a twisting trunk, branches that end in down-curling claws
  const clawTree = (g, x, y, h, seed, s = 1) => {
    const R = XY.rng(seed); g.lineCap = 'round';
    const trunk = [x, y]; let tx = x, ty = y; for (let k = 1; k <= 8; k++) { tx += (R() - 0.5) * 16 * s; ty -= h / 8; trunk.push(tx, ty); }
    stroke(g, XY.RIG.spline(trunk, false, 4), 9 * s, ink(0.85)); stroke(g, XY.RIG.spline(trunk, false, 4), 3 * s, ink(0.35));
    const br = (bx, by, a, l, d) => { const ex = bx + Math.cos(a) * l, ey = by + Math.sin(a) * l; stroke(g, [bx, by, (bx + ex) / 2 + (R() - 0.5) * 8, (by + ey) / 2 - 4, ex, ey], Math.max(1, 5 * s * (1 - d * 0.3)), ink(0.8));
      if (d < 3) { br(ex, ey, a - 0.5 - R() * 0.3, l * 0.62, d + 1); br(ex, ey, a + 0.4 + R() * 0.3, l * 0.55, d + 1); }
      else stroke(g, [ex, ey, ex + Math.cos(a + 1.2) * 6, ey + 7, ex + Math.cos(a + 2) * 5, ey + 10], 1.2, ink(0.8)); };
    for (let k = 3; k <= 8; k++) br(trunk[2 * k], trunk[2 * k + 1], -Math.PI / 2 + (k % 2 ? -1 : 1) * (0.7 + R() * 0.4), (40 + R() * 30) * s, 0);
  };
  // a pine: straight trunk with plates of needles (drawn into a cached sprite set)
  const pine = (g, x, y, h, seed, s = 1) => {
    const R = XY.rng(seed); stroke(g, [x, y, x + 4 * s, y - h * 0.5, x - 2 * s, y - h], 7 * s, ink(0.75));
    for (let k = 0; k < 7; k++) { const py = y - h * (0.35 + k * 0.1), w = (46 - k * 4) * s, px = x + (k % 2 ? 1 : -1) * w * 0.4;
      stroke(g, [x, py + 6, px, py], 2.4 * s, ink(0.7));
      for (let j = 0; j < 16; j++) { const a = Math.PI + j / 15 * Math.PI, r = w * 0.5 * (0.8 + 0.4 * R()); stroke(g, [px, py, px + Math.cos(a) * r, py + Math.sin(a) * r * 0.45], 1, ink(0.7)); }
      g.fillStyle = 'rgba(60,80,60,0.25)'; g.beginPath(); g.ellipse(px, py - 3, w * 0.5, w * 0.16, 0, 0, TAU); g.fill(); }
  };
  // ------------------------------------------------------------ the scroll
  const landscape = (g, W, H) => {
    K.silk(g, W, H, { seed: 1701, base: SILK, age: 0.45, creases: 4 });
    mass(g, ridge(-20, 380, 470, 290, 3, 6), 0.1, 0.22, 0.4, 900, 1703, 0.18);
    mass(g, ridge(860, W + 30, 470, 170, 5, 8), 0.12, 0.3, 0.45, 1600, 1705, 0.22);
    mist(g, 300, 60, W, 0.5);
    mass(g, ridge(300, 980, 460, 46, 7, 12), 0.14, 0.5, 0.35, 5200, 1707, 0.34);
    mass(g, ridge(560, 900, 450, 150, 11, 10), 0.16, 0.48, 0.3, 2600, 1717, 0.32);
    mass(g, ridge(380, 640, 470, 250, 9, 8), 0.2, 0.45, 0.4, 1600, 1709, 0.3);
    mass(g, ridge(700, 860, 462, 330, 13, 6), 0.22, 0.5, 0.35, 900, 1719, 0.34);
    [[600, 120, 600, 300], [720, 170, 716, 330], [500, 260, 496, 400], [810, 220, 806, 380]].forEach(([x0, y0, x1, y1]) => stroke(g, XY.RIG.spline([x0, y0, x0 + 6, (y0 + y1) / 2, x1, y1], false, 4), 1.2, ink(0.45)));

    mist(g, 250, 26, W, 0.55); mist(g, 440, 50, W, 0.85);
    // valley floor, the near bank and path
    g.fillStyle = 'rgba(160,130,80,0.28)'; XY.path(g, sp([-20, 560, 300, 548, 700, 572, 1000, 560, W + 20, 566, W + 20, 600, -20, 600], 6), true); g.fill();
    const near = sp([-20, 640, 200, 626, 500, 640, 800, 628, W + 20, 636, W + 20, H + 20, -20, H + 20], 6);
    XY.path(g, near, true); const gr = g.createLinearGradient(0, 620, 0, H); gr.addColorStop(0, ink(0.12)); gr.addColorStop(1, ink(0.3)); g.fillStyle = gr; g.fill();
    stroke(g, near.slice(0, near.length - 8), 1.2, ink(0.55));
    [[120, 704, 54, 30], [470, 708, 40, 20], [700, 706, 46, 24], [1110, 704, 50, 28]].forEach(([x, y, w, h], k) => { const P = sp([x - w, y, x - w * 0.6, y - h, x + w * 0.1, y - h * 1.2, x + w * 0.8, y - h * 0.6, x + w, y], 4);
      mass(g, P, 0.3, 0.6, 0.3, 200, 1711 + k, 0.5); });
    clawTree(g, 70, 640, 260, 1713, 1.1); clawTree(g, 210, 650, 190, 1715, 0.85);
    for (let k = 0; k < 220; k++) { g.fillStyle = ink(0.3 + 0.3 * XY.hash(k, 1, 17)); g.fillRect(XY.hash(k, 2, 17) * W, 630 + XY.hash(k, 3, 17) * 140, 2, 1.4); }
    // inscription in the open sky: 四圣, the four lines of the note left in the wood, the count, seals
    K.vtext(g, '四圣', 252, 92, 62, XY.cnFont.kai, ink(0.92), 1.08);
    ['黎山老母不思凡', '南海菩萨请下山', '普贤文殊皆是客', '化成美女在林间'].forEach((l, k) => K.vtext(g, l, 196 - k * 30, 78, 21, XY.cnFont.xing, ink(0.8), 1.06));
    K.vtext(g, '第十七难', 300, 96, 26, XY.cnFont.kai, ink(0.85), 1.1);
    K.seal(g, 236, 236, 34, '试心', true); K.seal(g, W - 70, 716, 44, '宣和', false);
  };
  // the widow's manor, brought forward into the middle ground (v10): gate hall, wall, a courtyard floor at y 646
  const CY = 646;
  const manor = (g) => {
    const hall = (x, y, w, h, roof) => { g.fillStyle = 'rgba(222,200,160,0.95)'; g.fillRect(x - w / 2, y - h, w, h); g.strokeStyle = ink(0.8); g.lineWidth = 1.1; g.strokeRect(x - w / 2, y - h, w, h);
      for (let k = 1; k < 6; k++) stroke(g, [x - w / 2 + k * w / 6, y - h, x - w / 2 + k * w / 6, y], 1, ink(0.55));
      for (let k = 0; k < 6; k++) { g.fillStyle = 'rgba(176,90,60,0.55)'; g.fillRect(x - w / 2 + k * w / 6 + 3, y - h + 6, w / 6 - 6, h * 0.45); stroke(g, [x - w / 2 + k * w / 6 + 3, y - h + 6 + h * 0.22, x - w / 2 + (k + 1) * w / 6 - 3, y - h + 6 + h * 0.22], 0.7, ink(0.5)); }
      XY.path(g, sp([x - w / 2 - roof, y - h + 4, x - w / 2 + 6, y - h - 12, x, y - h - 44, x + w / 2 - 6, y - h - 12, x + w / 2 + roof, y - h + 4, x, y - h - 6], 4), true); g.fillStyle = ink(0.72); g.fill();
      for (let k = 0; k < 13; k++) stroke(g, [x - w / 2 + k * w / 12, y - h - 8, x - w / 2 + k * w / 12 + (k - 6) * 3, y - h - 30 + Math.abs(k - 6) * 3.5], 0.8, 'rgba(236,222,190,0.45)');
      g.fillStyle = ink(0.8); g.fillRect(x - w / 2 - 6, y, w + 12, 6); };
    hall(1010, 560, 220, 70, 34); hall(1150, 590, 90, 50, 20);
    g.fillStyle = '#A24A34'; g.fillRect(1124, CY - 130, 14, 130); g.strokeStyle = ink(0.8); g.lineWidth = 1.1; g.strokeRect(1124, CY - 130, 14, 130);
    g.fillStyle = 'rgba(200,176,130,0.85)'; g.fillRect(790, CY - 42, 390, 42); g.strokeStyle = ink(0.75); g.strokeRect(790, CY - 42, 390, 42);
    g.fillStyle = ink(0.65); XY.path(g, [780, CY - 42, 1190, CY - 42, 1182, CY - 52, 788, CY - 52], true); g.fill();
    // the gate: two red posts, a lintel, the doors standing open
    [[828], [900]].forEach(([x]) => { g.fillStyle = '#A24A34'; g.fillRect(x, CY - 120, 12, 120); g.strokeStyle = ink(0.8); g.strokeRect(x, CY - 120, 12, 120); });
    XY.path(g, sp([806, CY - 120, 830, CY - 134, 870, CY - 150, 910, CY - 134, 934, CY - 120, 870, CY - 126], 4), true); g.fillStyle = ink(0.75); g.fill();
    g.fillStyle = 'rgba(60,40,24,0.75)'; g.fillRect(840, CY - 112, 60, 112);
    g.fillStyle = 'rgba(160,130,80,0.35)'; g.fillRect(790, CY - 2, 390, 8);
    [[1110, CY - 40], [1176, CY - 46]].forEach(([x, y]) => { stroke(g, [x, y, x + 3, y - 96], 3.6, ink(0.7)); for (let j = 0; j < 10; j++) stroke(g, [x + 3, y - 96, x - 26 + j * 6, y - 36 - 5 * j], 0.9, 'rgba(70,90,60,0.65)'); });
  };
  // the pine wood that replaces it, with the big pine whose long arm reaches over the road
  const HX = 880, HY = 300;
  const wood = (g) => {
    [[800, 640, 170], [850, 646, 230], [930, 644, 160], [1060, 648, 240], [1110, 642, 170], [1160, 646, 210]].forEach(([x, y, h], k) => pine(g, x, y, h, 1721 + k, 0.95));
    stroke(g, XY.RIG.spline([1004, 704, 994, 560, 1006, 420, 992, 250], false, 5), 16, ink(0.88)); stroke(g, [1000, 330, 960, 304, 910, 298, 840, 306], 8, ink(0.88));
    for (let k = 0; k < 6; k++) { const px = 1004 - k * 30 + (k % 2) * 22, py = 256 + k * 30; for (let j = 0; j < 20; j++) { const a = Math.PI + j / 19 * Math.PI; stroke(g, [px, py, px + Math.cos(a) * 42, py + Math.sin(a) * 17], 1.1, ink(0.78)); }
      g.fillStyle = 'rgba(50,70,50,0.32)'; g.beginPath(); g.ellipse(px, py - 4, 40, 13, 0, 0, TAU); g.fill(); }
    for (let k = 0; k < 14; k++) stroke(g, [996 + XY.hash(k, 1, 174) * 14, 700 - k * 30, 1004, 690 - k * 30], 1, 'rgba(236,222,190,0.5)');
  };
  // a Song-painting lady: fine ink line, pale washes, high chignon, long sleeves; sleeve 0–1 lifts one sleeve to beckon,
  // dodge −1…1 leans her away
  const lady = (g, x, y, s, col, sleeve, dodge, k) => {
    g.save(); g.translate(x, y); g.scale(s, s); g.rotate(0.12 * dodge);
    const ln = ink(0.85), sk = '#F2E6D2';
    XY.path(g, sp([-14, 0, -22, -2, -18, -40, -12, -78, -8, -98, 8, -98, 14, -76, 20, -40, 26, -2, 16, 0], 4), true); g.fillStyle = col; g.fill(); g.strokeStyle = ln; g.lineWidth = 1; g.stroke();
    for (let j = 0; j < 4; j++) stroke(g, [-10 + j * 7, -60, -14 + j * 9, -4], 0.7, ink(0.4));
    XY.path(g, sp([-12, -96, -6, -112, 8, -112, 14, -96, 10, -84, -10, -84], 3), true); g.fillStyle = 'rgba(246,240,226,0.9)'; g.fill(); g.stroke();
    stroke(g, XY.RIG.spline([-14, -88, -26, -60, -22, -20, -30, 20], false, 4), 2.2, 'rgba(176,90,70,0.75)');
    const sa = -0.3 - 1.6 * sleeve; XY.path(g, sp([10, -100, 10 + Math.cos(sa) * 24, -100 + Math.sin(sa) * 24 + 4, 12 + Math.cos(sa) * 40, -96 + Math.sin(sa) * 40, 22 + Math.cos(sa) * 34, -86 + Math.sin(sa) * 34, 16, -84], 3), true);
    g.fillStyle = 'rgba(246,240,226,0.85)'; g.fill(); g.stroke();
    g.beginPath(); g.ellipse(2, -122, 8, 9.5, 0, 0, TAU); g.fillStyle = sk; g.fill(); g.stroke();
    stroke(g, [-1, -123, 1.5, -123], 0.8, ln); stroke(g, [4.5, -123, 7, -123], 0.8, ln); g.fillStyle = '#B8402E'; g.beginPath(); g.arc(4, -116, 1.2, 0, TAU); g.fill();
    g.fillStyle = ink(0.92); XY.path(g, sp([-7, -126, -6, -142, 4, -152, 12, -142, 10, -128, 4, -132], 3), true); g.fill(); g.beginPath(); g.ellipse(4, -150, 6, 5, 0, 0, TAU); g.fill();
    stroke(g, [8, -148, 20, -156], 1.2, '#C8A048'); g.fillStyle = '#C8A048'; g.beginPath(); g.arc(20, -156, 2, 0, TAU); g.fill();
    g.restore(); void k;
  };
  const sageCloud = (g, x, y, k, t) => {
    g.fillStyle = 'rgba(250,244,230,0.92)'; XY.path(g, sp([x - 34, y + 6, x - 20, y - 4, x, y, x + 20, y - 6, x + 36, y + 4, x + 10, y + 12, x - 14, y + 12], 4), true); g.fill(); g.strokeStyle = ink(0.6); g.lineWidth = 0.8; g.stroke();
    stroke(g, XY.RIG.spline([x - 34, y + 6, x - 46, y + 12, x - 58, y + 8 + 3 * Math.sin(t * 3 + k)], false, 3), 1, ink(0.5));
    if (k === 2) { g.fillStyle = '#F6F2E8'; g.beginPath(); g.ellipse(x, y - 8, 14, 9, 0, 0, TAU); g.fill(); g.stroke(); stroke(g, [x + 12, y - 8, x + 18, y + 2], 2, '#F6F2E8'); }
    if (k === 3) { g.fillStyle = '#D8A050'; g.beginPath(); g.ellipse(x, y - 8, 13, 8, 0, 0, TAU); g.fill(); g.stroke(); g.beginPath(); g.arc(x + 11, y - 12, 6, 0, TAU); g.fill(); g.stroke(); }
    const col = ['#E8D8C0', '#F4F0E6', '#D86A50', '#5A7A8A'][k]; g.fillStyle = col; XY.path(g, [x - 5, y - (k > 1 ? 14 : 4), x + 5, y - (k > 1 ? 14 : 4), x + 3, y - (k > 1 ? 34 : 24), x - 3, y - (k > 1 ? 34 : 24)], true); g.fill(); g.stroke();
    g.fillStyle = '#EEDCC4'; g.beginPath(); g.arc(x, y - (k > 1 ? 38 : 28), 4, 0, TAU); g.fill(); g.stroke();
    g.strokeStyle = 'rgba(226,190,90,0.8)'; g.beginPath(); g.arc(x, y - (k > 1 ? 38 : 28), 7, 0, TAU); g.stroke();
  };
  const RG = [760, 220, 420, 490];   // region holding the manor / the pine wood
  const sprite = (key, S, paint) => XY.cached(`${key}:${S.toFixed(3)}`, RG[2] * S, RG[3] * S, cv => { const g = cv.getContext('2d'); g.scale(S, S); g.translate(-RG[0], -RG[1]); g.lineCap = 'round'; g.lineJoin = 'round'; paint(g); });
  const PEN = K.pen({ fur: '#8A7458', face: '#E6D6BE', wkshirt: '#A8806E', tiger: '#C2A47A', stripe: INK, gold: '#B89A58', staff: '#A0604A', ink: INK, horse: '#ECE4D2', horse2: '#D6CCB8', mane: '#E4DCCA',
    hoof: INK, saddle: '#7A5A44', red: '#A0604A', robe: '#D4C6A2', kasaya: '#A87A62', skin: '#E6D6BE', metal: '#A89A70', bjrobe: '#6A6862', bjpants: '#5A5852', pig: '#D8BCAE', pig2: '#C4A494',
    wood: '#7A6448', ssrobe: '#6E7A74', ssrobe2: '#5E6A64', skin2: '#C8A88A', ssh: '#8A4A34', ssbeard: '#7A4430', skull: '#EAE2D2', bundle: '#C0A070' }, { outline: INK, ow: 0.9, shade: 'rgba(42,34,26,0.16)' });
  const mergeU = c => { if (c._slMerge) return c._slMerge; let lo = 0.6, hi = 1.4; for (let k = 0; k < 30; k++) { const m = (lo + hi) / 2; if (XY.procWorldX(c.t0 + m * c.dur) - c.x - 150 < HX) lo = m; else hi = m; } return (c._slMerge = lo); };

  XY.STYLES.songlandscape = {
    hits: [4, 5],
    thumb: 6,
    bg(g, W, H) { g.lineCap = 'round'; g.lineJoin = 'round'; landscape(g, W, H); },
    draw(g, e) {
      const { W, u, t, cell, S } = e; g.lineCap = 'round'; g.lineJoin = 'round';
      // waterfall and a drifting ink-wash mist
      g.save(); g.setLineDash([12, 16]); g.lineDashOffset = -t * 70; stroke(g, [655, 214, 652, 300, 656, 384], 3, 'rgba(246,240,226,0.85)'); g.lineDashOffset = -t * 90 + 9; stroke(g, [661, 220, 659, 380], 1.6, 'rgba(246,240,226,0.7)'); g.restore();
      { const mx = ((t * 22) % (W + 600)) - 300; g.save(); g.translate(mx, 452); g.scale(1, 0.35); const rg = g.createRadialGradient(0, 0, 10, 0, 0, 300); rg.addColorStop(0, 'rgba(240,232,212,0.55)'); rg.addColorStop(1, 'rgba(240,232,212,0)'); g.fillStyle = rg; g.fillRect(-300, -300, 600, 600); g.restore(); }
      // the manor (beats 0–4.7) and, under cover of the mist, the pine wood
      const SW = 0.585, ma = u < SW, um = mergeU(cell), joined = u >= um;
      if (ma) { g.drawImage(sprite('sl-manor2', S, manor), RG[0], RG[1], RG[2], RG[3]);
        // the widow at the gate and her three daughters in the courtyard; Bajie under the red 盖头 lunging at them (撞天婚)
        const veil = XY.smooth((u - 0.22) / 0.05), chase = XY.clamp((u - 0.3) / 0.2), bonk = u >= 0.5;
        const bx = bonk ? 1100 - 6 * Math.sin((u - 0.5) * 120) * Math.exp(-(u - 0.5) * 40) : XY.lerp(960, 1040, 0.5 + 0.5 * Math.sin(chase * 7)) + (1100 - 1050) * XY.easeIn(XY.clamp((u - 0.44) / 0.06)), bdir = bonk || u > 0.44 || Math.cos(chase * 7) > 0 ? 1 : -1;
        const near = k => Math.max(0, 1 - Math.abs(bx - [930, 990, 1050][k]) / 50) * (chase > 0 && !bonk ? 1 : 0);
        lady(g, 868, CY, 0.86, 'rgba(150,160,170,0.85)', 0.5 + 0.5 * XY.smooth((u - 0.1) / 0.06) * (1 - veil), 0, 9);
        [['rgba(216,150,140,0.8)', 930], ['rgba(170,196,206,0.8)', 990], ['rgba(236,226,206,0.9)', 1050]].forEach(([c, x], k) => {
          const dg = near(k) * (bx < x ? 1 : -1); lady(g, x + 30 * dg, CY, 0.86, c, (1 - chase) * (0.5 + 0.5 * Math.sin(t * 5 + k)), dg, k); });
        const bp = XY.walkPhase(cell.t0 + 0.6 * cell.dur) + (chase > 0 && !bonk ? e.lt * 1.5 : 0), sitting = bonk ? XY.smooth((u - 0.52) / 0.03) : 0;
        K.figure(g, 'bajie', bp, bx, CY + 2, PEN, { bajie: { scratch: chase > 0 && !bonk ? 0.5 + 0.5 * Math.sin(t * 9) : 0 } }, { flip: bdir < 0, kneel: sitting, bow: bonk ? -0.25 * sitting : 0.2 * chase });
        if (veil > 0) { const hx = bx + bdir * 18, hy = CY + 2 - (bonk ? 136 - 26 * sitting : 136) - 50 * (1 - veil);
          g.save(); g.globalAlpha = veil; XY.path(g, sp([hx - 34, hy - 6, hx, hy - 32, hx + 34, hy - 6, hx + 38, hy + 34, hx + 10, hy + 28, hx - 38, hy + 34], 4), true); g.fillStyle = '#C0402C'; g.fill(); g.strokeStyle = ink(0.8); g.lineWidth = 1; g.stroke();
          stroke(g, [hx - 20, hy + 6, hx + 22, hy + 4], 0.8, '#E2B84E'); g.restore(); }
        if (bonk && u < 0.58) { const a = (u - 0.5) / 0.08; for (let k = 0; k < 8; k++) { const an = k / 8 * TAU + a * 2, r = 20 + 40 * a, sx = 1124 + Math.cos(an) * r, sy = CY - 104 + Math.sin(an) * r * 0.6;
          g.fillStyle = `rgba(200,150,40,${1 - a})`; g.beginPath(); for (let j = 0; j < 10; j++) { const aa = j / 10 * TAU, rr = j % 2 ? 3 : 8; g[j ? 'lineTo' : 'moveTo'](sx + Math.cos(aa) * rr, sy + Math.sin(aa) * rr); } g.fill(); } }
      } else g.drawImage(sprite('sl-wood2', S, wood), RG[0], RG[1], RG[2], RG[3]);
      // the four sages leave on auspicious clouds, from where the manor stood
      const up = XY.clamp((u - 0.6) / 0.7); if (up > 0) for (let k = 0; k < 4; k++) { const q = XY.easeOut(up), x = XY.lerp(1040 + k * 40, 420 + k * 140, q), y = XY.lerp(480, 120 + (k % 2) * 46, q) + 4 * Math.sin(t * 2 + k);
        g.save(); g.globalAlpha = XY.clamp(up * 5); g.translate(x, y); g.scale(1.9, 1.9); sageCloud(g, 0, 0, k, t); g.restore(); }
      // Bajie trussed upside down under the big pine's arm, the note pinned beside him; the rope snaps and he drops into line
      if (!ma && !joined) {
        const ph = XY.walkPhase(cell.t0 + um * cell.dur), fq = XY.clamp((u - (um - 0.06)) / 0.06), swing = (1 - fq) * 0.2 * Math.sin(t * 3.2), x = HX, y = XY.lerp(HY + 6, e.groundY, XY.easeIn(fq)), rot = Math.PI * (1 - XY.easeOut(fq)) + swing;
        if (fq <= 0) stroke(g, [HX, HY - 2, HX + Math.sin(swing) * 4, HY + 8], 2.4, '#8A7050');
        K.figure(g, 'bajie', ph, x, y, PEN, { bajie: { scratch: 0.6 + 0.4 * Math.sin(t * 9) } }, { rot });
        if (fq <= 0) { g.save(); g.translate(x, y); g.rotate(rot); [-30, -56, -82, -108].forEach(yy => stroke(g, [-30, yy - 4, 32, yy + 6], 2.4, '#8A7050')); g.restore(); }
        g.save(); g.translate(950, 306); g.rotate(0.08 * Math.sin(t * 2.4)); g.fillStyle = '#F4EEE0'; g.fillRect(-12, 4, 24, 52); g.strokeStyle = ink(0.6); g.lineWidth = 0.8; g.strokeRect(-12, 4, 24, 52);
        for (let k = 0; k < 3; k++) stroke(g, [-6 + k * 6, 10, -6 + k * 6, 50], 1.2, ink(0.6)); stroke(g, [0, 0, 0, 4], 1, ink(0.6)); g.restore();
        if (fq <= 0) { stroke(g, [826, 700, 930, 690], 3, '#7A6448'); for (let k = 0; k < 9; k++) stroke(g, [826, 684 + k * 3, 812, 682 + k * 3.3], 1.6, '#8A8A80'); }
      }
      // the mist that swallows the manor (beats 4.2–5.3)
      const sw = XY.clamp((u - 0.52) / 0.14);
      if (sw > 0 && sw < 1) { const A = Math.sin(sw * Math.PI); for (let k = 0; k < 9; k++) { const x = XY.lerp(640, 1300, sw) - k * 70 + 30 * Math.sin(k * 3), y = 300 + (k % 4) * 110, r = 230;
        g.save(); g.translate(x, y); g.scale(1, 0.6); const rg = g.createRadialGradient(0, 0, 10, 0, 0, r); rg.addColorStop(0, `rgba(244,238,222,${A})`); rg.addColorStop(0.6, `rgba(244,238,222,${0.8 * A})`); rg.addColorStop(1, 'rgba(244,238,222,0)'); g.fillStyle = rg; g.fillRect(-r, -r, 2 * r, 2 * r); g.restore(); } }
      const acts = { wukong: { shade: XY.smooth((u - 0.6) / 0.05) * (1 - XY.smooth((u - 0.8) / 0.08)) }, monk: { palm: XY.smooth((u - 0.2) / 0.06) * (1 - XY.smooth((u - 0.5) / 0.06)) },
        bajie: { scratch: joined ? XY.smooth((u - um) / 0.06) * (1 - XY.smooth((u - um - 0.2) / 0.1)) : 0 }, shaseng: { lift: XY.smooth((u - 0.62) / 0.1) * (1 - XY.smooth((u - 0.9) / 0.1)) }, cast: { bajie: joined } };
      K.team(g, e.phase, e.procX, e.groundY, PEN, acts);
    },
    post(canvas, g, e) { K.zoomPost(canvas, g, e, 1040, 520, K.zoom(e.u, [0.46, 0.52, 0.74], 1.1)); },
  };
})();
