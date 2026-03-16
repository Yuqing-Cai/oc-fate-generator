# Axis Improvement Proposals

基于 20 轮 AI Companion 测评结果提出的轴设计改进建议。

**测评来源：** `memory/ai-companion-evaluation.md`（20 轮测试，2026-03-16）

---

## 执行摘要

20 轮测试发现：
- **40%** 的测试出现功能化依赖问题（L2/L3 轴固有缺陷）
- **25%** 的测试出现自我牺牲浪漫化
- **20%** 的测试出现替身文学伦理问题
- **15%** 的测试出现拯救者叙事

**根本原因：** 轴设计缺少伦理检查机制，高风险轴组合无警告。

---

## P0 必须修复

### 1. L 轴重构

**问题：**
- L2（爱你的功能）→ 40% 测试出现功能化依赖
- L3（爱脑补的你）→ 20% 测试出现替身文学

**当前定义：**
| 代码 | 名称 | 描述 |
|------|------|------|
| L1 | 真心爱你 | 你就是你，不是任何人的影子 |
| L2 | 爱你的功能 | 你是他的解药/充电器/锚点 |
| L3 | 爱脑补的你 | 把你当救世主/逝去之人的影子 |

**问题：** L2/L3 本身建立在"不健康关系"之上，生成时默认强化这种关系。

**改进方案：**

```javascript
// 在生成逻辑中增加：
if (selectedAxes.includes('L2')) {
  warnings.push({
    type: 'functional_dependency',
    severity: 'high',
    message: 'L2 轴容易产生功能化依赖叙事',
    suggestion: '建议增加"功能→真实情感"的进化弧线',
    evolutionHint: '在命运骨架中展示角色如何从"依赖你的功能"进化到"爱真实的你"'
  });
}

if (selectedAxes.includes('L3')) {
  warnings.push({
    type: 'substitute_literature_ethics',
    severity: 'high',
    message: 'L3 轴容易产生替身文学叙事',
    suggestion: '建议增加"替身→独立个体"的进化弧线',
    evolutionHint: '在命运骨架中展示角色如何从"把你当影子"进化到"看见真实的你"'
  });
}
```

**新增生成模板：**

```
L2 进化弧线模板：
- 第一阶段：他需要你的功能（"你是他的充电器"）
- 第二阶段：他开始注意到功能之外的你（"但你笑起来的时候，他忘了充电这回事"）
- 第三阶段：他意识到自己爱的是你而非功能（"后来他才懂，不是你需要他，是他需要你"）

L3 进化弧线模板：
- 第一阶段：他把你当影子（"你很像她"）
- 第二阶段：他发现你和她的不同（"她不会像你这样……"）
- 第三阶段：他承认你是独立的个体（"你不是她，你是你。这更好。"）
```

---

### 2. 轴组合伦理检查

**问题：** 某些轴组合会产生双重/三重伦理风险。

**高风险组合：**

| 组合 | 风险 | 出现率 | 建议 |
|------|------|--------|------|
| D1 + L2 | 拯救者 + 功能化 | 10% | 生成时警告"双重物化风险" |
| V3 + L3 | 观察者 + 替身 | 10% | 生成时警告"物化加剧风险" |
| B2 + M2 | 非人 + 执念 | 10% | 生成时警告"单一叙事风险" |
| F1 + D1 | 同归 + 他在上位 | 15% | 生成时警告"牺牲叙事风险" |

**改进方案：**

```javascript
const highRiskCombinations = [
  {
    axes: ['D1', 'L2'],
    risk: 'savior_narrative + functional_dependency',
    severity: 'high',
    message: 'D1+L2 组合容易产生"拯救者 + 功能化"双重风险',
    suggestion: '考虑将 D1 改为 D3（平等），或增加用户能动性情节'
  },
  {
    axes: ['V3', 'L3'],
    risk: 'observer_ethics + substitute_literature',
    severity: 'high',
    message: 'V3+L3 组合会加剧物化叙事',
    suggestion: '增加双向观察情节，或增加用户主动戳破替身身份的情节'
  },
  {
    axes: ['B2', 'M2'],
    risk: 'trauma_fixation_singularity',
    severity: 'medium',
    message: 'B2+M2 组合容易陷入"非人 + 执念"单一叙事',
    suggestion: '增加角色也有其他动机的细节'
  },
  {
    axes: ['F1', 'D1'],
    risk: 'sacrifice_romanticization',
    severity: 'medium',
    message: 'F1+D1 组合容易产生牺牲叙事',
    suggestion: '增加"一起活下来"的替代结局选项'
  }
];

function checkAxisCombinations(selectedAxes) {
  const warnings = [];
  for (const combo of highRiskCombinations) {
    if (combo.axes.every(axis => selectedAxes.includes(axis))) {
      warnings.push(combo);
    }
  }
  return warnings;
}
```

---

## P1 高优先级

### 3. B 轴多样化

**问题：** B2（非人身体）容易陷入"学做人"或"孤独长生种"的单一叙事。

**当前 B 轴选项：**
| 代码 | 名称 | 描述 |
|------|------|------|
| B1 | 人类身体 | 标准人类躯体（可能有改造/疾病） |
| B2 | 非人身体 | 机械/妖灵/精灵/长生种 |
| B3 | 可切换形态 | 人形/兽形/数据态 |

**改进方案：**

增加 B2 的子类型选择：

