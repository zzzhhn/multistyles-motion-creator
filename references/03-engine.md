# 03 · 引擎（示例工程的架构、接口合约、移植清单）

示例工程 `assets/example-xiyou-81nan/` 是一套纯浏览器的确定性渲染器：页面暴露 `window.__renderAt(t)` 和 `window.__DURATION`，工具用 headless Chrome 逐帧调用，页面内 WebCodecs 编码 H.264，自写 MP4 封装加 AAC，不需要 Remotion 或任何服务端。起新项目用 `scripts/new_project.sh <目录>` 复制一份再改。

## 文件地图

| 文件 | 管什么 |
|---|---|
| `src/core.js` | 常量（设计画布 1920×1080、BPM、开场和片尾拍数）、种子随机与噪声、缓动、时间线 `buildTimeline()`、镜头 `procWorldX/camX/walkPhase`、几何小工具、字体表、中文与罗马数字 |
| `src/cells.js` | 单元数据 `XY.ALL_CELLS`（由总表生成）、关键单元加长、`?cells=1,5,33` 只保留部分单元 |
| `src/rig.js` | 角色骨骼、步态、表演、成员规则 `castAt`、锚点、按 role 上色的「笔」接口 |
| `src/film.js` | 画廊墙、画框、缝里的墨线速写、展签、年代标尺、下拍冲击与 hits 推近、9×9 总览推拉、缓存、单元容错 |
| `src/styles/<style>.js` | 每个单元的画风实现；`kit_<队>.js` 是各队共用工具 |
| `src/runtime.js` | 播放、`?still=1`、`?export=1`、WebCodecs 导出（2K 时 32 Mbps、`avc1.640033`） |
| `src/platform.js` + `tools/mkplatform.cjs` | 9:16 和 1:1 包装页（由 film.html 生成 platform.html） |
| `src/score-v11.js` + `src/audio-v11.js` + `src/audio-inst.js` + `src/vendor/tone.js` | 配乐：lead sheet、渲染器、乐器库、Tone.js 15.1.22（MIT） |
| `src/rig-demo.html/.js` | 角色 demo 页：漫步与成片节奏、骨骼、三种笔、单人特写、表演按钮 |
| `tools/` | 见下文「工具」 |

加载顺序（`film.html`）：`core → rig → cells → film → styles/kit_* → styles/*（按单元顺序）→ vendor/tone → audio-inst → score → audio → runtime`。

## 时间线与镜头

- `XY.buildTimeline()` 给每个单元算 `x, w, t0, t1, dur, i`，以及 `SCROLL_T0`（第一个单元开始）、`SCROLL_T1`（最后一个单元结束）、`DURATION`。
- 队伍中心在第 k 条缝上的时刻正好是第 k 个单元的 `t0`。格内镜头放慢、过缝加快，由 `LAYOUT.EASE_A` 控制（示例 0.55：中段约 100 px/s，过缝约 360 px/s）。第一个单元从格中央静止起步（接开场推近），最后一个单元减速停在格中央（接片尾拉远）。
- 所有动画只读 t。单元内用 `e.u`（0 时队伍中心在左缝，1 时在右缝）或 `e.beat`（单元内第几拍）。

## 单元合约（每个画风文件）

```js
XY.STYLES.<style> = {
  bg(g, W, H, cell, scale) {},   // 可选，静态层，按缩放缓存，只算一次
  draw(g, e) {},                 // 每帧，设计单位
  post(canvas, g, e) {},         // 可选，设备像素后期（像素化、半调、泛光、局部推近）
  hits: [4, 5.5],                // 本单元的高潮拍点（单元内拍），film 在这些时刻推近 4.5%，配乐加重音
  thumb: 6,                      // 可选，总览缩略图取哪一拍；默认 u = 0.86（高潮之后、推近已回到 1）
};
```

`e` 的字段：`t, cell, lt, u, beat, W, H, procX, groundY, phase, S, seed`，以及 `e.at('monk.head', acts)` 得到队伍上某个锚点在画框里的坐标。画框尺寸是设计单位，2K 输出时 `e.S = 1.333`。可见时间比 [0,1] 长：u ≈ −0.5 时画框就从右边进入画面，u ≈ 1.5 才离开，所以要有「等待」状态和「余波」。

## 角色（rig.js）

