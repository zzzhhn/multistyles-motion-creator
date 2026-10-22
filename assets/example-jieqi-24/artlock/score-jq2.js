// score-jq2.js — 《二十四节气》 v2 score (data only; audio-jq2.js renders it with real samples). Written by hand.
// Concept: the five tones 宫商角徵羽 and the 《礼记·月令》 assignment of a tone to each season — spring 其音角, summer 其音徵,
// late summer (季夏, 中央土) 其音宫, autumn 其音商, winter 其音羽. Each season is a mode with its own final, and the key centre
// moves by 旋宫转调 (rotating the 宫 to a new pitch): spring and summer on 宫 = C, 季夏 on 宫 = F (up a fourth, the climax),
// autumn on 宫 = D (商 mode on E: no third, open and wistful), winter on 宫 = G (羽 mode on E: E minor pentatonic, cold);
// 冬至 turns to 宫 = C (一阳生: the first major sonority of winter); 小寒 and 大寒 are already spring's world, so 大寒 leads
// straight back into 立春 (the loop cut). Harmony stays inside each section's five pitches (no semitone clashes), voiced in
// open fifths and fourths; chords may change inside a bar ('@beat'). One phrase per term (3 bars = the three pentads);
// the shared motif 徵-羽-宫 (sol-la-do) opens each season in its own key.
// Grid: 90 BPM, 4/4, bar 1 at t = 0. Intro bars 1–4, term n = bars 5 + 3(n−1) … +2, outro 77–81 (216 s). Loop cut: bars 5–76.
// chords: one string per bar: 'BASS|v1 v2 v3' or two halves 'A1|E3 B3 D4 @2 E2|B2 E3 F#3'. mel / counter: [pitch, beats], 'r' = rest.
(() => {
  'use strict';
  const JQ = window.JQ = window.JQ || {};
  const GONG = { C: ['C', 'D', 'E', 'G', 'A'], F: ['F', 'G', 'A', 'C', 'D'], D: ['D', 'E', 'F#', 'A', 'B'], G: ['G', 'A', 'B', 'D', 'E'] };
  const S = [
    { name: 'INTRO', at: 1, gong: 'C', mode: '角', lead: ['dizi'], layers: ['drone', 'bells', 'zhengRun', 'pad'], dyn: [2, 3],
      chords: ['A1|E3 A3', 'A1|E3 G3 C4', 'G1|D3 G3 A3', 'D2|A2 E3 G3'],
      mel: [['r', 4], ['r', 4], ['r', 2], ['G4', 0.5], ['A4', 0.5], ['C5', 1], ['D5', 2], ['E5', 1], ['D5', 1]],
      extra: { zhengRun: [2, 3], swellInto: 5 } },
    // ---------------------------------------------------------------- spring · 角 (E), 宫 = C · dizi
    { name: '立春 雨水', at: 5, gong: 'C', mode: '角', lead: ['dizi'], layers: ['pad', 'zhengArp', 'bass'], dyn: [3, 4],
      chords: ['C2|G3 C4 D4', 'A1|E3 A3 C4', 'G1|D3 G3 A3', 'A1|E3 G3 C4', 'C2|G3 A3 D4', 'E2|A2 D3 G3'],
      mel: [['E5', 2], ['G5', 1], ['A5', 1], ['G5', 1.5], ['E5', 0.5], ['D5', 1], ['C5', 1], ['D5', 3], ['r', 1],
        ['G4', 0.5], ['A4', 0.5], ['C5', 1], ['D5', 2], ['E5', 1.5], ['G5', 0.5], ['E5', 1], ['D5', 1], ['E5', 4]] },
    { name: '惊蛰 春分', at: 11, gong: 'C', mode: '角', lead: ['dizi'], layers: ['pad', 'zhengArp', 'bass', 'wood'], dyn: [4, 5],
      chords: ['A1|E3 G3 C4', 'G1|D3 A3 C4', 'C2|G3 C4 D4', 'A1|E3 G3 C4', 'D2|A3 C4 E4', 'C2|G3 A3 E4'],
      mel: [['A5', 2], ['G5', 1], ['E5', 1], ['D5', 1], ['E5', 1], ['G5', 1], ['A5', 1], ['G5', 2], ['E5', 2],
        ['E5', 1], ['D5', 1], ['C5', 1], ['A4', 1], ['C5', 1.5], ['D5', 0.5], ['E5', 1], ['G5', 1], ['A5', 2], ['G5', 1], ['E5', 1]],
      extra: { timpRoll: [[13, 0, 2], [16, 0, 2]] } },                 // 惊蛰 thunder, 春分 lightning: rolls into the impacts
    { name: '清明 谷雨', at: 17, gong: 'C', mode: '角', lead: ['dizi', 'violins8vb'], layers: ['pad', 'zhengArp', 'bass', 'bells'], dyn: [4, 4],
      chords: ['C2|G3 C4 D4', 'A1|E3 A3 C4', 'G1|D3 G3 A3', 'A1|E3 G3 C4', 'C2|G3 A3 D4', 'E2|A2 D3 G3 @2 C2|G3 C4 E4'],
      mel: [['E5', 2], ['G5', 1], ['A5', 1], ['G5', 1.5], ['E5', 0.5], ['D5', 1], ['C5', 1], ['D5', 2], ['C5', 1], ['D5', 1],
        ['G4', 0.5], ['A4', 0.5], ['C5', 2], ['D5', 1], ['E5', 1.5], ['G5', 0.5], ['E5', 1], ['D5', 1], ['C5', 1], ['D5', 1], ['E5', 2]] },
    // ---------------------------------------------------------------- summer · 徵 (G), 宫 = C · guzheng (摇指 on long notes)
    { name: '立夏 小满', at: 23, gong: 'C', mode: '徵', lead: ['zheng'], layers: ['pizz', 'wood', 'pad', 'bass'], dyn: [4, 5],
      chords: ['G1|D3 A3 C4', 'C2|G3 D4 E4', 'D2|A3 C4 E4', 'G1|D3 G3 A3', 'A1|E3 G3 C4', 'G1|D3 E3 A3'],
      mel: [['G4', 0.5], ['A4', 0.5], ['C5', 0.5], ['D5', 0.5], ['E5', 1], ['D5', 1], ['C5', 1], ['A4', 1], ['G4', 1], ['A4', 1],
        ['C5', 1.5], ['D5', 0.5], ['G4', 2], ['G4', 0.5], ['A4', 0.5], ['C5', 0.5], ['D5', 0.5], ['E5', 1], ['G5', 1],
        ['A5', 1], ['G5', 1], ['E5', 1], ['D5', 1], ['E5', 1], ['D5', 1], ['G5', 2]] },
    { name: '芒种', at: 29, gong: 'C', mode: '徵', lead: ['dizi', 'zheng'], layers: ['ost', 'drum', 'pad', 'bass'], dyn: [5, 6],
      chords: ['C2|G3 C4 D4', 'A1|E3 G3 C4', 'D2|A3 C4 E4'],
      mel: [['D5', 1], ['E5', 1], ['G5', 1], ['A5', 1], ['G5', 0.5], ['E5', 0.5], ['D5', 1], ['E5', 1], ['G5', 1], ['A5', 2], ['G5', 2]] },
    { name: '夏至', at: 32, gong: 'C', mode: '徵', lead: ['zheng'], layers: ['pad', 'zhengArp', 'bass'], dyn: [4, 4],
      chords: ['C2|G3 A3 D4', 'D2|A3 C4 E4', 'G1|D3 G3 A3'],
      mel: [['E5', 2], ['D5', 1], ['C5', 1], ['D5', 1.5], ['E5', 0.5], ['D5', 1], ['A4', 1], ['G4', 4]] },
    // ---------------------------------------------------------------- 季夏 · 宫 (F), 宫 = F · the climax, then a summer night
    { name: '小暑', at: 35, gong: 'F', mode: '宫', lead: ['violins', 'dizi'], layers: ['trem', 'zhengArp', 'drum', 'bass'], dyn: [6, 6],
      chords: ['F1|C3 G3 A3', 'D2|A3 C4 F4', 'F1|C3 G3 A3 @2 C2|G3 A3 D4'],
      mel: [['C5', 0.5], ['D5', 0.5], ['F5', 2], ['G5', 1], ['A5', 1.5], ['G5', 0.5], ['F5', 1], ['D5', 1], ['C5', 1], ['D5', 1], ['F5', 2]],
      extra: { gongHit: [35] } },
    { name: '大暑', at: 38, gong: 'F', mode: '宫', lead: ['dizi'], layers: ['pad', 'glints', 'bass'], dyn: [4, 5],
      chords: ['D2|A3 C4 F4', 'G1|D3 A3 C4', 'D2|A3 C4 G4'],
      mel: [['A4', 2], ['C5', 1], ['D5', 1], ['F5', 3], ['D5', 1], ['C5', 2], ['A4', 2]],
      extra: { trem: [40], timpRoll: [[40, 0, 4]] } },                  // 大雨时行: the rain bar swells into 立秋
    // ---------------------------------------------------------------- autumn · 商 (E), 宫 = D · erhu
    { name: '立秋 处暑', at: 41, gong: 'D', mode: '商', lead: ['erhu'], layers: ['pad', 'zhengArp', 'bass'], dyn: [4, 4],
      chords: ['E2|B2 D3 F#3', 'A1|E3 B3 D4', 'B1|F#2 A2 E3', 'D2|A2 E3 F#3', 'B1|F#2 D3 A3', 'A1|E3 B3 D4 @2 E2|B2 E3 F#3'],
      mel: [['B4', 2], ['A4', 1], ['F#4', 1], ['E4', 2], ['F#4', 1], ['A4', 1], ['B4', 3], ['r', 1],
        ['D5', 1], ['B4', 1], ['A4', 1], ['B4', 1], ['D5', 1.5], ['E5', 0.5], ['D5', 1], ['B4', 1], ['A4', 1], ['B4', 1], ['E4', 2]],
      extra: { wood: [44, 45, 46], drum: [44, 45, 46] } },              // 处暑: the threshing floor's work rhythm
    { name: '白露 秋分', at: 47, gong: 'D', mode: '商', lead: ['erhu'], counterLead: 'dizi', layers: ['pad', 'pizz', 'bass'], dyn: [4, 5],
      chords: ['E2|B2 F#3 A3', 'D2|A2 E3 B3', 'B1|F#2 D3 A3', 'D2|A2 E3 F#3', 'B1|F#2 A2 D3', 'E2|B2 F#3 A3'],
      mel: [['E5', 2], ['F#5', 1], ['E5', 1], ['A4', 1], ['B4', 1], ['D5', 2], ['D5', 2], ['E5', 2],
        ['F#5', 2], ['E5', 1], ['D5', 1], ['B4', 1], ['A4', 1], ['B4', 1], ['D5', 1], ['E5', 4]],
      counter: [['r', 4], ['r', 2], ['A5', 1], ['F#5', 1], ['A5', 2], ['F#5', 2], ['r', 4], ['r', 2], ['F#5', 1], ['A5', 1], ['B4', 2], ['A4', 2]] },
    { name: '寒露 霜降', at: 53, gong: 'D', mode: '商', lead: ['erhu'], layers: ['pad', 'bass'], dyn: [4, 2],
      chords: ['E2|B2 D3 F#3', 'A1|E2 B2 D3', 'B1|F#2 A2 E3', 'D2|A2 E3 F#3', 'B1|F#2 D3 E3', 'E2|B2 E3 F#3'],
      mel: [['B4', 2], ['A4', 1], ['F#4', 1], ['E4', 1], ['F#4', 1], ['A4', 2], ['B4', 3], ['A4', 1],
        ['D5', 2], ['B4', 1], ['A4', 1], ['F#4', 1], ['E4', 1], ['D4', 2], ['E4', 4]] },
    // ---------------------------------------------------------------- winter · 羽 (E), 宫 = G · 箫 (xiao)
    { name: '立冬 小雪', at: 59, gong: 'G', mode: '羽', lead: ['xiao'], layers: ['pad', 'bells', 'bass'], dyn: [2, 2],
      chords: ['E2|B2 D3 G3', 'A1|E2 B2 D3', 'E2|B2 D3 G3', 'D2|A2 E3 G3', 'G1|D3 A3 B3', 'E2|B2 E3 G3'],
      mel: [['E4', 2], ['G4', 1], ['A4', 1], ['B4', 3], ['A4', 1], ['G4', 2], ['E4', 2],
        ['D4', 1], ['E4', 1], ['G4', 2], ['B4', 2], ['A4', 2], ['E4', 4]] },
    { name: '大雪', at: 65, gong: 'G', mode: '羽', lead: ['xiao'], layers: ['drone', 'bells'], dyn: [2, 2],
      chords: ['E2|B2 E3', 'A1|E2 A2', 'E2|B2 E3'],
      mel: [['B4', 4], ['A4', 2], ['G4', 2], ['E4', 4]] },
    { name: '冬至', at: 68, gong: 'C', mode: '宫', lead: ['xiao'], layers: ['pad', 'bells', 'bass'], dyn: [2, 5],    // 一阳生
      chords: ['C2|G3 C4 E4', 'A1|E3 A3 C4 @2 G1|D3 G3 A3', 'C2|G3 D4 E4'],
      mel: [['E4', 2], ['G4', 2], ['G4', 1], ['A4', 1], ['C5', 2], ['D5', 2], ['C5', 2]] },
    { name: '小寒', at: 71, gong: 'C', mode: '角', lead: ['dizi'], layers: ['pad', 'zhengArp', 'bass'], dyn: [3, 3],
      chords: ['C2|G3 C4 D4', 'A1|E3 A3 C4', 'G1|D3 G3 A3'],
      mel: [['E5', 2], ['G5', 1], ['A5', 1], ['G5', 1.5], ['E5', 0.5], ['D5', 1], ['C5', 1], ['D5', 4]] },
    { name: '大寒', at: 74, gong: 'C', mode: '角', lead: ['dizi'], layers: ['trem', 'bass'], dyn: [3, 5],
      chords: ['A1|E3 A3 C4', 'G1|D3 A3 C4', 'D2|A2 E3 G3'],
      mel: [['A4', 4], ['C5', 2], ['D5', 2], ['E5', 2], ['D5', 2]],
      extra: { timpRoll: [[76, 2, 4]] } },                               // the ice locks; resolves into 立春's C (loop) or the outro
    { name: 'OUTRO', at: 77, gong: 'C', mode: '角', lead: ['dizi'], layers: ['pad', 'zhengArp', 'bells', 'bass'], dyn: [4, 2],
      chords: ['C2|G3 C4 D4', 'A1|E3 A3 C4', 'G1|D3 G3 A3', 'D2|A2 E3 G3', 'E2|B2 E3 A3 D4'],
      mel: [['E5', 2], ['G5', 1], ['A5', 1], ['G5', 2], ['E5', 2], ['D5', 2], ['C5', 2], ['D5', 4], ['E5', 4]] },
  ];
  JQ.SCORE2 = { bpm: 90, bars: 81, loopBars: [5, 76], gong: GONG, sections: S,
    ranges: { dizi: ['E4', 'A5'], erhu: ['D4', 'D6'], xiao: ['D4', 'D5'], zheng: ['B2', 'A5'], violins: ['G3', 'A6'], violins8vb: ['G3', 'A6'] } };
})();
