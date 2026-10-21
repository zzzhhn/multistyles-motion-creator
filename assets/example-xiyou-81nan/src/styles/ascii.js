// 63 终端字符画 · 城里遇灾 — a 1970 green-phosphor terminal. The scene is drawn into a coarse luminance buffer (one texel
// per character cell) and typeset from a glyph atlas: a brightness ramp, plus | - / \ chosen from the local gradient so
// contours read as line art. 狮驼城: crenellated wall, a two-tier gate tower, lit windows, the demons' giant steamer
// venting steam, the roc perched on a pagoda. Beat 3: one wingbeat carries it across the whole screen, the screen inverts,
// the city's windows die behind it right to left and the population counter in the log runs down to 0.
(() => {
  'use strict';
  const XY = window.XY, K = XY.KIT_G, TAU = XY.TAU;
  const CW = 9, CH = 15, RAMP = ' .:-=+*o#%@', EDGE = '|-/\\', GLYPHS = RAMP + EDGE, LEV = 4;
  const PH = ['#0A3A18', '#147030', '#26A04E', '#E2FFEA'], BGC = '#020A05', GREEN = '#46FF84';   // v10: scenery dimmed to ~30–60 %, only the roc, 灾 and the moon reach full phosphor
  const SWEEP = 4, TAKEOFF = 2.8, DIVE = 3.3;   // v10: 8 beats — the roc leaves its pagoda 2.8, dives at the screen 3.3–4.0, sweeps out by 4.7

  const atlas = S => XY.keep(`ascii-atlas2:${S.toFixed(4)}`, GLYPHS.length * CW * S, LEV * CH * S, cv => {
    const g = cv.getContext('2d'); g.font = XY.font(CH * 0.86 * S, 'Menlo, monospace', 'bold'); g.textBaseline = 'middle'; g.textAlign = 'center';
    for (let l = 0; l < LEV; l++) { g.fillStyle = PH[l]; for (let k = 0; k < GLYPHS.length; k++) g.fillText(GLYPHS[k], (k + 0.5) * CW * S, (l + 0.5) * CH * S); }
  });
  // ------------------------------------------------------------ scene pieces, drawn in design units into the buffer
  const roc = (g, x, y, s, flap, a = 1) => {   // 大鹏金翅雕, facing left: hooked beak, crest, long primaries, fan tail
    g.save(); g.translate(x, y); g.scale(s, s); g.globalAlpha = a;
    const wing = (d, c) => { const r = flap * 0.7 * d; g.save(); g.translate(10, -4); g.rotate(r); g.fillStyle = c; g.beginPath(); g.moveTo(-40, 0);
      g.lineTo(-30, -90 * d); g.lineTo(0, -170 * d); g.lineTo(40, -250 * d); g.lineTo(60, -230 * d); g.lineTo(70, -170 * d); g.lineTo(84, -150 * d); g.lineTo(80, -90 * d); g.lineTo(96, -70 * d); g.lineTo(60, 0); g.closePath(); g.fill(); g.restore(); };
    wing(-1, '#9a9a9a'); wing(1, '#ffffff');
    g.fillStyle = '#fff'; g.beginPath(); g.ellipse(20, 0, 80, 26, 0, 0, TAU); g.fill();
    g.beginPath(); g.moveTo(-50, -12); g.lineTo(-92, -26); g.lineTo(-122, -16); g.lineTo(-134, -2); g.lineTo(-118, 2); g.lineTo(-100, 4); g.lineTo(-56, 14); g.fill();
    g.beginPath(); g.moveTo(-96, -24); g.lineTo(-84, -48); g.lineTo(-76, -26); g.fill();
    g.beginPath(); g.moveTo(90, -10); g.lineTo(170, -40); g.lineTo(180, -6); g.lineTo(176, 22); g.lineTo(90, 12); g.fill();
    g.fillStyle = '#000'; g.beginPath(); g.arc(-102, -14, 4.5, 0, TAU); g.fill();
    g.restore();
  };
  const roof = (g, cx, y, hw, h, c) => { g.fillStyle = c; g.beginPath(); g.moveTo(cx - hw - 30, y - 4); g.quadraticCurveTo(cx - hw * 0.6, y - h * 0.1, cx - hw * 0.45, y - h);
    g.lineTo(cx + hw * 0.45, y - h); g.quadraticCurveTo(cx + hw * 0.6, y - h * 0.1, cx + hw + 30, y - 4); g.lineTo(cx + hw, y + 6); g.lineTo(cx - hw, y + 6); g.closePath(); g.fill(); };
  const BLD = (() => { const R = XY.rng(6301), o = []; let x = -10; while (x < 1220) { const w = 50 + R() * 70, h = 90 + R() * 150; o.push([x, w, h, R() < 0.4]); x += w + 6; } return o; })();
  const city = (g, W, t, b, wave) => {
    // houses behind the wall, windows lit until the roc's wake passes over them
    BLD.forEach(([x, w, h, peak], i) => { const top = 560 - h; g.fillStyle = '#3c3c3c'; g.fillRect(x, top, w, h);
      if (peak) roof(g, x + w / 2, top, w / 2, 26, '#555');
      for (let wy = top + 14; wy < 548; wy += 30) for (let wx = x + 8; wx < x + w - 14; wx += 22) {
        const lit = wx < wave && XY.hash(Math.round(wx), Math.round(wy), Math.floor(t * 1.5 + wx * 0.01)) < 0.62; g.fillStyle = lit ? '#b8b8b8' : '#181818'; g.fillRect(wx, wy, 11, 16); } });
    // the pagoda the roc sits on
    for (let k = 0; k < 6; k++) { const y = 560 - k * 52, hw = 56 - k * 7; g.fillStyle = '#4a4a4a'; g.fillRect(1040 - hw * 0.7, y - 46, hw * 1.4, 46); roof(g, 1040, y - 44, hw, 18, '#7a7a7a'); }
    g.fillStyle = '#7a7a7a'; g.fillRect(1037, 220, 6, 34);
    // the steamer: four bamboo tiers and a lid, steam boiling off
    for (let k = 0; k < 4; k++) { const y = 552 - k * 38; g.fillStyle = k % 2 ? '#6a6a6a' : '#5a5a5a'; g.fillRect(806, y - 34, 150, 34); g.fillStyle = '#909090'; g.fillRect(806, y - 34, 150, 4); }
    g.fillStyle = '#8a8a8a'; g.beginPath(); g.ellipse(881, 398, 80, 14, 0, 0, TAU); g.fill(); g.fillRect(872, 380, 18, 10);
    for (let k = 0; k < 9; k++) { const f = (t * 0.55 + k / 9) % 1, x = 840 + (k % 3) * 40 + 30 * Math.sin(t * 1.3 + k) * f, y = 386 - f * 300, r = 10 + f * 34;
      g.fillStyle = `rgba(235,235,235,${0.55 * (1 - f)})`; g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill(); }
    // the wall with crenellations, the gate and its two-tier tower, a banner
    g.fillStyle = '#2c2c2c'; g.fillRect(0, 560, W, 142); g.fillStyle = '#6a6a6a'; for (let x = 0; x < W; x += 36) g.fillRect(x, 540, 22, 22); g.fillRect(0, 558, W, 5);
    g.fillStyle = '#383838'; for (let y = 590; y < 700; y += 30) for (let x = (y / 30 % 2) * 40; x < W; x += 80) g.fillRect(x, y, 74, 4);
    g.fillStyle = '#050505'; g.beginPath(); g.moveTo(560, 702); g.lineTo(560, 620); g.quadraticCurveTo(610, 570, 660, 620); g.lineTo(660, 702); g.fill();
    g.fillStyle = '#505050'; g.fillRect(520, 470, 180, 72); roof(g, 610, 470, 116, 34, '#8c8c8c'); g.fillStyle = '#4a4a4a'; g.fillRect(552, 404, 116, 40); roof(g, 610, 404, 84, 30, '#a0a0a0');
    for (let k = 0; k < 4; k++) { g.fillStyle = '#c8c8c8'; g.fillRect(538 + k * 44, 486, 14, 22); }
    g.strokeStyle = '#9a9a9a'; g.lineWidth = 3; g.beginPath(); g.moveTo(610, 372); g.lineTo(610, 300); g.stroke();
    g.fillStyle = '#d0d0d0'; g.beginPath(); g.moveTo(612, 302); for (let k = 0; k <= 8; k++) g.lineTo(612 + k * 8, 306 + 6 * Math.sin(k * 0.9 - t * 7)); for (let k = 8; k >= 0; k--) g.lineTo(612 + k * 8, 330 + 6 * Math.sin(k * 0.9 - t * 7)); g.fill();
  };
  // the pilgrims are not typeset: they are ANSI-style block graphics (4.5 × 7.5 design-px cells, three phosphor levels)
  // laid over the text screen, with a black rim so the scenery characters never run through them (R3: they were noise)
  const TB = { bright: '#E6FFEE', mid: '#7CFF9E', dark: '#2E9E55', ink: '#03140A' };
  const TROLE = { face: 'bright', skin: 'bright', skin2: 'bright', pig: 'bright', horse: 'bright', mane: 'bright', gold: 'bright', metal: 'bright', skull: 'bright', bundle: 'bright', tiger: 'bright',
    fur: 'mid', wkshirt: 'mid', kasaya: 'mid', robe: 'mid', ssrobe: 'mid', staff: 'bright', red: 'mid', saddle: 'dark', bjrobe: 'mid', wood: 'mid', pig2: 'mid', horse2: 'mid',
    ssrobe2: 'dark', bjpants: 'dark', ssh: 'mid', ssbeard: 'mid', stripe: 'ink', hoof: 'ink', ink: 'ink' };
  const TEAM = { outline: null, shade: false, color: r => TB[TROLE[r] || 'mid'] }, RIM = { color: () => '#000', outline: '#000', ow: 7, shade: false, fine: false };
  const gapTile = S => XY.keep(`ascii-gap:${S.toFixed(4)}`, Math.max(2, Math.round(4.5 * S)), Math.max(2, Math.round(7.5 * S)), cv => { const g = cv.getContext('2d'); g.fillStyle = '#000'; g.fillRect(cv.width - 1, 0, 1, cv.height); g.fillRect(0, cv.height - 1, cv.width, 1); });
  const actsAt = b => ({ wukong: { shade: K.win(b, 2.6, 3.9, 0.2), raise: K.win(b, 4.3, 6.3, 0.3) }, monk: { palm: K.win(b, 4.5, 7.2, 0.3) }, bajie: { scratch: K.win(b, 0.9, 2.2, 0.25) }, shaseng: { lift: K.win(b, 4.2, 5.4, 0.25) } });
  // 大鹏 diving at the screen, seen from below: wings spread across two thirds of the frame, hooked beak, fan tail, talons
  const rocDive = (g, x, y, s, flap) => {
    g.save(); g.translate(x, y); g.scale(s, s);
    [-1, 1].forEach(d => { const fy = flap * 70; g.fillStyle = '#ffffff'; g.beginPath(); g.moveTo(d * 30, -20); g.quadraticCurveTo(d * 170, -90 - fy * 0.4, d * 300, -96 - fy); g.lineTo(d * 410, -70 - fy * 1.3);
      for (let i = 0; i <= 8; i++) { const fx = d * (400 - i * 42), base = -40 - fy * (1 - i / 8) * 1.1; g.lineTo(fx, base + 70 - i * 3); g.lineTo(fx - d * 20, base + 30); } g.lineTo(d * 40, 30); g.closePath(); g.fill();
      g.fillStyle = '#a8a8a8'; g.beginPath(); g.moveTo(d * 40, -10); g.quadraticCurveTo(d * 160, -60 - fy * 0.4, d * 260, -64 - fy * 0.8); g.lineTo(d * 250, -30 - fy * 0.7); g.quadraticCurveTo(d * 150, -20, d * 40, 14); g.fill();
      g.strokeStyle = '#000'; g.lineWidth = 6; for (let i = 1; i < 8; i++) { const fx = d * (400 - i * 42); g.beginPath(); g.moveTo(fx - d * 10, -40 - fy * (1 - i / 8)); g.lineTo(fx - d * 4, -40 - fy * (1 - i / 8) * 1.1 + 60); g.stroke(); } });
    g.fillStyle = '#ffffff'; g.beginPath(); g.ellipse(0, 10, 52, 86, 0, 0, TAU); g.fill();
    g.beginPath(); g.moveTo(-54, 80); g.lineTo(-30, 170); g.lineTo(0, 150); g.lineTo(30, 170); g.lineTo(54, 80); g.fill();
    g.beginPath(); g.arc(0, -78, 40, 0, TAU); g.fill(); g.beginPath(); g.moveTo(-14, -112); g.lineTo(-4, -150); g.lineTo(6, -114); g.lineTo(18, -142); g.lineTo(22, -104); g.fill();
    g.fillStyle = '#000'; g.beginPath(); g.moveTo(-14, -60); g.lineTo(14, -60); g.lineTo(0, -16); g.fill();
    g.beginPath(); g.ellipse(-18, -84, 9, 6, 0.4, 0, TAU); g.ellipse(18, -84, 9, 6, -0.4, 0, TAU); g.fill();
    g.lineWidth = 8; g.strokeStyle = '#000'; [-1, 1].forEach(d => { g.beginPath(); g.moveTo(d * 20, 92); g.lineTo(d * 30, 128); g.lineTo(d * 18, 140); g.stroke(); });
    g.restore();
  };
  // the roc's flight: perched on the pagoda (side view) → takes off out of frame → dives at the screen and sweeps out to the left
  const rocAt = (b, t, W) => { if (b < TAKEOFF) return { x: 1046, y: 196, s: 0.55, flap: 0.15 * Math.sin(t * 2) - 0.3 };
    const q = (b - TAKEOFF) / (DIVE - TAKEOFF); return { x: 1046 + 120 * q, y: 196 - 320 * XY.easeIn(q), s: 0.55 + 0.4 * q, flap: Math.sin(q * 12) }; };
  const diveAt = b => { if (b < DIVE || b > SWEEP + 0.9) return null; if (b < SWEEP) { const q = XY.easeIn((b - DIVE) / (SWEEP - DIVE)); return { x: XY.lerp(820, 600, q), y: XY.lerp(110, 250, q), s: XY.lerp(0.2, 1, q), flap: Math.sin(b * 9) }; }
    const q = XY.easeIn((b - SWEEP) / 0.9); return { x: XY.lerp(600, -560, q), y: XY.lerp(250, 60, q), s: XY.lerp(1, 1.5, q), flap: Math.sin(b * 9) }; };
  // the luminance buffer is read back every frame: give it its own CPU-backed canvas from the start, otherwise Chrome
  // switches a GPU canvas to software after a few readbacks and the first frames rasterise differently (non-deterministic)
  let BUF = null;
  const bufCtx = (w, h) => { if (!BUF || BUF.canvas.width !== w || BUF.canvas.height !== h) { const cv = document.createElement('canvas'); cv.width = w; cv.height = h; BUF = cv.getContext('2d', { willReadFrequently: true }); }
    BUF.setTransform(1, 0, 0, 1, 0, 0); BUF.globalAlpha = 1; BUF.globalCompositeOperation = 'source-over'; BUF.filter = 'none'; BUF.clearRect(0, 0, w, h); return BUF; };
  const fmt = n => String(Math.max(0, Math.round(n))).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  XY.STYLES.ascii = {
    hits: [SWEEP],
    draw(g, e) {
      const { W, H, t, u, S } = e, b = e.beat, cols = Math.ceil(W / CW), rows = Math.ceil(H / CH), acts = actsAt(b), R0 = rocAt(b, t, W), D0 = diveAt(b);
      const wave = b < 3.7 ? 1e4 : W - (b - 3.7) * W * 1.4;   // the city's lights die right to left behind the roc
      // 1) the luminance buffer: one texel per character cell (scenery only; the pilgrims are block graphics, below)
      const c = bufCtx(cols, rows);
      c.setTransform(1 / CW, 0, 0, 1 / CH, 0, 0); c.fillStyle = '#000'; c.fillRect(0, 0, W, H);
      c.fillStyle = '#f4f4f4'; c.beginPath(); c.arc(858, 128, 46, 0, TAU); c.fill(); c.fillStyle = '#000'; c.beginPath(); c.arc(878, 114, 40, 0, TAU); c.fill();
      for (let k = 0; k < 24; k++) { const on = XY.hash(k, Math.floor(t * 3 + k)) < 0.7; if (on) { c.fillStyle = '#777'; c.fillRect(380 + XY.hash(k, 1) * 760, 60 + XY.hash(k, 2) * 200, 9, 15); } }
      { const zA = XY.clamp((u + 0.08) / 0.12) * (0.82 + 0.18 * Math.sin(t * 14)), gl = K.hit(b, SWEEP, 0.4); c.font = XY.font(320, XY.cnFont.hei, '900'); c.textBaseline = 'top';
        for (let k = 0; k < 4; k++) { c.save(); c.beginPath(); c.rect(0, 60 + k * 80, 460, 80); c.clip(); c.fillStyle = `rgba(255,255,255,${zA})`; c.fillText('灾', 40 + gl * 60 * (XY.hash(k, K.step(t, 24)) - 0.5), 56); c.restore(); } }
      city(c, W, t, b, wave);
      c.fillStyle = '#9a9a9a'; c.fillRect(0, 702, W, 6);
      if (b < DIVE) roc(c, R0.x, R0.y, R0.s, R0.flap);
      if (D0) { for (let k = 4; k >= 1; k--) { const p = diveAt(b - k * 0.06); if (p) { c.save(); c.globalAlpha = Math.pow(0.5, k); rocDive(c, p.x, p.y, p.s, p.flap); c.restore(); } } rocDive(c, D0.x, D0.y, D0.s, D0.flap); }
      const lum = c.getImageData(0, 0, cols, rows).data, L = new Float32Array(cols * rows);
      for (let i = 0; i < L.length; i++) L[i] = lum[i * 4] / 255;
      // 2) typeset: ramp glyphs for fills, | - / \ along strong contours; scenery stays dim, white things go full phosphor
      g.save(); g.setTransform(1, 0, 0, 1, 0, 0);
      const cw = CW * S, ch = CH * S, A = atlas(S), Wd = Math.round(W * S), Hd = Math.round(H * S), f12 = K.step(t, 12);
      g.fillStyle = BGC; g.fillRect(0, 0, Wd, Hd);
      const tear = XY.hash(f12, 9) < 0.16 ? 4 + Math.floor(XY.hash(f12, 10) * (rows - 10)) : -1, NR = RAMP.length;
      for (let j = 3; j < rows - 4; j++) { const off = j === tear || j === tear + 1 ? (XY.hash(j, f12) - 0.5) * 70 * S : 0;
        for (let i = 0; i < cols; i++) { const o = j * cols + i, v = L[o]; if (v < 0.04) continue;
          const gx = (i < cols - 1 ? L[o + 1] : v) - (i > 0 ? L[o - 1] : v), gy = L[o + cols] - L[o - cols]; let k;
          if (v > 0.16 && gx * gx + gy * gy > 0.3) { let d = Math.atan2(gy / CH, gx / CW); d = ((d % Math.PI) + Math.PI) % Math.PI; k = NR + [0, 2, 1, 3][Math.round(d / (Math.PI / 4)) % 4]; }
          else k = Math.min(NR - 1, Math.floor(v * NR));
          g.drawImage(A, k * cw, (v > 0.9 ? 3 : Math.min(2, Math.floor(v * 3))) * ch, cw, ch, i * cw + off, j * ch, cw, ch); } }
      // the pilgrims as block graphics over the text screen
      if (K.visible(e)) { const bw = Math.ceil(W / 4.5), bh = Math.ceil(H / 7.5), tb = XY.scratch('ascii-team', bw, bh), tg = tb.getContext('2d');
        tg.setTransform(1 / 4.5, 0, 0, 1 / 7.5, 0, 0); XY.drawProcession(tg, e.phase, e.procX, e.groundY, RIM, acts); XY.drawProcession(tg, e.phase, e.procX, e.groundY, TEAM, acts);
        const lay = XY.scratch('ascii-team-up', Wd, Hd), lg2 = lay.getContext('2d'); lg2.imageSmoothingEnabled = false; lg2.drawImage(tb, 0, 0, bw * 4.5 * S, bh * 7.5 * S);
        if (S >= 1) { const gp = lg2.createPattern(gapTile(S), 'repeat'); lg2.globalCompositeOperation = 'destination-out'; lg2.fillStyle = gp; lg2.fillRect(0, 0, Wd, Hd); }
        g.drawImage(lay, 0, 0); }
      // 3) bloom, scanlines
      const layer = XY.scratch('ascii-bloom2', Wd / 4, Hd / 4), lg = layer.getContext('2d'); lg.drawImage(g.canvas, 0, 0, Wd, Hd, 0, 0, Wd / 4, Hd / 4);
      g.globalCompositeOperation = 'lighter'; g.globalAlpha = 0.55; g.filter = `blur(${3 * S}px)`; g.drawImage(layer, 0, 0, Wd, Hd); g.filter = 'none'; g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
      const scan = K.noiseTile('ascii-scan', 3, (d, n) => { for (let i = 0; i < n * n; i++) { d[i * 4 + 3] = Math.floor(i / n) === 2 ? 90 : 0; } }); scan.setTransform(new DOMMatrix());
      g.fillStyle = scan; g.fillRect(0, 0, Wd, Hd);
      g.restore();
      // 4) terminal chrome: inverse status bar, the log, the cursor
      g.fillStyle = GREEN; g.fillRect(18, 16, W - 36, 30); g.fillStyle = BGC; g.font = XY.font(22, 'Menlo, monospace', 'bold'); g.textBaseline = 'middle';
      g.fillText('SHITUO-CITY.EXE   STAGE 63/81   ' + (b < SWEEP ? 'DEMONS 47,000' : '!! ROC IN SECTOR'), 30, 32);
      g.textBaseline = 'alphabetic'; g.fillStyle = GREEN; g.font = XY.font(23, 'Menlo, monospace', 'bold');
      const l1 = '> scan 狮驼城 --population   # 第六十三难', n1 = Math.floor(XY.clamp((b + 0.4) / 1.6) * l1.length), pop = b < SWEEP ? 1e6 : 1e6 * (1 - XY.smooth((b - SWEEP) / 1));
      g.fillText(l1.slice(0, n1), 30, 740);
      let tail = 30 + g.measureText(l1.slice(0, n1)).width, ty = 740;
      if (b > 1.2) { const l2 = '  POPULATION ' + fmt(pop) + (pop < 1 ? '   城中无人 · 尽为妖' : ''); g.fillStyle = pop < 1 ? '#D8FFE6' : GREEN; g.fillText(l2, 30, 768); tail = 30 + g.measureText(l2).width; ty = 768; }
      if (Math.floor(t * 3) % 2) { g.fillStyle = GREEN; g.fillRect(tail + 6, ty - 20, 13, 24); }
      // the alert: population 0, inverse box, blinking frame
      if (b > SWEEP + 0.9) { const q = XY.easeOut(K.ramp(b, SWEEP + 0.9, 0.2)), bx = 590, by = 84, bw = 520 * q, bh = 150;
        g.fillStyle = BGC; g.fillRect(bx, by, bw, bh); g.strokeStyle = GREEN; g.lineWidth = 3; g.strokeRect(bx, by, bw, bh); if (Math.floor(t * 4) % 2) g.strokeRect(bx - 6, by - 6, bw + 12, bh + 12);
        if (q > 0.95) { g.fillStyle = GREEN; g.fillRect(bx, by, bw, 30); g.fillStyle = BGC; g.font = XY.font(20, 'Menlo, monospace', 'bold'); g.textBaseline = 'middle'; g.fillText('!! ALERT  狮驼城', bx + 12, by + 16);
          g.textBaseline = 'alphabetic'; g.fillStyle = '#E2FFEA'; g.font = XY.font(64, 'Menlo, monospace', 'bold'); g.fillText('人口  0', bx + 18, by + 96); g.font = XY.font(28, '"PingFang SC", sans-serif', '600'); g.fillStyle = GREEN; g.fillText('城中无人 · 尽为妖', bx + 18, by + 136); } }
      // 5) the wingbeat flashes the tube inverse; CRT glass: rounded mask, vignette, a little glare
      if ((b >= SWEEP && b < SWEEP + 0.1) || (b >= SWEEP + 0.18 && b < SWEEP + 0.24)) { g.save(); g.globalCompositeOperation = 'difference'; g.fillStyle = GREEN; g.fillRect(0, 0, W, H); g.restore(); }
      g.save(); g.fillStyle = '#000'; g.beginPath(); g.rect(0, 0, W, H); g.roundRect(8, 8, W - 16, H - 16, 46); g.fill('evenodd'); g.restore();
      const v = g.createRadialGradient(W / 2, H / 2, H * 0.32, W / 2, H / 2, W * 0.66); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,0.55)'); g.fillStyle = v; g.fillRect(0, 0, W, H);
      const gl = g.createLinearGradient(0, 0, W * 0.5, H * 0.5); gl.addColorStop(0, 'rgba(220,255,230,0.07)'); gl.addColorStop(1, 'rgba(220,255,230,0)'); g.fillStyle = gl; g.fillRect(0, 0, W, H);
    },
  };
})();
