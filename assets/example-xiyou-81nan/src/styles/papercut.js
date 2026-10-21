// 34 中国剪纸 · 大赌输赢 — everything is red paper cut and laid on cream backing: palace eaves, the king and the three
// Taoist immortals (虎力 鹿力 羊力), mirrored 团花, the oil cauldron and the guessing chest. On beat 3 the headsman's
// saber takes 悟空's head clean off — it spins away — and on beat 3.6 a new one pops out of his neck.
(() => {
  'use strict';
  const XY = window.XY, K = XY.KIT_D, TAU = XY.TAU;
  const GY = 702, RED = '#C8161E', DARK = '#8E0E14', BACK = '#F4ECDC', SH = 'rgba(90,10,10,0.28)';
  const EXE = [1010, 520];   // the headsman's shoulder
  // white parts are cut right out, leaving only a red rim (the recipe for every silhouette craft)
  const HOLLOW = { face: 1, horse: 1, horse2: 1, mane: 1, skin: 1, skin2: 1, skull: 1, pig: 1, robe: 1, tiger: 1, bundle: 1 };
  const crescents = (g, pts, seed, step = 13, back = false) => {   // 月牙纹 cut through a solid piece (back: paint the backing instead of cutting)
    let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9; for (let k = 0; k < pts.length; k += 2) { x0 = Math.min(x0, pts[k]); x1 = Math.max(x1, pts[k]); y0 = Math.min(y0, pts[k + 1]); y1 = Math.max(y1, pts[k + 1]); }
    if ((x1 - x0) * (y1 - y0) < 500) return;
    g.save(); XY.path(g, pts, true); g.clip(); if (back) g.fillStyle = BACK; else { g.globalCompositeOperation = 'destination-out'; g.fillStyle = '#000'; }
    for (let y = y0 + 8; y < y1 - 4; y += step) for (let x = x0 + 6 + ((Math.round(y / step) % 2) ? step / 2 : 0); x < x1 - 4; x += step) if (XY.hash(Math.round(x), Math.round(y), seed) < 0.55) {
      g.beginPath(); g.arc(x, y, 3.6, 0.2, Math.PI - 0.2); g.arc(x, y - 1.6, 3.2, Math.PI - 0.3, 0.3, true); g.fill(); }
    g.restore();
  };
  const PEN = { outline: null, shade: false, seed: 34, color: () => RED,
    part(g, p) {
      if (p.k !== 'poly') return false;
      XY.path(g, p.pts, true); g.fillStyle = RED; g.fill();
      if (HOLLOW[p.role]) { g.save(); g.globalCompositeOperation = 'destination-out'; XY.path(g, p.pts, true); g.fill(); g.restore(); XY.path(g, p.pts, true); g.strokeStyle = RED; g.lineWidth = 2.6; g.stroke(); }
      else crescents(g, p.pts, p.pts.length + Math.round(p.pts[1]));
      return true; } };

  // ---- background pieces (holes are painted in backing colour, which reads the same as a cut)
  const paper = (g, pts, col = RED) => { g.save(); g.shadowColor = SH; g.shadowBlur = 4; g.shadowOffsetX = 2; g.shadowOffsetY = 3; XY.path(g, pts, true); g.fillStyle = col; g.fill(); g.restore(); };
  const hole = (g, pts) => { XY.path(g, pts, true); g.fillStyle = BACK; g.fill(); };
  const saw = (g, x0, x1, y, h, dir = 1) => { const p = [x0, y]; for (let x = x0; x <= x1; x += 8) p.push(x + 4, y + dir * h, x + 8, y); p.push(x1, y); hole(g, p); };
  // a mirrored 团花: one wedge cut, repeated round the circle (paper folded eight times)
  const tuanhua = (g, x, y, r) => {
    paper(g, XY.ellipse(x, y, r, r, 40));
    for (let k = 0; k < 8; k++) { const a = k / 8 * TAU; g.save(); g.translate(x, y); g.rotate(a);
      hole(g, [r * 0.18, 0, r * 0.42, -r * 0.12, r * 0.62, 0, r * 0.42, r * 0.12]); hole(g, XY.ellipse(r * 0.78, 0, r * 0.08, r * 0.05, 10));
      g.beginPath(); g.arc(r * 0.6, r * 0.28, r * 0.09, 0.3, Math.PI - 0.3); g.arc(r * 0.6, r * 0.25, r * 0.08, Math.PI - 0.4, 0.4, true); g.fillStyle = BACK; g.fill(); g.restore(); }
    hole(g, XY.ellipse(x, y, r * 0.12, r * 0.12, 16)); saw(g, x - r * 0.95, x + r * 0.95, y + r * 1.02, 6, -1);
  };
  const eaves = (g, W) => {
    paper(g, [0, 26, W, 26, W, 70, 0, 70]);
    for (let x = 10; x < W; x += 34) { hole(g, [x, 34, x + 22, 34, x + 22, 52, x, 52]); hole(g, [x + 4, 38, x + 18, 38, x + 18, 48, x + 4, 48].map((v, i) => v)); }
    paper(g, [0, 70, W, 70, W, 82, 0, 82]); saw(g, 0, W, 82, 10, 1);
    g.fillStyle = RED; for (let x = 30; x < W; x += 34) { g.beginPath(); g.moveTo(x, 70); g.lineTo(x + 6, 84); g.lineTo(x + 12, 70); g.fill(); }
  };
  // the court: king on his throne under a canopy, the three immortals on the balcony
  const court = (g, W) => {
    const cx = W / 2;
    paper(g, [cx - 120, 110, cx + 120, 110, cx + 140, 132, cx - 140, 132]); saw(g, cx - 130, cx + 130, 132, 7, 1);
    paper(g, [cx - 70, 300, cx - 60, 190, cx + 60, 190, cx + 70, 300]);                   // throne back
    paper(g, XY.ellipse(cx, 176, 18, 20, 18)); paper(g, [cx - 18, 162, cx - 12, 140, cx - 4, 156, cx, 136, cx + 4, 156, cx + 12, 140, cx + 18, 162]);
    hole(g, [cx - 8, 172, cx - 3, 172, cx - 3, 175, cx - 8, 175]); hole(g, [cx + 3, 172, cx + 8, 172, cx + 8, 175, cx + 3, 175]);
    paper(g, [cx - 40, 300, cx - 30, 200, cx + 30, 200, cx + 40, 300]); crescents(g, [cx - 40, 300, cx - 30, 200, cx + 30, 200, cx + 40, 300], 7, 13, true);
    paper(g, [0, 300, W, 300, W, 316, 0, 316]); for (let x = 12; x < W; x += 26) hole(g, [x, 303, x + 14, 303, x + 14, 313, x, 313]);
    // 虎力 (tiger head, stripes), 鹿力 (antlers), 羊力 (curled horns, goat beard) — Taoist robes and crowns
    const sage = (x, kind) => { paper(g, [x - 30, 300, x - 22, 212, x + 22, 212, x + 30, 300]); crescents(g, [x - 30, 300, x - 22, 212, x + 22, 212, x + 30, 300], x, 13, true);
      paper(g, XY.ellipse(x, 194, 17, 18, 18)); hole(g, XY.ellipse(x + 6, 190, 3, 2.4, 8));
      if (kind === 0) { paper(g, [x - 16, 184, x - 12, 168, x - 6, 182]); paper(g, [x + 6, 182, x + 12, 168, x + 16, 184]); for (let k = 0; k < 3; k++) hole(g, [x - 10 + k * 8, 200, x - 7 + k * 8, 210, x - 4 + k * 8, 200]); }
      if (kind === 1) { g.strokeStyle = RED; g.lineWidth = 3.4; [[-1], [1]].forEach(([s]) => { g.beginPath(); g.moveTo(x + s * 6, 178); g.lineTo(x + s * 18, 150); g.lineTo(x + s * 30, 140); g.moveTo(x + s * 14, 158); g.lineTo(x + s * 4, 140); g.moveTo(x + s * 22, 146); g.lineTo(x + s * 26, 128); g.stroke(); }); }
      if (kind === 2) { g.strokeStyle = RED; g.lineWidth = 4; [-1, 1].forEach(s => { g.beginPath(); g.arc(x + s * 16, 182, 9, s > 0 ? -2.4 : -0.7, s > 0 ? 1 : 3.9, s < 0); g.stroke(); }); paper(g, [x - 4, 208, x + 4, 208, x, 232]); } };
    sage(cx - 176, 0); sage(cx - 110, 1); sage(cx + 140, 2);
  };
  const cauldron = (g) => {   // 滚油锅 on its stove
    const x = 150, y = 690; paper(g, [x - 80, y, x - 70, y - 50, x + 70, y - 50, x + 80, y]); for (let k = 0; k < 3; k++) hole(g, XY.ellipse(x - 40 + k * 40, y - 22, 12, 10, 12));
    paper(g, [x - 92, y - 50, x - 76, y - 118, x + 76, y - 118, x + 92, y - 50]); crescents(g, [x - 92, y - 50, x - 76, y - 118, x + 76, y - 118, x + 92, y - 50], 3, 11, true);
    paper(g, [x - 100, y - 118, x + 100, y - 118, x + 100, y - 108, x - 100, y - 108]); [-1, 1].forEach(s => paper(g, XY.ellipse(x + s * 100, y - 96, 12, 14, 14)));
  };
  const chest = (g) => {   // the 隔板猜枚 cabinet, a peach cut in its door
    const x = 360, y = 690; paper(g, [x - 70, y, x - 70, y - 120, x + 70, y - 120, x + 70, y]); hole(g, [x - 60, y - 110, x + 60, y - 110, x + 60, y - 10, x - 60, y - 10]);
    paper(g, [x - 52, y - 102, x + 52, y - 102, x + 52, y - 18, x - 52, y - 18]); hole(g, XY.ellipse(x, y - 56, 24, 22, 22)); paper(g, [x - 16, y - 54, x, y - 74, x + 16, y - 54, x, y - 40]); paper(g, [x, y - 74, x + 12, y - 84, x + 16, y - 74]);
  };
  const tuanSprite = (S) => XY.keep('kd34-tuan:' + S.toFixed(4), 180 * S, 190 * S, cv => { const g = cv.getContext('2d'); g.setTransform(S, 0, 0, S, 0, 0); tuanhua(g, 90, 88, 64); });

  const CX = 640, HIT = 4.4, REGROW = 5.2;   // the court is drawn 1.3× about (CX, 316); the cut on 4.4, the new head on 5.2
  const courtXY = (x, y) => [CX + 1.3 * (x - 590), 316 + 1.3 * (y - 316)];
  XY.STYLES.papercut = {
    hits: [4.4, 5.2],
    bg(g, W, H) {
      g.fillStyle = BACK; g.fillRect(0, 0, W, H); K.grain(g, W, H, 34, 2200, 'rgba(150,110,70,0.12)', 'rgba(255,255,250,0.5)', 7);
      eaves(g, W); g.save(); g.translate(CX, 316); g.scale(1.3, 1.3); g.translate(-W / 2, -316); court(g, W); g.restore(); cauldron(g); chest(g);
      // 斗方 with 赌 cut out of it, the count cut in red beside it
      g.save(); g.translate(112, 182); g.rotate(Math.PI / 4); paper(g, [-60, -60, 60, -60, 60, 60, -60, 60]); g.strokeStyle = BACK; g.lineWidth = 2.4; g.strokeRect(-50, -50, 100, 100); g.restore();
      g.fillStyle = BACK; g.font = XY.font(80, XY.cnFont.hei, '900'); g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('赌', 112, 186); g.textAlign = 'left'; g.textBaseline = 'alphabetic';
      g.fillStyle = RED; g.font = XY.font(25, XY.cnFont.hei, '900'); K.vtext(g, '第三十四难', 206, 122, 28);
      // the stage edge and the bottom border, both with sawtooth cuts
      paper(g, [0, GY, W, GY, W, GY + 12, 0, GY + 12]); saw(g, 0, W, GY + 12, 8, 1); for (let x = 20; x < W; x += 40) hole(g, XY.ellipse(x, GY + 5, 4, 2.4, 8));
      paper(g, [0, H - 22, W, H - 22, W, H, 0, H]); saw(g, 0, W, H - 22, 8, -1); for (let x = 16; x < W; x += 30) { hole(g, [x, H - 14, x + 8, H - 8, x, H - 2, x - 8, H - 8]); }
    },
    draw(g, e) {
      const { W, H, t, u, beat } = e, c = e.cell, S = e.S;
      // the two 团花 unfold from their crease as the panel arrives
      const f = Math.max(0.03, XY.smooth((u + 0.35) / 0.45)), sp = tuanSprite(S);
      [[300, 196], [1050, 196]].forEach(([x, y]) => g.drawImage(sp, x - 76 * f, y - 74, 152 * f, 160));
      // king's fan, the cauldron's flames (two cut patterns swapped at 8 fps) and its bubbles
      { const [fx, fy] = courtXY(654, 250); g.save(); g.translate(fx, fy); g.scale(1.3, 1.3); g.rotate(-0.5 + 0.12 * Math.sin(t * 2)); paper(g, [0, 0, 3, 0, 3, -70, 0, -70]); paper(g, XY.ellipse(1, -86, 22, 22, 20)); hole(g, XY.ellipse(1, -86, 10, 10, 12)); g.restore(); }
      const fq = Math.floor(t * 8) % 2;
      for (let k = 0; k < 5; k++) { const x = 70 + k * 40, h = 46 + 18 * ((k + fq) % 2) + 10 * XY.hash(k, Math.floor(t * 8)), y = 572;
        paper(g, [x - 16, y, x - 12, y - h * 0.5, x - 4 + (fq ? 4 : -4), y - h, x + 4, y - h * 0.55, x + 14, y - h * 0.7, x + 16, y]); hole(g, XY.ellipse(x, y - h * 0.35, 3.6, 7, 8)); }
      // the headsman: winds up on beat 2.4, the stroke on beat 3
      const stride = K.win(beat, 1.6, 2.6), wind = K.win(beat, 3.3, 4.1), slash = XY.easeOut((beat - HIT) / 0.12), aim = beat < HIT ? XY.lerp(-0.6, -1.3, wind) + 0.06 * Math.sin(t * 9) * wind : XY.lerp(-1.3, -3.4, slash);
      headsman(g, t, aim, 60 * (1 - stride));
      // the procession: for the cut and the regrowth 悟空 leaves the rig (cast) and is painted here, head apart
      const acts = { wukong: { shade: K.win(beat, 2.0, 2.6) * (1 - K.win(beat, 3.6, 4.0)) }, monk: { palm: K.win(beat, 4.5, 5) * (1 - K.win(beat, 6.6, 7.2)) }, bajie: { scratch: K.win(beat, 6.4, 7) }, shaseng: { lift: K.win(beat, 4.3, 4.7) * (1 - K.win(beat, 5.8, 6.4)) } };
      const own = beat >= HIT && beat < REGROW + 0.35; if (own) acts.cast = { wukong: false };
      K.tag(e.phase, acts);
      const L = K.boxLayer('kd34-lay', e, 30); XY.drawProcession(L.g, e.phase, e.procX, e.groundY, PEN, acts);
      const hs = K.sub(e, e.phase, acts, 3, '_head', 'head');
      if (own) { const F = XY.procParts(e.phase, acts)[3]; L.g.save(); L.g.translate(e.procX + F.x, e.groundY + F.y); K.paint(L.g, F.parts.filter(p => !p._head), PEN); L.g.restore();
        if (beat >= REGROW) { const p = XY.clamp((beat - REGROW) / 0.3); K.paintSub(L.g, hs, PEN, hs.at[0], hs.at[1] + 6 * (1 - p), 0, Math.max(0.01, p + 0.25 * Math.sin(p * Math.PI))); } }
      // a cream backing round the cut-out pilgrims, so red on red still reads (a paper cut mounted on white)
      { const M = K.boxLayer('kd34-mat', e, 30), mg = M.g; mg.save(); mg.setTransform(1, 0, 0, 1, 0, 0); for (let k = 0; k < 10; k++) { const a = k / 10 * TAU; mg.drawImage(L.cv, Math.cos(a) * 4 * S, Math.sin(a) * 4 * S); }
        mg.globalCompositeOperation = 'source-in'; mg.fillStyle = '#FBF6EA'; mg.fillRect(0, 0, M.cv.width, M.cv.height); mg.restore(); K.put(g, M); }
      g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.shadowColor = SH; g.shadowBlur = 4 * S; g.shadowOffsetX = 2 * S; g.shadowOffsetY = 3 * S; g.drawImage(L.cv, L.X, L.Y); g.restore();
      // the old head: spins away from where the neck was on beat 3 and comes to rest on the stage
      if (beat >= HIT) { const hc = [K.procAt(e, HIT / 8) + (hs.at[0] - e.procX), hs.at[1]], fl = XY.clamp((beat - HIT) / 0.9);
        const hx = hc[0] - 150 * fl, hy = XY.lerp(hc[1], GY - 18, fl) - 250 * Math.sin(Math.PI * fl), rot = fl < 1 ? fl * TAU * 2 : 0.3 + 0.08 * Math.sin(t * 3);
        const Q = XY.scratch('kd34-head', 140 * S, 140 * S), qg = Q.getContext('2d'); qg.setTransform(S, 0, 0, S, (70 - hx) * S, (70 - hy) * S); K.paintSub(qg, hs, PEN, hx, hy, rot, 1);
        g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.shadowColor = SH; g.shadowBlur = 4 * S; g.shadowOffsetY = 3 * S; g.drawImage(Q, (hx - 70) * S, (hy - 70) * S); g.restore(); }
      confetti(g, t, beat, hs.at);
      tigerDog(g, t, beat);
      K.zoom(g, e, K.procAt(e, HIT / 8) + 245, GY - 120, 1 + 0.14 * K.env(beat, 4.1, 4.5, 5.6, 6.4));
    },
  };
  function headsman(g, t, aim, dx = 0) {
    const sy = EXE[1], sx = EXE[0] + dx, x = sx;
    paper(g, [x - 30, GY, x - 22, GY - 60, x - 4, GY - 60, x, GY - 30, x + 4, GY - 60, x + 22, GY - 60, x + 30, GY]);
    const torso = [x - 26, GY - 56, x - 40, sy - 2, x - 20, sy - 10, x + 22, sy - 10, x + 38, sy - 2, x + 26, GY - 56];
    paper(g, torso); crescents(g, torso, 9, 13, true); hole(g, [x - 28, GY - 74, x + 28, GY - 74, x + 28, GY - 66, x - 28, GY - 66]);
    paper(g, [x + 34, sy, x + 52, sy + 34, x + 30, GY - 70, x + 24, GY - 76, x + 40, sy + 34, x + 28, sy + 8]);
    paper(g, XY.ellipse(x - 4, sy - 30, 20, 22, 18)); paper(g, [x - 10, sy - 50, x, sy - 70, x + 8, sy - 50]); hole(g, [x - 24, sy - 36, x + 16, sy - 36, x + 16, sy - 32, x - 24, sy - 32]);
    hole(g, XY.ellipse(x - 14, sy - 26, 3, 2, 8)); hole(g, [x - 16, sy - 16, x - 6, sy - 14, x - 16, sy - 12]);
    g.save(); g.translate(sx - 14, sy); g.rotate(aim);
    paper(g, [0, -8, 56, -6, 56, 6, 0, 8]); paper(g, [54, -4, 70, -4, 70, 4, 54, 4]);
    paper(g, [70, -6, 186, -16, 200, -4, 190, 14, 70, 8]); hole(g, XY.ellipse(96, -2, 6, 6, 10)); hole(g, [110, 0, 180, -6, 182, -2, 112, 4]);
    g.restore();
  }
  // the aftermath (原著第四十六回): 虎力大仙 tries the same trick; his head pops off, a paper dog (悟空's hair) snatches it and
  // trots off along the balcony, and the headless body turns out to be a tiger
  function tigerDog(g, t, beat) {
    if (beat < 6.0) return;
    const [hx, hy] = courtXY(414, 194), floor = 292, pop = XY.clamp((beat - 6.0) / 0.5);
    g.fillStyle = BACK; g.fillRect(hx - 30, hy - 46, 60, 74);   // the head is gone from the cut
    g.save(); g.translate(hx - 4, hy + 30); g.scale(1.3, 1.3); paper(g, [-14, 0, -8, -16, 0, -6, 8, -16, 14, 0, 10, 8, -10, 8]); g.restore();   // the stump turns into a tiger's striped neck
    const grab = XY.smooth((beat - 6.6) / 0.3), run = Math.max(0, beat - 6.9) / 1.1, dogX = beat < 6.9 ? XY.lerp(hx + 220, hx + 18, XY.smooth((beat - 6.1) / 0.5)) : hx + 18 - 330 * run, legs = Math.floor(t * 12) % 2;
    const headX = beat < 6.9 ? XY.lerp(hx, hx + 20, pop) : dogX + 26, headY = beat < 6.9 ? XY.lerp(hy, floor - 16, pop) - 60 * Math.sin(Math.PI * pop) : floor - 34;
    g.save(); g.translate(headX, headY); g.rotate(beat < 6.6 ? pop * 6 : 0.4); g.scale(1.3, 1.3);
    paper(g, XY.ellipse(0, 0, 17, 18, 18)); paper(g, [-16, -10, -12, -26, -6, -12]); paper(g, [6, -12, 12, -26, 16, -10]);
    for (let k = 0; k < 3; k++) hole(g, [-10 + k * 8, 6, -7 + k * 8, 16, -4 + k * 8, 6]); hole(g, XY.ellipse(6, -4, 3, 2.4, 8)); g.restore();
    g.save(); g.translate(dogX, floor); g.scale(-1, 1);   // the dog runs left
    paper(g, [-30, -26, 14, -30, 26, -42, 38, -40, 36, -28, 20, -22, 18, -10, 12, 0, 6, 0, 4, -12, -18, -12, -22, 0, -28, 0, -30, -14, -42, -30]);
    hole(g, XY.ellipse(30, -36, 2.4, 2.4, 8)); for (let k = 0; k < 4; k++) hole(g, [-20 + k * 9, -24, -16 + k * 9, -16, -12 + k * 9, -24]);
    if (legs) { paper(g, [-24, -2, -18, -2, -26, 8, -32, 8]); paper(g, [8, -2, 14, -2, 20, 8, 14, 8]); }
    g.restore();
  }
  // red and gold paper bits drifting down; a burst from his neck on the cut
  function confetti(g, t, beat, neck) {
    for (let k = 0; k < 30; k++) { const x = XY.hash(k, 1) * 1180 + 30 * Math.sin(t * 1.3 + k), y = ((t * (36 + 24 * XY.hash(k, 2)) + XY.hash(k, 3) * 860) % 860) - 60, a = t * 3 + k;
      g.save(); g.translate(x, y); g.rotate(a); g.scale(1, Math.abs(Math.sin(a * 0.7)) + 0.2); g.fillStyle = k % 4 ? RED : '#D8A02A'; g.fillRect(-4, -3, 8, 6); g.restore(); }
    if (beat >= HIT && beat < HIT + 1.2) { const s = (beat - HIT) / 1.2;
      for (let k = 0; k < 24; k++) { const a = XY.hash(k, 9) * TAU, d = 30 + 160 * s * XY.hash(k, 8), x = neck[0] + Math.cos(a) * d, y = neck[1] + Math.sin(a) * d * 0.7 + 120 * s * s;
        g.save(); g.translate(x, y); g.rotate(a + beat * 6); g.fillStyle = k % 3 ? RED : '#D8A02A'; g.globalAlpha = 1 - s; g.fillRect(-5, -3, 10, 6); g.restore(); } }
  }
})();