- **骨骼**：腿是两段 IK，脚掌在支撑期按「走过的距离」钉在地面上，镜头怎么缓动脚都不打滑（实测滑移 0 到 0.06 px/帧）。步幅随速度增长（约正比于速度开方），快时从走过渡到小跑。距离到步相的表从整片时间线预先算出，所以仍然是 t 的纯函数。
- **造型**：每个角色是一组带 role 标签的图元（poly、line、dot），role 例如 `fur face robe kasaya horse mane gold staff ink …`，另带 `fig`（属于谁）、`rider`（骑者部件）、`prop`（道具，如 `staff`）、`shade`（阴影块）、`fine`（细线）。
- **笔（pen）**：画风不重画角色，只提供一支笔：`color(role, part)`、`outline`、`ow`、`wob`（手绘抖动）、`seed`、`shade`、`fine:false`、`part(ctx, part, color, id)`。注意 `part` 返回值不是 `false` 就算「已画」，忘写 return 会把整队藏掉，要显式 `return false` 才交回默认画法。
- **表演 acts**：每个角色几种 0 到 1 的权重动作，示例为 `wukong:{shade,raise,strike}`、`monk:{palm}`、`bajie:{scratch}`、`shaseng:{lift}`。随时间渐变即可。
- **锚点**：`XY.anchor('wukong.staffEnd', w, acts)`，示例有 head、hand、handFar、staffTip、staffEnd、horseHead、belly、bundleR 等。出棍时朝前的是 `staffEnd`。
- **成员规则**：`XY.castAt(n)` 按原作给出每个单元谁在场（含 `rider`：骑者离鞍而马继续走；`staff`：道具被收走）。film 在画每个单元前设 `XY.CURRENT_CAST`，缝里的速写也按它画。格内加入或离开用 `acts.cast` 逐帧覆盖。不要用 `pen.color` 返回 null 来藏人。
- **demo 页**：`rig-demo.html` 是给用户看造型和步态的独立页，世界固定的地面刻度能证明脚不打滑，有骨骼、三种笔、单人特写和表演按钮。新项目先做这个给用户确认。
- **缺的姿势**：示例 rig 没有转头、跪、倒吊、捆绑、站立不动。如果新项目的剧情需要，先在 rig 里加，不要让各队各自绕（这次各队都写了自己的绕法）。

## film.js 提供的通用件

- 缓存：`XY.cached(key,w,h,paint)` 是大图 LRU（16 张），`XY.keep(...)` 永不淘汰（缩略图、图集、暗角），`XY.scratch(key,w,h,{read:true})` 是每帧复用的临时层；每帧要 `getImageData` 的层必须带 `read:true`（见 08）。
- 单元容错：`renderPanel` 包了 try/catch，某个单元报错只记一次日志并退回灰色占位格。
- 下拍冲击 1.2%（约 0.25 秒）和 hits 推近 4.5%，以地面线为中心。
- 总览：9×9 网格，开场按行出现（和配乐的钟声对齐）、题字逐字刷出、印章盖下；片尾拉回总览、整网格一道光扫过、署名。推拉过程中，被推进或拉出的那一格画的是同一时刻的实况，避免交叉淡化时出现重影。

## 工具（`tools/`，都从工程根目录运行）

| 命令 | 用途 |
|---|---|
| `node tools/still.cjs src/film.html 前缀 t1,t2 缩放 [query]` | 任意时刻整帧静帧 |
| `node tools/cellsheet.cjs <n> 输出目录 [--detail]` | 单个单元从入画到出画 8 帧拼图加 2K 原尺寸单帧，测 avg/p90/max 帧时（预算 avg ≤ 25 ms，p90 ≤ 40 ms） |
| `node tools/mosaic.cjs out.jpg [u] [宽]` | 全部单元在某个 u 的总览图，红字标未实现 |
| `node tools/seams.cjs out.jpg 起 止` | 队伍正好跨每条缝那一帧的拼图 |
| `node tools/perf.cjs [N]` | 全片帧时抽样，估导出时间 |
| `node tools/build.cjs out.html film.html` | 内联成单文件，审计网络引用（vendor 豁免） |
| `node tools/export.cjs page.html out.mp4` | 页面内导出加 17 项检查；`EXPORT_Q='cells=1,2,3'` 只导部分，`EXPECT_W/EXPECT_H` 改期望尺寸 |
| `node tools/mkplatform.cjs` | 从 film.html 生成 platform.html |
| `node tools/render-audio.cjs [--page x.html] --out a.wav`、`node tools/audio-check.cjs` | 只渲染配乐、测响度、对齐、确定性 |

## 移植到新题材要改的地方

