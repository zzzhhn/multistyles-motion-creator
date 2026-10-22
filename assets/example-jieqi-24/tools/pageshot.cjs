// Screenshot the Art Lock page itself (layout check): top of page, full page, and the lightbox on one card.
// usage: node tools/pageshot.cjs [outDir=qa/art/page] [lightboxN=1]
const { chromium } = require('./pw.cjs');
const fs = require('fs'), path = require('path');
(async () => {
  const [out = 'qa/art/page', nArg = '1'] = process.argv.slice(2);
  fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch({ channel: 'chrome', args: ['--allow-file-access-from-files'] });
  const p = await b.newPage({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 1 });
  const errs = []; p.on('pageerror', e => errs.push(String(e))); p.on('console', m => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) errs.push(m.text()); });
  await p.goto('file://' + path.resolve(__dirname, '../artlock/index.html'));
  await p.evaluate(() => localStorage.clear());
  await p.reload(); await p.waitForTimeout(1500);
  await p.screenshot({ path: path.join(out, 'top.jpg'), type: 'jpeg', quality: 85 });
  // scroll through so every card renders, then capture the full page
  for (let y = 0; y < 12000; y += 700) { await p.evaluate(y => window.scrollTo(0, y), y); await p.waitForTimeout(250); }
  await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(300);
  await p.screenshot({ path: path.join(out, 'full.jpg'), type: 'jpeg', quality: 70, fullPage: true });
  await p.click(`article.card[data-n="${nArg}"] .shot`); await p.waitForTimeout(1200);
  await p.keyboard.press('1'); await p.waitForTimeout(200);
  await p.screenshot({ path: path.join(out, 'lightbox.jpg'), type: 'jpeg', quality: 85 });
  await p.keyboard.press('Escape'); await p.click('#export'); await p.waitForTimeout(200);
  const txt = await p.$eval('#out', e => e.value);
  console.log(txt.split('\n').slice(0, 5).join('\n'));
  console.log('written to ' + out + (errs.length ? '\npage errors:\n  ' + errs.slice(0, 8).join('\n  ') : ''));
  await b.close();
})();
