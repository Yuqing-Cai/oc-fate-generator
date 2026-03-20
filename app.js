// app.js - Main application logic
// Dependencies: axes-data.js, i18n.js, config.js, renderer.js

let axisContainer, selectedCountEl, generateBtn, luckyBtn, resultEl, statusEl, extraPromptInput, modelSelect, copyBtn;
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
  luckyBtn = document.getElementById("luckyBtn");
  resultEl = document.getElementById("result");
  statusEl = document.getElementById("status");
  extraPromptInput = document.getElementById("extraPrompt");
  modelSelect = document.getElementById("modelSelect");
  copyBtn = document.getElementById("copyBtn");

  renderStaticUI();
  renderAxes();
  renderModelSelector();
  updateSelectedCount();
  generateBtn.addEventListener("click", generate);
  if (luckyBtn) luckyBtn.addEventListener("click", luckyPick);
  if (copyBtn) copyBtn.addEventListener("click", copyResult);

  // Language toggle
  const langToggle = document.getElementById("langToggle");
  if (langToggle) {
    langToggle.addEventListener("click", () => {
      setLang(currentLang === "zh" ? "en" : "zh");
    });
  }
});

// Called by i18n.js setLang() to refresh the entire UI
function rerenderAll() {
  renderStaticUI();
  // Preserve selections
  const savedSelections = getSelected().map(s => ({ axis: s.axis, code: s.code }));
  if (axisContainer) axisContainer.innerHTML = "";
  renderAxes();
  // Restore selections
  savedSelections.forEach(({ axis, code }) => {
    const cb = axisContainer.querySelector(`input[data-axis='${axis}'][data-code='${code}']`);
    if (cb) cb.checked = true;
  });
  renderModelSelector();
  updateSelectedCount();
  updateLangToggle();
}

function renderStaticUI() {
  const title = document.querySelector("h1");
  if (title) title.textContent = t("pageTitle");

  const subtitle = document.querySelector(".subtitle");
  if (subtitle) subtitle.textContent = t("subtitle");

  const modelLabel = document.querySelector('label[for="modelSelect"], .field-label');
  // Update labels by finding them via DOM structure
  const controlRow = document.querySelector(".control-row");
  if (controlRow) {
    const labels = controlRow.querySelectorAll(".field-label");
    if (labels[0]) labels[0].textContent = t("selectModel");
    if (labels[1]) labels[1].textContent = t("extraPromptLabel");
  }

  if (extraPromptInput) {
    extraPromptInput.placeholder = t("extraPromptPlaceholder");
  }

  const promptNote = document.querySelector(".prompt-note");
  if (promptNote) promptNote.textContent = t("extraPromptNote");

  if (luckyBtn) {
    luckyBtn.textContent = t("luckyBtn");
  }

  if (generateBtn && !generateBtn.disabled) {
    generateBtn.textContent = t("generateBtn");
  }

  const toolbarTitle = document.querySelector(".result-toolbar-title");
  if (toolbarTitle) toolbarTitle.textContent = t("resultToolbarTitle");

  if (copyBtn && !copyBtn.disabled) {
    copyBtn.textContent = t("copyBtn");
  }

  const footer = document.querySelector("footer");
  if (footer) {
    const footerP = footer.querySelector("p");
    if (footerP) footerP.textContent = t("footerLicense");
  }

  updateLangToggle();
}

function updateLangToggle() {
  const langToggle = document.getElementById("langToggle");
  if (langToggle) {
    langToggle.textContent = currentLang === "zh" ? "EN" : "中文";
    langToggle.title = currentLang === "zh" ? "Switch to English" : "切换到中文";
  }
}

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
  modelSelect.innerHTML = AVAILABLE_MODELS.map((m) => {
    const label = currentLang === "en" && MODEL_LABELS_EN?.[m.value] ? MODEL_LABELS_EN[m.value] : m.label;
    return `<option value="${m.value}" ${m.value === savedModel ? "selected" : ""}>${label}</option>`;
  }).join("");
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
    head.innerHTML = `<div class="axis-head-left"><h3>${AXIS_LABELS[axisName] || axisName}</h3><button class="help-btn" data-axis="${axisName}" title="${t('helpBtnTitle')}">?</button></div><span class="chip">${t('chip')(Object.keys(cfg.options).length)}</span>`;
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
  if (selectedCountEl) selectedCountEl.textContent = t("selectedCount")(selected.length, coreCount);
  if (generateBtn) generateBtn.disabled = coreCount < 3;
}

function detectMode(selected) {
  return selected.some((s) => ["F", "X", "T"].includes(s.axis?.toUpperCase())) ? "timeline" : "opening";
}

// --- Lucky Pick ---

