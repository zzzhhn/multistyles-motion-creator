// s11 小暑 · 热成像 — 整场按温度渲染成伪彩（铁红色板），加仪器界面：色标、十字准星、温度读数、扫描线。
// 8 秒单元：候一 温风至（热气团从左滚到右）；候二 蟋蟀居壁（墙脚七只蟋蟀 3.55 秒起跳，4.000 一起落上墙，目标框锁定）；
// 候三 鹰始挚（鹰从左上俯冲扑到田边再拉起，热痕留在画面里慢慢变冷）。
(function () {
  const JQ = window.JQ, S = JQ.SCENE, L = JQ.L, TAU = Math.PI * 2;
  const SENSOR = 640;                                        // the sensor is coarse and fixed: 640 × 360 whatever the output size
  // iron palette, cold to hot: the classic 铁红 ramp, baked into a 256-entry lookup table
  const IRON = [[0, '#04020A'], [0.16, '#2E0A66'], [0.34, '#7A1160'], [0.5, '#B01838'],
    [0.64, '#D93A18'], [0.78, '#F0781E'], [0.9, '#F8C42E'], [1, '#FFFDE4']];
  const ramp = (v) => {
    v = JQ.clamp(v);
    for (let i = 1; i < IRON.length; i++) if (v <= IRON[i][0]) {
      const a = IRON[i - 1], b = IRON[i], k = (v - a[0]) / (b[0] - a[0]);
      return [1, 3, 5].map(j => Math.round(JQ.lerp(parseInt(a[1].slice(j, j + 2), 16), parseInt(b[1].slice(j, j + 2), 16), k)));
    }
    return [255, 253, 228];
  };
  const LUT = new Uint8Array(256 * 3); for (let i = 0; i < 256; i++) LUT.set(ramp(i / 255), i * 3);
  // fixed sensor grain and lens vignette per sensor size, as an additive offset and a gain
  const grainCache = {};
  const grain = (W, H) => { const k = W + 'x' + H; if (grainCache[k]) return grainCache[k];
    const off = new Float32Array(W * H), gain = new Float32Array(W * H);
    for (let y = 0, j = 0; y < H; y++) for (let x = 0; x < W; x++, j++) {
      off[j] = (JQ.noise(x * 0.35 * 614 / W, y * 0.35 * 614 / W, 5) - 0.5) * 0.07 * 255;
      gain[j] = (y < 6 || x < 6 || y > H - 7 || x > W - 7) ? 0.5 : 1; }
    return (grainCache[k] = { off, gain }); };

  const BAR = 8 / 3, IMPACT = BAR + 4 / 3;                   // 4.000: the crickets land on the wall
  const WIND = t => -420 + (t / 2.6) * 2700;                 // the billow's centre x: off-screen left at 0, off right by 2.6
  const heat = (g, v) => { const c = Math.round(JQ.clamp(v) * 255); g.fillStyle = 'rgb(' + c + ',' + c + ',' + c + ')'; };
  // crickets: they sit cool in the grass at the wall foot, warm up and stir in bar 2, leap at 3.55 and land on the wall at 4.000
  const CR = Array.from({ length: 7 }, (_, i) => ({ g: [1474 + i * 47, 846 + (i % 2) * 20], w: [1478 + i * 46, 742 + (i % 3) * 16], ph: i * 1.3 }));
  const cricketAt = (c, t) => {
    if (t < IMPACT - 0.45) { const s = JQ.smooth(BAR, BAR + 0.5, t), wob = Math.sin(t * 5 + c.ph) * 8 * s; return [c.g[0] + wob, c.g[1] + Math.cos(t * 4 + c.ph) * 3 * s, 0.55 + 0.25 * s, 0]; }
    const u = JQ.clamp((t - (IMPACT - 0.45)) / 0.45), x = JQ.lerp(c.g[0], c.w[0], u), y = JQ.lerp(c.g[1], c.w[1], u) - Math.sin(u * Math.PI) * 70;
    return [x, y, u < 1 ? 0.85 : 0.97, u];
  };
  // the hawk: dives from the top left, strikes at the field edge at 6.55, climbs out to the right; trajectory sampled for the heat trail
  const HAWK0 = 16 / 3, STRIKE = 6.55;
  const hawkAt = t => {
    if (t <= STRIKE) { const u = JQ.clamp((t - HAWK0) / (STRIKE - HAWK0)), e = u * u; return [JQ.lerp(500, 1050, u) + Math.sin(u * Math.PI) * 60, JQ.lerp(-70, 690, e)]; }
    const u = JQ.clamp((t - STRIKE) / 1.7); return [JQ.lerp(1050, 2010, u), JQ.lerp(690, -150, JQ.ease(u))];
  };

  // everything that does not move, drawn once at sensor resolution (640 × 360)
  const still = (g) => {
    g.fillStyle = '#000'; g.fillRect(0, 0, 1920, 1080);
    heat(g, 0.18); g.fillRect(0, 0, 1920, 440);                       // cold sky
    heat(g, 0.26); g.fill(S.mountains.path); heat(g, 0.22); g.fill(S.hills.path);
    heat(g, 0.44); g.fill(S.field.path);                              // sun-baked field
    g.save(); g.clip(S.field.path);                                    // 小暑: the millet is knee high, rows of warm plants on cooler soil
    for (let y = 440, r = 0; y < 700; y += 13 + r * 0.6, r++) { const h = 7 + r * 1.3; heat(g, 0.57 + (r % 2) * 0.04); for (let x = (r % 2) * 9; x < 1920; x += 18) { g.beginPath(); g.ellipse(x, y - h * 0.4, 3 + r * 0.25, h * 0.6, 0, 0, TAU); g.fill(); } }
    g.restore();
    S.furrows.forEach(f => { g.strokeStyle = 'rgba(120,120,120,0.35)'; g.lineWidth = 6; g.stroke(f.path); });
    heat(g, 0.56); g.fill(S.ground.path);                             // the yard, warm stone
    heat(g, 0.62); g.fill(S.path.path);
    heat(g, 0.2); g.fill(S.stream.path); heat(g, 0.18); g.fill(S.pond.path);   // water is the coldest thing here
    g.save(); g.clip(S.pond.path); heat(g, 0.15); g.fillRect(680, 820, 640, 100); g.restore();
    heat(g, 0.5); g.fill(S.pondRim.path); heat(g, 0.48); g.fill(S.bridge.path);
    heat(g, 0.5); g.fill(S.roof.path); heat(g, 0.52); g.fill(S.houseFront.path);
    heat(g, 0.7); g.fill(S.wall.path);                               // the sunlit wall is one of the hottest surfaces
    heat(g, 0.58); g.fill(S.wallCap.path); heat(g, 0.55); g.fill(S.gate.path);
    heat(g, 0.5); g.fill(S.gateRoof.path); heat(g, 0.6); g.fill(S.chimney.path);
    heat(g, 0.42); g.fill(S.trunk.path);
    g.strokeStyle = 'rgb(115,115,115)'; g.lineCap = 'round'; JQ.drawBranches(g, 3, 1.2);
    heat(g, 0.45); g.fill(S.canopy.path);
    S.clumps.forEach((q, i) => { heat(g, i % 2 ? 0.48 : 0.41); g.beginPath(); g.arc(q.x, q.y, q.r * 0.85, 0, TAU); g.fill(); });
    // grass at the wall foot, cooler than the stone
    heat(g, 0.4); g.beginPath(); g.ellipse(1610, 858, 190, 30, 0, 0, TAU); g.fill();
  };
  let stillC = null;
  const stillCanvas = () => { if (!stillC) { const c = document.createElement('canvas'); c.width = SENSOR; c.height = SENSOR * 9 / 16; const q = c.getContext('2d'); q.setTransform(SENSOR / 1920, 0, 0, SENSOR / 1920, 0, 0); still(q); stillC = c; } return stillC; };
  // the family: bodies are the hottest things in frame; buckets go out empty (air temperature) and come back full of cool water
  const HEAT = { skin: 0.95, hair: 0.74, coat: 0.9, pants: 0.85, apron: 0.87, hat: 0.66, straw: 0.64, scarf: 0.8, cape: 0.7, eye: 0.99,
    ox: 0.94, oxDark: 0.84, horn: 0.6, calf: 0.97, calfDark: 0.86, prop: 0.5, metal: 0.45, red: 0.6, line: 0.52 };
  const family = (g, Sx, t) => {
    for (const it of JQ.castFor(Sx, t).items) it.parts.forEach((q, j) => {
      let v = HEAT[q.role] != null ? HEAT[q.role] : 0.6;
      if (it.kind === 'pole' && q.role === 'prop' && j > 0) v = t > 3.4 && t < 8 ? 0.26 : 0.56;
      if (it.alpha != null && it.alpha < 1) v = JQ.lerp(0.5, v, it.alpha);
      heat(g, v); g.fill(q.path);
      if (it.kind === 'actor' && q.role !== 'eye') { g.strokeStyle = 'rgb(140,140,140)'; g.lineWidth = 3.5; g.lineJoin = 'round'; g.stroke(q.path); } });   // edge-enhanced (MSX-style) so overlapping warm bodies stay apart
  };
  const scene = (g, t, Sx) => {
    g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.drawImage(stillCanvas(), 0, 0, g.canvas.width, g.canvas.height); g.restore();
    family(g, Sx, t);
    // crickets: a hot body, big hind legs and antennae; a bloom where each one lands
    CR.forEach(c => { const [x, y, v, u] = cricketAt(c, t), a = u > 0 && u < 1 ? -0.6 : 0;
      heat(g, v * 0.75); g.beginPath(); g.arc(x, y, 22, 0, TAU); g.fill();
      heat(g, v); g.save(); g.translate(x, y); g.rotate(a); g.beginPath(); g.ellipse(0, 0, 17, 8, 0, 0, TAU); g.fill(); g.beginPath(); g.arc(-17, -1, 6, 0, TAU); g.fill();
      g.strokeStyle = g.fillStyle; g.lineWidth = 4; g.beginPath(); g.moveTo(6, 2); g.lineTo(20, -12); g.lineTo(30, 8); g.moveTo(-20, -4); g.lineTo(-40, -16); g.moveTo(-20, 0); g.lineTo(-42, -2); g.stroke(); g.restore(); });
    if (t >= IMPACT && t < IMPACT + 0.7) { const k = (t - IMPACT) / 0.7; g.save(); g.globalCompositeOperation = 'lighter';
      CR.forEach(c => { const gr = g.createRadialGradient(c.w[0], c.w[1], 0, c.w[0], c.w[1], 30 + k * 60); gr.addColorStop(0, 'rgba(110,110,110,' + (1 - k) + ')'); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.beginPath(); g.arc(c.w[0], c.w[1], 30 + k * 60, 0, TAU); g.fill(); });
      g.restore(); }
    // the hot wind: one rolling billow of warm air crossing the yard in bar 1; puffs orbit its centre, added on top as heat
    const wx = WIND(t), wy = 724 + Math.sin(t * 1.7) * 14;
    if (wx < 2400) { g.save(); g.globalCompositeOperation = 'lighter';
      for (let i = 0; i < 16; i++) {
        const a = i * 0.93 - t * 3.2, rr = 40 + (i % 5) * 34, pr = 70 + ((i * 37) % 60), x = wx + Math.cos(a) * rr * 1.5, y = wy + Math.sin(a) * rr * 0.6;
        const gr = g.createRadialGradient(x, y, 0, x, y, pr); gr.addColorStop(0, 'rgba(70,70,70,1)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
        g.fillStyle = gr; g.beginPath(); g.arc(x, y, pr, 0, TAU); g.fill(); }
      for (let i = 1; i < 6; i++) { const x = wx - i * 90, a = 0.5 / i, gr = g.createRadialGradient(x, wy + 20, 0, x, wy + 20, 90);
        gr.addColorStop(0, 'rgba(40,40,40,' + a + ')'); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.beginPath(); g.arc(x, wy + 20, 90, 0, TAU); g.fill(); }
      g.restore(); }
    // the hawk and its heat trail: the trail cools (dims) with age but stays to the end
    if (t > HAWK0) {
      g.save(); g.lineCap = 'round'; g.globalCompositeOperation = 'lighten';
      let prev = hawkAt(HAWK0);
      for (let tau = HAWK0 + 0.04; tau <= t + 1e-6; tau += 0.04) { const q = hawkAt(Math.min(tau, t)), age = t - tau, v = Math.round(130 * Math.exp(-age / 1.4) + 120);
        g.strokeStyle = 'rgb(' + v + ',' + v + ',' + v + ')'; g.lineWidth = 12; g.beginPath(); g.moveTo(prev[0], prev[1]); g.lineTo(q[0], q[1]); g.stroke(); prev = q; }
      g.restore();
      const [hx, hy] = hawkAt(t), q2 = hawkAt(t + 0.03), ang = Math.atan2(q2[0] - hx, -(q2[1] - hy) - 1e-6), flap = t > STRIKE ? Math.sin(t * 16) * 0.5 : 0.15;
      if (hy > -80) { heat(g, 1.0); g.save(); g.translate(hx, hy); g.rotate(ang);
        g.beginPath(); g.ellipse(0, 0, 12, 26, 0, 0, TAU); g.fill();
        [-1, 1].forEach(d => { g.beginPath(); g.moveTo(0, -6); g.lineTo(d * 70, -30 - flap * 30); g.lineTo(d * 40, 8); g.closePath(); g.fill(); });
        g.beginPath(); g.moveTo(-8, 20); g.lineTo(0, 44); g.lineTo(8, 20); g.fill(); g.restore(); }
      if (t > STRIKE - 0.05 && t < STRIKE + 0.6) { const k = (t - STRIKE + 0.05) / 0.65; g.save(); g.globalCompositeOperation = 'lighter';
        const gr = g.createRadialGradient(1050, 700, 0, 1050, 700, 40 + k * 90); gr.addColorStop(0, 'rgba(120,120,120,' + (1 - k) + ')'); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.beginPath(); g.arc(1050, 700, 40 + k * 90, 0, TAU); g.fill(); g.restore(); }
    }
  };
  JQ._s11 = { SENSOR, LUT, grain, scene, ramp, IRON, BAR, IMPACT, WIND, CR, STRIKE, HAWK0 };
})();
(function () {
  const JQ = window.JQ, TAU = Math.PI * 2, K = JQ._s11, { SENSOR, LUT, grain, scene, IRON, BAR, IMPACT, WIND, CR, STRIKE, HAWK0 } = K;
  const F = '"Menlo","Courier New",monospace', HOU = JQ.TERMS[10].hou, CREAM = '#FFFDE4';
  // the static part of the instrument face (cached): corner brackets, model line, term name, colour bar, faint scan grid
  const hudStatic = (g) => {
    g.textBaseline = 'alphabetic'; g.textAlign = 'left';
    g.strokeStyle = 'rgba(255,240,190,0.85)'; g.lineWidth = 3;
    [[90, 76, 1, 1], [1830, 76, -1, 1], [90, 1004, 1, -1], [1830, 1004, -1, -1]].forEach(([x, y, sx, sy]) => { g.beginPath(); g.moveTo(x + 60 * sx, y); g.lineTo(x, y); g.lineTo(x, y + 60 * sy); g.stroke(); });
    g.fillStyle = CREAM; g.font = '600 26px ' + F; g.fillText('OND · 热像仪 T-11', 120, 124);
    g.font = '700 78px "PingFang SC","Heiti SC",sans-serif'; g.fillText('小暑', 120, 208);
    g.font = '500 22px ' + F; g.fillStyle = 'rgba(255,240,190,0.8)'; g.fillText('EMISS ε 0.95   PAL IRON   RANGE 12–64°C', 120, 300);
    const bx = 1764, by = 240, bh = 560, gr = g.createLinearGradient(0, by + bh, 0, by); IRON.forEach(([k, c]) => gr.addColorStop(k, c));
    g.fillStyle = gr; g.fillRect(bx, by, 34, bh); g.strokeStyle = 'rgba(255,240,190,0.8)'; g.lineWidth = 2; g.strokeRect(bx, by, 34, bh);
    g.fillStyle = CREAM; g.font = '500 20px ' + F; g.textAlign = 'right';
    [64, 52, 40, 28, 12].forEach((v, i) => { const y = by + i * bh / 4; g.fillText(v + '°', bx - 10, y + 7); g.beginPath(); g.moveTo(bx - 4, y); g.lineTo(bx + 2, y); g.stroke(); });
    g.globalAlpha = 0.06; g.fillStyle = CREAM; for (let y = 0; y < 1080; y += 4) g.fillRect(0, y, 1920, 1); g.globalAlpha = 1;
  };
  const box = (g, x, y, w, h, s) => { const c = 18 * s; [[x, y, 1, 1], [x + w, y, -1, 1], [x, y + h, 1, -1], [x + w, y + h, -1, -1]].forEach(([px, py, sx, sy]) => { g.beginPath(); g.moveTo(px + c * sx, py); g.lineTo(px, py); g.lineTo(px, py + c * sy); g.stroke(); }); };
  const hudLive = (g, t) => {
    const hou = Math.min(2, Math.floor(t / BAR)), u = t - hou * BAR;
    g.textBaseline = 'alphabetic'; g.textAlign = 'left'; g.fillStyle = CREAM;
    // the pentad, typed out at the start of each bar with a block cursor
    const txt = HOU[hou], n = hou === 0 && t < 0.01 ? txt.length : Math.min(txt.length, Math.floor(u / 0.09) + 1);
    g.font = '600 46px "PingFang SC","Heiti SC",sans-serif'; g.fillText(txt.slice(0, n), 120, 262);
    if (u < 0.7 && Math.floor(u * 6) % 2 === 0) { const w = g.measureText(txt.slice(0, n)).width; g.fillRect(126 + w, 226, 22, 40); }
    g.font = '500 22px ' + F; g.fillStyle = 'rgba(255,240,190,0.8)'; g.textAlign = 'right'; g.fillText('PENTAD ' + (hou + 1) + '/3', 1800, 124); g.textAlign = 'left';   // outside the engine's title band
    // crosshair on the pond: the reading climbs as the hot billow passes
    const cx = 985, cy = 855; g.strokeStyle = 'rgba(255,245,210,0.95)'; g.lineWidth = 2.5;
    g.beginPath(); g.moveTo(cx - 46, cy); g.lineTo(cx - 14, cy); g.moveTo(cx + 14, cy); g.lineTo(cx + 46, cy); g.moveTo(cx, cy - 46); g.lineTo(cx, cy - 14); g.moveTo(cx, cy + 14); g.lineTo(cx, cy + 46); g.stroke();
    g.beginPath(); g.arc(cx, cy, 24, 0, TAU); g.stroke();
    const near = Math.exp(-Math.pow((WIND(t) - cx) / 260, 2)), T = 23.6 + near * 14.8;
    g.fillStyle = CREAM; g.font = '600 24px ' + F; g.fillText('T ' + T.toFixed(1) + '°C  Δ ' + (near * 14.8).toFixed(1), cx + 62, cy + 8);
    // the cricket target: searching in bar 2, snaps shut and locks on the impact
    if (t >= BAR) { const lock = t >= IMPACT, s = lock ? 1 + 0.5 * (1 - JQ.smooth(IMPACT, IMPACT + 0.18, t)) : 1, x = 1444, y = 700, w = 340, h = 104;
      g.strokeStyle = lock ? 'rgba(255,250,220,1)' : 'rgba(255,245,210,0.6)'; g.lineWidth = lock ? 3 : 2;
      if (lock) { g.save(); g.translate(x + w / 2, y + h / 2); g.scale(s, s); box(g, -w / 2, -h / 2, w, h, 1.4); g.restore(); }
      else { const ox = Math.sin(t * 7) * 30, oy = 120 + Math.cos(t * 5) * 14; g.setLineDash([10, 8]); g.strokeRect(x + ox, y + oy, w, h * 0.7); g.setLineDash([]); }
      g.font = '600 22px ' + F; g.fillStyle = CREAM; g.fillText(lock ? 'LOCK  CUL ×7  38.4°C' : 'SEARCH …', 1452, lock ? 690 : 812 + Math.cos(t * 5) * 14); }
    // the hawk track in bar 3
    if (t > HAWK0 + 0.15 && t < 8.2) { const k = JQ.clamp((t - HAWK0) / (STRIKE - HAWK0)), hx = t <= STRIKE ? JQ.lerp(500, 1050, k) + Math.sin(k * Math.PI) * 60 : JQ.lerp(1050, 2010, JQ.clamp((t - STRIKE) / 1.7)),
        hy = t <= STRIKE ? JQ.lerp(-70, 690, k * k) : JQ.lerp(690, -150, JQ.ease(JQ.clamp((t - STRIKE) / 1.7)));
      if (hy > 110 && hx < 1700) { g.strokeStyle = 'rgba(255,245,210,0.9)'; g.lineWidth = 2; box(g, hx - 70, hy - 60, 140, 120, 1); g.font = '600 20px ' + F; g.fillText(t < STRIKE ? 'AVES  41.2°C  ↘' : 'AVES  41.6°C  STRIKE', hx + 80, hy - 40); } }
    // bottom readouts and one bright scan band sweeping down per bar
    g.fillStyle = 'rgba(255,240,190,0.9)'; g.font = '500 22px ' + F;
    const ff = String(Math.floor(t * 25) % 25).padStart(2, '0'), ss = String(14 + Math.floor(t)).padStart(2, '0');
    g.fillText('2026-07-07  14:32:' + ss + '.' + ff + '   AMB 38.4°C  RH 47%', 120, 976);
    g.textAlign = 'right'; g.fillText('SCAN 25 Hz   REC ●', 1800, 976);
    g.globalAlpha = 0.18; g.fillStyle = CREAM; g.fillRect(0, (u / BAR) * 1180 - 50, 1920, 22); g.globalAlpha = 1;
  };
  const warmed = new Set();
  JQ.ART[11] = {
    key: IMPACT, keyHou: JQ.TERMS[10].keyHou,
    focus: [[960, 724], [1614, 752], [1050, 690]],
    frame: false,
    draw(g, t, Sx) {
      t = JQ.clamp(t, 0, 9);
      const L1 = JQ.layer('s11heat', Sx, { res: SENSOR / (1920 * Sx.scale), read: true });
      if (!warmed.has(L1.c)) { warmed.add(L1.c); scene(L1.g, t, Sx); L1.g.getImageData(0, 0, 4, 4); }   // first-touch readback upsets the first frame
      scene(L1.g, t, Sx);
      const W = L1.c.width, H = L1.c.height, img = L1.g.getImageData(0, 0, W, H), d = img.data, G = grain(W, H), off = G.off, gain = G.gain;
      for (let j = 0, i = 0, n = W * H; j < n; j++, i += 4) { let v = (d[i] + off[j]) * gain[j]; v = v < 0 ? 0 : v > 255 ? 255 : v | 0; const o = v * 3; d[i] = LUT[o]; d[i + 1] = LUT[o + 1]; d[i + 2] = LUT[o + 2]; }
      L1.g.putImageData(img, 0, 0);
      g.imageSmoothingEnabled = true; g.imageSmoothingQuality = 'low'; JQ.blit(g, L1);   // low = plain bilinear, stable
      JQ.blit(g, JQ.cached('s11hud', Sx, hudStatic));
      hudLive(g, t);
    } };
})();
