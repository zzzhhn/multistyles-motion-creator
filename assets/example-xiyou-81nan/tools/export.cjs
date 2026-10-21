// Offline export of a contract-compliant film page to MP4 via window.__exportMP4, then verification.
// Usage: node tools/export.cjs <page.html> <out.mp4> [--no-verify]
// Opens <page>?export=1 (runtime skips autoplay + audio playback), saves the Blob, then verifies the file
// in Chrome (<video> metadata + seeks + contact sheet, decodeAudioData, box parse, full VideoDecoder pass)
// and with macOS mdls / afinfo / afconvert when available. Prints PASS/FAIL.
const { chromium } = require('./pw.cjs');
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const FPS = 60;
const checks = [];
const check = (name, ok, detail = '') => { checks.push({ name, ok: !!ok, detail }); console.log(`${ok ? 'ok  ' : 'FAIL'} ${name}${detail ? ' — ' + detail : ''}`); };

(async () => {
  const args = process.argv.slice(2);
  const [file, outArg] = args.filter(a => !a.startsWith('--'));
  if (!file || !outArg) { console.error('usage: node tools/export.cjs <page.html> <out.mp4> [--no-verify]'); process.exit(2); }
  const abs = path.resolve(file), out = path.resolve(outArg);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  const browser = await chromium.launch({ channel: 'chrome', args: ['--allow-file-access-from-files', '--autoplay-policy=no-user-gesture-required'] });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  const errors = [];
  page.on('console', m => { const s = m.text(); if (m.type() === 'error') errors.push(s); if (m.type() === 'error' || m.type() === 'warning') console.log(`[page ${m.type()}] ${s}`); });
  page.on('pageerror', e => errors.push('pageerror: ' + e.message));

  // ---------------------------------------------------------------- export
  await page.goto('file://' + abs + '?export=1' + (process.env.EXPORT_Q ? '&' + process.env.EXPORT_Q : ''), { waitUntil: 'load' });   // EXPORT_Q='from=0&to=30' exports a range
  await page.waitForFunction(() => typeof window.__renderAt === 'function' && typeof window.__exportMP4 === 'function', null, { timeout: 15000 });
  await page.evaluate(() => document.fonts && document.fonts.ready);
  const film = await page.evaluate(() => ({ D: window.__DURATION, flash: window.__FLASH_FRAMES || null }));
  const N = Math.round(film.D * FPS);
  console.log(`exporting ${abs} (${film.D} s, ${N} frames)…`);
  let lastLog = -1;
  await page.exposeFunction('__nodeProgress', p => {
    const pc = Math.floor(p * 100);
    if (pc >= lastLog + 5 || pc === 100) { lastLog = pc; process.stdout.write(`  export ${pc}%  (${((Date.now() - tExp) / 1000).toFixed(1)} s)\n`); }
  });
  const tExp = Date.now();
  const info = await page.evaluate(async () => {
    const b = await window.__exportMP4(p => window.__nodeProgress(p));
    window.__blob = b;
    return { size: b.size, type: b.type, stats: window.__lastExport || null };
  });
  const exportSec = (Date.now() - tExp) / 1000;
  console.log(`exported ${(info.size / 1e6).toFixed(2)} MB ${info.type} in ${exportSec.toFixed(1)} s`, info.stats ? JSON.stringify(info.stats) : '');
  // pull the Blob out in 8 MB base64 slices
  const parts = [];
  for (let o = 0; o < info.size; o += 8 << 20) {
    const b64 = await page.evaluate(async ([o, n]) => {
      const buf = new Uint8Array(await window.__blob.slice(o, o + n).arrayBuffer());
      let s = ''; for (let i = 0; i < buf.length; i += 0x8000) s += String.fromCharCode.apply(null, buf.subarray(i, i + 0x8000));
      return btoa(s);
    }, [o, 8 << 20]);
    parts.push(Buffer.from(b64, 'base64'));
  }
  fs.writeFileSync(out, Buffer.concat(parts));
  console.log(`saved ${out} (${fs.statSync(out).size} bytes)`);
  check('export finished without page errors', errors.length === 0, errors.slice(0, 3).join(' | '));
  check('saved file size matches Blob', fs.statSync(out).size === info.size);

  if (args.includes('--no-verify')) { await browser.close(); return finish(exportSec); }

  // ---------------------------------------------------------------- verify: box parse (node, independent of Chrome)
  const mp4 = fs.readFileSync(out);
  const P = parseMP4(mp4);
  console.log('top-level boxes:', P.top.join(' '));
  console.log('tracks:', JSON.stringify(P.tracks.map(t => ({ ...t, sizes: undefined, offsets: undefined, keys: t.keys && t.keys.length }))));
  check('ftyp first, moov before mdat (faststart)', P.top[0] === 'ftyp' && P.top.indexOf('moov') < P.top.indexOf('mdat'), P.top.join(','));
  check('two tracks (video + audio)', P.tracks.length === 2 && P.tracks.some(t => t.handler === 'vide') && P.tracks.some(t => t.handler === 'soun'));
  const vt = P.tracks.find(t => t.handler === 'vide') || {}, at = P.tracks.find(t => t.handler === 'soun') || {};
  check('video codec avc1 High (avc1.64xxxx)', /^avc1\.64/.test(vt.codec || ''), vt.codec);
  check(`video samples == ${N}`, vt.sampleCount === N, String(vt.sampleCount));
  check('video stts uniform delta 1000 @ timescale 60000', vt.timescale === 60000 && vt.stts && vt.stts.length === 1 && vt.stts[0][1] === 1000, JSON.stringify(vt.stts));
  check('video keyframe every 2 s', vt.keys && vt.keys.length === Math.ceil(N / 120) && vt.keys.every((k, i) => k === i * 120 + 1), `${vt.keys && vt.keys.length} sync samples`);
  check('audio codec mp4a.40.2 48 kHz stereo', at.codec === 'mp4a.40.2' && at.timescale === 48000 && at.channels === 2, `${at.codec} ${at.timescale} ch=${at.channels}`);
  check('audio stts delta 1024', at.stts && at.stts.length === 1 && at.stts[0][1] === 1024, JSON.stringify(at.stts));
  check('movie duration == __DURATION', Math.abs(P.movieDur - film.D) < 0.001, P.movieDur.toFixed(3));
  check('sample offsets inside mdat', P.tracks.every(t => t.offsets.every((o, i) => o >= P.mdatStart && o + t.sizes[i] <= P.mdatEnd)));

  // ---------------------------------------------------------------- verify in Chrome
  const vpage = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  vpage.on('pageerror', e => console.log('[verify pageerror]', e.message));
  const vhtml = path.join(path.dirname(out), '_verify.html');
  fs.writeFileSync(vhtml, `<!doctype html><meta charset=utf-8><body style="margin:0;background:#000"><video id=v muted preload=auto playsinline src="${encodeURI(path.basename(out))}"></video></body>`);
  await vpage.goto('file://' + vhtml, { waitUntil: 'load' });
  const V = await vpage.evaluate(async ({ flash, D }) => {
    const v = document.getElementById('v');
    await new Promise((r, j) => { if (v.readyState >= 1) r(); else { v.onloadedmetadata = r; v.onerror = () => j(new Error('video error ' + (v.error && v.error.message))); } });
    const seek = t => new Promise(r => { v.onseeked = () => r(); v.currentTime = t; });
    const c = document.createElement('canvas'); c.width = 192; c.height = 108; const g = c.getContext('2d', { willReadFrequently: true });
    const probe = async t => { await seek(t); g.drawImage(v, 0, 0, 192, 108); const d = g.getImageData(0, 0, 192, 108).data;
      let s = 0; for (let i = 0; i < d.length; i += 4) s += d[i] + d[i + 1] + d[i + 2]; return s / (d.length / 4) / 3; };
    const res = { duration: v.duration, w: v.videoWidth, h: v.videoHeight, flash: [] };
    if (flash) for (const k of flash) res.flash.push({ k, before: await probe((k - 0.5) / 60), at: await probe((k + 0.5) / 60), after: await probe((k + 1.5) / 60) });
    // contact sheet: 16 seeks
    const cols = 4, w = 480, h = 270, times = []; for (let i = 0; i < 16; i++) times.push(Math.min(D - 0.01, 0.05 + i * D / 16));
    const sc = document.createElement('canvas'); sc.width = cols * w; sc.height = Math.ceil(times.length / cols) * h; const sg = sc.getContext('2d');
    for (let i = 0; i < times.length; i++) { await seek(times[i]); const x = (i % cols) * w, y = Math.floor(i / cols) * h; sg.drawImage(v, x, y, w, h);
      sg.fillStyle = 'rgba(0,0,0,.75)'; sg.fillRect(x, y, 84, 24); sg.fillStyle = '#ff0'; sg.font = 'bold 16px monospace'; sg.fillText(times[i].toFixed(2) + 's', x + 6, y + 17); }
    res.sheet = sc.toDataURL('image/jpeg', 0.85);
    return res;
  }, { flash: film.flash, D: film.D });
  const sheetPath = out.replace(/\.mp4$/i, '') + '_sheet.jpg';
  fs.writeFileSync(sheetPath, Buffer.from(V.sheet.split(',')[1], 'base64'));
  console.log(`<video>: duration=${V.duration} ${V.w}x${V.h}; contact sheet -> ${sheetPath}`);
  check('<video> duration ≈ __DURATION', Math.abs(V.duration - film.D) < 0.05, String(V.duration));
  const EW = +(process.env.EXPECT_W || 2560), EH = +(process.env.EXPECT_H || 1440);
  check(`<video> ${EW}x${EH}`, V.w === EW && V.h === EH, `${V.w}x${V.h}`);
  if (film.flash) {
    for (const f of V.flash) console.log(`  flash frame ${f.k}: luma before=${f.before.toFixed(0)} at=${f.at.toFixed(0)} after=${f.after.toFixed(0)}`);
    check('<video> seek: flash frames white exactly at k/60, neighbours dark', V.flash.every(f => f.at > 230 && f.before < 120 && f.after < 120));
  }

  // audio: decodeAudioData on the file bytes (Chrome/FFmpeg path, honours the edit list) + full VideoDecoder pass
  const A = await vpage.evaluate(async ({ name, flash, D, vt }) => {
    const bytes = await new Promise((r, j) => { const x = new XMLHttpRequest(); x.open('GET', name); x.responseType = 'arraybuffer';
      x.onload = () => r(x.response); x.onerror = () => j(new Error('xhr failed')); x.send(); });
    const res = {};
    try {
      const ab = await new OfflineAudioContext(2, 48000, 48000).decodeAudioData(bytes.slice(0));
      const L = ab.getChannelData(0), R = ab.numberOfChannels > 1 ? ab.getChannelData(1) : L;
      let ss = 0, pk = 0; for (let i = 0; i < L.length; i++) { const m = (L[i] + R[i]) / 2; ss += m * m; pk = Math.max(pk, Math.abs(L[i]), Math.abs(R[i])); }
      Object.assign(res, { aDur: ab.duration, aRate: ab.sampleRate, aCh: ab.numberOfChannels, rms: Math.sqrt(ss / L.length), peak: pk });
      if (flash) res.onsets = flash.map(k => { const t = k / 60, sr = ab.sampleRate; const a = Math.max(0, Math.floor((t - 0.25) * sr)), b = Math.min(L.length, Math.floor((t + 0.25) * sr));
        for (let i = a; i < b; i++) if (Math.abs(L[i]) > 0.1) return { k, t, onset: i / sr }; return { k, t, onset: null }; });
    } catch (e) { res.audioError = String(e); }
    // VideoDecoder over every sample: count frames, mean luma per frame, frame stamp (stub only)
    try {
      const u8 = new Uint8Array(bytes); const avcC = Uint8Array.from(atob(vt.avcC), c => c.charCodeAt(0));
      const c = new OffscreenCanvas(192, 108), g = c.getContext('2d', { willReadFrequently: true });
      const lum = [], stamps = []; let err = null;
      const dec = new VideoDecoder({ output: f => { g.drawImage(f, 0, 0, 192, 108); f.close(); const d = g.getImageData(0, 0, 192, 108).data;
          let s = 0; for (let i = 0; i < d.length; i += 16) s += d[i] + d[i + 1] + d[i + 2]; lum.push(s / (d.length / 16) / 3);
          let n = 0; for (let b = 0; b < 12; b++) if (d[(6 * 192 + Math.round(6 + 4.4 * b)) * 4] > 128) n |= 1 << b; stamps.push(n); },
        error: e => { err = e; } });
      dec.configure({ codec: vt.codec, codedWidth: vt.width, codedHeight: vt.height, description: avcC });
      for (let i = 0; i < vt.sampleCount; i++) {
        dec.decode(new EncodedVideoChunk({ type: vt.keys.includes(i + 1) ? 'key' : 'delta', timestamp: Math.round(i * 1e6 / 60), data: u8.subarray(vt.offsets[i], vt.offsets[i] + vt.sizes[i]) }));
        if (dec.decodeQueueSize > 16) await new Promise(r => setTimeout(r, 1));
      }
      await dec.flush(); dec.close(); if (err) throw err;
      res.decoded = lum.length;
      res.whiteFrames = lum.map((l, i) => [l, i]).filter(([l]) => l > 230).map(([, i]) => i);
      if (flash) res.stampErrors = stamps.map((s, i) => [s, i]).filter(([s, i]) => !flash.includes(i) && s !== i).length;
    } catch (e) { res.videoError = String(e); }
    return res;
  }, { name: path.basename(out), flash: film.flash, D: film.D, vt: { ...vt, sizes: vt.sizes, offsets: vt.offsets } });
  if (A.audioError) check('decodeAudioData', false, A.audioError);
  else {
    console.log(`decodeAudioData: ${A.aDur.toFixed(4)} s, ${A.aRate} Hz, ${A.aCh} ch, RMS ${(20 * Math.log10(A.rms)).toFixed(1)} dBFS, peak ${(20 * Math.log10(A.peak)).toFixed(1)} dBFS`);
    check('decoded audio ≈ 60 s', Math.abs(A.aDur - film.D) < 0.1, A.aDur.toFixed(4));
    check('decoded audio non-silent', A.rms > 1e-3, 'RMS ' + A.rms.toFixed(4));
  }
  if (A.videoError) check('VideoDecoder pass', false, A.videoError);
  else {
    check(`VideoDecoder decoded ${N} frames`, A.decoded === N, String(A.decoded));
    if (film.flash) {
      check('decoded flash frames exactly at expected indices', JSON.stringify(A.whiteFrames) === JSON.stringify(film.flash), `white=${A.whiteFrames.join(',')}`);
      check('every decoded frame carries its own frame number (no drops/dups)', A.stampErrors === 0, `${A.stampErrors} mismatches`);
    }
  }
  if (film.flash && A.onsets) {
    const offs = A.onsets.map(o => o.onset == null ? null : (o.onset - o.t) * 1000);
    console.log('A/V sync (decodeAudioData beep onset − flash frame time), ms:', offs.map(x => x == null ? 'n/a' : x.toFixed(2)).join(', '));
    check('A/V sync within ±1 frame (16.7 ms)', offs.every(x => x != null && Math.abs(x) <= 1000 / 60), `max |Δ| ${Math.max(...offs.map(x => Math.abs(x ?? 1e9))).toFixed(2)} ms`);
  }

  // macOS tools (informational; also an independent CoreAudio decode for the sync check)
  const tryRun = (cmd, a) => { try { return execFileSync(cmd, a, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }); } catch (e) { return null; } };
  const md = tryRun('mdls', ['-name', 'kMDItemDurationSeconds', '-name', 'kMDItemCodecs', out]);
  console.log('mdls:', md ? md.replace(/\s+/g, ' ').trim() : 'unavailable');
  const af = tryRun('afinfo', [out]);
  console.log('afinfo:', af ? '\n' + af.split('\n').filter(l => /Data format|estimated duration|valid frames|bit rate|Num Tracks/.test(l)).map(l => '  ' + l.trim()).join('\n') : 'unavailable');
  if (film.flash) {
    const wav = out.replace(/\.mp4$/i, '') + '_coreaudio.wav';
    if (tryRun('afconvert', ['-f', 'WAVE', '-d', 'LEF32', out, wav]) !== null && fs.existsSync(wav)) {
      const w = fs.readFileSync(wav); let o = 12, data = null, rate = 48000, ch = 2;
      while (o + 8 <= w.length) { const id = w.toString('latin1', o, o + 4), n = w.readUInt32LE(o + 4);
        if (id === 'fmt ') { ch = w.readUInt16LE(o + 10); rate = w.readUInt32LE(o + 12); } if (id === 'data') { data = [o + 8, n]; break; } o += 8 + n + (n & 1); }
      const sample = i => w.readFloatLE(data[0] + i * 4 * ch);
      const frames = data[1] / (4 * ch);
      const offs = film.flash.map(k => { const t = k / 60; for (let i = Math.floor((t - 0.25) * rate); i < Math.min(frames, (t + 0.25) * rate); i++) if (Math.abs(sample(i)) > 0.1) return (i / rate - t) * 1000; return null; });
      console.log(`CoreAudio (afconvert) decode: ${(frames / rate).toFixed(4)} s; beep onset − flash, ms: ${offs.map(x => x == null ? 'n/a' : x.toFixed(2)).join(', ')}`);
      check('CoreAudio A/V sync within ±1 frame', offs.every(x => x != null && Math.abs(x) <= 1000 / 60));
      fs.unlinkSync(wav);
    } else console.log('afconvert: unavailable');
  }
  fs.unlinkSync(vhtml);

  await browser.close();
  finish(exportSec);
})().catch(e => { console.error(e); process.exit(1); });

