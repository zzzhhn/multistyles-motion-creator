#!/usr/bin/env node
// tools/audio-check.cjs — render the score in headless Chrome (src/film.html?still=1) and measure it.
//   node tools/audio-check.cjs [--cells 1,5,33] [--hits "8:4,6;46:2"] [--no-determinism] [--no-excerpts] [--page film-v11.html] [--outdir qa/audio/v11]
// Writes qa/audio/full.wav (float32; subset.wav with --cells), qa/audio/report.json (report-subset.json), and the v10
// listening excerpts qa/audio/v10-excerpt-{opening,dark,finale}.{wav,m4a} (--outdir: another folder for all of them;
// --page: another page in src/, passed to tools/render-audio.cjs). Reports:
//   1 render time, duration vs XY.DURATION          2 ffmpeg ebur128: integrated LUFS, LRA, true peak, clipping
//   3 hit alignment: strongest spectral-flux onset within +-40 ms of every XY.STYLES[style].hits time the score used
//     (--hits injects test hits into XY.STYLES before rendering: cell:beat,beat;cell:beat)
//   4 longest stretch below -50 dBFS (10 ms RMS) between 0.5 s and DURATION-2 s
//   5 determinism: ?cells=1,2,3 rendered twice in one page and once in a fresh page, sample hashes compared
//   6 loudness per cell and per movement (K-weighted, ungated) against the score's designed targets
'use strict';
const fs = require('fs'), path = require('path'), { spawnSync } = require('child_process');
const RA = require('./render-audio.cjs');
const arg = k => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : null; };
const QA = arg('--outdir') ? path.resolve(RA.ROOT, arg('--outdir')) : path.join(RA.ROOT, 'qa', 'audio'), FF = path.join(process.env.HOME, '.local', 'bin', 'ffmpeg');
fs.mkdirSync(QA, { recursive: true });
const HITS = arg('--hits'), CELLS = arg('--cells'), DET = !process.argv.includes('--no-determinism'), EXC = !process.argv.includes('--no-excerpts') && !CELLS;

