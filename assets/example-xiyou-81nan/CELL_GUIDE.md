# 八十一难 · 格子制作标准（CELL_GUIDE）

给每一位做格子的人（包括子代理）。先通读，再动手。工程根目录：本目录。

## v10 修改要求（2026-10-20 傍晚，用户看完 v09 粗剪后的意见，优先于本文其余部分）

用户原话的要点：
1. **每一难太短。** 要 5 到 6 秒才承载得下内容、让观众看得清。
2. **画风和内容不要出戏。** 例：第 4 难用古埃及画风没问题，但画面里出现古埃及神明就出戏了。
3. **多放抓眼球、有记忆点、有画面张力的内容**，动作上和内容上都要。

已经改好的引擎（你不用改，只要适配）：
- **新时长**：90 BPM，一拍 0.667 秒。每格 **8 拍 = 5.33 秒**；第 1、8、20、46、80、81 难 **12 拍 = 8 秒**。`e.beat` 的范围现在是 0–8（或 0–12），`e.u` 的含义不变（0 时队伍中心在左缝，1 时在右缝）。画框宽度不变（原 5 拍格 1180，6 拍格 1416），所以你的构图坐标不用动，只是时间拉长了。镜头中段最慢约 100 px/s，过缝约 360 px/s。
- **拍点推镜**：在你的 style 对象上声明 `hits: [拍, …]`（本格局部拍，可带小数，最多 3 个），film.js 会在这些时刻给整个画面一个 4.5% 的推近冲击，配乐也会在这些时刻加重音。把它们放在你这一格最大的视觉事件上。

你要做的：
1. **重新编排时间**（用户第 1、3 条）。旧事件按「第 2 拍、第 3 拍」排在前 2 秒，现在一格有 5.33 秒，要排成一段完整的小戏：
   - 0–1.5 拍：本画风的签名式入场，交代这一难的处境（地点、谁在、有什么危险）。
   - 1.5–4 拍：冲突升级，至少一个看得见的动作事件。
   - 4–6 拍：**高潮或反转，也就是记忆点**，最大的视觉冲击，`hits` 放在这里；队伍此时在格子中段（u≈0.4–0.65）。
   - 6–8 拍：余波和收尾，画面仍在动；u>1 之后还在画面里的部分也要好看。
   - 每格至少三个分得清的事件，其中一个是大高潮。8 秒格按比例展开，可以有两个高潮。
2. **画面张力**（用户第 3 条）：大小对比（巨物压过来）、速度对比（静止突然爆发）、明暗对比（一束光、一次闪）、方向冲突（妖风横扫、兵器对撞）、局部推近（在 draw 里围绕事件点 `g.translate/scale` 推到 1.1–1.2 倍再回到 1，回到 1 的时间要早于 u=0.85，免得跨缝时队伍对不上）。关键物件至少 80 设计像素大，在 2.5 米外的电视上也要看得清。
3. **不出戏**（用户第 2 条）：画面里的人、物、神、建筑、名画构图，必须来自《西游记》本身。学的是画风的视觉语言（材质、线条、色彩、构图逻辑、装饰系统、字体方式），**不搬这个画风原有的题材**：
   - 不要：埃及神明（阿努比斯、荷鲁斯之眼、称心仪式）、基督教圣像和教堂、希腊神话人物、名画里的原角色或原构图（《吻》《呐喊》里的人、《星月夜》的教堂尖顶、《布道后的幻象》）、外国国王、阿拉伯文、拉丁经文冒充正文等。
   - 可以：用这种画风的程式去画西游记的东西，比如埃及的分栏、侧身正眼、王名圈（里面写汉字）用来画殷开山的兵和陈光蕊；装饰纹样、边框、材质、字体处理随便用；画风对应时代的媒介梗（Win95 对话框、街机 HUD、胶片字幕卡）可以用，因为那是媒介不是题材。
   - 逐格自查，把出戏的元素换成原著里的对应物，在日志里列出换了什么。
4. **处理审片意见**：如果派发消息里附了你这几格的审片意见，「必须修」的条目都要处理；不同意的写明理由。
5. **行走带要让开**（两位审片人在 v09 里都反复看到这个问题）：队伍沿 `groundY` 一直往右走，所在的带子是地面线往上约 270 设计像素、x 随 `e.procX` 移动。站在这条带子里的道具和角色会被队伍直接穿过去。处理方法有三种：放到后景（更高、更小、在队伍后面画），或者让它主动让开、被撞开、跟队伍互动，或者放到队伍走不到的地方（u<0 之前就过去了，或者在框外）。

