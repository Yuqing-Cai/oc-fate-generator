#!/bin/bash
# OC Interactive Web - 提示词测试脚本
# 用法：./test-prompts.sh

WORKER_URL="https://oc-interactive-web-api.yuqing-bnds.workers.dev/generate"

echo "🧪 OC 生成器提示词测试"
echo "======================"
echo ""

# 测试用例 1: 冲突感强
echo "📝 测试用例 1: 冲突感强 (W1+C1+E1+M2)"
echo "--------------------------------------"
curl -s -X POST "$WORKER_URL" \
  -H "Content-Type: application/json" \
  -d '{"selections":[{"axis":"W","option":"W1"},{"axis":"C","option":"C1"},{"axis":"E","option":"E1"},{"axis":"M","option":"M2"}],"model":"Pro/zai-org/GLM-5"}' \
  --max-time 120 \
  -o test-case1-output.json

if [ $? -eq 0 ]; then
  echo "✅ 生成成功！输出已保存到 test-case1-output.json"
  # 提取 content 字段
  cat test-case1-output.json | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('content','')[:500]+'...' if len(d.get('content',''))>500 else d.get('content',''))" 2>/dev/null || echo "⚠️ 无法解析 JSON，请手动检查"
else
  echo "❌ 请求失败，可能是网络问题或 Worker 离线"
fi

echo ""
echo "按回车继续测试用例 2..."
read

# 测试用例 2: 病娇向
echo "📝 测试用例 2: 病娇向 (M2+V2+A2+D1)"
echo "------------------------------------"
curl -s -X POST "$WORKER_URL" \
  -H "Content-Type: application/json" \
  -d '{"selections":[{"axis":"M","option":"M2"},{"axis":"V","option":"V2"},{"axis":"A","option":"A2"},{"axis":"D","option":"D1"}],"model":"Pro/zai-org/GLM-5"}' \
  --max-time 120 \
  -o test-case2-output.json

if [ $? -eq 0 ]; then
  echo "✅ 生成成功！输出已保存到 test-case2-output.json"
  cat test-case2-output.json | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('content','')[:500]+'...' if len(d.get('content',''))>500 else d.get('content',''))" 2>/dev/null || echo "⚠️ 无法解析 JSON"
else
  echo "❌ 请求失败"
fi

echo ""
echo "按回车继续测试用例 3..."
read

# 测试用例 3: 治愈向
echo "📝 测试用例 3: 治愈向 (E5+J2+S1+ 田园治愈)"
echo "------------------------------------------"
curl -s -X POST "$WORKER_URL" \
  -H "Content-Type: application/json" \
  -d '{"selections":[{"axis":"E","option":"E5"},{"axis":"J","option":"J2"},{"axis":"S","option":"S1"},{"axis":"Palette","option":"田园治愈"}],"model":"Pro/zai-org/GLM-5"}' \
  --max-time 120 \
  -o test-case3-output.json

if [ $? -eq 0 ]; then
  echo "✅ 生成成功！输出已保存到 test-case3-output.json"
  cat test-case3-output.json | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('content','')[:500]+'...' if len(d.get('content',''))>500 else d.get('content',''))" 2>/dev/null || echo "⚠️ 无法解析 JSON"
else
  echo "❌ 请求失败"
fi

echo ""
echo "======================"
echo "🎉 测试完成！"
echo ""
echo "评估标准："
echo "❌ 失败信号："
echo "   - 直接复述轴选项原文（如'规矩大过天'）"
echo "   - 空洞形容词堆砌（'温柔''强大'无行为证据）"
echo "   - 轴之间无关联（各写各的）"
echo "   - 给 MC 命名"
echo ""
echo "✅ 成功信号："
echo "   - 轴转化成具体行为和困境"
echo "   - 有行为证据支撑人格判定"
echo "   - 轴之间有联动（如 W→C, M→C, E+J）"
echo "   - 温柔有代价，强大有软肋"
echo ""
echo "把输出截图发给小蜘蛛，他会根据问题调整提示词！🕷️"
