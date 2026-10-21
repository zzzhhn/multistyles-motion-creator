// Render a page's __renderAt(t) for one or more times and save PNG/JPEG stills.
// Usage: node tools/still.cjs <page.html> <outPrefix> <t1,t2,...> [scale=1] [query]
const { chromium } = require('./pw.cjs');
const fs = require('fs'), path = require('path');
(async () => {
  const [file, prefix, ts, scale = '1', q = ''] = process.argv.slice(2);
  const b = await chromium.launch({ channel: 'chrome', args: ['--allow-file-access-from-files'] });
  const p = await b.newPage({ viewport: { width: 1280, height: 720 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await p.goto('file://' + path.resolve(file) + '?still=1' + (q ? '&' + q : ''), { waitUntil: 'load' });
  await p.evaluate(() => document.fonts && document.fonts.ready);
  fs.mkdirSync(path.dirname(path.resolve(prefix)), { recursive: true });
  for (const t of ts.split(',').map(Number)) {
    const t0 = Date.now();
    const url = await p.evaluate(([t, s]) => { window.__renderAt(t); const c = document.querySelector('canvas'); if (+s === 1) return c.toDataURL('image/jpeg', 0.9);
      const k = document.createElement('canvas'); k.width = Math.round(c.width * s); k.height = Math.round(c.height * s); k.getContext('2d').drawImage(c, 0, 0, k.width, k.height); return k.toDataURL('image/jpeg', 0.9); }, [t, scale]);
    const out = `${prefix}_${t.toFixed(2)}.jpg`; fs.writeFileSync(out, Buffer.from(url.split(',')[1], 'base64'));
    console.log(out, `${Date.now() - t0} ms`);
  }
  if (errs.length) console.log('ERRORS:\n' + errs.join('\n'));
  await b.close();
})();
