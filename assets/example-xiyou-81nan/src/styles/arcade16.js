// 70 16-bit 街机 · 1991 年 · 灭法国难行 — a night street in 灭法国 as a side-scrolling beat-'em-up: 394×260 pixels
// (1 px = 3 design units), a parallax sky and palace behind, shopfronts with a balcony of guards and townsfolk, the inn of
// 赵寡妇 with the big chest at its door, a 灭僧令 on the notice board. The king's tally in the HUD reads 9996/10000.
// After beat 2 悟空 plucks a hair and blows: a swarm of tiny monkeys strafes the balcony both ways, and on beat 3 every
// topknot pops off at once: ALL BALD!!, the tally overflows. Pilgrims: low-res, alpha-threshold, 1px outline, night-tinted.
(() => {
  'use strict';
  const XY = window.XY, K = XY.KIT_H, { sin, cos, floor, round, PI } = Math;
  const BW = 394, BH = 260, KP = 3, GYL = 234, BAL = 150;
  const R = (g, x, y, w, h, c) => { g.fillStyle = c; g.fillRect(x, y, w, h); };
  const night = h => { const [r, g, b] = K.hex(h); return `rgb(${round(r * 0.78 + 14)},${round(g * 0.76 + 12)},${round(b * 0.8 + 40)})`; };
  const NC = {}, PEN = { color: r => NC[r] || (NC[r] = night(XY.DEFAULT_COLORS[r] || '#888888')), shade: false, fine: false };

  // ------------------------------------------------------------ far layer (wider than the frame, slides at parallax)
  const FW = BW + 220;
  const farArt = () => XY.keep('a16-far', FW, 140, cv => {
    const g = cv.getContext('2d'), sky = ['#0A0620', '#140A34', '#1E1048', '#2A165C', '#3A1E6A', '#4E2872', '#643070'];
    for (let y = 0; y < 140; y++) { const f = y / 140 * (sky.length - 1), i = floor(f), fr = f - i; R(g, 0, y, FW, 1, sky[i]); if (fr > 0.5 && i + 1 < sky.length) for (let x = y % 2; x < FW; x += 2) R(g, x, y, 1, 1, sky[i + 1]); }
    // the moon
    for (let y = -22; y <= 22; y++) for (let x = -22; x <= 22; x++) { const d = x * x + y * y; if (d <= 484) R(g, 470 + x, 44 + y, 1, 1, d > 400 ? '#E8C890' : (x + y > 6 ? '#F4E4B4' : '#FFF4D0')); }
    [[462, 38, 4], [476, 52, 3], [468, 56, 2]].forEach(([x, y, r]) => R(g, x, y, r, r, '#E0C890'));
    // the palace: three tiers of roofs, walls with lit windows, banners
    const roof = (cx, y, w) => { for (let k = 0; k < 7; k++) R(g, cx - w / 2 - (6 - k), y + k, w + 2 * (6 - k), 1, k < 2 ? '#3A2A5A' : '#24183E'); R(g, cx - w / 2 - 8, y + 6, 4, 2, '#3A2A5A'); R(g, cx + w / 2 + 4, y + 6, 4, 2, '#3A2A5A'); };
    R(g, 120, 104, 360, 36, '#1A1030'); for (let x = 130; x < 470; x += 16) R(g, x, 112, 4, 6, '#E0A040');
    roof(300, 96, 220); R(g, 220, 76, 160, 22, '#1A1030'); for (let x = 228; x < 372; x += 14) R(g, x, 82, 3, 5, '#E0A040'); roof(300, 68, 150); R(g, 250, 52, 100, 18, '#1A1030'); roof(300, 44, 90);
    R(g, 299, 30, 2, 14, '#3A2A5A'); R(g, 296, 28, 8, 3, '#E0B040');
    [[160, 1], [440, -1], [560, 1], [40, -1]].forEach(([x]) => { R(g, x, 70, 2, 70, '#2A1C44'); });
    for (let x = 0; x < FW; x += 40) { const h = 14 + (x * 7 % 23); R(g, x, 140 - h, 36, h, '#140C28'); }
  });
  const flag = (g, x, y, t, k) => { for (let i = 0; i < 12; i++) { const dy = round(2 * sin(t * 6 - i * 0.6 + k)); R(g, x + 2 + i, y + dy, 1, 8, i % 4 < 2 ? '#C02828' : '#A01C1C'); } };

  // ------------------------------------------------------------ the street block (static, transparent above the roofs)
  const SIGN = { inn: [200, 158], board: [96, 170], chest: [216, 212] };   // the chest sits inside the inn doorway, against the back wall
  const streetArt = () => XY.keep('a16-street', BW, BH, cv => {
    const g = cv.getContext('2d');
    // roofs and upper storey
    for (let k = 0; k < 10; k++) R(g, -4 + k, 92 + k, BW + 8 - 2 * k, 1, k < 2 ? '#5A4A6A' : '#3A2C48');
    for (let x = 0; x < BW; x += 6) R(g, x, 94, 3, 8, '#4A3A5A');
    R(g, 0, 102, BW, 48, '#4A2E2A'); for (let x = 0; x < BW; x += 22) R(g, x, 102, 3, 48, '#2E1C1A');
    for (let x = 8; x < BW - 20; x += 44) { R(g, x, 108, 30, 26, '#1A1018'); R(g, x + 2, 110, 26, 22, '#E8B860'); for (let s = 0; s < 26; s += 5) R(g, x + 2 + s, 110, 1, 22, '#8A5A30'); R(g, x + 2, 120, 26, 1, '#8A5A30'); }
    // balcony floor and railing (the people stand behind it)
    R(g, 0, BAL, BW, 6, '#6A4430'); R(g, 0, BAL + 6, BW, 2, '#2A1810');
    // ground storey: shopfronts, posts, the inn, the notice board, the chest
    R(g, 0, BAL + 8, BW, GYL - BAL - 8, '#3A2420'); for (let x = 0; x < BW; x += 66) { R(g, x, BAL + 8, 6, GYL - BAL - 8, '#5A3628'); R(g, x + 6, BAL + 8, 2, GYL - BAL - 8, '#2A1810'); }
    for (let x = 14; x < BW; x += 66) { R(g, x, 176, 46, 58, '#140C10'); R(g, x + 2, 178, 42, 56, '#2A1A18'); R(g, x + 22, 178, 2, 56, '#140C10'); R(g, x + 2, 196, 42, 1, '#3A2620'); }
    const [ix, iy] = SIGN.inn; R(g, ix - 2, iy - 2, 70, 18, '#1A0E08'); R(g, ix, iy, 66, 14, '#A8742C'); R(g, ix + 1, iy + 1, 64, 1, '#E0B060');
    const sg = K.kanji('赵寡妇店', 12, '#2A1408'); g.drawImage(sg, ix + 7, iy + 1);
    const [bx, by] = SIGN.board; R(g, bx - 2, by - 2, 44, 40, '#2A1810'); R(g, bx, by, 40, 36, '#E8D8B0'); R(g, bx, by, 40, 8, '#C03028');
    g.drawImage(K.kanji('灭僧令', 8, '#F8F0E0'), bx + 6, by - 1); R(g, bx + 14, by + 12, 12, 12, '#E8C098'); R(g, bx + 13, by + 11, 14, 1, '#2A1810');
    for (let k = 0; k < 14; k++) { R(g, bx + 12 + k, by + 10 + k, 2, 2, '#C03028'); R(g, bx + 26 - k, by + 10 + k, 2, 2, '#C03028'); }
    K.pixText(g, '9996', bx + 8, by + 28, 1, '#2A1810');
    const [cx, cy] = SIGN.chest; R(g, cx - 1, cy - 1, 38, 22, '#1A0C06'); R(g, cx, cy, 36, 20, '#6A4420'); R(g, cx, cy, 36, 4, '#8A5A2C'); R(g, cx, cy + 4, 36, 1, '#2A1408');
    for (let k = 0; k < 36; k += 12) R(g, cx + k, cy, 2, 20, '#4A2C10'); R(g, cx + 16, cy + 6, 4, 4, '#C09030');
    // street: stone slabs, gold top line
    R(g, 0, GYL, BW, BH - GYL, '#3A3448'); for (let y = GYL + 1, r = 0; y < BH; y += 7, r++) { R(g, 0, y + 6, BW, 1, '#22202E'); for (let x = r % 2 ? 0 : 14; x < BW; x += 28) R(g, x, y, 1, 6, '#22202E'); R(g, 0, y, BW, 1, '#4E4860'); }
    R(g, 0, GYL, BW, 1, '#E8B040');
  });

  // ------------------------------------------------------------ balcony people: guards (helmet + spear), townsfolk (topknot), officials (cap)
  const NPCS = [[18, 'g'], [60, 't'], [102, 'g'], [144, 'o'], [186, 't'], [228, 'g'], [270, 't'], [312, 'o'], [354, 'g']];
  const BODY = { g: ['#B02828', '#D8B040'], t: ['#2E52A0', '#5A7AC8'], o: ['#2E7A4A', '#C8A040'] }, HAIR = { g: '#9494AC', t: '#140C10', o: '#140C10' };
  const npc = (g, x, ty, t, k, bald, pop) => {
    const bob = floor(t * 2 + k * 0.7) % 2, y = 120 + bob, [c1, c2] = BODY[ty];
    if (ty === 'g') { R(g, x + 15, 100, 1, 50, '#6A5A4A'); R(g, x + 14, 96, 3, 5, '#D8D8E8'); }
    R(g, x, y + 14, 16, 22, c1); R(g, x, y + 14, 16, 2, c2); R(g, x + 7, y + 16, 2, 16, c2);
    R(g, x + 3, y + 2, 10, 11, '#F0C090'); R(g, x + 5, y + 6, 1, 2, '#000'); R(g, x + 9, y + 6, 1, 2, '#000'); if (ty !== 't') R(g, x + 5, y + 10, 6, 1, '#4A2A1A');
    if (!bald) {
      if (ty === 'g') { R(g, x + 2, y - 1, 12, 5, HAIR.g); R(g, x + 1, y + 3, 14, 1, '#6A6A80'); R(g, x + 7, y - 4, 2, 3, '#D02020'); }
      else if (ty === 't') { R(g, x + 3, y, 10, 4, HAIR.t); R(g, x + 6, y - 4, 4, 4, HAIR.t); R(g, x + 7, y - 5, 2, 1, '#C8A040'); }
      else { R(g, x + 2, y - 2, 12, 6, HAIR.o); R(g, x - 2, y, 4, 2, HAIR.o); R(g, x + 14, y, 4, 2, HAIR.o); }
      return; }
    R(g, x + 3, y, 10, 3, '#F8D0A0'); R(g, x + 5, y, 3, 1, '#FFFFFF');
    if (floor(t * 8 + k) % 3 === 0) { R(g, x + 11, y - 5, 1, 5, '#FFFFFF'); R(g, x + 9, y - 3, 5, 1, '#FFFFFF'); }
    const hf = floor(t * 6 + k) % 2; R(g, x - 1, y + 2 + hf, 3, 3, '#F0C090'); R(g, x + 14, y + 3 - hf, 3, 3, '#F0C090');
    if (pop < 0.9) for (let j = 0; j < 3; j++) { const dir = (j - 1) + (k % 2 ? 0.3 : -0.3), hx = round(x + 4 + dir * 34 * pop), hy = round(y - 4 - (110 + 30 * j) * pop + 200 * pop * pop);   // hair sprays off in big chunks
      R(g, hx, hy, 9 - j, 8 - j * 2, HAIR[ty]); R(g, hx, hy, 9 - j, 1, ty === 'g' ? '#C8C8DC' : '#3A2A30'); if (ty === 'g' && j === 0) R(g, hx + 3, hy - 3, 3, 3, '#D02020'); if (ty === 't' && j === 0) R(g, hx + 2, hy - 2, 4, 2, '#C8A040'); }
  };
  // a hair-clone monkey (8×7): round head with a face and ears, gold band, body, curling tail, a glinting razor out front
  const monkey = (g, x, y, f, d) => { const X = (dx, w) => d > 0 ? x + dx : x + 7 - dx - w + 1;
    R(g, X(1, 4), y + 3, 4, 3, '#8A5428'); R(g, X(3, 4), y, 4, 4, '#A86A34'); R(g, X(4, 3), y + 1, 3, 3, '#F0C090'); R(g, X(5, 1), y + 2, 1, 1, '#000'); R(g, X(2, 1), y, 1, 1, '#A86A34');
    R(g, X(3, 4), y, 4, 1, '#E8B040'); R(g, X(0, 1), y + 2 - f, 1, 3, '#8A5428'); R(g, X(1, 1), y + 6, 1, 1, '#8A5428'); R(g, X(4, 1), y + 6, 1, 1, '#8A5428');
    if (f) R(g, X(8, 2), y + 3, 2, 1, '#FFFFFF'); };
  const portrait = (g, x, y) => { R(g, x, y, 12, 12, '#A86A34'); R(g, x + 3, y + 4, 8, 7, '#F0C090'); R(g, x + 4, y + 6, 1, 1, '#000'); R(g, x + 8, y + 6, 1, 1, '#000'); R(g, x, y + 2, 12, 2, '#E8B040'); R(g, x + 5, y + 9, 3, 1, '#8A3A20'); };

  // ------------------------------------------------------------ the cell
  const SW0 = 0.4, POP = 0.5, SHINE = 0.575, SPD = 2600, HD = {}, ALERT = 0.22;
  const headAt = c => HD[c.n] || (HD[c.n] = (() => { const t = c.t0 + SW0 * c.dur, a = XY.anchor('wukong.head', XY.walkPhase(t), {}); return [(XY.procWorldX(t) - c.x + a[0]) / KP, (XY.LAYOUT.GROUND + a[1]) / KP]; })());
  XY.STYLES.arcade16 = {
    hits: [4, 4.6],
    post(canvas, g, e) { K.zoomPost(canvas, g, e, BW * KP / 2, 128 * KP, K.push(e.beat, 3.85, 6.0, 0.1)); },
    draw(g, e) {
      const { W, H, t, u } = e, gy = e.groundY, S = e.S, F = XY.scratch('a16-frame', BW, BH), f = F.getContext('2d');
      // parallax sky and palace, flags, a cloud passing the moon
      const off = round(XY.clamp(e.procX / KP, -40, 520) * 0.3); f.drawImage(farArt(), -160 + Math.min(160, off), 0);
      [[150, 70, 0], [430, 70, 1.3], [-10, 70, 2.1]].forEach(([x, y, k]) => flag(f, x - 160 + Math.min(160, off), y, t, k));
      { const cx = ((floor(t * 10) - 60) % (BW + 80) + BW + 80) % (BW + 80) - 60; R(f, cx, 46, 44, 5, '#2A1A48'); R(f, cx + 8, 42, 24, 4, '#2A1A48'); R(f, cx + 4, 51, 30, 2, '#3A2A5A'); }
      f.drawImage(streetArt(), 0, 0);
      const bald = u >= POP;
      NPCS.forEach(([x, ty], k) => npc(f, x, ty, t, k, bald, (u - POP) * e.cell.dur));
      if (u >= POP && u < POP + 0.04) { const r = round(10 + (u - POP) / 0.04 * 14); NPCS.forEach(([x]) => { for (let a = 0; a < 6; a++) { const an = PI + a * PI / 5; R(f, round(x + 7 + cos(an) * r), round(116 + sin(an) * r * 0.9), 3, 3, '#FFFFFF'); } }); }
      if (u >= SHINE && u < SHINE + 0.03) NPCS.forEach(([x]) => { R(f, x + 2, 119, 12, 5, '#FFFFFF'); R(f, x + 7, 108, 2, 8, '#FFFFFF'); R(f, x + 1, 113, 14, 2, '#FFFFFF'); });   // every bald head flashes at once
      // the guards spot the strangers: a red "!" over three of them, the life bar blinks
      if (u > ALERT && u < SW0) [0, 2, 5].forEach(k => { if (floor(t * 8 + k) % 3) K.pixText(f, '!', NPCS[k][0] + 6, 104, 2, '#FF3030', '#000'); });
      R(f, 0, 140, BW, 2, '#9A6A44'); for (let x = 0; x < BW; x += 8) R(f, x, 142, 2, 8, '#7A4E32');
      // lanterns under the eaves and their light on the street
      [40, 128, 216, 304].forEach((lx, k) => { const sw = round(2 * sin(t * 2 + k)); R(f, lx + sw, 102, 1, 6, '#2A1810'); R(f, lx - 4 + sw, 108, 9, 12, '#D83020'); R(f, lx - 4 + sw, 108, 9, 1, '#F0C040'); R(f, lx - 4 + sw, 119, 9, 1, '#F0C040');
        R(f, lx - 1 + sw, 111, 3, 5, (floor(t * 7) + k) % 3 ? '#FFD870' : '#FFA040');
        f.save(); f.globalCompositeOperation = 'lighter'; f.globalAlpha = 0.07; f.fillStyle = '#FFB060'; f.beginPath(); f.moveTo(lx + sw, 120); f.lineTo(lx - 36, GYL); f.lineTo(lx + 36, GYL); f.fill(); f.restore(); });
      // 悟空 plucks a hair and blows: the swarm of little monkeys strafes the balcony both ways
      const [sx, sy] = headAt(e.cell);
      if (u > SW0 - 0.02 && u < SW0 + 0.03) { const q = (u - SW0 + 0.02) / 0.05; for (let k = 0; k < 6; k++) R(f, round(sx + 4 + q * 14 + k * 2), round(sy - 6 - q * 6 + (k % 3) * 2), 3, 2, '#F0F0F8'); }
      for (let i = 0; i < 56; i++) { const dir = i % 2 ? 1 : -1, uu = u - SW0 - XY.hash(i, 1) * 0.04; if (uu < 0 || uu > 0.12) continue;
        const x = round(sx + dir * uu * SPD * (0.75 + 0.5 * XY.hash(i, 2))), y = round(XY.lerp(sy, 112 + 34 * XY.hash(i, 3), XY.clamp(uu / 0.025)) + 2 * sin(t * 40 + i));
        if (x > -10 && x < BW + 10) monkey(f, x, y, floor(t * 20 + i) % 2, dir); }
      if (u > 0.78 && u < 0.9) { const q = (u - 0.78) / 0.12, [hx, hy] = headAt(e.cell), px0 = (e.procX + 245) / KP; for (let i = 0; i < 18; i++) { const sx0 = 10 + XY.hash(i, 5) * (BW - 20), x = round(XY.lerp(sx0, px0 + 4, XY.easeIn(q))), y = round(XY.lerp(112 + 30 * XY.hash(i, 6), (gy - 120) / KP, XY.easeIn(q)) - 30 * sin(q * PI));
        if (q < 0.97) monkey(f, x, y, floor(t * 20 + i) % 2, x < px0 ? 1 : -1); } }   // the hair-clones fly home
      this.pilgrims(f, e);
      this.hud(f, e, bald);
      K.blit(g, F, 0, 0, BW * KP, BH * KP);
      g.save(); g.setTransform(1, 0, 0, 1, 0, 0); const Wd = Math.round(W * S), Hd = Math.round(H * S);
      g.drawImage(XY.keep(`a16-scan:${Wd}x${Hd}:${S.toFixed(3)}`, Wd, Hd, cv => { const c = cv.getContext('2d'); c.fillStyle = 'rgba(0,0,0,0.22)'; for (let y = 0; y < Hd; y += KP * S) c.fillRect(0, y + KP * S * 0.66, Wd, KP * S * 0.34); }), 0, 0);
      g.restore();
    },
    pilgrims(f, e) {
      const { u } = e, gy = e.groundY, PX = floor((e.procX - 410) / KP), PY = floor((gy - 300) / KP);
      if (PX > BW + 4 || PX + 262 < -4) return;
      const acts = { wukong: { shade: K.win(u, 0.35, 0.43, 0.025), raise: K.win(u, 0.55, 0.75, 0.04) }, monk: { palm: K.win(u, ALERT, 0.48, 0.05) }, bajie: { scratch: K.win(u, 0.55, 0.9, 0.05) }, shaseng: { lift: K.win(u, 0.5, 0.58, 0.025) } };
      const phq = round(e.phase * 12) / 12, pc = K.cpu('a16-proc', 262, 112), pg = pc.getContext('2d'); pg.setTransform(1 / KP, 0, 0, 1 / KP, -PX, -PY);
      XY.drawProcession(pg, phq, e.procX, gy, PEN, acts); K.spriteize(pc, null, [16, 8, 24]); f.drawImage(pc, PX, PY);
      const eye = (k, dx, dy) => { const p = XY.anchor(k, phq, acts); R(f, floor((e.procX + p[0] + dx) / KP), floor((gy + p[1] + dy) / KP), 1, 1, '#000'); };
      eye('wukong.head', 11, -4); eye('bajie.head', 10, -6); eye('shaseng.head', 9, -3);
    },
    // HUD: 1P portrait and life bar, 第70难, 灭法, the king's tally; attract mode, READY/GO, the ALL BALD banner
    hud(f, e, bald) {
      const { u, t } = e, mid = s => round(BW / 2 - K.pixW(s, 3) / 2);
      R(f, 0, 0, BW, 32, '#000'); R(f, 0, 32, BW, 1, '#5A4A8A');
      portrait(f, 5, 5); K.pixText(f, '1P', 21, 4, 1, '#FFE040');
      R(f, 34, 4, 84, 8, '#FFFFFF'); R(f, 35, 5, 82, 6, '#600000'); R(f, 35, 5, 82, 6, '#F8D020'); R(f, 35, 5, 82, 2, '#FFF080');
      f.drawImage(K.kanji('第70难', 12, '#FFFFFF'), 20, 16);
      const T = K.kanji('灭法', 18, '#FFD040'), Ts = K.kanji('灭法', 18, '#A01818'); f.drawImage(Ts, round(BW / 2 - T.width / 2) + 1, 7); f.drawImage(T, round(BW / 2 - T.width / 2), 6);
      f.drawImage(K.kanji('斩僧', 10, '#FFFFFF'), 252, 3);
      K.pixText(f, bald ? '99999' : '9996/10000', 278, 5, 1, bald && floor(t * 10) % 2 ? '#FF4040' : '#FFFFFF');
      f.drawImage(K.kanji(bald ? '满城光头' : '还差 4 个', 10, bald ? '#FFE040' : '#FF8080'), 278, 18);
      if (u < -0.02) { if (floor(t * 2.5) % 2) K.pixText(f, 'INSERT COIN', round(BW / 2 - K.pixW('INSERT COIN', 2) / 2), 70, 2, '#FFE040', '#A01818'); K.pixText(f, 'CREDIT 0', BW - 56, BH - 12, 1, '#FFFFFF'); }
      else if (u < 0.08) K.pixText(f, 'READY', mid('READY'), 70, 3, '#FFFFFF', '#2040C0');
      else if (u < 0.16) { if (floor(t * 12) % 2) K.pixText(f, 'GO!!', mid('GO!!'), 70, 3, '#FFE040', '#C02020'); }
      if (u > ALERT && u < SW0 && floor(t * 8) % 2) R(f, 35, 5, 82, 6, '#FF4040');
      if (u >= POP && u < POP + 0.2) { const sh = floor(t * 30) % 2 ? 1 : -1; K.pixText(f, 'ALL BALD!!', mid('ALL BALD!!') + sh, 62, 3, ['#FFE040', '#FF6040', '#FFFFFF'][floor(t * 12) % 3], '#000'); }
    },
  };
})();
