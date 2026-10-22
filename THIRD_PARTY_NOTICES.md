# Third-party notices

## Tone.js (bundled)

`assets/example-xiyou-81nan/src/vendor/tone.js` is Tone.js 15.1.22 (https://github.com/Tonejs/Tone.js), bundled unmodified.

    MIT License
    Copyright (c) 2014-2024 Yotam Mann

    Permission is hereby granted, free of charge, to any person obtaining a copy of this software and
    associated documentation files (the "Software"), to deal in the Software without restriction,
    including without limitation the rights to use, copy, modify, merge, publish, distribute,
    sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all copies or
    substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT
    NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
    NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES
    OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
    CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

## Projects consulted (not bundled)

- huashu-art-motion, https://github.com/alchaincyf/huashu-art-motion, MIT License, Copyright (c) 2026 alchaincyf (花叔 · 花生).
  Its style recipe cards and scene code were read as a reference by the agents that wrote the example styles; some techniques in
  `assets/example-xiyou-81nan/src/styles/` may be adapted from it. Its scripts were not installed or run.
- music-composition-skills, https://github.com/jtydhr88/music-composition-skills, MIT License, Copyright (c) 2026 Terry Jia.
  Consulted for harmony, orchestration and form while writing the lead sheet. Nothing from it is bundled here.

## Source text

《西游记》 (Journey to the West) is in the public domain. The list of the 81 tribulations follows chapter 99 on Chinese Wikisource.

## Build-time dependencies of the 《二十四节气》 example (not bundled)

- `scripts/audio-tools/node/faust-hall.cjs` (MIT, this repository) compiles the `re.jpverb` reverb from the Faust libraries at
  run time through `@grame/faustwasm` 0.19.0, which `npm install` fetches into the user's own `$AUDIO_TOOLS/node/`.
  faustwasm is licensed LGPL-3.0; it is not included in this repository. The Faust libraries (faustlibraries) are MIT.
- The sampled score of `assets/example-jieqi-24/` is rendered from sample libraries the user downloads separately. No sample and no
  rendered audio is included in this repository. Libraries, licences and attribution lines are listed in
  `assets/example-jieqi-24/artlock/audio/CREDITS.md` and `assets/example-jieqi-24/refs/samples-cn-REPORT.md`:
  VSCO-2 Community Edition (Versilian Studios, CC0), Versilian Community Sample Library (CC0), sfzinstruments/aliexpress-erhu (CC0),
  Raw Běixiāo Audio by pattingthestar on OpenGameArt (CC0), MDM Dizi v1.1 by Mića de Mijatović y Senić (Pianobook terms: free use in
  compositions; the samples themselves may not be redistributed).
- Python packages used by the build (numpy, soundfile, librosa, pysfizz, scipy) are installed by the user into `$AUDIO_TOOLS/.venv`.

## Source text of the second example

The 72 pentads (七十二候) follow 吴澄《月令七十二候集解》 (Yuan dynasty), public domain; the wording was checked against the
「七十二候」 article on Chinese Wikipedia. The assignment of the five tones to the seasons follows 《礼记·月令》, public domain.
