import dotenv from 'dotenv';

dotenv.config();

const API_KEY = process.env.MIMO_API_KEY;
const BASE_URL = process.env.OPENAI_BASE_URL || 'https://api.xiaomimimo.com/v1';

export const SYSTEM_PROMPT = `你是顶级商业分析师。生成简洁但完整的18维选品分析报告。

## 输出格式要求（必须严格遵守）

1. **每个维度用表格呈现关键信息**
2. 每个维度100-200字精炼分析 + 1-2个表格
3. 数据使用「保守|中性|乐观」三列表格
4. 必须完成全部18个维度
5. 最后给出「综合结论与建议」

## 18维分析框架

### 第一部分：战略基础（维度1-6）
1. **产品定位**（USP、核心价值、差异化）
2. **目标市场**（TAM/SAM/SOM、用户画像）
3. **竞争分析**（竞品对比表、五力分析）
4. **商业模式**（价值链、收入来源）
5. **产品策略**（产品线规划、迭代路径）
6. **进入策略**（时机、方式、资源）

### 第二部分：运营执行（维度7-12）
7. **营销推广**（渠道策略、KOL投放）
8. **销售渠道**（平台选择、跨境机会）
9. **运营管理**（团队、流程、品控）
10. **供应链**（生产、采购、物流）
11. **人力资源**（团队配置、成本）
12. **技术创新**（功能优化、知识产权）

### 第三部分：财务风险（维度13-18）
13. **财务模型**（成本/收入/利润表格）
14. **投资回报**（ROI、盈亏平衡点）
15. **风险管控**（风险矩阵表格）
16. **法律合规**（认证、专利、合规）
17. **可持续发展**（ESG、品牌路径）
18. **实施路线图**（90天计划、里程碑）

## 表格示例格式

| 指标 | 保守 | 中性 | 乐观 |
|------|------|------|------|
| 市场规模 | 50亿 | 80亿 | 120亿 |
| 首年销量 | 1万 | 3万 | 5万 |

| 维度 | 要点1 | 要点2 | 要点3 |
|------|-------|-------|-------|
| 产品 | xxx | xxx | xxx |

**必须完成所有18个维度分析后，给出综合结论。**`;

// MiMo API Configuration (fallback - working)
const MIMO_API_KEY = process.env.MIMO_API_KEY;
const MIMO_BASE_URL = process.env.OPENAI_BASE_URL || 'https://api.xiaomimimo.com/v1';

export async function generateAnalysis(productName: string, category: string, description: string, useCases?: string, painPoints?: string) {
  if (!MIMO_API_KEY) {
     throw new Error("MIMO_API_KEY is not set in environment variables.");
  }

  console.log("Calling MiMo API for comprehensive analysis:", productName, category);

  const userPrompt = `分析产品：**${productName || '未定'}** | 类目：**${category}** | 描述：${description || '无'}

${!productName ? '**特殊指令**：产品未定，请先推荐3个方向，选择最优方向进行18维分析。' : ''}

**输出要求**：
1. 必须完成全部18个维度分析
2. 每个维度用1-2个表格展示核心数据
3. 数据必须有保守/中性/乐观三列
4. 最后给出综合结论与建议

请开始18维分析，确保每个维度都有分析和表格：`;

  const response = await fetch(`${MIMO_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': MIMO_API_KEY,
    },
    body: JSON.stringify({
      model: "mimo-v2-flash",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt }
      ],
      max_tokens: 16384,
      temperature: 0.6,
      top_p: 0.95,
      stream: false,
      thinking: { type: "disabled" }
    }),
    signal: AbortSignal.timeout(300000) // 5 minute timeout
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("MiMo API Error:", response.status, errorText);
    throw new Error(`API returned ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  // MiMo uses OpenAI-compatible format
  const rawContent = data.choices?.[0]?.message?.content;
  
  console.log("MiMo Response length:", rawContent?.length);

  if (!rawContent) throw new Error("No content generated");

  // For comprehensive reports, return the markdown directly
  return {
    productName: productName || '未定选品',
    coreFeatures: "",
    usageScenario: "",
    targetAudience: "",
    culturalContext: "",
    materialInnovation: "",
    productSuggestions: [],
    marketingHooks: [],
    platformAdvice: [],
    riskAssessment: "",
    fullReport: rawContent  // Return raw markdown report
  };
}

