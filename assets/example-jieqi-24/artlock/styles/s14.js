// s14 处暑 ·《耕织图》— a Qing album leaf after the Kangxi woodblock 耕织图: fine, wiry carved lines over pale hand-laid
// colour (the colour sits a hair off the line, as on a hand-coloured print), a touch of Western perspective in the
// converging furrows and the threshing floor, the leaf mounted in a pale silk border with a framed poem box at the top
// written in regular script and one seal. Memory (禾乃登): in the field men cut the grain and bind the sheaves, on the
// threshing floor two flails rise and fall; on the wall top an eagle lays its catch out in a row (鹰乃祭鸟).
// Film unit (8 s, one pentad per bar): 候一 鹰乃祭鸟 — the eagle on the wall lays five small birds in a row;
// 候二 天地始肃 — a carved autumn wind (cloud-scroll curls) sweeps left to right and the hills and the crown are re-printed
// in ochre behind it, a few outlined leaves fall; 候三 禾乃登 (key) — the threshers strike in turn on the beats and at
// 6.667 s both flails come down together (grain bursts, the heap rises) as the reapers cut the last row.
(function () {
  const JQ = window.JQ, S = JQ.SCENE, L = JQ.L, H = L.house;
  const BAR = 8 / 3, IMP = 2 * BAR + 4 / 3, HOU = JQ.TERMS[13].hou;
  const C = { paper: '#ECE2C8', ink: '#2E2620', silk: '#C7CBBB', silkL: '#D6D9CB', blue: '#9FB6C2', green: '#AFC09A', greenD: '#8EA67A', ochre: '#D8C095', straw: '#E2CC8A',
    strawD: '#C4A860', brown: '#A88A64', red: '#B8503A', grey: '#A8A49A', indigo: '#7F98B0', skin: '#EED8BC' };
  const IN = 56;
  const line = (g, p, w = 1.4) => { g.strokeStyle = C.ink; g.lineWidth = w; g.lineJoin = 'round'; g.lineCap = 'round'; g.stroke(p); };
  // hand-laid colour: slightly off-register, slightly uneven
  const wash = (g, p, col, a = 0.85) => { g.save(); g.translate(2.5, 1.8); g.globalAlpha = a; g.fillStyle = col; g.fill(p); g.restore(); };
  const fy = (k, x) => x < 1180 ? JQ.lerp(JQ.lerp(L.HORIZON, 690, k), JQ.lerp(L.HORIZON, 640, k), x / 1180) : JQ.lerp(JQ.lerp(L.HORIZON, 640, k), JQ.lerp(L.HORIZON, 590, k), (x - 1180) / 740);
  const strip = (k0, k1) => { const p = new Path2D(); p.moveTo(0, fy(k0, 0)); p.lineTo(1180, fy(k0, 1180)); p.lineTo(1920, fy(k0, 1920)); p.lineTo(1920, fy(k1, 1920)); p.lineTo(1180, fy(k1, 1180)); p.lineTo(0, fy(k1, 0)); p.closePath(); return p; };
  const HK0 = 0.42, harvest = strip(HK0, 1);
  const FLOOR = { cx: 720, cy: 1004, rx: 250, ry: 48 };    // the threshing floor (场院) on the open ground in front of the pond
  const ell = (x, y, rx, ry) => { const p = new Path2D(); p.ellipse(x, y, rx, ry, 0, 0, 6.2832); return p; };

  const buildBg = g => {
    g.fillStyle = C.paper; g.fillRect(0, 0, 1920, 1080);
    // age: a few soft foxing stains
    const R = JQ.rng(1401); for (let i = 0; i < 26; i++) { const x = R() * 1920, y = R() * 1080, r = 20 + R() * 90, gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, 'rgba(170,140,90,0.10)'); gr.addColorStop(1, 'rgba(170,140,90,0)'); g.fillStyle = gr; g.fillRect(x - r, y - r, 2 * r, 2 * r); }
    // far hills: pale blue-green wash, long hemp-fibre texture strokes down the slopes, a carved contour
    wash(g, S.mountains.path, C.blue, 0.7);
    g.save(); g.clip(S.mountains.path); g.strokeStyle = 'rgba(46,38,32,0.45)'; g.lineWidth = 1;
    S.ridge.pts.forEach(([x, y], i) => { if (i % 2) return; g.beginPath(); g.moveTo(x, y + 6); g.quadraticCurveTo(x + 10, y + 50, x - 4 + (i % 5) * 4, y + 110); g.stroke(); });
    g.restore(); line(g, JQ.open(S.ridge.pts), 1.5);
    wash(g, S.hills.path, C.green, 0.75); line(g, JQ.open(S.hills.pts.slice(0, -2)), 1.3);
    g.save(); g.clip(S.hills.path); g.fillStyle = 'rgba(46,38,32,0.5)'; for (let i = 0; i < 90; i++) { const x = JQ.hash(i, 1, 143) * 1920, y = 388 + JQ.hash(i, 2, 143) * 30; for (let k = 0; k < 3; k++) { g.beginPath(); g.arc(x + k * 5 - 5, y - (k % 2) * 4, 2.8, 0, 6.2832); g.fill(); } } g.restore();
    // the ground, the field strips in perspective, furrows carved
    wash(g, S.ground.path, C.ochre, 0.6);
    const cols = [C.green, C.straw, C.greenD, C.straw, C.green, C.straw];
    for (let i = 0; i < 6; i++) wash(g, strip(i * HK0 / 6, (i + 1) * HK0 / 6), cols[i], 0.7);
    wash(g, harvest, '#E8DAB0', 0.8);
    g.save(); g.clip(harvest); g.strokeStyle = 'rgba(120,96,50,0.6)'; g.lineWidth = 1;
    const RS = JQ.rng(1402); for (let i = 0; i < 2400; i++) { const x = RS() * 1920, y = fy(HK0 + RS() * (1 - HK0), x); g.beginPath(); g.moveTo(x, y); g.lineTo(x + 0.5, y - 4); g.stroke(); }
    g.restore();
    S.furrows.forEach(f => line(g, f.path, 1)); line(g, JQ.open([[0, 690], [1180, 640], [1920, 590]]), 1.3);
    // converging rows on the far strips: the Western touch
    g.save(); g.clip(strip(0, HK0)); g.strokeStyle = 'rgba(46,38,32,0.35)'; g.lineWidth = 0.9; for (let x = -800; x < 2800; x += 40) { g.beginPath(); g.moveTo(960 + (x - 960) * 0.35, L.HORIZON); g.lineTo(x, fy(HK0, x)); g.stroke(); } g.restore();
    // path, stream, pond with carved wavelets
    wash(g, S.path.path, '#E8DCC0', 0.9); line(g, S.path.path, 1.1);
    wash(g, S.stream.path, C.blue, 0.85); line(g, S.stream.path, 1.2);
    wash(g, S.pondRim.path, C.brown, 0.55); line(g, S.pondRim.path, 1.1);
    wash(g, S.pond.path, '#B6CAD0', 0.9); line(g, S.pond.path, 1.5);
    g.save(); g.clip(S.pond.path); g.strokeStyle = 'rgba(46,38,32,0.55)'; g.lineWidth = 1;
    for (let y = 796; y < 975; y += 15) for (let x = 690 + (y % 30); x < 1300; x += 40) { g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + 10, y - 6, x + 20, y); g.quadraticCurveTo(x + 30, y + 6, x + 40, y); g.stroke(); }
    g.restore();
    // the threshing floor: a swept oval of beaten earth with a carved rim, spread thick with millet ears (场院铺满谷穗)
    const fl = ell(FLOOR.cx, FLOOR.cy, FLOOR.rx, FLOOR.ry); wash(g, fl, '#E6D6AE', 0.95);
    g.save(); g.clip(fl); const RE = JQ.rng(1404);
    for (let i = 0; i < 900; i++) { const a = RE() * 6.2832, d = Math.sqrt(RE()), x = FLOOR.cx + Math.cos(a) * d * FLOOR.rx, y = FLOOR.cy + Math.sin(a) * d * FLOOR.ry, r = RE() * 3.1;
      g.strokeStyle = 'rgba(46,38,32,0.5)'; g.lineWidth = 0.9; g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(r) * 16, y + Math.sin(r) * 5); g.stroke();
      g.fillStyle = RE() < 0.5 ? C.strawD : C.straw; g.beginPath(); g.ellipse(x + Math.cos(r) * 16, y + Math.sin(r) * 5, 4.6, 2.2, r, 0, 6.2832); g.fill(); }
    g.restore(); line(g, fl, 1.5);
    // the stone bridge, in courses
    wash(g, S.bridge.path, '#D8D2C2', 0.9);
    g.save(); g.clip(S.bridge.path); g.strokeStyle = 'rgba(46,38,32,0.5)'; g.lineWidth = 1; for (let y = 662; y < 720; y += 11) { g.beginPath(); g.moveTo(1170, y); g.lineTo(1410, y); g.stroke(); } g.restore();
    line(g, S.bridge.path, 1.5); line(g, JQ.open(S.bridgeArch.pts), 1.2);
    // the farmhouse: tile rows, brick courses, a timber gate — careful carved lines, pale colour
    wash(g, S.roof.path, C.grey, 0.75); S.roofLines.forEach(r => line(g, r.path, 0.9));
    for (let y = H.ridgeY + 10; y < H.eaveY; y += 11) line(g, JQ.open([[H.roofX0 + 24, y], [H.roofX1 - 20, y]]), 0.6);
    line(g, S.roof.path, 1.5); wash(g, S.chimney.path, C.grey, 0.8); line(g, S.chimney.path, 1.2);
    wash(g, S.houseFront.path, '#E4DAC4', 0.9); line(g, S.houseFront.path, 1.2); wash(g, S.window.path, C.brown, 0.9); line(g, S.window.path, 1.2);
    for (let x = 1726; x < 1800; x += 9) line(g, JQ.open([[x, 557], [x, 593]]), 0.7);
    wash(g, S.wall.path, '#E6DCC6', 0.9);
    g.save(); g.clip(S.wall.path); g.strokeStyle = 'rgba(46,38,32,0.35)'; g.lineWidth = 0.8;
    for (let y = H.wallTop + 16; y < H.wallBot; y += 16) { g.beginPath(); g.moveTo(H.wallX0, y); g.lineTo(H.wallX1, y); g.stroke(); for (let x = H.wallX0 + ((y / 16) % 2) * 18; x < H.wallX1; x += 36) { g.beginPath(); g.moveTo(x, y); g.lineTo(x, y + 16); g.stroke(); } }
    g.restore(); line(g, S.wall.path, 1.4);
    wash(g, S.wallCap.path, C.grey, 0.9); line(g, S.wallCap.path, 1.2);
    wash(g, S.gate.path, '#8A6A4A', 0.9); line(g, S.gate.path, 1.4); line(g, JQ.open([[1650, H.gateTop + 4], [1650, H.wallBot]]), 1);
    wash(g, S.gateRoof.path, C.grey, 0.9); line(g, S.gateRoof.path, 1.3);
  };

  // ---------------------------------------------------------------- the tree, the cast, the mount, the poem box (cached)
  // the crown as a woodblock cutter does it: an uneven pale wash, then clusters of outlined leaves (夹叶) radiating from
  // twig ends, so no clump shows a round outline; `pal` = [wash, wash2, leaf fills...] lets the autumn plate reuse it
  const crown = (g, pal) => {
    const all = new Path2D();
    S.clumps.forEach((q, i) => { const pts = Array.from({ length: 36 }, (_, k) => { const a = k / 36 * 6.2832, r = q.r * (0.86 + 0.14 * JQ.noise(k * 0.9, i, 145)); return [q.x + Math.cos(a) * r, q.y + Math.sin(a) * r * 0.9]; }); all.addPath(JQ.smoothPath(pts)); });
    g.fillStyle = C.paper; g.fill(all); wash(g, all, pal[0], 0.55);
    g.save(); g.clip(all); const R = JQ.rng(1440); for (let i = 0; i < 26; i++) { const x = 200 + R() * 580, y = 120 + R() * 380, r = 40 + R() * 70, gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, JQ.rgba(pal[1], 0.4)); gr.addColorStop(1, JQ.rgba(pal[1], 0)); g.fillStyle = gr; g.fillRect(x - r, y - r, 2 * r, 2 * r); } g.restore();
    const RL = JQ.rng(1441); g.lineWidth = 0.9; g.lineJoin = 'round';
    S.clumps.forEach((q, i) => { const n = Math.round(q.r * q.r / 560);
      for (let k = 0; k < n; k++) { const a0 = RL() * 6.2832, d = Math.sqrt(RL()) * q.r * 0.8, cx = q.x + Math.cos(a0) * d, cy = q.y + Math.sin(a0) * d * 0.88, rot = RL() * 6.2832, m = 3 + Math.floor(RL() * 2), len = 13 + RL() * 6, col = pal[2 + Math.floor(RL() * (pal.length - 2))];
        for (let j = 0; j < m; j++) { const a = rot + j / m * 6.2832 * 0.55 - 0.9, tx = cx + Math.cos(a) * len, ty = cy + Math.sin(a) * len * 0.9, nx = -Math.sin(a) * len * 0.32, ny = Math.cos(a) * len * 0.32;
          const lf = new Path2D(); lf.moveTo(cx, cy); lf.quadraticCurveTo((cx + tx) / 2 + nx, (cy + ty) / 2 + ny, tx, ty); lf.quadraticCurveTo((cx + tx) / 2 - nx, (cy + ty) / 2 - ny, cx, cy);
          g.fillStyle = col; g.fill(lf); g.strokeStyle = 'rgba(46,38,32,0.62)'; g.stroke(lf); } } });
  };
  const GREEN = [C.green, '#7E9A66', '#B9C99A', '#A3B98A', '#C8D2A8'], FALL = ['#D2A060', '#A8602E', '#E0B070', '#C88A48', '#D8B888', '#B87040'];
  const buildFront = g => {
    g.strokeStyle = C.ink; JQ.drawBranches(g, 2, 0.55);
    wash(g, S.trunk.path, '#B89A74', 0.9); line(g, S.trunk.path, 1.5);
    g.save(); g.clip(S.trunk.path); g.strokeStyle = 'rgba(46,38,32,0.55)'; g.lineWidth = 1; for (let y = 480; y < 830; y += 18) { g.beginPath(); g.moveTo(440, y); g.quadraticCurveTo(480, y + 6, 540, y - 4); g.stroke(); } g.restore();
    crown(g, GREEN);
    // (the family is not cached: it comes from the story track every frame)
    // the mount: a pale silk border with a fine lattice, a brown rule, a paper slip, a carved frame line
    g.save(); g.beginPath(); g.rect(0, 0, 1920, 1080); g.rect(IN, IN, 1920 - 2 * IN, 1080 - 2 * IN); g.clip('evenodd');
    g.fillStyle = C.silk; g.fillRect(0, 0, 1920, 1080); g.strokeStyle = 'rgba(150,154,136,0.45)'; g.lineWidth = 1;
    for (let d = -1080; d < 1920; d += 14) { g.beginPath(); g.moveTo(d, 0); g.lineTo(d + 1080, 1080); g.moveTo(d + 1080, 0); g.lineTo(d, 1080); g.stroke(); }
    g.fillStyle = C.silkL; g.fillRect(44, 44, 1920 - 88, 1080 - 88); g.fillStyle = '#F2EBD8'; g.fillRect(47, 47, 1920 - 94, 1080 - 94); g.restore();
    g.strokeStyle = '#6E5A44'; g.lineWidth = 2.5; g.strokeRect(45, 45, 1920 - 90, 1080 - 90); line(g, (() => { const p = new Path2D(); p.rect(IN, IN, 1920 - 2 * IN, 1080 - 2 * IN); return p; })(), 2);
    // the poem box: double-ruled, regular script read right to left, one seal; the pentad column is carved in per bar
    const bx = BX, by = BY, bw = BW, bh = BH;
    g.fillStyle = '#F3ECDB'; g.fillRect(bx, by, bw, bh); g.strokeStyle = C.ink; g.lineWidth = 2.6; g.strokeRect(bx, by, bw, bh); g.lineWidth = 1; g.strokeRect(bx + 7, by + 7, bw - 14, bh - 14);
    g.fillStyle = C.ink; g.textAlign = 'center'; g.textBaseline = 'top';
    g.font = '400 88px "Kaiti SC", "STKaiti", serif'; JQ.vtext(g, '处暑', bx + bw - 70, by + 18, 92);
    g.strokeStyle = 'rgba(46,38,32,0.35)'; g.lineWidth = 1; for (const x of [bx + bw - 122]) { g.beginPath(); g.moveTo(x, by + 16); g.lineTo(x, by + bh - 16); g.stroke(); }
    g.fillStyle = C.red; g.fillRect(bx + 22, by + bh - 82, 54, 54); g.fillStyle = '#F3ECDB'; g.fillRect(bx + 26, by + bh - 78, 46, 46); g.fillStyle = C.red; g.fillRect(bx + 29, by + bh - 75, 40, 40);
    g.fillStyle = '#F3ECDB'; g.font = '700 18px "Kaiti SC", serif'; JQ.vtext(g, '耕织', bx + 49, by + bh - 73, 19);
  };
  const BX = 860, BY = 72, BW = 300, BH = 226;
  // the autumn plate for 天地始肃: the near hills and the crown re-printed in ochre and rust
  const buildFall = g => {
    g.save(); g.beginPath(); g.rect(IN, IN, 1920 - 2 * IN, 1080 - 2 * IN); g.clip();
    g.fillStyle = C.paper; g.fill(S.hills.path); wash(g, S.hills.path, '#CFA868', 0.85); line(g, JQ.open(S.hills.pts.slice(0, -2)), 1.3);
    g.save(); g.clip(S.hills.path); g.fillStyle = 'rgba(120,60,30,0.6)'; for (let i = 0; i < 90; i++) { const x = JQ.hash(i, 1, 143) * 1920, y = 388 + JQ.hash(i, 2, 143) * 30; for (let k = 0; k < 3; k++) { g.beginPath(); g.arc(x + k * 5 - 5, y - (k % 2) * 4, 2.8, 0, 6.2832); g.fill(); } } g.restore();
    crown(g, FALL); g.restore();
  };
  const carve = (g, t) => {            // the pentad column, cut one character at a time from the top down
    const i = Math.min(2, Math.floor(t / BAR)), lt = t - i * BAR, x = BX + BW - 172, y0 = BY + 22; g.fillStyle = C.ink; g.textAlign = 'center'; g.textBaseline = 'top'; g.font = '400 44px "Kaiti SC", "STKaiti", serif';
    if (i > 0 && lt < 0.2) { g.globalAlpha = 1 - lt / 0.2; JQ.vtext(g, HOU[i - 1], x, y0, 47); g.globalAlpha = 1; }
    const k = i === 0 ? HOU[0].length : JQ.clamp((lt - 0.15) / 0.7) * HOU[i].length;
    [...HOU[i]].forEach((ch, j) => { const a = JQ.clamp(k - j); if (a <= 0) return; g.save(); g.beginPath(); g.rect(x - 30, y0 + j * 47 - 2, 60, 48 * a); g.clip(); g.fillText(ch, x, y0 + j * 47); g.restore(); });
  };
  const buildGrain = g => {
    g.save(); g.clip(harvest); wash(g, harvest, C.straw, 0.95); const R = JQ.rng(1403);
    for (let i = 0; i < 4200; i++) { const x = R() * 1920, k = HK0 + R() * (1 - HK0), y = fy(k, x), h = 9 + k * 14;
      g.strokeStyle = 'rgba(46,38,32,0.55)'; g.lineWidth = 0.9; g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + 1, y - h * 0.6, x + 3, y - h); g.stroke();
      if (R() < 0.4) { g.fillStyle = C.strawD; g.beginPath(); g.ellipse(x + 3.5, y - h - 2, 1.5, 3.4, 0.4, 0, 6.2832); g.fill(); } }
    g.restore(); g.globalCompositeOperation = 'destination-out'; g.fillStyle = '#000';
    [S.stream, S.roof, S.houseFront, S.wall, S.wallCap, S.chimney].forEach(p => g.fill(p.path)); g.fillRect(H.wallX0, H.eaveY, 480, 300);
    g.globalCompositeOperation = 'source-over';
  };

  // ---------------------------------------------------------------- the family (story track), cut as woodblock figures:
  // each part gets a paper base, an off-register pale wash and a carved key line; the ox and calf bodies carry hatching
  const PEN = { skin: C.skin, hair: C.ink, coat: C.indigo, pants: '#5E6E80', apron: '#D8C8A8', hat: '#9FB6C2', scarf: '#9FB6C2', straw: C.straw, cape: '#A89A78', eye: C.ink,
    ox: '#D2AC74', oxDark: '#8A6A4A', horn: '#F0E6CC', calf: '#E2C08C', calfDark: '#9A7A58', prop: '#A88A64', metal: '#A8AAA4', red: C.red, line: C.ink };
  const hatch = (g, p) => { const xs = p.pts.map(q => q[0]), ys = p.pts.map(q => q[1]), x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys), ym = JQ.lerp(y0, y1, 0.5);
    g.save(); g.clip(p.path); g.strokeStyle = 'rgba(46,38,32,0.45)'; g.lineWidth = 0.9; g.beginPath(); for (let x = x0; x < x1 + 12; x += 6) { g.moveTo(x, ym); g.lineTo(x - 12, y1); } g.stroke(); g.restore(); };
  const carved = (g, items) => { for (const it of items) { const s = JQ.STORY_S(it.y || 1000), lw = 0.8 + 0.8 * s; g.save(); const a0 = it.alpha == null ? 1 : it.alpha; g.globalAlpha = a0;
    for (const p of it.parts) { const c = JQ.roleColor(PEN, p.role); if (c == null) continue;
      if (p.role === 'eye' || p.role === 'line' || p.role === 'hair') { g.fillStyle = C.ink; g.fill(p.path); continue; }
      g.fillStyle = C.paper; g.fill(p.path); g.save(); g.translate(2.2 * s, 1.6 * s); g.globalAlpha = 0.9 * a0; g.fillStyle = c; g.fill(p.path); g.restore();
      if ((p.role === 'ox' || p.role === 'calf') && p.pts.length >= 14) hatch(g, p);
      g.strokeStyle = C.ink; g.lineWidth = lw; g.lineJoin = 'round'; g.stroke(p.path); }
    g.restore(); } };
  const sheaf = (g, x, y, k, s = 1) => { if (k <= 0) return; g.save(); g.translate(x, y); g.scale(1.4 * s, 1.4 * s * k);
    const p = new Path2D(); p.moveTo(-10, 0); p.lineTo(10, 0); p.lineTo(4, -16); p.lineTo(7, -26); p.lineTo(-7, -26); p.lineTo(-4, -16); p.closePath();
    g.fillStyle = C.straw; g.fill(p); g.strokeStyle = C.ink; g.lineWidth = 0.9; g.stroke(p);
    for (let i = -3; i <= 3; i++) { g.beginPath(); g.moveTo(i * 1.5, -24); g.quadraticCurveTo(i * 3, -32, i * 5, -36); g.stroke(); }
    g.fillStyle = C.brown; g.fillRect(-5, -17, 10, 3); g.restore(); };
  // the eagle, perched facing the row: barred brown wings, pale streaked breast, hooked beak, yellow talons
  const eagle = (g, x, y, dip) => {
    const tail = new Path2D(); tail.moveTo(x - 20, y - 20); tail.lineTo(x - 64, y + 24); tail.lineTo(x - 44, y + 30); tail.lineTo(x - 6, y - 8); tail.closePath(); wash(g, tail, '#6E5238', 0.95); line(g, tail, 1.2);
    g.strokeStyle = 'rgba(46,38,32,0.7)'; g.lineWidth = 1; for (let i = 1; i < 4; i++) { g.beginPath(); g.moveTo(x - 20 - i * 11, y - 18 + i * 11); g.lineTo(x - 6 - i * 9, y - 6 + i * 9); g.stroke(); }
    const body = new Path2D(); body.moveTo(x - 24, y - 12); body.quadraticCurveTo(x - 36, y - 66, x + 2, y - 94); body.quadraticCurveTo(x + 34, y - 86, x + 32, y - 46); body.quadraticCurveTo(x + 24, y - 6, x - 24, y - 12);
    wash(g, body, '#E6D8BC', 1); line(g, body, 1.4);
    g.strokeStyle = 'rgba(110,80,50,0.85)'; g.lineWidth = 1.2; for (let i = 0; i < 9; i++) { const cx = x + 4 + (i % 3) * 8, cy = y - 70 + Math.floor(i / 3) * 16; g.beginPath(); g.moveTo(cx - 4, cy - 3); g.lineTo(cx, cy + 2); g.lineTo(cx + 4, cy - 3); g.stroke(); }
    const wing = new Path2D(); wing.moveTo(x + 8, y - 84); wing.quadraticCurveTo(x - 32, y - 82, x - 60, y + 12); wing.quadraticCurveTo(x - 22, y - 4, x + 10, y - 42); wing.closePath(); wash(g, wing, '#7A5A3C', 1); line(g, wing, 1.4);
    g.save(); g.clip(wing); g.strokeStyle = 'rgba(46,38,32,0.75)'; g.lineWidth = 1.1; for (let i = 0; i < 9; i++) { const k = i / 8; g.beginPath(); g.moveTo(x + 10 - k * 64, y - 84 + k * 70); g.lineTo(x + 30 - k * 54, y - 50 + k * 66); g.stroke(); } g.restore();
    g.save(); g.translate(x + 10, y - 88); g.rotate(dip * 0.95);
    const head = new Path2D(); head.arc(10, -8, 17, 0, 6.2832); wash(g, head, '#8A6A48', 1); line(g, head, 1.3);
    const bk = new Path2D(); bk.moveTo(22, -18); bk.quadraticCurveTo(44, -20, 44, 0); bk.lineTo(37, -5); bk.quadraticCurveTo(32, -6, 25, -4); bk.closePath(); wash(g, bk, '#E2B448', 1); line(g, bk, 1.2);
    g.fillStyle = '#E8C060'; g.beginPath(); g.arc(17, -12, 4.6, 0, 6.2832); g.fill(); g.fillStyle = C.ink; g.beginPath(); g.arc(18, -12, 2.4, 0, 6.2832); g.fill();
    g.strokeStyle = C.ink; g.lineWidth = 2.6; g.beginPath(); g.moveTo(8, -19); g.lineTo(24, -17); g.stroke(); g.restore();
    g.strokeStyle = '#C89A30'; g.lineWidth = 4; g.lineCap = 'round'; for (const dx of [-4, 10]) { g.beginPath(); g.moveTo(x + dx, y - 16); g.lineTo(x + dx + 1, y - 2); g.stroke(); }
    g.strokeStyle = C.ink; g.lineWidth = 1.6; for (const dx of [-4, 10]) for (const a of [-0.6, 0.3, 1.1]) { g.beginPath(); g.arc(x + dx + 1 + Math.cos(a) * 6, y - 1, 5, Math.PI + a, Math.PI * 1.8 + a); g.stroke(); }
  };
  // a small dead bird laid on its side, feet up
  const bird = (g, x, y) => {
    const tl = new Path2D(); tl.moveTo(x - 13, y - 11); tl.lineTo(x - 30, y - 15); tl.lineTo(x - 28, y - 4); tl.closePath(); wash(g, tl, '#7E6A52', 1); line(g, tl, 0.9);
    const b = new Path2D(); b.ellipse(x, y - 9, 17, 9, 0, 0, 6.2832); wash(g, b, '#BCA88A', 1); line(g, b, 1);
    const w = new Path2D(); w.ellipse(x - 1, y - 11, 11, 5, -0.15, 0, 6.2832); wash(g, w, '#8E7458', 1); line(g, w, 0.8);
    const h = new Path2D(); h.arc(x + 19, y - 9, 7.5, 0, 6.2832); wash(g, h, '#A08A6C', 1); line(g, h, 1);
    const bk = new Path2D(); bk.moveTo(x + 25, y - 12); bk.lineTo(x + 34, y - 9); bk.lineTo(x + 25, y - 6); bk.closePath(); g.fillStyle = C.ink; g.fill(bk);
    g.strokeStyle = C.ink; g.lineWidth = 1.2; g.beginPath(); g.moveTo(x + 17, y - 11); g.lineTo(x + 22, y - 10); for (const dx of [-3, 4]) { g.moveTo(x + dx, y - 17); g.lineTo(x + dx - 2, y - 27); g.lineTo(x + dx - 6, y - 30); g.moveTo(x + dx - 2, y - 27); g.lineTo(x + dx + 2, y - 31); } g.stroke();
  };
  const grainDot = (g, x, y, a, s = 1) => { g.save(); g.translate(x, y); g.rotate(a); g.scale(s, s); g.fillStyle = C.strawD; g.beginPath(); g.ellipse(0, 0, 4.2, 2, 0, 0, 6.2832); g.fill(); g.strokeStyle = 'rgba(46,38,32,0.8)'; g.lineWidth = 0.8; g.stroke(); g.restore(); };

  // the last standing patch of millet, cut back by the woman as she works along it (story: she cuts 1.2–5.0 s, x 420→560)
  const cutX = t => t < 1.2 ? 440 : t < 5.0 ? JQ.lerp(454, 594, (t - 1.2) / 3.8) : 600, PATCH1 = 600;
  const DROPS = [0.35, 0.85, 1.35, 1.85], EX = 1490, EY = H.wallTop - 12, SLOT = i => 1545 + i * 36;
  // the ox's angle on the threshing circle (storydata: a0 = π, 1.5 turns, 1.6–7.4 s); the floor behind it shows threshed grain
  const oxA = t => Math.PI + JQ.clamp((t - 1.6) / 5.8) * 3 * Math.PI;
  let RP = null; const rollerAt = () => RP || (RP = (() => { const r = JQ.cast(14, IMP).items.find(i => i.kind === 'roller'), m = r && r.parts.find(p => p.role === 'metal');
    return m ? m.pts.reduce((a, q) => [a[0] + q[0] / m.pts.length, a[1] + q[1] / m.pts.length], [0, 0]) : [574, 962]; })());
  const wipe = t => JQ.lerp(-260, 2160, JQ.clamp((t - BAR - 0.05) / 1.9));
  const FALLEN = Array.from({ length: 12 }, (_, j) => ({ x: 250 + JQ.hash(j, 1, 147) * 500, y: 220 + JQ.hash(j, 2, 147) * 250, t0: 3.2 + j * 0.16, gy: 700 + JQ.hash(j, 3, 147) * 110, c: FALL[j % FALL.length] }));
  JQ.ART[14] = {
    key: IMP, keyHou: JQ.TERMS[13].keyHou, focus: [[1560, 540], [500, 320], [574, 962]], frame: true,
    draw(g, t, Sx) {
      JQ.blit(g, JQ.cached('s14bg', Sx, buildBg));
      const grain = JQ.cached('s14grain', Sx, buildGrain), cx = cutX(t);
      if (cx < PATCH1) { g.save(); g.beginPath(); g.rect(cx, 0, PATCH1 - cx, 1080); g.clip(); JQ.blit(g, grain); g.restore(); }
      for (const k of [0.6, 0.8]) for (let x = 120; x < 1160; x += 92) if (x < 390 || x > 650) sheaf(g, x + (k * 37) % 30, fy(k, x), 1, 0.8 + k * 0.3);   // the rest is already in
      const CS = JQ.castFor(Sx, t), far = CS.items.filter(it => it.y < 830), near = CS.items.filter(it => it.y >= 830);
      carved(g, far);                                                   // the woman in the field, behind the old tree
      JQ.blit(g, JQ.cached('s14front', Sx, buildFront));
      // 候二: the autumn plate is printed behind a carved wind of cloud-scroll curls
      const wx = wipe(t);
      if (wx > -200) { g.save(); const cl = new Path2D(); cl.moveTo(-10, -10); for (let y = -10; y <= 1090; y += 40) cl.lineTo(wx + 46 * Math.sin(y * 0.013 + 1) + 26 * Math.sin(y * 0.031), y); cl.lineTo(-10, 1090); cl.closePath(); g.clip(cl); JQ.blit(g, JQ.cached('s14fall', Sx, buildFall)); g.restore(); }
      const ca = JQ.smooth(BAR, BAR + 0.2, t) * (1 - JQ.smooth(4.45, 4.75, t));
      if (ca > 0.01) { g.save(); g.beginPath(); g.rect(IN, IN, 1920 - 2 * IN, 1080 - 2 * IN); g.rect(BX, BY, BW, BH); g.clip('evenodd'); g.globalAlpha = ca; g.strokeStyle = C.ink; g.lineWidth = 1.6; g.lineCap = 'round';
        [[150, 0], [240, 50], [330, -20], [420, 30], [520, -40]].forEach(([y, dx], i) => { const x = wx + dx + 46 * Math.sin(y * 0.013 + 1) - 30; g.beginPath();
          for (let k = 0; k <= 40; k++) { const a = k / 40 * 10.5, r = 3 + k * 0.55; k ? g.lineTo(x + Math.cos(a + i) * r, y + Math.sin(a + i) * r) : g.moveTo(x + Math.cos(a + i) * r, y + Math.sin(a + i) * r); }
          g.moveTo(x + Math.cos(10.5 + i) * 25, y + Math.sin(10.5 + i) * 25); g.quadraticCurveTo(x - 90, y - 26, x - 190, y + 6); g.stroke(); });
        g.restore(); }
      FALLEN.forEach(f => { const p = JQ.clamp((t - f.t0) / 1.6); if (p <= 0) return; const x = f.x + p * 140 + Math.sin(p * 9 + f.t0) * 24, y = JQ.lerp(f.y, f.gy, p * p);
        g.save(); g.translate(x, y); g.rotate(p * 7 * (1 - p * 0.6)); const lf = new Path2D(); lf.moveTo(-9, 0); lf.quadraticCurveTo(0, -6, 9, 0); lf.quadraticCurveTo(0, 6, -9, 0); g.fillStyle = f.c; g.fill(lf); g.strokeStyle = C.ink; g.lineWidth = 0.9; g.stroke(lf); g.restore(); });
      // 候三 禾乃登: the stone roller threshes the floor; behind the ox the ears are crushed to grain, and at the impact the
      // roller bursts the thickest layer — grain sprays up and the whole floor turns to threshed gold
      const a1 = oxA(t); if (a1 > Math.PI + 0.05) { g.save(); g.beginPath(); g.ellipse(FLOOR.cx, FLOOR.cy, FLOOR.rx, FLOOR.ry, 0, 0, 6.2832); g.clip();
        g.strokeStyle = 'rgba(236,212,138,0.92)'; g.lineWidth = 34; g.lineCap = 'butt'; g.beginPath(); g.ellipse(FLOOR.cx, FLOOR.cy, 170, 20, 0, Math.PI, Math.min(a1, 3 * Math.PI)); g.stroke();
        g.strokeStyle = 'rgba(46,38,32,0.55)'; g.lineWidth = 1; for (const r of [-15, 15]) { g.beginPath(); g.ellipse(FLOOR.cx, FLOOR.cy, 170 + r, 20 + r * 0.5, 0, Math.PI, Math.min(a1, 3 * Math.PI)); g.stroke(); }
        const fk = JQ.smooth(IMP - 0.04, IMP + 0.2, t); if (fk > 0) { g.globalAlpha = 0.8 * fk; g.fillStyle = '#EFD27A'; g.fillRect(FLOOR.cx - FLOOR.rx, FLOOR.cy - FLOOR.ry, 2 * FLOOR.rx, 2 * FLOOR.ry);
          g.globalAlpha = fk; for (let i = 0; i < 160; i++) grainDot(g, FLOOR.cx + (JQ.hash(i, 1, 149) - 0.5) * 2 * FLOOR.rx, FLOOR.cy + (JQ.hash(i, 2, 149) - 0.5) * 2 * FLOOR.ry, JQ.hash(i, 3, 149) * 3); }
        g.restore(); }
      carved(g, near);
      const [rx, ry] = rollerAt(), u = t - IMP + 0.05;
      if (u > 0 && u < 0.9) { for (let j = 0; j < 70; j++) { const a = -Math.PI / 2 + (JQ.hash(j, 70, 148) - 0.5) * 2.6, sp = (130 + JQ.hash(j, 2, 148) * 260) * 1.6, uu = Math.min(u, 0.75);
          g.globalAlpha = 1 - JQ.smooth(0.6, 0.9, u); grainDot(g, rx + Math.cos(a) * sp * uu, Math.min(ry + Math.sin(a) * sp * uu + 620 * uu * uu, 1040), a + u * 9, 1.6); } g.globalAlpha = 1;
        if (u < 0.45) { g.strokeStyle = `rgba(46,38,32,${0.8 * (1 - u / 0.45)})`; g.lineWidth = 1.8; g.lineCap = 'round';
          for (let j = 0; j < 18; j++) { const a = Math.PI + j / 17 * Math.PI, r0 = 50 + u * 340, r1 = r0 + 50; g.beginPath(); g.moveTo(rx + Math.cos(a) * r0, ry + Math.sin(a) * r0 * 0.7); g.lineTo(rx + Math.cos(a) * r1, ry + Math.sin(a) * r1 * 0.7); g.stroke(); } } }
      // 候一: the eagle lays its catch along the wall top, one by one
      const n = 1 + DROPS.filter(d => t >= d).length, cur = DROPS.find(d => t > d - 0.3 && t < d + 0.3), dip = cur ? Math.sin(JQ.clamp((t - cur + 0.3) / 0.6) * Math.PI) : 0;
      for (let i = 0; i < n; i++) { const d = DROPS[i - 1], k = i && t < d + 0.25 ? JQ.ease((t - d + 0.05) / 0.3) : 1; bird(g, JQ.lerp(EX + 50, SLOT(i), k), EY - (k < 1 ? Math.sin(k * Math.PI) * 24 : 0)); }
      eagle(g, EX, EY, dip);
      carve(g, t);
    },
  };
})();
