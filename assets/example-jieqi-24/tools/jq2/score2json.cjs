// score2json.cjs: dump the v2 score (artlock/score-jq2.js, window.JQ.SCORE2) and the terms' key pentads (artlock/terms.js)
// as JSON for the offline renderer. Usage: node tools/jq2/score2json.cjs <out.json>
// The timeline is derived from the score grid and terms.js the same way JQ.FILM does it (film.js: impact = start(n) +
// keyHou x BAR + 2 x BEAT); audio-jq2.js re-checks the rendered accents against JQ.FILM.events() in the page.
'use strict';
const fs = require('fs'), path = require('path');
global.window = global;
const A = path.resolve(__dirname, '../../artlock');
require(path.join(A, 'core.js')); require(path.join(A, 'terms.js')); require(path.join(A, 'score-jq2.js'));
const JQ = global.JQ, S = JQ.SCORE2, BEAT = 60 / S.bpm, BAR = 4 * BEAT;
const out = {
  bpm: S.bpm, beat: BEAT, bar: BAR, bars: S.bars, loopBars: S.loopBars, gong: S.gong, ranges: S.ranges,
  sections: S.sections.map(s => Object.assign({}, s, { nb: s.chords.length })),
  terms: JQ.TERMS.map((t, i) => ({ n: i + 1, name: t.name, season: t.season, keyHou: t.keyHou,
    bar: S.loopBars[0] + 3 * i + t.keyHou,                                   // the key pentad's bar (absolute)
    impact: (S.loopBars[0] - 1 + 3 * i + t.keyHou) * BAR + 2 * BEAT })),      // score seconds (bar 1 at 0 s)
};
const file = process.argv[2]; if (!file) { console.error('usage: node tools/jq2/score2json.cjs <out.json>'); process.exit(2); }
fs.mkdirSync(path.dirname(path.resolve(file)), { recursive: true });
fs.writeFileSync(file, JSON.stringify(out, null, 1));
console.log('score2json:', out.sections.length, 'sections,', out.bars, 'bars, 24 impacts ->', file);
