// OC Interactive Web - Frontend

const AXIS_LABELS = {
  W: "W = World（世界）", B: "B = Body（躯壳）", P: "P = Power（力量）", R: "R = Role（立场）",
  M: "M = Motive（动机）", C: "C = Choice（抉择）", E: "E = Expression（表达）", J: "J = Judgment（共情）",
  S: "S = Sanity（心智）", D: "D = Dynamic（权力）", V: "V = View（凝视）", L: "L = Love（真伪）",
  A: "A = Achilles（软肋）", T: "T = Time（时间）", G: "G = God-mode（神权）", X: "X = eXchange（代价）",
  F: "F = Finale（终局）", Palette: "调色板（美学风格）",
};

const AXIS_WISDOM = {
  W: "W 轴（世界）不是背景板，是恋爱成本本身。",
  B: "B 轴（身体）定义'能否被触碰'。",
  P: "P 轴（力量）是解决问题的主武器。",
  R: "R 轴（立场）说他站在哪一边。",
  M: "M 轴（动机）是底层驱动。",
  C: "C 轴（抉择）是压力测试。",
  E: "E 轴（表达）是'恋爱手感'。",
  J: "J 轴（共情）决定处理情绪的能力。",
  S: "S 轴（心智）是稳定性。",
  D: "D 轴（权力）定义谁在关系里更有控制力。",
  V: "V 轴（凝视）是他看你的镜头。",
  L: "L 轴（真伪）回答残酷问题。",
  A: "A 轴（软肋）给角色一个弱点。",
  T: "T 轴（时间）是命运的压力源。",
  G: "G 轴（神权）是对抗命运的权限。",
  X: "X 轴（代价）写他最终付出了什么。",
  F: "F 轴（终局）是关系最终形态。",
  Palette: "调色板是'镜头与美术层'。"
};

// 轴之间的联动规则（每个轴只展示相关的）
const AXIS_LINKS = {
  W: "W 轴（世界）决定了 C 轴（抉择）的难度——世界越残酷，抉择越痛。",
  M: "M 轴（动机）驱动 C 轴（抉择）——他的选择必须符合动机，除非被爱动摇。同时，X 轴（代价）必须与 M 轴呼应：他为什么愿意付出这个代价？",
  C: "C 轴（抉择）受 W 轴（世界）影响（世界越残酷，抉择越痛），并被 M 轴（动机）驱动（选择必须符合动机，除非被爱动摇）。",
  E: "E 轴（表达）+ J 轴（共情）= 沟通模式——E 是输出，J 是输入，两者错配会产生误会。",
  J: "J 轴（共情）+ E 轴（表达）= 沟通模式——E 是输出，J 是输入，两者错配会产生误会。",
  D: "D 轴（权力）+ V 轴（凝视）= 关系动态——谁在看谁，谁在掌控。",
  V: "V 轴（凝视）+ D 轴（权力）= 关系动态——谁在看谁，谁在掌控。",
  L: "L 轴（真伪）+ A 轴（软肋）= 关系深度——他爱的是功能还是人？软肋在你手里吗？",
  A: "A 轴（软肋）+ L 轴（真伪）= 关系深度——他爱的是功能还是人？软肋在你手里吗？",
  T: "T 轴（时间）+ F 轴（终局）= 叙事弧线——时间压力如何导向终局。",
  F: "F 轴（终局）+ T 轴（时间）= 叙事弧线——时间压力如何导向终局。",
  X: "X 轴（代价）必须与 M 轴（动机）呼应——他为什么愿意付出这个代价？"
};

