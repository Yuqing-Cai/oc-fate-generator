[English](#oc-fate-generator) | [简体中文](#oc-命运生成器)

# OC Fate Generator

An interactive generator for building male OC setups and fate arcs through a compositional axis system.

## Overview

This project lets you combine world, motive, power, relationship, and aesthetic axes to generate character setups and narrative skeletons with stronger internal logic than flat trope lists.

Rather than choosing from generic labels alone, the generator works through interacting dimensions such as:

- world constraints
- embodiment
- power type
- role stance
- motive
- choice under pressure
- expression style
- empathy mode
- sanity / stability
- power dynamic
- gaze / relational view
- love authenticity
- weakness trigger
- time pressure
- authority scope
- cost
- ending form
- aesthetic palette

## Live Demo

**https://yuqing-cai.github.io/oc-interactive-web/**

Open the page, select at least three axes, optionally add extra preferences, and generate.

## How It Works

### Axis system

- **W** = World
- **B** = Body
- **P** = Power
- **R** = Role
- **M** = Motive
- **C** = Choice
- **E** = Expression
- **J** = Judgment
- **S** = Sanity
- **D** = Dynamic
- **V** = View
- **L** = Love
- **A** = Achilles
- **T** = Time
- **G** = God-mode
- **X** = eXchange
- **F** = Finale
- **Palette** = Aesthetic palette

### Generation modes

- **Opening mode**: triggered when F / X / T / G are not selected; generates a character setup plus opening scene
- **Timeline mode**: triggered when any of F / X / T / G are selected; generates a broader fate skeleton

## Backend Deployment (Optional)

You only need this if you want to replace the API key or switch models.

<details>
<summary>Deployment guide</summary>

### 1. Prepare

```bash
npm install -g wrangler
cd worker
wrangler login
```

### 2. Configure secrets

```bash
wrangler secret put OPENAI_API_KEY
```

### 3. Deploy

```bash
wrangler deploy
```

After deployment, paste the returned `/generate` endpoint back into the frontend `app.js`.

</details>

## License

- Code: MIT
- Art / Content: non-commercial, learning / demo use only

---

# OC 命运生成器

一个通过多轴系统生成男性 OC 设定与命运骨架的交互式工具。

## 项目概述

这个项目允许你通过世界、动机、力量、关系与美学等多个维度的组合，生成内部逻辑更完整的角色设定与命运骨架，而不是停留在平面的 trope 标签堆砌。

它不是单纯从几个关键词里随机抽卡，而是基于一组可组合、可联动的轴来生成角色：

- 世界约束
- 躯体形态
- 力量类型
- 立场关系
- 动机支柱
- 压力下的抉择
- 表达方式
- 共情模式
- 心智稳定性
- 权力结构
- 凝视方式 / 关系视角
- 爱的真伪
- 软肋触发点
- 时间压力
- 权限范围
- 代价
- 终局形态
- 美学调色板

## 在线试玩

**https://yuqing-cai.github.io/oc-interactive-web/**

打开页面后，至少选择 3 个轴，可选填写补充偏好，然后直接生成。

## 使用方式

### 轴系统

- **W** = World（世界）
- **B** = Body（躯壳）
- **P** = Power（力量）
- **R** = Role（立场）
- **M** = Motive（动机）
- **C** = Choice（抉择）
- **E** = Expression（表达）
- **J** = Judgment（共情）
- **S** = Sanity（心智）
- **D** = Dynamic（权力）
- **V** = View（凝视）
- **L** = Love（真伪）
- **A** = Achilles（软肋）
- **T** = Time（时间）
- **G** = God-mode（神权）
- **X** = eXchange（代价）
- **F** = Finale（终局）
- **Palette** = 调色板（美学风格）

### 生成模式

- **开场模式**：未选择 F / X / T / G 时触发，生成角色设定与开场场景
- **时间线模式**：选择了 F / X / T / G 任一时触发，生成更完整的命运骨架

## 自建后端（可选）

只有在你想替换 API Key 或切换模型时，才需要看这一部分。

<details>
<summary>部署指南</summary>

### 1. 准备

```bash
npm install -g wrangler
cd worker
wrangler login
```

### 2. 配置密钥

```bash
wrangler secret put OPENAI_API_KEY
```

### 3. 部署

```bash
wrangler deploy
```

部署完成后，把返回的 `/generate` 地址填回前端 `app.js` 即可。

</details>

## License

- Code：MIT
- Art / Content：非商用，仅学习 / 演示用途
