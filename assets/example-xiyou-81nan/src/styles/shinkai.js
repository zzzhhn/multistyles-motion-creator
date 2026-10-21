// 80 新海诚光影 · 凌云渡脱胎 — towering lit cumulus drifting over 凌云渡, 灵山 with its golden hall on the horizon, a sun
// glitter road on the water, the single-log bridge reaching into the haze. 接引佛祖 poles the bottomless boat (only the
// gunwales, water where the hull should be). Beat 3: Tang Seng's mortal body slips out of him — the same rig figure, gone
// grey — tumbles back into the river and floats away downstream, while the rider gains a halo and a gold rim light.
// Characters are cel-shaded: a hard shadow band and a warm rim made from offsets of their own silhouette.
(() => {
  'use strict';
  const XY = window.XY, K = XY.KIT_I, TAU = XY.TAU, { sin, cos, PI, hypot } = Math;
  const HZ = 452, BANK = 646, ARRIVE = 3.5, CORPSE = 6.5, GLORY = 9, LAND = [300, 594], sm = XY.smooth, win = K.win;
  const SUN = W => [W - 420, 150];

  // cumulus as a density field lit toward the sun; rendered once per scale (wider than the panel so it can drift)
  const clouds = (W, scale, ox) => {
    const k = Math.max(1, Math.round(2 / scale)), w = Math.ceil(W / k), h = Math.ceil(HZ / k), cv = XY.mk(w, h), g = cv.getContext('2d'), im = g.createImageData(w, h);
    const bodies = [[300 + ox, 318, 270, 160, 398], [700 + ox, 302, 118, 80, 372], [W - 170, 262, 250, 190, 392], [470 + ox, 380, 120, 46, 404], [140 + ox, 400, 150, 40, 420]];
    const dens = (x, y) => { let d = -1; for (const [cx, cy, rx, ry, base] of bodies) { const dx = (x - cx) / rx, dy = (y - cy) / ry; let v = 1 - dx * dx - dy * dy; const bz = base + 22 * XY.fbm(x / 120, 3, 12, 3); if (y > bz - 40) v -= (y - bz + 40) / 22; if (v > d) d = v; }
      return d + 0.42 * XY.fbm(x / 70, y / 70, 8, 5) + 0.18 * XY.fbm(x / 22, y / 22, 9, 2); };
    const lx = 0.6, ly = -0.8;
    for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
      const x = i * k, y = j * k, d = dens(x, y), o = (j * w + i) * 4; if (d <= -0.05) { im.data[o + 3] = 0; continue; }
      const lit = XY.clamp((d - dens(x + lx * 26, y + ly * 26)) * 1.9 + 0.5), a = XY.clamp((d + 0.05) / 0.16), core = XY.clamp(d / 0.9);
      const sh = [128, 148, 200], mid = [222, 230, 246], hi = [255, 250, 236];
      const c = lit < 0.5 ? sh.map((v, q) => XY.lerp(v, mid[q], lit * 2)) : mid.map((v, q) => XY.lerp(v, hi[q], (lit - 0.5) * 2));
      const rim = (1 - core) * lit * 46;
      im.data[o] = Math.min(255, c[0] + rim); im.data[o + 1] = Math.min(255, c[1] + rim * 0.86); im.data[o + 2] = Math.min(255, c[2] + rim * 0.55); im.data[o + 3] = a * 255;
    }
    g.putImageData(im, 0, 0); return cv;
  };
  const cloudLayer = (W, S) => XY.cached('i80cl:' + S.toFixed(4), (W + 120) * S, HZ * S, cv => { const g = cv.getContext('2d'); g.imageSmoothingQuality = 'high'; g.drawImage(clouds(W + 120, S, 60), 0, 0, cv.width, cv.height); });

  // land: horizon ranges and 灵山, the river with the sun road, the single-log bridge, the near bank, the ferry sign, reeds
  const ridge = (g, x0, x1, base, amp, f, seed, col) => { g.fillStyle = col; g.beginPath(); g.moveTo(x0, HZ + 2); for (let x = x0; x <= x1; x += 8) g.lineTo(x, base - amp * (0.5 + 0.5 * XY.fbm(x / f, seed, seed, 3))); g.lineTo(x1, HZ + 2); g.fill(); };
  const land = (W, H, S) => XY.cached('i80land:' + S.toFixed(4), W * S, H * S, cv => {
    const g = cv.getContext('2d'); g.scale(S, S); const [sx] = SUN(W);
    ridge(g, -10, W + 10, HZ - 8, 46, 160, 3, 'rgba(160,188,232,0.95)');
    // 灵山: a tall peak with its lit right flank, golden roofs on the summit
    const LS = [470, HZ, 520, 424, 548, 398, 566, 362, 578, 342, 590, 352, 598, 326, 606, 312, 624, 318, 616, 328, 636, 346, 664, 370, 700, 398, 744, 430, 790, HZ];
    g.fillStyle = '#7F9FCF'; XY.path(g, LS, true); g.fill();
    g.fillStyle = '#A3BDE4'; XY.path(g, [606, 312, 624, 318, 616, 328, 636, 346, 664, 370, 700, 398, 744, 430, 790, HZ, 742, HZ, 690, 408, 650, 372, 624, 340], true); g.fill();
    g.strokeStyle = 'rgba(70,96,150,0.55)'; g.lineWidth = 1.4; [[566, 362, 548, 420], [590, 352, 584, 410], [636, 346, 620, 420], [664, 370, 660, 440]].forEach(([a, b, c, d]) => { g.beginPath(); g.moveTo(a, b); g.quadraticCurveTo(a - 8, (b + d) / 2, c, d); g.stroke(); });
    g.fillStyle = '#F4C860'; [[606, 308, 14], [592, 324, 9], [622, 316, 9]].forEach(([x, y, w]) => { g.beginPath(); g.moveTo(x - w, y); g.lineTo(x, y - w * 0.7); g.lineTo(x + w, y); g.fill(); g.fillRect(x - w * 0.6, y, w * 1.2, w * 0.5); });
    ridge(g, -10, W + 10, HZ - 2, 26, 90, 7, 'rgba(112,148,206,0.95)');
    // the river: pale at the horizon, deep at our bank; the sun's road of light; drifting streaks
    let gr = g.createLinearGradient(0, HZ, 0, BANK); gr.addColorStop(0, '#B4DAF2'); gr.addColorStop(0.35, '#5E9EDA'); gr.addColorStop(1, '#22549E'); g.fillStyle = gr; g.fillRect(0, HZ, W, BANK - HZ + 4);
    g.save(); g.globalCompositeOperation = 'screen'; gr = g.createLinearGradient(0, HZ, 0, BANK); gr.addColorStop(0, 'rgba(255,240,205,0.65)'); gr.addColorStop(1, 'rgba(255,240,205,0.12)'); g.fillStyle = gr;
    g.beginPath(); g.moveTo(sx - 24, HZ); g.lineTo(sx + 24, HZ); g.lineTo(sx + 170, BANK); g.lineTo(sx - 170, BANK); g.fill(); g.restore();
    for (let k = 0; k < 46; k++) { const y = HZ + 6 + Math.pow(k / 46, 1.5) * (BANK - HZ - 10); g.fillStyle = `rgba(255,255,255,${0.07 + 0.09 * XY.hash(k, 2)})`; g.fillRect(XY.hash(k, 1) * W * 0.9, y, 50 + 220 * XY.hash(k, 3) * (y - HZ) / 190, 1.6 + (y - HZ) / 120); }
    // 独木桥: one long log from our bank out into the haze, and its dark reflection
    g.fillStyle = 'rgba(20,40,80,0.22)'; g.beginPath(); g.moveTo(170, BANK + 10); g.lineTo(660, HZ + 10); g.lineTo(662, HZ + 12); g.lineTo(184, BANK + 18); g.fill();
    g.fillStyle = '#5E4232'; g.beginPath(); g.moveTo(164, BANK + 2); g.quadraticCurveTo(420, 560, 660, HZ + 6); g.lineTo(661, HZ + 8); g.quadraticCurveTo(424, 566, 178, BANK + 10); g.fill();
    g.strokeStyle = '#D7B07A'; g.lineWidth = 1.2; g.beginPath(); g.moveTo(166, BANK + 2); g.quadraticCurveTo(420, 560, 660, HZ + 6); g.stroke();
    g.fillStyle = '#3E6A4A'; g.beginPath(); g.moveTo(610, HZ + 8); g.quadraticCurveTo(660, HZ - 4, 730, HZ + 6); g.lineTo(730, HZ + 10); g.lineTo(610, HZ + 10); g.fill();   // the far landing
    [0.12, 0.3, 0.48, 0.66, 0.84].forEach(v => { const w = 1 - v, x = w * w * 170 + 2 * w * v * 422 + v * v * 660, y = w * w * (BANK + 6) + 2 * w * v * 563 + v * v * (HZ + 7), h = 10 + 18 * (1 - v), pw = 2 + 4 * (1 - v);   // piers
      g.fillStyle = '#4A3226'; g.fillRect(x - pw / 2, y, pw, h); g.fillStyle = 'rgba(20,40,80,0.25)'; g.fillRect(x - pw / 2, y + h, pw, h * 0.8); });
    // near bank: grass, a pale path where the pilgrims walk, the bank's lit lip
    gr = g.createLinearGradient(0, BANK, 0, H); gr.addColorStop(0, '#86C85A'); gr.addColorStop(0.2, '#58A23E'); gr.addColorStop(1, '#2A6428'); g.fillStyle = gr;
    g.beginPath(); g.moveTo(0, H); for (let x = 0; x <= W; x += 24) g.lineTo(x, BANK + 6 * sin(x / 80) + 3 * sin(x / 23)); g.lineTo(W, H); g.fill();
    g.strokeStyle = '#C2EC80'; g.lineWidth = 3; g.beginPath(); for (let x = 0; x <= W; x += 24) g.lineTo(x, BANK + 6 * sin(x / 80) + 3 * sin(x / 23)); g.stroke();
    gr = g.createLinearGradient(0, 684, 0, 722); gr.addColorStop(0, 'rgba(226,212,170,0)'); gr.addColorStop(0.5, 'rgba(226,212,170,0.55)'); gr.addColorStop(1, 'rgba(226,212,170,0)'); g.fillStyle = gr; g.fillRect(0, 684, W, 38);
    // the ferry sign at the head of the bridge
    g.fillStyle = '#4A3226'; g.fillRect(118, 588, 6, 62); g.fillStyle = '#8A6446'; g.fillRect(84, 566, 74, 30); g.fillStyle = '#6A4A36'; g.fillRect(84, 590, 74, 6);
    g.fillStyle = '#2E2016'; g.font = XY.font(21, XY.cnFont.kai, 'bold'); g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('凌云渡', 121, 580);
    // reeds at both ends of the bank
    g.strokeStyle = '#2F6A2E'; g.lineCap = 'round'; for (let k = 0; k < 40; k++) { const x = k < 20 ? 6 + k * 4 : W - 90 + (k - 20) * 4.4, h = 50 + 60 * XY.hash(k, 9); g.lineWidth = 2; g.beginPath(); g.moveTo(x, BANK + 20); g.quadraticCurveTo(x + 6, BANK + 20 - h * 0.6, x + 10 * XY.hash(k, 8), BANK + 20 - h); g.stroke(); }
  });

  const PEN = { color: r => ({ horse: '#FBFBFF', horse2: '#E3E6F2', mane: '#F4F2FA', robe: '#F2D27A', kasaya: '#C8382C', skin: '#F6D7BC', skin2: '#D3A07A', face: '#F2D3AE', fur: '#A8703E' })[r] || XY.DEFAULT_COLORS[r], outline: '#2B2440', ow: 1.2 };
  const MORTAL = { color: r => ({ robe: '#CFC2A2', kasaya: '#9C5A54', skin: '#DCCBBE', gold: '#C8B98E', red: '#9C5A54', ink: '#3A3440', metal: '#A89A78' })[r] || '#B9B2A6', outline: '#4A4458', ow: 1.1, shade: 'rgba(40,40,70,0.2)' };
  const actsAt = b => ({ wukong: { shade: Math.max(sm(win(b, 2.2, 2.7)) * (1 - sm(win(b, 3.8, 4.3))), sm(win(b, 6.3, 6.8)) * (1 - sm(win(b, 8.4, 9)))) },
    monk: { palm: sm(win(b, 3.4, 3.9)) * (1 - sm(win(b, 8.6, 9.4))) }, bajie: { scratch: sm(win(b, 7.0, 7.5)) * (1 - sm(win(b, 9, 9.6))) }, shaseng: { lift: sm(win(b, 6.1, 6.4)) * (1 - sm(win(b, 7.0, 7.6))) } });
  const boatX = b => XY.lerp(1660, 1240, XY.easeOut(win(b, 1.2, ARRIVE))) - 10 * Math.max(0, b - ARRIVE);
  const mote = () => XY.keep('i80mote', 32, 32, cv => { const g = cv.getContext('2d'), r = g.createRadialGradient(16, 16, 0, 16, 16, 16); r.addColorStop(0, 'rgba(255,240,190,1)'); r.addColorStop(0.35, 'rgba(255,226,160,0.55)'); r.addColorStop(1, 'rgba(255,220,140,0)'); g.fillStyle = r; g.fillRect(0, 0, 32, 32); });
  XY.STYLES.shinkai = {
    hits: [ARRIVE, CORPSE, GLORY],
    bg(g, W, H) {
      const gr = g.createLinearGradient(0, 0, 0, HZ); gr.addColorStop(0, '#12358A'); gr.addColorStop(0.5, '#3C7FD0'); gr.addColorStop(0.86, '#A6CEEE'); gr.addColorStop(1, '#FFE2B2'); g.fillStyle = gr; g.fillRect(0, 0, W, HZ + 2);
      g.save(); g.filter = 'blur(3px)'; g.strokeStyle = 'rgba(255,255,255,0.32)'; g.lineCap = 'round';   // high cirrus
      for (let k = 0; k < 9; k++) { const x = 120 + k * 150 + 40 * XY.hash(k, 1), y = 40 + 70 * XY.hash(k, 2); g.lineWidth = 3 + 5 * XY.hash(k, 3); g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + 90, y - 18, x + 210, y - 6 - 20 * XY.hash(k, 4)); g.stroke(); }
      g.restore();
    },
    draw(g, e) {
      const { W, H, t, u, lt, beat, S } = e, [sx, sy] = SUN(W), A = actsAt(beat), BX = boatX(beat), BY = 568 + 3 * sin(t * 1.6);
      // sun disc behind the cloud edge, the drifting cumulus, the land
      let rg = g.createRadialGradient(sx, sy, 2, sx, sy, 60); rg.addColorStop(0, 'rgba(255,255,245,1)'); rg.addColorStop(1, 'rgba(255,240,200,0)'); g.fillStyle = rg; g.fillRect(sx - 60, sy - 60, 120, 120);
      g.drawImage(cloudLayer(W, S), -60 - 5 * lt, 0, W + 120, HZ);
      g.drawImage(land(W, H, S), 0, 0, W, H);
      // light: rays through the cloud gaps, the sun's glare, 灵山's golden glow
      g.save(); g.globalCompositeOperation = 'screen';
      for (let k = 0; k < 8; k++) { const a = 1.95 + k * 0.16 + 0.03 * sin(t * 0.6 + k), sp = 0.03 + 0.02 * XY.hash(k, 5), al = 0.09 + 0.07 * sin(t * 0.9 + k * 2);
        const lg = g.createLinearGradient(sx, sy, sx + cos(a) * 1200, sy + sin(a) * 1200); lg.addColorStop(0, `rgba(255,236,190,${al})`); lg.addColorStop(1, 'rgba(255,236,190,0)');
        g.fillStyle = lg; g.beginPath(); g.moveTo(sx, sy); g.lineTo(sx + cos(a - sp) * 1300, sy + sin(a - sp) * 1300); g.lineTo(sx + cos(a + sp) * 1300, sy + sin(a + sp) * 1300); g.fill(); }
      rg = g.createRadialGradient(sx, sy, 4, sx, sy, 320); rg.addColorStop(0, 'rgba(255,255,240,0.95)'); rg.addColorStop(0.08, 'rgba(255,246,210,0.8)'); rg.addColorStop(0.3, 'rgba(255,214,150,0.3)'); rg.addColorStop(1, 'rgba(255,200,140,0)');
      g.fillStyle = rg; g.fillRect(0, 0, W, H);
      g.strokeStyle = 'rgba(255,250,230,0.35)'; g.lineWidth = 2; g.beginPath(); g.moveTo(sx - 420, sy); g.lineTo(sx + 420, sy); g.stroke();
      for (let k = 0; k < 10; k++) { const a = k / 10 * TAU + t * 0.25, l = k % 2 ? 80 : 150; g.beginPath(); g.moveTo(sx, sy); g.lineTo(sx + cos(a) * l, sy + sin(a) * l); g.stroke(); }
      rg = g.createRadialGradient(600, 322, 2, 600, 322, 60); rg.addColorStop(0, `rgba(255,214,120,${0.5 + 0.2 * sin(t * 2)})`); rg.addColorStop(1, 'rgba(255,214,120,0)'); g.fillStyle = rg; g.fillRect(540, 262, 120, 120);
      // the glitter road on the water
      { const p = new Path2D(); for (let k = 0; k < 150; k++) { const v = Math.pow(XY.hash(k, 11), 1.3), y = HZ + 4 + v * (BANK - HZ - 10), spread = 20 + v * 150, x = sx + (XY.hash(k, 12) - 0.5) * 2 * spread, tw = sin(t * (3 + 5 * XY.hash(k, 13)) + k);
          if (tw < 0.45) continue; const r = (1.5 + 5 * v) * (tw - 0.4) * 1.8; p.moveTo(x - r * 2.6, y); p.lineTo(x, y - r * 0.45); p.lineTo(x + r * 2.6, y); p.lineTo(x, y + r * 0.45); p.closePath(); }
        g.fillStyle = 'rgba(255,250,230,0.95)'; g.fill(p); }
      g.restore();
      // birds crossing
      g.strokeStyle = 'rgba(30,50,100,0.7)'; g.lineWidth = 1.8; g.lineCap = 'round';
      for (let k = 0; k < 7; k++) { const x = W + 60 - ((lt + 2) * 70 + k * 26) % (W + 200), y = 210 + k * 9 + 6 * sin(lt * 1.3 + k), f = 4 * sin(t * 9 + k * 1.3);
        g.beginPath(); g.moveTo(x - 7, y - f); g.quadraticCurveTo(x - 3, y - 2, x, y); g.quadraticCurveTo(x + 3, y - 2, x + 7, y - f); g.stroke(); }
      // 接引佛祖 poling the bottomless boat: gunwales only, the river shows through where the hull should be
      { const bx = BX, by = BY, rk = 0.02 * sin(t * 1.6), pa = 0.5 + 0.12 * sin(t * 1.9);
        g.save(); g.translate(bx, by); g.rotate(rk);
        g.fillStyle = 'rgba(20,40,80,0.22)'; g.beginPath(); g.ellipse(0, 22, 170, 10, 0, 0, TAU); g.fill();
        g.strokeStyle = '#3E2A20'; g.lineWidth = 3; g.beginPath(); g.moveTo(-160, -18); g.quadraticCurveTo(-120, 16, 0, 18); g.quadraticCurveTo(120, 16, 168, -24); g.stroke();
        g.strokeStyle = 'rgba(255,255,255,0.5)'; g.lineWidth = 1.4; for (let k = 0; k < 3; k++) { const y = 2 + k * 5; g.beginPath(); g.moveTo(-110 + k * 10, y); g.lineTo(110 - k * 14, y + 1); g.stroke(); }
        g.fillStyle = '#5A3A28'; g.beginPath(); g.moveTo(-164, -22); g.quadraticCurveTo(0, -4, 172, -30); g.lineTo(170, -20); g.quadraticCurveTo(0, 6, -160, -12); g.fill();
        g.fillStyle = '#C9945E'; g.beginPath(); g.moveTo(-164, -22); g.quadraticCurveTo(0, -4, 172, -30); g.lineTo(171, -27); g.quadraticCurveTo(0, -1, -163, -19); g.fill();
        g.fillStyle = '#5A3A28'; g.fillRect(-166, -40, 8, 26); g.fillRect(166, -48, 8, 24);
        // the Buddha of welcome at the stern: halo, saffron robe, red kasaya, a long pole
        const hx = 96, hy = -136; rg = g.createRadialGradient(hx, hy, 10, hx, hy, 70); rg.addColorStop(0, 'rgba(255,236,170,0.7)'); rg.addColorStop(1, 'rgba(255,220,140,0)'); g.fillStyle = rg; g.fillRect(hx - 70, hy - 70, 140, 140);
        g.strokeStyle = 'rgba(255,230,150,0.95)'; g.lineWidth = 3; g.beginPath(); g.arc(hx, hy, 40, 0, TAU); g.stroke();
        g.fillStyle = '#E8913A'; g.beginPath(); g.moveTo(72, -12); g.lineTo(122, -12); g.lineTo(112, -110); g.lineTo(82, -110); g.fill();
        g.fillStyle = '#C46A26'; g.beginPath(); g.moveTo(72, -12); g.lineTo(92, -12); g.lineTo(88, -110); g.lineTo(82, -110); g.fill();
        g.fillStyle = '#B8302A'; g.beginPath(); g.moveTo(84, -108); g.lineTo(112, -108); g.lineTo(118, -40); g.lineTo(96, -30); g.fill();
        g.fillStyle = '#F2D3AE'; g.beginPath(); g.arc(97, -124, 14, 0, TAU); g.fill(); g.fillStyle = '#2A3A7A'; g.beginPath(); g.arc(97, -132, 13, PI, TAU); g.fill(); g.beginPath(); g.arc(97, -142, 7, 0, TAU); g.fill();
        g.strokeStyle = 'rgba(255,240,200,0.9)'; g.lineWidth = 2; g.beginPath(); g.moveTo(108, -128); g.lineTo(110, -112); g.stroke();
        const ph = [70 + 40 * cos(pa), -170], pt = [20 - 30 * sin(pa), 70]; g.strokeStyle = '#3A2A20'; g.lineWidth = 4; g.beginPath(); g.moveTo(ph[0], ph[1]); g.lineTo(pt[0], pt[1]); g.stroke();
        g.fillStyle = '#F2D3AE'; [[0.25, 0], [0.42, 0]].forEach(([v]) => { g.beginPath(); g.arc(XY.lerp(ph[0], pt[0], v), XY.lerp(ph[1], pt[1], v), 4.5, 0, TAU); g.fill(); });
        g.restore(); }
      { const fa = K.hit(beat, ARRIVE, 2.2) * (beat >= ARRIVE ? 1 : 0); if (fa > 0.01) { const cx = BX + 96, cy = BY - 136, R = 90 + 300 * (1 - fa); g.save(); g.globalCompositeOperation = 'screen';   // 接引佛祖 arrives in a burst of light
        rg = g.createRadialGradient(cx, cy, 4, cx, cy, R); rg.addColorStop(0, `rgba(255,246,214,${0.95 * fa})`); rg.addColorStop(0.4, `rgba(255,226,160,${0.5 * fa})`); rg.addColorStop(1, 'rgba(255,220,140,0)'); g.fillStyle = rg; g.fillRect(cx - R, cy - R, 2 * R, 2 * R);
        g.strokeStyle = `rgba(255,236,180,${fa})`; g.lineWidth = 3; g.beginPath(); g.arc(cx, cy, 44 + 160 * (1 - fa), 0, TAU); g.stroke(); g.restore(); } }
      // 脱胎 (hit 2): the mortal body is thrown out of him backwards in a high arc, lands face-up on the river behind 沙僧 and drifts
      // under the single-log bridge, big and grey, shedding motes; 唐僧 turns his head to look at it
      const f2 = XY.procParts(e.phase, A)[2], m = f2.parts.findIndex(p => p.role === 'metal'), mt = beat >= CORPSE - 0.3;
      if (mt) { const now = e.at('monk.chest', A), a = [now[0] - e.procX - f2.x, now[1] - e.groundY], v = XY.easeIO(win(beat, CORPSE - 0.3, CORPSE + 0.5));
        const fl = [LAND[0] - 16 * Math.max(0, beat - CORPSE - 0.5), LAND[1] + 2.5 * sin(t * 2.1)], tx = XY.lerp(now[0], fl[0], v), ty = XY.lerp(now[1], fl[1], v) - 230 * sin(PI * v);
        const M = K.around(a[0], a[1], -PI / 2 * sm(win(beat, CORPSE - 0.2, CORPSE + 0.4)) + 0.04 * sin(t * 2), XY.lerp(1, 1.6, v), tx - now[0], ty - now[1]);
        if (v > 0.95) { g.strokeStyle = 'rgba(255,255,255,0.55)'; g.lineWidth = 1.6; for (let k = 0; k < 3; k++) { const p = ((t * 0.5 + k / 3) % 1); g.globalAlpha = 1 - p; g.beginPath(); g.ellipse(fl[0], fl[1] + 22, 90 + 80 * p, 10 + 9 * p, 0, 0, TAU); g.stroke(); } g.globalAlpha = 1; }
        g.save(); g.globalAlpha = 0.95; K.draw(g, e.phase, e.procX, e.groundY, MORTAL, A, { only: 2, skip: (fi, pi, p, tag) => tag !== 'monk' || (pi >= m && pi <= m + 8) || (p.role === 'red' && p.fine), xf: () => M }); g.restore();
        if (v > 0.95) { const wg = g.createLinearGradient(0, fl[1] + 4, 0, fl[1] + 34); wg.addColorStop(0, 'rgba(62,118,196,0.15)'); wg.addColorStop(1, 'rgba(40,92,170,0.85)'); g.fillStyle = wg; g.fillRect(fl[0] - 130, fl[1] + 4, 260, 30);
          g.strokeStyle = 'rgba(255,255,255,0.7)'; g.lineWidth = 1.4; g.beginPath(); g.moveTo(fl[0] - 120, fl[1] + 6); g.quadraticCurveTo(fl[0], fl[1] + 2 + 2 * sin(t * 3), fl[0] + 120, fl[1] + 6); g.stroke(); }
        { const d = (beat - CORPSE - 0.5) * XY.BEAT; if (d > 0 && d < 0.8) { const p = new Path2D(); for (let k = 0; k < 90; k++) { const vx = (XY.hash(k, 71) - 0.5) * 360, vy = -200 - 360 * XY.hash(k, 72), x = fl[0] + (XY.hash(k, 73) - 0.5) * 160 + vx * d, y = fl[1] + 8 + vy * d + 1300 * d * d;
          if (y > fl[1] + 10) continue; const r = 1.5 + 2.5 * XY.hash(k, 74); p.moveTo(x + r, y); p.arc(x, y, r, 0, TAU); } g.fillStyle = 'rgba(240,250,255,0.95)'; g.fill(p); } }
        g.save(); g.globalCompositeOperation = 'screen'; const sp = mote();
        for (let k = 0; k < 26; k++) { const p = (t * 0.4 + XY.hash(k, 21)) % 1, x = (v > 0.5 ? fl[0] : tx) + (XY.hash(k, 22) - 0.5) * 220 + 12 * sin(t * 2 + k), y = (v > 0.5 ? fl[1] : ty) - p * 300, s = 14 + 12 * XY.hash(k, 23);
          g.globalAlpha = sin(p * PI) * 0.9; g.drawImage(sp, x - s / 2, y - s / 2, s, s); } g.restore(); }
      // the rider's halo: lit when the body leaves him, flaring when the light comes down (hit 3)
      const ha = XY.easeOut(win(beat, CORPSE, CORPSE + 0.35)), burst = K.hit(beat, CORPSE, 4) + 1.4 * K.hit(beat, GLORY, 2.5), hd = e.at('monk.head', A);
      { const gb = sm(win(beat, GLORY - 0.3, GLORY)) * (1 - sm(win(beat, GLORY + 0.8, GLORY + 2.2))); if (gb > 0) { g.save(); g.globalCompositeOperation = 'screen';
          const lg = g.createLinearGradient(sx, sy, hd[0], hd[1]); lg.addColorStop(0, `rgba(255,246,214,${0.2 * gb})`); lg.addColorStop(1, `rgba(255,236,180,${0.75 * gb})`); g.fillStyle = lg;
          const dx = hd[0] - sx, dy = hd[1] - sy, L = Math.hypot(dx, dy), nx = -dy / L, ny = dx / L; g.beginPath(); g.moveTo(sx + nx * 14, sy + ny * 14); g.lineTo(sx - nx * 14, sy - ny * 14); g.lineTo(hd[0] - nx * 70 + dx * 0.35, hd[1] - ny * 70 + dy * 0.35); g.lineTo(hd[0] + nx * 70 + dx * 0.35, hd[1] + ny * 70 + dy * 0.35); g.fill(); g.restore(); } }
      if (ha > 0) { rg = g.createRadialGradient(hd[0], hd[1], 6, hd[0], hd[1], 56 * ha + 150 * burst); rg.addColorStop(0, 'rgba(255,240,190,0.85)'); rg.addColorStop(1, 'rgba(255,220,140,0)'); g.fillStyle = rg; g.fillRect(hd[0] - 230, hd[1] - 230, 460, 460);
        g.strokeStyle = `rgba(255,232,160,${0.9 * ha})`; g.lineWidth = 2.6; g.beginPath(); g.arc(hd[0] - 2, hd[1] - 2, 26 * ha + 6, 0, TAU); g.stroke();
        const g2 = sm(win(beat, GLORY, GLORY + 0.4)); if (g2 > 0) { g.lineWidth = 1.6; g.strokeStyle = `rgba(255,240,190,${0.8 * g2})`; g.beginPath(); g.arc(hd[0] - 2, hd[1] - 2, 44 * g2, 0, TAU); g.stroke(); } }
      // 唐僧 turns his head to watch his own body float away (the head parts are mirrored about the head)
      const lk = sm(win(beat, CORPSE + 0.2, CORPSE + 0.45)) * (1 - sm(win(beat, CORPSE + 2.3, CORPSE + 2.55))), sxk = cos(PI * lk);
      const HS = new Set(); { const hl = f2.anchors.head; for (let i = m - 1; i >= 0; i--) { const p = f2.parts[i]; let cx = 0, cy = 0; if (p.k === 'dot') { cx = p.x; cy = p.y; } else { for (let j = 0; j < p.pts.length; j += 2) { cx += p.pts[j]; cy += p.pts[j + 1]; } cx /= p.pts.length / 2; cy /= p.pts.length / 2; }
          if (Math.hypot(cx - hl[0], cy - hl[1]) > 24) break; HS.add(i); } }
      const HM = lk > 0.001 ? [sxk, 0, 0, 1, f2.anchors.head[0] * (1 - sxk), 0] : null, hxf = (fi, pi) => (HM && fi === 2 && HS.has(pi) ? HM : null);
      // cel-shaded procession: base, a hard cool shadow band and a warm rim from offsets of its own silhouette
      const Wd = Math.round(W * S), Hd = Math.round(H * S), [pl, pg] = K.layer(e, 'i80p');
      K.draw(pg, e.phase, e.procX, e.groundY, PEN, A, { xf: hxf });
      K.blitOn(pl, K.edge(pl, 'i80sh', 8 * S, -6 * S, 'rgba(48,52,120,0.4)'));
      K.blitOn(pl, K.edge(pl, 'i80rim', -3 * S, 3 * S, 'rgba(255,226,170,0.95)'));
      K.blit(g, pl);
      // after the molt the rider glows: a soft gold bloom of his own figure, done at quarter resolution
      if (ha > 0) { const q = 4, sc = XY.scratch('i80g1', Wd / q, Hd / q), c = sc.getContext('2d'); c.setTransform(S / q, 0, 0, S / q, 0, 0);
        K.draw(c, e.phase, e.procX, e.groundY, { color: () => '#FFE6A0' }, A, { only: 2, skip: (fi, pi, p, tag) => tag !== 'monk' });
        const bl = XY.scratch('i80g2', Wd / q, Hd / q), b = bl.getContext('2d'); b.filter = `blur(${3}px)`; b.drawImage(sc, 0, 0);
        g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'lighter'; g.globalAlpha = 0.75 * ha * (0.85 + 0.15 * sin(t * 3)); g.drawImage(bl, 0, 0, Wd, Hd); g.restore(); }
      // near: backlit grass blades swaying in front of everything
      { const dk = new Path2D(), lt2 = new Path2D();
        for (let k = 0; k < 110; k++) { const x = XY.hash(k, 31) * W, base = H + 4, h = 22 + 46 * XY.hash(k, 32) * (k % 5 ? 1 : 1.8), sw = 8 * sin(t * 1.6 + x * 0.02) + 4 * sin(t * 2.7 + k);
          if (x > 220 && x < W - 160 && h > 50) continue;
          dk.moveTo(x - 3, base); dk.quadraticCurveTo(x + sw * 0.4, base - h * 0.6, x + sw, base - h); dk.quadraticCurveTo(x + sw * 0.4 + 2, base - h * 0.6, x + 3, base); lt2.moveTo(x + 1.5, base - 2); lt2.quadraticCurveTo(x + sw * 0.4 + 2, base - h * 0.6, x + sw + 0.6, base - h + 2); }
        g.fillStyle = '#245E26'; g.fill(dk); g.strokeStyle = 'rgba(214,246,140,0.75)'; g.lineWidth = 1.1; g.stroke(lt2); }
      // drifting motes, lens flare along the line from the sun through the frame
      g.save(); g.globalCompositeOperation = 'screen'; const sp = mote();
      for (let k = 0; k < 28; k++) { const p = (t * 0.08 + XY.hash(k, 41)) % 1, x = XY.hash(k, 42) * W + 30 * sin(t * 0.7 + k), y = H - p * (H - 80), s = 8 + 12 * XY.hash(k, 43); g.globalAlpha = 0.55 * sin(p * PI); g.drawImage(sp, x - s / 2, y - s / 2, s, s); }
      g.globalAlpha = 1;
      [[0.35, 26, '255,220,160'], [0.6, 14, '180,255,220'], [0.9, 46, '255,190,240'], [1.25, 20, '170,210,255'], [1.6, 64, '255,230,190']].forEach(([f, r, c], k) => {
        const x = XY.lerp(sx, W / 2, f * 1.6), y = XY.lerp(sy, H / 2, f * 1.6); g.fillStyle = `rgba(${c},${0.08 + 0.03 * sin(t * 1.3 + k)})`; g.beginPath();
        for (let i = 0; i < 6; i++) { const a = i / 6 * TAU + 0.3; i ? g.lineTo(x + cos(a) * r, y + sin(a) * r) : g.moveTo(x + cos(a) * r, y + sin(a) * r); } g.fill(); });
      // title: revealed by a diagonal sweep of light (no fade)
      const sw = win(u, -0.22, 0.12), bxp = -400 + (W + 800) * XY.easeIO(sw);
      if (sw > 0 && sw < 1) { const lg = g.createLinearGradient(bxp - 160, 0, bxp + 160, 0); lg.addColorStop(0, 'rgba(255,250,235,0)'); lg.addColorStop(0.5, 'rgba(255,250,235,0.55)'); lg.addColorStop(1, 'rgba(255,250,235,0)');
        g.fillStyle = lg; g.save(); g.transform(1, 0, -0.35, 1, 0, 0); g.fillRect(bxp - 160, 0, 320, H); g.restore(); }
      g.restore();
      if (sw > 0) { g.save(); g.beginPath(); g.rect(0, 0, sw >= 1 ? W : Math.max(0, bxp - 60), H); g.clip();
        g.shadowColor = 'rgba(14,34,90,0.7)'; g.shadowBlur = 26 * S; g.fillStyle = '#FFFFFF'; g.font = XY.font(128, '"Hiragino Mincho ProN", "Songti SC", serif', '600'); g.textBaseline = 'top'; g.fillText('脱胎', 88, 62);
        g.shadowBlur = 0; g.fillStyle = 'rgba(14,34,90,0.55)'; g.beginPath(); g.roundRect(82, 204, 268, 44, 8); g.fill(); g.fillStyle = '#FFFFFF'; g.font = XY.font(28, '"Hiragino Mincho ProN", "Songti SC", serif'); g.fillText('第八十难　凌云渡', 94, 212); g.restore(); }
    },
    // bloom: a quarter-resolution blurred copy screened back over the panel
    post(cv, g) {
      const w = Math.round(cv.width / 4), h = Math.round(cv.height / 4), a = XY.scratch('i80b1', w, h); a.getContext('2d').drawImage(cv, 0, 0, w, h);
      const b = XY.scratch('i80b2', w, h), bc = b.getContext('2d'); bc.filter = 'blur(5px) brightness(1.08) contrast(1.25)'; bc.drawImage(a, 0, 0);
      g.save(); g.globalCompositeOperation = 'screen'; g.globalAlpha = 0.26; g.drawImage(b, 0, 0, cv.width, cv.height); g.restore();
    },
  };
})();
