// s18 霜降 · 南宋马夏式. Ma Yuan's "one corner": everything heavy is pressed into the lower left (angular rocks in
// axe-cut texture 斧劈皴, the old 槐 drawn lean and hard with long trailing limbs, the child and the ox), and the rest is
// mist and bare silk. Ink is built from many translucent bristle strokes (dry brush leaves 飞白), wet washes are blurred on
// an offscreen layer and eroded by noise; light ochre (淡赭) is the only colour. Mist bands drift across the village.
// Moment (草木黄落, with 豺乃祭兽): after the first frost the ochre leaves of the 槐 let go one layer after another and sink
// into the mist; on the near bank of the pond a dhole lays its catch out in a row.
// Film unit (8 s, one pentad per bar): 候一 豺乃祭兽 — the dhole lays three more kills beside the first, a row of four;
// 候二 草木黄落 (key) — two thin layers of leaves let go, then at 4.0 s the frost comes down (a white rim flashes along the
// rocks and limbs) and all the remaining leaves leave the tree at once into the mist; 候三 蛰虫咸俯 — three insects on
// the near bank crawl one by one into a hole in the earth, and the frost closes over it.
(function () {
  const JQ = window.JQ, S = JQ.SCENE, L = JQ.L, W = JQ.W, H = JQ.H, TAU = Math.PI * 2, HS = L.house;
  const BAR = 8 / 3, IMP = 1 * BAR + 4 / 3, HOU = JQ.TERMS[17].hou;
  const SILK = '#E3D7BD', MOUNT = '#B7C0B6', INK = [24, 20, 16], OCHRE = [158, 104, 58];
  const XK = '"Xingkai SC", "STXingkai", "Kaiti SC", serif';
  if (document.fonts) document.fonts.load(`72px ${XK}`, '霜降草木黄落');
  const ink = a => `rgba(${INK[0]},${INK[1]},${INK[2]},${a})`, och = a => `rgba(${OCHRE[0]},${OCHRE[1]},${OCHRE[2]},${a})`;
  // a brush stroke of K bristles; `dry` makes bristles skip (飞白), more so toward the end of the stroke; `side` > 0 loads
  // one edge of the brush with more ink than the other (侧锋, the side of the brush laid on the silk)
  const brush = (g, pts, w0, w1, tone, dry = 0.25, seed = 1, col = INK, side = 0) => {
    const P = JQ.resample(pts, 3, false), n = P.length; if (n < 2) return;
    const K = Math.max(3, Math.min(24, Math.round(Math.max(w0, w1) / 1.3))), bw = Math.max(w0, w1) / K * 2.7;
    g.lineCap = 'round'; g.lineJoin = 'round';
    for (let b = 0; b < K; b++) {
      const off = (b + 0.5) / K - 0.5, a = Math.min(1, tone * (0.45 + 0.55 * JQ.hash(b, seed, 3)) * (1 + side * 2 * off));
      g.strokeStyle = `rgba(${col[0]},${col[1]},${col[2]},${a})`; g.lineWidth = bw * (0.6 + 0.6 * JQ.hash(b, seed, 4)); g.beginPath(); let pen = false;
      for (let i = 0; i < n; i++) {
        const k = i / (n - 1), A = P[Math.max(0, i - 1)], B = P[Math.min(n - 1, i + 1)], dx = B[0] - A[0], dy = B[1] - A[1], d = Math.hypot(dx, dy) || 1, w = JQ.lerp(w0, w1, k) * (0.75 + 0.5 * Math.sin(Math.PI * Math.min(1, k * 1.3)));
        if (JQ.noise(i * 0.12, b * 1.9, seed) < dry * (0.35 + k) * (0.6 + Math.abs(off) * 1.6)) { pen = false; continue; }
        const x = P[i][0] - dy / d * off * w, y = P[i][1] + dx / d * off * w; pen ? g.lineTo(x, y) : g.moveTo(x, y); pen = true;
      }
      g.stroke();
    }
  };
  const fillA = (g, path, c) => { g.fillStyle = c; g.fill(path); };
  // offscreen: wet layer (blurred, bleeds) and an erosion pass that mottles alpha with noise
  let NOISE = null;
  const noiseCanvas = () => { if (NOISE) return NOISE; const cw = 320, ch = 180, c = document.createElement('canvas'); c.width = cw; c.height = ch; const x = c.getContext('2d'), im = x.createImageData(cw, ch);
    for (let j = 0; j < ch; j++) for (let i = 0; i < cw; i++) { const v = JQ.fbm(i * 0.05, j * 0.05, 77, 4), o = (j * cw + i) * 4; im.data[o + 3] = Math.max(0, Math.min(255, (v - 0.42) * 520)); }
    x.putImageData(im, 0, 0); return (NOISE = c); };
  const wet = (g, Sx, name, blur, erode, fn) => { const X = JQ.layer(name, Sx, { res: 0.5 }); fn(X.g);
    if (erode) { X.g.globalCompositeOperation = 'destination-out'; X.g.globalAlpha = erode; X.g.drawImage(noiseCanvas(), 0, 0, W, H); X.g.globalAlpha = 1; X.g.globalCompositeOperation = 'source-over'; }
    g.filter = `blur(${blur}px)`; JQ.blit(g, X); g.filter = 'none'; };

  // ---------------------------------------------------------------- the corner mass: rocks, the lean old 槐, its trailing limbs
  const ROCKS = [
    [[34, 1060], [40, 900], [80, 800], [160, 726], [246, 742], [300, 800], [326, 880], [304, 960], [262, 1060]],
    [[378, 852], [410, 806], [470, 786], [540, 792], [612, 822], [640, 862], [560, 878], [430, 880]],
    [[250, 1062], [290, 990], [336, 968], [380, 1000], [350, 1062]],
  ].map(p => JQ.jitter(JQ.resample(p, 14, true), 5, 9, 0.05));
  const axeCuts = (g, pts, seed) => {   // 斧劈皴: broad, dry side-brush strokes, steep and angular, darker toward the right
    const xs = pts.map(q => q[0]), ys = pts.map(q => q[1]), x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
    g.save(); g.clip(JQ.P(pts));
    for (let i = 0; i < 13; i++) { const k = JQ.hash(i, seed), x = JQ.lerp(x0, x1, 0.12 + 0.88 * k), y = JQ.lerp(y0, y1, JQ.hash(i, seed + 1)), l = 50 + JQ.hash(i, seed + 2) * 80, a = -1.2 + (JQ.hash(i, seed + 3) - 0.5) * 0.3;
      brush(g, [[x, y], [x + Math.cos(a) * l * 0.55, y + Math.sin(a) * l * 0.55], [x + Math.cos(a + 0.45) * l, y + Math.sin(a + 0.45) * l]], 40 * (0.6 + k), 14, 0.2 + 0.36 * k, 0.72, seed + i, INK, 0.8); }
    g.restore();
  };
  const DROOP = S.branches.filter(b => b.depth === 1).filter((b, i) => i % 3 === 0).map((b, i) => {
    const out = b.x2 < 500 ? -1 : 1, P = [[b.x2, b.y2]]; let x = b.x2, y = b.y2; for (let k = 1; k <= 5; k++) { x += out * (34 - k * 4) + (k % 2 ? 8 : -8) * out; y += 18 + k * 12; P.push([x, y]); } return P; });
  const buildCorner = (g, Sx) => {
    // wet: washes for rocks and trunk, then bled
    wet(g, Sx, 's18w1', 2.5, 0.35, x => { ROCKS.forEach((p, i) => { fillA(x, JQ.P(p), ink(0.16 + i * 0.03)); x.save(); x.clip(JQ.P(p)); fillA(x, JQ.P(p.map(([u, v]) => [u + 40, v + 30])), ink(0.18)); x.restore(); });
      fillA(x, S.trunk.path, ink(0.72)); });
    wet(g, Sx, 's18w7', 1.6, 0.25, x => ROCKS.forEach((p, i) => axeCuts(x, p, 40 + i * 20)));
    ROCKS.forEach((p, i) => { axeCuts(g, p.map(([u, v]) => [u + 6, v + 4]), 140 + i * 20); brush(g, [...p.slice(Math.floor(p.length * 0.6)), ...p.slice(0, Math.floor(p.length * 0.45))], 12, 4, 0.92, 0.35, 60 + i); });
    // trunk: two hard edges, the right one heavier, knots
    const tl = S.trunk.pts.slice(0, 17), tr = S.trunk.pts.slice(17).reverse();
    brush(g, tl, 12, 6, 0.95, 0.4, 71); brush(g, tr, 20, 8, 0.98, 0.35, 72);
    for (let i = 0; i < 4; i++) { const f = 0.3 + i * 0.14, P = tl.map((q, j) => [JQ.lerp(q[0], tr[j][0], f) + Math.sin(j * 1.3 + i) * 3, q[1] - 4]).slice(1, 15); brush(g, P, 6, 2, 0.5, 0.7, 80 + i); }
    for (const b of S.branches) { if (b.depth > 4) continue; const m = [(b.x1 + b.x2) / 2 + (JQ.hash(b.depth, Math.round(b.x1)) - 0.5) * 18, (b.y1 + b.y2) / 2 + (JQ.hash(Math.round(b.y1), 3) - 0.5) * 18];
      brush(g, [[b.x1, b.y1], m, [b.x2, b.y2]], b.w * 1.25 + 2, b.w * 0.7 + 1, 0.92, 0.42, 90 + Math.round(b.x2), INK, 0.6); }
    DROOP.forEach((P, i) => { brush(g, P, 11, 3, 0.95, 0.45, 130 + i, INK, 0.6); P.slice(1, -1).forEach(([x, y], k) => brush(g, [[x, y], [x + (k % 2 ? 16 : -14), y + 10], [x + (k % 2 ? 20 : -20), y + 22]], 4, 1.4, 0.8, 0.3, 150 + i * 9 + k)); });
  };
  // the frost: white dry strokes along the upper edges of the rocks, the limbs and the drooping twigs (shown from 4.0 s)
  const buildFrost = (g, Sx) => { const WH = [250, 248, 240];
    ROCKS.forEach((p, i) => { const top = p.filter(([x, y], j) => { const a = p[(j + p.length - 1) % p.length], b = p[(j + 1) % p.length]; return (b[0] - a[0]) > 0; }); brush(g, top, 9, 4, 0.85, 0.5, 700 + i, WH); });
    for (const b of S.branches) { if (b.depth > 3) continue; brush(g, [[b.x1, b.y1 - b.w * 0.4], [b.x2, b.y2 - b.w * 0.4]], Math.max(2, b.w * 0.32), 1.2, 0.55, 0.5, 720 + Math.round(b.x2), WH); }
    DROOP.forEach((P, i) => brush(g, P.map(([x, y]) => [x, y - 3]), 3.5, 1.2, 0.7, 0.4, 760 + i, WH));
    const R = JQ.rng(1818); for (let i = 0; i < 60; i++) { const x = 40 + R() * 1820, y = 990 + R() * 50; brush(g, [[x, y], [x + 14 + R() * 20, y + (R() - 0.5) * 3]], 3, 1.5, 0.6, 0.5, 780 + i, WH); }
    g.fillStyle = 'rgba(250,248,240,0.9)'; SPROUTS.forEach(([x, y]) => { g.beginPath(); g.arc(x - 3, y - 9, 2.2, 0, TAU); g.arc(x + 4, y - 8, 2.2, 0, TAU); g.fill(); });   // frost on the young wheat
  };
  // 霜降 in the story: the winter wheat is up — rows of small sprouts across the field (frost settles on them at IMP)
  const SPROUTS = []; for (const k of [0.5, 0.64, 0.78, 0.92]) for (let x = 640 + k * 30; x < 1420; x += 26 + (1 - k) * 18) { const e = x < 1180 ? JQ.lerp(690, 640, x / 1180) : JQ.lerp(640, 590, (x - 1180) / 740); SPROUTS.push([x, JQ.lerp(430, e, k)]); }
  const sprouts = g => { g.strokeStyle = 'rgba(70,90,50,0.45)'; g.lineWidth = 2; g.lineCap = 'round'; g.beginPath(); SPROUTS.forEach(([x, y]) => { g.moveTo(x, y); g.lineTo(x - 4, y - 10); g.moveTo(x, y); g.lineTo(x + 4, y - 9); }); g.stroke(); };
  // ---------------------------------------------------------------- the silk, the far peaks, the village half lost in mist
  const silk = g => {
    g.fillStyle = SILK; g.fillRect(0, 0, W, H);
    const cw = 240, ch = 135, c = document.createElement('canvas'); c.width = cw; c.height = ch; const x = c.getContext('2d'), im = x.createImageData(cw, ch);
    for (let j = 0; j < ch; j++) for (let i = 0; i < cw; i++) { const v = JQ.fbm(i * 0.03, j * 0.03, 5, 4), e = Math.max(Math.abs(i / cw - 0.5), Math.abs(j / ch - 0.5)) * 2, o = (j * cw + i) * 4; im.data[o] = 120; im.data[o + 1] = 92; im.data[o + 2] = 56; im.data[o + 3] = Math.max(0, (v - 0.45) * 160 + e * e * 50); }
    x.putImageData(im, 0, 0); g.drawImage(c, 0, 0, W, H);
    g.strokeStyle = 'rgba(110,90,60,0.05)'; g.lineWidth = 1; g.beginPath(); for (let y = 0; y < H; y += 3) { g.moveTo(0, y); g.lineTo(W, y); } g.stroke();
  };
  const MIST = [[350, 46, 0.62, 860, W + 60], [446, 64, 0.66, -60, W + 60], [578, 60, 0.58, 700, W + 60], [748, 40, 0.5, 640, W + 60]];
  const buildBack = (g, Sx) => {
    silk(g);
    // Xia Gui's far peaks: pale wash, bases melting away; only on the open right side
    wet(g, Sx, 's18w2', 5, 0.3, x => { const R = S.ridge.pts.filter(([u]) => u > 760); const P = [...R, [W, 420], [760, 420]]; const gr = x.createLinearGradient(0, 240, 0, 400); gr.addColorStop(0, ink(0.42)); gr.addColorStop(1, ink(0)); x.fillStyle = gr; x.fill(JQ.P(P));
      const R2 = S.hills.pts.filter(([u]) => u > 1100).map(([u, v]) => [u, v - 26]); x.fillStyle = ink(0.12); x.fill(JQ.P([...R2, [W, 440], [1100, 440]])); });
    brush(g, S.ridge.pts.filter(([u]) => u > 1080 && u < 1620), 5, 2, 0.4, 0.5, 5);
    // the field: a few long dry strokes
    S.furrows.forEach((f, i) => { if (i % 2) return; const a = f.pts[0], b = f.pts[1], c = f.pts[2]; brush(g, [[JQ.lerp(a[0], b[0], 0.55), JQ.lerp(a[1], b[1], 0.55)], b, [JQ.lerp(b[0], c[0], 0.6), JQ.lerp(b[1], c[1], 0.6)]], 4, 2, 0.16, 0.6, 11 + i); });
    sprouts(g);
    // farmhouse: wash roof, a firm ridge line, the wall only hinted
    wet(g, Sx, 's18w3', 2, 0.25, x => { fillA(x, S.roof.path, ink(0.3)); fillA(x, S.gate.path, ink(0.42)); fillA(x, S.gateRoof.path, ink(0.4)); fillA(x, S.window.path, ink(0.3)); fillA(x, S.chimney.path, ink(0.3)); fillA(x, S.wall.path, ink(0.05)); });
    brush(g, S.roof.pts.slice(21), 4, 3, 0.6, 0.3, 21); brush(g, S.roof.pts.slice(0, 21), 3, 2, 0.4, 0.35, 22);
    brush(g, [[HS.wallX0, HS.wallTop], [W, HS.wallTop]], 4, 3, 0.35, 0.4, 23); brush(g, [[HS.wallX0, HS.wallTop], [HS.wallX0, HS.wallBot]], 3, 2, 0.3, 0.4, 24);
    // bridge, stream, pond: a few strokes and a pale wash
    brush(g, S.bridgeArch.pts.slice().sort((a, b) => a[0] - b[0]), 3, 3, 0.4, 0.3, 31); brush(g, [[L.bridge.cx - 120, L.bridge.deckY + 16], [L.bridge.cx - 92, L.bridge.deckY], [L.bridge.cx + 92, L.bridge.deckY], [L.bridge.cx + 120, L.bridge.deckY + 16]], 3, 2, 0.45, 0.3, 32);
    brush(g, S.stream.center.slice(0, 18).map(([u, v]) => [u - 14, v]), 2, 1, 0.2, 0.5, 33);
    wet(g, Sx, 's18w4', 4, 0.3, x => { fillA(x, S.pond.path, ink(0.15)); fillA(x, JQ.P(S.pond.pts.map(([u, v]) => [u, v + (v - L.pond.cy) * -0.4 - 20])), ink(0.06)); });
    [[760, 860, 1020], [900, 900, 1180], [1040, 940, 1260]].forEach(([x0, y, x1], i) => brush(g, [[x0, y], [x1, y + 4]], 2.4, 1, 0.3, 0.5, 41 + i));
    brush(g, S.pond.pts.slice(8, 44), 4, 2, 0.45, 0.5, 44); brush(g, S.pond.pts.slice(56, 90), 3, 1.5, 0.3, 0.6, 45);
  };
  const buildMist = (g, Sx) => wet(g, Sx, 's18w5', 18, 0, x => { MIST.forEach(([y, h, a, x0, x1]) => { x.fillStyle = `rgba(242,236,222,${a})`; x.beginPath(); x.ellipse((x0 + x1) / 2, y, (x1 - x0) / 2, h, 0, 0, TAU); x.fill(); }); });
  // the family (story track) in reduced brushwork, painted per frame: pale washes bled on a half-size layer, then each part
  // outlined with a side-loaded bristle brush; hair, shoes and eyes in dark ink
  const TONE = { skin: och(0.14), hair: ink(0.85), coat: och(0.5), pants: ink(0.4), apron: och(0.28), scarf: ink(0.35), hat: ink(0.35), straw: och(0.42), cape: och(0.4), eye: ink(0.9),
    ox: ink(0.22), oxDark: ink(0.6), horn: 'rgba(240,232,214,0.95)', calf: och(0.3), calfDark: ink(0.45), prop: ink(0.55), metal: ink(0.7), red: 'rgba(178,48,36,0.8)', line: ink(0.8) };
  const castWash = (g, Sx, items) => {
    wet(g, Sx, 's18w6', 3, 0.25, x => { for (const it of items) { x.globalAlpha = it.alpha == null ? 1 : it.alpha; for (const p of it.parts) { const c = TONE[p.role] || JQ.roleColor(TONE, p.role); if (c) fillA(x, p.path, c); } } x.globalAlpha = 1; });
    items.forEach((it, k) => { const s = JQ.STORY_S(it.y || 1000); it.parts.forEach((p, i) => { if (p.role === 'eye' || p.role === 'hair' || p.role === 'line') { fillA(g, p.path, ink(p.role === 'line' ? 0.75 : 0.88)); return; }
      const big = p.role === 'ox' || p.role === 'calf', w = (big ? 7 : 4.6) * s; brush(g, [...p.pts, p.pts[0]], w, w * 0.36, big ? 0.85 : 0.78, 0.38, 200 + k * 40 + i, INK, 0.7);
      if (it.kind === 'stack') { const xs = p.pts.map(q => q[0]), ys = p.pts.map(q => q[1]), x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);   // dry straw strokes
        g.save(); g.clip(p.path); for (let j = 0; j < 16; j++) { const x = JQ.lerp(x0, x1, (j + 0.5) / 16), lean = (x - (x0 + x1) / 2) * 0.25; brush(g, [[x - lean * 0.2, y0], [x + lean, y1]], 6, 3, 0.5, 0.6, 260 + j, OCHRE); brush(g, [[x + 6, y0 + 20], [x + 6 + lean, y1]], 3, 1.5, 0.45, 0.55, 280 + j); } g.restore(); } }); });
  };
  // 霜降 in the story: the woman sweeps the fallen leaves (x 300 → 560 from 1.0 s), pushing them into a heap ahead of the broom
  const GROUND = Array.from({ length: 110 }, (_, i) => ({ x: 250 + JQ.hash(i, 1, 320) * 560, y: 994 + JQ.hash(i, 2, 320) * 52, r: 5 + JQ.hash(i, 3, 320) * 4, rot: JQ.hash(i, 4, 320) * 3, a: 0.35 + 0.4 * JQ.hash(i, 5, 320) }));
  const groundLeaves = (g, w, t) => {
    const front = t < 1.0 || !w ? 0 : w.x + 58 * w.dir; let swept = 0;
    for (const f of GROUND) { if (front && f.x < front) { swept++; continue; } g.fillStyle = och(f.a); g.beginPath(); g.ellipse(f.x, f.y, f.r, f.r * 0.5, f.rot, 0, TAU); g.fill(); }
    if (swept) { const hx = front + 22, n = Math.min(40, swept); for (let i = 0; i < n; i++) { const a = JQ.hash(i, 6, 320) * Math.PI, d = Math.sqrt(JQ.hash(i, 7, 320)) * (12 + n * 0.9);
      g.fillStyle = och(0.4 + 0.35 * JQ.hash(i, 8, 320)); g.beginPath(); g.ellipse(hx + Math.cos(a) * d, 1024 - Math.sin(a) * d * 0.45, 6, 3.2, JQ.hash(i, 9, 320) * 3, 0, TAU); g.fill(); } }
  };
  // ---------------------------------------------------------------- the leaves: ochre dabs in four layers that let go in turn
  const LEAVES = (() => { const out = [], src = [...S.tips, ...DROOP.flatMap(P => P.slice(3))];
    src.forEach(([x, y], i) => { for (let j = 0; j < (i % 3 ? 2 : 3); j++) { const h = JQ.hash(i, j, 300); out.push({ x: x + (JQ.hash(i, j, 301) - 0.5) * 34, y: y + (JQ.hash(i, j, 302) - 0.5) * 24, r: 5 + JQ.hash(i, j, 303) * 5, rot: JQ.hash(i, j, 304) * 3, a: 0.36 + 0.4 * JQ.hash(i, j, 305), k: Math.floor(h * 4), d: JQ.hash(i, j, 306) * 0.35, ph: JQ.hash(i, j, 307) * 6 }); } });
    return out; })();
  // a few early leaves drift down in the first bar; layer 0 lets go at 2.75 s, layer 1 at 3.35 s, and layers 2–3 (half
  // the crown) burst off together when the frost comes down at IMP, thrown outward and carried right into the mist
  const relT = f => f.early ? 0.3 + f.d * 6 : f.k === 0 ? 2.75 + f.d * 0.5 : f.k === 1 ? 3.35 + f.d * 0.45 : IMP - 0.04 + f.d * 0.12;
  LEAVES.forEach((f, i) => { f.early = JQ.hash(i, 9, 308) < 0.07; f.out = (f.x - 470) / 300; });
  const leaves = (g, t) => {
    for (const f of LEAVES) {
      const T = relT(f), burst = !f.early && f.k >= 2, dur = burst ? 1.25 : 1.6, p = JQ.clamp((t - T) / dur), q = p * p;
      if (p >= 1) continue; const a = f.a * (p > 0 ? 1 - JQ.smooth(0.3, 1, p) : 1); if (a <= 0.01) continue;
      const fall = q * (930 - f.y) * 0.75, x = f.x + Math.sin(p * 5 + f.ph) * 22 * p + p * (burst ? 260 : 60) + (burst ? Math.sqrt(p) * f.out * 90 : 0), y = f.y + fall - (burst ? Math.sin(Math.min(1, p * 3) * Math.PI) * 30 : 0);
      g.fillStyle = och(a); g.beginPath(); g.ellipse(x, y, f.r, f.r * 0.55, f.rot + p * (burst ? 9 : 4), 0, TAU); g.fill();
      g.fillStyle = och(a * 0.45); g.beginPath(); g.ellipse(x + 2, y + 1, f.r * 0.6, f.r * 0.35, f.rot + p * 4, 0, TAU); g.fill();
    }
  };
  // ---------------------------------------------------------------- the dhole and its row of catch on the near bank
  const JX = 1580, JY = 1036, DROPS = [0.5, 1.2, 1.9], SLOTS = [1080, 1180, 1280, 1380];   // the row sits right of the calf (story: 950, 1014)
  const dhole = (g, dip) => {
    g.save(); g.translate(JX, JY); g.scale(-1, 1);              // faces left (toward the row)
    const body = JQ.smoothPath([[-70, -64], [-20, -74], [40, -72], [70, -64], [80, -44], [60, -34], [0, -32], [-56, -36], [-80, -48]]);
    [[-1.5, 1, 0.26], [1.5, -1, 0.26], [0, 0, 0.3]].forEach(([dx, dy, a]) => { g.save(); g.translate(dx, dy); fillA(g, body, och(a)); g.restore(); }); fillA(g, JQ.smoothPath([[-70, -64], [-20, -74], [40, -72], [70, -64], [40, -60], [-30, -62]]), ink(0.3));
    brush(g, [[-80, -50], [-70, -66], [-20, -76], [40, -73], [70, -64]], 4, 2, 0.8, 0.3, 501);
    brush(g, [[-78, -56], [-104, -50], [-124, -30], [-132, -14]], 16, 6, 0.85, 0.4, 502);             // bushy dark tail
    [[-56, -38, -60, 0], [-40, -36, -36, 0], [44, -38, 48, 0], [60, -40, 66, 0]].forEach(([a, b, c, d], i) => brush(g, [[a, b], [(a + c) / 2 + 4, (b + d) / 2], [c, d]], 6, 4, 0.7, 0.2, 510 + i));
    g.save(); g.translate(72, -62); g.rotate(0.3 + dip * 0.7);
    const head = JQ.smoothPath([[-6, -14], [16, -20], [30, -10], [54, 0], [30, 8], [4, 10], [-8, 2]]); fillA(g, head, och(0.65)); brush(g, [[-6, -14], [16, -20], [54, 0], [30, 8]], 2.6, 1.6, 0.8, 0.2, 520);
    fillA(g, JQ.P([[4, -16], [10, -34], [18, -18]]), ink(0.7)); g.fillStyle = ink(0.9); g.beginPath(); g.arc(22, -8, 2.6, 0, TAU); g.fill(); g.beginPath(); g.arc(54, 0, 3, 0, TAU); g.fill();
    g.restore(); g.restore();
  };
  // the catch, drawn at 1.9× in local coordinates: a hare (kind 0) or a pheasant (kind 1), laid on its side
  const prey = (g, x, y, kind, a, s) => {
    g.save(); g.globalAlpha = a; g.translate(x, y); g.scale(1.9, 1.9);
    if (kind) { fillA(g, JQ.smoothPath([[-26, -4], [-10, -18], [16, -16], [26, -6], [10, 2], [-20, 2]]), ink(0.34)); brush(g, [[16, -16], [30, -36], [34, -40]], 3, 1.5, 0.7, 0.3, 600 + s); brush(g, [[-24, -6], [-50, -14], [-60, -12]], 3, 1, 0.6, 0.3, 604 + s); brush(g, [[12, -16], [20, -38]], 3, 1.5, 0.6, 0.3, 601 + s); }
    else { fillA(g, JQ.smoothPath([[-24, -6], [-4, -16], [20, -12], [26, -4], [4, 2], [-22, 0]]), och(0.5)); brush(g, [[-22, -4], [-46, -10]], 4, 1.5, 0.75, 0.3, 602 + s); fillA(g, JQ.P([[24, -8], [34, -6], [24, -2]]), ink(0.75)); g.fillStyle = ink(0.9); g.beginPath(); g.arc(18, -9, 1.6, 0, TAU); g.fill(); }
    brush(g, [[-24, 2], [24, 2]], 1.5, 1.5, 0.4, 0.4, 603 + s); g.restore();
  };
  // 候三: three insects on the near bank crawl into a hole one by one; the hole frosts over
  const HOLE = [1430, 930], BUGS = [{ x: 1520, y: 880, t0: 2 * BAR + 0.1, t1: 2 * BAR + 1.0, cricket: 0 }, { x: 1300, y: 954, t0: 2 * BAR + 0.5, t1: 2 * BAR + 1.6, cricket: 1 }, { x: 1630, y: 908, t0: 2 * BAR + 1.0, t1: 2 * BAR + 2.0, cricket: 0 }];
  const bug = (g, x, y, ang, s, cricket, step) => {
    g.save(); g.translate(x, y); g.rotate(ang); g.scale(s, s); g.lineCap = 'round';
    if (cricket) { g.strokeStyle = ink(0.85); g.lineWidth = 1.6; g.beginPath(); g.moveTo(16, -4); g.quadraticCurveTo(40, -24, 62, -18); g.moveTo(16, -2); g.quadraticCurveTo(44, -10, 64, -2); g.stroke();
      g.lineWidth = 2.6; g.beginPath(); g.moveTo(-6, 2); g.lineTo(-22 + step * 4, -14); g.lineTo(-34, 6); g.moveTo(4, 4); g.lineTo(0 - step * 3, 12); g.moveTo(10, 4); g.lineTo(16 + step * 3, 12); g.stroke();
      fillA(g, JQ.smoothPath([[-30, 0], [-14, -8], [8, -8], [18, -2], [8, 6], [-20, 6]]), ink(0.82)); fillA(g, JQ.smoothPath([[-24, -4], [-6, -9], [8, -6], [-10, -2]]), och(0.55)); }
    else { g.strokeStyle = ink(0.85); g.lineWidth = 2; g.beginPath(); for (const d of [-6, 0, 6]) { g.moveTo(d, 0); g.lineTo(d - 4 + step * (d === 0 ? -3 : 3), 9); } g.moveTo(10, -2); g.lineTo(18, -9); g.stroke();
      fillA(g, JQ.smoothPath([[-12, 0], [-8, -9], [6, -9], [12, -1], [4, 4], [-8, 4]]), ink(0.85)); g.fillStyle = 'rgba(240,232,214,0.6)'; g.fillRect(-6, -7, 8, 1.5); }
    g.restore();
  };
  const insects = (g, t) => {
    // the mound and the hole: a pale wash, a few dry strokes, a dark mouth
    fillA(g, JQ.smoothPath([[HOLE[0] - 90, HOLE[1] + 22], [HOLE[0] - 40, HOLE[1] - 14], [HOLE[0] + 44, HOLE[1] - 16], [HOLE[0] + 96, HOLE[1] + 22]]), och(0.22));
    brush(g, [[HOLE[0] - 92, HOLE[1] + 20], [HOLE[0] - 40, HOLE[1] - 12], [HOLE[0] + 40, HOLE[1] - 14], [HOLE[0] + 96, HOLE[1] + 20]], 4, 2, 0.6, 0.45, 820, INK, 0.5);
    fillA(g, JQ.smoothPath([[HOLE[0] - 24, HOLE[1] + 6], [HOLE[0] - 10, HOLE[1] - 4], [HOLE[0] + 14, HOLE[1] - 4], [HOLE[0] + 26, HOLE[1] + 6], [HOLE[0], HOLE[1] + 11]]), ink(0.85));
    BUGS.forEach((b, i) => { const p = JQ.clamp((t - b.t0) / (b.t1 - b.t0)), e = JQ.smooth(0, 1, p), x = JQ.lerp(b.x, HOLE[0], e), y = JQ.lerp(b.y, HOLE[1] + 2, e), go = JQ.smooth(0.82, 1, p);
      if (go >= 1) return; const ang = Math.atan2(HOLE[1] - b.y, HOLE[0] - b.x), step = p > 0 && p < 1 ? Math.sin(t * 22 + i) : 0;
      g.save(); g.globalAlpha = 1 - go; bug(g, x, y, ang, (b.cricket ? 1.8 : 2.4) * (1 - go * 0.6), b.cricket, step); g.restore(); });
    const fr = JQ.smooth(2 * BAR + 2.1, 2 * BAR + 2.5, t); if (fr > 0) { g.globalAlpha = fr; brush(g, [[HOLE[0] - 28, HOLE[1] + 3], [HOLE[0], HOLE[1] - 2], [HOLE[0] + 28, HOLE[1] + 4]], 10, 5, 0.85, 0.4, 830, [250, 248, 240]); g.globalAlpha = 1; }
  };
  const writeIn = (g, t) => {          // the pentad column, brushed in character by character at the start of its bar
    const i = Math.min(2, Math.floor(t / BAR)), lt = t - i * BAR; g.fillStyle = ink(0.82); g.textAlign = 'center'; g.textBaseline = 'top'; g.font = `46px ${XK}`;
    if (i > 0 && lt < 0.18) { g.globalAlpha = 1 - lt / 0.18; JQ.vtext(g, HOU[i - 1], 1726, 100, 54); }
    const k = i === 0 ? HOU[0].length : JQ.clamp((lt - 0.12) / 0.7) * HOU[i].length;
    [...HOU[i]].forEach((ch, j) => { const a = JQ.clamp(k - j); if (a <= 0) return; g.globalAlpha = a; g.fillText(ch, 1726, 100 + j * 54 + (1 - a) * 6); });
    g.globalAlpha = 1;
  };
  // the mounting and the inscription (cached)
  const buildFront = g => {
    g.fillStyle = MOUNT; g.beginPath(); g.rect(0, 0, W, H); g.rect(34, 34, W - 68, H - 68); g.fill('evenodd');
    g.strokeStyle = 'rgba(70,74,66,0.55)'; g.lineWidth = 2; g.strokeRect(34, 34, W - 68, H - 68); g.strokeStyle = 'rgba(255,255,255,0.25)'; g.lineWidth = 1; g.strokeRect(10, 10, W - 20, H - 20);
    g.fillStyle = ink(0.82); g.textAlign = 'center'; g.textBaseline = 'top';
    g.font = `76px ${XK}`; JQ.vtext(g, '霜降', 1800, 92, 86);
    g.fillStyle = 'rgba(178,48,36,0.88)'; g.fillRect(1772, 278, 54, 54); g.fillStyle = SILK; g.font = `600 22px "Songti SC", serif`; JQ.vtext(g, '霜降', 1799, 282, 24);
  };

  JQ.ART[18] = {
    key: IMP, keyHou: JQ.TERMS[17].keyHou, focus: [[1380, 990], [480, 330], [1430, 930]], frame: true,
    draw(g, t, Sx) {
      JQ.blit(g, JQ.cached('s18back', Sx, buildBack));
      const M = JQ.cached('s18mist', Sx, buildMist); g.drawImage(M.c, Math.sin(t / 8 * TAU) * 30, 0, W, H);
      JQ.blit(g, JQ.cached('s18corner', Sx, buildCorner));
      // 候二: the frost comes down at IMP — a white flash along rocks, limbs and the young wheat, then it stays
      const fk = JQ.smooth(IMP - 0.05, IMP + 0.08, t); if (fk > 0) { g.globalAlpha = fk; JQ.blit(g, JQ.cached('s18frost', Sx, buildFrost)); g.globalAlpha = 1; }
      const CS = JQ.castFor(Sx, t);
      groundLeaves(g, CS.state.woman, t);
      castWash(g, Sx, CS.items);
      leaves(g, t);
      const fl = t > IMP - 0.05 ? Math.exp(-Math.pow((t - IMP) / 0.25, 2)) : 0;
      if (fl > 0.01) { const gr = g.createRadialGradient(400, 600, 50, 400, 600, 700); gr.addColorStop(0, `rgba(252,250,244,${0.35 * fl})`); gr.addColorStop(1, 'rgba(252,250,244,0)'); g.fillStyle = gr; g.fillRect(0, 0, 1200, 1080); }
      // 候一: the dhole lays its kills out in a row on the near bank, right of the calf
      const dip = DROPS.reduce((m, d) => Math.max(m, Math.exp(-Math.pow((t - d) / 0.22, 2))), 0);
      prey(g, SLOTS[0], JY + 2, 1, 1, 0);
      DROPS.forEach((d, i) => { const k = JQ.smooth(d - 0.08, d + 0.22, t); if (k > 0.01) prey(g, JQ.lerp(JX - 150, SLOTS[i + 1], k), JY + 2 - Math.sin(k * Math.PI) * 18, i % 2 ? 1 : 0, Math.min(1, k * 3), i + 1); });
      dhole(g, dip);
      insects(g, t);
      JQ.blit(g, JQ.cached('s18front', Sx, buildFront));
      writeIn(g, t);
    },
  };
})();
