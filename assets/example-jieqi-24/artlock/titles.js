// 《二十四节气》film · the title card. At the start of every term a strip of rice paper is brushed open across the sky with
// the term's name in large ink, its number and date, and a seal; after ~1.9 s it rolls up again. Legible on every style
// (dark, light, busy) because the paper strip carries its own ground. JQ.titleCard(g, n, lt, Sx) draws it in design space.
(function () {
  const JQ = window.JQ;
  JQ.TERM_DATES = ['2月4日前后', '2月19日前后', '3月6日前后', '3月21日前后', '4月5日前后', '4月20日前后', '5月6日前后', '5月21日前后', '6月6日前后', '6月21日前后', '7月7日前后', '7月23日前后',
    '8月8日前后', '8月23日前后', '9月8日前后', '9月23日前后', '10月8日前后', '10月23日前后', '11月7日前后', '11月22日前后', '12月7日前后', '12月22日前后', '1月6日前后', '1月20日前后'];
  const SEASON_INK = { 春: '#2F5B3A', 夏: '#8C2F1F', 秋: '#7A5418', 冬: '#24384F' };
  const T_IN = 0.15, T_OPEN = 0.55, T_HOLD = 1.75, T_OUT = 2.25;
  const strip = (cx, cy, w, h, seed) => {                           // a paper strip with deckled (torn) long edges
    const p = new Path2D(), N = 48;
    for (let i = 0; i <= N; i++) { const x = cx - w / 2 + i / N * w; const y = cy - h / 2 + (JQ.noise(i * 0.7, 1, seed) - 0.5) * 9; i ? p.lineTo(x, y) : p.moveTo(x, y); }
    for (let i = N; i >= 0; i--) { const x = cx - w / 2 + i / N * w; p.lineTo(x, cy + h / 2 + (JQ.noise(i * 0.7, 5, seed) - 0.5) * 9); }
    p.closePath(); return p;
  };
  const paperTex = Sx => JQ.cached('title-paper', Sx, g => {
    g.fillStyle = '#F2EBDC'; g.fillRect(0, 0, JQ.W, JQ.H);
    g.globalAlpha = 0.08; g.fillStyle = '#6A5A44'; for (let i = 0; i < 5000; i++) g.fillRect(JQ.hash(i, 1, 91) * 1920, JQ.hash(i, 2, 91) * 1080, 4 + JQ.hash(i, 3, 91) * 22, 1); g.globalAlpha = 1;
  });
  JQ.titleCard = (g, n, lt, Sx) => {
    if (lt < T_IN || lt > T_OUT) return;
    const T = JQ.TERMS[n - 1], open = JQ.ease(JQ.smooth(T_IN, T_OPEN, lt)), close = JQ.ease(JQ.smooth(T_HOLD, T_OUT, lt));
    const [cx, cy] = JQ.TITLE_POS[n] || [960, 205], w = 860 * (open * (1 - close * 0.92)), h = 228, ink = SEASON_INK[T.season];
    if (w < 8) return;
    const sp = strip(cx, cy, w, h, n * 17);
    g.save();
    g.shadowColor = 'rgba(0,0,0,0.28)'; g.shadowBlur = 22; g.shadowOffsetY = 6; g.fillStyle = '#F2EBDC'; g.fill(sp); g.shadowColor = 'rgba(0,0,0,0)';
    g.clip(sp); JQ.blit(g, paperTex(Sx));
    // the two wooden rollers at the strip ends
    g.restore(); g.save();
    g.fillStyle = '#5B3B22'; [cx - w / 2, cx + w / 2].forEach(x => { g.fillRect(x - 9, cy - h / 2 - 16, 18, h + 32); g.fillStyle = '#7C5634'; g.fillRect(x - 4, cy - h / 2 - 16, 5, h + 32); g.fillStyle = '#5B3B22'; });
    g.restore();
    // text, revealed with the strip
    g.save(); g.clip(sp);
    const a = JQ.smooth(T_OPEN - 0.15, T_OPEN + 0.25, lt) * (1 - JQ.smooth(T_HOLD - 0.05, T_HOLD + 0.25, lt));
    g.globalAlpha = a; g.textBaseline = 'middle';
    g.fillStyle = ink; g.textAlign = 'right'; g.font = '600 34px "Songti SC", "STSong", serif';
    g.fillText(`第${JQ.NUMS[n - 1]}个节气`, cx - 150, cy - 50); g.font = '28px "Songti SC", "STSong", serif'; g.fillStyle = '#6A5E50'; g.fillText(JQ.TERM_DATES[n - 1], cx - 150, cy - 6);
    g.textAlign = 'center'; g.font = '30px "Kaiti SC", "STKaiti", serif'; g.fillText(T.hou.join('　·　'), cx, cy + 76);   // the three pentads, one line under the name
    g.textAlign = 'left'; g.fillStyle = '#1C1814'; g.font = '700 132px "Xingkai SC", "Kaiti SC", "STKaiti", serif'; g.fillText(T.name, cx - 120, cy - 20);
    // seal: the season
    const sx = cx + 300, sy = cy + 4; g.fillStyle = '#B22E25'; g.fillRect(sx - 30, sy - 30, 60, 60); g.fillStyle = '#F6E8DA'; g.font = '600 40px "Songti SC", serif'; g.textAlign = 'center'; g.fillText(T.season, sx, sy + 2);
    g.restore();
  };
  JQ.TITLE_WINDOW = [T_IN, T_OUT];
  JQ.TITLE_POS = { 11: [1100, 205], 16: [960, 262] };              // 小暑's HUD readout and 秋分's chart header stay readable
})();
