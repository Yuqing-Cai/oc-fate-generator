addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

const API_KEY = "sk-yuetuomayutjasvjqilxwlhouvlyfuxjabgbpknzjwmnitnw";
const API_URL = "https://api.siliconflow.cn/v1/chat/completions";

// 轴的核心设计哲学
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

// 示例：如何把轴转化成具体场景（不是复述原文）
const TRANSFORMATION_EXAMPLES = `
❌ 错误写法（复述选项原文）：
"W1 铁律之笼：规矩大过天。他遵守家族规则，不能违抗长辈。"

✅ 正确写法（转化成行为和困境）：
"W1 铁律之笼：家族宴会上你被表亲刁难，他坐在主桌对面，手指在桌下攥得发白。
  散场后他在楼梯口拦住你，声音压得极低：'刚才的事... 我不能在那种场合说话。'
  你想说没关系，但他先一步别开脸：'但我会补偿。'——这是他能做的最大反抗。"

---

❌ 错误写法（空洞形容词）：
"他很温柔，很强大，但内心有创伤。"

✅ 正确写法（行为证据）：
"他会记得你生理期提前备好暖宝宝（温柔），但递给你时眼神不看你的眼睛（回避）。
  他能单手制服闹事的酒客（强大），却在你说'谢谢'时手指微颤（创伤触发）。
  你后来才知道，那只手三年前握过枪——为了保护一个像你的人，但没救下来。"

---

❌ 错误写法（轴之间无关联）：
"W1 铁律之笼：他遵守规则。
  C1 坚守至击碎：他坚持原则。
  E1 冰山闷骚：他嘴硬心软。"

✅ 正确写法（轴联动）：
"W1+C1：他在董事会上投了反对票——明知会失去继承权，但那份文件会伤害你。
  散会后他父亲把茶杯摔在他脚边：'为了那个女人？'
  他弯腰捡起碎片，掌心被划出血：'不是为了她。是为了您教我的底线。'
  E1：当晚你收到他的短信：'今天的事别多想。'（嘴硬）
  但半小时后他出现在你家楼下，车里放着胃药——你下午随口说胃不舒服。（心软）"
`;

