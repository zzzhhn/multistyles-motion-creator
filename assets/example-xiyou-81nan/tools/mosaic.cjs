// One image of all 81 cells (panel only, at a chosen u), 9×9, labelled — for checking the whole film's range at a glance.
// Usage: node tools/mosaic.cjs <out.jpg> [u=0.5] [thumbW=480]
const { chromium } = require('./pw.cjs');
const fs = require('fs'), path = require('path');
(async () => {
  const [out, uArg = '0.5', twArg = '480'] = process.argv.slice(2), u = +uArg, tw = +twArg;
  const b = await chromium.launch({ channel: 'chrome', args: ['--allow-file-access-from-files'] });
  const p = await b.newPage({ viewport: { width: 1280, height: 720 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await p.goto('file://' + path.resolve(__dirname, '../src/film.html') + '?still=1', { waitUntil: 'load' });
  await p.evaluate(() => document.fonts && document.fonts.ready);
  const r = await p.evaluate(([u, tw]) => {
    const XY = window.XY, th = Math.round(tw * 780 / 1180), lh = 26, sheet = document.createElement('canvas'); sheet.width = 9 * tw; sheet.height = 9 * (th + lh);
    const g = sheet.getContext('2d'); g.fillStyle = '#1a1612'; g.fillRect(0, 0, sheet.width, sheet.height); const slow = [];
    XY.CELLS.forEach((c, i) => {
      const k = th / XY.LAYOUT.PANEL_H, cv = XY.mk(c.w * k, XY.LAYOUT.PANEL_H * k), a = performance.now();
      XY.renderPanel(c, c.t0 + u * c.dur, k, cv); const ms = performance.now() - a; if (ms > 400) slow.push(`${c.n}:${ms.toFixed(0)}ms`);
      const x = (i % 9) * tw, y = Math.floor(i / 9) * (th + lh);
      g.drawImage(cv, (cv.width - tw) / 2, 0, tw, th, x, y, tw, th);
      const impl = XY.STYLES[c.style] && XY.STYLES[c.style].draw;
      g.fillStyle = impl ? '#e8dcc4' : '#ff6b5b'; g.font = 'bold 15px "PingFang SC", sans-serif'; g.fillText(`${c.n} ${c.name} · ${c.style}${impl ? '' : ' (未实现)'}`, x + 6, y + th + 18);
    });
    return { url: sheet.toDataURL('image/jpeg', 0.86), slow, impl: XY.CELLS.filter(c => XY.STYLES[c.style] && XY.STYLES[c.style].draw).length };
  }, [u, tw]);
  fs.writeFileSync(out, Buffer.from(r.url.split(',')[1], 'base64'));
  console.log(`mosaic ${out}: ${r.impl}/81 cells implemented; slow first renders: ${r.slow.join(' ') || 'none'}`);
  if (errs.length) console.log('PAGE ERRORS:\n' + [...new Set(errs)].slice(0, 12).join('\n'));
  await b.close();
})();
