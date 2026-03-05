// OC Interactive Web - Frontend
// Simplified version with better error handling

const AXIS_LABELS = {
  W: "W = World（世界）", B: "B = Body（躯壳）", P: "P = Power（力量）", R: "R = Role（立场）",
  M: "M = Motive（动机）", C: "C = Choice（抉择）", E: "E = Expression（表达）", J: "J = Judgment（共情）",
  S: "S = Sanity（心智）", D: "D = Dynamic（权力）", V: "V = View（凝视）", L: "L = Love（真伪）",
  A: "A = Achilles（软肋）", T: "T = Time（时间）", G: "G = God-mode（神权）", X: "X = eXchange（代价）",
  F: "F = Finale（终局）", Palette: "调色板（美学风格）",
};

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

// API Configuration - UPDATE THIS WITH YOUR DEPLOYED WORKER URL
const FIXED_API_URL = "https://oc-interactive-web-api.lnln2004.workers.dev/generate";
const DEFAULT_MODEL = "Qwen/Qwen3-235B-A22B-Thinking-2507";

// DOM Elements
let axisContainer, selectedCountEl, generateBtn, resultEl, statusEl, extraPromptInput;

document.addEventListener('DOMContentLoaded', () => {
  axisContainer = document.getElementById("axisContainer");
  selectedCountEl = document.getElementById("selectedCount");
  generateBtn = document.getElementById("generateBtn");
  resultEl = document.getElementById("result");
  statusEl = document.getElementById("status");
  extraPromptInput = document.getElementById("extraPrompt");
  
  renderAxes();
  updateSelectedCount();
  
  generateBtn.addEventListener("click", generate);
});

function renderAxes() {
  if (!axisContainer) return;
  
  Object.entries(AXES).forEach(([axisName, cfg]) => {
    const group = document.createElement("section");
    group.className = "axis-group";
    
    const head = document.createElement("div");
    head.className = "axis-head";
    head.innerHTML = `<h3>${AXIS_LABELS[axisName] || axisName}</h3><span class="chip">${Object.keys(cfg.options).length}项</span>`;
    
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
  
  axisContainer.addEventListener("change", (e) => {
    if (e.target?.matches("input[type='checkbox']") && e.target.checked) {
      enforceSingleSelection(e.target);
    }
    updateSelectedCount();
  });
}

function enforceSingleSelection(target) {
  const axis = target.dataset.axis;
  axisContainer.querySelectorAll(`input[type='checkbox'][data-axis='${axis}']`).forEach((cb) => {
    if (cb !== target) cb.checked = false;
  });
}

function getSelected() {
  return Array.from(axisContainer.querySelectorAll("input[type='checkbox']:checked")).map((item) => ({
    axis: item.dataset.axis,
    option: item.value,
    code: item.dataset.code
  }));
}

function updateSelectedCount() {
  const selected = getSelected();
  if (selectedCountEl) {
    selectedCountEl.textContent = `已选 ${selected.length} 项`;
  }
}

function detectMode(selected) {
  const axes = new Set(selected.map((s) => String(s.axis || "").trim().toUpperCase()));
  return (axes.has("F") || axes.has("X") || axes.has("T") || axes.has("G")) ? "timeline" : "opening";
}

async function generate() {
  const selections = getSelected();
  
  if (selections.length < 3) {
    setStatus("❌ 至少选择 3 项轴要素。", true);
    return;
  }
  
  const mode = detectMode(selections);
  const modeLabel = mode === "timeline" ? "完整时间线" : "开场静态";
  
  setLoading(true);
  resultEl.textContent = "";
  setStatus(`⏳ 正在生成（${modeLabel}）…`, false);
  
  try {
    const payload = { selections, model: DEFAULT_MODEL, extraPrompt: extraPromptInput?.value || "" };
    
    // Retry logic: 3 attempts with exponential backoff
    let lastError;
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const response = await fetch(FIXED_API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        
        if (!response.ok) {
          const errorText = await response.text().catch(() => "");
          throw new Error(`HTTP ${response.status}: ${errorText.slice(0, 200)}`);
        }
        
        const data = await response.json();
        const content = String(data?.content || "").trim();
        
        if (!content) {
          throw new Error("服务端返回空内容");
        }
        
        resultEl.innerHTML = renderResultContent(content);
        setStatus(`✅ 生成成功！`, false);
        return;
      } catch (err) {
        lastError = err;
        if (attempt < 3) {
          setStatus(`⚠️ 尝试 ${attempt}/3 失败，重试中…`, false);
          await new Promise(r => setTimeout(r, 1000 * attempt));
        }
      }
    }
    
    throw lastError;
  } catch (err) {
    const msg = mapError(err);
    setStatus(`❌ ${msg}`, true);
    resultEl.textContent = `生成失败：${msg}\n\n💡 提示：如果 Worker 未部署或 API Key 过期，请联系作者更新后端配置。`;
  } finally {
    setLoading(false);
  }
}

function mapError(err) {
  if (err?.name === "TypeError" || err?.message?.includes("fetch")) {
    return "网络请求失败，请检查：\n1. 后端 Worker 是否已部署\n2. 网络连接是否正常\n3. 浏览器控制台查看详细错误";
  }
  if (err?.message?.includes("401") || err?.message?.includes("403")) {
    return "API 认证失败（401/403），Worker 的 API Key 可能已过期。";
  }
  if (err?.message?.includes("404")) {
    return "API 地址不存在（404），Worker 可能未部署。";
  }
  if (err?.message?.includes("500") || err?.message?.includes("502") || err?.message?.includes("503") || err?.message?.includes("504")) {
    return `服务端错误（${err.message.split(':')[0]}），请稍后重试。`;
  }
  return String(err?.message || "未知错误");
}

function setLoading(loading) {
  if (generateBtn) generateBtn.disabled = loading;
}

function setStatus(text, isError) {
  if (!statusEl) return;
  statusEl.textContent = text;
  statusEl.style.color = isError ? "#ef4444" : "#22c55e";
}

function renderResultContent(text) {
  const lines = String(text).split("\n");
  return lines.map((raw) => {
    const line = raw.trimEnd();
    if (!line.trim()) return `<div class="result-line result-blank"></div>`;
    if (/^#{1,6}\s+/.test(line)) {
      const title = line.replace(/^#{1,6}\s+/, "");
      return `<h4 class="result-title">${escapeHtml(title)}</h4>`;
    }
    if (/^[-*]\s+/.test(line)) {
      return `<div class="result-line result-bullet">${escapeHtml(line)}</div>`;
    }
    return `<div class="result-line">${escapeHtml(line)}</div>`;
  }).join("");
}

function escapeHtml(str) {
  return String(str || "").replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));
}

function getCode(optionLabel) {
  const m = /^([A-Z]\d)/.exec(optionLabel.trim());
  return m ? m[1] : optionLabel;
}
