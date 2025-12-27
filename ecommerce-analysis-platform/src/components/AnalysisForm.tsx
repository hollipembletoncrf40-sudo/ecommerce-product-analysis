import React, { useState, useRef, useEffect } from 'react';
import { Zap, Loader2, ChevronDown, ChevronUp, Clock, Trash2, History, X } from 'lucide-react';
import { useAnalysis } from '../context/AnalysisContext';

interface AnalysisFormProps {
  layout: 'centered' | 'sidebar';
}

export function AnalysisForm({ layout }: AnalysisFormProps) {
  const { formData, setFormData, loading, runAnalysis, history, loadHistory, clearForm } = useAnalysis();
  const [showAdvanced, setShowAdvanced] = useState(layout === 'centered');
  const [showHistory, setShowHistory] = useState(false);
  const historyRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    runAnalysis(e);
  };

  // Close history when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (historyRef.current && !historyRef.current.contains(event.target as Node)) {
        setShowHistory(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isCentered = layout === 'centered';

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('zh-CN', {
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="relative">
    <form onSubmit={handleSubmit} className={isCentered ? "grid grid-cols-1 md:grid-cols-2 gap-8" : "space-y-5"}>
      
      {/* Form Utilities Header */}
      <div className={`flex justify-end gap-3 ${isCentered ? "md:col-span-2" : ""}`}>
          <div className="relative" ref={historyRef}>
              <button
                type="button"
                onClick={() => setShowHistory(!showHistory)}
                className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-cyan-400 transition-colors px-2 py-1 rounded-md hover:bg-white/5"
              >
                  <History className="w-3.5 h-3.5" />
                  历史记录
              </button>
              
              {/* History Dropdown */}
              {showHistory && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-[#0a0a0a] border border-white/10 rounded-xl shadow-2xl backdrop-blur-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-white/[0.02]">
                          <span className="text-xs font-bold text-gray-400">最近分析</span>
                          <button onClick={() => setShowHistory(false)} className="text-gray-500 hover:text-white">
                              <X className="w-3.5 h-3.5" />
                          </button>
                      </div>
                      <div className="max-h-60 overflow-y-auto custom-scrollbar">
                          {history.length === 0 ? (
                              <div className="px-4 py-6 text-center text-xs text-gray-600">
                                  暂无历史记录
                              </div>
                          ) : (
                              history.map((item) => (
                                  <button
                                      key={item.id}
                                      type="button"
                                      onClick={() => {
                                          loadHistory(item);
                                          setShowHistory(false);
                                      }}
                                      className="w-full text-left px-4 py-3 hover:bg-white/5 border-b border-white/[0.02] last:border-0 group transition-colors"
                                  >
                                      <p className="text-sm text-gray-300 group-hover:text-cyan-400 font-medium truncate mb-0.5">
                                          {item.data.productName}
                                      </p>
                                      <div className="flex justify-between items-center text-[10px] text-gray-600">
                                          <span>{item.data.category}</span>
                                          <span>{formatTime(item.timestamp)}</span>
                                      </div>
                                  </button>
                              ))
                          )}
                      </div>
                  </div>
              )}
          </div>

          <button
            type="button"
            onClick={clearForm}
            className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-red-400 transition-colors px-2 py-1 rounded-md hover:bg-white/5"
          >
              <Trash2 className="w-3.5 h-3.5" />
              清空
          </button>
      </div>
      {/* Product Name */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-gray-400 pl-1 tracking-[0.15em]">产品名称</label>
        <input
          type="text"
          value={formData.productName}
          onChange={e => setFormData({ ...formData, productName: e.target.value })}
          placeholder="如：便携式咖啡机 (若未定选品可留空)"
          className="w-full px-5 py-4 text-sm bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 rounded-xl focus:bg-black/40 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 outline-none transition-all duration-300 text-white placeholder-gray-600 backdrop-blur-sm"
        />
      </div>

      {/* Category */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-gray-400 pl-1 tracking-[0.15em]">所属类目</label>
        <input
          type="text"
          required
          value={formData.category}
          onChange={e => setFormData({ ...formData, category: e.target.value })}
          placeholder="如：户外装备"
          className="w-full px-5 py-4 text-sm bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 rounded-xl focus:bg-black/40 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 outline-none transition-all duration-300 text-white placeholder-gray-600 backdrop-blur-sm"
        />
      </div>

      {/* Advanced Fields Toggle */}
      {!isCentered && (
         <button 
           type="button" 
           onClick={() => setShowAdvanced(!showAdvanced)}
           className="w-full flex items-center justify-between text-xs font-medium text-gray-500 hover:text-white py-2 group transition-colors"
         >
           <span>头脑风暴 (选填)</span>
           {showAdvanced ? <ChevronUp className="w-3 h-3 group-hover:text-cyan-400 transition-colors"/> : <ChevronDown className="w-3 h-3 group-hover:text-cyan-400 transition-colors"/>}
         </button>
      )}

      {/* Optional Fields Container */}
      {(isCentered || showAdvanced) && (
        <>
            {/* Description - Full Width in Grid */}
            <div className={`space-y-2 ${isCentered ? 'md:col-span-2' : ''}`}>
                <label className="text-xs font-bold text-gray-400 pl-1 tracking-[0.15em]">补充描述</label>
                <textarea
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                placeholder="补充更多产品细节、目标人群或特殊要求..."
                className={`w-full px-5 py-4 text-sm bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 rounded-xl focus:bg-black/40 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 outline-none transition-all duration-300 resize-none text-white placeholder-gray-600 backdrop-blur-sm custom-scrollbar ${isCentered ? 'h-36' : 'h-32'}`}
                />
            </div>
        </>
      )}

      {/* Submit Button */}
      <div className={isCentered ? 'md:col-span-2 mt-8' : 'mt-4'}>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-5 bg-[#22d3ee] hover:bg-[#06b6d4] text-black font-bold text-lg rounded-xl shadow-[0_0_40px_rgba(34,211,238,0.2)] hover:shadow-[0_0_60px_rgba(34,211,238,0.4)] hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <span className="relative z-10 tracking-[0.2em] font-black text-base">开始深度分析</span>
              <Zap className="w-5 h-5 fill-black group-hover:rotate-12 transition-transform relative z-10" />
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 skew-y-12"></div>
            </>
          )}
        </button>
      </div>
    </form>
    </div>
  );
}