function fft(re, im) {                                           // in-place radix-2
  const n = re.length;
  for (let i = 1, j = 0; i < n; i++) { let bit = n >> 1; for (; j & bit; bit >>= 1) j ^= bit; j ^= bit; if (i < j) { [re[i], re[j]] = [re[j], re[i]]; [im[i], im[j]] = [im[j], im[i]]; } }
  for (let len = 2; len <= n; len <<= 1) { const a = -2 * Math.PI / len, wr = Math.cos(a), wi = Math.sin(a);
    for (let i = 0; i < n; i += len) { let cr = 1, ci = 0; for (let j = 0; j < len / 2; j++) { const p = i + j, q = p + len / 2, xr = re[q] * cr - im[q] * ci, xi = re[q] * ci + im[q] * cr;
      re[q] = re[p] - xr; im[q] = im[p] - xi; re[p] += xr; im[p] += xi; const t = cr * wr - ci * wi; ci = cr * wi + ci * wr; cr = t; } } }
}
// spectral flux (positive linear-magnitude differences, Hann window, hop 1 ms, frame time = frame centre) around t.
// Primary window 1024 (21 ms, 47 Hz bins); the 512 variant is reported too. With 512 the drone and the accent body
// (40-150 Hz, several tones per 94 Hz bin) beat inside a bin and make the frame magnitude pulse every 8-13 ms, which
// shows up as later "onsets" of the same height as the real one. Bins below ~280 Hz are skipped for the same reason.
function onsetOffset(mono, sr, t, NW = 1024) {
  const hop = Math.round(sr / 1000), win = new Float64Array(NW).map((_, i) => 0.5 - 0.5 * Math.cos(2 * Math.PI * i / NW));
  const re = new Float64Array(NW), im = new Float64Array(NW);
  const mag = c => { const s = c - NW / 2; for (let i = 0; i < NW; i++) { const k = s + i; re[i] = k >= 0 && k < mono.length ? mono[k] * win[i] : 0; im[i] = 0; } fft(re, im);
    const m = new Float64Array(NW / 2); for (let k = 1; k < NW / 2; k++) m[k] = Math.hypot(re[k], im[k]); return m; };
  let prev = mag(Math.round((t - 0.041) * sr)), best = -1, bestT = 0;
  for (let ms = -40; ms <= 40; ms++) {
    const c = Math.round(t * sr) + ms * hop, cur = mag(c);
    let f = 0; for (let k = Math.ceil(280 / (sr / NW)); k < NW / 2; k++) { const d = cur[k] - prev[k]; if (d > 0) f += d; }
    if (f > best) { best = f; bestT = ms; }
    prev = cur;
  }
  return bestT;
}
function onsetReport(L, R, sr, cells, T0) {
  const mono = new Float32Array(L.length); for (let i = 0; i < L.length; i++) mono[i] = 0.5 * (L[i] + R[i]);
  const one = NW => { const offs = cells.map(c => ({ n: c.n, t0: c.t0, ms: onsetOffset(mono, sr, c.t0, NW) })), abs = offs.map(o => Math.abs(o.ms));
    return { window: NW, cells: offs.length, maxAbsMs: Math.max(...abs), within10ms: abs.filter(x => x <= 10).length, within5ms: abs.filter(x => x <= 5).length,
      worst: offs.slice().sort((a, b) => Math.abs(b.ms) - Math.abs(a.ms)).slice(0, 5), all: offs, riserEnd: { t: T0, ms: onsetOffset(mono, sr, T0, NW) } }; };
  return { onsets: one(1024), onsets512: one(512) };
}
function longestQuiet(L, R, sr, a, z) {                          // seconds below -50 dBFS, 10 ms RMS windows
  const w = Math.round(sr / 100), thr = Math.pow(10, -50 / 10);
  let run = 0, best = 0, at = 0;
  for (let i = Math.round(a * sr); i + w <= Math.round(z * sr); i += w) {
    let s = 0; for (let j = i; j < i + w; j++) s += (L[j] * L[j] + R[j] * R[j]) / 2;
    if (s / w < thr) { run += w; if (run > best) { best = run; at = (i + w - run) / sr; } } else run = 0;
  }
  return { seconds: best / sr, at };
}
function ebur128(file) {                                         // ffmpeg prints the summary on stderr
  const r = spawnSync(FF, ['-nostats', '-hide_banner', '-i', file, '-af', 'ebur128=peak=true', '-f', 'null', '-'], { encoding: 'utf8', maxBuffer: 1 << 28 });
  const txt = String(r.stderr || ''), sum = txt.slice(txt.lastIndexOf('Summary:'));
  const num = re => { const m = sum.match(re); return m ? +m[1] : null; };
  return { I: num(/I:\s+(-?[\d.]+) LUFS/), LRA: num(/LRA:\s+(-?[\d.]+) LU/), TP: num(/Peak:\s+(-?[\d.]+) dBFS/), raw: sum.trim() };
}
function excerpt(src, dst, ss, t) {
  spawnSync(FF, ['-y', '-hide_banner', '-loglevel', 'error', '-ss', String(ss), '-t', String(t), '-i', src, '-c:a', 'pcm_s16le', dst]);
}

function excerptM4a(src, dst, ss, t) {
  spawnSync(FF, ['-y', '-hide_banner', '-loglevel', 'error', '-ss', String(ss), '-t', String(t), '-i', src, '-c:a', 'aac', '-b:a', '256k', dst]);
}
// K-weighted (BS.1770) mean-square loudness of [a, z) seconds, ungated
function kLoud(L, R, sr, a, z) {
  const K1 = Math.tan(Math.PI * 1681.974450955533 / sr), Q1 = 0.7071752369554196, Vh = Math.pow(10, 3.999843853973347 / 20), Vb = Math.pow(Vh, 0.4996667741545416), a0 = 1 + K1 / Q1 + K1 * K1;
  const f1 = [(Vh + Vb * K1 / Q1 + K1 * K1) / a0, 2 * (K1 * K1 - Vh) / a0, (Vh - Vb * K1 / Q1 + K1 * K1) / a0, 2 * (K1 * K1 - 1) / a0, (1 - K1 / Q1 + K1 * K1) / a0];
  const K2 = Math.tan(Math.PI * 38.13547087602444 / sr), Q2 = 0.5003270373238773, f2 = [2 * (K2 * K2 - 1) / (1 + K2 / Q2 + K2 * K2), (1 - K2 / Q2 + K2 * K2) / (1 + K2 / Q2 + K2 * K2)];
  const i0 = Math.max(0, Math.round(a * sr) - sr), i1 = Math.min(L.length, Math.round(z * sr)), s0 = Math.round(a * sr);
  let e = 0, n = 0;
  for (const x of [L, R]) { let x1 = 0, x2 = 0, y1 = 0, y2 = 0, u1 = 0, u2 = 0, w1 = 0, w2 = 0;
    for (let j = i0; j < i1; j++) { const v = x[j], y = f1[0] * v + f1[1] * x1 + f1[2] * x2 - f1[3] * y1 - f1[4] * y2; x2 = x1; x1 = v; y2 = y1; y1 = y;
      const w = y - 2 * u1 + u2 - f2[0] * w1 - f2[1] * w2; u2 = u1; u1 = y; w2 = w1; w1 = w; if (j >= s0) { e += w * w; n++; } } }
  return -0.691 + 10 * Math.log10(2 * e / Math.max(1, n) + 1e-20);
}
const corr = (a, b) => { const n = a.length, ma = a.reduce((s, x) => s + x, 0) / n, mb = b.reduce((s, x) => s + x, 0) / n; let sab = 0, saa = 0, sbb = 0; for (let i = 0; i < n; i++) { sab += (a[i] - ma) * (b[i] - mb); saa += (a[i] - ma) ** 2; sbb += (b[i] - mb) ** 2; } return sab / Math.sqrt(saa * sbb + 1e-20); };

