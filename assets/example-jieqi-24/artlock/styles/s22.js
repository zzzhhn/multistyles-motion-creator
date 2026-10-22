// s22 冬至 · X 光透视. A blue-black radiograph: everything prints by density, edges glow, the frozen ground is see-through.
// Moment (水泉动, with 蚯蚓结 and 麋角解): under the frozen soil a warm spring starts to move, an amber thread that runs
// into the pond bottom; it is the only warm colour on the film (一阳生). Earthworms lie tied in knots underground; the
// 麋鹿 in the field drops an antler, which shows as bright bone. The ox shows its skeleton; the child only a soft glow.
// Unit (8 s = 3 bars, one pentad per bar): 蚯蚓结 loose worms underground coil into knots, tight on beat 3; 麋角解 the big
// 麋鹿's near antler cracks off and hits the ground on beat 3 of bar 2, the far one follows; 水泉动 (key) an amber spark deep
// in the frozen ground runs along the hidden channel and bursts into the pond bottom on beat 3 (6.667 s), and the warmth stays.
(function () {
  const JQ = window.JQ, S = JQ.SCENE, L = JQ.L, W = JQ.W, H = JQ.H, TAU = Math.PI * 2;
  const BAR = 8 / 3, IMP = 2 * BAR + 4 / 3, HOU = JQ.TERMS[21].hou;
  const FILM = '#06111D', CY = [150, 205, 255], BONE = [225, 242, 255];
  const c = (rgb, a) => `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${a})`;
  const MONO = '"Menlo", "Courier New", monospace', HEI = '"Hiragino Sans GB", "STHeiti", "Heiti SC", sans-serif';
  if (document.fonts) document.fonts.load(`72px ${HEI}`, '冬至水泉动');
  // a glowing stroke: wide faint halo, mid, sharp core (call inside 'lighter')
  const glow = (g, path, w, a = 1, rgb = CY) => { g.lineJoin = 'round'; g.lineCap = 'round'; [[w * 5, 0.05], [w * 2.4, 0.12], [w, 0.55]].forEach(([lw, al]) => { g.strokeStyle = c(rgb, al * a); g.lineWidth = lw; g.stroke(path); }); };
  const tissue = (g, path, a = 0.1, rgb = CY) => { g.fillStyle = c(rgb, a); g.fill(path); };
  const line = (pts, closed = false) => JQ.smoothPath(pts, closed);
  const bone = (g, x1, y1, x2, y2, w) => { const p = new Path2D(); p.moveTo(x1, y1); p.lineTo(x2, y2); g.strokeStyle = c(BONE, 0.32); g.lineWidth = w; g.lineCap = 'round'; g.stroke(p); glow(g, p, w * 0.22, 0.9, BONE); [[x1, y1], [x2, y2]].forEach(([x, y]) => { g.fillStyle = c(BONE, 0.5); g.beginPath(); g.arc(x, y, w * 0.62, 0, TAU); g.fill(); }); };

  // ---------------------------------------------------------------- the film base (cached): blue-black, vignette, grain
  const buildFilm = g => {
    g.fillStyle = FILM; g.fillRect(0, 0, W, H);
    const v = g.createRadialGradient(W * 0.5, H * 0.52, 300, W * 0.5, H * 0.52, 1150); v.addColorStop(0, 'rgba(30,60,90,0.35)'); v.addColorStop(1, 'rgba(0,0,0,0.5)'); g.fillStyle = v; g.fillRect(0, 0, W, H);
    const cw = 480, ch = 270, cv = document.createElement('canvas'); cv.width = cw; cv.height = ch; const x = cv.getContext('2d'), im = x.createImageData(cw, ch);
    for (let i = 0; i < cw * ch; i++) { const n = JQ.hash(i, 5); im.data[i * 4] = 170; im.data[i * 4 + 1] = 210; im.data[i * 4 + 2] = 255; im.data[i * 4 + 3] = n > 0.5 ? (n - 0.5) * 34 : 0; }
    x.putImageData(im, 0, 0); g.drawImage(cv, 0, 0, W, H);
  };

  // ---------------------------------------------------------------- static anatomy of the village (drawn additively, then bloomed)
  // (the ox and the family are drawn live from the story track: see family() below)
  const structure = g => {
    g.globalCompositeOperation = 'lighter';
    // far mountains and hills: density falls off downward, ridge edge glows
    g.save(); g.clip(S.mountains.path); const mg = g.createLinearGradient(0, 240, 0, 430); mg.addColorStop(0, c(CY, 0.22)); mg.addColorStop(1, c(CY, 0.03)); g.fillStyle = mg; g.fillRect(0, 200, W, 240); g.restore();
    glow(g, S.ridge.path, 2.2, 0.9); glow(g, JQ.open(S.hills.pts.slice(0, -2)), 1.4, 0.6);
    // the ground surface as a faint skin; under it, strata, stones and the old tree's roots
    glow(g, JQ.open([[0, 600], [1920, 560]]), 1, 0.25);
    S.furrows.forEach((f, i) => glow(g, f.path, 0.8, 0.22 + (i % 2) * 0.1));
    [[640, 0.16], [720, 0.12], [860, 0.1], [1000, 0.08]].forEach(([y, a], i) => { const P = []; for (let x = 0; x <= W; x += 40) P.push([x, y + Math.sin(x * 0.004 + i * 2) * 18 + (JQ.noise(x * 0.01, i, 3) - 0.5) * 20]); glow(g, line(P), 1, a * 1.6); });
    for (let i = 0; i < 42; i++) { const x = JQ.hash(i, 21) * W, y = 650 + JQ.hash(i, 22) * 420, r = 6 + JQ.hash(i, 23) * 16; if (Math.hypot((x - L.pond.cx) / 340, (y - L.pond.cy) / 120) < 1) continue; const p = new Path2D(); p.ellipse(x, y, r, r * 0.7, JQ.hash(i, 24) * 3, 0, TAU); tissue(g, p, 0.16); glow(g, p, 0.9, 0.7); }
    const root = (x, y, a, len, w, d, seed) => { const x2 = x + Math.cos(a) * len, y2 = y + Math.sin(a) * len, p = new Path2D(); p.moveTo(x, y); p.quadraticCurveTo((x + x2) / 2 + Math.sin(seed) * 10, (y + y2) / 2, x2, y2); g.strokeStyle = c(CY, 0.18); g.lineWidth = w; g.stroke(p); glow(g, p, Math.max(0.6, w * 0.18), 0.8);
      if (d < 4) for (let k = 0; k < 2; k++) root(x2, y2, a + (k ? 0.45 : -0.5) + (JQ.hash(d, k, seed) - 0.5) * 0.4, len * 0.68, w * 0.62, d + 1, seed * 3 + k + 1); };
    [[0.35, 120], [1.05, 110], [1.6, 120], [2.75, 80], [0.75, 90]].forEach(([a, l], i) => root(470 + (i - 2) * 12, 832, a, l, 14, 0, i + 2));
    // tree: translucent trunk with a bright pith line and glowing bark edges, limbs as bone-like tubes
    tissue(g, S.trunk.path, 0.16); glow(g, S.trunk.path, 1.6, 0.9); glow(g, line(Array.from({ length: 9 }, (_, j) => [JQ.lerp(478, 506, j / 8) + Math.sin(j) * 3, JQ.lerp(820, 480, j / 8)])), 1.4, 0.7);
    for (const b of S.branches) { const p = new Path2D(); p.moveTo(b.x1, b.y1); p.lineTo(b.x2, b.y2); g.strokeStyle = c(CY, 0.14); g.lineWidth = b.w * 0.9; g.lineCap = 'round'; g.stroke(p); if (b.depth < 4) glow(g, p, Math.max(0.6, b.w * 0.12), 0.6); }
    // stream and the frozen pond: ice is a thin bright lid, water below is dark
    tissue(g, S.stream.path, 0.035); glow(g, S.stream.path, 0.8, 0.28); S.stream.center.forEach(([x, y], i) => { if (i % 4 === 1) glow(g, JQ.open([[x - 10, y], [x + 8, y - 4]]), 0.6, 0.4); });
    glow(g, S.pondRim.path, 1, 0.35); tissue(g, S.pond.path, 0.06); glow(g, S.pond.path, 2.2, 0.9);
    for (let i = 0; i < 14; i++) { const a = JQ.hash(i, 31) * TAU, r = 0.3 + JQ.hash(i, 32) * 0.6, x = L.pond.cx + Math.cos(a) * L.pond.rx * r, y = L.pond.cy + Math.sin(a) * L.pond.ry * r; glow(g, JQ.open([[x, y], [x + 30 + JQ.hash(i, 33) * 50, y + (JQ.hash(i, 34) - 0.5) * 30]]), 0.7, 0.5); }
    // bridge: stone blocks (voussoirs) show as dense wedges
    tissue(g, S.bridge.path, 0.14); glow(g, S.bridge.path, 1.6, 0.9);
    S.bridgeArch.pts.forEach(([x, y], i) => { if (i % 4) return; glow(g, JQ.open([[x, y], [L.bridge.cx + (x - L.bridge.cx) * 1.35, y - 26]]), 0.7, 0.6); });
    // farmhouse: walls thin, beams and rafters dense, nails as points; the 炕 flue inside
    tissue(g, S.wall.path, 0.07); glow(g, S.wall.path, 1.2, 0.7); tissue(g, S.houseFront.path, 0.06); glow(g, S.houseFront.path, 1, 0.5);
    tissue(g, S.roof.path, 0.12); glow(g, S.roof.path, 1.4, 0.9); S.roofLines.forEach(r => glow(g, r.path, 0.6, 0.45));
    glow(g, JQ.open([[1480, 548], [1900, 548]]), 3, 0.8); [1520, 1640, 1760, 1880].forEach(x => glow(g, JQ.open([[x, 548], [x, 600]]), 2.4, 0.7));
    tissue(g, S.chimney.path, 0.12); glow(g, S.chimney.path, 1, 0.6); glow(g, JQ.open([[1575, 470], [1575, 560], [1820, 560]]), 1.2, 0.35);
    tissue(g, S.gate.path, 0.16); glow(g, S.gate.path, 1.6, 0.9); glow(g, S.gateRoof.path, 1.4, 0.8); glow(g, S.window.path, 1, 0.6);
    for (let i = 0; i < 6; i++) { g.fillStyle = c(BONE, 0.9); g.beginPath(); g.arc(1622 + (i % 2) * 56, 700 + Math.floor(i / 2) * 40, 3, 0, TAU); g.fill(); }
    g.globalCompositeOperation = 'source-over';
  };
  // structure, bloomed once: blurred copy added under the sharp copy
  const buildStruct = (g, Sx) => {
    const X = JQ.layer('s22x', Sx); structure(X.g);
    g.globalCompositeOperation = 'lighter'; g.filter = 'blur(7px)'; g.globalAlpha = 0.8; JQ.blit(g, X); g.filter = 'none'; g.globalAlpha = 1; JQ.blit(g, X); g.globalCompositeOperation = 'source-over';
  };
  // film edge, ID flasher, lead marker, scale bar (cached)
  const buildFront = g => {
    g.fillStyle = '#02070D'; g.beginPath(); g.rect(0, 0, W, H); g.rect(28, 28, W - 56, H - 56); g.fill('evenodd');
    g.strokeStyle = c(CY, 0.25); g.lineWidth = 1.5; g.strokeRect(28, 28, W - 56, H - 56);
    g.fillStyle = '#02070D'; g.beginPath(); g.moveTo(W - 28, 28); g.lineTo(W - 28, 74); g.arc(W - 28, 51, 23, Math.PI / 2, -Math.PI / 2); g.fill();
    // ID flasher: the light printed patch exposed onto the film corner
    const x0 = 1468, y0 = 60, w = 400, h = 200;
    g.fillStyle = 'rgba(206,222,234,0.9)'; g.fillRect(x0, y0, w, h); g.strokeStyle = '#0B1622'; g.lineWidth = 2; g.strokeRect(x0 + 8, y0 + 8, w - 16, h - 16);
    g.fillStyle = '#0B1622'; g.textBaseline = 'alphabetic'; g.textAlign = 'left';
    g.font = `700 80px ${HEI}`; g.fillText('冬至', x0 + 26, y0 + 104);
    g.fillRect(x0 + 214, y0 + 112, 160, 3);
    g.font = `22px ${MONO}`; g.fillText('KV 48  mAs 12  FILM 35×43', x0 + 26, y0 + 180);
    // lead marker "R" and a scale bar
    g.fillStyle = 'rgba(235,245,255,0.92)'; g.fillRect(70, 66, 58, 64); g.fillStyle = FILM; g.font = `700 54px ${MONO}`; g.textAlign = 'center'; g.fillText('R', 99, 118);
    g.strokeStyle = 'rgba(235,245,255,0.85)'; g.lineWidth = 2; g.beginPath(); g.moveTo(1560, 1030); g.lineTo(1860, 1030);
    for (let i = 0; i <= 30; i++) { const x = 1560 + i * 10; g.moveTo(x, 1030); g.lineTo(x, 1030 - (i % 10 ? (i % 5 ? 8 : 13) : 20)); } g.stroke();
    g.fillStyle = 'rgba(235,245,255,0.85)'; g.font = `18px ${MONO}`; g.textAlign = 'left'; g.fillText('0', 1556, 1004); g.fillText('10cm', 1836, 1004);
  };

  // ---------------------------------------------------------------- animated: knotted worms, the spring, the 麋鹿
  // each worm is a loose wavy line that coils into a trefoil knot, pulled tight on beat 3 of bar 1
  const WORMS = [[200, 742, 19, 0.3], [186, 962, 18, -0.5], [700, 712, 16, 1.1], [340, 676, 14, 2.2]];   // clear of the family at the gate and the roots
  const worms = (g, t) => {
    const kn = JQ.ease(JQ.clamp((t - 0.25) / (4 / 3 - 0.25)));
    WORMS.forEach(([x, y, s, rot], wi) => {
      const P = [], ca = Math.cos(rot), sa = Math.sin(rot);
      for (let i = 0; i <= 90; i++) { const k = i / 90, q = 0.22 + k * (TAU - 0.44), r = 1 + 0.06 * Math.sin(3 * q + t * Math.PI + wi);
        const u1 = (Math.sin(q) + 2 * Math.sin(2 * q)) * s * r, v1 = (Math.cos(q) - 2 * Math.cos(2 * q)) * s * r, u0 = (k - 0.5) * 12 * s, v0 = Math.sin(k * 3 * Math.PI + t * 2 + wi) * 1.2 * s;
        const u = JQ.lerp(u0, u1, kn), v = JQ.lerp(v0, v1, kn); P.push([x + u * ca - v * sa, y + u * sa + v * ca]); }
      const p = line(P); g.strokeStyle = c(CY, 0.16); g.lineWidth = 13; g.lineCap = 'round'; g.stroke(p); glow(g, p, 1.6, 0.85);
      for (let i = 3; i < P.length - 3; i += 4) { const a = P[i - 1], b = P[i + 1], dx = b[0] - a[0], dy = b[1] - a[1], d = Math.hypot(dx, dy) || 1; g.strokeStyle = c(CY, 0.35); g.lineWidth = 1; g.beginPath(); g.moveTo(P[i][0] - dy / d * 6, P[i][1] + dx / d * 6); g.lineTo(P[i][0] + dy / d * 6, P[i][1] - dx / d * 6); g.stroke(); }
      const e = P[P.length - 1]; g.fillStyle = c(BONE, 0.6); g.beginPath(); g.arc(e[0], e[1], 5, 0, TAU); g.fill();
    });
  };
  // the family under the beam. People: only a soft luminous outline, no bones. Cattle: faint hide, dense skeleton (the ox
  // from its story position and facing; the calf a lighter frame). Props print by density: bowls and iron bright, straw faint.
  const oxBones = (g, o) => {
    const dv = o.pose === 'lie' ? -0.17 : 0, OX = (u, v) => [o.x + u * 300 * o.s * o.dir, o.y - (v + dv) * 300 * o.s], s = o.s;
    const sp = Array.from({ length: 16 }, (_, i) => { const u = JQ.lerp(-0.47, 0.37, i / 15); return OX(u, 0.49 + Math.sin(i / 15 * Math.PI) * 0.025); });
    sp.forEach(([x, y], i) => { g.fillStyle = c(BONE, 0.45); g.fillRect(x - 6 * s, y - 5 * s, 12 * s, 10 * s); glow(g, JQ.open([[x, y - 5 * s], [x - 2 * o.dir, y - (16 + (i > 9 && i < 14 ? 10 : 0)) * s]]), 1.4, 0.8, BONE); });
    glow(g, line(sp), 1.2, 0.6, BONE);
    for (let i = 0; i < 9; i++) { const u = JQ.lerp(-0.2, 0.24, i / 8), a = OX(u, 0.48), b = OX(u - 0.05, 0.33), d = OX(u - 0.03, 0.2); glow(g, line([a, [b[0] + 8 * s * o.dir, b[1]], d]), 1.6, 0.85, BONE); }
    const pelvis = JQ.P([OX(-0.43, 0.5), OX(-0.31, 0.5), OX(-0.33, 0.4), OX(-0.42, 0.34), OX(-0.47, 0.42)]); tissue(g, pelvis, 0.22, BONE); glow(g, pelvis, 1.4, 0.9, BONE);
    const scap = JQ.P([OX(0.2, 0.5), OX(0.29, 0.48), OX(0.24, 0.33)]); tissue(g, scap, 0.22, BONE); glow(g, scap, 1.2, 0.9, BONE);
    if (o.pose !== 'lie') [[0.19, 0.27], [-0.4, 0.31], [0.255, 0.27], [-0.33, 0.31]].forEach(([tx, ty]) => { const a = OX(tx, ty + 0.06), b = OX(tx + (tx < 0 ? -0.03 : 0.005), 0.12), d = OX(tx, 0.015); bone(g, a[0], a[1], b[0], b[1], 9 * s); bone(g, b[0], b[1], d[0], d[1], 7 * s); });
    const skull = line([[0.4, 0.52], [0.48, 0.545], [0.59, 0.465], [0.64, 0.34], [0.625, 0.28], [0.55, 0.29], [0.47, 0.37], [0.41, 0.44]].map(([u, v]) => OX(u, v)), true);
    tissue(g, skull, 0.2, BONE); glow(g, skull, 1.4, 0.95, BONE);
    const orb = new Path2D(), [ex, ey] = OX(0.53, 0.455); orb.arc(ex, ey, 9 * s, 0, TAU); glow(g, orb, 1.2, 0.9, BONE);
    glow(g, line([OX(0.43, 0.4), OX(0.53, 0.33), OX(0.63, 0.29)]), 1.4, 0.9, BONE);
    for (let i = 0; i < 6; i++) { const [x, y] = OX(0.55 + i * 0.015, 0.31 - i * 0.005); glow(g, JQ.open([[x, y], [x + o.dir, y + 6 * s]]), 0.8, 0.8, BONE); }
  };
  const calfBones = (g, it) => {
    const body = it.parts.reduce((a, p) => p.role === 'calf' && p.pts.length > (a ? a.pts.length : 0) ? p : a, null); if (!body) return;
    const xs = body.pts.map(q => q[0]), ys = body.pts.map(q => q[1]), x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
    g.save(); g.clip(body.path); const sp = line([[x0 + 6, y0 + 8], [(x0 + x1) / 2, y0 + 5], [x1 - 6, y0 + 9]]); glow(g, sp, 1.1, 0.7, BONE);
    for (let i = 1; i < 7; i++) { const x = JQ.lerp(x0, x1, 0.25 + i * 0.07); glow(g, line([[x, y0 + 8], [x - 5, (y0 + y1) / 2], [x - 2, y1 - 6]]), 1, 0.6, BONE); }
    g.restore();
  };
  const family = (g, C) => {
    for (const it of C.items) {
      g.save(); if (it.alpha != null && it.alpha < 1) g.globalAlpha = it.alpha;
      if (it.kind === 'actor' && (it.who === 'woman' || it.who === 'kid')) it.parts.forEach(p => { if (p.role === 'eye') return; tissue(g, p.path, 0.05, BONE); glow(g, p.path, 1.4, 0.9, BONE); });
      else if (it.kind === 'actor') { it.parts.forEach(p => { if (p.role === 'eye') return; const horn = p.role === 'horn'; tissue(g, p.path, horn ? 0.4 : 0.07); glow(g, p.path, horn ? 1.6 : 0.9, horn ? 1 : 0.45); });
        if (it.who === 'ox') oxBones(g, C.state.ox); else calfBones(g, it); }
      else it.parts.forEach(p => { const dense = p.role === 'red' || p.role === 'metal'; tissue(g, p.path, dense ? 0.35 : 0.06, dense ? BONE : CY); glow(g, p.path, dense ? 1.4 : 0.8, dense ? 0.95 : 0.4, dense ? BONE : CY); });
      g.restore();
    }
  };
  const WARM = [255, 150, 60], WARM2 = [255, 214, 150];
  const SPRING = (() => { const P = []; for (let i = 0; i <= 160; i++) { const k = i / 160, x = JQ.lerp(1930, 1060, k), y = JQ.lerp(1036, 930, Math.pow(k, 2.2)) + Math.sin(k * 9) * 14 * (1 - k); P.push([x, y]); } return P; })();
  const T3 = 5.4;
  const spring = (g, t) => {
    if (t < T3) return;
    const f = Math.pow(JQ.clamp((t - T3) / (IMP - T3)), 1.15), n = Math.max(2, Math.round((SPRING.length - 1) * f) + 1), out = 1;
    const P = SPRING.slice(0, n), p = line(P);
    g.lineJoin = 'round'; g.lineCap = 'round';
    [[80, 0.06], [36, 0.15], [16, 0.38]].forEach(([w, a]) => { g.strokeStyle = c(WARM, a * out); g.lineWidth = w; g.stroke(p); });
    g.strokeStyle = c(WARM2, 0.95 * out); g.lineWidth = 5; g.stroke(p);
    for (let k = 0; k < 14; k++) { const q = (k / 14 + t / 2) % 1, i = Math.floor(q * (SPRING.length - 1)); if (i >= n) continue; const [x, y] = SPRING[i]; g.fillStyle = c(WARM2, 0.9 * out); g.beginPath(); g.arc(x, y, 5, 0, TAU); g.fill(); }
    const hd = P[P.length - 1], hg = g.createRadialGradient(hd[0], hd[1], 0, hd[0], hd[1], 40); hg.addColorStop(0, c(WARM2, 0.9 * out)); hg.addColorStop(1, c(WARM, 0)); g.fillStyle = hg; g.fillRect(hd[0] - 40, hd[1] - 40, 80, 80);
    const pk = JQ.smooth(IMP - 0.08, IMP + 0.5, t), e = t - IMP;
    if (pk > 0.01) {
      g.save(); g.clip(S.pond.path);
      const pg = g.createRadialGradient(1050, 930, 10, 1050, 900, 320); pg.addColorStop(0, c(WARM, 0.66 * pk)); pg.addColorStop(1, c(WARM, 0)); g.fillStyle = pg; g.fillRect(680, 760, 740, 240);
      for (let k = 0; k < 11; k++) { const q = (k / 11 + t * 0.75) % 1, x = 1050 + Math.sin(k * 2.1 + q * 6) * 30 + (k - 5) * 16, y = 930 - q * 150; g.strokeStyle = c(WARM2, 0.8 * pk * (1 - q)); g.lineWidth = 1.6; g.beginPath(); g.arc(x, y, 4 + k % 3 * 2, 0, TAU); g.stroke(); }
      g.restore();
    }
    // the burst on the impact: a warm shock ring through the pond and a flash at the mouth of the channel
    if (e > -0.03 && e < 1.1) { const k = Math.max(0, e) / 1.1;
      g.strokeStyle = c(WARM2, 0.9 * (1 - k)); g.lineWidth = 6 * (1 - k) + 1; g.beginPath(); g.ellipse(1060, 925, 40 + k * 420, 14 + k * 130, 0, 0, TAU); g.stroke();
      const fg = g.createRadialGradient(1060, 928, 0, 1060, 928, 160); fg.addColorStop(0, c(WARM2, 0.9 * (1 - k))); fg.addColorStop(1, c(WARM, 0)); g.fillStyle = fg; g.fillRect(900, 768, 320, 320); }
  };
  // 麋鹿 in the field (faces left); its antler beams sweep back with backward tines, the way 麋鹿 antlers do
  const DX = 1010, DY = 646, DS = 1.7;
  const ANT = [[[0, 0], [4, -32], [18, -64], [38, -90], [62, -102]], [[6, -38], [32, -46]], [[18, -68], [44, -70]], [[2, -12], [-18, -44]]];
  const antler = (g, x, y, rot, a, s = 1) => {
    if (a <= 0.01) return;
    g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s);
    ANT.forEach((seg, i) => { const p = line(seg); g.strokeStyle = c(BONE, 0.3 * a); g.lineWidth = i ? 7 : 10; g.lineCap = 'round'; g.stroke(p); glow(g, p, i ? 1.6 : 2.2, a, BONE); });
    g.fillStyle = c(BONE, 0.7 * a); g.beginPath(); g.arc(0, 0, 6, 0, TAU); g.fill();
    g.restore();
  };
  const DEER = (() => {
    const o = (pts, closed) => line(pts.map(([u, v]) => [DX + u, DY + v]), closed);
    return { body: o([[-60, -112], [-10, -122], [50, -118], [76, -104], [78, -80], [50, -66], [-20, -64], [-56, -74], [-62, -96]], true),
      neck: o([[-56, -100], [-66, -132], [-78, -160], [-66, -164], [-48, -132], [-36, -110]], true),
      head: o([[-68, -162], [-84, -172], [-112, -156], [-124, -142], [-104, -136], [-80, -142]], true),
      ear: o([[-74, -166], [-58, -182], [-64, -164]], true), tail: o([[74, -102], [88, -84], [90, -58], [82, -60], [78, -84]], true),
      legs: [[[-46, -72], [-52, -36], [-48, 0]], [[-30, -68], [-28, -34], [-32, 0]], [[52, -76], [64, -40], [54, 0]], [[38, -72], [46, -36], [40, 0]]].map(L2 => L2.map(([u, v]) => [DX + u, DY + v])) };
  })();
  const deer = (g, t) => {
    [DEER.body, DEER.neck, DEER.head, DEER.ear, DEER.tail].forEach(p => { tissue(g, p, 0.08); glow(g, p, 0.9, 0.5); });
    DEER.legs.forEach(L2 => { bone(g, L2[0][0], L2[0][1], L2[1][0], L2[1][1], 6); bone(g, L2[1][0], L2[1][1], L2[2][0], L2[2][1], 5); });
    glow(g, line([[DX - 56, DY - 108], [DX, DY - 112], [DX + 66, DY - 104]]), 1.4, 0.8, BONE);
    for (let i = 0; i < 6; i++) { const u = -30 + i * 12; glow(g, line([[DX + u, DY - 110], [DX + u - 8, DY - 92], [DX + u - 4, DY - 72]]), 1, 0.6, BONE); }
    glow(g, line([[DX - 72, DY - 164], [DX - 96, DY - 160], [DX - 120, DY - 144], [DX - 102, DY - 140], [DX - 76, DY - 146]], true), 1.2, 0.85, BONE);
    // both antlers are cast in 候二: the near one cracks at its pedicle (flash) and hits the ground on beat 3 of the bar (4.0 s),
    // the far one follows half a second later; both then lie in the snow to the end
    const drop = (x0, y0, r0, t0, t1, dx, rot) => { if (t < t0) { antler(g, x0, y0, r0, 1, r0 < 0 ? 0.95 : 1); return; }
      const k = Math.pow(JQ.clamp((t - t0) / (t1 - t0)), 2), af = Math.max(0, t - t1), bounce = 10 * Math.abs(Math.sin(af * 9)) * Math.exp(-af * 5);
      antler(g, x0 + dx * k, JQ.lerp(y0, DY - 6, k) - bounce, r0 + rot * k, 1, r0 < 0 ? 0.95 : 1); };
    drop(DX - 76, DY - 168, -0.12, 4.38, 4.66, 70, -2.0);
    const HIT = BAR + 4 / 3;
    drop(DX - 66, DY - 166, 0.05, HIT - 0.3, HIT, -40, -2.2);
    [[HIT - 0.42, DX - 66, DY - 166, 40], [HIT, DX - 100, DY - 6, 60], [4.66, DX - 6, DY - 6, 46]].forEach(([tf, x, y, r]) => { const fl = JQ.smooth(tf - 0.04, tf, t) * (1 - JQ.smooth(tf, tf + 0.5, t));
      if (fl > 0.01) { const fg = g.createRadialGradient(x, y, 0, x, y, r); fg.addColorStop(0, c(BONE, 0.9 * fl)); fg.addColorStop(1, c(BONE, 0)); g.fillStyle = fg; g.fillRect(x - r, y - r, 2 * r, 2 * r); } });
  };

  JQ.ART[22] = {
    key: IMP, keyHou: JQ.TERMS[21].keyHou, focus: [[200, 850], [DX - 60, DY - 200], [1060, 930]], frame: true,
    draw(g, t, Sx) {
      t = JQ.clamp(t, 0, 9); const h = Math.min(2, Math.floor(t / BAR));
      JQ.blit(g, JQ.cached('s22film', Sx, buildFilm));
      JQ.blit(g, JQ.cached('s22struct', Sx, buildStruct));
      g.globalCompositeOperation = 'lighter';
      worms(g, t); g.save(); g.translate(DX, DY); g.scale(DS, DS); g.translate(-DX, -DY); deer(g, t); g.restore(); spring(g, t); family(g, JQ.castFor(Sx, t));
      g.globalCompositeOperation = 'source-over';
      JQ.blit(g, JQ.cached('s22front', Sx, buildFront));
      // the ID flasher: the pentad is typed in at the head of each bar, and the parameter line follows it
      const b0 = h * BAR, chars = [...HOU[h]], typed = h ? Math.min(chars.length, Math.floor((t - b0 - 0.05) / 0.09) + 1) : chars.length;
      g.fillStyle = '#0B1622'; g.textBaseline = 'alphabetic'; g.textAlign = 'left'; g.font = `500 44px ${HEI}`;
      if (typed > 0) g.fillText(chars.slice(0, typed).join(''), 1468 + 214, 60 + 100);
      if (typed < chars.length && Math.floor(t * 8) % 2 === 0) g.fillRect(1468 + 214 + Math.max(0, typed) * 46, 60 + 64, 22, 40);
      g.font = `22px ${MONO}`; g.fillText('JQ-22 · 黄经 270° · ' + ['第一候', '第二候', '第三候'][h], 1468 + 26, 60 + 150);
    },
  };
})();