验证照旧（`node tools/cellsheet.cjs <n> qa/cells/<队> --detail`；cellsheet 的 8 帧会按新时长采样）。每格最多两轮。`node tools/still.cjs` 可以出任意时刻的整帧，用来看拍点上的那一帧。

## 这支片子是什么（v09 时的描述；时长以上面 v10 为准）

《西游记》九九八十一难，一难一种画风，按艺术史从四万年前排到 2026 年。画面是一面画廊墙，81 个画框横排；镜头沿墙横移，师徒四人加白龙马从一格走进下一格，跨过画框缝的那一刻人和世界一起换成下一格的画风。2560×1440、60fps、无旁白、配乐全部代码合成。每格 5 拍或 6 拍（120 BPM，2.5 秒或 3 秒）。

总表在 `BIBLE-v09.md`。每格的难名、画风、画面、框内字、拍数、配器也在 `src/cells.js` 的 `XY.ALL_CELLS` 里（字段 `n, name, style, sub, beats, inst, scene, text`）。

## 用户对第一版原型的意见（这是本标准存在的原因）

原型的 5 格（`src/styles/cave.js、oracle.js、puppet.js、ascii.js、shinkai.js`）被评为「画面细节还是简朴」。用户要的是：

1. **每格和那一难的情节紧紧绑在一起。** 画的是这一难具体发生了什么：哪个妖怪、什么法宝、什么地形、谁出了什么事，而不是一张「某画风的风景加师徒路过」。按你对《西游记》原著的了解把细节补足（回目、妖怪名、法宝名、关键动作），总表里的「画面」一栏只是种子，可以改得更贴原著。
2. **每格要有一个记忆点。** 一个能让人看完还记得、想截图转发的瞬间：意外、好笑、漂亮或者巧妙。例：甲骨上朱砂写的「虎」字醒过来扑向队伍；金蝉从太阳里落下正好落进唐僧的毗卢帽；8-bit 格里笼子打开冒出「1UP」。记忆点落在队伍走到格子中段时（u 约 0.35–0.65），并且卡在拍点上（`e.beat` 为整数的时刻）。
3. **画面信息量大约是原型的两倍。** 至少三层景深（远景、中景、近景）；这种画风自己的媒介质感（纸纹、灰泥、绢、颗粒、像素、扫描线……）；这种画风自己的装饰系统（边框、题记、纹样、标签）；2 到 4 个取自这种画风母题的循环小动作，让画一直是活的。

## 格子的代码合约

一格一个文件 `src/styles/<style>.js`（style 键见 `cells.js`），`src/film.html` 已经按顺序加载了全部 81 个文件，没实现的格是占位文件，会画成灰底占位格。

```js
(() => {
  'use strict';
  const XY = window.XY;
  XY.STYLES.<style> = {
    bg(g, W, H, cell, scale) { /* 可选：静态层，按缩放缓存，只算一次。g 已缩放到设计单位 */ },
    draw(g, e) { /* 每帧调用，设计单位 */ },
    post(canvas, g, e) { /* 可选：设备像素的后期（像素化、半调、扫描线等），g 是单位变换 */ },
  };
})();
```

- 画框尺寸（设计单位）：宽 `W` = 拍数 × 236（5 拍 1180，6 拍 1416），高 `H` = 780。设计画布 1920×1080，2K 输出时放大 1.333 倍，`e.S` 是设备像素/设计单位。
- 地面线在 `y = e.groundY`（702），队伍的脚踩在这条线上。墙上的金线在框外接着这条线，所以框内的地面最好也在 702 附近，跨缝时才接得上。
- `e` 的字段：`t` 全片时间，`cell`，`lt` 本格局部秒，`u` 本格进度（0 时队伍中心在左框缝，1 时在右框缝），`beat` 本格局部拍（0.5 秒一拍），`W, H, procX`（队伍中心在框内的 x）、`groundY`、`phase`（步态相位，直接传给 drawProcession）、`S`、`seed`，以及 `e.at('monk.head', acts)`：队伍上某个锚点在框内的坐标。
- **可见时间比 [0,1] 长。** 画框在 u ≈ −0.5 时就从右边进入画面，u ≈ 1.5 才从左边离开。u < 0 时队伍还在上一格：这格要先有一个「等待」状态（妖怪潜伏、场景已在动）；u > 1 是余波。
- 本格的节奏建议：u < 0 等待；0–0.2 画风的签名式「入场」（画自己画出来、套色落版、像素逐行点亮之类）；0.3–0.7 主事件和记忆点（队伍在格中段走得最慢，约自然步速）；0.75–1 收尾；> 1 余波。

