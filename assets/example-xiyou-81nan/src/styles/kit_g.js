// kit_g.js — shared helpers for team G's cells (55–63: mid-century print, film and screen). Namespace: XY.KIT_G
// Everything is a pure function of its arguments (patterns and tiles are cached by key).
(() => {
  'use strict';
  const XY = window.XY, TAU = XY.TAU;
  const K = XY.KIT_G = {};
  const pc = document.createElement('canvas').getContext('2d');   // any context can mint patterns
  const pats = new Map();

  // ---------------------------------------------------------------- timing
  K.hit = (beat, b, dur = 0.5) => (beat < b ? 0 : Math.exp(-(beat - b) / dur));          // spike on a beat, decays
  K.ramp = (beat, b, len = 0.25) => XY.clamp((beat - b) / len);                            // 0 → 1 starting on a beat
  K.win = (u, a, b, f = 0.05) => XY.smooth((u - a) / f) * (1 - XY.smooth((u - b) / f));    // 1 inside [a, b]
  K.step = (t, fps = 12) => Math.floor(t * fps);                                            // integer time for jitter seeds

  // ---------------------------------------------------------------- patterns
  // A tile painted at device resolution, used as a design-unit pattern (rot in degrees). Pattern space follows the
  // context transform at fill time, so a pattern on a figure travels with that figure.
  K.pattern = (key, S, w, h, paint, rot = 0) => {
    const k = `kg:${key}:${S.toFixed(4)}:${rot}`;
    let p = pats.get(k); if (p) return p;
    const cv = XY.keep(k, Math.max(1, Math.round(w * S)), Math.max(1, Math.round(h * S)), cv => { const g = cv.getContext('2d'); g.scale(cv.width / w, cv.height / h); paint(g, w, h); });
    p = pc.createPattern(cv, 'repeat'); p.setTransform(new DOMMatrix().rotateSelf(rot).scaleSelf(w / cv.width, h / cv.height));
    pats.set(k, p); return p;
  };
  // Ben-Day dots on a 45° lattice: pitch p, radius r
  K.dots = (S, ink, paper, p, r, rot = 0) => K.pattern(`dots:${ink}:${paper}:${p}:${r}`, S, p, p, g => {
    if (paper) { g.fillStyle = paper; g.fillRect(0, 0, p, p); }
    g.fillStyle = ink; [[0, 0], [p, 0], [0, p], [p, p], [p / 2, p / 2]].forEach(([x, y]) => { g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill(); });
  }, rot);
  // parallel lines: period p, line width lw (rot 45 = diagonal hatching)
  K.lines = (S, ink, paper, p, lw, rot = 0) => K.pattern(`lines:${ink}:${paper}:${p}:${lw}`, S, 8, p, g => {
    if (paper) { g.fillStyle = paper; g.fillRect(0, 0, 8, p); }
    g.fillStyle = ink; g.fillRect(0, (p - lw) / 2, 8, lw);
  }, rot);
  // cross-hatch
  K.cross = (S, ink, paper, p, lw) => K.pattern(`cross:${ink}:${paper}:${p}:${lw}`, S, p, p, g => {
    if (paper) { g.fillStyle = paper; g.fillRect(0, 0, p, p); }
    g.strokeStyle = ink; g.lineWidth = lw; g.beginPath(); g.moveTo(-1, -1); g.lineTo(p + 1, p + 1); g.moveTo(-1, p + 1); g.lineTo(p + 1, -1); g.stroke();
  });
  // checkerboard
  K.checker = (S, a, b, p, rot = 0) => K.pattern(`chk:${a}:${b}:${p}`, S, 2 * p, 2 * p, g => {
    g.fillStyle = b; g.fillRect(0, 0, 2 * p, 2 * p); g.fillStyle = a; g.fillRect(0, 0, p, p); g.fillRect(p, p, p, p);
  }, rot);

  // Device-pixel noise tile (size×size) as a repeat pattern; fill it at identity transform with a per-frame offset.
  K.noiseTile = (key, size, paint) => {
    const k = `kg-noise:${key}`; let p = pats.get(k); if (p) return p;
    const cv = XY.keep(k, size, size, cv => { const g = cv.getContext('2d'), im = g.createImageData(size, size); paint(im.data, size); g.putImageData(im, 0, 0); });
    p = pc.createPattern(cv, 'repeat'); pats.set(k, p); return p;
  };
  // overlay a noise tile over the whole panel (device px), shifted per frame so it shimmers like grain
  K.grain = (g, e, tile, op, alpha, fps = 24) => {
    const f = Math.floor(e.t * fps), ox = Math.floor(XY.hash(f, 3) * 256), oy = Math.floor(XY.hash(f, 4) * 256);
    g.save(); g.setTransform(1, 0, 0, 1, 0, 0); tile.setTransform(new DOMMatrix().translateSelf(ox, oy));
    g.globalCompositeOperation = op; g.globalAlpha = alpha; g.fillStyle = tile; g.fillRect(0, 0, g.canvas.width, g.canvas.height); g.restore();
  };

  // ---------------------------------------------------------------- shapes
  // star burst: n points alternating r0 / r1 (with jitter), returns a flat point list
  K.burst = (cx, cy, r0, r1, n, seed = 0, rot = 0, jit = 0.25) => {
    const o = []; for (let k = 0; k < 2 * n; k++) { const a = rot + k / (2 * n) * TAU, r = (k % 2 ? r0 : r1) * (1 + jit * (XY.hash(k, seed) - 0.5)); o.push(cx + Math.cos(a) * r, cy + Math.sin(a) * r); }
    return o;
  };
  // filled + stroked path helper
  K.ink = (g, pts, fill, stroke, lw, closed = true) => { XY.path(g, pts, closed); if (fill) { g.fillStyle = fill; g.fill(); } if (stroke) { g.strokeStyle = stroke; g.lineWidth = lw; g.stroke(); } };
  // text with an optional outline and offset shadow (all in design units)
  K.text = (g, s, x, y, font, fill, o = {}) => {
    g.save(); g.font = font; g.textBaseline = o.base || 'alphabetic'; g.textAlign = o.align || 'left';
    if (o.shadow) { g.fillStyle = o.shadow; g.fillText(s, x + (o.sx || 6), y + (o.sy || 6)); if (o.slw) { g.strokeStyle = o.shadow; g.lineWidth = o.slw; g.lineJoin = 'round'; g.strokeText(s, x + (o.sx || 6), y + (o.sy || 6)); } }
    if (o.stroke) { g.strokeStyle = o.stroke; g.lineWidth = o.lw || 4; g.lineJoin = 'round'; g.strokeText(s, x, y); }
    if (fill) { g.fillStyle = fill; g.fillText(s, x, y); }
    g.restore();
  };

  // ---------------------------------------------------------------- procession
  const FIGX = { shaseng: -300, bajie: -150, monk: 40, wukong: 245 };
  // which pilgrim is being painted, read from the transform drawProcession sets per figure (outer transform = scale only)
  K.figOf = (ctx, ox) => { const m = ctx.getTransform(), x = m.e / m.a - ox; let best = 'wukong', d = 1e9; for (const n in FIGX) { const q = Math.abs(FIGX[n] - x); if (q < d) { d = q; best = n; } } return best; };
  // pen.part that skips whole figures (hidden: { bajie: true }) and otherwise defers to inner(ctx, part, col, id, fig)
  K.figPart = (ox, hidden, inner) => (ctx, p, c, id) => { const f = K.figOf(ctx, ox); if (hidden && hidden[f]) return true; return inner ? inner(ctx, p, c, id, f) : false; };
  // the procession painted into a device-resolution scratch layer (for masks, offsets, post effects)
  K.procLayer = (key, e, pen, acts, dx = 0, dy = 0) => {
    const S = e.S, cv = XY.scratch(key, Math.round(e.W * S), Math.round(e.H * S)), g = cv.getContext('2d');
    g.setTransform(S, 0, 0, S, 0, 0); XY.drawProcession(g, e.phase, e.procX + dx, e.groundY + dy, pen, acts); return cv;
  };
  K.SIL = c => ({ color: () => c });
  K.visible = e => e.procX + 330 > 0 && e.procX - 400 < e.W;
})();