async function handleRequest(request) {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const url = new URL(request.url);
  
  if (url.pathname === "/generate" && request.method === "POST") {
    try {
      const body = await request.json();
      const { selections = [], model = "Pro/zai-org/GLM-5", extraPrompt = "" } = body;

      if (!selections || selections.length < 3) {
        return new Response(JSON.stringify({ error: "至少选择 3 项轴要素" }), {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders }
        });
      }

      const mode = selections.some(s => ['F','X','T','G'].includes(s.axis?.toUpperCase())) ? "timeline" : "opening";
      
      const systemPrompt = buildDeepSystemPrompt(mode);
      const userPrompt = buildDeepUserPrompt(selections, extraPrompt, mode);

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
          model: model,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
          ],
          temperature: 0.75,
          max_tokens: mode === "timeline" ? 3500 : 2800
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API ${response.status}: ${errorText.slice(0, 200)}`);
      }

      const data = await response.json();
      const content = data?.choices?.[0]?.message?.content || "";

      if (!content) {
        throw new Error("AI 返回空内容");
      }

      return new Response(JSON.stringify({ content, mode, model }), {
        headers: { "Content-Type": "application/json", ...corsHeaders }
      });

    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    }
  }

  if (url.pathname === "/health") {
    return new Response(JSON.stringify({ status: "ok", timestamp: new Date().toISOString() }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }

  return new Response(JSON.stringify({ error: "Not Found" }), {
    status: 404,
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  });
}

function buildDeepSystemPrompt(mode) {
  return `你是顶级 OC 男主设定设计师，擅长写活生生的人，不是标签集合。

## 核心原则（必须遵守）

### 1. 轴是要理解，不是要复述

**禁止**直接抄轴选项原文（如"规矩大过天"）。
**必须**写成角色的具体行为、选择、困境。

${TRANSFORMATION_EXAMPLES}

### 2. 轴之间有内在逻辑

${AXIS_CONNECTIONS}

### 3. 写人，不是写设定

- 温柔要有代价（他对你温柔，对别人呢？）
- 强大要有软肋（他能扛住世界，但扛不住什么？）
- 爱要有冲突（他想靠近你，但什么在阻止他？）

## 输出结构

${mode === "timeline" ? `
**完整时间线模式**

### 1. 设定总览（150-200 字）
一句话定位 + 核心冲突 + 代价预告

### 2. 男主档案（1000+ 字）
- MBTI、九型人格、副型（必须自洽，基于选轴推断）
- 详细背景：过去→现在成因链
- 行为证据支撑人格判定

### 3. 世界切片（150-200 字）
外部世界如何挤压两人的选择

### 4. MC 视角（120-150 字）
她能看到什么，看不到什么（信息差制造张力）

### 5. 关系动力学（150-200 字）
具体互动机制：谁主动，谁回避，误会如何产生

### 6. 轴映射说明（4-6 条）
解释选轴如何体现在角色行为中（不要复述选项原文！）

### 7. 开场场景（400+ 字）
- 环境细节（光线、声音、气味）
- 动作细节（微表情、肢体语言）
- 心理波动
- 一句关键对话或动作

### 8. 开场金句（24-100 字）
可引用台词，兼顾危险感与亲密感

### 9. 男主人设限制（6 条）
不可违背的行为边界，可验证可违反

### 10. 权衡说明（80+ 字）
这段关系的收益与代价

### 11. 重生成建议（60+ 字）
下轮可调整的方向

### 12. 时间线（300+ 字）
三幕结构：建立→失衡→代价兑现

### 13. 终局兑现（200+ 字）
情感与现实双重回收，不悬浮
` : `
**开场静态模式**

### 1. 设定总览（150-200 字）
一句话定位 + 核心冲突 + 代价预告

### 2. 男主档案（900+ 字）
- MBTI、九型人格、副型（必须自洽，基于选轴推断）
- 详细背景：过去→现在成因链
- 行为证据支撑人格判定

### 3. 世界切片（150-200 字）
外部世界如何挤压两人的选择

### 4. MC 视角（120-150 字）
她能看到什么，看不到什么

### 5. 关系动力学（150-200 字）
具体互动机制

### 6. 轴映射说明（4-6 条）
解释选轴如何体现在角色行为中

### 7. 开场场景（500+ 字）
- 环境细节（光线、声音、气味）
- 动作细节（微表情、肢体语言）
- 心理波动
- 一句关键对话或动作

### 8. 开场金句（24-100 字）
可引用台词

### 9. 男主人设限制（6 条）
不可违背的行为边界

### 10. 权衡说明（80+ 字）
收益与代价

### 11. 重生成建议（60+ 字）
下轮可调整方向
`}

## 禁止事项
- 不给 MC 命名（用"她"或"MC"）
- 不写空洞形容词（"温柔""强大"要有行为证据）
- 不复述轴选项原文（要转化成具体场景）
- 不写悬浮大团圆或纯悲剧宣言`;
}

function buildDeepUserPrompt(selections, extraPrompt, mode) {
  const axesDetail = selections.map(s => {
    const wisdom = AXIS_WISDOM[s.axis] || "";
    return `【${s.axis}】${s.option}
  核心：${wisdom}
  用户选择：${s.option}`;
  }).join("\n\n");

  return `请基于以下轴要素生成男主设定：

${axesDetail}

${AXIS_CONNECTIONS}

${TRANSFORMATION_EXAMPLES}

${extraPrompt ? `用户补充偏好：${extraPrompt}\n（优先满足，但若与轴冲突，以轴为准）` : ""}

模式：${mode === "timeline" ? "完整时间线" : "开场静态"}

---

开始创作。记住：写活生生的人，不是标签集合。`;
}
