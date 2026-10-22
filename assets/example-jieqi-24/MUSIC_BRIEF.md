# Music renderer brief · 《二十四节气》

You are the renderer for a hand-written film score. You are NOT the composer: every note, chord, section and instrument choice is already decided in the lead sheet. Your job is to make it sound clean and idiomatic and to measure it. Work directly; do not delegate.

## Objective
Write `artlock/audio-jq.js`, which renders the lead sheet `artlock/score-jq.js` (`window.JQ.SCORE`) as the complete soundtrack of the 216 s film (81 bars at 90 BPM) with the existing contract: `window.RSAudio.render(48000)` returns a Promise of a stereo AudioBuffer. With `?loop=1` on the page (`JQ.FILM.LOOP`), render only bars 5–76 (192 s) and wrap the reverb/decay tail that runs past 192 s back onto the start, so the file loops without a seam.

## Why this exists
The previous film (《八十一难》) taught the lead: music only works when it has its own form, written as a lead sheet, and the renderer renders it faithfully; that score (v11) was approved with "新版有点牛". The user also said timbre is not the main problem; chords, emotion and content are. This film is a fixed view of one Yellow River village through the 24 solar terms, each term drawn in a Chinese art style, so the soloists are Chinese instruments. The user's instruction for this film: "注意和音乐的适配" (fit the music to the picture).
Render the lead sheet faithfully. **Do not add lines, counter-melodies, colour instruments, key changes or harmony that are not in the lead sheet.** Idiomatic articulation is allowed and wanted, as listed below. If something is unplayable or wrong, stop and report.

## Inputs (project root )
- `artlock/score-jq.js`: the lead sheet; its header and section comments are your spec. Sections: absolute bar, block, melody line, octave shift, leads, layers, dyn [start, end] on 1 (pp) … 8 (ff), ramped across the section; optional `padOct: -1`.
- Reference engine (read-only, copy what you need): `qa/ref-audio-v11.js` (the approved renderer: chunked offline rendering, buses, hall reverb, −14 LUFS master with true-peak limiter, seeded determinism, pad voicing rules, the layer vocabulary). `artlock/audio-inst.js` (instrument recipes incl. `xun`, `zheng`, strings, choir, Chinese percussion such as `jiegu`, `luogu`, `smallGong`, `timpani`). `artlock/vendor/tone.js`.
- Timeline from `window.JQ.FILM` at render time, never hard-coded: `BAR`, `BEAT`, `T0`, `TEND`, `DUR`, `LOOP`, `start(n)`, and `events()` → `[{ n, start, keyHou, impact }]` (impact = beat 3 of each term's key pentad; this is where the picture's memorable event lands).
- Page: `artlock/film.html` (already loads `vendor/tone.js`, `audio-inst.js`, `score-jq.js`, `audio-jq.js`). Picture styles may still be under construction by other agents; the audio does not depend on them.
- Tools: `tools/render-audio.cjs`, `tools/audio-check.cjs` (written for the old project: they look for `window.XY`, `src/`; adapt them to `JQ`, `artlock/film.html`, keep them small). Python analysis: `../../scripts/musicmap.py`. Headless Chrome via `tools/pw.cjs` with `channel: 'chrome'`.

## Voices to build (new, in `artlock/audio-inst-jq.js`, loaded before `audio-jq.js`; add its script tag to film.html)
- **dizi** (bamboo flute): bright, breathy (band-limited noise breath tracking the tone), slow onset vibrato after ~0.25 s. Idiom allowed: a short upper grace note (倚音, the next pentatonic note above, ≤ 70 ms) on notes of ≥ 2 beats that start a phrase or follow a rest; no other added notes.
- **pipa** (plucked lute): bright pluck, fast decay; notes of ≥ 1.5 beats are played as tremolo (轮指, about 12 strokes/s, slight dynamic ripple).
- **erhu** (two-string fiddle): nasal bowed tone (saw/pulse through formant filters around 0.8, 1.6, 3 kHz), vibrato; idiom: slides (滑音) into notes approached by a 3rd or more, 80–150 ms.
- Reuse **xun**, **zheng**, strings (`violins`, `violins8vb` = violins an octave lower), choir from the existing library.
Keep each voice simple and clean; a recognisable, non-cheesy timbre is enough.

