// 59 瑞士国际主义 · 七情迷没 — a 1960 Swiss poster: 12-column construction grid, flush-left grotesque type, black, white,
// one red, one spring blue. The seven spider spirits of 盘丝洞 are seven geometric spiders (disc body, eight jointed legs),
// each carrying one passion. v10 (8 beats): they let down threads (0.4–1.6), drop into one row (1.8), weave the grid into
// a strict rectangular web (2.0–3.4); beat 3.6 seven threads fan into 唐僧, a red square closes and silk wraps him;
// beat 5 悟空's staff cuts every thread, the square flies apart and the web sags.
(() => {
  'use strict';
  const XY = window.XY, K = XY.KIT_G, TAU = XY.TAU;
  const PAPER = '#F3F1EB', BLACK = '#141414', RED = '#E2231A', HAIR = '#D9D6CE', BLUE = '#2C6CB0';
  const M = 44, NC = 12, NR = 8, QING = '喜怒哀惧爱恶欲';
  const ROW = [1.5, 2.3, 1.2, 2.9, 1.8, 2.6, 1.4];
  const DROP = 1.8, SHOOT = 3.6, CUT = 5;
  const HN = '"Helvetica Neue", Helvetica, Arial, sans-serif', PF = '"PingFang SC", "Heiti SC", sans-serif';
  const grid = W => { const cw = (W - 2 * M) / NC, rh = (780 - 2 * M) / NR; return { cw, rh, cx: c => M + c * cw, ry: r => M + r * rh }; };

  const PEN = { color: r => ({ kasaya: RED, wkshirt: RED, staff: RED, red: RED, ssh: RED, ssbeard: RED, saddle: BLACK, bjrobe: BLACK, bjpants: '#262626', ink: BLACK, stripe: BLACK, hoof: BLACK,
    ssrobe: '#4A4A4A', ssrobe2: '#363636', fur: '#7A7A7A', tiger: '#C4C4C4', gold: '#A8A8A8', metal: '#A8A8A8', robe: '#D6D6D2', bundle: '#C4C4C4', wood: '#5A5A5A', skull: '#FFFFFF' })[r] || '#FBFAF6',
    outline: BLACK, ow: 1.1, shade: 'rgba(0,0,0,0.16)' };
  const HALO = { color: () => PAPER, outline: PAPER, ow: 6, shade: false, fine: false };
  const actsAt = b => ({ wukong: { shade: K.win(b, 1.6, 3.2, 0.3), raise: K.win(b, CUT - 0.45, CUT + 0.7, 0.15) }, monk: { palm: K.win(b, SHOOT + 0.2, CUT + 0.2, 0.15) }, bajie: { scratch: K.win(b, 6.6, 11, 0.3) }, shaseng: { lift: K.win(b, SHOOT, SHOOT + 1, 0.2) } });
  // a geometric spider: disc abdomen with the passion, small cephalothorax, eight two-segment legs
  const spider = (g, x, y, k, t, lift) => {
    const red = k === 4, col = red ? RED : BLACK;
    g.strokeStyle = col; g.lineWidth = 3; g.lineJoin = 'miter'; g.beginPath();
    for (let j = 0; j < 8; j++) { const sd = j < 4 ? -1 : 1, i = j % 4, a = -0.9 + i * 0.6, wig = 0.12 * Math.sin(t * 9 + j + k) * lift;
      const kx = x + sd * (30 + 10 * Math.cos(a)), ky = y - 18 + i * 12 - 18 + wig * 20, fx = x + sd * (56 + 6 * i), fy = y - 30 + i * 22 + wig * 30; g.moveTo(x + sd * 22, y - 22 + i * 10); g.lineTo(kx, ky); g.lineTo(fx, fy); }
    g.stroke();
    g.fillStyle = col; g.beginPath(); g.arc(x, y, 34, 0, TAU); g.fill(); g.beginPath(); g.arc(x, y - 40, 14, 0, TAU); g.fill();
    g.fillStyle = PAPER; g.beginPath(); g.arc(x - 5, y - 44, 2.6, 0, TAU); g.arc(x + 5, y - 44, 2.6, 0, TAU); g.fill();
    K.text(g, QING[k], x, y + 13, XY.font(36, PF, '600'), PAPER, { align: 'center' });
  };

  XY.STYLES.swiss = {
    hits: [SHOOT, CUT],
    bg(g, W, H) {
      const G = grid(W);
      g.fillStyle = PAPER; g.fillRect(0, 0, W, H);
      const R = XY.rng(5901); for (let k = 0; k < 1800; k++) { g.fillStyle = R() < 0.5 ? 'rgba(0,0,0,0.035)' : 'rgba(255,255,255,0.5)'; g.fillRect(R() * W, R() * H, 1.5, 1.5); }
      g.fillStyle = BLACK; g.fillRect(M, 702, W - 2 * M, 3);
      // the text column: count, the chapter title, and the spring as a blue block
      K.text(g, '59', M - 6, G.ry(4.3), XY.font(150, HN, 'bold'), RED);
      K.text(g, '第七十二回', M, G.ry(4.3) + 36, XY.font(22, PF, '600'), BLACK);
      K.text(g, '盘丝洞七情迷本', M, G.ry(4.3) + 64, XY.font(22, PF, '400'), BLACK);
      K.text(g, '濯垢泉八戒忘形', M, G.ry(4.3) + 92, XY.font(22, PF, '400'), BLACK);
      g.fillStyle = BLUE; g.fillRect(M, G.ry(6.3), G.cx(4) - M, 690 - G.ry(6.3));
      K.text(g, '濯垢泉', M + 12, 680, XY.font(22, PF, '600'), PAPER);
      // under the ground rule: the seven passions as an index, and a scale bar across the web's columns
      for (let k = 0; k < 7; k++) { const x = M + k * 42; g.fillStyle = k === 4 ? RED : BLACK; g.fillRect(x, 716, 34, 34); K.text(g, QING[k], x + 17, 742, XY.font(22, PF, '600'), PAPER, { align: 'center' }); }
      g.fillStyle = BLACK; g.fillRect(G.cx(5), 724, W - M - G.cx(5), 2);
      for (let i = 0; i <= 14; i++) { const x = G.cx(5) + i * G.cw / 2; g.fillRect(x - 1, 716, 2, i % 2 ? 8 : 16); }
      K.text(g, '0', G.cx(5), 750, XY.font(16, HN), BLACK); K.text(g, '7', W - M, 750, XY.font(16, HN), BLACK, { align: 'right' });
    },
    draw(g, e) {
      const { W, H, t, u } = e, b = e.beat, G = grid(W), acts = actsAt(b), sag = XY.easeOut(K.ramp(b, CUT, 0.8));
      // construction grid hairlines sweep in on the entrance
      g.strokeStyle = HAIR; g.lineWidth = 1; g.beginPath();
      for (let c = 0; c <= NC; c++) { const f = XY.easeOut(K.ramp(b, -0.4 + c * 0.06, 0.5)); if (f <= 0) continue; g.moveTo(G.cx(c), M); g.lineTo(G.cx(c), M + (H - 2 * M) * f); }
      for (let r = 0; r <= NR; r++) { const f = XY.easeOut(K.ramp(b, -0.2 + r * 0.06, 0.5)); if (f <= 0) continue; g.moveTo(M, G.ry(r)); g.lineTo(M + (W - 2 * M) * f, G.ry(r)); }
      g.stroke();
      // 七情, column by column into place
      ['七', '情'].forEach((ch, k) => { const steps = Math.min(4, Math.floor(K.ramp(b, 0.1 + k * 0.3, 0.6) * 5)), x = M - 8 + k * 2.3 * G.cw - (4 - steps) * G.cw;
        if (steps > 0) K.text(g, ch, x, G.ry(2.55), XY.font(206, PF, '600'), BLACK); });
      // the spring: ragged rules of steam over the blue block
      g.fillStyle = PAPER; for (let k = 0; k < 6; k++) { const y = G.ry(6.3) + 14 + k * 16, len = (G.cx(4) - M - 20) * (0.4 + 0.35 * Math.sin(k * 1.3 + t * 2.4)); g.fillRect(M + 10, y, len, 2.4); }
      g.strokeStyle = BLACK; g.lineWidth = 2; for (let k = 0; k < 4; k++) { const x = M + 30 + k * 60; g.beginPath(); for (let j = 0; j <= 8; j++) { const y = G.ry(6.3) - 4 - j * 8, xx = x + 6 * Math.sin(j * 0.9 - t * 5 + k); j ? g.lineTo(xx, y) : g.moveTo(xx, y); } g.stroke(); }
      // the web: woven rule by rule from the seven threads (verticals 2.0–2.7, horizontals 2.7–3.4); sags after the cut
      const web = G.cx(5), bot = G.ry(4.5);
      g.strokeStyle = BLACK; g.lineWidth = 1.2; g.beginPath();
      for (let i = 0; i <= 14; i++) { const f = XY.easeOut(K.ramp(b, 2 + i * 0.05, 0.3)); if (f <= 0) continue; const x = web + i * G.cw / 2; g.moveTo(x, M); g.lineTo(x, M + (bot - M) * f + sag * 40 * Math.sin(Math.PI * i / 14)); }
      for (let j = 0; j <= 9; j++) { const f = XY.easeOut(K.ramp(b, 2.7 + j * 0.07, 0.3)); if (f <= 0) continue; const y = M + j * G.rh / 2, d = sag * 40 * (j / 9);
        g.moveTo(web, y); for (let i = 1; i <= 14; i++) { const x = web + i * G.cw / 2 * f; g.lineTo(x, y + d * Math.sin(Math.PI * i / 14)); } }
      g.stroke();
      if (b > 3.4) { g.fillStyle = BLACK; g.fillRect(web, bot - 2 + sag * 40, (W - M - web), 5); }
      // a red step-pulse running through the woven web
      if (b > 3.4) { const d = Math.floor(b * 3) % 24; g.fillStyle = RED; for (let i = 0; i <= 14; i++) { const j = d - (14 - i); if (j < 0 || j > 9) continue; g.fillRect(web + i * G.cw / 2 - 4.5, M + j * G.rh / 2 - 4.5 + sag * 40 * (j / 9), 9, 9); } }
      // the seven spiders: let themselves down on threads, drop into one row, climb back after the cut
      const T = e.at('monk.head', acts), Cn = e.at('monk.chest', acts), down = XY.easeOut(K.ramp(b, 0.4, 1.2)), drop = XY.easeOut(K.ramp(b, DROP, 0.22)), back = XY.easeIO(K.ramp(b, CUT + 0.3, 1.2));
      const sp = [];
      for (let k = 0; k < 7; k++) { const x = G.cx(5 + k) + G.cw / 2, y0 = XY.lerp(M + 30, G.ry(ROW[k]), down), y1 = G.ry(4), over = 10 * Math.sin(Math.PI * K.ramp(b, DROP + 0.22, 0.25));
        const y = XY.lerp(XY.lerp(y0, y1, drop) + (drop >= 1 ? over : 0), G.ry(ROW[k]), back) + 6 * Math.sin(t * (2.1 + k * 0.37) + k * 1.7) * (1 - drop * (1 - back));
        sp.push([x, y]); g.strokeStyle = BLACK; g.lineWidth = 1.6; g.beginPath(); g.moveTo(x, M); g.lineTo(x, y - 54); g.stroke(); }
      // 3.6: seven threads fan into the monk; cut at 5, the halves spring apart
      const shot = XY.easeOut(K.ramp(b, SHOOT, 0.18)), cut = b >= CUT, snap = XY.easeOut(K.ramp(b, CUT, 0.3));
      if (shot > 0 && snap < 1) { g.strokeStyle = BLACK; g.lineWidth = 2.2; g.beginPath();
        sp.forEach(([x, y]) => { const tx = XY.lerp(x, T[0], shot), ty = XY.lerp(y + 34, T[1] - 4, shot);
          if (!cut) { g.moveTo(x, y + 34); g.lineTo(tx, ty); } else { const f = 1 - snap; g.moveTo(x, y + 34); g.lineTo(XY.lerp(x, tx, 0.5 * f), XY.lerp(y + 34, ty, 0.5 * f)); g.moveTo(XY.lerp(tx, x, 0.12), XY.lerp(ty, y, 0.12) + 60 * snap); g.lineTo(tx, ty + 60 * snap); } });
        g.stroke(); }
      if (K.visible(e)) { XY.drawProcession(g, e.phase, e.procX, e.groundY, HALO, acts); XY.drawProcession(g, e.phase, e.procX, e.groundY, PEN, acts); }
      // the red square closes on 唐僧 and silk wraps him, rule by rule
      const close = XY.easeOut(K.ramp(b, SHOOT + 0.08, 0.25)), cx = Cn[0] + 4, cy = Cn[1] - 18;
      if (close > 0 && !cut) { const s = XY.lerp(340, 168, close), n = Math.floor(K.ramp(b, SHOOT + 0.3, 1) * 16);
        g.save(); g.beginPath(); g.rect(cx - s / 2, cy - s / 2, s, s); g.clip();
        for (let k = 0; k < n; k++) { const y = cy - s / 2 + 8 + k * 10; g.fillStyle = 'rgba(243,241,235,0.6)'; g.fillRect(cx - s / 2, y, s, 1.8); g.fillStyle = BLACK; g.fillRect(cx - s / 2, y + 1.8, s, 1.4); }
        g.restore(); g.strokeStyle = RED; g.lineWidth = 8; g.strokeRect(cx - s / 2, cy - s / 2, s, s); }
      if (cut && b < CUT + 0.7) { const q = XY.easeOut((b - CUT) / 0.7), s = 168, d = 110 * q, h = s / 2; g.fillStyle = RED;
        if (q < 1) { g.fillRect(cx - h, cy - h - d - 4, s, 8); g.fillRect(cx - h, cy + h + d - 4, s, 8); g.fillRect(cx - h - d - 4, cy - h, 8, s); g.fillRect(cx + h + d - 4, cy - h, 8, s); } }
      // 悟空's cut: one red diagonal bar from his staff across the fan
      if (b > CUT - 0.12 && b < CUT + 0.3) { const se = e.at('wukong.staffEnd', acts), f = XY.easeOut((b - CUT + 0.12) / 0.12), x1 = T[0] - 80, y1 = T[1] - 200;
        g.strokeStyle = RED; g.lineWidth = 13; g.lineCap = 'butt'; g.beginPath(); g.moveTo(se[0], se[1]); g.lineTo(XY.lerp(se[0], x1, f), XY.lerp(se[1], y1, f)); g.stroke(); }
      sp.forEach(([x, y], k) => spider(g, x, y, k, t, 1 - drop * (1 - back) * 0.7));
    },
  };
})();
