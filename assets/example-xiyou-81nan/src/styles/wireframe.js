// 69 早期 CG 线框 · 1990 年 · 无底洞遭困 — green vector graphics. A perspective grid, the 陷空山 range, a turning
// wireframe moon, and the huge boulder with the 无底洞 in its crown; being wireframe, the boulder is see-through and the
// shaft can be followed through it into the ground, rings shrinking to a point that is never the bottom. Beat 2: a helix
// of wind rises out of the hole and plucks Tang Seng alone off his horse; he spins in an arc into the hole and falls down
// the shaft while the depth readout runs past 300 里 to ∞. 悟空 drops the cell's only red thing, a peach, down after him;
// the wind brings the monk back to his saddle before the seam. Pilgrims: black fill + green outline (hidden-line wireframe).
(() => {
  'use strict';
  const XY = window.XY, K = XY.KIT_H, TAU = XY.TAU, { sin, cos, PI, floor } = Math;
  const GR = '#39FF6A', DIM = 'rgba(57,255,106,0.38)', RED = '#FF4A64', YH = 440, VPX = 590;
  const HOLE = [985, 524], SHAFT_END = [985, 792], RR = 56;
  const PEN = { color: () => '#000', outline: GR, ow: 1.25, fine: false, shade: false };

  const line = (g, pts, closed) => { XY.path(g, pts, closed); g.stroke(); };
  const ellipseRing = (cx, cy, rx, ry, n, a0 = 0) => { const o = []; for (let k = 0; k <= n; k++) { const a = a0 + k / n * TAU; o.push(cx + cos(a) * rx, cy + sin(a) * ry); } return o; };
  // front half of an ellipse bright, back half dim (depth cue for see-through rings)
  const ring = (g, cx, cy, rx, ry, a = 1) => { g.globalAlpha = a; g.strokeStyle = DIM; g.beginPath(); g.ellipse(cx, cy, rx, ry, 0, PI, TAU); g.stroke(); g.strokeStyle = GR; g.beginPath(); g.ellipse(cx, cy, rx, ry, 0, 0, PI); g.stroke(); g.globalAlpha = 1; };

  // ------------------------------------------------------------ static geometry
  const ZS = [1.0, 1.15, 1.35, 1.6, 2, 2.5, 3.2, 4.2, 6, 9, 14];
  const grid = (g, W) => { g.strokeStyle = GR; g.lineWidth = 1.2;
    for (let i = -16; i <= 16; i++) { const xb = VPX + i * 112; g.globalAlpha = 0.55 - Math.abs(i) * 0.015; line(g, [VPX + (xb - VPX) * 0.02, YH + 6.8, xb, 780]); }
    ZS.forEach(z => { const y = YH + 340 / z; g.globalAlpha = Math.min(0.75, 0.25 + 0.5 / z); line(g, [0, y, W, y]); }); g.globalAlpha = 1; };
  const PEAKS = [[-20, 0], [60, 70], [140, 30], [230, 120], [330, 50], [420, 150], [520, 60], [600, 95], [690, 40], [790, 175], [900, 70], [980, 110], [1080, 45], [1200, 0]];
  const mountains = g => { g.strokeStyle = GR; g.lineWidth = 1.4; line(g, PEAKS.flatMap(([x, h]) => [x, YH - h]));
    g.strokeStyle = DIM; g.lineWidth = 1; PEAKS.forEach(([x, h], k) => { if (h < 60) return; line(g, [x, YH - h, x + 18 + (k % 3) * 10, YH]); line(g, [x, YH - h, x - 24 - (k % 2) * 12, YH]); }); };
  // the boulder: three jittered rings joined by struts and diagonals, the hole rim in its crown
  const ROCK = (() => { const L = [[642, 168, 18], [588, 150, 16], [538, 104, 12]], n = 14, R = XY.rng(69);
    return L.map(([y, rx, ry]) => { const o = []; for (let k = 0; k < n; k++) { const a = k / n * TAU, j = 0.88 + 0.22 * R(); o.push([HOLE[0] + cos(a) * rx * j, y + sin(a) * ry * j + (R() - 0.5) * 8, sin(a)]); } return o; }); })();
  const rock = (g, front) => { g.lineWidth = 1.3; const n = ROCK[0].length;
    const seg = (p, q) => { const fr = p[2] + q[2] > 0; if (fr !== front) return; g.strokeStyle = fr ? GR : DIM; line(g, [p[0], p[1], q[0], q[1]]); };
    ROCK.forEach(L => { for (let k = 0; k < n; k++) seg(L[k], L[(k + 1) % n]); });
    for (let l = 0; l < 2; l++) for (let k = 0; k < n; k++) { seg(ROCK[l][k], ROCK[l + 1][k]); if (k % 2 === 0) seg(ROCK[l][k], ROCK[l + 1][(k + 1) % n]); }
    if (front) for (let k = 0; k < n; k += 2) { const p = ROCK[2][k]; g.strokeStyle = p[2] > 0 ? GR : DIM; line(g, [p[0], p[1], HOLE[0] + (p[0] - HOLE[0]) * 0.55, HOLE[1] + (p[1] - HOLE[1]) * 0.4]); } };
  // the shaft: rings from the rim down to a vanishing point below the frame, flowing deeper all the time
  const shaft = (g, flow) => { g.lineWidth = 1.3;
    for (let k = 0; k < 16; k++) { const q = (k + flow % 1) / 16, f = Math.pow(q, 0.8), y = XY.lerp(HOLE[1], SHAFT_END[1], 1 - Math.pow(1 - f, 2.2)), r = RR * Math.pow(1 - f, 1.6) + 2;
      ring(g, HOLE[0], y, r, r * 0.22, 1 - q * 0.7); }
    g.strokeStyle = DIM; for (let k = 0; k < 8; k++) { const a = k / 8 * TAU; line(g, [HOLE[0] + cos(a) * RR, HOLE[1] + sin(a) * 12, SHAFT_END[0], SHAFT_END[1]]); }
    g.strokeStyle = GR; g.lineWidth = 2; g.beginPath(); g.ellipse(HOLE[0], HOLE[1], RR, 12, 0, 0, TAU); g.stroke(); };
  // a wireframe sphere (latitude + longitude), turning
  const sphere = (g, cx, cy, r, rot, col, tilt = 0.35) => { g.lineWidth = 1.1;
    for (let k = 1; k < 6; k++) { const la = -PI / 2 + k * PI / 6, y = cy + sin(la) * r * cos(tilt), rr = cos(la) * r; g.strokeStyle = col; g.globalAlpha = 0.8; g.beginPath(); g.ellipse(cx, y, rr, rr * sin(tilt), 0, 0, TAU); g.stroke(); }
    for (let k = 0; k < 8; k++) { const lo = rot + k * PI / 8, w = cos(lo) * r; g.globalAlpha = sin(lo) > 0 ? 0.85 : 0.3; g.strokeStyle = col; g.beginPath(); g.ellipse(cx, cy, Math.abs(w), r, 0, 0, TAU); g.stroke(); }
    g.globalAlpha = 1; };

  // ------------------------------------------------------------ the abduction (8 beats at 90 BPM): the mouse spirit rises out of the hole, reaches,
  // grabs Tang Seng off the saddle on beat 4 (stretched like a dragged vertex), drags him down; the reverse wind brings him back by u = 0.92
  const RISE = 0.3, GRAB = 0.5, BACK = 0.92;
  const seatAt = (c, u) => { const t = c.t0 + u * c.dur, a = XY.anchor('monk.saddle', XY.walkPhase(t), {}); return [XY.procWorldX(t) - c.x + a[0], XY.LAYOUT.GROUND + a[1]]; };
  const bez = (a, b, c, q) => { const m = 1 - q; return [m * m * a[0] + 2 * m * q * b[0] + q * q * c[0], m * m * a[1] + 2 * m * q * b[1] + q * q * c[1]]; };
  const RIM = [HOLE[0], HOLE[1] - 8], DEEP = [SHAFT_END[0], SHAFT_END[1] - 8];
  // the mouse spirit's head position: hidden → peeks → rises → sinks with her catch
  const ratAt = u => { if (u < RISE) return null; const up = XY.easeOut((u - RISE) / 0.16), down = XY.easeIn((u - 0.56) / 0.08); if (down >= 1) return null;
    return [HOLE[0] - 10, XY.lerp(HOLE[1] + 10, HOLE[1] - 170, up) + XY.lerp(0, 260, down), 1 - 0.6 * down]; };
  const flight = (c, u) => {   // → null (in the saddle) | { P, s, sx, sy, rot } | { gone }
    if (u < GRAB || u >= BACK) return null;
    const S0 = seatAt(c, GRAB);
    if (u < 0.53) { const k = XY.smooth((u - GRAB) / 0.03); return { P: [S0[0] + 30 * k, S0[1] - 20 * k], s: 1, sx: 1 - 0.3 * k, sy: 1 + 0.55 * k, rot: -0.5 * k }; }
    if (u < 0.6) { const q = XY.easeIn((u - 0.53) / 0.07), r = ratAt(u) || [HOLE[0], HOLE[1]]; return { P: bez([S0[0] + 30, S0[1] - 20], [(S0[0] + r[0]) / 2, r[1] - 60], [r[0] + 20, r[1] + 40], q), s: XY.lerp(1, 0.55, q), sx: 0.7 + 0.3 * q, sy: 1.55 - 0.55 * q, rot: -0.5 + q * 4 }; }
    if (u < 0.66) { const q = (u - 0.6) / 0.06; return { P: [RIM[0], XY.lerp(RIM[1], DEEP[1], 1 - Math.pow(1 - q, 2))], s: 0.55 * Math.pow(0.05 / 0.55, q), sx: 1, sy: 1, rot: 3.5 + q * 4 * PI }; }
    if (u < 0.8) return { gone: true };
    const q = (u - 0.8) / 0.12, S1 = seatAt(c, BACK);
    if (q < 0.35) { const r = q / 0.35; return { P: [RIM[0], XY.lerp(DEEP[1], RIM[1], r)], s: XY.lerp(0.05, 0.55, r), sx: 1, sy: 1, rot: -2 * TAU + r * TAU }; }
    const r = XY.easeOut((q - 0.35) / 0.65); return { P: bez(RIM, [(S1[0] + RIM[0]) / 2, 290], S1, r), s: XY.lerp(0.55, 1, r), sx: 1, sy: 1, rot: (1 - r) * -TAU };
  };
  // depth readout only ever grows: 0 → 300 → 9999 → ∞ and stays
  const depth = u => u < 0.58 ? 0 : u < 0.64 ? 300 * (u - 0.58) / 0.06 : u < 0.7 ? 300 + 9699 * Math.pow((u - 0.64) / 0.06, 2) : Infinity;
  // the mouse spirit (地涌夫人) in wireframe: skull, snout cone, round ears, whiskers, a hairpin, the body down into the hole, a reaching arm
  const rat = (l, r, u, t, reach) => {
    const [x, y, s] = r; l.lineWidth = 1.5; l.strokeStyle = GR;
    for (let k = 0; k < 5; k++) { const a = k / 5 * PI; l.globalAlpha = 0.9; l.beginPath(); l.ellipse(x, y, Math.abs(cos(a)) * 46 * s + 1, 42 * s, 0, 0, TAU); l.stroke(); }
    for (let k = 1; k < 4; k++) { const yy = y + (k - 2) * 18 * s, rr = Math.sqrt(Math.max(0, 1 - Math.pow((k - 2) * 18 / 42, 2))) * 46 * s; l.beginPath(); l.ellipse(x, yy, rr, rr * 0.25, 0, 0, TAU); l.stroke(); }
    const tip = [x - 104 * s, y + 18 * s], rim = []; for (let k = 0; k < 8; k++) { const a = k / 8 * TAU; rim.push([x - 34 * s, y + 6 * s + sin(a) * 26 * s, cos(a)]); }
    rim.forEach(p => { l.strokeStyle = p[2] > 0 ? GR : DIM; line(l, [p[0] + p[2] * 8 * s, p[1], tip[0], tip[1]]); }); l.strokeStyle = GR; l.beginPath(); l.ellipse(x - 34 * s, y + 6 * s, 9 * s, 26 * s, 0, 0, TAU); l.stroke();
    [[x - 6 * s, y - 50 * s], [x + 30 * s, y - 46 * s]].forEach(([ex, ey]) => { l.beginPath(); l.ellipse(ex, ey, 22 * s, 24 * s, 0.2, 0, TAU); l.stroke(); l.globalAlpha = 0.5; l.beginPath(); l.ellipse(ex, ey, 12 * s, 14 * s, 0.2, 0, TAU); l.stroke(); l.globalAlpha = 1; });
    l.strokeStyle = '#D8FFE4'; l.lineWidth = 2.4; const bl = floor(t * 3) % 5 === 0 ? 0.3 : 1; l.globalAlpha = bl; l.beginPath(); l.arc(x - 44 * s, y - 6 * s, 6 * s, 0, TAU); l.stroke(); l.fillStyle = '#D8FFE4'; l.beginPath(); l.arc(x - 44 * s, y - 6 * s, 2.4 * s, 0, TAU); l.fill(); l.globalAlpha = 1;
    l.strokeStyle = GR; l.lineWidth = 1.2; [[-6, -10], [0, 0], [6, 9]].forEach(([a, b]) => line(l, [tip[0] + 16 * s, tip[1] + a * s * 0.2, tip[0] - 30 * s, tip[1] + b * s]));
    l.lineWidth = 2; line(l, [x + 8 * s, y - 36 * s, x + 40 * s, y - 70 * s]); l.beginPath(); l.arc(x + 42 * s, y - 72 * s, 5 * s, 0, TAU); l.stroke();
    l.lineWidth = 1.4; for (let k = 0; k < 4; k++) { const yy = y + 40 * s + k * 26 * s, rr = (40 - k * 2) * s; l.strokeStyle = k % 2 ? DIM : GR; l.beginPath(); l.ellipse(x + 6 * s, yy, rr, rr * 0.3, 0, 0, TAU); l.stroke(); }
    l.strokeStyle = GR; const yb = Math.max(y + 120 * s, HOLE[1]); line(l, [x - 34 * s, y + 40 * s, HOLE[0] - 40, yb]); line(l, [x + 46 * s, y + 40 * s, HOLE[0] + 40, yb]); l.strokeStyle = DIM; line(l, [x + 6 * s, y + 40 * s, HOLE[0], yb]);
    if (reach) { const sh = [x - 30 * s, y + 52 * s], [tx, ty] = reach.to, k = reach.k, el = [XY.lerp(sh[0], tx, 0.5) , XY.lerp(sh[1], ty, 0.5) - 60 * k], hd = [XY.lerp(sh[0], tx, k), XY.lerp(sh[1], ty, k)];
      l.lineWidth = 2.2; l.strokeStyle = GR; const P = [sh, [XY.lerp(sh[0], el[0], Math.min(1, 2 * k)), XY.lerp(sh[1], el[1], Math.min(1, 2 * k))], hd];
      line(l, P.flat()); for (let j = 0; j < 2; j++) { const a = P[j], b = P[j + 1]; for (let q = 0.2; q < 1; q += 0.2) { const cx = XY.lerp(a[0], b[0], q), cy = XY.lerp(a[1], b[1], q); l.beginPath(); l.ellipse(cx, cy, 7, 7, 0, 0, TAU); l.stroke(); } }
      for (let f = -1; f <= 1; f++) { const a = -0.6 + f * 0.5 + (reach.close ? 0.5 : 0); line(l, [hd[0], hd[1], hd[0] - 16 * cos(a), hd[1] + 16 * sin(a), hd[0] - 26 * cos(a + (reach.close ? 0.8 : 0.3)), hd[1] + 26 * sin(a + (reach.close ? 0.8 : 0.3))]); } }
  };
  const helix = (g, top, t, a, turn) => { g.strokeStyle = GR; g.globalAlpha = a; g.lineWidth = 1.5; g.beginPath();
    for (let j = 0; j <= 90; j++) { const s = j / 90, y = XY.lerp(HOLE[1], top[1], s), x0 = XY.lerp(HOLE[0], top[0], s), r = 22 + 48 * s, an = s * 7 * PI * turn - t * 14 * turn;
      const x = x0 + cos(an) * r, yy = y + sin(an) * r * 0.24; j ? g.lineTo(x, yy) : g.moveTo(x, yy); }
    g.stroke(); g.globalAlpha = 1; };
  const outlineText = (g, s, x, y, px, lw, col) => { g.font = XY.font(px, XY.cnFont.hei, '900'); g.textBaseline = 'top'; g.lineWidth = lw; g.lineJoin = 'round'; g.strokeStyle = col; g.strokeText(s, x, y); };

  XY.STYLES.wireframe = {
    hits: [4],
    post(canvas, g, e) { K.zoomPost(canvas, g, e, 800, 520, K.push(e.beat, 3.85, 6.2, 0.1)); },
    draw(g, e) {
      const { W, H, t, u } = e, S = e.S, Wd = Math.round(W * S), Hd = Math.round(H * S), c = e.cell;
      const L = XY.scratch('wf-l', Wd, Hd), l = L.getContext('2d'); l.setTransform(S, 0, 0, S, 0, 0); l.lineCap = 'round'; l.lineJoin = 'round';
      // sky: stars, the turning wire moon
      l.fillStyle = GR; for (let k = 0; k < 46; k++) { const tw = (floor(t * 3) + k) % 5; if (tw === 0) continue; l.globalAlpha = tw === 2 ? 1 : 0.45; l.fillRect(XY.hash(k, 1) * W, 30 + XY.hash(k, 2) * (YH - 190), 2, 2); } l.globalAlpha = 1;
      sphere(l, 800, 214, 56, t * 0.7, GR);
      // the world sweeps in left to right like a plotter pass; the boulder and its hole are already there
      const rv = XY.smooth((u + 0.3) / 0.45);
      if (rv > 0) { l.save(); l.beginPath(); l.rect(0, 0, W * rv, H); l.clip(); grid(l, W); mountains(l);
        const zs = 1 + ((t * 0.9) % 1) * 10, ys = YH + 340 / zs; l.strokeStyle = GR; l.lineWidth = 2.4; l.globalAlpha = 1 - (zs - 1) / 10; line(l, [0, ys, W, ys]); l.globalAlpha = 1; l.restore();
        if (rv < 1) { l.strokeStyle = '#D8FFE4'; l.lineWidth = 3; line(l, [W * rv, YH - 200, W * rv, H]); } }
      rock(l, false); shaft(l, t * 1.6 + (u > 0.58 && u < 0.8 ? t * 4 : 0)); rock(l, true);
      const pulse = 0.5 + 0.5 * sin(t * 4); l.strokeStyle = `rgba(57,255,106,${0.4 + 0.6 * pulse})`; l.lineWidth = 3.2; l.beginPath(); l.ellipse(HOLE[0], HOLE[1], RR, 12, 0, 0, TAU); l.stroke();
      // wind out of the hole: up to the saddle before the grab, again for the return
      const rr = ratAt(u); if (rr) { const S0 = seatAt(c, GRAB), reach = u > 0.4 && u < 0.6 ? { to: u < GRAB ? S0 : (flight(c, u) || { P: S0 }).P, k: u < GRAB ? XY.easeOut((u - 0.4) / 0.1) : 1, close: u >= GRAB } : null; rat(l, rr, u, t, reach); }
      if (u > 0.78 && u < BACK + 0.02) helix(l, seatAt(c, BACK).map((v, i) => v - (i ? 40 : 0)), t, K.win(u, 0.78, BACK, 0.03), -1);
      this.peach(l, e);
      this.pilgrims(l, e);
      this.chrome(l, e);
      // compose: phosphor black, the line layer, bloom
      g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.fillStyle = '#010603'; g.fillRect(0, 0, Wd, Hd); g.drawImage(L, 0, 0);
      const Q = XY.scratch('wf-q', Wd / 4, Hd / 4), qg = Q.getContext('2d'); qg.filter = 'blur(2.5px)'; qg.drawImage(L, 0, 0, Q.width, Q.height);
      g.globalCompositeOperation = 'lighter'; g.globalAlpha = 0.9; g.drawImage(Q, 0, 0, Wd, Hd); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
      const vg = g.createRadialGradient(Wd / 2, Hd / 2, Hd * 0.4, Wd / 2, Hd / 2, Wd * 0.65); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,0.55)'); g.fillStyle = vg; g.fillRect(0, 0, Wd, Hd);
      g.restore();
    },
    // pilgrims as hidden-line wireframe; during the abduction the rider is drawn on his own, transformed, with phosphor trails
    pilgrims(l, e) {
      const { u } = e, px = e.procX, gy = e.groundY, c = e.cell;
      if (px - 410 > e.W + 10 || px + 330 < -10) return;
      const acts = { wukong: { shade: K.win(u, 0.3, 0.48, 0.04), strike: K.win(u, 0.5, 0.62, 0.03), raise: K.win(u, 0.7, 0.78, 0.03) }, monk: { palm: K.win(u, 0.93, 1.2, 0.04) }, bajie: { scratch: K.win(u, 0.56, 0.82, 0.05) }, shaseng: { lift: K.win(u, 0.4, 0.48, 0.025) } };
      // the engine's rider flag: while he is off the horse the saddle is drawn empty (cast.rider = false) and he is drawn once, on his own
      const fl = flight(c, u);
      XY.drawProcession(l, e.phase, px, gy, PEN, fl ? Object.assign({}, acts, { cast: { rider: false } }) : acts);
      if (!fl || fl.gone) return;
      K.drawFigs(l, e.phase, px, gy, Object.assign({}, PEN, { skip: p => !p.rider }), acts, (F, cx) => { if (F.name !== 'monk') return false; const st = F.anchors.saddle;
        cx.translate(-(px + F.x), -gy); cx.translate(fl.P[0], fl.P[1]); cx.rotate(fl.rot); cx.scale(fl.s * fl.sx, fl.s * fl.sy); cx.translate(-st[0], -st[1]); });
    },
    // the red peach 悟空 sends down after him
    peach(l, e) {
      const { u, t } = e, c = e.cell; if (u < 0.7 || u > 0.8) return;
      const tq = c.t0 + 0.7 * c.dur, a = XY.anchor('wukong.hand', XY.walkPhase(tq), {}), st = [XY.procWorldX(tq) - c.x + a[0], e.groundY + a[1]], q = (u - 0.7) / 0.1;
      let P, s = 1; if (q < 0.6) P = bez(st, [(st[0] + RIM[0]) / 2, 360], RIM, q / 0.6); else { const r = (q - 0.6) / 0.4; P = [RIM[0], XY.lerp(RIM[1], DEEP[1], r)]; s = XY.lerp(1, 0.08, r); }
      const pr = 34 * s; l.fillStyle = '#000'; l.beginPath(); l.arc(P[0], P[1], pr, 0, TAU); l.fill(); sphere(l, P[0], P[1], pr, t * 5, RED, 0.5); l.strokeStyle = RED; l.lineWidth = 2; l.beginPath(); l.moveTo(P[0], P[1] - pr); l.quadraticCurveTo(P[0] + pr * 0.3, P[1], P[0], P[1] + pr); l.stroke();
      l.strokeStyle = GR; l.lineWidth = 1.6; line(l, [P[0], P[1] - pr, P[0] + 20 * s, P[1] - pr - 22 * s, P[0] + 4 * s, P[1] - pr - 6 * s]);
    },
    // 无底 as extruded outline type; 第 69 难 with vector digits; the depth readout
    chrome(l, e) {
      const { W, u, t } = e;
      [[14, -11, DIM, 1.2], [7, -5.5, DIM, 1.2], [0, 0, GR, 2.4]].forEach(([dx, dy, col, lw]) => outlineText(l, '无底', 58 + dx, 44 + dy, 112, lw, col));
      l.strokeStyle = DIM; l.lineWidth = 1; [[64, 52], [160, 50], [64, 150], [276, 150]].forEach(([x, y]) => line(l, [x, y, x + 14, y - 11]));
      outlineText(l, '第', W - 262, 46, 38, 1.6, GR); l.strokeStyle = GR; K.vecText(l, '69', W - 214, 46, 40, 3); outlineText(l, '难', W - 140, 46, 38, 1.6, GR);
      const d = depth(u); if (d !== Infinity || floor(t * 4) % 2) outlineText(l, '深', W - 262, 106, 30, d === Infinity ? 2.2 : 1.3, d === Infinity ? '#D8FFE4' : GR); outlineText(l, '里', W - 96, 106, 30, 1.3, GR);
      l.strokeStyle = d > 0 && d < Infinity && floor(t * 8) % 2 ? '#D8FFE4' : GR;
      if (d === Infinity) { l.lineWidth = 3; l.beginPath(); for (let k = 0; k <= 60; k++) { const th = k / 60 * TAU, den = 1 + sin(th) * sin(th), x = W - 168 + 34 * cos(th) / den, y = 122 + 34 * sin(th) * cos(th) / den; k ? l.lineTo(x, y) : l.moveTo(x, y); } l.stroke(); }
      else K.vecText(l, '-' + String(floor(d)).padStart(4, '0'), W - 222, 110, 24, 2.4);
    },
  };
})();
