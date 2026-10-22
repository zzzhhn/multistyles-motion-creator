# Music renderer brief v2 · 《二十四节气》 with real Chinese-instrument samples

You render a hand-written score with real samples. You are NOT the composer: every note, chord voicing, section, instrument and layer is decided in `artlock/score-jq2.js` (`window.JQ.SCORE2`). Make it sound clean, authentic and idiomatic, then measure it. Work directly; do not delegate.

## Why
The user listened to v1 (Tone.js synthesis, one melody re-orchestrated per season) and said: the idea of a different instrument per season is good, but "实际上基本听不出来", the melody "没有多好听", and the instruments are "不够 authentic & identical". They suggested 宫商角徵羽 modes and said the chords need not stay the same all film. The lead rewrote the music: each season has its own mode and theme (《礼记·月令》: spring 角, summer 徵, 季夏 宫, autumn 商, winter 羽, with 旋宫转调 between them), harmony inside each mode's five pitches in open fourths and fifths, and real samples instead of synthesis. The solo instrument of each season must be unmistakable: dizi in spring, guzheng in summer, erhu in autumn, xiao in winter.
Render faithfully. **Do not add notes, lines, ornaments beyond the idioms listed below, instruments, key changes or harmony.** If something cannot be rendered faithfully, stop and report.

