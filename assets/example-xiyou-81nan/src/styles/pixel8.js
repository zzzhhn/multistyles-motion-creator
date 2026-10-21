// 65 8-bit 像素 · 1985 年 · 比丘救子 — the whole panel is painted on a 295×195 grid (1 px = 4 design units) and
// blown up with hard pixels. 比丘国 at night: goose cages (鹅笼) hang under every eave with a child inside. Beat 2:
// 悟空's raised staff bumps a ? block, out comes the 阴风 the gods were asked for; it sweeps the street and lifts the
// cages one by one into the sky, each leaving a green 1UP, the HUD cage counter falls from 1111 to 0000, and the
// 国丈 at the palace gate hops with rage. The pilgrims go through the same grid: low-res, alpha-threshold, NES palette, 1px outline.
(() => {
  'use strict';
  const XY = window.XY, K = XY.KIT_H, { sin, floor, round } = Math;
  const BW = 295, BH = 195, GYL = 176, KP = 4;
  const NES = { fur: '#AC7C00', face: '#FCBCB0', wkshirt: '#D82800', tiger: '#F8B800', stripe: '#000000', gold: '#F8D878', staff: '#D82800', ink: '#000000',
    horse: '#FCFCFC', horse2: '#BCBCBC', mane: '#FCFCFC', hoof: '#503000', saddle: '#A81000', red: '#D82800', robe: '#F8B800', kasaya: '#D82800', skin: '#FCBCB0',
    metal: '#F8B800', bjrobe: '#0000A8', bjpants: '#000058', pig: '#F8B8F8', pig2: '#F878F8', wood: '#AC7C00', ssrobe: '#0078F8', ssrobe2: '#0058B8', skin2: '#E45C10',
    ssh: '#A81000', ssbeard: '#A81000', skull: '#FCFCFC', bundle: '#F8B800' };
  const PEN = K.pen(NES, null, 0, { shade: false, fine: false });
  const PAL = [...new Set(Object.values(NES).concat(['#000000', '#FCFCFC']))].map(K.hex);
  const C = { black: '#000000', white: '#FCFCFC', grey: '#BCBCBC', dgrey: '#7C7C7C', brick: '#C84C0C', bhi: '#FC9838', mortar: '#000000', gold: '#F8B800', tan: '#F0BC3C',
    brown: '#AC7C00', dbrown: '#503000', red: '#D82800', dred: '#A81000', skin: '#FCBCB0', blue: '#3CBCFC', green: '#00A800', lgreen: '#B8F818' };
  const R = (g, x, y, w, h, c) => { g.fillStyle = c; g.fillRect(x, y, w, h); };

  // ------------------------------------------------------------ static level art (295×195, painted once)
  const HOUSES = [[0, 74], [74, 72], [146, 76]];   // x, width — the palace gate takes the right
  const levelArt = () => XY.keep('p8-level', BW, BH, cv => {
    const g = cv.getContext('2d'), rnd = XY.rng(65);
    // night sky in three NES-style bands, joined by checkerboard dither
    const bands = ['#000020', '#0C1060', '#24308C'], edges = [24, 62, 104];
    for (let y = 0; y < GYL; y++) { const base = y > edges[2] + 2 ? 2 : y > edges[1] + 2 ? 1 : 0; R(g, 0, y, BW, 1, bands[base]);
      for (let k = 1; k <= 2; k++) if (Math.abs(y - edges[k]) <= 2) for (let x = (y % 2); x < BW; x += 2) R(g, x, y, 1, 1, bands[y >= edges[k] ? k - 1 : k]); }
    // moon with craters
    for (let y = -10; y <= 10; y++) for (let x = -10; x <= 10; x++) if (x * x + y * y <= 100) R(g, 40 + x, 44 + y, 1, 1, x * x + y * y > 80 ? '#F0BC3C' : '#FCE0A8');
    R(g, 36, 40, 3, 2, '#F0BC3C'); R(g, 43, 47, 2, 2, '#F0BC3C'); R(g, 41, 38, 1, 1, '#F0BC3C');
    // far mountains, two ranges
    [['#141C5C', 96, 28, 0.05, 3], ['#0A1040', 104, 16, 0.09, 7]].forEach(([c, base, amp, f, s]) => { for (let x = 0; x < BW; x++) { const h = round(base - amp * (0.5 + 0.5 * XY.noise1(x * f, s)) - 6 * Math.max(0, XY.noise1(x * f * 3, s + 1))); R(g, x, h, 1, GYL - h, c); } });
    // 比丘国 skyline above the roofs: city wall with crenels, tiered pagodas with lit windows
    R(g, 0, 84, BW, 10, '#05072A'); for (let x = 0; x < BW; x += 6) R(g, x, 82, 3, 2, '#05072A');
    [[30, 8, 4], [118, 10, 6], [196, 7, 5], [268, 6, 3]].forEach(([x, w, n]) => { for (let k = 0; k < n; k++) { const y = 86 - k * 8, ww = w - k; R(g, x - ww - 3, y - 2, (ww + 3) * 2, 2, '#0C1450'); R(g, x - ww, y - 7, ww * 2, 5, '#05072A'); R(g, x - 1, y - 6, 2, 2, k % 2 ? '#F8B800' : '#D82800'); }
      R(g, x, 86 - n * 8 - 7, 1, 7, '#0C1450'); });
    // houses: brick walls, tiled eaves, doors, lit windows
    HOUSES.forEach(([x, w], i) => {
      R(g, x, 104, w, GYL - 104, '#AC7C00');
      for (let y = 106; y < GYL; y += 4) for (let bx = x + ((y >> 2) % 2) * 4; bx < x + w; bx += 8) { R(g, bx, y, 1, 4, '#503000'); R(g, x, y, w, 1, '#503000'); }
      R(g, x - 2, 96, w + 4, 6, '#7C7C7C'); R(g, x - 4, 101, w + 8, 3, '#000000'); for (let k = x - 2; k < x + w + 2; k += 4) R(g, k, 96, 2, 5, '#BCBCBC');
      R(g, x + 2, 92, w - 4, 4, '#503000'); R(g, x - 6, 101, 4, 2, '#7C7C7C'); R(g, x + w + 2, 101, 4, 2, '#7C7C7C');
      const dx = x + round(w / 2) - 7; R(g, dx - 1, 147, 16, GYL - 147, '#000000'); R(g, dx, 148, 14, GYL - 148, '#503000'); R(g, dx + 6, 148, 2, GYL - 148, '#000000'); R(g, dx + 4, 160, 1, 2, '#F8B800'); R(g, dx + 9, 160, 1, 2, '#F8B800');
      [[x + 6, 130], [x + w - 18, 130]].forEach(([wx, wy]) => { R(g, wx - 1, wy - 1, 14, 12, '#000000'); R(g, wx, wy, 12, 10, '#F8D878'); R(g, wx + 5, wy, 2, 10, '#AC7C00'); R(g, wx, wy + 4, 12, 2, '#AC7C00'); });
    });
    // palace gate (右): red walls, gold roof, dark gateway, steps
    R(g, 226, 92, 69, GYL - 92, '#A81000'); R(g, 222, 84, 77, 8, '#F8B800'); R(g, 218, 90, 85, 3, '#AC7C00'); R(g, 230, 76, 61, 8, '#F8B800'); R(g, 228, 82, 65, 2, '#AC7C00');
    for (let k = 232; k < 292; k += 6) R(g, k, 77, 2, 6, '#AC7C00');
    R(g, 246, 116, 30, GYL - 116, '#000000'); R(g, 244, 112, 34, 4, '#F8B800'); for (let y = 120; y < GYL; y += 8) { R(g, 230, y, 12, 1, '#D82800'); R(g, 280, y, 12, 1, '#D82800'); }
    R(g, 240, 168, 42, 3, '#BCBCBC'); R(g, 236, 171, 50, 5, '#7C7C7C');
    // ground: brick rows, gold top line continuing the wall's gold line
    R(g, 0, GYL, BW, BH - GYL, '#C84C0C');
    for (let y = GYL + 1, row = 0; y < BH; y += 6, row++) { R(g, 0, y + 5, BW, 1, '#000000'); for (let x = row % 2 ? 0 : 8; x < BW; x += 16) R(g, x, y, 1, 5, '#000000'); R(g, 0, y, BW, 1, '#FC9838'); }
    R(g, 0, GYL, BW, 1, '#F8B800');
  });

  // ------------------------------------------------------------ sprites
  // thresholded bitmap kanji (old 12×12 Chinese cartridge look), cached once
  const kanji = (s, px, col) => K.kanji(s, px, col);   // thresholded bitmap kanji, CPU-backed (kit_h)
  const kj = (g, s, x, y, px, col, sh) => { if (sh) g.drawImage(kanji(s, px, sh), x + 1, y + 1); g.drawImage(kanji(s, px, col), x, y); return kanji(s, px, col).width - 2; };
  const CAGES = [10, 46, 82, 118, 154], CY0 = 105;
  // bamboo goose cage with a child (frame 0 hands on the bars, frame 1 arms up); empty = no child
  const cage = (g, x, y, fr, empty, cry) => {
    if (!empty) { R(g, x + 5, y + 6, 4, 4, C.skin); R(g, x + 6, y + 5, 2, 1, C.black); R(g, x + 6, y + 7, 1, 1, C.black); R(g, x + 8, y + 7, 1, 1, C.black);
      R(g, x + 5, y + 10, 4, 4, C.red); if (fr) { R(g, x + 3, y + 7, 2, 2, C.skin); R(g, x + 9, y + 7, 2, 2, C.skin); } else { R(g, x + 3, y + 10, 2, 2, C.skin); R(g, x + 9, y + 10, 2, 2, C.skin); }
      if (cry) R(g, x + 5, y + 8 + fr, 1, 1, C.blue); }
    R(g, x + 5, y, 4, 1, C.brown); R(g, x + 3, y + 1, 8, 1, C.tan); R(g, x + 1, y + 2, 12, 1, C.tan);
    for (let k = 0; k < 5; k++) R(g, x + 1 + k * 3, y + 3, 1, 12, C.tan);
    R(g, x, y + 3, 14, 1, C.brown); R(g, x, y + 9, 14, 1, C.tan); R(g, x, y + 15, 14, 1, C.brown); R(g, x + 6, y - 1, 2, 1, C.dgrey);
  };
  // the 阴风 whirlwind: rows of grey swirl that widen upward, dark bands travelling round, debris orbiting
  const wind = (g, cx, t, sz) => {
    const top = 92, hgt = GYL - top, fr = floor(t * 20);
    for (let r = 0; r < hgt; r++) { const q = r / hgt, hw = round((3 + (1 - q) * 15) * sz), x = round(cx + 5 * sin(r * 0.17 + t * 9) * (1 - q * 0.6));
      if (hw < 1) continue; R(g, x - hw, top + r, hw * 2, 1, (r + fr) % 7 < 2 ? C.grey : '#A8A8C8');
      const off = (r * 3 + fr * 4) % (hw * 2); R(g, x - hw + off, top + r, Math.min(3, hw), 1, C.dgrey); R(g, x - hw, top + r, 1, 1, C.white); }
    for (let k = 0; k < 10; k++) { const a = t * 8 + k * 0.63, y = top + 4 + k * 8, hw = (3 + (1 - (y - top) / hgt) * 15) * sz; R(g, round(cx + Math.cos(a) * (hw + 3)), y, 2, 1, k % 3 ? C.lgreen : C.white); }
  };
  const block = (g, x, y, kind, t) => {
    if (kind === 'brick') { R(g, x, y, 16, 16, C.brick); R(g, x, y, 16, 1, C.bhi); for (let r = 0; r < 4; r++) { R(g, x, y + r * 4 + 3, 16, 1, C.black); for (let c = (r % 2) * 4; c < 16; c += 8) R(g, x + c, y + r * 4, 1, 3, C.black); } return; }
    const used = kind === 'used', sh = [C.bhi, C.gold, C.brown][floor(t * 6) % 3];
    R(g, x, y, 16, 16, C.black); R(g, x + 1, y + 1, 14, 14, used ? C.brown : C.bhi); R(g, x + 1, y + 1, 14, 1, used ? C.dbrown : C.gold);
    [[2, 2], [13, 2], [2, 13], [13, 13]].forEach(([a, b]) => R(g, x + a, y + b, 1, 1, used ? C.black : C.dbrown));
    if (!used) K.pixText(g, '?', x + 5, y + 4, 1, sh === C.brown ? C.white : C.white, C.dbrown);
  };
  // 国丈: black official cap, white beard, red robe, dragon-head staff; hops with rage once the cages are gone
  const guozhang = (g, x, y, t, mad) => {
    const hop = mad && floor(t * 8) % 2 ? -3 : 0; y += hop;
    R(g, x - 3, y - 26, 1, 28 - hop, C.brown); R(g, x - 5, y - 29, 4, 3, C.gold); R(g, x - 6, y - 28, 1, 2, C.gold);
    R(g, x, y - 16, 10, 16, C.red); R(g, x - 1, y - 4, 12, 4, C.red); R(g, x, y - 9, 10, 1, C.gold); R(g, x + 4, y - 16, 2, 8, C.dred);
    R(g, x + 2, y - 24, 6, 6, C.skin); R(g, x + 2, y - 19, 6, 5, C.white); R(g, x + 3, y - 14, 4, 2, C.white);
    R(g, x + 3, y - 22, 1, 1, C.black); R(g, x + 6, y - 22, 1, 1, C.black); R(g, x + 2, y - 23, 2, 1, C.white); R(g, x + 6, y - 23, 2, 1, C.white);
    R(g, x + 1, y - 27, 8, 3, C.black); R(g, x - 2, y - 26, 3, 1, C.black); R(g, x + 9, y - 26, 3, 1, C.black); R(g, x - 1, y - 2 - hop, 4, 2, C.black); R(g, x + 7, y - 2 - hop, 4, 2, C.black);
    if (mad) K.pixText(g, '!?', x - 1, y - 38, 1, floor(t * 6) % 2 ? C.red : C.white, C.black);
  };
  const monkeyIcon = (g, x, y) => { R(g, x, y, 8, 8, C.brown); R(g, x + 2, y + 3, 5, 5, C.skin); R(g, x + 3, y + 4, 1, 1, C.black); R(g, x + 5, y + 4, 1, 1, C.black); R(g, x, y + 1, 8, 1, C.gold); };

  // ------------------------------------------------------------ the cell (8 beats at 90 BPM; u = beat / 8)
  const HIT = 0.5, CLEAR = 0.71, QX = {};
  const qxOf = c => QX[c.n] || (QX[c.n] = round((XY.procWorldX(c.t0 + HIT * c.dur) - c.x + 262) / KP) - 8);   // ? block sits over 悟空 at the hit
  // the 阴风 as a squat whirl riding along the eaves: above the pilgrims' heads and behind them
  const roofWind = (g, cx, t, sz) => { const top = 72, hgt = 60, fr = floor(t * 20);
    for (let r = 0; r < hgt; r++) { const q = r / hgt, hw = round((10 + 14 * sin(q * Math.PI * 0.9 + 0.2)) * sz), x = round(cx + 6 * sin(r * 0.2 + t * 10));
      if (hw < 1) continue; R(g, x - hw, top + r, hw * 2, 1, (r + fr) % 7 < 2 ? C.grey : '#A8A8C8');
      const off = (r * 3 + fr * 5) % (hw * 2); R(g, x - hw + off, top + r, Math.min(4, hw), 1, C.dgrey); R(g, x - hw, top + r, 1, 1, C.white); }
    for (let k = 0; k < 12; k++) { const a = t * 9 + k * 0.52, y = top + 4 + k * 5, hw = (10 + 14 * sin((y - top) / hgt * Math.PI * 0.9 + 0.2)) * sz; R(g, round(cx + Math.cos(a) * (hw + 4)), y, 2, 2, k % 3 ? C.lgreen : C.white); } };
  const kjAll = (g, s, x, y, px, col, sh) => { const T = K.kanji(s, px, col); if (sh) g.drawImage(K.kanji(s, px, sh), x + 1, y + 1); g.drawImage(T, x, y); return T.width; };
  XY.STYLES.pixel8 = {
    hits: [4, 5.7],
    draw(g, e) {
      const { W, H, t, u } = e, gy = e.groundY, F = XY.scratch('p8-frame', BW, BH), f = F.getContext('2d');
      f.drawImage(levelArt(), 0, 0);
      for (let k = 0; k < 28; k++) { const x = floor(XY.hash(k, 1) * BW), y = 26 + floor(XY.hash(k, 2) * 62), ph = (floor(t * 4) + k) % 6;
        if ((x > 26 && x < 54 && y > 30 && y < 58) || ph === 0) continue; R(f, x, y, 1, 1, ph === 3 ? C.white : '#8888C8');
        if (ph === 3 && k % 3 === 0) { R(f, x - 1, y, 3, 1, C.white); R(f, x, y - 1, 1, 3, C.white); } }
      [[0, 58, 0.3], [140, 76, 0.5]].forEach(([x0, y, sp]) => { const x = ((x0 - floor(t * 8 * sp)) % (BW + 40) + BW + 40) % (BW + 40) - 30;
        R(f, x + 4, y, 14, 2, '#5C68B8'); R(f, x, y + 2, 24, 3, '#5C68B8'); R(f, x + 6, y - 2, 6, 2, '#5C68B8'); R(f, x + 2, y + 2, 20, 1, '#8890D8'); });
      HOUSES.forEach(([x, w], i) => [x + 3, x + w - 6].forEach((lx, j) => { const on = (floor(t * 5) + i + j) % 4 !== 0;
        R(f, lx + 1, 104, 1, 2, C.dgrey); R(f, lx, 106, 3, 5, C.red); R(f, lx, 106, 3, 1, C.gold); R(f, lx + 1, 108, 1, 2, on ? C.gold : C.bhi); R(f, lx + 1, 111, 1, 2, C.gold); }));
      // cages: crying until the roof-line wind reaches them, then lifted into the sky, a 1UP left behind
      const qx = qxOf(e.cell), wX = u < HIT + 0.03 ? qx + 8 : XY.lerp(qx + 4, -34, (u - HIT - 0.03) / 0.18);
      const liftU = i => HIT + 0.03 + 0.18 * (qx + 4 - (CAGES[i] + 7)) / (qx + 38);
      let lifted = 0; const ups = [];
      CAGES.forEach((x, i) => { const lu = liftU(i), fr = (floor(t * 3) + i) % 2;
        if (u < lu) { R(f, x + 6, 103, 2, 2, C.dgrey); cage(f, x, CY0, fr, false, u < HIT + 0.02); return; }
        lifted++; const d = u - lu, y = round(CY0 - d * 700); if (y > -20) cage(f, x + round(4 * sin(d * 40)), y, 1, false, false);
        if (d < 0.18 && (d < 0.13 || floor(t * 12) % 2)) ups.push([x - 1, round(CY0 + 4 - d * 90)]); });
      const bump = u > HIT && u < HIT + 0.04 ? -round(5 * sin((u - HIT) / 0.04 * Math.PI)) : 0;
      block(f, qx - 16, 116, 'brick', t); block(f, qx, 116 + bump, u > HIT ? 'used' : 'q', t);
      if (u > HIT && u < HIT + 0.05) { const q = (u - HIT) / 0.05, y = round(110 - q * 20); R(f, qx + 3, y, 10, 4, C.white); R(f, qx + 1, y + 2, 14, 3, C.grey); R(f, qx + 5, y - 2, 6, 2, C.white); }
      const sz = XY.smooth((u - HIT) / 0.03) * (1 - XY.smooth((u - HIT - 0.2) / 0.03));
      if (sz > 0.02) roofWind(f, round(wX), t, sz);
      this.guozhang(f, u, t);
      // the pilgrims as sprites
      const acts = { wukong: { shade: K.win(u, 0.16, 0.38, 0.05), raise: K.win(u, 0.42, 0.56, 0.035) }, monk: { palm: K.win(u, 0.24, 0.66, 0.05) }, bajie: { scratch: K.win(u, 0.74, 1.05, 0.05) }, shaseng: { lift: K.win(u, CLEAR, CLEAR + 0.08, 0.03) } };
      const phq = round(e.phase * 8) / 8, PX = floor((e.procX - 410) / KP), PY = 98;
      if (PX < BW + 4 && PX + 192 > -4) {
        const pc = K.cpu('p8-proc', 192, 82), pg = pc.getContext('2d'); pg.setTransform(1 / KP, 0, 0, 1 / KP, -PX, -PY);
        XY.drawProcession(pg, phq, e.procX, gy, PEN, acts); K.spriteize(pc, PAL, [0, 0, 0]); f.drawImage(pc, PX, PY);
        const eye = (k, dx, dy, w) => { const p = XY.anchor(k, phq, acts); R(f, floor((e.procX + p[0] + dx) / KP), floor((gy + p[1] + dy) / KP), w || 1, 1, C.black); };
        eye('wukong.head', 11, -4); eye('bajie.head', 10, -6); eye('shaseng.head', 9, -3); eye('monk.head', 4, -3, 2);
      }
      ups.forEach(([x, y]) => K.pixText(f, '1UP', x, y, 1, C.lgreen, '#005800'));
      // HUD: one thresholded run for 第65难 so digits and kanji share the same pixels
      R(f, 0, 0, BW, 23, C.black); R(f, 0, 23, BW, 1, C.dbrown);
      kjAll(f, '第65难', 5, 4, 15, C.white); K.pixText(f, 'hhh', 70, 8, 1, C.red); kjAll(f, '救子', 130, 2, 17, C.gold, C.dred);
      const n = lifted >= CAGES.length ? 0 : 1111 - round(1111 * lifted / CAGES.length);
      R(f, 222, 7, 9, 9, C.black); cage(f, 220, 6, 0, true, false);
      K.pixText(f, 'x' + String(n).padStart(4, '0'), 238, 8, 1, lifted && floor(t * 10) % 2 && n ? C.gold : C.white);
      if (u > CLEAR && u < CLEAR + 0.16 && floor(t * 6) % 3) { const s = 'STAGE CLEAR'; R(f, 70, 34, 156, 22, 'rgba(0,0,0,0.7)'); K.pixText(f, s, round(BW / 2 - K.pixW(s, 2) / 2), 38, 2, C.gold, C.dred); }
      this.card(f, u, t);
      K.blit(g, F, 0, 0, W, H);
    },
    // 国丈 at the palace gate: steps out and gloats (wants 1111 hearts), hops with rage after the clear, flees inside and the doors shut
    guozhang(f, u, t) {
      const out = XY.smooth((u - 0.18) / 0.06), flee = XY.clamp((u - 0.74) / 0.04), x = round(256 - 10 * out + 14 * flee);
      if (u < 0.78) guozhang(f, x, 168, t, u > CLEAR);
      if (u > 0.22 && u < 0.46) { R(f, x - 26, 130, 40, 15, C.black); R(f, x - 25, 131, 38, 13, C.white); R(f, x - 4, 145, 3, 3, C.white);
        K.pixText(f, 'h', x - 22, 134, 1, C.red); K.pixText(f, 'x1111', x - 15, 134, 1, C.black); }
      const shut = XY.clamp((u - 0.78) / 0.05); if (shut > 0) { const w = round(15 * shut); R(f, 246, 116, w, GYL - 116 - 8, C.dred); R(f, 276 - w, 116, w, GYL - 116 - 8, C.dred); R(f, 246 + w - 1, 116, 1, 52, C.gold); R(f, 276 - w, 116, 1, 52, C.gold); }
    },
    // NES stage card: a box in the sky only, the street and the ground stay lit; gone as the pilgrims arrive
    card(f, u, t) {
      if (u > 0.1) return; const y = round(28 - 60 * XY.smooth(u / 0.1));
      R(f, 64, y, 168, 58, 'rgba(0,0,0,0.82)'); R(f, 64, y, 168, 1, C.gold); R(f, 64, y + 57, 168, 1, C.gold);
      kjAll(f, '第65难', 74, y + 6, 14, C.white); kjAll(f, '比丘国', 154, y + 5, 15, C.gold, C.dred);
      monkeyIcon(f, 76, y + 30); K.pixText(f, 'x 3', 88, y + 31, 1, C.white);
      if (u < 0 ? floor(t * 2.5) % 2 : 1) K.pixText(f, u < 0 ? 'PUSH START' : 'START!', 124, y + 32, 1, C.gold);
    },
  };
})();
