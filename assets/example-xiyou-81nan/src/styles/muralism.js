// 52 墨西哥壁画 · 1930 年 · 棘林吟咏（8 拍）— fresco language (earth colours, heavy umber contours, sculptural volumes, plaster)
// applied to the novel's own cast: under an ochre moon carved with 「吟」 the trees of 木仙庵 stand on the hillside as old men —
// 十八公 the pine, 孤直公 the cypress, 凌空子 the juniper, 拂云叟 the bamboo, 杏仙 the apricot and her two maids — faces carved
// in the bark, branches for arms. They declaim together (2), unroll their scroll of poems between two branch-hands, 杏仙
// steps forward and showers the monk with blossoms (4, 求配) — he refuses — and at dawn (5.5) the spell breaks: the faces sink
// back into knot-holes, the scroll drops, the trees lean and their roots bleed (第六十四回).
(() => {
  'use strict';
  const XY = window.XY, TAU = XY.TAU, K = () => XY.KIT_F;
  const C = { umber: '#3A2416', ochre: '#C8963A', terra: '#B5583A', maize: '#E3B85A', indigo: '#24304A', sky: '#3A4C6A', green: '#4E6A32', dgreen: '#2E4222', skin: '#B87A4E', plaster: '#E2CFA8', pink: '#E8A0A0', rose: '#C86A5A' };
  const MOON = [520, 150];
  const poly = (g, pts) => { g.beginPath(); g.moveTo(pts[0][0], pts[0][1]); for (let k = 1; k < pts.length; k++) g.lineTo(pts[k][0], pts[k][1]); g.closePath(); };
  const PEN = { outline: C.umber, ow: 2.8, seed: 52, shade: 'rgba(40,20,8,0.3)',
    color: r => ({ fur: '#7A4A26', face: '#D8A878', wkshirt: C.terra, tiger: C.maize, stripe: C.umber, gold: C.maize, staff: C.terra, ink: C.umber, horse: '#EADCC0', horse2: '#C8B48E', mane: '#EADCC0',
      hoof: C.umber, saddle: '#7A3A22', red: C.terra, robe: C.maize, kasaya: C.terra, skin: '#D8A878', metal: C.ochre, bjrobe: '#3A3430', bjpants: '#2E2824', pig: '#E0A890', pig2: '#C08070', wood: '#6A4426',
      ssrobe: '#3E5A6A', ssrobe2: '#2E4652', skin2: C.skin, ssh: '#9A3A22', ssbeard: '#8A3420', skull: '#EADCC0', bundle: C.ochre })[r] || C.ochre };
  // a thorn vine: a wavy stroke with spikes, seeded
  const thorn = (g, x0, y0, len, ang, seed, w, col) => { const R = XY.rng(seed); let x = x0, y = y0, a = ang; g.strokeStyle = col; g.lineWidth = w; g.lineCap = 'round'; g.beginPath(); g.moveTo(x, y); const sp = [];
    for (let s = 0; s < len; s += 12) { a += (R() - 0.5) * 0.6; x += Math.cos(a) * 12; y += Math.sin(a) * 12; g.lineTo(x, y); if (R() < 0.55) sp.push([x, y, a + (R() < 0.5 ? 1.2 : -1.2)]); } g.stroke();
    g.fillStyle = col; sp.forEach(([px, py, pa]) => poly(g, [[px + Math.cos(pa + 1.57) * w * 0.6, py + Math.sin(pa + 1.57) * w * 0.6], [px + Math.cos(pa) * w * 3.2, py + Math.sin(pa) * w * 3.2], [px - Math.cos(pa + 1.57) * w * 0.6, py - Math.sin(pa + 1.57) * w * 0.6]]) || g.fill()); };
  // A tree spirit of 木仙庵 as the novel has it: a tree that has taken an old man's shape. The body is the trunk, modelled as a
  // sculptural cylinder (light from the upper left, heavy umber contour); the face is carved into the bark (long brows, closed
  // reciting eyes, a beard of needles / leaves / moss); the crown is the head-dress; two branches are the arms, twig fingers.
  // kind 0 pine 十八公, 1 cypress 孤直公, 2 juniper 凌空子, 3 bamboo 拂云叟, 4 apricot 杏仙, 5 / 6 her maids (腊梅, 丹桂).
  // f = how much of the person is still there (1 spirit, 0 just a tree, at dawn). Returns the two hand points (panel coords).
  const BARK = ['#7A4428', '#6A5A44', '#5E5440', '#7E8A3A', '#8A5A44', '#9A7A3A', '#8A5A30'];
  const spirit = (g, x, base, h, kind, t, beat, raise, f, sc, lean) => {
    const K_ = K(), sway = 0.03 * Math.sin(t * 1.4 + kind * 1.7) + lean, nod = 0.06 * K_.pulse(beat - Math.floor(beat), 0.12, 0.3) * f * (beat > 0 ? 1 : 0);
    const bw = kind === 3 ? 34 : kind >= 4 ? 30 : 44 + (kind === 0 ? 8 : 0), top = -h * 0.66, bark = BARK[kind], hands = [];
    g.save(); g.translate(x, base); g.scale(sc, sc); g.rotate(sway); g.lineJoin = 'round'; g.lineCap = 'round';
    const vol = (x0, x1) => { const gr = g.createLinearGradient(x0, 0, x1, 0); gr.addColorStop(0, K_.mix(bark, '#F2E2C0', 0.35)); gr.addColorStop(0.45, bark); gr.addColorStop(1, K_.mix(bark, '#1A0E06', 0.55)); return gr; };
    // roots, trunk (bamboo: three segmented culms)
    g.fillStyle = vol(-bw - 20, bw + 20); g.strokeStyle = C.umber; g.lineWidth = 3;
    if (kind === 3) { [-20, 0, 20].forEach((cx, j) => { g.fillStyle = vol(cx - 13, cx + 13); g.beginPath(); g.roundRect(cx - 12, top - 40 * (j % 2), 24, -top + 40 * (j % 2), 10); g.fill(); g.stroke();
        for (let n = 1; n < 6; n++) { const yy = top - 40 * (j % 2) + n * (-top + 40 * (j % 2)) / 6; g.beginPath(); g.moveTo(cx - 13, yy); g.lineTo(cx + 13, yy); g.stroke(); } }); }
    else { const tw = kind === 2 ? 14 : 0; g.beginPath(); g.moveTo(-bw - 24, 0); g.quadraticCurveTo(-bw, -16, -bw + tw * Math.sin(1), -h * 0.2); g.bezierCurveTo(-bw - tw, -h * 0.4, -bw * 0.8 + tw, -h * 0.55, -bw * 0.75, top);
      g.lineTo(bw * 0.75, top); g.bezierCurveTo(bw * 0.8 + tw, -h * 0.55, bw - tw, -h * 0.4, bw, -h * 0.2); g.quadraticCurveTo(bw, -16, bw + 24, 0); g.closePath(); g.fill(); g.stroke();
      g.strokeStyle = 'rgba(30,14,6,0.45)'; g.lineWidth = 2;
      if (kind === 0) for (let n = 0; n < 16; n++) { const yy = -18 - n * (-top - 30) / 16, xx = ((n * 37) % 5 - 2) * bw * 0.32; g.beginPath(); g.moveTo(xx - 10, yy); g.lineTo(xx, yy - 8); g.lineTo(xx + 10, yy); g.stroke(); }
      else for (let n = -2; n <= 2; n++) { g.beginPath(); g.moveTo(n * bw * 0.32, -6); g.bezierCurveTo(n * bw * 0.32 + (kind === 2 ? 16 : 3), -h * 0.25, n * bw * 0.3 - (kind === 2 ? 16 : 3), -h * 0.45, n * bw * 0.26, top + 6); g.stroke(); } }
    // the face carved into the bark, fading to a knot-hole at dawn
    const fy = top + 34 + (kind >= 4 ? 4 : 0);
    g.save(); g.translate(0, fy); g.rotate(nod);
    if (f > 0.02) { g.globalAlpha = f;
      g.fillStyle = kind >= 4 ? '#D8A47A' : K_.mix(bark, '#E8C8A0', 0.45); g.beginPath(); g.ellipse(0, 0, bw * 0.62 + 4, 30, 0, 0, TAU); g.fill(); g.strokeStyle = C.umber; g.lineWidth = 2.4; g.stroke();
      g.fillStyle = 'rgba(40,20,8,0.28)'; g.beginPath(); g.ellipse(8, 2, bw * 0.4, 26, 0, -1.2, 1.6); g.fill();
      g.strokeStyle = C.umber; g.lineWidth = 3; [-1, 1].forEach(d => { g.beginPath(); g.moveTo(d * 4, -10); g.quadraticCurveTo(d * 14, -16, d * 24, kind >= 4 ? -12 : -4); g.stroke();       // brows (old men's droop)
        g.beginPath(); g.moveTo(d * 6, -4); g.quadraticCurveTo(d * 12, beat > 0 && (Math.floor(beat * 2) % 2) ? 0 : 1, d * 18, -4); g.stroke(); });                                   // closed reciting eyes
      g.beginPath(); g.moveTo(0, -6); g.lineTo(-3, 8); g.lineTo(3, 9); g.stroke();
      const mo = 2 + 4 * Math.abs(Math.sin(t * 7 + kind)) * (beat > 0.5 && beat < 4.5 ? 1 : 0.2); g.fillStyle = kind >= 4 ? '#B5463A' : '#2A1810'; g.beginPath(); g.ellipse(0, 16, 6, mo, 0, 0, TAU); g.fill();
      if (kind < 4) { const bc = ['#E8E0C8', '#D8D4C0', '#C8C8B0', '#A8B860'][kind]; g.strokeStyle = bc; g.lineWidth = 2.4;                                                      // beard of needles / scale / moss / leaves
        for (let n = 0; n < 11; n++) { const bx = -14 + n * 2.8, L = 40 + 22 * Math.sin(n * 0.9) + kind * 6; g.beginPath(); g.moveTo(bx, 20); g.quadraticCurveTo(bx + 4 * Math.sin(t * 2 + n), 20 + L * 0.6, bx + 6 * Math.sin(t * 1.3 + n), 20 + L); g.stroke(); } }
      else { g.fillStyle = '#2A1810'; g.beginPath(); g.ellipse(0, -26, bw * 0.7 + 6, 14, 0, Math.PI, 0); g.fill(); }
      g.globalAlpha = 1; }
    if (f < 0.98) { g.globalAlpha = 1 - f; g.fillStyle = '#2A1810'; g.beginPath(); g.ellipse(2, 4, 9, 14, 0.2, 0, TAU); g.fill(); g.strokeStyle = C.umber; g.lineWidth = 2; for (let r = 1; r < 3; r++) { g.beginPath(); g.ellipse(2, 4, 9 + r * 6, 14 + r * 7, 0.2, 0, TAU); g.stroke(); } g.globalAlpha = 1; }
    g.restore();
    // branch arms with twig fingers (raised when they declaim together); the hand points are returned for the scroll
    [-1, 1].forEach(d => { const sx = d * bw * 0.7, sy = top + 70, r = raise * f, hx = d * XY.lerp(bw + 34, bw + 18, r), hy = XY.lerp(top + 120, top - 70, r);
      g.strokeStyle = C.umber; g.lineWidth = 18; g.beginPath(); g.moveTo(sx, sy); g.quadraticCurveTo(d * (bw + 30), (sy + hy) / 2 + 26 * (1 - r), hx, hy); g.stroke();
      g.strokeStyle = bark; g.lineWidth = 12; g.stroke();
      g.strokeStyle = C.umber; g.lineWidth = 4; [-0.5, 0, 0.5].forEach(fa => { const a = -Math.PI / 2 + d * 0.5 * (1 - r) + fa; g.beginPath(); g.moveTo(hx, hy); g.lineTo(hx + Math.cos(a) * 18, hy + Math.sin(a) * 18); g.stroke(); });
      const m = g.getTransform(); hands.push([(m.a * hx + m.c * hy + m.e) / e_S, (m.b * hx + m.d * hy + m.f) / e_S]); });
    // the crown as head-dress
    const cy = top - 6;
    if (kind === 0) for (let n = 0; n < 4; n++) { const yy = cy - 6 - n * 30, ww = 190 - n * 34; g.fillStyle = n % 2 ? C.green : C.dgreen; g.beginPath(); g.ellipse((n % 2 ? 1 : -1) * (26 - n * 4), yy, ww / 2, 14, (n % 2 ? -1 : 1) * 0.06, 0, TAU); g.fill(); g.strokeStyle = C.umber; g.lineWidth = 2.6; g.stroke();
      g.strokeStyle = 'rgba(200,220,150,0.4)'; g.lineWidth = 1.4; for (let q = -3; q <= 3; q++) { g.beginPath(); g.moveTo(q * ww / 8, yy - 6); g.lineTo(q * ww / 8 + 6, yy + 6); g.stroke(); } }
    if (kind === 1) { g.fillStyle = C.dgreen; g.beginPath(); g.moveTo(-30, cy); g.quadraticCurveTo(-34, cy - 110, 0, cy - 190); g.quadraticCurveTo(34, cy - 110, 30, cy); g.fill(); g.strokeStyle = C.umber; g.lineWidth = 2.6; g.stroke();
      g.strokeStyle = 'rgba(200,220,150,0.35)'; g.lineWidth = 2; for (let n = 0; n < 7; n++) { g.beginPath(); g.moveTo(-14, cy - 20 - n * 22); g.lineTo(0, cy - 30 - n * 22); g.lineTo(14, cy - 20 - n * 22); g.stroke(); } }
    if (kind === 2) for (let n = 0; n < 6; n++) { const a = -Math.PI / 2 + (n - 2.5) * 0.45, r0 = 50 + 14 * (n % 2); g.fillStyle = n % 2 ? '#3E5A54' : '#2E4A44'; g.beginPath(); g.ellipse(Math.cos(a) * r0, cy - 40 + Math.sin(a) * r0 * 0.8, 30, 16, a, 0, TAU); g.fill(); g.strokeStyle = C.umber; g.lineWidth = 2.4; g.stroke(); }
    if (kind === 3) for (let n = 0; n < 7; n++) { const a = -Math.PI / 2 + (n - 3) * 0.32 + 0.05 * Math.sin(t * 2 + n), L = 56 + 10 * (n % 2); g.fillStyle = n % 2 ? C.green : '#6A7A2A';
      g.save(); g.translate(0, cy - 30); g.rotate(a + Math.PI / 2); g.beginPath(); g.moveTo(0, 0); g.quadraticCurveTo(10, -L * 0.5, 0, -L); g.quadraticCurveTo(-10, -L * 0.5, 0, 0); g.fill(); g.strokeStyle = C.umber; g.lineWidth = 2; g.stroke(); g.restore(); }
    if (kind >= 4) { const pc = kind === 5 ? ['#F2D25A', '#F8E8A0'] : kind === 6 ? ['#F29A4A', '#F8C890'] : [C.pink, '#F2C8C0'];
      for (let n = 0; n < 11; n++) { const a = Math.PI * 1.02 + n / 10 * Math.PI * 0.96, r0 = 44 + 8 * (n % 2); g.fillStyle = pc[n % 2]; g.beginPath(); g.arc(Math.cos(a) * r0, cy + 6 + Math.sin(a) * r0 * 0.8, 13, 0, TAU); g.fill(); g.strokeStyle = C.umber; g.lineWidth = 2; g.stroke();
        g.fillStyle = C.terra; g.beginPath(); g.arc(Math.cos(a) * r0, cy + 6 + Math.sin(a) * r0 * 0.8, 3, 0, TAU); g.fill(); } }
    g.restore(); return hands; };
  let e_S = 1;

  XY.STYLES.muralism = {
    bg(g, W, H) {
      const k = K(), R = XY.rng(5201);
      let gr = g.createLinearGradient(0, 0, 0, 470); gr.addColorStop(0, C.indigo); gr.addColorStop(1, '#56647A'); g.fillStyle = gr; g.fillRect(0, 0, W, 702);
      // the moon as a carved stone disc: rings, a band of triangles, 「吟」 cut in the middle
      const [mx, my] = MOON; g.fillStyle = C.maize; g.beginPath(); g.arc(mx, my, 112, 0, TAU); g.fill(); g.strokeStyle = C.umber; g.lineWidth = 4; g.stroke();
      g.lineWidth = 2.5; g.beginPath(); g.arc(mx, my, 96, 0, TAU); g.stroke(); g.beginPath(); g.arc(mx, my, 78, 0, TAU); g.stroke();
      g.fillStyle = C.ochre; for (let j = 0; j < 24; j++) { const a = j / 24 * TAU; poly(g, [[mx + Math.cos(a - 0.12) * 80, my + Math.sin(a - 0.12) * 80], [mx + Math.cos(a) * 94, my + Math.sin(a) * 94], [mx + Math.cos(a + 0.12) * 80, my + Math.sin(a + 0.12) * 80]]); g.fill(); }
      g.fillStyle = C.umber; g.font = XY.font(112, XY.cnFont.kai, 'bold'); g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('吟', mx, my + 6); g.textAlign = 'left'; g.textBaseline = 'alphabetic';
      // rolling hills, the hermitage 木仙庵 with its round window
      [[0, 520, 380, 120, '#4A5A3A'], [300, 500, 460, 130, '#56683E'], [700, 520, 520, 110, '#46583A']].forEach(([x, y, w, h, c]) => { g.fillStyle = c; g.beginPath(); g.ellipse(x + w / 2, y + h, w / 2 + 40, h, 0, Math.PI, 0); g.fill(); g.strokeStyle = C.umber; g.lineWidth = 3; g.stroke(); });
      g.fillStyle = C.terra; g.fillRect(70, 500, 180, 120); g.strokeStyle = C.umber; g.lineWidth = 3; g.strokeRect(70, 500, 180, 120);
      g.fillStyle = C.ochre; poly(g, [[40, 510], [160, 420], [280, 510]]); g.fill(); g.stroke(); g.strokeStyle = 'rgba(58,36,22,0.55)'; g.lineWidth = 2; for (let j = 0; j < 16; j++) { g.beginPath(); g.moveTo(60 + j * 13, 505); g.lineTo(150 + j * 2, 432); g.stroke(); }
      g.fillStyle = '#2A1810'; g.beginPath(); g.arc(160, 556, 26, 0, TAU); g.fill(); g.strokeStyle = C.umber; g.lineWidth = 3; g.stroke();
      g.fillStyle = C.plaster; g.font = XY.font(22, XY.cnFont.kai, 'bold'); g.fillText('木仙庵', 124, 610);
      // the thorn ridge: hundreds of metres of vines behind the road
      g.save(); g.beginPath(); g.rect(0, 0, W, 699); g.clip();
      for (let j = 0; j < 46; j++) thorn(g, R() * W, 540 + R() * 100, 160 + R() * 220, -0.3 - R() * 2.5, 5210 + j, 3 + R() * 3, R() < 0.5 ? C.dgreen : '#4A3222');
      g.restore();
      // the road, the inscription band at the foot of the wall (counter and chapter title)
      gr = g.createLinearGradient(0, 702, 0, 742); gr.addColorStop(0, '#9A5A32'); gr.addColorStop(1, '#7A4426'); g.fillStyle = gr; g.fillRect(0, 700, W, 42);
      g.fillStyle = C.umber; g.fillRect(0, 698, W, 5); g.fillRect(0, 740, W, 4);
      g.fillStyle = C.maize; g.fillRect(0, 744, W, H - 744); g.fillStyle = C.umber; g.font = XY.font(26, XY.cnFont.hei, '900'); g.textBaseline = 'middle';
      g.fillText('第五十二难  ·  荆 棘 岭  ·  木仙庵三藏谈诗', 40, 763); g.textBaseline = 'alphabetic';
      // fresco: plaster mottling over everything, the seams of the day's work (giornate), hairline cracks
      k.mottle(g, 'mural', W, H, 4, 5202, (a, b) => { const v = 0.35 * a + 0.9 * b; return v > 0 ? [250, 236, 206, Math.min(42, v * 90)] : [60, 36, 20, Math.min(42, -v * 80)]; });
      g.strokeStyle = 'rgba(58,36,22,0.35)'; g.lineWidth = 1.2; [[0, 330, 420, 300, 600, 420, 1180, 380], [640, 0, 660, 200, 610, 420, 690, 702]].forEach(L => { g.beginPath(); g.moveTo(L[0], L[1]); for (let j = 2; j < L.length; j += 2) g.lineTo(L[j], L[j + 1]); g.stroke(); });
      for (let j = 0; j < 14; j++) { let x = R() * W, y = R() * 700; g.beginPath(); g.moveTo(x, y); for (let s = 0; s < 5; s++) { x += (R() - 0.5) * 30; y += R() * 20; g.lineTo(x, y); } g.strokeStyle = 'rgba(58,36,22,0.25)'; g.stroke(); }
    },
    draw(g, e) {
      const { W, H, t, u, beat } = e, k = K();
      // moon halo breathing, the hermitage lamp flickering
      const [mx, my] = MOON; for (let j = 0; j < 3; j++) { g.strokeStyle = `rgba(227,184,90,${0.35 - j * 0.1})`; g.lineWidth = 6; g.beginPath(); g.arc(mx, my, 124 + j * 18 + 5 * Math.sin(t * 2 - j), 0, TAU); g.stroke(); }
      const fl = 0.7 + 0.3 * XY.hash(k.step(t, 10), 52); g.fillStyle = `rgba(242,190,90,${fl})`; g.beginPath(); g.arc(160, 556, 18, 0, TAU); g.fill();
      // tendrils curling in front of the thorn ridge (rooted back at y 640, behind the road)
      g.save(); g.beginPath(); g.rect(0, 0, W, 660); g.clip();
      for (let j = 0; j < 7; j++) { const x0 = 300 + j * 130, a = -1.2 - 0.5 * Math.sin(t * 1.3 + j * 1.9); thorn(g, x0, 640, 110 + 30 * Math.sin(t + j), a, 5300 + j, 4, j % 2 ? C.dgreen : '#4A3222'); }
      g.restore();
      // dawn on 5.5: the warm light comes up, the spell breaks and the old men are only trees again (原著: 原来是几株树)
      const dawn = XY.smooth((beat - 5.3) / 0.5), f = 1 - dawn;
      if (dawn > 0) { g.fillStyle = `rgba(232,150,70,${0.42 * dawn})`; g.fillRect(0, 0, W, 600); g.fillStyle = K().rgba(C.maize, dawn); g.beginPath(); g.arc(1080, 600 - 120 * dawn, 70, Math.PI, 0); g.fill();
        const fl2 = k.hitDecay(beat, 5.5, 0.5); if (fl2 > 0.02) { g.fillStyle = `rgba(255,236,190,${0.5 * fl2})`; g.fillRect(0, 0, W, H); } }
      // the tree spirits, standing back on the hillside (base y 600, scaled 0.85) so the pilgrims pass in front of them
      e_S = e.S; const raise = XY.smooth((beat - 1.6) / 0.3) * (1 - XY.smooth((beat - 3.8) / 0.4)), PBm = 600, SC = 0.85, HANDS = {};
      const step = XY.easeOut((beat - 3.2) / 0.4) * (1 - XY.smooth((beat - 5) / 0.5));
      [[1150, 5, 250, 592], [1035, 6, 240, 592], [690, 0, 330, PBm], [790, 1, 320, PBm], [880, 2, 330, PBm], [975, 3, 320, PBm], [1080, 4, 300, PBm]].forEach(([x, kind, h, b]) => {
        const lean = dawn * 0.13 * (XY.hash(kind, 52) - 0.5) * 2 - (kind === 4 ? 0.16 * step : 0);
        const rk = kind === 0 || kind === 3 ? XY.smooth((beat - 1.6) / 0.3) * (1 - XY.smooth((beat - 5.5) / 0.3)) : raise * (kind >= 4 ? 0.6 : 1);
        HANDS[kind] = spirit(g, x - (kind === 4 ? 30 * step : 0), b, h, kind, t, beat, rk, f, SC, lean);
        if (dawn > 0.3) for (let j = 0; j < 3; j++) { const ph = ((beat - 5.5) * 0.8 + j / 3) % 1; g.fillStyle = '#9A1E14'; g.beginPath(); g.ellipse(x - 20 + j * 20, b - 4 + ph * 30, 3.5, 5 + 3 * ph, 0, 0, TAU); g.fill(); } });   // 根下鲜血淋漓
      // the long scroll of their poems, held between 十八公's right hand and 拂云叟's left; it drops when the spell breaks
      const un = XY.easeOut((beat - 1.9) / 0.5);
      if (un > 0) { const A = HANDS[0][1], B = HANDS[3][0], drop = XY.easeIn((beat - 5.5) / 0.7), x0 = A[0], x1 = XY.lerp(x0 + 20, B[0], un), y0 = Math.min(A[1], B[1]) - 40 + drop * 300, y1 = y0 + 66;
        g.save(); if (drop > 0) { g.translate((x0 + x1) / 2, y0); g.rotate(drop * 0.6); g.translate(-(x0 + x1) / 2, -y0); } g.globalAlpha = 1 - XY.smooth((beat - 6.1) / 0.4);
        g.fillStyle = '#EADCB8'; g.fillRect(x0, y0, x1 - x0, y1 - y0); g.strokeStyle = C.umber; g.lineWidth = 3; g.strokeRect(x0, y0, x1 - x0, y1 - y0); g.fillStyle = 'rgba(58,36,22,0.18)'; g.fillRect(x0, y1 - 12, x1 - x0, 12);
        g.save(); g.beginPath(); g.rect(x0, y0, x1 - x0, y1 - y0); g.clip(); g.fillStyle = C.umber; g.font = XY.font(40, XY.cnFont.kai, 'bold'); g.textBaseline = 'middle'; g.fillText('木仙庵三藏谈诗', x0 + 26, (y0 + y1) / 2); g.restore();
        [x0, x1].forEach(x => { g.fillStyle = '#7A4426'; g.fillRect(x - 8, y0 - 10, 16, y1 - y0 + 20); g.strokeRect(x - 8, y0 - 10, 16, y1 - y0 + 20); }); g.restore(); }
      // 杏仙 steps toward the monk and offers her blossoms (求配, 4): a burst of petals over him; he raises his palm and refuses
      const petal = (x, y, r, a) => { g.save(); g.translate(x, y); g.rotate(a); g.fillStyle = C.pink; g.strokeStyle = C.umber; g.lineWidth = 1.4; g.beginPath(); g.ellipse(0, 0, r, r * 0.6, 0, 0, TAU); g.fill(); g.stroke(); g.restore(); };
      for (let j = 0; j < 8; j++) { const ph = (t * 0.22 + j / 8) % 1; petal(1060 - ph * 380 + 20 * Math.sin(t * 2 + j), 330 + ph * 330, 6, t * 2 + j); }
      const mh = e.at('monk.head', {});
      if (beat >= 4) { const tau = (beat - 4) * XY.BEAT, src = [1030, 400];
        for (let j = 0; j < 70; j++) { const tx = mh[0] + (XY.hash(j, 4, 52) - 0.5) * 220, ty = mh[1] + (XY.hash(j, 5, 52) - 0.5) * 140, q = XY.clamp(tau / (0.5 + 0.4 * XY.hash(j, 6, 52)));
          const x = XY.lerp(src[0], tx, XY.easeOut(q)) + 14 * Math.sin(3 * tau + j), y = XY.lerp(src[1], ty, XY.easeOut(q)) - 90 * Math.sin(Math.PI * q) + (q >= 1 ? (tau - 0.9) * 90 : 0); if (y > 700) continue;
          petal(x, y, 6 + 6 * XY.hash(j, 3, 52), tau * (3 + j % 4) + j); } }
      e._zoom = [[1000, 430, k.push(beat, 3.9, 0.15, 0.4, 0.8)], [880, 380, k.push(beat, 5.4, 0.2, 0.4, 0.8)]];
      // ---- the pilgrims: earth colours, heavy contour, a sculptural light from the upper left
      const acts = { monk: { palm: XY.smooth((beat - 3.8) / 0.3) * (1 - XY.smooth((beat - 5.6) / 0.4)) }, bajie: { scratch: k.pulse(beat, 2.4, 0.8) + k.pulse(beat, 6.6, 0.8) }, wukong: { shade: k.after(beat, 4.8, 0.3) * (1 - k.after(beat, 6.3, 0.3)) }, shaseng: { lift: k.pulse(beat, 3.1, 0.5) } };
      const [cv, lg] = k.layer(e, 'mural-proc'); XY.drawProcession(lg, e.phase, e.procX, e.groundY, PEN, acts);
      lg.save(); lg.globalCompositeOperation = 'source-atop'; const sh = lg.createLinearGradient(0, e.groundY - 280, 0, e.groundY);
      sh.addColorStop(0, 'rgba(255,236,190,0.28)'); sh.addColorStop(0.45, 'rgba(255,236,190,0)'); sh.addColorStop(1, 'rgba(40,18,6,0.4)'); lg.fillStyle = sh; lg.fillRect(e.procX - 420, e.groundY - 300, 760, 310);
      lg.strokeStyle = 'rgba(40,18,6,0.22)'; lg.lineWidth = 1.4; for (let x = e.procX - 420; x < e.procX + 340; x += 7) { lg.beginPath(); lg.moveTo(x, e.groundY - 110); lg.lineTo(x + 40, e.groundY); lg.stroke(); }   // hatched lower half
      lg.restore(); k.blit(g, cv);
      // foreground thorns in the bottom corners
      g.save(); g.beginPath(); g.rect(0, 0, W, 740); g.clip(); thorn(g, -10, 700, 260, -0.5, 5401, 6, C.dgreen); thorn(g, -20, 690, 200, -1.0, 5402, 5, '#4A3222'); thorn(g, W + 10, 700, 240, Math.PI + 0.5, 5403, 6, C.dgreen); g.restore();
    },
    post(canvas, g, e) { const z = e._zoom; if (!z) return; const a = z[0][2] > 0 ? z[0] : z[1]; if (a[2] > 0) K().postZoom(canvas, g, e, a[0], a[1], 1 + 0.1 * a[2]); },
    hits: [4, 5.5],
    thumb: 3.5,   // overview thumbnail: a clear frame with no in-panel push-in active
  };
})();
