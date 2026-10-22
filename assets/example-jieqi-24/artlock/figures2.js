// 《二十四节气》film · the farm family (农妇 the farm woman, 娃 the child) on one jointed skeleton, plus pose library.
// JQ.personParts(x, y, s, P) → parts [{ role, pts, path }] back to front, with parts.joints = { hand, hand2, head, hip, shoulder }
// (world coordinates, for props). P = { build: 'adult'|'child', pose, phase, dir, outfit, blend: { pose, k } }.
// Roles: skin hair coat pants apron hat (scarf / straw hat / hood) eye; shoes use 'hair'. Unknown roles fall back
// (see JQ.ROLE_FALLBACK in figures.js), so every style can draw the family with its existing pen.
(function () {
  const JQ = window.JQ, { limb, circ, place } = JQ._fig;
  const B = {
    adult: { unit: 240, thigh: 0.235, shin: 0.225, foot: 0.075, torso: 0.3, neck: 0.035, head: 0.068, ua: 0.165, fa: 0.15, sh: 0.06, hip: 0.07, legW: [0.085, 0.06], armW: [0.06, 0.05] },
    child: { unit: 165, thigh: 0.2, shin: 0.19, foot: 0.07, torso: 0.25, neck: 0.03, head: 0.095, ua: 0.14, fa: 0.12, sh: 0.065, hip: 0.07, legW: [0.1, 0.072], armW: [0.075, 0.062] },
  };
  const S = Math.sin, C = Math.cos, TAU = Math.PI * 2;
  // ---------------------------------------------------------------- pose library: angles in radians
  // legs: [thigh angle from vertical (+ forward), knee bend]; arms: [upper-arm angle from straight down (+ forward/up), elbow bend];
  // lean: torso forward; tilt: head; hip: fixed hip height for seated poses (else grounded on the lowest foot/knee)
  const walkLegs = (f, a = 0.42) => [[a * S(f), 0.1 + 0.62 * Math.max(0, -C(f))], [a * S(f + Math.PI), 0.1 + 0.62 * Math.max(0, -C(f + Math.PI))]];
  const POSES = {
    stand: f => ({ lean: 0.02, legs: [[0.05, 0.05], [-0.05, 0.03]], arms: [[-0.08, 0.15], [0.12, 0.2]] }),
    walk: f => ({ lean: 0.06, legs: walkLegs(f), arms: [[0.35 * S(f), 0.3], [-0.35 * S(f), 0.3]] }),
    run: f => ({ lean: 0.18, legs: walkLegs(f, 0.65), arms: [[0.7 * S(f), 1.0], [-0.7 * S(f), 1.0]] }),
    plow: f => ({ lean: 0.38, legs: walkLegs(f, 0.3), arms: [[0.95, 0.15], [0.85, 0.2]] }),
    lead: f => ({ lean: 0.08, legs: walkLegs(f), arms: [[0.3 * S(f), 0.3], [0.9, 0.35]] }),          // walking, front hand on the rope
    sow: f => ({ lean: 0.1, legs: walkLegs(f, 0.25), arms: [[0.25, 1.7], [0.3 + 1.35 * (0.5 + 0.5 * S(2 * f)), 0.2]] }),
    hoe: f => { const k = 0.5 + 0.5 * C(f); return { lean: 0.22 + 0.15 * (1 - k), legs: [[0.25, 0.2], [-0.3, 0.1]], arms: [[1.0 + 1.4 * k, 0.25], [1.1 + 1.4 * k, 0.15]] }; },
    cut: f => ({ lean: 0.9, legs: [[0.5, 0.95], [-0.25, 0.45]], arms: [[0.9 + 0.2 * S(f), 0.3], [0.55 + 0.45 * S(f), 0.15]] }),
    carry: f => ({ lean: 0.04, legs: walkLegs(f, 0.32), arms: [[0.25 * S(f), 0.3], [1.9, 1.7]] }),
    sit: f => ({ lean: -0.04, hip: 0.25, legs: [[1.45, 1.45], [1.35, 1.35]], arms: [[0.55, 0.95], [0.6, 0.9]] }),
    fan: f => ({ lean: -0.04, hip: 0.25, legs: [[1.45, 1.45], [1.35, 1.35]], arms: [[0.55, 0.95], [1.55 + 0.25 * S(6 * f), 1.9]] }),
    squat: f => ({ lean: 0.35, legs: [[1.25, 2.25], [1.0, 2.1]], arms: [[0.75, 0.6], [0.9, 0.5]] }),
    kneel: f => ({ lean: 0.2, legs: [[1.35, 1.55], [-0.15, 1.75]], arms: [[0.8, 0.4], [1.0, 0.3]] }),
    reach: f => ({ lean: -0.02, legs: [[0.06, 0.04], [-0.06, 0.02]], arms: [[0.15, 0.2], [2.7 + 0.08 * S(f), 0.1]] }),
    sweep: f => ({ lean: 0.32, legs: walkLegs(f, 0.18), arms: [[0.75 + 0.3 * S(f), 0.25], [0.6 + 0.3 * S(f), 0.3]] }),
    flail: f => { const k = 0.5 + 0.5 * C(f); return { lean: 0.15, legs: [[0.25, 0.15], [-0.25, 0.1]], arms: [[1.4 + 1.3 * k, 0.15], [1.5 + 1.3 * k, 0.1]] }; },
    hold: f => ({ lean: 0.02, legs: [[0.05, 0.05], [-0.05, 0.03]], arms: [[-0.05, 0.2], [0.35, 1.35]] }),
    wave: f => ({ lean: 0, legs: [[0.05, 0.05], [-0.05, 0.03]], arms: [[0.1, 0.2], [2.5, 0.4 + 0.35 * S(5 * f)]] }),
    ride: f => ({ lean: 0.05, hip: 0.0, legs: [[0.75, 0.55], [0.6, 0.5]], arms: [[0.4, 0.6], [0.6, 0.5]] }),
  };
  JQ.POSES = POSES;
  const mixAngles = (a, b, k) => ({ lean: a.lean + (b.lean - a.lean) * k, tilt: (a.tilt || 0) + ((b.tilt || 0) - (a.tilt || 0)) * k,
    hip: a.hip != null && b.hip != null ? a.hip + (b.hip - a.hip) * k : (k < 0.5 ? a.hip : b.hip),
    legs: a.legs.map((l, i) => [l[0] + (b.legs[i][0] - l[0]) * k, l[1] + (b.legs[i][1] - l[1]) * k]),
    arms: a.arms.map((l, i) => [l[0] + (b.arms[i][0] - l[0]) * k, l[1] + (b.arms[i][1] - l[1]) * k]) });
  JQ._mixAngles = mixAngles;

  // ---------------------------------------------------------------- the skeleton → parts
  JQ.personParts = (x, y, s = 1, P = {}) => {
    const b = B[P.build || 'adult'], f = P.phase || 0, dir = P.dir || 1, O = P.outfit || {};
    let A = (POSES[P.pose] || POSES.stand)(f);
    if (P.blend && POSES[P.blend.pose]) A = mixAngles(POSES[P.blend.pose](f), A, JQ.clamp(P.blend.k));
    const legPts = hy => A.legs.map(([a1, k]) => { const H = [0, hy], K = [H[0] + b.thigh * S(a1), H[1] - b.thigh * C(a1)], a2 = a1 - k, An = [K[0] + b.shin * S(a2), K[1] - b.shin * C(a2)]; return [H, K, An]; });
    // ground: the lowest foot or knee touches v = 0 (seated poses keep their hip height)
    let hy = A.hip != null ? A.hip : 0;
    if (A.hip == null) { const L0 = legPts(0); hy = -Math.min(...L0.flatMap(l => [l[1][1] + b.legW[0] * 0.3, l[2][1] - 0.01])); }
    const legs = legPts(hy), H = [0, hy];
    const Sh = [H[0] + b.torso * S(A.lean), H[1] + b.torso * C(A.lean)];
    const Hd = [Sh[0] + (b.neck + b.head) * S(A.lean + (A.tilt || 0)), Sh[1] + (b.neck + b.head) * C(A.lean + (A.tilt || 0))];
    const arms = A.arms.map(([b1, e], i) => { const S0 = [Sh[0] + (i ? 0.012 : -0.012), Sh[1] - 0.012], E = [S0[0] + b.ua * S(b1), S0[1] - b.ua * C(b1)], b2 = b1 + e; return [S0, E, [E[0] + b.fa * S(b2), E[1] - b.fa * C(b2)]]; });
    const out = [], rotL = (u, v) => [H[0] + u * C(A.lean) + v * S(A.lean), H[1] - u * S(A.lean) + v * C(A.lean)];
    const pad = O.coat === 'padded' ? 0.022 : 0;
    const arm = (L, back) => {
      const mid = [(L[1][0] + L[2][0]) / 2, (L[1][1] + L[2][1]) / 2];
      out.push({ role: 'coat', pts: limb(O.sleeves === 'short' ? [L[0], [(L[0][0] + L[1][0]) / 2, (L[0][1] + L[1][1]) / 2]] : [L[0], L[1], mid], b.armW[0] + pad, b.armW[1] + pad) });
      out.push({ role: 'skin', pts: limb(O.sleeves === 'short' ? [[(L[0][0] + L[1][0]) / 2, (L[0][1] + L[1][1]) / 2], L[1], L[2]] : [mid, L[2]], b.armW[1] * 0.85, b.armW[1] * 0.75) });
      out.push({ role: 'skin', pts: circ(L[2][0], L[2][1], b.armW[1] * 0.62, 10) });
    };
    const leg = L => {
      out.push({ role: 'pants', pts: limb([L[0], L[1], [L[1][0] + (L[2][0] - L[1][0]) * 0.8, L[1][1] + (L[2][1] - L[1][1]) * 0.8]], b.legW[0] + pad * 0.6, b.legW[1]) });
      out.push({ role: 'skin', pts: limb([[L[1][0] + (L[2][0] - L[1][0]) * 0.75, L[1][1] + (L[2][1] - L[1][1]) * 0.75], L[2]], b.legW[1] * 0.75, b.legW[1] * 0.7) });
      const a = L[2]; out.push({ role: 'hair', sharp: true, pts: [[a[0] - 0.02, a[1] + 0.02], [a[0] + b.foot, a[1] + 0.008], [a[0] + b.foot, a[1] - 0.012], [a[0] - 0.025, a[1] - 0.012]] });
    };
    arm(arms[0], true); leg(legs[0]);
    const hem = O.coat === 'cape' ? -0.24 : b === B.adult ? -0.12 : -0.07;
    out.push({ role: O.coat === 'cape' ? 'cape' : 'coat', pts: [rotL(-b.sh - pad, b.torso + 0.005), rotL(b.sh + 0.012 + pad, b.torso + 0.005), rotL(b.hip + 0.03 + pad, hem), rotL(-b.hip - 0.02 - pad, hem)] });
    if (O.apron) out.push({ role: 'apron', pts: [rotL(0.02, 0.07), rotL(b.hip + 0.035, 0.07), rotL(b.hip + 0.05, -0.2), rotL(0.01, -0.2)] });
    leg(legs[1]);
    out.push({ role: 'skin', pts: circ(Hd[0], Hd[1], b.head, 24) });
    const hb = Hd, r = b.head;
    if (O.hat === 'straw') out.push({ role: 'straw', sharp: true, pts: [[hb[0] - r * 3.0, hb[1] + r * 0.55], [hb[0] + r * 0.2, hb[1] + r * 2.1], [hb[0] + r * 3.1, hb[1] + r * 0.5], [hb[0] + r * 0.1, hb[1] + r * 0.8]] });
    else if (O.hat === 'hood') out.push({ role: 'hat', pts: circ(hb[0] - r * 0.1, hb[1] + r * 0.12, r * 1.28, 24).filter(([u]) => u < hb[0] + r * 0.55) });
    else if (O.hat === 'scarf') { out.push({ role: 'scarf', pts: circ(hb[0] - r * 0.08, hb[1] + r * 0.2, r * 1.12, 24).filter(([u, v]) => v > hb[1] + r * 0.05 || u < hb[0] - r * 0.6) }); out.push({ role: 'scarf', sharp: true, pts: [[hb[0] - r * 1.1, hb[1] - r * 0.1], [hb[0] - r * 1.7, hb[1] - r * 0.7], [hb[0] - r * 1.25, hb[1] - r * 0.85]] }); }
    else {
      out.push({ role: 'hair', pts: circ(hb[0] - r * 0.06, hb[1] + r * 0.1, r * 1.04, 24).filter(([u, v]) => v > hb[1] + r * 0.18 || u < hb[0] - r * 0.62) });
      if (b === B.adult) out.push({ role: 'hair', pts: circ(hb[0] - r * 1.0, hb[1] + r * 0.35, r * 0.55, 12) });                  // 发髻 bun
      else { out.push({ role: 'hair', pts: circ(hb[0] - r * 0.62, hb[1] + r * 0.92, r * 0.4, 12) }); out.push({ role: 'hair', pts: circ(hb[0] + r * 0.38, hb[1] + r * 1.06, r * 0.4, 12) }); } // 双丫髻
    }
    if (O.hat === 'cap') out.push({ role: 'hat', pts: circ(hb[0] - r * 0.05, hb[1] + r * 0.5, r * 0.95, 20).filter(([u, v]) => v > hb[1] + r * 0.35) });
    out.push({ role: 'eye', pts: circ(Hd[0] + r * 0.55, Hd[1] + r * 0.02, r * 0.11, 8) });
    arm(arms[1], false);
    const parts = place(out, x, y, b.unit * s, dir), W = ([u, v]) => [x + u * b.unit * s * dir, y - v * b.unit * s];
    parts.joints = { hand: W(arms[1][2]), hand2: W(arms[0][2]), elbow: W(arms[1][1]), head: W(Hd), hip: W(H), shoulder: W(Sh), headR: b.head * b.unit * s, unit: b.unit * s, dir };
    return parts;
  };
})();
