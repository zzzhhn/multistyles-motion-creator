// s08 小满 · 户县农民画 — 饱和平涂加黑轮廓，装饰化的麦穗纹铺满田（天真透视：远近一样大），满田劳作的小人，喜气。
// 记忆点（麦秋至）：一阵风从左推到右，麦穗纹由青转金、一浪接一浪地倒伏；娃和牛站在前景的麦穗里。
(function () {
  const JQ = window.JQ, S = JQ.SCENE, L = JQ.L, TAU = Math.PI * 2;
  const C = { sky: '#8FCDEB', cloud: '#FFFFFF', sun: '#FFC21A', mtn: '#6A5BB0', mtnDot: '#9C8FE0', hill: '#2E9E4F',
    tree: '#1F7A3A', leaf: '#47B85A', earth: '#E9A23B', earthDk: '#C9782A', path: '#F6DC8C', water: '#2F8FD6',
    waterHi: '#BDE6FA', wall: '#FBF4E6', roof: '#2B3F8C', red: '#E2342B', ink: '#1A1410', green: '#1C8A3C',
    greenHi: '#62C25A', gold: '#F4B81C', goldHi: '#FFE070', base0: '#2A8A3A', base1: '#E99A1C', pink: '#F27AA0', white: '#FFFFFF' };
  const LW = 3;                                               // the one outline weight of the whole picture

  const poly = (g, pts, fill, lw = LW) => {                   // flat fill + black outline
    g.beginPath(); pts.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.closePath();
    if (fill) { g.fillStyle = fill; g.fill(); } if (lw) { g.strokeStyle = C.ink; g.lineWidth = lw; g.lineJoin = 'round'; g.stroke(); }
  };
  const fillOut = (g, path, fill, lw = LW) => { g.fillStyle = fill; g.fill(path); if (lw) { g.strokeStyle = C.ink; g.lineWidth = lw; g.lineJoin = 'round'; g.stroke(path); } };
  const dot = (g, x, y, r, fill, lw = 2) => { g.beginPath(); g.arc(x, y, r, 0, TAU); g.fillStyle = fill; g.fill(); if (lw) { g.strokeStyle = C.ink; g.lineWidth = lw; g.stroke(); } };
  const cloud = (g, x, y, s) => {                             // a folk cloud scroll: three lobes and a curl
    g.beginPath(); g.arc(x - 34 * s, y, 22 * s, Math.PI * 0.5, Math.PI * 1.6); g.arc(x, y - 12 * s, 30 * s, Math.PI * 1.1, Math.PI * 1.95);
    g.arc(x + 38 * s, y, 22 * s, Math.PI * 1.4, Math.PI * 0.5); g.closePath();
    g.fillStyle = C.cloud; g.fill(); g.strokeStyle = C.ink; g.lineWidth = LW; g.stroke();
    g.beginPath(); g.arc(x - 6 * s, y + 2 * s, 9 * s, Math.PI, TAU * 0.95); g.stroke();
  };

  // ------------------------------------------------------------------ behind the field
  const bg = (g) => {
    g.fillStyle = C.sky; g.fillRect(0, 0, 1920, 460);
    // sun with petal rays, folk style (yellow, not red)
    for (let i = 0; i < 16; i++) { const a = i / 16 * TAU; poly(g, [[1180 + Math.cos(a - 0.12) * 56, 118 + Math.sin(a - 0.12) * 56], [1180 + Math.cos(a) * 86, 118 + Math.sin(a) * 86], [1180 + Math.cos(a + 0.12) * 56, 118 + Math.sin(a + 0.12) * 56]], C.goldHi, 2); }
    dot(g, 1180, 118, 54, C.sun, LW);
    cloud(g, 760, 104, 1.2); cloud(g, 1520, 86, 1.0); cloud(g, 1760, 190, 0.8); cloud(g, 930, 214, 0.75);
    // mountains: one flat violet band with rows of little tree dots, then the green hills with round trees
    fillOut(g, S.mountains.path, C.mtn);
    g.save(); g.clip(S.mountains.path);
    for (let y = 270; y < 430; y += 22) for (let x = (y / 22 % 2) * 14; x < 1920; x += 28) dot(g, x, y, 5, C.mtnDot, 0);
    g.restore();
    fillOut(g, S.hills.path, C.hill);
    for (let x = 20; x < 1920; x += 46) { const y = 392 + Math.sin(x * 0.02) * 6; poly(g, [[x, y + 18], [x, y + 6]], null, 2); dot(g, x, y, 11, C.leaf, 2); }
    // the ground: warm ochre with rows of tufts, the path pale yellow with a dashed border
    fillOut(g, S.ground.path, C.earth, 0);
    g.save(); g.clip(S.ground.path); g.strokeStyle = C.earthDk; g.lineWidth = 3; g.lineCap = 'round';
    for (let y = 640; y < 1080; y += 40) for (let x = ((y / 40) % 2) * 30; x < 1920; x += 60) { g.beginPath(); g.moveTo(x - 8, y - 6); g.lineTo(x, y + 4); g.lineTo(x + 8, y - 6); g.stroke(); }
    g.restore();
    fillOut(g, S.path.path, C.path);
    // the pond: flat blue, rows of white fish-scale waves, and two lotus pads
    fillOut(g, S.pondRim.path, C.green);
    fillOut(g, S.pond.path, C.water);
    g.save(); g.clip(S.pond.path); g.strokeStyle = C.waterHi; g.lineWidth = 3;
    for (let r = 0; r < 7; r++) for (let x = 690 + (r % 2) * 22; x < 1310; x += 44) { const y = 806 + r * 24; g.beginPath(); g.arc(x, y, 18, Math.PI * 1.1, Math.PI * 1.9); g.stroke(); }
    g.restore();
    [[1160, 900, 30], [1210, 860, 22]].forEach(([x, y, r]) => { g.beginPath(); g.ellipse(x, y, r, r * 0.55, 0, 0.3, TAU - 0.1); g.lineTo(x, y); g.closePath(); g.fillStyle = C.greenHi; g.fill(); g.strokeStyle = C.ink; g.lineWidth = 2; g.stroke(); });
  };

  // ------------------------------------------------------------------ in front of the field: stream, house, tree, title
  const fg = (g) => {
    fillOut(g, S.stream.path, C.water);
    g.save(); g.clip(S.stream.path); g.strokeStyle = C.waterHi; g.lineWidth = 3;
    for (let i = 0; i < 16; i++) { const y = 450 + i * 26, x = 1410 - (y - 432) * 0.45; g.beginPath(); g.arc(x, y, 10, Math.PI * 1.1, Math.PI * 1.9); g.stroke(); }
    g.restore();
    fillOut(g, S.bridge.path, C.wall);
    g.save(); g.clip(S.bridge.path); g.strokeStyle = C.ink; g.lineWidth = 2;
    for (let x = 1190; x < 1400; x += 28) { g.beginPath(); g.moveTo(x, 652); g.lineTo(x, 668); g.stroke(); }
    g.restore(); g.strokeStyle = C.ink; g.lineWidth = LW; g.stroke(S.bridgeArch.path);
    // the farmhouse: navy tiled roof drawn tile by tile, white walls, red door with brass studs
    fillOut(g, S.roof.path, C.roof);
    g.save(); g.clip(S.roof.path); g.strokeStyle = '#6F86D6'; g.lineWidth = 2;
    for (let y = 482; y < 548; y += 12) for (let x = 1470 + ((y / 12) % 2) * 10; x < 1910; x += 20) { g.beginPath(); g.arc(x, y, 10, 0, Math.PI); g.stroke(); }
    g.restore();
    fillOut(g, S.chimney.path, C.red);
    fillOut(g, S.houseFront.path, C.wall);
    fillOut(g, S.window.path, C.red);
    g.strokeStyle = C.ink; g.lineWidth = 2; for (let i = 1; i < 4; i++) { g.beginPath(); g.moveTo(1720 + i * 20, 556); g.lineTo(1720 + i * 20, 594); g.stroke(); }
    g.beginPath(); g.moveTo(1720, 575); g.lineTo(1800, 575); g.stroke();
    fillOut(g, S.wall.path, C.wall);
    g.save(); g.clip(S.wall.path); g.strokeStyle = '#D8C9A8'; g.lineWidth = 2;
    for (let y = 624; y < 812; y += 24) { g.beginPath(); g.moveTo(1440, y); g.lineTo(1920, y); g.stroke(); }
    g.restore();
    fillOut(g, S.wallCap.path, C.roof);
    fillOut(g, S.gate.path, C.red);
    g.strokeStyle = C.ink; g.lineWidth = 2; g.beginPath(); g.moveTo(1650, 700); g.lineTo(1650, 812); g.stroke();
    [[1636, 760], [1664, 760]].forEach(([x, y]) => dot(g, x, y, 6, C.gold, 2));
    fillOut(g, S.gateRoof.path, C.roof);
    // the old 槐树: brown trunk with bark rings, a big outlined crown filled with leaf rows, and white 槐花 clusters
    fillOut(g, S.trunk.path, '#7A4A22');
    g.save(); g.clip(S.trunk.path); g.strokeStyle = C.ink; g.lineWidth = 2;
    for (let y = 520; y < 830; y += 26) { g.beginPath(); g.moveTo(420, y); g.quadraticCurveTo(470, y + 8, 540, y); g.stroke(); }
    g.restore();
    g.strokeStyle = C.ink; g.lineCap = 'round'; JQ.drawBranches(g, 1, 1.3);
    fillOut(g, S.canopy.path, C.tree, 4);
    g.save(); g.clip(S.canopy.path);
    for (let y = 130; y < 520; y += 30) for (let x = 180 + ((y / 30) % 2) * 18; x < 800; x += 36) {
      g.beginPath(); g.moveTo(x, y - 14); g.quadraticCurveTo(x + 11, y, x, y + 14); g.quadraticCurveTo(x - 11, y, x, y - 14);
      g.fillStyle = (x + y) % 3 ? C.leaf : C.greenHi; g.fill(); g.strokeStyle = C.ink; g.lineWidth = 1.5; g.stroke(); }
    const rf = JQ.rng(88); for (let i = 0; i < 14; i++) { const x = 260 + rf() * 440, y = 190 + rf() * 260;
      for (let k = 0; k < 5; k++) dot(g, x + (k % 2) * 9 - 4, y + k * 8, 5.5, C.white, 1.5); }
    g.restore();
    // title: a yellow 云头 panel, red inner rule, 小满 in 隶书 and 麦秋至 in 行楷
    g.beginPath(); g.moveTo(80, 70); g.lineTo(440, 70); g.arc(440, 110, 40, -Math.PI / 2, Math.PI / 2); g.arc(440, 190, 40, -Math.PI / 2, Math.PI / 2);
    g.lineTo(80, 230); g.arc(80, 190, 40, Math.PI / 2, Math.PI * 1.5); g.arc(80, 110, 40, Math.PI / 2, Math.PI * 1.5); g.closePath();
    g.fillStyle = C.goldHi; g.fill(); g.strokeStyle = C.ink; g.lineWidth = 4; g.stroke();
    g.strokeStyle = C.red; g.lineWidth = 3; g.strokeRect(70, 82, 380, 136);
    g.fillStyle = C.ink; g.textAlign = 'center'; g.textBaseline = 'alphabetic';
    g.font = '700 92px "Baoli SC","STBaoli",serif'; g.fillText('小满', 200, 180);
    
  };
  // ------------------------------------------------------------------ the 麦穗纹 and the wind
  const IMPACT = 2 * 8 / 3 + 4 / 3;                            // 6.667: the gust front reaches the far end and the whole field is gold
  const front = t => -150 + Math.max(0, t - 16 / 3) * 1950 / (IMPACT - 16 / 3);   // gust crest x, from the left edge at 5.333
  const state = (x, fx) => {
    const k = JQ.clamp((fx - x) / 240), d = fx - x;
    const ripple = d > 0 ? Math.sin(d * 0.02) * (0.4 + 0.6 * Math.exp(-d / 700)) : 0;   // swells behind the front, wave after wave, still rolling to the end
    return { k, lean: 0.42 * Math.exp(-Math.pow((d - 50) / 90, 2)) + 0.2 * ripple, crest: ripple > 0.45 };
  };
  const motif = (P, x, y, h, lean, stalk) => {                // one stylised ear: stalk, herringbone grains, three awns
    const ex = x + lean * h, ey = y - h, w = h * 0.09, hh = h * 0.13;
    stalk.moveTo(x, y); stalk.quadraticCurveTo(x + lean * h * 0.2, y - h * 0.5, ex, ey + h * 0.5);
    stalk.moveTo(ex, ey); stalk.lineTo(ex - h * 0.13, ey - h * 0.26); stalk.moveTo(ex, ey); stalk.lineTo(ex + h * 0.13, ey - h * 0.26);
    stalk.moveTo(ex, ey); stalk.lineTo(ex + lean * h * 0.2, ey - h * 0.32);
    const dia = (cx, cy) => { P.moveTo(cx, cy - hh); P.lineTo(cx + w, cy); P.lineTo(cx, cy + hh); P.lineTo(cx - w, cy); P.closePath(); };
    dia(ex, ey + h * 0.04);
    for (let j = 0; j < 3; j++) { const cy = ey + h * (0.18 + j * 0.13), cx = ex - lean * h * 0.12 * (j + 1); dia(cx - h * 0.1, cy); dia(cx + h * 0.1, cy); }
  };
  const COLS = { g: '#8EDB5A', m: '#D6E04A', o: '#FFD23A', c: '#FFF3A6' };
  // each ear is a pre-cut sprite (size × colour × lean quantised to 32 steps), so a 2560 frame stamps ~850 small images instead of building paths
  const LMIN = -0.32, LMAX = 0.72, LN = 32, SPR = {};
  const sprite = (Sx, h, lw, b, li) => {
    const key = h + b + li + '@' + Sx.scale; if (SPR[key]) return SPR[key];
    const sc = Sx.scale, c = document.createElement('canvas'); c.width = Math.ceil(1.7 * h * sc); c.height = Math.ceil(1.55 * h * sc);
    const q = c.getContext('2d'); q.setTransform(sc, 0, 0, sc, 0.6 * h * sc, 1.47 * h * sc);
    const P = new Path2D(), st = new Path2D(); motif(P, 0, 0, h, LMIN + (LMAX - LMIN) * li / (LN - 1), st);
    const oc = lw < 1.5 ? 'rgba(26,20,16,0.5)' : C.ink;
    q.strokeStyle = oc; q.lineWidth = lw * 1.4; q.lineCap = 'round'; q.stroke(st);
    q.fillStyle = COLS[b]; q.fill(P); q.strokeStyle = oc; q.lineWidth = lw; q.stroke(P);
    return (SPR[key] = c);
  };
  const crop = (g, t, x0, x1, rows, h, dx, lw, Sx) => {
    const fx = front(t);
    rows.forEach((y, r) => { for (let x = x0 + (r % 2) * dx / 2; x < x1; x += dx) {
      const s = state(x, fx), b = s.k < 0.25 ? 'g' : s.k < 0.6 ? 'm' : s.crest ? 'c' : 'o', lean = JQ.clamp(s.lean + Math.sin(x * 0.05 + r) * 0.04, LMIN, LMAX);
      g.drawImage(sprite(Sx, h, lw, b, Math.round((lean - LMIN) / (LMAX - LMIN) * (LN - 1))), x - 0.6 * h, y - 1.47 * h, 1.7 * h, 1.55 * h); } });
  };
  const field = (g, t, Sx) => {
    const fx = front(t);
    g.save(); g.clip(S.field.path);
    g.fillStyle = C.base0; g.fillRect(0, 420, 1920, 300);
    const gr = g.createLinearGradient(fx - 260, 0, fx, 0); gr.addColorStop(0, C.base1); gr.addColorStop(1, 'rgba(233,154,28,0)');
    g.fillStyle = gr; g.fillRect(0, 420, 1920, 300);
    crop(g, t, -10, 1930, Array.from({ length: 10 }, (_, r) => 466 + r * 25), 26, 25, 1.2, Sx);
    g.restore();
  };
  const curl = (g, cx, cy, s, rot) => {                       // a white folk wind curl with a long tail
    const p = new Path2D(); p.moveTo(cx - 190 * s, cy + 14 * s); p.quadraticCurveTo(cx - 90 * s, cy + 22 * s, cx - 4 * s, cy + 26 * s);
    for (let a = 0; a < Math.PI * 2.6; a += 0.2) { const r = 26 * s * (1 - a / (Math.PI * 2.9)); p.lineTo(cx + Math.cos(a + rot + Math.PI / 2) * r, cy + Math.sin(a + rot + Math.PI / 2) * r); }
    g.lineCap = 'round'; g.lineJoin = 'round'; g.strokeStyle = C.ink; g.lineWidth = 11 * s; g.stroke(p); g.strokeStyle = C.white; g.lineWidth = 6 * s; g.stroke(p);
  };

  // ------------------------------------------------------------------ the people, flat colour with a black line
  const sheaf = (g, cx, cy, w, h) => {
    poly(g, [[cx - w * 0.28, cy + h / 2], [cx + w * 0.28, cy + h / 2], [cx + w * 0.55, cy - h / 2], [cx - w * 0.55, cy - h / 2]], C.gold, 1.6);
    g.strokeStyle = C.red; g.lineWidth = Math.max(2, h * 0.12); g.beginPath(); g.moveTo(cx - w * 0.36, cy); g.lineTo(cx + w * 0.36, cy); g.stroke();
  };
  const fig = (g, x, y, s, kind, ph, col, up = 0) => {
    const bent = kind === 'reap' || kind === 'bind', lw = Math.max(1.4, s * 0.04);
    const hip = [x, y - s * 0.42], sh = bent ? [x + s * 0.24, y - s * 0.62] : [x + s * 0.02, y - s * 0.78];
    const hd = bent ? [x + s * 0.38, y - s * 0.66] : [x + s * 0.03, y - s * 0.93], r = s * 0.1;
    g.lineCap = 'round'; g.strokeStyle = C.ink; g.lineWidth = s * 0.1;
    g.beginPath(); g.moveTo(hip[0], hip[1]); g.lineTo(x - s * 0.13, y); g.moveTo(hip[0], hip[1]); g.lineTo(x + s * 0.12, y); g.stroke();
    if (kind === 'pole') { const b = Math.sin(ph) * s * 0.04; g.lineWidth = s * 0.05; g.beginPath(); g.moveTo(x - s * 0.6, sh[1] + 2); g.lineTo(x + s * 0.6, sh[1] + 2); g.stroke();
      sheaf(g, x - s * 0.6, sh[1] + s * 0.3 + b, s * 0.34, s * 0.4); sheaf(g, x + s * 0.6, sh[1] + s * 0.3 - b, s * 0.34, s * 0.4); }
    if (kind === 'carry') sheaf(g, x - s * 0.16, sh[1] - s * 0.05, s * 0.4, s * 0.56);
    if (kind === 'cart') { poly(g, [[x + s * 0.4, y - s * 0.5], [x + s * 1.3, y - s * 0.5], [x + s * 1.24, y - s * 0.22], [x + s * 0.46, y - s * 0.22]], '#8A4A20', lw);
      sheaf(g, x + s * 0.72, y - s * 0.7, s * 0.4, s * 0.42); sheaf(g, x + s * 1.02, y - s * 0.7, s * 0.4, s * 0.42);
      dot(g, x + s * 0.85, y - s * 0.16, s * 0.16, '#C9A050', lw); dot(g, x + s * 0.85, y - s * 0.16, s * 0.04, C.ink, 0); }
    const nx = (sh[1] - hip[1]), ny = -(sh[0] - hip[0]), nd = Math.hypot(nx, ny) || 1, ux = nx / nd, uy = ny / nd;
    poly(g, [[hip[0] - ux * s * 0.13, hip[1] - uy * s * 0.13], [hip[0] + ux * s * 0.13, hip[1] + uy * s * 0.13], [sh[0] + ux * s * 0.14, sh[1] + uy * s * 0.14], [sh[0] - ux * s * 0.14, sh[1] - uy * s * 0.14]], col, lw);
    const hand = kind === 'reap' ? [sh[0] + s * 0.2 + Math.sin(ph) * s * 0.12, sh[1] + s * 0.36] : kind === 'bind' ? [sh[0] + s * 0.16, sh[1] + s * 0.34]
      : kind === 'cart' ? [x + s * 0.42, y - s * 0.5] : kind === 'pole' ? [x + s * 0.3, sh[1] + 2] : [x - s * 0.1, sh[1] - s * 0.12];
    if (up > 0) { hand[0] = JQ.lerp(hand[0], sh[0] + s * 0.12, up); hand[1] = JQ.lerp(hand[1], sh[1] - s * 0.42, up); }   // the harvest cheer at the impact
    g.strokeStyle = C.ink; g.lineWidth = s * 0.11; g.beginPath(); g.moveTo(sh[0], sh[1]); g.lineTo(hand[0], hand[1]); g.stroke();
    g.strokeStyle = col; g.lineWidth = s * 0.07; g.stroke();
    if (kind === 'reap') { g.strokeStyle = '#D8D8D0'; g.lineWidth = Math.max(1.6, s * 0.04); g.beginPath(); g.arc(hand[0] + s * 0.1, hand[1], s * 0.12, -Math.PI * 0.9, Math.PI * 0.1); g.stroke(); }
    if (kind === 'bind') sheaf(g, hand[0] + s * 0.06, hand[1] + s * 0.06, s * 0.32, s * 0.38);
    dot(g, hd[0], hd[1], r, '#F3C9A0', lw);
    g.beginPath(); g.arc(hd[0], hd[1] - r * 0.1, r * 1.08, Math.PI * 1.02, TAU - 0.02); g.closePath(); g.fillStyle = C.white; g.fill(); g.lineWidth = lw; g.strokeStyle = C.ink; g.stroke();
    poly(g, [[hd[0] - r * 1.05, hd[1] - r * 0.2], [hd[0] - r * 1.6, hd[1] + r * 0.3], [hd[0] - r * 1.0, hd[1] + r * 0.2]], C.white, lw * 0.8);
  };
  const KINDS = ['reap', 'bind', 'reap', 'carry', 'pole', 'reap', 'bind'], HUES = [C.red, C.pink, '#2B6FD0', C.green, '#F07A1E', '#8E4FC2'];
  const CROWD = (() => { const o = [], r = JQ.rng(808);
    [500, 560].forEach((y, row) => { for (let x = 90 + row * 60; x < 1420; x += 190 + r() * 60) { if (row && x > 560 && x < 1020) continue;   // keep the woman's path clear
      const sx = 1410 - (y - 432) * 0.45; if (Math.abs(x - 478) < 46 || (x > sx - 60 && x < sx + 50)) continue;
      o.push([x, y, 40, KINDS[o.length % KINDS.length], r() * 6, HUES[o.length % HUES.length]]); } });
    return o; })();
  // ------------------------------------------------------------------ the family (story track) in the same flat colour and black line
  const PENS = { woman: { skin: '#F3C9A0', hair: C.ink, coat: '#2B6FD0', pants: C.green, apron: C.pink, hat: C.goldHi, straw: C.goldHi, scarf: C.pink, cape: C.gold, eye: C.ink, prop: '#8A4A20', metal: '#D8D8D0', red: C.red, line: C.ink, lw: 2.6, outline: true },
    kid: { skin: '#F3C9A0', hair: C.ink, coat: C.red, pants: C.green, apron: C.pink, hat: C.goldHi, straw: C.goldHi, eye: C.ink, prop: '#8A4A20', metal: '#D8D8D0', red: C.red, line: C.ink, lw: 2.6, outline: true },
    ox: { ox: '#E07B2C', oxDark: '#7A3A14', horn: C.white, eye: C.ink, straw: C.gold, prop: '#8A4A20', metal: '#D8D8D0', red: C.red, line: C.ink, lw: 3, outline: true },
    calf: { calf: '#F2A452', calfDark: '#7A3A14', horn: C.white, eye: C.ink, line: C.ink, lw: 2.6, outline: true } };
  const bbox = pts => { let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9; pts.forEach(([x, y]) => { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }); return [x0, y0, x1, y1]; };
  const FLOWERS = [[0.22, 0.32], [0.42, 0.22], [0.64, 0.36], [0.34, 0.6], [0.82, 0.3], [0.55, 0.62]];
  const famItem = (g, it) => {
    g.save(); if (it.alpha != null && it.alpha < 1) g.globalAlpha *= it.alpha;
    JQ.drawParts(g, it.parts, PENS[it.who] || PENS.woman);
    if (it.kind === 'actor' && (it.who === 'ox' || it.who === 'calf')) {          // the folk ox wears painted rosettes
      const body = it.parts.filter(q => q.role === it.who).reduce((a, q) => { const [x0, y0, x1, y1] = bbox(q.pts), ar = (x1 - x0) * (y1 - y0); return !a || ar > a.ar ? { q, ar, b: [x0, y0, x1, y1] } : a; }, null);
      if (body) { const [x0, y0, x1, y1] = body.b, r = Math.min(13, (y1 - y0) * 0.12); g.save(); g.clip(body.q.path);
        FLOWERS.forEach(([u, v]) => { const x = JQ.lerp(x0, x1, u), y = JQ.lerp(y0, y1, v); dot(g, x, y, r, C.goldHi, 2); dot(g, x, y, r * 0.34, C.red, 0); }); g.restore(); }
    }
    g.restore();
  };
  // ------------------------------------------------------------------ 苦菜秀: a sow-thistle clump right of the path opens five yellow heads, one per half beat
  const HOU = JQ.TERMS[7].hou, KC = [1790, 990];
  const HEADS = [[-52, -96, 0], [-16, -128, 1], [24, -112, 2], [58, -86, 3], [2, -76, 4]];
  const kucai = (g, t) => {
    const [bx, by] = KC;
    [[-1, 0.2], [1, -0.1], [-1, -0.5], [1, 0.45]].forEach(([d, tilt], i) => { const L = 74 - i * 6, pts = [[bx, by]];
      for (let k = 1; k <= 6; k++) { const u = k / 6, w = Math.sin(u * Math.PI) * 18 * (k % 2 ? 1.25 : 0.7); pts.push([bx + d * L * u, by - L * u * (0.25 + tilt * 0.3) - w]); }
      for (let k = 6; k >= 1; k--) { const u = k / 6, w = Math.sin(u * Math.PI) * 10; pts.push([bx + d * L * u, by - L * u * (0.25 + tilt * 0.3) + w * 0.4]); }
      poly(g, pts, i % 2 ? C.green : C.greenHi, 2.2); });
    HEADS.forEach(([dx, dy, k]) => { const o = JQ.ease(JQ.clamp((t - 0.3 - k * 0.38) / 0.4)), x = bx + dx, y = by + dy * (0.72 + 0.28 * Math.min(1, o * 2 + 0.3));
      g.strokeStyle = C.ink; g.lineWidth = 5; g.lineCap = 'round'; g.beginPath(); g.moveTo(bx + dx * 0.2, by - 6); g.quadraticCurveTo(bx + dx * 0.7, by + dy * 0.5, x, y + 10); g.stroke();
      g.strokeStyle = C.green; g.lineWidth = 2.6; g.stroke();
      poly(g, [[x - 9, y + 14], [x + 9, y + 14], [x + 6, y + 2], [x - 6, y + 2]], C.green, 2);
      if (o > 0.02) { const r = 10 + o * 24, n = 12; for (let i = 0; i < n; i++) { const a = -Math.PI + (i + 0.5) / n * Math.PI * 2;
        poly(g, [[x + Math.cos(a - 0.2) * r * 0.35, y + Math.sin(a - 0.2) * r * 0.35], [x + Math.cos(a) * r, y + Math.sin(a) * r], [x + Math.cos(a + 0.2) * r * 0.35, y + Math.sin(a + 0.2) * r * 0.35]], i % 2 ? C.gold : C.goldHi, 1); }
        dot(g, x, y, r * 0.32, '#F08A1C', 1.6); }
      else poly(g, [[x - 6, y + 4], [x + 6, y + 4], [x, y - 12]], C.greenHi, 2); });
  };
  // ------------------------------------------------------------------ 靡草死: a row of fine grass on the pond's far bank turns to straw and lies down, left to right
  const rimY = x => L.pond.cy - L.pond.ry * Math.sqrt(Math.max(0, 1 - Math.pow((x - L.pond.cx) / L.pond.rx, 2))) - 14;
  const BLADES = Array.from({ length: 34 }, (_, i) => { const x = 745 + i * 15 + (JQ.hash(i, 1, 8) - 0.5) * 8; return [x, rimY(x), 70 + JQ.hash(i, 2, 8) * 34, JQ.hash(i, 3, 8) < 0.5 ? -1 : 1]; });
  const mi = (g, t) => {
    const G0 = [63, 175, 74], G1 = [214, 170, 72], G2 = [150, 96, 44], mixc = (a, b, k) => 'rgb(' + a.map((v, j) => Math.round(JQ.lerp(v, b[j], k))).join(',') + ')';
    BLADES.forEach(([x, y, h, side], i) => {
      const w = JQ.smooth(2.8 + (x - 745) / 510 * 1.3, 3.5 + (x - 745) / 510 * 1.3, t), sway = Math.sin(t * 2.2 + i) * 0.06 * (1 - w);
      const ang = -Math.PI / 2 + side * (0.12 + w * 1.25) + sway, len = h * (1 - 0.3 * w), bend = side * w * 0.9;
      const tip = [x + Math.cos(ang) * len, y + Math.sin(ang) * len], mid = [x + Math.cos(ang - bend * 0.5) * len * 0.55, y + Math.sin(ang - bend * 0.5) * len * 0.62];
      const nx = Math.cos(ang + Math.PI / 2) * 4.5, ny = Math.sin(ang + Math.PI / 2) * 4.5;
      g.beginPath(); g.moveTo(x - nx, y - ny); g.quadraticCurveTo(mid[0] - nx, mid[1] - ny, tip[0], tip[1]); g.quadraticCurveTo(mid[0] + nx, mid[1] + ny, x + nx, y + ny); g.closePath();
      g.fillStyle = w < 0.5 ? mixc(G0, G1, w * 2) : mixc(G1, G2, w * 2 - 1); g.fill(); g.strokeStyle = C.ink; g.lineWidth = 1.6; g.stroke(); });
  };
  // the hou text in the title panel: written one glyph at a time at the start of each bar
  const houText = (g, t) => {
    const i = Math.min(2, Math.floor(t * 3 / 8)), u = t - i * 8 / 3;
    g.fillStyle = C.ink; g.textAlign = 'center'; g.textBaseline = 'alphabetic'; g.font = '400 46px "Xingkai SC","STXingkai",serif';
    [...HOU[i]].forEach((ch, k) => { const a = i === 0 && t < 0.01 ? 1 : JQ.clamp((u - k * 0.14) / 0.14); if (a <= 0) return; g.globalAlpha = a; g.fillText(ch, 382, 118 + k * 44); });
    g.globalAlpha = 1;
  };

  JQ.ART[8] = {
    key: IMPACT, keyHou: JQ.TERMS[7].keyHou,
    focus: [[1790, 930], [990, 740], [760, 560]],
    frame: false,
    draw(g, t, Sx) {
      t = JQ.clamp(t, 0, 9);
      const up = JQ.smooth(IMPACT - 0.2, IMPACT, t) * (1 - JQ.smooth(7.6, 8.1, t));
      JQ.blit(g, JQ.cached('s08bg', Sx, bg));
      field(g, t, Sx);
      CROWD.forEach(([x, y, s, k, o, c]) => fig(g, x, y, s, k, t * 3 + o, c, up));
      // the woman walks IN the field: drawn over the rows behind her, then the two rows in front of her feet are stamped again
      const C2 = JQ.castFor(Sx, t), WI = C2.items.find(it => it.who === 'woman' && it.kind === 'actor');
      C2.items.filter(it => it.who === 'woman').forEach(it => famItem(g, it));
      if (WI) { const rows = [Math.round(WI.y + 9), Math.round(WI.y + 30)], st = C2.state.woman;   // a band of ears just in front of her legs
        if (rows.length && st) { g.save(); g.clip(S.field.path); crop(g, t, -10 + Math.floor((st.x - 140 + 10) / 50) * 50, st.x + 140, rows, 26, 25, 1.2, Sx); g.restore(); } }
      JQ.blit(g, JQ.cached('s08fg', Sx, fg));
      houText(g, t);
      mi(g, t);
      kucai(g, t);
      const fx = front(t); [[30, 488, 1], [-20, 566, 1.15], [20, 640, 0.9]].forEach(([ox, y, s], i) => { if (fx + ox > -60 && fx + ox < 1440) curl(g, fx + ox, y, s, t * 2 + i); });
      C2.items.filter(it => it !== WI && (!WI || it.who !== 'woman')).forEach(it => famItem(g, it));   // kid, ox, calf in the foreground wheat
      crop(g, t, 446, 800, [976, 1012, 1048, 1084], 62, 34, 2, Sx);   // the ox stands in the near wheat; the child (left) stays in the open
    } };
})();
