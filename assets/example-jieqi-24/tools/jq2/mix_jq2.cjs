// mix_jq2.cjs: dry stems (tools/jq2/render_jq2.py) -> balanced mix -> one Faust jpverb hall (t60 knob 1.65 = T30 2.53 s,
// tools/jq2/hall-t30.cjs) -> fader ride to the dyn targets -> master (-14 LUFS integrated, true peak <= -1 dBTP; dsp.cjs =
// the v1 master) -> 16-bit WAV (deterministic TPDF dither) + stats JSON.
// Usage: node tools/jq2/mix_jq2.cjs <stemdir> <out.wav> <stats.json> [<the full mix's stats.json>: reuse its gains + ride]
// Balance, per section: every layer the section declares is set to (target + role - power sum of the roles present), its
//   level measured as the gated K-weighted loudness of its stem over the section (target = the dyn ramp's mean, brief map
//   -30..-10 LUFS); gains change over 0.3 s at section boundaries. One-shots arrive levelled from render_jq2.py.
// Ride: per bar, dry continuous layers + hall (energies added) against the target at the bar centre; correction clamped
//   to +-6 dB, 3-tap smoothed inside a section, interpolated between bar centres, applied to the whole mix.
'use strict';
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const D = require('./dsp.cjs');
const { hall } = require(path.join(process.env.AUDIO_TOOLS || path.resolve(__dirname, '../../../_audio-tools'), 'node/faust-hall.cjs'));
const [dir, outWav, outJson, fullJson] = process.argv.slice(2);
const meta = JSON.parse(fs.readFileSync(path.join(dir, 'meta.json'))), { SR, N, cyc, bar: BAR } = meta;
const HOP = SR / 10, NH = Math.floor(N / HOP), BLK = SR / 100, WET_DB = 0.5, T60 = 1.65;
const rd = f => { const b = fs.readFileSync(f); return new Float32Array(b.buffer.slice(b.byteOffset, b.byteOffset + b.length)); };
const stem = k => ({ L: rd(path.join(dir, k + '.L.f32')), R: rd(path.join(dir, k + '.R.f32')) });
const T = d => { d = Math.min(8, Math.max(1, d)); return d <= 7 ? -30 + 3 * (d - 1) : -12 + 2 * (d - 7); };
const secs = meta.sections, dB = x => Math.pow(10, x / 20), r1 = x => Math.round(x * 10) / 10;
const dynAt = (s, t) => s.dyn[0] + (s.dyn[1] - s.dyn[0]) * Math.min(1, Math.max(0, (t - s.t0) / (s.t1 - s.t0)));
const secAt = t => secs.find(s => t >= s.t0 - 1e-9 && t < s.t1 - 1e-9) || secs[secs.length - 1];
const full = fullJson ? JSON.parse(fs.readFileSync(fullJson)) : null;
const stats = { mode: meta.mode, duration: N / SR, sampleRate: SR, wetDb: WET_DB, t60knob: T60, renderS: meta.renderS, sections: [] };
const tic = Date.now();

// ---------------------------------------------------------------- 1. per-section balance of the continuous layers
const cont = Object.keys(meta.roles), all = cont.concat(meta.shots), pre = {}, G = {};
for (const k of cont) { const s = stem(k), e = D.kEnergy(s.L, s.R, 0, N, SR);
  pre[k] = secs.map(x => x.active.includes(k) ? D.gated(e.subarray(Math.round(x.t0 * 10), Math.min(NH, Math.round(x.t1 * 10)))) : null); }
