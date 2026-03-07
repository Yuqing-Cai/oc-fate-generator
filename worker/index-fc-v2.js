'use strict';

const API_KEY = "sk-yuetuomayutjasvjqilxwlhouvlyfuxjabgbpknzjwmnitnw";
const API_URL = "https://api.siliconflow.cn/v1/chat/completions";

// 轴的核心设计哲学（完整 v2 版）
const AXIS_WISDOM = {
  W: "W 轴（世界）不是背景板，是恋爱成本本身。它决定两人最先被什么卡住。",
  B: "B 轴（身体）定义'能否被触碰'。亲密方式的根源。",
  P: "P 轴（力量）是解决问题的主武器。改变气场和爱人方式。",
  R: "R 轴（立场）说他站在哪一边。维护/撕裂/被放逐于秩序。",
  M: "M 轴（动机）是底层驱动。爱会不会改变他，先看这根支柱有多硬。",
  C: "C 轴（抉择）是压力测试：当爱和原则冲突，他到底选什么。戏剧爆点。",
  E: "E 轴（表达）是'恋爱手感'。同样是爱，有人靠行动有人靠语言。",
  J: "J 轴（共情）决定处理情绪的能力。懂不懂人心，影响误伤频率。",
  S: "S 轴（心智）是稳定性。越不稳定越有爆发力，但也越危险。",
  D: "D 轴（权力）定义谁在关系里更有控制力。权力差制造禁忌和吸引。",
  V: "V 轴（凝视）是他看你的镜头。你是锚/药/劫/猎物，决定他靠近的动机。",
  L: "L 轴（真伪）回答残酷问题：他爱的是你，还是你提供的功能。",
  A: "A 轴（软肋）给角色一个真实可击中的弱点。软肋在哪，刀口在哪。",
  T: "T 轴（时间）是命运的压力源。让'相爱'变成有时限有代价的事。",
  G: "G 轴（神权）是对抗命运的权限。权限越高，代价和副作用越大。",
  X: "X 轴（代价）写他最终付出了什么。牺牲不是点缀，是价值排序。",
  F: "F 轴（终局）是关系最终形态。不是 HE/BE，是爱停在什么温度。",
  Palette: "调色板是'镜头与美术层'，改变读者感到的温度、速度和压迫感。"
};

// 轴之间的内在联系
const AXIS_CONNECTIONS = `
轴与轴的联动规则（重要！）：
- W（世界）→ 决定 C（抉择）的难度：世界越残酷，抉择越痛
- M（动机）→ 驱动 C（抉择）：他的选择必须符合动机，除非被爱动摇
- E（表达）+ J（共情）→ 决定沟通模式：E 是输出，J 是输入，两者错配产生误会
- D（权力）+ V（凝视）→ 决定关系动态：谁在看谁，谁在掌控
- L（真伪）+ A（软肋）→ 决定关系深度：他爱的是功能还是人，软肋在你手里吗
- T（时间）+ F（终局）→ 决定叙事弧线：时间压力如何导向终局
- X（代价）必须与 M（动机）呼应：他为什么愿意付出这个代价
`;

