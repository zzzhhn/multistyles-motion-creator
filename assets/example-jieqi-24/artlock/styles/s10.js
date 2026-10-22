// s10 夏至 · 青绿山水 — 绢本，赭石打底，石绿、石青层层罩染（山脚到山顶由赭到青绿），细密的皴线，山脊点树；屋桥用细墨线勾。
// 记忆点（鹿角解）：工笔梅花鹿走到田边抬头，「咔」一声鹿角断落；满树蝉鸣：树上几只工笔小蝉，金线画出声音。
(function () {
  const JQ = window.JQ, S = JQ.SCENE, L = JQ.L, TAU = Math.PI * 2;
  const C = { silk: '#D9C59A', silkDk: '#B9A274', ink: '#2E271E', qing: '#2D6F8E', lu: '#3E9A78', luHi: '#7DC09A', zhe: '#B9824A',
    zheLt: '#D2A86E', water: '#9DBDB4', gold: '#D6A537', goldHi: '#F3D27A', white: '#F4EEDC', seal: '#B8322A', leafDk: '#2D6A4E' };

  const line = (g, w, a = 0.85, col = C.ink) => { g.strokeStyle = JQ.rgba(col, a); g.lineWidth = w; g.lineCap = 'round'; g.lineJoin = 'round'; };
  const outline = (g, path, fill, w = 1.6) => { if (fill) { g.fillStyle = fill; g.fill(path); } line(g, w); g.stroke(path); };
  // a ridge line shifted down and re-noised: the stacked peaks of a 青绿 range
  const ridgeAt = (i) => S.ridge.pts.map(([x, y]) => [x, y + i * 46 + (JQ.fbm(x * 0.009 + i * 3.1, i, 40, 3) - 0.5) * (70 - i * 16)]);
  const layerPath = (pts, base) => { const p = new Path2D(); pts.forEach(([x, y], i) => i ? p.lineTo(x, y) : p.moveTo(x, y)); p.lineTo(1920, base); p.lineTo(0, base); p.closePath(); return p; };
  const mineral = (g, top, base) => {                         // ochre at the foot, malachite, azurite at the crest
    const gr = g.createLinearGradient(0, top, 0, base);
    gr.addColorStop(0, C.qing); gr.addColorStop(0.32, C.lu); gr.addColorStop(0.7, '#8FA466'); gr.addColorStop(1, C.zhe); return gr;
  };
  const shun = (g, pts, seed, len, a) => {                    // 披麻皴: short hemp-fibre strokes running down the slopes
    const r = JQ.rng(seed); line(g, 1.1, a, '#1F3A30');
    for (let i = 1; i < pts.length; i++) { const [x, y] = pts[i], [px, py] = pts[i - 1], sl = (y - py) / ((x - px) || 1);
      for (let k = 0; k < 3; k++) { const ox = x + (r() - 0.5) * 12, oy = y + 8 + r() * len * 0.8;
        g.beginPath(); g.moveTo(ox, oy); g.quadraticCurveTo(ox - sl * 6 + 2, oy + len * 0.5, ox - sl * 10, oy + len); g.stroke(); } }
  };
  const treeDots = (g, pts, seed, step) => {                  // tiny trees and moss dots along a ridge
    const r = JQ.rng(seed);
    for (let i = 0; i < pts.length; i += step) { const [x, y] = pts[i]; if (r() < 0.35) continue;
      line(g, 1, 0.8); g.beginPath(); g.moveTo(x, y + 2); g.lineTo(x, y - 12); g.stroke();
      for (let k = 0; k < 4; k++) { g.fillStyle = k % 2 ? C.leafDk : C.lu; g.beginPath(); g.arc(x + (r() - 0.5) * 9, y - 9 - k * 3, 3.2, 0, TAU); g.fill(); } }
  };
  const netWater = (g, path, x0, x1, y0, y1, a) => {           // 网巾水: rows of fine overlapping arcs
    g.save(); g.clip(path); line(g, 1.1, a, '#2E4A48');
    for (let y = y0, r = 0; y < y1; y += 11, r++) for (let x = x0 + (r % 2) * 13; x < x1; x += 26) { g.beginPath(); g.arc(x, y, 14, Math.PI * 1.15, Math.PI * 1.85); g.stroke(); }
    g.restore();
  };

  // ------------------------------------------------------------------ the silk and the landscape
  const bg = (g) => {
    g.fillStyle = C.silk; g.fillRect(0, 0, 1920, 1080);
    const vg = g.createRadialGradient(960, 480, 300, 960, 540, 1150); vg.addColorStop(0, 'rgba(255,245,220,0.25)'); vg.addColorStop(1, 'rgba(120,90,50,0.3)');
    g.fillStyle = vg; g.fillRect(0, 0, 1920, 1080);
    g.lineWidth = 0.6; g.strokeStyle = 'rgba(110,88,52,0.10)';                // the weave
    for (let y = 0; y < 1080; y += 3) { g.beginPath(); g.moveTo(0, y); g.lineTo(1920, y); g.stroke(); }
    for (let x = 0; x < 1920; x += 4) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, 1080); g.stroke(); }
    const hi = S.ridge.pts.map(([x, y]) => [x, y - 40 - Math.pow(JQ.fbm(x * 0.006, 9, 41, 3), 1.6) * 210]);
    g.fillStyle = mineral(g, Math.min(...hi.map(q => q[1])), 400); g.globalAlpha = 0.85; g.fill(layerPath(hi, 440)); g.globalAlpha = 1;
    line(g, 1.4, 0.7); g.stroke(JQ.open(hi)); shun(g, hi, 49, 40, 0.4); treeDots(g, hi, 69, 4);
    // the range: four stacked layers inside the mountain band, each washed ochre → malachite → azurite, outlined and textured
    g.save(); g.clip(S.mountains.path);
    for (let i = 0; i < 4; i++) {
      const pts = i ? ridgeAt(i) : S.ridge.pts, top = Math.min(...pts.map(q => q[1])), base = top + 170;
      g.fillStyle = mineral(g, top, base); g.fill(layerPath(pts, 440));
      line(g, 1.5, 0.8); g.stroke(JQ.open(pts)); shun(g, pts, 50 + i, 26 - i * 3, 0.45); treeDots(g, pts, 70 + i, 3);
    }
    g.restore();
    line(g, 1.6, 0.85); g.stroke(S.ridge.path);
    g.fillStyle = mineral(g, 366, 440); g.fill(S.hills.path); line(g, 1.4, 0.8); g.stroke(JQ.open(S.hills.pts.slice(0, -2)));
    treeDots(g, S.hills.pts, 91, 2);
    // the ground: an ochre wash; the field: pale malachite with fine furrow lines and dotted seedlings
    g.fillStyle = 'rgba(196,150,92,0.55)'; g.fill(S.ground.path);
    g.save(); g.clip(S.ground.path); line(g, 1, 0.35, '#5A4020'); const rg = JQ.rng(12);
    for (let i = 0; i < 260; i++) { const x = rg() * 1920, y = 600 + rg() * 480; g.beginPath(); g.moveTo(x, y); g.lineTo(x - 3, y - 9); g.moveTo(x + 4, y); g.lineTo(x + 6, y - 8); g.stroke(); }
    g.restore();
    g.fillStyle = 'rgba(190,172,112,0.72)'; g.fill(S.field.path);   // 夏至: the wheat is cut; stubble and new millet line(g, 1.4, 0.7); g.stroke(S.field.path);
    g.save(); g.clip(S.field.path); line(g, 1, 0.45, '#1F3A30'); S.furrows.forEach(f => g.stroke(f.path));
    const rs = JQ.rng(1010); line(g, 1, 0.55, '#7A5A2A');                     // 麦茬: short ochre stubble ticks over the whole field
    for (let i = 0; i < 1500; i++) { const x = rs() * 1920, y = 436 + rs() * 270; g.beginPath(); g.moveTo(x, y); g.lineTo(x + (rs() - 0.5) * 3, y - 4 - rs() * 5); g.stroke(); }
    for (let i = 0; i < 9; i++) for (let x = 10 + (i % 2) * 12; x < 1920; x += 24) { const y = JQ.lerp(L.HORIZON, 640, (i + 0.5) / 10) + (x > 1180 ? -(x - 1180) * 0.065 * (i + 0.5) / 10 : 0) + 4, h = 4 + i * 0.7;   // new millet seedlings, two 石绿 leaves each
      g.fillStyle = C.lu; [-1, 1].forEach(d => { g.beginPath(); g.ellipse(x + d * h * 0.45, y - h * 0.5, h * 0.55, h * 0.18, d * 0.7, 0, TAU); g.fill(); }); line(g, 0.8, 0.6, '#1F3A30'); g.beginPath(); g.moveTo(x, y); g.lineTo(x, y - h * 0.8); g.stroke(); }
    g.restore();
    g.fillStyle = 'rgba(232,214,170,0.8)'; g.fill(S.path.path); line(g, 1.2, 0.6); g.stroke(S.path.path);
    // water: pale azurite with a fine net of waves; the pond bank in ochre with ink edge
    g.fillStyle = 'rgba(160,120,70,0.5)'; g.fill(S.pondRim.path);
    g.fillStyle = C.water; g.fill(S.pond.path); line(g, 1.6, 0.8); g.stroke(S.pond.path); netWater(g, S.pond.path, 670, 1320, 790, 990, 0.32);
    g.fillStyle = C.water; g.fill(S.stream.path); line(g, 1.3, 0.75); g.stroke(S.stream.path); netWater(g, S.stream.path, 1180, 1430, 430, 860, 0.3);
    outline(g, S.bridge.path, '#E6DCC4'); g.save(); g.clip(S.bridge.path); line(g, 1, 0.5);
    for (let x = 1200; x < 1390; x += 22) { g.beginPath(); g.moveTo(x, 650); g.lineTo(x, 718); g.stroke(); } g.beginPath(); g.moveTo(1170, 664); g.lineTo(1410, 664); g.stroke(); g.restore();
    line(g, 1.8); g.stroke(S.bridgeArch.path);
    // the farmhouse, ruled fine-line: grey-blue tiles, ochre walls, every tile row drawn
    outline(g, S.roof.path, '#7E8E98'); g.save(); g.clip(S.roof.path); line(g, 0.9, 0.55); S.roofLines.forEach(r => g.stroke(r.path));
    for (let y = 482; y < 545; y += 9) { g.beginPath(); g.moveTo(1460, y); g.lineTo(1910, y); g.stroke(); } g.restore();
    outline(g, S.chimney.path, '#9A8E80'); outline(g, S.houseFront.path, '#E4D2A8'); outline(g, S.window.path, '#6A4A30');
    outline(g, S.wall.path, '#E2CFA4'); g.save(); g.clip(S.wall.path); line(g, 0.8, 0.35);
    for (let y = 616; y < 812; y += 14) { g.beginPath(); g.moveTo(1440, y); g.lineTo(1920, y); g.stroke(); } g.restore();
    outline(g, S.wallCap.path, '#6E7E8A'); outline(g, S.gate.path, '#6A4632'); outline(g, S.gateRoof.path, '#6E7E8A');
    // the 槐树: ochre trunk with ink contour and bark strokes, ink branches, then 点叶 in three layers of green
    outline(g, S.trunk.path, '#9A6A3E', 1.8); g.save(); g.clip(S.trunk.path); line(g, 1.1, 0.6);
    for (let y = 500; y < 830; y += 16) { g.beginPath(); g.moveTo(440 + (y % 32), y); g.quadraticCurveTo(470, y + 6, 500 + (y % 24), y + 2); g.stroke(); } g.restore();
    line(g, 1, 0.9); g.strokeStyle = '#3A2A1C'; JQ.drawBranches(g, 2, 0.7);
    g.fillStyle = 'rgba(62,154,120,0.35)'; g.fill(S.canopy.path);
    [[C.leafDk, 0.9, 5.2], [C.lu, 0.9, 4.4], [C.luHi, 0.85, 3.2]].forEach(([col, a, r], li) => { const rr = JQ.rng(300 + li); g.fillStyle = JQ.rgba(col, a);
      S.clumps.forEach(q => { for (let k = 0; k < 34; k++) { const an = rr() * TAU, d = Math.sqrt(rr()) * q.r * (0.95 - li * 0.15), x = q.x + Math.cos(an) * d, y = q.y + Math.sin(an) * d - li * 6;
        for (let m = 0; m < 3; m++) { const b = -Math.PI / 2 + (m - 1) * 0.7; g.beginPath(); g.ellipse(x + Math.cos(b) * r, y + Math.sin(b) * r, r * 0.9, r * 0.42, b, 0, TAU); g.fill(); } } }); });
  };
  // ------------------------------------------------------------------ the 绫 mount and the inscription (static, drawn last)
  const frame = (g) => {
    g.fillStyle = '#C7CBBE'; g.fillRect(0, 0, 1920, 34); g.fillRect(0, 1046, 1920, 34); g.fillRect(0, 0, 34, 1080); g.fillRect(1886, 0, 34, 1080);
    line(g, 1.2, 0.6, '#6A6A5A'); g.strokeRect(34, 34, 1852, 1012); g.strokeRect(28, 28, 1864, 1024);
    g.fillStyle = C.ink; g.textAlign = 'center'; g.textBaseline = 'alphabetic';
    g.font = '500 74px "Kaiti SC","STKaiti","KaiTi",serif'; JQ.vtext(g, '夏至', 1810, 128, 84);
    g.fillStyle = C.seal; g.fillRect(1712, 278, 50, 50); g.fillStyle = C.silk; g.font = '500 30px "Kaiti SC","STKaiti",serif'; g.fillText('夏', 1737, 314);
  };

  // ------------------------------------------------------------------ the deer, gongbi: fine ink contour, ochre with white plum spots, jointed legs
  const DEER = { y: 694, s: 1.3, dir: -1 }, PIV = [46, -104];   // faces left: it comes in from the stream side, clear of the woman
  const antlerPts = () => [[[0, 0], [-6, -26], [-16, -52], [-30, -70]], [[-5, -22], [10, -40], [14, -56]], [[-14, -46], [-2, -60], [2, -74]]];
  const antler = (g, x, y, s, rot, m = 1) => {                       // one antler: three tines, ink line under a bone-coloured line
    g.save(); g.translate(x, y); g.rotate(rot); g.scale(s * m, s);
    antlerPts().forEach((pts, i) => { const p = new Path2D(); pts.forEach(([u, v], k) => k ? p.lineTo(u, v) : p.moveTo(u, v));
      g.lineCap = 'round'; g.lineJoin = 'round'; g.strokeStyle = C.ink; g.lineWidth = i ? 5.4 : 7; g.stroke(p); g.strokeStyle = '#E6D3A8'; g.lineWidth = i ? 3 : 4.4; g.stroke(p); });
    g.restore();
  };
  const BODY = JQ.smoothPath([[-72, -94], [-62, -112], [-24, -117], [20, -118], [44, -112], [62, -96], [64, -78], [52, -66], [20, -61], [-20, -62], [-50, -66], [-68, -76]]);
  const BELLY = JQ.smoothPath([[-46, -70], [-10, -74], [30, -72], [52, -70], [40, -62], [0, -60], [-40, -64]]);
  const NECK = JQ.smoothPath([[30, -112], [48, -136], [62, -160], [76, -176], [92, -170], [88, -146], [76, -118], [66, -92], [50, -96]]);
  const HEAD = JQ.smoothPath([[74, -178], [86, -186], [104, -180], [122, -166], [128, -158], [120, -154], [100, -158], [84, -164]]);
  const EAR = JQ.smoothPath([[80, -180], [70, -196], [62, -206], [72, -196], [86, -184]]);
  // a leg: hip → stifle/elbow → hock/knee → fetlock → hoof; tapering, with small joint knobs, swinging by phase
  const leg = (g, hip, front, ph, col) => {
    const sw = Math.sin(ph) * 0.22, lift = Math.max(0, Math.cos(ph)) * 6, k = front ? 1 : -1;
    const j1 = [hip[0] + 4 * k + sw * 20, hip[1] + 22], j2 = [j1[0] - 10 * k * (front ? -0.2 : 1) + sw * 28, hip[1] + 46 - lift], j3 = [j2[0] + 2 * k + sw * 18, -8 - lift * 0.6], j4 = [j3[0] + 4, -lift * 0.4];
    const seg = (a, b, w) => { g.strokeStyle = C.ink; g.lineWidth = w + 2.4; g.beginPath(); g.moveTo(...a); g.lineTo(...b); g.stroke(); g.strokeStyle = col; g.lineWidth = w; g.stroke(); };
    g.lineCap = 'round'; seg(hip, j1, 13); seg(j1, j2, 7); seg(j2, j3, 4.6); seg(j3, j4, 4);
    g.fillStyle = col; line(g, 1.1); [j2, j3].forEach(([x, y]) => { g.beginPath(); g.arc(x, y, 3.4, 0, TAU); g.fill(); g.stroke(); });
    g.fillStyle = '#2A2018'; g.beginPath(); g.moveTo(j4[0] - 4, j4[1] - 4); g.lineTo(j4[0] + 7, j4[1] - 3); g.lineTo(j4[0] + 8, j4[1] + 1); g.lineTo(j4[0] - 4, j4[1] + 1); g.closePath(); g.fill();
  };
  const deer = (g, x, rot, horns, walk) => {
    const s = DEER.s; g.save(); g.translate(x, DEER.y); g.scale(s * DEER.dir, s); g.lineJoin = 'round';
    const far = '#9A5E30', near = '#B9733C';
    leg(g, [-48, -74], false, walk + Math.PI, far); leg(g, [42, -72], true, walk, far);
    g.fillStyle = '#BF7A40'; g.fill(BODY); g.fillStyle = '#F0E2C4'; g.fill(BELLY);
    g.save(); g.clip(BODY); const rs = JQ.rng(5); g.fillStyle = '#F6EEDA';
    for (let i = 0; i < 30; i++) { const u = rs(), px = -60 + u * 110, py = -110 + rs() * 30 + Math.abs(u - 0.45) * 8; g.beginPath(); g.ellipse(px, py, 3.6, 2.6, 0.2, 0, TAU); g.fill(); }
    line(g, 0.7, 0.4); for (let i = 0; i < 26; i++) { const px = -58 + i * 4.4; g.beginPath(); g.moveTo(px, -114 + Math.abs(px) * 0.03); g.lineTo(px - 3, -104); g.stroke(); }   // 丝毛 along the back
    g.restore(); line(g, 1.25); g.stroke(BODY);
    g.fillStyle = '#F6EEDA'; g.beginPath(); g.ellipse(-72, -100, 6, 10, 0.5, 0, TAU); g.fill(); g.stroke();
    leg(g, [-56, -76], false, walk, near); leg(g, [50, -74], true, walk + Math.PI, near);
    g.translate(PIV[0], PIV[1]); g.rotate(rot); g.translate(-PIV[0], -PIV[1]);
    g.fillStyle = '#BF7A40'; g.fill(NECK); g.fillStyle = '#EAD7B0'; g.beginPath(); g.moveTo(88, -150); g.quadraticCurveTo(80, -122, 66, -96); g.lineTo(72, -98); g.quadraticCurveTo(84, -124, 90, -148); g.closePath(); g.fill();
    line(g, 1.25); g.stroke(NECK); line(g, 0.7, 0.45); for (let i = 0; i < 6; i++) { g.beginPath(); g.moveTo(84 - i * 3, -150 + i * 9); g.lineTo(79 - i * 3, -146 + i * 9); g.stroke(); }
    g.fillStyle = '#C9844A'; g.fill(EAR); line(g, 1.1); g.stroke(EAR);
    g.fillStyle = '#C9844A'; g.fill(HEAD); g.stroke(HEAD); g.fillStyle = '#F2E6CC'; g.beginPath(); g.ellipse(114, -158, 9, 4, 0.5, 0, TAU); g.fill();
    g.fillStyle = C.ink; g.beginPath(); g.ellipse(94, -172, 3.4, 2.6, 0.3, 0, TAU); g.fill(); g.beginPath(); g.arc(126, -159, 2.6, 0, TAU); g.fill();
    if (horns > 0) { g.globalAlpha = horns; antler(g, 84, -182, 1, -0.1); antler(g, 90, -180, 0.92, 0.25); g.globalAlpha = 1; }
    g.restore();
  };
  const sockets = (x, rot) => { const c = Math.cos(rot), sn = Math.sin(rot), f = ([u, v]) => { const dx = u - PIV[0], dy = v - PIV[1];
    return [x + (PIV[0] + dx * c - dy * sn) * DEER.s * DEER.dir, DEER.y + (PIV[1] + dx * sn + dy * c) * DEER.s]; }; return [f([84, -182]), f([90, -180])]; };

  // ------------------------------------------------------------------ cicadas and their gold sound (蜩始鸣: each starts on its own half beat in bar 2)
  const CICADAS = [[506, 600, -1.6], [452, 712, -1.5], [300, 300, -0.4], [668, 262, 0.5], [560, 470, 0.2]];
  const cicada = (g, x, y, a) => {
    g.save(); g.translate(x, y); g.rotate(a); g.scale(2, 2);
    g.fillStyle = 'rgba(232,240,236,0.6)'; line(g, 0.7, 0.9);
    [-1, 1].forEach(d => { g.beginPath(); g.moveTo(4, d * 3); g.quadraticCurveTo(-14, d * 14, -30, d * 6); g.quadraticCurveTo(-20, d * 2, 4, d * 3); g.fill(); g.stroke();
      g.beginPath(); g.moveTo(0, d * 4); g.lineTo(-22, d * 8); g.stroke(); g.beginPath(); g.moveTo(-6, d * 6); g.lineTo(-26, d * 5); g.stroke(); });
    g.fillStyle = '#3A3226'; g.beginPath(); g.ellipse(-4, 0, 12, 6, 0, 0, TAU); g.fill();
    line(g, 0.5, 0.6, '#C9B48A'); for (let i = 0; i < 4; i++) { g.beginPath(); g.moveTo(-12 + i * 4, -5); g.lineTo(-12 + i * 4, 5); g.stroke(); }
    g.fillStyle = '#5A4A32'; g.beginPath(); g.ellipse(9, 0, 6, 7, 0, 0, TAU); g.fill(); line(g, 0.7, 0.9); g.stroke();
    g.fillStyle = '#8A3A2A'; [-1, 1].forEach(d => { g.beginPath(); g.arc(12, d * 5, 2, 0, TAU); g.fill(); });
    g.restore();
  };
  const sound = (g, x, y, a, age, i) => {
    const on = JQ.clamp(age / 0.2);
    for (let k = 0; k < 3; k++) { const ph = (age * 0.9 + k / 3 + i * 0.21) % 1, r = 38 + ph * 96;
      g.strokeStyle = JQ.rgba(k % 2 ? C.goldHi : C.gold, (1 - ph * 0.7) * on); g.lineWidth = 5;
      g.beginPath(); g.arc(x, y, r, a + Math.PI - 0.6, a + Math.PI + 0.6); g.stroke(); g.beginPath(); g.arc(x, y, r, a - 0.6, a + 0.6); g.stroke(); }
  };
  // ------------------------------------------------------------------ 半夏生: three Pinellia plants push up right of the pond, leaflets unfold, spathes follow
  const PIN = [[1330, 1006, 0], [1408, 984, 1], [1486, 1010, 2]];
  const lens = (g, x, y, a, L, w) => { const c = Math.cos(a), s = Math.sin(a), q = (u, v) => [x + u * c - v * s, y + u * s + v * c];
    g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(...q(L * 0.45, -w), ...q(L, 0)); g.quadraticCurveTo(...q(L * 0.45, w), x, y); g.closePath(); };
  const banxia = (g, t) => PIN.forEach(([x, y, k]) => {
    line(g, 1.2, 0.6, '#5A4020'); g.beginPath(); g.arc(x, y + 4, 14, Math.PI * 1.1, Math.PI * 1.9); g.stroke();
    const gr = JQ.ease(JQ.clamp((t - 5.4 - k * 0.3) / 0.8)); if (gr <= 0) return;
    const h = (118 + k * 14) * gr, tx = x + 8 * gr, ty = y - h, op = JQ.ease(JQ.clamp((t - 5.95 - k * 0.3) / 0.6));
    const stem = (x0, y0, x1, y1, bx) => { line(g, 3.6, 0.95); g.beginPath(); g.moveTo(x0, y0); g.quadraticCurveTo(bx, (y0 + y1) / 2, x1, y1); g.stroke(); g.strokeStyle = '#7DB07A'; g.lineWidth = 1.8; g.stroke(); };
    const sp = JQ.ease(JQ.clamp((t - 6.5 - k * 0.3) / 0.6));
    if (sp > 0) { const sx = x + 22, sy = y - h * 0.72 * sp; stem(x + 2, y, sx, sy, x + 20);
      lens(g, sx, sy + 4, -Math.PI / 2 - 0.25, 40 * sp, 11 * sp); g.fillStyle = '#5E9A6E'; g.fill(); line(g, 1.1); g.stroke();
      line(g, 1.4, 0.9); g.beginPath(); g.moveTo(sx + 4, sy - 22 * sp); g.quadraticCurveTo(sx + 14, sy - 46 * sp, sx + 6, sy - 64 * sp); g.stroke(); }
    stem(x, y, tx, ty, x - 8);
    if (op > 0) [[-Math.PI / 2, 74], [-Math.PI / 2 - 1.05, 62], [-Math.PI / 2 + 1.05, 62]].forEach(([a, L]) => {
      lens(g, tx, ty, a, L * op, L * 0.3 * op); g.fillStyle = C.lu; g.fill(); line(g, 1.2); g.stroke();
      line(g, 0.8, 0.7, '#1F3A30'); g.beginPath(); g.moveTo(tx, ty); g.lineTo(tx + Math.cos(a) * L * 0.9 * op, ty + Math.sin(a) * L * 0.9 * op); g.stroke(); });
  });

  // ------------------------------------------------------------------ the family in 工笔: flat 石青 石绿 赭石 fills, a fine even ink line, a light inner wash
  const PEN = { skin: '#F2D7B8', hair: C.ink, coat: C.qing, pants: '#5E7E5A', apron: '#E6DCC4', hat: '#D8C08A', straw: '#D8C08A', scarf: C.zhe, cape: C.zhe, eye: C.ink,
    ox: '#B9824A', oxDark: '#5A3A22', horn: '#EFE6CF', calf: '#CE9A5E', calfDark: '#6A4428', prop: '#8A6440', metal: '#7E8E98', red: C.seal, line: C.ink };
  const KIDC = { coat: C.lu, pants: C.qing };
  const gongbi = (g, it) => {
    const sc = JQ.STORY_S(it.y); g.save(); if (it.alpha != null && it.alpha < 1) g.globalAlpha *= it.alpha;
    it.parts.forEach(q => { const c = (it.who === 'kid' && KIDC[q.role]) || JQ.roleColor(PEN, q.role); if (!c) return; g.fillStyle = c; g.fill(q.path);
      if (q.role === 'eye' || q.role === 'hair') return; g.strokeStyle = JQ.rgba(C.ink, 0.9); g.lineWidth = 1.3 * sc; g.lineJoin = 'round'; g.stroke(q.path); });
    g.restore();
  };
  const HOU = JQ.TERMS[9].hou, IMPACT = 4 / 3, BAR = 8 / 3;
  const headRot = t => (t < 0.8 ? 0.35 : JQ.lerp(0.35, -0.08, JQ.smooth(0.8, 1.15, t))) + JQ.smooth(2.3, 3.2, t) * 1.45;   // then it bends to look at the shed antlers
  JQ.ART[10] = {
    key: IMPACT, keyHou: JQ.TERMS[9].keyHou,
    focus: [[1000, 520], [480, 400], [1400, 940]],
    frame: true,                                         // the 绫 mount must not be cropped
    draw(g, t, Sx) {
      t = JQ.clamp(t, 0, 9);
      JQ.blit(g, JQ.cached('s10bg', Sx, bg));
      CICADAS.forEach(([x, y, a], i) => { const st = BAR + i * 0.333; if (t >= st) sound(g, x, y, a + Math.PI / 2, t - st, i); cicada(g, x, y, a); });
      // 鹿角解: the deer walks up to the field edge, lifts its head, and on the impact both antlers snap off and tumble to the grass
      const x = JQ.lerp(1130, 1040, JQ.ease(JQ.clamp(t / 0.8))), walk = JQ.clamp(t / 0.8) * Math.PI * 4;
      const jerk = t > IMPACT - 0.25 && t < IMPACT + 0.15 ? Math.sin(t * 80) * 0.03 : 0, rot = headRot(t) + jerk;
      deer(g, x, rot, 1 - JQ.smooth(IMPACT - 0.02, IMPACT + 0.03, t), walk);
      const so = sockets(1040, headRot(IMPACT));
      if (t > IMPACT - 0.04 && t < IMPACT + 0.6) { const k = JQ.clamp((t - IMPACT + 0.04) / 0.64), [cx, cy] = so[0];     // the 咔: a burst of fine gold lines
        g.strokeStyle = JQ.rgba(C.gold, 1 - k); g.lineWidth = 3; for (let i = 0; i < 12; i++) { const an = i / 12 * TAU + 0.2, r0 = 14 + k * 24, r1 = 36 + k * 90;
          g.beginPath(); g.moveTo(cx + Math.cos(an) * r0, cy + Math.sin(an) * r0); g.lineTo(cx + Math.cos(an) * r1, cy + Math.sin(an) * r1); g.stroke(); } }
      if (t >= IMPACT) so.forEach(([sx, sy], i) => { const f = JQ.smooth(IMPACT, IMPACT + 0.6, t), ex = 1040 - 110 - i * 70, ey = DEER.y + 6;
        const ax = JQ.lerp(sx, ex, f), ay = JQ.lerp(sy, ey, f * f) - Math.sin(f * Math.PI) * 34;
        antler(g, ax, ay, DEER.s * (i ? 0.92 : 1), DEER.dir * JQ.lerp(-0.1 + i * 0.35 + headRot(IMPACT), 1.45 + i * 0.2, f), DEER.dir); });
      banxia(g, t);
      const hou = Math.min(2, Math.floor(t / BAR));
      JQ.castFor(Sx, t).items.forEach(it => gongbi(g, it));                // the family (story track), fine ink line over mineral colour
      JQ.blit(g, JQ.cached('s10frame', Sx, frame));
      g.fillStyle = C.ink; g.textAlign = 'center'; g.textBaseline = 'alphabetic'; g.font = '500 44px "Kaiti SC","STKaiti","KaiTi",serif';
      const u = t - hou * BAR; [...HOU[hou]].forEach((ch, k) => { const a = hou === 0 && t < 0.01 ? 1 : JQ.clamp((u - k * 0.13) / 0.18); if (a > 0) { g.globalAlpha = a; g.fillText(ch, 1736, 120 + k * 50); } });
      g.globalAlpha = 1;
    } };
})();
