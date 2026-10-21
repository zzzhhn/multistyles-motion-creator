// 08 罗马马赛克 · 两界山头 — an emblema in stone tesserae. 五行山 is Buddha's own hand turned to rock (five finger-peaks,
// one stone colour per element: 土 金 木 水 火), and 悟空's moss-grown head sticks out at its foot. On beat 3 Tang Seng raises
// his palm, the gold six-syllable seal on the middle peak peels off as flying gold tesserae; the mountain's stones flip
// over one by one from the top down, leaving sky and a heap of white rubble; 悟空 bursts out, somersaults, and lands in
// front of the horse on beat 4 — from that frame he walks in the procession. The procession itself is set in finer
// tesserae every frame: drawn into a small buffer, read back, laid stone by stone with grout and bevel.
(() => {
  'use strict';
  const XY = window.XY, K = XY.KIT_A, TAU = XY.TAU;
  const GROUT = '#6E655A', TS = 9, TP = 5, TF = 6;
  const rev = (u, a, d) => XY.clamp((u - a) / d);
  const MB = [860, 186, 1416, 704];              // the mountain's box (where stones flip)
  const PLAQ = [92, 104, 624, 244], NUM = [1236, 58, 1388, 136];

  // ------------------------------------------------------------ tessellation: staggered rows, jittered stones, grout, bevel
  // src: ImageData painted at 1 px per design unit over (x0, y0, w, h); `skip` rects are left alone; `per` makes the layout periodic in x
  const tess = (g, src, x0, y0, w, h, ts, seed, skip = [], per = 0) => {
    const d = src.data, sw = src.width, hi = new Path2D(), lo = new Path2D(), m = ts * 0.08;
    for (let j = 0, y = y0; y < y0 + h; j++, y += ts) { const ox = (j % 2) * ts / 2;
      for (let i = 0, x = x0 - ox; x < x0 + w; i++, x += ts) {
        const cx = x + ts / 2, cy = y + ts / 2; if (skip.some(r => cx > r[0] && cx < r[2] && cy > r[1] && cy < r[3])) continue;
        const ii = per ? i % Math.round(per / ts) : i, jx = (XY.hash(ii, j, seed) - 0.5) * ts * 0.17, jy = (XY.hash(ii, j, seed + 1) - 0.5) * ts * 0.17, v = 0.88 + 0.22 * XY.hash(ii, j, seed + 2);
        const sx = Math.min(sw - 1, Math.max(0, Math.round(cx))), sy = Math.min(src.height - 1, Math.max(0, Math.round(cy))), k = (sy * sw + sx) * 4;   // src is in absolute design px
        g.fillStyle = `rgb(${Math.min(255, d[k] * v) | 0},${Math.min(255, d[k + 1] * v) | 0},${Math.min(255, d[k + 2] * v) | 0})`;
        const tx = x + m + jx, ty = y + m + jy, tw = ts - 2 * m, th = ts - 2 * m; g.fillRect(tx, ty, tw, th);
        hi.rect(tx, ty, tw, 1.2); hi.rect(tx, ty, 1.2, th); lo.rect(tx, ty + th - 1.2, tw, 1.2); lo.rect(tx + tw - 1.2, ty, 1.2, th);
      } }
    g.fillStyle = 'rgba(255,250,236,0.24)'; g.fill(hi); g.fillStyle = 'rgba(20,14,8,0.28)'; g.fill(lo);
  };
  const source = (w, h, paint) => { const c = XY.mk(w, h), g = c.getContext('2d'); paint(g); return g.getImageData(0, 0, w, h); };

  // ------------------------------------------------------------ the flat cartoon the stones are cut to
  const fp = (g, pts, c) => { XY.path(g, pts, true); g.fillStyle = c; g.fill(); };
  // Buddha's hand as five finger-peaks: thumb 土, index 木, middle 金, ring 水, little 火 (rounded tips, knuckle creases, rough outline)
  const finger = (b, tip, w) => { const d = [tip[0] - b[0], tip[1] - b[1]], l = Math.hypot(d[0], d[1]), u = [d[0] / l, d[1] / l], n = [-u[1], u[0]], c = [tip[0] - u[0] * w / 2, tip[1] - u[1] * w / 2], P = [];
    P.push(b[0] - n[0] * w / 2, b[1] - n[1] * w / 2); for (let k = 0; k <= 10; k++) { const q = k / 10 * Math.PI, cq = Math.cos(q), sq = Math.sin(q); P.push(c[0] + (-n[0] * cq + u[0] * sq) * w / 2, c[1] + (-n[1] * cq + u[1] * sq) * w / 2); }
    P.push(b[0] + n[0] * w / 2, b[1] + n[1] * w / 2); return { P: XY.wobble(XY.densify(P, 12, true), 5, Math.round(tip[0])), u, n, b, l, w }; };
  const FINGERS = [[finger([934, 570], [900, 392], 64), '#B48C48'], [finger([1010, 524], [1020, 262], 74), '#5E8E4A'], [finger([1108, 516], [1114, 208], 80), '#D6A836'],
    [finger([1204, 520], [1214, 252], 76), '#3E5E92'], [finger([1292, 534], [1304, 312], 66), '#B44A3A']].map(([f, c]) => [f, c]);
  const scene = (g, W, after) => {
    let gr = g.createLinearGradient(0, 40, 0, 560); gr.addColorStop(0, '#8EB0C6'); gr.addColorStop(0.7, '#D6E0DA'); gr.addColorStop(1, '#E6E0C8'); g.fillStyle = gr; g.fillRect(0, 0, W, 780);
    [[180, 330, 96, 24], [520, 290, 130, 28], [800, 352, 80, 20], [1180, 150, 110, 24]].forEach(([x, y, rx, ry]) => { fp(g, XY.ellipse(x, y + 6, rx, ry * 0.8, 20), '#B8C4C8'); fp(g, XY.ellipse(x, y, rx * 0.92, ry, 20), '#F4F2EA'); });
    const hills = [0, 560]; for (let x = 0; x <= W; x += 40) hills.push(x, 488 + 34 * Math.sin(x / 150) + 18 * Math.sin(x / 47)); hills.push(W, 560); fp(g, hills, '#8C9EA8');
    g.fillStyle = '#A2A660'; g.fillRect(0, 556, W, 150); g.fillStyle = '#8A9450'; for (let y = 580; y < 700; y += 26) g.fillRect(0, y, W, 9);
    g.fillStyle = '#C8A870'; g.fillRect(0, 668, W, 32); g.fillStyle = '#3A2E22'; g.fillRect(0, 700, W, 8);
    for (let k = 0; k < 26; k++) { const x = 30 + k * 53, y = 600 + 40 * XY.hash(k, 3); fp(g, [x - 8, y + 10, x - 2, y - 14, x + 2, y + 6, x + 8, y - 12, x + 10, y + 10], '#5E7A3A'); }
    fp(g, [732, 612, 732, 552, 742, 540, 762, 540, 772, 552, 772, 612], '#8E8A80'); fp(g, [738, 604, 738, 556, 766, 556, 766, 604], '#B8B2A4'); fp(g, [724, 612, 780, 612, 780, 620, 724, 620], '#6E6A62');   // the boundary stone
    // the tabula ansata with the title, and the VIII tablet
    fp(g, [PLAQ[0] + 30, PLAQ[1], PLAQ[2] - 30, PLAQ[1], PLAQ[2] - 30, PLAQ[1] + 26, PLAQ[2], (PLAQ[1] + PLAQ[3]) / 2 - 22, PLAQ[2], (PLAQ[1] + PLAQ[3]) / 2 + 22, PLAQ[2] - 30, PLAQ[3] - 26, PLAQ[2] - 30, PLAQ[3],
      PLAQ[0] + 30, PLAQ[3], PLAQ[0] + 30, PLAQ[3] - 26, PLAQ[0], (PLAQ[1] + PLAQ[3]) / 2 + 22, PLAQ[0], (PLAQ[1] + PLAQ[3]) / 2 - 22, PLAQ[0] + 30, PLAQ[1] + 26], '#7A3022');
    g.fillStyle = '#EDE4CE'; g.fillRect(PLAQ[0] + 42, PLAQ[1] + 12, PLAQ[2] - PLAQ[0] - 84, PLAQ[3] - PLAQ[1] - 24);
    g.fillStyle = g.strokeStyle = '#2A1E18'; g.lineWidth = 7; g.lineJoin = 'round'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.font = XY.font(104, '"PingFang SC", "Heiti SC", sans-serif', '600');
    g.strokeText('两 界 山', (PLAQ[0] + PLAQ[2]) / 2, (PLAQ[1] + PLAQ[3]) / 2 + 4); g.fillText('两 界 山', (PLAQ[0] + PLAQ[2]) / 2, (PLAQ[1] + PLAQ[3]) / 2 + 4);
    g.fillStyle = '#7A3022'; g.fillRect(NUM[0], NUM[1], NUM[2] - NUM[0], NUM[3] - NUM[1]); g.fillStyle = '#EDE4CE'; g.fillRect(NUM[0] + 10, NUM[1] + 10, NUM[2] - NUM[0] - 20, NUM[3] - NUM[1] - 20);
    g.fillStyle = '#2A1E18'; g.font = XY.font(56, '"Times New Roman", serif', 'bold'); g.lineWidth = 4; g.strokeText('VIII', (NUM[0] + NUM[2]) / 2, (NUM[1] + NUM[3]) / 2 + 3); g.fillText('VIII', (NUM[0] + NUM[2]) / 2, (NUM[1] + NUM[3]) / 2 + 3); g.textAlign = 'left';
    if (!after) {   // the hand-mountain: palm and five finger-peaks, dark contour rows, a lit left flank, moss, the crevice 悟空 is pinned in
      const palm = [868, 704, 900, 560, 980, 500, 1300, 482, 1400, 560, 1416, 704]; fp(g, palm, '#8C7C66');
      FINGERS.forEach(([F, c]) => { XY.path(g, F.P, true); g.fillStyle = c; g.fill();
        g.save(); XY.path(g, F.P, true); g.clip(); g.fillStyle = 'rgba(255,250,230,0.3)'; XY.path(g, [F.b[0] - F.n[0] * F.w / 2, F.b[1] - F.n[1] * F.w / 2, F.b[0] - F.n[0] * F.w / 2 + F.u[0] * F.l, F.b[1] - F.n[1] * F.w / 2 + F.u[1] * F.l, F.b[0] - F.n[0] * F.w * 0.1 + F.u[0] * F.l, F.b[1] - F.n[1] * F.w * 0.1 + F.u[1] * F.l, F.b[0] - F.n[0] * F.w * 0.1, F.b[1] - F.n[1] * F.w * 0.1], true); g.fill();
        [0.36, 0.64].forEach(q => { const m = [F.b[0] + F.u[0] * F.l * q, F.b[1] + F.u[1] * F.l * q]; g.strokeStyle = 'rgba(40,30,22,0.75)'; g.lineWidth = 8; g.beginPath(); g.moveTo(m[0] - F.n[0] * F.w * 0.36, m[1] - F.n[1] * F.w * 0.36);
          g.quadraticCurveTo(m[0] + F.u[0] * 8, m[1] + F.u[1] * 8, m[0] + F.n[0] * F.w * 0.36, m[1] + F.n[1] * F.w * 0.36); g.stroke(); });
        for (let k = 0; k < 4; k++) { const q = 0.15 + 0.2 * k, s = (XY.hash(k, F.P.length) - 0.5) * 0.5, m = [F.b[0] + F.u[0] * F.l * q + F.n[0] * F.w * s, F.b[1] + F.u[1] * F.l * q + F.n[1] * F.w * s]; fp(g, XY.ellipse(m[0], m[1], 10, 7, 10), 'rgba(40,30,20,0.25)'); }
        g.restore(); XY.path(g, F.P, true); g.strokeStyle = '#2E2620'; g.lineWidth = 9; g.stroke(); });
      XY.path(g, palm, true); g.strokeStyle = '#2E2620'; g.lineWidth = 9; g.stroke();
      for (let k = 0; k < 9; k++) fp(g, XY.ellipse(900 + k * 56, 600 + 30 * XY.hash(k, 7), 26, 10, 12), '#6E8A44');
      fp(g, XY.ellipse(980, 650, 58, 48, 22), '#2A221C');
    } else {        // after: sky where the mountain stood, a heap of white rubble with stones of the five colours
      const heap = [860, 704, 900, 646, 990, 614, 1110, 602, 1260, 618, 1380, 652, 1416, 704]; fp(g, heap, '#D8D2C2'); XY.path(g, heap, true); g.strokeStyle = '#8A8274'; g.lineWidth = 9; g.stroke();
      for (let k = 0; k < 34; k++) { const x = 900 + 500 * XY.hash(k, 11), y = 630 + 66 * XY.hash(k, 12); fp(g, XY.ellipse(x, y, 10 + 8 * XY.hash(k, 13), 7, 8, XY.hash(k, 14) * 3), k % 3 ? '#A89C88' : FINGERS[k % 5][1]); }
    }
  };
  // 悟空 pinned under the mountain: furry head facing the road, moss and grass on the crown, a vine in the ear, one hand free
  const trapped = (b, t, u, call) => { const hx = 992, hy = 654, bl = (t * 0.5) % 1 < 0.05;
    b.fillStyle = '#7A4A26'; b.beginPath(); b.arc(hx, hy, 27, 0, TAU); b.fill();
    fp(b, [hx - 26, hy - 4, hx - 18, hy - 14, hx - 2, hy - 16, hx + 6, hy - 6, hx + 2, hy + 14, hx - 12, hy + 20, hx - 24, hy + 12], '#E8C49A');
    b.fillStyle = '#1E140C'; if (!bl) { b.beginPath(); b.arc(hx - 16, hy - 5, 4.6, 0, TAU); b.fill(); b.beginPath(); b.arc(hx - 2, hy - 6, 3.6, 0, TAU); b.fill(); } else { b.fillRect(hx - 21, hy - 7, 10, 3); b.fillRect(hx - 5, hy - 7, 7, 3); }
    b.fillRect(hx - 22, hy + 7 + (call ? 0 : 2), 14, call ? 7 : 3);
    fp(b, [hx - 22, hy - 24, hx - 14, hy - 44, hx - 6, hy - 26, hx + 2, hy - 48, hx + 8, hy - 26, hx + 18, hy - 40, hx + 22, hy - 20], '#4E8A3A');
    b.strokeStyle = '#4E8A3A'; b.lineWidth = 4; b.beginPath(); b.moveTo(hx + 18, hy - 2); b.quadraticCurveTo(hx + 34, hy + 8, hx + 28, hy + 24); b.stroke();
    const wv = (K.step(t, 4) % 2) * 8 * (call ? 1 : 0.4); b.strokeStyle = '#7A4A26'; b.lineWidth = 11; b.beginPath(); b.moveTo(hx - 20, hy + 26); b.lineTo(hx - 46, hy + 34 - wv); b.stroke();
    b.fillStyle = '#E8C49A'; b.beginPath(); b.arc(hx - 50, hy + 32 - wv, 7, 0, TAU); b.fill(); void u; };
  // 刘伯钦 the hunter, who escorted the monk this far: leopard cap, brown coat, steel fork; he stops at the boundary stone
  const hunter = (b, x, y, s, face, wave, jump, t) => { b.save(); b.translate(x, y - 30 * jump); b.scale(face * s, s); const st = (K.step(t, 3) % 2) ? 6 : -6;
    b.strokeStyle = '#3A2A1C'; b.lineWidth = 9; b.beginPath(); b.moveTo(-4, -44); b.lineTo(-8 - (wave ? 0 : st), 0); b.moveTo(4, -44); b.lineTo(8 + (wave ? 0 : st), 0); b.stroke();
    fp(b, [-16, -110, 16, -110, 22, -40, -22, -40], '#7A4A26'); fp(b, [-18, -70, 18, -70, 18, -62, -18, -62], '#A8321E');
    b.fillStyle = '#E2BA92'; b.beginPath(); b.arc(2, -124, 12, 0, TAU); b.fill(); fp(b, [-12, -128, -8, -146, 14, -146, 16, -128], '#DA8E30'); b.fillStyle = '#2A1E14'; [[-4, -138], [6, -142], [10, -134]].forEach(([px, py]) => { b.beginPath(); b.arc(px, py, 2.2, 0, TAU); b.fill(); });
    b.fillRect(6, -127, 3, 3); fp(b, [-2, -118, 4, -102, 10, -116], '#3A2A1C');
    b.strokeStyle = '#7A4A26'; b.lineWidth = 8; b.beginPath(); b.moveTo(10, -104); b.lineTo(28, -80); b.stroke();
    b.strokeStyle = '#5A4A3A'; b.lineWidth = 4; b.beginPath(); b.moveTo(30, -20); b.lineTo(30, -170); b.stroke(); b.strokeStyle = '#C8CED6'; b.lineWidth = 4; b.beginPath(); b.moveTo(20, -176); b.lineTo(20, -190); b.moveTo(30, -172); b.lineTo(30, -194); b.moveTo(40, -176); b.lineTo(40, -190); b.moveTo(18, -172); b.lineTo(42, -172); b.stroke();
    const wa = wave ? -2.2 + 0.5 * Math.sin(t * 9) : 0.4; b.strokeStyle = '#7A4A26'; b.lineWidth = 8; b.beginPath(); b.moveTo(-10, -104); b.lineTo(-10 + Math.sin(wa) * 34, -104 - Math.cos(wa) * -34 * (wave ? -1 : 1)); b.stroke();
    b.restore(); };
  const talisman = b => { b.fillStyle = '#2A1E18'; b.fillRect(1094, 222, 36, 206); b.fillStyle = '#E8C040'; b.fillRect(1098, 226, 28, 198);
    b.fillStyle = '#A8241A'; b.font = XY.font(26, XY.cnFont.kai, 'bold'); b.textAlign = 'center'; b.textBaseline = 'top'; K.vtext(b, '唵嘛呢叭咪吽', 1112, 230, 26, 1.24); b.textAlign = 'left'; };

  // ------------------------------------------------------------ prepared data: flat sources, the stones that flip, the border strips
  let DATA = null;
  const data = W => { if (DATA && DATA.W === W) return DATA; const H = 780, before = source(W, H, g => scene(g, W, false)), after = source(W, H, g => scene(g, W, true));
    const col = (src, x, y, v) => { const k = (Math.min(H - 1, Math.round(y)) * W + Math.min(W - 1, Math.round(x))) * 4, d = src.data; return [d[k] * v, d[k + 1] * v, d[k + 2] * v]; };
    const FL = []; for (let j = 0, y = 0; y < H; j++, y += TS) { const ox = (j % 2) * TS / 2; for (let i = 0, x = -ox; x < W; i++, x += TS) { const cx = x + TS / 2, cy = y + TS / 2;
      if (cx < MB[0] || cy < MB[1] || cy > MB[3]) continue; const v = 0.88 + 0.22 * XY.hash(i, j, 5), a = col(before, cx, cy, v), b = col(after, cx, cy, v);
      if (Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) + Math.abs(a[2] - b[2]) < 30) continue;
      const tx = x + TS * 0.08 + (XY.hash(i, j, 3) - 0.5) * TS * 0.17, ty = y + TS * 0.08 + (XY.hash(i, j, 4) - 0.5) * TS * 0.17, s = c => `rgb(${Math.min(255, c[0]) | 0},${Math.min(255, c[1]) | 0},${Math.min(255, c[2]) | 0})`;
      FL.push([tx, ty, s(a), s(b), (cy - MB[1]) / 5600 + 0.012 * XY.hash(i, j, 9)]); } }
    const L = W + 72;
    const top = source(L, 40, g => { g.fillStyle = '#26283A'; g.fillRect(0, 0, L, 40); [[1, '#B8402A', '#F2D890'], [-1, '#2E4A8A', '#BCD2EA']].forEach(([s, c1, c2]) => { [[11, c1], [4.5, c2]].forEach(([w, c]) => {
      g.strokeStyle = c; g.lineWidth = w; g.beginPath(); for (let x = 0; x <= L; x += 3) { const y = 20 + 10 * s * Math.sin(x / 72 * TAU); x ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke(); }); });
      g.fillStyle = '#F4F0E4'; for (let x = 18; x < L; x += 36) { g.beginPath(); g.arc(x, 20, 3, 0, TAU); g.fill(); } });
    const bot = source(L, 68, g => { g.fillStyle = '#EEE8D8'; g.fillRect(0, 0, L, 68); g.fillStyle = '#26221E';
      for (let x0 = -72; x0 < L; x0 += 72) { g.beginPath(); g.moveTo(x0, 60); for (let k = 0; k <= 24; k++) { const q = k / 24; g.lineTo(x0 + q * 72, 60 - 30 * Math.pow(Math.sin(q * Math.PI), 0.7) * (q < 0.7 ? q / 0.7 : 1)); }
        for (let k = 0; k <= 16; k++) { const a = Math.PI * 1.5 - k / 16 * TAU * 0.8, r = 16 - k * 0.7; g.lineTo(x0 + 50 + Math.cos(a) * r, 34 + Math.sin(a) * r); } g.lineTo(x0 + 72, 60); g.closePath(); g.fill(); }
      g.fillRect(0, 60, L, 8); g.fillStyle = '#A8321E'; g.fillRect(0, 0, L, 6); });
    return (DATA = { W, before, after, FL, top, bot, L }); };
  const strip = (D, which, S) => XY.keep(`mos-${which}:${D.W}:${S.toFixed(4)}`, D.L * S, (which === 'top' ? 40 : 68) * S, cv => { const g = cv.getContext('2d'); g.scale(S, S);
    g.fillStyle = GROUT; g.fillRect(0, 0, D.L, 68); tess(g, D[which], 0, 0, D.L, which === 'top' ? 40 : 68, TF, which === 'top' ? 21 : 23, [], 72); });

  // ------------------------------------------------------------ the procession (and anything alive) set in fine stones each frame
  const COL = { horse: '#8A4E2C', horse2: '#6E3C22', mane: '#2A1E16', hoof: '#2A1E16', saddle: '#7A2A1E', red: '#A8321E', robe: '#D8B05E', kasaya: '#A8321E', skin: '#E2BA92', gold: '#E8C040', metal: '#D8B040',
    fur: '#8A5A30', face: '#ECC8A0', wkshirt: '#B83A2A', tiger: '#DA8E30', stripe: '#2A1E14', staff: '#A8321E', ink: '#1E140C' };
  const PEN = { outline: '#2A2018', ow: 2.6, color: r => COL[r] || XY.DEFAULT_COLORS[r] };
  const stones = (g, e, paint) => { const bw = Math.ceil(e.W / TP), bh = Math.ceil(e.H / TP), cv = XY.scratch('mos-buf', bw, bh, { read: true }), b = cv.getContext('2d');
    b.setTransform(1 / TP, 0, 0, 1 / TP, 0, 0); paint(b); const d = b.getImageData(0, 0, bw, bh).data, gr = new Path2D(), hi = new Path2D(), lo = new Path2D(), L = [];
    for (let j = 0; j < bh; j++) { const ox = (j % 2) * TP / 2 - TP / 4; for (let i = 0; i < bw; i++) { const k = (j * bw + i) * 4; if (d[k + 3] < 96) continue; const x = i * TP + ox, y = j * TP; gr.rect(x - 0.4, y - 0.4, TP + 0.8, TP + 0.8); L.push(k, x, y); } }
    if (!L.length) return; g.fillStyle = GROUT; g.fill(gr);
    for (let n = 0; n < L.length; n += 3) { const k = L[n], x = L[n + 1] + 0.55, y = L[n + 2] + 0.55, v = 0.9 + 0.2 * XY.hash(k, 77), s = TP - 1.1;
      g.fillStyle = `rgb(${Math.min(255, d[k] * v) | 0},${Math.min(255, d[k + 1] * v) | 0},${Math.min(255, d[k + 2] * v) | 0})`; g.fillRect(x, y, s, s); hi.rect(x, y, s, 0.9); lo.rect(x, y + s - 0.9, s, 0.9); }
    g.fillStyle = 'rgba(255,250,236,0.28)'; g.fill(hi); g.fillStyle = 'rgba(20,14,8,0.3)'; g.fill(lo); };
  const actsAt = u => ({ monk: { palm: K.win(u, 0.44, 0.66, 0.04) }, wukong: { raise: K.win(u, 0.68, 0.88, 0.04) } });
  const LAND = new Map(); const landX = c => { if (!LAND.has(c.n)) LAND.set(c.n, XY.procWorldX(c.t0 + (4 / 6) * c.dur) - c.x + 245); return LAND.get(c.n); };
  const U_OUT = 0.585, U_LAND = 4 / 6;
  const afterMosaic = (D, n, S, W, H) => XY.cached(`mos-after:${n}:${S.toFixed(4)}`, W * S, H * S, cv => { const g2 = cv.getContext('2d'); g2.scale(S, S); g2.fillStyle = GROUT; g2.fillRect(MB[0] - 20, MB[1] - 20, W, H); tess(g2, D.after, 0, 0, W, H, TS, 3, [PLAQ, NUM]); });

  XY.STYLES.mosaic = {
    bg(g, W, H, c, scale) {
      const D = data(W); g.fillStyle = GROUT; g.fillRect(0, 0, W, H);
      tess(g, D.before, 0, 0, W, H, TS, 3, [PLAQ, NUM]);
      tess(g, D.before, PLAQ[0], PLAQ[1], PLAQ[2] - PLAQ[0], PLAQ[3] - PLAQ[1], TF, 7); tess(g, D.before, NUM[0], NUM[1], NUM[2] - NUM[0], NUM[3] - NUM[1], TF, 8);
      afterMosaic(D, c.n, scale, W, H);   // built now so the frame where the mountain falls doesn't stall
    },
    draw(g, e) {
      const { W, H, u, t, S, beat } = e, D = data(W), acts = actsAt(u), c = e.cell;
      // the borders: a guilloche above, a running wave below, both flowing (the stones travel with the pattern)
      const o1 = (t * 30) % 72, o2 = (t * 24) % 72;
      g.drawImage(strip(D, 'top', S), -o1, 0, D.L, 40); g.drawImage(strip(D, 'bot', S), o2 - 72, 712, D.L, 68);
      g.fillStyle = '#2A2420'; g.fillRect(0, 40, W, 5); g.fillRect(0, 706, W, 6);
      // the mountain falls: stones flip over row by row from the top, the "after" mosaic shows through behind the wave
      if (u >= 0.5) { const yc = MB[1] + 5600 * (u - 0.542), A = afterMosaic(D, c.n, S, W, H);
        if (yc > MB[1]) { g.save(); g.beginPath(); g.rect(MB[0] - TS, MB[1] - TS, MB[2] - MB[0] + 2 * TS, Math.min(MB[3], yc) - MB[1] + TS); g.clip(); g.drawImage(A, 0, 0, W, H); g.restore(); }
        if (u < 0.66) D.FL.forEach(f => { if (f[1] + TS <= yc) return; const ph = (u - 0.5 - f[4]) / 0.03; if (ph <= 0) return;
          g.fillStyle = GROUT; g.fillRect(f[0] - 0.8, f[1] - 0.8, TS - 0.2, TS - 0.2); const w = (TS - 1.5) * Math.abs(Math.cos(Math.PI * Math.min(1, ph))), sh = 0.55 + 0.45 * w / (TS - 1.5), x = f[0] + (TS - 1.5 - w) / 2;
          g.fillStyle = ph < 0.5 ? f[2] : f[3]; g.fillRect(x, f[1], w, TS - 1.5); if (ph > 0.5 && ph < 1) { g.fillStyle = `rgba(250,246,236,${0.85 * (1 - ph) * 2})`; g.fillRect(x, f[1], w, TS - 1.5); }
          if (sh < 0.98) { g.fillStyle = `rgba(0,0,0,${0.5 * (1 - sh)})`; g.fillRect(x, f[1], w, TS - 1.5); } });
        if (u < 0.68) for (let k = 0; k < 24; k++) { const q = XY.clamp((u - 0.5 - 0.004 * k) / 0.1); if (q <= 0 || q >= 1) continue; const x = MB[0] + 40 + 500 * XY.hash(k, 31), y = MB[1] + 520 * q + 60 * XY.hash(k, 32) * q;
          g.fillStyle = k % 2 ? '#E8E2D2' : '#B8AE9C'; g.fillRect(x, y, 5, 5); } }
      // the gold seal blown away as loose tesserae on beat 3
      if (u >= 0.5 && u < 0.7) for (let k = 0; k < 44; k++) { const q = XY.clamp((u - 0.5 - 0.0015 * k) / 0.14); if (q <= 0 || q >= 1) continue;
        const x0 = 1098 + 28 * XY.hash(k, 1), y0 = 226 + 198 * (k / 44), x = x0 + 540 * q + 50 * Math.sin(q * 9 + k), y = y0 - 400 * q * (0.6 + 0.4 * XY.hash(k, 2)) + 40 * Math.sin(q * 5 + k), r = q * 10 + k;
        g.save(); g.translate(x, y); g.rotate(r); g.globalAlpha = 1 - q * q; g.fillStyle = GROUT; g.fillRect(-3.6, -3.6, 7.2, 7.2); g.fillStyle = k % 3 ? '#E8C040' : '#F6E08A'; g.fillRect(-3, -3 * Math.abs(Math.cos(r)), 6, 6 * Math.abs(Math.cos(r))); g.restore(); }
      // live stones: the seal, 悟空 pinned / leaping, swallows, and the procession (悟空 walks with them from beat 4)
      const qL = XY.easeIO(rev(u, U_OUT, U_LAND - U_OUT)), lx = landX(c);
      stones(g, e, b => {
        for (let k = 0; k < 3; k++) { const x = ((t * 90 + k * 420) % (W + 200)) - 100, y = 180 + 50 * k + 16 * Math.sin(t * 3 + k), fl = (K.step(t + k * 0.1, 6) % 2) ? 8 : -6;
          b.strokeStyle = '#2A2420'; b.lineWidth = 6; b.beginPath(); b.moveTo(x - 16, y + fl); b.lineTo(x, y); b.lineTo(x + 16, y + fl); b.stroke(); }
        if (u < 0.5) talisman(b);
        { const arrive = XY.smooth(rev(u, -0.1, 0.42)), x = XY.lerp(380, 700, arrive), home = XY.smooth(rev(u, 0.74, 0.2)), hx = XY.lerp(x, 520, home);
          hunter(b, hx, 612, 0.62, home > 0.02 ? -1 : 1, arrive >= 1 && home <= 0.02 && u < 0.72, K.win(u, U_OUT, U_OUT + 0.06, 0.02), t); }
        if (u < U_OUT) { b.save(); b.translate(980, 650); b.scale(1.55, 1.55); b.translate(-992, -654); trapped(b, t, u, K.win(u, 0.28, 0.5, 0.02) > 0 && (K.step(t, 5) % 2)); b.restore(); }
        XY.drawProcession(b, e.phase, e.procX, e.groundY, PEN, { ...acts, cast: { wukong: u >= U_LAND } });
        if (u >= U_OUT && u < U_LAND) { const p0 = [992, 690], p1 = [(992 + lx) / 2, 230], p2 = [lx, 702], a = (1 - qL) * (1 - qL), m = 2 * (1 - qL) * qL, z = qL * qL, px = a * p0[0] + m * p1[0] + z * p2[0], py = a * p0[1] + m * p1[1] + z * p2[1];
          b.save(); b.translate(px, py - 60); b.rotate(TAU * qL); b.translate(-245, 60); XY.drawProcession(b, e.phase, 0, 0, PEN, { wukong: { raise: 1 }, cast: { monk: false, wukong: true } }); b.restore(); }
      });
      // the burst out of the rubble, and the landing ring on beat 4
      const bq = rev(u, U_OUT, 0.1); if (bq > 0 && bq < 1) for (let k = 0; k < 30; k++) { const a = -Math.PI * XY.hash(k, 41), sp = 120 + 220 * XY.hash(k, 42), x = 992 + Math.cos(a) * sp * bq, y = 650 + Math.sin(a) * sp * bq + 500 * bq * bq;
        g.fillStyle = GROUT; g.fillRect(x - 3.6, y - 3.6, 7.2, 7.2); g.fillStyle = FINGERS[k % 5][1]; g.fillRect(x - 3, y - 3, 6, 6); }
      const lr = rev(beat, 4, 0.5); if (lr > 0 && lr < 1) { g.strokeStyle = `rgba(232,192,64,${1 - lr})`; g.lineWidth = 6; g.setLineDash([6, 4]); g.beginPath(); g.ellipse(lx, 700, 40 + 120 * lr, 10 + 24 * lr, 0, 0, TAU); g.stroke(); g.setLineDash([]); }
      // a little light across the floor
      g.save(); g.globalCompositeOperation = 'soft-light'; const lg = g.createRadialGradient(W * 0.4, 200, 100, W * 0.5, 400, 1000); lg.addColorStop(0, 'rgba(255,244,220,0.35)'); lg.addColorStop(1, 'rgba(30,20,10,0.45)'); g.fillStyle = lg; g.fillRect(0, 0, W, H); g.restore();
    },
    hits: [6, 8],
    post(canvas, g, e) { const lx = landX(e.cell); K.zoom(canvas, g, e, Math.max(K.push(e.beat, 5.5, 6.0, 7.2, 0.12), K.push(e.beat, 7.5, 8.0, 9.8, 0.14)), e.beat < 7.3 ? 1110 : lx, e.beat < 7.3 ? 360 : 600); },
  };
})();