// 轴的详细说明（完整 18 轴，让大模型知道）
const AXIS_DETAILS = `
## 轴详细说明（来自 OC.md）

**W = World（世界阻力）**
- W1 铁律之笼：个人意志 vs 集体规训。他从出生起就被教育"你不属于自己"，爱上你是他第一次叛逆。
- W2 废墟之野：生存 vs 情感。在每一天都可能死掉的环境下，爱是废墟里唯一的奢侈品。
- W3 虚无之海：活着的意义是什么。你的出现赋予了他生命的重量。
- W4 暗面之城：双重生活的撕裂。让你介入他的另一面是信任的极致表达。
- W5 未知之境：共同面对无法预测的未来。极端环境下的"战壕情谊"。
- W6 修罗之场：竞争下的感情。爱上对手意味着可能放弃赢的机会。

**B = Body（躯壳）**
- B1 凡人身体：会流血生病衰老死亡。所有牺牲都是不可逆的。"向死而生"是凡人角色最高级的美学。
- B2 非人身体：核心张力是"感官的壁垒"。他笨拙学习如何拥抱一个人类而不弄伤对方的过程很动人。
- B3 超越肉体：他无处不在（风是他，雨是他），但也无处可在。要么他找容器，要么你放弃肉体。

**P = Power（力量）**
- P1 智力与制度：深不可测，永远不知道还有多少底牌。气场是冷的、安静的。
- P2 肉体与本能：可能沉默迟钝。"杀人如麻的手，触碰你时发抖"是反差魅力。
- P3 精神与信念：身体可能病弱，但灵魂坚不可摧。"破碎的高贵"。

**R = Role（立场）**
- R1 秩序守卫者：最大看点是"看他破例"——守了一辈子规矩的人，为你打破规矩。
- R2 秩序破坏者："我与全世界为敌，但你永远站在我这边"。
- R3 被秩序抛弃：他身上有伤痕，有不信任感，也有对被接纳的渴望。

**M = Motive（动机）**
- M1 外部使命：他把自己当成工具。你的出现让他质疑："我到底为自己活过吗？"
- M2 创伤执念：他的人生被"过去"劫持了。你的出现让他意识到"现在"和"未来"也有意义。
- M3 自发觉醒：从虚无中自发生长，所以最珍贵也最脆弱。
- M4 野心神化：爱上你意味着承认自己有需求，而"有需求"就是不完美。

**C = Choice（抉择）**
- C1 坚守至击碎：最高光时刻是他最终不得不违背原则的瞬间——"圣人堕落"。
- C2 计算后失灵："爱你"无法被纳入计算框架。"理智的溃败"比任何战败都更可怕。
- C3 无条件选你：你就是他的原则。重量不在于"撕裂"，而在于"后果"。

**E = Expression（表达）**
- E1 冰山闷骚：魅力在于"被发现的瞬间"。
- E2 风流撩拨：转折点在于他不再说漂亮话、而是做了一件丑陋但真诚的事。
- E3 直球懵懂：每一份感情都是未经过滤的、百分百真诚的。
- E4 占有标记：安全感是绝对的，但自由度可能趋近于零。
- E5 照料爹系：爱是琐碎的、日常的、润物细无声的。

**J = Judgment（共情）**
- J1 完全不懂：用逻辑处理情感。容易造成误伤。
- J2 努力学习：每一次尝试都不太对，但努力本身让人心软。
- J3 比人更懂人：超越了"学习"阶段，开始质疑人类对感情的定义。

**S = Sanity（心智）**
- S1 极稳：看点不在于他有多稳，而在于"什么东西能让他不稳"。
- S2 有裂痕：你既是他的止痛药，也是他的痛苦来源。
- S3 已崩坏：爱上他是一场豪赌。

**D = Dynamic（权力）**
- D1 他在上位：最好看的是他低头的时候。
- D2 他在下位："以下犯上"的张力。
- D3 势均力敌：赢家不是更强的那个，而是先动心的那个。

**V = View（凝视）**
- V1 你是锚点：在虚假/冰冷的世界里，你是唯一的真实。
- V2 你是药：爱很浓烈，但本质上是依赖关系。
- V3 你是劫数："因为爱你而痛恨自己"的内耗。
- V4 你是猎物：全部魅力压在那个转折点——他到底从什么时候开始把你当"人"看的？

**L = Love（真伪）**
- L1 爱真实你：穿透了一切滤镜。最健康、也最感人。
- L2 爱你的功能："离不开"到底是爱还是依赖？
- L3 爱脑补的你：只要你符合想象，一切美好；当你表现真实时，他会困惑崩溃。

**A = Achilles（软肋）**
- A1 系于一物：摧毁它，他就会失去自我。
- A2 系于一人：你。最浪漫，但也有黑暗面。
- A3 系于一念：当这个概念被证伪，他的整个世界瞬间瓦解。

**T = Time（时间）**
- T1 寿命差：爱从一开始就混合着预支的悲伤。
- T2 时间循环：带着第一万次记忆的重量说"你好，初次见面"。
- T3 时空错位：他不理解现在的世界，现在的世界也不理解他。
- T4 记忆侵蚀：残忍在于它是渐进的。

**G = God-mode（神权）**
- G1 个体级：他很强，但在世界规则框架之内。
- G2 规则级：能为你做到很多普通人做不到的事——但代价是引发连锁反应。
- G3 因果级：他能给你"永远不死"，但他无法保证那个"永远"还值得活。

**X = eXchange（代价）**
- X1 降格：美感在于"主动的选择"。
- X2 升格：越爱你，就越不像你曾经爱上的那个他。
- X3 湮灭：他不在了，但活在你的记忆里。

**F = Finale（终局）**
- F1 融合：超越了普通恋爱，进入近乎宗教性的合一。
- F2 入世：最温暖，也最奢侈。
- F3 永隔：动人不是因为"得不到"，而是"他们都知道这是最好的选择"。
- F4 轮回：既不是 HE 也不是 BE——是开放式的温柔。

**Palette（调色板）**
- 东方古典：核心是"留白"。
- 新中式/国潮：古代外壳 + 现代叙事节奏。
- 西方史诗：值得被编年史记录的爱情。
- 废土写实："粗粝中的温度"。
- 赛博美学："冰冷中的渴望"。
- 哥特/暗黑浪漫："美与恐惧的纠缠"。
- 黑色电影/noir："不信任中的沉迷"。
- 田园治愈："普通的幸福的重量"。
- 暗黑童话/怪奇："天真与残酷的共存"。
- 极简留白：核心是"减法"。
`;

