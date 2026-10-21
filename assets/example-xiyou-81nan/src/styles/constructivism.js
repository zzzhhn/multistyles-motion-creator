// 48 构成主义 · 1920 年 · 求取芭蕉扇（8 拍）— Rodchenko/Lissitzky poster: cream paper, black bars, a halftone photo-montage of
// 铁扇公主 shouting 「不借！」 down a cone of type. Wukong (staff tucked away) swings the radial-geometry 芭蕉扇 three times (2.5,
// 3.5, 4.5): each swing shoots a wider red wedge into the black circle of the fire mountain and the circle grows; the third
// makes it burst in red-and-black rays while 「越扇越旺」 is stamped; on 6 a rubber stamp 「假扇」 slams over the princess's cone (第五十九至六十回).
(() => {
  'use strict';
  const XY = window.XY, TAU = XY.TAU, K = () => XY.KIT_F;
  const C = { paper: '#E9DFC4', red: '#C8231C', dred: '#8F1711', blk: '#151311', cream: '#F4ECD6', grey: '#8A857A', ochre: '#E3B03E' };
  const CIRC = [800, 300], MTN = [[600, 702], [830, 420], [1040, 702]];
  const poly = (g, pts) => { g.beginPath(); g.moveTo(pts[0][0], pts[0][1]); for (let k = 1; k < pts.length; k++) g.lineTo(pts[k][0], pts[k][1]); g.closePath(); };
  const PEN = { outline: C.blk, ow: 2.2, seed: 48, fine: true,
    color: r => ({ fur: '#3A2A1E', face: C.cream, wkshirt: C.red, tiger: C.ochre, stripe: C.blk, gold: C.ochre, staff: C.red, ink: C.blk, horse: C.cream, horse2: '#D8CDB0', mane: C.cream,
      hoof: C.blk, saddle: C.blk, red: C.red, robe: C.ochre, kasaya: C.red, skin: C.cream, metal: C.grey, bjrobe: C.blk, bjpants: '#2A2826', pig: '#E8B8A8', pig2: '#C88878', wood: C.grey,
      ssrobe: '#5A5650', ssrobe2: '#3A3834', skin2: '#C8A07A', ssh: C.red, ssbeard: C.red, skull: C.cream, bundle: C.ochre })[r] || C.grey };

  // grey "photograph" of 铁扇公主 in profile, hand cupped at her mouth → halftone dots (bg only: one pixel read per cell)
  const portrait = (g, x0, y0) => {
    const w = 260, h = 290, src = document.createElement('canvas'); src.width = w; src.height = h; const s = src.getContext('2d', { willReadFrequently: true });
    const lin = (x1, y1, x2, y2, a, b) => { const gr = s.createLinearGradient(x1, y1, x2, y2); gr.addColorStop(0, a); gr.addColorStop(1, b); return gr; };
    s.fillStyle = lin(110, 0, 260, 0, '#7a7a7a', '#f2f2f2'); poly(s, [[110, 230], [200, 230], [236, 290], [76, 290]]); s.fill();
    s.fillStyle = lin(130, 0, 180, 0, '#9a9a9a', '#e6e6e6'); poly(s, [[136, 186], [182, 186], [180, 238], [134, 238]]); s.fill();
    s.fillStyle = lin(80, 0, 210, 0, '#8c8c8c', '#f6f6f6'); s.beginPath(); s.ellipse(140, 124, 66, 74, 0, 0, TAU); s.fill();
    poly(s, [[150, 58], [186, 78], [196, 106], [216, 134], [202, 144], [208, 150], [192, 158], [204, 174], [192, 194], [160, 204], [130, 190]]); s.fill();
    s.fillStyle = '#1e1e1e'; poly(s, [[190, 151], [206, 150], [203, 173], [186, 166]]); s.fill();
    s.fillStyle = '#2a2a2a'; s.beginPath(); s.ellipse(174, 110, 8, 4, -0.1, 0, TAU); s.fill(); s.fillRect(160, 96, 26, 4);
    s.fillStyle = lin(60, 40, 140, 160, '#3a3a3a', '#101010'); poly(s, [[66, 126], [78, 70], [118, 42], [168, 46], [192, 76], [150, 68], [122, 92], [104, 140], [96, 196], [62, 176]]); s.fill();
    s.beginPath(); s.arc(66, 82, 30, 0, TAU); s.fill(); s.fillStyle = '#202020'; s.beginPath(); s.arc(128, 168, 7, 0, TAU); s.fill();
    s.fillStyle = lin(210, 120, 250, 190, '#f4f4f4', '#9a9a9a'); poly(s, [[208, 128], [236, 116], [252, 148], [244, 190], [212, 186]]); s.fill();
    s.strokeStyle = '#6a6a6a'; s.lineWidth = 2; [[222, 132, 246, 150], [222, 148, 248, 166], [220, 164, 244, 182]].forEach(L => { s.beginPath(); s.moveTo(L[0], L[1]); s.lineTo(L[2], L[3]); s.stroke(); });
    const d = s.getImageData(0, 0, w, h).data, cell = 5.2, ang = Math.PI / 4, ca = Math.cos(ang), sa = Math.sin(ang), P = new Path2D();
    for (let j = -60; j < 90; j++) for (let i = -60; i < 90; i++) { const u = i * cell, v = j * cell, x = u * ca - v * sa, y = u * sa + v * ca;
      if (x < 0 || y < 0 || x >= w || y >= h) continue; const o = ((y | 0) * w + (x | 0)) * 4; if (d[o + 3] < 128) continue;
      const L = d[o] / 255, r = cell * 0.62 * Math.sqrt(1 - L); if (r < 0.35) continue; P.moveTo(x0 + x + r, y0 + y); P.arc(x0 + x, y0 + y, r, 0, TAU); }
    g.fillStyle = C.blk; g.fill(P);
    // features re-drawn in clean pen over the dots (photo-montage retouching): brow, eye, red lips, the cupped fingers
    g.save(); g.translate(x0, y0); g.strokeStyle = C.blk; g.lineCap = 'round'; g.lineWidth = 4; g.beginPath(); g.moveTo(158, 96); g.lineTo(188, 92); g.stroke();
    g.lineWidth = 3; g.beginPath(); g.moveTo(164, 111); g.quadraticCurveTo(174, 104, 184, 110); g.stroke(); g.fillStyle = C.blk; g.beginPath(); g.arc(176, 111, 3, 0, TAU); g.fill();
    g.fillStyle = C.red; poly(g, [[188, 148], [208, 148], [205, 154], [190, 156]]); g.fill(); poly(g, [[188, 166], [204, 172], [196, 178], [186, 172]]); g.fill();
    g.lineWidth = 2.5; poly(g, [[208, 128], [236, 116], [252, 148], [244, 190], [212, 186]]); g.stroke();
    [[222, 132, 246, 150], [222, 148, 248, 166], [220, 164, 244, 182]].forEach(L => { g.beginPath(); g.moveTo(L[0], L[1]); g.lineTo(L[2], L[3]); g.stroke(); });
    g.lineWidth = 3; g.beginPath(); g.moveTo(150, 58); g.lineTo(186, 78); g.lineTo(196, 106); g.lineTo(216, 134); g.lineTo(202, 144); g.stroke(); g.restore();
  };
  // geometric block lettering (heavy sans, set like a poster)
  const block = (g, txt, x, y, px, col, rot = 0, stroke) => { g.save(); g.translate(x, y); g.rotate(rot); g.font = XY.font(px, XY.cnFont.hei, '900'); g.textBaseline = 'middle'; g.textAlign = 'center';
    if (stroke) { g.lineWidth = px * 0.08; g.strokeStyle = stroke; g.lineJoin = 'miter'; g.strokeText(txt, 0, 0); } g.fillStyle = col; g.fillText(txt, 0, 0); g.restore(); };

  XY.STYLES.constructivism = {
    bg(g, W, H) {
      K().paper(g, W, H, C.paper, 4801, 2200, 'rgba(120,96,60,0.08)', 'rgba(255,250,236,0.3)');
      // fine construction grid and two crossing black bars
      g.strokeStyle = 'rgba(21,19,17,0.12)'; g.lineWidth = 1; for (let x = 0; x < W; x += 59) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, 702); g.stroke(); } for (let y = 0; y < 702; y += 59) { g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke(); }
      g.save(); g.translate(20, 470); g.rotate(-0.42); g.fillStyle = C.blk; g.fillRect(0, 0, 700, 26); g.fillStyle = C.red; g.fillRect(40, 40, 380, 10); g.restore();
      g.fillStyle = C.red; g.save(); g.translate(330, 60); g.rotate(0.26); g.fillRect(0, 0, 70, 70); g.restore();
      // the photo-montage: red block behind, halftone profile on top
      g.fillStyle = C.red; poly(g, [[24, 250], [250, 210], [276, 360], [44, 380]]); g.fill();
      portrait(g, 30, 36);
      g.strokeStyle = C.blk; g.lineWidth = 3; g.strokeRect(30, 36, 260, 290);
      // the cone of type from her mouth
      g.fillStyle = 'rgba(200,35,28,0.12)'; poly(g, [[242, 196], [640, 70], [660, 330]]); g.fill();
      g.strokeStyle = C.blk; g.lineWidth = 2.5; g.beginPath(); g.moveTo(242, 194); g.lineTo(650, 62); g.moveTo(242, 200); g.lineTo(668, 336); g.stroke();
      // fire mountain: red triangle under the black circle (the circle itself is drawn per frame)
      g.fillStyle = C.red; poly(g, MTN); g.fill(); g.fillStyle = C.dred; poly(g, [MTN[1], MTN[2], [830, 702]]); g.fill();
      g.strokeStyle = C.blk; g.lineWidth = 3; poly(g, MTN); g.stroke();
      // vertical black bar with 芭蕉扇 reversed out, counter on a red block
      g.fillStyle = C.blk; g.fillRect(1062, 34, 92, 420);
      ['芭', '蕉', '扇'].forEach((ch, j) => block(g, ch, 1108, 92 + j * 122, 98, C.cream));
      g.fillStyle = C.red; g.fillRect(1030, 470, 130, 96); g.fillStyle = C.cream; g.font = XY.font(30, XY.cnFont.hei, '900'); g.textBaseline = 'alphabetic'; g.fillText('第', 1040, 512); g.fillText('难', 1040, 552);
      g.font = XY.font(66, 'Futura', 'bold'); g.fillStyle = C.blk; g.fillText('48', 1078, 548);
      // ground: slanted red band with a black edge
      g.fillStyle = C.red; poly(g, [[0, 702], [W, 702], [W, H], [0, H]]); g.fill(); g.fillStyle = C.blk; g.fillRect(0, 700, W, 9);
      g.fillStyle = C.dred; poly(g, [[0, 740], [W, 716], [W, 730], [0, 756]]); g.fill();
      g.fillStyle = C.cream; g.font = XY.font(22, XY.cnFont.hei, '900'); g.textBaseline = 'middle'; g.fillText('翠 云 山  ·  芭 蕉 洞  ·  借 扇  ·  第 五 十 九 回', 40, 762);
      g.strokeStyle = C.blk; g.lineWidth = 8; g.strokeRect(4, 4, W - 8, H - 8);
    },
    draw(g, e) {
      const { W, H, t, u, beat } = e, k = K(), st12 = k.step(t, 12);
      // ---- her shout: radio arcs from the mouth, and 「不借！」 stamped down the cone while the pilgrims are still away
      for (let j = 0; j < 4; j++) { const ph = (t * 1.3 + j / 4) % 1; g.strokeStyle = K().rgba(C.red, 1 - ph); g.lineWidth = 1 + 6 * (1 - ph); g.beginPath(); g.arc(244, 198, 18 + ph * 110, -0.55, 0.55); g.stroke(); }
      [['不', 330, 54, C.blk], ['借', 440, 90, C.blk], ['！', 580, 124, C.red]].forEach(([ch, x, px, col], j) => { const b0 = -2.3 + 0.3 * j; if (beat < b0) return;
        const s = 1 + 0.6 * (1 - XY.easeOut((beat - b0) / 0.22)), jig = beat < 0 ? 0 : -6 * Math.max(0, Math.sin(t * 9 - j));
        g.save(); g.translate(x, 200 + jig); g.scale(s, s); block(g, ch, 0, 0, px, col); g.restore(); });
      // ---- three swings of the fan (第六十回「一扇… 更旺；又一扇，比前又旺；又一扇，火高千丈」): beats 2.5, 3.5, 4.5
      const SW = [2.5, 3.5, 4.5], nSw = SW.filter(b => beat >= b).length, grow = SW.reduce((a, b, j) => a + XY.easeOut((beat - b) / 0.3) * [28, 40, 0][j], 0);
      const er = XY.easeOut((beat - 4.5) / 0.3) * (1 - 0.35 * XY.smooth((beat - 6.5) / 1.5)), r = 150 + grow + 90 * er, [cx, cy] = CIRC;
      if (er > 0) { for (let j = 0; j < 26; j++) { const a = j / 26 * TAU + t * 0.18, hw = 0.07, L = r * (1.6 + 0.9 * XY.hash(j, 3) + 0.1 * Math.sin(t * 7 + j)) * er;
        g.fillStyle = j % 2 ? C.blk : C.red; poly(g, [[cx + Math.cos(a - hw) * r * 0.9, cy + Math.sin(a - hw) * r * 0.9], [cx + Math.cos(a) * (r + L), cy + Math.sin(a) * (r + L)], [cx + Math.cos(a + hw) * r * 0.9, cy + Math.sin(a + hw) * r * 0.9]]); g.fill(); } }
      if (nSw > 0) { const ring = []; for (let j = 0; j < 40; j++) { const a = j / 40 * TAU, rr = r * (j % 2 ? 1.06 : 1.12 + 0.05 * nSw + 0.1 * XY.hash(st12, j)); ring.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]); }
        g.fillStyle = C.red; poly(g, ring); g.fill(); }
      g.fillStyle = C.blk; g.beginPath(); g.arc(cx, cy, r, 0, TAU); g.fill();
      for (let j = 0; j < 7 + 4 * nSw; j++) { if (XY.hash(st12, j, 48) < 0.35) continue; const a = j * 0.9 + 0.3, d = r * (0.25 + 0.5 * XY.hash(j, 2)), x = cx + Math.cos(a) * d, y = cy + Math.sin(a) * d, s = 8 + 10 * XY.hash(j, 5) + 6 * nSw;
        g.fillStyle = j % 3 ? C.red : C.ochre; poly(g, [[x - s, y + s * 0.6], [x, y - s], [x + s, y + s * 0.6]]); g.fill(); }
      g.save(); g.strokeStyle = C.red; g.lineWidth = 7; g.setLineDash([46, 22]); g.lineDashOffset = -t * 260; g.beginPath(); g.arc(cx, cy, r + 22, 0, TAU); g.stroke(); g.restore();
      g.fillStyle = C.red; poly(g, MTN); g.fill(); g.fillStyle = C.dred; poly(g, [MTN[1], MTN[2], [830, 702]]); g.fill(); g.strokeStyle = C.blk; g.lineWidth = 3; poly(g, MTN); g.stroke();
      if (er > 0) { g.fillStyle = C.blk; g.fillRect(1062, 34, 92, 420); ['芭', '蕉', '扇'].forEach((ch, j) => block(g, ch, 1108, 92 + j * 122, 98, C.cream));   // title stays on top of the blaze
        g.fillStyle = C.red; g.fillRect(1030, 470, 130, 96); g.fillStyle = C.cream; g.font = XY.font(30, XY.cnFont.hei, '900'); g.textBaseline = 'alphabetic'; g.fillText('第', 1040, 512); g.fillText('难', 1040, 552);
        g.font = XY.font(66, 'Futura', 'bold'); g.fillStyle = C.blk; g.fillText('48', 1078, 548); }
      // ---- acts: Wukong lifts the fan, swings it three times, then jumps back from the blaze; the others recoil
      const swingT = b => SW.reduce((a, s0) => Math.max(a, XY.clamp(1 - Math.abs(b - s0 + 0.05) / 0.32)), 0);
      const raise = XY.smooth((beat - 1.4) / 0.5) * (1 - swingT(beat)) * (1 - XY.smooth((beat - 4.8) / 0.4)), strike = swingT(beat);
      const acts = { wukong: { raise, strike, shade: k.after(beat, 4.9, 0.3) * (1 - k.after(beat, 6.4, 0.4)) }, monk: { palm: k.after(beat, 3.6, 0.4) }, bajie: { scratch: k.pulse(beat, 5.4, 0.8) }, shaseng: { lift: k.pulse(beat, 4.7, 0.6) } };
      const hand = e.at('wukong.hand', acts), chest = e.at('wukong.chest', acts), fa = Math.atan2(hand[1] - chest[1], hand[0] - chest[0]), F = [hand[0] + Math.cos(fa) * 52, hand[1] + Math.sin(fa) * 52];
      // ---- a red wedge shot from the fan into the circle on each swing (wider each time); the third is spat back
      SW.forEach((b0, j) => { const shoot = XY.easeOut((beat - b0) / 0.18) * (1 - XY.easeIn((beat - b0 - 0.55) / 0.2)); if (shoot <= 0.01) return;
        const dx = cx - F[0], dy = cy - F[1], L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L, w = 22 + 14 * j, tip = [F[0] + dx * shoot * 1.02, F[1] + dy * shoot * 1.02];
        g.fillStyle = C.red; poly(g, [[F[0] - uy * w, F[1] + ux * w], tip, [F[0] + uy * w, F[1] - ux * w]]); g.fill(); g.strokeStyle = C.blk; g.lineWidth = 2.5; g.stroke(); });
      // ---- the pilgrims: flat poster colours, printed through a dot screen; Wukong's staff is tucked away (he holds the fan)
      const hide = k.staffSet(e.phase, acts), [cv, lg] = k.layer(e, 'cons-proc');
      XY.drawProcession(lg, e.phase, e.procX, e.groundY, k.exceptPen(PEN, hide), acts);
      const S = e.S, dot = XY.keep('cons-dot:' + S.toFixed(4), Math.max(2, Math.round(6 * S)), Math.max(2, Math.round(6 * S)), c => { const d = c.getContext('2d'); d.fillStyle = '#151311'; d.beginPath(); d.arc(c.width / 2, c.height / 2, c.width * 0.26, 0, TAU); d.fill(); });
      lg.save(); lg.setTransform(1, 0, 0, 1, 0, 0); lg.globalCompositeOperation = 'source-atop'; lg.globalAlpha = 0.3; lg.fillStyle = lg.createPattern(dot, 'repeat'); lg.fillRect(0, 0, cv.width, cv.height);
      lg.restore(); k.blit(g, cv);
      // ---- the 芭蕉扇 as radial geometry: nine segments that open as he lifts it and spin a little while he waves
      const op = 0.55 + 0.45 * XY.smooth((beat - 0.4) / 0.6), spin = 0.25 * Math.sin(t * 6) * (strike > 0 ? 1 : 0.4), fr = 70;
      g.save(); g.lineCap = 'butt'; g.strokeStyle = C.blk; g.lineWidth = 7; g.beginPath(); g.moveTo(hand[0] - Math.cos(fa) * 16, hand[1] - Math.sin(fa) * 16); g.lineTo(F[0], F[1]); g.stroke();
      for (let j = 0; j < 9; j++) { const a0 = fa + spin - 1.35 * op + j / 9 * 2.7 * op, a1 = a0 + 2.7 * op / 9;
        g.fillStyle = [C.red, C.blk, C.cream][j % 3]; g.beginPath(); g.moveTo(F[0], F[1]); g.arc(F[0], F[1], fr * (j % 2 ? 0.92 : 1), a0, a1); g.closePath(); g.fill(); }
      g.strokeStyle = C.blk; g.lineWidth = 3; g.beginPath(); g.arc(F[0], F[1], fr, fa + spin - 1.35 * op, fa + spin + 1.35 * op); g.stroke();
      g.fillStyle = C.ochre; g.beginPath(); g.arc(F[0], F[1], 8, 0, TAU); g.fill(); g.stroke();
      if (strike > 0.05) { for (let j = 1; j <= 3; j++) { g.strokeStyle = K().rgba(C.blk, 0.5 - j * 0.12); g.lineWidth = 3; g.beginPath(); g.arc(hand[0], hand[1], fr + 24 + j * 16, fa - 0.9, fa + 0.5); g.stroke(); } }
      g.restore();
      // ---- 「越扇越旺」 stamped up a diagonal on the three swings and the blaze; Wukong's fur smokes; on 6.2 the fan is stamped 假
      ['越', '扇', '越', '旺'].forEach((ch, j) => { const b0 = [2.6, 3.6, 4.5, 4.7][j]; if (beat < b0) return; const s = 1 + 0.7 * (1 - XY.easeOut((beat - b0) / 0.12)), px = 62 + j * 14;
        g.save(); g.translate(360 + j * 100, 452 - j * 46); g.rotate(-0.42); g.scale(s, s); g.fillStyle = C.blk; g.fillRect(-px * 0.55 + 6, -px * 0.55 + 6, px * 1.1, px * 1.1);
        g.fillStyle = j === 3 ? C.blk : C.cream; g.fillRect(-px * 0.55, -px * 0.55, px * 1.1, px * 1.1); block(g, ch, 0, 2, px * 0.92, j === 3 ? C.red : C.red); g.restore(); });
      if (beat > 4.6 && beat < 7.6) { const hd = e.at('wukong.head', acts), d = beat - 4.6;
        for (let j = 0; j < 5; j++) { const s = 8 + j * 3 + d * 6; g.save(); g.translate(hd[0] - 18 + j * 9 + 10 * Math.sin(d * 4 + j), hd[1] - 24 - (d % 1.5) * 70 - j * 12); g.rotate(d * 2 + j); g.fillStyle = j % 2 ? C.blk : '#4a4540'; g.fillRect(-s / 2, -s / 2, s, s); g.restore(); } }
      // the reveal on 6: a rubber stamp 「假扇」 slammed over the princess's cone of type — the fan was a fake (she laughs, radio arcs double)
      const fk = XY.easeOut((beat - 6) / 0.12); if (fk > 0) { g.save(); g.translate(470, 250); g.rotate(-0.16); const sc = 1 + 1.2 * (1 - fk); g.scale(sc, sc);
        g.fillStyle = C.red; g.fillRect(-150, -74, 300, 148); g.strokeStyle = C.cream; g.lineWidth = 5; g.strokeRect(-138, -62, 276, 124);
        block(g, '假扇', 0, 4, 112, C.cream); g.restore();
        for (let j = 0; j < 3; j++) { const ph = (t * 2.4 + j / 3) % 1; g.strokeStyle = K().rgba(C.blk, 1 - ph); g.lineWidth = 3; g.beginPath(); g.arc(244, 198, 30 + ph * 150, -0.9, 0.9); g.stroke(); }
        g.save(); g.translate(150, 360); g.rotate(-0.1); block(g, '哈！哈！', 0, 0, 40 + 6 * Math.abs(Math.sin(t * 9)), C.blk); g.restore(); }
      e._zoom = [cx + 40, cy + 120, k.push(beat, 4.4, 0.15, 0.5, 1.1)];
    },
    post(canvas, g, e) { const z = e._zoom; if (z && z[2] > 0) K().postZoom(canvas, g, e, z[0], z[1], 1 + 0.15 * z[2]); },
    hits: [4.5, 6],
    thumb: 6.6,   // overview thumbnail: a clear frame with no in-panel push-in active
  };
})();
