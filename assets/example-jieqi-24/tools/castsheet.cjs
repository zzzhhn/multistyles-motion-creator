// Story preview: the family, ox, calf and props drawn on the neutral flat layout, 5 moments per term.
// usage: node tools/castsheet.cjs [terms=1-24] [out=qa/story] — writes one sheet per 8 terms (rows = terms).
const { chromium } = require('./pw.cjs');
const fs = require('fs'), path = require('path');
(async () => {
  const [range = '1-24', out = 'qa/story'] = process.argv.slice(2);
  const [a, b] = range.split('-').map(Number), terms = Array.from({ length: (b || a) - a + 1 }, (_, i) => a + i);
  fs.mkdirSync(out, { recursive: true });
  const br = await chromium.launch({ channel: 'chrome', args: ['--allow-file-access-from-files'] });
  const p = await br.newPage({ viewport: { width: 1280, height: 720 } });
  const errs = []; p.on('pageerror', e => errs.push(String(e)));
  await p.goto('file://' + path.resolve(__dirname, '../artlock/render.html'));
  const TS = [0.3, 2.0, 4.0, 6.67, 7.9];
  for (let i = 0; i < terms.length; i += 8) {
    const chunk = terms.slice(i, i + 8);
    const jpg = await p.evaluate(([chunk, TS]) => {
      const cw = 384, ch = 216, sc = document.createElement('canvas'); sc.width = cw * TS.length; sc.height = ch * chunk.length; const s = sc.getContext('2d');
      const c = document.createElement('canvas'); c.width = cw; c.height = ch; const g = c.getContext('2d');
      chunk.forEach((n, r) => TS.forEach((t, k) => {
        g.setTransform(cw / 1920, 0, 0, ch / 1080, 0, 0); g.clearRect(0, 0, 1920, 1080);
        JQ.flatScene(g, t, { scale: cw / 1920 }, { noCast: true });
        try { JQ.drawCast(g, n, t, JQ.PEN); } catch (e) { g.fillStyle = 'red'; g.font = '60px sans-serif'; g.fillText(String(e).slice(0, 60), 40, 120); }
        g.setTransform(1, 0, 0, 1, 0, 0); g.fillStyle = 'rgba(0,0,0,0.6)'; g.fillRect(0, 0, 150, 22); g.fillStyle = '#fff'; g.font = '14px sans-serif';
        g.fillText(`${n} ${JQ.TERMS[n - 1].name}  t ${t}`, 6, 16); s.drawImage(c, k * cw, r * ch);
      }));
      return sc.toDataURL('image/jpeg', 0.85);
    }, [chunk, TS]);
    const f = path.join(out, `cast_${chunk[0]}-${chunk[chunk.length - 1]}.jpg`); fs.writeFileSync(f, Buffer.from(jpg.split(',')[1], 'base64')); console.log(f);
  }
  if (errs.length) console.log('page errors:\n  ' + [...new Set(errs)].slice(0, 5).join('\n  '));
  await br.close();
})();
