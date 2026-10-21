// 44 野兽派 · 1905 年 · 琵琶洞受苦 — 第五十五回：毒敌山琵琶洞的蝎子精摄了唐僧去要成亲；悟空来救，被她的倒马毒桩在头上扎了一下，
// 疼得抱头；八戒的嘴也被扎肿；悟空请来昴日星官，一声鸡鸣，蝎子精现了原形死在洞口。画成马蒂斯、德兰那样的纯色：朱橙天、
// 翠绿紫山、钴蓝海湾，笔缝里露白画布；轮廓用补色线（暖色描蓝、冷色描红），脸上一道绿影。琵琶形的洞口里伸出一条纯色大蝎尾。
(() => {
  'use strict';
  const XY = window.XY, K = XY.KIT_E, TAU = XY.TAU;
  const CAVE = [846, 486], OUT = 1.5, ST1 = 3.0, ST2 = 4.4, CROW = 5.6, HZ = 470, GRD = 640;
  const COL = { fur: '#E8641E', face: '#F6B48A', wkshirt: '#E8321E', tiger: '#FFD21E', stripe: '#1D3FB5', gold: '#FFD21E', staff: '#E8321E', ink: '#1D3FB5', horse: '#F6F2E6', horse2: '#9AD0E6',
    mane: '#FFF2B0', hoof: '#6A2A8A', saddle: '#C81E6A', red: '#E8321E', robe: '#FFC21E', kasaya: '#E8321E', skin: '#F6B48A', metal: '#FFD21E', bjrobe: '#1D3FB5', bjpants: '#2A1E8A',
    pig: '#FF9AB0', pig2: '#E8507A', wood: '#C8641E', ssrobe: '#12A07A', ssrobe2: '#0E7A6A', skin2: '#E8904A', ssh: '#E8321E', ssbeard: '#C81E1E', skull: '#FFFFFF', bundle: '#FFD21E' };
  const WARM = new Set(['fur', 'face', 'wkshirt', 'tiger', 'gold', 'staff', 'red', 'robe', 'kasaya', 'skin', 'metal', 'pig', 'pig2', 'wood', 'skin2', 'ssh', 'ssbeard', 'bundle', 'saddle']);
  // complementary contour: blue around warm parts, red around cool parts
  const PEN = { color: r => COL[r], shade: 'rgba(20,150,90,0.38)',
    part(ctx, p, c) { if (p.k !== 'poly') return false; XY.path(ctx, p.pts, true); ctx.fillStyle = c; ctx.fill(); ctx.strokeStyle = WARM.has(p.role) ? '#1D3FB5' : '#E8321E'; ctx.lineWidth = 2.2; ctx.stroke(); return true; } };
  const blk = (g, pts, col, R, pal, ang, dens = 1) => { XY.path(g, XY.RIG.spline(pts, true, 4), true); g.fillStyle = col; g.fill(); g.save(); g.clip();
    let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9; for (let k = 0; k < pts.length; k += 2) { x0 = Math.min(x0, pts[k]); x1 = Math.max(x1, pts[k]); y0 = Math.min(y0, pts[k + 1]); y1 = Math.max(y1, pts[k + 1]); }
    g.lineCap = 'round'; for (let i = 0; i < dens * (x1 - x0) * (y1 - y0) / 500; i++) K.dab(g, x0 + R() * (x1 - x0), y0 + R() * (y1 - y0), ang + (R() - 0.5) * 0.5, 22 + R() * 26, 9 + R() * 6, pal[Math.floor(R() * pal.length)], 0.2);
    g.restore(); };
  // pipa-shaped cave: pear body, neck up to a pegbox
  const pipa = (cx, cy, s) => { const o = []; for (let k = 0; k <= 40; k++) { const a = k / 40 * TAU, r = 1 + 0.18 * Math.cos(a + Math.PI / 2); o.push(cx + Math.cos(a) * 62 * s * r, cy + 10 * s + Math.sin(a) * 70 * s * (Math.sin(a) < 0 ? 1.15 : 1)); } return o; };
  // the scorpion's tail: segments along a curve from the cave to the tip
  const tailPts = (base, tip, lift) => { const o = []; for (let k = 0; k <= 15; k++) { const q = k / 15, x = XY.lerp(base[0], tip[0], q), y = XY.lerp(base[1], tip[1], q) - lift * Math.sin(Math.PI * Math.pow(q, 0.8)); o.push([x, y]); } return o; };
  const rooster = (g, x, y, crow, t) => { g.save(); g.translate(x, y); g.lineJoin = 'round';
    const f = (pts, c, oc) => { XY.path(g, XY.RIG.spline(pts, true, 4), true); g.fillStyle = c; g.fill(); g.strokeStyle = oc; g.lineWidth = 2.4; g.stroke(); };
    [['#12A07A', -0.2], ['#1D3FB5', 0.2], ['#6A2A8A', 0.6], ['#12A07A', 1.0]].forEach(([c, a]) => { g.save(); g.rotate(-a - 0.1 * Math.sin(t * 3)); f([-20, -10, -70, -60, -84, -30, -40, 0], c, '#E8321E'); g.restore(); });
    f([-34, -6, -24, -40, 10, -46, 30, -20, 20, 10, -20, 12], '#FFD21E', '#1D3FB5');
    const hx = 26, hy = -60 - 6 * crow; f([10, -40, 18, -64, hx + 14, hy - 4, hx + 18, hy + 14, 30, -24], '#FF8A1E', '#1D3FB5');
    f([hx, hy - 12, hx + 4, hy - 28, hx + 10, hy - 18, hx + 16, hy - 30, hx + 20, hy - 12], '#E8321E', '#1D3FB5');
    const op = 0.35 * crow; f([hx + 18, hy - 2, hx + 34, hy - 2 - 8 * op, hx + 18, hy + 4], '#FFD21E', '#1D3FB5'); f([hx + 18, hy + 6, hx + 34, hy + 8 + 10 * op, hx + 18, hy + 10], '#FFD21E', '#1D3FB5');
    f([hx + 14, hy + 12, hx + 20, hy + 28, hx + 10, hy + 22], '#E8321E', '#1D3FB5'); g.fillStyle = '#1D3FB5'; g.beginPath(); g.arc(hx + 10, hy, 2.6, 0, TAU); g.fill();
    g.strokeStyle = '#E8641E'; g.lineWidth = 4; g.beginPath(); g.moveTo(-6, 10); g.lineTo(-10, 34); g.moveTo(8, 10); g.lineTo(10, 34); g.stroke(); g.restore(); };
  const MTN = [560, GRD, 640, 470, 760, 330, 870, 250, 930, 246, 1000, 300, 1100, 380, 1190, 420, 1190, GRD];

  XY.STYLES.fauvism = {
    hits: [ST2, CROW],
    post(cv, g, e) { K.punch(cv, g, e, e.procX - 110, e.groundY - 110, 1 + 0.12 * K.env(e.beat, ST2 + 0.05, 0.2, 1.4)); },
    bg(g, W, H) {
      const R = XY.rng(4401); g.fillStyle = '#F4EEDF'; g.fillRect(0, 0, W, H); g.lineCap = 'round';
      // sky: one vermilion field with a lemon-orange blaze round the sun and a lilac-pink band at the horizon
      blk(g, [0, 0, W, 0, W, HZ + 10, 0, HZ + 10], '#E8321E', R, ['#FF4A2A', '#C81E1E'], -0.15, 0.18);
      blk(g, [0, 380, 300, 362, 700, 390, W, 370, W, HZ + 10, 0, HZ + 10], '#FF9AB0', R, ['#FF7AA0', '#FFB4C8'], 0, 0.3);
      // the bay of cobalt and green
      blk(g, [0, HZ - 6, 300, HZ - 14, 620, HZ, 640, GRD, 0, GRD], '#1D3FB5', R, ['#2A5AE0', '#12A07A', '#6A9AF0'], 0.02, 0.45);
      // 毒敌山: emerald and violet planes, a lemon ridge, the pipa cave with its neck
      blk(g, MTN, '#12A07A', R, ['#1EC88A', '#0E7A6A', '#7AD03A'], -0.9, 0.45);
      blk(g, [900, 248, 1000, 300, 1100, 380, 1190, 420, 1190, GRD, 980, GRD, 940, 420], '#6A2A8A', R, ['#8A3AB0', '#4A1E7A', '#C81E6A'], -1.2, 0.45);
      g.strokeStyle = '#FFD21E'; g.lineWidth = 10; g.beginPath(); g.moveTo(640, 470); g.lineTo(760, 330); g.lineTo(870, 252); g.stroke();
      { const nk = [CAVE[0] - 16, CAVE[1] - 60, CAVE[0] - 12, CAVE[1] - 150, CAVE[0] + 12, CAVE[1] - 150, CAVE[0] + 16, CAVE[1] - 60]; XY.path(g, nk, true); g.fillStyle = '#1A1060'; g.fill(); g.strokeStyle = '#E8321E'; g.lineWidth = 6; g.stroke();
        const pb = [CAVE[0] - 12, CAVE[1] - 150, CAVE[0] + 10, CAVE[1] - 196, CAVE[0] + 30, CAVE[1] - 188, CAVE[0] + 12, CAVE[1] - 150]; XY.path(g, pb, true); g.fillStyle = '#C81E6A'; g.fill(); g.stroke();
        for (let k = 0; k < 4; k++) { const y = CAVE[1] - 156 - k * 10, x = CAVE[0] + 4 + k * 5; g.strokeStyle = '#FFD21E'; g.lineWidth = 5; g.beginPath(); g.moveTo(x - 18, y); g.lineTo(x - 4, y + 2); g.moveTo(x + 14, y - 2); g.lineTo(x + 28, y); g.stroke(); } }
      g.fillStyle = '#1A1060'; XY.path(g, pipa(CAVE[0], CAVE[1], 1), true); g.fill(); g.strokeStyle = '#E8321E'; g.lineWidth = 9; g.stroke(); g.strokeStyle = '#FFD21E'; g.lineWidth = 3; g.stroke();
      // the tree with a vermilion trunk
      g.strokeStyle = '#E8321E'; g.lineWidth = 16; g.beginPath(); g.moveTo(430, GRD); g.quadraticCurveTo(420, 460, 470, 330); g.stroke(); g.lineWidth = 9; g.beginPath(); g.moveTo(446, 420); g.quadraticCurveTo(400, 380, 370, 360); g.stroke();
      g.strokeStyle = '#1D3FB5'; g.lineWidth = 3; g.beginPath(); g.moveTo(440, GRD); g.quadraticCurveTo(430, 460, 478, 332); g.stroke();
      // the ground: big patches of pink, violet, blue and green with white canvas between
      [[0, GRD, 360, GRD - 6, 420, H, 0, H, '#FF7AA0', '#E8507A'], [340, GRD - 4, 760, GRD + 4, 820, H, 400, H, '#7AD03A', '#12A07A'], [740, GRD + 2, 1190, GRD - 8, 1190, H, 800, H, '#2A5AE0', '#6A9AF0']].forEach(p => {
        blk(g, p.slice(0, 8), p[8], R, [p[9]], 0.1, 0.3); });
      for (let i = 0; i < 50; i++) { g.strokeStyle = '#F4EEDF'; g.lineWidth = 2 + R() * 3; const x = R() * W, y = GRD + R() * (H - GRD); g.beginPath(); g.moveTo(x, y); g.lineTo(x + 14 + R() * 20, y + (R() - 0.5) * 6); g.stroke(); }
      // title: a cobalt word with a vermilion shadow
      g.font = XY.font(88, '"Baoli SC", "Kaiti SC", serif'); g.textBaseline = 'alphabetic'; g.fillStyle = '#E8321E'; g.fillText('琵琶', 54, 128); g.fillStyle = '#1D3FB5'; g.fillText('琵琶', 48, 122);
      g.font = XY.font(28, '"Baoli SC", "Kaiti SC", serif'); g.fillStyle = '#1D3FB5'; g.fillText('第四十四难', 56, 168);
    },
    draw(g, e) {
      const { W, H, t, u, beat, S } = e; g.lineCap = 'round';
      // the sun: a small lemon disc and six short strokes
      g.fillStyle = '#FFE66A'; g.beginPath(); g.arc(1080, 96, 24, 0, TAU); g.fill(); g.strokeStyle = '#1D3FB5'; g.lineWidth = 3; g.stroke();
      for (let k = 0; k < 6; k++) { const a = k / 6 * TAU + t * 0.4; K.dab(g, 1080 + Math.cos(a) * 42, 96 + Math.sin(a) * 42, a, 22, 7, k % 2 ? '#FFD21E' : '#FFFFFF', 0.1); }
      // the bay glitters, the tree's colour blocks sway
      for (let k = 0; k < 26; k++) { if (XY.hash(k, K.step(t, 6)) < 0.5) continue; K.dab(g, 30 + XY.hash(k, 1) * 560, HZ + 20 + XY.hash(k, 2) * 140, 0, 24, 6, ['#FFFFFF', '#7AD03A', '#FF9AB0'][k % 3], 0.1); }
      [[470, 300, 70, '#12A07A'], [400, 340, 54, '#7AD03A'], [520, 350, 50, '#1D3FB5'], [370, 300, 40, '#FFD21E'], [470, 250, 44, '#0E7A6A']].forEach(([x, y, r, c], k) => {
        const dx = 6 * Math.sin(t * 1.5 + k); XY.path(g, XY.RIG.spline(XY.wobble(XY.ellipse(x + dx, y, r, r * 0.75, 10), 8, 44 + k), true, 3), true); g.fillStyle = c; g.fill(); g.strokeStyle = '#E8321E'; g.lineWidth = 3; g.stroke(); });
      // ---- 昴日星官 as a pure-colour rooster on the peak; one crow, rings of colour
      const crow = K.bump(beat, CROW, 0.35), rs = XY.easeOut(K.ramp(beat, CROW - 0.9, CROW - 0.55));
      if (rs > 0) { g.save(); g.translate(905, 248); g.scale(rs, rs); rooster(g, 0, -34, crow, t); g.restore();
        for (let k = 0; k < 6; k++) { const f = (beat - CROW + 0.1 - k * 0.12) / 1.2; if (f < 0 || f > 1) continue; g.strokeStyle = ['#FFD21E', '#E8321E', '#1D3FB5', '#12A07A', '#FF7AA0', '#FFFFFF'][k]; g.lineWidth = 9 * (1 - f) + 2;
          g.beginPath(); g.arc(950, 216, 30 + 260 * f, -2.6, 0.6); g.stroke(); } }
      // ---- the cave: eyes glow in the dark, then 蝎子精 steps out with her trident; at the cock's crow she shrinks back into her true form
      const dead = K.ramp(beat, CROW + 0.1, CROW + 0.4), emerge = XY.easeOut(K.ramp(beat, OUT, OUT + 0.8));
      if (emerge < 1) { const bl = (K.step(t, 3) % 5) ? 1 : 0.2; g.fillStyle = '#FFD21E'; [-14, 14].forEach(dx => { g.beginPath(); g.ellipse(CAVE[0] + dx, CAVE[1] + 4, 6, 6 * bl, 0, 0, TAU); g.fill(); }); }
      const WM = [CAVE[0] - 6 + 76 * emerge, 572], wsc = 1.3 * (1 - 0.8 * dead);
      if (emerge > 0 && dead < 1) { g.save(); g.translate(WM[0], WM[1]); g.scale(wsc, wsc); g.globalAlpha = Math.min(1, emerge * 1.5) * (1 - dead); g.lineJoin = 'round';
        const f = (pts, c, oc = '#1D3FB5') => { XY.path(g, XY.RIG.spline(pts, true, 4), true); g.fillStyle = c; g.fill(); g.strokeStyle = oc; g.lineWidth = 2.6; g.stroke(); };
        f([-24, 0, -16, -70, -10, -96, 12, -96, 18, -70, 28, 0], '#1D3FB5', '#E8321E'); f([-14, -70, 16, -70, 18, -60, -16, -60], '#E8321E');
        f([-12, -96, -14, -124, 0, -132, 14, -124, 12, -96], '#FF9AB0'); f([-16, -124, 16, -124, 8, -112, -8, -112], '#12A07A', '#1D3FB5');
        f(XY.ellipse(0, -144, 13, 15, 14), '#F6B48A'); g.fillStyle = 'rgba(20,150,90,0.55)'; g.beginPath(); g.ellipse(4, -144, 5, 14, 0, 0, TAU); g.fill();
        f([-14, -150, -6, -172, 10, -170, 16, -150, 8, -160, -8, -160], '#1A1060', '#1A1060'); f(XY.ellipse(4, -176, 9, 8, 12), '#1A1060', '#1A1060');
        g.fillStyle = '#E8321E'; g.beginPath(); g.ellipse(-6, -136, 3, 1.6, 0, 0, TAU); g.fill(); g.fillStyle = '#1A1060'; g.fillRect(-9, -148, 5, 2);
        const ta = -0.2 + 0.25 * Math.sin(t * 2); g.save(); g.translate(-16, -110); g.rotate(ta); g.strokeStyle = '#FFD21E'; g.lineWidth = 5; g.beginPath(); g.moveTo(0, 60); g.lineTo(0, -90); g.stroke();
        g.lineWidth = 4; g.beginPath(); g.moveTo(-14, -90); g.lineTo(14, -90); g.moveTo(-14, -90); g.lineTo(-14, -110); g.moveTo(0, -90); g.lineTo(0, -116); g.moveTo(14, -90); g.lineTo(14, -110); g.stroke(); g.restore();
        f([-14, -118, -28, -96, -22, -88, -10, -104], '#FF9AB0'); g.restore(); }
      // ---- the procession, pure colour, complementary contours, a green shadow on the faces
      const hurt = K.ramp(beat, ST1, ST1 + 0.1) * (1 - K.ramp(beat, ST2 + 0.6, ST2 + 1.2)), shake = K.hit(beat, ST1, 1.6) + 0.6 * K.hit(beat, ST2, 2);
      const acts = { wukong: { shade: hurt, raise: K.ramp(beat, CROW + 0.3, CROW + 0.7) * (1 - K.ramp(u, 0.95, 1.05)) }, monk: { palm: K.ramp(beat, OUT + 0.2, OUT + 0.6) * (1 - K.ramp(beat, CROW + 0.4, CROW + 0.8)) },
        bajie: { scratch: K.ramp(beat, ST2, ST2 + 0.12) * (1 - K.ramp(u, 0.95, 1.05)) } };
      const xf = { wukong: { dx: 4 * shake * Math.sin(t * 46) }, bajie: { dx: 3 * K.hit(beat, ST2, 2) * Math.sin(t * 40) } };
      const lip = K.ramp(beat, ST2, ST2 + 0.18);
      const inject = { bajie: [{ at: -4, fn: (ctx, F) => { if (lip <= 0) return; const h = F.anchors.head, c = [h[0] + 33, h[1] + 9], r = 4 + 11 * lip + 1.2 * Math.sin(t * 12) * lip;
        ctx.beginPath(); ctx.ellipse(c[0], c[1], r, r * 0.8, 0, 0, TAU); ctx.fillStyle = '#E8321E'; ctx.fill(); ctx.strokeStyle = '#1D3FB5'; ctx.lineWidth = 2.2; ctx.stroke();
        ctx.strokeStyle = '#FFE66A'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(c[0] - r * 0.3, c[1] - r * 0.3, r * 0.45, 3.4, 4.6); ctx.stroke(); } }] };
      const L = K.procLayer('c44', e, 330, 40); K.drawProc(L.g, e, PEN, acts, { xf, inject });
      K.pat(L, K.strokeTile('c44st', S, 120, 120, ['rgba(255,210,30,0.22)', 'rgba(29,63,181,0.2)', 'rgba(18,160,122,0.2)'], { len: 14, w: 3.6, seed: 44, ang: (x, y, R) => (R() - 0.5) * 1.6 }), 'source-atop');
      K.put(g, L);
      // ---- the poison tail: rests curled over the hill, winds up, stabs 悟空's head, then 八戒's snout; pulled in at the crow
      const base = emerge > 0 ? [WM[0] + 14 * wsc, WM[1] - 70 * wsc] : [CAVE[0] + 6, CAVE[1] - 26], rest = [930 + 20 * Math.sin(t * 1.3), 360 + 14 * Math.sin(t * 1.7)];
      const strike = (b, tgt) => { const w = K.ramp(beat, b - 0.5, b - 0.14), h = XY.easeIn(K.ramp(beat, b - 0.14, b)), back = XY.smooth((beat - b - 0.2) / 0.5);
        const wu = [rest[0] + 70, rest[1] - 90], p1 = XY.RIG.mix(rest, wu, w), p2 = XY.RIG.mix(p1, tgt, h); return XY.RIG.mix(p2, rest, back); };
      const wk = K.at(e, 'wukong.head', acts, xf), bh = K.at(e, 'bajie.head', acts, xf), sn = [bh[0] + 30, bh[1] + 6];
      let tip = beat < (ST1 + ST2) / 2 ? strike(ST1, [wk[0] + 4, wk[1] - 20]) : strike(ST2, sn); const pull = K.ramp(beat, CROW - 0.05, CROW + 0.3);
      tip = XY.RIG.mix(tip, base, pull);
      if (pull < 1) { const lift = XY.lerp(150, 20, pull), seg = tailPts(base, tip, lift);
        seg.forEach((p, k) => { if (k === 0) return; const r = 26 - k * 0.95; g.beginPath(); g.ellipse(p[0], p[1], r, r * 0.8, Math.atan2(p[1] - seg[k - 1][1], p[0] - seg[k - 1][0]), 0, TAU); g.fillStyle = k % 2 ? '#E8321E' : '#FF8A1E'; g.fill(); g.strokeStyle = '#1D3FB5'; g.lineWidth = 3; g.stroke(); });
        const a = Math.atan2(tip[1] - seg[14][1], tip[0] - seg[14][0]); g.save(); g.translate(tip[0], tip[1]); g.rotate(a);
        XY.path(g, [-8, -13, 34, 2, -8, 13], true); g.fillStyle = '#FFD21E'; g.fill(); g.strokeStyle = '#1D3FB5'; g.lineWidth = 2.4; g.stroke(); g.restore(); }
      [[ST1, [wk[0] + 4, wk[1] - 20]], [ST2, sn]].forEach(([b, p]) => { const f = (beat - b) / 0.7; if (f < 0 || f > 1) return;
        for (let k = 0; k < 18; k++) { const a = k / 18 * TAU + b, r = 10 + 70 * XY.easeOut(f); K.dab(g, p[0] + Math.cos(a) * r, p[1] + Math.sin(a) * r, a, 26 * (1 - f) + 6, 8 * (1 - f) + 2, ['#FFD21E', '#FFFFFF', '#E8321E'][k % 3], 0); } });
      // ---- her true form: a scorpion the size of a pipa, dead on its back at the cave mouth
      if (dead > 0) { const y = XY.lerp(CAVE[1] + 30, CAVE[1] + 92, XY.easeIn(dead)); g.save(); g.translate(CAVE[0] - 10, y); g.rotate(0.2 * (1 - dead));
        g.strokeStyle = '#1D3FB5'; g.lineWidth = 3; for (let k = 0; k < 4; k++) { g.beginPath(); g.moveTo(-14 + k * 10, -4); g.lineTo(-20 + k * 12, -18 - 3 * Math.sin(t * 9 + k) * (1 - dead)); g.stroke(); }
        g.beginPath(); g.ellipse(0, 0, 30, 12, 0, 0, TAU); g.fillStyle = '#E8321E'; g.fill(); g.stroke();
        XY.path(g, XY.RIG.spline([26, -2, 50, -10, 58, -26, 48, -32], false, 4), false); g.lineWidth = 7; g.strokeStyle = '#FF8A1E'; g.stroke(); g.restore(); }
      // ---- entrance: the brush sweeps pure colour across a bare canvas
      const ed = XY.lerp(-60, W + 90, K.ramp(u, -0.45, 0.08)); if (ed < W + 80) { g.save(); g.beginPath(); g.moveTo(W + 10, -10); for (let y = -10; y <= H + 10; y += 26) g.lineTo(ed + 26 * Math.sin(y / 70) + 18 * XY.hash(y, 3), y); g.lineTo(W + 10, H + 10); g.closePath();
        g.fillStyle = '#F4EEDF'; g.fill(); g.clip(); g.strokeStyle = 'rgba(60,40,30,0.5)'; g.lineWidth = 1.6; g.beginPath(); XY.path(g, MTN, true); g.stroke(); g.beginPath(); g.arc(1070, 104, 30, 0, TAU); g.stroke(); g.restore();
        for (let k = 0; k < 14; k++) K.dab(g, ed + 10 * Math.sin(k), k * 58 + 20, 1.4, 70, 20, ['#E8321E', '#1D3FB5', '#FFD21E', '#12A07A'][k % 4], 0.1); }
    },
  };
})();
