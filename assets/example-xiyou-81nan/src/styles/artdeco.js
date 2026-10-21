// 51 Art Deco · 1925 年 · 取宝救僧（8 拍）— black, gold and jade; a stepped 金光寺 pagoda with a Chrysler crown on the far shore,
// 九头虫 spread like a Deco eagle with its nine necks fanned into a sunburst, the stolen 舍利 (a chrome sphere) in its claws. It
// lunges at the pilgrims (1.8–3.6), Wukong parries; 二郎神's 哮天犬 runs in along the shore and on beat 4 snaps off one head;
// the bird lets go, the 舍利 arcs home into the crown on 5 — the tower lights, gold rays, the chained monks' rings burst — and
// the wounded bird flees off the top (第六十三回).
(() => {
  'use strict';
  const XY = window.XY, TAU = XY.TAU, K = () => XY.KIT_F;
  const C = { night: '#0E1A18', jade: '#1F5C4E', djade: '#163F36', gold: '#C9A23A', lgold: '#E8C66A', cream: '#F4EEDC', blk: '#0E0C0A', silver: '#D8D2C0', crim: '#B3261E' };
  // the pagoda stands back on the far shore (scaled 0.78 about its base, base at y 606), behind the road
  const TX = 330, PS = 0.78, PB = 606, CL = [330, 118], CROWN = [330, PB + (118 - 702) * PS], BIRD = [930, 290], BITE = 4, HOME = 5;
  const TIERS = [[230, 62], [200, 56], [172, 52], [148, 48], [126, 44], [106, 40], [88, 36], [70, 32]];
  const poly = (g, pts) => { g.beginPath(); g.moveTo(pts[0][0], pts[0][1]); for (let k = 1; k < pts.length; k++) g.lineTo(pts[k][0], pts[k][1]); g.closePath(); };
  const PEN = { outline: C.gold, ow: 1.4, seed: 51, shade: 'rgba(0,0,0,0.28)',
    color: r => ({ fur: '#7A5230', face: '#F2E2C0', wkshirt: C.crim, tiger: '#D9A441', stripe: C.blk, gold: C.lgold, staff: C.crim, ink: C.blk, horse: C.cream, horse2: '#D8CDB0', mane: C.cream,
      hoof: C.blk, saddle: C.jade, red: C.crim, robe: C.lgold, kasaya: C.crim, skin: '#F2DCBC', metal: C.lgold, bjrobe: '#141414', bjpants: C.jade, pig: '#F0C0B0', pig2: '#D8A090', wood: '#5A3A20',
      ssrobe: C.jade, ssrobe2: C.djade, skin2: '#C8946A', ssh: C.crim, ssbeard: '#8A2A1A', skull: C.cream, bundle: '#D9A441' })[r] || C.gold };
  // tiers of the pagoda from the ground up; returns the y of each tier top
  const tierTops = () => { const o = []; let y = 702; TIERS.forEach(([w, h]) => { y -= h; o.push(y); }); return o; };
  const pagoda = (g, lit, st) => {
    const tops = tierTops();
    TIERS.forEach(([w, h], k) => { const y = tops[k], x = TX - w / 2;
      g.fillStyle = C.blk; g.fillRect(x, y, w, h); g.fillStyle = lit ? C.lgold : C.gold; g.fillRect(x - 6, y, w + 12, 5);
      g.strokeStyle = C.gold; g.lineWidth = 1.5; for (let p = 1; p < 6; p++) { const px = x + w * p / 6; g.beginPath(); g.moveTo(px, y + 8); g.lineTo(px, y + h); g.stroke(); }
      for (let p = 0; p < 3; p++) { const wx = TX + (p - 1) * w * 0.3, on = lit && XY.hash(k, p, st) > 0.25;   // arched windows
        g.fillStyle = on ? '#FFE9A8' : C.djade; g.beginPath(); g.moveTo(wx - 7, y + h - 6); g.lineTo(wx - 7, y + 18); g.arc(wx, y + 18, 7, Math.PI, 0); g.lineTo(wx + 7, y + h - 6); g.fill(); } });
    // the Chrysler crown: stacked sunburst arches with triangular windows, then the spire and the socket of the 舍利
    const y0 = tops[tops.length - 1];
    for (let a = 0; a < 4; a++) { const r = 34 - a * 7, cy = y0 - a * 12; g.fillStyle = a % 2 ? C.blk : (lit ? C.lgold : C.gold); g.beginPath(); g.arc(TX, cy, r, Math.PI, 0); g.fill();
      if (a % 2 === 0) { g.fillStyle = lit ? '#FFF2C4' : C.djade; for (let p = 0; p < 5; p++) { const q = Math.PI + (p + 0.5) / 5 * Math.PI; poly(g, [[TX + Math.cos(q) * r * 0.45, cy + Math.sin(q) * r * 0.45], [TX + Math.cos(q - 0.12) * r * 0.85, cy + Math.sin(q - 0.12) * r * 0.85], [TX + Math.cos(q + 0.12) * r * 0.85, cy + Math.sin(q + 0.12) * r * 0.85]]); g.fill(); } } }
    g.fillStyle = C.gold; poly(g, [[TX - 4, y0 - 44], [TX, CL[1] + 18], [TX + 4, y0 - 44]]); g.fill();
    g.strokeStyle = C.lgold; g.lineWidth = 2; g.beginPath(); g.arc(CL[0], CL[1], 24, 0, TAU); g.stroke();
  };
  const sphere = (g, x, y, r, t) => { const a = t * 1.7, hx = x + Math.cos(a) * r * 0.35, hy = y - r * 0.35;
    const gr = g.createRadialGradient(hx, hy, 1, x, y, r); gr.addColorStop(0, '#FFFFFF'); gr.addColorStop(0.25, '#E8E4D8'); gr.addColorStop(0.6, '#8E8A80'); gr.addColorStop(0.85, '#3A3832'); gr.addColorStop(1, '#C9A23A');
    g.fillStyle = gr; g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill(); g.strokeStyle = C.lgold; g.lineWidth = 2; g.stroke();
    g.fillStyle = 'rgba(255,255,255,0.9)'; g.beginPath(); g.ellipse(hx, hy, r * 0.18, r * 0.1, -0.5, 0, TAU); g.fill(); };
  // 九头虫: stepped Deco wings, chevron-feathered body; nine necks fanned (missing = index of the bitten head, -1 none)
  const BIRDHEADS = j => { const a = -Math.PI * (0.92 - j * 0.105); return a; };
  const bird = (g, t, missing, holding, flap) => {
    const [bx, by] = BIRD;
    g.save(); g.translate(bx, by);
    [-1, 1].forEach(d => { for (let s = 0; s < 5; s++) { const w = 70 + s * 22, y = -10 + s * 14 - flap * 10 * (4 - s) * 0.3; g.fillStyle = s % 2 ? C.gold : C.blk;
      poly(g, [[d * 20, y], [d * (20 + w), y - 18 + s * 3], [d * (20 + w - 16), y + 12], [d * 20, y + 14]]); g.fill(); g.strokeStyle = C.gold; g.lineWidth = 1.2; g.stroke(); } });
    g.fillStyle = C.blk; g.beginPath(); g.ellipse(0, 30, 30, 62, 0, 0, TAU); g.fill(); g.strokeStyle = C.lgold; g.lineWidth = 2; g.stroke();
    g.strokeStyle = C.gold; g.lineWidth = 2; for (let s = 0; s < 5; s++) { const y = 0 + s * 18; g.beginPath(); g.moveTo(-18, y); g.lineTo(0, y + 10); g.lineTo(18, y); g.stroke(); }
    for (let j = 0; j < 9; j++) { if (j === missing) { g.fillStyle = C.crim; g.beginPath(); const a = BIRDHEADS(j); g.arc(Math.cos(a) * 26, -16 + Math.sin(a) * 26, 5, 0, TAU); g.fill(); continue; }
      const a = BIRDHEADS(j) + 0.06 * Math.sin(t * 4 - j * 0.7), L = 118 + 10 * Math.sin(t * 4 - j * 0.7 + 1), hx = Math.cos(a) * L, hy = -16 + Math.sin(a) * L;
      g.strokeStyle = C.blk; g.lineWidth = 9; g.beginPath(); g.moveTo(0, -16); g.quadraticCurveTo(Math.cos(a - 0.25) * L * 0.55, -16 + Math.sin(a - 0.25) * L * 0.55, hx, hy); g.stroke();
      g.strokeStyle = C.gold; g.lineWidth = 2; g.stroke();
      g.fillStyle = C.blk; g.beginPath(); g.arc(hx, hy, 11, 0, TAU); g.fill(); g.strokeStyle = C.lgold; g.lineWidth = 2; g.stroke();
      const da = a + 0.5 * (j < 4 ? -1 : 1); g.fillStyle = C.lgold; poly(g, [[hx + Math.cos(da - 0.4) * 9, hy + Math.sin(da - 0.4) * 9], [hx + Math.cos(da) * 24, hy + Math.sin(da) * 24], [hx + Math.cos(da + 0.4) * 9, hy + Math.sin(da + 0.4) * 9]]); g.fill();
      g.fillStyle = C.crim; g.beginPath(); g.arc(hx + Math.cos(da) * 4, hy + Math.sin(da) * 4 - 3, 2.6, 0, TAU); g.fill(); }
    g.strokeStyle = C.gold; g.lineWidth = 4; g.beginPath(); g.moveTo(-12, 88); g.lineTo(-16, 104); g.moveTo(12, 88); g.lineTo(16, 104); g.stroke();
    g.restore();
    if (holding) sphere(g, bx, by + 118, 16, t);
  };
  // 哮天犬: a streamlined leaping greyhound, nose at the origin pointing +x
  const hound = (g, x, y, rot, s) => { g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s); g.lineJoin = 'round'; g.lineCap = 'round';
    const leg = pts => { g.strokeStyle = C.blk; g.lineWidth = 10; g.beginPath(); g.moveTo(pts[0], pts[1]); for (let k = 2; k < pts.length; k += 2) g.lineTo(pts[k], pts[k + 1]); g.stroke();
      g.strokeStyle = '#B8B2A2'; g.lineWidth = 6.5; g.stroke(); };
    leg([-95, 14, -52, 40, -16, 50]); leg([-188, 4, -222, 40, -258, 54]);
    g.fillStyle = C.silver; g.strokeStyle = C.blk; g.lineWidth = 2.4;
    poly(g, [[0, 0], [-28, -12], [-40, -16], [-56, -14], [-74, -16], [-96, -22], [-132, -28], [-162, -20], [-192, -14], [-204, -10], [-238, -26], [-252, -16], [-206, -1], [-198, 10], [-168, 2], [-130, 6], [-96, 24], [-66, 16], [-46, 10], [-22, 6]]); g.fill(); g.stroke();
    g.fillStyle = '#B8B2A2'; poly(g, [[-36, -14], [-62, -30], [-52, -12]]); g.fill(); g.stroke();
    leg([-80, 16, -34, 30, 8, 32]); leg([-176, 6, -214, 28, -252, 32]);
    g.fillStyle = C.lgold; poly(g, [[-52, -14], [-46, -15], [-50, 12], [-56, 12]]); g.fill(); g.fillStyle = C.blk; g.beginPath(); g.arc(-22, -5, 2.6, 0, TAU); g.fill();
    g.strokeStyle = 'rgba(232,198,106,0.8)'; g.lineWidth = 2; for (let j = 0; j < 3; j++) { g.beginPath(); g.moveTo(-262 - j * 18, -8 + j * 14); g.lineTo(-340 - j * 30, -8 + j * 14); g.stroke(); }
    g.restore(); };
  // 宝 in striped gold display letters (Broadway-style inline cuts), cached per scale
  const bao = S => XY.cached('deco-bao:' + S.toFixed(4), 170 * S, 170 * S, cv => { const g = cv.getContext('2d'); g.setTransform(S, 0, 0, S, 0, 0);
    g.font = XY.font(146, XY.cnFont.hei, '900'); g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillStyle = C.djade; g.fillText('宝', 91, 92); g.fillStyle = '#7A5A1E'; g.fillText('宝', 88, 89);           // stepped shadow layers
    const gr = g.createLinearGradient(0, 14, 0, 160); gr.addColorStop(0, '#FFF2C4'); gr.addColorStop(0.45, C.lgold); gr.addColorStop(1, '#9A7426');
    g.fillStyle = gr; g.fillText('宝', 85, 86); g.strokeStyle = 'rgba(255,250,230,0.9)'; g.lineWidth = 1.2; g.strokeText('宝', 85, 86); });

  XY.STYLES.artdeco = {
    bg(g, W, H) {
      let gr = g.createLinearGradient(0, 0, 0, 702); gr.addColorStop(0, C.night); gr.addColorStop(0.75, '#16302A'); gr.addColorStop(1, C.jade); g.fillStyle = gr; g.fillRect(0, 0, W, 702);
      // dim sunburst from the empty crown (lit per frame later), alternating fan wedges
      for (let j = 0; j < 36; j++) { const a0 = j / 36 * TAU, a1 = a0 + TAU / 72; g.fillStyle = j % 2 ? 'rgba(201,162,58,0.05)' : 'rgba(0,0,0,0.12)';
        g.beginPath(); g.moveTo(CROWN[0], CROWN[1]); g.arc(CROWN[0], CROWN[1], 1500, a0, a1); g.fill(); }
      g.strokeStyle = 'rgba(201,162,58,0.16)'; g.lineWidth = 1.2; for (let j = 0; j < 72; j++) { const a = j / 72 * TAU; g.beginPath(); g.moveTo(CROWN[0] + Math.cos(a) * 40, CROWN[1] + Math.sin(a) * 40); g.lineTo(CROWN[0] + Math.cos(a) * 1500, CROWN[1] + Math.sin(a) * 1500); g.stroke(); }
      const R = XY.rng(5101); g.fillStyle = C.lgold; for (let j = 0; j < 60; j++) { const x = R() * W, y = R() * 420, s = 1 + R() * 2.2; poly(g, [[x, y - s * 2], [x + s * 0.6, y], [x, y + s * 2], [x - s * 0.6, y]]); g.fill(); }
      // ground: black frieze band with gold chevrons and a fan border
      g.fillStyle = C.blk; g.fillRect(0, 702, W, H - 702); g.fillStyle = C.gold; g.fillRect(0, 700, W, 4); g.fillRect(0, 720, W, 2);
      g.strokeStyle = C.gold; g.lineWidth = 2.5; for (let x = 0; x < W; x += 40) { g.beginPath(); g.moveTo(x, 760); g.lineTo(x + 20, 732); g.lineTo(x + 40, 760); g.stroke(); }
      for (let x = 20; x < W; x += 80) { g.fillStyle = C.jade; g.beginPath(); g.arc(x, 762, 12, Math.PI, 0); g.fill(); }
      // title: striped 宝 in a stepped gold frame, the counter in Didot
      const fx = 46, fy = 44; g.strokeStyle = C.gold; g.lineWidth = 3; poly(g, [[fx + 20, fy], [fx + 170, fy], [fx + 170, fy + 20], [fx + 190, fy + 20], [fx + 190, fy + 200], [fx + 170, fy + 200], [fx + 170, fy + 220], [fx + 20, fy + 220], [fx + 20, fy + 200], [fx, fy + 200], [fx, fy + 20], [fx + 20, fy + 20]]); g.stroke();
      g.lineWidth = 1.2; g.strokeRect(fx + 12, fy + 12, 166, 196);
      g.fillStyle = C.lgold; g.font = XY.font(26, XY.cnFont.song, 'bold'); g.textBaseline = 'alphabetic'; g.fillText('第', fx + 30, fy + 276); g.fillText('难', fx + 150, fy + 276);
      g.font = XY.font(58, '"Didot", "Bodoni 72", serif', 'bold'); g.fillText('51', fx + 68, fy + 280);
      g.fillRect(fx + 24, fy + 292, 150, 2); g.font = XY.font(16, 'Copperplate'); g.fillText('JINGUANG  TEMPLE', fx + 26, fy + 316);
      // frame: double gold line with stepped corners
      const fr = (m, w) => { g.lineWidth = w; poly(g, [[m + 18, m], [W - m - 18, m], [W - m - 18, m + 18], [W - m, m + 18], [W - m, H - m - 18], [W - m - 18, H - m - 18], [W - m - 18, H - m], [m + 18, H - m], [m + 18, H - m - 18], [m, H - m - 18], [m, m + 18], [m + 18, m + 18]]); g.stroke(); };
      g.strokeStyle = C.gold; fr(8, 3); fr(16, 1.2);
    },
    draw(g, e) {
      const { W, H, t, u, beat } = e, k = K(), st8 = k.step(t, 8), lit = beat >= HOME, ign = XY.easeOut((beat - HOME) / 0.4) * (1 - 0.3 * XY.smooth((beat - 7) / 1.5));
      g.drawImage(bao(e.S), 46 + 10, 44 + 25, 170, 170);
      // stepped Deco clouds drifting
      [[180, 300, 260], [620, 180, 220], [980, 420, 240], [430, 420, 180]].forEach(([x0, y, w], j) => { const x = ((x0 + t * (12 + j * 5)) % (W + 300)) - 150;
        for (let s = 0; s < 3; s++) { const ww = w - s * 60, yy = y - s * 16; g.fillStyle = s % 2 ? 'rgba(31,92,78,0.55)' : 'rgba(244,238,220,0.1)'; g.beginPath(); g.roundRect(x - ww / 2 + s * 10, yy, ww, 14, 7); g.fill(); } });
      // the lit sunburst after the 舍利 is home
      if (ign > 0) { g.save(); g.globalCompositeOperation = 'lighter';
        for (let j = 0; j < 72; j++) { const a = j / 72 * TAU + 0.02, L = (420 + 520 * (j % 2)) * ign, al = (0.18 + 0.32 * (0.5 + 0.5 * Math.sin(t * 6 - j * 0.7))) * ign;
          g.strokeStyle = `rgba(232,198,106,${al})`; g.lineWidth = j % 3 ? 1.6 : 3.4; g.beginPath(); g.moveTo(CROWN[0] + Math.cos(a) * 30, CROWN[1] + Math.sin(a) * 30); g.lineTo(CROWN[0] + Math.cos(a) * L, CROWN[1] + Math.sin(a) * L); g.stroke(); }
        const fl = k.hitDecay(beat, HOME, 0.8); if (fl > 0.02) { const rg = g.createRadialGradient(CROWN[0], CROWN[1], 4, CROWN[0], CROWN[1], 320); rg.addColorStop(0, `rgba(255,236,170,${0.9 * fl})`); rg.addColorStop(1, 'rgba(255,220,140,0)'); g.fillStyle = rg; g.fillRect(CROWN[0] - 320, CROWN[1] - 320, 640, 640); }
        g.restore(); }
      g.save(); g.translate(TX, PB); g.scale(PS, PS); g.translate(-TX, -702); pagoda(g, lit, st8); g.restore();
      // the chained monks of 金光寺 on the far shore: their gold rings burst when the tower lights
      [104, 140, 176].forEach(x => { g.fillStyle = C.djade; poly(g, [[x - 14, PB], [x - 8, PB - 54], [x + 8, PB - 54], [x + 14, PB]]); g.fill(); g.fillStyle = '#C8946A'; g.beginPath(); g.arc(x, PB - 63, 9, 0, TAU); g.fill();
        g.strokeStyle = C.gold; g.lineWidth = 1.2; g.beginPath(); g.moveTo(x - 14, PB); g.lineTo(x - 8, PB - 54); g.lineTo(x + 8, PB - 54); g.lineTo(x + 14, PB); g.stroke();
        const fr = XY.smooth((beat - HOME - 0.4) / 0.4); if (fr > 0) { g.strokeStyle = '#C8946A'; g.lineWidth = 5; g.lineCap = 'round'; g.beginPath(); g.moveTo(x - 6, PB - 48); g.lineTo(x - 14, PB - 48 - 30 * fr); g.moveTo(x + 6, PB - 48); g.lineTo(x + 14, PB - 48 - 30 * fr); g.stroke(); } });
      const brk = XY.easeOut((beat - HOME - 0.3) / 0.5);
      for (let j = 0; j < 12; j++) { const x0 = 96 + j * 8, y0 = PB - 32, a = -Math.PI / 2 + (XY.hash(j, 51) - 0.5) * 2.4, d = brk * (60 + 80 * XY.hash(j, 52));
        g.strokeStyle = C.lgold; g.lineWidth = 2.2; g.beginPath(); g.ellipse(x0 + Math.cos(a) * d, y0 + Math.sin(a) * d + brk * brk * 60, 4.5, 3, j + brk * 6, 0, TAU); g.stroke(); }
      // 碧波潭: fish-scale wave rows sliding along the shore
      for (let r = 0; r < 4; r++) { const y = 606 + r * 24, sp = (t * (26 + r * 10)) % 48;
        for (let x = -48 + sp - (r % 2) * 24; x < W + 48; x += 48) { g.fillStyle = r % 2 ? C.jade : C.djade; g.beginPath(); g.arc(x, y + 24, 24, Math.PI, 0); g.fill(); g.strokeStyle = C.gold; g.lineWidth = 1.6; g.beginPath(); g.arc(x, y + 24, 24, Math.PI, 0); g.stroke();
          g.lineWidth = 1; g.beginPath(); g.arc(x, y + 24, 14, Math.PI, 0); g.stroke(); } }
      // 九头虫: hovering with the stolen 舍利; on 1.8–3.6 it lunges, necks straining toward the pilgrims; bitten on 4 it recoils and
      //      lets go; from 6 it flees off the top right, bleeding (原著: 带伤逃往北海)
      const bit = beat >= BITE, recoil = k.hitDecay(beat, BITE, 0.8), lunge = XY.smooth((beat - 1.8) / 0.5) * (1 - XY.smooth((beat - 3.6) / 0.4)), flee = XY.easeIn((beat - 6) / 1.4);
      const bxo = -70 * lunge + 30 * recoil + 520 * flee, byo = 40 * lunge - 20 * recoil - 520 * flee;
      g.save(); g.translate(bxo, byo); g.translate(BIRD[0], BIRD[1]); g.rotate(-0.22 * lunge); g.scale(1 + 0.3 * lunge, 1 + 0.3 * lunge); g.translate(-BIRD[0], -BIRD[1]); bird(g, t * (1 + 1.5 * lunge), bit ? 6 : -1, beat < BITE + 0.15, Math.sin(t * (5 + 6 * lunge)));
      if (bit) { g.fillStyle = C.crim; for (let j = 0; j < 5; j++) { const ph = ((beat - BITE) * 1.4 + j / 5) % 1, a = BIRDHEADS(6); g.beginPath(); g.arc(BIRD[0] + Math.cos(a) * 26 + j * 2, BIRD[1] - 16 + Math.sin(a) * 26 + ph * 90, 3.5 * (1 - ph), 0, TAU); g.fill(); } }
      g.restore();
      // 哮天犬 runs in along the far shore from the right (2.6), leaps on 3.5 through the seventh head (4) and away to the upper left
      const hp = (() => { const a = BIRDHEADS(6), L = 118; return [BIRD[0] + Math.cos(a) * L - 70 * 0, BIRD[1] - 16 + Math.sin(a) * L]; })();
      const dogAt = b => { if (b < 3.5) { const s = XY.clamp((b - 2.6) / 0.9); return [XY.lerp(W + 160, 1060, s), PB - 18 - 10 * Math.abs(Math.sin(b * 12))]; }
        if (b < BITE) { const s = XY.clamp((b - 3.5) / 0.5); return [XY.lerp(1060, hp[0] + 6, s), XY.lerp(PB - 18, hp[1], XY.easeOut(s)) - 60 * Math.sin(Math.PI * s)]; }
        const s = XY.clamp((b - BITE) / 0.9); return [XY.lerp(hp[0] + 6, 520, s), XY.lerp(hp[1], -140, s) + 60 * Math.sin(Math.PI * s)]; };
      if (beat > 2.6 && beat < BITE + 0.92) { const p = dogAt(beat), q = dogAt(beat + 0.03), a = Math.atan2(q[1] - p[1], -(q[0] - p[0]));
        g.save(); g.translate(p[0], p[1]); g.scale(-1, 1); hound(g, 0, 0, a, 1.1); if (bit) { g.rotate(a); g.fillStyle = C.blk; g.beginPath(); g.arc(8, 4, 11, 0, TAU); g.fill(); g.fillStyle = C.lgold; poly(g, [[14, 0], [30, 6], [14, 10]]); g.fill(); } g.restore(); }
      const bf = k.hitDecay(beat, BITE, 0.6); if (bf > 0.03) { g.fillStyle = K().rgba(C.lgold, bf); for (let j = 0; j < 16; j++) { const a = j / 16 * TAU, d = 16 + 90 * (1 - bf);
        poly(g, [[hp[0] + Math.cos(a - 0.08) * d * 0.5, hp[1] + Math.sin(a - 0.08) * d * 0.5], [hp[0] + Math.cos(a) * (d + 26), hp[1] + Math.sin(a) * (d + 26)], [hp[0] + Math.cos(a + 0.08) * d * 0.5, hp[1] + Math.sin(a + 0.08) * d * 0.5]]); g.fill(); } }
      // the 舍利: falls from the claws on 4.15 and arcs into the crown on 5 (HOME)
      const S0 = [BIRD[0] + 30, BIRD[1] + 98];   // where the claws let go (bird recoiled)
      if (beat >= BITE + 0.15) { const s = XY.clamp((beat - BITE - 0.15) / (HOME - BITE - 0.15)), arcAt = q => [XY.lerp(S0[0], CROWN[0], q), XY.lerp(S0[1], CROWN[1], q) - 200 * Math.sin(Math.PI * q)];
        if (s < 1) for (let j = 1; j < 7; j++) { const p2 = arcAt(XY.clamp(s - j * 0.03)); g.fillStyle = `rgba(232,198,106,${0.4 - j * 0.05})`; g.beginPath(); g.arc(p2[0], p2[1], 20 - j, 0, TAU); g.fill(); }
        const p1 = arcAt(s); sphere(g, p1[0], p1[1], s < 1 ? 22 : 19, t); }
      // ---- the pilgrims in black, gold, cream and jade with gold contours, a metallic sheen across them
      const pr = (a, b, r = 0.3) => XY.smooth((beat - a) / r) * (1 - XY.smooth((beat - b) / r));
      const acts = { wukong: { shade: pr(0.5, 1.6), raise: pr(1.9, 3.3, 0.3), strike: pr(3.3, 3.9, 0.15), }, monk: { palm: k.after(beat, HOME, 0.35) }, bajie: { scratch: k.pulse(beat, 2.2, 0.6) + k.pulse(beat, 7, 0.8) }, shaseng: { lift: k.pulse(beat, 4.2, 0.5) } };
      const [cv, lg] = k.layer(e, 'deco-proc'); XY.drawProcession(lg, e.phase, e.procX, e.groundY, PEN, acts);
      lg.save(); lg.globalCompositeOperation = 'source-atop'; const sh = lg.createLinearGradient(e.procX - 400, e.groundY - 280, e.procX + 320, e.groundY);
      sh.addColorStop(0, 'rgba(255,240,200,0.22)'); sh.addColorStop(0.5, 'rgba(255,240,200,0)'); sh.addColorStop(1, 'rgba(0,0,0,0.3)'); lg.fillStyle = sh; lg.fillRect(e.procX - 420, e.groundY - 300, 760, 310);
      if (lit) { lg.fillStyle = `rgba(255,230,150,${0.3 * k.hitDecay(beat, HOME, 1)})`; lg.fillRect(e.procX - 420, e.groundY - 300, 760, 310); }
      lg.restore(); k.blit(g, cv);
      e._zoom = [[hp[0] - 60, hp[1] + 60, k.push(beat, 3.9, 0.12, 0.3, 0.6)], [CROWN[0] + 120, CROWN[1] + 200, k.push(beat, 4.95, 0.15, 0.4, 0.8)]];
    },
    post(canvas, g, e) { const z = e._zoom; if (!z) return; const a = z[0][2] > 0 ? z[0] : z[1]; if (a[2] > 0) K().postZoom(canvas, g, e, a[0], a[1], 1 + (a === z[0] ? 0.13 : 0.1) * a[2]); },
    hits: [BITE, HOME],
    thumb: 6.6,   // overview thumbnail: a clear frame with no in-panel push-in active
  };
})();
