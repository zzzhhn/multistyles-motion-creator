// s21 大雪 · 中国描金漆画. Black lacquer ground; forms are drawn in fine gold line (描金), with graded gold dust (晕金/泥金)
// and scattered gold flecks (洒金), a few areas in vermilion lacquer (朱漆); key-fret (回纹) border with 如意 cloud corners
// and a begonia-shaped (海棠) vermilion cartouche. Moment (虎始交): two gold tigers in the Chinese manner (王 on the brow,
// gold-lined stripes) circle in the snow and rub cheeks; the 寒号鸟 on the old 槐 shuts its beak; 马蔺 pushes out of the snow.
// Unit (8 s = 3 bars, one pentad per bar): 鹖鴠不鸣 the bird calls, then shuts its beak on beat 3 and fluffs up shivering;
// 虎始交 (key) two snarling tigers pad in from the ends of the field and meet cheek to cheek on beat 3 (4.0 s) in a burst of
// gold dust, then circle rubbing; 荔挺出 clump after clump of 马蔺 blades push up through the snow.
(function () {
  const JQ = window.JQ, S = JQ.SCENE, L = JQ.L, W = JQ.W, H = JQ.H, TAU = Math.PI * 2;
  const BAR = 8 / 3, IMP = BAR + 4 / 3, HOU = JQ.TERMS[20].hou;
  const LAC = '#0C0907', GOLD = '#E3B856', GOLD2 = '#B8862F', SNOW = '#F1ECE0', SNOW2 = '#B9BFC6', VERM = '#B3301E', EMER = '#1F4A3A', EMER2 = '#2C5E48',
    LAZ = '#13274A', OCH = '#C98A34', OCH2 = '#EED7A0', PLUM = '#5B1E2A';
  const FONT = '"Kaiti SC", "STKaiti", "Songti SC", serif';
  if (document.fonts) document.fonts.load(`80px ${FONT}`, '大雪虎始交');
  const fillP = (g, path, c, lw, lc = GOLD) => { if (c) { g.fillStyle = c; g.fill(path); } if (lw) { g.strokeStyle = lc; g.lineWidth = lw; g.lineJoin = 'round'; g.lineCap = 'round'; g.stroke(path); } };
  // 描金 contour: fine gold lines running parallel to an edge (open polyline), stepping into the form on `side`
  const hatch = (g, pts, side, len, step, seed = 1, col = GOLD, lw = 1.1) => {
    const P = JQ.resample(pts, Math.max(4, step), false), n = Math.max(1, Math.round(len / 7));
    g.strokeStyle = col; g.lineCap = 'round'; g.lineJoin = 'round';
    for (let k = 0; k < n; k++) {
      const off = 3 + k * 5.5; g.globalAlpha = 1 - k / (n + 0.5); g.lineWidth = lw * (1 - k * 0.12); g.beginPath();
      for (let i = 0; i < P.length; i++) { const a = P[Math.max(0, i - 1)], b = P[Math.min(P.length - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], d = Math.hypot(dx, dy) || 1;
        const o = off * (0.85 + 0.3 * JQ.noise(i * 0.3, k, seed)); const x = P[i][0] - dy / d * side * o, y = P[i][1] + dx / d * side * o; i ? g.lineTo(x, y) : g.moveTo(x, y); }
      g.stroke();
    }
    g.globalAlpha = 1;
  };
  // 洒金: irregular gold flecks scattered over a region
  const flecks = (g, n, x0, y0, x1, y1, seed, a = 0.8) => { for (let i = 0; i < n; i++) { const x = x0 + JQ.hash(i, seed) * (x1 - x0), y = y0 + JQ.hash(i, seed + 1) * (y1 - y0), r = 0.8 + Math.pow(JQ.hash(i, seed + 2), 3) * 3.4;
    g.fillStyle = JQ.rgba(JQ.hash(i, seed + 3) < 0.7 ? '#E3B856' : '#F4DC98', a * (0.35 + 0.65 * JQ.hash(i, seed + 4))); g.beginPath(); g.ellipse(x, y, r, r * (0.5 + 0.5 * JQ.hash(i, seed + 5)), JQ.hash(i, seed + 6) * 3, 0, TAU); g.fill(); } };
  const topEdge = (pts, x0, x1) => { // upper silhouette of a closed shape, sampled in x
    const out = []; for (let x = x0; x <= x1; x += 8) { let best = 1e9; for (let i = 0; i < pts.length; i++) { const a = pts[i], b = pts[(i + 1) % pts.length]; if ((a[0] - x) * (b[0] - x) <= 0 && a[0] !== b[0]) { const y = a[1] + (b[1] - a[1]) * (x - a[0]) / (b[0] - a[0]); if (y < best) best = y; } } if (best < 1e9) out.push([x, best]); } return out;
  };

  // ---------------------------------------------------------------- static background (cached)
  const buildBg = g => {
    g.fillStyle = LAC; g.fillRect(0, 0, W, H);
    const v = g.createRadialGradient(W / 2, H * 0.55, 200, W / 2, H * 0.55, 1200); v.addColorStop(0, 'rgba(60,30,18,0.0)'); v.addColorStop(1, 'rgba(40,14,8,0.35)'); g.fillStyle = v; g.fillRect(0, 0, W, H);
    // a thin gold moon; 洒金 across the night sky
    g.fillStyle = GOLD; g.beginPath(); g.arc(1120, 150, 34, 0, TAU); g.arc(1134, 140, 30, 0, TAU, true); g.fill('evenodd');
    flecks(g, 260, 60, 60, 1860, 300, 51, 0.75);
    // mountains: black lacquer, ridge drawn in gold, graded gold dust (晕金) under the ridge, long gold texture strokes (披麻皴)
    fillP(g, S.mountains.path, '#130E0B');
    g.save(); g.clip(S.mountains.path);
    for (let x = 0; x < W; x += 6) { const i = Math.min(S.ridge.pts.length - 1, Math.round(x / W * (S.ridge.pts.length - 1))), y = S.ridge.pts[i][1]; const gr = g.createLinearGradient(0, y, 0, y + 70); gr.addColorStop(0, 'rgba(227,184,86,0.55)'); gr.addColorStop(1, 'rgba(227,184,86,0)'); g.fillStyle = gr; g.fillRect(x, y, 6, 72); }
    g.strokeStyle = GOLD2; g.lineWidth = 1; g.lineCap = 'round';
    for (let i = 2; i < S.ridge.pts.length - 2; i += 3) { const [x, y] = S.ridge.pts[i]; for (let k = 0; k < 2; k++) { const x0 = x + k * 9, l = 60 + JQ.hash(i, k, 7) * 80; g.beginPath(); g.moveTo(x0, y + 8); g.quadraticCurveTo(x0 - 18, y + l * 0.5, x0 - 6 + (JQ.hash(i, k, 8) - 0.5) * 30, y + l); g.stroke(); } }
    g.restore();
    g.strokeStyle = SNOW; g.lineWidth = 4; g.lineJoin = 'round'; g.stroke(S.ridge.path);
    g.strokeStyle = GOLD; g.lineWidth = 1.6; g.save(); g.translate(0, 4); g.stroke(S.ridge.path); g.restore();
    fillP(g, S.hills.path, '#2A1A12');
    hatch(g, S.hills.pts.slice(0, -2), 1, 8, 9, 5, GOLD2, 1); flecks(g, 220, 40, 640, 1880, 1040, 61, 0.55);
    // ground stays black lacquer; snow lies on it as white-lacquer drifts edged in gold line
    fillP(g, S.ground.path, '#120C08'); fillP(g, S.field.path, '#1A120C');
    g.save(); g.clip(S.field.path);
    S.furrows.forEach((f, i) => { if (i % 2) return; const P = f.pts, th = 3 + (i % 3) * 2; const up = JQ.resample(P, 30, false).map(([x, y], j) => [x, y - th + Math.sin(j * 0.9 + i) * 2]);
      g.fillStyle = i % 4 ? SNOW : '#DCE0E6'; g.fill(JQ.P([...up, ...P.slice().reverse()])); hatch(g, up, 1, 5, 6, 70 + i, GOLD2, 0.8); });
    g.restore();
    const drift = (y0, amp, h, seed, x0 = -40, x1 = W + 40) => { const top = [], bot = [];
      for (let x = x0; x <= x1; x += 20) { const e = x0 < 0 && x1 > W ? 1 : Math.pow(Math.sin(Math.PI * (x - x0) / (x1 - x0)), 0.45); top.push([x, y0 - (Math.abs(Math.sin(x * 0.006 + seed)) * amp + JQ.noise(x * 0.01, seed) * 14) * e + (1 - e) * h * 0.5]); bot.push([x, y0 + h * (0.5 + 0.5 * e)]); }
      const p = JQ.smoothPath([...top, ...bot.reverse()]); fillP(g, p, SNOW); g.save(); g.clip(p); g.fillStyle = 'rgba(150,170,200,0.45)'; g.fillRect(x0, y0 + h * 0.45, x1 - x0, h); g.restore(); hatch(g, top, 1, 10, 5, seed * 7, GOLD, 0.9); };
    drift(668, 22, 40, 1); drift(748, 16, 26, 2, -40, 640); drift(1046, 30, 60, 3); drift(866, 18, 30, 4, 1300, 1450); drift(944, 22, 40, 5, 1680, W + 40);
    fillP(g, S.path.path, '#2A1E16'); g.strokeStyle = SNOW; g.lineWidth = 3; g.stroke(S.path.path);
    // the frozen stream and pond: lapis ice with gold rings and a snow rim
    fillP(g, S.stream.path, LAZ, 1.4);
    fillP(g, S.pondRim.path, SNOW); fillP(g, S.pond.path, LAZ, 2, GOLD);
    g.save(); g.clip(S.pond.path); const P0 = L.pond;
    g.strokeStyle = GOLD; g.lineWidth = 1.3; for (let r = 0, y = P0.cy - P0.ry; y < P0.cy + P0.ry + 20; y += 17, r++) for (let x = P0.cx - P0.rx - 20 + (r % 2) * 17; x < P0.cx + P0.rx + 20; x += 34) { g.beginPath(); g.arc(x, y, 16, Math.PI * 1.05, Math.PI * 1.95); g.stroke(); g.beginPath(); g.arc(x, y + 2, 9, Math.PI * 1.15, Math.PI * 1.85); g.stroke(); }
    g.restore();
    // bridge: ochre stone, snow deck, gold edge
    fillP(g, S.bridge.path, '#7A3B1C', 1.6); hatch(g, S.bridgeArch.pts.slice().sort((a, b) => a[0] - b[0]), -1, 12, 7, 9);
    g.fillStyle = SNOW; g.fillRect(L.bridge.cx - L.bridge.half - 20, L.bridge.deckY - 8, L.bridge.half * 2 + 40, 10);
    // farmhouse: vermilion gate, lacquer walls ruled in gold, snow-white roof
    fillP(g, S.houseFront.path, '#6E3A1E', 1.2); fillP(g, S.window.path, GOLD); g.strokeStyle = LAC; g.lineWidth = 2; for (let x = 1736; x < 1800; x += 16) { g.beginPath(); g.moveTo(x, 556); g.lineTo(x, 594); g.stroke(); }
    fillP(g, S.roof.path, SNOW); S.roofLines.forEach((r, i) => { if (i % 2) { g.strokeStyle = SNOW2; g.lineWidth = 1.6; g.stroke(r.path); } });
    g.strokeStyle = GOLD; g.lineWidth = 1.4; g.stroke(S.roof.path);
    fillP(g, S.chimney.path, '#3A1E12', 1.2); g.fillStyle = SNOW; g.fillRect(1556, L.house.ridgeY - 60, 38, 10);
    fillP(g, S.wall.path, '#8A4A22'); hatch(g, [[1440, 610], [1920, 610]], 1, 26, 6, 13); hatch(g, [[1446, 610], [1446, 812]], 1, 16, 7, 14, GOLD2);
    fillP(g, S.wallCap.path, SNOW);
    fillP(g, S.gate.path, VERM, 1.6); hatch(g, S.gate.pts.slice(1, 4), 1, 14, 6, 15);
    fillP(g, S.gateRoof.path, SNOW, 1.4);
    // the old 槐: black-brown limbs with snow on their upper side, gold line along the lit side
    g.strokeStyle = '#2B1A10'; JQ.drawBranches(g, 5, 0.9);
    g.lineCap = 'round'; for (const b of S.branches) { if (b.depth > 3) continue; g.strokeStyle = GOLD; g.lineWidth = 0.9; g.beginPath(); g.moveTo(b.x1 - b.w * 0.3, b.y1); g.lineTo(b.x2 - b.w * 0.3, b.y2); g.stroke();
      if (b.depth <= 2) { g.strokeStyle = SNOW; g.lineWidth = Math.max(1.2, b.w * 0.26); g.beginPath(); g.moveTo(b.x1, b.y1 - b.w * 0.4); g.lineTo(b.x2, b.y2 - b.w * 0.4); g.stroke(); } }
    fillP(g, S.trunk.path, '#2B1A10');
    hatch(g, S.trunk.pts.slice(0, 17), -1, 14, 5, 17); g.fillStyle = SNOW; g.beginPath(); g.ellipse(470, 834, 120, 16, 0, 0, TAU); g.fill();
  };
  // ---------------------------------------------------------------- 回纹 frame, 如意 cloud corners, 海棠 cartouche (cached)
  const buildFront = g => {
    g.fillStyle = LAC; g.beginPath(); g.rect(0, 0, W, H); g.rect(54, 54, W - 108, H - 108); g.fill('evenodd');
    g.strokeStyle = GOLD; g.lineWidth = 2.4; g.strokeRect(12, 12, W - 24, H - 24); g.strokeRect(46, 46, W - 92, H - 92); g.lineWidth = 1; g.strokeRect(52, 52, W - 104, H - 104);
    // continuous key fret (回纹) between the rules: each unit a squared spiral, linked to the next
    const fret = (x, y, s, rot) => { g.save(); g.translate(x, y); g.rotate(rot); g.beginPath();
      g.moveTo(-s / 2, s / 2); g.lineTo(-s / 2, -s / 2); g.lineTo(s / 2, -s / 2); g.lineTo(s / 2, s * 0.3); g.lineTo(-s * 0.22, s * 0.3); g.lineTo(-s * 0.22, -s * 0.2); g.lineTo(s * 0.24, -s * 0.2); g.lineTo(s * 0.24, s * 0.06);
      g.moveTo(s / 2, s / 2); g.lineTo(-s / 2, s / 2); g.stroke(); g.restore(); };
    g.strokeStyle = GOLD; g.lineWidth = 2; g.lineJoin = 'miter'; g.lineCap = 'butt';
    for (let x = 110; x < W - 100; x += 28) { fret(x, 29, 22, 0); fret(x, H - 29, 22, Math.PI); }
    for (let y = 110; y < H - 100; y += 28) { fret(29, y, 22, -Math.PI / 2); fret(W - 29, y, 22, Math.PI / 2); }
    // 如意 cloud heads in the corners, on vermilion lacquer squares
    const ruyi = (x, y, s) => { g.save(); g.translate(x, y); g.scale(s, s); const p = new Path2D();
      p.moveTo(0, 18); p.bezierCurveTo(-30, 4, -26, -20, -10, -14); p.bezierCurveTo(-18, -32, 18, -32, 10, -14); p.bezierCurveTo(26, -20, 30, 4, 0, 18); p.closePath();
      g.fillStyle = GOLD; g.fill(p); g.strokeStyle = VERM; g.lineWidth = 2 / s; g.beginPath(); g.arc(-12, -6, 5, 0.5, 5.6); g.stroke(); g.beginPath(); g.arc(12, -6, 5, -2.5, 2.6); g.stroke(); g.beginPath(); g.arc(0, -18, 5, 2.2, 7); g.stroke(); g.restore(); };
    [[29, 29], [W - 29, 29], [29, H - 29], [W - 29, H - 29]].forEach(([x, y]) => { g.fillStyle = VERM; g.fillRect(x - 25, y - 25, 50, 50); g.strokeStyle = GOLD; g.lineWidth = 1.6; g.strokeRect(x - 21, y - 21, 42, 42); ruyi(x, y + 2, 0.8); });
    // the cartouche: a 海棠 (four-lobed begonia) window in vermilion lacquer, gold-ruled, with a thin 缠枝 scroll inside the rim
    const cx = 1560, cy = 170, wei = (hw, hh, r) => { const p = new Path2D(), x0 = cx - hw, x1 = cx + hw, y0 = cy - hh, y1 = cy + hh;
      p.moveTo(x0 + r, y0); p.lineTo(x1 - r, y0); p.arc(x1, y0, r, Math.PI, Math.PI / 2, true); p.lineTo(x1, y1 - r); p.arc(x1, y1, r, -Math.PI / 2, Math.PI, true);
      p.lineTo(x0 + r, y1); p.arc(x0, y1, r, 0, -Math.PI / 2, true); p.lineTo(x0, y0 + r); p.arc(x0, y0, r, Math.PI / 2, 0, true); p.closePath(); return p; };
    fillP(g, wei(236, 104, 30), VERM, 3); fillP(g, wei(222, 90, 24), null, 1.2);
    g.strokeStyle = GOLD; g.lineWidth = 1.1; for (let i = 0; i < 4; i++) { const sx = i % 2 ? 1 : -1, sy = i < 2 ? -1 : 1, x = cx + sx * 196, y = cy + sy * 66; g.beginPath(); g.arc(x, y, 9, 0, TAU * 0.8); g.stroke(); g.beginPath(); g.moveTo(x - sx * 10, y); g.quadraticCurveTo(x - sx * 30, y - sy * 16, x - sx * 52, y - sy * 4); g.stroke(); }
    g.fillStyle = GOLD; g.textAlign = 'center'; g.textBaseline = 'alphabetic';
    g.font = `88px ${FONT}`; g.fillText('大　雪', cx, cy + 18);
  };
  // the pentad in gold under the title, laid on character by character at the head of each bar (描金: outline first, then fill)
  const houText = (g, t, h) => {
    const chars = [...HOU[h]], b0 = h * BAR, n = chars.length, step = 52, x0 = 1560 - (n - 1) * step / 2;
    g.textAlign = 'center'; g.textBaseline = 'alphabetic'; g.font = `44px ${FONT}`; g.lineWidth = 1.2; g.strokeStyle = GOLD; g.fillStyle = GOLD;
    chars.forEach((ch, i) => { const k = h ? JQ.clamp((t - b0 - 0.04 - i * 0.1) / 0.16) : 1; if (k <= 0) return;
      g.globalAlpha = Math.min(1, k * 2); g.strokeText(ch, x0 + i * step, 240); g.globalAlpha = JQ.smooth(0.4, 1, k); g.fillText(ch, x0 + i * step, 240); });
    g.globalAlpha = 1;
  };

  // ---------------------------------------------------------------- the tigers, Chinese-painting manner (facing right at dir = 1):
  // compact powerful body, big round head with 王 on the brow, white ruff and muzzle, gold body (泥金) with black stripes ruled in gold
  const TB = JQ.smoothPath([[-96, -112], [-50, -124], [0, -120], [50, -130], [86, -140], [110, -146], [132, -120], [130, -90], [112, -60], [80, -52], [30, -56], [-20, -58], [-60, -62], [-92, -70], [-116, -86], [-120, -104]]);
  const THEAD = JQ.smoothPath([[124, -150], [130, -180], [156, -192], [184, -182], [204, -160], [210, -140], [200, -122], [176, -112], [146, -110], [126, -124]]);
  const TBACK = [[-112, -108], [-50, -122], [0, -118], [50, -128], [86, -138], [108, -144]];
  const tleg = (g, P, w0, w1, ph, o) => {
    const sw = Math.sin(ph + o) * 10, lf = Math.max(0, Math.cos(ph + o)) * 8, Q = P.map(([u, v], i) => i === 0 ? [u, v] : [u + sw * (i / (P.length - 1)), v - lf * (i === P.length - 1 ? 1 : 0.5)]);
    g.lineCap = 'round'; g.lineJoin = 'round';
    for (const [c, k] of [[GOLD, 2.4], [OCH, 0]]) for (let i = 0; i < Q.length - 1; i++) { g.strokeStyle = c; g.lineWidth = JQ.lerp(w0, w1, i / (Q.length - 1)) + k; g.beginPath(); g.moveTo(...Q[i]); g.lineTo(...Q[i + 1]); g.stroke(); }
    g.strokeStyle = LAC; g.lineWidth = 3.4; g.lineCap = 'butt'; for (let i = 1; i < Q.length - 1; i++) { const [u, v] = Q[i]; for (const dv of [-18, -8]) { g.beginPath(); g.moveTo(u - w1 * 0.55, v + dv); g.lineTo(u + w1 * 0.2, v + dv - 3); g.stroke(); } } g.lineCap = 'round';
    const pw = Q[Q.length - 1]; g.fillStyle = OCH2; g.beginPath(); g.ellipse(pw[0] + 6, pw[1] - 5, 15, 7, 0, 0, TAU); g.fill(); g.strokeStyle = GOLD; g.lineWidth = 1; g.stroke();
  };
  const stripe = (g, x0, y0, x1, y1, w) => { const p = new Path2D(); p.moveTo(x0 - w, y0); p.quadraticCurveTo((x0 + x1) / 2 + w * 2.2, (y0 + y1) / 2, x1, y1); p.quadraticCurveTo((x0 + x1) / 2 - w * 0.6, (y0 + y1) / 2, x0 + w, y0); p.closePath(); g.fillStyle = LAC; g.fill(p); g.strokeStyle = GOLD; g.lineWidth = 0.8; g.stroke(p); };
  const tiger = (g, x, y, dir, ph, nuzzle, s, jaw = 0.8) => {
    g.save(); g.translate(x, y); g.scale(dir * s, s);
    const FL = [[84, -90], [92, -46], [96, 0]], HL = [[-92, -96], [-72, -54], [-100, -26], [-92, 0]];
    g.save(); g.translate(110, 0); g.scale(0.84, 1); g.translate(-110, 0);
    tleg(g, HL.map(([u, v]) => [u + 16, v]), 26, 15, ph, Math.PI); tleg(g, FL.map(([u, v]) => [u + 16, v]), 24, 15, ph, 0);
    const tail = JQ.smoothPath([[-118, -100], [-156, -92], [-184, -116], [-180, -160], [-156, -178]], false);
    g.lineCap = 'round'; g.strokeStyle = GOLD; g.lineWidth = 13; g.stroke(tail); g.strokeStyle = OCH; g.lineWidth = 10; g.stroke(tail); g.setLineDash([8, 9]); g.strokeStyle = LAC; g.lineWidth = 10.5; g.stroke(tail); g.setLineDash([]);
    const bg = g.createLinearGradient(0, -146, 0, -52); bg.addColorStop(0, '#F0CC70'); bg.addColorStop(0.55, OCH); bg.addColorStop(0.85, OCH2); bg.addColorStop(1, OCH2);
    fillP(g, TB, bg, 1.6);
    g.save(); g.clip(TB);
    for (let i = 0; i < 12; i++) { const sx = -112 + i * 21; stripe(g, sx, -152, sx + 6 + (i % 2) * 8, -72 - (i % 3) * 10, 9 - Math.abs(i - 5.5) * 0.45); if (i % 2) stripe(g, sx + 10, -152, sx + 14, -124, 4); }
    g.restore();
    hatch(g, TBACK, 1, 8, 5, 31, GOLD, 1);
    tleg(g, HL, 28, 16, ph, 0); tleg(g, FL, 26, 16, ph, Math.PI);
    g.restore();
    // head, tilted toward the other tiger while they rub cheeks; 吊睛白额: upswept eyes under a heavy brow, white forehead, jaws open
    g.save(); g.translate(132, -132); g.rotate(-0.08 - nuzzle * 0.16); g.translate(-132, 132);
    [[144, -184], [178, -186]].forEach(([u, v]) => { g.fillStyle = OCH; g.beginPath(); g.arc(u, v, 8.5, 0, TAU); g.fill(); g.strokeStyle = GOLD; g.lineWidth = 1.2; g.stroke(); g.fillStyle = LAC; g.beginPath(); g.arc(u, v + 1, 3.6, 0, TAU); g.fill(); });
    const ruff = []; for (let i = 0; i <= 14; i++) { const a = Math.PI * 0.35 + i / 14 * Math.PI * 0.9, r = i % 2 ? 46 : 34; ruff.push([150 + Math.cos(a) * r, -134 + Math.sin(a) * r * 0.8]); } fillP(g, JQ.P([[150, -134], ...ruff]), SNOW, 1.2);
    // lower jaw first, dropped open, then the mouth's dark red inside and the fangs
    const jw = jaw * 16, lower = JQ.smoothPath([[176, -124], [200, -126 + jw * 0.6], [214, -122 + jw], [204, -112 + jw], [180, -112]]);
    g.fillStyle = '#4A0E0C'; g.beginPath(); g.moveTo(180, -128); g.lineTo(214, -134); g.lineTo(214, -122 + jw); g.lineTo(184, -118); g.closePath(); g.fill();
    fillP(g, lower, OCH2, 1.2);
    const hg = g.createLinearGradient(0, -192, 0, -110); hg.addColorStop(0, '#F0CC70'); hg.addColorStop(1, OCH); fillP(g, THEAD, hg, 1.6);
    g.save(); g.clip(THEAD);
    g.fillStyle = SNOW; g.beginPath(); g.ellipse(150, -120, 28, 15, 0.2, 0, TAU); g.fill(); g.beginPath(); g.ellipse(164, -177, 22, 10, -0.15, 0, TAU); g.fill();
    [[132, -150, 0.9], [134, -166, 0.6], [140, -136, 1.2], [200, -168, -0.7]].forEach(([u, v, a]) => { g.save(); g.translate(u, v); g.rotate(a); g.fillStyle = LAC; g.fillRect(-2.5, -9, 5, 18); g.restore(); });
    g.restore();
    g.fillStyle = SNOW; [[200, -130, 200, -118 + jw * 0.3], [210, -132, 209, -121 + jw * 0.3]].forEach(([a, b, c, d]) => { g.beginPath(); g.moveTo(a - 3.5, b); g.lineTo(a + 3.5, b); g.lineTo(c, d); g.closePath(); g.fill(); });
    g.beginPath(); g.moveTo(203, -112 + jw); g.lineTo(209, -112 + jw); g.lineTo(206, -121 + jw * 0.7); g.closePath(); g.fill();
    // 王 on the white brow
    g.strokeStyle = LAC; g.lineWidth = 3.2; g.lineCap = 'butt'; g.beginPath(); g.moveTo(152, -183); g.lineTo(172, -183); g.moveTo(154, -176); g.lineTo(170, -176); g.moveTo(150, -168); g.lineTo(174, -168); g.moveTo(162, -184); g.lineTo(162, -168); g.stroke();
    // upswept almond eye, amber with a slit pupil, and a heavy black brow raked upward
    const eye = new Path2D(); eye.moveTo(172, -152); eye.quadraticCurveTo(184, -164, 199, -165); eye.quadraticCurveTo(190, -150, 172, -152); eye.closePath();
    g.fillStyle = '#F2C640'; g.fill(eye); g.strokeStyle = LAC; g.lineWidth = 1.8; g.stroke(eye); g.fillStyle = LAC; g.beginPath(); g.ellipse(187, -157, 1.8, 4.6, 0.3, 0, TAU); g.fill();
    g.lineCap = 'round'; g.lineWidth = 4.2; g.beginPath(); g.moveTo(168, -160); g.quadraticCurveTo(184, -168, 202, -176); g.stroke();
    g.lineWidth = 2.2; g.beginPath(); g.moveTo(198, -142); g.lineTo(196, -130); g.stroke();
    g.fillStyle = VERM; g.beginPath(); g.ellipse(209, -141, 5.5, 4, 0, 0, TAU); g.fill();
    g.strokeStyle = GOLD; g.lineWidth = 0.9; for (let k = 0; k < 3; k++) { g.beginPath(); g.moveTo(198, -134 + k * 3); g.lineTo(232, -142 + k * 5); g.stroke(); }
    g.restore();
    g.restore();
  };
  // ---------------------------------------------------------------- 寒号鸟 on a limb of the 槐: a ragged, crested black-lacquer bird with
  // long hanging tail streamers; it calls (gold sound rings) until beat 3 of bar 1, then shuts its beak, fluffs up and shivers
  // perch on the left of the crown, clear of the engine's title strip (x 530–1390, y 90–320, 0.15–2.25 s)
  const PERCH = S.branches.filter(b => b.depth >= 1 && b.depth <= 2).reduce((a, b) => Math.hypot(b.x2 - 400, b.y2 - 330) < Math.hypot(a.x2 - 400, a.y2 - 330) ? b : a);
  const bird = (g, t) => {
    const o = 1 - JQ.smooth(1.12, 4 / 3, t), shut = 1 - o, puff = 1 + 0.12 * shut, shiv = shut * Math.sin(t * 46) * 1.3;
    const bx = PERCH.x2 + 6, by = PERCH.y2 - 50;
    g.strokeStyle = '#2B1A10'; g.lineWidth = 8; g.lineCap = 'round'; g.beginPath(); g.moveTo(bx - 70, by + 52); g.lineTo(bx + 60, by + 46); g.stroke();
    g.strokeStyle = SNOW; g.lineWidth = 3; g.beginPath(); g.moveTo(bx - 66, by + 47); g.lineTo(bx - 20, by + 45); g.stroke();
    g.save(); g.translate(bx + shiv, by + 40); g.scale(1.25 * puff, 1.25 * puff); g.translate(-bx, -by - 40);
    [[-62, 128, 0], [-38, 136, 1]].forEach(([dx, dy, i]) => { const st = JQ.P([[bx - 16, by + 18], [bx + dx * 0.5, by + dy * 0.55], [bx + dx, by + dy], [bx + dx + 8, by + dy - 6], [bx + dx * 0.5 + 10, by + dy * 0.5], [bx - 2, by + 20]]);
      fillP(g, st, i ? '#2E1E14' : '#241812', 1); hatch(g, [[bx - 10, by + 22], [bx + dx * 0.55, by + dy * 0.6]], -1, 6, 4, 40 + i); });
    const body = JQ.smoothPath([[bx + 16, by - 30], [bx + 32, by - 4], [bx + 28, by + 26], [bx + 6, by + 42], [bx - 22, by + 32], [bx - 32, by + 4], [bx - 16, by - 26]]); fillP(g, body, '#241812', 1.2);
    g.save(); g.clip(body); g.fillStyle = '#4A3826'; g.beginPath(); g.ellipse(bx + 14, by + 16, 18, 26, -0.2, 0, TAU); g.fill();
    g.strokeStyle = GOLD2; g.lineWidth = 1; for (let r = 0; r < 4; r++) for (let k = 0; k < 3; k++) { g.beginPath(); g.arc(bx + 4 + k * 10 + (r % 2) * 5, by - 2 + r * 10, 5, 0.2, Math.PI - 0.2); g.stroke(); } g.restore();
    // ragged feather tips standing out all round (more of them once it fluffs up against the cold)
    g.strokeStyle = GOLD; g.lineWidth = 1; for (let i = 0; i < 16; i++) { const a = -1.2 + i / 15 * 3.6, r0 = 34, r1 = r0 + 4 + shut * 6 + JQ.hash(i, 44) * 4; g.beginPath(); g.moveTo(bx + Math.cos(a) * r0 * 0.9, by + 6 + Math.sin(a) * r0); g.lineTo(bx + Math.cos(a + 0.08) * r1 * 0.9, by + 6 + Math.sin(a + 0.08) * r1); g.stroke(); }
    const wing = JQ.smoothPath([[bx - 28, by - 14], [bx + 6, by - 22], [bx + 14, by + 2], [bx - 4, by + 28], [bx - 36, by + 30]]); fillP(g, wing, '#3A2616', 1.2);
    g.strokeStyle = GOLD; g.lineWidth = 1; for (let k = 0; k < 4; k++) { g.beginPath(); g.arc(bx - 24 + k * 9, by + 6 + k * 3, 9, 0.2, Math.PI - 0.2); g.stroke(); }
    const hx = bx + 22, hy = by - 40;
    g.strokeStyle = GOLD; g.lineWidth = 1.6; [[-30, -30], [-36, -18], [-22, -36]].forEach(([dx, dy]) => { g.beginPath(); g.moveTo(hx - 4, hy - 14); g.quadraticCurveTo(hx + dx * 0.4, hy + dy, hx + dx, hy + dy * 0.7); g.stroke(); });
    g.fillStyle = GOLD;
    g.beginPath(); g.moveTo(hx + 14, hy - 6); g.lineTo(hx + 38, hy - 3 - o * 6); g.lineTo(hx + 16, hy + 2); g.fill();
    g.beginPath(); g.moveTo(hx + 14, hy + 2); g.lineTo(hx + 34, hy + 2 + o * 14); g.lineTo(hx + 14, hy + 8); g.fill();
    const head = new Path2D(); head.arc(hx, hy, 20, 0, TAU); fillP(g, head, '#241812', 1.4);
    g.fillStyle = GOLD; g.beginPath(); g.arc(hx + 7, hy - 4, 5.5, 0, TAU); g.fill(); g.fillStyle = LAC; g.beginPath(); g.arc(hx + 8, hy - 4, 2.6, 0, TAU); g.fill();
    if (shut > 0.5) { g.fillStyle = '#241812'; g.beginPath(); g.arc(hx + 7, hy - 4, 6, Math.PI, TAU); g.fill(); g.strokeStyle = GOLD; g.lineWidth = 1.4; g.beginPath(); g.moveTo(hx + 1, hy - 4); g.lineTo(hx + 13, hy - 4); g.stroke(); }
    g.fillStyle = SNOW; g.beginPath(); g.ellipse(hx - 4, hy - 18, 12, 4.5, -0.2, 0, TAU); g.fill();
    g.restore();
    if (o > 0.05) { g.lineWidth = 2; for (let k = 0; k < 3; k++) { const q = (k / 3 + t * 1.6) % 1; g.strokeStyle = JQ.rgba('#E3B856', o * (1 - q)); g.beginPath(); g.arc(bx + 76, by - 64, 14 + q * 50, -0.55, 0.55); g.stroke(); } }
  };

  // ---------------------------------------------------------------- 马蔺: emerald sword blades pushing up out of snow mounds
  const CLUMPS = [[130, 990, 1], [340, 1036, 1.05], [580, 968, 0.9], [800, 1040, 1.1], [1050, 1036, 0.95], [1240, 996, 0.85]];   // clear of the family at the gate
  const iris = (g, t) => {
    CLUMPS.forEach(([x, y, s], ci) => {
      const t0 = 5.4 + [0, 3, 1, 4, 2, 5][ci] * 0.26, gr = 0.12 + 0.88 * JQ.ease(JQ.smooth(t0, t0 + 0.9, t));
      for (let i = 0; i < 7; i++) {
        const a = (i - 3) * 0.13 + (JQ.hash(i, ci, 71) - 0.5) * 0.12, h = 150 * s * (0.7 + 0.3 * JQ.hash(i, ci, 72)) * gr, bend = (i - 3) * 6 + Math.sin(t * Math.PI + i) * 3;
        const tip = [x + Math.sin(a) * h + bend, y - Math.cos(a) * h], mid = [x + Math.sin(a) * h * 0.5, y - h * 0.5];
        const blade = JQ.P([[x - 5, y], [mid[0] - 3.5, mid[1]], tip, [mid[0] + 3.5, mid[1]], [x + 5, y]]);
        fillP(g, blade, i % 2 ? EMER : EMER2); g.strokeStyle = GOLD; g.lineWidth = 0.9; g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(mid[0], mid[1], tip[0], tip[1]); g.stroke();
        if (gr < 0.98 || i % 3 === 0) { g.fillStyle = SNOW; g.beginPath(); g.ellipse(tip[0], tip[1] + 3, 6, 3.5, 0, 0, TAU); g.fill(); }
      }
      g.fillStyle = SNOW; g.beginPath(); g.ellipse(x, y + 2, 46 * s, 13 * s, 0, 0, TAU); g.fill();
      g.strokeStyle = SNOW2; g.lineWidth = 1.6; g.beginPath(); g.ellipse(x, y + 4, 40 * s, 9 * s, 0, 0.2, Math.PI - 0.2); g.stroke();
    });
  };

  // ---------------------------------------------------------------- the cast in coloured lacquer, gold-lined
  // the family in coloured lacquer: each part filled, ruled round in fine gold (描金), and the lit top of the body (coat,
  // cape, hide) worked in parallel gold lines. Taken from the story track every frame.
  const SK = '#E8C29A';
  const PENS = { woman: { skin: SK, hair: LAC, coat: EMER2, pants: LAZ, apron: OCH, hat: PLUM, scarf: PLUM, cape: OCH, eye: LAC },
    kid: { skin: SK, hair: LAC, coat: VERM, pants: LAZ, apron: OCH, hat: OCH, scarf: OCH, cape: OCH, eye: LAC },
    ox: { ox: '#6B2E1C', oxDark: '#2A120A', horn: SNOW, eye: LAC }, calf: { calf: '#9A5428', calfDark: '#2A120A', horn: SNOW, eye: LAC } };
  const PROPC = { straw: OCH, prop: '#5A2E18', metal: GOLD2, red: VERM, line: GOLD };
  const castFig = (g, it, seed) => {
    const pen = it.kind === 'actor' ? PENS[it.who] || {} : {}, s = JQ.STORY_S(it.y || 1000);
    let body = null;
    it.parts.forEach(p => { const c = pen[p.role] || PROPC[p.role]; if (!c) return; g.fillStyle = c; g.fill(p.path);
      if (p.role !== 'eye' && p.role !== 'line') { g.strokeStyle = GOLD; g.lineWidth = Math.max(1, 1.3 * s); g.lineJoin = 'round'; g.stroke(p.path); }
      if (['coat', 'cape', 'ox', 'calf'].includes(p.role) && (!body || p.pts.length > body.pts.length)) body = p; });
    if (body && it.kind === 'actor') { const xs = body.pts.map(q => q[0]), e = topEdge(body.pts, Math.min(...xs) + 5, Math.max(...xs) - 5);
      if (e.length > 2) hatch(g, e, 1, (it.who === 'ox' ? 22 : it.who === 'calf' ? 16 : 12) * s, 4, seed); }
  };
  const SNOWF = Array.from({ length: 70 }, (_, i) => ({ x: 60 + JQ.hash(i, 81) * 1800, ph: JQ.hash(i, 82), r: 1.6 + JQ.hash(i, 83) * 2.6 }));

  // 候二: apart and snarling at the two ends of the field, they pad in and meet cheek to cheek on beat 3, then circle, rubbing
  const TC = [900, 626], GAP = 236, D = 170;
  const tigers = (g, t) => {
    const [cx, cy] = TC, app = JQ.clamp((t - BAR + 0.05) / (IMP - BAR + 0.05)), p = Math.pow(app, 1.25), af = Math.max(0, t - IMP);
    const recoil = 9 * Math.sin(af * 9) * Math.exp(-af * 3.5), th = 0.62 * Math.sin(af * 1.15), sepX = D * (1 - p) + recoil;
    const nz = t < IMP ? JQ.smooth(IMP - 0.25, IMP, t) : 1 - Math.abs(th) / 0.9, ph = t > BAR - 0.05 ? (t - BAR) * TAU * 1.3 : Math.sin(t * 2.2) * 0.35;
    const A = { x: cx + (GAP + sepX) * Math.cos(th), y: cy + 30 * Math.sin(th), dir: -1, o: 0 }, B = { x: cx - (GAP + sepX) * Math.cos(th), y: cy - 8 - 30 * Math.sin(th), dir: 1, o: Math.PI };
    g.fillStyle = 'rgba(120,138,168,0.7)';
    [[A.x, 1], [B.x, -1]].forEach(([x1, sd]) => { for (let x = cx + sd * (GAP + D) + sd * 60, i = 0; sd * (x - x1) > -40 && i < 12; x -= sd * 26, i++) { g.beginPath(); g.ellipse(x, cy + 8 + (i % 2 ? 7 : -3), 7, 3.5, 0, 0, TAU); g.fill(); } });
    [A, B].sort((a, b) => a.y - b.y).forEach(T => tiger(g, T.x, T.y, T.dir, ph + T.o, nz, 1.18, 0.95 - 0.6 * nz));
    // the 槐's trunk stands nearer than the field: lay it back over the tigers
    fillP(g, S.trunk.path, '#2B1A10'); hatch(g, S.trunk.pts.slice(0, 17), -1, 14, 5, 17);
    const e = t - IMP;
    if (e > -0.02 && e < 0.9) { const k = Math.max(0, e) / 0.9, x = cx, y = cy - 168;
      const fg = g.createRadialGradient(x, y + 30, 0, x, y + 30, 140); fg.addColorStop(0, JQ.rgba('#F4DC98', 0.5 * (1 - k))); fg.addColorStop(1, JQ.rgba('#E3B856', 0)); g.fillStyle = fg; g.fillRect(x - 140, y - 110, 280, 280);
      g.strokeStyle = JQ.rgba('#F4DC98', 1 - k); g.lineWidth = 3; g.beginPath(); g.ellipse(x, y, 70 + k * 220, 40 + k * 110, 0, 0, TAU); g.stroke();
      for (let i = 0; i < 34; i++) { const a = JQ.hash(i, 91) * TAU, r = 70 + JQ.hash(i, 92) * 70 + k * (160 + JQ.hash(i, 93) * 170); g.fillStyle = JQ.rgba(i % 3 ? '#E3B856' : '#F4DC98', 1 - k);
        g.beginPath(); g.ellipse(x + Math.cos(a) * r, y + Math.sin(a) * r * 0.6, 3.4, 2.2, a, 0, TAU); g.fill(); } }
  };
  JQ.ART[21] = {
    key: IMP, keyHou: JQ.TERMS[20].keyHou, focus: [[PERCH.x2 + 30, PERCH.y2 - 60], [TC[0], TC[1] - 150], [960, 980]], frame: true,
    draw(g, t, Sx) {
      t = JQ.clamp(t, 0, 9); const h = Math.min(2, Math.floor(t / BAR));
      JQ.blit(g, JQ.cached('s21bg', Sx, buildBg));
      tigers(g, t);
      bird(g, t);
      const C = JQ.castFor(Sx, t);
      C.items.forEach((it, i) => { g.save(); if (it.alpha != null && it.alpha < 1) g.globalAlpha = it.alpha; castFig(g, it, 90 + i * 5); g.restore(); });
      iris(g, t);
      g.fillStyle = SNOW;
      for (const f of SNOWF) for (let r = 0; r < 7; r++) { const y = 60 + (r + (f.ph + t / 4) % 1) * 150; if (y > 1030) continue; g.beginPath(); g.arc(f.x + Math.sin(t * Math.PI / 2 + r + f.ph * 7) * 12, y, f.r, 0, TAU); g.fill(); }
      JQ.blit(g, JQ.cached('s21front', Sx, buildFront));
      houText(g, t, h);
    },
  };
})();
