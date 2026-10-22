// Lint the v2 score: node tools/scorecheck.cjs
// Checks: sections contiguous and cover 81 bars; one chord string per bar; melody/counter beats = bars × 4; every melody,
// counter, bass and voicing pitch inside the section's 宫 set (5 tones); lead and counter inside instrument ranges; at every
// term's impact (beat 3 of its key pentad) the lead has an onset or a note already sounding from beat 1 of that bar; the
// shared motif 徵-羽-宫 appears in each season's key. Prints a per-season summary (final, top note, tone histogram).
const path = require('path');
global.window = global;
require(path.resolve(__dirname, '../artlock/core.js')); require(path.resolve(__dirname, '../artlock/terms.js')); require(path.resolve(__dirname, '../artlock/score-jq2.js'));
const JQ = global.JQ, SC = JQ.SCORE2, bad = [], info = [];
const PC = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
const pc = s => { const m = /^([A-G])(#|b)?/.exec(s); return (PC[m[1]] + (m[2] === '#' ? 1 : m[2] === 'b' ? -1 : 0) + 12) % 12; };
const midi = s => { const m = /^([A-G](?:#|b)?)(-?\d)$/.exec(s); if (!m) throw new Error('bad pitch ' + s); return 12 * (+m[2] + 1) + pc(m[1]); };
const NAMES = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];
let at = 1;
const impacts = Array.from({ length: 24 }, (_, i) => { const kh = JQ.TERMS[i].keyHou; return { n: i + 1, bar: 5 + 3 * i + kh, beat: 2 }; });
for (const s of SC.sections) {
  const set = SC.gong[s.gong].map(pc), nb = s.chords.length;
  if (s.at !== at) bad.push(`${s.name}: starts at bar ${s.at}, expected ${at}`);
  at = s.at + nb;
  const chk = (lst, what, rng) => {
    const tot = lst.reduce((a, n) => a + n[1], 0); if (Math.abs(tot - nb * 4) > 1e-6) bad.push(`${s.name}: ${what} has ${tot} beats, expected ${nb * 4}`);
    lst.forEach(([p]) => { if (p === 'r') return; if (!set.includes(pc(p))) bad.push(`${s.name}: ${what} ${p} not in 宫 ${s.gong}`);
      if (rng && (midi(p) < midi(rng[0]) || midi(p) > midi(rng[1]))) bad.push(`${s.name}: ${what} ${p} outside ${rng.join('–')}`); });
  };
  chk(s.mel, 'melody', SC.ranges[s.lead[0]]);
  if (s.counter) chk(s.counter, 'counter', SC.ranges[s.counterLead]);
  s.chords.forEach((c, i) => c.split('@').forEach(half => { const [b, v] = half.replace(/^\s*\d+(\.\d+)?\s+/, '').split('|'); [b, ...v.trim().split(/\s+/)].forEach(p => {
    if (!set.includes(pc(p.trim())) && !(s.name === 'OUTRO' && p.trim() === 'B2')) bad.push(`${s.name}: chord bar ${s.at + i} pitch ${p} not in 宫 ${s.gong}`); }); }));
  // melody onsets by absolute beat
  const on = []; let t = 0; for (const [p, d] of s.mel) { if (p !== 'r') on.push([t, t + d]); t += d; }
  for (const im of impacts) { if (im.bar < s.at || im.bar >= s.at + nb) continue; const b0 = (im.bar - s.at) * 4, x = b0 + im.beat;
    const hit = on.some(([a]) => Math.abs(a - x) < 1e-6), held = on.some(([a, e]) => a <= b0 + 1e-6 && e > x);
    if (!hit && !held) bad.push(`term ${im.n} (${JQ.TERMS[im.n - 1].name}): no melody onset at its impact, bar ${im.bar} beat 3`); }
  const hist = {}; s.mel.forEach(([p, d]) => { if (p !== 'r') hist[p.replace(/\d/, '')] = (hist[p.replace(/\d/, '')] || 0) + d; });
  const last = [...s.mel].reverse().find(n => n[0] !== 'r')[0], top = s.mel.filter(n => n[0] !== 'r').map(n => n[0]).sort((a, b) => midi(b) - midi(a))[0];
  info.push(`${s.name.padEnd(8, '　')} 宫=${s.gong} ${s.mode}调  final ${last}  top ${top}  ${Object.entries(hist).map(([k, v]) => k + ':' + v).join(' ')}`);
}
if (at - 1 !== SC.bars) bad.push(`sections end at bar ${at - 1}, expected ${SC.bars}`);
// loudness ceiling: dyn 7–8 keeps the master limiter working for whole sections (measured in the v2 build); allow it only when marked
for (const s of SC.sections) if (Math.max(...s.dyn) > 6 && !s.allowLoud) bad.push(`${s.name}: dyn ${s.dyn.join('→')} above 6 (set allowLoud: true if intended)`);
// the motif 徵-羽-宫 (scale degrees 5, 6, 8 of the 宫) somewhere in each season
const motifIn = (s) => { const g = pc(SC.gong[s.gong][0]), want = [(g + 7) % 12, (g + 9) % 12, g]; const ns = s.mel.filter(n => n[0] !== 'r').map(n => pc(n[0])); for (let i = 0; i + 2 < ns.length; i++) if (ns[i] === want[0] && ns[i + 1] === want[1] && ns[i + 2] === want[2]) return true; return false; };
const seasons = { 春: [5, 22], 夏: [23, 40], 秋: [41, 58], 冬: [59, 76] };
for (const [k, [a, b]] of Object.entries(seasons)) if (!SC.sections.filter(s => s.at >= a && s.at <= b).some(motifIn)) bad.push(`season ${k}: the 徵-羽-宫 motif never appears`);
console.log(info.join('\n'));
console.log(bad.length ? '\n' + bad.length + ' problem(s):\n' + bad.join('\n') : '\nscore OK: ' + SC.sections.length + ' sections, ' + SC.bars + ' bars, every impact has a melody onset');
process.exit(bad.length ? 1 : 0);
