// 《二十四节气》Art Lock page: cards per season, lazy rendering, lightbox loop, lock / fix / drop with notes, export.
(function () {
  const JQ = window.JQ, KEY = 'jieqi-artlock-v1', STATES = { lock: '锁定', fix: '待改', drop: '换掉' };
  const SEASONS = [['春', '淡而清新'], ['夏', '饱和、热'], ['秋', '金褐、斜光'], ['冬', '冷，只用两三种颜色；小寒开始回暖，接回立春']];
  const db = JSON.parse(localStorage.getItem(KEY) || '{}');
  const save = () => localStorage.setItem(KEY, JSON.stringify(db));
  const $ = s => document.querySelector(s), el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
  const art = n => JQ.ART[n] || (JQ.placeholder(n), JQ.ART[n]);
  const no = n => String(n).padStart(2, '0');

  // ---------------------------------------------------------------- render one frame into a canvas
  const paint = (cv, n, t, wmax) => {
    const w = Math.max(320, Math.min(wmax, Math.round(cv.clientWidth * (window.devicePixelRatio || 1)))), h = Math.round(w * 9 / 16);
    if (cv.width !== w) { cv.width = w; cv.height = h; }
    const g = cv.getContext('2d'), S = { scale: w / JQ.W, W: JQ.W, H: JQ.H, n }, A = art(n);
    g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, w, h); g.setTransform(S.scale, 0, 0, S.scale, 0, 0);
    try { g.save(); A.draw(g, t == null ? (A.key || 0) : t, S); g.restore(); }
    catch (e) { g.restore(); g.setTransform(1, 0, 0, 1, 0, 0); g.fillStyle = '#2a1414'; g.fillRect(0, 0, w, h); g.fillStyle = '#f0c8c0'; g.font = '16px monospace'; g.fillText('渲染出错：' + String(e).slice(0, 80), 16, 30); console.error(n, e); }
  };

  // ---------------------------------------------------------------- build the cards
  const cards = {}, main = $('#main');
  SEASONS.forEach(([s, note]) => {
    const sec = el('section', 'season'); sec.append(el('div', 'season-head', `<span class="glyph">${s}</span><span class="note">${note}</span>`));
    const grid = el('div', 'grid'); sec.append(grid); main.append(sec);
    JQ.TERMS.filter(T => T.season === s).forEach(T => {
      const c = el('article', 'card'); c.dataset.n = T.n;
      const hou = T.hou.map((h, i) => i === T.keyHou ? `<em>${h}</em>` : h).join('　');
      c.innerHTML = `<div class="shot"><canvas></canvas><span class="chip"></span></div><div class="meta">
        <h3><span class="no">${no(T.n)}</span><span class="name">${T.name}</span><span class="style">${T.style}</span></h3>
        <div class="sn">${T.styleNote}</div><div class="hou">${hou}</div><div class="moment">${T.moment}</div>
        <div class="controls"><div class="seg">${Object.entries(STATES).map(([v, l]) => `<button data-v="${v}">${l}</button>`).join('')}</div>
        <textarea placeholder="备注（可选）" rows="1"></textarea></div></div>`;
      grid.append(c); cards[T.n] = c;
      c.querySelector('.shot').addEventListener('click', () => openLB(T.n));
      c.querySelectorAll('.seg button').forEach(b => b.addEventListener('click', () => setState(T.n, b.dataset.v)));
      const ta = c.querySelector('textarea'); ta.value = (db[T.n] || {}).note || '';
      ta.addEventListener('input', () => { db[T.n] = Object.assign(db[T.n] || {}, { note: ta.value }); save(); });
    });
  });
  const setState = (n, v) => {
    const cur = (db[n] || {}).state; db[n] = Object.assign(db[n] || {}, { state: cur === v ? null : v }); save(); sync();
  };
  const sync = () => {
    const cnt = { lock: 0, fix: 0, drop: 0, none: 0 };
    for (let n = 1; n <= 24; n++) {
      const st = (db[n] || {}).state || null, c = cards[n]; cnt[st || 'none']++;
      if (st) c.dataset.state = st; else delete c.dataset.state;
      c.querySelector('.chip').textContent = st ? STATES[st] : '';
      c.querySelectorAll('.seg button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.v === st)));
    }
    for (const k in cnt) $('#n-' + k).textContent = cnt[k];
    if (lbN) $('#lb-seg').querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.v === (db[lbN] || {}).state)));
  };

  // ---------------------------------------------------------------- lazy rendering, one card per frame
  const queue = [], done = new Set();
  const pump = () => { const n = queue.shift(); if (n != null && !done.has(n)) { done.add(n); paint(cards[n].querySelector('canvas'), n, null, 960); } if (queue.length) requestAnimationFrame(pump); };
  const io = new IntersectionObserver(es => { es.forEach(e => { if (e.isIntersecting) { const n = +e.target.dataset.n; if (!done.has(n) && !queue.includes(n)) { queue.push(n); if (queue.length === 1) requestAnimationFrame(pump); } } }); }, { rootMargin: '400px' });
  Object.values(cards).forEach(c => io.observe(c));

  // ---------------------------------------------------------------- lightbox: plays the 4-second loop
  let lbN = 0, playing = true, t0 = 0, tNow = 0, raf = 0;
  const lbc = $('#lbc');
  const frame = now => {
    if (!lbN) return;
    if (playing) tNow = ((now - t0) / 1000) % 4;
    paint(lbc, lbN, tNow, 1920); raf = requestAnimationFrame(frame);
  };
  const openLB = n => {
    lbN = n; const T = JQ.TERMS[n - 1]; $('#lb').classList.add('open');
    $('#lb-name').textContent = `${no(n)} ${T.name} · ${T.style}`; $('#lb-sub').textContent = `${T.hou.join('　')}｜${T.moment}`;
    playing = true; t0 = performance.now(); $('#lb-play').textContent = '暂停'; sync(); cancelAnimationFrame(raf); raf = requestAnimationFrame(frame);
  };
  const closeLB = () => { lbN = 0; cancelAnimationFrame(raf); $('#lb').classList.remove('open'); };
  const toggle = () => { playing = !playing; if (playing) t0 = performance.now() - tNow * 1000; $('#lb-play').textContent = playing ? '暂停' : '播放'; };
  $('#lb-close').onclick = closeLB; $('#lb-play').onclick = toggle;
  $('#lb-seg').querySelectorAll('button').forEach(b => b.addEventListener('click', () => setState(lbN, b.dataset.v)));
  document.addEventListener('keydown', e => {
    if (e.target.tagName === 'TEXTAREA') return;
    if (lbN) {
      if (e.key === 'Escape') closeLB(); else if (e.key === 'ArrowRight') openLB(lbN % 24 + 1); else if (e.key === 'ArrowLeft') openLB((lbN + 22) % 24 + 1);
      else if (e.key === ' ') { e.preventDefault(); toggle(); } else if ('123'.includes(e.key)) setState(lbN, ['lock', 'fix', 'drop'][+e.key - 1]);
    } else if (e.key === 'Escape') $('#modal').classList.remove('open');
  });

  // ---------------------------------------------------------------- export
  $('#export').onclick = () => {
    const lines = ['《二十四节气》Art Lock 意见', ''];
    SEASONS.forEach(([s]) => { lines.push(`【${s}】`); JQ.TERMS.filter(T => T.season === s).forEach(T => { const d = db[T.n] || {}; lines.push(`${no(T.n)} ${T.name} · ${T.style}：${d.state ? STATES[d.state] : '未选'}${d.note ? '。' + d.note.trim() : ''}`); }); lines.push(''); });
    $('#out').value = lines.join('\n'); $('#copied').textContent = ''; $('#modal').classList.add('open');
  };
  $('#m-close').onclick = () => $('#modal').classList.remove('open');
  $('#m-copy').onclick = async () => { const ta = $('#out'); ta.select(); let ok = false; try { await navigator.clipboard.writeText(ta.value); ok = true; } catch (e) { ok = document.execCommand && document.execCommand('copy'); } $('#copied').textContent = ok ? '已复制' : '请手动全选复制'; };
  sync();
})();