// 完整的轴详细说明（基于 OC.md 风格）
const AXIS_DETAILS = {
  W: {
    intro: "故事发生在什么样的世界里，外部阻力是什么。任何一种世界类型都可以被写得'日常化'——日常感是一种叙事选择，不是世界类型。",
    options: {
      "W1 铁律之笼": "适用于朝堂/军队/财阀/严格制度。核心矛盾：个人意志 vs 集体规训。他从出生起就被教育'你不属于自己'，爱上你是他第一次叛逆。",
      "W2 废墟之野": "适用于末日/战乱/废土。核心矛盾：生存 vs 情感。在每一天都可能死掉的环境下，爱是废墟里唯一的奢侈品。",
      "W3 虚无之海": "物质富足但精神空洞。核心矛盾：活着的意义是什么。你的出现赋予了他生命的重量。",
      "W4 暗面之城": "表面正常，底下有东西（都市奇幻/怪谈/双面生活）。核心矛盾：双重生活的撕裂。让你介入他的另一面是信任的极致表达。",
      "W5 未知之境": "星际/异世界/探索。核心矛盾：共同面对无法预测的未来。极端环境下的'战壕情谊'。",
      "W6 修罗之场": "选秀/科举/商战/零和博弈。核心矛盾：竞争下的感情。爱上对手意味着可能放弃赢的机会。"
    }
  },
  B: {
    intro: "他有没有身体？什么样的身体？这决定了你们最基本的互动方式——能不能拥抱，能不能一起变老。",
    options: {
      "B1 凡人身体": "会流血，会生病，会衰老，会死。所有牺牲都是不可逆的。'向死而生'是凡人角色最高级的美学。",
      "B2 非人身体": "机械/妖灵/异质。核心张力是'感官的壁垒'——他摸不到你的体温，或不知道力度会不会捏碎你。笨拙学习如何拥抱的过程很动人。",
      "B3 超越肉体": "概念/系统级存在。他无处不在（风是他，雨是他），但也无处可在（没有可以拥抱的实体）。要么他找容器，要么你放弃肉体。"
    }
  },
  P: {
    intro: "他的力量是什么类型的。这决定了他散发出来的气场。不管他拿这股力量做了什么（那是 R 轴的事）。",
    options: {
      "P1 智力与制度": "靠脑子、资源、规则。深不可测，永远不知道还有多少底牌。气场是冷的、安静的，像一潭看不见底的水。",
      "P2 肉体与本能": "靠武力、速度、本能。可能沉默迟钝，因为从小只被教如何杀戮，没人教如何温柔。'杀人如麻的手，触碰你时发抖'是反差魅力。",
      "P3 精神与信念": "身体可能病弱，但灵魂坚不可摧。美感在于'破碎的高贵'——哪怕被踩在泥潭里，眼神依然清亮。"
    }
  },
  R: {
    intro: "他跟现有秩序的关系。P 轴管他有什么力量，R 轴管他拿这股力量做了什么。",
    options: {
      "R1 秩序守卫者": "圣骑士/大师兄/检察官。他是规则的化身。最大看点是'看他破例'——守了一辈子规矩的人，为你打破规矩。",
      "R2 秩序破坏者": "魔教教主/反派 BOSS/革命军。他与全世界为敌，但为你划出安全区。'我与全世界为敌，但你永远站在我这边'。",
      "R3 被秩序抛弃": "废太子/被遗弃的实验体/退役机器人。他身上有伤痕，有不信任感，也有对被接纳的渴望。激发'想捡他回家'的冲动。"
    }
  },
  M: {
    intro: "他为什么活着。每个角色心里都有一根支柱，弄清楚这根支柱是什么，你就知道恋爱的核心冲突在哪。",
    options: {
      "M1 外部使命": "守护苍生/执行审判/保护人类。他把自己当成工具。你的出现让他质疑：'我到底为自己活过吗？'",
      "M2 创伤执念": "童年噩梦/血海深仇/无法弥补的过错。他的人生被'过去'劫持了。你的出现让他意识到'现在'和'未来'也有意义。",
      "M3 自发觉醒": "一张白纸突然'想要活下去'或'想要爱你'。没有任何外部理由，从虚无中自发生长，所以最珍贵也最脆弱。",
      "M4 野心神化": "他活着是为了登顶。爱上你意味着承认自己有需求，而'有需求'就是不完美。你是他通天塔上唯一的裂缝。"
    }
  },
  C: {
    intro: "当 M 轴的支柱因为爱上你而动摇时，他的反应模式。这是制造戏剧冲突最核心的轴。",
    options: {
      "C1 坚守至击碎": "他有一条绝对不能越过的线。最高光时刻是他最终不得不违背原则的瞬间——'圣人堕落'之所以迷人，是因为你看见完美人格在爱面前出现裂缝。",
      "C2 计算后失灵": "他没有道德洁癖，只看利弊。转折点在于：'爱你'无法被纳入计算框架。'理智的溃败'比任何战败都更可怕。",
      "C3 无条件选你": "你就是他的原则。没有挣扎，是绝对的、本能的。重量不在于'撕裂'，而在于'后果'——他会为你做任何事，包括你不希望的事。"
    }
  },
  E: {
    intro: "决定了角色的'恋爱风格'，是谈恋爱时最直接影响阅读体验的部分。",
    options: {
      "E1 冰山闷骚": "嘴上永远不说，但做了一切。魅力在于'被发现的瞬间'——当你终于意识到他一直在默默守护你。",
      "E2 风流撩拨": "话很多，很会说。转折点在于他不再说漂亮话、而是做了一件丑陋但真诚的事。",
      "E3 直球懵懂": "不懂含蓄，喜欢就直接说。每一份感情都是未经过滤的、百分百真诚的。",
      "E4 占有标记": "宣告所有权。安全感是绝对的，但自由度可能趋近于零。",
      "E5 照料爹系": "照顾你的一切。爱是琐碎的、日常的、润物细无声的。"
    }
  },
  J: {
    intro: "他理解人类的感情吗？特别适用于非人类角色，但对人类角色也适用。",
    options: {
      "J1 完全不懂": "用逻辑处理情感。'你在流泪，这意味着排出多余水分。我应该给你补水吗？'不是冷酷，是真的不理解。容易造成误伤。",
      "J2 努力学习": "他知道自己在'感情'领域是文盲。偷偷翻数据库、观察人类情侣、笨拙模仿电视剧。每一次尝试都不太对，但努力本身让人心软。",
      "J3 比人更懂人": "超越了'学习'阶段，开始质疑人类对感情的定义。'你们把多巴胺冲动叫爱情——那我对你的感觉凭什么不算？'"
    }
  },
  S: {
    intro: "精神状态。这是整份指南里最'活'的一个轴，会因为你而变化。",
    options: {
      "S1 极稳": "他是一块磐石。看点不在于他有多稳，而在于'什么东西能让他不稳'。当永远冷静的人突然失控，冲击力是毁灭性的。",
      "S2 有裂痕": "他知道自己有问题（PTSD/身份危机）。白天维持运转，夜晚崩塌。你既是他的止痛药，也是他的痛苦来源。",
      "S3 已崩坏": "逻辑混乱，充斥幻觉。他眼中的世界和正常人完全不同。爱上他是一场豪赌——不知道他下一秒会温柔抚摸你，还是把你当敌人。"
    }
  },
  D: {
    intro: "你们之间的权力关系。几乎不可能从头到尾保持不变——权力会翻转。",
    options: {
      "D1 他在上位": "师尊/帝王/造物主。最好看的是他低头的时候——一个可以对全世界颐指气使的人，在你面前变得笨拙。",
      "D2 他在下位": "侍卫/奴隶/保镖。'以下犯上'的张力——平时是温顺的狗，被逼急了会露出獠牙。",
      "D3 势均力敌": "宿敌/同僚。赢家不是更强的那个，而是先动心的那个。"
    }
  },
  V: {
    intro: "在他眼里你是什么，决定了他爱你的'质地'。可以是递进的：猎物→药→锚点。",
    options: {
      "V1 你是锚点": "在虚假/冰冷的世界里，你是唯一的真实。对于帝王，你是他唯一不需要伪装的人；对于 AI，你是他理解'意义'的起点。",
      "V2 你是药": "只有你能让他平静/不疼/感觉活着。爱很浓烈，但本质上是依赖关系。如果有一天你想离开，他可能不会允许。",
      "V3 你是劫数": "你是他完美人生里的唯一瑕疵。他恨这种失控，讨厌自己因为你而软弱，但无法自拔。'因为爱你而痛恨自己'的内耗。",
      "V4 你是猎物": "一开始你在他眼里不是'人'（实验对象/棋子/玩具/晚餐）。全部魅力压在那个转折点——他到底从什么时候开始把你当'人'看的？"
    }
  },
  L: {
    intro: "他爱的到底是不是你。最好的处理方式是让 L 轴经历完整进化：L2/L3→L1。",
    options: {
      "L1 爱真实你": "穿透了一切滤镜，爱上的就是你本人——包括你的平庸、暴脾气、早上乱糟糟的头发。最健康、也最感人。",
      "L2 爱你的功能": "你是他的解药/充电器/维修工。'离不开'到底是爱还是依赖？如果出现了另一个也能让他平静的人，他会怎么选？",
      "L3 爱脑补的你": "把你当成了完美的女神/救世主/逝去之人的影子。只要你符合想象，一切美好；当你表现真实、不完美的一面时，他会困惑崩溃。"
    }
  },
  A: {
    intro: "每个角色都应该有一个’按下去就会崩溃'的开关。这是非常好的剧情工具。",
    options: {
      "A1 系于一物": "一个旧物件/一段代码/一枚戒指。摧毁它，他就会失去自我。反派可以利用它威胁他，你可以通过守护它表达爱。",
      "A2 系于一人": "你。你受伤了他就暴走，你笑了他就停止毁灭世界。最浪漫，但也有黑暗面——如果你死了，没有人能阻止他。",
      "A3 系于一念": "'正义'/'真理'/'复仇'。一个抽象概念支撑着他的全部存在。当这个概念被证伪，他的整个世界瞬间瓦解。"
    }
  },
  T: {
    intro: "时间是恋爱故事中最古老也最有效的刀子。四种典型的时间虐法。",
    options: {
      "T1 寿命差": "他是神/AI/吸血鬼，你是凡人。残酷不在于'你死了'，而在于他从爱上你那一刻就知道这个结果。爱从一开始就混合着预支的悲伤。",
      "T2 时间循环": "对你初次见面，对他已是第一万次。他在无数时间线里尝试拯救你，每一次都失败，每一次你都忘记了他。带着第一万次记忆的重量说'你好，初次见面'。",
      "T3 时空错位": "他从封印/休眠/过去醒来，世界天翻地覆。你是他在这个陌生新世界里唯一认识的面孔。他不理解现在的世界，现在的世界也不理解他。",
      "T4 记忆侵蚀": "他正在忘记你，或你正在忘记他。残忍在于它是渐进的——今天还记得你的名字，明天只记得轮廓，后天看着你问'你是谁？'"
    }
  },
  G: {
    intro: "他的力量能覆盖多大的范围？决定了他为你能做到什么程度，也决定了'代价'的重量。",
    options: {
      "G1 个体级": "能帮你挡子弹/黑监控/救你一命。他很强，但在世界规则框架之内。无法改变让你陷入险境的制度或命运本身。限制让故事更有张力。",
      "G2 规则级": "世界的掌权者之一。能修改法律/操控市场/影响局部自然。能为你做到很多普通人做不到的事——但代价是引发连锁反应，影响无数其他人的命运。",
      "G3 因果级": "他是神，或等价于神。能修改世界底层法则——包括'死亡'本身。为了不让你死，他可以重写因果律。但代价是：世界底层逻辑被篡改后，现实开始扭曲、bug 蔓延。"
    }
  },
  X: {
    intro: "他为了这段感情，最终失去了什么？与 F 轴是因果关系——他做出了什么样的牺牲（X），直接决定了关系最终变成什么形态（F）。",
    options: {
      "X1 降格": "神变成人，帝王变成庶民，AI 删除高级功能。主动放弃让他'高人一等'的部分，降落到你所在的平面。美感在于'主动的选择'——他不是被剥夺，而是心甘情愿交出。",
      "X2 升格": "为了保护你，他必须变得更强——代价是变得更冷酷、更非人。从守护者变成暴君。越爱你，就越不像你曾经爱上的那个他。",
      "X3 湮灭": "终极牺牲。他的存在是你生存的对立面，他的消亡是你存活的前提。他不在了，但活在你的记忆里，活在你因为他而改变的人生轨迹里。"
    }
  },
  F: {
    intro: "X 轴决定了他付出了什么，F 轴描述了这一切尘埃落定之后，你们的关系变成了什么样子。",
    options: {
      "F1 融合": "意识融合/赛博飞升/血拥永生/魂魄合一。不再是两个独立个体——'在一起'变成了存在的方式。超越了普通恋爱，进入近乎宗教性的合一。",
      "F2 入世": "他留在你的世界，学着过凡人的生活。买菜/做饭/挤地铁/为水电费发愁。最温暖，也最奢侈——意味着一切外在阻力都被克服了。",
      "F3 永隔": "他回到他该回的地方——天上/深渊/代码海洋/过去。遥遥相爱，但注定无法共存。动人不是因为'得不到'，而是'他们都知道这是最好的选择'。",
      "F4 轮回": "此生此世无法善终，但留下微弱但确定的希望。'下辈子我还找你'。既不是 HE 也不是 BE——是开放式的温柔。刀子扎了，但裹了一层纱布。"
    }
  },
  Palette: {
    intro: "以上所有的轴定义了故事的骨架和内脏。但最终呈现给读者的'长什么样'，取决于你选择用什么美学风格来包裹它。风格和内容轴是正交的。",
    options: {
      "东方古典": "水墨/丝帛/竹林/月光。核心是'留白'——不写的部分比写出来的更重要。擅长渲染克制的深情、命运的无常、'此情可待成追忆'式的遗憾。",
      "新中式/国潮": "朱砂和鎏金的浓，不是水墨的淡。古代外壳 + 现代叙事节奏。'我在长安城破之前亲你一口'的炸裂。强烈视觉冲击、快节奏、古今混血。",
      "西方史诗": "交响乐/大教堂/骑士誓言/燃烧的战场。讲究仪式感和崇高感。值得被编年史记录的爱情——不私密，是一件值得被全世界知道的壮举。",
      "废土写实": "锈铁/尘沙/绷带/罐头。没有漂亮话，没有背景音乐。核心是'粗粝中的温度'——环境越恶劣，越简陋的温柔越有分量。",
      "赛博美学": "霓虹灯/阴雨/义体/全息投影。城市永远湿漉漉的，颜色永远过饱和。核心是'冰冷中的渴望'——科技越发达，人心越孤独，一点点真实体温就弥足珍贵。",
      "哥特/暗黑浪漫": "烛光/天鹅绒/荆棘/古堡/带血的玫瑰。核心是'美与恐惧的纠缠'。死亡不是丑陋的，是另一种形式的华丽。",
      "黑色电影/noir": "高对比光影/阴雨街巷/烟雾酒吧/百叶窗条纹阴影。没有人是无辜的。核心是'不信任中的沉迷'——他看着你的眼神同时包含'我想亲你'和'我在算计你'。",
      "田园治愈": "阳光/草地/风铃/猫/亚麻围裙。核心是'普通的幸福的重量'。没有轰轰烈烈，只有每天早上醒来他还在你旁边这件微小而确定的事实。",
      "暗黑童话/怪奇": "森林面具/会说话的骨头/苔藓石像/裂开瓷娃娃。核心是'天真与残酷的共存'。世界有自己的、扭曲的、但逻辑自洽的规则。",
      "极简留白": "大面积白色灰色/极少对话/漫长沉默。核心是'减法'——去掉所有多余修饰、情节、语言，只留下最本质的情感内核。"
    }
  }
};

