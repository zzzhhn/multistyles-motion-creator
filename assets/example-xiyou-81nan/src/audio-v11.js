// audio-v11.js — renderer for the hand-written v11 lead sheet (src/score-v11.js, window.XY.SCORE_V11). It renders, it does
// not compose: every section, block, chord, bass note, melody note, lead and layer comes from the lead sheet. This file only
// voices the pad / choir (close position C4..Bb4, no doubling of a sounding melody pitch, smallest motion bar to bar), spells
// the lead sheet's layer vocabulary, sets levels from the dyn ramps and mixes.
// Contract (as audio.js): RSAudio.render(sr) -> Promise<stereo AudioBuffer>. Cells, hits, intro/outro times come from XY at
// render time; with ?cells=... only the bars of the present cells are rendered (each at its full-film musical position).
// Intro (bars 1-3) and outro (bars 172-175) are v10's composeIntro / composeFinale copied verbatim and rendered with v10's
// chunk code, seeds and conductor state, so their chunks are sample-identical to v10's (compare stats.chunks hashes).
// Engine copied from audio.js v10: chunked OfflineContexts, binary summing chains (<= 2 live inputs per node), seeded
// Math.random while graphs are built, one shared hall, master to -14 LUFS with a true-peak limiter.
(() => {
  'use strict';
  const XY = window.XY;
  const VERSION = 'v11-leadsheet-1';
  const hz = m => 440 * Math.pow(2, (m - 69) / 12);
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));

  // ---------------------------------------------------------------- notation (from audio.js v10)
  const PC = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
  const note = s => { const m = /^([A-G])(bb|b|#|x)?(-?\d)$/.exec(s); if (!m) throw new Error('RSAudio v11: bad note ' + s);
    const acc = { b: -1, bb: -2, '#': 1, x: 2 }[m[2]] || 0; return 12 * (+m[3] + 1) + PC[m[1]] + acc; };
  const pcOf = s => { const m = /^([A-G])(b|#)?/.exec(s); return (PC[m[1]] + (m[2] === 'b' ? -1 : m[2] === '#' ? 1 : 0) + 12) % 12; };
  const QUAL = { '': [0, 4, 7], m: [0, 3, 7], 7: [0, 4, 7, 10], maj7: [0, 4, 7, 11], m7: [0, 3, 7, 10], m6: [0, 3, 7, 9], 6: [0, 4, 7, 9],
    sus4: [0, 5, 7], sus2: [0, 2, 7], add9: [0, 4, 7, 14], madd9: [0, 3, 7, 14], '7sus4': [0, 5, 7, 10], m9: [0, 3, 7, 10, 14], 9: [0, 4, 7, 10, 14], dim: [0, 3, 6], 5: [0, 7] };
  function chord(s) {
    const [head, slash] = s.split('/'), m = /^([A-G](?:b|#)?)(.*)$/.exec(head);
    const root = pcOf(m[1]), q = QUAL[m[2]];
    if (!q) throw new Error('RSAudio v11: unknown chord quality ' + s);
    const tones = q.map(x => (root + x) % 12);
    return { name: s, root, tones, core: tones.slice(0, 3), third: (root + q[1]) % 12, i3: q[1], i5: q[2], add9: q.includes(14), bass: slash ? pcOf(slash) : root };
  }
  const inRange = (pcs, lo, hi) => { const out = []; for (let m = lo; m <= hi; m++) if (pcs.includes(m % 12)) out.push(m); return out; };

  // ---------------------------------------------------------------- v10 intro and finale, copied verbatim from audio.js
  // (composeIntro / composeFinale and the constants they read). Do not edit: the user signed off on this outro.
  const INTRO_E = 1.5, FINALE_E = 7.5;
  const tgt = e => -33 + 2.1 * e;                                 // energy -> loudness target (LUFS before the master)
  const dynOf = e => clamp(0.1 + 0.085 * e, 0.12, 0.96);          // energy -> conductor dynamic 0..1
  function composeIntro() {
    const T0 = XY.SCROLL_T0, ev = [], z = Math.max(0, T0 - 3.5);
    ev.push({ s: 'cb', t: 0, d: T0, m: 38, v: 0.32, art: 'leg', att: 0.8, cres: [0.2, 0.42] });
    ev.push({ s: 'vc', t: 0.05, d: T0 - 0.05, m: 50, v: 0.3, art: 'leg', att: 1.0, cres: [0.18, 0.4] });
    ev.push({ s: 'vc', t: 2.9, d: T0 - 2.9, m: 57, v: 0.28, art: 'leg', att: 1.4, cres: [0.15, 0.36] });
    [86, 93].forEach(m => ev.push({ s: 'vn1', t: 2.9, d: T0 - 2.9, m, v: 0.32, art: 'harm', cres: [0.2, 0.36] }));
    [62, 65, 67, 72, 69, 67, 70, 72, 77].forEach((m, r) => { const t = 0.4 + r * 0.29; ev.push({ s: 'harp', t, m, v: 0.42 + 0.02 * r }); ev.push({ s: 'cel', t: t + 0.004, m: m + 12, v: 0.22 }); });
    ev.push({ s: 'timp', t: 1.9, m: 38, v: 0.42 }); ev.push({ s: 'pzcb', t: 1.9, m: 38, v: 0.5 });
    [[57, 'vla'], [62, 'vn2'], [69, 'vn2']].forEach(([m, s]) => ev.push({ s, t: z, d: T0 - z, m, v: 0.4, art: 'leg', att: 1.2, cres: [0.12, 0.42] }));   // A3 D4 A4 (was a E4-F4 cluster)
    ev.push({ s: 'cym', t: T0, swell: Math.min(3, T0 - 1), v: 0.42, at: T0 - 0.01 });
    ev.push({ s: 'timp', t: T0 - 1.8, d: 1.8, m: 38, roll: [0.08, 0.36], v: 0.36 }); ev.push({ s: 'timp', t: T0, m: 38, v: 0.3, at: T0 - 0.01 });
    const gl = inRange([2, 5, 7, 9, 0], 57, 86); gl.forEach((m, k) => ev.push({ s: 'harp', t: T0 - 0.62 + k * 0.6 / gl.length, m, v: 0.38 }));
    return { ev, choir: [], t0: 0, t1: T0, target: tgt(INTRO_E) };
  }
  function composeFinale() {
    const T1 = XY.SCROLL_T1, B = XY.BEAT, len = XY.DURATION - T1, arrive = 8 * B, hold = len - arrive - 0.02, ev = [];
    [[46, 34], [48, 36], [50, 38]].forEach(([vc, cb], k) => { const t = T1 + k * 4 * B, d = k < 2 ? 4 * B : len - 8 * B; ev.push({ s: 'vc', t, d, m: vc, v: 0.4, art: 'leg' }); ev.push({ s: 'cb', t, d, m: cb, v: 0.42, art: 'leg' }); });
    ev.push({ s: 'timp', t: T1 + 6 * B, d: 2 * B, m: 38, roll: [0.08, 0.42], v: 0.42 }); ev.push({ s: 'timp', t: T1 + arrive, m: 38, v: 0.45 });
    const gl = inRange([2, 4, 6, 9, 11], 62, 86); gl.forEach((m, k) => ev.push({ s: 'harp', t: T1 + arrive - 0.6 + k * 0.6 / gl.length, m, v: 0.4 }));
    const tone = (bus, origin) => {
      const R = window.RSInst, o = T1 - origin, nbh = { up: m => m + 2, down: m => m - 2 };
      const info = { n: 82, style: 'outro', P: 5, B, beats: len / B, dur: len, end: len - 0.02 + o, rng: XY.rng(1602), jit: () => 0, up: nbh.up, down: nbh.down,
        chords: [{ b0: 0, b1: 99, root: 2, tones: [2, 6, 9, 4] }], chordAt: () => ({ tones: [2, 6, 9, 4] }), tonicPc: 2, bass: 38, bassHz: hz(38) };
      const choir = R.make('choir', bus, { send: 1.5 }), low = R.make('stringsPad', bus, { send: 1.2 });
      choir.eng.chord(o, [58, 62, 65, 72], 4 * B - 0.05, 0.8); choir.eng.chord(o + 4 * B, [60, 64, 67, 74], 4 * B - 0.05, 0.85); choir.eng.chord(o + arrive, [57, 62, 66, 69, 76], hold, 0.9);
      low.eng.chord(o, [46, 53], 4 * B - 0.05, 0.7); low.eng.chord(o + 4 * B, [48, 55], 4 * B - 0.05, 0.75); low.eng.chord(o + arrive, [38, 45, 50], hold, 0.8);
      R.make('strings', bus, { send: 1.3 }).lead([{ t: o, m: 62, d: B, v: 0.8 }, { t: o + B, m: 65, d: B, v: 0.75 }, { t: o + 2 * B, m: 67, d: 2 * B, v: 0.85 },
        { t: o + 4 * B, m: 72, d: 4 * B, v: 0.9 }, { t: o + arrive, m: 74, d: hold - 0.3, v: 1 }], info);
      const bell = R.make('bianzhong', bus, { pan: 0.2, send: 1.8 }), gong = R.make('churchBell', bus, { pan: -0.1, send: 1.6 });
      bell.eng.strike(o + 6 * B, 79, 2.5, 0.45);                   // the seal 九九归真 (outro +4.0 s)
      bell.eng.strike(o + arrive, 74, 3.5, 0.9); bell.eng.strike(o + arrive + 2 * B, 81, 3, 0.5); gong.eng.strike(o + arrive, 38, 4, 0.7);
    };
    return { ev, choir: [], tone, t0: T1, t1: XY.DURATION, target: tgt(FINALE_E) };
  }
  // v10's conductor state inside those two chunks (audio.js compose() pushed one brightness point per chord of every cell;
  // orchChunk applied the ones inside each chunk): the intro chunk saw cell 1's bar lines at energy 2, the finale chunk saw
  // the second half of cell 81's last bar (A7, energy 8 -> 7.5). Reproduced here so the two chunks stay bit-identical.
  function v10Conductor() {
    const B = XY.BEAT, C = XY.CELLS, pts = [], c1 = C[0], cz = C[C.length - 1];
    if (c1 && c1.n === 1) for (let k = 0; k < c1.beats / 4; k++) pts.push({ t: c1.t0 + (k * 4 + 0 * 4 / 1) * B, d: dynOf(2 + (2 - 2) * clamp((k * 4 * B) / c1.dur, 0, 1)) });
    if (cz && cz.n === 81 && cz.beats === 12) { const t = cz.t0 + (2 * 4 + 1 * 4 / 2) * B; pts.push({ t, d: dynOf(8 + (FINALE_E - 8) * clamp((t - cz.t0) / cz.dur, 0, 1)) }); }
    return pts;
  }

  // ---------------------------------------------------------------- engine pieces copied from audio.js v10 (unchanged)
  const DIAG = () => window.__RS_DIAG || {};
  const PRE = 2.5, TAILS = 5, STRINGS = ['vn1', 'vn2', 'vla', 'vc', 'cb', 'svn', 'svc'];
  function chainOut(raw, mg, off) {                               // binary summing chain into two merger inputs
    const top = raw.createGain(); top.channelCount = 2; top.channelCountMode = 'explicit'; top.channelInterpretation = 'speakers';
    const sp = raw.createChannelSplitter(2); top.connect(sp); sp.connect(mg, 0, off); sp.connect(mg, 1, off + 1);
    let tail = null; return () => { const g = raw.createGain(); g.connect(tail || top); tail = g; return g; };
  }
  function orchChunk(SR, part, dynPts, seed) {                   // v10 orchestra chunk: dry L/R + hall send L/R
    const origin = Math.max(0, part.t0 - PRE);
    let end = part.t1;
    part.ev.forEach(e => { end = Math.max(end, e.t + (e.d || 0) + TAILS); });
    part.choir.forEach(c => { end = Math.max(end, c.t + c.d + 3); });
    end = Math.min(end, XY.DURATION + 4);
    const len = end - origin, raw = new OfflineAudioContext(4, Math.ceil(len * SR), SR), ctx = new Tone.OfflineContext(raw);
    Tone.setContext(ctx);
    const mg = raw.createChannelMerger(4); mg.connect(raw.destination);
    const outs = { dryIn: chainOut(raw, mg, 0), sendIn: chainOut(raw, mg, 2) };
    const orch = window.RSOrch.create(raw, outs, { rng: XY.rng(seed) });
    const loc = e => Object.assign({}, e, { t: e.t - origin, path: e.path && e.path.map(q => Object.assign({}, q, { t: q.t - origin })), duck: e.duck && e.duck.map(h => h - origin) });
    const only = DIAG().only;
    part.ev.filter(e => !only || only.includes(e.role || 'acc')).sort((a, z) => a.t - z.t).forEach(e => orch.play(e.s, loc(e)));
    const used = new Set(orch.sections());
    dynPts.forEach(p => { if (p.t >= origin && p.t < end) STRINGS.forEach(s => { if (used.has(s)) orch.dyn(s, p.t - origin, p.d); }); });
    if ((part.choir.length || part.tone) && (!only || only.includes('acc'))) {
      const dry = new Tone.Gain(1), snd = new Tone.Gain(1); dry.connect(outs.dryIn()); snd.connect(outs.sendIn());
      const bus = { dry, send: snd, width: 1, sendLevel: 0.45 };
      if (part.choir.length) { const ch = window.RSInst.make('choir', bus, { send: 1.5 }); part.choir.forEach(c => ch.eng.chord(c.t - origin, c.ms, c.d, c.v)); }
      if (part.tone) part.tone(bus, origin);
    }
    orch.finish(len);
    return { raw, ctx, origin, len, part };
  }
  function kCoefs(sr) {                                          // ITU-R BS.1770-4 K-weighting (libebur128's analogue prototypes)
    let K = Math.tan(Math.PI * 1681.974450955533 / sr), Q = 0.7071752369554196;
    const Vh = Math.pow(10, 3.999843853973347 / 20), Vb = Math.pow(Vh, 0.4996667741545416), a0 = 1 + K / Q + K * K;
    const f1 = [(Vh + Vb * K / Q + K * K) / a0, 2 * (K * K - Vh) / a0, (Vh - Vb * K / Q + K * K) / a0, 2 * (K * K - 1) / a0, (1 - K / Q + K * K) / a0];
    K = Math.tan(Math.PI * 38.13547087602444 / sr); Q = 0.5003270373238773;
    const f2 = [1, -2, 1, 2 * (K * K - 1) / (1 + K / Q + K * K), (1 - K / Q + K * K) / (1 + K / Q + K * K)];
    return [f1, f2];
  }
  function kEnergy(l, r, a, z, sr) {                             // mean-square energy of K-weighted L+R per 100 ms hop over [a, z)
    const [f1, f2] = kCoefs(sr), hop = Math.round(sr / 10), nb = Math.max(1, Math.floor((z - a) / hop)), e = new Float64Array(nb);
    for (const x of [l, r]) {
      let x1 = 0, x2 = 0, y1 = 0, y2 = 0, u1 = 0, u2 = 0, w1 = 0, w2 = 0;
      const end = Math.min(z, a + nb * hop);
      for (let j = a; j < end; j++) {
        const v = x[j], y = f1[0] * v + f1[1] * x1 + f1[2] * x2 - f1[3] * y1 - f1[4] * y2; x2 = x1; x1 = v; y2 = y1; y1 = y;
        const w = y - 2 * u1 + u2 - f2[3] * w1 - f2[4] * w2; u2 = u1; u1 = y; w2 = w1; w1 = w;
        e[((j - a) / hop) | 0] += w * w;
      }
    }
    for (let k = 0; k < nb; k++) e[k] /= hop;
    return e;
  }
  const LK = z => -0.691 + 10 * Math.log10(z + 1e-30);
  function gated(e) {                                            // 400 ms blocks, 75 % overlap, -70 LUFS absolute and -10 LU relative gates
    const blk = [];
    if (e.length < 4) { let s = 0; for (const v of e) s += v; blk.push(s / e.length); }
    else for (let k = 0; k + 4 <= e.length; k++) blk.push((e[k] + e[k + 1] + e[k + 2] + e[k + 3]) / 4);
    const g1 = blk.filter(z => LK(z) > -70);
    if (!g1.length) return -Infinity;
    const m1 = g1.reduce((s, z) => s + z, 0) / g1.length, g2 = g1.filter(z => LK(z) > LK(m1) - 10);
    return LK(g2.reduce((s, z) => s + z, 0) / g2.length);
  }
  const loudness = (l, r, a, z, sr) => gated(kEnergy(l, r, a, z, sr));
  function hashBuf(buf) {                                       // FNV-1a over the float bits (diagnostics: determinism per chunk)
    let h = 0x811c9dc5;
    for (let c = 0; c < buf.numberOfChannels; c++) { const u = new Uint32Array(buf.getChannelData(c).buffer); for (let i = 0; i < u.length; i++) h = Math.imul(h ^ u[i], 16777619) >>> 0; }
    return h.toString(16);
  }
  function hallIR(ctx, SR) {                                     // one shared hall (native convolver, seeded impulse response)
    const len = Math.round(3.3 * SR), pre = Math.round(0.022 * SR), rt = 2.8, ir = ctx.createBuffer(2, len, SR), rnd = XY.rng(2600);
    for (let c = 0; c < 2; c++) {
      const d = ir.getChannelData(c); let lp = 0, e = 0;
      for (let j = pre; j < len; j++) {
        const t = (j - pre) / SR, a = 1 - Math.exp(-2 * Math.PI * (9000 - 6500 * Math.min(1, t / 1.8)) / SR);   // highs die first
        lp += a * ((rnd() * 2 - 1) - lp); d[j] = lp * Math.exp(-6.91 * t / rt) * Math.min(1, t / 0.012); e += d[j] * d[j];
      }
      [0.011, 0.023, 0.031, 0.047, 0.059].forEach((t, k) => { d[pre + Math.round((t + 0.003 * c) * SR)] += (k % 2 ? -1 : 1) * 0.35 * Math.sqrt(e / len) * 40 / (k + 2); });
      e = 0; for (let j = 0; j < len; j++) e += d[j] * d[j];
      const s = 1 / Math.sqrt(e); for (let j = 0; j < len; j++) d[j] *= s;
    }
    return ir;
  }
  async function reverb(mix, SR) {
    const N = mix.L.length, raw = new OfflineAudioContext(2, N, SR), src = raw.createBufferSource(), b = raw.createBuffer(2, N, SR);
    b.copyToChannel(mix.SL, 0); b.copyToChannel(mix.SR, 1); src.buffer = b;
    const conv = raw.createConvolver(); conv.normalize = false; conv.buffer = hallIR(raw, SR);
    const hp = raw.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 110; hp.Q.value = 0.6;
    src.connect(hp); hp.connect(conv); conv.connect(raw.destination); src.start(0);
    const wet = await raw.startRendering(), wl = wet.getChannelData(0), wr = wet.getChannelData(1), WET = 0.62;
    for (let j = 0; j < N; j++) { mix.L[j] += WET * wl[j]; mix.R[j] += WET * wr[j]; }
    mix.SL = mix.SR = null;
  }
  function highpass(x, SR, fc) {                                 // 2nd-order Butterworth (RBJ), removes DC and sub-sonics
    const w = 2 * Math.PI * fc / SR, al = Math.sin(w) / Math.SQRT2, c = Math.cos(w), a0 = 1 + al;
    const b0 = (1 + c) / 2 / a0, b1 = -(1 + c) / a0, a1 = -2 * c / a0, a2 = (1 - al) / a0;
    let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
    for (let j = 0; j < x.length; j++) { const v = x[j], y = b0 * v + b1 * x1 + b0 * x2 - a1 * y1 - a2 * y2; x2 = x1; x1 = v; y2 = y1; y1 = y; x[j] = y; }
  }
  const SINC = [0.25, 0.5, 0.75].map(p => { const k = []; for (let j = -7; j <= 8; j++) { const x = j - p; k.push(Math.sin(Math.PI * x) / (Math.PI * x) * (0.5 + 0.5 * Math.cos(Math.PI * x / 8.5))); } return k; });
  function peakEnv(L, R, thr) {                                  // |x| including 4x-oversampled inter-sample peaks where it matters
    const N = L.length, p = new Float32Array(N);
    for (let j = 0; j < N; j++) p[j] = Math.max(Math.abs(L[j]), Math.abs(R[j]));
    for (const x of [L, R]) for (let j = 7; j < N - 9; j++) {
      if (p[j] < thr && p[j + 1] < thr) continue;
      for (const k of SINC) { let v = 0; for (let q = 0; q < 16; q++) v += x[j - 7 + q] * k[q]; v = Math.abs(v); if (v > p[j]) p[j] = v; }
    }
    return p;
  }
  function limit(L, R, SR, ceil) {                               // look-ahead peak limiter: min over +-1.5 ms, box smoothing, 80 ms release
    const N = L.length, la = Math.round(0.0015 * SR), p = peakEnv(L, R, ceil * 0.7);
    for (let j = 0; j < N; j++) p[j] = p[j] > ceil ? ceil / p[j] : 1;
    const m = new Float32Array(N), dq = new Int32Array(N); let h = 0, t = 0;
    for (let j = 0; j < N + la; j++) {
      if (j < N) { while (t > h && p[dq[t - 1]] >= p[j]) t--; dq[t++] = j; }
      const c = j - la; if (c < 0) continue;
      while (dq[h] < c - la) h++;
      m[c] = p[dq[h]];
    }
    const half = Math.max(1, la >> 1), rel = 1 - Math.exp(-1 / (0.08 * SR));
    let acc = 0, g = 1, minG = 1, n1 = 0, n3 = 0;
    for (let j = 0; j < N + half; j++) {
      if (j < N) acc += m[j]; if (j - 2 * half - 1 >= 0) acc -= m[j - 2 * half - 1];
      const c = j - half; if (c < 0) continue;
      const box = acc / Math.min(2 * half + 1, j + 1);
      g = box < g ? box : g + (box - g) * rel;
      L[c] *= g; R[c] *= g; if (g < minG) minG = g; if (g < 0.891) n1++; if (g < 0.708) n3++;
    }
    limit.last = { over1dB: +(n1 / N * 100).toFixed(3), over3dB: +(n3 / N * 100).toFixed(3) };
    return 20 * Math.log10(minG);
  }
  function integrated(L, R, SR) { return gated(kEnergy(L, R, 0, L.length, SR)); }
  function master(mix, SR, stats) {
    const L = mix.L, R = mix.R, N = L.length, CEIL = Math.pow(10, -1.35 / 20), TARGET = -14;
    highpass(L, SR, 22); highpass(R, SR, 22);
    stats.preLufs = +integrated(L, R, SR).toFixed(2);
    let I = stats.preLufs, gr = 0;
    for (let it = 0; it < 4; it++) {
      const g = Math.pow(10, (TARGET - I) / 20);
      for (let j = 0; j < N; j++) { L[j] *= g; R[j] *= g; }
      gr = Math.min(gr, limit(L, R, SR, CEIL));
      I = integrated(L, R, SR);
      if (Math.abs(I - TARGET) < 0.12) break;
    }
    const fi = Math.round(0.004 * SR), fo = Math.round(1.5 * SR);
    for (let j = 0; j < fi; j++) { const e = j / fi; L[j] *= e; R[j] *= e; }
    for (let j = 0; j < fo; j++) { const q = N - fo + j, e = 0.5 + 0.5 * Math.cos(Math.PI * j / fo); L[q] *= e; R[q] *= e; }
    let pk = 0; for (let j = 0; j < N; j++) pk = Math.max(pk, Math.abs(L[j]), Math.abs(R[j]));
    Object.assign(stats, { lufs: +integrated(L, R, SR).toFixed(2), maxGainReductionDb: +gr.toFixed(2), limiterPct: limit.last, samplePeakDb: +(20 * Math.log10(pk)).toFixed(2) });
  }
  const idle = () => new Promise(r => setTimeout(r, 0));
  function addOrch(mix, ch, buf, SR, stats) {                     // v10: one calibrated gain per chunk (no ride: intro / outro have no cells)
    const p = ch.part, i0 = Math.round(ch.origin * SR), n = buf.length, N = mix.L.length;
    const a = Math.round((p.t0 - ch.origin) * SR), z = Math.min(n, Math.round((p.t1 - ch.origin) * SR));
    const dl = buf.getChannelData(0), dr = buf.getChannelData(1), sl = buf.getChannelData(2), sr = buf.getChannelData(3);
    const L = loudness(dl, dr, a, z, SR), gdb = isFinite(L) && !DIAG().noRide ? clamp(p.target - L, -12, 12) : 0;
    const fo = Math.round(0.3 * SR), g = Math.pow(10, gdb / 20);
    for (let j = 0; j < n && i0 + j < N; j++) {
      const e = g * (j > n - fo ? (n - j) / fo : 1), q = i0 + j; mix.L[q] += dl[j] * e; mix.R[q] += dr[j] * e; mix.SL[q] += sl[j] * e; mix.SR[q] += sr[j] * e;
    }
    stats.chunks.push({ id: p.id, t0: +p.t0.toFixed(2), t1: +p.t1.toFixed(2), target: +p.target.toFixed(1), measured: +L.toFixed(1), gainDb: +gdb.toFixed(1), events: p.ev.length, hash: hashBuf(buf) });
  }
  function warmNoise(SR) {                                       // Tone caches its noise buffers per page; fill that cache with its own seed
    const ctx = new Tone.OfflineContext(new OfflineAudioContext(1, 256, SR));
    Tone.setContext(ctx);
    ['white', 'pink', 'brown'].forEach(type => { const nz = new Tone.Noise(type); nz.start(0); nz.stop(0.001); });
  }

  // ================================================================ v11: the lead sheet on the film's bar grid
  // dyn 1 (pp) .. 8 (ff) -> short-term loudness target before the master [brief: -30 -27 -24 -21 -18 -15 -12 -10 LUFS]
  const TL = d => { d = clamp(d, 1, 8); return d <= 7 ? -30 + 3 * (d - 1) : -12 + 2 * (d - 7); };
  const velOf = d => clamp(0.35 + 0.085 * (d - 1), 0.3, 0.96);   // timbre velocity (brass / pluck brightness) for a dyn
  const brightOf = d => 0.15 + 0.8 * clamp((d - 1) / 7, 0, 1);    // string-section brightness (RSOrch dyn) for a dyn
  const HOLD = { chords: ['Dmadd9'], bass: ['D2'] };              // HOLD_DM: Dm(add9) tutti, choir 'ah', the melody holds (tie)
  const SPECIAL = { INTRO: 3, OUTRO: 4, HOLD_DM: 1 };
  // layers as the lead sheet names them -> mix level relative to the melody (dB, renormalised per section so the section's
  // layers sum to its dyn target). chip: the arp level -6 dB, as the lead sheet's vocabulary says.
  const LAYER_DB = { mel: 0, pad: -4, choir: -4, tremolo: -5, bass: -4, horns: -6, arp: -8, zheng: -8, hpsd: -8, chip: -14, ost: -6, pizz: -8, timp: -10, perc: -9, bells: -12 };
  const layerDb = (sec, L) => (L === 'chip' && sec.chipDb != null ? sec.chipDb : LAYER_DB[L]);
  const TONE_ARP = { arp: 'harp', zheng: 'guzheng', hpsd: 'harpsichord', chip: 'chipSoft' };
  const LEADS = { violins: { s: 'vn1', k: 0 }, violas8vb: { s: 'vla', k: -12 }, horns: { s: 'hn', k: 0 }, horns8vb: { s: 'hn', k: -12 },
    violinSolo: { s: 'svn', k: 0 }, celloSolo: { s: 'svc', k: 0 }, xun: { tone: 'xun', k: 0 }, piano: { tone: 'piano', k: 0 } };
  const HIT_SWELL_DB = -9, HIT_IMPACT_DB = -5;                   // hits vs the bed: a soft swell and impact, no stabs

  function layoutScore() {
    const S = XY.SCORE_V11, B = XY.BEAT, BAR = 4 * B;
    if (!S) throw new Error('RSAudio v11: score-v11.js is not loaded (XY.SCORE_V11)');
    if (Math.abs(60 / S.bpm - B) > 1e-9) throw new Error('RSAudio v11: lead sheet bpm ' + S.bpm + ' does not match XY.BEAT ' + B);
    Object.entries(S.blocks).forEach(([k, b]) => {
      if (b.bass.length !== b.chords.length) throw new Error(`lead sheet: block ${k} has ${b.chords.length} chords but ${b.bass.length} bass notes`);
      b.chords.forEach(chord); b.bass.forEach(note);
      ['mel', 'melA', 'melB'].forEach(f => { if (!b[f]) return; const beats = b[f].reduce((a, n) => a + n[1], 0);
        if (Math.abs(beats - 4 * b.chords.length) > 1e-9) throw new Error(`lead sheet: block ${k}.${f} has ${beats} beats for ${b.chords.length} bars`); b[f].forEach(n => { if (n[0] !== 'r') note(n[0]); }); });
    });
    const secs = S.sections.map((s, i) => {
      const blk = s.block === 'HOLD_DM' ? HOLD : S.blocks[s.block], len = SPECIAL[s.block] && s.block !== 'HOLD_DM' ? SPECIAL[s.block] : blk && blk.chords.length;
      if (!len) throw new Error('lead sheet: unknown block ' + s.block);
      if (s.mel && !(blk && blk[s.mel])) throw new Error(`lead sheet: section @${s.at} plays ${s.block}.${s.mel}, which does not exist`);
      (s.lead || []).forEach(l => { if (!LEADS[l]) throw new Error('RSAudio v11: no voice for lead ' + l); });
      const layers = s.block === 'HOLD_DM' ? ['pad', 'choir', 'bass'] : (s.layers || []);
      layers.forEach(l => { if (LAYER_DB[l] == null) throw new Error('RSAudio v11: no recipe for layer ' + l); });
      return Object.assign({}, s, { i, len, end: s.at + len, blk, layers, dyn: s.dyn || [1, 1], s0: (s.at - 1) * BAR, s1: (s.at - 1 + len) * BAR });
    });
    secs.forEach((s, i) => { const nx = secs[i + 1]; if (nx && nx.at !== s.end) throw new Error(`lead sheet: section ${s.block} @${s.at} ends at bar ${s.end}, next starts at ${nx.at}`); });
    if (secs[0].at !== 1 || secs[secs.length - 1].end - 1 !== S.bars) throw new Error('lead sheet: sections do not tile bars 1..' + S.bars);
    return secs;
  }
  // score bars -> film seconds. Runs = contiguous stretches present in the film (all of it unless ?cells= picks a subset).
  function filmRuns(secs) {
    const B = XY.BEAT, BAR = 4 * B, all = XY.ALL_CELLS || XY.CELLS, cellBar = {};
    const intro = secs.find(s => s.block === 'INTRO'), outro = secs.find(s => s.block === 'OUTRO');
    if (!intro || intro.len * 4 !== XY.INTRO_BEATS) throw new Error('lead sheet: INTRO is not the film intro (' + XY.INTRO_BEATS + ' beats)');
    let bar = intro.end;
    all.forEach(c => { if (c.beats % 4) throw new Error('cell ' + c.n + ' is not a whole number of bars'); cellBar[c.n] = bar; bar += c.beats / 4; });
    if (!outro || outro.at !== bar || outro.len * 4 !== XY.OUTRO_BEATS) throw new Error('lead sheet: OUTRO at bar ' + (outro && outro.at) + ' but the cells end at bar ' + bar);
    const runs = [], push = (b0, b1, f0) => { const r = runs[runs.length - 1];
      if (r && r.b1 === b0 && Math.abs(r.f0 + (r.b1 - r.b0) * BAR - f0) < 1e-6) r.b1 = b1; else runs.push({ b0, b1, f0 }); };
    push(1, intro.end, 0);
    XY.CELLS.forEach(c => push(cellBar[c.n], cellBar[c.n] + c.beats / 4, c.t0));
    push(outro.at, outro.end, XY.SCROLL_T1);
    if (XY.CELLS.length === all.length && runs.length !== 1) throw new Error('lead sheet: the film\'s cells do not sit on the lead sheet\'s bar grid');
    const last = runs[runs.length - 1];
    if (Math.abs(last.f0 + (last.b1 - last.b0) * BAR - XY.DURATION) > 1e-6) throw new Error('lead sheet: bar 175 does not end at XY.DURATION');
    runs.forEach(r => { r.s0 = (r.b0 - 1) * BAR; r.s1 = (r.b1 - 1) * BAR; r.map = s => r.f0 + (s - r.s0); r.unmap = f => r.s0 + (f - r.f0); });
    return { runs, cellBar };
  }
  // dyn of a section at score time s (seconds), linear across the section
  const dynAt = (sec, s) => sec.dyn[0] + (sec.dyn[1] - sec.dyn[0]) * clamp((s - sec.s0) / (sec.s1 - sec.s0), 0, 1);
  // close position: every chord tone in C4..Bb4 (Bb4 is the one note over A4: it keeps the roots of Bb and Gm, which have no
  // close voicing inside C4..A4). add9 (HOLD_DM only here): the triad in that window plus the 9th above the root, as in the outro.
  const PAD_LO = 60, PAD_HI = 70;
  function padNotes(ch) {
    if (!ch.add9) return inRange(ch.tones, PAD_LO, PAD_HI);
    const tri = inRange(ch.core, PAD_LO, PAD_HI), r = tri.find(m => m % 12 === ch.root);
    return tri.concat(r != null ? [r + 14] : []);
  }
  // monotone alignment of two ascending voicings, minimising total motion; returns matched index pairs
  function matchVoices(a, b) {
    const n = a.length, m = b.length, C = [], P = [], SKIP = 5;
    for (let i = 0; i <= n; i++) { C.push(new Array(m + 1).fill(1e9)); P.push(new Array(m + 1).fill(null)); }
    C[0][0] = 0;
    for (let i = 0; i <= n; i++) for (let j = 0; j <= m; j++) { const c = C[i][j]; if (c >= 1e9) continue;
      if (i < n && j < m && c + Math.abs(a[i] - b[j]) < C[i + 1][j + 1]) { C[i + 1][j + 1] = c + Math.abs(a[i] - b[j]); P[i + 1][j + 1] = 'm'; }
      if (i < n && c + SKIP < C[i + 1][j]) { C[i + 1][j] = c + SKIP; P[i + 1][j] = 'a'; }
      if (j < m && c + SKIP < C[i][j + 1]) { C[i][j + 1] = c + SKIP; P[i][j + 1] = 'b'; } }
    const pairs = []; let i = n, j = m;
    while (i > 0 || j > 0) { const p = P[i][j]; if (p === 'm') { pairs.push([i - 1, j - 1]); i--; j--; } else if (p === 'a') i--; else j--; }
    return pairs.reverse();
  }
  // voices through a list of bars: bars [{ms, start(m, rank, count) -> ev, cont(ev, m)}]; a voice that has no note in a bar ends
  function voiceTrack(bars) {
    let act = []; const out = [];
    bars.forEach(b => {
      const ms = b.ms.slice().sort((x, y) => x - y), pairs = matchVoices(act.map(x => x.m), ms);
      const keep = new Set(pairs.map(p => p[0])), used = new Set(pairs.map(p => p[1])), next = [];
      act.forEach((x, i) => { if (!keep.has(i)) out.push(x.ev); });
      pairs.forEach(([i, j]) => { b.cont(act[i].ev, ms[j]); next.push({ m: ms[j], ev: act[i].ev }); });
      ms.forEach((m, j) => { if (!used.has(j)) next.push({ m, ev: b.start(m, j, ms.length) }); });
      act = next.sort((x, y) => x.m - y.m);
    });
    act.forEach(x => out.push(x.ev));
    return out;
  }

  // ---------------------------------------------------------------- one section -> layer groups (times in score seconds)
  // group { id, ev: RSOrch events, tone: [{rec, opt, kind: play|strike|chord, items}], dyn: string brightness points,
  //         fresh: the layer was not in the previous section (sustained layers then fade in over 0.3 s) }
  const SUSTAINED = new Set(['pad', 'choir', 'tremolo', 'bass', 'horns']);
  const timpM = ch => 38 + ((ch.root - 2 + 12) % 12);             // timpani D2..C#3: every root of this score is in range
  function genSection(sec, secs) {
    const B = XY.BEAT, BAR = 4 * B, blk = sec.blk, chords = blk.chords.map(chord), bass = blk.bass.map(note);
    const prev = secs[sec.i - 1], next = secs[sec.i + 1], G = {};
    const fresh = L => !prev || !prev.layers.includes(L);
    const grp = id => G[id] || (G[id] = { id, ev: [], tone: [], dyn: [], fresh: SUSTAINED.has(id) && fresh(id) });
    const Tpk = Math.max(TL(sec.dyn[0]), TL(sec.dyn[1]));
    const ampIn = (s2, s) => Math.pow(10, (TL(dynAt(s2, s)) - Tpk) / 20);   // linear level vs this section's loudest point
    const amp = s => ampIn(sec, s), vBow = s => 0.8 * Math.pow(amp(s), 1 / 1.4), vTone = s => 0.7 * amp(s);
    const barT = k => sec.s0 + k * BAR, mid = k => barT(k) + BAR / 2;
    const bright = g => { for (let k = 0; k < sec.len; k++) g.dyn.push({ t: barT(k), d: brightOf(dynAt(sec, barT(k))) }); };
    // ---- melody: the block line, octave-shifted; phrase ends = the last note and, in 8-bar blocks, the note ending bar 4
    const leads = (sec.lead || []).map(l => LEADS[l]), mel = [];
    if (sec.mel) { let b = 0; blk[sec.mel].forEach(([p, d]) => { if (p !== 'r') mel.push({ t: sec.s0 + b * B, d: d * B, m: note(p) + 12 * (sec.oct || 0), b0: b, b1: b + d }); b += d; }); }
    mel.forEach((n, i) => { n.down = Math.abs(n.b0 % 4) < 1e-9; n.pend = i === mel.length - 1 || (sec.len === 8 && Math.abs(n.b1 - 16) < 1e-9); });
    const tie = next && next.block === 'HOLD_DM' && mel.length ? next : null;   // the last note ties through HOLD_DM
    const pitchesIn = k => {                                      // every pitch the leads sound in bar k (all doublings)
      const a = barT(k), z = a + BAR, out = new Set();
      mel.forEach(n => { if (n.t < z - 1e-6 && n.t + n.d > a + 1e-6) leads.forEach(l => out.add(n.m + l.k)); });
      if (sec.block === 'HOLD_DM' && prev && prev.mel) { const pm = prev.blk[prev.mel], last = pm[pm.length - 1];
        (prev.lead || []).forEach(l => out.add(note(last[0]) + 12 * (prev.oct || 0) + LEADS[l].k)); }
      return out;
    };
    function bowedLine(s, k, lv) {                                // one bowed event per phrase: slurs, bow change on a new bar or a repeat
      const out = []; let cur = null;
      mel.forEach((n, i) => {
        const m = n.m + k, v = vBow(n.t) * lv;
        if (!cur) cur = { s, t: n.t, d: n.d, m, v, art: 'leg', role: 'mel', path: [] };
        else { const pm = cur.path.length ? cur.path[cur.path.length - 1].m : cur.m, q = { t: n.t, m, v };
          if (Math.abs(m - pm) > 5) q.slide = 0.09;               // portamento only on leaps larger than a fourth
          if (m === pm || n.down) q.bow = true;
          cur.path.push(q); cur.d = n.t + n.d - cur.t; }
        if (!n.pend) return;
        if (tie && i === mel.length - 1) { for (let j = 0; j < 4; j++) cur.path.push({ t: tie.s0 + j * B, m, v: 0.8 * Math.pow(ampIn(tie, tie.s0 + (j + 0.5) * B), 1 / 1.4) * lv }); cur.d += BAR; }
        else cur.path.push({ t: n.t + 0.35 * n.d, m, v: v * 0.78 });   // gentle diminuendo on the phrase-end note
        out.push(cur); cur = null;
      });
      if (cur) out.push(cur);
      return out;
    }
    function brassLine(k, lv) {                                   // slurred phrase events; re-tongued on a repeat and on the phrase-end note
      const out = []; let cur = null, a0 = 1;
      const open = n => { const v = velOf(dynAt(sec, n.t)); a0 = amp(n.t); cur = { s: 'hn', t: n.t, d: n.d, m: n.m + k, v, g: lv * 0.8 * a0 / Math.pow(v, 1.3), art: 'leg', role: 'mel', path: [] }; };
      const close = (aEnd, x) => { cur.cres = [cur.v, cur.v * Math.pow(aEnd / a0, 1 / 1.3) * (x || 1)]; out.push(cur); cur = null; };
      mel.forEach((n, i) => {
        const m = n.m + k, pm = cur && (cur.path.length ? cur.path[cur.path.length - 1].m : cur.m);
        if (cur && (m === pm || n.pend)) close(amp(n.t));
        if (!cur) open(n);
        else { const q = { t: n.t, m }; if (Math.abs(m - pm) > 5) q.slide = 0.09; cur.path.push(q); cur.d = n.t + n.d - cur.t; }
        if (!n.pend) return;
        if (tie && i === mel.length - 1) { cur.d += BAR; close(ampIn(tie, tie.s1 - 0.01)); }
        else close(amp(n.t + n.d), 0.8);
      });
      if (cur) close(amp(cur.t + cur.d));
      return out;
    }
    const xunLine = (k, lv) => mel.map((n, i) => { const nx = mel[i + 1], pv = mel[i - 1];
      const d = n.d - (n.pend ? 0.08 : nx && nx.m === n.m ? 0.06 : 0);           // breath at a phrase end, re-tongue a repeat
      return { t: n.t, m: n.m + k, d, v: vTone(n.t) * lv, slide: pv && !pv.pend && Math.abs(n.m - pv.m) > 5 ? 0.09 : 0.015, swell: n.pend ? 0.72 : undefined }; });
    const pianoLine = (k, lv) => mel.map(n => ({ t: n.t, m: n.m + k, dur: n.pend ? n.d - 0.02 : n.d + 0.06, v: vTone(n.t) * lv * (n.pend ? 0.85 : 1) }));
    if (mel.length) {
      const g = grp('mel');
      leads.forEach((l, li) => {
        const lv = li ? 0.85 : 1;                                 // a doubling sits a touch under the first-listed lead
        if (l.tone === 'xun') g.tone.push({ rec: 'xun', kind: 'play', items: xunLine(l.k, lv) });
        else if (l.tone === 'piano') g.tone.push({ rec: 'piano', kind: 'strike', items: pianoLine(l.k, lv) });
        else if (l.s === 'hn') g.ev.push(...brassLine(l.k, lv));
        else g.ev.push(...bowedLine(l.s, l.k, lv));
      });
      bright(g); if (tie) g.dyn.push({ t: tie.s0, d: brightOf(tie.dyn[0]) });
    }
    // ---- pad / choir / tremolo voicing per bar: close position, minus any pitch the leads sound in that bar.
    // padOct shifts the pad a whole octave (a low solo then stays the top voice); if stripping the melody's pitches leaves
    // fewer than 3 notes, widen upward with the next chord tones so the bed never thins to one or two notes.
    const po = (sec.padOct || 0) * 12;
    const padBars = chords.map((ch, k) => { const drop = pitchesIn(k), base = padNotes(ch).map(m => m + po);
      let ms = base.filter(m => !drop.has(m - po));
      if (ms.length < 3) { const extra = inRange(ch.tones, PAD_LO + po, PAD_HI + po + 12).filter(m => !ms.includes(m) && !drop.has(m - po));
        ms = ms.concat(extra.slice(0, 3 - ms.length)); }
      return { k, ch, ms: ms.sort((a, b) => a - b), drop }; });
    if (sec.layers.includes('pad')) {                             // violas (lowest voice; two lowest of four) + 2nd violins
      const g = grp('pad');
      g.ev.push(...voiceTrack(padBars.map(b => { const t = barT(b.k), v = vBow(mid(b.k));
        return { ms: b.ms, start: (m, j, n) => ({ s: j < (n >= 4 ? 2 : 1) ? 'vla' : 'vn2', t, d: BAR, m, v, art: 'leg', role: 'pad', path: [], att: b.k ? 0.25 : undefined }),
          cont: (ev, m) => { ev.path.push({ t, m, bow: true, v }); ev.d = t + BAR - ev.t; } }; })));
      bright(g);
    }
    if (sec.layers.includes('choir')) {                           // 'ah' (the existing recipe) when loud and on HOLD_DM, 'oo' when soft
      const g = grp('choir'), rec = sec.block === 'HOLD_DM' || sec.dyn[0] >= 6 ? 'choir' : 'choirOo';
      g.tone.push({ rec, opt: { send: 1.5 }, kind: 'chord', items: padBars.filter(b => b.ms.length).map(b => ({ t: barT(b.k), ms: b.ms, dur: BAR - 0.05, v: vTone(mid(b.k)) })) });
    }
    if (sec.layers.includes('tremolo')) {                         // 2nd violins tremolo, the pad voicing an octave up (minus the leads' pitches)
      const g = grp('tremolo');
      g.ev.push(...voiceTrack(padBars.map(b => { const t = barT(b.k), a0 = amp(t), a1 = amp(t + BAR), v = vBow(t);
        return { ms: b.ms.map(m => m + 12),
          start: m => ({ s: 'vn2', t, d: BAR, m, v, art: 'trem', role: 'pad', a0, cres: [v, v * a1 / a0], path: [] }),
          cont: (ev, m) => { if (m !== (ev.path.length ? ev.path[ev.path.length - 1].m : ev.m)) ev.path.push({ t, m }); ev.d = t + BAR - ev.t; ev.cres[1] = ev.v * a1 / ev.a0; } }; })));
    }
    if (sec.layers.includes('bass')) {                            // basses as written, celli an octave above; whole notes re-bowed each bar
      const g = grp('bass');
      [['cb', 0, 1], ['vc', 12, 0.9]].forEach(([s, k, w]) => { let cur = null;
        for (let b = 0; b < sec.len; b++) { const t = barT(b), m = bass[b] + k, v = vBow(mid(b)) * w;
          const pedal = sec.block === 'S' && b > 0 && b < 4 && bass[b] === bass[b - 1];   // block S: the D pedal is one bow
          if (!cur) cur = { s, t, d: BAR, m, v, art: 'leg', role: 'bass', path: [] };
          else { cur.path.push({ t, m, v, bow: !pedal }); cur.d = t + BAR - cur.t; } }
        g.ev.push(cur); });
      bright(g);
    }
    if (sec.layers.includes('horns')) {                           // horns as a layer: long notes on root + fifth (octave 3)
      const g = grp('horns');
      chords.forEach((ch, b) => { const t = barT(b), v = velOf(dynAt(sec, t)), r = 48 + ch.root;
        [r, r + ch.i5].forEach(m => g.ev.push({ s: 'hn', t, d: BAR - 0.02, m, v, g: 0.7 * amp(t) / Math.pow(v, 1.3), art: 'leg', role: 'horns' })); });
    }
    // ---- arpeggios: 8ths root-5th-8ve-10th-12th-10th-8ve-5th from the bass note's octave + 1, re-voiced (and damped) at each bar
    Object.keys(TONE_ARP).forEach(L => {
      if (!sec.layers.includes(L)) return;
      const g = grp(L), f = fresh(L), items = [];
      chords.forEach((ch, b) => { const r = 12 * (Math.floor(bass[b] / 12) + 1) + ch.root, pat = [0, ch.i5, 12, 12 + ch.i3, 12 + ch.i5, 12 + ch.i3, 12, ch.i5];
        for (let e = 0; e < 8; e++) { const t = barT(b) + e * B / 2;
          items.push({ t, m: r + pat[e], dur: L === 'chip' ? B * 0.4 : barT(b + 1) - t, v: vTone(t) * (e % 2 ? 0.85 : 1) * (f && b === 0 && e === 0 ? 0.7 : 1) }); } });
      g.tone.push({ rec: TONE_ARP[L], kind: 'strike', items });
    });
    if (sec.layers.includes('ost')) {                             // spiccato 8ths [1,1,5,1,8,5,1,5], violas + celli in unison, octave 3
      const g = grp('ost'), f = fresh('ost');
      chords.forEach((ch, b) => { const r = 48 + ch.root, pat = [0, 0, ch.i5, 0, 12, ch.i5, 0, ch.i5];
        for (let e = 0; e < 8; e++) { const t = barT(b) + e * B / 2, v = vBow(t) * (e % 2 ? 0.86 : 1) * (f && b === 0 && e === 0 ? 0.7 : 1);
          ['vla', 'vc'].forEach(s => g.ev.push({ s, t, d: B * 0.42, m: r + pat[e], v, art: 'spic', role: 'ost' })); } });
      bright(g);
    }
    if (sec.layers.includes('pizz')) {                            // celli pizzicato: root on beat 1, fifth on beat 3 (octave 3)
      const g = grp('pizz'), f = fresh('pizz');
      chords.forEach((ch, b) => { const r = 48 + ch.root;
        [[0, r], [2, r + ch.i5]].forEach(([bt, m], j) => { const t = barT(b) + bt * B, v = velOf(dynAt(sec, t));
          g.ev.push({ s: 'pzvc', t, m, v, g: 0.8 * amp(t) / Math.pow(v, 1.2) * (j ? 0.9 : 1) * (f && b === 0 && !j ? 0.7 : 1), role: 'pizz' }); }); });
    }
    if (sec.layers.includes('timp')) {                            // timpani on beat 1, chord root
      const g = grp('timp'), f = fresh('timp');
      chords.forEach((ch, b) => { const t = barT(b); g.ev.push({ s: 'timp', t, m: timpM(ch), v: 0.85 * Math.pow(amp(t), 1 / 1.3) * (f && !b ? 0.7 : 1), role: 'timp' }); });
    }
    if (sec.layers.includes('perc')) {                            // timpani 1 + 3, taiko 1, soft cymbal swell into every 4th bar line
      const g = grp('perc'), f = fresh('perc');
      chords.forEach((ch, b) => { const t = barT(b), m = timpM(ch), a = Math.pow(amp(t), 1 / 1.3), w = f && !b ? 0.7 : 1;
        g.ev.push({ s: 'timp', t, m, v: 0.85 * a * w, role: 'perc' }, { s: 'timp', t: t + 2 * B, m, v: 0.7 * a, role: 'perc' }, { s: 'taiko', t, v: 0.8 * a * w, role: 'perc' }); });
      for (let b = 4; b <= sec.len; b += 4) { const t = barT(b); g.ev.push({ s: 'cym', t, swell: 2 * B, v: 0.6 * Math.pow(amp(t - B), 1 / 1.2), role: 'perc', anchor: t - 2 * B }); }
    }
    if (sec.layers.includes('bells') && mel.length) {             // celesta: the first note of each bar of the melody, an octave up
      const g = grp('bells'), k0 = leads[0] ? leads[0].k : 0;
      for (let b = 0; b < sec.len; b++) { const n = mel.find(x => Math.abs(x.t - barT(b)) < 1e-6); if (n) g.ev.push({ s: 'cel', t: n.t, m: n.m + k0 + 12, v: 0.6, g: amp(n.t), role: 'bells' }); }
    }
    return { sec, groups: Object.values(G), mel, padBars };
  }

  // ---------------------------------------------------------------- pieces: (section x present run), mapped to film time
  function planScore() {
    const secs = layoutScore(), { runs } = filmRuns(secs), B = XY.BEAT, BAR = 4 * B, gen = new Map(), pieces = [];
    secs.forEach(sec => { if (sec.block === 'INTRO' || sec.block === 'OUTRO') return;
      runs.forEach(r => { const b0 = Math.max(sec.at, r.b0), b1 = Math.min(sec.end, r.b1); if (b1 <= b0) return;
        if (!gen.has(sec.i)) gen.set(sec.i, genSection(sec, secs));
        pieces.push(mapPiece(sec, r, b0, b1, gen.get(sec.i))); }); });
    // hits: the first declared hit of each cell, only if it falls in beats 3..7 of the cell (cell-local beats)
    XY.CELLS.forEach(c => {
      const sty = XY.STYLES && XY.STYLES[c.style], hs = sty && Array.isArray(sty.hits) ? sty.hits.filter(x => typeof x === 'number' && isFinite(x)).slice().sort((a, z) => a - z) : [];
      if (!hs.length || !(hs[0] >= 3 && hs[0] <= 7)) return;
      const hb = hs[0], t = c.t0 + hb * B, p = pieces.find(q => t >= q.f0 - 1e-6 && t < q.f1 - 1e-6); if (!p) return;
      const s = p.r.unmap(t), ch = chord(p.sec.blk.chords[clamp(Math.floor((s - p.sec.s0) / BAR + 1e-9), 0, p.sec.len - 1)]), row = Math.ceil(c.n / 9);
      p.hits.push({ n: c.n, hb, t, T: TL(dynAt(p.sec, s)), impact: row !== 5, timp: row !== 5 && Math.abs(hb - Math.round(hb)) <= 0.1 + 1e-9 ? timpM(ch) : null });
    });
    return { secs, runs, pieces };
  }
  function mapPiece(sec, r, b0, b1, G) {
    const B = XY.BEAT, BAR = 4 * B, a = (b0 - 1) * BAR, z = (b1 - 1) * BAR, cut = r.s1;
    const inside = s => s >= a - 1e-6 && s < z - 1e-6;             // events belong to the piece they start in; ties run on while the run does
    const mapEv = e => { const o = Object.assign({}, e, { t: r.map(e.t) });
      if (e.d != null && e.t + e.d > cut) o.d = cut - e.t;
      if (e.path) o.path = e.path.filter(q => q.t < cut - 1e-6).map(q => Object.assign({}, q, { t: r.map(q.t) }));
      return o; };
    const groups = G.groups.map(g => ({ id: g.id,
      ev: g.ev.filter(e => inside(e.anchor != null ? e.anchor : e.t) && e.t <= cut + 1e-6).map(mapEv),
      tone: g.tone.map(tp => Object.assign({}, tp, { items: tp.items.filter(x => inside(x.t)).map(x => { const o = Object.assign({}, x, { t: r.map(x.t) });
        ['d', 'dur'].forEach(k => { if (x[k] != null && x.t + x[k] > cut) o[k] = cut - x.t; }); return o; }) })).filter(tp => tp.items.length),
      dyn: g.dyn.filter(q => inside(q.t)).map(q => ({ t: r.map(q.t), d: q.d })),
      fadeIn: SUSTAINED.has(g.id) && (g.fresh || b0 !== sec.at) })).filter(g => g.ev.length || g.tone.length);
    // section loudness target (power mean over the piece, per beat) and each layer's share of it
    let e = 0, nb = 0; for (let s = a + B / 2; s < z; s += B, nb++) e += Math.pow(10, TL(dynAt(sec, s)) / 10);
    const T = 10 * Math.log10(e / nb), ids = groups.map(g => g.id).concat(sec.block === 'HOLD_DM' ? ['mel'] : []);   // HOLD_DM: the tied melody sounds too
    const norm = 10 * Math.log10(ids.reduce((s, id) => s + Math.pow(10, layerDb(sec, id) / 10), 0));
    groups.forEach(g => { g.target = T + layerDb(sec, g.id) - norm; });
    return { id: sec.block + '@' + b0, sec, r, b0, b1, a, z, f0: r.map(a), f1: r.map(z), T, groups, hits: [] };
  }

  // ---------------------------------------------------------------- piece chunk: 4 channels (dry L/R, hall send L/R) per layer group
  const PRE11 = 0.25;
  const loc = (e, o) => Object.assign({}, e, { t: e.t - o, path: e.path && e.path.map(q => Object.assign({}, q, { t: q.t - o })) });
  function playTone(tp, bus, origin) {
    const e = window.RSInst.make(tp.rec, bus, tp.opt || {}).eng;   // the recipe's engine directly: no idiom ornaments
    if (tp.kind === 'play') e.play(tp.items.map(x => Object.assign({}, x, { t: x.t - origin })));
    else if (tp.kind === 'strike') tp.items.forEach(x => e.strike(x.t - origin, x.m, x.dur, x.v));
    else tp.items.forEach(x => e.chord(x.t - origin, x.ms, x.dur, x.v));
  }
  function pieceChunk(SR, p, seed) {
    const B = XY.BEAT, groups = p.groups.slice();
    if (p.hits.length) {                                          // hits: soft cymbal swell ending on the hit; impact (bass drum, timpani on whole beats)
      groups.push({ id: 'hsw', hit: 'sw', ev: p.hits.map(h => ({ s: 'cym', t: h.t, swell: 1.5 * B, v: 0.6, role: 'hit' })), tone: [], dyn: [] });
      const imp = []; p.hits.forEach(h => { if (!h.impact) return; imp.push({ s: 'bd', t: h.t, v: 0.75, role: 'hit' }); if (h.timp != null) imp.push({ s: 'timp', t: h.t, m: h.timp, v: 0.7, role: 'hit' }); });
      if (imp.length) groups.push({ id: 'himp', hit: 'imp', ev: imp, tone: [], dyn: [] });
    }
    let first = p.f0;                                             // a hit's swell may start before the piece (hit near a bar line)
    groups.forEach(g => g.ev.forEach(e => { first = Math.min(first, e.t - (e.swell || 0)); }));
    const origin = Math.max(0, first - PRE11);
    let end = p.f1;
    groups.forEach(g => { g.ev.forEach(e => { end = Math.max(end, e.t + (e.d || 0) + TAILS); }); g.tone.forEach(tp => tp.items.forEach(x => { end = Math.max(end, x.t + (x.d || x.dur || 0) + TAILS); })); });
    end = Math.min(end, XY.DURATION + 4);
    const len = end - origin, nch = 4 * groups.length;
    if (nch > 32) throw new Error('RSAudio v11: too many layer groups in ' + p.id);
    const raw = new OfflineAudioContext(nch, Math.ceil(len * SR), SR), ctx = new Tone.OfflineContext(raw);
    Tone.setContext(ctx);
    const mg = raw.createChannelMerger(nch); mg.connect(raw.destination);
    groups.forEach((g, k) => {
      const outs = { dryIn: chainOut(raw, mg, 4 * k), sendIn: chainOut(raw, mg, 4 * k + 2) };
      if (g.ev.length) {
        const orch = window.RSOrch.create(raw, outs, { rng: XY.rng(seed + 31 * k) });
        g.ev.slice().sort((x, y) => x.t - y.t).forEach(e => orch.play(e.s, loc(e, origin)));
        const used = new Set(orch.sections());
        g.dyn.forEach(q => STRINGS.forEach(s => { if (used.has(s)) orch.dyn(s, Math.max(0, q.t - origin), q.d); }));
        orch.finish(len);
      }
      if (g.tone.length) {
        const dry = new Tone.Gain(1), snd = new Tone.Gain(1); dry.connect(outs.dryIn()); snd.connect(outs.sendIn());
        const bus = { dry, send: snd, width: 1, sendLevel: 0.45 };
        g.tone.forEach(tp => playTone(tp, bus, origin));
      }
    });
    return { raw, ctx, origin, len, p, groups };
  }
  // each layer group to its target over the piece (gated, dry); hits one by one (impact over 400 ms from the hit, swell
  // over its last 400 ms) against the bed's target at the hit; sustained layers that enter here fade in over 0.3 s
  function addPiece(mix, ch, buf, SR, stats) {
    const p = ch.p, i0 = Math.round(ch.origin * SR), n = buf.length, N = mix.L.length, fo = Math.round(0.3 * SR), fi = Math.round(0.3 * SR);
    const at = t => Math.round((t - ch.origin) * SR), a = at(p.f0), z = Math.min(n, at(p.f1));
    const rec = { id: p.id, t0: +p.f0.toFixed(2), t1: +p.f1.toFixed(2), target: +p.T.toFixed(1), groups: {}, hash: hashBuf(buf) };
    ch.groups.forEach((g, k) => {
      const dl = buf.getChannelData(4 * k), dr = buf.getChannelData(4 * k + 1), sl = buf.getChannelData(4 * k + 2), sr = buf.getChannelData(4 * k + 3);
      let gainAt;
      if (g.hit) {
        const hs = p.hits.filter(h => g.hit === 'sw' || h.impact);
        const regs = hs.map((h, i) => { const w = g.hit === 'sw' ? [at(h.t - 0.4), at(h.t)] : [at(h.t), at(h.t + 0.4)];
          const L = loudness(dl, dr, Math.max(0, w[0]), Math.min(n, w[1]), SR), tg = h.T + (g.hit === 'sw' ? HIT_SWELL_DB : HIT_IMPACT_DB), gdb = isFinite(L) ? clamp(tg - L, -40, 30) : 0;
          return { end: hs[i + 1] ? at((h.t + hs[i + 1].t) / 2) : n, g: Math.pow(10, gdb / 20), L: +L.toFixed(1), db: +gdb.toFixed(1) }; });
        rec.groups[g.id] = regs.map(r => [r.L, r.db]);
        gainAt = j => { for (const r of regs) if (j < r.end) return r.g; return 1; };
      } else {
        const L = loudness(dl, dr, a, z, SR); if (!isFinite(L)) return;
        const gdb = clamp(g.target - L, -30, 30), gg = Math.pow(10, gdb / 20);
        rec.groups[g.id] = [+L.toFixed(1), +gdb.toFixed(1), +g.target.toFixed(1)];
        if (Math.abs(g.target - L) > 30) (stats.clamped = stats.clamped || []).push(p.id + ':' + g.id);
        gainAt = () => gg;
      }
      for (let j = 0; j < n && i0 + j < N; j++) {
        let e = gainAt(j) * (j > n - fo ? (n - j) / fo : 1);
        if (g.fadeIn && j < a + fi) e *= j < a ? 0 : (j - a) / fi;
        const q = i0 + j; mix.L[q] += dl[j] * e; mix.R[q] += dr[j] * e; mix.SL[q] += sl[j] * e; mix.SR[q] += sr[j] * e;
      }
    });
    stats.chunks.push(rec);
  }
  function registerVoices() {                                     // two small helper voices built from existing recipes
    const D = window.RSInst.DEF;
    if (!D.choirOo) D.choirOo = Object.assign({}, D.choir, { formants: [[330, 5, 1], [820, 6, 0.32], [2500, 7, 0.08]], lp: 2400 });   // the choir on 'oo'
    if (!D.chipSoft) D.chipSoft = { eng: 'pluck', pri: 0, oct: 0, osc: { type: 'square' }, decay: 0.28, fbase: 700, foct: 2.2, fsus: 0.25, att: 0.003, rel: 0.05, level: 0.35, pan: 0.2, send: 0.5, voices: 4 };   // soft square-wave chip
  }

  // ---------------------------------------------------------------- render
  async function render(SR = 48000) {
    if (!window.Tone || !window.RSInst || !window.RSOrch) throw new Error('RSAudio v11: Tone.js or audio-inst.js is not loaded');
    const clock = typeof performance !== 'undefined' ? performance.now() : 0;   // statistics only, never musical
    const prevCtx = Tone.getContext(), prevRandom = Math.random, rnd = XY.rng(81);
    const seeded = f => { Math.random = rnd; try { return f(); } finally { Math.random = prevRandom; } };
    const run = async built => Promise.all(built.map(async b => { await b.ctx.workletsAreReady(); return b.raw.startRendering(); }));
    try {
      Math.random = XY.rng(20261019); try { warmNoise(SR); } finally { Math.random = prevRandom; }
      registerVoices();
      const N = Math.round(XY.DURATION * SR), stats = { version: VERSION, sampleRate: SR, cells: XY.CELLS.length, chunks: [] };
      const mix = { L: new Float32Array(N), R: new Float32Array(N), SL: new Float32Array(N), SR: new Float32Array(N) };
      const plan = seeded(() => planScore());
      // intro and outro: v10's own chunks (seeds 4100 / 4110 and the conductor state they had in v10)
      const pts = v10Conductor(), io = [Object.assign(composeIntro(), { id: 'intro' }), Object.assign(composeFinale(), { id: 'finale' })];
      { const built = seeded(() => [orchChunk(SR, io[0], pts, 4100), orchChunk(SR, io[1], pts, 4110)]), bufs = await run(built);
        built.forEach((b, k) => addOrch(mix, b, bufs[k], SR, stats)); await idle(); }
      for (let i = 0; i < plan.pieces.length; i += 4) {
        const built = seeded(() => plan.pieces.slice(i, i + 4).map((p, k) => pieceChunk(SR, p, 5000 + 97 * (i + k)))), bufs = await run(built);
        built.forEach((b, k) => addPiece(mix, b, bufs[k], SR, stats));
        await idle();
      }
      // diagnostics: the summed dry mix per piece against its dyn target; hits and per-cell targets for tools/audio-check.cjs
      stats.sections = plan.pieces.map(p => [p.id, +p.T.toFixed(1), +loudness(mix.L, mix.R, Math.round(p.f0 * SR), Math.min(N, Math.round(p.f1 * SR)), SR).toFixed(1)]);
      stats.hits = plan.pieces.flatMap(p => p.hits.map(h => ({ n: h.n, t: +h.t.toFixed(4), beat: h.hb, impact: h.impact, timp: h.timp })));
      stats.targets = XY.CELLS.map(c => { const p = plan.pieces.find(q => c.t0 + 0.01 >= q.f0 && c.t0 + 0.01 < q.f1), s = p ? p.r.unmap(c.t0 + c.dur / 2) : 0;
        return { n: c.n, mv: Math.ceil(c.n / 9), t0: +c.t0.toFixed(3), t1: +c.t1.toFixed(3), target: p ? +TL(dynAt(p.sec, s)).toFixed(1) : null }; });
      stats.events = plan.pieces.reduce((s, p) => s + p.groups.reduce((u, g) => u + g.ev.length + g.tone.reduce((w, tp) => w + tp.items.length, 0), 0), 0);
      await reverb(mix, SR);
      await idle();
      if (!DIAG().noMaster) master(mix, SR, stats);
      const out = new AudioBuffer({ length: N, numberOfChannels: 2, sampleRate: SR });
      out.copyToChannel(mix.L, 0); out.copyToChannel(mix.R, 1);
      stats.renderS = clock ? +((performance.now() - clock) / 1000).toFixed(2) : null;
      window.RSAudio.lastStats = stats;
      return out;
    } finally {
      Math.random = prevRandom;
      Tone.setContext(prevCtx);
    }
  }
  window.RSAudio = { render, version: VERSION, lastStats: null, _debug: { planScore, layoutScore, filmRuns, genSection, padNotes, chord, note, TL, composeIntro, composeFinale, v10Conductor } };
})();
