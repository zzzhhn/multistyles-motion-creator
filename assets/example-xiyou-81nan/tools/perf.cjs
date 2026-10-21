// Frame-time profile of the whole film page (__renderAt incl. GPU readback) at N evenly spaced times.
// Usage: node tools/perf.cjs [N=120] [query]
const { chromium } = require('./pw.cjs');
const path = require('path');
(async () => {
  const N = +(process.argv[2] || 120), q = process.argv[3] || '';
  const b = await chromium.launch({ channel: 'chrome', args: ['--allow-file-access-from-files'] });
  const p = await b.newPage({ viewport: { width: 1280, height: 720 } });
  const errs = new Set(); p.on('pageerror', e => errs.add(e.message)); p.on('console', m => { if (m.type() === 'error') errs.add(m.text()); });
  await p.goto('file://' + path.resolve(__dirname, '../src/film.html') + '?still=1' + (q ? '&' + q : ''), { waitUntil: 'load' });
  await p.evaluate(() => document.fonts && document.fonts.ready);
  const r = await p.evaluate(N => { const D = window.__DURATION, c = document.querySelector('canvas'), g = c.getContext('2d'), out = [];
    for (let i = 0; i < N; i++) { const t = (i + 0.5) / N * D, a = performance.now(); window.__renderAt(t); g.getImageData(0, 0, 1, 1); out.push([t, performance.now() - a]); }
    return { D, out }; }, N);
  const ms = r.out.map(x => x[1]).sort((a, b) => a - b), avg = ms.reduce((a, x) => a + x, 0) / ms.length;
  console.log(`frames ${N}: avg ${avg.toFixed(1)} ms, p50 ${ms[N >> 1].toFixed(1)}, p90 ${ms[Math.floor(N * 0.9)].toFixed(1)}, max ${ms[N - 1].toFixed(1)}`);
  console.log(`estimated 60 fps export of ${r.D} s: ~${(avg * r.D * 60 / 1000 / 60 + r.D * 60 * 3 / 1000 / 60).toFixed(1)} min (render + ~3 ms/frame encode)`);
  console.log('slowest:', r.out.sort((a, b) => b[1] - a[1]).slice(0, 6).map(x => `${x[0].toFixed(1)}s:${x[1].toFixed(0)}ms`).join(' '));
  if (errs.size) console.log('PAGE ERRORS:', [...errs].slice(0, 6).join(' | '));
  await b.close();
})();
