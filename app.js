// app.js - Main application logic
// Dependencies: axes-data.js, config.js, renderer.js, audit.js

let axisContainer, selectedCountEl, generateBtn, resultEl, statusEl, extraPromptInput, modelSelect, copyBtn;
let timerInterval = null, startTime = null, statusBaseText = "", statusKind = "neutral";
let streamRenderRaf = 0, pendingStreamText = "";
let latestGeneratedContent = "";
let copyResetTimer = 0;
let activeMode = "opening";
let activeStageLabel = "";

document.addEventListener("DOMContentLoaded", () => {
  axisContainer = document.getElementById("axisContainer");
  selectedCountEl = document.getElementById("selectedCount");
  generateBtn = document.getElementById("generateBtn");
  resultEl = document.getElementById("result");
  statusEl = document.getElementById("status");
  extraPromptInput = document.getElementById("extraPrompt");
  modelSelect = document.getElementById("modelSelect");
  copyBtn = document.getElementById("copyBtn");
  renderAxes();
  renderModelSelector();
  updateSelectedCount();
  generateBtn.addEventListener("click", generate);
  if (copyBtn) copyBtn.addEventListener("click", copyResult);
});

// --- Timer ---

function startTimer() {
  startTime = Date.now();
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    refreshStatus();
  }, 100);
  refreshStatus();
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  const elapsed = startTime ? ((Date.now() - startTime) / 1000).toFixed(1) : 0;
  startTime = null;
  refreshStatus();
  return elapsed;
}

function refreshStatus() {
  if (!statusEl) return;
  const elapsed = startTime ? ` ⏱️ ${((Date.now() - startTime) / 1000).toFixed(1)}s` : "";
  const text = `${statusBaseText || ""}${elapsed}`.trim();
  statusEl.textContent = text;
  statusEl.style.background =
    statusKind === "error" ? "#3a1a1a" :
    statusKind === "success" ? "#1a3a2a" :
    statusKind === "info" ? "#1a233a" :
    "#1a1a20";
}

// --- Model Selector ---

function renderModelSelector() {
  if (!modelSelect) return;
  const savedModel = localStorage.getItem("oc_model") || DEFAULT_MODEL;
  modelSelect.innerHTML = AVAILABLE_MODELS.map((m) => `<option value="${m.value}" ${m.value === savedModel ? "selected" : ""}>${m.label}</option>`).join("");
  modelSelect.addEventListener("change", () => { localStorage.setItem("oc_model", modelSelect.value); });
}

// --- Axis Rendering ---

