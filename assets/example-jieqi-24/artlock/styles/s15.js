// s15 白露 · 林风眠式 — heavy wet ink lines and opaque gouache blocks, a dramatic sky (deep indigo over a blaze of
// vermilion and orange at the horizon), bent reeds with pale plumes, birds as black silhouettes of a few quick strokes.
// Memory: a 人-shaped skein of wild geese comes in from the right while a flock of swallows leaves to the right; they cross.
// Film unit (8 s, one pentad per bar): 候一 鸿雁来 (key) — the skein glides down out of the burning sky and the lead goose
// lands on the pond exactly at 1.333 s (ink splash, a ring), the rest follow and float on the orange reflection;
// 候二 玄鸟归 — the swallows lined up on the roof ridge take off one after another and leave through the top of the sky;
// 候三 群鸟养羞 — a flock of sparrows flies in and settles on the reed plumes, bending them, and pecks the seed on the beats.
(function () {
  const JQ = window.JQ, S = JQ.SCENE, L = JQ.L, H = L.house;
  const INK = '#141110', BAR = 8 / 3, IMP = 0 * BAR + 4 / 3, HOU = JQ.TERMS[14].hou, XK = '"Xingkai SC", "STXingkai", "Kaiti SC", serif';
  // a wet ink line: resampled, wobbled, a full stroke plus a dry second pass
  const ink = (g, pts, w, closed = false, seed = 1) => {
    const p = JQ.jitter(JQ.resample(pts, 14, closed), w * 0.5, seed, 0.03), path = JQ.smoothPath(p, closed);
    g.strokeStyle = INK; g.lineCap = 'round'; g.lineJoin = 'round'; g.lineWidth = w; g.stroke(path);
    const p2 = JQ.jitter(p, w * 0.35, seed + 9, 0.05); g.globalAlpha = 0.5; g.lineWidth = w * 0.45; g.stroke(JQ.smoothPath(p2, closed)); g.globalAlpha = 1;
  };
  // opaque gouache: a base colour, then broad strokes of neighbouring colours in one direction
  const brush = (g, path, base, cols, ang, n, seed, w0 = 14, w1 = 34, box = [0, 0, 1920, 1080]) => {
    g.save(); if (path) { g.clip(path); } if (base) { g.fillStyle = base; g.fillRect(box[0], box[1], box[2] - box[0], box[3] - box[1]); }
    const R = JQ.rng(seed); g.lineCap = 'butt'; n = Math.round(n * 0.6);
    for (let i = 0; i < n; i++) { const x = box[0] + R() * (box[2] - box[0]), y = box[1] + R() * (box[3] - box[1]), l = 140 + R() * 320, a = ang + (R() - 0.5) * 0.12;
      g.strokeStyle = cols[Math.floor(R() * cols.length)]; g.globalAlpha = 0.16 + R() * 0.3; g.lineWidth = (w0 + R() * (w1 - w0)) * 1.6;
      g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + Math.cos(a) * l / 2, y + Math.sin(a) * l / 2 + (R() - 0.5) * 10, x + Math.cos(a) * l, y + Math.sin(a) * l); g.stroke(); }
    g.globalAlpha = 1; g.restore();
  };
  const sky = g => {
    // bands of brushed colour, top to horizon: indigo, slate blue, a dark cloud bar, vermilion, orange, a hot yellow slit
    const bands = [[0, 80, '#1C2740', ['#24324F', '#162036', '#2C3B5C']], [70, 130, '#46607A', ['#33506E', '#6A7A84', '#2A4562']],
      [122, 300, '#EE9A36', ['#F2AE46', '#E88A30', '#F6C258', '#E07A2E']], [290, 352, '#C8562C', ['#A8402A', '#D8642E', '#B04A2A']], [345, 440, '#F4C050', ['#F8D878', '#ECA840', '#FADB78']]];
    for (const [y0, y1, base] of bands) { g.fillStyle = base; g.fillRect(0, y0, 1920, y1 - y0 + 2); }
    for (const [y0, y1, base, cols] of bands) brush(g, null, null, cols, 0, 300, y0 + 15, 10, 26, [-200, y0 - 18, 2020, y1 + 8]);
    const R = JQ.rng(1515); g.lineCap = 'round';
    for (let i = 0; i < 22; i++) { const y = 296 + R() * 50, x = R() * 1920, l = 160 + R() * 360; g.strokeStyle = R() < 0.5 ? 'rgba(30,22,26,0.75)' : 'rgba(70,40,40,0.6)'; g.lineWidth = 6 + R() * 16;
      g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + l / 2, y - 6 + R() * 12, x + l, y + (R() - 0.5) * 8); g.stroke(); }
  };
  const buildBg = g => {
    sky(g);
    brush(g, S.mountains.path, '#24303E', ['#1A2230', '#33404E', '#3A2E38'], -0.1, 120, 1501, 10, 26, [0, 230, 1920, 440]);
    ink(g, S.ridge.pts, 7, false, 3);
    brush(g, S.hills.path, '#3B4A30', ['#2E3A26', '#4E5A34', '#5A4A2A'], 0, 90, 1502, 8, 20, [0, 360, 1920, 440]);
    brush(g, S.ground.path, '#8A6A3A', ['#7A5A30', '#9C7A44', '#6A5A34', '#A88850'], 0.05, 420, 1503, 14, 36, [0, 560, 1920, 1080]);
    brush(g, S.field.path, '#C8913A', ['#D8A044', '#B07A2E', '#A88A3A', '#E0B050'], 0.03, 360, 1504, 10, 26, [0, 430, 1920, 700]);
    S.furrows.forEach((f, i) => { if (i % 2) ink(g, f.pts, 3 + i * 0.4, false, 20 + i); });
    // 收过的地: rows of dark stubble left by the harvest
    g.save(); g.clip(S.field.path); g.strokeStyle = 'rgba(60,36,16,0.55)'; g.lineCap = 'round';
    for (let r = 0; r < 9; r++) { const k = (r + 0.5) / 9, w = 1.5 + k * 2.2, h = 5 + k * 9; for (let x = (r % 2) * 18; x < 1920; x += 22 + k * 14) { const yb = x < 1180 ? JQ.lerp(JQ.lerp(430, 690, k), JQ.lerp(430, 640, k), x / 1180) : JQ.lerp(JQ.lerp(430, 640, k), JQ.lerp(430, 590, k), (x - 1180) / 740);
      g.lineWidth = w; g.beginPath(); g.moveTo(x, yb); g.lineTo(x + 2, yb - h); g.stroke(); } }
    g.restore();
    brush(g, S.path.path, '#C8B07A', ['#D8C08A', '#B89A64'], 1.9, 60, 1505, 10, 24, [1380, 800, 1700, 1080]);
    brush(g, S.stream.path, '#D88A3A', ['#F2B040', '#C06A2E', '#E8A040'], 1.9, 50, 1506, 6, 14, [1180, 420, 1440, 870]);
    // the pond is a dark mirror of the burning sky
    brush(g, S.pondRim.path, '#4A3A28', ['#3A2C20', '#5A4630'], 0, 80, 1507, 10, 22, [640, 760, 1340, 1010]);
    brush(g, S.pond.path, '#2A3446', ['#E08A34', '#C2502A', '#1C2740', '#F2B33C', '#33506E'], 0, 160, 1508, 8, 20, [680, 780, 1310, 980]);
    ink(g, S.pond.pts, 8, true, 5);
    // bridge, house: white blocks and black blocks, outlined hard
    brush(g, S.bridge.path, '#D8D0C0', ['#C8C0B0', '#E8E2D4'], 0, 30, 1509, 6, 14, [1170, 640, 1410, 720]); ink(g, S.bridge.pts, 6, true, 6);
    brush(g, S.roof.path, '#1E1A18', ['#2C2622', '#141110', '#3A3028'], 0.05, 60, 1510, 8, 18, [1460, 460, 1910, 550]); ink(g, S.roof.pts, 7, true, 7);
    g.fillStyle = INK; g.fill(S.chimney.path);
    brush(g, S.houseFront.path, '#E4DCC8', ['#D8CEB4', '#EEE8D8'], 0, 40, 1511, 8, 18, [1490, 540, 1900, 600]);
    g.fillStyle = INK; g.fill(S.window.path);
    brush(g, S.wall.path, '#E8E2D2', ['#DCD4C0', '#F2EEE2', '#D0C6B0', '#E8C89A'], 0.02, 140, 1512, 10, 26, [1440, 596, 1920, 812]);
    ink(g, S.wall.pts, 7, true, 8); g.fillStyle = INK; g.fill(S.wallCap.path);
    g.fill(S.gate.path); g.fill(S.gateRoof.path);
    // the title: brushed vertical characters and a red seal in the bright sky, inside the camera's safe area
    g.fillStyle = INK; g.textAlign = 'center'; g.textBaseline = 'top';
    g.font = `900 92px ${XK}`; JQ.vtext(g, '白露', 1790, 110, 96);
    g.fillStyle = '#B8282A'; g.fillRect(1769, 318, 42, 42); g.fillStyle = '#F2E4D0'; g.font = '700 28px "Kaiti SC", serif'; g.fillText('秋', 1790, 324);
  };

  // ---------------------------------------------------------------- the tree and the cast (cached)
  const buildFront = g => {
    g.strokeStyle = INK; JQ.drawBranches(g, 2, 1.0);
    brush(g, S.canopy.path, '#26341E', ['#3A4A26', '#1C2616', '#5A6A2E', '#6E7A34'], 0.15, 300, 1520, 12, 30, [170, 110, 790, 520]);
    const R = JQ.rng(1521); g.save(); g.clip(S.canopy.path); g.lineCap = 'round';
    g.lineCap = 'butt';
    for (let i = 0; i < 70; i++) { const x = 200 + R() * 560, y = 130 + R() * 370; g.strokeStyle = ['#E0A030', '#C8502A', '#F0C048', '#A8402A'][i % 4]; g.globalAlpha = 0.35 + R() * 0.35; g.lineWidth = 14 + R() * 16;
      g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + 20, y - 6 + R() * 12, x + 30 + R() * 40, y + (R() - 0.5) * 10); g.stroke(); }
    g.globalAlpha = 1; g.restore();
    // black limbs cross the foliage, as the brush would
    g.strokeStyle = INK; for (const b of S.branches) if (b.depth === 1) { g.lineWidth = b.w * 0.5; g.beginPath(); g.moveTo(b.x1, b.y1); g.lineTo(b.x2, b.y2); g.stroke(); }
    g.fillStyle = INK; g.fill(S.trunk.path); ink(g, S.trunk.pts, 5, true, 31);
    // (the family comes from the story track, painted per frame)
    // paper grain
    const RG = JQ.rng(1522); for (let i = 0; i < 4000; i++) { g.fillStyle = RG() < 0.5 ? 'rgba(0,0,0,0.07)' : 'rgba(255,250,235,0.07)'; g.fillRect(RG() * 1920, RG() * 1080, 2 + RG() * 3, 1 + RG() * 2); }
  };
  // ---------------------------------------------------------------- reeds, bent by the evening wind
  const R0 = JQ.rng(1530), reeds = [];
  const clump = (x0, x1, yb, n, h0, h1) => { for (let i = 0; i < n; i++) reeds.push({ x: x0 + R0() * (x1 - x0), y: yb + R0() * 30, h: h0 + R0() * (h1 - h0), b: 0.5 + R0() * 0.5, ph: R0() * 6.28, plume: R0() < 0.75 }); };
  clump(1240, 1440, 1060, 13, 300, 420); clump(40, 200, 1060, 7, 220, 320); clump(1268, 1320, 850, 5, 120, 160);
  const tipOf = (r, t, ex) => { const bend = (r.b + Math.sin(t * Math.PI + r.ph) * 0.08 + ex) * r.h; return [r.x - bend, r.y - r.h * (0.92 - ex * 0.3), bend]; };
  // story: from 1.4 s the woman cuts the left clump (she stands at x 240 → 200 facing left); reeds right of her sickle are stubs
  const reedCut = t => t < 1.4 ? 1e9 : JQ.lerp(176, 124, JQ.clamp((t - 1.4) / 6.6));
  const drawReeds = (g, t, load) => {
    g.lineCap = 'round'; const cut = reedCut(t); let cutN = 0;
    reeds.forEach((r, ri) => {
      if (ri >= 13 && ri < 20 && r.x > cut) { cutN++; g.strokeStyle = INK; g.lineWidth = 4; g.beginPath(); g.moveTo(r.x, r.y); g.lineTo(r.x - 3, r.y - 26); g.stroke(); return; }
      const [tx, ty, bend] = tipOf(r, t, load(ri));
      // a reed stem breaks at a node and bends: two straight-ish segments, then a leaf blade swinging down
      const nx = r.x - bend * 0.12, ny = r.y - r.h * 0.55;
      g.strokeStyle = INK; g.lineWidth = 4; g.beginPath(); g.moveTo(r.x, r.y); g.lineTo(nx, ny); g.quadraticCurveTo(nx - bend * 0.3, ny - r.h * 0.25, tx, ty); g.stroke();
      g.lineWidth = 6; g.beginPath(); g.moveTo(nx, ny); g.quadraticCurveTo(nx + r.h * 0.2, ny - r.h * 0.05, nx + r.h * 0.28, ny + r.h * 0.12); g.stroke();
      if (r.plume) { g.strokeStyle = 'rgba(236,224,196,0.85)'; g.lineWidth = 7;
        for (let j = 0; j < 4; j++) { g.beginPath(); g.moveTo(tx, ty); g.quadraticCurveTo(tx - 16 - j * 4, ty + 8 + j * 6, tx - 26 - j * 6, ty + 30 + j * 8); g.stroke(); } }
    });
    // the cut reeds, laid in a bundle on the ground beside her, plumes to the right
    for (let i = 0; i < cutN * 2; i++) { const y = 1052 - i * 5, x0 = 270 + (i % 3) * 6, x1 = x0 + 150 + (i % 2) * 18; g.strokeStyle = INK; g.lineWidth = 4; g.beginPath(); g.moveTo(x0, y); g.quadraticCurveTo((x0 + x1) / 2, y - 6, x1, y - 2); g.stroke();
      g.strokeStyle = 'rgba(236,224,196,0.85)'; g.lineWidth = 6; g.beginPath(); g.moveTo(x1, y - 2); g.quadraticCurveTo(x1 + 20, y - 10, x1 + 38, y - 4); g.stroke(); }
    if (cutN) { g.strokeStyle = '#C8562C'; g.lineWidth = 5; g.beginPath(); g.moveTo(330, 1056); g.lineTo(334, 1046 - cutN * 10); g.stroke(); }   // the binding
  };
  // the family in Lin Fengmian's manner: flat gouache fills, each part closed by a heavy wet-ink line
  const PEN = { skin: '#E0B080', hair: INK, coat: '#ECE6D6', pants: '#2A3A5A', apron: '#C8562C', hat: '#33506E', scarf: '#33506E', straw: '#D8C08A', cape: '#8A6A3A', eye: INK,
    ox: '#6A4024', oxDark: '#2A1A10', horn: '#E8DCC0', calf: '#9A6232', calfDark: '#3A2414', prop: '#5A3A20', metal: '#D8D4C8', red: '#B8282A', line: INK };
  const castPaint = (g, items) => { for (const it of items) { const s = JQ.STORY_S(it.y || 1000); g.save(); g.globalAlpha = it.alpha == null ? 1 : it.alpha; g.lineJoin = 'round'; g.strokeStyle = INK; g.lineWidth = 4.2 * s;
    for (const p of it.parts) { const c = JQ.roleColor(PEN, p.role); if (c == null) continue; g.fillStyle = c; g.fill(p.path); if (p.role !== 'eye' && p.role !== 'line' && p.role !== 'hair') g.stroke(p.path); }
    g.restore(); } };
  // ---------------------------------------------------------------- the birds
  const goose = (g, x, y, s, ph) => {          // flying left: a body dash, a long neck, two hooked wings
    const up = Math.cos(ph), p = new Path2D();
    p.moveTo(x + 26 * s, y + 2 * s); p.quadraticCurveTo(x, y - 7 * s, x - 22 * s, y - 2 * s); p.lineTo(x - 44 * s, y - 5 * s); p.lineTo(x - 46 * s, y + 1 * s); p.lineTo(x - 22 * s, y + 5 * s); p.quadraticCurveTo(x, y + 9 * s, x + 26 * s, y + 2 * s);
    g.fillStyle = INK; g.fill(p);
    for (const k of [1, -0.55]) { const tipY = y - 40 * s * up * k, tipX = x + 14 * s; const w = new Path2D();
      w.moveTo(x - 10 * s, y - 2 * s); w.quadraticCurveTo(x - 4 * s, tipY + (y - tipY) * 0.25, tipX, tipY); w.quadraticCurveTo(x + 4 * s, y - (y - tipY) * 0.2, x + 10 * s, y); w.closePath(); g.fill(w); }
  };
  const swallow = (g, x, y, s, ph) => {        // flying right: a dart body, swept sickle wings, a forked tail
    const up = Math.cos(ph) * 0.8, p = new Path2D();
    p.moveTo(x + 16 * s, y); p.quadraticCurveTo(x, y - 5 * s, x - 12 * s, y - 2 * s); p.lineTo(x - 28 * s, y - 10 * s); p.lineTo(x - 18 * s, y); p.lineTo(x - 28 * s, y + 8 * s); p.lineTo(x - 12 * s, y + 3 * s); p.quadraticCurveTo(x, y + 5 * s, x + 16 * s, y);
    g.fillStyle = INK; g.fill(p);
    for (const k of [1, -0.6]) { const w = new Path2D(); w.moveTo(x + 6 * s, y); w.quadraticCurveTo(x - 4 * s, y - 22 * s * up * k, x - 22 * s, y - 30 * s * up * k); w.quadraticCurveTo(x - 2 * s, y - 8 * s * up * k, x - 4 * s, y); w.closePath(); g.fill(w); }
  };
  const flip = (g, x, dir, fn) => { if (dir > 0) return fn(); g.save(); g.translate(2 * x, 0); g.scale(-1, 1); fn(); g.restore(); };
  const bez = (P, u) => { const v = 1 - u; return P.length === 3 ? [0, 1].map(k => v * v * P[0][k] + 2 * v * u * P[1][k] + u * u * P[2][k]) : [0, 1].map(k => v * v * v * P[0][k] + 3 * v * v * u * P[1][k] + 3 * v * u * u * P[2][k] + u * u * u * P[3][k]); };
  // 候一: the skein keeps its 人 while it glides down the leader's path (followers delayed); each goose peels off to
  // its own spot on the pond just before landing; the leader lands at IMP
  // 候一: the skein keeps its 人 while it glides down the leader's path; it enters right of the title band and lands on the
  // back of the pond, clear of the ox standing at the near bank (story); the leader lands at IMP
  const LEAD = [[1420, 210], [1380, 600], [1090, 862]];
  const SKEIN = [[0, 0, 1.45], [74, -16, 1.25], [77, 18, 1.25], [147, -32, 1.25], [154, 35, 1.25], [221, -48, 1.2], [230, 53, 1.2]].map(([dx, dy, s], i) => ({
    O: [dx, dy], s, L: [[1090, 862], [1150, 900], [1070, 826], [1205, 850], [1112, 930], [1236, 904], [1172, 818]][i], T: [IMP, 1.55, 1.7, 1.86, 2.02, 2.2, 2.4][i], dir: [-1, 1, -1, -1, 1, -1, 1][i] }));
  const floater = (g, x, y, dir) => flip(g, x, dir, () => {
    g.fillStyle = 'rgba(20,17,16,0.32)'; g.beginPath(); g.ellipse(x + 4, y + 13, 42, 6, 0, 0, 6.2832); g.fill();
    g.fillStyle = INK; const p = new Path2D(); p.moveTo(x + 38, y - 12); p.quadraticCurveTo(x + 22, y + 10, x - 22, y + 7); p.quadraticCurveTo(x - 34, y, x - 26, y - 8); p.quadraticCurveTo(x, y - 18, x + 38, y - 12); g.fill(p);
    g.strokeStyle = INK; g.lineWidth = 8; g.lineCap = 'round'; g.beginPath(); g.moveTo(x - 20, y - 4); g.quadraticCurveTo(x - 36, y - 22, x - 30, y - 42); g.stroke();
    g.beginPath(); g.ellipse(x - 33, y - 44, 10, 7, -0.2, 0, 6.2832); g.fill(); g.beginPath(); g.moveTo(x - 40, y - 47); g.lineTo(x - 58, y - 42); g.lineTo(x - 41, y - 39); g.fill();
    g.strokeStyle = 'rgba(236,224,196,0.7)'; g.lineWidth = 3; g.beginPath(); g.moveTo(x - 6, y - 6); g.quadraticCurveTo(x + 14, y - 10, x + 30, y - 9); g.stroke(); });
  const splash = (g, x, y, u, big) => { if (u < 0 || u > 1) return; const a = 1 - u, k = big ? 1.6 : 1;
    g.strokeStyle = `rgba(250,224,168,${0.85 * a})`; g.lineWidth = 4; for (const s of big ? [1, 0.6] : [1]) { g.beginPath(); g.ellipse(x, y + 8, (24 + u * 110 * k) * s, (7 + u * 26 * k) * s, 0, 0, 6.2832); g.stroke(); }
    g.strokeStyle = `rgba(20,17,16,${0.9 * a})`; g.lineCap = 'round'; for (let j = 0; j < (big ? 11 : 6); j++) { const an = -Math.PI * (0.12 + 0.76 * j / (big ? 10 : 5)), r0 = 20 + u * 40 * k, r1 = r0 + 18 * k * (1 - u * 0.5);
      g.lineWidth = 5 - u * 3; g.beginPath(); g.moveTo(x + Math.cos(an) * r0, y + Math.sin(an) * r0 * 0.9 - u * 20); g.lineTo(x + Math.cos(an) * r1, y + Math.sin(an) * r1 * 0.9 - u * 20); g.stroke(); } };
  // 候二: swallows on the ridge, taking off one by one and leaving through the top of the sky
  const PERCH = Array.from({ length: 8 }, (_, i) => [1604 + i * 30, 463]);
  const perched = (g, x, y, dir) => flip(g, x, dir, () => { g.fillStyle = INK; g.beginPath(); g.ellipse(x, y - 9, 12, 6.5, -0.45, 0, 6.2832); g.fill(); g.beginPath(); g.arc(x + 8, y - 16, 5.5, 0, 6.2832); g.fill();
    g.strokeStyle = INK; g.lineWidth = 3; g.lineCap = 'round'; g.beginPath(); g.moveTo(x - 8, y - 5); g.lineTo(x - 22, y + 6); g.moveTo(x - 8, y - 5); g.lineTo(x - 18, y + 9); g.stroke(); });
  // 候三: sparrows fly in and settle on the plumes of the right reed clump
  const SPAR = [0, 2, 3, 5, 7, 8, 10, 12].map((ri, i) => ({ ri, F: 2 * BAR + 0.05 + i * 0.06, P: 6.05 + i * 0.08, S0: [-80 + (i % 3) * 40, 250 + i * 22] }));
  const load = (ri, t) => { const s = SPAR.find(q => q.ri === ri); if (!s || t < s.P - 0.05) return 0; const u = t - s.P; return 0.12 * JQ.smooth(-0.05, 0.25, u) + (u > 0 ? 0.05 * Math.sin(u * 14) * Math.exp(-u * 4) : 0); };
  const sparrow = (g, x0, y0, flap, peck) => { g.save(); g.translate(x0, y0); g.scale(1.5, 1.5); const x = 0, y = 0; g.fillStyle = INK; g.beginPath(); g.ellipse(x, y - 8 + peck, 13, 9, -0.2, 0, 6.2832); g.fill(); g.beginPath(); g.arc(x + 11, y - 15 + peck * 1.6, 6.5, 0, 6.2832); g.fill();
    g.beginPath(); g.moveTo(x + 16, y - 17 + peck * 1.6); g.lineTo(x + 24, y - 13 + peck * 2); g.lineTo(x + 16, y - 12 + peck * 1.6); g.fill(); g.beginPath(); g.moveTo(x - 10, y - 9); g.lineTo(x - 26, y - 16); g.lineTo(x - 22, y - 4); g.fill();
    if (flap != null) for (const k of [1, -0.5]) { g.beginPath(); g.moveTo(x - 6, y - 10); g.lineTo(x + 2 - 8 * k, y - 10 - 24 * Math.cos(flap) * k); g.lineTo(x + 8, y - 9); g.fill(); } g.restore(); };
  const brushIn = (g, t) => {          // the pentad line is brushed in, character by character, at the start of its bar
    const i = Math.min(2, Math.floor(t / BAR)), lt = t - i * BAR; g.fillStyle = INK; g.textAlign = 'center'; g.textBaseline = 'top'; g.font = `700 48px ${XK}`;
    if (i > 0 && lt < 0.18) { g.globalAlpha = 1 - lt / 0.18; JQ.vtext(g, HOU[i - 1], 1712, 126, 52); }
    const k = i === 0 ? HOU[0].length : JQ.clamp((lt - 0.12) / 0.6) * HOU[i].length;
    [...HOU[i]].forEach((ch, j) => { const a = JQ.clamp(k - j); if (a <= 0) return; g.globalAlpha = a; g.fillText(ch, 1712, 126 + j * 52 + (1 - a) * 6); });
    g.globalAlpha = 1;
  };

  JQ.ART[15] = {
    key: IMP, keyHou: JQ.TERMS[14].keyHou, focus: [[980, 860], [1500, 360], [1120, 700]], frame: false,
    draw(g, t, Sx) {
      JQ.blit(g, JQ.cached('s15bg', Sx, buildBg));
      const beat = t * Math.PI * 2 * 1.25;
      SKEIN.forEach((q, i) => {
        const hold = i === 0 ? 0.22 : 0.08;              // wings still raised for a moment after touching down
        if (t >= q.T + hold) floater(g, q.L[0], q.L[1] + Math.sin(t * 2 + i) * 2, q.dir);
        splash(g, q.L[0], q.L[1], (t - q.T + 0.06) / (i ? 0.8 : 1.2), i === 0);
        if (t >= q.T + hold) return;
        // the whole skein descends as one 人 on the leader's path; after the leader touches down the others glide to their spots
        const k = JQ.clamp((Math.min(t, IMP) - 0.05) / (IMP - 0.05)), u = k * k * (3 - 2 * k), P = bez(LEAD, u), P2 = bez(LEAD, Math.min(1, u + 0.02));
        let x = P[0] + q.O[0], y = P[1] + q.O[1], wing = JQ.lerp(beat - i * 0.5, 0, JQ.smooth(0.85, 1, k)), tilt = JQ.clamp(Math.atan2(P2[1] - P[1], Math.abs(P2[0] - P[0]) + 1e-3), 0, 1.0) * 0.5 * (1 - JQ.smooth(0.9, 1, k));
        if (i && t > IMP) { const s = JQ.clamp((t - IMP) / (q.T - IMP)), e = JQ.ease(s); x = JQ.lerp(x, q.L[0], e); y = JQ.lerp(y, q.L[1], e) - Math.sin(s * Math.PI) * 24; wing = JQ.lerp(beat - i * 0.5, 0, JQ.smooth(0.7, 1, s)); tilt = 0; }
        g.save(); g.translate(x, y); g.rotate(-tilt); goose(g, 0, 0, q.s, wing); g.restore(); });
      PERCH.forEach(([px, py], i) => { const T0 = BAR + 0.1 + i * 0.09; if (t < T0) { perched(g, px, py, i % 2 ? -1 : 1); return; }
        const u = JQ.clamp((t - T0) / 1.9); if (u >= 1) return; const e = u * u * (3 - 2 * u) * 0.6 + u * 0.4, [x, y] = bez([[px, py - 10], [px - 120, 320], [px - 380 + i * 25, 140], [900 + i * 80, -90]], e);
        flip(g, x, -1, () => swallow(g, x, y, 1.25, t * Math.PI * 2 * 2.5 + i * 0.9)); });
      JQ.blit(g, JQ.cached('s15front', Sx, buildFront));
      castPaint(g, JQ.castFor(Sx, t).items);
      drawReeds(g, t, ri => load(ri, t));
      SPAR.forEach((q, i) => { if (t < q.F) return; const [tx, ty] = tipOf(reeds[q.ri], t, load(q.ri, t));
        if (t < q.P) { const u = JQ.ease((t - q.F) / (q.P - q.F)), [x, y] = bez([q.S0, [tx - 360, ty - 260], [tx, ty - 6]], u); sparrow(g, x, y, t * 40 + i, 0); return; }
        const peck = [6.667, 7.333, 8.0].reduce((m, b) => Math.max(m, Math.exp(-Math.pow((t - b - i * 0.04) / 0.08, 2))), 0) * 6; sparrow(g, tx, ty - 6, null, peck); });
      brushIn(g, t);
    },
  };
})();
