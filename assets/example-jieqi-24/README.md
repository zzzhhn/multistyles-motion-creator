# 示例工程：《二十四节气》v2（可运行副本）

同一个黄河流域的村口过一年：24 个节气、24 种画风（21 种中国画风加热成像、长曝光、X 光），农妇、娃、耕牛一家按农时过一年，清明生下的小牛犊到大寒长大。3 分 36 秒，2560×1440@60，另有循环版、竖版、方版。这里是定稿的源码、工具、各轮简报、各队日志和审片报告；**不含**成片、配乐音频和采样（采样授权不允许再分发，音频太大）。

## 跑起来（在本目录下）

```sh
node tools/storycheck.cjs                               # 故事轨连续性
node tools/castsheet.cjs 1-8                            # 中性底图上的故事预览 -> qa/story/
node tools/shot.cjs all                                 # 24 个画风的记忆点帧和 6x4 总览 -> qa/art/
node tools/unitsheet.cjs 1,12,22                        # 单元 8 帧拼图、帧时、确定性、注册字段 -> qa/units/
node tools/fstill.cjs 5,30.5,185.3,210 qa/film/f 1280   # 成片任意时刻（片头日晷、春分、冬至、片尾）
node tools/scorecheck.cjs                               # 谱面检查（五音调式、落点、音域、力度）
node tools/export.cjs artlock/film.html out/jieqi.mp4   # 2K60 全片；EXPORT_Q='loop=1' 或 'profile=9x16' 或 'from=8&to=20'
```

浏览器打开 `artlock/index.html` 是 Art Lock 页，`artlock/film.html` 实时播放成片。

**配乐**：页面读 `artlock/audio/jq2-full.wav` 和 `jq2-loop.wav`，仓库里没有。没有时画面照常导出，只是没有声音，导出检查里和音轨有关的 5 项会报 FAIL。要生成：

1. 准备 `$AUDIO_TOOLS`（默认是本目录的上一级里的 `_audio-tools/`）：
   - `vsco2/`：VSCO-2 Community Edition（Versilian Studios，CC0）；
   - `samples-cn/`：按 `refs/samples-cn-REPORT.md` 下载的各库；
   - `.venv/`：Python 3.12，装 numpy、soundfile、librosa、pysfizz、scipy；
   - `node/`：本 skill `scripts/audio-tools/node/` 的两个文件，`npm install`。
2. `zsh tools/render-score2.sh`：约 40 秒出两条 WAV（第一次会先测采样音准，写 `tools/jq2/tuning.json`）。

## 目录

- `artlock/`：引擎和 24 个画风，文件地图见 `../../references/03-engine.md` 第二套引擎一节。
- `tools/`：静帧、拼图、故事检查和预览、谱面检查、配乐构建（`render-score2.sh` 和 `jq2/`）、导出。
- 各轮简报：`ARTLOCK_BRIEF.md`（Art Lock 第一轮）、`ARTLOCK_BRIEF_v2.md`（换成中国画风）、`UNIT_BRIEF.md`（扩成 8 秒三段式）、`STORY_BRIEF.md`（接故事轨）、`MUSIC_BRIEF.md`（v1 合成配乐，被用户否掉，留作对照）、`MUSIC_BRIEF2.md`（v2 采样配乐）、`REVIEW_BRIEF.md`（粗看审片）。
- `logs/art/`、`logs/units/`：四支季节队每一轮的计划、记录和交接。
- `review/light.md`（v1 粗看，0 条）、`review/light2.md`（v2 粗看，5 条，都已修）。
- `refs/samples-cn-REPORT.md`：民乐采样的检索结果、授权原文、音准校正。

## 值得学的单元

| 节气 | 文件 | 手法 |
|---|---|---|
| 1 立春 · 蓝印花布 | `styles/s01.js` | 点和断线构成的镂版、冰片飞进娃举起的手（用 `joints.hand` 对位） |
| 4 春分 · 宋元界画 | `styles/s04.js` | 界尺直线加一根不用尺的闪电，人和牛按景深在树干前后 |
| 11 小暑 · 热成像 | `styles/s11.js` | 低分辨率温度缓冲转伪彩、按部位给人物温度、仪器界面 |
| 12 大暑 · 长曝光 | `styles/s12.js` | 光轨累积、奔跑的娃用前几刻的人物叠成虚影、站定变实 |
| 14 处暑 · 耕织图 | `styles/s14.js` | 木刻错版淡彩，牛拉碌碡打场，走过的地方露出谷带 |
| 17 寒露 · 七巧板 | `styles/s17.js` | 按部件包围盒换成七巧板块画人和牛 |
| 22 冬至 · X 光 | `styles/s22.js` | 牛按故事轨实时画骨架，全画面唯一的暖色是地下的泉 |
| 24 大寒 · 冰梅纹 | `styles/s24.js` | 冰裂锁成窗棂，给一家人留开光，结尾静止接回立春 |
