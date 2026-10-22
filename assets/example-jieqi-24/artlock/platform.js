// 《二十四节气》platform cuts: 9:16 (?profile=9x16, 1440×2560) and 1:1 (?profile=1x1, 1440×1440).
// The whole 16:9 film frame is shown uncropped (styles keep their borders and titles); above it the current term and pentad
// in large type, below it the 节气盘 with the sun's position (9:16) or a 24-term progress strip (1:1). Pure in t.
(function () {
  const JQ = window.JQ, F = JQ.FILM, R = JQ.RING, Q = new URLSearchParams(location.search), P1 = Q.get('profile') === '1x1';
  const out = document.getElementById('c'), film = document.getElementById('film'), inner = window.__renderAt;
  JQ.titleCard = null;                                             // the platform pages carry their own big title above the picture
  const DW = 1080, DH = P1 ? 1080 : 1920; out.width = P1 ? 1440 : 1440; out.height = P1 ? 1440 : 2560;
  const g = out.getContext('2d'), S = out.width / DW;
  const INK = '#2A2520', GREY = '#6B6157', SEAL = '#B22E25', PAPER = '#EFE8D8';
  const L = P1 ? { name: 168, hou: 236, idx: 50, fy: 262, fh: 608, strip: 920 } : { name: 390, hou: 490, idx: 140, fy: 560, fh: 608, ring: 1540 };
  const where = t => {                                              // current term, pentad, fraction
    if (!F.LOOP && t < F.T0) return { phase: 'intro' };
    if (!F.LOOP && t >= F.TEND) return { phase: 'outro' };
    const n = Math.min(24, Math.floor((t - F.T0) / F.TERM) + 1), lt = t - F.start(n), k = Math.min(2, Math.floor(lt / F.BAR));
    return { phase: 'term', n, k, lt, kt: lt - k * F.BAR };
  };
  const title = (w, t) => {
    g.textAlign = 'center'; g.textBaseline = 'alphabetic';
    if (w.phase !== 'term') {
      const a = w.phase === 'intro' ? JQ.smooth(1.5, 3, t) : JQ.smooth(F.TEND + 4, F.TEND + 5.2, t);
      g.globalAlpha = a; g.fillStyle = INK; g.font = `700 ${P1 ? 110 : 150}px "Songti SC", serif`; g.fillText('二十四节气', DW / 2, L.name);
      g.fillStyle = GREY; g.font = `${P1 ? 34 : 44}px "Songti SC", serif`; g.fillText('一处村口　一年　二十四种画风', DW / 2, L.hou); g.globalAlpha = 1; return;
    }
    const T = JQ.TERMS[w.n - 1], inA = JQ.smooth(0, 0.25, w.kt);
    g.fillStyle = SEAL; g.font = `600 ${P1 ? 32 : 44}px "Songti SC", serif`; g.fillText(`第${JQ.NUMS[w.n - 1]}个节气　${['初', '二', '三'][w.k]}候`, DW / 2, L.idx);
    g.fillStyle = INK; g.font = `700 ${P1 ? 120 : 190}px "Songti SC", serif`; g.fillText(T.name, DW / 2, L.name);
    g.globalAlpha = inA; g.fillStyle = GREY; g.font = `${P1 ? 52 : 72}px "Kaiti SC", "STKaiti", serif`; g.fillText(T.hou[w.k], DW / 2, L.hou + (1 - inA) * 16); g.globalAlpha = 1;
  };
  const sunAt = t => 315 + 360 * JQ.clamp((t - F.T0) / (F.TEND - F.T0)) ;
  window.__renderAt = t => {
    inner(t);
    const w = where(t);
    g.setTransform(1, 0, 0, 1, 0, 0); g.fillStyle = PAPER; g.fillRect(0, 0, out.width, out.height);
    g.setTransform(S, 0, 0, S, 0, 0);
    title(w, t);
    // the film frame, uncropped, with a thin ink border
    g.drawImage(film, 0, L.fy, DW, L.fh); g.strokeStyle = INK; g.lineWidth = 2; g.strokeRect(0, L.fy, DW, L.fh);
    if (!P1) {                                                      // the 节气盘 below, the sun at the film's position in the year
      const a = w.phase === 'term' ? 1 : w.phase === 'intro' ? JQ.smooth(F.T0 - 1, F.T0, t) : 1 - JQ.smooth(F.TEND, F.TEND + 1, t);
      if (a > 0) { g.save(); g.globalAlpha = a; g.translate(DW / 2, L.ring); g.scale(0.62, 0.62); g.translate(-R.cx, -R.cy);
        g.beginPath(); g.rect(R.cx - 560, R.cy - 520, 1120, 1040); g.clip();
        R.draw(g, { S: { scale: S * 0.62, W: JQ.W, H: JQ.H }, fill: w.phase === 'term' ? w.n : 24, ink: 1, names: 1, sun: sunAt(t), glow: w.n || 0 }); g.restore(); }
    } else {                                                        // 24-term strip
      const cw = 42, x0 = DW / 2 - 12 * cw;
      for (let n = 1; n <= 24; n++) { const x = x0 + (n - 1) * cw, on = w.phase === 'term' && n === w.n, past = w.phase === 'outro' || (w.phase === 'term' && n < w.n);
        g.globalAlpha = on ? 1 : past ? 0.85 : 0.35; g.drawImage(JQ.thumb(n), 212, 0, 216, 360, x + 2, L.strip, cw - 4, 70);
        if (on) { g.strokeStyle = SEAL; g.lineWidth = 3; g.strokeRect(x + 1, L.strip - 1, cw - 2, 72); }
        g.globalAlpha = 1; g.fillStyle = on ? SEAL : GREY; g.font = '20px "Songti SC", serif'; g.textAlign = 'center'; g.fillText(JQ.TERMS[n - 1].name, x + cw / 2, L.strip + 100); }
    }
  };
})();
