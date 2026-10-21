// 77 蒸汽波 · 赶捉犀牛 — a vaporwave sunset over the 西洋大海: slit sun, rolling magenta grid, palms, wireframe 青龙山.
// The 四木禽星 hang in the sky as star patterns; on beat 2 they snap into four neon line beasts (角木蛟 斗木獬 奎木狼 井木犴)
// and dive on the three chrome rhinos fleeing to the sea; on beat 3 they pounce and a Win95 box pops: 犀牛.EXE 捕获 3/3.
(() => {
  'use strict';
  const XY = window.XY, K = XY.KIT_I, TAU = XY.TAU, { sin, cos, PI, hypot } = Math;
  const MAG = '#FF3EC8', CYA = '#3FF6FF', PNK = '#FF7AD9', DEEP = '#1A0A33', YEL = '#FFD84A';
  const HZ = 470, VX = 730, SUN = [730, 392, 150];
  const sm = XY.smooth, W_ = K.win;
  const glow = (g, pts, closed, col, w, blur, S, core = '#FFFFFF') => { g.save(); g.lineJoin = g.lineCap = 'round'; XY.path(g, pts, closed);
    g.shadowColor = col; g.shadowBlur = blur * S; g.strokeStyle = col; g.lineWidth = w; g.stroke(); g.shadowBlur = 0; g.strokeStyle = core; g.lineWidth = Math.max(1, w * 0.35); g.stroke(); g.restore(); };

  // four beasts as neon outlines (facing right, ~130 px long); each vertex starts as a star of its constellation
  const BEASTS = [
    { name: '角木蛟', col: CYA, pts: [66, -10, 54, -32, 50, -20, 40, -20, 24, -26, 6, -12, -14, -26, -34, -18, -54, -30, -74, -20, -56, -16, -36, -4, -16, -12, 0, 0, 14, -8, 18, 8, 10, 6, 6, -2, 26, -12, 46, -4] },
    { name: '斗木獬', col: YEL, pts: [56, -50, 42, -26, 58, -8, 48, 6, 34, -2, 30, 22, 22, 22, 18, 6, -24, 6, -28, 22, -36, 22, -40, -4, -50, -14, -22, -18, 22, -22, 34, -30] },
    { name: '奎木狼', col: PNK, pts: [62, -12, 46, -22, 38, -38, 30, -22, 16, -20, -20, -18, -44, -16, -68, -28, -52, -10, -42, -4, -52, 14, -58, 22, -38, 12, -10, 0, 16, 4, 30, 22, 36, 4, 42, -4, 54, -6] },
    { name: '井木犴', col: '#B4FF6A', pts: [58, -8, 48, -24, 40, -36, 32, -24, 20, -30, -18, -18, -44, -22, -54, -32, -46, -10, -48, 20, -36, 20, -30, 2, 10, 2, 14, 20, 26, 20, 34, -2, 52, 0] },
  ];
  const SKYAT = [[580, 96], [510, 250], [920, 110], [1060, 250]];
  // the rhinos: chrome silhouettes facing right, two gallop frames
  const RHINO = f => { const l = f ? [[-34, 0, -40, 26], [-18, 2, -12, 26], [22, 0, 30, 26], [36, 0, 44, 24]] : [[-34, 0, -26, 26], [-18, 2, -24, 26], [22, 0, 16, 26], [36, 0, 30, 26]];
    return { body: [-56, -6, -52, -24, -30, -34, 0, -36, 18, -40, 34, -30, 46, -26, 48, -38, 55, -24, 66, -12, 78, -4, 72, 6, 52, 8, 34, 10, 24, 14, -40, 12, -54, 6], legs: l,
      horn: [64, -12, 74, -48, 72, -10, 55, -20, 58, -34, 61, -18] }; };

  // ------------------------------------------------------------ static: gradient sky, stars, wireframe hills, sea band, grid base, palms' trunks
  const bg = (g, W, H, c, S) => {
    let gr = g.createLinearGradient(0, 0, 0, HZ); gr.addColorStop(0, '#12052A'); gr.addColorStop(0.45, '#4A0F6A'); gr.addColorStop(0.8, '#C2357E'); gr.addColorStop(1, '#FF8A5A'); g.fillStyle = gr; g.fillRect(0, 0, W, HZ);
    const r = XY.rng(771); g.fillStyle = '#FFFFFF'; for (let k = 0; k < 120; k++) { const x = r() * W, y = r() * 300; g.globalAlpha = 0.3 + 0.7 * r() * (1 - y / 300); g.fillRect(x, y, 1.5, 1.5); } g.globalAlpha = 1;
    // 青龙山 in wireframe on the left horizon
    const hill = (x0, x1, peak, seed) => { const p = []; for (let x = x0; x <= x1; x += 18) { const v = (x - x0) / (x1 - x0); p.push(x, HZ - peak * Math.pow(sin(PI * v), 1.4) * (0.75 + 0.25 * XY.noise1(x / 40, seed))); } return p; };
    [[ -20, 520, 150, 1], [180, 700, 90, 2]].forEach(([a, b, pk, sd]) => { const p = hill(a, b, pk, sd);
      g.fillStyle = '#26093F'; g.beginPath(); g.moveTo(a, HZ); for (let i = 0; i < p.length; i += 2) g.lineTo(p[i], p[i + 1]); g.lineTo(b, HZ); g.fill();
      glow(g, p, false, MAG, 2.4, 10, S);
      g.strokeStyle = 'rgba(255,62,200,0.45)'; g.lineWidth = 1; for (let i = 2; i < p.length - 2; i += 4) { g.beginPath(); g.moveTo(p[i], p[i + 1]); g.lineTo(p[i] + (VX - p[i]) * 0.05, HZ); g.stroke(); } });
    // 西洋大海: a band of water at the horizon
    gr = g.createLinearGradient(0, HZ, 0, 528); gr.addColorStop(0, '#5A1E7A'); gr.addColorStop(1, '#22105A'); g.fillStyle = gr; g.fillRect(0, HZ, W, 58);
    g.fillStyle = 'rgba(63,246,255,0.35)'; for (let k = 0; k < 9; k++) { const y = HZ + 6 + k * 6; g.fillRect(0, y, W, 1); }
    // grid floor base
    gr = g.createLinearGradient(0, 528, 0, H); gr.addColorStop(0, '#2A0848'); gr.addColorStop(1, '#0E0322'); g.fillStyle = gr; g.fillRect(0, 528, W, H - 528);
    g.strokeStyle = MAG; g.lineWidth = 1.6; g.shadowColor = MAG; g.shadowBlur = 6 * S;
    for (let k = -16; k <= 16; k++) { g.beginPath(); g.moveTo(VX + k * 22, 528); g.lineTo(VX + k * 260, H + 40); g.stroke(); }
    g.shadowBlur = 0;
    glow(g, [0, 528, W, 528], false, CYA, 2, 8, S);
  };

  const VC = { fur: '#9B6BC9', face: '#FFD1E8', wkshirt: '#FF4FA8', tiger: '#FFB86B', stripe: '#3A1060', gold: '#FFE66B', staff: '#FF4FA8', ink: DEEP, horse: '#EAF6FF', horse2: '#BFD8F2', mane: '#9FF3FF',
    hoof: '#3A1060', saddle: '#7A2E8C', red: '#FF3D7F', robe: '#FFD36B', kasaya: '#FF3D7F', skin: '#FFD9C2', metal: '#FFE66B', bjrobe: '#2C2A6A', bjpants: '#221F55', pig: '#FFB3D1', pig2: '#F28DB8',
    wood: '#B07AE0', ssrobe: '#2F7F9F', ssrobe2: '#225F7F', skin2: '#E0A98A', ssh: '#FF5C7A', ssbeard: '#E8466A', skull: '#F2F2FF', bundle: '#FFC46B' };
  const VPEN = { color: r => VC[r] || DEEP, outline: DEEP, ow: 1.4, shade: 'rgba(40,0,80,0.28)' };
  // v10 (8 beats): stars snap into the four beasts at 2 (they chase along the sky), then each pounces on a rhino: 4, 4.5, 5 (hits 4, 5);
  // the Win95 box counts 1 / 3 → 3 / 3; from 5.8 the sawn-off horns float up to heaven
  const SNAP = 2.0, CATCH = [4.0, 4.5, 5.0], XC = [430, 690, 950], RY = 470, HORN = k => 5.8 + 0.3 * k;
  const actsAt = b => ({ wukong: { strike: sm(W_(b, 0.8, 1.2)) * (1 - sm(W_(b, 1.8, 2.2))), shade: sm(W_(b, 2.1, 2.4)) * (1 - sm(W_(b, 3.4, 3.8))), raise: sm(W_(b, 4.0, 4.3)) * (1 - sm(W_(b, 5.8, 6.4))) },
    monk: { palm: sm(W_(b, 5.2, 5.6)) }, bajie: { scratch: sm(W_(b, 6.2, 6.6)) }, shaseng: { lift: sm(W_(b, 2.4, 2.7)) * (1 - sm(W_(b, 3.3, 3.7))) } });
  // the rhinos gallop along the horizon, big and chrome against the sun, until a beast pins each one
  const rhinoAt = (k, beat, t) => { const run = beat < CATCH[k]; return [run ? XC[k] - 70 * (CATCH[k] - beat) : XC[k], RY - (run ? 5 * Math.abs(sin(t * 11 + k)) : 0), 1.62]; };
  const PREY = [0, 1, 2, 1];
  const bez = (a, b, c, d, u) => { const v = 1 - u; return v * v * v * a + 3 * v * v * u * b + 3 * v * u * u * c + u * u * u * d; };
  const drawRhino = (g, x, y, s, f, S, tint, noHorn) => { const R = RHINO(f); g.save(); g.translate(x, y); g.scale(s, s); g.lineJoin = g.lineCap = 'round';
    const gr = g.createLinearGradient(0, -36, 0, 26); gr.addColorStop(0, tint || '#FFE6F8'); gr.addColorStop(0.45, tint || '#E07AE8'); gr.addColorStop(1, tint || '#5A1E8A');
    g.strokeStyle = gr; g.lineWidth = 8; R.legs.forEach(l => { g.beginPath(); g.moveTo(l[0], l[1]); g.lineTo(l[2], l[3]); g.stroke(); });
    g.fillStyle = gr; XY.path(g, R.body, true); g.fill(); g.strokeStyle = tint || MAG; g.lineWidth = 1.6; g.stroke();
    if (!noHorn) { g.fillStyle = tint || '#F7F0E0'; XY.path(g, R.horn.slice(0, 6), true); g.fill(); XY.path(g, R.horn.slice(6), true); g.fill(); }
    g.strokeStyle = tint || '#B04ACF'; g.lineWidth = 3; g.beginPath(); g.moveTo(-55, -10); g.quadraticCurveTo(-64, -6, -62, 6); g.stroke();
    if (!tint) { g.save(); g.shadowColor = CYA; g.shadowBlur = 10 * S; g.strokeStyle = CYA; g.lineWidth = 2.4; XY.path(g, R.body, true); g.stroke();
      g.beginPath(); g.moveTo(26, -34); g.quadraticCurveTo(22, -12, 28, 8); g.stroke(); g.restore(); g.fillStyle = DEEP; g.beginPath(); g.arc(52, -16, 2.4, 0, TAU); g.fill(); }
    g.restore(); };

  XY.STYLES.vaporwave = {
    bg,
    hits: [CATCH[0], CATCH[2]],
    draw(g, e) {
      const { W, H, t, u, beat, S } = e, A = actsAt(beat);
      // the slit sun (cut on a small layer so the sky stays), its glow and its broken reflection on the sea
      const [sx, sy, sr] = SUN, sg = g.createRadialGradient(sx, sy, sr * 0.6, sx, sy, sr * 1.9); sg.addColorStop(0, 'rgba(255,120,190,0.35)'); sg.addColorStop(1, 'rgba(255,120,190,0)'); g.fillStyle = sg; g.fillRect(sx - sr * 2, sy - sr * 2, sr * 4, HZ - sy + sr * 2);
      { const n = Math.ceil(2 * sr * S), cv = XY.scratch('i77sun', n, n), c = cv.getContext('2d'); c.scale(S, S);
        const gr = c.createLinearGradient(0, 0, 0, 2 * sr); gr.addColorStop(0, '#FFE86A'); gr.addColorStop(0.5, '#FF9A4A'); gr.addColorStop(1, '#FF2F8F'); c.fillStyle = gr; c.beginPath(); c.arc(sr, sr, sr, 0, TAU); c.fill();
        c.globalCompositeOperation = 'destination-out'; for (let k = 0; k < 9; k++) { const q = ((k / 9 + t * 0.12) % 1), y = sr + q * sr, h = 2 + q * q * 16; c.fillRect(0, y - h / 2, 2 * sr, h); }
        g.save(); g.beginPath(); g.rect(0, 0, W, HZ); g.clip(); g.drawImage(cv, sx - sr, sy - sr, 2 * sr, 2 * sr); g.restore(); }
      for (let k = 0; k < 9; k++) { const y = HZ + 4 + k * 6, w = (140 - k * 9) * (0.8 + 0.2 * sin(t * 6 + k * 1.7)); g.fillStyle = k % 2 ? 'rgba(255,216,74,0.7)' : 'rgba(255,47,143,0.6)'; g.fillRect(sx - w / 2 + 6 * sin(t * 3 + k), y, w, 2.4); }
      // grid lines rolling toward us
      { const ph = (t * 1.3) % 1, Y = z => 528 + 300 / (z + 1.2) - 300 / 15.2; g.save(); g.strokeStyle = MAG; g.shadowColor = MAG; g.shadowBlur = 6 * S;
        for (let k = 1; k <= 14; k++) { const z = k - ph, y = Y(z); if (y > H + 4) continue; g.lineWidth = 1 + 2.2 / (z + 0.6); g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke(); } g.restore(); }
      // palms swaying at both edges
      [[64, 1], [1118, -1]].forEach(([x, d], k) => { const sw = 0.06 * sin(t * 1.6 + k * 2), top = [x + d * 40 + 30 * sw * 10, 300];
        g.strokeStyle = '#1A0630'; g.lineCap = 'round'; g.lineWidth = 16; g.beginPath(); g.moveTo(x, 704); g.quadraticCurveTo(x + d * 6, 480, top[0], top[1]); g.stroke();
        for (let i = 0; i < 8; i++) { const a = -PI / 2 + (i - 3.5) * 0.42 + sw * 2 + 0.08 * sin(t * 2.4 + i), L = 110 + 20 * sin(i * 1.7); g.lineWidth = 7; g.beginPath(); g.moveTo(top[0], top[1]);
          g.quadraticCurveTo(top[0] + cos(a) * L * 0.6, top[1] + sin(a) * L * 0.6 - 26, top[0] + cos(a) * L, top[1] + sin(a) * L * 0.8 + 30); g.stroke(); } });
      // the three rhinos: galloping, then glitching when pinned, horns sawn off and floating up
      for (let k = 2; k >= 0; k--) { const [x, y, s] = rhinoAt(k, beat, t), run = beat < CATCH[k], f = run ? Math.floor(t * 10 + k) % 2 : 0, gl = beat >= CATCH[k] && beat < CATCH[k] + 0.5, hv = W_(beat, HORN(k), HORN(k) + 1.6);
        if (gl) { const j = (XY.hash(Math.floor(t * 30), k) - 0.5) * 14; drawRhino(g, x + j - 5, y, s, f, S, 'rgba(63,246,255,0.6)', hv > 0); drawRhino(g, x - j + 5, y, s, f, S, 'rgba(255,62,200,0.6)', hv > 0); }
        drawRhino(g, x, y, s, f, S, null, hv > 0);
        if (hv > 0 && hv < 1) { const hx = x + 66 * s, hy = y - 30 * s - 260 * XY.easeIn(hv), rg = g.createRadialGradient(hx, hy, 2, hx, hy, 40); rg.addColorStop(0, `rgba(255,216,74,${0.8 * (1 - hv)})`); rg.addColorStop(1, 'rgba(255,216,74,0)');
          g.fillStyle = rg; g.fillRect(hx - 40, hy - 40, 80, 80); g.save(); g.translate(hx, hy); g.rotate(hv * 4); g.scale(s, s); g.fillStyle = '#FFE9A0'; XY.path(g, [-4, 14, 4, -18, 6, 14], true); g.fill(); g.restore(); } }
      // the four wood-element lunar mansions: stars → neon beasts (SNAP) → chase → pounce
      const mo = XY.easeOut(W_(beat, SNAP, SNAP + 0.25));
      BEASTS.forEach((B, b) => {
        const p = PREY[b], cb = CATCH[p], tg = [XC[p] + (b === 3 ? -50 : 20), RY - 118 - (b === 3 ? 34 : 0)], dv = W_(beat, cb - 0.8, cb);
        const s0 = [SKYAT[b][0] + 0.3 * (tg[0] - SKYAT[b][0]) * sm(W_(beat, SNAP + 0.3, cb - 0.8)), SKYAT[b][1]], face = tg[0] >= s0[0] ? 1 : -1;
        const cx = dv > 0 ? bez(s0[0], s0[0] + face * 120, tg[0] - face * 160, tg[0], XY.easeIn(dv)) : s0[0], cy = dv > 0 ? bez(s0[1], s0[1] - 80, tg[1] - 140, tg[1], XY.easeIn(dv)) + (beat > cb ? 4 * sin(t * 5 + b) : 0) : s0[1] + 6 * sin(t * 2 + b);
        const P = B.pts, n = P.length / 2, V = [];
        for (let i = 0; i < n; i++) { const st = [SKYAT[b][0] + (XY.hash(i, b, 3) - 0.5) * 190, SKYAT[b][1] + (XY.hash(i, b, 4) - 0.5) * 110], bs = 1.3; V.push(XY.lerp(st[0], cx + face * P[2 * i] * bs, mo), XY.lerp(st[1], cy + P[2 * i + 1] * bs, mo)); }
        if (mo < 1) { g.strokeStyle = `rgba(200,230,255,${0.3 * (1 - mo)})`; g.lineWidth = 1; XY.path(g, V, false); g.stroke(); }
        if (mo > 0) glow(g, V, true, B.col, 3.4, 16, S);
        for (let i = 0; i < n; i += mo > 0.5 ? 3 : 1) { const tw = 0.6 + 0.4 * sin(t * 5 + i * 1.9 + b); g.fillStyle = `rgba(255,255,255,${tw})`; g.beginPath(); g.arc(V[2 * i], V[2 * i + 1], 2.2 + 1.5 * tw, 0, TAU); g.fill(); }
        if (dv > 0 && dv < 1) for (let j = 1; j < 7; j++) { const v = XY.easeIn(Math.max(0, dv - j * 0.05)); g.fillStyle = B.col; g.globalAlpha = 0.55 - j * 0.07; g.fillRect(bez(s0[0], s0[0] + face * 120, tg[0] - face * 160, tg[0], v) - 2.5, bez(s0[1], s0[1] - 80, tg[1] - 140, tg[1], v) - 2.5, 5, 5); g.globalAlpha = 1; }
        const hit = K.hit(beat, cb, 3) * (beat >= cb ? 1 : 0); if (hit > 0.02) { g.strokeStyle = `rgba(255,255,255,${hit})`; g.lineWidth = 3; g.beginPath(); g.arc(tg[0], tg[1] + 70, 40 + 120 * (1 - hit), 0, TAU); g.stroke(); }
      });
      // the film's gold line, here a cyan neon road
      glow(g, [0, 703, W, 703], false, CYA, 3, 12, S);
      // the pilgrims: pastel recolour, ink outline, a magenta/cyan neon halo split left and right
      const [pl, pg] = K.layer(e, 'i77p');
      K.draw(pg, e.phase, e.procX, e.groundY, VPEN, A);
      const tm = K.tint(pl, 'i77m', MAG), tc = K.tint(pl, 'i77c', CYA);
      g.save(); g.filter = `blur(${5 * S}px)`; K.blit(g, tm, 0.75, 'lighter', -3 * S, 0); K.blit(g, tc, 0.75, 'lighter', 3 * S, 0); g.restore();
      K.blit(g, tm, 0.55, 'screen', -2 * S, 0); K.blit(g, tc, 0.55, 'screen', 2 * S, 0); K.blit(g, pl);
      // title: hollow neon tubes, a flickering second character; katakana; the count in full-width chrome
      g.save(); g.font = XY.font(128, XY.cnFont.hei, '900'); g.textBaseline = 'alphabetic'; g.lineJoin = 'round';
      ['赶', '捉'].forEach((ch, k) => { const off = k === 1 && XY.hash(Math.floor(t * 24), 7) < 0.08, x = 64 + k * 136, y = 178, a = off ? 0.22 : 1;
        g.globalAlpha = a; g.shadowColor = MAG; g.shadowBlur = 22 * S; g.strokeStyle = MAG; g.lineWidth = 7; g.strokeText(ch, x, y); g.shadowBlur = 0; g.strokeStyle = '#FFE8FA'; g.lineWidth = 2.2; g.strokeText(ch, x, y); });
      g.globalAlpha = 1; g.font = XY.font(30, '"Hiragino Sans", "PingFang SC", sans-serif', '700'); g.shadowColor = CYA; g.shadowBlur = 12 * S; g.fillStyle = '#E8FFFF'; g.fillText('サイ・ハント', 72, 232);
      g.shadowBlur = 0; g.font = XY.font(38, XY.cnFont.hei, '900'); g.fillStyle = '#7A1E8C'; g.fillText('第77难', 76, 288);
      const cg = g.createLinearGradient(0, 252, 0, 290); cg.addColorStop(0, '#FFFFFF'); cg.addColorStop(0.5, '#FFB3EC'); cg.addColorStop(0.52, '#B06BE0'); cg.addColorStop(1, '#F2E6FF'); g.fillStyle = cg; g.fillText('第77难', 72, 284);
      g.restore();
      // beat 3: a Win95 box pops up over the catch
      if (beat >= CATCH[0]) { const s = K.outBack(W_(beat, CATCH[0], CATCH[0] + 0.16), 1.6), bx = 790, by = 40, bw = 330, bh = 158, cnt = CATCH.filter(c => beat >= c).length, fill = Math.min(16, Math.floor(16 * cnt / 3 * sm(W_(beat, CATCH[0], CATCH[0] + 0.3)) + 0.01));
        g.save(); g.translate(bx + bw / 2, by + bh / 2); g.scale(s, s); g.translate(-bx - bw / 2, -by - bh / 2);
        g.fillStyle = 'rgba(10,0,30,0.4)'; g.fillRect(bx + 8, by + 8, bw, bh); g.fillStyle = '#C3C3C3'; g.fillRect(bx, by, bw, bh);
        g.fillStyle = '#FFFFFF'; g.fillRect(bx, by, bw, 2); g.fillRect(bx, by, 2, bh); g.fillStyle = '#5A5A5A'; g.fillRect(bx, by + bh - 2, bw, 2); g.fillRect(bx + bw - 2, by, 2, bh);
        const tg = g.createLinearGradient(bx, 0, bx + bw, 0); tg.addColorStop(0, '#000080'); tg.addColorStop(1, '#1084D0'); g.fillStyle = tg; g.fillRect(bx + 4, by + 4, bw - 8, 26);
        g.fillStyle = '#FFFFFF'; g.font = XY.font(18, '"Menlo", "PingFang SC", monospace', 'bold'); g.textBaseline = 'middle'; g.fillText('犀牛.EXE', bx + 12, by + 17);
        g.fillStyle = '#C3C3C3'; g.fillRect(bx + bw - 26, by + 7, 19, 19); g.fillStyle = '#000'; g.fillText('×', bx + bw - 22, by + 17);
        for (let k = 0; k < 3; k++) { g.fillStyle = '#F7F0E0'; XY.path(g, [bx + 22 + k * 16, by + 92, bx + 30 + k * 16, by + 52, bx + 36 + k * 16, by + 92], true); g.fill(); g.strokeStyle = '#5A5A5A'; g.lineWidth = 1.2; g.stroke(); }
        g.fillStyle = '#000'; g.font = XY.font(24, '"Menlo", "PingFang SC", monospace', 'bold'); g.fillText(`捕获  ${cnt} / 3`, bx + 92, by + 66);
        g.fillStyle = '#FFFFFF'; g.fillRect(bx + 92, by + 92, 220, 20); g.fillStyle = '#7A7A7A'; g.fillRect(bx + 92, by + 92, 220, 2); g.fillRect(bx + 92, by + 92, 2, 20);
        g.fillStyle = '#000080'; for (let k = 0; k < fill; k++) g.fillRect(bx + 96 + k * 13.5, by + 96, 11, 13);
        g.fillStyle = '#C3C3C3'; g.fillRect(bx + bw / 2 - 40, by + bh - 36, 80, 26); g.fillStyle = '#FFFFFF'; g.fillRect(bx + bw / 2 - 40, by + bh - 36, 80, 2); g.fillStyle = '#5A5A5A'; g.fillRect(bx + bw / 2 - 40, by + bh - 12, 80, 2);
        g.fillStyle = '#000'; g.font = XY.font(18, '"Menlo", monospace', 'bold'); g.textAlign = 'center'; g.fillText('OK', bx + bw / 2, by + bh - 23); g.restore(); }
    },
    // VHS: scanlines and a tracking band rolling down
    post(cv, g, e) {
      const S = e.S, sl = XY.keep('i77scan', 4, 4, c => { const q = c.getContext('2d'); q.fillStyle = 'rgba(0,0,0,0.26)'; q.fillRect(0, 0, 4, 1); q.fillStyle = 'rgba(0,0,0,0.1)'; q.fillRect(0, 2, 4, 1); });
      const y0 = (((e.lt * 230 + 400) % (e.H + 180)) - 90) * S, bh = 24 * S;
      if (y0 > -bh && y0 < cv.height) { const sc = XY.scratch('i77band', cv.width, Math.ceil(bh)), q = sc.getContext('2d'); q.drawImage(cv, 0, y0, cv.width, bh, 0, 0, cv.width, bh);
        g.drawImage(sc, 9 * S * sin(e.t * 13), y0); g.fillStyle = 'rgba(255,255,255,0.12)'; for (let k = 0; k < 6; k++) g.fillRect(XY.hash(k, Math.floor(e.t * 30)) * cv.width, y0 + XY.hash(k, 9) * bh, 40 * S, 1.5 * S); }
      g.fillStyle = g.createPattern(sl, 'repeat'); g.fillRect(0, 0, cv.width, cv.height);
    },
  };
})();
