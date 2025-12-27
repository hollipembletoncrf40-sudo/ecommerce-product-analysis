import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import path from 'path';

const router = Router();

// Initialize Prisma Client with Driver Adapter
const dbPath = path.resolve(process.cwd(), 'prisma', 'dev.db');
const adapter = new PrismaBetterSqlite3({ url: `file:${dbPath}` });
const prisma = new PrismaClient({ adapter });

router.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Get all reference tags
router.get('/tags', async (req, res) => {
    try {
        const tags = await prisma.referenceTag.findMany();
        res.json(tags);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Failed to fetch tags' });
    }
});

// Get all product analyses
router.get('/products', async (req, res) => {
    try {
        const products = await prisma.productAnalysis.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json(products);
    } catch (e) {
         console.error(e);
         res.status(500).json({ error: 'Failed to fetch products' });
    }
});

// Create a new product analysis (Stub for now)
router.post('/products', async (req, res) => {
    try {
        const data = req.body;
        // In a real scenario, validte data with Zod
        const product = await prisma.productAnalysis.create({
            data: {
                productName: data.productName,
                targetAudience: data.targetAudience,
                usageScenario: data.usageScenario,
                priceRange: data.priceRange || '',
                coreFeatures: data.coreFeatures || '',
                marketingPoints: JSON.stringify(data.marketingPoints || []),
                platformAdvice: JSON.stringify(data.platformAdvice || []),
                fullReport: data.fullReport || ''
            }
        });
        res.json(product);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Failed to create product analysis' });
    }
});

// Generate AI Analysis
router.post('/analyze', async (req, res) => {
    try {
        const { productName, category, description } = req.body;
        
        // Dynamic import to avoid issues if file not found during initial setup
        const { generateAnalysis } = await import('./services/ai.js');
        
        const analysisResult = await generateAnalysis(productName, category, description);

        // Return result directly (skip DB save for now due to adapter issues)
        res.json({
            productName: analysisResult.productName,
            targetAudience: analysisResult.targetAudience,
            usageScenario: analysisResult.usageScenario,
            coreFeatures: analysisResult.coreFeatures,
            fullReport: analysisResult.fullReport,
            marketingHooks: analysisResult.marketingHooks,
            platformAdvice: analysisResult.platformAdvice,
            productSuggestions: analysisResult.productSuggestions
        });
    } catch (e: any) {
        console.error(e);
        res.status(500).json({ error: e.message || 'Failed to generate analysis' });
    }
});

export { router as apiRouter };
