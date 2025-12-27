import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

const STORAGE_KEY = 'currentAnalysisResult';
const FORM_STORAGE_KEY = 'currentAnalysisForm';

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
  runAnalysis: (e?: React.FormEvent) => Promise<void>;
  clearAnalysis: () => void;
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

  // Persist result
  useEffect(() => {
    if (result) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(result));
    }
  }, [result]);

  const clearAnalysis = () => {
    setResult(null);
    setFormData({ productName: '', category: '', description: '', useCases: '', painPoints: '' });
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(FORM_STORAGE_KEY);
  };

  const runAnalysis = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    setLoading(true);
    setError('');
    // Do not clear result immediately if you want to show previous result while loading, 
    // but usually we want to show loading state. 
    // However, for "background analysis", we might want to keep the old result? 
    // No, usually we want to clear old result to show new one is coming or at least show loading overlay.
    // The user said "won't pause analysis", implying they want to navigate away while it loads.
    
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
      runAnalysis,
      clearAnalysis
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
