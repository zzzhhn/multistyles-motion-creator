---
name: multistyles-motion-creator
description: This skill should be used when producing a code-rendered video (HTML Canvas or WebGL, deterministic frame-by-frame, exported to MP4) that strings many short units into one continuous film with a different art style per unit, for example 81 tribulations in 81 styles, an art-history speedrun, "a character through N art styles", one style per era, chapter or episode, gallery-wall or long-scroll crossing films. It covers reference teardown, the unit bible, a reusable engine (timeline, camera, rigged characters, cast continuity, hit push-ins), multi-agent fan-out of units, the per-unit quality bar, lead-sheet-first film scoring, light review, 2K60 export, 9:16 and 1:1 cuts, and the pitfalls already paid for. Chinese triggers include 多风格串联视频、一格一画风、N 种画风、画风穿越、艺术史速通、代码做视频、动效视频、八十一难式长片.
---

# 多风格串联代码动画（multistyles-motion-creator）

一支片子里串很多个「小单元」，每个单元一种画风，镜头和角色把它们连成一条连续的长片；画面和配乐全部由代码逐帧生成，导出 MP4。本 skill 来自《八十一难》（《西游记》九九八十一难、81 种画风、7 分 47 秒、2560×1440@60）从调研到定稿的完整过程，用户最终认可的是 v11。如果本机有设计类总路由 skill（作者本机是 `integrate-design`），视觉类任务先过它；本 skill 是它下游的视频生产流程。

完整可运行的示例工程在 `assets/example-xiyou-81nan/`（引擎、81 个画风文件、配乐、工具、各队日志、审片报告），复制过去就能改。

## 先读：用户验收口径（都是用户亲口提过的，优先于本文其余内容）

1. **每个单元要讲清那一段的具体情节**，熟悉原作的观众 1 秒内认得出是哪一段；每个单元有一个让人想截图的记忆点。
2. **画面要丰富，不能简朴**：三层景深、画风自己的媒介质感和装饰系统、2 到 4 个循环小动作；师徒（主角）用本单元画风的「笔」画出来，但识别符不能丢。
3. **单元时长要够看清**：讲故事的单元 5 到 6 秒（《八十一难》v09 每格 2.5 秒被评太短，v10 起 5.33 秒，关键单元 8 秒）。纯炫画风、不讲情节的速通片才用 1 到 2.5 秒。
4. **画风和内容不能出戏**：只借画风的视觉语言（材质、线条、色彩、构图逻辑、装饰、字体），不借画风原有的题材。用户原例：古埃及画风没问题，画面里出现古埃及神明就出戏。
5. **要有画面张力和抓眼球的动作**：大小、速度、明暗、方向的对比，局部推近，关键物件不小于 80 设计像素。
6. **配乐要有自己的曲式**：不能一个旋律换配器重复几十次，也不能跟着每个单元重写和声；以用户认可过的片段为蓝本，主线亲手写 lead sheet，子代理只渲染。详见 `references/06-music.md`，这是本次代价最大的一课。
7. **审片要轻**：新版出来后最多派一个代理粗看，主要靠用户自己看成片给意见。

## 流程（每步的细节在对应 reference）

| 步 | 做什么 | 产物 | 读 |
|---|---|---|---|
| 0 | 开工检查：资源（内存、swap、磁盘、已开的 headless Chrome）、项目目录独占（别的 agent 可能也在写同一个目录）、整体估时报给用户 | 独占的工程目录 | `08-pitfalls.md` 第一节 |
| 1 | 参考调研与拆解：扒参考片、出接触表、判断骨架类型、量配乐结构 | `refs/`、拆解笔记 | `01-research.md` |
| 2 | 总表：单元清单（编号、名目、画风、情节、框内字、拍数、配器），按原作逐条核对情节 | `BIBLE.md`、`src/cells.js` | `02-bible.md`、`templates/bible-row.md` |
| 3 | 引擎与原型：复制示例工程，改单元数据和角色；先做最难的 3 到 5 个单元和一个角色 demo 网页 | 原型 MP4、`rig-demo.html` | `03-engine.md` |
| 4 | **用户关卡**：原型方向、角色造型和步态 | 用户意见 | |
| 5 | 分队铺开：写单元标准和队伍简报，按 9 个一组派 Opus 子代理；主线做协调和引擎 | 全部单元 | `04-unit-standard.md`、`05-team-fanout.md`、`templates/` |
| 6 | 配乐：主线写 lead sheet，子代理渲染；先出带画面的 45 到 60 秒小样 | `score-*.js`、小样 | `06-music.md` |
| 7 | 整合、导出粗剪，交用户 eyeball；按意见迭代（再次铺给各队，用 SendMessage 续用原队伍） | 粗剪 | `07-review-delivery.md` |
| 8 | 轻量审片：一个代理，最多 10 条硬伤 | `qa/review/light.md` | `07-review-delivery.md` |
| 9 | 定稿导出、平台版、转发用压缩版、清理旧版 | `out/` | `07-review-delivery.md` |

