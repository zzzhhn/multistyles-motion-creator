# 中国民乐单音采样：检索、下载与核实报告

核查日期：2026-10-22（由 cn-samples 代理检索和下载，主代理代为落盘；正文按代理交接原样整理）。共 8 个库，417 MB。所有包只解压，没有运行任何程序，没有注册、登录、留邮箱或提交表单。根目录：`$AUDIO_TOOLS/samples-cn/`，下文路径相对于它。

## 结论

- 二胡：`aliexpress-erhu`，CC0 真人录音，长音、短奏、近指板三种奏法，D4 到 D6 半音齐全。
- 笛子：首选 `mdm-dizi`（作者自制 A 调竹笛，E4 到 A5 半音齐全，每音约 15 秒长音），授权依据是 Pianobook 条款，本机副本是作者本人传到 archive.org 的，授权链需用户确认。纯 CC0 备选 `oga-beixiao-cc0`（北箫，10 个音，作者说没调准）。
- 古筝：没有可用的古筝多采样。替代用 VCSL 的越南筝（Đàn Tranh），CC0，五声定弦 B C# D# F# G#，缺的音移调。
- 没有可用来源：琵琶、扬琴、编钟、云锣、堂鼓。打击乐用替代：乐队锣、木块代木鱼、镲。
- 笙：一段 CC0 高音笙半音阶录音（有损 OGG，每音约 0.4 秒），要自己切片。
- 埙：没有，可用 VCSL 陶笛近似。

## 按乐器的推荐

音名用科学音高记法（C4 = MIDI 60）。

| 乐器 | 库 | 路径 | 格式 | 音符数和音域 | 演奏法 | 授权和署名 |
|---|---|---|---|---|---|---|
| 二胡 | aliexpress-erhu（sfzinstruments） | `aliexpress-erhu/extracted/aliexpress-erhu-HEAD/` | SFZ + WAV 44.1k 24bit 立体声 | 长音 20 个半音 D4–A5 × 2 轮替；短奏同 20 音 × 4 轮替；近指板 25 个半音 D4–D6 × 2 轮替 | 长音、短奏、近指板；颤音是 SFZ 的合成效果 | CC0，无需署名 |
| 笛子 | MDM Dizi v1.1（Mića de Mijatović y Senić） | `mdm-dizi/extracted/MDM Dizi v1.1/` | SFZ + WAV 44.1k 24bit 立体声 | 18 个半音 E4–A5，单力度，每音约 15 秒 | 长音 | Pianobook 条款，建议署名 "MDM Dizi by Mića de Mijatović y Senić (Pianobook)" |
| 箫（笛子备选） | Raw Běixiāo Audio（pattingthestar） | `oga-beixiao-cc0/extracted/wav/` | WAV 32bit / FLAC 24bit 立体声 | 10 个音 C4 D4 E4 F4 G4 A4 B4 C#5 D#5 A5，每音 5–8 秒 | 长音 | CC0 |
| 古筝（替代） | VCSL Đàn Tranh | `vcsl-cc0/Chordophones/Zithers/Dan Tranh/` | WAV 24bit 单声道 | 16 个音高 B2–G#5，拨弦 mf/f/ff 三层 | 拨弦、揉弦、摇指、刮奏 | CC0 |
| 古筝（少量） | OLPC Lisa Lim | `olpc-lisalim/extracted/LisaLim44/koto-guzheng*.wav` | WAV 16bit 单声道 | 3 个单音 D2 A3 D4，加滑音、摇指各 1 条 | 拨弦、滑音、摇指 | CC BY 3.0，要署名；是不是古筝未核实 |
| 笙 | Commons "Soprano Sheng Chromatic Scale" | `commons-cc0-sheng-dizi/Soprano_Sheng_Chromatic_Scale.ogg` | OGG 单声道 | 一条 17 秒半音阶 G4–F#6 | 短音，要切片 | CC0 |
| 埙（替代） | VCSL Ocarina, Typical | `vcsl-cc0/Aerophones/Edge-blown Aerophones/Ocarina, Typical/Sustains/` | WAV 24bit 立体声 | Sus 11 个、SusVib 10 个，A4–C#6 | 长音、揉音长音 | CC0；比埙亮、音区偏高 |
| 锣 | VCSL Gong 1；OLPC Berklee gong_shot | `vcsl-cc0/Idiophones/Struck Idiophones/Gong 1/`；`olpc-berklee/Berklee44v1/gong_shot*.wav` | 16bit | VCSL 6 击 + 1 条刮奏；Berklee 3 击 | 敲击 | VCSL CC0；Berklee CC BY 3.0；都是乐队锣 |
| 木鱼（替代） | OLPC Berklee 有音高木块；VCSL Woodblock | `olpc-berklee/*/woodblock_pitched-*.wav`；`vcsl-cc0/Idiophones/Struck Idiophones/Woodblock/` | 16 / 24bit | Berklee 6 个音高；VCSL 10 击 | 敲击 | Berklee CC BY 3.0；VCSL CC0 |
| 钹（替代） | OLPC OpenPathMusic China 镲；VCSL Clash Cymbals 1/2 | `olpc-openpathmusic/OpenPathMusic44V1/cymbal-china-*.wav`；`vcsl-cc0/Idiophones/Struck Idiophones/Clash Cymbals 1/`、`2/` | 16bit | 2 击；对镲 15 击 | 敲击 | OpenPathMusic CC BY 3.0；VCSL CC0 |
| 编钟、云锣（替代） | OLPC Berklee templebell；VSCO-2 TubularBells、Glockenspiel | `olpc-berklee/Berklee44v1/templebell*.wav` | 16bit | 3 击 | 敲击 | CC BY 3.0 |
| 堂鼓、大鼓 | 没找到；VSCO-2 有 BDrumNew、LogDrum | `../vsco2/Percussion/` | | | | CC0，替代 |
| 琵琶、扬琴 | 没找到可用的 | | | | | |

