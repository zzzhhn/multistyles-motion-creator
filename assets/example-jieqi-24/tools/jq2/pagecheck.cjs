// pagecheck.cjs: open the film page (full and ?loop=1) in one headless Chrome, call RSAudio.render(48000) as runtime.js
// does, and print RSAudio.lastStats (duration vs JQ.FILM.DUR, the 24 accents vs JQ.FILM.events() impacts) plus the
// decoded buffer's length and RMS. Usage: node tools/jq2/pagecheck.cjs [artlock/film.html]
'use strict';
const path = require('path');
const { chromium } = require('../pw.cjs');
(async () => {
  const file = path.resolve(process.argv[2] || path.join(__dirname, '../../artlock/film.html'));
  const browser = await chromium.launch({ channel: 'chrome', args: ['--allow-file-access-from-files'] });
  try {
    for (const q of ['?export=1', '?export=1&loop=1']) {
      const page = await browser.newPage(), errs = [];
      page.on('pageerror', e => errs.push(e.message)); page.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') errs.push(m.text()); });
      await page.goto('file://' + file + q, { waitUntil: 'load' });
      await page.waitForFunction(() => window.RSAudio && window.JQ && window.JQ.FILM, null, { timeout: 20000 });
      const r = await page.evaluate(async () => {
        const b = await window.RSAudio.render(48000), x = b.getChannelData(0); let s = 0; for (let i = 0; i < x.length; i += 7) s += x[i] * x[i];
        return { stats: window.RSAudio.lastStats, length: b.length, sampleRate: b.sampleRate, channels: b.numberOfChannels, rms: Math.sqrt(s / (x.length / 7)), filmDur: window.JQ.FILM.DUR };
      });
      console.log(q, JSON.stringify(r));
      if (errs.length) console.log('  page messages:', errs.slice(0, 6).join(' | '));
      await page.close();
    }
  } finally { await browser.close(); }
})();
