// audio-inst.js — Tone.js instrument recipes for the 《八十一难》 score (owned by the BGM task).
// audio.js renders every cell in its own Tone.OfflineContext and calls RSInst.make(id, bus, opts) there; each recipe
// builds its nodes in the *current* Tone context and knows its own idiom (slides, graces, tremolo, arpeggios ...).
// No samples, no AudioWorklet nodes (they serialise offline rendering), no Date/performance. Noise sources use
// Math.random, which audio.js swaps for a seeded PRNG during the render; recipe decisions use info.rng (seeded).
(() => {
  'use strict';
  let T = null;                                                  // Tone, bound in make()
  const hz = m => 440 * Math.pow(2, (m - 69) / 12);
  const P = (...a) => ({ type: 'custom', partials: a });         // additive oscillator
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));

  // ------------------------------------------------------------------ routing
  // Determinism: Chrome sums the inputs of a node in pointer-hash order, so any node fed by 3+ connections gives
  // last-bit differences from render to render. Every shared destination is therefore fed through a binary chain
  // (each Gain has exactly two inputs; float addition of two terms is commutative, so the result is bit-exact).
  function summer(dest) {
    let tail = null;
    return () => { const g = new T.Gain(1); g.connect(tail || dest); tail = g; return g; };
  }
  // instrument -> gain -> panner (scaled by the cell's width) -> dry bus, + post-pan send to the shared hall
  function chan(bus, o = {}) {
    const dIn = bus._dIn || (bus._dIn = summer(bus.dry)), sIn = bus._sIn || (bus._sIn = summer(bus.send));
    const g = new T.Gain(o.gain == null ? 1 : o.gain);
    const sendAmt = (o.send == null ? 1 : o.send) * bus.sendLevel;
    if (o.stereo) { g.connect(dIn()); const s = new T.Gain(sendAmt); g.connect(s); s.connect(sIn()); return g; }
    const p = new T.Panner(clamp((o.pan || 0) * bus.width, -1, 1));
    g.connect(p); p.connect(dIn());
    const s = new T.Gain(sendAmt); p.connect(s); s.connect(sIn());
    return g;
  }
  // parallel band-pass bank (vowels, nasal reeds, instrument bodies); returns its input node
  function formants(dest, list) {
    const inp = new T.Gain(1), sum = summer(dest);
    list.forEach(([f, q, g]) => { const bp = new T.Filter({ type: 'bandpass', frequency: f, Q: q }); inp.connect(bp); bp.connect(new T.Gain(g).connect(sum())); });
    return inp;
  }
  // pick chord tones (pitch classes, semitones above C) as midi notes from `lo` upward
  function stack(pcs, lo, count, skip = 0) {
    const out = []; let m = lo;
    while (out.length < count + skip && m < lo + 48) { if (pcs.includes(((m % 12) + 12) % 12)) out.push(m); m++; }
    return out.slice(skip);
  }

  // voice pool: hands out a voice whose last scheduled event (release end) is <= t, else builds a new one, so material
  // can be scheduled in any order without breaking Tone's strictly increasing source timelines
  function pool(mk, n0) {
    const vs = [], en = [];
    const add = () => { vs.push(mk()); en.push(-1); return vs.length - 1; };
    for (let k = 0; k < n0; k++) add();
    let rr = 0;
    return (t, end) => {
      let j = -1;
      for (let k = 0; k < vs.length && j < 0; k++) { const q = (rr + k) % vs.length; if (en[q] <= t) j = q; }
      if (j < 0) j = add();
      rr = j + 1; en[j] = end;
      return vs[j];
    };
  }

  // ------------------------------------------------------------------ engine 1: legato monophonic voice
  // Manual pitch path: slides between tied notes, scoops into attacks, on-beat graces, delayed vibrato, breath noise.
  function legato(bus, d, o) {
    const out = chan(bus, o);
    const dest = d.formants ? formants(out, d.formants) : out;
    const lp = new T.Filter({ type: 'lowpass', frequency: d.lp || 9000, Q: 0.4 }).connect(dest);
    const expr = new T.Gain(0).connect(lp);
    const envO = { attack: d.env[0], decay: d.env[1], sustain: d.env[2], release: d.env[3] };
    const mk = () => d.fenv                                      // fenv: [attack, decay, sustain, base Hz, octaves] -> brass/synth "blat"
      ? new T.MonoSynth({ oscillator: d.osc, envelope: envO, filter: { type: 'lowpass', Q: d.fq || 1, rolloff: -24 },
        filterEnvelope: { attack: d.fenv[0], decay: d.fenv[1], sustain: d.fenv[2], release: 0.2, baseFrequency: d.fenv[3], octaves: d.fenv[4], exponent: 2 } })
      : new T.Synth({ oscillator: d.osc, envelope: envO });
    const syn = mk().connect(expr);
    let dbl = null;                                              // optional detuned double (aulos, accordion, sections)
    if (d.double) { dbl = mk().connect(expr); dbl.detune.value = d.double; }
    let vib = null;
    if (d.vib) { vib = new T.LFO({ frequency: d.vib[0], min: -d.vib[1], max: d.vib[1] }); vib.amplitude.value = 0; vib.connect(syn.detune); vib.start(0); }
    let br = null;
    if (d.breath) {
      const nz = new T.Noise(d.breath[2] || 'pink'), f = new T.Filter({ type: 'bandpass', Q: d.breath[1], frequency: 1200 }), g = new T.Gain(0);
      nz.connect(f); f.connect(g); g.connect(lp); nz.start(0); br = { f, g };
    }
    const lvl = d.level || 0.5;
    function play(notes) {
      let prevEnd = -9, prevF = 0;
      notes.forEach((n, i) => {
        const f = hz(n.m), t = n.t, tied = d.slide && i > 0 && t - prevEnd < 0.03;
        const fr = syn.frequency;
        if (!tied) { syn.triggerAttack(f, t, 1); if (dbl) dbl.triggerAttack(f, t, 1); }
        const pitch = (v, at) => { fr.setValueAtTime(v, at); if (dbl) dbl.frequency.setValueAtTime(v, at); };
        const ramp = (v, at) => { fr.exponentialRampToValueAtTime(v, at); if (dbl) dbl.frequency.exponentialRampToValueAtTime(v, at); };
        const t1 = t + 1e-4;
        if (tied) { pitch(prevF, t1); ramp(f, t + (n.slide || d.slide)); }
        else if (n.scoop || d.scoop) { pitch(f * Math.pow(2, -(n.scoop || d.scoop) / 12), t1); ramp(f, t + 0.08); }
        if (n.grace != null) { pitch(hz(n.grace), t1 + 1e-4); pitch(f, t + (d.graceLen || 0.055)); }
        if (n.bend) { pitch(f, t + n.d * 0.55); ramp(f * Math.pow(2, n.bend / 12), t + n.d * 0.9); }
        if (n.fall && !(notes[i + 1] && notes[i + 1].t - (t + n.d) < 0.03)) { pitch(f, t + n.d - 0.16); ramp(f * Math.pow(2, -n.fall / 12), t + n.d); }
        expr.gain.setTargetAtTime(lvl * n.v, t, 0.012);
        if (n.swell) expr.gain.setTargetAtTime(lvl * n.v * n.swell, t + 0.2, n.d * 0.4);
        if (br) { br.f.frequency.setValueAtTime(clamp(f * d.breath[3], 200, 12000), t); br.g.gain.setTargetAtTime(d.breath[0] * n.v, t, 0.015); br.g.gain.setTargetAtTime(d.breath[0] * n.v * 0.45, t + 0.08, 0.1); }
        if (vib) { vib.amplitude.setValueAtTime(0, t); if (n.d > 0.3) vib.amplitude.linearRampToValueAtTime(n.vib == null ? 1 : clamp(n.vib, 0, 1), t + Math.min(n.d * 0.8, d.vib[2] + 0.3)); }
        const end = t + n.d, nx = notes[i + 1];
        if (!nx || !d.slide || nx.t - end >= 0.03) { syn.triggerRelease(end); if (dbl) dbl.triggerRelease(end); if (br) br.g.gain.setTargetAtTime(0, end, 0.03); }
        prevEnd = end; prevF = f;
      });
    }
    return { play, syn };
  }

  // ------------------------------------------------------------------ engine 2: plucked / struck strings (poly)
  // MonoSynth per voice: additive or saw source, -24 dB lowpass whose envelope closes faster than the amp (bright
  // attack, darker ring), optional body peak, buzz (distortion) and pick/bachi click. Bends via frequency automation.
  function plucker(bus, d, o) {
    const out = chan(bus, o);
    let dest = out;
    if (d.dist) { const ds = new T.Distortion({ distortion: d.dist, wet: d.distWet || 0.5 }).connect(dest); dest = ds; }
    if (d.body) { const b = new T.Filter({ type: 'peaking', frequency: d.body[0], Q: d.body[1], gain: d.body[2] }).connect(dest); dest = b; }
    const vin = summer(dest);
    const get = pool(() => new T.MonoSynth({
      oscillator: d.osc, filter: { type: 'lowpass', Q: d.q || 0.8, rolloff: -24 },
      envelope: { attack: d.att || 0.004, decay: d.decay, sustain: 0, release: d.rel || 0.25 },
      filterEnvelope: { attack: 0.002, decay: d.fdec || d.decay * 0.35, sustain: d.fsus == null ? 0.12 : d.fsus, release: 0.3, baseFrequency: d.fbase || 400, octaves: d.foct || 3.5, exponent: 2 },
    }).connect(vin()), Math.min(4, d.voices || 4));
    let click = null;
    if (d.click) { const hp = new T.Filter({ type: 'bandpass', frequency: d.click[2] || 3500, Q: 0.9 }).connect(vin());
      click = pool(() => new T.NoiseSynth({ noise: { type: 'white' }, envelope: { attack: 0.001, decay: d.click[1] || 0.012, sustain: 0, release: 0.01 } }).connect(hp), 1); }
    const lvl = d.level || 0.5;
    function strike(t, m, dur, v, opt = {}) {
      const s = get(t, t + Math.max(0.05, dur) + (d.rel || 0.25) + 0.01), f = hz(m);
      s.frequency.cancelScheduledValues(t);                      // a reused voice must not inherit the last note's bends
      s.triggerAttackRelease(opt.from != null ? hz(opt.from) : f, Math.max(0.05, dur), t, clamp(v * lvl, 0, 1));
      if (opt.from != null) { s.frequency.setValueAtTime(hz(opt.from), t + 0.01); s.frequency.exponentialRampToValueAtTime(f, t + (opt.slideT || 0.09)); }
      if (opt.bendTo != null) { s.frequency.setValueAtTime(f, t + opt.bendAt); s.frequency.exponentialRampToValueAtTime(hz(opt.bendTo), t + opt.bendAt + 0.12); }
      if (opt.wobble) { const w = opt.wobble, rate = 5.2; for (let k = 0; k * (1 / rate) < dur - 0.2; k++) { const at = t + 0.2 + k / rate; s.frequency.linearRampToValueAtTime(f * Math.pow(2, w / 1200), at + 0.25 / rate); s.frequency.linearRampToValueAtTime(f * Math.pow(2, -w / 1200), at + 0.75 / rate); } }
      if (click) click(t, t + 0.04).triggerAttackRelease(0.02, t, clamp(v * d.click[0], 0, 1));
      return s;
    }
    return { strike };
  }

  // ------------------------------------------------------------------ engine 3: FM bells and mallets (poly)
  function bells(bus, d, o) {
    const out = chan(bus, o);
    let dest = out;
    if (d.trem) { const tr = new T.Tremolo({ frequency: d.trem[0], depth: d.trem[1], spread: 0 }).start(0); tr.connect(dest); dest = tr; }
    if (d.delay) { const dl = new T.FeedbackDelay({ delayTime: d.delay[0], feedback: d.delay[1], wet: d.delay[2] }); dl.connect(dest); dest = dl; }
    const lp = new T.Filter({ type: 'lowpass', frequency: d.lp || 12000, Q: 0.3 }).connect(dest), vin = summer(lp);
    const get = pool(() => new T.FMSynth({
      harmonicity: d.h, modulationIndex: d.mi, oscillator: { type: d.car || 'sine' }, modulation: { type: d.mod || 'sine' },
      envelope: { attack: d.att || 0.002, decay: d.decay, sustain: d.sus || 0, release: d.rel || 0.6 },
      modulationEnvelope: { attack: 0.002, decay: d.mdec || 0.25, sustain: d.msus || 0, release: 0.3 },
    }).connect(vin()), Math.min(3, d.voices || 3));
    const lvl = d.level || 0.4, busy = (t, dur) => t + Math.max(0.05, dur) + (d.rel || 0.6) + 0.02;
    function strike(t, m, dur, v) {
      get(t, busy(t, dur)).triggerAttackRelease(hz(m), Math.max(0.05, dur), t, clamp(v * lvl, 0, 1));
      if (d.second) get(t + 0.003, busy(t + 0.003, dur)).triggerAttackRelease(hz(m) * d.second[0], Math.max(0.05, dur), t + 0.003, clamp(v * lvl * d.second[1], 0, 1));
    }
    return { strike };
  }

  // ------------------------------------------------------------------ engine 4: sustained poly pad (strings, choir, organ, sheng, glass)
  function pad(bus, d, o) {
    const out = chan(bus, Object.assign({}, o, d.chorus ? { stereo: true } : {}));
    let dest = out;
    if (d.chorus) { const ch = new T.Chorus({ frequency: d.chorus[0], delayTime: d.chorus[1], depth: d.chorus[2], spread: 140 }).start(0); ch.connect(dest); dest = ch; }
    if (d.formants) dest = formants(dest, d.formants);
    if (d.trem) { const tr = new T.Tremolo({ frequency: d.trem[0], depth: d.trem[1], spread: 0 }).start(0); tr.connect(dest); dest = tr; }
    const lp = new T.Filter({ type: 'lowpass', frequency: d.lp || 4000, Q: d.q || 0.5 }).connect(dest);
    const lfo = d.vib ? new T.LFO({ frequency: d.vib[0], min: -d.vib[1], max: d.vib[1] }).start(0) : null;
    const vin = summer(lp);
    const get = pool(() => { const s = new T.Synth({ oscillator: d.osc, envelope: { attack: d.env[0], decay: d.env[1], sustain: d.env[2], release: d.env[3] } }).connect(vin()); if (lfo) lfo.connect(s.detune); return s; }, 2);
    const lvl = d.level || 0.3, busy = (t, dur) => t + Math.max(0.05, dur) + d.env[3] + 0.02;
    function chord(t, ms, dur, v) { ms.forEach(m => get(t, busy(t, dur)).triggerAttackRelease(hz(m), Math.max(0.05, dur), t, clamp(v * lvl, 0, 1))); }
    function glide(t, m0, m1, dur, v, gt) {                     // one voice sliding (string glissando, choir portamento)
      const s = get(t, busy(t, dur)); s.frequency.cancelScheduledValues(t);
      s.triggerAttackRelease(hz(m0), dur, t, clamp(v * lvl, 0, 1));
      s.frequency.setValueAtTime(hz(m0), t + 0.02); s.frequency.exponentialRampToValueAtTime(hz(m1), t + (gt || dur * 0.7));
    }
    return { chord, glide, out, lp };
  }

  // ------------------------------------------------------------------ engine 5: drums and clicks
  function membrane(bus, d, o) {
    const out = chan(bus, o);
    const dec = d.decay || 0.4, vin = summer(out);
    const get = pool(() => new T.MembraneSynth({ pitchDecay: d.pd || 0.05, octaves: d.oct || 4, oscillator: { type: d.wave || 'sine' },
      envelope: { attack: 0.001, decay: dec, sustain: 0, release: 0.1 } }).connect(vin()), 1);
    let nz = null;
    if (d.skin) { const f = new T.Filter({ type: 'bandpass', frequency: d.skin[2], Q: 0.7 }).connect(vin()); nz = pool(() => new T.NoiseSynth({ noise: { type: d.skin[3] || 'white' }, envelope: { attack: 0.001, decay: d.skin[1], sustain: 0, release: 0.02 } }).connect(f), 1); }
    function hit(t, v, f) {
      get(t, t + dec + 0.11).triggerAttackRelease(f || d.f, dec, t, clamp(v * (d.level || 0.8), 0, 1));
      if (nz) nz(t, t + 0.09).triggerAttackRelease(0.06, t, clamp(v * d.skin[0], 0, 1));
    }
    return { hit };
  }
  function noiser(bus, d, o) {                                   // shakers, hats, snare wires, brushes, claps, scrapes
    const out = chan(bus, o);
    const f = new T.Filter({ type: d.ft || 'bandpass', frequency: d.ff || 6000, Q: d.fq || 0.8 }).connect(out), vin = summer(f);
    const get = pool(() => new T.NoiseSynth({ noise: { type: d.noise || 'white' }, envelope: { attack: d.att || 0.001, decay: d.decay || 0.08, sustain: 0, release: 0.03 } }).connect(vin()), 1);
    function hit(t, v, len) { get(t, t + (len || 0.03) + 0.04).triggerAttackRelease(len || 0.03, t, clamp(v * (d.level || 0.5), 0, 1)); }
    return { hit, filter: f };
  }
  function metal(bus, d, o) {                                    // cymbals, gongs, clangs, ride: inharmonic FM + band noise
    const out = chan(bus, o), vin = summer(out), dec = d.decay || 0.4, rel = d.rel || 0.2;   // (MetalSynth sums 6 oscillators: not bit-exact)
    const hp = new T.Filter({ type: 'highpass', frequency: Math.min(9000, (d.res || 4000) * 0.8), Q: 0.5 }).connect(vin());
    const getN = pool(() => new T.NoiseSynth({ noise: { type: 'white' }, envelope: { attack: d.att || 0.001, decay: dec * 0.7, sustain: 0, release: rel } }).connect(hp), 1);
    const getF = pool(() => new T.FMSynth({ harmonicity: (d.h || 5.1) * 0.29, modulationIndex: (d.mi || 32) * 0.4, oscillator: { type: 'sine' }, modulation: { type: 'square' },
      envelope: { attack: d.att || 0.001, decay: dec, sustain: 0, release: rel }, modulationEnvelope: { attack: 0.001, decay: dec * 0.8, sustain: 0.2, release: 0.2 } }).connect(vin()), 1);
    function hit(t, v, f, dur) {
      const L = dur || dec, vv = clamp(v * (d.level || 0.3), 0, 1), e = t + L + rel + 0.01;
      getF(t, e).triggerAttackRelease((f || d.f || 200) * 2.3, L, t, vv * 0.8); getN(t, e).triggerAttackRelease(L, t, vv);
    }
    return { hit };
  }
  function clicker(bus, d, o) {                                  // woodblock, bangzi, shell, typewriter key: pitched click with a drop
    const out = chan(bus, o);
    const bp = new T.Filter({ type: 'bandpass', frequency: d.f, Q: d.q || 1.5 }).connect(out), vin = summer(bp);
    const get = pool(() => new T.MembraneSynth({ pitchDecay: d.pd || 0.008, octaves: d.oct || 1.6, oscillator: { type: d.wave || 'triangle' },
      envelope: { attack: 0.0005, decay: d.decay || 0.05, sustain: 0, release: 0.02 } }).connect(vin()), 1);
    function hit(t, v, mul) { get(t, t + (d.decay || 0.05) + 0.03).triggerAttackRelease(d.f * (mul || 1) / (d.oct || 1.6), d.decay || 0.05, t, clamp(v * (d.level || 0.6), 0, 1)); }
    return { hit };
  }
  // filtered noise bed between t0 and t1 with fades; optional filter sweep or wobble (wind, water, tape hiss, vinyl)
  function bed(bus, d, o, t0, t1) {
    const out = chan(bus, o);
    const g = new T.Gain(0).connect(out);
    const f = new T.Filter({ type: d.ft || 'bandpass', frequency: d.ff || 1500, Q: d.fq || 0.7 }).connect(g);
    const nz = new T.Noise(d.noise || 'pink').connect(f);
    nz.start(t0); nz.stop(t1 + 0.05);
    g.gain.setValueAtTime(0, t0); g.gain.linearRampToValueAtTime(d.level || 0.1, t0 + (d.fadeIn || 0.08));
    g.gain.setValueAtTime(d.level || 0.1, Math.max(t0 + 0.09, t1 - (d.fadeOut || 0.1))); g.gain.linearRampToValueAtTime(0, t1);
    if (d.sweep) { f.frequency.setValueAtTime(d.sweep[0], t0); f.frequency.exponentialRampToValueAtTime(d.sweep[1], t1); }
    if (d.wob) { const l = new T.LFO({ frequency: d.wob[0], min: d.ff * (1 - d.wob[1]), max: d.ff * (1 + d.wob[1]) }).start(t0); l.connect(f.frequency); }
    return { gain: g, filter: f };
  }

  // ------------------------------------------------------------------ idioms: how each family plays the motif
  // notes: [{t, m, d, v}] in seconds / midi (already in the instrument's octave). info: see audio.js cellInfo().
  const cut = (notes, info) => notes.filter(n => n.t < info.end - 0.04).map(n => Object.assign({}, n, { d: Math.min(n.d, info.end - n.t) }));
  function trill(n, up, rate, from, len) {                      // split one note into main + alternation (legato engine)
    const out = [Object.assign({}, n, { d: n.d * from })], step = 1 / rate;
    let t = n.t + n.d * from, k = 0;
    while (t < n.t + n.d * from + len - 1e-6 && t < n.t + n.d - step) { out.push({ t, m: k % 2 ? n.m : up, d: step, v: n.v * 0.9, slide: 0.012 }); t += step; k++; }
    out.push({ t, m: n.m, d: n.t + n.d - t, v: n.v, vib: 1 });
    return out;
  }
  function windIdiom(d, notes, info) {
    const L = notes.length, last = L - 1;
    if (!L) return [];
    let out = notes.map((n, i) => Object.assign({}, n));
    const tie = () => out.forEach((n, i) => { if (i < out.length - 1) n.d = Math.max(n.d, out[i + 1].t - n.t); });
    switch (d.idiom) {
      case 'ancient': out[Math.min(2, last)].scoop = 0.8; out[last].fall = 0.7; break;
      case 'whistle': out.forEach((n, i) => { n.scoop = 1.6; if (i < last) n.d *= 0.7; }); out[last].fall = 2.5; break;
      case 'chinaWind': tie(); out[Math.min(2, last)].grace = info.up(out[Math.min(2, last)].m); out[last].grace = info.up(out[last].m);
        if (d.oct > 0 && out[last].d > 0.8) out = out.slice(0, last).concat(trill(out[last], info.up(out[last].m), 11, 0.55, 0.32)); break;
      case 'suona': tie(); out[0].grace = info.down(out[0].m); out[Math.min(3, last)].grace = info.up(out[Math.min(3, last)].m); out[last].fall = 3; out[last].swell = 1.2; break;
      case 'shaku': out[0].scoop = 1.2; out[Math.min(3, last)].scoop = 1.2; out[last].fall = 1.2; break;
      case 'erhu': tie(); out[0].scoop = 1.5; out[last].slide = 0.18; out[last].swell = 1.15; break;
      case 'baroque': out.forEach((n, i) => { if (i < last) n.d *= 0.85; });
        if (out[last].d > 0.6) out = out.slice(0, last).concat(trill(out[last], info.up(out[last].m), 10, 0.02, 0.45)); break;
      case 'bowed': case 'voice': tie(); out[last].swell = 1.25; break;
      case 'sax': out[0].scoop = 1.5; out[Math.min(3, last)].scoop = 1.2; out[last].fall = 2.5; break;
      case 'brass': out.forEach(n => { n.scoop = 0.5; }); if (d.stacc) out.forEach((n, i) => { if (i < last) n.d *= 0.6; }); break;
      case 'chip': out = out.flatMap(n => n.d < 0.4 ? [n] : (() => { const r = []; const st = 1 / 20; for (let t = n.t, k = 0; t < n.t + n.d - st / 2; t += st, k++) r.push({ t, m: n.m + [0, 7, 12][k % 3], d: st * 0.95, v: n.v }); return r; })()); break;
      case 'chipBass': out = out.flatMap(n => n.d < 0.4 ? [n] : (() => { const r = []; const st = info.B / 2; for (let t = n.t, k = 0; t < n.t + n.d - 0.05; t += st, k++) r.push({ t, m: n.m + (k % 2 ? 12 : 0), d: st * 0.8, v: n.v }); return r; })()); break;
      case 'riff': out = out.flatMap(n => n.d < 0.4 ? [Object.assign(n, { d: n.d * 0.7 })] : [Object.assign({}, n, { d: info.B * 0.4 }), { t: n.t + info.B * 0.75, m: n.m + 12, d: info.B * 0.2, v: n.v * 0.8 }, { t: n.t + info.B * 1.5, m: n.m, d: Math.max(0.1, n.d - info.B * 1.6), v: n.v }]); break;
      default: out.forEach((n, i) => { if (i < out.length - 1 && out[i + 1].t - (n.t + n.d) < 0.06) n.d = out[i + 1].t - n.t; });
    }
    return cut(out, info);
  }
  function pluckIdiom(p, d, notes, info) {
    const L = notes.length, last = L - 1;
    notes.forEach((n, i) => {
      const long = n.d >= 0.45, prev = notes[i - 1];
      const ring = Math.min(n.d + (d.ringExtra == null ? 0.6 : d.ringExtra), info.end + 0.3 - n.t);
      switch (d.idiom) {
        case 'trem':                                             // pipa 轮指: long notes become a tremolo that thins out
          if (!long) { p.strike(n.t, n.m, ring, n.v); break; }
          { const st = 1 / 13; let k = 0; for (let t = n.t; t < n.t + n.d - 0.04; t += st, k++) p.strike(t, n.m, st * 1.6, n.v * (k ? 0.62 - 0.12 * Math.min(1, (t - n.t) / n.d) : 1)); }
          break;
        case 'zheng':                                            // guzheng: 花指 run into long notes, 按滑 from below, 揉弦
          if (long && i === last) { const run = [info.down(info.down(info.down(n.m))), info.down(info.down(n.m)), info.down(n.m)]; run.forEach((m, k) => p.strike(n.t + k * 0.03, m, 0.25, n.v * 0.45)); p.strike(n.t + 0.09, n.m, ring, n.v, { wobble: 16 }); }
          else if (long) p.strike(n.t, n.m, ring, n.v, { from: info.down(n.m), slideT: 0.14, wobble: 12 });
          else p.strike(n.t, n.m, ring, n.v);
          break;
        case 'qin':                                              // guqin: 吟猱 vibrato, 上滑 into note 4, 泛音 on the last note
          if (i === 3 && prev) p.strike(n.t, n.m, ring, n.v, { from: prev.m, slideT: 0.14 });
          else p.strike(n.t, n.m, ring, n.v, long ? { wobble: 24 } : {});
          if (i === last) p.strike(n.t + 0.6, n.m + 12, 1.6, n.v * 0.35);
          break;
        case 'slide':                                            // oud, sanxian, shamisen, zhu: slides from the previous note
          if ((i === 1 || i === 3) && prev) p.strike(n.t, n.m, ring, n.v, { from: prev.m, slideT: 0.07 });
          else p.strike(n.t, n.m, ring, n.v, long ? { wobble: 10 } : {});
          if (long && d.sukui) p.strike(n.t + info.B * 0.5, n.m, 0.3, n.v * 0.4);
          break;
        case 'meend':                                            // veena: glide up to the note and back on long notes
          if (long) p.strike(n.t, n.m, ring, n.v, { from: info.down(n.m), slideT: 0.22, wobble: 18 });
          else p.strike(n.t, n.m, ring, n.v);
          break;
        case 'baroque':                                          // harpsichord: mordent on the stride, trill on the last note
          if (i === 2) { p.strike(n.t, n.m, 0.08, n.v); p.strike(n.t + 0.06, info.up(n.m), 0.08, n.v * 0.8); p.strike(n.t + 0.12, n.m, ring, n.v * 0.9); }
          else if (i === last && long) { for (let k = 0; k < 6; k++) p.strike(n.t + k * 0.075, k % 2 ? n.m : info.up(n.m), 0.1, n.v * 0.85); p.strike(n.t + 0.45, n.m, ring - 0.45, n.v * 0.8); }
          else p.strike(n.t, n.m, ring, n.v);
          break;
        case 'press': case 'bebung': p.strike(n.t, n.m, ring, n.v, long ? { wobble: d.idiom === 'press' ? 16 : 10 } : {}); break;
        case 'twang': p.strike(n.t, n.m, ring, n.v, i === 3 && prev ? { from: n.m - 2, slideT: 0.06 } : {}); break;
        default: p.strike(n.t, n.m, ring, n.v);
          if (i === last && d.roll) stack(info.chordAt(n.t).tones, n.m - 14, 3).forEach((m, k) => p.strike(n.t + 0.03 * (k + 1), m, ring, n.v * 0.4));
      }
    });
  }
  function bellIdiom(b, d, notes, info) {
    notes.forEach((n, i) => {
      if (d.idiom === 'particles' && i === 0) {                  // 81: the motif dissolves into grains, then re-forms on its first note
        const pool = notes.map(x => x.m);
        for (let k = 0; k < 28; k++) { const u = k / 28, off = info.rng() < 1 - u ? 12 * (Math.floor(info.rng() * 4) - 1) : 0;
          b.strike(Math.max(0.01, 0.03 + u * (n.t - 0.1) + info.jit(25)), pool[Math.floor(info.rng() * pool.length)] + off, 0.3, 0.25 + 0.4 * u); }
      }
      if (d.idiom === 'particles') b.strike(n.t + 0.015, n.m + 12, 0.5, n.v * 0.3);
      if (d.idiom === 'roll' && n.d >= 0.45) { let k = 0; for (let t = n.t; t < n.t + n.d - 0.05; t += 1 / 12, k++) b.strike(t, n.m, 0.3, n.v * (k ? 0.5 + 0.1 * (k % 2) : 1)); }
      else b.strike(n.t, n.m, Math.max(0.1, Math.min(n.d + (d.ringExtra == null ? 1 : d.ringExtra), info.end + 0.3 - n.t)), n.v);
      if (d.idiom === 'ui' && i === notes.length - 1) b.strike(n.t + info.B * 0.5, info.up(info.up(n.m)), 0.4, n.v * 0.6);
    });
  }
  function padIdiom(pd, d, notes, info) {                        // organ octave coupler, sheng 5th+8ve (传统和音), glass, ambient
    const iv = d.iv || [0];
    notes.forEach((n, i) => {
      const nx = notes[i + 1], dur = Math.max(0.08, Math.min((nx ? nx.t - n.t : n.d) + (d.overlap || 0.02), info.end - n.t));
      pd.chord(n.t, iv.map(x => n.m + x), dur, n.v);
    });
    if (d.hold) info.chords.forEach(c => pd.chord(c.b0 * info.B, stack(c.tones, d.hold, 3), Math.min(c.b1 * info.B, info.end) - c.b0 * info.B - 0.04, 0.5));
    if (d.pedal) pd.chord(0, [info.bass], info.end, 0.55);
  }

  // ------------------------------------------------------------------ accompaniment patterns (comp role)
  const beatsT = (info, list) => list.filter(b => b * info.B < info.end - 0.05);
  const COMP = {
    arp: (x, d, info, step = 0.5) => info.chords.forEach(c => {
      const tones = stack(c.tones, d.lo, 4), order = [0, 2, 1, 3, 2, 1, 3, 2]; let k = 0;
      for (let b = c.b0; b < c.b1 - 1e-6; b += step, k++) { const t = b * info.B; if (t >= info.end - 0.05) break; x.strike(t + (k ? info.jit(5) : 0), tones[order[k % 8]], step * info.B * 3, (d.cv || 0.5) * (k % 2 ? 0.8 : 1)); }
    }),
    arp16: (x, d, info) => COMP.arp(x, d, info, 0.25),
    strum: (x, d, info) => info.chords.forEach(c => beatsT(info, [c.b0, c.b0 + 3, c.b0 + 4.5].filter(b => b < c.b1)).forEach((b, j) =>
      stack(c.tones, d.lo, 4).forEach((m, k) => x.strike(b * info.B + k * 0.022, m, 1.2, (d.cv || 0.45) * (j ? 0.75 : 1))))),
    pizz: (x, d, info) => info.chords.forEach(c => beatsT(info, [0, 1, 1.5, 2.5, 3, 4].map(b => b + c.b0).filter(b => b < c.b1)).forEach((b, k) =>
      x.strike(b * info.B, stack(c.tones, d.lo, 3)[[0, 2, 1, 0, 2, 1][k % 6]], 0.3, d.cv || 0.5))),
    walk: (x, d, info) => { const c = info.chords[0], r = stack([c.root], d.lo, 1)[0], f = stack([(c.root + 7) % 12], r, 1)[0], th = stack([c.tones[1]], r, 1)[0];
      beatsT(info, [0, 1, 2, 3, 4, 5]).forEach((b, k) => x.strike(b * info.B + (k ? info.jit(8) : 0), [r, th, f, r + 12, f, r - 1][k], info.B * 0.9, k ? 0.7 : 0.9)); },
    bass: (x, d, info) => info.chords.forEach(c => { const r = stack([c.root], d.lo, 1)[0];
      beatsT(info, [0, 1.5, 2.5, 3.5, 4.5].map(b => b + c.b0).filter(b => b < c.b1)).forEach((b, k) => x.strike(b * info.B, k === 2 ? r + 7 : r, info.B * 0.8, k ? 0.7 : 0.95)); }),
    oompah: (x, d, info) => info.chords.forEach(c => { const r = stack([c.root], d.lo - 12, 1)[0];
      beatsT(info, [0, 1, 2, 3, 4, 5].map(b => b + c.b0).filter(b => b < c.b1)).forEach((b, k) => k % 2 ? stack(c.tones, d.lo, 3).forEach(m => x.strike(b * info.B, m, info.B * 0.45, 0.45)) : x.strike(b * info.B, r + (k % 4 ? 7 : 0), info.B * 0.6, 0.7)); }),
    ostinato: (x, d, info) => info.chords.forEach(c => { const tones = stack(c.tones, d.lo, 3);
      let k = 0; for (let b = c.b0; b < c.b1 - 1e-6; b += 0.5, k++) { if (b * info.B >= info.end - 0.05) break; x.strike(b * info.B + (k ? info.jit(4) : 0), tones[[0, 2, 1, 2][k % 4]], 0.25, (d.cv || 0.45) * (k % 2 ? 0.75 : 1)); } }),
    pulse: (x, d, info) => { const c = info.chords[0], tones = stack([c.root, (c.root + 7) % 12], d.lo, 2); let k = 0;
      for (let b = 0; b * info.B < info.end - 0.05; b += 0.25, k++) x.strike(b * info.B, tones[k % 8 < 6 ? 0 : 1], 0.06, (k % 4 ? 0.45 : 0.8) * (d.cv || 0.5)); },
    toll: (x, d, info) => { const r = stack([info.chords[0].root], d.lo, 1)[0]; beatsT(info, [0, 2.5, info.beats > 5 ? 4.5 : 99]).forEach((b, k) => x.strike(b * info.B, [r, r + 7, r + 12][k], 2.5, k ? 0.6 : 0.9)); },
    ting: (x, d, info) => { const tones = stack(info.chords[0].tones, d.lo, 3); beatsT(info, d.at || [1, 2.5, 4]).forEach((b, k) => x.strike(b * info.B, tones[k % 3], 0.8, 0.6)); },
    vibes: (x, d, info) => info.chords.forEach(c => beatsT(info, [c.b0, c.b0 + 2.5].filter(b => b < c.b1)).forEach(b => stack(c.tones, d.lo, 4).forEach(m => x.strike(b * info.B, m, 1.6, 0.4)))),
    sustain: (x, d, info) => info.chords.forEach(c => x.chord(c.b0 * info.B, stack(c.tones, d.lo, d.count || 4), Math.min(c.b1 * info.B, info.end) - c.b0 * info.B - 0.04, d.cv || 0.6)),
    trem: (x, d, info) => COMP.sustain(x, d, info),
    slides: (x, d, info) => { const c = info.chords[0], tones = stack(c.tones, d.lo, 3);
      tones.forEach((m, k) => x.glide(k * 0.08, m - 5 + k, m, info.end - k * 0.08 - 0.05, 0.6, 0.5 + k * 0.2));
      x.glide(info.B * 2.5, tones[2] + 12, tones[0] + 5, info.end - info.B * 2.5 - 0.05, 0.5, info.B * 2); },
    stabs: (x, d, info) => info.chords.forEach(c => beatsT(info, [1.5, 3, 4.5].map(b => b + c.b0).filter(b => b < c.b1)).forEach(b => x.chord(b * info.B, stack(c.tones, d.lo, 3), info.B * 0.35, 0.7))),
    canon: (x, d, info) => x.play(windIdiom(d, info.answer.map(n => Object.assign({}, n, { m: n.m + 12 * (d.canonOct || 0), v: n.v * 0.8 })), info)),
    long: (x, d, info) => x.play(cut(info.held.map(n => Object.assign({}, n, { m: n.m + 12 * (d.longOct || 0) })), info)),
    echo: (x, d, info) => x.play(cut(info.motif.map(n => Object.assign({}, n, { t: n.t + info.B * 0.75, v: n.v * 0.55, m: n.m + 12 * (d.oct || 0) })), info)),
    call: (x, d, info) => x.play([{ t: 0, m: stack([info.chords[0].root], d.lo, 1)[0], d: Math.min(info.B * 2.5, info.end), v: 0.9, scoop: 4, fall: 2 }]),
    drone: (x, d, info) => { const r = stack([info.chords[0].root], d.lo, 1)[0]; if (x.chord) x.chord(0, [r, r + 7], info.end, 0.5);
      else beatsT(info, [0, 1, 2, 3, 4, 5]).forEach(b => x.strike(b * info.B + 0.25 * info.B, r + 12, 0.4, 0.35)); },
  };

  // ------------------------------------------------------------------ recipes
  // eng: legato | pluck | bell | pad | kit | fx. pri: lead priority. oct: lead octave vs the motif (D4..C5).
  // comp: accompaniment pattern when this recipe is the second instrument; lo: lowest comp note (midi).
  // legato: osc, env [a d s r], lp, vib [Hz, cents, delay], breath [level, Q, noise, centre x f0], slide (s), scoop (semitones)
  const S = (type, o) => Object.assign({ type }, o || {});
  const DEF = {
    boneFlute:  { eng: 'legato', pri: 3, oct: 1, osc: P(1, .03, .04, .012), env: [.07, .1, .9, .22], lp: 5200, vib: [5.2, 14, .18], breath: [.07, 1.2, 'pink', 2.2], slide: .04, idiom: 'ancient', level: .7, pan: -.1, send: 1.2, comp: 'long', lo: 62 },
    boneWhistle:{ eng: 'legato', pri: 3, oct: 1, osc: P(1, .01, .02), env: [.03, .05, .85, .12], lp: 7000, vib: [6.5, 22, .1], breath: [.1, 1.5, 'white', 1.5], slide: .025, idiom: 'whistle', level: .55, pan: .1, send: 1.1 },
    xun:        { eng: 'legato', pri: 3, oct: 0, osc: P(1, .04, .14, .02, .03), env: [.09, .1, .9, .3], lp: 1800, vib: [4.4, 16, .25], breath: [.09, 1, 'pink', 1.6], slide: .07, idiom: 'ancient', level: .8, pan: -.1, send: 1.3 },
    dizi:       { eng: 'legato', pri: 3, oct: 1, osc: P(1, .32, .16, .08, .05, .03), env: [.03, .08, .85, .15], lp: 7500, vib: [6, 22, .15], breath: [.06, 2.5, 'white', 3.1], slide: .03, idiom: 'chinaWind', level: .5, pan: -.15, send: 1, comp: 'long', lo: 69, longOct: 1 },
    xiao:       { eng: 'legato', pri: 3, oct: 0, osc: P(1, .1, .05, .02), env: [.08, .1, .9, .3], lp: 3200, vib: [4.8, 12, .3], breath: [.11, 1.2, 'pink', 2], slide: .07, idiom: 'chinaWind', level: .7, pan: .2, send: 1.3, comp: 'long', lo: 57 },
    shakuhachi: { eng: 'legato', pri: 3, oct: 0, osc: P(1, .25, .1, .06, .02), env: [.06, .1, .85, .3], lp: 4200, vib: [3.8, 34, .35], breath: [.16, 1, 'pink', 1.8], slide: .09, idiom: 'shaku', level: .6, pan: -.15, send: 1.3, comp: 'long', lo: 57 },
    flute:      { eng: 'legato', pri: 3, oct: 1, osc: P(1, .18, .07, .03), env: [.05, .1, .9, .2], lp: 7000, vib: [5.4, 16, .2], breath: [.05, 1.5, 'pink', 2.5], slide: .02, idiom: 'west', level: .55, pan: .15, send: 1, comp: 'canon', canonOct: 1 },
    recorder:   { eng: 'legato', pri: 3, oct: 1, osc: P(1, .06, .14, .02, .03), env: [.02, .06, .85, .08], lp: 6000, breath: [.04, 1.5, 'pink', 2.5], idiom: 'baroque', level: .55, pan: .15, send: 1, comp: 'canon', canonOct: 1 },
    oboe:       { eng: 'legato', pri: 3, oct: 0, osc: S('sawtooth'), env: [.04, .1, .85, .15], lp: 4200, formants: [[1150, 2.5, 1], [2800, 3, .5], [600, 2, .4]], vib: [5.6, 16, .2], slide: .03, idiom: 'west', level: .9, pan: -.2, send: .9 },
    clarinet:   { eng: 'legato', pri: 3, oct: 0, osc: S('square'), env: [.04, .1, .85, .15], lp: 2600, vib: [5, 6, .3], slide: .03, idiom: 'west', level: .4, pan: -.15, send: .9 },
    woodwind:   { eng: 'legato', pri: 3, oct: 0, osc: P(1, .2, .5, .1, .25, .05, .1), env: [.05, .1, .85, .15], lp: 3000, vib: [5, 10, .25], breath: [.04, 1.5, 'pink', 2], slide: .03, idiom: 'west', level: .5, pan: -.15, send: 1, comp: 'long', lo: 57 },
    aulos:      { eng: 'legato', pri: 3, oct: 0, osc: P(1, .4, .6, .35, .06, .035, .11, .06), env: [.05, .05, .9, .08], lp: 5000, double: 14, vib: [6, 10, .2], breath: [.03, 1.5, 'pink', 3], slide: .03, idiom: 'west', level: .4, pan: .1, send: 1 },
    bili:       { eng: 'legato', pri: 3, oct: 0, osc: S('sawtooth'), env: [.04, .1, .9, .12], lp: 5000, formants: [[1400, 3, 1], [700, 2, .5], [3000, 3, .35]], vib: [6, 26, .15], slide: .1, scoop: 2, idiom: 'chinaWind', level: .8, pan: -.1, send: 1 },
    suona:      { eng: 'legato', pri: 3, oct: 1, osc: P(1, .85, .75, .6, .5, .42, .36, .3, .25, .2, .16, .12), env: [.02, .06, .9, .08], lp: 7500, formants: [[1800, 1.2, 1], [3400, 2, .45], [900, 1.5, .4]], vib: [6.5, 28, .12], slide: .05, scoop: 2.5, idiom: 'suona', level: .55, pan: -.1, send: .9 },
    conch:      { eng: 'legato', pri: 1, oct: -1, osc: P(1, .5, .3, .15, .08), env: [.15, .2, .8, .4], lp: 1100, vib: [4, 10, .4], breath: [.06, 1, 'pink', 2], idiom: 'call', level: .8, pan: .25, send: 1.5, comp: 'call', lo: 38 },
    hurdy:      { eng: 'legato', pri: 3, oct: 0, osc: P(1, .6, .5, .4, .32, .25, .2, .15, .12, .1), env: [.03, .05, .9, .1], lp: 4000, formants: [[900, 1.5, 1], [2200, 2, .5]], slide: .02, idiom: 'west', level: .45, pan: -.1, send: 1, drone: 'hurdyDrone' },
    erhu:       { eng: 'legato', pri: 3, oct: 0, osc: S('sawtooth'), env: [.08, .1, .9, .15], lp: 3800, formants: [[800, 1.2, 1], [1900, 2, .55], [3200, 3, .25]], vib: [6, 30, .15], slide: .12, scoop: 1.5, idiom: 'erhu', level: .8, pan: -.1, send: 1 },
    banhu:      { eng: 'legato', pri: 3, oct: 1, osc: S('sawtooth'), env: [.04, .08, .9, .1], lp: 6000, formants: [[1700, 2.2, 1], [3300, 3, .5], [900, 2, .3]], vib: [7, 26, .12], slide: .08, scoop: 2, idiom: 'erhu', level: .65, pan: -.1, send: .9 },
    cello:      { eng: 'legato', pri: 3, oct: -1, osc: S('sawtooth'), env: [.1, .1, .9, .2], lp: 2400, formants: [[300, 1, 1], [900, 1.5, .5], [2000, 2, .2]], vib: [5.5, 22, .2], slide: .06, idiom: 'bowed', level: 1, pan: -.15, send: 1 },
    strings:    { eng: 'legato', pri: 3, oct: 0, osc: S('fatsawtooth', { count: 2, spread: 22 }), env: [.12, .1, .9, .3], lp: 3600, double: 1200, vib: [5.5, 12, .2], slide: .05, idiom: 'bowed', level: .45, pan: -.1, send: 1 },
    voice:      { eng: 'legato', pri: 3, oct: 0, osc: S('sawtooth'), env: [.1, .1, .9, .25], lp: 4000, formants: [[730, 6, 1], [1090, 7, .6], [2440, 8, .25]], vib: [5.3, 28, .25], slide: .08, idiom: 'voice', level: 1.6, pan: 0, send: 1.2 },
    altoSax:    { eng: 'legato', pri: 3, oct: 0, osc: P(1, .7, .55, .45, .3, .25, .18, .12, .08), env: [.03, .1, .85, .12], lp: 4500, formants: [[1000, 1.2, 1], [2600, 2, .4]], vib: [5, 22, .3], breath: [.05, 1, 'pink', 3], slide: .04, idiom: 'sax', level: .55, pan: -.12, send: .8 },
    sopranoSax: { eng: 'legato', pri: 3, oct: 1, osc: P(1, .5, .4, .3, .2, .12, .08), env: [.04, .1, .85, .15], lp: 5000, formants: [[1300, 1.4, 1], [3000, 2, .35]], vib: [5.2, 20, .25], breath: [.04, 1, 'pink', 3], slide: .05, idiom: 'sax', level: .5, pan: -.12, send: .9 },
    tenorSax:   { eng: 'legato', pri: 3, oct: -1, osc: P(1, .8, .6, .5, .35, .3, .2, .15, .1, .08), env: [.05, .1, .85, .2], lp: 3200, formants: [[700, 1.2, 1], [1800, 2, .45]], vib: [4.6, 26, .3], breath: [.1, .8, 'pink', 2.5], slide: .06, idiom: 'sax', level: .6, pan: -.12, send: .9 },
    trumpet:    { eng: 'legato', pri: 3, oct: 0, osc: S('sawtooth'), env: [.02, .1, .85, .1], fenv: [.03, .25, .5, 500, 3.2], lp: 8000, vib: [5.5, 12, .3], slide: .03, idiom: 'brass', level: .5, pan: -.1, send: .8 },
    mutedTrumpet:{ eng: 'legato', pri: 3, oct: 0, osc: S('sawtooth'), env: [.01, .08, .8, .06], fenv: [.02, .15, .4, 600, 2.5], formants: [[1500, 3, 1], [3200, 3, .4]], vib: [6, 8, .3], idiom: 'brass', stacc: true, level: 1, pan: -.1, send: .7 },
    trombone:   { eng: 'legato', pri: 3, oct: -1, osc: S('sawtooth'), env: [.04, .1, .85, .12], fenv: [.05, .3, .55, 250, 3], lp: 5000, slide: .09, idiom: 'brass', stacc: true, level: .6, pan: -.1, send: .8 },
    mariachi:   { eng: 'legato', pri: 3, oct: 0, osc: S('sawtooth'), env: [.02, .1, .85, .1], fenv: [.02, .25, .55, 700, 3], lp: 8000, double: 16, vib: [6.5, 26, .1], slide: .03, idiom: 'brass', level: .45, pan: -.1, send: .8 },
    horn:       { eng: 'legato', pri: 3, oct: -1, osc: S('sawtooth'), env: [.08, .1, .9, .2], fenv: [.08, .4, .7, 200, 2.5], lp: 2600, vib: [5, 8, .3], slide: .05, idiom: 'bowed', level: .8, pan: -.1, send: 1 },
    accordion:  { eng: 'legato', pri: 3, oct: 0, osc: P(1, .5, .6, .3, .3, .2, .15), env: [.03, .05, .9, .08], lp: 3500, double: 9, formants: [[1200, 1.2, 1]], idiom: 'west', level: .7, pan: -.1, send: .8 },
    sawLead:    { eng: 'legato', pri: 3, oct: 0, osc: S('fatsawtooth', { count: 2, spread: 14 }), env: [.01, .2, .8, .15], fenv: [.01, .3, .45, 600, 3.5], fq: 4, slide: .06, vib: [5.5, 10, .3], level: .45, pan: -.1, send: .7 },
    sineVib:    { eng: 'legato', pri: 3, oct: 1, osc: P(1, 0, .15), env: [.02, .1, .9, .2], double: 7, vib: [7, 60, .02], level: .7, pan: -.1, send: .8 },
    vhsLead:    { eng: 'legato', pri: 3, oct: 0, osc: S('fatsawtooth', { count: 2, spread: 30 }), env: [.02, .3, .7, .25], fenv: [.02, .4, .5, 700, 2.5], vib: [0.8, 18, 0], slide: .04, level: .45, pan: -.1, send: .7 },
    chipLead:   { eng: 'legato', pri: 3, oct: 1, osc: S('pulse', { width: .25 }), env: [.002, .05, .8, .03], vib: [8, 15, .3], idiom: 'chip', level: .22, pan: -.1, send: .4 },
    chipBass:   { eng: 'legato', pri: 2, oct: -1, osc: S('triangle'), env: [.002, .05, .9, .03], idiom: 'chipBass', level: .9, pan: 0, send: .3 },
    bassSynth:  { eng: 'legato', pri: 2, oct: -2, osc: S('sawtooth'), env: [.005, .2, .7, .1], fenv: [.005, .2, .3, 150, 3], fq: 2, idiom: 'riff', level: .7, pan: 0, send: .2 },
    echoVoice:  { eng: 'legato', pri: 1, oct: 0, osc: P(1, .2, .1), env: [.05, .2, .6, .4], lp: 1800, level: .6, pan: .4, send: 1.4, comp: 'echo' },
    // plucked and struck strings: osc, decay (s), fbase (Hz) / foct: filter envelope, click [level, decay, Hz], body [Hz, Q, dB]
    lyre:       { eng: 'pluck', pri: 2, oct: 0, osc: P(1, .45, .3, .12, .05, .03), decay: 1.4, fbase: 500, foct: 3, idiom: 'ring', level: .7, pan: .2, send: 1.2, comp: 'strum', lo: 50 },
    harp:       { eng: 'pluck', pri: 2, oct: 1, osc: P(1, .3, .07, .12, .015, .015, .02), decay: 1.8, fbase: 700, foct: 3, idiom: 'ring', roll: true, level: .65, pan: .25, send: 1.2, comp: 'arp', lo: 50, voices: 8 },
    konghou:    { eng: 'pluck', pri: 2, oct: 0, osc: P(1, .35, .12, .1, .03), decay: 1.6, fbase: 550, foct: 3, idiom: 'press', roll: true, level: .7, pan: .2, send: 1.2, comp: 'arp', lo: 50 },
    lute:       { eng: 'pluck', pri: 2, oct: 0, osc: P(1, .5, .3, .2, .1, .06), decay: 1.0, fbase: 450, att: .006, idiom: 'ring', level: .7, pan: .25, send: 1, comp: 'arp', lo: 50 },
    oud:        { eng: 'pluck', pri: 3, oct: 0, osc: P(1, .6, .35, .25, .12, .08), decay: .9, fbase: 350, body: [250, 1.2, 4], click: [.2, .01, 2500], idiom: 'slide', level: .75, pan: -.1, send: 1 },
    veena:      { eng: 'pluck', pri: 3, oct: 0, osc: P(1, .8, .6, .5, .4, .3, .25, .2, .15), decay: 1.6, fbase: 600, dist: .3, distWet: .25, body: [2000, 2, 5], idiom: 'meend', level: .55, pan: -.1, send: 1.1, drone: 'veenaDrone' },
    pipa:       { eng: 'pluck', pri: 3, oct: 0, osc: P(1, .7, .5, .35, .25, .2, .12, .08), decay: .55, fbase: 700, foct: 3.5, click: [.25, .008, 4000], idiom: 'trem', level: .7, pan: -.1, send: 1, comp: 'arp', lo: 57, voices: 8 },
    guzheng:    { eng: 'pluck', pri: 3, oct: 0, osc: P(1, .55, .22, .15, .1, .06), decay: 1.6, fbase: 600, idiom: 'zheng', level: .7, pan: -.1, send: 1.1, comp: 'arp', lo: 50, voices: 8 },
    guqin:      { eng: 'pluck', pri: 3, oct: -1, osc: P(1, .4, .18, .08, .04), decay: 2.2, fbase: 300, foct: 2.5, idiom: 'qin', level: .9, pan: -.1, send: 1.3 },
    sanxian:    { eng: 'pluck', pri: 3, oct: 0, osc: P(1, .8, .6, .4, .3, .2), decay: .45, fbase: 800, click: [.4, .01, 2500], body: [600, 1.5, 4], idiom: 'slide', level: .7, pan: -.1, send: .9 },
    shamisen:   { eng: 'pluck', pri: 3, oct: 0, osc: P(1, .9, .7, .6, .45, .35, .25, .2, .15), decay: .7, fbase: 1000, dist: .2, distWet: .2, click: [.6, .006, 5000], body: [1800, 2, 6], idiom: 'slide', sukui: true, level: .55, pan: .15, send: 1, comp: 'drone', lo: 50 },
    zhu:        { eng: 'pluck', pri: 3, oct: 0, osc: P(1, .6, .4, .25, .15), decay: .6, fbase: 600, click: [.7, .015, 1800], idiom: 'slide', level: .7, pan: -.1, send: 1.1 },
    harpsichord:{ eng: 'pluck', pri: 3, oct: 0, osc: P(1, .12, .05, .06, .14, .02, .03, .025, .02, .02, .02, .015), decay: 1.1, fbase: 2500, foct: 2, fsus: .4, click: [.15, .004, 6000], idiom: 'baroque', level: .6, pan: -.1, send: .9, self: 'arp16', lo: 45, cv: .4, voices: 10 },
    clavichord: { eng: 'pluck', pri: 2, oct: 0, osc: P(1, .25, .1, .08, .05), decay: .9, fbase: 1200, idiom: 'bebung', level: .7, pan: .2, send: .9, comp: 'arp', lo: 50 },
    pizz:       { eng: 'pluck', pri: 2, oct: 0, osc: P(1, .9, .6, .22, .35, .14), decay: .35, fbase: 600, ringExtra: .1, idiom: 'ring', level: .8, pan: -.1, send: 1, comp: 'pizz', lo: 45 },
    upright:    { eng: 'pluck', pri: 1, oct: -2, osc: P(1, .5, .2, .1), decay: .8, fbase: 250, foct: 2, click: [.3, .02, 900], idiom: 'ring', level: 1, pan: .1, send: .6, comp: 'walk', lo: 38 },
    guitar:     { eng: 'pluck', pri: 3, oct: 0, osc: S('sawtooth'), decay: 1.2, fbase: 900, foct: 2.5, dist: .5, distWet: .6, idiom: 'twang', level: .45, pan: -.1, send: .8, self: 'strum', lo: 50, cv: .3 },
    synthPluck: { eng: 'pluck', pri: 2, oct: 0, osc: S('fatsawtooth', { count: 2, spread: 18 }), decay: .45, fbase: 500, foct: 4, q: 2, idiom: 'ring', ringExtra: .2, level: .5, pan: -.1, send: .7, comp: 'arp', lo: 57 },
    arpSynth:   { eng: 'pluck', pri: 3, oct: 0, osc: S('pulse', { width: .3 }), decay: .22, fbase: 400, foct: 4, q: 4, ringExtra: .05, idiom: 'ring', level: .5, pan: -.1, send: .6, self: 'arp16', lo: 57, cv: .5 },
    pulseSynth: { eng: 'pluck', pri: 1, oct: 0, osc: S('square'), decay: .08, fbase: 800, foct: 3, level: .4, pan: .3, send: .5, comp: 'pulse', lo: 62 },
    piano:      { eng: 'pluck', pri: 3, oct: 0, osc: P(1, .45, .25, .18, .1, .06, .04, .03), decay: 2.4, fbase: 900, foct: 3, fdec: .6, fsus: .2, att: .002, idiom: 'piano', level: .6, pan: -.05, send: 1, comp: 'arp', lo: 50, voices: 12 },
    // bells and mallets (FM): h harmonicity, mi modulation index, decay, mdec (index decay), second [ratio, level]
    bianzhong:  { eng: 'bell', pri: 3, oct: 0, h: 2.756, mi: 9, decay: 2.8, mdec: .5, msus: .05, second: [1.1892, .45], level: .5, pan: -.1, send: 1.3, idiom: 'ring' },
    churchBell: { eng: 'bell', pri: 1, oct: -1, h: 2.01, mi: 7, decay: 3.5, mdec: .9, msus: .1, second: [2.4, .3], level: .5, pan: .2, send: 1.4, comp: 'toll', lo: 38 },
    pengling:   { eng: 'bell', pri: 0, oct: 2, h: 5.4, mi: 14, decay: 1.2, mdec: .2, level: .3, pan: .3, send: 1.2, comp: 'ting', lo: 86, at: [1, 2.5, 4] },
    porcelain:  { eng: 'bell', pri: 0, oct: 1, h: 3.2, mi: 6, decay: .8, mdec: .15, level: .4, pan: .3, send: 1.2, comp: 'ting', lo: 79, at: [1.5, 3.5, 4.5] },
    xylophone:  { eng: 'bell', pri: 2, oct: 1, h: 3, mi: 2, decay: .35, mdec: .05, ringExtra: 0, idiom: 'roll', level: .6, pan: .2, send: .8, comp: 'ostinato', lo: 69 },
    marimba:    { eng: 'bell', pri: 2, oct: 0, h: 4, mi: 1.5, decay: .9, mdec: .08, ringExtra: .3, idiom: 'roll', level: .7, pan: -.1, send: .9, comp: 'ostinato', lo: 57 },
    vibes:      { eng: 'bell', pri: 2, oct: 0, h: 1, mi: .6, decay: 2.2, mdec: .3, trem: [5.5, .5], level: .45, pan: .25, send: 1, comp: 'vibes', lo: 57, voices: 8 },
    uiChime:    { eng: 'bell', pri: 3, oct: 1, h: 2, mi: 3, decay: .6, mdec: .1, ringExtra: .2, idiom: 'ui', level: .5, pan: -.1, send: .8 },
    vapor:      { eng: 'bell', pri: 3, oct: 0, h: 1, mi: 2.5, decay: 1.6, mdec: .7, msus: .15, ringExtra: .8, idiom: 'ring', delay: [.375, .45, .35], chorus: true, level: .5, pan: -.1, send: .7 },
    // sustained pads: osc, env, lp, iv (parallel intervals when leading), hold (left-hand chord register), trem, vib, formants
    organSoft:  { eng: 'pad', pri: 2, oct: 0, osc: P(1, .5, .12, .3, 0, .1), env: [.05, .02, 1, .2], lp: 4000, trem: [5.5, .12], iv: [0, 12], hold: 50, level: .3, pan: 0, send: 1.4, comp: 'sustain', lo: 50, voices: 12 },
    organFull:  { eng: 'pad', pri: 2, oct: 0, osc: P(1, .6, .35, .5, .2, .25, 0, .15, .1, .08, 0, .06), env: [.035, .02, 1, .15], lp: 6500, iv: [0, 12, 19], hold: 50, pedal: true, level: .25, pan: 0, send: 1.4, comp: 'sustain', lo: 50, voices: 14 },
    waterOrgan: { eng: 'pad', pri: 2, oct: 0, osc: P(1, .1, .25, .05), env: [.06, .05, .95, .2], lp: 4000, trem: [6, .3], iv: [0, 12], hold: 50, level: .4, pan: 0, send: 1.2, voices: 10 },
    sheng:      { eng: 'pad', pri: 3, oct: 0, osc: P(1, .2, .45, .15, .3, .1, .15), env: [.08, .05, .9, .2], lp: 3500, iv: [0, 7, 12], level: .3, pan: -.1, send: 1.1, voices: 12 },
    glass:      { eng: 'pad', pri: 3, oct: 1, osc: P(1, 0, .06), env: [.15, .2, .85, .6], lp: 6000, vib: [3.5, 6], overlap: .25, iv: [0], level: .5, pan: -.1, send: 1.5, voices: 6 },
    stringsPad: { eng: 'pad', pri: 1, oct: 0, osc: S('fatsawtooth', { count: 2, spread: 30 }), env: [.25, .2, .85, .5], lp: 3000, vib: [5.2, 8], level: .3, pan: .15, send: 1.1, comp: 'sustain', lo: 50, voices: 10 },
    tremStrings:{ eng: 'pad', pri: 1, oct: 0, osc: S('fatsawtooth', { count: 2, spread: 26 }), env: [.08, .1, .9, .3], lp: 3600, trem: [13, .75], level: .35, pan: .15, send: 1.1, comp: 'trem', lo: 52, voices: 8 },
    slideStrings:{ eng: 'pad', pri: 1, oct: 0, osc: S('fatsawtooth', { count: 2, spread: 30 }), env: [.2, .2, .85, .4], lp: 2800, vib: [5, 10], level: .35, pan: .2, send: 1.3, comp: 'slides', lo: 55, voices: 6 },
    hornPad:    { eng: 'pad', pri: 1, oct: 0, osc: S('sawtooth'), env: [.12, .2, .8, .3], lp: 1300, level: .35, pan: .2, send: 1.1, comp: 'sustain', lo: 50, count: 2, voices: 6 },
    brassPad:   { eng: 'pad', pri: 1, oct: 0, osc: S('sawtooth'), env: [.015, .15, .6, .12], lp: 2600, level: .3, pan: .2, send: .8, comp: 'stabs', lo: 55, voices: 9 },
    choir:      { eng: 'pad', pri: 3, oct: 0, osc: S('fatsawtooth', { count: 2, spread: 16 }), env: [.35, .3, .85, .9], lp: 3500, formants: [[700, 5, 1], [1150, 6, .55], [2600, 7, .25]], vib: [5, 9], iv: [0], overlap: .1, level: .9, pan: 0, send: 1.4, comp: 'sustain', lo: 50, count: 4, voices: 12 },
    synthPad:   { eng: 'pad', pri: 2, oct: 0, osc: S('fatsawtooth', { count: 2, spread: 35 }), env: [.3, .4, .8, .8], lp: 1800, chorus: [.6, 3.5, .5], iv: [0, 12], overlap: .3, level: .3, pan: 0, send: .9, comp: 'sustain', lo: 50, voices: 10 },
    ambient:    { eng: 'pad', pri: 3, oct: 0, osc: S('fatsawtooth', { count: 2, spread: 40 }), env: [.7, .5, .8, 1.2], lp: 1500, chorus: [.4, 4, .6], iv: [0, 7], overlap: .6, hold: 45, level: .3, pan: 0, send: 1.1, voices: 12 },
    chipArp:    { eng: 'pluck', pri: 1, oct: 0, osc: S('pulse', { width: .125 }), decay: .09, fbase: 5000, foct: 1, ringExtra: 0, level: .3, pan: .3, send: .3, comp: 'arp32', lo: 69 },
    particles:  { eng: 'bell', pri: 4, oct: 1, h: 2.5, mi: 3, decay: .9, mdec: .2, ringExtra: .5, idiom: 'particles', level: .45, pan: 0, send: 1.2, voices: 10 },
  };
  COMP.arp32 = (x, d, info) => COMP.arp(x, d, info, 0.125);

  // ------------------------------------------------------------------ percussion kits (perc role) and textures (fx role)
  const pat = (info, list, push) => list.filter(e => e[0] * info.B < info.end - 0.04 && e[0] < info.beats)
    .map(e => [e[0] * info.B + (e[0] > 0 ? info.jit(5) + (push || 0) : 0), e[1], e[2]]);
  const each = (info, list, push) => pat(info, list, push);
  const sixteenths = (a, b, v, k = 'h') => { const r = []; for (let x = a; x < b - 1e-6; x += 0.25) r.push([x, k, v]); return r; };
  const KIT = {
    frame: (b, o, i) => { const D = membrane(b, { f: 85, oct: 1.6, pd: .03, decay: .35, skin: [.25, .03, 900], level: .9 }, o), K = clicker(b, { f: 1400, q: 1, decay: .04, level: .5, wave: 'sine' }, o);
      each(i, [[1.5, 'T', .6], [2, 'D', .8], [3, 'T', .5], [3.5, 'D', .7], [4.5, 'T', .45], [5.5, 'T', .4]], -0.006).forEach(([t, k, v]) => (k === 'D' ? D : K).hit(t, v)); },
    clay: (b, o, i) => { const D = membrane(b, { f: 70, oct: 1.5, pd: .03, decay: .25, skin: [.15, .02, 500], level: .9 }, o);
      each(i, [[1, .5], [2, .8], [3, .6], [3.5, .5], [4, .7]].map(e => [e[0], 'D', e[1]]), -0.006).forEach(([t, , v]) => D.hit(t, v)); },
    tabla: (b, o, i) => { const lo = membrane(b, { f: 70, oct: 2, pd: .08, decay: .4, level: .8 }, o), hi = membrane(b, { f: 380, oct: 1.15, pd: .01, decay: .25, level: .5 }, o);
      each(i, [[.5, 'na'], [1, 'dha'], [1.5, 'na'], [2, 'na'], [2.5, 'dha'], [3, 'dha'], [3.5, 'na'], [4, 'na'], [4.25, 'na'], [4.5, 'dha']].map(e => [e[0], e[1], .7])).forEach(([t, k, v]) => { hi.hit(t, v); if (k === 'dha') lo.hit(t, v); }); },
    darbuka: (b, o, i) => { const D = membrane(b, { f: 90, oct: 1.8, pd: .02, decay: .3, level: .9 }, o), K = clicker(b, { f: 2200, q: 2, decay: .03, level: .6, wave: 'sine' }, o);
      each(i, [[1, 'T', .7], [1.5, 'T', .5], [2, 'D', .8], [2.5, 'T', .6], [3, 'D', .9], [3.5, 'T', .5], [4, 'T', .4], [4.25, 'T', .4], [4.5, 'T', .7]]).forEach(([t, k, v]) => (k === 'D' ? D : K).hit(t, v)); },
    hand: (b, o, i) => { const D = membrane(b, { f: 140, oct: 1.4, pd: .02, decay: .25, level: .8 }, o), K = clicker(b, { f: 900, q: 1.2, decay: .05, level: .5, wave: 'sine' }, o);
      each(i, [[1, 'T', .6], [1.75, 'T', .5], [2.5, 'D', .8], [3, 'T', .6], [4, 'T', .5], [4.5, 'D', .7]]).forEach(([t, k, v]) => (k === 'D' ? D : K).hit(t, v)); },
    tamb: (b, o, i) => { const J = noiser(b, { ft: 'bandpass', ff: 9000, fq: .7, decay: .1, level: .6 }, o);
      each(i, [[.5, 'j', .6], [1.5, 'j', .5], [2, 'j', .9], [2.5, 'j', .5], [3.5, 'j', .6], [4.5, 'j', .5], [5.5, 'j', .5]]).forEach(([t, , v]) => J.hit(t, v, v > .8 ? .2 : .05)); },
    shell: (b, o, i) => { const C = clicker(b, { f: 1800, q: 2, decay: .03, level: .7 }, o);
      each(i, [[.75, .6], [1.5, .8], [2, .5], [3, .9], [3.75, .5], [4.5, .7]].map(e => [e[0], 'c', e[1]]), -0.006).forEach(([t, , v]) => C.hit(t, v, 0.9 + 0.2 * i.rng())); },
    axe: (b, o, i) => { const M = metal(b, { f: 180, h: 3.1, mi: 18, res: 2500, oct: 1, decay: 1.2, level: .35 }, o);
      each(i, [[2.5, 'x', .8], [4, 'x', .5]]).forEach(([t, , v]) => M.hit(t, v)); M.hit(0.004, 0.9); },
    cymbals: (b, o, i) => { const M = metal(b, { f: 250, decay: 1.6, level: .25 }, o);
      M.hit(0.003, 1, 250, 1.6); each(i, [[1.5, 's', .5], [3, 's', .6], [4, 'l', .8], [5, 's', .5]]).forEach(([t, k, v]) => M.hit(t, v, 300, k === 'l' ? 1 : .25)); },
    warDrum: (b, o, i) => { const D = membrane(b, { f: 55, oct: 3, pd: .04, decay: .55, skin: [.3, .04, 700], level: .9 }, o);
      each(i, [[1, .6], [1.5, .7], [3, .9], [4, .6], [4.5, .5]].map(e => [e[0], 'd', e[1]]), -0.005).forEach(([t, , v]) => D.hit(t, v)); },
    jiegu: (b, o, i) => { const D = membrane(b, { f: 240, oct: 1.5, pd: .015, decay: .12, skin: [.4, .02, 3000], level: .7 }, o);
      each(i, [[.5, 'd', .5], [1, 'd', .7], [1.5, 'd', .5]].concat(sixteenths(2, 3, .4, 'd').map((e, k) => [e[0], 'd', .35 + k * .12]), [[3, 'd', 1], [4, 'd', .7], [4.5, 'd', .6]])).forEach(([t, , v]) => D.hit(t, v)); },
    taiko: (b, o, i) => { const D = membrane(b, { f: 50, oct: 2.5, pd: .05, decay: .8, skin: [.35, .05, 600], level: 1 }, o), R = clicker(b, { f: 2500, q: 3, decay: .02, level: .45 }, o);
      each(i, [[2, 'D', .8], [2.75, 'D', .55], [3, 'D', .9], [4.5, 'D', .7], [1, 'R', .6], [3.5, 'R', .5], [4, 'R', .5]]).forEach(([t, k, v]) => (k === 'D' ? D : R).hit(t, v)); },
    timpani: (b, o, i) => { const D = membrane(b, { f: i.bassHz, oct: 1.25, pd: .04, decay: 1.2, skin: [.08, .03, 400], level: .9, voices: 3 }, o);
      if (i.style === 'romantic') sixteenths(2.5, 4.25, 0, 'r').forEach((e, k) => { if (e[0] * i.B < i.end) D.hit(e[0] * i.B, 0.25 + k * 0.08); });
      each(i, i.style === 'romantic' ? [[4.25, 'x', 1]] : [[2.5, 'x', .7], [3, 'x', .8], [4, 'x', .6]]).forEach(([t, , v], k) => D.hit(t, v, k === 1 ? i.bassHz * 1.5 : i.bassHz)); },
    luogu: (b, o, i) => { const G = membrane(b, { f: 95, oct: 1.15, pd: .3, decay: 1.4, wave: 'sine', level: .7 }, o), C = metal(b, { f: 420, decay: .35, level: .25 }, o), D = membrane(b, { f: 130, oct: 1.6, pd: .02, decay: .18, level: .7 }, o);
      each(i, [[1, 'C', .6], [2, 'K', .9], [2.5, 'C', .5], [3, 'C', .6], [3.5, 'K', .8], [4, 'd', .5], [4.25, 'd', .55], [4.5, 'd', .6], [4.75, 'd', .7]]).forEach(([t, k, v]) => { if (k === 'K') { G.hit(t, v); C.hit(t, v * .8); D.hit(t, v); } else if (k === 'C') C.hit(t, v); else D.hit(t, v); });
      G.hit(0.004, 0.9); C.hit(0.004, 0.7); },
    smallGong: (b, o, i) => { const out = chan(b, o), g = new T.FMSynth({ harmonicity: 1.41, modulationIndex: 5, envelope: { attack: .002, decay: .5, sustain: 0, release: .3 }, modulationEnvelope: { attack: .002, decay: .2, sustain: 0, release: .2 } }).connect(out);
      each(i, [[1, .8], [2, .7], [3, .8], [3.5, .5], [4.5, .8]].map(e => [e[0], 't', e[1]])).forEach(([t, , v]) => { g.triggerAttackRelease(1050, .45, t, v * .5); g.frequency.setValueAtTime(1050, t + .01); g.frequency.exponentialRampToValueAtTime(1180, t + .14); }); },
    bangzi: (b, o, i) => { const C = clicker(b, { f: 2400, q: 5, decay: .04, level: .7, wave: 'sine' }, o);
      each(i, [[1, .7], [2, .8], [2.5, .6], [3, .9], [3.5, .6], [4, .8], [4.25, .6], [4.5, .9], [4.75, .6]].map(e => [e[0], 'c', e[1]])).forEach(([t, , v]) => C.hit(t, v)); },
    snare: (b, o, i) => { const N = noiser(b, { ff: 3500, fq: .6, decay: .12, level: .7 }, o), D = membrane(b, { f: 190, oct: 1.3, pd: .01, decay: .1, level: .4 }, o);
      each(i, [[.75, .5], [1, .8], [1.5, .6], [1.75, .5], [2, .9], [3, 1], [3.25, .4], [3.5, .6], [3.75, .7], [4, .9], [4.5, .6], [4.75, .5]].map(e => [e[0], 's', e[1]])).forEach(([t, , v]) => { N.hit(t, v, .06); D.hit(t, v); }); },
  };
  Object.assign(KIT, {
    jazz: (b, o, i) => { const R = metal(b, { f: 520, h: 5.6, mi: 28, res: 7000, decay: .7, level: .12 }, o), Br = noiser(b, { ff: 2800, fq: .5, att: .02, decay: .18, level: .35 }, o),
      K = membrane(b, { f: 50, oct: 2.5, decay: .3, level: .5 }, o), H = noiser(b, { ft: 'highpass', ff: 8000, decay: .03, level: .35 }, o);
      each(i, [[1, 'r', .6], [1.67, 'r', .45], [2, 'r', .7], [3, 'r', .6], [3.67, 'r', .45], [4, 'r', .7], [5, 'r', .6], [5.67, 'r', .45]]).forEach(([t, , v]) => R.hit(t, v));
      each(i, [[1, 'h', .5], [3, 'h', .5], [5, 'h', .5]]).forEach(([t, , v]) => H.hit(t, v)); each(i, [[1.67, 'b', .4], [3.33, 'b', .5], [4.67, 'b', .35]]).forEach(([t, , v]) => Br.hit(t, v, .08));
      each(i, [[2.5, 'k', .4]]).forEach(([t, , v]) => K.hit(t, v)); R.hit(0.002, 0.8); },
    rock: (b, o, i) => { const K = membrane(b, { f: 50, oct: 4, pd: .04, decay: .3, level: .9 }, o), Sn = noiser(b, { ff: 2500, fq: .5, decay: .14, level: .7 }, o), Sd = membrane(b, { f: 200, oct: 1.4, decay: .08, level: .4 }, o),
      H = noiser(b, { ft: 'highpass', ff: 8000, decay: .03, level: .3 }, o);
      each(i, [[2, 'k', .9], [2.5, 'k', .7], [4.5, 'k', .6]]).forEach(([t, , v]) => K.hit(t, v)); each(i, [[1, 's', .9], [3, 's', .9], [4, 's', .7]]).forEach(([t, , v]) => { Sn.hit(t, v, .08); Sd.hit(t, v); });
      each(i, [0, .5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5].map(x => [x, 'h', x % 1 ? .4 : .6])).forEach(([t, , v]) => H.hit(t, v)); },
    machine: (b, o, i) => { const K = membrane(b, { f: 55, oct: 3, decay: .2, level: .8 }, o), Sn = noiser(b, { ff: 3000, fq: .7, decay: .07, level: .6 }, o), M = metal(b, { f: 900, decay: .05, level: .12 }, o);
      each(i, [1, 2, 3, 4, 5].map(x => [x, 'k', .85])).forEach(([t, , v]) => K.hit(t, v)); each(i, sixteenths(4, 5, .6, 's')).forEach(([t, , v], k) => Sn.hit(t, v * (0.6 + 0.1 * k), .04));
      each(i, sixteenths(0, 4, .5, 'm')).forEach(([t, , v], k) => M.hit(t, k % 4 ? v * .5 : v, 900, .04)); },
    toms: (b, o, i) => { const L = membrane(b, { f: 70, oct: 1.8, decay: .35, level: .9 }, o), Mi = membrane(b, { f: 100, oct: 1.7, decay: .3, level: .8 }, o), Hi = membrane(b, { f: 145, oct: 1.6, decay: .25, level: .7 }, o);
      each(i, [[1.5, 'm', .7], [2, 'l', .8], [3, 'h', .8], [3.5, 'm', .7], [4, 'l', .9], [4.5, 'l', .7], [4.75, 'h', .6]]).forEach(([t, k, v]) => ({ l: L, m: Mi, h: Hi })[k].hit(t, v)); },
    bigKit: (b, o, i) => { const K = membrane(b, { f: 48, oct: 4, decay: .35, level: .9 }, o), Sn = noiser(b, { ff: 2200, fq: .5, decay: .16, level: .8 }, o), C = metal(b, { f: 300, decay: 1.2, level: .22 }, o), Tm = membrane(b, { f: 110, oct: 1.7, decay: .25, level: .8 }, o);
      C.hit(0.003, 1, 300, 1.2); each(i, [[2.5, 'k', .9], [3, 'k', .7]]).forEach(([t, , v]) => K.hit(t, v)); each(i, [[1, 's', 1], [3.5, 's', .9]]).forEach(([t, , v]) => Sn.hit(t, v, .1));
      each(i, [[4, 't', .7], [4.25, 't', .75], [4.5, 't', .8], [4.75, 't', .9]]).forEach(([t, , v], k) => Tm.hit(t, v, 150 - k * 22)); },
    chipDrums: (b, o, i) => { const K = membrane(b, { f: 60, oct: 3, wave: 'triangle', decay: .12, level: .8 }, o), Sn = noiser(b, { ff: 4000, fq: .5, decay: .08, level: .6 }, o), H = noiser(b, { ft: 'highpass', ff: 9000, decay: .02, level: .35 }, o);
      each(i, [[1.5, 'k', .8], [2.5, 'k', .8]]).forEach(([t, , v]) => K.hit(t, v)); each(i, [[1, 's', .8], [3, 's', .8], [4.5, 's', .7]]).forEach(([t, , v]) => Sn.hit(t, v, .05));
      each(i, [.5, 1.5, 2.5, 3.5, 4.5, 5.5].map(x => [x, 'h', .5])).forEach(([t, , v]) => H.hit(t, v)); },
    m808: (b, o, i) => { const K = membrane(b, { f: 45, oct: 5, pd: .06, decay: .55, level: .9 }, o), Cl = noiser(b, { ff: 1500, fq: .8, decay: .1, level: .7 }, o), H = noiser(b, { ft: 'highpass', ff: 9000, decay: .025, level: .35 }, o);
      const hip = i.style === 'stencil';
      each(i, (hip ? [1.75, 2.5, 4.25] : [1, 2, 3, 4, 5]).map(x => [x, 'k', .85])).forEach(([t, , v]) => K.hit(t, v));
      each(i, [[1, 'c', .9], [3, 'c', .9]]).forEach(([t, , v]) => { Cl.hit(t, v * .7, .02); Cl.hit(t + .011, v * .8, .02); Cl.hit(t + .022, v, .08); });
      each(i, (hip ? sixteenths(0, 5, .4) : [.5, 1.5, 2.5, 3.5, 4.5].map(x => [x, 'h', .55]))).forEach(([t, , v], k) => H.hit(t, hip && k % 2 ? v * .6 : v, !hip && k === 4 ? .12 : .02)); },
    edrums: (b, o, i) => { const K = membrane(b, { f: 50, oct: 4, pd: .05, decay: .45, level: .9 }, o), Sn = noiser(b, { ff: 2000, fq: .6, decay: .15, level: .7 }, o), H = noiser(b, { ft: 'highpass', ff: 9000, decay: .02, level: .3 }, o);
      each(i, [[2.25, 'k', .8], [3.5, 'k', .7]]).forEach(([t, , v]) => K.hit(t, v)); each(i, [[1.5, 's', .9], [4, 's', .9]]).forEach(([t, , v]) => Sn.hit(t, v, .08));
      each(i, sixteenths(0, 4, .45).concat([4, 4.125, 4.25, 4.375, 4.5, 4.625].map(x => [x, 'h', .35]))).forEach(([t, , v]) => H.hit(t, v)); },
    ebeat: (b, o, i) => { const K = membrane(b, { f: 55, oct: 2.5, decay: .25, level: .6 }, o), Rm = clicker(b, { f: 1700, q: 3, decay: .025, level: .55 }, o), H = noiser(b, { ft: 'highpass', ff: 10000, decay: .012, level: .25 }, o);
      each(i, [[2.5, 'k', .7]]).forEach(([t, , v]) => K.hit(t, v)); each(i, [[1, 'r', .7], [3.5, 'r', .6]]).forEach(([t, , v]) => Rm.hit(t, v)); each(i, sixteenths(0, 5, .35)).forEach(([t, , v], k) => H.hit(t, k % 4 === 2 ? v : v * .5)); },
    percEns: (b, o, i) => { const W = clicker(b, { f: 1200, q: 2, decay: .05, level: .7 }, o), Tm = membrane(b, { f: 110, oct: 1.6, decay: .25, level: .7 }, o), Sh = noiser(b, { ff: 7000, fq: .6, att: .01, decay: .05, level: .25 }, o), Cb = clicker(b, { f: 800, q: 4, wave: 'square', decay: .09, level: .35 }, o);
      each(i, [.75, 1.5, 2.25, 3, 3.75, 4.5, 5.25].map(x => [x, 'w', .7])).forEach(([t, , v]) => W.hit(t, v)); each(i, [[1, 't', .8], [2.5, 't', .7], [4, 't', .9]]).forEach(([t, , v]) => Tm.hit(t, v));
      each(i, sixteenths(0, 6, .35)).forEach(([t, , v], k) => Sh.hit(t, k % 2 ? v * .6 : v)); each(i, [[2, 'c', .6], [5, 'c', .7]]).forEach(([t, , v]) => Cb.hit(t, v)); },
  });
  const FX = {
    water: (b, o, i) => { bed(b, { ft: 'lowpass', ff: 700, fq: .5, level: .35, wob: [.3, .4], fadeIn: .2, fadeOut: .2 }, o, 0, i.end);
      const out = chan(b, o), s = new T.Synth({ oscillator: { type: 'sine' }, envelope: { attack: .002, decay: .06, sustain: 0, release: .02 } }).connect(out);
      const ts = []; for (let k = 0; k < 9; k++) ts.push([0.15 + i.rng() * (i.end - 0.4), 500 + i.rng() * 900]); ts.sort((a, z) => a[0] - z[0]);
      let last = -1; ts.forEach(([t, f]) => { if (t < last + 0.1) return; last = t; s.triggerAttackRelease(f, .06, t, .25); s.frequency.setValueAtTime(f, t + .002); s.frequency.exponentialRampToValueAtTime(f * 1.8, t + .05); }); },
    vinyl: (b, o, i) => { bed(b, { ft: 'highpass', ff: 5000, fq: .3, noise: 'white', level: .05, fadeIn: .05 }, o, 0, i.end);
      const C = noiser(b, { ft: 'highpass', ff: 2500, decay: .002, level: .5 }, o), ts = [];
      for (let k = 0; k < i.end * 22; k++) ts.push([0.02 + i.rng() * (i.end - 0.05), 0.2 + 0.8 * i.rng() * i.rng()]);
      ts.sort((a, z) => a[0] - z[0]).forEach(([t, v]) => C.hit(t, v, .003)); },
    tape: (b, o, i) => { bed(b, { ft: 'bandpass', ff: 5000, fq: .35, noise: 'white', level: .09, fadeIn: .04 }, o, 0, i.end); bed(b, { ft: 'lowpass', ff: 120, fq: .5, noise: 'brown', level: .12, fadeIn: .04 }, o, 0, i.end); },
    modem: (b, o, i) => { const out = chan(b, o), s = new T.Synth({ oscillator: { type: 'sine' }, envelope: { attack: .005, decay: 0, sustain: 1, release: .02 } }).connect(out);
      const t0 = i.B * 0.5; s.triggerAttackRelease(1200, 0.75, t0, .3); for (let k = 0; k < 22; k++) s.frequency.setValueAtTime(k % 3 ? 1200 : 2200, t0 + k / 30);
      const t1 = i.B * 3; s.triggerAttackRelease(980, 0.5, t1, .25); s.frequency.setValueAtTime(980, t1 + .01); s.frequency.exponentialRampToValueAtTime(2400, t1 + .45);
      bed(b, { ft: 'bandpass', ff: 1800, fq: 1, noise: 'white', level: .12, fadeIn: .02, fadeOut: .05 }, o, i.B * 1.75, i.B * 2.5); },
    typewriter: (b, o, i) => { const C = clicker(b, { f: 2600, q: 2, decay: .02, level: .7 }, o), N = noiser(b, { ff: 4000, fq: .8, decay: .02, level: .35 }, o);
      for (let x = 0.25; x < i.beats - 0.75; x += 0.25) if (i.rng() < 0.6) { const t = x * i.B + i.jit(6); C.hit(t, .5 + .5 * i.rng(), .9 + .2 * i.rng()); N.hit(t, .5); }
      const bl = bells(b, { h: 3.01, mi: 3, decay: 1, mdec: .2, level: .35, voices: 1 }, o); if ((i.beats - 0.5) * i.B < i.end) bl.strike((i.beats - 0.5) * i.B, 98, 0.6, 0.8); },
  };

  // ------------------------------------------------------------------ drones carried by a lead instrument, and the cut accent
  const DRONES = {
    hurdyDrone: (b, o, i) => { const p = pad(b, { osc: P(1, .7, .5, .4, .3, .25, .2, .15), env: [.04, .05, .95, .1], lp: 2200, level: .16, voices: 2 }, o); const r = stack([i.tonicPc], 50, 1)[0]; p.chord(0, [r, r + 7], i.end, 1);
      const tr = noiser(b, { ff: 1200, fq: 1.5, att: .005, decay: .06, level: .25 }, o); [1, 2, 3, 4, 5].filter(x => x < i.beats).forEach(x => tr.hit(x * i.B, .6, .05)); },
    veenaDrone: (b, o, i) => { const p = plucker(b, { osc: P(1, .6, .4, .3, .2), decay: 1.2, fbase: 900, level: .3, voices: 3 }, o); const r = stack([i.tonicPc], 62, 1)[0];
      [0.5, 1.5, 2.5, 3.5, 4.5].filter(x => x < i.beats - .25).forEach((x, k) => p.strike(x * i.B, k % 2 ? r + 12 : r + 7, 0.8, 0.5)); },
  };
  // the "cut": one short low hit exactly on the cell's first sample, voiced per period (BIBLE: 每次换格一记短促的「切」声)
  const ACCENT = [null,
    { f: 44, oct: 2.2, pd: .05, decay: .45, skin: [.6, .014, 1800] },  // P1 frame-drum / earth thump (skin = the audible "cut")
    { f: 46, oct: 1.6, pd: .04, decay: .7, skin: [.55, .014, 2200] },  // P2 timpani-like, tuned to the chord root
    { f: 48, oct: 3, pd: .035, decay: .32, skin: [.6, .01, 3500] },    // P3 kick with beater click
    { f: 44, oct: 4.5, pd: .07, decay: .6, skin: [.55, .008, 5000] },  // P4 808-style boom + click
    { f: 40, oct: 2.5, pd: .06, decay: .9, skin: [.55, .02, 1500] }];  // P5 big taiko
  function accent(bus, Pn, info, v = 1) {
    T = window.Tone;
    const c = Object.assign({ level: 1, voices: 1 }, ACCENT[Pn] || ACCENT[1]);
    if (Pn === 2 && info.bassHz) c.f = info.bassHz;             // timpani lands on the chord root (D2 / C2 / Bb1)
    membrane(bus, c, { pan: 0, send: 0.5 }).hit(0, v);
  }

  // ------------------------------------------------------------------ inst string -> recipes
  // keyword -> {lead, comp} for melodic parts, {kind: 'perc', kit|comp} or {kind: 'fx', fx}; '*' ids resolve per cell style
  const MAP = [
    ['弦乐震音', { lead: 'tremStrings', comp: 'tremStrings' }], ['弦乐滑音', { lead: 'strings', comp: 'slideStrings' }], ['弦乐拨奏', { lead: 'pizz', comp: 'pizz' }], ['弦乐', { lead: 'strings', comp: 'stringsPad' }],
    ['合成器琶音', { lead: 'arpSynth', comp: 'arpSynth' }], ['环境合成器', { lead: 'ambient', comp: 'ambient' }], ['合成器', { lead: 'synth*', comp: 'synthPad' }],
    ['芯片贝斯', { lead: 'chipBass', comp: 'chipBass' }], ['芯片音', { lead: 'chipLead', comp: 'chipArp' }], ['方波', { lead: 'chipLead', comp: 'chipArp' }],
    ['电子脉冲', { lead: 'pulseSynth', comp: 'pulseSynth' }], ['电子节拍', { kind: 'perc', kit: 'ebeat' }], ['电子鼓', { kind: 'perc', kit: 'edrums' }], ['鼓机', { kind: 'perc', kit: 'm808' }],
    ['爵士鼓', { kind: 'perc', kit: 'jazz' }], ['定音鼓', { kind: 'perc', kit: 'timpani' }], ['军鼓', { kind: 'perc', kit: 'snare' }], ['羯鼓', { kind: 'perc', kit: 'jiegu' }], ['陶鼓', { kind: 'perc', kit: 'clay' }],
    ['手鼓', { kind: 'perc', kit: 'hand*' }], ['太鼓', { kind: 'perc', kit: 'taiko' }], ['锣鼓', { kind: 'perc', kit: 'luogu' }], ['小锣', { kind: 'perc', kit: 'smallGong' }], ['铃鼓', { kind: 'perc', kit: 'tamb' }],
    ['打击乐', { kind: 'perc', kit: 'percEns' }], ['龟甲', { kind: 'perc', kit: 'shell' }], ['青铜钺', { kind: 'perc', kit: 'axe' }], ['铙钹', { kind: 'perc', kit: 'cymbals' }], ['梆子', { kind: 'perc', kit: 'bangzi' }],
    ['碰铃', { kind: 'perc', comp: 'pengling' }], ['瓷磬', { kind: 'perc', comp: 'porcelain' }], ['编钟', { lead: 'bianzhong', comp: 'bianzhong' }], ['钟', { kind: 'perc', comp: 'churchBell' }],
    ['调制解调器', { kind: 'fx', fx: 'modem' }], ['磁带噪声', { kind: 'fx', fx: 'tape' }], ['留声机噪声', { kind: 'fx', fx: 'vinyl' }], ['水声', { kind: 'fx', fx: 'water' }], ['打字机', { kind: 'fx', fx: 'typewriter' }],
    ['延迟', { lead: 'echoVoice', comp: 'echoVoice' }], ['颤音', { lead: 'vibes', comp: 'vibes' }], ['提示音', { lead: 'uiChime', comp: 'uiChime' }],
    ['骨笛', { lead: 'boneFlute', comp: 'boneFlute' }], ['骨哨', { lead: 'boneWhistle' }], ['双管笛', { lead: 'aulos', comp: 'aulos' }], ['竖笛', { lead: 'recorder', comp: 'recorder' }], ['长笛', { lead: 'flute', comp: 'flute' }],
    ['笛', { lead: 'dizi', comp: 'dizi' }], ['埙', { lead: 'xun', comp: 'xun' }], ['箫', { lead: 'xiao', comp: 'xiao' }], ['尺八', { lead: 'shakuhachi', comp: 'shakuhachi' }], ['笙', { lead: 'sheng', comp: 'sheng' }],
    ['筚篥', { lead: 'bili' }], ['唢呐', { lead: 'suona' }], ['法螺', { lead: 'conch', comp: 'conch' }], ['双簧管', { lead: 'oboe', comp: 'oboe' }], ['单簧管', { lead: 'clarinet', comp: 'clarinet' }],
    ['木管', { lead: 'woodwind', comp: 'woodwind' }], ['萨克斯', { lead: 'sax*' }], ['小号', { lead: 'trumpet', comp: 'brassPad' }], ['圆号', { lead: 'horn', comp: 'hornPad' }], ['铜管', { lead: 'brass*', comp: 'brassPad' }],
    ['水风琴', { lead: 'waterOrgan', comp: 'waterOrgan' }], ['手摇风琴', { lead: 'hurdy' }], ['手风琴', { lead: 'accordion' }], ['管风琴', { lead: 'organ*', comp: 'organSoft' }],
    ['古钢琴', { lead: 'clavichord', comp: 'clavichord' }], ['羽管键琴', { lead: 'harpsichord', comp: 'harpsichord' }], ['钢琴', { lead: 'piano', comp: 'piano' }],
    ['大提琴', { lead: 'cello', comp: 'cello' }], ['低音提琴', { lead: 'upright', comp: 'upright' }], ['低音', { lead: 'bassSynth', comp: 'bassSynth' }], ['二胡', { lead: 'erhu', comp: 'erhu' }], ['板胡', { lead: 'banhu' }],
    ['人声', { lead: 'voice' }], ['合唱', { lead: 'choir', comp: 'choir' }], ['琵琶', { lead: 'pipa', comp: 'pipa' }], ['古琴', { lead: 'guqin' }], ['筝', { lead: 'guzheng', comp: 'guzheng' }],
    ['三弦', { lead: 'sanxian' }], ['三味线', { lead: 'shamisen', comp: 'shamisen' }], ['筑', { lead: 'zhu' }], ['箜篌', { lead: 'konghou', comp: 'konghou' }], ['竖琴', { lead: 'harp', comp: 'harp' }],
    ['里拉琴', { lead: 'lyre', comp: 'lyre' }], ['鲁特琴', { lead: 'lute', comp: 'lute' }], ['乌德琴', { lead: 'oud' }], ['维纳琴', { lead: 'veena' }], ['电吉他', { lead: 'guitar' }],
    ['玻璃琴', { lead: 'glass', comp: 'glass' }], ['马林巴', { lead: 'marimba', comp: 'marimba' }], ['木琴', { lead: 'xylophone', comp: 'xylophone' }], ['鼓', { kind: 'perc', kit: 'drum*' }],
  ].sort((a, b) => b[0].length - a[0].length);
  const VAR = {
    'synth*': { opart: 'sineVib', cyberpunk: 'sawLead', vhs: 'vhsLead', webtoon: 'synthPluck', vaporwave: 'vapor', isometric: 'synthPad', generative: 'particles', _: 'sawLead' },
    'sax*': { cubism: 'altoSax', artdeco: 'sopranoSax', noir: 'tenorSax', _: 'altoSax' },
    'brass*': { futurism: 'mutedTrumpet', constructivism: 'trombone', muralism: 'mariachi', wpa: 'horn', kirby: 'trumpet', _: 'trumpet' },
    'organ*': { byzantine: 'organSoft', stainedglass: 'organFull', _: 'organFull' },
    'hand*': { cave: 'frame', ajanta: 'tabla', persian: 'darbuka', _: 'hand' },
    'drum*': { hanstone: 'warDrum', futurism: 'machine', muralism: 'toms', pop: 'rock', kirby: 'bigKit', arcade16: 'chipDrums', _: 'warDrum' },
  };
  // hand decisions where the keyword rule would pick the less characteristic lead (documented in qa/audio/ARR-SPEC.yaml)
  const OVERRIDE = { 3: { lead: 'lyre', comp: 'woodwind' }, 39: { lead: 'harp', comp: 'tremStrings' }, 43: { lead: 'harp', comp: 'flute' }, 69: { comp: 'synthPad' }, 81: { lead: 'particles', comp: 'choir' } };
  const FALLBACK = [null, 'xiao', 'strings', 'piano', 'synthPluck', 'piano'];
  const resolve = (id, style) => (id && id.endsWith('*') ? (VAR[id][style] || VAR[id]._) : id);
  // -> { lead, comp, perc: [], fx: [], parts: [...] } for one cell (its inst string, style and number)
  function pick(cell) {
    const parts = String(cell.inst || '').split(/[、,，]/).map(s => s.trim()).filter(Boolean).map(p => {
      const hit = MAP.find(([k]) => p.includes(k));
      return hit ? Object.assign({ word: p, key: hit[0] }, hit[1]) : { word: p, key: null };
    });
    const mel = parts.filter(p => p.lead), perc = parts.filter(p => p.kind === 'perc'), fx = parts.filter(p => p.kind === 'fx');
    const pri = p => (DEF[resolve(p.lead, cell.style)] || { pri: 0 }).pri;
    let lead = null, best = -1;
    mel.forEach(p => { if (pri(p) > best) { best = pri(p); lead = p; } });
    const comps = mel.filter(p => p !== lead);
    const out = {
      lead: lead ? resolve(lead.lead, cell.style) : null,
      comp: comps.length ? resolve(comps[0].comp || comps[0].lead, cell.style) : null,
      perc: perc.map(p => p.kit ? resolve(p.kit, cell.style) : p.comp),
      fx: fx.map(p => p.fx),
      parts: parts.map(p => p.word + '→' + (p.key || '?')),
    };
    const ov = OVERRIDE[cell.n];
    if (ov) Object.assign(out, ov);
    if (!out.lead) out.lead = FALLBACK[cell.period || 1];
    return out;
  }

  // ------------------------------------------------------------------ build one instrument in the current Tone context
  const PIANO = {                                                // piano idiom per picture style
    impressionism: { par: -5, self: 'arp' }, silentfilm: { stacc: true, self: 'oompah' }, fauvism: { block: true }, abstractexp: { block: true, self: 'stabs' },
    ghibli: { dbl: -12, self: 'arp' }, shinkai: { dbl: -12, hi: 12, self: 'arp' },
  };
  function make(id, bus, o = {}) {
    T = window.Tone;
    if (KIT[id]) return { perc: info => KIT[id](bus, o, info) };
    if (FX[id]) return { fx: info => FX[id](bus, o, info) };
    const d = DEF[id];
    if (!d) throw new Error('RSInst: unknown recipe ' + id);
    const oo = Object.assign({ pan: d.pan, send: d.send }, o);
    let eng;
    if (d.eng === 'legato') eng = legato(bus, d, oo);
    else if (d.eng === 'pluck') eng = plucker(bus, d, oo);
    else if (d.eng === 'bell') eng = bells(bus, d, oo);
    else eng = pad(bus, d, oo);
    if (!eng.chord && eng.strike) eng.chord = (t, ms, dur, v) => ms.forEach(m => eng.strike(t, m, dur, v));
    const shift = ns => ns.map(n => Object.assign({}, n, { m: n.m + 12 * (d.oct || 0) }));
    const dflt = { legato: 'long', pluck: 'arp', bell: 'ostinato', pad: 'sustain' }[d.eng];
    return {
      d, eng,
      lead(notes, info) {
        const ns = cut(shift(notes), info);
        if (d.eng === 'legato') eng.play(windIdiom(d, ns, info));
        else if (d.eng === 'pluck' && d.idiom === 'piano') {
          const pv = PIANO[info.style] || {};
          ns.forEach((n, i) => {
            const ring = Math.min(n.d + 0.8, info.end + 0.3 - n.t), dd = pv.stacc && i < ns.length - 1 ? Math.min(ring, info.B * 0.4) : ring;
            eng.strike(n.t, n.m, dd, n.v);
            if (pv.dbl) eng.strike(n.t, n.m + pv.dbl, dd, n.v * 0.5);
            if (pv.hi && n.d > 0.4) eng.strike(n.t, n.m + pv.hi, dd, n.v * 0.3);
            if (pv.par && !info.leadOnly) eng.strike(n.t, n.m + pv.par, dd, n.v * 0.5);
            if (pv.block && !info.leadOnly) stack(info.chordAt(n.t).tones, n.m - 11, 3).forEach(m => eng.strike(n.t, m, dd, n.v * 0.4));
          });
          if (pv.self && !info.leadOnly) COMP[pv.self](eng, Object.assign({}, d, { lo: 45, cv: 0.35 }), info);
        }
        else if (d.eng === 'pluck') pluckIdiom(eng, d, ns, info);
        else if (d.eng === 'bell') bellIdiom(eng, d, ns, info);
        else padIdiom(eng, d, ns, info);
        if (d.self && d.idiom !== 'piano' && !info.leadOnly) COMP[d.self](eng, d, info);     // v10: the soloist is one line, no own accompaniment
        if (d.drone && !info.leadOnly) DRONES[d.drone](bus, Object.assign({}, oo, { gain: 0.6 }), info);
      },
      comp(info) {
        let style = d.comp || dflt;
        if (info.P === 2 && d.eng === 'legato' && style === 'long') style = 'canon';   // P2: imitation a fifth below [mc-development §3.8]
        COMP[style](eng, d, info);
      },
      perc(info) { COMP[d.comp || dflt](eng, d, info); },
    };
  }

  window.RSInst = { make, pick, accent, chan: (bus, o) => { T = window.Tone; return chan(bus, o); }, hz, stack, DEF, KIT, FX, MAP, VAR, OVERRIDE, count: () => Object.keys(DEF).length + Object.keys(KIT).length + Object.keys(FX).length };
})();

