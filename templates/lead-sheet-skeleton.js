// lead-sheet-skeleton.js — a starting point for a hand-written score (copy to src/score-<v>.js and fill in).
// Rules that made the approved score work (see references/06-music.md):
//   - the music's form is independent of the picture units: one chord per bar, 8-bar phrases spanning several units;
//   - few key areas (home key + one bright relative; the brightest resolution saved for the finale);
//   - a handful of reusable blocks that come back; the main theme is developed, its full statement is rare;
//   - one period soloist per row/chapter, not per unit; growth by adding layers and dynamics, not by changing harmony;
//   - melody notes on beats 1 and 3 are chord tones; passing notes on 2 and 4.
// Run `node lead-sheet-skeleton.js` to lint (block lengths, strong-beat chord tones, section coverage).
(() => {
  'use strict';
  const XY = (typeof window !== 'undefined' ? window : globalThis).XY || ((typeof window !== 'undefined' ? window : globalThis).XY = {});
  const B = {
    // L: an open loop to lay under the first units; melA for a soloist, melB a register up for violins
    L: { chords: ['Dm', 'Bb', 'F', 'C'], bass: ['D2', 'Bb1', 'F2', 'C2'],
      melA: [['A4', 4], ['Bb4', 4], ['A4', 4], ['G4', 4]],
      melB: [['D5', 4], ['F5', 4], ['C5', 4], ['E5', 4]] },
    // T: the main theme (8 bars): antecedent ends open, consequent closes
    T: { chords: ['Gm/D', 'C', 'F', 'Bb', 'Gm/D', 'C', 'A7', 'Dm'], bass: ['D2', 'C2', 'F2', 'Bb1', 'D2', 'C2', 'A1', 'D2'],
      mel: [['D4', 1], ['F4', 1], ['G4', 2], ['C5', 3], ['A4', 1], ['A4', 3], ['G4', 1], ['F4', 2], ['D4', 2],
        ['D4', 1], ['F4', 1], ['G4', 2], ['C5', 1], ['D5', 1], ['E5', 2], ['E5', 2], ['C#5', 1], ['A4', 1], ['D5', 4]] },
    // add: S (sorrow), H (hope, relative major), E (drive), CAD / short joins ...
  };
  // Layers: pad choir bass arp zheng hpsd chip ost pizz tremolo timp perc horns bells (the renderer implements this vocabulary).
  // dyn: 1 (pp) … 8 (ff). Optional: padOct (-1 keeps a low solo on top), chipDb.
  const S = [
    { at: 1, block: 'INTRO' },                                                          // reuse an approved intro if there is one
    { at: 4, block: 'L', mel: null, layers: ['pad', 'arp', 'bass'], dyn: [2, 3] },
    { at: 8, block: 'L', mel: 'melA', lead: ['xun'], layers: ['pad', 'arp', 'bass'], dyn: [3, 3] },
    { at: 12, block: 'T', mel: 'mel', lead: ['violins'], layers: ['pad', 'arp', 'bass'], dyn: [3, 4] },
    // ... one group of sections per row/chapter, each with an emotion word in a comment ...
    { at: 20, block: 'OUTRO' },
  ];
  XY.SCORE = { bpm: 90, bars: 23, blocks: B, sections: S, special: { INTRO: 3, OUTRO: 4 } };

  // ---------------------------------------------------------------- lint (node lead-sheet-skeleton.js)
  if (typeof module !== 'undefined' && require.main === module) {
    const PC = { C: 0, 'C#': 1, Db: 1, D: 2, 'D#': 3, Eb: 3, E: 4, F: 5, 'F#': 6, Gb: 6, G: 7, 'G#': 8, Ab: 8, A: 9, 'A#': 10, Bb: 10, B: 11 };
    const midi = n => { const m = n.match(/^([A-G][#b]?)(-?\d)$/); return 12 * (+m[2] + 1) + PC[m[1]]; };
    const Q = { '': [0, 4, 7], m: [0, 3, 7], 7: [0, 4, 7, 10], m7: [0, 3, 7, 10], maj7: [0, 4, 7, 11], sus4: [0, 5, 7], sus2: [0, 2, 7], add9: [0, 4, 7, 2], madd9: [0, 3, 7, 2] };
    const pcs = sym => { const m = sym.split('/')[0].match(/^([A-G][#b]?)(.*)$/); return Q[m[2]].map(x => (PC[m[1]] + x) % 12); };
    let bad = 0;
    for (const [k, b] of Object.entries(B)) {
      if (b.bass && b.bass.length !== b.chords.length) { console.log('bass length', k); bad++; }
      for (const line of ['mel', 'melA', 'melB']) { if (!b[line]) continue; let t = 0;
        for (const [p, d] of b[line]) { if (p !== 'r' && (t % 4 === 0 || t % 4 === 2) && !pcs(b.chords[Math.floor(t / 4)]).includes(midi(p) % 12)) { console.log('non-chord tone on a strong beat:', k, line, 'bar', Math.floor(t / 4) + 1, p, 'over', b.chords[Math.floor(t / 4)]); bad++; } t += d; }
        if (t !== b.chords.length * 4) { console.log('melody length', k, line, t, 'beats, expected', b.chords.length * 4); bad++; } }
    }
    S.forEach((s, i) => { const next = i + 1 < S.length ? S[i + 1].at : XY.SCORE.bars + 1, len = next - s.at, blk = B[s.block];
      const want = blk ? blk.chords.length : XY.SCORE.special[s.block]; if (want !== len) { console.log('section at bar', s.at, s.block, 'is', want, 'bars but spans', len); bad++; } });
    console.log(bad ? `${bad} problem(s)` : 'lead sheet OK');
    process.exitCode = bad ? 1 : 0;
  }
})();
