// Story continuity check (no browser): every actor's position and facing at the end of term n must equal the start of
// term n+1 (and 24 → 1 for the loop), so the family never jumps when the picture changes style.
// usage: node tools/storycheck.cjs
const path = require('path');
global.window = global; global.document = undefined;
const A = f => require(path.resolve(__dirname, '../artlock/' + f));
['core.js', 'terms.js', 'figures.js', 'figures2.js', 'figures3.js', 'storydata.js', 'storydata2.js', 'story.js'].forEach(A);
const JQ = global.JQ, bad = [];
const who = ['woman', 'kid', 'ox', 'calf'];
for (let n = 1; n <= 24; n++) {
  const m = n === 24 ? 1 : n + 1;
  const a = JQ.storyState(n, 7.9999), b = JQ.storyState(m, 0);
  for (const w of who) {
    const p = a[w], q = b[w];
    if (n === 24 && w === 'calf') continue;                         // the young ox goes in through the gate before 立春
    if (n === 4 && w === 'calf') continue;                          // born with 清明's picture
    if (!p && !q) continue;
    if (!p || !q) { bad.push(`${n}→${m} ${w}: present ${!!p} → ${!!q}`); continue; }
    const d = Math.hypot(p.x - q.x, p.y - q.y);
    if (d > 2) bad.push(`${n}→${m} ${w}: jumps ${d.toFixed(1)} px (${p.x.toFixed(0)},${p.y.toFixed(0)}) → (${q.x.toFixed(0)},${q.y.toFixed(0)})`);
    const lying = s => s.lieK != null ? s.lieK > 0.5 : s.pose === 'lie';
    if ((w === 'ox' || w === 'calf') && lying(p) !== lying(q)) bad.push(`${n}→${m} ${w}: ${lying(p) ? 'lying' : 'standing'} → ${lying(q) ? 'lying' : 'standing'}`);
    if (p.dir !== q.dir && !['walk', 'run', 'lead', 'tote'].includes(q.pose)) bad.push(`${n}→${m} ${w}: turns ${p.dir} → ${q.dir} (${p.pose} → ${q.pose})`);
  }
}
// sanity: every key inside the frame, every pose known
const poses = new Set([...Object.keys(JQ.POSES), 'stand', 'walk', 'graze', 'lie', 'suckle', 'gone']);
for (const [n, T] of Object.entries(JQ.STORY_KEYS)) for (const [w, ks] of Object.entries(T)) ks.forEach(k => {
  if (!poses.has(k[3])) bad.push(`term ${n} ${w}: unknown pose ${k[3]}`);
  if (k[1] < 40 || k[1] > 1880 || k[2] < 560 || k[2] > 1060) bad.push(`term ${n} ${w}: key off the ground (${k[1]}, ${k[2]})`);
  if (k[0] < 0 || k[0] > 8) bad.push(`term ${n} ${w}: key time ${k[0]}`);
});
for (let n = 1; n <= 24; n++) if (!JQ.STORY_KEYS[n]) bad.push(`term ${n}: no story keys`);
// sliding: an actor that moves must be walking (or doing a field job that creeps along the row)
const MOVING = new Set(['walk', 'run', 'lead', 'tote', 'carry', 'plow', 'sow', 'sweep']), CREEP = new Set(['hoe', 'cut', 'reach', 'wave', 'squat']);
for (const [n, T] of Object.entries(JQ.STORY_KEYS)) for (const [w, ks] of Object.entries(T)) for (let i = 0; i + 1 < ks.length; i++) {
  const a = ks[i], b = ks[i + 1], d = Math.hypot(b[1] - a[1], b[2] - a[2]), v = d / Math.max(1e-3, b[0] - a[0]);
  if (d < 4 || MOVING.has(a[3]) || (w === 'ox' || w === 'calf') && a[3] === 'walk') continue;
  if (CREEP.has(a[3]) && v < 45) continue;
  bad.push(`term ${n} ${w}: slides ${d.toFixed(0)} px at ${v.toFixed(0)} px/s in pose ${a[3]} (${a[0]}→${b[0]} s)`);
}
// every prop kind must be one the runtime draws (an unknown kind is silently skipped and leaves an action with nothing in hand)
const KNOWN = new Set(['sheaves', 'seeds', 'stool', 'mat', 'hay', 'plow', 'rope', 'ribbon', 'roller', 'kite', 'stack', 'couplets', 'lanterns',
  'yoke', 'hoe', 'sickle', 'basket', 'pole', 'flail', 'broom', 'fan', 'bowl', 'whip', 'sheaf']);
for (const [n, list] of Object.entries(JQ.STORY_PROPS || {})) list.forEach(([kind]) => { if (!KNOWN.has(kind)) bad.push(`term ${n}: unknown prop kind '${kind}'`); });
console.log(bad.length ? bad.join('\n') : 'story continuous: 24 terms, every boundary matches');
process.exit(bad.length ? 1 : 0);