// =====================================================================================================================
// RSOrch (v10): the string orchestra and its partners, built from raw Web Audio nodes inside the chunk's context.
// One note = its own small graph (2-3 detuned bowed voices, bow-noise transient, envelope) started and stopped at the
// note's times, so cost follows note-seconds, not chunk length. Determinism: Chrome sums 3+ live inputs of a node in a
// pointer-hash order, so every sum here has at most two live inputs: voices are added pairwise, notes go to "slots"
// that hold one note at a time, and slots / sections are chained (each link = one slot + the previous link).
// =====================================================================================================================
(() => {
  'use strict';
  const hz = m => 440 * Math.pow(2, (m - 69) / 12);
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  // section voicing: k = engine; det = cents per player; vib = depth (cents), vibHz per player; lp = lowpass at
  // dyn 0 / dyn 1; pk = body peaks [Hz, Q, dB]; level = gain at v = 1 (calibrated so a mf chord sits near -20 LUFS)
  const SECT = {
    vn1: { k: 'bow', det: [-7, 1, 8], vibHz: [5.4, 5.9, 6.4], vib: 15, hp: 190, lp: [2100, 7500], pk: [[2900, 1.1, 4], [480, 1.3, 2], [1350, 1.6, -3.5]], pan: -0.45, send: 0.55, level: 0.09, att: 0.14, rel: 0.3, noise: 0.05 },
    vn2: { k: 'bow', det: [-8, 0, 7], vibHz: [5.6, 6.1, 5.2], vib: 14, hp: 170, lp: [1900, 6800], pk: [[2800, 1.1, 3.5], [450, 1.3, 2], [1350, 1.6, -3.5]], pan: -0.2, send: 0.6, level: 0.085, att: 0.15, rel: 0.3, noise: 0.05 },
    vla: { k: 'bow', det: [-6, 2, 7], vibHz: [5.3, 5.8, 6.2], vib: 13, hp: 110, lp: [1500, 5600], pk: [[1700, 1.2, 2.5], [350, 1.2, 3]], pan: 0.2, send: 0.6, level: 0.1, att: 0.16, rel: 0.32, noise: 0.045 },
    vc: { k: 'bow', det: [-6, 1, 6], vibHz: [5.1, 5.6, 6.0], vib: 15, hp: 50, lp: [1150, 4600], pk: [[230, 1, 3], [1250, 1.2, 2]], pan: 0.4, send: 0.55, level: 0.12, att: 0.17, rel: 0.35, noise: 0.04 },
    cb: { k: 'bow', det: [-5, 5], vibHz: [4.8, 5.3], vib: 9, hp: 28, lp: [520, 2000], pk: [[110, 1, 2.5]], pan: 0.5, send: 0.5, level: 0.17, att: 0.2, rel: 0.4, noise: 0.03 },
    svn: { k: 'bow', det: [0], vibHz: [5.7], vib: 26, hp: 200, lp: [2600, 8000], pk: [[2900, 1.1, 4], [480, 1.3, 2], [1350, 1.6, -3]], pan: -0.25, send: 0.42, level: 0.16, att: 0.11, rel: 0.3, noise: 0.07 },
    svc: { k: 'bow', det: [0], vibHz: [5.5], vib: 24, hp: 55, lp: [1500, 5200], pk: [[230, 1, 3], [1250, 1.2, 2.5]], pan: 0.2, send: 0.42, level: 0.2, att: 0.12, rel: 0.32, noise: 0.06 },
    fl: { k: 'bow', wave: [1, 0.11, 0.05, 0.02], det: [0], vibHz: [5.2], vib: 11, hp: 240, lp: [3200, 9000], pk: [[2400, 1, 1.5]], pan: 0.12, send: 0.65, level: 0.14, att: 0.06, rel: 0.2, noise: 0.11, noiseHz: 2.4 },
    ob: { k: 'bow', det: [0], vibHz: [5.6], vib: 13, hp: 260, lp: [2600, 6500], pk: [[1150, 2.2, 7], [2750, 2.5, 5], [700, 2, -4]], pan: 0.05, send: 0.6, level: 0.17, att: 0.05, rel: 0.18, noise: 0.02 },
    cl: { k: 'bow', wave: 'square', det: [0], vibHz: [5.0], vib: 5, hp: 140, lp: [1500, 4200], pk: [[1500, 1, 2]], pan: 0.18, send: 0.6, level: 0.11, att: 0.05, rel: 0.2, noise: 0.03 },
    hn: { k: 'brass', det: [-4, 4], hp: 55, rel: [1.4, 6.0], att: 0.075, scoop: 28, pan: -0.12, send: 0.9, level: 0.11 },
    tbn: { k: 'brass', det: [-3, 3], hp: 40, rel: [1.25, 5.2], att: 0.04, scoop: 18, pan: 0.16, send: 0.75, level: 0.1 },
    tpt: { k: 'brass', det: [-3, 3], hp: 160, rel: [2.0, 8.5], att: 0.03, scoop: 22, pan: -0.05, send: 0.65, level: 0.11 },
    harp: { k: 'pluck', wave: [1, 0.42, 0.18, 0.1, 0.05, 0.03], tau: 1.5, bright: 9, pan: -0.3, send: 0.65, level: 0.2 },
    pzvn: { k: 'pluck', wave: [1, 0.6, 0.3, 0.15, 0.08], tau: 0.28, bright: 5, thump: 0.25, pan: -0.35, send: 0.6, level: 0.32 },
    pzvla: { k: 'pluck', wave: [1, 0.6, 0.3, 0.15, 0.08], tau: 0.4, bright: 4.5, thump: 0.3, pan: 0.2, send: 0.6, level: 0.29 },
    pzvc: { k: 'pluck', wave: [1, 0.55, 0.28, 0.12], tau: 0.6, bright: 4, thump: 0.35, pan: 0.4, send: 0.55, level: 0.3 },
    pzcb: { k: 'pluck', wave: [1, 0.5, 0.2, 0.08], tau: 0.8, bright: 3.5, thump: 0.4, pan: 0.5, send: 0.5, level: 0.3 },
    cel: { k: 'cel', pan: 0.3, send: 0.7, level: 0.12 },
    timp: { k: 'timp', pan: 0.05, send: 0.55, level: 0.3 },
    bd: { k: 'drum', f: [72, 46], tau: 0.9, slap: 0.15, pan: 0, send: 0.6, level: 0.36 },
    taiko: { k: 'drum', f: [96, 62], tau: 0.55, slap: 0.45, pan: -0.08, send: 0.5, level: 0.33 },
    sn: { k: 'snare', pan: 0.08, send: 0.45, level: 0.8 },
    cym: { k: 'cym', pan: 0.12, send: 0.7, level: 0.22 },
    imp: { k: 'impact', pan: 0, send: 0.45, level: 0.35 },
  };

  function create(raw, outs, opt = {}) {
    const rng = opt.rng || Math.random, width = opt.width == null ? 1 : opt.width, SR = raw.sampleRate;
    const noise = raw.createBuffer(1, 2 * SR, SR); { const d = noise.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = rng() * 2 - 1; }
    const G = v => { const g = raw.createGain(); g.gain.value = v == null ? 1 : v; return g; };
    const BQ = (type, f, Q, gain) => { const b = raw.createBiquadFilter(); b.type = type; b.frequency.value = f; b.Q.value = Q || 0.7; if (gain != null) b.gain.value = gain; return b; };
    const add2 = (a, b) => { if (!a) return b; const g = G(); a.connect(g); b.connect(g); return g; };   // pairwise sum
    const secs = {}, lfos = [];
    function section(id) {
      if (secs[id]) return secs[id];
      const c = SECT[id]; if (!c) throw new Error('RSOrch: unknown section ' + id);
      const head = G(c.level), hp = BQ('highpass', c.hp || 30, 0.7);
      let node = hp; head.connect(hp);
      const lp = BQ('lowpass', c.lp ? c.lp[1] : 12000, 0.5); node.connect(lp); node = lp;
      (c.pk || []).forEach(([f, q, g]) => { const b = BQ('peaking', f, q, g); node.connect(b); node = b; });
      const pan = raw.createStereoPanner(); pan.pan.value = clamp((c.pan || 0) * width, -1, 1); node.connect(pan);
      pan.connect(outs.dryIn()); const sg = G(c.send * (opt.send == null ? 1 : opt.send)); pan.connect(sg); sg.connect(outs.sendIn());
      const slots = [], free = [];
      const slot = (t, end) => {                                  // a slot holds one note at a time
        let k = free.findIndex(e => e <= t);
        if (k < 0) { const g = G(); g.connect(slots.length ? slots[slots.length - 1] : head); slots.push(g); free.push(0); k = slots.length - 1; }
        free[k] = end; return slots[k];
      };
      const lfo = (c.vibHz || []).map(f => { const o = raw.createOscillator(); o.frequency.value = f * (0.97 + 0.06 * rng()); o.start(0); lfos.push(o); return o; });
      return (secs[id] = { c, slot, lp, lfo, id });
    }
    const waveCache = {};
    const wave = arr => { const k = arr.join(','); if (!waveCache[k]) { const re = new Float32Array(arr.length + 1), im = new Float32Array(arr.length + 1); arr.forEach((a, i) => { im[i + 1] = a; }); waveCache[k] = raw.createPeriodicWave(re, im); } return waveCache[k]; };
    const osc = (c, f) => { const o = raw.createOscillator(); if (Array.isArray(c.wave)) o.setPeriodicWave(wave(c.wave)); else o.type = c.wave || 'sawtooth'; o.frequency.value = f; return o; };
    // frequency path for slurred notes: [{t, m, slide}] (slide = portamento time into that note, 0 = clean change)
    const path = (p, ev, f0) => { (ev.path || []).forEach(q => { const f = hz(q.m); if (q.slide) { p.setValueAtTime(q.from || f0, q.t - q.slide); p.exponentialRampToValueAtTime(f, q.t); } else p.setValueAtTime(f, q.t); f0 = f; }); };
    // bow-noise source (seeded offset) through a band-pass, returns its gain node
    const bowNoise = (t, stop, fc, q) => { const s = raw.createBufferSource(); s.buffer = noise; s.loop = true; s.start(t, rng() * 1.9); s.stop(stop); const b = BQ('bandpass', fc, q || 0.9), g = G(0); s.connect(b); b.connect(g); return g; };

    // ---- bowed / blown sustained note: ev {t, d, m, v, art: leg|marc|spic|trem|harm, path, cres: [v0, v1], vib}
    function bow(S, ev) {
      const c = S.c, t = ev.t, art = ev.art || 'leg', f0 = hz(ev.m), end = t + ev.d, P = c.det.length;
      const A = art === 'spic' ? 0.005 : art === 'marc' ? 0.022 : art === 'harm' ? 0.3 : art === 'trem' ? 0.04 : (ev.att || c.att);
      const rel = art === 'spic' ? 0.05 : art === 'marc' ? 0.14 : (c.rel || 0.3), stop = end + rel * 5 + 0.02;
      const players = art === 'spic' ? Math.min(P, 2) : P;
      let sum = null;
      for (let p = 0; p < players; p++) {
        const o = osc(art === 'harm' ? { wave: [1, 0.08, 0.03] } : c, f0);
        path(o.frequency, ev, f0);
        // per-player pitch: base detune + a slow seeded drift; vibrato from the section's shared LFO through a per-note depth
        const dur = stop - t, cur = new Float32Array(6);
        for (let k = 0; k < 6; k++) cur[k] = c.det[p] + (k ? (rng() * 2 - 1) * 3.5 : (art === 'marc' || art === 'spic' ? -12 : -4));
        o.detune.setValueCurveAtTime(cur, t, dur);
        if (S.lfo[p] && art !== 'spic') {
          const dg = G(0), depth = (ev.vib == null ? 1 : ev.vib) * c.vib * (0.8 + 0.4 * rng()) * (art === 'harm' ? 0.3 : 1);
          dg.gain.setValueAtTime(0, t); dg.gain.linearRampToValueAtTime(depth * 0.35, t + Math.min(0.25, ev.d * 0.4)); dg.gain.linearRampToValueAtTime(depth, t + Math.min(0.7, ev.d * 0.8));
          S.lfo[p].connect(dg); dg.connect(o.detune);
        }
        o.start(t); o.stop(stop); sum = add2(sum, o);
      }
      const env = G(0), L = (ev.v == null ? 0.7 : ev.v), lv = Math.pow(L, 1.4) * (ev.g || 1), g = env.gain;
      sum.connect(env);
      g.setValueAtTime(0, t);
      if (art === 'spic') { g.linearRampToValueAtTime(lv, t + A); g.setTargetAtTime(lv * 0.18, t + A, 0.04); }
      else if (art === 'marc') { g.linearRampToValueAtTime(lv * 1.15, t + A); g.setTargetAtTime(lv * 0.62, t + A, 0.08); }
      else if (art === 'trem') {
        const n = Math.max(2, Math.ceil((end - t) * 220)), cv = new Float32Array(n), rate = 12.5 + 2 * rng(), ph = rng() * 6.28;
        for (let k = 0; k < n; k++) { const x = k / 220; cv[k] = lv * Math.min(1, x / 0.05) * (0.5 + 0.5 * Math.pow(Math.abs(Math.sin(Math.PI * rate * x + ph + 0.6 * Math.sin(1.7 * x))), 0.6)) * (ev.cres ? (ev.cres[0] + (ev.cres[1] - ev.cres[0]) * k / n) / L : 1);
          if (ev.duck) ev.duck.forEach(h => { const u = (t + x - h) / 0.07; if (u > -2.5 && u < 3) cv[k] *= 1 - 0.75 * Math.exp(-u * u); }); }
        g.setValueCurveAtTime(cv, t, end - t);
      } else {
        g.setTargetAtTime(lv * (ev.cres ? ev.cres[0] / L : 1), t, A / 2.5);
        if (ev.cres) g.setTargetAtTime(lv * ev.cres[1] / L, t + A * 2, Math.max(0.1, (ev.d - A * 2) / 2.5));
        let cur = lv;                                             // path points may re-bow (small dip) and carry a new level (q.v)
        (ev.path || []).forEach(q => { const nv = q.v == null ? cur : Math.pow(q.v, 1.4) * (ev.g || 1);
          if (q.bow) { g.setTargetAtTime(cur * 0.7, q.t - 0.035, 0.012); g.setTargetAtTime(nv, q.t + 0.012, 0.06); }
          else if (q.v != null) g.setTargetAtTime(nv, q.t, 0.25);
          cur = nv; });
      }
      if (art !== 'trem') g.setTargetAtTime(0, end, rel / 3.5); else g.setTargetAtTime(0, end + 0.005, rel / 3.5);
      g.setValueAtTime(0, stop);
      // bow noise: a scratch at the attack and a faint rosin hiss while the bow moves
      const nl = c.noise * lv * (art === 'spic' ? 2.6 : art === 'marc' ? 1.8 : art === 'harm' ? 0.6 : 1);
      const ng = bowNoise(t, stop, clamp(f0 * (c.noiseHz || 3) + 1800, 1500, 9000), 0.8), nG = ng.gain;
      nG.setValueAtTime(0, t); nG.linearRampToValueAtTime(nl, t + 0.004); nG.setTargetAtTime(nl * (art === 'spic' ? 0.05 : 0.22), t + 0.006, art === 'spic' ? 0.012 : 0.03);
      nG.setTargetAtTime(0, end, rel / 3.5); nG.setValueAtTime(0, stop);
      const out = G(); env.connect(out); ng.connect(out);
      out.connect(S.slot(t, stop));
    }

    // ---- brass: two detuned saws, a per-note low-pass that blooms on the attack (brighter when louder), pitch scoop
    function brass(S, ev) {
      const c = S.c, t = ev.t, f0 = hz(ev.m), end = t + ev.d, L = ev.v == null ? 0.7 : ev.v, lv = Math.pow(L, 1.3) * (ev.g || 1);
      const stab = ev.art === 'stab', A = stab ? 0.012 : (ev.att || c.att), rel = stab ? 0.12 : 0.26, stop = end + rel * 5 + 0.02;
      let sum = null;
      c.det.forEach((d, p) => {
        const o = osc({}, f0); o.detune.value = d + (rng() * 2 - 1) * 2;
        o.frequency.setValueAtTime(f0 * Math.pow(2, -c.scoop / 1200), t); o.frequency.exponentialRampToValueAtTime(f0, t + 0.07);
        path(o.frequency, ev, f0); o.start(t); o.stop(stop); sum = add2(sum, o);
      });
      const top = clamp(f0 * (c.rel[0] + (c.rel[1] - c.rel[0]) * L), 300, 11000), lp = BQ('lowpass', f0 * 1.1, 0.9);
      lp.frequency.setValueAtTime(f0 * 1.1, t); lp.frequency.linearRampToValueAtTime(top, t + (stab ? 0.025 : 0.1));
      lp.frequency.setTargetAtTime(clamp(top * (stab ? 0.45 : 0.75), 250, 11000), t + (stab ? 0.03 : 0.14), stab ? 0.08 : 0.3);
      if (ev.cres) lp.frequency.setTargetAtTime(clamp(f0 * (c.rel[0] + (c.rel[1] - c.rel[0]) * ev.cres[1]), 300, 11000), t + 0.3, ev.d / 2.5);
      const env = G(0), g = env.gain; sum.connect(lp); lp.connect(env);
      g.setValueAtTime(0, t); g.linearRampToValueAtTime(lv * (stab ? 1.2 : 1), t + A);
      if (stab) g.setTargetAtTime(lv * 0.3, t + A, 0.07);
      if (ev.cres) g.setTargetAtTime(lv * Math.pow(ev.cres[1] / L, 1.3), t + A + 0.1, ev.d / 2.5);
      g.setTargetAtTime(0, end, rel / 3.5); g.setValueAtTime(0, stop);
      env.connect(S.slot(t, stop));
    }
    // ---- plucked: harp and pizzicato (periodic wave, closing low-pass, pitch-dependent decay, optional finger thump)
    function pluck(S, ev) {
      const c = S.c, t = ev.t, f0 = hz(ev.m), L = ev.v == null ? 0.7 : ev.v, lv = Math.pow(L, 1.2) * (ev.g || 1);
      const tau = clamp(c.tau * Math.pow(220 / f0, 0.35) * (ev.tau || 1), 0.08, 4), stop = t + tau * 6 + 0.05;
      const o = osc(c, f0), lp = BQ('lowpass', f0 * c.bright * (0.6 + 0.6 * L), 0.6);
      lp.frequency.setTargetAtTime(f0 * 1.6, t + 0.004, tau * 0.25);
      const env = G(0), g = env.gain; o.connect(lp); lp.connect(env);
      g.setValueAtTime(0, t); g.linearRampToValueAtTime(lv, t + 0.0025); g.setTargetAtTime(0, t + 0.0025, tau); g.setValueAtTime(0, stop);
      o.start(t); o.stop(stop);
      let out = env;
      if (c.thump) { const ng = bowNoise(t, t + 0.08, 700, 0.6), n = ng.gain; n.setValueAtTime(0, t); n.linearRampToValueAtTime(c.thump * lv, t + 0.002); n.setTargetAtTime(0, t + 0.002, 0.012); out = add2(env, ng); }
      out.connect(S.slot(t, stop));
    }
    // ---- celesta / glockenspiel: fundamental + 4th partial decaying faster
    function cel(S, ev) {
      const t = ev.t, f0 = hz(ev.m), lv = Math.pow(ev.v == null ? 0.6 : ev.v, 1.2) * (ev.g || 1), stop = t + 4;
      let sum = null;
      [[1, 1, 1.3], [4.0, 0.22, 0.25], [2.0, 0.08, 0.6]].forEach(([r, a, tau]) => {
        const o = raw.createOscillator(); o.frequency.value = f0 * r; const e = G(0);
        e.gain.setValueAtTime(0, t); e.gain.linearRampToValueAtTime(lv * a, t + 0.002); e.gain.setTargetAtTime(0, t + 0.002, tau); e.gain.setValueAtTime(0, stop);
        o.connect(e); o.start(t); o.stop(stop); sum = add2(sum, e);
      });
      sum.connect(S.slot(t, stop));
    }
    // ---- timpani: tuned membrane (fundamental with a small pitch drop + two inharmonic modes + stick noise); rolls
    function timp(S, ev) {
      const t = ev.t, f0 = hz(ev.m), L = ev.v == null ? 0.7 : ev.v, lv = Math.pow(L, 1.3), roll = ev.roll, end = roll ? t + ev.d : t;
      const tau = 0.7 + 0.8 * L, stop = end + tau * 5 + 0.05;
      let sum = null;
      [[1, 1, tau], [1.504, 0.38, tau * 0.45], [1.987, 0.18, tau * 0.3]].forEach(([r, a, tk], i) => {
        const o = raw.createOscillator(); o.frequency.setValueAtTime(f0 * r * (i ? 1 : 1.035), t); if (!i) o.frequency.exponentialRampToValueAtTime(f0, t + 0.06);
        const e = G(0); o.connect(e); o.start(t); o.stop(stop);
        if (roll) {                                               // swelling roll: amplitude follows the crescendo with a 6-7 Hz stroke ripple
          const n = Math.max(2, Math.ceil(ev.d * 200)), cv = new Float32Array(n);
          for (let k = 0; k < n; k++) { const x = k / 200, u = k / (n - 1); cv[k] = a * Math.pow(roll[0] + (roll[1] - roll[0]) * u, 1.3) * (0.78 + 0.22 * Math.abs(Math.sin(Math.PI * 6.6 * x))); }
          e.gain.setValueCurveAtTime(cv, t, ev.d); e.gain.setTargetAtTime(0, end, tk * 0.7);
        } else { e.gain.setValueAtTime(0, t); e.gain.linearRampToValueAtTime(lv * a, t + 0.003); e.gain.setTargetAtTime(0, t + 0.003, tk); }
        e.gain.setValueAtTime(0, stop); sum = add2(sum, e);
      });
      const ng = bowNoise(t, end + 0.3, 900, 0.5), n = ng.gain;
      if (roll) { n.setValueAtTime(0.0001, t); n.exponentialRampToValueAtTime(0.06 * Math.pow(roll[1], 1.3), end); n.setTargetAtTime(0, end, 0.04); }
      else { n.setValueAtTime(0, t); n.linearRampToValueAtTime(0.35 * lv, t + 0.002); n.setTargetAtTime(0, t + 0.002, 0.025); }
      add2(sum, ng).connect(S.slot(t, stop));
    }
    // ---- drums: gran cassa / taiko (pitched body + skin slap)
    function drum(S, ev) {
      const c = S.c, t = ev.t, lv = Math.pow(ev.v == null ? 0.7 : ev.v, 1.3), stop = t + c.tau * 6;
      const o = raw.createOscillator(); o.frequency.setValueAtTime(c.f[0], t); o.frequency.exponentialRampToValueAtTime(c.f[1], t + 0.12);
      const e = G(0); o.connect(e); e.gain.setValueAtTime(0, t); e.gain.linearRampToValueAtTime(lv, t + 0.004); e.gain.setTargetAtTime(0, t + 0.004, c.tau); e.gain.setValueAtTime(0, stop);
      o.start(t); o.stop(stop);
      const ng = bowNoise(t, t + 0.3, 1100, 0.6), n = ng.gain; n.setValueAtTime(0, t); n.linearRampToValueAtTime(c.slap * lv, t + 0.002); n.setTargetAtTime(0, t + 0.002, 0.03);
      add2(e, ng).connect(S.slot(t, stop));
    }
    function snare(S, ev) {
      const t = ev.t, lv = Math.pow(ev.v == null ? 0.6 : ev.v, 1.3), stop = t + 0.7;
      const ng = bowNoise(t, stop, 3200, 0.5), n = ng.gain; n.setValueAtTime(0, t); n.linearRampToValueAtTime(lv, t + 0.002); n.setTargetAtTime(0, t + 0.002, 0.07); n.setValueAtTime(0, stop);
      const o = raw.createOscillator(); o.frequency.setValueAtTime(240, t); o.frequency.exponentialRampToValueAtTime(180, t + 0.04);
      const e = G(0); o.connect(e); e.gain.setValueAtTime(0, t); e.gain.linearRampToValueAtTime(lv * 0.5, t + 0.002); e.gain.setTargetAtTime(0, t + 0.002, 0.04); e.gain.setValueAtTime(0, stop);
      o.start(t); o.stop(stop); add2(ng, e).connect(S.slot(t, stop));
    }
    // ---- suspended cymbal: ev.swell = seconds of soft-mallet roll rising into ev.t (+ short ring); ev.crash = struck
    function cym(S, ev) {
      const t = ev.t, lv = Math.pow(ev.v == null ? 0.6 : ev.v, 1.2), sw = ev.swell || 0, t0 = t - sw, ring = ev.crash ? 2.6 : 0.5, stop = t + ring * 4;
      const ng = bowNoise(t0, stop, 6500, 0.35), n = ng.gain, hp = BQ('highpass', 2600, 0.6);
      ng.connect(hp);
      n.setValueAtTime(0.0001, t0);
      if (sw) n.exponentialRampToValueAtTime(lv * (ev.crash ? 0.5 : 0.8), t - 0.005);
      if (ev.crash) { n.setValueAtTime(lv * 1.4, t); n.setTargetAtTime(0, t + 0.01, ring); } else n.setTargetAtTime(0, t, ring * 0.25);
      n.setValueAtTime(0, stop);
      hp.connect(S.slot(t0, stop));
    }
    // ---- sound-design impact: sub drop + low thump + crack, optional whoosh rising into it
    function impact(S, ev) {
      const t = ev.t, lv = Math.pow(ev.v == null ? 0.8 : ev.v, 1.2), pre = ev.pre || 0, stop = t + 4.5;
      const o = raw.createOscillator(); o.frequency.setValueAtTime(64, t); o.frequency.exponentialRampToValueAtTime(29, t + 0.9);
      const e = G(0); o.connect(e); e.gain.setValueAtTime(0, t); e.gain.linearRampToValueAtTime(lv, t + 0.006); e.gain.setTargetAtTime(0, t + 0.006, 0.75); e.gain.setValueAtTime(0, stop); o.start(t); o.stop(stop);
      const a = bowNoise(t, t + 1, 260, 0.5), ag = a.gain; ag.setValueAtTime(0, t); ag.linearRampToValueAtTime(lv * 0.9, t + 0.003); ag.setTargetAtTime(0, t + 0.003, 0.12);
      const b = bowNoise(t, t + 0.5, 1500, 0.8), bg = b.gain; bg.setValueAtTime(0, t); bg.linearRampToValueAtTime(lv * 0.35, t + 0.002); bg.setTargetAtTime(0, t + 0.002, 0.045);
      let sum = add2(add2(e, a), b);
      if (pre) { const w = bowNoise(t - pre, t + 0.05, 2500, 0.4), wg = w.gain; wg.setValueAtTime(0.0001, t - pre); wg.exponentialRampToValueAtTime(lv * 0.25, t - 0.01); wg.linearRampToValueAtTime(0, t + 0.02); sum = add2(sum, w); }
      sum.connect(S.slot(t - pre, stop));
    }
    const ENG = { bow, brass, pluck, cel, timp, drum, snare, cym, impact };
    return {
      play(id, ev) { const S = section(id); ENG[S.c.k](S, ev); },
      // conductor dynamics -> section brightness (0..1) from time t, glide ~0.4 s
      dyn(id, t, d) { const S = section(id); if (S.c.lp) S.lp.frequency.setTargetAtTime(S.c.lp[0] + (S.c.lp[1] - S.c.lp[0]) * Math.pow(clamp(d, 0, 1), 1.2), t, 0.35); },
      finish(t) { lfos.forEach(o => o.stop(t)); },
      sections: () => Object.keys(secs),
    };
  }
  window.RSOrch = { create, SECT, hz };
})();
