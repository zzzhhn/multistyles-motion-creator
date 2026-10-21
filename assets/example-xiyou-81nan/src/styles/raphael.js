// 25 拉斐尔 · 1510 年 · 莲花洞高悬 — the demons' 莲花洞 ordered like a Raphael hall (v10: no classical architecture left: a cave mouth, a stone lotus in the
// coffers) opening onto a soft blue landscape, niches with marble statues of 金角 and 银角, a perspective marble floor,
// a grisaille socle. On beat 2 three ropes jerk the pilgrims up into a perfect pyramid: 唐僧 at the apex under the
// arch (his white horse walks on with an empty saddle), 沙僧 hanging at the lower left, 八戒 hog-tied (四马攒蹄)
// at the lower right. On beat 4 悟空 leaps, a golden arc cuts all three ropes and they drop back into line.
// Figures get Raphael's rilievo: a soft shadow made from their own silhouette offset toward the light.
// Entry: the pounced cartoon (spolvero charcoal dots) is painted over by a diagonal sweep.
(() => {
  'use strict';
  const XY = window.XY, K = XY.KIT_C, TAU = XY.TAU;
  const VP = [590, 330], HZ = 330;
  let SPOL = false;                                     // cartoon pass: dotted charcoal outlines, no colour
  const fl = (g, col) => { if (!SPOL) { g.fillStyle = col; g.fill(); } };
  const ln = (g, w = 1, a = 0.35) => { if (SPOL) { g.setLineDash([1.2, 5]); g.strokeStyle = 'rgba(40,36,34,0.85)'; g.lineWidth = 2; g.stroke(); g.setLineDash([]); } else { g.strokeStyle = `rgba(70,46,30,${a})`; g.lineWidth = w; g.stroke(); } };
  const shp = (g, pts, col, w = 1, a = 0.3) => { XY.path(g, pts, true); fl(g, col); ln(g, w, a); };
  const grad = (g, x0, y0, x1, y1, stops) => { const gr = g.createLinearGradient(x0, y0, x1, y1); stops.forEach(([o, c]) => gr.addColorStop(o, c)); return gr; };
  const COL = { fur: '#9A6A42', face: '#EED3B2', wkshirt: '#B83A2A', tiger: '#D89A3A', staff: '#A8301E', gold: '#D4AA4C', horse: '#F2EEE6', horse2: '#D8D2C6', mane: '#EAE4D8',
    hoof: '#4A3E34', saddle: '#7A2E22', red: '#B8382A', robe: '#E2BC5C', kasaya: '#B32E24', skin: '#F0D4B4', metal: '#C9A452', bjrobe: '#2E3E68', bjpants: '#283458', pig: '#F0BCAE', pig2: '#D89C8E',
    wood: '#8A5A34', ssrobe: '#3E6E58', ssrobe2: '#30584A', skin2: '#C8946A', ssh: '#A8402A', ssbeard: '#94381E', skull: '#F0EADA', bundle: '#C89A48', ink: '#2A1E16', stripe: '#2A1E16' };
  const PEN = { color: r => COL[r] || XY.DEFAULT_COLORS[r], outline: '#5A3A28', ow: 1.1, wob: 0, shade: 'rgba(80,40,24,0.2)' };
  const SIL = { color: () => '#000', shade: false };

  // ------------------------------------------------------------ 莲花洞, ordered like a Raphael hall
  const MOUTH = (() => { const p = []; for (let k = 0; k <= 20; k++) { const a = Math.PI + k / 20 * Math.PI, r = 1 + 0.06 * Math.sin(k * 2.3); p.push(VP[0] + Math.cos(a) * 215 * r, 470 + Math.sin(a) * 340 * r); } return p; })();
  const outside = g => {   // through the cave mouth: soft sky, the flat-topped 平顶山, a lake, pines — Raphael's blue distance
    if (!SPOL) { g.fillStyle = grad(g, 0, 120, 0, 470, [[0, '#7E9CC8'], [0.6, '#B8CAE0'], [1, '#EDE6D4']]); g.fillRect(370, 120, 440, 360);
      [[470, 230, 60], [690, 200, 80]].forEach(([x, y, w]) => { g.fillStyle = 'rgba(250,248,240,0.7)'; for (let k = 0; k < 4; k++) { g.beginPath(); g.ellipse(x + (k - 1.5) * w * 0.4, y - (k % 2) * 8, w * 0.36, 14, 0, 0, TAU); g.fill(); } }); }
    shp(g, [380, 450, 470, 360, 640, 352, 700, 384, 800, 450, 800, 470, 380, 470], '#8EA4C0', 0.8, 0.25);   // 平顶山's level top
    g.beginPath(); g.moveTo(380, 456); for (let x = 380; x <= 800; x += 20) g.lineTo(x, 440 - 10 * Math.sin((x - 300) / 50)); g.lineTo(800, 470); g.lineTo(380, 470); g.closePath(); fl(g, '#9AA884'); ln(g, 0.8, 0.2);
    for (let k = 0; k < 7; k++) { const x = 400 + k * 62 + 10 * Math.sin(k * 5), y = 446 - 4 * Math.sin(k); g.beginPath(); g.moveTo(x, y - 30); g.lineTo(x + 12, y); g.lineTo(x - 12, y); g.closePath(); fl(g, '#5E6E4E'); ln(g, 0.6, 0.2); }
  };
  const floor = g => {   // flagstones in one-point perspective
    const P = (x, z) => [VP[0] + (x - VP[0]) / z, HZ + 140 + (702 - HZ - 140) / z], zs = []; for (let z = 1; z < 2.6; z *= 1.16) zs.push(z);
    for (let i = 0; i < zs.length - 1; i++) for (let k = -8; k < 10; k++) { const x0 = VP[0] + k * 110 - 55 + (i % 2) * 40, a = P(x0, zs[i]), b = P(x0 + 110, zs[i]), c = P(x0 + 110, zs[i + 1]), d = P(x0, zs[i + 1]), v = XY.hash(i, k, 25);
      shp(g, [...a, ...b, ...c, ...d], v < 0.33 ? '#9A8670' : v < 0.66 ? '#A8947C' : '#8E7A66', 0.7, 0.3); }
  };
  const rock = (g, W, H) => {   // the cave: rock everywhere but the mouth, strata, stalactites, a stone lotus in the crown
    if (!SPOL) { const m = new Path2D(); m.rect(0, 0, W, 702); m.moveTo(MOUTH[0], MOUTH[1]); for (let k = 2; k < MOUTH.length; k += 2) m.lineTo(MOUTH[k], MOUTH[k + 1]); m.closePath();
      g.fillStyle = grad(g, 0, 0, W, 0, [[0, '#6E5A48'], [0.3, '#9A8268'], [0.5, '#A88E72'], [0.7, '#9A8268'], [1, '#62503E']]); g.fill(m, 'evenodd');
      const v = g.createLinearGradient(0, 0, 0, 702); v.addColorStop(0, 'rgba(40,24,14,0.35)'); v.addColorStop(0.5, 'rgba(40,24,14,0)'); v.addColorStop(1, 'rgba(40,24,14,0.2)'); g.fillStyle = v; g.fill(m, 'evenodd'); }
    XY.path(g, MOUTH, false); ln(g, 2, 0.5);
    for (let k = 0; k < 12; k++) { const y = 60 + k * 54, s = k % 2 ? 1 : -1; [[0, 360], [820, W]].forEach(([x0, x1]) => { g.beginPath(); g.moveTo(x0, y); g.bezierCurveTo(x0 + 120, y - 18 * s, x1 - 120, y + 14 * s, x1, y - 6); ln(g, 0.9, 0.22); }); }
    for (let k = 0; k < 22; k++) { const x = 20 + k * 54 + 14 * Math.sin(k * 3), l = 30 + 40 * XY.hash(k, 7); if (x > 400 && x < 780) continue; shp(g, [x - 9, 0, x + 9, 0, x + 1, l], '#8A7258', 0.8, 0.35); }
    // carved stone lotus in the crown of the cave
    for (let k = 0; k < 9; k++) { const a = Math.PI + (k + 0.5) / 9 * Math.PI, cx = VP[0] + Math.cos(a) * 46, cy = 118 + Math.sin(a) * 40; g.save(); g.translate(cx, cy); g.rotate(a + Math.PI / 2); g.beginPath(); g.ellipse(0, 0, 13, 30, 0, 0, TAU); fl(g, '#C8B49A'); ln(g, 1, 0.4); g.restore(); }
    g.beginPath(); g.ellipse(VP[0], 116, 30, 12, 0, 0, TAU); fl(g, '#B8A086'); ln(g, 1, 0.4);
  };
  const seat = (g, x, horn) => {   // a stone throne carved into the wall; the demon king on it is drawn live
    shp(g, [x - 70, 520, x + 70, 520, x + 64, 360, x - 64, 360], '#7E6A56', 1.2, 0.45);
    g.beginPath(); g.moveTo(x - 64, 360); g.quadraticCurveTo(x, 300, x + 64, 360); fl(g, '#7E6A56'); ln(g, 1.2, 0.45);
    shp(g, [x - 84, 520, x + 84, 520, x + 84, 548, x - 84, 548], '#9A8670', 1, 0.45);
    for (let k = 0; k < 5; k++) { g.beginPath(); g.arc(x - 48 + k * 24, 534, 7, Math.PI, 0); ln(g, 0.9, 0.4); }
    void horn;
  };
  const walls = (g, W) => {
    seat(g, 160, 1); seat(g, 1020, -1);
    shp(g, [52, 206, 268, 206, 268, 262, 52, 262], '#3E5446', 1.2, 0.5); shp(g, [912, 206, 1128, 206, 1128, 262, 912, 262], '#3E5446', 1.2, 0.5);
    g.fillStyle = SPOL ? 'rgba(40,36,34,0.85)' : '#E2C26A'; g.font = XY.font(46, XY.cnFont.song, 'bold'); g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('高 悬', 160, 235);
    g.font = XY.font(36, 'Optima, "Gill Sans", serif', '600'); g.fillText('· XXV ·', 1020, 236); g.textAlign = 'left'; g.textBaseline = 'alphabetic';
    // the five treasures on a ledge above 银角's seat: 紫金红葫芦, 羊脂玉净瓶, 七星剑, 芭蕉扇, 幌金绳
    shp(g, [900, 300, 1140, 300, 1132, 312, 908, 312], '#9A8670', 1, 0.45);
    g.beginPath(); g.ellipse(930, 288, 9, 12, 0, 0, TAU); g.ellipse(930, 268, 6, 8, 0, 0, TAU); fl(g, '#A8352A'); ln(g, 1, 0.5);
    g.beginPath(); g.moveTo(966, 300); g.quadraticCurveTo(954, 280, 966, 268); g.lineTo(966, 252); g.lineTo(972, 252); g.lineTo(972, 268); g.quadraticCurveTo(984, 280, 972, 300); g.closePath(); fl(g, '#F2EEE4'); ln(g, 1, 0.5);
    shp(g, [998, 298, 1046, 252, 1050, 256, 1002, 302], '#C8C8C8', 0.8, 0.5); for (let k = 0; k < 7; k++) { g.beginPath(); g.arc(1006 + k * 6, 290 - k * 6, 1.4, 0, TAU); fl(g, '#E2C26A'); }
    g.beginPath(); g.moveTo(1070, 300); g.lineTo(1060, 262); g.quadraticCurveTo(1078, 246, 1096, 262); g.lineTo(1074, 300); g.closePath(); fl(g, '#7E9A5A'); ln(g, 1, 0.45);
    for (let k = 0; k < 3; k++) { g.beginPath(); g.ellipse(1120, 292 - k * 5, 14, 5, 0, 0, TAU); g.strokeStyle = SPOL ? 'rgba(40,36,34,0.85)' : '#D4AA4C'; g.lineWidth = 2.2; g.stroke(); }
  };
  const socle = (g, W) => {   // the stone base with lotus panels
    shp(g, [0, 702, W, 702, W, 780, 0, 780], '#6E6458', 1, 0.4); shp(g, [0, 702, W, 702, W, 712, 0, 712], '#9A8E7E', 0.8, 0.4);
    for (let k = 0; k < 7; k++) { const x0 = 20 + k * 166; shp(g, [x0 + 8, 722, x0 + 158, 722, x0 + 158, 770, x0 + 8, 770], '#857A6C', 1, 0.5);
      for (let q = -2; q <= 2; q++) { g.beginPath(); g.ellipse(x0 + 83 + q * 16, 750, 7, 16, q * 0.35, 0, TAU); ln(g, 0.9, 0.45); } }
  };
  const scene = (g, W) => { outside(g); rock(g, W); floor(g); walls(g, W); socle(g, W); };
  const cartoon = (W, H, scale) => XY.cached(`rf-spol:${scale.toFixed(4)}`, W * scale, H * scale, cv => { const g = cv.getContext('2d'); g.setTransform(scale, 0, 0, scale, 0, 0);
    g.fillStyle = '#EFE8DA'; g.fillRect(0, 0, W, H); SPOL = true; scene(g, W); SPOL = false; });
  const ROPES = { monk: [590, 150], shaseng: [400, 150], bajie: [770, 150] }, CUT = { monk: 230, shaseng: 250, bajie: 246 };
  const TARGET = { monk: [600, 470, 0], shaseng: [400, 520, 0], bajie: [760, 470, Math.PI / 2] };
  const HIP = { monk: [-10, -124], shaseng: [0, -79], bajie: [0, -51] }, LEGC = { monk: '#B32E24', shaseng: '#30584A', bajie: '#283458' };
  // a pilgrim trussed up: the rig draws him down to the hips, the legs are one bound bundle wound with rope
  const bound = (ctx, e, acts, name, pen, x, y, rot, w) => {
    const hp = HIP[name], len = -hp[1];
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
    ctx.save(); ctx.beginPath(); ctx.rect(-200, -400, 400, 400 + hp[1] + 4); ctx.clip();
    XY.drawProcession(ctx, w, -K.FX[name], 0, name === 'monk' ? K.riderPen(pen) : pen, K.cast(acts, K.solo(name))); ctx.restore();
    if (pen === SIL) { ctx.fillStyle = '#000'; } else ctx.fillStyle = LEGC[name];
    ctx.beginPath(); ctx.moveTo(hp[0] - 14, hp[1]); ctx.quadraticCurveTo(hp[0] - 16, hp[1] + len * 0.6, hp[0] - 6, -2); ctx.lineTo(hp[0] + 8, -2); ctx.quadraticCurveTo(hp[0] + 18, hp[1] + len * 0.6, hp[0] + 14, hp[1]); ctx.closePath(); ctx.fill();
    if (pen !== SIL) { ctx.strokeStyle = '#5A3A28'; ctx.lineWidth = 1.1; ctx.stroke();
      ctx.strokeStyle = '#8A6A44'; ctx.lineWidth = 3.4; for (let k = 0; k < 4; k++) { const yy = hp[1] + (k + 0.6) * len / 4.6; ctx.beginPath(); ctx.moveTo(hp[0] - 16, yy - 3); ctx.lineTo(hp[0] + 16, yy + 3); ctx.stroke(); }
      ctx.beginPath(); ctx.moveTo(hp[0] - 18, hp[1] - 26); ctx.lineTo(hp[0] + 18, hp[1] - 18); ctx.moveTo(hp[0] - 18, hp[1] - 14); ctx.lineTo(hp[0] + 18, hp[1] - 6); ctx.stroke();
      ctx.fillStyle = '#3A2A20'; ctx.beginPath(); ctx.ellipse(hp[0], -3, 10, 5, 0, 0, TAU); ctx.fill(); }
    ctx.restore();
  };
  // 金角 / 银角 on their stone seats: laughing while the pilgrims are hoisted, leaping up in rage when the ropes are cut
  const demonKing = (g, x, horn, t, laugh, rage) => {
    const y = 520 - 24 * rage, body = horn > 0 ? '#C8A04A' : '#9AA8BC', dark = horn > 0 ? '#8A6A2A' : '#5E6A80', sh = 0.04 * Math.sin(t * 14) * laugh;
    g.save(); g.translate(x, y); g.rotate(sh);
    g.fillStyle = grad(g, -50, 0, 50, 0, [[0, body], [1, dark]]); g.beginPath(); g.moveTo(-50, 0); g.lineTo(52, 0); g.lineTo(40, -96); g.quadraticCurveTo(0, -116, -40, -96); g.closePath(); g.fill(); g.strokeStyle = 'rgba(70,40,24,0.5)'; g.lineWidth = 1; g.stroke();
    g.strokeStyle = 'rgba(70,40,24,0.35)'; for (let k = -2; k <= 2; k++) { g.beginPath(); g.moveTo(k * 16, -94); g.quadraticCurveTo(k * 18 + 6, -50, k * 20, -2); g.stroke(); }
    g.fillStyle = '#A8352A'; g.fillRect(-42, -70, 84, 10);
    const ax = horn * -30, ay = -150 - 40 * rage; g.strokeStyle = body; g.lineWidth = 14; g.lineCap = 'round'; g.beginPath(); g.moveTo(horn * -26, -90); g.quadraticCurveTo(horn * -46, -110, ax, ay + 40 * (1 - rage)); g.stroke();
    g.fillStyle = '#7E9A8A'; g.beginPath(); g.ellipse(0, -132, 26, 28, 0, 0, TAU); g.fill(); g.stroke();
    g.fillStyle = grad(g, -24, -150, 24, -110, [[0, '#9EBAAA'], [1, '#5E7A6A']]); g.beginPath(); g.ellipse(0, -132, 25, 27, 0, 0, TAU); g.fill();
    g.fillStyle = '#E8DCC0'; g.beginPath(); g.moveTo(-6, -156); g.quadraticCurveTo(horn * 8 - 4, -196, horn * 20, -204); g.quadraticCurveTo(horn * 6, -178, 8, -156); g.closePath(); g.fill(); g.strokeStyle = 'rgba(70,40,24,0.6)'; g.lineWidth = 1; g.stroke();
    g.fillStyle = '#FFE070'; [[-10, -138], [10, -138]].forEach(([ex, ey]) => { g.beginPath(); g.ellipse(ex, ey, 5, 3.4 + 1.6 * rage, 0, 0, TAU); g.fill(); g.fillStyle = '#2A1A10'; g.beginPath(); g.arc(ex, ey, 1.8, 0, TAU); g.fill(); g.fillStyle = '#FFE070'; });
    g.strokeStyle = '#2A1A10'; g.lineWidth = 2.6; g.beginPath(); g.moveTo(-18, -150 + 4 * rage); g.lineTo(-4, -146); g.moveTo(18, -150 + 4 * rage); g.lineTo(4, -146); g.stroke();
    g.fillStyle = '#5A1A14'; g.beginPath(); g.ellipse(0, -118, 11, 3 + 7 * Math.max(laugh * (0.6 + 0.4 * Math.abs(Math.sin(t * 14))), rage), 0, 0, TAU); g.fill();
    g.fillStyle = '#F4EEE0'; [-6, 6].forEach(dx => { g.beginPath(); g.moveTo(dx - 3, -122); g.lineTo(dx, -112); g.lineTo(dx + 3, -122); g.fill(); });
    g.restore();
  };
  const lamp = (g, x, t, k) => { const fl = 0.5 + 0.5 * XY.noise1(t * 5 + k * 9, 3);
    g.strokeStyle = 'rgba(70,50,30,0.6)'; g.lineWidth = 1; g.beginPath(); g.moveTo(x, 70); g.lineTo(x, 182); g.stroke();
    g.fillStyle = grad(g, x - 16, 0, x + 16, 0, [[0, '#E2C27A'], [1, '#8A6A34']]); g.beginPath(); g.moveTo(x - 16, 182); g.quadraticCurveTo(x, 204, x + 16, 182); g.closePath(); g.fill();
    const gr = g.createRadialGradient(x, 170, 1, x, 172, 40); gr.addColorStop(0, `rgba(255,230,160,${0.55 + 0.25 * fl})`); gr.addColorStop(1, 'rgba(255,200,120,0)'); g.fillStyle = gr; g.fillRect(x - 40, 130, 80, 80);
    g.fillStyle = '#FFE7A0'; g.beginPath(); g.moveTo(x - 4, 182); g.quadraticCurveTo(x - 3 + 2 * fl, 172 - 6 * fl, x + 1 * fl, 164 - 4 * fl); g.quadraticCurveTo(x + 4, 174, x + 4, 182); g.fill(); };

  XY.STYLES.raphael = {
    hits: [3.4, 5.2],
    bg(g, W, H, c, scale) {
      SPOL = false; scene(g, W);
      K.paint(g, K.pix(W, H, scale, 4, (x, y) => { const v = 255 * (0.93 + 0.05 * XY.fbm(x / 60, y / 60, 25, 3)); return [v, v * 0.98, v * 0.95]; }), W, H, 'multiply');
    },
    draw(g, e) {
      const { W, H, t, u } = e, b = e.beat, S = e.S;
      const jump = (b - 4.5) / 1.0, acts = { wukong: { shade: K.bump(b, 2.0, 2.4, 3.6, 4.0), raise: K.bump(b, 4.4, 4.8, 5.05, 5.15), strike: K.bump(b, 5.05, 5.2, 5.4, 5.7) },
        monk: { palm: 0 }, bajie: { scratch: 0 }, shaseng: { lift: K.bump(b, 6.0, 6.2, 6.6, 7.0) } };
      K.push(g, e, 590, 330, K.pushOf(b, 4.7, 5.2, 6.4, 0.1));
      // ---- life in the cave: clouds beyond the mouth, birds, the oil lamps; the demon kings on their seats
      g.save(); XY.path(g, MOUTH, true); g.clip();
      for (let k = 0; k < 3; k++) { const x = 380 + ((t * (10 + 4 * k) + k * 160) % 520), y = 220 + k * 40; g.fillStyle = 'rgba(252,250,244,0.75)'; for (let q = 0; q < 3; q++) { g.beginPath(); g.ellipse(x + q * 22, y - (q % 2) * 7, 24, 9, 0, 0, TAU); g.fill(); } }
      for (let k = 0; k < 3; k++) { const a = t * 0.8 + k * 2, x = 590 + Math.cos(a) * 110, y = 300 + Math.sin(a * 1.3) * 40, f2 = Math.sin(t * 12 + k); g.strokeStyle = '#4E4A44'; g.lineWidth = 2; g.beginPath(); g.moveTo(x - 6, y - 4 * f2); g.quadraticCurveTo(x, y, x + 6, y - 4 * f2); g.stroke(); }
      g.restore();
      lamp(g, 300, t, 0); lamp(g, 880, t, 1);
      const laugh = K.bump(b, 3.4, 3.7, 4.8, 5.1), rage = XY.smooth((b - 5.4) / 0.4);
      demonKing(g, 160, 1, t, laugh, rage); demonKing(g, 1020, -1, t + 1, laugh, rage);
      // ---- the hoist: snares drop at 2.4, jerk them up at 3.2 (overshoot), they hang and sway; cut at 5.2, down by 5.7
      const up = b > 3.2 && b < 5.75, f = b < 5.2 ? K.back((b - 3.2) / 0.4, 1.4) : 1 - XY.easeIn((b - 5.2) / 0.5), wF = XY.walkPhase(e.cell.t0 + 3.2 * XY.BEAT);
      const sway = k => 0.06 * Math.sin(t * 1.7 + k * 1.3) * XY.clamp((b - 3.6) / 0.3);
      const pos = name => { const T = TARGET[name], h = K.home(e, name); return [XY.lerp(h[0], T[0], f), XY.lerp(h[1], T[1], f), T[2] * Math.min(1, f)]; };
      const wk = jump > 0 && jump < 1;
      const drawFigs = (ctx, pen, dx, dy) => {
        ctx.save(); ctx.translate(dx, dy);
        XY.drawProcession(ctx, e.phase, e.procX, e.groundY, pen, K.cast(acts, up ? { bajie: false, shaseng: false, wukong: !wk, rider: false } : { wukong: !wk }));
        if (up) [['shaseng', 0], ['bajie', 1], ['monk', 2]].forEach(([name, k]) => { const [x, y, rot] = pos(name), P = ROPES[name];
          ctx.save(); ctx.translate(P[0], P[1]); ctx.rotate(sway(k)); ctx.translate(-P[0], -P[1]); bound(ctx, e, acts, name, pen, x, y, rot + 0.12 * Math.sin(t * 1.3 + k), wF); ctx.restore(); });
        if (wk) { const h = K.home(e, 'wukong'), q = Math.sin(jump * Math.PI), x = XY.lerp(h[0], 640, q), y = h[1] - 300 * q; K.fig(ctx, e, acts, 'wukong', pen, x, y, { rot: -0.25 * q }); }
        ctx.restore();
      };
      // ropes (thick, behind the figures): snares dangle, shoot down at 2.4, taut while hanging, cut and recoiling after 5.2
      g.lineCap = 'round';
      ['shaseng', 'bajie', 'monk'].forEach((name, k) => { const P = ROPES[name], [x, y, rot] = pos(name);
        const rope = (x0, y0, x1, y1) => { g.strokeStyle = '#4A3424'; g.lineWidth = 6; g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.stroke(); g.strokeStyle = '#A8865A'; g.lineWidth = 3.6; g.stroke(); };
        if (b >= 5.2) { const r = CUT[name] + 40 * Math.exp(-(b - 5.2) * 3) * Math.sin((b - 5.2) * 14); rope(P[0], P[1] - 120, P[0] + 4 * Math.sin(t * 9) * Math.exp(-(b - 5.2)), r); return; }
        const hd = K.figPoint(e, acts, name, 'head', x, y, { rot, w: wF }), at = [hd[0], hd[1] - 22];
        let end; if (b < 2.4) end = [P[0] + 8 * Math.sin(t * 1.4 + k), 330 + 6 * Math.sin(t + k)];
        else if (b < 3.2) { const q = XY.clamp((b - 2.4) / 0.3), hh = K.home(e, name), hdh = K.figPoint(e, acts, name, 'head', hh[0], hh[1], { w: e.phase }); end = [XY.lerp(P[0], hdh[0], q), XY.lerp(330, hdh[1] - 10, q)]; }
        else end = at;
        g.save(); g.translate(P[0], P[1]); g.rotate(b > 3.6 ? sway(k) : 0); g.translate(-P[0], -P[1]); rope(P[0], P[1] - 120, end[0], end[1]);
        if (b < 3.2) { g.strokeStyle = '#A8865A'; g.lineWidth = 3.6; g.beginPath(); g.ellipse(end[0], end[1] + 10, 9, 12, 0, 0, TAU); g.stroke(); } g.restore(); });
      // ---- rilievo: a warm light from the cave mouth (upper left) — shadow on the far side, a highlight on the near edges
      const [A, ag] = K.layer(e, 'rf-A'), [M, mg] = K.layer(e, 'rf-M'), [N, ng] = K.layer(e, 'rf-N');
      drawFigs(ag, PEN, 0, 0); drawFigs(mg, SIL, -6, -5); drawFigs(ng, SIL, 4, 4);
      const [Sh, sg] = K.layer(e, 'rf-S'); sg.setTransform(1, 0, 0, 1, 0, 0); sg.fillStyle = 'rgba(70,34,20,0.6)'; sg.fillRect(0, 0, Sh.width, Sh.height); sg.globalCompositeOperation = 'destination-out'; sg.drawImage(M, 0, 0);
      const sm = K.shrink(Sh, 3, 'rf-sh'); ag.save(); ag.setTransform(1, 0, 0, 1, 0, 0); ag.globalCompositeOperation = 'source-atop'; ag.imageSmoothingQuality = 'high'; ag.drawImage(sm, 0, 0, A.width, A.height); ag.restore();
      const [Hl, hg] = K.layer(e, 'rf-H'); hg.setTransform(1, 0, 0, 1, 0, 0); hg.fillStyle = 'rgba(255,232,196,0.5)'; hg.fillRect(0, 0, Hl.width, Hl.height); hg.globalCompositeOperation = 'destination-out'; hg.drawImage(N, 0, 0);
      const hs = K.shrink(Hl, 3, 'rf-hl'); ag.save(); ag.setTransform(1, 0, 0, 1, 0, 0); ag.globalCompositeOperation = 'source-atop'; ag.imageSmoothingQuality = 'high'; ag.drawImage(hs, 0, 0, A.width, A.height); ag.restore();
      K.blit(g, A);
      // ---- the cut: a golden arc through all three ropes on beat 5.2, then dust where they land
      const cut = b - 5.15; if (cut > 0 && cut < 0.35) { const a = 1 - cut / 0.35; g.save(); g.globalCompositeOperation = 'lighter'; g.strokeStyle = `rgba(255,216,120,${a})`; g.lineWidth = 14 * a + 2;
        g.beginPath(); g.moveTo(340, 300); g.quadraticCurveTo(590, 120, 840, 290); g.stroke(); g.strokeStyle = `rgba(255,255,240,${a})`; g.lineWidth = 4; g.stroke(); g.restore(); }
      const dust = b - 5.7; if (dust > 0 && dust < 0.8) ['shaseng', 'bajie', 'monk'].forEach((name, k) => { const h = K.home(e, name); for (let q = 0; q < 6; q++) { const a = q / 5 * Math.PI, r = 20 + 60 * dust;
        g.fillStyle = `rgba(150,120,90,${0.5 * (1 - dust / 0.8)})`; g.beginPath(); g.arc(h[0] + Math.cos(a) * r * 1.4 - 20 * k, 698 - Math.sin(a) * r * 0.4, 6 + 6 * dust, 0, TAU); g.fill(); } });
      // ---- entry: the pounced cartoon is painted over by a diagonal sweep
      const xf = XY.lerp(-320, W + 320, XY.smooth((u + 0.4) / 0.32));
      if (xf < W + 300) { g.save(); g.beginPath(); g.moveTo(xf + 180, 0); g.lineTo(W, 0); g.lineTo(W, H); g.lineTo(xf - 180, H); g.closePath(); g.clip();
        g.setTransform(1, 0, 0, 1, 0, 0); g.drawImage(cartoon(W, H, S), 0, 0); g.restore();
        g.save(); g.globalCompositeOperation = 'lighter'; const gr = g.createLinearGradient(xf - 60, 0, xf + 60, 0); gr.addColorStop(0, 'rgba(255,240,210,0)'); gr.addColorStop(0.5, 'rgba(255,240,210,0.35)'); gr.addColorStop(1, 'rgba(255,240,210,0)');
        g.fillStyle = gr; g.beginPath(); g.moveTo(xf + 120, 0); g.lineTo(xf + 240, 0); g.lineTo(xf - 120, H); g.lineTo(xf - 240, H); g.closePath(); g.fill(); g.restore(); }
    },
  };
})();
