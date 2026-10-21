// 56 黑色电影 · 朱紫国行医 — a 1945 noir set: venetian-blind light bars across a dark sickroom, rain on the window,
// incense smoke drifting through the bars, a frosted-glass door lettered like a detective's office. 悟空 takes the
// king's pulse on three golden threads run out through the bed curtains (悬丝诊脉); the pulse throbs along them on
// every beat. Beat 3: lightning — and on the wall two bird shadows fly apart: the diagnosis, 双鸟失群.
(() => {
  'use strict';
  const XY = window.XY, K = XY.KIT_G, TAU = XY.TAU;
  const WIN = [110, 96, 300, 380], DOOR = [470, 118, 232, 524], FLOOR = 640, WRIST = [936, 548], HOOK = [884, 222];
  const gray = v => { v = Math.round(XY.clamp(v) * 255); return `rgb(${v},${v},${v})`; };

  // ------------------------------------------------------------ static set
  const roofs = (g, x0, y0, w, h) => {
    g.fillStyle = '#5E6266'; g.fillRect(x0, y0, w, h);
    const sky = g.createLinearGradient(0, y0, 0, y0 + h); sky.addColorStop(0, '#7C8084'); sky.addColorStop(1, '#4A4E52'); g.fillStyle = sky; g.fillRect(x0, y0, w, h);
    g.fillStyle = 'rgba(230,232,235,0.5)'; g.beginPath(); g.arc(x0 + w * 0.72, y0 + 70, 26, 0, TAU); g.fill();
    const eave = (cx, by, hw, rh, c) => { g.fillStyle = c; g.beginPath(); g.moveTo(cx - hw - 26, by - rh * 0.25); g.quadraticCurveTo(cx - hw * 0.6, by - rh * 0.1, cx - hw * 0.5, by - rh);
      g.lineTo(cx + hw * 0.5, by - rh); g.quadraticCurveTo(cx + hw * 0.6, by - rh * 0.1, cx + hw + 26, by - rh * 0.25); g.lineTo(cx + hw, by); g.lineTo(cx + hw, y0 + h); g.lineTo(cx - hw, y0 + h); g.lineTo(cx - hw, by); g.fill(); };
    eave(x0 + 70, y0 + 250, 70, 60, '#3A3D40'); eave(x0 + 210, y0 + 210, 90, 80, '#2E3134'); eave(x0 + 140, y0 + 320, 120, 50, '#232528');
    g.fillStyle = '#C9C6B8'; for (let k = 0; k < 9; k++) g.fillRect(x0 + 20 + k * 31, y0 + 300 + (k % 3) * 6, 6, 9);
  };
  const setBg = (g, W, H) => {
    // wall: dark plaster with a faint damask, wainscot, floor boards in perspective
    g.fillStyle = '#2E2E2F'; g.fillRect(0, 0, W, FLOOR);
    const R = XY.rng(5601);
    for (let y = 30; y < FLOOR - 120; y += 64) for (let x = (y / 64 % 2) * 40; x < W; x += 80) { g.strokeStyle = 'rgba(255,255,255,0.035)'; g.lineWidth = 2; g.beginPath(); g.ellipse(x, y, 14, 22, 0, 0, TAU); g.stroke(); }
    g.fillStyle = '#242425'; g.fillRect(0, FLOOR - 120, W, 120); g.fillStyle = '#3A3A3B'; g.fillRect(0, FLOOR - 124, W, 6);
    for (let x = 30; x < W; x += 110) { g.strokeStyle = '#1B1B1C'; g.lineWidth = 3; g.strokeRect(x, FLOOR - 104, 86, 86); }
    g.fillStyle = '#1C1C1D'; g.fillRect(0, FLOOR, W, H - FLOOR);
    g.strokeStyle = '#2B2B2C'; g.lineWidth = 2; for (let k = -14; k < 26; k++) { g.beginPath(); g.moveTo(W / 2 + k * 18, FLOOR); g.lineTo(W / 2 + k * 90, H); g.stroke(); }
    for (let k = 1; k < 6; k++) { const y = FLOOR + Math.pow(k / 6, 1.6) * (H - FLOOR); g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke(); }
    g.fillStyle = '#121213'; g.fillRect(0, FLOOR - 2, W, 4);
    // the window (outside drawn here; rain and blinds come later)
    const [wx, wy, ww, wh] = WIN; roofs(g, wx, wy, ww, wh);
    // the imperial notice (皇榜) calling for a physician, pasted on the wall: its lower corner torn off where 悟空 took it
    const [dx, dy, dw, dh] = DOOR, bot = dy + 420, torn = [dx + dw, bot - 90, dx + dw - 40, bot - 70, dx + dw - 70, bot - 30, dx + dw - 96, bot];
    g.fillStyle = 'rgba(0,0,0,0.5)'; XY.path(g, [dx + 8, dy + 10, dx + dw + 8, dy + 10, ...torn.map((v, i) => v + (i % 2 ? 10 : 8)), dx + 8, bot + 10], true); g.fill();
    const pg = g.createLinearGradient(dx, dy, dx + dw, bot); pg.addColorStop(0, '#A9A69C'); pg.addColorStop(1, '#77756E');
    g.fillStyle = pg; XY.path(g, [dx, dy, dx + dw, dy, ...torn, dx, bot], true); g.fill();
    for (let k = 0; k < 700; k++) { g.fillStyle = R() < 0.5 ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)'; g.fillRect(dx + R() * dw, dy + R() * (bot - dy), 2, 2); }
    g.fillStyle = '#2A2A2A'; g.fillRect(dx, dy, dw, 12); g.fillRect(dx, dy + 12, dw, 2);
    K.text(g, '皇  榜', dx + dw / 2, dy + 46, XY.font(28, XY.cnFont.song, 'bold'), '#1E1E1E', { align: 'center' });
    K.text(g, '行医', dx + dw / 2, dy + 160, XY.font(100, XY.cnFont.song, '900'), '#141414', { align: 'center', stroke: '#C9C4B4', lw: 3, shadow: 'rgba(0,0,0,0.25)', sx: 3, sy: 3 });
    K.text(g, '第五十六难', dx + dw / 2, dy + 210, XY.font(30, XY.cnFont.song, 'bold'), '#1E1E1E', { align: 'center' });
    g.fillStyle = '#1E1E1E'; g.fillRect(dx + 30, dy + 226, dw - 60, 2);
    for (let c = 0; c < 8; c++) for (let r = 0; r < 9; r++) { const x = dx + dw - 34 - c * 24, y = dy + 244 + r * 17; if (x > dx + dw - 100 && y > bot - 110) continue; g.fillStyle = 'rgba(30,30,30,0.7)'; g.fillRect(x, y, 10 + 4 * XY.hash(c, r, 56), 3); }
    g.fillStyle = '#3A3A3A'; g.fillRect(dx + 26, bot - 72, 46, 46); g.fillStyle = '#9C998F'; g.fillRect(dx + 32, bot - 66, 34, 34);
    K.text(g, '朱紫', dx + 49, bot - 44, XY.font(14, XY.cnFont.song, 'bold'), '#3A3A3A', { align: 'center' });
    g.fillStyle = '#1A1A1A'; [[dx + 10, dy + 22], [dx + dw - 10, dy + 22], [dx + 10, bot - 10]].forEach(([x, y]) => { g.beginPath(); g.arc(x, y, 4, 0, TAU); g.fill(); });
    // the canopy bed (curtains are drawn over the king later)
    g.fillStyle = '#151516'; g.fillRect(872, 214, 20, FLOOR - 214);
    g.fillStyle = '#1B1B1C'; g.beginPath(); g.moveTo(852, 214); g.lineTo(W, 214); g.lineTo(W, 178); g.quadraticCurveTo(1040, 150, 870, 186); g.fill();
    g.fillStyle = '#3B3B3C'; for (let x = 882; x < W; x += 26) { g.beginPath(); g.arc(x, 216, 11, 0, Math.PI); g.fill(); }
    g.fillStyle = '#9A968A'; g.beginPath(); g.arc(HOOK[0], HOOK[1], 6, 0, TAU); g.fill();
    g.fillStyle = '#2A2A2B'; g.fillRect(890, 560, W - 890, 46); g.fillStyle = '#171718'; g.fillRect(890, 600, W - 890, 40);
    g.fillStyle = '#404042'; g.fillRect(898, 528, W - 898, 36);
  };
  // curtains: translucent gauze in folds, open at the left where the threads come out
  const curtains = (g) => {
    for (let k = 0; k < 12; k++) { const x = 902 + k * 24.5, a = 0.16 + 0.07 * (k % 2);
      g.fillStyle = `rgba(214,214,210,${a})`; g.beginPath(); g.moveTo(x, 224); g.quadraticCurveTo(x + 14, 400, x + (k < 2 ? -18 + k * 9 : 2), 606); g.lineTo(x + 26, 606); g.quadraticCurveTo(x + 30, 400, x + 24, 224); g.fill(); }
    g.fillStyle = 'rgba(214,214,210,0.32)'; g.beginPath(); g.moveTo(892, 224); g.quadraticCurveTo(858, 420, 890, 610); g.lineTo(904, 610); g.quadraticCurveTo(886, 420, 918, 224); g.fill();
    g.strokeStyle = 'rgba(30,30,30,0.6)'; g.lineWidth = 3; g.beginPath(); g.moveTo(884, 430); g.quadraticCurveTo(902, 440, 924, 428); g.stroke();
  };
  const blinds = (g) => {
    const [x, y, w, h] = WIN;
    g.fillStyle = '#121213'; g.fillRect(x - 18, y - 18, w + 36, 18); g.fillRect(x - 18, y + h, w + 36, 22); g.fillRect(x - 18, y, 18, h); g.fillRect(x + w, y, 18, h); g.fillRect(x + w / 2 - 5, y, 10, h);
    for (let s = y + 6; s < y + h; s += 22) { g.fillStyle = '#58585A'; g.fillRect(x, s, w, 11); g.fillStyle = '#7A7A7C'; g.fillRect(x, s, w, 3); }
    g.strokeStyle = '#2A2A2B'; g.lineWidth = 2; [x + 50, x + w - 50].forEach(cx => { g.beginPath(); g.moveTo(cx, y); g.lineTo(cx, y + h); g.stroke(); });
  };
  // foreground: a pillar, the medicine table (乌金丹 in a bowl, 无根水 in a cup), the pendant lamp's cord
  const fg = (g, W, H) => {
    g.fillStyle = '#060606'; g.fillRect(0, 0, 34, H); g.fillRect(34, 0, 10, H); g.fillStyle = '#141414'; g.fillRect(36, 0, 3, H);
    g.fillStyle = '#070707'; g.fillRect(60, 676, 170, 14); g.fillRect(74, 690, 12, 90); g.fillRect(204, 690, 12, 90);
    g.beginPath(); g.ellipse(112, 668, 40, 12, 0, 0, TAU); g.fill(); g.fillRect(72, 652, 80, 16);
    g.fillStyle = '#1A1A1A'; [[96, 652], [112, 648], [128, 653]].forEach(([x, y]) => { g.beginPath(); g.arc(x, y, 7, 0, TAU); g.fill(); });
    g.fillStyle = '#070707'; g.fillRect(170, 630, 30, 46); g.beginPath(); g.ellipse(185, 630, 15, 5, 0, 0, TAU); g.fill();
    // vignette
    const v = g.createRadialGradient(W / 2, H * 0.48, H * 0.3, W / 2, H * 0.5, W * 0.62); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,0.62)'); g.fillStyle = v; g.fillRect(0, 0, W, H);
  };
  const bird = (g, x, y, s, flap, dir) => {
    g.save(); g.translate(x, y); g.scale(s * dir, s);
    g.beginPath(); g.ellipse(0, 0, 34, 11, -0.1, 0, TAU); g.fill();
    g.beginPath(); g.moveTo(30, -4); g.quadraticCurveTo(46, -10, 52, -2); g.lineTo(40, 4); g.fill();                     // head, beak
    g.beginPath(); g.moveTo(-30, -2); g.lineTo(-62, -14); g.lineTo(-58, 2); g.lineTo(-62, 14); g.lineTo(-28, 4); g.fill(); // forked tail
    const a = Math.sin(flap) * 0.9;
    [[1, 0], [-1, 0.25]].forEach(([d, o]) => { g.save(); g.rotate(-a * d * 0.6 + o * 0.2); g.beginPath(); g.moveTo(-10, -4); g.quadraticCurveTo(-4, -60 * Math.cos(a) * d - 8, 26, -86 * d * Math.cos(a)); g.quadraticCurveTo(14, -30 * d, 12, -2); g.fill(); g.restore(); });
    g.restore();
  };
  const king = (g, t, fit = 0) => {   // the sick king behind the gauze: propped on a pillow, coughing every so often
    const c = Math.max(0, Math.sin(t * 7)) * K.win((t % 1.9) / 1.9, 0.05, 0.3, 0.04), lift = 6 * c + 14 * fit * Math.abs(Math.sin(t * 16));
    g.save(); g.translate(120, 0); g.fillStyle = '#0E0E0F';
    g.beginPath(); g.ellipse(846, 506 - lift, 24, 27, -0.3, 0, TAU); g.fill();
    g.beginPath(); g.moveTo(830, 488 - lift); g.lineTo(840, 462 - lift); g.lineTo(850, 476 - lift); g.lineTo(860, 458 - lift); g.lineTo(868, 486 - lift); g.fill();     // crown
    g.beginPath(); g.moveTo(860, 520 - lift); g.quadraticCurveTo(900, 500 - lift * 0.6, 960, 516); g.quadraticCurveTo(1060, 500, 1120, 528); g.lineTo(1120, 560); g.lineTo(830, 560); g.fill();
    g.strokeStyle = '#0E0E0F'; g.lineWidth = 11; g.lineCap = 'round'; g.beginPath(); g.moveTo(866, 530 - lift * 0.5); g.quadraticCurveTo(836, 552, WRIST[0] - 114, WRIST[1]); g.stroke(); g.restore();
  };
  const PEN = { color: r => { const c = XY.DEFAULT_COLORS[r] || '#888', n = parseInt(c.slice(1), 16), v = (0.3 * (n >> 16) + 0.59 * ((n >> 8) & 255) + 0.11 * (n & 255)) / 255;
    return gray(r === 'ink' || r === 'stripe' ? 0.04 : 0.08 + 0.52 * v); }, outline: '#080808', ow: 1.3, shade: 'rgba(0,0,0,0.45)' };
  const SIL = K.SIL('#000');
  const actsAt = b => ({ monk: { palm: K.win(b, 2.4, 6.4, 0.4) }, wukong: { shade: K.win(b, 4.4, 5.4, 0.15) }, bajie: { scratch: K.win(b, 6.6, 11, 0.3) } });
  const FLASH = 4.5, JOLT = 2.8;   // v10: the king's fit at 2.8, lightning and the parting birds at 4.5
  // light bars from the blinds: parallel sheared bands across wall, bed, floor and pilgrims
  const bars = (g, W, H, off, alpha, col) => {
    g.save(); g.beginPath(); g.moveTo(560, 0); g.lineTo(W, 0); g.lineTo(W, H); g.lineTo(250, H); g.closePath(); g.clip();
    g.fillStyle = col; g.globalAlpha = alpha; g.beginPath();
    for (let k = -4; k < 15; k++) { const y0 = 40 + k * 46 + off, th = 17 + 3 * Math.sin(k * 1.7), x0 = 250;
      g.moveTo(x0, y0); g.lineTo(W, y0 + (W - x0) * 0.3); g.lineTo(W, y0 + th + (W - x0) * 0.32); g.lineTo(x0, y0 + th); g.closePath(); }
    g.fill(); g.restore();
  };

  XY.STYLES.noir = {
    hits: [FLASH],
    bg(g, W, H) { setBg(g, W, H); },
    draw(g, e) {
      const { W, H, t, u, S } = e, b = e.beat, acts = actsAt(b), k4 = S.toFixed(4), vis = K.visible(e);
      const flash = Math.min(1, K.hit(b, FLASH, 0.22) + 0.7 * K.hit(b, FLASH + 0.42, 0.1)), fit = K.win(b, JOLT, JOLT + 1, 0.12);
      // rain beyond the blinds (and the lightning)
      g.save(); g.beginPath(); g.rect(WIN[0], WIN[1], WIN[2], WIN[3]); g.clip();
      if (flash > 0.02) { g.fillStyle = `rgba(236,238,244,${0.85 * flash})`; g.fillRect(WIN[0], WIN[1], WIN[2], WIN[3]); }
      g.strokeStyle = 'rgba(214,218,224,0.6)'; g.lineWidth = 1.5; g.beginPath();
      for (let k = 0; k < 80; k++) { const sp = 900 + 400 * XY.hash(k, 2), x = WIN[0] - 40 + XY.hash(k, 1) * (WIN[2] + 80), y = WIN[1] - 30 + ((t * sp + XY.hash(k, 3) * 999) % (WIN[3] + 60)); g.moveTo(x, y); g.lineTo(x - 9, y + 28); }
      g.stroke(); g.restore();
      blinds(g);
      // the patient behind the gauze
      king(g, t, fit); curtains(g);
      // the blind bars: a passing car sweeps them down into place on the entrance
      const sweep = -520 * (1 - XY.easeIO((u + 0.06) / 0.26));
      g.save(); g.globalCompositeOperation = 'screen'; bars(g, W, H, sweep, 0.26, '#E4E4E0'); g.restore();
      // big cast shadows on the wall from a low lamp out front: the pilgrims, and at beat 3 two birds parting
      const L = [380, 1160], kS = 1.2, sh = XY.scratch('noir-sh', Math.round(W * S), Math.round(H * S)), sg = sh.getContext('2d');
      if (vis) { sg.setTransform(S * kS, 0, 0, S * kS, S * (L[0] - kS * L[0]), S * (L[1] - kS * L[1])); XY.drawProcession(sg, e.phase, e.procX, e.groundY, SIL, acts); }
      sg.setTransform(S, 0, 0, S, 0, 0); sg.fillStyle = '#000';
      if (b > FLASH) { const q = (b - FLASH) / 3, sp = XY.easeIn(Math.min(1, q * 1.2));
        bird(sg, XY.lerp(780, 170, sp), 200 - 110 * sp + 24 * Math.sin(q * 5), 1.5 + 0.6 * sp, b * 9, -1);
        bird(sg, XY.lerp(1060, 1440, sp), 190 - 60 * sp + 22 * Math.sin(q * 5 + 2), 1.5 + 0.6 * sp, b * 9 + 1.3, 1); }
      g.save(); g.beginPath(); g.rect(0, 0, W, FLOOR); g.rect(WIN[0] - 18, WIN[1] - 18, WIN[2] + 36, WIN[3] + 40); g.clip('evenodd'); g.globalAlpha = 0.62 + 0.3 * flash; g.drawImage(sh, 0, 0, W, H); g.restore();
      // incense burner by the bed, smoke curling up through the light
      g.fillStyle = '#0B0B0C'; g.fillRect(782, 600, 4, 40); g.fillRect(804, 600, 4, 40); g.beginPath(); g.ellipse(795, 596, 24, 10, 0, 0, TAU); g.fill(); g.fillRect(787, 578, 16, 16);
      g.lineCap = 'round';
      for (let k = 0; k < 3; k++) { g.beginPath();
        for (let j = 0; j <= 34; j++) { const y = 578 - j * 11, f = j / 34, x = 795 + 46 * f * XY.noise1(j * 0.16 - t * 0.8, k * 7) + 10 * Math.sin(j * 0.35 + t * 2 + k); j ? g.lineTo(x, y) : g.moveTo(x, y); }
        g.strokeStyle = `rgba(210,210,206,${0.13 - k * 0.03})`; g.lineWidth = 3 + k * 6; g.stroke(); }
      // the three golden threads (悬丝): from the king's wrist up over the canopy hook and down to 悟空's hand;
      // slack to the floor until he takes them, a pulse running down them on every beat
      const hand = e.at('wukong.handFar', acts), taut = XY.smooth((u - 0.04) / 0.18) * (1 - XY.smooth((u - 0.84) / 0.1));
      for (let k = 0; k < 3; k++) {
        const A = [WRIST[0], WRIST[1] + (k - 1) * 5], Hk = [HOOK[0] + (k - 1) * 3, HOOK[1]], rest = [HOOK[0] - 70 - 50 * k, 700 - k * 3];
        const Z = [XY.lerp(rest[0], hand[0], taut), XY.lerp(rest[1], hand[1] + (k - 1) * 3, taut)];
        const M = [(Hk[0] + Z[0]) / 2 - 40 * (1 - taut), (Hk[1] + Z[1]) / 2 + 12 + 90 * (1 - taut) + (2.5 + 9 * fit) * Math.sin(t * (11 + 14 * fit) + k)];
        g.beginPath(); g.moveTo(A[0], A[1]); g.lineTo(Hk[0], Hk[1]); g.quadraticCurveTo(M[0], M[1], Z[0], Z[1]);
        g.strokeStyle = 'rgba(240,232,200,0.16)'; g.lineWidth = 5; g.stroke(); g.strokeStyle = '#E6DEC2'; g.lineWidth = 1.4; g.stroke();
        if (taut > 0.7) { const bb = b > JOLT ? b * 2 : b, s = (bb - Math.floor(bb)) / 0.6; if (s < 1) { let x, y;
          if (s < 0.3) { x = XY.lerp(A[0], Hk[0], s / 0.3); y = XY.lerp(A[1], Hk[1], s / 0.3); } else { const v = (s - 0.3) / 0.7, q = 1 - v; x = q * q * Hk[0] + 2 * q * v * M[0] + v * v * Z[0]; y = q * q * Hk[1] + 2 * q * v * M[1] + v * v * Z[1]; }
          const rg = g.createRadialGradient(x, y, 0, x, y, 16); rg.addColorStop(0, 'rgba(255,252,236,0.95)'); rg.addColorStop(1, 'rgba(255,252,236,0)'); g.fillStyle = rg; g.fillRect(x - 16, y - 16, 32, 32); } }
      }
      // the pilgrims, lit by the same bars (bars painted only onto their own layer)
      if (vis) { const lay = K.procLayer('noir-proc', e, PEN, acts), lg = lay.getContext('2d');
        lg.globalCompositeOperation = 'source-atop'; bars(lg, W, H, sweep, 0.34, '#D8D8D4'); lg.globalCompositeOperation = 'source-over';
        g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.drawImage(lay, 0, 0); g.restore(); }
      // a palace lantern (宫灯) swinging on its cord: hexagonal frame, paper panels, tassels
      { const a = 0.07 * Math.sin(t * 1.4), lx = 620 + Math.sin(a) * 90, ly = 64;
        g.strokeStyle = '#0A0A0A'; g.lineWidth = 2; g.beginPath(); g.moveTo(620, 0); g.lineTo(lx, ly); g.stroke();
        const rg = g.createRadialGradient(lx, ly + 40, 0, lx, ly + 40, 120); rg.addColorStop(0, 'rgba(255,250,230,0.45)'); rg.addColorStop(1, 'rgba(255,250,230,0)'); g.fillStyle = rg; g.fillRect(lx - 120, ly - 80, 240, 240);
        g.save(); g.translate(lx, ly); g.rotate(-a);
        g.fillStyle = '#0C0C0C'; g.fillRect(-30, 0, 60, 8); g.fillRect(-26, 62, 52, 8);
        g.fillStyle = '#E8E3D0'; g.fillRect(-24, 8, 48, 54); g.fillStyle = '#0C0C0C'; [-24, -8, 8, 22].forEach(x => g.fillRect(x, 8, 3, 54));
        g.fillStyle = 'rgba(0,0,0,0.35)'; g.fillRect(-24, 30, 48, 4);
        for (let k = -2; k <= 2; k++) { const sw = 3 * Math.sin(t * 2.2 + k); g.fillRect(k * 11 - 1, 70, 2, 18); g.beginPath(); g.moveTo(k * 11 - 4 + sw, 88); g.lineTo(k * 11 + 4 + sw, 88); g.lineTo(k * 11 + sw, 104); g.fill(); }
        g.restore(); }
      g.drawImage(XY.cached(`noir-fg:${k4}`, W * S, H * S, cv => { const c = cv.getContext('2d'); c.scale(S, S); fg(c, W, H); }), 0, 0, W, H);
      g.strokeStyle = 'rgba(200,200,196,0.2)'; g.lineWidth = 4;
      for (let k = 0; k < 2; k++) { g.beginPath(); for (let j = 0; j <= 10; j++) { const y = 622 - j * 9, x = 185 + 7 * Math.sin(j * 0.6 - t * 3 + k * 2); j ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke(); }
      // lightning, flicker and grain
      if (flash > 0.01) { g.save(); g.globalCompositeOperation = 'screen'; g.fillStyle = `rgba(230,232,240,${0.3 * flash})`; g.fillRect(0, 0, W, H); g.restore(); }
      g.fillStyle = `rgba(0,0,0,${0.05 * XY.hash(K.step(t, 24), 7)})`; g.fillRect(0, 0, W, H);
      K.grain(g, e, K.noiseTile('noir', 256, (d, n) => { for (let i = 0; i < n * n; i++) { const v = 128 + (XY.hash(i, 5601) + XY.hash(i, 5602) - 1) * 150, o = i * 4; d[o] = d[o + 1] = d[o + 2] = v; d[o + 3] = 255; } }), 'overlay', 0.3, 24);
    },
  };
})();
