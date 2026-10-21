// Contact sheet + timing for one cell, rendered the way the film shows it (with its neighbours in the timeline).
// Usage: node tools/cellsheet.cjs <n> [outDir=qa/cells] [--detail]
//   writes <outDir>/c<NN>_sheet.jpg: 8 full frames from 1.2 s before the procession enters to 1.2 s after it leaves,
//   each labelled with t and cell-local u; prints draw time of this cell's panel at 2K (avg / max over 40 frames).
//   --detail also writes <outDir>/c<NN>_u50.jpg: the panel alone at full 2K resolution, at u = 0.5.
const { chromium } = require('./pw.cjs');
const fs = require('fs'), path = require('path');
(async () => {
  const args = process.argv.slice(2), n = +args[0], outDir = path.resolve(args[1] && !args[1].startsWith('--') ? args[1] : 'qa/cells'), detail = args.includes('--detail');
  if (!(n >= 1 && n <= 81)) { console.error('usage: node tools/cellsheet.cjs <n 1..81> [outDir] [--detail]'); process.exit(2); }
  fs.mkdirSync(outDir, { recursive: true });
  const ids = [n - 1, n, n + 1].filter(k => k >= 1 && k <= 81).join(',');
  const b = await chromium.launch({ channel: 'chrome', args: ['--allow-file-access-from-files'] });
  const p = await b.newPage({ viewport: { width: 1280, height: 720 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await p.goto('file://' + path.resolve(__dirname, '../src/film.html') + '?still=1&cells=' + ids, { waitUntil: 'load' });
  await p.evaluate(() => document.fonts && document.fonts.ready);
  const res = await p.evaluate(async ([n, detail]) => {
    const XY = window.XY, c = XY.CELLS.find(x => x.n === n), cv = document.querySelector('canvas');
    if (!XY.STYLES[c.style] || !XY.STYLES[c.style].draw) return { err: `style "${c.style}" is not registered (XY.STYLES.${c.style}.draw missing)` };
    const us = [-0.45, 0.02, 0.18, 0.36, 0.54, 0.72, 0.9, 1.4], tw = 853, th = 480, sheet = document.createElement('canvas');
    sheet.width = tw * 4; sheet.height = th * 2; const sg = sheet.getContext('2d');
    us.forEach((u, i) => { const t = c.t0 + u * c.dur; window.__renderAt(t); sg.drawImage(cv, (i % 4) * tw, Math.floor(i / 4) * th, tw, th);
      sg.fillStyle = 'rgba(0,0,0,.72)'; sg.fillRect((i % 4) * tw, Math.floor(i / 4) * th, 210, 26); sg.fillStyle = '#ff0'; sg.font = 'bold 17px monospace';
      sg.fillText(`t ${t.toFixed(2)}  u ${u.toFixed(2)}`, (i % 4) * tw + 6, Math.floor(i / 4) * th + 19); });
    const S = cv.width / XY.DW, k = XY.mk(c.w * S, XY.LAYOUT.PANEL_H * S), times = [];
    for (let j = 0; j < 40; j++) { const t = c.t0 + (j / 39) * c.dur, a = performance.now(); XY.renderPanel(c, t, S, k); k.getContext('2d').getImageData(0, 0, 1, 1); times.push(performance.now() - a); }   // readback forces the GPU to finish
    times.sort((x, y) => x - y);
    let det = null; if (detail) { XY.renderPanel(c, c.t0 + 0.5 * c.dur, S, k); det = k.toDataURL('image/jpeg', 0.9); }
    return { sheet: sheet.toDataURL('image/jpeg', 0.85), det, avg: times.reduce((a, x) => a + x, 0) / times.length, p90: times[35], max: times[39], first: times[0], name: c.name, style: c.style, w: c.w };
  }, [n, detail]);
  if (res.err) { console.log('FAIL', res.err); await b.close(); process.exit(1); }
  const tag = 'c' + String(n).padStart(2, '0');
  fs.writeFileSync(path.join(outDir, tag + '_sheet.jpg'), Buffer.from(res.sheet.split(',')[1], 'base64'));
  if (res.det) fs.writeFileSync(path.join(outDir, tag + '_u50.jpg'), Buffer.from(res.det.split(',')[1], 'base64'));
  console.log(`${tag} ${res.name} [${res.style}] panel ${res.w}px · draw at 2K: avg ${res.avg.toFixed(1)} ms, p90 ${res.p90.toFixed(1)} ms, max ${res.max.toFixed(1)} ms (budget: avg ≤ 25, p90 ≤ 40)`);
  console.log('sheet', path.join(outDir, tag + '_sheet.jpg') + (res.det ? '  detail ' + path.join(outDir, tag + '_u50.jpg') : ''));
  console.log(errs.length ? 'PAGE ERRORS:\n' + errs.slice(0, 8).join('\n') : 'no page errors');
  await b.close();
})();