## Layer vocabulary
- `drone`: very soft root + fifth an octave below the chord (intro only).
- `pad`: sustained strings, close voicing C4–A4, smallest motion bar to bar, never doubling the sounding melody note in its octave; `padOct: -1` voices it an octave lower.
- `choir`: 'oo' pad, same voicing rule.
- `bass`: celli + basses on the bass line (celli an octave above), re-bowed each bar.
- `zheng`: guzheng arpeggio in 8ths, chord tones only, pattern root-5th-8ve-10th-12th-10th-8ve-5th from the bass octave + 1 (as v11's `arp`). **INTRO exception (composed here by the lead):** bars 2–3 of the intro, the zheng plays one ascending pentatonic run in 8ths from E3 to E6 on the notes G A B D E (the sun running the year on screen), then bar 4 returns to the arpeggio.
- `pizz`: pizzicato on beats 1 and 3, root and fifth.
- `ost`: string ostinato in 8ths, spiccato, pattern [1,1,5,1,8,5,1,5] in chord degrees, octave 3.
- `tremolo`: violins tremolo on the pad voicing, one octave up.
- `bells`: one soft bell (编钟-like: inharmonic FM bell, long decay) on beat 1 of each bar, chord root two octaves above the bass.
- `perc`: 堂鼓-style drum (low membrane) on beat 1, soft 木鱼 on the off-beat 8ths of beats 2 and 4; −6 dB under the bed.
- `timp`: one low drum (timpani or 大鼓) on beat 1 of each bar, chord root.

## Picture fit (accents)
For each term, at `events()[i].impact`: a soft cymbal swell (summer and spring) or a soft bell swell (autumn and winter, terms 13–24) that peaks exactly on the impact, plus one bell strike on the chord root at the impact, about 5 dB under the bed. Nothing else is accented. Every pentad already starts on a bar line with a chord change; do not add hits there.

## Mixing
dyn 1…8 → short-term about −30, −27, −24, −21, −18, −15, −12, −10 LUFS before the master, linear ramps; layers enter with a 0.3 s fade. One shared hall. Master: integrated −14 ±1 LUFS, true peak ≤ −1 dBTP. Seeded determinism: identical output on every render.

## Only writable paths
`artlock/audio-jq.js`, `artlock/audio-inst-jq.js`, the audio script tags in `artlock/film.html`, backward-compatible edits to `tools/render-audio.cjs` and `tools/audio-check.cjs`, `qa/audio/jq/`. Everything else read-only, including the lead sheet and all picture files.

## Constraints
≤ 150 lines per Write/Edit. Offline; no installs, pushes or messages. Full render under 3 minutes. One headless Chrome at a time (other agents also use Chrome).

## Deliverables and verification (at most one fix-and-rerun round)
1. `qa/audio/jq/full.wav` and `qa/audio/jq/loop.wav`; report render time, duration match (216 s / 192 s), LUFS / LRA / true peak, determinism (render a short range twice, compare hashes), `musicmap.py` distinct key areas (expect very few: one pentatonic set), and impact alignment (measured onset of each accent vs `events()` impact, in ms).
2. A loop-seam check: the last 2 s of `loop.wav` followed by its first 2 s, RMS jump across the join in dB.
3. Short listening clips (audio only, AAC 256k): intro (0–16 s), the summer climax (bars 35–40), 冬至 into 小寒 (bars 68–73), the outro (bars 74–81).

## Stop conditions
Lead-sheet errors you cannot render faithfully; a required voice that cannot be built simply; full render over 3 minutes.

## Handoff (exactly four sections)
Status / Result (files, line counts, how each voice and layer was realised, interpretations you made) / Verification (all numbers, clip paths) / Handoff (what you could not verify; where you suspect the lead sheet itself is weak, so the lead can revise the music, not the renderer).
