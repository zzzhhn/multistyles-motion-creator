// 《二十四节气》Art Lock · a neutral flat rendering of the layout (debug + placeholder for unfinished styles).
(function () {
  const JQ = window.JQ, S = JQ.SCENE, L = JQ.L;
  JQ.flatScene = (g, t, Sx, pal = {}) => {
    const c = Object.assign({ sky: '#CFD8DC', mtn: '#90A4AE', hill: '#7C9A86', field: '#B9B07A', furrow: '#9C9461', ground: '#A89A78', pond: '#6E95A8', rim: '#7E6F55', stream: '#7EA3B4', bridge: '#B9B2A4', trunk: '#5B4636', canopy: '#5E7F4E', wall: '#D9D0C1', cap: '#55504A', roof: '#4E4A47', front: '#C4B8A6', gate: '#3A2E26', path: '#C2B28E', line: '#2B2620' }, pal);
    g.fillStyle = c.sky; g.fillRect(0, 0, JQ.W, L.HORIZON + 10);
    g.fillStyle = c.mtn; g.fill(S.mountains.path);
    g.fillStyle = c.hill; g.fill(S.hills.path);
    g.fillStyle = c.ground; g.fill(S.ground.path);
    g.fillStyle = c.field; g.fill(S.field.path);
    g.strokeStyle = c.furrow; g.lineWidth = 3; S.furrows.forEach(f => g.stroke(f.path));
    g.fillStyle = c.path; g.fill(S.path.path);
    g.fillStyle = c.stream; g.fill(S.stream.path);
    g.fillStyle = c.rim; g.fill(S.pondRim.path);
    g.fillStyle = c.pond; g.fill(S.pond.path);
    g.fillStyle = c.bridge; g.fill(S.bridge.path); g.strokeStyle = c.line; g.lineWidth = 3; g.stroke(S.bridge.path);
    g.fillStyle = c.roof; g.fill(S.roof.path); g.fillStyle = c.front; g.fill(S.houseFront.path); g.fillStyle = c.gate; g.fill(S.window.path);
    g.fillStyle = c.roof; g.fill(S.chimney.path);
    g.fillStyle = c.wall; g.fill(S.wall.path); g.fillStyle = c.cap; g.fill(S.wallCap.path);
    g.fillStyle = c.gate; g.fill(S.gate.path); g.fillStyle = c.roof; g.fill(S.gateRoof.path);
    g.strokeStyle = c.trunk; JQ.drawBranches(g, 3, 1);
    g.fillStyle = c.trunk; g.fill(S.trunk.path);
    g.globalAlpha = 0.92; g.fillStyle = c.canopy; S.clumps.forEach(q => { g.beginPath(); g.arc(q.x, q.y, q.r, 0, 6.2832); g.fill(); }); g.globalAlpha = 1;
    if (pal.noCast) return;
    JQ.ox(g, L.ox[0], L.ox[1], 1, { kind: 'graze', phase: t * 3 }, JQ.PEN);
    JQ.kid(g, L.kid[0], L.kid[1], 1, { kind: 'stand' }, JQ.PEN);
  };
  // placeholder registration helper used by unfinished style files
  JQ.placeholder = n => {
    JQ.ART[n] = JQ.ART[n] || { key: 0, placeholder: true, draw(g, t, Sx) {
      JQ.flatScene(g, t, Sx);
      g.fillStyle = 'rgba(20,20,24,0.55)'; g.fillRect(0, 0, JQ.W, JQ.H);
      const T = JQ.TERMS[n - 1]; g.fillStyle = '#fff'; g.textAlign = 'center'; g.font = '600 96px "Songti SC", serif';
      g.fillText(T.name + ' · ' + T.style, JQ.W / 2, JQ.H / 2); g.font = '40px "PingFang SC", sans-serif'; g.fillText('制作中', JQ.W / 2, JQ.H / 2 + 80);
    } };
  };
})();
