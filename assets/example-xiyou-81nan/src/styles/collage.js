// 75 拼贴剪报 · 竹节山遭难 — a paper collage on a card board: torn magazine sky, 竹节山 of layered green papers and
// bamboo strips, 九曲盘桓洞 in black paper. 九灵元圣, a nine-headed lion pieced from newspaper and magazine scraps,
// stretches one cut-out neck down and bites 唐僧 off his horse (beat 2), then another takes 八戒 (beat 3).
(() => {
  'use strict';
  const XY = window.XY, K = XY.KIT_I, TAU = XY.TAU, { sin, cos, PI, hypot } = Math;
  const BOARD = '#EDE6D6', INKC = '#22201C';
  const NAMES = (XY.ALL_NAMES || ['西游记']).join('');

  // ------------------------------------------------------------ papers (tiles at device resolution, patterns mapped back to design units)
  const T = 256;
  const tile = (key, S, paint) => XY.keep(`i75:${key}:${S.toFixed(4)}`, T * S, T * S, cv => { const g = cv.getContext('2d'); g.scale(S, S); paint(g); });
  const newsprint = S => tile('news', S, g => {
    g.fillStyle = '#E8E3D4'; g.fillRect(0, 0, T, T); g.fillStyle = 'rgba(52,48,42,0.78)'; let n = 0;
    for (let col = 0; col < 3; col++) { const x0 = 6 + col * 84; g.font = XY.font(15, XY.cnFont.hei, 'bold'); g.fillText(NAMES.substr((col * 7) % 60, 5), x0, 22 + col * 6);
      g.font = XY.font(7.5, XY.cnFont.song); for (let y = 40 + col * 6; y < T - 4; y += 9.5) { g.fillText(NAMES.substr(n % (NAMES.length - 12), 10), x0, y); n += 7; } }
    g.fillStyle = 'rgba(52,48,42,0.5)'; g.fillRect(86, 30, 0.8, T - 34); g.fillRect(170, 36, 0.8, T - 40);
  });
  const dots = (key, S, bgc, dc, r, step) => tile(key, S, g => { g.fillStyle = bgc; g.fillRect(0, 0, T, T); g.fillStyle = dc;
    for (let y = 0, j = 0; y <= T; y += step, j++) for (let x = (j % 2) * step / 2; x <= T; x += step) { g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill(); } });
  const fibre = (key, S, bgc, fc) => tile(key, S, g => { g.fillStyle = bgc; g.fillRect(0, 0, T, T); const r = XY.rng(key.length * 97);
    for (let k = 0; k < 500; k++) { const x = r() * T, y = r() * T, a = r() * PI, l = 3 + r() * 10; g.strokeStyle = r() < 0.5 ? fc : 'rgba(255,255,255,0.25)'; g.lineWidth = 0.6;
      for (const dx of [-T, 0, T]) for (const dy of [-T, 0, T]) { g.beginPath(); g.moveTo(x + dx, y + dy); g.lineTo(x + dx + cos(a) * l, y + dy + sin(a) * l); g.stroke(); } } });
  const pat = (g, cv, S, rot = 0, ox = 0, oy = 0) => { const p = g.createPattern(cv, 'repeat'); p.setTransform(new DOMMatrix().translateSelf(ox, oy).rotateSelf(rot).scaleSelf(1 / S)); return p; };
  const PAPER = (g, S) => { const m = (cv, rot = 0) => pat(g, cv, S, rot); return { S,
    n: m(newsprint(S), -2), mag: m(dots('mag', S, '#F4C2D2', '#DB3F7E', 1.5, 5)), cya: m(dots('cya', S, '#CDEDF1', '#3BAFC8', 1.3, 5), 15), yel: m(dots('yel', S, '#F6DC6A', '#E8902A', 1.4, 5)),
    org: m(dots('org', S, '#F7A458', '#E2462C', 1.6, 5.5), 30), kraft: m(fibre('kraft', S, '#B88A5A', 'rgba(90,60,30,0.35)')), grn: m(fibre('grn', S, '#5E9A45', 'rgba(30,60,20,0.35)')),
    olv: m(fibre('olv', S, '#8EA24C', 'rgba(50,60,20,0.3)')), teal: m(fibre('teal', S, '#5F8F8A', 'rgba(20,50,50,0.3)')), blk: m(fibre('blk', S, '#24221F', 'rgba(255,255,255,0.08)')) }; };

  // a cut-out: drop shadow, a white paper border (scissor margin), then the printed face of the paper
  const torn = (pts, amp, seed) => XY.wobble(XY.densify(pts, 6, true), amp, seed, 0.12);
  const piece = (g, pts, fill, o = {}) => {
    const b = o.border == null ? 3.2 : o.border, sh = o.shadow == null ? 1 : o.shadow;
    g.save(); g.lineJoin = 'round';
    if (sh) { g.shadowColor = `rgba(40,30,20,${0.28 * sh})`; g.shadowBlur = 7 * sh * (o.S || 1); g.shadowOffsetX = 3 * sh * (o.S || 1); g.shadowOffsetY = 4 * sh * (o.S || 1); }
    XY.path(g, pts, true); g.fillStyle = '#FBF8F0'; g.fill(); if (b) { g.strokeStyle = '#FBF8F0'; g.lineWidth = 2 * b; g.stroke(); }
    g.shadowColor = 'transparent'; XY.path(g, pts, true); g.fillStyle = fill; g.fill();
    if (o.tint) { g.globalCompositeOperation = 'multiply'; g.fillStyle = o.tint; g.fill(); }
    g.restore();
  };
  const tape = (g, x, y, w, rot, seed) => { g.save(); g.translate(x, y); g.rotate(rot); const p = [-w / 2, -9];
    for (let k = 0; k <= 4; k++) p.push(w / 2 + (k % 2 ? 3 : 0), -9 + k * 4.5); for (let k = 0; k <= 4; k++) p.push(-w / 2 - (k % 2 ? 3 : 0), 9 - k * 4.5);
    g.fillStyle = 'rgba(232,220,180,0.78)'; XY.path(g, p, true); g.fill(); g.strokeStyle = 'rgba(160,140,100,0.25)'; g.lineWidth = 0.8; g.stroke(); g.restore(); };
  const rect = (x, y, w, h) => [x, y, x + w, y, x + w, y + h, x, y + h];

  // ------------------------------------------------------------ static: board, magazine sky, sun, 竹节山, bamboo, the cave, kraft ground, the lion's body
  const NECK0 = [880, 336];
  const bamboo = (g, P, x, y0, w, seed) => {
    piece(g, torn(rect(x - w / 2, y0, w, 704 - y0), 1, seed), P.grn, { border: 2, S: P.S });
    g.fillStyle = 'rgba(30,60,20,0.55)'; for (let y = y0 + 40 + 20 * XY.hash(seed, 1); y < 690; y += 58 + 14 * XY.hash(seed, y)) { g.fillRect(x - w / 2, y, w, 3.5); g.fillStyle = 'rgba(255,255,255,0.5)'; g.fillRect(x - w / 2, y + 3.5, w, 1.2); g.fillStyle = 'rgba(30,60,20,0.55)'; }
  };
  const leaf = (g, P, x, y, a, l) => piece(g, [x, y, x + cos(a - 0.12) * l * 0.5, y + sin(a - 0.12) * l * 0.5, x + cos(a) * l, y + sin(a) * l, x + cos(a + 0.12) * l * 0.5, y + sin(a + 0.12) * l * 0.5], P.olv, { border: 1.4, shadow: 0.5, S: P.S });
  const bg = (g, W, H, c, S) => {
    const P = PAPER(g, S);
    g.fillStyle = BOARD; g.fillRect(0, 0, W, H); g.fillStyle = pat(g, fibre('board', S, BOARD, 'rgba(120,100,70,0.14)'), S); g.fillRect(0, 0, W, H);
    // far: a torn magazine page of sky, its dots fading toward the horizon; a cut-out sun
    const sky = torn(rect(14, 14, W - 28, 650), 3, 1);
    piece(g, sky, P.cya, { border: 0, S });
    g.save(); XY.path(g, sky, true); g.clip(); let gr = g.createLinearGradient(0, 0, 0, 660); gr.addColorStop(0, 'rgba(255,255,255,0)'); gr.addColorStop(1, 'rgba(255,255,255,0.6)'); g.fillStyle = gr; g.fillRect(0, 0, W, 660); g.restore();
    piece(g, torn(XY.ellipse(560, 112, 54, 54, 40), 1.2, 3), P.org, { S });
    g.save(); g.beginPath(); g.arc(560, 112, 54, 0, TAU); g.clip(); g.globalAlpha = 0.35; g.fillStyle = P.n; g.globalCompositeOperation = 'multiply'; g.fillRect(500, 56, 120, 30); g.restore();
    // mid: 竹节山 in three torn papers
    const ridge = (base, amp, f, ph, seed) => { const p = [-10, 712]; for (let x = -10; x <= W + 10; x += 14) p.push(x, base - amp * Math.abs(sin(x / f + ph)) - 0.35 * amp * Math.abs(sin(x / (f * 0.37) + ph * 2))); p.push(W + 10, 712); return torn(p, 2.5, seed); };
    piece(g, ridge(400, 190, 130, 0.6, 21), P.teal, { S }); piece(g, ridge(486, 120, 96, 2.1, 22), P.n, { S, tint: '#A9BC55' }); piece(g, ridge(580, 70, 70, 1.2, 23), P.grn, { S });
    // bamboo strips with their joints (竹节), leaves
    [[40, 150, 22], [84, 196, 18], [138, 120, 24], [574, 268, 18], [618, 230, 22], [770, 300, 16]].forEach(([x, y0, w], k) => bamboo(g, P, x, y0, w, 30 + k));
    [[40, 210, -2.4], [40, 260, -0.5], [84, 240, -2.8], [138, 170, -0.4], [138, 230, -2.6], [618, 280, -0.6], [574, 320, -2.5], [770, 350, -0.7]].forEach(([x, y, a], k) => leaf(g, P, x, y, a, 58 + 10 * XY.hash(k, 4)));
    // 九曲盘桓洞: black paper arch with a white paper strip coiled nine times
    { const p = [268, 640]; for (let k = 0; k <= 16; k++) { const a = PI + k / 16 * PI; p.push(330 + cos(a) * 62, 592 + sin(a) * 66); } p.push(392, 640); piece(g, torn(p, 2, 40), P.blk, { S });
      const sp = []; for (let i = 0; i <= 160; i++) { const a = i / 160 * TAU * 4.5, r = 4 + i * 0.36; sp.push(330 + cos(a) * r * 0.76, 590 + sin(a) * r * 0.62); }
      g.save(); g.lineCap = g.lineJoin = 'round'; g.shadowColor = 'rgba(0,0,0,0.4)'; g.shadowBlur = 3 * S; g.shadowOffsetY = 2 * S; g.strokeStyle = '#F4F0E6'; g.lineWidth = 3.4; XY.path(g, sp, false); g.stroke(); g.restore(); }
    // near: kraft paper ground, cut grass
    const gp = [-10, 790]; for (let x = -10; x <= W + 10; x += 16) gp.push(x, 698 + 3 * XY.noise1(x / 22, 9)); gp.push(W + 10, 790);
    piece(g, torn(gp, 1.5, 50), P.kraft, { S, border: 2 });
    for (let k = 0; k < 26; k++) { const x = 20 + k * 46 + 14 * XY.hash(k, 51), h = 12 + 16 * XY.hash(k, 52); piece(g, [x - 7, 704, x - 2, 704 - h, x + 1, 704 - h * 0.4, x + 4, 704 - h * 0.9, x + 8, 704], P.grn, { S, border: 1.2, shadow: 0.4 }); }
    // 九灵元圣's body: patchwork of newspaper, yellow and pink scraps, facing the pilgrims
    g.save(); g.translate(0, -56);
    const body = [846, 318, 900, 288, 1000, 276, 1120, 284, 1200, 296, 1200, 704, 1150, 704, 1140, 648, 1064, 634, 1012, 652, 1002, 704, 952, 704, 946, 646, 924, 610, 906, 704, 852, 704, 858, 604, 838, 470];
    piece(g, torn(body, 2, 60), P.n, { S, tint: '#E9C468' });
    { const tl = []; for (let i = 0; i <= 14; i++) { const v = i / 14; tl.push(1150 - 40 * sin(v * PI * 0.9), 300 - 150 * v + 30 * sin(v * 5)); }   // tail curling up over the back, with its tuft
      piece(g, XY.RIG.ribbon(tl, 14, 8), P.n, { S, border: 2, tint: '#D9A64C' }); const e = [tl[28], tl[29]]; const tu = []; for (let i = 0; i < 18; i++) { const a = i / 18 * TAU, rr = i % 2 ? 14 : 26; tu.push(e[0] + cos(a) * rr, e[1] + sin(a) * rr); }
      piece(g, tu, P.kraft, { S, tint: '#8A5A2C' }); }
    piece(g, torn([1010, 470, 1090, 440, 1150, 470, 1170, 600, 1120, 660, 1040, 640], 2, 63), P.n, { S, border: 2.4, tint: '#D9A64C' });   // the haunch
    g.strokeStyle = 'rgba(40,30,20,0.5)'; g.lineWidth = 2; g.beginPath(); g.moveTo(1030, 520); g.quadraticCurveTo(1090, 470, 1150, 520); g.stroke();
    piece(g, torn([900, 300, 990, 290, 1010, 380, 930, 420, 880, 380], 2, 61), P.yel, { S, border: 2.4 });
    for (let k = 0; k < 6; k++) { const x = 1040 + k * 26, y = 296 + 6 * sin(k), L = 46 + 22 * XY.hash(k, 64);   // mane locks curling down the back
      piece(g, XY.RIG.spline([x - 14, y, x + 14, y, x + 22, y + L * 0.5, x + 30, y + L, x + 10, y + L * 0.7], true, 3), P.n, { S, border: 1.8, shadow: 0.5, tint: k % 2 ? '#D9A64C' : '#E3B860' }); }
    [[878, 690], [928, 690], [976, 690], [1026, 690]].forEach(([x, y], k) => piece(g, torn(XY.ellipse(x, y, 26, 13, 16), 1.5, 70 + k), P.yel, { S, border: 2 }));
    g.strokeStyle = INKC; g.lineWidth = 2.2; [[862, 694], [912, 694], [960, 694], [1010, 694]].forEach(([x, y]) => { for (let i = 0; i < 3; i++) { g.beginPath(); g.moveTo(x + i * 9, y - 6); g.lineTo(x + i * 9, y + 2); g.stroke(); } });
    g.restore();
    // tape at the sky page corners
    tape(g, 30, 26, 70, -0.6, 1); tape(g, W - 34, 24, 70, 0.6, 2); tape(g, 26, 640, 64, 0.7, 3);
  };

  // ------------------------------------------------------------ the nine heads, each cut from a different paper; they face the pilgrims (left)
  const PAP = ['n', 'kraft', 'n', 'kraft', 'org', 'n', 'kraft', 'n', 'kraft'], FACE = ['yel', 'mag', 'n', 'cya', 'yel', 'mag', 'n', 'yel', 'cya'];
  const REST = [[648, 252], [690, 150], [786, 88], [902, 66], [1010, 92], [1100, 156], [742, 214], [850, 168], [962, 190]];
  const RAD = [40, 38, 40, 42, 40, 38, 36, 40, 38];
  const mouthOf = (r, rot) => [cos(rot) * -r * 0.36 - sin(rot) * r * 0.46, sin(rot) * -r * 0.36 + cos(rot) * r * 0.46];
  const head = (g, P, x, y, r, rot, k, jaw) => {
    g.save(); g.translate(x, y); g.rotate(rot);
    const mane = []; for (let i = 0; i < 28; i++) { const a = i / 28 * TAU, rr = r * (i % 2 ? 0.82 : 1.05) * (1 + 0.07 * sin(i * 2.7 + k)); mane.push(cos(a) * rr, sin(a) * rr * 0.94); }
    piece(g, mane, P[PAP[k]], { S: P.S, tint: PAP[k] === 'n' ? '#C98C3E' : null });
    [[-0.5, -0.5], [0.16, -0.54]].forEach(([ex, ey]) => piece(g, [ex * r - r * 0.16, ey * r + r * 0.1, ex * r, ey * r - r * 0.18, ex * r + r * 0.16, ey * r + r * 0.08], P[FACE[k]], { S: P.S, border: 1.4, shadow: 0.3, tint: '#E6C08A' }));
    piece(g, torn(XY.ellipse(-r * 0.14, r * 0.1, r * 0.6, r * 0.56, 20), 1, k), P[FACE[k]], { S: P.S, border: 1.8, shadow: 0.4, tint: '#F3DCA6' });
    g.fillStyle = INKC;
    [[-0.44, -0.08], [0.02, -0.1]].forEach(([ex, ey]) => { g.beginPath(); g.ellipse(ex * r, ey * r, r * 0.09, r * 0.07, 0, 0, TAU); g.fill(); g.fillRect(ex * r - r * 0.13, ey * r - r * 0.2, r * 0.26, r * 0.06); });
    XY.path(g, [-r * 0.66, r * 0.04, -r * 0.44, r * 0.04, -r * 0.52, r * 0.2], true); g.fill();
    const jh = r * (0.08 + 0.34 * jaw); g.beginPath(); g.ellipse(-r * 0.36, r * 0.42, r * 0.26, jh, 0, 0, TAU); g.fill();
    if (jaw > 0.15) { g.fillStyle = '#FBF8F0'; [-0.5, -0.22].forEach(tx => { XY.path(g, [tx * r - 4, r * 0.42 - jh + 1, tx * r + 4, r * 0.42 - jh + 1, tx * r, r * 0.42 - jh + 10], true); g.fill(); }); }
    g.restore();
  };
  const neck = (g, P, a, b, k) => { const m = [(a[0] + b[0]) / 2 + (b[1] - a[1]) * 0.18, (a[1] + b[1]) / 2 - (b[0] - a[0]) * 0.18], pts = [];
    for (let i = 0; i <= 12; i++) { const v = i / 12, w = 1 - v; pts.push(w * w * a[0] + 2 * w * v * m[0] + v * v * b[0], w * w * a[1] + 2 * w * v * m[1] + v * v * b[1]); }
    piece(g, XY.RIG.ribbon(pts, 30, 18), P[k % 2 ? 'n' : 'yel'], { S: P.S, border: 2.2, shadow: 0.6, tint: k % 2 ? '#E9C468' : null }); };
  // 玉华王 and a prince, cut small from a sepia photo, already dangling from two mouths
  const hostage = (g, P, x, y, sw, king) => { g.save(); g.translate(x, y); g.rotate(sw);
    piece(g, [-9, 4, 9, 4, 13, 44, -13, 44], P.n, { S: P.S, border: 1.6, shadow: 0.5, tint: king ? '#D9A066' : '#8FB0C8' });
    piece(g, XY.ellipse(0, -4, 8, 9, 14), P.n, { S: P.S, border: 1.6, shadow: 0.4, tint: '#F0C9A0' });
    g.fillStyle = king ? '#E2B232' : INKC; if (king) XY.path(g, [-8, -10, -8, -20, -4, -14, 0, -22, 4, -14, 8, -20, 8, -10], true); else XY.path(g, [-9, -9, 9, -9, 6, -17, -6, -17], true); g.fill();
    g.restore(); };

  // ------------------------------------------------------------ the bites: a head dives to its victim, then rises carrying it
  const sm = XY.smooth, W_ = K.win;
  // v10 (8 beats): the nine heads roar together on 1.8; one dives and bites 唐僧 off the horse on 4 (hit), another takes 八戒 on 5.2 (hit)
  const ROAR = 1.8, B1 = 4.0, B2 = 5.2;
  const actsAt = b => ({ wukong: { shade: sm(W_(b, 1.5, 1.9)) * (1 - sm(W_(b, 2.3, 2.6))), raise: sm(W_(b, 2.5, 2.9)) * (1 - sm(W_(b, 3.6, 3.9))), strike: sm(W_(b, 5.6, 5.9)) * (1 - sm(W_(b, 6.6, 7.2))) },
    monk: { palm: sm(W_(b, 2.6, 3.0)) }, bajie: {}, shaseng: { lift: sm(W_(b, B1, B1 + 0.3)) * (1 - sm(W_(b, B1 + 0.9, B1 + 1.4))) } });
  const BITES = [{ key: 'monk.chest', fi: 2, head: 0, gb: B1, carry: [640, 300] }, { key: 'bajie.chest', fi: 1, head: 6, gb: B2, carry: [790, 280] }];
  let GRAB = null;
  const grabs = e => { if (GRAB && GRAB.n === e.cell.n) return GRAB;
    GRAB = { n: e.cell.n, at: BITES.map(B => { const t = e.cell.t0 + B.gb * XY.BEAT, p = XY.anchor(B.key, XY.walkPhase(t), actsAt(B.gb)); return [XY.procWorldX(t) - e.cell.x + p[0], e.groundY + p[1]]; }) };
    return GRAB; };
  const bob = (k, t) => { const s = Math.floor(t * 8); return [3 * sin(s * 1.3 + k * 2), 3 * cos(s * 0.9 + k * 3), 0.07 * sin(s * 0.7 + k)]; };
  const slap = (g, u, u0, cx, cy, fn) => { if (u < u0) return; const s = 1 + 0.35 * (1 - XY.easeOut(K.win(u, u0, u0 + 0.035))); g.save(); g.translate(cx, cy); g.scale(s, s); g.translate(-cx, -cy); fn(); g.restore(); };
  const ht = S => XY.keep('i75ht:' + S.toFixed(4), Math.round(7 * S), Math.round(7 * S), cv => { const g = cv.getContext('2d'), k = cv.width; g.fillStyle = 'rgba(40,30,20,1)';
    [[0.25, 0.25], [0.75, 0.75]].forEach(([x, y]) => { g.beginPath(); g.arc(x * k, y * k, k * 0.14, 0, TAU); g.fill(); }); });
  const lerp2 = (a, b, v) => [XY.lerp(a[0], b[0], v), XY.lerp(a[1], b[1], v)];

  XY.STYLES.collage = {
    bg,
    hits: [B1, B2],
    draw(g, e) {
      const { W, t, u, beat, S } = e, P = PAPER(g, S), A = actsAt(beat), G = grabs(e), ts = Math.floor(t * 12) / 12, st = Math.floor(t * 8);
      // torn white clouds hop along at 12 fps; bamboo leaves twitch at 8 fps
      [[180, 128, 92, 30], [440, 210, 70, 22], [780, 150, 110, 32]].forEach(([x0, y, w, h], k) => { const x = ((x0 + ts * (12 + 5 * k)) % (W + 260)) - 130;
        piece(g, torn(XY.ellipse(x, y, w, h, 22), 5, 90 + k), '#FBF9F3', { S, border: 0, shadow: 0.5 }); });
      [[40, 150, -1.3], [138, 120, -1.9], [618, 230, -1.2], [84, 196, -2.0], [574, 268, -1.5]].forEach(([x, y, a], k) => leaf(g, P, x, y, a + 0.16 * sin(st * 0.9 + k * 2), 64));
      // the nine heads: stop-motion bob; two of them dive and bite
      const roar = K.outBack(W_(beat, ROAR, ROAR + 0.25), 2) * (1 - sm(W_(beat, ROAR + 0.9, ROAR + 1.4)));
      const heads = REST.map((R, k) => { const [bx, by, br] = bob(k, t); return { x: R[0] + bx - 30 * roar, y: R[1] + by + 10 * roar, rot: br - 0.3 * roar, jaw: 0.22 + 0.14 * sin(st * 0.8 + k) + 0.7 * roar, k, bite: false, r: RAD[k] }; });
      const M = {};
      BITES.forEach((B, j) => {
        const h = heads[B.head], now = e.at(B.key, A); let mouth = null, jaw = h.jaw, rot = h.rot, grow = 0;
        if (beat >= B.gb - 0.6 && beat < B.gb) { const v = XY.easeIn(K.win(beat, B.gb - 0.6, B.gb)); grow = v; const mo = mouthOf(h.r, rot); mouth = lerp2([h.x + mo[0], h.y + mo[1]], [now[0], now[1] - 34], v); jaw = 0.3 + 0.7 * v; rot = XY.lerp(rot, -0.55, v); }
        else if (beat >= B.gb) { const v = XY.easeOut(K.win(beat, B.gb, B.gb + 1.0)), [bx, by] = bob(B.head, t); grow = 1; mouth = lerp2([G.at[j][0], G.at[j][1] - 34], [B.carry[0] + bx, B.carry[1] + by], v); jaw = 0.45; rot = XY.lerp(-0.55, 0.1, v);
          const f = XY.procParts(e.phase, A)[B.fi], a = [now[0] - e.procX - f.x, now[1] - e.groundY], sw = 0.22 * sin(t * 5 + j * 2) * v - 0.15 * (1 - v);
          M[B.fi] = K.around(a[0], a[1], sw, 1.2, mouth[0] - now[0], mouth[1] + 40 - now[1]); }
        if (mouth) { const r = RAD[B.head] * (1 + 0.5 * grow), mo = mouthOf(r, rot); Object.assign(h, { x: mouth[0] - mo[0], y: mouth[1] - mo[1], rot, jaw, bite: true, r }); }
      });
      const roots = heads.map(h => h.x).sort((a, b) => a - b);
      heads.forEach(h => { const v = roots.indexOf(h.x) / 8; neck(g, P, [XY.lerp(846, 968, v), XY.lerp(296, 244, v) + 14 * sin(v * PI)], [h.x, h.y], h.k); });
      [[1, 'kraft', '#B9843F'], [0.7, 'n', '#C99848']].forEach(([s, pp, tn], L) => { const c = [];   // the shaggy collar where nine necks join
        for (let i = 0; i < 30; i++) { const a = i / 30 * TAU, rr = s * (i % 2 ? 0.9 : 1.02) * (1 + 0.06 * sin(i * 1.9 + L)); c.push(906 + cos(a) * 80 * rr, 280 + sin(a) * 54 * rr); }
        piece(g, c, P[pp], { S, tint: tn, shadow: 0.8 }); });
      [[2, true], [4, false]].forEach(([k, king]) => { const h = heads[k], mo = mouthOf(h.r, h.rot); hostage(g, P, h.x + mo[0], h.y + mo[1] + 4, 0.2 * sin(t * 4 + k), king); });
      heads.forEach(h => { if (!h.bite) head(g, P, h.x, h.y, h.r, h.rot, h.k, h.jaw); });
      // the roar: a ransom-note 吼 slapped onto the board, thrown off again
      if (beat >= ROAR && beat < ROAR + 1.6) { const s0 = 1 + 0.5 * (1 - XY.easeOut(W_(beat, ROAR, ROAR + 0.12))), off = XY.easeIn(W_(beat, ROAR + 1.1, ROAR + 1.6));
        g.save(); g.translate(560 - 200 * off, 360 - 160 * off); g.rotate(-0.12 - 1.2 * off); g.scale(s0 * (1 - off), s0 * (1 - off)); piece(g, torn(rect(-58, -60, 116, 120), 1.2, 140), '#D8352A', { S, border: 2.6 });
        g.fillStyle = '#FBF8F0'; g.font = XY.font(96, XY.cnFont.hei, '900'); g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('吼', 0, 6); g.restore(); }
      // the pilgrims as one cut-out: printed dots, a white scissor margin, a drop shadow; the rider leaves the saddle when bitten (cast.rider)
      const cut = (key, paint) => { const [pl, pg] = K.layer(e, key); paint(pg); K.texture(pl, ht(S), 0.2, 'source-atop'); const bd = K.border(pl, key + 'b', '#FBF8F0', 3.4 * S, 12);
        g.save(); g.shadowColor = 'rgba(40,30,20,0.34)'; g.shadowBlur = 8 * S; g.shadowOffsetX = 3 * S; g.shadowOffsetY = 5 * S; K.blit(g, bd); g.restore(); K.blit(g, pl); };
      const A2 = Object.assign({}, A, { cast: { rider: !M[2] } });
      cut('i75proc', pg => K.draw(pg, e.phase, e.procX, e.groundY, {}, A2, { skip: fi => fi === 1 && !!M[1] }));
      if (M[2] || M[1]) cut('i75car', pg => { if (M[2]) K.draw(pg, e.phase, e.procX, e.groundY, {}, A, { only: 2, ignoreCast: true, skip: (fi, pi, p, tag) => tag !== 'monk' || (p.role === 'red' && p.fine), xf: () => M[2] });
        if (M[1]) K.draw(pg, e.phase, e.procX, e.groundY, {}, A, { only: 1, xf: () => M[1] }); });
      heads.forEach(h => { if (h.bite) head(g, P, h.x, h.y, h.r, h.rot, h.k, h.jaw); });
      // the title: ransom-note letters slapped down one by one, then a typewritten strip with the count
      const LET = [['竹', 40, 34, 104, 114, -0.07, '#D8352A', '#FBF8F0', XY.font(90, XY.cnFont.hei, '900')], ['节', 150, 50, 98, 102, 0.05, P.n, '#22201C', XY.font(84, XY.cnFont.song, '900')],
        ['山', 254, 28, 100, 118, -0.03, P.yel, '#22201C', XY.font(94, XY.cnFont.kai, 'bold')]];
      LET.forEach(([ch, x, y, w, h, rot, bgc, fg, font], k) => slap(g, u, -0.32 + k * 0.06, x + w / 2, y + h / 2, () => {
        g.save(); g.translate(x + w / 2, y + h / 2); g.rotate(rot); piece(g, torn(rect(-w / 2, -h / 2, w, h), 1.2, 100 + k), bgc, { S, border: 2.4 });
        g.fillStyle = fg; g.font = font; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(ch, 0, 5); g.restore(); tape(g, x + w / 2 + (k - 1) * 12, y + 3, 46, (k - 1) * 0.35, k); }));
      slap(g, u, -0.12, 150, 190, () => { g.save(); g.translate(150, 190); g.rotate(0.025); piece(g, rect(-104, -20, 208, 40), '#FBFAF4', { S, border: 0, shadow: 0.8 });
        g.font = '31px "American Typewriter", "Songti SC", serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = 'rgba(30,28,26,0.32)'; g.fillText('第 75 难', 0.9, 2.6); g.fillStyle = '#26231F'; g.fillText('第 75 难', 0, 2); g.restore(); });
    },
  };
})();
