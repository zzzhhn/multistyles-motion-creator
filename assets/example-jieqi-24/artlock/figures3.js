// 《二十四节气》film · the calf (born at 清明, grows all year) and the farm props, attached to the family's hands and the ox.
// JQ.calfParts(x, y, s, pose, g): g = growth 0 (newborn) … 1 (a young ox by 大寒); pose: stand|walk|lie|suckle; roles calf/calfDark/eye/horn.
// JQ.propParts(kind, a, opt) → parts; kinds documented below. Roles: prop (wood) metal (blade, iron) straw red line.
(function () {
  const JQ = window.JQ, { limb, circ, rot, place } = JQ._fig;
  // ---------------------------------------------------------------- calf (unit = ox length units, 300 px at s = 1)
  JQ.calfParts = (x, y, s = 1, pose = {}, g = 0) => {
    const k = pose.kind || 'stand', ph = pose.phase || 0, dir = pose.dir || 1, out = [];
    const lk = pose.lieK != null ? pose.lieK : (k === 'lie' ? 1 : 0), L = JQ.lerp(0.42, 0.78, g), legH = JQ.lerp(0.25, 0.24, g) * (1 - 0.65 * lk), bodyD = JQ.lerp(0.13, 0.25, g), hs = JQ.lerp(1.35, 1.0, g);
    const top = legH + bodyD, dy = 0;
    const legAt = (tx, off) => { const sw = k === 'walk' ? Math.sin(ph + off) * 0.04 : 0, lf = k === 'walk' ? Math.max(0, Math.cos(ph + off)) * 0.025 : 0; return [[tx, legH + 0.03], [tx + sw * 0.4, legH * 0.5 + lf], [tx + sw, lf]]; };
    const fx = L * 0.32, bx = -L * 0.38, lw = JQ.lerp(0.045, 0.06, g);
    const addLeg = (P) => { if (lk >= 0.999) return; out.push({ role: 'calf', pts: limb(P, lw, lw * 0.7) }); out.push({ role: 'calfDark', sharp: true, pts: limb([[P[2][0], P[2][1] + 0.022], [P[2][0], P[2][1]]], lw * 0.8, lw * 0.8) }); };
    addLeg(legAt(fx - 0.05, Math.PI)); addLeg(legAt(bx - 0.04, 0));
    out.push({ role: 'calfDark', pts: limb([[bx - 0.06, top - 0.02], [bx - 0.1, top - 0.1], [bx - 0.1, top - 0.17]], 0.014, 0.01) });
    out.push({ role: 'calf', pts: [[fx + 0.02, top], [0, top + 0.01], [bx, top - 0.005], [bx - 0.06, top - 0.06], [bx - 0.05, legH + 0.02], [0, legH - 0.005], [fx + 0.04, legH + 0.02], [fx + 0.07, top - 0.06]] });
    addLeg(legAt(fx, 0)); addLeg(legAt(bx, Math.PI));
    const nod = k === 'suckle' ? -0.9 : k === 'walk' ? Math.sin(ph * 2) * 0.06 : 0, pv = [fx + 0.05, top - 0.01];
    const H = pts => rot(pts.map(([u, v]) => [pv[0] + (u - pv[0]) * hs, pv[1] + (v - pv[1]) * hs]), pv[0], pv[1], nod);
    out.push({ role: 'calf', pts: H([[fx + 0.03, top + 0.03], [fx + 0.12, top + 0.05], [fx + 0.2, top - 0.02], [fx + 0.22, top - 0.08], [fx + 0.17, top - 0.1], [fx + 0.06, top - 0.04]]) });
    out.push({ role: 'calfDark', pts: H([[fx + 0.19, top - 0.03], [fx + 0.225, top - 0.07], [fx + 0.2, top - 0.1], [fx + 0.17, top - 0.09]]) });
    out.push({ role: 'calf', pts: H([[fx + 0.09, top + 0.03], [fx + 0.02, top + 0.06], [fx + 0.0, top + 0.035], [fx + 0.06, top + 0.02]]) });
    if (g > 0.45) { const hl = (g - 0.45) * 0.09; out.push({ role: 'horn', pts: H(limb([[fx + 0.12, top + 0.045], [fx + 0.115, top + 0.045 + hl]], 0.02, 0.007)) }); }
    out.push({ role: 'eye', pts: H(circ(fx + 0.15, top - 0.005, 0.011, 8)) });
    return place(out, x, y + dy, 300 * s, dir);
  };
  // ---------------------------------------------------------------- the ox's harness points (world): yoke on the withers, rump
  JQ.oxAnchors = (x, y, s = 1, dir = 1) => ({ yoke: [x + 0.31 * 300 * s * dir, y - 0.585 * 300 * s], rump: [x - 0.47 * 300 * s * dir, y - 0.36 * 300 * s], ground: y, unit: 300 * s, dir, nose: [x + 0.62 * 300 * s * dir, y - 0.32 * 300 * s] });

  // ---------------------------------------------------------------- props. a = anchor object (hands, ox anchors, …); opt = { phase, s, n }
  const L = (pts, w0, w1, role) => ({ role, pts: limb(pts, w0, w1), sharp: true });
  const toParts = list => list.map(p => ({ role: p.role, pts: p.pts, path: p.sharp ? JQ.P(p.pts) : JQ.smoothPath(p.pts) }));
  const along = (p, q, k) => [p[0] + (q[0] - p[0]) * k, p[1] + (q[1] - p[1]) * k];
  JQ.propParts = (kind, a, opt = {}) => {
    const s = opt.s || 1, f = opt.phase || 0, out = [];
    const h = a.hand, h2 = a.hand2 || a.hand, d = a.dir || 1;
    if (kind === 'plow') {                                          // 犁: traces from the yoke, beam to the share in the soil, handle in her hands
      const Y = a.yoke, share = [a.rump[0] - 40 * s * d, a.ground - 4 * s], beamF = [a.rump[0] - 8 * s * d, a.ground - 70 * s];
      out.push(L([Y, beamF], 2.5 * s, 2.5 * s, 'line'));
      out.push(L([beamF, [share[0] + 20 * s * d, share[1] - 40 * s], share], 7 * s, 6 * s, 'prop'));
      out.push(L([share, [share[0] - 20 * s * d, share[1] - 30 * s], h], 6 * s, 5 * s, 'prop'));
      out.push({ role: 'metal', sharp: true, pts: [[share[0] - 6 * s * d, share[1] - 6 * s], [share[0] + 22 * s * d, share[1] + 2 * s], [share[0] - 4 * s * d, share[1] + 6 * s]] });
      out.push(L([[Y[0] - 22 * s * d, Y[1] + 6 * s], [Y[0], Y[1] - 10 * s], [Y[0] + 22 * s * d, Y[1] + 6 * s]], 7 * s, 7 * s, 'prop'));
    } else if (kind === 'yoke') {
      const Y = a.yoke; out.push(L([[Y[0] - 22 * s * d, Y[1] + 6 * s], [Y[0], Y[1] - 10 * s], [Y[0] + 22 * s * d, Y[1] + 6 * s]], 7 * s, 7 * s, 'prop'));
    } else if (kind === 'rope') {                                   // lead rope from the ox's nose to a hand
      out.push(L([a.nose, along(a.nose, h, 0.5).map((v, i) => v + (i ? 18 * s : 0)), h], 2 * s, 2 * s, 'line'));
    } else if (kind === 'hoe') {
      const dx = h[0] - h2[0], dy = h[1] - h2[1], dl = Math.hypot(dx, dy) || 1, ux = dx / dl, uy = dy / dl, e = [h[0] + ux * 70 * s, h[1] + uy * 70 * s];
      out.push(L([[h2[0] - ux * 40 * s, h2[1] - uy * 40 * s], e], 5 * s, 5 * s, 'prop'));
      out.push({ role: 'metal', sharp: true, pts: [e, [e[0] + uy * 26 * s * d, e[1] - ux * 26 * s * d + 20 * s], [e[0] + 12 * s * d, e[1] + 26 * s]] });
    } else if (kind === 'sickle') {
      out.push(L([h, [h[0] + 22 * s * d, h[1] + 6 * s]], 4 * s, 4 * s, 'prop'));
      const c = [h[0] + 34 * s * d, h[1] + 4 * s]; out.push({ role: 'metal', pts: limb(Array.from({ length: 7 }, (_, i) => { const t = -0.3 + i / 6 * 2.4; return [c[0] + Math.cos(t) * 20 * s * d, c[1] + Math.sin(t) * 20 * s]; }), 5 * s, 1.5 * s) });
    } else if (kind === 'basket') {
      const c = [h2[0], h2[1] + 16 * s], r = 26 * s; out.push({ role: 'straw', pts: [[c[0] - r, c[1] - 6 * s], [c[0] + r, c[1] - 6 * s], [c[0] + r * 0.8, c[1] + r * 0.8], [c[0] - r * 0.8, c[1] + r * 0.8]] });
      out.push(L([[c[0] - r * 0.7, c[1] - 6 * s], [c[0], c[1] - r * 1.1], [c[0] + r * 0.7, c[1] - 6 * s]], 3 * s, 3 * s, 'prop'));
    } else if (kind === 'pole') {                                   // 扁担 and two buckets of water
      const sh = a.shoulder, len = 110 * s, b0 = [sh[0] - len * d, sh[1] + 4 * s], b1 = [sh[0] + len * d, sh[1] + 4 * s], sw = Math.sin(f * 2) * 4 * s;
      out.push(L([b0, [sh[0], sh[1] - 6 * s], b1], 5 * s, 5 * s, 'prop'));
      [b0, b1].forEach((p, i) => { const q = [p[0] + (i ? sw : -sw), p[1] + 70 * s]; out.push(L([p, q], 1.6 * s, 1.6 * s, 'line')); out.push({ role: 'prop', sharp: true, pts: [[q[0] - 20 * s, q[1]], [q[0] + 20 * s, q[1]], [q[0] + 16 * s, q[1] + 36 * s], [q[0] - 16 * s, q[1] + 36 * s]] }); });
    } else if (kind === 'flail') {                                  // 连枷: handle plus a swinging bat
      const e = [h[0] + (h[0] - h2[0]) * 2.4, h[1] + (h[1] - h2[1]) * 2.4]; out.push(L([h2, e], 5 * s, 5 * s, 'prop'));
      const sw = 0.6 + 1.2 * (0.5 - 0.5 * Math.cos(f)); out.push(L([e, [e[0] + Math.cos(sw) * 50 * s * d, e[1] + Math.sin(sw) * 50 * s]], 9 * s, 8 * s, 'prop'));
    } else if (kind === 'broom') {
      const e = [h2[0] + (h2[0] - h[0]) * -2.2 + 30 * s * d, a.ground != null ? a.ground : h2[1] + 120 * s]; out.push(L([[h2[0] - (e[0] - h2[0]) * 0.2, h2[1] - 20 * s], e], 4 * s, 4 * s, 'prop'));
      out.push({ role: 'straw', sharp: true, pts: [[e[0] - 6 * s, e[1] - 30 * s], [e[0] + 30 * s * d, e[1] + 2 * s], [e[0] - 30 * s * d, e[1] + 2 * s]] });
    } else if (kind === 'fan') {                                    // 蒲扇
      out.push(L([h, [h[0] + 6 * s * d, h[1] - 14 * s]], 3 * s, 3 * s, 'prop')); out.push({ role: 'straw', pts: circ(h[0] + 10 * s * d, h[1] - 34 * s, 22 * s, 16) });
    } else if (kind === 'bowl') {
      out.push({ role: 'red', sharp: true, pts: [[h[0] - 16 * s, h[1] - 6 * s], [h[0] + 16 * s, h[1] - 6 * s], [h[0] + 10 * s, h[1] + 8 * s], [h[0] - 10 * s, h[1] + 8 * s]] });
    } else if (kind === 'whip') {                                   // a willow twig for 打春 (tapping the spring ox)
      const sw = Math.sin(f * 3) * 0.4; out.push(L([h, [h[0] + Math.cos(-0.6 + sw) * 70 * s * d, h[1] + Math.sin(-0.6 + sw) * 70 * s]], 2.2 * s, 1 * s, 'prop'));
    } else if (kind === 'ribbon') {                                 // red cloth on the ox's horn
      const p = a.horn; out.push({ role: 'red', pts: [[p[0] - 6 * s, p[1]], [p[0] + 8 * s, p[1] - 4 * s], [p[0] + 4 * s, p[1] + 26 * s], [p[0] - 8 * s, p[1] + 22 * s]] });
      out.push({ role: 'red', pts: circ(p[0], p[1], 9 * s, 10) });
    } else if (kind === 'kite') {                                   // 燕子风筝 at a.kite, string to the hand
      const k = a.kite; out.push(L([h, [(h[0] + k[0]) / 2, (h[1] + k[1]) / 2 + 40], k], 1.2, 1.2, 'line'));
      out.push({ role: 'red', sharp: true, pts: [[k[0], k[1] - 24], [k[0] + 46, k[1] + 4], [k[0] + 12, k[1] + 6], [k[0] + 30, k[1] + 40], [k[0], k[1] + 14], [k[0] - 30, k[1] + 40], [k[0] - 12, k[1] + 6], [k[0] - 46, k[1] + 4]] });
    } else if (kind === 'roller') {                                 // 碌碡: a stone roller dragged behind the ox on the threshing floor
      const R = a.rump, c = [R[0] - 70 * s * d, a.ground - 26 * s]; out.push(L([a.yoke, [R[0], R[1] + 30 * s], c], 2.5 * s, 2.5 * s, 'line'));
      out.push({ role: 'metal', pts: circ(c[0], c[1], 26 * s, 18).map(([u, v]) => [c[0] + (u - c[0]) * 1.7, v]) });
      out.push(L([[c[0] - 44 * s, c[1]], [c[0] + 44 * s, c[1]]], 4 * s, 4 * s, 'prop'));
    } else if (kind === 'sheaf') {                                  // a bundle of wheat / millet at a.at
      const p = a.at; out.push({ role: 'straw', sharp: true, pts: [[p[0] - 16 * s, p[1]], [p[0] - 6 * s, p[1] - 30 * s], [p[0] - 18 * s, p[1] - 62 * s], [p[0] + 18 * s, p[1] - 62 * s], [p[0] + 6 * s, p[1] - 30 * s], [p[0] + 16 * s, p[1]]] });
      out.push(L([[p[0] - 8 * s, p[1] - 30 * s], [p[0] + 8 * s, p[1] - 30 * s]], 3 * s, 3 * s, 'prop'));
    } else if (kind === 'stack') {                                  // 草垛 haystack, grows with opt.k
      const p = a.at, k = opt.k == null ? 1 : opt.k, w = 120 * s, hh = 150 * s * k; out.push({ role: 'straw', pts: [[p[0] - w, p[1]], [p[0] - w * 0.8, p[1] - hh * 0.6], [p[0] - w * 0.3, p[1] - hh], [p[0] + w * 0.3, p[1] - hh], [p[0] + w * 0.8, p[1] - hh * 0.6], [p[0] + w, p[1]]] });
    } else if (kind === 'couplets') {                               // 春联 on the gate posts and the 横批, pasted progressively (opt.k)
      const k = opt.k == null ? 1 : opt.k, g = JQ.L.house; const strip = (x0, k1) => [[x0, g.gateTop + 30], [x0 + 18, g.gateTop + 30], [x0 + 18, g.gateTop + 30 + 100 * k1], [x0, g.gateTop + 30 + 100 * k1]];
      if (k > 0) out.push({ role: 'red', sharp: true, pts: strip(g.gateX0 - 26, JQ.clamp(k * 3)) });
      if (k > 0.33) out.push({ role: 'red', sharp: true, pts: strip(g.gateX1 + 8, JQ.clamp(k * 3 - 1)) });
      if (k > 0.66) { const w = JQ.clamp(k * 3 - 2); out.push({ role: 'red', sharp: true, pts: [[g.gateX0 - 10, g.gateTop + 6], [g.gateX0 - 10 + (g.gateX1 - g.gateX0 + 20) * w, g.gateTop + 6], [g.gateX0 - 10 + (g.gateX1 - g.gateX0 + 20) * w, g.gateTop + 22], [g.gateX0 - 10, g.gateTop + 22]] }); }
    } else if (kind === 'lanterns') {
      const g = JQ.L.house, k = opt.k == null ? 1 : opt.k; [g.gateX0 - 20, g.gateX1 + 20].forEach(x0 => { if (k <= 0) return; out.push(L([[x0, g.gateTop - 6], [x0, g.gateTop + 8]], 1.5, 1.5, 'line')); out.push({ role: 'red', pts: circ(x0, g.gateTop + 26, 16 * k, 14).map(([u, v]) => [u, g.gateTop + 26 + (v - g.gateTop - 26) * 1.15]) }); });
    }
    return toParts(out);
  };
})();
