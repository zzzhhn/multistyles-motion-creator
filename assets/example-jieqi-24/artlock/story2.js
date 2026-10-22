// 《二十四节气》film · story runtime part 2: build the parts for the family, the ox, the calf and their props.
(function () {
  const JQ = window.JQ, TERM = 8;
  const OXP = { horn: [0.455, 0.665], nose: [0.645, 0.3], back0: [0.28, 0.56], back1: [-0.38, 0.54] };
  // a point on the ox in world space, following its head pose (graze lowers the head, lie lowers the body)
  const oxPoint = (o, key) => {
    let [u, v] = OXP[key]; const head = key === 'horn' || key === 'nose';
    if (o.pose === 'lie') v -= 0.17;
    if (head && o.pose === 'graze') { const px = 0.38, py = 0.45 + (o.pose === 'lie' ? -0.17 : 0), a = -0.65; [u, v] = [px + (u - px) * Math.cos(a) - (v - py) * Math.sin(a), py + (u - px) * Math.sin(a) + (v - py) * Math.cos(a)]; }
    return [o.x + u * 300 * o.s * o.dir, o.y - v * 300 * o.s];
  };
  const actorParts = (who, a, n) => {
    if (who === 'ox') return JQ.oxParts(a.x, a.y, a.s, { kind: a.pose === 'walk' || a.pose === 'stand' || a.pose === 'graze' || a.pose === 'lie' ? a.pose : 'stand', phase: a.phase, dir: a.dir, lieK: a.lieK });
    if (who === 'calf') return JQ.calfParts(a.x, a.y, a.s, { kind: a.pose, phase: a.phase, dir: a.dir, lieK: a.lieK }, a.g);
    return JQ.personParts(a.x, a.y, a.s, { build: who === 'kid' ? 'child' : 'adult', pose: a.pose, phase: a.phase, dir: a.dir, blend: a.blend, outfit: a.outfit });
  };
  const rect = (pts, role) => ({ role, pts, path: JQ.P(pts) });
  // props that need more than a hand: sheaves left behind the reaper, seeds in flight, a stool, the ox's straw mat, hay
  const special = (kind, st, A, J, lt) => {
    const w = st.woman, out = [];
    if (kind === 'sheaves' && w) {
      const r9 = st.term === 9 || st.term === 10, rows = r9 ? [[950, 642], [890, 643], [830, 644]] : [[460, 666], [505, 665], [545, 664]];
      // 芒种 reaps leftward and leaves sheaves behind her; 夏至 keeps the ones she stood up; 处暑 reaps rightward
      rows.forEach(([x, y]) => { if (st.term === 10 || (r9 ? w.x < x - 25 : w.x > x + 25)) out.push(...JQ.propParts('sheaf', { at: [x, y] }, { s: JQ.STORY_S(y) })); });
    } else if (kind === 'seeds') {
      const who = J.kid && st.term === 16 ? 'kid' : 'woman', h = (J[who] || {}).hand, a = st[who]; if (!h || !a) return out;
      for (let i = 0; i < 12; i++) { const p = ((st.T * 1.5 + i / 12) % 1), x = h[0] + a.dir * 70 * a.s * p, y = h[1] + 140 * a.s * p * p; out.push({ role: 'straw', pts: [[x - 2, y - 2], [x + 2, y - 2], [x + 2, y + 2], [x - 2, y + 2]], path: JQ.P([[x - 2.5, y - 2.5], [x + 2.5, y - 2.5], [x + 2.5, y + 2.5], [x - 2.5, y + 2.5]]) }); }
    } else if (kind === 'stool' && w) {
      const s = w.s, x = w.x - 6 * s * w.dir, y = w.y; out.push(rect([[x - 34 * s, y - 64 * s], [x + 34 * s, y - 64 * s], [x + 34 * s, y - 54 * s], [x - 34 * s, y - 54 * s]], 'prop'));
      [-26, 22].forEach(d => out.push(rect([[x + d * s, y - 54 * s], [x + (d + 6) * s, y - 54 * s], [x + (d + 6) * s, y], [x + d * s, y]], 'prop')));
    } else if (kind === 'mat' && st.ox) {
      const b0 = oxPoint(st.ox, 'back0'), b1 = oxPoint(st.ox, 'back1'), s = st.ox.s, d = 46 * s;
      out.push({ role: 'straw', pts: [[b0[0], b0[1] - 6 * s], [b1[0], b1[1] - 6 * s], [b1[0], b1[1] + d], [b0[0], b0[1] + d]], path: JQ.smoothPath([[b0[0], b0[1] - 6 * s], [b1[0], b1[1] - 6 * s], [b1[0] - 4 * s * st.ox.dir, b1[1] + d], [b0[0] + 4 * s * st.ox.dir, b0[1] + d]]) });
    } else if (kind === 'hay' && J.kid) out.push(...JQ.propParts('sheaf', { at: [J.kid.hand[0], J.kid.hand[1] + 20 * st.kid.s] }, { s: 0.55 * st.kid.s }));
    return out;
  };
  JQ.cast = (n, lt) => {
    const st = JQ.storyState(n, lt), items = [], J = {}, A = {};
    for (const who of ['woman', 'kid', 'ox', 'calf']) {
      const a = st[who]; if (!a) continue;
      if (who === 'woman' || who === 'kid') a.outfit = (JQ.storyOutfit || (() => ({})))(n, who);
      const parts = actorParts(who, a, n); J[who] = parts.joints || {}; A[who] = a;
      items.push({ who, kind: 'actor', parts, y: a.y, alpha: a.alpha });
    }
    const [term, t] = JQ._storyLocate(n, lt);
    for (const [kind, who, t0, t1] of (JQ.STORY_PROPS[term] || [])) {
      if (t < t0 || t >= t1) continue;
      let parts = null, y = (A[who] || {}).y || 1000;
      if (['sheaves', 'seeds', 'stool', 'mat', 'hay'].includes(kind)) { parts = special(kind, st, A, J, t); y = kind === 'stool' ? y - 0.2 : kind === 'sheaves' ? 600 : y + 0.1; }
      else if (kind === 'plow' && st.ox && J.woman) { parts = JQ.propParts('plow', Object.assign(JQ.oxAnchors(st.ox.x, st.ox.y, st.ox.s, st.ox.dir), { hand: J.woman.hand }), { s: st.ox.s }); y = (st.ox.y + st.woman.y) / 2 - 0.3; }
      else if (kind === 'rope' && st.ox && J[who]) { parts = JQ.propParts('rope', { nose: oxPoint(st.ox, 'nose'), hand: J[who].hand, dir: st.ox.dir }, { s: st.ox.s }); y = Math.max(st.ox.y, A[who].y) + 0.2; }
      else if (kind === 'ribbon' && st.ox) { parts = JQ.propParts('ribbon', { horn: oxPoint(st.ox, 'horn') }, { s: st.ox.s }); y = st.ox.y + 0.1; }
      else if (kind === 'roller' && st.ox) {                       // the stone roller trails along the ox's own path, so it never jumps sides
        const o = st.ox, want = 230 * o.s; let b = o;
        for (let k = 1; k <= 40; k++) { const p = JQ.storyState(n, lt - k * 0.08).ox; if (!p) break; b = p; if (Math.hypot(p.x - o.x, p.y - o.y) >= want) break; }
        const s = o.s, c = [b.x, b.y - 26 * s], Y = JQ.oxAnchors(o.x, o.y, s, o.dir).yoke, { limb, circ } = JQ._fig;
        const P = (pts, role) => ({ role, pts, path: JQ.P(pts) });
        parts = [P(limb([Y, c], 2.5 * s, 2.5 * s), 'line'), P(circ(c[0], c[1], 26 * s, 18).map(([u, v]) => [c[0] + (u - c[0]) * 1.7, v]), 'metal'),
          P(limb([[c[0] - 44 * s, c[1]], [c[0] + 44 * s, c[1]]], 4 * s, 4 * s), 'prop')];
        y = Math.min(o.y, b.y) - 0.2;
      }
      else if (kind === 'kite' && J[who]) { const T = st.T; parts = JQ.propParts('kite', { hand: J[who].hand, kite: [860 + 30 * Math.sin(T * 0.9), 210 + 16 * Math.sin(T * 1.3)] }); y = A[who].y + 0.1; }
      else if (kind === 'stack') { const k = term === 17 ? JQ.clamp((t - 2.67) / 5) * 0.8 + 0.2 : 1; parts = JQ.propParts('stack', { at: [120, 1008] }, { s: 0.9, k }); y = 1007; }
      else if (kind === 'couplets') { parts = JQ.propParts('couplets', {}, { k: term === 24 ? JQ.clamp((t - 0.5) / 4.5) : 1 }); y = 800; }
      else if (kind === 'lanterns') { parts = JQ.propParts('lanterns', {}, { k: term === 24 ? JQ.clamp((t - 5.333) / 1.0) : 1 }); y = 800; }
      else if (J[who]) { parts = JQ.propParts(kind, Object.assign({ dir: A[who].dir, ground: A[who].y }, J[who]), { s: A[who].s, phase: A[who].phase }); y = A[who].y + 0.1; }
      if (parts && parts.length) items.push({ who, kind, parts, y });
    }
    items.sort((p, q) => p.y - q.y);
    return { items, state: st };
  };
  // styles call JQ.castFor(Sx, t): it uses the engine's true local time (Sx.lt) so a growing-in or covered-up style places
  // the family exactly where the other style does, and the family is cut cleanly by the seam instead of doubled
  JQ.castFor = (Sx, t) => JQ.cast(Sx.n, Sx && Sx.lt != null ? Sx.lt : t);
  JQ.drawCastFor = (g, Sx, t, pen, filter) => JQ.drawCast(g, Sx.n, Sx && Sx.lt != null ? Sx.lt : t, pen, filter);
  // the default renderer: every part through the style's pen (with role fallbacks)
  JQ.drawCast = (g, n, lt, pen, filter) => { for (const it of JQ.cast(n, lt).items) { if (filter && !filter(it)) continue; g.save(); if (it.alpha != null && it.alpha < 1) g.globalAlpha *= it.alpha; JQ.drawParts(g, it.parts, pen); g.restore(); } };
})();
