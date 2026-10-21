// 29 琳派金屏风 · 风摄圣僧 — a six-fold gold-leaf screen in the manner of Sōtatsu and Kōrin: a tarashikomi dead pine,
// Kōrin's dark stream (枯松涧) curling with gold, autumn grasses. 红孩儿 rides an ink cloud like a wind god with a wind
// bag; his whirlwind plucks 唐僧 off the saddle on beat 2 and spins him up into the cloud. The horse walks on, saddle empty.
(() => {
  'use strict';
  const XY = window.XY, K = XY.KIT_D, TAU = XY.TAU;
  const GY = 702, FOLDS = 6, LEAF = 60;
  // 平涂岩彩: vermilion 朱, ultramarine 群青, malachite 绿青, gofun white, sumi black; every shape ringed with a gold line (金線)
  const PEN = { outline: '#B8902E', ow: 1.3, seed: 29, shade: false,
    color: r => ({ fur: '#7A4E2A', face: '#F2E2C4', wkshirt: '#D8442A', tiger: '#E0A834', stripe: '#1E1A16', gold: '#E8C25A', staff: '#D8442A', ink: '#1A1612',
      horse: '#F6F2E8', horse2: '#E2DCCC', mane: '#ECE6D8', hoof: '#1E1A16', saddle: '#2E8A6A', red: '#D8442A', robe: '#E8C25A', kasaya: '#D8442A',
      skin: '#F4E4C8', metal: '#E8C25A', bjrobe: '#1E1C20', bjpants: '#141316', pig: '#F2CABC', pig2: '#E09A8A', wood: '#8A5E30',
      ssrobe: '#2A4A9A', ssrobe2: '#1E3878', skin2: '#C89A70', ssh: '#D8442A', ssbeard: '#B83A22', skull: '#F6F2E8', bundle: '#2E8A6A' })[r] || XY.DEFAULT_COLORS[r] };

  // たらし込み: a pool of pigment that dried darker at its rim
  const tara = (g, x, y, r, rgb, a = 1) => {
    const sd = Math.round(x * 7 + y * 13), pts = XY.wobble(XY.ellipse(x, y, r, r * 0.8, 20, XY.hash(sd, 1) * 3), r * 0.35, sd, 1.4 / r);
    const gr = g.createRadialGradient(x, y, 0, x, y, r * 1.05);
    gr.addColorStop(0, `rgba(${rgb},${0.12 * a})`); gr.addColorStop(0.6, `rgba(${rgb},${0.2 * a})`); gr.addColorStop(0.85, `rgba(${rgb},${0.42 * a})`); gr.addColorStop(1, `rgba(${rgb},${0.5 * a})`);
    XY.path(g, pts, true); g.fillStyle = gr; g.fill(); };
  const PINE = [150, 712, 140, 600, 176, 480, 160, 380, 196, 280, 250, 210];
  const BR = [[196, 300, 300, 268, 420, 236, 520, 250], [176, 470, 100, 430, 40, 440], [236, 226, 300, 150, 370, 130]];
  const STREAM = t => { const o = []; for (let k = 0; k <= 30; k++) { const s = k / 30; o.push(1100 - 360 * s + 80 * Math.sin(s * 5.2 + t), -10 + s * 690); } return o; };

  XY.STYLES.rimpa = {
    hits: [4],
    bg(g, W, H) {
      // gold leaf, square by square, each a slightly different tone, seams where the squares overlap
      for (let j = 0; j * LEAF < H; j++) for (let i = 0; i * LEAF < W; i++) {
        const v = XY.hash(i, j, 29), x = i * LEAF, y = j * LEAF;
        g.fillStyle = `rgb(${Math.round(214 + 26 * v)},${Math.round(174 + 24 * v)},${Math.round(82 + 22 * v)})`; g.fillRect(x, y, LEAF + 1, LEAF + 1);
        const gr = g.createLinearGradient(x, y, x + LEAF, y + LEAF); gr.addColorStop(0, 'rgba(255,240,190,0.18)'); gr.addColorStop(1, 'rgba(120,80,10,0.12)'); g.fillStyle = gr; g.fillRect(x, y, LEAF, LEAF);
        g.fillStyle = 'rgba(140,96,20,0.35)'; g.fillRect(x, y, LEAF, 1.6); g.fillRect(x, y, 1.6, LEAF);
      }
      K.grain(g, W, H, 291, 900, 'rgba(120,80,10,0.25)', 'rgba(255,246,210,0.45)', 2);
      // 号山: low rounded hills far off, malachite with pooled rims and gold contour
      [[300, 560, 190, 90], [560, 590, 160, 70], [880, 540, 220, 110]].forEach(([x, y, rx, ry], k) => {
        g.fillStyle = k % 2 ? '#5E8A64' : '#4E7A5A'; g.beginPath(); g.ellipse(x, y, rx, ry, 0, Math.PI, TAU); g.fill();
        const R = XY.rng(k + 5); for (let q = 0; q < 9; q++) tara(g, x + (R() - 0.5) * rx * 1.4, y - R() * ry * 0.7, 18 + R() * 30, '30,64,44', 0.7);
        g.strokeStyle = 'rgba(232,194,90,0.8)'; g.lineWidth = 2; g.beginPath(); g.ellipse(x, y, rx, ry, 0, Math.PI, TAU); g.stroke(); });
      // 枯松涧: Kōrin's stream — oxidised silver band, gold swirl lines
      const sp = XY.RIG.spline(STREAM(0), false, 3), band = XY.RIG.ribbon(sp, 46, 140);
      XY.path(g, band, true); g.fillStyle = '#2A3036'; g.fill(); g.save(); XY.path(g, band, true); g.clip();
      g.fillStyle = 'rgba(120,130,140,0.25)'; for (let k = 0; k < 14; k++) { const i = 2 * Math.floor(k / 14 * (sp.length / 2 - 1)); tara(g, sp[i] + 40 * Math.sin(k * 2.7), sp[i + 1], 60, '140,150,160', 0.6); }
      g.strokeStyle = 'rgba(232,196,96,0.85)'; g.lineWidth = 2.2;
      for (let k = 0; k < 5; k++) { const off = (k - 2) * 22; g.beginPath();
        for (let i = 0; i < sp.length; i += 2) { const s = i / sp.length, x = sp[i] + off * (0.4 + s) + 14 * Math.sin(s * 40 + k), y = sp[i + 1]; i ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke();
        for (let q = 0; q < 4; q++) { const i = 2 * Math.floor((q + 0.5 + 0.3 * (k % 2)) / 4 * (sp.length / 2 - 2)), cx = sp[i] + off * 0.9, cy = sp[i + 1];
          g.beginPath(); for (let a = 0; a < 9; a += 0.3) g.lineTo(cx + Math.cos(a) * a * 2.4, cy + Math.sin(a) * a * 1.6); g.stroke(); } }
      g.restore();
      // the dead pine: trunk built from tarashikomi pools, bare branches, the cut cord the "child" hung from
      const tr = XY.RIG.ribbon(XY.RIG.spline(PINE, false, 6), 54, 18);
      XY.path(g, tr, true); g.fillStyle = '#4A4032'; g.fill(); g.save(); XY.path(g, tr, true); g.clip();
      { const R = XY.rng(9); for (let k = 0; k < 40; k++) tara(g, 120 + R() * 140, 200 + R() * 520, 10 + R() * 22, R() < 0.5 ? '20,26,16' : '70,90,50'); } g.restore();
      BR.forEach((b, k) => { const s = XY.RIG.spline(b, false, 6), rb = XY.RIG.ribbon(s, 22 - k * 4, 5); XY.path(g, rb, true); g.fillStyle = '#3E3628'; g.fill();
        const R = XY.rng(k + 40); for (let q = 0; q < 6; q++) { const i = 2 * Math.floor(R() * (s.length / 2)); tara(g, s[i], s[i + 1], 8 + R() * 8, '18,22,14'); } });
      g.strokeStyle = '#E8D8B0'; g.lineWidth = 2; g.beginPath(); g.moveTo(470, 244); g.lineTo(472, 300); g.stroke(); g.beginPath(); g.moveTo(472, 300); g.lineTo(466, 312); g.moveTo(472, 300); g.lineTo(478, 311); g.stroke();
      // malachite earth with gold edge, where the gallery line runs
      g.fillStyle = '#3E6E52'; g.beginPath(); g.moveTo(0, 690); for (let x = 0; x <= W; x += 20) g.lineTo(x, 680 - 14 * Math.sin(x / 140) - 8 * Math.sin(x / 47)); g.lineTo(W, H); g.lineTo(0, H); g.fill();
      { const R = XY.rng(77); for (let k = 0; k < 40; k++) tara(g, R() * W, 700 + R() * 70, 16 + R() * 26, R() < 0.6 ? '24,52,36' : '90,120,70'); }
      g.strokeStyle = 'rgba(232,194,90,0.9)'; g.lineWidth = 2.4; g.beginPath(); for (let x = 0; x <= W; x += 20) g.lineTo(x, 680 - 14 * Math.sin(x / 140) - 8 * Math.sin(x / 47)); g.stroke();
      // 色紙: mica paper with pale indigo clouds, 风 in a running hand, the count, a seal
      g.save(); g.translate(56, 52); g.rotate(-0.025);
      g.fillStyle = 'rgba(0,0,0,0.18)'; g.fillRect(4, 5, 158, 176); g.fillStyle = '#EEE8DA'; g.fillRect(0, 0, 158, 176);
      g.fillStyle = 'rgba(110,130,170,0.28)'; [[110, 168, 52, 7], [134, 18, 22, 6]].forEach(([x, y, rx, ry]) => { g.beginPath(); g.ellipse(x, y, rx, ry, 0, 0, TAU); g.fill(); });
      K.grain(g, 158, 176, 33, 160, 'rgba(200,170,90,0.6)', 'rgba(255,255,255,0.8)', 2);
      g.fillStyle = '#1A1410'; g.font = XY.font(118, XY.cnFont.xing); g.textBaseline = 'alphabetic'; g.fillText('風', 40, 142);
      g.font = XY.font(23, '"Hiragino Mincho ProN", "Songti SC", serif'); K.vtext(g, '第二十九难', 14, 36, 26);
      K.seal(g, 134, 152, 26, '琳', '#B8231A', true); g.restore();
    },
    draw(g, e) {
      const { W, H, t, u, beat } = e, c = e.cell;
      // candle glint travelling across the leaf as the screen comes into view
      const gx = XY.lerp(-300, W + 300, XY.clamp((u + 0.5) / 0.7));
      g.save(); g.globalCompositeOperation = 'screen'; const sg = g.createLinearGradient(gx - 160, 0, gx + 160, 0);
      sg.addColorStop(0, 'rgba(255,230,160,0)'); sg.addColorStop(0.5, 'rgba(255,236,170,0.32)'); sg.addColorStop(1, 'rgba(255,230,160,0)'); g.fillStyle = sg; g.fillRect(0, 0, W, 690); g.restore();
      // the whirlwind's path: it comes in from the right, meets the saddle on beat 2, then carries the monk up and away
      const SN = 4, seat = [K.procAt(e, SN / 8) + 30, GY - 128], sn = XY.clamp((beat - SN) / 2.2), off = Math.max(0, beat - 6.2) / 1.4;
      const rx = seat[0] + 290 * XY.easeIO(sn) + 26 * Math.sin(sn * 9) * sn + 520 * off, ry = seat[1] - 400 * XY.smooth(sn) - 160 * off;
      const fx = beat < SN ? XY.lerp(W + 160, seat[0], XY.smooth((beat + 3) / (SN + 3))) : rx, grow = 0.45 + 0.55 * XY.smooth((beat - 0.5) / 3);
      const cloud = [(beat < SN ? fx : rx) + 40 + 10 * Math.sin(t * 2), Math.min(190 + 12 * Math.sin(t * 1.3), ry - 70)];
      const bot = beat < SN ? [fx, XY.lerp(cloud[1] + 120, GY - 8, grow)] : [rx - 10 * sn, XY.lerp(GY - 8, ry + 60, XY.smooth(sn * 1.4))];
      funnel(g, t, bot, cloud, false);
      const acts = { wukong: { shade: K.win(beat, 1.8, 2.4) * (1 - K.win(beat, 3.6, 4)), raise: K.win(beat, 4, 4.4) * (1 - K.win(beat, 4.9, 5.2)), strike: K.win(beat, 4.9, 5.2) * (1 - K.win(beat, 6.6, 7.2)) },
        monk: { palm: K.win(beat, 3, 3.6) }, shaseng: { lift: K.win(beat, 3.2, 3.8) * (1 - K.win(beat, 6.8, 7.6)) }, bajie: { scratch: K.win(beat, 6.6, 7.2) } };
      if (beat >= SN) acts.cast = { rider: false };   // snatched: the horse walks on, saddled and empty
      K.put(g, K.lit(e, PEN, acts, { bands: [[-3, -3, 'rgba(60,40,10,0.32)', 1.5], [2, 2, 'rgba(255,250,236,0.18)']] }));
      if (beat >= SN) {   // 唐僧 himself, spinning up the column of wind
        const sb = K.sub(e, e.phase, acts, 2, 'rider', 'saddle');
        K.paintSub(g, sb, PEN, rx, ry, -sn * TAU * 0.85 - off * 2, 1.05 - 0.12 * sn);
      }
      funnel(g, t, bot, cloud, true);
      redBoy(g, t, cloud[0], cloud[1], beat);
      grass(g, t, fx, beat);
      K.zoom(g, e, seat[0] + 40, seat[1] - 60, 1 + 0.12 * K.env(beat, 3.7, 4.2, 5.6, 6.4));
      // the screen itself: alternating folds, hinge lines, black lacquer frame with gilt corner fittings
      for (let k = 0; k < FOLDS; k++) { const x0 = k * W / FOLDS; g.fillStyle = k % 2 ? 'rgba(70,40,0,0.08)' : 'rgba(255,248,220,0.05)'; g.fillRect(x0, 0, W / FOLDS, H);
        if (k) { g.fillStyle = 'rgba(60,36,6,0.5)'; g.fillRect(x0 - 1, 0, 1.6, H); g.fillStyle = 'rgba(255,240,200,0.35)'; g.fillRect(x0 + 0.6, 0, 1, H); } }
      g.fillStyle = '#16110D'; g.fillRect(0, 0, W, 12); g.fillRect(0, H - 12, W, 12); g.fillRect(0, 0, 12, H); g.fillRect(W - 12, 0, 12, H);
      g.fillStyle = '#C9A23A'; for (let k = 0; k <= FOLDS; k++) { const x = Math.min(W - 26, Math.max(0, k * W / FOLDS - 13)); g.fillRect(x, 0, 26, 12); g.fillRect(x, H - 12, 26, 12); }
    },
  };

  // the whirlwind as Sōtatsu would brush it: broad ribbons of sumi cloud pouring out of the wind bag and twisting down
  // to the ground, each with a darker pooled edge, gold whorl lines (光琳) riding them, gold dust and dead needles in the eddy.
  // back = the ribbons behind the pilgrims, front = the ones that wrap in front of them
  function funnel(g, t, bot, top, front) {
    g.save(); g.lineCap = 'round'; g.lineJoin = 'round';
    for (let r = 0; r < 4; r++) { const side = r % 2 ? 1 : -1; if ((r < 2) === front) continue;
      const P = []; for (let k = 0; k <= 22; k++) { const s = k / 22, x = XY.lerp(top[0], bot[0], s) + side * XY.lerp(150, 30, Math.sqrt(s)) * Math.sin(s * 3.4 + t * 3 + r * 2.3) + (r > 1 ? side * 40 * (1 - s) : 0), y = XY.lerp(top[1] + 30, bot[1], s); P.push(x, y); }
      const rib = XY.RIG.ribbon(P, 70 - r * 10, 16);
      XY.path(g, rib, true); g.fillStyle = front ? 'rgba(52,52,58,0.62)' : 'rgba(30,30,36,0.78)'; g.fill();
      g.strokeStyle = 'rgba(10,10,14,0.55)'; g.lineWidth = 3; g.stroke();
      g.strokeStyle = 'rgba(232,196,96,0.9)'; g.lineWidth = 2; XY.path(g, P, false); g.stroke();
      for (let q = 1; q < 4; q++) { const i = 2 * Math.floor(q / 4 * 22), cx = P[i], cy = P[i + 1], sp = t * 4 * side + q;
        g.beginPath(); for (let a = 0; a < 9; a += 0.3) g.lineTo(cx + Math.cos(a + sp) * a * 1.8, cy + Math.sin(a + sp) * a * 1.1); g.stroke(); } }
    if (front) for (let i = 0; i < 46; i++) { const s = XY.hash(i, 7), a = t * (5 + 3 * XY.hash(i, 8)) + i, cx = XY.lerp(bot[0], top[0], s), cy = XY.lerp(bot[1], top[1] + 40, s), rr = XY.lerp(30, 120, s);
      const x = cx + Math.cos(a) * rr, y = cy + Math.sin(a) * rr * 0.26;
      if (i % 3) { g.fillStyle = 'rgba(250,214,110,0.95)'; g.fillRect(x - 2, y - 2, 4, 4); }
      else { g.strokeStyle = '#5A4020'; g.lineWidth = 1.6; g.beginPath(); g.moveTo(x, y); g.lineTo(x + 10 * Math.cos(a * 2), y + 10 * Math.sin(a * 2)); g.stroke(); } }
    g.restore();
  }
  // 红孩儿 riding his ink cloud like a wind god, the wind bag arched over his head, boneless flames about him
  function redBoy(g, t, x, y, beat) {
    g.save(); g.translate(x, y); g.scale(0.82, 0.82);
    const R = XY.rng(3); g.fillStyle = 'rgba(44,44,48,0.92)';
    for (let k = 0; k < 9; k++) { const a = k / 9 * TAU, r = 32 + 14 * R(); g.beginPath(); g.arc(Math.cos(a) * 62, 30 + Math.sin(a) * 22, r, 0, TAU); g.fill(); }
    for (let k = 0; k < 10; k++) tara(g, (R() - 0.5) * 140, 22 + (R() - 0.5) * 40, 14 + R() * 18, R() < 0.5 ? '10,10,12' : '140,140,150');
    g.strokeStyle = 'rgba(240,236,226,0.7)'; g.lineWidth = 3; for (let k = 0; k < 3; k++) { g.beginPath(); for (let a = 0; a < 8; a += 0.25) g.lineTo(-60 + k * 52 + Math.cos(a + t * 2) * a * 2.4, 30 + Math.sin(a + t * 2) * a * 1.4); g.stroke(); }
    // mokkotsu flames: no outline, washes of red that dry darker at their tips
    for (let k = 0; k < 7; k++) { const fx = -54 + k * 18, h = 50 + 26 * Math.sin(t * 6 + k * 1.7), w = 12;
      const gr = g.createLinearGradient(0, 0, 0, -h); gr.addColorStop(0, 'rgba(232,96,40,0.75)'); gr.addColorStop(0.7, 'rgba(200,40,20,0.7)'); gr.addColorStop(1, 'rgba(120,10,10,0.9)');
      g.fillStyle = gr; g.beginPath(); g.moveTo(fx - w, 4); g.quadraticCurveTo(fx - w, -h * 0.5, fx + 8 * Math.sin(t * 5 + k), -h); g.quadraticCurveTo(fx + w, -h * 0.5, fx + w, 4); g.fill(); }
    // the wind bag (風袋): a white cloth tube held over the head, both ends streaming
    const fl = t * 4;
    g.strokeStyle = '#F2EEE4'; g.lineWidth = 14; g.beginPath(); g.moveTo(-90, -40 + 8 * Math.sin(fl)); g.bezierCurveTo(-60, -130, 50, -140, 84, -50 + 8 * Math.sin(fl + 1)); g.stroke();
    g.strokeStyle = 'rgba(150,150,140,0.6)'; g.lineWidth = 3; g.stroke();
    g.fillStyle = '#F2EEE4'; [[-90, -40, -1], [84, -50, 1]].forEach(([ex, ey, s], k) => { g.beginPath(); g.moveTo(ex, ey); g.quadraticCurveTo(ex + s * 40, ey + 30 + 10 * Math.sin(fl + k), ex + s * 70, ey + 10 * Math.sin(fl * 1.3 + k)); g.lineTo(ex + s * 60, ey - 14); g.fill(); });
    // the boy: crouched, arms up to the bag, red war-skirt, topknots, a grin
    g.fillStyle = '#C8452A'; g.beginPath(); g.moveTo(-26, -6); g.lineTo(26, -6); g.lineTo(34, 16); g.lineTo(-34, 16); g.fill();
    g.strokeStyle = '#EED6B0'; g.lineWidth = 10; g.lineCap = 'round'; g.beginPath(); g.moveTo(-18, 10); g.lineTo(-34, 30); g.lineTo(-46, 26); g.moveTo(18, 10); g.lineTo(36, 28); g.lineTo(48, 22); g.moveTo(-12, -40); g.lineTo(-40, -70); g.lineTo(-56, -100); g.moveTo(12, -40); g.lineTo(38, -72); g.lineTo(50, -104); g.stroke();
    g.fillStyle = '#EED6B0'; g.beginPath(); g.ellipse(0, -24, 20, 24, 0, 0, TAU); g.fill();
    g.fillStyle = '#E8C25A'; g.fillRect(-20, -22, 40, 6);
    g.fillStyle = '#EED6B0'; g.beginPath(); g.arc(0, -62, 18, 0, TAU); g.fill();
    g.fillStyle = '#1A1612'; g.beginPath(); g.arc(0, -64, 18.4, Math.PI * 1.1, Math.PI * 1.9); g.quadraticCurveTo(0, -72, -17, -68); g.fill();
    g.fillStyle = '#B8231A'; [[-9, -80, -0.4], [0, -84, 0], [9, -80, 0.4]].forEach(([a, b, r]) => { g.save(); g.translate(a, b); g.rotate(r + 0.2 * Math.sin(t * 8 + a)); g.beginPath(); g.moveTo(-5, 4); g.quadraticCurveTo(-4, -8, 0, -16); g.quadraticCurveTo(4, -8, 5, 4); g.fill(); g.restore(); });
    g.fillStyle = '#1A1612';
    g.beginPath(); g.ellipse(-7, -64, 2.4, 3, 0, 0, TAU); g.ellipse(7, -64, 2.4, 3, 0, 0, TAU); g.fill();
    g.fillStyle = '#B8231A'; g.beginPath(); g.moveTo(-8, -54); g.quadraticCurveTo(0, beat >= 4 ? -46 : -50, 8, -54); g.fill();
    g.restore();
  }
  // autumn grasses in the foreground, bowed toward the whirlwind
  function grass(g, t, fx, beat) {
    const R = XY.rng(12), pull = (0.3 + 0.7 * XY.smooth((beat - 1) / 2.5)) * (beat < 4 ? 1 : Math.max(0.2, 1 - (beat - 4) * 0.3));
    for (let k = 0; k < 44; k++) { const x = 20 + k * 27 + R() * 14, h = 40 + R() * 46, d = x - fx, w = Math.exp(-Math.pow(d / 260, 2)) * pull;
      const bend = -Math.sign(d) * 0.9 * w + 0.12 * Math.sin(t * 2.2 + x * 0.03) + 0.1, tipx = x + Math.sin(bend) * h, tipy = 752 - Math.cos(bend) * h;
      g.strokeStyle = k % 4 ? '#3E6A40' : '#B89A4A'; g.lineWidth = 3; g.beginPath(); g.moveTo(x, 760); g.quadraticCurveTo(x + Math.sin(bend) * h * 0.3, 752 - h * 0.6, tipx, tipy); g.stroke();
      if (k % 5 === 0) { g.fillStyle = '#F2EEE4'; g.beginPath(); g.arc(tipx, tipy, 4, 0, TAU); g.fill(); }
      if (k % 7 === 3) { g.fillStyle = '#C86A8A'; for (let q = 0; q < 4; q++) { g.beginPath(); g.arc(tipx + q * 4 * Math.cos(bend), tipy + q * 5, 2.4, 0, TAU); g.fill(); } } }
  }
})();