function finish(exportSec) {
  const bad = checks.filter(c => !c.ok);
  console.log(`\nexport time: ${exportSec.toFixed(1)} s`);
  console.log(bad.length ? `FAIL (${bad.length}/${checks.length} checks failed: ${bad.map(c => c.name).join('; ')})` : `PASS (${checks.length} checks)`);
  process.exit(bad.length ? 1 : 0);
}

// ---------------------------------------------------------------- minimal MP4 box parser
function parseMP4(buf) {
  const CONTAINERS = new Set(['moov', 'trak', 'mdia', 'minf', 'stbl', 'edts', 'dinf']);
  const r32 = o => buf.readUInt32BE(o), r16 = o => buf.readUInt16BE(o);
  const r64 = o => r32(o) * 4294967296 + r32(o + 4);
  const type = o => buf.toString('latin1', o, o + 4);
  function children(start, end) {
    const out = [];
    for (let o = start; o + 8 <= end;) {
      let size = r32(o), hdr = 8; const t = type(o + 4);
      if (size === 1) { size = r64(o + 8); hdr = 16; } else if (size === 0) size = end - o;
      if (size < 8) throw new Error('bad box size at ' + o);
      out.push({ type: t, start: o, body: o + hdr, end: o + size });
      o += size;
    }
    return out;
  }
  const find = (b, t) => children(b.body, b.end).find(c => c.type === t);
  const top = children(0, buf.length);
  const res = { top: top.map(b => b.type), tracks: [] };
  const mdat = top.find(b => b.type === 'mdat'); res.mdatStart = mdat.body; res.mdatEnd = mdat.end;
  const moov = top.find(b => b.type === 'moov');
  const mvhd = find(moov, 'mvhd'); res.movieDur = r32(mvhd.body + 16) / r32(mvhd.body + 12);
  for (const trak of children(moov.body, moov.end).filter(b => b.type === 'trak')) {
    const t = {};
    const tkhd = find(trak, 'tkhd'); t.id = r32(tkhd.body + 12); t.tkhdDur = r32(tkhd.body + 20);
    const edts = find(trak, 'edts'); if (edts) { const e = find(edts, 'elst'); t.elst = { segDur: r32(e.body + 8), mediaTime: buf.readInt32BE(e.body + 12) }; }
    const mdia = find(trak, 'mdia'); const mdhd = find(mdia, 'mdhd');
    t.timescale = r32(mdhd.body + 12); t.mediaDur = r32(mdhd.body + 16);
    t.handler = type(find(mdia, 'hdlr').body + 8);
    const stbl = find(find(mdia, 'minf'), 'stbl');
    const stsd = find(stbl, 'stsd'); const entry = children(stsd.body + 8, stsd.end)[0];
    if (entry.type === 'avc1') {
      t.width = r16(entry.body + 24); t.height = r16(entry.body + 26);
      const avcC = children(entry.body + 78, entry.end).find(c => c.type === 'avcC');
      t.codec = 'avc1.' + [1, 2, 3].map(i => buf[avcC.body + i].toString(16).padStart(2, '0')).join('');
      t.avcC = buf.subarray(avcC.body, avcC.end).toString('base64');
    } else if (entry.type === 'mp4a') {
      t.channels = r16(entry.body + 16); t.sampleRate = r32(entry.body + 24) / 65536;
      const esds = children(entry.body + 28, entry.end).find(c => c.type === 'esds');
      // walk descriptors to DecoderSpecificInfo (tag 5)
      let o = esds.body + 4; const rd = () => { const tag = buf[o++]; let n = 0, b; do { b = buf[o++]; n = (n << 7) | (b & 127); } while (b & 128); return [tag, n]; };
      let [tag] = rd(); if (tag === 3) { o += 3; [tag] = rd(); }
      let oti = 0, asc = null; if (tag === 4) { oti = buf[o]; o += 13; const [t5, n5] = rd(); if (t5 === 5) asc = buf.subarray(o, o + n5); }
      t.codec = 'mp4a.' + oti.toString(16) + '.' + (asc ? asc[0] >> 3 : '?');
      t.asc = asc ? asc.toString('hex') : null;
    } else t.codec = entry.type;
    const stts = find(stbl, 'stts'); t.stts = []; for (let i = 0, n = r32(stts.body + 4); i < n; i++) t.stts.push([r32(stts.body + 8 + i * 8), r32(stts.body + 12 + i * 8)]);
    const stsz = find(stbl, 'stsz'); const fixed = r32(stsz.body + 4); t.sampleCount = r32(stsz.body + 8);
    t.sizes = []; for (let i = 0; i < t.sampleCount; i++) t.sizes.push(fixed || r32(stsz.body + 12 + i * 4));
    const stss = find(stbl, 'stss'); if (stss) { t.keys = []; for (let i = 0, n = r32(stss.body + 4); i < n; i++) t.keys.push(r32(stss.body + 8 + i * 4)); }
    const stsc = find(stbl, 'stsc'); const sc = []; for (let i = 0, n = r32(stsc.body + 4); i < n; i++) sc.push([r32(stsc.body + 8 + i * 12), r32(stsc.body + 12 + i * 12)]);
    const co = find(stbl, 'stco') || find(stbl, 'co64'); const is64 = co.type === 'co64'; const chunks = [];
    for (let i = 0, n = r32(co.body + 4); i < n; i++) chunks.push(is64 ? r64(co.body + 8 + i * 8) : r32(co.body + 8 + i * 4));
    // expand chunk offsets to per-sample offsets
    t.offsets = []; let s = 0;
    for (let ci = 0; ci < chunks.length; ci++) {
      let per = 0; for (const [first, n] of sc) if (first <= ci + 1) per = n;
      let o = chunks[ci]; for (let k = 0; k < per && s < t.sampleCount; k++, s++) { t.offsets.push(o); o += t.sizes[s]; }
    }
    t.chunkBox = co.type; t.stsc = sc;
    res.tracks.push(t);
  }
  return res;
}
