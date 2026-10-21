// 27 巴洛克 · 1640 年 · 被魔化身 — a palace hall of 乌鸡国 at night, painted in tenebrist chiaroscuro: one torch in a wall
// sconce, a red velvet swag, a fluted column, the back wall lost in shadow. On beat 1 a second Tang Seng on a second
// white horse rides out of the dark beside the real one; the firelight catches only half of each face, and the giant
// shadows on the wall tell the truth — one is a man, the other a maned lion. Beat 2: the real monk recites the band
// spell and 悟空 clutches his head; beat 3: the torch flares, the double becomes the green-maned lion (青毛狮子), 悟空
// strikes, and it leaps into 文殊菩萨's golden glory in the upper right. A light map multiplies the whole scene;
// craquelure, warm varnish and grain sit on top. Entry: total darkness, then the torch catches.
(() => {
  'use strict';
  const XY = window.XY, K = XY.KIT_C, TAU = XY.TAU;
  const TORCH = [150, 352];
  const COL = { fur: '#8E5A30', face: '#E8C29A', wkshirt: '#A82A1A', tiger: '#D08A2A', staff: '#9A2416', gold: '#D8A848', horse: '#F0E8DA', horse2: '#CFC2AE', mane: '#E6DCCB',
    hoof: '#3A2C22', saddle: '#6A2216', red: '#A82A1A', robe: '#D8A848', kasaya: '#A42818', skin: '#ECC8A2', metal: '#C8A04A', bjrobe: '#2A2A34', bjpants: '#24242C', pig: '#E8AE9C', pig2: '#C88A7A',
    wood: '#7A4A26', ssrobe: '#34503E', ssrobe2: '#2A4032', skin2: '#B8865C', ssh: '#9A361E', ssbeard: '#86301A', skull: '#ECE2CE', bundle: '#B88A3E', ink: '#1A120C', stripe: '#1A120C' };
  const PEN = { color: r => COL[r] || XY.DEFAULT_COLORS[r], outline: '#2A1810', ow: 1, wob: 0.4, seed: 27, shade: 'rgba(40,20,10,0.3)' };
  const SIL = { color: () => '#000', shade: false };
  const grad = (g, x0, y0, x1, y1, st) => { const gr = g.createLinearGradient(x0, y0, x1, y1); st.forEach(([o, c]) => gr.addColorStop(o, c)); return gr; };

  // ------------------------------------------------------------ the hall (painted fully lit; the light map darkens it)
  const hall = (g, W, H) => {   // a hall of the 乌鸡国 palace: red lacquer columns, lattice windows, a dragon column, stone floor
    g.fillStyle = grad(g, 0, 0, 0, 600, [[0, '#5A4434'], [1, '#7A5E46']]); g.fillRect(0, 0, W, 600);
    [300, 620, 940].forEach(x => { g.fillStyle = grad(g, x - 34, 0, x + 34, 0, [[0, '#8A2A1C'], [0.4, '#C2442E'], [1, '#5A140C']]); g.fillRect(x - 34, 44, 68, 556);
      g.fillStyle = '#C89A48'; [70, 120, 560].forEach(y => g.fillRect(x - 36, y, 72, 8)); g.fillStyle = '#4A3628'; g.fillRect(x - 46, 584, 92, 18); });
    [460, 780].forEach(x => { g.fillStyle = '#3A2A1E'; g.fillRect(x - 70, 200, 140, 260); g.strokeStyle = '#C89A48'; g.lineWidth = 3; g.strokeRect(x - 70, 200, 140, 260);
      g.strokeStyle = 'rgba(210,170,110,0.55)'; g.lineWidth = 2; for (let k = 1; k < 7; k++) { g.beginPath(); g.moveTo(x - 70 + k * 20, 204); g.lineTo(x - 70 + k * 20, 456); g.stroke(); }
      for (let k = 1; k < 13; k++) { g.beginPath(); g.moveTo(x - 66, 200 + k * 20); g.lineTo(x + 66, 200 + k * 20); g.stroke(); }
      g.fillStyle = 'rgba(255,220,160,0.12)'; g.fillRect(x - 66, 204, 132, 252); });
    g.fillStyle = '#4A3628'; g.fillRect(0, 0, W, 40); g.fillStyle = '#C89A48'; g.fillRect(0, 36, W, 8);
    for (let x = 10; x < W; x += 60) { g.fillStyle = '#2E5A4E'; g.fillRect(x, 8, 40, 22); g.fillStyle = '#C89A48'; g.beginPath(); g.arc(x + 20, 19, 7, 0, TAU); g.fill(); }   // painted beam brackets
    // floor: dark stone slabs receding
    g.fillStyle = grad(g, 0, 600, 0, H, [[0, '#4A3A2C'], [1, '#2A2018']]); g.fillRect(0, 600, W, H - 600);
    g.strokeStyle = 'rgba(160,130,100,0.25)'; g.lineWidth = 1.2; [618, 642, 674, 716, 768].forEach(y => { g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke(); });
    for (let k = -10; k < 22; k++) { g.beginPath(); g.moveTo(590 + k * 60, 600); g.lineTo(590 + k * 160, H); g.stroke(); }
    // the great red column on the right with a gilt dragon coiling up it
    g.fillStyle = grad(g, 1040, 0, 1150, 0, [[0, '#8A2A1C'], [0.35, '#D2523A'], [1, '#4A100A']]); g.fillRect(1040, 60, 110, 640);
    g.strokeStyle = '#D8A848'; g.lineWidth = 9; g.lineCap = 'round'; g.beginPath(); for (let k = 0; k <= 40; k++) { const y = 680 - k * 15, x = 1095 + 50 * Math.sin(k * 0.5); k ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke();
    g.strokeStyle = '#8A6420'; g.lineWidth = 2; for (let k = 0; k <= 40; k += 2) { const y = 680 - k * 15, x = 1095 + 50 * Math.sin(k * 0.5); g.beginPath(); g.arc(x, y, 4, 0, Math.PI); g.stroke(); }
    g.fillStyle = '#C89A48'; g.fillRect(1026, 36, 138, 30); g.fillStyle = '#4A3628'; g.fillRect(1030, 690, 130, 22);
    // a bronze lamp on the left column
    g.fillStyle = '#5A4228'; g.fillRect(TORCH[0] - 5, TORCH[1] + 6, 10, 64); g.fillStyle = '#8A6A3A'; g.beginPath(); g.moveTo(TORCH[0] - 20, TORCH[1]); g.lineTo(TORCH[0] + 20, TORCH[1]); g.lineTo(TORCH[0] + 10, TORCH[1] + 20); g.lineTo(TORCH[0] - 10, TORCH[1] + 20); g.closePath(); g.fill();
    g.fillStyle = '#6A4E2E'; g.beginPath(); g.ellipse(TORCH[0], TORCH[1] + 70, 30, 8, 0, 0, TAU); g.fill();
  };
  const curtain = (g, t) => {   // the red velvet swag, top left, with deep folds
    const sw = 4 * Math.sin(t * 0.9);
    g.fillStyle = grad(g, 0, 0, 520, 220, [[0, '#7A1410'], [0.5, '#B8281C'], [1, '#5A0C08']]);
    g.beginPath(); g.moveTo(0, 0); g.lineTo(560, 0); g.bezierCurveTo(500, 80 + sw, 380, 150, 230, 160 + sw); g.bezierCurveTo(140, 168, 70, 260, 60, 420 + sw); g.lineTo(0, 440); g.closePath(); g.fill();
    for (let k = 0; k < 7; k++) { const x = 40 + k * 70; g.strokeStyle = k % 2 ? 'rgba(255,140,110,0.28)' : 'rgba(40,0,0,0.45)'; g.lineWidth = k % 2 ? 6 : 10;
      g.beginPath(); g.moveTo(x + 40, 0); g.bezierCurveTo(x + 30, 60, x - 10 + sw, 120, x - 40, 150 + k * 6); g.stroke(); }
    g.fillStyle = '#C89A48'; for (let k = 0; k < 9; k++) { g.beginPath(); g.ellipse(60 + k * 56, 8 + 3 * Math.sin(k), 6, 10, 0, 0, TAU); g.fill(); }
  };
  const cartellino = g => {   // a slip of paper pinned to the wall, corner curling, with the cell's words
    g.save(); g.translate(250, 196); g.rotate(-0.05);
    g.fillStyle = 'rgba(10,6,4,0.45)'; g.beginPath(); g.moveTo(6, 8); g.lineTo(196, 4); g.lineTo(200, 118); g.lineTo(10, 124); g.fill();
    g.fillStyle = grad(g, 0, 0, 190, 110, [[0, '#F2E6CC'], [1, '#D8C6A2']]); g.beginPath(); g.moveTo(0, 0); g.lineTo(190, -4); g.lineTo(192, 92); g.quadraticCurveTo(178, 96, 170, 112); g.lineTo(2, 116); g.closePath(); g.fill();
    g.fillStyle = '#B8A07A'; g.beginPath(); g.moveTo(192, 92); g.quadraticCurveTo(178, 96, 170, 112); g.quadraticCurveTo(186, 104, 192, 92); g.fill();
    g.fillStyle = '#1E140C'; g.font = XY.font(50, XY.cnFont.kai, 'bold'); g.textAlign = 'center'; g.fillText('化 身', 95, 58);
    g.font = XY.font(26, 'Didot, "Bodoni 72", serif', 'italic'); g.fillText('XXVII', 95, 98); g.textAlign = 'left';
    g.fillStyle = '#5A4430'; g.beginPath(); g.arc(14, 10, 3, 0, TAU); g.arc(178, 6, 3, 0, TAU); g.fill();
    g.restore();
  };
  // the green-maned lion (文殊's mount) leaping right; sil = flat black for its cast shadow
  const lion = (g, x, y, s, rot, t, sil) => {
    g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s); g.lineJoin = 'round'; g.lineCap = 'round';
    const body = sil ? '#000' : grad(g, -80, -40, 60, 40, [[0, '#E8C07A'], [0.6, '#B8823E'], [1, '#6A4420']]), mane = sil ? '#000' : '#3E7A6E', dark = sil ? '#000' : '#2A1A0E';
    const legs = [[-58, 10, -96, 36], [-40, 14, -64, 52], [44, 10, 76, 40], [58, 6, 96, 22]];
    legs.forEach(([x0, y0, x1, y1]) => { g.strokeStyle = sil ? '#000' : '#9A6A34'; g.lineWidth = 16; g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.stroke(); g.fillStyle = dark; g.beginPath(); g.arc(x1, y1, 8, 0, TAU); g.fill(); });
    g.fillStyle = body; g.beginPath(); g.ellipse(0, 0, 84, 34, -0.06, 0, TAU); g.fill();
    g.strokeStyle = sil ? '#000' : '#9A6A34'; g.lineWidth = 7; g.beginPath(); g.moveTo(-80, -6); g.bezierCurveTo(-120, -10, -130 + 8 * Math.sin(t * 5), -50, -112, -66); g.stroke();
    g.fillStyle = mane; for (let k = 0; k < 7; k++) { const a = -2.6 + k * 0.4; g.beginPath(); g.ellipse(-112 + Math.cos(a) * 6, -66 + Math.sin(a) * 6, 10, 5, a, 0, TAU); g.fill(); }
    // mane: a shaggy blue-green ruff of flame-like locks round the head
    for (let k = 0; k < 22; k++) { const a = k / 22 * TAU, r = 44 + 8 * Math.sin(k * 2.7 + t * 4); g.fillStyle = sil ? '#000' : (k % 2 ? '#3E7A6E' : '#2C5E54');
      g.beginPath(); g.moveTo(70 + Math.cos(a - 0.2) * 20, -30 + Math.sin(a - 0.2) * 20); g.quadraticCurveTo(70 + Math.cos(a) * r * 1.1, -30 + Math.sin(a) * r * 1.1, 70 + Math.cos(a + 0.25) * r, -30 + Math.sin(a + 0.25) * r); g.lineTo(70 + Math.cos(a + 0.2) * 20, -30 + Math.sin(a + 0.2) * 20); g.fill(); }
    g.fillStyle = sil ? '#000' : grad(g, 60, -60, 110, 0, [[0, '#F0CC88'], [1, '#A87038']]); g.beginPath(); g.ellipse(82, -30, 26, 24, 0.1, 0, TAU); g.fill();
    if (!sil) { g.fillStyle = '#E8DCC8'; g.beginPath(); g.moveTo(98, -18); g.lineTo(116, -14); g.lineTo(98, -6); g.fill(); g.fillStyle = '#3A0A06'; g.beginPath(); g.moveTo(94, -16); g.quadraticCurveTo(118, -8, 96, 0); g.fill();
      g.fillStyle = '#FFE08A'; g.beginPath(); g.ellipse(88, -38, 4, 3, 0, 0, TAU); g.fill(); g.fillStyle = '#1A0A04'; g.beginPath(); g.arc(89, -38, 1.6, 0, TAU); g.fill(); }
    g.restore();
  };
  const glory = (g, t, a) => {   // the ceiling opens on a baroque sky: dark clouds part, slanting shafts of light fall from 文殊's glory
    const G = [1060, 112], R = 220 * a;
    for (let k = 0; k < 4; k++) { const x0 = G[0] - 30 + k * 26, w = 34 + 10 * k, gr = g.createLinearGradient(x0, G[1], x0 - 420, 700); gr.addColorStop(0, `rgba(255,236,180,${0.4 * a})`); gr.addColorStop(1, 'rgba(255,220,160,0)');
      g.fillStyle = gr; g.beginPath(); g.moveTo(x0 - w / 2, G[1]); g.lineTo(x0 + w / 2, G[1]); g.lineTo(x0 - 380 + w, 700); g.lineTo(x0 - 460, 700); g.closePath(); g.fill(); }
    const gr = g.createRadialGradient(G[0], G[1], 4, G[0], G[1], R); gr.addColorStop(0, `rgba(255,250,226,${0.95 * a})`); gr.addColorStop(0.45, `rgba(255,214,140,${0.5 * a})`); gr.addColorStop(1, 'rgba(255,190,110,0)');
    g.fillStyle = gr; g.fillRect(G[0] - R, G[1] - R, 2 * R, 2 * R);
    for (let k = 0; k < 10; k++) { const ang = k / 10 * TAU + 0.2 * Math.sin(t * 0.3 + k), r = 120 + 70 * a + 10 * Math.sin(t + k), x = G[0] + Math.cos(ang) * r, y = G[1] + Math.sin(ang) * r * 0.55;
      const cg = g.createRadialGradient(x - 10, y - 10, 4, x, y, 60); cg.addColorStop(0, `rgba(200,170,130,${0.8 * a})`); cg.addColorStop(0.6, `rgba(90,62,40,${0.75 * a})`); cg.addColorStop(1, 'rgba(40,24,14,0)'); g.fillStyle = cg; g.fillRect(x - 60, y - 60, 120, 120); }
    return G;
  };
  const crackLayer = (W, H, scale) => XY.cached(`bq-crk:${scale.toFixed(4)}`, W * scale, H * scale, cv => { const g = cv.getContext('2d'); g.setTransform(scale, 0, 0, scale, 0, 0);
    K.cracks(g, 0, 0, W, H, 60, 2727, 'rgba(10,6,2,0.32)', 0.7, 6, 18); });
  const dbl = (e, b) => { const h = K.home(e, 'monk'), f = XY.smooth((b - 1.2) / 0.8); return [h[0] + 330 * f, h[1], 1, f > 0.5]; };   // the double rides out ahead, turns and faces the monk; 悟空 is between them

  XY.STYLES.baroque = {
    hits: [4.8, 5.6],
    bg(g, W, H, c, scale) {
      hall(g, W, H); cartellino(g);
      K.paint(g, K.pix(W, H, scale, 4, (x, y) => { const v = 255 * (0.9 + 0.08 * XY.fbm(x / 40, y / 40, 27, 3)); return [v, v * 0.97, v * 0.92]; }), W, H, 'multiply');
    },
    draw(g, e) {
      const { W, H, t, u } = e, b = e.beat, S = e.S;
      const acts = { wukong: { shade: Math.max(K.bump(b, 1.3, 1.6, 2.6, 3.0), K.bump(b, 4.3, 4.5, 5.2, 5.4)), raise: K.bump(b, 5.3, 5.5, 5.6, 5.7), strike: K.bump(b, 5.62, 5.72, 6.0, 6.3) },
        monk: { palm: K.bump(b, 4.0, 4.3, 5.2, 5.6) }, bajie: { scratch: K.bump(b, 1.6, 1.8, 2.4, 2.7) }, shaseng: { lift: K.bump(b, 5.6, 5.8, 6.2, 6.6) } };
      { const hm = K.home(e, 'monk'); K.push(g, e, hm[0] + 170, 520, K.pushOf(b, 4.4, 5.0, 6.4, 0.1)); }
      const ign = XY.smooth((u + 0.38) / 0.3), flare = K.hit(e, 5.6, 0.35), fl = 0.5 + 0.3 * XY.noise1(t * 6, 2) + 0.2 * XY.noise1(t * 17, 3);
      const D = dbl(e, b), twin = b > 1.2 && b < 5.6, leap = (b - 5.7) / 0.9, G = [1060, 112];
      curtain(g, t);
      // ---- giant shadows on the back wall, thrown by the torch: the twin's shadow is a lion
      const LP = [e.procX + 200, 830], [Sc, sg] = K.layer(e, 'bq-shadow'); sg.save(); sg.translate(LP[0], LP[1]); sg.scale(1.3, 1.3); sg.translate(-LP[0], -LP[1]);
      XY.drawProcession(sg, e.phase, e.procX, e.groundY, SIL, acts);
      if (twin) lion(sg, D[0] - 10, D[1] - 120, 1.15, -0.75, t, true);
      sg.restore(); sg.save(); sg.setTransform(1, 0, 0, 1, 0, 0); sg.globalCompositeOperation = 'destination-in'; sg.fillStyle = '#000'; sg.fillRect(0, 0, Sc.width, 598 * S); sg.restore();
      K.blit(g, Sc, 0.82 * ign);   // hard-edged cast shadows
      // ---- the twin rides out of the dark beside the real monk; on beat 3 it becomes the lion and leaps for the glory
      if (b > 5.6 && leap < 1) { const q = XY.clamp(leap), x = XY.lerp(D[0] + 10, G[0], XY.easeIn(q)), y = XY.lerp(D[1] - 60, G[1], q) - 160 * Math.sin(q * Math.PI), s = XY.lerp(1, 0.18, XY.easeIn(q));
        g.save(); g.globalAlpha = 1 - XY.smooth((q - 0.8) / 0.2); lion(g, x, y, s, -0.35 * Math.sin(q * Math.PI) - 0.2, t, false); g.restore(); }
      // ---- the pilgrims with a hard terminator: the side away from the torch falls into shadow
      const [A, ag] = K.layer(e, 'bq-A'), [M, mg] = K.layer(e, 'bq-M');
      XY.drawProcession(ag, e.phase, e.procX, e.groundY, PEN, acts); XY.drawProcession(mg, e.phase, e.procX - 11, e.groundY - 4, SIL, acts);
      const [N, ng] = K.layer(e, 'bq-N'); XY.drawProcession(ng, e.phase, e.procX + 5, e.groundY + 4, SIL, acts);
      if (twin) { const o = { flip: D[3] }; K.fig(ag, e, acts, 'monk', PEN, D[0], D[1], o); K.fig(mg, e, acts, 'monk', SIL, D[0] + (D[3] ? 11 : -11), D[1] - 4, o); K.fig(ng, e, acts, 'monk', SIL, D[0] + (D[3] ? -5 : 5), D[1] + 4, o); }
      const [Sh, hg] = K.layer(e, 'bq-S'); hg.setTransform(1, 0, 0, 1, 0, 0); hg.fillStyle = 'rgba(26,12,6,0.72)'; hg.fillRect(0, 0, Sh.width, Sh.height); hg.globalCompositeOperation = 'destination-out'; hg.drawImage(M, 0, 0);
      ag.save(); ag.setTransform(1, 0, 0, 1, 0, 0); ag.globalCompositeOperation = 'source-atop'; ag.drawImage(Sh, 0, 0); ag.restore();
      const [Rm, rg] = K.layer(e, 'bq-R'); rg.setTransform(1, 0, 0, 1, 0, 0); rg.fillStyle = 'rgba(255,226,170,0.9)'; rg.fillRect(0, 0, Rm.width, Rm.height); rg.globalCompositeOperation = 'destination-out'; rg.drawImage(N, 0, 0);
      ag.save(); ag.setTransform(1, 0, 0, 1, 0, 0); ag.globalCompositeOperation = 'source-atop'; ag.drawImage(Rm, 0, 0); ag.restore();   // a rim of firelight on the lit edges
      K.blit(g, A);
      // the band spell: gold rings tightening round 悟空's head
      const spell = K.bump(b, 4.3, 4.5, 5.2, 5.4); if (spell > 0.01) { const hd = e.at('wukong.head', acts); g.save(); g.globalCompositeOperation = 'lighter';
        for (let k = 0; k < 3; k++) { const ph = (t * 2.4 + k / 3) % 1, r = XY.lerp(60, 16, ph); g.strokeStyle = `rgba(255,200,90,${spell * (1 - ph)})`; g.lineWidth = 3; g.beginPath(); g.ellipse(hd[0] - 2, hd[1] - 8, r, r * 0.4, -0.1, 0, TAU); g.stroke(); } g.restore(); }
      // ---- light map: one torch (flickering, flaring on beat 3) and later 文殊's glory; everything else falls to near black
      const [Lc, lg] = K.layer(e, 'bq-light'); lg.fillStyle = '#160C07'; lg.fillRect(0, 0, W, H); lg.globalCompositeOperation = 'lighter';
      const R0 = (560 + 50 * fl + 260 * flare) * ign, cx = TORCH[0] + 14 * XY.noise1(t * 0.9, 4), cy = TORCH[1] + 10 * XY.noise1(t * 0.9, 5);
      if (R0 > 1) { const gr = lg.createRadialGradient(cx, cy, 10, cx, cy, R0); gr.addColorStop(0, 'rgb(255,226,170)'); gr.addColorStop(0.35, 'rgb(200,140,80)'); gr.addColorStop(0.75, 'rgb(70,40,20)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); lg.fillStyle = gr; lg.fillRect(0, 0, W, H);
        const gr2 = lg.createRadialGradient(e.procX + 120, 560, 20, e.procX + 120, 560, 560); gr2.addColorStop(0, `rgba(255,226,180,${ign})`); gr2.addColorStop(0.5, `rgba(150,96,56,${ign})`); gr2.addColorStop(1, 'rgba(0,0,0,0)'); lg.fillStyle = gr2; lg.fillRect(0, 0, W, H);
        const gr3 = lg.createRadialGradient(e.procX + 300, 320, 30, e.procX + 300, 320, 420); gr3.addColorStop(0, `rgba(220,160,96,${ign})`); gr3.addColorStop(1, 'rgba(0,0,0,0)'); lg.fillStyle = gr3; lg.fillRect(0, 0, W, H); }
      const gl = K.bump(b, 5.6, 6.0, 7.2, 7.9); if (gl > 0) { const gr = lg.createRadialGradient(G[0], G[1], 10, G[0], G[1], 520); gr.addColorStop(0, `rgba(255,236,190,${gl})`); gr.addColorStop(1, 'rgba(0,0,0,0)'); lg.fillStyle = gr; lg.fillRect(0, 0, W, H); }
      K.blit(g, Lc, 1, 'multiply');
      // ---- emissive things on top of the darkness: the glory, the flame, sparks
      if (gl > 0) { g.save(); g.globalCompositeOperation = 'screen'; glory(g, t, gl); g.restore(); }
      if (ign > 0.02) { const h = (34 + 10 * fl + 30 * flare) * ign; g.save(); g.globalCompositeOperation = 'lighter';
        const gr = g.createRadialGradient(TORCH[0], TORCH[1] - h * 0.4, 2, TORCH[0], TORCH[1] - h * 0.4, h * 1.6); gr.addColorStop(0, 'rgba(255,220,140,0.9)'); gr.addColorStop(1, 'rgba(255,120,40,0)'); g.fillStyle = gr; g.fillRect(TORCH[0] - h * 2, TORCH[1] - h * 2.2, h * 4, h * 3.6);
        const sway = 8 * XY.noise1(t * 4, 9); g.fillStyle = 'rgba(255,240,190,0.95)'; g.beginPath(); g.moveTo(TORCH[0] - 12, TORCH[1]); g.quadraticCurveTo(TORCH[0] - 14 + sway, TORCH[1] - h * 0.6, TORCH[0] + sway * 1.6, TORCH[1] - h); g.quadraticCurveTo(TORCH[0] + 12 + sway, TORCH[1] - h * 0.5, TORCH[0] + 12, TORCH[1]); g.fill();
        for (let k = 0; k < 16; k++) { const ph = (t * (0.5 + XY.hash(k, 1) * 0.5) + XY.hash(k, 2)) % 1, x = TORCH[0] + (XY.hash(k, 3) - 0.5) * 30 + 30 * ph * Math.sin(t * 2 + k), y = TORCH[1] - 20 - ph * (160 + 120 * flare);
          g.fillStyle = `rgba(255,${180 + 60 * (1 - ph) | 0},90,${(1 - ph) * ign})`; g.fillRect(x, y, 2.4, 2.4); }
        g.restore(); }
      if (ign < 0.4) { const p = (0.6 + 0.4 * Math.sin(t * 5)) * (1 - ign / 0.4); g.save(); g.globalCompositeOperation = 'lighter';   // an ember waiting in the dark sconce
        const gr = g.createRadialGradient(TORCH[0], TORCH[1] - 4, 1, TORCH[0], TORCH[1] - 4, 26); gr.addColorStop(0, `rgba(255,150,60,${0.8 * p})`); gr.addColorStop(1, 'rgba(255,90,20,0)'); g.fillStyle = gr; g.fillRect(TORCH[0] - 26, TORCH[1] - 30, 52, 52); g.restore(); }
      // the transformation flash on beat 3
      const fx = K.hit(e, 5.6, 0.18); if (fx > 0.02 && b < 6.2) { g.save(); g.globalCompositeOperation = 'lighter'; const gr = g.createRadialGradient(D[0], D[1] - 90, 4, D[0], D[1] - 90, 220); gr.addColorStop(0, `rgba(255,240,200,${fx})`); gr.addColorStop(1, 'rgba(255,200,120,0)'); g.fillStyle = gr; g.fillRect(D[0] - 220, D[1] - 310, 440, 440); g.restore(); }
    },
    post(canvas, g, e) {
      g.save(); g.drawImage(crackLayer(e.W, e.H, e.S), 0, 0); g.globalCompositeOperation = 'soft-light'; g.fillStyle = 'rgba(200,140,60,0.35)'; g.fillRect(0, 0, canvas.width, canvas.height); g.restore();
      K.grain(g, canvas, K.grainTile('bq-grain', 192, 27, 0.14), e.t, 12);
      const v = XY.keep(`bq-vig:${canvas.width}`, canvas.width, canvas.height, cv => { const c = cv.getContext('2d'), gr = c.createRadialGradient(cv.width * 0.4, cv.height * 0.6, cv.height * 0.3, cv.width / 2, cv.height / 2, cv.width * 0.62); gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(1, 'rgba(8,4,2,0.55)'); c.fillStyle = gr; c.fillRect(0, 0, cv.width, cv.height); });
      g.drawImage(v, 0, 0);
    },
  };
})();
