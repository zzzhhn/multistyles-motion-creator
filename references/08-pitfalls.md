# 08 · 已经踩过的坑

## 开工与协作

- **同一个目录有别的 agent 在写**：这次用户的另一个 agent 在同一个项目目录里平行写了另一套实现，还覆盖了我的 `runtime.js` 和 `build.cjs`。发现陌生文件（`ls -la` 看时间、`xattr` 看来源属性）就停手，把自己的工程整份复制到独占目录，向用户说明，不动对方文件。
- **开工前查资源**：内存压力、swap、磁盘、已开的 headless Chrome 数（只输出计数）。工具每次跑完都关浏览器，九队并行在 48 GB 机器上没有压力。
- **子代理一次写整个文件撞输出上限**：简报写死每次 Write 或 Edit 不超过 150 行。
- **子代理模型**：一律显式 `model: "opus"`。
- **长任务先报估时**：原型约 1.5 小时；铺开一轮约 3 小时；导出 2K 全片约 4 分钟。

## 共享引擎

- **改共享文件后立刻验证**：这次我在 `rig.js` 一行代码末尾加注释，吞掉了后半行，整个 rig 一分钟内无法解析，所有队的检查都报 `castAt is not a function`。改完立刻 `node --check`、出一帧，再广播。
- **别的队写到一半的文件会让整页报错**（`Unexpected end of input`）：`film.js` 对每个单元做了 try/catch；导出前对全部源文件 `node --check`，有坏的就等。
- **`pen.part` 返回 undefined 也算「已画」**：忘写 return 会把整队藏掉，必须显式 `return false`。
- **`procParts` 只缓存最近一组 (w, acts)**：同一帧里用不同步相或 acts 调一次，部件对象就整批换掉；按部件集合做的笔要在每次 `drawProcession` 前当场生成。
- **按部件顺序认人很脆**（例如「从第一个 robe 开始都是骑者」）：给部件打标签（`fig`、`rider`、`prop`），用标签判断。
- **rig 缺姿势**（转头、跪、倒吊、捆绑、站立）：各队会各自绕（藏腿另画、整体旋转、镜像头部），风格不统一。剧情需要的姿势一开始就加进 rig。

## 确定性

- **Chrome 画布回读后从 GPU 切到 CPU**：对同一画布反复 `getImageData`，几次之后 Chrome 会把它换成软件栅格，抗锯齿变了，前几帧和后面不一致。每帧回读的画布一开始就用 `{ willReadFrequently: true }` 创建（示例：`XY.scratch(key, w, h, { read: true })`）。
- **帧内现建缓存导致首帧不同**：例如第一次绘制时才建的缓存层参与了混合。改成在丢弃的画布上预热一遍。
- **验证方法**：同一 t 渲染两次，中间插一帧别的时间，逐像素比较。
- **音频确定性**：Tone.js 的噪声源用 `Math.random`，渲染期间临时换成种子随机；Chrome 对 3 路以上输入的节点求和顺序不固定，最后一位会有差异，改成二叉 Gain 链汇入。

## 画面

- **缓存被挤爆**：81 张缩略图和大背景共用一个 10 张的 LRU，会反复重算。大图用 LRU，小图和图集用永不淘汰的缓存。
- **局部推近没回到 1 就过缝**：跨缝时格内队伍和缝里速写对不上。所有格内推近在 u = 0.85 前回到 1。
- **总览缩略图取到推近中的一帧**：默认取 u = 0.86；单元可以用 `thumb` 指定。
- **画框边框盖住队伍**：不透明边框在行走带那段画到队伍下面。
- **镜头匀速时步频过快、腿像剪刀**：步幅随速度增长，快时转成小跑。
- **记忆点太晚、主事件太小、队伍穿过道具**：两位审片人的共性问题，见 04。
- **英文缩略词和画风原题材混进画面**：按 04 第三节自查。

## 工具与环境

