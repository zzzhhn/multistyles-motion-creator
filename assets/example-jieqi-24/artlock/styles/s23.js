// s23 小寒 · 民国月份牌. 擦笔水彩: soft carbon-dust modelling under transparent watercolour, airbrush-smooth pastel
// gradients, rosy cheeks, no hard outlines; an ornate calendar frame with Republican-era 美术字 and the twelve month
// sheets of the new year along the bottom rail. Moment (鹊始巢): on the bare 槐 a pair of magpies build a nest twig by
// twig: one flies in with a stick and threads it into the rim while its mate works the other side; the nest thickens.
// Unit (8 s = 3 bars, one pentad per bar): 雁北乡 a V of wild geese crosses the sky toward the northern hills; 鹊始巢 (key) the
// carrier flies in with a stick, flares its wings and threads it into the rim on beat 3 (4.0 s), the nest jumps a size and
// sheds a puff of snow; 雉雊 a cock pheasant on the snow by the pond stretches up, drums its wings and crows.
(function () {
  const JQ = window.JQ, S = JQ.SCENE, L = JQ.L, W = JQ.W, H = JQ.H, TAU = Math.PI * 2;
  const BAR = 8 / 3, IMP = BAR + 4 / 3, HOU = JQ.TERMS[22].hou;
  const SONG = '"Songti SC", "STSong", serif', DIDOT = '"Didot", "Bodoni 72", serif', HEI = '"Hiragino Sans GB", "STHeiti", sans-serif';
  if (document.fonts) document.fonts.load(`900 110px ${SONG}`, '小寒鹊始巢一二三四五六七八九十月丁未年');
  const NAVY = '#1F2E4A', MAR = '#7A1F2B', GOLD = '#C9A55A', GOLD2 = '#F1DCA0', CREAM = '#F4EBDD', ROSE = '#E7A6A0';
  // a shape modelled like 擦笔: base colour, lit from upper left, a soft dark core toward the lower right
  const model = (g, path, box, base, lite, dark, ang = 0.6) => {
    const [x0, y0, x1, y1] = box, cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, r = Math.max(x1 - x0, y1 - y0) * 0.7, dx = Math.cos(ang) * r, dy = Math.sin(ang) * r;
    const gr = g.createLinearGradient(cx - dx, cy - dy, cx + dx, cy + dy); gr.addColorStop(0, lite); gr.addColorStop(0.45, base); gr.addColorStop(1, dark);
    g.fillStyle = gr; g.fill(path);
  };
  const boxOf = pts => { let a = 1e9, b = 1e9, c = -1e9, d = -1e9; pts.forEach(([x, y]) => { a = Math.min(a, x); b = Math.min(b, y); c = Math.max(c, x); d = Math.max(d, y); }); return [a, b, c, d]; };
  const soft = (g, Sx, name, blur, fn) => { const X = JQ.layer(name, Sx); fn(X.g); g.filter = `blur(${blur}px)`; JQ.blit(g, X); g.filter = 'none'; };

  // ---------------------------------------------------------------- the painted picture (cached)
  const buildPic = (g, Sx) => {
    const sky = g.createLinearGradient(0, 0, 0, 440); sky.addColorStop(0, '#7E9CC8'); sky.addColorStop(0.5, '#C8C0DC'); sky.addColorStop(0.82, '#F2C4BA'); sky.addColorStop(1, '#F6D9C4');
    g.fillStyle = sky; g.fillRect(0, 0, W, 460);
    const sun = g.createRadialGradient(1000, 430, 0, 1000, 430, 760); sun.addColorStop(0, 'rgba(255,206,170,0.85)'); sun.addColorStop(0.5, 'rgba(250,190,180,0.3)'); sun.addColorStop(1, 'rgba(250,200,190,0)'); g.fillStyle = sun; g.fillRect(0, 0, W, 460);
    soft(g, Sx, 's23a', 18, x => { x.fillStyle = 'rgba(255,250,246,0.7)'; [[300, 150, 260, 40], [880, 110, 300, 34], [1300, 210, 240, 30], [700, 250, 200, 24]].forEach(([a, b, c, d]) => { x.beginPath(); x.ellipse(a, b, c, d, 0, 0, TAU); x.fill(); }); });
    soft(g, Sx, 's23b', 3, x => {
      model(x, S.mountains.path, [0, 240, W, 430], '#A7A3C2', '#C9C3DA', '#7D7EA3', 1.2);
      x.save(); x.clip(S.mountains.path); x.strokeStyle = 'rgba(255,255,255,0.75)'; x.lineWidth = 9; x.stroke(S.ridge.path); x.restore();
      model(x, S.hills.path, [0, 360, W, 440], '#8EA2A6', '#B4C3C2', '#6C8088', 1.4);
    });
    soft(g, Sx, 's23c', 1.6, x => {
      model(x, S.ground.path, [0, 560, W, 1080], '#ECE2D6', '#FBF7F0', '#B6AAB4', 1.3);
      model(x, S.field.path, [0, 430, W, 690], '#E6DCCC', '#F8F3EA', '#C2B5A8', 1.4);
      S.furrows.forEach((f, i) => { x.strokeStyle = 'rgba(140,150,190,0.28)'; x.lineWidth = 14; x.stroke(f.path); x.strokeStyle = 'rgba(255,250,242,0.7)'; x.lineWidth = 4; x.save(); x.translate(0, -7); x.stroke(f.path); x.restore(); });
      model(x, S.path.path, [1400, 812, 1680, 1080], '#E4D6C2', '#F4EBDD', '#C8B49C', 1.2);
      model(x, S.stream.path, [1200, 430, 1420, 860], '#A9C6D2', '#D7E7EC', '#7FA1B4', 1.1);
      model(x, S.pondRim.path, [660, 760, 1320, 1010], '#E7DED3', '#FAF6F0', '#BDB3AE', 1.4);
      model(x, S.pond.path, [680, 780, 1300, 980], '#B6D2DC', '#E3F0F3', '#86A9BC', 1.1);
      x.fillStyle = 'rgba(255,255,255,0.6)'; x.beginPath(); x.ellipse(900, 850, 160, 14, -0.05, 0, TAU); x.fill();
      model(x, S.bridge.path, [1170, 650, 1410, 720], '#C9BBAE', '#E8DED3', '#8E8078', 1.2); x.fillStyle = '#FBF7F0'; x.fillRect(1180, 646, 220, 9);
      // farmhouse: grey brick, snowy roof, red door
      model(x, S.houseFront.path, [1490, 545, 1910, 600], '#B9A796', '#D8C8B6', '#8C7A6C', 1.4);
      model(x, S.roof.path, [1470, 470, 1905, 545], '#71788C', '#9AA1B4', '#4C5468', 1.3);
      x.fillStyle = 'rgba(252,250,248,0.95)'; x.fill(JQ.P([[1520, 472], [1860, 472], [1880, 500], [1500, 500]]));
      x.fillStyle = '#5C4A44'; x.fill(S.window.path); model(x, S.chimney.path, [1560, 414, 1590, 474], '#8C7A6C', '#B9A796', '#5C4A44', 0);
      model(x, S.wall.path, [1440, 600, 1920, 812], '#C7B8AA', '#E2D6C9', '#9A8A7E', 1.3);
      x.strokeStyle = 'rgba(120,100,90,0.25)'; x.lineWidth = 1.2; for (let y = 620; y < 812; y += 16) { x.beginPath(); x.moveTo(1440, y); x.lineTo(1920, y); x.stroke(); }
      x.fillStyle = '#FBF7F0'; x.fill(S.wallCap.path);
      model(x, S.gate.path, [1608, 676, 1692, 812], '#B23A33', '#D8655A', '#7A1F22', 1.2); x.fillStyle = '#FBF7F0'; x.fill(S.gateRoof.path);
      // (no lanterns yet: the family hangs them at 大寒)
    });
    // the old 槐: cylinder-modelled trunk, soft dark limbs, snow resting on the upper sides
    soft(g, Sx, 's23d', 1.2, x => {
      x.strokeStyle = '#4A3A36'; JQ.drawBranches(x, 5, 0.85);
      x.strokeStyle = 'rgba(255,255,255,0.85)'; x.lineCap = 'round'; for (const b of S.branches) { if (b.depth > 2) continue; x.lineWidth = b.w * 0.3; x.beginPath(); x.moveTo(b.x1, b.y1 - b.w * 0.32); x.lineTo(b.x2, b.y2 - b.w * 0.32); x.stroke(); }
      const tg = x.createLinearGradient(430, 0, 540, 0); tg.addColorStop(0, '#3A2C2A'); tg.addColorStop(0.35, '#8A7064'); tg.addColorStop(0.6, '#5C4844'); tg.addColorStop(1, '#2E2322'); x.fillStyle = tg; x.fill(S.trunk.path);
      x.fillStyle = 'rgba(250,248,244,0.9)'; x.beginPath(); x.ellipse(470, 836, 110, 14, 0, 0, TAU); x.fill();
    });
    // low winter sun from the right: a warm airbrushed glow on the snow, cool lilac shadow to the left, soft vignette
    g.globalCompositeOperation = 'soft-light'; const glowR = g.createRadialGradient(1300, 640, 0, 1300, 640, 900); glowR.addColorStop(0, 'rgba(255,190,130,0.8)'); glowR.addColorStop(1, 'rgba(255,190,130,0)'); g.fillStyle = glowR; g.fillRect(0, 380, W, 700); g.globalCompositeOperation = 'source-over';
    const coolL = g.createLinearGradient(0, 0, 900, 0); coolL.addColorStop(0, 'rgba(120,120,180,0.16)'); coolL.addColorStop(1, 'rgba(120,120,180,0)'); g.fillStyle = coolL; g.fillRect(0, 430, 900, 650);
    const vg = g.createRadialGradient(W / 2, H / 2, 480, W / 2, H / 2, 1150); vg.addColorStop(0, 'rgba(70,60,90,0)'); vg.addColorStop(1, 'rgba(70,60,90,0.4)'); g.globalCompositeOperation = 'multiply'; g.fillStyle = vg; g.fillRect(0, 0, W, H); g.globalCompositeOperation = 'source-over';
    // paper tooth over everything
    const cw = 480, ch = 270, cv = document.createElement('canvas'); cv.width = cw; cv.height = ch; const q = cv.getContext('2d'), im = q.createImageData(cw, ch);
    for (let i = 0; i < cw * ch; i++) { const n = JQ.noise((i % cw) * 0.7, Math.floor(i / cw) * 0.7, 3); im.data[i * 4] = n > 0.5 ? 255 : 90; im.data[i * 4 + 1] = n > 0.5 ? 250 : 80; im.data[i * 4 + 2] = n > 0.5 ? 240 : 80; im.data[i * 4 + 3] = Math.abs(n - 0.5) * 40; }
    q.putImageData(im, 0, 0); g.drawImage(cv, 0, 0, W, H);
  };
  // ---------------------------------------------------------------- the family, modelled like 擦笔: every part graded light (upper
  // left) to a soft dark core, no outlines, rosy cheeks; a soft snow shadow under each. Drawn live from the story track.
  const TONES = { skin: ['#F2C9A8', '#FBE3CF', '#D59C80'], hair: ['#2A2224', '#55494F', '#120E10'], coat: ['#C2403A', '#EE8C78', '#7E1E22'], pants: ['#3E4C6E', '#7183A8', '#222C44'],
    ox: ['#B47A4C', '#F0C9A0', '#5E3A20'], oxDark: ['#5A3E2E', '#7E604C', '#36231A'], horn: ['#EDE2CC', '#FFFBF0', '#B9A684'], eye: ['#1A1414', '#3A3030', '#000000'],
    apron: ['#7E8FA8', '#B4C2D4', '#4E5C74'], hat: ['#7A3A4A', '#B86A78', '#4A1E2A'], scarf: ['#7A3A4A', '#B86A78', '#4A1E2A'], cape: ['#A08A5A', '#D2BC8A', '#6A5630'],
    calf: ['#C89466', '#F6DCC0', '#7A5232'], calfDark: ['#6A4A36', '#8E6E58', '#3E2A1E'], straw: ['#D8B46A', '#F4DEA4', '#9A7638'], prop: ['#7A5A42', '#A8866A', '#4A3424'],
    metal: ['#7A808C', '#B8BEC8', '#4A505A'], red: ['#C83A30', '#F08A70', '#7E1A1A'], line: ['#4A3A30', '#6A5A4E', '#2A201A'] };
  const WOMAN = { coat: ['#4E6A94', '#8AA4C8', '#2A3A5A'], hat: ['#6A4E7A', '#A486B4', '#3A2A48'] };
  const castDraw = (g, C) => {
    for (const it of C.items) if (it.kind === 'actor') { const s = JQ.STORY_S(it.y), xs = it.parts.map(p => p.pts[0][0]), w = it.who === 'ox' ? 170 : it.who === 'calf' ? 110 : 44;
      const cx = it.who === 'ox' || it.who === 'calf' ? C.state[it.who].x - 0.05 * 300 * s * C.state[it.who].dir : C.state[it.who].x;
      g.fillStyle = 'rgba(150,150,190,0.3)'; g.beginPath(); g.ellipse(cx, it.y + 4, w * s, 11 * s, 0, 0, TAU); g.fill(); }
    for (const it of C.items) {
      g.save(); if (it.alpha != null && it.alpha < 1) g.globalAlpha = it.alpha;
      it.parts.forEach(p => { const t3 = (it.who === 'woman' && WOMAN[p.role]) || TONES[p.role]; if (!t3) return; model(g, p.path, boxOf(p.pts), t3[0], t3[1], t3[2], 0.9); });
      const hd = it.kind === 'actor' && it.parts.joints && it.parts.joints.head;
      if (hd) { const s = JQ.STORY_S(it.y), d = C.state[it.who].dir, r = (it.who === 'kid' ? 12 : 9) * s, x = hd[0] + 7 * s * d, y = hd[1] + 6 * s, ck = g.createRadialGradient(x, y, 0, x, y, r);
        ck.addColorStop(0, 'rgba(232,110,110,0.65)'); ck.addColorStop(1, 'rgba(232,110,110,0)'); g.fillStyle = ck; g.fillRect(x - r, y - r, 2 * r, 2 * r); }
      g.restore();
    }
  };

  // ---------------------------------------------------------------- calendar frame and 美术字 title (cached)
  const MONTHS =['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'];
  const buildFrame = g => {
    g.fillStyle = NAVY; g.beginPath(); g.rect(0, 0, W, H); g.rect(56, 56, W - 112, H - 112); g.fill('evenodd');
    g.strokeStyle = GOLD; g.lineWidth = 3; g.strokeRect(10, 10, W - 20, H - 20); g.lineWidth = 2; g.strokeRect(54, 54, W - 108, H - 108); g.strokeStyle = MAR; g.lineWidth = 4; g.strokeRect(60, 60, W - 120, H - 120);
    // 回纹 (key fret) along the top and side rails
    const fret = (x, y, s) => { g.beginPath(); g.moveTo(x, y + s); g.lineTo(x, y); g.lineTo(x + s, y); g.lineTo(x + s, y + s * 0.75); g.lineTo(x + s * 0.25, y + s * 0.75); g.lineTo(x + s * 0.25, y + s * 0.25); g.lineTo(x + s * 0.6, y + s * 0.25); g.stroke(); };
    g.strokeStyle = GOLD; g.lineWidth = 2.2; for (let x = 70; x < W - 80; x += 34) fret(x, 20, 24);
    for (let y = 70; y < H - 80; y += 34) { fret(20, y, 24); fret(W - 44, y, 24); }
    // corner rosettes
    [[33, 33], [W - 33, 33], [33, H - 33], [W - 33, H - 33]].forEach(([x, y]) => { g.fillStyle = MAR; g.beginPath(); g.arc(x, y, 22, 0, TAU); g.fill(); g.strokeStyle = GOLD; g.lineWidth = 2; g.stroke(); for (let k = 0; k < 8; k++) { const a = k / 8 * TAU; g.beginPath(); g.ellipse(x + Math.cos(a) * 11, y + Math.sin(a) * 11, 7, 3.4, a, 0, TAU); g.stroke(); } g.fillStyle = GOLD; g.beginPath(); g.arc(x, y, 4, 0, TAU); g.fill(); });
    // bottom rail: the twelve month sheets of the new year; 一月 carries the red 小寒 mark on the 5th
    g.textAlign = 'center'; g.textBaseline = 'middle';
    const cw = 140, gap = 7, x0 = (W - (12 * cw + 11 * gap)) / 2;
    MONTHS.forEach((m, i) => {
      const x = x0 + i * (cw + gap), y = 1030;
      g.fillStyle = CREAM; g.fillRect(x, y, cw, 44); g.fillStyle = i === 0 ? '#B23A33' : MAR; g.fillRect(x, y, 46, 44);
      g.fillStyle = GOLD2; g.font = `700 ${m.length > 1 ? 14 : 18}px ${SONG}`; g.fillText(m + '月', x + 23, y + 22);
      const st = (i * 3 + 5) % 7, nd = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][i];
      for (let d = 0; d < nd; d++) { const k = d + st, cx = x + 52 + (k % 7) * 12.4, cy = y + 6 + Math.floor(k / 7) * 7.2; g.fillStyle = (k % 7 === 0) ? '#C02A22' : '#2E3A55'; g.fillRect(cx, cy, 9, 5); }
      if (i === 0) { const k = 4 + st; g.strokeStyle = '#D02A22'; g.lineWidth = 2; g.beginPath(); g.arc(x + 56 + (k % 7) * 12.4, y + 8 + Math.floor(k / 7) * 7.2, 7, 0, TAU); g.stroke(); }
    });
    // title cartouche in the sky, upper right: an arched plaque with shadowed 美术字
    const cx = 1560, cy = 200;
    g.save(); g.shadowColor = 'rgba(40,30,50,0.35)'; g.shadowBlur = 14; g.shadowOffsetY = 4;
    g.fillStyle = 'rgba(248,240,226,0.94)'; g.beginPath(); g.moveTo(cx - 250, cy + 130); g.lineTo(cx - 250, cy - 60); g.quadraticCurveTo(cx, cy - 150, cx + 250, cy - 60); g.lineTo(cx + 250, cy + 130); g.closePath(); g.fill(); g.restore();
    g.strokeStyle = GOLD; g.lineWidth = 3; g.stroke(); g.strokeStyle = MAR; g.lineWidth = 1.5; g.beginPath(); g.moveTo(cx - 238, cy + 118); g.lineTo(cx - 238, cy - 52); g.quadraticCurveTo(cx, cy - 136, cx + 238, cy - 52); g.lineTo(cx + 238, cy + 118); g.closePath(); g.stroke();
    g.font = `900 116px ${SONG}`; g.textAlign = 'center'; g.textBaseline = 'alphabetic';
    g.fillStyle = NAVY; g.fillText('小寒', cx + 6, cy + 46);
    g.lineWidth = 8; g.strokeStyle = '#FFF8EC'; g.lineJoin = 'round'; g.strokeText('小寒', cx, cy + 40);
    const tg = g.createLinearGradient(0, cy - 62, 0, cy + 40); tg.addColorStop(0, '#E0574B'); tg.addColorStop(1, '#8E1E22'); g.fillStyle = tg; g.fillText('小寒', cx, cy + 40);
    g.fillStyle = NAVY; g.fillRect(cx - 190, cy + 62, 380, 2);
  };
  // the pentad in 美术字 under the title, brushed in left to right at the head of each bar
  const houText = (g, t, h) => {
    const k = h ? JQ.smooth(h * BAR + 0.03, h * BAR + 0.42, t) : 1; if (k <= 0) return;
    g.save(); g.beginPath(); g.rect(1560 - 200, 260, 400 * k, 70); g.clip();
    g.font = `700 46px ${SONG}`; g.textAlign = 'center'; g.textBaseline = 'alphabetic'; g.fillStyle = NAVY; g.fillText([...HOU[h]].join(' '), 1560, 312);
    g.restore();
  };
  // ---------------------------------------------------------------- the nest and the magpies
  const NX = 552, NY = 304;
  const TWIGS = Array.from({ length: 64 }, (_, i) => { const a = JQ.hash(i, 1) * TAU, r = Math.sqrt(JQ.hash(i, 2)), x = NX + Math.cos(a) * 72 * r, y = NY + 6 + Math.sin(a) * 38 * r, ang = (JQ.hash(i, 3) - 0.5) * 2.4, len = 40 + JQ.hash(i, 4) * 50;
    return { x1: x - Math.cos(ang) * len / 2, y1: y - Math.sin(ang) * len / 2 * 0.6, x2: x + Math.cos(ang) * len / 2, y2: y + Math.sin(ang) * len / 2 * 0.6, bow: (JQ.hash(i, 5) - 0.5) * 14, c: JQ.hash(i, 6) }; });
  // the nest: 20 base sticks at the start; the mate adds a few through 候一, the carrier's stick on the impact brings a jump
  // of a dozen, then it keeps thickening slowly to the end
  const nestN = t => 20 + 6 * JQ.smooth(0, BAR, t) + 12 * JQ.smooth(IMP - 0.02, IMP + 0.16, t) + 18 * JQ.smooth(IMP + 0.3, 8, t);
  const nest = (g, t) => {
    const gv = nestN(t), n = Math.floor(gv), fr = gv - n;
    const base = new Path2D(); base.ellipse(NX, NY + 12, 54 * (0.7 + 0.3 * n / 60), 26 * (0.7 + 0.3 * n / 60), 0, 0, TAU);
    model(g, base, [NX - 60, NY - 20, NX + 60, NY + 40], '#4E3E36', '#7A665A', '#2A201C', 1.2);
    g.lineCap = 'round';
    TWIGS.forEach((w, i) => {
      if (i > n) return;
      const a = i < n ? 1 : fr; if (a <= 0.01) return;
      const p = new Path2D(); p.moveTo(w.x1, w.y1); p.quadraticCurveTo((w.x1 + w.x2) / 2, (w.y1 + w.y2) / 2 + w.bow, w.x2, w.y2);
      g.globalAlpha = a; g.strokeStyle = w.c < 0.4 ? '#3B2E28' : w.c < 0.75 ? '#5E4C42' : '#86705E'; g.lineWidth = 3 + w.c * 2.4; g.stroke(p);
      g.strokeStyle = 'rgba(240,226,206,0.35)'; g.lineWidth = 1; g.stroke(p); g.globalAlpha = 1;
    });
    g.fillStyle = 'rgba(252,250,246,0.85)'; g.beginPath(); g.ellipse(NX - 10, NY - 22 - n * 0.12, 30, 6, -0.1, 0, TAU); g.fill();
    // the shaken-off snow drifts down from the branch after the impact
    const e = t - IMP; if (e > 0 && e < 1.2) { const k = e / 1.2; for (let i = 0; i < 9; i++) { const x = NX - 70 + i * 18 + Math.sin(i * 2 + e * 4) * 10, y = NY + 10 + k * (150 + JQ.hash(i, 31) * 120), r = 5 + JQ.hash(i, 32) * 6;
      const sg = g.createRadialGradient(x, y, 0, x, y, r); sg.addColorStop(0, `rgba(255,255,255,${0.95 * (1 - k)})`); sg.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = sg; g.fillRect(x - r, y - r, 2 * r, 2 * r); } }
  };
  // magpie in local coords facing right; pose: perch | fly; flap ∈ [-1,1]; twig: carry a stick in the beak
  const magpie = (g, x, y, dir, s, pose, flap, bob, twig) => {
    g.save(); g.translate(x, y); g.scale(dir * s, s); g.rotate(bob * 0.35);
    const sheen = (p, bx) => model(g, p, bx, '#1C2236', '#3E5A86', '#05060C', 0.9);
    const tail = pose === 'fly' ? JQ.smoothPath([[-18, -8], [-60, -3], [-100, 4], [-114, 12], [-102, 19], [-60, 13], [-16, 9]]) : JQ.smoothPath([[-16, -6], [-48, 12], [-80, 38], [-98, 58], [-88, 63], [-66, 46], [-38, 24], [-12, 10]]);
    model(g, tail, [-114, -8, -12, 63], '#244A5E', '#4C8AA0', '#0E1C26', 0.4);
    if (pose === 'fly') { const wy = -48 * flap; const far = JQ.smoothPath([[-6, -8], [-26, wy - 12], [-2, wy - 20], [14, -10]]); sheen(far, [-30, wy - 20, 14, 0]); }
    const body = new Path2D(); body.ellipse(0, 0, 32, 18, -0.25, 0, TAU); sheen(body, [-32, -18, 32, 18]);
    const belly = new Path2D(); belly.ellipse(8, 8, 19, 10, -0.2, 0, TAU); model(g, belly, [-12, -2, 28, 18], '#F4F2EE', '#FFFFFF', '#C9C6CC', 1.2);
    if (pose === 'fly') { const wy = 50 * flap - 10; const near = JQ.smoothPath([[-8, -6], [-34, wy - 6], [-10, wy + 12], [18, -2]]); sheen(near, [-34, wy - 6, 18, wy + 12]); g.fillStyle = 'rgba(248,248,250,0.92)'; g.beginPath(); g.ellipse(-22, wy + 2, 10, 5, 0.4, 0, TAU); g.fill(); }
    else { const wing = JQ.smoothPath([[-28, -6], [8, -14], [20, -2], [-22, 8]]); sheen(wing, [-28, -14, 20, 8]); g.fillStyle = 'rgba(248,248,250,0.92)'; g.beginPath(); g.ellipse(-4, -6, 13, 4, -0.15, 0, TAU); g.fill();
      g.strokeStyle = '#1A1A22'; g.lineWidth = 2.4; g.beginPath(); g.moveTo(4, 14); g.lineTo(2, 28); g.moveTo(12, 13); g.lineTo(13, 28); g.stroke(); }
    const head = new Path2D(); head.arc(30, -16, 12.5, 0, TAU); sheen(head, [18, -28, 42, -4]);
    g.fillStyle = '#20202A'; g.beginPath(); g.moveTo(40, -20); g.lineTo(58, -15); g.lineTo(40, -11); g.fill();
    g.fillStyle = '#FFFFFF'; g.beginPath(); g.arc(34, -19, 2, 0, TAU); g.fill();
    if (twig) { g.strokeStyle = '#5E4C42'; g.lineWidth = 3.6; g.lineCap = 'round'; g.beginPath(); g.moveTo(26, -10); g.quadraticCurveTo(52, -20, 86, -8); g.stroke(); g.beginPath(); g.moveTo(70, -12); g.lineTo(80, -24); g.stroke(); }
    g.restore();
  };
  const qb = (a, b, c, k) => [(1 - k) * (1 - k) * a[0] + 2 * (1 - k) * k * b[0] + k * k * c[0], (1 - k) * (1 - k) * a[1] + 2 * (1 - k) * k * b[1] + k * k * c[1]];
  const birds = (g, t) => {
    // mate on the left rim, always weaving
    magpie(g, NX - 92, NY - 48, 1, 1.35, 'perch', 0, Math.max(0, Math.sin(t * TAU)) * 0.6, false);
    // the carrier (候二): in from off-frame, flares and threads its stick on beat 3, sits a moment, leaves before 候三
    const R = [NX + 92, NY - 50], OUT = [1180, -90], CTRL = [1000, 300], A0 = BAR - 0.1, A1 = 3.85;
    if (t < A0 || t > 5.6) return;
    if (t < A1) { const k0 = (t - A0) / (A1 - A0), k = 1 - (1 - k0) * (1 - k0); const [x, y] = qb(OUT, CTRL, R, k); magpie(g, x, y, -1, 1.35, 'fly', Math.sin(t * TAU * 2.2), -0.2 * (1 - k), true); }
    else if (t < 4.7) { const dip = JQ.smooth(A1, IMP, t) * (1 - JQ.smooth(IMP, 4.3, t)), fl = t < 4.15; magpie(g, R[0], R[1] - (fl ? 6 : 0), -1, 1.35, fl ? 'fly' : 'perch', 0.95, dip, t < IMP); }
    else { const k = JQ.ease((t - 4.7) / 0.9); const [x, y] = qb(R, [900, 140], [1300, -110], k); magpie(g, x, y, 1, 1.35, 'fly', Math.sin(t * TAU * 2.2), -0.25, false); }
  };
  // 候一 雁北乡: a V of seven geese crossing toward the northern hills, shrinking into the distance
  const goose = (g, x, y, s, f, a) => {
    g.save(); g.globalAlpha = a; g.translate(x, y); g.scale(-s, s);
    const wing = (dy, c) => { const p = JQ.smoothPath([[-6, -3], [-16, dy * 0.6 - 4], [-26, dy], [4, dy * 0.7], [14, -3]]); model(g, p, [-26, Math.min(dy, -4), 14, Math.max(dy, 0)], c[0], c[1], c[2], 0.9); };
    wing(-34 * f - 4, ['#5E544E', '#8C8078', '#3A322E']);
    const body = new Path2D(); body.ellipse(0, 0, 30, 10, -0.05, 0, TAU); model(g, body, [-30, -10, 30, 10], '#7A6E66', '#BDB1A6', '#4A403A', 1.2);
    g.strokeStyle = '#3E3632'; g.lineWidth = 5; g.lineCap = 'round'; g.beginPath(); g.moveTo(24, -3); g.quadraticCurveTo(38, -7, 48, -7); g.stroke();
    g.fillStyle = '#2E2824'; g.beginPath(); g.ellipse(52, -7, 7.5, 5, 0, 0, TAU); g.fill(); g.beginPath(); g.moveTo(58, -9); g.lineTo(68, -6); g.lineTo(58, -4); g.fill();
    g.fillStyle = 'rgba(250,246,240,0.9)'; g.beginPath(); g.ellipse(57, -6, 2, 3, 0, 0, TAU); g.fill(); g.beginPath(); g.ellipse(-24, 3, 7, 4, 0, 0, TAU); g.fill();
    wing(-30 * f + 2, ['#7A6E66', '#A89C92', '#4A403A']);
    g.restore();
  };
  const geese = (g, t) => {
    if (t > 2.9) return;
    const k = t / 2.9, P0 = [1520, 430], P1 = [260, 362], lx = JQ.lerp(P0[0], P1[0], k), ly = JQ.lerp(P0[1], P1[1], k) - Math.sin(k * Math.PI) * 14, s = JQ.lerp(0.95, 0.5, k), a = 1 - JQ.smooth(2.4, 2.9, t);
    const dx = P1[0] - P0[0], dy = P1[1] - P0[1], d = Math.hypot(dx, dy), bx = -dx / d, by = -dy / d;
    [[0, 0], [1, 1], [1, -1], [2, 1], [2, -1], [3, 1], [3, -1]].forEach(([i, sd], m) => {
      const x = lx + (bx * 50 * i - by * sd * 34 * i) * s, y = ly + (by * 50 * i + bx * sd * 34 * i) * s;
      goose(g, x, y, s, Math.sin(t * 7 + m * 0.7), a); });
  };
  // 候三 雉雊: a cock pheasant on the snow by the pond (facing left); it pecks, stretches up, drums its wings and crows
  const PH = [330, 952], PS = 1.6;   // the cock pheasant on the snow under the 槐, clear of the family at the gate
  const pheasant = (g, t) => {
    const up = JQ.smooth(6.0, 6.35, t) * (1 - 0.4 * JQ.smooth(7.4, 7.8, t)), peck = (1 - up) * Math.max(0, Math.sin(t * 3.3)) , crow = JQ.smooth(6.4, 6.5, t) * (1 - JQ.smooth(7.2, 7.35, t));
    const drum = crow * Math.sin(t * 42), hx = 46 + up * 6 - peck * 6, hy = -38 - up * 26 + peck * 34;
    g.save(); g.translate(PH[0], PH[1]); g.scale(-PS, PS);
    g.strokeStyle = '#7A6A5A'; g.lineWidth = 3; g.lineCap = 'round'; g.beginPath(); g.moveTo(-2, 18); g.lineTo(-6, 34); g.moveTo(10, 18); g.lineTo(12, 34); g.stroke();
    g.fillStyle = 'rgba(160,160,190,0.35)'; g.beginPath(); g.ellipse(-20, 36, 90, 7, 0, 0, TAU); g.fill();
    const tail = JQ.smoothPath([[-28, -14], [-110, -36], [-198, -56], [-204, -48], [-110, -22], [-26, 2]]); model(g, tail, [-204, -56, -26, 2], '#C9A06A', '#EED3A2', '#7A5A30', 0.6);
    g.save(); g.clip(tail); g.strokeStyle = 'rgba(70,40,20,0.5)'; g.lineWidth = 3; for (let i = 0; i < 9; i++) { const u = -46 - i * 17; g.beginPath(); g.moveTo(u, -40 - i * 3.4); g.lineTo(u + 6, 2 - i * 2.4); g.stroke(); } g.restore();
    const body = new Path2D(); body.ellipse(0, 0, 44, 25, -0.1, 0, TAU); model(g, body, [-44, -25, 44, 25], '#B5652E', '#EBA46A', '#6A2E14', 1.1);
    g.save(); g.translate(-4, -8); g.rotate(-0.5 * crow * (0.6 + 0.4 * drum)); const wing = new Path2D(); wing.ellipse(-8, 0, 32, 15, -0.12, 0, TAU); model(g, wing, [-40, -15, 24, 15], '#8A5A30', '#C99A62', '#4E2E14', 1);
    g.strokeStyle = 'rgba(250,236,210,0.6)'; g.lineWidth = 1.2; for (let i = 0; i < 4; i++) { g.beginPath(); g.arc(-24 + i * 10, -2 + (i % 2) * 4, 6, 0.2, Math.PI - 0.2); g.stroke(); } g.restore();
    const neck = JQ.smoothPath([[26, -16], [hx - 8, hy + 8], [hx + 4, hy + 4], [40, -6]]); model(g, neck, [26, hy, hx + 6, -6], '#2E6A62', '#6FB0A2', '#123A36', 0.8);
    g.strokeStyle = '#FBF7F0'; g.lineWidth = 4; g.beginPath(); g.moveTo(26, -12); g.lineTo(40, -8); g.stroke();
    const head = new Path2D(); head.arc(hx, hy, 11, 0, TAU); model(g, head, [hx - 11, hy - 11, hx + 11, hy + 11], '#1F4A44', '#4A8A80', '#0A2220', 0.8);
    g.fillStyle = '#D23A2E'; g.beginPath(); g.ellipse(hx + 2, hy + 1, 7, 9, 0, 0, TAU); g.fill(); g.fillStyle = '#1A1414'; g.beginPath(); g.arc(hx + 4, hy - 2, 1.8, 0, TAU); g.fill();
    g.fillStyle = '#C9B48A'; const o = crow * (0.6 + 0.4 * Math.abs(drum)) * 6; g.beginPath(); g.moveTo(hx + 9, hy - 3); g.lineTo(hx + 19, hy - 1 - o * 0.4); g.lineTo(hx + 9, hy + 1); g.fill(); g.beginPath(); g.moveTo(hx + 9, hy + 2); g.lineTo(hx + 17, hy + 3 + o); g.lineTo(hx + 9, hy + 4); g.fill();
    g.restore();
    const sa = JQ.smooth(6.45, 6.6, t) * (1 - JQ.smooth(7.3, 7.7, t));
    if (sa > 0.01) { const sx = PH[0] - (hx + 20) * PS, sy = PH[1] + hy * PS; g.lineCap = 'round';
      for (let k = 0; k < 3; k++) { const q = (k / 3 + t * 1.8) % 1; g.strokeStyle = `rgba(178,58,51,${sa * (1 - q)})`; g.lineWidth = 3; g.beginPath(); g.arc(sx, sy, 12 + q * 60, Math.PI - 0.6, Math.PI + 0.6); g.stroke(); } }
  };

  JQ.ART[23] = {
    key: IMP, keyHou: JQ.TERMS[22].keyHou, focus: [[900, 400], [NX + 40, NY - 20], [PH[0] + 40, PH[1] - 60]], frame: true,
    draw(g, t, Sx) {
      t = JQ.clamp(t, 0, 9); const h = Math.min(2, Math.floor(t / BAR));
      JQ.blit(g, JQ.cached('s23pic', Sx, buildPic));
      geese(g, t); nest(g, t); birds(g, t); pheasant(g, t);
      castDraw(g, JQ.castFor(Sx, t));
      JQ.blit(g, JQ.cached('s23frame', Sx, buildFrame));
      houText(g, t, h);
    },
  };
})();
