// 74 涂鸦模板 · 会庆钉钯 — a concrete wall of spray-paint stencils outside 黄狮精's cave: the stolen 九齿钉钯 and
// 金箍棒 are enshrined as the treasure of the 钉钯嘉会, with a feast below and the host on a paste-up poster.
// The weapons peel off the wall like wet stencils and fly back into the pilgrims' hands; a red X lands on the lion.
(() => {
  'use strict';
  const XY = window.XY, K = XY.KIT_I, TAU = XY.TAU, { sin, cos, PI, hypot, atan2 } = Math;
  const BLK = '#161514', RED = '#D3262B', WHT = '#F1EEE6', YEL = '#E3B232', GRY = '#77736C', LGR = '#C9C4BA', WALL = '#BDB7AC', KRAFT = '#C49F6C';
  const HEI = '"Heiti SC", "PingFang SC", sans-serif';
  const ST = [[784, 196], [498, 452]], RK = [[784, 452], [498, 196]], ZH = [[641, 476], [641, 176]];   // wall poses: staff butt→tip, rake grip→head
  const pits = () => K.speckle('i74pits', 256, 2600, ['#000'], 0.8, 2.2, 741);

  // spray one stencil: shapes painted black → tinted → overspray haze under a crisp, slightly pitted coat
  const sprayCv = (w, h, S, col, paint, mist = 1) => {
    const A = XY.mk(w * S, h * S), a = A.getContext('2d'); a.setTransform(S, 0, 0, S, 0, 0); a.fillStyle = a.strokeStyle = '#000'; a.lineCap = a.lineJoin = 'round'; paint(a);
    a.setTransform(1, 0, 0, 1, 0, 0); a.globalCompositeOperation = 'source-in'; a.fillStyle = col; a.fillRect(0, 0, A.width, A.height);
    const C = XY.mk(w * S, h * S), c = C.getContext('2d');
    if (mist) { c.filter = `blur(${5 * S}px)`; c.globalAlpha = 0.3 * mist; c.drawImage(A, 0, 0); c.filter = 'none'; c.globalAlpha = 1; }
    c.drawImage(A, 0, 0); c.globalCompositeOperation = 'destination-out'; c.globalAlpha = 0.45; c.fillStyle = c.createPattern(pits(), 'repeat'); c.fillRect(0, 0, C.width, C.height);
    return C;
  };
  const cap = (g, a, b, r) => { g.lineWidth = 2 * r; g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.stroke(); };
  const along = (a, b, d) => { const l = hypot(b[0] - a[0], b[1] - a[1]); return [a[0] + (b[0] - a[0]) * d / l, a[1] + (b[1] - a[1]) * d / l]; };
  // 金箍棒 between butt s0 and tip s1, rig proportions (146 long): red bar, gold bands at both ends
  const staff = (g, s0, s1, k, cols) => { g.strokeStyle = cols[0]; cap(g, s0, s1, 3.6 * k); g.strokeStyle = cols[1]; cap(g, s0, along(s0, s1, 11 * k), 4.4 * k); cap(g, along(s1, s0, 11 * k), s1, 4.4 * k); };
  // 九齿钉钯 from grip to head, rig proportions: shaft 18 behind the grip, bar ±21, nine teeth 13 long
  const rake = (g, grip, head, k, cols) => {
    const rd = atan2(head[1] - grip[1], head[0] - grip[0]), back = along(grip, head, -18 * k), px = -sin(rd), py = cos(rd);
    g.strokeStyle = cols[0]; cap(g, back, head, 2.6 * k);
    g.strokeStyle = cols[1]; cap(g, [head[0] + px * 21 * k, head[1] + py * 21 * k], [head[0] - px * 21 * k, head[1] - py * 21 * k], 3.2 * k);
    g.fillStyle = cols[1]; g.beginPath(); g.arc(head[0], head[1], 5 * k, 0, TAU); g.fill();
    const ta = rd - PI / 2 - 0.9;
    for (let i = 0; i < 9; i++) { const v = (i / 8 - 0.5) * 42 * k, b = [head[0] + px * v, head[1] + py * v]; cap(g, b, [b[0] + cos(ta) * 13 * k, b[1] + sin(ta) * 13 * k], 1.4 * k); }
  };
  // 降妖宝杖: a straight staff with a ring head and three pearls
  const zhang = (g, a, b, k, cols) => { g.strokeStyle = cols[0]; cap(g, a, b, 3 * k); const d = along(b, a, 11 * k); g.strokeStyle = cols[1]; g.lineWidth = 3 * k; g.beginPath(); g.arc(b[0], b[1], 9 * k, 0, TAU); g.stroke();
    g.fillStyle = cols[1]; [16, 24, 32].forEach(o => { const p = along(b, a, o * k); g.beginPath(); g.arc(p[0], p[1], 3 * k, 0, TAU); g.fill(); }); cap(g, a, along(a, b, 10 * k), 4 * k); };
  // text with stencil bridges cut through it
  const bridged = (a, s, x, y, px, cuts) => {
    a.font = XY.font(px, HEI, '900'); a.textBaseline = 'alphabetic'; a.fillText(s, x, y);
    a.save(); a.globalCompositeOperation = 'destination-out'; const w = a.measureText(s).width;
    cuts.forEach(([u, v, ww, hh]) => a.fillRect(x + u * w, y - v * px, ww, hh)); a.restore();
  };
  const TITLE = [44, 128, 400, 196];
  const titleCuts = [[0, 0.5, 400, 4], [0, 0.22, 400, 3.5], [0.17, 0.95, 4, 200], [0.36, 0.95, 3.5, 200], [0.68, 0.95, 4, 200], [0.86, 0.95, 3.5, 200]];
  const titleShape = a => bridged(a, '钉钯', 8, 168, 176, titleCuts);

  // the lion king on a paste-up poster: curling mane locks, cut-out face, scowl, fangs, a crown; the poster's caption is the count
  const lion = (a, cx, cy) => {
    const P = (r, q) => [cx + cos(q) * r, cy + 8 + sin(q) * r * 0.95];
    for (let k = 0; k < 26; k++) { const q = k / 26 * TAU + (k % 2) * 0.06, L = (k % 2 ? 84 : 104) + 10 * sin(k * 2.3), c = 0.3 * (k % 3 === 0 ? -1 : 1);
      XY.path(a, XY.RIG.spline([...P(52, q - 0.15), ...P(L * 0.72, q - 0.06 + c * 0.4), ...P(L, q + c), ...P(L * 0.8, q + 0.1 + c * 0.6), ...P(52, q + 0.15)], true, 3), true); a.fill(); }
    a.beginPath(); a.arc(cx, cy + 8, 66, 0, TAU); a.fill();
    a.save(); a.globalCompositeOperation = 'destination-out';
    XY.path(a, XY.RIG.spline([cx - 46, cy - 34, cx, cy - 44, cx + 46, cy - 34, cx + 54, cy + 14, cx + 30, cy + 60, cx, cy + 68, cx - 30, cy + 60, cx - 54, cy + 14], true, 4), true); a.fill();
    XY.path(a, [cx - 34, cy - 66, cx - 34, cy - 100, cx - 17, cy - 80, cx, cy - 108, cx + 17, cy - 80, cx + 34, cy - 100, cx + 34, cy - 66], true); a.fill();   // crown
    a.restore();
    a.beginPath(); a.arc(cx, cy - 80, 5, 0, TAU); a.fill();
    [-1, 1].forEach(s => { XY.path(a, [cx + s * 46, cy - 26, cx + s * 10, cy - 12, cx + s * 12, cy - 4, cx + s * 44, cy - 16], true); a.fill();               // scowling brows
      XY.path(a, XY.RIG.spline([cx + s * 38, cy - 2, cx + s * 26, cy - 8, cx + s * 14, cy - 2, cx + s * 26, cy + 4], true, 3), true); a.fill();
      a.save(); a.globalCompositeOperation = 'destination-out'; a.beginPath(); a.arc(cx + s * 24, cy - 2, 2.6, 0, TAU); a.fill(); a.restore(); });
    XY.path(a, [cx - 17, cy + 12, cx + 17, cy + 12, cx + 9, cy + 28, cx - 9, cy + 28], true); a.fill();
    a.lineWidth = 4; a.beginPath(); a.moveTo(cx, cy + 28); a.lineTo(cx, cy + 38); a.stroke();
    XY.path(a, XY.RIG.spline([cx - 30, cy + 40, cx, cy + 36, cx + 30, cy + 40, cx + 18, cy + 56, cx, cy + 60, cx - 18, cy + 56], true, 3), true); a.fill();
    a.save(); a.globalCompositeOperation = 'destination-out'; [-1, 1].forEach(s => { XY.path(a, [cx + s * 20, cy + 40, cx + s * 12, cy + 40, cx + s * 16, cy + 52], true); a.fill(); }); a.restore();
  };
  // two little demons (刁钻古怪 and 古怪刁钻) carrying a trussed pig on a pole — two walk frames
  const demons = (a, f) => {
    const fig = (x, y, ph) => { a.beginPath(); a.arc(x, y - 52, 11, 0, TAU); a.fill(); XY.path(a, [x - 8, y - 60, x - 12, y - 76, x - 2, y - 62], true); a.fill(); XY.path(a, [x + 4, y - 62, x + 10, y - 77, x + 9, y - 60], true); a.fill();
      XY.path(a, [x - 12, y - 40, x + 12, y - 40, x + 15, y - 12, x - 15, y - 12], true); a.fill();
      a.lineWidth = 7; const s = ph ? 1 : -1; a.beginPath(); a.moveTo(x - 6, y - 14); a.lineTo(x - 6 - 10 * s, y); a.moveTo(x + 6, y - 14); a.lineTo(x + 6 + 10 * s, y); a.stroke();
      a.lineWidth = 5; a.beginPath(); a.moveTo(x, y - 38); a.lineTo(x + 6, y - 50); a.stroke(); };
    fig(40, 150, f); fig(190, 150, 1 - f);
    a.lineWidth = 5; a.beginPath(); a.moveTo(20, 98 + f); a.lineTo(212, 96 - f); a.stroke();
    a.lineWidth = 2.5; a.beginPath(); a.moveTo(98, 98); a.lineTo(100, 112); a.moveTo(132, 97); a.lineTo(130, 112); a.stroke();
    XY.path(a, XY.ellipse(116, 124, 40, 19, 20), true); a.fill(); XY.path(a, [150, 116, 166, 112, 170, 124, 154, 132], true); a.fill();
    a.lineWidth = 4; [[92, 134], [104, 138], [128, 138], [140, 134]].forEach(([x, y]) => { a.beginPath(); a.moveTo(x, y); a.lineTo(x + 2, y - 26); a.stroke(); });
    a.save(); a.globalCompositeOperation = 'destination-out'; a.beginPath(); a.arc(158, 120, 2.4, 0, TAU); a.fill(); a.restore();
  };

  // ------------------------------------------------------------ static: sky over the wall, concrete, old buffed paint, the shrine, the poster, the pavement
  const POSTER = [862, 118, 262, 362];
  const bg = (g, W, H, c, S) => {
    let gr = g.createLinearGradient(0, 0, 0, 100); gr.addColorStop(0, '#E9E4D6'); gr.addColorStop(1, '#D8D0BE'); g.fillStyle = gr; g.fillRect(0, 0, W, 100);
    g.fillStyle = '#B9B3A6'; g.beginPath(); g.moveTo(0, 100); for (let x = 0; x <= W; x += 20) g.lineTo(x, 84 - 14 * Math.max(0, sin(x / 90)) - 4 * XY.noise1(x / 30, 2)); g.lineTo(W, 100); g.fill();
    g.fillStyle = '#9C968A'; g.beginPath(); g.moveTo(560, 100); for (let x = 560; x <= W; x += 10) g.lineTo(x, 96 - 58 * Math.exp(-Math.pow((x - 860) / 90, 2)) - 26 * Math.exp(-Math.pow((x - 990) / 60, 2)) - 3 * XY.noise1(x / 12, 3)); g.lineTo(W, 100); g.fill();
    // concrete: base, mottling from a low-res noise field, panel seams, form-tie holes, rain streaks, grime
    g.fillStyle = WALL; g.fillRect(0, 100, W, 602);
    { const k = 6, w = Math.ceil(W / k), h = Math.ceil(602 / k), cv = XY.mk(w, h), m = cv.getContext('2d'), im = m.createImageData(w, h);
      for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) { const v = 128 + 70 * XY.fbm(i / 9, j / 9, 74, 4) + 30 * (XY.hash(i, j, 7) - 0.5), o = (j * w + i) * 4; im.data[o] = im.data[o + 1] = im.data[o + 2] = v; im.data[o + 3] = 255; }
      m.putImageData(im, 0, 0); g.save(); g.globalCompositeOperation = 'overlay'; g.globalAlpha = 0.5; g.imageSmoothingQuality = 'high'; g.drawImage(cv, 0, 100, W, 602); g.restore(); }
    for (let x = 118; x < W; x += 236) { g.fillStyle = 'rgba(70,64,56,0.45)'; g.fillRect(x, 112, 2, 590); g.fillStyle = 'rgba(255,252,244,0.35)'; g.fillRect(x + 2, 112, 1.2, 590); }
    for (let x = 59; x < W; x += 118) for (let y = 180; y < 700; y += 150) { g.fillStyle = 'rgba(60,54,46,0.55)'; g.beginPath(); g.arc(x, y, 3.4, 0, TAU); g.fill(); g.fillStyle = 'rgba(255,252,244,0.4)'; g.beginPath(); g.arc(x, y + 2, 3.4, 0.2, PI - 0.2); g.fill(); }
    for (let k = 0; k < 18; k++) { const x = XY.hash(k, 31) * W, w = 8 + 34 * XY.hash(k, 32), l = 70 + 260 * XY.hash(k, 33); gr = g.createLinearGradient(0, 112, 0, 112 + l);
      gr.addColorStop(0, 'rgba(70,62,50,0.2)'); gr.addColorStop(1, 'rgba(70,62,50,0)'); g.fillStyle = gr; g.fillRect(x, 112, w, l); }
    gr = g.createLinearGradient(0, 610, 0, 702); gr.addColorStop(0, 'rgba(60,52,42,0)'); gr.addColorStop(1, 'rgba(60,52,42,0.28)'); g.fillStyle = gr; g.fillRect(0, 610, W, 92);
    // coping on top of the wall
    g.fillStyle = '#A7A194'; g.fillRect(0, 92, W, 20); g.fillStyle = '#D3CEC2'; g.fillRect(0, 92, W, 3);
    gr = g.createLinearGradient(0, 112, 0, 128); gr.addColorStop(0, 'rgba(40,34,26,0.35)'); gr.addColorStop(1, 'rgba(40,34,26,0)'); g.fillStyle = gr; g.fillRect(0, 112, W, 16);
    // the city's grey buff patches over older pieces, and old tags
    [[280, 500, 250, 150, '#B2AC9F'], [690, 560, 220, 120, '#C3BDB1'], [20, 560, 170, 110, '#B7B1A5']].forEach(([x, y, w, h, col], k) => {
      g.fillStyle = col; g.beginPath(); g.moveTo(x, y); for (let i = 0; i <= 10; i++) g.lineTo(x + w * i / 10, y + 4 * XY.noise1(i * 1.3, k)); for (let i = 10; i >= 0; i--) g.lineTo(x + w * i / 10 + 3 * XY.noise1(i, k + 4), y + h + 5 * XY.noise1(i * 1.1, k + 2)); g.fill();
      for (let j = 0; j < 6; j++) { g.fillStyle = `rgba(255,255,255,${0.04 + 0.04 * XY.hash(j, k)})`; g.fillRect(x, y + j * h / 6, w, h / 12); } });
    const tag = (x, y, sc, col, sd) => { const r = XY.rng(sd), p = []; let a = 0, px = x, py = y; for (let i = 0; i < 46; i++) { a += (r() - 0.5) * 2.4; px += cos(a) * 7 * sc + 2.4 * sc; py += sin(a) * 9 * sc; py += (y - py) * 0.18; p.push(px, py); }
      g.strokeStyle = col; g.lineWidth = 3 * sc; g.lineJoin = g.lineCap = 'round'; XY.path(g, XY.RIG.spline(p, false, 3), false); g.stroke(); };
    tag(300, 640, 1.1, 'rgba(22,21,20,0.5)', 11); tag(700, 600, 0.9, 'rgba(22,21,20,0.4)', 12); tag(40, 610, 0.8, 'rgba(160,40,50,0.4)', 13); tag(980, 650, 0.9, 'rgba(40,60,120,0.35)', 14);
    // the shrine: a big red 斗方 (tilted square, as for 福) behind where the weapons hang, the feast table, candle sticks
    g.drawImage(sprayCv(W, H, S, RED, a => { XY.path(a, [617, 120, 822, 324, 617, 528, 412, 324], true); a.fill();
      a.save(); a.globalCompositeOperation = 'destination-out'; a.lineWidth = 5; XY.path(a, [617, 146, 796, 324, 617, 502, 438, 324], true); a.stroke();
      for (const [x, y] of [[617, 176], [766, 324], [617, 472], [468, 324]]) { a.beginPath(); a.arc(x, y, 7, 0, TAU); a.fill(); } a.restore();
      a.fillRect(432, 384, 13, 86); a.fillRect(789, 384, 13, 86); }, 0.9), 0, 0, W, H);
    g.drawImage(sprayCv(W, H, S, BLK, a => {
      a.fillRect(404, 470, 426, 12); a.fillRect(420, 482, 10, 60); a.fillRect(804, 482, 10, 60);
      XY.path(a, [404, 482, 830, 482, 830, 500, 404, 500], true); a.fill();
      for (let x = 404; x < 830; x += 26) { a.beginPath(); a.arc(x + 13, 500, 13, 0, PI); a.fill(); }
      a.fillRect(496, 462, 92, 8); a.fillRect(652, 462, 84, 8);
      [[460, 462], [612, 458], [770, 462]].forEach(([x, y]) => { a.beginPath(); a.ellipse(x, y, 16, 8, 0, PI, 0); a.fill(); a.fillRect(x - 6, y, 12, 8); });
    }, 0.8), 0, 0, W, H);
    // the feast in two layers: white heads, black details — a pig's head and a sheep's head on dishes
    g.drawImage(sprayCv(W, H, S, WHT, a => { XY.path(a, XY.RIG.spline([502, 462, 504, 436, 520, 420, 546, 416, 566, 426, 582, 436, 590, 452, 584, 462], true, 4), true); a.fill();
      XY.path(a, [522, 424, 516, 400, 536, 418], true); a.fill(); XY.path(a, [548, 418, 556, 396, 564, 422], true); a.fill();
      XY.path(a, XY.RIG.spline([664, 462, 668, 440, 682, 426, 700, 424, 716, 432, 724, 450, 722, 462], true, 4), true); a.fill(); }, 0.5), 0, 0, W, H);
    g.drawImage(sprayCv(W, H, S, BLK, a => { a.beginPath(); a.ellipse(586, 448, 6, 9, 0, 0, TAU); a.fill(); a.beginPath(); a.arc(552, 434, 3, 0, TAU); a.fill();
      a.lineWidth = 3; a.beginPath(); a.moveTo(560, 452); a.quadraticCurveTo(572, 458, 580, 454); a.stroke();
      a.lineWidth = 6; a.beginPath(); a.arc(676, 434, 11, PI * 0.2, PI * 1.6); a.stroke(); a.beginPath(); a.arc(712, 434, 11, PI * 1.4, PI * 2.8); a.stroke();
      a.beginPath(); a.arc(688, 444, 2.6, 0, TAU); a.arc(702, 444, 2.6, 0, TAU); a.fill(); a.fillRect(692, 452, 6, 4); }, 0.3), 0, 0, W, H);
    // paste-up poster: torn paper, glue creases, the lion king in black, the count as its caption
    { const [x, y, w, h] = POSTER, p = []; for (let i = 0; i <= 12; i++) p.push(x + w * i / 12, y + 5 * XY.noise1(i * 1.7, 5)); for (let i = 0; i <= 12; i++) p.push(x + w + 5 * XY.noise1(i * 1.9, 6), y + h * i / 12);
      for (let i = 12; i >= 0; i--) p.push(x + w * i / 12, y + h + 6 * XY.noise1(i * 1.3, 7)); for (let i = 12; i >= 0; i--) p.push(x + 4 * XY.noise1(i * 2.1, 8), y + h * i / 12);
      g.save(); g.shadowColor = 'rgba(30,24,16,0.25)'; g.shadowBlur = 6; g.shadowOffsetY = 2; g.fillStyle = WHT; XY.path(g, p, true); g.fill(); g.restore();
      g.strokeStyle = 'rgba(150,140,120,0.35)'; g.lineWidth = 1; for (let k = 0; k < 7; k++) { const yy = y + 30 + k * 48 + 10 * XY.hash(k, 3); g.beginPath(); g.moveTo(x + 6, yy); g.bezierCurveTo(x + 80, yy + 8, x + 170, yy - 10, x + w - 6, yy + 4); g.stroke(); }
      g.drawImage(sprayCv(W, H, S, BLK, a => { lion(a, x + w / 2, y + 150); bridged(a, '第74难', x + 30, y + h - 22, 50, [[0, 0.45, 220, 3]]); }, 0.4), 0, 0, W, H);
      g.drawImage(sprayCv(W, H, S, RED, a => { const cx = x + w / 2, cy = y + 150; XY.path(a, [cx - 36, cy - 64, cx - 36, cy - 102, cx - 18, cy - 80, cx, cy - 112, cx + 18, cy - 80, cx + 36, cy - 102, cx + 36, cy - 64], true); a.fill(); }, 0.5), 0, 0, W, H); }
    // dried drips under the shrine
    for (let k = 0; k < 16; k++) { const v = XY.hash(k, 91), side = k % 2, x = side ? XY.lerp(617, 822, v) : XY.lerp(412, 617, v), y = side ? XY.lerp(528, 324, v) : XY.lerp(324, 528, v);
      drip(g, x, y - 2, 8 + 46 * XY.hash(k, 92) * (1 - 0.6 * Math.abs(v - 0.5) * 2 * 0), RED, 2 + 2 * XY.hash(k, 93)); }
    for (let k = 0; k < 10; k++) drip(g, 412 + 40 * k + 20 * XY.hash(k, 94), 512, 10 + 36 * XY.hash(k, 95), BLK, 2.2 + 1.4 * XY.hash(k, 96));
    // pavement: kerb, slabs, cracks, paint splatter, gum; a dropped cardboard stencil and a spray can
    g.fillStyle = '#A39E94'; g.fillRect(0, 702, W, H - 702); g.fillStyle = '#D0CBC1'; g.fillRect(0, 702, W, 4); g.fillStyle = 'rgba(60,54,46,0.35)'; g.fillRect(0, 706, W, 2);
    g.strokeStyle = 'rgba(60,54,46,0.4)'; g.lineWidth = 1.5; for (let x = 70; x < W; x += 172) { g.beginPath(); g.moveTo(x, 708); g.lineTo(x - 30, H); g.stroke(); }
    for (let k = 0; k < 5; k++) { const r = XY.rng(80 + k); let x = r() * W, y = 712 + r() * 50; g.beginPath(); g.moveTo(x, y); for (let i = 0; i < 9; i++) { x += 6 + r() * 10; y += (r() - 0.5) * 9; g.lineTo(x, y); } g.lineWidth = 1; g.stroke(); }
    { const r = XY.rng(86); for (let k = 0; k < 260; k++) { const cx = [180, 640, 930][k % 3] + (r() - 0.5) * 180 * r(), cy = 712 + r() * 60; g.fillStyle = [RED, BLK, YEL, WHT][Math.floor(r() * 4)]; g.globalAlpha = 0.5 + 0.5 * r(); g.beginPath(); g.arc(cx, cy, 0.6 + 2.6 * r() * r(), 0, TAU); g.fill(); }
      g.globalAlpha = 1; g.fillStyle = 'rgba(70,66,60,0.5)'; for (let k = 0; k < 14; k++) { g.beginPath(); g.ellipse(r() * W, 715 + r() * 60, 3 + 3 * r(), 2 + r(), 0, 0, TAU); g.fill(); } }
    { const cv = XY.mk(220 * S, 70 * S), m = cv.getContext('2d'); m.scale(S, S); m.fillStyle = KRAFT; XY.path(m, [20, 8, 214, 2, 196, 64, 2, 68], true); m.fill();
      m.strokeStyle = 'rgba(90,60,30,0.6)'; m.lineWidth = 1.5; m.stroke(); m.globalCompositeOperation = 'destination-out'; m.lineCap = 'round';
      m.save(); m.translate(108, 36); m.rotate(-0.06); rake(m, [70, 2], [-58, 2], 0.95, ['#000', '#000']); m.restore(); m.globalCompositeOperation = 'source-over';
      m.fillStyle = 'rgba(211,38,43,0.35)'; m.fillRect(130, 20, 60, 30);
      g.save(); g.shadowColor = 'rgba(30,24,16,0.3)'; g.shadowBlur = 5; g.shadowOffsetY = 2; g.drawImage(cv, 40, 712, 220, 70); g.restore(); }
  };

  // ------------------------------------------------------------ cached sprays: wall weapons, their peeled ghosts, the title, its cardboard stencil, the demons
  const kS = hypot(ST[1][0] - ST[0][0], ST[1][1] - ST[0][1]) / 146, kR = hypot(RK[1][0] - RK[0][0], RK[1][1] - RK[0][1]) / 132, kZ = 300 / 150, NONE = 'rgba(0,0,0,0)';
  const wallPaint = { st: [[RED, a => { a.strokeStyle = '#000'; cap(a, ST[0], ST[1], 3.6 * kS); }], [YEL, a => staff(a, ST[0], ST[1], kS, [NONE, '#000'])]],
    rk: [[BLK, a => rake(a, RK[0], RK[1], kR, ['#000', NONE])], [YEL, a => rake(a, RK[0], RK[1], kR, [NONE, '#000'])]],
    zh: [[BLK, a => zhang(a, ZH[0], ZH[1], kZ, ['#000', NONE])], [YEL, a => zhang(a, ZH[0], ZH[1], kZ, [NONE, '#000'])]] };
  const wallSprite = (W, H, S, which, ghost) => XY.cached(`i74w:${which}:${ghost}:${S.toFixed(4)}`, W * S, H * S, cv => {
    const g = cv.getContext('2d');
    if (!ghost) { wallPaint[which].forEach(([col, p]) => g.drawImage(sprayCv(W, H, S, col, p, 0.7), 0, 0)); return; }
    const A = XY.mk(W * S, H * S), a = A.getContext('2d'); a.setTransform(S, 0, 0, S, 0, 0); a.fillStyle = a.strokeStyle = '#000'; a.lineCap = 'round';
    wallPaint[which].forEach(([, p]) => p(a));
    g.filter = `blur(${6 * S}px)`; g.drawImage(A, 0, 0); g.filter = 'none';
    g.globalCompositeOperation = 'source-in'; g.fillStyle = 'rgba(66,60,54,0.42)'; g.fillRect(0, 0, cv.width, cv.height);
    g.globalCompositeOperation = 'destination-out'; g.drawImage(A, 0, 0);
    g.globalCompositeOperation = 'source-over'; g.globalAlpha = 0.5; g.drawImage(K.tint(A, 'i74ghost', '#D6D1C6'), 0, 0);
  });
  const titleCv = S => XY.cached('i74title:' + S.toFixed(4), TITLE[2] * S, TITLE[3] * S, cv => {
    const g = cv.getContext('2d'); g.scale(S, S); g.save(); g.filter = `blur(${7 * S}px)`; g.strokeStyle = 'rgba(211,38,43,0.16)'; g.lineWidth = 10; g.strokeRect(6, 6, TITLE[2] - 12, TITLE[3] - 12); g.restore();
    g.setTransform(1, 0, 0, 1, 0, 0); g.drawImage(sprayCv(TITLE[2], TITLE[3], S, RED, titleShape, 0.8), 0, 0); });
  const cardCv = S => XY.cached('i74card:' + S.toFixed(4), TITLE[2] * S, TITLE[3] * S, cv => {
    const g = cv.getContext('2d'); g.scale(S, S); g.fillStyle = KRAFT; g.fillRect(0, 0, TITLE[2], TITLE[3]); g.strokeStyle = 'rgba(110,76,40,0.8)'; g.lineWidth = 3; g.strokeRect(1.5, 1.5, TITLE[2] - 3, TITLE[3] - 3);
    const r = XY.rng(742); for (let k = 0; k < 9; k++) { g.fillStyle = `rgba(${k % 3 ? '211,38,43' : '22,21,20'},${0.08 + 0.12 * r()})`; g.beginPath(); g.ellipse(r() * TITLE[2], r() * TITLE[3], 30 + 50 * r(), 16 + 30 * r(), r() * 3, 0, TAU); g.fill(); }
    g.strokeStyle = 'rgba(110,76,40,0.25)'; g.lineWidth = 1; for (let y = 8; y < TITLE[3]; y += 7) { g.beginPath(); g.moveTo(0, y); g.lineTo(TITLE[2], y + 1); g.stroke(); }
    g.globalCompositeOperation = 'destination-out'; g.fillStyle = '#000'; titleShape(g); });
  const demonCv = (S, f) => XY.cached(`i74dm:${f}:${S.toFixed(4)}`, 240 * S, 170 * S, cv => cv.getContext('2d').drawImage(sprayCv(240, 170, S, BLK, a => demons(a, f), 0.7), 0, 0));
  let DRIPS = null;
  const titleDrips = () => { if (DRIPS) return DRIPS;
    const cv = XY.mk(TITLE[2], TITLE[3]), a = cv.getContext('2d'); a.fillStyle = '#000'; titleShape(a); const d = a.getImageData(0, 0, cv.width, cv.height).data; DRIPS = [];
    for (let k = 0; k < 16; k++) { const x = Math.round(16 + k * 23 + 8 * XY.hash(k, 50)); let y = -1; for (let j = TITLE[3] - 1; j >= 0; j--) if (d[(j * cv.width + x) * 4 + 3] > 140) { y = j; break; }
      if (y > 60) DRIPS.push([TITLE[0] + x, TITLE[1] + y, 12 + 46 * XY.hash(k, 51), XY.hash(k, 52)]); }
    return DRIPS; };
  const drip = (g, x, y, len, col, w = 2.6) => { if (len < 1) return; g.fillStyle = col; g.fillRect(x - w / 2, y, w, len); g.beginPath(); g.arc(x, y + len, w * 0.95, 0, TAU); g.fill(); };

  const PC = { fur: '#6A5240', face: WHT, wkshirt: RED, tiger: YEL, stripe: BLK, gold: YEL, staff: RED, ink: BLK, horse: WHT, horse2: LGR, mane: LGR, hoof: BLK, saddle: BLK, red: RED, robe: YEL, kasaya: RED, skin: WHT,
    metal: YEL, bjrobe: BLK, bjpants: BLK, pig: '#E9A9A2', pig2: '#C98580', wood: BLK, ssrobe: GRY, ssrobe2: '#4D4A45', skin2: '#D8C7AE', ssh: RED, ssbeard: RED, skull: WHT, bundle: YEL };
  const PEN = { color: r => PC[r] || BLK, outline: WALL, ow: 1.3, shade: 'rgba(22,21,20,0.22)' };
  // v10 (8 beats): staff back to 悟空 2.4 (hit), 宝杖 to 沙僧 3.2, then on beat 4 (hit) the rake tears off the wall at the same moment
  // a red X lands on the lion and the spray can jumps; 悟空 swings at the poster
  const FLY = { st: [2.4, 3.1], zh: [3.2, 3.8], rk: [4.0, 4.6] }, XB = 4.0;
  const actsAt = b => ({ wukong: { raise: 0.8 * XY.smooth(K.win(b, 2.9, 3.2)) * (1 - XY.smooth(K.win(b, 3.6, 3.9))), strike: XY.smooth(K.win(b, 3.85, 4.1)) * (1 - XY.smooth(K.win(b, 4.8, 5.4))) },
    monk: { palm: XY.smooth(K.win(b, 4.2, 4.6)) * (1 - XY.smooth(K.win(b, 5.6, 6.2))) }, bajie: { scratch: XY.smooth(K.win(b, -1, 0)) * (1 - XY.smooth(K.win(b, 3.6, 3.9))) },
    shaseng: { lift: XY.smooth(K.win(b, 3.7, 3.9)) * (1 - XY.smooth(K.win(b, 4.3, 4.8))) }, cast: b < FLY.st[1] ? { staff: false } : {} });
  const zhangPose = (e, A) => { const h = e.at('shaseng.handFar', A); return [[h[0] - 4, h[1] + 44], [h[0] + 10, h[1] - 104]]; };
  const flakes = (g, cx, cy, t0, lt, cols, seed) => { const d = lt - t0; if (d < 0 || d > 0.9) return;
    for (let k = 0; k < 26; k++) { const h = XY.hash(k, seed), a = h * TAU, v = 60 + 120 * XY.hash(k, seed + 1), x = cx + cos(a) * v * d + (XY.hash(k, seed + 2) - 0.5) * 120, y = cy + sin(a) * v * d * 0.6 + 260 * d * d + (XY.hash(k, seed + 3) - 0.5) * 80;
      g.save(); g.translate(x, y); g.rotate(d * 9 * (h - 0.5)); g.globalAlpha = 1 - d / 0.9; g.fillStyle = cols[k % cols.length]; g.fillRect(-3, -2, 6 + 4 * h, 4); g.restore(); } };

  XY.STYLES.stencil = {
    bg,
    hits: [FLY.st[0], XB],
    draw(g, e) {
      const { W, H, t, u, lt, beat, S } = e, A = actsAt(beat);
      const tau = k => K.win(beat, FLY[k][0], FLY[k][1]);
      // the enshrined weapons, or the haze they left when they were peeled away
      ['zh', 'st', 'rk'].forEach(k => { if (tau(k) <= 0) g.drawImage(wallSprite(W, H, S, k, 0), 0, 0, W, H); });
      // candle flames, three stencil cut-outs swapped at 8 fps
      const ff = Math.floor(t * 8) % 3;
      [[438, 384], [795, 384]].forEach(([x, y], k) => { const f = (ff + k) % 3, h = [30, 36, 27][f], lean = [-3, 2, 4][f];
        g.fillStyle = YEL; g.beginPath(); g.moveTo(x - 9, y); g.quadraticCurveTo(x - 11, y - h * 0.5, x + lean, y - h); g.quadraticCurveTo(x + 11, y - h * 0.45, x + 9, y); g.fill();
        g.fillStyle = RED; g.beginPath(); g.moveTo(x - 4, y); g.quadraticCurveTo(x - 4, y - h * 0.3, x + lean * 0.5, y - h * 0.5); g.quadraticCurveTo(x + 5, y - h * 0.3, x + 4, y); g.fill(); });
      // MUTO-style stop motion: the pig-carrying demons hop along the wall at 4 fps, their previous frames rolled over in grey
      const fi = Math.min(9, Math.max(-6, Math.floor(lt * 3))), dx = k => 20 + 13 * (fi - k + 5);
      for (let k = 2; k >= 1; k--) { g.fillStyle = `rgba(186,180,169,${0.75 - k * 0.2})`; g.fillRect(dx(k) + 6, 336, 232, 160); g.globalAlpha = 0.14 / k; g.drawImage(demonCv(S, (fi - k) & 1), dx(k), 330, 240, 170); g.globalAlpha = 1; }
      g.drawImage(demonCv(S, fi & 1), dx(0), 330, 240, 170);
      // the title: a cardboard stencil is slapped on, sprayed through, peeled off; fresh paint drips from the letters
      const cin = XY.easeOut(K.win(u, -0.42, -0.22)), spr = K.win(u, -0.2, 0.05), cout = XY.easeIn(K.win(u, 0.06, 0.22));
      if (spr > 0) { g.save(); g.beginPath(); g.rect(TITLE[0], TITLE[1], TITLE[2] * Math.min(1, spr * 1.15), TITLE[3]); g.clip(); g.drawImage(titleCv(S), TITLE[0], TITLE[1], TITLE[2], TITLE[3]); g.restore(); }
      if (spr >= 1) titleDrips().forEach(([x, y, L, h]) => drip(g, x, y - 2, L * XY.smooth(K.win(lt, 0.2 + h * 0.6, 2.2 + h * 1.4)), RED, 2.4 + 1.6 * h));
      if (cin > 0 && cout < 1) {
        g.save(); g.translate(TITLE[0] + TITLE[2] / 2 + 70 * cout, TITLE[1] + TITLE[3] / 2 - 260 * (1 - cin) - 280 * cout); g.rotate(-0.08 * (1 - cin) + 0.3 * cout);
        g.shadowColor = 'rgba(30,24,16,0.35)'; g.shadowBlur = (6 + 20 * cout) * S; g.shadowOffsetY = (3 + 14 * cout) * S;
        g.drawImage(cardCv(S), -TITLE[2] / 2, -TITLE[3] / 2, TITLE[2], TITLE[3]); g.restore();
      }
      if (spr > 0 && spr < 1) { const nx = TITLE[0] + TITLE[2] * spr * 1.1, ny = TITLE[1] + TITLE[3] / 2 + sin(spr * 34) * TITLE[3] * 0.38, r = XY.rng(Math.floor(t * 30) + 3);
        for (let k = 0; k < 90; k++) { const a = r() * TAU, d = Math.pow(r(), 0.7) * 46; g.fillStyle = `rgba(211,38,43,${0.25 + 0.5 * r()})`; g.fillRect(nx + cos(a) * d, ny + sin(a) * d, 1.6, 1.6); } }
      // the poster's corner lifting in the draught
      { const [x, y, w, h] = POSTER, f = 30 + 9 * sin(t * 3.3) + 4 * sin(t * 7.1), cx = x + w, cy = y + h;
        g.fillStyle = WALL; XY.path(g, [cx - f, cy + 6, cx + 6, cy + 6, cx + 6, cy - f], true); g.fill();
        g.save(); g.shadowColor = 'rgba(30,24,16,0.3)'; g.shadowBlur = 6 * S; g.shadowOffsetX = -2 * S; g.shadowOffsetY = -2 * S;
        g.fillStyle = '#DAD5C9'; XY.path(g, [cx - f, cy, cx, cy - f, cx - f * 0.82 - 3 * sin(t * 3.3), cy - f * 0.82], true); g.fill(); g.restore(); }
      // beat 4: a red X sprayed across the lion as 悟空 swings
      const x1 = K.win(beat, XB, XB + 0.14), x2 = K.win(beat, XB + 0.14, XB + 0.28);
      if (x1 > 0) { g.save(); g.lineCap = 'round'; g.strokeStyle = RED; g.lineWidth = 17; g.shadowColor = 'rgba(211,38,43,0.6)'; g.shadowBlur = 9 * S;
        const seg = (a, b, v) => { if (v <= 0) return; g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(XY.lerp(a[0], b[0], v), XY.lerp(a[1], b[1], v)); g.stroke(); };
        seg([902, 168], [1086, 404], x1); seg([1084, 162], [904, 410], x2); g.restore();
        [[930, 206], [1000, 296], [1060, 372], [960, 362], [1046, 212]].forEach(([x, y], k) => drip(g, x, y + 6, 46 * XY.smooth(K.win(beat, XB + 0.3 + k * 0.1, XB + 2 + k * 0.2)), RED, 3)); }
      // paint flakes where each weapon tears off the wall
      flakes(g, 641, 324, FLY.st[0] * XY.BEAT, lt, [RED, YEL, RED], 60); flakes(g, 641, 324, FLY.zh[0] * XY.BEAT, lt, [YEL, BLK], 80); flakes(g, 641, 324, FLY.rk[0] * XY.BEAT, lt, [BLK, YEL, BLK], 70);
      // the procession, sprayed: wall-coloured gaps between the colour cuts, overspray haze, pitted coat
      if (beat >= FLY.zh[1]) { const [a, b] = zhangPose(e, A); g.save(); g.lineCap = 'round'; zhang(g, a, b, 1, [BLK, YEL]); g.restore(); }   // 沙僧 holds his 宝杖 again
      const [pl, pg] = K.layer(e, 'i74proc');
      K.draw(pg, e.phase, e.procX, e.groundY, PEN, A, { skip: (fi2, pi, p, tag) => tag === 'rake' && beat < FLY.rk[1] });
      K.texture(pl, pits(), 0.35, 'destination-out');
      g.save(); g.filter = `blur(${4 * S}px)`; K.blit(g, pl, 0.28); g.restore(); K.blit(g, pl);
      // the weapons in flight: lifted off the wall (drop shadow), spinning a little, shrinking to hand size
      g.save(); g.lineCap = 'round';
      ['zh', 'st', 'rk'].forEach(k => { const v = tau(k); if (v <= 0 || v >= 1) return;
        const ev = XY.easeIO(v), lift = sin(PI * v), ends = k === 'st' ? [e.at('wukong.staffEnd', A), e.at('wukong.staffTip', A)] : k === 'zh' ? zhangPose(e, A) : [e.at('bajie.hand', A), e.at('bajie.rakeHead', A)], from = k === 'st' ? ST : k === 'zh' ? ZH : RK;
        let a = [XY.lerp(from[0][0], ends[0][0], ev), XY.lerp(from[0][1], ends[0][1], ev) - 90 * lift], b = [XY.lerp(from[1][0], ends[1][0], ev), XY.lerp(from[1][1], ends[1][1], ev) - 90 * lift];
        const m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], sp = 0.9 * lift * (k === 'st' ? 1 : -1), rot = p => { const x = p[0] - m[0], y = p[1] - m[1]; return [m[0] + x * cos(sp) - y * sin(sp), m[1] + x * sin(sp) + y * cos(sp)]; };
        a = rot(a); b = rot(b);
        g.shadowColor = 'rgba(20,16,10,0.35)'; g.shadowBlur = 12 * S * lift; g.shadowOffsetX = 12 * S * lift; g.shadowOffsetY = 16 * S * lift;
        if (k === 'st') staff(g, a, b, XY.lerp(kS, 1, ev), [RED, YEL]); else if (k === 'zh') zhang(g, a, b, XY.lerp(kZ, 1, ev), [BLK, YEL]); else rake(g, a, b, XY.lerp(kR, 1, ev), [BLK, YEL]); });
      g.restore();
      { const hop = 70 * sin(PI * K.win(beat, XB, XB + 0.7)), rot = -0.12 + TAU * XY.easeOut(K.win(beat, XB, XB + 0.7)); g.save(); g.fillStyle = 'rgba(30,24,16,0.25)'; g.beginPath(); g.ellipse(1050, 764, 46 - hop * 0.3, 6, 0, 0, TAU); g.fill();
        g.translate(1046, 752 - hop); g.rotate(rot); g.fillStyle = RED; g.fillRect(-36, -11, 66, 22); g.fillStyle = WHT; g.fillRect(-14, -11, 18, 22); g.fillStyle = '#8E1A1E'; g.fillRect(-36, 5, 66, 6);
        g.fillStyle = '#C8C6C0'; g.fillRect(30, -9, 8, 18); g.fillStyle = BLK; g.fillRect(38, -5, 7, 10); g.restore();
        if (beat > XB && beat < XB + 0.6) { const r = XY.rng(Math.floor(t * 30)); g.fillStyle = 'rgba(211,38,43,0.7)'; for (let k = 0; k < 40; k++) { const a = r() * TAU, d = r() * 40 * K.win(beat, XB, XB + 0.6); g.fillRect(1080 + cos(a) * d, 740 - hop + sin(a) * d, 2, 2); } } }
      // near: a chain-link fence post at the right edge
      g.save(); g.beginPath(); g.rect(1112, 300, 80, 402); g.clip(); g.strokeStyle = 'rgba(80,76,70,0.75)'; g.lineWidth = 1.6;
      for (let k = -30; k < 40; k++) { g.beginPath(); g.moveTo(1100 + k * 16, 300); g.lineTo(1100 + k * 16 + 402, 702); g.moveTo(1100 + k * 16, 300); g.lineTo(1100 + k * 16 - 402, 702); g.stroke(); }
      g.restore(); g.fillStyle = '#8B877F'; g.fillRect(1148, 286, 12, 494); g.fillStyle = '#B3AFA6'; g.fillRect(1148, 286, 3, 494); g.fillStyle = '#6E6A63'; g.fillRect(1144, 280, 20, 10);
    },
  };
})();
