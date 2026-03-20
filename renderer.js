// renderer.js - Markdown rendering utilities

function escapeHtml(str) {
  return String(str || "").replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));
}

function normalizeGeneratedText(text) {
  let normalized = String(text || "");
  normalized = normalized.replace(/在\s*([A-Z]\d)\s*之外(?:再)?(?:叠加|加上)\s*([A-Z]\d)/g, (match, current, next) => {
    return current[0] === next[0] ? `将当前${current[0]}轴选项从${current}改为${next}` : match;
  });
  return normalized;
}

function renderInlineMarkdown(text) {
  let html = escapeHtml(text);
  html = html.replace(/`([^`\n]+)`/g, "<code>$1</code>");
  html = html.replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*([^*\n]+)\*/g, "<em>$1</em>");
  return html;
}

function renderMarkdownToHtml(text) {
  const lines = normalizeGeneratedText(text).replace(/\r/g, "").split("\n");
  const html = [];
  let paragraph = [];
  let listType = null;
  let listItems = [];
  let quoteLines = [];

  const flushParagraph = () => {
    if (!paragraph.length) return;
    html.push(`<p class="result-paragraph">${paragraph.map(renderInlineMarkdown).join("<br>")}</p>`);
    paragraph = [];
  };

  const flushList = () => {
    if (!listType) return;
    const tag = listType === "ol" ? "ol" : "ul";
    html.push(`<${tag} class="result-list result-list-${listType}">${listItems.map((item) => `<li>${renderInlineMarkdown(item)}</li>`).join("")}</${tag}>`);
    listType = null;
    listItems = [];
  };

  const flushQuote = () => {
    if (!quoteLines.length) return;
    html.push(`<blockquote class="result-quote">${quoteLines.map(renderInlineMarkdown).join("<br>")}</blockquote>`);
    quoteLines = [];
  };

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed) {
      flushParagraph();
      flushList();
      flushQuote();
      continue;
    }

    if (/^(-{3,}|\*{3,}|_{3,})$/.test(trimmed)) {
      flushParagraph();
      flushList();
      flushQuote();
      html.push('<hr class="result-hr" />');
      continue;
    }

    if (/^#{1,6}\s+/.test(trimmed)) {
      flushParagraph();
      flushList();
      flushQuote();
      const level = Math.min(6, (trimmed.match(/^#+/) || ["#"])[0].length);
      const tag = level <= 2 ? "h2" : "h3";
      const title = trimmed.replace(/^#{1,6}\s+/, "");
      html.push(`<${tag} class="result-title result-title-${level}">${renderInlineMarkdown(title)}</${tag}>`);
      continue;
    }

    if (/^\d+\.\s+/.test(trimmed)) {
      flushParagraph();
      flushQuote();
      if (listType !== "ol") {
        flushList();
        listType = "ol";
      }
      listItems.push(trimmed.replace(/^\d+\.\s+/, ""));
      continue;
    }

    if (/^[-*]\s+/.test(trimmed)) {
      flushParagraph();
      flushQuote();
      if (listType !== "ul") {
        flushList();
        listType = "ul";
      }
      listItems.push(trimmed.replace(/^[-*]\s+/, ""));
      continue;
    }

    if (/^>\s?/.test(trimmed)) {
      flushParagraph();
      flushList();
      quoteLines.push(trimmed.replace(/^>\s?/, ""));
      continue;
    }

    paragraph.push(trimmed);
  }

  flushParagraph();
  flushList();
  flushQuote();

  return html.join("");
}
