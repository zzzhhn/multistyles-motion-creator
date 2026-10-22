// 《二十四节气》film · timeline, camera, transitions and the frame function for runtime.js.
// Grid: 90 BPM, 4/4. Each term = 3 bars = 12 beats = 8 s; pentad (候) k of a term = bar k (local 0, 8/3, 16/3).
// Main film: intro 4 bars + 24 terms (72 bars) + outro 5 bars = 81 bars = 216 s. ?loop=1: the 72 term bars only (192 s),
// whose end grows back into 立春 so the file loops seamlessly.
// Style contract (styles/sNN.js): JQ.ART[n] = { draw(g, t, Sx), key, keyHou, focus: [[x,y] ×3], frame }; the engine passes
// t in [0, 9] (incoming styles hold their opening frame during the transition; outgoing ones run on to ~8.85 s). `frame: true` = the style has a
// border, so the camera stays still. Transitions: the incoming style grows from its focus[0] over the outgoing one.
(function () {
  const JQ = window.JQ, Q = new URLSearchParams(location.search);
  const F = JQ.FILM = { BPM: 90 }; F.BEAT = 60 / F.BPM; F.BAR = 4 * F.BEAT; F.TERM = 3 * F.BAR;
  F.LOOP = Q.has('loop'); F.INTRO = F.LOOP ? 0 : 4 * F.BAR; F.OUTRO = F.LOOP ? 0 : 5 * F.BAR;
  F.T0 = F.INTRO; F.TEND = F.T0 + 24 * F.TERM; F.DUR = F.TEND + F.OUTRO;
  F.start = n => F.T0 + (n - 1) * F.TERM;
  const XIN = 0.45, XOUT = 0.85;                                   // transition window around each boundary
  window.__DURATION = F.DUR;
  const W = +(Q.get('w') || 2560), H = Math.round(W * 9 / 16);
  const cv = document.getElementById('film') || document.getElementById('c'); cv.width = W; cv.height = H;   // platform pages render the film off-screen into #film
  const g = cv.getContext('2d'), SC = W / JQ.W;
  const mk = () => { const c = document.createElement('canvas'); c.width = W; c.height = H; return { c, g: c.getContext('2d') }; };
  const LA = mk(), LB = mk();
  const Sx = { scale: SC, W: JQ.W, H: JQ.H };

  // ---------------------------------------------------------------- camera: a slow push toward the pentad's event
  const cam = (A, lt) => {
    if (!A || A.frame || !A.focus) return { z: 1, ax: 960, ay: 540 };
    const k = JQ.clamp(lt / F.BAR, 0, 2.999), i = Math.floor(k), f = JQ.ease(JQ.clamp((k - i) / 0.35));
    const p0 = A.focus[Math.max(0, i - 1)] || A.focus[0], p1 = A.focus[i] || p0;
    const fx = i ? JQ.lerp(p0[0], p1[0], f) : p1[0], fy = i ? JQ.lerp(p0[1], p1[1], f) : p1[1];
    return { z: 1 + 0.035 * JQ.smooth(0, F.TERM, lt), ax: JQ.lerp(960, fx, 0.4), ay: JQ.lerp(540, fy, 0.4) };
  };
  // draw style n at its local time into context c (already sized W×H)
  const drawTerm = (c, n, lt) => {
    const A = JQ.ART[n] || (JQ.placeholder(n), JQ.ART[n]), K = cam(A, lt);
    c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, W, H);
    c.setTransform(SC * K.z, 0, 0, SC * K.z, SC * K.ax * (1 - K.z), SC * K.ay * (1 - K.z));
    // Sx.lt is the true local time (negative while the style grows in, > 8 while it is being covered); JQ.castFor uses it
    try { c.save(); A.draw(c, JQ.clamp(lt, 0, 9), Object.assign({}, Sx, { n, lt })); c.restore(); }
    catch (e) { c.restore(); c.setTransform(1, 0, 0, 1, 0, 0); c.fillStyle = '#333'; c.fillRect(0, 0, W, H); if (!drawTerm.err) { drawTerm.err = 1; console.error('term ' + n, e); } }
  };
  // the growing mask: a noisy blob from (x, y) in design space, radius by progress p
  const blob = (x, y, p, seed) => {
    const R = 60 + JQ.ease(p) * 2400, path = new Path2D();
    for (let i = 0; i <= 96; i++) { const a = i / 96 * Math.PI * 2, r = R * (1 + (JQ.fbm(Math.cos(a) * 1.6 + 7, Math.sin(a) * 1.6 + p * 2.2, seed, 3) - 0.5) * 0.42); const px = (x + Math.cos(a) * r) * SC, py = (y + Math.sin(a) * r) * SC; i ? path.lineTo(px, py) : path.moveTo(px, py); }
    path.closePath(); return path;
  };
  // what is on screen at film time t: a list of [kind, n, localTime]; kind 'term' | 'intro' | 'outro'
  const layerAt = t => {
    if (!F.LOOP && t < F.T0) return ['intro', 0, t];
    if (!F.LOOP && t >= F.TEND) return ['outro', 0, t - F.TEND];
    const tt = F.LOOP ? ((t % F.DUR) + F.DUR) % F.DUR : t, n = Math.min(24, Math.floor((tt - F.T0) / F.TERM) + 1);
    return ['term', n, tt - F.start(n)];
  };
  const drawLayer = (c, L) => {
    if (L[0] === 'term') return drawTerm(c, L[1], L[2]);
    c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, W, H); c.setTransform(SC, 0, 0, SC, 0, 0);
    c.save(); (L[0] === 'intro' ? JQ.intro : JQ.outro)(c, L[2], Sx); c.restore();
  };
  // the title card, drawn by the engine over the picture, on the screen (not pushed by the camera)
  const titles = L => { if (L[0] !== 'term' || !JQ.titleCard) return; g.save(); g.setTransform(SC, 0, 0, SC, 0, 0); JQ.titleCard(g, L[1], L[2], Sx); g.restore(); };
  const focus0 = n => { const A = JQ.ART[n]; return (A && A.focus && A.focus[0]) || [960, 600]; };

  window.__renderAt = t => {
    t = JQ.clamp(t, 0, F.DUR);
    // find the boundary we are near (incoming side)
    let bIn = null;
    for (let n = 1; n <= 24 + (F.LOOP ? 0 : 1); n++) {
      const tb = n <= 24 ? F.start(n) : F.TEND;
      if (n === 1 && !F.LOOP && tb === 0) continue;
      if (t >= tb - XIN && t < tb + XOUT) { bIn = { n, tb }; break; }
    }
    if (F.LOOP && (t < XOUT || t >= F.DUR - XIN)) bIn = { n: 1, tb: t < XOUT ? 0 : F.DUR };
    if (!bIn) { const L = layerAt(t); drawLayer(g, L); titles(L); return; }
    const p = (t - (bIn.tb - XIN)) / (XIN + XOUT);
    // the outgoing layer keeps running past the boundary (styles clamp at 9 s)
    const before = F.LOOP && bIn.tb === 0 ? ['term', 24, F.TERM + t] : bIn.n === 1 && !F.LOOP ? ['intro', 0, Math.min(t, F.T0 - 1e-3)]
      : bIn.n === 1 ? ['term', 24, t - F.start(24)] : ['term', bIn.n - 1, t - F.start(bIn.n - 1)];
    const after = bIn.n === 25 ? ['outro', 0, Math.max(0, t - F.TEND)] : ['term', bIn.n, t - bIn.tb];
    drawLayer(LA.g, before); drawLayer(LB.g, after);
    g.setTransform(1, 0, 0, 1, 0, 0); g.drawImage(LA.c, 0, 0);
    // the incoming term's phenomenon carries the new picture in (rain, wind, frost, ice …); intro → 立春 grows from the dial's centre
    let M;
    if (bIn.n === 25 || (bIn.n === 1 && !F.LOOP)) M = { path: blob(960, 540, p, bIn.n * 13), overlay: null };
    else M = JQ.transMask(bIn.n, p, SC);
    g.save(); g.clip(M.path); g.drawImage(LB.c, 0, 0); g.restore();
    // the last 20 % of every transition cross-fades whatever the phenomenon left uncovered and fades its overlay,
    // so nothing snaps when the transition ends
    const fin = JQ.smooth(0.8, 1, p); if (fin > 0) { g.save(); g.globalAlpha = fin; g.drawImage(LB.c, 0, 0); g.restore(); }
    if (M.overlay) { g.save(); g.globalAlpha = (1 - fin) * JQ.smooth(0, 0.06, p); M.overlay(g); g.restore(); }
    titles(after);
  };
  // pentad and accent times for the score and for checks: [{ n, k, t }] plus each term's key impact (beat 3 of its key pentad)
  F.events = () => Array.from({ length: 24 }, (_, i) => { const n = i + 1, A = JQ.ART[n] || {}, kh = A.keyHou != null ? A.keyHou : JQ.TERMS[i].keyHou; return { n, start: F.start(n), keyHou: kh, impact: F.start(n) + kh * F.BAR + 2 * F.BEAT }; });
})();