## 音高校正（代理实测）

- 二胡：文件名八度比标准记法高一（`erhu_d5_*` 实际 D4，`erhu_a6_*` 实际 A5）；个别音偏高 20–40 音分；`05-erhu_sul_tasto.sfz` 里另写了 `tune=37`。
- 笛子：18 个音里 17 个偏高约 +40 音分（G#4 约 +17），渲染时整体降约 40 音分。
- VCSL 越南筝和陶笛：文件名八度比实际低一（`B1_ff_1` 实际 B2）。
- 北箫：`C#5` 文件实测 C5 +49 音分，`D#5` 实测 D5 +33，`A5` 实测 A5 −40，其余 ±20 以内。
- Lisa Lim：文件名数字约等于 MIDI 号减一（`D37` 实际 MIDI 38）。
- 笙：切片按约每 0.42 秒一个半音手动对齐。

## 授权原文和链接

1. aliexpress-erhu：仓库 LICENSE 为 CC0 1.0（"reuse and redistribute as freely as possible in any form whatsoever and for any purposes, including without limitation commercial purposes."）。readme："Samples of a cheap erhu bought from Aliexpress and played by someone who's more of a violinist. Close miked in stereo." https://github.com/sfzinstruments/aliexpress-erhu ，提交 6615047b2fd06126877483e97b8bb4af9d00b080。
2. VCSL：README "This collection is under a Creative Commons 0 license. Essentially it's Public Domain- you can do whatever you want with these sounds (even make commercial software), no royalties, no credit, no special terms." https://github.com/sgossner/VCSL ，提交 c1ea7bcc3c7309650ab0da9d15c9cd1fbc4a4c7e。
3. MDM Dizi：Pianobook FAQ "Yes, all sample packs uploaded to the Pianobook website should* be copyright free. By uploading the sample pack, the Samplist (uploader) agrees for the packs to be downloaded and used by members of the Pianobook Community on any commercial and non-commercial compositions." 同页 "It is forbidden to sell or redistribute the sample libraries that you do not own the copyright to (e.g. you are not the uploader)." EULA "All Pianobook Libraries should be copyright free, which means you have license to use them on commercial and non-commercial recordings and compositions you create." About "You don't need to join to use these samples, all we request is that you don't make commercial sample libraries out of them yourself." https://www.pianobook.co.uk/faq/ 、/terms-conditions/ 、/about/ 。本机副本来自 https://archive.org/details/mdm-dizi-v-1.1 （该页无授权字段，上传者邮箱与 SFZ 文件头作者邮箱一致）。摘录在 `mdm-dizi/_LICENSE_SOURCE.txt`。
4. 北箫："License(s): CC0"，"Work in progress audio of běixiāo, a Chinese flute. Audio is not properly tuned and some samples may be unstable sounding." https://opengameart.org/content/raw-b%C4%9Bixi%C4%81o-audio
5. OLPC 三组：archive.org 标 `licenseurl: http://creativecommons.org/licenses/by/3.0/`。Lisa Lim 描述 "Sound samples by Lisa Lim recorded for Richard Boulanger for use in the One Laptop per Child music library." https://archive.org/details/LisaLim ，/Berklee44v1，/Berklee44v12，/OpenPathMusic44V1；署名写法在各目录 `_LICENSE_SOURCE.txt`。
6. 高音笙：Commons 标 CC0，作者 User:S099001，"Own work"，描述「三十六簧高音笙吹奏半音階」。https://commons.wikimedia.org/wiki/File:Soprano_Sheng_Chromatic_Scale.ogg

## 不可用或只记录的来源

- Freesound（CC0，但下载原文件要登录，只记录）：Hypnotriod 的 C 调笛子全音域包 https://freesound.org/people/Hypnotriod/packs/21613/ ；tarane468 的二胡 https://freesound.org/people/tarane468/packs/26451/ 、/32043/ ；nanliu_music 的古筝单音 https://freesound.org/people/nanliu_music/sounds/847157/ ；spt3125 的伽倻琴 https://freesound.org/people/spt3125/packs/1534/ 。
- musical-artifacts.com："Dizi from Freesound"（id 1316）和 "Two GuZheng notes"（id 8920）标 Public Domain，下载被 Cloudflare 浏览器校验拦住；Mr Fuzzywump 的几个 SF2 标 CC BY 3.0 但样本来源不明，判不可用；Voice Erhu、LA Synthesis Er Hu、Casio SF2 不是真录音或标 copyright，不可用。
- Pianobook：Erhu（Finno Ugric Studio）、Pipa（Eamon）、ECHORDA 条款允许商用，但要账号才能下载。琵琶唯一线索在这里。
- Hugging Face ccmusic-database 各集：CC BY-NC-ND 4.0，不可用。
- Commons 其他：埙录音 CC BY-SA 3.0 且是乐句；笛子即兴乐句已删除。
- archive.org Carlos Carty 笛子 loop：loop，不适用。
- GitHub Cashhammn/Guzheng-sample、dreemachine/zhisizhu：无授权声明，不可用。
- OLPC Berklee "bamboo_*.wav"：已下载，不推荐（乐器不明）。

## 待决定

- 笛子用 MDM Dizi（接受 Pianobook 授权链）还是 CC0 北箫，或由用户登录 Freesound 取 Hypnotriod 的 CC0 笛子。
- 琵琶、古筝真采样要用户的 Pianobook 或 Freesound 账号。
- 用了 CC BY 3.0 的素材（Lisa Lim、Berklee、OpenPathMusic）要在片尾或简介署名。
