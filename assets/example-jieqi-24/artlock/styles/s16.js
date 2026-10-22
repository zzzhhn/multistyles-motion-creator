// s16 秋分 · 老式科普挂图 — a 1960s–70s science wall chart: four spot inks (cyan, red, yellow, black) laid flat with a
// slight misregister against the black key line, halftone dot screens for tints and shadows, clean outlines, a yellowed
// paper with fold creases, a numbered title bar in heavy 黑体 and 仿宋 callouts with leader lines.
// Memory (蛰虫坯户): the ground is cut open; a beetle, a cricket and a grub pat mud pellets into their doorways (labelled
// 封土); the lightning is drawn back into the cloud with a diagram arrow (雷始收声); the pond sinks one ring below a
// dashed 原水位 line (水始涸).
// Film unit (8 s, one pentad per bar): 候一 雷始收声 — the bolt is drawn back up into the cloud, the sound arcs shrink;
// 候二 蛰虫坯户 (key) — the three burrowers pat mud pellets into their doorways and at 4.0 s all three doors are pressed
// shut together; 候三 水始涸 — the dashed 原水位 is printed and the water sinks one ring. The title bar names the current
// pentad, overprinted at the start of each bar. frame: true — the title bar and the cut-away run to the sheet's edges.
(function () {
  const JQ = window.JQ, S = JQ.SCENE, L = JQ.L, H = L.house;
  const BAR = 8 / 3, IMP = 1 * BAR + 4 / 3, HOU = JQ.TERMS[15].hou;
  const K = '#1C1A18', CY = '#46A3C6', RD = '#D5463A', YE = '#F0C232', PAPER = '#EEE5CC';
  const MIS = [3.2, 2.2];                                    // colour plates sit a hair off the key plate
  const pats = {};
  const dots = (col, step, r) => { const k = col + step + r; if (!pats[k]) { const c = document.createElement('canvas'); c.width = c.height = step * 2; const x = c.getContext('2d'); x.fillStyle = col;
    [[0, 0], [step, step], [2 * step, 0], [0, 2 * step], [2 * step, 2 * step]].forEach(([u, v]) => { x.beginPath(); x.arc(u, v, r, 0, 6.2832); x.fill(); }); pats[k] = c; } return pats[k]; };
  const plate = (g, p, fill) => { g.save(); g.translate(MIS[0], MIS[1]); g.fillStyle = fill; g.fill(p); g.restore(); };
  const screen = (g, p, col, step = 7, r = 1.8) => { g.save(); g.translate(MIS[0], MIS[1]); g.fillStyle = g.createPattern(dots(col, step, r), 'repeat'); g.fill(p); g.restore(); };
  const key = (g, p, w = 2.2) => { g.strokeStyle = K; g.lineWidth = w; g.lineJoin = 'round'; g.lineCap = 'round'; g.stroke(p); };
  const fy = (k, x) => x < 1180 ? JQ.lerp(JQ.lerp(L.HORIZON, 690, k), JQ.lerp(L.HORIZON, 640, k), x / 1180) : JQ.lerp(JQ.lerp(L.HORIZON, 640, k), JQ.lerp(L.HORIZON, 590, k), (x - 1180) / 740);
  const CUT = JQ.P([[1338, 852], [1920, 852], [1920, 1080], [1300, 1080]]);
  const BUR = [{ x: 1440, top: 852, cy: 990, rx: 96, ry: 54, kind: 'beetle', d0: 0, name: '甲虫' }, { x: 1622, top: 852, cy: 1010, rx: 92, ry: 52, kind: 'cricket', d0: 0.12, name: '蟋蟀' }, { x: 1790, top: 852, cy: 980, rx: 70, ry: 50, kind: 'grub', d0: 0.24, name: '蛴螬' }];
  BUR.forEach(b => { b.dx = b.x - b.rx * 0.55; b.dy = b.cy - b.ry * 0.62; });
  const label = (g, text, x, y, tx, ty, size = 32) => {
    g.strokeStyle = K; g.lineWidth = 1.6; g.beginPath(); g.moveTo(x, y); g.lineTo(tx, ty); g.stroke(); g.fillStyle = K; g.beginPath(); g.arc(x, y, 3.5, 0, 6.2832); g.fill();
    g.font = `700 ${size}px "STFangsong", "FangSong", "Songti SC", serif`; const w = g.measureText(text).width + 16, bx = tx - (tx < x ? w : 0), by = ty - size / 2 - 6;
    g.fillStyle = '#F6F0DE'; g.fillRect(bx, by, w, size + 12); g.strokeRect(bx, by, w, size + 12); g.fillStyle = K; g.textAlign = 'left'; g.textBaseline = 'middle'; g.fillText(text, bx + 8, ty);
  };

  const buildBg = g => {
    g.fillStyle = PAPER; g.fillRect(0, 0, 1920, 1080);
    const sky = new Path2D(); sky.rect(0, 0, 1920, L.HORIZON + 10); screen(g, sky, CY, 8, 2.1);
    plate(g, S.mountains.path, '#8CC4D8'); screen(g, S.mountains.path, '#2C7FA0', 6, 1.7); key(g, JQ.open(S.ridge.pts));
    plate(g, S.hills.path, '#7FB466'); key(g, JQ.open(S.hills.pts.slice(0, -2)), 1.8);
    plate(g, S.ground.path, '#E9CF96'); screen(g, S.ground.path, RD, 9, 1.4);
    plate(g, S.field.path, YE); S.furrows.forEach(f => key(g, f.path, 1.3));
    g.save(); g.clip(S.field.path); g.strokeStyle = K; g.lineWidth = 1.2; for (let r = 0; r < 8; r++) { const k = (r + 0.5) / 8, s = 3 + k * 6; for (let x = (r % 2) * s * 2; x < 1920; x += s * 4) { const y = fy(k, x); g.beginPath(); g.moveTo(x, y); g.lineTo(x - s * 0.3, y - s * 1.6); g.moveTo(x, y); g.lineTo(x + s * 0.3, y - s * 1.6); g.stroke(); } } g.restore();
    key(g, S.field.path, 1.6);
    plate(g, S.path.path, '#F2E6C4'); key(g, S.path.path, 1.6);
    plate(g, S.stream.path, CY); key(g, S.stream.path, 1.8);
    const B = L.bridge; plate(g, S.bridge.path, '#D8D4CA'); screen(g, S.bridge.path, K, 6, 1.1); key(g, S.bridge.path); key(g, JQ.open(S.bridgeArch.pts), 1.8);
    // the house in plates: grey roof by dot screen, white wall with a tint for the shade, red-brown door
    plate(g, S.roof.path, '#9AB4C0'); screen(g, S.roof.path, K, 5, 1.5); key(g, S.roof.path); S.roofLines.forEach((r, i) => i % 2 || key(g, r.path, 1));
    plate(g, S.chimney.path, '#B8B0A4'); key(g, S.chimney.path, 1.8);
    plate(g, S.houseFront.path, '#F4EEDC'); key(g, S.houseFront.path, 1.8); plate(g, S.window.path, '#4A6A7A'); key(g, S.window.path, 1.8);
    plate(g, S.wall.path, '#F4EEDC'); const shade = JQ.P([[H.wallX0, H.wallTop], [H.wallX0 + 60, H.wallTop], [H.wallX0 + 20, H.wallBot], [H.wallX0, H.wallBot]]); screen(g, shade, K, 6, 1.4);
    key(g, S.wall.path); plate(g, S.wallCap.path, '#8A847A'); key(g, S.wallCap.path, 1.8);
    plate(g, S.gate.path, '#A8533A'); key(g, S.gate.path); plate(g, S.gateRoof.path, '#8A847A'); key(g, S.gateRoof.path, 1.8);
    // the tree: brown trunk, green crown of outlined leaf masses, a dot-screen shade on the lower side
    plate(g, S.trunk.path, '#9A6440'); screen(g, S.trunk.path, K, 6, 1.6); key(g, S.trunk.path);
    g.strokeStyle = K; JQ.drawBranches(g, 1, 0.6);
    const crown = new Path2D(); S.clumps.forEach(q => { crown.moveTo(q.x + q.r * 0.95, q.y); crown.arc(q.x, q.y, q.r * 0.95, 0, 6.2832); }); g.strokeStyle = K; g.lineWidth = 4.6; g.stroke(crown);
    S.clumps.forEach((q, i) => { const p = new Path2D(); p.arc(q.x, q.y, q.r * 0.95, 0, 6.2832); plate(g, p, i % 3 ? '#6FAA4E' : '#88BC5A'); });
    g.save(); g.clip(S.canopy.path); const lo = new Path2D(); lo.rect(160, L.tree.canopy.cy + 40, 640, 240); screen(g, lo, K, 6, 1.6); g.restore();
    S.clumps.forEach((q, i) => { if (i % 3) return; const p = new Path2D(); p.arc(q.x, q.y, q.r * 0.9, 3.5, 5.6); key(g, p, 1.3); });
    // the cut-away section: soil strata, roots, pebbles, and three burrows with their shafts
    plate(g, CUT, '#B07A4A'); screen(g, CUT, K, 7, 1.6);
    g.save(); g.clip(CUT); [[874, '#C8945C'], [940, '#A06A3E'], [1046, '#8A5832']].forEach(([y, c]) => { const band = new Path2D(); band.rect(1290, y, 640, 18); plate(g, band, c); key(g, JQ.open([[1290, y], [1930, y + 4]]), 1); });
    for (let i = 0; i < 34; i++) { const p = new Path2D(); p.arc(1310 + JQ.hash(i, 3, 16) * 610, 880 + JQ.hash(i, 4, 16) * 190, 4 + JQ.hash(i, 5, 16) * 6, 0, 6.2832); plate(g, p, '#D8C0A0'); key(g, p, 1.2); }
    g.strokeStyle = K; g.lineWidth = 1.6; [[1345, 3], [1500, 4], [1700, 3]].forEach(([x, n]) => { for (let i = 0; i < n; i++) { g.beginPath(); g.moveTo(x, 856); g.quadraticCurveTo(x + (i - n / 2) * 10, 890, x + (i - n / 2) * 20, 920 + i * 14); g.stroke(); } });
    for (const b of BUR) { const p = new Path2D(); p.rect(b.dx - 17, b.top, 34, b.cy - b.top - b.ry + 14); p.ellipse(b.x, b.cy, b.rx, b.ry, 0, 0, 6.2832); g.fillStyle = '#F2E2BC'; g.fill(p); key(g, p, 2); }
    g.restore(); key(g, CUT, 2.6);
    g.strokeStyle = K; g.lineWidth = 1.5; for (let x = 1340; x < 1920; x += 14) { g.beginPath(); g.moveTo(x, 852); g.lineTo(x + 5, 838); g.lineTo(x + 9, 852); g.stroke(); }
  };

  // ---------------------------------------------------------------- the cast (cached), the title bar, labels and creases (cached, on top)
  // the family (story track) printed like the rest of the chart: each part a misregistered colour plate under a black key line
  const PEN = { skin: '#F2D2B0', hair: K, coat: RD, pants: '#3A6E9A', apron: '#F6F0DE', hat: CY, scarf: CY, straw: YE, cape: '#8A847A', eye: K,
    ox: '#D8A050', oxDark: '#7A4A2A', horn: '#F6EEDA', calf: '#E8B868', calfDark: '#8A5A30', prop: '#9A6440', metal: '#9AB4C0', red: RD, line: K };
  const castPrint = (g, items) => { for (const it of items) { const s = JQ.STORY_S(it.y || 1000); g.save(); g.globalAlpha = it.alpha == null ? 1 : it.alpha;
    for (const p of it.parts) { const c = JQ.roleColor(PEN, p.role); if (c == null) continue; if (p.role === 'eye' || p.role === 'line' || p.role === 'hair') { g.fillStyle = K; g.fill(p.path); continue; }
      plate(g, p.path, c); if (p.role === 'oxDark' || p.role === 'pants') screen(g, p.path, K, 5, 1.1); key(g, p.path, 1.2 + 0.9 * s); }
    g.restore(); } };
  // 秋分 in the story: they plough the near strip again (plough share ≈ 181 px behind the ox) and the kid sows winter wheat
  const stripAt = (x0, x1, k0, k1) => { const P = []; for (let x = x0; x <= x1; x += 20) P.push([x, fy(k0, x)]); P.push([x1, fy(k0, x1)], [x1, fy(k1, x1)]); for (let x = x1; x >= x0; x -= 20) P.push([x, fy(k1, x)]); P.push([x0, fy(k1, x0)]); return JQ.P(P); };
  const furrows = (g, CS, t) => { const o = CS.state.ox; if (t < 2.6 || !o) return; const x1 = Math.max(296, o.x - 181 * o.s), x0 = 290; if (x1 <= x0 + 4) return;
    const p = stripAt(x0, x1, 0.74, 1.0); plate(g, p, '#9A6A40'); screen(g, p, RD, 6, 1.3);
    for (const k of [0.8, 0.86, 0.92, 0.98]) { const q = []; for (let x = x0; x <= x1; x += 20) q.push([x, fy(k, x)]); q.push([x1, fy(k, x1)]); key(g, JQ.open(q), 1.3); }
    const kd = CS.state.kid, xs = t >= 3.0 && kd ? Math.min(x1, kd.x) : x0; g.fillStyle = YE; g.strokeStyle = K; g.lineWidth = 1;   // the sown seed
    for (let x = x0 + 8; x < xs; x += 16) for (const k of [0.83, 0.95]) { g.beginPath(); g.arc(x + (k > 0.9 ? 8 : 0), fy(k, x) - 2, 3.2, 0, 6.2832); g.fill(); g.stroke(); }
    key(g, p, 1.8); };
  const P = L.pond;
  const buildTop = g => {
    // diagram labels that are there from the start (the timed ones are printed per frame); leaders fan out, none cross
    label(g, '甲虫', 1426, 986, 1300, 1050); label(g, '蟋蟀', 1636, 1016, 1560, 1058); label(g, '蛴螬', 1786, 972, 1700, 905);
    // the diagram arrow: the bolt goes back up
    // the diagram arrow: the bolt goes back up (cloud and arrow sit right of the engine's title band)
    g.fillStyle = K; g.beginPath(); g.moveTo(1730, 446); g.lineTo(1730, 300); g.lineTo(1710, 300); g.lineTo(1740, 252); g.lineTo(1770, 300); g.lineTo(1750, 300); g.lineTo(1750, 446); g.closePath(); g.fill();
    label(g, '雷始收声', 1756, 380, 1766, 380);
    // the title bar: number box, heavy 黑体 term name (the pentad is overprinted per bar), the series line in 仿宋
    g.fillStyle = PAPER; g.fillRect(36, 24, 1848, 100); g.fillStyle = K; g.fillRect(36, 118, 1848, 7); g.fillRect(36, 24, 1848, 2.5);
    g.fillStyle = RD; g.fillRect(48, 34, 86, 78); g.fillStyle = '#F6F0DE'; g.font = '700 54px "DIN Alternate", Futura, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('16', 91, 75);
    g.fillStyle = K; g.textAlign = 'left'; g.textBaseline = 'alphabetic'; g.font = TITLE; g.fillText('秋分 · ', 156, 104);
    g.font = '700 30px "STFangsong", "FangSong", serif'; g.textAlign = 'right'; g.fillText('二十四节气科普挂图', 1872, 70); g.fillText('第十六幅', 1872, 108);
    // the paper: two fold creases and a little wear at the corners
    for (const [x0, y0, x1, y1] of [[960, 0, 960, 1080], [0, 540, 1920, 540]]) { g.strokeStyle = 'rgba(255,255,245,0.55)'; g.lineWidth = 3; g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.stroke(); g.strokeStyle = 'rgba(90,70,40,0.18)'; g.lineWidth = 2; g.beginPath(); g.moveTo(x0 + 2, y0 + 2); g.lineTo(x1 + 2, y1 + 2); g.stroke(); }
    const R = JQ.rng(1616); for (let i = 0; i < 1600; i++) { g.fillStyle = R() < 0.5 ? 'rgba(120,90,40,0.06)' : 'rgba(255,250,235,0.08)'; g.fillRect(R() * 1920, R() * 1080, 2 + R() * 3, 1 + R() * 2); }
  };
  const TITLE = '900 80px "Hiragino Sans GB", "PingFang SC", "STHeiti", sans-serif';
  // a label printed at time t0: the key plate drops in, the colour plate settles onto register
  const timed = (g, t, t0, args) => { const k = JQ.smooth(t0, t0 + 0.25, t); if (k <= 0) return; g.save(); g.globalAlpha = k; g.translate(0, (1 - k) * -10); label(g, ...args); g.restore(); };
  const titleHou = (g, t) => {
    const i = Math.min(2, Math.floor(t / BAR)), lt = t - i * BAR; g.font = TITLE; g.textAlign = 'left'; g.textBaseline = 'alphabetic'; const x = 156 + g.measureText('秋分 · ').width;
    if (i > 0 && lt < 0.15) { g.globalAlpha = 1 - lt / 0.15; g.fillStyle = K; g.fillText(HOU[i - 1], x, 104); }
    const k = i === 0 ? 1 : JQ.smooth(0.1, 0.4, lt), off = (1 - k) * 14; if (k <= 0) { g.globalAlpha = 1; return; }
    g.globalAlpha = k * 0.85; g.fillStyle = RD; g.fillText(HOU[i], x + MIS[0] + off, 104 + MIS[1] + off * 0.6); g.globalAlpha = k; g.fillStyle = K; g.fillText(HOU[i], x, 104); g.globalAlpha = 1;
  };
  // ---------------------------------------------------------------- the burrowers, drawn as textbook figures
  const insect = (g, b, t) => {
    const work = t > BAR && t < IMP, push = work ? Math.max(0, Math.sin(t * 9 + b.d0 * 20)) * 5 : 0, back = JQ.smooth(IMP, IMP + 0.4, t);
    g.save(); g.translate(b.dx + 30 - push + back * 12, b.dy + 8 - push * 0.6 + back * 8); g.scale(1.4, 1.4); const x = 14, y = 12;
    if (b.kind === 'beetle') {
      g.strokeStyle = K; g.lineWidth = 2; for (let i = -1; i <= 1; i++) { g.beginPath(); g.moveTo(x + i * 14, y + 8); g.lineTo(x + i * 20 + 6, y + 26); g.stroke(); }
      const body = new Path2D(); body.ellipse(x + 8, y + 6, 26, 22, 0.3, 0, 6.2832); plate(g, body, '#3A5A7A'); key(g, body, 1.6); key(g, JQ.open([[x - 12, y - 6], [x + 30, y + 16]]), 1.3);
      const hd = new Path2D(); hd.arc(x - 14, y - 12, 12, 0, 6.2832); plate(g, hd, '#2A2A2A'); key(g, hd, 1.6); key(g, JQ.open([[x - 22, y - 20], [x - 32, y - 36]]), 1.6);
    } else if (b.kind === 'cricket') {
      const leg = JQ.P([[x + 6, y + 4], [x + 56, y - 22], [x + 40, y + 20]]); plate(g, leg, '#8A5A30'); key(g, leg, 1.4);
      g.save(); g.translate(x + 18, y + 6); g.rotate(0.45); const body = new Path2D(); body.ellipse(0, 0, 40, 12, 0, 0, 6.2832); plate(g, body, '#5A3A20'); key(g, body, 1.6); g.restore();
      const hd = new Path2D(); hd.arc(x - 14, y - 10, 12, 0, 6.2832); plate(g, hd, '#5A3A20'); key(g, hd, 1.6);
      g.strokeStyle = K; g.lineWidth = 1.4; g.beginPath(); g.moveTo(x - 20, y - 20); g.quadraticCurveTo(x - 50, y - 60, x - 10, y - 74); g.stroke();
    } else { [[30, 18, 9], [24, 6, 11], [14, -2, 12], [2, -4, 13], [-8, 0, 14]].forEach(([dx, dy, r], i) => { const p = new Path2D(); p.arc(x + dx - 10, y + dy - 4, r, 0, 6.2832); plate(g, p, i % 2 ? '#F0D8A8' : '#F6E6C0'); key(g, p, 1.4); });
      const hd = new Path2D(); hd.arc(x - 22, y - 8, 8, 0, 6.2832); plate(g, hd, RD); key(g, hd, 1.4); }
    g.restore();
  };
  const PEL = [[-8, 6], [8, 6], [-8, -10], [8, -10], [-8, -26], [8, -26], [-8, -42], [8, -42]];
  const plug = (g, b, t) => {
    const t0 = BAR + 0.15 + b.d0, t1 = IMP - 0.12, k = JQ.clamp((t - t0) / (t1 - t0)), n = Math.floor(k * 8.999), fresh = k * 8.999 - n;
    if (t < IMP - 0.03) { for (let i = 0; i < Math.min(8, n + 1); i++) { const s = i < n ? 1 : JQ.ease(fresh * 2); if (s <= 0 || k <= 0) continue; const p = new Path2D(); p.arc(b.dx + PEL[i][0], b.dy + PEL[i][1], 9 * s, 0, 6.2832); plate(g, p, '#C08A50'); key(g, p, 1.3); } return; }
    // 4.0 s: the door is pressed shut — a smooth plug, a heavier key line, impact ticks
    const u = t - IMP + 0.03, sq = 1 + 0.08 * Math.exp(-u * 14);
    g.save(); g.translate(b.dx, b.dy - 19); g.scale(1 / sq, sq); const p = new Path2D(); p.roundRect(-17, -33, 34, 66, 8); plate(g, p, '#C08A50'); screen(g, p, K, 5, 1.1); key(g, p, 1.6 + 1.6 * Math.exp(-u * 4)); g.restore();
    if (u < 0.6) { g.lineCap = 'round'; for (const [col, w, dx] of [[RD, 6, MIS[0]], [K, 2.2, 0]]) { g.strokeStyle = col; g.globalAlpha = 1 - u / 0.6; g.lineWidth = w;
      for (let j = 0; j < 8; j++) { const a = j / 8 * 6.2832 + 0.2, r0 = 44 + u * 70; g.beginPath(); g.moveTo(b.dx + dx + Math.cos(a) * r0 * 0.75, b.dy - 19 + Math.sin(a) * r0); g.lineTo(b.dx + dx + Math.cos(a) * (r0 + 30) * 0.75, b.dy - 19 + Math.sin(a) * (r0 + 30)); g.stroke(); } } g.globalAlpha = 1; }
  };
  const BOLT = [[1120, 236], [1088, 318], [1132, 318], [1076, 404], [1120, 404], [1050, 494]];
  const cloud = g => { const p = new Path2D(); [[1040, 212, 40], [1100, 186, 54], [1166, 196, 48], [1222, 216, 34]].forEach(([x, y, r]) => { p.moveTo(x + r, y); p.arc(x, y, r, 0, 6.2832); }); p.rect(1000, 212, 256, 28);
    g.save(); g.translate(MIS[0], MIS[1]); g.fillStyle = '#D6D8D4'; g.fill(p); g.restore(); screen(g, p, K, 5, 1.6);
    [[1040, 212, 40, 3.0, 5.2], [1100, 186, 54, 3.5, 6.0], [1166, 196, 48, 4.0, 6.3], [1222, 216, 34, 4.5, 7.0]].forEach(([x, y, r, a0, a1]) => { const q = new Path2D(); q.arc(x, y, r, a0, a1); key(g, q, 2); }); key(g, JQ.open([[1000, 240], [1256, 240]]), 2); };

  JQ.ART[16] = {
    key: IMP, keyHou: JQ.TERMS[15].keyHou, focus: [[1560, 300], [1610, 960], [990, 880]], frame: true,
    draw(g, t, Sx) {
      JQ.blit(g, JQ.cached('s16bg', Sx, buildBg));
      // 候三: the pond — bank, exposed mud with a dot screen, the shrinking water, the dashed old water line
      const k = JQ.smooth(2 * BAR + 0.1, 2 * BAR + 2.3, t), sc = 1 - 0.22 * k;
      const rim = new Path2D(); rim.ellipse(P.cx, P.cy + 8, P.rx + 24, P.ry + 20, 0, 0, 6.2832); plate(g, rim, '#9A6A40'); key(g, rim, 2);
      const mud = new Path2D(); mud.ellipse(P.cx, P.cy, P.rx, P.ry, 0, 0, 6.2832); plate(g, mud, '#D8B07A'); screen(g, mud, RD, 6, 1.4);
      const water = new Path2D(); water.ellipse(P.cx, P.cy + 6 * (1 - sc), P.rx * sc, P.ry * sc, 0, 0, 6.2832); plate(g, water, CY); key(g, water, 2);
      g.save(); g.clip(water); g.strokeStyle = 'rgba(28,26,24,0.6)'; g.lineWidth = 1.3; for (let i = 1; i < 4; i++) { g.beginPath(); g.ellipse(P.cx, P.cy + 6 * (1 - sc), P.rx * sc * (1 - i * 0.22), P.ry * sc * (1 - i * 0.22), 0, 0, 6.2832); g.stroke(); } g.restore();
      const dk = JQ.smooth(2 * BAR, 2 * BAR + 0.3, t); if (dk > 0) { g.globalAlpha = dk; g.setLineDash([14, 10]); key(g, mud, 2.4); g.setLineDash([]); g.globalAlpha = 1; }
      const CS = JQ.castFor(Sx, t);
      furrows(g, CS, t);
      castPrint(g, CS.items.filter(it => it.y < 830));
      plate(g, S.trunk.path, '#9A6440'); screen(g, S.trunk.path, K, 6, 1.6); key(g, S.trunk.path);   // the old trunk stands in front of the field
      castPrint(g, CS.items.filter(it => it.y >= 830));
      for (const b of BUR) { insect(g, b, t); plug(g, b, t); }
      // 候一: the bolt is drawn back up into the cloud, and the sound arcs shrink with it (all moved 430 px right, out of the title band)
      const p = 1 - JQ.smooth(0.2, 2.2, t), yEnd = 236 + p * (494 - 236); g.save(); g.translate(430, 0);
      if (p > 0.01) { g.save(); g.beginPath(); g.rect(900, 0, 400, yEnd); g.clip(); const bolt = new Path2D(); BOLT.forEach(([x, y], i) => i ? bolt.lineTo(x + 14, y) : bolt.moveTo(x + 14, y)); BOLT.slice().reverse().forEach(([x, y]) => bolt.lineTo(x - 10, y + 6)); bolt.closePath();
        plate(g, bolt, YE); key(g, bolt, 2); g.restore();
        g.globalAlpha = p; g.setLineDash([10, 8]); for (let j = 0; j < 3; j++) { const r = (110 + j * 34) * (0.5 + 0.5 * p); for (const [a0, a1] of [[2.55, 3.75], [-0.6, 0.6]]) { const q = new Path2D(); q.ellipse(1130, 212, r, r * 0.6, 0, a0, a1); key(g, q, 2.2); } } g.setLineDash([]); g.globalAlpha = 1; }
      cloud(g); g.restore();
      timed(g, t, BAR + 0.1, ['封土', 1387, 930, 1352, 800]); timed(g, t, 2 * BAR + 0.1, ['原水位', 706, 842, 700, 722]); timed(g, t, 2 * BAR + 0.7, ['水始涸', 1020, 900, 1050, 742]);
      timed(g, t, 5.5, ['犁沟', 400, 650, 380, 762]);
      JQ.blit(g, JQ.cached('s16top', Sx, buildTop));
      titleHou(g, t);
    },
  };
})();
