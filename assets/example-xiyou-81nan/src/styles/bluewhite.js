// 24 明代青花 · 1500 年 · 平顶山逢魔 — a Hongzhi-period blue-and-white plaque: lotus-scroll and ruyi-collar bands above,
// lotus-petal panels below, a flat-topped 平顶山 in hemp-fibre strokes, 莲花洞 with 金角 peeping out, pines, a waterfall,
// the 日值功曹 disguised as a woodcutter pointing the way. 银角 stands on a ruyi cloud holding the 紫金红葫芦 (painted in
// underglaze copper red, 釉里红). He calls 「者行孙」 — the characters fly out of the gourd — 悟空 answers 「哎」 on beat 2 and
// is spun down to nothing into the gourd mouth; on beat 3 the stopper shuts and the 太上老君 slip slaps on. On 4 he
// escapes as a tiny insect and is back in line on 4.5. Cobalt bleeds softly into the glaze; heaped-and-piled dark
// spots; a glaze reflection drifts. Entry: unfired grey-black cobalt turns blue as the kiln glow spreads out.
(() => {
  'use strict';
  const XY = window.XY, K = XY.KIT_C, TAU = XY.TAU;
  const CB = '#1B3A86', CB2 = '#2C55A8', WASH = 'rgba(46,86,176,0.32)', WASH2 = 'rgba(46,86,176,0.55)', GLAZE = '#F3F6F4', RED = '#A8352A';
  const TONE = { dark: '#3D5FA8', mid: '#86A2D2', light: '#D2DEF0' };
  const ROLE = { ink: 'line', stripe: 'line', hoof: 'dark', bjrobe: 'dark', bjpants: 'dark', ssrobe2: 'dark', saddle: 'dark', kasaya: 'mid', red: 'mid', wkshirt: 'mid', staff: 'mid',
    ssrobe: 'mid', ssh: 'mid', ssbeard: 'mid', fur: 'mid', wood: 'mid', metal: 'mid', tiger: 'light', gold: 'light', robe: 'light', pig2: 'light', skin2: 'light', bundle: 'light', horse2: 'light', mane: 'light' };
  const PEN = { color: r => { const k = ROLE[r]; return k === 'line' ? CB : k ? TONE[k] : GLAZE; }, outline: CB, ow: 1.5, wob: 0.6, seed: 24, shade: 'rgba(40,80,170,0.18)' };
  const GOURD = [856, 262];   // where the gourd's mouth points from (in 银角's hands)

  // ------------------------------------------------------------ motifs
  const wash = (g, pts, col = WASH, lw = 1.4) => { XY.path(g, pts, true); g.fillStyle = col; g.fill(); g.strokeStyle = CB; g.lineWidth = lw; g.stroke(); };
  const ruyi = (g, x, y, s, t = 0) => {   // a ruyi-head cloud: three lobes with a curling tail
    g.save(); g.translate(x, y); g.scale(s, s); g.strokeStyle = CB; g.lineWidth = 2.2 / s; g.fillStyle = 'rgba(46,86,176,0.22)';
    g.beginPath(); g.arc(-18, 0, 14, Math.PI * 0.6, Math.PI * 2.2); g.arc(0, -10, 14, Math.PI * 1.1, Math.PI * 1.95); g.arc(18, 0, 14, Math.PI * 1.3, Math.PI * 2.5); g.quadraticCurveTo(0, 22, -24, 10); g.closePath(); g.fill(); g.stroke();
    g.beginPath(); g.arc(-18, 0, 6, 0, Math.PI * 1.6); g.stroke(); g.beginPath(); g.arc(18, 0, 6, Math.PI, Math.PI * 2.6); g.stroke();
    g.beginPath(); g.moveTo(24, 12); g.bezierCurveTo(60, 20, 80 + 6 * Math.sin(t), 0, 110, 14); g.stroke(); g.beginPath(); g.moveTo(22, 18); g.bezierCurveTo(56, 30, 76, 16, 96, 26); g.stroke();
    g.restore();
  };
  const pine = (g, x, y, s, seed) => {
    const R = XY.rng(seed); g.strokeStyle = CB; g.lineWidth = 5 * s; g.lineCap = 'round'; g.beginPath(); g.moveTo(x, y);
    let px = x, py = y; for (let k = 0; k < 4; k++) { px += (R() - 0.3) * 22 * s; py -= 26 * s; g.lineTo(px, py); } g.stroke();
    for (let k = 0; k < 5; k++) { const cx = px + (R() - 0.5) * 70 * s, cy = py + k * 12 * s - 8 * s;
      g.fillStyle = WASH2; g.beginPath(); g.ellipse(cx, cy, 26 * s, 9 * s, 0, 0, TAU); g.fill();
      g.strokeStyle = CB; g.lineWidth = 1; for (let q = 0; q < 9; q++) { const a = Math.PI + q / 8 * Math.PI; g.beginPath(); g.moveTo(cx, cy + 2 * s); g.lineTo(cx + Math.cos(a) * 26 * s, cy + Math.sin(a) * 9 * s); g.stroke(); } }
  };
  const lotusScroll = (g, W, y0, y1) => {   // 缠枝莲: a wavy stem with lotus heads and curling leaves
    const ym = (y0 + y1) / 2, A = (y1 - y0) * 0.28; g.strokeStyle = CB; g.lineWidth = 2;
    g.beginPath(); for (let x = 0; x <= W; x += 6) { const y = ym + A * Math.sin(x / 60); x ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke();
    for (let k = 0; k * 60 * Math.PI < W + 200; k++) { const x = (k + 0.5) * 60 * Math.PI, up = k % 2 === 0, y = ym + (up ? -A : A);
      g.fillStyle = WASH2; g.beginPath(); g.ellipse(x, y, 13, 9, 0, 0, TAU); g.fill(); g.stroke();
      for (let q = -2; q <= 2; q++) { g.beginPath(); g.ellipse(x + q * 6, y + (up ? -6 : 6), 4, 7, q * 0.35, 0, TAU); g.fillStyle = 'rgba(46,86,176,0.4)'; g.fill(); g.stroke(); }
      [-1, 1].forEach(d => { g.beginPath(); g.moveTo(x + d * 14, y); g.quadraticCurveTo(x + d * 30, y + (up ? 12 : -12), x + d * 40, y + (up ? 4 : -4)); g.stroke(); g.beginPath(); g.arc(x + d * 42, y + (up ? 4 : -4), 4, 0, TAU * 0.8); g.stroke(); }); }
  };
  const ruyiCollar = (g, W, y) => { g.strokeStyle = CB; g.lineWidth = 1.8;
    for (let x = 0; x < W; x += 78) { g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + 6, y + 24, x + 22, y + 22); g.arc(x + 39, y + 22, 17, Math.PI, 0, true); g.quadraticCurveTo(x + 72, y + 24, x + 78, y); g.fillStyle = 'rgba(46,86,176,0.45)'; g.fill(); g.stroke();
      g.beginPath(); g.arc(x + 39, y + 20, 7, Math.PI, 0, true); g.stroke(); } };
  const petals = (g, W, y0, y1) => { g.strokeStyle = CB; g.lineWidth = 1.8;
    for (let x = 0; x < W; x += 64) { g.beginPath(); g.moveTo(x + 4, y1); g.lineTo(x + 4, y0 + 22); g.quadraticCurveTo(x + 32, y0 - 10, x + 60, y0 + 22); g.lineTo(x + 60, y1); g.fillStyle = 'rgba(46,86,176,0.18)'; g.fill(); g.stroke();
      g.beginPath(); g.moveTo(x + 14, y1 - 4); g.lineTo(x + 14, y0 + 28); g.quadraticCurveTo(x + 32, y0 + 6, x + 50, y0 + 28); g.lineTo(x + 50, y1 - 4); g.stroke();
      g.beginPath(); g.arc(x + 32, y0 + 38, 6, 0, TAU); g.fillStyle = WASH2; g.fill(); g.stroke(); } };
  const dots = (g, pts, seed, n) => { const R = XY.rng(seed); g.fillStyle = '#10255E'; for (let k = 0; k < n; k++) { const i = Math.floor(R() * (pts.length / 2 - 1)) * 2, f = R(), x = XY.lerp(pts[i], pts[i + 2], f), y = XY.lerp(pts[i + 1], pts[i + 3], f), r = 0.8 + R() * 1.8; g.beginPath(); g.ellipse(x + (R() - 0.5) * 2, y + (R() - 0.5) * 2, r, r * 0.8, 0, 0, TAU); g.fill(); } };
  const art = (g, W, H) => {   // the static painting (drawn once, then given a cobalt bleed)
    g.lineCap = 'round'; g.lineJoin = 'round';
    // bands
    [[4, W], [10, W], [60, W], [66, W], [714, W], [720, W]].forEach(([y]) => { g.strokeStyle = CB; g.lineWidth = 1.8; g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke(); });
    lotusScroll(g, W, 12, 58); ruyiCollar(g, W, 66); petals(g, W, 724, 780);
    // distant peaks and the flat-topped mountain with hemp-fibre strokes
    [[640, 420, 120, 110], [780, 430, 110, 80], [930, 440, 140, 120], [1070, 450, 100, 70]].forEach(([x, y, w, h]) => wash(g, [x - w, y, x - w * 0.3, y - h, x, y - h * 0.85, x + w * 0.4, y - h * 1.05, x + w, y], 'rgba(46,86,176,0.16)', 1));
    // 平顶山: a flat plateau over two stepped cliff bands; each band darkens toward its foot where the cobalt pools
    const R = XY.rng(2424), bands = [[236, 330, 210, 500, 196, 528], [330, 470, 160, 560, 120, 612], [470, 650, 100, 640, 60, 720]];
    bands.forEach(([y0, y1, a0, a1, b0, b1], k) => {
      const top = [], bot = []; for (let q = 0; q <= 12; q++) { const f = q / 12; top.push(XY.lerp(a0, a1, f), y0 + (k ? 6 * Math.sin(q * 1.7 + k) : 0)); bot.push(XY.lerp(b1, b0, f), y1 + 5 * Math.sin(q * 2.3 + k)); }
      const pts = top.concat(bot); XY.path(g, pts, true); g.fillStyle = GLAZE; g.fill();
      g.save(); XY.path(g, pts, true); g.clip(); const gr = g.createLinearGradient(0, y0, 0, y1); gr.addColorStop(0, 'rgba(46,86,176,0.10)'); gr.addColorStop(0.7, 'rgba(46,86,176,0.26)'); gr.addColorStop(1, 'rgba(46,86,176,0.5)'); g.fillStyle = gr; g.fillRect(0, y0 - 10, W, y1 - y0 + 20);
      g.strokeStyle = CB; g.lineWidth = 1.1; for (let q = 0; q < 34; q++) { const x = XY.lerp(b0, b1, R()), y = y0 + 4 + R() * (y1 - y0) * 0.4, l = 16 + R() * 26; g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + (R() - 0.5) * 8, y + l * 0.5, x + (x < (a0 + a1) / 2 ? -4 : 4), y + l); g.stroke(); }
      g.restore(); XY.path(g, top, false); g.strokeStyle = CB; g.lineWidth = 2.2; g.stroke(); g.lineWidth = 1.4; g.beginPath(); g.moveTo(a0, top[1]); g.lineTo(b0, y1); g.moveTo(a1, top[top.length - 1]); g.lineTo(b1, y1); g.stroke();
      dots(g, top, 9 + k, 14);
    });
    // 莲花洞: an arched mouth ringed with lotus petals
    g.fillStyle = 'rgba(27,58,134,0.75)'; g.beginPath(); g.moveTo(386, 566); g.lineTo(386, 512); g.quadraticCurveTo(430, 456, 474, 512); g.lineTo(474, 566); g.closePath(); g.fill();
    for (let k = 0; k < 9; k++) { const a = Math.PI + k / 8 * Math.PI, x = 430 + Math.cos(a) * 58, y = 528 + Math.sin(a) * 66; g.save(); g.translate(x, y); g.rotate(a + Math.PI / 2); g.beginPath(); g.ellipse(0, 0, 8, 15, 0, 0, TAU); g.fillStyle = 'rgba(46,86,176,0.35)'; g.fill(); g.strokeStyle = CB; g.lineWidth = 1.4; g.stroke(); g.restore(); }
    // waterfall into a pool, the woodcutter's path
    g.strokeStyle = CB; g.lineWidth = 1; for (let k = 0; k < 7; k++) { const x0 = 468 + k * 4.4; g.beginPath(); g.moveTo(x0, 300); g.bezierCurveTo(x0 + 2, 380, x0 - 2, 450, x0 + (k - 3) * 2, 520); g.stroke(); }   // the falling water in fine cobalt lines
    for (let k = 0; k < 9; k++) { g.beginPath(); g.arc(470 + k * 4, 524 - (k % 3) * 4, 5 + k % 2 * 3, Math.PI * 1.1, Math.PI * 1.9); g.stroke(); } g.beginPath(); g.ellipse(482, 534, 46, 12, 0, 0, TAU); g.fillStyle = 'rgba(46,86,176,0.3)'; g.fill(); g.stroke();
    g.strokeStyle = CB; g.lineWidth = 1.4; g.beginPath(); g.moveTo(90, 650); g.lineTo(150, 610); g.lineTo(120, 560); g.lineTo(200, 520); g.lineTo(176, 478); g.stroke();
    [[150, 470, 0.7, 1], [300, 238, 0.7, 2], [430, 238, 0.6, 3], [660, 640, 1, 4], [990, 650, 0.9, 5]].forEach(([x, y, s, k]) => pine(g, x, y, s, 50 + k));
    ruyi(g, 700, 140, 0.9); ruyi(g, 250, 116, 0.7);
    // perforated Taihu rocks in the foreground, ground line and grass
    [[60, 708, 70, 120], [1110, 708, 74, 130]].forEach(([x, y, w, h], k) => { const p = []; for (let q = 0; q < 14; q++) { const a = Math.PI + q / 13 * Math.PI; p.push(x + Math.cos(a) * w * (1 + 0.2 * Math.sin(q * 2.3 + k)), y + Math.sin(a) * h * (1 + 0.15 * Math.cos(q * 1.7))); }
      wash(g, XY.RIG.spline(p, true, 3), 'rgba(46,86,176,0.28)', 2); for (let q = 0; q < 4; q++) { g.beginPath(); g.ellipse(x - 30 + q * 20, y - 40 - (q % 2) * 40, 7, 10, 0.3, 0, TAU); g.fillStyle = 'rgba(27,58,134,0.6)'; g.fill(); g.stroke(); } dots(g, p, 70 + k, 12); });
    g.strokeStyle = CB; g.lineWidth = 1.6; g.beginPath(); for (let x = 0; x <= W; x += 20) { const y = 704 + 3 * Math.sin(x / 37); x ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke();
    for (let k = 0; k < 40; k++) { const x = 20 + k * 29 + 8 * Math.sin(k * 7); g.lineWidth = 1.1; for (let q = -1; q <= 1; q++) { g.beginPath(); g.moveTo(x, 706); g.quadraticCurveTo(x + q * 4, 696, x + q * 8, 690); g.stroke(); } }
    // 海棠-shaped reserve panel with the place name, and the reign-mark style counter
    g.save(); g.translate(86, 204); g.beginPath(); [[0, -106], [44, 0], [0, 106], [-44, 0]].forEach(([x, y], k) => { g.arc(x * 0.62, y * 0.62, 50, k * Math.PI / 2 - Math.PI, k * Math.PI / 2, false); }); g.closePath();
    g.fillStyle = GLAZE; g.fill(); g.strokeStyle = CB; g.lineWidth = 2.2; g.stroke(); g.restore();
    g.fillStyle = CB; g.font = XY.font(52, XY.cnFont.kai, 'bold'); K.vtext(g, '平顶山', 86, 112, 52, 1.04);
    g.strokeStyle = CB; g.lineWidth = 2.4; g.beginPath(); g.arc(1110, 154, 52, 0, TAU); g.stroke(); g.lineWidth = 1.4; g.beginPath(); g.arc(1110, 154, 45, 0, TAU); g.stroke();
    g.font = XY.font(28, XY.cnFont.kai, 'bold'); K.vtext(g, '第廿', 1124, 122, 28, 1.05); K.vtext(g, '四难', 1096, 122, 28, 1.05);
  };
  // ------------------------------------------------------------ living figures
  const gourd = (g, x, y, rot, sealed, slip) => {   // 紫金红葫芦 in underglaze copper red, mouth toward (x, y)
    g.save(); g.translate(x, y); g.rotate(rot); g.lineWidth = 1.6; g.strokeStyle = '#6A1E18';
    const body = XY.RIG.spline([0, -6, 12, -8, 16, -22, 30, -30, 34, -48, 26, -60, 34, -70, 48, -86, 44, -108, 22, -118, 0, -112, -12, -94, -10, -72, 0, -64, -6, -50, -2, -30, -12, -20, -10, -8], true, 4);
    XY.path(g, body, true); g.save(); g.shadowColor = 'rgba(168,60,50,0.7)'; g.shadowBlur = 10; g.fillStyle = 'rgba(160,62,52,0.62)'; g.fill(); g.restore(); g.strokeStyle = 'rgba(120,40,32,0.8)'; g.stroke();
    g.fillStyle = 'rgba(255,230,220,0.35)'; g.beginPath(); g.ellipse(26, -96, 6, 10, 0.3, 0, TAU); g.fill();
    g.strokeStyle = CB; g.lineWidth = 2; g.beginPath(); g.moveTo(-2, -66); g.quadraticCurveTo(14, -60, 28, -66); g.stroke();
    if (sealed) { g.fillStyle = '#6A1E18'; g.fillRect(-4, -4, 18, 8); }
    if (slip > 0) { g.save(); g.translate(10, -40); g.rotate(-rot); const s = 1 + 0.4 * (1 - slip); g.scale(s, s); g.fillStyle = '#F6F2E2'; g.fillRect(-9, -46, 18, 92); g.strokeStyle = RED; g.lineWidth = 1; g.strokeRect(-9, -46, 18, 92);
      g.fillStyle = RED; g.font = XY.font(8.6, XY.cnFont.kai, 'bold'); K.vtext(g, '太上老君急急如律令奉敕', 0, -45, 8.6, 1); g.restore(); }
    g.restore();
  };
  // 银角大王 in the manner of Ming blue-and-white figure painting: one horn, glaring eyes, a bristling beard, a cloud
  // collar over a long robe whose folds are drawn in cobalt line, both hands lifting the gourd. Feet at (x, y).
  const silverHorn = (g, x, y, t, call) => {
    ruyi(g, x + 6, y + 16, 1.5, t);
    g.save(); g.translate(x, y); g.strokeStyle = CB; g.lineJoin = 'round'; g.lineCap = 'round';
    const sw = 6 * Math.sin(t * 2.2);
    wash(g, [-18, -150, 36, -136, 66 + sw, -60, 70 + sw, -6, 40, 0], 'rgba(46,86,176,0.5)', 1.6);                      // cape flying behind
    wash(g, [-38, 0, 40, 0, 30, -96, 18, -128, -22, -128, -32, -96], 'rgba(46,86,176,0.28)', 2);                     // robe
    g.lineWidth = 1.3; [[-30, -6, -14, -60], [-14, -4, 2, -62], [6, -4, 16, -58], [24, -6, 26, -50]].forEach(l => { g.beginPath(); g.moveTo(l[0], l[1]); g.quadraticCurveTo((l[0] + l[2]) / 2 - 8, (l[1] + l[3]) / 2, l[2], l[3]); g.stroke(); });
    g.save(); XY.path(g, [-28, -72, 28, -72, 20, -122, -20, -122], true); g.clip(); g.fillStyle = 'rgba(46,86,176,0.35)'; g.fillRect(-30, -124, 60, 54);   // scale armour on the chest
    for (let r = 0; r < 6; r++) for (let c = -3; c <= 3; c++) { g.beginPath(); g.arc(c * 9 + (r % 2) * 4.5, -76 - r * 9, 5, 0, Math.PI); g.lineWidth = 1; g.stroke(); } g.restore();
    wash(g, [-38, 0, 40, 0, 36, -18, -36, -18], 'rgba(46,86,176,0.65)', 1.6);                                            // hem band
    g.lineWidth = 1.2; for (let k = -34; k < 36; k += 9) { g.beginPath(); g.arc(k + 4, -9, 4, Math.PI, 0); g.stroke(); }
    g.beginPath(); g.moveTo(-32, -112); for (let k = 0; k <= 6; k++) { const a = Math.PI + k / 6 * Math.PI; g.quadraticCurveTo(-2 + Math.cos(a - 0.26) * 40, -124 + Math.sin(a - 0.26) * 22, -2 + Math.cos(a) * 34, -124 + Math.sin(a) * 18); }
    g.closePath(); g.fillStyle = 'rgba(46,86,176,0.45)'; g.fill(); g.lineWidth = 1.6; g.stroke();                       // cloud collar (云肩)
    g.lineWidth = 5; g.beginPath(); g.moveTo(-30, -70); g.quadraticCurveTo(0, -62, 30, -70); g.stroke();             // belt
    // head: broad face, one swept-back horn, glaring eyes, beard and moustache
    g.lineWidth = 1.8; g.beginPath(); g.ellipse(-2, -146, 20, 22, 0, 0, TAU); g.fillStyle = GLAZE; g.fill(); g.stroke();
    g.beginPath(); g.moveTo(-8, -164); g.quadraticCurveTo(-4, -200, 18, -212); g.quadraticCurveTo(8, -192, 6, -166); g.closePath(); g.fillStyle = '#C8D4EA'; g.fill(); g.stroke();
    for (let k = 0; k < 3; k++) { g.beginPath(); g.moveTo(-4 + k * 3, -172 - k * 12); g.lineTo(6 + k * 2, -174 - k * 12); g.lineWidth = 1; g.stroke(); }
    g.lineWidth = 2.4; g.beginPath(); g.moveTo(-20, -158); g.lineTo(-8, -152); g.moveTo(4, -152); g.lineTo(16, -158); g.stroke();
    g.fillStyle = GLAZE; [[-12, -147], [8, -147]].forEach(([ex, ey]) => { g.beginPath(); g.ellipse(ex, ey, 5, 3.6, 0, 0, TAU); g.fill(); g.lineWidth = 1.2; g.stroke(); g.fillStyle = CB; g.beginPath(); g.arc(ex - 1, ey, 2, 0, TAU); g.fill(); g.fillStyle = GLAZE; });
    g.fillStyle = 'rgba(27,58,134,0.75)'; g.beginPath(); g.moveTo(-18, -136); g.quadraticCurveTo(-2, -128, 14, -136); g.quadraticCurveTo(10, -104 - 4 * Math.sin(t * 3), -2, -98); g.quadraticCurveTo(-14, -104, -18, -136); g.fill();
    if (call > 0) { g.fillStyle = '#10255E'; g.beginPath(); g.ellipse(-2, -133, 6, 4 * call + 1, 0, 0, TAU); g.fill(); }
    // arms up, hands on the gourd
    [[-28, -112, -54, -92, -80, -84], [22, -112, -10, -88, -40, -100]].forEach(l => { g.lineWidth = 14; g.strokeStyle = CB; g.beginPath(); g.moveTo(l[0], l[1]); g.quadraticCurveTo(l[2], l[3], l[4], l[5]); g.stroke(); g.lineWidth = 10.5; g.strokeStyle = TONE.light; g.stroke();
      g.lineWidth = 1.4; g.strokeStyle = CB; g.beginPath(); g.ellipse(l[4], l[5], 6, 5, 0, 0, TAU); g.fillStyle = GLAZE; g.fill(); g.stroke(); });
    g.restore();
  };
  const goldHorn = (g, t) => { const up = 0.5 + 0.5 * Math.sin(t * 1.3), y = 566 - 34 * XY.smooth(up);   // 金角大王 peeping out of 莲花洞, hands on the rim
    g.save(); g.beginPath(); g.moveTo(386, 566); g.lineTo(386, 512); g.quadraticCurveTo(430, 456, 474, 512); g.lineTo(474, 566); g.closePath(); g.clip();
    g.strokeStyle = CB; g.lineWidth = 1.6; g.beginPath(); g.ellipse(430, y, 22, 20, 0, 0, TAU); g.fillStyle = GLAZE; g.fill(); g.stroke();
    [[-1, 412], [1, 448]].forEach(([s2, hx]) => { g.beginPath(); g.moveTo(hx, y - 16); g.quadraticCurveTo(hx - s2 * 8, y - 40, hx + s2 * 4, y - 46); g.quadraticCurveTo(hx + s2 * 2, y - 30, hx + s2 * 8, y - 14); g.fillStyle = '#D8C9A0'; g.fill(); g.stroke(); });
    g.lineWidth = 2.2; g.beginPath(); g.moveTo(416, y - 8); g.lineTo(426, y - 4); g.moveTo(434, y - 4); g.lineTo(444, y - 8); g.stroke();
    g.fillStyle = CB; g.beginPath(); g.arc(422, y, 2.4, 0, TAU); g.arc(438, y, 2.4, 0, TAU); g.fill();
    g.beginPath(); g.moveTo(420, y + 10); g.quadraticCurveTo(430, y + 6, 440, y + 10); g.lineWidth = 1.4; g.stroke(); g.restore();
    [[396, 524], [464, 524]].forEach(([hx, hy]) => { g.beginPath(); g.ellipse(hx, hy + 22 - 30 * XY.smooth(up) * 0.5, 7, 5, 0, 0, TAU); g.fillStyle = GLAZE; g.fill(); g.strokeStyle = CB; g.lineWidth = 1.2; g.stroke(); }); };
  const woodcutter = (g, t) => {   // 日值功曹 as a woodcutter on the path, pointing up at the mountain
    const x = 196, y = 476, pt = 0.5 + 0.5 * Math.sin(t * 2.4);
    g.save(); g.translate(x, y); g.scale(1.6, 1.6); g.strokeStyle = CB; g.lineWidth = 1.4; g.lineCap = 'round';
    wash(g, [-10, 0, 10, 0, 7, -30, -7, -30], 'rgba(46,86,176,0.35)', 1.3);
    g.beginPath(); g.arc(0, -37, 6.5, 0, TAU); g.fillStyle = GLAZE; g.fill(); g.stroke(); g.beginPath(); g.ellipse(0, -42, 10, 3, 0, 0, TAU); g.stroke();
    g.beginPath(); g.moveTo(-14, -28); g.lineTo(26, -36); g.stroke();
    for (let k = 0; k < 5; k++) { g.beginPath(); g.moveTo(-26, -24 - k * 3); g.lineTo(-8, -32 - k * 3); g.moveTo(14, -32 - k * 2); g.lineTo(32, -40 - k * 2); g.stroke(); }
    g.beginPath(); g.moveTo(4, -26); g.lineTo(18 + 4 * pt, -44 - 10 * pt); g.stroke();
    g.restore();
  };
  const SH = [992, 330];   // 银角's feet on his cloud

  XY.STYLES.bluewhite = {
    hits: [3.2, 4.8, 6.4],
    bg(g, W, H, c, scale) {
      K.paint(g, K.pix(W, H, scale, 4, (x, y) => { const n = XY.fbm(x / 200, y / 160, 24, 3), v = 1 + 0.012 * n, pool = Math.max(0, (y - 700) / 80);
        return [243 * v - 6 * pool, 246 * v - 2 * pool, 244 * v]; }), W, H);
      const art0 = XY.mk(W * scale, H * scale), ag = art0.getContext('2d'); ag.setTransform(scale, 0, 0, scale, 0, 0); art(ag, W, H);
      g.save(); g.filter = `blur(${(3.4 * scale).toFixed(2)}px)`; g.globalAlpha = 0.8; g.drawImage(art0, 0, 0, W, H); g.restore();   // cobalt bleeding into the glaze
      g.drawImage(art0, 0, 0, W, H);
      g.save(); g.globalCompositeOperation = 'multiply'; g.globalAlpha = 0.45; g.drawImage(art0, 0, 0, W, H); g.restore();   // heaped cobalt: strokes pool darker
      { const Q = XY.rng(4343); g.fillStyle = 'rgba(44,30,40,0.75)'; for (let k = 0; k < 160; k++) { const x = 120 + Q() * 640, y = 190 + Q() * 460; if (y < 186 + Math.abs(x - 400) * 0.1) continue; const r = 0.8 + Q() * 2.2; g.beginPath(); g.ellipse(x, y, r, r * 0.8, Q() * 3, 0, TAU); g.fill(); } }   // iron spots where the cobalt is thick
      const R = XY.rng(4242); for (let k = 0; k < 70; k++) { const x = R() * W, y = R() * H, r = 0.8 + R() * 1.4; g.fillStyle = 'rgba(255,255,255,0.9)'; g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill(); g.strokeStyle = 'rgba(60,80,110,0.35)'; g.lineWidth = 0.5; g.stroke(); }
    },
    draw(g, e) {
      const { W, H, t, u } = e, b = e.beat, S = e.S;
      const acts = { wukong: { shade: K.bump(b, 1.4, 1.8, 2.8, 3.1), raise: 0.5 * K.bump(b, 3.0, 3.2, 3.35, 3.5) }, monk: { palm: K.bump(b, 3.6, 4.0, 6.4, 7.0) },
        bajie: { scratch: K.bump(b, 5.0, 5.3, 6.0, 6.4) }, shaseng: { lift: K.bump(b, 3.5, 3.7, 4.2, 4.6) } };
      { const hm = K.home(e, 'wukong'); K.push(g, e, (GOURD[0] + hm[0]) / 2, 420, K.pushOf(b, 3.0, 3.6, 5.6, 0.12)); }
      // ---- clouds, waterfall, the figures who live in the landscape
      ruyi(g, 160 + ((t * 18) % 1100) - 200, 260, 0.6, t); ruyi(g, 900 - ((t * 12) % 1000) + 200, 420, 0.5, t + 1);
      g.strokeStyle = CB2; g.lineWidth = 1.2; for (let k = 0; k < 8; k++) { const y0 = 200 + ((t * 120 + k * 40) % 320); g.beginPath(); g.moveTo(524 + (k % 3) * 9, y0); g.lineTo(524 + (k % 3) * 9, Math.min(518, y0 + 22)); g.stroke(); }
      goldHorn(g, t); woodcutter(g, t);
      // ---- 银角 and the gourd: open, sealed on beat 3 with the slip, shaking with 悟空 inside, popped on 4
      const shake = b > 4.8 && b < 6.4 ? 0.14 * Math.sin(t * 34) * (1 - 0.4 * ((b - 4.8) % 1)) : 0, sealed = b >= 4.8 && b < 6.4, slip = b >= 4.8 && b < 6.4 ? XY.smooth((b - 4.8) / 0.15) : 0;
      silverHorn(g, SH[0], SH[1], t, K.bump(b, 1.6, 1.8, 2.6, 2.9)); gourd(g, GOURD[0], GOURD[1], 0.92 + shake, sealed, slip);
      [[-80, -84], [-40, -100]].forEach(([hx, hy]) => { g.beginPath(); g.ellipse(SH[0] + hx, SH[1] + hy, 6, 5, 0, 0, TAU); g.fillStyle = GLAZE; g.fill(); g.strokeStyle = CB; g.lineWidth = 1.4; g.stroke(); });   // his fingers over the gourd
      // ---- 「者行孙」 flies out of the gourd, 「哎」 answers on beat 2
      const H0 = e.at('wukong.head', acts);
      g.fillStyle = CB; g.font = XY.font(42, XY.cnFont.kai, 'bold'); g.textAlign = 'center'; g.textBaseline = 'middle';
      '者行孙'.split('').forEach((ch, k) => { const f = XY.clamp((b - 1.8 - k * 0.25) / 0.8); if (f <= 0 || b > 3.3) return;
        const x = XY.lerp(GOURD[0] - 20, H0[0] - 60 + k * 48, f), y = XY.lerp(GOURD[1] + 20, H0[1] - 96 + k * 6, f) - 60 * Math.sin(f * Math.PI); g.save(); g.translate(x, y); g.rotate(0.3 * Math.sin(t * 6 + k)); g.fillText(ch, 0, 0); g.restore(); });
      if (b > 3.1 && b < 3.5) { const s = K.back((b - 3.1) / 0.14); g.save(); g.translate(H0[0] + 18, H0[1] - 44); g.scale(s, s); g.font = XY.font(40, XY.cnFont.kai, 'bold'); g.fillText('哎', 0, 0); g.restore(); }
      g.textAlign = 'left'; g.textBaseline = 'alphabetic';
      // ---- the pilgrims in cobalt; 悟空 is drawn on his own path while the gourd has him
      const gone = b > 3.3 && b < 7.0, [cv, lg] = K.layer(e, 'bw-proc');
      XY.drawProcession(lg, e.phase, e.procX, e.groundY, PEN, gone ? K.cast(acts, { wukong: false }) : acts);
      const f = (b - 3.3) / 1.1, home = K.home(e, 'wukong');
      if (f > 0 && f < 1) { const q = XY.easeIn(f), a = q * TAU * 2, rr = 80 * q * (1 - q) * 4, x = XY.lerp(home[0], GOURD[0], q) + Math.cos(a) * rr, y = XY.lerp(home[1] - 60, GOURD[1], q) + Math.sin(a) * rr * 0.6, s = XY.lerp(1, 0.04, Math.pow(q, 0.7));
        lg.save(); lg.translate(x, y); lg.rotate(q * TAU * 2.5); lg.scale(1, 1 + 0.6 * q); K.fig(lg, e, acts, 'wukong', PEN, 0, 60 * s, { s }); lg.restore(); }
      K.blitSoft(g, cv, 6, 0.45, 'source-over', 'bw-soft'); K.blit(g, cv);
      // ---- the suction: a cobalt vortex from the gourd mouth
      if (b > 3.15 && b < 4.6) { const a0 = XY.clamp((b - 3.15) / 0.15) * (1 - XY.clamp((b - 4.4) / 0.2)); g.save(); g.globalAlpha = a0; g.strokeStyle = CB2; g.lineWidth = 2;
        for (let k = 0; k < 4; k++) { g.lineWidth = 3 - k * 0.5; g.beginPath(); for (let q = 0; q <= 40; q++) { const s = q / 40, ang = s * TAU * 1.6 + t * 9 + k * TAU / 6, r = 8 + s * 150, cx = XY.lerp(GOURD[0], home[0], s * 0.8), cy = XY.lerp(GOURD[1], home[1] - 60, s * 0.8);
          const x = cx + Math.cos(ang) * r * 0.5, y = cy + Math.sin(ang) * r * 0.3; q ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke(); } g.restore(); }
      // ---- out he comes on beat 4 as a tiny insect, back in line on 4.5
      if (b > 6.4 && b < 7.0) { const q = (b - 6.4) / 0.6, x = XY.lerp(GOURD[0], home[0], q) + 30 * Math.sin(q * 20), y = XY.lerp(GOURD[1], home[1] - 80, q) + 20 * Math.cos(q * 17), w = Math.sin(t * 60);
        g.fillStyle = CB; for (let k = 1; k < 8; k++) { const qq = Math.max(0, q - k * 0.03); g.beginPath(); g.arc(XY.lerp(GOURD[0], home[0], qq) + 30 * Math.sin(qq * 20), XY.lerp(GOURD[1], home[1] - 80, qq) + 20 * Math.cos(qq * 17), 1.2, 0, TAU); g.fill(); }
        g.beginPath(); g.ellipse(x, y, 7, 4.4, 0, 0, TAU); g.fill(); g.strokeStyle = CB; g.lineWidth = 1.4; g.beginPath(); g.ellipse(x - 4, y - 6, 6, 2.8 + 2 * w, -0.6, 0, TAU); g.ellipse(x + 4, y - 6, 6, 2.8 - 2 * w, 0.6, 0, TAU); g.stroke();
        if (b < 6.6) { const p = XY.clamp((b - 6.4) / 0.2); g.fillStyle = '#6A1E18'; g.fillRect(GOURD[0] - 30 * p, GOURD[1] + 30 * p - 60 * p * (1 - p), 16, 7); } }
      if (b > 6.95 && b < 7.45) { const p = (b - 6.95) / 0.5; g.save(); g.globalAlpha = 1 - p; ruyi(g, home[0] - 10, home[1] - 70, 0.6 + 0.8 * p, t); g.restore(); }
      // ---- glaze: a soft window reflection drifting over the plaque
      { const x = ((t * 40) % (W + 900)) - 450, gr = g.createLinearGradient(x - 140, 0, x + 140, 140); gr.addColorStop(0, 'rgba(255,255,255,0)'); gr.addColorStop(0.5, 'rgba(255,255,255,0.28)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
        g.save(); g.globalCompositeOperation = 'screen'; g.fillStyle = gr; g.fillRect(0, 0, W, H); g.restore(); }
      // ---- entry: unfired cobalt is grey-black and the glaze matte; the kiln glow fires it from the centre out
      const fire = XY.clamp((u + 0.4) / 0.3);
      if (fire < 1) { const R0 = 760 * XY.easeIn(fire), cx = W / 2, cy = 400;
        g.save(); g.beginPath(); g.rect(0, 0, W, H); g.arc(cx, cy, Math.max(1, R0), 0, TAU, true); g.clip('evenodd');
        g.globalCompositeOperation = 'saturation'; g.fillStyle = '#808080'; g.fillRect(0, 0, W, H);
        g.globalCompositeOperation = 'multiply'; g.fillStyle = 'rgba(150,146,140,1)'; g.fillRect(0, 0, W, H);
        g.globalCompositeOperation = 'source-over'; g.fillStyle = 'rgba(236,232,224,0.35)'; g.fillRect(0, 0, W, H); g.restore();
        const gr = g.createRadialGradient(cx, cy, Math.max(0, R0 - 60), cx, cy, R0 + 10); gr.addColorStop(0, 'rgba(255,140,60,0)'); gr.addColorStop(0.8, 'rgba(255,140,60,0.55)'); gr.addColorStop(1, 'rgba(255,140,60,0)');
        g.save(); g.globalCompositeOperation = 'screen'; g.fillStyle = gr; g.fillRect(0, 0, W, H); g.restore(); }
    },
  };
})();
