// hall-t30.cjs: measure T30 (Schroeder backward integration, -5..-35 dB line fit) of the Faust jpverb hall for a few
// t60 settings, so mix-jq2.cjs can pick the one inside the brief's 2.4-2.8 s. Usage: node tools/jq2/hall-t30.cjs [t60 ...]
'use strict';
const path = require('path');
const { hall } = require(path.join(process.env.AUDIO_TOOLS || path.resolve(__dirname, '../../../_audio-tools'), 'node/faust-hall.cjs'));
function t30(w, sr) {
  const n = w.length, e = new Float64Array(n); let acc = 0;
  for (let i = n - 1; i >= 0; i--) { acc += w[i] * w[i]; e[i] = acc; }
  const db = i => 10 * Math.log10(e[i] / e[0] + 1e-30);
  let a = 0; while (a < n && db(a) > -5) a++;
  let b = a; while (b < n && db(b) > -35) b++;
  let sx = 0, sy = 0, sxx = 0, sxy = 0, k = 0;
  for (let i = a; i < b; i += 16) { const x = i / sr, y = db(i); sx += x; sy += y; sxx += x * x; sxy += x * y; k++; }
  const slope = (k * sxy - sx * sy) / (k * sxx - sx * sx);
  return -60 / slope;
}
(async () => {
  const sr = 48000, n = sr * 8, L = new Float32Array(n), R = new Float32Array(n); L[0] = 1; R[0] = 1;
  const list = process.argv.slice(2).map(Number); if (!list.length) list.push(1.5, 1.6, 1.7, 1.9);
  for (const t60 of list) {
    const [wl, wr] = await hall(L, R, sr, { t60, pre: 0 });
    const m = new Float32Array(n); for (let i = 0; i < n; i++) m[i] = 0.5 * (wl[i] + wr[i]);
    console.log('t60 knob', t60, 'T30 L', t30(wl, sr).toFixed(2), 'R', t30(wr, sr).toFixed(2), 'mid', t30(m, sr).toFixed(2), 's');
  }
})();
