// 45 克里姆特 · 1907 年 · 再贬心猿 — 第五十六回：悟空打死拦路的强盗，唐僧大怒，念紧箍咒把他再次赶走，悟空一个筋斗去南海见观音。
// 学克里姆特金色时期的语言（逐像素金箔、方块与螺旋纹样、写实的脸配平面纹袍、分离派黑底金框方牌），画的是原著里的山路：
// 金箔松树、镶嵌石子路、路边被打死的强盗、天上螺旋祥云，右上角是悟空要去的南海落伽山（紫竹林）。第 3 拍悟空被一股金色旋流推出队伍，缩小翻滚，没入树顶的螺旋。
(() => {
  'use strict';
  const XY = window.XY, K = XY.KIT_E, TAU = XY.TAU;
  const SPELL = 1.6, GONE = 4.5, ARRIVE = 5.8, TOP = [1060, 150], MEAD = 642;
  const COL = { fur: '#9A6A3A', face: '#F2D2B4', wkshirt: '#B8402E', tiger: '#D9A441', stripe: '#1C1712', gold: '#F2C84E', staff: '#B3261E', ink: '#1C1712', horse: '#F6F1E6', horse2: '#D8CFC0',
    mane: '#EEE6D6', hoof: '#2A2218', saddle: '#7A2A1E', red: '#B3261E', robe: '#E2B84A', kasaya: '#B3261E', skin: '#F4D8BE', metal: '#D8B04A', bjrobe: '#1E1E26', bjpants: '#18181E',
    pig: '#F2C2B8', pig2: '#E0A096', wood: '#7A5A32', ssrobe: '#2E4250', ssrobe2: '#24343E', skin2: '#C89A72', ssh: '#B5452E', ssbeard: '#9A3A26', skull: '#F2ECDC', bundle: '#D9A441' };
  const PEN = { color: r => COL[r], outline: '#3A2410', ow: 1.2, shade: 'rgba(90,50,10,0.22)' };
  // which robe parts take which pattern: squares for the men's robes, circles and spirals for the master's kasaya and the saddle cloth
  const SQ = new Set(['wkshirt', 'bjrobe', 'bjpants', 'ssrobe', 'ssrobe2', 'tiger']), CI = new Set(['kasaya', 'robe', 'red', 'saddle']);
  // mask pens paint their parts white and erase every other part, so a pattern never shows through what is in front of it
  const maskPen = test => ({ shade: false, color: () => '#fff', part(ctx, p) { ctx.save(); ctx.globalCompositeOperation = test(p) ? 'source-over' : 'destination-out'; ctx.fillStyle = '#fff'; ctx.strokeStyle = '#fff';
    if (p.k === 'dot') { ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, TAU); ctx.fill(); } else if (p.k === 'poly') { XY.path(ctx, p.pts, true); ctx.fill(); } else { XY.path(ctx, p.pts, !!p.closed); ctx.lineWidth = p.w; ctx.stroke(); }
    ctx.restore(); return true; } });
  const MASK_SQ = maskPen(p => SQ.has(p.role) && p.k === 'poly'), MASK_CI = maskPen(p => CI.has(p.role) && p.k === 'poly' && p.fig === 'monk');
  // pixel gold leaf (device resolution, 256-unit tile): brushed, mottled, 96-px leaf seams
  const goldTile = S => XY.keep(`c45gold:${S.toFixed(3)}`, 256 * S, 256 * S, cv => { const g = cv.getContext('2d'), w = cv.width, h = cv.height, im = g.createImageData(w, h), d = im.data;
    const A = [120, 78, 18], B = [196, 148, 52], C = [246, 216, 128];
    for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) { const x = i / S, y = j / S, tx = x / 256 * TAU, ty = y / 256 * TAU;
      const n = 0.5 * Math.sin(tx * 3 + Math.sin(ty * 2) * 1.5) + 0.3 * Math.sin(ty * 5 + tx) + 0.2 * Math.sin(tx * 17 + ty * 2) * Math.sin(ty * 9);
      let f = XY.clamp(0.55 + 0.32 * n + 0.08 * (XY.hash(i, j, 45) - 0.5)), c = f < 0.5 ? A.map((v, k) => v + (B[k] - v) * f * 2) : B.map((v, k) => v + (C[k] - v) * (f - 0.5) * 2);
      const o = (j * w + i) * 4; d[o] = c[0]; d[o + 1] = c[1]; d[o + 2] = c[2]; d[o + 3] = 255; }
    g.putImageData(im, 0, 0); g.scale(S, S); g.strokeStyle = 'rgba(120,80,20,0.25)'; g.lineWidth = 1; for (let k = 0; k <= 256; k += 64) { g.beginPath(); g.moveTo(k, 0); g.lineTo(k, 256); g.moveTo(0, k); g.lineTo(256, k); g.stroke(); } });
  // pattern tiles for the robes (design 48 units): black-and-white squares in gold, and concentric circles with spirals
  const sqTile = S => K.tile('c45sq', S, 48, (g, T) => { g.fillStyle = '#D8A83A'; g.fillRect(0, 0, T, T);
    [[2, 2, 20, 12, '#1C1712'], [26, 4, 12, 18, '#F2ECDC'], [6, 20, 12, 22, '#F2ECDC'], [24, 26, 20, 10, '#1C1712'], [40, 2, 6, 14, '#B3261E'], [22, 40, 12, 6, '#2E4A8A']].forEach(([x, y, w, h, c]) => {
      g.fillStyle = c; g.fillRect(x, y, w, h); g.strokeStyle = '#F2C84E'; g.lineWidth = 1; g.strokeRect(x, y, w, h); }); });
  const ciTile = S => K.tile('c45ci', S, 48, (g, T) => { g.fillStyle = '#C8902E'; g.fillRect(0, 0, T, T);
    [[12, 12, 10, ['#F2ECDC', '#B3261E', '#2E4A8A']], [36, 30, 9, ['#2E4A8A', '#F2C84E', '#B3261E']], [14, 38, 7, ['#F2ECDC', '#6A3A8A', '#F2C84E']]].forEach(([x, y, r, cs]) => cs.forEach((c, k) => { g.fillStyle = c; g.beginPath(); g.arc(x, y, r * (1 - k * 0.32), 0, TAU); g.fill(); }));
    g.strokeStyle = '#3A2410'; g.lineWidth = 1.2; g.beginPath(); for (let k = 0; k <= 30; k++) { const a = k / 30 * TAU * 2, r = 1 + k * 0.28; g.lineTo(38 + Math.cos(a) * r, 8 + Math.sin(a) * r); } g.stroke(); });
  const spiral = (g, x, y, r, turns, dir, w, col) => { g.strokeStyle = col; g.lineWidth = w; g.beginPath(); for (let k = 0; k <= 40; k++) { const q = k / 40, a = dir * q * turns * TAU, rr = r * (1 - q * 0.9); k ? g.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr) : g.moveTo(x + rr, y); } g.stroke(); };
  // the tree of life: trunk and branches that end in spirals (static); EYES are the blinking Horus eyes
  const BR = [[600, 430, -1, 200, 0.55], [600, 470, 1, 220, -0.4], [600, 360, -1, 250, -0.2], [600, 390, 1, 260, 0.35], [600, 520, -1, 170, -0.6], [600, 320, 1, 170, -0.6], [600, 560, 1, 160, 0.5], [600, 290, -1, 150, 0.6], [600, 260, 1, 120, 0.4], [600, 600, -1, 130, 0.3], [600, 480, -1, 120, -1]];
  const EYES = [[470, 400], [740, 450], [450, 340], [770, 360], [500, 500], [700, 300], [690, 545], [560, 300]];
  const rib = (g, pts, w0, w1, fill, line) => { const P = XY.RIG.ribbon(pts, w0, w1); XY.path(g, P, true); g.fillStyle = fill; g.fill(); g.strokeStyle = line; g.lineWidth = 1.6; g.stroke(); };
  const branch = (x0, y0, dir, len, bend) => { const o = []; for (let k = 0; k <= 16; k++) { const q = k / 16; o.push(x0 + dir * len * q, y0 - 40 * q + bend * 90 * Math.sin(Math.PI * q)); }
    const ex = o[o.length - 2], ey = o[o.length - 1], R0 = 22 + len * 0.06; for (let k = 1; k <= 24; k++) { const q = k / 24, a = (dir > 0 ? Math.PI : 0) + dir * q * 1.6 * TAU, r = R0 * (1 - 0.85 * q); o.push(ex + dir * R0 + Math.cos(a) * r * dir, ey + Math.sin(a) * r); } return o; };

  XY.STYLES.klimt = {
    hits: [GONE, ARRIVE],
    post(cv, g, e) { K.punch(cv, g, e, e.procX + 180, e.groundY - 150, 1 + 0.1 * K.env(e.beat, GONE + 0.1, 0.3, 1.5)); },
    bg(g, W, H, c, S) {
      K.panelPat(g, { W, H, S }, goldTile(S), 'source-over', 1);
      const R = XY.rng(4501); for (let i = 0; i < 160; i++) { g.fillStyle = `rgba(110,60,10,${0.04 + 0.06 * R()})`; g.beginPath(); g.arc(R() * W, R() * H, 20 + R() * 90, 0, TAU); g.fill(); }
      for (let i = 0; i < 2600; i++) { g.fillStyle = R() < 0.6 ? 'rgba(255,236,160,0.6)' : 'rgba(90,50,10,0.4)'; g.fillRect(R() * W, R() * H, 1 + R(), 1 + R()); }
      // gold clouds in the sky as spirals (the Chinese cloud scroll and Klimt's spiral are the same line)
      [[220, 250, 34], [300, 230, 22], [520, 120, 30], [600, 104, 20], [820, 260, 26]].forEach(([x, y, r], k) => { for (let j = 0; j < 2; j++) spiral(g, x + j * r * 1.6, y + (j % 2) * 6, r * (1 - j * 0.3), 1.8, j % 2 ? -1 : 1, 4, ['#2A1A08', '#8A5A1A'][j]); });
      // 南海 落伽山 far off at the top right: a mosaic sea, a little island with purple bamboo (where 悟空 will fly)
      { const X = TOP[0], Y = TOP[1]; for (let k = 0; k < 60; k++) { const x = X - 130 + (k % 15) * 18, y = Y + 22 + Math.floor(k / 15) * 10; g.fillStyle = ['#2E4A8A', '#3E6AA0', '#F2ECDC', '#1E3A6A'][(k * 7) % 4]; g.fillRect(x, y, 16, 8); }
        g.fillStyle = '#5A4A2E'; g.beginPath(); g.ellipse(X, Y + 22, 60, 16, 0, Math.PI, TAU); g.fill(); g.strokeStyle = '#1C1712'; g.lineWidth = 1.6; g.stroke();
        for (let k = 0; k < 9; k++) { const x = X - 40 + k * 10; g.strokeStyle = k % 2 ? '#6A3A8A' : '#8A5AAA'; g.lineWidth = 3; g.beginPath(); g.moveTo(x, Y + 14); g.lineTo(x + 2, Y - 30 - 14 * Math.sin(k)); g.stroke(); } }
      // far hills in Klimt's landscape mosaic: little squares of olive, teal and gold
      { const hill = x => 520 - 70 * Math.max(0, Math.sin(x / 260 + 0.6)) - 26 * Math.sin(x / 90);
        for (let x = 0; x < W; x += 9) for (let y = hill(x); y < 650; y += 9) { const h = XY.hash(x, Math.floor(y), 45); g.fillStyle = ['#6A7A3A', '#3E6A5A', '#8A8A3A', '#C8A040', '#2E4A3A', '#A89A50'][Math.floor(h * 6)]; g.fillRect(x, y, 7.5, 7.5); } }
      // pines in front of the hills (trunks behind the path), their crowns a mosaic of squares
      [[300, 330], [404, 360], [760, 320], [884, 356]].forEach(([x, top], k) => { rib(g, [x, 500, x + 2, 440, x, top], 11, 6, '#5A4A32', '#2A1A08');
        for (let j = 0; j < 220; j++) { const R2 = XY.hash(j, k, 46), a = XY.hash(j, k, 47) * TAU, d = Math.sqrt(R2), cy = top + 60 + 120 * XY.hash(j, k, 48), w = 52 * (1 - (cy - top) / 260) + 10;
          g.fillStyle = ['#1E3A2E', '#2E5A3A', '#3E6A4A', '#C8A040', '#1E2A1A'][Math.floor(XY.hash(j, k, 49) * 5)]; g.fillRect(x + Math.cos(a) * d * w - 4, cy - 4, 8, 8); } });
      // the mountain road: cobbles of rectangles and circles in black, white, ochre and blue, edged in gold
      g.fillStyle = '#3A3020'; g.beginPath(); g.moveTo(0, MEAD + 8); g.bezierCurveTo(300, MEAD - 12, 800, MEAD + 12, W, MEAD - 4); g.lineTo(W, H); g.lineTo(0, H); g.fill();
      g.strokeStyle = '#F2C84E'; g.lineWidth = 2; g.beginPath(); g.moveTo(0, MEAD + 8); g.bezierCurveTo(300, MEAD - 12, 800, MEAD + 12, W, MEAD - 4); g.stroke();
      for (let i = 0; i < 420; i++) { const x = R() * W, y = MEAD + 12 + R() * (H - MEAD - 12), s = 6 + 12 * R() * (0.5 + (y - MEAD) / (H - MEAD)), c = ['#14100C', '#F2ECDC', '#C8902E', '#2E4A8A', '#8A7A5A', '#F2C84E'][Math.floor(R() * 6)];
        g.fillStyle = c; if (R() < 0.75) g.fillRect(x, y, s * 1.4, s * 0.8); else { g.beginPath(); g.arc(x, y, s * 0.5, 0, TAU); g.fill(); } }
      // the two highwaymen 悟空 struck down, lying on the slope beside the road, in chequered robes, their clubs dropped
      [[856, 598, 0.04], [992, 602, -0.05]].forEach(([x, y, a], k) => { g.save(); g.translate(x, y); g.rotate(a); g.scale(0.72, 0.72);
        g.save(); XY.path(g, XY.RIG.spline([-70, 4, -60, -14, 40, -16, 66, -4, 60, 10, -60, 12], true, 4), true); g.fillStyle = g.createPattern(sqTile(S), 'repeat'); g.fill(); g.restore();
        XY.path(g, XY.RIG.spline([-70, 4, -60, -14, 40, -16, 66, -4, 60, 10, -60, 12], true, 4), true); g.strokeStyle = '#1C1712'; g.lineWidth = 2; g.stroke();
        g.fillStyle = '#E8C8A8'; g.beginPath(); g.ellipse(-80, -2, 11, 10, 0, 0, TAU); g.fill(); g.stroke(); g.fillStyle = '#1C1712'; g.beginPath(); g.ellipse(-84, -8, 9, 5, 0, 0, TAU); g.fill();
        g.strokeStyle = '#5A3A1A'; g.lineWidth = 6; g.beginPath(); g.moveTo(10 + k * 20, 18); g.lineTo(90 + k * 10, 6); g.stroke(); g.restore(); });
      // the Secession plaque: black ground, gold frame, gold letters
      g.fillStyle = '#14100C'; g.fillRect(34, 34, 300, 156); g.strokeStyle = '#F2C84E'; g.lineWidth = 4; g.strokeRect(34, 34, 300, 156); g.lineWidth = 1.4; g.strokeRect(42, 42, 284, 140);
      for (let k = 0; k < 14; k++) { g.fillStyle = k % 2 ? '#F2C84E' : '#F2ECDC'; g.fillRect(48 + k * 20, 172, 10, 7); }
      g.fillStyle = '#F2C84E'; g.textBaseline = 'alphabetic'; g.font = XY.font(82, '"Lantinghei SC", "PingFang SC", sans-serif', '600'); g.fillText('再贬', 60, 122);
      g.font = XY.font(24, '"Lantinghei SC", "PingFang SC", sans-serif'); g.fillStyle = '#F2ECDC'; g.fillText('第四十五难', 62, 162);
      void c;
    },
    draw(g, e) {
      const { W, H, t, u, beat, S } = e;
      // ---- gold dust winks into four-point stars over the road and the gold
      for (let k = 0; k < 70; k++) { const a = Math.sin(t * (1.5 + 2 * XY.hash(k, 2)) + k * 3); if (a < 0.55) continue; const x = XY.hash(k, 3) * W, y = XY.hash(k, 4) * MEAD, r = 2 + 6 * (a - 0.55);
        g.fillStyle = 'rgba(255,246,200,0.95)'; g.beginPath(); g.moveTo(x - r, y); g.lineTo(x, y - r * 0.25); g.lineTo(x + r, y); g.lineTo(x, y + r * 0.25); g.closePath(); g.moveTo(x, y - r); g.lineTo(x + r * 0.25, y); g.lineTo(x, y + r); g.lineTo(x - r * 0.25, y); g.fill(); }
      // ---- the spell, the fillet, the push
      const gone = beat >= GONE, acts = { monk: { palm: K.ramp(beat, SPELL - 0.35, SPELL) * (1 - K.ramp(beat, GONE + 0.8, GONE + 1.4)) }, wukong: { shade: K.ramp(beat, SPELL, SPELL + 0.15) },
        bajie: { scratch: K.ramp(u, 0.7, 0.76) * (1 - K.ramp(u, 0.9, 0.97)) }, shaseng: { lift: K.ramp(u, 0.62, 0.68) * (1 - K.ramp(u, 0.82, 0.9)) } };
      if (gone) acts.cast = { wukong: false };
      const pain = K.ramp(beat, SPELL, SPELL + 0.1) * (gone ? 0 : 1), xf = { wukong: { dx: 2.5 * pain * Math.sin(t * 50), dy: 1.5 * pain * Math.sin(t * 37) } };
      const mh = K.at(e, 'monk.head', acts), wh = K.at(e, 'wukong.head', acts, xf);
      if (beat > SPELL - 0.3 && beat < GONE + 0.2) for (let k = 0; k < 9; k++) { const q = ((beat - (SPELL - 0.3)) * 0.7 + k / 9) % 1, x = XY.lerp(mh[0] + 10, wh[0], q), y = XY.lerp(mh[1] - 6, wh[1] - 10, q) - 40 * Math.sin(Math.PI * q);
        g.globalAlpha = Math.sin(Math.PI * q) * (beat > GONE ? 1 - (beat - GONE) / 0.2 : 1); spiral(g, x, y, 10 + 6 * Math.sin(Math.PI * q), 1.6, 1, 2.4, k % 2 ? '#F2C84E' : '#FFF2B0'); } g.globalAlpha = 1;
      // ---- the procession: realistic faces and hands, flat gold patterns on the robes
      const L = K.procLayer('c45', e, 330, 40), M = K.procLayer('c45m', e, 330, 40);
      K.drawProc(L.g, e, PEN, acts, { xf });
      [[MASK_SQ, sqTile(S)], [MASK_CI, ciTile(S)]].forEach(([mp, tile]) => { K.drawProc(M.dev() && M.design(), e, mp, acts, { xf }); K.pat(M, tile, 'source-in'); K.over(L, M, 'source-atop', 0.92); M.dev().clearRect(0, 0, M.cv.width, M.cv.height); M.design(); });
      K.put(g, L);
      if (pain > 0) { g.strokeStyle = `rgba(255,242,176,${0.6 + 0.4 * Math.sin(t * 20)})`; g.lineWidth = 4; g.beginPath(); g.arc(wh[0] - 2, wh[1] - 8, 22 + 3 * Math.sin(t * 20), Math.PI * 1.05, Math.PI * 1.95); g.stroke(); }
      // ---- 悟空 is pushed out: shrinking, tumbling, trailing gold, into the spiral at the top of the tree
      const p = XY.clamp((beat - GONE) / (ARRIVE - GONE)); if (gone && p < 1) { const c0 = XY.procWorldX(e.cell.t0 + GONE * XY.BEAT) - e.cell.x, F = K.fig(e, 'wukong', acts), ch = F.anchors.chest;
        const st = [c0 + F.x + ch[0], e.groundY + ch[1]], ep = XY.easeIO(p), sw = 110 * (1 - ep), a = ep * 4 * Math.PI, pos = [XY.lerp(st[0], TOP[0], ep) + Math.cos(a) * sw, XY.lerp(st[1], TOP[1], ep) + Math.sin(a) * sw * 0.6];
        for (let k = 1; k <= 18; k++) { const q = Math.max(0, p - k * 0.02), eq = XY.easeIO(q), s2 = 110 * (1 - eq), b2 = eq * 4 * Math.PI, x = XY.lerp(st[0], TOP[0], eq) + Math.cos(b2) * s2, y = XY.lerp(st[1], TOP[1], eq) + Math.sin(b2) * s2 * 0.6;
          g.fillStyle = `rgba(255,${210 + 30 * (k % 2)},120,${1 - k / 19})`; g.fillRect(x - 3 + 8 * XY.hash(k, 9), y - 3 + 8 * XY.hash(k, 10), 5, 5); }
        const wh0 = K.hit(beat, GONE, 2.2); if (wh0 > 0.02) for (let k = 0; k < 3; k++) { g.globalAlpha = wh0; spiral(g, st[0], st[1] - 20, 40 + 50 * k + 60 * (1 - wh0), 1.4, k % 2 ? 1 : -1, 5 - k, k % 2 ? '#FFF2B0' : '#F2C84E'); } g.globalAlpha = 1;
        const x2 = K.only('wukong'); Object.assign(x2.wukong, { s: XY.lerp(1, 0.14, ep), rot: ep * 3 * Math.PI, px: ch[0], py: ch[1], dx: pos[0] - (e.procX + F.x + ch[0]), dy: pos[1] - (e.groundY + ch[1]) });
        g.save(); g.globalAlpha = 1 - XY.smooth((p - 0.8) / 0.2); K.drawProc(g, e, PEN, Object.assign({}, acts, { cast: { wukong: true } }), { xf: x2 }); g.restore(); }
      const arr = K.hit(beat, ARRIVE, 2); if (arr > 0.02) { g.strokeStyle = `rgba(255,242,176,${arr})`; g.lineWidth = 5; for (let k = 0; k < 14; k++) { const a = k / 14 * TAU; g.beginPath(); g.moveTo(TOP[0] + Math.cos(a) * 30, TOP[1] + Math.sin(a) * 30); g.lineTo(TOP[0] + Math.cos(a) * (40 + 60 * (1 - arr)), TOP[1] + Math.sin(a) * (40 + 60 * (1 - arr))); g.stroke(); } }
      // ---- gold-leaf flakes turn over as they fall; a burst when he is sent off
      const bst = K.hit(beat, GONE, 0.8);
      for (let k = 0; k < 34; k++) { const fl = (t * (0.08 + 0.05 * XY.hash(k, 11)) + XY.hash(k, 12)) % 1, x = XY.hash(k, 13) * W + 30 * Math.sin(t + k) + (k < 14 ? (wh[0] - 600) * bst * 0.3 : 0), y = fl * H - (k < 14 ? 200 * bst : 0), sx = Math.cos(t * 3 + k);
        g.save(); g.translate(x, y); g.scale(sx, 1); g.fillStyle = sx > 0 ? '#F6D880' : '#B8862E'; if (k % 3) g.fillRect(-5, -5, 10, 10); else { g.beginPath(); g.arc(0, 0, 5, 0, TAU); g.fill(); } g.restore(); }
      // ---- entrance: gold leaf spreads in a spiral from the heart of the tree
      const rv = K.ramp(u, -0.45, 0.1); if (rv < 1) { const R0 = 1500 * XY.easeIn(rv), c = [600, 430]; g.save(); g.beginPath(); g.rect(0, 0, W, H);
        for (let k = 0; k <= 72; k++) { const a = -k / 72 * TAU, r = Math.max(0, R0 * (0.82 + 0.18 * ((k / 72 + rv * 2) % 1))); k ? g.lineTo(c[0] + Math.cos(a) * r, c[1] + Math.sin(a) * r) : g.moveTo(c[0] + r, c[1]); }
        g.closePath(); g.fillStyle = '#2A2218'; g.fill('evenodd'); g.restore(); }
    },
  };
})();
