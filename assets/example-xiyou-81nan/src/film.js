// film.js — composes a frame: paper wall, living panels, the procession sketched across the gaps, wall labels,
// the 9×9 overview that opens and closes the film. window.__renderAt(t) is pure in t.
(() => {
  'use strict';
  const XY = window.XY, L = XY.LAYOUT, C = XY.CELLS;
  const canvas = document.getElementById(window.__FILM_CANVAS || 'c'), ctx = canvas.getContext('2d');   // platform pages render the film off-screen
  const S = canvas.width / XY.DW;
  const INK = '#3A2E22', GOLD = '#C9A23A', RED = '#A8261C';

  const mk = (w, h) => { const c = document.createElement('canvas'); c.width = Math.max(1, Math.round(w)); c.height = Math.max(1, Math.round(h)); return c; };
  // Two caches: `cached` is an LRU for large per-cell layers (backgrounds at full scale, ≤ 3 panels are ever on screen);
  // `keep` never evicts and is for small or global things (thumbnails, atlases, vignette). Both are pure in their key.
  const lru = new Map(), kept = new Map();
  const cached = (key, w, h, paint) => {
    if (lru.has(key)) { const v = lru.get(key); lru.delete(key); lru.set(key, v); return v; }
    const c = mk(w, h); paint(c); lru.set(key, c);
    while (lru.size > 16) lru.delete(lru.keys().next().value);
    return c;
  };
  const keep = (key, w, h, paint) => { let c = kept.get(key); if (!c) { c = mk(w, h); paint(c); kept.set(key, c); } return c; };
  XY.cached = cached; XY.keep = keep; XY.mk = mk;
  // per-frame scratch canvases (device pixels), reused; contents are not preserved between calls
  const scratchPool = {};
  // opts.read: the caller will getImageData from it every frame — create it CPU-backed (willReadFrequently) from the start,
  // otherwise Chrome flips a GPU canvas to software after a few readbacks and the first frames anti-alias differently.
  XY.scratch = (key, w, h, opts) => { const rd = !!(opts && opts.read), k = `${key}:${Math.round(w)}x${Math.round(h)}${rd ? ':r' : ''}`;
    let c = scratchPool[k]; if (!c) { c = scratchPool[k] = mk(w, h); if (rd) c.getContext('2d', { willReadFrequently: true }); } const g = c.getContext('2d'); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over'; g.filter = 'none'; g.clearRect(0, 0, c.width, c.height); return c; };

  // ------------------------------------------------------------ panels
  const panelEnv = (c, t, scale) => ({ t, cell: c, lt: t - c.t0, u: (t - c.t0) / c.dur, beat: (t - c.t0) / XY.BEAT, W: c.w, H: L.PANEL_H,
    procX: XY.procWorldX(t) - c.x, groundY: L.GROUND, phase: XY.walkPhase(t), S: scale, seed: c.n * 7919,
    // procession-anchor → panel coordinates, e.g. e.at('monk.head', acts)
    at(key, acts) { const p = XY.anchor(key, this.phase, acts); return [this.procX + p[0], this.groundY + p[1]]; } });
  const styleOf = c => XY.STYLES[c.style] || XY.STYLES._missing;
  const bgFor = (c, scale) => { const st = styleOf(c); if (!st.bg) return null;
    return cached(`bg:${c.n}:${scale.toFixed(4)}`, c.w * scale, L.PANEL_H * scale, cv => { const g = cv.getContext('2d'); g.setTransform(scale, 0, 0, scale, 0, 0); st.bg(g, c.w, L.PANEL_H, c, scale); }); };
  const renderPanel = (c, t, scale, target) => {
    const g = target.getContext('2d'), st = styleOf(c);
    g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over'; g.filter = 'none';
    g.clearRect(0, 0, target.width, target.height);
    const env = panelEnv(c, t, scale);
    XY.CURRENT_CAST = XY.castAt(c.n);
    try {
      const bg = bgFor(c, scale); if (bg) g.drawImage(bg, 0, 0);
      g.setTransform(scale, 0, 0, scale, 0, 0);
      g.save(); st.draw(g, env); g.restore();
      if (st.post) { g.setTransform(1, 0, 0, 1, 0, 0); st.post(target, g, env); }
    } catch (err) {     // a broken cell must not take the frame down: log once, fall back to the placeholder panel
      if (!failed.has(c.style)) { failed.add(c.style); console.error(`cell ${c.n} (${c.style}) failed: ${err && err.message}`); }
      g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over'; g.filter = 'none'; g.clearRect(0, 0, target.width, target.height);
      g.setTransform(scale, 0, 0, scale, 0, 0); XY.STYLES._missing.draw(g, env);
    } finally { XY.CURRENT_CAST = null; }
    return target;
  };
  const pool = {}, failed = new Set();
  const work = (c, slot) => pool[`${c.w}:${slot}`] || (pool[`${c.w}:${slot}`] = mk(c.w * S, L.PANEL_H * S));

  XY.STYLES._missing = { draw(g, e) { g.fillStyle = '#D9D0BE'; g.fillRect(0, 0, e.W, e.H); g.fillStyle = '#8A7F6E'; g.font = XY.font(60, XY.cnFont.song, 'bold'); g.fillText(e.cell.name, 60, 140); } };

  // ------------------------------------------------------------ wall
  let wallPat = null;
  const wallPattern = () => {
    if (wallPat) return wallPat;
    const T = 512, cv = mk(T * S, T * S), g = cv.getContext('2d'), r = XY.rng(7);
    g.scale(S, S); g.fillStyle = '#ECE4D3'; g.fillRect(0, 0, T, T);
    for (let i = 0; i < 2200; i++) {
      const x = r() * T, y = r() * T, a = r() * Math.PI, l = 4 + r() * 14, light = r() < 0.45, lw = 0.5 + r() * 0.8;
      for (const dx of [-T, 0, T]) for (const dy of [-T, 0, T]) {
        g.strokeStyle = light ? 'rgba(255,252,240,0.35)' : 'rgba(110,88,58,0.07)'; g.lineWidth = lw;
        g.beginPath(); g.moveTo(x + dx, y + dy); g.lineTo(x + dx + Math.cos(a) * l, y + dy + Math.sin(a) * l); g.stroke();
      }
    }
    return (wallPat = ctx.createPattern(cv, 'repeat'));
  };
  const drawWall = camX => {
    const pat = wallPattern(), T = 512 * S;
    pat.setTransform(new DOMMatrix().translateSelf(-(((camX * S) % T) + T) % T, 0));
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = pat; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.setTransform(S, 0, 0, S, 0, 0);
    ctx.strokeStyle = GOLD; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(0, L.PANEL_Y + L.GROUND); ctx.lineTo(XY.DW, L.PANEL_Y + L.GROUND); ctx.stroke();
  };
  const vignette = () => keep('vignette', canvas.width, canvas.height, cv => {
    const g = cv.getContext('2d'), gr = g.createRadialGradient(cv.width / 2, cv.height / 2, cv.height * 0.35, cv.width / 2, cv.height / 2, cv.width * 0.62);
    gr.addColorStop(0, 'rgba(60,40,20,0)'); gr.addColorStop(1, 'rgba(60,40,20,0.16)'); g.fillStyle = gr; g.fillRect(0, 0, cv.width, cv.height);
  });

  const SKETCH = { color: r => (r === 'ink' ? INK : '#ECE4D3'), outline: INK, ow: 1.4, wob: 0.8, seed: 3 };
  const label = (c, sx) => {
    const y = L.PANEL_Y + L.PANEL_H + 46;
    ctx.textBaseline = 'alphabetic';
    ctx.font = XY.font(30, XY.cnFont.song, 'bold'); ctx.fillStyle = RED;
    const a = '第' + XY.cnNum(c.n) + '难'; ctx.fillText(a, sx, y);
    const wa = ctx.measureText(a).width; ctx.fillStyle = INK; ctx.fillText(c.name, sx + wa + 18, y);
    ctx.font = XY.font(21, XY.cnFont.kai); ctx.fillStyle = '#7A6E5E'; ctx.fillText(c.sub, sx, y + 36);
  };

  // the scrolling gallery at time t (also used underneath the intro/outro zooms)
  const drawGallery = t => {
    const camX = XY.camX(t);
    drawWall(camX);
    const vis = C.filter(c => c.x - camX < XY.DW + 40 && c.x + c.w - camX > -40);
    vis.forEach((c, slot) => {
      const sx = c.x - camX, cv = renderPanel(c, t, S, work(c, slot));
      ctx.setTransform(S, 0, 0, S, 0, 0);
      ctx.save(); ctx.shadowColor = 'rgba(48,32,14,0.30)'; ctx.shadowBlur = 26 * S; ctx.shadowOffsetY = 9 * S;
      ctx.fillStyle = '#000'; ctx.fillRect(sx, L.PANEL_Y, c.w, L.PANEL_H); ctx.restore();
      ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.drawImage(cv, Math.round(sx * S), Math.round(L.PANEL_Y * S));
      ctx.setTransform(S, 0, 0, S, 0, 0); label(c, sx);
    });
    // the procession on the bare wall between panels: an ink sketch
    const px = L.PROC_X, ex = XY.PROC_EXTENT, gy = L.PANEL_Y + L.GROUND;
    for (let k = 0; k <= C.length; k++) {
      const x0 = k === 0 ? -1e4 : C[k - 1].x + C[k - 1].w - camX, x1 = k === C.length ? 1e4 : C[k].x - camX;
      if (x1 < px + ex[0] || x0 > px + ex[1]) continue;
      ctx.setTransform(S, 0, 0, S, 0, 0); ctx.save(); ctx.beginPath(); ctx.rect(x0, 0, x1 - x0, XY.DH); ctx.clip();
      XY.CURRENT_CAST = XY.castAt(C[Math.min(k, C.length - 1)].n); XY.drawProcession(ctx, XY.walkPhase(t), px, gy, SKETCH); XY.CURRENT_CAST = null; ctx.restore();
    }
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.drawImage(vignette(), 0, 0);
    // downbeat punch (1.2 %, ~0.25 s) on every cell start, plus a push-in on each of the cell's declared hits:
    // XY.STYLES[style].hits = [cell-local beats]; the push grows over 0.12 s toward the panel's hit point and eases out over 0.7 s
    const cc = XY.cellAt(t), k = t - cc.t0, inScroll = t >= XY.SCROLL_T0 && t <= XY.SCROLL_T1;
    let pu = inScroll && k >= 0 ? 0.012 * Math.exp(-k / 0.09) : 0;
    const hs = (XY.STYLES[cc.style] && XY.STYLES[cc.style].hits) || [];
    if (inScroll) hs.forEach(hb => { const d = t - (cc.t0 + hb * XY.BEAT); if (d > -0.12 && d < 0.9) pu += 0.045 * (d < 0 ? XY.smooth((d + 0.12) / 0.12) : Math.exp(-d / 0.28)); });
    if (pu > 0.0005) { const cp = XY.scratch('punch', canvas.width, canvas.height); cp.getContext('2d').drawImage(canvas, 0, 0);
      ctx.setTransform(1, 0, 0, 1, 0, 0); const sc = 1 + pu, ox = canvas.width / 2, oy = (L.PANEL_Y + L.GROUND) * S;
      ctx.drawImage(cp, ox - ox * sc, oy - oy * sc, canvas.width * sc, canvas.height * sc); }
    drawRuler(t);
  };
  // the journey ruler: 81 ticks under the wall, five eras, a red marker that walks with the pilgrims and shows the year
  const ERAS = [[1, '上古'], [10, '中古'], [20, '近世'], [37, '现代'], [63, '数字']], RX0 = 210, RX1 = 1710, RY = 1030;
  const drawRuler = t => {
    const a = XY.smooth((t - XY.SCROLL_T0 + 0.6) / 0.8) * (1 - XY.smooth((t - XY.SCROLL_T1 + 0.2) / 0.8));
    if (a <= 0.001) return;
    ctx.setTransform(S, 0, 0, S, 0, 0); ctx.save(); ctx.globalAlpha = a;
    const N = 81, tx = n => RX0 + (n - 1) / (N - 1) * (RX1 - RX0);
    ctx.strokeStyle = 'rgba(58,46,34,0.45)'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(RX0 - 12, RY); ctx.lineTo(RX1 + 12, RY); ctx.stroke();
    for (let n = 1; n <= N; n++) { const big = n % 9 === 0 || n === 1; ctx.beginPath(); ctx.moveTo(tx(n), RY); ctx.lineTo(tx(n), RY + (big ? 9 : 5)); ctx.stroke(); }
    ctx.font = XY.font(15, XY.cnFont.kai); ctx.fillStyle = 'rgba(58,46,34,0.6)'; ctx.textBaseline = 'alphabetic';
    ERAS.forEach(([n, s]) => ctx.fillText(s, tx(n) + 2, RY + 26));
    const c = XY.cellAt(t), f = XY.clamp((t - c.t0) / c.dur), all = XY.ALL_CELLS || C, ni = c.n - 1 + f, mx = RX0 + ni / (N - 1) * (RX1 - RX0);
    ctx.fillStyle = RED; ctx.beginPath(); ctx.moveTo(mx, RY - 3); ctx.lineTo(mx - 6, RY - 13); ctx.lineTo(mx + 6, RY - 13); ctx.closePath(); ctx.fill();
    const yr = (c.sub.split(' · ')[1] || '').replace(/\s/g, ' ');
    ctx.font = XY.font(16, XY.cnFont.song, 'bold'); ctx.textAlign = 'center'; ctx.fillText(yr, mx, RY - 20); ctx.textAlign = 'left';
    void all; ctx.restore();
  };

  // ------------------------------------------------------------ 9×9 overview
  const G = { TW: 128, TH: 85, GAP: 10, X0: 598, Y0: 118 };
  const slotRect = n => { const i = n - 1; return [G.X0 + (i % 9) * (G.TW + G.GAP), G.Y0 + Math.floor(i / 9) * (G.TH + G.GAP), G.TW, G.TH]; };
  const byN = {}; C.forEach(c => { byN[c.n] = c; });
  const thumb = n => keep(`thumb:${n}`, G.TW * S, G.TH * S, cv => {
    const g = cv.getContext('2d'), c = byN[n];
    if (!c) { g.fillStyle = '#E2D9C6'; g.fillRect(0, 0, cv.width, cv.height); g.fillStyle = '#B4A88F'; g.font = XY.font(15 * S, XY.cnFont.song); g.fillText('第' + XY.cnNum(n) + '难', 8 * S, 22 * S); return; }
    // thumbnail moment: a style may declare thumb (cell-local beat); otherwise u = 0.86, after the cell's climax, when any
    // in-panel push-in has settled (CELL_GUIDE asks for zooms to be back to 1 before u = 0.85)
    const st = XY.STYLES[c.style] || {}, tb = st.thumb != null ? c.t0 + st.thumb * XY.BEAT : c.t0 + c.dur * 0.86;
    const k = G.TH / L.PANEL_H * S, pc = renderPanel(c, tb, k, mk(c.w * k, L.PANEL_H * k));
    g.drawImage(pc, (pc.width - cv.width) / 2, 0, cv.width, cv.height, 0, 0, cv.width, cv.height);
  });
  // ov: { rows (time since reveal start, s), title 0..1, seal (time since stamp, s, <0 = not yet), glow (time of the outro sweep, s), credit 0..1 }
  const drawOverview = ov => {   // drawn in the caller's transform (design units, possibly zoomed)
    ctx.fillStyle = wallPattern();
    ctx.fillRect(-4000, -4000, 12000, 12000);
    for (let n = 1; n <= 81; n++) {
      const [x, y, w, h] = slotRect(n), i = n - 1, r = Math.floor(i / 9), col = i % 9, a = XY.easeOut((ov.rows - 0.4 - r * 0.29 - col * 0.022) / 0.3);
      if (a <= 0) continue;
      ctx.globalAlpha = a; const s = 0.86 + 0.14 * a;
      ctx.save(); ctx.translate(x + w / 2, y + h / 2 + 8 * (1 - a)); ctx.scale(s, s);
      ctx.fillStyle = 'rgba(48,32,14,0.22)'; ctx.fillRect(-w / 2 + 1.5, -h / 2 + 2.5, w, h);
      // the slot the camera zooms into/out of shows the live panel at this very t, so the hand-off to the gallery matches
      if (ov.live && ov.live.n === n) { const lc = ov.live, k = (lc.k || 1), pc = renderPanel(lc, ov.t, k, XY.scratch('ov-live', lc.w * k, L.PANEL_H * k));
        const sw = G.TW / G.TH * L.PANEL_H * k; ctx.drawImage(pc, (pc.width - sw) / 2, 0, sw, pc.height, -w / 2, -h / 2, w, h); }
      else ctx.drawImage(thumb(n), -w / 2, -h / 2, w, h);
      if (ov.glow != null) { const gl = Math.max(0, 1 - Math.abs(ov.glow - (r + col) * 0.07) / 0.18); if (gl > 0) { ctx.fillStyle = `rgba(255,236,190,${0.55 * gl})`; ctx.fillRect(-w / 2, -h / 2, w, h); } }
      ctx.restore();
    }
    ctx.globalAlpha = 1;
    // title brushed in left to right with a soft edge: text on its own layer, masked, then composited
    const ta = XY.clamp(ov.title);
    if (ta > 0) {
      const lay = XY.scratch('ov-title', canvas.width, canvas.height), lg = lay.getContext('2d'), m = ctx.getTransform();
      lg.setTransform(m); const ex = 80 + 560 * XY.easeIO(ta);
      lg.fillStyle = INK; lg.font = XY.font(116, XY.cnFont.song, 'bold'); lg.fillText('八十一难', 92, 470);
      lg.fillStyle = RED; lg.font = XY.font(34, XY.cnFont.kai); lg.fillText('九九八十一种画风', 96, 540);
      lg.fillStyle = '#7A6E5E'; lg.font = XY.font(23, XY.cnFont.kai); lg.fillText('四万年前  →  二〇二六', 98, 586); lg.fillText('《西游记》第九十九回 · 难簿', 98, 624);
      const gr = lg.createLinearGradient(ex - 70, 0, ex, 0); gr.addColorStop(0, 'rgba(0,0,0,1)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
      lg.globalCompositeOperation = 'destination-in'; lg.fillStyle = gr; lg.fillRect(-4000, -4000, 8000, 8000);
      ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.drawImage(lay, 0, 0); ctx.restore();
    }
    if (ov.seal != null && ov.seal >= 0) {   // red seal 「九九归真」 stamps in
      const k = XY.clamp(ov.seal / 0.16), sc = 1.5 - 0.5 * XY.easeOut(k), al = XY.clamp(ov.seal / 0.06);
      ctx.save(); ctx.translate(512, 588); ctx.rotate(-0.05); ctx.scale(sc, sc); ctx.globalAlpha = al;
      ctx.fillStyle = '#B5281C'; ctx.fillRect(-44, -44, 88, 88); ctx.strokeStyle = '#F4E9D6'; ctx.lineWidth = 3; ctx.strokeRect(-37, -37, 74, 74);
      ctx.fillStyle = '#F4E9D6'; ctx.font = XY.font(30, XY.cnFont.li, 'bold'); ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('九九', 0, -15); ctx.fillText('归真', 0, 18);
      for (let j = 0; j < 40; j++) { ctx.fillStyle = 'rgba(244,233,214,0.55)'; ctx.fillRect(-44 + XY.hash(j, 1) * 88, -44 + XY.hash(j, 2) * 88, 1 + 3 * XY.hash(j, 3), 1 + 2 * XY.hash(j, 4)); }
      ctx.restore();
    }
    if (ov.credit > 0) { ctx.globalAlpha = XY.clamp(ov.credit); ctx.fillStyle = '#7A6E5E'; ctx.font = XY.font(19, XY.cnFont.kai); ctx.fillText('全片画面与配乐皆由代码逐帧生成', 98, 680); ctx.globalAlpha = 1; }
  };
  // transform that carries slot n's thumbnail onto the centred panel of cell c, at zoom progress z ∈ [0,1]
  const zoomXform = (n, c, z) => {
    const [x, y, w, h] = slotRect(n), s1 = L.PANEL_H / h, e = XY.easeIO(z), s = Math.exp(Math.log(s1) * e), wgt = (s - 1) / (s1 - 1);
    const cx = x + w / 2, cy = y + h / 2, px = XY.lerp(cx, XY.DW / 2, wgt), py = XY.lerp(cy, L.PANEL_Y + L.PANEL_H / 2, wgt);
    return [s, px - cx * s, py - cy * s];
  };

  const INTRO = XY.SCROLL_T0, OUT0 = XY.SCROLL_T1;
  window.__renderAt = t => {
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
    if (t >= INTRO - 3.5 && t <= OUT0 + 3.5) drawGallery(t);
    let z = -1, n = 0, c = null, fade = 0, ov = null;
    if (t < INTRO) { c = C[0]; n = c.n; z = XY.clamp((t - (INTRO - 3.5)) / 3.5); fade = XY.smooth((z - 0.62) / 0.38);
      ov = { rows: t, title: ((t - 0.25) / 1.3) * (1 - XY.smooth(z * 3)), seal: t - 1.9, glow: null, credit: 0 }; }
    else if (t > OUT0) { c = C[C.length - 1]; n = c.n; const o = t - OUT0; z = 1 - XY.clamp(o / 3.5); fade = XY.smooth((z - 0.62) / 0.38);
      ov = { rows: 99, title: (o - 2.9) / 1.0, seal: o - 4.0, glow: o - 2.3, credit: (o - 4.6) / 0.8 }; }
    if (z >= 0 && fade < 1) {
      const [s, tx, ty] = zoomXform(n, c, z);
      ctx.save(); ctx.globalAlpha = 1 - fade;
      ctx.setTransform(S * s, 0, 0, S * s, S * tx, S * ty);
      const pat = wallPattern(); pat.setTransform(new DOMMatrix());
      ov.t = t; ov.live = Object.assign(Object.create(c), { k: Math.min(S, S * s * G.TH / L.PANEL_H * 1.25) }); drawOverview(ov);
      ctx.restore();
    }
  };
  XY.renderPanel = renderPanel; XY.panelEnv = panelEnv; XY.thumb = thumb; XY.wallPattern = wallPattern; XY.filmCanvas = canvas;
})();