## 硬规则

- **每一帧只由时间 t 决定。** 不用 `Math.random`、`Date`、`performance` 做画面或音乐决定；随机用种子。同一 t 渲染两次逐像素一致。
- **子代理用最强的模型**（作者的规则是显式 `model: "opus"`），简报写清目标、输入、唯一可写文件、约束、验证和停点（作者本机用 `delegation-brief` 格式，没有就照 `templates/TEAM_BRIEF.md`）。每次 Write 或 Edit 不超过 150 行（整文件一次写会撞输出上限、全部丢失）。
- **改共享引擎文件后立刻 `node --check`，再出一帧确认**，然后广播给在做的队伍。改坏 `rig.js` 一分钟会让所有队的检查都失败。
- **导出前对全部源文件跑 `node --check`**；有队伍正写到一半时等它恢复再导。`film.js` 已对每个单元做了容错，坏掉的单元退回占位格，不会拖垮整帧。
- **改音乐不重导画面**：画面母版导一次，换音轨用 `ffmpeg -c:v copy`，几十秒出新版。
- **对外动作**（推送、发帖、调用会写外部服务的接口、装第三方 skill 或钩子）先问用户。下载参考片、只读克隆参考仓库可以直接做。

## 资源

- `references/01-research.md`：参考扒取（X 用 fxtwitter）、接触表和逐帧差分、四种骨架、从参考片学到的具体做法。
- `references/02-bible.md`：单元总表、原作核对、画风排序与分族、时间网格。
- `references/03-engine.md`：示例引擎架构和所有接口合约（单元 style、角色 rig、cast、acts、锚点、hits、thumb、缓存、平台版）以及移植到新题材要改哪些地方。
- `references/04-unit-standard.md`：每个单元的制作标准，可直接改写成新项目的 `CELL_GUIDE.md`。
- `references/05-team-fanout.md`：分队方式、协调节奏、广播模板、整合检查、常见失败。
- `references/06-music.md`：配乐方法（三版的对比、lead sheet 格式、渲染规则、测量的坑）。
- `references/07-review-delivery.md`：轻量审片、导出、平台版、压缩版、换音轨、清理。
- `references/08-pitfalls.md`：已经踩过的技术坑。
- `references/case-xiyou-81nan.md`：本次案例的时间线、数字和用户每次的原话。
- `templates/`：`TEAM_BRIEF.md`、`REVIEW_BRIEF-light.md`、`MUSIC_RENDERER_BRIEF.md`、`bible-row.md`、`lead-sheet-skeleton.js`。
- `scripts/`：`fetch_x.py`（扒 X 帖子和视频）、`contact_sheet.sh`（带时间码的接触表）、`musicmap.py`（配乐结构：响度弧、调性区域、重复度）、`framediff.py`、`onsets.py`、`tile.py`、`fontprobe.cjs`（headless Chrome 里哪些字体可用）、`new_project.sh`（从示例工程起一个新项目）。
- `assets/example-xiyou-81nan/`：可运行的完整示例。`src/film.html` 是主片，`src/platform.html?profile=9x16|1x1` 是平台版，`src/rig-demo.html` 是角色 demo；工具在 `tools/`。

相关 skill：作曲库 `music-composition-skills`（ https://github.com/jtydhr88/music-composition-skills ，装好后是一组 `mc-*` skill），写 lead sheet 前查和声、配器、曲式。花叔的 `huashu-art-motion`（ https://github.com/alchaincyf/huashu-art-motion ，风格配方卡、拆解方法）只作只读参考，本次没有安装、没有运行它的脚本，要用先问用户。