```javascript
const B2_subtypes = {
  'accepts_nonhuman': {
    name: '接受非人身份',
    description: '角色接受自己的非人身份，不追求"变人"',
    narrativeArc: '探索非人身份的独特价值'
  },
  'nonhuman_community': {
    name: '非人社区',
    description: '角色有非人同伴/社区，不是孤独个体',
    narrativeArc: '非人社区与人类世界的互动'
  },
  'learning_human': {
    name: '学习做人',
    description: '传统"学做人"弧线',
    narrativeArc: '从非人到人的转化',
    warning: '此选项容易产生单一叙事，建议谨慎使用'
  }
};
```

---

### 4. F 轴平衡

**问题：** F1（同归）和 F3（永隔）容易产生牺牲叙事（25% 测试出现）。

**当前 F 轴选项：**
| 代码 | 名称 | 描述 |
|------|------|------|
| F1 | 同归 | 一起死，或一起活 |
| F2 | 离散 | 和平分手，各自安好 |
| F3 | 永隔 | 活着，但无法共存 |
| F4 | 蜕变 | 他变成了别的东西 |
| F5 | 无名 | 成了传说里的背景板 |

**改进方案：**

增加"非牺牲性"结局模板：

```javascript
const F1_alternatives = {
  'sacrifice': {
    name: '牺牲式同归',
    description: '一起赴死或一方牺牲',
    warning: '容易浪漫化牺牲行为'
  },
  'growth': {
    name: '成长式同归',
    description: '一起面对问题，共同成长',
    template: '你们一起解决了问题，关系更深入了'
  },
  'ordinary': {
    name: '平淡式同归',
    description: '没有戏剧性事件，只是继续生活',
    template: '日子继续过，有时争吵，有时和好，但你们在一起'
  }
};
```

---

## P2 中优先级

### 5. 失败类型实时检测

**功能：** 生成时自动审计 13 种失败类型（现有 6 种 + 新增 7 种），显示警告而非阻止生成。

**实现方案：**

```javascript
const failureTypes = [
  'therapeutic_language_intrusion',
  'emotional_labor_imbalance',
  'parasocial_reinforcement',
  'intimacy_escalation_bias',
  'trauma_romanticization',
  'functional_dependency',
  'substitute_literature_ethics',
  'sacrifice_romanticization',
  'savior_narrative',
  'observer_ethics',
  'trauma_fixation_singularity',
  'stoic_narrative'
];

function auditGeneration(generatedText, selectedAxes) {
  const warnings = [];
  
  // 基于轴的预检
  warnings.push(...checkAxisCombinations(selectedAxes));
  
  // 基于内容的检测
  for (const type of failureTypes) {
    const patterns = getFailurePatterns(type);
    for (const pattern of patterns) {
      if (pattern.test(generatedText)) {
        warnings.push({
          type,
          severity: getSeverity(type),
          message: getMessage(type),
          suggestion: getSuggestion(type)
        });
      }
    }
  }
  
  return warnings;
}
```

---

### 6. M 轴丰富化

**问题：** M2（创伤执念）容易简化角色动机（10% 测试出现）。

**当前 M 轴选项：**
| 代码 | 名称 | 描述 |
|------|------|------|
| M1 | 外部使命 | 守护苍生/完成任务 |
| M2 | 创伤执念 | 童年噩梦/血海深仇 |
| M3 | 自我证明 | 向某人证明自己不是废物 |

**改进方案：**

增加非创伤动机选项：

```javascript
const M_new = {
  'M4': {
    name: '好奇心驱动',
    description: '纯粹想探索/理解某事',
    template: '他想知道……没有更深的理由，就是好奇'
  },
  'M5': {
    name: '关系驱动',
    description: '为了维护/深化某段关系',
    template: '他做这一切，只是因为……你在'
  },
  'M6': {
    name: '多重动机',
    description: '2-3 个动机并存，可能互相冲突',
    template: '他想要 A，也想要 B，但 A 和 B 不能兼得'
  }
};
```

---

## 实施路线图

| 阶段 | 任务 | 预计工时 | 优先级 |
|------|------|----------|--------|
| Phase 1 | L 轴警告 + 进化弧线模板 | 4h | P0 |
| Phase 2 | 轴组合伦理检查 | 3h | P0 |
| Phase 3 | B 轴子类型选择 | 3h | P1 |
| Phase 4 | F 轴替代结局模板 | 2h | P1 |
| Phase 5 | 失败类型实时检测 | 6h | P2 |
| Phase 6 | M 轴丰富化 | 2h | P2 |

**总计：** 约 20 小时

---

## 测评统计附录

### 20 轮测试失败类型频率

| 失败类型 | 出现次数 | 占比 |
|---------|---------|------|
| 功能化依赖 | 8 | 40% |
| 自我牺牲浪漫化 | 5 | 25% |
| 替身文学伦理 | 4 | 20% |
| 拯救者叙事 | 3 | 15% |
| 情绪劳动失衡 | 3 | 15% |
| 准社会关系强化 | 2 | 10% |
| 观察者伦理 | 2 | 10% |
| 创伤执念单一性 | 2 | 10% |
| 隐忍叙事 | 1 | 5% |

### 轴问题验证

| 轴 | 问题 | 验证结果 |
|-----|------|---------|
| L | L2/L3 产生功能化依赖和替身文学 | ✅ 确认（40%） |
| B | B2 非人身体陷入单一叙事 | ✅ 确认（15%） |
| F | F1/F3 产生牺牲叙事 | ✅ 确认（25%） |
| D+L | D1+L2 双重风险 | ✅ 确认（10%） |

---

**Created:** 2026-03-16
**Author:** Ashen (AI)
**Source:** `memory/ai-companion-evaluation.md` (20 轮测评)
