// 54 超现实 · 1931 年 · 诸天神遭困（8 拍）— a Dalí plain under a low sun: blue-to-straw sky, a still sea, golden cliffs; back on the
// far plain a dead tree on a stone block with a soft watch over its edge and the soft character 「困」 drooping from a branch.
// 黄眉's 人种袋 hangs from the tree like another soft object. The five 五方揭谛 level their halberds (2), the bag twitches (2.8),
// and on 4 it gapes and inhales: one by one the generals are pulled out like taffy, head first, and pour into it; their
// halberds drop and go soft; on 5.3 it gulps and swells with lumps. Only their long dark shadows stay standing where they were.
// The pilgrims' shadows are yanked toward the bag too and snap back (第六十五至六十六回).
(() => {
  'use strict';
  const XY = window.XY, TAU = XY.TAU, K = () => XY.KIT_F;
  const C = { sky0: '#22407C', sky1: '#5F88BD', sky2: '#E9DCAE', sea: '#7F9FB2', rock: '#E8C27A', rockD: '#9A6A34', ground0: '#D2AD70', ground1: '#7A5129', slab: '#B88A52', slabD: '#7E5A30', gold: '#F0D27C', goldD: '#9A7426', dial: '#F6EFD6', ink: '#2A1E14', bag: '#C8A878', bagD: '#7A5A3A' };
  const HZ = 468, MOUTH = [482, 392], GEN = [[770, '#3A6A5A'], [850, '#B8402E'], [930, '#E8E2D2'], [1010, '#2A2622'], [1090, '#D8A83A']];
  // the block, the dead tree, the bag and 困 stand back on the far plain: drawn through GT (scale 0.86 about the ground, base y 600)
  const GSC = 0.86, GT = g => { g.translate(30, 600 - 702 * GSC); g.scale(GSC, GSC); }, gm = (x, y) => [30 + x * GSC, 600 + (y - 702) * GSC], MW = gm(MOUTH[0], MOUTH[1]);
  const SUCK = 4, GULP = 5.3;
  const poly = (g, pts) => { g.beginPath(); g.moveTo(pts[0][0], pts[0][1]); for (let k = 1; k < pts.length; k++) g.lineTo(pts[k][0], pts[k][1]); g.closePath(); };
  const PEN = { seed: 54, outline: null, shade: 'rgba(40,24,10,0.3)',
    color: r => ({ fur: '#8A5A30', face: '#EED2A8', wkshirt: '#B8402E', tiger: '#E0A040', stripe: C.ink, gold: C.gold, staff: '#A83224', ink: C.ink, horse: '#F4EEDE', horse2: '#D2C6AC', mane: '#ECE4D0',
      hoof: '#3A2A1E', saddle: '#6A2A1E', red: '#A83224', robe: '#E8C46A', kasaya: '#A83224', skin: '#F0D4B0', metal: C.gold, bjrobe: '#2E2C34', bjpants: '#24222A', pig: '#EEB4A8', pig2: '#D4948A',
      wood: '#7A5232', ssrobe: '#3E5A6E', ssrobe2: '#30485A', skin2: '#C09068', ssh: '#A8442C', ssbeard: '#8A3A24', skull: '#F2EADA', bundle: '#D8A848' })[r] || C.rock };
  const SIL = { color: () => '#000', shade: false, fine: false };
  // ground shadow: a point at height h above the line y = gy lands at (x − kx·h, gy − ky·h) — the sun is low on the right
  const shadowXf = (g, S, gy, kx, ky) => g.setTransform(S, 0, S * kx, S * ky, -S * kx * gy, S * gy * (1 - ky));
  // a 五方揭谛: armour in his direction's colour, gold breastplate mirror, plumed helmet, halberd; feet at the origin
  const general = (g, col, t, j, solid, noHalb, arm = 0) => {
    const f = c => solid || c, sw = 0.03 * Math.sin(t * 1.7 + j);
    g.save(); g.rotate(sw);
    g.fillStyle = f('#5A3A22'); g.fillRect(-14, -50, 10, 50); g.fillRect(4, -50, 10, 50);
    g.fillStyle = f(col); poly(g, [[-26, -40], [26, -40], [20, -84], [-20, -84]]); g.fill();
    g.fillStyle = f(C.goldD); for (let p = 0; p < 3; p++) g.fillRect(-24 + p * 2, -60 + p * 8, 48 - p * 4, 3);
    g.fillStyle = f(col); poly(g, [[-22, -84], [22, -84], [26, -132], [-26, -132]]); g.fill();
    g.fillStyle = f(C.gold); g.beginPath(); g.arc(0, -108, 11, 0, TAU); g.fill();
    g.fillStyle = f(C.goldD); g.beginPath(); g.ellipse(-30, -128, 14, 9, -0.3, 0, TAU); g.ellipse(30, -128, 14, 9, 0.3, 0, TAU); g.fill();
    g.fillStyle = f('#E6C8A0'); g.beginPath(); g.arc(0, -146, 12, 0, TAU); g.fill();
    g.fillStyle = f(C.goldD); g.beginPath(); g.arc(0, -150, 14, Math.PI, 0); g.fill(); g.fillStyle = f('#B8402E'); poly(g, [[-3, -162], [3, -162], [10 + 6 * Math.sin(t * 3 + j), -186], [0, -172]]); g.fill();
    if (!noHalb) { g.save(); g.translate(34, -100); g.rotate(-0.5 * arm); g.translate(-34, 100);
    g.strokeStyle = f('#6A4A2A'); g.lineWidth = 3; g.beginPath(); g.moveTo(34, -10); g.lineTo(34, -190); g.stroke();
    g.fillStyle = f('#C8C2B4'); poly(g, [[34, -190], [40, -176], [34, -170], [28, -176]]); g.fill(); g.beginPath(); g.moveTo(34, -170); g.quadraticCurveTo(48, -166, 44, -152); g.lineTo(36, -160); g.fill(); g.restore(); }
    g.restore(); };
  // Dalí's soft watch: unit disc (u, v) → a flat part on the surface and a part drooping over the edge at v > fold
  const softMap = (cx, cy, R, fold, sag) => (u, v) => { if (v <= fold) return [cx + u * R, cy + v * R * 0.3];
    const q = (v - fold) / (1 - fold); return [cx + u * R * (1 - 0.1 * q), cy + fold * R * 0.3 + q * R * (0.62 + 0.35 * sag) + R * 0.3 * sag * (1 - u * u) * q * q + 4 * Math.sin(u * 5 + q * 3) * q]; };
  const softWatch = (g, map, t, speed) => {
    const rim = []; for (let k = 0; k <= 48; k++) { const a = k / 48 * TAU; rim.push(map(Math.cos(a), Math.sin(a))); }
    const gr = g.createLinearGradient(0, rim[36][1], 0, rim[12][1]); gr.addColorStop(0, C.gold); gr.addColorStop(1, C.goldD); g.fillStyle = gr; poly(g, rim); g.fill();
    const dial = []; for (let k = 0; k <= 48; k++) { const a = k / 48 * TAU; dial.push(map(Math.cos(a) * 0.84, Math.sin(a) * 0.84)); } g.fillStyle = C.dial; poly(g, dial); g.fill();
    g.strokeStyle = C.ink; g.lineWidth = 2; for (let k = 0; k < 12; k++) { const a = k / 12 * TAU, p = map(Math.cos(a) * 0.72, Math.sin(a) * 0.72), q = map(Math.cos(a) * 0.62, Math.sin(a) * 0.62); g.beginPath(); g.moveTo(p[0], p[1]); g.lineTo(q[0], q[1]); g.stroke(); }
    [[0.5, 3], [0.66, 1.6]].forEach(([L, w], j) => { const a = t * speed * (j ? 1 : 1 / 12) - Math.PI / 2; g.lineWidth = w; g.beginPath(); for (let s = 0; s <= 8; s++) { const p = map(Math.cos(a) * L * s / 8, Math.sin(a) * L * s / 8); s ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1]); } g.stroke(); });
    const top = map(0, -1); g.fillStyle = C.goldD; g.beginPath(); g.ellipse(top[0], top[1] - 6, 6, 4, 0, 0, TAU); g.fill(); };
  // the soft character 困, drooping over a branch: rows above the fold sit on top, rows below sag and stretch
  const kunTex = S => XY.cached('sur-kun:' + S.toFixed(4), 200 * S, 210 * S, cv => { const g = cv.getContext('2d'); g.setTransform(S, 0, 0, S, 0, 0);
    const gr = g.createLinearGradient(0, 0, 0, 210); gr.addColorStop(0, '#FFF6DE'); gr.addColorStop(0.6, '#E8D2A0'); gr.addColorStop(1, '#A8834A');
    g.font = XY.font(190, XY.cnFont.song, '900'); g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = gr; g.fillText('困', 100, 108); });
  const drawKun = (g, S, x, y, sag, t) => { const T = kunTex(S), rows = 60, h = 210, fold = 0.34;
    for (let i = 0; i < rows; i++) { const v0 = i / rows, v1 = (i + 1) / rows, sy = v0 * T.height, sh = T.height / rows + 1;
      const yy = v => (v < fold ? y - (fold - v) * h * 0.32 : y + ((v - fold) / (1 - fold)) * h * (0.78 + 0.3 * sag) + h * 0.12 * sag * Math.pow((v - fold) / (1 - fold), 2));
      const q = Math.max(0, (v0 - fold) / (1 - fold)), ws = v0 < fold ? 1.08 : 1 - 0.42 * q * q + 0.1 * sag * Math.sin(q * Math.PI), dx = 22 * sag * q * q + 5 * q * Math.sin(t * 1.3 + q * 4);
      const d0 = yy(v0), d1 = yy(v1); g.drawImage(T, 0, sy, T.width, sh, x - 100 * ws + dx, d0, 200 * ws, d1 - d0 + 0.8); }
    const tip = y + h * (0.78 + 0.3 * sag) + h * 0.12 * sag; g.fillStyle = '#C8A870'; g.beginPath(); g.ellipse(x + 22 * sag, tip + 2, 30, 10, 0, 0, Math.PI); g.fill();
    [[-10, 0.6], [22, 1], [44, 0.5]].forEach(([dx, s], j) => { const ph = (t * 0.4 + j * 0.37) % 1; g.beginPath(); g.ellipse(x + dx + 22 * sag, tip + ph * 120 * s, 4 * s + 2, 7 * s + 4, 0, 0, TAU); g.fill(); });
  };

  XY.STYLES.surreal = {
    bg(g, W, H, cell, scale) {
      let gr = g.createLinearGradient(0, 0, 0, HZ); gr.addColorStop(0, C.sky0); gr.addColorStop(0.55, C.sky1); gr.addColorStop(1, C.sky2); g.fillStyle = gr; g.fillRect(0, 0, W, HZ);
      gr = g.createLinearGradient(0, HZ - 16, 0, HZ + 4); gr.addColorStop(0, '#8AA6B8'); gr.addColorStop(1, '#4F6F86'); g.fillStyle = gr; g.fillRect(0, HZ - 16, W, 20);
      // the golden cliffs of the coast, lit from the right
      g.fillStyle = C.rockD; poly(g, [[820, HZ], [860, 400], [930, 372], [990, 320], [1060, 300], [1130, 340], [1180, 330], [1180, HZ]]); g.fill();
      g.fillStyle = C.rock; poly(g, [[930, 372], [990, 320], [1060, 300], [1080, 330], [1040, 380], [990, 420], [960, HZ], [900, HZ]]); g.fill(); poly(g, [[1130, 340], [1180, 330], [1180, HZ], [1120, HZ], [1150, 400]]); g.fill();
      // the plain, and its faint undulations
      gr = g.createLinearGradient(0, HZ, 0, H); gr.addColorStop(0, C.ground0); gr.addColorStop(1, C.ground1); g.fillStyle = gr; g.fillRect(0, HZ + 4, W, H - HZ);
      g.fillStyle = 'rgba(80,50,20,0.12)'; [[520, 26], [600, 34], [680, 40]].forEach(([y, h]) => { g.beginPath(); g.ellipse(W / 2, y, W * 0.7, h, 0, 0, TAU); g.fill(); });
      // the stone block and its long shadow to the left (on the far plain)
      g.save(); GT(g);
      const sh = (pts, a) => { g.fillStyle = `rgba(40,24,10,${a})`; poly(g, pts); g.fill(); };
      sh([[72, 702], [372, 702], [372 - 227, 666], [72 - 227, 666]], 0.42);
      gr = g.createLinearGradient(72, 0, 372, 0); gr.addColorStop(0, C.slabD); gr.addColorStop(1, C.slab); g.fillStyle = gr; poly(g, [[72, 590], [372, 590], [372, 702], [72, 702]]); g.fill();
      g.fillStyle = '#D2A468'; poly(g, [[40, 560], [340, 560], [372, 590], [72, 590]]); g.fill(); g.fillStyle = C.slabD; poly(g, [[40, 560], [72, 590], [72, 702], [40, 670]]); g.fill();
      // the dead tree on the block (its shadow, then the tree): trunk, a branch to the right for the bag, one to the left for 困
      const tree = (c, w) => { g.strokeStyle = c; g.lineCap = 'round'; g.lineWidth = w; g.beginPath(); g.moveTo(252, 566); g.bezierCurveTo(262, 470, 226, 360, 240, 262); g.stroke();
        g.lineWidth = w * 0.55; g.beginPath(); g.moveTo(240, 270); g.quadraticCurveTo(330, 220, 432, 232); g.stroke(); g.beginPath(); g.moveTo(238, 300); g.quadraticCurveTo(170, 250, 80, 254); g.stroke();
        g.lineWidth = w * 0.3; g.beginPath(); g.moveTo(240, 262); g.lineTo(262, 200); g.moveTo(330, 236); g.lineTo(350, 200); g.stroke(); };
      g.save(); g.transform(1, 0, 1.6, 0.22, -1.6 * 566, 566 * (1 - 0.22)); g.globalAlpha = 0.3; tree('#2A1A0C', 30); g.restore();
      g.save(); tree('#5A3C22', 18); g.globalAlpha = 0.6; g.translate(4, -2); tree('#9A7448', 6); g.restore();
      g.restore();
      // the counter, written small in the right foreground like the date on a painting
      g.save(); g.translate(918, 760); g.transform(1, 0, -0.22, 1, 0, 0); g.fillStyle = '#4A2E18'; g.font = XY.font(32, XY.cnFont.song, 'bold'); g.fillText('第五十四难', 0, 0); g.restore();
      g.strokeStyle = '#4A2E18'; g.lineWidth = 2; g.beginPath(); g.moveTo(912, 768); g.quadraticCurveTo(1010, 778, 1100, 764); g.stroke();
    },
    draw(g, e) {
      const { W, H, t, u, beat } = e, k = K(), S = e.S, GB = 612, GS = 0.66;
      const pr = (a, b, r = 0.3) => XY.smooth((beat - a) / r) * (1 - XY.smooth((beat - b) / r));
      const acts = { wukong: { shade: pr(1.2, 2.6), raise: pr(3.0, 4.4) + k.after(beat, 6.2, 0.4), strike: pr(4.4, 5.0, 0.15) }, monk: { palm: pr(3.6, 6.4) }, bajie: { scratch: k.pulse(beat, 6.8, 0.8) }, shaseng: { lift: k.pulse(beat, 4.3, 0.5) } };
      // the generals: charging pose from 2, then (from SUCK) each pulled out like taffy into the bag mouth, head first
      const fOf = j => XY.clamp((beat - SUCK - j * 0.2) / 0.9), arm = XY.smooth((beat - 1.8) / 0.4);
      // the pull on the pilgrims' shadows: yanked toward the bag as it inhales, snapping back with an overshoot
      const pull = beat < SUCK ? 0 : beat < SUCK + 0.5 ? XY.easeOut((beat - SUCK) / 0.5) : Math.cos((beat - SUCK - 0.5) * 8) * Math.exp(-(beat - SUCK - 0.5) * 3);
      // ---- long shadows. The generals' stay where they stood after their owners are gone — dark, still swaying
      const [cv, lg] = k.layer(e, 'sur-sh');
      // cast shadows fall forward-left across the plain (sun low behind, on the right); once a general is taken his upright
      // silhouette stays standing where he was, a shadow with no one to cast it
      GEN.forEach(([x], j) => { lg.save(); lg.transform(1, 0, 1.3, -0.55, -1.3 * GB, GB * 1.55); lg.translate(x, GB); lg.scale(GS, GS); general(lg, '#000', t, j, '#000', false, arm); lg.restore();
        const gone = XY.smooth((fOf(j) - 0.15) / 0.5); if (gone > 0) { lg.save(); lg.globalAlpha = 0.8 * gone; lg.translate(x, GB); lg.scale(GS, GS); general(lg, '#000', t, j, '#000', false, arm); lg.restore(); } });
      k.blit(g, cv, 0.75);
      const [cv3, l3] = k.layer(e, 'sur-sh2'); l3.save(); shadowXf(l3, S, e.groundY, 1.6 - 3.2 * pull, 0.22 + 0.08 * Math.abs(pull)); XY.drawProcession(l3, e.phase, e.procX, e.groundY, SIL, acts); l3.restore(); k.blit(g, cv3, 0.45);
      // ---- on the far plain: the soft watch over the block's edge (its hands race while the bag swallows time), 困 on the branch
      const spin = 3.2 + 40 * k.pulse(beat, SUCK + 0.7, 1.0);
      g.save(); GT(g); softWatch(g, softMap(300, 574, 56, 0.28, 0.55 + 0.6 * XY.clamp((beat + 2) / 9)), t * (1 + 0) + 0, spin);
      drawKun(g, S, 160, 252, 0.55 + 0.09 * Math.sin(t * 0.6) + 0.35 * XY.clamp((beat + 2) / 9), t);
      // ---- the 人种袋: limp at first, twitching from 2.6, mouth gaping on SUCK, gulping on GULP, then swollen with lumps (the gods inside)
      const open = XY.smooth((beat - SUCK + 0.4) / 0.4) * (1 - XY.smooth((beat - GULP) / 0.25)), fat = XY.easeOut((beat - GULP) / 0.4), gulp = k.hitDecay(beat, GULP, 0.6), tw = k.pulse(beat, 2.8, 0.3) + k.pulse(beat, 3.4, 0.3);
      g.strokeStyle = '#4A3420'; g.lineWidth = 3; g.beginPath(); g.moveTo(432, 232); g.lineTo(436, 296); g.stroke();
      const bx = 440 + 6 * tw * Math.sin(t * 30), by = 382 + 10 * fat, rx = 64 + 30 * fat + 10 * open - 14 * gulp, ry = 86 + 22 * fat + 20 * gulp, bag = [];
      for (let j = 0; j <= 32; j++) { const a = j / 32 * TAU, lump = fat * 14 * Math.max(0, Math.sin(a * 3 - t * 5)) + fat * 8 * Math.max(0, Math.sin(a * 5 + t * 3)) + 3 * Math.sin(t * 2 + a * 2); bag.push([bx + Math.cos(a) * (rx + lump), by + Math.sin(a) * (ry + lump) * (Math.sin(a) < 0 ? 0.9 : 1)]); }
      const bg2 = g.createRadialGradient(bx + 26, by - 30, 10, bx, by, ry * 1.2); bg2.addColorStop(0, '#E8D2A8'); bg2.addColorStop(0.6, C.bag); bg2.addColorStop(1, C.bagD);
      g.fillStyle = bg2; g.beginPath(); g.moveTo(436, 296); g.quadraticCurveTo(bx - rx * 0.4, by - ry * 0.9, bag[0][0], bag[0][1]); bag.forEach(p => g.lineTo(p[0], p[1])); g.closePath(); g.fill();
      g.strokeStyle = 'rgba(90,60,30,0.55)'; g.lineWidth = 2.2; for (let j = -3; j <= 3; j++) { g.beginPath(); g.moveTo(436 + j * 2, 302); g.quadraticCurveTo(436 + j * 9, 330, bx + j * rx * 0.24, by - ry * 0.35); g.stroke(); }
      [[-0.5, 0.15], [0.1, 0.45], [-0.2, 0.7]].forEach(([dx, dy], j) => { g.beginPath(); g.moveTo(bx + dx * rx - 30, by + dy * ry); g.quadraticCurveTo(bx + dx * rx, by + dy * ry + 12 + 4 * Math.sin(t * 2 + j), bx + dx * rx + 34, by + dy * ry - 4); g.stroke(); });
      g.strokeStyle = '#8A2A1E'; g.lineWidth = 3; g.beginPath(); g.moveTo(430, 300); g.quadraticCurveTo(410 + 6 * Math.sin(t * 2), 340, 404, 372); g.moveTo(442, 300); g.quadraticCurveTo(426 + 6 * Math.sin(t * 2 + 1), 350, 424, 386); g.stroke();
      g.fillStyle = '#8A2A1E'; [[404, 372], [424, 386]].forEach(([x, y]) => { g.beginPath(); g.ellipse(x, y + 8, 4, 9, 0, 0, TAU); g.fill(); });
      g.fillStyle = C.bagD; g.beginPath(); g.ellipse(436, 300, 12, 7, 0, 0, TAU); g.fill();
      const mx = MOUTH[0] + 24 * fat, mry = 8 + 50 * open, mrx = 6 + 16 * open;
      if (open > 0.08) { g.fillStyle = '#E8D2A8'; g.beginPath(); g.ellipse(mx + 3, MOUTH[1], mrx + 6, mry + 6, -0.15, 0, TAU); g.fill();
        g.fillStyle = '#1A0E06'; g.beginPath(); g.ellipse(mx, MOUTH[1], mrx, mry, -0.15, 0, TAU); g.fill(); }
      g.restore();
      if (open > 0.05) { g.strokeStyle = `rgba(240,230,200,${0.55 * open})`; g.lineWidth = 2.4;
        for (let j = 0; j < 9; j++) { const ph = (t * 2.2 + j / 9) % 1, r = 520 * (1 - ph) + 20, a = -0.75 + j * 0.16; g.beginPath(); g.arc(MW[0], MW[1], r, a, a + 0.22); g.stroke(); } }
      // ---- the five 揭谛 as soft bodies: each is drawn once into its own sprite, then laid along a curve into the mouth as 36
      //      horizontal slices, head first (slice v leads by its height), narrowing as it goes in — they pour in like taffy
      const SW_ = 130, SH_ = 210, NS = 36;
      GEN.forEach(([x, col], j) => { const f = fOf(j);
        // the halberd is dropped as the pull starts: it falls, lands and goes soft over the ground
        if (f > 0) { const d = XY.clamp((beat - SUCK - j * 0.2) / 0.5), hx0 = x + 34 * GS, len = 180 * GS, lx = hx0 + 10 + 40 * d, ly = XY.lerp(GB - 100 * GS, GB - 4, XY.easeIn(d)), ang = XY.lerp(-Math.PI / 2, -0.08, XY.easeIn(d));
          g.strokeStyle = '#6A4A2A'; g.lineWidth = 2.4; g.beginPath(); for (let q = 0; q <= 10; q++) { const u2 = q / 10 - 0.5, sag = d * 10 * (1 - 4 * u2 * u2);
            const px = lx + Math.cos(ang) * len * u2, py = ly + Math.sin(ang) * len * u2 + sag; q ? g.lineTo(px, py) : g.moveTo(px, py); } g.stroke();
          g.fillStyle = '#C8C2B4'; const tx_ = lx + Math.cos(ang) * len * 0.5, ty_ = ly + Math.sin(ang) * len * 0.5; g.beginPath(); g.ellipse(tx_, ty_ + d * 3, 6, 4, ang, 0, TAU); g.fill(); }
        if (f >= 1) return;
        if (f <= 0) { g.save(); g.translate(x, GB); g.scale(GS, GS); general(g, col, t, j, null, false, arm); g.restore(); return; }
        const spr = XY.scratch('sur-gen' + j, SW_ * GS * S, SH_ * GS * S), sg2 = spr.getContext('2d'); sg2.setTransform(GS * S, 0, 0, GS * S, 0, 0); sg2.translate(SW_ / 2 - 6, SH_ - 4); general(sg2, col, t, j, null, true, arm);
        const w = SW_ * GS, h = SH_ * GS, ctrl = [(x + MW[0]) / 2 + 60, 200 - j * 18];
        const Q = (p0, s2) => [(1 - s2) * (1 - s2) * p0[0] + 2 * (1 - s2) * s2 * ctrl[0] + s2 * s2 * MW[0], (1 - s2) * (1 - s2) * p0[1] + 2 * (1 - s2) * s2 * ctrl[1] + s2 * s2 * MW[1]];
        const at = v => { const p0 = [x, GB - h * (1 - v)], s2 = XY.clamp((f * 1.7 - v * 0.7)); return [Q(p0, XY.easeIn(s2)), s2]; };
        for (let i = 0; i < NS; i++) { const v0 = i / NS, v1 = (i + 1) / NS, [A, sa] = at(v0), [B] = at(v1); if (sa >= 0.999) continue;
          const dx = B[0] - A[0], dy = B[1] - A[1], L = Math.max(1, Math.hypot(dx, dy)), ww = w * (1 - 0.8 * sa) * (1 + 0.25 * Math.sin(sa * Math.PI));
          g.save(); g.translate(A[0], A[1]); g.rotate(Math.atan2(dy, dx) - Math.PI / 2); g.drawImage(spr, 0, spr.height * v0, spr.width, spr.height / NS + 1, -ww / 2, 0, ww, L + 1.2); g.restore(); } });
      const gf = k.hitDecay(beat, GULP, 0.4); if (gf > 0.03) { g.fillStyle = `rgba(255,248,225,${0.45 * gf})`; g.fillRect(0, 0, W, H); }
      // ---- the pilgrims: no contour, modelled by light from the low sun on the right
      const [cv2, l2] = k.layer(e, 'sur-proc'); XY.drawProcession(l2, e.phase, e.procX, e.groundY, PEN, acts);
      l2.save(); l2.globalCompositeOperation = 'source-atop'; const sg = l2.createLinearGradient(e.procX - 400, 0, e.procX + 330, 0);
      sg.addColorStop(0, 'rgba(30,20,40,0.32)'); sg.addColorStop(0.6, 'rgba(30,20,40,0.05)'); sg.addColorStop(1, 'rgba(255,236,190,0.22)'); l2.fillStyle = sg; l2.fillRect(e.procX - 420, e.groundY - 300, 760, 310);
      l2.restore(); k.blit(g, cv2);
      e._zoom = [[MW[0] + 200, 420, k.push(beat, SUCK - 0.1, 0.2, 0.6, 0.9)], [MW[0] + 40, MW[1] + 40, k.push(beat, GULP - 0.1, 0.12, 0.3, 0.8)]];
    },
    post(canvas, g, e) { const z = e._zoom; if (!z) return; const a = z[0][2] > 0 ? z[0] : z[1]; if (a[2] > 0) K().postZoom(canvas, g, e, a[0], a[1], 1 + (a === z[0] ? 0.1 : 0.12) * a[2]); },
    hits: [SUCK, GULP],
    thumb: 7,   // overview thumbnail: a clear frame with no in-panel push-in active
  };
})();
