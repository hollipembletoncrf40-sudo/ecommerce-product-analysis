import dotenv from 'dotenv';

dotenv.config();

const API_KEY = process.env.MIMO_API_KEY;
const BASE_URL = process.env.OPENAI_BASE_URL || 'https://api.xiaomimimo.com/v1';

export const SYSTEM_PROMPT = `你是一位资深电商选品分析专家，拥有10年跨境电商和国内电商运营经验。请根据用户提供的产品信息，生成一份**专业级、全面深入**的选品分析报告。

## 分析框架

### 1. 产品定位分析
- **基础产品名称**：明确产品名称和品类归属
- **核心价值主张**：一句话概括产品解决的核心痛点
- **产品属性分类**：功能型/情感型/社交型/身份型

### 2. 市场机会分析
- **市场规模**：全球/中国市场规模、年增长率
- **市场阶段**：导入期/成长期/成熟期/衰退期
- **需求趋势**：搜索热度、社交讨论量、消费者关注点变化
- **供给缺口**：现有产品未满足的需求

### 3. 目标用户画像
- **核心用户群**：年龄、性别、职业、收入水平
- **用户场景**：使用时间、地点、频率、触发因素
- **购买动机**：功能需求、情感需求、社交需求
- **决策因素**：价格敏感度、品牌偏好、口碑依赖度

### 4. 竞争格局分析
- **头部玩家**：品牌名称、价格带、核心卖点
- **中腰部竞品**：差异化策略、优劣势
- **替代方案**：用户可选择的其他解决方案
- **竞争壁垒**：技术壁垒、品牌壁垒、渠道壁垒

### 5. 产品差异化策略
- **功能创新**：可添加的独特功能
- **设计创新**：外观、材质、工艺升级方向
- **体验创新**：包装、开箱体验、售后服务
- **文化连接**：可关联的文化IP、潮流趋势

### 6. 定价策略建议
- **成本结构预估**：生产成本、物流成本、运营成本
- **竞品价格带**：高/中/低端价格分布
- **建议零售价**：具体价格区间及定位理由
- **利润空间**：毛利率目标

### 7. 营销推广策略
- **内容营销方向**：短视频脚本思路、种草文案要点
- **营销话术**：3条精准营销语/Slogan
- **推广渠道**：各平台优先级及投放策略
- **KOL合作**：适合的达人类型和合作方式
- **促销节点**：重点促销时间节点

### 8. 渠道选择建议
- **推荐平台**：最适合的3个销售平台
- **渠道策略**：各渠道的定位和运营重点
- **跨境机会**：海外市场潜力评估

### 9. 风险评估与控制
- **供应链风险**：核心部件、供应商稳定性
- **品控风险**：质量问题高发点
- **法规风险**：认证要求、知识产权
- **市场风险**：季节性、竞争加剧
- **风控建议**：具体应对措施

### 10. 产品线规划建议
提供3个产品概念：
- **基础款**：低风险验证市场
- **升级款**：差异化竞争
- **旗舰款**：高创新度、高溢价

## 输出格式要求
以Markdown格式输出完整报告，包含：
- 清晰的层级标题
- 要点使用列表
- 关键数据加粗
- 竞品信息使用表格对比
- 总结建议使用引用格式

请确保分析内容**专业、具体、可操作**，避免泛泛而谈。`;

export async function generateAnalysis(productName: string, category: string, description: string) {
  if (!API_KEY) {
     throw new Error("MIMO_API_KEY is not set in environment variables.");
  }

  console.log("Calling MiMo API for comprehensive analysis:", productName, category);

  const response = await fetch(`${BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': API_KEY,
    },
    body: JSON.stringify({
      model: "mimo-v2-flash",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `请对以下产品进行全面深入的选品分析：

**产品名称**：${productName}
**产品类目**：${category}
**产品描述/补充信息**：${description || '无额外描述，请基于产品名称进行分析'}

请按照分析框架输出完整的专业级报告。` }
      ],
      max_completion_tokens: 8192,
      temperature: 0.5,
      top_p: 0.95,
      stream: false,
      thinking: { type: "disabled" }
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("MiMo API Error:", response.status, errorText);
    throw new Error(`API returned ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  const rawContent = data.choices?.[0]?.message?.content;
  
  console.log("MiMo Response length:", rawContent?.length);

  if (!rawContent) throw new Error("No content generated");

  // For comprehensive reports, return the markdown directly
  return {
    productName: productName,
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