const AXIS_CONNECTIONS = `
轴与轴的联动规则（重要！）：
• W（世界）→ 决定 C（抉择）的难度：世界越残酷，抉择越痛
• M（动机）→ 驱动 C（抉择）：他的选择必须符合动机，除非被爱动摇
• E（表达）+ J（共情）→ 决定沟通模式：E 是输出，J 是输入，两者错配产生误会
• D（权力）+ V（凝视）→ 决定关系动态：谁在看谁，谁在掌控
• L（真伪）+ A（软肋）→ 决定关系深度：他爱的是功能还是人，软肋在你手里吗
• T（时间）+ F（终局）→ 决定叙事弧线：时间压力如何导向终局
• X（代价）必须与 M（动机）呼应：他为什么愿意付出这个代价
`;

const AXES = {
  W: { desc: "世界阻力", options: { "W1 铁律之笼": "规矩大过天", "W2 废墟之野": "先活下去再谈爱", "W3 虚无之海": "人心空掉了", "W4 暗面之城": "白天正常夜里有秘密", "W5 未知之境": "一起闯未知地图", "W6 修罗之场": "同一赛道竞争" } },
  B: { desc: "身体边界", options: { "B1 凡人身体": "会衰老受伤", "B2 非人身体": "机械/妖灵/异质", "B3 超越肉体": "概念或系统级存在" } },
  P: { desc: "力量类型", options: { "P1 智力与制度": "靠脑子资源和规则", "P2 肉体与本能": "靠身体素质和战斗", "P3 精神与信念": "靠意志力和信念" } },
  R: { desc: "立场关系", options: { "R1 秩序守卫者": "维护规则", "R2 秩序破坏者": "挑战规则", "R3 被秩序抛弃": "体系外流亡者" } },
  M: { desc: "动机支柱", options: { "M1 外部使命": "被赋予任务", "M2 创伤执念": "被过去劫持", "M3 自发觉醒": "主动选择", "M4 野心神化": "追逐登顶" } },
  C: { desc: "动摇时抉择", options: { "C1 坚守至击碎": "先死扛最后被打碎", "C2 计算后失灵": "理性但算不明白", "C3 无条件选你": "第一反应永远是你" } },
  E: { desc: "感情表达", options: { "E1 冰山闷骚": "嘴硬手软", "E2 风流撩拨": "语言高手", "E3 直球懵懂": "真诚不过滤", "E4 占有标记": "独占式", "E5 照料爹系": "日常守护" } },
  J: { desc: "共情能力", options: { "J1 完全不懂": "情感盲区", "J2 努力学习": "笨拙但认真", "J3 比人更懂人": "超越常规" } },
  S: { desc: "精神状态", options: { "S1 极稳": "冷静如磐石", "S2 有裂痕": "撑着不崩", "S3 已崩坏": "逻辑失序" } },
  D: { desc: "权力结构", options: { "D1 他在上位": "高位者低头", "D2 他在下位": "下位者越界", "D3 势均力敌": "对抗式亲密" } },
  V: { desc: "他的凝视", options: { "V1 你是锚点": "你让他觉得世界是真的", "V2 你是药": "没有你他会失控", "V3 你是劫数": "你是他最大软肋", "V4 你是猎物": "利用变在乎" } },
  L: { desc: "爱的真伪", options: { "L1 爱真实你": "接受真实的你", "L2 爱你的功能": "离不开你的价值", "L3 爱脑补的你": "爱想象中的你" } },
  A: { desc: "致命软肋", options: { "A1 系于一物": "关键载体", "A2 系于一人": "你即开关", "A3 系于一念": "信念崩塌" } },
  T: { desc: "时间残酷", options: { "T1 寿命差": "预支悲伤", "T2 时间循环": "单向记忆负担", "T3 时空错位": "认知断层", "T4 记忆侵蚀": "渐进遗忘" } },
  G: { desc: "神权范围", options: { "G1 个体级": "只能救局部", "G2 规则级": "可改制度", "G3 因果级": "可改世界底层" } },
  X: { desc: "牺牲代价", options: { "X1 降格": "放弃高位属性", "X2 升格": "变强但异化", "X3 湮灭": "自我彻底消失" } },
  F: { desc: "关系终局", options: { "F1 融合": "合一不分", "F2 入世": "回归日常", "F3 永隔": "相爱不同界", "F4 轮回": "此生不成来世续" } },
  Palette: { desc: "美学风格", options: { "东方古典": "诗性留白克制深情", "新中式/国潮": "高饱和古今混血", "西方史诗": "宏大仪式感", "废土写实": "粗粝求生感", "赛博美学": "霓虹冷感", "哥特/暗黑浪漫": "华丽危险", "黑色电影/noir": "高对比光影", "田园治愈": "日常慢热", "暗黑童话/怪奇": "童真下残酷", "极简留白": "沉默更有信息量" } }
};

