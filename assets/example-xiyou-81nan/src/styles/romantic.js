// 36 浪漫主义 · 路逢大水 — a Turner-and-Friedrich evening at the 通天河: storm clouds wheeling round a golden rift,
// a river with no far shore, a lone boat, mist, a stone tablet on the bank. On beat 3 a shaft of light drops from
// the rift onto the tablet and 通天河 blazes out; 悟空 has been shading his eyes at the water all along.
(() => {
  'use strict';
  const XY = window.XY, K = XY.KIT_D, TAU = XY.TAU;
  const GY = 702, HZ = 520, GAP = [840, 170], TAB = [1096, 690];
  const PEN = { outline: null, seed: 36, shade: 'rgba(10,8,14,0.3)',
    color: r => ({ fur: '#5A3E28', face: '#B8946E', wkshirt: '#7A2A1E', tiger: '#9A6A2E', stripe: '#1A1410', gold: '#C8A04A', staff: '#6E2018', ink: '#141014',
      horse: '#B8B0A2', horse2: '#8A8478', mane: '#A8A094', hoof: '#1E1A18', saddle: '#4A1E16', red: '#7A221A', robe: '#9A7E48', kasaya: '#7A1E16',
      skin: '#B89A7A', metal: '#9A8448', bjrobe: '#1E2028', bjpants: '#18191E', pig: '#B8908A', pig2: '#9A7068', wood: '#4E3820',
      ssrobe: '#26343E', ssrobe2: '#1C2830', skin2: '#8A6A50', ssh: '#6E2E1E', ssbeard: '#5E261A', skull: '#B8B0A0', bundle: '#6E5A36' })[r] || XY.DEFAULT_COLORS[r] };
  const mixc = (a, b, u) => a.map((v, i) => v + (b[i] - v) * u);

  XY.STYLES.romantic = {
    hits: [4.4],
    bg(g, W, H) {
      // the sky as paint: storm cloud and a golden rift, value noise worked into a slow radial light
      const sky = K.texture(W, HZ + 4, 3, (x, y) => { const d = Math.hypot((x - GAP[0]) * 0.8, y - GAP[1]), glow = Math.exp(-Math.pow(d / 250, 2)), n = XY.fbm(x / 150, y / 85, 36, 4) + 0.35 * XY.fbm(x / 40, y / 30, 37, 2);
        const lit = mixc([248, 230, 182], [200, 140, 80], XY.clamp(d / 520)), cloud = mixc([92, 86, 96], [36, 34, 42], XY.clamp(y / 420 + 0.2 * n)), c = XY.clamp(0.55 + n * 1.3 - glow * 1.1);
        const haze = XY.clamp((y - 380) / 140), col = mixc(mixc(lit, cloud, c), [196, 178, 150], haze * 0.6); return [col[0], col[1], col[2], 255]; });
      g.imageSmoothingQuality = 'high'; g.drawImage(sky, 0, 0, W, HZ + 4);
      // brushwork over it: short loaded strokes that follow the clouds and wheel round the rift
      { const R = XY.rng(363), px = sky.getContext('2d').getImageData(0, 0, sky.width, sky.height).data; g.lineCap = 'round';
        for (let k = 0; k < 1700; k++) { const x = R() * W, y = R() * (HZ - 10), i = (Math.min(sky.height - 1, Math.floor(y / 3)) * sky.width + Math.min(sky.width - 1, Math.floor(x / 3))) * 4;
          const dx = x - GAP[0], dy = (y - GAP[1]) * 1.6, sw = Math.atan2(dy, dx) + Math.PI / 2, n = XY.fbm(x / 220, y / 160, 38, 2) * 2.2, a = XY.lerp(n, sw, Math.exp(-Math.hypot(dx, dy) / 300)), l = 8 + 22 * R(), v = (R() - 0.5) * 34;
          g.strokeStyle = `rgba(${Math.round(px[i] + v)},${Math.round(px[i + 1] + v)},${Math.round(px[i + 2] + v * 0.8)},0.55)`; g.lineWidth = 2 + 4 * R();
          g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + Math.cos(a) * l * 0.5 + 3, y + Math.sin(a) * l * 0.5, x + Math.cos(a) * l, y + Math.sin(a) * l); g.stroke(); } }
      // the river: haze at the horizon, darker toward us, long horizontal strokes
      let gr = g.createLinearGradient(0, HZ, 0, 690); gr.addColorStop(0, '#CDBE98'); gr.addColorStop(0.35, '#7E7A70'); gr.addColorStop(1, '#262A2E'); g.fillStyle = gr; g.fillRect(0, HZ, W, 690 - HZ);
      { const R = XY.rng(361); for (let k = 0; k < 260; k++) { const y = HZ + 4 + Math.pow(R(), 1.4) * 166, x = R() * W, l = 20 + R() * 90 * (1 - (y - HZ) / 200), a = 0.05 + 0.12 * R();
        g.strokeStyle = R() < 0.6 ? `rgba(230,214,170,${a})` : `rgba(20,22,28,${a})`; g.lineWidth = 1 + R() * 2.4; g.beginPath(); g.moveTo(x, y); g.lineTo(x + l, y + (R() - 0.5) * 2); g.stroke(); } }
      // far left shore with the farm village (its lamps are lit in draw)
      g.fillStyle = 'rgba(70,64,60,0.6)'; g.beginPath(); g.moveTo(0, HZ + 12); g.quadraticCurveTo(160, HZ - 6, 330, HZ + 8); g.lineTo(330, HZ + 20); g.lineTo(0, HZ + 26); g.fill();
      g.fillStyle = 'rgba(60,56,54,0.7)'; [[60, 10], [100, 14], [150, 9], [200, 12]].forEach(([x, h]) => { g.fillRect(x, HZ + 4 - h, 18, h + 6); g.beginPath(); g.moveTo(x - 4, HZ + 4 - h); g.lineTo(x + 9, HZ - 6 - h); g.lineTo(x + 22, HZ + 4 - h); g.fill(); });
      // the stone tablet on the right bank
      const [tx, ty] = TAB; gr = g.createLinearGradient(tx - 56, 0, tx + 56, 0); gr.addColorStop(0, '#5A564E'); gr.addColorStop(0.4, '#8A847A'); gr.addColorStop(1, '#3A3832');
      g.fillStyle = gr; g.beginPath(); g.moveTo(tx - 52, ty); g.lineTo(tx - 50, ty - 210); g.quadraticCurveTo(tx, ty - 246, tx + 50, ty - 210); g.lineTo(tx + 52, ty); g.fill();
      g.fillStyle = '#4A463E'; g.fillRect(tx - 66, ty - 12, 132, 16);
      { const R = XY.rng(9); for (let k = 0; k < 120; k++) { g.fillStyle = R() < 0.5 ? 'rgba(30,28,24,0.25)' : 'rgba(200,190,170,0.15)'; g.fillRect(tx - 50 + R() * 100, ty - 220 + R() * 216, 2 + R() * 4, 1 + R() * 3); }
        g.fillStyle = 'rgba(90,110,70,0.5)'; for (let k = 0; k < 30; k++) { g.beginPath(); g.arc(tx - 40 + R() * 80, ty - 30 + R() * 26, 2 + R() * 4, 0, TAU); g.fill(); } }
      g.fillStyle = 'rgba(28,24,22,0.85)'; g.font = XY.font(40, XY.cnFont.li, 'bold'); g.textAlign = 'center'; K.vtext(g, '通天河', tx, ty - 158, 46);
      g.font = XY.font(13, XY.cnFont.kai); K.vtext(g, '径过八百里', tx + 34, ty - 176, 15); K.vtext(g, '亘古少人行', tx - 34, ty - 176, 15); g.textAlign = 'left';
      // the near bank: dark earth with ochre light on its lip, rocks
      gr = g.createLinearGradient(0, 676, 0, H); gr.addColorStop(0, '#4A3E30'); gr.addColorStop(0.2, '#2E2620'); gr.addColorStop(1, '#16120E'); g.fillStyle = gr;
      g.beginPath(); g.moveTo(0, 684); for (let x = 0; x <= W; x += 30) g.lineTo(x, 684 - 8 * Math.sin(x / 90) - 4 * XY.noise1(x / 40, 3)); g.lineTo(W, H); g.lineTo(0, H); g.fill();
      g.strokeStyle = 'rgba(214,170,100,0.55)'; g.lineWidth = 2.4; g.beginPath(); for (let x = 0; x <= W; x += 30) g.lineTo(x, 684 - 8 * Math.sin(x / 90) - 4 * XY.noise1(x / 40, 3)); g.stroke();
      [[60, 760, 90, 40], [1120, 770, 110, 46], [520, 776, 60, 22]].forEach(([x, y, rx, ry]) => { gr = g.createRadialGradient(x - rx * 0.3, y - ry * 0.5, 4, x, y, rx); gr.addColorStop(0, '#5A4E40'); gr.addColorStop(1, '#14100C'); g.fillStyle = gr; g.beginPath(); g.ellipse(x, y, rx, ry, 0, Math.PI, TAU); g.fill(); });
      // Friedrich's dead oak on the left, black against the light
      const branch = (x, y, a, l, w, d) => { if (d > 5 || l < 8) return; const x2 = x + Math.cos(a) * l, y2 = y + Math.sin(a) * l; g.strokeStyle = '#120E0C'; g.lineWidth = w; g.lineCap = 'round'; g.beginPath(); g.moveTo(x, y); g.lineTo(x2, y2); g.stroke();
        const h = XY.hash(Math.round(x), Math.round(y), d); branch(x2, y2, a - 0.4 - h * 0.5, l * 0.68, w * 0.62, d + 1); branch(x2, y2, a + 0.3 + h * 0.6, l * 0.62, w * 0.6, d + 1); };
      branch(150, 690, -1.62, 150, 18, 0); branch(150, 600, -2.5, 60, 8, 2);
      K.weave(g, W, H, 3, 'rgba(255,240,210,0.03)'); K.grain(g, W, H, 362, 1800, 'rgba(0,0,0,0.05)', 'rgba(255,240,200,0.04)', 4);
    },
    draw(g, e) {
      const { W, H, t, u, beat } = e, S = e.S, open = 0.35 + 0.65 * XY.smooth(u / 0.22), HIT = 4.4, hit = beat >= HIT ? 1 - 0.35 * XY.smooth((beat - HIT - 0.4) / 2) : 0, snap = beat >= HIT ? Math.exp(-(beat - HIT) * 3) : 0;
      // Turner's vortex: strokes wheeling round the rift, and the rift's glow opening as the panel arrives
      g.save(); g.globalCompositeOperation = 'screen'; g.lineCap = 'round';
      for (let k = 0; k < 130; k++) { const r = 40 + 330 * Math.pow(XY.hash(k, 1), 0.8), a0 = XY.hash(k, 2) * TAU + t * (0.18 + 0.25 * (1 - r / 370)) * (k % 3 ? 1 : 0.6), sw = 0.25 + 0.3 * XY.hash(k, 3);
        const warm = Math.exp(-r / 180), aA = (0.06 + 0.12 * warm) * open; g.strokeStyle = `rgba(${Math.round(180 + 70 * warm)},${Math.round(150 + 70 * warm)},${Math.round(120 + 40 * warm)},${aA})`; g.lineWidth = 2 + 6 * XY.hash(k, 4);
        g.beginPath(); g.ellipse(GAP[0], GAP[1], r * 1.25, r * 0.62, -0.12, a0, a0 + sw); g.stroke(); }
      let rg = g.createRadialGradient(GAP[0], GAP[1], 6, GAP[0], GAP[1], 300); rg.addColorStop(0, `rgba(255,246,214,${0.75 * open})`); rg.addColorStop(0.25, `rgba(255,220,150,${0.3 * open})`); rg.addColorStop(1, 'rgba(255,200,120,0)'); g.fillStyle = rg; g.fillRect(0, 0, W, 560);
      // shafts of light: a few loose ones always moving over the water, the hard one onto the tablet on beat 3
      const shaft = (x1, w1, a) => { const gr = g.createLinearGradient(GAP[0], GAP[1], x1, 690); gr.addColorStop(0, `rgba(255,236,190,${a})`); gr.addColorStop(1, `rgba(255,220,160,${a * 0.25})`);
        g.fillStyle = gr; g.beginPath(); g.moveTo(GAP[0] - 14, GAP[1] + 10); g.lineTo(GAP[0] + 14, GAP[1] + 10); g.lineTo(x1 + w1, 690); g.lineTo(x1 - w1, 690); g.fill(); };
      for (let k = 0; k < 4; k++) shaft(300 + k * 190 + 40 * Math.sin(t * 0.4 + k), 40 + 20 * XY.hash(k, 6), 0.07 * open);
      if (hit > 0) { shaft(TAB[0] + 10, 96, 0.34 * hit + 0.4 * snap); shaft(TAB[0] + 10, 46, 0.3 * hit + 0.4 * snap); }
      // the sun's road on the water: broken gold dabs that flicker
      for (let k = 0; k < 46; k++) { const y = HZ + 6 + Math.pow(XY.hash(k, 7), 1.3) * 150, x = GAP[0] + (XY.hash(k, 8) - 0.5) * (40 + (y - HZ) * 1.6), tw = Math.sin(t * (2 + 3 * XY.hash(k, 9)) + k);
        if (tw < 0) continue; g.fillStyle = `rgba(255,232,170,${0.55 * tw * open})`; g.fillRect(x, y, 10 + 30 * XY.hash(k, 10), 2.2); }
      g.restore();
      // the lone boat drifting out on the water, its reflection, a figure at the stern
      { const bx = 470 + 30 * Math.sin(t * 0.2) + 40 * u, by = 566 + 2 * Math.sin(t * 1.3);
        g.fillStyle = 'rgba(20,18,20,0.85)'; g.beginPath(); g.moveTo(bx - 34, by); g.lineTo(bx + 30, by); g.lineTo(bx + 22, by + 7); g.lineTo(bx - 28, by + 7); g.fill();
        g.fillRect(bx - 2, by - 46, 2.4, 46); g.beginPath(); g.moveTo(bx + 1, by - 44); g.quadraticCurveTo(bx + 22, by - 28, bx + 2, by - 6); g.fill(); g.fillRect(bx - 24, by - 14, 4, 14);
        g.fillStyle = 'rgba(20,18,20,0.25)'; g.fillRect(bx - 30, by + 9, 56, 3); g.fillRect(bx - 1, by + 12, 2, 22); }
      // mist rolling along the water and round the tablet's foot
      for (let k = 0; k < 6; k++) { const x = ((k * 260 + t * (14 + 6 * k)) % (W + 500)) - 250, y = 540 + (k % 3) * 44, rx = 260, ry = 34;
        rg = g.createRadialGradient(x, y, 4, x, y, rx); rg.addColorStop(0, 'rgba(220,210,190,0.32)'); rg.addColorStop(1, 'rgba(220,210,190,0)'); g.save(); g.translate(x, y); g.scale(1, ry / rx); g.translate(-x, -y); g.fillStyle = rg; g.beginPath(); g.arc(x, y, rx, 0, TAU); g.fill(); g.restore(); }
      // the village lamps on the far left shore (陈家庄, where the drums are)
      g.save(); g.globalCompositeOperation = 'screen'; [[68, 0], [108, 1], [158, 2], [208, 3], [128, 4]].forEach(([x, k]) => { const f = 0.6 + 0.4 * XY.noise1(t * 3 + k * 5, 4); rg = g.createRadialGradient(x, HZ + 2, 0, x, HZ + 2, 9); rg.addColorStop(0, `rgba(255,200,110,${0.9 * f})`); rg.addColorStop(1, 'rgba(255,170,80,0)'); g.fillStyle = rg; g.fillRect(x - 9, HZ - 7, 18, 18); }); g.restore();
      // the tablet's characters catch the light
      if (hit > 0) { g.save(); g.globalCompositeOperation = 'screen'; g.shadowColor = `rgba(255,220,140,${hit})`; g.shadowBlur = 26 * S; g.fillStyle = `rgba(255,230,160,${0.9 * hit + 0.1 * snap})`; g.font = XY.font(40, XY.cnFont.li, 'bold'); g.textAlign = 'center'; K.vtext(g, '通天河', TAB[0], TAB[1] - 158, 46); g.restore(); }
      // the procession, backlit: dark glaze over all, a gold rim on the edges that face the sky
      // 悟空 vaults up on his cloud to look for the far shore (原著第四十七回: 跳在空中, 定睛观看) and finds none; beats 1.6–3.9
      const acts = { wukong: { shade: K.win(beat, 1.0, 1.5) * (1 - K.win(beat, 6.4, 7.2)) }, monk: { palm: K.win(beat, 4.8, 5.4) * (1 - K.win(beat, 7.2, 7.8)) }, bajie: { scratch: K.win(beat, 4.0, 4.4) * (1 - K.win(beat, 5.4, 5.8)) }, shaseng: { lift: K.win(beat, 2.0, 2.4) * (1 - K.win(beat, 3.6, 4)) } };
      const fly = beat >= 1.6 && beat < 3.9;
      if (fly) { acts.cast = { wukong: false }; K.tag(e.phase, acts);
        const F = XY.procParts(e.phase, acts)[3], up = XY.smooth((beat - 1.6) / 0.6) * (1 - XY.smooth((beat - 3.3) / 0.6)), gx = e.procX + F.x, gy = e.groundY - 470 * up, look = Math.sin((beat - 2.2) * 2.6) * 0.5 * up;
        const cx = gx + 30 * Math.sin(beat * 3) * up, cy = gy;
        g.save(); g.translate(cx, cy); g.scale(look < 0 ? -1 : 1, 1);
        g.fillStyle = 'rgba(250,240,220,0.85)'; [[-30, 4, 26], [0, 8, 32], [30, 4, 24], [-10, -6, 20], [18, -4, 22]].forEach(([x, y, r]) => { g.beginPath(); g.ellipse(x, y, r, r * 0.55, 0, 0, TAU); g.fill(); });
        if (up > 0.05) { g.strokeStyle = 'rgba(250,236,200,0.5)'; g.lineWidth = 4; g.beginPath(); g.moveTo(0, 10); g.quadraticCurveTo(-40, 120 * up, -10, 460 * up); g.stroke(); }
        K.paint(g, F.parts, PEN); g.restore(); }
      const rim = `rgba(255,214,140,${0.5 + 0.35 * hit})`;
      K.put(g, K.lit(e, PEN, acts, { bands: [[0, -600, 'rgba(18,14,20,0.42)'], [4, -4, 'rgba(8,6,10,0.3)', 3], [0, 3.2, rim, 1], [-2.5, 2, 'rgba(255,200,130,0.35)']] }));
      // grass on the bank, combed by the wind
      g.strokeStyle = 'rgba(30,24,18,0.9)'; g.lineWidth = 1.6; for (let k = 0; k < 60; k++) { const x = XY.hash(k, 11) * W, h = 16 + 26 * XY.hash(k, 12), b = 0.35 + 0.15 * Math.sin(t * 1.8 + x * 0.02);
        g.beginPath(); g.moveTo(x, 700 + 30 * XY.hash(k, 13)); g.quadraticCurveTo(x + b * h * 0.4, 700 + 30 * XY.hash(k, 13) - h * 0.6, x + b * h, 700 + 30 * XY.hash(k, 13) - h); g.stroke(); }
      K.zoom(g, e, TAB[0], TAB[1] - 140, 1 + 0.15 * K.env(beat, 4.1, 4.6, 5.9, 6.6));
      g.drawImage(frame(W, H, S), 0, 0, W, H);
    },
  };
  // varnish, vignette and a deep gilt frame with an engraved plate: 大水 · XXXVI
  function frame(W, H, S) {
    return XY.cached('kd36-fr:' + S.toFixed(4), W * S, H * S, cv => { const g = cv.getContext('2d'); g.setTransform(S, 0, 0, S, 0, 0);
      g.fillStyle = 'rgba(150,108,40,0.07)'; g.fillRect(0, 0, W, H);
      const vg = g.createRadialGradient(W * 0.6, H * 0.4, 260, W * 0.5, H * 0.5, W * 0.7); vg.addColorStop(0, 'rgba(10,8,6,0)'); vg.addColorStop(1, 'rgba(10,8,6,0.5)'); g.fillStyle = vg; g.fillRect(0, 0, W, H);
      K.cracks(g, W, H, 36, 200, 'rgba(10,6,2,0.06)', 0.5);
      const gr = g.createLinearGradient(0, 0, W, H); gr.addColorStop(0, '#E2C478'); gr.addColorStop(0.5, '#9A7430'); gr.addColorStop(1, '#D8B866');
      g.strokeStyle = gr; g.lineWidth = 16; g.strokeRect(8, 8, W - 16, H - 16); g.strokeStyle = '#4A3410'; g.lineWidth = 2; g.strokeRect(17, 17, W - 34, H - 34); g.strokeStyle = 'rgba(255,240,200,0.6)'; g.lineWidth = 1; g.strokeRect(2, 2, W - 4, H - 4);
      const px = W / 2, py = H - 34; g.fillStyle = '#C8A65A'; g.fillRect(px - 110, py - 30, 220, 50); g.strokeStyle = '#6A4C1A'; g.lineWidth = 2; g.strokeRect(px - 104, py - 25, 208, 40);
      g.fillStyle = '#3A2810'; g.font = XY.font(40, XY.cnFont.song, 'bold'); g.textAlign = 'right'; g.textBaseline = 'alphabetic'; g.fillText('大水', px + 6, py + 9);
      g.font = XY.font(24, '"Times New Roman", serif'); g.textAlign = 'left'; g.fillText('XXXVI', px + 18, py + 6);
    });
  }
})();
