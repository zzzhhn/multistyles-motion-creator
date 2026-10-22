// s13 立秋 · 李可染式积墨逆光 — ink laid down layer on layer until the hills, the tree and the house are nearly black,
// with the light coming from behind them: every silhouette keeps a bright rim of bare paper, mist bands of light lie
// between the planes, the pond and the open gate glow. Black and bright; the only colour is one patch of yellow leaves.
// Film unit (8 s, three pentads, one bar each):
//   候一 凉风至 (key): three white wind strokes, tapered at both ends, are brushed in from the left; at 1.333 s they sweep
//        into the black crown and one patch of leaves lights up yellow; one leaf rides the gust to the threshold.
//   候二 白露降: a band of paper-white mist sinks from the foot of the hills onto the field; dew beads light up one by one
//        on the backlit grass in the lower left.
//   候三 寒蝉鸣: a wet-ink cicada flies onto a twig at the crown's edge and sings on the beats (rings of sound in the sky).
// The kid sits on the threshold in the glowing gateway, and stands up on the path in the third bar; the ox is a few
// strokes of wet ink drinking at the pond.
(function () {
  const JQ = window.JQ, S = JQ.SCENE, L = JQ.L, H = L.house;
  const PAPER = '#F4EEDF', BAR = 8 / 3, IMP = 0 * BAR + 4 / 3, HOU = JQ.TERMS[12].hou;
  const ink = a => `rgba(18,13,9,${a})`, paper = a => `rgba(246,240,226,${a})`, cut = a => `rgba(0,0,0,${a})`;
  const XK = '"Xingkai SC", "STXingkai", "Kaiti SC", serif';
  // dry brush: a bundle of hairs, each broken by irregular gaps, so the paper shows through (飞白)
  const dry = (g, pts, w, col, seed, hairs = 8, taper = true, hw = 1) => {
    const P = JQ.resample(pts, 7, false), n = P.length; g.lineCap = 'butt';
    for (let h = 0; h < hairs; h++) {
      const off0 = (h / Math.max(1, hairs - 1) - 0.5) * w, R = JQ.rng(seed * 31 + h);
      g.strokeStyle = col(0.3 + R() * 0.6); g.lineWidth = (1.4 + R() * 2.8) * hw; g.beginPath(); let on = false;
      for (let i = 0; i < n - 1; i++) {
        const k = i / (n - 1), env = taper ? Math.sin(Math.PI * k) : 1, thr = 0.38 + (1 - env) * 0.5 + Math.abs(off0) / w * 0.25;
        const ink_ = JQ.noise(i * 0.09 + h * 7.3, h * 1.7, seed) > thr;
        const [x, y] = P[i], [x2, y2] = P[i + 1], dx = x2 - x, dy = y2 - y, d = Math.hypot(dx, dy) || 1, off = off0 * (0.6 + 0.4 * env) + (JQ.noise(i * 0.05, h, seed + 5) - 0.5) * 4;
        const ax = x - dy / d * off, ay = y + dx / d * off, bx = x2 - dy / d * off, by = y2 + dx / d * off;
        if (ink_) { if (!on) g.moveTo(ax, ay); g.lineTo(bx, by); on = true; } else on = false;
      }
      g.stroke(); }
  };
  // a whole brush stroke as one filled shape, tapered at both ends (w = full width at the belly)
  const ribbon = (g, P, w, pw = 0.7) => {
    const n = P.length; if (n < 2) return; const up = [], dn = [];
    for (let i = 0; i < n; i++) { const a = P[Math.max(0, i - 1)], b = P[Math.min(n - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], d = Math.hypot(dx, dy) || 1, k = i / (n - 1), hw = w / 2 * Math.pow(Math.sin(Math.PI * k), pw);
      up.push([P[i][0] - dy / d * hw, P[i][1] + dx / d * hw]); dn.push([P[i][0] + dy / d * hw, P[i][1] - dx / d * hw]); }
    g.fill(JQ.smoothPath([...up, ...dn.reverse()]));
  };
  // one ink mass (积墨): a dense base, then many soft overlapping strokes of darker and slightly lighter ink;
  // the backlit rims erased back to paper, dry-brush glints, a nibbled edge, then blitted with a little bleed
  const mass = (g, Sx, path, o) => {
    const T = JQ.layer('s13ink', Sx, { res: 0.5 }), t = T.g, R = JQ.rng(o.seed), [x0, y0, x1, y1] = o.box, ang = o.ang == null ? -1.45 : o.ang;
    t.save(); t.clip(path); t.fillStyle = ink(o.base); t.fillRect(x0, y0, x1 - x0, y1 - y0);
    t.filter = `blur(${1.5 * Sx.scale}px)`; t.lineCap = 'round';
    for (let i = 0; i < o.n; i++) { const x = x0 + R() * (x1 - x0), y = y0 + R() * (y1 - y0), l = 12 + R() * (o.len || 40), a = ang + (R() - 0.5) * 0.7;
      t.strokeStyle = R() < (o.light || 0.15) ? paper(0.04 + R() * 0.1) : ink(0.1 + R() * 0.35); t.lineWidth = 3 + R() * 9;
      t.beginPath(); t.moveTo(x, y); t.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l); t.stroke(); }
    t.filter = 'none';
    if (o.fade) { const gr = t.createLinearGradient(0, o.fade[0], 0, o.fade[1]); gr.addColorStop(0, cut(0)); gr.addColorStop(1, cut(0.92)); t.globalCompositeOperation = 'destination-out'; t.fillStyle = gr; t.fillRect(x0, o.fade[0], x1 - x0, y1 - o.fade[0] + 40); }
    t.restore(); t.globalCompositeOperation = 'destination-out'; t.lineJoin = 'round'; t.lineCap = 'round';
    if (o.rim) for (const [p, w] of o.rim) { t.strokeStyle = cut(0.95); t.lineWidth = w; t.stroke(p); t.strokeStyle = cut(0.3); t.lineWidth = w * 2.6; t.stroke(p); }
    if (o.glints) o.glints.forEach((pts, i) => dry(t, pts, 18, cut, o.seed + 50 + i, 5));
    if (o.holes) { t.filter = `blur(${2 * Sx.scale}px)`; for (let i = 0; i < o.holes; i++) { const x = x0 + R() * (x1 - x0), y = y0 + R() * (y1 - y0) * 0.75; t.fillStyle = cut(0.6 + R() * 0.4); t.beginPath(); t.ellipse(x, y, 4 + R() * 8, 3 + R() * 5, R() * 3, 0, 6.2832); t.fill(); } t.filter = 'none'; }
    t.globalCompositeOperation = 'source-over';
    g.save(); g.filter = `blur(${(o.blur || 1.2) * Sx.scale}px)`; JQ.blit(g, T); g.restore();
  };
  const open = pts => JQ.open(pts);
  const furrowPts = f => JQ.resample(f.pts, 30, false);

  const buildBg = (g, Sx) => {
    g.fillStyle = PAPER; g.fillRect(0, 0, 1920, 1080);
    const sky = g.createLinearGradient(0, 0, 0, 230); sky.addColorStop(0, ink(0.4)); sky.addColorStop(1, ink(0)); g.fillStyle = sky; g.fillRect(0, 0, 1920, 230);
    mass(g, Sx, S.mountains.path, { seed: 1301, box: [0, 230, 1920, 440], base: 0.95, n: 1100, a: 0.4, rim: [[open(S.ridge.pts), 10]], fade: [372, 434], blur: 1.6 });
    mass(g, Sx, S.hills.path, { seed: 1302, box: [0, 350, 1920, 445], base: 0.96, n: 500, a: 0.3, rim: [[open(S.hills.pts.slice(0, -2)), 8]], fade: [420, 452] });
    mass(g, Sx, S.field.path, { seed: 1303, box: [0, 428, 1920, 700], base: 0.8, n: 900, ang: 0.02, len: 90, a: 0.25, light: 0.25, glints: [3, 6].map(i => furrowPts(S.furrows[i])), blur: 1.2 });
    mass(g, Sx, S.ground.path, { seed: 1304, box: [0, 560, 1920, 1080], base: 0.9, n: 1400, ang: 0.05, len: 120, a: 0.3, light: 0.2, rim: [[S.path.path, 6], [S.pondRim.path, 24]], blur: 1.4 });
    const spill = g.createRadialGradient(990, 880, 200, 990, 880, 560); spill.addColorStop(0, 'rgba(246,240,226,0.32)'); spill.addColorStop(1, 'rgba(246,240,226,0)'); g.fillStyle = spill; g.fillRect(400, 600, 1200, 480);
    g.fillStyle = PAPER; g.globalAlpha = 0.85; g.fill(S.path.path); g.globalAlpha = 1;
    dry(g, [[1650, 820], [1600, 940], [1530, 1076]], 60, a => ink(a * 0.5), 1305, 6);
    // the stream and the pond hold the light; a dark lip on the near bank, a few ripple strokes
    g.fillStyle = PAPER; g.fill(S.stream.path); g.fill(S.pond.path);
    const pondGlow = g.createRadialGradient(990, 860, 30, 990, 880, 320); pondGlow.addColorStop(0, 'rgba(255,252,240,0.9)'); pondGlow.addColorStop(1, 'rgba(255,252,240,0)');
    g.save(); g.clip(S.pond.path); g.fillStyle = pondGlow; g.fillRect(680, 780, 640, 200);
    for (let i = 0; i < 6; i++) { const y = 822 + i * 24, x = 740 + JQ.hash(i, 1, 13) * 330; dry(g, [[x, y], [x + 140 + JQ.hash(i, 2, 13) * 160, y + 2]], 5, a => ink(a * 0.55), 1310 + i, 3); }
    g.restore();
    dry(g, S.pondRim.pts.filter(([x, y]) => y > 890).map(([x, y]) => [x, y - 10]), 16, a => ink(a * 0.9), 1306, 6);
    // the bridge: a black arch with a lit deck edge
    mass(g, Sx, S.bridge.path, { seed: 1307, box: [1160, 640, 1420, 722], base: 0.95, n: 80, a: 0.3, rim: [[open(S.bridge.pts.slice(0, 4)), 7], [open(S.bridgeArch.pts), 5]] });
    // the house: black roof and walls, bright ridge and wall-cap rims, a glowing gateway and window
    const house = new Path2D(); [S.roof, S.houseFront, S.chimney, S.wall, S.wallCap, S.gateRoof].forEach(p => house.addPath(p.path));
    mass(g, Sx, house, { seed: 1308, box: [1420, 410, 1920, 815], base: 0.96, n: 700, a: 0.3,
      rim: [[open(S.roof.pts.slice(21)), 9], [open(S.chimney.pts.slice(1, 3)), 6], [open([[H.wallX0 - 10, H.wallTop - 14], [H.wallX1, H.wallTop - 14]]), 8], [open(S.gateRoof.pts.slice(0, 3)), 7], [S.gate.path, 14], [S.window.path, 8]] });
    const glow = g.createRadialGradient(1650, 760, 10, 1650, 760, 130); glow.addColorStop(0, 'rgba(255,250,236,0.95)'); glow.addColorStop(1, 'rgba(255,250,236,0)');
    g.fillStyle = PAPER; g.fill(S.gate.path); g.fill(S.window.path); g.fillStyle = glow; g.fillRect(1510, 630, 280, 220);
    // the old trunk: a black column split by light along both edges
    mass(g, Sx, S.trunk.path, { seed: 1309, box: [400, 460, 580, 840], base: 0.96, n: 120, ang: -1.55, len: 60, a: 0.3, rim: [[S.trunk.path, 5]] });
    // the term name, ink only, inside the camera's safe area (the pentad line is written per frame)
    g.fillStyle = ink(0.92); g.textAlign = 'center'; g.textBaseline = 'top';
    g.font = `400 104px ${XK}`; JQ.vtext(g, '立秋', 1790, 84, 106);
  };
  // ---------------------------------------------------------------- the black crown and the twig (cached); the family is painted per frame
  const C = L.tree.canopy, cand = S.clumps.filter(q => q.r > 56 && q.y > C.cy - 30), first = cand.reduce((a, q) => (q.x - q.r < a.x - a.r) ? q : a, cand[0]);
  const buildFront = (g, Sx) => {
    const crown = new Path2D(); crown.addPath(S.canopy.path); for (const q of S.clumps) { crown.moveTo(q.x + q.r * 0.95, q.y); crown.arc(q.x, q.y, q.r * 0.95, 0, 6.2832); }
    mass(g, Sx, crown, { seed: 1311, box: [160, 90, 800, 540], base: 0.95, n: 1600, len: 22, a: 0.35, light: 0.18, rim: [[S.canopy.path, 15]], holes: 46, blur: 1.4 });
    dry(g, [[736, 272], [800, 248], [868, 224], [934, 212]], 10, ink, 1330, 5, false); dry(g, [[870, 224], [900, 198], [926, 190]], 6, ink, 1331, 3, false);
    // 立秋 in the story: the millet is heading — a row of drooping ink ears along the near edge of the field, rimmed with light
    const R = JQ.rng(1370); g.lineCap = 'round';
    for (let x = 12; x < 1430; x += 13 + R() * 9) { if (x > 425 && x < 555) continue;
      const yb = (x < 1180 ? JQ.lerp(690, 640, x / 1180) : JQ.lerp(640, 590, (x - 1180) / 740)) - 2, h = 40 + R() * 28, lean = (R() - 0.3) * 10, tx = x + lean, ty = yb - h, ex = tx + 16 + R() * 8, ey = ty + 18 + R() * 8;
      const stalk = new Path2D(); stalk.moveTo(x, yb); stalk.quadraticCurveTo(x + lean * 0.3, yb - h * 0.6, tx, ty); const ear = new Path2D(); ear.moveTo(tx, ty); ear.quadraticCurveTo(tx + 12, ty - 8, ex, ey);
      g.save(); g.translate(0, -2.5); g.strokeStyle = paper(0.6); g.lineWidth = 7; g.stroke(ear); g.restore();
      g.strokeStyle = ink(0.92); g.lineWidth = 2; g.stroke(stalk); g.lineWidth = 7; g.stroke(ear); }
  };
  const buildPaper = g => { const R = JQ.rng(1313); for (let i = 0; i < 3000; i++) { const x = R() * 1920, y = R() * 1080, a = R() * Math.PI, l = 3 + R() * 12; g.strokeStyle = R() < 0.5 ? 'rgba(120,96,60,0.07)' : 'rgba(255,252,240,0.1)'; g.lineWidth = 0.8; g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l); g.stroke(); } };
  // the family as backlit ink silhouettes: each figure first stroked in bare paper a little above itself (the light from
  // behind leaves a bright rim on the top edges), then filled with layered ink tones, on a half-size layer with a soft bleed
  const TONE = { skin: 0.62, hair: 0.97, coat: 0.86, pants: 0.93, apron: 0.78, hat: 0.9, scarf: 0.82, straw: 0.7, cape: 0.88, eye: 0.97,
    ox: 0.92, oxDark: 0.98, horn: 0.75, calf: 0.84, calfDark: 0.95, prop: 0.9, metal: 0.98, red: 0.85, line: 0.9 };
  const stoolAt = w => { const s = w.s, x = w.x - 6 * s * w.dir, y = w.y, P = JQ.P, out = [P([[x - 34 * s, y - 64 * s], [x + 34 * s, y - 64 * s], [x + 34 * s, y - 54 * s], [x - 34 * s, y - 54 * s]])];
    [-26, 22].forEach(d => out.push(P([[x + d * s, y - 54 * s], [x + (d + 6) * s, y - 54 * s], [x + (d + 6) * s, y], [x + d * s, y]]))); return out; };
  let STOOL = null;                    // term 13 has her seated with no stool in the story: paint the one she sat on in 大暑
  const castInk = (g, Sx, t) => {
    const Cs = JQ.castFor(Sx, t), T = JQ.layer('s13cast', Sx, { res: 0.5 }), x = T.g; x.lineJoin = 'round';
    if (!STOOL) { const w0 = JQ.cast(13, 0).state.woman; STOOL = w0 ? stoolAt(w0) : []; }
    // the rim: the whole silhouette filled in paper a little up and to each side, so only its top edges stay lit after the ink goes on
    const rim = (paths, k) => { x.fillStyle = paper(0.9); for (const [dx, dy] of [[-1.6 * k, -3.2 * k], [1.6 * k, -3.2 * k]]) { x.save(); x.translate(dx, dy); for (const p of paths) x.fill(p); x.restore(); } };
    rim(STOOL, 0.8); x.fillStyle = ink(0.9); STOOL.forEach(p => x.fill(p));
    for (const it of Cs.items) {
      x.globalAlpha = it.alpha == null ? 1 : it.alpha; const s = it.y ? JQ.STORY_S(it.y) : 1;
      if (it.kind === 'actor') rim(it.parts.map(p => p.path), s);
      for (const p of it.parts) { const v = TONE[p.role]; if (v == null) continue; x.fillStyle = ink(v); x.fill(p.path); }
    }
    x.globalAlpha = 1;
    g.save(); g.filter = `blur(${0.8 * Sx.scale}px)`; JQ.blit(g, T); g.restore();
  };

  // ---------------------------------------------------------------- the three pentads
  // stroke head: brushed in from the left edge at 0.15 s, reaches the yellow patch exactly at IMP, then the gust runs off
  const wind = t => t < IMP ? JQ.lerp(-140, first.x + 20, JQ.clamp((t - 0.15) / (IMP - 0.15))) : JQ.lerp(first.x + 20, 3000, Math.pow(JQ.clamp((t - IMP) / 1.35), 1.4));
  const WIND = [[[[-140, first.y + 46], [first.x, first.y], [900, first.y - 44], [1500, first.y - 70], [2300, first.y - 84]], 0, 44],
    [[[-140, 470], [500, 436], [1100, 412], [2300, 392]], -140, 34], [[[-140, 650], [700, 604], [1400, 586], [2300, 560]], -320, 40]];
  const yAt = (P, x) => { for (let i = 1; i < P.length; i++) if (x <= P[i][0]) return JQ.lerp(P[i - 1][1], P[i][1], (x - P[i - 1][0]) / (P[i][0] - P[i - 1][0])); return P[P.length - 1][1]; };
  const leafAt = t => { const x0 = first.x - first.r * 0.4, y0 = first.y + first.r * 0.1, p = JQ.clamp((t - IMP - 0.1) / 1.17), e = p * p * (3 - 2 * p);
    return { x: JQ.lerp(x0, 486, e), y: JQ.lerp(y0, 1000, 1 - (1 - p) * (1 - p)) + Math.sin(p * 11) * 18 * (1 - p), a: -0.6 + p * 8.4, on: JQ.smooth(IMP, IMP + 0.12, t) }; };   // lands at the seated woman's feet
  const leaf = (g, x, y, a, sz) => { g.save(); g.translate(x, y); g.rotate(a); g.beginPath(); g.moveTo(-sz, 0); g.quadraticCurveTo(0, -sz * 0.55, sz, 0); g.quadraticCurveTo(0, sz * 0.55, -sz, 0); g.fill(); g.restore(); };
  const GRASS = Array.from({ length: 16 }, (_, i) => ({ x: 40 + i * 14 + JQ.hash(i, 1, 1350) * 8, h: 80 + JQ.hash(i, 2, 1350) * 110, lean: -0.2 + JQ.hash(i, 3, 1350) * 0.34, dew: i % 2 ? -1 : 2.9 + (i / 2) * 0.22 }));
  let MIST = null;
  const mistCanvas = () => { if (MIST) return MIST; const c = document.createElement('canvas'); c.width = 400; c.height = 64; const x = c.getContext('2d'), im = x.createImageData(400, 64);
    for (let j = 0; j < 64; j++) for (let i = 0; i < 400; i++) { const o = (j * 400 + i) * 4, v = Math.exp(-Math.pow((j - 32 - (JQ.fbm(i * 0.015, 3, 1361, 3) - 0.5) * 30) / 12, 2)) * Math.pow(JQ.fbm(i * 0.012, j * 0.05, 1360, 4), 1.6) * 1.9 * (1 - JQ.smooth(250, 360, i)); im.data[o] = 246; im.data[o + 1] = 240; im.data[o + 2] = 226; im.data[o + 3] = Math.round(255 * v); }
    x.putImageData(im, 0, 0); return (MIST = c); };
  const CIC = [868, 214];
  const cicada = (g, x, y, a, wing, fly) => {
    g.save(); g.translate(x, y); g.rotate(a); g.lineCap = 'round';
    g.fillStyle = paper(0.75); g.beginPath(); g.ellipse(2, 0, 38, 16, 0, 0, 6.2832); g.fill();                 // the backlit rim
    for (const s of [-1, 1]) { g.save(); g.rotate(s * (0.1 + wing * 0.35) + (fly ? s * Math.sin(fly) * 0.6 : 0)); g.fillStyle = ink(fly ? 0.22 : 0.34);
      g.beginPath(); g.moveTo(-8, 0); g.quadraticCurveTo(30, s * 16, 66, s * 6); g.quadraticCurveTo(40, -s * 2, -8, 0); g.fill();
      g.strokeStyle = ink(0.7); g.lineWidth = 1.6; g.beginPath(); g.moveTo(-6, 0); g.quadraticCurveTo(30, s * 12, 64, s * 6); g.stroke(); g.restore(); }
    g.fillStyle = ink(0.95); g.beginPath(); g.ellipse(4, 0, 30, 12, 0, 0, 6.2832); g.fill(); g.beginPath(); g.ellipse(-28, 0, 11, 13, 0, 0, 6.2832); g.fill();
    g.fillStyle = paper(0.85); g.beginPath(); g.arc(-34, -9, 3, 0, 6.2832); g.arc(-34, 9, 3, 0, 6.2832); g.fill();
    if (!fly) { g.strokeStyle = ink(0.9); g.lineWidth = 2.4; for (const d of [-14, 0, 14]) { g.beginPath(); g.moveTo(d, 8); g.lineTo(d - 6, 18); g.stroke(); } }
    g.restore();
  };
  const houText = (g, t) => {          // the pentad line is brushed in, character by character, at the start of its bar
    const i = Math.min(2, Math.floor(t / BAR)), lt = t - i * BAR; g.fillStyle = ink(0.92); g.textAlign = 'center'; g.textBaseline = 'top'; g.font = `400 52px ${XK}`;
    if (i > 0 && lt < 0.18) { g.globalAlpha = 1 - lt / 0.18; JQ.vtext(g, HOU[i - 1], 1700, 100, 56); }
    const k = i === 0 ? 1 : JQ.clamp((lt - 0.12) / 0.6);
    [...HOU[i]].forEach((ch, j) => { const a = JQ.clamp(k * HOU[i].length - j); if (a <= 0) return; g.globalAlpha = a; g.fillText(ch, 1700, 100 + j * 56 + (1 - a) * 6); });
    g.globalAlpha = 1;
  };

  JQ.ART[13] = {
    key: IMP, keyHou: JQ.TERMS[12].keyHou, focus: [[first.x, first.y], [300, 900], CIC], frame: false,
    draw(g, t, Sx) {
      JQ.blit(g, JQ.cached('s13bg', Sx, buildBg));
      // 候二: the white dew mist sinks from the hills onto the field
      const ma = JQ.smooth(2.7, 3.6, t) * 0.75; if (ma > 0.01) { g.globalAlpha = ma; g.drawImage(mistCanvas(), -60, JQ.lerp(330, 500, JQ.ease((t - 2.7) / 2.0)), 2040, 170); g.globalAlpha = 1; }
      JQ.blit(g, JQ.cached('s13front', Sx, buildFront));
      // the family (story track), backlit ink silhouettes
      castInk(g, Sx, t);
      // 候一: the cool wind, three whole strokes of bare paper with tapered ends, brushed in from the left
      const hx = wind(t);
      WIND.forEach(([P, dx, w], i) => { const xb = hx - dx, xa = Math.max(-140, xb - 900); if (xb <= -100 || xa > 2000) return;
        const fa = i === 0 ? 1 - JQ.smooth(IMP, IMP + 0.45, t) : 1; if (fa <= 0.01) return; g.globalAlpha = fa;   // the top stroke dies in the crown, clear of the title band
        const pts = []; for (let x = xa; x <= xb; x += 22) pts.push([x, yAt(P, x) + Math.sin(x * 0.006 + i) * 10]); if (pts.length < 3) { g.globalAlpha = 1; return; }
        g.fillStyle = paper(0.38); ribbon(g, pts, w * Math.min(1, (xb - xa) / 400 + 0.3), 0.9); dry(g, pts, w * 0.9, a => paper(a * 0.9), 1320 + i, 9, true, 1.1); g.globalAlpha = 1; });
      // the one colour: a patch of leaves lights up yellow as the wind hits the crown
      const yk = JQ.smooth(IMP - 0.05, IMP + 0.1, t), fl = t > IMP - 0.05 ? Math.exp(-Math.pow((t - IMP) / 0.35, 2)) : 0;
      if (yk > 0.001) {
        const gl = g.createRadialGradient(first.x, first.y, 10, first.x, first.y, 120 + fl * 90); gl.addColorStop(0, `rgba(255,200,80,${0.32 * yk + 0.3 * fl})`); gl.addColorStop(1, 'rgba(255,200,80,0)');
        g.fillStyle = gl; g.fillRect(first.x - 220, first.y - 220, 440, 440); g.globalAlpha = yk;
        for (let i = 0; i < 30; i++) { const a = JQ.hash(i, 1, 131) * 6.2832, d = Math.sqrt(JQ.hash(i, 2, 131)) * first.r * 0.8;
          g.fillStyle = i % 3 ? '#E2A82A' : '#F2C64E'; g.beginPath(); g.ellipse(first.x + 10 + Math.cos(a) * d, first.y + Math.sin(a) * d * 0.8, 13, 8, JQ.hash(i, 3, 131) * 3, 0, 6.2832); g.fill(); }
        g.globalAlpha = 1;
      }
      const lf = leafAt(t); if (lf.on > 0.01) { g.globalAlpha = lf.on; g.fillStyle = '#EDB838'; leaf(g, lf.x, lf.y, lf.a, 40); g.globalAlpha = 1; }
      // backlit grass in the lower left: bent by the gust, then dew beads light up on the tips (候二)
      const bend = 0.5 * JQ.smooth(0.1, 0.9, t) * (1 - JQ.smooth(1.7, 2.9, t));
      GRASS.forEach((b, i) => { const a = b.lean + bend + Math.sin(t * 2.1 + i) * 0.03, tx = b.x + Math.sin(a) * b.h, ty = 1072 - Math.cos(a) * b.h, mx = b.x + Math.sin(a * 0.4) * b.h * 0.5, my = 1072 - b.h * 0.5;
        g.fillStyle = paper(0.42); g.beginPath(); g.moveTo(b.x - 3.5, 1072); g.quadraticCurveTo(mx - 2, my, tx, ty); g.quadraticCurveTo(mx + 2, my, b.x + 3.5, 1072); g.fill();
        const d = b.dew > 0 ? JQ.smooth(b.dew, b.dew + 0.3, t) : 0;
        if (d > 0.01) { const bx = JQ.lerp(mx, tx, 0.7), by = JQ.lerp(my, ty, 0.7) + 2, gr = g.createRadialGradient(bx, by, 1, bx, by, 16); gr.addColorStop(0, paper(0.8 * d)); gr.addColorStop(1, paper(0));
          g.fillStyle = gr; g.fillRect(bx - 16, by - 16, 32, 32); g.fillStyle = `rgba(255,255,250,${d})`; g.beginPath(); g.arc(bx, by, 4.5, 0, 6.2832); g.fill(); } });
      // 候三 is the cicada alone: the kid on the threshold is gone (the family walks to the field instead)
      // 候三: the cold cicada flies onto the twig and sings on the beats
      if (t > 2 * BAR) {
        const p = JQ.clamp((t - 2 * BAR) / 0.5), e = JQ.ease(p), x = JQ.lerp(1240, CIC[0], e), y = JQ.lerp(30, CIC[1], e) - Math.sin(p * Math.PI) * 30;
        const wing = [6.0, 6.667, 7.333, 8.0].reduce((m, b) => Math.max(m, Math.exp(-Math.pow((t - b) / 0.1, 2))), 0);
        cicada(g, x, y, JQ.lerp(0.35, -0.12, e), wing, p < 1 ? t * 60 : 0);
        for (const b of [6.0, 6.667, 7.333, 8.0]) { const age = t - b; if (age < 0 || age > 1.5) continue;
          for (let j = 0; j < 3; j++) { const r = 40 + age * 240 + j * 28, pts = []; for (let a = -1.45; a <= 0.25; a += 0.1) pts.push([CIC[0] - 20 + Math.cos(a) * r, CIC[1] + Math.sin(a) * r * 0.8]);
            g.fillStyle = ink(0.55 * (1 - age / 1.5) * (1 - j * 0.28)); ribbon(g, pts, 7 - j * 1.5); } }
      }
      houText(g, t);
      JQ.blit(g, JQ.cached('s13paper', Sx, buildPaper));
    },
  };
})();
