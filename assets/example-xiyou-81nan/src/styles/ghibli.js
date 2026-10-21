// 67 吉卜力水彩 · 1988 年 · 松林救怪 — a black-pine wood painted in transparent washes (each shape deformed and
// layered with multiply, pigment pooling at the edges). A girl is bound to a pine with kudzu, her lower half buried.
// Beat 2: a gust parts the canopy, a shaft of sun lands on her, and the shadow she throws on the forest floor is a big
// mouse with round ears and a long tail; its nose flashes gold (金鼻白毛老鼠精). Pilgrims: two-tone cel with a cool
// shadow crescent, warm rim light, warm brown line, contact shadows.
(() => {
  'use strict';
  const XY = window.XY, K = XY.KIT_H, TAU = XY.TAU, { sin, cos, PI, hypot } = Math;
  const TREE = 1000, MOUND = [1000, 608];   // the girl's pine stands on a bank behind the path, out of the pilgrims' way
  const PEN = K.pen({ fur: '#A8703E', face: '#F4D8B4', wkshirt: '#D0503A', tiger: '#E8A43C', robe: '#F0D27C', kasaya: '#C8402E', skin: '#F6DCC0', horse: '#FBF8F0',
    horse2: '#E0DACC', mane: '#F0ECE2', pig: '#F4C0B4', pig2: '#E29C90', bjrobe: '#3A4250', bjpants: '#2E3440', ssrobe: '#4A6A76', ssrobe2: '#3A5660', skin2: '#C89670' }, '#5A4232', 1.3, { shade: false });
  const SIL = { color: () => '#000' };
  const DK = {}; const darker = c => DK[c] || (DK[c] = (() => { const [r, g2, b] = K.hex(c); return `rgb(${r * 0.6 | 0},${g2 * 0.55 | 0},${b * 0.55 | 0})`; })());
  const WCPEN = Object.assign({}, PEN, { outline: 'rgba(90,66,50,0.7)', ow: 0.8, wob: 0.7, seed: 67,
    part(c, p, col) { if (p.k !== 'poly' || col[0] !== '#') return false; const pts = XY.wobble(XY.densify(p.pts, 8, true), 0.7, 67 + p.pts.length);
      XY.path(c, pts, true); c.globalAlpha = 0.9; c.fillStyle = col; c.fill(); c.globalAlpha = 0.6; c.strokeStyle = darker(col); c.lineWidth = 1.7; c.lineJoin = 'round'; c.stroke(); c.globalAlpha = 1; return true; } });
  const blotchTile = () => XY.keep('gb-blotch', 256, 256, cv => { const g = cv.getContext('2d'), r = XY.rng(671); for (let k = 0; k < 46; k++) { const x = r() * 256, y = r() * 256, rr = 8 + r() * 34;
    for (const dx of [-256, 0, 256]) for (const dy of [-256, 0, 256]) { const gr = g.createRadialGradient(x + dx, y + dy, 0, x + dx, y + dy, rr); gr.addColorStop(0, `rgba(0,0,0,${0.12 + 0.14 * r()})`); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(x + dx - rr, y + dy - rr, 2 * rr, 2 * rr); } } });

  // ------------------------------------------------------------ watercolour: mid-point deformation + layered transparent washes
  const deform = (pts, depth, amp, r) => { let P = pts;
    for (let d = 0; d < depth; d++) { const o = [];
      for (let i = 0; i < P.length; i += 2) { const x0 = P[i], y0 = P[i + 1], j = (i + 2) % P.length, x1 = P[j], y1 = P[j + 1], len = hypot(x1 - x0, y1 - y0) || 1;
        const gq = (r() + r() + r() - 1.5) * amp * Math.min(1, len / 80); o.push(x0, y0, (x0 + x1) / 2 - (y1 - y0) / len * gq, (y0 + y1) / 2 + (x1 - x0) / len * gq); }
      P = o; amp *= 0.6; }
    return P; };
  const wc = (g, pts, color, o = {}) => { const r = XY.rng(o.seed || 1), base = deform(pts, 3, o.amp || 10, r);
    g.save(); g.globalCompositeOperation = o.blend || 'multiply';
    for (let l = 0; l < (o.layers || 4); l++) { const P = deform(base, 2, (o.amp || 10) * 0.6, r); XY.path(g, P, true);
      g.globalAlpha = o.alpha || 0.3; g.fillStyle = color; g.fill(); g.globalAlpha = o.edge == null ? 0.12 : o.edge; g.strokeStyle = color; g.lineWidth = 1.5; g.stroke(); }
    g.restore(); };
  const rect = (x, y, w, h) => [x, y, x + w, y, x + w, y + h, x, y + h];
  // a black-pine silhouette: trunk plus flat, cloud-like needle pads stepping up
  const pine = (x, base, h, wd, seed) => { const r = XY.rng(seed), pads = [];
    for (let k = 0; k < 5; k++) { const y = base - h * (0.35 + k * 0.14), w = wd * (1.1 - k * 0.17) * (0.8 + 0.4 * r()), cx = x + (r() - 0.5) * wd * 0.5; pads.push(XY.ellipse(cx, y, w, 14 + 10 * r(), 16)); }
    return { trunk: rect(x - 5, base - h * 0.95, 10, h * 0.95), pads }; };
  const grainTile = () => XY.keep('gb-grain', 256, 256, cv => { const g = cv.getContext('2d'), im = g.createImageData(256, 256), d = im.data, r = XY.rng(67);
    for (let i = 0; i < d.length; i += 4) { const v = 200 + 55 * r(); d[i] = v; d[i + 1] = v * 0.98; d[i + 2] = v * 0.92; d[i + 3] = 255; } g.putImageData(im, 0, 0); });

  const paintBg = (g, W, H, scale) => {
    // sky light through the wood, warm at the upper left
    let gr = g.createLinearGradient(0, 0, W, 500); gr.addColorStop(0, '#FBF4DC'); gr.addColorStop(0.5, '#E6EEDC'); gr.addColorStop(1, '#C8DCD0'); g.fillStyle = gr; g.fillRect(0, 0, W, H);
    // three ranks of far pines, bluer and paler with distance: irregular spacing, a few flat needle pads each, a soft wall of foliage behind
    [['#A6C2B8', 520, 250, 0.16], ['#7AA096', 560, 300, 0.2], ['#557C70', 600, 350, 0.26]].forEach(([c, base, h, a], rank) => {
      const r = XY.rng(6700 + rank); let x = -30 - r() * 60;
      const wall = [-40, base + 20]; for (let q = -40; q <= W + 40; q += 40) wall.push(q, base - h * (0.42 + 0.22 * XY.noise1(q * 0.012, rank + 3))); wall.push(W + 40, base + 20);
      wc(g, wall, c, { alpha: a * 0.7, layers: 3, amp: 26, seed: 600 + rank });
      while (x < W + 60) { const hh = h * (0.75 + 0.5 * r()), np = 2 + Math.floor(r() * 3);
        wc(g, rect(x - 3, base - hh * 0.95, 6, hh * 0.95), c, { alpha: a, layers: 2, amp: 3, seed: Math.floor(x) + rank });
        for (let k = 0; k < np; k++) { const y = base - hh * (0.5 + 0.5 * (k + r() * 0.6) / np), w = 34 + 80 * r() * (1 - k * 0.2), cx = x + (r() - 0.5) * 60;
          wc(g, XY.ellipse(cx, y, w, 10 + 14 * r(), 16), c, { alpha: a, layers: 3, amp: 18, seed: Math.floor(x * 3) + k + rank * 100 }); }
        x += 70 + r() * 130; }
      const hz = g.createLinearGradient(0, base - h, 0, base + 20); hz.addColorStop(0, 'rgba(236,240,226,0)'); hz.addColorStop(1, `rgba(236,240,226,${0.25 + 0.1 * rank})`); g.fillStyle = hz; g.fillRect(0, base - h, W, h + 20); });
    // haze between the ranks and the forest floor
    gr = g.createLinearGradient(0, 420, 0, 640); gr.addColorStop(0, 'rgba(240,244,230,0)'); gr.addColorStop(1, 'rgba(236,240,222,0.55)'); g.fillStyle = gr; g.fillRect(0, 420, W, 220);
    wc(g, [0, 600, W, 586, W, H, 0, H], '#B4C08A', { alpha: 0.5, layers: 4, amp: 18, seed: 5 });
    wc(g, [0, 640, W, 630, W, H, 0, H], '#9AAE70', { alpha: 0.35, layers: 3, amp: 22, seed: 6 });
    for (let k = 0; k < 22; k++) { const x = XY.hash(k, 31) * W, y = 610 + XY.hash(k, 32) * 80; wc(g, XY.ellipse(x, y, 30 + 50 * XY.hash(k, 33), 6 + 6 * XY.hash(k, 34), 12), k % 3 ? '#7E9A5C' : '#C8B47A', { alpha: 0.22, layers: 2, amp: 10, seed: 40 + k }); }
    // the path the pilgrims walk, warm ochre, edged with grass
    wc(g, [0, 690, W, 694, W, H, 0, H], '#D6C294', { alpha: 0.55, layers: 4, amp: 8, seed: 7, blend: 'source-over' });
    wc(g, [0, 700, W, 704, W, 716, 0, 712], '#B49A6A', { alpha: 0.35, layers: 3, amp: 5, seed: 8 });
    for (let k = 0; k < 18; k++) { const x = XY.hash(k, 41) * W; wc(g, XY.ellipse(x, 740 + 30 * XY.hash(k, 42), 20 + 30 * XY.hash(k, 43), 4, 10), '#A88A5C', { alpha: 0.25, layers: 2, amp: 6, seed: 50 + k }); }
    // five big pines in the middle ground: lit left edge, bark strokes, roots
    wc(g, [TREE - 170, 640, TREE - 90, 600, TREE + 80, 596, TREE + 190, 640], '#8EA466', { alpha: 0.6, layers: 3, amp: 10, seed: 59, blend: 'source-over' });
    [[90, 54], [330, 40], [600, 46], [TREE, 38], [1150, 58]].forEach(([x, w], i) => { const base = i === 3 ? 612 : 694 - 8 * (i % 2);
      wc(g, rect(x - w / 2, -20, w, base + 20), '#8A5640', { alpha: 0.55, layers: 4, amp: 4, seed: 60 + i, edge: 0.2 });
      wc(g, rect(x - w / 2, -20, w * 0.3, base + 20), '#E8A86C', { alpha: 0.3, layers: 2, amp: 3, seed: 70 + i, blend: 'source-over' });
      for (let s = 0; s < 14; s++) { const yy = 40 + XY.hash(s, i) * (base - 80), xx = x - w / 2 + 6 + XY.hash(s, i + 9) * (w - 12); g.strokeStyle = 'rgba(70,40,30,0.35)'; g.lineWidth = 1.6; g.beginPath(); g.moveTo(xx, yy); g.lineTo(xx + 3, yy + 20 + 30 * XY.hash(s, i + 3)); g.stroke(); }
      wc(g, [x - w / 2 - 26, base + 4, x - w / 2, base - 26, x + w / 2, base - 26, x + w / 2 + 30, base + 6], '#7A4C38', { alpha: 0.45, layers: 3, amp: 6, seed: 80 + i }); });
    // a pine bough across the top left for the sign to hang from
    wc(g, [0, 52, 300, 40, 300, 54, 0, 66], '#6A4232', { alpha: 0.6, layers: 3, amp: 4, seed: 90 });
    // ferns in the front corners and white flowers along the path
    [[30, 760, 1], [1150, 770, -1], [470, 776, 1]].forEach(([x, y, d], k) => { for (let f = 0; f < 6; f++) { const a = -PI / 2 + d * (0.3 + f * 0.25), l = 60 + 20 * XY.hash(f, k);
      const P = []; for (let j = 0; j <= 8; j++) { const q = j / 8, ax = x + cos(a) * l * q + d * 10 * q * q, ay = y + sin(a) * l * q + 14 * q * q; P.push(ax, ay); }
      g.strokeStyle = 'rgba(60,96,50,0.7)'; g.lineWidth = 2; XY.path(g, P, false); g.stroke();
      for (let j = 1; j < 8; j++) { const px = P[2 * j], py = P[2 * j + 1]; wc(g, XY.ellipse(px + 5, py - 3, 7, 2.6, 6, a + 0.9), '#5E8A4A', { alpha: 0.4, layers: 1, amp: 2, seed: k * 100 + f * 10 + j, edge: 0 }); wc(g, XY.ellipse(px - 5, py + 3, 7, 2.6, 6, a - 0.9), '#5E8A4A', { alpha: 0.4, layers: 1, amp: 2, seed: k * 100 + f * 10 + j + 5, edge: 0 }); } } });
    for (let k = 0; k < 26; k++) { const x = XY.hash(k, 51) * W, y = 700 + XY.hash(k, 52) * 12; g.fillStyle = 'rgba(255,255,250,0.9)'; for (let p = 0; p < 5; p++) { g.beginPath(); g.arc(x + cos(p * 1.26) * 2.6, y + sin(p * 1.26) * 2.6, 1.9, 0, TAU); g.fill(); } g.fillStyle = '#E8C040'; g.beginPath(); g.arc(x, y, 1.2, 0, TAU); g.fill(); }
    // paper grain
    g.save(); g.globalCompositeOperation = 'multiply'; g.globalAlpha = 0.35; g.fillStyle = g.createPattern(grainTile(), 'repeat'); g.fillRect(0, 0, W, H); g.restore();
  };

  // ------------------------------------------------------------ sprites painted once per scale
  const canopy = (S, W) => XY.keep(`gb-canopy:${S.toFixed(4)}:${W}`, (W + 80) * S, 330 * S, cv => {
    const g = cv.getContext('2d'); g.scale(S, S); g.translate(40, 30);
    wc(g, [-40, -30, W + 40, -30, W + 40, 60, W * 0.7, 90, W * 0.4, 70, -40, 100], '#2C4C3C', { alpha: 0.5, layers: 4, amp: 30, seed: 3 });
    [[90, 120, 170], [330, 90, 150], [600, 130, 160], [930, 70, 190], [1110, 110, 170], [200, 40, 140], [760, 50, 150], [470, 30, 120]].forEach(([x, y, w], k) => {
      if (x > W + 60) return;
      wc(g, XY.ellipse(x, y, w, 42, 18), '#2E5440', { alpha: 0.5, layers: 4, amp: 22, seed: 10 + k });
      wc(g, XY.ellipse(x - 30, y - 22, w * 0.7, 20, 14), '#6E9A5A', { alpha: 0.32, layers: 3, amp: 16, seed: 30 + k, blend: 'source-over' });
      wc(g, XY.ellipse(x - 60, y - 30, w * 0.35, 9, 10), '#C8D890', { alpha: 0.35, layers: 2, amp: 8, seed: 50 + k, blend: 'source-over' }); });
  });
  const mound = S => XY.keep(`gb-mound:${S.toFixed(4)}`, 220 * S, 90 * S, cv => { const g = cv.getContext('2d'); g.scale(S, S); g.translate(110, 50);
    wc(g, [-80, 20, -60, -12, -20, -26, 30, -24, 66, -8, 86, 22], '#8A6A4C', { alpha: 0.6, layers: 4, amp: 8, seed: 4, blend: 'source-over' });
    wc(g, [-50, -10, -10, -24, 30, -22, 50, -10, 10, -12], '#C0A276', { alpha: 0.5, layers: 2, amp: 5, seed: 5, blend: 'source-over' });
    for (let k = 0; k < 14; k++) { const x = -70 + k * 11, h = 8 + 10 * XY.hash(k, 6); g.strokeStyle = 'rgba(70,110,50,0.8)'; g.lineWidth = 2; g.beginPath(); g.moveTo(x, 18); g.quadraticCurveTo(x + 2, 18 - h * 0.6, x + 4 * (XY.hash(k, 7) - 0.3), 18 - h); g.stroke(); } });
  const sign = S => XY.keep(`gb-sign:${S.toFixed(4)}`, 240 * S, 140 * S, cv => { const g = cv.getContext('2d'); g.scale(S, S); g.translate(5, 5);
    wc(g, rect(0, 0, 230, 128), '#C89A64', { alpha: 0.75, layers: 4, amp: 3, seed: 7, blend: 'source-over', edge: 0.35 });
    for (let k = 0; k < 9; k++) { g.strokeStyle = 'rgba(110,70,40,0.35)'; g.lineWidth = 1.2; g.beginPath(); const y = 10 + k * 13 + 3 * XY.hash(k, 8); g.moveTo(4, y); g.bezierCurveTo(70, y + 4 * sin(k), 150, y - 4, 226, y + 2); g.stroke(); }
    g.fillStyle = '#4A3428'; [[14, 12], [216, 12]].forEach(([x, y]) => { g.beginPath(); g.arc(x, y, 3, 0, TAU); g.fill(); });
    g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = 'rgba(46,78,52,0.92)'; g.font = XY.font(64, XY.cnFont.kai, 'bold'); g.fillText('救怪', 115, 54);
    g.fillStyle = 'rgba(120,52,36,0.9)'; g.font = XY.font(26, XY.cnFont.kai, 'bold'); g.fillText('第六十七难', 115, 106); });

  // ------------------------------------------------------------ the bound girl, and the shadow that gives her away
  const LINE = '#5A4232';
  const girl = (g, t, glint, smirk = 0) => {
    g.save(); g.translate(TREE - 4, 606); g.scale(0.72, 0.72); g.lineJoin = 'round'; g.lineCap = 'round'; g.strokeStyle = LINE; g.lineWidth = 1.3;
    const sob = 1.4 * sin(t * 5.5), body = XY.RIG.spline([-22, 4, -27, -40, -25, -78 + sob, -8, -87 + sob, 12, -85 + sob, 23, -74, 21, -38, 19, 4], true, 4);
    XY.path(g, body, true); g.fillStyle = '#EEE6F2'; g.fill();
    g.save(); g.clip(); g.fillStyle = '#C8BCDA'; g.beginPath(); g.ellipse(22, -40, 20, 52, 0, 0, TAU); g.fill(); g.restore(); XY.path(g, body, true); g.stroke();
    g.strokeStyle = '#D86A84'; g.lineWidth = 2; g.beginPath(); g.moveTo(-14, -84 + sob); g.lineTo(-2, -64); g.lineTo(10, -84 + sob); g.stroke(); g.strokeStyle = LINE; g.lineWidth = 1.3;
    const hd = [-4, -103 + sob * 0.6];
    g.fillStyle = '#2A2430'; g.beginPath(); g.ellipse(hd[0] + 6, hd[1] - 2, 17, 18, 0, 0, TAU); g.fill(); g.beginPath(); g.arc(hd[0] + 10, hd[1] - 20, 8, 0, TAU); g.arc(hd[0] - 6, hd[1] - 22, 7, 0, TAU); g.fill();
    g.fillStyle = '#F6DCC8'; g.beginPath(); g.ellipse(hd[0] - 2, hd[1] + 3, 12.5, 14.5, 0, 0, TAU); g.fill(); g.stroke();
    g.fillStyle = '#2A2430'; g.beginPath(); g.moveTo(hd[0] - 14, hd[1] - 2); g.quadraticCurveTo(hd[0] - 6, hd[1] - 16, hd[0] + 12, hd[1] - 8); g.lineTo(hd[0] + 4, hd[1] - 14); g.fill();
    const rib = []; for (let k = 0; k <= 6; k++) rib.push(hd[0] + 14 + k * 5, hd[1] - 22 + k * 3 + 3 * sin(t * 6 - k * 0.8) * (k / 6));
    g.strokeStyle = '#E07890'; g.lineWidth = 3; XY.path(g, rib, false); g.stroke(); g.fillStyle = '#E8C040'; g.beginPath(); g.arc(hd[0] + 2, hd[1] - 24, 2.2, 0, TAU); g.fill();
    g.fillStyle = '#2A2430'; [[-9, 2], [1, 1]].forEach(([dx, dy]) => { g.beginPath(); g.ellipse(hd[0] + dx, hd[1] + dy, 2.2, 3.2, 0, 0, TAU); g.fill(); });
    g.fillStyle = '#FFF'; [[-8.4, 0.8], [1.6, -0.2]].forEach(([dx, dy]) => { g.beginPath(); g.arc(hd[0] + dx, hd[1] + dy, 0.9, 0, TAU); g.fill(); });
    g.strokeStyle = LINE; g.lineWidth = 1.2; g.beginPath(); g.moveTo(hd[0] - 12, hd[1] - 4); g.lineTo(hd[0] - 6, hd[1] - 5.5); g.moveTo(hd[0] - 1, hd[1] - 6); g.lineTo(hd[0] + 5, hd[1] - 4.5); g.stroke();
    if (smirk > 0.5) { g.lineWidth = 1.6; g.beginPath(); g.moveTo(hd[0] - 9, hd[1] + 9); g.quadraticCurveTo(hd[0] - 4, hd[1] + 13, hd[0] + 1, hd[1] + 7); g.stroke(); }   // a sly smile for a moment
    else { g.beginPath(); g.moveTo(hd[0] - 7, hd[1] + 10); g.quadraticCurveTo(hd[0] - 4, hd[1] + 8.6, hd[0] - 1, hd[1] + 10); g.stroke(); }
    g.fillStyle = 'rgba(240,130,130,0.4)'; g.beginPath(); g.ellipse(hd[0] - 10, hd[1] + 6, 3, 1.8, 0, 0, TAU); g.ellipse(hd[0] + 4, hd[1] + 6, 3, 1.8, 0, 0, TAU); g.fill();
    const tear = (t * 0.9) % 1; g.fillStyle = 'rgba(170,210,240,0.9)'; g.beginPath(); g.ellipse(hd[0] - 10, hd[1] + 4 + tear * 9, 1.3, 2, 0, 0, TAU); g.fill();
    if (glint > 0.01) { const s = 7 * glint, x = hd[0] - 14, y = hd[1] + 5; g.fillStyle = `rgba(255,214,90,${glint})`; g.beginPath(); g.moveTo(x - s, y); g.lineTo(x, y - s * 0.25); g.lineTo(x + s, y); g.lineTo(x, y + s * 0.25); g.fill(); g.beginPath(); g.moveTo(x, y - s); g.lineTo(x + s * 0.25, y); g.lineTo(x, y + s); g.lineTo(x - s * 0.25, y); g.fill(); }
    // kudzu vines round her and the trunk, with three-lobed leaves
    [-74, -46, -18].forEach((y, k) => { g.strokeStyle = '#3E6A30'; g.lineWidth = 4.5; g.beginPath(); g.moveTo(-34, y - 6); g.quadraticCurveTo(0, y + 8 + 2 * sin(t * 2 + k), 34, y - 4); g.stroke();
      g.strokeStyle = '#7AA64C'; g.lineWidth = 1.6; g.stroke();
      [[-20, 1], [8, 3], [26, -2]].forEach(([x, dy], j) => { const lx = x, ly = y + dy + 4, a = 0.6 * sin(t * 3 + j + k);
        g.fillStyle = j % 2 ? '#5E8C3E' : '#4E7A34'; for (let l = -1; l <= 1; l++) { g.beginPath(); g.ellipse(lx + cos(a + l * 1.1 + PI / 2) * 6, ly + sin(a + l * 1.1 + PI / 2) * 6, 5, 3, a + l * 1.1 + PI / 2, 0, TAU); g.fill(); } }); });
    g.restore();
  };
  // her shadow, laid back across the forest floor (upright silhouette sheared onto the ground): a mouse
  const mouseShadow = (g, t, a, flick, nose) => {
    g.save(); g.transform(0.9, 0.1, 0.8, -0.59, 1000, 612); g.filter = 'blur(1.5px)'; g.globalCompositeOperation = 'multiply'; g.fillStyle = `rgba(16,14,30,${a})`;
    XY.path(g, XY.RIG.spline([-34, 0, -40, -60, -30, -120, 0, -136, 30, -120, 40, -60, 34, 0], true, 4), true); g.fill();
    g.beginPath(); g.ellipse(-6, -160, 33, 30, 0, 0, TAU); g.fill(); g.beginPath(); g.moveTo(-28, -174); g.lineTo(-66, -152); g.lineTo(-28, -142); g.fill();
    g.beginPath(); g.arc(-28, -198, 24, 0, TAU); g.fill(); g.beginPath(); g.arc(22, -196, 25, 0, TAU); g.fill();
    const tail = []; for (let j = 0; j <= 12; j++) tail.push(34 + j * 11, -4 - j * 7 + (6 + 26 * flick) * sin(j * 0.55 - t * 6) * (j / 12));
    XY.path(g, XY.RIG.ribbon(tail, 14, 3), true); g.fill();
    g.filter = 'none'; g.globalCompositeOperation = 'source-over'; g.strokeStyle = `rgba(16,14,30,${a * 0.8})`; g.lineWidth = 2.4;
    [[-60, -158, -96, -170], [-60, -152, -98, -150], [-58, -147, -92, -132]].forEach(L => { XY.path(g, L, false); g.stroke(); });
    const ea = Math.min(1, Math.max(nose, (a - 0.3) * 2)); if (ea > 0.01) { const gr = g.createRadialGradient(-22, -166, 0, -22, -166, 22); gr.addColorStop(0, `rgba(255,60,50,${ea})`); gr.addColorStop(0.3, `rgba(255,60,50,${0.5 * ea})`); gr.addColorStop(1, 'rgba(255,60,50,0)');
      g.fillStyle = gr; g.fillRect(-44, -188, 44, 44); g.fillStyle = `rgba(255,220,200,${ea})`; g.beginPath(); g.arc(-22, -166, 3, 0, TAU); g.fill(); }
    if (nose > 0.01) { g.fillStyle = `rgba(255,210,80,${nose})`; g.beginPath(); g.arc(-64, -152, 9 * nose + 2, 0, TAU); g.fill(); }
    g.restore(); };

  // ------------------------------------------------------------ the cell
  const HIT = 0.5, GLINT = 0.6, FIGX = [[-300, 34], [-150, 34], [40, 80], [245, 34]];
  // crows burst out of the canopy on beat 2.4 (an omen) and wheel away
  const crows = (g, u, t) => { const q = (u - 0.3) / 0.35; if (q < 0 || q > 1) return; g.save(); g.fillStyle = 'rgba(40,40,52,0.85)';
    for (let k = 0; k < 7; k++) { const d = q * (1 + 0.4 * XY.hash(k, 1)), x = 1000 - 520 * d * (0.7 + 0.5 * XY.hash(k, 2)) + 30 * k * (1 - d), y = 120 - 90 * d + 40 * XY.hash(k, 3) - 120 * d * d, f = sin(t * 18 + k * 1.7), s = 1.2 - 0.4 * d;
      g.beginPath(); g.moveTo(x - 16 * s, y - 8 * s * f); g.quadraticCurveTo(x - 6 * s, y - 2 * s, x, y + 2 * s); g.quadraticCurveTo(x + 6 * s, y - 2 * s, x + 16 * s, y - 8 * s * f); g.quadraticCurveTo(x + 6 * s, y + 2 * s, x, y + 5 * s); g.quadraticCurveTo(x - 6 * s, y + 2 * s, x - 16 * s, y - 8 * s * f); g.fill(); }
    g.restore(); };
  XY.STYLES.ghibli = {
    hits: [4, 4.8],
    post(canvas, g, e) { K.zoomPost(canvas, g, e, 900, 700, K.push(e.beat, 3.85, 6.4, 0.12)); },
    bg(g, W, H, c, scale) { paintBg(g, W, H, scale); },
    draw(g, e) {
      const { W, H, t, u } = e, S = e.S, tHit = e.cell.t0 + HIT * e.cell.dur;
      const rev = XY.smooth((u - 0.47) / 0.05) * (1 - 0.55 * XY.smooth((u - 0.86) / 0.1)), gust = K.win(t - tHit, -0.08, 0.8, 0.14), glint = K.win(u, GLINT - 0.01, GLINT + 0.06, 0.015);
      // light: slanting shafts, and the one the gust opens onto the girl
      g.save(); g.globalCompositeOperation = 'screen';
      [[120, 0.10], [340, 0.08], [540, 0.12], [760, 0.06]].forEach(([x, a], k) => { const A = a * (0.75 + 0.25 * sin(t * 0.7 + k)), gr = g.createLinearGradient(x, -40, x + 360, 700);
        gr.addColorStop(0, `rgba(255,244,200,${A})`); gr.addColorStop(1, 'rgba(255,244,200,0)'); g.fillStyle = gr; g.beginPath(); g.moveTo(x - 20, -40); g.lineTo(x + 40, -40); g.lineTo(x + 420, 720); g.lineTo(x + 300, 720); g.fill(); });
      if (rev > 0) { let gr = g.createLinearGradient(1120, -40, 900, 680); gr.addColorStop(0, `rgba(255,240,190,${0.42 * rev})`); gr.addColorStop(1, `rgba(255,236,170,${0.14 * rev})`); g.fillStyle = gr;
        g.beginPath(); g.moveTo(1130, -40); g.lineTo(1250, -40); g.lineTo(1070, 640); g.lineTo(930, 640); g.fill();
        gr = g.createRadialGradient(1040, 640, 10, 1040, 640, 220); gr.addColorStop(0, `rgba(255,236,170,${0.5 * rev})`); gr.addColorStop(1, 'rgba(255,236,170,0)'); g.fillStyle = gr; g.fillRect(620, 440, 560, 340); }
      g.restore();
      const sw = 3 * sin(t * 0.9) + 9 * gust * sin(t * 6); g.drawImage(canopy(S, W), -40 + sw, -30, W + 80, 330);
      mouseShadow(g, t, 0.06 + 0.82 * rev, rev * (0.4 + 0.6 * K.win(u, 0.5, 0.75, 0.04)), glint);
      crows(g, u, t);
      girl(g, t, glint, K.win(u, GLINT - 0.01, GLINT + 0.08, 0.01)); g.drawImage(mound(S), MOUND[0] - 80, MOUND[1] - 36, 160, 65);
      // komorebi: sun flecks drifting on the floor and trunks
      g.save(); g.globalCompositeOperation = 'screen';
      for (let k = 0; k < 28; k++) { const x = XY.hash(k, 61) * W + 10 * XY.noise1(t * 0.5 + k, 3), y = k < 18 ? 600 + XY.hash(k, 62) * 100 : 120 + XY.hash(k, 62) * 480, r = 10 + 22 * XY.hash(k, 63), b = 0.5 + 0.5 * sin(t * 2.5 + k * 1.7);
        const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, `rgba(255,236,170,${0.32 * b})`); gr.addColorStop(1, 'rgba(255,236,170,0)'); g.fillStyle = gr;
        g.save(); g.translate(x, y); g.scale(1, k < 18 ? 0.35 : 1); g.translate(-x, -y); g.fillRect(x - r, y - r, 2 * r, 2 * r); g.restore(); }
      g.restore();
      // the signboard on its ropes
      { const th = 0.025 * sin(t * 1.5) + 0.07 * gust * sin(t * 5); g.save(); g.translate(150, 56); g.rotate(th);
        g.strokeStyle = 'rgba(90,64,44,0.9)'; g.lineWidth = 2; g.beginPath(); g.moveTo(-100, 0); g.lineTo(-100, 46); g.moveTo(100, 0); g.lineTo(100, 46); g.stroke();
        g.drawImage(sign(S), -120, 35, 240, 140); g.restore(); }
      this.pilgrims(g, e);
      this.grass(g, e, gust, tHit);
      // pine needles falling, motes in the light
      g.save(); g.strokeStyle = 'rgba(110,80,50,0.7)'; g.lineWidth = 1.4;
      for (let k = 0; k < 12; k++) { const x = XY.hash(k, 71) * W + 30 * sin(t * 0.8 + k) - gust * 60, y = ((t * 46 + XY.hash(k, 72) * (H + 40)) % (H + 40)) - 20, a = t * 2 + k;
        g.beginPath(); g.moveTo(x - cos(a) * 6, y - sin(a) * 6); g.lineTo(x + cos(a) * 6, y + sin(a) * 6); g.stroke(); }
      g.fillStyle = 'rgba(255,250,220,0.8)'; for (let k = 0; k < 24; k++) { const x = 200 + XY.hash(k, 81) * 800 + 20 * XY.noise1(t * 0.3 + k, 5), y = 150 + XY.hash(k, 82) * 450 - (t * 8 % 60), tw = 0.5 + 0.5 * sin(t * 3 + k);
        g.globalAlpha = tw; g.beginPath(); g.arc(x, y, 1.6, 0, TAU); g.fill(); }
      g.restore();
    },
    // pilgrims in watercolour: each part a transparent wash with pigment pooled at its edge, uneven fill, paper grain, a soft cool shadow side
    pilgrims(g, e) {
      const { u } = e, S = e.S, px = e.procX, gy = e.groundY, bx = px - 410, by = gy - 300, bw = 760, bh = 312;
      if (bx > e.W + 10 || bx + bw < -10) return;
      const w = Math.ceil(bw * S), h = Math.ceil(bh * S);
      const acts = { wukong: { shade: K.win(u, 0.3, 0.52, 0.05), raise: K.win(u, 0.55, 0.78, 0.04) }, monk: { palm: K.win(u, 0.2, 0.9, 0.05) }, bajie: { scratch: K.win(u, 0.72, 1.0, 0.05) }, shaseng: { lift: K.win(u, 0.5, 0.58, 0.025) } };
      g.save(); g.globalCompositeOperation = 'multiply'; g.fillStyle = 'rgba(80,90,50,0.32)'; FIGX.forEach(([dx, rx]) => { g.beginPath(); g.ellipse(px + dx, gy + 3, rx, 6, 0, 0, TAU); g.fill(); }); g.restore();
      const lay = XY.scratch('gb-lay', w, h), lg = lay.getContext('2d'); lg.setTransform(S, 0, 0, S, -bx * S, -by * S); XY.drawProcession(lg, e.phase, px, gy, WCPEN, acts);
      const band = (dx, dy, col, key) => { const m = XY.scratch(key, w, h), mg = m.getContext('2d'); mg.fillStyle = col; mg.fillRect(0, 0, w, h); mg.globalCompositeOperation = 'destination-out';
        mg.setTransform(S, 0, 0, S, -bx * S, -by * S); XY.drawProcession(mg, e.phase, px + dx, gy + dy, SIL, acts); return m; };
      lg.setTransform(1, 0, 0, 1, 0, 0); lg.globalCompositeOperation = 'source-atop';
      lg.drawImage(band(-5, -4, 'rgba(70,80,130,0.24)', 'gb-sh'), 0, 0);
      lg.globalCompositeOperation = 'multiply'; lg.globalAlpha = 0.5; lg.fillStyle = lg.createPattern(grainTile(), 'repeat'); lg.fillRect(0, 0, w, h); lg.globalAlpha = 1;
      lg.globalCompositeOperation = 'destination-out'; lg.drawImage(band(0, 0, '#000', 'gb-mask'), 0, 0);   // band() is the inverse silhouette: clear the grain outside the figures
      lg.globalCompositeOperation = 'destination-out'; lg.fillStyle = lg.createPattern(blotchTile(), 'repeat'); lg.fillRect(0, 0, w, h);
      g.drawImage(lay, bx, by, bw, bh);
    },
    // foreground grass: blades bend with the wind wave, a gust sweeps right to left on beat 2
    grass(g, e, gust, tHit) {
      const { W, t } = e, gx = W + 120 - (t - tHit + 0.1) * 1100;
      for (let pass = 0; pass < 2; pass++) { g.beginPath();
        for (let k = pass; k < 320; k += 2) { const cl = Math.floor(k / 8), x = XY.hash(cl, 94) * (W + 40) - 20 + 22 * (XY.hash(k, 91) - 0.5), yb = 728 + 54 * XY.hash(cl, 92) + 6 * XY.hash(k, 95), h = (12 + 40 * XY.hash(k, 93)) * (0.6 + 0.6 * XY.hash(cl, 96)) * (x > 780 && x < 1000 ? 0.3 : 1);
          const wv = 0.5 + 0.5 * sin(3.1 * t - 0.018 * x), gs = gust > 0 ? 1.5 * Math.exp(-Math.pow((x - gx) / 150, 2)) : 0, b = (0.18 + 0.32 * wv + gs) * h * 0.6;
          g.moveTo(x - 2.4, yb); g.quadraticCurveTo(x - b * 0.3, yb - h * 0.6, x - b, yb - h); g.quadraticCurveTo(x - b * 0.3 + 2, yb - h * 0.55, x + 2.4, yb); }
        g.fillStyle = pass ? 'rgba(92,140,70,0.92)' : 'rgba(64,108,58,0.92)'; g.fill(); }
    },
  };
})();
