// faust-hall.cjs: offline Faust hall reverbs (re.jpverb / re.greyhole from faustlibraries, MIT) through faustwasm.
// hall(L, R, sr, opts) -> [wetL, wetR] (Float32Array, same length, 100 % wet). Deterministic, no audio thread.
// Usage as a CLI probe: node faust-hall.cjs  (renders an impulse and prints the decay)
'use strict';
const path = require('path');
const { pathToFileURL } = require('url');
const ROOT = path.join(__dirname, 'node_modules/@grame/faustwasm');
let FWP = null;
const fw = () => (FWP = FWP || import(pathToFileURL(path.join(ROOT, 'dist/esm/index.js')).href));   // the CJS entry exports nothing in 0.19.0

const DEFAULTS = {   // tuned for a big cinematic hall (JPverb param names); measured with tools/jq2/hall-t30.cjs in the 二十四节气 example
  // t60 is a knob, not the decay: t60 1.9 / size 1.7 measures T30 = 2.88 s (Schroeder, impulse), inside the 2.4-3.2 s
  // cinematic range; jpverb has no pre-delay, so the send is delayed by pre seconds
  algo: 'jpverb', t60: 1.9, damp: 0.4, size: 1.7, early: 0.9, modDepth: 0.2, modFreq: 0.9,
  low: 0.85, mid: 1.0, high: 0.55, lowcut: 300, highcut: 3600, pre: 0.03,
};
function dspCode(o) {
  if (o.algo === 'greyhole')   // dt, damp, size, early_diff, feedback, mod_depth, mod_freq
    return `import("stdfaust.lib"); process = re.greyhole(${o.dt || 0.2}, ${o.damp}, ${o.size}, ${o.early}, ${o.feedback || 0.85}, ${o.modDepth}, ${o.modFreq});`;
  return `import("stdfaust.lib"); process = re.jpverb(${o.t60}, ${o.damp}, ${o.size}, ${o.early}, ${o.modDepth}, ${o.modFreq}, ${o.low}, ${o.mid}, ${o.high}, ${o.lowcut}, ${o.highcut});`;
}
let compilerP = null;
async function compiler() {
  if (!compilerP) compilerP = (async () => {
    const FW = await fw(), mod = await FW.instantiateFaustModuleFromFile(path.join(ROOT, 'libfaust-wasm/libfaust-wasm.js'));
    return new FW.FaustCompiler(new FW.LibFaust(mod));
  })();
  return compilerP;
}
async function hall(L, R, sr, opts = {}) {
  const FW = await fw(), o = Object.assign({}, DEFAULTS, opts), gen = new FW.FaustMonoDspGenerator();
  await gen.compile(await compiler(), 'hall', dspCode(o), '-ftz 2');
  const proc = await gen.createOfflineProcessor(sr, 1024);
  const tail = Math.round((o.tail == null ? 0 : o.tail) * sr), n = L.length + tail;
  const pd = Math.round((o.pre || 0) * sr), inL = new Float32Array(n + pd), inR = new Float32Array(n + pd); inL.set(L, pd); inR.set(R, pd);
  const out = proc.render([inL, inR], n + pd);
  return [out[0].subarray(0, n), out[1].subarray(0, n)];
}
module.exports = { hall, DEFAULTS };

if (require.main === module) (async () => {
  const sr = 48000, n = sr * 6, L = new Float32Array(n), R = new Float32Array(n);
  L[sr / 10] = 1; R[sr / 10] = 1;
  for (const algo of ['jpverb', 'greyhole']) {
    const t0 = Date.now(), [wl, wr] = await hall(L, R, sr, { algo });
    const rms = (a, s, e) => { let q = 0; for (let i = s; i < e; i++) q += a[i] * a[i]; return Math.sqrt(q / (e - s)); };
    const db = x => (20 * Math.log10(x + 1e-12)).toFixed(1);
    const seg = [0.2, 0.7, 1.2, 2.2, 3.2, 4.2].map(t => db(rms(wl, Math.round(t * sr), Math.round((t + 0.2) * sr))));
    let same = 0; for (let i = 0; i < n; i++) if (wl[i] === wr[i]) same++;
    console.log(algo, 'ms', Date.now() - t0, 'rms dB at 0.2/0.7/1.2/2.2/3.2/4.2 s', seg.join(' '), 'L==R fraction', (same / n).toFixed(3));
  }
})();
