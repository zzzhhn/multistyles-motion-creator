// 《二十四节气》Art Lock · the cast: a 放牛娃 (cowherd child) and a 黄牛 (yellow ox).
// JQ.kidParts / JQ.oxParts return [{ role, pts, path }] (back to front) so a style can fill each part its own way.
// JQ.kid / JQ.ox draw them with a simple pen. Roles: skin hair coat pants ox oxDark horn eye hat.
(function () {
  const JQ = window.JQ;
  // smooth closed Path2D through points (quadratic through midpoints)
  JQ.smoothPath = (pts, closed = true) => {
    const p = new Path2D(), n = pts.length, mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
    if (!closed) { p.moveTo(...pts[0]); for (let i = 1; i < n - 1; i++) { const m = mid(pts[i], pts[i + 1]); p.quadraticCurveTo(pts[i][0], pts[i][1], m[0], m[1]); } p.lineTo(...pts[n - 1]); return p; }
    const m0 = mid(pts[n - 1], pts[0]); p.moveTo(...m0);
    for (let i = 0; i < n; i++) { const m = mid(pts[i], pts[(i + 1) % n]); p.quadraticCurveTo(pts[i][0], pts[i][1], m[0], m[1]); }
    p.closePath(); return p;
  };
  // a limb polyline → tapered polygon
  const limb = (pts, w0, w1) => {
    const L = [], R = [], n = pts.length;
    pts.forEach((q, i) => { const a = pts[Math.max(0, i - 1)], b = pts[Math.min(n - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], d = Math.hypot(dx, dy) || 1, w = JQ.lerp(w0, w1, i / (n - 1)) / 2; L.push([q[0] - dy / d * w, q[1] + dx / d * w]); R.push([q[0] + dy / d * w, q[1] - dx / d * w]); });
    return [...L, ...R.reverse()];
  };
  const circ = (cx, cy, r, n = 20) => Array.from({ length: n }, (_, i) => [cx + Math.cos(i / n * 6.2832) * r, cy + Math.sin(i / n * 6.2832) * r]);
  const rot = (pts, px, py, a) => pts.map(([x, y]) => [px + (x - px) * Math.cos(a) - (y - py) * Math.sin(a), py + (x - px) * Math.sin(a) + (y - py) * Math.cos(a)]);
  const place = (parts, x, y, unit, dir) => parts.map(p => { const pts = p.pts.map(([u, v]) => [x + u * unit * dir, y - v * unit]); return { role: p.role, pts, path: p.sharp ? JQ.P(pts) : JQ.smoothPath(pts) }; });

  // ---------------------------------------------------------------- kid (unit = height 170 px at s = 1)
  // pose: { kind: stand|walk|run|reach|sit|squat|ride, phase, dir, hat }
  JQ.kidParts = (x, y, s = 1, pose = {}) => {
    const k = pose.kind || 'stand', ph = pose.phase || 0, dir = pose.dir || 1, out = [];
    let hip = [0, 0.45], lean = 0, legs, arms;
    const sw = (k === 'walk' ? 0.12 : k === 'run' ? 0.2 : 0) * Math.sin(ph), lift = (k === 'run' ? 0.08 : 0.035) * Math.max(0, Math.cos(ph));
    if (k === 'sit') { hip = [0, 0.25]; legs = [[[-0.02, 0.25], [0.14, 0.26], [0.16, 0.0]], [[0.03, 0.25], [0.19, 0.25], [0.21, 0.0]]]; }
    else if (k === 'squat') { hip = [-0.03, 0.2]; lean = 0.1; legs = [[[-0.05, 0.2], [0.09, 0.3], [0.04, 0.0]], [[0.0, 0.2], [0.14, 0.28], [0.1, 0.0]]]; }
    else if (k === 'ride') { hip = [0, 0.02]; legs = [[[0.0, 0.02], [0.1, -0.06], [0.08, -0.26]], [[0.03, 0.02], [0.13, -0.05], [0.11, -0.25]]]; }
    else { if (k === 'run') lean = 0.08; legs = [[[-0.03, 0.45], [-0.03 - sw * 0.4, 0.23 + lift], [-sw - 0.02, lift]], [[0.03, 0.45], [0.03 + sw * 0.4, 0.23], [sw + 0.02, 0]]]; }
    const top = [hip[0] + lean * 0.6, hip[1] + 0.22], head = [top[0] + 0.03 + lean * 0.3, top[1] + 0.165];
    const asw = (k === 'walk' || k === 'run') ? Math.sin(ph) * 0.1 : 0;
    arms = k === 'reach' ? [[[top[0] - 0.04, top[1] - 0.01], [top[0] - 0.07, top[1] - 0.12], [top[0] - 0.05, top[1] - 0.21]], [[top[0] + 0.05, top[1] - 0.01], [top[0] + 0.14, top[1] + 0.07], [top[0] + 0.22, top[1] + 0.18]]]
      : k === 'squat' ? [[[top[0] - 0.03, top[1] - 0.01], [top[0] + 0.04, top[1] - 0.12], [top[0] + 0.13, top[1] - 0.16]], [[top[0] + 0.05, top[1] - 0.01], [top[0] + 0.12, top[1] - 0.11], [top[0] + 0.2, top[1] - 0.13]]]
      : [[[top[0] - 0.04, top[1] - 0.01], [top[0] - 0.07 - asw, top[1] - 0.11], [top[0] - 0.06 - asw * 1.4, top[1] - 0.2]], [[top[0] + 0.05, top[1] - 0.01], [top[0] + 0.09 + asw, top[1] - 0.11], [top[0] + 0.1 + asw * 1.4, top[1] - 0.2]]];
    const leg = (L, back) => { out.push({ role: 'pants', pts: limb([L[0], L[1], [JQ.lerp(L[1][0], L[2][0], 0.55), JQ.lerp(L[1][1], L[2][1], 0.55)]], 0.11, 0.092) }); out.push({ role: 'skin', pts: limb([[JQ.lerp(L[1][0], L[2][0], 0.5), JQ.lerp(L[1][1], L[2][1], 0.5)], L[2]], 0.062, 0.055) }); out.push({ role: 'skin', pts: circ(L[2][0] + 0.024, L[2][1] + 0.012, 0.034, 10) }); };
    const arm = A => { out.push({ role: 'coat', pts: limb([A[0], A[1], [JQ.lerp(A[1][0], A[2][0], 0.5), JQ.lerp(A[1][1], A[2][1], 0.5)]], 0.088, 0.076) }); out.push({ role: 'skin', pts: limb([[JQ.lerp(A[1][0], A[2][0], 0.45), JQ.lerp(A[1][1], A[2][1], 0.45)], A[2]], 0.056, 0.05) }); out.push({ role: 'skin', pts: circ(A[2][0], A[2][1], 0.034, 10) }); };
    arm(arms[0]); leg(legs[0], true);
    out.push({ role: 'coat', pts: [[top[0] - 0.105, top[1] + 0.015], [top[0] + 0.115, top[1] + 0.015], [hip[0] + 0.15, hip[1] - 0.06], [hip[0] - 0.14, hip[1] - 0.06]], sharp: false });
    leg(legs[1], false); arm(arms[1]);
    out.push({ role: 'skin', pts: circ(head[0], head[1], 0.13, 24) });
    if (pose.hat) out.push({ role: 'hat', pts: [[head[0] - 0.2, head[1] + 0.05], [head[0], head[1] + 0.19], [head[0] + 0.2, head[1] + 0.05], [head[0], head[1] + 0.075]], sharp: true });
    else {
      out.push({ role: 'hair', pts: [...circ(head[0] - 0.006, head[1] + 0.012, 0.134, 24).filter(([u, v]) => v > head[1] + 0.025 || u < head[0] - 0.08)] });
      out.push({ role: 'hair', pts: circ(head[0] - 0.085, head[1] + 0.12, 0.052, 12) }); out.push({ role: 'hair', pts: circ(head[0] + 0.05, head[1] + 0.138, 0.052, 12) });
    }
    out.push({ role: 'eye', pts: circ(head[0] + 0.07, head[1] - 0.004, 0.015, 8) });
    return place(out, x, y, 190 * s, dir);
  };
  JQ.kidHead = (x, y, s = 1, pose = {}) => { const ps = JQ.kidParts(x, y, s, pose); return ps.find(p => p.role === 'skin' && p.pts.length === 24).pts.reduce((a, q) => [a[0] + q[0] / 24, a[1] + q[1] / 24], [0, 0]); };

  // ---------------------------------------------------------------- ox (unit = body length 300 px at s = 1)
  // pose: { kind: stand|walk|graze|lie, phase, dir }
  JQ.oxParts = (x, y, s = 1, pose = {}) => {
    const k = pose.kind || 'stand', ph = pose.phase || 0, dir = pose.dir || 1, out = [], lk = pose.lieK != null ? pose.lieK : (k === 'lie' ? 1 : 0), dy = -0.17 * lk;
    const sh = pts => pts.map(([u, v]) => [u, v + dy]);
    const legAt = (tx, ty, off) => { const sw = k === 'walk' ? Math.sin(ph + off) * 0.05 : 0, lf = k === 'walk' ? Math.max(0, Math.cos(ph + off)) * 0.03 : 0; return [[tx, ty], [tx + sw * 0.4 + (tx < 0 ? -0.03 : 0.005), 0.12 + lf], [tx + sw, lf]]; };
    const legs = [legAt(0.19, 0.27, Math.PI), legAt(-0.4, 0.31, 0), legAt(0.255, 0.27, 0), legAt(-0.33, 0.31, Math.PI)]
      .map(L => lk > 0 ? [[L[0][0], L[0][1] + dy], [L[1][0] + 0.06 * lk, L[1][1] * (1 - lk)], L[2]] : L);   // getting up: legs unfold
    const addLeg = L => { if (lk >= 0.999) return; out.push({ role: 'ox', pts: limb(L, 0.082, 0.05) }); out.push({ role: 'oxDark', pts: limb([[L[2][0], L[2][1] + 0.03], [L[2][0] + 0.004, L[2][1]]], 0.054, 0.054), sharp: true }); };
    addLeg(legs[0]); addLeg(legs[1]);
    out.push({ role: 'oxDark', pts: sh(limb([[-0.48, 0.48], [-0.53, 0.34], [-0.52, 0.17]], 0.02, 0.013)) });
    out.push({ role: 'oxDark', pts: sh(circ(-0.519, 0.155, 0.026, 10)) });
    out.push({ role: 'ox', pts: sh([[0.3, 0.535], [0.23, 0.575], [0.05, 0.535], [-0.15, 0.525], [-0.33, 0.545], [-0.445, 0.505], [-0.495, 0.4], [-0.475, 0.28], [-0.38, 0.19], [-0.15, 0.158], [0.1, 0.163], [0.26, 0.19], [0.34, 0.25], [0.375, 0.335], [0.405, 0.44], [0.37, 0.525]]) });
    if (lk > 0.6) out.push({ role: 'ox', pts: sh([[0.12, 0.2], [0.3, 0.18], [0.36, 0.15], [0.12, 0.15]]) }), out.push({ role: 'ox', pts: sh([[-0.42, 0.22], [-0.2, 0.17], [-0.16, 0.15], [-0.44, 0.16]]) });
    addLeg(legs[2]); addLeg(legs[3]);
    const g = k === 'graze' ? -0.65 : 0, pv = [0.38, 0.45 + dy], R = pts => rot(sh(pts), pv[0], pv[1], g);
    out.push({ role: 'ox', pts: R([[0.35, 0.525], [0.47, 0.555], [0.595, 0.47], [0.655, 0.35], [0.645, 0.265], [0.56, 0.26], [0.45, 0.34], [0.37, 0.41]]) });
    out.push({ role: 'oxDark', pts: R([[0.615, 0.35], [0.656, 0.352], [0.646, 0.265], [0.585, 0.262]]) });
    out.push({ role: 'horn', pts: R(limb([[0.455, 0.545], [0.415, 0.605], [0.455, 0.665]], 0.03, 0.009)) });
    out.push({ role: 'horn', pts: R(limb([[0.515, 0.54], [0.555, 0.605], [0.525, 0.67]], 0.03, 0.009)) });
    out.push({ role: 'ox', pts: R([[0.455, 0.505], [0.39, 0.525], [0.355, 0.5], [0.4, 0.485]]) });
    out.push({ role: 'eye', pts: R(circ(0.532, 0.458, 0.011, 8)) });
    return place(out, x, y, 300 * s, dir);
  };

  // ---------------------------------------------------------------- default pen renderer
  JQ.PEN = { skin: '#E8B58C', hair: '#1F1A17', coat: '#3B6EA5', pants: '#2E2A27', ox: '#B57E46', oxDark: '#4A3020', horn: '#EADFC4', eye: '#141010', hat: '#C9A45C', line: '#1C1612', lw: 2.5, outline: true };
  // new roles from figures2.js fall back to roles every style already colours (apron→pants, scarf→hat, prop→oxDark …)
  JQ.ROLE_FALLBACK = { apron: 'pants', scarf: 'hat', prop: 'oxDark', metal: 'line', red: 'coat', straw: 'hat', calf: 'ox', calfDark: 'oxDark', cape: 'hat', sleeve: 'coat' };
  JQ.roleColor = (pen, role) => { let r = role; for (let i = 0; i < 4 && r; i++) { if (pen[r] != null) return pen[r]; r = JQ.ROLE_FALLBACK[r]; } return null; };
  JQ.drawParts = (g, parts, pen = JQ.PEN) => {
    for (const p of parts) {
      const c = JQ.roleColor(pen, p.role); if (c == null) continue;
      g.fillStyle = c; g.fill(p.path);
      if (pen.outline && p.role !== 'eye') { g.strokeStyle = pen.line; g.lineWidth = pen.lw; g.lineJoin = 'round'; g.stroke(p.path); }
    }
  };
  JQ.kid = (g, x, y, s, pose, pen) => JQ.drawParts(g, JQ.kidParts(x, y, s, pose), pen);
  JQ.ox = (g, x, y, s, pose, pen) => JQ.drawParts(g, JQ.oxParts(x, y, s, pose), pen);
  JQ._fig = { limb, circ, rot, place };                            // shared geometry for figures2.js (the family, calf, props)
})();
