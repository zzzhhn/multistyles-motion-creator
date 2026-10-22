// s20 小雪 · 马王堆帛画式. Brown silk ground, cinnabar / ink / ochre / malachite, iron-wire ink outlines, 云气纹 scrolls;
// the picture is split into three tiers (天 · 人 · 地) by lozenge bands. Moment (天气上升，地气下降): the heaven tier's
// cloud-qi drifts up and out of the top, the earth tier's qi sinks into the bottom edge, the village gate between them
// swings shut; the rainbow, drawn as a Han double-headed dragon arch, folds at its crown and is put away (虹藏不见).
// Unit (8 s = 3 bars, one pentad per bar): 虹藏不见 the dragon arch folds into a cloud; 天气上升，地气下降 (key) a vermilion
// heaven-qi scroll and an ink earth-qi scroll twine in the middle tier, are torn apart and pierce the two tier bands together
// on beat 3 (4.0 s) while every scroll in heaven and earth is shoved a row; 闭塞而成冬 the gate shuts and the snow thickens.
(function () {
  const JQ = window.JQ, S = JQ.SCENE, L = JQ.L, W = JQ.W, H = JQ.H, TAU = Math.PI * 2;
  const SILK = '#7C5634', SILK2 = '#4E321C', ZHU = '#B3361F', ZHU2 = '#D2653F', MO = '#1D1610', ZHE = '#A0662E', LV = '#4A8A72', LV2 = '#8DBEA6', FEN = '#E9DDC2';
  const LI = '"Baoli SC", "Libian SC", "Kaiti SC", serif';
  if (document.fonts) document.fonts.load(`84px ${LI}`, '小雪天气上升地气下降');   // system fonts can load lazily; let fonts.ready wait
  const B1 = [424, 440], B2 = [748, 764];                       // the two tier bands (天|人, 人|地)
  const BAR = 8 / 3, IMP = BAR + 4 / 3, HOU = JQ.TERMS[19].hou;
  const fillP = (g, path, c, lw, lc = MO) => { if (c) { g.fillStyle = c; g.fill(path); } if (lw) { g.strokeStyle = lc; g.lineWidth = lw; g.lineJoin = 'round'; g.lineCap = 'round'; g.stroke(path); } };
  // tapered polygon along a polyline; wf(k) gives the width at fraction k
  const taper = (pts, wf) => {
    const A = [], B = [], n = pts.length;
    for (let i = 0; i < n; i++) { const a = pts[Math.max(0, i - 1)], b = pts[Math.min(n - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], d = Math.hypot(dx, dy) || 1, w = wf(i / (n - 1)) / 2;
      A.push([pts[i][0] - dy / d * w, pts[i][1] + dx / d * w]); B.push([pts[i][0] + dy / d * w, pts[i][1] - dx / d * w]); }
    return [...A, ...B.reverse()];
  };
  const line = (g, pts, c, w) => { g.strokeStyle = c; g.lineWidth = w; g.lineCap = 'round'; g.lineJoin = 'round'; g.stroke(JQ.smoothPath(pts, false)); };

  // ---------------------------------------------------------------- 云气纹: a hooked scroll with a trailing tail and a side curl
  // (x,y) spiral centre, r radius, dir = -1 travels up (tail hangs below), +1 travels down; hand flips the curl.
  const scrollPts = (x, y, r, dir, hand, len, sway) => {
    const P = [], tail = [[r * 1.25 + sway, len], [r * 0.45 - sway * 0.5, len * 0.62], [r * 1.15, len * 0.28], [r, 0]];
    const tl = JQ.resample(tail, r * 0.18, false);
    tl.forEach(q => P.push(q));
    for (let i = 1; i <= 28; i++) { const k = i / 28, a = -k * TAU * 1.15, rr = r * (1 - 0.72 * k); P.push([Math.cos(a) * rr, Math.sin(a) * rr]); }
    return { pts: P.map(([u, v]) => [x + u * hand, y - v * dir]), nTail: tl.length };
  };
  const cloud = (g, x, y, r, dir, hand, fill, inner, alpha = 1, len = 3.2) => {
    if (alpha <= 0.01) return;
    g.globalAlpha = alpha;
    const { pts, nTail } = scrollPts(x, y, r, dir, hand, r * len, r * 0.3), n = pts.length, kt = nTail / n;
    const poly = taper(pts, k => k < kt ? JQ.lerp(3, r * 0.5, Math.pow(k / kt, 0.7)) : JQ.lerp(r * 0.5, r * 0.1, (k - kt) / (1 - kt)));
    fillP(g, JQ.smoothPath(poly), fill, 2.4);
    line(g, pts.slice(2, n - 3), inner, 1.4);
    // a smaller curl budding off the tail, opposite hand
    const m = pts[Math.floor(nTail * 0.55)], s2 = scrollPts(m[0] + hand * r * 0.55, m[1] - dir * r * 0.25, r * 0.38, dir, -hand, r * 0.9, 0);
    const p2 = taper(s2.pts, k => k < 0.3 ? JQ.lerp(2, r * 0.22, k / 0.3) : JQ.lerp(r * 0.22, r * 0.05, (k - 0.3) / 0.7));
    fillP(g, JQ.smoothPath(p2), fill, 2);
    g.globalAlpha = 1;
  };

  // ---------------------------------------------------------------- the silk (static)
  const silk = g => {
    g.fillStyle = SILK; g.fillRect(0, 0, W, H);
    const cw = 160, ch = 90, c = document.createElement('canvas'); c.width = cw; c.height = ch;
    const x = c.getContext('2d'), im = x.createImageData(cw, ch);
    for (let j = 0; j < ch; j++) for (let i = 0; i < cw; i++) {
      const v = (JQ.fbm(i * 0.06, j * 0.06, 5, 4) - 0.5) * 1.8 + (JQ.noise(i * 0.3, j * 0.3, 9) - 0.5) * 0.5, o = (j * cw + i) * 4;
      if (v > 0) { im.data[o] = 38; im.data[o + 1] = 22; im.data[o + 2] = 8; im.data[o + 3] = Math.min(255, v * 170); }
      else { im.data[o] = 176; im.data[o + 1] = 134; im.data[o + 2] = 88; im.data[o + 3] = Math.min(255, -v * 120); }
    }
    x.putImageData(im, 0, 0); g.imageSmoothingEnabled = true; g.drawImage(c, 0, 0, W, H);
    g.strokeStyle = 'rgba(30,18,6,0.07)'; g.lineWidth = 1; g.beginPath(); for (let y = 0; y < H; y += 3) { g.moveTo(0, y); g.lineTo(W, y); } g.stroke();
    g.strokeStyle = 'rgba(30,18,6,0.045)'; g.beginPath(); for (let xx = 0; xx < W; xx += 3) { g.moveTo(xx, 0); g.lineTo(xx, H); } g.stroke();
    // fold creases of a banner that was stored folded
    [[0, 268, W, 272], [0, 702, W, 698], [642, 0, 646, H], [1282, 0, 1278, H]].forEach(([a, b, c2, d], i) => {
      g.strokeStyle = 'rgba(25,14,4,0.22)'; g.lineWidth = 3; g.beginPath(); g.moveTo(a, b); g.lineTo(c2, d); g.stroke();
      g.strokeStyle = 'rgba(200,160,110,0.12)'; g.lineWidth = 2; g.beginPath(); g.moveTo(a + (i > 1 ? 4 : 0), b + (i > 1 ? 0 : 4)); g.lineTo(c2 + (i > 1 ? 4 : 0), d + (i > 1 ? 0 : 4)); g.stroke(); });
  };
  // a tier band: ink strip with a cinnabar lozenge chain and fen dots
  const band = (g, y0, y1) => {
    const m = (y0 + y1) / 2, h = (y1 - y0) / 2;
    g.fillStyle = MO; g.fillRect(0, y0, W, y1 - y0);
    g.fillStyle = ZHU; for (let x = 0; x < W; x += 36) { g.beginPath(); g.moveTo(x, m); g.lineTo(x + 18, m - h + 2); g.lineTo(x + 36, m); g.lineTo(x + 18, m + h - 2); g.closePath(); g.fill(); }
    g.fillStyle = FEN; for (let x = 18; x < W; x += 36) { g.beginPath(); g.arc(x, m, 2.2, 0, TAU); g.fill(); }
    g.fillStyle = ZHU; g.fillRect(0, y0 - 5, W, 2); g.fillRect(0, y1 + 3, W, 2);
  };
  // ---------------------------------------------------------------- static layers
  const buildBg = g => {
    silk(g);
    g.save(); g.clip(S.mountains.path);
    fillP(g, S.mountains.path, LV);
    [18, 38, 60].forEach((o, i) => line(g, S.ridge.pts.map(([x, y]) => [x, y + o]), i === 1 ? ZHU2 : LV2, 2));
    g.restore();
    fillP(g, S.ridge.path, null, 3.2);
    fillP(g, S.hills.path, ZHE, 2.6);
    line(g, S.hills.pts.slice(0, -2).map(([x, y]) => [x, y + 12]), '#C98B4C', 1.6);
  };
  const buildMid = g => {
    fillP(g, S.ground.path, 'rgba(52,30,12,0.34)');
    fillP(g, S.path.path, 'rgba(206,166,112,0.28)', 1.6);
    fillP(g, S.field.path, 'rgba(150,96,44,0.9)', 2.4);
    S.furrows.forEach((f, i) => line(g, f.pts, i % 3 === 1 ? ZHU : MO, i % 3 === 1 ? 1.6 : 2.2));
    band(g, B1[0], B1[1]); band(g, B2[0], B2[1]);
    fillP(g, S.stream.path, LV, 2.6);
    S.stream.center.forEach(([x, y], i) => { if (i % 3 === 1) { g.strokeStyle = FEN; g.lineWidth = 1.6; g.beginPath(); g.arc(x, y, 5 + i * 0.25, Math.PI * 0.9, Math.PI * 1.9); g.stroke(); } });
    fillP(g, S.bridge.path, ZHE, 3);
    g.save(); g.clip(S.bridge.path); g.strokeStyle = MO; g.lineWidth = 1.4;
    for (let x = L.bridge.cx - 110; x < L.bridge.cx + 120; x += 26) { g.beginPath(); g.moveTo(x, L.bridge.deckY); g.lineTo(x, L.bridge.deckY + 16); g.stroke(); }
    g.fillStyle = ZHU; g.fillRect(L.bridge.cx - 120, L.bridge.deckY + 2, 240, 3); g.restore();
    fillP(g, S.pondRim.path, ZHE, 2.6);
    fillP(g, S.pond.path, LV, 3);
    const P = L.pond; g.save(); g.clip(S.pond.path);
    for (let i = 1; i <= 4; i++) { g.strokeStyle = i % 2 ? LV2 : '#2F6A55'; g.lineWidth = 1.6; g.beginPath(); g.ellipse(P.cx, P.cy, P.rx * i / 4.6, P.ry * i / 4.6, 0, 0, TAU); g.stroke(); }
    g.restore();
    // farmhouse
    fillP(g, S.roof.path, MO, 2); S.roofLines.forEach(r => line(g, r.pts, LV2, 1.4));
    fillP(g, S.houseFront.path, '#C59E6C', 2.2); fillP(g, S.window.path, MO); fillP(g, S.chimney.path, MO);
    fillP(g, S.wall.path, '#B08150', 2.6);
    g.save(); g.clip(S.wall.path); g.strokeStyle = 'rgba(29,22,16,0.45)'; g.lineWidth = 1.2;
    for (let y = L.house.wallTop + 22; y < L.house.wallBot; y += 22) { g.beginPath(); g.moveTo(L.house.wallX0, y); g.lineTo(W, y); g.stroke(); }
    g.restore();
    fillP(g, S.wallCap.path, MO); g.fillStyle = ZHU; g.fillRect(L.house.wallX0 - 10, L.house.wallTop + 2, W, 3);
    fillP(g, S.gate.path, MO); fillP(g, S.gateRoof.path, MO, 2, ZHU);
    // the old 槐: ochre trunk with ink bark, ink limbs ending in small hooks
    g.strokeStyle = MO; JQ.drawBranches(g, 5, 0.82);
    S.tips.forEach(([x, y], i) => { if (i % 4) return; g.strokeStyle = ZHU; g.lineWidth = 2; g.beginPath(); g.arc(x + 4, y - 2, 5, Math.PI, TAU * 0.95); g.stroke(); });
    fillP(g, S.trunk.path, ZHE, 3);
    for (let i = 0; i < 4; i++) line(g, Array.from({ length: 9 }, (_, j) => [JQ.lerp(462, 498, j / 8) + (i - 1.5) * 9 + Math.sin(j * 1.3 + i) * 3, JQ.lerp(800, 500, j / 8)]), MO, 1.3);
  };
  const buildFront = g => {
    g.fillStyle = SILK2; g.beginPath(); g.rect(0, 0, W, H); g.rect(30, 30, W - 60, H - 60); g.fill('evenodd');
    g.fillStyle = ZHU; g.beginPath(); g.rect(32, 32, W - 64, H - 64); g.rect(36, 36, W - 72, H - 72); g.fill('evenodd');
    g.strokeStyle = MO; g.lineWidth = 2; g.strokeRect(40, 40, W - 80, H - 80);
    for (let x = 42, i = 0; x < W - 42; x += 28, i++) { g.fillStyle = i % 2 ? MO : ZHU; g.beginPath(); g.moveTo(x, 42); g.lineTo(x + 28, 42); g.lineTo(x + 14, 58); g.closePath(); g.fill(); }
    // the label: a strip of silk manuscript with cinnabar column rules (朱丝栏), clerical script, read right to left
    const x0 = LX0, x1 = LX1, y0 = LY0, y1 = LY1;
    g.fillStyle = 'rgba(214,180,128,0.92)'; g.fillRect(x0, y0, x1 - x0, y1 - y0);
    g.strokeStyle = MO; g.lineWidth = 2.4; g.strokeRect(x0, y0, x1 - x0, y1 - y0);
    g.strokeStyle = ZHU; g.lineWidth = 2; [x1 - 96, x1 - 152].forEach(x => { g.beginPath(); g.moveTo(x, y0 + 6); g.lineTo(x, y1 - 6); g.stroke(); });
    g.fillStyle = MO; g.textAlign = 'center'; g.textBaseline = 'top';
    g.font = `84px ${LI}`; JQ.vtext(g, '小雪', x1 - 48, y0 + 16, 98);
    g.fillStyle = ZHU; g.fillRect(x1 - 68, y0 + 222, 38, 22);
  };
  // the pentad, brushed onto the silk strip one character at a time at the head of each bar (two columns for 候二)
  const LX0 = 1640, LX1 = 1850, LY0 = 70, LY1 = 344;
  const houText = (g, t, h) => {
    const cols = h === 1 ? ['天气上升', '地气下降'] : [HOU[h]], b0 = h * BAR;
    g.fillStyle = MO; g.textAlign = 'center'; g.textBaseline = 'top'; g.font = `44px ${LI}`;
    let n = 0; cols.forEach((s, c) => [...s].forEach((ch, i) => { const a = h ? JQ.smooth(b0 + 0.05 + n * 0.08, b0 + 0.16 + n * 0.08, t) : 1; n++; if (a <= 0) return;
      g.globalAlpha = a; g.fillText(ch, LX1 - 124 - c * 56, LY0 + 16 + i * 50); }));
    g.globalAlpha = 1;
  };

  // ---------------------------------------------------------------- animated parts
  const RB = { cx: 300, cy: 300, rx: 200, ry: 228 };   // left of the engine's title strip (x 530–1390, y 90–320, 0.15–2.25 s)
  // a Han dragon head (as on the double-headed 虹 of the stone reliefs): open jaws, snout curl, swept horn, forked tongue
  const head = (g, x, y, ang, s) => {
    g.save(); g.translate(x, y); g.rotate(ang); g.scale(s, s);
    line(g, [[2, -12], [-14, -30], [-30, -32], [-36, -22]], MO, 4 / s); line(g, [[8, -14], [-2, -36], [-14, -46]], ZHU, 3 / s);
    for (let k = 0; k < 3; k++) line(g, [[-4 + k * 6, 10], [-16 + k * 6, 22], [-26 + k * 6, 20]], MO, 2 / s);
    line(g, [[50, 4], [78, 8], [90, 2]], ZHU, 2.4 / s); line(g, [[78, 8], [90, 14]], ZHU, 2.4 / s);
    const up = JQ.smoothPath([[-4, -14], [24, -20], [52, -14], [70, -10], [80, -20], [86, -12], [72, -2], [40, -2], [-4, 2]]);
    const lo = JQ.smoothPath([[-4, 6], [36, 6], [62, 12], [70, 20], [42, 20], [-4, 16]]);
    fillP(g, lo, ZHU, 2.4 / s); fillP(g, up, ZHU, 2.4 / s);
    line(g, [[10, -6], [34, -8], [56, -6]], FEN, 1.6 / s);
    g.fillStyle = FEN; g.beginPath(); g.ellipse(30, -11, 7, 4.5, -0.1, 0, TAU); g.fill(); g.strokeStyle = MO; g.lineWidth = 1.6 / s; g.stroke();
    g.fillStyle = MO; g.beginPath(); g.arc(31, -11, 2.6, 0, TAU); g.fill();
    g.restore();
  };
  const rainbow = (g, t) => {
    const f = JQ.ease((t - 0.3) / 1.6), shr = JQ.smooth(1.8, 2.45, t), a = 1 - shr, sc = (1 - 0.3 * f) * (1 - 0.8 * shr);
    const Ax = RB.cx, Ay = RB.cy - RB.ry;
    const half = sgn => { const al = Math.atan2(RB.ry, sgn * RB.rx), rot = f * (Math.PI / 2 - al), c = Math.cos(rot), s = Math.sin(rot), out = [];
      for (let i = 0; i <= 24; i++) { const th = Math.PI / 2 - sgn * i / 24 * Math.PI / 2, u = RB.rx * Math.cos(th), v = RB.ry - RB.ry * Math.sin(th);
        out.push([Ax + (u * c - v * s) * sc, Ay + (u * s + v * c) * sc]); } return out; };
    const l = half(-1), r = half(1), all = [...l.reverse(), ...r.slice(1)];
    if (a > 0.01) {
      g.globalAlpha = a;
      fillP(g, JQ.smoothPath(taper(all, () => 50 * sc)), ZHU, 2.6);
      fillP(g, JQ.smoothPath(taper(all, () => 30 * sc)), FEN);
      fillP(g, JQ.smoothPath(taper(all, () => 13 * sc)), LV);
      for (let i = 2; i < all.length - 2; i += 2) { const [x, y] = all[i]; g.strokeStyle = MO; g.lineWidth = 1.2; g.beginPath(); g.arc(x, y, 9 * sc, 0.2, Math.PI - 0.2); g.stroke(); }
      const e0 = all[0], e1 = all[1], e2 = all[all.length - 1], e3 = all[all.length - 2];
      head(g, e0[0], e0[1], Math.atan2(e0[1] - e1[1], e0[0] - e1[0]), 1.85 * sc);
      head(g, e2[0], e2[1], Math.atan2(e2[1] - e3[1], e2[0] - e3[0]), 1.85 * sc);
      g.globalAlpha = 1;
    }
    // the cloud the rainbow was put into rides up with the heaven qi in 候二
    const ca = JQ.smooth(1.6, 2.1, t) * (1 - JQ.smooth(4.2, 4.8, t)), up = 300 * JQ.ease((t - 3.2) / 1.6);
    cloud(g, Ax + 10, Ay - 8 - up, 34 + 22 * JQ.smooth(1.8, 2.5, t), -1, 1, ZHU, FEN, ca, 2.4);
  };
  // heaven qi rises (dir -1), earth qi sinks (dir +1): a slow drift, plus one big shove of a whole row centred on the impact.
  // Heaven columns are kept clear of the 槐's crown so the scrolls and the limbs don't tangle.
  const qoff = t => 0.06 * t + JQ.ease((t - 3.2) / 1.6);
  const HEAV = [850, 1050, 1250, 1450, 1565].map((x, i) => ({ x, ph: JQ.hash(i, 2), r: 34 + JQ.hash(i, 3) * 12, hand: i % 2 ? 1 : -1, c: i % 3 === 0 ? ZHU : i % 3 === 1 ? LV : '#C98B4C' }));
  const EARTH = [110, 300, 520, 820, 1000, 1180, 1330].map((x, i) => ({ x, ph: JQ.hash(i, 7), r: 28 + JQ.hash(i, 8) * 8, hand: i % 2 ? -1 : 1, c: i % 2 ? MO : '#3A2414' }));
  const qi = (g, t, list, y0, y1, dir, spacing) => {
    for (const q of list) for (let row = -1; row < Math.ceil((y1 - y0) / spacing) + 1; row++) {
      const fr = (q.ph + qoff(t)) % 1, yy = dir < 0 ? y1 - (row + fr) * spacing : y0 + (row + fr) * spacing;
      const k = dir < 0 ? (yy - y0) / (y1 - y0) : (y1 - yy) / (y1 - y0);
      const a = JQ.smooth(0, 0.22, k) * JQ.smooth(1.02, 0.8, k);
      cloud(g, q.x + Math.sin(yy * 0.012 + q.ph * 6) * 16, yy, q.r, dir, q.hand, q.c, dir < 0 ? FEN : '#C98B4C', a * (dir < 0 ? 0.92 : 0.8), 3);
    }
  };
  // 候二: the twined pair in the middle tier, torn apart; at the impact both pierce the bands, which flash
  const PC = [960, 594];
  const pair = (g, t) => {
    if (t < BAR - 0.15) return;
    const ap = JQ.smooth(BAR - 0.15, BAR + 0.35, t) * (1 - JQ.smooth(5.0, 5.9, t)), sep = JQ.ease((t - 3.2) / 1.6), sw = (t - BAR) * 3.4, rr = 50 * (1 - sep), drift = 60 * Math.max(0, t - 4.6);
    if (ap <= 0.01) return;
    const hx = PC[0] + Math.cos(sw) * rr, hy = PC[1] - 310 * sep + Math.sin(sw) * rr * 0.4 - drift, ex = PC[0] - Math.cos(sw) * rr, ey = PC[1] + 330 * sep - Math.sin(sw) * rr * 0.4 + drift;
    cloud(g, ex, ey, 60, 1, -1, MO, '#C98B4C', ap, 2.6); cloud(g, hx, hy, 62, -1, 1, ZHU, FEN, ap, 2.6);
    const fl = JQ.smooth(3.88, IMP, t) * (1 - JQ.smooth(IMP, 4.7, t));
    if (fl > 0.01) {
      const e = Math.max(0, t - 3.88);
      [[hx, (B1[0] + B1[1]) / 2], [ex, (B2[0] + B2[1]) / 2]].forEach(([x, m]) => {
        g.fillStyle = JQ.rgba(FEN, 0.55 * fl); const w = 120 + e * 2600; g.fillRect(x - w / 2, m - 9, w, 18);
        g.strokeStyle = JQ.rgba(ZHU, fl); g.lineWidth = 4; for (let k = 0; k < 2; k++) { const r = 40 + e * (300 + k * 160); g.beginPath(); g.ellipse(x, m, r, r * 0.22, 0, 0, TAU); g.stroke(); }
      });
    }
  };
  const SNOW = Array.from({ length: 54 }, (_, i) => ({ x: 50 + JQ.hash(i, 11) * 1820, ph: JQ.hash(i, 12), r: 3.2 + JQ.hash(i, 13) * 2.6 }));
  const snow = (g, t) => {
    const more = JQ.smooth(5.4, 6.6, t); g.fillStyle = FEN;
    SNOW.forEach((f, i) => { if (i >= 24) { if (more <= 0) return; g.globalAlpha = more; }
      for (let row = 0; row < 8; row++) {
        const y = 40 + (row + (f.ph + t / 4) % 1) * 140; if (y > 1040) continue;
        const x = f.x + Math.sin(t * Math.PI / 2 + f.ph * 9 + row) * 10;
        g.beginPath(); g.arc(x, y, f.r, 0, TAU); g.fill();
      } });
    g.globalAlpha = 1;
  };
  // 候三: the gate's two leaves swing shut (5.5 → 6.6 s), the chimney smoke curls in on itself
  // the gate stays open (the family stands in front of it all winter); 闭塞 shows instead in the house window, whose two
  // cinnabar shutters swing shut 5.5 → 6.6 s, and in the chimney smoke curling in on itself
  const WB = (() => { const xs = S.window.pts.map(p => p[0]), ys = S.window.pts.map(p => p[1]); return [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)]; })();
  const gate = (g, t) => {
    const k = JQ.ease((t - 5.5) / 1.1), H = L.house, cx = (H.gateX0 + H.gateX1) / 2, hw = (H.gateX1 - H.gateX0) / 2;
    g.save(); g.clip(S.gate.path);
    [-1, 1].forEach(sd => { const xo = cx + sd * hw, xi = xo - sd * hw * 0.22; g.fillStyle = ZHU; g.fillRect(Math.min(xo, xi), H.gateTop - 4, Math.abs(xo - xi), H.wallBot - H.gateTop + 4);
      g.strokeStyle = MO; g.lineWidth = 2.2; g.strokeRect(Math.min(xo, xi), H.gateTop - 4, Math.abs(xo - xi), H.wallBot - H.gateTop + 4); });
    g.restore();
    const [x0, y0, x1, y1] = WB, wc = (x0 + x1) / 2, wh = (x1 - x0) / 2;
    g.save(); g.clip(S.window.path);
    [-1, 1].forEach(sd => { const xo = wc + sd * (wh + 2), w = (wh + 2) * JQ.lerp(0.12, 1, k), xi = xo - sd * w, a = Math.min(xo, xi), b = Math.abs(xo - xi);
      g.fillStyle = ZHU; g.fillRect(a, y0 - 2, b, y1 - y0 + 4); g.strokeStyle = MO; g.lineWidth = 2; g.strokeRect(a, y0 - 2, b, y1 - y0 + 4);
      g.lineWidth = 1.2; for (let j = 1; j < 3; j++) { const y = y0 + j * (y1 - y0) / 3; g.beginPath(); g.moveTo(a + 3, y); g.lineTo(a + b - 3, y); g.stroke(); } });
    g.restore();
    const sk = 1 - k * 0.85;
    cloud(g, L.smoke[0] + 14, L.smoke[1] - 30 * sk, 22 * sk + 6, -1, 1, '#C9B593', FEN, 0.9 * sk + 0.1, 2.6);
  };
  // the family in the manner of the silk: flat mineral colours inside an iron-wire ink line; ink dapples on the cattle
  const PENS = { woman: { skin: FEN, hair: MO, coat: LV, pants: MO, apron: ZHE, hat: ZHE, scarf: ZHE, cape: '#C98B4C', eye: MO },
    kid: { skin: FEN, hair: MO, coat: ZHU, pants: MO, apron: ZHE, hat: '#C98B4C', scarf: '#C98B4C', cape: '#C98B4C', eye: MO },
    ox: { ox: ZHE, oxDark: MO, horn: FEN, eye: MO }, calf: { calf: '#C98B4C', calfDark: MO, horn: FEN, eye: MO } };
  const PROPC = { straw: '#D9B06A', prop: '#7A4A22', metal: MO, red: ZHU, line: MO };
  const cast = (g, C) => {
    for (const it of C.items) {
      const pen = it.kind === 'actor' ? PENS[it.who] || {} : {}, s = JQ.STORY_S(it.y || 1000);
      g.save(); if (it.alpha != null && it.alpha < 1) g.globalAlpha = it.alpha;
      for (const p of it.parts) { const c = pen[p.role] || PROPC[p.role]; if (!c) continue; g.fillStyle = c; g.fill(p.path);
        if (p.role !== 'eye' && p.role !== 'line') { g.strokeStyle = MO; g.lineWidth = Math.max(1.8, 2.6 * s); g.lineJoin = 'round'; g.stroke(p.path); } }
      if (it.kind === 'actor' && (it.who === 'ox' || it.who === 'calf')) {
        const body = it.parts.reduce((a, p) => p.role === it.who && p.pts.length > (a ? a.pts.length : 0) ? p : a, null);
        if (body) { const xs = body.pts.map(q => q[0]), ys = body.pts.map(q => q[1]), x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
          g.save(); g.clip(body.path); g.fillStyle = 'rgba(29,22,16,0.5)';
          [[0.25, 0.35, 0.09], [0.5, 0.5, 0.06], [0.72, 0.3, 0.075]].forEach(([u, v, r]) => { g.beginPath(); g.ellipse(JQ.lerp(x0, x1, u), JQ.lerp(y0, y1, v), r * (x1 - x0), r * (x1 - x0) * 0.7, 0.3, 0, TAU); g.fill(); });
          g.restore(); }
      }
      g.restore();
    }
  };

  JQ.ART[20] = {
    key: IMP, keyHou: JQ.TERMS[19].keyHou, focus: [[RB.cx, RB.cy - 100], [PC[0], PC[1]], [1700, 640]], frame: true,
    draw(g, t, Sx) {
      t = JQ.clamp(t, 0, 9); const h = Math.min(2, Math.floor(t / BAR));
      JQ.blit(g, JQ.cached('s20bg', Sx, buildBg));
      g.save(); g.beginPath(); g.rect(0, 0, W, B1[0]); g.clip(); qi(g, t, HEAV, 30, B1[0], -1, 170); g.restore();
      g.save(); g.beginPath(); g.rect(0, 0, W, B1[0] - 6); g.clip(); rainbow(g, t); g.restore();
      JQ.blit(g, JQ.cached('s20mid', Sx, buildMid));
      // 闭塞: the two tier bands thicken toward the village as the window shuts, sealing the middle tier in
      const sk = JQ.ease((t - 5.5) / 1.1); if (sk > 0) { const d = 18 * sk; band(g, B1[1] + 6, B1[1] + 6 + d); g.save(); g.beginPath(); g.rect(0, 0, L.house.wallX0, H); g.clip(); band(g, B2[0] - 6 - d, B2[0] - 6); g.restore(); }
      gate(g, t);
      g.save(); g.beginPath(); g.rect(0, B2[1], W, H - B2[1]); g.clip(); qi(g, t, EARTH, B2[1], H - 30, 1, 150); g.restore();
      pair(g, t);
      cast(g, JQ.castFor(Sx, t));
      snow(g, t);
      JQ.blit(g, JQ.cached('s20front', Sx, buildFront));
      houText(g, t, h);
    },
  };
})();
