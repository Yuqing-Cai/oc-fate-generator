[English](#english) | [中文](#中文)

# English

## OC Fate Generator

OC Fate Generator is a static web frontend for generating male OC setups and fate arcs through a structured 18-axis system.

It is designed around a simple principle: instead of throwing a loose prompt at a model, the interface first turns character design into a set of explicit, composable dimensions, then sends that structured input to a generation backend.

### What This Repository Contains

- the browser UI
- the full 18-axis data model
- selection, validation, and mode-switching logic
- model selection and request assembly
- streaming result rendering
- client-side quality audit

### Runtime Architecture

The deployed system is split into two parts:

1. Static frontend hosted on Aliyun OSS
2. External generation API used by the browser

The frontend is responsible for:

- collecting axis selections
- validating the input
- switching between generation modes
- choosing the model
- rendering streamed or non-streamed output
- running the client-side audit layer

The backend is responsible for:

- turning the structured input into prompt logic
- calling the underlying model
- returning generated text

### Generation Modes

- `opening`
  Activated when `F / X / T / G` are not selected. Focuses on character setup, opening scene, and relationship starting point.
- `timeline`
  Activated when any of `F / X / T / G` are selected. Focuses on fate arc, cost, progression, and ending direction.

### Request Shape

```json
{
  "selections": [
    { "axis": "W", "option": "W1 铁律之笼", "code": "W1" },
    { "axis": "M", "option": "M1 外部使命", "code": "M1" },
    { "axis": "E", "option": "E1 冰山闷骚", "code": "E1" }
  ],
  "model": "Pro/MiniMaxAI/MiniMax-M2.5",
  "extraPrompt": ""
}
```

### Response Shape

Success:

```json
{
  "content": "generated text"
}
```

Failure:

```json
{
  "error": "error message"
}
```

### Active Frontend Features

- one option per axis
- at least 3 non-`Palette` axes required
- multi-line freeform preference input
- streaming generation with progress states
- fallback to non-streaming generation
- copy-to-clipboard for generated output
- markdown-like rich rendering
- built-in keyword-based quality audit

### Local Development

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

### Repository Files

```text
.
├── README.md
├── index.html
├── app.js
└── docs/
    └── axis-design-guide.md
```

---

# 中文

## 项目简介

`OC Fate Generator` 是一个基于 18 轴组合系统的男主 OC 设定与命运骨架生成器。

它的核心不是“随机抽卡式”生成，而是先把角色设计拆成一组可组合、可约束、可联动的结构化输入，再交给后端模型生成文本。这样做的目标，是让输出结果不仅有词面风格，还能在角色逻辑、关系张力、叙事压力、代价与终局之间形成更稳定的因果链。

在线地址：

- `http://www.lnln.fun/oc-gen/`

## 系统结构

当前系统由两部分组成：

1. 部署在阿里云 OSS 上的静态前端
2. 由浏览器直接调用的外部生成接口

前端负责：

- 展示 18 轴输入界面
- 限制每轴单选
- 校验最小输入密度
- 判断生成模式
- 选择模型
- 发起流式或普通生成请求
- 渲染结果
- 执行前端质量审计

后端负责：

- 接收结构化输入
- 组织 prompt 逻辑
- 调用底层模型
- 返回生成文本

## 核心能力

当前版本包含以下能力：

- 18 轴结构化输入
- 多行补充偏好输入框
- `opening` / `timeline` 双生成模式
- 模型切换与本地记忆
- 流式生成
- 非流式回退
- 阶段性进度提示
- 富文本结果渲染
- 复制结果
- 前端质量审计

## 18 轴总览

| 代码 | 轴名 | 作用 |
|------|------|------|
| `W` | World | 世界约束、类型规则、外部阻力 |
| `B` | Body | 身体形态、触碰边界、存在方式 |
| `P` | Power | 力量来源、能力类型、气场 |
| `R` | Role | 与秩序的关系 |
| `M` | Motive | 核心驱动力 |
| `C` | Choice | 压力下的抉择方式 |
| `E` | Expression | 情感表达方式 |
| `J` | Judgment | 共情方式与理解能力 |
| `S` | Sanity | 心智稳定性 |
| `D` | Dynamic | 关系中的权力结构 |
| `V` | View | 他如何看待“你” |
| `L` | Love | 爱的真伪与依恋本质 |
| `A` | Achilles | 软肋触发点 |
| `T` | Time | 时间压力、寿命差、记忆侵蚀等时序变量 |
| `G` | God-mode | 权限范围与改写现实的能力 |
| `X` | eXchange | 代价、牺牲、交换逻辑 |
| `F` | Finale | 终局形态 |
| `Palette` | 调色板 | 输出文本质感 |

这 18 个轴不是并列标签，而是一个输入骨架。页面展示、帮助说明、模式判断和后端提示逻辑都围绕这套结构组织。

## 关键联动关系

生成器明确强调以下关键联动：

- `W -> C`
  世界越残酷，抉择越痛。
- `M -> C`
  抉择必须和动机互相解释。
- `E + J`
  表达方式与共情能力共同决定沟通模式。
- `D + V`
  权力结构与凝视方式共同决定关系动力。
- `L + A`
  爱的真伪与软肋位置共同决定关系深度。
- `T + F`
  时间压力与终局共同决定叙事弧线。
- `X + M`
  代价必须能够回答“为什么值得付出”。

这些联动关系决定了输出结果为什么能比普通关键词拼接更有结构。

## 输入规则

前端执行的规则如下：

- 每个轴最多选择一个选项
- 至少选择 3 个非 `Palette` 轴才能生成

这保证了输入既明确又具备最基本的叙事密度。

## 生成模式

### Opening 模式

当未选择 `F / X / T / G` 时启用。

重点更偏向：

- 角色设定
- 关系起点
- 开场场景
- 第一层冲突张力

### Timeline 模式

当选择了任意一个 `F / X / T / G` 时启用。

重点更偏向：

- 命运骨架
- 代价链条
- 关系推进
- 时间压力
- 终局方向

## 模型选择

当前前端内置以下模型选项：

- `Pro/MiniMaxAI/MiniMax-M2.5`
- `Pro/zai-org/GLM-5`
- `Pro/moonshotai/Kimi-K2.5`
- `Pro/moonshotai/Kimi-K2-Instruct-0905`
- `Pro/deepseek-ai/DeepSeek-V3.2`
- `Pro/deepseek-ai/DeepSeek-V3.1-Terminus`
- `Pro/deepseek-ai/DeepSeek-V3`
- `Pro/zai-org/GLM-4.7`

默认模型：

- `Pro/MiniMaxAI/MiniMax-M2.5`

模型选择会写入浏览器本地存储，在下次打开页面时自动恢复。

## 请求与响应

请求体结构：

```json
{
  "selections": [
    { "axis": "W", "option": "W1 铁律之笼", "code": "W1" },
    { "axis": "M", "option": "M1 外部使命", "code": "M1" },
    { "axis": "E", "option": "E1 冰山闷骚", "code": "E1" }
  ],
  "model": "Pro/MiniMaxAI/MiniMax-M2.5",
  "extraPrompt": ""
}
```

成功返回：

```json
{
  "content": "模型生成的正文"
}
```

失败返回：

```json
{
  "error": "错误信息"
}
```

## 结果渲染

前端支持对模型返回的正文进行类 Markdown 渲染，包括：

- 标题
- 无序列表
- 有序列表
- 引用块
- 分隔线
- 粗体、斜体、行内代码

同时支持流式预览，在生成过程中逐步显示正文。

## 质量审计

当前版本内置前端关键词级质量审计，主要检测以下 5 类风险：

- `therapeutic_language_intrusion`
- `emotional_labor_imbalance`
- `intimacy_escalation_bias`
- `trauma_romanticization`
- `safety_alignment_interference`

审计结果会作为单独模块附加在生成正文之后，作为辅助提示，而不是强制拦截。

## 本地运行

这是一个纯静态前端项目，本地调试不需要安装依赖。

```bash
python -m http.server 8000
```

打开：

```text
http://localhost:8000
```

## 仓库结构

```text
.
├── README.md
├── index.html
├── app.js
└── docs/
    └── axis-design-guide.md
```

## License

- Code: MIT
- Art / Content: 非商用，仅学习 / 演示用途
