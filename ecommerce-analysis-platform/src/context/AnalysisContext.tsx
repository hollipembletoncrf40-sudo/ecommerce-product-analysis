import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

const STORAGE_KEY = 'currentAnalysisResult';
const FORM_STORAGE_KEY = 'currentAnalysisForm';
const HISTORY_STORAGE_KEY = 'analysis_history';

interface HistoryItem {
  id: string;
  timestamp: number;
  data: {
    productName: string;
    category: string;
    description: string;
    useCases: string;
    painPoints: string;
  };
}

interface AnalysisContextType {
  formData: {
    productName: string;
    category: string;
    description: string;
    useCases: string;
    painPoints: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<{
    productName: string;
    category: string;
    description: string;
    useCases: string;
    painPoints: string;
  }>>;
  loading: boolean;
  result: any;
  error: string;
  history: HistoryItem[];
  runAnalysis: (e?: React.FormEvent) => Promise<void>;
  clearAnalysis: () => void;
  clearForm: () => void;
  loadHistory: (item: HistoryItem) => void;
}

const AnalysisContext = createContext<AnalysisContextType | undefined>(undefined);

export function AnalysisProvider({ children }: { children: ReactNode }) {
  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem(FORM_STORAGE_KEY);
    return saved ? JSON.parse(saved) : {
      productName: '',
      category: '',
      description: '',
      useCases: '',
      painPoints: ''
    };
  });
  
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    const saved = localStorage.getItem(HISTORY_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  });
  const [error, setError] = useState('');

  // Persist form data
  useEffect(() => {
    localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(formData));
  }, [formData]);

  // Persist history
  useEffect(() => {
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
  }, [history]);

  // Persist result
  useEffect(() => {
    if (result) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(result));
    }
  }, [result]);

  const clearAnalysis = () => {
    setResult(null);
    localStorage.removeItem(STORAGE_KEY);
    // Do NOT clear formData or FORM_STORAGE_KEY
  };

  const clearForm = () => {
    setFormData({ productName: '', category: '', description: '', useCases: '', painPoints: '' });
    localStorage.removeItem(FORM_STORAGE_KEY);
  };

  const loadHistory = (item: HistoryItem) => {
    setFormData(item.data);
  };

  const runAnalysis = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    // Add to history if valid
    if (formData.productName || formData.category) {
        setHistory(prev => {
            const displayTitle = formData.productName || formData.category || '未知选品';
            const newItem: HistoryItem = {
                id: Date.now().toString(),
                timestamp: Date.now(),
                data: { ...formData }
            };
            // Remove duplicates (same product name AND category)
            const filtered = prev.filter(p => !((p.data.productName === formData.productName) && (p.data.category === formData.category)));
            return [newItem, ...filtered].slice(0, 20); // Keep last 20
        });
    }

    setLoading(true);
    setError('');
    
    setResult(null);
    localStorage.removeItem(STORAGE_KEY);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Analysis failed');
      }

      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnalysisContext.Provider value={{
      formData,
      setFormData,
      loading,
      result,
      error,
      history,
      runAnalysis,
      clearAnalysis,
      clearForm,
      loadHistory
    }}>
      {children}
    </AnalysisContext.Provider>
  );
}

export function useAnalysis() {
  const context = useContext(AnalysisContext);
  if (context === undefined) {
    throw new Error('useAnalysis must be used within an AnalysisProvider');
  }
  return context;
}
