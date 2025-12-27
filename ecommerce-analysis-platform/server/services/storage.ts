import fs from 'fs';
import path from 'path';

const DATA_FILE = path.resolve(process.cwd(), 'data', 'analyses.json');

interface ProductAnalysis {
  id: string;
  productName: string;
  category: string;
  targetAudience: string;
  usageScenario: string;
  coreFeatures: string;
  fullReport: string;
  marketingHooks: string[];
  platformAdvice: any[];
  productSuggestions: any[];
  createdAt: string;
}

// Ensure data directory exists
function ensureDataDir() {
  const dataDir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
  }
}

export function getAllAnalyses(): ProductAnalysis[] {
  ensureDataDir();
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
}

export function saveAnalysis(analysis: Omit<ProductAnalysis, 'id' | 'createdAt'>): ProductAnalysis {
  ensureDataDir();
  const analyses = getAllAnalyses();
  
  const newAnalysis: ProductAnalysis = {
    ...analysis,
    id: Date.now().toString(36) + Math.random().toString(36).substr(2, 9),
    createdAt: new Date().toISOString()
  };
  
  // Add to beginning of array (most recent first)
  analyses.unshift(newAnalysis);
  
  // Keep only last 100 analyses
  const trimmed = analyses.slice(0, 100);
  
  fs.writeFileSync(DATA_FILE, JSON.stringify(trimmed, null, 2));
  
  return newAnalysis;
}

export function getAnalysisById(id: string): ProductAnalysis | undefined {
  const analyses = getAllAnalyses();
  return analyses.find(a => a.id === id);
}
