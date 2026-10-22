// 《二十四节气》film · transitions led by the incoming term's phenomenon. JQ.transMask(n, p, SC) → { path, overlay(g) }:
// path = the region (device px) where the NEW style shows at progress p (0..1); overlay draws the phenomenon on the seam.
// Kinds: rain (slanted streak wipe), wind (horizontal wave), sun (radial from the sun), split (day/night from the centre
// line), drops (dew / snow cells), frost (dendrites from the corners), ice (cracked plates spreading from the pond),
// night (darkness falls from the top), heat (shimmering rings from the ground), thunder (a flash and a zig-zag tear).
(function () {
  const JQ = window.JQ;
  JQ.TRANS = { 2: 'rain', 3: 'thunder', 4: 'split', 5: 'rain', 6: 'rain', 7: 'sun', 8: 'wind', 9: 'wind', 10: 'sun', 11: 'heat', 12: 'night',
    13: 'wind', 14: 'wind', 15: 'drops', 16: 'split', 17: 'drops', 18: 'frost', 19: 'ice', 20: 'snowfall', 21: 'snowfall', 22: 'sun', 23: 'wind', 24: 'ice', 1: 'sun' };
  const W = 1920, H = 1080, E = JQ.ease;
  const poly = (pts, SC) => { const p = new Path2D(); pts.forEach(([x, y], i) => i ? p.lineTo(x * SC, y * SC) : p.moveTo(x * SC, y * SC)); p.closePath(); return p; };
  const circle = (p, x, y, r, SC) => { p.moveTo((x + r) * SC, y * SC); p.arc(x * SC, y * SC, r * SC, 0, Math.PI * 2); };
  const cellsMemo = {};
  const cells = (seed, n) => {                                      // jittered points for drops / ice plates (stable per kind)
    const k = seed + ':' + n; if (cellsMemo[k]) return cellsMemo[k];
    const R = JQ.rng(seed), out = []; for (let i = 0; i < n; i++) out.push([R() * W, R() * H, R()]); return (cellsMemo[k] = out);
  };
  const SUN = [1500, 150], POND = [990, 880];
  JQ.transMask = (n, p, SC, seed = n * 31) => {
    const kind = JQ.TRANS[n] || 'sun', e = E(p);
    let path = new Path2D(), overlay = null;
    if (kind === 'rain' || kind === 'wind' || kind === 'night' || kind === 'snowfall') {
      // a front moving across the frame; rain slants down-left with long fingers, wind is a horizontal wave, night falls from the top
      const pts = [], N = 64;
      if (kind === 'night' || kind === 'snowfall') { const y0 = -80 + e * (H + 260); for (let i = 0; i <= N; i++) { const x = i / N * W; pts.push([x, y0 + Math.sin(x * 0.012 + p * 6) * 40 + (JQ.fbm(x * 0.004, p * 3, seed, 3) - 0.5) * 120]); } pts.push([W, -10], [0, -10]); }
      else if (kind === 'wind') { const x0 = -200 + e * (W + 460); for (let i = 0; i <= N; i++) { const y = i / N * H; pts.push([x0 + Math.sin(y * 0.01 + p * 9) * 70 + (JQ.fbm(y * 0.006, p * 4, seed, 3) - 0.5) * 160, y]); } pts.push([-10, H], [-10, 0]); }
      else { const x0 = W + 240 - e * (W + 900); for (let i = 0; i <= N; i++) { const y = i / N * H, finger = ((i * 7919 + seed) % 5) / 5; pts.push([x0 + y * 0.45 - finger * 180 * (1 - Math.abs(p - 0.5) * 1.2), y]); } pts.push([W + 10, H], [W + 10, 0]); }
      path = poly(pts, SC);
      if (kind === 'rain') overlay = g => { g.save(); g.clip(path); g.strokeStyle = 'rgba(220,232,245,0.45)'; g.lineWidth = 1.6 * SC; const R = JQ.rng(seed + Math.floor(p * 24)); for (let i = 0; i < 160; i++) { const x = R() * W * SC, y = R() * H * SC; g.beginPath(); g.moveTo(x, y); g.lineTo(x - 18 * SC, y + 70 * SC); g.stroke(); } g.restore(); };
      if (kind === 'snowfall') overlay = g => { g.save(); g.fillStyle = 'rgba(255,255,255,0.9)'; const y0 = -80 + e * (H + 260), R = JQ.rng(seed + 3); for (let i = 0; i < 260; i++) { const x = R() * W, y = y0 - 40 + (R() - 0.5) * 220 + Math.sin(i + p * 6) * 12, r = 2 + R() * 5; g.beginPath(); g.arc(x * SC, y * SC, r * SC, 0, Math.PI * 2); g.fill(); } g.restore(); };
      if (kind === 'wind') overlay = g => { g.save(); g.strokeStyle = 'rgba(255,255,255,0.28)'; g.lineWidth = 3 * SC; g.lineCap = 'round'; for (let k = 0; k < 6; k++) { const yy = 140 + k * 160, x0 = -200 + e * (W + 460) - 40; g.beginPath(); g.moveTo((x0 - 260) * SC, yy * SC); g.bezierCurveTo((x0 - 160) * SC, (yy - 30) * SC, (x0 - 80) * SC, (yy + 30) * SC, x0 * SC, yy * SC); g.stroke(); } g.restore(); };
    } else if (kind === 'split') {                                  // 春分 / 秋分: day and night part from the centre line
      const half = e * (W / 2 + 60); path = poly([[W / 2 - half, 0], [W / 2 + half, 0], [W / 2 + half, H], [W / 2 - half, H]], SC);
      overlay = g => { g.save(); g.fillStyle = 'rgba(255,248,225,0.5)'; [W / 2 - half, W / 2 + half].forEach(x => g.fillRect((x - 3) * SC, 0, 6 * SC, H * SC)); g.restore(); };
    } else if (kind === 'drops' || kind === 'snow') {               // dew drops / snow cells open and merge
      const pts = cells(seed, kind === 'snow' ? 260 : 140), maxR = kind === 'snow' ? 150 : 210;
      for (const [x, y, r] of pts) { const local = JQ.clamp((p - r * 0.55 - (kind === 'snow' ? y / H * 0.3 : 0)) / 0.4); if (local > 0) circle(path, x, y, local * maxR, SC); }
      overlay = g => { g.save(); g.fillStyle = kind === 'snow' ? 'rgba(255,255,255,0.85)' : 'rgba(225,240,255,0.55)'; const R = JQ.rng(seed + 7); for (let i = 0; i < (kind === 'snow' ? 220 : 60); i++) { const x = R() * W, y = (R() * H + p * (kind === 'snow' ? 260 : 40)) % H, r = (kind === 'snow' ? 2 + R() * 4 : 3 + R() * 6) * (1 - Math.abs(p - 0.5)); g.beginPath(); g.arc(x * SC, y * SC, r * SC, 0, Math.PI * 2); g.fill(); } g.restore(); };
    } else if (kind === 'frost') {                                  // frost creeps in from the four corners as branching crystals
      const R = 120 + e * 2100;
      [[0, 0], [W, 0], [0, H], [W, H]].forEach(([cx, cy], c) => { const pts = []; for (let i = 0; i <= 120; i++) { const a = i / 120 * Math.PI * 2, spike = Math.pow(Math.abs(Math.sin(a * 9 + c)), 6) * 0.45; pts.push([cx + Math.cos(a) * R * (0.7 + spike + (JQ.noise(i * 0.4, c, seed) - 0.5) * 0.25), cy + Math.sin(a) * R * (0.7 + spike + (JQ.noise(i * 0.4, c + 5, seed) - 0.5) * 0.25)]); } path.addPath(poly(pts, SC)); });
      overlay = g => { g.save(); g.clip(path); g.strokeStyle = 'rgba(255,255,255,0.55)'; g.lineWidth = 1.5 * SC; for (let c = 0; c < 4; c++) { const cx = c % 2 ? W : 0, cy = c > 1 ? H : 0; for (let k = 0; k < 24; k++) { const a = k / 24 * Math.PI * 2, r = R * 0.9; g.beginPath(); g.moveTo(cx * SC, cy * SC); g.lineTo((cx + Math.cos(a) * r) * SC, (cy + Math.sin(a) * r) * SC); g.stroke(); } } g.restore(); };
    } else if (kind === 'ice') {                                    // plates of ice spread from the pond, each cell appears whole
      const pts = cells(seed, 90), reach = e * 2300;
      for (const [x, y, r] of pts) { const d = Math.hypot(x - POND[0], (y - POND[1]) * 1.6); if (d < reach - r * 160) { const s = 150; path.addPath(poly([[x - s, y - s * 0.6], [x + s * 0.3, y - s], [x + s, y - s * 0.2], [x + s * 0.7, y + s * 0.8], [x - s * 0.5, y + s]], SC)); } }
      overlay = g => { g.save(); g.strokeStyle = 'rgba(235,245,255,0.7)'; g.lineWidth = 2.5 * SC; g.stroke(path); g.restore(); };
    } else if (kind === 'heat') {                                   // shimmering rings rising from the warm ground
      const r = 80 + e * 2300; path = new Path2D(); const pts = []; for (let i = 0; i <= 140; i++) { const a = i / 140 * Math.PI * 2; pts.push([960 + Math.cos(a) * r * (1 + Math.sin(a * 14 + p * 40) * 0.04), 1080 + Math.sin(a) * r * 0.75]); } path = poly(pts, SC);
      overlay = g => { g.save(); g.strokeStyle = 'rgba(255,200,120,0.35)'; g.lineWidth = 6 * SC; g.stroke(path); g.restore(); };
    } else if (kind === 'thunder') {                                // 惊蛰: a zig-zag tear opens down the frame, with a flash
      const w = e * (W + 320), pts = [], N = 16;
      for (let i = 0; i <= N; i++) pts.push([960 - w / 2 + (i % 2 ? 60 : -60), i / N * H]);
      for (let i = N; i >= 0; i--) pts.push([960 + w / 2 + (i % 2 ? -60 : 60), i / N * H]);
      path = poly(pts, SC);
      overlay = g => { const f = Math.max(0, 1 - Math.abs(p - 0.08) * 12); if (f > 0) { g.save(); g.fillStyle = `rgba(255,255,240,${0.55 * f})`; g.fillRect(0, 0, W * SC, H * SC); g.restore(); } };
    } else {                                                        // sun: light spreads from the sun's place (or from the pond for 冬至)
      const [cx, cy] = n === 22 ? POND : SUN, R = 60 + e * 2500, pts = [];
      for (let i = 0; i <= 120; i++) { const a = i / 120 * Math.PI * 2, rr = R * (1 + (JQ.fbm(Math.cos(a) * 1.4 + 3, Math.sin(a) * 1.4 + p * 2, seed, 3) - 0.5) * 0.3); pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]); }
      path = poly(pts, SC);
      overlay = g => { g.save(); const gr = g.createRadialGradient(cx * SC, cy * SC, 0, cx * SC, cy * SC, R * SC); gr.addColorStop(0.75, 'rgba(255,236,190,0)'); gr.addColorStop(0.97, `rgba(255,236,190,${0.35 * (1 - p)})`); gr.addColorStop(1, 'rgba(255,236,190,0)'); g.fillStyle = gr; g.fillRect(0, 0, W * SC, H * SC); g.restore(); };
    }
    return { path, overlay, kind };
  };
})();