const API_URL = "https://oc-geneator-api-iqzixhxuwa.cn-hangzhou.fcapp.run/generate";
const AVAILABLE_MODELS = [
  { value: "Pro/MiniMaxAI/MiniMax-M2.5", label: "MiniMax M2.5 (推荐，快)" },
  { value: "Pro/zai-org/GLM-5", label: "GLM-5 (均衡)" },
  { value: "Pro/moonshotai/Kimi-K2.5", label: "Kimi K2.5" },
  { value: "Pro/moonshotai/Kimi-K2-Instruct-0905", label: "Kimi K2 Instruct" },
  { value: "Pro/deepseek-ai/DeepSeek-V3.2", label: "DeepSeek V3.2 (最新)" },
  { value: "Pro/deepseek-ai/DeepSeek-V3.1-Terminus", label: "DeepSeek V3.1 Terminus" },
  { value: "Pro/deepseek-ai/DeepSeek-V3", label: "DeepSeek V3" },
  { value: "Pro/zai-org/GLM-4.7", label: "GLM-4.7" },
];
const DEFAULT_MODEL = "Pro/MiniMaxAI/MiniMax-M2.5";

let axisContainer, selectedCountEl, generateBtn, resultEl, statusEl, extraPromptInput, modelSelect;
let timerInterval = null, startTime = null;

