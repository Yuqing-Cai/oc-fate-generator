// config.js - API configuration, models, and progress stages

const API_BASE_URL = "https://oc-genei-stream-lscrraxbvz.cn-hangzhou.fcapp.run";
const API_URL = `${API_BASE_URL}/generate`;
const STREAM_API_URL = `${API_BASE_URL}/generate-stream`;
const CLIENT_TIMEOUT_MS = 270000;

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

const PROGRESS_STAGES = {
  opening: [
    { label: "阶段 1/3：正在规划设定结构", message: "正在规划设定结构" },
    { label: "阶段 2/3：正在生成人设与世界观", message: "正在生成人设与世界观" },
    { label: "阶段 3/3：正在生成开场与收束", message: "正在生成开场与收束" },
  ],
  timeline: [
    { label: "阶段 1/4：正在规划世界观与结构", message: "正在规划世界观与结构" },
    { label: "阶段 2/4：正在生成人设与世界观", message: "正在生成人设与世界观" },
    { label: "阶段 3/4：正在生成开场与关系张力", message: "正在生成开场与关系张力" },
    { label: "阶段 4/4：正在生成时间线与终局", message: "正在生成时间线与终局" },
  ],
};
