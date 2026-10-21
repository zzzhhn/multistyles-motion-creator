# 格子小队简报（九队共用）

你是《八十一难》的一个格子小队，负责九格，一格一种画风。直接动手做，不要再往下派子代理。

## 目标
把你队的九格做到 `CELL_GUIDE.md` 的标准：每格紧扣那一难的原著情节、有一个记忆点、画面信息量是原型的两倍、师徒四人用本格画风的笔画出来；每格通过 `tools/cellsheet.cjs` 的检查（无页面错误，p90 ≤ 40 ms）。

## 输入
- 工程：本目录（当时不是 git 仓库）。**先通读 `CELL_GUIDE.md`**，再读 `src/core.js`、`src/rig.js`（角色、笔、锚点、acts）、`src/film.js`（`panelEnv`、`renderPanel` 怎么调用你的格子），最后读一个原型格作参照：`src/styles/oracle.js` 或 `src/styles/shinkai.js`（这些是「还太简朴」的基线，不是目标）。
- 总表：`BIBLE-v09.md`（只读）。你队的九格见派发消息里的表格。
- 角色 demo（看角色怎么动）：`rig-demo.html`，用 `node tools/still.cjs src/rig-demo.html qa/cells/<队>/rig 0.5 0.5 "noauto&focus=wukong"` 之类出静帧。
- 参考库（只读，按需）：花叔的风格配方卡（https://github.com/alchaincyf/huashu-art-motion 的 `references/风格配方/`）（INDEX.md 加各卡，里面有不少画风的渲染器思路、母题动法、短板），以及同仓库 `scripts/engine/scenes/` 的代码实现。只学做法，不照搬构图。
- 环境：macOS，zsh，`node`，Playwright 已装（工具脚本里已写好路径），Python 3.9。改文件用编辑工具，不用 BSD `sed -i`。

## 唯一可写
只写这些：你队九格的 `src/styles/<style>.js`、`src/styles/kit_<队小写字母>.js`（可选，队内共用工具，命名空间 `XY.KIT_<队大写字母>`）、`qa/cells/<队小写字母>/`。其他文件全部只读：`core.js`、`rig.js`、`film.js`、`cells.js`、`film.html`、`audio*.js`、工具脚本、别队的格子。并行有八个别的小队和一个配乐代理在同一个工程里干活。

## 约束
- 每次 Write 或 Edit 不超过 150 行。一格的文件先写前 150 行，再用 Edit 追加。
- 一格一格做完再做下一格，每格做完就在 `qa/cells/<队>/LOG.md` 记一笔（五行计划、结果、计时、短板），这样中途停下也知道进度。
- 确定性、性能、版权、避开 AI 味：照 `CELL_GUIDE.md` 的硬性要求。
- 如果你发现 rig 或 film 有 bug 或缺一个你需要的接口，不要改它们：在日志里写清楚，绕过去做，并在交接里报告。
- 不联网下载东西，不装软件，不导出视频，不跑 `tools/export.cjs`，不推送、不发消息。

## 验证（最小必要，不连环重跑）
每格：`node tools/cellsheet.cjs <n> qa/cells/<队> --detail` → 用 Read 看 `c<NN>_sheet.jpg` 和 `c<NN>_u50.jpg` → 按标准挑最差三处改 → 再跑一次。每格最多两轮修改。全部九格做完后，各跑一次 cellsheet（不带 --detail）确认无页面错误，把九行计时抄进交接。

## 停点
遇到以下情况停下并在交接里说明：情节或画风有实质歧义、需要改只读文件才能继续、同一个问题换了一种做法仍然失败。

## 交接格式（只用这四节）
- **Status**：completed / blocked / needs decision
- **Result**：每格一行：编号、难名、画风、这一格画了什么情节、记忆点是什么、用了哪些 acts。
- **Verification**：每格 cellsheet 的计时行和是否有页面错误；sheet 图的路径。
- **Handoff**：自评最弱的两格和原因、发现的 rig/film 问题、没验证的部分；没有写 none。

执行守则：按简报原文做，不扩大范围、不重构别人的代码；保留别人的工作；检查只证明它直接证明的部分。
