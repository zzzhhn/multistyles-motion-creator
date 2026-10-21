// 50 包豪斯 · 1923 年 · 赛城扫塔（8 拍）— a Bauhaus poster: primary colours, circle/square/triangle, a single black diagonal.
// 唐僧's new broom is that diagonal: its handle runs from his hand to the 13-storey pagoda of 金光寺 standing back on the far
// ground; as the pilgrims walk on, the broom head climbs the floors and each swept floor turns from dusty grey to its primary
// colour. At floor ten the monk's back gives out (腰酸) and Wukong takes the broom for the last three; on 4.5 the 13th floor's
// door pops and 奔波儿灞 and 灞波儿奔 tumble out; on 5.3 Wukong strikes and ropes them, and they hop along ahead of him (第六十二回).
(() => {
  'use strict';
  const XY = window.XY, TAU = XY.TAU, K = () => XY.KIT_F;
  const C = { paper: '#EBE3CF', blk: '#161514', red: '#D3262B', blue: '#2A58B4', yel: '#EFC12F', grey: '#C6C3BB', cream: '#F2ECDF', lblue: '#B9CEE0', dust: '#A9A49A' };
  // the pagoda stands back on the far ground (base y 612), behind the road, so the pilgrims pass in front of it
  const TX = 780, FL = 13, FH = 31, PB = 612, TOP = PB - FL * FH;
  const fw = k => 146 - k * 7;                                   // floor width
  const fcol = k => [C.red, C.yel, C.blue, C.blk, C.yel, C.red, C.blue, C.yel, C.red, C.blk, C.blue, C.yel, C.red][k];
  const fshape = k => ['sq', 'circ', 'tri', 'sq', 'circ', 'sq', 'tri', 'circ', 'sq', 'tri', 'circ', 'sq', 'circ'][k];
  const poly = (g, pts) => { g.beginPath(); g.moveTo(pts[0][0], pts[0][1]); for (let k = 1; k < pts.length; k++) g.lineTo(pts[k][0], pts[k][1]); g.closePath(); };
  const PEN = { outline: C.blk, ow: 2, seed: 50,
    color: r => ({ fur: '#C25A14', face: C.cream, wkshirt: C.red, tiger: C.yel, stripe: C.blk, gold: C.yel, staff: C.red, ink: C.blk, horse: C.cream, horse2: C.grey, mane: C.cream, hoof: C.blk,
      saddle: C.blue, red: C.red, robe: C.yel, kasaya: C.red, skin: C.cream, metal: '#9A9890', bjrobe: C.blk, bjpants: C.blue, pig: '#F2B8B0', pig2: '#D88A80', wood: C.blk,
      ssrobe: C.blue, ssrobe2: '#1E3F84', skin2: '#E0A878', ssh: C.red, ssbeard: C.red, skull: C.cream, bundle: C.yel })[r] || C.grey };

  // one floor of the pagoda, k = 0 (ground) … 12; lit = swept (primary colour) or dusty grey; win = window colour step
  const floor = (g, k, lit, win) => {
    const w = fw(k), y = PB - (k + 1) * FH, x = TX - w / 2, col = lit ? fcol(k) : C.grey;
    g.fillStyle = col; g.fillRect(x, y, w, FH - 4); g.fillStyle = lit ? C.blk : '#8E8A80'; g.fillRect(x - 10, y + FH - 6, w + 20, 6);
    const inner = col === C.blk || col === C.blue || col === C.red ? C.cream : C.blk, cx = TX + (k % 2 ? -w * 0.22 : w * 0.22), cy = y + (FH - 4) / 2;
    g.fillStyle = lit ? inner : '#A9A49A'; const sh = fshape(k);
    if (sh === 'sq') g.fillRect(cx - 10, cy - 10, 20, 20); else if (sh === 'circ') { g.beginPath(); g.arc(cx, cy, 11, 0, TAU); g.fill(); } else poly(g, [[cx - 12, cy + 10], [cx, cy - 12], [cx + 12, cy + 10]]);
    if (sh === 'tri') g.fill();
    // a small grid of window cells that changes colour while the floor is lit (6 fps)
    for (let j = 0; j < 3; j++) { const wx = TX + (k % 2 ? 6 : -w * 0.42) + j * 13, c = lit ? [C.yel, C.red, C.blue, C.cream, C.lblue][Math.floor(XY.hash(k, j, win) * 5)] : '#B3AEA4';
      g.fillStyle = c; g.fillRect(wx, y + 8, 10, FH - 20); }
    if (!lit) { g.fillStyle = 'rgba(110,104,92,0.5)'; for (let j = 0; j < 6; j++) { g.beginPath(); g.arc(x + XY.hash(k, j, 3) * w, y + 4 + XY.hash(k, j, 4) * (FH - 12), 1.6 + XY.hash(k, j, 5) * 2, 0, TAU); g.fill(); } }
  };
  // the fish-demons: 奔波儿灞 (black circle, whiskers) and 灞波儿奔 (blue triangle), Schlemmer-style geometry
  const catfish = (g, x, y, rot) => { g.save(); g.translate(x, y); g.rotate(rot);
    g.fillStyle = C.blk; g.fillRect(-14, -6, 28, 34); g.beginPath(); g.arc(0, -22, 22, 0, TAU); g.fill();
    g.strokeStyle = C.blk; g.lineWidth = 3; g.beginPath(); g.moveTo(14, -16); g.quadraticCurveTo(40, -18, 46, -2); g.moveTo(14, -12); g.quadraticCurveTo(36, -4, 34, 12); g.stroke();
    g.fillStyle = C.cream; g.beginPath(); g.arc(8, -26, 6, 0, TAU); g.fill(); g.fillStyle = C.blk; g.fillRect(7, -30, 3, 8);
    g.strokeStyle = C.blk; g.lineWidth = 6; g.beginPath(); g.moveTo(-8, 28); g.lineTo(-12, 44); g.moveTo(8, 28); g.lineTo(12, 44); g.stroke(); g.restore(); };
  const blackfish = (g, x, y, rot) => { g.save(); g.translate(x, y); g.rotate(rot);
    g.fillStyle = C.blue; poly(g, [[-24, 28], [0, -40], [24, 28]]); g.fill(); g.fillStyle = C.yel; poly(g, [[-10, 28], [0, 6], [10, 28]]); g.fill();
    g.fillStyle = C.cream; g.beginPath(); g.arc(4, -10, 6, 0, TAU); g.fill(); g.fillStyle = C.blk; g.fillRect(3, -12, 8, 3);
    g.strokeStyle = C.blk; g.lineWidth = 6; g.beginPath(); g.moveTo(-10, 28); g.lineTo(-14, 44); g.moveTo(10, 28); g.lineTo(14, 44); g.stroke(); g.restore(); };

  XY.STYLES.bauhaus = {
    bg(g, W, H) {
      const k = K(); g.fillStyle = C.paper; g.fillRect(0, 0, W, H);
      k.mottle(g, 'bauhaus', W, H, 6, 5001, (a, b) => { const v = 0.5 + 0.5 * a + 0.2 * b; return [120, 104, 80, Math.max(0, v - 0.45) * 90]; });
      // the night: a big blue circle behind the tower, a black bar and a red upright, a thin diagonal across everything
      g.fillStyle = C.blue; g.beginPath(); g.arc(TX + 120, 250, 210, 0, TAU); g.fill();
      g.fillStyle = C.lblue; g.beginPath(); g.arc(TX + 120, 250, 210, -2.2, -0.9); g.lineTo(TX + 120, 250); g.fill();
      g.strokeStyle = C.blk; g.lineWidth = 2; g.beginPath(); g.moveTo(20, 120); g.lineTo(W - 20, 640); g.stroke();
      g.fillStyle = C.blk; g.fillRect(40, 44, 300, 14); g.fillStyle = C.red; g.fillRect(352, 70, 22, 380);
      g.fillStyle = C.yel; poly(g, [[W - 40, 702], [W - 40, 520], [W - 220, 702]]); g.fill();
      // the clock face (hands drawn per frame)
      g.fillStyle = C.cream; g.beginPath(); g.arc(170, 200, 96, 0, TAU); g.fill(); g.strokeStyle = C.blk; g.lineWidth = 8; g.stroke();
      for (let j = 0; j < 12; j++) { const a = j / 12 * TAU; g.fillStyle = j % 3 ? C.blk : C.red; const r0 = j % 3 ? 76 : 70; g.save(); g.translate(170 + Math.cos(a) * r0, 200 + Math.sin(a) * r0); g.rotate(a); g.fillRect(-4, -3, j % 3 ? 10 : 16, 6); g.restore(); }
      // title block: 扫塔 over a red square, lowercase "sao ta", the counter in a blue circle
      g.fillStyle = C.red; g.fillRect(930, 56, 120, 120);
      g.fillStyle = C.blk; g.font = XY.font(118, XY.cnFont.hei, '900'); g.textBaseline = 'alphabetic'; g.fillText('扫', 934, 166); g.fillText('塔', 1042, 166);
      g.font = XY.font(40, 'Futura', 'bold'); g.fillText('sao ta', 936, 222); g.fillRect(936, 236, 210, 6);
      g.fillStyle = C.blk; g.font = XY.font(34, XY.cnFont.hei, '900'); g.fillText('第', 56, 368); g.fillText('难', 214, 368);
      g.fillStyle = C.blue; g.beginPath(); g.arc(150, 356, 44, 0, TAU); g.fill(); g.fillStyle = C.cream; g.font = XY.font(50, 'Futura', 'bold'); g.textAlign = 'center'; g.fillText('50', 150, 374); g.textAlign = 'left';
      // the wrongly chained monks of 金光寺 (grey, far right), a chain of rings between them
      // the far ground the pagoda and the chained monks stand on
      g.fillStyle = '#E2D8C0'; g.fillRect(0, PB, W, 702 - PB); g.fillStyle = C.blk; g.fillRect(0, PB - 2, W, 3);
      [1030, 1072, 1114].forEach((x, j) => { g.fillStyle = '#8E8A80'; poly(g, [[x - 12, PB], [x, PB - 69], [x + 12, PB]]); g.fill(); g.beginPath(); g.arc(x, PB - 78, 10, 0, TAU); g.fill();
        g.fillStyle = C.blk; g.fillRect(x - 17, PB - 56, 34, 6); });
      g.strokeStyle = C.blk; g.lineWidth = 2; for (let x = 1016; x < 1130; x += 10) { g.beginPath(); g.ellipse(x, PB - 30 + 2 * Math.sin(x), 5, 3, 0, 0, TAU); g.stroke(); }
      // ground bar and floor
      g.fillStyle = '#DDD4BE'; g.fillRect(0, 702, W, H - 702); g.fillStyle = C.blk; g.fillRect(0, 700, W, 8);
      g.fillStyle = C.red; g.fillRect(60, 730, 220, 10); g.fillStyle = C.blue; g.fillRect(300, 730, 60, 10);
      const R = XY.rng(5009); g.fillStyle = 'rgba(22,21,20,0.25)'; for (let j = 0; j < 900; j++) { g.beginPath(); g.arc(R() * W, R() * H, 0.6 + R() * 1.2, 0, TAU); g.fill(); }
    },
    draw(g, e) {
      const { W, H, t, u, beat } = e, k = K(), st6 = k.step(t, 6);
      // ---- the clock: minute hand races, hour hand goes from dusk (6) toward the second watch
      const ha = Math.PI / 2 + XY.clamp((u + 0.5) / 2) * Math.PI * 1.15, ma = -Math.PI / 2 + t * 3.2;
      g.save(); g.translate(170, 200); g.strokeStyle = C.blk; g.lineCap = 'butt'; g.lineWidth = 12; g.beginPath(); g.moveTo(0, 0); g.lineTo(Math.cos(ha) * 50, Math.sin(ha) * 50); g.stroke();
      g.strokeStyle = C.red; g.lineWidth = 6; g.beginPath(); g.moveTo(-Math.cos(ma) * 14, -Math.sin(ma) * 14); g.lineTo(Math.cos(ma) * 80, Math.sin(ma) * 80); g.stroke();
      g.fillStyle = C.yel; g.beginPath(); g.arc(0, 0, 10, 0, TAU); g.fill(); g.restore();
      // ---- the pagoda: the monk sweeps floors 1–10 (beats 1.2–3.6), tires (原著: 扫到十层腰酸), Wukong sweeps 11–13 (3.8–4.5)
      const prog = beat < 3.6 ? XY.clamp((beat - 1.2) / 2.4) * 10 : beat < 3.8 ? 10 : 10 + XY.clamp((beat - 3.8) / 0.7) * 3, nSw = Math.min(FL, Math.floor(prog + 1e-6)), cur = Math.min(FL - 1, nSw);
      for (let j = 0; j < FL; j++) floor(g, j, j < nSw, st6 + j);
      g.fillStyle = C.blk; poly(g, [[TX - 40, TOP], [TX, TOP - 48], [TX + 40, TOP]]); g.fill(); g.fillRect(TX - 3, TOP - 84, 6, 38);
      g.save(); g.setLineDash([6, 6]); g.strokeStyle = C.blk; g.lineWidth = 2.5; g.beginPath(); g.arc(TX, TOP - 96, 15, 0, TAU); g.stroke(); g.restore();   // the stolen 舍利: an empty dashed circle
      for (let j = 0; j < nSw; j++) { const pop = XY.clamp((prog - j) / 0.6), s = 14 + 18 * (1 - XY.easeOut(pop)), y = PB - (j + 0.5) * FH;
        g.fillStyle = C.blk; g.font = XY.font(s, 'Futura', 'bold'); g.textBaseline = 'middle'; g.fillText(String(j + 1), TX + fw(j) / 2 + 14, y); }
      g.textBaseline = 'alphabetic';
      const B13 = 4.5, dOpen = XY.easeOut((beat - B13) / 0.2), dy = TOP + 6;
      g.fillStyle = dOpen > 0 ? C.yel : C.blk; g.fillRect(TX - 11, dy, 22, FH - 12); if (dOpen > 0) { g.fillStyle = C.blk; g.fillRect(TX - 11 - 20 * dOpen, dy, 7, FH - 12); }
      const ring = k.hitDecay(beat, B13, 0.9); if (ring > 0.03) for (let j = 0; j < 3; j++) { const s = 60 + (1 - ring) * 300 + j * 50; g.strokeStyle = K().rgba([C.red, C.yel, C.blue][j], ring); g.lineWidth = 7;
        g.strokeRect(TX - s / 2, TOP - 30 - s / 2, s, s); }
      // ---- acts: the monk sweeps (far hand), rubs his back at 3.6; Wukong takes over with the staff raised, then strikes the demons on 5.3
      const pr = (a, b, r = 0.3) => XY.smooth((beat - a) / r) * (1 - XY.smooth((beat - b) / r));
      const acts = { monk: { palm: pr(0.8, 3.6, 0.25) }, wukong: { raise: pr(3.6, 5.1, 0.2) + XY.smooth((beat - 5.65) / 0.3), strike: pr(5.1, 5.65, 0.12), shade: pr(0.3, 1.2, 0.3) },
        bajie: { scratch: pr(3.5, 4.4, 0.25) + k.pulse(beat, 6.8, 0.8) }, shaseng: { lift: k.pulse(beat, 5.3, 0.5) } };
      // ---- the two fish-demons tumble out of the 13th floor (4.6), land ahead of Wukong (5.2), are struck (5.3) and on 5.7 hang
      //      tied from the tip of his staff, swinging, as he carries them off — nothing is left standing in the road
      const sTip = e.at('wukong.staffTip', acts), base0 = e.at('wukong.head', acts), landX = XY.procWorldX(e.cell.t0 + 5.2 * XY.BEAT) - e.cell.x + 265;
      [[catfish, 96, 0.5], [blackfish, 160, -0.4]].forEach(([fn, dx, spin], j) => { const b0 = 4.6 + j * 0.12; if (beat < b0) return; const f = XY.clamp((beat - b0) / 0.6);
        const land = [landX + dx, e.groundY - 62]; let x = XY.lerp(TX + 10, land[0], XY.easeIn(f) * 0.4 + f * 0.6), y = XY.lerp(dy + 10, land[1], XY.easeIn(f)) - 90 * Math.sin(Math.PI * f) * (1 - f), rot = f < 1 ? f * spin * 12 : 0.2 * Math.sin(t * 6 + j), sc = 1.45;
        const up = XY.easeOut((beat - 5.7 - j * 0.08) / 0.35);
        if (up > 0) { const sw = 0.35 * Math.sin((beat - 5.7) * 7 + j * 1.4) * Math.exp(-(beat - 5.7) * 0.6), L = 22 + 20 * j, hx = sTip[0] + 30 * j + Math.sin(sw) * L, hy = sTip[1] + Math.cos(sw) * L;
          x = XY.lerp(x, hx, up); y = XY.lerp(y, hy + 22, up); rot = XY.lerp(rot, Math.PI + sw, up); sc = XY.lerp(1.45, 0.72, up);
          g.strokeStyle = C.red; g.lineWidth = 3; g.beginPath(); g.moveTo(sTip[0] + 30 * j, sTip[1]); g.lineTo(x, y - 20 * Math.cos(rot) * sc); g.stroke(); }
        g.save(); g.translate(x, y + 18); g.scale(sc, sc); fn(g, 0, -18, rot); g.restore();
        if (beat > 5.3) { g.strokeStyle = C.blk; g.lineWidth = 4; g.save(); g.translate(x, y); g.rotate(up > 0 ? rot - Math.PI : 0); g.beginPath(); g.moveTo(-20, -4); g.lineTo(20, -4); g.moveTo(-20, 6); g.lineTo(20, 6); g.stroke(); g.restore(); } });
      const hitS = k.hitDecay(beat, 5.3, 0.5); if (hitS > 0.04) { g.fillStyle = K().rgba(C.yel, hitS); const cx = landX + 128, cy = e.groundY - 90; for (let j = 0; j < 10; j++) { const a = j / 10 * TAU; poly(g, [[cx + Math.cos(a - 0.12) * 30, cy + Math.sin(a - 0.12) * 30], [cx + Math.cos(a) * (60 + 60 * (1 - hitS)), cy + Math.sin(a) * (60 + 60 * (1 - hitS))], [cx + Math.cos(a + 0.12) * 30, cy + Math.sin(a + 0.12) * 30]]); g.fill(); } }
      if (beat > 4.65) { const f = XY.clamp((beat - 4.65) / 0.9), x = XY.lerp(TX + 20, base0[0] + 240, f), y = XY.lerp(dy, e.groundY - 10, XY.easeIn(f)) - 60 * Math.sin(Math.PI * f), a = f * 9, x2 = f >= 1 ? base0[0] + 240 + (beat - 5.55) * 160 : x;
        if (x2 < W + 30) { g.save(); g.translate(x2, f >= 1 ? e.groundY - 10 - 14 * Math.abs(Math.sin(beat * 6)) : y); g.rotate(f >= 1 ? beat * 6 : a); g.fillStyle = C.red; g.fillRect(-11, -11, 22, 22); g.fillStyle = C.cream; [[-5, -5], [5, 5], [0, 0]].forEach(([px, py]) => { g.beginPath(); g.arc(px, py, 2.2, 0, TAU); g.fill(); }); g.restore(); } }
      // ---- the pilgrims as primary-colour mannequins: flat parts, every interior joint a cream disc with a black ring (Schlemmer)
      XY.drawProcession(g, e.phase, e.procX, e.groundY, PEN, acts);
      g.lineWidth = 1.6; g.strokeStyle = C.blk;
      XY.procParts(e.phase, acts).forEach(F => F.bones.forEach(b => { const n = b.length / 2; if (n < 3) return;
        for (let j = 1; j < n - 1; j++) { if (n > 6 && j % 2) continue; const x = e.procX + F.x + b[2 * j], y = e.groundY + F.y + b[2 * j + 1]; g.fillStyle = C.cream; g.beginPath(); g.arc(x, y, 3.4, 0, TAU); g.fill(); g.stroke(); } }));
      // ---- the broom: one black diagonal from the monk's hand to the floor being swept; yellow triangle head scrubbing side to side
      const sw2 = XY.smooth((beat - 3.6) / 0.25), mh = e.at('monk.handFar', acts), wh = e.at('wukong.hand', acts), hand = [XY.lerp(mh[0], wh[0], sw2), XY.lerp(mh[1], wh[1], sw2)];
      const engage = XY.smooth((beat - 0.9) / 0.3) * (1 - XY.smooth((beat - 4.55) / 0.3)), fy = PB - (cur + 0.5) * FH, sweep = (0.5 + 0.5 * Math.sin(t * 13)) * fw(cur) * 0.55, tower = [TX - fw(cur) / 2 + 12 + sweep, fy + 6];
      const rest = [hand[0] + 50, hand[1] - 110], tip = [XY.lerp(rest[0], tower[0], engage), XY.lerp(rest[1], tower[1], engage)];
      if (beat > 4.9) { /* the broom is dropped once all floors are swept */ } else {
      const dx = tip[0] - hand[0], dyy = tip[1] - hand[1], L = Math.hypot(dx, dyy), ux = dx / L, uy = dyy / L, base = [tip[0] - ux * 40, tip[1] - uy * 40];
      g.strokeStyle = C.blk; g.lineCap = 'butt'; g.lineWidth = 7; g.beginPath(); g.moveTo(hand[0] - ux * 26, hand[1] - uy * 26); g.lineTo(base[0], base[1]); g.stroke();
      g.fillStyle = C.yel; poly(g, [base, [tip[0] - uy * 22, tip[1] + ux * 22], [tip[0] + uy * 22, tip[1] - ux * 22]]); g.fill(); g.lineWidth = 2; g.stroke();
      g.lineWidth = 1.4; for (let j = -2; j <= 2; j++) { g.beginPath(); g.moveTo(base[0] + ux * 10, base[1] + uy * 10); g.lineTo(tip[0] - uy * j * 9, tip[1] + ux * j * 9); g.stroke(); }
      if (engage > 0.5) {
        for (let j = 0; j < 3; j++) { const ph = (t * 2.2 + j / 3) % 1; g.strokeStyle = K().rgba(C.blk, 0.7 * (1 - ph)); g.lineWidth = 2.5; g.beginPath(); g.arc(tip[0], tip[1], 14 + ph * 54, -2.6, -0.5); g.stroke(); }
        for (let j = 0; j < 16; j++) { const ph = (t * 1.3 + XY.hash(j, 50)) % 1, x = tip[0] + (XY.hash(j, 51) - 0.5) * 50 - ph * 30, y = tip[1] + ph * ph * (702 - tip[1]), s = 3 + 4 * XY.hash(j, 52);
          g.fillStyle = K().rgba(j % 3 ? '#8E8A80' : C.blk, 1 - ph * 0.7); if (j % 2) g.fillRect(x - s / 2, y - s / 2, s, s); else { g.beginPath(); g.arc(x, y, s / 2, 0, TAU); g.fill(); } } } }
      if (beat > 3.6 && beat < 4.4) { g.save(); g.translate(mh[0] - 40, mh[1] - 60); g.rotate(-0.2); g.fillStyle = C.blk; g.font = XY.font(30, XY.cnFont.hei, '900'); g.fillText('腰酸…', 0, 0); g.restore(); }
      e._zoom = [TX, TOP + 40, k.push(beat, 4.4, 0.15, 0.45, 1.0)];
    },
    post(canvas, g, e) { const z = e._zoom; if (z && z[2] > 0) K().postZoom(canvas, g, e, z[0], z[1], 1 + 0.14 * z[2]); },
    hits: [4.5, 5.3],
    thumb: 6.2,   // overview thumbnail: a clear frame with no in-panel push-in active
  };
})();
