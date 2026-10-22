// Film stills: node tools/fstill.cjs <t1,t2,...> [outPrefix=qa/film/f] [width=1920] [query]
// Renders artlock/film.html?still=1 at each time and saves JPEGs; prints ms and page errors.
const { chromium } = require('./pw.cjs');
const fs = require('fs'), path = require('path');
(async () => {
  const [ts, prefix = 'qa/film/f', w = '1920', q = ''] = process.argv.slice(2);
  fs.mkdirSync(path.dirname(prefix), { recursive: true });
  const b = await chromium.launch({ channel: 'chrome', args: ['--allow-file-access-from-files'] });
  const p = await b.newPage({ viewport: { width: 1280, height: 720 } });
  const errs = []; p.on('pageerror', e => errs.push(String(e))); p.on('console', m => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) errs.push(m.text()); });
  await p.goto('file://' + path.resolve(__dirname, '../artlock/' + (process.env.PAGE || 'film.html')) + '?still=1&w=' + w + (q ? '&' + q : ''));
  await p.waitForFunction(() => typeof window.__renderAt === 'function');
  await p.evaluate(() => document.fonts && document.fonts.ready);
  for (const t of ts.split(',').map(Number)) {
    const ms = await p.evaluate(t => { const a = performance.now(); window.__renderAt(t); return performance.now() - a; }, t);
    const jpg = await p.evaluate(() => document.getElementById('c').toDataURL('image/jpeg', 0.88));
    const f = `${prefix}_${t.toFixed(2)}.jpg`; fs.writeFileSync(f, Buffer.from(jpg.split(',')[1], 'base64'));
    console.log(`${t.toFixed(2)} s  ${ms.toFixed(0)} ms -> ${f}`);
  }
  console.log('duration', await p.evaluate(() => window.__DURATION));
  if (errs.length) console.log('page errors:\n  ' + errs.slice(0, 6).join('\n  '));
  await b.close();
})();
