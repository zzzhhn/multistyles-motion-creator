// cells.js — the 81 cells, generated from xiyou-81nan/BIBLE.md (n, 难名, style key, wall label, beats, 配器, 画面, 框内字).
// ?cells=1,5,33 (or window.__ONLY = [1,5,33] before this script) keeps only those cells — for prototypes and batch previews.
(() => {
  'use strict';
  const XY = window.XY;
  XY.ALL_CELLS = [
  {
  "n": 1,
  "name": "金蝉遭贬",
  "style": "cave",
  "sub": "洞窟岩画 · 4 万年前",
  "beats": 5,
  "inst": "骨笛、手鼓",
  "scene": "岩壁上一只金色蝉从日轮里坠落，赭红手印一排，火堆旁小人举手",
  "text": "金蝉"
  },
  {
  "n": 2,
  "name": "出胎几杀",
  "style": "yangshao",
  "sub": "仰韶彩陶纹 · 前 3000 年",
  "beats": 5,
  "inst": "埙、陶鼓",
  "scene": "漩涡纹陶瓮里浮出婴孩，鱼纹绕游，黑影举刀",
  "text": "出胎"
  },
  {
  "n": 3,
  "name": "满月抛江",
  "style": "cuneiform",
  "sub": "楔形泥板 · 前 2000 年 · 两河",
  "beats": 5,
  "inst": "苏美尔里拉琴、木管",
  "scene": "泥板刻出河道，婴孩缚在木板上顺流，楔形符号像水鸟飞起",
  "text": "抛江"
  },
  {
  "n": 4,
  "name": "寻亲报冤",
  "style": "egypt",
  "sub": "古埃及墓画 · 前 1500 年",
  "beats": 5,
  "inst": "竖琴、铃鼓",
  "scene": "侧脸正面眼，母子相认，天平与羽毛，复仇之刃",
  "text": "寻亲"
  },
  {
  "n": 5,
  "name": "出城逢虎",
  "style": "oracle",
  "sub": "甲骨卜辞 · 前 1200 年",
  "beats": 5,
  "inst": "骨哨、龟甲敲击",
  "scene": "龟甲裂纹里跃出一只虎，「虎」字随裂纹跳动",
  "text": "虎"
  },
  {
  "n": 6,
  "name": "折从落坑",
  "style": "bronze",
  "sub": "商周青铜饕餮 · 前 1000 年",
  "beats": 5,
  "inst": "编钟、青铜钺",
  "scene": "饕餮巨口吞下随从，铜绿斑，雷纹旋转",
  "text": "落坑"
  },
  {
  "n": 7,
  "name": "双叉岭上",
  "style": "blackfigure",
  "sub": "希腊黑绘陶 · 前 530 年",
  "beats": 5,
  "inst": "里拉琴、双管笛",
  "scene": "黑剪影的虎与僧，回纹带滚动，陶土红刻线",
  "text": "双叉岭"
  },
  {
  "n": 8,
  "name": "两界山头",
  "style": "mosaic",
  "sub": "罗马马赛克 · 100 年",
  "beats": 6,
  "inst": "水风琴、铙钹",
  "scene": "马赛克拼出五行山，山下压着猴，砖块逐块翻面",
  "text": "两界山"
  },
  {
  "n": 9,
  "name": "陡涧换马",
  "style": "hanstone",
  "sub": "汉画像石 · 150 年",
  "beats": 5,
  "inst": "筑、鼓",
  "scene": "石面浮雕：白马被龙吞，浪纹横走，拓片质感",
  "text": "换马"
  },
  {
  "n": 10,
  "name": "夜被火烧",
  "style": "gandhara",
  "sub": "犍陀罗佛像 · 200 年",
  "beats": 5,
  "inst": "箜篌、法螺",
  "scene": "佛光背屏，寺院起火，火焰纹卷成卷草",
  "text": "火"
  },
  {
  "n": 11,
  "name": "失却袈裟",
  "style": "ajanta",
  "sub": "阿旃陀壁画 · 500 年",
  "beats": 5,
  "inst": "维纳琴、手鼓",
  "scene": "洞窟壁上菩萨低眉，僧人抱着空衣架",
  "text": "袈裟"
  },
  {
  "n": 12,
  "name": "收降八戒",
  "style": "dunhuang",
  "sub": "敦煌北魏壁画 · 500 年",
  "beats": 5,
  "inst": "筚篥、羯鼓",
  "scene": "土红矿物色，飞天飘带，猪面神跪地",
  "text": "八戒"
  },
  {
  "n": 13,
  "name": "黄风怪阻",
  "style": "byzantine",
  "sub": "拜占庭镶嵌 · 550 年",
  "beats": 5,
  "inst": "管风琴、钟",
  "scene": "金底镶嵌，黄风从右侧横扫，衣褶成几何",
  "text": "黄风"
  },
  {
  "n": 14,
  "name": "请求灵吉",
  "style": "starmap",
  "sub": "敦煌星图 · 700 年",
  "beats": 5,
  "inst": "笙、碰铃",
  "scene": "圆盘星图，定风丹在中心，星点连成风向，黄风被收进一点",
  "text": "定风丹"
  },
  {
  "n": 15,
  "name": "流沙难渡",
  "style": "tanggongbi",
  "sub": "盛唐工笔 · 750 年",
  "beats": 5,
  "inst": "琵琶、箫",
  "scene": "细线描流沙，沙粒成浪，僧立岸边",
  "text": "流沙"
  },
  {
  "n": 16,
  "name": "收得沙僧",
  "style": "celtic",
  "sub": "凯尔特泥金 · 800 年",
  "beats": 5,
  "inst": "竖琴、手摇风琴",
  "scene": "首字母「沙」由绳结盘成，卷草里探出沙僧的脸",
  "text": "沙"
  },
  {
  "n": 17,
  "name": "四圣显化",
  "style": "songlandscape",
  "sub": "宋山水 · 1100 年",
  "beats": 5,
  "inst": "古琴、箫",
  "scene": "云山间一座庄院，母女四人招亲；转眼庄院化作松林，八戒被吊在树上",
  "text": "四圣"
  },
  {
  "n": 18,
  "name": "五庄观中",
  "style": "songbird",
  "sub": "宋院体花鸟 · 1100 年",
  "beats": 5,
  "inst": "筝、笛",
  "scene": "绢本上人参果树，果实像婴孩，鸟落枝头",
  "text": "人参果"
  },
  {
  "n": 19,
  "name": "难活人参",
  "style": "emaki",
  "sub": "日本绘卷 · 1130 年",
  "beats": 5,
  "inst": "尺八、三味线",
  "scene": "长卷里果树倒下又立起，云纹分隔场景",
  "text": "人参"
  },
  {
  "n": 20,
  "name": "贬退心猿",
  "style": "stainedglass",
  "sub": "哥特彩色玻璃 · 1220 年",
  "beats": 6,
  "inst": "管风琴、钟",
  "scene": "彩窗上戴金箍的猴被推出光，铅条分割",
  "text": "贬"
  },
  {
  "n": 21,
  "name": "黑松林失散",
  "style": "persian",
  "sub": "波斯细密画 · 1400 年",
  "beats": 5,
  "inst": "乌德琴、手鼓",
  "scene": "层叠松林像花园，四散人影，金云",
  "text": "黑松林"
  },
  {
  "n": 22,
  "name": "宝象国捎书",
  "style": "fresco",
  "sub": "文艺复兴湿壁画 · 1480 年",
  "beats": 5,
  "inst": "鲁特琴、竖笛",
  "scene": "信使递书，公主在窗后，透视街景",
  "text": "捎书"
  },
  {
  "n": 23,
  "name": "金銮殿变虎",
  "style": "davinci",
  "sub": "达芬奇手稿 · 1490 年",
  "beats": 6,
  "inst": "古钢琴、人声",
  "scene": "泛黄手稿：人变虎的解剖图，镜像文字标注",
  "text": "变虎"
  },
  {
  "n": 24,
  "name": "平顶山逢魔",
  "style": "bluewhite",
  "sub": "明代青花 · 1500 年",
  "beats": 5,
  "inst": "箫、瓷磬",
  "scene": "青花山水里的葫芦，钴蓝晕散，云纹",
  "text": "平顶山"
  },
  {
  "n": 25,
  "name": "莲花洞高悬",
  "style": "raphael",
  "sub": "拉斐尔 · 1510 年",
  "beats": 5,
  "inst": "管风琴、弦乐",
  "scene": "高悬的僧人，构图稳定，衣褶如雕塑",
  "text": "高悬"
  },
  {
  "n": 26,
  "name": "乌鸡国救主",
  "style": "mingprint",
  "sub": "明代版画 · 1592 年",
  "beats": 5,
  "inst": "三弦、梆子",
  "scene": "万历刻本：井底国王被拉出，回目框，粗黑刻线",
  "text": "救主"
  },
  {
  "n": 27,
  "name": "被魔化身",
  "style": "baroque",
  "sub": "巴洛克 · 1640 年",
  "beats": 5,
  "inst": "大提琴、定音鼓",
  "scene": "强明暗里两个唐僧并立，火光只照亮半张脸",
  "text": "化身"
  },
  {
  "n": 28,
  "name": "号山逢怪",
  "style": "dutchstill",
  "sub": "荷兰静物 · 1650 年",
  "beats": 5,
  "inst": "羽管键琴、竖笛",
  "scene": "静物桌上烛火、果子之间藏着一件红肚兜，烛焰悄悄变红",
  "text": "号山"
  },
  {
  "n": 29,
  "name": "风摄圣僧",
  "style": "rimpa",
  "sub": "琳派金屏风 · 1700 年",
  "beats": 5,
  "inst": "筝、太鼓",
  "scene": "金地屏风，没骨火焰，僧被风卷起",
  "text": "风"
  },
  {
  "n": 30,
  "name": "心猿遭害",
  "style": "rococo",
  "sub": "洛可可 · 1750 年",
  "beats": 5,
  "inst": "长笛、竖琴",
  "scene": "粉色云里三昧真火，曲线轻盈",
  "text": "火"
  },
  {
  "n": 31,
  "name": "请圣降妖",
  "style": "neoclassic",
  "sub": "新古典 · 1780 年",
  "beats": 5,
  "inst": "弦乐、圆号",
  "scene": "观音踏莲自天而降，庄严构图",
  "text": "请圣"
  },
  {
  "n": 32,
  "name": "黑河沉没",
  "style": "nianhua",
  "sub": "清代年画 · 1800 年",
  "beats": 5,
  "inst": "唢呐、锣鼓",
  "scene": "渡船翻进黑水，鼍龙探头，大红大绿，黑线勾边",
  "text": "黑河"
  },
  {
  "n": 33,
  "name": "搬运车迟",
  "style": "puppet",
  "sub": "中国皮影 · 1800 年",
  "beats": 5,
  "inst": "板胡、梆子",
  "scene": "半透明牛皮，铆钉关节，幕后油灯，和尚们拉车上坡的剪影",
  "text": "车迟"
  },
  {
  "n": 34,
  "name": "大赌输赢",
  "style": "papercut",
  "sub": "中国剪纸 · 1800 年",
  "beats": 5,
  "inst": "唢呐、小锣",
  "scene": "红纸剪出的斗法场面，纸屑飘落",
  "text": "赌"
  },
  {
  "n": 35,
  "name": "祛道兴僧",
  "style": "ukiyoe",
  "sub": "浮世绘 · 1830 年",
  "beats": 5,
  "inst": "三味线、尺八",
  "scene": "三清像在巨浪里碎开，浪爪如指",
  "text": "僧"
  },
  {
  "n": 36,
  "name": "路逢大水",
  "style": "romantic",
  "sub": "浪漫主义 · 1840 年",
  "beats": 5,
  "inst": "弦乐、定音鼓",
  "scene": "雾海孤舟，天光从云缝压下",
  "text": "大水"
  },
  {
  "n": 37,
  "name": "身落天河",
  "style": "cyanotype",
  "sub": "蓝晒 · 1840 年",
  "beats": 5,
  "inst": "玻璃琴、水声",
  "scene": "蓝白负像，僧与马坠入河水，边缘晕开",
  "text": "天河"
  },
  {
  "n": 38,
  "name": "鱼篮现身",
  "style": "impressionism",
  "sub": "印象派 · 1870 年",
  "beats": 5,
  "inst": "钢琴、长笛",
  "scene": "水面光斑抖动，鱼篮与鱼在光里闪",
  "text": "鱼篮"
  },
  {
  "n": 39,
  "name": "兜山遇怪",
  "style": "pointillism",
  "sub": "点彩 · 1886 年",
  "beats": 5,
  "inst": "弦乐震音、竖琴",
  "scene": "彩色点拼出独角兕，金刚琢把天兵的兵器一件件套走",
  "text": "金兜"
  },
  {
  "n": 40,
  "name": "普天神难伏",
  "style": "vangogh",
  "sub": "后印象·梵高 · 1889 年",
  "beats": 6,
  "inst": "双簧管、弦乐",
  "scene": "星空漩涡里天兵天将压下来，柏树如焰",
  "text": "神兵"
  },
  {
  "n": 41,
  "name": "问佛根源",
  "style": "gauguin",
  "sub": "高更·象征 · 1890 年",
  "beats": 5,
  "inst": "木管、手鼓",
  "scene": "平涂色块，灵山与佛手，浓色块",
  "text": "灵山"
  },
  {
  "n": 42,
  "name": "吃水遭毒",
  "style": "expressionism",
  "sub": "表现主义 · 1893 年",
  "beats": 5,
  "inst": "大提琴、铜管",
  "scene": "扭曲的河，血色天空，腹痛的长弯线",
  "text": "子母河"
  },
  {
  "n": 43,
  "name": "西梁国留婚",
  "style": "nouveau",
  "sub": "新艺术 · 1896 年",
  "beats": 5,
  "inst": "竖琴、长笛",
  "scene": "藤蔓与卷发缠住僧人，金边，慕夏式构图",
  "text": "留婚"
  },
  {
  "n": 44,
  "name": "琵琶洞受苦",
  "style": "fauvism",
  "sub": "野兽派 · 1905 年",
  "beats": 5,
  "inst": "钢琴、小号",
  "scene": "纯红与蓝的大色块，蝎尾扎下",
  "text": "琵琶"
  },
  {
  "n": 45,
  "name": "再贬心猿",
  "style": "klimt",
  "sub": "克里姆特 · 1907 年",
  "beats": 5,
  "inst": "弦乐、竖琴",
  "scene": "金袍与眼形纹，猴被推远，金屑飘",
  "text": "再贬"
  },
  {
  "n": 46,
  "name": "难辨猕猴",
  "style": "cubism",
  "sub": "立体主义 · 1912 年",
  "beats": 6,
  "inst": "打击乐、萨克斯",
  "scene": "两只猴的正脸侧脸叠成一张，真假难分",
  "text": "真假"
  },
  {
  "n": 47,
  "name": "路阻火焰山",
  "style": "futurism",
  "sub": "未来主义 · 1912 年",
  "beats": 6,
  "inst": "铜管、鼓",
  "scene": "火被切成多视角速度线，山与人叠在一起",
  "text": "火焰山"
  },
  {
  "n": 48,
  "name": "求取芭蕉扇",
  "style": "constructivism",
  "sub": "构成主义 · 1920 年",
  "beats": 5,
  "inst": "军鼓、铜管",
  "scene": "红楔切入黑圆，芭蕉扇成放射几何",
  "text": "芭蕉扇"
  },
  {
  "n": 49,
  "name": "收缚魔王",
  "style": "silentfilm",
  "sub": "默片 · 1920 年",
  "beats": 5,
  "inst": "钢琴、留声机噪声",
  "scene": "黑白胶片，光圈里绳缚牛魔王，划痕闪烁",
  "text": "缚"
  },
  {
  "n": 50,
  "name": "赛城扫塔",
  "style": "bauhaus",
  "sub": "包豪斯 · 1923 年",
  "beats": 5,
  "inst": "木琴、单簧管",
  "scene": "几何塔身，指针转动，扫帚成对角线",
  "text": "扫塔"
  },
  {
  "n": 51,
  "name": "取宝救僧",
  "style": "artdeco",
  "sub": "Art Deco · 1925 年",
  "beats": 5,
  "inst": "萨克斯、竖琴",
  "scene": "金线放射纹的宝塔，舍利像球体",
  "text": "宝"
  },
  {
  "n": 52,
  "name": "棘林吟咏",
  "style": "muralism",
  "sub": "墨西哥壁画 · 1930 年",
  "beats": 5,
  "inst": "铜管、鼓",
  "scene": "群像拥挤，树精与诗人同框，土色厚涂",
  "text": "吟"
  },
  {
  "n": 53,
  "name": "小雷音遇难",
  "style": "isotype",
  "sub": "Isotype 信息图 · 1930 年",
  "beats": 5,
  "inst": "木琴、打字机",
  "scene": "象形图标排成假佛寺，僧人图标被困",
  "text": "小雷音"
  },
  {
  "n": 54,
  "name": "诸天神遭困",
  "style": "surreal",
  "sub": "超现实 · 1931 年",
  "beats": 5,
  "inst": "玻璃琴、弦乐滑音",
  "scene": "软钟、长影，天将融在空间里",
  "text": "困"
  },
  {
  "n": 55,
  "name": "稀柿衕秽阻",
  "style": "wpa",
  "sub": "WPA 海报 · 1936 年",
  "beats": 5,
  "inst": "铜管、钢琴",
  "scene": "八戒变作大猪拱开烂柿子山，英雄劳动者式平面色块，粗字",
  "text": "开路"
  },
  {
  "n": 56,
  "name": "朱紫国行医",
  "style": "noir",
  "sub": "黑色电影 · 1945 年",
  "beats": 5,
  "inst": "萨克斯、低音提琴",
  "scene": "百叶窗光条扫过病榻，悬丝诊脉，烟",
  "text": "行医"
  },
  {
  "n": 57,
  "name": "拯救疲癃",
  "style": "abstractexp",
  "sub": "抽象表现 · 1950 年",
  "beats": 5,
  "inst": "爵士鼓、钢琴",
  "scene": "泼溅与滴流，颜色压成病与愈",
  "text": "愈"
  },
  {
  "n": 58,
  "name": "降妖取后",
  "style": "lianhuanhua",
  "sub": "中国连环画 · 1960 年",
  "beats": 5,
  "inst": "二胡、琵琶",
  "scene": "黑白线描：悟空救回金圣宫娘娘，紫金铃滚落，留白",
  "text": "取后"
  },
  {
  "n": 59,
  "name": "七情迷没",
  "style": "swiss",
  "sub": "瑞士国际主义 · 1960 年",
  "beats": 5,
  "inst": "电子脉冲、木琴",
  "scene": "严格网格，蛛丝排成矩阵，七情图标",
  "text": "七情"
  },
  {
  "n": 60,
  "name": "多目遭伤",
  "style": "pop",
  "sub": "波普 · 1963 年",
  "beats": 5,
  "inst": "电吉他、鼓",
  "scene": "本戴点底上排满眼睛，粗黑描边",
  "text": "多目"
  },
  {
  "n": 61,
  "name": "路阻狮驼",
  "style": "opart",
  "sub": "欧普 · 1965 年",
  "beats": 5,
  "inst": "合成器、颤音",
  "scene": "黑白振动条纹，狮驼岭在视错觉里晃动",
  "text": "狮驼"
  },
  {
  "n": 62,
  "name": "怪分三色",
  "style": "kirby",
  "sub": "美漫 Kirby · 1965 年",
  "beats": 5,
  "inst": "铜管、鼓",
  "scene": "能量点、放射线、拟声大字，三魔同框",
  "text": "三色"
  },
  {
  "n": 63,
  "name": "城里遇灾",
  "style": "ascii",
  "sub": "终端 ASCII · 1970 年",
  "beats": 5,
  "inst": "调制解调器、方波",
  "scene": "字符拼出狮驼城与大鹏，光标闪烁",
  "text": "灾"
  },
  {
  "n": 64,
  "name": "请佛收魔",
  "style": "cyberpunk",
  "sub": "赛博朋克霓虹 · 1982 年",
  "beats": 5,
  "inst": "合成器、鼓机",
  "scene": "雨夜霓虹，佛手从楼上伸下，青紫光",
  "text": "收魔"
  },
  {
  "n": 65,
  "name": "比丘救子",
  "style": "pixel8",
  "sub": "8-bit 像素 · 1985 年",
  "beats": 5,
  "inst": "方波、芯片音",
  "scene": "像素笼子里的孩子，问号块，HUD",
  "text": "救子"
  },
  {
  "n": 66,
  "name": "辨认真邪",
  "style": "inkanim",
  "sub": "中国水墨动画 · 1988 年",
  "beats": 5,
  "inst": "古琴、箫",
  "scene": "墨色晕开，国丈现出白鹿原形，寿星牵鹿而去",
  "text": "真邪"
  },
  {
  "n": 67,
  "name": "松林救怪",
  "style": "ghibli",
  "sub": "吉卜力水彩 · 1988 年",
  "beats": 5,
  "inst": "钢琴、弦乐",
  "scene": "水彩松林，白鼠精伏在影子里，草叶摆动",
  "text": "救怪"
  },
  {
  "n": 68,
  "name": "僧房卧病",
  "style": "vhs",
  "sub": "VHS · 1988 年",
  "beats": 5,
  "inst": "合成器、磁带噪声",
  "scene": "磁带噪点与跟踪条，病榻，画面抖动",
  "text": "病"
  },
  {
  "n": 69,
  "name": "无底洞遭困",
  "style": "wireframe",
  "sub": "早期 CG 线框 · 1990 年",
  "beats": 5,
  "inst": "合成器琶音",
  "scene": "绿色线框洞穴向下坠，僧变成线框",
  "text": "无底"
  },
  {
  "n": 70,
  "name": "灭法国难行",
  "style": "arcade16",
  "sub": "16-bit 街机 · 1991 年",
  "beats": 5,
  "inst": "芯片贝斯、鼓",
  "scene": "横版卷轴夜城，血条，僧潜行",
  "text": "灭法"
  },
  {
  "n": 71,
  "name": "隐雾山遇魔",
  "style": "lowpoly",
  "sub": "低多边形 · 1995 年",
  "beats": 5,
  "inst": "环境合成器",
  "scene": "三角面雾山，豹子精从低模里扑出",
  "text": "隐雾山"
  },
  {
  "n": 72,
  "name": "凤仙郡求雨",
  "style": "paperpuppet",
  "sub": "定格纸偶 · 2000 年",
  "beats": 5,
  "inst": "木琴、手风琴",
  "scene": "纸质关节人偶，手作布景，雨滴是纸屑",
  "text": "求雨"
  },
  {
  "n": 73,
  "name": "失落兵器",
  "style": "sandart",
  "sub": "沙画 · 2000 年",
  "beats": 5,
  "inst": "手鼓、弦乐",
  "scene": "灯箱沙画，兵器从沙里散落又聚起",
  "text": "失"
  },
  {
  "n": 74,
  "name": "会庆钉钯",
  "style": "stencil",
  "sub": "涂鸦模板 · 2005 年",
  "beats": 5,
  "inst": "鼓机、低音",
  "scene": "喷绘的钉钯宴，墙角滴漆，粗模板字",
  "text": "钉钯"
  },
  {
  "n": 75,
  "name": "竹节山遭难",
  "style": "collage",
  "sub": "拼贴剪报 · 2010 年",
  "beats": 5,
  "inst": "打字机、弦乐拨奏",
  "scene": "报纸剪出的九头狮，白剪纸边，拼贴层叠",
  "text": "竹节山"
  },
  {
  "n": 76,
  "name": "玄英洞受苦",
  "style": "webtoon",
  "sub": "韩式 webtoon · 2010 年",
  "beats": 5,
  "inst": "电子鼓、合成器",
  "scene": "竖长格条漫，犀牛精分格出现，彩色平涂",
  "text": "犀牛"
  },
  {
  "n": 77,
  "name": "赶捉犀牛",
  "style": "vaporwave",
  "sub": "蒸汽波 · 2012 年",
  "beats": 5,
  "inst": "合成器、延迟",
  "scene": "霓虹落日、棕榈、假名，四木禽星追赶",
  "text": "赶捉"
  },
  {
  "n": 78,
  "name": "天竺招婚",
  "style": "isometric",
  "sub": "3D 等距 · 2015 年",
  "beats": 5,
  "inst": "马林巴、合成器",
  "scene": "等距婚宴，玉兔精排布在小格子里",
  "text": "招婚"
  },
  {
  "n": 79,
  "name": "铜台府监禁",
  "style": "flatcorp",
  "sub": "商务扁平 · 2015 年",
  "beats": 5,
  "inst": "电子节拍、提示音",
  "scene": "扁平图标牢房，人物排成一排，柔和光",
  "text": "监禁"
  },
  {
  "n": 80,
  "name": "凌云渡脱胎",
  "style": "shinkai",
  "sub": "新海诚光影 · 2016 年",
  "beats": 6,
  "inst": "钢琴、弦乐",
  "scene": "天光穿云，水面发光，僧脱去凡胎，无底船",
  "text": "脱胎"
  },
  {
  "n": 81,
  "name": "老鼋落水",
  "style": "generative",
  "sub": "当代生成艺术 · 2026 年",
  "beats": 6,
  "inst": "合成器、合唱",
  "scene": "老鼋一晃，经书落水，汉字拆成粒子再聚回",
  "text": "九九归真"
  }
  ];
  // v10 timing: every 难 holds 2 bars at 90 BPM (5.33 s); the six landmark 难 hold 3 bars (8 s). size keeps the v09 panel width.
  const LONG = new Set([1, 8, 20, 46, 80, 81]);
  XY.ALL_CELLS.forEach(c => { if (c.size == null) c.size = c.beats; c.beats = LONG.has(c.n) ? 12 : 8; });
  XY.ALL_NAMES = XY.ALL_CELLS.map(c => c.name);
  const q = new URLSearchParams(location.search).get('cells'), only = window.__ONLY || (q ? q.split(',').map(Number) : null);
  XY.CELLS = XY.ALL_CELLS.filter(c => !only || only.includes(c.n)).map(c => Object.assign({}, c));
  XY.STYLES = XY.STYLES || {};
  XY.buildTimeline();
  window.__DURATION = XY.DURATION;
})();
