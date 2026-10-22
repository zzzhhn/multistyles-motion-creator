// runtime.js — playback + offline export for the 60 s film (SPEC-60 §6).
// Contract: window.__DURATION, window.__renderAt(t) (pure), window.RSAudio.render() -> AudioBuffer.
// Query flags: ?still=1 (tools drive __renderAt; no loop/audio), ?export=1 (no autoplay/audio playback,
// exporter only), ?mr=1 (force the MediaRecorder fallback, for testing).
(() => {
  'use strict';
  const Q = new URLSearchParams(location.search);
  const STILL = Q.has('still'), EXPORT = Q.has('export'), FORCE_MR = Q.has('mr');
  const FPS = 60, HOLD = 1.0, SR = 48000, AAC_FRAME = 1024;
  const FILE_NAME = window.__FILE_NAME || 'jieqi-24.mp4';
  const DUR = () => window.__DURATION || 60;
  const canvas = document.getElementById('c') || document.querySelector('canvas');
  const sleep = ms => new Promise(r => setTimeout(r, ms));

  // ?from=a&to=b: a range of the film becomes the whole page (frames and soundtrack), for quick previews/exports
  if (Q.has('from') || Q.has('to')) {
    const full = window.__DURATION || 60, R0 = Math.max(0, +Q.get('from') || 0);
    const R1 = Math.min(full, Q.has('to') ? +Q.get('to') : full), inner = window.__renderAt, A = window.RSAudio;
    window.__DURATION = Math.max(1 / 60, R1 - R0);
    window.__renderAt = t => inner(R0 + t);
    if (A && A.render) {
      const render = A.render.bind(A);
      window.RSAudio = Object.assign(Object.create(A), { render: sr => Promise.resolve(render(sr)).then(buf => {
        if (!buf) return buf;
        const a = Math.round(R0 * buf.sampleRate), n = Math.max(1, Math.min(buf.length - a, Math.round(window.__DURATION * buf.sampleRate)));
        const out = new AudioBuffer({ length: n, numberOfChannels: buf.numberOfChannels, sampleRate: buf.sampleRate });
        for (let c = 0; c < buf.numberOfChannels; c++) out.copyToChannel(buf.getChannelData(c).subarray(a, a + n), c);
        return out;
      }) });
    }
  }

  // ---------------------------------------------------------------- soundtrack (rendered once)
  let audioP = null;
  function getAudio() {
    if (!audioP) {
      audioP = (window.RSAudio && window.RSAudio.render
        ? Promise.resolve().then(() => window.RSAudio.render(SR))
        : Promise.resolve(null)
      ).then(buf => buf && buf.sampleRate !== SR ? resample(buf) : buf)
       .catch(e => { console.error('RSAudio.render failed:', e); return null; });
    }
    return audioP;
  }
  function resample(buf) { // the encoder and player expect 48 kHz
    const oc = new OfflineAudioContext(buf.numberOfChannels, Math.round(buf.duration * SR), SR);
    const s = oc.createBufferSource(); s.buffer = buf; s.connect(oc.destination); s.start(0);
    return oc.startRendering();
  }

  // ---------------------------------------------------------------- minimal MP4 muxer
  const enc = new TextEncoder();
  const u8 = v => new Uint8Array([v & 255]);
  const u16 = v => new Uint8Array([(v >>> 8) & 255, v & 255]);
  const u24 = v => new Uint8Array([(v >>> 16) & 255, (v >>> 8) & 255, v & 255]);
  const u32 = v => new Uint8Array([(v >>> 24) & 255, (v >>> 16) & 255, (v >>> 8) & 255, v & 255]);
  const u64 = v => { const hi = Math.floor(v / 4294967296), lo = v >>> 0; return cat([u32(hi), u32(lo)]); };
  const zeros = n => new Uint8Array(n);
  const str = s => enc.encode(s);
  function cat(parts) {
    let n = 0; for (const p of parts) n += p.length;
    const out = new Uint8Array(n); let o = 0;
    for (const p of parts) { out.set(p, o); o += p.length; }
    return out;
  }
  const box = (type, ...parts) => { const body = cat(parts); return cat([u32(body.length + 8), str(type), body]); };
  const fbox = (type, version, flags, ...parts) => box(type, u8(version), u24(flags), ...parts);
  const MATRIX = cat([u32(0x00010000), u32(0), u32(0), u32(0), u32(0x00010000), u32(0), u32(0), u32(0), u32(0x40000000)]);

  // descriptor with 4-byte length (0x80 0x80 0x80 len) — accepted everywhere
  const desc = (tag, ...parts) => { const b = cat(parts); const n = b.length;
    return cat([u8(tag), u8(0x80 | ((n >>> 21) & 127)), u8(0x80 | ((n >>> 14) & 127)), u8(0x80 | ((n >>> 7) & 127)), u8(n & 127), b]); };

  function stbl(t, chunkOffsets, co64) {
    // one sample per chunk (chunks are interleaved by time in mdat)
    const n = t.sizes.length;
    const stts = fbox('stts', 0, 0, u32(1), u32(n), u32(t.delta));
    const stsc = fbox('stsc', 0, 0, u32(1), u32(1), u32(1), u32(1));
    const szs = zeros(n * 4); const dv = new DataView(szs.buffer);
    t.sizes.forEach((s, i) => dv.setUint32(i * 4, s));
    const stsz = fbox('stsz', 0, 0, u32(0), u32(n), szs);
    const offs = zeros(n * (co64 ? 8 : 4)); const ov = new DataView(offs.buffer);
    chunkOffsets.forEach((o, i) => { if (co64) { ov.setUint32(i * 8, Math.floor(o / 4294967296)); ov.setUint32(i * 8 + 4, o >>> 0); } else ov.setUint32(i * 4, o); });
    const stco = fbox(co64 ? 'co64' : 'stco', 0, 0, u32(n), offs);
    const parts = [t.stsd, stts];
    if (t.keys) { const k = zeros(t.keys.length * 4); const kv = new DataView(k.buffer); t.keys.forEach((s, i) => kv.setUint32(i * 4, s)); parts.push(fbox('stss', 0, 0, u32(t.keys.length), k)); }
    parts.push(stsc, stsz, stco);
    return box('stbl', ...parts);
  }
  function trak(t, id, movieDur, chunkOffsets, co64) {
    const isV = t.kind === 'video';
    const tkhd = fbox('tkhd', 0, 3, u32(0), u32(0), u32(id), u32(0), u32(movieDur), zeros(8), u16(0), u16(isV ? 0 : 1),
      u16(isV ? 0 : 0x0100), u16(0), MATRIX, u32(isV ? t.width * 65536 : 0), u32(isV ? t.height * 65536 : 0));
    const parts = [tkhd];
    if (t.elst) parts.push(box('edts', fbox('elst', 0, 0, u32(1), u32(t.elst.segDur), u32(t.elst.mediaTime), u16(1), u16(0))));
    const mdhd = fbox('mdhd', 0, 0, u32(0), u32(0), u32(t.timescale), u32(t.mediaDur), u16(0x55c4), u16(0));
    const hdlr = fbox('hdlr', 0, 0, u32(0), str(isV ? 'vide' : 'soun'), zeros(12), str(isV ? 'VideoHandler\0' : 'SoundHandler\0'));
    const mh = isV ? fbox('vmhd', 0, 1, zeros(8)) : fbox('smhd', 0, 0, zeros(4));
    const dinf = box('dinf', fbox('dref', 0, 0, u32(1), fbox('url ', 0, 1)));
    parts.push(box('mdia', mdhd, hdlr, box('minf', mh, dinf, stbl(t, chunkOffsets, co64))));
    return box('trak', ...parts);
  }
  function avc1Entry(width, height, avcC) {
    const name = zeros(32);
    return box('avc1', zeros(6), u16(1), zeros(16), u16(width), u16(height), u32(0x00480000), u32(0x00480000), u32(0), u16(1),
      name, u16(0x0018), u16(0xffff), box('avcC', avcC), box('pasp', u32(1), u32(1)));
  }
  function mp4aEntry(channels, rate, asc, avgBitrate) {
    const esds = fbox('esds', 0, 0, desc(3, u16(2), u8(0),
      desc(4, u8(0x40), u8(0x15), u24(0), u32(avgBitrate), u32(avgBitrate), desc(5, asc)),
      desc(6, u8(2))));
    return box('mp4a', zeros(6), u16(1), zeros(8), u16(channels), u16(16), u16(0), u16(0), u32(rate * 65536), esds);
  }

  // tracks: [{kind, timescale, delta, mediaDur, sizes[], data[] (Uint8Array), dts[] (sec, for interleave), stsd, keys?, elst?}]
  function muxMP4(tracks, movieDurMs) {
    const ftyp = box('ftyp', str('isom'), u32(0x200), str('isom'), str('iso2'), str('avc1'), str('mp41'));
    // interleave order of all samples by decode time
    const order = [];
    tracks.forEach((t, ti) => t.data.forEach((d, si) => order.push([t.dts[si], ti, si])));
    order.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    let payload = 0; for (const t of tracks) for (const d of t.data) payload += d.length;
    const co64 = payload > 0xFFFFFFFF - 1e7;
    const build = offs => box('moov',
      fbox('mvhd', 0, 0, u32(0), u32(0), u32(1000), u32(movieDurMs), u32(0x00010000), u16(0x0100), zeros(10), MATRIX, zeros(24), u32(tracks.length + 1)),
      ...tracks.map((t, i) => trak(t, i + 1, movieDurMs, offs[i], co64)));
    // pass 1: size of moov with dummy offsets; pass 2: real offsets (moov before mdat = faststart)
    const dummy = tracks.map(t => new Array(t.data.length).fill(0));
    const moovSize = build(dummy).length;
    const big = payload + 8 > 0xFFFFFFFF;
    const mdatHdr = big ? cat([u32(1), str('mdat'), u64(payload + 16)]) : cat([u32(payload + 8), str('mdat')]);
    let pos = ftyp.length + moovSize + mdatHdr.length;
    const offs = tracks.map(t => new Array(t.data.length));
    const body = [];
    for (const [, ti, si] of order) { offs[ti][si] = pos; const d = tracks[ti].data[si]; pos += d.length; body.push(d); }
    const moov = build(offs);
    if (moov.length !== moovSize) throw new Error('muxer: moov size changed between passes');
    return new Blob([ftyp, moov, mdatHdr, ...body], { type: 'video/mp4' });
  }

  // ---------------------------------------------------------------- WebCodecs exporter
  const hasWebCodecs = () => !FORCE_MR && typeof VideoEncoder === 'function' && typeof AudioEncoder === 'function' &&
    typeof VideoFrame === 'function' && typeof AudioData === 'function';

  async function pickVideoConfig(w, h) {
    const base = { width: w, height: h, bitrate: window.__VIDEO_BITRATE || (w * h > 2.5e6 ? 32e6 : 18e6), framerate: FPS, avc: { format: 'avc' }, latencyMode: 'quality', bitrateMode: 'variable' };
    for (const codec of (w * h > 2.2e6 ? ['avc1.640033', 'avc1.640034', 'avc1.4d0033'] : ['avc1.640028', 'avc1.4d0028', 'avc1.42e028'])) {
      for (const hw of ['no-preference', 'prefer-software']) {
        const cfg = { ...base, codec, hardwareAcceleration: hw };
        try { const s = await VideoEncoder.isConfigSupported(cfg); if (s.supported) return s.config || cfg; } catch (e) { /* try next */ }
      }
    }
    throw new Error('no supported H.264 encoder config');
  }
  const audioConfig = ch => ({ codec: 'mp4a.40.2', sampleRate: SR, numberOfChannels: ch, bitrate: 192000 });

  function planarChunk(buf, off, n, ch, limit = buf.length) {
    const data = new Float32Array(n * ch);
    for (let c = 0; c < ch; c++) {
      const src = buf.getChannelData(Math.min(c, buf.numberOfChannels - 1));
      if (off < limit) data.set(src.subarray(off, Math.min(off + n, src.length, limit)), c * n); // rest stays 0
    }
    return new AudioData({ format: 'f32-planar', sampleRate: SR, numberOfFrames: n, numberOfChannels: ch,
      timestamp: Math.round(off * 1e6 / SR), data });
  }

  // Encode an AudioBuffer to AAC; returns {chunks:[Uint8Array], asc:Uint8Array}
  async function encodeAAC(buf, ch, extraFrames = 0, frames = buf.length) {
    const chunks = []; let asc = null, err = null;
    const ae = new AudioEncoder({
      output: (c, meta) => {
        if (!asc && meta && meta.decoderConfig && meta.decoderConfig.description) asc = new Uint8Array(meta.decoderConfig.description.slice ? meta.decoderConfig.description.slice(0) : meta.decoderConfig.description);
        const b = new Uint8Array(c.byteLength); c.copyTo(b); chunks.push(b);
      },
      error: e => { err = e; },
    });
    ae.configure(audioConfig(ch));
    const total = frames + extraFrames * AAC_FRAME; // samples past frames/buf.length are silence
    for (let off = 0; off < total; off += AAC_FRAME) {
      const d = planarChunk(buf, off, AAC_FRAME, ch, frames); ae.encode(d); d.close();
      if (ae.encodeQueueSize > 64) await sleep(0);
      if (err) throw err;
    }
    await ae.flush(); ae.close();
    if (err) throw err;
    return { chunks, asc };
  }
  // AudioSpecificConfig fallback: AAC-LC(2), 48 kHz (index 3), channel config
  const defaultASC = ch => new Uint8Array([(2 << 3) | (3 >> 1), ((3 & 1) << 7) | (ch << 3)]);

  // Encoder priming delay (samples) measured once: encode a click, decode it back, find the click.
  let primingP = null;
  function measurePriming(ch) {
    if (primingP) return primingP;
    primingP = (async () => {
      if (typeof AudioDecoder !== 'function') return 2112;
      const len = SR / 2, at = 9600;
      const ob = new OfflineAudioContext(ch, len, SR).createBuffer(ch, len, SR);
      for (let c = 0; c < ch; c++) { const d = ob.getChannelData(c); for (let i = 0; i < 48; i++) d[at + i] = Math.sin(i / 48 * Math.PI) * 0.8; }
      const { chunks, asc } = await encodeAAC(ob, ch, 3);
      const out = []; let err = null;
      const dec = new AudioDecoder({ output: a => { const f = new Float32Array(a.numberOfFrames); a.copyTo(f, { planeIndex: 0, format: 'f32-planar' }); out.push(f); a.close(); }, error: e => { err = e; } });
      dec.configure({ codec: 'mp4a.40.2', sampleRate: SR, numberOfChannels: ch, description: asc || defaultASC(ch) });
      chunks.forEach((b, i) => dec.decode(new EncodedAudioChunk({ type: 'key', timestamp: Math.round(i * AAC_FRAME * 1e6 / SR), data: b })));
      await dec.flush(); dec.close();
      if (err) throw err;
      const pcm = cat(out.map(f => new Uint8Array(f.buffer))); const f = new Float32Array(pcm.buffer);
      let best = 0, bi = -1; for (let i = 0; i < f.length; i++) { const v = Math.abs(f[i]); if (v > best) { best = v; bi = i; } }
      // click peak sits at at+24 in the source
      const d = bi - (at + 24);
      return d >= 0 && d < 8192 ? Math.round(d) : 2112;
    })().catch(e => { console.warn('priming measure failed, assuming 2112:', e); return 2112; });
    return primingP;
  }

  let exporting = null;
  async function exportWebCodecs(onProgress) {
    const prog = typeof onProgress === 'function' ? onProgress : () => {};
    const D = DUR(), N = Math.round(D * FPS), W = canvas.width, H = canvas.height;
    const tStart = performance.now();
    const abuf = await getAudio();
    const ch = 2; // always stereo (mono buffers are duplicated)
    const priming = abuf ? await measurePriming(ch) : 0;

    // --- video
    const vcfg = await pickVideoConfig(W, H);
    const vs = { sizes: [], data: [], dts: [], keys: [], ts: [] }; let avcC = null, verr = null;
    const ve = new VideoEncoder({
      output: (c, meta) => {
        if (!avcC && meta && meta.decoderConfig && meta.decoderConfig.description) avcC = new Uint8Array(meta.decoderConfig.description.slice ? meta.decoderConfig.description.slice(0) : meta.decoderConfig.description);
        const b = new Uint8Array(c.byteLength); c.copyTo(b);
        vs.data.push(b); vs.sizes.push(b.length); vs.ts.push(c.timestamp);
        if (c.type === 'key') vs.keys.push(vs.data.length);
      },
      error: e => { verr = e; },
    });
    ve.configure(vcfg);
    const waitQueue = () => new Promise(r => { let done = false; const f = () => { if (!done) { done = true; r(); } };
      ve.addEventListener && ve.addEventListener('dequeue', f, { once: true }); setTimeout(f, 4); });
    const dur = Math.round(1e6 / FPS);
    for (let i = 0; i < N; i++) {
      window.__renderAt(i / FPS);
      const fr = new VideoFrame(canvas, { timestamp: Math.round(i * 1e6 / FPS), duration: dur });
      ve.encode(fr, { keyFrame: i % (2 * FPS) === 0 }); fr.close();
      while (ve.encodeQueueSize > 8 && !verr) await waitQueue();
      if (verr) throw verr;
      if (i % 15 === 0) { prog(0.95 * i / N); await sleep(0); }
    }
    await ve.flush(); ve.close();
    if (verr) throw verr;
    if (vs.data.length !== N) throw new Error(`video encoder produced ${vs.data.length} chunks, expected ${N}`);
    for (let i = 1; i < N; i++) if (vs.ts[i] <= vs.ts[i - 1]) throw new Error('video chunks out of order (B-frames?) — ctts not supported');
    if (!avcC) throw new Error('no avcC from VideoEncoder');
    vs.dts = vs.data.map((_, i) => i / FPS);
    const video = { kind: 'video', width: W, height: H, timescale: FPS * 1000, delta: 1000, mediaDur: N * 1000,
      stsd: fbox('stsd', 0, 0, u32(1), avc1Entry(W, H, avcC)), ...vs };
    const tracks = [video];

    // --- audio (same AudioBuffer the player uses); pad so the priming + tail are fully flushed
    if (abuf) {
      prog(0.96);
      const { chunks, asc } = await encodeAAC(abuf, ch, 1, Math.round(D * SR)); // exactly D s of programme
      const n = chunks.length;
      const audio = { kind: 'audio', timescale: SR, delta: AAC_FRAME, mediaDur: n * AAC_FRAME,
        sizes: chunks.map(b => b.length), data: chunks, dts: chunks.map((_, i) => (i * AAC_FRAME - priming) / SR),
        elst: { segDur: Math.round(D * 1000), mediaTime: priming },
        stsd: fbox('stsd', 0, 0, u32(1), mp4aEntry(ch, SR, asc || defaultASC(ch), 192000)) };
      tracks.push(audio);
    }
    prog(0.99);
    const blob = muxMP4(tracks, Math.round(D * 1000));
    window.__lastExport = { frames: N, videoChunks: vs.data.length, keyframes: vs.keys.length, audioChunks: abuf ? tracks[1].data.length : 0,
      priming, codec: vcfg.codec, bytes: blob.size, seconds: (performance.now() - tStart) / 1000 };
    prog(1);
    return blob;
  }

  // ---------------------------------------------------------------- MediaRecorder fallback (real time)
  function pickMime() {
    const c = ['video/mp4;codecs=avc1.640028,mp4a.40.2', 'video/mp4;codecs=avc1,mp4a.40.2', 'video/mp4',
      'video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm'];
    return (window.MediaRecorder && c.find(m => MediaRecorder.isTypeSupported(m))) || '';
  }
  async function exportRealtime(onProgress) {
    const prog = typeof onProgress === 'function' ? onProgress : () => {};
    if (!window.MediaRecorder || !canvas.captureStream) throw new Error('neither WebCodecs nor MediaRecorder available');
    const D = DUR(), abuf = await getAudio();
    stopPlayback();
    const ac = new AudioContext({ sampleRate: SR }); await ac.resume().catch(() => {});
    const dest = ac.createMediaStreamDestination();
    const stream = canvas.captureStream(FPS);
    dest.stream.getAudioTracks().forEach(tr => stream.addTrack(tr));
    const mime = pickMime();
    const rec = new MediaRecorder(stream, { mimeType: mime || undefined, videoBitsPerSecond: window.__VIDEO_BITRATE || 16e6, audioBitsPerSecond: 192000 });
    const parts = []; rec.ondataavailable = e => e.data && e.data.size && parts.push(e.data);
    const stopped = new Promise(r => { rec.onstop = r; });
    window.__renderAt(0);
    rec.start(250);
    const start = ac.currentTime + 0.1;
    if (abuf) { const s = ac.createBufferSource(); s.buffer = abuf; s.connect(dest); s.start(start); }
    await new Promise(resolve => {
      const tick = () => {
        const t = Math.max(0, ac.currentTime - start);
        window.__renderAt(Math.min(t, D)); prog(Math.min(1, t / D), t);
        if (t >= D + 0.15) resolve(); else requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
    rec.stop(); await stopped; ac.close();
    const type = (mime || 'video/webm').split(';')[0];
    const blob = new Blob(parts, { type });
    blob.__ext = type === 'video/mp4' ? 'mp4' : 'webm';
    return blob;
  }

  function exportMP4(onProgress) {
    if (exporting) return exporting;
    stopPlayback(); // the exporter owns the canvas until it is done
    const run = hasWebCodecs() ? exportWebCodecs(onProgress) : exportRealtime(onProgress);
    exporting = run.finally(() => { exporting = null; if (!STILL && !EXPORT) restartPlayback(); });
    return exporting;
  }
  window.__exportMP4 = exportMP4;

  // ---------------------------------------------------------------- #rec button
  let btn = document.getElementById('rec');
  if (!btn) {
    btn = document.createElement('button'); btn.id = 'rec';
    btn.style.cssText = 'position:fixed;right:24px;bottom:24px;z-index:10;font:600 16px/1 "PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif;padding:12px 18px;border-radius:999px;border:0;background:#15181d;color:#fff;cursor:pointer;opacity:.92';
    document.body.appendChild(btn);
  }
  const REC_LABEL = '● 录制并下载';
  btn.textContent = REC_LABEL;
  const fresh = btn.cloneNode(true); btn.replaceWith(fresh); btn = fresh; // drop any listeners film.html attached
  btn.onclick = async e => {
    e.stopPropagation();
    if (exporting) return;
    unlockAudio(false);
    btn.disabled = true; btn.style.opacity = '.75';
    const realtime = !hasWebCodecs();
    btn.textContent = '准备音轨…';
    await getAudio(); // the soundtrack must be fully rendered before recording / encoding starts
    btn.textContent = realtime ? '录制中 0 / ' + DUR() + 's' : '导出中 0%';
    let last = '';
    try {
      const blob = await exportMP4((p, t) => {
        const s = realtime ? '录制中 ' + Math.floor(t || p * DUR()) + ' / ' + DUR() + 's' : '导出中 ' + Math.floor(p * 100) + '%';
        if (s !== last) { btn.textContent = s; last = s; }
      });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = blob.__ext === 'webm' ? FILE_NAME.replace(/\.mp4$/, '.webm') : FILE_NAME;
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 60000);
    } catch (err) {
      console.error('export failed:', err); alert('导出失败：' + (err && err.message || err));
    } finally {
      btn.disabled = false; btn.style.opacity = ''; btn.textContent = REC_LABEL;
    }
  };

  // ---------------------------------------------------------------- player
  let ctx = null, src = null, soundOn = false, wantSound = false, pill = null;
  let audioStart = 0, t0 = performance.now(), running = false, rafId = 0;

  function audioClock() { // seconds of film currently being heard
    let now = ctx.currentTime;
    if (ctx.getOutputTimestamp) {
      const ts = ctx.getOutputTimestamp();
      if (ts && ts.contextTime > 0 && ts.performanceTime > 0) now = ts.contextTime + (performance.now() - ts.performanceTime) / 1000;
    }
    return now - audioStart;
  }
  function startSource(offset) {
    if (src) { try { src.stop(); } catch (e) {} src.disconnect(); src = null; }
    audioStart = ctx.currentTime + 0.06 - offset;
    src = ctx.createBufferSource(); src.buffer = abufCache; src.connect(ctx.destination);
    src.start(ctx.currentTime + 0.06, Math.max(0, offset));
  }
  let abufCache = null;
  function frame(now) {
    if (!running) return;
    const D = DUR(), L = D + HOLD;
    let t;
    if (soundOn) {
      t = audioClock();
      if (t >= L) { startSource(0); t = audioClock(); }
    } else {
      t = (now - t0) / 1000;
      if (t >= L) { t0 = now; t = 0; }
    }
    lastT = Math.min(Math.max(t, 0), D);
    window.__renderAt(lastT);
    rafId = requestAnimationFrame(frame);
  }
  function stopPlayback() {
    running = false; cancelAnimationFrame(rafId);
    if (src) { try { src.stop(); } catch (e) {} src.disconnect(); src = null; }
  }
  function restartPlayback() {
    stopPlayback();
    soundOn = false; t0 = performance.now();
    if (ctx && ctx.state === 'running' && abufCache) { soundOn = true; setPill(null); startSource(0); }
    running = true; rafId = requestAnimationFrame(frame);
  }
  function setPill(text) {
    if (!pill) return;
    if (!text) { pill.style.display = 'none'; return; }
    pill.textContent = text; pill.style.display = '';
  }
  function unlockAudio(restart) {
    if (STILL || EXPORT) return;
    wantSound = true;
    if (!ctx) ctx = new AudioContext({ sampleRate: SR });
    const p = ctx.state === 'running' ? Promise.resolve() : ctx.resume();
    p.then(() => {
      if (!abufCache) { setPill('声音加载中…'); return; } // started when the buffer arrives
      setPill(null);
      if (restart) restartPlayback();
    }).catch(e => console.warn('AudioContext resume failed:', e));
  }

  let lastT = 0;
  window.__playerState = () => ({ running, soundOn, ctxState: ctx ? ctx.state : 'none', audioReady: !!abufCache,
    t: lastT, pill: pill && pill.style.display !== 'none' ? pill.textContent : null, exporting: !!exporting });

  function boot() {
  if (STILL) { window.__renderAt(0); return; }
  if (EXPORT) { window.__renderAt(0); getAudio(); return; }

  // pill (DOM only, never drawn on the canvas)
  pill = document.createElement('div');
  pill.id = 'sound-pill';
  pill.style.cssText = 'position:fixed;top:18px;left:50%;transform:translateX(-50%);z-index:10;font:600 18px/1 "PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif;padding:10px 18px;border-radius:999px;background:rgba(21,24,29,.82);color:#fff;cursor:pointer;user-select:none';
  pill.textContent = '🔊 点击开启声音';
  document.body.appendChild(pill);
  const onGesture = e => {
    if (soundOn) return;
    if (e.target === btn) return; // the #rec handler deals with its own click
    unlockAudio(true);
  };
  addEventListener('pointerdown', onGesture, true);
  addEventListener('keydown', onGesture, true);

  // autoplay visuals right away; soundtrack renders in the background
  try { ctx = new AudioContext({ sampleRate: SR }); } catch (e) { ctx = null; }
  running = true; rafId = requestAnimationFrame(frame);
  getAudio().then(buf => {
    abufCache = buf;
    if (!buf) { setPill(null); return; }
    // clicked #rec before the buffer was ready: sound starts when the export ends, so drop the loading status now
    if (exporting && wantSound) setPill(ctx && ctx.state === 'running' ? null : '🔊 点击开启声音');
    if (ctx && ctx.state === 'running' && !soundOn && !exporting) {
      // autoplay allowed (or already unlocked): join with sound — immediately if no click happened,
      // from t=0 if the user clicked while the buffer was still rendering
      const t = wantSound ? 0 : Math.min(DUR(), (performance.now() - t0) / 1000);
      setPill(null); soundOn = true; startSource(t);
    }
  });
  }
  if (typeof window.__renderAt === 'function') boot();
  else addEventListener('load', boot, { once: true }); // runtime included before the film script
})();