document.addEventListener('DOMContentLoaded', () => {
  axisContainer = document.getElementById("axisContainer");
  selectedCountEl = document.getElementById("selectedCount");
  generateBtn = document.getElementById("generateBtn");
  resultEl = document.getElementById("result");
  statusEl = document.getElementById("status");
  extraPromptInput = document.getElementById("extraPrompt");
  modelSelect = document.getElementById("modelSelect");
  renderAxes();
  renderModelSelector();
  updateSelectedCount();
  generateBtn.addEventListener("click", generate);
});

function startTimer() {
  startTime = Date.now();
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    if (statusEl) statusEl.textContent = `${statusEl.textContent.replace(/⏱️ [\d.]+s/, '').trim()} ⏱️ ${elapsed}s`;
  }, 100);
}

function stopTimer() {
  if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
  return startTime ? ((Date.now() - startTime) / 1000).toFixed(1) : 0;
}

function renderModelSelector() {
  if (!modelSelect) return;
  const savedModel = localStorage.getItem("oc_model") || DEFAULT_MODEL;
  modelSelect.innerHTML = AVAILABLE_MODELS.map(m => `<option value="${m.value}" ${m.value === savedModel ? 'selected' : ''}>${m.label}</option>`).join('');
  modelSelect.addEventListener('change', () => { localStorage.setItem("oc_model", modelSelect.value); });
}

