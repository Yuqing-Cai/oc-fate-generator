# 提示词迭代测试计划

## 测试目标
找到能让 AI 真正理解轴的有机组合、写出活生生的人的提示词

---

## 测试用例（固定输入，对比输出）

### 测试用例 1: 冲突感强
```json
{
  "selections": [
    {"axis": "W", "option": "W1 铁律之笼", "code": "W1"},
    {"axis": "C", "option": "C1 坚守至击碎", "code": "C1"},
    {"axis": "E", "option": "E1 冰山闷骚", "code": "E1"},
    {"axis": "M", "option": "M2 创伤执念", "code": "M2"}
  ],
  "model": "Pro/zai-org/GLM-5"
}
```
**预期：** 写出在规则与爱之间挣扎的角色

### 测试用例 2: 病娇向
```json
{
  "selections": [
    {"axis": "M", "option": "M2 创伤执念", "code": "M2"},
    {"axis": "V", "option": "V2 你是药", "code": "V2"},
    {"axis": "A", "option": "A2 系于一人", "code": "A2"},
    {"axis": "D", "option": "D1 他在上位", "code": "D1"}
  ],
  "model": "Pro/zai-org/GLM-5"
}
```
**预期：** 写出有控制欲但有原因的角色

### 测试用例 3: 治愈向
```json
{
  "selections": [
    {"axis": "E", "option": "E5 照料爹系", "code": "E5"},
    {"axis": "J", "option": "J2 努力学习", "code": "J2"},
    {"axis": "S", "option": "S1 极稳", "code": "S1"},
    {"axis": "Palette", "option": "田园治愈", "code": "田园治愈"}
  ],
  "model": "Pro/zai-org/GLM-5"
}
```
**预期：** 写出温柔但有边界的角色

---

## 评估标准

### ❌ 失败信号
- [ ] 直接复述轴选项原文（如"规矩大过天"）
- [ ] 空洞形容词堆砌（"温柔""强大""冷静"无行为证据）
- [ ] 轴之间无关联（各写各的）
- [ ] 给 MC 命名
- [ ] 悬浮大团圆或纯悲剧宣言

### ✅ 成功信号
- [ ] 轴转化成具体行为和困境
- [ ] 有行为证据支撑人格判定
- [ ] 轴之间有联动（如 W→C, M→C, E+J）
- [ ] 温柔有代价，强大有软肋
- [ ] 信息差制造张力

---

## 提示词版本

### v2.0-deep-prompt (当前)
**特点：** 轴智慧 + 轴关联 + 写人不是写设定
**文件：** worker/index-v2-deep.js

### v2.1-more-examples (待测试)
**改进：** 增加更多示例，教 AI 如何转化轴为场景
**文件：** worker/index-v2.1-examples.js

### v2.2-few-shot (待测试)
**改进：** 加入完整 few-shot 示例（输入→输出）
**文件：** worker/index-v2.2-fewshot.js

---

## 测试命令

```bash
# 测试用例 1
curl -X POST "https://oc-interactive-web-api.yuqing-bnds.workers.dev/generate" \
  -H "Content-Type: application/json" \
  -d '{"selections":[{"axis":"W","option":"W1"},{"axis":"C","option":"C1"},{"axis":"E","option":"E1"},{"axis":"M","option":"M2"}],"model":"Pro/zai-org/GLM-5"}' \
  > test-case1-output.md

# 测试用例 2
curl -X POST "https://oc-interactive-web-api.yuqing-bnds.workers.dev/generate" \
  -H "Content-Type: application/json" \
  -d '{"selections":[{"axis":"M","option":"M2"},{"axis":"V","option":"V2"},{"axis":"A","option":"A2"},{"axis":"D","option":"D1"}],"model":"Pro/zai-org/GLM-5"}' \
  > test-case2-output.md

# 测试用例 3
curl -X POST "https://oc-interactive-web-api.yuqing-bnds.workers.dev/generate" \
  -H "Content-Type: application/json" \
  -d '{"selections":[{"axis":"E","option":"E5"},{"axis":"J","option":"J2"},{"axis":"S","option":"S1"},{"axis":"Palette":"田园治愈"}],"model":"Pro/zai-org/GLM-5"}' \
  > test-case3-output.md
```

---

## 明日任务

1. 跑完 3 个测试用例
2. 用评估标准打分
3. 截图发我输出质量
4. 根据问题调整提示词或回滚

---

## 快速回滚

如果 v2 效果不好，回滚到 v1：
```bash
cd worker
curl -X PUT "https://api.cloudflare.com/client/v4/accounts/852add07dff91e5dcfbf3fb8ba2aad47/workers/scripts/oc-interactive-web-api" \
  -H "Authorization: Bearer rPvDy0PGTs6JYZxPaUVgSI7AU1VU4A7CFoEH_V1J" \
  -H "Content-Type: application/javascript" \
  --data-binary @index-simple.js
```