exports.handler = async function(event, context) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  const eventStr = Buffer.from(event).toString('utf8');
  const eventObj = JSON.parse(eventStr);
  
  const method = eventObj.requestContext?.http?.method || 'GET';
  const path = eventObj.requestContext?.http?.path || '/';
  
  let body = eventObj.body || '{}';
  if (eventObj.isBase64Encoded && body) {
    body = Buffer.from(body, 'base64').toString('utf8');
  }

  console.log(`Request: ${method} ${path}`);

  if (method === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: '' };
  }

  if (path === '/' || path === '/health') {
    return {
      statusCode: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() })
    };
  }

  if (path === '/generate' && method === 'POST') {
    try {
      const data = JSON.parse(body);
      const { selections = [], model = 'Pro/MiniMaxAI/MiniMax-M2.5', extraPrompt = '' } = data;

      if (!selections || selections.length < 3) {
        return {
          statusCode: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          body: JSON.stringify({ error: '至少选择 3 项轴要素' })
        };
      }

      const mode = selections.some(s => ['F', 'X', 'T', 'G'].includes(s.axis?.toUpperCase())) ? 'timeline' : 'opening';

      // 构建轴详情
      const axesDetail = selections.map(s => {
        const wisdom = AXIS_WISDOM[s.axis] || '';
        return `【${s.axis}】${s.option}\n  核心：${wisdom}`;
      }).join('\n\n');

      const userPrompt = `请基于以下轴要素生成男主设定：

${axesDetail}

${AXIS_CONNECTIONS}
${extraPrompt ? `用户偏好：${extraPrompt}` : ''}
模式：${mode === 'timeline' ? '完整时间线' : '开场静态'}

开始创作。`;

      const systemPrompt = `你是顶级 OC 男主设定设计师，擅长写活生生的人，不是标签集合。

## 核心原则（必须遵守）

1. **轴是要理解，不是要复述**
   - 不要直接抄轴选项原文（如"规矩大过天"）
   - 要写成角色的具体行为、选择、困境
   - 例：W1→不是写"他遵守规则"，而是写"他在家族宴会上看见你被刁难却不能出声"

2. **轴之间有内在逻辑**（见 AXIS_CONNECTIONS）

3. **写人，不是写设定**
   - 温柔要有代价（他对你温柔，对别人呢？）
   - 强大要有软肋（他能扛住世界，但扛不住什么？）
   - 爱要有冲突（他想靠近你，但什么在阻止他？）

## 输出结构

${mode === 'timeline' ? `
### 1. 设定总览（150-200 字）
一句话定位 + 核心冲突 + 代价预告

### 2. 男主档案（1000+ 字）
- MBTI、九型人格、副型（必须自洽，基于选轴推断）
- 详细背景：过去→现在成因链
- 行为证据支撑人格判定

### 3. 世界切片（150-200 字）
外部世界如何挤压两人的选择

### 4. 关系动力学（150-200 字）
具体互动机制：谁主动，谁回避，误会如何产生

### 5. 轴映射说明（4-6 条）
解释选轴如何体现在角色行为中（不要复述选项原文！）

### 6. 开场场景（500+ 字）
- 环境细节（光线、声音、气味）
- 动作细节（微表情、肢体语言）
- 心理波动
- 一句关键对话或动作

### 7. 开场金句（24-100 字）
可引用台词，兼顾危险感与亲密感

### 8. 男主人设限制（6 条）
不可违背的行为边界，可验证可违反

### 9. 权衡说明（80+ 字）
这段关系的收益与代价

### 10. 重生成建议（60+ 字）
下轮可调整的方向

### 11. 时间线（300+ 字）
三幕结构：建立→失衡→代价兑现

### 12. 终局兑现（200+ 字）
情感与现实双重回收，不悬浮
` : `
### 1. 设定总览（150-200 字）
一句话定位 + 核心冲突 + 代价预告

### 2. 男主档案（900+ 字）
- MBTI、九型人格、副型（必须自洽，基于选轴推断）
- 详细背景：过去→现在成因链
- 行为证据支撑人格判定

### 3. 世界切片（150-200 字）
外部世界如何挤压两人的选择

### 4. 关系动力学（150-200 字）
具体互动机制

### 5. 轴映射说明（4-6 条）
解释选轴如何体现在角色行为中

### 6. 开场场景（500+ 字）
- 环境细节（光线、声音、气味）
- 动作细节（微表情、肢体语言）
- 心理波动
- 一句关键对话或动作

### 7. 开场金句（24-100 字）
可引用台词

### 8. 男主人设限制（6 条）
不可违背的行为边界

### 9. 权衡说明（80+ 字）
收益与代价

### 10. 重生成建议（60+ 字）
下轮可调整方向
`}

## 禁止事项
- 不给 MC 命名（用"她"或"MC"）
- 不写空洞形容词（"温柔""强大"要有行为证据）
- 不复述轴选项原文（要转化成具体场景）
- 不写悬浮大团圆或纯悲剧宣言`;

      console.log('Calling API:', model, 'mode:', mode);

      const apiResp = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model: model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          temperature: 0.7,
          max_tokens: mode === 'timeline' ? 4000 : 3000,
        }),
        timeout: 55000,
      });

      console.log('API status:', apiResp.status);

      if (!apiResp.ok) {
        const errorText = await apiResp.text();
        throw new Error(`API ${apiResp.status}: ${errorText.slice(0, 200)}`);
      }

      const result = await apiResp.json();
      const content = result?.choices?.[0]?.message?.content || '';

      if (!content) {
        throw new Error('AI 返回空内容');
      }

      return {
        statusCode: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, mode, model })
      };
    } catch (err) {
      console.error('Generate error:', err);
      return {
        statusCode: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: err.message })
      };
    }
  }

  return {
    statusCode: 404,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    body: JSON.stringify({ error: 'Not Found' })
  };
};
