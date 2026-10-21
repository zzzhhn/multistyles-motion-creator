#!/usr/bin/env node
// tools/render-audio.cjs — render the score (src/audio.js via src/film.html?still=1) in headless Chrome, write a WAV.
//   node tools/render-audio.cjs [--cells 1,2,3] [--out qa/audio/full.wav] [--pcm16] [--page film-v11.html]
// Also a module for tools/audio-check.cjs: launch(), openFilm(), renderInPage(), pullSamples(), writeWav().
'use strict';
const fs = require('fs'), path = require('path');
const { chromium } = require('./pw.cjs');
const ROOT = path.resolve(__dirname, '..');
// --page film-v11.html picks another page in src/ (default film.html); read here so tools/audio-check.cjs inherits it
const PAGE = (i => (i > 0 ? process.argv[i + 1] : null))(process.argv.indexOf('--page')) || 'film.html';

const launch = () => chromium.launch({ channel: 'chrome', args: ['--allow-file-access-from-files', '--autoplay-policy=no-user-gesture-required'] });

async function openFilm(browser, cells, pageName = PAGE) {
  const page = await browser.newPage(), errors = [];
  page.on('pageerror', e => errors.push('pageerror: ' + String(e)));
  page.on('console', m => { if (m.type() === 'error') errors.push('console.error: ' + m.text()); });
  const q = '?still=1' + (cells ? '&cells=' + cells : '');
  await page.goto('file://' + path.join(ROOT, 'src', pageName) + q);
  await page.waitForFunction(() => window.RSAudio && window.XY && window.XY.DURATION > 0, null, { timeout: 30000 });
  return { page, errors };
}

// renders once, keeps the AudioBuffer in window.__abuf, returns timing, a FNV-1a hash of the float bits and the score's stats
async function renderInPage(page) {
  return page.evaluate(async () => {
    const t0 = performance.now(), buf = await window.RSAudio.render(48000), renderS = (performance.now() - t0) / 1000;
    window.__abuf = buf;
    let h = 0x811c9dc5;
    for (let c = 0; c < buf.numberOfChannels; c++) { const u = new Uint32Array(buf.getChannelData(c).buffer); for (let i = 0; i < u.length; i++) h = Math.imul(h ^ u[i], 16777619) >>> 0; }
    return { renderS, length: buf.length, sampleRate: buf.sampleRate, channels: buf.numberOfChannels, duration: buf.duration,
      xyDuration: XY.DURATION, T0: XY.SCROLL_T0, T1: XY.SCROLL_T1, hash: h.toString(16).padStart(8, '0'),
      cells: XY.CELLS.map(c => ({ n: c.n, t0: c.t0, t1: c.t1, inst: c.inst, style: c.style })), stats: window.RSAudio.lastStats };
  });
}

// copies window.__abuf to Node in 2M-frame slices (base64 of float32), returns [L, R]
async function pullSamples(page, length) {
  const L = new Float32Array(length), R = new Float32Array(length), STEP = 1 << 21;
  for (let a = 0; a < length; a += STEP) {
    const b64 = await page.evaluate(([a, n]) => {
      const b = window.__abuf, z = Math.min(b.length, a + n), out = new Float32Array((z - a) * 2);
      out.set(b.getChannelData(0).subarray(a, z), 0); out.set(b.getChannelData(1).subarray(a, z), z - a);
      const u8 = new Uint8Array(out.buffer); let s = '';
      for (let i = 0; i < u8.length; i += 0x8000) s += String.fromCharCode.apply(null, u8.subarray(i, i + 0x8000));
      return btoa(s);
    }, [a, STEP]);
    const raw = Buffer.from(b64, 'base64'), ab = raw.buffer.slice(raw.byteOffset, raw.byteOffset + raw.length);
    const f = new Float32Array(ab), n = f.length / 2;
    L.set(f.subarray(0, n), a); R.set(f.subarray(n), a);
  }
  return [L, R];
}

// float32 (format 3, with fact chunk) or 16-bit PCM stereo WAV
function writeWav(file, L, R, sr, pcm16 = false) {
  const n = L.length, bps = pcm16 ? 2 : 4, data = Buffer.alloc(n * 2 * bps);
  for (let i = 0; i < n; i++) {
    if (pcm16) { data.writeInt16LE(Math.max(-32768, Math.min(32767, Math.round(L[i] * 32767))), 4 * i); data.writeInt16LE(Math.max(-32768, Math.min(32767, Math.round(R[i] * 32767))), 4 * i + 2); }
    else { data.writeFloatLE(L[i], 8 * i); data.writeFloatLE(R[i], 8 * i + 4); }
  }
  const fmtLen = pcm16 ? 16 : 18, fact = pcm16 ? Buffer.alloc(0) : Buffer.alloc(12);
  if (!pcm16) { fact.write('fact', 0); fact.writeUInt32LE(4, 4); fact.writeUInt32LE(n, 8); }
  const h = Buffer.alloc(20 + fmtLen);
  h.write('RIFF', 0); h.writeUInt32LE(4 + 8 + fmtLen + fact.length + 8 + data.length, 4); h.write('WAVE', 8);
  h.write('fmt ', 12); h.writeUInt32LE(fmtLen, 16); h.writeUInt16LE(pcm16 ? 1 : 3, 20); h.writeUInt16LE(2, 22); h.writeUInt32LE(sr, 24);
  h.writeUInt32LE(sr * 2 * bps, 28); h.writeUInt16LE(2 * bps, 32); h.writeUInt16LE(8 * bps, 34); if (!pcm16) h.writeUInt16LE(0, 36);
  const dh = Buffer.alloc(8); dh.write('data', 0); dh.writeUInt32LE(data.length, 4);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, Buffer.concat([h, fact, dh, data]));
}

module.exports = { ROOT, PAGE, launch, openFilm, renderInPage, pullSamples, writeWav };

if (require.main === module) {
  const arg = k => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : null; };
  const cells = arg('--cells'), out = path.resolve(ROOT, arg('--out') || 'qa/audio/full.wav'), pcm16 = process.argv.includes('--pcm16');
  (async () => {
    const browser = await launch();
    try {
      const { page, errors } = await openFilm(browser, cells);
      const r = await renderInPage(page);
      const [L, R] = await pullSamples(page, r.length);
      writeWav(out, L, R, r.sampleRate, pcm16);
      console.log(`rendered ${r.duration.toFixed(3)} s (XY.DURATION ${r.xyDuration}) in ${r.renderS.toFixed(2)} s, hash ${r.hash} -> ${path.relative(ROOT, out)}`);
      if (errors.length) console.log('PAGE ERRORS:\n  ' + errors.join('\n  '));
    } finally { await browser.close(); }
  })().catch(e => { console.error('render failed:', e); process.exit(1); });
}
