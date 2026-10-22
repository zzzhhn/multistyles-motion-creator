// Unit sheet for the film: one style rendered as a full 8-second unit.
// usage: node tools/unitsheet.cjs <n|n,n,...> [outDir=qa/units]
//   writes <outDir>/sNN_sheet.jpg (8 labelled frames: the three pentads, the key impact, the end state) and sNN_key.jpg (2K),
//   measures frame time at 2560 px over 48 frames spread across 0..9 s (avg / p90 / max), checks determinism at the impact,
//   checks the registration fields (key, keyHou, focus ×3, frame) against the contract, and reports page errors.
const { chromium } = require('./pw.cjs');
const fs = require('fs'), path = require('path');
(async () => {
  const [which, out = 'qa/units'] = process.argv.slice(2);
  fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch({ channel: 'chrome', args: ['--allow-file-access-from-files'] });
  const p = await b.newPage({ viewport: { width: 1280, height: 720 } });
  const errs = []; p.on('pageerror', e => errs.push(String(e))); p.on('console', m => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) errs.push(m.text()); });
  await p.goto('file://' + path.resolve(__dirname, '../artlock/render.html'));
  await p.evaluate(() => document.fonts && document.fonts.ready);
  for (const n of which.split(',').map(Number)) {
    const id = 's' + String(n).padStart(2, '0');
    const info = await p.evaluate(n => { const A = JQ.ART[n] || {}, T = JQ.TERMS[n - 1]; return { key: A.key, keyHou: A.keyHou, focus: A.focus, frame: A.frame, tKeyHou: T.keyHou, placeholder: !!A.placeholder }; }, n);
    const impact = info.tKeyHou * 8 / 3 + 4 / 3, problems = [];
    if (info.keyHou !== info.tKeyHou) problems.push(`keyHou ${info.keyHou} != terms ${info.tKeyHou}`);
    if (!(Math.abs((info.key || 0) - impact) < 0.05)) problems.push(`key ${info.key} != impact ${impact.toFixed(3)}`);
    if (!Array.isArray(info.focus) || info.focus.length !== 3) problems.push('focus must be three [x, y] points');
    if (typeof info.frame !== 'boolean') problems.push('frame must be true or false');
    // timing at 2560
    const tm = await p.evaluate(n => { const ms = []; for (let i = 0; i < 48; i++) { const r = window.__render(n, i * 9 / 47, 2560); if (r.error) return { error: r.error }; ms.push(r.ms); } ms.sort((a, b) => a - b); return { avg: ms.reduce((a, b) => a + b, 0) / ms.length, p90: ms[Math.floor(ms.length * 0.9)], max: ms[ms.length - 1] }; }, n);
    if (tm.error) { console.log(`${id} ERROR ${tm.error.split('\n').slice(0, 3).join(' | ')}`); continue; }
    // determinism at the impact
    const h = await p.evaluate(([n, t]) => { const f = () => { window.__render(n, t, 960); return document.getElementById('c').toDataURL('image/png'); }; const a = f(); window.__render(n, 0.37, 960); return a === f(); }, [n, impact]);
    // key frame at 1920 and the sheet
    await p.evaluate(([n, t]) => window.__render(n, t, 1920), [n, impact]);
    const key = await p.evaluate(() => document.getElementById('c').toDataURL('image/jpeg', 0.9));
    fs.writeFileSync(path.join(out, id + '_key.jpg'), Buffer.from(key.split(',')[1], 'base64'));
    const ts = [0, 1.0, impact, 2.9, 3.7, 5.5, 6.9, 8.6].map(t => Math.min(9, t)).sort((a, b) => a - b);
    const sheet = await p.evaluate(([n, ts]) => {
      const cw = 640, ch = 360, sc = document.createElement('canvas'); sc.width = cw * 4; sc.height = ch * 2; const s = sc.getContext('2d');
      ts.forEach((t, i) => { window.__render(n, t, cw); s.drawImage(document.getElementById('c'), (i % 4) * cw, Math.floor(i / 4) * ch);
        const hou = Math.min(2, Math.floor(t / (8 / 3))); s.fillStyle = 'rgba(0,0,0,0.65)'; s.fillRect((i % 4) * cw, Math.floor(i / 4) * ch, 150, 28);
        s.fillStyle = '#fff'; s.font = '18px Menlo'; s.fillText(`t ${t.toFixed(2)} 候${hou + 1}`, (i % 4) * cw + 6, Math.floor(i / 4) * ch + 20); });
      return sc.toDataURL('image/jpeg', 0.85);
    }, [n, ts]);
    fs.writeFileSync(path.join(out, id + '_sheet.jpg'), Buffer.from(sheet.split(',')[1], 'base64'));
    console.log(`${id} 2560px avg ${tm.avg.toFixed(1)} / p90 ${tm.p90.toFixed(1)} / max ${tm.max.toFixed(1)} ms${tm.avg > 25 || tm.p90 > 40 ? '  OVER BUDGET' : ''}  ${h ? 'deterministic' : 'NOT DETERMINISTIC'}  impact ${impact.toFixed(3)}  ${problems.length ? 'CONTRACT: ' + problems.join('; ') : 'contract ok'}${info.placeholder ? ' (placeholder)' : ''}`);
  }
  if (errs.length) console.log('page errors:\n  ' + [...new Set(errs)].slice(0, 6).join('\n  '));
  await b.close();
})();
