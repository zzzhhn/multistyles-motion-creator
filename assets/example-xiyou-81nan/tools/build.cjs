// Inline src/film.html + its local <script src="..."> files into one self-contained HTML.
// Usage: node tools/build.cjs [out=xiyou-81nan.html] [src=film.html]
// Fails if the result references anything over the network.
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'src');
const out = path.resolve(ROOT, process.argv[2] || 'xiyou-81nan.html');
const srcName = process.argv[3] || 'film.html';

let html = fs.readFileSync(path.join(SRC, srcName), 'utf8');
const inlined = [], own = [];
html = html.replace(/<script\s+src="([^"]+)"\s*><\/script>/g, (m, src) => {
  if (/^[a-z]+:\/\//i.test(src)) throw new Error('external script not allowed: ' + src);
  const file = path.join(SRC, src);
  if (!fs.existsSync(file)) throw new Error('missing script: ' + src);
  inlined.push(src);
  // keep </script> inside the code from closing the tag early
  const code = fs.readFileSync(file, 'utf8').replace(/<\/script/gi, '<\\/script');
  if (!src.startsWith('vendor/')) own.push(code);   // vendored libraries (Tone.js) are audited separately
  return `<script>\n/* ---- ${src} ---- */\n${code}\n</script>`;
});

const ownCode = own.join('\n');
const net = (html.replace(/<script>[\s\S]*?<\/script>/g, '') + ownCode).match(/(?:src|href)\s*=\s*["'](?:https?:)?\/\/[^"']+/gi) || [];
const fetches = ownCode.match(/\b(?:fetch|XMLHttpRequest|importScripts|WebSocket|EventSource)\s*\(/g) || [];
if (net.length || fetches.length) {
  console.error('NETWORK REFERENCES FOUND:', net.concat(fetches));
  process.exit(1);
}
fs.writeFileSync(out, html);
console.log(`built ${path.relative(ROOT, out)} (${(html.length / 1024).toFixed(1)} KB), inlined: ${inlined.join(', ') || 'none'}`);
