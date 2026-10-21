// 14 敦煌星图 · 请求灵吉 — a buff paper scroll in the manner of the Dunhuang star atlas: a circular north-polar map
// in the middle, strips of the cylindrical chart either side, stars in the three schools' colours (red 石氏, black
// 甘氏, yellow 巫咸) joined by ink lines, columns of kai script. The yellow wind is a stream of yellow stars pouring
// from the marten asterism (top right) over the pilgrims; at beat 3 it spirals into the pole — the vermilion 定风丹 —
// and then the golden dragon asterism leaves 灵吉's staff and seizes the marten. The pilgrims are star-figures too.
(() => {
  'use strict';
  const XY = window.XY, TAU = XY.TAU, K = XY.KIT_B;
  const PAPER = '#E4D2A8', INK = '#2E2218', RED = '#B8301E', YEL = '#E2B630', GREY = 'rgba(46,34,24,0.55)';
  const PC = [590, 292], PR = 190;   // the polar disc
  const MART = [980, 214];           // the marten asterism
  const stroke = (g, pts, w, col) => { g.strokeStyle = col; g.lineWidth = w; XY.path(g, pts, false); g.stroke(); };
  // a star in one of the three schools: red filled, black filled, yellow with an ink ring
  const star = (g, x, y, r, kind) => { g.beginPath(); g.arc(x, y, r, 0, TAU);
    if (kind === 0) { g.fillStyle = RED; g.fill(); } else if (kind === 1) { g.fillStyle = INK; g.fill(); } else { g.fillStyle = YEL; g.fill(); g.strokeStyle = INK; g.lineWidth = 0.9; g.stroke(); } };
  // a deterministic asterism: a short polyline of stars around (x, y)
  const asterism = (R, x, y, n, sc) => { const o = []; let a = R() * TAU; for (let k = 0; k < n; k++) { o.push([x, y]); a += (R() - 0.5) * 2.2; x += Math.cos(a) * sc * (0.6 + R() * 0.8); y += Math.sin(a) * sc * (0.6 + R() * 0.8); } return o; };
  const ASTER = { polar: [], left: [], right: [] };
  { const R = XY.rng(1401);
    for (let k = 0; k < 16; k++) { const a = R() * TAU, d = 30 + R() * (PR - 50); ASTER.polar.push({ pts: asterism(R, Math.cos(a) * d, Math.sin(a) * d, 2 + Math.floor(R() * 4), 16), kind: Math.floor(R() * 3) }); }
    for (let k = 0; k < 14; k++) ASTER.left.push({ pts: asterism(R, (k % 2 ? 108 : 318) + R() * 56, 160 + R() * 280, 2 + Math.floor(R() * 4), 18), kind: Math.floor(R() * 3) });
    for (let k = 0; k < 9; k++) ASTER.right.push({ pts: asterism(R, 860 + R() * 260, 330 + R() * 120, 2 + Math.floor(R() * 4), 18), kind: Math.floor(R() * 3) }); }
  const drawAst = (g, A, dx, dy, rot, tw, t) => A.forEach((a, i) => {
    const P = a.pts.map(([x, y]) => [dx + x * Math.cos(rot) - y * Math.sin(rot), dy + x * Math.sin(rot) + y * Math.cos(rot)]);
    g.strokeStyle = GREY; g.lineWidth = 1; g.beginPath(); P.forEach(([x, y], k) => k ? g.lineTo(x, y) : g.moveTo(x, y)); g.stroke();
    P.forEach(([x, y], k) => star(g, x, y, 3.2 + (tw ? 0.9 * Math.sin(t * (2 + (i * 7 + k) % 5) + i + k) : 0), a.kind)); });
  // the marten asterism (黄毛貂鼠): yellow stars outlining a long body, round ears, a bushy tail
  const MPTS = [[-70, 10], [-52, -6], [-30, -12], [0, -14], [30, -10], [52, -20], [64, -34], [72, -24], [80, -12], [64, -2], [40, 10], [10, 16], [-20, 18], [-50, 22], [-86, 30], [-104, 12], [-96, -10], [-80, -2]];
  const MLINK = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 9], [9, 10], [10, 11], [11, 12], [12, 13], [13, 0], [0, 17], [17, 16], [16, 15], [15, 14], [14, 13]];

  // ------------------------------------------------------------ paper
  const paper = (g, W, H) => {
    g.fillStyle = PAPER; g.fillRect(0, 0, W, H);
    const R = XY.rng(1407);
    for (let k = 0; k < 2600; k++) { const x = R() * W, y = R() * H, a = R() * Math.PI, l = 3 + R() * 12; g.strokeStyle = R() < 0.5 ? 'rgba(120,90,50,0.10)' : 'rgba(255,248,226,0.22)'; g.lineWidth = 0.6 + R() * 0.6; g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l); g.stroke(); }
    for (let k = 0; k < 40; k++) { const x = R() * W, y = R() * H, r = 2 + R() * 14, rg = g.createRadialGradient(x, y, 0, x, y, r); rg.addColorStop(0, 'rgba(150,100,50,0.22)'); rg.addColorStop(1, 'rgba(150,100,50,0)'); g.fillStyle = rg; g.fillRect(x - r, y - r, 2 * r, 2 * r); }
    [392, 798].forEach(x => { g.fillStyle = 'rgba(150,110,60,0.16)'; g.fillRect(x - 5, 0, 10, H); g.fillStyle = 'rgba(90,60,30,0.18)'; g.fillRect(x + 5, 0, 1.4, H); });
    const vg = g.createRadialGradient(W / 2, H / 2, H * 0.3, W / 2, H / 2, W * 0.7); vg.addColorStop(0, 'rgba(120,80,30,0)'); vg.addColorStop(1, 'rgba(120,80,30,0.28)'); g.fillStyle = vg; g.fillRect(0, 0, W, H);
    // stains and a water tide line along the bottom
    g.strokeStyle = 'rgba(130,90,40,0.25)'; g.lineWidth = 2; g.beginPath(); for (let x = 0; x <= W; x += 12) g.lineTo(x, 760 + 8 * XY.noise1(x / 60, 3)); g.stroke();
  };
  const chart = (g, W) => {
    g.strokeStyle = INK; g.lineCap = 'round';
    // strips of the cylindrical chart, ruled, with the equator
    [[96, 130, 290, 336], [850, 130, 290, 336]].forEach(([x, y, w, h]) => { g.lineWidth = 1.6; g.strokeRect(x, y, w, h); g.lineWidth = 0.8; g.strokeStyle = GREY;
      g.beginPath(); g.moveTo(x, y + h * 0.55); g.lineTo(x + w, y + h * 0.55); g.stroke(); for (let k = 1; k < 4; k++) { g.beginPath(); g.moveTo(x + k * w / 4, y); g.lineTo(x + k * w / 4, y + h); g.stroke(); } g.strokeStyle = INK; });
    drawAst(g, ASTER.left, 0, 0, 0, false, 0); drawAst(g, ASTER.right, 0, 0, 0, false, 0);
    g.fillStyle = 'rgba(46,34,24,0.7)'; g.font = XY.font(17, XY.cnFont.kai); g.textAlign = 'center';
    [['角', 330, 150], ['亢', 340, 446], ['氐', 120, 446], ['房', 360, 300], ['心', 880, 450], ['尾', 1000, 450], ['箕', 1120, 300], ['斗', 1118, 446]].forEach(([c, x, y]) => g.fillText(c, x, y));
    g.font = XY.font(15, XY.cnFont.kai); [['紫', PC[0] - 14, PC[1] - 96], ['微', PC[0] + 14, PC[1] - 96]].forEach(([c, x, y]) => g.fillText(c, x, y)); g.textAlign = 'start';
    // the polar disc frame: outer rim, the circle of perpetual visibility, the twelve divisions
    g.lineWidth = 2.4; g.beginPath(); g.arc(PC[0], PC[1], PR, 0, TAU); g.stroke(); g.lineWidth = 1; g.beginPath(); g.arc(PC[0], PC[1], PR - 8, 0, TAU); g.stroke();
    g.strokeStyle = GREY; g.beginPath(); g.arc(PC[0], PC[1], PR * 0.42, 0, TAU); g.stroke();
    for (let k = 0; k < 12; k++) { const a = k / 12 * TAU; g.beginPath(); g.moveTo(PC[0] + Math.cos(a) * PR * 0.42, PC[1] + Math.sin(a) * PR * 0.42); g.lineTo(PC[0] + Math.cos(a) * (PR - 8), PC[1] + Math.sin(a) * (PR - 8)); g.stroke(); }
    // text: the counter at the left edge, 定风丹 by the disc, the 长庚星 note in the bottom panel
    g.fillStyle = INK; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.font = XY.font(36, XY.cnFont.kai); ['第', '十', '四', '难'].forEach((c, k) => g.fillText(c, 66, 160 + k * 44));
    g.font = XY.font(50, XY.cnFont.kai); ['定', '风', '丹'].forEach((c, k) => g.fillText(c, 812, 196 + k * 58));
    g.fillStyle = RED; g.beginPath(); g.arc(812, 152, 6, 0, TAU); g.fill();
    g.strokeStyle = INK; g.lineWidth = 1.2; g.strokeRect(40, 716, W - 80, 56); g.fillStyle = 'rgba(46,34,24,0.78)'; g.font = XY.font(24, XY.cnFont.kai); g.textAlign = 'left';
    g.fillText('上复齐天大圣听　老人乃是长庚星　须弥山有飞龙杖　灵吉当年受佛兵', 64, 745);
    g.textAlign = 'start'; g.textBaseline = 'alphabetic';
    g.strokeStyle = INK; g.lineWidth = 1.4; g.beginPath(); g.moveTo(40, 702); g.lineTo(W - 40, 702); g.stroke();
    // a faint wash drawing of the yellow marten under its asterism
    const mk = MPTS.map(([x, y]) => [MART[0] + x * 1.08, MART[1] + y * 1.15]), body = XY.RIG.spline([].concat(...mk.slice(0, 14)), true, 4);
    XY.path(g, body, true); g.fillStyle = 'rgba(214,160,60,0.22)'; g.fill(); g.strokeStyle = 'rgba(46,34,24,0.35)'; g.lineWidth = 1.2; g.stroke();
    const tail = XY.RIG.spline([].concat(...[mk[0], mk[17], mk[16], mk[15], mk[14], mk[13]]), true, 4); XY.path(g, tail, true); g.fillStyle = 'rgba(214,160,60,0.18)'; g.fill(); g.stroke();
    g.beginPath(); g.arc(MART[0] + 62, MART[1] - 30, 3, 0, TAU); g.fillStyle = 'rgba(46,34,24,0.5)'; g.fill();
  };
  // ------------------------------------------------------------ 灵吉菩萨 as a star-figure (v10): the bodhisattva drawn
  // the way the atlas draws a 星官 — stars at the joints of an outline, joined by ink lines; stars light up in order
  const LJ = (() => { const o = [], L = []; const add = (pts, kind, close) => { const i0 = o.length; for (let k = 0; k < pts.length; k += 2) o.push([pts[k], pts[k + 1], kind]);
      for (let k = i0; k < o.length - 1; k++) L.push([k, k + 1]); if (close) L.push([o.length - 1, i0]); };
    const ring = (cx, cy, r, n, kind) => { const p = []; for (let k = 0; k < n; k++) { const a = -Math.PI / 2 + k / n * TAU; p.push(cx + Math.cos(a) * r, cy + Math.sin(a) * r); } add(p, kind, true); };
    ring(214, 214, 44, 16, 2);                                                 // halo
    ring(214, 216, 17, 8, 0);                                                  // head
    add([206, 192, 214, 182, 222, 192], 0, false);                             // usnisha
    add([196, 240, 178, 262, 168, 330, 160, 400, 176, 420, 252, 420, 268, 400, 258, 330, 248, 262, 232, 240], 1, true);   // robe
    add([196, 262, 214, 300, 232, 262], 0, false); add([180, 340, 214, 352, 250, 340], 0, false);                         // robe folds
    add([178, 266, 152, 312, 186, 334], 0, false);                             // left arm, hand at the chest
    add([248, 266, 278, 296, 288, 262], 0, false);                             // right arm up to the staff
    add([150, 432, 190, 422, 240, 426, 286, 430, 300, 440], 2, false);          // cloud
    return { pts: o, lines: L }; })();
  const STAFF = [[288, 440], [288, 150]];
  const lingji = (g, reveal, staffDragon, t) => {
    if (reveal <= 0) return;
    const n = LJ.pts.length, lit = reveal * (n + 4);
    g.strokeStyle = 'rgba(184,48,30,0.6)'; g.lineWidth = 1.6;
    LJ.lines.forEach(([a, b]) => { if (Math.max(a, b) > lit) return; g.beginPath(); g.moveTo(LJ.pts[a][0], LJ.pts[a][1]); g.lineTo(LJ.pts[b][0], LJ.pts[b][1]); g.stroke(); });
    if (lit > n) { g.strokeStyle = INK; g.lineWidth = 2.4; g.beginPath(); g.moveTo(...STAFF[0]); g.lineTo(...STAFF[1]); g.stroke(); [0.2, 0.5, 0.8].forEach(q => star(g, 288, XY.lerp(440, 150, q), 3.4, 1)); }
    LJ.pts.forEach(([x, y, kind], k) => { if (k > lit) return; const fl = Math.max(0, 1 - (lit - k) / 3); star(g, x, y, 3.6 + 3 * fl + 0.5 * Math.sin(t * 3 + k), kind); });
    if (lit > n && staffDragon) { stroke(g, XY.RIG.spline([288, 152, 274, 134, 290, 120, 306, 132, 296, 146], false, 4), 2.4, 'rgba(200,140,30,0.9)'); star(g, 290, 132, 5, 0); }
  };
  const PEN = { outline: INK, ow: 1.1, shade: 'rgba(120,80,40,0.12)',
    color: r => ({ fur: '#D9BC8E', face: '#F2E2C2', wkshirt: '#E2A48C', tiger: '#ECC98A', stripe: INK, gold: '#E2B630', staff: '#D2604A', ink: INK, horse: '#F4ECD8', horse2: '#E2D6BC',
      mane: '#EEE4CE', hoof: INK, saddle: '#C88A70', red: '#D2604A', robe: '#EFDAA4', kasaya: '#E09A80', skin: '#F2E2C2', metal: '#D8B860', bjrobe: '#BCC0C6', bjpants: '#A8ACB4',
      pig: '#F0CDBE', pig2: '#E2B2A2', wood: '#C8A47A' })[r] || XY.DEFAULT_COLORS[r] };
  const KIND = { wukong: 0, monk: 2, bajie: 1, shaseng: 1 };
  // the pilgrims as asterisms: their own bones become star lines
  const starTeam = (g, e, acts, t) => {
    const cast = Object.assign({}, XY.CURRENT_CAST || {}, (acts && acts.cast) || {});
    XY.procParts(e.phase, acts).forEach((F, fi) => { if (cast[F.name] === false) return;
      const ox = e.procX + F.x, oy = e.groundY;
      F.bones.forEach(b => { g.strokeStyle = 'rgba(184,48,30,0.55)'; g.lineWidth = 1.1; g.beginPath(); for (let k = 0; k < b.length; k += 2) k ? g.lineTo(ox + b[k], oy + b[k + 1]) : g.moveTo(ox + b[k], oy + b[k + 1]); g.stroke(); });
      F.bones.forEach((b, bi) => { for (let k = 0; k < b.length; k += 2) star(g, ox + b[k], oy + b[k + 1], 2.4 + 0.7 * Math.sin(t * 3 + bi + k + fi), KIND[F.name]); }); });
  };
  const bez = (p, s) => { const m = 1 - s; return [m * m * m * p[0] + 3 * m * m * s * p[2] + 3 * m * s * s * p[4] + s * s * s * p[6], m * m * m * p[1] + 3 * m * m * s * p[3] + 3 * m * s * s * p[5] + s * s * s * p[7]]; };
  const DPATH = [290, 132, 470, 20, 800, 10, MART[0] - 30, MART[1] - 50];

  // a big red star with rays: the 定风丹
  const pill = (g, x, y, r, rot, a) => { g.save(); g.translate(x, y); g.rotate(rot); g.globalAlpha = a;
    const rg = g.createRadialGradient(0, 0, r * 0.2, 0, 0, r * 2.4); rg.addColorStop(0, 'rgba(230,90,40,0.55)'); rg.addColorStop(1, 'rgba(230,110,40,0)'); g.fillStyle = rg; g.fillRect(-r * 2.4, -r * 2.4, r * 4.8, r * 4.8);
    g.beginPath(); for (let k = 0; k < 16; k++) { const an = k / 16 * TAU, rr = k % 2 ? r * 0.55 : r * (k % 4 ? 1.05 : 1.5); g[k ? 'lineTo' : 'moveTo'](Math.cos(an) * rr, Math.sin(an) * rr); } g.closePath();
    g.fillStyle = RED; g.fill(); g.strokeStyle = INK; g.lineWidth = 2; g.stroke();
    g.beginPath(); g.arc(0, 0, r * 0.45, 0, TAU); g.fillStyle = '#E8603A'; g.fill(); g.stroke(); g.fillStyle = 'rgba(255,236,200,0.9)'; g.beginPath(); g.arc(-r * 0.15, -r * 0.15, r * 0.14, 0, TAU); g.fill();
    g.restore(); };
  const LJHAND = [186, 334];

  XY.STYLES.starmap = {
    hits: [4, 5.2, 6],
    bg(g, W, H) { paper(g, W, H); chart(g, W); },
    draw(g, e) {
      const { W, u, t, cell } = e; g.lineCap = 'round'; g.lineJoin = 'round';
      // the sky turns slowly about the pole — and half a turn when the pill takes the wind (beats 4–5.2)
      const turn = Math.PI * XY.easeIO((u - 0.5) / 0.15);
      drawAst(g, ASTER.polar, PC[0], PC[1], t * 0.06 + turn, true, t);
      // 太白金星 points the way: Venus slides across the scroll to where 灵吉 will appear
      const tb = XY.easeIO((u + 0.3) / 0.5), tx = XY.lerp(1150, 214, tb), ty = XY.lerp(70, 160, tb) - 60 * Math.sin(tb * Math.PI);
      if (tb < 1) { g.strokeStyle = 'rgba(46,34,24,0.35)'; g.lineWidth = 1; g.setLineDash([4, 6]); g.beginPath(); for (let k = 0; k <= 16; k++) { const q = tb * k / 16, x = XY.lerp(1150, 214, q), y = XY.lerp(70, 160, q) - 60 * Math.sin(q * Math.PI); k ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke(); g.setLineDash([]);
        g.beginPath(); g.arc(tx, ty, 8, 0, TAU); g.fillStyle = '#FFFCF0'; g.fill(); g.strokeStyle = INK; g.lineWidth = 1.6; g.stroke(); }
      // 灵吉菩萨 lights up star by star (beats 1.6–3), the dragon still coiled on the staff head
      const dr = XY.clamp((u - 0.63) / 0.12);
      lingji(g, XY.easeOut((u - 0.2) / 0.17), dr <= 0, t);
      // the marten asterism; seized (beat 6), darkened and dragged toward 灵吉
      const cap = XY.smooth((u - 0.75) / 0.05), drag = XY.easeIO((u - 0.8) / 0.25), msc = XY.lerp(1, 0.55, cap), mw = 0.08 * Math.sin(t * 7) * (1 - cap) + 0.3 * cap * Math.sin(t * 11) * (1 - drag);
      const MC = [XY.lerp(MART[0], 760, drag), XY.lerp(MART[1], 150, drag)];
      const MP = MPTS.map(([x, y]) => [MC[0] + (x * Math.cos(mw) - y * Math.sin(mw)) * msc, MC[1] + (x * Math.sin(mw) + y * Math.cos(mw)) * msc]);
      g.strokeStyle = cap > 0.5 ? GREY : 'rgba(150,110,20,0.85)'; g.lineWidth = 2; MLINK.forEach(([a, b]) => { g.beginPath(); g.moveTo(...MP[a]); g.lineTo(...MP[b]); g.stroke(); });
      MP.forEach(([x, y], k) => star(g, x, y, 4.4 + 0.9 * Math.sin(t * 5 + k), cap > 0.5 ? 1 : 2));
      // the golden dragon asterism: leaves the staff (beat 5), sweeps over the chart with claws out, coils round the marten (beat 6)
      if (dr > 0) { const hs = XY.easeIO(dr), coil = XY.smooth((u - 0.74) / 0.05), D = [];
        for (let i = 0; i < 28; i++) { const s = XY.clamp(hs - i * 0.028), p = bez(DPATH, s), q = bez(DPATH, Math.min(1, s + 0.01)), nx = -(q[1] - p[1]), ny = q[0] - p[0], nl = Math.hypot(nx, ny) || 1, wv = 22 * Math.sin(i * 0.8 - t * 7);
          const a = i * 0.36 + t * 1.6, cr = 92 - i * 1.6, c = [MC[0] + Math.cos(a) * cr, MC[1] + Math.sin(a) * cr * 0.7];
          D.push([XY.lerp(p[0] + nx / nl * wv, c[0], coil), XY.lerp(p[1] + ny / nl * wv, c[1], coil)]); }
        g.strokeStyle = 'rgba(120,70,10,0.5)'; g.lineWidth = 12; g.beginPath(); D.forEach(([x, y], k) => k ? g.lineTo(x, y) : g.moveTo(x, y)); g.stroke();
        g.strokeStyle = '#D8A030'; g.lineWidth = 6; g.stroke();
        [3, 8, 14, 19].forEach(i => { const [x, y] = D[i], [x2, y2] = D[i + 1], a = Math.atan2(y2 - y, x2 - x) + Math.PI / 2;
          for (const sd of [-1, 1]) { const fx = x + Math.cos(a) * 24 * sd, fy = y + Math.sin(a) * 24 * sd; stroke(g, [x, y, fx, fy], 3, '#D8A030');
            for (let c = -1; c <= 1; c++) stroke(g, [fx, fy, fx + Math.cos(a + c * 0.5) * 9 * sd, fy + Math.sin(a + c * 0.5) * 9 * sd], 2, INK); } });
        D.forEach(([x, y], i) => star(g, x, y, i === 0 ? 7 : 5 - i * 0.08, i % 3 === 1 ? 2 : 0));
        const [hx, hy] = D[0]; stroke(g, [hx, hy, hx - 12, hy - 22, hx - 2, hy - 32], 2.6, INK); stroke(g, [hx, hy, hx + 12, hy - 20, hx + 20, hy - 26], 2.6, INK); stroke(g, [hx + 4, hy + 4, hx + 26, hy + 10], 2, INK); }
      // ---- the pilgrims: pale washes in ink line, their joints set with stars
      const acts = { wukong: { shade: XY.smooth((u - 0.06) / 0.08) * (1 - XY.smooth((u - 0.6) / 0.06)), raise: XY.smooth((u - 0.74) / 0.06) * (1 - XY.smooth((u - 1.0) / 0.1)) },
        monk: { palm: XY.smooth((u - 0.44) / 0.05) * (1 - XY.smooth((u - 0.9) / 0.1)) }, bajie: { scratch: XY.smooth((u - 0.22) / 0.06) * (1 - XY.smooth((u - 0.4) / 0.06)) } };
      K.team(g, e.phase, e.procX, e.groundY, PEN, acts);
      starTeam(g, e, acts, t);
      // ---- the yellow wind: yellow stars streaming from the marten over the pilgrims, sucked into the pill (beats 4–5)
      const emit = XY.smooth((u + 0.1) / 0.2) * (1 - cap);
      const wpos = (k, tt, uu) => { const d = (tt * (260 + 140 * XY.hash(k, 2, 14)) + XY.hash(k, 3, 14) * 2400) % 1150, x0 = MART[0] - 100 - d, ln = Math.floor(XY.hash(k, 4, 14) * 5) - 2;
        const y0 = MART[1] + 24 + 0.34 * d + ln * 0.42 * (30 + 0.45 * d) + (XY.hash(k, 5, 14) - 0.5) * 18 + 22 * Math.sin(x0 / 90 + tt * 3 + ln);
        const c = XY.easeIn((uu - 0.5 - 0.06 * XY.hash(k, 6, 14)) / 0.08), vx = x0 - PC[0], vy = y0 - PC[1], r = Math.hypot(vx, vy) * (1 - c), a = Math.atan2(vy, vx) + c * 6;
        return x0 < 30 && c <= 0 ? null : [PC[0] + Math.cos(a) * r, PC[1] + Math.sin(a) * r, c]; };
      if (u < 0.65) for (let k = 0; k < 240; k++) { if (XY.hash(k, 1, 14) > emit) continue;
        const p = wpos(k, t, u), q = wpos(k, t - 0.07, u - 0.07 / cell.dur); if (!p || p[2] >= 1) continue;
        if (q && Math.hypot(p[0] - q[0], p[1] - q[1]) < 160) { g.strokeStyle = 'rgba(190,140,20,0.6)'; g.lineWidth = 2; g.beginPath(); g.moveTo(q[0], q[1]); g.lineTo(p[0], p[1]); g.stroke(); }
        star(g, p[0], p[1], 3.6 * (1 - 0.5 * p[2]), 2); }
      // ---- 定风丹: flung from 灵吉's hand (beat 3.5), it blooms into a big red star at the pole (beat 4)
      const fly = XY.clamp((u - 0.44) / 0.06), bloom = XY.easeOut((u - 0.5) / 0.04), ring = XY.clamp((u - 0.5) / 0.14);
      if (fly > 0 && fly < 1) { const q = XY.easeIn(fly), x = XY.lerp(LJHAND[0], PC[0], q), y = XY.lerp(LJHAND[1], PC[1], q) - 120 * Math.sin(q * Math.PI);
        for (let k = 1; k < 8; k++) { const qq = Math.max(0, q - k * 0.04); star(g, XY.lerp(LJHAND[0], PC[0], qq), XY.lerp(LJHAND[1], PC[1], qq) - 120 * Math.sin(qq * Math.PI), 5 - k * 0.5, 0); }
        pill(g, x, y, 12, e.lt * 4, 1); }
      if (u >= 0.5) { if (ring < 1) { g.strokeStyle = `rgba(184,48,30,${0.85 * (1 - ring)})`; g.lineWidth = 5; g.beginPath(); g.arc(PC[0], PC[1], 30 + (PR + 60) * XY.easeOut(ring), 0, TAU); g.stroke(); }
        pill(g, PC[0], PC[1], 18 + 30 * bloom * (1 + 0.12 * Math.max(0, 1 - (u - 0.5) / 0.05)), turn * 0.5 + e.lt * 0.3, 1); }
      else pill(g, PC[0], PC[1], 6, 0, 0.9);
      void W;
    },
    post(canvas, g, e) { K.zoomPost(canvas, g, e, PC[0], PC[1] + 60, K.zoom(e.u, [0.48, 0.54, 0.7], 1.12)); },
  };
})();