function renderAxes() {
  if (!axisContainer) return;
  Object.entries(AXES).forEach(([axisName, cfg]) => {
    const group = document.createElement("section");
    group.className = "axis-group";
    const head = document.createElement("div");
    head.className = "axis-head";
    head.innerHTML = `<div class="axis-head-left"><h3>${AXIS_LABELS[axisName] || axisName}</h3><button class="help-btn" data-axis="${axisName}" title="查看说明">?</button></div><span class="chip">${Object.keys(cfg.options).length}项</span>`;
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

function getCoreSelectionCount(selected = getSelected()) {
  return selected.filter((item) => item.axis !== "Palette").length;
}

function updateSelectedCount() {
  const selected = getSelected();
  const coreCount = getCoreSelectionCount(selected);
  if (selectedCountEl) selectedCountEl.textContent = `已选 ${selected.length} 项 · 结构轴 ${coreCount} 项`;
  if (generateBtn) generateBtn.disabled = coreCount < 3;
}

function detectMode(selected) {
  return selected.some((s) => ["F", "X", "T"].includes(s.axis?.toUpperCase())) ? "timeline" : "opening";
}

// --- Generation ---

async function generate() {
  const selected = getSelected();
  if (getCoreSelectionCount(selected) < 3) {
    setStatus("至少选择 3 项非调色板轴要素", "error");
    return;
  }

  activeMode = detectMode(selected);
  activeStageLabel = "";
  latestGeneratedContent = "";
  setCopyReady(false);

  if (resultEl) {
    resultEl.style.display = "block";
    resultEl.textContent = "";
  }
  setStatus(getStageLabel(activeMode, 0, "正在提交请求"), "info");

  setLoading(true);
  startTimer();
  try {
    const model = modelSelect?.value || DEFAULT_MODEL;
    const extraPrompt = extraPromptInput?.value || "";
    const payload = { selections: selected, model, extraPrompt };
    let data;

    try {
      data = await streamGenerate(payload, activeMode);
    } catch (err) {
      if (err?.partialContent) throw err;
      setStatus(getStageLabel(activeMode, 0, "流式不可用，切回整段返回"), "info");
      data = await generateFallback(payload);
    }

    const elapsed = stopTimer();
    if (data.error) throw new Error(data.error);
    renderResultContent(data.content);
    setStatus(`✅ 生成完成（${elapsed}s）`, "success");
  } catch (err) {
    stopTimer();
    if (err?.partialContent) {
      renderResultContent(err.partialContent);
      setCopyReady(Boolean(err.partialContent.trim()));
    }
    setStatus(mapError(err.message), "error");
  } finally {
    setLoading(false);
  }
}

async function streamGenerate(payload, mode) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), CLIENT_TIMEOUT_MS);
  let accumulated = "";

  try {
    const response = await fetch(STREAM_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal
    });

    const contentType = response.headers.get("content-type") || "";
    if (!response.ok) {
      const errText = contentType.includes("application/json")
        ? ((await response.json())?.error || `HTTP ${response.status}`)
        : (await response.text()) || `HTTP ${response.status}`;
      throw new Error(errText);
    }

    if (!response.body || !contentType.includes("text/event-stream")) {
      throw new Error("流式响应不可用");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true }).replace(/\r/g, "");
      let boundary = buffer.indexOf("\n\n");
      while (boundary !== -1) {
        const rawEvent = buffer.slice(0, boundary);
        buffer = buffer.slice(boundary + 2);
        boundary = buffer.indexOf("\n\n");

        const dataLines = rawEvent
          .split("\n")
          .filter((line) => line.startsWith("data:"))
          .map((line) => line.slice(5).trim())
          .filter(Boolean);

        if (!dataLines.length) continue;

        let eventPayload;
        try {
          eventPayload = JSON.parse(dataLines.join("\n"));
        } catch (parseErr) {
          console.warn("[SSE] JSON parse failed:", parseErr.message);
          continue;
        }

        if (eventPayload.type === "status" || eventPayload.type === "ready") {
          setStatus(mapServerStage(eventPayload, mode), "info");
          continue;
        }

        if (eventPayload.type === "delta") {
          accumulated += eventPayload.content || "";
          if (accumulated) {
            latestGeneratedContent = accumulated;
            renderStreamingPreview(accumulated);
            updateProgressFromContent(accumulated, mode);
          }
          continue;
        }

        if (eventPayload.type === "error") {
          const err = new Error(eventPayload.error || "流式生成失败");
          if (accumulated) err.partialContent = accumulated;
          throw err;
        }
      }
    }

    if (!accumulated.trim()) {
      throw new Error("流式生成没有返回正文");
    }

    return { content: accumulated };
  } finally {
    clearTimeout(timeoutId);
  }
}

async function generateFallback(payload) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), CLIENT_TIMEOUT_MS);
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal
    });

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.error || `HTTP ${response.status}`);
    }

    return await response.json();
  } finally {
    clearTimeout(timeoutId);
  }
}

// --- UI Helpers ---

function mapError(err) {
  if (err.includes("API")) return "API 调用失败，请稍后重试";
  if (err.includes("网络") || err.includes("Failed")) return "网络错误，请检查网络连接";
  if (err.includes("至少")) return err;
  return err || "生成失败，请稍后重试";
}

function setLoading(loading) {
  if (generateBtn) {
    generateBtn.disabled = loading;
    generateBtn.textContent = loading ? "生成中..." : "✨ 生成设定";
  }
  if (!loading && latestGeneratedContent.trim()) {
    setCopyReady(true);
  }
}

function setStatus(text, kind = "info") {
  statusBaseText = text || "";
  statusKind = kind;
  refreshStatus();
}

function renderStreamingPreview(text) {
  if (!resultEl) return;
  pendingStreamText = text;
  if (streamRenderRaf) return;
  streamRenderRaf = requestAnimationFrame(() => {
    streamRenderRaf = 0;
    resultEl.style.display = "block";
    resultEl.innerHTML = renderMarkdownToHtml(pendingStreamText);
  });
}

function renderResultContent(text) {
  if (!resultEl) return;
  latestGeneratedContent = String(text || "");
  resultEl.style.display = "block";
  resultEl.innerHTML = renderMarkdownToHtml(text);
  resultEl.scrollIntoView({ behavior: "smooth" });
  setCopyReady(Boolean(latestGeneratedContent.trim()));
}

// --- Progress Stages ---

function getStageLabel(mode, stageIndex, fallback) {
  const stages = PROGRESS_STAGES[mode] || PROGRESS_STAGES.opening;
  return stages[stageIndex]?.label || fallback;
}

function mapServerStage(eventPayload, mode) {
  const phase = String(eventPayload?.phase || eventPayload?.type || "");
  if (phase === "thinking" || phase === "ready") {
    activeStageLabel = getStageLabel(mode, 0, eventPayload?.message || "正在规划设定结构");
    return activeStageLabel;
  }
  if (phase === "writing") {
    activeStageLabel = getStageLabel(mode, 1, eventPayload?.message || "正在生成正文");
    return activeStageLabel;
  }
  if (phase === "continuing") {
    const tail = eventPayload?.message ? `：${eventPayload.message.replace(/^检测到正文未写完，正在补齐剩余章节：?/, "")}` : "";
    activeStageLabel = `${getStageLabel(mode, mode === "timeline" ? 3 : 2, "正在补齐剩余章节")}${tail}`;
    return activeStageLabel;
  }
  return eventPayload?.message || "正在生成";
}

