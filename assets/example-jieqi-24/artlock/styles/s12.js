// s12 大暑 · 长曝光光绘摄影 (long-exposure night photograph). Star trails, firefly trails that blink into dashes,
// a child ghosted by the open shutter while the sleeping ox stays sharp, the term light-painted in the air,
// film grain and vignette. Moment: 腐草为萤 — fireflies rise from the rotting grass heap by the pond; 大雨时行 at the end.
(function () {
  const JQ = window.JQ, S = JQ.SCENE, L = JQ.L;
  const HEAP = [1210, 1012];                             // the rotting grass heap below the pond, in the gate lamp's light (clear of the lying ox)
  const NIGHT = { sky: '#0B1424', mtn: '#121E2E', hill: '#14232C', field: '#1A2622', furrow: '#202E28', ground: '#161E1E', pond: '#0E1A28', rim: '#1A1E1C', stream: '#132234',
    bridge: '#262C31', trunk: '#070A08', canopy: '#080D0A', wall: '#2E333A', cap: '#1A1D21', roof: '#15181C', front: '#2A2E33', gate: '#5A3A1A', path: '#262A2A', line: '#0A0D10' };
  const PEN = { skin: '#6E5A50', hair: '#141414', coat: '#3E4A60', pants: '#22262E', ox: '#3E3226', oxDark: '#1E1812', horn: '#7A7266', eye: '#0A0A0A', hat: '#555', line: '#0A0C0E', lw: 2, outline: true };
  const back = (g, Sx) => {
    JQ.flatScene(g, 0, Sx, Object.assign({ noCast: true }, NIGHT));                        // night palette over the shared layout (draws kid/ox; we paint over the ox spot below)
    // the sky again (flatScene drew the cast; repaint sky gradient and star trails)
    const sk = g.createLinearGradient(0, 0, 0, L.HORIZON); sk.addColorStop(0, '#050913'); sk.addColorStop(0.6, '#12203A'); sk.addColorStop(1, '#2A4262');
    g.save(); g.beginPath(); g.rect(0, 0, 1920, L.HORIZON + 2); g.clip(); g.fillStyle = sk; g.fillRect(0, 0, 1920, L.HORIZON + 2);
    const pole = [1460, -260], R = JQ.rng(1212);
    for (let i = 0; i < 520; i++) {
      const r = 280 + R() * 1500, a0 = Math.PI * (0.18 + R() * 0.64), len = 0.06 + R() * 0.05, b = 0.25 + R() * 0.75;
      const hue = R(); g.strokeStyle = hue < 0.15 ? `rgba(255,196,140,${b})` : hue < 0.3 ? `rgba(170,200,255,${b})` : `rgba(235,240,255,${b})`;
      g.lineWidth = 0.8 + R() * 1.6; g.beginPath(); g.arc(pole[0], pole[1], r, a0, a0 + len); g.stroke();
    }
    g.restore();
    g.fillStyle = NIGHT.mtn; g.fill(S.mountains.path); g.fillStyle = NIGHT.hill; g.fill(S.hills.path);
    g.fillStyle = NIGHT.canopy; g.strokeStyle = NIGHT.canopy; JQ.drawBranches(g, 4, 1); S.clumps.forEach(q => { g.beginPath(); g.arc(q.x, q.y, q.r, 0, 6.2832); g.fill(); });
    // the house is lived in: a lamp in the window and one at the gate, spilling warm light
    const lamp = (x, y, r, a) => { const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, `rgba(255,214,150,${a})`); gr.addColorStop(0.25, `rgba(255,170,90,${a * 0.45})`); gr.addColorStop(1, 'rgba(255,150,60,0)'); g.fillStyle = gr; g.beginPath(); g.arc(x, y, r, 0, 6.2832); g.fill(); };
    g.globalCompositeOperation = 'lighter'; lamp(1760, 575, 160, 0.9); lamp(1650, 760, 240, 0.8); lamp(1650, 900, 300, 0.25); g.globalCompositeOperation = 'source-over';
    g.fillStyle = '#FFE7B8'; g.fill(S.window.path);
    // repaint the ground where flatScene put the default cast, then the heap
    g.fillStyle = NIGHT.ground; g.fillRect(250, 820, 600, 260); g.fillStyle = NIGHT.trunk; g.fill(S.trunk.path);
    g.fillStyle = NIGHT.rim; g.fill(S.pondRim.path); g.fillStyle = NIGHT.pond; g.fill(S.pond.path);
    g.fillStyle = '#1C2416'; g.beginPath(); g.ellipse(HEAP[0], HEAP[1], 120, 40, 0, Math.PI, 0); g.fill();
    g.strokeStyle = '#2C3620'; g.lineWidth = 2; for (let i = 0; i < 70; i++) { const x = HEAP[0] - 110 + JQ.hash(i, 4, 2) * 220, h = 14 + JQ.hash(i, 5, 2) * 30; g.beginPath(); g.moveTo(x, HEAP[1]); g.lineTo(x + (JQ.hash(i, 6, 2) - 0.5) * 30, HEAP[1] - h); g.stroke(); }
    // the sleeping ox stays sharp: it did not move during the exposure
    // reflections of the lamps in the pond
    g.globalCompositeOperation = 'lighter'; g.save(); g.clip(S.pond.path);
    for (let i = 0; i < 9; i++) { g.fillStyle = `rgba(255,190,110,${0.08 + 0.03 * (i % 3)})`; g.fillRect(1150 + i * 6, 820 + i * 14, 120 - i * 10, 4); }
    g.restore(); g.globalCompositeOperation = 'source-over';
  };
  // film grain tiles (four, picked by frame) and a vignette
  const grain = (Sx, k) => JQ.cached('s12-grain' + k, Sx, (g) => {
    const w = 480, h = 270, c = document.createElement('canvas'); c.width = w; c.height = h; const cg = c.getContext('2d'), im = cg.createImageData(w, h);
    for (let i = 0; i < w * h; i++) { const v = JQ.hash(i, k, 99) * 255; im.data[i * 4] = im.data[i * 4 + 1] = im.data[i * 4 + 2] = v; im.data[i * 4 + 3] = 255; }
    cg.putImageData(im, 0, 0); g.imageSmoothingEnabled = false; g.drawImage(c, 0, 0, 1920, 1080);
  });
  // humid night air (土润溽暑): soft lit mist banks over the ground and pond, cached once and drifted upward
  const mist = (g) => { const R = JQ.rng(1213);
    for (let i = 0; i < 18; i++) { const x = 520 + R() * 1400, y = 740 + R() * 200, r = 150 + R() * 170, warm = x > 1400;
      const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, warm ? 'rgba(255,196,130,0.42)' : 'rgba(150,176,212,0.17)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
      g.fillStyle = gr; g.beginPath(); g.ellipse(x, y, r * 1.6, r * 0.55, 0, 0, Math.PI * 2); g.fill(); } };
  JQ._s12 = { HEAP, PEN, back, grain, mist };
})();
(function () {
  const JQ = window.JQ, S = JQ.SCENE, L = JQ.L, K = JQ._s12, HEAP = K.HEAP, TAU = Math.PI * 2;
  const BAR = 8 / 3, IMPACT = 4 / 3, HOU = JQ.TERMS[11].hou, NF = 46;
  // 腐草为萤: the heap flares on the impact and the fireflies lift off; long curving, looping flights that stay in the exposure
  const fly = i => { const R = JQ.rng(300 + i); return { t0: i < 30 ? IMPACT - 0.22 + R() * 0.4 : IMPACT + 0.4 + R() * 2.6, v: 0.55 + R() * 0.75, a: -Math.PI * (0.1 + R() * 0.8), w: 0.7 + R() * 1.1, ph: R() * 6.28, dash: 18 + R() * 30, gap: 16 + R() * 40 }; };
  const F = Array.from({ length: NF }, (_, i) => fly(i));
  const pos = (f, i, tau) => { const R = 820 * f.v * (1 - Math.exp(-tau * 0.4));
    return [HEAP[0] + (JQ.hash(i, 1, 7) - 0.5) * 160 + Math.cos(f.a) * R * 1.3 + Math.sin(tau * 1.9 * f.w + f.ph) * 72 * Math.min(1, tau),
            HEAP[1] - 24 + Math.sin(f.a) * R * 0.75 + Math.cos(tau * 2.4 * f.w + f.ph) * 44 * Math.min(1, tau)]; };
  // the child, ghosted by the open shutter: chases the fireflies right, then runs back under the tree when the rain comes and stands still (sharp)
  const NIGHTPEN = { skin: '#6E5A50', hair: '#141414', coat: '#3E4A60', pants: '#22262E', apron: '#4A4E58', hat: '#555', straw: '#6A6250', scarf: '#4A3E40', eye: '#0A0A0A',
    ox: '#3E3226', oxDark: '#1E1812', horn: '#7A7266', calf: '#5A4836', calfDark: '#2A2018', prop: '#4A3A2A', metal: '#5A6068', red: '#7A2A22', line: 'rgba(150,172,205,0.45)', lw: 1.6, outline: true };   // a cool moonlit rim
  const KIDPEN = { skin: '#C9A48E', hair: '#2A2A2A', coat: '#7F95BE', pants: '#3A4256', apron: '#7F95BE', hat: '#8A8070', eye: '#111', line: '#0A0C0E', lw: 2, outline: false };
  JQ.ART[12] = {
    key: IMPACT, keyHou: JQ.TERMS[11].keyHou,
    focus: [[1210, 940], [1240, 840], [960, 520]],
    frame: false,
    draw(g, t, Sx) {
    t = JQ.clamp(t, 0, 9);
    JQ.blit(g, JQ.cached('s12-back', Sx, K.back));
    const rain = JQ.smooth(16 / 3, 6.2, t), wet = JQ.smooth(BAR + 0.1, BAR + 1.2, t), hou = Math.min(2, Math.floor(t / BAR));
    // 土润溽暑: lit mist rises off the warm wet ground; the gate lamp throws a long reflection down the wet yard
    if (wet > 0) { g.save(); g.globalCompositeOperation = 'screen'; g.globalAlpha = wet * (1 - rain * 0.5); g.translate(0, -Math.max(0, t - BAR) * 10); JQ.blit(g, JQ.cached('s12-mist', Sx, K.mist)); g.restore();
      g.save(); g.globalCompositeOperation = 'lighter';
      [[1650, 816, 46, 0.55], [1760, 812, 28, 0.3], [1590, 820, 18, 0.3]].forEach(([x, y, w, a]) => { const len = 260 * wet, gr = g.createLinearGradient(0, y, 0, y + len); gr.addColorStop(0, `rgba(255,190,120,${a * wet})`); gr.addColorStop(1, 'rgba(255,150,80,0)');
        g.fillStyle = gr; g.beginPath(); g.moveTo(x - w * 0.5, y); g.lineTo(x + w * 0.5, y); g.lineTo(x + w * 0.9, y + len); g.lineTo(x - w * 0.9, y + len); g.closePath(); g.fill(); });
      g.restore(); }
    // the family on the open shutter: what holds still is sharp (the lying ox and calf, the seated woman); what moves leaves a ghost
    // (her fan, the running child), sampled from the story track at earlier moments of the exposure
    const lt = Sx.lt != null ? Sx.lt : t, n = Sx.n || 12, CS = JQ.castFor(Sx, t);
    CS.items.forEach(it => { if (it.who === 'kid') return; g.save(); if (it.alpha != null && it.alpha < 1) g.globalAlpha *= it.alpha; JQ.drawParts(g, it.parts, NIGHTPEN); g.restore(); });
    g.save();
    for (let k = 1; k <= 3; k++) { g.globalAlpha = 0.28 / k; JQ.cast(n, lt - k * 0.07).items.forEach(it => { if (it.who === 'woman' && it.kind === 'fan') JQ.drawParts(g, it.parts, NIGHTPEN); }); }
    const kid = CS.state.kid, past = JQ.cast(n, lt - 0.3).state.kid, moving = kid && past ? JQ.clamp(Math.hypot(kid.x - past.x, kid.y - past.y) / 40) : 0;
    for (let k = 6; k >= 0; k--) { const S2 = k ? JQ.cast(n, lt - k * 0.11) : CS; g.globalAlpha = k ? 0.3 * (1 - k / 8) * moving : 0.32 + 0.6 * (1 - moving);
      S2.items.forEach(it => { if (it.who === 'kid') JQ.drawParts(g, it.parts, KIDPEN); }); }
    g.restore();
    // the heap: faint glimmers before the impact, a flare on it
    g.save(); g.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 6; i++) { const a = Math.max(0, Math.sin(t * (3 + i) + i * 2)) * JQ.smooth(0.2, 1.1, t) * (1 - JQ.smooth(IMPACT, IMPACT + 0.5, t)); if (a <= 0) continue;
      const x = HEAP[0] - 80 + i * 30, y = HEAP[1] - 10 - (i % 3) * 8; g.fillStyle = `rgba(210,255,120,${0.8 * a})`; g.beginPath(); g.arc(x, y, 4, 0, TAU); g.fill(); }
    if (t > IMPACT - 0.03 && t < IMPACT + 0.8) { const k = JQ.clamp((t - IMPACT + 0.03) / 0.83), r = 130 + k * 260, gr = g.createRadialGradient(HEAP[0], HEAP[1] - 20, 0, HEAP[0], HEAP[1] - 20, r);
      gr.addColorStop(0, `rgba(220,255,140,${0.85 * (1 - k)})`); gr.addColorStop(1, 'rgba(120,200,60,0)'); g.fillStyle = gr; g.beginPath(); g.arc(HEAP[0], HEAP[1] - 20, r, 0, TAU); g.fill(); }
    // firefly trails, added light; blinking makes dashed trails; the rain washes them down
    g.lineCap = 'round'; const fade = 1 - rain * 0.8;
    F.forEach((f, i) => {
      const end = t - f.t0; if (end <= 0) return;
      const pts = []; for (let tau = 0; tau <= end; tau += 0.04) pts.push(pos(f, i, tau)); pts.push(pos(f, i, end));
      for (const [w, a] of [[10, 0.06], [4.5, 0.22], [2, 0.9]]) {
        g.strokeStyle = `rgba(206,255,110,${a * fade})`; g.lineWidth = w; g.setLineDash([f.dash, f.gap]);
        g.beginPath(); pts.forEach(([x, y], j) => j ? g.lineTo(x, y) : g.moveTo(x, y)); g.stroke(); }
      const [hx, hy] = pts[pts.length - 1]; g.setLineDash([]); g.fillStyle = `rgba(240,255,190,${0.9 * fade})`; g.beginPath(); g.arc(hx, hy, 4, 0, TAU); g.fill(); });
    g.setLineDash([]);
    // light-painted 大暑: written in the air above the pond earlier in the exposure; the rain blurs it a little
    g.font = '210px "Xingkai SC", "Kaiti SC", serif'; g.textAlign = 'left'; g.textBaseline = 'middle'; g.lineJoin = 'round';
    for (const [w, c] of [[26, 'rgba(255,120,40,0.10)'], [12, 'rgba(255,150,70,0.35)'], [4, `rgba(255,240,210,${0.95 - rain * 0.3})`]]) { g.strokeStyle = c; g.lineWidth = w; g.strokeText('大暑', 880, 530); }
    g.restore();
    // 大雨时行: the rain builds from a drizzle to a downpour; streaks catch the lamp light; rings splash on the pond
    if (rain > 0) {
      const R = JQ.rng(4000 + Math.floor(t * 12)), n = Math.round(260 + rain * 1300), A = new Path2D(), B = new Path2D();
      for (let i = 0; i < n; i++) { const x = R() * 2100 - 120, y0 = R() * 1180 - 120, len = 90 + rain * 110, near = x > 1420 && x < 1900 && y0 > 420;
        (near ? A : B).moveTo(x, y0); (near ? A : B).lineTo(x - 22 - rain * 10, y0 + len); }
      g.save(); g.globalCompositeOperation = 'lighter'; g.lineWidth = 1.5 + rain * 0.6;
      g.strokeStyle = `rgba(255,214,170,${0.45 * rain})`; g.stroke(A); g.strokeStyle = `rgba(190,210,235,${0.22 + 0.12 * rain})`; g.stroke(B);
      g.save(); g.clip(S.pond.path); g.strokeStyle = `rgba(200,220,240,${0.35 * rain})`; g.lineWidth = 1.4;
      for (let i = 0; i < Math.round(40 * rain); i++) { const k = (t * 3 + JQ.hash(i, 2, 5)) % 1, x = L.pond.cx + (JQ.hash(i, Math.floor(t * 3 + JQ.hash(i, 2, 5)), 6) - 0.5) * 560, y = L.pond.cy + (JQ.hash(i, Math.floor(t * 3 + JQ.hash(i, 2, 5)), 7) - 0.5) * 160;
        g.beginPath(); g.ellipse(x, y, 4 + k * 22, 1.5 + k * 6, 0, 0, TAU); g.stroke(); }
      g.restore(); g.restore();
    }
    // grain, vignette, camera stamp: the pentad flickers on at each bar
    g.save(); g.globalCompositeOperation = 'overlay'; g.globalAlpha = 0.22; JQ.blit(g, K.grain(Sx, Math.floor(t * 12) % 4)); g.restore();
    const vg = g.createRadialGradient(960, 560, 380, 960, 560, 1150); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, `rgba(0,0,0,${0.62 + rain * 0.1})`); g.fillStyle = vg; g.fillRect(0, 0, 1920, 1080);
    const u = t - hou * BAR, on = hou === 0 || u > 0.24 || Math.floor(u * 25) % 2 === 0;
    g.save(); g.font = '600 46px "PingFang SC", sans-serif'; g.textAlign = 'right'; g.fillStyle = '#FF9A3C'; g.shadowColor = 'rgba(255,120,30,0.8)'; g.shadowBlur = 10;
    if (on) g.fillText(HOU[hou], 1830, 990); g.font = '600 26px Menlo, monospace'; g.fillText('BULB  f/2.8  ISO 800  ' + String(Math.floor(t * 3.75) + 1).padStart(2, '0') + '″', 1830, 1032); g.restore();
  } };
})();
