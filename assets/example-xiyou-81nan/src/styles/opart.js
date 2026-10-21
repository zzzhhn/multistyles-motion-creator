// 61 欧普 · 路阻狮驼 — Riley / Vasarely: black and white stripes only. 狮驼岭 is drawn by nothing but a phase flip:
// inside the ridge the stripes run half a period out of step, follow the contour and crowd closer. Two camel humps on
// the left, a maned lion peak on the right with a bullseye eye. 太白金星 waits by the road, visible only as stripes out
// of phase; beat 2 his stripes slide into step and he dissolves. Beat 3 the lion's eye fires a shock ring across everything.
(() => {
  'use strict';
  const XY = window.XY, K = XY.KIT_G, TAU = XY.TAU;
  const BK = '#111111', WH = '#F3F1EA', P = 18, HALF = P / 2;
  const LION = [868, 362], EYE = [916, 330], EYE2 = [820, 330], MOUTH = [868, 456], VANISH = 2.6, REVEAL = 3.4, EYES = 4.0, SHOCK = 4.4, OLD = 872, DX = 14;   // v10: 8 beats
  const peak = (x, c, w, h) => h * Math.exp(-Math.pow((x - c) / w, 2));
  const ridge = x => 612 - peak(x, 250, 92, 230) - peak(x, 438, 104, 276) - peak(x, 868, 128, 372)
    - 30 * Math.max(0, Math.sin((x - 740) / 22)) * XY.smooth(1 - Math.abs(x - 880) / 150);
  // phase fields (design px): outside the ridge, inside it
  const common = (x, y, t, b) => { const r = Math.hypot(x - MOUTH[0], y - MOUTH[1]);
    let d = 6 * Math.sin(r * 0.075 - t * 3) * Math.exp(-r / 230) + 2.2 * Math.sin(x * 0.045 + t * 7) * Math.sin(y * 0.03 - t * 3);
    if (b > SHOCK) { const R = (b - SHOCK) * 700, a = 23 * Math.exp(-(b - SHOCK) * 0.6); d += a * Math.sin((r - R) * 0.036) * Math.exp(-Math.pow((r - R) / 95, 2)); }
    return d; };
  const outside = (x, y, t, b) => common(x, y, t, b);
  const inside = (x, y, t, b) => HALF + 0.62 * (ridge(x) - 612) + 0.22 * (y - ridge(x)) + common(x, y, t, b);
  // black stripes of a phase field as one path: boundary j sits where y + D(x, y) = j·HALF (solved by fixed-point)
  const stripes = (g, D, W, y0, y1, t, b, shift = 0, x0 = 0, x1 = W) => {
    const xs = []; for (let x = x0; x <= x1 + DX; x += DX) xs.push(Math.min(x, x1));
    const j0 = Math.floor((y0 - 140) / HALF), j1 = Math.ceil((y1 + 260) / HALF), row = j => xs.map(x => { let y = j * HALF; for (let it = 0; it < 3; it++) y = j * HALF - D(x, y, t, b) - shift; return y; });
    g.beginPath(); let prev = null;
    for (let j = j0 - ((j0 % 2) + 2) % 2; j <= j1; j++) { const r = row(j); if (j % 2 === 0) prev = r; else if (prev) {
      g.moveTo(xs[0], prev[0]); for (let i = 1; i < xs.length; i++) g.lineTo(xs[i], prev[i]); for (let i = xs.length - 1; i >= 0; i--) g.lineTo(xs[i], r[i]); g.closePath(); prev = null; } }
    g.fillStyle = BK; g.fill();
  };
  const ridgePath = (g, W) => { g.beginPath(); g.moveTo(0, 702); for (let x = 0; x <= W; x += 8) g.lineTo(x, ridge(x)); g.lineTo(W, 702); g.closePath(); };
  // 太白金星 as an old man with a tall staff, facing the pilgrims
  const oldMan = (t, b) => { const x = OLD, s = 0.3 * Math.sin(t * 5) * (b < VANISH ? 1 : 0), k = 1.5, kx = 2.1, m = pts => pts.map((v, i) => i % 2 ? 702 + (v - 702) * k : x + (v - x) * kx);
    const body = m([x - 22, 702, x - 30, 640, x - 26, 590, x - 14, 566, x - 22, 548, x - 16, 524, x - 2, 516, x + 12, 524, x + 16, 546, x + 10, 566, x + 24, 590, x + 30, 640, x + 28, 702]);
    const beard = m([x - 16, 544, x - 22, 566, x - 24, 604, x - 18, 640, x - 10, 612, x - 4, 580, x + 2, 552]);
    const hat = m([x - 20, 522, x - 4, 486, x + 6, 490, x + 16, 522]);
    const st = [x - 78, 704, x - 78 + Math.sin(s) * 330, 704 - Math.cos(s) * 330];
    const wh = [x - 46, 612, x - 70, 560 + 4 * Math.sin(t * 3)];   // 拂尘: handle base → plume root
    return { body, beard, hat, st, wh }; };
  const PEN_HALO = { color: () => WH, outline: WH, ow: 8, shade: false, fine: false };
  const penFor = S => {
    const diag = K.lines(S, BK, WH, 7, 3.5, 45), diag2 = K.lines(S, BK, WH, 6, 3, -45), vert = K.lines(S, BK, WH, 6, 3, 90), hor = K.lines(S, BK, WH, 8, 4.2, 0), chk = K.checker(S, BK, WH, 4), dot = K.dots(S, BK, WH, 7, 2.1);
    const M = { fur: vert, wkshirt: diag, tiger: hor, stripe: BK, staff: BK, ink: BK, hoof: BK, red: BK, saddle: chk, robe: dot, kasaya: chk, bjrobe: BK, bjpants: diag2, wood: BK, ssrobe: vert, ssrobe2: diag, ssh: BK, ssbeard: BK, bundle: hor, horse2: dot };
    return { color: r => M[r] || WH, outline: BK, ow: 2, shade: false };
  };
  const actsAt = b => ({ wukong: { shade: K.win(b, 1.2, 2.6, 0.25), raise: K.win(b, EYES + 0.2, 6.6, 0.3) }, monk: { palm: K.win(b, 1.8, 3.2, 0.3) }, bajie: { scratch: K.win(b, 5, 6.4, 0.3) }, shaseng: { lift: K.win(b, SHOCK, 6.2, 0.3) } });
  const polys = (g, list) => { g.beginPath(); list.forEach(p => { g.moveTo(p[0], p[1]); for (let k = 2; k < p.length; k += 2) g.lineTo(p[k], p[k + 1]); g.closePath(); }); };

  XY.STYLES.opart = {
    hits: [VANISH, EYES],
    bg(g, W, H) { g.fillStyle = WH; g.fillRect(0, 0, W, H); },
    draw(g, e) {
      const { W, H, t, u, S } = e, b = e.beat, acts = actsAt(b);
      // far: the field, then the ridge in its own out-of-step stripes
      g.save(); g.beginPath(); g.rect(0, 0, W, 702); g.clip(); stripes(g, outside, W, 0, 702, t, b);
      ridgePath(g, W); g.clip(); g.fillStyle = WH; g.fillRect(0, 150, W, 560); stripes(g, inside, W, -120, 702, t, b); g.restore();
      // the lion: its maned face surfaces out of the lion peak (3.4), the eyes snap open (4.0), it roars (4.4)
      const rv = XY.easeIO(K.ramp(b, REVEAL, 0.55)), eo = XY.clamp(K.ramp(b, EYES, 0.12) * 1.15), roar = K.win(b, SHOCK, SHOCK + 1.4, 0.15), shake = 5 * roar * Math.sin(t * 40);
      if (rv > 0) {
        const L = [LION[0] + shake, LION[1]], mane = []; for (let k = 0; k < 44; k++) { const a = k / 44 * TAU, r = (k % 2 ? 158 : 206 + 10 * XY.hash(k, 61)) * (0.9 + 0.1 * rv) + 8 * roar * Math.sin(t * 9 + k); mane.push(L[0] + Math.cos(a) * r, L[1] + Math.sin(a) * r * 0.96); }
        g.save(); XY.path(g, mane, true); g.clip(); g.fillStyle = WH; g.fillRect(L[0] - 240, L[1] - 240, 480, 480);
        stripes(g, (x, y, tt, bb) => inside(x, y, tt, bb) + HALF * rv + 7 * rv * Math.sin(Math.atan2(y - L[1], x - L[0]) * 11 + Math.hypot(x - L[0], y - L[1]) * 0.05), W, L[1] - 240, L[1] + 240, t, b, 0, L[0] - 240, L[0] + 240); g.restore();
        g.strokeStyle = BK; g.lineWidth = 4 * rv; XY.path(g, mane, true); g.stroke();
        // the face: Vasarely rings spreading out from the nose
        const F = [L[0], L[1] + 16], n = Math.floor(rv * 11);
        g.save(); g.beginPath(); g.ellipse(F[0], F[1], 122, 132, 0, 0, TAU); g.clip(); g.fillStyle = WH; g.fill();
        g.strokeStyle = BK; g.lineWidth = 5; for (let k = 1; k <= n; k++) { g.beginPath(); g.ellipse(F[0], F[1] + 40, k * 13, k * 12, 0, 0, TAU); g.stroke(); } g.restore();
        g.strokeStyle = BK; g.lineWidth = 6; g.beginPath(); g.ellipse(F[0], F[1], 122, 132, 0, 0, TAU); g.stroke();
        [-1, 1].forEach(sd => { g.fillStyle = BK; g.beginPath(); g.arc(F[0] + sd * 92, F[1] - 104, 30, 0, TAU); g.fill(); g.fillStyle = WH; g.beginPath(); g.arc(F[0] + sd * 92, F[1] - 104, 14, 0, TAU); g.fill(); });
        // eyes: bullseyes that snap open, with heavy wedge brows
        [EYE2, EYE].forEach((E, i) => { const ex = E[0] + shake, sc = eo * (1 + 0.15 * Math.sin(Math.PI * Math.min(1, K.ramp(b, EYES, 0.3)))) + 0.2 * roar;
          if (sc > 0) for (let k = 0; k < 5; k++) { const r = (36 - k * 7.5) * sc; g.fillStyle = k % 2 ? WH : BK; g.beginPath(); g.ellipse(ex, E[1], Math.max(0.5, r), Math.max(0.5, r * (0.35 + 0.65 * eo)), 0, 0, TAU); g.fill(); }
          const sd = i ? 1 : -1; g.fillStyle = BK; XY.path(g, [ex - 40 * sd, E[1] - 52 + 10 * roar, ex + 34 * sd, E[1] - 34, ex + 30 * sd, E[1] - 24, ex - 42 * sd, E[1] - 40 + 10 * roar], true); g.fill(); });
        // nose, muzzle, whiskers, the mouth that opens on the roar
        g.fillStyle = BK; XY.path(g, [F[0] - 30 + shake, F[1] + 24, F[0] + 30 + shake, F[1] + 24, F[0] + shake, F[1] + 58], true); g.fill();
        const mo = 12 + 46 * roar; g.fillStyle = BK; g.strokeStyle = WH; g.lineWidth = 4; g.beginPath(); g.ellipse(MOUTH[0] + shake, MOUTH[1] + 20 + mo * 0.3, 54, mo, 0, 0, TAU); g.fill(); g.stroke();
        if (roar > 0.3) { g.fillStyle = WH; [[-34, 1], [34, 1], [-34, -1], [34, -1]].forEach(([dx, d]) => { const yy = MOUTH[1] + 20 + mo * 0.3 - d * mo * 0.85; XY.path(g, [MOUTH[0] + dx - 8 + shake, yy, MOUTH[0] + dx + 8 + shake, yy, MOUTH[0] + dx + shake, yy + d * 22], true); g.fill(); }); }
        g.strokeStyle = BK; g.lineWidth = 3; [-1, 1].forEach(sd => { for (let k = 0; k < 3; k++) { g.beginPath(); g.moveTo(F[0] + sd * 40 + shake, F[1] + 44 + k * 10); g.lineTo(F[0] + sd * (118 + 10 * k) + shake, F[1] + 30 + k * 18); g.stroke(); } });
      }
      // 太白金星: visible only as stripes half a period out of step, until they slide into step and he is gone
      const v = XY.smooth(K.ramp(b, VANISH, 0.4)), om = oldMan(t, b);
      if (v < 1) {
        g.save(); polys(g, [om.body, om.beard, om.hat]); g.clip(); g.fillStyle = WH; g.fillRect(OLD - 90, 380, 180, 330); stripes(g, inside, W, 380, 702, t, b, HALF * (1 - v), OLD - 90, OLD + 90); g.restore();
        { const q = 1 - v, fx = OLD - 8, fy = 452; g.save(); g.translate(fx, fy); g.scale(q, q); g.fillStyle = WH; g.strokeStyle = BK; g.lineWidth = 3;   // the old man's face
          g.beginPath(); g.ellipse(0, 0, 20, 24, 0, 0, TAU); g.fill(); g.stroke(); g.lineWidth = 2.6; g.beginPath(); g.arc(-8, -2, 5, 3.6, 5.8); g.stroke(); g.beginPath(); g.arc(-22, -2, 5, 3.6, 5.8); g.stroke();
          g.lineWidth = 5; g.strokeStyle = BK; g.beginPath(); g.moveTo(-30, -12); g.lineTo(-2, -10); g.stroke(); g.strokeStyle = WH; g.lineWidth = 3; g.stroke(); g.restore(); }
        { const q = 1 - v, bx = om.beard[12], by = om.beard[13], bd = om.beard.map((c, i) => i % 2 ? by + (c - by) * q : bx + (c - bx) * q);   // the white beard shrinks away
          XY.path(g, XY.RIG.spline(bd, true, 3), true); g.fillStyle = WH; g.fill(); g.strokeStyle = BK; g.lineWidth = 2.4 * q; g.stroke(); }
        { const q = 1 - v, [hx, hy, px, py] = om.wh; if (q > 0.05) { g.strokeStyle = BK; g.lineWidth = 5 * q; g.lineCap = 'round'; g.beginPath(); g.moveTo(hx, hy); g.lineTo(px, py); g.stroke();
          for (let j = 0; j < 9; j++) { const a = -2.4 + j * 0.12 + 0.1 * Math.sin(t * 3 + j); g.strokeStyle = WH; g.lineWidth = 5 * q; g.beginPath(); g.moveTo(px, py); g.quadraticCurveTo(px - 30 * q, py - 10, px + Math.cos(a) * 70 * q, py + 60 * q + Math.sin(a) * 10); g.stroke(); g.strokeStyle = BK; g.lineWidth = 1.2 * q; g.stroke(); } } }
        const lw = 4.5 * (1 - v); if (lw > 0.15) { g.lineJoin = 'round'; g.lineCap = 'round';
          [[WH, lw + 5], [BK, lw]].forEach(([c, w]) => { g.strokeStyle = c; g.lineWidth = w; polys(g, [om.body, om.beard, om.hat]); g.stroke(); g.beginPath(); g.moveTo(om.st[0], om.st[1]); g.lineTo(om.st[2], om.st[3]); g.lineWidth = w + 4; g.stroke(); });
          g.strokeStyle = WH; g.lineWidth = 4 * (1 - v); g.setLineDash([7, 7]); g.beginPath(); g.moveTo(om.st[0], om.st[1]); g.lineTo(om.st[2], om.st[3]); g.stroke(); g.setLineDash([]); }
      }
      // near: a perspective checkerboard floor; on the entrance a flip wave runs across it
      { const VP = [W / 2, 430], wave = (K.ramp(b, -0.1, 0.9)) * 44, cols = [];
        for (let c = -20; c <= 24; c++) cols.push(c);
        const ys = [704, 712, 722, 735, 750, 766, 784];
        g.fillStyle = WH; g.fillRect(0, 702, W, H - 702); g.fillStyle = BK; g.beginPath();
        for (let i = 0; i < ys.length - 1; i++) for (const c of cols) { if (((i + c) % 2 === 0) === (c + 20 < wave)) continue;
          const X = (xc, y) => VP[0] + (xc - VP[0]) * (y - VP[1]) / (704 - VP[1]), x0 = c * 60, x1 = x0 + 60;
          g.moveTo(X(x0, ys[i]), ys[i]); g.lineTo(X(x1, ys[i]), ys[i]); g.lineTo(X(x1, ys[i + 1]), ys[i + 1]); g.lineTo(X(x0, ys[i + 1]), ys[i + 1]); g.closePath(); }
        g.fill(); g.fillRect(0, 699, W, 6); }
      // the pilgrims, filled with stripes, checks and dots; the shock ring jolts them as it passes
      if (K.visible(e)) { const r = Math.hypot(e.procX - MOUTH[0], 600 - MOUTH[1]), R = (b - SHOCK) * 700, jolt = b > SHOCK ? 9 * Math.exp(-(b - SHOCK) * 0.8) * Math.exp(-Math.pow((r - R) / 90, 2)) : 0;
        XY.drawProcession(g, e.phase, e.procX, e.groundY - jolt, PEN_HALO, acts); XY.drawProcession(g, e.phase, e.procX, e.groundY - jolt, penFor(S), acts); }
      // 狮驼, vertical stripes against horizontal ones; the 61 in a bullseye seal
      // 狮驼 on a solid plate (R3: the striped letters fell apart into 犭师马它); the plate's edge carries the vertical stripes
      g.fillStyle = BK; g.fillRect(30, 40, 356, 196); g.fillStyle = K.lines(S, BK, WH, 8, 4, 90); g.fillRect(36, 46, 344, 184); g.fillStyle = WH; g.fillRect(50, 58, 316, 160);
      K.text(g, '狮驼', 208, 194, XY.font(150, '"PingFang SC", "Heiti SC", sans-serif', '600'), BK, { align: 'center' });
      for (let k = 0; k < 5; k++) { const r = 60 - k * 8 + (k ? 2 * Math.sin(t * 4 + k) : 0); g.fillStyle = k % 2 ? WH : BK; g.beginPath(); g.arc(W - 84, 92, r, 0, TAU); g.fill(); }
      g.fillStyle = BK; g.beginPath(); g.arc(W - 84, 92, 26, 0, TAU); g.fill();
      K.text(g, '61', W - 84, 104, XY.font(32, 'Futura, "Avenir Next", sans-serif', 'bold'), WH, { align: 'center' });
    },
  };
})();