- **Playwright**：工具通过 `tools/pw.cjs` 找 playwright-core（依次试环境变量 `PLAYWRIGHT_CORE`、普通 `require`、全局 `@playwright/cli` 安装），用 `channel: 'chrome'`（系统 Chrome，能编解 H.264）。
- **headless Chrome 可用的字体**：中文 Songti SC、Kaiti SC、PingFang SC、Hiragino Sans GB、Heiti SC、Yuanti SC、Libian SC（隶变）、Weibei SC（魏碑）、Xingkai SC（行楷）、Baoli SC、HanziPen SC、Lantinghei SC、Wawati SC；日文 Hiragino Mincho ProN、Hiragino Sans；西文 Times New Roman、Didot、Bodoni 72、Copperplate、Papyrus、Optima、Futura、Avenir Next、Gill Sans、American Typewriter、Chalkboard SE、Zapfino、Snell Roundhand、Apple Chancery、Trattatello、Luminari、Menlo。没有 Courier New。新机器先跑 `scripts/fontprobe.cjs`。
- **ffmpeg 的 drawtext** 在本机没有 fontconfig 配置，要显式传 `fontfile=/System/Library/Fonts/Supplemental/Arial.ttf`。
- **ffmpeg 拼图**：xstack 前各路要先缩放到同一尺寸；`-filter_complex` 和 `-vf` 不能同时作用于同一路输出。
- **zsh**：`*.jpg` 无匹配时会报错；变量不要叫 `path`、`status`。`sed` 是 BSD 版，改文件用编辑工具。
- **X**：WebFetch 打 x.com 返回 402，用 fxtwitter API；DuckDuckGo HTML 接口给验证码。
- **GitHub API** 未登录很快限流，用 `gh api`（沙箱外运行）。
- **大文件**：2K60 全片约 1.8 GB 一个，几个中间版就是十几 GB，定稿后清理。

## 配乐

- 见 06：曲式跟着画面切会乱；作曲和渲染要分开；先出小样；调性标签变化次数不能当指标；`musicmap.py` 旧版的调性标签整体高了小三度。

## 第二部片子新增（《二十四节气》）

- **过渡收尾一跳**：遮罩宽度没盖满全画面（撕裂过渡最大宽度少算了 376 设计像素），或者用「进度到 0.9 就整屏填满」收尾。引擎统一在最后 20 % 交叉淡化，再用 `scripts/scan.py` 验。
- **推近漂移**：缩放中心和平移目标是两个点。推近一律以画面中心为缩放中心、目标先居中，按对数插值倍数。
- **负的单元时间**：过渡时引擎把 −0.45 秒传给进来的画风，某个画风画了负半径的椭圆直接报错。引擎把画风时间夹在 0 到 9，真实时间另给（`Sx.lt`）。
- **标题和画风自带文字打架**：引擎标题和画风的表头、HUD 读数在同一块天空。单元简报预留标题区，引擎按单元调标题位置。
- **窄容器里的字**：圆形月洞门里的一行署名超宽被裁。量宽，超了折行。
- **离散姿势一帧跳变**：卧和站、坐和站这种大姿势之间要有过渡参数（牛卧起 0.6 秒），故事检查要查跨边界的卧站一致。
- **故事数据的遮挡**：人物路线穿过院墙墙面、两个主体重叠、道具跨单元消失、道具种类写错后什么都不画。`castsheet` 预览加 `storycheck`，未知道具种类直接报错。
- **平台页漏脚本**：手抄的平台页少了一个乐器脚本，竖版方版没有音轨。
- **区间导出被忽略**：运行时不认 `from` / `to`，试导 20 秒导出了整片。运行时已支持区间导出。
- **系统 Python 没有 numpy**：分析脚本用 `$AUDIO_TOOLS/.venv/bin/python -I`。
- **shell 工作目录漂移**：上一条命令 `cd` 到子目录后，下一条用相对路径的命令全部失败。每条命令开头 `cd` 到工程根目录的绝对路径。
- **Bash 权限检查超时**：等十几秒重试；改文件可以先用编辑工具。
- **采样文件名的八度和音准不可信**：二胡、越南筝、陶笛的文件名八度都差一个，笛子整体偏高约 40 音分。一律实测基频再用。
- **采样音域**：古筝采样只到 C#6、大提琴只到 C2，谱面写出界的音要么改谱，要么在渲染简报里写明交给哪件乐器。
