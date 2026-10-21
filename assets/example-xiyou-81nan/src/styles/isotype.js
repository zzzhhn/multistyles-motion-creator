// 53 Isotype 信息图 · 1930 年 · 小雷音遇难（8 拍）— Neurath/Arntz pictogram chart on cream paper: a fake 雷音寺 assembled from
// icons (its roof is stacked arhat pictograms, the 小 雷音寺 plaque is the giveaway), tally rows counting the disguised demons
// (1 icon = 100; every arhat has a tail peeking from its robe), the chart's x-axis is the road. On 3.6 the cymbals are thrown,
// on 4 the 金铙 claps shut over the real Wukong (only his legs keep walking) and the chart's tally boxes the pilgrims one by one;
// 亢金龙's horn drills through on 4.9 and on 5.4 the cymbals split (第六十五回).
(() => {
  'use strict';
  const XY = window.XY, TAU = XY.TAU, K = () => XY.KIT_F;
  const C = { paper: '#EFE8D6', blk: '#1E1C1A', red: '#C23B22', blue: '#2D5DA1', grey: '#9A9790', ochre: '#D8A23A', gold: '#E2B33C', cream: '#F8F2E2', brown: '#8A5A2A' };
  // the fake temple is the chart's own key figure: on the right, scaled 0.72 about its baseline (y 560), behind the road
  const TEMPLE = [940, 560], TS = 0.72, TF = (g, fn) => { g.save(); g.translate(TEMPLE[0], TEMPLE[1]); g.scale(TS, TS); g.translate(-TEMPLE[0], -TEMPLE[1]); fn(); g.restore(); };
  const poly = (g, pts) => { g.beginPath(); g.moveTo(pts[0][0], pts[0][1]); for (let k = 1; k < pts.length; k++) g.lineTo(pts[k][0], pts[k][1]); g.closePath(); };
  // flat silhouettes, no contour, two tones per figure (Arntz)
  const PEN = { seed: 53, fine: false, shade: false,
    color: r => ({ fur: C.brown, face: '#E8C89A', wkshirt: C.red, tiger: C.ochre, stripe: C.brown, gold: C.ochre, staff: C.red, ink: C.blk, horse: '#C9C6BC', horse2: C.grey, mane: '#C9C6BC', hoof: C.blk,
      saddle: C.blk, red: C.red, robe: C.ochre, kasaya: C.red, skin: '#E8C89A', metal: C.grey, bjrobe: C.blk, bjpants: '#3A3836', pig: '#D89A8E', pig2: '#B87A70', wood: C.blk,
      ssrobe: C.blue, ssrobe2: '#1F4478', skin2: '#B88A60', ssh: C.red, ssbeard: C.red, skull: C.cream, bundle: C.ochre })[r] || C.grey };

  // ---- pictograms on a unit box (height ~44), x at centre, y = feet
  const icon = {
    arhat: (g, x, y, s, t, j) => { g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = C.grey; poly(g, [[-13, 0], [13, 0], [9, -28], [-9, -28]]); g.fill(); g.beginPath(); g.arc(0, -35, 7.5, 0, TAU); g.fill();
      g.strokeStyle = C.red; g.lineWidth = 2.6; g.lineCap = 'round'; const w = Math.sin(t * 7 + j * 1.3) * 0.5; g.beginPath(); g.moveTo(10, -3); g.quadraticCurveTo(20, -6 + w * 6, 18 + w * 4, -16); g.stroke();   // the tail
      g.fillStyle = C.red; poly(g, [[18 + w * 4, -20], [22 + w * 4, -14], [14 + w * 4, -14]]); g.fill(); g.restore(); },
    guard: (g, x, y, s) => { g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = C.blk; g.fillRect(-10, -30, 20, 30); g.beginPath(); g.arc(0, -37, 7.5, 0, TAU); g.fill(); poly(g, [[-14, -30], [14, -30], [10, -22], [-10, -22]]); g.fill();
      g.fillRect(14, -50, 3, 50); g.fillStyle = C.red; poly(g, [[12, -50], [19, -50], [15.5, -60]]); g.fill(); g.restore(); },
    buddha: (g, x, y, s, t) => { g.save(); g.translate(x, y); g.scale(s, s);
      g.fillStyle = C.gold; g.beginPath(); g.arc(0, -40, 24, 0, TAU); g.fill(); g.strokeStyle = C.ochre; g.lineWidth = 1.6; for (let j = 0; j < 16; j++) { const a = j / 16 * TAU + t * 0.8; g.beginPath(); g.moveTo(Math.cos(a) * 24, -40 + Math.sin(a) * 24); g.lineTo(Math.cos(a) * 30, -40 + Math.sin(a) * 30); g.stroke(); }
      g.fillStyle = C.red; poly(g, [[-22, 0], [22, 0], [12, -26], [-12, -26]]); g.fill(); g.fillStyle = '#E8C89A'; g.beginPath(); g.arc(0, -36, 9, 0, TAU); g.fill(); g.beginPath(); g.arc(0, -46, 4, 0, TAU); g.fill();
      g.fillStyle = '#F2D21E'; g.fillRect(-8, -40, 7, 2.6); g.fillRect(1, -40, 7, 2.6); g.restore(); },        // the yellow brows (黄眉)
    wukong: (g, x, y, s) => { g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = C.red; poly(g, [[-9, -6], [9, -6], [7, -26], [-7, -26]]); g.fill(); g.fillStyle = C.brown; g.fillRect(-8, -6, 5, 6); g.fillRect(3, -6, 5, 6);
      g.beginPath(); g.arc(0, -32, 7, 0, TAU); g.fill(); g.fillStyle = C.ochre; g.fillRect(-7, -37, 14, 2.4); g.fillStyle = C.red; g.fillRect(12, -44, 3, 40); g.strokeStyle = C.brown; g.lineWidth = 2.4; g.beginPath(); g.moveTo(-8, -8); g.quadraticCurveTo(-20, -10, -16, -24); g.stroke(); g.restore(); },
    monk: (g, x, y, s) => { g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = C.red; poly(g, [[-12, 0], [12, 0], [8, -28], [-8, -28]]); g.fill(); g.fillStyle = C.ochre; poly(g, [[-12, 0], [-2, 0], [-6, -28], [-8, -28]]); g.fill();
      g.fillStyle = '#E8C89A'; g.beginPath(); g.arc(0, -34, 7, 0, TAU); g.fill(); g.fillStyle = C.ochre; poly(g, [[-8, -38], [8, -38], [6, -46], [0, -42], [-6, -46]]); g.fill(); g.fillStyle = C.grey; g.fillRect(13, -48, 2.4, 48); g.restore(); },
    bajie: (g, x, y, s) => { g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = C.blk; g.beginPath(); g.ellipse(0, -14, 13, 14, 0, 0, TAU); g.fill(); g.fillStyle = '#D89A8E'; g.beginPath(); g.arc(0, -34, 9, 0, TAU); g.fill();
      poly(g, [[-9, -38], [-16, -30], [-7, -32]]); g.fill(); g.fillRect(8, -36, 6, 5); g.fillStyle = C.blk; g.fillRect(-16, -50, 2.4, 44); g.restore(); },
    sha: (g, x, y, s) => { g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = C.blue; poly(g, [[-10, 0], [10, 0], [8, -28], [-8, -28]]); g.fill(); g.fillStyle = '#B88A60'; g.beginPath(); g.arc(0, -34, 7, 0, TAU); g.fill();
      g.fillStyle = C.red; poly(g, [[-3, -30], [6, -30], [2, -22]]); g.fill(); g.fillStyle = C.blk; g.fillRect(-18, -30, 36, 2.4); g.fillStyle = C.ochre; g.fillRect(-20, -27, 6, 7); g.fillRect(14, -27, 6, 7); g.restore(); },
  };
  // the cymbal (金铙): a gold disc seen edge-on as a lens; half = -1 / +1 for the left / right plate, 0 for both closed
  const cymbal = (g, x, y, rx, ry, half) => { g.fillStyle = C.gold; g.beginPath();
    if (half === 0) g.ellipse(x, y, rx, ry, 0, 0, TAU); else g.ellipse(x, y, rx * 0.5, ry, 0, half < 0 ? Math.PI / 2 : -Math.PI / 2, half < 0 ? Math.PI * 1.5 : Math.PI / 2);
    g.fill(); g.fillStyle = C.ochre; g.beginPath(); g.ellipse(x, y, rx * 0.12, ry * 0.12, 0, 0, TAU); g.fill(); };

  const ROWS = [['假佛', 244], ['假罗汉', 300], ['假揭谛', 356], ['师徒', 412]];
  XY.STYLES.isotype = {
    bg(g, W, H) {
      K().paper(g, W, H, C.paper, 5301, 1500, 'rgba(110,90,60,0.06)', 'rgba(255,252,240,0.3)');
      g.fillStyle = C.blk; g.font = XY.font(100, XY.cnFont.hei, '900'); g.textBaseline = 'alphabetic'; g.fillText('小雷音', 40, 124);
      g.fillStyle = C.red; g.fillRect(44, 138, 300, 6);
      g.fillStyle = C.blk; g.font = XY.font(28, XY.cnFont.hei, '900'); g.fillText('第', 44, 178); g.font = XY.font(40, 'Futura', 'bold'); g.fillText('53', 78, 180); g.font = XY.font(28, XY.cnFont.hei, '900'); g.fillText('难', 132, 178);
      g.fillStyle = '#6A665E'; g.font = XY.font(19, XY.cnFont.hei, 'bold'); g.fillText('小雷音寺人数统计 · 每个图形代表 100', 176, 176);
      // tally rows: labels, rules (icons per frame)
      ROWS.forEach(([lab, y], j) => { g.fillStyle = C.blk; g.font = XY.font(22, XY.cnFont.hei, '900'); g.fillText(lab, 44, y - 8); g.fillStyle = 'rgba(30,28,26,0.25)'; g.fillRect(44, y + 8, 560, 1.5); });
      // the fake temple: platform, columns, the plaque that says 小 雷音寺 (the 小 is the giveaway), door
      const [tx, ty] = TEMPLE; g.fillStyle = '#DDD4BE'; g.fillRect(tx - 172, ty, 344, 12); g.fillStyle = C.blk; g.fillRect(tx - 172, ty + 10, 344, 2);
      TF(g, () => {
      g.fillStyle = C.grey; g.fillRect(tx - 190, ty - 40, 380, 40); g.fillRect(tx - 170, ty - 56, 340, 16);
      g.fillStyle = C.blk; [-150, -96, 96, 150].forEach(dx => g.fillRect(tx + dx - 9, ty - 250, 18, 194));
      g.fillStyle = C.red; poly(g, [[tx - 200, ty - 250], [tx + 200, ty - 250], [tx + 170, ty - 280], [tx - 170, ty - 280]]); g.fill();
      g.fillStyle = C.blk; g.fillRect(tx - 58, ty - 196, 116, 140);
      g.fillStyle = C.cream; g.fillRect(tx - 70, ty - 246, 140, 40); g.strokeStyle = C.blk; g.lineWidth = 3; g.strokeRect(tx - 70, ty - 246, 140, 40);
      g.fillStyle = C.blk; g.font = XY.font(15, XY.cnFont.hei, '900'); g.fillText('小', tx - 62, ty - 220); g.font = XY.font(30, XY.cnFont.hei, '900'); g.fillText('雷音寺', tx - 44, ty - 214); });
      // the road is the chart's x-axis
      g.fillStyle = C.blk; g.fillRect(0, 700, W, 4); g.font = XY.font(14, 'Futura', 'bold'); g.fillStyle = '#6A665E';
      for (let x = 30, k = 0; x < W; x += 59, k++) { g.fillStyle = C.blk; g.fillRect(x, 704, 2, k % 5 ? 6 : 12); if (k % 5 === 0) { g.fillStyle = '#6A665E'; g.fillText(String(k * 10), x - 6, 732); } }
      g.fillStyle = '#6A665E'; g.font = XY.font(16, XY.cnFont.hei, 'bold'); g.fillText('里 →  西天', W - 120, 732);
      // legend
      g.fillStyle = C.gold; g.beginPath(); g.ellipse(70, 760, 16, 9, 0, 0, TAU); g.fill(); g.fillStyle = C.blk; g.font = XY.font(18, XY.cnFont.hei, 'bold'); g.fillText('金铙', 94, 766);
      g.strokeStyle = C.blk; g.lineWidth = 2.5; g.strokeRect(170, 750, 18, 18); g.fillText('被擒', 196, 766); g.fillStyle = C.red; g.fillRect(280, 756, 14, 3); g.fillStyle = C.blk; g.fillText('尾巴 = 妖精假扮', 302, 766);
    },
    draw(g, e) {
      const { W, H, t, u, beat } = e, k = K(), [tx, ty] = TEMPLE;
      // tallies count up as the chart arrives (u < 0.15), then stay
      const cnt = XY.easeOut((u + 0.4) / 0.5), nums = [1, 500, 400];
      g.fillStyle = C.blk; g.font = XY.font(22, 'Futura', 'bold'); g.textAlign = 'right';
      nums.forEach((n, j) => g.fillText(String(Math.round(n * cnt)), 600, ROWS[j][1] - 8)); g.textAlign = 'left';
      icon.buddha(g, 150, ROWS[0][1] + 4, 0.75, t);
      for (let j = 0; j < 5; j++) if (cnt * 5 > j) icon.arhat(g, 160 + j * 44, ROWS[1][1] + 4, 1, t, j);
      for (let j = 0; j < 4; j++) if (cnt * 4 > j) icon.guard(g, 160 + j * 44, ROWS[2][1] + 4, 1);
      // the temple: roof stacked from arhat icons, the fake Buddha in the door, flags in the wind
      TF(g, () => { [[1, 0], [3, 1], [5, 2], [7, 3]].forEach(([n, r]) => { for (let j = 0; j < n; j++) icon.arhat(g, tx + (j - (n - 1) / 2) * 34, ty - 286 - (3 - r) * 34, 0.62, t, j + r * 7); });
        icon.buddha(g, tx, ty - 64, 1.6, t); });
      [-1, 1].forEach(d => { g.fillStyle = C.blk; g.fillRect(tx + d * 196 - 2, ty - 330, 4, 290); for (let j = 0; j < 4; j++) { const w = 10 * Math.sin(t * 5 + j * 0.8 + d); g.fillStyle = j % 2 ? C.ochre : C.red; poly(g, [[tx + d * 196, ty - 326 + j * 22], [tx + d * 196 + d * (30 + w), ty - 318 + j * 22], [tx + d * 196, ty - 306 + j * 22]]); g.fill(); } });
      // ---- the 师徒 row: Wukong's icon gets a cymbal on beat 3, the other three are boxed in on 3.25 / 3.5 / 3.75, Wukong is out again on 3.95
      const closedB = beat >= 4 && beat < 5.4, freeN = 4 - (closedB ? 1 : 0) - [4.25, 4.5, 4.75].filter(b => beat >= b).length;
      ['wukong', 'monk', 'bajie', 'sha'].forEach((n, j) => { const x = 160 + j * 46, y = ROWS[3][1] + 4; icon[n](g, x, y, 1);
        if (j === 0 && closedB) cymbal(g, x, y - 26, 16, 24, 0);
        if (j > 0 && beat >= 4 + j * 0.25) { const s = 1 + 0.4 * (1 - XY.easeOut((beat - 4 - j * 0.25) / 0.12)); g.strokeStyle = C.blk; g.lineWidth = 3; g.strokeRect(x - 20 * s, y - 50 * s, 40 * s, 52 * s);
          g.lineWidth = 1.6; for (let q = 1; q < 4; q++) { g.beginPath(); g.moveTo(x - 20 * s + q * 10 * s, y - 50 * s); g.lineTo(x - 20 * s + q * 10 * s, y + 2); g.stroke(); } } });
      g.fillStyle = C.blk; g.font = XY.font(22, 'Futura', 'bold'); g.textAlign = 'right'; g.fillText(String(freeN), 600, ROWS[3][1] - 8); g.textAlign = 'left';
      // ---- acts: Wukong sees through the fake temple, the monk bows to it anyway
      const acts = { wukong: { shade: XY.smooth((beat - 0.6) / 0.3) * (1 - XY.smooth((beat - 2.0) / 0.3)), raise: k.after(beat, 5.5, 0.3), strike: k.pulse(beat, 5.9, 0.35) }, monk: { palm: XY.smooth((beat - 2.0) / 0.4) * (1 - XY.smooth((beat - 3.9) / 0.4)) },
        bajie: { scratch: k.pulse(beat, 1.2, 0.9) + k.pulse(beat, 6.4, 0.7) }, shaseng: { lift: k.pulse(beat, 4.4, 0.5) } };
      // ---- the cymbals: hanging by the door, thrown on 2.6, clapped shut over Wukong on 3, drilled by the horn on 3.55, split on 3.95 (before he reaches the frame edge)
      const ch = e.at('wukong.chest', acts), lc = [ch[0] + 4, ch[1] - 4], RX = 56, RY = 76;
      const shake = beat >= 4 && beat < 5.4 ? [2.5 * Math.sin(t * 34), 1.5 * Math.cos(t * 27)] : [0, 0];
      if (beat < 4) { const f = XY.easeIn((beat - 3.6) / 0.4);
        [-1, 1].forEach(d => { const sx = tx + d * 123 * TS, sy = ty - 186 * TS; if (f <= 0) { g.fillStyle = C.blk; g.fillRect(sx - 1, sy - 46, 2, 22); } const ex = lc[0] + d * RX * 0.5 * (1 + 2 * (1 - XY.clamp((beat - 3.85) / 0.15))), ey = lc[1];
          const x = XY.lerp(sx, ex, f), y = XY.lerp(sy, ey, f) - 140 * Math.sin(Math.PI * f); g.save(); if (f > 0 && f < 1) { g.globalAlpha = 0.3; cymbal(g, XY.lerp(sx, ex, f * 0.85), XY.lerp(sy, ey, f * 0.85) - 140 * Math.sin(Math.PI * f * 0.85), RX * 0.8, RY * 0.8, d); g.globalAlpha = 1; }
          cymbal(g, x, y, f > 0 ? RX : 32, f > 0 ? RY : 40, d); g.restore(); }); }
      // ---- the pilgrims as flat pictogram silhouettes; while the cymbals are shut only Wukong's legs show below them
      const shut = beat >= 4 && beat < 5.4;
      if (!shut) XY.drawProcession(g, e.phase, e.procX, e.groundY, PEN, acts);
      else { XY.drawProcession(g, e.phase, e.procX, e.groundY, PEN, { ...acts, cast: { wukong: false } });
        g.save(); g.beginPath(); g.rect(0, lc[1] + RY - 8, W, H); g.clip(); XY.drawProcession(g, e.phase, e.procX, e.groundY, PEN, { ...acts, cast: { monk: false, bajie: false, shaseng: false } }); g.restore();
        cymbal(g, lc[0] + shake[0], lc[1] + shake[1], RX, RY, 0); g.fillStyle = 'rgba(255,248,220,0.5)'; g.beginPath(); g.ellipse(lc[0] - 18 + shake[0], lc[1] - 26, 10, 22, 0.3, 0, TAU); g.fill();
        const hornIn = XY.easeOut((beat - 4.9) / 0.22); if (hornIn > 0) { const hx = lc[0], top = lc[1] - RY - 90 + hornIn * 70; g.fillStyle = C.ochre; poly(g, [[hx - 10, top - 50], [hx + 10, top - 50], [hx, top + 46]]); g.fill();
          g.strokeStyle = C.blk; g.lineWidth = 1.6; for (let q = 0; q < 4; q++) { g.beginPath(); g.moveTo(hx - 8 + q * 2, top - 40 + q * 18); g.lineTo(hx + 8 - q * 2, top - 36 + q * 18); g.stroke(); } } }
      if (beat >= 5.4 && beat < 6.4) { const f = (beat - 5.4) / 1.0; [-1, 1].forEach(d => { g.save(); g.translate(lc[0] + d * (20 + 160 * f), lc[1] - 80 * f + 500 * f * f); g.rotate(d * f * 4); cymbal(g, 0, 0, RX, RY, d); g.restore(); }); }
      e._zoom = [lc[0], lc[1] - 40, k.push(beat, 3.9, 0.15, 0.6, 1.1)];
    },
    post(canvas, g, e) { const z = e._zoom; if (z && z[2] > 0) K().postZoom(canvas, g, e, z[0], z[1], 1 + 0.12 * z[2]); },
    hits: [4, 5.4],
    thumb: 5.8,   // overview thumbnail: a clear frame with no in-panel push-in active
  };
})();
