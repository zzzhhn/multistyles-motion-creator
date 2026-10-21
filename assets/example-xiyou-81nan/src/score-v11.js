// score-v11.js — the v11 score as a lead sheet (data only; src/audio-v11.js renders it).
// Written by hand to fix what made v09/v10 "very bad": the music was re-planned every 5.33 s cell (the key estimate moved
// in 58 of 59 eight-second windows, repetition 0.67 vs 0.76–0.92 in the references). Here the music has its own form:
// one home key (D minor, F major as the bright relative, D major only in the finale), one chord per bar, 8-bar phrases
// that span four cells, a few blocks that come back, one era-coloured soloist per row of nine 难, and growth by adding
// layers. Blueprint: the outro the user liked (choir + strings, slow add9 chords, the D F G C motif in long notes).
//
// Grid: 90 BPM, 4/4, bar = 2.6667 s, bar 1 starts at t = 0. Every cell starts on a bar line.
// Notes: [pitch, beats]; 'r' = rest. Chords: one symbol per bar. Bass: one note per bar (whole note unless the renderer's
// pattern says otherwise). All melody notes on beats 1 and 3 are chord tones; passing notes sit on beats 2 and 4.
(() => {
  'use strict';
  const XY = window.XY;
  const B = {
    // L: the open loop i–VI–III–VII. melA: long notes for a soloist; melB: the same line a register up for violins.
    L: { chords: ['Dm', 'Bb', 'F', 'C'], bass: ['D2', 'Bb1', 'F2', 'C2'],
      melA: [['A4', 4], ['Bb4', 4], ['A4', 4], ['G4', 4]],
      melB: [['D5', 4], ['F5', 4], ['C5', 4], ['E5', 4]] },
    // T: the 取经 theme, built on the motif D F G C. Descending-fifths harmony, antecedent ends open on Bb, consequent on D.
    T: { chords: ['Gm/D', 'C', 'F', 'Bb', 'Gm/D', 'C', 'A7', 'Dm'], bass: ['D2', 'C2', 'F2', 'Bb1', 'D2', 'C2', 'A1', 'D2'],
      mel: [['D4', 1], ['F4', 1], ['G4', 2], ['C5', 3], ['A4', 1], ['A4', 3], ['G4', 1], ['F4', 2], ['D4', 2],
        ['D4', 1], ['F4', 1], ['G4', 2], ['C5', 1], ['D5', 1], ['E5', 2], ['E5', 2], ['C#5', 1], ['A4', 1], ['D5', 4]] },
    // S: sorrow. Slow, consonant, D pedal for four bars, one 4–3 suspension (D → C#) into the half cadence.
    S: { chords: ['Dm', 'Dm', 'Gm/D', 'Dm', 'Bb', 'Gm', 'Asus4', 'A'], bass: ['D2', 'D2', 'D2', 'D2', 'Bb1', 'G1', 'A1', 'A1'],
      mel: [['A3', 3], ['G3', 1], ['F3', 4], ['G3', 2], ['Bb3', 2], ['A3', 4], ['D4', 3], ['C4', 1], ['Bb3', 2], ['G3', 2], ['D4', 4], ['C#4', 4]] },
    // H: hope, in F major (the relative major): I – V6 – vi – IV – I64 – V – IV – V.
    H: { chords: ['F', 'C/E', 'Dm', 'Bb', 'F/C', 'C', 'Bb', 'C'], bass: ['F2', 'E2', 'D2', 'Bb1', 'C2', 'C2', 'Bb1', 'C2'],
      mel: [['A4', 2], ['C5', 2], ['G4', 4], ['F4', 2], ['A4', 2], ['D5', 4], ['C5', 3], ['A4', 1], ['G4', 2], ['E4', 2], ['F4', 2], ['D4', 2], ['E4', 2], ['G4', 2]] },
    // E: the driving block i–VII–VI–VII twice, long-note brass line over a string ostinato.
    E: { chords: ['Dm', 'C', 'Bb', 'C', 'Dm', 'C', 'Bb', 'C'], bass: ['D2', 'C2', 'Bb1', 'C2', 'D2', 'C2', 'Bb1', 'C2'],
      mel: [['D5', 4], ['E5', 3], ['C5', 1], ['D5', 4], ['C5', 2], ['E5', 2], ['F5', 4], ['E5', 4], ['D5', 2], ['F5', 2], ['E5', 4]] },
    // short joins
    CAD: { chords: ['Bb', 'C', 'Dm'], bass: ['Bb1', 'C2', 'D2'], mel: [['F4', 2], ['D4', 2], ['E4', 2], ['G4', 2], ['A4', 4]] },
    BA: { chords: ['Bb', 'A'], bass: ['Bb1', 'A1'], mel: [['D5', 4], ['C#5', 4]] },
    BC: { chords: ['Bb', 'C'], bass: ['Bb1', 'C2'], mel: [['F4', 4], ['E4', 4]] },
    END81: { chords: ['Gm', 'Asus4', 'A'], bass: ['G1', 'A1', 'A1'], mel: [['Bb4', 4], ['D5', 4], ['C#5', 4]] },
  };
  // Optional per-section fields: padOct (-1 = pad voiced an octave lower so a low solo stays the top voice), chipDb (chip arp level).
  // A section plays one block from bar `at` (absolute). mel: which line ('mel' | 'melA' | 'melB' | null), oct: transpose the
  // melody by octaves, lead: the melody instrument(s); layers: what plays under it; dyn: [start, end] level 1 (pp) … 8 (ff).
  // Layer vocabulary for the renderer:
  //   pad      sustained strings (violas + 2nd violins), close voicing C4–A4, no note doubling the melody in its octave
  //   choir    'oo' / 'ah' choir pad, same voicing rule as pad
  //   bass     celli + basses on the bass line (celli an octave above)
  //   arp      harp-style arpeggio, 8ths, chord tones only, pattern root-5th-8ve-10th-12th-10th-8ve-5th from the bass octave + 1
  //   zheng    same arpeggio on guzheng;   hpsd: same on harpsichord;   chip: same on a soft square wave (−6 dB, era colour)
  //   ost      string ostinato, 8ths, spiccato, pattern [1,1,5,1,8,5,1,5] in chord degrees, celli/violas, octave 3
  //   pizz     pizzicato on beats 1 and 3, root and fifth
  //   tremolo  violins tremolo on the pad voicing, one octave up
  //   timp     timpani on beat 1 of each bar, chord root (or fifth if the root is out of range)
  //   perc     timpani beats 1 and 3 + taiko on beat 1 + soft cymbal swell into every 4th bar
  //   horns    horns double the melody (unison) when listed in lead; when listed in layers: long-note pad on root + 5th
  //   bells    celesta/glock doubling only the first note of each bar of the melody, one octave up
  const S = [
    { at: 1, block: 'INTRO' },                                                                                // bars 1–3
    { at: 4, block: 'L', mel: null, layers: ['pad', 'arp', 'bass'], dyn: [2, 3] },                             // R1 wonder
    { at: 8, block: 'L', mel: 'melA', lead: ['xun'], layers: ['pad', 'arp', 'bass'], dyn: [3, 3] },
    { at: 12, block: 'T', mel: 'mel', lead: ['xun'], layers: ['pad', 'arp', 'bass'], dyn: [3, 4] },
    { at: 20, block: 'L', mel: 'melB', lead: ['violins'], layers: ['pad', 'arp', 'bass'], dyn: [4, 5] },
    { at: 24, block: 'H', mel: 'mel', lead: ['violins'], layers: ['pad', 'zheng', 'bass'], dyn: [4, 5] },     // R2 gathering
    { at: 32, block: 'T', mel: 'mel', oct: 1, lead: ['violins', 'violas8vb'], layers: ['pad', 'zheng', 'bass'], dyn: [5, 5] },
    { at: 40, block: 'BA', mel: 'mel', lead: ['violins'], layers: ['pad', 'bass', 'timp'], dyn: [5, 6] },
    { at: 42, block: 'L', mel: 'melA', oct: 1, lead: ['violinSolo'], layers: ['pad', 'hpsd', 'bass'], dyn: [3, 4] }, // R3 adventure
    { at: 46, block: 'L', mel: 'melB', lead: ['violins'], layers: ['pad', 'hpsd', 'bass'], dyn: [4, 5] },
    { at: 50, block: 'E', mel: 'mel', lead: ['horns'], layers: ['ost', 'pad', 'bass', 'timp'], dyn: [5, 6] },
    { at: 58, block: 'CAD', mel: 'mel', oct: 1, lead: ['violins'], layers: ['pad', 'bass', 'timp'], dyn: [6, 4] },
    { at: 61, block: 'E', mel: 'mel', lead: ['horns', 'violins'], layers: ['ost', 'pad', 'bass', 'perc'], dyn: [6, 7] }, // R4 struggle→triumph
    { at: 69, block: 'T', mel: 'mel', oct: 1, lead: ['violins', 'horns8vb'], layers: ['ost', 'choir', 'bass', 'perc'], dyn: [7, 8] },
    { at: 77, block: 'BA', mel: 'mel', lead: ['violins'], layers: ['pad', 'bass'], dyn: [6, 3] },
    { at: 79, block: 'S', mel: 'mel', lead: ['celloSolo'], layers: ['pad', 'bass'], padOct: -1, dyn: [2, 3] },             // R5 sorrow
    { at: 87, block: 'S', mel: 'mel', oct: 1, lead: ['violinSolo'], layers: ['pad', 'bass'], padOct: -1, dyn: [3, 3] },
    { at: 95, block: 'BA', mel: 'mel', lead: ['violinSolo'], layers: ['pad', 'bass'], padOct: -1, dyn: [3, 2] },
    { at: 97, block: 'L', mel: 'melA', lead: ['piano'], layers: ['pad', 'pizz', 'bass'], dyn: [3, 4] },       // R6 resolve (46 is 3 bars)
    { at: 101, block: 'L', mel: 'melB', lead: ['violins'], layers: ['pad', 'ost', 'bass'], dyn: [4, 5] },
    { at: 105, block: 'E', mel: 'mel', lead: ['horns'], layers: ['ost', 'pad', 'bass', 'perc'], dyn: [5, 7] },
    { at: 113, block: 'CAD', mel: 'mel', oct: 1, lead: ['violins'], layers: ['pad', 'bass', 'timp'], dyn: [6, 5] },
    { at: 116, block: 'E', mel: 'mel', lead: ['horns', 'violins'], layers: ['ost', 'choir', 'bass', 'perc'], dyn: [6, 7] }, // R7 perseverance
    { at: 124, block: 'T', mel: 'mel', oct: 1, lead: ['violins', 'horns8vb'], layers: ['ost', 'choir', 'bass', 'perc'], dyn: [7, 8] },
    { at: 132, block: 'BC', mel: 'mel', oct: 1, lead: ['violins'], layers: ['pad', 'bass'], dyn: [6, 4] },
    { at: 134, block: 'H', mel: 'mel', lead: ['piano'], layers: ['pizz', 'chip', 'bass'], chipDb: -8, dyn: [3, 4] },      // R8 lightness, F major
    { at: 142, block: 'H', mel: 'mel', oct: 1, lead: ['violins'], layers: ['pad', 'chip', 'bass', 'bells'], chipDb: -8, dyn: [4, 5] },
    { at: 150, block: 'BA', mel: 'mel', lead: ['violins'], layers: ['pad', 'bass', 'timp'], dyn: [5, 5] },
    { at: 152, block: 'L', mel: 'melB', lead: ['violins'], layers: ['tremolo', 'choir', 'bass', 'arp'], dyn: [5, 6] }, // R9 transcendence
    { at: 156, block: 'L', mel: 'melB', oct: 1, lead: ['violins', 'horns8vb'], layers: ['tremolo', 'choir', 'bass', 'timp'], dyn: [6, 7] },
    { at: 160, block: 'T', mel: 'mel', oct: 1, lead: ['violins', 'violas8vb', 'horns8vb'], layers: ['choir', 'ost', 'bass', 'perc'], dyn: [7, 8] },
    { at: 168, block: 'HOLD_DM', dyn: [8, 6] },   // bar 168 = the last bar of cell 80: Dm(add9) tutti, choir 'ah', the melody holds D5
    { at: 169, block: 'END81', mel: 'mel', lead: ['violins'], layers: ['pad', 'choir', 'bass'], dyn: [5, 5] },  // cell 81
    { at: 172, block: 'OUTRO' },                                                                               // bars 172–175, keep v10's finale
  ];
  XY.SCORE_V11 = { bpm: 90, bars: 175, blocks: B, sections: S,
    rowSoloists: { 1: 'xun', 2: 'guzheng (arp) + violins', 3: 'harpsichord (arp) + solo violin', 5: 'solo cello → solo violin', 6: 'piano', 8: 'piano + chip arp' } };
})();
