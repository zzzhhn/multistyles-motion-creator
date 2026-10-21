// 57 抽象表现 · 拯救疲癃 — an action painting that is the cure itself. A sick canvas (bile olive fields, grey skeins,
// a grey knot of illness in the middle) takes the five ingredients of 乌金丹 one splash per beat — 大黄 yellow, 锅灰
// soot, 巴豆 brown, 马尿 dribbling from the white horse, 无根水 running blue from the top edge. Beat 3: the black pill
// slams into the knot, the stuck 糯米饭团 is knocked flying, and cadmium red and yellow flood out from the hit.
(() => {
  'use strict';
  const XY = window.XY, K = XY.KIT_G, TAU = XY.TAU;
  const HIT = 4, THROW = 3.45, KNOT = [812, 330];   // v10: 8 beats; 悟空 throws the pill at 3.45, it lands on beat 4
  const SICK = { canvas: '#E3D9C2', f: ['#8C8864', '#6E6C5A', '#A29766'], ink: '#1B1814', sk: ['#5E5847', '#8D8A7C', '#2A2622', '#B4AA86', '#6E7454'], st: ['#4F4A3C', '#7C7A5E', '#9C9478'] };
  const HEAL = { canvas: '#EFE6D2', f: ['#E9B531', '#D3462A', '#F2E7CE'], ink: '#141210', sk: ['#D7301F', '#F2C230', '#F7F2E6', '#16130F', '#2F7FB8'], st: ['#D7301F', '#F2C230', '#F4EEE0'] };

  // ------------------------------------------------------------ paint marks
  const blobPts = (x, y, r, R, n = 14) => { const o = []; for (let k = 0; k < n; k++) { const a = k / n * TAU, d = r * (0.7 + 0.5 * R()); o.push(x + Math.cos(a) * d, y + Math.sin(a) * d); } return o; };
  const splat = (g, x, y, r, col, seed, k = 1) => {
    const R = XY.rng(seed); g.fillStyle = col;
    XY.path(g, XY.RIG.spline(blobPts(x, y, r * k, R), true, 3), true); g.fill();
    for (let i = 0; i < 26; i++) { const a = R() * TAU, d = r * k * (1.1 + R() * 1.9), s = r * (0.04 + 0.16 * R() * R()); g.beginPath(); g.arc(x + Math.cos(a) * d, y + Math.sin(a) * d, s * Math.min(1, k * 1.3), 0, TAU); g.fill(); }
    for (let i = 0; i < 7; i++) { const a = R() * TAU, l = r * k * (1.5 + R() * 1.2), w = r * 0.1, c = Math.cos(a), s = Math.sin(a);
      g.beginPath(); g.moveTo(x + c * r * 0.6 - s * w, y + s * r * 0.6 + c * w); g.lineTo(x + c * l, y + s * l); g.lineTo(x + c * r * 0.6 + s * w, y + s * r * 0.6 - c * w); g.fill(); }
  };
  const drip = (g, x, y, len, w, col) => { if (len <= 0) return; g.fillStyle = col; g.beginPath(); g.moveTo(x - w / 2, y); g.lineTo(x - w * 0.36, y + len); g.arc(x, y + len, w * 0.5, Math.PI, 0, true); g.lineTo(x + w / 2, y); g.fill(); };
  const skein = (g, R, x, y, n, col, w0, curl) => {
    // a poured line: long looping arcs (smooth turning), thickness pooling and thinning along its length, drops flung off
    let a = R() * TAU, px = x, py = y; const sd = Math.floor(R() * 1e4); g.strokeStyle = col; g.fillStyle = col; g.lineCap = 'round';
    for (let i = 0; i < n; i++) { a += curl * 0.22 * XY.noise1(i * 0.09, sd) + (R() - 0.5) * curl * 0.12; const st = 9 + R() * 8, nx = px + Math.cos(a) * st, ny = py + Math.sin(a) * st * 0.8;
      g.lineWidth = w0 * (0.15 + 1.6 * Math.max(0, XY.noise1(i * 0.17, sd + 1) + 0.35)); g.beginPath(); g.moveTo(px, py); g.lineTo(nx, ny); g.stroke();
      if (R() < 0.05) { g.beginPath(); g.arc(nx + (R() - 0.5) * 30, ny + (R() - 0.5) * 30, 1 + R() * w0 * 0.6, 0, TAU); g.fill(); }
      px = nx; py = ny; }
  };
  const stroke = (g, R, pts, w, col) => {      // a loaded house-painter's brush: body + bristle tracks
    const c = XY.RIG.spline(pts, false, 8); XY.path(g, XY.RIG.ribbon(c, w, w * (0.5 + 0.4 * R())), true); g.fillStyle = col; g.fill();
    for (let k = 0; k < 7; k++) { const o = (k / 6 - 0.5) * w * 0.8, sh = R() < 0.5 ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.14)', q = [];
      for (let i = 0; i < c.length; i += 2) q.push(c[i] + o * 0.2, c[i + 1] + o); g.strokeStyle = sh; g.lineWidth = 1.5 + R() * 2; XY.path(g, q, false); g.stroke(); }
  };
  // ------------------------------------------------------------ the two paintings (sick in bg, healed cached)
  const painting = (g, W, H, P, scale, healed) => {
    const R = XY.rng(healed ? 5702 : 5701);
    g.fillStyle = P.canvas; g.fillRect(0, 0, W, H);
    g.filter = `blur(${16 * scale}px)`; g.globalAlpha = 0.9;
    g.fillStyle = P.f[0]; g.fillRect(70, 60, W - 150, 260); g.fillStyle = P.f[1]; g.fillRect(90, 350, W - 170, 260); g.fillStyle = P.f[2]; g.fillRect(140, 300, W - 300, 70);
    g.filter = 'none'; g.globalAlpha = 1;
    for (let k = 0; k < 7; k++) { const y = 80 + R() * 520, x = R() * W * 0.5; stroke(g, R, [x, y, x + 200 + R() * 200, y + (R() - 0.5) * 160, x + 420 + R() * 300, y + (R() - 0.5) * 200], 34 + R() * 40, P.st[k % 3]); }
    for (let k = 0; k < 34; k++) skein(g, R, R() * W, 40 + R() * 620, 110, P.sk[k % P.sk.length], 3.6, 2.2);
    if (!healed) {   // the knot of illness: dense grey tangle, a sticky white clot at its heart
      for (let k = 0; k < 60; k++) { const a = R() * TAU, d = R() * 70; skein(g, R, KNOT[0] + Math.cos(a) * d, KNOT[1] + Math.sin(a) * d * 0.7, 26, ['#3A3630', '#9A978C', '#C9C3B0', '#55524A', '#211E1A'][k % 5], 5, 6); }
      g.strokeStyle = 'rgba(40,36,30,0.55)'; g.lineWidth = 3; for (let k = 0; k < 9; k++) { g.beginPath(); g.ellipse(KNOT[0], KNOT[1], 60 + k * 9, 44 + k * 7, R() * 3, R() * 3, R() * 3 + 4); g.stroke(); }
      g.fillStyle = '#E9E4D6'; XY.path(g, XY.RIG.spline(blobPts(KNOT[0], KNOT[1], 34, R), true, 3), true); g.fill();
    } else {
      for (let k = 0; k < 14; k++) { const a = k / 14 * TAU + R() * 0.2, l = 220 + R() * 300; stroke(g, R, [KNOT[0], KNOT[1], KNOT[0] + Math.cos(a) * l * 0.5, KNOT[1] + Math.sin(a) * l * 0.4 + 20, KNOT[0] + Math.cos(a) * l, KNOT[1] + Math.sin(a) * l * 0.7], 22 + R() * 22, P.st[k % 3]); }
      for (let k = 0; k < 18; k++) splat(g, R() * W, 60 + R() * 600, 10 + R() * 18, P.sk[k % 5], 5790 + k);
    }
    // the ground: one heavy black bar (Kline), running down the lower edge of the canvas
    g.fillStyle = P.ink; g.beginPath(); g.moveTo(0, 704); for (let x = 0; x <= W; x += 30) g.lineTo(x, 700 + 6 * XY.noise1(x / 60, 9)); g.lineTo(W, 730); for (let x = W; x >= 0; x -= 30) g.lineTo(x, 730 + 7 * XY.noise1(x / 50, 10)); g.fill();
    for (let k = 0; k < 18; k++) drip(g, 30 + k * 64 + R() * 30, 726, 8 + R() * 36, 4 + R() * 5, P.ink);
    // canvas weave
    g.globalAlpha = 0.06; g.fillStyle = '#000'; for (let y = 0; y < H; y += 3) g.fillRect(0, y, W, 1); for (let x = 0; x < W; x += 3) g.fillRect(x, 0, 1, H); g.globalAlpha = 1;
  };

  // ------------------------------------------------------------ the pilgrims: muted, then repainted vivid
  const hx = c => [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16)];
  const VIVID = { fur: '#8A4A22', face: '#F2D2A0', wkshirt: '#D7301F', tiger: '#F2C230', gold: '#F2C230', staff: '#D7301F', red: '#D7301F', kasaya: '#D7301F', robe: '#F2C230',
    horse: '#F7F2E6', horse2: '#D9D2C2', mane: '#F7F2E6', bjrobe: '#1E2A44', bjpants: '#141C2E', pig: '#F2A79A', pig2: '#D9786C', ssrobe: '#2F6F9A', ssrobe2: '#245676', bundle: '#F2C230', metal: '#F2C230' };
  const palette = h => { const o = {};
    for (const r in XY.DEFAULT_COLORS) { const v = hx(VIVID[r] || XY.DEFAULT_COLORS[r]), l = 0.3 * v[0] + 0.59 * v[1] + 0.11 * v[2], m = v.map(c => XY.lerp(l * 0.85 + 40, c, 0.25) * 0.82);
      const q = m.map((c, i) => Math.round(XY.lerp(c, v[i], h))); o[r] = `rgb(${q[0]},${q[1]},${q[2]})`; }
    o.ink = '#16130F'; o.stripe = '#16130F'; return o; };
  const PALS = [0, 0.25, 0.5, 0.75, 1].map(palette);
  const actsAt = b => ({ monk: { palm: K.win(b, 1.8, 4.4, 0.3) }, bajie: { scratch: K.win(b, 2.8, 3.8, 0.2) }, wukong: { strike: K.win(b, THROW - 0.25, THROW + 0.3, 0.12), raise: K.win(b, 4.6, 6.8, 0.3) }, shaseng: { lift: K.win(b, 4.9, 6.4, 0.3) } });
  const DRIPS = ['wukong.staffTip', 'wukong.chest', 'monk.horseChest', 'monk.saddle', 'bajie.belly', 'bajie.rakeHead', 'shaseng.bundleL', 'shaseng.bundleR'];
  // the five ingredients, one splash per half beat before the pill
  const INGR = [[1.6, 742, 268, 40, '#D9A21E'], [2.1, 900, 398, 46, '#141210'], [2.6, 860, 236, 30, '#6A4426'], [3.1, 700, 380, 30, '#E3D27A']];   // 大黄 锅灰 巴豆 马尿
  const floodPath = (g, b) => { const r = 1500 * XY.easeOut((b - HIT) / 2) + 20; g.beginPath();
    for (let k = 0; k < 48; k++) { const a = k / 48 * TAU, d = r * (0.82 + 0.3 * XY.noise1(k * 0.7, 57) + 0.08 * Math.sin(k * 3.1)); k ? g.lineTo(KNOT[0] + Math.cos(a) * d, KNOT[1] + Math.sin(a) * d * 0.8) : g.moveTo(KNOT[0] + Math.cos(a) * d, KNOT[1] + Math.sin(a) * d * 0.8); }
    g.closePath(); return r; };
  const YU = { x: 64, y: 340, f: XY.font(300, '"Xingkai SC", "Kaiti SC", serif', 'bold') };
  const yu = (g, col, under) => { K.text(g, '愈', YU.x, YU.y, YU.f, col, under ? { shadow: under, sx: -7, sy: 5 } : {}); };

  XY.STYLES.abstractexp = {
    hits: [HIT],
    bg(g, W, H, c, scale) { painting(g, W, H, SICK, scale, false); },
    draw(g, e) {
      const { W, H, t, u, S } = e, b = e.beat, acts = actsAt(b), h = XY.smooth((b - HIT - 0.2) / 1.1);
      // 愈, brushed in on the entrance as one wet gesture (sick grey)
      { const r = XY.easeOut(K.ramp(b, -0.1, 0.9)); if (r > 0) { g.save(); g.beginPath(); g.moveTo(YU.x - 40, YU.y - 300); g.lineTo(YU.x - 40 + 620 * r, YU.y - 300); g.lineTo(YU.x - 40 + 620 * r - 260, YU.y + 60); g.lineTo(YU.x - 40, YU.y + 60); g.clip(); yu(g, '#2E2B25', 'rgba(150,146,130,0.6)'); g.restore(); } }
      // a splash lands on every beat (action painting), sick colours before the pill, cadmium after
      for (let k = -3; k <= Math.floor(b); k++) { if (k === HIT) continue; const x = 120 + XY.hash(k + 9, 571) * (W - 240), y = 90 + XY.hash(k + 9, 572) * 520, gr = XY.easeOut(K.ramp(b, k, 0.1));
        splat(g, x, y, 12 + 14 * XY.hash(k + 9, 573), (k > HIT ? HEAL : SICK).sk[(k + 9) % 5], 5750 + k, gr); }
      INGR.forEach(([bk, x, y, r, col], i) => { if (b >= bk) splat(g, x, y, r, col, 5760 + i, XY.easeOut(K.ramp(b, bk, 0.1))); });
      // the flood of health from the point of impact
      if (b >= HIT) {
        const heal = XY.cached(`abx-heal:${S.toFixed(4)}`, W * S, H * S, cv => { const c = cv.getContext('2d'); c.scale(S, S); painting(c, W, H, HEAL, S, true); });
        g.save(); floodPath(g, b); g.clip(); g.drawImage(heal, 0, 0, W, H); yu(g, '#D7301F', '#F7F2E6'); g.restore();
        g.save(); g.strokeStyle = '#16130F'; g.lineWidth = 3; floodPath(g, b); g.stroke(); g.restore();
      }
      // 无根水: the Dragon King's rain runs down from the top edge in blue drips
      for (let k = 0; k < 9; k++) { const bk = 2.2 + k * 0.2, x = 560 + k * 52 + 20 * XY.hash(k, 574); if (b < bk) continue;
        const len = 330 * XY.easeOut((b - bk) / 3.2) * (0.6 + 0.4 * XY.hash(k, 575)); drip(g, x, 0, len, 5 + 3 * XY.hash(k, 576), '#3D7FB6');
        const f = ((t * 0.9 + XY.hash(k, 577)) % 1); if (len > 60) { g.fillStyle = '#3D7FB6'; g.beginPath(); g.arc(x, len + f * 300, 4, 0, TAU); g.fill(); } }
      // drips hanging off 愈
      [[150, 330], [236, 312], [300, 336]].forEach(([x, y], k) => drip(g, x, y, Math.max(0, 64 * XY.easeOut((b - 0.6 - k * 0.3) / 4)), 10, h > 0.5 ? '#D7301F' : '#2E2B25'));
      // 乌金丹: thrown at the canvas, it lands on the knot as a black disc with a wet gleam
      if (b >= THROW) {
        const q = XY.clamp((b - THROW) / (HIT - THROW)), land = b >= HIT, hd = e.at('wukong.hand', acts);
        if (!land) { const r = XY.lerp(14, 92, q * q), x = XY.lerp(hd[0], KNOT[0], q), y = XY.lerp(hd[1], KNOT[1], q) - 170 * Math.sin(Math.PI * q); g.fillStyle = '#0E0C0A'; g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill();
          g.strokeStyle = '#0E0C0A'; g.lineWidth = 3; for (let j = 1; j <= 3; j++) { const qq = Math.max(0, q - j * 0.08), xx = XY.lerp(hd[0], KNOT[0], qq), yy = XY.lerp(hd[1], KNOT[1], qq) - 170 * Math.sin(Math.PI * qq); g.beginPath(); g.arc(xx, yy, XY.lerp(14, 92, qq * qq) * 0.4, 0, TAU); g.stroke(); } }
        else { const k = 1 + 0.25 * K.hit(b, HIT, 0.15); splat(g, KNOT[0], KNOT[1], 92, '#0E0C0A', 5770, k);
          g.save(); g.globalAlpha = 0.5 + 0.35 * Math.sin(t * 3.1); g.strokeStyle = '#F7F2E6'; g.lineWidth = 7; g.lineCap = 'round'; g.beginPath(); g.arc(KNOT[0] - 8, KNOT[1] - 10, 58, 3.6, 4.6); g.stroke(); g.restore();
          for (let k2 = 0; k2 < 5; k2++) drip(g, KNOT[0] - 60 + k2 * 30, KNOT[1] + 70, 120 * XY.easeOut((b - HIT - k2 * 0.15) / 3), 10, '#0E0C0A'); }
      }
      // the pilgrims, painted with a loaded brush; paint keeps running off them
      if (K.visible(e)) {
        const pal = PALS[Math.round(h * 4)], pen = { color: r => pal[r], outline: '#16130F', ow: 2.6, wob: 1.4, seed: 57, shade: 'rgba(20,16,10,0.28)' };
        XY.drawProcession(g, e.phase, e.procX, e.groundY, pen, acts);
        DRIPS.forEach((key, k) => { const p = e.at(key, acts), f = (t * (0.5 + 0.3 * XY.hash(k, 578)) + XY.hash(k, 579)) % 1, col = pal[['staff', 'wkshirt', 'horse', 'kasaya', 'pig', 'metal', 'bundle', 'bundle'][k]];
          drip(g, p[0] + 3, p[1] + 2, 6 + 26 * f, 5, col); if (f > 0.8) { g.fillStyle = col; g.beginPath(); g.arc(p[0] + 3, p[1] + 34 + (f - 0.8) * 400, 3.5, 0, TAU); g.fill(); } });
        // 马尿: at beat 2 the white horse obliges, a few pale-yellow drops for the pill
        if (b > 2.8 && b < 3.9) for (let k = 0; k < 6; k++) { const bk = 2.8 + k * 0.1; if (b < bk) continue; const hc = e.at('monk.horseChest', acts), dt = (b - bk) * XY.BEAT, y = hc[1] + 30 + 1400 * dt * dt;
          if (y < e.groundY) { g.fillStyle = '#E7D36A'; g.beginPath(); g.ellipse(hc[0] - 30, y, 3.2, 5, 0, 0, TAU); g.fill(); } }
      }
      // the stuck 糯米饭团, knocked out of the knot by the pill
      if (b >= HIT && b < HIT + 2) { const dt = (b - HIT) * XY.BEAT, x = KNOT[0] + 760 * dt, y = KNOT[1] - 1000 * dt + 1500 * dt * dt, a = dt * 9;
        g.strokeStyle = '#16130F'; g.lineWidth = 4; g.lineCap = 'round'; for (let k = 0; k < 4; k++) { const o = (k - 1.5) * 16; g.beginPath(); g.moveTo(x - 70 - 30 * k, y + o + 40); g.lineTo(x - 140 - 30 * k, y + o + 90); g.stroke(); }
        g.save(); g.translate(x, y); g.rotate(a); g.fillStyle = '#F4F0E4'; XY.path(g, XY.RIG.spline(blobPts(0, 0, 44, XY.rng(5780)), true, 3), true); g.fill(); g.strokeStyle = '#16130F'; g.lineWidth = 4.5; g.stroke();
        g.fillStyle = '#D9D2BE'; const R = XY.rng(5781); for (let k = 0; k < 20; k++) { g.beginPath(); g.ellipse((R() - 0.5) * 64, (R() - 0.5) * 58, 5.5, 2.6, R() * 3, 0, TAU); g.fill(); }
        g.restore(); }
      // the painter's number, scrawled
      K.text(g, 'No. 57', W - 36, 770, XY.font(40, '"Bradley Hand", "Chalkboard SE", cursive', 'bold'), '#16130F', { align: 'right' });
      drip(g, W - 128, 768, 10 + 8 * Math.sin(t), 4, '#16130F');
    },
  };
})();