function luckyPick() {
  // Clear all current selections
  axisContainer.querySelectorAll("input[type='checkbox']:checked").forEach((cb) => { cb.checked = false; });

  // Get all non-Palette axis names
  const axisNames = Object.keys(AXES).filter((a) => a !== "Palette");

  // Shuffle and pick 3
  const shuffled = axisNames.sort(() => Math.random() - 0.5);
  const picked = shuffled.slice(0, 3);

  // For each picked axis, select a random option
  picked.forEach((axisName) => {
    const checkboxes = Array.from(axisContainer.querySelectorAll(`input[type='checkbox'][data-axis='${axisName}']`));
    if (!checkboxes.length) return;
    const randomCb = checkboxes[Math.floor(Math.random() * checkboxes.length)];
    randomCb.checked = true;
  });

  updateSelectedCount();

  // Scroll first picked axis into view
  const firstPicked = axisContainer.querySelector(`input[type='checkbox'][data-axis='${picked[0]}']`);
  if (firstPicked) {
    firstPicked.closest(".axis-group")?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  setStatus(t("luckyToast")(picked.length), "info");
}

// --- Generation ---

async function generate() {
  const selected = getSelected();
  if (getCoreSelectionCount(selected) < 3) {
    setStatus(t("minSelectionError"), "error");
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
  setStatus(getStageLabel(activeMode, 0, t("submitting")), "info");

  setLoading(true);
  startTimer();
  try {
    const model = modelSelect?.value || DEFAULT_MODEL;
    const extraPrompt = extraPromptInput?.value || "";
    const payload = { selections: selected, model, extraPrompt, lang: currentLang };
    let data;

    try {
      data = await streamGenerate(payload, activeMode);
    } catch (err) {
      if (err?.partialContent) throw err;
      setStatus(getStageLabel(activeMode, 0, t("streamFallback")), "info");
      data = await generateFallback(payload);
    }

    const elapsed = stopTimer();
    if (data.error) throw new Error(data.error);
    renderResultContent(data.content);
    setStatus(t("generateDone")(elapsed), "success");
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
      throw new Error(t("streamUnavail"));
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
          const err = new Error(eventPayload.error || t("streamFail"));
          if (accumulated) err.partialContent = accumulated;
          throw err;
        }
      }
    }

    if (!accumulated.trim()) {
      throw new Error(t("streamEmpty"));
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
  if (err.includes("API")) return t("apiError");
  if (err.includes("网络") || err.includes("Failed") || err.includes("Network")) return t("networkError");
  if (err.includes("至少") || err.includes("Select at least")) return err;
  return err || t("generateFail");
}

function setLoading(loading) {
  if (generateBtn) {
    generateBtn.disabled = loading;
    generateBtn.textContent = loading ? t("generatingBtn") : t("generateBtn");
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
    activeStageLabel = getStageLabel(mode, 0, eventPayload?.message || (currentLang === "en" ? "Planning structure" : "正在规划设定结构"));
    return activeStageLabel;
  }
  if (phase === "writing") {
    activeStageLabel = getStageLabel(mode, 1, eventPayload?.message || (currentLang === "en" ? "Generating content" : "正在生成正文"));
    return activeStageLabel;
  }
  if (phase === "continuing") {
    const tail = eventPayload?.message ? `：${eventPayload.message.replace(/^检测到正文未写完，正在补齐剩余章节：?/, "")}` : "";
    activeStageLabel = `${getStageLabel(mode, mode === "timeline" ? 3 : 2, currentLang === "en" ? "Completing remaining sections" : "正在补齐剩余章节")}${tail}`;
    return activeStageLabel;
  }
  return eventPayload?.message || (currentLang === "en" ? "Generating" : "正在生成");
}

function updateProgressFromContent(text, mode) {
  const content = String(text || "");
  let nextLabel = "";
  if (mode === "timeline") {
    if (content.includes("时间线") || content.includes("终局兑现") || content.includes("Timeline") || content.includes("Finale")) {
      nextLabel = getStageLabel(mode, 3, "");
    } else if (content.includes("开场场景") || content.includes("开场金句") || content.includes("Opening Scene") || content.includes("Opening Line")) {
      nextLabel = getStageLabel(mode, 2, "");
    } else if (content.includes("男主档案") || content.includes("世界切片") || content.includes("Character Profile") || content.includes("World Slice")) {
      nextLabel = getStageLabel(mode, 1, "");
    }
  } else if (content.includes("开场场景") || content.includes("开场金句") || content.includes("Opening Scene") || content.includes("Opening Line")) {
    nextLabel = getStageLabel(mode, 2, "");
  } else if (content.includes("男主档案") || content.includes("世界切片") || content.includes("Character Profile") || content.includes("World Slice")) {
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
    copyBtn.textContent = t("copyBtn");
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
    if (copyBtn) copyBtn.textContent = t("copiedBtn");
    copyResetTimer = window.setTimeout(() => {
      if (copyBtn) copyBtn.textContent = t("copyBtn");
    }, 1600);
  } catch (err) {
    setStatus(t("copyFail"), "error");
  }
}

// --- Utilities ---

function getCode(optionLabel) {
  const m = /^([A-Z]\d)/.exec(optionLabel.trim());
  return m ? m[1] : optionLabel;
}

// --- Help Modal ---

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
        <button class="modal-close-btn" aria-label="${t('modalClose')}" type="button">&times;</button>
      </div>
      ${wisdom ? `<div class="modal-wisdom"><p>${wisdom}</p></div>` : ''}
      ${details?.intro ? `<p class="modal-intro">${details.intro}</p>` : ''}
      <h3 class="modal-section-title">${t('modalAllOptions')}</h3>
      <ul class="modal-options-list">
        ${optionsList}
      </ul>
      ${links ? `<div class="modal-links"><h4>${t('modalLinksTitle')}</h4><p>${links}</p></div>` : ''}
      <button class="modal-close-bottom" type="button">${t('modalClose')}</button>
    </div>
  `;

  function closeModal() {
    overlay.remove();
  }

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  overlay.querySelector('.modal-close-btn').addEventListener('click', closeModal);
  overlay.querySelector('.modal-close-bottom').addEventListener('click', closeModal);

  function onKeyDown(e) {
    if (e.key === 'Escape') {
      closeModal();
      document.removeEventListener('keydown', onKeyDown);
    }
  }
  document.addEventListener('keydown', onKeyDown);

  document.body.appendChild(overlay);
}
