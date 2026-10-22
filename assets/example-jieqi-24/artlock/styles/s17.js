// s17 寒露 · 七巧板. The village is laid out with tangram pieces on a wooden board: two large triangles, a medium
// triangle, two small triangles, a square and a parallelogram, all from one 4×4 square, so every piece keeps its true
// proportion; flat wood and lacquer tops, a hairline gap between pieces, a soft drop shadow. Figures are exactly one set
// of seven: the child (square head, two small triangles for the twin buns), the ox (two small triangles for horns), each
// sparrow, each clam and the chrysanthemum. Moment (雀入大水为蛤): five tangram sparrows dive at the pond; at the water line
// each one's seven pieces come apart, flip and spin, and fall into the water re-assembled as a seven-piece clam.
// The chrysanthemum under the wall opens yellow (菊有黄华).
// Film unit (8 s, one pentad per bar): 候一 鸿雁来宾 — three tangram geese fly across the sky from the right;
// 候二 雀入大水为蛤 (key) — three tangram sparrows dive at the pond, burst apart at the water line and their pieces lock
// into three clams exactly at 4.0 s (rings on the water); 候三 菊有黄华 — the chrysanthemums open from green bud to yellow.
(function () {
  const JQ = window.JQ, S = JQ.SCENE, L = JQ.L, W = JQ.W, H = JQ.H, TAU = Math.PI * 2, D = Math.PI / 180, R2 = Math.SQRT2;
  const BAR = 8 / 3, IMP = 1 * BAR + 4 / 3, HOU = JQ.TERMS[16].hou;
  const SONG = '"Songti SC", "STSong", serif';
  if (document.fonts) document.fonts.load(`900 88px ${SONG}`, '寒露雀入大水为蛤七巧');
  // the seven shapes in units of u (the tangram square is 4u a side), centroid at the origin, apex/long side up
  const SH = {
    L: [[-2, 2 / 3], [2, 2 / 3], [0, -4 / 3]],
    M: [[-R2, R2 / 3], [R2, R2 / 3], [0, -2 * R2 / 3]],
    S: [[-1, 1 / 3], [1, 1 / 3], [0, -2 / 3]],
    Q: [[-R2 / 2, -R2 / 2], [R2 / 2, -R2 / 2], [R2 / 2, R2 / 2], [-R2 / 2, R2 / 2]],
    P: [[-1.5, -0.5], [0.5, -0.5], [1.5, 0.5], [-0.5, 0.5]],
  };
  // place a piece: p = { t, x, y, r (radians), f (±1 mirror, may pass through 0 while flipping) } in units; returns pts in px
  const place = (p, ox, oy, u, gap = 2.2) => { const c = Math.cos(p.r), s = Math.sin(p.r), f = p.f == null ? 1 : p.f, sh = SH[p.t], k = 1 - gap / (u * 1.15);
    return sh.map(([a, b]) => { const x = a * f * k, y = b * k; return [ox + (p.x + x * c - y * s) * u, oy + (p.y + x * s + y * c) * u]; }); };
  const poly = pts => JQ.P(pts);
  const lighten = (hex, k) => JQ.mix(hex, '#ffffff', k), darken = (hex, k) => JQ.mix(hex, '#000000', k);
  // draw a list of placed pieces: shadows first, then tops with a light upper edge (and grain when `grain`)
  const drawSet = (g, set, ox, oy, u, o = {}) => {
    const ps = set.map(p => ({ p, pts: place(p, ox, oy, u, o.gap) }));
    g.fillStyle = `rgba(52,30,14,${o.shadow == null ? 0.26 : o.shadow})`; for (const { pts } of ps) { g.fill(poly(pts.map(([x, y]) => [x + 4, y + 5]))); }
    for (const { p, pts } of ps) {
      const path = poly(pts), col = p.c || '#B08050'; g.globalAlpha = p.a == null ? 1 : p.a;
      g.fillStyle = col; g.fill(path);
      if (o.grain) { g.save(); g.clip(path); g.strokeStyle = darken(col, 0.18); g.globalAlpha *= 0.35; g.lineWidth = 1; const a = (JQ.hash(Math.round(pts[0][0]), Math.round(pts[0][1])) - 0.5) * 0.6, cx = pts[0][0], cy = pts[0][1];
        g.beginPath(); for (let k = -16; k <= 16; k++) { const d = k * 7 + JQ.hash(k, Math.round(cx)) * 4; g.moveTo(cx - 400 * Math.cos(a) - d * Math.sin(a), cy - 400 * Math.sin(a) + d * Math.cos(a)); g.lineTo(cx + 400 * Math.cos(a) - d * Math.sin(a), cy + 400 * Math.sin(a) + d * Math.cos(a)); } g.stroke(); g.restore(); g.globalAlpha = p.a == null ? 1 : p.a; }
      g.strokeStyle = lighten(col, 0.28); g.lineWidth = 1.2; g.beginPath(); g.moveTo(...pts[pts.length - 1]); pts.forEach(q => g.lineTo(...q)); g.stroke();
      g.strokeStyle = darken(col, 0.35); g.lineWidth = 1; g.beginPath(); g.moveTo(...pts[0]); g.lineTo(...pts[1]); g.stroke();
      g.globalAlpha = 1;
    }
  };
  const P_ = (t, x, y, r, c, f) => ({ t, x, y, r: r * D, c, f });

  // ---------------------------------------------------------------- the sets
  // child (u = 21), ground at y = 0: parallelogram legs, two large triangles as the padded coat, square head, two buns, arm pointing up
  const KID = [P_('P', 0, -1.5, 90, '#3A3E52'), P_('L', 0, -3.3, 0, '#9A2E22'), P_('L', 0, -4.6, 0, '#B8402C'), P_('M', 2.0, -5.5, 45, '#B8402C'),
    P_('Q', 0, -6.9, 45, '#E6C49A'), P_('S', -0.69, -7.79, -45, '#1E1A18'), P_('S', 0.69, -7.79, 45, '#1E1A18')];
  // ox (u = 30) facing right: body from two large triangles, medium triangle head, square and parallelogram legs; the
  // small-triangle horns are laid first and tucked under the head, so only their tips show
  const OX = [P_('P', -2.1, -0.6, 0, '#5E3E26'), P_('Q', 1.2, -0.62, 0, '#5E3E26'), P_('L', -1.2, -1.967, 0, '#9A6A3E'), P_('L', 0.8, -2.633, 180, '#86582F'),
    P_('S', 2.75, -3.95, -90, '#E6D8B8'), P_('S', 5.25, -3.95, 90, '#E6D8B8'), P_('M', 4.0, -3.13, 180, '#74482A')];
  // the old 槐 (u = 74): a diamond crown of the two large triangles, tufts of the others, parallelogram trunk on a square root
  const TREE = [P_('P', 0.12, 3.5, 90, '#4A3326'), P_('Q', 0, 6.0, 45, '#5A3E2C'), P_('L', 0, -0.667, 0, '#C9852F'), P_('L', 0, 0.667, 180, '#B5562E'),
    P_('M', -2.55, 0.25, -90, '#8E3B26'), P_('S', 2.55, -0.1, 90, '#D9A040'), P_('S', -1.2, -1.6, -45, '#A8452A')];
  // far mountains (u = 78), bases on the horizon
  const MTN = [P_('S', 1.55, 5.18, 0, '#7E5A3C'), P_('L', 4.25, 4.85, 0, '#6B4A32'), P_('M', 7.7, 5.04, 0, '#3B2A22'), P_('Q', 10.5, 5.25, 45, '#7E5A3C'),
    P_('L', 13.6, 4.85, 0, '#5A3E2C'), P_('P', 18.4, 5.0, 0, '#6B4A32', -1), P_('S', 22.6, 5.18, 0, '#3B2A22')];
  // the pond (u = 72) laid flat: a straight water line on top
  const POND = [P_('L', 13.75, 11.667, 180, '#1E2430'), P_('M', 12.417, 12.333, -135, '#25344A'), P_('S', 15.417, 12, -90, '#2C3E58'), P_('S', 14.75, 12.667, 0, '#1E2430'),
    P_('L', 10.81, 11.94, 45, '#2C3E58'), P_('P', 17.25, 11.5, 0, '#25344A'), P_('Q', 16.457, 12.707, 0, '#1E2430')];
  // a sparrow (u = 26) flying right, a compact 七巧图 bird: hull-shaped body (large triangle, flat back) with the square
  // as the plump breast and a small triangle filling the belly, a small-triangle wedge head (its point is the beak),
  // a raised sail wing (large triangle), the medium triangle as the far wing, the parallelogram tail cocked up
  const SPAR = [P_('M', -0.2, -1.9, 130, '#4A2E1A'), P_('P', -2.9, -1.0, -25, '#7A5234'), P_('L', 0, 0, 180, '#A07450'), P_('Q', 2.0, 0.333, 45, '#C8A27A'),
    P_('S', 1.0, 1.0, 0, '#D8BC96'), P_('S', 2.33, -1.0, 90, '#5A3820'), P_('L', -0.26, -1.88, 155, '#8A5A34')];
  // a goose (u = 17) flying right (drawn mirrored, flying left): the sparrow's compact body (hull, breast square, belly
  // triangle), a medium-triangle tail, a parallelogram neck stretched forward and up, a small-triangle head, a sail wing
  const GOOSE = [P_('M', -2.5, -0.2, -90, '#6A5E50'), P_('L', 0, 0, 180, '#B4AA98'), P_('Q', 2.0, 0.333, 45, '#CFC6B4'), P_('S', 1.0, 1.0, 0, '#9A9080'),
    P_('P', 3.0, -1.0, 0, '#2E2620', -1), P_('S', 4.7, -1.5, 90, '#1E1A16'), P_('L', -0.26, -1.88, 155, '#D8D0BE')];
  const mir = set => set.map(p => Object.assign({}, p, { x: -p.x, r: -p.r, f: -(p.f == null ? 1 : p.f) }));
  const GOOSE_L = mir(GOOSE);
  // a clam (u = 19): all seven pieces make one big triangle, umbo at the top, the seams reading as growth lines
  // (left half = the two large triangles; right half = the other five, as in the standard square). Poses are fitted.
  const fit = (t, V) => { const cx = V.reduce((a, q) => a + q[0], 0) / V.length, cy = V.reduce((a, q) => a + q[1], 0) / V.length;
    for (const f of [1, -1]) for (let k = 0; k < 8; k++) { const r = k * 45 * D, c = Math.cos(r), sn = Math.sin(r), P = SH[t].map(([a, b]) => [cx + a * f * c - b * sn, cy + a * f * sn + b * c]);
      if (P.every(q => V.some(v => Math.hypot(v[0] - q[0], v[1] - q[1]) < 0.05))) return { t, x: cx, y: cy, r, f }; }
    return { t, x: cx, y: cy, r: 0, f: 1 }; };
  const cv = pts => pts.map(([x, y]) => [x, -y - 2]);      // turned over: the wide edge up, a fan on its hinge
  const CLAM0 = [['L', [[0, 0], [-4, 0], [-2, -2]], '#E8D6BC'], ['L', [[0, 0], [0, -4], [-2, -2]], '#D8BCA0'], ['M', [[0, 0], [2, 0], [0, -2]], '#E2C8B0'], ['S', [[4, 0], [3, -1], [2, 0]], '#D4B49A'],
    ['S', [[2, -2], [1, -3], [1, -1]], '#ECDCC6'], ['Q', [[3, -1], [2, -2], [1, -1], [2, 0]], '#CDAE94'], ['P', [[1, -3], [0, -4], [0, -2], [1, -1]], '#BFA088']].map(([t, V, c]) => Object.assign(fit(t, cv(V)), { c }));
  const CLAM = (() => { const used = new Set(); return SPAR.map(p => { const i = CLAM0.findIndex((q, k) => q.t === p.t && !used.has(k)); used.add(i); return CLAM0[i]; }); })();
  // the chrysanthemum (u = 21): five triangle petals pointing out, square heart, parallelogram stem
  const petal = (t, psi, d, c) => ({ t, psi: psi * D, d, c });
  const FLOWER = [petal('L', -62, 2 / 3 + 0.12, '#E8B428'), petal('L', 62, 2 / 3 + 0.12, '#F0C33A'), petal('M', 0, R2 / 3 + 0.12, '#F4CE4E'), petal('S', -128, 1 / 3 + 0.12, '#E0A622'), petal('S', 128, 1 / 3 + 0.12, '#E8B428')];

  // ---------------------------------------------------------------- the board and the fixed pieces (cached)
  const plank = (g, y0, y1, col, seed) => { g.fillStyle = col; g.fillRect(0, y0, W, y1 - y0); g.save(); g.beginPath(); g.rect(0, y0, W, y1 - y0); g.clip(); g.strokeStyle = darken(col, 0.12); g.lineWidth = 1;
    for (let y = y0 + 3; y < y1; y += 5) { g.globalAlpha = 0.18 + 0.3 * JQ.noise(y * 0.05, 0, seed); g.beginPath(); for (let x = 0; x <= W; x += 40) { const yy = y + Math.sin(x * 0.003 + y * 0.02 + seed) * 6 * JQ.noise(x * 0.002, y * 0.01, seed); x ? g.lineTo(x, yy) : g.moveTo(x, yy); } g.stroke(); } g.globalAlpha = 1; g.restore(); };
  const buildBoard = g => {
    plank(g, 0, 432, '#E4D2AC', 3); plank(g, 432, H, '#CDB284', 7);
    g.fillStyle = 'rgba(70,44,20,0.5)'; g.fillRect(0, 430, W, 3); g.fillStyle = 'rgba(255,248,230,0.4)'; g.fillRect(0, 433, W, 2);
    drawSet(g, MTN, 0, 0, 78, { grain: true });
    const hills = []; for (let i = 0; i < 27; i++) hills.push(P_('P', i * 3.2 + 1.2, 17.0, 0, ['#7A7446', '#6A6A40', '#867E50'][i % 3], i % 2 ? 1 : -1)); drawSet(g, hills, 0, 0, 24.6, { shadow: 0.18 });
    // the field: rows of small parallelograms, a parquet of the harvest
    const field = []; for (let r = 0; r < 9; r++) { const y = 452 + r * 27; for (let x = 30; x < W; x += 66) { const yb = x < 1180 ? JQ.lerp(690, 640, x / 1180) : JQ.lerp(640, 590, (x - 1180) / 740); if (y + 12 > yb) continue;
      field.push(P_('P', x / 20, y / 20, 0, (r % 2 ? ['#7E9A4A', '#6E8A40'] : ['#8A6A44', '#7A5A3A'])[Math.round(x / 66) % 2], r % 2 ? 1 : -1)); } }   // 冬麦出苗: sprout rows between earth rows
    drawSet(g, field, 0, 0, 20, { shadow: 0.16 });
    const stream = []; for (let i = 0; i < 6; i++) { const k = (i + 0.5) / 6, x = JQ.lerp(1410, 1232, k), y = JQ.lerp(448, 836, k); stream.push(P_('P', x / 24, y / 24, 114, i % 2 ? '#3A5066' : '#46607A')); } drawSet(g, stream, 0, 0, 24);
    drawSet(g, POND, 0, 0, 72, { grain: true });
    drawSet(g, [P_('S', 1205 / 40, 690 / 40, 0, '#9A8A76'), P_('S', 1375 / 40, 690 / 40, 0, '#9A8A76'), P_('M', 1290 / 40, 701 / 40, 0, '#3A3028'), P_('P', 1290 / 40, 664 / 40, 0, '#A89884')], 0, 0, 40);
    // the farmhouse: roof = parallelogram + small triangle + parallelogram, squares for the walls, a red parallelogram gate
    drawSet(g, [P_('P', 1575 / 14, 445 / 14, 90, '#3A2E2A')], 0, 0, 14);
    drawSet(g, [P_('P', 1580 / 72, 509 / 72, 0, '#3A2E2A', -1), P_('S', 1688 / 72, 521 / 72, 0, '#4A3C36'), P_('P', 1796 / 72, 509 / 72, 0, '#3A2E2A')], 0, 0, 72, { grain: true });
    drawSet(g, [1525, 1585, 1645, 1700, 1835, 1890].map(x => P_('Q', x / 38, 573 / 38, 0, '#D8BE94')).concat([P_('Q', 1762 / 38, 575 / 38, 0, '#4A3A30')]), 0, 0, 38);
    drawSet(g, [[1493, 653], [1493, 759], [1745, 653], [1745, 759], [1851, 653], [1851, 759], [1960, 653], [1960, 759]].map(([x, y], i) => P_('Q', x / 75, y / 75, 0, i % 3 ? '#C2A27A' : '#B8946C')), 0, 0, 75, { grain: true });
    drawSet(g, Array.from({ length: 17 }, (_, i) => P_('S', (1454 + i * 28) / 14, 596 / 14, 0, '#2E2420')), 0, 0, 14, { shadow: 0.15 });
    drawSet(g, [P_('P', 1650 / 56, 744 / 56, 90, '#8E2E22')], 0, 0, 56); drawSet(g, [P_('M', 1650 / 40, 662 / 40, 0, '#2E2420')], 0, 0, 40);
    drawSet(g, [[1626, 862], [1590, 930], [1556, 996], [1520, 1056]].map(([x, y]) => P_('Q', x / 26, y / 26, 45, '#E2D2B0')), 0, 0, 26, { shadow: 0.15 });
    drawSet(g, TREE, 480, 345, 74, { grain: true });
    // (the family is laid per frame from the story track)
    // tray rim and the title slip
    g.fillStyle = '#6E4A2E'; g.beginPath(); g.rect(0, 0, W, H); g.rect(28, 28, W - 56, H - 56); g.fill('evenodd');
    g.strokeStyle = 'rgba(255,230,190,0.35)'; g.lineWidth = 2; g.strokeRect(6, 6, W - 12, H - 12); g.strokeStyle = 'rgba(30,16,6,0.6)'; g.lineWidth = 3; g.strokeRect(28, 28, W - 56, H - 56);
    g.fillStyle = 'rgba(52,30,14,0.25)'; g.fillRect(1586, 70, 280, 174); g.fillStyle = '#F2EAD8'; g.fillRect(1580, 62, 280, 174); g.strokeStyle = '#2A1E18'; g.lineWidth = 2; g.strokeRect(1590, 72, 260, 154);
    g.fillStyle = '#2A1E18'; g.textAlign = 'center'; g.textBaseline = 'alphabetic'; g.font = `900 88px ${SONG}`; g.fillText('寒露', 1720, 160);
    g.fillStyle = '#B0302A'; g.fillRect(1808, 82, 32, 32); g.fillStyle = '#F2EAD8'; g.textBaseline = 'top'; g.font = `600 13px ${SONG}`; JQ.vtext(g, '七巧', 1824, 84, 14);
  };
  // ---------------------------------------------------------------- moving pieces
  const one = (g, t, X, Y, r, f, u, c, a = 1) => { const pts = place({ t, x: 0, y: 0, r, f }, X, Y, u, 1.6); g.globalAlpha = a; g.fillStyle = `rgba(52,30,14,${0.24 * a})`; g.fill(poly(pts.map(([x, y]) => [x + 4, y + 5])));
    g.fillStyle = c; g.fill(poly(pts)); g.strokeStyle = lighten(c, 0.28); g.lineWidth = 1.2; g.stroke(poly(pts)); g.globalAlpha = 1; };
  // 候二: three sparrows dive from the upper right; they all reach the water line around 3.2 s and every piece of every
  // clam locks into place exactly at IMP
  const BIRDS = [0, 1, 2].map(i => { const C = [[990, 830], [1130, 852], [1268, 834]][i]; return { S0: [[1330, -70], [1130, -110], [1520, -30]][i], Wp: [C[0] - 40, 778], C, T: 3.12 + i * 0.07 }; });   // clear of the calf (story: 950, 1014)
  const US = 26, UC = 16.5, T0 = BAR + 0.05;
  const setAt = (g, set, X, Y, u, th, extra) => { const c = Math.cos(th), s = Math.sin(th); set.forEach((p, j) => { const e = extra ? extra(j) : 0; one(g, p.t, X + (p.x * c - p.y * s) * u, Y + (p.x * s + p.y * c) * u, p.r + th + e, p.f == null ? 1 : p.f, u, p.c); }); };
  const bird = (g, b, t, bi) => {
    if (t < T0) return;
    const MS = mir(SPAR), th2 = -Math.atan2(b.Wp[1] - b.S0[1], Math.abs(b.Wp[0] - b.S0[0])) * 0.4, c2 = Math.cos(th2), s2 = Math.sin(th2);   // flies left, nose down
    if (t < b.T) {    // diving toward the water line, wings beating
      const k = Math.pow((t - T0) / (b.T - T0), 1.3), x = JQ.lerp(b.S0[0], b.Wp[0], k), y = JQ.lerp(b.S0[1], b.Wp[1], k), fl = Math.sin(t * 18 + bi) * 0.22;
      setAt(g, MS, x, y, US, th2, j => (j === 0 || j === 6) ? fl * (j === 6 ? 1.4 : 1) : 0); return;
    }
    // at the water line the seven pieces come apart, flip and spin, and lock into the clam exactly at IMP
    MS.forEach((p, j) => {
      const q = CLAM[j], dur = IMP - b.T - j * 0.03, k = JQ.clamp((t - b.T - j * 0.03) / dur), e = JQ.ease(k);
      const x0 = b.Wp[0] + (p.x * c2 - p.y * s2) * US, y0 = b.Wp[1] + (p.x * s2 + p.y * c2) * US, x1 = b.C[0] + q.x * UC, y1 = b.C[1] + q.y * UC;
      const x = JQ.lerp(x0, x1, e) + Math.sin(k * Math.PI) * (j - 3) * 26, y = JQ.lerp(y0, y1, e) - Math.sin(k * Math.PI) * 40;
      const r = JQ.lerp(p.r + th2, q.r + (j % 2 ? 1 : -1) * TAU, e), f = JQ.lerp(p.f, q.f, JQ.smooth(0.2, 0.8, k)) * (j % 3 === 0 ? Math.cos(TAU * k) : 1), col = JQ.mix(p.c, q.c, JQ.smooth(0.25, 0.8, k));
      one(g, p.t, x, y, r, Math.abs(f) < 0.06 ? 0.06 * Math.sign(f || 1) : f, JQ.lerp(US, UC, e), col);
    });
    // splash as it hits the water, rings as the clam locks
    const u = t - b.T; if (u > 0 && u < 0.6) { g.strokeStyle = `rgba(240,232,214,${0.8 * (1 - u / 0.6)})`; g.lineWidth = 2.4; g.beginPath(); g.ellipse(b.Wp[0], 796, 30 + u * 110, 6 + u * 16, 0, 0, TAU); g.stroke(); }
    const v = t - IMP; if (v >= 0 && v < 1) for (const d of [0, 0.25]) { const w = v - d; if (w < 0) continue; g.strokeStyle = `rgba(250,240,220,${0.9 * (1 - w)})`; g.lineWidth = 3; g.beginPath(); g.ellipse(b.C[0], b.C[1] - 10, 90 + w * 120, 26 + w * 30, 0, 0, TAU); g.stroke(); }
  };
  // 候一: three geese cross the sky from right to left, wings (the raised large triangle and its tip) beating
  const geese = (g, t) => { for (let i = 0; i < 3; i++) { const p = JQ.clamp((t - 0.05 - i * 0.18) / 2.5); if (p <= 0 || p >= 1) continue;
    const x = JQ.lerp(2080 + i * 150, -260 + i * 150, p), y = 352 + i * 36 - Math.sin(p * Math.PI) * 18, fl = Math.sin(t * 9 + i * 1.2) * 0.25;   // below the title band
    setAt(g, GOOSE_L, x, y, 20, 0, j => (j === 6 ? -fl * 1.2 : 0)); } };
  const flower = (g, t, X, Y, u, t0, t1) => {
    const op = JQ.smooth(t0, t1, t);
    one(g, 'P', X + 0.15 * u, Y + 2.4 * u, 90 * D, 1, u, '#5E7A3A');
    FLOWER.forEach(p => { const psi = p.psi * (0.35 + 0.65 * op), d = p.d * (0.7 + 0.3 * op); one(g, p.t, X + Math.sin(psi) * d * u, Y - Math.cos(psi) * d * u, psi, 1, u * (0.8 + 0.2 * op), JQ.mix('#9AA040', p.c, op)); });
    one(g, 'Q', X, Y, 45 * D, 1, u * 0.8, JQ.mix('#6E7A3A', '#B8782A', op));
  };
  // ---------------------------------------------------------------- the family (story track) laid in tangram pieces: each part's
  // oriented bounding box picks a piece — the coat a triangle from shoulders to hem, limbs and long props parallelograms, heads and
  // hands diamonds (squares at 45°), buns, horns, hats and haystacks triangles; lacquer colours, hairline gaps, a drop shadow
  const Q4 = Math.PI / 4;
  const obb = pts => { const n = pts.length; let cx = 0, cy = 0; for (const [x, y] of pts) { cx += x; cy += y; } cx /= n; cy /= n; let a = 0, b = 0, c = 0;
    for (const [x, y] of pts) { const dx = x - cx, dy = y - cy; a += dx * dx; b += dy * dy; c += dx * dy; } const th = 0.5 * Math.atan2(2 * c, a - b), ex = Math.cos(th), ey = Math.sin(th);
    let u0 = 1e9, u1 = -1e9, v0 = 1e9, v1 = -1e9; for (const [x, y] of pts) { const u = (x - cx) * ex + (y - cy) * ey, v = -(x - cx) * ey + (y - cy) * ex; u0 = Math.min(u0, u); u1 = Math.max(u1, u); v0 = Math.min(v0, v); v1 = Math.max(v1, v); }
    const ou = (u0 + u1) / 2, ov = (v0 + v1) / 2; return { x: cx + ou * ex - ov * ey, y: cy + ou * ey + ov * ex, L: u1 - u0, W: Math.max(3, v1 - v0), a: th }; };
  const pieceOf = p => {
    const b = obb(p.pts), r = b.L / b.W, at = (a, P) => { const c = Math.cos(a), s = Math.sin(a); return P.map(([u, v]) => [b.x + u * c - v * s, b.y + u * s + v * c]); };
    if ((p.role === 'coat' || p.role === 'cape') && p.pts.length === 4) { const [s0, s1, h1, h0] = p.pts, top = [(s0[0] + s1[0]) / 2, (s0[1] + s1[1]) / 2], hm = [(h0[0] + h1[0]) / 2, (h0[1] + h1[1]) / 2], ex = (h1[0] - h0[0]) * 0.2, ey = (h1[1] - h0[1]) * 0.2;
      return [[top[0] + (top[0] - hm[0]) * 0.12, top[1] + (top[1] - hm[1]) * 0.12], [h1[0] + ex, h1[1] + ey], [h0[0] - ex, h0[1] - ey]]; }
    if (p.role === 'horn') { const ap = p.pts.reduce((m, q) => q[1] < m[1] ? q : m, p.pts[0]), bc = [2 * b.x - ap[0], 2 * b.y - ap[1]], dx = ap[0] - bc[0], dy = ap[1] - bc[1], d = Math.hypot(dx, dy) || 1, w = Math.max(3, b.W * 1.1);
      return [ap, [bc[0] - dy / d * w, bc[1] + dx / d * w], [bc[0] + dy / d * w, bc[1] - dx / d * w]]; }
    if (r >= 1.7 && p.role !== 'straw') { const sh = Math.min(b.W, b.L * 0.3); return at(b.a, [[-b.L / 2, b.W / 2], [b.L / 2 - sh, b.W / 2], [b.L / 2, -b.W / 2], [-b.L / 2 + sh, -b.W / 2]]); }
    if (r < 1.25 && p.role !== 'hair' && p.role !== 'straw') { const d = Math.sqrt(b.L * b.W) * 0.58; return [[b.x, b.y - d], [b.x + d, b.y], [b.x, b.y + d], [b.x - d, b.y]]; }
    const a = Math.round(b.a / Q4) * Q4, dn = (Math.cos(a) || 1) > 0 ? 1 : -1, h = b.W * 0.7;     // triangle, base on the lower side
    return at(a, [[-b.L / 2, dn * h], [b.L / 2, dn * h], [0, -dn * h * 1.3]]); };
  const TPEN = { skin: '#E6C49A', hair: '#1E1A18', coat: '#3A4E6E', pants: '#3A3E52', apron: '#C9A070', scarf: '#6E7A3A', hat: '#6E7A3A', straw: '#D9A040', cape: '#8A7A5A',
    ox: '#86582F', oxDark: '#5E3E26', horn: '#EFE3C8', calf: '#B07A48', calfDark: '#6E4A2C', prop: '#8E5A34', metal: '#9A9A90', red: '#B0302A', line: '#3A2A1E' };
  const tile = (g, P, col) => { const n = P.length, cx = P.reduce((s, q) => s + q[0], 0) / n, cy = P.reduce((s, q) => s + q[1], 0) / n, k = 0.9;
    const Q = P.map(([x, y]) => [cx + (x - cx) * k + (x > cx ? -0.6 : 0.6), cy + (y - cy) * k]); g.fillStyle = 'rgba(52,30,14,0.24)'; g.fill(JQ.P(Q.map(([x, y]) => [x + 3, y + 4])));
    const path = JQ.P(Q); g.fillStyle = col; g.fill(path); g.strokeStyle = lighten(col, 0.28); g.lineWidth = 1.2; g.stroke(path); };
  const castTangram = (g, items) => { for (const it of items) { g.save(); g.globalAlpha = it.alpha == null ? 1 : it.alpha;
    for (const p of it.parts) { if (p.role === 'eye' || p.pts.length < 3) continue; let c = JQ.roleColor(TPEN, p.role); if (c == null) continue;
      if (it.who === 'kid' && p.role === 'coat') c = '#B8402C'; tile(g, pieceOf(p), c); }
    g.restore(); } };
  const stamp = (g, t) => {            // the pentad line on the slip, stamped in at the start of each bar
    const i = Math.min(2, Math.floor(t / BAR)), lt = t - i * BAR; g.textAlign = 'center'; g.textBaseline = 'alphabetic'; g.font = `40px ${SONG}`; g.fillStyle = '#2A1E18';
    if (i > 0 && lt < 0.15) { g.globalAlpha = 1 - lt / 0.15; g.fillText(HOU[i - 1], 1720, 210); }
    const k = i === 0 ? 1 : JQ.smooth(0.1, 0.35, lt); if (k > 0) { g.save(); g.globalAlpha = k; g.translate(1720, 196); g.scale(1 + (1 - k) * 0.25, 1 + (1 - k) * 0.25); g.fillText(HOU[i], 0, 14); g.restore(); }
    g.globalAlpha = 1;
  };

  JQ.ART[17] = {
    key: IMP, keyHou: JQ.TERMS[16].keyHou, focus: [[1000, 220], [1062, 862], [1530, 726]], frame: true,
    draw(g, t, Sx) {
      JQ.blit(g, JQ.cached('s17board', Sx, buildBoard));
      geese(g, t);
      flower(g, t, 1530, 726, 27, 2 * BAR + 0.08, 2 * BAR + 1.3); flower(g, t, 1610, 790, 19, 2 * BAR + 0.7, 2 * BAR + 1.7);
      BIRDS.forEach((b, i) => bird(g, b, t, i));
      castTangram(g, JQ.castFor(Sx, t).items);
      stamp(g, t);
    },
  };
})();
