// 《二十四节气》film · intro (4 bars) and outro (5 bars) on a sundial of the 24 terms.
// The sun stays at the top; the dial turns beneath it. Every sector starts as an ink sketch of its style and takes colour
// when the sun passes; the moon gate (月洞门) in the middle flips through the 24 pictures as the year goes by. At the end
// of the intro the camera walks straight through the moon gate into 立春 (zoom about the screen centre, so the target never
// drifts). The outro walks back out of 大寒, the sun steps on to 立春, the title returns.
(function () {
  const JQ = window.JQ, F = JQ.FILM;
  const D = { cx: 960, cy: 540, r0: 232, r1: 384, RW: 206 };           // dial geometry (design px)
  const K = 2 * D.RW / 1080, ZG = 1 / K;                             // a style fills the moon gate at scale K; zoom ZG makes it full size
  const D2R = Math.PI / 180, lam = n => (315 + 15 * (n - 1)) % 360;
  const termAt = L => Math.floor((((L - 315) % 360) + 360) % 360 / 15) + 1;
  const INK = '#2A2520', SEAL = '#B22E25', PAPER = '#EFE8D8';
  const gray = {};
  const sketch = n => {                                              // the ink-sketch version of a thumbnail (cached)
    if (gray[n]) return gray[n];
    const src = JQ.thumb(n), c = document.createElement('canvas'); c.width = src.width; c.height = src.height; const g = c.getContext('2d');
    g.filter = 'grayscale(1) contrast(1.7) brightness(1.35)'; g.drawImage(src, 0, 0); g.filter = 'none';
    g.globalCompositeOperation = 'multiply'; g.fillStyle = '#EDE3CF'; g.fillRect(0, 0, c.width, c.height);
    return (gray[n] = c);
  };
  // the dial at rotation rot (deg) with the sun at longitude sunL (the sun is drawn at the top: rot = 90 - sunL - 180 … see below)
  const dial = (g, o) => {
    const rot = -90 - (180 + o.sunL), A = l => (180 + l + rot) * D2R;   // screen angle of longitude l
    g.fillStyle = PAPER; g.fillRect(0, 0, JQ.W, JQ.H);
    JQ.blit(g, JQ.cached('dial-paper', o.S, h => { h.globalAlpha = 0.06; h.fillStyle = '#5A4A3A'; for (let i = 0; i < 2600; i++) h.fillRect(JQ.hash(i, 1, 77) * 1920, JQ.hash(i, 2, 77) * 1080, 6 + JQ.hash(i, 3, 77) * 16, 1); h.globalAlpha = 1; }));
    const ink = JQ.clamp(o.ink), mid = (D.r0 + D.r1) / 2;
    for (let n = 1; n <= 24; n++) {                                  // sectors: sketch, or colour once the sun has passed (o.passed(n) 0..1)
      const a0 = A(lam(n)), a1 = a0 + 15 * D2R, p = new Path2D(); p.arc(D.cx, D.cy, D.r1, a0, a1); p.arc(D.cx, D.cy, D.r0, a1, a0, true); p.closePath();
      const am = (a0 + a1) / 2, mx = D.cx + Math.cos(am) * mid, my = D.cy + Math.sin(am) * mid, s = 0.3;
      const reveal = JQ.clamp(o.sketch - (n - 1) / 24 * 0.6); if (reveal <= 0) continue;
      g.save(); g.clip(p); g.translate(mx, my); g.rotate(am + Math.PI / 2); g.globalAlpha = reveal;
      g.drawImage(sketch(n), -960 * s, -620 * s, 1920 * s, 1080 * s);
      const c = o.passed(n); if (c > 0) { g.globalAlpha = reveal * c; g.drawImage(JQ.thumb(n), -960 * s, -620 * s, 1920 * s, 1080 * s); }
      g.restore();
    }
    if (ink > 0) {                                                   // ink lines and the 72 pentad ticks, drawn on
      g.strokeStyle = INK; g.lineWidth = 3; g.lineCap = 'round';
      const a0 = A(315);
      [D.r0, D.r1].forEach(r => { g.beginPath(); g.arc(D.cx, D.cy, r, a0, a0 + Math.PI * 2 * ink); g.stroke(); });
      for (let k = 0; k < 72; k++) { if (k / 72 > ink) break; const a = A(315 + k * 5), big = k % 3 === 0, r2 = D.r1 + (big ? 18 : 10);
        g.lineWidth = big ? 3 : 1.5; g.beginPath(); g.moveTo(D.cx + Math.cos(a) * (big ? D.r0 : D.r1), D.cy + Math.sin(a) * (big ? D.r0 : D.r1)); g.lineTo(D.cx + Math.cos(a) * r2, D.cy + Math.sin(a) * r2); g.stroke(); }
    }
    if (o.names > 0) {                                               // names outside, upright
      g.font = '600 28px "Songti SC", "STSong", serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
      for (let n = 1; n <= 24; n++) { const a = A(lam(n) + 7.5), r = D.r1 + 46, on = o.current === n;
        g.globalAlpha = JQ.clamp(o.names * 24 - (n - 1)); g.fillStyle = on ? SEAL : INK; g.font = `${on ? 700 : 600} ${on ? 34 : 28}px "Songti SC", "STSong", serif`;
        g.fillText(JQ.TERMS[n - 1].name, D.cx + Math.cos(a) * r, D.cy + Math.sin(a) * r); }
      g.globalAlpha = 1;
    }
    if (o.sun > 0) {                                                 // the sun, fixed at the top, and its pointer
      g.globalAlpha = o.sun; const sy = D.cy - D.r1 - 104;
      const gr = g.createRadialGradient(D.cx, sy, 0, D.cx, sy, 60); gr.addColorStop(0, 'rgba(178,46,37,0.35)'); gr.addColorStop(1, 'rgba(178,46,37,0)'); g.fillStyle = gr; g.beginPath(); g.arc(D.cx, sy, 60, 0, Math.PI * 2); g.fill();
      g.fillStyle = SEAL; g.beginPath(); g.arc(D.cx, sy, 22, 0, Math.PI * 2); g.fill();
      g.strokeStyle = SEAL; g.lineWidth = 3; g.beginPath(); g.moveTo(D.cx, sy + 30); g.lineTo(D.cx, D.cy - D.r1 + 4); g.stroke(); g.globalAlpha = 1;
    }
  };
  // the moon gate: a round window with a stone rim; content(g) draws inside it in design space
  const gate = (g, content, rim = 1) => {
    const p = new Path2D(); p.arc(D.cx, D.cy, D.RW, 0, Math.PI * 2);
    g.save(); g.clip(p); content(g); g.restore();
    if (rim > 0) { g.save(); g.globalAlpha = rim; g.strokeStyle = '#6B6156'; g.lineWidth = 14; g.stroke(p); g.strokeStyle = '#9A8F80'; g.lineWidth = 4; g.beginPath(); g.arc(D.cx, D.cy, D.RW - 9, 0, Math.PI * 2); g.stroke(); g.restore(); }
  };
  const inGate = (g, n, live, t, Sx) => {                           // style n inside the gate: thumbnail, or the live frame
    g.translate(D.cx - 960 * K, D.cy - 540 * K); g.scale(K, K);
    if (!live) { g.drawImage(JQ.thumb(n), 0, 0, 1920, 1080); return; }
    const A = JQ.ART[n] || (JQ.placeholder(n), JQ.ART[n]);
    try { A.draw(g, t, Object.assign({}, Sx, { n })); } catch (e) { g.drawImage(JQ.thumb(n), 0, 0, 1920, 1080); }
  };
  const titleIn = (g, a, sub, credit) => {                          // the title inside the gate, on paper
    if (a <= 0) return;
    g.globalAlpha = a; g.fillStyle = PAPER; g.fillRect(0, 0, JQ.W, JQ.H);
    g.fillStyle = INK; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.font = '700 74px "Songti SC", "STSong", serif'; g.fillText('二十四节气', D.cx, D.cy - 50);
    g.globalAlpha = a * sub; g.fillStyle = '#5A5148'; g.font = '26px "Songti SC", "STSong", serif'; g.fillText('一处村口　一年　二十四种画风', D.cx, D.cy + 10);
    if (credit > 0) { g.globalAlpha = a * credit; g.font = '19px "PingFang SC", sans-serif'; g.fillText('画面由代码逐帧生成', D.cx, D.cy + 50); g.fillText('配乐由代码编写、民乐采样演奏', D.cx, D.cy + 76); }
    g.fillStyle = SEAL; g.globalAlpha = a * sub; g.fillRect(D.cx - 20, D.cy + 100, 40, 40); g.fillStyle = '#F6E8DA'; g.font = '600 28px "Songti SC", serif'; g.fillText('岁', D.cx, D.cy + 121);
    g.globalAlpha = 1;
  };
  const zoomAbout = (g, z) => { g.translate(D.cx, D.cy); g.scale(z, z); g.translate(-D.cx, -D.cy); };
  // ---------------------------------------------------------------- intro: 0 … F.T0 (10.667 s)
  JQ.intro = (g, t, Sx) => {
    const run = JQ.ease(JQ.smooth(3.0, 8.0, t)), sunL = 322.5 + 360 * run, cur = run >= 1 ? 1 : termAt(sunL);
    const passed = n => run >= 1 ? 1 : JQ.clamp(((sunL - 322.5) - (n - 1) * 15 + 7.5) / 6);
    const dive = JQ.smooth(8.15, F.T0, t), z = Math.exp(Math.log(ZG) * JQ.ease(dive));
    g.save(); zoomAbout(g, z);
    dial(g, { S: Sx, sunL, ink: JQ.smooth(0.3, 2.4, t), sketch: JQ.smooth(0.8, 3.0, t), passed, names: JQ.smooth(1.4, 3.0, t), sun: JQ.smooth(2.2, 2.9, t), current: t > 3 ? cur : 0 });
    gate(g, h => {
      h.fillStyle = PAPER; h.fillRect(0, 0, JQ.W, JQ.H);
      if (t > 2.9) { h.save(); inGate(h, cur, dive > 0.02, 0, Sx); h.restore(); }
      titleIn(h, JQ.smooth(0.9, 1.6, t) * (1 - JQ.smooth(2.7, 3.2, t)), JQ.smooth(1.6, 2.3, t), 0);
    }, 1 - JQ.smooth(9.6, F.T0, t));
    g.restore();
    g.fillStyle = `rgba(239,232,216,${1 - JQ.smooth(0, 0.7, t)})`; g.fillRect(0, 0, JQ.W, JQ.H);
  };
  // ---------------------------------------------------------------- outro: 0 … F.OUTRO (13.333 s)
  JQ.outro = (g, t, Sx) => {
    const back = JQ.smooth(0, 2.6, t), z = Math.exp(Math.log(ZG) * (1 - JQ.ease(back)));
    const step = JQ.ease(JQ.smooth(2.8, 4.4, t)), sunL = 307.5 + 15 * step, cur = step > 0.5 ? 1 : 24;
    g.save(); zoomAbout(g, z);
    dial(g, { S: Sx, sunL, ink: 1, sketch: 1, passed: () => 1, names: 1, sun: JQ.smooth(1.6, 2.4, t), current: cur });
    gate(g, h => {
      h.fillStyle = PAPER; h.fillRect(0, 0, JQ.W, JQ.H);
      h.save(); if (cur === 24) inGate(h, 24, back < 0.98, 9, Sx); else inGate(h, 1, false, 0, Sx); h.restore();
      titleIn(h, JQ.smooth(4.6, 5.6, t), JQ.smooth(5.4, 6.4, t), JQ.smooth(6.4, 7.4, t));
    }, JQ.smooth(0.6, 1.6, t));
    g.restore();
    g.fillStyle = `rgba(239,232,216,${JQ.smooth(11.6, 13.2, t)})`; g.fillRect(0, 0, JQ.W, JQ.H);
  };
  JQ.DIAL = D;
})();
