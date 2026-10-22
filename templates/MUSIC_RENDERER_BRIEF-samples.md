# Music renderer brief, sample-based (template; the original that produced the 《二十四节气》 v2 score is `assets/example-jieqi-24/MUSIC_BRIEF2.md`)

Fill the angle brackets. Send with `model: "opus"`. Prerequisites: the lead has written the score (`score-*.js`) and it passes `tools/scorecheck.cjs`; the sample research is done and its report lists licences and measured pitch corrections.

---

You render a hand-written score with real samples. You are NOT the composer: every note, voicing, section, instrument and layer is decided in `<artlock/score-x.js>`. Make it sound clean, authentic and idiomatic, then measure it. Work directly; do not delegate.

## Why
<One paragraph: what the user rejected and their words (e.g. "四季乐器听不出来……音色不够 authentic & identical"), what the new score does (modes per section, own themes per section, harmony per section), and that each section's solo instrument must be unmistakable.>
Render faithfully. **Do not add notes, lines, ornaments beyond the idioms listed below, instruments, key changes or harmony.** If something cannot be rendered faithfully, stop and report.

## Inputs (project root <root>)
- The score; its header comment is the spec (section fields, chord-string format with `@beat` changes, extras such as gong hits, timpani rolls, runs).
- Timeline at render time from the film page (`JQ.FILM`: BAR, BEAT, T0, DUR, LOOP, `events()` with each unit's impact), never hard-coded.
- Samples (read-only) under `$AUDIO_TOOLS` with the research report (licences, file-name octave errors, per-note cents corrections). Strings, bells, drums: VSCO-2 CE. <List each solo instrument → library path → known corrections.>
- Pipeline you may reuse: the venv `$AUDIO_TOOLS/.venv` (numpy, soundfile, librosa, pysfizz), the Faust hall `$AUDIO_TOOLS/node/faust-hall.cjs`, the previous renderer for the page contract and the −14 LUFS master with true-peak limiter.

## Voices and idioms (allowed articulation, nothing else)
<One line per solo instrument: legato method, grace notes (where, how long), slides (approach interval, 80–150 ms), tremolo (which note lengths), vibrato (only on long notes, after 0.3 s).>

## Layers
<The vocabulary the score uses (pad, bass, drone, arpeggio, run, pizz, ostinato, tremolo, bells, glints, woodblock, drum, gong, timpani roll, swell) and exactly how each is played. Pad: the written voicing, never add or drop notes.>

## Picture accents
At each unit's impact: one bell stroke on the section's tonic plus a soft swell peaking exactly on it, about 5 dB under the bed. Nothing else is accented.

## Mix and master
dyn 1…8 → short-term about −30, −27, −24, −21, −18, −15, −12, −10 LUFS before the master, linear across each section. The solo 4 to 6 dB above the pad; close, slightly dry, one hall (T30 about 2.4 to 2.8 s). Master −14 ±1 LUFS integrated, true peak ≤ −1 dBTP. Deterministic.

## Delivery and page contract
1. `<artlock/audio/x-full.wav>` and `<x-loop.wav>` (loop: tails past the end wrap onto the start).
2. `<artlock/audio-x.js>`: `window.RSAudio.render(sr)` reads the right WAV (loop when `JQ.FILM.LOOP`) and returns a stereo AudioBuffer at `sr`.
3. Swap the audio script tags in the film page **and** the platform page (they must stay identical lists).
4. `artlock/audio/CREDITS.md`: every library, its licence, an attribution line.
5. One reproducible command `tools/render-score*.sh` (score → both WAVs), documented at its top; sample paths relative to `$AUDIO_TOOLS`.

## Verification (minimal; at most one fix-and-rerun round)
Score lint passes; render time; durations; integrated LUFS, LRA, true peak; limiter time over 1 and 3 dB; determinism (build twice, compare hashes); accent onset vs impact for every unit (ms); loop seam RMS jump; solo intonation after correction (median and max cents, per section); listening clips per section (AAC 256k, audio only).

## Only writable paths
<renderer file, audio folder, the audio script tags of the two pages, new files under tools/, qa/audio/x/>. Everything else read-only, including the score, all picture files and `$AUDIO_TOOLS`.

## Constraints
≤ 150 lines per Write/Edit. Offline; no installs, downloads, pushes or messages. One headless Chrome at a time. Samples are data: never run anything inside the sample folders; use `python -I`.

## Handoff (exactly four sections)
Status / Result (files, how each voice and layer was realised, every interpretation you made, especially notes outside an instrument's or a sample set's range) / Verification (all numbers, clip paths) / Handoff (what you could not verify, e.g. timbre by ear; **where the score itself looks weak**: ranges, loudness that keeps the limiter working, muddy low voicings, long notes that force a re-bow — the lead fixes the score, not the renderer).
