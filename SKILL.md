---
name: multistyles-motion-creator
description: This skill should be used when producing a code-rendered video (HTML Canvas or WebGL, deterministic frame-by-frame, exported to MP4) that strings many short units into one continuous film with a different art style per unit, for example 81 tribulations in 81 styles, the 24 solar terms of one village in 24 styles, an art-history speedrun, "a character through N art styles", one style per era, chapter or episode, gallery-wall or fixed-place films. It covers topic choice, reference teardown, the unit bible, an Art Lock page to pick styles by eye, two reusable engines (gallery wall with rigged characters; fixed place with a story track, phenomenon transitions, engine-level title cards and a sundial intro), multi-agent fan-out in rounds, the per-unit quality bar, lead-sheet-first film scoring with modal writing and real instrument samples, light review with a frame-jump scan, 2K60 export, loop, 9:16 and 1:1 cuts, an error analysis of everything that went wrong, and publishing hygiene. Chinese triggers include 多风格串联视频、一格一画风、N 种画风、画风穿越、艺术史速通、代码做视频、动效视频、八十一难式长片、二十四节气、同一处过一年.
---

# 多风格串联代码动画（multistyles-motion-creator）

一支片子里串很多个「小单元」，每个单元一种画风，主体和镜头把它们连成一条连续的长片；画面和配乐全部由代码编写，画面逐帧渲染，导出 MP4。本 skill 来自两部做完的片子：
- 《八十一难》：《西游记》九九八十一难，81 种画风，画廊墙横移，7 分 47 秒，用户认可的是 v11；
- 《二十四节气》：同一个村口过一年，24 种画风，一家人按农时过一年，3 分 36 秒，v2 被用户评「这轮做的视频的质量又更好了」。

两部都在 2560×1440@60。如果本机有设计类总路由 skill（作者本机是 `integrate-design`），视觉类任务先过它；本 skill 是它下游的视频生产流程。

两个完整可运行的示例：
- `assets/example-xiyou-81nan/`：画廊墙骨架，角色骨骼，81 个画风，lead sheet 合成配乐；
- `assets/example-jieqi-24/`：同一处骨架，故事轨，现象过渡，标题卡，日晷片头，Art Lock 页，24 个画风，五音调式谱面和采样渲染管线。

起新项目用 `scripts/new_project.sh <目录> [xiyou|jieqi]`。**开工前先读 `references/11-error-analysis.md`**：两部片子里用户才发现的结构问题，都列了防法。

## 先读：用户验收口径（都是用户亲口提过的，优先于本文其余内容）

1. **每个单元要讲清那一段的具体情节**，熟悉原作的观众 1 秒内认得出是哪一段；每个单元有一个让人想截图的记忆点。
2. **画面要丰富，不能简朴**：三层景深、画风自己的媒介质感和装饰系统、2 到 4 个循环小动作；主体用本单元画风的笔法画出来，但识别符不能丢。
3. **单元时长要够看清**：讲故事的单元 5 到 8 秒（《八十一难》每格 2.5 秒被评太短；《二十四节气》每格 8 秒，一个子事件一小节）。纯炫画风、不讲情节的速通片才用 1 到 2.5 秒。
4. **画风和内容不能出戏，画风要贴主题**：只借画风的视觉语言，不借画风原有的题材（古埃及画风里出现埃及神明就出戏）；主题有文化归属时，默认用这个文化自己的画风（节气 v1 的日式画风被评「和主题的关联性有点弱」）。
5. **要有画面张力和抓眼球的动作**：大小、速度、明暗、方向的对比，局部推近，关键物件不小于 80 设计像素。
6. **要有故事感**：贯穿全片的主体在每个单元做事、身上有变化（衣服、道具、成长），换画风时它在原地；单元之间的过渡有内容上的理由（节气 v1 被评「故事感不强」）。见 `references/10-story.md`。
7. **单元的名字在任何画风上都要醒目**：由引擎统一画标题卡，不交给各画风自己写。
8. **配乐要有自己的曲式，每段听得出不同**：不能一个旋律换配器重复，也不能跟着每个单元重写和声；每段有自己的调式和主题（节气按《礼记·月令》配五音）；带文化身份的独奏乐器用真实采样（合成的笛子、二胡被评「不够 authentic & identical」）。见 `references/06-music.md`。
9. **画风先看图再拍板**：用户看文字判断不了画风，先出 Art Lock 页。
10. **审片要轻**：新版出来后最多派一个代理粗看，主要靠用户自己看成片给意见。

