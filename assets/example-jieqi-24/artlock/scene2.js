// 《二十四节气》Art Lock · scene part 2: the old 槐树 and the farmhouse.
(function () {
  const JQ = window.JQ, L = JQ.L, S = JQ.SCENE, P = JQ.P;
  // ---------------------------------------------------------------- the tree
  const T = L.tree, [bx, by] = T.base, [tx, ty] = T.top;
  // trunk: a tapering, slightly twisted column with a flared root
  const tw = y => JQ.lerp(30, 17, JQ.clamp((by - y) / (by - ty)));
  const tl = [], tr = [];
  for (let i = 0; i <= 16; i++) { const k = i / 16, y = JQ.lerp(by, ty, k), x = JQ.lerp(bx, tx, k) + Math.sin(k * 5.2) * 9; const w = tw(y) + (k < 0.12 ? (0.12 - k) * 160 : 0); tl.push([x - w, y]); tr.push([x + w, y]); }
  S.trunk = { pts: [...tl, ...tr.reverse()] };
  // branches: deterministic recursive limbs (x1,y1,x2,y2,w). Bare-tree styles draw all; leafy styles draw the first ~8.
  const br = [], R = JQ.rng(4040);
  const grow = (x, y, ang, len, w, depth) => {
    const x2 = x + Math.cos(ang) * len, y2 = y + Math.sin(ang) * len;
    br.push({ x1: x, y1: y, x2, y2, w, depth });
    if (depth >= 5 || len < 22) return;
    const n = depth < 2 ? 3 : 2;
    for (let i = 0; i < n; i++) { const da = (i - (n - 1) / 2) * (0.62 - depth * 0.04) + (R() - 0.5) * 0.35; grow(x2, y2, ang + da, len * (0.66 + R() * 0.12), w * 0.62, depth + 1); }
  };
  [[-2.35, 150], [-1.85, 175], [-1.35, 160], [-0.85, 150]].forEach(([a, l], i) => grow(tx + (i - 1.5) * 6, ty + 10, a, l, 15, 0));
  S.branches = br;
  // canopy: an outline blob plus clumps (for leafy seasons)
  const C = T.canopy;
  S.canopy = { pts: Array.from({ length: 120 }, (_, i) => { const a = i / 120 * Math.PI * 2, r = 1 + (JQ.fbm(Math.cos(a) * 2 + 5, Math.sin(a) * 2 + 5, 31, 3) - 0.5) * 0.36 + Math.max(0, Math.sin(a * 7)) * 0.05; return [C.cx + Math.cos(a) * C.rx * r, C.cy + Math.sin(a) * C.ry * r]; }) };
  const RC = JQ.rng(777);
  S.clumps = Array.from({ length: 26 }, () => { const a = RC() * Math.PI * 2, d = Math.sqrt(RC()) * 0.78; return { x: C.cx + Math.cos(a) * C.rx * d, y: C.cy + Math.sin(a) * C.ry * d, r: 48 + RC() * 46 }; }).sort((a, b) => a.y - b.y);
  S.trunk.path = P(S.trunk.pts); S.canopy.path = P(S.canopy.pts);
  // draw branches with any stroke style: JQ.drawBranches(g, maxDepth, widthScale)
  JQ.drawBranches = (g, maxDepth = 5, ws = 1) => { g.lineCap = 'round'; for (const b of S.branches) { if (b.depth > maxDepth) continue; g.lineWidth = b.w * ws; g.beginPath(); g.moveTo(b.x1, b.y1); g.lineTo(b.x2, b.y2); g.stroke(); } };
  // tips of the outermost twigs (nest, buds, leaves, magpies)
  S.tips = br.filter(b => b.depth >= 4).map(b => [b.x2, b.y2]);

  // ---------------------------------------------------------------- the farmhouse
  const H = L.house;
  S.wall = { pts: [[H.wallX0, H.wallTop], [H.wallX1, H.wallTop], [H.wallX1, H.wallBot], [H.wallX0, H.wallBot]] };
  S.wallCap = { pts: [[H.wallX0 - 10, H.wallTop - 14], [H.wallX1, H.wallTop - 14], [H.wallX1, H.wallTop + 6], [H.wallX0 - 10, H.wallTop + 6]] };
  S.gate = { pts: [[H.gateX0, H.wallBot], [H.gateX0, H.gateTop + 18], [(H.gateX0 + H.gateX1) / 2, H.gateTop], [H.gateX1, H.gateTop + 18], [H.gateX1, H.wallBot]] };
  S.gateRoof = { pts: [[H.gateX0 - 34, H.gateTop - 6], [(H.gateX0 + H.gateX1) / 2, H.gateTop - 40], [H.gateX1 + 34, H.gateTop - 6], [H.gateX1 + 24, H.gateTop + 4], [H.gateX0 - 24, H.gateTop + 4]] };
  S.houseFront = { pts: [[H.roofX0 + 22, H.eaveY], [H.roofX1 - 10, H.eaveY], [H.roofX1 - 10, H.wallTop], [H.roofX0 + 22, H.wallTop]] };
  // roof with gently upturned ends (a plain northern 硬山 roof, slight curve)
  const roof = [];
  for (let i = 0; i <= 20; i++) { const k = i / 20, x = JQ.lerp(H.roofX0, H.roofX1, k); roof.push([x, H.eaveY - Math.pow(Math.abs(k - 0.5) * 2, 6) * 12]); }
  for (let i = 20; i >= 0; i--) { const k = i / 20, x = JQ.lerp(H.roofX0 + 46, H.roofX1 - 40, k); roof.push([x, H.ridgeY - Math.pow(Math.abs(k - 0.5) * 2, 6) * 8]); }
  S.roof = { pts: roof };
  S.roofLines = Array.from({ length: 22 }, (_, i) => { const k = (i + 0.5) / 22; return { pts: [[JQ.lerp(H.roofX0 + 46, H.roofX1 - 40, k), H.ridgeY + 2], [JQ.lerp(H.roofX0, H.roofX1, k), H.eaveY - 2]] }; });
  S.window = { pts: [[1720, 556], [1800, 556], [1800, 594], [1720, 594]] };
  S.chimney = { pts: [[1560, H.ridgeY + 4], [1560, H.ridgeY - 52], [1590, H.ridgeY - 52], [1590, H.ridgeY + 4]] };
  for (const k of ['wall', 'wallCap', 'gate', 'gateRoof', 'houseFront', 'roof', 'window', 'chimney']) S[k].path = P(S[k].pts);
  S.roofLines.forEach(r => { r.path = JQ.open(r.pts); });
  // smoke rises from the chimney top
  L.smoke = [1575, H.ridgeY - 54];
})();
