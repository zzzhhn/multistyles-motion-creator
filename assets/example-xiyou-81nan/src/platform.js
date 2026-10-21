// platform.js — 9:16 and 1:1 cuts built around the main film instead of cropping it: the film renders off-screen at 2K
// (film.js draws into #film), this page composes it with a big title of the current 难 on top and the 9×9 grid
// (9:16) or an 81-square progress row (1:1) below. ?profile=9x16 (default) | 1x1. __renderAt(t) stays pure in t.
(() => {
  'use strict';
  const XY = window.XY, Q = new URLSearchParams(location.search), P1 = Q.get('profile') === '1x1';
  const out = document.getElementById('c'), g = out.getContext('2d'), film = XY.filmCanvas, inner = window.__renderAt;
  const DW = 1080, DH = P1 ? 1080 : 1920, S = out.width / DW, FS = film.width / XY.DW, C = XY.CELLS;
  const INK = '#3A2E22', RED = '#A8261C', GREY = '#7A6E5E';
  const L = P1 ? { head: 40, big: 156, sub: 214, fy: 262, fh: 690, crop: [360, 70, 1200, 766] }
               : { head: 84, big: 345, sub: 436, fy: 520, fh: 660, crop: [360, 60, 1200, 733] };
  const paper = () => XY.keep('pf-paper:' + out.width + 'x' + out.height, out.width, out.height, cv => {
    const p = cv.getContext('2d'); p.fillStyle = XY.wallPattern(); p.fillRect(0, 0, cv.width, cv.height);
    const gr = p.createRadialGradient(cv.width / 2, cv.height / 2, cv.height * 0.3, cv.width / 2, cv.height / 2, cv.height * 0.75);
    gr.addColorStop(0, 'rgba(60,40,20,0)'); gr.addColorStop(1, 'rgba(60,40,20,0.14)'); p.fillStyle = gr; p.fillRect(0, 0, cv.width, cv.height); });

  // the current-cell title block; flips on each downbeat (old text rises and fades, new text rises in)
  const block = (c, y0, a, dy) => {
    if (a <= 0) return; g.save(); g.globalAlpha = a; g.translate(0, dy); g.textAlign = 'center'; g.textBaseline = 'alphabetic';
    if (P1) {
      g.font = XY.font(46, XY.cnFont.song, 'bold'); const n1 = '第' + XY.cnNum(c.n) + '难', w1 = g.measureText(n1).width;
      g.font = XY.font(84, XY.cnFont.song, 'bold'); const w2 = g.measureText(c.name).width, x0 = DW / 2 - (w1 + 26 + w2) / 2;
      g.textAlign = 'left'; g.fillStyle = RED; g.font = XY.font(46, XY.cnFont.song, 'bold'); g.fillText(n1, x0, y0);
      g.fillStyle = INK; g.font = XY.font(84, XY.cnFont.song, 'bold'); g.fillText(c.name, x0 + w1 + 26, y0);
      g.textAlign = 'center'; g.fillStyle = GREY; g.font = XY.font(30, XY.cnFont.kai); g.fillText(c.sub, DW / 2, L.sub + dy * 0);
    } else {
      g.fillStyle = RED; g.font = XY.font(60, XY.cnFont.song, 'bold'); g.fillText('第' + XY.cnNum(c.n) + '难', DW / 2, y0 - 148);
      g.fillStyle = INK; g.font = XY.font(132, XY.cnFont.song, 'bold'); g.fillText(c.name, DW / 2, y0);
      g.fillStyle = GREY; g.font = XY.font(38, XY.cnFont.kai); g.fillText(c.sub, DW / 2, L.sub);
    }
    g.restore();
  };
  const titleCard = (a, line2) => { if (a <= 0) return; g.save(); g.globalAlpha = a; g.textAlign = 'center';
    g.fillStyle = INK; g.font = XY.font(P1 ? 96 : 150, XY.cnFont.song, 'bold'); g.fillText('八十一难', DW / 2, P1 ? 160 : 335);
    g.fillStyle = RED; g.font = XY.font(P1 ? 36 : 46, XY.cnFont.kai); g.fillText(line2, DW / 2, P1 ? 210 : 425); g.restore(); };
  // 1:1 only: the full 9×9 grid in the middle while the film is showing its own overview (start and end)
  const bigGrid = (t, a) => { if (a <= 0) return;
    const TW = 104, TH = 68, GP = 7, x0 = (DW - (9 * TW + 8 * GP)) / 2, y0 = L.fy + (L.fh - (9 * TH + 8 * GP)) / 2, out0 = XY.SCROLL_T1;
    for (let n = 1; n <= 81; n++) { const i = n - 1, r = Math.floor(i / 9), col = i % 9, x = x0 + col * (TW + GP), y = y0 + r * (TH + GP);
      const ap = t > out0 ? 1 : XY.easeOut((t - 0.4 - r * 0.29 - col * 0.022) / 0.3); if (ap <= 0) continue;
      g.globalAlpha = a * ap; g.fillStyle = 'rgba(48,32,14,0.22)'; g.fillRect(x + 1.5, y + 2.5, TW, TH); g.drawImage(XY.thumb(n), x, y, TW, TH);
      if (t > out0) { const gl = Math.max(0, 1 - Math.abs(t - out0 - 2.3 - (r + col) * 0.07) / 0.18); if (gl > 0) { g.fillStyle = `rgba(255,236,190,${0.55 * gl})`; g.fillRect(x, y, TW, TH); } } }
    g.globalAlpha = 1; };

  const grid = (t, cur) => {   // 9:16 only: the 81 thumbnails fill in as the journey goes
    const TW = 84, TH = 56, GP = 7, x0 = (DW - (9 * TW + 8 * GP)) / 2, y0 = 1240, out0 = XY.SCROLL_T1;
    for (let n = 1; n <= 81; n++) {
      const i = n - 1, r = Math.floor(i / 9), col = i % 9, x = x0 + col * (TW + GP), y = y0 + r * (TH + GP);
      const appear = XY.easeOut((t - 0.4 - r * 0.29 - col * 0.022) / 0.3); if (appear <= 0) continue;
      const done = t > out0 || n < cur, now = n === cur && t >= XY.SCROLL_T0 && t <= out0;
      g.globalAlpha = appear * (done || now ? 1 : 0.3);
      g.fillStyle = 'rgba(48,32,14,0.22)'; g.fillRect(x + 1.5, y + 2.5, TW, TH); g.drawImage(XY.thumb(n), x, y, TW, TH);
      if (t > out0) { const gl = Math.max(0, 1 - Math.abs(t - out0 - 2.3 - (r + col) * 0.07) / 0.18); if (gl > 0) { g.fillStyle = `rgba(255,236,190,${0.55 * gl})`; g.fillRect(x, y, TW, TH); } }
      if (now) { g.globalAlpha = 1; g.strokeStyle = RED; g.lineWidth = 3 + 1.5 * Math.exp(-(t - XY.cellAt(t).t0) / 0.15); g.strokeRect(x - 3, y - 3, TW + 6, TH + 6); }
    }
    g.globalAlpha = 1;
  };
  const row = (t, cur) => {    // 1:1 only: 81 squares
    const w = 10.4, gp = 2.3, x0 = (DW - (81 * w + 80 * gp)) / 2, y = 1000;
    for (let n = 1; n <= 81; n++) { const x = x0 + (n - 1) * (w + gp), done = t > XY.SCROLL_T1 || n < cur, now = n === cur && t >= XY.SCROLL_T0;
      g.fillStyle = now ? RED : done ? 'rgba(58,46,34,0.75)' : 'rgba(58,46,34,0.15)'; g.fillRect(x, y - (now ? 4 : 0), w, w + (now ? 8 : 0)); }
    g.fillStyle = GREY; g.font = XY.font(22, XY.cnFont.kai); g.textAlign = 'left'; g.fillText('四万年前', x0, y + 44); g.textAlign = 'right'; g.fillText('二〇二六', DW - x0, y + 44); g.textAlign = 'left';
  };

  window.__renderAt = t => {
    inner(t);
    g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.drawImage(paper(), 0, 0); g.setTransform(S, 0, 0, S, 0, 0);
    g.textAlign = 'center'; g.fillStyle = GREY; g.font = XY.font(P1 ? 26 : 32, XY.cnFont.kai); g.fillText('《西游记》九九八十一难 · 八十一种画风', DW / 2, L.head); g.textAlign = 'left';
    const T0 = XY.SCROLL_T0, T1 = XY.SCROLL_T1, c = XY.cellAt(t), k = t - c.t0;
    if (t < T0) titleCard(1 - XY.smooth((t - T0 + 0.6) / 0.5), '九九八十一种画风');
    else if (t > T1) { block(C[C.length - 1], L.big, 1 - XY.smooth((t - T1) / 0.4), -30 * XY.smooth((t - T1) / 0.4)); titleCard(XY.smooth((t - T1 - 2.9) / 0.8), '九九归真'); }
    else { const u = XY.easeOut(XY.clamp(k / 0.28)); block(c, L.big, t - T0 < 0.6 ? XY.smooth((t - T0) / 0.6) : u, 30 * (1 - u)); if (c.i > 0 && u < 1) block(C[c.i - 1], L.big, 1 - u, -30 * u); }
    // the film, cropped to the procession and its panel
    // (hidden while the film shows its own title-and-grid overview, which would only repeat this page's title and grid)
    // the crop follows the current panel (so its in-frame title and corners stay in view) while the procession is inside it,
    // and slides back to the procession centre around the seams, where the walk carries the eye from panel to panel
    const [cx0, cy, cw, ch] = L.crop, inS = t >= T0 && t <= T1, pc = XY.cellAt(t), pu = inS ? (t - pc.t0) / pc.dur : 0.5;
    const follow = inS ? XY.smooth((pu - 0.04) / 0.18) * (1 - XY.smooth((pu - 0.78) / 0.18)) : 0, panelCX = pc.x + pc.w / 2 - XY.camX(t);
    const cx = Math.max(0, Math.min(XY.DW - cw, XY.lerp(cx0, panelCX - cw / 2, follow))), dy = L.fy, dh = L.fh, fa = t < T0 ? XY.smooth((t - 4.4) / 0.8) : t > T1 ? 1 - XY.smooth((t - T1 - 2.4) / 0.6) : 1;
    if (fa > 0) { g.save(); g.globalAlpha = fa; g.shadowColor = 'rgba(48,32,14,0.3)'; g.shadowBlur = 24; g.shadowOffsetY = 8; g.fillStyle = '#000'; g.fillRect(0, dy, DW, dh); g.restore();
      g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = fa; g.drawImage(film, cx * FS, cy * FS, cw * FS, ch * FS, 0, dy * S, DW * S, dh * S); g.globalAlpha = 1; g.setTransform(S, 0, 0, S, 0, 0); }
    if (P1) bigGrid(t, 1 - fa);
    const cur = t < T0 ? 1 : c.n;
    if (P1) row(t, cur); else grid(t, cur);
    g.textAlign = 'center'; g.fillStyle = 'rgba(122,110,94,0.85)'; g.font = XY.font(P1 ? 20 : 24, XY.cnFont.kai);
    g.fillText('全片画面与配乐皆由代码逐帧生成', DW / 2, DH - (P1 ? 22 : 46)); g.textAlign = 'left';
  };
})();
