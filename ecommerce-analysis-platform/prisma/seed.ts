import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { PrismaClient } = require("@prisma/client");
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding...')

  // 1. Seed Reference Tags from CSVs
  const csvFiles = [
    { name: 'IP分类表格.csv', category: 'IP' },
    { name: '兴趣爱好分类表格.csv', category: 'INTEREST' },
    { name: '动物分类表格.csv', category: 'ANIMAL' },
    { name: '场景分类表格.csv', category: 'SCENE' },
    { name: '文化分类表格.csv', category: 'CULTURE' },
    { name: '节日分类表格.csv', category: 'FESTIVAL' },
    { name: '宴会分类表格.csv', category: 'banquet' },
  ]

  for (const item of csvFiles) {
    const filePath = path.join(process.cwd(), '../', item.name)
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8')
      const lines = content.split('\n')
        .map(l => l.trim())
        .filter(l => l.length > 0 && !l.includes(item.name.replace('表格.csv', ''))) // Skip header roughly
      
      console.log(`Seeding ${item.category}: ${lines.length} items`)

      for (const value of lines) {
        // Skip header lines that match category name exact
        if (value === item.name.replace('表格.csv', '')) continue;
        
        await prisma.referenceTag.upsert({
          where: { category_value: { category: item.category, value } },
          update: {},
          create: { category: item.category, value }
        })
      }
    } else {
      console.warn(`File not found: ${filePath}`)
    }
  }

  // 2. Seed Product Analysis from JSON
  const jsonPath = path.join(process.cwd(), '../力量训练配件选品分析.json')
  if (fs.existsSync(jsonPath)) {
    const rawParams = fs.readFileSync(jsonPath, 'utf-8')
    const data = JSON.parse(rawParams)
    const analysis = data['选品分析数据']

    if (analysis) {
      console.log(`Seeding Product: ${analysis['基础产品名称']}`)
      await prisma.productAnalysis.create({
        data: {
          productName: analysis['基础产品名称'],
          targetAudience: analysis['核心受众群体'],
          usageScenario: analysis['用户输入场景'],
          priceRange: "200-500元", // Extracted manually or from content
          coreFeatures: analysis['核心功能/卖点'] || "", 
          marketingPoints: JSON.stringify([
            analysis['营销亮点1'], 
            analysis['营销亮点2'], 
            analysis['营销亮点3']
          ]),
          platformAdvice: JSON.stringify([
            analysis['目标平台建议1'], 
            analysis['目标平台建议2'], 
            analysis['目标平台建议3']
          ]),
          fullReport: "### 自动导入的分析报告\n" + JSON.stringify(analysis, null, 2)
        }
      })
    }
  }

  console.log('Seeding finished.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
