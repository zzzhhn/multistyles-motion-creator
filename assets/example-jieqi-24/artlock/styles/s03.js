// s03 惊蛰 · 景泰蓝掐丝珐琅 (cloisonné). Every shape is walled by gilt copper wire into small cells and the cells are filled
// with enamel: turquoise first, then coral red, cobalt, white, bright yellow and greens; a glassy glaze with slanting
// reflections and tiny pits; a turquoise ground under sparse scrolling-lotus wire; a gilt-bronze frame like a hanging screen.
// Moment (鹰化为鸠): a heavy gold scrolling vine makes a ring in the sky; a hawk rides the wire once round and comes out a
// turtle-dove. Enamel medallions set in the ring record each stage of the change. 桃始华: pink-white enamel peach blossom.
(function () {
  const JQ = window.JQ, S = JQ.SCENE, L = JQ.L, TAU = Math.PI * 2;
  const E = { tq: '#2A9DB2', tq2: '#55BFCB', tq3: '#8FD8DC', cob: '#1D3F8F', cob2: '#3561B4', cob3: '#6E95D2', red: '#CD3F35', red2: '#E5766A',
    wht: '#F1EDE2', ylw: '#EFBE2E', ylw2: '#F6DA7A', grn: '#2F8A4E', grn2: '#5DAE5C', grn3: '#9BCB72', blk: '#1B1B20', brn: '#7A4528', brn2: '#A0643A',
    pink: '#F4C4C0', pink2: '#E68F94', gold0: '#6A4A12', gold1: '#C8992F', gold2: '#F7E08E' };
  // a gilt cloison wire: dark shoulder, gold body, one bright ridge
  const wire = (g, path, w = 1) => {
    g.lineJoin = 'round'; g.lineCap = 'round';
    g.strokeStyle = E.gold0; g.lineWidth = 5.6 * w; g.stroke(path);
    g.strokeStyle = E.gold1; g.lineWidth = 3.9 * w; g.stroke(path);
    g.save(); g.translate(-0.8 * w, -0.8 * w); g.strokeStyle = E.gold2; g.lineWidth = 1.4 * w; g.stroke(path); g.restore();
  };
  const P = JQ.P, open = JQ.open;
  const ell = (cx, cy, rx, ry, n = 28, a0 = 0) => Array.from({ length: n }, (_, i) => { const a = a0 + i / n * TAU; return [cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]; });
  // enamel fill: flat colour with a slightly paler heart, as fired enamel pools in the middle of a cell
  const enamel = (g, path, col, hi, box) => {
    g.fillStyle = col; g.fill(path);
    if (hi && box) { const [x0, y0, x1, y1] = box, cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, r = Math.max(x1 - x0, y1 - y0) / 2;
      const gr = g.createRadialGradient(cx - r * 0.15, cy - r * 0.2, 0, cx, cy, r); gr.addColorStop(0, JQ.rgba(hi, 0.55)); gr.addColorStop(1, JQ.rgba(hi, 0));
      g.save(); g.clip(path); g.fillStyle = gr; g.fillRect(x0, y0, x1 - x0, y1 - y0); g.restore(); }
  };
  const cell = (g, pts, col, hi, w = 1) => { const p = P(pts); let a = 1e9, b = 1e9, c = -1e9, d = -1e9; pts.forEach(([x, y]) => { a = Math.min(a, x); b = Math.min(b, y); c = Math.max(c, x); d = Math.max(d, y); }); enamel(g, p, col, hi, [a, b, c, d]); wire(g, p, w); return p; };
  const leafPts = (x, y, len, ang, w = 0.36) => { const c = Math.cos(ang), s = Math.sin(ang), out = []; for (let i = 0; i <= 10; i++) { const u = i / 10; out.push([u, Math.sin(u * Math.PI) * w * (1 - u * 0.3)]); } for (let i = 9; i > 0; i--) { const u = i / 10; out.push([u, -Math.sin(u * Math.PI) * w * (1 - u * 0.3)]); } return out.map(([u, v]) => [x + (u * c - v * s) * len, y + (u * s + v * c) * len]); };
  const leaf = (g, x, y, len, ang, col, hi, w = 0.8) => { cell(g, leafPts(x, y, len, ang), col, hi, w); const c = Math.cos(ang), s = Math.sin(ang); wire(g, open([[x + c * len * 0.12, y + s * len * 0.12], [x + c * len * 0.8, y + s * len * 0.8]]), w * 0.7); };
  // a five-petal blossom: each petal its own cell, a yellow heart
  const blossom = (g, x, y, r, col, hi, heart = E.ylw, w = 0.75) => {
    for (let i = 0; i < 5; i++) { const a = i / 5 * TAU - Math.PI / 2; cell(g, ell(x + Math.cos(a) * r * 0.52, y + Math.sin(a) * r * 0.52, r * 0.5, r * 0.5, 16), col, hi, w); }
    cell(g, ell(x, y, r * 0.28, r * 0.28, 12), heart, E.ylw2, w);
  };
  // a lotus seen from the side: three tiers of petals
  const lotus = (g, x, y, r, col, hi) => {
    const pet = (a, k) => { const c = Math.cos(a), s = Math.sin(a); return [[0, 0], [0.28, -0.5], [0, -1], [-0.28, -0.5]].map(([u, v]) => [x + (u * c - v * s) * r * k, y + (u * s + v * c) * r * k]); };
    [-1.0, 1.0, -0.5, 0.5, 0].forEach((a, i) => cell(g, pet(a, i < 2 ? 0.8 : 1), i < 2 ? hi : col, E.wht, 0.75));
    cell(g, [[x - r * 0.5, y], [x + r * 0.5, y], [x + r * 0.3, y + r * 0.22], [x - r * 0.3, y + r * 0.22]], E.grn, E.grn3, 0.75);
  };
  // scrolling vine: a sine stem with spirals, leaves and lotus heads, gold wire on the turquoise ground
  const scroll = (g, x0, y0, len, amp, seed) => {
    const R = JQ.rng(seed), pts = []; for (let s = 0; s <= len; s += 8) pts.push([x0 + s, y0 + Math.sin(s / len * TAU * 2) * amp]);
    wire(g, open(pts), 0.85);
    for (let k = 0; k < 4; k++) {
      const s = (k + 0.5) / 4 * len, x = x0 + s, y = y0 + Math.sin(s / len * TAU * 2) * amp, up = k % 2 ? 1 : -1, sp = [];
      for (let i = 0; i <= 26; i++) { const a = i / 26 * TAU * 1.1, r = 30 * (1 - i / 30); sp.push([x + 10 + Math.cos(a) * r, y + up * (26 - Math.sin(a) * r * up * up)]); }
      wire(g, open(sp), 0.7);
      leaf(g, x - 6, y, 30, up * -1.9 + (R() - 0.5) * 0.4, E.grn, E.grn3, 0.7);
      if (k % 2 === 0) lotus(g, x + 10, y + up * 30 + 12, 26, R() < 0.5 ? E.red : E.ylw, R() < 0.5 ? E.pink : E.wht);
    }
  };
  JQ._s03 = { E, wire, enamel, cell, leaf, leafPts, blossom, lotus, scroll, ell };
})();
(function () {
  const JQ = window.JQ, S = JQ.SCENE, L = JQ.L, TAU = Math.PI * 2, K = JQ._s03, { E, wire, enamel, cell, leaf, blossom, lotus, scroll, ell } = K;
  const P = JQ.P, open = JQ.open, clip = (g, p, fn) => { g.save(); g.clip(p); fn(); g.restore(); };
  // the ridge shifted down: enamel bands inside the mountains, walled by wire, with short wires closing the cells
  const shifted = (pts, dy, k = 1) => pts.map(([x, y]) => [x, y + dy + (JQ.noise(x * 0.01, dy, 5) - 0.5) * 10 * k]);
  const land = g => {
    g.fillStyle = E.tq; g.fillRect(0, 0, JQ.W, 460);
    const gr = g.createLinearGradient(0, 0, 0, 440); gr.addColorStop(0, JQ.rgba(E.tq3, 0)); gr.addColorStop(1, JQ.rgba(E.tq3, 0.45)); g.fillStyle = gr; g.fillRect(0, 0, JQ.W, 460);
    clip(g, P([[0, 0], [1920, 0], ...S.ridge.pts.slice().reverse()]), () => { [[60, 120, 520, 26, 1], [1260, 90, 300, 22, 2], [-120, 300, 700, 20, 3], [1520, 330, 420, 18, 4]].forEach(([x, y, l, a, s]) => scroll(g, x, y, l, a, s)); });
    // mountains: cobalt over paler blues
    const rg = S.ridge.pts, b1 = shifted(rg, 34), b2 = shifted(rg, 70);
    g.fillStyle = E.cob; g.fill(S.mountains.path);
    g.fillStyle = E.cob2; g.fill(P([...b1, [1920, 440], [0, 440]])); g.fillStyle = E.cob3; g.fill(P([...b2, [1920, 440], [0, 440]]));
    [rg, b1, b2].forEach((l, i) => wire(g, open(l), i ? 0.8 : 1.1));
    for (let x = 40; x < 1920; x += 96) { const i = Math.round(x / 14), a = b1[Math.min(b1.length - 1, i)], b = b2[Math.min(b2.length - 1, i)]; if (a && b) wire(g, open([[x, a[1]], [x + 12, b[1]]]), 0.7); }
    g.fillStyle = E.grn; g.fill(S.hills.path); wire(g, open(S.hills.pts.slice(0, -2)), 0.9);
    // ground: green enamel, small wire tufts and coral/white flowers
    g.fillStyle = E.grn2; g.fill(S.ground.path);
    clip(g, S.ground.path, () => { const R = JQ.rng(31); for (let i = 0; i < 110; i++) { const x = 60 + R() * 1800, y = 640 + R() * 400; if (Math.abs(x - 990) < 360 && Math.abs(y - 885) < 130) continue;
      if (i % 3) { const d = i % 2 ? 1 : -1, sp = []; for (let k = 0; k <= 30; k++) { const a = k / 30 * TAU * 1.25 * d, r = 26 * (1 - k / 36); sp.push([x + Math.cos(a) * r, y + Math.sin(a) * r * 0.7]); } sp.unshift([x - 60 * d, y + 14]); wire(g, open(sp), 0.6); } else blossom(g, x, y, 15, i % 2 ? E.wht : E.red2, E.wht, E.ylw, 0.6); } });
    // field: yellow enamel with pale-green strips between furrows, a leaf cell on the wire every so often
    g.fillStyle = E.ylw; g.fill(S.field.path);
    clip(g, S.field.path, () => {
      const fy = (f, x) => { const [p0, p1, p2] = f.pts; return x < p1[0] ? JQ.lerp(p0[1], p1[1], x / p1[0]) : JQ.lerp(p1[1], p2[1], (x - p1[0]) / (p2[0] - p1[0])); };
      S.furrows.forEach((f, k) => { if (k % 2) { const nx = S.furrows[k + 1] || { pts: [[0, 690], [1180, 640], [1920, 590]] }; g.fillStyle = E.ylw2; g.fill(P([...f.pts, ...nx.pts.slice().reverse()])); } });   // fallow loess before the plough: no crop yet
      S.furrows.forEach((f, k) => { wire(g, open(JQ.jitter(JQ.resample(f.pts, 18, false), 3.2, 40 + k, 0.03)), 0.75 * (0.85 + JQ.hash(k, 1, 3) * 0.3));   // hand-bent wire, cells not quite even
        for (let x = 30 + (k % 2) * 45; x < 1920; x += 90) { const j = JQ.hash(x, k, 5), xx = x + (j - 0.5) * 22, y = fy(f, xx) + (JQ.hash(x, k, 6) - 0.5) * 5; for (let q = 0; q < 3; q++) wire(g, open([[xx + q * 7, y], [xx + q * 7 - 3 + j * 6, y - 9 - q * 2]]), 0.42); } });   // last year's stubble
    });
    wire(g, open([[0, 690], [1180, 640], [1920, 590]]), 0.9);
    cell(g, S.path.pts, E.wht, '#FFFFFF', 0.9);
    clip(g, S.path.path, () => { for (let i = 0; i < 9; i++) wire(g, open([[1380, 840 + i * 28], [1700, 820 + i * 28]]), 0.55); });
  };
  const water = g => {
    enamel(g, S.stream.path, E.cob2); clip(g, S.stream.path, () => S.stream.center.forEach(([x, y], i) => { if (i % 5 === 2) wire(g, open([[x - 16, y + 4], [x - 4, y - 6], [x + 10, y + 4]]), 0.55); })); wire(g, S.stream.path, 0.9);
    enamel(g, S.pondRim.path, E.brn2); clip(g, S.pondRim.path, () => { for (let a = 0; a < TAU; a += TAU / 30) { const x = L.pond.cx + Math.cos(a) * 340, y = L.pond.cy + 8 + Math.sin(a) * 124; wire(g, open([[L.pond.cx + Math.cos(a) * 300, L.pond.cy + 8 + Math.sin(a) * 96], [x, y]]), 0.6); } });
    wire(g, S.pondRim.path, 0.9);
    enamel(g, S.pond.path, E.tq, E.tq3, [680, 780, 1300, 980]);
    clip(g, S.pond.path, () => { for (let y = 806; y < 980; y += 30) for (let x = 690 + ((y / 30) % 2) * 50; x < 1310; x += 100) { const p = new Path2D(); p.moveTo(x - 40, y + 8); p.bezierCurveTo(x - 20, y - 14, x + 16, y - 14, x + 22, y); p.arc(x + 12, y, 10, 0, Math.PI * 1.4, false); wire(g, p, 0.6); } });
    wire(g, S.pond.path, 1.1);
    const B = L.bridge; cell(g, S.bridge.pts, E.wht, '#FFFFFF', 1);
    clip(g, S.bridge.path, () => { for (let i = -4; i <= 4; i++) { const a = -Math.PI / 2 + i * 0.3; wire(g, open([[B.cx + Math.cos(a) * (B.half - 18), B.archBase + Math.sin(a) * (B.archBase - B.archTop)], [B.cx + Math.cos(a) * (B.half + 10), B.archBase + Math.sin(a) * (B.archBase - B.archTop + 40)]]), 0.6); } });
    g.fillStyle = E.cob; g.fill(P(S.bridgeArch.pts)); wire(g, open(S.bridgeArch.pts.slice().sort((a, b) => a[0] - b[0])), 0.9);
  };
  const house = g => {
    const H = L.house;
    enamel(g, S.roof.path, E.cob); S.roofLines.forEach(r => wire(g, r.path, 0.5)); wire(g, S.roof.path, 1);
    cell(g, S.houseFront.pts, E.wht, '#FFFFFF', 0.8); [1520, 1610, 1700, 1820].forEach(x => wire(g, open([[x, H.eaveY], [x, H.wallTop]]), 0.6));
    cell(g, S.window.pts, E.blk, null, 0.8); for (let x = 1736; x < 1800; x += 16) wire(g, open([[x, 556], [x, 594]]), 0.5);
    cell(g, S.chimney.pts, E.cob, null, 0.8);
    enamel(g, S.wall.path, E.wht, '#FFFFFF', [1440, 600, 1920, 812]);
    clip(g, S.wall.path, () => { for (let r = 0; r < 7; r++) { const y = 606 + r * 30; wire(g, open(JQ.jitter(JQ.resample([[1440, y], [1920, y]], 24, false), 1.6, r + 70, 0.05)), 0.45); for (let x = 1440 + (r % 2) * 32; x < 1920; x += 64) { const xx = x + (JQ.hash(x, r, 11) - 0.5) * 10; wire(g, open([[xx, y], [xx + (JQ.hash(x, r, 12) - 0.5) * 4, y + 30]]), 0.45); } } });
    cell(g, [[1440, 760], [1920, 760], [1920, 812], [1440, 812]], E.red, E.red2, 0.8);
    clip(g, P([[1440, 760], [1920, 760], [1920, 812], [1440, 812]]), () => { for (let x = 1460; x < 1920; x += 52) blossom(g, x, 786, 13, E.wht, null, E.ylw, 0.5); });
    wire(g, S.wall.path, 1); cell(g, S.wallCap.pts, E.cob, E.cob3, 0.9);
    cell(g, S.gate.pts, E.red, E.red2, 1); for (let j = 0; j < 4; j++) for (let i = 0; i < 3; i++) { g.fillStyle = E.gold0; g.beginPath(); g.arc(1622 + i * 28, 712 + j * 24, 4.6, 0, TAU); g.fill(); g.fillStyle = E.gold1; g.beginPath(); g.arc(1621 + i * 28, 711 + j * 24, 3.2, 0, TAU); g.fill(); }
    wire(g, open([[1650, 694], [1650, 812]]), 0.8); cell(g, S.gateRoof.pts, E.cob, E.cob3, 0.9);
  };
  const tree = g => {
    g.strokeStyle = E.gold0; JQ.drawBranches(g, 1, 1.3); g.strokeStyle = E.gold1; JQ.drawBranches(g, 1, 0.95); g.strokeStyle = E.brn; JQ.drawBranches(g, 1, 0.6);
    enamel(g, S.trunk.path, E.brn, E.brn2, [420, 470, 560, 830]); clip(g, S.trunk.path, () => { for (let i = 0; i < 4; i++) wire(g, open([[448 + i * 12, 830], [470 + i * 8, 700], [458 + i * 9, 600], [478 + i * 6, 480]]), 0.55); }); wire(g, S.trunk.path, 1);
    enamel(g, S.canopy.path, E.grn, E.grn2, [190, 125, 770, 505]); wire(g, S.canopy.path, 1.2);
    clip(g, S.canopy.path, () => { const R = JQ.rng(77); for (let i = 0; i < 46; i++) { const c = S.clumps[i % S.clumps.length], a = R() * TAU, d = R() * c.r * 0.7; leaf(g, c.x + Math.cos(a) * d, c.y + Math.sin(a) * d * 0.8, 46 + R() * 14, R() * TAU, R() < 0.5 ? E.grn2 : E.grn3, E.ylw2, 0.7); } });
    // the peach blossoms are live (桃始华, first bar)
  };
  Object.assign(K, { land, water, house, tree, clip });
})();
(function () {
  const JQ = window.JQ, L = JQ.L, S = JQ.SCENE, TAU = Math.PI * 2, K = JQ._s03, { E, wire, enamel, cell, leaf, blossom, lotus, ell, clip } = K;
  const P = JQ.P, open = JQ.open;
  const COL = { skin: [E.pink, '#FFFFFF'], hair: [E.blk, null], coat: [E.red, E.red2], pants: [E.cob, E.cob3], apron: [E.wht, '#FFFFFF'], scarf: [E.red, E.red2], hat: [E.ylw, E.ylw2], straw: [E.ylw2, '#FFF3C4'], cape: [E.brn2, '#C08050'],
    ox: [E.brn2, '#C68A55'], oxDark: ['#5A3418', E.brn], horn: [E.wht, '#FFFFFF'], calf: ['#C98B55', '#E8B985'], calfDark: [E.brn, E.brn2], prop: [E.brn, E.brn2], metal: ['#8A949C', '#D4DADF'], red: [E.red, E.red2] };
  // the family: every part walled in gilt wire and filled with enamel; the farm woman in cobalt with a white apron and a
  // coral scarf, the child in coral; a lead rope or plough trace is just a gold wire
  const figure = (g, parts, who) => {
    for (const p of parts) {
      if (p.role === 'eye') { g.fillStyle = E.blk; g.fill(p.path); continue; }
      if (p.role === 'line') { wire(g, p.path, 0.4); continue; }
      const c = who === 'woman' && p.role === 'coat' ? [E.cob, E.cob3] : (COL[p.role] || COL[JQ.ROLE_FALLBACK[p.role]] || [E.tq, E.tq3]); let a = 1e9, b = 1e9, cc = -1e9, d = -1e9; p.pts.forEach(([x, y]) => { a = Math.min(a, x); b = Math.min(b, y); cc = Math.max(cc, x); d = Math.max(d, y); });
      enamel(g, p.path, c[0], c[1], [a, b, cc, d]); wire(g, p.path, p.role === 'horn' || p.role === 'hair' || cc - a < 14 ? 0.5 : 0.75);
    }
  };
  // the trunk is redrawn at its own depth (foot at y 830) so the ploughing team at the field edge passes behind it
  const trunk = g => { enamel(g, S.trunk.path, E.brn, E.brn2, [420, 470, 560, 830]); g.save(); g.clip(S.trunk.path); for (let i = 0; i < 4; i++) wire(g, open([[448 + i * 12, 830], [470 + i * 8, 700], [458 + i * 9, 600], [478 + i * 6, 480]]), 0.55); g.restore(); wire(g, S.trunk.path, 1); };
  K.castDraw = (g, C, Sx) => {
    let tr = false; const T = () => { tr = true; JQ.blit(g, JQ.cached('s03-trunk', Sx, trunk)); };
    for (const it of C.items) { if (!tr && it.y >= 830) T(); g.save(); if (it.alpha != null && it.alpha < 1) g.globalAlpha = it.alpha; figure(g, it.parts, it.who); g.restore(); }
    if (!tr) T();
  };
  // gilt-bronze frame: bevelled moulding, a row of raised beads, square corner bosses
  const frame = g => {
    const B = 52, band = (x, y, w, h, vert) => { const gr = vert ? g.createLinearGradient(x, 0, x + w, 0) : g.createLinearGradient(0, y, 0, y + h);
      [[0, '#5C3F0E'], [0.18, '#E9C766'], [0.42, '#B48526'], [0.62, '#F3D985'], [0.85, '#8C651B'], [1, '#4A320A']].forEach(([k, c]) => gr.addColorStop(k, c)); g.fillStyle = gr; g.fillRect(x, y, w, h); };
    band(0, 0, 1920, B, false); band(0, 1080 - B, 1920, B, false); band(0, 0, B, 1080, true); band(1920 - B, 0, B, 1080, true);
    const bead = (x, y) => { const gr = g.createRadialGradient(x - 2, y - 2, 0, x, y, 7); gr.addColorStop(0, '#FFF2B8'); gr.addColorStop(0.5, '#D3A43C'); gr.addColorStop(1, '#5C3F0E'); g.fillStyle = gr; g.beginPath(); g.arc(x, y, 6.5, 0, TAU); g.fill(); };
    for (let x = 80; x < 1850; x += 22) { bead(x, B / 2); bead(x, 1080 - B / 2); } for (let y = 80; y < 1010; y += 22) { bead(B / 2, y); bead(1920 - B / 2, y); }
    [[B / 2, B / 2], [1920 - B / 2, B / 2], [B / 2, 1080 - B / 2], [1920 - B / 2, 1080 - B / 2]].forEach(([x, y]) => { cell(g, [[x - 20, y - 20], [x + 20, y - 20], [x + 20, y + 20], [x - 20, y + 20]], E.tq, E.tq3, 0.9); blossom(g, x, y, 15, E.red, E.red2, E.ylw, 0.55); });
    g.strokeStyle = '#3F2A08'; g.lineWidth = 3; g.strokeRect(B, B, 1920 - 2 * B, 1080 - 2 * B);
  };
  const title = g => {
    const x0 = 1592, y0 = 82, w = 250, h = 236;
    cell(g, [[x0, y0], [x0 + w, y0], [x0 + w, y0 + h], [x0, y0 + h]], E.wht, '#FFFFFF', 1.2); wire(g, P([[x0 + 12, y0 + 12], [x0 + w - 12, y0 + 12], [x0 + w - 12, y0 + h - 12], [x0 + 12, y0 + h - 12]]), 0.7);
    g.textAlign = 'center'; g.textBaseline = 'alphabetic'; g.lineJoin = 'round';
    const write = (str, x, y, font, fill) => { g.font = font; g.fillStyle = fill; g.fillText(str, x, y); g.strokeStyle = E.gold0; g.lineWidth = 3.4; g.strokeText(str, x, y); g.strokeStyle = E.gold1; g.lineWidth = 1.8; g.strokeText(str, x, y); };
    write('惊蛰', x0 + w / 2, y0 + 130, '900 108px "Songti SC", "STSong", serif', E.cob);
    K.houWrite = (g, str, a, b) => { g.save(); g.textAlign = 'center'; g.textBaseline = 'alphabetic'; g.lineJoin = 'round'; g.font = '900 46px "Songti SC", "STSong", serif'; const x = x0 + w / 2, y = y0 + 202;
      if (b > 0) { g.globalAlpha = b; g.fillStyle = E.red; g.fillText(str, x, y); } g.globalAlpha = a; g.strokeStyle = E.gold0; g.lineWidth = 3.4; g.strokeText(str, x, y); g.strokeStyle = E.gold1; g.lineWidth = 1.8; g.strokeText(str, x, y); g.restore(); };
  };
  // glaze: slanting reflections and pits, laid over everything including the moving bird
  const glaze = g => {
    g.save(); g.globalCompositeOperation = 'source-over';
    [[300, 0.07, 160], [760, 0.05, 60], [1240, 0.08, 220], [1700, 0.05, 90]].forEach(([x, a, w]) => { const gr = g.createLinearGradient(x, 0, x + w, 0); gr.addColorStop(0, 'rgba(255,255,255,0)'); gr.addColorStop(0.5, `rgba(255,255,255,${a})`); gr.addColorStop(1, 'rgba(255,255,255,0)');
      g.fillStyle = gr; g.beginPath(); g.moveTo(x + 260, 52); g.lineTo(x + 260 + w, 52); g.lineTo(x + w - 260, 1028); g.lineTo(x - 260, 1028); g.closePath(); g.fill(); });
    const n = document.createElement('canvas'); n.width = 240; n.height = 135; const ng = n.getContext('2d'), im = ng.createImageData(240, 135);
    for (let y = 0; y < 135; y++) for (let x = 0; x < 240; x++) { const v = JQ.fbm(x * 0.09, y * 0.09, 33, 3) - 0.5, o = (y * 240 + x) * 4; im.data[o] = im.data[o + 1] = im.data[o + 2] = v > 0 ? 255 : 0; im.data[o + 3] = Math.abs(v) * 70; }
    ng.putImageData(im, 0, 0); g.imageSmoothingEnabled = true; g.drawImage(n, 0, 0, 1920, 1080);
    const R = JQ.rng(909); for (let i = 0; i < 520; i++) { const x = 60 + R() * 1800, y = 60 + R() * 960, r = 0.8 + R() * 1.6; g.fillStyle = 'rgba(20,30,40,0.45)'; g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill(); g.fillStyle = 'rgba(255,255,255,0.55)'; g.beginPath(); g.arc(x - r * 0.4, y - r * 0.4, r * 0.45, 0, TAU); g.fill(); }
    g.restore();
  };
  Object.assign(K, { figure, frame, title, glaze });
})();
(function () {
  const JQ = window.JQ, L = JQ.L, TAU = Math.PI * 2, K = JQ._s03, { E, wire, enamel, cell, leaf, blossom, lotus, ell } = K;
  const P = JQ.P, open = JQ.open, R = { cx: 1150, cy: 228, rx: 252, ry: 138 };
  // the ring: a heavy gold stem with a thin gold tendril winding round it, enamel leaves and blossoms set on it
  const ring = g => {
    const at = (a, k = 1) => [R.cx + Math.cos(a) * R.rx * k, R.cy + Math.sin(a) * R.ry * k];
    wire(g, P(ell(R.cx, R.cy, R.rx, R.ry, 120)), 2.2);
    wire(g, open(Array.from({ length: 361 }, (_, i) => at(i / 360 * TAU, 1 + Math.sin(i / 360 * TAU * 11) * 0.075))), 0.8);
    for (let i = 0; i < 22; i++) { const a = (i + 0.5) / 22 * TAU, out = i % 2 ? 1.1 : 0.9, [x, y] = at(a, out), n = Math.atan2(y - R.cy, x - R.cx); leaf(g, x, y, 34, n + (i % 2 ? 0.6 : Math.PI - 0.6), i % 3 ? E.grn2 : E.grn, E.grn3, 0.65); }
    [0.3, 1.35, 2.4, 3.45, 4.5, 5.55].forEach((a, i) => { const [x, y] = at(a, 1.0); i % 2 ? blossom(g, x, y, 20, E.pink, '#FFFFFF', E.red, 0.7) : lotus(g, x, y + 12, 26, E.red, E.pink); });
  };
  // the bird in profile, facing +x; m = 0 hawk (hooked bill, yellow eye, barred breast, broad fingered wing, short tail),
  // m = 1 turtle-dove (small head, chequered neck patch, rosy breast, scalloped wing, long white-tipped tail)
  const HB = [[70, -6], [62, -15], [50, -17], [36, -10], [0, -12], [-40, -8], [-78, -12], [-84, 4], [-44, 9], [0, 15], [36, 11], [52, 4], [64, 2]];
  const DB = [[58, -4], [53, -12], [44, -13], [34, -7], [0, -9], [-44, -6], [-104, -7], [-108, 6], [-44, 8], [0, 13], [30, 10], [42, 4], [54, 2]];
  const HW = [[22, -10], [4, -62], [-26, -100], [-58, -104], [-50, -82], [-66, -84], [-52, -64], [-64, -62], [-36, -34], [-18, -8]];
  const DW = [[20, -9], [6, -52], [-24, -86], [-74, -100], [-58, -76], [-62, -72], [-48, -54], [-50, -48], [-30, -28], [-12, -7]];
  const mixPts = (A, B, m, k = 1) => A.map(([x, y], i) => [JQ.lerp(x, B[i][0], m), JQ.lerp(y, B[i][1], m) * k]);
  const bird = (g, x, y, ang, m, s, a, flap = 1) => {
    if (a <= 0.01) return;
    const dir = Math.cos(ang) >= 0 ? 1 : -1, th = dir > 0 ? ang : Math.PI - ang, tilt = JQ.clamp(Math.atan2(Math.sin(th), Math.cos(th)), -0.5, 0.5), w = 0.75 / s;
    g.save(); g.globalAlpha = a; g.translate(x, y); g.scale(dir, 1); g.rotate(tilt); g.scale(s, s);
    const bp = P(mixPts(HB, DB, m, 1.6)), wp = P(mixPts(HW, DW, m).map(([u, v]) => [u, v * (0.55 + 0.45 * flap)]));
    enamel(g, bp, JQ.mix('#5A3418', '#AEB8CC', m));
    g.save(); g.clip(bp);
    g.fillStyle = JQ.mix('#F1EDE2', '#E9A3A0', m); g.beginPath(); g.ellipse(18, 14, 46, 16, 0.05, 0, TAU); g.fill();
    g.globalAlpha = a * (1 - m); for (let k = 0; k < 6; k++) { g.fillStyle = '#5A3418'; g.fillRect(-8 + k * 9, 6, 3.4, 16); }
    g.globalAlpha = a * m; for (let k = 0; k < 4; k++) { g.fillStyle = E.blk; g.fillRect(28 + k * 4, -14, 2.2, 13); g.fillStyle = E.wht; g.fillRect(30.2 + k * 4, -14, 1.8, 13); }
    g.fillStyle = E.wht; g.fillRect(-112, -12, 16, 24); g.restore(); g.globalAlpha = a;
    wire(g, open([[34, -10], [26, 0], [34, 12]]), w * 0.8); wire(g, open([[-40, -6], [-80, -2]]), w * 0.7); wire(g, bp, w);
    const bx = JQ.lerp(70, 58, m), bill = P([[bx - 4, -10], [bx + 12 - m * 6, -8], [bx + 12 - m * 6, 2 - m * 4], [bx + 2, -2]]);
    enamel(g, bill, JQ.mix('#EFBE2E', '#3A3530', m)); wire(g, bill, w * 0.7);
    const eye = P(ell(bx - 14, -8, 5, 5, 12)); enamel(g, eye, JQ.mix('#EFBE2E', '#CD3F35', m)); wire(g, eye, w * 0.6); g.fillStyle = E.blk; g.beginPath(); g.arc(bx - 14, -8, 2.2, 0, TAU); g.fill();
    enamel(g, wp, JQ.mix('#4A2A14', '#CDA680', m));
    g.save(); g.clip(wp);
    g.globalAlpha = a * (1 - m); g.fillStyle = E.blk; g.beginPath(); g.moveTo(-70, -112); g.lineTo(-28, -112); g.lineTo(-54, -60); g.lineTo(-84, -60); g.fill();
    for (let k = 0; k < 5; k++) { g.fillStyle = '#F1EDE2'; g.fillRect(-40 + k * 9, -60 + k * 6, 3, 34); }
    g.globalAlpha = a * m; for (let k = 0; k < 9; k++) { const u = -6 - (k % 3) * 16 - Math.floor(k / 3) * 8, v = -20 - Math.floor(k / 3) * 18; g.fillStyle = '#F4C890'; g.beginPath(); g.arc(u, v, 8, 0, TAU); g.fill(); g.fillStyle = E.blk; g.beginPath(); g.arc(u, v, 4, 0, TAU); g.fill(); }
    g.fillStyle = '#55526A'; g.beginPath(); g.moveTo(-84, -104); g.lineTo(-40, -84); g.lineTo(-50, -60); g.lineTo(-70, -66); g.fill();
    g.restore(); g.globalAlpha = a;
    for (let k = 0; k < 3; k++) wire(g, open([[4 - k * 18, -12], [-24 - k * 18, -70 - k * 6]]), w * 0.6);
    wire(g, wp, w);
    g.restore();
  };
  // a round white-enamel cartouche set into the ring, holding one stage of the change
  const BAR = 8 / 3, IMP = 2 * BAR + 4 / 3, HOU = JQ.TERMS[2].hou, C = L.tree.canopy, leafPts = K.leafPts;
  // a round white-enamel cartouche set into the ring, holding one stage of the change
  const medal = (g, x, y, r) => { const c = new Path2D(); c.arc(x, y, r, 0, TAU); enamel(g, c, E.wht, '#FFFFFF', [x - r, y - r, x + r, y + r]); wire(g, c, 1.1); const c2 = new Path2D(); c2.arc(x, y, r - 8, 0, TAU); wire(g, c2, 0.5); return c; };
  const A0 = -Math.PI / 2 + 0.9, onRing = (p, k = 1) => { const a = A0 + p * TAU; return [R.cx + Math.cos(a) * R.rx * k, R.cy + Math.sin(a) * R.ry * k, Math.atan2(Math.cos(a) * R.ry, -Math.sin(a) * R.rx)]; };
  const T0 = 2 * BAR, T1 = IMP, morph = p => JQ.smooth(0.08, 0.95, p);
  // 桃始华: buds open one by one into five-cell blossoms; the big one in front opens last
  const BLOS = Array.from({ length: 22 }, (_, i) => { const a = JQ.hash(i, 1, 5) * TAU, d = Math.sqrt(JQ.hash(i, 2, 5)) * 0.84; const x = C.cx + Math.cos(a) * C.rx * d, y = C.cy + Math.sin(a) * C.ry * d; return [x, y, 18 + JQ.hash(i, 3, 5) * 6, i, x > 510 && y < 340 ? 2.25 + JQ.hash(i, 4, 5) * 0.3 : 0.2 + JQ.hash(i, 4, 5) * 1.5]; }).concat([[648, 404, 46, 22, 1.85]]);
  const blossoms = (g, t) => BLOS.forEach(([x, y, r, i, ta]) => {
    const k = JQ.ease(JQ.clamp((t - ta) / 0.4)), pink = i % 3 !== 0;
    if (k < 0.04) { cell(g, ell(x, y + 2, r * 0.32, r * 0.42, 12), pink ? E.pink2 : E.pink, '#FFFFFF', 0.6); return; }
    blossom(g, x, y, r * (0.45 + 0.55 * k), pink ? E.pink : E.wht, '#FFFFFF', pink ? E.red : E.pink2, 0.7);
  });
  // 仓庚鸣: an oriole (yellow, black mask and wing) flies in, perches on the canopy edge and sings gold-wire scrolls
  const PERCH = [742, 302];
  const oriole = (g, x, y, s, flap, beak) => {
    g.save(); g.translate(x, y); g.scale(s, s);
    cell(g, [[-30, 6], [-64, 22], [-58, 32], [-24, 14]], E.blk, null, 0.7);
    cell(g, ell(0, 0, 36, 21, 22, -0.25), E.ylw, E.ylw2, 0.8);
    cell(g, ell(30, -20, 16, 15, 16), E.ylw, E.ylw2, 0.8);
    cell(g, [[16, -25], [46, -24], [44, -16], [16, -16]], E.blk, null, 0.5);
    const op = beak * 7; cell(g, [[44, -22], [62, -20 - op], [46, -18]], E.red2, null, 0.5); cell(g, [[44, -18], [60, -15 + op], [44, -14]], E.red2, null, 0.5);
    g.fillStyle = E.wht; g.beginPath(); g.arc(34, -21, 2.4, 0, TAU); g.fill();
    g.save(); g.translate(-4, -10); g.rotate(-flap * 1.3); cell(g, leafPts(0, 0, 52, Math.PI - 0.15, 0.32), E.blk, null, 0.75); cell(g, leafPts(-12, 0, 22, Math.PI - 0.15, 0.25), E.ylw, null, 0.5); g.restore();
    if (flap < 0.05) wire(g, open([[-4, 18], [-8, 30], [4, 30]]), 0.5);
    g.restore();
  };
  const NOTES = [3.45, 3.75, 4.05, 4.35, 4.65, 4.95];
  const song = (g, t) => NOTES.forEach((t0, i) => {
    const u = (t - t0) / 1.7; if (u <= 0 || u >= 1) return;
    const x = PERCH[0] + 96 + u * 250, y = PERCH[1] - 40 - u * 120 + Math.sin(u * 6 + i) * 14, sc = 0.9 + u * 1.3, sp = [];
    for (let j = 0; j <= 26; j++) { const a = j / 26 * TAU * 1.25 * (i % 2 ? 1 : -1), r = 20 * (1 - j / 32) * sc; sp.push([x + Math.cos(a) * r, y + Math.sin(a) * r * 0.8]); }
    sp.unshift([x - 30 * sc, y + 16 * sc]);
    g.save(); g.globalAlpha = 1 - JQ.smooth(0.65, 1, u); wire(g, open(sp), 1.1); leaf(g, x - 22 * sc, y + 10 * sc, 18 * sc, -2.2, E.grn2, E.grn3, 0.6); if (i % 2) blossom(g, x + 4, y + 2, 9 * sc, E.ylw2, '#FFFFFF', E.red, 0.5); g.restore();
  });
  const top = (g, Sx) => { K.glaze(g); K.frame(g); };
  const build = (g, Sx) => { K.land(g); K.water(g); K.house(g); K.tree(g); ring(g); K.title(g); g.save(); g.translate(PERCH[0], PERCH[1]); cell(g, [[-60, 30], [60, 12], [62, 20], [-58, 38]], E.brn, E.brn2, 0.7); g.restore(); };
  // 惊蛰 ploughing: a strip of turned earth along the field's near edge, from where the plough went in to its share now
  const fyB = x => x < 1180 ? JQ.lerp(690, 640, x / 1180) : JQ.lerp(640, 590, (x - 1180) / 740), X0 = 1218;
  const furrow = (g, CA) => {
    const pl = CA.items.find(it => it.kind === 'plow'); if (!pl) return;
    const m = pl.parts.find(p => p.role === 'metal'); if (!m) return;
    const x1 = Math.min(...m.pts.map(q => q[0])); if (x1 >= X0 - 4) return;
    const top = [], bot = []; for (let x = x1; x <= X0; x += 12) { top.push([x, fyB(x) - 42]); bot.push([x, fyB(x) + 3]); } top.push([X0, fyB(X0) - 42]); bot.push([X0, fyB(X0) + 3]);
    const band = P([...top, ...bot.reverse()]); enamel(g, band, '#6A3A1E', E.brn2, [x1, fyB(X0) - 34, X0, fyB(x1) + 4]);
    for (let r = 0; r < 4; r++) { const row = []; for (let x = x1 + 4; x <= X0 - 2; x += 14) row.push([x, fyB(x) - 34 + r * 10 + (JQ.hash(x | 0, r, 3) - 0.5) * 2]); if (row.length > 1) wire(g, open(row), 0.5); }
    wire(g, band, 0.7);
  };
  JQ.ART[3] = { key: IMP, keyHou: JQ.TERMS[2].keyHou, focus: [[520, 320], [PERCH[0] + 60, PERCH[1]], [R.cx, R.cy]], frame: true, draw(g, t, Sx) {
    t = JQ.clamp(t, 0, 9); const h = Math.min(2, Math.floor(t / BAR));
    JQ.blit(g, JQ.cached('s03v3-back', Sx, build));
    const rv = h ? JQ.smooth(h * BAR, h * BAR + 0.5, t) : 1; K.houWrite(g, HOU[h], JQ.smooth(0, 0.5, rv), JQ.smooth(0.4, 1, rv));
    blossoms(g, t);
    // oriole: in at the start of bar two, sings through it, then sits quiet
    if (t > BAR) { const u = JQ.clamp((t - BAR) / 0.65), x = JQ.lerp(120, PERCH[0], JQ.ease(u)), y = JQ.lerp(140, PERCH[1], JQ.ease(u)) - Math.sin(u * Math.PI) * 60;
      const sing = t > 3.4 && t < 5.35 ? Math.max(0, Math.sin((t - 3.4) * Math.PI / 0.35)) : 0; oriole(g, x, y, 1.45, u < 1 ? (Math.sin(t * 16) + 1) / 2 : 0, sing); song(g, t); }
    // the change: the hawk is set at the top of the ring from the start; it rides the wire once round from T0 and is a dove at T1
    const p = JQ.clamp((t - T0) / (T1 - T0));
    [0.25, 0.5, 0.75].forEach(f => { const [x, y] = onRing(f, 0.6), on = t > T0 ? JQ.smooth(f, f + 0.06, p) : 0; if (on < 0.01) return; g.save(); g.globalAlpha = on; const c = medal(g, x, y, 60); g.clip(c); bird(g, x + 8, y + 16, 0, morph(f), 0.54, 1, 0.7); g.restore(); });
    let x, y, a, m = morph(p), flap = (Math.sin(t * 11 + 2.74) + 1) / 2;
    if (t < T0) { [x, y, a] = onRing(0); flap = 0.28 + Math.sin(t * 1.6) * 0.08; }
    else if (t < T1) [x, y, a] = onRing(p);
    else { const u = (t - T1) / 1.8, [sx, sy] = onRing(1); x = JQ.lerp(sx, 1580, u); y = JQ.lerp(sy, 410, u); a = 0.45; m = 1; }
    bird(g, x, y, a, m, 1.25, 1, flap);
    if (t >= T1 && t < T1 + 0.7) { const u = (t - T1) / 0.7; g.save(); g.globalAlpha = 1 - u; wire(g, P(ell(R.cx, R.cy, R.rx * (1.05 + u * 0.22), R.ry * (1.05 + u * 0.22), 90)), 1.6);
      const [bx, by] = onRing(1); for (let k = 0; k < 10; k++) { const an = k / 10 * TAU, r0 = 50 + u * 70; wire(g, open([[bx + Math.cos(an) * r0, by + Math.sin(an) * r0 * 0.7], [bx + Math.cos(an) * (r0 + 34), by + Math.sin(an) * (r0 + 34) * 0.7]]), 0.9); } g.restore(); }
    const CA = JQ.castFor(Sx, t); furrow(g, CA); K.castDraw(g, CA, Sx);
    JQ.blit(g, JQ.cached('s03v2-top', Sx, top));
  } };
})();
