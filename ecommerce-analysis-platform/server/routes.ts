import { Router } from 'express';
import { getAllAnalyses, saveAnalysis } from './services/storage.js';

const router = Router();

router.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Get all product analyses
router.get('/products', async (req, res) => {
    try {
        const products = getAllAnalyses();
        res.json(products);
    } catch (e) {
         console.error(e);
         res.status(500).json({ error: 'Failed to fetch products' });
    }
});

// Generate AI Analysis
router.post('/analyze', async (req, res) => {
    try {
        const { productName, category, description } = req.body;
        
        // Dynamic import to avoid issues if file not found during initial setup
        const { generateAnalysis } = await import('./services/ai.js');
        
        const analysisResult = await generateAnalysis(productName, category, description);

        // Save to file-based storage
        const saved = saveAnalysis({
            productName: analysisResult.productName || productName,
            category: category,
            targetAudience: analysisResult.targetAudience || '',
            usageScenario: analysisResult.usageScenario || '',
            coreFeatures: analysisResult.coreFeatures || '',
            fullReport: analysisResult.fullReport || '',
            marketingHooks: analysisResult.marketingHooks || [],
            platformAdvice: analysisResult.platformAdvice || [],
            productSuggestions: analysisResult.productSuggestions || []
        });

        res.json(saved);
    } catch (e: any) {
        console.error(e);
        res.status(500).json({ error: e.message || 'Failed to generate analysis' });
    }
});

export { router as apiRouter };