## 师徒四人：必须用 rig 画，用本格画风的「笔」

`XY.drawProcession(g, e.phase, e.procX, e.groundY, pen, acts)` 画出整队。角色骨骼、步态、附带动作都在 `src/rig.js`，你不重画角色，你给它一支符合本格画风的笔：

- `pen.color(role, part)` 返回该部件颜色（返回 null 跳过）。部件 role：`fur face wkshirt tiger stripe gold staff ink horse horse2 mane hoof saddle red robe kasaya skin metal bjrobe bjpants pig pig2 wood ssrobe ssrobe2 skin2 ssh ssbeard skull bundle`（默认色见 `XY.DEFAULT_COLORS`）。
- `pen.outline` / `pen.ow` 轮廓色与线宽；`pen.wob` 手绘抖动幅度（设计 px）与 `pen.seed`；`pen.shade`（css 或 false）控制阴影块；`pen.fine = false` 去掉细线（眉、嘴、衣纹）；`pen.part(ctx, part, color, id)` 返回 true 表示你自己画了这个部件（例：皮影格在每块上打镂空孔）。
- 需要更强的画风化时，把队伍画到一个 `XY.scratch()` 离屏层，再做像素化、半调、描边、上纹理，最后贴回来（参考 `shinkai.js` 的赛璐珞阴影和轮廓光、`ascii.js` 的亮度缓冲）。
- **识别符不能丢：** 悟空的金箍、猴脸、虎皮裙、棍、尾巴；唐僧的毗卢帽、红袈裟、锡杖、白马；八戒的猪头大耳、黑袍、肚子、钉钯；沙僧的光头红须、骷髅项链、扁担和两个包袱。单色画风（水墨、蓝晒、默片、剪影）靠剪影辨认，这些部件的轮廓要清楚。
- `acts`（0–1 的权重，可随时间渐变）：`{ wukong: { shade, raise, strike }, monk: { palm }, bajie: { scratch }, shaseng: { lift } }`。妖怪出现时悟空搭凉棚，打斗时举棒或前劈，唐僧遇难时立掌，八戒偷懒时挠肚皮。让队伍和本格的事件互动，这是记忆点的主要来源之一。
- 锚点（`e.at(key, acts)`）：`wukong.head hand handFar staffTip staffEnd chest`；`monk.head hand handFar staffTop horseHead horseChest saddle chest`；`bajie.head hand handFar rakeHead belly chest`；`shaseng.head hand handFar chest pole bundleL bundleR`。例：金蝉落到 `e.at('monk.head')`，妖风吹向 `e.at('wukong.head')`。
- 队伍范围：x 从 `procX − 390` 到 `procX + 320`，最高点约在地面上 270（锡杖顶）。悟空在最前（`procX + 245`）。
- **谁在队里按原著自动决定**（2026-10-20 加）：film.js 在每格绘制前设 `XY.CURRENT_CAST = XY.castAt(n)`，缺席的人 drawProcession 自动不画。1–8 只有唐僧骑普通马，9 起有悟空（21–23 不在），13 起有八戒，17 起有沙僧，10 起是白龙马（1–8 和第 9 格事件之前，唐僧骑的是普通马，笔里把 horse 系列 role 画成栗色或深色）。格内加入或离开用 `acts.cast` 覆盖：第 8 格悟空出山后 `{ cast: { wukong: true } }`，第 12、16 格八戒、沙僧加入，第 20、45 格悟空被赶走 `{ cast: { wukong: false } }`。不要用 `pen.color` 返回 null 来藏人。唐僧下马而马继续走用 `cast.rider = false`（基础值：第 30、31、33 格无骑者，第 29、32 格在格内下马）。

## 工具函数（`src/core.js`、`src/rig.js`、`src/film.js`）

