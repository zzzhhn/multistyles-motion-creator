// 《二十四节气》Art Lock · core: namespace, deterministic math, noise, offscreen layers.
// Every style draws in DESIGN space 1920×1080; the harness pre-scales the context.
// Rule: no Math.random / Date / performance in drawing. Use JQ.hash / JQ.rng / JQ.noise.
(function () {
  const JQ = window.JQ = window.JQ || {};
  JQ.W = 1920; JQ.H = 1080;
  JQ.ART = JQ.ART || {};                       // JQ.ART[n] = { key, title, moment, draw(g, t, S) }

  // ---------------------------------------------------------------- math
  JQ.clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
  JQ.lerp = (a, b, k) => a + (b - a) * k;
  JQ.smooth = (a, b, x) => { const k = JQ.clamp((x - a) / (b - a)); return k * k * (3 - 2 * k); };
  JQ.ease = k => (k = JQ.clamp(k), k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2);
  JQ.mix = (c1, c2, k) => {                     // mix two '#rrggbb' colors
    const p = c => [1, 3, 5].map(i => parseInt(c.slice(i, i + 2), 16));
    const a = p(c1), b = p(c2);
    return 'rgb(' + a.map((v, i) => Math.round(v + (b[i] - v) * k)).join(',') + ')';
  };
  JQ.rgba = (hex, a) => { const v = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16)); return `rgba(${v[0]},${v[1]},${v[2]},${a})`; };

  // ---------------------------------------------------------------- deterministic randomness
  JQ.hash = (a, b = 0, c = 0) => {             // integers (or floats) → [0,1)
    let h = (Math.imul(a | 0, 374761393) + Math.imul(b | 0, 668265263) + Math.imul(c | 0, 2147483647)) | 0;
    h = Math.imul(h ^ (h >>> 13), 1274126177); h ^= h >>> 16;
    return (h >>> 0) / 4294967296;
  };
  JQ.rng = seed => {                            // mulberry32
    let s = (seed | 0) || 1;
    return () => { s = (s + 0x6D2B79F5) | 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  };
  JQ.noise = (x, y = 0, seed = 0) => {          // smooth value noise in [0,1)
    const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
    const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
    const h = (i, j) => JQ.hash(xi + i, yi + j, seed);
    return JQ.lerp(JQ.lerp(h(0, 0), h(1, 0), u), JQ.lerp(h(0, 1), h(1, 1), u), v);
  };
  JQ.fbm = (x, y, seed = 0, oct = 4) => { let s = 0, a = 0.5, f = 1, n = 0; for (let i = 0; i < oct; i++) { s += a * JQ.noise(x * f, y * f, seed + i * 17); n += a; a *= 0.5; f *= 2; } return s / n; };

  // ---------------------------------------------------------------- offscreen layers
  // JQ.layer(name, S) → { c, g } sized to the current render scale, context pre-scaled to design space, cleared.
  const layers = {};
  JQ.layer = (name, S, opts = {}) => {
    const w = Math.round(JQ.W * S.scale * (opts.res || 1)), h = Math.round(JQ.H * S.scale * (opts.res || 1));
    const k = name + ':' + w + 'x' + h;
    let L = layers[k];
    if (!L) { const c = document.createElement('canvas'); c.width = w; c.height = h; L = layers[k] = { c, g: c.getContext('2d', { willReadFrequently: !!opts.read }) }; }
    L.g.setTransform(1, 0, 0, 1, 0, 0); L.g.clearRect(0, 0, w, h);
    L.g.setTransform(w / JQ.W, 0, 0, h / JQ.H, 0, 0);
    return L;
  };
  // draw a layer back onto the (pre-scaled) target in design space
  JQ.blit = (g, L) => g.drawImage(L.c, 0, 0, JQ.W, JQ.H);

  // cache for static work (backgrounds, patterns) keyed per scale
  const cache = {};
  JQ.cached = (name, S, build) => {
    const k = name + '@' + S.scale;
    if (!cache[k]) { const L = JQ.layer('cache:' + k, S, {}); build(L.g, S); cache[k] = L; }
    return cache[k];
  };

  // ---------------------------------------------------------------- text helper
  // vertical text (top to bottom), one glyph per step
  JQ.vtext = (g, str, x, y, step) => { [...str].forEach((ch, i) => g.fillText(ch, x, y + i * step)); };
})();
