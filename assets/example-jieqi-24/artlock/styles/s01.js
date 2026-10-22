// s01 立春 · 南通蓝印花布 (Nantong blue calico). Indigo and cotton white only; every white mark is made of dots and
// short broken strokes, because an oiled-paper stencil must hold together (点线构成, 断刀). Coarse hand-woven cotton.
// Moment: 鱼陟负冰 — fish rise under the thawing pond, each carrying a plate of thin ice; the child takes one.
// 东风解冻 runs as dotted 如意 cloud-heads drifting across the sky.
(function () {
  const JQ = window.JQ;
  const IND = '#1B3253', IND2 = '#243F66', WHITE = '#EDE9DE', SOOT = '#101C2E';
  const PEN = { skin: '#EDE9DE', hair: IND, coat: WHITE, pants: IND, ox: WHITE, oxDark: IND, horn: WHITE, eye: IND, hat: WHITE, line: IND, lw: 3.2, outline: true };
  const clip = (g, path, fn) => { g.save(); g.clip(path); fn(); g.restore(); };
  // a broken stencil line: short strokes with gaps (断刀)
  const cut = (g, path, w, col, dash = 12, gap = 7) => { g.save(); g.strokeStyle = col; g.lineWidth = w; g.lineCap = 'round'; g.setLineDash([dash, gap]); g.stroke(path); g.restore(); };
  // dotted line along points
  const dots = (g, pts, step, r, col) => {
    g.fillStyle = col; let acc = 0;
    for (let i = 1; i < pts.length; i++) { const [x0, y0] = pts[i - 1], [x1, y1] = pts[i], d = Math.hypot(x1 - x0, y1 - y0); for (let s = (step - acc) % step; s < d; s += step) { const k = s / d; g.beginPath(); g.arc(x0 + (x1 - x0) * k, y0 + (y1 - y0) * k, r, 0, 6.2832); g.fill(); } acc = (acc + d) % step; }
  };
  // a small motif field: 'coin' (铜钱, dotted ring with a square hole), 'flower' (four dot petals), 'dot'
  const field = (g, kind, step, col, x0, y0, x1, y1, seed) => {
    g.fillStyle = col; g.strokeStyle = col;
    for (let y = y0, r = 0; y < y1; y += step, r++) for (let x = x0 + (r % 2) * step / 2; x < x1; x += step) {
      if (JQ.hash(x | 0, y | 0, seed) < 0.08) continue;
      if (kind === 'coin') { for (let k = 0; k < 10; k++) { const a = k / 10 * 6.2832; g.beginPath(); g.arc(x + Math.cos(a) * step * 0.26, y + Math.sin(a) * step * 0.26, step * 0.045, 0, 6.2832); g.fill(); } g.fillRect(x - step * 0.07, y - step * 0.07, step * 0.14, step * 0.14); }
      else if (kind === 'flower') { for (let k = 0; k < 4; k++) { const a = k * Math.PI / 2 + 0.785; g.beginPath(); g.ellipse(x + Math.cos(a) * step * 0.13, y + Math.sin(a) * step * 0.13, step * 0.09, step * 0.05, a, 0, 6.2832); g.fill(); } g.beginPath(); g.arc(x, y, step * 0.04, 0, 6.2832); g.fill(); }
      else { g.beginPath(); g.arc(x, y, step * 0.12, 0, 6.2832); g.fill(); }
    }
  };
  // a 如意 cloud head in dots and broken strokes
  const cloud = (g, x, y, r, col) => {
    g.save(); g.translate(x, y);
    const p = new Path2D(); p.arc(0, 0, r, Math.PI * 0.95, Math.PI * 2.05); p.arc(r * 1.25, r * 0.2, r * 0.55, Math.PI, Math.PI * 2.2); p.arc(-r * 1.25, r * 0.2, r * 0.55, Math.PI * 0.8, Math.PI * 2);
    cut(g, p, 6, col, 14, 8);
    g.fillStyle = col; [[0, -r * 0.35], [-r * 0.4, -r * 0.1], [r * 0.4, -r * 0.1]].forEach(([u, v]) => { g.beginPath(); g.arc(u, v, 5, 0, 6.2832); g.fill(); });
    const tail = new Path2D(); tail.moveTo(r * 1.7, r * 0.3); tail.bezierCurveTo(r * 3, r * 0.5, r * 4, -r * 0.1, r * 5.2, r * 0.2); cut(g, tail, 5, col, 18, 9);
    g.restore();
  };
  // a carp in white with dot scales and broken-stroke outline; head to the right, ~150*s long
  const fish = (g, x, y, s, wig, ground) => {
    g.save(); g.translate(x, y); g.scale(s, s); g.rotate(-0.18 + wig * 0.08);
    const body = new Path2D(); body.moveTo(78, 0); body.bezierCurveTo(60, -30, -10, -34, -50, -10); body.lineTo(-74, -26 + wig * 6); body.lineTo(-66, 0); body.lineTo(-74, 26 + wig * 6); body.lineTo(-50, 10); body.bezierCurveTo(-10, 34, 60, 30, 78, 0); body.closePath();
    g.fillStyle = WHITE; g.fill(body);
    g.save(); g.clip(body); g.fillStyle = ground; for (let i = 0; i < 6; i++) for (let j = -1; j <= 1; j++) { g.beginPath(); g.arc(-34 + i * 16 + (j & 1) * 8, j * 12, 3.4, 0, 6.2832); g.fill(); } g.restore();
    cut(g, body, 3.2, ground, 9, 5);
    g.fillStyle = ground; g.beginPath(); g.arc(56, -6, 5, 0, 6.2832); g.fill();
    g.restore();
  };
  // a thin ice plate: white irregular patch with a broken crack line
  const ice = (g, x, y, w, seed, a) => {
    const R = JQ.rng(seed), pts = Array.from({ length: 9 }, (_, i) => { const t = i / 9 * 6.2832; return [x + Math.cos(t) * w * (0.8 + R() * 0.3), y + Math.sin(t) * w * 0.3 * (0.8 + R() * 0.3)]; });
    g.save(); g.globalAlpha = a; g.fillStyle = WHITE; g.fill(JQ.P(pts));
    cut(g, JQ.open([[x - w * 0.5, y - 2], [x - w * 0.1, y + 4], [x + w * 0.2, y - 5], [x + w * 0.55, y + 2]]), 3, IND, 8, 5); g.restore();
  };
  JQ._s01 = { IND, IND2, WHITE, SOOT, PEN, clip, cut, dots, field, cloud, fish, ice };
})();
(function () {
  const JQ = window.JQ, S = JQ.SCENE, L = JQ.L, K = JQ._s01;
  const { IND, IND2, WHITE, SOOT, clip, cut, dots, field } = K;
  const BUR = [1336, 1008], BAR = 8 / 3, IMP = 2 * BAR + 4 / 3;
  const FISH = [[816, 872, 1.42], [1030, 926, 1.55], [1192, 852, 1.3]];
  const fret = (g, x0, y0, len, horiz, s, col) => {        // 回纹 key-fret band in broken strokes
    const p = new Path2D();
    for (let i = 0; i * s * 2 < len; i++) { const o = i * s * 2; const q = horiz ? (u, v) => [x0 + o + u * s, y0 + v * s] : (u, v) => [x0 + v * s, y0 + o + u * s];
      [[0, 1], [0, 0], [1.6, 0], [1.6, 0.7], [0.6, 0.7], [0.6, 0.35], [1.1, 0.35]].forEach(([u, v], j) => { const [x, y] = q(u, v); j ? p.lineTo(x, y) : p.moveTo(x, y); }); }
    cut(g, p, 4, col, 10, 5);
  };
  const back = (g, Sx) => {
    g.fillStyle = WHITE; g.fillRect(0, 0, JQ.W, JQ.H);
    field(g, 'dot', 46, JQ.rgba(IND, 0.55), 60, 70, 1600, 220, 2);
    g.fillStyle = IND; g.fill(S.mountains.path); clip(g, S.mountains.path, () => field(g, 'flower', 40, WHITE, 0, 250, 1920, 440, 3));
    dots(g, S.ridge.pts, 16, 4, IND);
    g.fillStyle = IND; g.fill(S.hills.path); dots(g, S.hills.pts.slice(0, -2), 14, 3.4, WHITE);
    g.fillStyle = IND; g.fill(S.ground.path); clip(g, S.ground.path, () => field(g, 'coin', 66, WHITE, 0, 560, 1920, 1080, 7));
    g.fillStyle = WHITE; g.fill(S.field.path); S.furrows.forEach(f => cut(g, f.path, 5, IND, 16, 9));
    clip(g, S.field.path, () => { g.fillStyle = IND; for (let i = 0; i < 300; i++) { const x = JQ.hash(i, 1, 9) * 1920, y = 440 + JQ.hash(i, 2, 9) * 250; g.beginPath(); g.arc(x, y, 3, 0, 6.2832); g.fill(); g.beginPath(); g.arc(x + 7, y - 5, 2.4, 0, 6.2832); g.fill(); } });
    g.fillStyle = WHITE; g.fill(S.path.path); clip(g, S.path.path, () => field(g, 'dot', 22, IND, 1380, 800, 1700, 1080, 11));
    g.fillStyle = IND; g.fill(S.stream.path); cut(g, JQ.open(S.stream.center), 4, WHITE, 10, 8);
    g.fillStyle = WHITE; g.fill(S.pondRim.path); dots(g, S.pondRim.pts.concat([S.pondRim.pts[0]]), 15, 3.5, IND);
    g.fillStyle = IND; g.fill(S.pond.path);
    clip(g, S.pond.path, () => { g.fillStyle = JQ.rgba(WHITE, 0.4); for (let y = 806; y < 980; y += 44) for (let x = 660 + ((y / 44) % 2) * 45; x < 1320; x += 90) for (let k = 0; k < 5; k++) { const a = Math.PI + k / 4 * Math.PI; g.beginPath(); g.arc(x + Math.cos(a) * 18, y + Math.sin(a) * 9, 2.6, 0, 6.2832); g.fill(); } });
    g.fillStyle = WHITE; g.fill(S.bridge.path); cut(g, S.bridge.path, 4.5, IND, 12, 6); dots(g, S.bridgeArch.pts, 12, 3, IND);
    g.fillStyle = IND; g.fill(S.roof.path); S.roofLines.forEach(r => cut(g, r.path, 3, WHITE, 8, 6));
    g.fillStyle = WHITE; g.fill(S.houseFront.path); g.fillStyle = IND; g.fill(S.window.path); g.fill(S.chimney.path);
    g.fillStyle = WHITE; g.fill(S.wall.path); g.fillStyle = IND; g.fillRect(1440, 738, 480, 74); fret(g, 1452, 752, 470, true, 24, WHITE);
    g.fillStyle = IND; g.fill(S.wallCap.path); g.fill(S.gate.path); g.fill(S.gateRoof.path); cut(g, S.gate.path, 3, WHITE, 8, 6); cut(g, S.gateRoof.path, 3, WHITE, 8, 6);
    g.strokeStyle = IND; JQ.drawBranches(g, 5, 0.85);
    g.fillStyle = IND; g.fill(S.trunk.path); clip(g, S.trunk.path, () => { for (let i = 0; i < 5; i++) cut(g, JQ.open([[444 + i * 11, 830], [472 + i * 7, 480]]), 3, WHITE, 14, 10); });
    S.tips.forEach(([x, y], i) => { if (JQ.hash(i, 3, 1) < 0.22) { g.fillStyle = IND; g.beginPath(); g.arc(x, y, 5.5, 0, 6.2832); g.fill(); g.fillStyle = WHITE; g.beginPath(); g.arc(x, y, 2, 0, 6.2832); g.fill(); } });
    // border: indigo band with a white broken key-fret, a dotted inner line
    g.fillStyle = IND; g.fillRect(0, 0, 1920, 46); g.fillRect(0, 1034, 1920, 46); g.fillRect(0, 0, 46, 1080); g.fillRect(1874, 0, 46, 1080);
    fret(g, 12, 12, 1900, true, 13, WHITE); fret(g, 12, 1046, 1900, true, 13, WHITE); fret(g, 12, 60, 960, false, 13, WHITE); fret(g, 1886, 60, 960, false, 13, WHITE);
    dots(g, [[54, 54], [1866, 54], [1866, 1026], [54, 1026], [54, 54]], 14, 2.6, IND);
    // title block: white Song letters on indigo, a dotted 方胜 below
    g.fillStyle = IND; g.fillRect(1646, 70, 204, 336);
    g.fillStyle = WHITE; g.font = '700 118px "Songti SC", "STSong", serif'; g.textAlign = 'center'; g.textBaseline = 'top';
    JQ.vtext(g, '立春', 1786, 90, 126);                    // the pentad line is drawn per bar (houText)
    dots(g, [[1660, 82], [1838, 82], [1838, 394], [1660, 394], [1660, 82]], 12, 2.6, WHITE);
    const fs = (cx, cy, r) => dots(g, [[cx, cy - r], [cx + r, cy], [cx, cy + r], [cx - r, cy], [cx, cy - r]], 9, 2.6, WHITE);
    fs(1678, 352, 20); fs(1700, 352, 20);
    // hand-woven cotton: weave, slubs, uneven indigo uptake
    g.globalAlpha = 0.07; g.fillStyle = SOOT; for (let y = 0; y < 1080; y += 3) g.fillRect(0, y, 1920, 1); for (let x = 0; x < 1920; x += 3) g.fillRect(x, 0, 1, 1080); g.globalAlpha = 1;
    g.fillStyle = 'rgba(255,255,255,0.10)'; for (let i = 0; i < 900; i++) { const x = JQ.hash(i, 5, 31) * 1920, y = JQ.hash(i, 6, 31) * 1080; g.fillRect(x, y, 14 + JQ.hash(i, 7, 31) * 40, 2); }
    const n = document.createElement('canvas'); n.width = 192; n.height = 108; const ng = n.getContext('2d'), im = ng.createImageData(192, 108);
    for (let y = 0; y < 108; y++) for (let x = 0; x < 192; x++) { const v = JQ.fbm(x * 0.07, y * 0.07, 41, 4), o = (y * 192 + x) * 4; im.data[o] = 27; im.data[o + 1] = 50; im.data[o + 2] = 83; im.data[o + 3] = Math.max(0, (v - 0.52)) * 120; }
    ng.putImageData(im, 0, 0); g.imageSmoothingEnabled = true; g.drawImage(n, 0, 0, 1920, 1080);
  };
  // the family in calico: a white resist halo round every figure (so it reads on indigo ground and on the white wall),
  // indigo cloth with white flowers for both people, broken stencil outlines, and a motif printed into the big pieces. Calico has no red, so the
  // spring-ox cloth is white with indigo dots.
  const PAL = { skin: WHITE, hair: IND, coat: IND, pants: IND, apron: WHITE, scarf: IND, hat: WHITE, straw: WHITE, cape: WHITE, eye: IND,
    ox: WHITE, oxDark: IND, horn: WHITE, calf: WHITE, calfDark: IND, prop: IND, metal: IND, red: WHITE, line: IND };
  const MOTIF = { coat: ['flower', 22], apron: ['dot', 14], scarf: ['dot', 12], ox: ['coin', 40], calf: ['dot', 20], red: ['dot', 9] };
  const bbox = pts => { let a = 1e9, b = 1e9, c = -1e9, d = -1e9; for (const [x, y] of pts) { a = Math.min(a, x); b = Math.min(b, y); c = Math.max(c, x); d = Math.max(d, y); } return [a, b, c, d]; };
  const drawItem = (g, it) => {
        g.save(); if (it.alpha != null && it.alpha < 1) g.globalAlpha = it.alpha;
    g.strokeStyle = WHITE; g.lineJoin = 'round'; g.lineWidth = it.kind === 'actor' ? 9 : 6;
    for (const p of it.parts) if (p.role !== 'eye') g.stroke(p.path);
    for (const p of it.parts) {
      let col = PAL[p.role]; if (!col) col = JQ.roleColor(PAL, p.role) || IND;
      g.fillStyle = col; g.fill(p.path); if (p.role === 'eye') continue;
      const m = MOTIF[p.role];
      if (m && p.pts.length > 3) { const [a, b, c, d] = bbox(p.pts); if (c - a > 14) clip(g, p.path, () => field(g, m[0], m[1], col === IND ? WHITE : IND, a - m[1], b - m[1], c + m[1], d + m[1], 19 + m[1])); }
      if (p.role !== 'line') cut(g, p.path, 2.8, col === IND ? WHITE : IND, 9, 4);
    }
    g.restore();
  };
  const castDraw = (g, C) => { for (const it of C.items) drawItem(g, it); };
  const HOU = JQ.TERMS[0].hou, RING = S.pond.pts.map(([x, y]) => [990 + (x - 990) * 0.9, 880 + (y - 880) * 0.86]);
  const partial = (pts, u) => { const n = pts.length - 1, f = JQ.clamp(u) * n, i = Math.floor(f), out = pts.slice(0, i + 1); if (i < n) out.push([JQ.lerp(pts[i][0], pts[i + 1][0], f - i), JQ.lerp(pts[i][1], pts[i + 1][1], f - i)]); return out; };
  // 东风解冻: cracks run from the east bank westward, then branch; [points, start, end]
  const CRACKS = (() => {
    const out = [];
    [[1292, 864], [1284, 904], [1236, 942]].forEach(([x, y], k) => {
      const R = JQ.rng(300 + k), pts = [[x, y]]; let cx = x, cy = y;
      for (let i = 0; i < 9; i++) { cx -= 52 + R() * 26; cy += (R() - 0.5) * 30 + (878 - cy) * 0.14; pts.push([cx, cy]); }
      const t0 = 0.95 + k * 0.08; out.push([pts, t0, t0 + 0.65]);
      [3, 6].forEach((j, m) => { const [bx, by] = pts[j], sg = (k + m) % 2 ? 1 : -1, br = [[bx, by]]; for (let i = 1; i <= 3; i++) br.push([bx - i * 22, by + sg * i * 16 + (R() - 0.5) * 8]); out.push([br, t0 + 0.65 * j / 9, t0 + 0.65 * j / 9 + 0.3]); });
    });
    return out;
  })();
  const PLATES = [[950, 820, 56], [1120, 952, 50], [880, 950, 46], [1268, 912, 40], [740, 900, 40]];
  const ellPts = (x, y, rx, ry) => Array.from({ length: 41 }, (_, j) => [x + Math.cos(j / 40 * 6.2832) * rx, y + Math.sin(j / 40 * 6.2832) * ry]);
  const houText = (g, t) => {
    const h = Math.min(2, Math.floor(t / BAR)), rv = h ? JQ.smooth(h * BAR, h * BAR + 0.45, t) : 1, y1 = 86 + rv * 214;
    g.save(); g.beginPath(); g.rect(1660, 80, 64, y1 - 80); g.clip();
    g.fillStyle = WHITE; g.font = '600 44px "Songti SC", "STSong", serif'; g.textAlign = 'center'; g.textBaseline = 'top'; JQ.vtext(g, HOU[h], 1690, 96, 50);
    g.restore();
    if (rv < 1) dots(g, [[1666, y1], [1716, y1]], 9, 2.4, WHITE);        // the paste being scraped off, line by line
  };
  // 东风: dotted gusts from the east (right) across the sky
  const wind = (g, t) => {
    g.save(); g.beginPath(); g.rect(50, 50, 1590, 360); g.clip();
    for (let i = 0; i < 4; i++) {
      const h = (t - 0.1 - i * 0.2) / 1.4; if (h <= 0 || h > 1.45) continue;
      const y0 = [150, 214, 112, 262][i], pts = [];
      for (let s = Math.max(0, h - 0.42); s < Math.min(1, h); s += 0.006) pts.push([1640 - s * 1560, y0 + Math.sin(s * 8 + i * 1.7) * 24 + s * 30]);
      if (pts.length > 1) { dots(g, pts, 14, 3.8, IND); const [ex, ey] = pts[pts.length - 1]; g.fillStyle = IND; g.beginPath(); g.arc(ex, ey, 6, 0, 6.2832); g.fill(); }
    }
    g.restore();
  };
  // the frozen pond: one white sheet with ice-flower marks; cracks open into indigo water, leaving floating plates
  const sheet = (g, t, thaw) => {
    const a = 1 - thaw; if (a <= 0.01) return;
    g.save(); g.globalAlpha = a; g.fillStyle = WHITE; g.fill(S.pond.path);
    clip(g, S.pond.path, () => field(g, 'flower', 46, JQ.rgba(IND, 0.5), 690, 796, 1300, 980, 5));
    dots(g, RING, 15, 3, IND);
    CRACKS.forEach(([pts, t0, t1]) => { const u = (t - t0) / (t1 - t0); if (u > 0) cut(g, JQ.open(partial(pts, u)), 5 + thaw * 22, IND, 12 + thaw * 40, 7 * (1 - thaw)); });
    g.restore();
  };
  // 蛰虫始振: a dotted burrow by the child's feet; the curled grub inside stirs on four pulses
  const burrow = (g, t) => {
    const on = JQ.smooth(BAR, BAR + 0.3, t); if (on <= 0) return;
    const [x, y] = BUR, pulse = [3.05, 3.6, 4.15, 4.7, 6.2].reduce((s, t0) => s + Math.exp(-Math.pow((t - t0) / 0.11, 2)), 0) * (t < 5.333 ? 1 : 0.4);
    g.save(); g.globalAlpha = on;
    g.fillStyle = IND; g.beginPath(); g.ellipse(x, y, 68, 34, 0, 0, 6.2832); g.fill();
    dots(g, ellPts(x, y - pulse * 2, 68, 34), 13, 3.6, WHITE); dots(g, ellPts(x, y, 56, 25), 11, 2.2, WHITE);
    const curl = Math.PI * (1.6 - 0.75 * Math.min(1, pulse)), a0 = 2.4 - curl / 2;
    for (let i = 0; i < 9; i++) { const a = a0 + i / 8 * curl, r = 9 - i * 0.6; g.fillStyle = WHITE; g.beginPath(); g.arc(x + Math.cos(a) * 26, y + Math.sin(a) * 15, r, 0, 6.2832); g.fill(); }
    const hx = x + Math.cos(a0) * 26, hy = y + Math.sin(a0) * 15; g.fillStyle = IND; g.beginPath(); g.arc(hx - 2, hy - 2, 2.2, 0, 6.2832); g.fill();
    if (pulse > 0.08) { g.globalAlpha = on * Math.min(1, pulse); [92, 118].forEach((r, k) => dots(g, Array.from({ length: 13 }, (_, j) => [x + Math.cos(Math.PI * (1.15 + j / 12 * 0.7)) * r, y - 6 + Math.sin(Math.PI * (1.15 + j / 12 * 0.7)) * r * 0.5]), 12, 3.2 - k, WHITE)); }
    g.restore();
  };
  // 鱼陟负冰: the fish come up under the plates and break the surface together at IMP, each with its plate on its back
  const riseOf = (t, i) => { if (t >= IMP) return 1 + Math.sin((t - IMP) * 7 + i) * 0.06 * Math.exp(-(t - IMP) * 1.5); const t0 = 5.45 + i * 0.12, u = JQ.clamp((t - t0) / (IMP - t0)); return u * u; };
  JQ.ART[1] = { key: IMP, keyHou: JQ.TERMS[0].keyHou, focus: [[1000, 860], [BUR[0], BUR[1] - 20], [1040, 860]], frame: true, draw(g, t, Sx) {
    t = JQ.clamp(t, 0, 9);
    JQ.blit(g, JQ.cached('s01-back-v3', Sx, back));
    houText(g, t);
    g.save(); g.beginPath(); g.rect(50, 50, 1590, 360); g.clip();
    for (let i = 0; i < 3; i++) { const x = ((1960 - t * 110 - i * 640) % 2100 + 2100) % 2100 - 120, y = 150 + (i % 2) * 90 + Math.sin(t * 1.6 + i) * 8; K.cloud(g, x, y, 34 + (i % 2) * 6, IND); }
    g.restore();
    wind(g, t);
    const C = JQ.castFor(Sx, t), kidIt = C.items.find(it => it.who === 'kid' && it.kind === 'actor');
    const thaw = JQ.smooth(1.7, 2.3, t), take = JQ.smooth(7.0, 7.5, t), HF = 2;            // the child, at the pond from 6.6 s, takes the third fish's plate
    const hj = kidIt && kidIt.parts.joints && kidIt.parts.joints.hand, hand = hj ? [hj[0], hj[1] - 6] : [1170, 840];
    clip(g, S.pond.path, () => {
      FISH.forEach(([x, y, s], i) => {
        const r = JQ.clamp(riseOf(t, i)), wig = Math.sin(t * 5 + i * 2);
        if (r > 0.02) for (let k = 0; k < 2; k++) { const rr = 80 + ((t * 40 + k * 40 + i * 20) % 80); g.globalAlpha = r; dots(g, ellPts(x, y + 14, rr, rr * 0.28), 13, 2.6, WHITE); g.globalAlpha = 1; }
        if (t >= IMP && t < IMP + 1) { const u = (t - IMP), rr = 50 + u * 230; g.globalAlpha = 1 - u; dots(g, ellPts(x, y + 10, rr, rr * 0.3), 12, 3.4, WHITE); g.globalAlpha = 1; }
        g.globalAlpha = 0.85 * (1 - r); g.fillStyle = IND2; g.beginPath(); g.ellipse(x, y + 12, 76 * s, 22 * s, -0.15, 0, 6.2832); g.fill(); g.globalAlpha = 1;
        if (r > 0.02) { g.save(); g.beginPath(); g.rect(x - 190, y - 190, 380, 198); g.clip(); K.fish(g, x, y + 32 - riseOf(t, i) * 36, s * (0.72 + 0.28 * r), wig, IND); g.restore(); dots(g, [[x - 96 * s, y + 8], [x + 96 * s, y + 8]], 12, 3, WHITE); }
      });
    });
    PLATES.forEach(([x, y, w], i) => K.ice(g, x + Math.sin(t * 0.7 + i) * 4 - thaw * (i % 2 ? 6 : -6), y + Math.sin(t * 1.3 + i * 2) * 2, w, 90 + i, 1));
    FISH.forEach(([x, y, s], i) => {
      let px = x - 4, py = y - 8 - 42 * s + (1 - riseOf(t, i)) * 34;
      if (i === HF && take > 0) { if (take > 0.98) return; px = JQ.lerp(px, hand[0], take); py = JQ.lerp(py, hand[1], take) - Math.sin(take * Math.PI) * 40; }
      K.ice(g, px, py, 48 * s * (i === HF ? 1 - take * 0.25 : 1), 70 + i, 1);
    });
    if (t >= IMP && t < IMP + 0.6) FISH.forEach(([x, y], i) => { const u = t - IMP; for (let k = 0; k < 9; k++) { const a = Math.PI * (0.15 + k / 8 * 0.7), v = 260 + JQ.hash(i, k, 3) * 160; g.globalAlpha = 1 - u / 0.6; g.fillStyle = WHITE; g.beginPath(); g.arc(x + Math.cos(a) * v * u, y - 20 - Math.sin(a) * v * u + 700 * u * u, 4.5, 0, 6.2832); g.fill(); } g.globalAlpha = 1; });
    sheet(g, t, thaw);
    burrow(g, t);
    castDraw(g, C);
    if (take > 0.98) K.ice(g, hand[0], hand[1], 48 * FISH[HF][2] * 0.75, 70 + HF, 1);
  } };
})();