function renderAxes() {
  if (!axisContainer) return;
  Object.entries(AXES).forEach(([axisName, cfg]) => {
    const group = document.createElement("section");
    group.className = "axis-group";
    const head = document.createElement("div");
    head.className = "axis-head";
    head.innerHTML = `<div style="display:flex;align-items:center;"><h3>${AXIS_LABELS[axisName] || axisName}</h3><button class="help-btn" data-axis="${axisName}" title="查看说明">?</button></div><span class="chip">${Object.keys(cfg.options).length}项</span>`;
    const optionsWrap = document.createElement("div");
    optionsWrap.className = "options";
    Object.entries(cfg.options).forEach(([opt, detail], index) => {
      const id = `${axisName}-${index}`;
      const code = getCode(opt);
      const label = document.createElement("label");
      label.className = "option-item";
      label.innerHTML = `<div class="option-name"><input type="checkbox" data-axis="${axisName}" data-code="${code}" value="${opt}" id="${id}" /><span>${opt}</span></div><div class="option-desc">${detail}</div>`;
      optionsWrap.appendChild(label);
    });
    group.appendChild(head);
    group.appendChild(optionsWrap);
    axisContainer.appendChild(group);
  });
  axisContainer.addEventListener("click", (e) => {
    if (e.target?.matches(".help-btn")) showAxisHelp(e.target.dataset.axis);
  });
  axisContainer.addEventListener("change", (e) => {
    if (e.target?.matches("input[type='checkbox']") && e.target.checked) enforceSingleSelection(e.target);
    updateSelectedCount();
  });
}

