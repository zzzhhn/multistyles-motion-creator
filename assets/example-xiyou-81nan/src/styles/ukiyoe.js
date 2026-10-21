// 35 浮世绘 · 祛道兴僧 — a Prussian-blue print, c. 1830: keyblock lines, flat colour, bokashi sky, a title slip. v10: no Fuji; the
// wave is the rain-dragon 悟空 calls in the 求雨 contest, its crest a 龙王's head; it smashes the 三清 statues carried out of the 三清观.
// The great wave curls in from the right over a rock where the three Pure Ones (三清) sit; on beat 3 its finger-like
// foam closes on them and the statues burst into gilt shards. The print rubs itself in, key block first, then colour.
(() => {
  'use strict';
  const XY = window.XY, K = XY.KIT_D, TAU = XY.TAU;
  const GY = 702, HZ = 500, INK = '#1C1A18', PAPER = '#F2EAD6';
  const C = { pru: '#1F3E78', ind: '#2E5490', lbl: '#8AACCC', foam: '#F6F2E6', sky: '#EADFC4', sand: '#D8BC86', och: '#C89A50', gold: '#D8A838', red: '#B83A2A', grn: '#4A6A4A' };
  const COL = { fur: '#8A5A34', face: '#F0D2AE', wkshirt: C.red, tiger: '#D89A3A', stripe: INK, gold: C.gold, staff: C.red, ink: INK,
    horse: '#F6F0E2', horse2: '#DCD2BE', mane: '#E8E0CE', hoof: INK, saddle: C.pru, red: C.red, robe: '#D8B060', kasaya: C.red,
    skin: '#F2D8B8', metal: C.gold, bjrobe: '#2A3448', bjpants: '#1E2638', pig: '#F0C4B4', pig2: '#D89888', wood: '#8A6034',
    ssrobe: C.ind, ssrobe2: C.pru, skin2: '#C8946C', ssh: C.red, ssbeard: '#9A3424', skull: C.foam, bundle: C.och };
  const PEN = { outline: INK, ow: 1.1, shade: false, seed: 35, color: r => COL[r] || XY.DEFAULT_COLORS[r] };
  const LIP = [930, 122, 840, 124, 760, 144, 696, 176, 648, 222, 622, 276];
  const WAVE = [1180, 640, 1180, 330, 1120, 220, 1030, 140, 930, 116, 830, 122, 740, 146, 672, 186, 630, 236, 612, 284, 630, 306, 660, 290, 680, 256, 730, 262, 800, 300, 850, 380, 880, 480, 900, 580, 930, 640];
  const shape = (g, pts, col, mode, lw = 2) => { XY.path(g, pts, true); g.fillStyle = mode === 'key' ? PAPER : col; g.fill(); g.strokeStyle = INK; g.lineWidth = lw; g.lineJoin = 'round'; g.stroke(); };

  // the whole print except the moving parts, in two states: 'key' (line block only) and 'color'
  const paintPrint = (g, W, H, mode) => {
    const col = mode === 'color';
    g.fillStyle = PAPER; g.fillRect(0, 0, W, H);
    if (col) { const gr = g.createLinearGradient(0, 0, 0, HZ); gr.addColorStop(0, C.pru); gr.addColorStop(0.16, '#5A78A8'); gr.addColorStop(0.34, C.sky); gr.addColorStop(1, '#F0E6CE'); g.fillStyle = gr; g.fillRect(0, 0, W, HZ);
      g.strokeStyle = 'rgba(120,96,60,0.10)'; g.lineWidth = 1.2; for (let k = 0; k < 40; k++) { const y0 = 150 + k * 9; g.beginPath(); for (let x = 0; x <= W; x += 20) g.lineTo(x, y0 + 4 * Math.sin(x / 90 + k * 0.7) + 3 * Math.sin(x / 23 + k)); g.stroke(); } }
    // cloud bands; far off on the shore, the walls of 车迟国 and the roof of the 三清观 the statues were carried out of
    [[160, 330, 300, 22], [520, 290, 240, 18], [300, 420, 360, 16]].forEach(([x, y, w, h]) => shape(g, XY.RIG.spline([x - w / 2, y, x - w / 3, y - h, x, y - h * 1.2, x + w / 3, y - h, x + w / 2, y, x, y + h * 0.5], true, 4), '#E2D2A8', mode, 1.4));
    shape(g, [180, HZ, 180, 474, 560, 474, 560, HZ], '#B8A47A', mode, 1.4); for (let x = 186; x < 556; x += 16) shape(g, [x, 474, x + 10, 474, x + 10, 466, x, 466], '#B8A47A', mode, 1);
    shape(g, [330, 474, 330, 444, 430, 444, 430, 474], '#C8442E', mode, 1.4); shape(g, [300, 446, 318, 430, 380, 418, 442, 430, 460, 446, 380, 440], '#2E3A52', mode, 1.6);
    shape(g, [350, 474, 350, 456, 410, 456, 410, 474], '#3A2A20', mode, 1);
    // the sea, with Hokusai's net of wave lines
    shape(g, [0, HZ, W, HZ, W, 690, 0, 690], C.ind, mode, 2);
    g.strokeStyle = col ? 'rgba(246,242,230,0.7)' : 'rgba(28,26,24,0.5)'; g.lineWidth = 1.2;
    for (let r = 0; r < 8; r++) { const y = HZ + 14 + r * 22; g.beginPath(); for (let x = 0; x <= W; x += 10) g.lineTo(x, y + 5 * Math.sin(x / (40 + r * 6) + r)); g.stroke(); }
    // the rock where the three Pure Ones sit
    shape(g, [560, 690, 590, 520, 640, 500, 760, 498, 820, 520, 850, 690], '#6A5A48', mode, 2.2);
    if (col) { g.strokeStyle = 'rgba(28,26,24,0.45)'; g.lineWidth = 1.2; for (let k = 0; k < 8; k++) { g.beginPath(); g.moveTo(600 + k * 30, 520 + 6 * (k % 2)); g.lineTo(590 + k * 32, 680); g.stroke(); } }
    // the great wave: Prussian-blue body, lighter toward the crest, white lines riding its face
    XY.path(g, XY.RIG.spline(WAVE, true, 4), true);
    if (col) { const gr = g.createLinearGradient(700, 140, 1100, 600); gr.addColorStop(0, '#6E92C0'); gr.addColorStop(0.3, C.ind); gr.addColorStop(1, C.pru); g.fillStyle = gr; } else g.fillStyle = PAPER;
    g.fill(); g.strokeStyle = INK; g.lineWidth = 2.6; g.stroke();
    g.save(); XY.path(g, XY.RIG.spline(WAVE, true, 4), true); g.clip(); g.strokeStyle = col ? 'rgba(246,242,230,0.75)' : 'rgba(28,26,24,0.5)'; g.lineWidth = 1.6;
    for (let k = 0; k < 16; k++) { g.beginPath(); for (let s = 0; s <= 1; s += 0.05) { const x = XY.lerp(700 + k * 30, 900 + k * 18, s) + 30 * Math.sin(s * 3 + k), y = XY.lerp(180 + k * 4, 660, s); g.lineTo(x, y); } g.stroke(); }
    g.restore();
    // shore: sand, a keyline at the gallery line, pebbles
    shape(g, [0, 690, W, 690, W, H, 0, H], C.sand, mode, 2.4);
    { const R = XY.rng(35); for (let k = 0; k < 50; k++) { const x = R() * W, y = 712 + R() * 60; XY.path(g, XY.ellipse(x, y, 3 + R() * 5, 2 + R() * 2, 8), true); g.fillStyle = col ? C.och : PAPER; g.fill(); g.strokeStyle = INK; g.lineWidth = 0.8; g.stroke(); } }
    shape(g, [0, 780, 0, 742, 60, 724, 120, 740, 150, 780], '#5A4A3A', mode, 2); shape(g, [1040, 780, 1080, 736, 1150, 728, 1180, 744, 1180, 780], '#5A4A3A', mode, 2);
    // the title slip (短冊): 僧 and the count, the gourd seal below
    g.fillStyle = 'rgba(0,0,0,0.12)'; g.fillRect(44, 44, 80, 260); shape(g, [40, 40, 116, 40, 116, 296, 40, 296], '#F2E2A0', mode, 2);
    g.strokeStyle = INK; g.lineWidth = 1; g.strokeRect(46, 46, 64, 244);
    g.fillStyle = INK; g.font = XY.font(60, '"Hiragino Mincho ProN", "Songti SC", serif', '600'); g.textAlign = 'center'; g.textBaseline = 'alphabetic'; g.fillText('僧', 78, 110);
    g.font = XY.font(24, '"Hiragino Mincho ProN", "Songti SC", serif'); K.vtext(g, '第三十五难', 78, 146, 28); g.textAlign = 'left';
    if (col) { g.fillStyle = C.red; g.beginPath(); g.ellipse(78, 318, 9, 9, 0, 0, TAU); g.ellipse(78, 338, 13, 13, 0, 0, TAU); g.fill(); g.fillStyle = PAPER; g.font = XY.font(12, XY.cnFont.li, 'bold'); g.textAlign = 'center'; g.fillText('画', 78, 343); g.textAlign = 'left'; }
    if (col) K.grain(g, W, H, 351, 1600, 'rgba(120,96,60,0.10)', 'rgba(255,252,240,0.25)', 5);
  };
  const printLayer = (W, H, S, mode) => XY.cached(`kd35-${mode}:` + S.toFixed(4), W * S, H * S, cv => { const g = cv.getContext('2d'); g.setTransform(S, 0, 0, S, 0, 0); paintPrint(g, W, H, mode); });

  // 三清: 灵宝天尊 with a ruyi, 元始天尊 with a pearl, 道德天尊 (老君) with a fan and a white beard
  const STAT = [[648, 'ruyi'], [708, 'pearl'], [768, 'fan']], RY = 498;
  function statue(g, x, y, kind) {
    shape(g, XY.ellipse(x, y - 68, 26, 26, 24), '#F2D890', 'color', 1.4);
    shape(g, [x - 30, y, x - 22, y - 52, x + 22, y - 52, x + 30, y], C.gold, 'color', 1.8);
    g.strokeStyle = INK; g.lineWidth = 1; [[-18, -10, -6, -46], [18, -10, 6, -46], [-26, -6, 26, -6]].forEach(([a, b, c, d]) => { g.beginPath(); g.moveTo(x + a, y + b); g.lineTo(x + c, y + d); g.stroke(); });
    shape(g, XY.ellipse(x, y - 64, 11, 13, 16), '#F2D8B8', 'color', 1.4); shape(g, [x - 8, y - 76, x + 8, y - 76, x + 6, y - 88, x - 6, y - 88], INK, 'color', 1);
    g.strokeStyle = INK; g.lineWidth = 1; g.beginPath(); g.moveTo(x - 6, y - 66); g.lineTo(x - 2, y - 66); g.moveTo(x + 2, y - 66); g.lineTo(x + 6, y - 66); g.stroke();
    if (kind === 'fan') { shape(g, [x - 6, y - 56, x + 6, y - 56, x + 3, y - 34, x - 3, y - 34], C.foam, 'color', 1); shape(g, XY.ellipse(x + 20, y - 46, 12, 15, 14, 0.3), '#E8D8A8', 'color', 1.2); }
    if (kind === 'pearl') shape(g, XY.ellipse(x, y - 30, 7, 7, 12), C.foam, 'color', 1.2);
    if (kind === 'ruyi') { g.strokeStyle = INK; g.lineWidth = 3; g.beginPath(); g.moveTo(x - 10, y - 18); g.quadraticCurveTo(x + 6, y - 30, x + 16, y - 46); g.stroke(); shape(g, XY.ellipse(x + 18, y - 50, 7, 5, 10), C.gold, 'color', 1.2); }
  }
  // the foam fingers on the lip: always flexing; from beat 2.6 they lengthen and close down onto the statues
  function claws(g, t, close) {
    const n = LIP.length / 2, seg = []; let tot = 0; for (let i = 0; i < n - 1; i++) { const d = Math.hypot(LIP[2 * i + 2] - LIP[2 * i], LIP[2 * i + 3] - LIP[2 * i + 1]); seg.push(d); tot += d; }
    const at = s => { let d = s * tot; for (let i = 0; i < seg.length; i++) { if (d <= seg[i]) { const f = d / seg[i]; return [XY.lerp(LIP[2 * i], LIP[2 * i + 2], f), XY.lerp(LIP[2 * i + 1], LIP[2 * i + 3], f), (LIP[2 * i + 2] - LIP[2 * i]) / seg[i], (LIP[2 * i + 3] - LIP[2 * i + 1]) / seg[i]]; } d -= seg[i]; } return [LIP[2 * n - 2], LIP[2 * n - 1], -0.4, 0.9]; };
    // the foam mass along the lip: a thick white band, scalloped where it meets the blue
    { const band = []; for (let k = 0; k <= 30; k++) { const [x, y] = at(k / 30); band.push(x, y); } XY.path(g, XY.RIG.ribbon(band, 26, 14), true); g.fillStyle = C.foam; g.fill(); g.strokeStyle = INK; g.lineWidth = 1.6; g.stroke();
      g.fillStyle = '#5E82B4'; for (let k = 1; k < 30; k += 2) { const [x, y, dx, dy] = at(k / 30); g.beginPath(); g.arc(x + dy * 9, y - dx * 9, 6, 0, TAU); g.fill(); } }
    for (let i = 0; i < 13; i++) { const s = 0.04 + i * 0.077, [bx, by, dx, dy] = at(s), a0 = Math.atan2(dx, -dy) - 0.75 + 0.15 * Math.sin(t * 4 + i * 1.7);
      const L = (24 + 16 * XY.hash(i, 3)) * (1 + 1.5 * s) * (1 + 1.5 * close * s), curl = -(1.5 + 1.3 * close) * (s > 0.5 ? 1 : 0.8), pts = [];
      for (let k = 0; k <= 10; k++) { const q = k / 10, a = a0 + curl * q * q; const p = pts.length ? [pts[pts.length - 2], pts[pts.length - 1]] : [bx, by]; pts.push(p[0] + Math.cos(a) * L / 10, p[1] + Math.sin(a) * L / 10); }
      const rib = XY.RIG.ribbon([bx, by, ...pts], 14 * (1 + 0.3 * close), 2.4); XY.path(g, rib, true); g.fillStyle = C.foam; g.fill(); g.strokeStyle = INK; g.lineWidth = 1.4; g.stroke();
      const tx = pts[pts.length - 2], ty = pts[pts.length - 1], ta = a0 + curl; g.strokeStyle = INK; g.lineWidth = 1.2;
      [-0.6, 0.6].forEach(o => { g.beginPath(); g.moveTo(tx, ty); g.lineTo(tx + Math.cos(ta + o) * 8, ty + Math.sin(ta + o) * 8); g.stroke(); }); }
  }

  // 求雨 (原著第四十五回): 悟空 calls the 四海龙王 and the rain comes down in Hiroshige's straight slanting lines
  function rain(g, t, beat, W, H) {
    const r = XY.smooth((beat - 1.5) / 1.6) * (1 - 0.75 * XY.smooth((beat - 6.0) / 1.6)); if (r <= 0) return;
    g.save(); g.strokeStyle = 'rgba(40,50,80,0.55)'; g.lineWidth = 1.1; g.beginPath();
    for (let k = 0; k < Math.floor(170 * r); k++) { const L = 50 + 50 * XY.hash(k, 2), x = XY.hash(k, 1) * (W + 300) - 150 + ((t * 260) % 300) * 0.32, y = ((XY.hash(k, 3) * 900 + t * 820) % 900) - 120;
      g.moveTo(x, y); g.lineTo(x - L * 0.32, y + L); }
    g.stroke(); g.fillStyle = `rgba(30,40,70,${0.12 * r})`; g.fillRect(0, 0, W, 300); g.restore();
  }
  // the crest of the wave is a 龙王 come for the rain: horned head, white mane of foam, eye opening on 2.6, jaws on 3.9
  function dragonHead(g, t, beat, close) {
    const eye = XY.smooth((beat - 2.6) / 0.3), jaw = 0.25 + 0.5 * close, x = 640, y = 252, a = 2.3 + 0.05 * Math.sin(t * 3) + 0.25 * close;
    g.save(); g.translate(x, y); g.rotate(a); g.scale(1.25, 1.25);
    shape(g, [0, -18, 40, -30, 74, -22, 96, -10, 92, 0, 60, 2, 20, 6], '#4E72AC', 'color', 1.8);               // upper jaw
    g.save(); g.rotate(jaw); shape(g, [6, 6, 40, 6, 80, 12, 86, 20, 50, 22, 10, 18], '#3A5A90', 'color', 1.6); g.fillStyle = '#C8442E'; g.beginPath(); g.moveTo(14, 8); g.lineTo(76, 12); g.lineTo(50, 18); g.fill(); g.restore();
    for (let k = 0; k < 5; k++) { const tx = 22 + k * 14; shape(g, [tx, 0, tx + 5, 9, tx + 10, 0], C.foam, 'color', 0.8); }
    shape(g, [6, -20, -10, -52, -20, -60, -4, -50, 16, -24], '#E8D8A8', 'color', 1.4); shape(g, [20, -24, 12, -58, 6, -66, 22, -54, 30, -26], '#E8D8A8', 'color', 1.4);   // horns
    shape(g, XY.ellipse(34, -18, 12, 9, 14), C.foam, 'color', 1.4);
    g.fillStyle = eye > 0 ? `rgba(216,168,56,${eye})` : INK; g.beginPath(); g.ellipse(36, -18, 6, 6 * Math.max(0.15, eye), 0, 0, TAU); g.fill(); g.fillStyle = INK; g.beginPath(); g.arc(38, -18, 2.4 * eye, 0, TAU); g.fill();
    g.strokeStyle = INK; g.lineWidth = 1.6; for (let k = 0; k < 2; k++) { g.beginPath(); for (let q = 0; q < 12; q++) g.lineTo(92 + q * 6, -6 + k * 10 + 7 * Math.sin(q * 0.8 + t * 4 + k)); g.stroke(); }   // whiskers
    g.restore();
  }

  XY.STYLES.ukiyoe = {
    hits: [4.4],
    draw(g, e) {
      const { W, H, t, u, beat } = e, S = e.S;
      // the baren pass: the key block is already on the paper; colour is rubbed in from left to right
      const sx = XY.lerp(-80, W + 80, XY.clamp((u + 0.4) / 0.55));
      if (sx < W + 60) g.drawImage(printLayer(W, H, S, 'key'), 0, 0, W, H);
      if (sx > -60) { g.save(); g.beginPath(); g.moveTo(0, 0); for (let y = 0; y <= H; y += 30) g.lineTo(sx + 26 * XY.noise1(y / 60, 5), y); g.lineTo(0, H); g.closePath(); g.clip(); g.drawImage(printLayer(W, H, S, 'color'), 0, 0, W, H); g.restore(); }
      // little crests riding across the sea
      for (let k = 0; k < 6; k++) { const x = ((k * 230 - t * 50) % (W + 200) + W + 200) % (W + 200) - 100, y = 548 + (k % 3) * 40;
        if (x > 540 && y < 640) continue; g.fillStyle = C.foam; g.strokeStyle = INK; g.lineWidth = 1.2;
        g.beginPath(); g.moveTo(x - 30, y + 8); g.quadraticCurveTo(x - 6, y - 16, x + 14, y - 4); g.quadraticCurveTo(x + 4, y - 6, x + 2, y + 2); g.quadraticCurveTo(x - 8, y + 2, x - 30, y + 8); g.fill(); g.stroke(); }
      const HIT = 4.4, close = beat < 3.9 ? 0 : XY.smooth((beat - 3.9) / 0.5) * (1 - 0.6 * XY.smooth((beat - 5.4) / 1));
      rain(g, t, beat, W, H);
      // the three statues, until the wave takes them
      if (beat < HIT) STAT.forEach(([x, k]) => statue(g, x, RY, k));
      else { const s = (beat - HIT) * 0.5;
        STAT.forEach(([x], i) => { for (let j = 0; j < 16; j++) { const h = q => XY.hash(i * 16 + j, q), px = x + (h(1) - 0.5) * 56, py = RY - h(2) * 92;
          const X = px + ((px - x) * 4 + (h(3) - 0.5) * 240 - 160) * s, Y = py + (-180 - 220 * h(4)) * s + 300 * s * s; if (Y > 700) continue;
          g.save(); g.translate(X, Y); g.rotate((h(5) - 0.5) * 14 * s); shape(g, [-8 * h(6) - 4, -5, 9 * h(7) + 3, -3, 1, 7 + 6 * h(8)], ['#D8A838', '#F2D890', '#F2D8B8', '#D8A838'][j % 4], 'color', 1.2); g.restore(); } });
        const f = XY.clamp((beat - HIT) / 0.7); if (f < 1) { g.fillStyle = `rgba(246,242,230,${0.95 * (1 - f)})`; for (let k = 0; k < 9; k++) { const a = k / 9 * Math.PI + Math.PI, r = 30 + 90 * f; g.beginPath(); g.arc(708 + Math.cos(a) * r, 450 + Math.sin(a) * r * 0.6, 16 + 20 * f, 0, TAU); g.fill(); } } }
      claws(g, t, close);
      dragonHead(g, t, beat, close);
      // spray flung off the crest, a burst on the strike
      g.fillStyle = C.foam; g.strokeStyle = INK; g.lineWidth = 0.8;
      for (let k = 0; k < 40; k++) { const s = (t * 0.6 + XY.hash(k, 1)) % 1, b = beat >= HIT && beat < HIT + 1 ? 1 + (1 - (beat - HIT)) * 2 : 1, x = 640 + 300 * XY.hash(k, 2) - 200 * s * b, y = 130 + 160 * XY.hash(k, 3) - 60 * s + 260 * s * s;
        g.beginPath(); g.arc(x, y, 2 + 3 * XY.hash(k, 4), 0, TAU); g.fill(); g.stroke(); }
      const acts = { wukong: { shade: K.win(beat, 1.8, 2.4) * (1 - K.win(beat, 3.4, 3.8)), raise: K.win(beat, 3.6, 4.0) * (1 - K.win(beat, 4.2, 4.4)), strike: K.win(beat, 4.2, 4.4) * (1 - K.win(beat, 6.2, 6.8)) }, monk: { palm: K.win(beat, 4.8, 5.4) },
        bajie: { scratch: K.win(beat, 2.4, 2.8) * (1 - K.win(beat, 3.6, 4)) }, shaseng: { lift: K.win(beat, 4.6, 5.0) * (1 - K.win(beat, 6.6, 7.2)) } };
      XY.drawProcession(g, e.phase, e.procX, e.groundY, PEN, acts);
      K.zoom(g, e, 708, RY - 60, 1 + 0.15 * K.env(beat, 4.1, 4.5, 5.8, 6.5));
    },
  };
})();