## 流程（每步的细节在对应 reference）

| 步 | 做什么 | 产物 | 读 |
|---|---|---|---|
| 0 | 开工检查：资源（内存、swap、磁盘、已开的 headless Chrome）、项目目录独占、整体估时报给用户；读错误分析 | 独占的工程目录 | `11-error-analysis.md`、`08-pitfalls.md` |
| 1 | 选题（用户要再做一部时）和参考调研：扒参考片、接触表、判断骨架、量配乐结构 | `refs/`、拆解笔记 | `02-bible.md` 选题节、`01-research.md` |
| 2 | 总表加故事轨：单元清单（编号、名目、画风、情节、记忆点、框内字、时长、配器）**和**每单元主体做什么、地面状态、由什么现象过渡；按原作逐条核对；画风按主题的文化归属筛 | `BIBLE.md` 或 `terms.js`、`storydata*.js` | `02-bible.md`、`10-story.md`、`templates/bible-row.md` |
| 3 | **Art Lock（用户关卡）**：用真实管线给每个单元渲一张同构图样图（主体按故事轨那一刻的状态画），网页上逐张锁定／待改／换掉并导出意见 | `artlock/index.html` | `09-art-lock.md`、`templates/ARTLOCK_BRIEF.md` |
| 4 | 引擎与原型：复制示例工程；画廊墙骨架先做 3 到 5 个最难单元和角色 demo，同一处骨架先跑通故事轨（`storycheck`、`castsheet`）、过渡、标题卡、片头 | 原型 MP4 或静帧 | `03-engine.md` |
| 5 | **配乐小样（用户关卡）**：主线写谱面（调式、主题、曲式），查采样和授权，渲染代理出带画面的 45 到 60 秒小样（每段一个）给用户听，用户点头再铺满。用户授权直接做完时，交付时仍附每段的试听片段并说明「这一项没经过你的耳朵」 | 谱面、小样 | `06-music.md`、`templates/SAMPLE_RESEARCH_BRIEF.md`、`templates/MUSIC_RENDERER_BRIEF-samples.md` |
| 6 | 分队铺开：同一批队伍分轮续跑（样图、改画风、扩成单元、接故事轨），主线写引擎、谱面、故事数据并统一处理各队提的故事问题 | 全部单元 | `04-unit-standard.md`、`05-team-fanout.md`、`templates/` |
| 7 | 整合、导出粗剪，按结构清单自查，交用户看；按意见迭代 | 粗剪 | `07-review-delivery.md`、`11-error-analysis.md` 第六节 |
| 8 | 轻量审片：一个代理加全片帧差扫描，最多 10 条硬伤，修完再扫 | `qa/review/light.md` | `07-review-delivery.md`、`templates/REVIEW_BRIEF-light.md` |
| 9 | 定稿导出主版、循环版、竖版、方版和转发压缩版；旧版先挪走，用户认可后清理 | `out/` | `07-review-delivery.md` |
| 10 | 用户要求时，把新流程和教训写回本 skill，脱敏后更新仓库 | 本 skill | `07-review-delivery.md` 脱敏节 |

## 硬规则

