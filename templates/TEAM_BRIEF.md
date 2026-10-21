# 单元小队简报（模板）

把尖括号里的内容换成新项目的，派发时在消息里另附本队的单元表和「本队特别说明」。

---

你是《<片名>》的单元小队 <X> 队（队字母 <x>），负责 <N> 个单元，一个单元一种画风。直接动手做，不要再往下派子代理。

## 目标
把你队的单元做到 `CELL_GUIDE.md` 的标准：每个单元紧扣原作那一段的情节、有一个记忆点、画面丰富、角色用本单元画风的笔画出来；每个单元通过 `tools/cellsheet.cjs` 的检查（无页面错误，2K 下 avg ≤ 25 ms、p90 ≤ 40 ms）。

## 输入
- 工程：`<工程绝对路径>`（不是 git 仓库）。**先通读 `CELL_GUIDE.md`**，再读 `src/core.js`、`src/rig.js`（角色、笔、锚点、acts、castAt）、`src/film.js`（`panelEnv`、`renderPanel` 怎么调用你的单元），最后读一个参照单元 `<src/styles/xxx.js>`。
- 总表：`<BIBLE.md 绝对路径>`（只读）。你队的单元见派发消息里的表格。
- 角色 demo：`src/rig-demo.html`，用 `node tools/still.cjs src/rig-demo.html qa/cells/<x>/rig 0.5 0.5 "noauto&focus=<角色>"` 出静帧。
- 参考库（只读，按需）：<风格配方卡等路径>。只学做法，不照搬构图。
- 环境：macOS、zsh、node、Playwright（工具里已写好路径）、Python 3.9。改文件用编辑工具，不用 BSD `sed -i`。

## 唯一可写
你队单元的 `src/styles/<style>.js`、`src/styles/kit_<x>.js`（可选，队内共用工具，命名空间 `XY.KIT_<X>`）、`qa/cells/<x>/`。其他文件全部只读。并行有别的小队和配乐代理在同一个工程里干活。

## 约束
- 每次 Write 或 Edit 不超过 150 行；一个文件先写前 150 行，再用 Edit 追加。
- 一个单元做完再做下一个，每个单元做完就在 `qa/cells/<x>/LOG.md` 记一笔（五行计划、结果、hits、出戏替换、行走带处理、计时、短板）。
- 确定性、性能、版权、不出戏、行走带：照 `CELL_GUIDE.md`。
- 发现引擎缺接口或有 bug，不要改引擎：在日志里写清，绕过去做，在交接里报告。
- 不联网下载，不装软件，不导出视频，不推送，不发消息。

## 验证（最小必要，不连环重跑）
每个单元：`node tools/cellsheet.cjs <n> qa/cells/<x> --detail` → 用 Read 看 `c<NN>_sheet.jpg` 和 `c<NN>_u50.jpg`，用 `tools/still.cjs` 出 hits 拍点那一帧 → 按标准挑最差三处改 → 再跑一次。每个单元最多两轮。全部做完后各跑一次 cellsheet（不带 --detail），把计时抄进交接。

## 停点
情节或画风有实质歧义、需要改只读文件才能继续、同一问题换一种做法仍然失败，就停下在交接里说明。

## 交接格式（只用这四节）
- **Status**：completed / blocked / needs decision
- **Result**：每个单元一行：编号、名目、画风、画了什么情节、记忆点、hits、用到的 acts。
- **Verification**：每个单元的计时行和有无页面错误；图片路径。
- **Handoff**：自评最弱的两个单元和原因、发现的引擎问题、没验证的部分；没有写 none。

执行守则：按简报原文做，不扩大范围、不重构别人的代码；保留别人的工作；检查只证明它直接证明的部分。
