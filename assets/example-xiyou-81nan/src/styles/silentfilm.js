// 49 默片 · 1920 年 · 收缚魔王（8 拍）— a scratched, flickering black-and-white reel. It opens on an intertitle card, cuts, and
// irises in on the pilgrims below a thousand-foot white bull standing on the raised back stage. 哪吒 on its head chops the head
// off on beats 2, 2.75, 3.5 and a new one is spliced in every time (Méliès substitution: a white frame and a jump in the gate);
// 李天王's 照妖镜 pins it on 3.9, on 4.5 the 缚妖索 goes through its nose: the iris snaps shut round nose and pilgrims and the
// black beyond carries the intertitle 「缚」; afterwards 哪吒 leads the subdued bull by the rope, tugging on each beat (第六十一回).
(() => {
  'use strict';
  const XY = window.XY, TAU = XY.TAU, K = () => XY.KIT_F;
  const INK = '#161614', WHITE = '#ECEBE4';
  const gray = v => { const c = Math.round(XY.clamp(v) * 255); return `rgb(${c},${c},${Math.round(c * 0.97)})`; };
  // the pilgrims in silver-gelatin greys: luminance of the default colours, contrast pushed so silhouettes hold
  const GREY = {}; Object.keys(XY.DEFAULT_COLORS).forEach(r => { const [R, G, B] = K().hex(XY.DEFAULT_COLORS[r]); const l = (0.3 * R + 0.59 * G + 0.11 * B) / 255; GREY[r] = gray(XY.clamp((l - 0.5) * 1.35 + 0.52)); });
  GREY.ink = INK; GREY.stripe = INK; GREY.gold = '#E2E0D6'; GREY.kasaya = '#4A4A46'; GREY.wkshirt = '#5A5A56'; GREY.horse = '#F2F1EA';
  const PEN = { outline: '#1E1E1C', ow: 1.4, seed: 49, shade: 'rgba(0,0,0,0.22)', color: r => GREY[r] || '#888' };
  const poly = (g, pts) => { g.beginPath(); g.moveTo(pts[0][0], pts[0][1]); for (let k = 1; k < pts.length; k++) g.lineTo(pts[k][0], pts[k][1]); g.closePath(); };
  // the bull stands on the raised back of the stage (scaled 0.82 about its feet), so the pilgrims walk in front of it, not through its legs
  const BS = 0.82, BX = 930, BY = 606, bxf = (x, y) => [BX + (x - 960) * BS, BY + (y - 692) * BS];
  const HEAD = bxf(560, 392), IRIS = [600, 480], CH = [2, 2.75, 3.5], BIND = 4.5;

  // the bull's head facing left; ring = nose ring drawn
  const bullHead = (g, x, y, rot, s, ring, eye) => {
    g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s); g.lineJoin = 'round'; g.strokeStyle = INK; g.lineWidth = 3;
    const horn = (bx, by, cx, cy, tx, ty, w) => { g.fillStyle = '#DEDCD2'; g.beginPath(); g.moveTo(bx, by); g.quadraticCurveTo(cx, cy, tx, ty); g.quadraticCurveTo(cx - w * 0.6, cy + w, bx - w, by + 4); g.closePath(); g.fill(); g.stroke(); };
    horn(-18, -60, -40, -150, -112, -126, 16);                       // far horn, sweeping out and forward
    g.fillStyle = '#C9C8C0'; g.beginPath(); g.moveTo(46, -52); g.lineTo(100, -70); g.lineTo(78, -30); g.closePath(); g.fill(); g.stroke();
    g.fillStyle = WHITE; g.beginPath(); g.moveTo(66, 6); g.quadraticCurveTo(70, -56, 40, -70); g.quadraticCurveTo(-10, -80, -44, -64); g.quadraticCurveTo(-84, -40, -110, 14);
    g.quadraticCurveTo(-126, 50, -108, 70); g.quadraticCurveTo(-80, 84, -40, 72); g.quadraticCurveTo(20, 60, 66, 6); g.fill(); g.stroke();
    g.fillStyle = 'rgba(60,60,56,0.16)'; g.beginPath(); g.moveTo(66, 6); g.quadraticCurveTo(20, 60, -40, 72); g.quadraticCurveTo(0, 30, 50, -20); g.fill();
    g.fillStyle = '#BDBCB4'; g.beginPath(); g.moveTo(-108, 12); g.quadraticCurveTo(-128, 48, -108, 70); g.quadraticCurveTo(-90, 80, -74, 76); g.quadraticCurveTo(-90, 44, -84, 20); g.closePath(); g.fill();
    g.fillStyle = INK; g.beginPath(); g.moveTo(-118, 34); g.quadraticCurveTo(-108, 30, -104, 42); g.quadraticCurveTo(-112, 40, -118, 34); g.fill();
    g.lineWidth = 2.2; g.beginPath(); g.moveTo(-110, 66); g.quadraticCurveTo(-92, 70, -74, 62); g.stroke();
    g.lineWidth = 2; [[-36, -56], [-18, -62], [0, -60]].forEach(([cx, cy]) => { g.beginPath(); g.arc(cx, cy, 8, 0.3, Math.PI + 0.6); g.stroke(); });
    g.fillStyle = '#F6F5EE'; g.beginPath(); g.ellipse(-36, -26, 11, 8 * Math.min(1.2, eye + 0.2), -0.2, 0, TAU); g.fill(); g.lineWidth = 2; g.stroke();
    g.fillStyle = INK; g.beginPath(); g.ellipse(-38, -26, 5, 5 * eye, 0, 0, TAU); g.fill();
    g.lineWidth = 3.4; g.beginPath(); g.moveTo(-54, -40); g.quadraticCurveTo(-36, -48, -18, -40); g.stroke();
    horn(30, -58, 40, -150, -36, -160, 18);                          // near horn
    if (ring) { g.strokeStyle = '#F6F5EE'; g.lineWidth = 5; g.beginPath(); g.arc(-116, 66, 13, 0, TAU); g.stroke(); g.strokeStyle = INK; g.lineWidth = 1.5; g.stroke(); }
    g.restore(); };
  // 哪吒: small boy, top-knots, 混天绫 sash streaming, sword; 风火轮 under his feet
  const nezha = (g, x, y, t, chop) => {
    g.save(); g.translate(x, y); g.lineJoin = 'round'; g.lineCap = 'round';
    [-12, 12].forEach((wx, j) => { g.strokeStyle = '#F2F1EA'; g.lineWidth = 4; g.beginPath(); g.arc(wx, -4, 9, 0, TAU); g.stroke();
      for (let k = 0; k < 5; k++) { const a = Math.PI + k * 0.35 + 0.3 * Math.sin(t * 20 + k + j), l = 10 + 6 * Math.sin(t * 17 + k * 2);
        g.strokeStyle = k % 2 ? '#FFFFFF' : '#BDBCB4'; g.lineWidth = 3; g.beginPath(); g.moveTo(wx + Math.cos(a) * 9, -4 + Math.sin(a) * 9); g.lineTo(wx + Math.cos(a) * (9 + l), -4 + Math.sin(a) * (9 + l) - 6); g.stroke(); } });
    g.strokeStyle = '#3A3A36'; g.lineWidth = 6; g.beginPath(); g.moveTo(-6, -12); g.lineTo(-4, -34); g.moveTo(6, -12); g.lineTo(4, -34); g.stroke();
    g.fillStyle = '#2E2E2A'; poly(g, [[-12, -34], [12, -34], [9, -64], [-9, -64]]); g.fill();
    g.strokeStyle = '#F2F1EA'; g.lineWidth = 5; g.beginPath(); g.moveTo(-8, -58); for (let k = 0; k <= 8; k++) g.lineTo(-8 + k * 9, -60 - 18 * Math.sin(k * 0.6 + t * 6) + k * 2); g.stroke();
    g.fillStyle = '#E8E2D6'; g.beginPath(); g.arc(0, -76, 11, 0, TAU); g.fill(); g.fillStyle = INK; g.beginPath(); g.arc(-7, -86, 5, 0, TAU); g.arc(7, -86, 5, 0, TAU); g.fill();
    const a = XY.lerp(-2.4, -0.2, chop), hx = 6 + Math.cos(a) * 22, hy = -58 + Math.sin(a) * 22;
    g.strokeStyle = '#6A6A64'; g.lineWidth = 5; g.beginPath(); g.moveTo(6, -58); g.lineTo(hx, hy); g.stroke();
    g.strokeStyle = '#FFFFFF'; g.lineWidth = 3.5; g.beginPath(); g.moveTo(hx, hy); g.lineTo(hx + Math.cos(a - 0.3) * 46, hy + Math.sin(a - 0.3) * 46); g.stroke();
    if (chop > 0.2 && chop < 0.95) { g.strokeStyle = 'rgba(255,255,255,0.55)'; g.lineWidth = 2; g.beginPath(); g.arc(6, -58, 64, -2.4, -0.4); g.stroke(); }
    g.restore(); };
  // 托塔李天王 on a cloud, the pagoda held up; returns the pagoda's position (the beam's source)
  const tianwang = (g, x, y, t) => {
    g.save(); g.translate(x, y + 4 * Math.sin(t * 1.3));
    g.fillStyle = '#F4F3EC'; [[-60, 40, 34], [-20, 46, 40], [30, 42, 36], [70, 48, 28], [0, 30, 30]].forEach(([cx, cy, r]) => { g.beginPath(); g.arc(cx + 4 * Math.sin(t + cx), cy, r, 0, TAU); g.fill(); });
    g.fillStyle = '#5A5A54'; poly(g, [[-24, 20], [24, 20], [18, -60], [-18, -60]]); g.fill(); g.fillStyle = '#8A8A82'; poly(g, [[-30, -60], [30, -60], [22, -40], [-22, -40]]); g.fill();
    g.fillStyle = '#E0DED4'; g.beginPath(); g.arc(0, -74, 13, 0, TAU); g.fill(); g.fillStyle = '#3A3A36'; poly(g, [[-12, -84], [12, -84], [0, -104]]); g.fill();
    g.strokeStyle = '#5A5A54'; g.lineWidth = 8; g.lineCap = 'round'; g.beginPath(); g.moveTo(16, -54); g.lineTo(40, -86); g.stroke();
    const px = 46, py = -96; g.fillStyle = '#D0CEC4';
    for (let k = 0; k < 6; k++) { const w = 18 - k * 2.4, yy = py - k * 11; poly(g, [[px - w, yy], [px + w, yy], [px + w * 0.7, yy - 8], [px - w * 0.7, yy - 8]]); g.fill(); }
    g.restore(); return [x + px, y + py - 30];
  };
  // painted-flat backdrop (Méliès stage): hatched 翠云山, cardboard rocks, the bull's body and legs — cached, drawn with the gate weave
  const backdrop = (S, W, H) => XY.cached('sil-bd:' + W + ':' + S.toFixed(4), W * S, H * S, cv => {
    const g = cv.getContext('2d'); g.setTransform(S, 0, 0, S, 0, 0); const R = XY.rng(4901);
    let gr = g.createLinearGradient(0, 0, 0, 702); gr.addColorStop(0, '#8E8D88'); gr.addColorStop(0.7, '#C9C8C0'); gr.addColorStop(1, '#D9D8D0'); g.fillStyle = gr; g.fillRect(0, 0, W, 702);
    [[0, 470, 260, 300], [180, 430, 340, 260], [420, 470, 300, 230], [700, 380, 260, 200], [930, 430, 300, 220]].forEach(([x, y, w, h], j) => {
      g.fillStyle = j % 2 ? '#A9A8A0' : '#9A9991'; g.beginPath(); g.moveTo(x, 702); g.lineTo(x + w * 0.35, y); g.lineTo(x + w * 0.55, y + 30); g.lineTo(x + w * 0.7, y - 10); g.lineTo(x + w, 702); g.fill();
      g.strokeStyle = 'rgba(40,40,36,0.35)'; g.lineWidth = 1.2; for (let k = 0; k < 26; k++) { const xx = x + w * (0.2 + 0.6 * R()), yy = y + 30 + R() * (702 - y - 40); g.beginPath(); g.moveTo(xx, yy); g.lineTo(xx + 18, yy + 10); g.stroke(); } });
    // the raised back stage: a painted rise the bull stands on
    g.fillStyle = '#8C8B84'; g.beginPath(); g.moveTo(0, 640); g.quadraticCurveTo(400, 600, 700, 606); g.lineTo(W, 600); g.lineTo(W, 702); g.lineTo(0, 702); g.fill();
    g.strokeStyle = 'rgba(40,40,36,0.5)'; g.lineWidth = 2; g.beginPath(); g.moveTo(0, 640); g.quadraticCurveTo(400, 600, 700, 606); g.lineTo(W, 600); g.stroke();
    for (let k = 0; k < 40; k++) { const xx = R() * W, yy = 615 + R() * 80; g.beginPath(); g.moveTo(xx, yy); g.lineTo(xx + 22, yy + 4); g.stroke(); }
    // the bull: a thousand feet of white hide, standing on the back stage
    g.save(); g.translate(BX, BY); g.scale(BS, BS); g.translate(-960, -692);
    g.fillStyle = '#B5B4AC'; [[742, 34], [806, 32], [1060, 34], [1124, 32]].forEach(([x, w], j) => { g.fillRect(x - w / 2, 500, w, 192); g.fillStyle = '#2A2A26'; g.fillRect(x - w / 2 - 2, 680, w + 4, 16); g.fillStyle = j % 2 ? '#B5B4AC' : '#C8C7BF'; });
    let bg2 = g.createLinearGradient(0, 220, 0, 580); bg2.addColorStop(0, '#F2F1EA'); bg2.addColorStop(0.7, '#D9D8D0'); bg2.addColorStop(1, '#ABAAA2');
    g.fillStyle = bg2; g.beginPath(); g.moveTo(720, 566); g.quadraticCurveTo(640, 520, 640, 460); g.quadraticCurveTo(600, 420, 596, 360); g.quadraticCurveTo(640, 300, 700, 270);
    g.quadraticCurveTo(760, 196, 830, 214); g.quadraticCurveTo(960, 238, 1120, 226); g.quadraticCurveTo(1200, 230, 1210, 320); g.lineTo(1210, 548);
    g.quadraticCurveTo(1100, 560, 1060, 552); g.quadraticCurveTo(900, 590, 760, 566); g.closePath(); g.fill(); g.strokeStyle = INK; g.lineWidth = 3; g.stroke();
    g.fillStyle = '#E4E3DB'; g.beginPath(); g.moveTo(612, 430); g.quadraticCurveTo(640, 520, 700, 574); g.quadraticCurveTo(660, 590, 640, 560); g.quadraticCurveTo(610, 500, 612, 430); g.fill(); g.stroke();
    g.strokeStyle = 'rgba(40,40,36,0.45)'; g.lineWidth = 2;
    [[760, 300, 740, 420, 790, 520], [860, 300, 880, 380, 850, 450], [1060, 300, 1020, 400, 1070, 500], [920, 470, 960, 500, 1010, 480]].forEach(L => { g.beginPath(); g.moveTo(L[0], L[1]); g.quadraticCurveTo(L[2], L[3], L[4], L[5]); g.stroke(); });
    g.strokeStyle = INK; g.lineWidth = 6; g.lineCap = 'round'; g.beginPath(); g.moveTo(1176, 300); g.quadraticCurveTo(1150, 420, 1162, 520); g.stroke();
    g.fillStyle = '#5A5A54'; g.beginPath(); g.ellipse(1162, 536, 9, 20, 0.1, 0, TAU); g.fill(); g.restore();
    // stage floor
    gr = g.createLinearGradient(0, 702, 0, H); gr.addColorStop(0, '#6E6D68'); gr.addColorStop(1, '#3E3D3A'); g.fillStyle = gr; g.fillRect(0, 700, W, H - 700);
    g.fillStyle = '#2A2A26'; g.fillRect(0, 700, W, 4);
    [[80, 628, 50], [330, 612, 36], [1130, 604, 46]].forEach(([x, y, r]) => { g.fillStyle = '#7E7D76'; g.beginPath(); g.moveTo(x - r, y + 8); g.lineTo(x - r * 0.4, y - r * 0.6); g.lineTo(x + r * 0.5, y - r * 0.5); g.lineTo(x + r, y + 8); g.fill(); g.strokeStyle = INK; g.lineWidth = 2; g.stroke(); });
  });
  // the intertitle card
  const card = (g, W, H) => {
    g.fillStyle = '#0E0E0C'; g.fillRect(0, 0, W, H);
    g.strokeStyle = '#D8D6CC'; g.lineWidth = 3; g.strokeRect(70, 70, W - 140, H - 140); g.lineWidth = 1.2; g.strokeRect(84, 84, W - 168, H - 168);
    [[84, 84, 1, 1], [W - 84, 84, -1, 1], [84, H - 84, 1, -1], [W - 84, H - 84, -1, -1]].forEach(([x, y, sx, sy]) => { g.save(); g.translate(x, y); g.scale(sx, sy); g.lineWidth = 2;
      g.beginPath(); g.moveTo(0, 46); g.quadraticCurveTo(0, 0, 46, 0); g.moveTo(12, 30); g.quadraticCurveTo(12, 12, 30, 12); g.stroke(); g.fillStyle = '#D8D6CC'; g.beginPath(); g.moveTo(26, 26); g.lineTo(34, 18); g.lineTo(42, 26); g.lineTo(34, 34); g.fill(); g.restore(); });
    g.fillStyle = '#E6E4DA'; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.font = XY.font(40, XY.cnFont.song, 'bold'); g.fillText('第 四 十 九 难', W / 2, 150);
    g.font = XY.font(250, XY.cnFont.kai, 'bold'); g.fillText('缚', W / 2, 360);
    g.font = XY.font(54, XY.cnFont.song, 'bold'); g.fillText('收 缚 魔 王', W / 2, 545);
    g.font = XY.font(24, XY.cnFont.song); g.fillStyle = '#B8B6AC'; g.fillText('大力牛魔王  ·  哪吒三太子  ·  托塔李天王', W / 2, 615);
    g.strokeStyle = '#B8B6AC'; g.lineWidth = 1.5; g.beginPath(); g.moveTo(W / 2 - 200, 190); g.lineTo(W / 2 + 200, 190); g.moveTo(W / 2 - 140, 585); g.lineTo(W / 2 + 140, 585); g.stroke();
    g.textAlign = 'left'; g.textBaseline = 'alphabetic';
  };
  const irisMask = (g, W, H, cx, cy, r, al) => { g.fillStyle = `rgba(8,8,7,${al})`; g.beginPath(); g.rect(-20, -20, W + 40, H + 40); g.arc(cx, cy, Math.max(0.1, r), 0, TAU, true); g.fill('evenodd'); };

  XY.STYLES.silentfilm = {
    draw(g, e) {
      const { W, H, t, u, beat } = e, k = K(), S = e.S, st24 = k.step(t, 24);
      const chops = CH, splice = chops.some(b => beat >= b && beat < b + 0.08);
      const wx = (XY.hash(st24, 1, 49) - 0.5) * 3, wy = (XY.hash(st24, 2, 49) - 0.5) * 3 + (splice ? 12 : 0);
      g.fillStyle = '#0B0B0A'; g.fillRect(0, 0, W, H);
      g.save(); g.translate(wx, wy);
      const zp = 1 + 0.13 * k.push(beat, 1.92, 0.12, 0.35, 0.9) + 0.06 * k.push(beat, 2.7, 0.1, 1.0, 1.2); if (zp > 1.0005) { g.translate(HEAD[0], HEAD[1]); g.scale(zp, zp); g.translate(-HEAD[0], -HEAD[1]); }
      if (u < -0.06) card(g, W, H);
      else {
        g.drawImage(backdrop(S, W, H), 0, 0, W, H);
        // 李天王 on his cloud; from beat 3.9 the 照妖镜 light from the pagoda pins the bull's head
        const src = tianwang(g, 170, 150, t), pin = k.after(beat, 3.9, 0.25);
        if (pin > 0) { g.save(); g.globalCompositeOperation = 'lighter'; g.fillStyle = `rgba(255,255,250,${0.16 * pin + 0.05 * Math.sin(t * 30)})`;
          g.beginPath(); g.moveTo(src[0], src[1]); g.lineTo(HEAD[0] - 120, HEAD[1] + 60); g.lineTo(HEAD[0] + 60, HEAD[1] - 120); g.fill(); g.restore(); }
        // the head: tossing while it fights, chopped and re-spliced on each chop beat, bound and lowered after beat 3
        const bound = beat >= BIND, tug = k.pulse(beat - Math.floor(beat), 0.15, 0.2) * (beat > 6 ? 1 : 0), rot = bound ? 0.2 + 0.08 * XY.smooth((beat - 5.6) / 0.6) + 0.06 * tug + 0.03 * Math.sin(t * 2) : 0.1 * Math.sin(t * 6.5) + 0.12 * chops.reduce((a, b) => a + k.hitDecay(beat, b, 0.4), 0);
        const eye = beat >= BIND && beat < BIND + 0.6 ? 1.35 : beat >= BIND + 0.6 ? 0.35 : 1;
        bullHead(g, HEAD[0], HEAD[1], rot, BS, bound, eye);
        chops.forEach((b, j) => { const d = (beat - b) / 0.45; if (d < 0 || d > 1.25) return;
          if (d <= 1) { const x = XY.lerp(HEAD[0], HEAD[0] - 300 - j * 70, d), y = XY.lerp(HEAD[1], HEAD[1] - 150 + j * 40, d) - 120 * Math.sin(Math.PI * d); bullHead(g, x, y, d * (j % 2 ? -5 : 5), 0.66, false, 0.2); }
          else { const x = HEAD[0] - 300 - j * 70, y = HEAD[1] - 150 + j * 40, q = (d - 1) / 0.25; g.fillStyle = `rgba(240,240,232,${1 - q})`;
            for (let p = 0; p < 7; p++) { const a = p / 7 * TAU; g.beginPath(); g.arc(x + Math.cos(a) * 40 * (0.5 + q), y + Math.sin(a) * 30 * (0.5 + q), 26 * (1 - 0.5 * q), 0, TAU); g.fill(); } } });
        // 哪吒 on the bull's head, chopping on the chop beats; the 缚妖索 thrown on 4, through the nose on 4.5; then he leads the bull by it
        const chop = chops.reduce((a, b) => Math.max(a, XY.clamp(1 - Math.abs(beat - b + 0.06) / 0.14)), 0), nzx = HEAD[0] + 16, nzy = HEAD[1] - 70 + 4 * Math.sin(t * 5);
        g.save(); g.translate(nzx, nzy); g.scale(1.25, 1.25); nezha(g, 0, 0, t, chop); g.restore();
        const ringP = [HEAD[0] + (Math.cos(rot) * -116 - Math.sin(rot) * 66) * BS, HEAD[1] + (Math.sin(rot) * -116 + Math.cos(rot) * 66) * BS], hand = [nzx - 18, nzy - 64 + 10 * tug];
        if (beat >= 4) { const f = XY.easeOut((beat - 4) / 0.45), end = [XY.lerp(hand[0], ringP[0], f), XY.lerp(hand[1], ringP[1], f)], sag = bound ? 6 + 4 * Math.sin(t * 3) : 70 * (1 - f) + 20;
          g.strokeStyle = '#F4F3EC'; g.lineWidth = 3.5; g.beginPath(); g.moveTo(hand[0], hand[1]); g.quadraticCurveTo((hand[0] + end[0]) / 2 - 40, (hand[1] + end[1]) / 2 + sag, end[0], end[1]); g.stroke();
          g.strokeStyle = INK; g.lineWidth = 1; g.stroke(); }
        // the pilgrims in greys; Wukong looks up at the bull, then joins the fight with the staff raised
        const acts = { wukong: { shade: XY.smooth((beat - 0.6) / 0.4) * (1 - XY.smooth((beat - 1.7) / 0.3)), raise: XY.smooth((beat - 1.9) / 0.4) * (1 - k.after(beat, 4.2, 0.3)), strike: k.pulse(beat, 4.4, 0.35) },
          monk: { palm: k.after(beat, BIND, 0.3) }, bajie: { scratch: k.after(beat, 6.2, 0.4) }, shaseng: { lift: k.pulse(beat, 4.6, 0.5) } };
        XY.drawProcession(g, e.phase, e.procX, e.groundY, PEN, acts);
        // iris in at the cut (u = −0.06), iris shut round nose and pilgrims on beat 3 with the intertitle in the black
        if (u < 0.14) irisMask(g, W, H, 210, 560, 1500 * XY.easeIn((u + 0.06) / 0.2), 1);
        const ir = beat < BIND - 0.18 || beat > BIND + 1.5 ? -1 : beat < BIND ? XY.lerp(1300, 370, XY.easeIn((beat - BIND + 0.18) / 0.18)) : beat < BIND + 1 ? 370 + 6 * Math.sin(t * 8) : XY.lerp(370, 1300, XY.easeIn((beat - BIND - 1) / 0.5));
        if (ir > 0) { irisMask(g, W, H, IRIS[0], IRIS[1], ir, 0.97);
          if (beat >= BIND && beat < BIND + 1.05) { g.strokeStyle = '#D8D6CC'; g.lineWidth = 2; g.strokeRect(986, 236, 176, 320); g.lineWidth = 1; g.strokeRect(996, 246, 156, 300);
            g.fillStyle = '#ECEAE0'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.font = XY.font(176, XY.cnFont.kai, 'bold'); g.fillText('缚', 1074, 372);
            g.font = XY.font(26, XY.cnFont.song, 'bold'); g.fillText('缚妖索穿鼻', 1074, 500); g.textAlign = 'left'; g.textBaseline = 'alphabetic'; } }
        if (splice) { g.fillStyle = 'rgba(255,255,250,0.75)'; g.fillRect(-10, -10, W + 20, H + 20); }
      }
      g.restore();
      // ---- the print: flicker, grain, a standing scratch and per-frame scratches, dust, vignette
      const fl = XY.hash(st24, 7, 49); g.fillStyle = fl < 0.5 ? `rgba(0,0,0,${0.12 * fl})` : `rgba(255,255,248,${0.06 * (fl - 0.5)})`; g.fillRect(0, 0, W, H);
      const tile = k.noiseTile('silent', 160, (i, j) => { const v = Math.round(XY.hash(i, j, 4949) * 255); return [v, v, v, 255]; });
      k.grain(g, e, tile, 0.16, 24, 'overlay');
      g.lineCap = 'round';
      g.strokeStyle = 'rgba(240,240,230,0.35)'; g.lineWidth = 1.4; const sx = 300 + 30 * Math.sin(t * 0.7); g.beginPath(); g.moveTo(sx, 0); g.lineTo(sx + 6, H); g.stroke();
      for (let j = 0; j < 4; j++) { if (XY.hash(st24, j, 11) > 0.55) continue; const x = XY.hash(st24, j, 12) * W, y0 = XY.hash(st24, j, 13) * H * 0.6, dark = XY.hash(st24, j, 14) < 0.4;
        g.strokeStyle = dark ? 'rgba(10,10,8,0.45)' : 'rgba(250,250,240,0.55)'; g.lineWidth = 0.8 + 1.6 * XY.hash(st24, j, 15); g.beginPath(); g.moveTo(x, y0); g.lineTo(x + (XY.hash(st24, j, 16) - 0.5) * 10, y0 + 200 + XY.hash(st24, j, 17) * 500); g.stroke(); }
      for (let j = 0; j < 9; j++) { const x = XY.hash(st24, j, 21) * W, y = XY.hash(st24, j, 22) * H, r = 1.5 + 4 * XY.hash(st24, j, 23); g.fillStyle = XY.hash(st24, j, 24) < 0.6 ? 'rgba(10,10,8,0.7)' : 'rgba(250,250,240,0.7)';
        if (j < 2) { g.strokeStyle = g.fillStyle; g.lineWidth = 1.2; g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + 14, y - 10, x + 22, y + 6); g.stroke(); } else { g.beginPath(); g.ellipse(x, y, r, r * 0.7, j, 0, TAU); g.fill(); } }
      const vg = g.createRadialGradient(W / 2, H / 2, H * 0.32, W / 2, H / 2, W * 0.62); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,0.6)'); g.fillStyle = vg; g.fillRect(0, 0, W, H);
      // ---- the film strip edges: sprocket holes running, edge print with the counter
      g.fillStyle = '#0A0A09'; g.fillRect(0, 0, W, 46); g.fillRect(0, 746, W, 34);
      const off = (t * 96) % 56; g.fillStyle = '#CFCDC2';
      for (let x = -56 + (56 - off); x < W + 56; x += 56) { g.beginPath(); g.roundRect(x, 5, 18, 10, 2.5); g.fill(); g.beginPath(); g.roundRect(x, 757, 22, 15, 3); g.fill(); }
      g.fillStyle = '#B7A57A'; g.font = XY.font(24, XY.cnFont.song, 'bold'); g.textBaseline = 'middle';
      for (let x = 40 - ((t * 96) % 560); x < W; x += 560) g.fillText('第四十九难  ·  收缚魔王  ▸ 49', x, 32);
      g.textBaseline = 'alphabetic';
    },
    hits: [2, 4.5],
    thumb: 5.2,   // overview thumbnail: a clear frame with no in-panel push-in active
  };
})();
