// s06 谷雨 · 苏绣. Pale satin stretched on a wooden embroidery frame (warp and weft visible); every object is stitched:
// long-and-short stitches laid along the form, silk sheen where the thread turns to the light, large areas of bare satin
// left as air and mist. Moment: duckweed is stitched into the pond cluster by cluster by a needle (萍始生), and a hoopoe
// lands on a young mulberry by the gate and fans its crest (戴胜降于桑; the mulberry is the one allowed addition).
(function () {
  const JQ = window.JQ, TAU = Math.PI * 2, LIGHT = -0.8;
  const SATIN = '#EFE8D8', WOOD = '#A87A4A', WOOD2 = '#7A5130';
  const bounds = pts => { let a = 1e9, b = 1e9, c = -1e9, d = -1e9; for (const [x, y] of pts) { a = Math.min(a, x); b = Math.min(b, y); c = Math.max(c, x); d = Math.max(d, y); } return [a - 6, b - 6, c + 6, d + 6]; };
  // long-and-short stitch fill. o: ang (base direction), twist(x,y) → extra angle, cols (dark→light), shade(x,y) → 0..1,
  // len [min,max], gap (row spacing), seed, jit (shade noise), sheen (0..1 highlight strength)
  const fill = (g, path, box, o) => {
    const [x0, y0, x1, y1] = box, a0 = o.ang || 0, ca = Math.cos(a0), sa = Math.sin(a0), gap = o.gap || 3.6, R = JQ.rng(o.seed || 1);
    const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, rad = Math.hypot(x1 - x0, y1 - y0) / 2, [lA, lB] = o.len || [12, 26];
    const nb = o.cols.length, base = o.cols.map(() => new Path2D()), hi = o.cols.map(() => new Path2D()), sh = o.sheen == null ? 0.7 : o.sheen;
    for (let v = -rad; v < rad; v += gap) {
      let u = -rad - R() * lB;
      while (u < rad) {
        const Ls = lA + R() * (lB - lA), mx = cx + ca * (u + Ls / 2) - sa * v, my = cy + sa * (u + Ls / 2) + ca * v;
        u += Ls + 1.1;
        if (mx < x0 || mx > x1 || my < y0 || my > y1) continue;
        const a = a0 + (o.twist ? o.twist(mx, my) : 0), dx = Math.cos(a) * Ls / 2, dy = Math.sin(a) * Ls / 2;
        const s = JQ.clamp((o.shade ? o.shade(mx, my) : 0.5) + (R() - 0.5) * (o.jit == null ? 0.3 : o.jit), 0, 0.999), b = Math.floor(s * nb);
        base[b].moveTo(mx - dx, my - dy); base[b].lineTo(mx + dx, my + dy);
        if (R() < sh * Math.abs(Math.cos(a - LIGHT))) { const px = -Math.sin(a) * gap * 0.2, py = Math.cos(a) * gap * 0.2; hi[b].moveTo(mx - dx * 0.6 - px, my - dy * 0.6 - py); hi[b].lineTo(mx + dx * 0.6 - px, my + dy * 0.6 - py); }
      }
    }
    g.save(); if (path) g.clip(path); g.lineCap = 'round';
    o.cols.forEach((c, b) => { g.strokeStyle = c; g.lineWidth = gap * 1.12; g.stroke(base[b]); g.strokeStyle = JQ.rgba(c, 1).replace(/rgba\((\d+),(\d+),(\d+),1\)/, (_, r, gg, bb) => `rgba(${Math.min(255, +r + 70)},${Math.min(255, +gg + 70)},${Math.min(255, +bb + 70)},0.55)`); g.lineWidth = gap * 0.38; g.stroke(hi[b]); });
    g.restore();
  };
  const fillPts = (g, pts, o) => fill(g, JQ.P(pts), bounds(pts), o);
  // stem stitch along a polyline: short overlapping slanted stitches
  const stem = (g, pts, col, w = 3, len = 11) => {
    const P = JQ.resample(pts, len * 0.55, false), p = new Path2D();
    for (let i = 0; i < P.length - 1; i++) { const [ax, ay] = P[i], [bx, by] = P[Math.min(P.length - 1, i + 2)] || P[i + 1], dx = bx - ax, dy = by - ay, d = Math.hypot(dx, dy) || 1; p.moveTo(ax + dy / d * w * 0.4, ay - dx / d * w * 0.4); p.lineTo(bx - dy / d * w * 0.4, by + dx / d * w * 0.4); }
    g.lineCap = 'round'; g.strokeStyle = col; g.lineWidth = w; g.stroke(p);
  };
  const satin = g => {
    g.fillStyle = SATIN; g.fillRect(0, 0, JQ.W, JQ.H);
    const gr = g.createLinearGradient(0, 0, 1920, 1080); gr.addColorStop(0, 'rgba(255,255,250,0.0)'); gr.addColorStop(0.42, 'rgba(255,255,250,0.55)'); gr.addColorStop(0.58, 'rgba(255,255,250,0.0)'); gr.addColorStop(1, 'rgba(210,198,175,0.25)');
    g.fillStyle = gr; g.fillRect(0, 0, JQ.W, JQ.H);
    g.fillStyle = 'rgba(150,135,110,0.10)'; for (let y = 0; y < 1080; y += 3) g.fillRect(0, y, 1920, 1); g.fillStyle = 'rgba(255,255,255,0.18)'; for (let x = 0; x < 1920; x += 4) g.fillRect(x, 0, 1.2, 1080);
  };
  // a rectangular embroidery frame (绣架): wooden rails top and bottom, the satin laced to side sticks with tension thread
  const frame = g => {
    const B = 40;
    g.fillStyle = WOOD; g.fillRect(0, 0, 1920, B); g.fillRect(0, 1080 - B, 1920, B);
    g.strokeStyle = 'rgba(80,50,25,0.35)'; g.lineWidth = 1.5; for (let i = 0; i < 9; i++) for (const y0 of [0, 1080 - B]) { g.beginPath(); for (let x = 0; x <= 1920; x += 40) { const y = y0 + 4 + i * 4 + Math.sin(x * 0.004 + i) * 2; x ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke(); }
    g.fillStyle = WOOD2; g.fillRect(0, B - 5, 1920, 5); g.fillRect(0, 1080 - B, 1920, 5);
    g.fillStyle = WOOD2; g.fillRect(0, B, 18, 1080 - 2 * B); g.fillRect(1902, B, 18, 1080 - 2 * B);
    g.strokeStyle = 'rgba(250,246,236,0.95)'; g.lineWidth = 2.2;
    for (let y = B + 10; y < 1080 - B; y += 34) { g.beginPath(); g.moveTo(16, y); g.lineTo(52, y + 17); g.lineTo(16, y + 34); g.stroke(); g.beginPath(); g.moveTo(1904, y); g.lineTo(1868, y + 17); g.lineTo(1904, y + 34); g.stroke(); }
    [[30, 20], [1890, 20], [30, 1060], [1890, 1060]].forEach(([x, y]) => { g.fillStyle = WOOD2; g.beginPath(); g.arc(x, y, 12, 0, TAU); g.fill(); g.fillStyle = '#C89A62'; g.beginPath(); g.arc(x - 3, y - 3, 5, 0, TAU); g.fill(); });
  };
  // stitched lettering: stitches laid on a slant, then cut to the glyphs
  const stitchText = (g, Sx, str, x, y, size, font, cols, vertical) => {
    const w = vertical ? size * 1.2 : size * str.length * 1.05, h = vertical ? size * str.length * 1.08 : size * 1.25;
    const L = JQ.layer('s06txt' + str, Sx), t = L.g;
    fill(t, null, [x - 6, y - 6, x + w + 6, y + h + 6], { ang: -0.75, cols, gap: Math.max(2.2, size / 26), len: [size * 0.12, size * 0.26], shade: (px, py) => (py - y) / h, seed: str.length * 7, jit: 0.4 });
    const M = JQ.layer('s06mask', Sx), m = M.g; m.fillStyle = '#000'; m.font = font; m.textBaseline = 'top'; m.textAlign = 'left';
    if (vertical) JQ.vtext(m, str, x + size * 0.1, y, size * 1.08); else m.fillText(str, x, y);
    t.globalCompositeOperation = 'destination-in'; t.setTransform(1, 0, 0, 1, 0, 0); t.drawImage(M.c, 0, 0); t.globalCompositeOperation = 'source-over'; JQ.blit(g, L);
  };
  JQ._s06 = { SATIN, fill, fillPts, bounds, stem, satin, frame, stitchText, LIGHT };
})();
(function () {
  const JQ = window.JQ, S = JQ.SCENE, L = JQ.L, TAU = Math.PI * 2, K = JQ._s06, { fill, fillPts, bounds, stem } = K;
  const MUL = { x: 1528, base: 812, top: 640 };
  const field = g => {
    const yb = x => x < 1180 ? JQ.lerp(690, 640, x / 1180) : JQ.lerp(640, 590, (x - 1180) / 740);
    fillPts(g, S.mountains.pts, { ang: 0.12, cols: ['#5D7A8E', '#7893A6', '#98AFBF', '#BBCAD2', '#DCDDD6'], shade: (x, y) => (y - 250) / 180, gap: 3.4, len: [14, 30], seed: 61 });
    fillPts(g, S.hills.pts, { ang: 0.04, cols: ['#55724F', '#6F8C62', '#8DA67A'], shade: (x, y) => (y - 370) / 60, gap: 3.4, seed: 62 });
    fillPts(g, S.field.pts, { ang: -0.03, cols: ['#7A5A3E', '#93714F', '#AD8C66', '#C6A984', '#DCC7A6'],   // tilled earth, ready for seed gap: 3.6, len: [16, 32], seed: 63, jit: 0.18,
      shade: (x, y) => { const k = (y - 430) / (yb(x) - 430), band = Math.floor(k * 10); return (band % 2 ? 0.25 : 0.62) + k * 0.25; } });
    S.furrows.forEach((f, i) => stem(g, f.pts, i % 2 ? '#5E4430' : '#6E5038', 2.4, 13));
    // bare-satin ground, a scatter of grass tufts in three short stitches
    const tuft = new Path2D(), R = JQ.rng(64);
    for (let i = 0; i < 260; i++) { const x = 60 + R() * 1800, y = 680 + R() * 360; if (Math.abs(x - 990) < 360 && Math.abs(y - 885) < 125) continue; for (const a of [-0.5, 0, 0.5]) { tuft.moveTo(x, y); tuft.lineTo(x + Math.sin(a) * 14, y - Math.cos(a) * 14); } }
    g.strokeStyle = '#7FA35A'; g.lineWidth = 2.6; g.lineCap = 'round'; g.stroke(tuft);
    stem(g, [S.path.pts[1], S.path.pts[2], S.path.pts[3], S.path.pts[4]], '#B09A78', 2.4); stem(g, [S.path.pts[0], S.path.pts[7], S.path.pts[6], S.path.pts[5]], '#B09A78', 2.4);
  };
  const water = g => {
    const c = S.stream.center;
    fillPts(g, S.stream.pts, { ang: 2.0, cols: ['#4F7E9C', '#6E9AB5', '#93B6CA', '#BCD2DD'], shade: (x, y) => { let d = 1e9; c.forEach(([u, v]) => { d = Math.min(d, Math.hypot(x - u, y - v)); }); return 0.9 - d / 40; }, gap: 3.2, seed: 65 });
    fillPts(g, S.pondRim.pts, { ang: 0, twist: (x, y) => Math.atan2((y - L.pond.cy) * 3, x - L.pond.cx), cols: ['#6F7A4E', '#8E9563', '#AEAD80'], shade: (x, y) => 0.6 - (y - L.pond.cy) / 260, gap: 3, len: [8, 16], seed: 66 });
    fillPts(g, S.pond.pts, { ang: 0.02, cols: ['#7EA6BC', '#9CBCCD', '#BBD1DC', '#D7E3E6'], shade: (x, y) => 0.15 + (L.pond.cy + 90 - y) / 200 * 0.0 + Math.abs(Math.sin(y * 0.05)) * 0.8, gap: 4.4, len: [24, 52], seed: 67, sheen: 0.9 });
    // bridge: grey stones in horizontal stitches, the arch in stem stitch
    fillPts(g, S.bridge.pts, { ang: 0, cols: ['#8E8C86', '#A9A69E', '#C6C2B8'], shade: (x, y) => 0.8 - (y - 640) / 90, gap: 3.2, len: [10, 20], seed: 68 });
    stem(g, S.bridgeArch.pts.slice().sort((a, b) => a[0] - b[0]), '#5E5A52', 3); stem(g, [S.bridge.pts[0], S.bridge.pts[1], S.bridge.pts[2], S.bridge.pts[3]], '#5E5A52', 3);
  };
  const house = g => {
    const H = L.house;
    fillPts(g, S.roof.pts, { ang: Math.PI / 2, twist: x => (x - 1690) / 1400, cols: ['#3E4651', '#535C68', '#6C7581', '#8A929B'], shade: (x, y) => (y - 470) / 80 * 0.6 + (x % 20 < 10 ? 0.25 : 0), gap: 3.2, len: [12, 24], seed: 70 });
    fillPts(g, S.houseFront.pts, { ang: 0, cols: ['#C9BFAE', '#DAD1C1'], gap: 3.4, seed: 71 });
    fillPts(g, S.window.pts, { ang: Math.PI / 2, cols: ['#3A3530'], gap: 3, seed: 72 }); fillPts(g, S.chimney.pts, { ang: Math.PI / 2, cols: ['#3E4651', '#535C68'], gap: 3, seed: 73 });
    fillPts(g, S.wall.pts, { ang: 0, cols: ['#BDB3A0', '#CEC5B3', '#DED6C6'], shade: (x, y) => 0.9 - (y - 600) / 260 + (Math.floor((y - 600) / 30) % 2) * 0.12, gap: 3.4, len: [18, 34], seed: 74 });
    for (let y = 630; y < 812; y += 30) stem(g, [[H.wallX0, y], [H.wallX1, y]], 'rgba(150,140,120,0.6)', 1.6, 14);
    fillPts(g, S.wallCap.pts, { ang: 0, cols: ['#3E4651', '#596270'], gap: 3, seed: 75 });
    fillPts(g, S.gate.pts, { ang: Math.PI / 2, cols: ['#4A3426', '#614433', '#7A5842'], shade: x => (x - H.gateX0) / 84, gap: 3.2, seed: 76 });
    fillPts(g, S.gateRoof.pts, { ang: 0, cols: ['#3E4651', '#596270', '#78818C'], shade: (x, y) => (y - 630) / 50, gap: 3, seed: 77 });
  };
  // the young mulberry by the gate: a slim trunk and broad lobed leaves stitched in two halves from the midrib
  const mulberry = g => {
    fillPts(g, [[MUL.x - 9, MUL.base], [MUL.x - 5, MUL.top + 20], [MUL.x + 5, MUL.top + 20], [MUL.x + 9, MUL.base]], { ang: Math.PI / 2, cols: ['#5A4030', '#77563F'], gap: 3, seed: 80 });
    [[[MUL.x, 700], [MUL.x - 60, 640]], [[MUL.x, 680], [MUL.x + 58, 616]], [[MUL.x, MUL.top + 20], [MUL.x + 6, 586]]].forEach(([a, b]) => stem(g, [a, b], '#5A4030', 5, 12));
    const leaves = [[1462, 632, 2.6], [1478, 604, 2.2], [1500, 590, 1.9], [1600, 600, 0.5], [1594, 628, 0.9], [1560, 580, -1.2], [1528, 586, -1.9], [1452, 660, 2.9], [1612, 652, 0.2], [1548, 640, -0.4], [1500, 650, 2.4], [1576, 606, -0.2]];
    leaves.forEach(([x, y, a], i) => {
      const s = 38, c = Math.cos(a), sn = Math.sin(a), at = (u, v) => [x + (u * c - v * sn) * s, y + (u * sn + v * c) * s];
      const side = sg => [at(0, 0), at(0.2, sg * 0.42), at(0.45, sg * 0.5), at(0.62, sg * 0.36), at(0.8, sg * 0.3), at(1.05, 0)];
      [1, -1].forEach((sg, k) => fill(g, JQ.smoothPath(side(sg).concat([at(0.5, 0)])), bounds(side(sg)), { ang: a + sg * 0.9, cols: ['#3F6E34', '#58894A', '#77A563'], shade: () => k ? 0.25 : 0.7, gap: 2.4, len: [6, 12], seed: 81 + i * 2 + k, sheen: 0.9 }));
      stem(g, [at(0, 0), at(0.95, 0)], '#2F5428', 1.6, 7);
    });
    g.fillStyle = '#4B2440'; [[1488, 622], [1584, 618], [1540, 660]].forEach(([x, y]) => { for (let k = 0; k < 5; k++) { g.beginPath(); g.arc(x + (k % 3) * 5, y + Math.floor(k / 3) * 5, 3, 0, TAU); g.fill(); } });
  };
  JQ._s06.scene = { field, water, house, mulberry, MUL };
})();
(function () {
  const JQ = window.JQ, S = JQ.SCENE, L = JQ.L, TAU = Math.PI * 2, K = JQ._s06, SC = K.scene, { fill, fillPts, bounds, stem } = K;
  const tree = g => {
    g.strokeStyle = '#6B4E38'; JQ.drawBranches(g, 3, 0.9);
    fillPts(g, S.trunk.pts, { ang: -Math.PI / 2, twist: (x, y) => Math.sin(y * 0.02) * 0.12, cols: ['#4A3426', '#614433', '#7D5C44', '#9A7A5E'], shade: x => (x - 440) / 80, gap: 3.2, len: [14, 30], seed: 90 });
    S.clumps.forEach((c, i) => {
      const r = c.r * 1.05;
      fill(g, JQ.P(Array.from({ length: 24 }, (_, k) => [c.x + Math.cos(k / 24 * TAU) * r, c.y + Math.sin(k / 24 * TAU) * r * 0.82])), [c.x - r, c.y - r, c.x + r, c.y + r],
        { ang: 1.15, twist: (x, y) => Math.atan2(y - c.y, x - c.x) * 0.35, cols: ['#3E6A35', '#53823F', '#6E9C4C', '#8DB661', '#B3CF85'], shade: (x, y) => 0.55 - ((x - c.x) + (y - c.y)) / (r * 2.4), gap: 3.2, len: [10, 22], seed: 100 + i, sheen: 0.8 });
    });
  };
  const PAL = { ox: ['#9A6A3C', '#B5834F', '#CC9F68', '#DDB985'], oxDark: ['#3E2A1E', '#5A3E2C'], horn: ['#D8CDB4', '#EDE4CF'], skin: ['#D7AA86', '#E8C3A0'], hair: ['#1E1B1A', '#34302E'], coat: ['#9C7590', '#B48EA6', '#CBAABD'], pants: ['#3E4A5A', '#56637A'], eye: ['#141010'], hat: ['#B89A5E'],
    apron: ['#CFC6B2', '#E4DCCB'], scarf: ['#4E6A86', '#6A86A0'], straw: ['#B89A5E', '#D2B67C'], cape: ['#7A6446', '#957C58'], calf: ['#B8874F', '#CFA068', '#E2BD8A'], calfDark: ['#4A3426', '#614433'],
    prop: ['#7A5842', '#957056'], metal: ['#7E8289', '#A3A7AD'], red: ['#A8352A', '#C04A3A'], line: ['#5A4030'] };
  const WOMAN = Object.assign({}, PAL, { coat: ['#3F5A78', '#56718F', '#7088A3'] });
  // the family is stitched every frame: long-and-short stitches laid along each part's long axis, a thin outline thread
  const stitchItem = (g, it) => {
    const P = it.who === 'woman' ? WOMAN : PAL;
    it.parts.forEach((p, i) => {
      const cols = P[p.role] || P[JQ.ROLE_FALLBACK[p.role]]; if (!cols) return; const b = bounds(p.pts), w = b[2] - b[0], h = b[3] - b[1];
      if (p.role === 'eye' || w < 10 && h < 10) { g.fillStyle = cols[0]; g.fill(p.path); return; }
      fill(g, p.path, b, { ang: h > w ? Math.PI / 2 : 0.08, cols, shade: (x, y) => 0.75 - (y - b[1]) / (h || 1) * 0.6, gap: 2.6, len: [8, 18], seed: 120 + i * 7 + it.who.length });
      g.strokeStyle = 'rgba(60,40,30,0.45)'; g.lineWidth = 1.4; g.stroke(p.path);
    });
  };
  const castDraw = (g, Sx, CA) => {
    let tr = false; const T = () => { tr = true; JQ.blit(g, JQ.cached('s06-trunk', Sx, a => fillPts(a, S.trunk.pts, { ang: -Math.PI / 2, twist: (x, y) => Math.sin(y * 0.02) * 0.12, cols: ['#4A3426', '#614433', '#7D5C44', '#9A7A5E'], shade: x => (x - 440) / 80, gap: 3.2, len: [14, 30], seed: 90 }))); };
    for (const it of CA.items) { if (!tr && it.y >= 830) T(); g.save(); if (it.alpha != null && it.alpha < 1) g.globalAlpha = it.alpha; stitchItem(g, it); g.restore(); }
    if (!tr) T();
  };
  // 谷雨 sowing: seed knots left on the furrow behind the farm woman, along the line she walks (420 → 800)
  const seeds = (g, CA) => {
    const st = CA.state, w = st.woman; if (st.term < 6) return; const xe = st.term > 6 ? 800 : w && w.pose === 'sow' ? w.x - 30 * (w.dir || 1) : 0; if (xe <= 420) return;
    const pth = new Path2D(); for (let x = 424; x < xe; x += 11) for (let r = 0; r < 2; r++) { const y = JQ.lerp(668, 652, (x - 420) / 380) - 18 + r * 9 + (JQ.hash(x, r, 4) - 0.5) * 6, xx = x + (JQ.hash(x, r, 5) - 0.5) * 6; pth.moveTo(xx - 2, y); pth.lineTo(xx + 2, y - 1); }
    g.lineCap = 'round'; g.strokeStyle = '#F2E6BE'; g.lineWidth = 4.2; g.stroke(pth); g.strokeStyle = 'rgba(90,70,40,0.5)'; g.lineWidth = 1; g.stroke(pth);
  };
  JQ._s06.castDraw = castDraw; JQ._s06.seeds = seeds;
  const build = (g, Sx) => {
    K.satin(g); SC.field(g); SC.water(g); SC.house(g); tree(g); SC.mulberry(g);
    K.stitchText(g, Sx, '谷雨', 1640, 76, 112, '600 112px "Songti SC", "STSong", serif', ['#2C3A4A', '#3F5266', '#566C82'], true);
    stem(g, [[742, 318], [812, 306], [900, 290]], '#5A4030', 5, 12);        // a bare twig for the turtle dove; the pentad line is its own layer
    K.fill(g, JQ.P([[1640, 352], [1688, 352], [1688, 400], [1640, 400]]), [1640, 352, 1688, 400], { ang: 0.6, cols: ['#A8352A', '#C04A3A'], gap: 2.4, len: [6, 12], seed: 140 });
    K.frame(g);
  };
  // duckweed: clusters on a jittered grid inside the pond, ordered row by row like a needle working back and forth
  const DW = (() => {
    const out = [], P = L.pond;
    for (let r = 0; r < 8; r++) { const y = P.cy - P.ry * 0.82 + r * P.ry * 0.235, w = P.rx * Math.sqrt(Math.max(0, 1 - Math.pow((y - P.cy) / (P.ry * 0.95), 2))) * 0.92, n = Math.max(2, Math.round(w / 26)), row = [];
      for (let i = 0; i < n; i++) if (P.cx - w + (i + 0.5) / n * 2 * w > 860 || y < 830) row.push([P.cx - w + (i + 0.5) / n * 2 * w + (JQ.hash(r, i, 7) - 0.5) * 14, y + (JQ.hash(r, i, 8) - 0.5) * 10, JQ.hash(r, i, 9)]);
      out.push(...(r % 2 ? row.reverse() : row)); }
    return out;
  })();
  const frond = (p, x, y, r, a) => { for (let k = 0; k < 7; k++) { const b = a + (k - 3) * 0.32; p.moveTo(x, y); p.lineTo(x + Math.cos(b) * r, y + Math.sin(b) * r * 0.7); } };
  const duckweed = (g, n, alpha) => {
    const dark = new Path2D(), lite = new Path2D();
    for (let i = 0; i < n; i++) { const [x, y, h] = DW[i]; for (let k = 0; k < 3; k++) { const a = h * TAU + k * 2.1; frond(k === 2 ? lite : dark, x + Math.cos(a) * 6, y + Math.sin(a) * 4, 13, a); } }
    g.save(); g.globalAlpha = alpha; g.lineCap = 'round'; g.lineWidth = 3; g.strokeStyle = '#4F8A33'; g.stroke(dark); g.strokeStyle = '#86BB4E'; g.stroke(lite); g.lineWidth = 1.1; g.strokeStyle = 'rgba(230,245,200,0.6)'; g.stroke(lite); g.restore();
  };
  const needle = (g, x, y, bob, px, py) => {
    const tx = x + 6, ty = y - 6 - bob * 26, ex = tx + Math.cos(-0.8) * 122, ey = ty + Math.sin(-0.8) * 122;
    g.strokeStyle = '#5E9A3A'; g.lineWidth = 2.2; g.beginPath(); g.moveTo(px, py); g.bezierCurveTo(px + 40, py - 120, ex + 90, ey - 60, ex, ey); g.stroke();
    g.save(); g.translate(tx, ty); g.rotate(-0.8);
    const n = new Path2D(); n.moveTo(0, -1); n.lineTo(122, -4.2); n.arc(122, 0, 4.2, -Math.PI / 2, Math.PI / 2); n.lineTo(0, 1); n.closePath();
    g.fillStyle = '#B9BDC2'; g.fill(n); g.strokeStyle = '#6E737A'; g.lineWidth = 1; g.stroke(n);
    g.strokeStyle = 'rgba(255,255,255,0.9)'; g.lineWidth = 1.2; g.beginPath(); g.moveTo(10, -0.8); g.lineTo(108, -2.4); g.stroke();
    g.fillStyle = '#EFE8D8'; g.beginPath(); g.ellipse(116, 0, 5, 1.5, 0, 0, TAU); g.fill();
    g.restore();
  };
  JQ._s06.anim = { build, duckweed, needle, DW };
})();
(function () {
  const JQ = window.JQ, TAU = Math.PI * 2, K = JQ._s06, A = K.anim;
  const PERCH = [1546, 584], START = [1990, 520];
  // a feather or bar laid as a few parallel satin stitches with a sheen line
  const stitches = (g, x0, y0, x1, y1, w, col, n = 3) => {
    const dx = x1 - x0, dy = y1 - y0, d = Math.hypot(dx, dy) || 1, px = -dy / d, py = dx / d;
    g.lineCap = 'round'; g.strokeStyle = col; g.lineWidth = w / n * 1.15;
    for (let k = 0; k < n; k++) { const o = (k - (n - 1) / 2) * w / n; g.beginPath(); g.moveTo(x0 + px * o, y0 + py * o); g.lineTo(x1 + px * o, y1 + py * o); g.stroke(); }
    g.strokeStyle = 'rgba(255,250,235,0.45)'; g.lineWidth = 1; g.beginPath(); g.moveTo(x0 + dx * 0.15 - px * w * 0.2, y0 + dy * 0.15 - py * w * 0.2); g.lineTo(x0 + dx * 0.8 - px * w * 0.2, y0 + dy * 0.8 - py * w * 0.2); g.stroke();
  };
  const BODY = [[-30, -36], [-10, -38], [20, -26], [44, -6], [46, 6], [20, 14], [-14, 12], [-30, 0], [-38, -20]];
  const WING = [[-12, -24], [30, -18], [62, 0], [34, 8], [-6, -2]];
  const hoopoe = (g, x, y, s, fan, flap, a) => {
    if (a <= 0.01) return;
    g.save(); g.globalAlpha = a; g.translate(x, y); g.scale(s, s);
    // tail: black with one white band
    stitches(g, 40, 0, 92, 14, 18, '#1E1B1A', 4); stitches(g, 66, 7, 74, 9, 19, '#F2EEE4', 4);
    // body and head in cinnamon long-and-short
    K.fill(g, JQ.smoothPath(BODY), [-44, -44, 52, 18], { ang: 0.35, cols: ['#B9703E', '#CF8A52', '#E2A76E', '#EDC193'], shade: (u, v) => 0.8 - (v + 40) / 60, gap: 2.4, len: [6, 12], seed: 150, sheen: 0.8 });
    K.fill(g, JQ.P(Array.from({ length: 18 }, (_, k) => [-36 + Math.cos(k / 18 * TAU) * 15, -38 + Math.sin(k / 18 * TAU) * 14])), [-52, -54, -20, -22], { ang: 0, twist: (u, v) => Math.atan2(v + 38, u + 36), cols: ['#C47A44', '#DE9C61', '#EDBB86'], shade: (u, v) => 0.7 - (v + 38) / 30, gap: 2.2, len: [4, 8], seed: 151 });
    // the crest: closed it lies back along the nape; fanned it opens into a half wheel of black-tipped feathers
    for (let k = 0; k < 8; k++) {
      const open = -Math.PI + 0.4 + k / 7 * (Math.PI - 0.7), shut = -0.18 - k * 0.03, ang = JQ.lerp(shut, open, fan), len = JQ.lerp(34, 46, fan), bx = -32, by = -48;
      const ex = bx + Math.cos(ang) * len, ey = by + Math.sin(ang) * len, mx = bx + Math.cos(ang) * len * 0.72, my = by + Math.sin(ang) * len * 0.72, wx = bx + Math.cos(ang) * len * 0.8, wy = by + Math.sin(ang) * len * 0.8;
      stitches(g, bx, by, mx, my, 9, '#D9874A', 3); stitches(g, mx, my, wx, wy, 9, '#F2EEE4', 3); stitches(g, wx, wy, ex, ey, 9, '#1E1B1A', 3);
    }
    // bill, eye, legs
    g.strokeStyle = '#2E2A28'; g.lineCap = 'round'; g.lineWidth = 4.5; g.beginPath(); g.moveTo(-48, -38); g.quadraticCurveTo(-76, -38, -100, -22); g.stroke();
    g.fillStyle = '#141010'; g.beginPath(); g.arc(-40, -40, 2.8, 0, TAU); g.fill();
    if (flap == null) { g.strokeStyle = '#6E6A66'; g.lineWidth = 3; [[0, 12, -6, 26], [12, 12, 10, 26]].forEach(([a1, b1, a2, b2]) => { g.beginPath(); g.moveTo(a1, b1); g.lineTo(a2, b2); g.stroke(); }); }
    // wing: folded zebra bars, or spread and beating in flight
    if (flap == null) {
      K.fill(g, JQ.smoothPath(WING), [-16, -28, 66, 12], { ang: 0.3, cols: ['#1E1B1A', '#2E2A28'], gap: 2.2, len: [6, 12], seed: 152 });
      for (let k = 0; k < 4; k++) stitches(g, 6 + k * 13, -20 + k * 4, 2 + k * 13, -2 + k * 2, 6, '#F2EEE4', 2);
    } else {
      g.save(); g.translate(4, -22); g.rotate(-1.2 + flap * 1.6);
      const w = JQ.smoothPath([[0, 0], [30, -20], [86, -26], [110, -6], [80, 14], [20, 12]]);
      K.fill(g, w, [-4, -30, 114, 18], { ang: 0.1, cols: ['#1E1B1A', '#2E2A28'], gap: 2.4, len: [8, 16], seed: 153 });
      for (let k = 0; k < 5; k++) stitches(g, 30 + k * 16, -18, 26 + k * 16, 10, 7, '#F2EEE4', 2);
      g.restore();
    }
    g.restore();
  };
  const BAR = 8 / 3, IMP = 2 * BAR + 4 / 3, HOU = JQ.TERMS[5].hou, DOVE = [850, 284], LAND = 6.52;
  // 鸣鸠拂其羽: a stitched turtle dove on the bare twig; in the second bar it lifts and shakes its wings twice
  const dove = (g, x, y, s, w) => {
    g.save(); g.translate(x, y); g.scale(s, s);
    K.fill(g, JQ.P([[-30, 2], [-80, 12], [-82, 22], [-30, 14]]), [-86, -2, -26, 26], { ang: 0.15, cols: ['#5E5A58', '#77716C'], gap: 2.2, len: [6, 12], seed: 160 });
    stitches(g, -82, 14, -70, 13, 10, '#F2EEE4', 3);
    K.fill(g, JQ.smoothPath([[-34, -2], [-10, -18], [16, -19], [32, -9], [30, 8], [8, 16], [-22, 14], [-36, 6]]), [-40, -24, 36, 20], { ang: 0.2, cols: ['#A08C88', '#B9A39C', '#CDB8AE'], shade: (u, v) => 0.8 - (v + 18) / 36, gap: 2.3, len: [6, 12], seed: 161, sheen: 0.8 });
    K.fill(g, JQ.P(Array.from({ length: 16 }, (_, k) => [30 + Math.cos(k / 16 * TAU) * 12, -22 + Math.sin(k / 16 * TAU) * 11])), [16, -36, 44, -8], { ang: 0.3, cols: ['#8E909C', '#A9AAB4'], gap: 2, len: [4, 8], seed: 162 });
    for (let k = 0; k < 4; k++) stitches(g, 16 + k * 4, -16, 14 + k * 4, -6, 3, k % 2 ? '#F2EEE4' : '#1E1B1A', 2);
    g.strokeStyle = '#2E2A28'; g.lineCap = 'round'; g.lineWidth = 3; g.beginPath(); g.moveTo(41, -22); g.lineTo(50, -19); g.stroke();
    g.fillStyle = '#141010'; g.beginPath(); g.arc(34, -25, 2.4, 0, TAU); g.fill();
    g.strokeStyle = '#7A5C50'; g.lineWidth = 2.6; [[0, 14, -4, 26], [10, 14, 8, 26]].forEach(([a1, b1, a2, b2]) => { g.beginPath(); g.moveTo(a1, b1); g.lineTo(a2, b2); g.stroke(); });
    g.save(); g.translate(14, -12); g.rotate(w * 1.15); g.scale(1 + w * 0.25, 1 + w * 0.5);
    const wp = JQ.smoothPath([[0, 0], [-20, -12], [-50, -10], [-62, 2], [-44, 14], [-8, 12]]);
    K.fill(g, wp, [-66, -16, 4, 18], { ang: 0.1, cols: ['#8A7060', '#A08470', '#B89A84'], gap: 2.2, len: [6, 12], seed: 163, sheen: 0.8 });
    for (let k = 0; k < 4; k++) stitches(g, -12 - k * 9, 2 + (k % 2) * 4, -16 - k * 9, 6 + (k % 2) * 4, 5, '#3A2E28', 2);
    for (let k = 0; k < 4; k++) stitches(g, -46 - k * 4, -6 + k * 5, -60 - k * 3, -2 + k * 5, 4, '#4A403A', 2);
    g.restore(); g.restore();
  };
  const shake = t => [3.0, 4.25].reduce((s, t0) => { const u = (t - t0) / 0.75; return s + (u > 0 && u < 1 ? Math.sin(u * Math.PI) * (0.65 + 0.35 * Math.sin(t * 34)) : 0); }, 0);
  const plume = (g, t) => [[3.35, -14], [4.6, 22]].forEach(([t0, dx], i) => { const u = (t - t0) / 2.2; if (u <= 0) return; const v = Math.min(1, u), x = DOVE[0] + dx + Math.sin(v * 6 + i) * 22 + v * 30, y = DOVE[1] + 10 + v * 330, a = Math.sin(v * 5 + i) * 0.8 + 0.6;
    stitches(g, x - Math.cos(a) * 12, y - Math.sin(a) * 12, x + Math.cos(a) * 12, y + Math.sin(a) * 12, 6, '#B9A39C', 3); });
  // the pentad line: each stitched once into its own layer, stitched in from the top at the start of its bar
  const houLayer = (h, Sx) => JQ.cached('s06-hou' + h, Sx, (g, S) => K.stitchText(g, S, HOU[h], 1574, 82, 50, '600 50px "Songti SC", "STSong", serif', ['#7A3A2E', '#96503F', '#B06A55'], true));
  JQ.ART[6] = { key: IMP, keyHou: JQ.TERMS[5].keyHou, focus: [[990, 880], [DOVE[0], DOVE[1]], [PERCH[0], PERCH[1]]], frame: true, draw(g, t, Sx) {
    t = JQ.clamp(t, 0, 9); const h = Math.min(2, Math.floor(t / BAR));
    JQ.blit(g, JQ.cached('s06-back-v4', Sx, A.build));
    const rv = h ? JQ.smooth(h * BAR, h * BAR + 0.6, t) : 1;
    g.save(); g.beginPath(); g.rect(1560, 70, 80, 10 + rv * 300); g.clip(); JQ.blit(g, houLayer(h, Sx)); g.restore();
    if (rv < 1) stitches(g, 1574, 80 + rv * 300, 1626, 80 + rv * 300, 3, '#96503F', 2);
    const N = A.DW.length, prog = JQ.clamp((t - 0.12) / 2.4) * N, n = Math.floor(prog);
    A.duckweed(g, n, 1);
    if (n < N) { const [x, y] = A.DW[n], [px, py] = A.DW[Math.max(0, n - 1)]; A.needle(g, x, y, Math.abs(Math.sin((prog - n) * Math.PI)), px, py); }
    const CA = JQ.castFor(Sx, t); K.seeds(g, CA); K.castDraw(g, Sx, CA);
    dove(g, DOVE[0], DOVE[1], 1.5, shake(t)); plume(g, t);
    // 戴胜降于桑: in from the right from the start of bar three, lands on the mulberry, the crest is fully fanned on the impact
    if (t > 2 * BAR + 0.05) { const f = JQ.smooth(2 * BAR + 0.07, LAND, t), land = t >= LAND;
      const x = JQ.lerp(START[0], PERCH[0], f), y = JQ.lerp(START[1], PERCH[1], f) - Math.sin(f * Math.PI) * 50;
      hoopoe(g, x, y, 1.3, JQ.smooth(LAND, IMP, t), land ? null : (Math.sin(t * 18) + 1) / 2, 1); }
  } };
})();
