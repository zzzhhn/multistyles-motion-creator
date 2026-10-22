// dsp.cjs: loudness (ITU-R BS.1770-4 K-weighting, gated integrated), high-pass, true-peak look-ahead limiter and the
// -14 LUFS master (ceiling -1.35 dBFS on 4x-oversampled peaks), copied verbatim from the approved v1 renderer
// artlock/audio-jq.js (lines 40-72 and 102-165).
'use strict';
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
// v11 master; cyc (the loop): mastered as a cycle, i.e. on [last 1 s][loop][first 1 s] and cropped, so the high-pass and the
// limiter see the join as the music continuing, and no fades
function master(mix, SR, stats, cyc) {
  const N = mix.L.length, P = cyc ? Math.min(N, Math.round(SR)) : 0, CEIL = Math.pow(10, -1.35 / 20), TARGET = -14;
  const ext = x => { if (!P) return x; const y = new Float32Array(N + 2 * P); y.set(x.subarray(N - P), 0); y.set(x, P); y.set(x.subarray(0, P), N + P); return y; };
  const L = ext(mix.L), R = ext(mix.R), M = L.length;
  highpass(L, SR, 22); highpass(R, SR, 22);
  stats.preLufs = +integrated(L, R, SR).toFixed(2);
  let I = stats.preLufs, gr = 0;
  for (let it = 0; it < 4; it++) {
    const g = Math.pow(10, (TARGET - I) / 20);
    for (let j = 0; j < M; j++) { L[j] *= g; R[j] *= g; }
    gr = Math.min(gr, limit(L, R, SR, CEIL));
    I = integrated(L, R, SR);
    if (Math.abs(I - TARGET) < 0.12) break;
  }
  if (P) { mix.L = L.slice(P, P + N); mix.R = R.slice(P, P + N); }
  else {
    const fi = Math.round(0.004 * SR), fo = Math.round(1.5 * SR);
    for (let j = 0; j < fi; j++) { const e = j / fi; L[j] *= e; R[j] *= e; }
    for (let j = 0; j < fo; j++) { const q = N - fo + j, e = 0.5 + 0.5 * Math.cos(Math.PI * j / fo); L[q] *= e; R[q] *= e; }
  }
  let pk = 0; for (let j = 0; j < N; j++) pk = Math.max(pk, Math.abs(mix.L[j]), Math.abs(mix.R[j]));
  Object.assign(stats, { lufs: +integrated(mix.L, mix.R, SR).toFixed(2), maxGainReductionDb: +gr.toFixed(2), limiterPct: limit.last, samplePeakDb: +(20 * Math.log10(pk)).toFixed(2) });
}
module.exports = { kEnergy, gated, LK, loudness, highpass, limit, integrated, master };
