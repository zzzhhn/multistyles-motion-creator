// 《二十四节气》film · story runtime. JQ.cast(n, lt) → { items: [{ who, kind, parts, y }] sorted back to front, state }.
// The family's position and pose depend only on film time; a style only decides HOW to paint them. Outfits follow the
// style's own term n, so clothes change exactly where the new season's picture grows over the old one.
// JQ.drawCast(g, n, lt, pen) draws the default way; styles with their own technique iterate cast.items and paint parts by role.
(function () {
  const JQ = window.JQ, TERM = 8, BEAT = 2 / 3;
  JQ.STORY_S = y => JQ.lerp(0.7, 1.0, JQ.clamp((y - 620) / 390));               // perspective scale from the ground line
  const P = JQ.POSES;
  P.tote = f => ({ lean: 0.06, legs: P.walk(f).legs, arms: [[0.25, 1.7], [0.35 * Math.sin(f), 0.3]] });
  P.tie = f => ({ lean: 0.08, legs: [[0.08, 0.06], [-0.06, 0.03]], arms: [[1.2, 0.5], [1.45 + 0.08 * Math.sin(f * 3), 0.15]] });
  const MOVE = { walk: 1, run: 1, plow: 1, lead: 1, sow: 1, carry: 1, tote: 1, sweep: 1 };
  const RATE = { hoe: Math.PI / BEAT, cut: Math.PI / BEAT, flail: Math.PI / BEAT, fan: 1, wave: 1, reach: 1, tie: 1, sweep: 2.4 };
  // ---------------------------------------------------------------- key interpolation
  const memo = {};
  const track = (term, who) => {
    const id = term + who; if (memo[id]) return memo[id];
    const ks = ((JQ.STORY_KEYS[term] || {})[who]) || null; if (!ks) return (memo[id] = null);
    const cum = [0]; for (let i = 1; i < ks.length; i++) cum.push(cum[i - 1] + Math.hypot(ks[i][1] - ks[i - 1][1], ks[i][2] - ks[i - 1][2]));
    return (memo[id] = { ks, cum });
  };
  const sample = (term, who, lt) => {
    const tr = track(term, who); if (!tr) return null;
    const { ks, cum } = tr; let i = 0; while (i < ks.length - 1 && lt >= ks[i + 1][0]) i++;
    const a = ks[i], b = ks[Math.min(i + 1, ks.length - 1)], span = b[0] - a[0], k = span > 0 ? JQ.clamp((lt - a[0]) / span) : 0;
    const x = JQ.lerp(a[1], b[1], k), y = JQ.lerp(a[2], b[2], k), dist = cum[i] + k * (cum[Math.min(i + 1, ks.length - 1)] - cum[i]);
    let dir = a[4];
    if (!dir) { const dx = b[1] - a[1]; dir = Math.abs(dx) > 0.5 ? Math.sign(dx) : 0; for (let j = i; !dir && j > 0; j--) { const d2 = ks[j][1] - ks[j - 1][1]; if (Math.abs(d2) > 0.5) dir = Math.sign(d2); } dir = dir || 1; }
    const alpha = JQ.lerp((a[5] && a[5].a != null) ? a[5].a : 1, (b[5] && b[5].a != null) ? b[5].a : 1, k);
    let pose = a[3], blend = null;
    if (b !== a && b[3] !== a[3] && lt > b[0] - 0.3 && b[3] !== 'gone') { blend = { pose: a[3], k: (lt - (b[0] - 0.3)) / 0.3 }; pose = b[3]; }
    let lieK = null;                                               // the ox and the calf lie down / get up over the last 0.6 s
    if ((who === 'ox' || who === 'calf') && b !== a && (a[3] === 'lie') !== (b[3] === 'lie')) {
      const w0 = Math.max(a[0], b[0] - 0.6); if (lt > w0) { const k = JQ.clamp((lt - w0) / Math.max(1e-3, b[0] - w0)); lieK = a[3] === 'lie' ? 1 - k : k; pose = a[3] === 'lie' ? b[3] : a[3]; blend = null; }
    }
    return { x, y, dir, pose, blend, dist, alpha, lieK, s: JQ.STORY_S(y) };
  };
  // which term's keys describe style n at local time lt (outgoing styles run past 8 s into the next term)
  const locate = (n, lt) => lt >= TERM ? (n < 24 ? [n + 1, lt - TERM] : (JQ.FILM && JQ.FILM.LOOP ? [1, lt - TERM] : [24, TERM])) : lt < 0 ? (n > 1 ? [n - 1, lt + TERM] : [1, 0]) : [n, lt];
  const outfit = (n, who) => {
    const sp = n <= 6, su = n >= 7 && n <= 12, au = n >= 13 && n <= 18, wi = n >= 19;
    if (who === 'woman') return n === 2 ? { hat: 'straw', coat: 'cape' } : wi ? { hat: 'hood', coat: 'padded' } : su ? { hat: [7, 8, 9, 11].includes(n) ? 'straw' : 'none', sleeves: 'short', apron: true } : { hat: 'scarf', apron: true };
    return n === 2 ? { hat: 'straw', coat: 'cape' } : wi ? { hat: 'cap', coat: 'padded' } : su ? { sleeves: 'short' } : {};
  };
  JQ.storyState = (n, lt) => {
    const [term, t] = locate(n, lt), T = (term - 1) * TERM + t, st = { n, term, t, T };
    for (const who of ['woman', 'kid', 'ox', 'calf']) {
      if (who === 'calf' && n < 5) continue;                       // the calf is born with 清明's picture, never before it
      // an outgoing style (lt > 8) keeps an actor in its own last pose when the next term starts it in a different one:
      // the new pose then arrives with the new picture instead of popping in both
      let a = sample(term, who, t);
      if (lt >= TERM && term !== n) { const own = sample(n, who, TERM); if (own && a && own.pose !== a.pose && !MOVE[a.pose]) a = own; }
      if (!a || a.pose === 'gone' || a.alpha <= 0.01) continue;
      const stride = (who === 'ox' ? 300 * 0.25 : who === 'calf' ? 300 * 0.16 : (who === 'kid' ? 165 : 240) * 0.5) * a.s;
      a.phase = MOVE[a.pose] || who === 'ox' || who === 'calf' ? a.dist / stride * Math.PI + (RATE[a.pose] ? T * RATE[a.pose] : 0) : T * (RATE[a.pose] || 1);
      st[who] = a;
    }
    if (st.calf) st.calf.g = JQ.clamp(((term - 5) * TERM + t) / (20 * TERM));
    return st;
  };
  JQ._storyLocate = locate; JQ.storyOutfit = outfit;
})();
