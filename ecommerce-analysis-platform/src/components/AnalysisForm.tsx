
import React from 'react';
import { Zap, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { useAnalysis } from '../context/AnalysisContext';

interface AnalysisFormProps {
  layout: 'centered' | 'sidebar';
}

export function AnalysisForm({ layout }: AnalysisFormProps) {
  const { formData, setFormData, loading, runAnalysis } = useAnalysis();
  const [showAdvanced, setShowAdvanced] = React.useState(layout === 'centered');

  const handleSubmit = (e: React.FormEvent) => {
    runAnalysis(e);
  };

  const isCentered = layout === 'centered';

  return (
    <form onSubmit={handleSubmit} className={isCentered ? "grid grid-cols-1 md:grid-cols-2 gap-6" : "space-y-4"}>
      {/* Product Name */}
      <div className="space-y-1">
        <label className="text-xs font-medium text-gray-500 dark:text-gray-400">产品名称</label>
        <input
          type="text"
          required
          value={formData.productName}
          onChange={e => setFormData({ ...formData, productName: e.target.value })}
          placeholder="如：便携式咖啡机"
          className="w-full px-4 py-3 text-sm bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl focus:border-indigo-400 dark:focus:border-[var(--neon-blue)] focus:ring-2 focus:ring-indigo-100 dark:focus:ring-blue-500/10 outline-none transition-all dark:text-white dark:placeholder-gray-600"
        />
      </div>

      {/* Category */}
      <div className="space-y-1">
        <label className="text-xs font-medium text-gray-500 dark:text-gray-400">所属类目</label>
        <input
          type="text"
          required
          value={formData.category}
          onChange={e => setFormData({ ...formData, category: e.target.value })}
          placeholder="如：户外装备"
          className="w-full px-4 py-3 text-sm bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl focus:border-indigo-400 dark:focus:border-[var(--neon-blue)] focus:ring-2 focus:ring-indigo-100 dark:focus:ring-blue-500/10 outline-none transition-all dark:text-white dark:placeholder-gray-600"
        />
      </div>

      {/* Advanced Fields Toggle for Sidebar */}
      {!isCentered && (
         <button 
           type="button" 
           onClick={() => setShowAdvanced(!showAdvanced)}
           className="w-full flex items-center justify-between text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-white py-1"
         >
           <span>Brainstorming (Optional)</span>
           {showAdvanced ? <ChevronUp className="w-3 h-3"/> : <ChevronDown className="w-3 h-3"/>}
         </button>
      )}

      {/* Optional Fields Container */}
      {(isCentered || showAdvanced) && (
        <>
            {/* Pain Points */}
            <div className="space-y-1">
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400">核心痛点 (Optional)</label>
                <textarea
                value={formData.painPoints}
                onChange={e => setFormData({ ...formData, painPoints: e.target.value })}
                placeholder="深度挖掘潜在痛点..."
                className={`w-full px-4 py-3 text-sm bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl focus:border-indigo-400 dark:focus:border-[var(--neon-blue)] focus:ring-2 focus:ring-indigo-100 dark:focus:ring-blue-500/10 outline-none transition-all resize-none dark:text-white dark:placeholder-gray-600 ${isCentered ? 'h-24' : 'h-20'}`}
                />
            </div>

            {/* Use Cases */}
            <div className="space-y-1">
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400">使用场景 (Optional)</label>
                <textarea
                value={formData.useCases}
                onChange={e => setFormData({ ...formData, useCases: e.target.value })}
                placeholder="产品具体使用场景..."
                className={`w-full px-4 py-3 text-sm bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl focus:border-indigo-400 dark:focus:border-[var(--neon-blue)] focus:ring-2 focus:ring-indigo-100 dark:focus:ring-blue-500/10 outline-none transition-all resize-none dark:text-white dark:placeholder-gray-600 ${isCentered ? 'h-24' : 'h-20'}`}
                />
            </div>
        </>
      )}

      {/* Description - Full Width in Grid */}
      <div className={`space-y-1 ${isCentered ? 'md:col-span-2' : ''}`}>
        <label className="text-xs font-medium text-gray-500 dark:text-gray-400">补充描述</label>
        <textarea
          value={formData.description}
          onChange={e => setFormData({ ...formData, description: e.target.value })}
          placeholder="其他补充信息..."
          className={`w-full px-4 py-3 text-sm bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl focus:border-indigo-400 dark:focus:border-[var(--neon-blue)] focus:ring-2 focus:ring-indigo-100 dark:focus:ring-blue-500/10 outline-none transition-all resize-none dark:text-white dark:placeholder-gray-600 ${isCentered ? 'h-24' : 'h-20'}`}
        />
      </div>

      {/* Submit Button */}
      <div className={isCentered ? 'md:col-span-2 mt-4' : 'mt-2'}>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 dark:bg-[var(--neon-blue)] dark:hover:bg-blue-400 dark:text-black font-bold rounded-xl shadow-lg shadow-indigo-200 dark:shadow-blue-500/20 transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed text-base"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <span>开始深度分析</span>
              <Zap className="w-5 h-5 group-hover:fill-current" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
