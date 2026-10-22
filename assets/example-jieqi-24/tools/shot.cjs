// Render Art Lock stills with system Chrome.
// usage: node tools/shot.cjs <n|list|all> [t=key] [width=1920] [outDir=qa/art]
//   n = 0 renders the flat debug layout. "all" also writes qa/art/sheet.jpg (6×4, labelled).
//   Prints render ms per style and any page error. Deterministic check: renders twice with another t between, compares.
const { chromium } = require('./pw.cjs');
const fs = require('fs'), path = require('path');
(async () => {
  const [which = '0', tArg = '', wArg = '1920', out = 'qa/art'] = process.argv.slice(2);
  const ns = which === 'all' ? Array.from({ length: 24 }, (_, i) => i + 1) : which.split(',').map(Number);
  fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch({ channel: 'chrome', args: ['--allow-file-access-from-files'] });
  const p = await b.newPage({ viewport: { width: 1280, height: 720 } });
  const errs = []; p.on('pageerror', e => errs.push(String(e))); p.on('console', m => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) errs.push(m.text()); });
  await p.goto('file://' + path.resolve(__dirname, '../artlock/render.html'));
  await p.evaluate(() => document.fonts && document.fonts.ready);
  const w = +wArg, t = tArg === '' ? null : +tArg;
  for (const n of ns) {
    const r = await p.evaluate(([n, t, w]) => window.__render(n, t, w), [n, t, w]);
    if (r.error) { console.log(`s${String(n).padStart(2, '0')} ERROR ${r.error.split('\n').slice(0, 3).join(' | ')}`); continue; }
    const a = await p.evaluate(() => document.getElementById('c').toDataURL('image/png'));
    await p.evaluate(([n, w]) => window.__render(n, 0.37, w), [n, w]);
    await p.evaluate(([n, t, w]) => window.__render(n, t, w), [n, t, w]);
    const a2 = await p.evaluate(() => document.getElementById('c').toDataURL('image/png'));
    const jpg = await p.evaluate(() => document.getElementById('c').toDataURL('image/jpeg', 0.9));
    const f = path.join(out, `s${String(n).padStart(2, '0')}.jpg`);
    fs.writeFileSync(f, Buffer.from(jpg.split(',')[1], 'base64'));
    console.log(`s${String(n).padStart(2, '0')} ${r.ms.toFixed(0)} ms${r.placeholder ? ' (placeholder)' : ''}${a === a2 ? '' : '  NOT DETERMINISTIC'} -> ${f}`);
  }
  if (which === 'all') {
    const sheet = await p.evaluate(() => {
      const cw = 640, ch = 360, pad = 8, lab = 34, sc = document.createElement('canvas');
      sc.width = 6 * cw + 7 * pad; sc.height = 4 * (ch + lab) + 5 * pad; const s = sc.getContext('2d');
      s.fillStyle = '#141416'; s.fillRect(0, 0, sc.width, sc.height);
      for (let n = 1; n <= 24; n++) {
        window.__render(n, null, cw); const x = pad + ((n - 1) % 6) * (cw + pad), y = pad + Math.floor((n - 1) / 6) * (ch + lab + pad);
        s.drawImage(document.getElementById('c'), x, y); const T = JQ.TERMS[n - 1];
        s.fillStyle = '#EDEAE4'; s.font = '22px "PingFang SC", sans-serif'; s.fillText(`${n} ${T.name} · ${T.style}`, x + 4, y + ch + 25);
      }
      return sc.toDataURL('image/jpeg', 0.88);
    });
    fs.writeFileSync(path.join(out, 'sheet.jpg'), Buffer.from(sheet.split(',')[1], 'base64'));
    console.log('sheet -> ' + path.join(out, 'sheet.jpg'));
  }
  if (errs.length) console.log('page errors:\n  ' + errs.slice(0, 8).join('\n  '));
  await b.close();
})();
