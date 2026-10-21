// 41 高更·象征 · 1890 年 · 问佛根源 — 第五十二回：悟空上灵山问如来那怪的来历，如来不肯明说，只派十八罗汉带金丹砂去，
// 又暗中指点他去兜率宫找太上老君——那怪是老君的青牛，金刚琢是老君的宝贝。学高更综合主义的语言（平涂象征色、普鲁士蓝粗轮廓、
// 题记块、粗麻布纹、掐丝填色），画的全是原著：灵山、雷音寺、如来、婆罗树、白鹤、驾云的罗汉；如来的手掌开出那怪的真身。
(() => {
  'use strict';
  const XY = window.XY, K = XY.KIT_E, TAU = XY.TAU;
  const OUT = '#1F3A6A', SKY = 170, GRD = 640, RISE = 4.3, OPEN = 5.2, SNORT = 5.6, SAND = 6.0;
  const COL = { fur: '#D8782A', face: '#F0B878', wkshirt: '#C83A2A', tiger: '#F2B02E', stripe: '#1F3A6A', gold: '#F2D040', staff: '#B83A2A', ink: '#1F3A6A', horse: '#E6E4B2', horse2: '#B8C890',
    mane: '#F0ECC8', hoof: '#3A2A4A', saddle: '#7A2A3A', red: '#B83A2A', robe: '#F0C030', kasaya: '#B8302A', skin: '#F0BE8A', metal: '#E8C040', bjrobe: '#3A2A5A', bjpants: '#2A2048',
    pig: '#F0A08C', pig2: '#D87A70', wood: '#8A5A3A', ssrobe: '#2A6A6A', ssrobe2: '#1E5050', skin2: '#B87A4A', ssh: '#C8482A', ssbeard: '#A83A22', skull: '#F2ECD8', bundle: '#E8A838' };
  const PEN = { color: r => COL[r], outline: OUT, ow: 2.4, shade: 'rgba(70,30,100,0.22)' };
  // flat shape with a heavy Prussian-blue contour and a little same-hue brush life inside
  const flat = (g, pts, fill, w = 3, smooth = true, life = 0) => {
    const P = smooth ? XY.RIG.spline(pts, true, 5) : pts; XY.path(g, P, true); g.fillStyle = fill; g.fill();
    if (life) { g.save(); XY.path(g, P, true); g.clip(); const R = XY.rng(life); let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
      for (let k = 0; k < pts.length; k += 2) { x0 = Math.min(x0, pts[k]); x1 = Math.max(x1, pts[k]); y0 = Math.min(y0, pts[k + 1]); y1 = Math.max(y1, pts[k + 1]); }
      g.lineCap = 'round'; for (let i = 0; i < (x1 - x0) * (y1 - y0) / 260; i++) K.dab(g, x0 + R() * (x1 - x0), y0 + R() * (y1 - y0), -0.6 + (R() - 0.5) * 0.6, 12 + R() * 14, 5, R() < 0.5 ? 'rgba(255,255,240,0.10)' : 'rgba(40,20,60,0.10)', 0.2); g.restore(); }
    XY.path(g, P, true); g.strokeStyle = OUT; g.lineWidth = w; g.lineJoin = 'round'; g.stroke(); };
  const PEAKS = [[[600, 460, 700, 250, 780, 150, 840, 120, 900, 170, 960, 300, 1010, 460], '#C87AA8'], [[820, 470, 930, 180, 980, 110, 1040, 90, 1100, 140, 1160, 260, 1180, 470], '#7A4A8A'],
    [[940, 480, 1040, 300, 1100, 250, 1180, 230, 1180, 480], '#3A5A9A']];
  // 雷音寺 on the middle peak: a hall with upturned double eaves, red pillars, gold ridge (drawn into the vision sprite)
  const temple = (g, x, y, s) => { g.save(); g.translate(x, y); g.scale(s, s);
    flat(g, [-44, 0, 44, 0, 44, -34, -44, -34], '#F2ECD8', 2.4, false); for (let k = -3; k <= 3; k += 2) flat(g, [k * 12 - 3, 0, k * 12 + 3, 0, k * 12 + 3, -32, k * 12 - 3, -32], '#C8302A', 1.4, false);
    flat(g, [-66, -30, -52, -40, 52, -40, 66, -30, 52, -48, -52, -48], '#2E5A9A', 2.4, false); flat(g, [-34, -48, 34, -48, 34, -62, -34, -62], '#F2ECD8', 2, false);
    flat(g, [-52, -60, -38, -70, 38, -70, 52, -60, 38, -78, -38, -78], '#2E5A9A', 2.4, false); flat(g, [-38, -80, 38, -80, 34, -86, -34, -86], '#F2D040', 1.8, false);
    flat(g, [-12, 0, 12, 0, 12, -22, -12, -22], '#F2C230', 1.6, false); g.restore(); };
  // the vision: three flat peaks, 雷音寺's white stupa, the yellow Buddha with a flat green halo (static sprite)
  const vision = (S, W, H) => XY.keep(`c41vis:${W}:${S.toFixed(3)}`, W * S, H * S, cv => { const g = cv.getContext('2d'); g.scale(S, S);
    PEAKS.forEach(([p, c], k) => flat(g, p, c, 3, false, 410 + k));
    g.strokeStyle = 'rgba(31,58,106,0.5)'; g.lineWidth = 2; [[860, 220, 900, 380], [1040, 150, 1010, 330], [1120, 300, 1080, 420]].forEach(([a, b, c, d]) => { g.beginPath(); g.moveTo(a, b); g.quadraticCurveTo((a + c) / 2 + 20, (b + d) / 2, c, d); g.stroke(); });
    temple(g, 1046, 126, 1);
    const bx = 930, by = 300;
    flat(g, XY.ellipse(bx, by - 112, 70, 74, 28), '#B8D8A0', 3); flat(g, XY.ellipse(bx, by - 112, 52, 56, 24), '#E8E0A8', 2);
    flat(g, [bx - 78, by + 14, bx - 50, by - 6, bx, by - 12, bx + 50, by - 6, bx + 78, by + 14, bx + 40, by + 26, bx - 40, by + 26], '#E88A9A', 3);
    for (let k = -3; k <= 3; k++) flat(g, [bx + k * 20 - 12, by + 10, bx + k * 20, by - 14, bx + k * 20 + 12, by + 10], k % 2 ? '#F2A8B0' : '#D86A80', 2);
    flat(g, [bx - 64, by - 4, bx - 40, by - 40, bx, by - 46, bx + 40, by - 40, bx + 64, by - 4, bx, by + 4], '#F2C230', 3, true, 418);
    flat(g, [bx - 36, by - 40, bx - 40, by - 110, bx - 20, by - 128, bx + 20, by - 128, bx + 40, by - 110, bx + 36, by - 40], '#F2C230', 3, true, 419);
    flat(g, [bx - 30, by - 70, bx - 4, by - 56, bx + 26, by - 70, bx + 20, by - 50, bx - 24, by - 50], '#E8A020', 2.4);
    flat(g, XY.ellipse(bx, by - 150, 24, 28, 20), '#F2C230', 3); flat(g, XY.ellipse(bx, by - 182, 12, 9, 14), '#3A5A9A', 2.4);
    flat(g, [bx - 26, by - 158, bx - 30, by - 136, bx - 22, by - 132], '#F2C230', 2); flat(g, [bx + 26, by - 158, bx + 30, by - 136, bx + 22, by - 132], '#F2C230', 2);
    g.strokeStyle = OUT; g.lineWidth = 2.2; g.beginPath(); g.moveTo(bx - 14, by - 152); g.quadraticCurveTo(bx - 8, by - 148, bx - 3, by - 152); g.moveTo(bx + 3, by - 152); g.quadraticCurveTo(bx + 8, by - 148, bx + 14, by - 152); g.stroke();
    g.fillStyle = '#C8302A'; g.beginPath(); g.arc(bx, by - 162, 2.6, 0, TAU); g.fill(); g.fillRect(bx - 5, by - 136, 10, 2.6); });
  // a 婆罗树 (sal tree) standing behind the path on the left, and the inscription corner (static sprite in front of the vision)
  const front = (S, W, H) => XY.keep(`c41fr2:${W}:${S.toFixed(3)}`, W * S, H * S, cv => { const g = cv.getContext('2d'); g.scale(S, S);
    flat(g, [128, 652, 172, 652, 166, 520, 162, 380, 150, 260, 140, 262, 146, 380, 140, 520], '#6A3A5A', 3.4, true, 412);
    flat(g, [150, 330, 108, 286, 96, 290, 140, 340], '#6A3A5A', 2.6); flat(g, [160, 300, 210, 250, 220, 258, 166, 314], '#6A3A5A', 2.6);
    void H; void W;
    g.save(); g.beginPath(); g.moveTo(28, 26); g.lineTo(318, 22); g.lineTo(312, 136); g.lineTo(32, 142); g.closePath(); g.fillStyle = '#E8B830'; g.fill(); g.strokeStyle = OUT; g.lineWidth = 2.6; g.stroke(); g.clip();
    const R = XY.rng(413); for (let i = 0; i < 120; i++) K.dab(g, 30 + R() * 290, 26 + R() * 116, -0.4, 14 + R() * 14, 5, R() < 0.5 ? 'rgba(255,240,200,0.18)' : 'rgba(160,100,20,0.14)', 0.2); g.restore();
    g.fillStyle = OUT; g.textBaseline = 'alphabetic'; g.font = XY.font(66, '"Libian SC", "Songti SC", serif'); g.fillText('灵山', 48, 102);
    g.font = XY.font(26, '"Libian SC", "Songti SC", serif'); g.fillText('第四十一难', 182, 96); g.fillRect(182, 108, 116, 2.4); });
  // the Buddha's right hand raised (abhaya), wrist at (0,0), fingers up; the palm opens a vermilion disc with the blue ox in it
  const FING = [[-44, -124, -62, -204, 13, 10], [-16, -132, -22, -240, 14, 11], [14, -134, 14, -252, 14, 11], [42, -128, 54, -232, 13, 10]];
  const ox = g => { // 太上老君's blue ox, single horn, 金刚琢 through the nose (local, centre 0,0, ~110 wide)
    for (const [a, b, c, d] of [[-26, 12, -28, 36], [-14, 14, -12, 38], [14, 14, 12, 38], [26, 12, 28, 36]]) { g.strokeStyle = OUT; g.lineWidth = 10; g.beginPath(); g.moveTo(a, b); g.lineTo(c, d); g.stroke(); g.strokeStyle = '#2E6A8A'; g.lineWidth = 6; g.stroke(); }
    g.strokeStyle = OUT; g.lineWidth = 3; g.beginPath(); g.moveTo(34, -8); g.quadraticCurveTo(48, 0, 44, 18); g.stroke(); flat(g, XY.ellipse(44, 20, 5, 7, 10), '#2E6A8A', 2);
    flat(g, [-34, -10, -20, -24, 18, -24, 36, -14, 38, 8, 24, 18, -26, 18, -38, 6], '#2E6A8A', 2.8); flat(g, [-26, 6, 24, 6, 22, 16, -24, 16], '#6AAEC8', 2);
    flat(g, [-30, -16, -48, -32, -62, -30, -70, -16, -64, -2, -44, 0], '#2E6A8A', 2.8); flat(g, [-62, -14, -72, -12, -72, -2, -62, -2], '#6AAEC8', 2);
    flat(g, [-48, -30, -58, -58, -86, -84, -62, -46, -40, -28], '#F2ECD8', 2.6); flat(g, [-40, -26, -30, -36, -34, -22], '#2E6A8A', 2);
    g.fillStyle = OUT; g.beginPath(); g.arc(-52, -18, 3, 0, TAU); g.fill(); g.strokeStyle = OUT; g.lineWidth = 7; g.beginPath(); g.arc(-74, -4, 10, 0, TAU); g.stroke(); g.strokeStyle = '#F2D040'; g.lineWidth = 4.4; g.stroke(); };
  const palm = (g, open, t, snort) => {
    const Y = '#F2C230', D = '#D8901E', w = 3.4;
    flat(g, [-96, 90, -84, 50, -58, 4, 58, 4, 78, 46, 92, 90, 40, 96, -40, 96], '#C8402A', w); flat(g, [-60, 12, 60, 12, 58, 0, -58, 0], '#F2D040', 2, false);
    g.strokeStyle = OUT; g.lineWidth = 2.4; [[-40, 20, -70, 86], [0, 20, -6, 92], [36, 20, 60, 86]].forEach(([a, b, c, d]) => { g.beginPath(); g.moveTo(a, b); g.quadraticCurveTo((a + c) / 2 + 8, (b + d) / 2, c, d); g.stroke(); });
    FING.forEach(([a, b, c, d, r0, r1], k) => { const wig = 2 * Math.sin(t * 2 + k); XY.path(g, XY.RIG.capsule([a, b], [c + wig, d], r0, r1), true); g.fillStyle = Y; g.fill(); g.strokeStyle = OUT; g.lineWidth = w; g.stroke();
      g.save(); g.clip(); g.fillStyle = D; g.fillRect(Math.min(a, c) - 20, d - 20, 9 + (k ? 0 : 6), b - d + 40); g.restore();
      for (const q of [0.38, 0.68]) { const x = XY.lerp(a, c + wig, q), y = XY.lerp(b, d, q); g.strokeStyle = OUT; g.lineWidth = 2; g.beginPath(); g.moveTo(x - r0 * 0.6, y + 2); g.quadraticCurveTo(x, y - 3, x + r0 * 0.6, y + 2); g.stroke(); } });
    XY.path(g, XY.RIG.capsule([52, -54], [86, -98], 15, 13), true); g.fillStyle = Y; g.fill(); g.strokeStyle = OUT; g.lineWidth = w; g.stroke();
    XY.path(g, XY.RIG.capsule([86, -98], [96, -132], 13, 11), true); g.fill(); g.stroke();
    flat(g, [-44, 0, -52, -44, -58, -96, -56, -130, -20, -140, 20, -142, 54, -134, 62, -100, 64, -64, 52, -26, 44, 0], Y, w, true);
    g.save(); XY.path(g, XY.RIG.spline([-44, 0, -52, -44, -58, -96, -56, -130, -20, -140, 20, -142, 54, -134, 62, -100, 64, -64, 52, -26, 44, 0], true, 5), true); g.clip(); flat(g, [-70, 10, -36, 10, -42, -60, -40, -150, -80, -150], D, 0.1, false); g.restore();
    g.strokeStyle = OUT; g.lineWidth = 2.2; g.beginPath(); g.moveTo(-46, -86); g.quadraticCurveTo(-4, -70, 46, -96); g.moveTo(-40, -108); g.quadraticCurveTo(0, -102, 30, -118); g.moveTo(26, -22); g.quadraticCurveTo(22, -60, 44, -86); g.stroke();
    if (open > 0) { const r = 58 * XY.easeOut(open); flat(g, XY.ellipse(0, -74, r, r, 30), '#E8642A', 3.4); flat(g, XY.ellipse(0, -74, r * 0.8, r * 0.8, 26), '#F2945A', 0.1);
      if (open > 0.4) { g.save(); g.beginPath(); g.arc(0, -74, r - 3, 0, TAU); g.clip(); const s = 0.82 * r / 58; g.translate(6, -76); g.scale(s, s); ox(g);
        if (snort > 0) for (let k = 0; k < 3; k++) { const f = (snort * 1.6 + k * 0.3) % 1; g.fillStyle = `rgba(242,236,216,${0.9 * (1 - f)})`; g.beginPath(); g.arc(-78 - 18 * f, -2 + 6 * f + k * 3, 3 + 5 * f, 0, TAU); g.fill(); }
        g.restore(); } }
  };
  const CLOUDS = [[120, 120, 70], [470, 60, 90], [820, 40, 60], [1100, 120, 70]];

  XY.STYLES.gauguin = {
    hits: [RISE, OPEN],
    post(cv, g, e) { K.punch(cv, g, e, 770, 300, 1 + 0.12 * K.env(e.beat, OPEN + 0.1, 0.3, 1.5)); },
    bg(g, W, H) {
      g.lineCap = 'round';
      const band = (y0, y1, fill, seed, pal) => { g.fillStyle = fill; g.fillRect(0, y0, W, y1 - y0); const R = XY.rng(seed);
        for (let i = 0; i < W * (y1 - y0) / 180; i++) K.dab(g, R() * W, y0 + R() * (y1 - y0), -0.5 + (R() - 0.5) * 0.5, 14 + R() * 18, 6, pal[Math.floor(R() * pal.length)], 0.2); };
      band(0, SKY + 30, '#E8B04A', 4101, ['rgba(255,236,170,0.22)', 'rgba(200,120,30,0.16)', 'rgba(250,200,90,0.2)']);
      // the meadow below 灵山: flat emerald with violet shadow shapes, a pale path of pink sand where the pilgrims walk
      const top = x => SKY + 10 * Math.sin(x / 120);
      g.fillStyle = '#3E8A5A'; g.beginPath(); g.moveTo(0, top(0)); for (let x = 0; x <= W; x += 20) g.lineTo(x, top(x)); g.lineTo(W, GRD); g.lineTo(0, GRD); g.fill();
      { const R = XY.rng(4102); for (let i = 0; i < W * (GRD - SKY) / 170; i++) K.dab(g, R() * W, SKY + 10 + R() * (GRD - SKY - 10), -0.4 + (R() - 0.5) * 0.4, 16 + R() * 22, 7, ['rgba(120,200,120,0.18)', 'rgba(20,60,50,0.18)', 'rgba(200,220,120,0.12)'][Math.floor(R() * 3)], 0.2); }
      [[60, 400, 320, 380, 420, 470, 120, 500], [380, 560, 640, 530, 760, 600, 420, 620], [40, 580, 200, 560, 240, 630, 30, 636]].forEach((p, k) => flat(g, p, ['#6A4A8A', '#5A3A7A', '#7A5A9A'][k], 2.4, true, 430 + k));
      [[300, 300, 40], [520, 250, 30], [660, 420, 26], [250, 470, 22]].forEach(([x, y, r], k) => { flat(g, [x - 4, y + r * 2.6, x + 4, y + r * 2.6, x + 3, y, x - 3, y], '#6A3A5A', 2, false); flat(g, [x - r, y + r * 0.3, x - r * 1.1, y - r * 0.4, x - r * 0.4, y - r * 0.9, x + r * 0.2, y - r * 0.6, x + r * 0.9, y - r * 0.8, x + r * 1.1, y, x + r * 0.5, y + r * 0.5], k % 2 ? '#2E7A4A' : '#5A9A3A', 2.4, true, 440 + k); });
      g.strokeStyle = OUT; g.lineWidth = 3; g.beginPath(); for (let x = 0; x <= W; x += 20) { const y = top(x); x ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke();
      g.fillStyle = '#E8A090'; g.beginPath(); g.moveTo(0, GRD + 6); g.bezierCurveTo(300, GRD - 10, 800, GRD + 14, W, GRD - 4); g.lineTo(W, H); g.lineTo(0, H); g.fill();
      g.beginPath(); g.moveTo(0, GRD + 6); g.bezierCurveTo(300, GRD - 10, 800, GRD + 14, W, GRD - 4); g.stroke();
      { const R = XY.rng(4103); for (let i = 0; i < 260; i++) K.dab(g, R() * W, GRD + 8 + R() * (H - GRD), -0.3, 16 + R() * 16, 6, R() < 0.5 ? 'rgba(250,200,180,0.3)' : 'rgba(150,70,90,0.18)', 0.2); }
      for (let k = 0; k < 16; k++) { const x = 30 + k * 74 + 20 * XY.hash(k, 1), y = 748 + 18 * XY.hash(k, 2), r = 8 + 5 * XY.hash(k, 3), c = ['#F2A030', '#F2D040', '#E85A3A', '#F2ECD8'][k % 4];
        for (let j = 0; j < 5; j++) { const a = j / 5 * TAU; flat(g, XY.ellipse(x + Math.cos(a) * r, y + Math.sin(a) * r, r * 0.7, r * 0.55, 10, a), c, 1.8, false); }
        flat(g, XY.ellipse(x, y, r * 0.45, r * 0.45, 10), '#1F3A6A', 1, false); }
    },
    draw(g, e) {
      const { W, H, t, u, beat, S } = e;
      CLOUDS.forEach(([x, y, r], k) => { const cx = ((x + t * (6 + 3 * k)) % (W + 240)) - 120; flat(g, [cx - r, y + 10, cx - r * 0.6, y - 16, cx - r * 0.1, y - 26, cx + r * 0.5, y - 18, cx + r, y + 8, cx + r * 0.3, y + 20, cx - r * 0.4, y + 20], '#F6F0DC', 2.6); });
      // the Buddha's halo breathes as he decides
      { const p = 0.5 + 0.5 * Math.sin(t * 2.4); g.strokeStyle = `rgba(242,236,216,${0.35 + 0.4 * p})`; g.lineWidth = 6; g.beginPath(); g.arc(930, 188, 82 + 6 * p, 0, TAU); g.stroke(); }
      g.drawImage(vision(S, W, H), 0, 0, W, H);
      g.drawImage(front(S, W, H), 0, 0, W, H);
      // the sal tree's flat leaf masses sway
      [[150, 250, 0, '#2E7A4A', 70], [100, 290, 0.6, '#5A9A3A', 48], [215, 262, -0.4, '#1E5A3A', 54], [130, 210, 1.2, '#3E8A3A', 44], [190, 214, -1, '#2E7A4A', 46]].forEach(([x, y, a, c, r], k) => {
        g.save(); g.translate(x + 3 * Math.sin(t * 1.4 + k), y); g.rotate(0.06 * Math.sin(t * 1.3 + k)); flat(g, [-r, 6, -r * 0.6, -r * 0.5, 0, -r * 0.7, r * 0.6, -r * 0.5, r, 6, r * 0.5, r * 0.4, -r * 0.5, r * 0.4], c, 2.6);
        g.strokeStyle = OUT; g.lineWidth = 1.4; for (let j = -1; j <= 1; j++) { g.beginPath(); g.moveTo(j * r * 0.4, r * 0.3); g.lineTo(j * r * 0.5 + a * 4, -r * 0.4); g.stroke(); } g.restore(); });
      // 十八罗汉 fly out from the temple on a cloud (he sends them with 金丹砂), and pour the sand at the end
      const fly = XY.easeIO(K.ramp(beat, 1.6, 3.6)), ax = XY.lerp(1010, 470, fly), ay = XY.lerp(120, 236, fly) + 4 * Math.sin(t * 2), sc = XY.lerp(0.6, 1, fly);
      g.save(); g.translate(ax, ay); g.scale(sc, sc);
      if (fly > 0 && fly < 1) for (let k = 0; k < 8; k++) { g.globalAlpha = 0.6 * (1 - k / 8); flat(g, XY.ellipse(70 + k * 26, 12, 30 - k * 2, 9, 12), '#F6F0DC', 1.4); } g.globalAlpha = 1;
      flat(g, [-120, 14, -96, -8, -10, -14, 80, -10, 116, 12, 70, 26, -80, 28], '#F6F0DC', 2.6);
      for (let k = 0; k < 5; k++) { const x = -88 + k * 44, y = 4 + 2 * Math.sin(t * 2 + k), on = (K.step(t, 2) + k) % 2;
        flat(g, XY.ellipse(x, y - 30, 15, 15, 16), on ? '#F2ECD8' : '#B8D8A0', 2); flat(g, [x - 14, y + 2, x - 12, y - 18, x, y - 24, x + 12, y - 18, x + 14, y + 2], '#E8782A', 2.2);
        flat(g, XY.ellipse(x, y - 30, 8, 8.5, 12), '#C8905E', 1.8); }
      g.restore();
      const sand = K.ramp(beat, SAND, SAND + 0.5); if (sand > 0) for (let k = 0; k < 60; k++) { const f = (t * 0.8 + XY.hash(k, 7)) % 1, x = ax - 110 + XY.hash(k, 8) * 220 + 30 * f, y = ay + 28 + f * 380;
        g.fillStyle = `rgba(242,208,64,${sand * (1 - f)})`; g.beginPath(); g.arc(x, y, 2.8, 0, TAU); g.fill(); }
      // the hand rises from the Buddha's raised palm and grows huge; its palm opens on the root of it all
      const gr = XY.easeOut(K.ramp(beat, RISE - 0.45, RISE)), op = K.ramp(beat, OPEN - 0.2, OPEN + 0.2), sn = beat > SNORT ? (beat - SNORT) * XY.BEAT : 0;
      if (gr > 0.01) { const s = XY.lerp(0.25, 1.15, gr), x = XY.lerp(900, 770, gr), y = XY.lerp(250, 380, gr) + 3 * Math.sin(t * 1.6);
        g.save(); g.translate(x, y); g.rotate(-0.06 + 0.02 * Math.sin(t * 1.3)); g.scale(s, s); palm(g, op, t, sn > 0 && sn < 1.2 ? sn : 0); g.restore();
        const fl = K.hit(beat, OPEN, 2.5); if (fl > 0.02) { g.strokeStyle = `rgba(242,236,216,${fl})`; g.lineWidth = 6; for (let j = 0; j < 14; j++) { const a = j / 14 * TAU, r0 = 80, r1 = 80 + 90 * (1 - fl); g.beginPath(); g.moveTo(x + Math.cos(a) * r0, y - 86 + Math.sin(a) * r0); g.lineTo(x + Math.cos(a) * r1, y - 86 + Math.sin(a) * r1); g.stroke(); } } }
      // the procession: flat symbolic colour, heavy blue contour, a breath of brush inside (悟空's staff: the engine's cast drops it here)
      const acts = { wukong: { shade: K.ramp(beat, 1.6, 2.1) * (1 - K.ramp(beat, 6.4, 7.0)) }, monk: { palm: K.ramp(beat, OPEN - 0.2, OPEN + 0.2) * (1 - K.ramp(u, 0.9, 1)) },
        bajie: { scratch: K.ramp(beat, 2.4, 2.8) * (1 - K.ramp(beat, 3.8, 4.2)) }, shaseng: { lift: K.ramp(beat, 6.2, 6.6) * (1 - K.ramp(beat, 7.3, 7.8)) } };
      const L = K.procLayer('c41', e, 330, 40); K.drawProc(L.g, e, PEN, acts);
      K.pat(L, K.strokeTile('c41st', S, 110, 160, ['rgba(255,255,240,0.14)', 'rgba(40,20,70,0.14)'], { len: 14, w: 5, seed: 41, ang: () => -0.6 }), 'source-atop');
      K.put(g, L);
      // a white crane paces the near ground and pecks (in front of the path, only after the pilgrims have passed)
      { const x = 1040 + 50 * Math.sin(t * 0.5), dir = Math.cos(t * 0.5) >= 0 ? 1 : -1, pk = Math.max(0, Math.sin(t * 3.1)) ** 4, y = 762;
        g.save(); g.translate(x, y); g.scale(dir, 1);
        g.strokeStyle = OUT; g.lineWidth = 2.4; g.beginPath(); g.moveTo(-4, -2); g.lineTo(-6 + 3 * Math.sin(t * 6), 18); g.moveTo(6, -2); g.lineTo(8 - 3 * Math.sin(t * 6), 18); g.stroke();
        flat(g, [-34, -10, -14, -30, 14, -28, 26, -14, 12, 0, -24, 0], '#F2ECD8', 2.4); flat(g, [-34, -10, -46, -4, -40, -16], '#1F3A6A', 1.6);
        flat(g, [14, -26, 18 + 6 * pk, -58 + 30 * pk, 24 + 8 * pk, -62 + 30 * pk, 24, -24], '#F2ECD8', 2.2); flat(g, XY.ellipse(22 + 8 * pk, -64 + 30 * pk, 6, 5, 10), '#C8302A', 1.4);
        flat(g, [26 + 8 * pk, -64 + 30 * pk, 46 + 8 * pk, -58 + 32 * pk, 26 + 8 * pk, -60 + 30 * pk], '#E8A020', 1.4, false); g.restore(); }
      // entrance: only the Prussian-blue cloisons at first; colour floods each cell from its centre
      const fp = K.ramp(u, -0.45, 0.08); if (fp < 1) { const L2 = K.layer('c41in', e, 0, 0, W, H), q = L2.g; q.fillStyle = '#EFE6D2'; q.fillRect(0, 0, W, H);
        q.strokeStyle = OUT; q.lineWidth = 3; PEAKS.forEach(([p]) => { XY.path(q, p, true); q.stroke(); }); q.beginPath(); for (let x = 0; x <= W; x += 20) q.lineTo(x, SKY + 10 * Math.sin(x / 120)); q.stroke();
        q.beginPath(); q.moveTo(0, GRD + 6); q.bezierCurveTo(300, GRD - 10, 800, GRD + 14, W, GRD - 4); q.stroke(); q.beginPath(); q.arc(930, 188, 74, 0, TAU); q.stroke();
        q.globalCompositeOperation = 'destination-out'; [[930, 300, 0], [1040, 200, 0.1], [700, 300, 0.2], [600, 100, 0.25], [200, 120, 0.35], [400, 400, 0.45], [900, 520, 0.55], [600, 720, 0.7], [150, 720, 0.8]].forEach(([x, y, d]) => {
          const r = 700 * XY.easeIn(XY.clamp((fp - d * 0.75) / 0.4)); if (r > 0) { q.beginPath(); q.arc(x, y, r, 0, TAU); q.fill(); } }); K.put(g, L2); }
    },
  };
})();