(async () => {
  const browser = await RA.launch(), rep = { version: null, cells: CELLS || 'all', injectedHits: HITS || null }, errors = [];
  const inject = HITS ? HITS.split(';').map(s => { const [n, b] = s.split(':'); return [+n, b.split(',').map(Number)]; }) : null;
  try {
    const { page, errors: e1 } = await RA.openFilm(browser, CELLS);
    if (inject) await page.evaluate(list => { list.forEach(([n, beats]) => { const c = XY.ALL_CELLS.find(x => x.n === n); if (c) { XY.STYLES[c.style] = XY.STYLES[c.style] || {}; XY.STYLES[c.style].hits = beats; } }); }, inject);
    const r = await RA.renderInPage(page);
    const [L, R] = await RA.pullSamples(page, r.length);
    errors.push(...e1); await page.close();
    const wav = path.join(QA, CELLS ? 'subset.wav' : 'full.wav');
    RA.writeWav(wav, L, R, r.sampleRate);
    const st = r.stats || {};
    rep.version = st.version;
    rep.render = { seconds: +r.renderS.toFixed(2), duration: +r.duration.toFixed(4), xyDuration: +r.xyDuration.toFixed(4), durationErr: +(r.duration - r.xyDuration).toFixed(4),
      sampleRate: r.sampleRate, channels: r.channels, hash: r.hash, events: st.events, engine: { preLufs: st.preLufs, lufs: st.lufs, maxGainReductionDb: st.maxGainReductionDb, limiterPct: st.limiterPct, samplePeakDb: st.samplePeakDb } };
    const eb = ebur128(wav);
    let clip = 0; for (let i = 0; i < L.length; i++) if (Math.abs(L[i]) >= 1 || Math.abs(R[i]) >= 1) clip++;
    rep.loudness = { integratedLUFS: eb.I, LRA: eb.LRA, truePeakDbTP: eb.TP, clippedSamples: clip };
    // hits actually scored (read by audio.js from XY.STYLES at render time)
    const mono = new Float32Array(L.length); for (let i = 0; i < L.length; i++) mono[i] = 0.5 * (L[i] + R[i]);
    const hs = (st.hits || []).map(h => ({ n: h.n, t: h.t, ms1024: onsetOffset(mono, r.sampleRate, h.t, 1024), ms512: onsetOffset(mono, r.sampleRate, h.t, 512) }));
    const ab = hs.map(h => Math.min(Math.abs(h.ms1024), Math.abs(h.ms512)));
    rep.hits = { declared: hs.length, cells: [...new Set(hs.map(h => h.n))], maxAbsMs: hs.length ? Math.max(...ab) : null, within10ms: ab.filter(x => x <= 10).length, list: hs };
    rep.silence = longestQuiet(L, R, r.sampleRate, 0.5, r.xyDuration - 2);
    rep.silence.seconds = +rep.silence.seconds.toFixed(3); rep.silence.at = +rep.silence.at.toFixed(2);
    // designed arc vs measured
    const tg = st.targets || [], meas = tg.map(c => +kLoud(L, R, r.sampleRate, c.t0, c.t1).toFixed(1));
    rep.arc = { cells: tg.map((c, i) => [c.n, c.target, meas[i]]), correlation: tg.length > 2 ? +corr(tg.map(c => c.target), meas).toFixed(3) : null,
      movements: [...new Set(tg.map(c => c.mv))].map(mv => { const cs = tg.filter(c => c.mv === mv); return { mv, t0: cs[0].t0, measured: +kLoud(L, R, r.sampleRate, cs[0].t0, cs[cs.length - 1].t1).toFixed(1) }; }),
      intro: +kLoud(L, R, r.sampleRate, 0, r.T0).toFixed(1), finale: +kLoud(L, R, r.sampleRate, r.T1, r.xyDuration).toFixed(1) };
    rep.chunks = st.chunks; rep.colour = st.colour; if (st.sections) rep.sections = st.sections;
    if (EXC) {
      const C = r.cells, a = C.find(c => c.n === 44), b = C.find(c => c.n === 48), D = r.xyDuration;
      const ex = [['opening', 0, 60], ['dark', a ? a.t0 - 2 : 230, a && b ? b.t1 + 1 - (a.t0 - 2) : 40], ['finale', Math.max(0, D - 60), 60]];
      rep.excerpts = [];
      ex.forEach(([k, ss, t]) => { const f = path.join(QA, `v10-excerpt-${k}`); excerpt(wav, f + '.wav', ss, t); excerptM4a(wav, f + '.m4a', ss, t); rep.excerpts.push({ file: `qa/audio/v10-excerpt-${k}.{wav,m4a}`, from: +ss.toFixed(2), seconds: +t.toFixed(2) }); });
    }
    if (DET) {
      const A = await RA.openFilm(browser, '1,2,3'), h1 = (await RA.renderInPage(A.page)).hash, h2 = (await RA.renderInPage(A.page)).hash;
      errors.push(...A.errors); await A.page.close();
      const Bp = await RA.openFilm(browser, '1,2,3'), h3 = (await RA.renderInPage(Bp.page)).hash;
      errors.push(...Bp.errors); await Bp.page.close();
      rep.determinism = { cells: '1,2,3', samePage: [h1, h2], freshPage: h3, identical: h1 === h2 && h2 === h3 };
    }
  } catch (e) { errors.push('CHECK FAILED: ' + (e && e.stack || e)); }
  await browser.close();
  rep.pageErrors = errors;
  fs.writeFileSync(path.join(QA, CELLS ? 'report-subset.json' : 'report.json'), JSON.stringify(rep, null, 1));
  const R0 = rep.render || {}, Lo = rep.loudness || {}, H = rep.hits || {}, S = rep.silence || {}, D = rep.determinism, A = rep.arc || {};
  console.log(`${rep.version} | render ${R0.seconds} s | duration ${R0.duration} s vs XY.DURATION ${R0.xyDuration} (err ${R0.durationErr} s) | ${R0.channels} ch @ ${R0.sampleRate} | ${R0.events} orchestra events`);
  console.log(`ffmpeg ebur128: I ${Lo.integratedLUFS} LUFS | LRA ${Lo.LRA} LU | true peak ${Lo.truePeakDbTP} dBTP | clipped ${Lo.clippedSamples} | limiter ${JSON.stringify((R0.engine || {}).limiterPct)} max GR ${(R0.engine || {}).maxGainReductionDb} dB`);
  console.log(`hits: ${H.declared} scored in cells ${JSON.stringify(H.cells)}; max |offset| ${H.maxAbsMs} ms; within 10 ms ${H.within10ms}`);
  console.log(`silence: longest < -50 dBFS run ${S.seconds} s at ${S.at} s`);
  console.log(`arc: target/measured correlation ${A.correlation}; movements ${JSON.stringify(A.movements)}; intro ${A.intro} finale ${A.finale}`);
  if (D) console.log(`determinism (cells ${D.cells}): ${D.samePage.join(' ')} | fresh ${D.freshPage} -> ${D.identical ? 'IDENTICAL' : 'DIFFERENT'}`);
  if (rep.excerpts) console.log('excerpts: ' + rep.excerpts.map(x => x.file + ' @' + x.from).join(', '));
  if (errors.length) console.log('PAGE ERRORS:\n  ' + errors.join('\n  '));
})();