function enforceSingleSelection(target) {
  const axis = target.dataset.axis;
  axisContainer.querySelectorAll(`input[type='checkbox'][data-axis='${axis}']`).forEach((cb) => { if (cb !== target) cb.checked = false; });
}

function getSelected() {
  return Array.from(axisContainer.querySelectorAll("input[type='checkbox']:checked")).map((item) => ({ axis: item.dataset.axis, option: item.value, code: item.dataset.code }));
}

function updateSelectedCount() {
  const selected = getSelected();
  if (selectedCountEl) selectedCountEl.textContent = `已选 ${selected.length} 项`;
  if (generateBtn) generateBtn.disabled = selected.length < 3;
}

function detectMode(selected) {
  return selected.some(s => ['F', 'X', 'T', 'G'].includes(s.axis?.toUpperCase())) ? 'timeline' : 'opening';
}

async function generate() {
  const selected = getSelected();
  if (selected.length < 3) { setStatus('至少选择 3 项轴要素', true); return; }
  
  // 清除之前的状态
  if (resultEl) resultEl.style.display = 'none';
  if (statusEl) {
    statusEl.textContent = '';
    statusEl.style.background = '#1a1a20';
  }
  
  setLoading(true);
  startTimer();
  try {
    const model = modelSelect?.value || DEFAULT_MODEL;
    const extraPrompt = extraPromptInput?.value || '';
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 120000);
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ selections: selected, model, extraPrompt }),
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    if (!response.ok) { const errData = await response.json(); throw new Error(errData.error || `HTTP ${response.status}`); }
    const data = await response.json();
    const elapsed = stopTimer();
    if (data.error) throw new Error(data.error);
    renderResultContent(data.content);
    setStatus(`✅ 生成完成（${elapsed}s）`, false);
  } catch (err) {
    stopTimer();
    setStatus(mapError(err.message), true);
  } finally {
    setLoading(false);
  }
}

function mapError(err) {
  if (err.includes('API')) return 'API 调用失败，请稍后重试';
  if (err.includes('网络') || err.includes('Failed')) return '网络错误，请检查网络连接';
  if (err.includes('至少')) return err;
  return err || '生成失败，请稍后重试';
}