1. `src/cells.js`：换成新总表；`LONG` 换成新的关键单元。
2. `src/rig.js`：换角色构造函数（`wukong / monkOnHorse / bajie / shaseng`）、`FIGS` 排布、`DEFAULT_COLORS` 的 role、acts、锚点、`castAt` 规则。步态、IK、笔接口、成员机制保留。
3. `src/film.js`：开场和片尾的文字（片名、副题、年代跨度、出处、印章字、署名）、展签格式 `'第' + cnNum + '难'`、年代标尺 `ERAS`、总览网格 `G`（9×9 是因为 81 个单元）。
4. `src/platform.js`：标题块的「第 N 难」、81 格网格和进度条。
5. `src/runtime.js`：`FILE_NAME`。
6. 配乐：重写 `score-*.js`；`audio-v11.js` 里的开场和片尾是《八十一难》的专用写法，并且会校验最后一小节等于 `DURATION`，按新时长改。
7. `src/styles/`：81 个画风文件都是这部片子专用的，新项目可以参考其中的渲染手法（例如 `rimpa.js` 金屏风、`ascii.js` 字符画亮度缓冲、`shinkai.js` 密度场积云和赛璐珞阴影、`oracle.js` 刻痕线）。
8. 工具通过 `tools/pw.cjs` 找 playwright-core（依次试环境变量 `PLAYWRIGHT_CORE`、普通 `require`、全局 `@playwright/cli` 安装），用 `channel: 'chrome'`。

---

# 第二套引擎：同一处过一年（`assets/example-jieqi-24/`）

《二十四节气》用的是固定构图、换画风的骨架，引擎在 `artlock/` 下（Art Lock 页和成片共用同一套画风文件）。和第一套的区别：没有画廊墙和镜头横移；主体由故事轨统一计算（`10-story.md`）；过渡由现象带入；标题由引擎统一画。起新项目用 `scripts/new_project.sh <目录> jieqi`。

## 文件地图

| 文件 | 管什么 |
|---|---|
| `core.js` | 命名空间 `JQ`、设计画布 1920×1080、种子随机 `hash/rng/noise/fbm`、缓动、离屏层 `JQ.layer`、静态缓存 `JQ.cached`、竖排字 |
| `terms.js` | 单元表 `JQ.TERMS`（名、季、三候、画风、要点、记忆点、关键候 `keyHou`） |
| `scene.js` `scene2.js` | 固定构图合约：每样景物的点列和 Path2D（山、田、犁沟、池塘、溪、桥、树干、树枝、树冠、院墙、门楼、屋顶……）和关键坐标 `JQ.L` |
| `figures.js` | 早期的娃和牛（Art Lock 用），几何工具 `JQ._fig`，按 role 上色 `JQ.drawParts` 和 role 回退 `JQ.ROLE_FALLBACK` |
| `figures2.js` | 一家人的骨架（成人、孩子）和姿势库（走、跑、犁、牵、撒种、锄、割、挑、坐、蹲、跪、扫、打连枷、端、挥手……） |
| `figures3.js` | 会长大的小牛、牛的挽具锚点、农具（犁、锄、镰、篮、扁担水桶、连枷、扫帚、蒲扇、碗、柳条、红绸、风筝、碌碡、麦捆、草垛、春联、灯笼） |
| `storydata.js` `storydata2.js` | 故事轨数据：24 个单元每个主体的关键帧 `JQ.STORY_KEYS`、道具 `JQ.STORY_PROPS` |
| `story.js` `story2.js` | 故事运行时：`JQ.storyState(n, lt)`、`JQ.cast(n, lt)`、`JQ.castFor(Sx, t)`、`JQ.drawCastFor(g, Sx, t, pen)` |
| `styles/sNN.js` | 24 个画风；`styles.js` 按顺序加载，缺的退回占位卡 |
| `flat.js` | 中性平涂布局（调试、占位卡、`castsheet` 的底图） |
| `film.js` | 时间线、镜头轻推、过渡合成、标题卡调用、`window.__renderAt` |
| `trans.js` | 现象过渡 `JQ.transMask(n, p, SC)` → `{ path, overlay }` |
| `titles.js` | 标题卡 `JQ.titleCard(g, n, lt, Sx)`，按单元调位置 `JQ.TITLE_POS` |
| `ring.js` `film2.js` | 片头片尾：日晷节气盘、月洞门、穿门推近 |
| `platform.js` | 9:16 和 1:1：整幅画面不裁，上方大标题、下方节气盘或进度条 |
| `score-jq2.js` `audio-jq2.js` `audio/` | 配乐谱面（五音调式）、读取预渲染 WAV 的页面接口、署名（WAV 由 `tools/render-score2.sh` 生成，不在仓库里） |
| `runtime.js` | 播放和导出（同第一套），另支持 `?from=a&to=b` 区间导出（画面和配乐一起裁） |
| `index.html` `page.js` `page.css` `render.html` | Art Lock 页和工具渲染页 |

