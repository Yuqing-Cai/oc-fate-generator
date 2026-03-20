[English](#english) | [中文](#中文)

# English

## OC Fate Generator

A structured character generator for romance fiction. Instead of throwing a loose prompt at an LLM, this tool decomposes character design into 16 composable axes + 1 palette axis, then sends structured input to a generation backend.

**Live:** http://www.lnln.fun/oc-gen/

### What This Repository Contains

- Browser UI (vanilla HTML/CSS/JS, no build tools)
- 17-axis data model (v2: merged V+L→L, merged P+G→P, added H)
- Selection, validation, and mode-switching logic
- Model selection and request assembly
- SSE streaming result rendering with Markdown support
- Bilingual interface (Chinese / English)

### Runtime Architecture

1. **Static frontend** hosted on Aliyun OSS
2. **Generation API** on Aliyun Function Compute (SSE streaming)

The frontend collects axis selections, validates input, detects generation mode, and renders streamed output. The backend assembles prompts and calls the underlying model.

### 17-Axis System (v2)

| Code | Axis | Purpose |
|------|------|---------|
| `W` | World | External resistance and world constraints |
| `B` | Body | Physical form, touch boundaries |
| `P` | Power | Power scale — mortal to godlike |
| `R` | Role | Relationship with established order |
| `M` | Motive | Core driving force |
| `C` | Choice | Decision pattern under pressure |
| `E` | Expression | How he shows affection |
| `J` | Judgment | Empathy mode |
| `S` | Sanity | Mental stability |
| `D` | Dynamic | Power balance in the relationship |
| `L` | Love | Perception arc — what you are to him, and how it evolves |
| `A` | Achilles | Fatal weakness |
| `H` | Heroine | Her agency and role in the story |
| `T` | Time | Time pressure (lifespan gap, loops, erosion) |
| `X` | eXchange | Cost and sacrifice |
| `F` | Finale | Final relationship form |
| `Palette` | Palette | Text tone and sensory style |

### v2 Changes

- **Merged V (Gaze) + L (Love) → L (Perception Arc):** Options now describe evolution arcs (start → turning point → end)
- **Merged P (Power) + G (God-mode) → P (Power):** Unified into 3-tier power scale
- **Added H (Heroine):** Defines female lead's agency — no longer assumed passive
- **Streamlined Palette:** 10 → 8 options, merged similar tones
- **New linkage rules:** B→T, S→E/J, R→D, P→X, H→D/L

### Key Linkage Rules

- `W → C` — Harsher world = harder choices
- `M → C` — Motive drives choice, unless love intervenes
- `E + J` — Expression (output) + Empathy (input) = communication style
- `P → X` — Greater power = heavier cost
- `H → D, L` — Her agency reshapes power dynamics and perception arc speed
- `T + F` — Time pressure shapes the finale
- `X ↔ M` — Cost must echo motive

### Generation Modes

- **Opening mode** — When F/X/T are not selected. Outputs character setup + opening scene.
- **Timeline mode** — When any of F/X/T are selected. Outputs full fate arc + progression.

### Local Development

```bash
python -m http.server 8000
```

Open `http://localhost:8000`

### Repository Files

```text
.
├── index.html
├── styles.css
├── axes-data.js      # Axis definitions (Chinese)
├── i18n.js           # English translations + language switching
├── config.js         # API config, models, progress stages
├── renderer.js       # Markdown-to-HTML rendering
├── app.js            # Main application logic
└── docs/
    └── axis-design-guide.md
```

---

# 中文

## 项目简介

`OC Fate Generator` 是一个基于 16+1 轴组合系统的男主 OC 设定与命运骨架生成器。

核心思路：把角色设计拆成一组可组合、可约束、可联动的结构化输入，再交给后端模型生成文本。输出结果在角色逻辑、关系张力、叙事压力、代价与终局之间形成因果链。

在线地址：http://www.lnln.fun/oc-gen/

### 系统结构

1. 部署在阿里云 OSS 上的静态前端
2. 阿里云函数计算上的生成接口（SSE 流式）

前端负责展示轴选择界面、校验输入、判断生成模式、发起流式请求、渲染结果。后端负责组织 prompt 并调用模型。

### 17 轴总览（v2）

| 代码 | 轴名 | 作用 |
|------|------|------|
| `W` | World（世界） | 世界约束与外部阻力 |
| `B` | Body（躯壳） | 身体形态、触碰边界 |
| `P` | Power（力量） | 力量量级：凡人→规则之上→造物之权 |
| `R` | Role（立场） | 与秩序的关系 |
| `M` | Motive（动机） | 核心驱动力 |
| `C` | Choice（抉择） | 压力下的抉择方式 |
| `E` | Expression（表达） | 感情表达方式 |
| `J` | Judgment（共情） | 共情模式 |
| `S` | Sanity（心智） | 精神稳定性 |
| `D` | Dynamic（权力） | 关系中的权力结构 |
| `L` | Love（关系认知） | 他对你的认知进化弧线 |
| `A` | Achilles（软肋） | 致命弱点 |
| `H` | Heroine（她的位置） | 女主的能动性与角色定位 |
| `T` | Time（时间） | 时间压力 |
| `X` | eXchange（代价） | 牺牲与代价 |
| `F` | Finale（终局） | 关系最终形态 |
| `Palette` | 调色板 | 文本质感 |

### v2 变更

- **合并 V（凝视）+ L（真伪）→ L（关系认知）**：选项以「起点→终点」弧线呈现
- **合并 P（力量）+ G（神权）→ P（力量）**：统一为三级力量量级
- **新增 H（她的位置）**：定义女主能动性，不再默认被动
- **精简 Palette**：10 → 8 项，合并相似选项
- **补全联动规则**：B→T、S→E/J、R→D、P→X、H→D/L

### 关键联动关系

- `W → C`：世界越残酷，抉择越痛
- `M → C`：动机驱动抉择，除非被爱动摇
- `E + J`：表达（输出）+ 共情（输入）= 沟通模式
- `P → X`：力量越大，代价的量级越高
- `H → D, L`：她的能动性重新定义权力格局和认知进化速度
- `T + F`：时间压力导向终局
- `X ↔ M`：代价必须与动机呼应

### 生成模式

- **开场模式** — 未选 F/X/T 时触发，输出角色设定 + 开场场景
- **时间线模式** — 选了 F/X/T 任一时触发，输出完整命运弧线

### 本地运行

```bash
python -m http.server 8000
```

打开 `http://localhost:8000`

### 仓库结构

```text
.
├── index.html
├── styles.css
├── axes-data.js      # 轴定义（中文）
├── i18n.js           # 英文翻译 + 语言切换
├── config.js         # API 配置、模型列表、进度阶段
├── renderer.js       # Markdown 渲染
├── app.js            # 主逻辑
└── docs/
    └── axis-design-guide.md
```

## License

- Code: MIT
- Art / Content: 非商用，仅学习 / 演示用途
