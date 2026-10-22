// s02 雨水 · 吴冠中式点线 — 纸白和灰白墙面上长而有节奏的黑色墨线（树枝、山脊、田埂），嫩绿、桃红、鹅黄的色点像撒上去，雨是细斜线。
// 记忆点（獭祭鱼）：水獭在池塘近岸一次叼一条鱼上岸，一条条竖着摆齐；3.6 到 4 秒鱼淡出、水獭淡回起点，接回 0 秒。
(function () {
  const JQ = window.JQ, S = JQ.SCENE, L = JQ.L;
  const PAPER = '#F4F2EC', INK = '#16130F';
  const DOTS = ['#8CC152', '#78B043', '#A9D06A', '#E98AA2', '#E25C7A', '#EEC643', '#E9B92E', '#1B1814', '#1B1814', '#6F8FA6'];
  const TAU = Math.PI * 2;

  // Catmull-Rom through control points → dense polyline
  const spline = (P, step = 5) => {
    const out = [];
    for (let i = 0; i < P.length - 1; i++) {
      const p0 = P[Math.max(0, i - 1)], p1 = P[i], p2 = P[i + 1], p3 = P[Math.min(P.length - 1, i + 2)];
      const n = Math.max(2, Math.ceil(Math.hypot(p2[0] - p1[0], p2[1] - p1[1]) / step));
      for (let j = 0; j < n; j++) {
        const u = j / n, u2 = u * u, u3 = u2 * u;
        out.push([0, 1].map(k => 0.5 * (2 * p1[k] + (-p0[k] + p2[k]) * u + (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * u2 + (-p0[k] + 3 * p1[k] - 3 * p2[k] + p3[k]) * u3)));
      }
    }
    out.push(P[P.length - 1]); return out;
  };
  // one brush stroke: a tapered ribbon with pressure that breathes along the line
  const stroke = (g, ctrl, w, seed, o = {}) => {
    const P = spline(ctrl, o.step || 5), n = P.length; if (n < 2) return;
    const A = [], B = [], ti = o.in || 0.1, to = o.out == null ? 0.7 : o.out;
    for (let i = 0; i < n; i++) {
      const a = P[Math.max(0, i - 1)], b = P[Math.min(n - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], d = Math.hypot(dx, dy) || 1, q = i / (n - 1);
      const hw = 0.5 * w * (0.3 + 0.7 * JQ.smooth(0, ti, q)) * (1 - to * JQ.smooth(0.72, 1, q)) * (0.7 + 0.6 * JQ.noise(i * 0.09, 0.5, seed));
      A.push([P[i][0] - dy / d * hw, P[i][1] + dx / d * hw]); B.push([P[i][0] + dy / d * hw, P[i][1] - dx / d * hw]);
    }
    const path = new Path2D(); [...A, ...B.reverse()].forEach(([x, y], i) => i ? path.lineTo(x, y) : path.moveTo(x, y)); path.closePath();
    g.fillStyle = o.color || INK; g.fill(path);
  };
  const dot = (g, x, y, r, c, a = 0) => { g.fillStyle = c; g.beginPath(); g.ellipse(x, y, r, r * 0.8, a, 0, TAU); g.fill(); };
  const breakLine = (g, pts, w, seed, R, o) => {   // one long line, broken into 2–3 breaths with small gaps
    const n = pts.length, cuts = [0], k = 1 + Math.floor(R() * 2.2);
    for (let i = 1; i <= k; i++) cuts.push(Math.floor(n * (i / (k + 1) + (R() - 0.5) * 0.12)));
    cuts.push(n - 1);
    for (let i = 0; i < cuts.length - 1; i++) { const a = cuts[i] + (i ? 2 : 0), b = cuts[i + 1]; if (b - a > 2) stroke(g, pts.slice(a, b + 1), w * (0.75 + R() * 0.5), seed + i * 7, o); }
  };

  // ---------------------------------------------------------------- house, tree, cast, title
  const drawHouse = (g, R) => {
    const H = L.house;
    g.fillStyle = 'rgba(150,152,150,0.13)'; g.fill(S.houseFront.path);
    g.fillStyle = 'rgba(150,152,150,0.20)'; g.strokeStyle = INK; g.lineWidth = 2.4; g.stroke(S.houseFront.path);
    g.fillStyle = INK; g.fill(S.window.path);
    g.fillStyle = 'rgba(190,192,190,0.30)'; g.fill(S.roof.path);
    stroke(g, [[H.roofX0 - 6, H.eaveY - 2], [H.roofX1 + 4, H.eaveY - 2]], 7, 120, { step: 9 });
    stroke(g, [[H.roofX0 + 40, H.ridgeY], [H.roofX1 - 34, H.ridgeY]], 4, 121, { step: 9 });
    S.roofLines.forEach((r, i) => { if (i % 2) stroke(g, r.pts.map(([x, y], j) => [x, y + 4]), 1.1, 122 + i, { color: 'rgba(22,19,15,0.45)' }); });
    g.fillStyle = INK; g.fill(S.chimney.path);
    g.fillStyle = 'rgba(214,214,212,0.95)'; g.fill(S.wall.path); g.fillStyle = 'rgba(150,152,150,0.16)'; g.fill(S.wall.path);
    stroke(g, [[H.wallX0 + 2, H.wallTop], [H.wallX0 + 6, (H.wallTop + H.wallBot) / 2], [H.wallX0 + 2, H.wallBot]], 4, 130);
    stroke(g, [[H.wallX0, H.wallBot - 2], [H.wallX1, H.wallBot - 4]], 3.4, 131);
    g.fillStyle = INK; g.fill(S.wallCap.path); g.fill(S.gate.path); g.fill(S.gateRoof.path);
    for (let i = 0; i < 5; i++) dot(g, H.wallX0 + 40 + i * 26, H.wallTop + 34 + R() * 40, 0.8 + R(), 'rgba(60,58,54,0.5)');
  };
  const drawTree = (g, R) => {
    g.fillStyle = INK; g.fill(S.trunk.path);
    for (const b of S.branches) { if (b.w < 2.2) continue; stroke(g, [[b.x1, b.y1], [(b.x1 + b.x2) / 2 + (R() - 0.5) * 18, (b.y1 + b.y2) / 2 + (R() - 0.5) * 18], [b.x2, b.y2]], JQ.clamp(b.w * 0.42, 1.3, 8), b.depth * 31 + Math.floor(b.x1)); }
    const C = L.tree.canopy, top = L.tree.top;
    for (let k = 0; k < 20; k++) { const a = -Math.PI * 0.95 + k * 0.115, r = 130 + R() * 160, ex = C.cx + Math.cos(a) * r, ey = C.cy + Math.sin(a) * r * 0.85; stroke(g, [[top[0] + (R() - 0.5) * 20, top[1] + 10], [JQ.lerp(top[0], ex, 0.45) + (R() - 0.5) * 60, JQ.lerp(top[1], ey, 0.45) + (R() - 0.5) * 40], [ex, ey]], 4 + R() * 3, 300 + k); }
    // greens are held back for 草木萌动 (drawn live in the third bar); the same R() order keeps every other dot in place
    const put = (x, y, r) => { const c = DOTS[Math.floor(R() * DOTS.length)], a = R() * 3; if (DOTS.indexOf(c) < 3) GREEN.push([x, y, r, c, a]); else dot(g, x, y, r, c, a); };
    S.tips.forEach(([x, y], i) => { if (i % 2) return; put(x + (R() - 0.5) * 6, y + (R() - 0.5) * 6, 2.5 + R() * 3.6); });
    for (let i = 0; i < 320; i++) { const a = R() * TAU, d = Math.sqrt(R()) * 0.95; put(C.cx + Math.cos(a) * C.rx * d, C.cy + Math.sin(a) * C.ry * d, 1.8 + R() * 3.2); }
    for (let i = 0; i < 34; i++) put(C.cx + (R() - 0.5) * C.rx * 2.1, C.cy + C.ry + R() * 120, 1.6 + R() * 2.4);
  };
  const GREEN = [];
  // the family in the same hand: paper underneath, a thin colour wash laid loosely, one ink line round each part;
  // the straw cape gets a few short ink strokes for its straw
  const WASH = { skin: 'rgba(240,222,200,0.55)', hair: INK, coat: 'rgba(110,140,160,0.38)', pants: 'rgba(70,68,64,0.45)', apron: 'rgba(150,152,150,0.32)',
    scarf: 'rgba(60,58,54,0.6)', hat: 'rgba(220,190,110,0.5)', straw: 'rgba(220,190,110,0.5)', cape: 'rgba(130,112,84,0.5)', eye: INK,
    ox: 'rgba(176,140,96,0.32)', oxDark: 'rgba(60,52,42,0.55)', horn: 'rgba(246,242,230,0.95)', calf: 'rgba(196,160,112,0.32)', calfDark: 'rgba(60,52,42,0.5)',
    prop: 'rgba(120,90,60,0.6)', metal: 'rgba(90,90,90,0.7)', red: '#E25C7A', line: INK };
  const castDraw = (g, C) => {
    for (const it of C.items) {
      g.save(); if (it.alpha != null && it.alpha < 1) g.globalAlpha = it.alpha;
      for (const p of it.parts) {
        const w = WASH[p.role] || JQ.roleColor(WASH, p.role) || 'rgba(120,110,100,0.4)', solid = p.role === 'eye' || p.role === 'line' || p.role === 'hair';
        if (solid) { g.fillStyle = w; g.fill(p.path); continue; }
        g.fillStyle = PAPER; g.fill(p.path); g.fillStyle = it.who === 'kid' && p.role === 'coat' ? 'rgba(226,92,105,0.45)' : w; g.fill(p.path);
        if (p.role === 'cape') { g.save(); g.clip(p.path); g.strokeStyle = 'rgba(22,19,15,0.55)'; g.lineWidth = 1.2; const [x0, y0] = p.pts[0]; for (let k = 0; k < 14; k++) { const x = x0 - 30 + (k % 7) * 9, y = y0 + 6 + Math.floor(k / 7) * 22; g.beginPath(); g.moveTo(x, y); g.lineTo(x - 3, y + 16); g.stroke(); } g.restore(); }
        g.strokeStyle = INK; g.lineJoin = 'round'; g.lineWidth = p.role === 'horn' || it.kind !== 'actor' ? 1.5 : 2.3; g.stroke(p.path);
      }
      g.restore();
    }
  };
  const drawTitle = g => {
    g.textAlign = 'left'; g.textBaseline = 'alphabetic';
    g.fillStyle = INK; g.font = '108px "Xingkai SC", "Kaiti SC", "STKaiti", serif';
    g.fillText('雨', 1160, 164); g.fillText('水', 1162, 274);
    g.fillStyle = '#B03A2E'; g.fillRect(1196, 298, 34, 34);
    g.fillStyle = PAPER; g.font = '26px "Songti SC", serif'; g.textAlign = 'center'; g.fillText('春', 1213, 325); g.textAlign = 'left';
  };
  // ---------------------------------------------------------------- the still (cached)
  const buildBg = g => {
    const R = JQ.rng(202); GREEN.length = 0;
    g.fillStyle = PAPER; g.fillRect(0, 0, JQ.W, JQ.H);
    for (let i = 0; i < 26; i++) { const x = R() * 1920, y = R() * 1080, r = 80 + R() * 220, gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, 'rgba(150,146,136,0.06)'); gr.addColorStop(1, 'rgba(150,146,136,0)'); g.fillStyle = gr; g.fillRect(x - r, y - r, 2 * r, 2 * r); }
    g.fillStyle = 'rgba(120,112,100,0.10)'; for (let i = 0; i < 900; i++) g.fillRect(R() * 1920, R() * 1080, 1 + R() * 2, 0.8);
    // far mountains: a pale grey band under one long ridge line in three breaths; the nearer hill line paler
    g.fillStyle = 'rgba(110,118,124,0.09)'; g.fill(S.mountains.path);
    const rg = S.ridge.pts, rn = rg.length - 1;
    [[0, 0.37], [0.39, 0.71], [0.73, 1]].forEach(([a, b], k) => stroke(g, rg.slice(Math.floor(a * rn), Math.floor(b * rn) + 1), 4.6, 10 + k, { step: 8 }));
    g.fillStyle = 'rgba(140,170,110,0.10)'; g.fill(S.hills.path);
    breakLine(g, S.hills.pts.slice(0, -2), 2.2, 20, R, { color: 'rgba(22,19,15,0.55)', step: 8 });
    // field: a pale wash and long rhythmic 田埂 curves, seedlings as green dots along them
    g.fillStyle = 'rgba(170,186,130,0.10)'; g.fill(S.field.path); g.fillStyle = 'rgba(120,108,90,0.10)'; g.fill(S.field.path);   // the field gone damp
    S.furrows.forEach((f, k) => {
      const [p0, p1, p2] = f.pts, pts = [];
      for (let x = -20; x <= 1940; x += 110) { const y = x < p1[0] ? JQ.lerp(p0[1], p1[1], x / p1[0]) : JQ.lerp(p1[1], p2[1], (x - p1[0]) / (p2[0] - p1[0])); pts.push([x, y + (JQ.noise(x * 0.004, k, 33) - 0.5) * 14]); }
      breakLine(g, pts, 1.6 + (k % 3) * 0.9, 40 + k, R, { step: 10, out: 0.5 });
      for (let i = 0; i < 70; i++) { if (R() < 0.35) continue; const x = 10 + i * 27.5 + R() * 10, q = pts[Math.min(pts.length - 1, Math.max(0, Math.round((x + 20) / 110)))]; dot(g, x, q[1] - 5 - R() * 6, 2 + R() * 2.6, R() < 0.8 ? DOTS[Math.floor(R() * 3)] : DOTS[5]); }
    });
    // the path to the gate: two faint grey lines
    const P = S.path.pts;
    stroke(g, [P[1], P[2], P[3], P[4]], 1.8, 50, { color: 'rgba(22,19,15,0.35)' }); stroke(g, [P[0], P[7], P[6], P[5]], 1.8, 51, { color: 'rgba(22,19,15,0.35)' });
    // the stream: paper with a cool wash, two broken edge lines and a few current marks
    const sn = S.stream.center.length, sA = S.stream.pts.slice(0, sn), sB = S.stream.pts.slice(sn).reverse();
    g.fillStyle = PAPER; g.fill(S.stream.path); g.fillStyle = 'rgba(110,145,165,0.16)'; g.fill(S.stream.path);
    breakLine(g, sA, 2.2, 60, R, {}); breakLine(g, sB, 2.2, 63, R, {});
    S.stream.center.forEach(([x, y], i) => { if (i % 6 === 3) stroke(g, [[x - 6, y - 8], [x + 2, y + 8]], 1.4, 70 + i, { color: 'rgba(22,19,15,0.5)' }); });
    // the pond: rim wash, water wash, a near bank in one heavy stroke, the far edge lighter, a few water lines
    g.fillStyle = 'rgba(140,125,100,0.10)'; g.fill(S.pondRim.path);
    g.fillStyle = PAPER; g.fill(S.pond.path); g.fillStyle = 'rgba(110,140,160,0.20)'; g.fill(S.pond.path);
    const pp = S.pond.pts;
    stroke(g, pp.slice(2, 47), 4.2, 80, { step: 7 }); stroke(g, pp.slice(54, 94), 2.4, 81, { step: 7, color: 'rgba(22,19,15,0.7)' });
    [[820, 846, 120], [1010, 832, 180], [900, 880, 90], [1120, 896, 130], [960, 930, 160]].forEach(([x, y, w], i) => stroke(g, [[x, y], [x + w * 0.5, y + 2], [x + w, y]], 1.8, 90 + i, { color: 'rgba(22,19,15,0.55)' }));
    // the bank in front of the water: one pale grey slab like an offering table, its near edge a single heavy stroke
    g.fillStyle = 'rgba(150,152,150,0.20)'; g.fill(JQ.P([[587, 984], [1025, 964], [1043, 1048], [605, 1066]]));
    stroke(g, [[597, 1064], [825, 1058], [1043, 1046]], 4, 99, { step: 8 });
    // the bridge: one arch line and a deck line over paper
    const Bq = L.bridge;
    g.fillStyle = PAPER; g.fill(S.bridge.path); g.fillStyle = 'rgba(150,152,150,0.24)'; g.fill(S.bridge.path);
    for (let i = 0; i < 9; i++) stroke(g, [[Bq.cx - Bq.half + 14 + i * 20, Bq.deckY + 8 + (i % 2) * 5], [Bq.cx - Bq.half + 26 + i * 20, Bq.deckY + 8 + (i % 2) * 5]], 2.2, 104 + i, { color: 'rgba(22,19,15,0.55)' });
    stroke(g, [[Bq.cx - Bq.half - 30, Bq.deckY + 22], [Bq.cx - Bq.half, Bq.deckY], [Bq.cx + Bq.half, Bq.deckY - 2], [Bq.cx + Bq.half + 30, Bq.deckY + 20]], 6, 100, { step: 6 });
    stroke(g, S.bridgeArch.pts.slice().sort((a, b) => a[0] - b[0]), 4.4, 101, { step: 6, out: 0.3 });
    stroke(g, [[Bq.cx - Bq.half + 2, Bq.deckY + 4], [Bq.cx - Bq.half + 6, Bq.archBase + 4]], 3, 102); stroke(g, [[Bq.cx + Bq.half - 2, Bq.deckY + 4], [Bq.cx + Bq.half - 6, Bq.archBase + 4]], 3, 103);
    drawHouse(g, R); drawTree(g, R);
    drawTitle(g);
  };

  // ---------------------------------------------------------------- moving parts
  // the row lies on the near bank in front of the water: five fat crucians, heads all up-right, evenly spaced
  const OT = { y: 962, fy: 1004, rot: -1.22, len: 112, slots: [650, 730, 810, 890, 970], CP: 0.72, s: 1.4 };
  const oxAt = k => OT.slots[0] + k * 80 - 78;
  // the otter faces right: tail on the left, head on the right; head offset decides dip / lay
  const otter = (g, x, head, a, walk) => {
    stroke(g, [[-108, 20], [-96, 11], [-88, 8]], 9, 5, { color: '#2B2420' });
    const P = spline([[-84, 8], [-52, 0], [-20, -7], [8, -9], [28, -5], head], 6), n = P.length, A = [], B = [];
    for (let i = 0; i < n; i++) {
      const p = P[Math.max(0, i - 1)], q = P[Math.min(n - 1, i + 1)], dx = q[0] - p[0], dy = q[1] - p[1], d = Math.hypot(dx, dy) || 1, k = i / (n - 1);
      const hw = 0.5 * (k < 0.3 ? JQ.lerp(4, 15, k / 0.3) : k < 0.78 ? JQ.lerp(15, 23, (k - 0.3) / 0.48) : JQ.lerp(23, 15, (k - 0.78) / 0.22));
      A.push([P[i][0] - dy / d * hw, P[i][1] + dx / d * hw]); B.push([P[i][0] + dy / d * hw, P[i][1] - dx / d * hw]);
    }
    g.save(); g.globalAlpha = a; g.translate(x, OT.y); g.scale(OT.s, OT.s);
    g.fillStyle = '#2B2420';
    [[-34, 0], [-24, Math.PI], [12, Math.PI], [22, 0]].forEach(([u, ph]) => { const s = Math.sin(walk + ph) * 6; g.beginPath(); g.moveTo(u - 4, 2); g.lineTo(u - 5 + s, 22); g.lineTo(u + 3 + s, 22); g.lineTo(u + 5, 2); g.closePath(); g.fill(); });
    const path = new Path2D(); [...A, ...B.reverse()].forEach(([u, v], i) => i ? path.lineTo(u, v) : path.moveTo(u, v)); path.closePath();
    g.fill(path); g.strokeStyle = INK; g.lineWidth = 1.6; g.stroke(path);
    const [hx, hy] = head;
    g.beginPath(); g.ellipse(hx + 5, hy - 1, 16, 12.5, 0.16, 0, TAU); g.fill();
    g.fillStyle = 'rgba(244,242,236,0.85)'; g.beginPath(); g.ellipse(hx + 14, hy + 6, 8, 5, 0.2, 0, TAU); g.fill();
    g.fillStyle = INK; g.beginPath(); g.arc(hx + 20, hy - 3, 2.6, 0, TAU); g.fill(); g.fillStyle = '#3D332C'; g.beginPath(); g.ellipse(hx - 1, hy - 13, 5, 4, -0.3, 0, TAU); g.fill();
    g.fillStyle = 'rgba(244,242,236,0.9)'; g.beginPath(); g.arc(hx + 8, hy - 5, 1.8, 0, TAU); g.fill();
    g.strokeStyle = 'rgba(20,16,12,0.8)'; g.lineWidth = 1;
    for (let k = 0; k < 3; k++) { g.beginPath(); g.moveTo(hx + 15, hy + 4 + k * 1.8); g.lineTo(hx + 34, hy + k * 3.6); g.stroke(); }
    g.fillStyle = 'rgba(238,226,196,0.16)'; g.beginPath(); g.ellipse(4, -2, 30, 4.5, -0.04, 0, TAU); g.fill();
    g.restore();
  };
  // a plump crucian lying on the bank, head toward the water: silver-grey wash inside one breathing ink line
  const fish = (g, x, y, len, rot, a) => {
    const L2 = len, c = Math.cos(rot), s = Math.sin(rot), at = (u, v) => [x + u * L2 * c - v * L2 * s, y + u * L2 * s + v * L2 * c];
    const body = new Path2D(), mv = (u, v) => body.moveTo(...at(u, v)), bz = (a1, b1, a2, b2, a3, b3) => body.bezierCurveTo(...at(a1, b1), ...at(a2, b2), ...at(a3, b3));
    mv(0.5, 0); bz(0.42, -0.15, 0.05, -0.2, -0.26, -0.07); body.lineTo(...at(-0.48, -0.17)); bz(-0.43, -0.06, -0.43, 0.06, -0.48, 0.17); body.lineTo(...at(-0.26, 0.07)); bz(0.05, 0.2, 0.42, 0.15, 0.5, 0); body.closePath();
    const fin = new Path2D(); [[0.12, -0.17], [-0.04, -0.27], [-0.18, -0.14]].forEach(([u, v], i) => i ? fin.lineTo(...at(u, v)) : fin.moveTo(...at(u, v))); fin.closePath();
    g.save(); g.globalAlpha = a; g.lineJoin = 'round'; g.strokeStyle = INK;
    g.fillStyle = 'rgba(160,170,176,0.75)'; g.fill(fin); g.lineWidth = 1.6; g.stroke(fin);
    g.fillStyle = PAPER; g.fill(body); g.fillStyle = 'rgba(150,162,170,0.62)'; g.fill(body); g.lineWidth = 2.4; g.stroke(body);
    g.strokeStyle = 'rgba(22,19,15,0.55)'; g.lineWidth = 1.6; g.beginPath(); g.moveTo(...at(0.26, -0.1)); g.quadraticCurveTo(...at(0.2, 0), ...at(0.26, 0.1)); g.stroke();
    g.beginPath(); g.moveTo(...at(0.2, 0.02)); g.lineTo(...at(-0.24, 0.02)); g.stroke();
    const [ex, ey] = at(0.37, -0.045); g.fillStyle = INK; g.beginPath(); g.arc(ex, ey, len * 0.026, 0, TAU); g.fill();
    const [bx, by] = at(0.02, 0.07); dot(g, bx, by, len * 0.04, '#E98AA2');
    g.restore();
  };
  // 候雁北: one skein of seven geese in a V, low over the field at first, rising and shrinking toward the far hills
  const BAR = 8 / 3, IMP = 4 / 3;
  const goose = (g, x, y, s, ph) => {
    const f = Math.sin(ph) * 7;
    g.strokeStyle = INK; g.lineCap = 'round'; g.lineWidth = 3.2 * s;
    g.beginPath(); g.moveTo(x - 24 * s, y - (8 + f) * s); g.quadraticCurveTo(x - 10 * s, y - 11 * s, x, y); g.quadraticCurveTo(x + 10 * s, y - 11 * s, x + 24 * s, y - (8 + f) * s); g.stroke();
    g.fillStyle = INK; g.beginPath(); g.ellipse(x - 2 * s, y + 1.5 * s, 8 * s, 3.2 * s, 0.15, 0, TAU); g.fill();
    g.lineWidth = 2.4 * s; g.beginPath(); g.moveTo(x - 8 * s, y); g.lineTo(x - 20 * s, y - 5 * s); g.stroke();
  };
  const geese = (g, t) => {
    const u = (t - BAR) / 2.7; if (u <= 0) return;
    const a = 1 - JQ.smooth(1.0, 1.35, u); if (a <= 0) return;
    const cx = JQ.lerp(1600, 860, u), cy = JQ.lerp(540, 200, u) - Math.sin(Math.min(u, 1) * Math.PI) * 40, sc = Math.max(0.35, JQ.lerp(1.45, 0.6, u));
    g.save(); g.globalAlpha = a;
    [[0, 0], [1, -1], [1, 1], [2, -1], [2, 1], [3, -1], [3, 1]].forEach(([k, sd], i) => goose(g, cx + k * 52 * sc, cy + sd * k * 28 * sc + Math.sin(t * 2 + i) * 3, sc, t * 9 + i * 1.3));
    g.restore();
  };
  const ripples = (g, t) => {
    for (let i = 0; i < 14; i++) {
      const x = L.pond.cx + (JQ.hash(i, 1) - 0.5) * L.pond.rx * 1.7, y = L.pond.cy + (JQ.hash(i, 2) - 0.5) * L.pond.ry * 1.5;
      const per = 1.1 + JQ.hash(i, 3) * 1.3, age = ((t / per + JQ.hash(i, 4)) % 1), r = 4 + age * 34;
      g.strokeStyle = `rgba(22,19,15,${0.42 * (1 - age)})`; g.lineWidth = 1.2;
      g.beginPath(); g.ellipse(x, y, r, r * 0.33, 0, 0, TAU); g.stroke();
    }
  };
  const rain = (g, t) => {
    g.strokeStyle = 'rgba(22,19,15,0.30)'; g.lineWidth = 1.1; g.beginPath();
    for (let i = 0; i < 420; i++) {
      const v = 540 + JQ.hash(i, 7) * 300, x0 = JQ.hash(i, 8) * 2005 - 40, y = (JQ.hash(i, 9) * 1100 + t * 270) % 1100 - 20;
      const x = x0 + (20 - y) * 0.28;
      g.moveTo(x, y); g.lineTo(x - 9, y + 30);
    }
    g.stroke();
  };

  const HOU = JQ.TERMS[1].hou, NEU = [56, -2], DIP = [48, -42], LAY = [52, 24], BOW = [58, 26], CPD = 2 / 3;
  const CYC = [[3, 0.267], [4, 0.933]];                    // [fish index, cycle start]: each fish is laid at p = 0.6, so 0.667 s and IMP
  const mixv = (A, B, k) => A.map((v, i) => JQ.lerp(v, B[i], k));
  const otterAt = t => {
    for (let c = 0; c < CYC.length; c++) {
      const [k, s0] = CYC[c], p = (t - s0) / CPD, last = c === CYC.length - 1;
      if (t < s0) return { x: oxAt(k), head: NEU, walk: 0, carry: null, laid: k, p: -1, k };
      if (p >= 1 && !last) continue;
      let x = oxAt(k), head = NEU, walk = 0, carry = null, laid = k;
      if (p < 0.25) head = mixv(NEU, DIP, JQ.smooth(0, 0.25, p));
      else if (p < 0.4) { head = DIP; carry = { u: 0, a: JQ.smooth(0.26, 0.36, p) }; }
      else if (p < 0.6) { const u = JQ.smooth(0.4, 0.6, p); head = mixv(DIP, LAY, u); carry = { u, a: 1 }; }
      else if (p < 0.72 || last) { head = mixv(LAY, NEU, JQ.smooth(0.6, 0.72, p)); laid = k + 1; }
      else { const u = JQ.smooth(0.72, 1, p); x = JQ.lerp(oxAt(k), oxAt(k + 1), u); walk = u * Math.PI * 4; laid = k + 1; }
      if (last && t > 1.75) { const b = Math.max(0, Math.sin(JQ.clamp((t - 1.75) / 0.85) * Math.PI * 2)); head = mixv(NEU, BOW, b); }   // the 祭: two bows over the row
      return { x, head, walk, carry, laid, p, k };
    }
  };
  const houText = (g, t) => {
    const h = Math.min(2, Math.floor(t / BAR)), b0 = h * BAR;
    g.fillStyle = INK; g.font = '52px "Xingkai SC", "Kaiti SC", "STKaiti", serif'; g.textAlign = 'left'; g.textBaseline = 'alphabetic';
    [...HOU[h]].forEach((ch, i) => { const a = h ? JQ.smooth(b0 + i * 0.13, b0 + i * 0.13 + 0.15, t) : 1; if (a <= 0) return; g.globalAlpha = a; g.fillText(ch, 1290, 134 + i * 56); });
    g.globalAlpha = 1;
  };
  // 草木萌动: the held-back greens pop out from the trunk outward; ink sprouts push up by the child
  const greens = (g, t) => {
    if (t < 5.3) return;
    GREEN.forEach(([x, y, r, c, a], i) => { const ta = 5.4 + Math.hypot(x - 505, y - 470) / 420 * 0.9 + JQ.hash(i, 7, 2) * 0.6, k = JQ.clamp((t - ta) / 0.22); if (k > 0) dot(g, x, y, 1.4 * r * Math.min(1, k * 1.3) * (1 + 0.3 * Math.sin(k * Math.PI)), c, a); });
    const C = L.tree.canopy;
    for (let i = 0; i < 300; i++) { const an = JQ.hash(i, 1, 41) * TAU, d = Math.sqrt(JQ.hash(i, 2, 41)) * 0.98, x = C.cx + Math.cos(an) * C.rx * d, y = C.cy + Math.sin(an) * C.ry * d * 0.95, ta = 5.45 + d * 1.0 + JQ.hash(i, 3, 41) * 0.5, k = JQ.clamp((t - ta) / 0.22);
      if (k > 0) dot(g, x, y, (3 + JQ.hash(i, 4, 41) * 3.4) * Math.min(1, k * 1.3) * (1 + 0.3 * Math.sin(k * Math.PI)), DOTS[i % 3], an); }
  };
  const SPROUTS = [[300, 1040, 52, 5.5], [334, 1018, 40, 5.75], [368, 1044, 60, 5.95], [196, 1040, 46, 5.65], [232, 1018, 34, 6.1], [404, 1030, 38, 6.25]];
  const sprout = (g, x, y, hgt, k) => {
    if (k <= 0.05) return; const tx = x + 6 * k, ty = y - hgt * k;
    stroke(g, [[x, y], [x + 2, y - hgt * k * 0.5], [tx, ty]], 3.6, x | 0, { step: 4, out: 0.4 });
    const lk = JQ.smooth(0.45, 1, k); if (lk > 0) { stroke(g, [[tx, ty + 2], [tx - 12 * lk, ty - 6 * lk], [tx - 26 * lk, ty - 4 * lk]], 9 * lk, 7 + (x | 0), { color: DOTS[1], out: 0.9 }); stroke(g, [[tx, ty + 2], [tx + 12 * lk, ty - 10 * lk], [tx + 24 * lk, ty - 12 * lk]], 8 * lk, 9 + (x | 0), { color: DOTS[0], out: 0.9 }); }
  };
  JQ.ART[2] = {
    key: IMP, keyHou: JQ.TERMS[1].keyHou, focus: [[820, 990], [1150, 380], [480, 360]], frame: false,
    draw(g, t, Sx) {
      t = JQ.clamp(t, 0, 9); const h = Math.min(2, Math.floor(t / BAR));
      JQ.blit(g, JQ.cached('s02bg-v3', Sx, (bg) => buildBg(bg)));
      houText(g, t); greens(g, t); geese(g, t); ripples(g, t);
      castDraw(g, JQ.castFor(Sx, t));
      SPROUTS.forEach(([x, y, hg, t0]) => sprout(g, x, y, hg, JQ.ease(JQ.clamp((t - t0) / 0.7))));
      const O = otterAt(t);
      otter(g, O.x, O.head, 1, O.walk);
      for (let i = 0; i < O.laid; i++) fish(g, OT.slots[i], OT.fy, OT.len, OT.rot, 1);
      if (O.carry) {   // held crosswise in the mouth, then swung down onto its place in the row
        const u = O.carry.u, r = JQ.lerp(Math.PI - 0.2, Math.PI * 2 + OT.rot, u), hh = OT.len * 0.34;
        const mx = O.x + (O.head[0] + 18) * OT.s, my = OT.y + (O.head[1] + 6) * OT.s;
        fish(g, JQ.lerp(mx - hh * 0.5, OT.slots[O.k], u), JQ.lerp(my + 4, OT.fy, u), OT.len, r, O.carry.a);
      }
      if (O.p > 0.12 && O.p < 0.55) { const u = (O.p - 0.12) / 0.43, r = 10 + u * 70; g.strokeStyle = `rgba(22,19,15,${0.6 * (1 - u)})`; g.lineWidth = 2; g.beginPath(); g.ellipse(oxAt(O.k) + (DIP[0] + 10) * OT.s, OT.y + (DIP[1] - 4) * OT.s, r, r * 0.3, 0, 0, TAU); g.stroke(); }
      // a fish lands: an ink ring and a scatter of drops around its slot (the fifth one is the impact)
      [[3, 2 / 3, 0.6], [4, IMP, 1]].forEach(([k, t0, s]) => { const u = (t - t0) / 0.8; if (u < 0 || u > 1) return; const x = OT.slots[k], y = OT.fy, r = 30 + u * 130 * s;
        g.strokeStyle = `rgba(22,19,15,${0.7 * (1 - u)})`; g.lineWidth = 2.6; g.beginPath(); g.ellipse(x, y, r, r * 0.3, 0, 0, TAU); g.stroke();
        for (let i = 0; i < 9; i++) { const a = -Math.PI * (0.1 + i / 8 * 0.8), v = (90 + JQ.hash(k, i, 4) * 90) * s; dot(g, x + Math.cos(a) * v * u, y + Math.sin(a) * v * u * 0.6 + 120 * u * u, 4.5 * (1 - u), i % 3 ? INK : DOTS[3]); } });
      rain(g, t);
    }
  };
})();