`XY.clamp lerp smooth easeIO easeOut easeIn TAU`；确定性随机 `XY.hash(a,b,c)`、`XY.rng(seed)`、噪声 `XY.noise1 noise2 fbm`；形状 `XY.ellipse(cx,cy,rx,ry,n,rot)`、`XY.wobble(pts,amp,seed)`、`XY.densify`、`XY.path(ctx,pts,closed)`；`XY.RIG.capsule spline blob ribbon chain polar rot add mix flat local`；字体 `XY.font(px, family, weight)`、`XY.cnFont.song kai hei li wei xing yuan`；数字 `XY.cnNum(n)`（中文）、`XY.roman(n)`；画布 `XY.mk(w,h)`、`XY.cached(key,w,h,paint)`（大图 LRU）、`XY.keep(key,w,h,paint)`（小图、图集，永不淘汰）、`XY.scratch(key,w,h)`（每帧复用的临时层，内容不保留）。

本机 Chrome 可用的字体：中文 `Songti SC、Kaiti SC、PingFang SC、Hiragino Sans GB、Heiti SC、Yuanti SC、Libian SC（隶变）、Weibei SC（魏碑）、Xingkai SC（行楷）、Baoli SC、HanziPen SC、Lantinghei SC、Wawati SC`；日文 `Hiragino Mincho ProN、Hiragino Sans`；西文 `Times New Roman、Didot、Bodoni 72、Copperplate、Papyrus、Optima、Futura、Avenir Next、Gill Sans、American Typewriter、Chalkboard SE、Zapfino、Snell Roundhand、Apple Chancery、Trattatello、Luminari、Menlo`。没有 Courier New。

## 硬性要求

- **框内字**：总表「框内字」一栏，用本画风自己的字体或书写方式写（甲骨、隶书、哥特体、浮世绘假名题签、像素字……），设计尺寸不小于 40 px。框内还要有本格的「第 N 难」计数，用本画风的数字写法（罗马数字、中文数字、阿拉伯数字、像素数字、霓虹灯管……），不小于 22 px。不要在角落放一堆小字标签。
- **确定性**：同一个 t 两次渲染逐像素一致。不用 `Math.random`、`Date`、`performance`；随机用 `XY.hash/rng/noise`，逐帧抖动用 `Math.floor(t * 12)` 一类的整数时间做种子。
- **性能**：用 `tools/cellsheet.cjs` 量出来的 p90 ≤ 40 ms、avg ≤ 25 ms（2K）。静态的东西放 `bg`；逐像素循环只能放在 `bg` 里或 ≤ 1/4 分辨率的缓冲上。
- **版权**：学画风语言，不搬受版权保护的具体角色设计：不用 1961 年《大闹天宫》、1986 年电视剧、《黑神话：悟空》的造型；吉卜力、新海诚、Kirby、韩漫这类现代画风只学视觉语言，不画他们的角色和镜头。原著是公版，随便用。
- **避开一眼 AI 味**：不要渐变背景加正中大标题；不要所有东西都慢慢淡入；不用蓝紫霓虹（赛博朋克、蒸汽波这两格除外）；不要给物体乱加脸。

## 每格的工作流程

1. 在你的日志 `qa/cells/<队>/LOG.md` 里先写五行计划：这一难的具体情节（原著回目）、记忆点（在第几拍、是什么）、三层景深各放什么、2–4 个母题小动作、框内字与计数的写法。
2. 写代码。**每次 Write 或 Edit 不超过 150 行**（先写前 150 行创建文件，再用 Edit 追加）；一次写很长的文件曾经撞上输出上限，整段丢失。
3. 跑 `node tools/cellsheet.cjs <n> qa/cells/<队> --detail`，用 Read 看 `c<NN>_sheet.jpg`（8 帧，从入画到出画）和 `c<NN>_u50.jpg`（2K 原尺寸的格子）。你现在是挑剔的导演，不是自己作品的粉丝：照上面三条用户意见和硬性要求打分，挑最差的三个问题改掉。
4. 再跑一次 cellsheet 确认。每格最多改两轮，然后在日志里写下：做了什么、记忆点、计时、已知短板。
5. 不改别人的文件：只写你那几格的 `src/styles/<style>.js`、你队的 `src/styles/kit_<队>.js`（可选的共用工具，命名空间 `XY.KIT_<队>`）和 `qa/cells/<队>/`。
