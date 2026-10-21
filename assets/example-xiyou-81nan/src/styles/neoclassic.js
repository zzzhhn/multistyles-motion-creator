// 31 新古典 · 请圣降妖 — neoclassical language (cold raking light, a shallow frieze-like stage, hewn stone, sculpted figures) on
// the novel's own setting: the cliff of 号山 and the gate of 火云洞, the dead pine of 枯松涧.
// 观音 descends on a lotus; 红孩儿 sits on her 天罡刀 lotus throne to mock her, and on beat 3 the petals turn back into
// blades and five golden hoops snap on him, his hands forced together. 唐僧, bound to a column, flies back to the saddle.
(() => {
  'use strict';
  const XY = window.XY, K = XY.KIT_D, TAU = XY.TAU;
  const GY = 702, FLOOR = 640, ARCH = [230, 590, 950], PLINTH = [930, 498], BOUND = [590, 452];
  const PEN = { outline: 'rgba(40,34,30,0.7)', ow: 0.9, seed: 31, shade: 'rgba(30,30,40,0.25)',
    color: r => ({ fur: '#7E5636', face: '#E2C2A0', wkshirt: '#A8301E', tiger: '#C8913E', stripe: '#2A1E16', gold: '#C9A44A', staff: '#8E2418', ink: '#1E1A18',
      horse: '#EEEAE2', horse2: '#C8C2B8', mane: '#DCD6CC', hoof: '#34302C', saddle: '#2E4A78', red: '#A0281E', robe: '#D2B470', kasaya: '#A0281E',
      skin: '#E8CDB0', metal: '#B8A060', bjrobe: '#2C3040', bjpants: '#22252E', pig: '#E6B4A8', pig2: '#C88C80', wood: '#7A5A3A',
      ssrobe: '#2E4A78', ssrobe2: '#243A60', skin2: '#B08866', ssh: '#9E3E28', ssbeard: '#88341F', skull: '#EEE8DA', bundle: '#8A7448' })[r] || XY.DEFAULT_COLORS[r] };

  const meander = (g, x0, x1, y, h, col) => {   // Greek key band
    g.strokeStyle = col; g.lineWidth = 2.4; g.beginPath(); const s = h;
    for (let x = x0; x < x1 - s; x += s * 1.6) { g.moveTo(x, y + h); g.lineTo(x, y); g.lineTo(x + s, y); g.lineTo(x + s, y + h * 0.66); g.lineTo(x + s * 0.34, y + h * 0.66); g.lineTo(x + s * 0.34, y + h * 0.33); g.lineTo(x + s * 0.66, y + h * 0.33); g.moveTo(x, y + h); g.lineTo(x + s * 1.6, y + h); }
    g.stroke();
  };
  const roundel = (g, x, y, r) => {   // a lotus carved in a stone roundel, lit from the upper left
    let gr = g.createRadialGradient(x - r * 0.3, y - r * 0.3, 2, x, y, r); gr.addColorStop(0, '#D8D4CC'); gr.addColorStop(1, '#8E8A84'); g.fillStyle = gr; g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill();
    g.strokeStyle = 'rgba(40,38,36,0.5)'; g.lineWidth = 1.6; g.beginPath(); g.arc(x, y, r - 4, 0, TAU); g.stroke();
    for (let k = -3; k <= 3; k++) { g.save(); g.translate(x, y + r * 0.35); g.rotate(k * 0.36); g.fillStyle = 'rgba(244,242,236,0.85)'; g.beginPath(); g.ellipse(0, -r * 0.42, r * 0.12, r * 0.42, 0, 0, TAU); g.fill();
      g.strokeStyle = 'rgba(60,56,52,0.45)'; g.lineWidth = 1; g.stroke(); g.restore(); }
  };
  const hewn = (g, pts, light, dark, seed) => {   // a block of hewn rock: flat planes, chisel marks, a hard lit edge
    XY.path(g, pts, true); const gr = g.createLinearGradient(pts[0], pts[1], pts[4], pts[5]); gr.addColorStop(0, light); gr.addColorStop(1, dark); g.fillStyle = gr; g.fill();
    g.save(); XY.path(g, pts, true); g.clip(); const R = XY.rng(seed); g.strokeStyle = 'rgba(40,38,36,0.18)'; g.lineWidth = 1;
    for (let k = 0; k < 60; k++) { const x = R() * 1180, y = R() * 780; g.beginPath(); g.moveTo(x, y); g.lineTo(x + 8 + R() * 10, y + 2); g.stroke(); } g.restore();
    g.strokeStyle = 'rgba(250,248,240,0.45)'; g.lineWidth = 2; g.beginPath(); g.moveTo(pts[0], pts[1]); g.lineTo(pts[2], pts[3]); g.stroke();
  };
  const ding = (g, x, y) => {   // a bronze 鼎, its fire drowned by the vase's sea
    g.strokeStyle = '#4A3A22'; g.lineWidth = 6; g.lineCap = 'round'; g.beginPath(); g.moveTo(x - 30, y); g.lineTo(x - 24, y - 34); g.moveTo(x + 30, y); g.lineTo(x + 24, y - 34); g.moveTo(x, y + 4); g.lineTo(x, y - 34); g.stroke();
    const gr = g.createLinearGradient(x - 44, 0, x + 44, 0); gr.addColorStop(0, '#A8925A'); gr.addColorStop(0.4, '#6E5A30'); gr.addColorStop(1, '#2E2412'); g.fillStyle = gr;
    g.beginPath(); g.moveTo(x - 44, y - 82); g.lineTo(x + 44, y - 82); g.quadraticCurveTo(x + 46, y - 30, x, y - 28); g.quadraticCurveTo(x - 46, y - 30, x - 44, y - 82); g.fill();
    g.strokeStyle = 'rgba(30,24,12,0.6)'; g.lineWidth = 1.4; g.strokeRect(x - 38, y - 72, 76, 14); for (let k = 0; k < 5; k++) { g.beginPath(); g.arc(x - 30 + k * 15, y - 65, 4, 0, Math.PI); g.stroke(); }
    g.strokeStyle = '#6E5A30'; g.lineWidth = 5; [-1, 1].forEach(s => { g.beginPath(); g.moveTo(x + s * 30, y - 82); g.lineTo(x + s * 30, y - 100); g.lineTo(x + s * 18, y - 100); g.stroke(); });
  };
  const GATE = [760, 1110, 262];   // the 火云洞 doorway: x0, x1, top
  XY.STYLES.neoclassic = {
    hits: [4.5],
    bg(g, W, H) {
      // a cold clear sky and the severe ridges of 号山, then the cliff and the cave gate in hard raking light
      let gr = g.createLinearGradient(0, 0, 0, FLOOR); gr.addColorStop(0, '#8C98A8'); gr.addColorStop(0.6, '#C8CAC6'); gr.addColorStop(1, '#D8D4CA'); g.fillStyle = gr; g.fillRect(0, 0, W, FLOOR);
      g.fillStyle = '#A2A4A6'; g.beginPath(); g.moveTo(0, 420); [[140, 330], [260, 380], [420, 300], [560, 370], [700, 320], [820, 380], [W, 330]].forEach(([x, y]) => g.lineTo(x, y)); g.lineTo(W, FLOOR); g.lineTo(0, FLOOR); g.fill();
      g.fillStyle = 'rgba(250,248,240,0.35)'; g.beginPath(); g.moveTo(140, 330); g.lineTo(200, 380); g.lineTo(150, 400); g.closePath(); g.moveTo(420, 300); g.lineTo(490, 360); g.lineTo(430, 380); g.closePath(); g.fill();
      hewn(g, [0, 120, 230, 160, 250, FLOOR, 0, FLOOR], '#D2CEC6', '#7E7A74', 1); hewn(g, [0, 120, 110, 60, 160, 150, 0, 200], '#C8C4BC', '#8A8680', 2);
      roundel(g, 120, 300, 46);
      // the cave gate: two hewn piers, a heavy lintel, the black mouth (the throne will sit in front of it)
      const [x0, x1, top] = GATE;
      hewn(g, [x0 - 70, 150, x1 + 70, 150, x1 + 70, FLOOR, x0 - 70, FLOOR], '#C8C4BC', '#6E6A64', 3);
      gr = g.createLinearGradient(0, top, 0, FLOOR); gr.addColorStop(0, '#0E0E12'); gr.addColorStop(1, '#24221E'); g.fillStyle = gr; g.fillRect(x0, top, x1 - x0, FLOOR - top);
      g.fillStyle = 'rgba(200,80,40,0.10)'; g.fillRect(x0 + 40, top + 120, x1 - x0 - 80, FLOOR - top - 120);
      hewn(g, [x0 - 90, 196, x1 + 90, 196, x1 + 90, top, x0 - 90, top], '#DEDAD2', '#9A968E', 4);
      g.fillStyle = '#8E8A84'; g.fillRect(x0 - 90, top - 4, x1 - x0 + 180, 4); meander(g, x0 - 80, x1 + 80, top + 2, 12, '#7E7A74');
      roundel(g, x0 - 40, 228, 26); roundel(g, x1 + 40, 228, 26);
      // the stone tablet: 号山枯松涧火云洞
      hewn(g, [640, 430, 700, 430, 702, FLOOR, 638, FLOOR], '#D6D2CA', '#8E8A84', 5); g.fillStyle = '#C8C4BC'; g.fillRect(630, 420, 80, 12);
      g.fillStyle = '#3A3632'; g.font = XY.font(22, XY.cnFont.li, 'bold'); g.textAlign = 'center'; K.vtext(g, '号山枯松涧火云洞', 670, 462, 22); g.textAlign = 'left';
      // the dead pine of 枯松涧 the monk is tied to, stark and pale
      g.strokeStyle = '#6A6258'; g.lineCap = 'round'; g.lineWidth = 20; g.beginPath(); g.moveTo(BOUND[0], FLOOR); g.lineTo(BOUND[0] + 6, 330); g.lineTo(BOUND[0] - 4, 250); g.stroke();
      g.lineWidth = 8; g.beginPath(); g.moveTo(BOUND[0] + 4, 330); g.lineTo(BOUND[0] + 70, 290); g.lineTo(BOUND[0] + 96, 300); g.moveTo(BOUND[0] - 2, 280); g.lineTo(BOUND[0] - 60, 244); g.stroke();
      g.strokeStyle = 'rgba(240,236,226,0.5)'; g.lineWidth = 3; g.beginPath(); g.moveTo(BOUND[0] - 8, FLOOR); g.lineTo(BOUND[0] - 3, 330); g.stroke();
      // the rock the lotus throne rests on, in front of the black doorway
      const [px, py] = PLINTH; hewn(g, [px - 96, py + 6, px + 96, py + 6, px + 110, GY, px - 110, GY], '#D8D4CC', '#7A766E', 6);
      ding(g, 210, 632);
      // the terrace, washed by the sea water poured from the vase, then the front ledge with a 回纹 relief
      gr = g.createLinearGradient(0, FLOOR, 0, GY); gr.addColorStop(0, '#8A9098'); gr.addColorStop(1, '#B8BEC4'); g.fillStyle = gr; g.fillRect(0, FLOOR, W, GY - FLOOR);
      g.strokeStyle = 'rgba(250,250,246,0.45)'; g.lineWidth = 1.4; for (let k = 0; k < 9; k++) { const y = FLOOR + 6 + k * 6.5; g.beginPath(); for (let x = 0; x <= W; x += 20) g.lineTo(x, y + 1.6 * Math.sin(x / 30 + k)); g.stroke(); }
      g.fillStyle = '#D6D2CA'; g.fillRect(0, GY, W, H - GY); g.fillStyle = '#2A2826'; g.fillRect(0, GY, W, 4); meander(g, 10, W - 10, GY + 18, 22, '#9A968E');
      // the stage light: a raking shaft from the upper left, the right of the scene in cool shadow
      g.fillStyle = 'rgba(20,22,30,0.30)'; g.beginPath(); g.moveTo(W * 0.46, 0); g.lineTo(W, 0); g.lineTo(W, GY); g.lineTo(W * 0.8, GY); g.closePath(); g.fill();
      g.fillStyle = 'rgba(255,250,236,0.10)'; g.beginPath(); g.moveTo(0, 0); g.lineTo(W * 0.32, 0); g.lineTo(W * 0.62, GY); g.lineTo(0, GY); g.closePath(); g.fill();
      K.grain(g, W, H, 31, 1400, 'rgba(40,36,32,0.06)', 'rgba(255,255,255,0.06)', 3);
    },
    draw(g, e) {
      const { W, H, t, u, beat } = e;
      inscription(g, beat);
      { const x = 210; g.strokeStyle = 'rgba(180,186,196,0.45)'; g.lineWidth = 3; for (let k = 0; k < 3; k++) { g.beginPath(); for (let q = 0; q < 14; q++) g.lineTo(x - 10 + k * 10 + 10 * XY.noise1(q * 0.4 - t * 1.2, k + 3), 540 - q * 16); g.stroke(); } }
      // 唐僧 tied to the dead pine; on beat 6 the cords drop and a trail of 甘露 light carries him back to the saddle by 6.9
      const rel = XY.smooth((beat - 6.0) / 0.9);
      const acts = { wukong: { shade: K.win(beat, 1.6, 2.2) * (1 - K.win(beat, 3.8, 4.3)), raise: K.win(beat, 4.4, 4.8) * (1 - K.win(beat, 6.2, 6.8)) },
        bajie: { scratch: K.win(beat, 2.2, 2.6) * (1 - K.win(beat, 3.2, 3.6)) }, shaseng: { lift: K.win(beat, 4.4, 4.8) * (1 - K.win(beat, 5.6, 6.2)) }, monk: { palm: K.win(beat, 7.0, 7.5) } };
      if (rel >= 1) acts.cast = { rider: true };
      if (rel < 1) { const sb = K.sub(e, e.phase, acts, 2, 'rider', 'saddle'), p = sb.at;
        const x = XY.lerp(BOUND[0], p[0], rel), y = XY.lerp(BOUND[1], p[1], rel) - 140 * Math.sin(Math.PI * rel);
        if (rel > 0) { g.save(); g.globalCompositeOperation = 'screen'; for (let k = 0; k < 14; k++) { const q = Math.max(0, rel - k * 0.04), qx = XY.lerp(BOUND[0], p[0], q), qy = XY.lerp(BOUND[1], p[1], q) - 140 * Math.sin(Math.PI * q) - 40;
          const rg = g.createRadialGradient(qx, qy, 0, qx, qy, 12); rg.addColorStop(0, `rgba(230,244,255,${0.9 - k * 0.05})`); rg.addColorStop(1, 'rgba(200,230,255,0)'); g.fillStyle = rg; g.fillRect(qx - 12, qy - 12, 24, 24); } g.restore(); }
        K.paintSub(g, sb, PEN, x, y, -0.4 * Math.sin(Math.PI * rel), XY.lerp(0.85, 1, rel));
        if (rel <= 0) { g.strokeStyle = '#8A6A44'; g.lineWidth = 2.6; [BOUND[1] - 32, BOUND[1] - 20, BOUND[1] - 8].forEach(yy => { g.beginPath(); g.ellipse(BOUND[0], yy, 18, 4, 0, 0, TAU); g.stroke(); }); } }
      if (beat > 6 && beat < 6.8) { const f = (beat - 6) / 0.8; g.strokeStyle = `rgba(138,106,68,${1 - f})`; g.lineWidth = 2.6; [BOUND[1] - 32, BOUND[1] - 20, BOUND[1] - 8].forEach((yy, k) => { g.beginPath(); g.ellipse(BOUND[0] + 6 * k * f, yy + 150 * f * f, 18, 4, 0.3 * k * f, 0, TAU); g.stroke(); }); }
      // 观音 comes down in the open sky between beats 1.8 and 3.6, then turns the willow branch on the throne and flings 甘露
      const gd = XY.easeOut((beat - 1.8) / 1.8), gx = 330, gyy = XY.lerp(-80, 452, gd) + 5 * Math.sin(t * 1.4), point = K.win(beat, 3.6, 4.0);
      if (gd > 0) { if (gd < 1) { g.save(); g.globalCompositeOperation = 'screen'; const rg = g.createLinearGradient(0, 0, 0, gyy); rg.addColorStop(0, 'rgba(255,248,226,0)'); rg.addColorStop(1, `rgba(255,248,226,${0.35 * (1 - gd)})`); g.fillStyle = rg; g.fillRect(gx - 70, 0, 140, gyy); g.restore(); }
        guanyin(g, t, gx, gyy, point); }
      if (beat > 3.8 && beat < 4.5) { const f = XY.clamp((beat - 3.8) / 0.6), hx = gx + 150, hy = gyy - 250;   // drops of 甘露 flung from the branch
        g.fillStyle = 'rgba(220,236,255,0.95)'; for (let k = 0; k < 10; k++) { const s = XY.clamp(f * 1.2 - k * 0.04); g.beginPath(); g.arc(XY.lerp(hx, PLINTH[0] - 10, s) + k * 6, XY.lerp(hy, PLINTH[1] - 70, s) - 80 * Math.sin(Math.PI * s), 3.4, 0, TAU); g.fill(); } }
      throne(g, t, beat - 1.5);
      throne(g, t, beat);
      // cast shadow (light from the upper left), then the sculpted procession
      const Gd = GY * e.S, sh = K.sil(e, '#000', acts);
      g.save(); g.setTransform(1, 0, -0.7, 0.16, 0.7 * Gd, 0.84 * Gd); g.globalAlpha = 0.28; g.drawImage(sh.cv, sh.X, sh.Y); g.restore();
      K.put(g, K.lit(e, PEN, acts, { bands: [[-9, -7, 'rgba(24,24,34,0.42)', 2], [3, 3, 'rgba(255,255,250,0.38)']] }));
      near(g, t);
      K.zoom(g, e, PLINTH[0], PLINTH[1] - 60, 1 + 0.15 * K.env(beat, 4.2, 4.6, 5.8, 6.5));
      g.drawImage(frame(W, H, e.S), 0, 0, W, H);
    },
  };

  // the frieze inscription, cut letter by letter as the panel arrives, stone chips at the chisel
  function inscription(g, beat) {
    const [x0, x1] = GATE, cx = (x0 + x1) / 2, p = XY.clamp(beat / 1.4), a = cx - 92, b = cx + 92, rx = XY.lerp(a, b, p);
    if (p <= 0) return;
    g.save(); g.beginPath(); g.rect(a - 6, 200, rx - a + 6, 60); g.clip(); g.textBaseline = 'alphabetic'; g.textAlign = 'center';
    g.font = XY.font(52, XY.cnFont.li, 'bold'); g.fillStyle = 'rgba(255,255,250,0.55)'; g.fillText('火云洞', cx + 2, 250); g.fillStyle = '#3E3A34'; g.fillText('火云洞', cx, 248);
    g.restore();
    if (p < 1) { g.fillStyle = 'rgba(230,226,218,0.9)'; for (let k = 0; k < 10; k++) { const an = XY.hash(k, Math.floor(beat * 20)) * TAU, d = 6 + 18 * XY.hash(k, 3); g.fillRect(rx + Math.cos(an) * d, 230 + Math.sin(an) * d, 2.4, 2.4); } }
  }
  // 观音: white mantle in crisp sculptural folds, veil, 净瓶 at the hip, willow branch in the raised hand, standing on a lotus
  function guanyin(g, t, x, y, point) {
    g.save(); g.translate(x, y); const sw = 3 * Math.sin(t * 1.6);
    g.fillStyle = 'rgba(255,246,214,0.22)'; g.beginPath(); g.arc(0, -262, 46, 0, TAU); g.fill(); g.strokeStyle = 'rgba(206,170,80,0.9)'; g.lineWidth = 2; g.beginPath(); g.arc(0, -262, 46, 0, TAU); g.stroke();
    for (let r = 0; r < 2; r++) for (let k = 0; k < 9; k++) { const a = Math.PI * (1.05 + k / 8 * 0.9), d = 40 - r * 14;
      g.save(); g.translate(Math.cos(a) * d, 4 + Math.sin(a) * 10 - r * 4); g.rotate(a + Math.PI / 2); const pg = g.createLinearGradient(0, 0, 0, -30); pg.addColorStop(0, '#E8C4C4'); pg.addColorStop(1, '#FBF6F2');
      g.fillStyle = pg; g.beginPath(); g.ellipse(0, -14, 9, 18, 0, 0, TAU); g.fill(); g.restore(); }
    let gr = g.createLinearGradient(-50, 0, 60, 0); gr.addColorStop(0, '#FAF8F4'); gr.addColorStop(0.55, '#DCDCE0'); gr.addColorStop(1, '#9A9CA8');
    g.fillStyle = gr; g.beginPath(); g.moveTo(-26, -226); g.quadraticCurveTo(-48, -120, -54 + sw, -4); g.lineTo(58 + sw, -2); g.quadraticCurveTo(46, -120, 28, -226); g.closePath(); g.fill();
    g.fillStyle = 'rgba(176,196,224,0.75)'; g.beginPath(); g.moveTo(-24, -210); g.quadraticCurveTo(10, -150, 52 + sw, -70); g.lineTo(56 + sw, -40); g.quadraticCurveTo(0, -110, -40, -150); g.fill();
    g.strokeStyle = 'rgba(110,112,130,0.55)'; g.lineWidth = 1.6; [[-30, -60], [-14, -90], [4, -110], [22, -80], [38, -50]].forEach(([fx, fy], k) => { g.beginPath(); g.moveTo(fx * 0.4, fy - 110); g.quadraticCurveTo(fx, fy, fx * 1.2 + sw, -6); g.stroke(); });
    // left arm and the vase
    g.fillStyle = '#ECEAE4'; g.beginPath(); g.ellipse(-30, -150, 9, 40, 0.2, 0, TAU); g.fill();
    g.fillStyle = '#F8F8F6'; g.beginPath(); g.moveTo(-40, -112); g.quadraticCurveTo(-56, -96, -46, -82); g.lineTo(-30, -82); g.quadraticCurveTo(-20, -96, -36, -112); g.lineTo(-37, -132); g.lineTo(-39, -132); g.closePath(); g.fill(); g.strokeStyle = '#9A9CA8'; g.lineWidth = 1; g.stroke();
    g.fillStyle = 'rgba(220,236,255,0.9)'; g.beginPath(); g.arc(-38, -76 + ((t * 60) % 40), 2, 0, TAU); g.fill();
    // right arm, raised and turning toward the throne
    const sh = [24, -212], hand = [XY.lerp(46, 96, point), XY.lerp(-160, -236, point)];
    g.strokeStyle = '#ECEAE4'; g.lineWidth = 14; g.lineCap = 'round'; g.beginPath(); g.moveTo(sh[0], sh[1]); g.quadraticCurveTo(sh[0] + 26, (sh[1] + hand[1]) / 2 + 20, hand[0], hand[1]); g.stroke();
    g.fillStyle = '#EED8C0'; g.beginPath(); g.arc(hand[0], hand[1], 6, 0, TAU); g.fill();
    g.strokeStyle = '#5A6A3A'; g.lineWidth = 2; g.beginPath(); g.moveTo(hand[0], hand[1]); const tip = [hand[0] + 44 + 10 * point, hand[1] - 30 + 20 * point]; g.quadraticCurveTo(hand[0] + 30, hand[1] - 40, tip[0], tip[1]); g.stroke();
    g.fillStyle = '#7A9A58'; for (let k = 0; k < 9; k++) { const s = k / 8, lx = XY.lerp(hand[0] + 6, tip[0], s), ly = XY.lerp(hand[1] - 18, tip[1], s) - 10 * Math.sin(s * Math.PI), dr = 10 + 6 * Math.sin(t * 2 + k);
      g.save(); g.translate(lx, ly); g.rotate(1.3 + 0.2 * Math.sin(t * 2 + k)); g.beginPath(); g.ellipse(dr * 0.5, 0, dr * 0.6, 2.2, 0, 0, TAU); g.fill(); g.restore(); }
    // head: veil over dark hair, serene face, the urna
    g.fillStyle = '#EED8C0'; g.beginPath(); g.ellipse(2, -250, 15, 19, 0, 0, TAU); g.fill();
    g.fillStyle = '#2A2422'; g.beginPath(); g.ellipse(0, -270, 14, 9, 0, 0, TAU); g.fill(); g.beginPath(); g.arc(-2, -282, 8, 0, TAU); g.fill();
    g.fillStyle = '#F6F4F0'; g.beginPath(); g.moveTo(-6, -292); g.quadraticCurveTo(-26, -286, -24, -250); g.quadraticCurveTo(-28, -224, -30, -206); g.lineTo(-14, -222); g.quadraticCurveTo(-14, -256, -2, -272); g.closePath(); g.fill();
    g.strokeStyle = '#4A3A34'; g.lineWidth = 1.3; g.beginPath(); g.moveTo(3, -252); g.quadraticCurveTo(7, -250, 11, -252); g.stroke(); g.fillStyle = '#B8302A'; g.beginPath(); g.arc(8, -238, 1.8, 0, TAU); g.arc(6, -262, 1.4, 0, TAU); g.fill();
    g.restore();
  }
  // 红孩儿 cross-legged on the lotus throne, mocking — until the petals are blades again and the five hoops close
  function throne(g, t, beat) {
    const x = PLINTH[0], y = PLINTH[1] - 6, snap = beat >= 3, bl = snap ? XY.easeOut((beat - 3) / 0.14) : 0, pray = XY.smooth((beat - 3.4) / 0.3);
    g.save(); g.translate(x, y + 6); g.scale(1.45, 1.45); g.translate(0, -6);
    for (let k = 0; k < 15; k++) { const a = Math.PI * (0.92 + k / 14 * 1.16), r0 = 26;
      if (bl > 0) { const L = r0 + 34 + 46 * bl, c = Math.cos(a), s = Math.sin(a), nx = -s * 5, ny = c * 5;
        const gr = g.createLinearGradient(c * r0, s * r0, c * L, s * L); gr.addColorStop(0, '#6E7078'); gr.addColorStop(0.5, '#E8ECF2'); gr.addColorStop(1, '#9AA0AA');
        g.fillStyle = gr; g.beginPath(); g.moveTo(c * r0 + nx, s * r0 * 0.5 + ny); g.lineTo(c * L, s * L * 0.62); g.lineTo(c * r0 - nx, s * r0 * 0.5 - ny); g.fill(); g.strokeStyle = '#2A3A5E'; g.lineWidth = 1.2; g.stroke();
        g.strokeStyle = `rgba(255,255,255,${0.5 + 0.5 * (1 - bl)})`; g.lineWidth = 1; g.beginPath(); g.moveTo(c * r0 + nx * 0.4, s * r0 * 0.5 + ny * 0.4); g.lineTo(c * L, s * L * 0.62); g.stroke(); }
      else { g.save(); g.translate(Math.cos(a) * 34, Math.sin(a) * 12); g.rotate(a + Math.PI / 2); const pg = g.createLinearGradient(0, 0, 0, -34); pg.addColorStop(0, '#D8A8A8'); pg.addColorStop(1, '#FBF2EE'); g.fillStyle = pg; g.beginPath(); g.ellipse(0, -14, 10, 20, 0, 0, TAU); g.fill(); g.restore(); } }
    // the boy: crossed legs, red skirt, bare torso, topknots
    const bow = 0.25 * pray, ty = -12;
    g.fillStyle = '#E8CDB0'; g.beginPath(); g.ellipse(0, ty, 30, 10, 0, 0, TAU); g.fill();
    g.fillStyle = '#A8301E'; g.beginPath(); g.moveTo(-22, ty - 4); g.lineTo(22, ty - 4); g.lineTo(16, ty - 26); g.lineTo(-16, ty - 26); g.fill();
    g.save(); g.translate(0, ty - 24); g.rotate(bow);
    g.fillStyle = '#E8CDB0'; g.beginPath(); g.moveTo(-14, 0); g.lineTo(14, 0); g.lineTo(12, -34); g.lineTo(-12, -34); g.fill();
    g.strokeStyle = '#E8CDB0'; g.lineWidth = 7; g.lineCap = 'round'; g.beginPath();
    if (pray > 0) { g.moveTo(-12, -30); g.lineTo(-10, -14); g.lineTo(XY.lerp(-6, -1, pray), XY.lerp(-6, -24, pray)); g.moveTo(12, -30); g.lineTo(10, -14); g.lineTo(XY.lerp(6, 1, pray), XY.lerp(-6, -24, pray)); }
    else { const wv = Math.sin(t * 12) * 0.3; g.moveTo(-12, -30); g.lineTo(-24, -16); g.lineTo(-12, -4); g.moveTo(12, -30); g.lineTo(24 + 6 * wv, -46); g.lineTo(14, -58 + 6 * wv); }
    g.stroke();
    g.fillStyle = '#E8CDB0'; g.beginPath(); g.arc(0, -48, 13, 0, TAU); g.fill(); g.fillStyle = '#2A2422'; g.beginPath(); g.arc(0, -48, 13.4, Math.PI * 1.05, Math.PI * 1.95); g.fill();
    [[-8, -62], [8, -62]].forEach(([a, b]) => { g.beginPath(); g.ellipse(a, b, 4, 5, 0, 0, TAU); g.fill(); });
    g.fillStyle = '#2A2422'; if (snap) { g.fillRect(-6, -48, 4, 1.6); g.fillRect(3, -48, 4, 1.6); g.beginPath(); g.ellipse(0, -40, 3, snap && pray < 1 ? 3.4 : 1.2, 0, 0, TAU); g.fill(); }
    else { g.beginPath(); g.arc(-4, -49, 1.6, 0, TAU); g.arc(5, -49, 1.6, 0, TAU); g.fill(); g.fillStyle = '#C24A40'; g.beginPath(); g.ellipse(1, -39, 3, 4, 0, 0, Math.PI); g.fill(); }
    g.restore();
    // five golden hoops (禁箍): head, wrists, ankles — they shrink onto him with a glint
    if (snap) { const k = XY.easeOut((beat - 3) / 0.12), sc = XY.lerp(2.2, 1, k), hb = [[0, ty - 72, 14, 4], [-10, ty - 34, 6, 3], [10, ty - 34, 6, 3], [-24, ty, 6, 3], [24, ty, 6, 3]];
      hb.forEach(([hx, hy, rx, ry], i) => { const px = i ? hx : hx + Math.sin(bow) * 40, py = hy;
        g.strokeStyle = '#E8C25A'; g.lineWidth = 3; g.beginPath(); g.ellipse(px, py, rx * sc, ry * sc, 0, 0, TAU); g.stroke();
        if (k < 1) { g.fillStyle = `rgba(255,246,200,${1 - k})`; g.beginPath(); for (let q = 0; q < 8; q++) { const a = q / 8 * TAU, r = q % 2 ? 3 : 12; g.lineTo(px + Math.cos(a) * r, py + Math.sin(a) * r); } g.fill(); } }); }
    g.restore();
  }
  // near layer: puddles left by the vase, the cold bronze tripod still smoking, the dropped fire-tipped spear
  function near(g, t) {
    g.fillStyle = 'rgba(180,196,214,0.55)'; [[230, 712, 70, 6], [470, 722, 46, 4], [700, 714, 60, 5]].forEach(([x, y, rx, ry], k) => { g.beginPath(); g.ellipse(x, y, rx, ry, 0, 0, TAU); g.fill();
      g.fillStyle = 'rgba(255,255,255,0.7)'; g.fillRect(x - rx * 0.4 + 6 * Math.sin(t * 1.5 + k), y - 1, rx * 0.5, 1.4); g.fillStyle = 'rgba(180,196,214,0.55)'; });
    g.save(); g.translate(820, 742); g.rotate(-0.04); g.fillStyle = '#5A3A22'; g.fillRect(0, -2.5, 300, 5); g.fillStyle = '#8A8478'; g.beginPath(); g.moveTo(300, -6); g.lineTo(336, 0); g.lineTo(300, 6); g.fill();
    g.fillStyle = '#6A2A1E'; g.beginPath(); g.moveTo(296, -6); g.quadraticCurveTo(306, -16, 314, -10); g.quadraticCurveTo(306, -6, 300, -2); g.fill(); g.fillStyle = '#B8302A'; g.fillRect(286, -4, 8, 8); g.restore();
  }
  // gilt frame, straight and symmetrical: egg-and-dart on the inner moulding
  function frame(W, H, S) {
    return XY.cached('kd31-fr:' + S.toFixed(4), W * S, H * S, cv => { const g = cv.getContext('2d'); g.setTransform(S, 0, 0, S, 0, 0);
      const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, '#E2CA88'); gr.addColorStop(1, '#A8883E'); g.strokeStyle = gr; g.lineWidth = 12; g.strokeRect(6, 6, W - 12, H - 12);
      g.fillStyle = '#7A6028'; const egg = (x, y, horiz) => { g.beginPath(); horiz ? g.ellipse(x, y, 4, 2.6, 0, 0, TAU) : g.ellipse(x, y, 2.6, 4, 0, 0, TAU); g.fill(); };
      for (let x = 18; x < W - 12; x += 12) { egg(x, 6, true); egg(x, H - 6, true); } for (let y = 18; y < H - 12; y += 12) { egg(6, y, false); egg(W - 6, y, false); }
      g.strokeStyle = '#1E1C1A'; g.lineWidth = 2; g.strokeRect(13, 13, W - 26, H - 26);
      const px = W / 2, py = H - 36; let pg = g.createLinearGradient(0, py - 30, 0, py + 22); pg.addColorStop(0, '#E8D294'); pg.addColorStop(1, '#A8883E'); g.fillStyle = pg; g.fillRect(px - 140, py - 32, 280, 56);
      g.strokeStyle = '#6A5020'; g.lineWidth = 2; g.strokeRect(px - 132, py - 26, 264, 44);
      g.fillStyle = '#3A2A10'; g.font = XY.font(46, XY.cnFont.song, 'bold'); g.textAlign = 'right'; g.textBaseline = 'alphabetic'; g.fillText('请圣', px + 10, py + 12);
      g.font = XY.font(28, '"Times New Roman", serif'); g.textAlign = 'left'; g.fillText('XXXI', px + 24, py + 9);
      K.weave(g, W, H, 3, 'rgba(255,255,255,0.03)');
    });
  }
})();
