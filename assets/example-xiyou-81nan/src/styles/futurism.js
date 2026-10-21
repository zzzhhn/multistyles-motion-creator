// 47 未来主义 · 1912 年 · 路阻火焰山（8 拍）— Balla/Boccioni: the sky radiates from a prismatic sun, the 800-li fire mountain throws
// its flames as nested zigzag tongues in doubled views, the pilgrims drag chronophotographic after-images. A hot gust flattens
// the flames on 2.6; the cake seller by his red cart tosses a red-hot 糕 on 3.5, it lands in Wukong's hand on 4 and hops from
// hand to hand every half beat with an ever bigger 「热！」; on 5.5 he flings it into the mountain and on 6 the fire erupts
// (第五十九回: 「热！热！热！难吃，难吃！」).
(() => {
  'use strict';
  const XY = window.XY, TAU = XY.TAU, K = () => XY.KIT_F;
  const C = { yel: '#F2C230', org: '#E8641C', red: '#C8231C', crim: '#7A1410', blk: '#1A1410', cream: '#F2E6CC', cob: '#3A4A8A', ochre: '#C88A3A' };
  const SUN = [1170, 170], ERUPT = [800, 300];
  const PEAKS = [[110, 250, 1.5], [330, 360, 1.25], [560, 300, 1.4], [800, 420, 1.15], [1040, 330, 1.35], [1300, 390, 1.2]];
  const ridge = x => { let y = 0; for (const [px, h, s] of PEAKS) y = Math.max(y, h - Math.abs(x - px) * s); return 702 - Math.max(40, y); };
  const poly = (g, pts) => { g.beginPath(); g.moveTo(pts[0][0], pts[0][1]); for (let k = 1; k < pts.length; k++) g.lineTo(pts[k][0], pts[k][1]); g.closePath(); };
  const PEN = { outline: C.blk, ow: 1.6, seed: 47,
    color: r => ({ fur: '#8A3A12', face: '#F2C27A', wkshirt: '#D8301C', tiger: '#F29A1C', stripe: C.blk, gold: C.yel, staff: '#B3261E', ink: C.blk, horse: C.cream, horse2: '#D8C8A8', mane: '#F6EEDA',
      hoof: C.blk, saddle: C.crim, red: C.red, robe: '#F2B030', kasaya: C.red, skin: '#F2CDA0', metal: '#E8B030', bjrobe: '#2A2A3A', bjpants: '#1E1E2A', pig: '#F2A890', pig2: '#D88870',
      wood: '#7A3A1A', ssrobe: C.cob, ssrobe2: '#2A3A6A', skin2: '#C88A5A', ssh: C.red, ssbeard: '#9A2A1A', skull: C.cream, bundle: '#E8A030' })[r] || C.org };
  const SIL = col => ({ color: () => col, shade: false, fine: false });
  // slanted heavy type with speed streaks trailing to the left (parole in libertà)
  const speedWord = (g, txt, x, y, px, col, skew, streak, font) => {
    g.save(); g.translate(x, y); g.transform(1, 0, -skew, 1, 0, 0); g.font = font || XY.font(px, XY.cnFont.hei, '900'); g.textBaseline = 'alphabetic';
    const w = g.measureText(txt).width;
    if (streak) { g.fillStyle = col; for (let k = 0; k < 6; k++) { const yy = -px * (0.12 + k * 0.13), l = streak * (0.4 + 0.6 * XY.hash(k, px | 0)); g.globalAlpha = 0.5 - k * 0.05; g.fillRect(-l - 8, yy, l, Math.max(2, px * 0.035)); } g.globalAlpha = 1; }
    g.lineJoin = 'round'; g.strokeStyle = C.blk; g.lineWidth = Math.max(3, px * 0.07); g.strokeText(txt, 0, 0); g.fillStyle = col; g.fillText(txt, 0, 0);
    g.restore(); return w; };

  // the cake seller and his red cart (Wukong's hot 糕); arm angle a (0 = down on the handle, 1 = thrown overhead)
  const seller = (g, x, y, a, t, alpha, solid) => {
    g.save(); g.globalAlpha = alpha; g.translate(x, y);
    const fill = c => (solid || c);
    // cart: red box on two spoked wheels, handles toward the seller
    g.fillStyle = fill(C.red); poly(g, [[-150, -96], [10, -96], [0, -40], [-140, -40]]); g.fill(); g.strokeStyle = C.blk; g.lineWidth = 3; g.stroke();
    g.fillStyle = fill(C.crim); poly(g, [[-150, -96], [10, -96], [16, -108], [-144, -108]]); g.fill();
    g.strokeStyle = fill(C.blk); g.lineWidth = 5; g.beginPath(); g.moveTo(0, -60); g.lineTo(52, -70); g.stroke();
    [-112, -34].forEach((wx, j) => { g.strokeStyle = fill(C.blk); g.lineWidth = 4; g.beginPath(); g.arc(wx, -24, 22, 0, TAU); g.stroke();
      for (let s = 0; s < 6; s++) { const q = s / 6 * Math.PI - t * 9 + j; g.lineWidth = 2; g.beginPath(); g.moveTo(wx + Math.cos(q) * 22, -24 + Math.sin(q) * 22); g.lineTo(wx - Math.cos(q) * 22, -24 - Math.sin(q) * 22); g.stroke(); } });
    // the stack of glowing cakes on the cart
    for (let k = 0; k < 4; k++) { g.fillStyle = fill(k % 2 ? C.org : C.yel); g.beginPath(); g.ellipse(-100 + k * 26, -112 - (k % 2) * 6, 14, 6, 0, 0, TAU); g.fill(); }
    // the seller: conical straw hat, cylinder body, cone skirt, facing left; throwing arm swings up
    g.fillStyle = fill(C.cob); poly(g, [[46, -150], [80, -150], [88, -40], [40, -40]]); g.fill();
    g.fillStyle = fill(C.ochre); poly(g, [[38, -60], [92, -60], [100, 0], [30, 0]]); g.fill();
    g.fillStyle = fill('#F2CDA0'); g.beginPath(); g.arc(62, -168, 15, 0, TAU); g.fill();
    g.fillStyle = fill(C.yel); poly(g, [[28, -172], [62, -204], [98, -172]]); g.fill(); g.strokeStyle = C.blk; g.lineWidth = 2.5; g.stroke();
    const sh = [52, -140], ang = XY.lerp(2.2, -0.6, a), el = [sh[0] + Math.cos(ang) * 30, sh[1] + Math.sin(ang) * 30], hd = [el[0] + Math.cos(ang - 0.4) * 28, el[1] + Math.sin(ang - 0.4) * 28];
    g.strokeStyle = fill(C.cob); g.lineWidth = 9; g.lineCap = 'round'; g.beginPath(); g.moveTo(sh[0], sh[1]); g.lineTo(el[0], el[1]); g.lineTo(hd[0], hd[1]); g.stroke();
    g.restore(); return [x + hd[0], y + hd[1]];
  };
  const cake = (g, x, y, r, al) => { g.globalAlpha = al; const gr = g.createRadialGradient(x - r * 0.2, y - r * 0.3, 1, x, y, r);
    gr.addColorStop(0, '#FFF6C8'); gr.addColorStop(0.45, C.yel); gr.addColorStop(0.8, C.org); gr.addColorStop(1, C.red); g.fillStyle = gr;
    g.beginPath(); g.ellipse(x, y, r, r * 0.62, 0, 0, TAU); g.fill(); g.globalAlpha = 1; };

  XY.STYLES.futurism = {
    bg(g, W, H) {
      const R = XY.rng(4701);
      g.fillStyle = C.org; g.fillRect(0, 0, W, H);
      // sky: wedges radiating from the sun, interpenetrating colour planes
      const cols = [C.yel, C.org, C.cream, C.red, C.org, C.yel, C.crim, C.cob];
      for (let k = 0; k < 40; k++) { const a0 = Math.PI * 0.45 + k / 40 * Math.PI * 1.25 + (R() - 0.5) * 0.05, a1 = a0 + Math.PI * 1.25 / 40 * (0.8 + R() * 0.7);
        g.fillStyle = cols[k % 8 === 7 && R() < 0.6 ? 7 : Math.floor(R() * 7)]; g.globalAlpha = 0.55 + R() * 0.45;
        g.beginPath(); g.moveTo(SUN[0], SUN[1]); g.lineTo(SUN[0] + Math.cos(a0) * 2200, SUN[1] + Math.sin(a0) * 2200); g.lineTo(SUN[0] + Math.cos(a1) * 2200, SUN[1] + Math.sin(a1) * 2200); g.fill(); }
      g.globalAlpha = 1;
      // interpenetrating diagonal bands (Balla's iridescent interpenetration)
      for (let k = 0; k < 9; k++) { const x0 = -200 + k * 190, c1 = k % 2 ? 'rgba(242,230,204,0.22)' : 'rgba(122,20,16,0.18)'; g.fillStyle = c1; poly(g, [[x0, 0], [x0 + 70, 0], [x0 + 330, 702], [x0 + 260, 702]]); g.fill(); }
      // the mountain: faceted peaks, light flank toward the sun, dark flank away
      PEAKS.forEach(([px, h, s], j) => { const top = [px, 702 - h], hw = h / s;
        g.fillStyle = j % 2 ? C.crim : '#9A1C12'; poly(g, [[px - hw, 702], top, [px, 702]]); g.fill();
        g.fillStyle = j % 2 ? C.red : '#B8281A'; poly(g, [top, [px + hw, 702], [px, 702]]); g.fill();
        for (let f = 0; f < 4; f++) { const q = 0.2 + f * 0.2; g.fillStyle = f % 2 ? 'rgba(242,194,48,0.35)' : 'rgba(26,20,16,0.25)';
          poly(g, [[XY.lerp(top[0], px - hw, q), XY.lerp(top[1], 702, q)], [XY.lerp(top[0], px + hw, q + 0.1), XY.lerp(top[1], 702, q + 0.1)], [px + (R() - 0.5) * 40, 702]]); g.fill(); } });
      g.strokeStyle = C.blk; g.lineWidth = 3; g.beginPath(); for (let x = 0; x <= W; x += 6) { const y = ridge(x); x ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke();
      // baked, cracked ground
      g.fillStyle = '#5A1A10'; g.fillRect(0, 702, W, H - 702); g.fillStyle = C.blk; g.fillRect(0, 700, W, 5);
      g.strokeStyle = 'rgba(242,154,28,0.55)'; g.lineWidth = 2;
      for (let k = 0; k < 60; k++) { let x = R() * W, y = 712 + R() * 60; g.beginPath(); g.moveTo(x, y); for (let s = 0; s < 4; s++) { x += (R() - 0.3) * 40; y += (R() - 0.5) * 14; g.lineTo(x, Math.min(H - 4, Math.max(708, y))); } g.stroke(); }
      for (let k = 0; k < 14; k++) { const x = R() * W; g.fillStyle = k % 2 ? 'rgba(242,194,48,0.25)' : 'rgba(26,20,16,0.3)'; poly(g, [[x, 705], [x + 120 + R() * 80, 705], [x + 60 + R() * 140, H]]); g.fill(); }
      g.strokeStyle = C.blk; g.lineWidth = 8; g.strokeRect(4, 4, W - 8, H - 8);
    },
    draw(g, e) {
      const { W, H, t, u, beat } = e, k = K(), cell = e.cell, st12 = k.step(t, 12), tq = st12 / 12;
      // ---- the prismatic sun: concentric arcs turning against each other
      const ring = [C.cream, C.yel, C.org, C.red, C.cob, C.yel, C.crim, C.cream];
      for (let j = 7; j >= 0; j--) { const r = 28 + j * 24, a0 = t * (0.5 + 0.22 * j) * (j % 2 ? 1 : -1) + j;
        g.strokeStyle = ring[j]; g.lineWidth = 18; g.beginPath(); g.arc(SUN[0], SUN[1], r, a0, a0 + Math.PI * (1.25 + 0.08 * j)); g.stroke(); }
      g.fillStyle = '#FFF6C8'; g.beginPath(); g.arc(SUN[0], SUN[1], 22, 0, TAU); g.fill();
      // ---- lines of force sweeping up over the mountain
      g.save(); g.lineCap = 'butt';
      for (let j = 0; j < 6; j++) { g.strokeStyle = j % 2 ? 'rgba(242,230,204,0.4)' : 'rgba(122,20,16,0.35)'; g.lineWidth = 10 + 6 * (j % 3); g.setLineDash([150, 26]); g.lineDashOffset = -t * (220 + 40 * j);
        g.beginPath(); g.moveTo(-60 + j * 150, 700); g.quadraticCurveTo(300 + j * 170, 260 - j * 20, 760 + j * 140, 40 + j * 30); g.stroke(); }
      g.restore();
      // ---- flames on the ridge: zigzag tongues (red / orange / yellow nested) flickering at 12 fps, each doubled in a
      //      second, shifted view; small chevron sparks climb out of them
      // the fire smoulders while the cell waits, roars up as the pilgrims arrive, is fanned flat by a gust on 2.6, and erupts on 6
      //      when Wukong flings the cake into it
      const ign = 0.45 + 0.55 * XY.smooth((beat + 1) / 2.2), erQ = beat < 6 ? 0 : 1 - XY.smooth((beat - 6.6) / 1.6), flare = ign * (1 + 0.15 * k.hitDecay(beat, 4, 0.6)) * (1 - 0.45 * erQ), gust = k.pulse(beat, 2.7, 0.8);
      const tongue = (x, base, w, h, lean, seed, col) => { const pts = [[x - w, base]], n = 5;
        for (let s = 1; s < n; s++) { const q = s / n, j = (XY.hash(st12, seed, s) - 0.5) * w * 0.5; pts.push([x - w * (1 - q) + lean * q * q + (s % 2 ? -w * 0.28 : w * 0.18) + j, base - h * q]); }
        pts.push([x + lean, base - h * (1 + 0.15 * XY.hash(st12, seed, 9))]);
        for (let s = n - 1; s >= 1; s--) { const q = s / n, j = (XY.hash(st12, seed, s + 20) - 0.5) * w * 0.5; pts.push([x + w * (1 - q) + lean * q * q + (s % 2 ? w * 0.28 : -w * 0.18) + j, base - h * q]); }
        pts.push([x + w, base]); g.fillStyle = col; poly(g, pts); g.fill(); };
      for (let i = 0; i < 15; i++) { const x = 30 + i * 98 + 24 * XY.hash(i, 1), base = ridge(x) + 26, h = (130 + 150 * XY.hash(i, 2)) * flare * (0.85 + 0.15 * Math.sin(t * 9 + i * 2)), w = 34 + 18 * XY.hash(i, 4), lean = 30 + 20 * Math.sin(t * 2.3 + i) - 110 * gust;
        tongue(x + 16 * Math.sin(st12 * 1.3 + i), base - 10, w * 1.05, h * 1.05, lean + 12, i + 50, 'rgba(242,230,204,0.4)');
        tongue(x, base, w, h, lean, i, C.red); tongue(x + 3, base, w * 0.72, h * 0.78, lean * 0.8, i + 100, C.org); tongue(x + 5, base, w * 0.42, h * 0.5, lean * 0.6, i + 200, C.yel);
        for (let c = 0; c < 2; c++) { const ph = (tq * 1.5 + XY.hash(i, 3) + c / 2) % 1, y = base - h - ph * 160, sw = (1 - ph) * 14 + 4, xx = x + lean + ph * 40;
          g.fillStyle = c ? C.yel : C.cream; poly(g, [[xx - sw, y], [xx, y - sw * 1.5], [xx + sw, y], [xx, y - sw * 0.6]]); g.fill(); } }
      // ---- 火焰山 in words-in-freedom type, the counter in oblique Futura numerals
      speedWord(g, '火', 54, 176, 136, C.blk, 0.22, 110); speedWord(g, '焰', 212, 150, 100, C.red, 0.3, 80); speedWord(g, '山', 318, 196, 152, C.blk, 0.18, 130);
      g.save(); g.translate(64, 262); g.transform(1, 0, -0.22, 1, 0, 0); g.fillStyle = C.blk; g.font = XY.font(36, XY.cnFont.hei, '900'); g.fillText('第', 0, 0);
      g.font = XY.font(70, 'Futura', 'bold'); g.fillStyle = C.cream; g.strokeStyle = C.blk; g.lineWidth = 5; g.strokeText('47', 42, 6); g.fillText('47', 42, 6);
      g.fillStyle = C.blk; g.font = XY.font(36, XY.cnFont.hei, '900'); g.fillText('难', 136, 0); g.restore();
      // ---- the cake seller (arm after-images first), his call 「卖糕！」 while he waits
      //      (set back behind the road, smaller, so the pilgrims pass in front of it)
      const SX = 1150, SY = 646, SS = 0.74, armA = b => XY.smooth((b - 2.8) / 0.6) * (1 - XY.smooth((b - 4.2) / 0.5)) + 0.6 * k.pulse(b, 6.9, 0.5) + 0.6 * k.pulse(b, 7.7, 0.4);
      const sellerAt = (a, al, solid) => { g.save(); g.translate(SX, SY); g.scale(SS, SS); const h = seller(g, 0, 0, a, t, al, solid); g.restore(); return [SX + h[0] * SS, SY + h[1] * SS]; };
      [0.36, 0.2].forEach((d, j) => { if (Math.abs(armA(beat) - armA(beat - d)) > 0.02) sellerAt(armA(beat - d), 0.35 + 0.15 * j, j ? C.yel : C.crim); });
      const hand = sellerAt(armA(beat), 1);
      if (beat < 3) { const st6 = k.step(t, 6), s = 1 + 0.12 * XY.hash(st6, 9) + 0.3 * k.hitDecay(beat - Math.floor(beat), 0, 0.25); g.save(); g.translate(1110, 470); g.rotate(-0.12 + 0.06 * XY.hash(st6, 8)); g.scale(s, s);
        speedWord(g, '卖糕！', 0, 0, 46, C.cream, 0.25, 0); g.restore(); }
      for (let j = 0; j < 3; j++) { const ph = (t * 0.9 + j / 3) % 1; g.strokeStyle = `rgba(242,230,204,${0.6 * (1 - ph)})`; g.lineWidth = 3; g.beginPath();
        for (let s = 0; s <= 8; s++) { const yy = 560 - ph * 110 - s * 7, xx = 1080 + j * 26 + 7 * Math.sin(s * 1.3 + t * 6 + j); s ? g.lineTo(xx, yy) : g.moveTo(xx, yy); } g.stroke(); }
      // ---- acts: Wukong shades his eyes at the glow; the monk asks; Bajie fans his belly in the heat
      const acts = { wukong: { shade: XY.smooth((beat - 1.5) / 0.4) * (1 - XY.smooth((beat - 3.1) / 0.4)) + 0.8 * k.pulse(beat, 6.4, 0.6) }, monk: { palm: k.pulse(beat, 2.8, 0.9) }, bajie: { scratch: XY.smooth((beat - 2.6) / 0.4) * (1 - XY.smooth((beat - 6.8) / 0.5)) }, shaseng: { lift: k.pulse(beat, 2.7, 0.5) } };
      // ---- the pilgrims with three after-images taken from where they really were 0.08 / 0.16 / 0.24 s ago
      [[0.24, C.crim, 0.32], [0.16, C.red, 0.38], [0.08, C.yel, 0.45]].forEach(([dt, col, al]) => { const tp = t - dt;
        const [cv, lg] = k.layer(e, 'fut-gh'); XY.drawProcession(lg, XY.walkPhase(tp), XY.procWorldX(tp) - cell.x, e.groundY, SIL(col), acts); k.blit(g, cv, al); });
      const [cv2, l2] = k.layer(e, 'fut-main'); XY.drawProcession(l2, e.phase, e.procX, e.groundY, PEN, acts);
      // Boccioni force bands sliding through the figures
      l2.save(); l2.globalCompositeOperation = 'source-atop'; const off = (t * 260) % 120;
      for (let j = -2; j < 14; j++) { const x0 = e.procX - 420 + j * 60 + off; l2.fillStyle = j % 2 ? 'rgba(255,240,190,0.3)' : 'rgba(122,20,16,0.24)';
        poly(l2, [[x0, e.groundY - 300], [x0 + 26, e.groundY - 300], [x0 - 120, e.groundY + 8], [x0 - 146, e.groundY + 8]]); l2.fill(); }
      l2.restore(); k.blit(g, cv2);
      // ---- the hot cake: in the seller's hand from 3, thrown on 3.5, caught on 4, hopping hand to hand every half beat, flung into the mountain on 5.5
      const hN = e.at('wukong.hand', acts), hF = e.at('wukong.handFar', acts), head = e.at('wukong.head', acts);
      const arc = (a, b, s, hgt) => [XY.lerp(a[0], b[0], s), XY.lerp(a[1], b[1], s) - hgt * Math.sin(Math.PI * s)];
      const cakeAt = b => { if (b < 3) return null; if (b < 3.5) return [hand[0], hand[1] - 6];
        if (b < 4) return arc([hand[0], hand[1] - 6], hF, XY.smooth((b - 3.5) / 0.5) * 0.5 + 0.5 * ((b - 3.5) / 0.5), 150);
        if (b < 5.5) { const j = Math.floor((b - 4) / 0.5), s = (b - 4) / 0.5 - j, A = j % 2 ? hN : hF, B = j % 2 ? hF : hN; return arc([A[0], A[1] - 8], [B[0], B[1] - 8], s, 64); }
        if (b < 6) return arc([hF[0], hF[1] - 8], ERUPT, (b - 5.5) / 0.5, 200); return null; };
      for (let j = 7; j >= 0; j--) { const bb = beat - j * 0.03, p = cakeAt(bb); if (p) cake(g, p[0], p[1], (18 - j * 0.8) * (bb > 5.5 ? 1 - 0.55 * (bb - 5.5) / 0.5 : 1), j ? 0.55 - j * 0.06 : 1); }
      const cp = cakeAt(beat); if (cp && beat > 3.4 && beat < 5.5) { g.strokeStyle = C.yel; g.lineWidth = 2.5; for (let j = 0; j < 8; j++) { const a = j / 8 * TAU + t * 3, r0 = 22 + 3 * Math.sin(t * 30 + j);
        g.beginPath(); g.moveTo(cp[0] + Math.cos(a) * r0, cp[1] + Math.sin(a) * r0 * 0.7); g.lineTo(cp[0] + Math.cos(a) * (r0 + 9), cp[1] + Math.sin(a) * (r0 + 9) * 0.7); g.stroke(); } }
      // ---- 「热！热！热！」 then 「难吃！」: each burst pops on its beat, flies outward and is cut (not faded) after 0.9 beat
      [[4, '热！', 84, -2.3, C.yel], [4.5, '热！', 110, -1.45, C.cream], [5, '热！', 140, -0.75, C.yel], [5.5, '难吃！', 64, -2.0, C.cream]].forEach(([b, txt, px, ang, col]) => {
        const d = beat - b; if (d < 0 || d > 0.85) return; const s = XY.easeOut(d / 0.12), r = 70 + 150 * d;
        g.save(); g.translate(head[0] + Math.cos(ang) * r, head[1] + Math.sin(ang) * r); g.rotate(ang + Math.PI / 2 - 0.2 + (b % 1) * 0.6); g.scale(s, s);
        speedWord(g, txt, -px * 0.6, px * 0.35, px, col, 0.25, px * 1.1); g.restore(); });
      // ---- the eruption on beat 6: the cake hits the mountain and the fire answers — a pillar of nested tongues, radiating
      //      speed wedges, doubled outlines, a white flash; it falls back over two beats
      const er = beat < 6 ? 0 : XY.easeOut((beat - 6) / 0.18) * (1 - XY.smooth((beat - 6.6) / 1.6));
      if (er > 0.01) { const [ex] = ERUPT, base = ridge(ex) + 70, fh = 360 * er;
        g.save(); for (let j = 0; j < 20; j++) { const a = -Math.PI * (0.06 + 0.88 * j / 19), L = (260 + 220 * XY.hash(j, 47)) * er; g.fillStyle = j % 2 ? C.yel : C.red; g.globalAlpha = 0.8;
          poly(g, [[ex + Math.cos(a - 0.03) * 60, base - 60 + Math.sin(a - 0.03) * 60], [ex + Math.cos(a) * (60 + L), base - 60 + Math.sin(a) * (60 + L)], [ex + Math.cos(a + 0.03) * 60, base - 60 + Math.sin(a + 0.03) * 60]]); g.fill(); } g.restore();
        g.save(); g.beginPath(); g.moveTo(ex - 260, -10); for (let x = ex - 260; x <= ex + 260; x += 10) g.lineTo(x, ridge(x) + 4); g.lineTo(ex + 260, -10); g.closePath(); g.clip();
        tongue(ex - 20, base + 60, 104, fh * 1.1, 50, 900, 'rgba(242,230,204,0.6)'); tongue(ex, base + 4, 98, fh * 1.04, 30, 901, C.blk); tongue(ex, base, 88, fh, 30, 901, C.red);
        tongue(ex + 4, base, 62, fh * 0.8, 22, 902, C.org); tongue(ex + 6, base, 38, fh * 0.58, 14, 903, C.yel); tongue(ex + 8, base, 16, fh * 0.34, 8, 904, '#FFF6C8'); g.restore();
        for (let j = 0; j < 10; j++) { const a = -Math.PI * (0.1 + 0.8 * XY.hash(j, 48)), d = (40 + 300 * XY.hash(j, 49)) * XY.clamp((beat - 6) / 1.2), x = ex + Math.cos(a) * d, y = base - 30 + Math.sin(a) * d + 160 * Math.pow(XY.clamp((beat - 6) / 1.2), 2), r = 9 + 8 * XY.hash(j, 50);
          g.fillStyle = j % 2 ? C.blk : C.crim; poly(g, [[x - r, y], [x, y - r * 1.3], [x + r, y], [x, y + r * 0.5]]); g.fill(); }
        const fl = k.hitDecay(beat, 6, 0.25); if (fl > 0.02) { g.fillStyle = `rgba(255,250,225,${0.55 * fl})`; g.fillRect(0, 0, W, H); } }
      // ---- after it: Wukong's fur singed, smoke squares off his head; the seller holds up another cake 「再来一块？」
      if (beat > 6.2 && beat < 8.6) { const hd = e.at('wukong.head', acts), d = beat - 6.2;
        for (let j = 0; j < 5; j++) { const s = 8 + j * 3 + d * 5; g.save(); g.translate(hd[0] - 16 + j * 8 + 9 * Math.sin(d * 4 + j), hd[1] - 22 - d * 60 - j * 12); g.rotate(d * 2 + j); g.fillStyle = j % 2 ? C.blk : '#5A4A40'; g.fillRect(-s / 2, -s / 2, s, s); g.restore(); } }
      if (beat > 6.9) { g.save(); g.translate(1120, 470); g.rotate(-0.1); const s = XY.easeOut((beat - 6.9) / 0.15); g.scale(s, s); speedWord(g, '再来一块？', 0, 0, 40, C.cream, 0.25, 0); g.restore(); }
      e._zoom = [ERUPT[0] + 80, 520, k.push(beat, 5.9, 0.15, 0.45, 1.2)];
      g.strokeStyle = 'rgba(255,240,200,0.22)'; g.lineWidth = 2;
      for (let j = 0; j < 9; j++) { const y0 = 230 + j * 52; g.beginPath(); for (let x = 0; x <= W; x += 24) { const y = y0 + 5 * Math.sin(x / 38 + t * 5 + j * 1.7); x ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke(); }
    },
    post(canvas, g, e) { const z = e._zoom; if (z && z[2] > 0) K().postZoom(canvas, g, e, z[0], z[1], 1 + 0.15 * z[2]); },
    hits: [4, 6],
    thumb: 5.0,   // overview thumbnail: a clear frame with no in-panel push-in active
  };
})();
