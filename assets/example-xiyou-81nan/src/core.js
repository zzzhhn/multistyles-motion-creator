// core.js — shared constants, seeded randomness, easing, timeline, camera and drawing helpers.
// Design space is 1920×1080; film.js scales it to the canvas (2560×1440 master, 1920×1080 fallback).
// Every value here is a pure function of time t (seconds) or of fixed seeds: no state, no Math.random.
(() => {
  'use strict';
  const XY = window.XY = {};
  XY.DW = 1920; XY.DH = 1080;
  XY.BPM = 90; XY.BEAT = 60 / XY.BPM;          // v10: 90 BPM, a cell = 2 bars (8 beats, 5.33 s) or 3 bars (12 beats, 8 s)
  XY.INTRO_BEATS = 12; XY.OUTRO_BEATS = 16;

  // ------------------------------------------------------------ math
  const clamp = XY.clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  XY.lerp = (a, b, u) => a + (b - a) * u;
  XY.smooth = u => { u = clamp(u); return u * u * (3 - 2 * u); };
  XY.easeIO = u => { u = clamp(u); return u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2; };
  XY.easeOut = u => 1 - Math.pow(1 - clamp(u), 3);
  XY.easeIn = u => Math.pow(clamp(u), 3);
  XY.TAU = Math.PI * 2;

  // ------------------------------------------------------------ seeded randomness
  const hash = XY.hash = (a, b = 0, c = 0) => {   // integer hash → [0,1)
    let h = (Math.imul(a | 0, 374761393) + Math.imul(b | 0, 668265263) + Math.imul(c | 0, 2147483647)) | 0;
    h = Math.imul(h ^ (h >>> 13), 1274126177); h ^= h >>> 16;
    return (h >>> 0) / 4294967296;
  };
  XY.rng = seed => { let s = (seed >>> 0) || 1; return () => { s = (s + 0x6D2B79F5) | 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; };
  XY.noise1 = (x, seed = 0) => { const i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f); return XY.lerp(hash(i, seed), hash(i + 1, seed), u) * 2 - 1; };
  XY.noise2 = (x, y, seed = 0) => {
    const i = Math.floor(x), j = Math.floor(y), fx = x - i, fy = y - j, ux = fx * fx * (3 - 2 * fx), uy = fy * fy * (3 - 2 * fy);
    const a = hash(i, j, seed), b = hash(i + 1, j, seed), c = hash(i, j + 1, seed), d = hash(i + 1, j + 1, seed);
    return (XY.lerp(XY.lerp(a, b, ux), XY.lerp(c, d, ux), uy)) * 2 - 1;
  };
  XY.fbm = (x, y, seed = 0, oct = 4) => { let s = 0, a = 0.5, f = 1; for (let o = 0; o < oct; o++) { s += a * XY.noise2(x * f, y * f, seed + o * 17); a *= 0.5; f *= 2; } return s; };

  // ------------------------------------------------------------ timeline
  // Cells are filled in by cells.js (XY.CELLS = [{ n, name, style, sub, beats }]).
  // Each cell's panel width is proportional to its beats, so the camera's average speed is the same in every cell.
  XY.LAYOUT = { PANEL_Y: 80, PANEL_H: 780, PER_BEAT: 236, GAP: 72, GROUND: 702, PROC_X: 960, EASE_A: 0.55, STRIDE: 128 };
  XY.buildTimeline = () => {
    const L = XY.LAYOUT; let x = 0, beat = XY.INTRO_BEATS;
    XY.CELLS.forEach((c, i) => {
      c.i = i; c.w = (c.size || c.beats) * L.PER_BEAT; c.x = x; x += c.w + L.GAP;   // width comes from size (5 → 1180, 6 → 1416), time from beats
      c.b0 = beat; c.t0 = beat * XY.BEAT; beat += c.beats; c.t1 = beat * XY.BEAT; c.dur = c.t1 - c.t0;
    });
    XY.SCROLL_T0 = XY.INTRO_BEATS * XY.BEAT;
    XY.SCROLL_T1 = beat * XY.BEAT;
    XY.DURATION = (beat + XY.OUTRO_BEATS) * XY.BEAT;
    XY.WORLD_W = x;
  };
  // seam k = centre of the gap just before cell k (k = CELLS.length is the gap after the last cell)
  XY.seamX = k => { const C = XY.CELLS, L = XY.LAYOUT; return k < C.length ? C[k].x - L.GAP / 2 : C[C.length - 1].x + C[C.length - 1].w + L.GAP / 2; };
  XY.cellAt = t => { const C = XY.CELLS; for (const c of C) if (t < c.t1) return c; return C[C.length - 1]; };
  // world x of the procession centre: crosses seam k exactly at cells[k].t0, fastest at seams, slowest mid-panel.
  // The first cell starts at rest in the middle of its panel (where the intro zoom lands) and accelerates into
  // the seam; the last cell decelerates to rest in the middle of its panel (where the outro zoom starts).
  XY.panelMid = c => c.x + c.w / 2;
  const seamSpeed = k => { const C = XY.CELLS, a = XY.LAYOUT.EASE_A, c = C[Math.min(k, C.length - 1)]; return (1 + a) * (XY.seamX(c.i + 1) - XY.seamX(c.i)) / c.dur; };
  const hermite = (p0, m0, p1, m1, u) => { const u2 = u * u, u3 = u2 * u; return (2 * u3 - 3 * u2 + 1) * p0 + (u3 - 2 * u2 + u) * m0 + (-2 * u3 + 3 * u2) * p1 + (u3 - u2) * m1; };
  XY.procWorldX = t => {
    const C = XY.CELLS, a = XY.LAYOUT.EASE_A, N = C.length;
    if (t <= XY.SCROLL_T0) return XY.panelMid(C[0]);
    if (t >= XY.SCROLL_T1) return XY.panelMid(C[N - 1]);
    const c = XY.cellAt(t), u = (t - c.t0) / c.dur;
    if (N > 1 && c.i === 0) { const p0 = XY.panelMid(c), p1 = XY.seamX(1); return hermite(p0, 0, p1, Math.min(seamSpeed(1) * c.dur, 3 * (p1 - p0)), u); }
    if (N > 1 && c.i === N - 1) { const p0 = XY.seamX(N - 1), p1 = XY.panelMid(c); return hermite(p0, Math.min(seamSpeed(N - 2) * c.dur, 3 * (p1 - p0)), p1, 0, u); }
    const s = u + a * Math.sin(XY.TAU * u) / XY.TAU;
    return XY.lerp(XY.seamX(c.i), XY.seamX(c.i + 1), s);
  };
  XY.camX = t => XY.procWorldX(t) - XY.LAYOUT.PROC_X;
  XY.walkPhase = t => (XY.procWorldX(t) - XY.seamX(0)) / XY.LAYOUT.STRIDE;

  // ------------------------------------------------------------ drawing helpers (design units)
  XY.ellipse = (cx, cy, rx, ry, n = 22, rot = 0) => {
    const p = []; const cr = Math.cos(rot), sr = Math.sin(rot);
    for (let k = 0; k < n; k++) { const a = k / n * XY.TAU, x = Math.cos(a) * rx, y = Math.sin(a) * ry; p.push(cx + x * cr - y * sr, cy + x * sr + y * cr); }
    return p;
  };
  // wobble a flat point list with low-frequency noise; amp in design px, seed keeps it frame-stable
  XY.wobble = (pts, amp, seed, freq = 0.035) => {
    if (!amp) return pts;
    const o = new Array(pts.length);
    for (let k = 0; k < pts.length; k += 2) { o[k] = pts[k] + amp * XY.noise2(pts[k] * freq, pts[k + 1] * freq, seed); o[k + 1] = pts[k + 1] + amp * XY.noise2(pts[k] * freq + 50, pts[k + 1] * freq + 50, seed + 1); }
    return o;
  };
  XY.path = (ctx, pts, closed) => {
    ctx.beginPath(); ctx.moveTo(pts[0], pts[1]);
    for (let k = 2; k < pts.length; k += 2) ctx.lineTo(pts[k], pts[k + 1]);
    if (closed) ctx.closePath();
  };
  // subdivide a polyline so wobble has points to bend
  XY.densify = (pts, step = 10, closed = false) => {
    const o = [], n = pts.length / 2, m = closed ? n : n - 1;
    for (let k = 0; k < m; k++) {
      const x0 = pts[2 * k], y0 = pts[2 * k + 1], k1 = (k + 1) % n, x1 = pts[2 * k1], y1 = pts[2 * k1 + 1];
      const d = Math.hypot(x1 - x0, y1 - y0), s = Math.max(1, Math.ceil(d / step));
      for (let j = 0; j < s; j++) o.push(x0 + (x1 - x0) * j / s, y0 + (y1 - y0) * j / s);
    }
    if (!closed) o.push(pts[pts.length - 2], pts[pts.length - 1]);
    return o;
  };
  XY.font = (px, family, weight = '') => `${weight} ${px}px ${family}`.trim();
  XY.cnFont = { song: '"Songti SC", "STSong", serif', kai: '"Kaiti SC", "STKaiti", serif', hei: '"PingFang SC", "Heiti SC", sans-serif',
    li: '"Libian SC", "Songti SC", serif', wei: '"Weibei SC", "Songti SC", serif', xing: '"Xingkai SC", "Kaiti SC", serif', yuan: '"Yuanti SC", "PingFang SC", sans-serif' };
  XY.roman = n => { const V = [[1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']]; let o = ''; for (const [v, r] of V) while (n >= v) { o += r; n -= v; } return o; };
  XY.cnNum = n => { const d = '〇一二三四五六七八九'; if (n < 10) return d[n]; if (n < 20) return '十' + (n % 10 ? d[n % 10] : ''); return d[Math.floor(n / 10)] + '十' + (n % 10 ? d[n % 10] : ''); };
})();
