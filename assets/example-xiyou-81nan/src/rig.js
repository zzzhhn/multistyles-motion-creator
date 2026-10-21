// rig.js — the pilgrims as a real rig. Legs are 2-bone IK chains whose feet are planted on the ground: the stance
// phase is locked to the distance walked (XY.walkPhase), so feet never slide however the camera eases. Arms are FK
// or IK to the props they hold. Tail, ears, mane, bundles, ribbons and hems lag the gait (spring-like phase delay).
// Shapes are role-tagged primitives built on the joints; a style never redraws a character, it supplies a pen.
// API  XY.procParts(w, acts) → [{ name, x, y, parts, bones, anchors }]   procession-local: feet on y = 0, facing +x
//      XY.drawProcession(ctx, w, ox, oy, pen, acts)    XY.anchor('monk.head', w, acts) → [x, y] procession-local
//      w = walk phase in cycles (XY.walkPhase(t)); acts = { wukong:{shade,raise,strike}, monk:{palm}, bajie:{scratch}, shaseng:{lift} } ∈ [0,1]
(() => {
  'use strict';
  const XY = window.XY, TAU = XY.TAU, E = XY.ellipse, { sin, cos, PI, hypot, atan2 } = Math;
  const clamp = XY.clamp, lerp = XY.lerp, frac = x => x - Math.floor(x);
  const P = (role, pts) => ({ k: 'poly', role, pts });
  const Ln = (role, pts, w, closed) => ({ k: 'line', role, pts, w, closed });
  const D = (role, x, y, r) => ({ k: 'dot', role, x, y, r });
  const add = (p, q) => [p[0] + q[0], p[1] + q[1]];
  const rot = (x, y, a) => [x * cos(a) - y * sin(a), x * sin(a) + y * cos(a)];
  const polar = (p, a, l) => [p[0] + cos(a) * l, p[1] + sin(a) * l];      // screen angle: 0 = +x, π/2 = down
  const mix = (p, q, u) => [lerp(p[0], q[0], u), lerp(p[1], q[1], u)];
  const flat = ps => ps.reduce((o, p) => (o.push(p[0], p[1]), o), []);

  // ------------------------------------------------------------ shape builders
  const capsule = (a, b, r1, r2, n = 7) => {
    const t = atan2(b[1] - a[1], b[0] - a[0]), o = [];
    for (let k = 0; k <= n; k++) { const q = t + PI / 2 + k / n * PI; o.push(a[0] + cos(q) * r1, a[1] + sin(q) * r1); }
    for (let k = 0; k <= n; k++) { const q = t - PI / 2 + k / n * PI; o.push(b[0] + cos(q) * r2, b[1] + sin(q) * r2); }
    return o;
  };
  const spline = (pts, closed = true, n = 5) => {          // Catmull-Rom through a flat point list
    const m = pts.length / 2, o = [], at = i => { i = closed ? ((i % m) + m) % m : clamp(i, 0, m - 1); return [pts[2 * i], pts[2 * i + 1]]; };
    for (let i = 0; i < (closed ? m : m - 1); i++) {
      const p0 = at(i - 1), p1 = at(i), p2 = at(i + 1), p3 = at(i + 2);
      for (let k = 0; k < n; k++) { const t = k / n, t2 = t * t, t3 = t2 * t;
        for (let d = 0; d < 2; d++) o.push(0.5 * (2 * p1[d] + (p2[d] - p0[d]) * t + (2 * p0[d] - 5 * p1[d] + 4 * p2[d] - p3[d]) * t2 + (3 * p1[d] - p0[d] - 3 * p2[d] + p3[d]) * t3)); }
    }
    if (!closed) o.push(pts[pts.length - 2], pts[pts.length - 1]);
    return o;
  };
  const local = (O, a, pts) => { const o = []; for (let k = 0; k < pts.length; k += 2) { const r = rot(pts[k], pts[k + 1], a); o.push(O[0] + r[0], O[1] + r[1]); } return o; };
  const blob = (O, a, pts, n = 5) => spline(local(O, a, pts), true, n);

  // ------------------------------------------------------------ kinematics
  const ik2 = (h, f, l1, l2, bend) => {      // bend +1: joint toward +x when the chain points down
    let dx = f[0] - h[0], dy = f[1] - h[1], d = hypot(dx, dy); const dm = l1 + l2 - 0.05;
    if (d > dm) { dx *= dm / d; dy *= dm / d; d = dm; f = [h[0] + dx, h[1] + dy]; }
    const a = Math.acos(clamp((l1 * l1 + d * d - l2 * l2) / (2 * l1 * Math.max(d, 1e-3)), -1, 1)), th = atan2(dy, dx) - bend * a;
    return [[h[0] + cos(th) * l1, h[1] + sin(th) * l1], f];
  };
  // foot offset from the hip for cycle phase q: stance moves back at exactly the walking speed (planted), swing arcs forward
  const gait = (q, Ls, beta, lift) => {
    if (q < beta) return [Ls * beta * (0.5 - q / beta), 0, 0];
    const s = (q - beta) / (1 - beta), e = s * s * (3 - 2 * s);
    return [Ls * beta * (e - 0.5), -lift * sin(PI * s), -0.45 * sin(PI * s) + 0.25 * sin(TAU * s)];
  };
  const leg = (hip, q, o) => {
    const [dx, dy, ta] = gait(q, o.Ls, o.beta, o.lift), [knee, ank] = ik2(hip, [hip[0] + dx, dy - o.ah], o.l1, o.l2, o.bend);
    return { hip, knee, ank, toe: polar(ank, ta, o.foot), q };
  };
  const armIK = (S, H, l1, l2) => { const [el, h] = ik2(S, H, l1, l2, -1); return { S, E: el, H: h }; };
  const armFK = (S, a1, a2, l1, l2) => { const el = [S[0] + sin(a1) * l1, S[1] + cos(a1) * l1], a = a1 + a2; return { S, E: el, H: [el[0] + sin(a) * l2, el[1] + cos(a) * l2] }; };
  const chain = (O, a0, n, len, bendFn) => { const o = [O]; let a = a0, p = O; for (let k = 0; k < n; k++) { a += bendFn(k); p = polar(p, a, len); o.push(p); } return o; };
  XY.RIG = { capsule, spline, blob, ik2, gait, leg, armIK, armFK, chain, polar, rot, add, mix, flat, local };
  XY.RIG.ribbon = (...a) => ribbon(...a);

  // common skins
  const limb = (B, role, a, b, r1, r2) => B.push(P(role, capsule(a, b, r1, r2)));
  const shoe = (B, role, L, h = 6) => { const a = L.ank, t = L.toe, d = atan2(t[1] - a[1], t[0] - a[0]);
    B.push(P(role, spline(flat([polar(a, d + PI * 0.75, h), polar(a, d - PI * 0.55, h * 0.9), polar(t, d - PI * 0.4, h * 0.55), polar(t, d + 0.2, h * 0.45), polar(t, d + PI * 0.55, h * 0.4), polar(a, d + PI * 0.45, h * 0.9)]), true, 3))); };
  const hand = (B, role, A, r = 4.4) => B.push(P(role, E(A.H[0], A.H[1], r, r * 0.92, 12)));
  const bonesOf = (...ls) => ls.map(l => flat(l));
  // tapered strip along a polyline (tails, ears, ribbons, mane strands, hems)
  const ribbon = (pts, w0, w1) => {
    const n = pts.length / 2, Lp = [], Rp = [];
    for (let i = 0; i < n; i++) {
      const a = Math.max(0, i - 1), b = Math.min(n - 1, i + 1), dx = pts[2 * b] - pts[2 * a], dy = pts[2 * b + 1] - pts[2 * a + 1], d = hypot(dx, dy) || 1;
      const w = lerp(w0, w1, i / Math.max(1, n - 1)) / 2, nx = -dy / d * w, ny = dx / d * w;
      Lp.push([pts[2 * i] + nx, pts[2 * i + 1] + ny]); Rp.push([pts[2 * i] - nx, pts[2 * i + 1] - ny]);
    }
    return flat(Lp.concat(Rp.reverse()));
  };
  const S_ = XY.LAYOUT.STRIDE;

  // ------------------------------------------------------------ speed-aware gait
  // The gallery camera averages ~470 design px/s with a slow mid-panel and a dash across each seam. A fixed stride
  // would scissor the legs at 4+ steps/s, so stride grows with speed (∝ √v above the natural pace v0) and the walk
  // blends into a run (shorter stance, higher lift). Plant points come from a precomputed distance→phase table:
  // each stance foot is fixed at the hip's world x at mid-stance, so feet stay planted while stride changes.
  // The table is a pure function of the timeline (built once), so frames stay deterministic.
  const GT = { DX: 1, n: 0, v: null };
  const speedAt = d => { if (!GT.v) return XY.RIG_SPEED || 150; const i = clamp(d / GT.DX, 0, GT.n - 1), k = Math.floor(i), f = i - k; return lerp(GT.v[k], GT.v[Math.min(GT.n - 1, k + 1)], f); };
  const buildSpeed = () => {
    if (GT.v || !XY.CELLS || !XY.CELLS.length || XY.RIG_SPEED) return;
    const T = XY.DURATION, dt = 1 / 240, x0 = XY.procWorldX(0), Dm = XY.procWorldX(T) - x0 + 400, n = Math.ceil(Dm / GT.DX) + 1, v = new Float32Array(n);
    let prev = 0, j = 0;
    for (let t = dt; t <= T + dt; t += dt) { const d = XY.procWorldX(t) - x0, sp = (d - prev) / dt; for (; j <= Math.min(n - 1, d / GT.DX); j++) v[j] = sp; prev = d; }
    for (; j < n; j++) v[j] = 0;
    for (let k = 1; k < n - 1; k++) v[k] = Math.max(v[k], 0);
    GT.v = v; GT.n = n;
  };
  const gaitCache = new Map(); let memoKey = null, memo = null;
  // per figure: phase φ(d) = ∫ dd / Ls(v), with Ls = Ls0·clamp(√(v/v0), 1, 2.3)
  const gaitFor = (name, Ls0, v0) => {
    buildSpeed();
    const key = name + ':' + (GT.v ? 'film' : 'const' + (XY.RIG_SPEED || 150));
    if (gaitCache.has(key)) return gaitCache.get(key);
    const n = GT.v ? GT.n : 40000, phi = new Float64Array(n);
    for (let k = 1; k < n; k++) { const v = speedAt(k * GT.DX), Ls = Ls0 * clamp(Math.sqrt(Math.max(v, 1) / v0), 1, 2.3); phi[k] = phi[k - 1] + GT.DX / Ls; }
    const g = { phi, n, Ls0, v0,
      at: d => { const i = clamp(d / GT.DX, 0, n - 1), k = Math.floor(i); return k >= n - 1 ? phi[n - 1] + (d - (n - 1) * GT.DX) / Ls0 : lerp(phi[k], phi[k + 1], i - k); },
      dist: f => { let lo = 0, hi = n - 1; if (f >= phi[hi]) return hi * GT.DX + (f - phi[hi]) * Ls0; while (hi - lo > 1) { const m = (lo + hi) >> 1; if (phi[m] < f) lo = m; else hi = m; }
        return (lo + (f - phi[lo]) / Math.max(1e-9, phi[hi] - phi[lo])) * GT.DX; } };
    gaitCache.set(key, g); return g;
  };
  XY.RIG_RESET = () => { GT.v = null; GT.n = 0; gaitCache.clear(); memoKey = null; };
  XY.RIG_SPEED_TABLE = v => { GT.v = v; GT.n = v.length; gaitCache.clear(); memoKey = null; };   // speed (px/s) per 1 px of distance
  // gait context for one figure at distance d: phase, speed ratio, run blend, and a planted-foot solver
  const runOf = r => XY.smooth((r - 1.7) / 1.6);
  const gctx = (name, d, Ls0, v0, ph) => {
    const g = gaitFor(name, Ls0, v0), v = speedAt(d), r = v / v0, run = runOf(r), phi = g.at(d) + ph;
    return { phi, r, run, sp: clamp(r, 0, 1.6),
      foot(off, lift) {            // → [dx, dy, toeAngle] of the foot relative to the hip for leg phase offset off
        const betaAt = k => lerp(0.6, 0.36, runOf(speedAt(g.dist(k - off - ph)) / v0));
        const f = phi + off, q = frac(f), ftd = f - q, beta = betaAt(ftd), plant = k => g.dist(k + betaAt(k) / 2 - off - ph) - d;
        const L = lift * (1 + 1.3 * run) * clamp(r * 1.5, 0.15, 1);
        if (q < beta) return [plant(ftd), 0, 0];
        const s = (q - beta) / (1 - beta), e = s * s * (3 - 2 * s);
        return [lerp(plant(ftd), plant(ftd + 1), e), -L * sin(PI * s), -0.45 * sin(PI * s) + 0.25 * sin(TAU * s)];
      } };
  };
  const legG = (G, off, hip, o) => { const [dx, dy, ta] = G.foot(off, o.lift), [knee, ank] = ik2(hip, [o.hx + dx, dy - o.ah], o.l1, o.l2, o.bend);
    return { hip, knee, ank, toe: polar(ank, ta, o.foot) }; };
  const blink = (c, seed) => { const u = frac(c * 0.37 + seed); return u < 0.035 ? 0.15 : 1; };   // eyelid openness

  // ============================================================ 孙悟空 — crouched monkey gait, staff on the shoulder, curling tail
  function wukong(G, A) {
    const B = [], an = {}, sh = XY.smooth(A.shade || 0), ra = XY.smooth(A.raise || 0), st = XY.smooth(A.strike || 0), c = G.phi, amp = 0.35 + 0.65 * Math.min(1, G.sp);
    const O = { lift: 13, l1: 35, l2: 35, ah: 5, foot: 15, bend: 1 };
    const bob = 2.6 * amp * (1 + 0.9 * G.run) * cos(TAU * 2 * (c - 0.29)), H = [0, -63 + 7 * G.run - bob], lean = 0.22 + 0.16 * G.run + 0.03 * sin(TAU * 2 * c - 0.6) - 0.1 * ra;
    const C = add(H, rot(0, -40, lean)), Nk = add(C, rot(1, -7, lean * 0.7)), hA = -0.06 * sin(TAU * 2 * c - 1.1) + 0.12 * sh;
    const Hd = add(Nk, rot(9, -16, hA)), S = add(C, rot(2, 5, lean));
    const far = legG(G, 0.5, add(H, [-3, 0]), { ...O, hx: -3 }), near = legG(G, 0, add(H, [3, 0]), { ...O, hx: 3 });
    // far arm: free swing, or up to the brow (手搭凉棚)
    const swing = armFK(add(S, [-3, 0]), 0.42 * amp * (1 + 0.7 * G.run) * sin(TAU * c), 0.55 + 0.6 * G.run + 0.25 * sin(TAU * c + 0.4), 22, 21);
    const brow = add(Hd, rot(18, -9, hA)), fa = sh > 0 ? armIK(add(S, [-3, 0]), mix(swing.H, brow, sh), 22, 21) : swing;
    // near arm and the staff: on the shoulder → raised overhead → thrust forward
    const gripW = add(S, rot(15, 12, lean)), gripR = add(S, [12, -39]), gripS = add(S, [36, 2]);
    let grip = mix(mix(gripW, gripR, ra), gripS, st), dir;
    { const rest = atan2(S[1] - 8 - gripW[1], S[0] - gripW[0]), dR = PI + 0.05 * sin(TAU * c), dS = PI + 0.02; dir = lerp(lerp(rest, dR, ra), dS, st); }
    const na = armIK(S, grip, 22, 21); grip = na.H;   // the staff goes through the hand the arm actually reached
    const s0 = polar(grip, dir + PI, 34 + 30 * st), s1 = polar(grip, dir, 112 - 22 * st);
    // tail: S-curve that curls up, travelling wave
    const tail = chain(add(H, rot(-12, 0, lean)), PI - 0.55, 8, 8.6, k => 0.3 + 0.16 * sin(TAU * c - k * 0.62));
    // ---- skin, back to front
    B.push(P('fur', capsule(fa.S, fa.E, 5, 4)), P('fur', capsule(fa.E, fa.H, 4, 3.4)), P('face', E(fa.H[0], fa.H[1], 4.6, 4, 10)));
    B.push(P('fur', capsule(far.hip, far.knee, 7, 5.2)), P('fur', capsule(far.knee, far.ank, 5.2, 3.8)));
    B.push(P('face', spline(flat([add(far.ank, [-4, -3]), add(far.ank, [3, -4]), far.toe, add(far.toe, [1, 3]), add(far.ank, [-5, 3])]), true, 3)));
    B.push(P('fur', ribbon(flat(tail), 6, 2.6)), D('fur', tail[8][0], tail[8][1], 3));
    B.push(P('wkshirt', blob(H, lean, [-15, 2, -16, -16, -12, -34, 0, -43, 12, -38, 17, -18, 15, 2])));
    B.push({ ...P('wkshirt', blob(H, lean, [-3, -38, 10, -36, 16, -18, 6, -10])), shade: 0.16 });
    B.push(Ln('gold', local(H, lean, [-16, -2, 0, 0, 15, -3]), 3.4));
    const hem = k => 2.2 * sin(TAU * 2 * c - 1 - k * 0.5), skirt = [-16, -3];
    [-14, -9, -4, 1, 6, 11, 16].forEach((x, k) => skirt.push(x - 2.5, 18 + (k % 2 ? 4 : 0) + hem(k), x, 24 + hem(k)));
    skirt.push(17, -4);
    B.push(P('tiger', local(H, lean * 0.4, skirt)));
    [-10, -3, 4, 11].forEach((x, k) => B.push({ ...Ln('stripe', local(H, lean * 0.4, [x, 1, x + 1.5, 9, x - 0.5, 16]), 2.2), fine: true }));
    B.push(P('fur', capsule(near.hip, near.knee, 7, 5.2)), P('fur', capsule(near.knee, near.ank, 5.2, 3.8)));
    { const sd = atan2(near.ank[1] - near.knee[1], near.ank[0] - near.knee[0]), wp = polar(near.ank, sd + PI, 8); B.push(Ln('red', [...polar(wp, sd + PI / 2, 5), ...polar(wp, sd - PI / 2, 5)], 3.4)); }
    B.push(P('face', spline(flat([add(near.ank, [-4, -3]), add(near.ank, [3, -4]), near.toe, add(near.toe, [1, 3]), add(near.ank, [-5, 3])]), true, 3)));
    // head: round skull, heart-shaped face mask, ear, brow ridge, golden fillet (金箍)
    B.push(P('fur', E(Hd[0], Hd[1], 19, 18.5, 22)));
    B.push(P('fur', local(Hd, hA, [-17, -6, -24, -2, -18, 3])), P('fur', local(Hd, hA, [-14, 9, -20, 15, -12, 13])));
    B.push(P('face', blob(Hd, hA, [-2, -12, 6, -15, 13, -12, 19, -4, 21, 6, 16, 14, 7, 16, 0, 9, -2, 0])));
    B.push(P('face', E(...add(Hd, rot(-7, 1, hA)), 5.6, 6.6, 12)), P('fur', E(...add(Hd, rot(-7, 1.5, hA)), 2.8, 3.6, 10)));
    const ey = add(Hd, rot(11, -4, hA)), op = blink(c, 0.13);
    B.push(P('ink', E(ey[0], ey[1], 2.7, 3.2 * op, 10)), { ...Ln('ink', local(Hd, hA, [5, -10, 11, -12, 17, -9]), 2), fine: true });
    B.push({ ...Ln('ink', local(Hd, hA, [12, 9, 16, 11, 20, 8]), 1.6), fine: true }, D('ink', ...add(Hd, rot(20, 2, hA)), 1.2));
    B.push(Ln('gold', local(Hd, hA, [-18, -6, -9, -14, 3, -17, 14, -14]), 5), P('gold', E(...add(Hd, rot(14, -14, hA)), 3, 3, 8)));
    // staff (如意金箍棒) and the near arm over it
    B.push({ ...P('staff', capsule(s0, s1, 3.6, 3.6, 4)), prop: 'staff' }, { ...P('gold', capsule(s0, polar(s0, dir, 11), 4.4, 4.4, 4)), prop: 'staff' }, { ...P('gold', capsule(polar(s1, dir + PI, 11), s1, 4.4, 4.4, 4)), prop: 'staff' });
    B.push(P('wkshirt', capsule(na.S, na.E, 5.6, 4.4)), P('fur', capsule(na.E, na.H, 4.2, 3.5)), P('face', E(na.H[0], na.H[1], 4.8, 4.2, 10)));
    an.head = Hd; an.hand = na.H; an.handFar = fa.H; an.staffTip = s1; an.staffEnd = s0; an.chest = C; an.feet = [near.toe, far.toe];
    return { parts: B, anchors: an, bones: bonesOf([far.hip, far.knee, far.ank, far.toe], [near.hip, near.knee, near.ank, near.toe], [H, C, Nk, Hd], [fa.S, fa.E, fa.H], [na.S, na.E, na.H], tail) };
  }

  // ============================================================ 白龙马 + 唐僧 — four-beat walk (LH LF RH RF), nodding head,
  // swishing tail and mane; the monk rides the back's double bump with a little lag, 锡杖 rings jingle
  function monkOnHorse(G, A) {
    const B = [], an = {}, palm = XY.smooth(A.palm || 0), c = G.phi, amp = 0.35 + 0.65 * Math.min(1, G.sp);
    const bob = 1.8 * amp * (1 + 1.4 * G.run) * cos(TAU * 2 * (c - 0.08)), pitch = (0.018 + 0.03 * G.run) * sin(TAU * 2 * c - 0.5), Bc = [0, -98 + 6 * G.run - bob];
    const legSet = [['nh', 0, [-40, 8], 46, 44, -1, 11], ['nf', 0.25, [40, 12], 44, 44, 1, 15], ['fh', 0.5, [-46, 8], 46, 44, -1, 11], ['ff', 0.75, [34, 12], 44, 44, 1, 15]];
    const L = {};
    legSet.forEach(([k, off, j, l1, l2, bend, lift]) => {
      const J = add(Bc, rot(j[0], j[1], pitch)), [dx, dy] = G.foot(off, lift), sw = clamp(-dy / Math.max(1, lift * (1 + 1.3 * G.run)), 0, 1);
      const [kn, an_] = ik2(J, [j[0] + dx, dy - 9], l1, l2, bend), pa = PI / 2 - 0.55 + (bend > 0 ? 1.1 : 0.6) * sw, hoof = polar(an_, pa, 10);
      L[k] = { J, kn, an: an_, hoof, pa, far: k[0] === 'f' };
    });
    const legDraw = l => { const r = l.far ? 'horse2' : 'horse';
      B.push(P(r, capsule(l.J, l.kn, 11, 6.5)), P(r, capsule(l.kn, l.an, 5.2, 4.4)), P(r, capsule(l.an, l.hoof, 4.6, 4)));
      B.push(P('hoof', local(l.hoof, l.pa - PI / 2, [-6, -3, 6, -3, 7, 4, -7, 4]))); };
    ['fh', 'ff', 'nh', 'nf'].forEach(k => legDraw(L[k]));
    // tail (swish) and body
    const tail = chain(add(Bc, rot(-64, -12, pitch)), PI * 0.66, 7, 9.5, k => -0.07 + 0.14 * sin(TAU * c - k * 0.55));
    B.push(P('mane', ribbon(flat(tail), 11, 4)));
    B.push(P('horse', blob(Bc, pitch, [62, -2, 55, -20, 36, -27, 10, -24, -20, -26, -44, -29, -60, -19, -67, -1, -59, 15, -36, 21, 0, 21, 30, 19, 53, 13])));
    B.push({ ...P('horse', blob(Bc, pitch, [-58, 4, -40, 16, 0, 18, 30, 16, 48, 10, 20, 9, -20, 9])), shade: 0.12 });
    // neck + head with the nod
    const nod = 0.06 * sin(TAU * 2 * c - 1.0), N0 = add(Bc, rot(44, -12, pitch)), th = -1.02 + nod, Hj = polar(N0, th, 48), tH = th + 1.32;
    const nPerp = th - PI / 2, crest = add(mix(N0, Hj, 0.5), rot(-11, -8, th)), throat = add(mix(N0, Hj, 0.55), rot(10, 9, th));
    B.push(P('horse', spline(flat([add(Bc, rot(22, -27, pitch)), crest, polar(Hj, nPerp, 10), polar(polar(Hj, th, 6), nPerp + PI, 11), throat, add(Bc, rot(64, -2, pitch)), add(Bc, rot(46, 4, pitch))]), true, 5)));
    B.push(P('horse', blob(Hj, tH, [-8, -10, 10, -11, 28, -8, 37, -3, 39, 5, 31, 10, 10, 10, -7, 8])));
    B.push(P('horse', local(Hj, tH, [-5, -8, -9, -21, 1, -10])), P('horse2', local(Hj, tH, [2, -9, 1, -20, 7, -10])));
    const eye = add(Hj, rot(9, -3, tH)), op = blink(c, 0.61);
    B.push(P('ink', E(eye[0], eye[1], 2.3, 2.6 * op, 10)), D('ink', ...add(Hj, rot(34, 2, tH)), 1.6), { ...Ln('ink', local(Hj, tH, [26, 8, 36, 7]), 1.4), fine: true });
    // mane: one flowing lock along the crest, its lower edge waving with the gait
    { const top = [], bot = [], wB = add(Bc, rot(24, -26, pitch)), poll = polar(Hj, nPerp, 9);
      for (let k = 0; k <= 8; k++) { const u = k / 8, p = u < 0.5 ? mix(wB, crest, u * 2) : mix(crest, poll, u * 2 - 1), wv = 3 * sin(TAU * c * 2 - k * 0.9) + 2 * sin(k * 2.1);
        top.push(polar(p, nPerp, 2.5)); bot.push(polar(p, th + PI * 0.8, 11 + 3 * sin(u * PI) + wv)); }
      B.push(P('mane', spline(flat(top.concat(bot.reverse())), true, 3)));
      for (let k = 1; k < 8; k += 2) B.push({ ...Ln('horse2', [...mix(top[k], bot[8 - k], 0.15), ...mix(top[k], bot[8 - k], 0.85)], 1.2), fine: true }); }
    // tack: bridle, breast collar with tassels, saddle cloth, saddle
    B.push(Ln('red', local(Hj, tH, [0, -8, 5, 8, 24, 9, 30, -4]), 1.5), Ln('red', local(Hj, tH, [5, 8, 13, -9]), 1.5), D('gold', ...add(Hj, rot(30, 5, tH)), 1.8));
    const bit = add(Hj, rot(30, 6, tH));
    B.push(Ln('red', local(Bc, pitch, [60, -10, 46, 4, 28, 10]), 1.8));
    for (let k = 0; k < 3; k++) { const tp = add(Bc, rot(55 - k * 13, -5 + k * 6, pitch)), sw = 1.5 * sin(TAU * 2 * c - 1.2 - k * 0.6);
      B.push({ ...Ln('red', [tp[0], tp[1], tp[0] + sw, tp[1] + 6], 1.2), fine: true }, P('red', local([tp[0] + sw, tp[1] + 6], 0, [0, 0, 2.6, 2, 1.6, 8, -1.6, 8, -2.6, 2]))); }
    B.push(P('red', blob(Bc, pitch, [-36, -28, 14, -27, 20, -2, -4, 4, -40, -2])), Ln('gold', local(Bc, pitch, [-40, -2, -4, 4, 20, -2]), 2.2));
    B.push(P('saddle', blob(Bc, pitch, [-30, -30, -8, -27, 10, -30, 12, -20, -28, -18])));
    const riderFrom = B.length;   // everything below is the rider (cast.rider === false leaves the horse saddled but empty)
    // ---- the monk
    const seat = add(Bc, rot(-10, -30, pitch)), Mp = add(seat, [0, -3 + 1.2 * sin(TAU * 2 * c - 1.3)]), ml = -0.03 + 0.022 * sin(TAU * 2 * c - 1.5);
    const Mc = add(Mp, rot(0, -40, ml)), Mh = add(Mc, rot(2, -21, ml)), Sh = add(Mc, rot(3, 4, ml));
    const knee = add(Mp, [22, 13]), foot = add(knee, [-3, 30]);
    B.push(P('robe', capsule(Mp, knee, 12, 9)), P('robe', spline(flat([add(knee, [-9, -6]), add(knee, [9, -2]), add(foot, [8, -4]), add(foot, [-9, -2])]), true, 3)));
    B.push(P('ink', local(foot, 0, [-6, -3, 9, -3, 11, 2, -7, 3])), Ln('gold', [foot[0] - 6, foot[1] + 4, foot[0] + 8, foot[1] + 4], 2.2), { ...Ln('ink', [foot[0], foot[1] + 4, seat[0] + 2, seat[1] + 18], 1.4), fine: true });
    // far arm: reins, or the single raised palm (单掌立于胸前)
    const reinH = add(Mc, rot(20, 16, ml)), palmH = add(Mc, rot(15, -2, ml)), fa = armIK(add(Sh, [-4, 0]), mix(reinH, palmH, palm), 17, 16);
    B.push(P('robe', capsule(fa.S, fa.E, 6, 5)), P('robe', capsule(fa.E, fa.H, 5, 4.5)), P('skin', E(fa.H[0], fa.H[1], 3.6, 4 + 2.5 * palm, 10)));
    B.push({ ...Ln('red', spline([fa.H[0], fa.H[1], lerp(fa.H[0], bit[0], 0.5), lerp(fa.H[1], bit[1], 0.5) + 9 * (1 - palm) + 1.5 * sin(TAU * 2 * c), bit[0], bit[1]], false, 6), 1.1), fine: true });
    B.push(P('robe', blob(Mp, ml, [-14, 2, 14, 2, 15, -16, 11, -36, 0, -45, -11, -40, -16, -18])));
    B.push(P('kasaya', blob(Mp, ml, [-15, 2, 12, 3, 14, -14, 4, -28, -6, -42, -12, -40, -16, -18])));
    [[-15, -10, 13, -8], [-14, -22, 9, -22], [-9, -34, 2, -36], [-6, 2, -8, -38], [5, 3, 4, -26]].forEach(g => B.push({ ...Ln('gold', local(Mp, ml, g), 1.5), fine: true }));
    B.push(P('gold', E(...add(Mp, rot(-6, -36, ml)), 2.6, 2.6, 8)));
    // head: shaven, long earlobe, calm closed eyes, 毗卢帽 (five-buddha crown) with trailing ribbons
    B.push(P('skin', E(Mh[0], Mh[1], 13.5, 14, 18)), P('skin', local(Mh, ml, [-7, -2, -11, 4, -10, 11, -6, 10])));
    B.push({ ...Ln('ink', local(Mh, ml, [3, -3, 7, -1.5, 10, -3]), 1.6), fine: true }, { ...Ln('ink', local(Mh, ml, [3, -7, 10, -8]), 1.4), fine: true });
    B.push({ ...Ln('ink', local(Mh, ml, [8, 6, 11, 6]), 1.4), fine: true }, D('ink', ...add(Mh, rot(13.5, 1.5, ml)), 1));
    const rib = k => chain(add(Mh, rot(-11, -10, ml)), PI * 0.72 + 0.12 * k, 4, 6.5, j => 0.12 + 0.2 * sin(TAU * c * 1.6 - j * 0.9 - k * 0.6));
    B.push(P('red', ribbon(flat(rib(0)), 3.6, 2)), P('red', ribbon(flat(rib(1)), 3.2, 1.6)));
    B.push(Ln('gold', local(Mh, ml, [-13, -8, 0, -11, 13, -8]), 4));
    for (let k = -2; k <= 2; k++) { const base = add(Mh, rot(k * 5.4, -12 - (2 - Math.abs(k)) * 0.8, ml)); B.push(P('gold', blob(base, ml + k * 0.12, [-3, 0, -2.8, -7, 0, -11, 2.8, -7, 3, 0], 3)), D('red', ...add(base, rot(0, -5, ml + k * 0.12)), 1.2)); }
    // near arm and the 锡杖: ring head with jingling rings
    const sa = -PI / 2 + 0.03 * sin(TAU * 2 * c - 1.9), sH = add(Mc, rot(17, 10, ml)), sBot = polar(sH, sa + PI, 46), sTop = polar(sH, sa, 104);
    B.push(Ln('metal', [sBot[0], sBot[1], sTop[0], sTop[1]], 3.4));
    const ring = local(sTop, sa + PI / 2, [0, -2, -7, -8, -6, -16, 0, -21, 6, -16, 7, -8]);
    B.push({ ...Ln('gold', spline(ring, true, 4), 2.4), closed: true }, D('gold', ...polar(sTop, sa, 22), 2.4));
    for (let k = 0; k < 6; k++) { const side = k < 3 ? -1 : 1, j = k % 3, hp = polar(polar(sTop, sa, 6 + j * 5), sa + side * PI / 2, 6.5), sw = 0.3 * sin(TAU * 2 * c - 1.2 - j * 0.5) * side;
      B.push({ ...Ln('gold', E(...polar(hp, sa + PI + sw, 3.2), 2.6, 2.6, 8), 1.3), closed: true }); }
    const na = armIK(Sh, sH, 17, 16);
    B.push(P('robe', capsule(na.S, na.E, 6.4, 5.2)), P('kasaya', capsule(na.S, mix(na.S, na.E, 0.6), 6.8, 5.8)), P('robe', capsule(na.E, na.H, 5.2, 4.6)), P('skin', E(na.H[0], na.H[1], 4.2, 4.6, 10)));
    an.head = Mh; an.hand = na.H; an.handFar = fa.H; an.staffTop = sTop; an.horseHead = add(Hj, rot(36, 2, tH)); an.horseChest = add(Bc, rot(60, -4, pitch)); an.saddle = seat; an.chest = Mc;
    an.feet = [L.nh.hoof, L.nf.hoof, L.fh.hoof, L.ff.hoof];
    for (let k = riderFrom; k < B.length; k++) B[k].rider = true;
    const lb = l => [l.J, l.kn, l.an, l.hoof];
    return { parts: B, anchors: an, bones: bonesOf(lb(L.fh), lb(L.ff), lb(L.nh), lb(L.nf), tail, [N0, Hj, polar(Hj, tH, 36)], [Mp, Mc, Mh], [fa.S, fa.E, fa.H], [na.S, na.E, na.H], [sBot, sTop]) };
  }

  // ============================================================ 猪八戒 — short quick steps, waddle, jiggling belly, flopping ears, rake on the shoulder
  function bajie(G, A) {
    const B = [], an = {}, sc = XY.smooth(A.scratch || 0), c = G.phi, amp = 0.35 + 0.65 * Math.min(1, G.sp);
    const O = { lift: 9, l1: 28, l2: 28, ah: 6, foot: 15, bend: 1 };
    const bob = 2.2 * amp * (1 + G.run) * cos(TAU * 2 * (c - 0.3)), wad = 0.06 * amp * sin(TAU * c), H = [0, -51 + 5 * G.run - bob], jig = 2.6 * amp * (1 + G.run) * sin(TAU * 2 * c - 1.4);
    const C = add(H, rot(4, -50, wad)), Hd = add(C, rot(10, -34, wad * 0.5 - 0.04 * sin(TAU * 2 * c - 2))), S = add(C, rot(0, 4, wad));
    const far = legG(G, 0.5, add(H, [-6, 0]), { ...O, hx: -6 }), near = legG(G, 0, add(H, [6, 0]), { ...O, hx: 6 });
    const swing = armFK(add(S, [-6, 2]), 0.5 * amp * (1 + 0.6 * G.run) * sin(TAU * c + PI), 0.6 + 0.6 * G.run, 20, 19), belly = add(H, rot(14, -24 + jig * 0.5, wad));
    const fa = sc > 0 ? armIK(swing.S, mix(swing.H, add(belly, [10 + 4 * sin(TAU * 6 * c), 6]), sc), 20, 19) : swing;
    B.push(P('bjrobe', capsule(fa.S, fa.E, 7, 6)), P('pig', E(fa.H[0], fa.H[1], 5, 4.6, 10)), P('bjrobe', capsule(fa.E, fa.H, 6, 5)));
    B.push(P('bjpants', capsule(far.hip, far.knee, 8, 6.5)), P('bjpants', capsule(far.knee, far.ank, 6.5, 5)));
    B.push(P('ink', spline(flat([add(far.ank, [-6, -4]), add(far.ank, [4, -5]), far.toe, add(far.toe, [1, 4]), add(far.ank, [-6, 4])]), true, 3)));
    // rake (九齿钉钯) on the near shoulder, head behind and above
    const grip = add(S, rot(24, 24, wad)), sTop = add(S, rot(-2, -8, wad)), rd = atan2(sTop[1] - grip[1], sTop[0] - grip[0]) + 0.03 * sin(TAU * 2 * c - 1.6), rh = polar(grip, rd, 132), rb = polar(grip, rd + PI, 18);
    B.push(P('wood', capsule(rb, rh, 2.6, 2.6, 3)));
    const bar0 = polar(rh, rd + PI / 2, 21), bar1 = polar(rh, rd - PI / 2, 21);
    B.push(P('metal', capsule(bar0, bar1, 3.2, 3.2, 3)), P('metal', E(...rh, 5, 5, 10)));
    for (let k = 0; k < 9; k++) { const tb = mix(bar0, bar1, k / 8); B.push(P('metal', capsule(tb, polar(tb, rd - PI / 2 - 0.9, 13), 1.6, 0.8, 2))); }
    // body: robe over the shoulders and back, bare belly in front, sash
    B.push(P('bjrobe', blob(H, wad, [-22, 4, -27, -20, -24, -42, -10, -54, 8, -54, 18, -44, 10, -26, 4, 2])));
    B.push(P('pig', E(belly[0], belly[1], 25, 28 + jig * 0.3, 20)), { ...P('pig', E(belly[0] + 6, belly[1] + 8, 15, 16, 14)), shade: 0.1 });
    B.push(P('bjrobe', blob(H, wad, [-8, -48, 8, -52, 18, -44, 12, -36, 2, -40])), D('ink', belly[0] + 9, belly[1] + 3, 1.6));
    B.push(Ln('gold', local(H, wad, [-24, 2, -8, 6, 6, 4]), 4), Ln('gold', local(H, wad, [6, 4, 10, 14, 6, 18]), 3));
    B.push(P('bjpants', capsule(near.hip, near.knee, 8, 6.5)), P('bjpants', capsule(near.knee, near.ank, 6.5, 5)));
    B.push(P('ink', spline(flat([add(near.ank, [-6, -4]), add(near.ank, [4, -5]), near.toe, add(near.toe, [1, 4]), add(near.ank, [-6, 4])]), true, 3)));
    // head: big round, long snout, small eye, floppy ears (spring lag)
    const hA = wad * 0.5, ear = (side, base) => chain(add(Hd, rot(base[0], base[1], hA)), -0.25 + side * 0.25, 3, 9, k => 0.55 + 0.22 * sin(TAU * 2 * c - 1.8 - k * 0.6));
    const e2 = ear(-1, [-12, -14]);
    B.push(P('pig2', ribbon(flat(e2), 16, 6)));
    B.push(P('pig', E(Hd[0], Hd[1], 23, 21, 22)), P('pig', E(...add(Hd, rot(-2, 14, hA)), 18, 9, 14)));
    B.push(P('pig', blob(Hd, hA, [12, -6, 26, -5, 33, -1, 34, 8, 27, 12, 14, 10])), P('pig2', E(...add(Hd, rot(33, 3.5, hA)), 4.2, 6.4, 12)));
    B.push(D('ink', ...add(Hd, rot(32.5, 1.5, hA)), 1.3), D('ink', ...add(Hd, rot(34, 6, hA)), 1.3), { ...Ln('ink', local(Hd, hA, [18, 13, 24, 16, 30, 13]), 1.6), fine: true });
    const ey = add(Hd, rot(10, -6, hA)), op = blink(c, 0.83);
    B.push(P('ink', E(ey[0], ey[1], 2.4, 2.8 * op, 10)), { ...Ln('ink', local(Hd, hA, [5, -12, 13, -12]), 1.8), fine: true });
    const e1 = ear(1, [-4, -16]);
    B.push(P('pig2', ribbon(flat(e1), 17, 6.5)), { ...P('pig', ribbon(flat(e1), 9, 3)), shade: 0.12 });
    const na = armIK(S, grip, 20, 19);
    B.push(P('bjrobe', capsule(na.S, na.E, 7.5, 6.5)), P('bjrobe', capsule(na.E, na.H, 6.5, 5.5)), P('pig', E(na.H[0], na.H[1], 5.4, 5, 10)));
    an.head = Hd; an.hand = na.H; an.handFar = fa.H; an.rakeHead = rh; an.belly = belly; an.chest = C; an.feet = [near.toe, far.toe];
    return { parts: B, anchors: an, bones: bonesOf([far.hip, far.knee, far.ank, far.toe], [near.hip, near.knee, near.ank, near.toe], [H, C, Hd], [fa.S, fa.E, fa.H], [na.S, na.E, na.H], [rb, rh], e1) };
  }

  // ============================================================ 沙悟净 — long even stride, shoulder pole that flexes, bundles swinging on ropes, nine skulls
  function shaseng(G, A) {
    const B = [], an = {}, lf = XY.smooth(A.lift || 0), c = G.phi, amp = 0.35 + 0.65 * Math.min(1, G.sp);
    const O = { lift: 12, l1: 43, l2: 43, ah: 6, foot: 17, bend: 1 };
    const bob = 2.4 * amp * (1 + G.run) * cos(TAU * 2 * (c - 0.3)), H = [0, -79 + 8 * G.run - bob], lean = 0.05 + 0.14 * G.run + 0.015 * sin(TAU * 2 * c - 0.7);
    const C = add(H, rot(0, -56, lean)), Hd = add(C, rot(5, -24, lean)), S = add(C, rot(2, 5, lean));
    const far = legG(G, 0.5, add(H, [-3, 0]), { ...O, hx: -3 }), near = legG(G, 0, add(H, [3, 0]), { ...O, hx: 3 });
    const fa = armFK(add(S, [-4, 0]), 0.36 * amp * (1 + 0.6 * G.run) * sin(TAU * c + PI), 0.45 + 0.6 * G.run + 0.15 * sin(TAU * c), 25, 24);
    B.push(P('ssrobe2', capsule(fa.S, fa.E, 6, 5)), P('ssrobe2', capsule(fa.E, fa.H, 5, 4.4)), P('skin2', E(fa.H[0], fa.H[1], 4.6, 4.2, 10)));
    B.push(P('ssrobe2', capsule(far.hip, far.knee, 8, 6)), P('ssrobe2', capsule(far.knee, far.ank, 6, 4.6)));
    B.push(P('ink', spline(flat([add(far.ank, [-6, -4]), add(far.ank, [5, -5]), far.toe, add(far.toe, [1, 4]), add(far.ank, [-6, 4])]), true, 3)));
    // shoulder pole (扁担) flexing with the bob; bundles hang from both ends and lag
    const pc = add(S, rot(0, -7, lean)), flex = 4 * cos(TAU * 2 * (c - 0.42)) + 6 * lf, pL = add(pc, [-66, 6 + flex]), pR = add(pc, [64, 6 + flex]);
    const bundle = (end, k) => { const sw = 0.16 * sin(TAU * 2 * c - 1.4 - k * 0.5), top = end, bot = polar(top, PI / 2 + sw, 26);
      B.push({ ...Ln('ink', [top[0], top[1], bot[0] - 6, bot[1]], 1.3), fine: true }, { ...Ln('ink', [top[0], top[1], bot[0] + 6, bot[1]], 1.3), fine: true });
      B.push(P('bundle', blob(bot, sw, [-16, 0, 16, 0, 19, 16, 12, 28, -12, 28, -19, 16])), Ln('ink', local(bot, sw, [-17, 8, 17, 8]), 1.6));
      B.push({ ...P('bundle', blob(bot, sw, [-4, 2, 16, 2, 17, 26, 6, 27])), shade: 0.14 }); return bot; };
    an.bundleL = bundle(pL, 0);
    B.push(P('ssrobe', blob(H, lean, [-16, 2, -18, -28, -14, -52, 0, -60, 14, -54, 18, -28, 16, 2])));
    const hem = k => 3 * sin(TAU * c - k * 0.6);
    B.push(P('ssrobe', local(H, lean, [-17, -6, -20, 24 + hem(0), -6, 28 + hem(1), 8, 27 + hem(2), 20, 22 + hem(3), 16, -6])));
    B.push(Ln('gold', local(H, lean, [-17, -4, 0, -1, 17, -4]), 3.4), Ln('gold', local(H, lean, [9, -2, 12, 12, 9, 18]), 2.4));
    B.push(P('ssrobe2', capsule(near.hip, near.knee, 8, 6)), P('ssrobe2', capsule(near.knee, near.ank, 6, 4.6)));
    B.push(P('ink', spline(flat([add(near.ank, [-6, -4]), add(near.ank, [5, -5]), near.toe, add(near.toe, [1, 4]), add(near.ank, [-6, 4])]), true, 3)));
    // nine skulls (九个骷髅) on a cord over the chest
    for (let k = 0; k < 9; k++) { const u = k / 8, p = add(C, rot(-7 + u * 26, -10 + 17 * sin(u * PI) + 1.5 * sin(TAU * 2 * c - 1 - u * 2), lean));
      B.push(P('skull', E(p[0], p[1], 3.9, 3.6, 10)), D('ink', p[0] + 1.6, p[1] - 0.2, 0.9)); }
    // head: bald crown, ring of red hair, red beard, heavy brow
    B.push(P('skin2', E(Hd[0], Hd[1], 15.5, 17, 18)));
    B.push(P('ssh', blob(Hd, lean, [-16, -6, -12, -14, -6, -16, -12, -9, -13, 4, -6, 10, -14, 10, -18, 2])));
    B.push(P('ssbeard', blob(Hd, lean, [2, 7, 10, 9, 17, 6, 18, 14, 13, 24, 6, 26, 1, 18])));
    const ey = add(Hd, rot(9, -3, lean)), op = blink(c, 0.37);
    B.push(P('ink', E(ey[0], ey[1], 2.4, 2.8 * op, 10)), { ...Ln('ink', local(Hd, lean, [3, -9, 9, -11, 15, -8]), 2.4), fine: true }, { ...Ln('ink', local(Hd, lean, [15, -3, 18, 3]), 1.6), fine: true });
    B.push(P('gold', E(...add(Hd, rot(-3, 4, lean)), 2.6, 3.2, 8)));
    B.push(P('wood', capsule(pL, pR, 3, 3, 3)));
    an.bundleR = bundle(pR, 1);
    const na = armIK(S, add(pc, [26, 4 + flex * 0.4]), 25, 24);
    B.push(P('ssrobe', capsule(na.S, na.E, 6.4, 5.4)), P('ssrobe', capsule(na.E, na.H, 5.4, 4.6)), P('skin2', E(na.H[0], na.H[1], 4.8, 4.4, 10)));
    an.head = Hd; an.hand = na.H; an.handFar = fa.H; an.chest = C; an.pole = pc; an.feet = [near.toe, far.toe];
    return { parts: B, anchors: an, bones: bonesOf([far.hip, far.knee, far.ank, far.toe], [near.hip, near.knee, near.ank, near.toe], [H, C, Hd], [fa.S, fa.E, fa.H], [na.S, na.E, na.H], [pL, pc, pR]) };
  }

  // ============================================================ the procession
  // order = back to front; rate = gait cycles per STRIDE of distance (stride length per cycle = STRIDE / rate)
  // Ls0 = natural stride per gait cycle (design px), v0 = natural walking speed (px/s)
  const FIGS = [
    { name: 'shaseng', x: -300, f: shaseng, Ls0: 128, v0: 165, ph: 0.71 },
    { name: 'bajie', x: -150, f: bajie, Ls0: 98, v0: 150, ph: 0.37 },
    { name: 'monk', x: 40, f: monkOnHorse, Ls0: 132, v0: 160, ph: 0.13 },
    { name: 'wukong', x: 245, f: wukong, Ls0: 111, v0: 165, ph: 0.0 },
  ];
  XY.PROC_EXTENT = [-390, 320];
  XY.procParts = (w, acts) => {
    const key = w.toFixed(5) + JSON.stringify(acts ? Object.assign({}, acts, { cast: 0 }) : 0);
    if (key === memoKey) return memo;
    const d = w * S_;
    memo = FIGS.map(F => { const r = F.f(gctx(F.name, d, F.Ls0, F.v0, F.ph), (acts && acts[F.name]) || {}); r.parts.forEach(p => { p.fig = F.name; }); return { name: F.name, x: F.x, y: 0, parts: r.parts, bones: r.bones, anchors: r.anchors }; });   // p.fig: pens can tell whose part it is
    memoKey = key; return memo;
  };
  // 'monk.head', 'monk.horseHead', 'wukong.staffTip', 'bajie.rakeHead', 'shaseng.bundleR', … → procession-local [x, y]
  XY.anchor = (key, w, acts) => { const [n, k] = key.split('.'), F = XY.procParts(w, acts).find(f => f.name === n), p = F && F.anchors[k];
    return p ? [p[0] + F.x, p[1] + F.y] : [0, 0]; };

  XY.DEFAULT_COLORS = {
    fur: '#9A6A3A', face: '#EBCBA2', wkshirt: '#C8402E', tiger: '#E59A2F', stripe: '#2A1E14', gold: '#E2B33C', staff: '#B3261E', ink: '#1C1712',
    horse: '#F4F1EA', horse2: '#D6D0C4', mane: '#E6E1D6', hoof: '#3A322A', saddle: '#7A2A1E', red: '#B3261E', robe: '#E8C66A', kasaya: '#B3261E',
    skin: '#F0D2B0', metal: '#C9A23A', bjrobe: '#2B2F3A', bjpants: '#23262E', pig: '#F1B8B0', pig2: '#DF948C', wood: '#8A5A32',
    ssrobe: '#3B5566', ssrobe2: '#2E4250', skin2: '#B98A64', ssh: '#B5452E', ssbeard: '#9A3A26', skull: '#EFE8D8', bundle: '#D9A441',
  };

  // Who walks in which cell (the novel's order). A cell may override per frame with acts.cast = { wukong: true, … }.
  // 1–8 唐僧 alone on an ordinary horse (悟空 is freed inside cell 8), 9 悟空 joins (the white dragon horse arrives inside 9),
  // 12 八戒 joins inside the cell, 16 沙僧 joins inside the cell, 悟空 is sent away at the end of 20 and is back from 24,
  // sent away again inside 45 (46 is 真假美猴王 and keeps him). film.js sets XY.CURRENT_CAST before each panel.
  // rider: 唐僧 is off the horse while 红孩儿 holds him (snatched inside 29, all of 30, freed inside 31) and from the 鼍龙 (inside 32 to inside 33).
  XY.castAt = n => ({ staff: !(n === 40 || n === 41), monk: true, rider: !(n === 30 || n === 31 || n === 33), wukong: n >= 9 && !(n >= 21 && n <= 23), bajie: n >= 13, shaseng: n >= 17, whiteHorse: n >= 10 });
  XY.CURRENT_CAST = null;
  // Paint the procession at ground point (ox, oy). pen: color(role, part) → css | null (skip); outline, ow, wob, seed;
  // part(ctx, part, col, id) → true if it painted the part itself; shade: css | false for shading parts; fine: false drops hairlines.
  XY.drawProcession = (ctx, w, ox, oy, pen, acts) => {
    pen = pen || {};
    const col = pen.color || (r => XY.DEFAULT_COLORS[r]);
    ctx.save(); ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    const cast = Object.assign({}, XY.CURRENT_CAST || {}, (acts && acts.cast) || {});
    XY.procParts(w, acts).forEach((F, fi) => {
      if (cast[F.name] === false) return;
      ctx.save(); ctx.translate(ox + F.x, oy + F.y);
      F.parts.forEach((p, pi) => {
        if (p.rider && cast.rider === false) return;
        if (p.prop && cast[p.prop] === false) return;
        if (p.shade) { if (pen.shade === false || p.k !== 'poly') return; XY.path(ctx, p.pts, true); ctx.fillStyle = pen.shade || `rgba(20,12,4,${p.shade})`; ctx.fill(); return; }
        if (p.fine && pen.fine === false) return;
        const c = col(p.role, p); if (c == null) return;
        if (pen.part && pen.part(ctx, p, c, fi * 1000 + pi) !== false) return;
        const seed = (pen.seed || 0) + fi * 1000 + pi * 7;
        if (p.k === 'dot') { ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, TAU); ctx.fillStyle = c; ctx.fill(); return; }
        let pts = p.pts; if (pen.wob) pts = XY.wobble(XY.densify(pts, 8, p.k === 'poly' || p.closed), pen.wob, seed);
        if (p.k === 'poly') {
          XY.path(ctx, pts, true); ctx.fillStyle = c; ctx.fill();
          if (pen.outline) { ctx.strokeStyle = pen.outline; ctx.lineWidth = pen.ow || 2; ctx.stroke(); }
        } else {
          XY.path(ctx, pts, !!p.closed);
          if (pen.outline && !pen.thinLines && !p.fine) { ctx.strokeStyle = pen.outline; ctx.lineWidth = p.w + 2 * (pen.ow || 2); ctx.stroke(); }
          ctx.strokeStyle = c; ctx.lineWidth = p.w; ctx.stroke();
        }
      });
      ctx.restore();
    });
    ctx.restore();
  };
  // skeleton overlay for checking the rig
  XY.drawBones = (ctx, w, ox, oy, acts) => {
    ctx.save(); ctx.lineCap = 'round';
    XY.procParts(w, acts).forEach(F => { ctx.save(); ctx.translate(ox + F.x, oy + F.y);
      F.bones.forEach(b => { ctx.strokeStyle = 'rgba(0,140,255,0.85)'; ctx.lineWidth = 2; XY.path(ctx, b, false); ctx.stroke();
        for (let k = 0; k < b.length; k += 2) { ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(b[k], b[k + 1], 3, 0, TAU); ctx.fill(); ctx.strokeStyle = '#08f'; ctx.lineWidth = 1.4; ctx.stroke(); } });
      ctx.restore(); });
    ctx.restore();
  };
})();
