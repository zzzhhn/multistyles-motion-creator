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
