// 《二十四节气》film · the 节气盘 (a ring of the 24 terms) used by the intro and the outro.
// Chinese orientation: spring left (east), summer top (south), autumn right (west), winter bottom (north).
// Each sector is filled with a thumbnail of that term's style (its key frame, rendered once).
(function () {
  const JQ = window.JQ;
  const R = JQ.RING = { cx: 960, cy: 548, r0: 262, r1: 432 };
  const D2R = Math.PI / 180;
  R.lam = n => (315 + 15 * (n - 1)) % 360;                        // ecliptic longitude of term n
  R.phi = lam => (180 + lam) * D2R;                                // screen angle (canvas, y down)
  R.mid = n => { const a = R.phi(R.lam(n) + 7.5), r = (R.r0 + R.r1) / 2; return [R.cx + Math.cos(a) * r, R.cy + Math.sin(a) * r]; };
  R.at = (n, k = 0.5) => { const a = R.phi(R.lam(n) + 15 * k), r = (R.r0 + R.r1) / 2; return [R.cx + Math.cos(a) * r, R.cy + Math.sin(a) * r]; };
  const sector = n => { const a0 = R.phi(R.lam(n)), a1 = a0 + 15 * D2R, p = new Path2D(); p.arc(R.cx, R.cy, R.r1, a0, a1); p.arc(R.cx, R.cy, R.r0, a1, a0, true); p.closePath(); return p; };
  const SECT = Array.from({ length: 24 }, (_, i) => sector(i + 1));

  // thumbnails: each style's key frame at 640×360, rendered once
  const thumbs = {};
  JQ.thumb = n => {
    if (thumbs[n]) return thumbs[n];
    const c = document.createElement('canvas'); c.width = 640; c.height = 360; const g = c.getContext('2d'), S = { scale: 640 / JQ.W, W: JQ.W, H: JQ.H, n, thumb: true };
    g.setTransform(S.scale, 0, 0, S.scale, 0, 0);
    const A = JQ.ART[n] || (JQ.placeholder(n), JQ.ART[n]);
    try { g.save(); A.draw(g, A.thumbT != null ? A.thumbT : (A.key || 0), S); g.restore(); } catch (e) { g.restore(); g.fillStyle = '#777'; g.fillRect(0, 0, JQ.W, JQ.H); }
    return (thumbs[n] = c);
  };
  const PAPER = '#EFE8D8', INK = '#2A2520', SEAL = '#B22E25';

  // draw the ring. opt: { fill: 0..24 (how many sectors show their thumbnail, fractional fades the last), ink: 0..1 (line reveal),
  //   names: 0..1, sun: longitude of the sun or null, glow: n or 0, title: 0..1, sub: 0..1, credit: 0..1 }
  R.draw = (g, opt) => {
    g.fillStyle = PAPER; g.fillRect(0, 0, JQ.W, JQ.H);
    JQ.blit(g, JQ.cached('ring-paper', opt.S, (h) => { h.globalAlpha = 0.06; h.fillStyle = '#5A4A3A'; for (let i = 0; i < 2600; i++) h.fillRect(JQ.hash(i, 1, 77) * 1920, JQ.hash(i, 2, 77) * 1080, 6 + JQ.hash(i, 3, 77) * 16, 1); h.globalAlpha = 1; }));
    // thumbnails in the sectors, starting at 立春 and going round the year
    for (let n = 1; n <= 24; n++) {
      const a = JQ.clamp(opt.fill - (n - 1)); if (a <= 0) continue;
      g.save(); g.clip(SECT[n - 1]); g.globalAlpha = a;
      const [mx, my] = R.mid(n), A = JQ.ART[n] || {}, f = (A.focus && A.focus[A.keyHou != null ? A.keyHou : 1]) || [960, 600], s = 0.36;
      g.drawImage(JQ.thumb(n), mx - f[0] * s, my - f[1] * s, JQ.W * s, JQ.H * s);
      g.restore();
    }
    g.globalAlpha = 1;
    if (opt.glow) { g.save(); g.strokeStyle = SEAL; g.lineWidth = 7; g.stroke(SECT[opt.glow - 1]); g.restore(); }
    // ink lines, drawn on
    const ink = JQ.clamp(opt.ink == null ? 1 : opt.ink);
    if (ink > 0) {
      g.strokeStyle = INK; g.lineWidth = 3; g.lineCap = 'round';
      [R.r0, R.r1].forEach((r, i) => { g.beginPath(); g.arc(R.cx, R.cy, r, R.phi(315), R.phi(315) + Math.PI * 2 * ink * (i ? 1 : 0.98)); g.stroke(); });
      for (let n = 1; n <= 24; n++) { if ((n - 1) / 24 > ink) break; const a = R.phi(R.lam(n)); g.beginPath(); g.moveTo(R.cx + Math.cos(a) * R.r0, R.cy + Math.sin(a) * R.r0); g.lineTo(R.cx + Math.cos(a) * R.r1, R.cy + Math.sin(a) * R.r1); g.stroke(); }
    }
    // names outside the ring
    const nm = JQ.clamp(opt.names || 0);
    if (nm > 0) {
      g.fillStyle = INK; g.font = '600 30px "Songti SC", "STSong", serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
      for (let n = 1; n <= 24; n++) { g.globalAlpha = JQ.clamp(nm * 24 - (n - 1)); const a = R.phi(R.lam(n) + 7.5), r = R.r1 + 40; g.save(); g.translate(R.cx + Math.cos(a) * r, R.cy + Math.sin(a) * r); g.fillText(JQ.TERMS[n - 1].name, 0, 0); g.restore(); }
      g.globalAlpha = 1;
    }
    // the sun travelling the ring
    if (opt.sun != null) { const a = R.phi(opt.sun), r = (R.r0 + R.r1) / 2; g.fillStyle = SEAL; g.beginPath(); g.arc(R.cx + Math.cos(a) * r, R.cy + Math.sin(a) * r, 22, 0, Math.PI * 2); g.fill(); g.fillStyle = 'rgba(178,46,37,0.25)'; g.beginPath(); g.arc(R.cx + Math.cos(a) * r, R.cy + Math.sin(a) * r, 36, 0, Math.PI * 2); g.fill(); }
    // centre: title, subtitle, credit
    g.textAlign = 'center'; g.textBaseline = 'middle';
    if (opt.title > 0) { g.globalAlpha = JQ.clamp(opt.title); g.fillStyle = INK; g.font = '700 96px "Songti SC", "STSong", serif'; g.fillText('二十四节气', R.cx, R.cy - 24); g.globalAlpha = 1; }
    if (opt.sub > 0) { g.globalAlpha = JQ.clamp(opt.sub); g.fillStyle = '#5A5148'; g.font = '30px "Songti SC", "STSong", serif'; g.fillText('一处村口　一年　二十四种画风', R.cx, R.cy + 56); g.globalAlpha = 1; }
    if (opt.credit > 0) { g.globalAlpha = JQ.clamp(opt.credit); g.fillStyle = '#5A5148'; g.font = '26px "PingFang SC", sans-serif'; g.fillText('画面与配乐全部由代码逐帧生成', R.cx, R.cy + 116); g.globalAlpha = 1; }
  };
})();