function updateProgressFromContent(text, mode) {
  const content = String(text || "");
  let nextLabel = "";
  if (mode === "timeline") {
    if (content.includes("时间线") || content.includes("终局兑现")) {
      nextLabel = getStageLabel(mode, 3, "");
    } else if (content.includes("开场场景") || content.includes("开场金句") || content.includes("男主人设限制") || content.includes("权衡说明")) {
      nextLabel = getStageLabel(mode, 2, "");
    } else if (content.includes("男主档案") || content.includes("世界切片") || content.includes("关系动力学") || content.includes("轴映射说明")) {
      nextLabel = getStageLabel(mode, 1, "");
    }
  } else if (content.includes("开场场景") || content.includes("开场金句") || content.includes("男主人设限制") || content.includes("权衡说明") || content.includes("重生成建议")) {
    nextLabel = getStageLabel(mode, 2, "");
  } else if (content.includes("男主档案") || content.includes("世界切片") || content.includes("关系动力学") || content.includes("轴映射说明")) {
    nextLabel = getStageLabel(mode, 1, "");
  }

  if (nextLabel && nextLabel !== activeStageLabel) {
    activeStageLabel = nextLabel;
    setStatus(nextLabel, "info");
  }
}

// --- Copy ---

function setCopyReady(enabled) {
  if (!copyBtn) return;
  copyBtn.disabled = !enabled;
  if (!enabled) {
    if (copyResetTimer) clearTimeout(copyResetTimer);
    copyBtn.textContent = "复制结果";
  }
}

async function copyResult() {
  const text = String(latestGeneratedContent || "").trim();
  if (!text) return;

  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
    } else {
      const ghost = document.createElement("textarea");
      ghost.value = text;
      ghost.setAttribute("readonly", "");
      ghost.style.position = "fixed";
      ghost.style.opacity = "0";
      document.body.appendChild(ghost);
      ghost.select();
      document.execCommand("copy");
      ghost.remove();
    }
    if (copyResetTimer) clearTimeout(copyResetTimer);
    if (copyBtn) copyBtn.textContent = "已复制";
    copyResetTimer = window.setTimeout(() => {
      if (copyBtn) copyBtn.textContent = "复制结果";
    }, 1600);
  } catch (err) {
    setStatus("复制失败，请手动选择文本", "error");
  }
}

// --- Utilities ---

function getCode(optionLabel) {
  const m = /^([A-Z]\d)/.exec(optionLabel.trim());
  return m ? m[1] : optionLabel;
}

// --- Help Modal (refactored: CSS classes + addEventListener) ---

function showAxisHelp(axisName) {
  const cfg = AXES[axisName];
  const wisdom = AXIS_WISDOM[axisName] || '';
  const details = AXIS_DETAILS[axisName];
  const links = AXIS_LINKS[axisName];
  if (!cfg) return;

  const optionsList = Object.entries(cfg.options)
    .map(([opt, detail]) => {
      const extraDetail = details?.options?.[opt] || '';
      return `<li class="modal-option-item"><div class="modal-option-name">${opt}</div><div class="modal-option-detail">${extraDetail || detail}</div></li>`;
    })
    .join('');

  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h2>${AXIS_LABELS[axisName] || axisName}</h2>
        <button class="modal-close-btn" aria-label="关闭" type="button">&times;</button>
      </div>
      ${wisdom ? `<div class="modal-wisdom"><p>${wisdom}</p></div>` : ''}
      ${details?.intro ? `<p class="modal-intro">${details.intro}</p>` : ''}
      <h3 class="modal-section-title">所有选项详解：</h3>
      <ul class="modal-options-list">
        ${optionsList}
      </ul>
      ${links ? `<div class="modal-links"><h4>相关轴联动：</h4><p>${links}</p></div>` : ''}
      <button class="modal-close-bottom" type="button">关闭</button>
    </div>
  `;

  function closeModal() {
    overlay.remove();
  }

  // Close on overlay click (but not on content click)
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  // Close buttons
  overlay.querySelector('.modal-close-btn').addEventListener('click', closeModal);
  overlay.querySelector('.modal-close-bottom').addEventListener('click', closeModal);

  // Close on Escape key
  function onKeyDown(e) {
    if (e.key === 'Escape') {
      closeModal();
      document.removeEventListener('keydown', onKeyDown);
    }
  }
  document.addEventListener('keydown', onKeyDown);

  document.body.appendChild(overlay);
}
