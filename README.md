[English](#english) | [中文](#中文)

# English

## OC Fate Generator

A structured character generator for romance fiction. Instead of throwing a loose prompt at an LLM, this tool decomposes character design into 16 composable axes + 1 palette axis, then sends that structured input to a generation backend.

**Live:** http://www.lnln.fun/oc-gen/

### What It Does

- Presents 17 character-design axes with guided options
- **"Pick for Me"** — randomly selects 3 axes to get you started instantly
- Validates selections and detects generation mode automatically
- Streams generated text via SSE with real-time Markdown rendering
- Supports Chinese and English (toggle in the top-right corner)

### Architecture

1. **Static frontend** — vanilla HTML/CSS/JS hosted on Aliyun OSS
2. **Generation API** — Aliyun Function Compute, SSE streaming

The frontend collects axis selections, validates input, detects generation mode, and renders streamed output. The backend assembles prompts and calls the underlying model.

### The 17 Axes

| Code | Axis | What It Controls |
|------|------|------------------|
| `W` | World | External resistance — what the world throws at you |
| `B` | Body | Physical form — can you touch, age, die? |
| `P` | Power | Power scale — mortal to godlike |
| `R` | Role | Where he stands relative to the established order |
| `M` | Motive | Why he's alive — the pillar love will shake |
| `C` | Choice | What he does when forced to choose between you and everything else |
| `E` | Expression | How he lets you know he cares |
| `J` | Judgment | Whether he can read your emotions (and what happens when he can't) |
| `S` | Sanity | Mental stability — and what breaks it |
| `D` | Dynamic | Who holds power in the relationship, and when it flips |
| `L` | Love | How his perception of you evolves — a full arc from start to end |
| `A` | Achilles | His fatal weakness — the switch that makes him lose control |
| `H` | Heroine | Her agency — she's not just the one being loved |
| `T` | Time | How time torments the relationship (lifespan gap, loops, erosion) |
| `X` | eXchange | What he ultimately sacrifices |
| `F` | Finale | What the relationship becomes when everything settles |
| `Palette` | Palette | Text tone — cold restraint, blazing edge, raw realism, etc. |

### Axis Linkages

Axes aren't independent tags — they form a causal web:

- `W → C` — Harsher world = harder choices
- `M → C` — Motive drives choice, unless love intervenes
- `E + J` — Expression (output) + Empathy (input) = communication style
- `S → E, J` — Mental state limits expression and empathy stability
- `P → X` — Greater power = heavier cost
- `R → D` — Social stance shapes starting power balance
- `H → D, L` — Her agency reshapes power dynamics and perception arc speed
- `L + A` — Whether his weakness is in your hands depends on how he sees you
- `T + F` — Time pressure shapes the finale
- `X ↔ M` — Cost must echo motive

### Generation Modes

- **Opening** — When F / X / T are not selected. Outputs character profile + opening scene.
- **Timeline** — When any of F / X / T are selected. Outputs full fate arc, cost chain, and finale.

### Quality Constraints

The backend prompt enforces a set of structural and literary constraints informed by [cn-failure-atlas](https://github.com/Yuqing-Cai/cn-failure-atlas), a taxonomy of LLM fiction/roleplay failure modes:

- **No names for the male lead** — always referred to as "he", leaving name to the reader's imagination
- **No premature closure** — generated content is a story's beginning, not its ending; no epiphanies or emotional conclusions
- **Asymmetry preservation** — power gaps, faction opposition, and pursuit dynamics set by axes must persist throughout
- **Desire stays implicit** — attraction conveyed through behavior only, never confirmed via inner monologue
- **No webnovel stock phrases** — banned list of cliché descriptions (e.g. "thin lips slightly pursed", "slender fingers")
- **Dark axes stay dark** — if the axis combination points to oppression/control/instability, no unearned warmth is inserted
- **Voice differentiation** — speech style derived from axis settings, not a shared default register
- **Dialogue authenticity** — conversations must include non-functional lines; not every sentence serves the plot
- **Micro-reaction de-stocking** — generic body-language templates (e.g. "hand froze", "breath caught") limited to one use each

### Local Development

```bash
python -m http.server 8000
```

Open `http://localhost:8000`

### Repository Structure

```text
.
├── index.html          # Entry point
├── styles.css          # All styles
├── axes-data.js        # Axis definitions (Chinese)
├── i18n.js             # English translations + language switching
├── config.js           # API endpoints, model list, progress stages
├── renderer.js         # Markdown → HTML rendering
├── app.js              # Application logic
└── docs/
    └── axis-design-guide.md
```

---

# 中文

## OC 命运生成器

基于 16+1 轴组合系统的男主 OC 设定与命运骨架生成器。

核心思路：把角色设计拆成一组可组合、可约束、可联动的结构化输入，再交给后端模型生成文本。输出结果在角色逻辑、关系张力、叙事压力、代价与终局之间形成因果链。

**在线地址：** http://www.lnln.fun/oc-gen/

### 功能

- 17 个角色设计轴，每轴附带引导式选项与详细说明
- **「帮我选轴」** — 随机选 3 个轴，降低选择压力、一键尝鲜
- 自动校验选择、自动判断生成模式
- SSE 流式生成，实时 Markdown 渲染
- 中英双语切换（右上角按钮）

### 架构

1. **静态前端** — 纯 HTML/CSS/JS，部署在阿里云 OSS
2. **生成接口** — 阿里云函数计算，SSE 流式返回

前端负责展示轴选择界面、校验输入、判断生成模式、发起流式请求、渲染结果。后端负责组织 prompt 并调用模型。

### 17 轴一览

| 代码 | 轴名 | 控制什么 |
|------|------|----------|
| `W` | World（世界） | 外部阻力——世界给你设了什么障碍 |
| `B` | Body（躯壳） | 身体形态——能不能触碰、衰老、死亡 |
| `P` | Power（力量） | 力量量级——凡人到造物主 |
| `R` | Role（立场） | 他和现有秩序的关系 |
| `M` | Motive（动机） | 他为什么活着——爱会动摇的那根支柱 |
| `C` | Choice（抉择） | 在你和其他一切之间必须选的时候，他怎么做 |
| `E` | Expression（表达） | 他用什么方式让你知道他在乎 |
| `J` | Judgment（共情） | 他能不能读懂你的情绪，读错了会怎样 |
| `S` | Sanity（心智） | 精神稳定性——以及什么能让他不稳 |
| `D` | Dynamic（权力） | 关系中谁在主导，什么时候翻转 |
| `L` | Love（关系认知） | 他对你的认知如何进化——从起点到终点的完整弧线 |
| `A` | Achilles（软肋） | 致命弱点——按下去他就失控的开关 |
| `H` | Heroine（她的位置） | 女主的能动性——她不只是被爱的人 |
| `T` | Time（时间） | 时间如何折磨这段关系（寿命差、循环、侵蚀） |
| `X` | eXchange（代价） | 他最终失去了什么 |
| `F` | Finale（终局） | 尘埃落定后关系变成什么样 |
| `Palette` | 调色板 | 文字风格——冷调克制、炽艳锋芒、粗砺纪实等 |

### 轴联动

轴与轴之间不是独立标签，而是因果网络：

- `W → C`：世界越残酷，抉择越痛
- `M → C`：动机驱动抉择，除非被爱动摇
- `E + J`：表达（输出）+ 共情（输入）= 沟通模式
- `S → E, J`：心智状态限制表达和共情的稳定性
- `P → X`：力量越大，代价的量级越高
- `R → D`：立场影响权力格局的起点
- `H → D, L`：她的能动性重新定义权力格局和认知进化速度
- `L + A`：他的弱点在不在你手里，取决于他怎么看你
- `T + F`：时间压力导向终局
- `X ↔ M`：代价必须与动机呼应

### 生成模式

- **开场模式** — 未选 F / X / T 时触发，输出角色档案 + 开场场景
- **时间线模式** — 选了 F / X / T 任一时触发，输出完整命运弧线、代价链条与终局

### 质量约束

后端 prompt 内置了一组结构性与文学性约束，基于 [cn-failure-atlas](https://github.com/Yuqing-Cai/cn-failure-atlas)（一套 LLM 虚构/角色扮演失败模式分类体系）设计：

- **男主无名** — 全篇只用「他」指代，名字留给读者自己脑补
- **开篇不收束** — 生成内容是起点而非终点，禁止顿悟句和情感定论
- **不对称守恒** — 轴设定的权力差、立场对立、追逃关系必须贯穿全篇
- **欲望半隐** — 吸引力只通过行为暗示，不通过内心独白确认
- **网文库存禁用** — 禁用「薄唇微抿」「修长的手指」等模板化描写
- **暗轴不加光** — 黑暗轴组合不插入未被轴支撑的暖意
- **声音差异化** — 语言风格由轴设定推导，不共享默认散文腔
- **台词真实感** — 对话中必须包含无功能台词，不是每句都为场景服务
- **微反应去库存** — 通用身体微反应（「手停住了」「呼吸一顿」）全篇最多出现一次

### 本地运行

```bash
python -m http.server 8000
```

打开 `http://localhost:8000`

### 仓库结构

```text
.
├── index.html          # 入口
├── styles.css          # 样式
├── axes-data.js        # 轴定义（中文）
├── i18n.js             # 英文翻译 + 语言切换
├── config.js           # API 配置、模型列表、进度阶段
├── renderer.js         # Markdown → HTML 渲染
├── app.js              # 主逻辑
└── docs/
    └── axis-design-guide.md
```

## License

- Code: MIT
- Art / Content: Non-commercial, learning only
