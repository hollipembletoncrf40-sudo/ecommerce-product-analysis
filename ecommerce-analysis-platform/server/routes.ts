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

// Quota related imports
import { checkQuota, incrementUsage, redeemKey, generateKeys } from './services/quota.js';

// Get Current Quota
router.get('/quota', async (req, res) => {
    try {
        const clientId = req.headers['x-client-id'] as string;
        if (!clientId) {
             return res.status(400).json({ error: 'Client ID required' });
        }
        const quota = await checkQuota(clientId);
        res.json(quota);
    } catch (e: any) {
        console.error(e);
        res.status(500).json({ error: e.message || 'Failed to check quota' });
    }
});

// Redeem Card Key
router.post('/quota/redeem', async (req, res) => {
    try {
        const { key } = req.body;
        const clientId = req.headers['x-client-id'] as string;
        
        if (!clientId || !key) {
             return res.status(400).json({ error: 'Client ID and Key required' });
        }

        const result = await redeemKey(clientId, key);
        res.json(result);
    } catch (e: any) {
        console.error(e);
        res.status(400).json({ error: e.message || 'Failed to redeem key' });
    }
});

// Admin: Generate Keys (Protected by simple key for now or just hidden)
router.post('/quota/generate', async (req, res) => {
    try {
        const { count, adminKey } = req.body;
        
        // Simple admin protection
        if (adminKey !== process.env.ADMIN_KEY && adminKey !== 'admin123') {
             return res.status(403).json({ error: 'Unauthorized' });
        }

        const keys = await generateKeys(count || 1);
        res.json({ keys });
    } catch (e: any) {
        console.error(e);
        res.status(500).json({ error: e.message || 'Failed to generate keys' });
    }
});

// Generate AI Analysis
router.post('/analyze', async (req, res) => {
    try {
        const clientId = req.headers['x-client-id'] as string;
        if (!clientId) {
             return res.status(400).json({ error: 'Client ID required' });
        }

        // 1. Check Quota
        const { allowed, remaining } = await checkQuota(clientId);
        if (!allowed) {
            return res.status(403).json({ 
                error: 'Quota exceeded', 
                quotaExceeded: true,
                message: '您的免费使用次数已用完，请使用卡密充值。'
            });
        }

        const { productName, category, description } = req.body;
        
        // Dynamic import to avoid issues if file not found during initial setup
        const { generateAnalysis } = await import('./services/ai.js');
        
        const analysisResult = await generateAnalysis(productName, category, description);

        // 2. Increment Usage after successful analysis
        await incrementUsage(clientId);

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

// ========== ADMIN ROUTES ==========
import { db } from './db.js';
import { randomBytes } from 'crypto';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin888';
const ADMIN_TOKEN = 'admin_' + randomBytes(16).toString('hex');

// Admin Login
router.post('/admin/login', async (req, res) => {
    try {
        const { password } = req.body;
        
        if (password !== ADMIN_PASSWORD) {
            return res.status(401).json({ error: '密码错误' });
        }

        res.json({ token: ADMIN_TOKEN, success: true });
    } catch (e: any) {
        console.error(e);
        res.status(500).json({ error: e.message || 'Login failed' });
    }
});

// Admin Middleware
function requireAdmin(req: any, res: any, next: any) {
    const auth = req.headers.authorization;
    if (!auth || auth !== `Bearer ${ADMIN_TOKEN}`) {
        return res.status(401).json({ error: '未授权访问' });
    }
    next();
}

// Get all keys and stats
router.get('/admin/keys', requireAdmin, async (req, res) => {
    try {
        const keys = await db.accessKey.findMany({
            orderBy: { createdAt: 'desc' }
        });

        const users = await db.userUsage.findMany();
        
        const stats = {
            totalUsers: users.length,
            totalKeys: keys.length,
            usedKeys: keys.filter(k => k.isUsed).length,
            totalUsage: users.reduce((sum, u) => sum + u.usageCount, 0)
        };

        res.json({ keys, stats });
    } catch (e: any) {
        console.error(e);
        res.status(500).json({ error: e.message || 'Failed to fetch keys' });
    }
});

// Generate keys (admin)
router.post('/admin/keys/generate', requireAdmin, async (req, res) => {
    try {
        const { count = 5, usesPerKey = 30 } = req.body;
        
        const keys = await generateKeys(count, usesPerKey);
        res.json({ keys, success: true });
    } catch (e: any) {
        console.error(e);
        res.status(500).json({ error: e.message || 'Failed to generate keys' });
    }
});

export { router as apiRouter };
