// s07 立夏 · 蔚县彩色剪纸. Thin xuan paper cut with a knife, then dotted with dye: magenta, bright yellow, emerald and
// lake blue that bleed softly inside the paper while the cut edge stays crisp. Knife marks: sawtooth (锯齿纹), crescent
// (月牙纹), willow-leaf (柳叶纹) and fine cut lines; black-dyed outlines on the figures. Every piece is pasted on white
// xuan inside a red paper border and lifts a hair-thin paper shadow.
// Moment (蚯蚓出): a big paper earthworm wriggles up out of the ground segment by segment; on the wall vine the 王瓜 turn
// red one after another, the red dye spreading up through each green gourd.
(function () {
  const JQ = window.JQ, TAU = Math.PI * 2;
  const C = { mag: '#E0186C', mag2: '#F25A9A', ylw: '#F7C81E', ylw2: '#FBE36A', grn: '#14955A', grn2: '#5CC46A', blu: '#1C8FC8', blu2: '#6CC6E8',
    red: '#E3262E', org: '#F28A1E', blk: '#24151E', paper: '#F7F2E6', border: '#C8202A', pink: '#F7B5C8' };
  // cut a piece: dye (blurred, so colours bleed) clipped to the silhouette, black-dyed lines, then knife cuts, then paste with a thin shadow
  const piece = (g, Sx, sil, dye, cuts, lines, bleed = 3.5) => {
    const Lr = JQ.layer('s07piece', Sx), p = Lr.g, sc = Sx.scale;
    p.fillStyle = '#000'; (Array.isArray(sil) ? sil : [sil]).forEach(q => p.fill(q));
    p.globalCompositeOperation = 'source-atop'; p.filter = `blur(${bleed * sc}px)`; dye(p); p.filter = 'none';
    if (lines) { p.globalCompositeOperation = 'source-atop'; lines(p); }
    p.globalCompositeOperation = 'source-over';
    if (cuts) { p.globalCompositeOperation = 'destination-out'; p.fillStyle = '#000'; p.strokeStyle = '#000'; cuts(p); p.globalCompositeOperation = 'source-over'; }
    g.save(); g.filter = `drop-shadow(${1.6 * sc}px ${2.4 * sc}px ${1.1 * sc}px rgba(80,24,16,0.32))`; JQ.blit(g, Lr); g.restore();
  };
  // the same cut on a small box-sized layer (design rect x0, y0, w, h): what the per-frame pieces use, so a 2560 frame stays cheap
  const boxes = {};
  const boxLayer = (name, Sx, x0, y0, w, h) => {
    const sc = Sx.scale, cw = Math.ceil(w * sc), ch = Math.ceil(h * sc), k = name + ':' + cw + 'x' + ch;
    let B = boxes[k]; if (!B) { const c = document.createElement('canvas'); c.width = cw; c.height = ch; B = boxes[k] = { c, g: c.getContext('2d') }; }
    Object.assign(B, { x0, y0, w, h }); B.g.setTransform(1, 0, 0, 1, 0, 0); B.g.clearRect(0, 0, cw, ch); B.g.setTransform(cw / w, 0, 0, ch / h, -x0 * cw / w, -y0 * ch / h); return B;
  };
  const cutBox = (Sx, B, sil, dye, cuts, lines, bleed = 3.5) => {
    const p = B.g, sc = Sx.scale;
    p.fillStyle = '#000'; (Array.isArray(sil) ? sil : [sil]).forEach(q => p.fill(q));
    p.globalCompositeOperation = 'source-atop'; p.filter = `blur(${bleed * sc}px)`; dye(p); p.filter = 'none';
    if (lines) { p.globalCompositeOperation = 'source-atop'; lines(p); }
    p.globalCompositeOperation = 'source-over';
    if (cuts) { p.globalCompositeOperation = 'destination-out'; p.fillStyle = '#000'; p.strokeStyle = '#000'; cuts(p); p.globalCompositeOperation = 'source-over'; }
    return B;
  };
  const paste = (g, Sx, B, a = 1) => { const sc = Sx.scale; g.save(); g.globalAlpha = a; g.filter = `drop-shadow(${1.6 * sc}px ${2.4 * sc}px ${1.1 * sc}px rgba(80,24,16,0.32))`; g.drawImage(B.c, B.x0, B.y0, B.w, B.h); g.restore(); };
  const pieceB = (g, Sx, name, rect, sil, dye, cuts, lines, bleed) => paste(g, Sx, cutBox(Sx, boxLayer(name, Sx, ...rect), sil, dye, cuts, lines, bleed));
  // knife marks ------------------------------------------------------------------
  // sawtooth: a row of thin teeth along a polyline, pointing to one side
  const saw = (p, pts, step = 9, h = 14, side = 1, w = 0.55) => {
    const P = JQ.resample(pts, step, false), path = new Path2D();
    for (let i = 0; i < P.length - 1; i++) { const [ax, ay] = P[i], [bx, by] = P[i + 1], dx = bx - ax, dy = by - ay, d = Math.hypot(dx, dy) || 1, nx = -dy / d * side, ny = dx / d * side, mx = (ax + bx) / 2, my = (ay + by) / 2;
      path.moveTo(mx - dx * w / 2, my - dy * w / 2); path.lineTo(mx + nx * h, my + ny * h); path.lineTo(mx + dx * w / 2, my + dy * w / 2); path.closePath(); }
    p.fill(path);
  };
  // crescent: outer disc minus an offset disc
  const moonPath = (path, x, y, r, ang = -Math.PI / 2, thick = 0.38) => {
    const a0 = ang + Math.PI * 0.3, span = Math.PI * 1.4, n = 14;
    for (let i = 0; i <= n; i++) { const f = a0 + i / n * span; i ? path.lineTo(x + Math.cos(f) * r, y + Math.sin(f) * r) : path.moveTo(x + Math.cos(f) * r, y + Math.sin(f) * r); }
    for (let i = n; i >= 0; i--) { const f = a0 + i / n * span, rr = r * (1 - thick * 2 * Math.sin(i / n * Math.PI)); path.lineTo(x + Math.cos(f) * rr + Math.cos(ang + Math.PI) * 0, y + Math.sin(f) * rr); }
    path.closePath(); };
  const moons = (p, list, r, ang, thick) => { const path = new Path2D(); list.forEach(([x, y, a]) => moonPath(path, x, y, r, a == null ? ang : a, thick)); p.fill(path); };
  // willow leaf: a lens
  const willowPath = (path, x, y, len, ang, w = 0.22) => { const c = Math.cos(ang), s = Math.sin(ang), at = (u, v) => [x + (u * c - v * s) * len, y + (u * s + v * c) * len];
    path.moveTo(...at(-0.5, 0)); path.quadraticCurveTo(...at(0, -w), ...at(0.5, 0)); path.quadraticCurveTo(...at(0, w), ...at(-0.5, 0)); path.closePath(); };
  const willows = (p, list, len, w) => { const path = new Path2D(); list.forEach(([x, y, a]) => willowPath(path, x, y, len, a, w)); p.fill(path); };
  const cutLine = (p, pts, w = 3) => { p.lineWidth = w; p.lineCap = 'round'; p.lineJoin = 'round'; p.beginPath(); pts.forEach(([x, y], i) => i ? p.lineTo(x, y) : p.moveTo(x, y)); p.stroke(); };
  const along = (pts, step) => JQ.resample(pts, step, false);
  const blob = (p, x, y, rx, ry, col) => { p.fillStyle = col; p.beginPath(); p.ellipse(x, y, rx, ry, 0, 0, TAU); p.fill(); };
  const paper = g => {
    g.fillStyle = C.paper; g.fillRect(0, 0, JQ.W, JQ.H);
    const R = JQ.rng(707); g.strokeStyle = 'rgba(150,130,100,0.10)'; g.lineWidth = 0.8;
    for (let i = 0; i < 700; i++) { const x = R() * 1920, y = R() * 1080, a = R() * TAU, l = 6 + R() * 26; g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + Math.cos(a) * l * 0.5 + 4, y + Math.sin(a) * l * 0.5, x + Math.cos(a) * l, y + Math.sin(a) * l); g.stroke(); }
  };
  JQ._s07 = { C, piece, saw, moons, moonPath, willows, willowPath, cutLine, along, blob, paper, boxLayer, cutBox, paste, pieceB };
})();
(function () {
  const JQ = window.JQ, S = JQ.SCENE, L = JQ.L, TAU = Math.PI * 2, K = JQ._s07, { C, piece, saw, moons, willows, cutLine, along, blob } = K;
  const P = JQ.P, U = (...ps) => ps;
  const shifted = (pts, dy) => pts.map(([x, y]) => [x, y + dy]);
  const sky = (g, Sx) => {
    // sun: a yellow disc dyed magenta at the heart, a ring of teeth, willow-leaf rays
    const sx = 1200, sy = 150, sun = new Path2D(); for (let i = 0; i < 48; i++) { const a = i / 48 * TAU, r = i % 2 ? 78 : 92; i ? sun.lineTo(sx + Math.cos(a) * r, sy + Math.sin(a) * r) : sun.moveTo(sx + r, sy); } sun.closePath();
    piece(g, Sx, sun, p => { p.fillStyle = C.ylw; p.fillRect(1080, 40, 240, 240); blob(p, sx, sy, 40, 40, C.org); blob(p, sx, sy, 22, 22, C.mag); },
      p => { const ring = []; for (let i = 0; i < 24; i++) { const a = i / 24 * TAU; ring.push([sx + Math.cos(a) * 58, sy + Math.sin(a) * 58, a + Math.PI / 2]); } willows(p, ring, 20, 0.2); willows(p, [0, 1, 2, 3].map(k => [sx + Math.cos(k * Math.PI / 2) * 16, sy + Math.sin(k * Math.PI / 2) * 16, k * Math.PI / 2]), 26, 0.3); });
    // clouds: lake-blue ruyi scrolls
    [[880, 120, 1], [1470, 200, -1], [640, 70, 1]].forEach(([x, y, d], i) => {
      const c = new Path2D(); c.ellipse(x, y, 74, 26, 0, 0, TAU); c.ellipse(x - 40 * d, y - 18, 34, 30, 0, 0, TAU); c.ellipse(x + 30 * d, y - 22, 28, 24, 0, 0, TAU); c.ellipse(x + 74 * d, y + 4, 22, 18, 0, 0, TAU);
      piece(g, Sx, c, p => { p.fillStyle = C.blu; p.fillRect(x - 140, y - 70, 280, 130); blob(p, x, y + 10, 50, 14, C.blu2); },
        p => { [[x - 40 * d, y - 16, 16], [x + 30 * d, y - 20, 13]].forEach(([cx, cy, r]) => cutLine(p, Array.from({ length: 30 }, (_, k) => { const a = k / 29 * TAU * 1.5 * d, rr = r * (1 - k / 34); return [cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]; }), 2.6)); cutLine(p, [[x - 56, y + 10], [x + 56, y + 10]], 2.6); saw(p, [[x - 50, y + 18], [x + 50, y + 18]], 7, 6, 1); });
    });
  };
  const land = (g, Sx) => {
    const rg = S.ridge.pts;
    piece(g, Sx, S.mountains.path, p => { p.fillStyle = C.grn; p.fillRect(0, 200, 1920, 260); p.fillStyle = C.blu; p.fill(P([...shifted(rg, -10), ...shifted(rg, 40).reverse()])); p.fillStyle = C.blu2; p.fill(P([...shifted(rg, 50), ...shifted(rg, 74).reverse()])); },
      p => { saw(p, shifted(rg, 34), 10, 12, 1); saw(p, shifted(rg, 78), 12, 10, 1); moons(p, along(shifted(rg, 104), 46).map(([x, y]) => [x, y]), 9, -Math.PI / 2, 0.4); });
    piece(g, Sx, S.hills.path, p => { p.fillStyle = C.grn; p.fillRect(0, 360, 1920, 90); blob(p, 400, 410, 300, 20, C.grn2); blob(p, 1400, 400, 300, 20, C.grn2); },
      p => willows(p, along(S.hills.pts.slice(0, -2).map(([x, y]) => [x, y + 22]), 30).map(([x, y]) => [x, y, 0]), 22, 0.22));
    const fy = (f, x) => { const [p0, p1, p2] = f.pts; return x < p1[0] ? JQ.lerp(p0[1], p1[1], x / p1[0]) : JQ.lerp(p1[1], p2[1], (x - p1[0]) / (p2[0] - p1[0])); };
    piece(g, Sx, S.field.path, p => { S.furrows.forEach((f, k) => { const nx = S.furrows[k + 1] || { pts: [[0, 700], [1180, 650], [1920, 600]] }; p.fillStyle = k % 2 ? C.ylw2 : C.grn2; p.fill(P([...f.pts, ...nx.pts.slice().reverse()])); }); p.fillStyle = C.grn2; p.fillRect(0, 420, 1920, 40); },
      p => S.furrows.forEach((f, k) => { cutLine(p, f.pts, 3); const row = []; for (let x = 20 + (k % 2) * 20; x < 1920; x += 26) { row.push([x - 4, fy(f, x) + 12, -1.9]); row.push([x + 4, fy(f, x) + 12, -1.25]); } willows(p, row, 15, 0.24); }));   // 立夏: rows of young wheat, two-leaf sprouts
    const tufts = [], R = JQ.rng(71); for (let i = 0; i < 44; i++) { const x = 80 + R() * 1760, y = 700 + R() * 330; if (Math.abs(x - 990) < 380 && Math.abs(y - 885) < 150) continue; if (x > 1380 && x < 1720 && y > 800) continue; if (x < 700 && y > 860) continue; tufts.push([x, y, R()]); }
    const tuftPath = (x, y, k) => { const q = new Path2D(); q.moveTo(x - 30, y); for (let j = 0; j <= 6; j++) { const u = x - 30 + j * 10; q.lineTo(u - 3, y - (j % 2 ? 18 : 30) - k * 8); q.lineTo(u + 3, y - 4); } q.lineTo(x + 30, y); q.closePath(); return q; };
    piece(g, Sx, tufts.map(([x, y, k]) => tuftPath(x, y, k)), p => { p.fillStyle = C.grn; p.fillRect(0, 600, 1920, 480); tufts.forEach(([x, y, k], i) => blob(p, x, y - 18, 10, 10, i % 3 ? C.grn2 : C.ylw)); }, null, null, 3);
    // little cut flowers among the tufts: five petals dotted magenta, yellow or lake blue, a willow-leaf cut in each petal
    const fl = [[180, 880], [604, 776], [1150, 748], [1360, 884], [1790, 868], [1182, 1036], [104, 700], [962, 1044], [1492, 962], [262, 744]].map(([x, y], i) => [x, y, 17 + (i % 3) * 3, i]), FC = [C.mag, C.ylw, C.blu2, C.org];
    const flower = (x, y, r) => { const q = new Path2D(); for (let k = 0; k < 5; k++) { const a = k / 5 * TAU - Math.PI / 2; q.moveTo(x, y); q.ellipse(x + Math.cos(a) * r * 0.62, y + Math.sin(a) * r * 0.62, r * 0.55, r * 0.34, a, 0, TAU); } q.moveTo(x + r * 0.3, y); q.arc(x, y, r * 0.3, 0, TAU); return q; };
    piece(g, Sx, fl.map(([x, y, r]) => flower(x, y, r)).concat(fl.map(([x, y]) => P([[x - 1.5, y], [x + 1.5, y], [x + 2, y + 34], [x - 2, y + 34]]))), p => { p.fillStyle = C.grn; p.fillRect(0, 600, 1920, 480); fl.forEach(([x, y, r, i]) => { blob(p, x, y, r * 1.1, r * 1.1, FC[i % 4]); blob(p, x, y, r * 0.35, r * 0.35, i % 4 === 1 ? C.mag : C.ylw2); }); },
      p => willows(p, fl.flatMap(([x, y, r]) => [0, 1, 2, 3, 4].map(k => { const a = k / 5 * TAU - Math.PI / 2; return [x + Math.cos(a) * r * 0.66, y + Math.sin(a) * r * 0.66, a]; })), 7, 0.24), null, 2);
    piece(g, Sx, S.path.path, p => { p.fillStyle = C.ylw2; p.fillRect(1380, 800, 340, 290); }, p => moons(p, along([[1650, 830], [1600, 930], [1540, 1040]], 34).map(([x, y]) => [x - 40, y]), 10, -Math.PI / 2, 0.4));
  };
  const water = (g, Sx) => {
    piece(g, Sx, U(S.stream.path, S.pondRim.path), p => { p.fillStyle = C.blu; p.fillRect(640, 420, 820, 680); blob(p, 990, 900, 260, 70, C.blu2); },
      p => { moons(p, S.stream.center.filter((_, i) => i % 3 === 1).map(([x, y]) => [x, y]), 9, Math.PI / 2, 0.45);
        const rows = []; for (let y = 812; y < 980; y += 26) for (let x = 700 + ((y / 26) % 2) * 26; x < 1290; x += 52) if (((x - 990) / 330) ** 2 + ((y - 888) / 110) ** 2 < 0.8) rows.push([x, y]); moons(p, rows, 13, Math.PI / 2, 0.42);
        const ring = []; for (let i = 0; i < 70; i++) { const a = i / 70 * TAU; ring.push([L.pond.cx + Math.cos(a) * (L.pond.rx + 14), L.pond.cy + 8 + Math.sin(a) * (L.pond.ry + 12)]); } cutLine(p, [...ring, ring[0]], 3); });
    const B = L.bridge, arch = new Path2D(); arch.ellipse(B.cx, B.archBase, B.half - 18, B.archBase - B.archTop, 0, Math.PI, TAU); arch.closePath();
    piece(g, Sx, S.bridge.path, p => { p.fillStyle = C.ylw; p.fillRect(1160, 620, 260, 110); blob(p, B.cx, B.deckY + 8, 90, 10, C.org); },
      p => { p.fill(arch); saw(p, [[B.cx - B.half - 10, B.deckY + 10], [B.cx + B.half + 10, B.deckY + 10]], 9, 8, 1); moons(p, [[B.cx - B.half + 8, B.archBase - 14], [B.cx + B.half - 8, B.archBase - 14]], 8, 0, 0.4); });
  };
  Object.assign(K, { sky, land, water, U });
})();
(function () {
  const JQ = window.JQ, S = JQ.SCENE, L = JQ.L, TAU = Math.PI * 2, K = JQ._s07, { C, piece, saw, moons, willows, cutLine, along, blob, U } = K, H = L.house;
  const P = JQ.P;
  const ribbon = (pts, w0, w1 = w0) => { const A = [], B = [], n = pts.length; pts.forEach((q, i) => { const a = pts[Math.max(0, i - 1)], b = pts[Math.min(n - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], d = Math.hypot(dx, dy) || 1, w = JQ.lerp(w0, w1, i / (n - 1)) / 2; A.push([q[0] - dy / d * w, q[1] + dx / d * w]); B.push([q[0] + dy / d * w, q[1] - dx / d * w]); }); return P([...A, ...B.reverse()]); };
  const heart = (x, y, s, a) => { const c = Math.cos(a), sn = Math.sin(a), at = (u, v) => [x + (u * c - v * sn) * s, y + (u * sn + v * c) * s]; return JQ.smoothPath([at(0, 0), at(0.35, -0.5), at(0.75, -0.42), at(1, 0), at(0.75, 0.42), at(0.35, 0.5)]); };
  const house = (g, Sx) => {
    const sil = U(S.roof.path, S.houseFront.path, S.chimney.path, S.wall.path, S.wallCap.path, S.gateRoof.path, S.gate.path);
    piece(g, Sx, sil, p => { p.fillStyle = C.ylw2; p.fillRect(1430, 600, 490, 220); blob(p, 1680, 800, 260, 30, C.org); p.fillStyle = C.mag; p.fill(S.roof.path); p.fill(S.chimney.path); blob(p, 1690, 520, 160, 18, C.mag2);
      p.fillStyle = C.ylw; p.fill(S.houseFront.path); p.fillStyle = C.grn; p.fill(S.gateRoof.path); }, p => {
      [492, 512, 532].forEach(y => saw(p, [[1480, y], [1900, y]], 10, 12, 1));
      moons(p, along([[H.roofX0 + 6, H.eaveY - 6], [H.roofX1 - 6, H.eaveY - 6]], 22), 7, Math.PI / 2, 0.4);
      for (let y = 640; y < 800; y += 32) { cutLine(p, [[H.wallX0 + 8, y], [H.gateX0 - 8, y]], 2.4); cutLine(p, [[H.gateX1 + 8, y], [H.wallX1, y]], 2.4); }
      for (let x = 1732; x < 1800; x += 14) for (let y = 562; y < 592; y += 12) p.fillRect(x, y, 8, 7);
      cutLine(p, [[1650, 700], [1650, 806]], 2.4); for (let j = 0; j < 4; j++) for (let i = 0; i < 2; i++) { p.beginPath(); p.arc(1626 + i * 48, 714 + j * 24, 4, 0, TAU); p.fill(); }
      saw(p, [[H.gateX0 - 28, H.gateTop - 6], [H.gateX1 + 28, H.gateTop - 6]], 9, 9, -1); }, p => { p.fillStyle = C.blk; [S.wallCap.path, S.gate.path, S.window.path].forEach(q => p.fill(q)); p.strokeStyle = C.blk; p.lineWidth = 3; [S.roof.path, S.houseFront.path, S.wall.path, S.gateRoof.path].forEach(q => p.stroke(q)); }, 3);
  };
  const VINES = [[[1452, 812], [1470, 770], [1456, 730], [1482, 690], [1522, 668], [1560, 676], [1584, 660]], [[1906, 812], [1886, 770], [1900, 730], [1870, 690], [1828, 668], [1790, 676], [1744, 662]]];
  const GOURDS = [[1490, 742], [1534, 716], [1576, 730], [1800, 720], [1862, 748]];
  const gourdPath = (x, y, w = 24, h = 40) => { const pts = []; for (let i = 0; i < 28; i++) { const a = i / 28 * TAU, k = Math.cos(a) > 0 ? 1 : 0.8; pts.push([x + Math.sin(a) * w * (1 - 0.12 * Math.cos(a)), y - Math.cos(a) * h * k]); } return JQ.smoothPath(pts); };
  const vine = (g, Sx) => {
    const sil = [], leaves = [];
    VINES.forEach((v, j) => { sil.push(ribbon(JQ.resample(v, 8, false), 9, 5)); along(v, 46).forEach(([x, y], i) => { if (i === 0) return; const a = (i % 2 ? -1 : 1) * 1.2 + (j ? Math.PI : 0) - Math.PI / 2; leaves.push([x, y, a]); sil.push(heart(x, y, 44, a)); }); });
    GOURDS.forEach(([x, y]) => sil.push(ribbon([[x, y - 60], [x + 2, y - 36]], 6, 4)));
    piece(g, Sx, sil, p => { p.fillStyle = C.grn; p.fillRect(1430, 620, 490, 220); leaves.forEach(([x, y, a], i) => blob(p, x + Math.cos(a) * 22, y + Math.sin(a) * 22, 12, 12, i % 2 ? C.grn2 : C.ylw)); },
      p => leaves.forEach(([x, y, a]) => { cutLine(p, [[x + Math.cos(a) * 8, y + Math.sin(a) * 8], [x + Math.cos(a) * 36, y + Math.sin(a) * 36]], 2.2); }),
      p => { p.strokeStyle = C.blk; p.lineWidth = 2.2; leaves.forEach(([x, y, a]) => p.stroke(heart(x, y, 44, a))); }, 3);
  };
  const tree = (g, Sx) => {
    const sil = U(S.trunk.path, S.canopy.path);
    piece(g, Sx, sil, p => { p.fillStyle = '#3A2230'; p.fillRect(380, 420, 220, 420); p.fillStyle = C.grn; p.fill(S.canopy.path); S.clumps.forEach((c, i) => { for (let k = 0; k < 4; k++) { const a = k * 1.7 + i, d = c.r * (0.25 + 0.35 * JQ.hash(i, k, 7)); blob(p, c.x + Math.cos(a) * d, c.y + Math.sin(a) * d * 0.8, 7, 7, (i + k) % 3 ? C.grn2 : C.ylw); } }); }, p => {
      const cp = S.canopy.pts; saw(p, [...cp, cp[0]], 12, 18, -1, 0.6);
      S.clumps.forEach((c, i) => { const list = []; for (let k = 0; k < 7; k++) { const a = k / 7 * TAU + i; list.push([c.x + Math.cos(a) * c.r * 0.45, c.y + Math.sin(a) * c.r * 0.35, a]); } willows(p, list, 24, 0.24); });
      moons(p, [[465, 560], [478, 620], [462, 680], [474, 740], [460, 800]], 10, -Math.PI / 2, 0.4); });
    piece(g, Sx, P([[385, 1030], [405, 1008], [440, 1000], [475, 1008], [497, 1030], [485, 1036], [395, 1036]]), p => { p.fillStyle = C.blk; p.fillRect(375, 990, 135, 50); }, p => saw(p, [[398, 1029], [484, 1029]], 8, 10, -1));   // the worm hole, in front of the squatting child
  };
  // ---------------------------------------------------------------- the family as paper cuts: every item of JQ.castFor is dyed, outlined, knife-cut
  // and pasted from its own small box layer (box sizes quantised to 40 px so the canvases are reused frame to frame)
  const BASE = { skin: C.pink, hair: C.blk, coat: C.mag, pants: C.blu, apron: C.mag2, hat: C.ylw, scarf: C.mag2, straw: C.ylw, cape: C.org, eye: C.blk,
    ox: C.ylw, oxDark: C.blk, horn: C.ylw2, calf: C.org, calfDark: C.blk, prop: '#8A4A2A', metal: C.blu, red: C.red, line: C.blk };
  const PAL = { woman: { coat: C.blu, pants: C.grn, apron: C.mag2, hat: C.ylw }, kid: { coat: C.mag, pants: C.blu } };
  const colorOf = (who, role) => (PAL[who] && PAL[who][role]) || JQ.roleColor(BASE, role) || C.ylw;
  const bbox = pts => { let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9; pts.forEach(([x, y]) => { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }); return [x0, y0, x1, y1]; };
  const area = q => { const [a, b, c, d] = bbox(q.pts); return (c - a) * (d - b); };
  const paperItem = (g, Sx, it) => {
    const parts = it.parts; if (!parts || !parts.length) return;
    const [x0, y0, x1, y1] = bbox(parts.flatMap(q => q.pts)), m = 16, sc = JQ.STORY_S(it.y);
    const bx = Math.floor(x0 - m), by = Math.floor(y0 - m), w = Math.ceil((x1 - x0 + 2 * m) / 40) * 40, h = Math.ceil((y1 - y0 + 2 * m) / 40) * 40;
    const beast = it.kind === 'actor' && (it.who === 'ox' || it.who === 'calf'), person = it.kind === 'actor' && !beast;
    const body = beast ? parts.filter(q => q.role === it.who).reduce((a, q) => (!a || area(q) > area(a) ? q : a), null) : null;
    const J = parts.joints || {}, coats = person ? parts.filter(q => q.role === 'coat') : [];
    const B = K.cutBox(Sx, K.boxLayer('s07c-' + it.who + '-' + it.kind, Sx, bx, by, w, h), parts.map(q => q.path),
      p => { parts.forEach(q => { p.fillStyle = colorOf(it.who, q.role); p.fill(q.path); });                       // dot-dyed: a warm bleed on each body
        if (body) { const [a, b, c, d] = bbox(body.pts); blob(p, (a + c) / 2, d - (d - b) * 0.2, (c - a) * 0.36, (d - b) * 0.16, C.org); blob(p, a + (c - a) * (it.who === 'ox' ? 0.3 : 0.6), b + (d - b) * 0.35, (c - a) * 0.12, (d - b) * 0.14, C.ylw2); }
        if (J.shoulder) blob(p, J.shoulder[0], J.shoulder[1] + 26 * sc, 20 * sc, 18 * sc, it.who === 'kid' ? C.ylw : C.blu2); },
      p => {
        if (body) { const [a, b, c, d] = bbox(body.pts), st = (it.who === 'ox' ? 26 : 20) * sc, rows = []; for (let x = a + st * 0.6; x < c; x += st) for (let y = b + st * 0.6, r = 0; y < d - st * 0.3; y += st * 0.92, r++) rows.push([x + (r % 2) * st / 2, y]);
          p.save(); p.clip(body.path); moons(p, rows, (it.who === 'ox' ? 9 : 7) * sc, -Math.PI / 2, 0.42); p.restore(); }
        if (coats.length && J.shoulder) { p.save(); const cl = new Path2D(); coats.forEach(q => cl.addPath(q.path)); p.clip(cl); const y = J.shoulder[1] + 34 * sc;
          saw(p, [[J.shoulder[0] - 60 * sc, y], [J.shoulder[0] + 60 * sc, y]], 7 * sc, 9 * sc, -1); p.restore(); } },
      p => { p.strokeStyle = C.blk; p.lineWidth = Math.max(1.6, 2.6 * sc); p.lineJoin = 'round';
        parts.forEach(q => { if (q.role === 'hair' || q.role === 'eye' || q.role === 'line') { p.fillStyle = C.blk; p.fill(q.path); } else p.stroke(q.path); }); }, 2.5);
    K.paste(g, Sx, B, it.alpha == null ? 1 : it.alpha);
  };
  const cast = (g, Sx, t, filter) => { for (const it of JQ.castFor(Sx, t).items) if (!filter || filter(it)) paperItem(g, Sx, it); };
  Object.assign(K, { house, vine, tree, cast, ribbon, gourdPath, GOURDS });
})();
(function () {
  const JQ = window.JQ, TAU = Math.PI * 2, K = JQ._s07, { C, piece, saw, moons, willows, cutLine, blob } = K;
  const P = JQ.P;
  const HOU = JQ.TERMS[6].hou, made = {}, once = (key, Sx, mk) => made[key + '@' + Sx.scale] || (made[key + '@' + Sx.scale] = mk());
  // the title paper: 立夏 plus the current pentad, one freshly cut paper per pentad
  const titleBox = (Sx, i) => once('s07title' + i, Sx, () => {
    const x0 = 1594, y0 = 70, w = 262, h = 236, rect = P([[x0, y0], [x0 + w, y0], [x0 + w, y0 + h], [x0, y0 + h]]);
    return K.cutBox(Sx, K.boxLayer('s07title' + i, Sx, 1584, 60, 290, 260), rect, p => { p.fillStyle = C.mag; p.fillRect(x0, y0, w, h); blob(p, x0 + w / 2, y0 + h / 2, 90, 70, C.red); }, p => {
      p.textAlign = 'center'; p.textBaseline = 'alphabetic'; p.font = '900 108px "Songti SC", "STSong", serif'; p.fillText('立夏', x0 + w / 2, y0 + 136);
      p.font = '900 50px "Songti SC", "STSong", serif'; p.fillText(HOU[i], x0 + w / 2, y0 + 204);
      saw(p, [[x0 + 10, y0 + 12], [x0 + w - 10, y0 + 12]], 9, 9, 1); saw(p, [[x0 + w - 10, y0 + h - 12], [x0 + 10, y0 + h - 12]], 9, 9, 1);
      moons(p, [[x0 + 18, y0 + 30], [x0 + w - 18, y0 + 30], [x0 + 18, y0 + h - 30], [x0 + w - 18, y0 + h - 30]], 8, 0, 0.4); });
  });
  const title = (g, Sx, t) => {
    const bar = 8 / 3, i = Math.min(2, Math.floor(t / bar)), u = JQ.clamp((t - i * bar) / 0.3);
    if (i > 0 && u < 1) K.paste(g, Sx, titleBox(Sx, i - 1));
    const s = 1 + 0.08 * (1 - JQ.ease(u)); g.save(); g.translate(1725, 188); g.scale(s, s); g.translate(-1725, -188); K.paste(g, Sx, titleBox(Sx, i), i ? u : 1); g.restore();
  };
  const border = (g, Sx) => {
    const B = 42, out = [[0, 0], [1920, 0], [1920, 1080], [0, 1080]], inn = [[B, B], [B, 1080 - B], [1920 - B, 1080 - B], [1920 - B, B]], sil = new Path2D(); sil.addPath(P(out)); sil.addPath(P(inn));
    piece(g, Sx, sil, p => { p.fillStyle = C.border; p.fillRect(0, 0, 1920, 1080); }, p => {
      saw(p, [[B, B], [1920 - B, B], [1920 - B, 1080 - B], [B, 1080 - B], [B, B]], 10, 10, -1, 0.6);
      const ring = []; for (let x = 60; x < 1880; x += 44) { ring.push([x, B / 2 - 2]); ring.push([x, 1080 - B / 2 + 2]); } for (let y = 82; y < 1010; y += 44) { ring.push([B / 2 - 2, y]); ring.push([1920 - B / 2 + 2, y]); }
      moons(p, ring, 7, -Math.PI / 2, 0.42); }, null, 0);
  };
  const build = (g, Sx) => { K.paper(g); K.sky(g, Sx); K.land(g, Sx); K.water(g, Sx); K.house(g, Sx); K.vine(g, Sx); K.tree(g, Sx); border(g, Sx); };
  // 蚯蚓出: the worm's segments ride a wriggling curve that grows out of the hole; fully out and rearing at 4.000 (beat 3 of bar 2)
  const HOLE = [440, 1010], IMPACT = 4.0;
  const wormSegs = t => {
    const k = JQ.clamp((t - 2.75) / (IMPACT - 2.75)), len = 340 * (1 - (1 - k) * (1 - k)), rear = JQ.smooth(IMPACT - 0.15, IMPACT + 0.2, t), out = [];
    const at = s => { const q = s / 340; return [HOLE[0] - s * 0.07 + Math.sin(s * 0.03 - t * 4.2) * 24 * q, HOLE[1] - s * (0.6 + 0.08 * rear * q) + Math.cos(s * 0.024 - t * 3.1) * 10 * q]; };
    for (let i = 0; i < 16; i++) { const s = len - i * 22; if (s < 4) break; const [x, y] = at(s), [x2, y2] = at(Math.max(0, s - 6)); out.push([x, y, Math.atan2(y - y2, x - x2), i]); }
    return out;
  };
  // the burst of paper snippets thrown up by the worm at the impact; they settle on the ground and stay
  const CHIPS = Array.from({ length: 14 }, (_, i) => { const a = -Math.PI * (0.12 + 0.76 * JQ.hash(i, 1, 77)), v = 160 + 170 * JQ.hash(i, 2, 77); return { a, v, land: HOLE[1] + 2 + 20 * JQ.hash(i, 3, 77), c: [C.ylw, C.mag2, C.grn2, C.blu2][i % 4], r: JQ.hash(i, 4, 77) * 6 }; });
  const chip = (x, y, r, rot) => { const q = new Path2D(); for (let k = 0; k < 3; k++) { const a = rot + k / 3 * TAU; k ? q.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r) : q.moveTo(x + Math.cos(a) * r, y + Math.sin(a) * r); } q.closePath(); return q; };
  const chips = t => { const u = t - IMPACT; if (u < 0) return []; return CHIPS.map(c => { const tt = Math.min(u, 0.9), x = Math.max(70, HOLE[0] + Math.cos(c.a) * c.v * tt * 0.8), y = Math.min(c.land, HOLE[1] - 20 + Math.sin(c.a) * c.v * tt + 520 * tt * tt); return [x, y, 11, c.r + Math.min(u, 0.9) * 9, c.c]; }); };
  const worm = (g, Sx, t) => {
    const segs = wormSegs(t), ch = chips(t); if (!segs.length) return;
    const sil = segs.map(([x, y, a, i]) => JQ.smoothPath(Array.from({ length: 16 }, (_, k) => { const b = k / 16 * TAU, rx = i ? 20 : 22, ry = i ? 16 : 17; return [x + Math.cos(b) * rx * Math.cos(a) - Math.sin(b) * ry * Math.sin(a), y + Math.cos(b) * rx * Math.sin(a) + Math.sin(b) * ry * Math.cos(a)]; })));
    ch.forEach(([x, y, r, rot]) => sil.push(chip(x, y, r, rot)));
    K.pieceB(g, Sx, 's07worm', [200, 700, 500, 360], sil, p => { segs.forEach(([x, y, a, i]) => blob(p, x, y, 20, 16, i % 2 ? C.mag : C.mag2)); blob(p, segs[0][0], segs[0][1], 10, 10, C.pink); ch.forEach(([x, y, r, rot, c]) => blob(p, x, y, r, r, c)); },
      p => segs.forEach(([x, y, a, i]) => { if (i) moons(p, [[x, y]], 8, a, 0.42); }),
      p => { p.strokeStyle = C.blk; p.lineWidth = 2.2; segs.forEach(([x, y, a, i]) => { p.beginPath(); p.ellipse(x, y, i ? 20 : 22, i ? 16 : 17, a, 0, TAU); p.stroke(); }); p.fillStyle = C.blk; const [hx, hy, ha] = segs[0]; p.beginPath(); p.arc(hx + Math.cos(ha) * 8 - Math.sin(ha) * 6, hy + Math.sin(ha) * 8 + Math.cos(ha) * 6, 3, 0, TAU); p.fill(); }, 5);
  };
  // 王瓜生: the gourds on the wall vine redden one after another through bar 3
  const gourds = (g, Sx, t) => {
    const GS = K.GOURDS.map(([x, y], i) => [x, y, JQ.smooth(5.45 + i * 0.42, 6.0 + i * 0.42, t)]);
    K.pieceB(g, Sx, 's07gourd', [1440, 640, 470, 180], GS.map(([x, y]) => K.gourdPath(x, y)), p => GS.forEach(([x, y, r]) => { blob(p, x, y, 26, 42, C.grn); blob(p, x - 6, y - 10, 10, 16, C.grn2); if (r > 0) blob(p, x, y + 44 - r * 60, 30 * Math.min(1, r * 1.6), 26 + r * 40, C.red); if (r > 0.7) blob(p, x - 6, y + 4, 8, 12, C.org); }),
      p => GS.forEach(([x, y]) => willows(p, [[x - 10, y + 6, Math.PI / 2], [x + 10, y + 6, Math.PI / 2]], 30, 0.2)), p => { p.strokeStyle = C.blk; p.lineWidth = 2.2; GS.forEach(([x, y]) => p.stroke(K.gourdPath(x, y))); }, 5);
  };
  Object.assign(K, { title, build, worm, gourds, IMPACT, once });
})();
(function () {
  // 蝼蝈鸣: a paper mole cricket crawls out of its mound at the field edge and chirps; paper sound arcs ripple out on the beats
  const JQ = window.JQ, TAU = Math.PI * 2, K = JQ._s07, { C, saw, moons, willows, blob } = K, P = JQ.P;
  const MC = [1060, 728], SC = 1.3, MOUND = [1150, 750];   // open ground above the pond, clear of the hoeing woman
  const ell = (cx, cy, rx, ry, rot = 0) => Array.from({ length: 20 }, (_, i) => { const a = i / 20 * TAU, x = Math.cos(a) * rx, y = Math.sin(a) * ry; return [cx + x * Math.cos(rot) - y * Math.sin(rot), cy + x * Math.sin(rot) + y * Math.cos(rot)]; });
  const rib = (pts, w0, w1) => K.ribbon(pts, w0, w1);
  // the body in local units (facing left, origin at the thorax), mapped by T
  const cricket = (x, y, wing) => {
    const T = ([u, v]) => [x + u * SC, y + v * SC], M = pts => pts.map(T);
    const wingPts = ell(22, -10, 28, 7, -0.06 - wing).map(([u, v]) => [u, v]);
    return {
      parts: [
        ['leg', rib(M([[24, 8], [56, 22], [86, 26]]), 10 * SC, 3 * SC)], ['leg', rib(M([[-6, 10], [-14, 24], [-26, 32]]), 5 * SC, 3 * SC)],
        ['ant', rib(M([[-50, -6], [-74, -20], [-100, -16]]), 3 * SC, 1.4 * SC)], ['ant', rib(M([[-50, -1], [-80, -4], [-104, 6]]), 3 * SC, 1.4 * SC)],
        ['ant', rib(M([[62, 0], [92, -10]]), 3 * SC, 1.4 * SC)], ['ant', rib(M([[62, 4], [92, 12]]), 3 * SC, 1.4 * SC)],
        ['abd', JQ.smoothPath(M(ell(26, 2, 40, 15)))], ['pro', JQ.smoothPath(M(ell(-16, -3, 22, 16)))], ['head', JQ.smoothPath(M(ell(-42, 0, 12, 10)))],
        ['wing', JQ.smoothPath(M(wingPts))], ['claw', P(M([[-30, 6], [-48, 14], [-68, 12], [-74, 22], [-60, 28], [-38, 20]]))],
      ], T, M };
  };
  const COL = { leg: C.org, ant: C.blk, abd: C.org, pro: C.ylw, head: C.mag, wing: C.blu2, claw: C.mag };
  const drawCricket = (g, Sx, t) => {
    const out = JQ.ease(JQ.clamp((t - 0.1) / 0.6)), x = JQ.lerp(MOUND[0] + 10, MC[0], out), y = JQ.lerp(MOUND[1] - 6, MC[1], out);
    const sing = t > 0.62 && t < 2.62, wing = sing ? 0.22 * Math.abs(Math.sin(t * 37)) : 0.02;
    const B = cricket(x, y, wing), sil = B.parts.map(q => q[1]);
    // the sound: paper arcs leave the cricket on beats 2, 3, 4 of bar 1 and widen out
    const arcs = [];
    const AX = MC[0] - 10, AY = MC[1] - 14;   // the arcs fan upward, away from the woman in the field on the left
    [0.667, 1.333, 2.0, 0.667, 1.333, 2.0].forEach((te, k) => { const age = t - te; if (age < 0 || age > Math.min(1.4, 2.75 - te)) return; const r = 60 + age * 120 + (k > 2 ? 34 : 0), a0 = Math.PI * 1.35, a1 = Math.PI * 1.85, n = 22, w = 16 * (1 - age / 1.9);
      const outer = [], inner = []; for (let i = 0; i <= n; i++) { const a = a0 + (a1 - a0) * i / n; outer.push([AX + Math.cos(a) * (r + w), AY + Math.sin(a) * (r + w)]); inner.push([AX + Math.cos(a) * r, AY + Math.sin(a) * r]); }
      arcs.push({ path: P([...outer, ...inner.reverse()]), r, k, a0, a1, w }); });
    arcs.forEach(q => sil.push(q.path));
    K.pieceB(g, Sx, 's07mc', [880, 380, 470, 420], sil, p => {
      B.parts.forEach(([role, path]) => { p.fillStyle = COL[role]; p.fill(path); });
      const [ax, ay] = B.T([26, 2]); blob(p, ax + 10, ay, 22, 10, C.mag2); const [px, py] = B.T([-16, -3]); blob(p, px, py, 10, 8, C.org);
      arcs.forEach(q => { p.fillStyle = q.k % 2 ? C.mag2 : C.blu; p.fill(q.path); });
    }, p => {
      moons(p, [-2, 1, 4, 7].map(j => { const [u, v] = B.T([10 + j * 9, 6]); return [u, v, -Math.PI / 2]; }), 4.5, -Math.PI / 2, 0.42);
      willows(p, [[...B.T([-16, -4]), 0]], 16, 0.26); saw(p, B.M([[-1, -10], [46, -9]]), 6, 4, 1);
      arcs.forEach(q => { const pts = []; for (let i = 1; i < 8; i++) { const a = q.a0 + (q.a1 - q.a0) * i / 8; pts.push([AX + Math.cos(a) * (q.r + q.w / 2), AY + Math.sin(a) * (q.r + q.w / 2), a + Math.PI / 2]); } moons(p, pts, Math.max(2, q.w * 0.42), 0, 0.42); });
    }, p => { p.strokeStyle = C.blk; p.lineWidth = 2; B.parts.forEach(([role, path]) => { if (role !== 'ant') p.stroke(path); }); p.fillStyle = C.blk; const [ex, ey] = B.T([-46, -3]); p.beginPath(); p.arc(ex, ey, 3, 0, TAU); p.fill(); }, 3);
    // the mound in front: a black paper heap with a sawtooth crown
    const mound = P([[MOUND[0] - 70, MOUND[1] + 10], [MOUND[0] - 56, MOUND[1] - 14], [MOUND[0] - 20, MOUND[1] - 26], [MOUND[0] + 24, MOUND[1] - 24], [MOUND[0] + 62, MOUND[1] - 10], [MOUND[0] + 74, MOUND[1] + 10]]);
    K.pieceB(g, Sx, 's07mound', [MOUND[0] - 90, MOUND[1] - 40, 180, 70], mound, p => { p.fillStyle = C.blk; p.fillRect(MOUND[0] - 90, MOUND[1] - 40, 180, 70); blob(p, MOUND[0], MOUND[1] - 6, 40, 8, '#5A2A2E'); }, p => saw(p, [[MOUND[0] - 54, MOUND[1] + 4], [MOUND[0] + 58, MOUND[1] + 4]], 8, 9, -1), null, 2);
  };

  JQ.ART[7] = {
    key: K.IMPACT, keyHou: JQ.TERMS[6].keyHou,
    focus: [[1060, 728], [440, 900], [1680, 720]],
    frame: true,                                      // the red paper border must not be cropped
    draw(g, t, Sx) {
      t = JQ.clamp(t, 0, 9);
      JQ.blit(g, JQ.cached('s07-back', Sx, K.build));
      drawCricket(g, Sx, t);
      K.gourds(g, Sx, t);
      K.cast(g, Sx, t);                                  // the family (story track), cut in paper
      K.worm(g, Sx, t);
      K.title(g, Sx, t);
    } };
})();
