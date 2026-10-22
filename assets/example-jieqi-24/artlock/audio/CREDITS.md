# 《二十四节气》 soundtrack v2 · sample credits

Files: `jq2-full.wav` (216 s) and `jq2-loop.wav` (192 s), rendered offline from `artlock/score-jq2.js` by `tools/render-score2.sh`.
Licences and pitch corrections were checked in `refs/samples-cn-REPORT.md` (2026-10-22). No CC BY sample is used, so no attribution is legally required; the lines below are given anyway.

| Instrument in the score | Library | Licence | Attribution line |
|---|---|---|---|
| dizi (spring lead, 芒种 / 大暑 / 小寒 / 大寒 / outro, the doubling in 小暑, the counter line in 白露 秋分) | MDM Dizi v1.1 by Mića de Mijatović y Senić (Pianobook), local copy from the author's archive.org upload | Pianobook terms: free to use in commercial and non-commercial compositions and recordings; resale or redistribution of the samples themselves is forbidden | "MDM Dizi by Mića de Mijatović y Senić (Pianobook)" |
| erhu (autumn lead) | aliexpress-erhu, sfzinstruments (commit 6615047b) | CC0 1.0 | "Erhu samples: sfzinstruments/aliexpress-erhu (CC0)" |
| xiao 北箫 (winter lead) | Raw Běixiāo Audio by pattingthestar (OpenGameArt) | CC0 | "Běixiāo samples: pattingthestar, OpenGameArt (CC0)" |
| guzheng (summer lead, arpeggios, the intro run) | VCSL, Đàn Tranh (Vietnamese zither, standing in for the guzheng), Sam Gossner (commit c1ea7bcc) | CC0 1.0 | "Versilian Community Sample Library (CC0)" |
| gong, woodblock (木鱼 substitute) | VCSL, Gong 1 and Woodblock | CC0 1.0 | "Versilian Community Sample Library (CC0)" |
| strings (pad, bass, drone, pizzicato, spiccato ostinato, tremolo, the violins lead in 小暑), glockenspiel, tubular bells, timpani rolls, bass drum (堂鼓 substitute), suspended cymbal | VSCO-2 Community Edition, Versilian Studios | CC0 1.0 | "Versilian Studios Chamber Orchestra 2 CE (CC0)" |

Software: sfizz (pysfizz) plays the VSCO-2 SFZ instruments; the hall is Faust `re.jpverb` from faustlibraries (MIT) through faustwasm.

Open point carried over from REPORT.md: the MDM Dizi copy came from the author's own archive.org upload, which has no licence field (the uploader's e-mail matches the SFZ header). The Pianobook terms quoted in `samples-cn/mdm-dizi/_LICENSE_SOURCE.txt` apply to the pack; the user has to confirm that licence chain before publication. The CC0 fallback would be the Běixiāo samples.
