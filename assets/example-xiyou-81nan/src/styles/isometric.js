// 78 3D 等距 · 天竺招婚 — an isometric plaza in 天竺国: the three-storey 彩楼, a crowd standing one per floor tile, a cubby
// wall of nine jade rabbits pounding medicine, a floating island with 广寒宫. The princess throws the 绣球 (beat 1.8); it lands
// on 唐僧's crown on beat 3 and sticks; confetti cubes, the crowd jumps, banquet tables rise; on beat 4 she grows rabbit ears.
(() => {
  'use strict';
  const XY = window.XY, K = XY.KIT_I, TAU = XY.TAU, { sin, cos, PI, hypot, max, min } = Math;
  const OX = 590, OY = 400, sm = XY.smooth, W_ = K.win;
  const P = (X, Y, Z = 0) => [OX + (X - Y), OY + (X + Y) * 0.5 - Z];          // 2:1 isometric; y = 702 is X + Y = 604
  const hex = h => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
  const mixc = (h, w, k) => { const a = hex(h), b = hex(w); return `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * k)).join(',')})`; };
  const poly = (g, pts, col) => { XY.path(g, pts, true); g.fillStyle = col; g.fill(); };
  // an axis-aligned box: top, left (+Y) and right (+X) faces, lit from the upper left
  const box = (g, X, Y, Z, w, d, h, col, sh = [0.0, 0.18, 0.34]) => {
    const c = (x, y, z) => P(X + x, Y + y, Z + z);
    poly(g, [...c(0, d, 0), ...c(w, d, 0), ...c(w, d, h), ...c(0, d, h)], mixc(col, '#3A2A55', sh[1]));
    poly(g, [...c(w, 0, 0), ...c(w, d, 0), ...c(w, d, h), ...c(w, 0, h)], mixc(col, '#3A2A55', sh[2]));
    poly(g, [...c(0, 0, h), ...c(w, 0, h), ...c(w, d, h), ...c(0, d, h)], mixc(col, '#FFFFFF', 0.12));
  };
  const roof = (g, X, Y, Z, w, d, h, col) => { const top = P(X + w / 2, Y + d / 2, Z + h), a = P(X, Y + d, Z), b = P(X + w, Y + d, Z), c2 = P(X + w, Y, Z);
    poly(g, [...a, ...b, ...top], mixc(col, '#3A2A55', 0.12)); poly(g, [...b, ...c2, ...top], mixc(col, '#3A2A55', 0.3)); };
  // a tiny person: rounded body, ball head (one per tile)
  const person = (g, x, y, col, hop, k) => { y -= hop; g.fillStyle = 'rgba(80,60,120,0.18)'; g.beginPath(); g.ellipse(x, y + hop + 2, 9, 4, 0, 0, TAU); g.fill();
    g.fillStyle = mixc(col, '#3A2A55', 0.25); g.beginPath(); g.roundRect(x - 7, y - 20, 14, 20, 6); g.fill(); g.fillStyle = col; g.beginPath(); g.roundRect(x - 7, y - 20, 9, 20, [6, 0, 0, 6]); g.fill();
    g.fillStyle = k % 3 ? '#F6D2B8' : '#E8B894'; g.beginPath(); g.arc(x, y - 27, 6.5, 0, TAU); g.fill(); g.fillStyle = '#3A2A55'; g.beginPath(); g.arc(x, y - 29, 6.6, PI * 1.05, PI * 1.95); g.fill(); };
  // a jade rabbit pounding a mortar (faces left); p = pestle lift 0..1
  const rabbit = (g, x, y, s, p, look) => { g.save(); g.translate(x, y); g.scale(s, s);
    g.fillStyle = '#8E6A9C'; poly(g, [-14, 0, -2, 0, -4, -10, -12, -10], '#B07A5A'); g.fillStyle = '#7A5A48'; g.beginPath(); g.ellipse(-8, -10, 5, 2, 0, 0, TAU); g.fill();
    g.fillStyle = '#FFFFFF'; g.beginPath(); g.ellipse(6, -10, 9, 10, 0, 0, TAU); g.fill(); g.beginPath(); g.arc(2 - 2 * look, -22, 7, 0, TAU); g.fill();
    g.beginPath(); g.ellipse(-1 - 2 * look, -36, 2.4, 9, -0.2, 0, TAU); g.fill(); g.beginPath(); g.ellipse(5 - 2 * look, -37, 2.4, 9, 0.15, 0, TAU); g.fill();
    g.fillStyle = '#F29AB0'; g.beginPath(); g.arc(-3 - 2 * look, -21, 1.6, 0, TAU); g.fill(); g.fillStyle = '#3A2A55'; g.beginPath(); g.arc(0 - 2 * look, -24, 1.3, 0, TAU); g.fill();
    g.strokeStyle = '#C9A06A'; g.lineWidth = 2.6; g.lineCap = 'round'; g.beginPath(); g.moveTo(-1, -16); g.lineTo(-8, -12 - 10 * p); g.stroke(); g.restore(); };

  const CUB = { X0: 380, X1: 560, Y: 0, d: 40, H: 190 };      // the cubby wall stands on the back-right edge, open toward the viewer (+Y face)
  const TOWER = [120, 250];                                  // 彩楼 footprint origin (X, Y)
  const TABLES = [[290, 70], [360, 70], [430, 70]];
  const crowd = (() => { const o = []; for (let i = 0; i < 18; i++) for (let j = 0; j < 9; j++) { const X = i * 36 + 18, Y = j * 36 + 18, s = X + Y, p = P(X, Y);
      if (s >= 400 && s <= 548 && p[0] > 600 && p[0] < 1000 && !(X > 270 && Y < 110)) o.push([X, Y]); }
    return o.sort((a, b) => (a[0] + a[1]) - (b[0] + b[1])); })();
  const CROWD_COLS = ['#F48FB1', '#81D4FA', '#FFD54F', '#AED581', '#B39DDB', '#FFAB91'];
  const Lp = (x, y) => (X, Y, Z = 0) => [x + (X - Y), y + (X + Y) * 0.5 - Z];
  const boxL = (g, pr, X, Y, Z, w, d, h, col) => { const c = (a, b, z) => pr(X + a, Y + b, Z + z);
    poly(g, [...c(0, d, 0), ...c(w, d, 0), ...c(w, d, h), ...c(0, d, h)], mixc(col, '#3A2A55', 0.18)); poly(g, [...c(w, 0, 0), ...c(w, d, 0), ...c(w, d, h), ...c(w, 0, h)], mixc(col, '#3A2A55', 0.34));
    poly(g, [...c(0, 0, h), ...c(w, 0, h), ...c(w, d, h), ...c(0, d, h)], mixc(col, '#FFFFFF', 0.12)); };

  // ------------------------------------------------------------ static: pastel sky, moon, far iso blocks, the plaza tiles, the 彩楼, the cubby wall's frame
  const bg = (g, W, H, c, S) => {
    let gr = g.createLinearGradient(0, 0, 0, 640); gr.addColorStop(0, '#B9A6EA'); gr.addColorStop(0.55, '#F4C3DA'); gr.addColorStop(1, '#FFE2C6'); g.fillStyle = gr; g.fillRect(0, 0, W, H);
    gr = g.createRadialGradient(1060, 110, 40, 1060, 110, 160); gr.addColorStop(0, 'rgba(255,248,224,0.7)'); gr.addColorStop(1, 'rgba(255,248,224,0)'); g.fillStyle = gr; g.fillRect(880, -60, 360, 340);
    g.fillStyle = '#FFF6DC'; g.beginPath(); g.arc(1060, 110, 62, 0, TAU); g.fill(); g.fillStyle = 'rgba(220,200,170,0.45)'; [[1040, 96, 10], [1078, 128, 7], [1074, 88, 5]].forEach(([x, y, r]) => { g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill(); });
    // far: a pale city of blocks beyond the plaza's back edges
    for (let k = 0; k < 9; k++) { const X = -150 - 40 * (k % 3), Y = 40 + k * 70, h = 60 + 120 * XY.hash(k, 1); box(g, X, Y, 0, 60, 50, h, mixc('#C9B8E8', '#FFFFFF', 0.5)); }
    for (let k = 0; k < 9; k++) { const X = 60 + k * 70, Y = -150 - 40 * (k % 3), h = 50 + 110 * XY.hash(k, 2); box(g, X, Y, 0, 50, 60, h, mixc('#F2B8CF', '#FFFFFF', 0.5)); }
    // the plaza: tiles, a road band where the pilgrims walk (X + Y ≈ 604), bright back edges
    { const cols = ['#EEDFEA', '#F6EAF0', '#E4C4D8', '#EBCFE0'], paths = cols.map(() => new Path2D()), edges = new Path2D();
      for (let i = 0; i < 30; i++) for (let j = 0; j < 30; j++) { const X = i * 36, Y = j * 36, a = P(X, Y), s = X + Y + 36; if (a[1] > H + 40 || a[0] < -80 || a[0] > W + 80) continue;
        const q = [P(X, Y), P(X + 36, Y), P(X + 36, Y + 36), P(X, Y + 36)], pp = paths[(s >= 560 && s <= 650 ? 2 : 0) + (i + j) % 2];
        [pp, edges].forEach(p => { p.moveTo(q[0][0], q[0][1]); for (let k = 1; k < 4; k++) p.lineTo(q[k][0], q[k][1]); p.closePath(); }); }
      paths.forEach((p, k) => { g.fillStyle = cols[k]; g.fill(p); }); g.strokeStyle = 'rgba(255,255,255,0.7)'; g.lineWidth = 1; g.stroke(edges); }
    g.strokeStyle = '#FFFFFF'; g.lineWidth = 3; g.beginPath(); g.moveTo(...P(0, 1100)); g.lineTo(...P(0, 0)); g.lineTo(...P(1100, 0)); g.stroke();
    // the 彩楼: three storeys, red pillars, gold eaves, streamers
    const [TX, TY] = TOWER;
    box(g, TX, TY, 0, 90, 90, 110, '#F7EEE8'); for (let k = 0; k < 3; k++) { poly(g, [...P(TX + 10 + k * 30, TY + 90, 0), ...P(TX + 18 + k * 30, TY + 90, 0), ...P(TX + 18 + k * 30, TY + 90, 96), ...P(TX + 10 + k * 30, TY + 90, 96)], '#D8404E'); }
    poly(g, [...P(TX + 30, TY + 90, 0), ...P(TX + 60, TY + 90, 0), ...P(TX + 60, TY + 90, 60), ...P(TX + 30, TY + 90, 60)], '#7A3A58');
    box(g, TX - 6, TY - 6, 110, 102, 102, 10, '#F2B33C');
    box(g, TX + 10, TY + 10, 120, 70, 70, 80, '#FCE4EC'); box(g, TX + 4, TY + 4, 200, 82, 82, 8, '#F2B33C');
    box(g, TX + 20, TY + 20, 208, 50, 50, 62, '#F7EEE8'); roof(g, TX + 12, TY + 12, 270, 66, 66, 70, '#E8504E');
    for (let k = 0; k < 6; k++) { const v = k / 5, a = P(TX - 6 + 102 * v, TY + 96, 112), col = CROWD_COLS[k % 6]; g.strokeStyle = col; g.lineWidth = 3; g.beginPath(); g.moveTo(a[0], a[1]); g.quadraticCurveTo(a[0] + 4, a[1] + 26, a[0] - 2, a[1] + 50 + 8 * (k % 2)); g.stroke(); }
    // the cubby wall: a frame with nine open cells facing us
    const { X0, X1, Y, d, H: CH } = CUB; box(g, X0, Y, 0, X1 - X0, d, CH, '#B98BD6');
    for (let r = 0; r < 3; r++) for (let q = 0; q < 3; q++) { const x0 = X0 + 10 + q * 57, z0 = 10 + r * 60;
      poly(g, [...P(x0, Y + d, z0), ...P(x0 + 50, Y + d, z0), ...P(x0 + 50, Y + d, z0 + 52), ...P(x0, Y + d, z0 + 52)], '#5E3F7E');
      poly(g, [...P(x0, Y + d, z0), ...P(x0 + 50, Y + d, z0), ...P(x0 + 50, Y + d, z0 + 9), ...P(x0, Y + d, z0 + 9)], '#8A68AA');
      poly(g, [...P(x0, Y + d, z0 + 9), ...P(x0 + 7, Y + d, z0 + 9), ...P(x0 + 7, Y + d, z0 + 52), ...P(x0, Y + d, z0 + 52)], '#4A3066'); }
  };

  const IC = {}; Object.keys(XY.DEFAULT_COLORS).forEach(k => { IC[k] = mixc(XY.DEFAULT_COLORS[k], '#FFFFFF', 0.12); });
  const IPEN = { color: r => IC[r], shade: 'rgba(80,50,130,0.18)' };
  // v10 (8 beats): the princess winds up (2.4) and throws (3); the 绣球 lands on 唐僧's crown on 4 (hit) as a red carpet unrolls down the road;
  // on 5.5 (hit) she sprouts rabbit ears and a jade rabbit springs out of the cubby toward her
  const HAND = [466, 384], HIT = 4, THROW = 3, EARS = 5.5, BR = 30;
  const actsAt = b => ({ wukong: { shade: sm(W_(b, 2.6, 3.0)) * (1 - sm(W_(b, 3.8, 4.1))), raise: sm(W_(b, EARS, EARS + 0.3)) }, monk: { palm: sm(W_(b, HIT + 0.05, HIT + 0.3)) * (1 - sm(W_(b, 5.3, 5.8))) },
    bajie: { scratch: sm(W_(b, 4.4, 4.8)) }, shaseng: { lift: sm(W_(b, HIT, HIT + 0.3)) * (1 - sm(W_(b, 4.7, 5.1))) } });
  const ballAt = (e, A, b) => { const h = e.at('monk.head', A), tgt = [h[0] + 2, h[1] - 22 - BR];
    if (b >= HIT) return tgt; const v = W_(b, THROW, HIT); return [XY.lerp(HAND[0], tgt[0], v), XY.lerp(HAND[1], tgt[1], v) - 240 * 4 * v * (1 - v)]; };
  const ball = (g, x, y, r, spin) => { g.save(); g.translate(x, y);
    g.fillStyle = '#E8304E'; g.beginPath(); g.arc(0, 0, r, 0, TAU); g.fill(); g.strokeStyle = '#F7C948'; g.lineWidth = 2.4;
    for (let k = 0; k < 3; k++) { g.beginPath(); g.ellipse(0, 0, r, r * Math.abs(cos(spin + k * 1.05)), k * 1.05, 0, TAU); g.stroke(); }
    g.fillStyle = 'rgba(255,255,255,0.55)'; g.beginPath(); g.arc(-r * 0.35, -r * 0.4, r * 0.3, 0, TAU); g.fill(); g.restore(); };

  XY.STYLES.isometric = {
    bg,
    hits: [HIT, EARS],
    draw(g, e) {
      const { W, t, u, beat, S } = e, A = actsAt(beat), hit = beat >= HIT;
      // far: the floating island with 广寒宫 and the cassia tree; drifting block clouds
      { const L = Lp(660, 128 + 6 * sin(t * 1.4)); poly(g, [...L(0, 100, 0), ...L(140, 100, 0), ...L(70, 50, -70)], '#B48A6E'); poly(g, [...L(140, 100, 0), ...L(140, 0, 0), ...L(70, 50, -70)], '#8E6A56');
        boxL(g, L, 0, 0, 0, 140, 100, 14, '#A8DDB0'); boxL(g, L, 20, 20, 14, 50, 40, 34, '#FFFFFF'); const r0 = L(45, 40, 48), r1 = L(20, 60, 48), r2 = L(70, 60, 48), r3 = L(45, 40, 76);
        poly(g, [...r1, ...L(70, 60, 48), ...r3], '#F2B33C'); poly(g, [...r2, ...L(70, 20, 48), ...r3], '#D99A2A');
        const tr = L(110, 60, 14); g.fillStyle = '#8E6A56'; g.fillRect(tr[0] - 2, tr[1] - 26, 4, 26); g.fillStyle = '#7CC08A'; g.beginPath(); g.arc(tr[0], tr[1] - 34, 16, 0, TAU); g.fill(); g.fillStyle = '#F7C948'; [[-6, -38], [5, -30], [2, -42]].forEach(([dx, dy]) => { g.beginPath(); g.arc(tr[0] + dx, tr[1] + dy, 2, 0, TAU); g.fill(); }); }
      [[820, 250, 0], [1000, 300, 1], [900, 190, 2]].forEach(([x0, y, k]) => { const x = 760 + ((x0 - 760 + t * 12 * (1 + k * 0.3)) % 420), L = Lp(x, y);
        boxL(g, L, 0, 0, 0, 60, 30, 18, '#FFFFFF'); boxL(g, L, 16, -10, 18, 30, 26, 14, '#FFFFFF'); });
      // lantern string from the tower to the cubby wall
      { const a = [452, 352], b = [934, 420]; g.strokeStyle = 'rgba(90,60,110,0.7)'; g.lineWidth = 1.4; g.beginPath(); for (let i = 0; i <= 24; i++) { const v = i / 24; g.lineTo(XY.lerp(a[0], b[0], v), XY.lerp(a[1], b[1], v) + 70 * 4 * v * (1 - v)); } g.stroke();
        for (let i = 1; i < 10; i++) { const v = i / 10, x = XY.lerp(a[0], b[0], v), y = XY.lerp(a[1], b[1], v) + 70 * 4 * v * (1 - v), sw = 0.2 * sin(t * 2 + i); const q = [x + sin(sw) * 12, y + cos(sw) * 12];
          g.beginPath(); g.moveTo(x, y); g.lineTo(q[0], q[1]); g.stroke(); g.fillStyle = '#E8504E'; g.beginPath(); g.roundRect(q[0] - 7, q[1], 14, 16, 4); g.fill(); g.fillStyle = '#C23A44'; g.fillRect(q[0], q[1], 7, 16); g.fillStyle = '#F2B33C'; g.fillRect(q[0] - 5, q[1] - 2, 10, 3); } }
      // nine jade rabbits pounding medicine, one stroke per beat; on beat 4 they all turn to us
      { const { X0, Y, d } = CUB, p = sin(PI * (((beat % 1) + 1) % 1)), look = sm(W_(beat, EARS, EARS + 0.2));
        for (let r = 0; r < 3; r++) for (let q = 0; q < 3; q++) { const c = P(X0 + 10 + q * 57 + 26, Y + d, 10 + r * 60 + 9), jump = r === 2 && q === 1 ? W_(beat, EARS, EARS + 1.1) : 0;
          if (jump > 0) { const tx = 452, ty = 330, x = XY.lerp(c[0], tx, jump), y = XY.lerp(c[1], ty, jump) - 220 * sin(PI * jump); if (jump < 1) rabbit(g, x - 6, y + 2, 1.3, 0, 1); continue; }
          rabbit(g, c[0] - 6, c[1] + 2, 0.92, Math.max(0, p - 0.08 * ((q + r) % 3)), look); } }
      // the princess on the balcony; she throws on THROW, and on beat 4 two rabbit ears pop out
      { const [x, y] = [452, 412], th = sm(W_(beat, THROW - 0.6, THROW)) * (1 - sm(W_(beat, THROW + 0.2, THROW + 0.6))), ears = K.outBack(W_(beat, EARS, EARS + 0.2));
        g.fillStyle = 'rgba(80,60,120,0.2)'; g.beginPath(); g.ellipse(x, y + 2, 14, 6, 0, 0, TAU); g.fill();
        poly(g, [x - 14, y, x + 14, y, x + 6, y - 34, x - 6, y - 34], '#E84A6A'); poly(g, [x, y, x + 14, y, x + 6, y - 34, x, y - 34], '#C83A5A');
        if (ears > 0) { g.fillStyle = '#FFFFFF'; [[-4, -0.25], [5, 0.2]].forEach(([dx, a]) => { g.save(); g.translate(x + dx, y - 50); g.rotate(a); g.beginPath(); g.ellipse(0, -16 * ears, 3.4, 14 * ears, 0, 0, TAU); g.fill(); g.fillStyle = '#F7A8C0'; g.beginPath(); g.ellipse(0, -16 * ears, 1.4, 10 * ears, 0, 0, TAU); g.fill(); g.fillStyle = '#FFFFFF'; g.restore(); }); }
        g.fillStyle = '#F6D2B8'; g.beginPath(); g.arc(x, y - 42, 8, 0, TAU); g.fill(); g.fillStyle = '#2E2244'; g.beginPath(); g.arc(x, y - 45, 8, PI, TAU); g.fill(); g.beginPath(); g.arc(x, y - 54, 5, 0, TAU); g.fill(); g.fillStyle = '#F2B33C'; g.fillRect(x - 6, y - 54, 12, 3);
        g.strokeStyle = '#E84A6A'; g.lineWidth = 4; g.lineCap = 'round'; g.beginPath(); g.moveTo(x + 4, y - 28); g.lineTo(x + 10 + 6 * th, y - 30 - 18 * th); g.stroke(); }
      // the crowd, one per tile; after the hit they jump in a wave. banquet tables rise out of the floor
      crowd.forEach(([X, Y], k) => { const p = P(X, Y), hop = hit && beat < HIT + 2 ? 13 * Math.max(0, sin(TAU * (beat - HIT) - k * 0.22)) : 1.2 * Math.max(0, sin(t * 3 + k)); person(g, p[0], p[1], CROWD_COLS[k % 6], hop, k); });
      TABLES.forEach(([X, Y], k) => { const r = K.outBack(W_(beat, HIT + 0.3 + 0.25 * k, HIT + 0.6 + 0.25 * k)); if (r <= 0.01) return; box(g, X, Y, 0, 50, 34, 26 * r, '#FFFFFF'); box(g, X - 3, Y - 3, 26 * r, 56, 40, 5, '#E84A6A');
        if (r > 0.8) [[14, 12], [34, 12], [24, 26]].forEach(([a, b], j) => { const c = P(X + a, Y + b, 26 * r + 5); g.fillStyle = ['#FFD54F', '#AED581', '#FFAB91'][j]; g.beginPath(); g.ellipse(c[0], c[1] - 3, 7, 4, 0, 0, TAU); g.fill(); }); });
      { const cv = XY.easeOut(W_(beat, HIT, HIT + 0.8)); if (cv > 0) { const x0 = e.at('monk.chest', A)[0] - 120, x1 = x0 + 900 * cv, Q = (sx, sm2) => P((sm2 + sx - OX) / 2, (sm2 - sx + OX) / 2);   // the wedding carpet unrolls ahead of them
          poly(g, [...Q(x0, 572), ...Q(x1, 572), ...Q(x1, 644), ...Q(x0, 644)], '#D8344E'); poly(g, [...Q(x0, 578), ...Q(x1, 578), ...Q(x1, 584), ...Q(x0, 584)], '#F2B33C'); poly(g, [...Q(x0, 632), ...Q(x1, 632), ...Q(x1, 638), ...Q(x0, 638)], '#F2B33C');
          if (cv < 1) { const a = Q(x1, 572), b = Q(x1, 644); g.fillStyle = '#A8263C'; g.beginPath(); g.ellipse((a[0] + b[0]) / 2, (a[1] + b[1]) / 2 - 8, 10, 18, 0.5, 0, TAU); g.fill(); } } }
      // the pilgrims as thick toy figures: projected ground shadow, a darker slab of thickness behind, a lit top edge
      const [pl, pg] = K.layer(e, 'i78p'); K.draw(pg, e.phase, e.procX, e.groundY, IPEN, A);
      const gy = e.groundY * S, sh = K.tint(pl, 'i78sh', 'rgba(90,60,140,0.22)');
      g.save(); g.setTransform(1, 0, -0.7, 0.28, 0.7 * gy, 0.72 * gy); g.drawImage(sh, 0, 0); g.restore();
      { const dk = XY.scratch('i78dk', pl.width, pl.height), q = dk.getContext('2d'); q.filter = 'brightness(0.68) saturate(0.9)'; q.drawImage(pl, 0, 0);
        for (let k = 8; k >= 1; k--) K.blit(g, dk, 1, null, k * 1.3 * S, -k * 0.65 * S); }
      K.blitOn(pl, K.edge(pl, 'i78hi', 0, 2.2 * S, 'rgba(255,255,255,0.42)')); K.blit(g, pl);
      // the 绣球: thrown in an arc with ribbons trailing, lands on the 毗卢帽 on beat 3 and stays there
      if (beat >= THROW - 0.05) { const b0 = ballAt(e, A, beat);
        if (!hit) for (let j = 1; j <= 9; j++) { const q = ballAt(e, A, beat - j * 0.04); g.fillStyle = j % 2 ? '#F7C948' : '#E8304E'; g.globalAlpha = 1 - j / 10; g.fillRect(q[0] - 5, q[1] - 5 + 6 * sin(j + t * 9), 10, 10); g.globalAlpha = 1; }
        else { g.strokeStyle = '#F7C948'; g.lineWidth = 2.4; [-1, 1].forEach(s => { g.lineWidth = 4; g.beginPath(); g.moveTo(b0[0], b0[1]); g.quadraticCurveTo(b0[0] - 30 * s, b0[1] + 10, b0[0] - 50 - 10 * s, b0[1] + 30 + 6 * sin(t * 6 + s)); g.stroke(); }); }
        ball(g, b0[0], b0[1], BR, hit ? 0.4 : t * 14); }
      // confetti cubes off the hit
      { const d = (beat - HIT) * XY.BEAT; if (d > 0 && d < 1.6) { const h = e.at('monk.head', A);
        for (let k = 0; k < 56; k++) { const a = -PI / 2 + (XY.hash(k, 1) - 0.5) * 2.6, v = 180 + 240 * XY.hash(k, 2), x = h[0] + cos(a) * v * d, y = h[1] - 30 + sin(a) * v * d + 420 * d * d, s = 4 + 3 * XY.hash(k, 3), f = cos(d * 14 + k);
          if (y > 760) continue; g.save(); g.translate(x, y); g.scale(1, f); g.globalAlpha = Math.min(1, (1.6 - d) * 2); poly(g, [0, -s, s * 1.4, 0, 0, s, -s * 1.4, 0], CROWD_COLS[k % 6]); g.restore(); } } }
      // title: extruded letters standing on the iso plane (+X runs down-right), and a plaque with the count
      { const plane = (x, y) => g.setTransform(S, 0.5 * S, 0, S, x * S, y * S), pop = K.outBack(W_(u, -0.3, -0.15));
        if (pop > 0) { g.save(); plane(64, 36 + 30 * (1 - pop)); g.font = XY.font(116, XY.cnFont.hei, '900'); g.textBaseline = 'top';
          for (let k = 14; k >= 1; k--) { g.fillStyle = k > 1 ? '#B24A78' : '#8E3A62'; g.fillText('招婚', k * 1.0, -k * 0.5 + 10); }
          g.fillStyle = '#FF86AE'; g.fillText('招婚', 0, 10); g.fillStyle = 'rgba(255,255,255,0.45)'; g.fillRect(0, 10, 240, 3);
          for (let k = 6; k >= 1; k--) { g.fillStyle = '#9E86C6'; g.fillRect(16 + k, 150 - k * 0.5, 200, 46); }
          g.fillStyle = '#FFFFFF'; g.fillRect(16, 150, 200, 46); g.fillStyle = '#7A4A9A'; g.font = XY.font(30, XY.cnFont.hei, 'bold'); g.fillText('第78难', 58, 157); g.restore(); } }
    },
  };
})();
