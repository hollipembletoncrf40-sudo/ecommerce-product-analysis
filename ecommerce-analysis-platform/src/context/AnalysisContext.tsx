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
  clientId: string;
  quota: { allowed: boolean; remaining: number } | null;
  runAnalysis: (e?: React.FormEvent) => Promise<void>;
  clearAnalysis: () => void;
  clearForm: () => void;
  loadHistory: (item: HistoryItem) => void;
  refreshQuota: () => Promise<void>;
  redeem: (key: string) => Promise<{ success: boolean; addedQuota: number }>;
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

  // Client ID Management
  const [clientId] = useState(() => {
    let id = localStorage.getItem('product_analysis_client_id');
    if (!id) {
      id = 'client_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
      localStorage.setItem('product_analysis_client_id', id);
    }
    return id;
  });

  const [quota, setQuota] = useState<{ allowed: boolean; remaining: number } | null>(null);

  // Load Quota
  const refreshQuota = async () => {
    try {
      const res = await fetch('/api/quota', {
        headers: { 'x-client-id': clientId }
      });
      if (res.ok) {
        const data = await res.json();
        setQuota(data);
      }
    } catch (err) {
      console.error('Failed to load quota', err);
    }
  };

  useEffect(() => {
    refreshQuota();
  }, [clientId]);

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
            const newItem: HistoryItem = {
                id: Date.now().toString(),
                timestamp: Date.now(),
                data: { ...formData }
            };
            const filtered = prev.filter(p => !((p.data.productName === formData.productName) && (p.data.category === formData.category)));
            return [newItem, ...filtered].slice(0, 20); // Keep last 20
        });
    }

    setLoading(true);
    setError('');
    setResult(null);
    
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'x-client-id': clientId
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.quotaExceeded) {
             throw new Error('QUOTA_EXCEEDED');
        }
        throw new Error(data.error || 'Analysis failed');
      }

      setResult(data);
      refreshQuota(); // Update quota after successful analysis
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const redeem = async (key: string) => {
      const res = await fetch('/api/quota/redeem', {
          method: 'POST',
          headers: { 
              'Content-Type': 'application/json',
              'x-client-id': clientId 
          },
          body: JSON.stringify({ key })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      await refreshQuota();
      return data;
  };

  return (
    <AnalysisContext.Provider value={{
      formData,
      setFormData,
      loading,
      result,
      error,
      history,
      quota,
      clientId,
      runAnalysis,
      clearAnalysis,
      clearForm,
      loadHistory,
      refreshQuota,
      redeem
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
