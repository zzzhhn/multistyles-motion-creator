// 68 VHS · 1988 年 · 僧房卧病 — the cell is a home-video tape of 镇海寺's monks' dormitory. Tang Seng is sick
// (a thermometer in his mouth, flushed and sweating); the tape fast-forwards two nights (beats 1 and 2) and each time
// two of the little monks on the sleeping platform are gone; on beat 3 the deck PAUSEs and the frozen frame shows what
// plain play only smears: a white mouse with a gold nose by the beds (金鼻白毛老鼠精). The scene is rendered at half
// resolution, split into R/G/B and re-added with a chroma shift; tracking band, head-switch noise, grain, OSD.
(() => {
  'use strict';
  const XY = window.XY, K = XY.KIT_H, TAU = XY.TAU, { sin, cos, floor, PI } = Math;
  const PLAT = [640, 1080, 470], MATS = 6, MW = 72, BED = [110, 390, 470];
  const PEN = K.pen({ fur: '#A8784A', wkshirt: '#D0584A', tiger: '#E8AA50', robe: '#F0D080', kasaya: '#CC4A3C', horse: '#F4F0E8', horse2: '#D6D0C4', mane: '#E6E2D8', bjrobe: '#444858', ssrobe: '#507080' }, '#2A2018', 1.3);

  // ------------------------------------------------------------ the dormitory (static, painted at half resolution; window glass left clear)
  // left: Tang Seng's sickbed under a mosquito net; middle: the altar under the window; right: the little monks' sleeping platform.
  // Everything stands against the back wall (base y ≈ 560), behind the pilgrims' walking band.
  const room = (k, W, H) => XY.keep(`vhs-room2:${k.toFixed(4)}`, W * k, H * k, cv => {
    const g = cv.getContext('2d'); g.scale(k, k); const R = (x, y, w, h, c) => { g.fillStyle = c; g.fillRect(x, y, w, h); };
    R(0, 0, W, 560, '#7A5640'); for (let x = 0; x < W; x += 38) R(x, 70, 3, 490, '#5E4030'); R(0, 296, W, 10, '#5A3C2C'); R(0, 300, W, 2, '#9A7458');
    g.clearRect(500, 140, 280, 240); R(486, 126, 308, 14, '#3E281C'); R(486, 380, 308, 16, '#3E281C'); R(486, 126, 14, 270, '#3E281C'); R(780, 126, 14, 270, '#3E281C');
    for (let x = 528; x < 780; x += 28) R(x, 140, 4, 240, '#4A3022'); for (let y = 168; y < 380; y += 28) R(500, y, 280, 4, '#4A3022');
    R(0, 0, W, 70, '#3A261C'); for (let x = 0, i = 0; x < W; x += 60, i++) { R(x, 42, 60, 20, ['#3A7A72', '#A8402E', '#C8A050'][i % 3]); R(x + 22, 46, 16, 12, '#E8D8B0'); } R(0, 62, W, 8, '#2A1A12');
    R(0, 560, W, 220, '#5A3E2E'); g.strokeStyle = '#3E2A1E'; g.lineWidth = 2;
    for (let i = -16; i <= 16; i++) { g.beginPath(); g.moveTo(590 + i * 46, 560); g.lineTo(590 + i * 150, 780); g.stroke(); }
    [580, 610, 652, 712].forEach(y => { g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke(); });
    let gr = g.createLinearGradient(0, 560, 0, 640); gr.addColorStop(0, 'rgba(20,10,6,0.5)'); gr.addColorStop(1, 'rgba(20,10,6,0)'); g.fillStyle = gr; g.fillRect(0, 560, W, 80);
    // the little monks' platform with six mats and pillows
    R(PLAT[0] - 8, PLAT[2], PLAT[1] - PLAT[0] + 16, 72, '#4A3022'); R(PLAT[0] - 8, PLAT[2] - 6, PLAT[1] - PLAT[0] + 16, 8, '#8A6244'); for (let x = PLAT[0]; x < PLAT[1]; x += 54) R(x, PLAT[2] + 14, 4, 58, '#3A2418');
    for (let i = 0; i < MATS; i++) { const x = PLAT[0] + 6 + i * MW; R(x, PLAT[2] - 10, MW - 6, 6, '#B8A070'); for (let s = 0; s < MW - 6; s += 6) R(x + s, PLAT[2] - 10, 1, 6, '#8A7650');
      R(x + 1, PLAT[2] - 21, 22, 11, '#3A2A20'); R(x + 2, PLAT[2] - 20, 20, 9, '#E8E0CC'); }
    // the sickbed: raised bed, mosquito net on four posts drawn back at the sides, the medicine stool
    R(BED[0], BED[2] - 8, BED[1] - BED[0], 12, '#D8D0C0'); R(BED[0] - 6, BED[2] + 4, BED[1] - BED[0] + 12, 60, '#4A3022'); R(BED[0] - 6, BED[2] + 4, BED[1] - BED[0] + 12, 6, '#8A6244');
    R(BED[0], BED[2] + 64, 10, 26, '#2E1E14'); R(BED[1] - 10, BED[2] + 64, 10, 26, '#2E1E14');
    R(BED[0] - 4, 236, 8, 240, '#3E281C'); R(BED[1] - 4, 236, 8, 240, '#3E281C'); R(BED[0] - 10, 230, BED[1] - BED[0] + 20, 10, '#3E281C');
    [[BED[0] + 4, 1], [BED[1] - 4, -1]].forEach(([x0, d]) => { g.fillStyle = 'rgba(240,240,232,0.42)'; g.beginPath(); g.moveTo(x0, 240); g.lineTo(x0 + d * 90, 240); g.quadraticCurveTo(x0 + d * 40, 330, x0 + d * 18, 360); g.quadraticCurveTo(x0 + d * 30, 420, x0 + d * 6, 470); g.lineTo(x0, 470); g.fill();
      g.strokeStyle = 'rgba(255,255,250,0.5)'; g.lineWidth = 1.5; for (let q = 0; q < 5; q++) { g.beginPath(); g.moveTo(x0 + d * q * 18, 240); g.quadraticCurveTo(x0 + d * (q * 8 + 10), 330, x0 + d * 10, 360); g.stroke(); } R(x0 + d * 14 - 3, 356, 6, 8, '#C8402E'); });
    g.fillStyle = 'rgba(240,240,232,0.18)'; g.fillRect(BED[0] + 90, 240, BED[1] - BED[0] - 180, 120);
    R(396, 520, 44, 8, '#4A3022'); R(402, 528, 6, 32, '#3A2418'); R(428, 528, 6, 32, '#3A2418'); g.fillStyle = '#E8E0D0'; g.beginPath(); g.ellipse(418, 516, 15, 5, 0, 0, TAU); g.fill(); g.fillStyle = '#5A3A20'; g.beginPath(); g.ellipse(418, 514, 12, 3, 0, 0, TAU); g.fill();
    // the altar under the window: table, cloth, gilt Buddha with halo, incense burner, candlesticks
    R(468, 470, 156, 12, '#4A2E1E'); R(474, 482, 144, 76, '#A8382A'); R(474, 482, 144, 8, '#C8A050');
    g.fillStyle = 'rgba(232,190,90,0.5)'; g.beginPath(); g.arc(546, 384, 50, 0, TAU); g.fill(); g.fillStyle = '#C89A40';
    g.beginPath(); g.ellipse(546, 448, 42, 22, 0, 0, TAU); g.fill(); g.beginPath(); g.moveTo(518, 450); g.quadraticCurveTo(514, 404, 546, 398); g.quadraticCurveTo(578, 404, 574, 450); g.fill();
    g.beginPath(); g.arc(546, 384, 16, 0, TAU); g.fill(); g.fillStyle = '#E8C060'; g.beginPath(); g.arc(540, 380, 6, 0, TAU); g.fill(); g.fillStyle = '#6A4A20'; g.beginPath(); g.arc(546, 368, 9, PI, TAU); g.fill();
    g.fillStyle = '#6A5A3A'; g.beginPath(); g.ellipse(546, 466, 16, 6, 0, 0, TAU); g.fill(); R(532, 458, 28, 8, '#7A6A44');
    R(486, 438, 6, 32, '#C8A050'); R(600, 438, 6, 32, '#C8A050'); R(486, 434, 6, 6, '#F0E8D8'); R(600, 434, 6, 6, '#F0E8D8');
    // red lacquer pillars standing at the back wall
    [[40, 56], [1090, 56]].forEach(([x, w]) => { R(x, 0, w, 560, '#8E2A20'); R(x + 8, 0, 10, 560, '#B44A36'); R(x - 8, 540, w + 16, 22, '#6A6A62'); });
  });
  // grain tiles (premade noise), the snow screen uses them at full strength
  const grain = (i, n = 160) => XY.keep(`vhs-grain:${i}`, n, n, cv => { const g = cv.getContext('2d'), im = g.createImageData(n, n), d = im.data, r = XY.rng(680 + i);
    for (let p = 0; p < d.length; p += 4) { const v = r() * 255; d[p] = d[p + 1] = d[p + 2] = v; d[p + 3] = 255; } g.putImageData(im, 0, 0); });

  // ------------------------------------------------------------ the tape: what the deck is doing at cell-local u
  // the tape (8 beats at 90 BPM): FF ×2 while Tang Seng lies sick and the little monks vanish night by night, PAUSE on the mouse, FF to the morning he is well
  const FF = [[0.28, 0.36], [0.42, 0.48], [0.78, 0.84]], PAUSE = [0.5, 0.62], SICK = [0.32, 0.81];
  const deck = u => u < -0.3 ? 'snow' : u < -0.12 ? 'lock' : FF.some(([a, b]) => u >= a && u < b) ? 'ff' : u >= PAUSE[0] && u < PAUSE[1] ? 'pause' : u > 1.05 ? 'rew' : 'play';
  const sceneT = (lt, dur) => { let s = lt; FF.forEach(([a, b]) => { s += 7 * XY.clamp(lt - a * dur, 0, (b - a) * dur); }); return s - XY.clamp(lt - PAUSE[0] * dur, 0, (PAUSE[1] - PAUSE[0]) * dur); };
  const GONE = [[2, 0.32], [5, 0.32], [0, 0.45], [3, 0.45], [1, 0.62]];   // mat index, u at which it is empty
  const monks = (g, u, sT) => { for (let i = 0; i < MATS; i++) { const x = PLAT[0] + 6 + i * MW, y = PLAT[2] - 10, gone = GONE.some(([j, uu]) => j === i && u >= uu);
    if (gone) { g.fillStyle = '#5A6A80'; g.beginPath(); g.moveTo(x + 24, y); g.quadraticCurveTo(x + 44, y - 7, x + 64, y); g.fill(); g.fillStyle = '#8A98B0'; g.fillRect(x + 30, y - 4, 26, 2); continue; }
    const br = 2.2 * sin(sT * 2.2 + i);
    g.fillStyle = '#E8C8A4'; g.beginPath(); g.arc(x + 13, y - 17, 10, 0, TAU); g.fill(); g.strokeStyle = '#4A3428'; g.lineWidth = 1.4; g.stroke();
    g.fillStyle = '#3A2A20'; g.fillRect(x + 7, y - 17, 5, 1.6); g.beginPath(); g.arc(x + 4, y - 15, 2.6, 0, TAU); g.fillStyle = '#E0B890'; g.fill();
    g.fillStyle = '#5E6E92'; g.beginPath(); g.moveTo(x + 18, y + 1); g.quadraticCurveTo(x + 20, y - 22 - br, x + 34, y - 21 - br); g.quadraticCurveTo(x + 56, y - 18 - br, x + 66, y + 1); g.closePath(); g.fill();
    g.strokeStyle = '#2E3A52'; g.lineWidth = 1.6; g.stroke(); g.strokeStyle = '#8A9AC0'; g.lineWidth = 1.2; g.beginPath(); g.moveTo(x + 22, y - 12 - br); g.quadraticCurveTo(x + 30, y - 18 - br, x + 40, y - 17 - br); g.stroke();
    g.beginPath(); g.moveTo(x + 44, y - 4); g.quadraticCurveTo(x + 52, y - 12 - br * 0.6, x + 60, y - 6); g.stroke();
    const zq = (sT * 0.5 + i * 0.37) % 1; if (i % 2 === 0) { g.fillStyle = `rgba(240,240,255,${1 - zq})`; g.font = XY.font(18 + 10 * zq, 'Menlo, monospace', 'bold'); g.fillText('z', x + 16 + 14 * zq, y - 34 - 34 * zq); } } };
  // Tang Seng in the sickbed: towel on the brow, thermometer, flushed and sweating, the quilt heaving and shivering; crown on the bedpost, staff against the bed
  const sickbed = (g, sT, t) => { const y = BED[2] - 8, br = 3 * sin(sT * 2.6), sh = 0.8 * sin(t * 40);
    g.strokeStyle = '#C8A050'; g.lineWidth = 3.4; g.beginPath(); g.moveTo(BED[1] + 16, BED[2] + 60); g.lineTo(BED[1] + 30, 270); g.stroke(); g.strokeStyle = '#E8C060'; g.lineWidth = 2.4; g.beginPath(); g.ellipse(BED[1] + 31, 258, 8, 13, 0.1, 0, TAU); g.stroke();
    g.fillStyle = '#E8C66A'; for (let k = -2; k <= 2; k++) { g.beginPath(); g.moveTo(BED[0] - 4 + k * 7 - 3, 300); g.lineTo(BED[0] - 4 + k * 7, 288 - (2 - Math.abs(k))); g.lineTo(BED[0] - 4 + k * 7 + 3, 300); g.fill(); } g.fillRect(BED[0] - 20, 300, 32, 4);
    g.fillStyle = '#E8E0CC'; g.beginPath(); g.ellipse(BED[0] + 34, y - 6, 28, 11, 0, 0, TAU); g.fill();
    g.fillStyle = '#F0D2B0'; g.beginPath(); g.ellipse(BED[0] + 48 + sh, y - 18, 17, 16, 0, 0, TAU); g.fill(); g.strokeStyle = '#4A3428'; g.lineWidth = 1.6; g.stroke();
    g.fillStyle = 'rgba(230,60,60,0.55)'; g.beginPath(); g.ellipse(BED[0] + 56 + sh, y - 12, 6, 4, 0, 0, TAU); g.fill();
    g.fillStyle = '#F4F4F8'; g.fillRect(BED[0] + 34 + sh, y - 34, 28, 8); g.strokeStyle = '#A8B8C8'; g.lineWidth = 1; g.strokeRect(BED[0] + 34 + sh, y - 34, 28, 8);
    g.strokeStyle = '#3A2A20'; g.lineWidth = 1.6; g.beginPath(); g.moveTo(BED[0] + 52 + sh, y - 20); g.quadraticCurveTo(BED[0] + 56 + sh, y - 17, BED[0] + 60 + sh, y - 20); g.stroke();
    g.strokeStyle = '#F4F4F8'; g.lineWidth = 3.4; g.lineCap = 'round'; g.beginPath(); g.moveTo(BED[0] + 62 + sh, y - 8); g.lineTo(BED[0] + 84 + sh, y - 22); g.stroke(); g.fillStyle = '#E02020'; g.beginPath(); g.arc(BED[0] + 84 + sh, y - 22, 3, 0, TAU); g.fill();
    g.fillStyle = 'rgba(200,230,255,0.9)'; [0, 1, 2].forEach(j => { const q = (t * 1.2 + j * 0.33) % 1; g.beginPath(); g.ellipse(BED[0] + 36 + j * 10, y - 26 + q * 18, 1.8, 2.8, 0, 0, TAU); g.fill(); });
    g.fillStyle = '#B83A30'; g.beginPath(); g.moveTo(BED[0] + 66, y + 4); g.quadraticCurveTo(BED[0] + 80 + sh, y - 30 - br, BED[0] + 150, y - 32 - br); g.quadraticCurveTo(BED[0] + 230, y - 26 - br, BED[1] - 6, y + 4); g.closePath(); g.fill();
    g.strokeStyle = '#E8C060'; g.lineWidth = 1.6; for (let k = 1; k < 4; k++) { g.beginPath(); g.moveTo(BED[0] + 66 + k * 50, y - 26 - br + k * 2); g.lineTo(BED[0] + 70 + k * 50, y + 2); g.stroke(); }
    g.beginPath(); g.moveTo(BED[0] + 80, y - 14 - br * 0.5); g.lineTo(BED[1] - 20, y - 12 - br * 0.5); g.stroke();
    const sq = (t * 1.6) % 1; g.strokeStyle = `rgba(255,255,255,${0.7 * (1 - sq)})`; g.lineWidth = 2; g.beginPath(); for (let k = 0; k < 3; k++) { const a = -2.4 + k * 0.5; g.moveTo(BED[0] + 48 + cos(a) * (22 + 10 * sq), y - 18 + sin(a) * (22 + 10 * sq)); g.lineTo(BED[0] + 48 + cos(a) * (30 + 10 * sq), y - 18 + sin(a) * (30 + 10 * sq)); } g.stroke(); };
  const mouse = (g, x, y, blur) => { g.save(); g.translate(x, y);
    for (let k = blur ? 3 : 0; k >= 0; k--) { g.globalAlpha = k ? 0.18 : 1; const ox = k * 16;
      g.fillStyle = '#F4F2EE'; g.beginPath(); g.ellipse(ox + 6, 0, 22, 10, 0, 0, TAU); g.fill(); g.beginPath(); g.ellipse(ox - 16, -3, 11, 8, -0.2, 0, TAU); g.fill();
      g.strokeStyle = '#E8B0B0'; g.lineWidth = 2; g.beginPath(); g.moveTo(ox + 26, 2); g.quadraticCurveTo(ox + 50, 10, ox + 64, -2); g.stroke(); }
    g.globalAlpha = 1; g.fillStyle = '#F0B4B4'; g.beginPath(); g.arc(-12, -12, 5.5, 0, TAU); g.fill(); g.beginPath(); g.arc(-4, -11, 4.5, 0, TAU); g.fill();
    g.fillStyle = '#F4F2EE'; g.beginPath(); g.moveTo(-22, -8); g.lineTo(-30, -2); g.lineTo(-20, 2); g.fill(); g.fillStyle = '#C02020'; g.beginPath(); g.arc(-18, -6, 1.8, 0, TAU); g.fill();
    g.strokeStyle = 'rgba(255,255,255,0.8)'; g.lineWidth = 0.8; g.beginPath(); g.moveTo(-26, -3); g.lineTo(-38, -8); g.moveTo(-26, -1); g.lineTo(-38, 1); g.stroke();
    g.fillStyle = '#FFD040'; g.beginPath(); g.arc(-27, -2, 3.6, 0, TAU); g.fill(); g.fillStyle = 'rgba(255,220,90,0.5)'; g.beginPath(); g.arc(-27, -2, 9, 0, TAU); g.fill(); g.restore(); };
  const osd = (g, s, x, y, col, p = 5) => K.pixText(g, s, x, y, p, col, '#000');

  XY.STYLES.vhs = {
    hits: [2.3, 4],
    post(canvas, g, e) { K.zoomPost(canvas, g, e, PLAT[0] + 130, PLAT[2] - 20, K.push(e.beat, 3.9, 5.3, 0.12)); },
    draw(g, e) {
      // the very first frame at a new scale rendered ~700 px differently from every later frame (canvas caches being created mid-frame);
      // painting it once into a throwaway canvas on first use makes the frame a pure function of t again (checked with qa/cells/h/det68b.cjs)
      if (this._warm !== e.S) { this._warm = e.S; const wc = XY.scratch('vhs-warm', g.canvas.width, g.canvas.height), wg = wc.getContext('2d'); wg.setTransform(e.S, 0, 0, e.S, 0, 0); this.draw(wg, e); }
      const { W, H, t, u, lt } = e, S = e.S, Wd = Math.round(W * S), Hd = Math.round(H * S), k = S / 2, w2 = Math.round(Wd / 2), h2 = Math.round(Hd / 2), mode = deck(u);
      const sT = sceneT(lt, e.cell.dur), fr = floor(t * 30);
      g.save(); g.setTransform(1, 0, 0, 1, 0, 0);
      if (mode === 'snow') { this.snow(g, Wd, Hd, fr, 1); g.restore(); this.osd(g, e, mode, sT); return; }
      // ---- 1. the scene at half resolution
      const A = XY.scratch('vhs-a', w2, h2), a = A.getContext('2d'); a.setTransform(k, 0, 0, k, 0, 0);
      const ffA = mode === 'ff' ? 0.5 + 0.5 * sin(sT * 9) : 0;
      a.fillStyle = ffA > 0.5 ? '#BCD4E8' : '#101634'; a.fillRect(500, 140, 280, 240);
      if (ffA <= 0.5) { a.fillStyle = '#ECE6C8'; a.beginPath(); a.arc(706, 206, 22, 0, TAU); a.fill(); a.fillStyle = '#101634'; a.beginPath(); a.arc(716, 200, 19, 0, TAU); a.fill();
        a.fillStyle = '#C8CCE0'; for (let s = 0; s < 14; s++) a.fillRect(510 + XY.hash(s, 1) * 260, 150 + XY.hash(s, 2) * 200, 2, 2); }
      a.drawImage(room(k, W, H), 0, 0, W, H);
      monks(a, u, sT);
      if (u >= SICK[0] && u < SICK[1]) sickbed(a, sT, t);
      if (mode === 'pause') { a.save(); a.translate(PLAT[0] + 6 + MW + 40, PLAT[2] - 32); a.scale(2.1, 2.1); mouse(a, 0, 0, true); a.restore(); }
      else if (u > 0.47 && u < 0.5) { const q = (u - 0.47) / 0.03; a.fillStyle = 'rgba(245,245,240,0.55)'; a.fillRect(XY.lerp(640, PLAT[0] + 90, q) - 40, PLAT[2] - 22, 120, 9); }
      // lantern, candles, incense, medicine steam
      { const sw = 0.06 * sin(sT * 1.6), lx = 300 + sin(sw) * 70, ly = 70 + cos(sw) * 70; a.strokeStyle = '#2A1A12'; a.lineWidth = 2; a.beginPath(); a.moveTo(300, 70); a.lineTo(lx, ly); a.stroke();
        a.fillStyle = '#C83A28'; a.beginPath(); a.ellipse(lx, ly + 22, 16, 22, sw, 0, TAU); a.fill(); a.fillStyle = '#E8B040'; a.fillRect(lx - 9, ly - 2, 18, 4); a.fillRect(lx - 9, ly + 42, 18, 4); this.lx = lx; this.ly = ly + 22; }
      [905, 1035].forEach((x, i) => { const f = 1 + 0.25 * sin(sT * 17 + i * 2) + 0.15 * sin(sT * 31 + i); a.fillStyle = '#FFD070'; a.beginPath(); a.ellipse(x, 426 - 4 * f, 3.4, 7 * f, 0, 0, TAU); a.fill(); });
      a.strokeStyle = 'rgba(220,220,230,0.5)'; a.lineWidth = 2.2; a.beginPath(); for (let j = 0; j <= 20; j++) { const y = 452 - j * 9, x = 970 + 10 * sin(sT * 1.4 - j * 0.45) * (j / 20) * 2; j ? a.lineTo(x, y) : a.moveTo(x, y); } a.stroke();
      a.strokeStyle = 'rgba(240,240,240,0.4)'; a.lineWidth = 2; [0, 1].forEach(j => { a.beginPath(); for (let q = 0; q <= 10; q++) { const y = 548 - q * 5, x = 360 + j * 8 + 3 * sin(sT * 3 - q * 0.8 + j); q ? a.lineTo(x, y) : a.moveTo(x, y); } a.stroke(); });
      // night light: multiply blue over the room; the pilgrims go on after it so they stay ~40 % brighter than the set
      a.save(); a.globalCompositeOperation = 'multiply'; a.fillStyle = `rgba(110,118,170,${0.62 * (1 - ffA)})`; a.fillRect(0, 0, W, H); a.restore();
      a.save(); a.globalCompositeOperation = 'screen'; const fl = a.createRadialGradient(e.procX, 700, 20, e.procX, 700, 520); fl.addColorStop(0, 'rgba(255,200,140,0.22)'); fl.addColorStop(1, 'rgba(255,200,140,0)'); a.fillStyle = fl; a.fillRect(0, 380, W, 400); a.restore();
      this.pilgrims(a, e, mode);
      a.save(); a.globalCompositeOperation = 'screen';
      let gr = a.createRadialGradient(this.lx, this.ly, 4, this.lx, this.ly, 260); gr.addColorStop(0, 'rgba(255,170,90,0.55)'); gr.addColorStop(1, 'rgba(255,140,60,0)'); a.fillStyle = gr; a.fillRect(0, 0, W, H);
      gr = a.createRadialGradient(970, 430, 4, 970, 430, 180); gr.addColorStop(0, 'rgba(255,200,110,0.45)'); gr.addColorStop(1, 'rgba(255,180,90,0)'); a.fillStyle = gr; a.fillRect(700, 250, 500, 400);
      a.fillStyle = `rgba(150,170,230,${0.12 * (1 - ffA)})`; a.beginPath(); a.moveTo(500, 140); a.lineTo(780, 140); a.lineTo(900, 780); a.lineTo(420, 780); a.fill();
      a.fillStyle = 'rgba(40,30,50,0.16)'; a.fillRect(0, 0, W, H); a.restore();
      // ---- 2. chroma split and re-add with a shift, plus a faint ghost
      const split = (key, col) => { const c = XY.scratch(key, w2, h2), x = c.getContext('2d'); x.drawImage(A, 0, 0); x.globalCompositeOperation = 'multiply'; x.fillStyle = col; x.fillRect(0, 0, w2, h2); return c; };
      const Rc = split('vhs-r', '#FF0000'), Gc = split('vhs-g', '#00FF00'), Bc = split('vhs-b', '#0000FF'), C = XY.scratch('vhs-c', w2, h2), cx = C.getContext('2d'), sh = Math.max(1, Math.round(2.2 * k));
      cx.fillStyle = '#000'; cx.fillRect(0, 0, w2, h2); cx.globalCompositeOperation = 'lighter'; cx.drawImage(Rc, sh, 0); cx.drawImage(Gc, 0, 0); cx.drawImage(Bc, -sh, 1); cx.globalAlpha = 0.14; cx.drawImage(Gc, 4 * sh, 0); cx.globalAlpha = 1;
      this.compose(g, e, C, mode, Wd, Hd, fr);
      g.restore();
      this.osd(g, e, mode, sT);
    },
    // the pilgrims in the dormitory; Tang Seng has a fever: thermometer in the mouth, flushed cheek, sweat
    pilgrims(a, e, mode) {
      const { u, t } = e, px = e.procX, gy = e.groundY;
      if (px - 410 > e.W + 10 || px + 330 < -10) return;
      const sick = u >= SICK[0] && u < SICK[1], acts = { cast: sick ? { rider: false } : {}, wukong: { shade: K.win(u, 0.49, 0.63, 0.03), raise: K.win(u, 0.64, 0.78, 0.04) }, monk: { palm: u > SICK[1] ? K.win(u, 0.84, 1.1, 0.04) : 0.5 }, bajie: { scratch: K.win(u, 0.3, 0.5, 0.05) }, shaseng: { lift: K.win(u, 0.6, 0.68, 0.025) } };
      XY.drawProcession(a, e.phase, px, gy, PEN, acts);
      if (sick || u >= SICK[1]) return;   // in bed now, or well again
      const hd = e.at('monk.head', acts);
      a.save(); a.lineCap = 'round'; a.strokeStyle = '#F4F4F8'; a.lineWidth = 3.4; a.beginPath(); a.moveTo(hd[0] + 9, hd[1] + 7); a.lineTo(hd[0] + 31, hd[1] + 15); a.stroke();
      a.strokeStyle = '#A8B8C8'; a.lineWidth = 1; a.stroke(); a.fillStyle = '#E02020'; a.beginPath(); a.arc(hd[0] + 31, hd[1] + 15, 2.8, 0, TAU); a.fill();
      a.fillStyle = `rgba(230,60,60,${0.4 + 0.15 * sin(t * 6)})`; a.beginPath(); a.ellipse(hd[0] + 5, hd[1] + 4, 5.5, 3.2, 0, 0, TAU); a.fill();
      a.fillStyle = 'rgba(200,230,255,0.9)'; [0, 1].forEach(j => { const q = (t * 1.3 + j * 0.5) % 1; a.beginPath(); a.ellipse(hd[0] - 9 - j * 5, hd[1] - 8 + q * 22, 1.6, 2.6, 0, 0, TAU); a.fill(); });
      a.restore();
    },
    // half-res picture → frame: vertical roll while locking, jitter, tracking band, head-switch noise, grain, scanlines
    compose(g, e, C, mode, Wd, Hd, fr) {
      const { u, S, lt } = e;
      let roll = 0; if (mode === 'lock') { const q = XY.smooth((u + 0.3) / 0.18); roll = Math.round(((Hd * 2.3 * Math.pow(1 - q, 2)) % Hd)); }
      const jy = (XY.hash(fr, 3) < 0.07 ? 2 * S : 0) + (mode === 'ff' ? (XY.hash(fr, 4) - 0.5) * 6 * S : 0) + (mode === 'pause' ? (fr % 2) * 1.5 * S : 0);
      g.imageSmoothingEnabled = true;
      if (roll > 1) { g.drawImage(C, 0, roll, Wd, Hd); g.drawImage(C, 0, roll - Hd, Wd, Hd); g.fillStyle = '#000'; g.fillRect(0, roll - 16 * S, Wd, 16 * S); }
      else g.drawImage(C, 0, jy, Wd, Hd);
      const nb = mode === 'ff' || mode === 'rew' ? 3 : 1, bh = (mode === 'play' || mode === 'lock' ? 22 : 44) * S;
      for (let b = 0; b < nb; b++) {
        const yb = mode === 'pause' ? Hd * 0.86 : (((lt * (mode === 'ff' ? 700 : 110) + b * 330) * S) % (Hd + bh * 2)) - bh;
        for (let s = 0; s < 8; s++) { const y = yb + s * bh / 8, dx = (XY.hash(s + b * 10, fr) - 0.5) * (mode === 'play' ? 26 : 60) * S; if (y < 0 || y > Hd) continue; g.drawImage(C, 0, y / 2, C.width, bh / 16, dx, y, Wd, bh / 8); }
        g.fillStyle = 'rgba(255,255,255,0.75)'; for (let n = 0; n < 26; n++) g.fillRect(XY.hash(n, fr + b) * Wd, yb + XY.hash(n + 50, fr) * bh, (8 + 70 * XY.hash(n + 99, fr)) * S, 1.3 * S);
      }
      const hs = 13 * S; for (let s = 0; s < 4; s++) { const y = Hd - hs + s * hs / 4; g.drawImage(C, 0, y / 2, C.width, hs / 8, (14 + 34 * XY.hash(s, fr)) * S, y, Wd, hs / 4); }
      g.fillStyle = 'rgba(255,255,255,0.4)'; for (let n = 0; n < 10; n++) g.fillRect(XY.hash(n, fr + 7) * Wd, Hd - hs + XY.hash(n, fr + 8) * hs, 30 * S, S);
      const Gt = grain(fr % 4), ox = -XY.hash(fr, 7) * 160, oy = -XY.hash(fr, 8) * 160; g.save(); g.globalAlpha = 0.13; g.globalCompositeOperation = 'overlay';
      for (let y = oy; y < Hd; y += 320) for (let x = ox; x < Wd; x += 320) g.drawImage(Gt, x, y, 320, 320); g.restore();
      g.drawImage(XY.keep(`vhs-scan:${Wd}x${Hd}`, Wd, Hd, cv => { const c = cv.getContext('2d'); c.fillStyle = 'rgba(0,0,0,0.14)'; for (let y = 0; y < Hd; y += 3) c.fillRect(0, y, Wd, 1.2);
        const v = c.createRadialGradient(Wd / 2, Hd / 2, Hd * 0.35, Wd / 2, Hd / 2, Wd * 0.62); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,0.5)'); c.fillStyle = v; c.fillRect(0, 0, Wd, Hd); }), 0, 0);
      if (mode === 'lock') this.snow(g, Wd, Hd, fr, 1 - XY.smooth((u + 0.3) / 0.12));
      if (mode === 'rew') this.snow(g, Wd, Hd, fr, 0.25);
    },
    snow(g, Wd, Hd, fr, a) { if (a <= 0.01) return; g.save(); g.globalAlpha = a; const Gt = grain(fr % 4), ox = -XY.hash(fr, 5) * 160;
      for (let y = 0; y < Hd; y += 320) for (let x = ox; x < Wd; x += 320) g.drawImage(Gt, x, y, 320, 320);
      g.fillStyle = 'rgba(0,0,0,0.35)'; g.fillRect(0, ((fr * 23) % 100) / 100 * Hd, Wd, Hd * 0.12); g.restore(); },
    // on-screen display: deck mode, CH 68, tape counter, camcorder date and time; titler 病 / 第68难
    osd(g, e, mode, sT) {
      const { W, H, u, t } = e, top = { ff: '>> FF', pause: '|| PAUSE', rew: '<< REW', play: '> PLAY', lock: '> PLAY', snow: '' }[mode];
      g.save();
      if (top && (mode !== 'pause' || floor(t * 3) % 2 === 0)) osd(g, top, 40, 34, '#FFFFFF');
      osd(g, 'CH 68', W - 40 - K.pixW('CH 68', 6), 34, '#5CFF7A', 6);
      if (mode !== 'snow') {
        const pos = 4980 + floor(sT * 6), hh = floor(pos / 3600), mm = floor(pos / 60) % 60, ss = pos % 60, p2 = n => String(n).padStart(2, '0');
        osd(g, `SP ${hh}:${p2(mm)}:${p2(ss)}`, 40, H - 74, '#FFFFFF');
        const day = u < SICK[0] ? 20 : u < 0.45 ? 21 : u < SICK[1] ? 22 : 23, date = `OCT.${day}.1988`, tm = `AM 2:${p2((47 + floor(sT * 3)) % 60)}`;
        osd(g, date, W - 40 - K.pixW(date, 5), H - 120, '#FFB030'); osd(g, tm, W - 40 - K.pixW(tm, 5), H - 74, '#FFB030');
        g.imageSmoothingEnabled = false; const T1 = K.kanji('病', 22, '#FFE040'), T1s = K.kanji('病', 22, '#C0208C'), T2 = K.kanji('第68难', 12, '#FFFFFF'), T2s = K.kanji('第68难', 12, '#C0208C');
        g.drawImage(T1s, 66, 106, T1.width * 4.2, T1.height * 4.2); g.drawImage(T1, 60, 100, T1.width * 4.2, T1.height * 4.2);
        g.drawImage(T2s, 64, 216, T2.width * 3, T2.height * 3); g.drawImage(T2, 60, 212, T2.width * 3, T2.height * 3);
      }
      g.restore();
    },
  };
})();
