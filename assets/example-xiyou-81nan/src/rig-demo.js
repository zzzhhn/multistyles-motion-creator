// rig-demo.js — a review page for the pilgrims' rig: walk on a treadmill ground (world-fixed marks prove the feet
// stay planted), switch between a natural stroll and the film's pacing (slow mid-panel, dash across the seam),
// show the skeleton, swap pens, zoom on one character, trigger the acting poses. ?still=1 → tools drive __renderAt(t).
(() => {
  'use strict';
  const XY = window.XY, TAU = XY.TAU, Q = new URLSearchParams(location.search), STILL = Q.has('still');
  const cv = document.getElementById('c'), g = cv.getContext('2d'), S = cv.width / 1920, GY = 800, INK = '#2A2018';
  const st = { mode: Q.get('mode') || 'stroll', bones: Q.has('bones'), pen: Q.get('pen') || 'color', focus: Q.get('focus') || 'all', slow: false, paused: false, auto: !Q.has('noauto') };
  const ACTS = [['wukong', 'shade', '悟空 · 搭凉棚'], ['wukong', 'raise', '悟空 · 举棒'], ['wukong', 'strike', '悟空 · 前劈'], ['monk', 'palm', '唐僧 · 立掌'], ['bajie', 'scratch', '八戒 · 挠肚皮'], ['shaseng', 'lift', '沙僧 · 颠担']];
  const act = {}; ACTS.forEach(([f, a]) => { act[f + '.' + a] = { from: 0, to: 0, at: -9 }; });
  (Q.get('acts') || '').split(',').filter(Boolean).forEach(k => { const m = ACTS.find(x => x[1] === k); if (m) act[m[0] + '.' + k] = { from: 1, to: 1, at: -9 }; });
  const FIGX = { all: 0, shaseng: -300, bajie: -150, monk: 40, wukong: 245 }, NAMES = [['shaseng', '沙僧'], ['bajie', '八戒'], ['monk', '唐僧 · 白龙马'], ['wukong', '悟空']];
  const PENS = {
    color: { outline: INK, ow: 1.5 },
    sketch: { color: r => (r === 'ink' ? INK : '#EFE8D8'), outline: INK, ow: 1.4, wob: 0.8, seed: 3, shade: false },
    silhouette: { color: () => INK, shade: false, fine: false },
  };

  // ---- speed profiles → distance d(t) and the rig's speed table (px/s per px of distance)
  const AVG = 480, A = 0.66, P = 2.5;
  const vAt = t => (st.mode === 'film' ? AVG * (1 + A * Math.cos(TAU * t / P)) : 150);
  const dAt = t => (st.mode === 'film' ? AVG * t + AVG * A * P / TAU * Math.sin(TAU * t / P) : 150 * t);
  const applyMode = () => { const n = 120000, v = new Float32Array(n);
    if (st.mode === 'film') { let j = 0; for (let t = 0; j < n; t += 1 / 480) { const d = dAt(t); for (; j < n && j <= d; j++) v[j] = vAt(t); } } else v.fill(150);
    XY.RIG_SPEED_TABLE(v); };
  applyMode();
  const actsAt = T => { const o = {};
    ACTS.forEach(([f, a]) => { const s = act[f + '.' + a], u = XY.smooth((T - s.at) / 0.45), val = XY.lerp(s.from, s.to, u); if (val > 0.001) (o[f] = o[f] || {})[a] = val; });
    return o; };
  const AUTO = [[3, 'wukong.shade'], [6.5, 'monk.palm'], [10, 'wukong.raise'], [10, 'bajie.scratch'], [13.5, 'shaseng.lift'], [13.5, 'wukong.strike']];
  const autoActs = T => { const L = 18, u = T % L, o = {};
    AUTO.forEach(([t0, k]) => { const v = XY.smooth((u - t0) / 0.45) * (1 - XY.smooth((u - t0 - 2.6) / 0.45)); if (v > 0.001) { const [f, a] = k.split('.'); (o[f] = o[f] || {})[a] = v; } });
    return o; };

  let paper = null;
  const paperBg = () => { if (paper) return paper; paper = document.createElement('canvas'); paper.width = cv.width; paper.height = cv.height; const p = paper.getContext('2d'), r = XY.rng(5);
    p.fillStyle = '#EFE8D8'; p.fillRect(0, 0, paper.width, paper.height);
    for (let i = 0; i < 9000; i++) { p.fillStyle = r() < 0.5 ? 'rgba(255,252,240,0.35)' : 'rgba(110,88,58,0.05)'; p.fillRect(r() * paper.width, r() * paper.height, 1 + r() * 3, 1 + r() * 3); }
    return paper; };

  const drawView = (T, k, cx, gy, focusX, inset) => {
    const d = dAt(T), w = d / XY.LAYOUT.STRIDE, acts = st.auto && !inset ? autoActs(T) : st.auto ? autoActs(T) : actsAt(T);
    // world-fixed ground: line, ticks every 32 px, pebbles; they slide by exactly -d, like the planted feet should
    g.save(); g.translate(cx, gy); g.scale(k, k); g.translate(-focusX, 0);
    const x0 = focusX - cx / k - 64, x1 = focusX + (1920 - cx) / k + 64;
    g.strokeStyle = 'rgba(58,46,34,0.55)'; g.lineWidth = 1.6 / k; g.beginPath(); g.moveTo(x0, 0); g.lineTo(x1, 0); g.stroke();
    for (let m = Math.floor((x0 + d) / 32) * 32; m < x1 + d; m += 32) { const x = m - d, big = m % 128 === 0; g.strokeStyle = big ? 'rgba(168,38,28,0.55)' : 'rgba(58,46,34,0.28)'; g.lineWidth = (big ? 2 : 1.2) / k; g.beginPath(); g.moveTo(x, 2); g.lineTo(x, big ? 14 : 8); g.stroke(); }
    for (let m = Math.floor((x0 + d) / 47) * 47; m < x1 + d; m += 47) { const x = m - d + 20 * XY.hash(m, 3); g.fillStyle = 'rgba(90,70,48,0.35)'; g.beginPath(); g.ellipse(x, 22 + 10 * XY.hash(m, 4), 3 + 3 * XY.hash(m, 5), 1.6, 0, 0, TAU); g.fill(); }
    XY.drawProcession(g, w, 0, 0, PENS[st.pen], acts);
    if (st.bones && !inset) XY.drawBones(g, w, 0, 0, acts);
    if (!inset && st.focus === 'all') { g.fillStyle = '#7A6E5E'; g.font = XY.font(15, XY.cnFont.kai); g.textAlign = 'center'; NAMES.forEach(([n, s]) => g.fillText(s, FIGX[n], 48)); }
    g.restore();
    return { d, v: vAt(T) };
  };

  window.__renderAt = T => {
    g.setTransform(1, 0, 0, 1, 0, 0); g.drawImage(paperBg(), 0, 0); g.setTransform(S, 0, 0, S, 0, 0);
    const kMain = st.focus === 'all' ? 1.75 : 3.4, fx = FIGX[st.focus];
    const info = drawView(T, kMain, st.focus === 'all' ? 1000 : 960, GY, fx, false);
    // film-size inset
    g.save(); g.fillStyle = 'rgba(255,252,244,0.75)'; g.fillRect(1380, 36, 510, 210); g.strokeStyle = 'rgba(58,46,34,0.3)'; g.lineWidth = 1; g.strokeRect(1380, 36, 510, 210);
    g.beginPath(); g.rect(1380, 36, 510, 210); g.clip(); drawView(T, 0.62, 1640, 206, 0, true); g.restore();
    g.fillStyle = '#7A6E5E'; g.font = XY.font(15, XY.cnFont.kai); g.fillText('成片里的实际大小（2K 画面中约 1:1）', 1392, 60);
    g.fillStyle = INK; g.font = XY.font(40, XY.cnFont.song, 'bold'); g.fillText('师徒四人 · 造型、骨骼与步态', 64, 96);
    g.fillStyle = '#A8261C'; g.font = XY.font(20, XY.cnFont.kai);
    g.fillText(st.mode === 'film' ? '成片节奏：每 2.5 秒一格，格中慢走，过缝时步幅拉长、转成小跑' : '漫步：自然步速，每只脚落地后贴住地面刻度不打滑', 66, 136);
    g.fillStyle = '#7A6E5E'; g.font = XY.font(17, 'Menlo, monospace'); g.fillText(`speed ${info.v.toFixed(0)} px/s   t ${T.toFixed(2)} s`, 66, 168);
  };

  if (STILL) { window.__renderAt(+(Q.get('t') || 0)); return; }
  // ---- UI
  const ui = document.getElementById('ui'), btns = [];
  const group = (label, items) => { const d = document.createElement('div'); d.className = 'grp'; d.innerHTML = `<b>${label}</b>`; items.forEach(([txt, on, fn]) => { const b = document.createElement('button'); b.textContent = txt; b.onclick = () => { fn(); refresh(); }; b._on = on; d.appendChild(b); btns.push(b); }); ui.appendChild(d); };
  let T = 0, last = performance.now();
  group('节奏', [['漫步', () => st.mode === 'stroll', () => { st.mode = 'stroll'; applyMode(); }], ['成片节奏', () => st.mode === 'film', () => { st.mode = 'film'; applyMode(); }]]);
  group('播放', [['暂停', () => st.paused, () => { st.paused = !st.paused; }], ['慢放 ¼', () => st.slow, () => { st.slow = !st.slow; }]]);
  group('显示', [['骨骼', () => st.bones, () => { st.bones = !st.bones; }], ['彩色', () => st.pen === 'color', () => { st.pen = 'color'; }], ['墨线', () => st.pen === 'sketch', () => { st.pen = 'sketch'; }], ['剪影', () => st.pen === 'silhouette', () => { st.pen = 'silhouette'; }]]);
  group('镜头', [['全队', () => st.focus === 'all', () => { st.focus = 'all'; }], ['悟空', () => st.focus === 'wukong', () => { st.focus = 'wukong'; }], ['唐僧', () => st.focus === 'monk', () => { st.focus = 'monk'; }], ['八戒', () => st.focus === 'bajie', () => { st.focus = 'bajie'; }], ['沙僧', () => st.focus === 'shaseng', () => { st.focus = 'shaseng'; }]]);
  group('动作', [['自动表演', () => st.auto, () => { st.auto = !st.auto; }]].concat(ACTS.map(([f, a, label]) => [label, () => !st.auto && act[f + '.' + a].to > 0, () => {
    st.auto = false; const s = act[f + '.' + a], u = XY.smooth((T - s.at) / 0.45), cur = XY.lerp(s.from, s.to, u); act[f + '.' + a] = { from: cur, to: s.to > 0 ? 0 : 1, at: T }; }])));
  const refresh = () => btns.forEach(b => b.classList.toggle('on', !!b._on()));
  refresh();
  const frame = now => { const dt = Math.min(0.05, (now - last) / 1000); last = now; if (!st.paused) T += dt * (st.slow ? 0.25 : 1); window.__renderAt(T); requestAnimationFrame(frame); };
  requestAnimationFrame(frame);
})();
