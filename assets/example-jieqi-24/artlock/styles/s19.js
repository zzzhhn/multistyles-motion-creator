// s19 立冬 · 北大荒版画. A colour woodcut of the northern plain in the manner of the Great Northern Wilderness school:
// big flat colour blocks printed one after another and slightly out of register; the sky is a reduction print where each
// darker block is gouged in parallel strokes near its lower edge so the lighter block below shows through; the snowfield is
// a pale blue block cut away in long strokes to paper white, densest on the drift crests, sparse in the hollows and shade;
// a black key block carries the tree, roof and outlines.
// Unit (8 s = 3 bars, one pentad per bar): 水始冰 the pond skins over with ice from the rim; 地始冻 a frost crack runs
// across the snowfield; 雉入大水为蜃 (key) a cock pheasant dives into the last open water, a great clam rises and snaps open
// on beat 3 of the bar (6.667 s), breathes out, and a mirage of towers floats above the hills and stays.
(function () {
  const JQ = window.JQ, S = JQ.SCENE, L = JQ.L, W = JQ.W, H = JQ.H, TAU = Math.PI * 2, HS = L.house;
  const PAPER = '#EEE6D3', KEY = '#15161C', YEL = '#F0C866', ORA = '#E27936', MBL = '#3D6AA6', DBL = '#1A2C58', SBL = '#8EADD3', RED = '#C42F27', BRN = '#8A5532', VIO = '#3A3A72';
  const SONG = '"Songti SC", "STSong", serif', BAR = 8 / 3, IMP = 2 * BAR + 4 / 3, HOU = JQ.TERMS[18].hou;
  if (document.fonts) document.fonts.load(`900 80px ${SONG}`, '立冬雉入大水为蜃始冰地冻');
  // a knife cut: a lens-shaped sliver, pointed at both ends (call with destination-out on a block layer)
  const cut = (g, x, y, len, w, ang = 0) => { const c = Math.cos(ang), s = Math.sin(ang), hx = c * len / 2, hy = s * len / 2, nx = -s * w / 2, ny = c * w / 2;
    g.moveTo(x - hx, y - hy); g.quadraticCurveTo(x + nx * 2, y + ny * 2, x + hx, y + hy); g.quadraticCurveTo(x - nx * 2, y - ny * 2, x - hx, y - hy); };
  // rows of cuts across a band; density ramps from d0 at y0 to d1 at y1 (0 = none, 1 = nearly cleared), times mod(x, y) if given
  const gouge = (g, x0, x1, y0, y1, d0, d1, seed, gap = 7, ang = 0, mod = null) => {
    g.globalCompositeOperation = 'destination-out'; g.fillStyle = '#000'; g.beginPath();
    for (let y = y0, r = 0; y < y1; y += gap, r++) { const d = JQ.lerp(d0, d1, (y - y0) / (y1 - y0)); if (d <= 0.01 && !mod) continue;
      for (let x = x0 - 40 + JQ.hash(r, seed) * 60; x < x1 + 40;) { const xi = Math.round(x), dm = mod ? JQ.clamp(d * mod(x, y)) : d;
        const len = 18 + JQ.hash(r, xi, seed) * 70 * (0.4 + dm), w = 1.2 + dm * 4.2 * JQ.hash(xi, r, seed + 1);
        if (dm > 0.01 && JQ.hash(xi, r, seed + 2) < 0.35 + dm * 0.65) cut(g, x + len / 2, y + (JQ.hash(r, xi, seed + 3) - 0.5) * 2, len, w, ang);
        x += len + 4 + (1 - dm) * 40 * JQ.hash(xi, r, seed + 4); } }
    g.fill(); g.globalCompositeOperation = 'source-over';
  };
  const rough = (pts, a, seed) => JQ.P(JQ.jitter(JQ.resample(pts, 10, true), a, seed, 0.05));   // a hand-cut block edge
  const ink = (g, path, c) => { g.fillStyle = c; g.fill(path); };
  const keyline = (g, path, w = 3) => { g.strokeStyle = KEY; g.lineWidth = w; g.lineJoin = 'round'; g.lineCap = 'round'; g.stroke(path); };
  // snowfield relief: drift crests catch the light (dense cuts, white), hollows and the shade of the tree and the wall stay blue
  const crest = (x, y, y0, amp, f, ph, w) => Math.exp(-Math.pow((y - (y0 + Math.sin(x * f + ph) * amp)) / w, 2));
  const relief = (x, y) => {
    let m = 0.6 + 1.1 * (JQ.fbm(x * 0.004, y * 0.012, 7, 3) - 0.5) * 2 + 0.6 * crest(x, y, 735, 26, 0.004, 1, 22) + 0.55 * crest(x, y, 935, 34, 0.003, 4, 26);
    m *= 1 - 0.7 * Math.exp(-Math.pow((x - 620) / 190, 2) - Math.pow((y - 848) / 24, 2));
    m *= 1 - 0.6 * Math.exp(-Math.pow((x - 1680) / 280, 2) - Math.pow((y - 838) / 28, 2));
    return Math.max(0.12, m);
  };
  const furrowMod = (x, y) => 0.45 + 1.1 * JQ.fbm(x * 0.005, y * 0.03, 9, 2);

  // ---------------------------------------------------------------- the static print: one layer per block, laid down out of register
  const BLOCKS = [
    ['yel', 0, 0, g => { g.fillStyle = YEL; g.fillRect(0, 230, W, 204); g.fill(S.window.path); }],
    ['ora', 2, -1, g => { g.fillStyle = ORA; g.fillRect(0, 170, W, 210); gouge(g, 0, W, 300, 380, 0.1, 0.95, 11); }],
    ['mbl', -2, 2, g => { g.fillStyle = MBL; g.fillRect(0, 70, W, 240); gouge(g, 0, W, 230, 312, 0.05, 1, 12); }],
    ['dbl', 1, 1, g => { g.fillStyle = DBL; g.fillRect(0, 0, W, 170); gouge(g, 0, W, 104, 172, 0.05, 1, 13); gouge(g, 0, W, 6, 100, 0.06, 0.06, 14, 11);
      ink(g, rough(S.mountains.pts, 4, 3), VIO); g.save(); g.clip(S.mountains.path); gouge(g, 0, W, 250, 380, 0.75, 0.05, 15, 6, -0.5); g.restore(); }],
    ['sbl', 3, 2, g => { g.fillStyle = SBL; g.fill(S.hills.path); g.fill(S.ground.path); g.fill(S.field.path);
      g.save(); g.clip(S.field.path); gouge(g, 0, W, 432, 700, 0.95, 0.6, 16, 6, -0.03, furrowMod); g.restore();
      g.save(); g.clip(S.ground.path); gouge(g, 0, W, 600, 1080, 0.85, 0.4, 17, 8, 0, relief); g.restore();
      ink(g, S.stream.path, MBL); ink(g, S.pondRim.path, SBL); }],
    ['brn', 2, -2, g => { ink(g, S.wall.path, BRN); ink(g, S.houseFront.path, '#A36A3E'); ink(g, S.bridge.path, '#7E6C62'); ink(g, S.chimney.path, BRN);
      g.save(); g.clip(S.wall.path); gouge(g, HS.wallX0, W, HS.wallTop, HS.wallBot, 0.3, 0.3, 18, 9); g.restore(); }],
    ['red', -3, 1, g => { ink(g, S.gate.path, RED); g.fillStyle = RED; g.beginPath(); g.ellipse(1650, 700, 11, 15, 0, 0, TAU); g.fill(); }],
    ['key', 0, 0, g => {
      ink(g, rough(S.pond.pts, 3, 5), '#18223E'); g.save(); g.clip(S.pond.path); gouge(g, 600, 1400, 790, 990, 0.25, 0.08, 19, 9); g.restore();
      keyline(g, rough(S.pond.pts, 2.5, 51), 4); keyline(g, rough(S.pondRim.pts, 2.5, 52), 2.4); keyline(g, rough(S.stream.pts, 2, 53), 2.6);
      ink(g, rough(S.roof.pts, 2, 7), KEY); g.save(); g.clip(S.roof.path); g.globalCompositeOperation = 'destination-out'; g.fillStyle = '#000'; g.fillRect(1400, 440, 520, 62);
      g.beginPath(); for (let x = 1480; x < 1900; x += 14) cut(g, x, 509, 10, 3, 1.4); g.fill(); g.globalCompositeOperation = 'source-over'; g.restore();
      keyline(g, rough(S.roof.pts, 2, 54), 3.6); keyline(g, rough(S.wall.pts, 2.5, 55), 3.8); g.fillStyle = PAPER; g.fill(S.wallCap.path); keyline(g, S.wallCap.path, 2);
      ink(g, S.gateRoof.path, KEY); keyline(g, rough(S.gate.pts, 1.5, 56), 3.2); keyline(g, rough(S.houseFront.pts, 2, 57), 3); keyline(g, S.window.path, 3); keyline(g, rough(S.bridge.pts, 2, 58), 3.4);
      g.fillStyle = PAPER; g.fillRect(L.bridge.cx - L.bridge.half - 8, L.bridge.deckY - 10, L.bridge.half * 2 + 16, 9);
      // the tree: black block, bark and snow cut back to paper along the limbs
      g.strokeStyle = KEY; JQ.drawBranches(g, 5, 0.9); ink(g, S.trunk.path, KEY);
      g.globalCompositeOperation = 'destination-out'; g.fillStyle = '#000'; g.beginPath();
      for (let i = 0; i < 26; i++) { const k = JQ.hash(i, 31), y = JQ.lerp(800, 500, k); cut(g, JQ.lerp(474, 504, k) + (JQ.hash(i, 32) - 0.5) * 22, y, 26 + JQ.hash(i, 33) * 30, 3, 1.5 + (JQ.hash(i, 34) - 0.5) * 0.3); }
      g.fill(); g.globalCompositeOperation = 'source-over';
      g.strokeStyle = PAPER; g.lineCap = 'round'; for (const b of S.branches) { if (b.depth > 2) continue; g.lineWidth = Math.max(1.4, b.w * 0.28); g.beginPath(); g.moveTo(b.x1, b.y1 - b.w * 0.42); g.lineTo(b.x2, b.y2 - b.w * 0.42); g.stroke(); }
    }],
  ];
  // the family, cut and printed like the rest: one offset colour block per figure, then the black key block with a hand-cut
  // (jittered) contour. Positions and poses come from the story track every frame (JQ.castFor); nothing about them is cached.
  const SKIN = '#E9B98C', PANTS = '#2B3550';
  const PENS = { woman: { skin: SKIN, coat: MBL, pants: PANTS, apron: SBL, hat: BRN, scarf: BRN, cape: '#B88A4A' },
    kid: { skin: SKIN, coat: RED, pants: PANTS, apron: SBL, hat: '#B88A4A', scarf: '#B88A4A', cape: '#B88A4A' },
    ox: { ox: '#6E4428', horn: PAPER }, calf: { calf: '#A8703E', horn: PAPER } };
  const PROPC = { straw: YEL, prop: BRN, metal: '#7E6C62', red: RED };
  const SOLID = { eye: 1, hair: 1, oxDark: 1, calfDark: 1, line: 1 };
  const cast = (g, C) => {
    for (const it of C.items) {
      const pen = it.kind === 'actor' ? PENS[it.who] || {} : {}, s = JQ.STORY_S(it.y || 1000), col = r => pen[r] || PROPC[r];
      g.save(); if (it.alpha != null && it.alpha < 1) g.globalAlpha = it.alpha;
      g.save(); g.translate(-3 * s, 2 * s); it.parts.forEach(p => { const c = col(p.role); if (c && !SOLID[p.role]) { g.fillStyle = c; g.fill(p.path); } }); g.restore();
      it.parts.forEach(p => { if (SOLID[p.role]) { g.fillStyle = KEY; g.fill(p.path); } else if (p.pts.length > 2) keyline(g, JQ.P(JQ.jitter(p.pts, 1.1 * s, 61, 0.08)), Math.max(2.2, 3.2 * s)); });
      g.restore();
    }
  };
  // the ox's breath, at its nose, while it stands or walks
  const noseOf = o => [o.x + 0.645 * 300 * o.s * o.dir, o.y - 0.3 * 300 * o.s];
  const TX = 1680, TY = 76, TW = 160, TH = 392;   // the carved title block, kept 80 px inside the edge for the camera push
  const buildPrint = (g, Sx) => {
    g.fillStyle = PAPER; g.fillRect(0, 0, W, H);
    BLOCKS.forEach(([name, dx, dy, fn]) => { const B = JQ.layer('s19b-' + name, Sx); fn(B.g); g.drawImage(B.c, dx, dy, W, H); });
    // carved title block: vermilion, characters cut out to paper (阴刻), edges a little ragged; the pentad column is cut live
    g.fillStyle = RED; g.fill(rough([[TX, TY], [TX + TW, TY], [TX + TW, TY + TH], [TX, TY + TH]], 2.5, 41));
    g.fillStyle = PAPER; g.textAlign = 'center'; g.textBaseline = 'top';
    g.font = `900 82px ${SONG}`; JQ.vtext(g, '立冬', TX + 104, TY + 22, 92);
    g.strokeStyle = PAPER; g.lineWidth = 2; g.beginPath(); g.moveTo(TX + 64, TY + 18); g.lineTo(TX + 64, TY + TH - 18); g.stroke();
    // paper: fibres and the grain of the baren rubbing
    g.globalAlpha = 0.06; g.fillStyle = '#5A4A3A'; for (let i = 0; i < 2400; i++) { const x = JQ.hash(i, 1, 19) * W, y = JQ.hash(i, 2, 19) * H; g.fillRect(x, y, 6 + JQ.hash(i, 3, 19) * 16, 1); } g.globalAlpha = 1;
  };
  // the pentad's words, cut into the block one character after another at the head of each bar
  const houText = (g, t, h) => {
    const b0 = h * BAR; g.fillStyle = PAPER; g.font = `900 40px ${SONG}`; g.textAlign = 'center'; g.textBaseline = 'top';
    [...HOU[h]].forEach((ch, i) => { const a = h ? JQ.smooth(b0 + 0.04 + i * 0.09, b0 + 0.14 + i * 0.09, t) : 1; if (a <= 0) return; g.globalAlpha = a; g.fillText(ch, TX + 36, TY + 24 + i * 58 + (1 - a) * 5); });
    g.globalAlpha = 1;
  };
  // ---------------------------------------------------------------- the moving figures, cut and printed the same way
  const HOLE = [1040, 868], HR = [178, 52];
  const pheasant = (g, x, y, ang, flap, s = 1) => {
    g.save(); g.translate(x, y); g.rotate(ang); g.scale(s, s);
    const tail = new Path2D('M-40 -4 L-156 -24 L-152 -10 L-40 8 Z'); ink(g, tail, '#B88A4A'); g.strokeStyle = KEY; g.lineWidth = 3; for (let i = 0; i < 6; i++) { const xx = -58 - i * 16; g.beginPath(); g.moveTo(xx, -6 - i * 2.6); g.lineTo(xx - 3, 4 - i * 2); g.stroke(); } keyline(g, tail, 2.4);
    const body = new Path2D('M30 -6 C 18 -28, -30 -26, -48 -4 C -30 18, 14 20, 30 6 Z'); ink(g, body, '#B5582A'); keyline(g, body, 2.8);
    const wing = new Path2D(`M4 -8 C -10 ${-40 - flap * 40}, -40 ${-44 - flap * 34}, -46 ${-30 - flap * 30} C -30 -18, -12 -12, 4 -8 Z`); ink(g, wing, '#6E3E1E'); keyline(g, wing, 2.4);
    g.strokeStyle = PAPER; g.lineWidth = 1.6; for (let i = 0; i < 4; i++) { g.beginPath(); g.moveTo(-8 - i * 8, -12 - flap * 6); g.lineTo(-20 - i * 6, -30 - flap * 26); g.stroke(); }
    g.fillStyle = PAPER; g.fillRect(25, -10, 7, 16);
    const head = new Path2D('M30 -12 C 36 -30, 58 -30, 62 -16 L 74 -12 L 60 -8 C 52 2, 36 4, 30 -2 Z'); ink(g, head, '#1F5A48'); keyline(g, head, 2.4);
    g.fillStyle = RED; g.beginPath(); g.ellipse(50, -18, 7.5, 5.5, 0, 0, TAU); g.fill(); g.fillStyle = KEY; g.beginPath(); g.arc(52, -19, 2, 0, TAU); g.fill();
    g.restore();
  };
  // the clam, side view, hinge at the back (left): each valve a broad rounded shell with a scalloped margin, growth bands
  // concentric to the beak (umbo) and fine ribs fanning from it. The upper valve swings up about the hinge.
  const CR = 158, CH = 92, UMB = [-112, 0];
  const valve = dir => { const p = new Path2D(); for (let i = 0; i <= 36; i++) { const a = Math.PI - i / 36 * Math.PI, sc = 1 + 0.01 * Math.cos(i * Math.PI);
    const x = Math.cos(a) * CR * sc, y = dir * Math.sin(a) * CH * sc * (1 - 0.18 * Math.max(0, -Math.cos(a))); i ? p.lineTo(x, y) : p.moveTo(x, y); } p.closePath(); return p; };
  const VAL = [-1, 1].map(dir => ({ dir, path: valve(dir), bands: [0.8, 0.58, 0.34].map(k => { const p = new Path2D(); p.addPath(valve(dir), new DOMMatrix().translate(UMB[0], 0).scale(k, k).translate(-UMB[0], 0)); return p; }) }));
  const shell = (g, V, c1, c2) => {
    ink(g, V.path, c1); V.bands.forEach((b, i) => ink(g, b, i % 2 ? c1 : c2));
    g.save(); g.clip(V.path); g.strokeStyle = PAPER; g.lineWidth = 1.8; g.lineCap = 'round';
    for (let i = 1; i < 7; i++) { const a = Math.PI - i / 7 * Math.PI; g.beginPath(); g.moveTo(UMB[0] + 10, 0); g.lineTo(Math.cos(a) * CR * 1.1, V.dir * Math.sin(a) * CH * 1.1); g.stroke(); }
    g.restore(); keyline(g, V.path, 3.2); V.bands.forEach(b => keyline(g, b, 1.6));
  };
  const clam = (g, x, y, open) => {
    g.save(); g.translate(x, y);
    if (open > 0.02) { g.fillStyle = KEY; g.beginPath(); g.moveTo(-CR, 0); g.lineTo(-CR + 2 * CR * Math.cos(open * 0.4), -2 * CR * Math.sin(open * 0.4)); g.lineTo(CR, 6); g.closePath(); g.fill();
      g.fillStyle = '#E6B3A8'; g.beginPath(); g.ellipse(10, -4, 96, 10 + open * 30, -open * 0.22, Math.PI, TAU); g.fill(); g.fillStyle = '#F4E3D8'; g.beginPath(); g.ellipse(26, -8, 40, 6 + open * 12, -open * 0.22, Math.PI, TAU); g.fill(); }
    shell(g, VAL[1], '#6F82A0', '#94A6C2');
    g.save(); g.translate(-CR, 0); g.rotate(-open * 0.4); g.translate(CR, 0); shell(g, VAL[0], '#8C9CB6', '#B4C2D8'); g.restore();
    g.restore();
  };
  // the mirage of towers: a pale violet block with its own key, cut with white window slits; shown in shimmering slices
  const palace = g => {
    const P = new Path2D(), K = new Path2D();
    const roof = (cx, y, w, h) => { const p = new Path2D(); p.moveTo(cx - w / 2 - 18, y + 4); p.quadraticCurveTo(cx - w / 2, y + h * 0.2, cx - w * 0.3, y - h * 0.5); p.lineTo(cx + w * 0.3, y - h * 0.5); p.quadraticCurveTo(cx + w / 2, y + h * 0.2, cx + w / 2 + 18, y + 4); p.closePath(); P.addPath(p); K.addPath(p); };
    const storey = (cx, y, w, h) => { const p = new Path2D(); p.rect(cx - w / 2, y - h, w, h); P.addPath(p); K.addPath(p); for (let i = 1; i < 5; i++) { K.moveTo(cx - w / 2 + i * w / 5, y - h); K.lineTo(cx - w / 2 + i * w / 5, y); } };
    const base = new Path2D(); base.rect(760, 318, 560, 16); P.addPath(base); K.addPath(base);
    storey(1040, 318, 220, 54); roof(1040, 264, 280, 40); storey(1040, 228, 160, 46); roof(1040, 182, 210, 36); storey(1040, 150, 100, 38); roof(1040, 112, 140, 34);
    storey(860, 318, 120, 40); roof(860, 278, 160, 30); storey(1220, 318, 120, 40); roof(1220, 278, 160, 30);
    g.save(); g.translate(3, -2); g.fillStyle = '#D9D3EE'; g.fill(P); g.restore();
    g.strokeStyle = VIO; g.lineWidth = 2.6; g.lineJoin = 'round'; g.stroke(K);
    g.fillStyle = '#F6E8B0'; [[1040, 292], [1040, 204], [860, 300], [1220, 300]].forEach(([x, y]) => g.fillRect(x - 6, y - 8, 12, 14));
  };
  const SNOWF = Array.from({ length: 90 }, (_, i) => ({ x: JQ.hash(i, 1, 5) * W, ph: JQ.hash(i, 2, 5), r: 2 + JQ.hash(i, 4, 5) * 2.6 }));
  // 水始冰: the ice block grows in from the rim, needle crystals cut into it, until only a hole of black water is left
  const ICEN = Array.from({ length: 46 }, (_, i) => ({ a: i / 46 * TAU + (JQ.hash(i, 61) - 0.5) * 0.12, l: 0.35 + JQ.hash(i, 62) * 0.4 }));
  const ice = (g, t) => {
    const k = JQ.clamp((t - 0.25) / 1.1), f = 1 - (1 - k) * (1 - k); if (f <= 0) return;
    const hp = []; for (let i = 0; i < 40; i++) { const a = i / 40 * TAU, wob = 1 + (JQ.noise(Math.cos(a) * 2 + 5, Math.sin(a) * 2, 63) - 0.5) * 0.4 * f;
      hp.push([JQ.lerp(L.pond.cx, HOLE[0], f) + Math.cos(a) * JQ.lerp(L.pond.rx * 1.03, HR[0], f) * wob, JQ.lerp(L.pond.cy, HOLE[1], f) + Math.sin(a) * JQ.lerp(L.pond.ry * 1.05, HR[1], f) * wob]); }
    const hole = JQ.P(hp), sheet = new Path2D(S.pond.path); sheet.addPath(hole);
    g.save(); g.clip(S.pond.path); g.clip(sheet, 'evenodd'); g.fillStyle = '#C3D3E8'; g.fill(sheet, 'evenodd');
    g.strokeStyle = MBL; g.lineWidth = 2.4; g.lineCap = 'round'; g.beginPath();
    ICEN.forEach(n => { const x0 = L.pond.cx + Math.cos(n.a) * L.pond.rx, y0 = L.pond.cy + Math.sin(n.a) * L.pond.ry, m = n.l * f; g.moveTo(x0, y0); g.lineTo(JQ.lerp(x0, L.pond.cx, m), JQ.lerp(y0, L.pond.cy, m)); });
    g.stroke(); g.fillStyle = PAPER; g.beginPath(); for (let i = 0; i < 9; i++) cut(g, 760 + i * 58 + JQ.hash(i, 64) * 30, 818 + JQ.hash(i, 65) * 120, 40 * f, 3, -0.04); g.fill();
    g.restore(); keyline(g, hole, 3);
  };
  // 地始冻: a frost crack zigzags out across the snowfield both ways, white frost cut along its lips
  const CRK = (() => { const R = JQ.rng(1919), segs = [];
    const run = (x, y, a, n, w, t0, d) => { for (let i = 0; i < n; i++) { const na = a + (R() - 0.5) * 1.1, nx = x + Math.cos(na) * 26, ny = y + Math.sin(na) * 11;
      segs.push({ x1: x, y1: y, x2: nx, y2: ny, w, t: t0 + i * 0.045 }); if (d < 1 && R() < 0.14) run(nx, ny, a + (R() < 0.5 ? -1 : 1) * (0.5 + R() * 0.5), Math.round(n * 0.3 + 3), w * 0.6, t0 + i * 0.045 + 0.05, d + 1); x = nx; y = ny; } };
    run(380, 992, Math.PI + 0.03, 13, 10, 2.78, 0); run(380, 992, -0.1, 13, 10, 2.78, 0); run(380, 992, -0.8, 6, 6, 2.9, 1); return segs; })();
  const crack = (g, t) => {
    if (t < 2.78) return;
    g.lineCap = 'round'; g.strokeStyle = MBL;     // the heaved lips throw a band of blue (printed from the mid-blue block)
    CRK.forEach(s => { const k = JQ.smooth(s.t, s.t + 0.4, t); if (k <= 0) return; g.lineWidth = s.w * 3.4 * k; g.beginPath(); g.moveTo(s.x1, s.y1 + 2); g.lineTo(s.x2, s.y2 + 2); g.stroke(); });
    g.fillStyle = PAPER; g.beginPath();
    CRK.forEach((s, i) => { const k = JQ.clamp((t - s.t) / 0.3); if (k <= 0) return; const mx = (s.x1 + s.x2) / 2, my = (s.y1 + s.y2) / 2, l = (14 + JQ.hash(i, 71) * 22) * k * s.w / 6;
      cut(g, mx - 4, my - l * 0.5 - 5, l, 2.8, -1.3 + JQ.hash(i, 72) * 0.5); cut(g, mx + 5, my + l * 0.5 + 5, l, 2.8, 1.3 - JQ.hash(i, 73) * 0.5); cut(g, mx + 9, my - l * 0.4 - 4, l * 0.7, 2.2, -1.75 + JQ.hash(i, 74) * 0.4); });
    g.fill(); g.strokeStyle = KEY;
    CRK.forEach(s => { const k = JQ.clamp((t - s.t) / 0.045); if (k <= 0) return; g.lineWidth = s.w * (0.6 + 0.4 * JQ.smooth(s.t, s.t + 0.6, t)); g.beginPath(); g.moveTo(s.x1, s.y1); g.lineTo(JQ.lerp(s.x1, s.x2, k), JQ.lerp(s.y1, s.y2, k)); g.stroke(); });
    g.strokeStyle = PAPER; g.lineWidth = 2;
    CRK.forEach(s => { const k = JQ.smooth(s.t + 0.1, s.t + 0.5, t); if (k <= 0 || s.w < 6) return; g.beginPath(); g.moveTo(s.x1, s.y1 - s.w * 0.75); g.lineTo(JQ.lerp(s.x1, s.x2, k), JQ.lerp(s.y1, s.y2, k) - s.w * 0.75); g.stroke(); });
  };
  const puff = (g, t, x, y, d = 1) => { const k = (t % 2) / 1.1; if (k > 1) return; g.globalAlpha = 1 - k; g.fillStyle = PAPER;
    [[0, 0, 1], [16, -9, 0.8], [30, -3, 0.6]].forEach(([dx, dy, s]) => { g.beginPath(); g.ellipse(x + (dx * (0.5 + k) + k * 34) * d, y + dy * (0.5 + k) - k * 14, (8 + k * 16) * s, (5 + k * 10) * s, 0, 0, TAU); g.fill(); }); g.globalAlpha = 1; };
  // 候三 timing: dive 5.35–6.15, splash, clam rises 6.2–6.55 and snaps open on 6.667 (beat 3), breath, mirage from 6.9 and holds
  const DIVE0 = 5.35, DIVE1 = 6.15;
  JQ.ART[19] = {
    key: IMP, keyHou: JQ.TERMS[18].keyHou, focus: [[990, 880], [400, 980], [1010, 560]], frame: false,
    draw(g, t, Sx) {
      t = JQ.clamp(t, 0, 9); const h = Math.min(2, Math.floor(t / BAR));
      JQ.blit(g, JQ.cached('s19print', Sx, buildPrint));
      ice(g, t); crack(g, t);
      const rise = JQ.smooth(6.18, 6.55, t), ko = JQ.clamp((t - 6.45) / (IMP - 6.45)), after = Math.max(0, t - IMP);
      const open = t < IMP ? ko * ko : 1 + 0.1 * Math.sin(after * 18) * Math.exp(-after * 6);
      const breath = JQ.smooth(IMP, 7.45, t), mir = JQ.smooth(6.9, 7.8, t);
      if (mir > 0) {
        const P = JQ.cached('s19palace', Sx, palace);
        g.save(); g.globalAlpha = 0.92 * mir;
        for (let y = 40; y < 340; y += 6) { const dx = Math.sin(y * 0.07 + t * 5) * 4 * (1 - mir * 0.5); g.drawImage(P.c, 0, y * Sx.scale, P.c.width, 6 * Sx.scale, dx, y, W, 6); }
        g.restore();
      }
      const MX = HOLE[0] + 40, MY = HOLE[1] - 100;
      if (breath > 0) {
        const pts = []; for (let i = 0; i <= 40 * breath; i++) { const k = i / 40; pts.push([MX + Math.sin(k * 5 + t * 1.5) * 50 * k + k * 40, MY - k * 470]); }
        if (pts.length > 2) {
          const Lf = [], Rt = [], n = pts.length;
          pts.forEach((q, i) => { const a = pts[Math.max(0, i - 1)], b = pts[Math.min(n - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], d = Math.hypot(dx, dy) || 1, k = i / 40, w = (30 + 170 * Math.pow(k, 1.3)) * (1 + 0.12 * Math.sin(i * 0.9 + t * 3));
            Lf.push([q[0] - dy / d * w / 2, q[1] + dx / d * w / 2]); Rt.push([q[0] + dy / d * w / 2, q[1] - dx / d * w / 2]); });
          const band = JQ.smoothPath([...Lf, ...Rt.reverse()]); g.fillStyle = PAPER; g.fill(band); g.strokeStyle = MBL; g.lineWidth = 2.6; g.stroke(band);
          g.strokeStyle = SBL; g.lineWidth = 2.2; g.lineCap = 'round'; [-0.28, 0.05, 0.3].forEach(o => { g.beginPath(); pts.forEach((q, i) => { const x = JQ.lerp(Lf[i][0], Rt[n - 1 - i][0], 0.5 + o), y = JQ.lerp(Lf[i][1], Rt[n - 1 - i][1], 0.5 + o); i ? g.lineTo(x, y) : g.moveTo(x, y); }); g.stroke(); });
        }
      }
      if (rise > 0) {
        g.save(); g.clip(new Path2D(`M0 0 H${W} V${HOLE[1] + 16} H0 Z`)); clam(g, HOLE[0], HOLE[1] - 58 + 150 * (1 - rise), Math.max(0, open)); g.restore();
        g.strokeStyle = PAPER; g.lineWidth = 4; g.beginPath(); g.ellipse(HOLE[0], HOLE[1] + 14, 170 * rise, 14, 0, 0, TAU); g.stroke(); keyline(g, (() => { const p = new Path2D(); p.ellipse(HOLE[0], HOLE[1] + 16, 176 * rise, 16, 0, 0, Math.PI); return p; })(), 2);
      }
      if (t > DIVE0 && t < DIVE1 + 0.05) { const k = JQ.ease(JQ.clamp((t - DIVE0) / (DIVE1 - DIVE0))), x = JQ.lerp(260, HOLE[0], k), y = JQ.lerp(250, HOLE[1] - 10, k) - Math.sin(k * Math.PI) * 120;
        pheasant(g, x, y, JQ.lerp(0.1, 0.9, k), Math.sin(t * 22) * 0.5 + 0.5, 1.2); }
      // splash of the dive, then the snap of the shell: radial cuts thrown out from the water
      const burst = (t0, r0, sp, n, w, a) => { const e = t - t0; if (e < 0 || e > 0.8) return; g.globalAlpha = a * (1 - e / 0.8); g.strokeStyle = PAPER; g.lineWidth = w; g.lineCap = 'round';
        for (let i = 0; i < n; i++) { const an = Math.PI + i / (n - 1) * Math.PI, ra = r0 + e * sp, rb = ra + 30 + JQ.hash(i, 3, n) * 50; g.beginPath(); g.moveTo(HOLE[0] + Math.cos(an) * ra, HOLE[1] + Math.sin(an) * ra * 0.6); g.lineTo(HOLE[0] + Math.cos(an) * rb, HOLE[1] + Math.sin(an) * rb * 0.6); g.stroke(); }
        g.globalAlpha = 1; };
      burst(DIVE1 - 0.02, 30, 170, 14, 6, 1); burst(IMP, 190, 260, 20, 7, 1);
      const C = JQ.castFor(Sx, t); cast(g, C);
      const ox = C.state.ox; if (ox && (ox.pose === 'stand' || ox.pose === 'walk')) { const [nx, ny] = noseOf(ox); puff(g, t, nx + 6 * ox.dir, ny + 6, ox.dir); }
      houText(g, t, h);
      g.fillStyle = PAPER;
      for (const f of SNOWF) for (let r = 0; r < 7; r++) { const y = (r + (f.ph + t / 4) % 1) * 160 - 40; if (y < 0 || y > H) continue; g.beginPath(); g.ellipse(f.x + Math.sin(t * Math.PI / 2 + r + f.ph * 9) * 10, y, f.r * 1.3, f.r * 0.8, 0.4, 0, TAU); g.fill(); }
    },
  };
})();
