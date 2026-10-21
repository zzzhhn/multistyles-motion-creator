// 42 表现主义 · 1893 年 · 吃水遭毒 — 第五十三回：西梁女国境内，唐僧口渴，八戒舀了子母河的水，师徒二人喝下，上岸就腹痛，
// 肚里血团肉块乱动，原来这河水喝了就怀胎。学蒙克的表现主义（血色天空色带在流、长弯线、整幅扭动），画的是子母河渡口：
// 梢婆撑船、钵盂舀水、4.5 拍唐僧和八戒的肚子鼓起来，长弯线从肚子荡开，天上的色带弯向他们；最后对岸西梁女国的妇人指着笑。
(() => {
  'use strict';
  const XY = window.XY, K = XY.KIT_E, TAU = XY.TAU;
  const SWELL = 4.5, KICK = 5.6, DRINK = 1.6, LAUGH = 6.0, DECK = 640;
  const BANDS = ['#e2541c', '#f08a24', '#f4c03a', '#c8301e', '#e8743a', '#f6a63a', '#b82a1e'];
  const COL = { fur: '#8A5A2A', face: '#C8C878', wkshirt: '#B8402A', tiger: '#D89A2A', stripe: '#1A1A2A', gold: '#E8B830', staff: '#A8301E', ink: '#1A1A2A', horse: '#E2DCC0', horse2: '#A8A890',
    mane: '#D8D0B0', hoof: '#2A2030', saddle: '#6A2A1E', red: '#B8301E', robe: '#D8B040', kasaya: '#A8281E', skin: '#D2C88A', metal: '#C8A03A', bjrobe: '#1E2440', bjpants: '#181C34',
    pig: '#D8A090', pig2: '#B87A70', wood: '#6A4A2A', ssrobe: '#2A4A5A', ssrobe2: '#1E3A48', skin2: '#A8885A', ssh: '#A8402A', ssbeard: '#8A3222', skull: '#E2DCC6', bundle: '#C89A3A' };
  const PEN = { color: r => COL[r], outline: '#1A1A2A', ow: 1.6, wob: 1.1, seed: 42, shade: 'rgba(40,20,60,0.28)' };
  const hz = x => 300 + 70 * XY.smooth(x / 760) + 14 * Math.sin(x / 90);
  const RIVER = [1190, 378, 1000, 384, 800, 394, 600, 410, 420, 440, 290, 482, 210, 530, 250, 566, 420, 552, 620, 548, 820, 574, 1000, 590, 1190, 604];
  // the sky as a tall strip of flowing colour bands, scrolled column by column each frame
  const skyStrip = (S, W) => XY.keep(`c42sky:${W}:${S.toFixed(3)}`, W * S, 480 * S, cv => { const g = cv.getContext('2d'), R = XY.rng(4201); g.scale(S, S); g.lineCap = 'round';
    for (let y = -30, k = 0; y < 520; y += 26, k++) { g.fillStyle = BANDS[k % BANDS.length]; g.beginPath(); g.moveTo(0, y + 40);
      for (let x = 0; x <= W; x += 20) g.lineTo(x, y + 14 * Math.sin(x / 110 + k) + 8 * Math.sin(x / 37 + k * 2)); g.lineTo(W, y + 60); g.lineTo(0, y + 60); g.fill(); }
    for (let i = 0; i < 520; i++) { const x = R() * W, y = R() * 480, pts = []; for (let j = 0; j < 9; j++) pts.push(x + j * 16, y + 10 * Math.sin((x + j * 16) / 110 + y / 26));
      g.globalAlpha = 0.25 + 0.3 * R(); g.strokeStyle = BANDS[Math.floor(R() * BANDS.length)]; g.lineWidth = 4 + 6 * R(); XY.path(g, pts, false); g.stroke(); } });
  // long curved strokes along a direction field, clipped to a region (bg)
  const streams = (g, n, seed, region, dir, pal, steps = 22, step = 7, w = 8) => { const R = XY.rng(seed); g.save(); XY.path(g, region, true); g.clip(); g.lineCap = 'round'; g.lineJoin = 'round';
    let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9; for (let k = 0; k < region.length; k += 2) { x0 = Math.min(x0, region[k]); x1 = Math.max(x1, region[k]); y0 = Math.min(y0, region[k + 1]); y1 = Math.max(y1, region[k + 1]); }
    for (let i = 0; i < n; i++) { const pts = K.stream(x0 + R() * (x1 - x0), y0 + R() * (y1 - y0), steps + Math.floor(R() * 8), step, dir);
      g.globalAlpha = 0.45 + 0.4 * R(); g.strokeStyle = pal[Math.floor(R() * pal.length)]; g.lineWidth = w * (0.6 + 0.6 * R()); XY.path(g, pts, false); g.stroke(); } g.restore(); };
  // the river's direction field: along its bend, swirling into the eddy at (330, 510)
  const riverDir = (x, y) => { const dx = x - 330, dy = y - 512, d = Math.hypot(dx, dy), sw = Math.exp(-Math.pow(d / 120, 2));
    return (1 - sw) * (Math.PI + 0.12 * Math.sin(x / 120) + (x < 500 ? 0.4 : 0.05)) + sw * (Math.atan2(dy, dx) + Math.PI / 2); };
  const tx = (key, S, txt, px, col) => K.textCv(key, S, txt, XY.font(px, '"HanziPen SC", "Kaiti SC", serif'), col, { stroke: 'rgba(30,10,20,0.35)', sw: 3 });
  const pain = e => K.ramp(e.beat, SWELL - 0.2, SWELL + 0.2) * (1 - 0.6 * K.ramp(e.u, 1.05, 1.4)), stir = e => K.ramp(e.beat, 2.8, 3.4) * (1 - K.ramp(e.beat, SWELL - 0.2, SWELL));

  XY.STYLES.expressionism = {
    hits: [SWELL, KICK],
    bg(g, W, H) {
      g.fillStyle = '#8A6A44'; g.fillRect(0, 0, W, H);
      const R = XY.rng(4202); for (let i = 0; i < 900; i++) { g.fillStyle = R() < 0.5 ? 'rgba(60,40,20,0.12)' : 'rgba(200,170,120,0.10)'; g.fillRect(R() * W, R() * H, 2 + R() * 30, 1 + R() * 2); }
      // far shore and the walls of 西梁女国
      const far = [0, hz(0)]; for (let x = 0; x <= W + 10; x += 20) far.push(x, hz(x)); far.push(W + 10, 470, 0, 470);
      XY.path(g, far, true); g.fillStyle = '#3A2A4A'; g.fill(); streams(g, 120, 4203, far, () => 0.03, ['#4A3A5A', '#2A1E36', '#5A3A4A', '#3E3050'], 14, 8, 7);
      g.fillStyle = '#2A1E36'; [[840, 40, 34], [900, 70, 22], [960, 44, 40], [1040, 80, 26], [1110, 50, 46]].forEach(([x, w, h]) => { const y = hz(x) + 4; g.fillRect(x, y - h, w, h);
        g.beginPath(); g.moveTo(x - 6, y - h); g.lineTo(x + w / 2, y - h - 14); g.lineTo(x + w + 6, y - h); g.fill(); });
      g.fillStyle = 'rgba(244,192,58,0.85)'; [[858, 358], [918, 372], [978, 352], [1060, 372], [1130, 350], [1146, 362]].forEach(([x, y]) => g.fillRect(x, y, 5, 7));
      g.fillStyle = '#2A1E36'; g.fillRect(820, hz(820) - 4, 360, 8);
      // the left shore, the river 子母河 with its eddy, the near bank
      const left = []; for (let x = 0; x <= 300; x += 15) left.push(x, hz(x) - 26 * Math.sin(Math.PI * x / 300) - 4); left.push(318, 420, 290, 482, 210, 530, 250, 566, 160, DECK, 0, DECK);
      XY.path(g, left, true); g.fillStyle = '#2A4A3A'; g.fill(); streams(g, 90, 4204, left, (x, y) => -1.2 + 0.6 * Math.sin(y / 60 + x / 80), ['#3A5A3A', '#1E3A2E', '#4A6A3A', '#2A3A4A', '#5A5A3A'], 20, 7, 8);
      XY.path(g, RIVER, true); g.fillStyle = '#1E2A5A'; g.fill(); streams(g, 220, 4205, RIVER, riverDir, ['#2E3E7A', '#3E5A8A', '#14204A', '#4A6A9A', '#22306A'], 26, 7, 7);
      const near = [250, 566, 420, 552, 620, 548, 820, 574, 1000, 590, 1190, 604, 1190, DECK + 4, 0, DECK + 4, 0, DECK - 40, 160, DECK];
      XY.path(g, near, true); g.fillStyle = '#3A4232'; g.fill(); streams(g, 120, 4206, near, (x, y) => 0.06 * Math.sin(x / 70), ['#4A5A3A', '#2A3A2A', '#5A4A2E', '#3A3A3A'], 20, 8, 8);
      // the ferry landing: a muddy bank for the path, mooring posts and reeds at the water's edge (all behind the path)
      const bank = [0, DECK, W, DECK - 6, W, H, 0, H]; XY.path(g, bank, true); g.fillStyle = '#6A5A3A'; g.fill();
      streams(g, 200, 4207, bank, (x, y) => 0.08 * Math.sin(x / 90 + y / 30), ['#7A6A42', '#5A4A2E', '#8A7A4A', '#4A3E2A', '#9A8050'], 24, 8, 8);
      g.lineCap = 'round'; [[470, 552], [506, 556], [880, 572], [930, 578]].forEach(([x, y], k) => { g.strokeStyle = '#2A1A14'; g.lineWidth = 9; g.beginPath(); g.moveTo(x, y + 64); g.lineTo(x + 3 * Math.sin(k), y); g.stroke();
        g.strokeStyle = '#C86A2A'; g.lineWidth = 2.4; g.beginPath(); g.moveTo(x - 2, y + 60); g.lineTo(x - 1, y + 4); g.stroke(); });
      g.strokeStyle = '#3A2A1E'; g.lineWidth = 2; g.beginPath(); g.moveTo(506, 570); g.quadraticCurveTo(560, 600, 610, 560); g.stroke();
      for (let k = 0; k < 40; k++) { const x = (k < 20 ? 20 + k * 11 : 700 + (k - 20) * 12) + 6 * XY.hash(k, 1), h = 50 + 50 * XY.hash(k, 2), y = 640 - 6 * XY.hash(k, 3);
        g.strokeStyle = ['#3A4A2A', '#5A5A2E', '#2A3A22'][k % 3]; g.lineWidth = 3; g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + 6, y - h * 0.6, x + 12 * XY.hash(k, 4) - 4, y - h); g.stroke(); }
    },
    draw(g, e) {
      const { W, t, u, beat, S } = e, pn = pain(e), sw = pn * (1 + 0.3 * K.hit(beat, KICK, 4) + 0.05 * Math.sin(t * 9)) + 0.2 * stir(e) * (0.6 + 0.4 * Math.sin(t * 15)), kick = K.hit(beat, KICK, 3);
      const acts = { monk: { palm: K.ramp(beat, SWELL - 0.1, SWELL + 0.3) }, bajie: { scratch: K.ramp(beat, SWELL - 0.1, SWELL + 0.2) }, wukong: { shade: K.ramp(beat, LAUGH, LAUGH + 0.4) * (1 - K.ramp(beat, 7.4, 7.9)) } };
      const mc = K.at(e, 'monk.chest', acts), bb = K.at(e, 'bajie.belly', acts);
      // ---- the blood-red sky flows, and bends down toward the two bellies
      { const st = skyStrip(S, W), cw = 3; g.save(); g.beginPath(); g.moveTo(0, 0); g.lineTo(W, 0); for (let x = W; x >= 0; x -= 20) g.lineTo(x, hz(x) + 2); g.closePath(); g.clip();
        for (let x = 0; x < W; x += cw) { const bend = 24 * pn * (Math.exp(-Math.pow((x - mc[0]) / 190, 2)) + Math.exp(-Math.pow((x - bb[0]) / 190, 2)));
          const off = XY.clamp(40 + 18 * Math.sin(x * 0.012 - 2.2 * t) + 6 * Math.sin(x * 0.04 + t) - bend, 0, 80); g.drawImage(st, x * S, off * S, cw * S + 1, 400 * S, x, 0, cw + 0.3, 400); }
        g.restore(); }
      const T1 = tx('c42t', S, '子母河', 70, '#1E1420'), T2 = tx('c42n', S, '第四十二难', 28, '#2A1A24');
      g.drawImage(T1.cv, 820, 34, T1.w, T1.h); g.drawImage(T2.cv, 834, 120, T2.w, T2.h);
      // ---- the river runs, the old ferrywoman poles her boat, two figures walk off on the bridge
      g.lineCap = 'round'; g.setLineDash([22, 30]); g.lineDashOffset = -t * 46;
      for (let k = -2; k <= 2; k++) { g.strokeStyle = k % 2 ? 'rgba(120,150,200,0.45)' : 'rgba(230,140,80,0.3)'; g.lineWidth = 4; g.beginPath();
        [1190, 492, 1000, 488, 800, 486, 600, 482, 430, 498, 320, 520].forEach((v, j, a) => { if (j % 2) return; const y = a[j + 1] + k * 16 * (a[j] > 500 ? 1 : 0.5); j ? g.lineTo(v, y) : g.moveTo(v, y); }); g.stroke(); }
      g.setLineDash([]);
      // the old ferrywoman who rowed them over pulls back out; at the end she rocks with laughter
      const lg = K.ramp(beat, LAUGH, LAUGH + 0.3);
      { const x = XY.lerp(380, 700, XY.smooth((beat - 0.4) / 3)), y = 512 + 3 * Math.sin(t * 1.8), r = 0.06 * Math.sin(t * 1.8) + 0.08 * lg * Math.sin(t * 11); g.save(); g.translate(x, y); g.rotate(r);
        g.fillStyle = '#1A1420'; g.beginPath(); g.moveTo(-56, -4); g.quadraticCurveTo(0, 16, 58, -6); g.lineTo(48, 4); g.quadraticCurveTo(0, 20, -46, 4); g.fill();
        const hb = 3 * lg * Math.abs(Math.sin(t * 13)); g.beginPath(); g.moveTo(-6, -4); g.quadraticCurveTo(-14, -30 - hb, 0, -42 - hb); g.quadraticCurveTo(12, -34 - hb, 8, -4); g.fill(); g.beginPath(); g.arc(4, -47 - hb, 6.5, 0, TAU); g.fill();
        g.beginPath(); g.arc(8, -54 - hb, 4, 0, TAU); g.fill(); g.strokeStyle = '#1A1420'; g.lineWidth = 3; g.beginPath(); g.moveTo(-4, -30 - hb); g.lineTo(-38, 32); g.stroke(); g.restore(); }
      // women of 西梁女国 come to the far bank, point at the two bellies and laugh
      for (let k = 0; k < 4; k++) { const arr = XY.easeOut(K.ramp(beat, LAUGH - 0.6 + k * 0.12, LAUGH + k * 0.12)); if (arr <= 0) continue; const x = 870 + k * 46, y = hz(x) + 14 - 2 + 3 * lg * Math.abs(Math.sin(t * 12 + k)), dx = 30 * (1 - arr);
        g.globalAlpha = arr; g.fillStyle = '#14101C'; g.beginPath(); g.moveTo(x + dx - 12, y); g.quadraticCurveTo(x + dx - 6, y - 34, x + dx, y - 40); g.quadraticCurveTo(x + dx + 6, y - 34, x + dx + 12, y); g.fill();
        g.beginPath(); g.arc(x + dx, y - 46, 6, 0, TAU); g.fill(); g.beginPath(); g.arc(x + dx + 2, y - 54, 4.5, 0, TAU); g.fill();
        g.strokeStyle = '#14101C'; g.lineWidth = 2.6; g.beginPath(); g.moveTo(x + dx - 3, y - 32); g.lineTo(x + dx - 24, y - 40 - 4 * Math.sin(t * 9 + k)); g.stroke(); g.globalAlpha = 1; }
      // ---- the procession; the master's and 八戒's bellies swell (drawn inside the rig's layering), long pain curves ring out
      const belly = (c, rx, ry, fill, deco) => (ctx) => { ctx.save(); XY.path(ctx, XY.wobble(XY.ellipse(c[0], c[1], rx, ry, 26), 1.2, 42), true); ctx.fillStyle = fill; ctx.fill(); ctx.strokeStyle = '#1A1A2A'; ctx.lineWidth = 1.8; ctx.stroke(); deco(ctx); ctx.restore(); };
      const inject = { monk: [{ at: -4, fn: (ctx, F) => { const c = XY.RIG.mix(F.anchors.chest, F.anchors.saddle, 0.5); c[0] += 9 + 6 * sw; c[1] += 2;
          if (sw < 0.02) return; belly(c, 9 + 17 * sw, 8 + 14 * sw, '#D8B040', q => { q.strokeStyle = '#A8281E'; q.lineWidth = 4; q.beginPath(); q.moveTo(c[0] - 10 * sw, c[1] - 14 * sw); q.quadraticCurveTo(c[0] + 4 * sw, c[1], c[0] + 2 * sw, c[1] + 15 * sw); q.stroke(); q.fillStyle = '#6A3A30'; q.beginPath(); q.arc(c[0] + 12 * sw, c[1] + 2, 1.6, 0, TAU); q.fill(); })(ctx); } }],
        bajie: [{ at: -3, fn: (ctx, F) => { const c = [F.anchors.belly[0] + 4 + 8 * sw, F.anchors.belly[1] + 2]; if (sw < 0.02) return;
          belly(c, 25 + 17 * sw, 28 + 15 * sw, '#D8A090', q => { q.fillStyle = '#6A3A30'; q.beginPath(); q.arc(c[0] + 10 + 8 * sw, c[1] + 6, 2.2, 0, TAU); q.fill(); q.strokeStyle = 'rgba(255,240,220,0.6)'; q.lineWidth = 2; q.beginPath(); q.arc(c[0] - 6, c[1] - 6, 20 + 10 * sw, 3.6, 4.6); q.stroke(); })(ctx); } }] };
      if (pn > 0.02) [mc, bb].forEach((c, i) => { for (let k = 0; k < 5; k++) { const f = ((t * 0.55 + k / 5 + i * 0.1) % 1), r = 30 + 150 * f; g.strokeStyle = k % 2 ? `rgba(26,20,40,${0.7 * (1 - f) * pn})` : `rgba(200,48,30,${0.8 * (1 - f) * pn})`; g.lineWidth = 4 - 2 * f;
        g.beginPath(); for (let j = 0; j <= 40; j++) { const a = j / 40 * TAU, rr = r * (1 + 0.12 * Math.sin(a * 3 + t * 4 + k) + 0.25 * kick * Math.sin(a * 2 - t * 6)); const x = c[0] + 10 + Math.cos(a) * rr * 1.25, y = c[1] + Math.sin(a) * rr * 0.75; j ? g.lineTo(x, y) : g.moveTo(x, y); } g.lineWidth = 6 - 4 * f; g.stroke(); } });
      // the alms bowl of river water: the master drinks first, then 八戒 drains it (the stream arcs from the bowl to the mouth)
      const bowl = (who, tilt) => (ctx, F) => { const m = F.anchors.head, mo = who === 'monk' ? [m[0] + 13, m[1] + 9] : [m[0] + 32, m[1] + 8], up = XY.smooth(tilt * 2);
        const c = [XY.lerp(mo[0] + 18, mo[0] + 8, up), XY.lerp(mo[1] + 46, mo[1] + 4, up)]; ctx.save(); ctx.translate(c[0], c[1]); ctx.rotate(-1.1 * tilt);
        ctx.beginPath(); ctx.moveTo(-17, -3); ctx.quadraticCurveTo(0, 20, 17, -3); ctx.closePath(); ctx.fillStyle = '#C89A3A'; ctx.fill(); ctx.strokeStyle = '#1A1A2A'; ctx.lineWidth = 2; ctx.stroke();
        ctx.fillStyle = '#4A6A9A'; ctx.fillRect(-14, -4, 28, 3); ctx.restore();
        if (tilt > 0.4) { ctx.strokeStyle = 'rgba(140,180,240,0.95)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(c[0] - 14, c[1] - 8); ctx.quadraticCurveTo(c[0] - 14, mo[1] - 6, mo[0], mo[1]); ctx.stroke(); } };
      if (beat > 1.0 && beat < 2.7) inject.monk.push({ at: 'end', fn: bowl('monk', K.bump(beat, 2.0, 0.6)) });
      else if (beat >= 2.7 && beat < 3.9) inject.bajie = (inject.bajie || []).concat([{ at: 'end', fn: bowl('bajie', K.bump(beat, 3.25, 0.6)) }]);
      const L = K.procLayer('c42', e, 330, 40); K.drawProc(L.g, e, PEN, acts, { inject });
      K.pat(L, K.strokeTile('c42st', S, 140, 140, ['rgba(232,116,58,0.32)', 'rgba(30,30,70,0.3)', 'rgba(244,192,58,0.22)'], { len: 26, w: 3.4, seed: 42, ang: (x, y, R) => 0.4 * Math.sin(y / 20) + (R() - 0.5) * 0.4 }), 'source-atop');
      K.put(g, L);
    },
    // the whole world wobbles row by row; harder while the bellies ache
    post(cv, g, e) {
      const S = e.S, Wd = cv.width, Hd = cv.height, A = (3 + 3 * stir(e) + 8 * pain(e)) * S, m = Math.ceil(A + 2), sc = XY.scratch('c42w', Wd, Hd), bh = Math.max(2, Math.round(4 * S));
      sc.getContext('2d').drawImage(cv, 0, 0);
      for (let y = 0; y < Hd; y += bh) { const yd = y / S, dx = A * (0.7 * Math.sin(yd * 0.012 + 4.2 * e.t) + 0.3 * Math.sin(yd * 0.031 - 6 * e.t)); g.drawImage(sc, m + dx, y, Wd - 2 * m, bh, 0, y, Wd, bh); }
      K.punch(cv, g, e, e.procX - 60, e.groundY - 130, 1 + 0.1 * K.env(e.beat, SWELL + 0.1, 0.25, 1.5));
    },
  };
})();
