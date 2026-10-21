// 40 后印象·梵高 · 1889 年 · 普天神难伏 — 第五十一、五十二回：悟空上天搬兵，托塔天王、哪吒、火德星君、水德星君、雷公一齐
// 压下金兜山，兵器、火、水、雷全被金刚琢套走。兕大王站在洞上的石台举琢，头顶的大漩涡就是琢的吸口：4.5 拍火流、水柱、
// 雷与哪吒的兵器一齐拐弯卷进去。全画是流场笔触（天空随漩涡转、山随岩石、地随透视），柏树像火苗；山脚是天兵营帐，洞口小妖摇旗。
(() => {
  'use strict';
  const XY = window.XY, K = XY.KIT_E, TAU = XY.TAU;
  const V = [1110, 196], V2 = [300, 330], FIRE = 1.6, WATER = 2.3, THUNDER = 3.0, NEZHA = 3.6, SUCK = 4.5, FLASH = 5.6, HILL = 470, NEAR = 640, DEMON = [1128, 440];
  const SKYP = ['#1E3A8A', '#2A4FA8', '#3C66C0', '#5C86D8', '#8FB6EE', '#1B2A78', '#4A78C8', '#9CC8E8', '#2E5AB4'], SWP = ['#9CC8E8', '#CFE6F2', '#F2E8A0', '#5C86D8', '#E8F0C8', '#8FB6EE'];
  const HILLP = ['#22407A', '#2C5A8C', '#3E6A9A', '#1E3264', '#4A7AA0', '#2A4A6E'], GROUNDP = ['#7A8A3A', '#A89A40', '#5E7A3A', '#C8A84A', '#8E9A4A', '#4E6A3A', '#B08A3A'];
  const COL = { fur: '#C07A30', face: '#F2C890', wkshirt: '#D8452A', tiger: '#F2B82E', stripe: '#1B2A5A', gold: '#F6D04A', staff: '#C83A22', ink: '#1B2A5A', horse: '#EEF0E6', horse2: '#B8C8D8',
    mane: '#E6E8D8', hoof: '#1B2A5A', saddle: '#8A2E22', red: '#D03A28', robe: '#F0C84A', kasaya: '#D03A28', skin: '#F2CFA0', metal: '#E8C040', bjrobe: '#24305E', bjpants: '#1E2850',
    pig: '#F2B0A6', pig2: '#E08A80', wood: '#9A6A30', ssrobe: '#2E6A7A', ssrobe2: '#24525E', skin2: '#C8905E', ssh: '#C84A2A', ssbeard: '#B03E24', skull: '#F2EEDC', bundle: '#E8B03A' };
  const PEN = { color: r => COL[r], outline: '#1B2A5A', ow: 1.7, shade: 'rgba(27,42,90,0.3)' };
  // flow direction of the sky: tangent around the two swirls, a long horizontal wave elsewhere
  const skyDir = (x, y) => { let a = 0.25 * Math.sin(x / 140 + y / 60), wsum = 0.4;
    for (const [c, r, s] of [[V, 230, 1], [V2, 130, -1]]) { const dx = x - c[0], dy = y - c[1], d = Math.hypot(dx, dy), w = Math.exp(-Math.pow(d / r, 2)) * 3;
      const ta = Math.atan2(dy, dx) + s * Math.PI / 2 + 0.25 * s; a = (a * wsum + ta * w) / (wsum + w); wsum += w; }
    return a; };
  // a swirl as a rotating disc of curved strokes (radius 220), cached
  const swirl = (S, key, R0, pal) => XY.keep(`c40sw:${key}:${S.toFixed(3)}`, 2 * R0 * S, 2 * R0 * S, cv => { const g = cv.getContext('2d'), R = XY.rng(4000 + key.length); g.scale(S, S); g.translate(R0, R0); g.lineCap = 'round';
    for (let i = 0; i < R0 * 5; i++) { const q = Math.sqrt(R()), r = 8 + q * (R0 - 14), a0 = R() * TAU, l = (0.18 + 0.2 * R()) * (1.4 - q * 0.6), w = 3 + 4 * R() * (1 - q * 0.4);
      g.globalAlpha = q > 0.85 ? (1 - q) / 0.15 : 1; g.strokeStyle = pal[Math.floor(R() * pal.length)]; g.lineWidth = w; g.beginPath(); g.arc(0, 0, r, a0, a0 + l); g.stroke(); } });
  const halo = S => XY.keep(`c40halo:${S.toFixed(3)}`, 120 * S, 120 * S, cv => { const g = cv.getContext('2d'); g.scale(S, S); g.translate(60, 60); g.lineCap = 'round';
    [[12, '#FFF6C0', 7], [22, '#F2E070', 5], [33, '#E8F0B8', 4], [44, '#9CC8E8', 3.4], [54, '#5C86D8', 3]].forEach(([r, c, w], k) => { g.strokeStyle = c; g.lineWidth = w;
      for (let j = 0; j < 14; j++) { const a = j / 14 * TAU + k * 0.3; g.beginPath(); g.arc(0, 0, r, a, a + 0.32); g.stroke(); } });
    g.fillStyle = '#FFFBE0'; g.beginPath(); g.arc(0, 0, 7, 0, TAU); g.fill(); });
  const STARS = [[120, 60, 0.6], [560, 60, 0.8], [700, 330, 0.55], [1380, 420, 0.5], [500, 390, 0.5], [860, 400, 0.55], [1370, 40, 0.6], [640, 180, 0.5]];
  const ink = (g, pts, col, w, closed, fill) => { XY.path(g, XY.RIG.spline(pts, !!closed, 4), !!closed); if (fill) { g.fillStyle = fill; g.fill(); } g.strokeStyle = col; g.lineWidth = w; g.stroke(); };
  // a 天将 on a yellow cloud (local, feet at 0,0) — dark blue body, yellow brush contour
  const god = (g, x, y, s, t, k, attr) => {
    g.save(); g.translate(x, y); g.scale(s, s); g.lineCap = 'round'; g.lineJoin = 'round';
    for (let j = 0; j < 7; j++) { const a = t * 1.2 + j * 0.9 + k; g.strokeStyle = j % 2 ? '#F2D04A' : '#E8B83A'; g.lineWidth = 5; g.beginPath(); g.arc(-10 + j * 4, 8, 14 + j * 3, a, a + 1.6); g.stroke(); }
    const cape = 6 * Math.sin(t * 3 + k), poly = (pts, fill, w = 2.2) => { XY.path(g, pts, true); g.fillStyle = fill; g.fill(); g.strokeStyle = '#F6D86A'; g.lineWidth = w; g.stroke(); };
    poly([-12, -60, -30 - cape, -40, -40 - cape, -8, -24 - cape * 0.5, -14, -14, -36], '#C83A22');
    poly([-16, 0, -12, -34, 12, -34, 18, 0, 6, -4, 0, 0, -6, -4], '#1E3264');
    poly([-13, -34, -15, -60, 15, -60, 13, -34], '#2E5A8A'); g.fillStyle = '#F2C94C'; g.fillRect(-13, -40, 26, 4);
    g.strokeStyle = '#1E3264'; g.lineWidth = 7; g.beginPath(); g.moveTo(-13, -56); g.lineTo(-24, -40); g.moveTo(13, -56); g.lineTo(24, -72); g.stroke();
    g.strokeStyle = '#F6D86A'; g.lineWidth = 1.6; g.beginPath(); g.moveTo(-13, -56); g.lineTo(-24, -40); g.moveTo(13, -56); g.lineTo(24, -72); g.stroke();
    [[-15, -58], [15, -58]].forEach(([x, y]) => poly(XY.ellipse(x, y, 6, 5, 10), '#F2C94C', 1.4));
    poly(XY.ellipse(0, -70, 8, 9, 12), '#F2CFA0', 1.6); poly([-10, -72, -9, -82, 0, -88, 9, -82, 10, -72, 0, -76], '#E8B83A', 1.6);
    g.fillStyle = '#1B2A5A'; g.fillRect(2, -71, 2.4, 2.4);
    if (attr) attr(g);
    g.restore();
  };
  const hillY = x => HILL - 34 - 46 * Math.max(0, Math.sin(x / 250 + 1.2)) - 16 * XY.noise1(x / 90, 7);
  const MTN = [880, NEAR, 960, 480, 1030, 400, 1080, 448, 1180, 446, 1240, 330, 1300, 300, 1360, 330, 1416, 316, 1416, NEAR];
  const TENTS = [[470, 520, 48, 34], [536, 530, 40, 28], [600, 514, 54, 38], [690, 528, 44, 30], [760, 516, 50, 36]], CAVE = [1312, 566];
  const brushText = (g, txt, x, y, px, fill, fam = '"Weibei SC", "Kaiti SC", serif') => { g.save(); g.font = XY.font(px, fam); g.textBaseline = 'alphabetic'; g.lineJoin = 'round';
    g.strokeStyle = '#1B2A5A'; g.lineWidth = px * 0.11; g.strokeText(txt, x, y); g.fillStyle = fill; g.fillText(txt, x, y);
    const w = g.measureText(txt).width; g.globalCompositeOperation = 'source-atop'; const R = XY.rng(px); g.lineCap = 'round';
    for (let i = 0; i < w * px / 90; i++) { const sx = x + R() * w, sy = y - R() * px * 0.9; K.dab(g, sx, sy, -1.2 + R() * 0.5, 6 + R() * 6, 1.8, R() < 0.6 ? 'rgba(255,246,200,0.7)' : 'rgba(216,138,40,0.6)', 0.3); } g.restore(); };

  XY.STYLES.vangogh = {
    hits: [SUCK, FLASH],
    post(cv, g, e) { K.punch(cv, g, e, V[0] - 80, V[1] + 140, 1 + 0.1 * K.env(e.beat, SUCK + 0.2, 0.3, 1.5)); },
    bg(g, W, H) {
      g.lineCap = 'round';
      g.fillStyle = '#1E3A8A'; g.fillRect(0, 0, W, HILL + 20);
      K.field(-8, -8, W + 8, HILL + 14, 9, 4001, (x, y, R) => { const a = skyDir(x, y) + (R() - 0.5) * 0.25, dv = Math.min(Math.hypot(x - V[0], y - V[1]) / 230, Math.hypot(x - V2[0], y - V2[1]) / 130);
        const pal = dv < 1 && R() < 1.1 - dv ? SWP : SKYP, lo = y > HILL - 140 && R() < 0.35 ? ['#8FB6EE', '#CFE6F2', '#9CC8E8'] : pal;
        K.dab(g, x, y, a, 16 + R() * 14, 5 + R() * 2.6, lo[Math.floor(R() * lo.length)], 0.4); });
      // rolling hills, with strokes along their contours
      g.fillStyle = '#22407A'; g.beginPath(); g.moveTo(0, NEAR); for (let x = 0; x <= W; x += 12) g.lineTo(x, hillY(x)); g.lineTo(W, NEAR); g.fill();
      K.field(-6, HILL - 110, W + 6, NEAR + 6, 8, 4002, (x, y, R) => { if (y < hillY(x)) return; const a = Math.atan2(hillY(x + 6) - hillY(x - 6), 12) + 0.15 * Math.sin(y / 18);
        K.dab(g, x, y, a, 16 + R() * 10, 4.5 + R() * 2, HILLP[Math.floor(R() * HILLP.length)], 0.3); });
      // 金兜山: crags with strokes following the rock, the ledge the demon stands on, 金兜洞's stone gate and tablet
      XY.path(g, MTN, true); g.fillStyle = '#1E3264'; g.fill(); g.save(); XY.path(g, MTN, true); g.clip();
      K.field(870, 280, W + 6, NEAR + 6, 8, 4003, (x, y, R) => K.dab(g, x, y, -1.1 + 0.5 * Math.sin(x / 60) + (R() - 0.5) * 0.3, 14 + R() * 10, 5, ['#1E3264', '#2A4A6E', '#3E5A8A', '#24305E', '#4A6A5A', '#6A5A3A'][Math.floor(R() * 6)], 0.3)); g.restore();
      ink(g, [1040, 450, 1100, 432, 1190, 436, 1214, 452, 1150, 470, 1060, 466], '#1B2A5A', 2.6, true, '#3E5A8A');
      ink(g, [CAVE[0] - 70, NEAR, CAVE[0] - 66, 520, CAVE[0] - 40, 490, CAVE[0] + 40, 490, CAVE[0] + 66, 520, CAVE[0] + 70, NEAR], '#1B2A5A', 3, true, '#8A8A7A');
      g.fillStyle = '#2A1E10'; g.beginPath(); g.ellipse(CAVE[0], 574, 46, 62, 0, 0, TAU); g.fill(); g.strokeStyle = '#1B2A5A'; g.lineWidth = 3; g.stroke();
      ink(g, [CAVE[0] - 44, 440, CAVE[0] + 44, 440, CAVE[0] + 44, 484, CAVE[0] - 44, 484], '#1B2A5A', 2.4, true, '#C8B47A');
      g.font = XY.font(24, '"Weibei SC", "Kaiti SC", serif'); g.textBaseline = 'middle'; g.textAlign = 'center'; g.fillStyle = '#1B2A5A'; g.fillText('金兜洞', CAVE[0], 463); g.textAlign = 'left';
      // the heavenly host's camp on the hills: tents and banner poles
      TENTS.forEach(([x, y, w, h], k) => { XY.path(g, [x - 8, y + h, x + w / 2, y, x + w + 8, y + h], true); g.fillStyle = k % 2 ? '#C8B47A' : '#9AAAC0'; g.fill(); g.strokeStyle = '#1B2A5A'; g.lineWidth = 2.4; g.stroke();
        g.beginPath(); g.moveTo(x + w / 2, y + h); g.lineTo(x + w / 2, y + h * 0.4); g.stroke(); g.lineWidth = 2; g.beginPath(); g.moveTo(x + w / 2, y); g.lineTo(x + w / 2, y - 30); g.stroke(); });
      // near ground: wheat-coloured flicks, a lighter path
      g.fillStyle = '#6E7A3A'; g.fillRect(0, NEAR, W, H - NEAR);
      K.field(-6, NEAR - 6, W + 6, H + 6, 8, 4004, (x, y, R) => { const path = y > 684 && y < 726, pal = path ? ['#D8B85A', '#C8A84A', '#E8C870', '#B08A3A'] : GROUNDP;
        K.dab(g, x, y, path ? (R() - 0.5) * 0.4 : -0.9 + (R() - 0.5) * 0.9, 14 + R() * 10, 5 + R() * 2, pal[Math.floor(R() * pal.length)], 0.3); });
      // the cypress, a dark flame rising out of the ground
      const CB = 662, cy = y => 120 + 64 * Math.sin(Math.PI * Math.pow((CB - y) / (CB - 20), 0.7)) * (0.55 + 0.45 * ((y - 20) / CB));
      g.fillStyle = '#121E2E'; g.beginPath(); g.moveTo(120 - 40, CB); for (let y = CB; y >= 20; y -= 20) g.lineTo(120 - (cy(y) - 120) - 10 * XY.noise1(y / 40, 1), y); for (let y = 20; y <= CB; y += 20) g.lineTo(cy(y) + 10 * XY.noise1(y / 40, 2), y); g.fill();
      K.field(30, 20, 210, CB, 7, 4005, (x, y, R) => { if (Math.abs(x - 120) > cy(y) - 120 + 4) return; K.dab(g, x, y, -Math.PI / 2 + 0.5 * Math.sin(y / 50) + (R() - 0.5) * 0.4, 16 + R() * 12, 5, ['#1E3A2E', '#2E4A3A', '#121E2E', '#3E5A2A', '#24402E', '#1B2A5A'][Math.floor(R() * 6)], 0.5); });
      // the title in impasto, the count beneath
      brushText(g, '神兵', 232, 150, 104, '#F2C94C'); brushText(g, '第四十难', 240, 202, 34, '#F6E08A', '"Xingkai SC", "Kaiti SC", serif');
    },
    draw(g, e) {
      const { W, H, t, u, beat, S } = e, sk = K.ramp(beat, SUCK - 0.35, SUCK + 0.3), gone = K.ramp(beat, SUCK + 0.15, SUCK + 0.75), fl = K.hit(beat, FLASH, 2.2);
      g.lineCap = 'round';
      // ---- the sky turns: the big swirl over the demon is the ring's mouth; it spins up at the beat; stars breathe
      const spin = t * 0.35 + 3.2 * XY.easeIO(K.ramp(beat, SUCK - 0.4, SUCK + 1.0));
      [[V, 'big', 230, spin, 0.95], [V2, 'sm', 120, -t * 0.3, 0.85]].forEach(([c, k, r, a, al]) => { g.save(); g.translate(c[0], c[1]); g.rotate(a); g.globalAlpha = al; g.drawImage(swirl(S, k, r, SWP), -r, -r, 2 * r, 2 * r); g.restore(); });
      const hs = halo(S); STARS.forEach(([x, y, s], k) => { const p = s * (1 + 0.14 * Math.sin(t * 2.2 + k * 1.7)); g.save(); g.translate(x, y); g.rotate(t * 0.2 + k); g.drawImage(hs, -60 * p, -60 * p, 120 * p, 120 * p); g.restore(); });
      // ---- 独角兕大王 on his ledge above the cave, holding 金刚琢 up into the eye of the swirl
      const cheer = K.ramp(beat, FLASH, FLASH + 0.3) * (1 - K.ramp(beat, 7.2, 7.8)), bob = 4 * cheer * Math.abs(Math.sin(t * 7));
      { g.save(); g.translate(DEMON[0], DEMON[1] - bob); g.lineJoin = 'round';
        ink(g, [-22, -168, 30, -168, 52, -90, 60, -20, 20, -40, -6, -110], '#1B2A5A', 2.6, true, '#5A3A8A');
        g.strokeStyle = '#1B2A5A'; g.lineWidth = 6; g.beginPath(); g.moveTo(-50, -250); g.lineTo(-40, 6); g.stroke(); g.strokeStyle = '#F2C94C'; g.lineWidth = 2; g.stroke();
        ink(g, [-54, -264, -46, -242, -54, -246, -62, -242], '#1B2A5A', 1.6, true, '#F6D86A');
        ink(g, [-18, -84, -22, -2, -6, -2, -2, -84], '#1B2A5A', 2.2, true, '#24305E'); ink(g, [6, -84, 8, -2, 24, -2, 20, -84], '#1B2A5A', 2.2, true, '#24305E');
        ink(g, [-36, -82, -40, -130, -26, -160, 16, -164, 34, -134, 32, -82], '#1B2A5A', 2.6, true, '#C83A22'); ink(g, [-44, -86, 42, -86, 50, -42, -50, -42], '#1B2A5A', 2.6, true, '#D8452A');
        g.fillStyle = '#F2C94C'; g.fillRect(-46, -100, 88, 8); for (let k = 0; k < 6; k++) g.fillRect(-44 + k * 16, -66, 8, 8);
        const hand = [V[0] - DEMON[0] + 2, V[1] - DEMON[1] + 36 + bob]; XY.path(g, XY.RIG.capsule([16, -150], hand, 10, 8), true); g.fillStyle = '#2E5A6A'; g.fill(); g.strokeStyle = '#1B2A5A'; g.lineWidth = 2.4; g.stroke();
        XY.path(g, XY.RIG.capsule([-28, -146], [-46, -100], 10, 8), true); g.fill(); g.stroke();
        ink(g, [-4, -158, -34, -160, -64, -166, -76, -182, -50, -196, -16, -200, 4, -184], '#1B2A5A', 2.6, true, '#2E5A6A');
        ink(g, [-62, -170, -80, -174, -82, -190, -66, -192], '#1B2A5A', 2, true, '#8FB6EE');
        ink(g, [-44, -196, -58, -226, -74, -262, -60, -232, -32, -200], '#1B2A5A', 2.2, true, '#F2EEDC');
        g.fillStyle = '#E8452A'; g.beginPath(); g.arc(-40, -182, 4.4, 0, TAU); g.fill(); g.strokeStyle = '#F2C94C'; g.lineWidth = 3; g.beginPath(); g.arc(-80, -176, 6, 0, TAU); g.stroke();
        g.restore(); }
      // 金刚琢 in the eye of the swirl, flaring when it swallows
      const RR = 32 + 10 * fl + 6 * sk * (1 - gone);
      for (let j = 0; j < 16; j++) { const a = j / 16 * TAU + t * 1.4 + spin; g.strokeStyle = j % 2 ? '#FFF2B0' : '#F2C94C'; g.lineWidth = 8 + 3 * fl; g.beginPath(); g.arc(V[0], V[1], RR, a, a + 0.36); g.stroke(); }
      g.strokeStyle = '#1B2A5A'; g.lineWidth = 2.4; g.beginPath(); g.arc(V[0], V[1], RR + 6, 0, TAU); g.stroke(); g.beginPath(); g.arc(V[0], V[1], RR - 6, 0, TAU); g.stroke();
      if (fl > 0.02) for (let j = 0; j < 44; j++) { const a = j / 44 * TAU, r = 50 + 260 * (1 - fl); g.globalAlpha = fl; K.dab(g, V[0] + Math.cos(a) * r, V[1] + Math.sin(a) * r, a + Math.PI / 2, 26, 7, j % 2 ? '#F2C94C' : '#FFF2B0', 0.3); }
      g.globalAlpha = 1;
      // the drain: everything the gods threw spirals into the eye
      { const dr = sk * (1 - gone); if (dr > 0.02) for (let k = 0; k < 100; k++) { const q = (XY.hash(k, 31) + t * 0.9) % 1, r = 380 * (1 - q) + 30, a = XY.hash(k, 32) * TAU + q * 5;
        const x = V[0] + Math.cos(a) * r, y = V[1] + Math.sin(a) * r * 0.8, an = a + Math.PI / 2 + 0.35, l = 32 * (1 - q * 0.6); g.globalAlpha = Math.min(1, 1.6 * dr * Math.sin(Math.PI * q));
        K.dab(g, x, y, an, l + 4, 10, '#1B2A5A', 0.4); K.dab(g, x, y, an, l, 6.5, ['#F2632A', '#FFE07A', '#CFE6F2', '#F2C94C', '#FFFFFF', '#E8452A'][k % 6], 0.4); } }
      g.globalAlpha = 1;
      // ---- the heavenly host presses down from the left and attacks one by one; at the beat it all bends into the swirl
      const down = 70 * (1 - XY.easeOut(K.ramp(beat, -2.4, 1.4))) - 70 * K.ramp(beat, FLASH, 8), tgt = [DEMON[0] - 20, DEMON[1] - 140];
      const stream = (src, b0, cols, w, n, seed) => { const live = K.ramp(beat, b0, b0 + 0.3) * (1 - gone); if (live <= 0) return; const a0 = Math.atan2(src[1] - V[1], src[0] - V[0]), r0 = Math.hypot(src[0] - V[0], src[1] - V[1]);
        for (let k = 0; k < n; k++) { const q = (k / n + t * 1.3 + seed) % 1; if (XY.hash(k, seed * 9) > live || q > K.ramp(beat, b0, b0 + 0.5)) continue;
          const st = [XY.lerp(src[0], tgt[0], q) + 8 * Math.sin(q * 12 + t * 6), XY.lerp(src[1], tgt[1], q) - 60 * Math.sin(Math.PI * q) + 6 * Math.cos(q * 10 + t * 5)], r = r0 * (1 - q), a = a0 + q * 3.2;
          const sp = [V[0] + Math.cos(a) * r, V[1] + Math.sin(a) * r], x = XY.lerp(st[0], sp[0], sk), y = XY.lerp(st[1], sp[1], sk);
          const an = Math.atan2(tgt[1] - src[1], tgt[0] - src[0]) * (1 - sk) + (a + Math.PI / 2) * sk, l = 20 * (1 - 0.5 * q * sk); g.globalAlpha = Math.sin(Math.PI * q) * (0.6 + 0.4 * live); K.dab(g, x, y, an, l + 4, w + 3.5, '#1B2A5A', 0.4); K.dab(g, x, y, an, l, w, cols[k % cols.length], 0.4); }
        g.globalAlpha = 1; };
      const gods = [[440, 270, 1.15, 'li'], [580, 150, 1, 'nz'], [700, 270, 1.05, 'fire'], [810, 150, 1, 'water'], [930, 70, 0.95, 'thunder']];
      gods.forEach(([x, y, s, k], i) => { const yy = y - down + 4 * Math.sin(t * 1.5 + i), empty = gone > 0.5;
        if (k === 'fire') stream([x + 16, yy - 50], FIRE, ['#F2632A', '#F2A23A', '#FFE07A', '#D8452A'], 8, 34, 0.13);
        if (k === 'water') stream([x + 16, yy - 46], WATER, ['#CFE6F2', '#8FB6EE', '#FFFFFF', '#5C86D8'], 7, 34, 0.47);
        if (k === 'thunder' && gone < 1 && beat > THUNDER) { const reach = K.ramp(beat, THUNDER, THUNDER + 0.25); g.save(); g.lineJoin = 'miter'; g.strokeStyle = '#1B2A5A'; g.lineWidth = 8;
          const pts = []; for (let j = 0; j <= 8; j++) { const q = j / 8 * reach, sx = XY.lerp(x + 20, tgt[0], q) + (j % 2 ? 26 : -26) * (1 - q * 0.5), sy = XY.lerp(yy - 30, tgt[1], q), a = Math.atan2(yy - 30 - V[1], x + 20 - V[0]) + q * 2.8, r = Math.hypot(x + 20 - V[0], yy - 30 - V[1]) * (1 - q);
            pts.push(XY.lerp(sx, V[0] + Math.cos(a) * r, sk), XY.lerp(sy, V[1] + Math.sin(a) * r, sk)); }
          if (K.step(t, 10) % 3 !== 0 || sk > 0) { g.globalAlpha = 1 - gone; XY.path(g, pts, false); g.stroke(); g.strokeStyle = '#FFF2B0'; g.lineWidth = 4; g.stroke(); } g.restore(); }
        god(g, x, yy, s, t, i, q => {
          if (k === 'li') { ink(q, [12, -56, 30, -56, 26, -96, 16, -96], '#F6D86A', 2, true, '#E8B83A'); for (let j = 0; j < 3; j++) ink(q, [8, -64 - j * 12, 21, -74 - j * 12, 34, -64 - j * 12], '#1B2A5A', 1.6, false); }
          if (k === 'thunder') { q.strokeStyle = '#F2C94C'; q.lineWidth = 4; q.beginPath(); q.arc(0, -40, 34, 0, TAU); q.stroke(); for (let j = 0; j < 6; j++) { const a = j / 6 * TAU + t; q.fillStyle = '#E8452A'; q.beginPath(); q.arc(Math.cos(a) * 34, -40 + Math.sin(a) * 34, 5, 0, TAU); q.fill(); } }
          if ((k === 'fire' || k === 'water') && empty) { q.strokeStyle = '#F6D86A'; q.lineWidth = 2.6; q.beginPath(); q.moveTo(14, -36); q.lineTo(24, -48); q.moveTo(-14, -36); q.lineTo(-24, -48); q.stroke(); } });
        if (k === 'nz') { for (let j = 0; j < 6; j++) { const th = XY.clamp((beat - NEZHA - j * 0.06) / 0.5), p = XY.clamp((beat - (SUCK - 0.2) - j * 0.07) / 0.8); if (p >= 1) continue;
          const a = j / 6 * TAU + t * 0.8, c0 = [x + Math.cos(a) * 30 * s, yy - 40 * s + Math.sin(a) * 30 * s], cx = XY.lerp(c0[0], tgt[0] - 40 + j * 16, XY.smooth(th) * 0.7), cy = XY.lerp(c0[1], tgt[1] - 20 + j * 8, XY.smooth(th) * 0.7);
          const r = Math.hypot(cx - V[0], cy - V[1]) * (1 - p), b = Math.atan2(cy - V[1], cx - V[0]) + p * 3, px = XY.lerp(cx, V[0] + Math.cos(b) * r, XY.smooth(p * 1.4)), py = XY.lerp(cy, V[1] + Math.sin(b) * r, XY.smooth(p * 1.4));
          K.dab(g, px, py, a + p * 9 + th * 3, 34 * (1 - 0.7 * p), 6, '#1B2A5A', 0); K.dab(g, px, py, a + p * 9 + th * 3, 32 * (1 - 0.7 * p), 3.4, ['#F2C94C', '#E8452A', '#CFE6F2'][j % 3], 0); } } });
      // ---- banners over the camp flutter; the cave glows; two little demons wave flags at the cave, jumping when the ring wins
      TENTS.forEach(([x, y, w], k) => { const fx = x + w / 2, fy = y - 30; XY.path(g, [fx, fy, fx + 22 + 3 * Math.sin(t * 5 + k), fy + 5 + 2 * Math.sin(t * 6 + k), fx, fy + 12], true); g.fillStyle = k % 2 ? '#D03A28' : '#F2C94C'; g.fill(); g.strokeStyle = '#1B2A5A'; g.lineWidth = 1.6; g.stroke(); });
      { const a = 0.55 + 0.25 * XY.noise1(t * 4, 9), rg = g.createRadialGradient(CAVE[0], 578, 6, CAVE[0], 578, 70); rg.addColorStop(0, `rgba(255,170,60,${a})`); rg.addColorStop(1, 'rgba(255,120,40,0)'); g.fillStyle = rg; g.fillRect(CAVE[0] - 70, 508, 140, 140); }
      [[CAVE[0] - 52, 0], [CAVE[0] + 54, 1]].forEach(([x, k]) => { const y = 640 - cheer * 10 * Math.abs(Math.sin(t * 8 + k)), wv = Math.sin(t * 6 + k * 2);
        ink(g, [x - 9, y, x - 8, y - 30, x, y - 36, x + 8, y - 30, x + 9, y], '#1B2A5A', 2, true, k ? '#3E6A4A' : '#4A5A2E'); ink(g, XY.ellipse(x, y - 44, 9, 9, 10), '#1B2A5A', 2, true, '#6A8A4A');
        g.strokeStyle = '#1B2A5A'; g.lineWidth = 2; g.beginPath(); g.moveTo(x - 6, y - 50); g.lineTo(x - 10, y - 60); g.moveTo(x + 6, y - 50); g.lineTo(x + 10, y - 60); g.stroke();
        g.lineWidth = 3; g.beginPath(); g.moveTo(x + 10, y - 26); g.lineTo(x + 16 + 4 * wv, y - 84); g.stroke(); XY.path(g, [x + 16 + 4 * wv, y - 84, x + 44 + 6 * wv, y - 78 + 3 * wv, x + 15 + 4 * wv, y - 66], true); g.fillStyle = '#E8452A'; g.fill(); g.lineWidth = 1.6; g.stroke(); });
      // ---- the cypress licks upward like a flame
      for (let k = 0; k < 44; k++) { const x0 = 70 + 100 * XY.hash(k, 21), y0 = 640 - 560 * XY.hash(k, 22), L = 60 + 70 * XY.hash(k, 23), sway = (1 - y0 / 662) * 16 + 4;
        g.strokeStyle = ['#2E4A3A', '#1E3A2E', '#3E5A2A', '#24402E', '#4A6A3A', '#1B2A5A'][k % 6]; g.lineWidth = 5 + 3 * XY.hash(k, 24); g.beginPath(); g.moveTo(x0, y0);
        for (let j = 1; j <= 4; j++) { const q = j / 4; g.lineTo(x0 + Math.sin(t * 1.9 + k + q * 2) * sway * q + (x0 - 120) * -0.2 * q, y0 - L * q); } g.stroke(); }
      // ---- the procession: deep-blue contour, short strokes over every part; 悟空 has no staff here (the engine's cast drops it)
      const acts = { wukong: { shade: K.ramp(beat, 0.4, 0.9) * (1 - K.ramp(beat, 2.2, 2.7)), raise: K.ramp(beat, FLASH + 0.2, FLASH + 0.6) * (1 - K.ramp(beat, 7.3, 7.8)) },
        monk: { palm: K.ramp(beat, SUCK - 0.2, SUCK + 0.2) * (1 - K.ramp(beat, 7, 7.6)) }, bajie: { scratch: K.ramp(beat, 2.0, 2.4) * (1 - K.ramp(beat, 3.2, 3.6)) }, shaseng: { lift: K.ramp(beat, 6.2, 6.6) * (1 - K.ramp(beat, 7.4, 7.9)) } };
      const L = K.procLayer('c40', e, 330, 40); K.drawProc(L.g, e, PEN, acts);
      K.pat(L, K.strokeTile('c40st', S, 96, 300, ['rgba(255,240,170,0.42)', 'rgba(27,42,90,0.36)', 'rgba(140,190,255,0.32)', 'rgba(255,160,80,0.28)'], { len: 8, w: 2.6, seed: 40, ang: (x, y, R) => -1.25 + (R() - 0.5) * 0.8 }), 'source-atop');
      K.put(g, L);
    },
  };
})();
