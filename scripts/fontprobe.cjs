// Which named fonts actually render in system Chrome (compare glyph widths against two fallbacks).
const { chromium } = require('./pw.cjs');
(async () => {
  const b = await chromium.launch({ channel: 'chrome' });
  const p = await b.newPage();
  await p.setContent('<canvas id=c></canvas>');
  const names = ['Songti SC','STSong','Kaiti SC','STKaiti','PingFang SC','Hiragino Sans GB','Heiti SC','STHeiti','Yuanti SC','Libian SC','Weibei SC','Xingkai SC','Baoli SC','HanziPen SC','Lantinghei SC','Wawati SC','Hiragino Mincho ProN','Hiragino Sans','Noto Sans Cuneiform','Noto Sans Egyptian Hieroglyphs','Menlo','Courier New','Times New Roman','Didot','Bodoni 72','Copperplate','Papyrus','Optima','Futura','Avenir Next','Gill Sans','American Typewriter','Chalkboard SE','Zapfino','Snell Roundhand','Apple Chancery','Trattatello','Luminari'];
  const r = await p.evaluate(names => {
    const g = document.getElementById('c').getContext('2d'); const s = '西游八十一难取经 Wukong 123';
    const w = f => { g.font = '40px ' + f; return g.measureText(s).width; };
    return names.map(n => { const a = w(`"${n}", monospace`), b2 = w(`"${n}", serif`); const ok = Math.abs(a - b2) < 0.01 && Math.abs(a - w('monospace')) > 0.01; return [n, ok]; });
  }, names);
  console.log('OK :', r.filter(x => x[1]).map(x => x[0]).join(' | '));
  console.log('MISSING:', r.filter(x => !x[1]).map(x => x[0]).join(' | '));
  await b.close();
})();
