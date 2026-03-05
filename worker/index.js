addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

const SILICONFLOW_API_KEY = "sk-yuetuomayutjasvjqilxwlhouvlyfuxjabgbpknzjwmnitnw";
const SILICONFLOW_API_URL = "https://api.siliconflow.cn/v1/chat/completions";

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

  return new Response(JSON.stringify({ error: "Not Found" }), {
    status: 404,
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  });
}

async function handleGenerate(request, corsHeaders) {
  try {
    const body = await request.json();
    const { selections = [], model = "Pro/zai-org/GLM-5", extraPrompt = "" } = body;

    if (!selections || selections.length < 3) {
      return new Response(JSON.stringify({ error: "至少选择 3 项轴要素" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    }

    const selectedModel = AVAILABLE_MODELS.includes(model) ? model : "Pro/zai-org/GLM-5";
    const mode = selections.some(s => ['F','X','T','G'].includes(s.axis?.toUpperCase())) ? "timeline" : "opening";
    
    const axesText = selections.map(s => `- ${s.axis}: ${s.option}`).join('\n');
    const userPrompt = `已选轴要素：\n${axesText}\n${extraPrompt ? '补充：' + extraPrompt : ''}\n模式：${mode}`;
    
    const systemPrompt = `你是 OC 男主设定总设计师。基于用户选择的轴要素生成高完成度男主设定。模式：${mode === "timeline" ? "完整时间线" : "开场静态"}。要求：markdown 格式，男主档案 800+ 字，包含 MBTI/九型/副型，不给 MC 命名，要有具体场景和行为证据。`;

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
      throw new Error(`API ${response.status}: ${errorText.slice(0, 200)}`);
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content || "";

    if (!content) {
      throw new Error("AI 返回空内容");
    }

    return new Response(JSON.stringify({ content, mode, model: selectedModel }), {
      headers: { "Content-Type": "application/json", ...corsHeaders }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders }
    });
  }
}
