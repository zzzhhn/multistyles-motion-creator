// s24 大寒 · 冰梅纹. Paper white and indigo only, like blue-and-white ware and blue-print cloth. The scene is a quiet
// indigo line drawing; then (水泽腹坚) the pond ice cracks and the cracks run out of the pond across the whole picture,
// straight-cut and meeting at odd angles, thickening into a 冰裂纹 window lattice with white plum blossoms at the joins.
// Behind the lattice the hen at the gate hatches her chicks (鸡乳); a falcon streaks across the sky (征鸟厉疾).
// Unit (8 s = 3 bars, one pentad per bar): 鸡乳 the eggs under the hen crack and the chicks come out; 征鸟厉疾 a falcon stoops
// out of the upper left, bottoms out over the field on beat 3 of bar 2 and climbs away; 水泽腹坚 (key) the pond cracks, thin
// cracks race over the whole picture, and on beat 3 (6.667 s) every crack locks into a thick 冰梅 window lattice while the pond
// ice turns solid; plum buds set at the joins and the picture comes to rest (ice at its thickest, plum about to open), which is
// where 立春 will grow from. The child and the ox sit in an oval opening (开光) of the lattice so the bars never cut them.
(function () {
  const JQ = window.JQ, S = JQ.SCENE, L = JQ.L, W = JQ.W, H = JQ.H, TAU = Math.PI * 2;
  const BAR = 8 / 3, IMP = 2 * BAR + 4 / 3, HOU = JQ.TERMS[23].hou;
  const PAPER = '#F4F0E6', IND = '#1E3A68', IND2 = '#3E62A0', WASH = '#C8D6E8', WASH2 = '#9DB4D2', COB = [43, 79, 140];
  const KAI = '"Kaiti SC", "STKaiti", serif';
  if (document.fonts) document.fonts.load(`84px ${KAI}`, '大寒水泽腹坚');
  const ink = (g, path, fill, lw = 2.4, col = IND) => { if (fill) { g.fillStyle = fill; g.fill(path); } if (lw) { g.strokeStyle = col; g.lineWidth = lw; g.lineJoin = 'round'; g.lineCap = 'round'; g.stroke(path); } };

  // ---------------------------------------------------------------- the quiet blue-and-white scene (cached)
  const buildScene = g => {
    g.fillStyle = PAPER; g.fillRect(0, 0, W, H);
    // sky: a few horizontal 'dyed' bands of wash, like resist cloth
    [[70, 0.1], [130, 0.07], [190, 0.05]].forEach(([y, a]) => { g.fillStyle = JQ.rgba('#3E62A0', a); g.fillRect(0, y, W, 34); });
    ink(g, S.mountains.path, WASH2, 0); g.save(); g.clip(S.mountains.path);
    for (let k = 1; k < 6; k++) { g.strokeStyle = JQ.rgba('#1E3A68', 0.35); g.lineWidth = 1.4; g.stroke(JQ.open(S.ridge.pts.map(([x, y]) => [x, y + k * 16]))); }
    g.restore(); ink(g, S.ridge.path, null, 3);
    ink(g, S.hills.path, WASH, 2);
    ink(g, S.field.path, PAPER, 2); S.furrows.forEach((f, i) => ink(g, f.path, null, i % 2 ? 1.2 : 2, IND2));
    ink(g, S.path.path, null, 1.6, IND2);
    ink(g, S.stream.path, WASH, 2);
    ink(g, S.pondRim.path, null, 1.6, IND2); ink(g, S.pond.path, WASH, 3);
    g.save(); g.clip(S.pond.path); g.strokeStyle = 'rgba(255,255,255,0.9)'; g.lineWidth = 5; g.beginPath(); g.moveTo(760, 850); g.lineTo(1010, 832); g.moveTo(1040, 900); g.lineTo(1200, 890); g.stroke(); g.restore();
    ink(g, S.bridge.path, PAPER, 2.4); S.bridgeArch.pts.forEach(([x, y], i) => { if (i % 5 === 2) ink(g, JQ.open([[x, y], [L.bridge.cx + (x - L.bridge.cx) * 1.3, y - 22]]), null, 1.2); });
    ink(g, S.roof.path, IND, 2); S.roofLines.forEach((r, i) => { if (i % 2) ink(g, r.path, null, 1.2, WASH); });
    g.strokeStyle = PAPER; g.lineWidth = 5; g.beginPath(); g.moveTo(1520, 474); g.lineTo(1866, 474); g.stroke();
    ink(g, S.houseFront.path, PAPER, 2); ink(g, S.window.path, WASH, 2); ink(g, S.chimney.path, IND, 2);
    ink(g, S.wall.path, PAPER, 2.4); g.save(); g.clip(S.wall.path);
    for (let y = 620, r = 0; y < 812; y += 18, r++) { g.strokeStyle = JQ.rgba('#3E62A0', 0.5); g.lineWidth = 1; g.beginPath(); g.moveTo(1440, y); g.lineTo(W, y); g.stroke(); for (let x = 1440 + (r % 2) * 22; x < W; x += 44) { g.beginPath(); g.moveTo(x, y - 18); g.lineTo(x, y); g.stroke(); } }
    g.restore(); ink(g, S.wallCap.path, IND, 0); ink(g, S.gate.path, IND, 0); ink(g, S.gateRoof.path, IND, 0);
    g.strokeStyle = IND; JQ.drawBranches(g, 5, 0.8); ink(g, S.trunk.path, IND, 0);
    g.strokeStyle = PAPER; g.lineWidth = 2; for (let i = 0; i < 3; i++) { g.beginPath(); for (let j = 0; j <= 8; j++) { const y = JQ.lerp(800, 500, j / 8), x = JQ.lerp(468, 500, j / 8) + (i - 1) * 9 + Math.sin(j * 1.7 + i) * 3; j ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke(); }
  };
  // the family as indigo line and wash, like the rest of the blue-and-white: new-year red (couplets, lanterns, bowls) is
  // printed as a pale-blue paper strip inside an indigo line with a white inner rim. Drawn live from the story track.
  const KPEN = { skin: PAPER, hair: IND, coat: IND2, pants: IND, apron: WASH, hat: IND, scarf: IND, cape: WASH2, eye: IND,
    ox: WASH, oxDark: IND, horn: PAPER, calf: '#DCE6F2', calfDark: IND, straw: WASH2, prop: IND, metal: IND2, red: WASH2, line: IND, lw: 2.4, outline: true };
  const H0 = L.house, GATE = new Path2D(); GATE.rect(-20, H0.wallBot, W + 40, H + 40); GATE.rect(H0.gateX0 + 4, H0.gateTop + 2, H0.gateX1 - H0.gateX0 - 8, H0.wallBot - H0.gateTop);
  const family = (g, C) => {
    for (const it of C.items) {
      g.save(); if (it.alpha != null && it.alpha < 1) g.globalAlpha = it.alpha;
      // the grown calf walking in at the gate: whatever is above the wall foot and outside the doorway is behind the wall
      if (it.who === 'calf' && it.kind === 'actor' && it.y < 846) g.clip(GATE);
      JQ.drawParts(g, it.parts, KPEN);
      if (it.kind !== 'actor') it.parts.forEach(p => { if (p.role === 'red') { g.save(); g.clip(p.path); g.strokeStyle = PAPER; g.lineWidth = 5; g.stroke(p.path); g.restore(); g.strokeStyle = IND; g.lineWidth = 2; g.stroke(p.path); } });
      g.restore();
    }
  };
  // the reign-mark style label: double square, two columns read right to left (kept above the lattice, 80 px inside the edge)
  const LX = 1630, LY = 80;
  const buildLabel = g => {
    const x0 = LX, y0 = LY, w = 220, h = 300; g.fillStyle = PAPER; g.fillRect(x0, y0, w, h);
    g.strokeStyle = IND; g.lineWidth = 5; g.strokeRect(x0, y0, w, h); g.lineWidth = 1.6; g.strokeRect(x0 + 10, y0 + 10, w - 20, h - 20);
    g.fillStyle = IND; g.textAlign = 'center'; g.textBaseline = 'top'; g.font = `88px ${KAI}`; JQ.vtext(g, '大寒', x0 + 156, y0 + 34, 112);
  };
  // the pentad, written into the left column one character at a time at the head of each bar
  const houText = (g, t, h) => {
    g.fillStyle = IND; g.textAlign = 'center'; g.textBaseline = 'top'; g.font = `48px ${KAI}`;
    [...HOU[h]].forEach((ch, i) => { const a = h ? JQ.smooth(h * BAR + 0.05 + i * 0.1, h * BAR + 0.16 + i * 0.1, t) : 1; if (a <= 0) return; g.globalAlpha = a; g.fillText(ch, LX + 66, LY + 34 + i * 58); });
    g.globalAlpha = 1;
  };

  // ---------------------------------------------------------------- the crack lattice: recursive straight cuts (built once)
  const P0 = [L.pond.cx, L.pond.cy], V = 1100, T0 = 5.4;
  const OPEN = { cx: 1630, cy: 850, rx: 300, ry: 252 }, HEN = [150, 850, 460, 1010];   // the 开光 around the family at the gate; the hen's corner
  const inOpen = (x, y, m = 0) => Math.hypot((x - OPEN.cx) / (OPEN.rx + m), (y - OPEN.cy) / (OPEN.ry + m)) < 1;
  const LAT = (() => {
    const R = JQ.rng(2424), cells = [], segs = [];
    const area = p => Math.abs(p.reduce((s, q, i) => { const r = p[(i + 1) % p.length]; return s + q[0] * r[1] - r[0] * q[1]; }, 0)) / 2;
    const inPond = (x, y) => Math.hypot((x - P0[0]) / L.pond.rx, (y - P0[1]) / L.pond.ry) < 0.95;
    const split = (p, d) => {
      const cx = p.reduce((s, q) => s + q[0], 0) / p.length, cy = p.reduce((s, q) => s + q[1], 0) / p.length, pond = inPond(cx, cy);
      if (area(p) < (pond ? 3500 : 26000) || d > 14) { cells.push({ p, cx, cy, pond }); return; }
      const xs = p.map(q => q[0]), ys = p.map(q => q[1]), wide = Math.max(...xs) - Math.min(...xs) > Math.max(...ys) - Math.min(...ys);
      const a = (wide ? Math.PI / 2 : 0) + (R() - 0.5) * 1.3, dx = Math.cos(a), dy = Math.sin(a), ox = cx + (R() - 0.5) * 30, oy = cy + (R() - 0.5) * 30;
      const side = q => (q[0] - ox) * dy - (q[1] - oy) * dx, A = [], B = [], cut = [];
      p.forEach((q, i) => { const r = p[(i + 1) % p.length], s1 = side(q), s2 = side(r); (s1 >= 0 ? A : B).push(q);
        if ((s1 >= 0) !== (s2 >= 0)) { const k = s1 / (s1 - s2), m = [q[0] + (r[0] - q[0]) * k, q[1] + (r[1] - q[1]) * k]; A.push(m); B.push(m); cut.push(m); } });
      if (cut.length === 2) segs.push({ a: cut[0], b: cut[1], pond: pond && d > 3 });
      split(A, d + 1); split(B, d + 1);
    };
    // seed with a jittered 6×4 grid of quads so no crack runs the full width, then cut each quad down
    const GX = 6, GY = 4, cn = (i, j) => [i === 0 ? -8 : i === GX ? W + 8 : i * W / GX + (JQ.hash(i, j, 41) - 0.5) * 150, j === 0 ? -8 : j === GY ? H + 8 : j * H / GY + (JQ.hash(i, j, 42) - 0.5) * 110];
    for (let j = 0; j < GY; j++) for (let i = 0; i < GX; i++) {
      const q = [cn(i, j), cn(i + 1, j), cn(i + 1, j + 1), cn(i, j + 1)]; split(q, 1);
      if (i > 0) segs.push({ a: q[0], b: q[3], pond: false }); if (j > 0) segs.push({ a: q[0], b: q[1], pond: false });
    }
    segs.forEach(s => { const dx = s.b[0] - s.a[0], dy = s.b[1] - s.a[1], len = Math.hypot(dx, dy), k = JQ.clamp(((P0[0] - s.a[0]) * dx + (P0[1] - s.a[1]) * dy) / (len * len));
      s.len = len; s.sc = k * len; s.dp = Math.hypot(s.a[0] + dx * k - P0[0], s.a[1] + dy * k - P0[1]); s.tN = T0 + s.dp / V; });
    cells.forEach((c, i) => { c.t = T0 + Math.hypot(c.cx - P0[0], c.cy - P0[1]) / V; c.a = 0.05 + 0.16 * JQ.hash(i, 9); c.path = JQ.P(c.p); });
    const joins = []; segs.forEach((s, i) => { if (!s.pond && JQ.hash(i, 3) < 0.6) joins.push({ x: s.b[0], y: s.b[1], i, r: 17 + JQ.hash(i, 4) * 9, rot: JQ.hash(i, 5) * TAU }); if (!s.pond && s.len > 260 && JQ.hash(i, 6) < 0.35) { const k = 0.3 + JQ.hash(i, 7) * 0.4; joins.push({ x: s.a[0] + (s.b[0] - s.a[0]) * k, y: s.a[1] + (s.b[1] - s.a[1]) * k, i: i + 999, r: 11 + JQ.hash(i, 8) * 5, rot: JQ.hash(i, 2) * TAU }); } });
    const keep = joins.filter(j => !inOpen(j.x, j.y, 24) && !(j.x > HEN[0] && j.x < HEN[2] && j.y > HEN[1] && j.y < HEN[3]) && !(j.x > LX - 20 && j.y < LY + 320));
    keep.forEach((j, n) => { j.t = IMP + 0.08 + 0.6 * Math.min(1, Math.hypot(j.x - P0[0], j.y - P0[1]) / 1325); j.open = JQ.hash(j.i, 11) < 0.3; });
    return { cells, segs, joins: keep };
  })();
  // a plum bud on the lattice (most of them), or a blossom just opening (a few): 梅将开
  const bud = (g, x, y, r, rot, k, open) => {
    if (open) return blossom(g, x, y, r * 0.72, rot, k);
    g.save(); g.translate(x, y); g.rotate(rot); g.scale(k, k);
    g.fillStyle = IND; g.beginPath(); g.moveTo(-r * 0.36, r * 0.1); g.quadraticCurveTo(0, r * 0.62, r * 0.36, r * 0.1); g.quadraticCurveTo(0, r * 0.3, -r * 0.36, r * 0.1); g.fill();
    g.fillStyle = PAPER; g.strokeStyle = IND; g.lineWidth = 1.8; g.beginPath(); g.ellipse(0, -r * 0.1, r * 0.4, r * 0.48, 0, 0, TAU); g.fill(); g.stroke();
    g.strokeStyle = IND2; g.lineWidth = 1.2; g.beginPath(); g.moveTo(-r * 0.16, -r * 0.5); g.quadraticCurveTo(0, -r * 0.1, -r * 0.05, r * 0.3); g.moveTo(r * 0.16, -r * 0.5); g.quadraticCurveTo(0, -r * 0.1, r * 0.05, r * 0.3); g.stroke();
    g.restore();
  };
  const blossom = (g, x, y, r, rot, k) => {
    g.save(); g.translate(x, y); g.rotate(rot); g.scale(k, k);
    for (let i = 0; i < 5; i++) { const a = i / 5 * TAU; g.beginPath(); g.arc(Math.cos(a) * r * 0.55, Math.sin(a) * r * 0.55, r * 0.5, 0, TAU); g.fillStyle = PAPER; g.fill(); g.strokeStyle = IND; g.lineWidth = 1.6; g.stroke(); }
    g.fillStyle = PAPER; g.beginPath(); g.arc(0, 0, r * 0.4, 0, TAU); g.fill();
    g.strokeStyle = IND2; g.lineWidth = 1; g.fillStyle = IND; for (let i = 0; i < 7; i++) { const a = i / 7 * TAU + 0.3; g.beginPath(); g.moveTo(0, 0); g.lineTo(Math.cos(a) * r * 0.42, Math.sin(a) * r * 0.42); g.stroke(); g.beginPath(); g.arc(Math.cos(a) * r * 0.46, Math.sin(a) * r * 0.46, 1.6, 0, TAU); g.fill(); }
    g.fillStyle = IND2; g.beginPath(); g.arc(0, 0, r * 0.13, 0, TAU); g.fill();
    g.restore();
  };
  // thin cracks race out from the pond (5.4 → ~6.6 s); on the impact they all lock into thick bars at once, the cells take
  // their cobalt wash and the pond ice turns solid; the buds set after that and everything holds still
  const lattice = (g, t) => {
    const r = (t - T0) * V; if (r <= 0) return;
    const lk = Math.pow(JQ.clamp((t - 6.5) / (IMP - 6.5)), 2), ck = JQ.smooth(6.6, 6.8, t);
    g.save(); const hole = new Path2D(); hole.rect(-20, -20, W + 40, H + 40); hole.ellipse(OPEN.cx, OPEN.cy, OPEN.rx, OPEN.ry, 0, 0, TAU); g.clip(hole, 'evenodd');
    if (ck > 0) for (const c of LAT.cells) { g.fillStyle = `rgba(${COB[0]},${COB[1]},${COB[2]},${(c.pond ? c.a * 1.6 + 0.08 : c.a) * ck})`; g.fill(c.path); }
    if (ck > 0) { g.save(); g.clip(S.pond.path); g.fillStyle = `rgba(240,244,250,${0.75 * ck})`; g.fill(S.pond.path); g.restore(); }
    g.lineCap = 'round';
    for (const s of LAT.segs) {
      if (r <= s.dp) continue;
      const hh = Math.sqrt(r * r - s.dp * s.dp), s0 = Math.max(0, s.sc - hh), s1 = Math.min(s.len, s.sc + hh); if (s1 <= s0) continue;
      const ux = (s.b[0] - s.a[0]) / s.len, uy = (s.b[1] - s.a[1]) / s.len, x0 = s.a[0] + ux * s0, y0 = s.a[1] + uy * s0, x1 = s.a[0] + ux * s1, y1 = s.a[1] + uy * s1;
      const w = s.pond ? JQ.lerp(1.6, 3, lk) : JQ.lerp(1.8, 9.5, lk);
      g.strokeStyle = IND; g.lineWidth = w; g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.stroke();
      if (w > 5) { g.strokeStyle = IND2; g.lineWidth = w * 0.3; g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.stroke(); }
    }
    g.restore();
    // the 开光 rim: a double indigo ring that closes with the lattice
    if (lk > 0) { g.strokeStyle = IND; g.lineWidth = 9.5 * lk; g.beginPath(); g.ellipse(OPEN.cx, OPEN.cy, OPEN.rx, OPEN.ry, 0, 0, TAU); g.stroke();
      g.lineWidth = 1.6; g.globalAlpha = lk; g.beginPath(); g.ellipse(OPEN.cx, OPEN.cy, OPEN.rx - 12, OPEN.ry - 12, 0, 0, TAU); g.stroke(); g.globalAlpha = 1; }
    // the flash of the lock
    const e = t - IMP; if (e > -0.02 && e < 0.6) { g.fillStyle = `rgba(255,255,255,${0.28 * (1 - Math.max(0, e) / 0.6)})`; g.fillRect(0, 0, W, H); }
    for (const j of LAT.joins) { const k = JQ.smooth(j.t, j.t + 0.35, t); if (k > 0) bud(g, j.x, j.y, j.r * 1.35, j.rot, k * (1 + 0.12 * Math.sin(Math.PI * k)), j.open); }
  };

  // ---------------------------------------------------------------- the hen at the gate hatching her chicks (behind the lattice)
  const HX = 300, HY = 952;   // under the 槐, clear of the family at the gate
  const hen = (g, t) => {
    g.save(); g.translate(HX, HY); g.scale(1.55, 1.55);
    ink(g, (() => { const p = new Path2D(); p.ellipse(0, 34, 78, 18, 0, 0, TAU); return p; })(), WASH, 2);
    g.strokeStyle = IND2; g.lineWidth = 1.2; for (let i = 0; i < 14; i++) { const x = -70 + i * 10; g.beginPath(); g.moveTo(x, 26 + (i % 3) * 4); g.lineTo(x + 18, 38 - (i % 2) * 6); g.stroke(); }
    const tail = JQ.smoothPath([[-42, -6], [-74, -62], [-60, -70], [-48, -46], [-40, -66], [-26, -60], [-24, -24]]); ink(g, tail, IND2, 2);
    const body = new Path2D(); body.ellipse(0, 0, 58, 38, -0.08, 0, TAU); ink(g, body, PAPER, 2.6);
    g.save(); g.clip(body); g.strokeStyle = IND2; g.lineWidth = 1.2; for (let row = 0; row < 5; row++) for (let i = 0; i < 9; i++) { const x = -54 + i * 13 + (row % 2) * 6, y = -26 + row * 13; g.beginPath(); g.arc(x, y, 6, 0.2, Math.PI - 0.2); g.stroke(); } g.restore();
    const wing = JQ.smoothPath([[-36, -12], [10, -18], [32, 0], [4, 18], [-38, 12]]); ink(g, wing, WASH, 2);
    for (let i = 0; i < 4; i++) ink(g, JQ.open([[-30 + i * 4, 10 - i * 2], [20 - i * 6, -10 + i * 6]]), null, 1.1, IND2);
    ink(g, JQ.smoothPath([[36, -20], [52, -44], [62, -40], [56, -10]]), PAPER, 2.4);
    const head = new Path2D(); head.arc(54, -46, 15, 0, TAU); ink(g, head, PAPER, 2.4);
    [[46, -60], [54, -64], [62, -60]].forEach(([x, y]) => { g.fillStyle = IND2; g.beginPath(); g.arc(x, y, 6, 0, TAU); g.fill(); });
    g.fillStyle = IND; g.beginPath(); g.moveTo(67, -50); g.lineTo(80, -45); g.lineTo(67, -41); g.fill(); g.fillStyle = IND2; g.beginPath(); g.ellipse(66, -34, 4, 7, 0, 0, TAU); g.fill();
    g.fillStyle = IND; g.beginPath(); g.arc(58, -49, 2.6, 0, TAU); g.fill();
    // eggs → chicks (staggered; the middle chick is out on beat 3 of bar 1), then they stay, bobbing
    [[-36, 30], [-4, 38], [28, 33]].forEach(([ex, ey], i) => {
      const t0 = 0.75 + i * 0.18, hk = JQ.smooth(t0, t0 + 0.4, t), bob = hk >= 1 ? Math.sin(t * 5 + i * 2) * 1.6 * (1 - JQ.smooth(6.6, 7.4, t)) : 0;
      const egg = new Path2D(); egg.ellipse(ex, ey, 12, 15, 0, 0, TAU);
      if (hk <= 0) { ink(g, egg, PAPER, 2); if (t > 0.35 + i * 0.18) ink(g, JQ.open([[ex - 10, ey - 2], [ex - 5, ey - 6], [ex, ey - 1], [ex + 5, ey - 7], [ex + 10, ey - 2]]), null, 1.4); }
      if (hk > 0) {
        const cy = ey - 6 - 16 * hk + bob;
        ink(g, (() => { const p = new Path2D(); p.arc(ex + 2, cy, 13, 0, TAU); return p; })(), PAPER, 2);
        ink(g, (() => { const p = new Path2D(); p.arc(ex + 12, cy - 13, 9, 0, TAU); return p; })(), PAPER, 2);
        g.fillStyle = IND; g.beginPath(); g.moveTo(ex + 20, cy - 15); g.lineTo(ex + 28, cy - 12); g.lineTo(ex + 20, cy - 9); g.fill(); g.beginPath(); g.arc(ex + 14, cy - 15, 1.8, 0, TAU); g.fill();
        ink(g, (() => { const p = new Path2D(); p.ellipse(ex, ey + 5, 13, 9, 0, 0, Math.PI); p.lineTo(ex - 13, ey + 5); for (let z = 0; z <= 6; z++) p.lineTo(ex - 13 + z * 26 / 6, ey + 5 - (z % 2) * 5); return p; })(), PAPER, 1.8);
      }
    });
    g.restore();
  };
  // ---------------------------------------------------------------- the falcon (候二): stoops from the upper left, bottoms out over the
  // field on beat 3 of bar 2 (4.0 s), climbs away to the right; long pointed wings, short fan tail, speed strokes
  const F0 = 2.75, F1 = 5.1, FK = (BAR + 4 / 3 - F0) / (F1 - F0);
  const falconAt = t => { const k = (t - F0) / (F1 - F0), x = JQ.lerp(-220, 2160, k), q = k < FK ? (k - FK) / FK : (k - FK) / (1 - FK); return [x, 560 - 430 * q * q]; };
  const falcon = (g, t) => {
    if (t < F0 || t > F1) return;
    const [x, y] = falconAt(t), [x2, y2] = falconAt(t + 0.01);
    g.save(); g.translate(x, y); g.rotate(Math.atan2(y2 - y, x2 - x)); g.scale(1.6, 1.6);
    g.strokeStyle = JQ.rgba('#1E3A68', 0.55); g.lineWidth = 1.6; for (let i = 0; i < 7; i++) { const yy = -26 + i * 9, l = 140 + JQ.hash(i, 77) * 160; g.beginPath(); g.moveTo(-52, yy); g.lineTo(-52 - l, yy); g.stroke(); }
    g.fillStyle = IND;
    // seen from below: long pointed crescent wings swept back, short fan tail, round head with a hooked bill
    [-1, 0.86].forEach(sd => { g.beginPath(); g.moveTo(16, -6 * Math.sign(sd)); g.quadraticCurveTo(8, -70 * sd, -46, -96 * sd);
      for (let i = 0; i <= 5; i++) { const k = i / 5; g.lineTo(JQ.lerp(-46, -16, k) + (i % 2) * 4, JQ.lerp(-96, -8, k) * sd + (i % 2 ? 4 : 0) * sd); } g.closePath(); g.fill(); });
    g.beginPath(); g.moveTo(-40, 0); g.quadraticCurveTo(-6, -15, 30, -7); g.quadraticCurveTo(38, 0, 30, 7); g.quadraticCurveTo(-6, 15, -40, 0); g.fill();
    g.beginPath(); g.moveTo(-34, -6); g.lineTo(-66, -14); g.quadraticCurveTo(-72, 0, -66, 14); g.lineTo(-34, 6); g.closePath(); g.fill();
    g.beginPath(); g.arc(32, 0, 10, 0, TAU); g.fill(); g.beginPath(); g.moveTo(40, -4); g.quadraticCurveTo(50, -2, 46, 6); g.lineTo(40, 3); g.fill();
    g.strokeStyle = PAPER; g.lineWidth = 1.1; [-1, 0.86].forEach(sd => { for (let i = 1; i < 5; i++) { const k = i / 5; g.beginPath(); g.moveTo(JQ.lerp(8, -40, k), JQ.lerp(-14, -84, k) * sd); g.lineTo(JQ.lerp(-6, -44, k), JQ.lerp(-12, -76, k) * sd); g.stroke(); } });
    g.fillStyle = PAPER; g.beginPath(); g.arc(35, -3, 2.2, 0, TAU); g.fill();
    g.restore();
  };

  JQ.ART[24] = {
    key: IMP, keyHou: JQ.TERMS[23].keyHou, focus: [[HX + 20, HY - 50], [1050, 560], [990, 860]], frame: false,
    draw(g, t, Sx) {
      t = JQ.clamp(t, 0, 9); const h = Math.min(2, Math.floor(t / BAR));
      JQ.blit(g, JQ.cached('s24scene', Sx, buildScene));
      hen(g, t); falcon(g, t);
      family(g, JQ.castFor(Sx, t));
      lattice(g, t);
      JQ.blit(g, JQ.cached('s24label', Sx, buildLabel));
      houText(g, t, h);
    },
  };
})();
