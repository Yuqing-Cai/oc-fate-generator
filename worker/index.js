addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

// SiliconFlow API Key
const SILICONFLOW_API_KEY = "sk-yuetuomayutjasvjqilxwlhouvlyfuxjabgbpknzjwmnitnw";
const SILICONFLOW_API_URL = "https://api.siliconflow.cn/v1/chat/completions";

// Available Pro models (fast ones)
const AVAILABLE_MODELS = [
  "Pro/Qwen/Qwen2.5-72B-Instruct",
  "Pro/Qwen/Qwen3-235B-A22B-Thinking-2507",
  "Pro/zai-org/GLM-5",
  "Pro/moonshotai/Kimi-K2.5",
  "Pro/MiniMaxAI/MiniMax-M2.5",
  "Pro/deepseek-ai/DeepSeek-V3",
  "Pro/deepseek-ai/DeepSeek-R1",
];

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
    return handleGenerate(request, corsHeaders);
  }

  if (url.pathname === "/health") {
    return new Response(JSON.stringify({ 
      status: "ok", 
      timestamp: new Date().toISOString(),
      models: AVAILABLE_MODELS 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }

  if (url.pathname === "/models") {
    return new Response(JSON.stringify({ models: AVAILABLE_MODELS }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }

  return new Response(JSON.stringify({ error: "Not Found" }), {
    status: 404,
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  });
}

async function handleGenerate(request, corsHeaders) {
  try {
    const body = await request.json();
    const { 
      selections = [], 
      model = "Pro/zai-org/GLM-5", 
      extraPrompt = "" 
    } = body;

    if (!Array.isArray(selections) || selections.length < 3) {
      return new Response(JSON.stringify({ error: "至少选择 3 项轴要素" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    }

    // Validate model is in allowed list
    const selectedModel = AVAILABLE_MODELS.includes(model) ? model : "Pro/zai-org/GLM-5";

    const mode = selections.some(s => ['F','X','T','G'].includes(s.axis?.toUpperCase())) ? "timeline" : "opening";
    
    const systemPrompt = buildSystemPrompt(mode);
    const axesText = selections.map(s => `- ${s.axis}: ${s.option}${s.detail ? ' - ' + s.detail : ''}`).join('\n');
    const userPrompt = `已选轴要素：\n${axesText}\n${extraPrompt ? '补充偏好：' + extraPrompt : ''}\n\n模式：${mode === "timeline" ? "完整时间线骨架（包含 timeline 和 ending_payoff）" : "开场静态"}`;

    const response = await fetch(SILICONFLOW_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${SILICONFLOW_API_KEY}`
      },
      body: JSON.stringify({
        model: selectedModel,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.62,
        max_tokens: mode === "timeline" ? 3200 : 2400
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API Error: ${response.status} - ${errorText}`);
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content || "";

    if (!content) {
      throw new Error("AI 返回空内容");
    }

    return new Response(JSON.stringify({ 
      content, 
      mode, 
      model: selectedModel,
      usage: data?.usage 
    }), {
      headers: { "Content-Type": "application/json", ...corsHeaders }
    });

  } catch (err) {
    console.error(`Generate error: ${err.message}`);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders }
    });
  }
}

function buildSystemPrompt(mode) {
  return `你是'OC 男主设定总设计师'。基于用户选择的轴要素，生成高完成度男主设定。

模式：${mode === "timeline" ? "完整时间线骨架" : "开场静态"}

核心要求：
1. 输出 markdown 格式，结构清晰
2. 男主档案必须详细（800+ 字），包含 MBTI、九型人格、副型
3. 不要给 MC 命名，用"她"或"MC"指代
4. 每个字段都要有具体场景和行为证据，不要空洞形容词
5. 开场场景要有环境细节、动作细节、心理波动和关键对话

必须包含的章节：
- 设定总览（overview）
- 男主档案（male_profile）：含 MBTI、九型、副型、详细背景
- 世界切片（world_slice）
- MC 视角（mc_intel）
- 关系动力学（relationship_dynamics）
- 轴映射说明（axis_mapping）
- 开场场景（opening_scene）
- 开场金句（opening_line）
- 男主人设限制（male_constraints，6 条）
- 权衡说明（tradeoff_notes）
- 重生成建议（regen_suggestion）

${mode === "timeline" ? "- 时间线（timeline）\n- 终局兑现（ending_payoff）" : ""}

记住：要写活生生的人，不是标签集合。温柔要有代价，强大要有软肋。`;
}