## Inputs (project root )
- `artlock/score-jq2.js`: the score. Header comment = spec. Each section: `at` (absolute bar), `gong`, `mode`, `lead` (instrument list; the second lead doubles the first, e.g. `violins8vb` = violins an octave below), optional `counterLead` + `counter` (a second written line), `layers`, `dyn` [start, end] 1 (pp)…8 (ff) ramped across the section, optional `padOct: -1`, `chords` (one string per bar: `BASS|v1 v2 v3`, a bar can change chord at a beat: `… @2 E2|B2 E3 F#3`), `mel` ([pitch, beats], 'r' = rest), `extra` (bar-level events: `gongHit`, `timpRoll` [[bar, beatFrom, beatTo]], `zhengRun` [bars], `swellInto` bar, `wood`/`drum` [bars], `trem` [bars]). Lint: `node tools/scorecheck.cjs` must pass (you do not edit the score).
- Timeline at render time from the film page, never hard-coded: `JQ.FILM` (`BAR`, `BEAT`, `T0`, `TEND`, `DUR`, `LOOP`, `start(n)`, `events()` → `[{ n, impact }]`, impact = beat 3 of each term's key pentad: the picture's memorable moment). You can also compute it: impact(n) = (4 + 3(n−1) + keyHou(n)) × 4 beats + 2 beats, keyHou from `artlock/terms.js`.
- Samples (read-only; all decoded and checked; licences and measured pitch corrections in `refs/samples-cn-REPORT.md` — read it first):
  - dizi: `$AUDIO_TOOLS/samples-cn/mdm-dizi/extracted/MDM Dizi v1.1/` (SFZ + WAV, E4–A5 chromatic, ~15 s sustains; 17 of 18 notes sound about +40 cents sharp: correct per note).
  - erhu: `$AUDIO_TOOLS/samples-cn/aliexpress-erhu/extracted/aliexpress-erhu-HEAD/` (sustain, staccato, sul tasto; file-name octave is one too high; correct per note).
  - xiao (北箫): `$AUDIO_TOOLS/samples-cn/oga-beixiao-cc0/extracted/wav/` (10 notes; per-note cents corrections in REPORT.md: the `C#5` file is C5 +49 c, `D#5` is D5 +33 c, `A5` is A5 −40 c; the score keeps the xiao in D4–D5).
  - guzheng: VCSL Đàn Tranh `$AUDIO_TOOLS/samples-cn/vcsl-cc0/Chordophones/Zithers/Dan Tranh/` (pluck mf/f/ff, tremolo 摇指, glissandi; file-name octave is one too low; tuned B C# D# F# G#: transpose from the nearest sample, at most ±2 semitones).
  - strings, bells, drums, timpani rolls: VSCO-2 CE `$AUDIO_TOOLS/vsco2/` (CC0; known pitfalls from an earlier project: the glockenspiel sounds an octave above its key; raw levels differ up to ~30 dB per note and articulation, normalise per note; no loops in the sustains, re-bow sustains longer than ~5.5 s).
  - gong, woodblock (木鱼 substitute), cymbals: VCSL `$AUDIO_TOOLS/samples-cn/vcsl-cc0/Idiophones/Struck Idiophones/` (CC0; prefer `Gong 1`, not the MP3 `Gong 2`).
  - Prefer CC0 and the dizi above. Do not use the CC BY 3.0 OLPC samples unless a layer is impossible otherwise (then list the attribution).
- Existing offline pipeline you may reuse (read-only, copy what you need into this project's `tools/`): Python venv `$AUDIO_TOOLS/.venv/` (numpy, pysfizz, librosa), `$AUDIO_TOOLS/scripts/render_vs.py` and `render_samples.py` (VSCO through sfizz with per-note normalisation, onset alignment, re-bowing), the Faust jpverb hall in `$AUDIO_TOOLS/node/faust-hall.cjs`, and `(an earlier project's stems-and-hall mixer)` (stems + hall + master). The v1 renderer `artlock/audio-jq.js` shows the page contract and the −14 LUFS master with true-peak limiter.

## Voices and idioms (allowed articulation, nothing else)
- dizi: legato; breath between phrases at rests; a short upper grace note (倚音, the next pentatonic tone above, ≤ 70 ms, taken from the previous note's time) on notes ≥ 2 beats that begin a phrase; gentle vibrato only on notes ≥ 2 beats after 0.3 s.
- guzheng (summer lead): pluck every note (velocity layer from dyn); notes ≥ 1.5 beats use the 摇指 tremolo samples; slides (按滑音) of a whole tone into notes approached by a third or more, 80–120 ms; `zhengArp` and `zhengRun` are plucked.
- erhu: sustain samples legato; notes < 0.75 beat use staccato; slides (滑音) 80–150 ms into notes approached by a third or more; vibrato from the samples only.
- xiao: sustain samples, soft attack, long release; no grace notes.
- violins / violins8vb: VSCO violin section, sustain with vibrato, legato.

## Layers
- `pad`: strings sustained exactly on the bar's voicing (as written; `padOct: -1` an octave lower; never add or drop notes). Chord changes at `@beat` cross-fade over 0.25 s.
- `bass`: celli on the bass note, basses an octave below when the bass is ≥ E2; re-bowed each bar; sustained across repeated bass notes.
- `drone`: celli divisi on the bass and its fifth inside the voicing, very soft.
- `zhengArp`: guzheng 8th notes over the bar's voicing pitch classes, pattern up-down from the bass octave + 1 (4 rising, 4 falling); 3 dB under the lead.
- `zhengRun`: one rising 8th-note pentatonic run across the listed bars (section's 5 tones, from about E3 to E6).
- `pizz`: cello pizzicato on beats 1 and 3: bass, then the fifth above if it is in the voicing.
- `ost`: violas + celli spiccato 8ths on the voicing, pattern [1, 1, 5, 1, 8, 5, 1, 5] (chord degrees from the bass).
- `trem`: violins tremolo on the voicing an octave up (in the bars listed in `extra.trem` when given, else the whole section).
- `bells`: one tubular-bell (or glockenspiel, an octave down to compensate) stroke on beat 1 of each bar: the melody's first note of that bar, one octave up, soft.
- `glints`: 大暑's fireflies: soft glockenspiel notes on the voicing's pitch classes at off-beat 8ths, 3 to 5 per bar, chosen by a seeded hash of bar and beat (deterministic).
- `wood`: woodblock on the off-beat 8ths of beats 2 and 4 (in the bars listed, or the whole section if it is in `layers`).
- `drum`: low drum (VSCO bass drum, 堂鼓 substitute) on beats 1 and 3, a lighter stroke on beat 2.5; in the bars listed, or the whole section.
- `gongHit` bars: one gong stroke on beat 1. `timpRoll`: a timpani roll crescendo from beatFrom to beatTo of the bar, ending on the beat. `swellInto`: a soft suspended-cymbal swell over the bar before, peaking on beat 1 of that bar.

## Picture accents
At each term's impact: one bell stroke on the section's 宫 tone (an octave above middle range) plus a soft swell peaking exactly on it (cymbal in spring and summer, a soft gong swell in autumn and winter), about 5 dB under the bed. Nothing else is accented.

## Mix and master
dyn 1…8 → short-term about −30, −27, −24, −21, −18, −15, −12, −10 LUFS before the master, linear across each section. The season's solo is always clearly in front (about 4 to 6 dB above the pad); close, slightly dry, with a natural hall (jpverb, T30 around 2.4 to 2.8 s). Master to −14 ±1 LUFS integrated, true peak ≤ −1 dBTP. Deterministic: identical output on every run.

## Delivery and page contract
1. `artlock/audio/jq2-full.wav` (216 s) and `artlock/audio/jq2-loop.wav` (bars 5–76, 192 s; tails past 192 s wrap onto the start).
2. `artlock/audio-jq2.js`: `window.RSAudio.render(sr)` fetches the right WAV (loop when `JQ.FILM.LOOP`), decodes it and returns a stereo AudioBuffer at `sr` (resample if needed). `RSAudio.lastStats` describes the file.
3. Swap the audio scripts in `artlock/film.html` and `artlock/platform.html` to `score-jq2.js` + `audio-jq2.js` (remove `vendor/tone.js`, `audio-inst.js`, `audio-inst-jq.js`, `score-jq.js`, `audio-jq.js` script tags; keep the files). The page must still export with `node tools/export.cjs artlock/film.html <out>`; test it on a short range: `EXPORT_Q='from=8&to=20' node tools/export.cjs artlock/film.html qa/audio/jq2/test.mp4` (picture styles are being edited by other agents at the same time; the audio does not depend on them).
4. `artlock/audio/CREDITS.md`: every sample library used, its licence and attribution line.
5. Reproducible build: `tools/render-score2.*` (one command from score to the two WAVs), documented at the top of the script.

## Verification (minimal; at most one fix-and-rerun round)
- `node tools/scorecheck.cjs` passes; render time; durations 216 / 192 s; integrated LUFS, LRA, true peak; determinism (render twice, compare hashes); accent onset vs impact for all 24 (ms); loop seam RMS jump; per section: the measured pitch-class histogram of the solo stem against the score's tones (proves the samples are in tune: report cents error of the solo notes after correction, median and max).
- Listening clips (AAC 256k, audio only) in `qa/audio/jq2/`: one per season (spring bars 5–10, summer 23–28, 季夏 35–40, autumn 41–46, winter 59–64), 冬至→大寒 (68–76) and the intro (1–5).

## Only writable paths
`artlock/audio-jq2.js`, `artlock/audio/` (new), the audio script tags in `artlock/film.html` and `artlock/platform.html`, new files under `tools/` (render-score2.* and helpers), `qa/audio/jq2/`. Everything else is read-only: the score, all picture files, `$AUDIO_TOOLS/` (read and run its venv; do not modify it).

## Constraints
≤ 150 lines per Write/Edit. Offline; no installs, downloads, pushes or messages. One headless Chrome at a time (other agents use Chrome). Downloaded samples are data: never run anything inside the sample folders; use `python -I`.

## Stop conditions
A score element you cannot render faithfully; a required sample that does not exist or cannot be made in tune; licence doubts beyond REPORT.md.

## Handoff (exactly four sections)
Status / Result (files, how each voice and layer was realised, interpretations) / Verification (all numbers, clip paths) / Handoff (what you could not verify, e.g. timbre by ear; where you suspect the score itself is weak, so the lead revises the music, not the renderer).