## 时间结构

- 90 BPM；片头 4 小节（10.667 秒），每个单元 3 小节（8 秒，一候一小节），片尾 5 小节；`?loop=1` 去掉片头片尾、72 小节首尾相接。
- 单元的记忆点（落点）在关键候那一小节的第三拍：`impact = keyHou × 8/3 + 4/3` 秒。配乐在这一刻打钟加渐强。
- 引擎传给画风的时间夹在 0 到 9：进来的画风在过渡里停在开场状态，出去的画风继续跑到约 8.85 秒。真实单元时间在 `Sx.lt`（负数或大于 8），只给故事轨用。

## 画风合约

```js
JQ.ART[n] = {
  key: impact,                       // 落点时刻，缩略图和检查用
  keyHou: 0 | 1 | 2,
  focus: [[x1, y1], [x2, y2], [x3, y3]],   // 三候事件的位置；镜头每候向它轻推（8 秒推到 1.035 倍），
                                           // 现象过渡不用它，老的生长遮罩从 focus[0] 长出
  frame: false,                      // 画风自带边框、绫边、挂屏框时填 true，镜头不动
  draw(g, t, Sx) { ... },            // g 已缩放到设计坐标；人物每帧用 JQ.castFor(Sx, t) 取
};
```

## 过渡、标题、片头（这一轮新加，都在引擎里，各画风不用管）

- **过渡**：边界前 0.45 秒到边界后 0.85 秒，新画风画在 `transMask` 给的形状里，现象层叠在上面；最后 20 % 统一交叉淡化并淡出现象层（之前有两种过渡在收尾整屏一跳，`11-error-analysis.md` T2）。新增一种现象只要在 `trans.js` 里加一个分支，并在 `JQ.TRANS` 里指给对应单元。
- **标题卡**：每个单元 0.15 到 2.25 秒，天空中部展开一条纸条，写名字、序号、日期、三候和季节印。纸条自带纸底和投影，任何画风上都清楚。和画风自带文字冲突时，在 `JQ.TITLE_POS` 里给这个单元另设位置；平台页把它关掉（上方已有大标题）。
- **片头**：太阳固定在正上方，节气盘在它下面转一年；扇区先是水墨线稿（缩略图去色加强对比），太阳经过时才上色；盘心月洞门里依次翻过 24 种画风；最后镜头以月洞门为中心（也是画面中心）按对数插值推近，穿门进入第一个单元。**缩放中心和目标必须是同一个点**，否则推近一半画面会漂（v1 落点偏到雨水和惊蛰）。
- **片尾**：从最后一个单元拉回节气盘，太阳走回第一个节气，月洞门里出题字和署名（窄容器里的字要量宽、超了就折行）。

## 工具（`tools/`，从工程根目录运行）

| 命令 | 用途 |
|---|---|
| `node tools/shot.cjs <n\|all> [t] [宽]` | 画风单帧；`all` 出 6×4 总览，查确定性 |
| `node tools/unitsheet.cjs <n,...>` | 单元 8 帧拼图、2560 宽帧时、落点帧确定性、注册字段检查 |
| `node tools/storycheck.cjs` | 故事轨连续性（位置、朝向、卧站、滑步、未知道具） |
| `node tools/castsheet.cjs 1-24` | 中性底图上的故事预览，每单元 5 个时刻 |
| `node tools/fstill.cjs t1,t2 前缀 宽 [query]` | 成片任意时刻静帧；`PAGE=platform.html` 看平台版 |
| `node tools/pageshot.cjs` | Art Lock 页截图（首屏、全页、放大框、导出意见） |
| `node tools/scorecheck.cjs` | 谱面检查（调式内音、拍数、落点有旋律起音、独奏音域、力度上限、季节动机） |
| `zsh tools/render-score2.sh` | 一条命令从谱面到两条 WAV（需要 `$AUDIO_TOOLS`，见 `06-music.md`） |
| `node tools/export.cjs artlock/film.html out.mp4` | 同第一套；`EXPORT_Q='loop=1'`、`'profile=9x16'`、`'from=8&to=20'` |
| `python -I scripts/scan.py out.mp4` | 全片帧差扫描，看过渡收尾有没有一跳 |

平台页 `platform.html` 要和 `film.html` 用同一份脚本列表（第一次手抄漏了乐器脚本，竖版方版没有音轨）：改了 `film.html` 的脚本就同步改，或者照第一套的 `mkplatform.cjs` 生成。
