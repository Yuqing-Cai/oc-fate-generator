# Worker Versions - 版本历史

## v2.0-deep-prompt (当前版本) ✅

**部署时间:** 2026-03-06 00:26
**部署 ID:** e825f5afb3e0426a8df470436180a7ee

### 核心改进
- 加入轴智慧（AXIS_WISDOM）：每个轴的核心设计哲学
- 加入轴关联规则（AXIS_CONNECTIONS）：轴与轴的内在逻辑
- 重写提示词，强调"写人不是写设定"
- 提高 temperature 到 0.75，增加创造性
- 增加 max_tokens 保证输出质量

### 提示词特点
1. **轴是要理解，不是要复述** - 禁止抄选项原文
2. **轴之间有内在逻辑** - W→C, M→C, E+J, D+V, L+A, T+F, X↔M
3. **写活生生的人** - 温柔要有代价，强大要有软肋

---

## v1.0-simple (初始版本)

**部署时间:** 2026-03-05
**文件:** worker/index-simple.js

### 特点
- 简单直接的提示词
- 基础 CORS 支持
- 单模型调用

---

## 回滚方法

### 方法 1: Cloudflare 后台
1. 打开 https://dash.cloudflare.com/?to=/:account/workers-and-pages/oc-interactive-web-api/versions
2. 找到要回滚的版本
3. 点击 "Rollback"

### 方法 2: API 部署旧版本
```bash
cd worker
curl -X PUT "https://api.cloudflare.com/client/v4/accounts/852add07dff91e5dcfbf3fb8ba2aad47/workers/scripts/oc-interactive-web-api" \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/javascript" \
  --data-binary @index-simple.js  # 或 index-v2-deep.js
```

---

## 测试命令

```bash
# 测试 health
curl https://oc-interactive-web-api.yuqing-bnds.workers.dev/health

# 测试 generate
curl -X POST "https://oc-interactive-web-api.yuqing-bnds.workers.dev/generate" \
  -H "Content-Type: application/json" \
  -d '{"selections":[{"axis":"W","option":"W1"},{"axis":"B","option":"B1"},{"axis":"E","option":"E1"}],"model":"Pro/zai-org/GLM-5"}'
```
