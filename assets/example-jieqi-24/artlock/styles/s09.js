// s09 芒种 · 齐白石草虫 — 生宣纸底，大笔写意墨叶墨枝（多根笔毛的笔触、浓淡干湿、晕开、飞白），配极精细的工笔小虫，朱红印章，一行竖题款。
// 记忆点（螳螂生）：枝上的螳螂卵鞘裂开，上百只小螳螂涌出来往下爬；伯劳在枝头张着嘴叫。
(function () {
  const JQ = window.JQ, S = JQ.SCENE, L = JQ.L, TAU = Math.PI * 2;
  const PAPER = '#F3EBD8', INK = '#1A1714', SEAL = '#B02A20';

  // ------------------------------------------------------------------ helpers
  const ink = (g, a, w, col = INK) => { g.strokeStyle = JQ.rgba(col, a); g.fillStyle = JQ.rgba(col, a); g.lineWidth = w; };
  const prof = (k, w0, w1) => JQ.lerp(w0, w1, k * k) * (Math.sin(Math.pow(k, 0.55) * Math.PI) * 0.75 + 0.25);   // swell in the belly, taper out
  const norm = (pts, i) => { const n = pts.length, p = pts[Math.max(0, i - 1)], r = pts[Math.min(n - 1, i + 1)], dx = r[0] - p[0], dy = r[1] - p[1], d = Math.hypot(dx, dy) || 1; return [-dy / d, dx / d]; };
  // the stroke's envelope, filled: used for the soft 晕 (blurred later) and for washes
  const wet = (g, pts, w0, w1, a, seed, col = INK) => {
    const n = pts.length, L1 = [], R1 = [];
    pts.forEach((q, i) => { const [nx, ny] = norm(pts, i), w = Math.max(0.8, prof(i / (n - 1), w0, w1) * (1 + (JQ.noise(i * 0.6, 2, seed) - 0.5) * 0.28));
      L1.push([q[0] + nx * w / 2, q[1] + ny * w / 2]); R1.push([q[0] - nx * w / 2, q[1] - ny * w / 2]); });
    g.beginPath(); L1.forEach((q, i) => i ? g.lineTo(...q) : g.moveTo(...q)); R1.reverse().forEach(q => g.lineTo(...q)); g.closePath();
    g.fillStyle = JQ.rgba(col, a); g.fill();
  };
  // the brush itself: N bristles across the width; dry bristles lift off toward the tail, leaving 飞白
  const bristle = (g, pts0, w0, w1, a, seed, dry) => {
    const pts = JQ.resample(pts0, 5, false), n = pts.length, N = Math.round(JQ.clamp(w0 / 2.4, 5, 20)), bw = Math.max(1.3, w0 / N * 1.7);
    g.lineCap = 'round'; g.lineJoin = 'round';
    for (let b = 0; b < N; b++) {
      const off = (b + 0.5) / N - 0.5; g.strokeStyle = JQ.rgba(INK, Math.min(1, a * (0.5 + 0.75 * (0.5 + off)) * (0.85 + 0.25 * JQ.hash(b, seed))));   // tip dipped in 浓墨: one edge dark, the other pale
      g.lineWidth = bw * (0.45 + 0.3 * JQ.hash(b, seed, 5));
      g.beginPath(); let pen = false;
      for (let i = 0; i < n; i++) { const k = i / (n - 1), [nx, ny] = norm(pts, i), w = prof(k, w0, w1), x = pts[i][0] + nx * off * w, y = pts[i][1] + ny * off * w;
        if (Math.abs(off) > 0.06 && JQ.noise(b * 1.7, k * 7 + seed * 0.13, seed) < dry * (0.2 + k * 0.95)) { pen = false; continue; }
        if (pen) g.lineTo(x, y); else { g.moveTo(x, y); pen = true; } }
      g.stroke();
    }
  };
  // paper grain that eats into the ink (destination-out), built once
  const speck = (() => { const c = document.createElement('canvas'); c.width = c.height = 128; const s = c.getContext('2d'), r = JQ.rng(31);
    for (let i = 0; i < 260; i++) { s.fillStyle = 'rgba(0,0,0,' + (0.15 + r() * 0.4) + ')'; s.fillRect(r() * 128, r() * 128, 1 + r() * 2.2, 0.8 + r() * 1.2); } return c; })();

  // ------------------------------------------------------------------ the paper and the ink
  const bg = (g, Sx) => {
    g.fillStyle = PAPER; g.fillRect(0, 0, 1920, 1080);
    const r = JQ.rng(909); g.lineWidth = 0.7;                               // xuan fibres
    for (let i = 0; i < 900; i++) { const x = r() * 1920, y = r() * 1080, l = 8 + r() * 40;
      g.strokeStyle = r() < 0.6 ? 'rgba(150,130,100,0.10)' : 'rgba(255,252,240,0.5)';
      g.beginPath(); g.moveTo(x, y); g.lineTo(x + l, y + (r() - 0.5) * 2); g.stroke(); }
    const vg = g.createRadialGradient(960, 520, 420, 960, 560, 1250);
    vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(120,98,64,0.16)'); g.fillStyle = vg; g.fillRect(0, 0, 1920, 1080);
    const W = JQ.layer('s09wash', Sx, { res: 0.5 }), H = JQ.layer('s09halo', Sx, { res: 0.5 }), I = JQ.layer('s09ink', Sx), veins = [];
    // washes (blurred later): far hills, field, ground, pond, stream, the house in grey
    ink(W.g, 0.16, 0); W.g.fill(S.mountains.path); ink(W.g, 0.2, 0); W.g.fill(S.hills.path);
    W.g.fillStyle = 'rgba(206,158,64,0.5)'; W.g.fill(S.field.path);   // 芒种: the wheat is ripe gold W.g.fillStyle = 'rgba(120,110,80,0.14)'; W.g.fill(S.ground.path);
    for (let i = 0; i < 7; i++) { const y = 470 + i * 16, x = 260 + (i % 3) * 140;
      wet(W.g, [[x, y], [x + 170, y + 4 + (i % 2) * 6], [x + 360, y - 3]], 22, 4, 0.22, 200 + i, '#9A6A20');
      wet(W.g, [[x + 560, y + 12], [x + 720, y + 10], [x + 880, y + 16]], 20, 4, 0.2, 220 + i, '#9A6A20'); }
    W.g.fillStyle = 'rgba(110,140,140,0.32)'; W.g.fill(S.pond.path); W.g.fillStyle = 'rgba(110,140,140,0.28)'; W.g.fill(S.stream.path);
    W.g.fillStyle = 'rgba(150,140,120,0.35)'; W.g.fill(S.bridge.path);
    W.g.fillStyle = 'rgba(90,84,74,0.42)'; W.g.fill(S.roof.path); W.g.fillStyle = 'rgba(120,112,96,0.2)'; W.g.fill(S.wall.path); W.g.fill(S.houseFront.path);
    W.g.fillStyle = 'rgba(60,54,46,0.45)'; W.g.fill(S.gate.path); W.g.fill(S.window.path);
    // a brush stroke = a pale 晕 envelope + the bristles; veins are crisp 浓墨 lines laid on top afterwards
    const BR = (pts, w0, w1, a, seed, dry) => { wet(H.g, pts, w0 * 1.3, w1 * 1.3, a * 0.4, seed); bristle(I.g, pts, w0, w1, a, seed, dry); };
    const fan = (x, y, ang, len, n, a, seed, spread = 0.9) => {
      for (let i = 0; i < n; i++) { const an = ang + (i - (n - 1) / 2) * spread * 0.42 + (JQ.hash(i, seed) - 0.5) * 0.14, l = len * (0.78 + JQ.hash(i, seed, 3) * 0.3);
        const tip = [x + Math.cos(an) * l, y + Math.sin(an) * l], mid = [x + Math.cos(an + 0.16) * l * 0.52, y + Math.sin(an + 0.16) * l * 0.5];
        BR([[x, y], mid, tip], l * 0.4, l * 0.03, a * (0.7 + JQ.hash(i, seed, 7) * 0.3), seed + i, 0.22);
        veins.push([[x, y], [JQ.lerp(x, mid[0], 1.05), JQ.lerp(y, mid[1], 1.05)], [JQ.lerp(mid[0], tip[0], 0.7), JQ.lerp(mid[1], tip[1], 0.7)]]); }
    };
    // trunk: one broad dry stroke with lots of 飞白, a darker thin one beside it
    BR([[476, 840], [462, 790], [470, 730], [458, 668], [472, 604], [488, 540], [498, 494]], 64, 36, 0.95, 3, 0.55);
    BR([[444, 826], [440, 762], [452, 700], [446, 640], [462, 580], [478, 528]], 12, 6, 0.85, 9, 0.5);
    S.branches.forEach((b, i) => { if (b.depth > 1) return; BR([[b.x1, b.y1], [JQ.lerp(b.x1, b.x2, 0.5) + 6, JQ.lerp(b.y1, b.y2, 0.5) + 8], [b.x2, b.y2]], b.w * 2.1, b.w * 0.9, 0.85, 20 + i, 0.45); });
    // the crown: large leaf fans, 淡墨 behind and 浓墨 in front
    [[410, 196, 1.75, 126, 0.42], [600, 210, 1.2, 120, 0.4], [250, 262, 2.3, 116, 0.45]].forEach(([cx, cy, a, l, al], i) => fan(cx, cy, a, l, 3, al, 40 + i, 1.0));
    [[470, 232, 1.5, 150], [600, 300, 1.1, 140], [398, 176, 1.75, 120], [556, 200, 1.35, 126]]
      .forEach(([cx, cy, a, l], i) => fan(cx + 80 * Math.cos(a), cy - 40 * Math.sin(a), a, l, 3, 1.0, 60 + i, 1.05));
    [[430, 430, 1.62, 96], [524, 440, 1.75, 84]].forEach(([cx, cy, a, l], i) => fan(cx, cy, a, l, 2, 0.55, 80 + i, 0.7));
    // the branch carrying the egg case, and the shrike's perch
    BR([[520, 470], [600, 452], [680, 470], [748, 452]], 15, 6, 0.9, 77, 0.4);
    fan(660, 458, -0.5, 78, 3, 0.85, 88, 0.8); fan(738, 450, -0.25, 70, 3, 0.8, 91, 0.8);
    BR([[486, 446], [420, 440], [340, 452], [260, 462], [176, 470]], 14, 5, 0.9, 95, 0.45);
    // the shrike (伯劳), 写意: grey head and back, black mask, black wing with a white patch, long tail, pale belly
    wet(H.g, [[204, 432], [252, 444], [300, 432]], 48, 20, 0.2, 101, '#8A6A3A');
    BR([[304, 400], [266, 392], [218, 402], [188, 414]], 38, 18, 0.4, 102, 0.3);
    BR([[312, 404], [294, 398], [274, 402]], 14, 8, 0.97, 103, 0.1);
    BR([[264, 408], [230, 414], [198, 428], [180, 440]], 30, 12, 0.92, 104, 0.35);
    BR([[188, 432], [150, 452], [112, 474]], 16, 4, 0.92, 105, 0.3);
    // composite: washes and 晕 blurred, bristles slightly softened and eaten by the paper grain
    const bl = px => 'blur(' + (px * Sx.scale).toFixed(2) + 'px)';
    g.filter = bl(4); JQ.blit(g, W); g.filter = bl(5); JQ.blit(g, H);
    I.g.globalCompositeOperation = 'destination-out'; I.g.fillStyle = I.g.createPattern(speck, 'repeat'); I.g.fillRect(0, 0, 1920, 1080); I.g.globalCompositeOperation = 'source-over';
    g.filter = bl(0.7); JQ.blit(g, I); g.filter = 'none';
    g.fillStyle = PAPER; g.beginPath(); g.ellipse(228, 418, 10, 6, -0.3, 0, TAU); g.fill();                  // the white wing patch
    veins.forEach(v => { ink(g, 0.82, 1.8); g.beginPath(); g.moveTo(...v[0]); g.quadraticCurveTo(...v[1], ...v[2]); g.stroke(); });
    // ripe ears dabbed in rows over the gold wash: an ochre dab and a dry ink awn each, a little denser toward the front
    g.save(); g.clip(S.field.path); const re = JQ.rng(919);
    for (let y = 462; y < 690; y += 13) for (let x = (y % 2) * 9; x < 1500; x += 15 + re() * 10) { if (x > 400 && x < 560 && y > 470) continue;
      const a = -1.2 + re() * 0.5, l = 7 + (y - 440) * 0.025; g.fillStyle = 'rgba(158,104,30,' + (0.35 + re() * 0.3) + ')'; g.beginPath(); g.ellipse(x, y, l * 0.32, l, a + Math.PI / 2, 0, TAU); g.fill();
      if (re() < 0.5) { ink(g, 0.35, 0.8); g.beginPath(); g.moveTo(x + Math.cos(a) * l, y + Math.sin(a) * l); g.lineTo(x + Math.cos(a) * l * 2.2, y + Math.sin(a) * l * 2.2); g.stroke(); } }
    g.restore();
    ink(g, 0.45, 2.2); g.stroke(JQ.open([[1402, 436], [1352, 520], [1300, 610], [1256, 700], [1226, 790]]));
    ink(g, 0.42, 3.0); g.stroke(S.pond.path); ink(g, 0.4, 2.2); g.stroke(S.bridgeArch.path); g.stroke(JQ.open([[1198, 654], [1290, 648], [1382, 654]]));
    ink(g, 0.5, 2.4); g.stroke(S.roof.path); g.stroke(S.gateRoof.path); ink(g, 0.38, 2.6); g.stroke(JQ.open([[1610, 812], [1608, 706], [1650, 686], [1692, 706], [1690, 812]]));
    ink(g, 0.6, 3); g.stroke(S.wallCap.path);
    // inscription top right: 芒种 over 螳螂生, then a red seal
    g.fillStyle = INK; g.textAlign = 'center'; g.textBaseline = 'alphabetic';
    g.font = '500 74px "Kaiti SC","STKaiti","KaiTi",serif'; JQ.vtext(g, '芒种', 1748, 116, 84);
    g.fillStyle = SEAL; g.fillRect(1734, 300, 56, 56); g.fillStyle = PAPER; g.font = '500 34px "Kaiti SC","STKaiti",serif'; g.fillText('生', 1762, 340);
  };
  JQ.ART = JQ.ART || {};
  const fine = (g, w = 1.1, col = INK, a = 0.9) => { g.strokeStyle = JQ.rgba(col, a); g.lineWidth = w; g.lineCap = 'round'; g.lineJoin = 'round'; };

  // ------------------------------------------------------------------ the insects
  const mantis = (g, x, y, s, a, ang, ph) => {               // a gongbi nymph, side view, facing right
    g.save(); g.translate(x, y); g.rotate(ang); g.scale(s, Math.abs(s));   // negative s = mirrored (facing left)
    fine(g, 1.5, INK, 0.95); g.fillStyle = 'rgba(126,166,78,0.78)';
    // abdomen, thorax, head, the bent forelegs
    g.beginPath(); g.ellipse(-10, 2, 15, 5.5, 0.12, 0, TAU); g.fill(); g.stroke();
    g.beginPath(); g.moveTo(-22, 0); g.lineTo(-38, -3); g.stroke();
    g.beginPath(); g.ellipse(2, -2, 9, 4.2, 0.2, 0, TAU); g.fill(); g.stroke();
    g.beginPath(); g.ellipse(15, -7, 6.5, 4.5, 0.5, 0, TAU); g.fill(); g.stroke();
    g.beginPath(); g.moveTo(18, -9); g.lineTo(24, -13); g.stroke();
    const snap = Math.sin(ph) * 0.18;
    [-1, 1].forEach((d, i) => {
      g.beginPath(); g.moveTo(9, -6 + i * 2); g.lineTo(15 + d, -14 - i * 2 + snap * 10); g.lineTo(22 + d * 1.4, -17 - i * 2 + snap * 12); g.stroke();
      g.beginPath(); g.moveTo(-8, 5); g.lineTo(-14, 15); g.stroke();
      g.beginPath(); g.moveTo(2, 5); g.lineTo(-2, 15); g.stroke();
    });
    g.restore();
  };

  // ------------------------------------------------------------------ 反舌 (a blackbird) on the wall cap, in wet ink: two cached poses, singing and tucked
  const BIRD = [1546, 598];
  const birdInk = (tuck) => (g, Sx) => {
    const W = JQ.layer('s09bw', Sx, { res: 0.5 }), I = JQ.layer('s09bi', Sx), [bx, by] = BIRD, hy = tuck ? 14 : 0;
    wet(W.g, [[bx - 40, by - 26], [bx, by - 30 + hy * 0.3], [bx + 44, by - 22]], tuck ? 60 : 50, 30, 0.5, 301);
    wet(W.g, [[bx + 30, by - 22], [bx + 62, by - 8], [bx + 92, by + 10]], 22, 8, 0.45, 302);
    bristle(I.g, [[bx - 34, by - 40 + hy * 0.5], [bx + 4, by - 44 + hy * 0.4], [bx + 40, by - 32]], tuck ? 34 : 26, 16, 0.95, 303, 0.35);
    bristle(I.g, [[bx - 20, by - 26], [bx + 20, by - 24], [bx + 52, by - 16]], 24, 10, 0.9, 304, 0.45);
    bristle(I.g, [[bx + 40, by - 20], [bx + 70, by - 4], [bx + 98, by + 14]], 18, 5, 0.95, 305, 0.3);
    bristle(I.g, [[bx - 44, by - 50 + hy], [bx - 54, by - 48 + hy], [bx - 60, by - 42 + hy]], 30, 22, 1, 306, 0.1);
    const bl = px => 'blur(' + (px * Sx.scale).toFixed(2) + 'px)';
    g.filter = bl(4); JQ.blit(g, W); g.filter = bl(0.6); JQ.blit(g, I); g.filter = 'none';
    ink(g, 0.9, 1.6); [[bx - 8, by - 6], [bx + 8, by - 6]].forEach(([x, y]) => { g.beginPath(); g.moveTo(x, y); g.lineTo(x - 2, y + 8); g.stroke(); });
    g.fillStyle = '#E8B04A'; g.beginPath(); g.arc(bx - 56, by - 50 + hy, 4.5, 0, TAU); g.fill(); g.fillStyle = INK; g.beginPath(); g.arc(bx - 56, by - 50 + hy, 2.2, 0, TAU); g.fill();
  };
  // ------------------------------------------------------------------ the reaped strip: pale stubble behind the woman (she cuts right to left)
  const STUB = [690, 586, 350, 96];
  const stubble = (g) => { const [x0, y0, w, h] = STUB; g.save(); g.clip(S.field.path); g.beginPath(); g.rect(x0, y0, w, h); g.clip();
    g.fillStyle = 'rgba(243,235,216,0.78)'; g.fillRect(x0, y0, w, h); g.fillStyle = 'rgba(214,176,100,0.3)'; g.fillRect(x0, y0, w, h);
    const r = JQ.rng(929); for (let y = y0 + 8; y < y0 + h; y += 9) for (let x = x0 + r() * 6; x < x0 + w; x += 7 + r() * 5) { ink(g, 0.25 + r() * 0.3, 1, '#7A5418'); g.beginPath(); g.moveTo(x, y); g.lineTo(x + (r() - 0.5) * 3, y - 5 - r() * 5); g.stroke(); }
    g.restore();
    g.save(); g.globalCompositeOperation = 'destination-in'; const fe = g.createLinearGradient(0, y0, 0, y0 + 26); fe.addColorStop(0, 'rgba(0,0,0,0)'); fe.addColorStop(1, '#000'); g.fillStyle = fe; g.fillRect(x0, y0, w, h); g.restore(); };   // feathered top edge
  // ------------------------------------------------------------------ the family (story track) in 淡墨: a soft half-resolution wash, then an ink contour
  const WASHC = { woman: { skin: '#EAD5B6', hair: '#1A1816', coat: '#9FB2B8', pants: '#6E6A62', apron: '#CDB892', hat: '#D9C38E', straw: '#D9C38E', scarf: '#B9A27A', cape: '#B9A27A' },
    kid: { skin: '#EAD5B6', hair: '#1A1816', coat: '#B7C0BD', pants: '#7A766E', apron: '#CDB892', hat: '#D9C38E', straw: '#D9C38E' },
    any: { ox: '#5E544A', oxDark: '#221C18', horn: '#F2ECDC', calf: '#A88E6E', calfDark: '#4A3C2C', eye: '#151210', prop: '#8A6A44', metal: '#6E7470', straw: '#D2A85A', red: SEAL, line: INK } };
  const washOf = (who, role) => (WASHC[who] && WASHC[who][role]) || WASHC.any[role] || JQ.roleColor(WASHC.any, role) || '#B7AE9C';
  const family = (g, Sx, items) => {
    if (!items.length) return;
    const Wl = JQ.layer('s09fam', Sx, { res: 0.5 }), wg = Wl.g;
    items.forEach(it => { wg.globalAlpha = (it.alpha == null ? 1 : it.alpha) * 0.92; it.parts.forEach(q => { if (q.role === 'eye' || q.role === 'line') return; wg.fillStyle = washOf(it.who, q.role); wg.fill(q.path); }); });
    g.save(); g.filter = 'blur(' + (1.4 * Sx.scale).toFixed(2) + 'px)'; JQ.blit(g, Wl); g.restore();
    items.forEach(it => { const sc = JQ.STORY_S(it.y), a = it.alpha == null ? 1 : it.alpha;                                 // ink: dry contour, solid hair and eyes
      it.parts.forEach(q => { if (q.role === 'hair' || q.role === 'eye' || q.role === 'line' || q.role === 'oxDark' || q.role === 'calfDark') { g.fillStyle = JQ.rgba(INK, 0.9 * a); g.fill(q.path); return; }
        g.strokeStyle = JQ.rgba(INK, (it.who === 'ox' ? 0.85 : 0.7) * a); g.lineWidth = (it.who === 'ox' ? 2.4 : 1.6) * sc; g.lineJoin = 'round'; g.stroke(q.path); }); });
  };
  const HOU = JQ.TERMS[8].hou, IMPACT = 4 / 3, BAR = 8 / 3, EGG = [692, 476];
  const IMPACT_ = 4 / 3, EGG_ = [692, 476];
  const nymphs = (g, t, front) => {
    for (let i = 0; i < 120; i++) {
      const h1 = JQ.hash(i, 11), h2 = JQ.hash(i, 23), h3 = JQ.hash(i, 37), st = i < 26 ? IMPACT_ - 0.1 + h1 * 0.25 : IMPACT_ + 0.2 + h1 * 1.9;
      if (t < st) continue;
      const age = t - st, u = JQ.clamp(age / 2.2), sx = EGG_[0] - 8 + h2 * 16, sy = EGG_[1] + 60, onTrunk = i % 5 === 0; let tx = onTrunk ? 468 + (h2 - 0.5) * 44 : 100 + ((i * 0.7548777 + 0.5) % 1) * 700 + (h2 - 0.5) * 70, ty = onTrunk ? 530 + ((i * 0.618) % 1) * 290 : 868 + ((i * 0.5698403 + 0.5) % 1) * 180 + (h1 - 0.5) * 36;
      if (!onTrunk && Math.abs(tx - 330) < 70 && ty > 930) tx += tx < 330 ? -110 : 110;   // leave the squatting child visible
      const drop = JQ.ease(JQ.clamp(age / 0.6)), hx = sx + (h2 - 0.5) * 120 * drop, hy = sy + 70 * drop + h3 * 60 * drop;        // first a drop on a silk thread
      const w = JQ.clamp((age - 0.5) / 1.8), x = JQ.lerp(hx, tx, JQ.ease(w)) + Math.sin(t * 0.9 + i) * 10 * w, y = JQ.lerp(hy, ty, JQ.ease(w)) + Math.cos(t * 0.7 + i * 1.3) * 5 * w;
      if (age < 0.7) { ink(g, 0.35, 0.8); g.beginPath(); g.moveTo(sx, sy); g.lineTo(hx, hy); g.stroke(); }
      const face = onTrunk && w >= 1 ? 1 : w < 1 ? (tx < hx ? -1 : 1) : (h1 < 0.5 ? -1 : 1), tilt = JQ.clamp(Math.atan2(ty - hy, Math.abs(tx - hx) + 1e-3), -0.8, 0.8);
      if ((y >= 1012) !== front) continue;
      mantis(g, x, y, (0.95 + h3 * 0.4) * face, 1, (onTrunk && w >= 1 ? Math.PI / 2 + (h2 - 0.5) * 0.6 : w < 1 ? tilt * face : (h3 - 0.5) * 0.8) + Math.sin(t * 3 + i) * 0.12, t * 6 + i);
    }
  };
  JQ.ART[9] = {
    key: IMPACT, keyHou: JQ.TERMS[8].keyHou,
    focus: [[692, 520], [300, 410], [1520, 570]],
    frame: false,
    draw(g, t, Sx) {
    t = JQ.clamp(t, 0, 9);
    JQ.blit(g, JQ.cached('s09bg', Sx, bg));
    const hou = Math.min(2, Math.floor(t / BAR)), CS = JQ.castFor(Sx, t), W0 = CS.state.woman;
    // the reaped strip opens behind the woman as she cuts leftward
    const own = JQ.storyState(Sx.n || 9, Math.min(Sx.lt != null ? Sx.lt : t, 7.99)).woman;   // the cut stays where she stopped, even after she walks off
    if (own && (own.pose === 'cut' || own.blend)) { const sc = Sx.scale, x0 = Math.max(STUB[0], own.x + 26), x1 = STUB[0] + STUB[2]; if (x1 > x0) { const L0 = JQ.cached('s09stub', Sx, stubble); g.drawImage(L0.c, x0 * sc, STUB[1] * sc, (x1 - x0) * sc, STUB[3] * sc, x0, STUB[1], x1 - x0, STUB[3]); } }
    nymphs(g, t, false);
    family(g, Sx, CS.items);
    // --- 螳螂生: the egg case trembles, splits on the impact and a hundred nymphs pour down to the ground (they stay)
    const [eggX, eggY] = EGG, crack = JQ.smooth(IMPACT - 0.2, IMPACT - 0.05, t), shake = JQ.smooth(0.5, IMPACT, t) * (1 - crack) * Math.sin(t * 34) * 0.06;
    g.save(); g.translate(eggX, eggY); g.rotate(shake); g.scale(1.25, 1.25);
    fine(g, 1.6, '#6A5230', 0.95); g.fillStyle = 'rgba(190,170,120,0.9)';
    g.beginPath(); g.moveTo(-16, 2); g.quadraticCurveTo(-6, 54, 4, 62); g.quadraticCurveTo(16, 40, 14, 2); g.closePath(); g.fill(); g.stroke();
    for (let i = 0; i < 6; i++) { g.beginPath(); g.moveTo(-13 + i * 5, 6); g.lineTo(-9 + i * 5, 58 - i * 2); g.stroke(); }
    if (crack > 0) { g.strokeStyle = 'rgba(30,22,14,' + (0.6 + crack * 0.4) + ')'; g.lineWidth = 2.6; g.beginPath(); g.moveTo(-8, 6); g.lineTo(-1, 6 + crack * 50); g.lineTo(7, 4 + crack * 30); g.stroke(); }
    g.restore();
    if (t > IMPACT && t < IMPACT + 0.7) { const k = (t - IMPACT) / 0.7; ink(g, 0.55 * (1 - k), 2.2);                   // the burst: a spray of dry ink flicks
      for (let i = 0; i < 12; i++) { const an = i / 12 * TAU + 0.3, r0 = 40 + k * 30, r1 = 60 + k * 70; g.beginPath(); g.moveTo(eggX + Math.cos(an) * r0, eggY + 36 + Math.sin(an) * r0); g.lineTo(eggX + Math.cos(an) * r1, eggY + 36 + Math.sin(an) * r1); g.stroke(); } }
    nymphs(g, t, true);                                       // the nymphs that have crawled out in front of the family's feet
    mantis(g, 690, 448, 2.1, 1, -0.3, t * 2);                 // the mother mantis on the leaf
    // --- 鵙始鸣: from bar 2 the shrike calls on every beat, dry ink arcs leave its beak
    const ph = ((t - BAR) / 0.6667) % 1, open = t < BAR ? 0.08 : 0.15 + 0.85 * Math.exp(-ph * 3.5);
    g.fillStyle = INK; g.beginPath(); g.moveTo(310, 397); g.quadraticCurveTo(328, 394, 338, 400); g.quadraticCurveTo(336, 407, 332, 405); g.lineTo(312, 405); g.closePath(); g.fill();
    g.save(); g.translate(312, 406); g.rotate(open * 0.55); g.beginPath(); g.moveTo(0, 0); g.lineTo(22, 3); g.lineTo(0, 6); g.closePath(); g.fillStyle = '#3A3228'; g.fill(); g.restore();
    ink(g, 0.85, 1.8); [[240, 448], [256, 450]].forEach(([x, y]) => { g.beginPath(); g.moveTo(x, y - 10); g.lineTo(x - 2, y + 12); g.stroke(); });
    if (t >= BAR) for (let b = Math.max(0, Math.floor((t - BAR) / 0.6667) - 2); b <= Math.floor((t - BAR) / 0.6667); b++) { const age = t - BAR - b * 0.6667; if (age < 0 || age > 1.4) continue;
      g.setLineDash([14, 5, 6, 5]); ink(g, 0.6 * (1 - age / 1.4), 3.2 - age * 1.4); for (let k = 0; k < 3; k++) { const r = 24 + k * 22 + age * 80; g.beginPath(); g.arc(336, 402, r, -0.55, 0.45); g.stroke(); } g.setLineDash([]); }
    // --- 反舌无声: the blackbird sings through bars 1–2, then at bar 3 shuts its beak, tucks its head in; its song marks fall away
    const tuck = JQ.smooth(16 / 3, 16 / 3 + 0.3, t);
    if (tuck < 1) { g.globalAlpha = 1 - tuck; JQ.blit(g, JQ.cached('s09bird0', Sx, birdInk(false))); }
    if (tuck > 0) { g.globalAlpha = tuck; JQ.blit(g, JQ.cached('s09bird1', Sx, birdInk(true))); }
    g.globalAlpha = 1;
    const sing = t < 16 / 3 ? Math.max(0, Math.sin(t * 7.5)) * 0.9 : 0, [bx, by] = BIRD, hy = tuck * 14;
    g.fillStyle = '#D8962A'; g.beginPath(); g.moveTo(bx - 66, by - 54 + hy); g.lineTo(bx - 88 + tuck * 8, by - 50 + hy + tuck * 6); g.lineTo(bx - 66, by - 47 + hy); g.closePath(); g.fill();
    g.save(); g.translate(bx - 66, by - 48 + hy); g.rotate(-sing * 0.5); g.beginPath(); g.moveTo(0, 0); g.lineTo(-18, 2); g.lineTo(0, 4); g.closePath(); g.fillStyle = '#C07A1E'; g.fill(); g.restore();
    for (let k = 0; k < 14; k++) { const te = 0.2 + k * 0.38; if (te > 16 / 3 || t < te) continue;
      const age = t - te, fall = Math.max(0, t - 16 / 3), a = (1 - JQ.clamp(age / 1.6)) * (1 - JQ.clamp(fall / 0.6)); if (a <= 0) continue;
      const x = bx - 96 - age * 46 - (k % 3) * 10, y = by - 64 - age * 30 + (k % 2) * 12 + fall * fall * 160;
      ink(g, 0.6 * a, 2); g.beginPath(); g.moveTo(x, y); g.bezierCurveTo(x - 6, y - 8, x - 10, y + 8, x - 16, y); g.stroke(); }
    // --- the inscription's pentad line, written glyph by glyph at each bar (pale wet ink darkening)
    g.fillStyle = INK; g.textAlign = 'center'; g.textBaseline = 'alphabetic'; g.font = '500 44px "Kaiti SC","STKaiti","KaiTi",serif';
    const u = t - hou * BAR; [...HOU[hou]].forEach((ch, k) => { const a = hou === 0 && t < 0.01 ? 1 : JQ.clamp((u - k * 0.13) / 0.18); if (a > 0) { g.globalAlpha = a; g.fillText(ch, 1810, 122 + k * 50); } });
    g.globalAlpha = 1;
  } };
})();
