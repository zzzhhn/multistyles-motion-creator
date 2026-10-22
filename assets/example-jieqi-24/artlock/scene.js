// 《二十四节气》Art Lock · scene layout contract. One village gate seen all year from the same spot.
// Every style draws THIS layout (same coordinates), so styles can be compared and the film can cross-fade.
// All shapes come as point arrays (pts) plus a ready Path2D (path). Styles may jitter pts for a hand-made line.
(function () {
  const JQ = window.JQ;
  const L = JQ.L = {
    HORIZON: 430,
    pond: { cx: 990, cy: 880, rx: 310, ry: 98 },            // centre stage: fish, otter, clam, ice, mirage
    tree: { base: [470, 830], top: [505, 470], canopy: { cx: 480, cy: 315, rx: 290, ry: 190 } }, // the old 槐树, left
    house: { wallX0: 1440, wallX1: 1920, wallTop: 600, wallBot: 812, gateX0: 1608, gateX1: 1692, gateTop: 676,
             eaveY: 545, ridgeY: 470, roofX0: 1470, roofX1: 1905 },   // farmhouse, right; the wall faces us (crickets)
    bridge: { cx: 1290, deckY: 652, half: 92, archTop: 670, archBase: 718 },
    kid: [372, 1014], ox: [660, 1006],                       // default spots: under the tree, front left
    sky: { y0: 0, y1: 400 },                                 // birds, rainbow, lightning, geese
  };
  const P = pts => { const p = new Path2D(); pts.forEach(([x, y], i) => i ? p.lineTo(x, y) : p.moveTo(x, y)); p.closePath(); return p; };
  const open = pts => { const p = new Path2D(); pts.forEach(([x, y], i) => i ? p.lineTo(x, y) : p.moveTo(x, y)); return p; };
  JQ.P = P; JQ.open = open;
  // jitter a point list deterministically (amp in design px)
  JQ.jitter = (pts, amp, seed = 1, freq = 0.02) => pts.map(([x, y], i) => [x + (JQ.noise(x * freq, y * freq, seed) - 0.5) * 2 * amp, y + (JQ.noise(x * freq + 9, y * freq, seed + 3) - 0.5) * 2 * amp]);
  // resample a polyline to roughly equal steps (so jitter looks even)
  JQ.resample = (pts, step = 12, closed = true) => {
    const out = [], n = pts.length, m = closed ? n : n - 1;
    for (let i = 0; i < m; i++) { const a = pts[i], b = pts[(i + 1) % n], d = Math.hypot(b[0] - a[0], b[1] - a[1]), k = Math.max(1, Math.round(d / step)); for (let j = 0; j < k; j++) out.push([a[0] + (b[0] - a[0]) * j / k, a[1] + (b[1] - a[1]) * j / k]); }
    if (!closed) out.push(pts[n - 1]); return out;
  };
  const ell = (cx, cy, rx, ry, n = 72) => Array.from({ length: n }, (_, i) => { const a = i / n * Math.PI * 2; return [cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]; });

  // ---------------------------------------------------------------- the parts (built once)
  const S = JQ.SCENE = {};
  // far mountains: a ridge, then down to the horizon
  const ridge = [[0, 352], [120, 318], [230, 334], [380, 286], [520, 312], [640, 262], [760, 318], [900, 300], [1010, 334], [1130, 296], [1250, 330], [1380, 244], [1500, 296], [1610, 318], [1730, 268], [1840, 300], [1920, 322]];
  const ridgeFine = JQ.resample(ridge, 14, false).map(([x, y]) => [x, y + (JQ.fbm(x * 0.012, 0, 7, 3) - 0.5) * 26]);
  S.mountains = { pts: [...ridgeFine, [1920, L.HORIZON], [0, L.HORIZON]] };
  S.ridge = { pts: ridgeFine };                               // open line, for ink/edge styles
  // a nearer, lower hill line (second plane)
  const hill = JQ.resample([[0, 400], [260, 376], [520, 392], [820, 368], [1100, 392], [1400, 372], [1700, 386], [1920, 378]], 16, false).map(([x, y]) => [x, y + (JQ.fbm(x * 0.02, 3, 11, 3) - 0.5) * 14]);
  S.hills = { pts: [...hill, [1920, L.HORIZON + 6], [0, L.HORIZON + 6]] };
  // the field: a middle-ground band with furrows that converge slightly to the right
  S.field = { pts: [[0, L.HORIZON], [1920, L.HORIZON], [1920, 590], [1180, 640], [0, 690]] };
  S.furrows = Array.from({ length: 9 }, (_, i) => { const k = (i + 1) / 10; return { pts: [[0, JQ.lerp(L.HORIZON, 690, k)], [1180, JQ.lerp(L.HORIZON, 640, k)], [1920, JQ.lerp(L.HORIZON, 590, k)]] }; });
  // the stream: from the hills down past the bridge into the pond (right side)
  const sc = [[1415, 432], [1380, 500], [1336, 580], [1292, 668], [1262, 744], [1240, 808], [1226, 852]];
  const scF = JQ.resample(sc, 10, false), wAt = i => JQ.lerp(10, 46, i / (scF.length - 1));
  const side = sgn => scF.map(([x, y], i) => { const a = scF[Math.max(0, i - 1)], b = scF[Math.min(scF.length - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], d = Math.hypot(dx, dy) || 1; return [x - dy / d * wAt(i) * sgn, y + dx / d * wAt(i) * sgn]; });
  S.stream = { pts: [...side(1), ...side(-1).reverse()], center: scF };
  // the pond: a slightly irregular ellipse
  S.pond = { pts: ell(L.pond.cx, L.pond.cy, L.pond.rx, L.pond.ry, 96).map(([x, y], i) => { const r = 1 + (JQ.noise(i * 0.35, 0, 21) - 0.5) * 0.06; return [L.pond.cx + (x - L.pond.cx) * r, L.pond.cy + (y - L.pond.cy) * r]; }) };
  S.pondRim = { pts: ell(L.pond.cx, L.pond.cy + 8, L.pond.rx + 26, L.pond.ry + 22, 96) };   // a muddy/stony bank
  // the bridge: one stone arch over the stream
  const B = L.bridge;
  S.bridge = { pts: [[B.cx - B.half - 24, B.deckY + 18], [B.cx - B.half, B.deckY], [B.cx + B.half, B.deckY], [B.cx + B.half + 24, B.deckY + 18], [B.cx + B.half, B.archBase], ...ell(B.cx, B.archBase, B.half - 18, B.archBase - B.archTop, 40).filter(([x, y]) => y <= B.archBase).sort((a, b) => b[0] - a[0]), [B.cx - B.half, B.archBase]] };
  S.bridgeArch = { pts: ell(B.cx, B.archBase, B.half - 18, B.archBase - B.archTop, 40).filter(([x, y]) => y <= B.archBase + 0.1) };
  // the path from the gate down to the bottom edge
  S.path = { pts: [[1630, 812], [1672, 812], [1640, 900], [1590, 990], [1560, 1080], [1400, 1080], [1470, 990], [1560, 900]] };
  // ground below the horizon (everything not field/pond)
  S.ground = { pts: [[0, 600], [1920, 560], [1920, 1080], [0, 1080]] };
  for (const k in S) if (k !== 'furrows') S[k].path = (k === 'ridge') ? open(S[k].pts) : P(S[k].pts);
  S.furrows.forEach(f => { f.path = open(f.pts); });
})();
