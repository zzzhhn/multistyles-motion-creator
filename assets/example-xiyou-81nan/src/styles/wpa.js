// 55 WPA 海报 · 稀柿衕秽阻 — a 1936 silkscreen poster: flat ink passes, key lines printed slightly out of register,
// a sunburst behind the seven peaks of 七绝山, and the 稀柿衕 lane choked by a mountain of rotten persimmons.
// Beat 2: 八戒 vanishes from the line in a puff and rises behind it as a monumental hero-pig (变作大猪).
// Beat 3: the pig rams the heap, persimmons fountain over the road and the sun breaks through; beat 4.5 八戒 is back, smeared.
(() => {
  'use strict';
  const XY = window.XY, K = XY.KIT_G, TAU = XY.TAU;
  const C = { paper: '#F3E3BE', cream: '#F7EED8', sun: '#F2BE45', ray: '#EBC47C', orange: '#E06A2A', rust: '#B23A23', brown: '#6E3B22', dark: '#2A211C',
    teal: '#4F7F79', teal2: '#3E6763', navy: '#26384A', olive: '#717C3A', olive2: '#525B2A', ochre: '#CF9C52', ochre2: '#AD7838', pink: '#E2957F', pink2: '#AF5E4C', stink: '#7E8A55' };
  const SUN = [1062, 446], OFF = [2.4, 1.6];          // OFF: key-line misregistration
  const BEAT_POOF = 2.4, BEAT_HIT = 4, BEAT_BACK = 6.4;   // v10: 8 beats per cell

  // ------------------------------------------------------------ persimmons
  const persimmon = (g, x, y, r, kind, rot) => {
    const base = [C.orange, C.orange, C.rust, C.brown, '#3B2418'][kind];
    g.fillStyle = base; g.beginPath(); g.ellipse(x, y, r, r * 0.88, rot * 0.3, 0, TAU); g.fill();
    g.fillStyle = kind < 2 ? C.rust : 'rgba(30,18,12,0.55)'; g.beginPath(); g.ellipse(x + r * 0.28, y + r * 0.22, r * 0.62, r * 0.5, 0.5, 0, TAU); g.fill();
    if (kind < 3) { g.fillStyle = C.cream; g.beginPath(); g.ellipse(x - r * 0.38, y - r * 0.36, r * 0.22, r * 0.13, -0.6, 0, TAU); g.fill(); }
    if (kind >= 2) { g.fillStyle = C.dark; g.beginPath(); g.ellipse(x + r * 0.35 * Math.cos(rot), y + r * 0.3 * Math.sin(rot), r * 0.34, r * 0.16, rot, 0, TAU); g.fill(); }
    g.fillStyle = C.olive2; g.beginPath(); for (let k = 0; k < 4; k++) { const a = rot + k * TAU / 4; g.moveTo(x, y - r * 0.8); g.lineTo(x + Math.cos(a) * r * 0.42, y - r * 0.8 + Math.sin(a) * r * 0.2); g.lineTo(x + Math.cos(a + 0.5) * r * 0.2, y - r * 0.8 + Math.sin(a + 0.5) * r * 0.1); } g.fill();
  };
  const heapTop = x => 702 - (Math.max(0, x - 830) > 0 ? 330 * Math.exp(-Math.pow((x - 1085) / 175, 2)) + 70 * XY.smooth((x - 830) / 90) : 0);
  const HEAP = (() => { const o = [], R = XY.rng(5501);
    for (let y = 694; y > 330; y -= 23) for (let x = 820; x < 1230; x += 27) {
      const jx = x + (R() - 0.5) * 16, jy = y + (R() - 0.5) * 10, r = 15 + R() * 8, kind = Math.min(4, Math.floor(R() * R() * 5.2));
      if (jy - r * 0.4 > heapTop(jx)) o.push([jx, jy, r, kind, R() * TAU]);
    } return o; })();

  // ------------------------------------------------------------ the hero pig (local: facing +x, ground y = 0)
  const pigShapes = (gp, push) => {
    const sh = [], leg = (hx, hy, off, col) => { const a = 0.55 * Math.sin(TAU * gp + off) - 0.15 * push, f = [hx + Math.sin(a) * 74, Math.min(0, hy + Math.cos(a) * 74)];
      sh.push([XY.RIG.capsule([hx, hy], f, 24, 15, 6), col], [XY.ellipse(f[0] + 4, f[1] - 4, 17, 9, 12, a * 0.5), C.dark]); };
    leg(-118, -72, Math.PI, C.pink2); leg(108, -66, 0, C.pink2);
    sh.push([XY.RIG.spline([-178, -118, -164, -178, -100, -214, 0, -228, 92, -216, 152, -188, 184, -140, 180, -92, 140, -58, 40, -44, -70, -46, -152, -66], true, 5), C.pink]);
    sh.push([XY.RIG.spline([-160, -92, -60, -70, 60, -66, 160, -84, 140, -58, 40, -44, -70, -46, -152, -66], true, 4), C.pink2]);
    sh.push([[-140, -186, -60, -214, 60, -218, 130, -196, 60, -206, -60, -204], C.cream]);
    leg(-90, -68, 0.2, C.pink); leg(136, -62, Math.PI + 0.2, C.pink);
    const hd = push * 18;
    sh.push([XY.RIG.spline([118, -188, 190, -178, 250, -140 + hd * 0.3, 288, -96 + hd, 302, -62 + hd, 288, -34 + hd, 238, -26 + hd * 0.5, 170, -40, 116, -82], true, 4), C.pink]);
    sh.push([XY.ellipse(300, -60 + hd, 14, 27, 16), C.pink2]);
    sh.push([[166, -178, 240, -206 + 6 * Math.sin(TAU * gp), 224, -146], C.pink2]);
    return sh;
  };
  const drawPig = (g, x, y, s, gp, push) => {
    const sh = pigShapes(gp, push);
    g.save(); g.translate(x, y); g.scale(s, s);
    const ox = OFF[0] / s * 1.4, oy = OFF[1] / s * 1.4; g.lineWidth = 3.4; g.lineJoin = 'round'; g.strokeStyle = C.dark;
    sh.forEach(([p, c]) => { XY.path(g, p, true); g.fillStyle = c; g.fill(); if (c === C.cream) return; g.save(); g.translate(ox, oy); g.stroke(); g.restore(); });
    g.fillStyle = C.dark; const hd = push * 18;
    [[302, -70 + hd], [302, -50 + hd]].forEach(([a, b]) => { g.beginPath(); g.ellipse(a, b, 3.5, 5, 0, 0, TAU); g.fill(); });
    g.beginPath(); g.arc(232, -122 + hd * 0.4, 6, 0, TAU); g.fill();
    g.lineCap = 'round'; g.strokeStyle = C.dark; g.lineWidth = 5;
    g.beginPath(); g.moveTo(214, -140); g.lineTo(246, -136 + hd * 0.3); g.stroke();                          // the determined brow
    g.beginPath(); g.moveTo(286, -32 + hd); g.lineTo(250, -36 + hd * 0.5); g.stroke();
    for (let k = 0; k < 13; k++) { const bx = -130 + k * 21, by = -214 - 12 * Math.sin(k / 12 * Math.PI); g.beginPath(); g.moveTo(bx, by + 4); g.lineTo(bx - 6, by - 14 - 4 * Math.sin(TAU * gp + k)); g.stroke(); }
    g.lineWidth = 4; g.beginPath(); g.arc(-96, -118, 62, -2.2, -0.4); g.stroke(); g.beginPath(); g.arc(96, -122, 58, -2.6, -0.9); g.stroke();   // haunch and shoulder
    g.strokeStyle = C.cream; g.lineWidth = 6; g.beginPath(); g.arc(96, -122, 46, -2.4, -1.3); g.stroke(); g.beginPath(); g.arc(-96, -118, 50, -2.1, -1.1); g.stroke();
    g.strokeStyle = C.dark; g.lineWidth = 5;
    g.beginPath(); g.moveTo(-178, -128); g.bezierCurveTo(-214, -150, -214, -100, -194, -110); g.bezierCurveTo(-184, -116, -196, -130, -204, -120); g.stroke();
    g.restore();
  };
  // the pig's ground x (body centre) and scale through the cell, in local beats
  const pigAt = (b, x0) => {
    if (b < BEAT_POOF) return null;
    const grow = XY.easeOut(K.ramp(b, BEAT_POOF, 0.6)), over = 1 + 0.12 * Math.sin(Math.PI * K.ramp(b, BEAT_POOF + 0.45, 0.4));
    const s = XY.lerp(0.22, 1.12, grow) * (b < BEAT_POOF + 0.85 ? over : 1);
    let x = XY.lerp(x0, 620, grow), push = 0;
    const W0 = BEAT_POOF + 0.9; if (b > W0) { const q = K.ramp(b, W0, BEAT_HIT - W0); x += -40 * Math.sin(Math.PI * Math.min(1, q * 1.6)) + XY.easeIn(q) * 122; push = XY.smooth(q * 1.4); }
    if (b > BEAT_HIT) { const q = K.ramp(b, BEAT_HIT, 2.6); x = 742 + 820 * Math.pow(q, 1.25); push = 1; }
    return { x, s, push, gp: b * 1.6 };
  };

  // ------------------------------------------------------------ static layers (cached per scale)
  const TREES = [[64, 520, 78], [196, 498, 92], [330, 526, 74], [452, 504, 88], [590, 530, 72], [716, 512, 84]];
  const hills = (g, W) => {
    const peaks = [[70, 352, 150], [228, 300, 160], [392, 338, 150], [548, 286, 170], [712, 330, 150], [884, 300, 170], [1070, 344, 190]];
    peaks.forEach(([x, top, hw], k) => {   // 七绝山: seven flat peaks, shadow face left, sunlit face right
      const ax = x + 14 * (k % 2 ? 1 : -1), base = 600;
      g.fillStyle = C.navy; g.beginPath(); g.moveTo(x - hw, base); g.lineTo(ax, top); g.lineTo(ax + 10, base); g.fill();
      g.fillStyle = k % 2 ? C.teal : C.teal2; g.beginPath(); g.moveTo(ax, top); g.lineTo(x + hw, base); g.lineTo(ax + 10, base); g.fill();
      g.strokeStyle = C.paper; g.lineWidth = 3; g.globalAlpha = 0.5;
      for (let j = 1; j < 4; j++) { const y = top + j * (base - top) / 4.2, f = (y - top) / (base - top); g.beginPath(); g.moveTo(ax + 6 + f * hw * 0.25, y); g.lineTo(ax + 6 + f * hw * 0.85, y + 10); g.stroke(); }
      g.globalAlpha = 1;
    });
    g.fillStyle = C.olive2; g.beginPath(); g.moveTo(0, 600); for (let x = 0; x <= W; x += 40) g.lineTo(x, 586 + 14 * Math.sin(x / 90)); g.lineTo(W, 700); g.lineTo(0, 700); g.fill();
    g.fillStyle = C.olive; g.fillRect(0, 618, W, 84);
    g.strokeStyle = C.olive2; g.lineWidth = 3; for (let k = 0; k < 9; k++) { const y = 628 + k * 8; g.beginPath(); g.moveTo(0, y); g.lineTo(W, y + 3); g.stroke(); }
    TREES.forEach(([x, y, r], k) => {
      g.fillStyle = C.brown; g.beginPath(); g.moveTo(x - 9, 690); g.lineTo(x - 4, y + 10); g.lineTo(x + 5, y + 10); g.lineTo(x + 11, 690); g.fill();
      g.strokeStyle = C.brown; g.lineWidth = 6; g.beginPath(); g.moveTo(x, y + 40); g.lineTo(x - 30, y + 2); g.moveTo(x + 2, y + 30); g.lineTo(x + 34, y - 6); g.stroke();
      const lump = (cx, cy, rr, c) => { g.fillStyle = c; g.beginPath(); g.arc(cx, cy, rr, 0, TAU); g.fill(); };
      lump(x - r * 0.45, y + 4, r * 0.62, C.olive2); lump(x + r * 0.42, y + 8, r * 0.6, C.olive2); lump(x, y - r * 0.28, r * 0.7, C.olive);
      lump(x - r * 0.3, y - r * 0.05, r * 0.5, C.olive); lump(x + r * 0.32, y - r * 0.12, r * 0.42, '#86913F');
      const R = XY.rng(5510 + k); for (let j = 0; j < 9; j++) { const a = R() * TAU, d = Math.sqrt(R()) * r * 0.8; persimmon(g, x + Math.cos(a) * d, y - 6 + Math.sin(a) * d * 0.7, 6.5, 0, R()); }
    });
  };
  const heapLayer = (g, e) => { HEAP.forEach(p => persimmon(g, p[0], p[1], p[2], p[3], p[4]));
  };
  const roadLayer = (g, W) => {
    g.fillStyle = C.ochre; g.fillRect(0, 684, W, 96);
    g.fillStyle = C.ochre2; for (let k = 0; k < 7; k++) { const y = 694 + k * 11; g.fillRect(0, y, W, 2 + k * 0.6); }
    const R = XY.rng(5520); for (let k = 0; k < 14; k++) { const x = R() * W, y = 700 + R() * 20; g.fillStyle = R() < 0.5 ? C.rust : C.brown; g.beginPath(); g.ellipse(x, y, 10 + R() * 18, 3 + R() * 3, 0, 0, TAU); g.fill(); }
  };
  const fgLayer = (g, W, H) => {
    // the lettering band and the poster margin
    g.fillStyle = C.rust; g.fillRect(16, 724, W - 32, 40);
    g.fillStyle = C.cream; g.fillRect(16, 724, W - 32, 3); g.fillRect(16, 761, W - 32, 3);
    K.text(g, '第 55 难   ·   七 绝 山   稀 柿 衕', 40, 754, XY.font(28, 'Futura, "PingFang SC", sans-serif', 'bold'), C.cream);
    K.text(g, '驼罗庄 敬制', W - 40, 754, XY.font(26, '"Lantinghei SC", "PingFang SC", sans-serif', '600'), C.sun, { align: 'right' });
    g.fillStyle = C.cream; g.fillRect(0, 0, W, 14); g.fillRect(0, H - 14, W, 14);
    [[0, 420], [712, H - 712]].forEach(([y, h]) => { g.fillRect(0, y, 14, h); g.fillRect(W - 14, y, 14, h); });
    g.strokeStyle = C.dark; g.lineWidth = 2.5; g.beginPath(); g.moveTo(16, 420); g.lineTo(16, 16); g.lineTo(W - 16, 16); g.lineTo(W - 16, 420);
    g.moveTo(16, 712); g.lineTo(16, H - 16); g.lineTo(W - 16, H - 16); g.lineTo(W - 16, 712); g.stroke();
    // foreground branch, top right: leaves and three hanging persimmons
    g.strokeStyle = C.brown; g.lineWidth = 13; g.lineCap = 'round'; g.beginPath(); g.moveTo(W + 10, 40); g.quadraticCurveTo(W - 120, 60, W - 250, 30); g.stroke();
    g.lineWidth = 6; g.beginPath(); g.moveTo(W - 120, 56); g.lineTo(W - 150, 108); g.moveTo(W - 200, 44); g.lineTo(W - 214, 90); g.stroke();
    [[W - 70, 20, 0.6], [W - 160, 30, 2.2], [W - 236, 18, 0.2], [W - 110, 80, 1.3], [W - 270, 54, 2.6]].forEach(([x, y, a]) => {
      g.save(); g.translate(x, y); g.rotate(a); g.fillStyle = C.olive2; g.beginPath(); g.moveTo(0, 0); g.quadraticCurveTo(30, -24, 70, 0); g.quadraticCurveTo(30, 24, 0, 0); g.fill();
      g.strokeStyle = C.olive; g.lineWidth = 3; g.beginPath(); g.moveTo(4, 0); g.lineTo(64, 0); g.stroke(); g.restore(); });
    persimmon(g, W - 150, 126, 24, 0, 0.4); persimmon(g, W - 214, 108, 20, 1, 1.1);
  };

  // ------------------------------------------------------------ the pilgrims: flat ink, key line out of register
  const PAL = { fur: '#7A3E22', face: '#EAC9A0', wkshirt: C.rust, tiger: '#E7A93E', stripe: C.dark, gold: '#E7A93E', staff: C.rust, ink: C.dark, horse: C.cream, horse2: '#D2C3A0',
    mane: C.cream, hoof: C.dark, saddle: C.brown, red: C.rust, robe: '#E7A93E', kasaya: C.rust, skin: '#EAC9A0', metal: '#E7A93E', bjrobe: C.navy, bjpants: '#1D2A38',
    pig: C.pink, pig2: C.pink2, wood: C.brown, ssrobe: C.teal2, ssrobe2: '#2F504D', skin2: '#B98A64', ssh: C.rust, ssbeard: '#8E2E1C', skull: C.cream, bundle: '#E7A93E' };
  const smearPart = (ctx, p, c, id, f, on) => {
    if (!on || f !== 'bajie' || p.k !== 'poly' || (p.role !== 'bjrobe' && p.role !== 'pig' && p.role !== 'bjpants')) return false;
    XY.path(ctx, p.pts, true); ctx.fillStyle = c; ctx.fill(); ctx.save(); ctx.clip(); ctx.fillStyle = C.orange;
    for (let k = 0; k < 3; k++) { const j = 2 * Math.floor(XY.hash(id, k) * (p.pts.length / 2)); ctx.beginPath(); ctx.arc(p.pts[j] + 4, p.pts[j + 1] + 3, 5 + 5 * XY.hash(id, k, 2), 0, TAU); ctx.fill(); }
    ctx.restore(); ctx.save(); ctx.translate(OFF[0], OFF[1]); ctx.strokeStyle = C.dark; ctx.lineWidth = 1.6; ctx.stroke(); ctx.restore(); return true;
  };
  const actsAt = b => ({ wukong: { shade: K.win(b, 1.4, 3.0, 0.4), raise: K.win(b, 4.2, 6.6, 0.3) }, monk: { palm: K.win(b, 2.4, 4.4, 0.4) },
    bajie: { scratch: K.win(b, 6.9, 11, 0.3) }, shaseng: { lift: K.win(b, 4.3, 6.5, 0.4) } });

  const poof = (g, x, y, b, b0) => {
    const q = (b - b0) / 0.7; if (q < 0 || q > 1) return;
    const r = 30 + 90 * XY.easeOut(q * 2.2), s = q < 0.7 ? 1 : 1 - (q - 0.7) / 0.3;
    g.save(); g.translate(x, y); g.scale(s, s);
    K.ink(g, K.burst(0, 0, r * 0.55, r, 11, 551, q * 0.6, 0.3), C.cream, C.dark, 3);
    K.ink(g, K.burst(0, 0, r * 0.3, r * 0.6, 9, 552, -q, 0.3), C.sun, null, 0);
    g.restore();
  };

  XY.STYLES.wpa = {
    hits: [BEAT_POOF, BEAT_HIT],
    bg(g, W, H) {
      g.fillStyle = C.paper; g.fillRect(0, 0, W, H);
    },
    draw(g, e) {
      const { W, H, t, u, S } = e, b = e.beat, acts = actsAt(b);
      const burst = K.ramp(b, BEAT_HIT, 0.15), open = XY.smooth(K.ramp(b, BEAT_HIT, 2.4));
      // far: the sunburst (turns slowly; flares when the heap breaks)
      const flare = K.hit(b, BEAT_HIT, 1.2);
      g.save(); g.translate(SUN[0], SUN[1]); g.rotate(t * 0.06);
      g.fillStyle = C.ray; g.globalAlpha = 0.55 + 0.45 * open;
      for (let k = 0; k < 26; k++) { const a = k / 26 * TAU, w = 0.06 + 0.02 * flare; g.beginPath(); g.moveTo(0, 0); g.lineTo(Math.cos(a - w) * 1500, Math.sin(a - w) * 1500); g.lineTo(Math.cos(a + w) * 1500, Math.sin(a + w) * 1500); g.fill(); }
      g.restore(); g.globalAlpha = 1;
      g.fillStyle = C.sun; g.beginPath(); g.arc(SUN[0], SUN[1], 96 + 10 * flare, 0, TAU); g.fill();
      g.strokeStyle = C.rust; g.lineWidth = 4; g.beginPath(); g.arc(SUN[0], SUN[1], 112 + 26 * flare, 0, TAU); g.stroke();
      const bgk = s => s.toFixed(4);
      g.drawImage(XY.cached(`wpa-hills:${bgk(S)}`, W * S, H * S, cv => { const c = cv.getContext('2d'); c.scale(S, S); hills(c, W); }), 0, 0, W, H);
      // falling persimmons from the grove (one every 0.9 s), splatting in the grass
      { const k = Math.floor(t / 0.9), f = (t / 0.9) - k, tr = TREES[Math.floor(XY.hash(k, 55) * TREES.length)], x = tr[0] + (XY.hash(k, 56) - 0.5) * tr[2], y0 = tr[1] + 10;
        const y = Math.min(690, y0 + 1800 * f * f); if (y < 690) persimmon(g, x, y, 7, 0, f * 6); else { g.fillStyle = C.rust; g.beginPath(); g.ellipse(x, 690, 12, 3.5, 0, 0, TAU); g.fill(); } }
      // mid: the heap — squashed into low banks behind the plough, still standing ahead of it
      const pa = pigAt(b, e.at('bajie.head', acts)[0]), plough = pa && b > BEAT_HIT ? pa.x + 300 * pa.s : -1e4;
      const heap = XY.cached(`wpa-heap:${bgk(S)}`, W * S, H * S, cv => { const c = cv.getContext('2d'); c.scale(S, S); heapLayer(c, e); });
      const cut = XY.clamp(plough, 0, W), q = XY.lerp(1, 0.17, burst);
      if (cut > 0) g.drawImage(heap, 0, 0, cut * S, H * S, 0, 702 * (1 - q), cut, H * q);
      if (cut < W) { const dx = pa && b > BEAT_HIT ? 22 * Math.min(1, (b - BEAT_HIT) * 3) : 0; g.drawImage(heap, cut * S, 0, (W - cut) * S, H * S, cut + dx, 0, W - cut, H); }
      // stink lines and flies over the heap (they scatter once it breaks)
      g.lineCap = 'round'; g.strokeStyle = C.stink; g.lineWidth = 6;
      for (let k = 0; k < 7; k++) { const x0 = 900 + k * 46, top = heapTop(x0) - 20 - 160 * burst * (1 + k % 3), len = 120 * (1 - 0.8 * burst); if (len < 4) continue;
        g.beginPath(); for (let j = 0; j <= 10; j++) { const y = top - j / 10 * len, x = x0 + 12 * Math.sin(y * 0.05 + t * 5 + k); j ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke(); }
      for (let k = 0; k < 9; k++) { const cx = 900 + XY.hash(k, 61) * 260, cy = heapTop(cx) - 60 - XY.hash(k, 62) * 80, w = 3 + XY.hash(k, 63) * 2, ph = XY.hash(k, 64) * TAU, sc = 1 + 6 * burst;
        const x = cx + 40 * sc * Math.cos(w * t + ph), y = cy + 22 * sc * Math.sin(2 * w * t + ph) - 200 * burst; if (y < 20) continue;
        g.fillStyle = C.cream; g.beginPath(); g.ellipse(x - 3, y - 5, 5, 3, -0.6 + 0.5 * Math.sin(t * 60 + k), 0, TAU); g.ellipse(x + 3, y - 5, 5, 3, 0.6, 0, TAU); g.fill();
        g.fillStyle = C.dark; g.beginPath(); g.arc(x, y, 4, 0, TAU); g.fill(); }
      // the hero pig, behind the line of pilgrims
      if (pa) drawPig(g, pa.x, 670, pa.s, pa.gp, pa.push);   // a step behind the line of pilgrims
      if (b > BEAT_HIT && b < BEAT_HIT + 0.8) { const q = (b - BEAT_HIT) / 0.8, s = 1 - q * q; g.save(); g.translate(plough, 520); g.scale(s, s);
        K.ink(g, K.burst(0, 0, 70 + 90 * q, 150 + 120 * q, 14, 553, 0.2, 0.45), C.orange, C.dark, 4); K.ink(g, K.burst(0, 0, 40, 90 + 50 * q, 10, 554, 0, 0.4), C.sun, null, 0); g.restore(); }
      // near: the lane
      g.drawImage(XY.cached(`wpa-road:${bgk(S)}`, W * S, H * S, cv => { const c = cv.getContext('2d'); c.scale(S, S); roadLayer(c, W); }), 0, 0, W, H);
      // the fountain: persimmons thrown up and back by the plough; landed ones splat on the road
      const fly = [];
      for (let k = 0; k < 46; k++) {
        const bk = BEAT_HIT + (k < 16 ? 0.15 * k / 16 : 0.25 + 1.8 * (k - 16) / 30) + 0.05 * XY.hash(k, 70); if (b < bk) continue;
        const pk = pigAt(bk, 0), x0 = Math.min(W - 70, pk.x + 300 * pk.s), y0 = 600 - XY.hash(k, 71) * 170, vx = -(140 + XY.hash(k, 72) * (k < 16 ? 900 : 600)), vy = -(640 + XY.hash(k, 73) * 700), G = 2600, yl = 704 + XY.hash(k, 74) * 26;
        const dt = (b - bk) * XY.BEAT, dtL = (-vy + Math.sqrt(vy * vy + 2 * G * (yl - y0))) / G, r = 12 + 10 * XY.hash(k, 75);
        if (dt < dtL) fly.push([x0 + vx * dt, y0 + vy * dt + 0.5 * G * dt * dt, r, Math.floor(XY.hash(k, 76) * 4), dt * 9]);
        else { g.fillStyle = k % 3 ? C.orange : C.rust; g.beginPath(); g.ellipse(x0 + vx * dtL, yl, r * 1.5, r * 0.4, 0, 0, TAU); g.fill(); g.fillStyle = C.rust; g.beginPath(); g.ellipse(x0 + vx * dtL + 3, yl + 1, r * 0.7, r * 0.18, 0, 0, TAU); g.fill(); }
      }
      // the pilgrims (八戒 is the pig from beat 2 to 4.5)
      if (K.visible(e)) {
        const hidden = { bajie: b >= BEAT_POOF + 0.06 && b < BEAT_BACK + 0.08 }, smear = b >= BEAT_BACK;
        // each poly: flat fill, then its key line printed a hair out of register (later parts cover earlier lines)
        const keyed = (ctx, p, c) => { if (p.k !== 'poly') return false; XY.path(ctx, p.pts, true); ctx.fillStyle = c; ctx.fill();
          ctx.save(); ctx.translate(OFF[0], OFF[1]); ctx.strokeStyle = C.dark; ctx.lineWidth = 1.6; ctx.stroke(); ctx.restore(); return true; };
        const pen = { color: r => PAL[r], shade: 'rgba(38,56,74,0.30)', part: K.figPart(e.procX, null, (ctx, p, c, id, f) => smearPart(ctx, p, c, id, f, smear) || keyed(ctx, p, c)) };
        g.fillStyle = C.cream; g.fillRect(0, 420, 14, 292); g.fillRect(W - 14, 420, 14, 292);       // margin inside the walking band, under the pilgrims
        g.strokeStyle = C.dark; g.lineWidth = 2.5; g.beginPath(); g.moveTo(16, 420); g.lineTo(16, 712); g.moveTo(W - 16, 420); g.lineTo(W - 16, 712); g.stroke();
        XY.drawProcession(g, e.phase, e.procX, e.groundY, pen, hidden.bajie ? Object.assign({}, acts, { cast: { bajie: false } }) : acts);
        const bh = e.at('bajie.head', acts);
        poof(g, bh[0], bh[1] + 10, b, BEAT_POOF); poof(g, bh[0], bh[1] + 10, b, BEAT_BACK);
      }
      fly.forEach(p => persimmon(g, p[0], p[1], p[2], p[3], p[4]));
      g.drawImage(XY.cached(`wpa-fg:${bgk(S)}`, W * S, H * S, cv => { const c = cv.getContext('2d'); c.scale(S, S); fgLayer(c, W, H); }), 0, 0, W, H);
      // 开路: three silkscreen passes squeegeed on over the first beat (shadow, colour, key line)
      const TF = XY.font(184, '"Lantinghei SC", "Heiti SC", "PingFang SC", sans-serif', '900'), TX = 50, TY = 236, TW = 400;
      [[0, C.navy, 10, 10], [0.45, C.rust, 0, 0], [0.9, null, OFF[0] * 1.5, OFF[1] * 1.5]].forEach(([b0, col, dx, dy]) => {
        const r = K.ramp(b, b0, 0.24); if (r <= 0) return;
        g.save(); g.beginPath(); g.rect(TX - 20, 40, (TW + 40) * r, 230); g.clip();
        if (col) K.text(g, '开路', TX + dx, TY + dy, TF, col); else K.text(g, '开路', TX + dx, TY + dy, TF, null, { stroke: C.dark, lw: 3.2 });
        g.restore();
        if (r < 1) { g.fillStyle = C.dark; g.fillRect(TX - 20 + (TW + 40) * r, 36, 7, 238); }
      });
      // ink speckle of the screen print (static)
      K.grain(g, e, K.noiseTile('wpa', 256, (d, n) => { for (let i = 0; i < n * n; i++) { const h = XY.hash(i, 5577), o = i * 4, v = h < 0.05 ? 40 : h > 0.97 ? 250 : 128; d[o] = d[o + 1] = d[o + 2] = v; d[o + 3] = 255; } }), 'overlay', 0.35, 0);
    },
  };
})();
