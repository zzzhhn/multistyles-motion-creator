// Derive src/platform.html (9:16 / 1:1 cuts) from src/film.html so both always load the same scripts.
// Usage: node tools/mkplatform.cjs
const fs = require('fs'), path = require('path');
const SRC = path.resolve(__dirname, '../src');
let h = fs.readFileSync(path.join(SRC, 'film.html'), 'utf8');
const canvasTag = '<canvas id="c" width="2560" height="1440"></canvas>';
if (!h.includes(canvasTag) || !h.includes('<script src="runtime.js"></script>')) throw new Error('film.html layout changed');
h = h.replace(canvasTag, `<canvas id="c" width="1440" height="2560"></canvas>
<canvas id="film" width="2560" height="1440" style="display:none"></canvas>
<script>(() => { const q = new URLSearchParams(location.search), p = q.get('profile') === '1x1' ? '1x1' : '9x16'; window.__FILM_CANVAS = 'film';
  if (p === '1x1') document.getElementById('c').height = 1440; window.__FILE_NAME = 'xiyou-81nan-' + p + '.mp4'; })();</script>`);
h = h.replace('<script src="runtime.js"></script>', '<script src="platform.js"></script>\n<script src="runtime.js"></script>');
h = h.replace(/#c \{[^}]*\}/, '#c { height: 100vh; width: auto; max-width: 100vw; display: block; }');
fs.writeFileSync(path.join(SRC, 'platform.html'), h);
console.log('wrote src/platform.html');