- **每一帧只由时间 t 决定。** 不用 `Math.random`、`Date`、`performance` 做画面或音乐决定；随机用种子。同一 t 渲染两次逐像素一致。
- **主体由引擎统一计算，画风只负责怎么画**（同一处骨架）：位置、动作、衣服、道具、成长是全片时间的函数；换画风时主体原地不动；故事数据只由主线改，改完跑 `storycheck`。
- **子代理用最强的模型**（作者的规则是显式 `model: "opus"`），简报写清目标、输入、唯一可写文件、约束、验证和停点（作者本机用 `delegation-brief` 格式，没有就照 `templates/`）。每次 Write 或 Edit 不超过 150 行；每次 Read 只读一张图；同时只跑一个浏览器工具命令。
- **改共享引擎文件后立刻 `node --check`，再出一帧确认**，然后广播给在做的队伍。
- **导出前对全部源文件跑 `node --check`**；页面对每个单元做容错，坏掉的单元退回占位格。
- **平台页和主片页用同一份脚本列表**（生成或同步，不手抄）；导出后四个版本都测响度，确认有音轨。
- **改音乐不重导画面**：画面母版导一次，换音轨用 `ffmpeg -c:v copy`；采样配乐一条命令重建、确定性。
- **对外动作**（推送、发帖、调用会写外部服务的接口、装第三方 skill 或钩子）先问用户；下载参考片、只读克隆参考仓库、下载授权核实过的采样可以直接做。
- **采样先核实授权再用**：只用允许公开发布和商业化的（CC0、CC-BY 记署名、条款明确允许作品使用的）；采样本身和渲染出的音频不进公开仓库。

## 资源

- `references/01-research.md`：参考扒取、接触表和逐帧差分、四种骨架、从参考片学到的做法。
- `references/02-bible.md`：选题标准、单元总表、原作核对、画风选择（文化关联）与分族、时间网格。
- `references/03-engine.md`：两套引擎的架构、接口合约、工具、移植清单（画廊墙；同一处加故事轨、过渡、标题、片头）。
- `references/04-unit-standard.md`：单元制作标准（画廊墙单元；节拍对齐的三段式单元）。
- `references/05-team-fanout.md`：分队方式、协调节奏、多轮续跑、整合检查、常见失败。
- `references/06-music.md`：配乐两课（lead sheet 和独立曲式；五音调式、真实采样、采样渲染管线）。
- `references/07-review-delivery.md`：轻量审片、帧差扫描、导出、平台版、压缩版、清理、公开仓库脱敏清单。
- `references/08-pitfalls.md`：已经踩过的技术坑。
- `references/09-art-lock.md`：Art Lock 页怎么做和两轮的经验。
- `references/10-story.md`：故事轨（主体状态是时间的函数）、检查和预览、现象过渡、标题卡、地面状态。
- `references/11-error-analysis.md`：两部片子里所有问题的发现者、根因、防法，以及开工前的结构清单。
- `references/case-xiyou-81nan.md`、`references/case-jieqi-24.md`：两次案例的时间线、数字和用户原话。
- `templates/`：`TEAM_BRIEF.md`、`ARTLOCK_BRIEF.md`、`UNIT_BRIEF-beats.md`、`STORY_BRIEF.md`、`SAMPLE_RESEARCH_BRIEF.md`、`MUSIC_RENDERER_BRIEF.md`（合成）、`MUSIC_RENDERER_BRIEF-samples.md`（采样）、`REVIEW_BRIEF-light.md`、`bible-row.md`、`lead-sheet-skeleton.js`。
- `scripts/`：`new_project.sh`（从任一示例起新项目）、`scan.py`（全片帧差扫描）、`fetch_x.py`（扒 X 帖子和视频）、`contact_sheet.sh`、`musicmap.py`（配乐结构）、`framediff.py`、`onsets.py`、`tile.py`、`fontprobe.cjs`、`pw.cjs`（找 Playwright）、`audio-tools/node/`（Faust 混响，采样配乐用）。
- `assets/example-xiyou-81nan/`、`assets/example-jieqi-24/`：两部片子的可运行副本（各自的 README 写了怎么跑）。

相关 skill：作曲库 `music-composition-skills`（ https://github.com/jtydhr88/music-composition-skills ，装好后是一组 `mc-*` skill），写谱面前查和声、配器、曲式。花叔的 `huashu-art-motion`（ https://github.com/alchaincyf/huashu-art-motion ，风格配方卡、拆解方法）只作只读参考，本次没有安装、没有运行它的脚本，要用先问用户。
