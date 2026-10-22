// audio-jq2.js — the 《二十四节气》 v2 soundtrack for the film pages: artlock/score-jq2.js (window.JQ.SCORE2) rendered offline
// with real samples (dizi, guzheng, erhu, xiao, VSCO-2 strings, bells and percussion) by tools/render-score2.sh into
// artlock/audio/jq2-full.wav (bars 1-81, 216 s) and artlock/audio/jq2-loop.wav (bars 5-76, 192 s, tails wrapped onto the
// start), with their stats in artlock/audio/jq2.json. Credits: artlock/audio/CREDITS.md.
// Contract (runtime.js): RSAudio.render(sr) -> Promise<stereo AudioBuffer at sr>. The loop file when JQ.FILM.LOOP, else the
// full film; decodeAudioData resamples to sr. The file is checked against JQ.FILM at load: its duration against JQ.FILM.DUR
// and its 24 picture accents (jq2.json) against JQ.FILM.events() impacts; RSAudio.lastStats reports both.
// file:// pages: fetch() cannot read local files, so it falls back to XMLHttpRequest (Chrome needs
// --allow-file-access-from-files, as tools/export.cjs passes); over http(s) fetch() is used.
(() => {
  'use strict';
  const VERSION = 'jq2-samples-1';
  const BASE = (() => { const s = document.currentScript && document.currentScript.src; return s ? s.replace(/[^/]*$/, '') : ''; })();
  function load(url, json) {
    const viaXhr = () => new Promise((res, rej) => {
      const x = new XMLHttpRequest(); x.open('GET', url); x.responseType = json ? 'json' : 'arraybuffer';
      x.onload = () => ((x.status === 200 || x.status === 0) && x.response ? res(x.response) : rej(new Error('RSAudio jq2: cannot load ' + url)));
      x.onerror = () => rej(new Error('RSAudio jq2: cannot load ' + url)); x.send();
    });
    if (location.protocol === 'file:') return viaXhr();
    return fetch(url).then(r => { if (!r.ok) throw new Error('RSAudio jq2: ' + r.status + ' ' + url); return json ? r.json() : r.arrayBuffer(); }).catch(viaXhr);
  }
  async function render(SR = 48000) {
    const F = window.JQ && window.JQ.FILM;
    if (!F) throw new Error('RSAudio jq2: film.js (JQ.FILM) is not loaded');
    const clock = typeof performance !== 'undefined' ? performance.now() : 0;
    const mode = F.LOOP ? 'loop' : 'full', file = 'audio/jq2-' + mode + '.wav';
    const [bytes, meta] = await Promise.all([load(BASE + file, false), load(BASE + 'audio/jq2.json', true).catch(() => null)]);
    const dec = await new OfflineAudioContext(2, 1, SR).decodeAudioData(bytes);
    let out = dec;
    if (dec.numberOfChannels !== 2) {
      out = new AudioBuffer({ length: dec.length, numberOfChannels: 2, sampleRate: dec.sampleRate });
      for (let c = 0; c < 2; c++) out.copyToChannel(dec.getChannelData(Math.min(c, dec.numberOfChannels - 1)), c);
    }
    const dur = out.length / out.sampleRate, stats = { version: VERSION, file, mode, sampleRate: out.sampleRate, channels: 2, duration: +dur.toFixed(6),
      filmDuration: F.DUR, durationOk: Math.abs(dur - F.DUR) < 2 / SR };
    const m = meta && meta[mode];
    if (m) {
      const ev = typeof F.events === 'function' ? F.events() : [];
      const errs = m.accents.map(a => { const e = ev.find(x => x.n === a.n); return e ? Math.abs(e.impact - a.t) * 1000 : Infinity; });
      Object.assign(stats, { score: meta.score, lufs: m.lufs, lra: m.lra, truePeakDbtp: m.truePeakDbtp, sha256: m.sha256,
        accents: m.accents.length, accentMaxErrMs: +Math.max(...errs).toFixed(3), timelineOk: errs.every(x => x < 1) });
    } else stats.timelineOk = null;
    if (!stats.durationOk || stats.timelineOk === false)
      console.warn('RSAudio jq2: ' + file + ' does not match JQ.FILM (duration ' + stats.duration + ' vs ' + F.DUR + ' s, accent error ' + stats.accentMaxErrMs + ' ms); re-run tools/render-score2.sh');
    stats.loadS = clock ? +((performance.now() - clock) / 1000).toFixed(2) : null;
    window.RSAudio.lastStats = stats;
    return out;
  }
  window.RSAudio = { render, version: VERSION, lastStats: null };
})();