function setLoading(loading) {
  if (generateBtn) { generateBtn.disabled = loading; generateBtn.textContent = loading ? '生成中...' : '✨ 生成设定'; }
}

function setStatus(text, isError) {
  if (statusEl) { statusEl.textContent = text; statusEl.style.background = isError ? '#3a1a1a' : '#1a3a2a'; }
}

function renderResultContent(text) {
  if (!resultEl) return;
  resultEl.style.display = 'block';
  resultEl.innerHTML = text.split('\n').map(line => {
    if (!line.trim()) return `<div class="result-line result-blank"></div>`;
    if (/^#{1,6}\s+/.test(line)) return `<h4 class="result-title">${escapeHtml(line.replace(/^#{1,6}\s+/, ""))}</h4>`;
    if (/^[-*]\s+/.test(line)) return `<div class="result-line result-bullet">${escapeHtml(line)}</div>`;
    return `<div class="result-line">${escapeHtml(line)}</div>`;
  }).join("");
  resultEl.scrollIntoView({ behavior: 'smooth' });
}

function escapeHtml(str) {
  return String(str || "").replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));
}

function getCode(optionLabel) {
  const m = /^([A-Z]\d)/.exec(optionLabel.trim());
  return m ? m[1] : optionLabel;
}

function showAxisHelp(axisName) {
  const cfg = AXES[axisName];
  const wisdom = AXIS_WISDOM[axisName] || '';
  const details = AXIS_DETAILS[axisName];
  const links = AXIS_LINKS[axisName];
  if (!cfg) return;
  
  const optionsList = Object.entries(cfg.options)
    .map(([opt, detail]) => {
      const extraDetail = details?.options?.[opt] || '';
      return `<li style="margin-bottom:14px;padding-bottom:14px;border-bottom:1px solid #333;"><div style="color:#00d4ff;font-size:14px;font-weight:600;margin-bottom:6px;">${opt}</div><div style="color:#aaa;font-size:13px;line-height:1.6;">${extraDetail || detail}</div></li>`;
    })
    .join('');
  
  const helpHtml = `
    <div style="position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.85);z-index:1000;display:flex;align-items:center;justify-content:center;padding:20px;" onclick="this.remove()">
      <div style="background:#1a1a20;border-radius:16px;padding:28px;max-width:700px;width:100%;max-height:85vh;overflow-y:auto;" onclick="event.stopPropagation()">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
          <h2 style="color:#00d4ff;margin:0;font-size:22px;">${AXIS_LABELS[axisName] || axisName}</h2>
          <button onclick="this.closest('div[style*=fixed]').remove()" style="background:none;border:none;color:#888;font-size:24px;cursor:pointer;padding:0;width:32px;height:32px;">&times;</button>
        </div>
        ${wisdom ? `<div style="background:linear-gradient(135deg,#25252d,#1f1f28);border-left:4px solid #00d4ff;padding:16px;margin-bottom:20px;border-radius:8px 0 0 8px;"><p style="color:#fff;margin:0;line-height:1.6;font-size:14px;">${wisdom}</p></div>` : ''}
        ${details?.intro ? `<p style="color:#aaa;margin-bottom:20px;line-height:1.6;font-size:14px;">${details.intro}</p>` : ''}
        <h3 style="color:#fff;margin:24px 0 16px;font-size:16px;border-bottom:2px solid #333;padding-bottom:8px;">所有选项详解：</h3>
        <ul style="list-style:none;padding:0;margin:0;">
          ${optionsList}
        </ul>
        ${links ? `<div style="background:linear-gradient(135deg,#25252d,#1f1f28);padding:16px;margin-top:24px;border-radius:12px;"><h4 style="color:#00d4ff;margin:0 0 10px;font-size:14px;">相关轴联动：</h4><p style="color:#aaa;margin:0;line-height:1.8;font-size:14px;">${links}</p></div>` : ''}
        <button onclick="this.closest('div[style*=fixed]').remove()" style="margin-top:24px;width:100%;padding:14px;background:linear-gradient(135deg,#00d4ff,#00b8e6);border:none;border-radius:10px;color:#000;font-weight:700;cursor:pointer;font-size:15px;box-shadow:0 4px 12px rgba(0,212,255,0.3);">关闭</button>
      </div>
    </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', helpHtml);
}
