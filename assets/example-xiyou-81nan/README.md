# 示例工程：《八十一难》v11（可运行副本）

定稿版本的源码、工具、制作文档、各队日志和审片报告。成片和中间产物不在这里（太大），需要时用工具重新导出。

## 跑起来

在本目录下：

```sh
node tools/still.cjs src/film.html /tmp/x 3,120,460 0.5          # 三帧静帧（开场、中段、片尾）
node tools/cellsheet.cjs 29 /tmp/c29 --detail                     # 第 29 难（琳派金屏风）的 8 帧拼图和 2K 单帧
node tools/mosaic.cjs /tmp/all.jpg 0.5 320                        # 81 格总览
node tools/build.cjs /tmp/xiyou.html film.html && node tools/export.cjs /tmp/xiyou.html /tmp/xiyou.mp4   # 2K60 全片，约 4 分钟、1.8 GB
EXPORT_Q='profile=9x16' EXPECT_W=1440 EXPECT_H=2560 node tools/export.cjs src/platform.html /tmp/v.mp4  # 竖版
```

浏览器直接打开 `src/film.html` 会实时播放（点一下画面出声，配乐生成约 10 秒）；`src/rig-demo.html` 是角色 demo。

## 目录

- `src/`：引擎（`core.js rig.js film.js runtime.js platform.js`）、单元数据 `cells.js`、81 个画风和 9 个队伍工具（`styles/`）、配乐（`score-v11.js` lead sheet、`audio-v11.js` 渲染器、`audio-inst.js` 乐器库、`vendor/tone.js`）。
- `tools/`：静帧、单元拼图、总览、缝、帧时、构建、导出、平台版生成、配乐渲染与检查、分析脚本。
- `CELL_GUIDE.md`：当时给各队的单元标准（顶部是 v10 修改要求）；`TEAM_BRIEF.md`、`REVIEW_BRIEF.md`：当时的队伍简报和逐格审片简报。
- `BIBLE-v09.md`：v09 时的 81 行总表（时长后来改成 5.33 秒，以 `src/cells.js` 为准）。
- `logs/team-*-LOG.md`：九队逐格的计划、改动、计时、短板，是写单元计划的好样例。
- `review/`：两份逐格审片报告（r1、r3）和定稿前的轻量审片（light）。
- `qa/audio/v11-report.json`：v11 配乐的测量报告。

## 值得学的单元（按手法）

| 单元 | 文件 | 手法 |
|---|---|---|
| 29 风摄圣僧 | `styles/rimpa.js` | 金屏风、墨色云带加金线涡卷、唐僧离鞍（审片人评为前段最好） |
| 63 城里遇灾 | `styles/ascii.js` | 亮度缓冲转字符、ANSI 块图形画队伍、反相闪 |
| 80 凌云渡脱胎 | `styles/shinkai.js` | 密度场积云、光柱、赛璐珞阴影和轮廓光、凡胎脱出 |
| 5 出城逢虎 | `styles/oracle.js` | 刻痕线（暗槽加亮唇）、朱砂字活过来 |
| 24 平顶山逢魔 | `styles/bluewhite.js` | 青花钴蓝晕散、葫芦吸人 |
| 70 灭法国难行 | `styles/arcade16.js` | 低分辨率精灵层、HUD、满城光头 |
| 33 搬运车迟 | `styles/puppet.js` | 打孔皮影、操纵杆、12 fps 步进 |

移植到新题材见 `../../references/03-engine.md` 最后一节。
