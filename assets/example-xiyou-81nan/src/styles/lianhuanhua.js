// 58 中国连环画 · 降妖取后 — a page of a 1960 小人书: black-line 白描 on yellowed paper, hatching for shade, solid
// spotted blacks, a typeset caption under the picture. 麒麟山 and 獬豸洞, 观音 on her cloud above the subdued 金毛犼;
// 金圣宫娘娘 floats home on a little cloud above the pilgrims in her thorn-bristling 五彩仙衣. Beat 2: the three 紫金铃
// tumble out of the cave spouting fire, smoke and sand; beat 3: 悟空 spears all three on the tip of his staff.
(() => {
  'use strict';
  const XY = window.XY, K = XY.KIT_G, TAU = XY.TAU;
  const PAPER = '#F1EBDA', INK = '#1C1A17', CAP = '悟空收了紫金铃，观音收回金毛犼，大圣驾云护送金圣宫娘娘还朝。';
  const BELL_T = 3, CATCH_T = 4.6;

  // ------------------------------------------------------------ brush and pen
  // tapered brush line through points (Catmull-Rom), w0 → w1
  const brush = (g, pts, w0, w1, col = INK) => { const c = XY.RIG.spline(pts, false, 6); XY.path(g, XY.RIG.ribbon(c, w0, w1), true); g.fillStyle = col; g.fill(); };
  const pen = (g, pts, w, closed = false) => { XY.path(g, pts, closed); g.strokeStyle = INK; g.lineWidth = w; g.stroke(); };
  // parallel hatching inside a closed path
  const hatch = (g, pts, ang, gap, w, x0, y0, x1, y1) => {
    g.save(); XY.path(g, pts, true); g.clip(); g.strokeStyle = INK; g.lineWidth = w; g.beginPath();
    const c = Math.cos(ang), s = Math.sin(ang), cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, r = Math.hypot(x1 - x0, y1 - y0) / 2;
    for (let d = -r; d <= r; d += gap) { g.moveTo(cx + c * -r - s * d, cy + s * -r + c * d); g.lineTo(cx + c * r - s * d, cy + s * r + c * d); }
    g.stroke(); g.restore();
  };
  // 皴: short hooked texture strokes along a slope
  const cun = (g, R, x, y, n, len) => { for (let k = 0; k < n; k++) { const px = x + (R() - 0.5) * len * 3, py = y + (R() - 0.5) * len * 1.6, l = len * (0.5 + R());
    brush(g, [px, py, px + l * 0.5, py + l * 0.35, px + l * 0.7, py + l * 0.9], 2.4, 0.4); } };
  // 祥云: a scroll cloud of linked spirals
  const cloud = (g, x, y, s, flip = 1) => {
    g.save(); g.translate(x, y); g.scale(s * flip, s); g.fillStyle = PAPER; g.strokeStyle = INK; g.lineWidth = 2.2 / s; g.lineCap = 'round';
    g.beginPath(); g.moveTo(-70, 10); g.bezierCurveTo(-90, -20, -50, -40, -30, -20); g.bezierCurveTo(-30, -50, 20, -50, 20, -20); g.bezierCurveTo(40, -40, 80, -20, 66, 6); g.bezierCurveTo(60, 20, -60, 24, -70, 10); g.fill(); g.stroke();
    [[-46, -14, 12], [0, -26, 14], [44, -10, 11]].forEach(([cx, cy, r]) => { g.beginPath(); for (let k = 0; k <= 26; k++) { const a = k / 26 * 4.6 + 1, rr = r * (1 - k / 32); k ? g.lineTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr) : g.moveTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr); } g.stroke(); });
    g.beginPath(); g.moveTo(66, 6); g.bezierCurveTo(100, 14, 120, 0, 136, 8); g.stroke();
    g.restore();
  };

  // ------------------------------------------------------------ the page (static)
  const page = (g, W, H) => {
    const R = XY.rng(5801);
    g.fillStyle = PAPER; g.fillRect(0, 0, W, H);
    for (let k = 0; k < 1400; k++) { g.fillStyle = R() < 0.5 ? 'rgba(120,100,60,0.05)' : 'rgba(255,255,250,0.2)'; g.fillRect(R() * W, R() * H, 1 + R() * 2, 1 + R() * 2); }
    const yel = g.createRadialGradient(W / 2, H / 2, H * 0.4, W / 2, H / 2, W * 0.66); yel.addColorStop(0, 'rgba(170,130,60,0)'); yel.addColorStop(1, 'rgba(170,130,60,0.16)'); g.fillStyle = yel; g.fillRect(0, 0, W, H);
    // far: 麒麟山, contour + 皴, pines on the ridge, lots of empty paper
    const ridge = [0, 430, 90, 360, 170, 300, 240, 340, 330, 262, 420, 318, 500, 290, 590, 380, 680, 350, 760, 440];
    brush(g, ridge, 3.6, 1.4);
    brush(g, [60, 520, 150, 450, 230, 430, 300, 470, 380, 420, 470, 460, 560, 450, 640, 500], 2.8, 1);
    for (let k = 0; k < ridge.length - 2; k += 2) cun(g, R, ridge[k] + 30, ridge[k + 1] + 40, 4, 16);
    // 披麻皴 on the shadow slopes: long parallel strokes hanging below the ridge where it falls away
    for (let k = 0; k < ridge.length - 2; k += 2) { const x0 = ridge[k], y0 = ridge[k + 1], x1 = ridge[k + 2], y1 = ridge[k + 3]; if (y1 <= y0) continue;
      for (let x = x0 + 6; x < x1; x += 8) { const y = y0 + (y1 - y0) * (x - x0) / (x1 - x0), l = 26 + 40 * Math.abs(XY.noise1(x / 30, 5)); brush(g, [x, y + 8, x - 6, y + 8 + l * 0.5, x - 10, y + 8 + l], 1.6, 0.2); } }
    // an old pine on the left margin, needles in fans
    brush(g, [70, 704, 60, 600, 74, 480, 58, 380, 76, 300], 16, 7); hatch(g, XY.RIG.ribbon(XY.RIG.spline([70, 704, 60, 600, 74, 480, 58, 380, 76, 300], false, 6), 13, 5), 0.2, 5, 1, 40, 300, 100, 704);
    brush(g, [66, 420, 120, 396, 170, 404], 6, 2); brush(g, [72, 330, 130, 300, 180, 296], 5, 2);
    [[170, 400], [180, 294], [120, 300], [126, 390], [80, 296]].forEach(([x, y]) => { for (let j = 0; j < 9; j++) { const a = Math.PI + 0.3 + j / 8 * (Math.PI - 0.6); pen(g, [x, y, x + Math.cos(a) * 26, y + Math.sin(a) * 18], 1.1); } pen(g, [x - 26, y, x + 26, y], 1.4); });
    [[175, 300], [330, 262], [500, 290]].forEach(([x, y]) => { pen(g, [x, y, x + 2, y - 46], 2); for (let j = 0; j < 4; j++) { const yy = y - 14 - j * 9, w = 22 - j * 4; brush(g, [x - w, yy + 4, x, yy - 4, x + w, yy + 4], 2, 0.8); } });
    for (let k = 0; k < 3; k++) { g.strokeStyle = INK; g.lineWidth = 1.2; g.beginPath(); g.moveTo(60 + k * 220, 560 + k * 10); g.lineTo(220 + k * 220, 562 + k * 10); g.stroke(); }
    // mid right: 獬豸洞 — rock mass, black mouth, hatching, the beast lying subdued on the ledge above
    const rock = [880, 704, 900, 560, 940, 470, 990, 420, 1060, 390, 1130, 400, W - 16, 380, W - 16, 704];
    g.fillStyle = PAPER; XY.path(g, rock, true); g.fill(); brush(g, rock.slice(0, 14), 3.8, 2);
    hatch(g, [900, 704, 920, 560, 960, 480, 940, 704], 1.1, 6, 1.1, 880, 460, 980, 704);
    const mouth = [1074, 704, 1076, 630, 1094, 574, 1122, 560, 1146, 576, W - 18, 630, W - 18, 704];
    g.fillStyle = INK; XY.path(g, XY.RIG.spline(mouth, false, 5), true); g.fill();
    for (let k = 0; k < 6; k++) cun(g, R, 1000 + k * 26, 440 + (k % 3) * 40, 3, 14);
    for (let k = 0; k < 5; k++) brush(g, [1060 + k * 18, 556 + (k % 2) * 6, 1062 + k * 18, 586 + (k % 3) * 10], 2.2, 0.4);
    // 1960s 小人书 density: cross-hatched shadow side of the slope, the cave's inner wall, grass along the road
    hatch(g, [900, 704, 920, 560, 960, 480, 990, 430, 1010, 470, 980, 560, 990, 704], -0.6, 7, 1, 880, 420, 1010, 704);
    hatch(g, [1040, 704, 1052, 620, 1074, 572, 1100, 548, 1122, 546, 1100, 560, 1080, 600, 1070, 704], 1.2, 4, 1, 1040, 540, 1124, 704);
    for (let k = 0; k < 9; k++) { const x = 1004 + k * 20, y = 410 + (k % 3) * 34; brush(g, [x, y, x - 6, y + 26, x - 4, y + 52], 1.6, 0.3); }
    for (let x = 30; x < 880; x += 26 + 18 * XY.hash(x, 58)) { const y = 704 + 6 * XY.hash(x, 59); for (let j = -1; j <= 1; j++) brush(g, [x + j * 4, y, x + j * 7, y - 9 - 6 * XY.hash(x, j + 3)], 1.4, 0.3); }
    // the picture border and the caption strip
    g.strokeStyle = INK; g.lineWidth = 3.2; g.strokeRect(16, 16, W - 32, 692); g.lineWidth = 1; g.strokeRect(22, 22, W - 44, 680);
    g.fillStyle = PAPER; g.fillRect(0, 710, W, H - 710);
    g.lineWidth = 1.2; g.beginPath(); g.moveTo(16, 716); g.lineTo(W - 16, 716); g.stroke();
    g.lineWidth = 2; g.strokeRect(24, 726, 168, 40); K.text(g, '第五十八难', 108, 756, XY.font(28, '"Songti SC", serif', 'bold'), INK, { align: 'center' });
    // the title cartouche: 取后, vertical, in a double box
    g.fillStyle = PAPER; g.fillRect(40, 40, 86, 166); g.strokeStyle = INK; g.lineWidth = 3; g.strokeRect(40, 40, 86, 166); g.lineWidth = 1; g.strokeRect(46, 46, 74, 154);
    K.text(g, '取', 83, 116, XY.font(60, XY.cnFont.song, '900'), INK, { align: 'center' }); K.text(g, '后', 83, 186, XY.font(60, XY.cnFont.song, '900'), INK, { align: 'center' });
  };

  // ------------------------------------------------------------ figures drawn per frame
  const beast = (g, x, y, s, t) => {   // 金毛犼, the 赛太岁 restored to Guanyin's mount: lying facing left, curled mane, tail up
    g.save(); g.translate(x, y); g.scale(s, s); g.lineCap = 'round'; g.lineJoin = 'round';
    const body = XY.RIG.spline([-40, -6, -30, -40, 20, -46, 70, -36, 92, -14, 80, 2, 20, 4, -30, 4], true, 4);
    g.fillStyle = PAPER; XY.path(g, body, true); g.fill(); hatch(g, body, 0.5, 4.5, 0.9, -40, -46, 92, 4); g.fillStyle = PAPER;
    XY.path(g, XY.RIG.spline([-30, -30, 10, -40, 60, -32, 70, -20, 20, -24, -20, -18], true, 3), true); g.fill(); pen(g, body, 2.4, true);
    brush(g, [86, -24, 110, -50, 104, -76, 90, -74], 3, 1); g.strokeStyle = INK; g.lineWidth = 1.8; g.beginPath(); g.arc(92, -80, 7, 0.5, 5.4); g.stroke();
    [[-40, 2, -76, 4], [30, 2, 0, 6]].forEach(([a, b2, c, d]) => { brush(g, [a, b2, (a + c) / 2, b2 + 2, c, d], 7, 5, INK); brush(g, [a, b2 - 1, (a + c) / 2, b2 + 1, c + 2, d - 1], 4, 3, PAPER); });
    for (let k = 0; k < 13; k++) { const a = -0.4 + k / 12 * 4.2, cx = -54 + Math.cos(a) * 26, cy = -34 + Math.sin(a) * 24; g.fillStyle = PAPER; g.beginPath(); g.arc(cx, cy, 9, 0, TAU); g.fill(); g.lineWidth = 1.6; g.beginPath(); g.arc(cx, cy, 8, a, a + 4.4); g.stroke(); g.beginPath(); g.arc(cx, cy, 3.5, a + 1, a + 5); g.stroke(); }
    const head = [-78, -46, -60, -54, -44, -42, -46, -24, -62, -14, -84, -18, -92, -30];
    g.fillStyle = PAPER; XY.path(g, XY.RIG.spline(head, true, 4), true); g.fill(); pen(g, XY.RIG.spline(head, true, 4), 2, true);
    D(g, -72, -38, 2.6); pen(g, [-80, -44, -66, -46], 1.8); pen(g, [-92, -26, -78, -22, -66, -24], 1.6); pen(g, [-86, -24, -84, -18], 1.4); pen(g, [-76, -22, -75, -16], 1.4);
    g.restore();
  };
  const guanyin = (g, t) => {   // 观音 on her cloud, upper right: halo, vase and willow, streamers in the wind
    const x = 930, y = 70;
    cloud(g, x - 4, y + 168, 0.9); cloud(g, x + 70, y + 182, 0.6, -1);
    g.strokeStyle = INK; g.lineWidth = 1.6; g.beginPath(); g.arc(x, y + 26, 30, 0, TAU); g.stroke(); g.lineWidth = 0.8; g.beginPath(); g.arc(x, y + 26, 35, 0, TAU); g.stroke();
    g.fillStyle = PAPER; const robe = [x - 10, y + 42, x - 22, y + 90, x - 30, y + 150, x - 12, y + 158, x + 14, y + 158, x + 30, y + 150, x + 22, y + 90, x + 10, y + 42];
    XY.path(g, XY.RIG.spline(robe, true, 4), true); g.fill(); pen(g, XY.RIG.spline(robe, true, 4), 1.8, true);
    [[-6, 60, -14, 150], [4, 62, 8, 152], [12, 70, 20, 146]].forEach(([a, b, c, d]) => pen(g, [x + a, y + b, x + (a + c) / 2 - 3, y + (b + d) / 2, x + c, y + d], 1));
    for (let k = 0; k < 2; k++) { const sd = k ? 1 : -1, pts = []; for (let j = 0; j <= 8; j++) { const f = j / 8; pts.push(x + sd * (14 + f * 40) + 6 * Math.sin(t * 3 + f * 4 + k), y + 60 + f * 70 + 8 * Math.sin(t * 2.4 + f * 5 + k * 2)); } brush(g, pts, 3, 0.6); }
    g.fillStyle = PAPER; g.beginPath(); g.arc(x, y + 30, 11, 0, TAU); g.fill(); pen(g, XY.ellipse(x, y + 30, 11, 12, 16), 1.6, true);
    g.fillStyle = INK; g.beginPath(); g.ellipse(x, y + 16, 7, 6, 0, 0, TAU); g.fill(); pen(g, [x - 4, y + 31, x - 1, y + 31], 1); pen(g, [x + 2, y + 31, x + 5, y + 31], 1);
    g.fillStyle = PAPER; const vase = [x - 26, y + 80, x - 30, y + 96, x - 26, y + 110, x - 16, y + 110, x - 12, y + 96, x - 17, y + 80]; XY.path(g, vase, true); g.fill(); pen(g, vase, 1.5, true);
    brush(g, [x - 22, y + 80, x - 30, y + 60, x - 44, y + 50, x - 56, y + 56], 1.6, 0.5);
    for (let k = 0; k < 4; k++) { const lx = x - 30 - k * 7, ly = y + 60 - k * 3 + 2 * Math.sin(t * 4 + k); brush(g, [lx, ly, lx - 4, ly + 7, lx - 2, ly + 13], 1.6, 0.3); }
  };
  const queen = (g, x, y, t) => {   // 金圣宫娘娘 on a small cloud: phoenix crown, long sleeves, the robe bristling with 棕刺
    cloud(g, x, y + 8, 0.82);
    g.fillStyle = PAPER; const robe = [x - 8, y - 84, x - 18, y - 50, x - 26, y - 8, x - 30, y + 2, x + 26, y + 2, x + 22, y - 40, x + 12, y - 84];
    XY.path(g, XY.RIG.spline(robe, true, 4), true); g.fill(); const rp = XY.RIG.spline(robe, true, 4); pen(g, rp, 1.8, true);
    for (let k = 0; k < rp.length - 2; k += 4) { const nx = rp[k] - x, ny = rp[k + 1] - (y - 40), d = Math.hypot(nx, ny) || 1; pen(g, [rp[k], rp[k + 1], rp[k] + nx / d * 7, rp[k + 1] + ny / d * 7], 1.2); }
    [[-12, -60, -16, -4], [0, -62, 2, -4], [12, -56, 16, -6]].forEach(([a, b, c, d]) => pen(g, [x + a, y + b, x + c, y + d], 0.9));
    const sl = [x - 6, y - 74, x - 34, y - 56, x - 40, y - 34, x - 22, y - 40, x - 4, y - 58]; g.fillStyle = PAPER; XY.path(g, sl, true); g.fill(); pen(g, sl, 1.6, true);
    for (let j = 0; j < 2; j++) { const pts = []; for (let i = 0; i <= 6; i++) { const f = i / 6; pts.push(x + 10 + f * 44, y - 70 + f * 20 + 6 * Math.sin(t * 3 + f * 5 + j * 2) + j * 10); } brush(g, pts, 2.2, 0.4); }
    g.fillStyle = PAPER; g.beginPath(); g.arc(x + 1, y - 96, 10, 0, TAU); g.fill(); pen(g, XY.ellipse(x + 1, y - 96, 10, 11, 16), 1.6, true);
    g.fillStyle = INK; g.beginPath(); g.ellipse(x - 2, y - 106, 10, 5, -0.2, 0, TAU); g.fill();
    [[-8, -110, -14, -124], [0, -111, 0, -128], [8, -110, 14, -124]].forEach(([a, b, c, d]) => { pen(g, [x + a, y + b, x + c, y + d], 1.4); g.beginPath(); g.arc(x + c, y + d, 2.4, 0, TAU); g.fill(); });
    pen(g, [x + 4, y - 96, x + 7, y - 96], 1); D(g, x + 7, y - 91, 1);
  };
  const D = (g, x, y, r) => { g.fillStyle = INK; g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill(); };
  const bell = (g, x, y, s, rot) => {   // 紫金铃: dome, rim, slit, loop, half hatched
    g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s);
    const dome = [-15, 10, -14, -2, -9, -12, 0, -15, 9, -12, 14, -2, 15, 10];
    g.fillStyle = PAPER; XY.path(g, XY.RIG.spline(dome, false, 4), false); g.closePath(); g.fill();
    hatch(g, [2, 10, 4, -14, 9, -12, 14, -2, 15, 10], 0.9, 3, 0.8, 0, -15, 16, 10);
    pen(g, XY.RIG.spline(dome, false, 4), 1.8); pen(g, [-17, 10, 17, 10], 2.6); pen(g, [-8, 4, 8, 4], 1.4);
    g.strokeStyle = INK; g.lineWidth = 1.8; g.beginPath(); g.arc(0, -19, 4, 0, TAU); g.stroke();
    g.restore();
  };

  // ------------------------------------------------------------ the pilgrims in 白描: paper fills, hatched cloth, spotted blacks
  const penFor = S => {
    const light = K.lines(S, INK, PAPER, 4.2, 0.9, 35), dense = K.lines(S, INK, PAPER, 3, 1, -40), cross = K.cross(S, INK, PAPER, 6, 0.9);
    const M = { fur: light, wkshirt: cross, kasaya: cross, saddle: dense, ssrobe: dense, ssrobe2: dense, bjrobe: INK, bjpants: INK, staff: INK, red: INK, hoof: INK, ink: INK, stripe: INK, ssh: INK, ssbeard: INK };
    return { color: r => M[r] || PAPER, outline: INK, ow: 1.5, shade: K.lines(S, INK, null, 3.2, 0.8, 45) };
  };
  const RISE = 5.6;   // v10: Guanyin flicks her willow at 2.2, the bells come loose on 3, 悟空 spears them on 4.6, the beast rises to her at 5.6
  const actsAt = b => ({ wukong: { shade: K.win(b, 1.6, 2.8, 0.25), strike: K.win(b, CATCH_T - 0.35, 6.9, 0.12) },
    monk: { palm: K.win(b, RISE, 7.6, 0.3) }, shaseng: { lift: K.win(b, 3.2, 4.4, 0.25) } });
  const at = (e, b, key) => { const tc = e.cell.t0 + b * XY.BEAT, p = XY.anchor(key, XY.walkPhase(tc), actsAt(b)); return [XY.procWorldX(tc) - e.cell.x + p[0], e.groundY + p[1]]; };
  const HALO = { color: () => PAPER, outline: PAPER, ow: 7, shade: false, fine: false };
  const flame = (g, x, y, s, a, t, k) => { g.save(); g.translate(x, y); g.rotate(a); g.scale(s, s);
    for (let j = 0; j < 3; j++) { const l = 30 + 10 * Math.sin(t * 20 + j * 2 + k), o = (j - 1) * 9; g.fillStyle = PAPER;
      const f = [0, o, l * 0.5, o - 9, l, o + 2 * Math.sin(t * 25 + j), l * 0.5, o + 9]; XY.path(g, XY.RIG.spline(f, true, 4), true); g.fill(); pen(g, XY.RIG.spline(f, true, 4), 1.5, true); pen(g, [6, o, l * 0.6, o], 0.9); }
    g.restore(); };

  XY.STYLES.lianhuanhua = {
    hits: [BELL_T, CATCH_T],
    bg(g, W, H) { page(g, W, H); },
    draw(g, e) {
      const { W, H, t, u, S } = e, b = e.beat, acts = actsAt(b), vis = K.visible(e);
      // drifting clouds and 观音; at 2.2 she flicks her willow and the dew falls on the beast
      cloud(g, 560 + 30 * Math.sin(t * 0.35), 120, 0.7); cloud(g, 700 + 24 * Math.sin(t * 0.3 + 2), 190, 0.5, -1);
      guanyin(g, t);
      if (b > 2.2 && b < 3.6) for (let j = 0; j < 14; j++) { const f = (b - 2.2 - j * 0.04) / 1.2; if (f < 0 || f > 1) continue; const x = XY.lerp(874, 1000 + (j % 5) * 14, f), y = XY.lerp(126, 340, f) - 60 * Math.sin(Math.PI * f); g.strokeStyle = INK; g.lineWidth = 1.4; g.beginPath(); g.ellipse(x, y, 2.2, 3.4, 0, 0, TAU); g.stroke(); }
      // 金毛犼 on its ledge; from 5.6 it rises on a cloud to its mistress
      { const r = XY.easeIO(K.ramp(b, RISE, 2)), bx = XY.lerp(1050, 1012, r), by = XY.lerp(382, 236, r) + (b < RISE ? 3 * Math.sin(t * 2) : 0), bs = XY.lerp(1, 0.68, r);
        if (r > 0) cloud(g, bx - 4, by + 18, 0.7 * bs + 0.2 * r); beast(g, bx, by, bs, t); }
      // ground: dry brush marks
      [[40, 120], [300, 90], [520, 140], [760, 80]].forEach(([x, w], k) => brush(g, [x, 700, x + w * 0.5, 698 + k % 2 * 3, x + w, 701], 2.4, 0.6));
      // 金圣宫娘娘 floats home in the open sky above the line
      if (vis || e.procX < e.W + 400) queen(g, e.procX - 228, 400 + 6 * Math.sin(t * 2), t);
      if (vis) { XY.drawProcession(g, e.phase, e.procX, e.groundY, HALO, acts); XY.drawProcession(g, e.phase, e.procX, e.groundY, penFor(S), acts); }
      // the three 紫金铃: shaken loose (3) → tumble out, swelling, spouting fire / smoke / sand → land at 悟空's feet → speared on his staff (4.6)
      const C = at(e, CATCH_T, 'wukong.staffEnd'), sEnd = e.at('wukong.staffEnd', acts), hand = e.at('wukong.hand', acts), dl = Math.hypot(sEnd[0] - hand[0], sEnd[1] - hand[1]) || 1, dir = [(sEnd[0] - hand[0]) / dl, (sEnd[1] - hand[1]) / dl];
      for (let k = 0; k < 3; k++) {
        const b0 = BELL_T + k * 0.18, sx = 1000 + k * 22, sy = 372 + 4 * Math.sin(t * 3 + k), Lx = C[0] - 90 + k * 80;
        let x, y, rot, sc = 1.4, fx = false;
        if (b < b0) { x = sx; y = sy; rot = 0.12 * Math.sin(t * 3 + k) + (b > BELL_T - 0.3 ? 0.4 * Math.sin(t * 30) : 0); }
        else if (b < CATCH_T) { const f = XY.clamp((b - b0) / 0.75); sc = f < 1 ? XY.lerp(1.4, 4.6, Math.sin(Math.PI * 0.5 * Math.min(1, f * 1.4))) - 1.2 * XY.smooth((f - 0.6) / 0.4) : 3.4; fx = true;
          const ly = 692 - 10 * sc; x = XY.lerp(sx, Lx, f); y = XY.lerp(sy, ly, f * f) - 70 * Math.sin(Math.PI * f) * (1 - f * 0.5);
          if (f >= 1) { const h = Math.abs(Math.sin((b - b0 - 0.75) * 7 + k)) * 14 * Math.exp(-(b - b0 - 0.75)); y = ly - h; }
          rot = f < 1 ? -f * 7 - k : 0.25 * Math.sin(t * 9 + k);
        } else { const q = XY.easeOut(K.ramp(b, CATCH_T + k * 0.1, 0.24)), O = [[-32, 36], [0, 50], [32, 36]][k], px = sEnd[0] + O[0], py = sEnd[1] + O[1], ly = 692 - 34;
          x = XY.lerp(Lx, px, q); y = XY.lerp(ly, py, q) - 60 * Math.sin(Math.PI * q); sc = XY.lerp(3.4, 2, q); rot = 0.35 * Math.sin(t * 8 + k * 1.3) * Math.exp(-(b - CATCH_T) * 0.4);
          if (q >= 1) pen(g, [sEnd[0], sEnd[1], x, y - 19 * sc], 1.4); }
        if (fx) { const up = -Math.PI / 2 - 0.3 + k * 0.3, z = sc / 1.55;
          if (k === 0) flame(g, x + Math.cos(up) * 22 * z, y + Math.sin(up) * 22 * z, z * 1.3, up, t, k);
          else if (k === 1) for (let j = 0; j < 6; j++) { const d = (20 + j * 18) * z * 0.6, cx = x + Math.cos(up) * d + 8 * Math.sin(t * 3 + j), cy = y + Math.sin(up) * d, r = (6 + j * 4) * z * 0.6; g.strokeStyle = INK; g.lineWidth = 1.6; g.beginPath(); g.arc(cx, cy, r, t * 4 + j, t * 4 + j + 4.8); g.stroke(); g.beginPath(); g.arc(cx, cy, r * 0.5, t * 4 + j + 2, t * 4 + j + 5.5); g.stroke(); }
          else for (let j = 0; j < 70; j++) { const d = (10 + XY.hash(j, 581) * 90) * z * 0.6, a = up + (XY.hash(j, 582) - 0.5) * 1.4; D(g, x + Math.cos(a) * d, y + Math.sin(a) * d - 10 * z, 0.8 + XY.hash(j, 583) * 1.6); } }
        bell(g, x, y, sc, rot);
      }
      if (b >= CATCH_T && b < CATCH_T + 0.7) { const q = (b - CATCH_T) / 0.7; for (let j = 0; j < 16; j++) { const a = j / 16 * TAU, r0 = 60 + 50 * q, r1 = r0 + (j % 2 ? 26 : 52) * (1 - q * 0.7); pen(g, [sEnd[0] + Math.cos(a) * r0, sEnd[1] + Math.sin(a) * r0, sEnd[0] + Math.cos(a) * r1, sEnd[1] + Math.sin(a) * r1], 2.6); } }
      // the caption, set line by line as the page is read
      const n = Math.floor(XY.clamp((b + 0.6) / 1.8) * CAP.length);
      K.text(g, CAP.slice(0, n), 208, 756, XY.font(27, '"Songti SC", serif', 'bold'), INK);
    },
  };
})();
