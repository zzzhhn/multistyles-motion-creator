// 60 波普 · 多目遭伤 — one blown-up Lichtenstein panel: Ben-Day dots, 6 px black outlines, red / yellow / blue.
// 黄花观: the 百眼魔君 has thrown off his robe and the eyes along his ribs blaze gold, caging 悟空 in light while the other
// three reel from the poisoned-date tea. v10: cage on 2.2, 悟空 rams it from inside; beat 4.5 毗蓝婆's needle streaks in — 破! — every eye squeezes shut
// at once and squeezes out one big comic-book tear; the golden cage shatters.
(() => {
  'use strict';
  const XY = window.XY, K = XY.KIT_G, TAU = XY.TAU;
  const BK = '#141414', WH = '#FBF8EE', RD = '#D8232A', YL = '#F7D52C', BL = '#2F5CC8', SK = '#FAE0CC';
  const NEEDLE = 3.9, HIT = 4.5, CAGE = 2.2, CX = 900, CY = 392;   // v10: 8 beats; cage drops on 2.2, the needle bursts it on 4.5
  const EYES = []; for (let r = 0; r < 4; r++) for (let c = 0; c < 5; c++) EYES.push([724 + c * 98 + (r % 2) * 49, 214 + r * 124, r * 5 + c]);
  const TORSO = [660, 702, 650, 520, 672, 330, 720, 190, 800, 120, 920, 96, 1060, 100, 1180, 120, 1180, 702];

  const inkPath = (g, pts, fill, lw = 6, closed = true) => { XY.path(g, pts, closed); if (fill) { g.fillStyle = fill; g.fill(); } g.strokeStyle = BK; g.lineWidth = lw; g.lineJoin = 'round'; g.stroke(); };
  const eye = (g, x, y, open, glow, k, t) => {
    g.save(); g.translate(x, y); g.lineCap = 'round'; g.lineJoin = 'round';
    if (open > 0.15) {
      const h = 22 * open, alm = [-38, 0, -18, -h, 18, -h, 38, 0, 18, h * 0.8, -18, h * 0.8];
      XY.path(g, XY.RIG.spline(alm, true, 4), true); g.fillStyle = WH; g.fill();
      g.save(); g.clip(); g.fillStyle = glow > 0.5 ? YL : BL; g.beginPath(); g.arc(4, 0, 15, 0, TAU); g.fill(); g.fillStyle = BK; g.beginPath(); g.arc(4, 0, 7, 0, TAU); g.fill();
      g.fillStyle = WH; g.beginPath(); g.arc(-1, -5, 4, 0, TAU); g.fill(); g.restore();
      g.strokeStyle = BK; g.lineWidth = 5; XY.path(g, XY.RIG.spline(alm, true, 4), true); g.stroke();
      g.lineWidth = 4; for (let j = 0; j < 4; j++) { const a = -30 + j * 18; g.beginPath(); g.moveTo(a, -h * 0.9 - 2); g.lineTo(a - 6 - j, -h - 16); g.stroke(); }
      g.lineWidth = 3; g.beginPath(); g.moveTo(-30, -h - 8); g.quadraticCurveTo(0, -h - 20, 32, -h - 6); g.stroke();
    } else {   // squeezed shut: a hard down-curve with crow's-feet
      g.strokeStyle = BK; g.lineWidth = 6; g.beginPath(); g.moveTo(-38, -2); g.quadraticCurveTo(0, 16, 38, -2); g.stroke();
      g.lineWidth = 3.5; [[-40, -4, -54, -14], [-40, 0, -56, 2], [40, -4, 54, -14], [40, 0, 56, 2]].forEach(([a, b, c, d]) => { g.beginPath(); g.moveTo(a, b); g.lineTo(c, d); g.stroke(); });
      g.lineWidth = 4; for (let j = 0; j < 4; j++) { const a = -24 + j * 16; g.beginPath(); g.moveTo(a, 8); g.lineTo(a - 3, 18); g.stroke(); }
    }
    g.restore();
  };
  const tear = (g, x, y, s) => { g.save(); g.translate(x, y); g.scale(s, s); const d = [0, -16, 9, 0, 10, 10, 0, 18, -10, 10, -9, 0];
    inkPath(g, XY.RIG.spline(d, true, 4), '#BFE3F5', 3.5); g.fillStyle = WH; g.beginPath(); g.ellipse(-3, 4, 2.5, 5, 0.3, 0, TAU); g.fill(); g.restore(); };
  const spiral = (g, x, y, t, k) => { g.save(); g.translate(x, y); g.rotate(t * 5 + k); g.strokeStyle = BK; g.lineWidth = 3; g.beginPath();
    for (let j = 0; j <= 30; j++) { const a = j / 30 * TAU * 2, r = 3 + j * 0.55; j ? g.lineTo(Math.cos(a) * r * 1.4, Math.sin(a) * r * 0.6) : g.moveTo(r, 0); } g.stroke(); g.restore();
    for (let j = 0; j < 3; j++) { const a = t * 4 + j * TAU / 3 + k, sx = x + Math.cos(a) * 30, sy = y + Math.sin(a) * 10; inkPath(g, K.burst(sx, sy, 3, 8, 5, j, a, 0), YL, 2); } };

  // ------------------------------------------------------------ static layers
  const wall = (g, W, H, S) => {
    g.fillStyle = K.dots(S, '#7FA6E3', WH, 15, 3.6, 45); g.fillRect(0, 0, W, H);
    g.save(); g.translate(CX, CY); g.fillStyle = 'rgba(247,213,44,0.55)'; for (let k = 0; k < 22; k++) { const a = k / 22 * TAU; g.beginPath(); g.moveTo(0, 0); g.lineTo(Math.cos(a - 0.06) * 1400, Math.sin(a - 0.06) * 1400); g.lineTo(Math.cos(a + 0.06) * 1400, Math.sin(a + 0.06) * 1400); g.fill(); } g.restore();
    // the demon's side: robe thrown open, skin in red dots, ribs
    inkPath(g, [640, 702, 610, 480, 650, 300, 712, 150, 780, 70, 900, 40, 860, 140, 760, 260, 700, 460, 700, 702], YL, 6);
    g.fillStyle = '#E2B21E'; XY.path(g, [700, 702, 700, 460, 760, 260, 780, 240, 726, 470, 724, 702], true); g.fill();
    XY.path(g, XY.RIG.spline(TORSO, false, 5), false); g.closePath(); g.fillStyle = K.dots(S, '#E2483C', SK, 12, 3, 15); g.fill(); g.strokeStyle = BK; g.lineWidth = 6; g.stroke();
    g.strokeStyle = BK; g.lineWidth = 4; for (let r = 0; r < 4; r++) { g.beginPath(); const y = 272 + r * 124; g.moveTo(690 + r * 6, y + 20); g.quadraticCurveTo(920, y - 30, 1180, y + 6); g.stroke(); }
    // the poisoned tea: three cups and a plate of red dates on a little table
    g.save(); g.translate(150, 672); g.scale(0.78, 0.78); g.translate(-150, -702);   // set back behind the walking line
    inkPath(g, [60, 640, 260, 640, 250, 656, 70, 656], '#8B4A2B', 5); g.fillStyle = BK; g.fillRect(84, 656, 10, 46); g.fillRect(228, 656, 10, 46);
    [[96, 618], [140, 614], [184, 618]].forEach(([x, y]) => { inkPath(g, [x - 16, y - 12, x + 16, y - 12, x + 11, y + 20, x - 11, y + 20], WH, 4); g.fillStyle = BL; g.fillRect(x - 13, y - 4, 26, 6); inkPath(g, XY.ellipse(x + 2, y - 9, 6, 4, 10), RD, 2.5); });
    inkPath(g, XY.ellipse(232, 632, 26, 8, 16), WH, 4); [[222, 622], [236, 620], [246, 626], [229, 628]].forEach(([x, y]) => { inkPath(g, XY.ellipse(x, y, 8, 6, 12), RD, 3); g.fillStyle = WH; g.fillRect(x - 3, y - 3, 3, 2); });
    g.restore();
    // panel border
    g.strokeStyle = BK; g.lineWidth = 8; g.strokeRect(10, 10, W - 20, H - 20);
    // narration box and the title lettering
    inkPath(g, [24, 24, 470, 24, 470, 76, 24, 76], YL, 4);
    K.text(g, '第 60 难 · 黄花观中……', 40, 62, XY.font(30, '"HanziPen SC", "Wawati SC", sans-serif', 'bold'), BK);
    g.save(); g.translate(48, 246); g.transform(1, 0, -0.16, 1, 0, 0);
    K.text(g, '多目', 0, 0, XY.font(158, '"PingFang SC", "Heiti SC", sans-serif', '600'), RD, { stroke: BK, lw: 9, shadow: YL, slw: 9, sx: 10, sy: 10 }); g.restore();
  };
  const penFor = S => { const skin = K.dots(S, '#E2483C', SK, 7, 1.7, 15);
    const M = { fur: '#B8642A', face: skin, skin, skin2: K.dots(S, '#B4432F', '#E9B98F', 7, 1.8, 15), pig: K.dots(S, '#E2483C', '#F7C4B8', 7, 1.9, 15), pig2: '#E58C80', wkshirt: RD, kasaya: RD, staff: RD, red: RD,
      tiger: YL, gold: YL, metal: YL, robe: YL, bundle: YL, stripe: BK, ink: BK, hoof: BK, bjrobe: '#1E1E1E', bjpants: BK, ssrobe: BL, ssrobe2: '#244A9E', horse: WH, horse2: '#DADDE6', mane: WH,
      saddle: '#8B4A2B', wood: '#8B4A2B', ssh: RD, ssbeard: RD, skull: WH };
    return { color: r => M[r] || WH, outline: BK, ow: 2.4, shade: K.dots(S, BL, null, 6, 1.5, 45) }; };
  const actsAt = b => { const ram = b > 2.7 && b < HIT ? Math.max(0, Math.sin((b - 2.7) * Math.PI * 1.6)) : 0;   // 悟空 rams the cage wall from inside, again and again
    return { wukong: { shade: K.win(b, 1.3, 2.4, 0.2), strike: ram }, bajie: { scratch: K.win(b, -9, 5, 0.3) }, monk: { palm: K.win(b, 5.4, 8, 0.3) }, shaseng: { lift: K.win(b, HIT, HIT + 1.2, 0.2) } }; };
  const HALO = { color: () => WH, outline: WH, ow: 9, shade: false, fine: false };
  const domeAt = (e, acts) => { const h = e.at('wukong.head', acts); return [h[0] - 6, e.groundY]; };

  XY.STYLES.pop = {
    hits: [CAGE, HIT],
    bg(g, W, H, c, scale) { wall(g, W, H, scale); },
    draw(g, e) {
      const { W, H, t, u, S } = e, b = e.beat, acts = actsAt(b), f12 = K.step(t, 12), hit = b >= HIT;
      const glow = XY.smooth(K.ramp(b, 1.3, 0.6)) * (hit ? 0 : 1), D = domeAt(e, acts), dr = 140 * XY.easeOut(K.ramp(b, CAGE, 0.3));
      // golden rays from the eyes to the top of the cage
      if (glow > 0 && dr > 0) { g.save(); g.globalAlpha = 0.85; g.lineJoin = 'round';
        EYES.forEach(([x, y, k]) => { const w = (8 + 5 * Math.sin(t * 12 + k)) * glow, ax = D[0], ay = D[1] - dr * 0.95, a = Math.atan2(ay - y, ax - x) + Math.PI / 2;
          XY.path(g, [x + Math.cos(a) * w, y + Math.sin(a) * w, ax, ay, x - Math.cos(a) * w, y - Math.sin(a) * w], true); g.fillStyle = YL; g.fill(); g.strokeStyle = BK; g.lineWidth = 2; g.stroke(); });
        g.restore(); }
      // the eyes: random blinks, gold irises while the light burns, squeezed shut after the needle
      EYES.forEach(([x, y, k]) => { const bl = ((t * 0.45 + XY.hash(k, 600)) % 1) < 0.05 ? 0.3 : 1; eye(g, x, y, hit ? 0 : bl, glow, k, t); });
      // steam off the poisoned tea
      if (!hit) { g.strokeStyle = BK; g.lineWidth = 3; [[96, 604], [140, 600], [184, 604]].map(([x, y]) => [150 + (x - 150) * 0.78, 672 + (y - 702) * 0.78]).forEach(([x, y], k) => { g.beginPath(); for (let j = 0; j <= 8; j++) { const yy = y - j * 7, xx = x + 6 * Math.sin(j * 0.9 - t * 6 + k); j ? g.lineTo(xx, yy) : g.moveTo(xx, yy); } g.stroke(); }); }
      // the golden cage over 悟空 (第七十三回: the light 罩住行者): the dotted fill goes under him, the rim over him, so he stays visible inside
      const dome = []; if (dr > 0 && !hit) { const bulge = 1 + 0.06 * acts.wukong.strike; for (let k = 0; k <= 24; k++) { const a = Math.PI + k / 24 * Math.PI, w = 1 + (Math.cos(a) > 0 ? 0.08 * acts.wukong.strike : 0); dome.push(D[0] + Math.cos(a) * dr * w, D[1] + Math.sin(a) * dr * 1.15 * bulge); }
        g.save(); XY.path(g, dome, true); g.fillStyle = 'rgba(247,213,44,0.5)'; g.fill(); g.clip(); g.fillStyle = K.dots(S, YL, null, 10, 2.8, 15); g.fillRect(D[0] - dr * 1.2, D[1] - dr * 1.3, dr * 2.4, dr * 1.3); g.restore(); }
      if (K.visible(e)) { XY.drawProcession(g, e.phase, e.procX, e.groundY, HALO, acts); XY.drawProcession(g, e.phase, e.procX, e.groundY, penFor(S), acts); }
      if (dome.length) { g.strokeStyle = BK; g.lineWidth = 6; XY.path(g, dome, true); g.stroke(); g.strokeStyle = WH; g.lineWidth = 6; g.lineCap = 'round'; g.beginPath(); g.arc(D[0], D[1], dr * 0.8, 3.6, 4.3); g.stroke();
        if (acts.wukong.strike > 0.7) { const se = e.at('wukong.staffEnd', acts); inkPath(g, K.burst(D[0] + dr * 0.95, se[1], 14, 34, 8, f12, 0, 0.4), YL, 3); } }
      if (hit && b < HIT + 1.5) { const q = (b - HIT) * XY.BEAT;
        for (let k = 0; k < 8; k++) { const a0 = Math.PI + k / 8 * Math.PI, a1 = a0 + Math.PI / 8, am = (a0 + a1) / 2, vx = Math.cos(am) * 500, vy = Math.sin(am) * 520 - 200, x = D[0] + vx * q, y = D[1] - 60 + vy * q + 1600 * q * q;
          const sh = [x, y]; for (let j = 0; j <= 3; j++) { const a = a0 + j / 3 * (a1 - a0); sh.push(x + Math.cos(a) * 60 - Math.cos(am) * 30, y + Math.sin(a) * 60 - Math.sin(am) * 30); }
          g.save(); g.translate(x, y); g.rotate(q * (k % 2 ? 6 : -6)); g.translate(-x, -y); inkPath(g, sh, YL, 4); g.restore(); } }
      // the poisoned three reel: spirals and stars over their heads until the cure
      if (b < HIT + 0.6) ['monk.head', 'bajie.head', 'shaseng.head'].forEach((key, k) => { const p = e.at(key, acts); spiral(g, p[0], p[1] - 40, t, k); });
      // 毗蓝婆's needle, red thread trailing, speed lines; it stays stuck in the eyes
      if (b >= NEEDLE) { const q = hit ? 1 : XY.easeIn((b - NEEDLE) / (HIT - NEEDLE)), P = [-140, 330], T = [CX - 30, CY - 26], x = XY.lerp(P[0], T[0], q), y = XY.lerp(P[1], T[1], q), a = Math.atan2(T[1] - P[1], T[0] - P[0]);
        g.strokeStyle = RD; g.lineWidth = 3; g.beginPath(); for (let j = 0; j <= 20; j++) { const f = j / 20, tx = x - Math.cos(a) * (180 + f * 600), ty = y - Math.sin(a) * (180 + f * 600) + 18 * Math.sin(f * 9 + t * 4) * f; j ? g.lineTo(tx, ty) : g.moveTo(tx, ty); } g.stroke();
        if (!hit) { g.strokeStyle = BK; g.lineWidth = 3; for (let j = -1; j <= 1; j++) { g.beginPath(); g.moveTo(x - Math.cos(a) * 200 - Math.sin(a) * j * 16, y - Math.sin(a) * 200 + Math.cos(a) * j * 16); g.lineTo(x - Math.cos(a) * 420 - Math.sin(a) * j * 16, y - Math.sin(a) * 420 + Math.cos(a) * j * 16); g.stroke(); } }
        g.save(); g.translate(x, y); g.rotate(a); inkPath(g, [10, 0, -60, -5, -190, -4, -196, 0, -190, 4, -60, 5], '#E6E8EE', 3.5); g.fillStyle = BK; g.beginPath(); g.ellipse(-180, 0, 7, 2, 0, 0, TAU); g.fill();
        g.strokeStyle = WH; g.lineWidth = 2; g.beginPath(); g.moveTo(-40, -2); g.lineTo(-150, -2); g.stroke(); g.restore(); }
      // 破!
      if (hit && b < HIT + 2) { const q = (b - HIT) / 2, s = q < 0.12 ? XY.lerp(0.4, 1.15, q / 0.12) : q < 0.22 ? XY.lerp(1.15, 1, (q - 0.12) / 0.1) : 1, jx = (XY.hash(f12, 1) - 0.5) * 6, jy = (XY.hash(f12, 2) - 0.5) * 6;
        g.save(); g.translate(CX - 120 + jx, CY - 140 + jy); g.scale(s, s); g.rotate(-0.12);
        inkPath(g, K.burst(0, 0, 96, 170, 15, 602, 0, 0.35), YL, 7); inkPath(g, K.burst(0, 0, 70, 118, 12, 603, 0.2, 0.3), RD, 0);
        K.text(g, '破!', 0, 40, XY.font(118, '"PingFang SC", "Heiti SC", sans-serif', '600'), WH, { align: 'center', stroke: BK, lw: 10, shadow: BK, slw: 10, sx: 6, sy: 7 }); g.restore(); }
      // and the tears
      if (hit) EYES.forEach(([x, y, k]) => { const f = ((b - HIT) * 0.55 + XY.hash(k, 601) * 0.25) % 1; tear(g, x + 30, y + 14 + f * 110, 1.15 - 0.3 * f); });
    },
  };
})();
