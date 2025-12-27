import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Loader2, Send, Sparkles, FileText, TrendingUp, Users, Target, DollarSign, Megaphone, AlertTriangle, Package } from 'lucide-react';

export function Analysis() {
  const [formData, setFormData] = useState({
    productName: '',
    category: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white py-8 px-6 mb-8 rounded-b-3xl shadow-xl">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="w-8 h-8" />
            <h1 className="text-3xl font-bold">AI 智能选品分析</h1>
          </div>
          <p className="text-indigo-100 text-lg">基于AI大模型的全维度市场分析，助力您的选品决策</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Input Form - Sticky Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 bg-white/80 backdrop-blur-lg p-6 rounded-2xl border border-white/50 shadow-xl">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-lg font-semibold text-gray-800">产品信息</h2>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">产品名称 *</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 outline-none transition-all text-gray-800"
                    placeholder="如：便携式咖啡机"
                    value={formData.productName}
                    onChange={e => setFormData({...formData, productName: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">品类标签 *</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 outline-none transition-all text-gray-800"
                    placeholder="如：户外、家电"
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">补充描述</label>
                  <textarea
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 outline-none transition-all h-28 resize-none text-gray-800"
                    placeholder="产品特点、目标市场等..."
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center py-3.5 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg shadow-indigo-200 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      AI 分析中...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      生成分析报告
                    </>
                  )}
                </button>
              </form>

              {/* Analysis Dimensions */}
              <div className="mt-6 pt-6 border-t border-gray-100">
                <p className="text-xs text-gray-400 mb-3">分析维度</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { icon: TrendingUp, label: '市场机会' },
                    { icon: Users, label: '用户画像' },
                    { icon: Target, label: '竞争格局' },
                    { icon: DollarSign, label: '定价策略' },
                    { icon: Megaphone, label: '营销推广' },
                    { icon: AlertTriangle, label: '风险评估' },
                    { icon: Package, label: '产品规划' },
                    { icon: Sparkles, label: '差异化' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-gray-500">
                      <item.icon className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Result Display - Main Content */}
          <div className="lg:col-span-3">
            {error && (
              <div className="bg-red-50 text-red-700 p-5 rounded-2xl border border-red-100 mb-6 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold">分析失败</p>
                  <p className="text-sm mt-1 text-red-600">{error}</p>
                </div>
              </div>
            )}

            {result?.fullReport ? (
              <div className="bg-white/90 backdrop-blur-lg rounded-2xl border border-white/50 shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Report Header */}
                <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-6 text-white">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">选品分析报告</h2>
                      <p className="text-indigo-100 text-sm">{formData.productName} · {formData.category}</p>
                    </div>
                  </div>
                </div>
                
                {/* Report Content */}
                <div className="p-8">
                  <article className="prose prose-slate prose-lg max-w-none
                    prose-headings:font-bold prose-headings:text-gray-800
                    prose-h1:text-2xl prose-h1:border-b prose-h1:border-gray-200 prose-h1:pb-4 prose-h1:mb-6
                    prose-h2:text-xl prose-h2:text-indigo-700 prose-h2:mt-8 prose-h2:mb-4 prose-h2:flex prose-h2:items-center prose-h2:gap-2
                    prose-h3:text-lg prose-h3:text-gray-700 prose-h3:mt-6
                    prose-p:text-gray-600 prose-p:leading-relaxed
                    prose-li:text-gray-600
                    prose-strong:text-gray-800
                    prose-ul:space-y-1
                    prose-table:overflow-hidden prose-table:rounded-lg prose-table:border prose-table:border-gray-200
                    prose-th:bg-indigo-50 prose-th:text-indigo-800 prose-th:font-semibold prose-th:p-3
                    prose-td:p-3 prose-td:border-t prose-td:border-gray-100
                    prose-blockquote:bg-indigo-50 prose-blockquote:border-indigo-300 prose-blockquote:rounded-r-lg prose-blockquote:py-2
                    prose-code:bg-gray-100 prose-code:text-indigo-600 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:before:content-none prose-code:after:content-none
                  ">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {result.fullReport}
                    </ReactMarkdown>
                  </article>
                </div>
              </div>
            ) : (
              !loading && (
                <div className="bg-white/60 backdrop-blur border-2 border-dashed border-gray-200 rounded-2xl min-h-[600px] flex flex-col items-center justify-center text-gray-400 p-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center mb-6">
                    <Sparkles className="w-10 h-10 text-indigo-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">开始您的选品分析</h3>
                  <p className="text-center max-w-sm text-gray-400">
                    填写左侧产品信息，AI将为您生成包含市场分析、竞争格局、定价策略等10个维度的专业报告
                  </p>
                </div>
              )
            )}
            
            {loading && !result && (
              <div className="bg-white/90 backdrop-blur-lg border border-white/50 rounded-2xl min-h-[600px] flex flex-col items-center justify-center p-12 shadow-xl">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center animate-pulse">
                    <Sparkles className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
                    <Loader2 className="w-4 h-4 text-white animate-spin" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mt-6">AI 正在深度分析...</h3>
                <p className="text-gray-500 mt-2 text-center max-w-md">
                  正在分析市场趋势、竞争格局、用户画像等10个维度，预计需要 30-60 秒
                </p>
                <div className="mt-8 w-full max-w-xs">
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full animate-pulse" style={{width: '60%'}}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
