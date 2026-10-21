// 38 印象派 · 1870 年 · 鱼篮现身 — 第四十九回：观音未梳妆，提一只紫竹篮到通天河，念「死的去，活的住」，提起来篮里一尾金鱼
// 还眨眼动鳞，正是作怪的灵感大王；陈家庄人赶来下拜，有会画的画下「鱼篮观音」，老鼋浮上来要驮他们过河。
// 晨雾里的通天河：橙色的日头正好是观音的头光，倒影柱在她脚下颤；全画、观音和队伍都是并置的短笔触（学的是印象派的破色与光，不搬原作构图）。
(() => {
  'use strict';
  const XY = window.XY, K = XY.KIT_E, TAU = XY.TAU;
  const BANK = 334, NEAR = 652, GX = 930, GY = 522, SUN = [930, 238], LIFT = 4.5, BLINK = 5.0, KNEEL = 5.1, CAPTURE = 6.2;
  const SKY = ['#B9B3CC', '#C9BFD2', '#A9AFC9', '#D8C7C4', '#B7C0D6', '#CDB9C9', '#C2C6D8'], SKYW = ['#E7A77A', '#F0BE8A', '#DFA08A', '#F2CFA0', '#E89068', '#EDB79A'];
  const FARB = ['#7E86A8', '#8A8FAE', '#6F7898', '#9A94B0', '#7B8AA2'], WAT = ['#5D7B9E', '#6E8CAE', '#7F96B5', '#506E92', '#8C9DBA', '#6A7FA6', '#94A8C2', '#7A86B0'];
  const WATW = ['#E07A3E', '#F09550', '#D9673A', '#F4B070', '#E8A060'], GRASS = ['#6E8F4E', '#86A35A', '#5C7D45', '#A0B060', '#C2B46A', '#7C9A72', '#93A85E'], POPPY = ['#D9452C', '#E2603A', '#C93A2A'];
  const COL = { fur: '#B0743E', face: '#F0C9A0', wkshirt: '#D2563A', tiger: '#E9A640', stripe: '#5A4030', gold: '#F2C54E', staff: '#C0402A', ink: '#3A3450', horse: '#F3EEE6', horse2: '#D3CBD8',
    mane: '#E9E3EA', hoof: '#5A5068', saddle: '#8A3A2E', red: '#C9452E', robe: '#EEC970', kasaya: '#C8402E', skin: '#F2D2B4', metal: '#D8B24C', bjrobe: '#3E4660', bjpants: '#353B52',
    pig: '#F2B9B2', pig2: '#DE968F', wood: '#9A6A3E', ssrobe: '#4D6E86', ssrobe2: '#3E5A70', skin2: '#C69872', ssh: '#B9533A', ssbeard: '#A4472F', skull: '#F1ECE0', bundle: '#DDAE52' };
  const PEN = { color: r => COL[r], shade: 'rgba(96,84,150,0.24)' }, SIL = { color: () => '#000', shade: false, fine: false };
  // paint a closed shape with dabs clipped to it (design units)
  const dabFill = (g, pts, pal, step, seed, ang = () => 0, len = 10, w = 4, base) => {
    g.save(); XY.path(g, XY.RIG.spline(pts, true, 5), true); if (base) { g.fillStyle = base; g.fill(); } g.clip(); g.lineCap = 'round';
    let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9; for (let k = 0; k < pts.length; k += 2) { x0 = Math.min(x0, pts[k]); x1 = Math.max(x1, pts[k]); y0 = Math.min(y0, pts[k + 1]); y1 = Math.max(y1, pts[k + 1]); }
    K.field(x0 - step, y0 - step, x1 + step, y1 + step, step, seed, (x, y, R) => K.dab(g, x, y, ang(x, y, R), len * (0.7 + 0.6 * R()), w * (0.8 + 0.4 * R()), typeof pal === 'function' ? pal(x, y, R) : pal[Math.floor(R() * pal.length)]));
    g.restore();
  };
  // 观音 as the novel has her that morning: 散挽一窝丝 (a loose knot of hair), 贴身小袄 (a fitted short jacket), 漫腰束锦裙 (a brocade skirt
  // tied at the waist), bare arms, bare feet, standing on a lotus. Sprite 240×340, feet at (120, 322); the left arm is drawn live.
  const guanyin = S => XY.keep(`c38gy2:${S.toFixed(3)}`, 240 * S, 340 * S, cv => { const g = cv.getContext('2d'); g.scale(S, S);
    dabFill(g, [40, 330, 70, 312, 120, 306, 172, 312, 200, 330, 160, 340, 80, 340], ['#5E8A72', '#6E9A7A', '#4F7A66'], 5, 11, () => 0.05, 9, 3.4, '#5E8A72');
    for (let k = 0; k < 9; k++) { const a = Math.PI + (k + 0.5) / 9 * Math.PI; dabFill(g, [120 + Math.cos(a) * 14, 320 + Math.sin(a) * 6, 120 + Math.cos(a) * 46, 320 + Math.sin(a) * 26, 120 + Math.cos(a + 0.18) * 30, 320 + Math.sin(a + 0.18) * 14], ['#F2C6CC', '#FBE4E6', '#E89AA8'], 3, 30 + k, () => a, 8, 3, '#F2C6CC'); }
    [[108, 318], [134, 320]].forEach(([x, y]) => dabFill(g, [x - 9, y, x - 6, y - 8, x + 6, y - 8, x + 10, y], ['#F2D2B8', '#EBC3A6'], 3, 12, () => 0, 6, 2.6, '#F0CDB2'));
    const skirt = [96, 160, 146, 160, 156, 220, 170, 282, 180, 306, 150, 312, 120, 307, 90, 312, 62, 306, 74, 282, 86, 220];
    dabFill(g, skirt, (x, y, R) => (Math.abs(((y - 196) % 40)) < 6 ? ['#E2B84A', '#F2D27A', '#C8962E'] : x < 100 ? ['#2E5A6E', '#2A4E66', '#3E6A80'] : ['#3E7A86', '#4E8E96', '#5A9AA0', '#B05A7A'])[Math.floor(R() * 3)], 4, 13, (x, y) => 1.5 + 0.12 * Math.sin(y / 20), 11, 3.6, '#3E7A86');
    dabFill(g, [92, 154, 150, 154, 150, 168, 92, 168], ['#C8402E', '#D85A3A', '#B0302A'], 3, 14, () => 0, 9, 3, '#C8402E');
    dabFill(g, [98, 166, 108, 166, 104, 232, 94, 228], ['#C8402E', '#D85A3A'], 3, 15, () => 1.5, 8, 3, '#C8402E');
    const jacket = [102, 72, 121, 66, 140, 72, 150, 100, 148, 140, 148, 158, 94, 158, 94, 140, 92, 100];
    dabFill(g, jacket, (x, y, R) => (x < 106 ? ['#C8C2DE', '#B8B4D4'] : x > 138 ? ['#FBE4C8', '#F6D4B0'] : ['#F6F2EA', '#ECE6EE', '#FFFDF4'])[Math.floor(R() * 2)], 3.5, 16, () => 1.4, 9, 3.2, '#F2EEE6');
    dabFill(g, [140, 76, 152, 80, 164, 124, 156, 130, 146, 104], ['#F2D2B8', '#EBC3A6', '#F8E0CA'], 3, 17, () => 1.2, 8, 3, '#F0CDB2');
    dabFill(g, [156, 124, 164, 128, 146, 112, 134, 108, 132, 100, 142, 102], ['#F2D2B8', '#F8E0CA'], 3, 18, () => 2.4, 7, 2.8, '#F0CDB2');
    dabFill(g, [114, 58, 128, 58, 128, 70, 114, 70], ['#F0CDB2'], 3, 19, () => 1.5, 6, 2.6, '#F0CDB2');
    dabFill(g, XY.ellipse(121, 44, 14, 16, 16), ['#F2D2B8', '#EBC3A6', '#F8E0CA'], 3, 20, () => 0.9, 6, 2.6, '#F0CDB2');
    dabFill(g, [104, 40, 108, 24, 122, 18, 136, 24, 138, 40, 132, 32, 120, 30, 110, 34], ['#3E3048', '#4E3A52', '#2E2638'], 3, 21, () => 0.3, 8, 2.6, '#3E3048');
    dabFill(g, XY.ellipse(132, 22, 13, 10, 14), ['#3E3048', '#4E3A52', '#5A4660'], 3, 22, () => 0.8, 8, 2.6, '#3E3048');
    g.strokeStyle = '#3E3048'; g.lineWidth = 2; g.lineCap = 'round'; [[134, 30, 150, 60, 146, 88], [138, 26, 158, 48, 162, 74], [106, 38, 100, 56, 104, 76]].forEach(([a, b, c, d, x, y]) => { g.beginPath(); g.moveTo(a, b); g.quadraticCurveTo(c, d, x, y); g.stroke(); });
    g.strokeStyle = '#8A6A70'; g.lineWidth = 1.4; g.beginPath(); g.moveTo(112, 44); g.lineTo(118, 45); g.moveTo(124, 45); g.lineTo(130, 44); g.stroke(); g.fillStyle = '#C8705E'; g.fillRect(118, 53, 6, 2); });
  // a 陈家庄 villager (local, feet at 0,0, ~76 tall): running, standing, or kneeling (k 0..1)
  const villager = (g, x, y, s, kneel, run, cols, hat) => { g.save(); g.translate(x, y); g.scale(s, s); g.lineCap = 'round'; const b = kneel * 22;
    g.strokeStyle = cols[1]; g.lineWidth = 7; g.beginPath(); g.moveTo(-2, -34 + b); g.lineTo(-8 - 6 * run, -2 + (kneel ? -6 : 0)); g.moveTo(2, -34 + b); g.lineTo(kneel ? 16 : 8 + 6 * run, kneel ? -2 : 0); g.stroke();
    dabFill(g, [-12, -34 + b, -10, -60 + b * 1.1, 2, -66 + b * 1.2, 12, -58 + b, 14, -34 + b], [cols[0], cols[1]], 3, 60, () => 1.4, 8, 3.4, cols[0]);
    g.strokeStyle = cols[0]; g.lineWidth = 6; g.beginPath(); g.moveTo(8, -58 + b); g.lineTo(kneel ? 22 : 18 + 4 * run, kneel ? -46 + b : -44 - 8 * run + b); g.stroke();
    const hx = 4 + 10 * kneel, hy = -72 + b * 1.25; g.fillStyle = '#E8C49A'; g.beginPath(); g.arc(hx, hy, 8, 0, TAU); g.fill();
    if (hat) { g.fillStyle = '#C9A25A'; g.beginPath(); g.moveTo(hx - 15, hy - 1); g.lineTo(hx, hy - 15); g.lineTo(hx + 15, hy - 1); g.fill(); } else { g.fillStyle = '#3A3040'; g.beginPath(); g.arc(hx - 2, hy - 6, 6, 0, TAU); g.fill(); }
    g.restore(); };
  const bankTop = x => BANK - 10 - 16 * Math.max(0, XY.noise1(x / 130, 3)) - 6 * XY.noise1(x / 31, 4);
  const inRefl = (x, y) => Math.abs(x - SUN[0]) < 26 + (y - BANK) * 0.16;
  // the raw canvas with the charcoal lay-in, shown before the paint arrives
  const raw = (S, W, H) => XY.keep(`c38raw:${W}:${S.toFixed(3)}`, W * S, H * S, cv => { const g = cv.getContext('2d'), R = XY.rng(381); g.scale(S, S);
    g.fillStyle = '#E6DCC6'; g.fillRect(0, 0, W, H);
    for (let i = 0; i < 2600; i++) { g.fillStyle = R() < 0.5 ? 'rgba(160,140,100,0.12)' : 'rgba(255,250,235,0.3)'; g.fillRect(R() * W, R() * H, 1 + R() * 2, 0.6); }
    g.strokeStyle = 'rgba(60,50,40,0.55)'; g.lineWidth = 1.6; g.lineCap = 'round';
    const line = pts => { g.beginPath(); pts.forEach((p, k) => (k ? g.lineTo(p[0] + 1.5 * XY.noise1(k, 3), p[1]) : g.moveTo(p[0], p[1]))); g.stroke(); };
    line([[0, BANK], [W, BANK + 4]]); line([[0, NEAR], [W * 0.5, NEAR - 6], [W, NEAR + 2]]); g.beginPath(); g.arc(SUN[0], SUN[1], 34, 0, TAU); g.stroke();
    line([[GX - 30, 300], [GX - 40, 470], [GX - 56, GY]]); line([[GX + 20, 300], [GX + 36, 470], [GX + 50, GY]]); g.beginPath(); g.arc(GX, 280, 18, 0, TAU); g.stroke();
    for (let k = 0; k < 40; k++) { const x = R() * W, y = 660 + R() * 110; line([[x, y], [x + 4, y - 16 - R() * 14]]); }
    for (let k = 0; k < 7; k++) { const x = 60 + k * 120 + R() * 40; line([[x, bankTop(x)], [x, bankTop(x) - 20 - R() * 30]]); } });
  // paint dabs used by the entrance, ordered outward from the sun
  const REVEAL = (() => { const R = XY.rng(3838), o = []; for (let i = 0; i < 520; i++) { const x = R() * 1200 - 10, y = R() * 800 - 10; o.push([x, y, Math.hypot(x - SUN[0], (y - SUN[1]) * 1.3) + 60 * R(), R() * Math.PI]); }
    return o.sort((a, b) => a[2] - b[2]); })();

  XY.STYLES.impressionism = {
    hits: [LIFT, CAPTURE],
    post(cv, g, e) { K.punch(cv, g, e, GX - 70, GY - 120, 1 + 0.1 * K.env(e.beat, LIFT + 0.1, 0.25, 1.5)); },
    bg(g, W, H, c, S) {
      g.lineCap = 'round';
      g.fillStyle = '#BDB6CB'; g.fillRect(0, 0, W, BANK + 10); g.fillStyle = '#6E87A6'; g.fillRect(0, BANK, W, NEAR - BANK + 6); g.fillStyle = '#7C9550'; g.fillRect(0, NEAR, W, H - NEAR);
      // sky: lilac haze, warming toward the sun
      { const R = XY.rng(3800); for (let i = 0; i < 90; i++) { const x = R() * W, y = R() * BANK, d = Math.hypot(x - SUN[0], (y - SUN[1]) * 1.4), pal = R() < XY.clamp(1 - d / 300) ? SKYW : SKY;
        g.globalAlpha = 0.35; g.fillStyle = pal[Math.floor(R() * pal.length)]; g.beginPath(); g.ellipse(x, y, 60 + R() * 120, 20 + R() * 40, -0.2, 0, TAU); g.fill(); } g.globalAlpha = 1; }
      K.field(-6, -6, W + 6, BANK + 8, 10, 3801, (x, y, R) => { const d = Math.hypot(x - SUN[0], (y - SUN[1]) * 1.4), w = XY.clamp(1 - d / 300);
        const pal = R() < w * 0.9 ? SKYW : SKY; g.globalAlpha = 0.55 + 0.45 * R(); K.dab(g, x, y, -0.06 + (R() - 0.5) * 0.45 + 0.35 * XY.noise2(x / 220, y / 160, 2), 10 + R() * 30, 3.5 + R() * 5, pal[Math.floor(R() * pal.length)]); }); g.globalAlpha = 1;
      // far bank: 陈家庄 roofs, the temple, masts, all in blue-violet haze
      g.fillStyle = '#868CAB'; g.beginPath(); g.moveTo(0, BANK + 6); for (let x = 0; x <= W; x += 10) g.lineTo(x, bankTop(x)); g.lineTo(W, BANK + 6); g.fill();
      K.field(0, BANK - 50, W, BANK + 6, 5, 3802, (x, y, R) => { if (y < bankTop(x)) return; K.dab(g, x, y, Math.PI / 2 + (R() - 0.5) * 0.5, 7 + R() * 5, 3, FARB[Math.floor(R() * FARB.length)]); });
      [[150, 24], [210, 16], [380, 34], [440, 20], [590, 14], [1060, 22], [1120, 30]].forEach(([x, h], k) => { const y = bankTop(x); g.fillStyle = k % 2 ? '#6C7194' : '#777C9E';
        g.beginPath(); g.moveTo(x - h, y + 2); g.quadraticCurveTo(x, y - h * 0.9, x + h, y + 2); g.fill(); g.fillRect(x - h * 0.6, y, h * 1.2, 6); });
      g.strokeStyle = 'rgba(80,84,120,0.75)'; [[250, 70], [262, 54], [640, 80], [700, 60], [712, 74]].forEach(([x, h]) => { g.lineWidth = 2.2; g.beginPath(); g.moveTo(x, BANK); g.lineTo(x + 2, BANK - h); g.stroke(); g.lineWidth = 1.2; g.beginPath(); g.moveTo(x - 14, BANK - h * 0.7); g.lineTo(x + 16, BANK - h * 0.72); g.stroke(); });
      K.field(-6, BANK - 70, W + 6, BANK + 4, 9, 3803, (x, y, R) => { if (R() < 0.55) return; g.globalAlpha = 0.35; K.dab(g, x, y, (R() - 0.5) * 0.3, 18 + R() * 14, 5, SKY[Math.floor(R() * SKY.length)]); g.globalAlpha = 1; });
      // the sun, flat and burning (same value as the sky, hotter hue)
      g.fillStyle = '#F06A2A'; g.beginPath(); g.arc(SUN[0], SUN[1], 32, 0, TAU); g.fill();
      for (let k = 0; k < 26; k++) { const a = k / 26 * TAU; K.dab(g, SUN[0] + Math.cos(a) * 24, SUN[1] + Math.sin(a) * 24, a + Math.PI / 2, 10, 4, k % 3 ? '#F27A34' : '#F59A48'); }
      // water: horizontal broken colour, the reflection column orange
      K.field(-6, BANK + 2, W + 6, NEAR + 4, 7, 3804, (x, y, R) => { const q = (y - BANK) / (NEAR - BANK), refl = inRefl(x, y) && R() < 0.8;
        const pal = refl ? WATW : WAT, c = refl ? pal[Math.floor(R() * pal.length)] : pal[Math.floor(XY.clamp(R() * 0.7 + q * 0.4 + 0.2 * XY.noise2(x / 90, y / 40, 5), 0, 0.999) * pal.length)];
        g.globalAlpha = 0.6 + 0.4 * R(); K.dab(g, x + (R() - 0.5) * 8, y, (R() - 0.5) * 0.12, 10 + R() * 34 * (0.5 + q), 2.5 + 3.5 * q + 1.5 * R(), c, 0.15); }); g.globalAlpha = 1;
      // dark wave marks in the near water, as in the harbour at dawn
      K.field(0, BANK + 120, W, NEAR - 6, 26, 3808, (x, y, R) => { if (R() < 0.68 || inRefl(x, y)) return; const q = (y - BANK) / (NEAR - BANK); g.strokeStyle = R() < 0.6 ? '#3E4A78' : '#4E5E8E'; g.lineWidth = 2 + 2.5 * q;
        const l = (8 + 14 * q) * (0.6 + 0.8 * R()); g.beginPath(); g.moveTo(x - l, y + 1); g.quadraticCurveTo(x - l * 0.2, y - 3 - 4 * q * R(), x + l, y + 2 * (R() - 0.5)); g.stroke(); });
      g.globalAlpha = 0.5; K.field(0, BANK + 6, W, BANK + 60, 8, 3805, (x, y, R) => K.dab(g, x, y, 0, 20, 3, R() < 0.5 ? '#9AA2C2' : '#8590B0')); g.globalAlpha = 1;
      // near bank: grass flicks and poppies
      K.field(-6, NEAR - 4, W + 6, H + 6, 6, 3806, (x, y, R) => { const c = R() < 0.05 ? POPPY[Math.floor(R() * 3)] : GRASS[Math.floor(R() * GRASS.length)];
        K.dab(g, x, y, -Math.PI / 2 + (R() - 0.5) * 0.9, 9 + R() * 8, 3 + R() * 2, c); });
      g.globalAlpha = 0.6; K.field(0, NEAR - 6, W, NEAR + 8, 7, 3807, (x, y, R) => K.dab(g, x, y, 0.02, 16, 3, R() < 0.5 ? '#4E6A4E' : '#5C6F8A')); g.globalAlpha = 1;
      // canvas weave everywhere, and the painter's signature lower left
      const weave = K.tile('c38weave', S, 6, (t, T) => { t.fillStyle = 'rgba(80,60,40,0.10)'; t.fillRect(0, 0, T, 1); t.fillRect(0, T / 2, T, 0.7); t.fillStyle = 'rgba(255,250,235,0.10)'; t.fillRect(0, 0, 1, T); t.fillRect(T / 2, 0, 0.7, T); });
      K.panelPat(g, { W, H, S }, weave, 'source-over', 1);
      g.fillStyle = '#D4512B'; g.textBaseline = 'alphabetic'; g.font = XY.font(46, '"HanziPen SC", "Kaiti SC", serif'); g.fillText('鱼篮', 40, 760);
      g.font = XY.font(26, '"HanziPen SC", "Kaiti SC", serif'); g.fillText('第38难', 148, 758);
      g.strokeStyle = '#D4512B'; g.lineWidth = 2; g.beginPath(); g.moveTo(42, 768); g.quadraticCurveTo(120, 774, 236, 764); g.stroke();
      void c;
    },
    draw(g, e) {
      const { W, H, t, u, beat, S } = e; g.lineCap = 'round';
      // ---- the reflection column trembles under her, glints wink on the water
      for (let k = 0; k < 24; k++) { const q = k / 24, y = BANK + 8 + q * (NEAR - BANK - 14), j = XY.noise1(t * 2.2 + k * 0.7, 5) * (8 + q * 34), w = 8 + q * 34 * (0.5 + 0.5 * Math.sin(t * 3 + k));
        if (y > GY - 30 && y < GY + 26) continue; g.globalAlpha = 0.45 + 0.45 * Math.sin(t * 5 + k * 1.7); K.dab(g, SUN[0] + j, y, 0.03 * Math.sin(k), w, 3 + q * 3, ['#F28A3E', '#F6A24C', '#E8692E', '#FAC070'][k % 4], 0.1); }
      for (let k = 0; k < 90; k++) { const x = XY.hash(k, 31) * W + 10 * Math.sin(t * 0.7 + k), y = BANK + 12 + Math.pow(XY.hash(k, 32), 1.3) * (NEAR - BANK - 24), a = Math.sin(t * (2 + 3 * XY.hash(k, 33)) + k * 5);
        if (a < 0.35) continue; g.globalAlpha = a; K.dab(g, x, y, 0.02, 6 + 12 * a, 2.2, XY.hash(k, 34) < 0.5 ? '#FFF6E2' : '#F8D9A8', 0.1); }
      g.globalAlpha = 1;
      // ---- 陈家庄 folk run along the far bank, then fall to their knees when the fish comes up
      const kn = K.ramp(beat, KNEEL, KNEEL + 0.35);
      for (let k = 0; k < 6; k++) { const arrive = 0.6 + k * 0.45, x0 = 120 + k * 78, p = XY.easeOut(K.ramp(beat, arrive - 2.4, arrive)), x = XY.lerp(-40 - k * 30, x0, p), run = p < 1 ? Math.sin(t * 12 + k * 2) : 0;
        villager(g, x, BANK + 4, 0.62, kn, run, [['#4E6C9A', '#3E5A88'], ['#A8584A', '#7A3E36'], ['#6A8A5A', '#4E6A44'], ['#8A6A9A', '#5A4A6E']][k % 4], k % 2); }
      // ---- the painter-villager in a skiff, a hanging scroll on his pole (the first 鱼篮观音 picture is about to be made)
      const SK = [262, 498 + 3 * Math.sin(t * 1.5)], scr = [SK[0] + 34, SK[1] - 150];
      { g.save(); g.translate(SK[0], SK[1]); g.rotate(0.03 * Math.sin(t * 1.3));
        dabFill(g, [-70, -6, 0, 0, 70, -8, 58, 10, -56, 10], ['#5A4636', '#6A5040', '#4A3A2E'], 3.5, 50, () => 0.05, 10, 3.4, '#5A4636');
        g.strokeStyle = '#4A3A2E'; g.lineWidth = 3; g.beginPath(); g.moveTo(30, -2); g.lineTo(34, -156); g.stroke(); g.restore();
        villager(g, SK[0] - 14, SK[1] - 4, 0.7, kn * 0.6, 0, ['#4E6C9A', '#3E5A88'], 1);
        g.strokeStyle = '#4A3A2E'; g.lineWidth = 1.4; g.beginPath(); g.moveTo(scr[0] - 2, scr[1] - 18); g.lineTo(scr[0] - 26, scr[1] - 6); g.moveTo(scr[0] - 2, scr[1] - 18); g.lineTo(scr[0] + 26, scr[1] - 6); g.stroke();
        g.fillStyle = '#7A3A3A'; g.fillRect(scr[0] - 30, scr[1] - 6, 60, 122); g.fillStyle = '#F2ECDC'; g.fillRect(scr[0] - 24, scr[1] + 10, 48, 92);
        g.save(); g.beginPath(); g.rect(scr[0] - 24, scr[1] + 10, 48, 92); g.clip(); K.field(scr[0] - 30, scr[1] + 4, scr[0] + 30, scr[1] + 108, 5, 52, (x, y, R) => K.dab(g, x, y, Math.PI / 2, 7, 2.6, ['#F2ECDC', '#EDE4CE', '#F8F2E4'][Math.floor(R() * 3)], 0.1)); g.restore();
        g.fillStyle = '#4A3A2E'; g.fillRect(scr[0] - 34, scr[1] - 9, 68, 5); g.fillRect(scr[0] - 34, scr[1] + 114, 68, 6);
        const pic = K.ramp(beat, CAPTURE, CAPTURE + 0.4); if (pic > 0) { g.globalAlpha = pic;
          g.fillStyle = '#F06A2A'; g.beginPath(); g.arc(scr[0] + 2, scr[1] + 26, 10, 0, TAU); g.fill();
          g.fillStyle = '#F6F2EA'; g.fillRect(scr[0] - 6, scr[1] + 36, 13, 20); g.fillStyle = '#C8402E'; g.fillRect(scr[0] - 7, scr[1] + 55, 15, 3);
          g.fillStyle = '#3E7A86'; g.beginPath(); g.moveTo(scr[0] - 7, scr[1] + 58); g.lineTo(scr[0] + 8, scr[1] + 58); g.lineTo(scr[0] + 13, scr[1] + 94); g.lineTo(scr[0] - 12, scr[1] + 94); g.fill();
          g.fillStyle = '#F0CDB2'; g.beginPath(); g.arc(scr[0] + 2, scr[1] + 28, 5, 0, TAU); g.fill(); g.fillStyle = '#3E3048'; g.beginPath(); g.arc(scr[0] + 4, scr[1] + 22, 4, 0, TAU); g.fill();
          g.strokeStyle = '#F0CDB2'; g.lineWidth = 2.4; g.beginPath(); g.moveTo(scr[0] - 6, scr[1] + 40); g.lineTo(scr[0] - 14, scr[1] + 30); g.stroke();
          g.fillStyle = '#8A5A7A'; g.fillRect(scr[0] - 20, scr[1] + 28, 11, 9); g.fillStyle = '#F29A3A'; g.beginPath(); g.ellipse(scr[0] - 14, scr[1] + 25, 6, 3, -0.5, 0, TAU); g.fill();
          g.fillStyle = '#5E8A72'; g.fillRect(scr[0] - 14, scr[1] + 94, 30, 4); g.globalAlpha = 1; } }
      // ---- 老鼋 surfaces at the end to ferry them across
      const tr = K.ramp(beat, 6.7, 7.6); if (tr > 0) { const x = 590, y = 600 - 16 * tr + 2 * Math.sin(t * 1.4); g.save(); g.beginPath(); g.rect(0, 0, W, 602); g.clip();
        g.fillStyle = '#C9CDB8'; g.beginPath(); g.ellipse(x, y, 92, 26, 0, Math.PI, TAU); g.fill();
        for (let k = 0; k < 30; k++) { const a = Math.PI + (k + 0.5) / 30 * Math.PI, rr = 0.35 + 0.6 * XY.hash(k, 41); K.dab(g, x + Math.cos(a) * 92 * rr, y + Math.sin(a) * 26 * rr, a * 0.3, 10, 4, ['#E8EADA', '#A9B39A', '#D6D8C2', '#8E9A86'][k % 4]); }
        K.dab(g, x + 102, y - 14 - 6 * tr, -0.6, 28, 10, '#BFC4AE'); g.fillStyle = '#2E2A40'; g.beginPath(); g.arc(x + 110, y - 22 - 6 * tr, 2, 0, TAU); g.fill(); g.restore();
        g.strokeStyle = 'rgba(255,246,226,0.7)'; g.lineWidth = 1.5; for (let j = 0; j < 2; j++) { const f = (t * 0.6 + j * 0.5) % 1; g.beginPath(); g.ellipse(x + 10, 602, 100 + 70 * f, 8 + 6 * f, 0, 0, TAU); g.globalAlpha = tr * (1 - f); g.stroke(); } g.globalAlpha = 1; }
      // ---- 观音: the sun is her halo. She chants; the water turns round the basket; a gold glint swims in; she lifts it out with the fish
      const lt = (beat - LIFT) * XY.BEAT, up = XY.easeOut(XY.clamp((beat - (LIFT - 0.15)) / 0.3)), down = 1 - up, chant = K.ramp(beat, 1.5, 2.2) * down;
      for (let j = 0; j < 3; j++) { const f = (t * 0.45 + j / 3) % 1; g.strokeStyle = `rgba(255,240,215,${0.55 * (1 - f)})`; g.lineWidth = 1.6; g.beginPath(); g.ellipse(GX, GY + 6, 100 + 90 * f, 9 + 9 * f, 0, 0, TAU); g.stroke(); }
      const B0 = [GX - 70, GY + 14];
      if (chant > 0) { for (let k = 0; k < 36; k++) { const a = k / 36 * TAU + t * (1.5 + 2.5 * chant), r = 26 + 70 * XY.hash(k, 61) * (0.6 + 0.4 * chant); g.globalAlpha = 0.85 * chant;
          K.dab(g, B0[0] + Math.cos(a) * r * 1.6, B0[1] + Math.sin(a) * r * 0.35, a + Math.PI / 2, 14, 3.2, ['#FFF6E2', '#94A8C2', '#F8D9A8', '#6E8CAE'][k % 4], 0.1); }
        const sw = XY.clamp((beat - 2.4) / 2.0); if (sw < 1) { const a = sw * TAU * 1.6, r = 150 * (1 - sw); g.globalAlpha = Math.min(1, chant * 1.5);
          for (let k = 0; k < 4; k++) K.dab(g, B0[0] + Math.cos(a - k * 0.12) * r * 1.5, B0[1] + 8 + Math.sin(a - k * 0.12) * r * 0.3, a + Math.PI / 2, 18 - k * 3, 7 - k, ['#F2742E', '#F6A24C', '#FAC070', '#FFE0A0'][k], 0.2); }
        g.globalAlpha = 1; }
      g.drawImage(guanyin(S), GX - 120, GY - 322, 240, 340);
      for (let k = 0; k < 9; k++) { g.globalAlpha = 0.55 - k * 0.055; K.dab(g, GX + 7 * Math.sin(t * 3 + k * 1.3), GY + 26 + k * 9, 0, 54 - k * 4, 4, k % 2 ? '#3E7A86' : '#F6F2EA', 0.1); } g.globalAlpha = 1;
      const sh = [GX - 20, GY - 246], hand = [GX - 66 + 4 * Math.sin(t * 1.3), XY.lerp(GY - 150, GY - 214, up) + 6 * chant * Math.sin(t * 7)], el = [GX - 48, XY.lerp(GY - 196, GY - 228, up)];
      const bk = [B0[0], XY.lerp(B0[1] + 3 * Math.sin(t * 2), GY - 136 + 3 * Math.sin(t * 2.4), up)];
      g.strokeStyle = '#C8402E'; g.lineWidth = 1.8; g.beginPath(); g.moveTo(hand[0], hand[1]); g.quadraticCurveTo(hand[0] - 6, (hand[1] + bk[1]) / 2, bk[0], bk[1] - 34); g.stroke();
      g.save(); if (down > 0.02) { g.beginPath(); g.rect(0, 0, W, GY + 18); g.clip(); }
      const fish = up > 0.6, flip = fish ? Math.sin(t * 9) * 0.7 * Math.exp(-Math.max(0, lt) * 0.7) : 0;
      if (fish) { g.save(); g.translate(bk[0] + 4, bk[1] - 38); g.rotate(-0.6 + flip); g.scale(1.9, 1.9); [['#E8742E', 0, 0, 30, 9], ['#F29A3A', -4, -3, 22, 5], ['#F6C04E', 6, -2, 10, 3]].forEach(([c, dx, dy, l, w]) => K.dab(g, dx, dy, 0, l, w * 2, c, 0.2));
        g.fillStyle = '#F2B048'; g.beginPath(); g.moveTo(16, 0); g.lineTo(32, -12 + 6 * Math.sin(t * 14)); g.lineTo(30, 12 + 6 * Math.sin(t * 14)); g.fill();
        const blink = Math.abs(beat - BLINK) < 0.08; g.fillStyle = '#2E2238'; if (blink) g.fillRect(-13, -3, 5, 1.4); else { g.beginPath(); g.arc(-10, -3, 2, 0, TAU); g.fill(); } g.restore(); }
      g.save(); g.translate(bk[0], bk[1]); g.scale(1.5, 1.5); for (let k = 0; k < 14; k++) { const yy = -20 + k * 2.6, w = 40 - Math.abs(k - 7) * 1.2; K.dab(g, 0, yy, 0, w, 2.6, k % 2 ? '#8A5A7A' : '#A9845A', 0.05); }
      for (let k = 0; k < 8; k++) K.dab(g, -18 + k * 5, -4, Math.PI / 2 + 0.4, 34, 1.8, '#5E3E5A', 0.05);
      g.strokeStyle = '#7A5A6E'; g.lineWidth = 2.4; g.beginPath(); g.ellipse(0, -30, 18, 14, 0, Math.PI, TAU); g.stroke(); g.restore(); g.restore();
      K.dab(g, (sh[0] + el[0]) / 2, (sh[1] + el[1]) / 2, Math.atan2(el[1] - sh[1], el[0] - sh[0]), Math.hypot(el[0] - sh[0], el[1] - sh[1]) + 8, 10, '#F0CDB2', 0.1);
      K.dab(g, (el[0] + hand[0]) / 2, (el[1] + hand[1]) / 2, Math.atan2(hand[1] - el[1], hand[0] - el[0]), Math.hypot(hand[0] - el[0], hand[1] - el[1]) + 6, 8, '#EBC3A6', 0.1);
      g.fillStyle = '#F0CDB2'; g.beginPath(); g.arc(hand[0], hand[1], 5.5, 0, TAU); g.fill();
      if (lt > 0 && lt < 1.6) { const f = XY.easeOut(lt / 1.2), a = 1 - XY.clamp(lt / 1.4);
        for (let k = 0; k < 72; k++) { const ang = XY.hash(k, 51) * TAU, d = 30 + 360 * f * (0.4 + 0.6 * XY.hash(k, 52)); g.globalAlpha = a; K.dab(g, bk[0] + Math.cos(ang) * d, bk[1] - 30 + Math.sin(ang) * d * 0.6, ang, 12 + 10 * a, 4, ['#FFD36A', '#FFF2C8', '#F6A24C', '#FFFFFF'][k % 4], 0.1); }
        for (let k = 0; k < 18; k++) { const f2 = ((lt * 1.3 + XY.hash(k, 53)) % 1), y = bk[1] + 4 + f2 * (GY + 14 - bk[1]); g.globalAlpha = 0.8 * a + 0.2; K.dab(g, bk[0] - 18 + 36 * XY.hash(k, 54), y, Math.PI / 2, 6, 2.2, '#EAF2FF', 0); }
        g.globalAlpha = 1; }
      // ---- the procession in broken colour: lilac shade on the left, the sun's rim on the right, dabs over all
      const acts = { wukong: { shade: K.ramp(beat, 1.6, 2.2) * (1 - K.ramp(beat, LIFT + 0.6, LIFT + 1.2)) }, monk: { palm: K.ramp(beat, KNEEL - 0.2, KNEEL + 0.3) * (1 - K.ramp(u, 0.92, 1.05)) },
        bajie: { scratch: K.ramp(beat, 2.6, 3.0) * (1 - K.ramp(beat, 3.9, 4.3)) }, shaseng: { lift: K.ramp(beat, 6.4, 7) } };
      const xf = {};
      const tile = K.strokeTile('c38st', S, 120, 460, ['rgba(255,244,214,0.55)', 'rgba(255,190,120,0.4)', 'rgba(140,150,210,0.42)', 'rgba(90,100,160,0.32)', 'rgba(255,255,255,0.4)', 'rgba(240,140,90,0.3)'], { len: 9, w: 3.2, seed: 38, ang: (x, y, R) => -0.35 + (R() - 0.5) * 0.9 });
      const band = (L, x2, dx, dy, col) => { const M = K.procLayer('c38m', e, 330, 40); K.fill(M, col, 'source-over'); M.g.globalCompositeOperation = 'destination-out'; K.drawProc(M.g, e, SIL, acts, { xf: x2 }, e.procX + dx, e.groundY + dy); M.g.globalCompositeOperation = 'source-over'; K.over(L, M, 'source-atop'); };
      const L = K.procLayer('c38', e, 330, 40); K.drawProc(L.g, e, PEN, acts, { xf });
      band(L, xf, 6, -3, 'rgba(104,92,168,0.42)'); band(L, xf, -4, 1, 'rgba(255,198,124,0.85)'); K.pat(L, tile, 'source-atop', 0.65); K.put(g, L);
      // the impression is caught: her light streams across the water into the scroll on the skiff
      { const fl = (beat - (CAPTURE - 0.6)) / 0.6;
        if (fl > 0 && fl < 1.4) for (let k = 0; k < 50; k++) { const p = XY.clamp((fl - 0.35 * XY.hash(k, 71)) / 0.65); if (p <= 0 || p >= 1) continue;
          const sx = GX - 60 + XY.hash(k, 72) * 120, sy = 260 + XY.hash(k, 73) * 280, ep = XY.easeIO(p), x = XY.lerp(sx, scr[0], ep), y = XY.lerp(sy, scr[1] + 52, ep) - 120 * Math.sin(Math.PI * ep);
          K.dab(g, x, y, Math.atan2(scr[1] - sy, scr[0] - sx), 14, 4.4, ['#FFD36A', '#FFF6E2', '#F6A24C', '#3E7A86'][k % 4], 0.2); }
        const hb = K.hit(beat, CAPTURE, 2.2); if (hb > 0.02) { g.globalAlpha = hb; for (let k = 0; k < 18; k++) { const a = k / 18 * TAU; K.dab(g, scr[0] + Math.cos(a) * (46 + 30 * (1 - hb)), scr[1] + 52 + Math.sin(a) * (66 + 30 * (1 - hb)), a, 12, 3.6, k % 2 ? '#FFF2C8' : '#FFD36A', 0.1); } g.globalAlpha = 1; } }
      // ---- foreground reeds, swaying
      for (let k = 0; k < 24; k++) { const x = W - 90 + k * 4 + 6 * XY.hash(k, 81), h = 90 + 70 * XY.hash(k, 82), sw = 8 * Math.sin(t * 1.4 + k * 0.4) + 4 * Math.sin(t * 2.3 + k);
        g.strokeStyle = ['#4E6A3A', '#6E8A46', '#8A9A52', '#5A7444'][k % 4]; g.lineWidth = 2.6; g.beginPath(); g.moveTo(x, H + 4); g.quadraticCurveTo(x + sw * 0.3, H - h * 0.5, x + sw, H - h); g.stroke();
        if (k % 3 === 0) K.dab(g, x + sw, H - h - 8, -Math.PI / 2 + sw * 0.02, 18, 5, '#A88A54', 0.2); }
      // ---- signature entrance: raw canvas and charcoal, painted over dab by dab outward from the sun
      const rr = XY.lerp(-40, 1480, K.ramp(u, -0.42, 0.14)); if (rr < 1470) { const ov = K.layer('c38rv', e, 0, 0, W, H); ov.g.drawImage(raw(S, W, H), 0, 0, W, H);
        ov.g.globalCompositeOperation = 'destination-out'; ov.g.lineCap = 'round';
        for (const [x, y, d, a] of REVEAL) { if (d > rr) break; K.dab(ov.g, x, y, a, 58, 42 * XY.clamp((rr - d) / 110), '#000', 0.3); }
        K.put(g, ov); }
    },
  };
})();
