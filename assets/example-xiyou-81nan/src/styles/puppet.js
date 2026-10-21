// 33 中国皮影 · 搬运车迟 — a lamp-lit cloth screen in a carved stage frame. (v10: the slope is up-stage; 悟空 lifts the cart and smashes it.) Dyed, translucent leather puppets with
// punched patterns, rivet joints and rods; the monks of 车迟国 haul a brick cart up the 夹脊双关 under a Taoist's whip.
// The puppeteer swoops the 唐僧 puppet back onto the empty saddle; on beat 3 悟空's hairs pop up as little monkey
// puppets beside every hauling monk and the overseer flips off the screen.
(() => {
  'use strict';
  const XY = window.XY, K = XY.KIT_D, TAU = XY.TAU;
  const GY = 702, LINE = '#3A1C10', HOLE = 'rgba(255,236,186,0.85)';
  const DYE = { red: 'rgba(196,48,32,0.86)', green: 'rgba(40,128,84,0.84)', amber: 'rgba(222,150,44,0.86)', indigo: 'rgba(48,66,132,0.84)', flesh: 'rgba(236,190,130,0.8)',
    black: 'rgba(40,20,12,0.92)', white: 'rgba(250,236,200,0.75)', brown: 'rgba(130,70,34,0.8)', grey: 'rgba(120,100,84,0.82)' };
  const ROLE = { horse: 'white', horse2: 'white', mane: 'amber', hoof: 'black', saddle: 'red', red: 'red', robe: 'amber', kasaya: 'red', skin: 'flesh', skin2: 'flesh', face: 'flesh',
    gold: 'amber', metal: 'amber', fur: 'amber', wkshirt: 'red', tiger: 'amber', stripe: 'black', staff: 'red', pig: 'flesh', pig2: 'red', bjrobe: 'indigo', bjpants: 'black',
    wood: 'amber', ssrobe: 'green', ssrobe2: 'indigo', ssh: 'red', ssbeard: 'black', skull: 'white', bundle: 'amber', ink: 'black' };
  // v10: the 夹脊双关 slope is pushed up-stage, above the walking band, so the pilgrims pass in front of it, not through it
  const slopeY = x => 520 - XY.clamp((x - 680) / 460) * 250;

  // punch a pattern inside a closed shape so lamp light shows through: fish-roe dots, and a cloud curl on big pieces
  const punch = (g, pts, seed) => {
    let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9; for (let k = 0; k < pts.length; k += 2) { x0 = Math.min(x0, pts[k]); x1 = Math.max(x1, pts[k]); y0 = Math.min(y0, pts[k + 1]); y1 = Math.max(y1, pts[k + 1]); }
    const A = (x1 - x0) * (y1 - y0); if (A < 420) return;
    g.save(); XY.path(g, pts, true); g.clip(); g.fillStyle = HOLE; const st = 8;
    for (let y = y0 + 5; y < y1 - 2; y += st) for (let x = x0 + ((Math.round(y / st) % 2) ? st / 2 : 0) + 4; x < x1 - 2; x += st) if (XY.hash(Math.round(x), Math.round(y), seed) < 0.5) { g.beginPath(); g.arc(x, y, 1.5, 0, TAU); g.fill(); }
    if (A > 2400) { const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, r = Math.min(x1 - x0, y1 - y0) * 0.28; g.strokeStyle = HOLE; g.lineWidth = 2.2; g.beginPath(); for (let a = 0; a < 9; a += 0.3) g.lineTo(cx + Math.cos(a) * r * (1 - a / 10), cy + Math.sin(a) * r * (1 - a / 10)); g.stroke(); }
    g.restore();
  };
  const leather = (g, pts, col, seed, lw = 2.6) => { XY.path(g, pts, true); g.fillStyle = col; g.fill(); g.strokeStyle = LINE; g.lineWidth = lw; g.stroke(); punch(g, pts, seed); };
  const rivet = (g, x, y) => { g.fillStyle = '#C9A050'; g.beginPath(); g.arc(x, y, 2.6, 0, TAU); g.fill(); g.strokeStyle = LINE; g.lineWidth = 1; g.stroke(); };
  const rod = (g, x0, y0, x1, y1) => { g.strokeStyle = 'rgba(30,14,8,0.8)'; g.lineWidth = 2.2; g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.stroke(); rivet(g, x0, y0); };
  const PEN = { outline: LINE, ow: 2.2, seed: 33, color: r => DYE[ROLE[r] || 'black'],
    part(g, p, c) { if (p.k !== 'poly') return false; XY.path(g, p.pts, true); g.fillStyle = c; g.fill(); g.strokeStyle = LINE; g.lineWidth = 2.2; g.stroke(); if (c !== DYE.black) punch(g, p.pts, p.pts.length + Math.round(p.pts[0])); return true; } };
  const cloud = (g, x, y, s) => { g.save(); g.translate(x, y); g.scale(s, s);
    leather(g, XY.RIG.spline([-40, 8, -34, -14, -12, -22, 6, -14, 22, -26, 44, -12, 40, 10], true, 4), DYE.indigo, 70 + x, 2.6 / s);
    g.strokeStyle = HOLE; g.lineWidth = 2 / s; [[-18, -4], [20, -6]].forEach(([cx, cy]) => { g.beginPath(); for (let a = 0; a < 8; a += 0.3) g.lineTo(cx + Math.cos(a) * a * 1.4, cy + Math.sin(a) * a * 1.1); g.stroke(); }); g.restore(); };

  // the static scenery puppets (city gate, pine, clouds, the slope with its two passes), painted once
  const paintSet = (g, W) => {
    const gx = 70, gy = 200;   // 车迟国 city gate
    leather(g, [gx, gy + 300, gx, gy + 110, gx + 300, gy + 110, gx + 300, gy + 300, gx + 190, gy + 300, gx + 190, gy + 200, gx + 110, gy + 200, gx + 110, gy + 300], 'rgba(150,64,40,0.78)', 7);
    for (let r = 0; r < 4; r++) for (let k = 0; k < 7; k++) { const x = gx + 8 + k * 42 + (r % 2) * 20, y = gy + 120 + r * 20; if (y > gy + 196 && x > gx + 100 && x < gx + 190) continue; g.strokeStyle = 'rgba(58,28,16,0.6)'; g.lineWidth = 1.2; g.strokeRect(x, y, 36, 16); }
    leather(g, [gx - 40, gy + 116, gx + 150, gy + 30, gx + 340, gy + 116, gx + 300, gy + 96, gx + 150, gy + 52, gx, gy + 96], DYE.black, 8);
    XY.path(g, [gx + 96, gy + 62, gx + 204, gy + 62, gx + 204, gy + 104, gx + 96, gy + 104], true); g.fillStyle = DYE.green; g.fill(); g.strokeStyle = LINE; g.lineWidth = 2.6; g.stroke();
    g.fillStyle = '#F6D98A'; g.font = XY.font(30, XY.cnFont.li, 'bold'); g.textAlign = 'center'; g.fillText('车迟国', gx + 150, gy + 95); g.textAlign = 'left';
    // a pine on the hill behind
    g.strokeStyle = LINE; g.lineWidth = 3; leather(g, [470, GY - 300, 480, GY - 300, 486, GY - 120, 464, GY - 120], DYE.brown, 11);
    [[475, GY - 330, 70], [475, GY - 280, 90], [475, GY - 230, 110]].forEach(([x, y, w], k) => leather(g, [x - w, y + 20, x, y - 24, x + w, y + 20, x + w * 0.5, y + 10, x, y + 24, x - w * 0.5, y + 10], DYE.green, 12 + k));
    cloud(g, 360, 130, 1.1); cloud(g, 640, 90, 1.3); cloud(g, 930, 150, 1);
    // 夹脊双关: the steep slope and the two gate towers astride it
    const sl = [560, GY, 640, 528]; for (let x = 680; x <= W - 20; x += 20) sl.push(x, slopeY(x)); sl.push(W - 20, GY);
    leather(g, sl, 'rgba(150,100,50,0.42)', 10);
    for (let k = 0; k < 7; k++) { const x = 700 + k * 62; g.strokeStyle = HOLE; g.lineWidth = 2; g.beginPath(); g.moveTo(x, slopeY(x) + 30); g.lineTo(x + 30, slopeY(x + 30) + 40); g.stroke(); }
    [[760, 'rgba(150,64,40,0.7)'], [1090, 'rgba(150,64,40,0.7)']].forEach(([x, c], k) => { const y = slopeY(x);
      leather(g, [x - 40, y + 4, x - 40, y - 96, x + 40, y - 96, x + 40, y + 4, x + 18, y + 4, x + 18, y - 50, x - 18, y - 50, x - 18, y + 4], c, 20 + k);
      leather(g, [x - 58, y - 92, x, y - 136, x + 58, y - 92, x + 40, y - 100, x, y - 120, x - 40, y - 100], DYE.black, 22 + k); });
  };
  const setLayer = (W, H, S, blur) => XY.cached(`kd33-set${blur ? 'b' : ''}:` + S.toFixed(4), W * S, H * S, cv => { const g = cv.getContext('2d');
    if (!blur) { g.setTransform(S, 0, 0, S, 0, 0); paintSet(g, W); return; }
    g.filter = `blur(${(7 * S).toFixed(1)}px)`; g.drawImage(setLayer(W, H, S, false), 0, 0); g.filter = 'none'; });

  // the brick cart, five hauling monks stepping at 12 fps, the Taoist overseer with his whip; on beat 3 a little
  // monkey puppet (悟空's hair) springs up beside each monk and the overseer is knocked head over heels off the screen
  // up-stage on the slope: the brick cart, four monks hauling at 12 fps, the Taoist overseer cracking his whip.
  // 4.0 a big monkey puppet (悟空) pops up beside the cart, 4.4 lifts it overhead, 5.6 smashes it: cart, wheels and bricks
  // fly apart on their rivets and drop into a heap; the overseer is knocked off the screen; the monks cheer, hair-monkeys hop.
  const CART = 790, LIFT = 4.4, SMASH = 5.6;
  const cartPieces = () => { const P = [[-74, -78, 74, -78, 78, -30, -78, -30, DYE.brown, 12]];   // [pts…, dye, seed] in cart space
    for (let r = 0; r < 3; r++) for (let k = 0; k < 6; k++) P.push([-66 + k * 22, -100 - r * 18, -48 + k * 22, -100 - r * 18, -48 + k * 22, -84 - r * 18, -66 + k * 22, -84 - r * 18, 'rgba(170,70,40,0.8)', 13 + r * 6 + k]);
    return P; };
  const PIECES = cartPieces();
  function haul(g, tq, u, bq) {
    const cy0 = slopeY(CART), ang0 = Math.atan2(slopeY(CART + 40) - slopeY(CART - 40), 80), step = Math.floor(tq * 4) % 2;
    const up = XY.smooth((bq - LIFT + 0.1) / 0.3), smash = bq >= SMASH, sp = XY.clamp((bq - SMASH) / 0.7), cheer = bq > SMASH + 0.2;
    // the monkey: rises from below the slope on its rod at 4.0, arms up with the cart from 4.4, slams it at 5.6, then hops
    const mk = XY.smooth((bq - 4.0) / 0.3), mx = CART - 70, my = slopeY(mx) + (1 - mk) * 200 - (cheer ? Math.abs(Math.sin(tq * 9)) * 16 : 0);
    const hold = [mx + 24, my - 220], slam = bq > SMASH - 0.15 && bq < SMASH ? (bq - SMASH + 0.15) / 0.15 : 0;
    // cart position: rolling on the slope → overhead → slammed down
    let cx = CART + (bq < LIFT ? 24 * XY.clamp(bq / LIFT) : 24), cy = cy0, ang = ang0;
    if (up > 0 && !smash) { cx = XY.lerp(cx, hold[0], up) + 30 * slam; cy = XY.lerp(cy0, hold[1], up) + 200 * slam * slam; ang = XY.lerp(ang0, Math.PI + 0.2 * Math.sin(tq * 6), up); }
    if (!smash) { g.save(); g.translate(cx, cy); g.rotate(ang); g.scale(1 + 0.3 * up, 1 + 0.3 * up);
      PIECES.forEach(p => leather(g, p.slice(0, 8), p[8], p[9], p[9] > 12 ? 1.6 : 2.6));
      for (const wx of [-42, 42]) { g.save(); g.translate(wx, -22); g.rotate(-bq * 0.9); leather(g, XY.ellipse(0, 0, 25, 25, 16), DYE.black, 30); g.strokeStyle = '#C9A050'; g.lineWidth = 2; for (let k = 0; k < 6; k++) { const a = k / 6 * TAU; g.beginPath(); g.moveTo(0, 0); g.lineTo(Math.cos(a) * 21, Math.sin(a) * 21); g.stroke(); } g.restore(); rivet(g, wx, -22); }
      g.restore(); }
    else {   // the pieces fly off on their rivets, spin, and drop into a heap on the slope
      const ox = CART + 10, oy = cy0 - 30;
      PIECES.concat([[0, 0, 0, 0, 0, 0, 0, 0, 'wheel', 1], [0, 0, 0, 0, 0, 0, 0, 0, 'wheel', 2]]).forEach((p, i) => {
        const h = q => XY.hash(i, q, 33), a = -Math.PI * (0.15 + 0.7 * h(1)), v = 240 + 260 * h(2), land = [ox - 150 + 300 * h(3), slopeY(ox - 150 + 300 * h(3)) - 6 - 10 * h(4)];
        const fly = XY.easeOut(XY.clamp(sp / 0.55)), drop = XY.smooth((sp - 0.55) / 0.45);
        const x = XY.lerp(ox + Math.cos(a) * v * fly, land[0], drop), y = XY.lerp(oy + Math.sin(a) * v * fly + 40 * fly * fly, land[1], drop), rot = (h(5) - 0.5) * 12 * fly * (1 - drop) + (h(6) - 0.5) * 0.6;
        g.save(); g.translate(x, y); g.rotate(rot); g.scale(1.3, 1.3);
        if (p[8] === 'wheel') { leather(g, XY.ellipse(0, 0, 25, 25, 16), DYE.black, 30 + i); rivet(g, 0, 0); }
        else { const cxp = (p[0] + p[2] + p[4] + p[6]) / 4, cyp = (p[1] + p[3] + p[5] + p[7]) / 4; leather(g, p.slice(0, 8).map((v, k) => v - (k % 2 ? cyp : cxp)), p[8], p[9], 1.6); rivet(g, 0, 0); }
        g.restore(); });
      if (sp < 0.5) { g.save(); g.globalCompositeOperation = 'screen'; const rg = g.createRadialGradient(ox, oy, 4, ox, oy, 260); rg.addColorStop(0, `rgba(255,246,210,${1 - sp * 2})`); rg.addColorStop(1, 'rgba(255,230,170,0)'); g.fillStyle = rg; g.fillRect(ox - 260, oy - 260, 520, 520); g.restore();
        g.fillStyle = `rgba(120,80,40,${0.6 * (1 - sp * 2)})`; for (let k = 0; k < 12; k++) { const a = k / 12 * TAU; g.beginPath(); g.arc(ox + Math.cos(a) * 140 * sp * 2, oy + Math.sin(a) * 70 * sp * 2, 26 * (1 - sp), 0, TAU); g.fill(); } } }
    // the hauling monks: rope to the cart while there is a cart, then arms up
    for (let i = 0; i < 4; i++) { const px = CART + 110 + i * 54, py = slopeY(px), st = (step + i) % 2, jump = cheer ? Math.abs(Math.sin(tq * 8 + i)) * 14 : 0;
      if (up === 0) { g.strokeStyle = LINE; g.lineWidth = 2; g.beginPath(); g.moveTo(i ? px - 48 : cx + 76 * Math.cos(ang), i ? slopeY(px - 54) - 46 : cy - 60 + 76 * Math.sin(ang)); g.lineTo(px - 4, py - 46); g.stroke(); }
      g.save(); g.translate(px, py - jump); g.rotate(cheer ? 0 : -0.45 + ang0);
      leather(g, [-14, -50, 12, -50, 18, -6, -18, -6], DYE.grey, 40 + i);
      g.strokeStyle = 'rgba(130,100,84,0.9)'; g.lineWidth = 7; g.lineCap = 'round'; g.beginPath(); g.moveTo(-6, -8); g.lineTo(-12 - 7 * st, 2); g.moveTo(6, -8); g.lineTo(10 + 7 * st, 2);
      if (cheer) { g.moveTo(-10, -46); g.lineTo(-22, -74); g.moveTo(10, -46); g.lineTo(22, -74); } g.stroke();
      leather(g, XY.ellipse(2, -62, 11, 12, 14), DYE.flesh, 50 + i, 2); g.fillStyle = LINE; g.beginPath(); g.arc(8, -64, 1.6, 0, TAU); g.fill();
      rivet(g, 0, -42); rivet(g, 2, -52); g.restore();
      if (bq >= 6.0) { const p = XY.clamp((bq - 6.0 - i * 0.08) / 0.25), wy = py - 100 + (1 - p) * 60 - Math.abs(Math.sin(tq * 10 + i)) * 12, wx = px + 6;   // 悟空's hairs hop up as little monkeys
        if (p > 0) { g.save(); g.translate(wx, wy); g.scale(1.3, 1.3);
          leather(g, [-8, -30, 8, -30, 10, 0, -10, 0], DYE.red, 60 + i, 1.8); leather(g, XY.ellipse(0, -40, 9, 9, 12), DYE.amber, 61 + i, 1.8);
          g.strokeStyle = '#E8B040'; g.lineWidth = 2.4; g.beginPath(); g.arc(0, -40, 9.5, Math.PI * 1.1, Math.PI * 1.9); g.stroke();
          g.strokeStyle = LINE; g.lineWidth = 3.4; g.beginPath(); g.moveTo(6, -24); g.lineTo(20, -60 + 10 * Math.sin(tq * 20 + i)); g.stroke(); g.restore(); } } }
    // the big monkey puppet with its own rod
    if (mk > 0) { g.save(); g.translate(mx, my); g.scale(2.6, 2.6);
      const arm = up > 0 && !smash ? -1 : smash ? (cheer ? -0.6 : 0.4) : 0.3;
      g.strokeStyle = 'rgba(222,150,44,0.9)'; g.lineWidth = 5; g.lineCap = 'round'; g.beginPath(); g.moveTo(-6, -26); g.lineTo(-10 + 4 * arm, -26 + 46 * arm); g.moveTo(8, -26); g.lineTo(14 - 4 * arm, -26 + 46 * arm); g.stroke();
      leather(g, [-10, -32, 10, -32, 12, 0, -12, 0], DYE.red, 70, 1.4); leather(g, [-12, -4, 12, -4, 14, 10, -14, 10], DYE.amber, 71, 1.2);
      leather(g, XY.ellipse(0, -44, 11, 11, 14), DYE.amber, 72, 1.4); g.fillStyle = 'rgba(236,190,130,0.95)'; g.beginPath(); g.ellipse(4, -43, 6, 7, 0, 0, TAU); g.fill();
      g.strokeStyle = '#E8B040'; g.lineWidth = 2.6; g.beginPath(); g.arc(0, -44, 11.5, Math.PI * 1.1, Math.PI * 1.9); g.stroke();
      g.fillStyle = LINE; g.beginPath(); g.arc(7, -45, 1.4, 0, TAU); g.fill(); rivet(g, 0, -30); g.restore();
      rod(g, mx, my - 50, mx - 40, 790); }
    // the overseer at the top of the slope: crown, beard, whip cracking; knocked head over heels off the screen by the smash
    const ox = 1112, oy = slopeY(ox), fall = Math.max(0, bq - SMASH), crack = Math.floor(tq * 6) % 2;
    g.save(); g.translate(ox + 120 * fall, oy - 160 * fall + 300 * fall * fall); g.rotate(-fall * 5);
    leather(g, [-16, -64, 16, -64, 24, -4, -24, -4], DYE.indigo, 80);
    leather(g, XY.ellipse(-2, -76, 11, 12, 14), DYE.flesh, 81, 2); leather(g, [-12, -86, 8, -86, -2, -104], DYE.black, 82, 2);
    g.fillStyle = 'rgba(40,20,12,0.9)'; g.beginPath(); g.moveTo(-10, -70); g.lineTo(-4, -46); g.lineTo(2, -70); g.fill();
    g.strokeStyle = LINE; g.lineWidth = 2; g.beginPath(); g.moveTo(-14, -56); g.lineTo(-36, -82); g.quadraticCurveTo(-90, crack ? -120 : -60, -130, crack ? -90 : -40); g.stroke();
    g.restore(); if (fall === 0) rod(g, ox, oy - 40, ox + 30, 790);
  }
  // the carved stage front: red lacquer posts, a lintel plaque with 车迟, the number on the right post
  function frame(W, H, S) {
    return XY.cached('kd33-fr:' + S.toFixed(4), W * S, H * S, cv => { const g = cv.getContext('2d'); g.setTransform(S, 0, 0, S, 0, 0);
      const wood = (x, y, w, h) => { const gr = g.createLinearGradient(x, y, x + w, y + h); gr.addColorStop(0, '#8A2A1A'); gr.addColorStop(1, '#5A1A10'); g.fillStyle = gr; g.fillRect(x, y, w, h); g.strokeStyle = '#C9A050'; g.lineWidth = 2; g.strokeRect(x + 4, y + 4, w - 8, h - 8); };
      wood(0, 0, W, 64); wood(0, 0, 34, H); wood(W - 34, 0, 34, H); wood(0, H - 24, W, 24);
      g.strokeStyle = 'rgba(201,160,80,0.75)'; g.lineWidth = 1.6; for (let x = 60; x < W - 60; x += 28) { g.strokeRect(x, 14, 18, 18); g.strokeRect(x + 4, 18, 10, 10); g.beginPath(); g.moveTo(x + 9, 32); g.lineTo(x + 9, 50); g.stroke(); }
      for (let x = 70; x < W - 60; x += 90) { g.strokeStyle = '#C9A050'; g.lineWidth = 1.4; g.beginPath(); g.moveTo(x, 64); g.lineTo(x, 84); g.stroke(); g.fillStyle = '#B8301A'; g.beginPath(); g.moveTo(x - 4, 84); g.lineTo(x + 4, 84); g.lineTo(x + 2, 100); g.lineTo(x - 2, 100); g.fill(); }
      const cx = W / 2; g.fillStyle = '#B8301A'; g.fillRect(cx - 92, 4, 184, 70); g.strokeStyle = '#E8C060'; g.lineWidth = 3; g.strokeRect(cx - 86, 9, 172, 60);
      g.fillStyle = '#F6D98A'; g.font = XY.font(50, XY.cnFont.li, 'bold'); g.textAlign = 'center'; g.textBaseline = 'alphabetic'; g.fillText('车迟', cx, 58); g.textAlign = 'left';
      g.fillStyle = '#8A2A1A'; g.fillRect(W - 86, 98, 48, 176); g.strokeStyle = '#C9A050'; g.lineWidth = 2; g.strokeRect(W - 82, 102, 40, 168); g.fillStyle = '#F6D98A';
      g.textAlign = 'center'; g.font = XY.font(28, XY.cnFont.kai, 'bold'); K.vtext(g, '第三十三难', W - 62, 130, 32); g.textAlign = 'left';
    });
  }

  XY.STYLES.puppet = {
    hits: [4.4, 5.6],
    bg(g, W, H) {
      g.fillStyle = '#1E120C'; g.fillRect(0, 0, W, H);
      const rg = g.createRadialGradient(W * 0.48, H * 0.38, 40, W * 0.5, H * 0.46, W * 0.72); rg.addColorStop(0, '#FFF2CC'); rg.addColorStop(0.45, '#F2CF8A'); rg.addColorStop(1, '#8E5A2C');
      g.fillStyle = rg; g.fillRect(0, 0, W, H);
      g.strokeStyle = 'rgba(120,80,40,0.07)'; g.lineWidth = 1; g.beginPath(); for (let x = 0; x < W; x += 4) { g.moveTo(x, 0); g.lineTo(x, H); } for (let y = 0; y < H; y += 4) { g.moveTo(0, y); g.lineTo(W, y); } g.stroke();
      K.grain(g, W, H, 33, 900, 'rgba(110,70,30,0.08)', 'rgba(255,250,230,0.1)', 3);
    },
    draw(g, e) {
      const { W, H, t, u, beat } = e, tq = K.step(t, 12), bq = K.step(beat, 12);
      // the scenery puppets press onto the screen: blurred and dim while held back, crisp once they touch the cloth
      const press = XY.smooth((u + 0.2) / 0.32);
      g.save(); g.globalCompositeOperation = 'multiply';
      if (press < 1) { g.globalAlpha = 0.75 * (1 - press); g.drawImage(setLayer(W, H, e.S, true), 0, 0, W, H); }
      g.globalAlpha = press; g.drawImage(setLayer(W, H, e.S, false), 0, 0, W, H); g.globalAlpha = 1;
      haul(g, tq, u, bq);
      g.restore();
      const acts = { wukong: { shade: K.win(beat, 1.8, 2.4) * (1 - K.win(beat, 3.2, 3.6)), raise: K.win(beat, 3.8, 4.3) * (1 - K.win(beat, 5.3, 5.6)), strike: K.win(beat, 5.3, 5.6) * (1 - K.win(beat, 6.8, 7.4)) },
        bajie: { scratch: K.win(beat, 6.4, 7) }, shaseng: { lift: K.win(beat, 2.6, 3.2) * (1 - K.win(beat, 5.8, 6.4)) }, monk: { palm: K.win(beat, 6.0, 6.6) } };
      // the puppeteer swoops 唐僧's puppet in from the upper left and seats him (beats 0–1)
      const rel = XY.smooth(beat / 1.0);
      if (rel >= 1) acts.cast = { rider: true };
      const L = K.lit(e, PEN, acts, { pad: 10 });
      g.save(); g.globalCompositeOperation = 'multiply'; g.globalAlpha = 0.28; g.filter = `blur(${(5 * e.S).toFixed(1)}px)`;
      g.setTransform(1, 0, 0, 1, 0, 0); g.drawImage(L.cv, L.X + 9 * e.S, L.Y + 6 * e.S); g.restore();
      K.put(g, L, 1, 'multiply');
      if (rel < 1) { const sb = K.sub(e, e.phase, acts, 2, 'rider', 'saddle'), x = sb.at[0] - 260 * (1 - rel), y = sb.at[1] - 440 * (1 - rel) + 60 * Math.sin(Math.PI * rel);
        g.save(); g.globalCompositeOperation = 'multiply'; K.paintSub(g, sb, PEN, x, y, 1.4 * (1 - rel), 1); g.restore(); rod(g, x + 8, y - 36, x - 140, H + 10); }
      // rods down off the screen for every figure
      [['shaseng.chest', -60], ['bajie.chest', -50], ['monk.chest', -40], ['wukong.chest', -30], ['wukong.hand', 60]].forEach(([k, dx]) => { if (k === 'monk.chest' && rel < 1) return; const p = e.at(k, acts); rod(g, p[0], p[1], p[0] + dx, H + 10); });
      // the lamp behind the screen: the whole cloth breathes with the flame
      const fl = 0.5 + 0.35 * XY.noise1(tq * 3, 7) + 0.15 * XY.noise1(tq * 9, 8), hx = W * 0.48 + 22 * XY.noise1(tq * 1.3, 2), hy = H * 0.36 + 14 * XY.noise1(tq * 1.1, 3);
      g.fillStyle = `rgba(40,20,5,${0.06 + 0.1 * (1 - fl)})`; g.fillRect(0, 0, W, H);
      const rg = g.createRadialGradient(hx, hy, 10, hx, hy, 300); rg.addColorStop(0, `rgba(255,240,200,${0.22 * fl})`); rg.addColorStop(1, 'rgba(255,220,150,0)');
      g.save(); g.globalCompositeOperation = 'screen'; g.fillStyle = rg; g.fillRect(0, 0, W, H); g.restore();
      K.zoom(g, e, CART - 40, slopeY(CART) - 130, 1 + 0.15 * K.env(beat, 4.2, 4.6, 6.0, 6.6));
      g.drawImage(frame(W, H, e.S), 0, 0, W, H);
    },
  };
})();
