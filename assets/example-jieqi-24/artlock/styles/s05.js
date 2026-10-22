// s05 清明 · 丰子恺漫画. Paper white everywhere; one-pass brush lines that swell and thin; thin watercolour laid loosely
// inside them; the child is faceless; one line of brush inscription in a corner. Moment (虹始见 with 田鼠化为鴽): a light
// drizzle stops, the child flies a swallow kite, a field mouse hops and lands as a quail (the comic leaves the mouse as a
// pale ghost and a dotted hop line), and a pale rainbow comes out behind the hills.
(function () {
  const JQ = window.JQ, S = JQ.SCENE, L = JQ.L, TAU = Math.PI * 2;
  const PAPER = '#F6F1E4', INK = '#1E1A16';
  const spline = (P, step = 6) => {
    const out = [];
    for (let i = 0; i < P.length - 1; i++) {
      const p0 = P[Math.max(0, i - 1)], p1 = P[i], p2 = P[i + 1], p3 = P[Math.min(P.length - 1, i + 2)];
      const n = Math.max(2, Math.ceil(Math.hypot(p2[0] - p1[0], p2[1] - p1[1]) / step));
      for (let j = 0; j < n; j++) { const u = j / n, u2 = u * u, u3 = u2 * u; out.push([0, 1].map(k => 0.5 * (2 * p1[k] + (-p0[k] + p2[k]) * u + (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * u2 + (-p0[k] + 3 * p1[k] - 3 * p2[k] + p3[k]) * u3))); }
    }
    out.push(P[P.length - 1]); return out;
  };
  // one brush line: presses in, swells, lifts off; width wobbles a little with the hand
  const brush = (g, ctrl, w, seed = 1, col = INK, o = {}) => {
    const P = ctrl.length > 2 && !o.raw ? spline(ctrl, o.step || 6) : (o.raw ? ctrl : spline(ctrl, 6)), n = P.length; if (n < 2) return;
    const A = [], B = [];
    for (let i = 0; i < n; i++) {
      const a = P[Math.max(0, i - 1)], b = P[Math.min(n - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], d = Math.hypot(dx, dy) || 1, q = i / (n - 1);
      const hw = 0.5 * w * (0.35 + 0.65 * JQ.smooth(0, 0.12, q)) * (1 - 0.75 * JQ.smooth(o.lift || 0.7, 1, q)) * (0.75 + 0.5 * JQ.noise(i * 0.08, 0.3, seed));
      A.push([P[i][0] - dy / d * hw, P[i][1] + dx / d * hw]); B.push([P[i][0] + dy / d * hw, P[i][1] - dx / d * hw]);
    }
    const p = new Path2D(); [...A, ...B.reverse()].forEach(([x, y], i) => i ? p.lineTo(x, y) : p.moveTo(x, y)); p.closePath();
    g.fillStyle = col; g.fill(p);
  };
  // thin watercolour: laid a little off the line, with a darker pooled edge
  const wash = (g, path, col, a, dx = 5, dy = 4) => {
    g.save(); g.translate(dx, dy); g.globalAlpha = a; g.fillStyle = col; g.fill(path);
    g.globalAlpha = a * 0.6; g.strokeStyle = col; g.lineWidth = 3; g.stroke(path); g.restore();
  };
  const loopLine = (g, pts, w, seed, col, from = 0, to = 1) => { const n = pts.length, a = Math.floor(from * n), b = Math.floor(to * n); brush(g, pts.slice(a, b), w, seed, col, { raw: true }); };
  const paper = g => {
    g.fillStyle = PAPER; g.fillRect(0, 0, JQ.W, JQ.H);
    const R = JQ.rng(505); g.fillStyle = 'rgba(140,120,90,0.07)'; for (let i = 0; i < 1400; i++) g.fillRect(R() * 1920, R() * 1080, 1 + R() * 3, 0.9);
  };
  const scene = g => {
    // hills: one light ink ridge with a pale blue-grey wash; a second fainter line
    wash(g, S.mountains.path, '#9FB3BE', 0.22, 0, 6);
    loopLine(g, S.ridge.pts, 4.2, 11, 'rgba(30,26,22,0.8)', 0, 0.48); loopLine(g, S.ridge.pts, 4.2, 12, 'rgba(30,26,22,0.8)', 0.5, 1);
    brush(g, S.hills.pts.slice(0, -2).filter((_, i) => i % 3 === 0), 1.8, 13, 'rgba(30,26,22,0.4)');
    // field: pale green strips and a few long ridge lines
    wash(g, S.field.path, '#C9AE85', 0.24, 0, 0);   // ploughed in 惊蛰 and 春分
    [1, 3, 5, 7].forEach((k, i) => { const [p0, p1, p2] = S.furrows[k].pts; brush(g, [[p0[0] - 10, p0[1]], [p1[0] * 0.5, (p0[1] + p1[1]) / 2 + 4], p1, p2], 2.6 - i * 0.2, 20 + k, 'rgba(30,26,22,0.6)'); });
    for (let i = 0; i < 46; i++) { const x = 30 + i * 41 + JQ.hash(i, 1, 9) * 20, y = 470 + JQ.hash(i, 2, 9) * 190; brush(g, [[x, y], [x + 16, y - 1]], 2.6, 40 + i, 'rgba(110,85,60,0.5)'); }
    // the path and the stream
    const P = S.path.pts; brush(g, [P[1], P[2], P[3], P[4]], 2.2, 50, 'rgba(30,26,22,0.45)'); brush(g, [P[0], P[7], P[6], P[5]], 2.2, 51, 'rgba(30,26,22,0.45)');
    const sn = S.stream.center.length; wash(g, S.stream.path, '#8FB6C9', 0.32, 2, 2);
    brush(g, S.stream.pts.slice(0, sn), 2.6, 60); brush(g, S.stream.pts.slice(sn).reverse(), 2.6, 61);
    // the pond: a loose brush ring, a blue wash, two water lines
    wash(g, S.pond.path, '#8FB6C9', 0.34, 6, 3);
    const pp = S.pond.pts; loopLine(g, pp, 5, 70, INK, 0.02, 0.52); loopLine(g, pp, 3.2, 71, 'rgba(30,26,22,0.7)', 0.55, 0.98);
    brush(g, [[840, 860], [920, 864], [990, 858]], 1.8, 72, 'rgba(30,26,22,0.5)'); brush(g, [[1030, 912], [1110, 916], [1170, 910]], 1.8, 73, 'rgba(30,26,22,0.5)');
    // the bridge: deck, arch, two stone lines
    const Bq = L.bridge; wash(g, S.bridge.path, '#B8B2A6', 0.35, 3, 2);
    brush(g, [[Bq.cx - Bq.half - 28, Bq.deckY + 20], [Bq.cx - Bq.half, Bq.deckY], [Bq.cx + Bq.half, Bq.deckY - 1], [Bq.cx + Bq.half + 28, Bq.deckY + 20]], 4, 80);
    brush(g, S.bridgeArch.pts.slice().sort((a, b) => a[0] - b[0]), 3.4, 81);
    // the farmhouse: grey wash roof with a few tile strokes, a loose wall, a dark gate
    const H = L.house;
    wash(g, S.roof.path, '#8E949A', 0.4, 4, 3); brush(g, [[H.roofX0 - 6, H.eaveY], [H.roofX1 + 6, H.eaveY - 2]], 5, 90); brush(g, [[H.roofX0 + 40, H.ridgeY + 1], [H.roofX1 - 34, H.ridgeY]], 4, 91);
    S.roofLines.forEach((r, i) => { if (i % 3 === 1) brush(g, r.pts, 2, 92 + i, 'rgba(30,26,22,0.55)'); });
    brush(g, [[H.roofX0 + 24, H.eaveY], [H.roofX0 + 26, H.wallTop]], 2.4, 95); brush(g, [[H.roofX1 - 12, H.eaveY], [H.roofX1 - 12, H.wallTop]], 2.4, 96);
    g.fillStyle = 'rgba(30,26,22,0.8)'; g.fill(S.window.path); g.fillStyle = 'rgba(30,26,22,0.85)'; g.fill(S.chimney.path);
    wash(g, S.wall.path, '#D9CDB4', 0.45, 0, 0); brush(g, [[H.wallX0 - 10, H.wallTop - 6], [H.wallX1 + 4, H.wallTop - 8]], 7, 97);
    brush(g, [[H.wallX0, H.wallTop], [H.wallX0 + 3, H.wallBot]], 2.6, 98); brush(g, [[H.wallX0 - 6, H.wallBot], [H.wallX1, H.wallBot - 2]], 2.6, 99);
    wash(g, S.gate.path, '#5A4A3C', 0.75, 0, 0); brush(g, S.gateRoof.pts.slice(0, 3), 4.5, 100);
    // the old tree: two contour strokes and a grey wash for the trunk, brush branches, light leaf dabs and pale 桐 flowers
    wash(g, S.trunk.path, '#7D6E5E', 0.45, 3, 0);
    const tp = S.trunk.pts, half = tp.length / 2; brush(g, tp.slice(0, half), 4.2, 110, INK, { raw: true }); brush(g, tp.slice(half).reverse(), 3.4, 111, INK, { raw: true });
    wash(g, S.canopy.path, '#9CC48A', 0.2, 14, 10);
    S.branches.forEach((b, i) => { if (b.depth > 3) return; brush(g, [[b.x1, b.y1], [(b.x1 + b.x2) / 2 + (JQ.hash(i, 1, 3) - 0.5) * 14, (b.y1 + b.y2) / 2], [b.x2, b.y2]], Math.max(1.6, b.w * 0.55), 120 + i); });
    for (let i = 0; i < 120; i++) { const c = S.clumps[i % S.clumps.length], a = JQ.hash(i, 4, 7) * TAU, d = JQ.hash(i, 5, 7) * c.r * 0.8; brush(g, [[c.x + Math.cos(a) * d, c.y + Math.sin(a) * d * 0.7], [c.x + Math.cos(a) * d + 11, c.y + Math.sin(a) * d * 0.7 - 7]], 8, 140 + i, i % 5 ? 'rgba(95,140,70,0.6)' : 'rgba(150,110,175,0.7)'); }
  };
  JQ._s05 = { PAPER, INK, brush, wash, spline, paper, scene };
})();
(function () {
  const JQ = window.JQ, L = JQ.L, TAU = Math.PI * 2, K = JQ._s05, { INK, brush } = K;
  const M0 = [930, 640], Q1 = [1136, 630];
  // the family as 子恺 draws people: faceless, one swelling brush line round each part, thin colour laid a little off the line
  const FILLS = { skin: ['#F2D6BC', 0.5], coat: ['#9DB59A', 0.55], pants: ['#6E7F8E', 0.45], apron: ['#E8E2D2', 0.7], scarf: ['#C98A7A', 0.55], hat: ['#D9BE7E', 0.55], straw: ['#D9BE7E', 0.55], cape: ['#A8916E', 0.5],
    ox: ['#C9A27A', 0.5], oxDark: ['#3A2E25', 0.55], horn: ['#F6F1E4', 1], calf: ['#D8B48C', 0.5], calfDark: ['#3A2E25', 0.5], prop: ['#9C7B58', 0.6], metal: ['#8A8A8A', 0.6], red: ['#E39A86', 0.6] };
  const KIDF = Object.assign({}, FILLS, { coat: ['#8FB0D6', 0.6] });
  const figure = (g, parts, fills, who) => {
    for (const p of parts) {
      if (p.role === 'eye') { if (who === 'ox' || who === 'calf') { g.fillStyle = INK; g.fill(p.path); } continue; }   // faces stay blank
      if (p.role === 'line') { g.fillStyle = 'rgba(30,26,22,0.75)'; g.fill(p.path); continue; }
      const f = fills[p.role]; if (f) { g.fillStyle = K.PAPER; g.fill(p.path); g.save(); g.translate(3, 2); g.globalAlpha = f[1]; g.fillStyle = f[0]; g.fill(p.path); g.restore(); }
      if (p.role === 'hair') { g.fillStyle = INK; g.fill(p.path); continue; }
      const q = p.pts, big = q.length > 12; brush(g, [...q, q[0], q[1]], big ? 4.6 : 3.4, q.length * 13 + Math.round(q[0][0]));
    }
  };
  const fore = g => {
    K.scene(g);
    // one line of brush inscription with a small seal
    g.fillStyle = INK; g.textAlign = 'center'; g.textBaseline = 'top';
    g.font = '84px "Kaiti SC", "STKaiti", serif'; JQ.vtext(g, '清明', 1800, 80, 88);      // the pentad line beside it is written per bar
    g.fillStyle = '#B5372B'; g.fillRect(1724, 92, 36, 36); g.fillStyle = '#F6F1E4'; g.font = '26px "Songti SC", serif'; g.fillText('春', 1742, 96);
  };
  const kite = (g, x, y, a) => {
    g.save(); g.translate(x, y); g.rotate(a);
    const wing = new Path2D(); wing.moveTo(0, -30); wing.bezierCurveTo(-40, -50, -84, -40, -92, -6); wing.bezierCurveTo(-60, -16, -30, -4, -10, 12);
    wing.lineTo(-26, 64); wing.lineTo(0, 30); wing.lineTo(26, 64); wing.lineTo(10, 12); wing.bezierCurveTo(30, -4, 60, -16, 92, -6); wing.bezierCurveTo(84, -40, 40, -50, 0, -30); wing.closePath();
    g.save(); g.translate(4, 3); g.globalAlpha = 0.55; g.fillStyle = '#E39A86'; g.fill(wing); g.restore();
    g.strokeStyle = INK; g.lineWidth = 3; g.lineJoin = 'round'; g.stroke(wing);
    g.fillStyle = 'rgba(80,120,170,0.55)'; [-1, 1].forEach(s => { g.beginPath(); g.ellipse(s * 50, -20, 16, 8, s * 0.2, 0, TAU); g.fill(); });
    g.fillStyle = INK; g.beginPath(); g.arc(0, -34, 9, 0, TAU); g.fill();
    g.restore();
  };
  const mouse = (g, x, y, a, s = 1) => {
    if (a <= 0.01) return; g.save(); g.globalAlpha = a; g.translate(x, y); g.scale(s, s);
    const b = new Path2D(); b.moveTo(46, -12); b.bezierCurveTo(30, -36, -16, -38, -34, -16); b.bezierCurveTo(-42, -2, -30, 6, 0, 6); b.bezierCurveTo(24, 6, 40, 2, 52, -6); b.closePath();
    g.save(); g.translate(3, 2); g.globalAlpha = a * 0.5; g.fillStyle = '#9C8B78'; g.fill(b); g.restore();
    g.strokeStyle = INK; g.lineWidth = 3; g.stroke(b);
    brush(g, [[-34, -8], [-60, -4], [-78, -20], [-92, -14]], 3, 3);
    g.beginPath(); g.ellipse(26, -26, 8, 10, -0.3, 0, TAU); g.stroke(); g.fillStyle = INK; g.beginPath(); g.arc(38, -14, 2.6, 0, TAU); g.fill();
    g.restore();
  };
  const quail = (g, x, y, a, s = 1) => {
    if (a <= 0.01) return; g.save(); g.globalAlpha = a; g.translate(x, y); g.scale(s, s);
    const b = new Path2D(); b.moveTo(44, -40); b.bezierCurveTo(34, -60, 14, -58, 10, -42); b.bezierCurveTo(-14, -44, -44, -30, -54, -16); b.lineTo(-66, -20); b.lineTo(-56, -6);
    b.bezierCurveTo(-40, 6, 14, 8, 30, -6); b.bezierCurveTo(40, -16, 44, -28, 44, -40); b.closePath();
    g.save(); g.translate(3, 2); g.globalAlpha = a * 0.55; g.fillStyle = '#C49A62'; g.fill(b); g.restore();
    g.strokeStyle = INK; g.lineWidth = 3; g.stroke(b);
    g.fillStyle = INK; for (let i = 0; i < 9; i++) { g.beginPath(); g.ellipse(-30 + (i % 5) * 13, -26 + Math.floor(i / 5) * 12 + (i % 2) * 4, 3, 2, 0.4, 0, TAU); g.fill(); }
    g.beginPath(); g.moveTo(44, -44); g.lineTo(56, -40); g.lineTo(44, -36); g.fill(); g.beginPath(); g.arc(32, -46, 2.6, 0, TAU); g.fill();
    g.lineWidth = 2.4; [[-6, 4], [8, 4]].forEach(([u, v]) => { g.beginPath(); g.moveTo(u, v); g.lineTo(u + 2, v + 16); g.lineTo(u + 9, v + 17); g.stroke(); });
    g.restore();
  };
  const SKY = JQ.P([...JQ.SCENE.ridge.pts, [1920, 0], [0, 0]]);
  const BAR = 8 / 3, IMP = 2 * BAR + 4 / 3, HOU = JQ.TERMS[4].hou, MS = 1.25, HT0 = 3.6, HT1 = 4.25, M1 = [926, 652], Q2 = [1150, 640];
  const hop = u => [JQ.lerp(M1[0], Q2[0], u), JQ.lerp(M1[1], Q2[1], u) - Math.sin(u * Math.PI) * 180];
  // 桐始华: pale-purple paulownia panicles open up through the canopy; one bell from each drops to the ground
  const TUNG = [[262, 236, 0.2], [372, 160, 0.45], [508, 132, 0.7], [336, 352, 0.95], [600, 330, 1.2], [646, 184, 2.25], [724, 286, 2.4]];   // the two under the title open after it
  const bell = (g, x, y, r, a) => {                         // a trumpet flower: narrow at the stalk, flared mouth with a spotted throat
    g.save(); g.translate(x, y); g.rotate(a);
    const p = new Path2D(); p.moveTo(-0.22 * r, -r); p.lineTo(0.22 * r, -r); p.quadraticCurveTo(0.4 * r, 0.3 * r, 0.85 * r, r); p.quadraticCurveTo(0, 1.25 * r, -0.85 * r, r); p.quadraticCurveTo(-0.4 * r, 0.3 * r, -0.22 * r, -r); p.closePath();
    g.save(); g.translate(2, 2); g.globalAlpha = 0.6; g.fillStyle = '#C3ACDF'; g.fill(p); g.restore();
    g.strokeStyle = 'rgba(30,26,22,0.78)'; g.lineWidth = 1.5; g.stroke(p);
    g.fillStyle = 'rgba(246,241,228,0.9)'; g.beginPath(); g.ellipse(0, r * 0.98, r * 0.62, r * 0.22, 0, 0, TAU); g.fill();
    g.fillStyle = '#7E5FA6'; [-0.25, 0, 0.25].forEach(u => { g.beginPath(); g.arc(u * r, r * 0.95, r * 0.09, 0, TAU); g.fill(); });
    g.restore();
  };
  const ROWS = [[3, 24], [3, 20], [2, 15], [2, 11], [1, 0]];
  const tung = (g, t) => TUNG.forEach(([x, y, ta], i) => {
    const k = JQ.ease(JQ.clamp((t - ta) / 0.55)); if (k <= 0) return;
    brush(g, [[x + 2, y + 52], [x + 1, y + 14], [x - 1, y + 46 - 96 * k]], 2.6, 600 + i, 'rgba(60,50,40,0.75)');
    ROWS.forEach(([n, w], r) => { const kb = JQ.clamp(k * 1.7 - r * 0.17); if (kb <= 0) return; for (let j = 0; j < n; j++) { const off = n === 1 ? 0 : (j / (n - 1) - 0.5) * 2 * w; bell(g, x + off, y + 36 - r * 19, 12 * kb, off * 0.035 + (j % 2 ? 0.3 : -0.3)); } });
    const u = JQ.clamp((t - ta - 0.8) / 2.4), gy = 700 + i * 34; if (u > 0 && i % 2 === 0) { const fy = JQ.lerp(y + 40, gy, u * u), fx = x + 30 + Math.sin(u * 7 + i) * 26 + u * 40; bell(g, fx, fy, 10, u < 1 ? u * 9 + i : 1.4); }
  });
  const BOWC = ['#E7A3A0', '#ECC394', '#E9DD9C', '#AFD3A2', '#A2C0E0', '#BCAAD6'];
  // 虹始见: after the drizzle stops the bow is laid in one sweep from its left foot, finishing exactly on the impact
  const rainbow = (g, t) => {
    const k = JQ.ease(JQ.clamp((t - 5.8) / (IMP - 5.8))); if (k <= 0) return;
    const pop = t > IMP ? 1 + 0.6 * Math.exp(-(t - IMP) * 4) : 1;
    g.save(); g.clip(SKY); g.lineWidth = 12; g.lineCap = 'round';
    BOWC.forEach((c, i) => { g.strokeStyle = c; g.globalAlpha = Math.min(1, 0.42 * pop); g.beginPath(); g.arc(1180, 760, 600 - i * 11, Math.PI * 1.1, Math.PI * (1.1 + 0.8 * k)); g.stroke(); });
    g.restore();
  };
  const houText = (g, t) => {
    const h = Math.min(2, Math.floor(t / BAR)), b0 = h * BAR;
    g.fillStyle = INK; g.textAlign = 'center'; g.textBaseline = 'top'; g.font = '54px "Kaiti SC", "STKaiti", serif';
    [...HOU[h]].forEach((ch, i) => { const a = h ? JQ.smooth(b0 + i * 0.12, b0 + i * 0.12 + 0.14, t) : 1; if (a <= 0) return; g.globalAlpha = a; g.fillText(ch, 1724, 150 + i * 58); });
    g.globalAlpha = 1;
  };
  JQ.ART[5] = { key: IMP, keyHou: JQ.TERMS[4].keyHou, focus: [[480, 260], [1040, 560], [1180, 280]], frame: false, draw(g, t, Sx) {
    t = JQ.clamp(t, 0, 9);
    JQ.blit(g, JQ.cached('s05-paper', Sx, K.paper));
    rainbow(g, t);
    JQ.blit(g, JQ.cached('s05-fore-v4', Sx, fore));
    houText(g, t); tung(g, t);
    // the kite rides the wind; the string sags from the child's hand
    const CA = JQ.castFor(Sx, t);
    for (const it of CA.items) {
      g.save(); if (it.alpha != null && it.alpha < 1) g.globalAlpha = it.alpha; figure(g, it.parts, it.who === 'kid' ? KIDF : FILLS, it.who); g.restore();
      if (it.kind === 'kite') { const kp = it.parts.find(p => p.role === 'red'); if (kp) { const [kx, ky] = kp.pts[0]; brush(g, [[kx, ky + 40], [kx - 14, ky + 90], [kx + 6, ky + 140], [kx - 10, ky + 190]], 3, 7, 'rgba(30,26,22,0.6)'); } }
    }
    // 田鼠化为鴽: sit, hop, land as a quail; the comic keeps a ghost of the mouse and a dotted hop line
    const u = JQ.clamp((t - HT0) / (HT1 - HT0));
    if (u > 0) { g.fillStyle = 'rgba(30,26,22,0.55)'; for (let i = 1; i < 18 && i / 18 < u; i++) { const [x, y] = hop(i / 18); g.beginPath(); g.ellipse(x, y - 24, 4.5, 2.8, 0, 0, TAU); g.fill(); } mouse(g, M1[0], M1[1], 0.35 * JQ.smooth(HT0, HT0 + 0.3, t), MS); }
    if (u <= 0) mouse(g, M1[0], M1[1] + Math.sin(t * 9) * 1.5, 1, MS);
    else if (u < 1) { const [x, y] = hop(u), m = JQ.smooth(0.35, 0.65, u); mouse(g, x, y, 1 - m, MS); quail(g, x, y, m, MS); }
    else quail(g, Q2[0], Q2[1] + (t > 5 ? Math.max(0, Math.sin((t - 5) * 5)) * 4 : 0), 1, MS);
    // drizzle through the first two bars, stopping at the start of the third
    const rain = 1 - JQ.smooth(BAR * 2, 5.8, t);
    if (rain > 0.01) { g.strokeStyle = `rgba(30,26,22,${0.24 * rain})`; g.lineWidth = 1.3; g.beginPath();
      for (let i = 0; i < 240; i++) { const x = JQ.hash(i, 1, 55) * 2000, y = (JQ.hash(i, 2, 55) * 1100 + t * 330) % 1100 - 10; g.moveTo(x, y); g.lineTo(x - 6, y + 22); } g.stroke(); }
  } };
})();
