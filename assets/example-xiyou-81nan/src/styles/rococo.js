// 30 洛可可 · 心猿遭害 — a Boucher-pink sky, feathery blue-green trees, 火云洞 as a shell grotto with 唐僧 bound inside,
// five gilded toy carts (金木水火土). 红孩儿 on the fire cart punches his nose and breathes 三昧真火 as rococo scrolls;
// on beat 3 the curls reach 悟空, who turns soot-black from head to foot and steams as he wades the cold brook.
(() => {
  'use strict';
  const XY = window.XY, K = XY.KIT_D, TAU = XY.TAU;
  const GY = 702, BOY = [520, 560], GROT = [1040, 700];
  const hex = h => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
  const mixc = (a, b, u) => { const A = hex(a), B = hex(b); return `rgb(${A.map((v, i) => Math.round(v + (B[i] - v) * u)).join(',')})`; };
  const COL = { fur: '#B08458', face: '#F6DCC4', wkshirt: '#E27A6A', tiger: '#EEC27A', stripe: '#6A4A3A', gold: '#E8C878', staff: '#D0645A', ink: '#4A3436',
    horse: '#FBF4EE', horse2: '#E6D8D4', mane: '#F2E6E2', hoof: '#7A6460', saddle: '#9AB8C8', red: '#E07A78', robe: '#F2D89A', kasaya: '#E06A68',
    skin: '#F8E0CC', metal: '#D8B870', bjrobe: '#5A6478', bjpants: '#4A5266', pig: '#F8C8C4', pig2: '#EAA4A2', wood: '#B08A62',
    ssrobe: '#7AA0C0', ssrobe2: '#6488AA', skin2: '#D8AA88', ssh: '#D0705A', ssbeard: '#B8604A', skull: '#FAF4EA', bundle: '#9CC0A0' };
  let CHAR = 0;   // 0..1 how scorched 悟空 is (figure index 3 in the rig)
  const PEN = { outline: 'rgba(130,80,80,0.32)', ow: 0.8, seed: 30, shade: 'rgba(120,90,140,0.16)',
    color: (r, p) => { const c = COL[r] || XY.DEFAULT_COLORS[r]; return CHAR > 0 && p && p._fi === 3 && r !== 'ink' ? mixc(c, r === 'gold' ? '#6A5A40' : '#2C2426', CHAR * 0.88) : c; } };

  // a rococo C-scroll: a curling stroke that thins as it rolls in, with a leafy flick
  const cscroll = (g, x, y, s, rot, flip = 1, col = '#C9A050', hi = '#FBEAB0') => {
    g.save(); g.translate(x, y); g.rotate(rot); g.scale(flip * s, s);
    const pts = []; for (let a = 0; a <= 5.2; a += 0.2) { const r = 1 - a / 6.4; pts.push(Math.cos(a) * r * 20, Math.sin(a) * r * 20); }
    g.lineCap = 'round'; g.strokeStyle = col; g.lineWidth = 5 / s; XY.path(g, pts, false); g.stroke(); g.strokeStyle = hi; g.lineWidth = 1.8 / s; XY.path(g, pts, false); g.stroke();
    g.fillStyle = col; g.beginPath(); g.moveTo(20, 0); g.quadraticCurveTo(34, -14, 46, -6); g.quadraticCurveTo(34, -2, 22, 8); g.fill();
    g.restore();
  };
  // one merged billow: a single silhouette (no seams between lobes), warm-white top to lilac underside, soft lit lobes
  const cloudMass = (g, x, y, w, h, seed, a = 1) => {
    const R = XY.rng(seed), L = [];
    for (let k = 0; k < 14; k++) { const cx = x + (R() - 0.5) * w, r = h * (0.24 + 0.22 * R()), cy = y + (R() - 0.3) * h * 0.4 - r * 0.3; L.push([cx, Math.min(cy, y + h * 0.3 - r), r]); }
    g.save(); g.globalAlpha = a; g.beginPath(); L.forEach(([cx, cy, r]) => { g.moveTo(cx + r, cy); g.arc(cx, cy, r, 0, TAU); });
    g.moveTo(x + w * 0.5 + h * 0.1, y + h * 0.08); g.ellipse(x, y + h * 0.08, w * 0.5 + h * 0.1, h * 0.2, 0, 0, TAU); g.clip();
    const gr = g.createLinearGradient(0, y - h, 0, y + h * 0.3); gr.addColorStop(0, '#FFF8F2'); gr.addColorStop(0.45, '#F6CCD0'); gr.addColorStop(1, '#C8AACC');
    g.fillStyle = gr; g.fillRect(x - w, y - h * 1.2, w * 2, h * 1.6);
    L.forEach(([cx, cy, r]) => { const hg = g.createRadialGradient(cx - r * 0.3, cy - r * 0.4, 0, cx - r * 0.3, cy - r * 0.4, r * 0.9); hg.addColorStop(0, 'rgba(255,252,248,0.75)'); hg.addColorStop(1, 'rgba(255,252,248,0)'); g.fillStyle = hg; g.fillRect(cx - r * 1.3, cy - r * 1.4, r * 2, r * 2); });
    g.restore();
  };
  // a cloud mass rendered once into a sprite and worked over with feathery strokes (Fragonard), so it is paint, not airbrush
  const cloudSprite = (S, seed) => XY.keep('kd30-cl' + seed + ':' + S.toFixed(4), 460 * S, 230 * S, cv => { const g = cv.getContext('2d'); g.setTransform(S, 0, 0, S, 0, 0);
    cloudMass(g, 230, 170, 340, 140, seed); K.brush(g, 460, 230, 700, seed + 9, { len: [8, 22], w: [2, 4.5], alpha: 0.55, jit: 26, dir: (x, y) => -0.4 + 0.7 * XY.noise2(x / 60, y / 60, seed) }); });
  // Fragonard foliage: clusters of short curved strokes, dark under, silvery on top
  const foliage = (g, x, y, r, seed, cols) => {
    const R = XY.rng(seed); g.lineCap = 'round';
    g.fillStyle = cols[0]; g.globalAlpha = 0.55; XY.path(g, XY.wobble(XY.ellipse(x, y + r * 0.1, r * 0.85, r * 0.62, 24), r * 0.25, seed, 0.02), true); g.fill(); g.globalAlpha = 1;
    for (let k = 0; k < 320; k++) { const a = R() * TAU, d = Math.sqrt(R()) * r, px = x + Math.cos(a) * d, py = y + Math.sin(a) * d * 0.8, up = (y - py) / r;
      g.strokeStyle = cols[Math.min(cols.length - 1, Math.floor(XY.clamp(0.5 + up * 0.6 + (R() - 0.5) * 0.5) * cols.length))]; g.lineWidth = 3.5 + R() * 3.5;
      const b = -0.6 + R() * 1.2; g.beginPath(); g.moveTo(px, py); g.quadraticCurveTo(px + 6, py - 4 + b * 4, px + 12 * Math.cos(b), py + 10 * Math.sin(b)); g.stroke(); }
  };
  const TREE = ['#5E7E78', '#7C9C92', '#9CB8AA', '#C8DCCC'];
  const cart = (g, x, y, col, ch) => {   // a gilded toy carriage, 金木水火土
    g.save(); g.translate(x, y);
    g.fillStyle = col; g.beginPath(); g.moveTo(-34, -10); g.quadraticCurveTo(-38, -46, -20, -58); g.quadraticCurveTo(0, -66, 20, -58); g.quadraticCurveTo(38, -46, 34, -10); g.closePath(); g.fill();
    g.strokeStyle = '#C9A050'; g.lineWidth = 3; g.stroke(); cscroll(g, -26, -30, 0.4, 0.4, 1); cscroll(g, 26, -30, 0.4, Math.PI - 0.4, -1);
    g.fillStyle = 'rgba(255,250,240,0.6)'; g.beginPath(); g.ellipse(0, -36, 14, 16, 0, 0, TAU); g.fill();
    g.fillStyle = '#8A5A3A'; g.font = XY.font(20, XY.cnFont.kai, 'bold'); g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(ch, 0, -35); g.textAlign = 'left'; g.textBaseline = 'alphabetic';
    [-22, 22].forEach(wx => { g.strokeStyle = '#C9A050'; g.lineWidth = 3; g.beginPath(); g.arc(wx, -4, 13, 0, TAU); g.stroke(); g.lineWidth = 1.4; for (let k = 0; k < 6; k++) { const a = k / 6 * Math.PI; g.beginPath(); g.moveTo(wx - Math.cos(a) * 13, -4 - Math.sin(a) * 13); g.lineTo(wx + Math.cos(a) * 13, -4 + Math.sin(a) * 13); g.stroke(); } });
    g.restore();
  };
  const CARTS = [['#F4F0E2', '金'], ['#A8CCA0', '木'], ['#A8C8E8', '水'], ['#F0A0A0', '火'], ['#E2C890', '土']];
  // 火云洞 as a rocaille grotto: tufa arch fringed with shells and dripping scrolls, a rosy glow inside
  const grotto = g => {
    const [x, y] = GROT, outer = [], inner = [];
    for (let k = 0; k <= 24; k++) { const a = Math.PI + k / 24 * Math.PI; outer.push(x + Math.cos(a) * 170 + 14 * XY.noise1(k * 0.7, 3), y - 20 + Math.sin(a) * 420 + 16 * XY.noise1(k * 0.9, 4)); inner.push(x + 8 + Math.cos(a) * 92, y + Math.sin(a) * 250); }
    outer.push(x + 175, y + 10, x - 175, y + 10);
    XY.path(g, outer, true); let gr = g.createLinearGradient(x - 170, 0, x + 170, 0); gr.addColorStop(0, '#E8D2CC'); gr.addColorStop(1, '#B89CA8'); g.fillStyle = gr; g.fill();
    { const R = XY.rng(8); for (let k = 0; k < 90; k++) { const a = Math.PI + R() * Math.PI, d = 0.6 + 0.4 * R(); g.fillStyle = R() < 0.5 ? 'rgba(150,120,140,0.35)' : 'rgba(255,246,240,0.5)'; g.beginPath(); g.arc(x + Math.cos(a) * 170 * d, y - 20 + Math.sin(a) * 420 * d, 3 + R() * 7, 0, TAU); g.fill(); } }
    XY.path(g, inner, true); gr = g.createRadialGradient(x + 8, y - 80, 10, x + 8, y - 80, 260); gr.addColorStop(0, '#E08A6A'); gr.addColorStop(0.5, '#8A4A4E'); gr.addColorStop(1, '#4A2A36'); g.fillStyle = gr; g.fill();
    for (let k = 0; k < 9; k++) { const a = Math.PI * (1.08 + k * 0.105), sx = x + 8 + Math.cos(a) * 104, sy = y + Math.sin(a) * 264;   // scallop shells round the mouth
      g.save(); g.translate(sx, sy); g.rotate(a + Math.PI / 2); g.fillStyle = k % 2 ? '#F6E4D8' : '#EAC6BE'; g.beginPath(); g.moveTo(0, 0); g.arc(0, 0, 15, Math.PI, TAU); g.fill();
      g.strokeStyle = 'rgba(180,130,120,0.8)'; g.lineWidth = 1; for (let q = 1; q < 6; q++) { const b = Math.PI + q / 6 * Math.PI; g.beginPath(); g.moveTo(0, 0); g.lineTo(Math.cos(b) * 15, Math.sin(b) * 15); g.stroke(); } g.restore(); }
    cscroll(g, x - 150, y - 300, 1.1, -0.6, 1); cscroll(g, x + 150, y - 260, 1.1, Math.PI + 0.6, -1); cscroll(g, x - 160, y - 120, 0.9, 0.3, 1);
    g.fillStyle = '#F6E8DA'; g.beginPath(); g.ellipse(x + 8, y - 290, 54, 18, 0, 0, TAU); g.fill(); g.strokeStyle = '#C9A050'; g.lineWidth = 2.4; g.stroke();
    g.fillStyle = '#9A5A4A'; g.font = XY.font(24, XY.cnFont.kai, 'bold'); g.textAlign = 'center'; g.fillText('火云洞', x + 8, y - 281); g.textAlign = 'left';
  };

  XY.STYLES.rococo = {
    hits: [4.4],
    bg(g, W, H) {
      let gr = g.createLinearGradient(0, 0, 0, GY); gr.addColorStop(0, '#A8C8E2'); gr.addColorStop(0.55, '#D8E4EE'); gr.addColorStop(1, '#F6E2DA'); g.fillStyle = gr; g.fillRect(0, 0, W, H);
      cloudMass(g, 260, 150, 380, 160, 3); cloudMass(g, 760, 110, 300, 120, 4, 0.8); cloudMass(g, 1060, 230, 260, 120, 5, 0.7);
      // far off: the rounded peaks of 号山 in lilac haze, a crooked pine on the ridge (枯松涧)
      [[600, 560, 200, 150, '#C8B8D4'], [780, 560, 170, 190, '#B8A8C8'], [430, 560, 150, 110, '#D4C8DC']].forEach(([x, y, w, h, c]) => { g.fillStyle = c; g.beginPath(); g.moveTo(x - w, y); g.bezierCurveTo(x - w * 0.5, y - h * 0.4, x - w * 0.3, y - h, x, y - h); g.bezierCurveTo(x + w * 0.3, y - h, x + w * 0.5, y - h * 0.4, x + w, y); g.fill(); });
      g.strokeStyle = '#8A7A90'; g.lineWidth = 3; g.beginPath(); g.moveTo(780, 372); g.lineTo(776, 340); g.lineTo(790, 320); g.moveTo(777, 350); g.lineTo(760, 338); g.stroke();
      foliage(g, 120, 420, 150, 11, TREE); foliage(g, 330, 470, 110, 12, TREE); foliage(g, 860, 470, 120, 13, TREE.map(c => c));
      g.strokeStyle = '#7A6250'; g.lineWidth = 9; g.beginPath(); g.moveTo(110, GY); g.quadraticCurveTo(130, 560, 116, 470); g.stroke(); g.lineWidth = 6; g.beginPath(); g.moveTo(330, GY); g.lineTo(334, 520); g.stroke();
      foliage(g, 120, 360, 120, 14, TREE);
      gr = g.createLinearGradient(0, 600, 0, H); gr.addColorStop(0, '#BCCB9C'); gr.addColorStop(1, '#8EA27A'); g.fillStyle = gr; g.beginPath(); g.moveTo(0, 630); g.quadraticCurveTo(500, 600, W, 640); g.lineTo(W, H); g.lineTo(0, H); g.fill();
      { const R = XY.rng(21); for (let k = 0; k < 140; k++) { const x = R() * W, y = 640 + R() * 130; g.fillStyle = ['#F2B8BE', '#FBF2E8', '#E8D07A', '#C8A0C8'][k % 4]; g.beginPath(); g.arc(x, y, 1.6 + R() * 2.2, 0, TAU); g.fill(); } }
      grotto(g);
      { const tp = []; for (let k = 0; k <= 20; k++) { const a = Math.PI + k / 20 * Math.PI; tp.push(470 + Math.cos(a) * 260 + 10 * XY.noise1(k, 6), 640 + Math.sin(a) * 90 + 8 * XY.noise1(k, 7)); }
        XY.path(g, tp, true); const tg = g.createLinearGradient(0, 550, 0, 640); tg.addColorStop(0, '#E2CCC8'); tg.addColorStop(1, '#B8A0AE'); g.fillStyle = tg; g.fill();
        g.fillStyle = '#A8BC8C'; g.beginPath(); g.ellipse(470, 556, 230, 14, 0, 0, TAU); g.fill(); cscroll(g, 230, 610, 1, 2.4, 1); cscroll(g, 712, 600, 1, 0.7, -1); cscroll(g, 470, 630, 0.8, 1.6, 1); }
      CARTS.forEach(([c, ch], i) => cart(g, 310 + i * 80, 560 - (i === 3 ? 0 : 3 * Math.abs(i - 3)), c, ch));
      K.brush(g, W, H, 4200, 301, { y1: 640, len: [8, 26], w: [2, 5], alpha: 0.5, jit: 20, dir: (x, y) => -0.5 + 0.9 * XY.noise2(x / 120, y / 90, 3) });
      K.weave(g, W, H, 3, 'rgba(255,255,255,0.05)');
    },
    draw(g, e) {
      const { W, H, t, u, beat } = e;
      const HIT = 4.4; CHAR = beat >= HIT ? XY.smooth((beat - HIT - 0.15) / 0.25) : 0;
      // the pink cloud banks part to open the scene, then drift
      const part = XY.smooth((u + 0.4) / 0.55);
      g.drawImage(cloudSprite(e.S, 31), 560 - 380 * part - 230, 230 + 20 * Math.sin(t * 0.6) - 170, 460, 230); g.drawImage(cloudSprite(e.S, 32), 660 + 330 * part - 230, 270 + 16 * Math.sin(t * 0.5 + 1) - 170, 460, 230);
      const acts = { wukong: { raise: K.win(beat, 1.6, 2.2) * (1 - K.win(beat, 3.2, 3.6)), strike: K.win(beat, 3.2, 3.6) * (1 - K.win(beat, 4.4, 4.7)), shade: K.win(beat, 4.6, 5) * (1 - K.win(beat, 7.2, 7.8)) },
        monk: { palm: K.win(beat, 3.6, 4.2) }, bajie: { scratch: K.win(beat, 6.2, 6.8) }, shaseng: { lift: K.win(beat, 4.4, 4.8) * (1 - K.win(beat, 6.4, 7)) } };
      // 唐僧 bound inside the grotto (his own rig parts, off the horse), a rose-gold glow flickering on him
      { const sb = K.sub(e, e.phase, acts, 2, 'rider', 'saddle'); K.paintSub(g, sb, PEN, GROT[0] - 4, 546, 0.04 * Math.sin(t * 1.3), 0.82);
        g.strokeStyle = '#A07050'; g.lineWidth = 2.6; [518, 528, 538].forEach(y => { g.beginPath(); g.ellipse(GROT[0] + 2, y, 20, 5, 0.05, 0, TAU); g.stroke(); });
        g.save(); g.globalCompositeOperation = 'screen'; const rg = g.createRadialGradient(GROT[0], 560, 10, GROT[0], 560, 140); rg.addColorStop(0, `rgba(255,150,110,${0.22 + 0.08 * Math.sin(t * 7)})`); rg.addColorStop(1, 'rgba(255,120,90,0)'); g.fillStyle = rg; g.fillRect(GROT[0] - 140, 420, 280, 280); g.restore(); }
      const head = e.at('wukong.head', acts), mouth = redBoy(g, t, beat);
      K.put(g, K.lit(e, PEN, acts, { bands: [[-6, -5, 'rgba(150,120,170,0.32)', 3], [3, 3, 'rgba(255,240,230,0.4)', 1.5]] }));
      fire(g, t, beat, mouth, head, HIT);
      if (CHAR > 0) for (let k = 0; k < 7; k++) {   // scorched: lilac smoke curling up off his head
        const age = (beat - HIT) * 1.4 + k * 0.32, s = age % 2.2, x = head[0] - 6 + 16 * Math.sin(age * 2 + k), y = head[1] - 18 - s * 70, r = 8 + s * 10, a = 0.55 * (1 - s / 2.2) * Math.min(1, (beat - HIT - 0.6) * 3);
        g.strokeStyle = `rgba(120,96,120,${a})`; g.lineWidth = 3; g.beginPath(); for (let q = 0; q < 7; q += 0.4) g.lineTo(x + Math.cos(q + k) * r * (1 - q / 9), y + Math.sin(q + k) * r * 0.7 * (1 - q / 9)); g.stroke(); }
      brook(g, t, head, beat);
      urn(g, t);
      K.zoom(g, e, head[0], head[1] + 40, 1 + 0.15 * K.env(beat, 4.1, 4.6, 5.6, 6.6));
      for (let k = 0; k < 28; k++) { const x = XY.hash(k, 1) * W + 40 * Math.sin(t * 0.9 + k), y = ((t * (30 + 20 * XY.hash(k, 2)) + XY.hash(k, 3) * 900) % 900) - 60, a = t * 2 + k;
        g.save(); g.translate(x, y); g.rotate(a); g.scale(1, 0.4 + 0.6 * Math.abs(Math.sin(a * 1.3))); g.fillStyle = k % 3 ? '#F4B4BC' : '#FBEAEA'; g.beginPath(); g.ellipse(0, 0, 6, 4, 0, 0, TAU); g.fill(); g.restore(); }
      g.drawImage(frame(W, H, e.S), 0, 0, W, H);
    },
  };

  // 红孩儿 on the fire cart: sways, punches his own nose twice (beats 1–2), then breathes. Returns the mouth point.
  // 红孩儿 on the fire cart, never still: he hops and taunts, punches his own nose twice (beats 2.2 and 2.9) so smoke
  // puffs out, rears back (3.6) and throws his whole body forward into the breath (from 4.0). Returns the mouth point.
  function redBoy(g, t, beat) {
    const x = 550, y = 502, hop = beat < 2 ? Math.abs(Math.sin(t * 5)) * 10 : 0;
    const p1 = K.pulse(beat, 2.0, 0.45), p2 = K.pulse(beat, 2.7, 0.45), punch = Math.max(p1, p2), rear = K.env(beat, 3.3, 3.8, 3.9, 4.05), thrust = K.env(beat, 3.95, 4.15, 5.6, 6.2);
    const lean = -0.32 * rear + 0.38 * thrust + 0.06 * Math.sin(t * 3), breathe = thrust > 0.1;
    g.save(); g.translate(x, y - hop); g.scale(1.25, 1.25);
    g.lineCap = 'round'; g.strokeStyle = '#F8DCC8'; g.lineWidth = 10; g.beginPath(); g.moveTo(-8, -40); g.lineTo(-20, -18); g.lineTo(-16, -2); g.moveTo(8, -40); g.lineTo(20, -20); g.lineTo(24, -2); g.stroke();
    g.rotate(lean); g.translate(0, -40);
    g.fillStyle = '#E25A50'; g.beginPath(); g.moveTo(-18, -22); g.lineTo(18, -22); g.lineTo(26, 8); g.quadraticCurveTo(0, 16, -26, 8); g.fill(); cscroll(g, -16, -2, 0.35, 0.3, 1, '#E8C878');
    g.fillStyle = '#F8DCC8'; g.beginPath(); g.ellipse(0, -38, 15, 18, 0, 0, TAU); g.fill();
    g.strokeStyle = '#F8DCC8'; g.lineWidth = 8; g.beginPath();
    if (punch > 0) { g.moveTo(12, -46); g.lineTo(28, -66); g.lineTo(16 - 12 * punch, -76); } else if (breathe) { g.moveTo(12, -46); g.lineTo(32, -40); g.lineTo(46, -30); } else { g.moveTo(12, -46); g.lineTo(30, -58 + 6 * Math.sin(t * 7)); g.lineTo(26, -78 + 8 * Math.sin(t * 7)); }
    g.moveTo(-12, -46); g.lineTo(-30, -34); g.lineTo(breathe ? -44 : -26, breathe ? -28 : -16); g.stroke();
    g.fillStyle = '#F8DCC8'; g.beginPath(); g.arc(4, -76, 15, 0, TAU); g.fill();
    g.fillStyle = '#3A2420'; g.beginPath(); g.arc(4, -76, 15.4, Math.PI * 1.05, Math.PI * 1.95); g.quadraticCurveTo(4, -84, -10, -80); g.fill();
    g.fillStyle = '#E25A50'; [[-6, -92], [6, -96], [16, -90]].forEach(([a, b], k) => { g.beginPath(); g.moveTo(a - 4, b + 4); g.quadraticCurveTo(a - 2, b - 6 - 4 * Math.sin(t * 9 + k), a + 2, b - 14); g.quadraticCurveTo(a + 4, b - 4, a + 5, b + 4); g.fill(); });
    g.fillStyle = 'rgba(240,120,120,0.4)'; g.beginPath(); g.arc(12, -70, 4, 0, TAU); g.fill();
    g.fillStyle = '#3A2420'; g.beginPath(); g.arc(10, -79, 1.8, 0, TAU); g.fill(); g.strokeStyle = '#3A2420'; g.lineWidth = 1.4; g.beginPath(); g.moveTo(6, -84); g.lineTo(13, beat > 3.3 ? -87 : -85); g.stroke();
    g.fillStyle = '#B83A3A'; g.beginPath(); g.ellipse(16, -68, breathe ? 5 : 2.2, breathe ? 4 : 1.2, 0, 0, TAU); g.fill();
    if (punch > 0.2 || (beat > 2.2 && beat < 3.6)) { g.strokeStyle = 'rgba(150,130,150,0.6)'; g.lineWidth = 2; for (let k = 0; k < 3; k++) { const q = ((beat * 2 + k * 0.33) % 1); g.beginPath(); g.arc(24 + k * 6 + q * 10, -80 - q * 30, 4 + q * 8, 0, TAU * 0.8); g.stroke(); } }
    g.restore();
    const ca = Math.cos(lean), sa = Math.sin(lean);
    return [x + 1.25 * (16 * ca + 108 * sa), y - hop + 1.25 * (16 * sa - 108 * ca)];
  }
  // 三昧真火: from beat 3.4 a rope of curling coral fire; on the hit it balloons into a rolling vermilion-and-gold fire cloud
  // that swallows 悟空 whole, holds, then breaks up into lilac smoke
  function fire(g, t, beat, M, T, HIT) {
    if (beat < 3.9 || beat > 7.4) return;
    const C = [T[0], T[1] + 40], stream = XY.clamp((beat - 3.9) / 0.5), ball = XY.easeOut((beat - HIT + 0.05) / 0.3), fade = 1 - XY.smooth((beat - 5.6) / 1.2);
    const mid = [(M[0] + C[0]) / 2 + 30, Math.min(M[1], C[1]) - 120], at = s => [XY.lerp(XY.lerp(M[0], mid[0], s), XY.lerp(mid[0], C[0], s), s), XY.lerp(XY.lerp(M[1], mid[1], s), XY.lerp(mid[1], C[1], s), s)];
    g.save();
    const sf = 1 - XY.smooth((beat - 4.8) / 0.6);
    if (sf > 0) for (let k = 0; k < 22; k++) { const s = k / 21 * stream, [x, y] = at(s), r = (12 + 34 * s) * (0.85 + 0.15 * Math.sin(t * 9 + k)) * sf;
      const gr = g.createRadialGradient(x - r * 0.3, y - r * 0.3, 0, x, y, r * 1.3); gr.addColorStop(0, 'rgba(255,240,180,0.95)'); gr.addColorStop(0.5, 'rgba(240,90,50,0.9)'); gr.addColorStop(1, 'rgba(200,40,60,0)');
      g.fillStyle = gr; g.beginPath(); g.arc(x, y, r * 1.3, 0, TAU); g.fill(); if (k % 3 === 1) cscroll(g, x, y, r / 30, t * 5 + k, k % 2 ? 1 : -1, 'rgba(200,40,30,0.7)', 'rgba(255,224,140,0.9)'); }
    if (ball > 0) { const R0 = 170 * ball;
      for (let k = 0; k < 30; k++) { const a = XY.hash(k, 1) * TAU + t * (k % 2 ? 1.6 : -1.2), d = Math.sqrt(XY.hash(k, 2)) * R0 * 0.75, r = (36 + 34 * XY.hash(k, 3)) * ball, smoke = XY.smooth((beat - 5.4 - XY.hash(k, 4) * 0.6) / 0.8);
        const x = C[0] + Math.cos(a) * d, y = C[1] + Math.sin(a) * d * 0.8 - smoke * 90 * (0.5 + XY.hash(k, 5));
        const gr = g.createRadialGradient(x - r * 0.3, y - r * 0.35, 0, x, y, r);
        if (smoke < 1) { gr.addColorStop(0, `rgba(255,236,170,${1 - smoke})`); gr.addColorStop(0.45, `rgba(232,${Math.round(60 + 40 * XY.hash(k, 6))},40,${0.95 - 0.5 * smoke})`); gr.addColorStop(1, 'rgba(180,30,50,0)'); }
        else { gr.addColorStop(0, 'rgba(190,170,200,0.55)'); gr.addColorStop(1, 'rgba(160,140,180,0)'); }
        g.fillStyle = gr; g.globalAlpha = smoke < 1 ? 1 : XY.clamp(1 - (beat - 6.4) / 1); g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill();
        if (smoke < 0.6) cscroll(g, x, y, r / 30, a * 2 + t * 3, k % 2 ? 1 : -1, 'rgba(190,40,30,0.85)', 'rgba(255,230,150,0.95)'); }
      g.globalAlpha = 1;
      const tg = 1 - XY.smooth((beat - 5.3) / 0.8);
      if (tg > 0) for (let k = 0; k < 9; k++) { const bx = C[0] + (k - 4) * 34 * ball, h = (110 + 70 * XY.hash(k, 9)) * ball * tg * (0.8 + 0.2 * Math.sin(t * 11 + k * 2)), w = 26 * ball, by = C[1] - 30 + Math.abs(k - 4) * 14;
        const gr = g.createLinearGradient(0, by, 0, by - h); gr.addColorStop(0, 'rgba(255,214,120,0.95)'); gr.addColorStop(0.5, 'rgba(236,70,40,0.9)'); gr.addColorStop(1, 'rgba(200,30,60,0)');
        g.fillStyle = gr; g.beginPath(); g.moveTo(bx - w, by); g.bezierCurveTo(bx - w, by - h * 0.5, bx + 14 * Math.sin(t * 7 + k), by - h * 0.6, bx + 18 * Math.sin(t * 5 + k), by - h); g.bezierCurveTo(bx + w * 0.4, by - h * 0.5, bx + w, by - h * 0.3, bx + w, by); g.fill(); } }
    if (beat >= HIT && beat < HIT + 0.5) { const h = 1 - (beat - HIT) / 0.5; g.globalCompositeOperation = 'screen'; const rg = g.createRadialGradient(C[0], C[1], 4, C[0], C[1], 320); rg.addColorStop(0, `rgba(255,230,180,${h})`); rg.addColorStop(1, 'rgba(255,140,140,0)'); g.fillStyle = rg; g.fillRect(C[0] - 320, C[1] - 320, 640, 640); }
    g.restore();
  }
  // 三昧真火 as rocaille: a string of curling coral-and-gold scrolls riding a bezier from his mouth to 悟空's head
  // the cold brook (冷涧) in the foreground; a burst of steam when the scorched monkey wades it
  function brook(g, t, head, beat) {
    const x0 = 860;
    let gr = g.createLinearGradient(0, 708, 0, 780); gr.addColorStop(0, '#CFE4EE'); gr.addColorStop(1, '#98BCD2'); g.fillStyle = gr;
    g.beginPath(); g.moveTo(x0, 780); g.quadraticCurveTo(x0 + 30, 712, x0 + 120, 710); g.lineTo(1180, 708); g.lineTo(1180, 780); g.fill();
    g.strokeStyle = 'rgba(255,255,255,0.8)'; g.lineWidth = 1.6;
    for (let k = 0; k < 6; k++) { const y = 718 + k * 10, ph = t * 1.4 + k; g.beginPath(); for (let x = x0 + 40 + k * 8; x < 1170; x += 8) g.lineTo(x, y + 2 * Math.sin(x / 18 + ph)); g.stroke(); }
    if (CHAR > 0 && head[0] > x0 + 20) { const s = XY.clamp((beat - 3.4) / 1.4);
      for (let k = 0; k < 9; k++) { const a = XY.hash(k, 9), y = GY - 20 - s * (60 + 120 * a), x = head[0] - 30 + 60 * a + 14 * Math.sin(t * 3 + k), r = 14 + 30 * s * a;
        gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, `rgba(255,255,255,${0.75 * (1 - s * 0.7)})`); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill(); } }
  }
  // a stone garden urn crowded with roses, near the left edge
  // a low rocaille rock tufted with mountain flowers, down in the bottom-left corner below the walking band
  function urn(g, t) {
    const x = 90, y = 770;
    g.fillStyle = '#DCCCC8'; g.beginPath(); g.moveTo(x - 90, y + 12); g.quadraticCurveTo(x - 80, y - 46, x - 20, y - 52); g.quadraticCurveTo(x + 40, y - 60, x + 80, y - 30); g.quadraticCurveTo(x + 100, y - 6, x + 96, y + 12); g.fill();
    g.fillStyle = 'rgba(150,120,140,0.35)'; g.beginPath(); g.ellipse(x + 40, y - 20, 34, 18, -0.3, 0, TAU); g.fill();
    cscroll(g, x - 60, y - 30, 0.7, 2.4, 1); cscroll(g, x + 70, y - 34, 0.6, 0.6, -1);
    const R = XY.rng(4);
    for (let k = 0; k < 9; k++) { const rx = x - 60 + R() * 130, ry = y - 46 - R() * 22, r = 6 + R() * 5, sw = 2 * Math.sin(t * 1.5 + k);
      g.fillStyle = '#7C9C80'; g.beginPath(); g.ellipse(rx + 8, ry + 6, 7, 3, 0.5, 0, TAU); g.fill();
      g.fillStyle = k % 3 ? '#F2A8B4' : '#FBEAE6'; g.beginPath(); g.arc(rx + sw, ry, r, 0, TAU); g.fill();
      g.strokeStyle = k % 3 ? '#C86A80' : '#E2B8B8'; g.lineWidth = 1.2; g.beginPath(); for (let a = 0; a < 9; a += 0.4) g.lineTo(rx + sw + Math.cos(a) * a * r / 10, ry + Math.sin(a) * a * r / 10); g.stroke(); }
  }
  // the gilt rocaille frame, shell cartouche with 火, a pink ribbon with the number
  function frame(W, H, S) {
    return XY.cached('kd30-fr:' + S.toFixed(4), W * S, H * S, cv => { const g = cv.getContext('2d'); g.setTransform(S, 0, 0, S, 0, 0);
      const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, '#E8CC80'); gr.addColorStop(0.5, '#B8903E'); gr.addColorStop(1, '#E2C278');
      g.strokeStyle = gr; g.lineWidth = 14; g.strokeRect(7, 7, W - 14, H - 14); g.strokeStyle = '#FBEAB0'; g.lineWidth = 1.5; g.strokeRect(15, 15, W - 30, H - 30);
      [[24, 24, 0, 1], [W - 24, 24, Math.PI / 2, 1], [W - 24, H - 24, Math.PI, 1], [24, H - 24, -Math.PI / 2, 1]].forEach(([x, y, r]) => { cscroll(g, x + 20 * Math.cos(r + 0.8), y + 20 * Math.sin(r + 0.8), 1.4, r, 1); cscroll(g, x + 40 * Math.cos(r + 0.3), y + 40 * Math.sin(r + 0.3), 0.8, r + 1.6, -1); });
      const cx = W / 2;   // shell cartouche, deliberately a little lopsided
      g.fillStyle = '#F8EEDC'; g.beginPath(); g.moveTo(cx - 70, 22); g.quadraticCurveTo(cx - 84, 96, cx - 6, 122); g.quadraticCurveTo(cx + 74, 104, cx + 66, 22); g.closePath(); g.fill();
      g.strokeStyle = '#C9A050'; g.lineWidth = 4; g.stroke(); cscroll(g, cx - 78, 70, 1, 2.6, 1); cscroll(g, cx + 76, 58, 0.9, 0.5, -1);
      g.fillStyle = 'rgba(232,200,120,0.5)'; for (let k = 0; k < 9; k++) { const a = Math.PI * (0.1 + k * 0.1); g.beginPath(); g.moveTo(cx, 28); g.lineTo(cx + Math.cos(a) * 60, 28 + Math.sin(a) * 80); g.lineTo(cx + Math.cos(a + 0.05) * 60, 28 + Math.sin(a + 0.05) * 80); g.fill(); }
      g.fillStyle = '#B03A3A'; g.font = XY.font(66, XY.cnFont.song, 'bold'); g.textAlign = 'center'; g.fillText('火', cx - 2, 98);
      g.fillStyle = '#F2B4BC'; g.beginPath(); g.moveTo(cx - 96, 124); g.quadraticCurveTo(cx, 108, cx + 96, 124); g.lineTo(cx + 110, 150); g.lineTo(cx + 92, 146); g.quadraticCurveTo(cx, 132, cx - 92, 146); g.lineTo(cx - 110, 150); g.closePath(); g.fill();
      g.fillStyle = '#7A3A4A'; g.font = XY.font(28, 'Didot, "Bodoni 72", serif', 'bold'); g.fillText('X X X', cx, 143); g.textAlign = 'left';
    });
  }
})();
