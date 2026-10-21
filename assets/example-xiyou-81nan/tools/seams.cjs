// Seam sheet: the full frame at the moment the procession centre crosses each seam (cell k → k+1), all 80 seams in a grid.
// Usage: node tools/seams.cjs <out.jpg> [from=1] [to=80] [thumbW=480]
const { chromium } = require('./pw.cjs');
const fs = require('fs'), path = require('path');
(async () => {
  const [out, a = '1', b = '80', twArg = '480'] = process.argv.slice(2), tw = +twArg, th = Math.round(tw * 9 / 16);
  const br = await chromium.launch({ channel: 'chrome', args: ['--allow-file-access-from-files'] });
  const p = await br.newPage({ viewport: { width: 1280, height: 720 } });
  const errs = new Set(); p.on('pageerror', e => errs.add(e.message)); p.on('console', m => { if (m.type() === 'error') errs.add(m.text()); });
  await p.goto('file://' + path.resolve(__dirname, '../src/film.html') + '?still=1', { waitUntil: 'load' });
  await p.evaluate(() => document.fonts && document.fonts.ready);
  const url = await p.evaluate(([a, b, tw, th]) => {
    const XY = window.XY, C = XY.CELLS, ks = []; for (let k = a; k <= b; k++) ks.push(k);
    const cols = 8, sheet = document.createElement('canvas'); sheet.width = cols * tw; sheet.height = Math.ceil(ks.length / cols) * th;
    const g = sheet.getContext('2d'), cv = document.querySelector('canvas');
    ks.forEach((k, i) => { const t = C[k].t0 + 0.04; window.__renderAt(t); const x = (i % cols) * tw, y = Math.floor(i / cols) * th;
      g.drawImage(cv, x, y, tw, th); g.fillStyle = 'rgba(0,0,0,.7)'; g.fillRect(x, y, 112, 22); g.fillStyle = '#ff0'; g.font = 'bold 15px monospace'; g.fillText(`${k}→${k + 1}`, x + 6, y + 16); });
    return sheet.toDataURL('image/jpeg', 0.85);
  }, [+a, +b, tw, th]);
  fs.writeFileSync(out, Buffer.from(url.split(',')[1], 'base64'));
  console.log('seams', out, errs.size ? 'PAGE ERRORS: ' + [...errs].slice(0, 5).join(' | ') : 'no page errors');
  await br.close();
})();