secs.forEach((x, i) => {
  const on = cont.filter(k => pre[k][i] != null && isFinite(pre[k][i])), tm = T((x.dyn[0] + x.dyn[1]) / 2);
  const ps = 10 * Math.log10(on.reduce((a, k) => a + Math.pow(10, meta.roles[k] / 10), 0));
  for (const k of cont) { G[k] = G[k] || []; G[k][i] = on.includes(k) ? tm + meta.roles[k] - ps - pre[k][i] : null; }
});
const gains = full ? Object.fromEntries(cont.map(k => [k, secs.map(x => full.gains[k][full.sectionNames.indexOf(x.name)])])) : G;
for (const k of cont) { let last = gains[k].find(g => g != null); if (last == null) last = 0;      // hold through undeclared sections
  gains[k] = gains[k].map(g => (g == null ? last : (last = g))); }
function curve(per) {                       // per-section dB -> per-10 ms block amplitude, 0.3 s cross-fade at boundaries
  const nb = Math.ceil(N / BLK), g = new Float32Array(nb);
  for (let j = 0; j < nb; j++) { const t = (j + 0.5) / 100; let i = secs.indexOf(secAt(t)), v = per[i];
    const tb = secs[i].t1, ta = secs[i].t0, P = n => per[(n + secs.length) % secs.length];
    if (tb - t < 0.15 && (i + 1 < secs.length || cyc)) v += (P(i + 1) - v) * (0.15 - (tb - t)) / 0.3;
    else if (t - ta < 0.15 && (i > 0 || cyc)) v = P(i - 1) + (v - P(i - 1)) * (0.15 + (t - ta)) / 0.3;
    g[j] = dB(v); }
  return g;
}
// ---------------------------------------------------------------- 2. sum: dry mix, hall send, dry continuous (for the ride)
const mixL = new Float32Array(N), mixR = new Float32Array(N), sL = new Float32Array(N), sR = new Float32Array(N);
let cL = new Float32Array(N), cR = new Float32Array(N);
// plucked buses: a variable-ceiling look-ahead limiter at (the bus's balanced section level + CREST dB) tames the
// Đàn Tranh's attack spikes (sample peak / held RMS 14-39 dB) before they reach the master limiter
const CREST = { zarp: 11, zrun: 13, solo: 14, double: 14, drum: 12 }; stats.busLimiterDb = {};
for (const k of all) {
  const s = stem(k), g = cont.includes(k) ? curve(gains[k]) : null, snd = meta.send[k], isC = cont.includes(k);
  if (CREST[k] != null && secs.some((x, i) => x.active.includes(k) && pre[k][i] != null && isFinite(pre[k][i]))) {
    let hold = null; const lvs = secs.map((x, i) => { const v = pre[k][i]; if (v != null && isFinite(v) && x.active.includes(k)) hold = v + gains[k][i]; return hold; });
    const first = lvs.find(v => v != null); const lv = curve(lvs.map(v => (v == null ? first : v) + CREST[k]));
    for (let j = 0; j < N; j++) { const q = (j / BLK) | 0, a = g[q] / lv[q]; s.L[j] *= a; s.R[j] *= a; }
    stats.busLimiterDb[k] = r1(D.limit(s.L, s.R, SR, 1.0));
    for (let j = 0; j < N; j++) { const q = (j / BLK) | 0, a = lv[q] / g[q]; s.L[j] *= a; s.R[j] *= a; }
  }
  for (let j = 0; j < N; j++) { const a = g ? g[(j / BLK) | 0] : 1, l = s.L[j] * a, r = s.R[j] * a;
    mixL[j] += l; mixR[j] += r; sL[j] += l * snd; sR[j] += r * snd; if (isC) { cL[j] += l; cR[j] += r; } }
}
D.highpass(sL, SR, 180); D.highpass(sR, SR, 180); D.highpass(sL, SR, 180); D.highpass(sR, SR, 180);
(async () => {
  const [wL, wR] = await hall(sL, sR, SR, { t60: T60, tail: cyc ? 8 : 0 }), W = dB(WET_DB);
  if (cyc) for (let j = N; j < wL.length; j++) { wL[j - N] += wL[j]; wR[j - N] += wR[j]; }      // the loop: hall tail wraps
  const eC = D.kEnergy(cL, cR, 0, N, SR), eW = D.kEnergy(wL, wR, 0, N, SR); cL = cR = null;
  stats.dryLufs = r1(D.integrated(mixL, mixR, SR));
  for (let j = 0; j < N; j++) { mixL[j] += W * wL[j]; mixR[j] += W * wR[j]; }
  stats.wetLufs = r1(D.gated(eW) + WET_DB);
  // ---------------------------------------------------------------- 3. ride to the dyn targets, bar by bar
  const nbar = Math.round(N / SR / BAR), b0 = secs[0].at, ride = [];
  for (let k = 0; k < nbar; k++) { const c = (k + 0.5) * BAR, s = secAt(c); let e = 0;
    const h0 = Math.round(k * BAR * 10), h1 = Math.min(NH, Math.round((k + 1) * BAR * 10));
    for (let h = h0; h < h1; h++) e += eC[h] + W * W * eW[h];
    ride.push({ bar: b0 + k, sec: s.name, target: T(dynAt(s, c)), meas: D.LK(e / (h1 - h0)) }); }
  ride.forEach(r => { r.raw = Math.max(-6, Math.min(6, r.target - r.meas)); });
  ride.forEach((r, k) => { const nb = [ride[k - 1], r, ride[k + 1]].filter(q => q && q.sec === r.sec);
    r.g = nb.length === 3 ? (nb[0].raw + 2 * r.raw + nb[2].raw) / 4 : nb.reduce((a, q) => a + q.raw, 0) / nb.length; });
  if (full) ride.forEach(r => { const f = full.ride.find(q => q.bar === r.bar); r.g = f.g; });
  const rideAt = t => { const x = t / BAR - 0.5, n = ride.length; let k = Math.floor(x), f = x - k;
    if (!cyc && k < 0) return ride[0].g; if (!cyc && k >= n - 1) return ride[n - 1].g;
    const a = ride[(k + n) % n].g, b = ride[(k + 1 + n) % n].g; return a + (b - a) * f; };
  for (let j = 0; j < N; j += BLK) { const a = dB(rideAt((j + BLK / 2) / SR)); for (let q = j; q < Math.min(N, j + BLK); q++) { mixL[q] *= a; mixR[q] *= a; } }
  stats.ride = ride.map(r => ({ bar: r.bar, sec: r.sec, target: r1(r.target), meas: r1(r.meas), g: r1(r.g) }));
  // ---------------------------------------------------------------- 4. measurements before the master
  const eM = D.kEnergy(mixL, mixR, 0, N, SR), st = (t, w = 3, sub = null, r2 = 0) => { let e = 0, n = 0;
    for (let h = Math.round((t - w / 2) * 10); h < Math.round((t + w / 2) * 10); h++) { const q = cyc ? (h + NH) % NH : h;
      if (q >= 0 && q < NH) { e += eM[q] - (sub ? r2 * sub[q] : 0); n++; } } return D.LK(Math.max(1e-12, e) / Math.max(1, n)); };
  secs.forEach((x, i) => { const ref = ['pad', 'trem', 'drone'].find(k => x.active.includes(k));
    const lv = k => r1(pre[k][i] + gains[k][i]);
    stats.sections.push({ name: x.name, dyn: x.dyn, target: [T(x.dyn[0]), T(x.dyn[1])], shortTermFirstBar: r1(st(x.t0 + BAR / 2)), shortTermLastBar: r1(st(x.t1 - BAR / 2)),
      targetFirstBar: r1(T(dynAt(x, x.t0 + BAR / 2))), targetLastBar: r1(T(dynAt(x, x.t1 - BAR / 2))), solo: lv('solo'), ref, refLevel: ref ? lv(ref) : null,
      soloOverRef: ref ? r1(lv('solo') - lv(ref)) : null, layers: Object.fromEntries(x.active.filter(k => cont.includes(k)).map(k => [k, lv(k)])) }); });
  const acc = stem('accent'), eA = D.kEnergy(acc.L, acc.R, 0, N, SR);
  stats.accents = meta.accents.map(a => { let mx = -Infinity; const r = dB(rideAt(a.t));
    for (let h = Math.round((a.t - 1.6) * 10); h < Math.round((a.t + 1.0) * 10) - 3; h++) { let e = 0; for (let q = h; q < h + 4; q++) e += eA[(q + NH) % NH]; mx = Math.max(mx, D.LK(e / 4) + 20 * Math.log10(r)); }
    const bed = st(a.t, 3, eA, r * r); return Object.assign({}, a, { accentMomentaryMax: r1(mx), bedShortTerm: r1(bed), underBed: r1(bed - mx) }); });
  stats.preMasterLufs = r1(D.integrated(mixL, mixR, SR));
  { const g = dB(-14 - stats.preMasterLufs), c = dB(-1.35), ov = [];                 // where the master limiter will work
    for (let j = 0; j < N; j++) { const v = Math.max(Math.abs(mixL[j]), Math.abs(mixR[j])) * g; if (v > c) { const t = j / SR, o = 20 * Math.log10(v / c);
      const l = ov[ov.length - 1]; if (l && t - l.t < 0.05) { if (o > l.overDb) { l.overDb = o; l.t = t; } } else ov.push({ t, overDb: o }); } }
    stats.masterOvers = ov.sort((a, b) => b.overDb - a.overDb).slice(0, 10).map(o => ({ t: +o.t.toFixed(3), bar: +(o.t / BAR + secs[0].at).toFixed(2), overDb: r1(o.overDb) }));
    stats.masterOverCount = ov.length;
    const cl = Float32Array.from(mixL, v => v * g), cr = Float32Array.from(mixR, v => v * g); D.limit(cl, cr, SR, c);
    stats.limiterFirstPassPct = D.limit.last; }
  // ---------------------------------------------------------------- 5. master, write
  const mix = { L: mixL, R: mixR }; D.master(mix, SR, stats, cyc);
  const pcm = Buffer.alloc(N * 4); let seed = 0x2468ace;
  const rnd = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
  for (let j = 0; j < N; j++) for (const [c, x] of [[0, mix.L], [1, mix.R]]) {
    const v = Math.round(x[j] * 32767 + (rnd() - rnd())); pcm.writeInt16LE(Math.max(-32768, Math.min(32767, v)), 4 * j + 2 * c); }
  const h = Buffer.alloc(44); h.write('RIFF', 0); h.writeUInt32LE(36 + pcm.length, 4); h.write('WAVE', 8); h.write('fmt ', 12); h.writeUInt32LE(16, 16);
  h.writeUInt16LE(1, 20); h.writeUInt16LE(2, 22); h.writeUInt32LE(SR, 24); h.writeUInt32LE(SR * 4, 28); h.writeUInt16LE(4, 32); h.writeUInt16LE(16, 34); h.write('data', 36); h.writeUInt32LE(pcm.length, 40);
  const wav = Buffer.concat([h, pcm]); fs.mkdirSync(path.dirname(path.resolve(outWav)), { recursive: true }); fs.writeFileSync(outWav, wav);
  Object.assign(stats, { sha256: crypto.createHash('sha256').update(wav).digest('hex'), mixS: +((Date.now() - tic) / 1000).toFixed(1), gains, sectionNames: secs.map(x => x.name) });
  fs.writeFileSync(outJson, JSON.stringify(stats, null, 1));
  console.log(`mix_jq2 ${meta.mode}: ${outWav} ${(N / SR).toFixed(3)} s, preMaster ${stats.preMasterLufs} LUFS (dry ${stats.dryLufs}, wet ${stats.wetLufs}), master ${stats.lufs} LUFS, ` +
    `sample peak ${stats.samplePeakDb} dB, max GR ${stats.maxGainReductionDb} dB, ${stats.mixS} s, sha256 ${stats.sha256.slice(0, 16)}`);
})();
