# OC 命运生成器

选择轴要素，一键生成男主设定与命运骨架。

## 🎮 直接开玩

**https://yuqing-cai.github.io/oc-interactive-web/**

1. 勾选至少 3 项轴
2. 可选填写补充偏好
3. 点击生成

> 无需配置，开箱即用。

---

## 📖 使用说明

### 轴要素说明

- **W** = World（世界阻力）
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

- **开场静态模式**：未选 F/X/T/G 时触发，生成角色设定 + 开场场景
- **完整时间线模式**：选了 F/X/T/G 任一，生成完整命运骨架

---

## 🛠️ 自建后端（可选）

只有你想换 API Key 或模型时才需要。

<details>
<summary>展开部署指南</summary>

### 1. 准备

```bash
npm install -g wrangler
cd worker
wrangler login
```

### 2. 配置 Key

```bash
wrangler secret put OPENAI_API_KEY
```

### 3. 部署

```bash
wrangler deploy
```

部署后把返回的 `/generate` 地址贴回前端 `app.js` 中的 `FIXED_API_URL` 即可。

</details>

---

## 📝 License

Code: MIT
Art/Content: 非商用，仅学习/演示用途
