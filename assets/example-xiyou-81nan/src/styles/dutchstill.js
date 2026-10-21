// 28 荷兰静物 · 号山逢怪 — a 1650 pronkstilleven by candle- and window-light: pewter, a roemer, a convex glass ball,
// a peeled lemon over the table edge. A dead pine bough reaches in from the dark; from it hangs a crying child in a
// red bib (红孩儿 in disguise). On the third beat the glass ball reflects his true self in fire and the candle turns red.
(() => {
  'use strict';
  const XY = window.XY, K = XY.KIT_D, TAU = XY.TAU;
  const GY = 702, BACK = 566;
  const BALL = [905, 452, 92], CANDLE = [1062, 392], KNOT = [575, 248];

  const PEN = { outline: null, seed: 28, shade: 'rgba(16,8,2,0.28)',
    color: r => ({ fur: '#6E4524', face: '#D9B48A', wkshirt: '#8F2A1A', tiger: '#B57A2A', stripe: '#1E140C', gold: '#C69A3A', staff: '#7E1E14', ink: '#17100A',
      horse: '#D6C8AC', horse2: '#A99C84', mane: '#C9BCA2', hoof: '#2A2018', saddle: '#5A2016', red: '#8E1E14', robe: '#B48A3E', kasaya: '#8A1A12',
      skin: '#E2BE96', metal: '#A98A44', bjrobe: '#22252C', bjpants: '#1A1C22', pig: '#D99C92', pig2: '#B87068', wood: '#6A4426',
      ssrobe: '#2E4652', ssrobe2: '#223440', skin2: '#A0744E', ssh: '#8E3620', ssbeard: '#7A2E1C', skull: '#E0D6C0', bundle: '#A88032' })[r] || XY.DEFAULT_COLORS[r] };

  // ------------------------------------------------------------ painted objects (design units)
  const sphere = (g, x, y, r, lit, mid, dark, lx = -0.38, ly = -0.42) => {
    const gr = g.createRadialGradient(x + lx * r, y + ly * r, r * 0.05, x + lx * r * 0.4, y + ly * r * 0.4, r * 1.15);
    gr.addColorStop(0, lit); gr.addColorStop(0.45, mid); gr.addColorStop(1, dark); g.fillStyle = gr; g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill();
  };
  const spec = (g, x, y, r, a = 0.9) => { const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, `rgba(255,250,232,${a})`); gr.addColorStop(1, 'rgba(255,250,232,0)'); g.fillStyle = gr; g.fillRect(x - r, y - r, 2 * r, 2 * r); };
  const castShadow = (g, x, y, rx, ry, a = 0.5) => { const gr = g.createRadialGradient(x, y, 0, x, y, rx); gr.addColorStop(0, `rgba(8,5,2,${a})`); gr.addColorStop(1, 'rgba(8,5,2,0)'); g.save(); g.translate(x, y); g.scale(1, ry / rx); g.translate(-x, -y); g.fillStyle = gr; g.beginPath(); g.arc(x, y, rx, 0, TAU); g.fill(); g.restore(); };
  // a turned vessel: half-width profile [[y, hw], …] from the base up, shaded as polished metal
  const turned = (g, cx, prof, c0, c1, c2) => {
    const L = [], R = []; prof.forEach(([y, w]) => { L.push(cx - w, y); R.unshift(cx + w, y); });
    const pts = XY.RIG.spline(L.concat(R), true, 4), wmax = Math.max(...prof.map(p => p[1]));
    const gr = g.createLinearGradient(cx - wmax, 0, cx + wmax, 0);
    gr.addColorStop(0, c1); gr.addColorStop(0.18, c0); gr.addColorStop(0.3, c1); gr.addColorStop(0.62, c2); gr.addColorStop(0.9, c1); gr.addColorStop(1, c2);
    XY.path(g, pts, true); g.fillStyle = gr; g.fill();
  };
  // ---- the still life, all of it from the pilgrims' world: a gourd, the alms bowl, buns, peaches, a red candle, a bronze mirror
  const gourd = g => {   // 葫芦, dried and lacquered with use, a cord round its waist
    castShadow(g, 300, 654, 140, 22, 0.55);
    sphere(g, 176, 574, 78, '#F2D08A', '#B87E34', '#3A2008'); sphere(g, 172, 466, 50, '#F6DA9A', '#BC8438', '#3E2408');
    g.fillStyle = '#5A3A14'; g.beginPath(); g.ellipse(170, 508, 22, 9, 0, 0, TAU); g.fill();
    g.strokeStyle = '#A8301E'; g.lineWidth = 4; g.beginPath(); g.ellipse(170, 508, 26, 8, 0, 0, Math.PI); g.stroke(); g.beginPath(); g.moveTo(190, 512); g.quadraticCurveTo(206, 540, 198, 572); g.stroke();
    g.fillStyle = '#4A2E10'; g.beginPath(); g.moveTo(164, 420); g.quadraticCurveTo(170, 400, 186, 396); g.lineTo(184, 404); g.quadraticCurveTo(176, 410, 174, 422); g.fill();
    K.impasto(g, 128, 548, 26, -1.9); K.impasto(g, 144, 450, 16, -1.8); spec(g, 140, 540, 26, 0.45);
  };
  const almsBowl = g => {   // 紫金钵盂 heaped with rice
    castShadow(g, 806, 628, 76, 12, 0.45);
    g.fillStyle = '#2A1A22'; g.beginPath(); g.ellipse(762, 622, 34, 7, 0, 0, TAU); g.fill();
    g.save(); g.beginPath(); g.moveTo(706, 562); g.quadraticCurveTo(708, 618, 762, 620); g.quadraticCurveTo(816, 618, 818, 562); g.closePath(); g.clip();
    sphere(g, 748, 572, 90, '#B88AA0', '#5A2E48', '#1A0A16', -0.5, -0.3); g.restore();
    g.strokeStyle = '#D8B050'; g.lineWidth = 3; g.beginPath(); g.ellipse(762, 562, 56, 11, 0, 0, TAU); g.stroke();
    g.fillStyle = '#F2EEE2'; g.beginPath(); g.ellipse(762, 558, 52, 9, 0, Math.PI, TAU); g.quadraticCurveTo(790, 528, 762, 524); g.quadraticCurveTo(732, 528, 710, 558); g.fill();
    const R = XY.rng(8); g.fillStyle = 'rgba(190,180,160,0.6)'; for (let k = 0; k < 40; k++) g.fillRect(722 + R() * 80, 530 + R() * 26, 2, 1.2);
    K.impasto(g, 726, 580, 18, -1.3, 'rgba(255,236,250,0.8)'); K.impasto(g, 748, 532, 14, -0.3);
  };
  const buns = g => {   // a blue-and-white dish of steamed buns
    castShadow(g, 470, 672, 110, 14, 0.5);
    g.fillStyle = '#2E3A5A'; g.beginPath(); g.ellipse(430, 668, 76, 15, 0, 0, TAU); g.fill(); g.fillStyle = '#E8E8E0'; g.beginPath(); g.ellipse(430, 664, 70, 12, 0, 0, TAU); g.fill();
    g.strokeStyle = 'rgba(40,60,120,0.75)'; g.lineWidth = 2; g.beginPath(); g.ellipse(430, 664, 60, 9, 0, 0, TAU); g.stroke();
    [[402, 650, 24], [450, 652, 23], [426, 632, 22]].forEach(([x, y, r]) => { g.save(); g.beginPath(); g.rect(x - r - 2, y - r - 4, 2 * r + 4, r + 8); g.clip(); sphere(g, x, y + 4, r, '#FFFDF4', '#E2DAC6', '#7A6E58'); g.restore(); K.impasto(g, x - r * 0.5, y - r * 0.55, 8, -0.6); });
  };
  const fruit = g => {   // peaches (仙桃) and grapes on a celadon dish
    castShadow(g, 560, 664, 120, 14, 0.5);
    g.fillStyle = '#5E7A64'; g.beginPath(); g.ellipse(540, 658, 70, 14, 0, 0, TAU); g.fill(); g.fillStyle = '#9AB8A0'; g.beginPath(); g.ellipse(540, 654, 64, 11, 0, 0, TAU); g.fill();
    sphere(g, 520, 624, 32, '#FFD9A8', '#E8906A', '#6E2A18'); g.fillStyle = 'rgba(190,40,50,0.45)'; g.beginPath(); g.arc(532, 630, 20, 0, TAU); g.fill();
    g.strokeStyle = 'rgba(90,30,16,0.55)'; g.lineWidth = 1.4; g.beginPath(); g.moveTo(520, 592); g.quadraticCurveTo(506, 620, 516, 654); g.stroke();
    g.fillStyle = '#3A4E22'; g.beginPath(); g.ellipse(506, 592, 20, 7, -0.5, 0, TAU); g.fill(); K.impasto(g, 506, 606, 10, -0.8);
    const R = XY.rng(5); for (let k = 0; k < 22; k++) { const a = R() * TAU, d = R(), x = 572 + Math.cos(a) * 22 * d + k * 0.5, y = 622 + Math.sin(a) * 12 * d + k * 1.3; sphere(g, x, y, 8.5, '#B9A3C8', '#4A2850', '#140A16'); spec(g, x - 3, y - 3, 3, 0.7); }
  };
  const candlestick = g => {   // a bronze candle stand with a red candle
    castShadow(g, 1120, 646, 90, 12, 0.45);
    turned(g, 1062, [[648, 58], [636, 54], [626, 18], [600, 10], [578, 18], [560, 9], [520, 9], [500, 15], [484, 10], [472, 40], [462, 36], [458, 10]], '#D8B870', '#7A5A2A', '#2A1A08');
    g.fillStyle = '#B8261E'; g.fillRect(1050, CANDLE[1] + 10, 24, 462 - CANDLE[1] - 10);
    const gr = g.createLinearGradient(1050, 0, 1074, 0); gr.addColorStop(0, 'rgba(255,200,180,0.45)'); gr.addColorStop(1, 'rgba(60,10,6,0.55)'); g.fillStyle = gr; g.fillRect(1050, CANDLE[1] + 10, 24, 462 - CANDLE[1] - 10);
    g.fillStyle = '#D8A040'; g.font = XY.font(14, XY.cnFont.kai, 'bold'); g.fillText('福', 1055, 440);
    g.fillStyle = '#C8302A'; g.beginPath(); g.moveTo(1052, 408); g.quadraticCurveTo(1046, 430, 1050, 446); g.quadraticCurveTo(1056, 428, 1056, 410); g.fill();
    g.strokeStyle = '#1A120A'; g.lineWidth = 2; g.beginPath(); g.moveTo(CANDLE[0], CANDLE[1] + 11); g.lineTo(CANDLE[0] + 1, CANDLE[1] + 2); g.stroke();
    K.impasto(g, 1044, 598, 20, -1.6); K.impasto(g, 1046, 478, 10, -0.2);
  };
  const mirror = g => {   // a round bronze mirror on a carved wooden stand — it shows what a thing really is
    const [x, y, r] = BALL; castShadow(g, x + 40, 622, 90, 11, 0.45);
    g.fillStyle = '#3A2410'; g.beginPath(); g.moveTo(x - 60, 622); g.lineTo(x - 40, 600); g.lineTo(x + 40, 600); g.lineTo(x + 60, 622); g.fill();
    g.strokeStyle = '#4A2E14'; g.lineWidth = 9; g.beginPath(); g.moveTo(x - 48, 604); g.lineTo(x - 20, y + r - 6); g.moveTo(x + 48, 604); g.lineTo(x + 20, y + r - 6); g.stroke();
    sphere(g, x, y, r + 7, '#E8C878', '#8A6428', '#2A1A08', -0.4, -0.4);
    sphere(g, x, y, r, '#8A7458', '#3A2E22', '#120E0A', -0.2, -0.3);
    g.strokeStyle = 'rgba(255,230,170,0.5)'; g.lineWidth = 1.4; for (let k = 0; k < 24; k++) { const a = k / 24 * TAU; g.beginPath(); g.moveTo(x + Math.cos(a) * (r + 2), y + Math.sin(a) * (r + 2)); g.lineTo(x + Math.cos(a) * (r + 6), y + Math.sin(a) * (r + 6)); g.stroke(); }
    g.save(); g.beginPath(); g.arc(x, y, r, 0, TAU); g.clip();
    { const tg = g.createLinearGradient(0, y + r * 0.2, 0, y + r); tg.addColorStop(0, 'rgba(90,60,34,0)'); tg.addColorStop(1, 'rgba(40,26,14,0.8)'); g.fillStyle = tg; g.fillRect(x - r, y + r * 0.2, 2 * r, r); }
    g.restore(); K.impasto(g, x - 54, y - 30, 22, -1.2);
  };
  // 枯松: a dead pine bough reaching in from the upper left, bark cracks and a few rusty needle tufts
  const BOUGH = [-30, 150, 90, 170, 210, 204, 330, 222, 450, 236, 560, 246, 650, 232, 720, 200];
  const bough = g => {
    const sp = XY.RIG.spline(BOUGH, false, 6), rib = XY.RIG.ribbon(sp, 46, 10);
    XY.path(g, rib, true); g.fillStyle = '#2A1C10'; g.fill();
    g.strokeStyle = 'rgba(190,150,96,0.55)'; g.lineWidth = 3; XY.path(g, XY.wobble(sp.map((v, i) => i % 2 ? v - 12 + i * 0.02 : v), 3, 4), false); g.stroke();
    const R = XY.rng(17); g.strokeStyle = 'rgba(8,4,2,0.7)'; g.lineWidth = 1.4;
    for (let k = 0; k < 60; k++) { const i = 2 * Math.floor(R() * (sp.length / 2 - 1)), x = sp[i], y = sp[i + 1] + (R() - 0.5) * 16; g.beginPath(); g.moveTo(x, y); g.lineTo(x + 6 + R() * 10, y + (R() - 0.5) * 3); g.stroke(); }
    [[240, 208, -1.2], [420, 232, -0.9], [640, 232, -1.6], [700, 206, -0.5], [120, 172, -1.4]].forEach(([x, y, a], j) => {
      g.strokeStyle = '#2A1C10'; g.lineWidth = 5; const tx = x + Math.cos(a) * 60, ty = y + Math.sin(a) * 60; g.beginPath(); g.moveTo(x, y); g.lineTo(tx, ty); g.stroke();
      for (let k = 0; k < 22; k++) { const b = a + (R() - 0.5) * 2.6, l = 14 + R() * 18; g.strokeStyle = R() < 0.5 ? 'rgba(120,70,30,0.8)' : 'rgba(70,44,20,0.85)'; g.lineWidth = 1.2;
        g.beginPath(); g.moveTo(tx, ty); g.lineTo(tx + Math.cos(b) * l, ty + Math.sin(b) * l); g.stroke(); } });
    g.strokeStyle = '#B9A27A'; g.lineWidth = 2.2; g.beginPath(); g.moveTo(KNOT[0] - 9, KNOT[1] - 6); g.bezierCurveTo(KNOT[0] - 12, KNOT[1] + 14, KNOT[0] + 12, KNOT[1] + 14, KNOT[0] + 9, KNOT[1] - 6); g.stroke();
  };
  const cloth = g => {   // an indigo bundle-cloth (包袱布) with white resist flowers, pushed back, its fall over the front edge
    const top = [0, 588, 80, 572, 170, 592, 240, 580, 330, 600, 392, 640, 420, 702, 0, 702];
    XY.path(g, XY.RIG.spline(top, true, 5), true); let gr = g.createLinearGradient(0, 570, 420, 700); gr.addColorStop(0, '#4E6A96'); gr.addColorStop(0.5, '#2E4670'); gr.addColorStop(1, '#16223A'); g.fillStyle = gr; g.fill();
    { const R = XY.rng(61); g.fillStyle = 'rgba(236,236,226,0.55)'; for (let k = 0; k < 70; k++) { const x = R() * 400, y = 590 + R() * 108; if (y < 600 - x * 0.05 || x > 380 + (y - 640)) continue; for (let q = 0; q < 5; q++) { const a = q / 5 * TAU; g.beginPath(); g.arc(x + Math.cos(a) * 3, y + Math.sin(a) * 2, 1.6, 0, TAU); g.fill(); } } }
    [[60, 590, 120, 700], [150, 596, 230, 700], [260, 600, 330, 700], [330, 610, 390, 690]].forEach(([x0, y0, x1, y1], k) => {
      gr = g.createLinearGradient(x0 - 20, 0, x0 + 20, 0); gr.addColorStop(0, 'rgba(110,112,108,0)'); gr.addColorStop(0.5, 'rgba(70,72,70,0.5)'); gr.addColorStop(1, 'rgba(110,112,108,0)');
      g.fillStyle = gr; g.beginPath(); g.moveTo(x0 - 16, y0); g.quadraticCurveTo(x0 + 10, (y0 + y1) / 2, x1 - 10, y1); g.lineTo(x1 + 18, y1); g.quadraticCurveTo(x0 + 30, (y0 + y1) / 2, x0 + 14, y0); g.fill(); });
    gr = g.createLinearGradient(0, 702, 0, 780); gr.addColorStop(0, '#3A5682'); gr.addColorStop(1, '#121A2C'); g.fillStyle = gr;
    g.beginPath(); g.moveTo(0, 702); g.lineTo(404, 702); for (let x = 404; x >= 0; x -= 12) g.lineTo(x, 780 + 6 * Math.sin(x / 20)); g.fill();
    for (let k = 0; k < 9; k++) { const x = 24 + k * 44 + 8 * Math.sin(k * 2.3); gr = g.createLinearGradient(x - 14, 0, x + 14, 0); gr.addColorStop(0, 'rgba(60,62,60,0)'); gr.addColorStop(0.5, 'rgba(60,62,60,0.35)'); gr.addColorStop(1, 'rgba(60,62,60,0)'); g.fillStyle = gr; g.fillRect(x - 14, 704, 28, 76); }
    g.strokeStyle = 'rgba(200,214,236,0.5)'; g.lineWidth = 1.5; g.beginPath(); g.moveTo(0, 703); g.lineTo(404, 703); g.stroke();
    { const R = XY.rng(62); g.fillStyle = 'rgba(230,232,224,0.45)'; for (let k = 0; k < 40; k++) { const x = 10 + R() * 380, y = 712 + R() * 56; for (let q = 0; q < 5; q++) { const a = q / 5 * TAU; g.beginPath(); g.arc(x + Math.cos(a) * 3, y + Math.sin(a) * 2.4, 1.6, 0, TAU); g.fill(); } } }
  };

  // a rolled bamboo blind (竹帘) at the top right, its cords hanging; a faint shaft of window light on the wall
  const curtain = (g, W) => {
    let gr = g.createLinearGradient(0, 0, 700, 600); gr.addColorStop(0, 'rgba(255,236,190,0.07)'); gr.addColorStop(1, 'rgba(255,236,190,0)');
    g.fillStyle = gr; g.beginPath(); g.moveTo(80, 0); g.lineTo(330, 0); g.lineTo(760, BACK); g.lineTo(420, BACK); g.fill();
    const x0 = W - 300; g.fillStyle = '#3A2A14'; g.fillRect(x0, 0, 300, 120);
    for (let y = 2; y < 120; y += 5) { g.fillStyle = (y / 5) % 2 ? '#6A5028' : '#5A4220'; g.fillRect(x0, y, 300, 3.4); }
    g.strokeStyle = 'rgba(20,12,6,0.6)'; g.lineWidth = 1; for (let x = x0 + 30; x < W; x += 60) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, 120); g.stroke(); }
    gr = g.createLinearGradient(0, 112, 0, 152); gr.addColorStop(0, '#8A6A38'); gr.addColorStop(0.5, '#5A4220'); gr.addColorStop(1, '#2A1C0C'); g.fillStyle = gr; g.fillRect(x0 - 6, 112, 312, 40);
    g.strokeStyle = '#8A2A1A'; g.lineWidth = 2.4; [x0 + 50, W - 50].forEach(x => { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, 196); g.stroke(); g.fillStyle = '#A8301E'; g.beginPath(); g.moveTo(x - 6, 196); g.lineTo(x + 6, 196); g.lineTo(x + 3, 226); g.lineTo(x - 3, 226); g.fill(); });
  };

  XY.STYLES.dutchstill = {
    hits: [4.4],
    bg(g, W, H) {
      const wall = K.texture(W, BACK + 4, 3, (x, y) => { const l = Math.exp(-Math.pow((x - 250) / 560, 2) - Math.pow((y - 120) / 430, 2)), n = XY.fbm(x / 90, y / 90, 3, 4), m = XY.clamp(l * 0.9 + n * 0.1);
        return [20 + 92 * m, 16 + 74 * m, 11 + 48 * m, 255]; });
      g.imageSmoothingQuality = 'high'; g.drawImage(wall, 0, 0, W, BACK + 4); curtain(g, W);
      // table top (receding), its front face, the gold-brown moulding that meets the gallery line
      let gr = g.createLinearGradient(0, BACK, 0, GY); gr.addColorStop(0, '#2C1E12'); gr.addColorStop(1, '#5A3E24'); g.fillStyle = gr; g.fillRect(0, BACK, W, GY - BACK);
      gr = g.createLinearGradient(0, 0, W, 0); gr.addColorStop(0, 'rgba(255,220,160,0.12)'); gr.addColorStop(0.6, 'rgba(0,0,0,0)'); gr.addColorStop(1, 'rgba(0,0,0,0.35)'); g.fillStyle = gr; g.fillRect(0, BACK, W, GY - BACK);
      g.save(); g.translate(0, BACK); g.beginPath(); g.rect(0, 0, W, GY - BACK); g.clip(); K.grain(g, W, GY - BACK, 3, 500, 'rgba(20,10,4,0.25)', 'rgba(200,150,90,0.08)', 40); g.restore();
      g.fillStyle = '#1C1209'; g.fillRect(0, GY, W, 780 - GY); g.fillStyle = '#7A5A30'; g.fillRect(0, GY, W, 4); g.fillStyle = 'rgba(0,0,0,0.5)'; g.fillRect(0, GY + 4, W, 6);
      g.fillStyle = 'rgba(160,120,70,0.25)'; g.fillRect(0, GY + 24, W, 2);
      g.strokeStyle = 'rgba(160,120,80,0.35)'; g.lineWidth = 1.2; g.beginPath(); g.moveTo(0, BACK); g.lineTo(W, BACK); g.stroke();
      bough(g); cloth(g); gourd(g); buns(g); fruit(g); almsBowl(g); mirror(g); candlestick(g);
      // oil paint: loaded strokes over everything in its own colours, a transparent brown glaze pooling in the shadows
      K.brush(g, W, H, 5200, 281, { len: [5, 16], w: [1.4, 3.6], alpha: 0.42, jit: 18, dir: (x, y) => y > BACK ? 0.05 * Math.sin(x / 40) : XY.noise2(x / 160, y / 160, 9) * 2.4 });
      const gl = g.createLinearGradient(W * 0.2, 0, W, H); gl.addColorStop(0, 'rgba(90,50,18,0)'); gl.addColorStop(1, 'rgba(90,50,18,0.22)'); g.fillStyle = gl; g.fillRect(0, 0, W, H);
      g.fillStyle = 'rgba(214,180,120,0.55)'; g.font = XY.font(26, '"Times New Roman", serif', 'italic'); g.fillText('XXVIII', 560, GY + 40);
    },
    draw(g, e) {
      // v10 script: beats 0–1.5 the candle catches; 1.5–4 the child cries for help, 唐僧 is moved, 悟空 stares at the mirror (a red flicker at 3.4);
      // 4.4 the mirror shows 红孩儿 in fire, the candle turns red, the child smirks (pushed in on the mirror); 6–8 embers, he cries again
      const { W, H, t, u, beat } = e, HIT = 4.4, lit = XY.smooth(beat / 0.9), mem = beat >= HIT ? Math.exp(-(beat - HIT) * 1.1) : 0, fire = beat >= HIT ? 1 - 0.6 * XY.smooth((beat - 5.2) / 1.6) : K.pulse(beat, 3.4, 0.35) * 0.5;
      const red = XY.clamp(0.35 * XY.smooth((beat - 2) / 2.2) + (beat >= HIT ? 0.65 : 0));
      const acts = { wukong: { shade: K.win(beat, 3.0, 3.6) * (1 - K.win(beat, 5.6, 6.2)), raise: K.win(beat, 5.6, 6.2) * (1 - K.win(beat, 7.2, 7.8)) },
        monk: { palm: K.win(beat, 2.4, 3.2) * (1 - K.win(beat, 6.6, 7.4)) }, bajie: { scratch: K.win(beat, 6.2, 6.8) } };
      // the dim room before the candle catches; the candle's warm pool after
      if (lit < 1) { g.fillStyle = `rgba(6,4,2,${0.42 * (1 - lit)})`; g.fillRect(0, 0, W, H); }
      const fl = 0.8 + 0.2 * XY.noise1(t * 9, 3) + 0.3 * K.pulse(u, 0.0, 0.1);
      if (lit > 0) { g.save(); g.globalCompositeOperation = 'screen';
        const rg = g.createRadialGradient(CANDLE[0], CANDLE[1] - 10, 4, CANDLE[0], CANDLE[1], 520); const rr = Math.round(XY.lerp(150, 190, red)), gg = Math.round(XY.lerp(100, 40, red));
        rg.addColorStop(0, `rgba(${rr},${gg},30,${0.55 * lit * fl})`); rg.addColorStop(0.3, `rgba(${rr},${gg},20,${0.16 * lit * fl})`); rg.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = rg; g.fillRect(0, 0, W, H); g.restore(); }
      child(g, t, beat, HIT);
      reflection(g, t, beat, fire, lit, HIT);
      // cast shadow of the procession across the table top (light from the upper left), then the lit procession
      const Gd = GY * e.S, sh = K.sil(e, '#000', acts);
      g.save(); g.setTransform(1, 0, -0.8, 0.2, 0.8 * Gd, 0.8 * Gd); g.globalAlpha = 0.32; g.drawImage(sh.cv, sh.X, sh.Y); g.restore();
      const rim = `rgba(255,${Math.round(XY.lerp(170, 70, red))},${Math.round(XY.lerp(80, 30, red))},${0.55 * lit})`;
      K.put(g, K.lit(e, PEN, acts, { bands: [[-13, -10, 'rgba(12,7,3,0.55)', 4], [-2.5, 0, rim], [4, 4, 'rgba(255,236,196,0.4)', 2]], atop: gl => { const gr = gl.createLinearGradient(0, GY - 300, 0, GY); gr.addColorStop(0, 'rgba(255,230,180,0.08)'); gr.addColorStop(0.55, 'rgba(0,0,0,0)'); gr.addColorStop(1, 'rgba(14,8,2,0.45)'); gl.fillStyle = gr; gl.fillRect(e.procX - 420, GY - 320, 780, 340); } }));
      flame(g, t, fl, red, lit);
      foreground(g, t, beat);
      fly(g, t, beat, HIT);
      if (mem > 0) { g.save(); g.globalCompositeOperation = 'screen'; const rg = g.createRadialGradient(BALL[0], BALL[1], 20, BALL[0], BALL[1], 700);
        rg.addColorStop(0, `rgba(255,70,20,${0.55 * mem})`); rg.addColorStop(1, 'rgba(120,10,0,0)'); g.fillStyle = rg; g.fillRect(0, 0, W, H); g.restore(); }
      K.zoom(g, e, BALL[0], BALL[1] + 20, 1 + 0.14 * K.env(beat, 4.15, 4.6, 5.7, 6.5));
      g.drawImage(overlay(W, H, e.S), 0, 0, W, H);
    },
  };

  // 红孩儿 disguised: a naked child in a red bib, wrists tied overhead, swinging on the cord
  function child(g, t, beat, HIT) {
    const fight = 1 + 1.5 * K.env(beat, 1.5, 2, 3.6, 4.2), sw = (0.06 * Math.sin(t * 2.4) + 0.025 * Math.sin(t * 5.1)) * fight, kick = Math.sin(t * 7.3 * fight), sly = beat >= HIT && beat < 6.2;
    g.save(); g.translate(KNOT[0], KNOT[1]); g.rotate(sw); g.scale(1.22, 1.22);
    g.strokeStyle = '#B9A27A'; g.lineWidth = 2.2; g.beginPath(); g.moveTo(0, 0); g.lineTo(2, 124); g.stroke();   // the cord runs to a loop round his chest
    const skin = (x, y, r) => sphere(g, x, y, r, '#FBE2C6', '#E2A884', '#8A4E36');
    g.lineCap = 'round'; g.strokeStyle = '#C89070'; g.lineWidth = 8; g.beginPath(); g.moveTo(-12, 124); g.lineTo(-18, 150); g.lineTo(-8, 160); g.moveTo(12, 124); g.lineTo(18, 150); g.lineTo(8, 160); g.stroke();   // hands bound behind
    // legs (kicking), torso, head
    g.strokeStyle = '#E2A884'; g.lineWidth = 11; g.beginPath(); g.moveTo(-7, 166); g.lineTo(-12 + 5 * kick, 200); g.moveTo(7, 166); g.lineTo(13 - 6 * kick, 198 + 2 * kick); g.stroke();
    skin(-12 + 5 * kick, 203, 6); skin(13 - 6 * kick, 201 + 2 * kick, 6);
    g.save(); g.beginPath(); g.ellipse(0, 146, 18, 26, 0, 0, TAU); g.clip(); skin(-4, 140, 30); g.restore();
    g.fillStyle = '#B3201A'; g.beginPath(); g.moveTo(0, 122); g.lineTo(-17, 142); g.lineTo(0, 174); g.lineTo(17, 142); g.closePath(); g.fill();
    g.strokeStyle = '#D9A440'; g.lineWidth = 1.6; g.stroke(); g.fillStyle = 'rgba(255,160,120,0.35)'; g.beginPath(); g.moveTo(0, 124); g.lineTo(-12, 140); g.lineTo(0, 150); g.fill();
    g.fillStyle = '#D9A440'; g.beginPath(); g.arc(0, 146, 3.2, 0, TAU); g.fill();
    g.strokeStyle = '#B9A27A'; g.lineWidth = 2.4; [128, 135].forEach(yy => { g.beginPath(); g.ellipse(0, yy, 19, 4, 0.06, 0, TAU); g.stroke(); });
    skin(0, 106, 16.5);
    // shaven crown with a forelock and two tiny topknots (抓髻) above, flushed cheeks
    g.fillStyle = '#20160E'; g.beginPath(); g.arc(0, 106, 16.8, Math.PI * 1.08, Math.PI * 1.92); g.quadraticCurveTo(0, 96, -16, 102); g.fill();
    [[-7, 90, -0.4], [7, 90, 0.4]].forEach(([x, y, r]) => { g.save(); g.translate(x, y); g.rotate(r); g.beginPath(); g.moveTo(-3.4, 0); g.quadraticCurveTo(-3, -7, 0, -11); g.quadraticCurveTo(3, -7, 3.4, 0); g.fill(); g.fillStyle = '#B3201A'; g.fillRect(-3, -2, 6, 2.4); g.fillStyle = '#20160E'; g.restore(); });
    g.fillStyle = 'rgba(230,90,80,0.35)'; g.beginPath(); g.arc(-10, 111, 4, 0, TAU); g.arc(10, 111, 4, 0, TAU); g.fill();
    g.strokeStyle = '#2A1810'; g.lineWidth = 1.5; g.lineCap = 'round';
    if (sly) {   // the true face for a moment: brows down, eyes sliding toward the glass ball, a smirk
      g.beginPath(); g.moveTo(-11, 99); g.lineTo(-3, 102); g.moveTo(11, 99); g.lineTo(3, 102); g.stroke();
      g.fillStyle = '#FFF6E8'; g.beginPath(); g.ellipse(-6, 106, 3.6, 2.4, 0, 0, TAU); g.ellipse(6, 106, 3.6, 2.4, 0, 0, TAU); g.fill();
      g.fillStyle = '#1A0E08'; g.beginPath(); g.arc(-4, 106, 1.8, 0, TAU); g.arc(8, 106, 1.8, 0, TAU); g.fill();
      g.beginPath(); g.moveTo(-6, 115); g.quadraticCurveTo(1, 119, 8, 112); g.stroke(); }
    else {       // crying: brows up, eyes squeezed shut, mouth wide, tears running
      g.beginPath(); g.moveTo(-11, 101); g.lineTo(-4, 99); g.moveTo(11, 101); g.lineTo(4, 99); g.stroke();
      g.beginPath(); g.arc(-6, 104, 3.4, Math.PI + 0.3, -0.3); g.moveTo(9.4, 104); g.arc(6, 104, 3.4, Math.PI + 0.3, -0.3); g.stroke();
      g.fillStyle = '#5A1610'; g.beginPath(); g.ellipse(0, 115, 4.4, 4.2 + 1.2 * Math.sin(t * 9), 0, 0, TAU); g.fill(); g.fillStyle = '#C24A40'; g.beginPath(); g.ellipse(0, 117.5, 2.6, 1.4, 0, 0, TAU); g.fill();
      g.fillStyle = 'rgba(220,236,255,0.85)'; [-8, 8].forEach((x, k) => { g.beginPath(); g.arc(x + k * 0.5, 108 + ((t * 26 + k * 7) % 14), 1.7, 0, TAU); g.fill(); }); }
    g.restore();
  }
  // the convex glass ball: the window, the child small and upside-right — then his true self wreathed in fire
  function reflection(g, t, beat, fire, lit, HIT) {
    const [x, y, r] = BALL;
    g.save(); g.beginPath(); g.arc(x, y, r - 1, 0, TAU); g.clip();
    g.save(); g.translate(x - 44, y - 50); g.rotate(-0.25); g.fillStyle = `rgba(255,248,226,${0.55 + 0.25 * lit})`;
    [[0, 0], [17, 0], [0, 21], [17, 21]].forEach(([a, b]) => { g.beginPath(); g.moveTo(a, b); g.lineTo(a + 14, b + 1); g.lineTo(a + 13, b + 19); g.lineTo(a - 1, b + 18); g.fill(); }); g.restore();
    if (beat < HIT) {   // the child as the mirror sees it: tiny, pink, on his cord
      g.save(); g.translate(x - 56, y - 30); g.rotate(0.3 + 0.05 * Math.sin(t * 2.4)); g.strokeStyle = 'rgba(200,180,140,0.6)'; g.lineWidth = 1; g.beginPath(); g.moveTo(0, -30); g.lineTo(0, 0); g.stroke();
      g.fillStyle = '#E8B898'; g.beginPath(); g.arc(0, 6, 5, 0, TAU); g.fill(); g.fillStyle = '#B3201A'; g.beginPath(); g.moveTo(0, 11); g.lineTo(-5, 18); g.lineTo(0, 26); g.lineTo(5, 18); g.fill(); g.restore();
      if (fire > 0) { g.globalCompositeOperation = 'lighter'; g.fillStyle = `rgba(255,70,20,${0.7 * fire})`; g.fillRect(x - r, y - r, 2 * r, 2 * r); g.globalCompositeOperation = 'source-over'; }
    } else {
      g.save(); g.globalCompositeOperation = 'lighter';
      for (let k = 0; k < 11; k++) { const fx = x - r + (k + 0.5) * (2 * r / 11), h = r * (0.8 + 0.6 * XY.hash(k, 3)) * (0.75 + 0.25 * Math.sin(t * 13 + k * 2.1)) * fire, w = 16 + 10 * XY.hash(k, 4);
        const gr = g.createLinearGradient(0, y + r, 0, y + r - h * 1.6); gr.addColorStop(0, `rgba(255,220,120,${0.9 * fire})`); gr.addColorStop(0.45, `rgba(240,70,20,${0.75 * fire})`); gr.addColorStop(1, 'rgba(120,0,0,0)');
        g.fillStyle = gr; g.beginPath(); g.moveTo(fx - w, y + r); g.quadraticCurveTo(fx - w * 0.6, y + r - h, fx + 6 * Math.sin(t * 9 + k), y + r - h * 1.6); g.quadraticCurveTo(fx + w * 0.6, y + r - h, fx + w, y + r); g.fill(); }
      g.restore();
      // 红孩儿's silhouette in the flames: topknots, war skirt, the fire-tipped spear (火尖枪)
      g.save(); g.translate(x - 4, y + 38); g.fillStyle = `rgba(30,6,2,${0.92 * Math.min(1, fire * 1.4)})`;
      g.beginPath(); g.arc(0, -64, 13, 0, TAU); g.fill(); [[-8, -74, -0.5], [0, -77, 0], [8, -74, 0.5]].forEach(([hx, hy, ha]) => { g.save(); g.translate(hx, hy); g.rotate(ha + 0.15 * Math.sin(t * 11 + hx)); g.beginPath(); g.moveTo(-5, 2); g.quadraticCurveTo(-4, -10, 0, -20); g.quadraticCurveTo(4, -10, 5, 2); g.fill(); g.restore(); });
      g.beginPath(); g.moveTo(-12, -52); g.lineTo(12, -52); g.lineTo(16, -18); g.lineTo(26, 6); g.lineTo(-26, 6); g.lineTo(-16, -18); g.closePath(); g.fill();
      g.lineCap = 'round'; g.strokeStyle = g.fillStyle; g.lineWidth = 7; g.beginPath(); g.moveTo(-10, 4); g.lineTo(-22, 40); g.moveTo(10, 4); g.lineTo(24, 38); g.moveTo(12, -46); g.lineTo(34, -34); g.stroke();
      g.lineWidth = 3.4; g.beginPath(); g.moveTo(-40, 30); g.lineTo(58, -80); g.stroke();
      g.fillStyle = `rgba(255,200,90,${fire})`; g.beginPath(); g.moveTo(58, -80); g.quadraticCurveTo(70, -100, 64, -116); g.quadraticCurveTo(54, -96, 50, -90); g.closePath(); g.fill();
      g.fillStyle = `rgba(255,236,160,${fire})`; g.beginPath(); g.arc(4, -66, 1.8, 0, TAU); g.arc(-4, -66, 1.8, 0, TAU); g.fill();
      g.restore();
    }
    g.restore();
    g.strokeStyle = 'rgba(255,246,220,0.35)'; g.lineWidth = 2; g.beginPath(); g.arc(x, y, r - 3, Math.PI * 0.95, Math.PI * 1.45); g.stroke();
    spec(g, x - 30, y - 62, 9, 0.9);
  }
  function flame(g, t, fl, red, lit) {
    const [x, y] = CANDLE;
    if (lit <= 0) { g.strokeStyle = 'rgba(200,190,170,0.25)'; g.lineWidth = 1.2; g.beginPath(); g.moveTo(x + 1, y + 2); for (let k = 1; k < 12; k++) g.lineTo(x + 1 + 6 * XY.noise1(k * 0.4 - t * 1.5, 2), y + 2 - k * 12); g.stroke(); return; }
    const h = (34 + 8 * XY.noise1(t * 7, 5)) * lit * (0.9 + 0.2 * fl), lean = 3 * XY.noise1(t * 4, 9), c = (a, b) => Math.round(XY.lerp(a, b, red));
    g.save(); g.globalCompositeOperation = 'screen';
    let rg = g.createRadialGradient(x, y - h * 0.4, 2, x, y - h * 0.4, 90); rg.addColorStop(0, `rgba(255,${c(210, 90)},${c(120, 40)},0.5)`); rg.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = rg; g.fillRect(x - 90, y - h - 90, 180, 200);
    g.restore();
    rg = g.createRadialGradient(x, y - h * 0.25, 1, x, y - h * 0.45, h * 0.75);
    rg.addColorStop(0, `rgb(255,${c(252, 214)},${c(236, 150)})`); rg.addColorStop(0.45, `rgb(255,${c(196, 70)},${c(90, 30)})`); rg.addColorStop(1, `rgba(${c(220, 170)},${c(90, 10)},20,0)`);
    g.fillStyle = rg; g.beginPath(); g.moveTo(x - 7, y); g.quadraticCurveTo(x - 9, y - h * 0.5, x + lean, y - h); g.quadraticCurveTo(x + 9, y - h * 0.5, x + 7, y); g.quadraticCurveTo(x, y + 6, x - 7, y); g.fill();
    g.fillStyle = 'rgba(40,60,120,0.45)'; g.beginPath(); g.ellipse(x, y - 2, 3, 5, 0, 0, TAU); g.fill();
    if (red > 0.5) { g.strokeStyle = 'rgba(60,40,30,0.3)'; g.lineWidth = 1.4; g.beginPath(); g.moveTo(x + lean, y - h); for (let k = 1; k < 10; k++) g.lineTo(x + lean + 8 * XY.noise1(k * 0.5 - t * 2, 4), y - h - k * 14); g.stroke(); }
  }
  // near layer: a half-peeled mandarin, its peel hanging over the edge; the 木鱼 and its mallet jutting out; the travel pass
  function foreground(g, t) {
    castShadow(g, 384, 700, 60, 8, 0.6);
    sphere(g, 352, 676, 32, '#FFC870', '#E07818', '#5A2A04'); g.fillStyle = 'rgba(120,50,10,0.35)'; for (let k = 0; k < 30; k++) g.fillRect(330 + XY.hash(k, 1) * 44, 656 + XY.hash(k, 2) * 36, 1.6, 1.6);
    g.save(); g.beginPath(); g.ellipse(372, 668, 20, 18, 0, 0, TAU); g.clip(); sphere(g, 372, 666, 22, '#FFE8B0', '#F2B860', '#A86A20');
    g.strokeStyle = 'rgba(255,246,220,0.8)'; g.lineWidth = 1.4; for (let k = 0; k < 8; k++) { const a = k / 8 * TAU; g.beginPath(); g.moveTo(372, 666); g.lineTo(372 + Math.cos(a) * 20, 666 + Math.sin(a) * 18); g.stroke(); } g.restore();
    K.impasto(g, 336, 660, 12, -0.9);
    const sw = 0.06 * Math.sin(t * 1.7);   // three peel petals over the edge, swaying a little
    [[392, 690, 0.25], [404, 694, 0.75], [384, 696, -0.2]].forEach(([x, y, a], k) => { g.save(); g.translate(x, y); g.rotate(a + sw * (k + 1));
      g.fillStyle = '#E8801C'; g.beginPath(); g.moveTo(-7, 0); g.quadraticCurveTo(-12, 34, 0, 58); g.quadraticCurveTo(12, 34, 7, 0); g.fill();
      g.fillStyle = 'rgba(255,240,214,0.85)'; g.beginPath(); g.moveTo(-4, 2); g.quadraticCurveTo(-7, 30, 0, 50); g.quadraticCurveTo(3, 30, 2, 2); g.fill(); g.restore(); });
    // 木鱼 on the table, its mallet laid so the handle reaches out over the edge toward us
    castShadow(g, 760, 700, 70, 7, 0.5);
    sphere(g, 720, 676, 26, '#C87A3A', '#7A3A14', '#2A1006'); g.fillStyle = '#1A0A04'; g.beginPath(); g.ellipse(728, 680, 14, 3, 0.1, 0, TAU); g.fill(); K.impasto(g, 704, 664, 10, -0.7);
    g.fillStyle = '#5A2E14'; g.beginPath(); g.moveTo(752, 690); g.lineTo(880, 706); g.lineTo(878, 714); g.lineTo(750, 698); g.closePath(); g.fill(); sphere(g, 748, 692, 9, '#B87A44', '#6A3A16', '#2A1206');
    g.strokeStyle = 'rgba(220,170,110,0.45)'; g.lineWidth = 1.4; g.beginPath(); g.moveTo(756, 692); g.lineTo(876, 707); g.stroke();
    g.fillStyle = 'rgba(0,0,0,0.35)'; g.beginPath(); g.moveTo(800, 714); g.lineTo(884, 726); g.lineTo(884, 732); g.lineTo(800, 720); g.fill();
    // 通关文牒 hanging below the table edge in the corner, out of the walking band: 号山 in a seal-red frame
    g.save(); g.translate(1004, 708); g.rotate(-0.02);
    let gr = g.createLinearGradient(0, 0, 0, 58); gr.addColorStop(0, '#EAE0C4'); gr.addColorStop(1, '#B8A884'); g.fillStyle = gr;
    g.beginPath(); g.moveTo(0, 0); g.lineTo(150, 0); g.quadraticCurveTo(154, 30, 148, 58); g.lineTo(4, 59); g.quadraticCurveTo(-4, 30, 0, 0); g.fill();
    g.strokeStyle = 'rgba(150,40,30,0.7)'; g.lineWidth = 1.6; g.strokeRect(8, 5, 134, 48);
    g.fillStyle = '#3A2414'; g.font = XY.font(48, XY.cnFont.song, 'bold'); g.textBaseline = 'alphabetic'; g.fillText('号山', 26, 49);
    g.fillStyle = 'rgba(170,30,24,0.8)'; g.fillRect(122, 30, 14, 14); g.restore();
    g.fillStyle = 'rgba(0,0,0,0.4)'; g.fillRect(1004, 706, 154, 3);
  }
  function fly(g, t, beat, HIT) {
    const s = (t * 0.07) % 1, off = beat >= HIT ? XY.easeOut((beat - HIT) / 1.2) : 0;
    const x = 110 + 200 * s + off * 300 + 14 * Math.sin(beat * 9) * off, y = 650 + 16 * Math.sin(s * 9) - off * 320 + 8 * Math.cos(beat * 11) * off;
    g.save(); g.translate(x, y); g.rotate(0.4 + 6 * s);
    g.fillStyle = 'rgba(210,220,230,0.45)'; g.beginPath(); g.ellipse(-2, -4, 6, 3, -0.6 + (off > 0 ? Math.sin(t * 90) : 0), 0, TAU); g.ellipse(-2, 4, 6, 3, 0.6, 0, TAU); g.fill();
    g.fillStyle = '#14100C'; g.beginPath(); g.ellipse(0, 0, 6, 3.4, 0, 0, TAU); g.fill(); g.fillStyle = '#5A1A10'; g.beginPath(); g.arc(5, 0, 2.2, 0, TAU); g.fill();
    g.restore();
  }
  // the varnished-canvas skin over everything: weave, craquelure, amber varnish, tenebrous edges, ebony ripple frame
  function overlay(W, H, S) {
    return XY.cached('kd28-ov:' + S.toFixed(4), W * S, H * S, cv => { const g = cv.getContext('2d'); g.setTransform(S, 0, 0, S, 0, 0);
      K.weave(g, W, H, 3, 'rgba(255,236,200,0.035)'); K.grain(g, W, H, 9, 2600, 'rgba(0,0,0,0.06)', 'rgba(255,240,200,0.04)', 3);
      K.cracks(g, W, H, 28, 300, 'rgba(12,8,4,0.06)', 0.5);
      g.fillStyle = 'rgba(150,108,30,0.06)'; g.fillRect(0, 0, W, H);
      const vg = g.createRadialGradient(W * 0.45, H * 0.48, 220, W * 0.5, H * 0.5, W * 0.66); vg.addColorStop(0, 'rgba(6,4,2,0)'); vg.addColorStop(1, 'rgba(6,4,2,0.6)'); g.fillStyle = vg; g.fillRect(0, 0, W, H);
      g.fillStyle = '#0C0907'; g.fillRect(0, 0, W, 12); g.fillRect(0, H - 12, W, 12); g.fillRect(0, 0, 12, H); g.fillRect(W - 12, 0, 12, H);
      g.strokeStyle = 'rgba(255,236,200,0.16)'; g.lineWidth = 1;
      for (let x = 2; x < W; x += 5) { g.beginPath(); g.moveTo(x, 2); g.lineTo(x + 2, 10); g.moveTo(x, H - 10); g.lineTo(x + 2, H - 2); g.stroke(); }
      for (let y = 2; y < H; y += 5) { g.beginPath(); g.moveTo(2, y); g.lineTo(10, y + 2); g.moveTo(W - 10, y); g.lineTo(W - 2, y + 2); g.stroke(); }
      g.strokeStyle = 'rgba(200,160,90,0.4)'; g.lineWidth = 1.5; g.strokeRect(12.5, 12.5, W - 25, H - 25);
    });
  }
})();
