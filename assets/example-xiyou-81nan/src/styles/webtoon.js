// 76 韩式 webtoon · 玄英洞受苦 — a page of a scrolling comic. Bottom panel: 金平府 on the night of 元宵, three golden
// lamps of 酥合香油 before 慈云寺. Top row: the lamp, three "Buddhas" in the wind with a horn through a halo, a rhino's
// eye. Beat 2 the rhino demon smashes out of its panel and snorts the three flames away (beats 2, 2.5, 3); then the top
// row scrolls up to 玄英洞, where the three rhino kings sit and 唐僧 is tied to a pillar.
(() => {
  'use strict';
  const XY = window.XY, K = XY.KIT_I, TAU = XY.TAU, { sin, cos, PI, hypot } = Math;
  const LINE = '#16151C', GUT = '#FFFFFF', SKIN = '#7E8CA6', SKD = '#5A6683', SKL = '#AAB6CC', HORN = '#F0E6CC', HORND = '#C9B88F';
  const P0 = [20, 416, 1140, 348], P1 = [262, 22, 258, 376], P2 = [540, 22, 260, 376], P3 = [820, 22, 338, 376], P4 = [262, 22, 896, 376];
  const LAMPS = [[990, 510], [1048, 510], [1106, 510]];
  const sm = XY.smooth, W_ = K.win;

  const box = (g, r, lw = 3) => { g.strokeStyle = LINE; g.lineWidth = lw; g.strokeRect(r[0], r[1], r[2], r[3]); };
  const vgrad = (g, y0, y1, stops) => { const gr = g.createLinearGradient(0, y0, 0, y1); stops.forEach(([o, c]) => gr.addColorStop(o, c)); return gr; };
  const spl = pts => XY.RIG.spline(pts, true, 5);
  const fillLine = (g, pts, col, lw = 2.6) => { XY.path(g, pts, true); g.fillStyle = col; g.fill(); g.strokeStyle = LINE; g.lineWidth = lw; g.lineJoin = 'round'; g.stroke(); };

  // the rhino demon's head in profile, facing left; cel shadow on the lower half, ivory horns, a lit eye
  const HEAD = spl([-104, 8, -84, -24, -24, -62, 40, -72, 92, -44, 96, 28, 24, 62, -60, 52, -96, 34]);
  const rhino = (g, x, y, s, eye, rot = 0, mouth = 0) => {
    g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s); g.lineJoin = g.lineCap = 'round';
    fillLine(g, spl([62, -60, 74, -104, 92, -58]), SKD);                                                   // ear
    fillLine(g, HEAD, SKIN, 3);
    g.save(); XY.path(g, HEAD, true); g.clip(); g.fillStyle = SKD; g.beginPath(); g.ellipse(10, 70, 130, 52, -0.08, 0, TAU); g.fill();
    g.fillStyle = SKL; g.beginPath(); g.ellipse(-10, -54, 70, 16, -0.2, 0, TAU); g.fill(); g.restore();
    XY.path(g, HEAD, true); g.strokeStyle = LINE; g.lineWidth = 3; g.stroke();
    g.strokeStyle = 'rgba(22,21,28,0.55)'; g.lineWidth = 2;                                               // skin folds
    [[30, -40, 52, -6, 44, 30], [52, -50, 74, -14, 70, 26], [-40, 22, -10, 34, 20, 30]].forEach(p => { g.beginPath(); g.moveTo(p[0], p[1]); g.quadraticCurveTo(p[2], p[3], p[4], p[5]); g.stroke(); });
    fillLine(g, spl([-96, -16, -84, -70, -70, -124, -58, -70, -50, -26]), HORN);                          // the great horn
    g.fillStyle = HORND; XY.path(g, spl([-70, -118, -60, -70, -52, -28, -62, -26, -66, -70]), true); g.fill();
    fillLine(g, spl([-38, -50, -30, -84, -16, -56]), HORN, 2.2);
    g.fillStyle = LINE; g.beginPath(); g.ellipse(-88, 8, 6, 4, -0.4, 0, TAU); g.fill();                    // nostril
    g.lineWidth = 2.6; g.beginPath(); g.moveTo(-96, 32); g.quadraticCurveTo(-50, 42 + 12 * mouth, -12, 36); g.stroke();
    g.lineWidth = 5; g.beginPath(); g.moveTo(-16, -42); g.lineTo(26, -36); g.stroke();                       // brow ridge
    const gl = g.createRadialGradient(4, -26, 1, 4, -26, 22); gl.addColorStop(0, `rgba(255,214,90,${0.9 * eye})`); gl.addColorStop(1, 'rgba(255,140,40,0)'); g.fillStyle = gl; g.fillRect(-20, -50, 48, 48);
    fillLine(g, spl([-10, -26, 4, -34, 18, -26, 4, -18]), eye > 0.5 ? '#FFD84A' : '#E8E0C8', 2);
    g.fillStyle = '#C8321E'; g.beginPath(); g.arc(4, -26, 5, 0, TAU); g.fill(); g.fillStyle = LINE; g.fillRect(3, -31, 2.4, 10);
    g.restore();
  };
  // a golden lamp of 酥合香油: bowl on a stand, flame (0 = out)
  const lamp = (g, x, y, s, fl, t, k) => {
    g.save(); g.translate(x, y); g.scale(s, s); g.lineJoin = 'round';
    fillLine(g, [-6, 20, 6, 20, 10, 150, -10, 150], '#B8862E', 2); fillLine(g, [-30, 150, 30, 150, 24, 160, -24, 160], '#B8862E', 2);
    fillLine(g, spl([-36, -4, 36, -4, 26, 18, 0, 24, -26, 18]), '#E8B23A', 2.4);
    g.fillStyle = '#FFE59A'; g.beginPath(); g.ellipse(0, -4, 36, 7, 0, 0, TAU); g.fill(); g.strokeStyle = LINE; g.lineWidth = 2.4; g.stroke();
    g.strokeStyle = 'rgba(120,70,10,0.6)'; g.lineWidth = 1.4; for (let i = -2; i <= 2; i++) { g.beginPath(); g.moveTo(i * 10, 4); g.quadraticCurveTo(i * 12, 12, i * 7, 18); g.stroke(); }
    if (fl > 0.02) { const f = 1 + 0.12 * sin(t * 19 + k * 2) + 0.08 * sin(t * 31 + k), h = 34 * f * fl;
      const gl = g.createRadialGradient(0, -14, 2, 0, -14, 60 * fl); gl.addColorStop(0, 'rgba(255,220,120,0.7)'); gl.addColorStop(1, 'rgba(255,160,60,0)'); g.fillStyle = gl; g.fillRect(-60, -74, 120, 120);
      g.fillStyle = '#FF9A2E'; g.beginPath(); g.moveTo(-10 * fl, -6); g.quadraticCurveTo(-14 * fl, -h * 0.5, 2 * sin(t * 9 + k), -6 - h); g.quadraticCurveTo(14 * fl, -h * 0.5, 10 * fl, -6); g.fill();
      g.fillStyle = '#FFF2B0'; g.beginPath(); g.moveTo(-5 * fl, -6); g.quadraticCurveTo(-6 * fl, -h * 0.35, 0, -6 - h * 0.6); g.quadraticCurveTo(6 * fl, -h * 0.35, 5 * fl, -6); g.fill(); }
    else { g.strokeStyle = 'rgba(200,200,210,0.6)'; g.lineWidth = 2; g.beginPath(); g.moveTo(0, -8); g.bezierCurveTo(8, -20, -8, -30, 4, -46 - 6 * sin(t * 3 + k)); g.stroke(); }
    g.restore();
  };
  // webtoon title lettering: slanted, gradient fill, white stroke inside a black outline
  const sfx = (g, s, x, y, px, rot, c0, c1) => { g.save(); g.translate(x, y); g.rotate(rot); g.transform(1, 0, -0.18, 1, 0, 0); g.font = XY.font(px, XY.cnFont.hei, '900'); g.textAlign = 'center'; g.textBaseline = 'middle'; g.lineJoin = 'round';
    g.strokeStyle = LINE; g.lineWidth = px * 0.22; g.strokeText(s, 0, 0); g.strokeStyle = '#FFFFFF'; g.lineWidth = px * 0.11; g.strokeText(s, 0, 0);
    g.fillStyle = vgrad(g, -px / 2, px / 2, [[0, c0], [1, c1]]); g.fillText(s, 0, 0); g.restore(); };

  // ------------------------------------------------------------ static: white gutters, the big night panel of 金平府 (sky, moon, rooftops, 慈云寺, crowd, street)
  const STRINGS = [[[20, 444], [1160, 468], 46], [[20, 506], [720, 478], 30]];
  const strAt = (s, v) => [XY.lerp(s[0][0], s[1][0], v), XY.lerp(s[0][1], s[1][1], v) + s[2] * 4 * v * (1 - v)];
  const bg = (g, W, H, c, S) => {
    g.fillStyle = GUT; g.fillRect(0, 0, W, H);
    g.save(); g.beginPath(); g.rect(P0[0], P0[1], P0[2], P0[3]); g.clip();
    g.fillStyle = vgrad(g, 416, 702, [[0, '#141A46'], [0.6, '#33296C'], [1, '#6B3B7C']]); g.fillRect(0, 416, W, 300);
    let gl = g.createRadialGradient(132, 476, 20, 132, 476, 90); gl.addColorStop(0, 'rgba(255,240,190,0.5)'); gl.addColorStop(1, 'rgba(255,240,190,0)'); g.fillStyle = gl; g.fillRect(40, 386, 190, 190);
    g.fillStyle = '#FFF2BE'; g.beginPath(); g.arc(132, 476, 28, 0, TAU); g.fill(); g.fillStyle = 'rgba(230,210,150,0.5)'; g.beginPath(); g.arc(124, 470, 7, 0, TAU); g.arc(140, 486, 5, 0, TAU); g.fill();
    const r = XY.rng(761); g.fillStyle = '#FFFFFF'; for (let k = 0; k < 40; k++) { const x = r() * W, y = 420 + r() * 150; g.globalAlpha = 0.4 + 0.6 * r(); g.fillRect(x, y, 1.6, 1.6); } g.globalAlpha = 1;
    // far rooftops
    g.fillStyle = '#2A2253'; g.beginPath(); g.moveTo(0, 702); for (let x = 0; x <= W; x += 60) { const h = 46 + 30 * XY.hash(x, 3); g.lineTo(x, 640 - h + 14); g.lineTo(x + 8, 640 - h); g.lineTo(x + 52, 640 - h); g.lineTo(x + 60, 640 - h + 14); } g.lineTo(W, 702); g.fill();
    g.fillStyle = 'rgba(255,190,90,0.65)'; for (let k = 0; k < 26; k++) g.fillRect(20 + XY.hash(k, 5) * 1120, 600 + XY.hash(k, 6) * 40, 6, 8);
    // 慈云寺 gate
    fillLine(g, [350, 702, 350, 560, 370, 560, 370, 702], '#B8352E'); fillLine(g, [590, 702, 590, 560, 610, 560, 610, 702], '#B8352E');
    fillLine(g, [330, 548, 630, 548, 630, 566, 330, 566], '#7A2430');
    fillLine(g, [300, 548, 340, 520, 620, 520, 660, 548, 645, 552, 480, 538, 315, 552], '#2B2448');
    fillLine(g, [326, 520, 350, 496, 610, 496, 634, 520], '#3A3060'); g.fillStyle = '#E8B23A'; g.fillRect(340, 492, 280, 5);
    fillLine(g, [430, 572, 530, 572, 530, 604, 430, 604], '#E8B23A', 2.2);
    g.fillStyle = LINE; g.font = XY.font(24, XY.cnFont.kai, 'bold'); g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('慈云寺', 480, 589);
    // the crowd come to see the lamps
    for (let k = 0; k < 64; k++) { const x = 24 + k * 18 + 8 * XY.hash(k, 7), y = 702 - 46 - 26 * XY.hash(k, 8), sc = 0.8 + 0.4 * XY.hash(k, 9);
      g.fillStyle = k % 3 ? '#3B2F66' : '#46397A'; g.beginPath(); g.arc(x, y, 9 * sc, 0, TAU); g.fill(); g.beginPath(); g.ellipse(x, y + 30 * sc, 15 * sc, 22 * sc, 0, PI, 0); g.fill(); g.fillRect(x - 15 * sc, y + 30 * sc, 30 * sc, 40);
      if (k % 5 === 0) { g.strokeStyle = '#3B2F66'; g.lineWidth = 4; g.beginPath(); g.moveTo(x + 8, y + 18); g.lineTo(x + 18, y - 12); g.stroke(); g.fillStyle = '#FFB84A'; g.beginPath(); g.arc(x + 18, y - 18, 6, 0, TAU); g.fill(); } }
    // street, light pools, the lamp table
    g.fillStyle = '#4A3C73'; g.fillRect(0, 702, W, 70); g.strokeStyle = 'rgba(20,16,40,0.35)'; g.lineWidth = 1.5; for (let x = 0; x < W; x += 64) { g.beginPath(); g.moveTo(x, 702); g.lineTo(x - 30, 770); g.stroke(); }
    [[1046, 712, 170], [480, 712, 130]].forEach(([x, y, rr]) => { const pg = g.createRadialGradient(x, y, 4, x, y, rr); pg.addColorStop(0, 'rgba(255,200,110,0.4)'); pg.addColorStop(1, 'rgba(255,200,110,0)'); g.fillStyle = pg; g.save(); g.translate(x, y); g.scale(1, 0.3); g.translate(-x, -y); g.fillRect(x - rr, y - rr, 2 * rr, 2 * rr); g.restore(); });
    fillLine(g, [956, 624, 1142, 624, 1134, 636, 964, 636], '#8A2A2A', 2); fillLine(g, [970, 636, 1128, 636, 1128, 650, 970, 650], '#5E1E2A', 1.6);
    STRINGS.forEach(s => { g.strokeStyle = 'rgba(20,16,30,0.8)'; g.lineWidth = 1.5; g.beginPath(); for (let i = 0; i <= 30; i++) { const p = strAt(s, i / 30); i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1]); } g.stroke(); });
    g.restore(); box(g, P0);
    // scroll-bar track at the right
    g.fillStyle = '#E6E6EC'; g.beginPath(); g.roundRect(1166, 30, 6, 724, 3); g.fill();
  };

  // cached art of the upper panels, in panel-local units
  const panelArt = (key, r, S, paint) => XY.cached(`i76${key}:${S.toFixed(4)}`, r[2] * S, r[3] * S, cv => { const g = cv.getContext('2d'); g.scale(S, S); g.lineJoin = g.lineCap = 'round'; paint(g, r[2], r[3]); });
  const art1 = S => panelArt('p1', P1, S, (g, w, h) => {
    g.fillStyle = vgrad(g, 0, h, [[0, '#2E1408'], [1, '#8A4314']]); g.fillRect(0, 0, w, h);
    g.strokeStyle = 'rgba(255,200,120,0.12)'; g.lineWidth = 2; for (let k = 0; k < 7; k++) { g.beginPath(); g.arc(w / 2, h * 0.62, 40 + k * 26, 0, TAU); g.stroke(); }
    g.fillStyle = '#FFFFFF'; g.fillRect(12, 12, 176, 38); box(g, [12, 12, 176, 38], 2); g.fillStyle = LINE; g.font = XY.font(23, XY.cnFont.hei, 'bold'); g.textBaseline = 'middle'; g.fillText('金平府 · 元宵夜', 22, 32);
  });
  const art2 = S => panelArt('p2', P2, S, (g, w, h) => {
    g.fillStyle = vgrad(g, 0, h, [[0, '#0E1236'], [1, '#2C2A6A']]); g.fillRect(0, 0, w, h);
    g.strokeStyle = 'rgba(255,255,255,0.25)'; g.lineWidth = 2; for (let k = 0; k < 6; k++) { g.beginPath(); for (let i = 0; i <= 40; i++) { const a = i / 40 * TAU * 1.3 + k, rr = 20 + i * 3 + k * 8; g.lineTo(w / 2 + cos(a) * rr * 1.4, 150 + sin(a) * rr * 0.5); } g.stroke(); }
    [[60, 300, 64], [150, 320, 80], [230, 300, 60]].forEach(([x, y, rr]) => fillLine(g, spl([x - rr, y + 20, x - rr * 0.6, y - 16, x, y - 28, x + rr * 0.6, y - 14, x + rr, y + 22, x, y + 34]), '#E9E6F8', 2.4));
  });
  const art3 = S => panelArt('p3', P3, S, (g, w, h) => {
    const rg = g.createRadialGradient(w * 0.6, h * 0.6, 10, w * 0.6, h * 0.6, w); rg.addColorStop(0, '#5A1818'); rg.addColorStop(1, '#120608'); g.fillStyle = rg; g.fillRect(0, 0, w, h);
    g.strokeStyle = 'rgba(255,255,255,0.18)'; for (let k = 0; k < 70; k++) { const a = XY.hash(k, 1) * TAU, r0 = 60 + 80 * XY.hash(k, 2); g.lineWidth = 1 + 2 * XY.hash(k, 3); g.beginPath(); g.moveTo(w * 0.6 + cos(a) * r0, h * 0.6 + sin(a) * r0); g.lineTo(w * 0.6 + cos(a) * 600, h * 0.6 + sin(a) * 600); g.stroke(); }
  });
  // 玄英洞: stalactites, the pillar 唐僧 is tied to, oil jars, the three rhino kings 辟寒 辟暑 辟尘 on their dais
  const KINGS = [[560, '#3E6FB0'], [690, '#C0392B'], [820, '#D9A23A']];
  const art4 = S => panelArt('p4', P4, S, (g, w, h) => {
    g.fillStyle = vgrad(g, 0, h, [[0, '#0C2328'], [1, '#22504F']]); g.fillRect(0, 0, w, h);
    for (let k = 0; k < 22; k++) { const x = k * 42 + 14 * XY.hash(k, 1), l = 30 + 60 * XY.hash(k, 2); fillLine(g, [x - 14, -2, x + 14, -2, x + 2, l], k % 2 ? '#163A3D' : '#1D4547', 2); }
    fillLine(g, [440, h + 4, 470, 300, 930, 300, 930, h + 4], '#3A2E4E', 2.6); g.fillStyle = '#E8B23A'; g.fillRect(470, 300, 460, 5);
    fillLine(g, [212, -4, 248, -4, 248, h + 4, 212, h + 4], '#6A4428', 2.6); g.fillStyle = 'rgba(0,0,0,0.25)'; g.fillRect(212, 0, 12, h);
    [[340, 0.9], [392, 1.05]].forEach(([x, s]) => { fillLine(g, spl([x - 30 * s, 376, x - 36 * s, 320, x - 18 * s, 286, x + 18 * s, 286, x + 36 * s, 320, x + 30 * s, 376]), '#7A4A2A', 2.4);
      g.fillStyle = '#FFD86A'; g.beginPath(); g.ellipse(x, 288, 17 * s, 5 * s, 0, 0, TAU); g.fill(); });
    KINGS.forEach(([x, col]) => { fillLine(g, spl([x - 54, 300, x - 46, 240, x - 30, 214, x + 30, 214, x + 46, 240, x + 54, 300]), col, 2.6);
      g.fillStyle = 'rgba(0,0,0,0.22)'; XY.path(g, spl([x, 214, x + 30, 214, x + 46, 240, x + 54, 300, x, 300]), true); g.fill();
      fillLine(g, [x - 40, 250, x - 66, 270, x - 58, 282, x - 30, 266], col, 2); g.fillStyle = '#E8B23A'; g.fillRect(x - 46, 296, 92, 6);
      rhino(g, x - 6, 178, 0.46, 0.3); });
  });

  const PEN = { outline: LINE, ow: 1.5, shade: 'rgba(60,40,130,0.25)' };
  // v10 (8 beats): panels pop in (0.6, 1.3), a horn pierces the halo (1.8), the eye flares (2.4); the rhino smashes out on 3.6 (hit) and
  // snorts the three flames (3.9, 4.3, 4.7); on 5 (hit) the wind snatches 唐僧 off the horse into its nostrils; the row scrolls to 玄英洞 at 6
  const BURST = 3.6, SNATCH = 5.0, SCROLL = 6.0;
  const actsAt = b => ({ wukong: { shade: sm(W_(b, 2.2, 2.6)) * (1 - sm(W_(b, 3.2, 3.5))), raise: sm(W_(b, 3.5, 3.8)) * (1 - sm(W_(b, 4.6, 4.9))), strike: sm(W_(b, 5.15, 5.4)) * (1 - sm(W_(b, 6.0, 6.6))) },
    monk: { palm: sm(W_(b, 1.6, 2.0)) * (1 - sm(W_(b, 4.6, 5.0))) }, bajie: { scratch: sm(W_(b, 6.4, 6.9)) }, shaseng: { lift: sm(W_(b, 3.7, 4.0)) * (1 - sm(W_(b, 4.4, 4.9))) },
    cast: { rider: b < SNATCH } });
  const REST = [1010, 250, 1.55, 0], OUT = [1112, 352, 1.5, -0.75];
  const headPose = b => { if (b < BURST - 0.1) return REST; const v = b < 5.6 ? K.outBack(W_(b, BURST - 0.1, BURST + 0.05), 1.4) : 1 - XY.easeIO(W_(b, 5.6, 5.9)); return REST.map((r, i) => XY.lerp(r, OUT[i], v)); };
  const local = (p, q) => { const [x, y, s, a] = p; return [x + s * (q[0] * cos(a) - q[1] * sin(a)), y + s * (q[0] * sin(a) + q[1] * cos(a))]; };
  const flameOf = (k, b) => 1 - sm(W_(b, 3.9 + 0.4 * k, 4.15 + 0.4 * k));
  const wipe = (g, r, oy, v, paint) => { if (v <= 0) return; g.save(); g.beginPath(); g.rect(r[0], r[1] + oy, r[2], r[3] * v); g.clip(); g.translate(0, oy); paint(); g.restore(); };

  XY.STYLES.webtoon = {
    bg,
    hits: [BURST, SNATCH],
    draw(g, e) {
      const { t, u, beat, S } = e, A = actsAt(beat), hp = headPose(beat), out = beat >= BURST - 0.05 && beat < 5.95, oy = -392 * XY.easeIO(W_(beat, SCROLL, SCROLL + 0.5));
      // ---- top row: three panels pop in one after another, then the row scrolls up and 玄英洞 slides in
      g.save(); g.beginPath(); g.rect(250, 0, 920, 408); g.clip();
      if (oy > -392) {
        wipe(g, P1, oy, 1, () => { g.drawImage(art1(S), P1[0], P1[1], P1[2], P1[3]); g.save(); g.beginPath(); g.rect(P1[0], P1[1], P1[2], P1[3]); g.clip();
          lamp(g, P1[0] + 129, P1[1] + 262, 2.4, 1 - sm(W_(beat, 4.3, 4.6)), t, 9); g.restore(); box(g, P1); });
        wipe(g, P2, oy, XY.easeOut(W_(beat, 0.6, 0.9)), () => { g.drawImage(art2(S), P2[0], P2[1], P2[2], P2[3]); g.save(); g.beginPath(); g.rect(P2[0], P2[1], P2[2], P2[3]); g.clip();
          const gl = W_(beat, 1.8, 2.1);   // three "Buddhas" coming on the wind; a horn pierces the middle halo
          [[600, 280, 0.8], [670, 262, 1], [740, 280, 0.8]].forEach(([x, y, s], k) => { const jx = gl > 0 && k === 1 ? 4 * sin(t * 60) : 0;
            g.strokeStyle = `rgba(255,226,120,${0.75 + 0.25 * sin(t * 4 + k)})`; g.lineWidth = 5 * s; g.beginPath(); g.arc(x + jx, y - 70 * s, 34 * s, 0, TAU); g.stroke();
            fillLine(g, spl([x - 34 * s, y, x - 24 * s, y - 40 * s, x, y - 50 * s, x + 24 * s, y - 40 * s, x + 34 * s, y]), '#E8B23A', 2);
            fillLine(g, XY.ellipse(x, y - 68 * s, 15 * s, 16 * s, 16), '#F0C85A', 2);
            if (k === 1 && gl > 0) { fillLine(g, spl([x - 8, y - 82, x - 2, y - 128 - 20 * gl, x + 10, y - 84]), HORN, 2.4); g.fillStyle = 'rgba(255,60,60,0.35)'; g.fillRect(x - 40 + jx * 2, y - 112, 80, 4); } });
          g.restore(); box(g, P2); });
        wipe(g, P3, oy, XY.easeOut(W_(beat, 1.3, 1.6)), () => { g.drawImage(art3(S), P3[0], P3[1], P3[2], P3[3]); g.save(); g.beginPath(); g.rect(P3[0], P3[1], P3[2], P3[3]); g.clip();
          if (!out) { rhino(g, hp[0], hp[1], hp[2], 0.4 + 0.6 * Math.max(K.hit(beat, 2.4, 3), sm(W_(beat, 3.0, 3.4))), hp[3]);
            for (let k = 0; k < 3; k++) { const ph = (t * 1.4 + k / 3) % 1, n = local(hp, [-96, 4]); g.fillStyle = `rgba(230,230,240,${0.5 * (1 - ph)})`; g.beginPath(); g.arc(n[0] - 30 * ph, n[1] + 10 * ph, 6 + 16 * ph, 0, TAU); g.fill(); } }
          g.restore();
          g.strokeStyle = LINE; g.lineWidth = 3; g.beginPath(); g.moveTo(P3[0], P3[1] + P3[3]); g.lineTo(P3[0], P3[1]); g.lineTo(P3[0] + P3[2], P3[1]); g.lineTo(P3[0] + P3[2], P3[1] + P3[3]);
          if (beat < BURST - 0.05) g.lineTo(P3[0], P3[1] + P3[3]); else { g.lineTo(1080, 398); g.moveTo(950, 398); g.lineTo(P3[0], 398); g.moveTo(950, 398); g.lineTo(968, 380); g.lineTo(984, 396); g.moveTo(1080, 398); g.lineTo(1064, 378); g.lineTo(1052, 395); }
          g.stroke(); });
      }
      if (oy < 0) { const o4 = oy + 392; g.save(); g.translate(0, o4); g.drawImage(art4(S), P4[0], P4[1], P4[2], P4[3]); g.save(); g.beginPath(); g.rect(P4[0], P4[1], P4[2], P4[3]); g.clip();
        [[120, 130], [880, 130]].forEach(([x, y], k) => { const f = 1 + 0.15 * sin(t * 17 + k); g.fillStyle = '#5A3A22'; g.fillRect(P4[0] + x - 4, P4[1] + y, 8, 40); g.fillStyle = '#FFAA3A'; g.beginPath(); g.ellipse(P4[0] + x, P4[1] + y - 10 * f, 9, 18 * f, 0, 0, TAU); g.fill(); });
        KINGS.forEach(([x], k) => { const p = local([P4[0] + x - 6, P4[1] + 178, 0.46, 0], [4, -26]), gl = g.createRadialGradient(p[0], p[1], 1, p[0], p[1], 14); gl.addColorStop(0, `rgba(255,220,90,${0.6 + 0.4 * sin(t * 5 + k)})`); gl.addColorStop(1, 'rgba(255,160,40,0)'); g.fillStyle = gl; g.fillRect(p[0] - 14, p[1] - 14, 28, 28); });
        const now = e.at('monk.chest', A), f = XY.procParts(e.phase, A)[2], a = [now[0] - e.procX - f.x, now[1] - e.groundY], T = [P4[0] + 230, P4[1] + 190];
        { const sp = g.createRadialGradient(T[0], T[1], 10, T[0], T[1], 150); sp.addColorStop(0, 'rgba(255,214,140,0.42)'); sp.addColorStop(1, 'rgba(255,214,140,0)'); g.fillStyle = sp; g.fillRect(T[0] - 150, T[1] - 150, 300, 300); }
        fillLine(g, [T[0] + 40, P4[1] + 352, T[0] + 150, P4[1] + 344, T[0] + 156, P4[1] + 366, T[0] + 46, P4[1] + 374], '#F4EBD2', 2);   // the forced confession (供状)
        g.strokeStyle = 'rgba(30,28,40,0.6)'; g.lineWidth = 1.6; for (let i = 0; i < 6; i++) { g.beginPath(); g.moveTo(T[0] + 60 + i * 15, P4[1] + 351 - i * 0.8); g.lineTo(T[0] + 62 + i * 15, P4[1] + 368 - i * 0.8); g.stroke(); }
        const M = K.around(a[0], a[1], 0.04 * sin(t * 3), 1.05, T[0] - e.procX - f.x - a[0], T[1] - e.groundY - a[1]);
        K.draw(g, e.phase, e.procX, e.groundY, PEN, A, { only: 2, ignoreCast: true, skip: (fi, pi, p, tag) => tag !== 'monk' || (p.role === 'red' && p.fine && p.k === 'line'), xf: () => M });
        g.strokeStyle = '#A8763A'; g.lineWidth = 4.5; [-30, -8, 16].forEach(dy => { g.beginPath(); g.ellipse(T[0] + 4, T[1] + dy, 36, 8, 0.05, 0, TAU); g.stroke(); });
        g.restore(); box(g, P4); g.restore(); }
      g.restore();
      // ---- the big panel: fireworks over 金平府, swinging lantern strings, the three golden lamps
      g.save(); g.beginPath(); g.rect(P0[0], P0[1], P0[2], P0[3]); g.clip();
      for (let j = 0; j < 2; j++) { const k = Math.floor(t / 0.9) - j, d = t - k * 0.9; if (d > 1.1) continue; const cx = 180 + 680 * XY.hash(k, 1), cy = 450 + 80 * XY.hash(k, 2), col = ['#FFD45A', '#FF7AB8', '#7AE8FF'][k % 3 < 0 ? 0 : k % 3];
        g.fillStyle = col; g.globalAlpha = 1 - d / 1.1; for (let i = 0; i < 18; i++) { const a = i / 18 * TAU, rr = 54 * XY.easeOut(d / 0.7); for (let q = 0; q < 3; q++) g.fillRect(cx + cos(a) * rr * (1 - q * 0.12) - 1.5, cy + sin(a) * rr * (1 - q * 0.12) + 14 * d * d - 1.5, 3, 3); } g.globalAlpha = 1; }
      STRINGS.forEach((s, j) => { const n = j ? 8 : 14; for (let i = 0; i < n; i++) { const p = strAt(s, (i + 0.5) / n), sw = 0.18 * sin(t * 2.2 + i * 0.8 + j), q = [p[0] + sin(sw) * 16, p[1] + cos(sw) * 16];
        g.strokeStyle = LINE; g.lineWidth = 1.2; g.beginPath(); g.moveTo(p[0], p[1]); g.lineTo(q[0], q[1]); g.stroke();
        const gl = g.createRadialGradient(q[0], q[1] + 10, 2, q[0], q[1] + 10, 30); gl.addColorStop(0, 'rgba(255,170,80,0.45)'); gl.addColorStop(1, 'rgba(255,170,80,0)'); g.fillStyle = gl; g.fillRect(q[0] - 30, q[1] - 20, 60, 60);
        g.save(); g.translate(q[0], q[1] + 10); g.rotate(sw); fillLine(g, XY.ellipse(0, 0, 11, 13, 16), i % 3 ? '#E2402E' : '#F08A2E', 1.6); g.fillStyle = '#E8B23A'; g.fillRect(-6, -15, 12, 4); g.fillRect(-6, 11, 12, 4); g.restore(); } });
      LAMPS.forEach(([x, y], k) => lamp(g, x, y, 0.75, flameOf(k, beat), t, k));
      g.restore();
      // ---- the pilgrims: clean lines, flat colour, a cool shadow band and a warm rim from the lamps
      const [pl, pg] = K.layer(e, 'i76proc');
      K.draw(pg, e.phase, e.procX, e.groundY, PEN, A);
      K.blitOn(pl, K.edge(pl, 'i76sh', 10 * S, -5 * S, 'rgba(48,30,120,0.42)'));
      K.blitOn(pl, K.edge(pl, 'i76rim', -4 * S, 1.5 * S, 'rgba(255,196,120,0.95)'));
      K.blit(g, pl);
      // ---- beat 2: the rhino smashes out of its panel; the lamps' flames stream up into its nostril one by one
      if (out) { rhino(g, hp[0], hp[1], hp[2], 1, hp[3], 0.6); const n = local(hp, [-88, 8]);
        LAMPS.forEach(([x, y], k) => { const s0 = 3.8 + 0.4 * k, v = W_(beat, s0, s0 + 0.45); if (v <= 0 || v >= 1) return;
          for (let j = 0; j < 12; j++) { const f = ((beat - s0) * 2.6 + j / 12) % 1, w = 1 - f, m = [(x + n[0]) / 2 + 40, (y - 30 + n[1]) / 2 + 10];
            const px = w * w * x + 2 * w * f * m[0] + f * f * n[0], py = w * w * (y - 34) + 2 * w * f * m[1] + f * f * n[1], r = (10 * (1 - f) + 2) * (1 - v * 0.5);
            g.fillStyle = j % 2 ? '#FFB23A' : '#FFE79A'; g.beginPath(); g.arc(px, py, r, 0, TAU); g.fill(); } });
        const d = (beat - BURST) * XY.BEAT; if (d > 0 && d < 1.2) for (let k = 0; k < 12; k++) { const a = -PI * (0.15 + 0.7 * XY.hash(k, 30)), v = 140 + 160 * XY.hash(k, 31), x = 1012 + cos(a) * v * d * (k % 2 ? 1 : -1), y = 398 - sin(a) * v * d * -0.4 + 300 * d * d;
          g.save(); g.translate(x, y); g.rotate(d * 8 * (XY.hash(k, 32) - 0.5)); fillLine(g, [-10, -6, 12, -2, -2, 9], '#FFFFFF', 2); g.restore(); }
        if (beat < BURST + 1.1) sfx(g, '轰', 920, 444, 96 * (1 + 0.3 * K.hit(beat, BURST, 5)), -0.12, '#FFE14A', '#FF5A1E');
        if (beat > 3.9 && beat < SNATCH) sfx(g, '呼——', 846, 500, 50, -0.16, '#FFFFFF', '#9FD6FF'); }
      { const v = W_(beat, SNATCH, SNATCH + 0.6); if (v > 0 && v < 1) { const now = e.at('monk.chest', A), f = XY.procParts(e.phase, A)[2], a = [now[0] - e.procX - f.x, now[1] - e.groundY], n = local(headPose(beat), [-92, 10]), ev = XY.easeIn(v);
          const sp = 80 * (1 - ev), ang = v * TAU * 2.2, tx = XY.lerp(now[0], n[0], ev) + cos(ang) * sp, ty = XY.lerp(now[1], n[1], ev) + sin(ang) * sp * 0.6 - 60 * sin(PI * v);
          g.strokeStyle = 'rgba(255,255,255,0.75)'; g.lineWidth = 3; for (let k = 0; k < 5; k++) { g.beginPath(); g.arc(tx, ty, 40 + k * 16, ang + k, ang + k + 1.6); g.stroke(); }
          const M2 = K.around(a[0], a[1], ang * 0.6, XY.lerp(1, 0.3, ev), tx - now[0], ty - now[1]);
          K.draw(g, e.phase, e.procX, e.groundY, PEN, A, { only: 2, ignoreCast: true, skip: (fi, pi, p, tag) => tag !== 'monk' || (p.role === 'red' && p.fine && p.k === 'line'), xf: () => M2 }); }
        if (beat > SNATCH - 0.05 && beat < SNATCH + 0.9) sfx(g, '嗖', 760, 400, 74, 0.1, '#FFFFFF', '#FFC94A'); }
      // 八戒's reaction bubble
      if (beat > SNATCH + 0.1 && beat < SNATCH + 1.4) { const h = e.at('bajie.head', A), x = h[0] + 6, y = h[1] - 66, s = K.outBack(W_(beat, SNATCH + 0.1, SNATCH + 0.25));
        g.save(); g.translate(x, y); g.scale(s, s); fillLine(g, [...XY.ellipse(0, 0, 34, 24, 24)], '#FFFFFF', 2.4); fillLine(g, [-8, 20, 4, 22, -4, 36], '#FFFFFF', 2.2); g.fillStyle = '#FFFFFF'; g.fillRect(-9, 16, 14, 6);
        g.fillStyle = LINE; g.font = XY.font(30, XY.cnFont.hei, '900'); g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('!?', 0, 1); g.restore(); }
      // ---- title lettering in the left gutter, the episode tag, the scroll thumb
      [['犀', 128, 116, -0.3], ['牛', 134, 244, -0.22]].forEach(([s, x, y, u0]) => { if (u < u0) return; const k = 1 + 0.4 * (1 - K.outBack(W_(u, u0, u0 + 0.06)));
        g.save(); g.translate(x, y); g.scale(k, k); sfx(g, s, 0, 0, 112, -0.06, '#FF9A3A', '#D6261E'); g.restore(); });
      if (u > -0.14) { g.fillStyle = LINE; g.beginPath(); g.roundRect(56, 330, 150, 44, 22); g.fill(); g.fillStyle = '#FFFFFF'; g.font = XY.font(26, XY.cnFont.yuan, 'bold'); g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('第76难', 131, 353); }
      g.fillStyle = '#A2A2B0'; g.beginPath(); g.roundRect(1166, 30 + 634 * XY.clamp((u + 0.5) / 2), 6, 90, 3); g.fill();
    },
  };
})();
