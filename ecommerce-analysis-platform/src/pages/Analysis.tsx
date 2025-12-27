import { useMemo } from 'react';
import { useAnalysis } from '../context/AnalysisContext';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Loader2, Sparkles, TrendingUp, Users, Target, DollarSign, Megaphone, AlertTriangle, RefreshCw, Palette, Lightbulb, ShoppingBag, Crown, LayoutDashboard } from 'lucide-react';
import { AnalysisForm } from '../components/AnalysisForm';





// Helper to split markdown into sections
function parseReport(markdown: string) {
  if (!markdown) return [];
  
  // Split by "### " headers. 
  // The first element might be empty or intro text.
  const sections = markdown.split(/(?=^### )/gm);
  
  return sections.filter(s => s.trim().length > 0).map((section, index) => {
    const lines = section.split('\n');
    let title = '分析详情';
    let content = section;

    // Extract title from the first line if it starts with ###
    if (lines[0].trim().startsWith('###')) {
        title = lines[0].replace(/^###\s*(\d+\.\s*)?/, '').replace(/\*\*/g, '').trim();
        content = lines.slice(1).join('\n');
    }

    return {
      id: index,
      title,
      content
    };
  });
}

export function Analysis() {
  const { formData, loading, result, error, clearAnalysis } = useAnalysis();
  
  // Use centered layout if no result and not loading
  const isCenteredLayout = !result && !loading;


  const parsedSections = useMemo(() => {
    if (!result?.fullReport) return [];
    return parseReport(result.fullReport);
  }, [result]);

  return (
    <div className="min-h-screen pb-12">
        {/* Simplified Premium Header - Only show in Result Mode or Keep it for navigation? 
            Let's keep it but maybe simpler in centered mode.
        */}
        <header className="sticky top-0 z-40 bg-white/80 dark:bg-[#050505]/80 backdrop-blur-xl border-b border-gray-100 dark:border-white/5 shadow-sm">
            <div className="w-full max-w-[1920px] px-6 lg:px-10 mx-auto h-20 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                        <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                             AI 智能选品分析
                             <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-[var(--neon-blue)] uppercase tracking-wider">PRO</span>
                        </h1>
                        <p className="text-xs text-gray-500 dark:text-gray-400">基于 MiMo AI 全维度商业洞察模型</p>
                    </div>
                </div>

                {result && (
                    <div className="flex items-center gap-6">
                         <div className="hidden lg:flex items-center gap-8">
                             <div className="text-right">
                                 <p className="text-xs text-gray-400">当前分析</p>
                                 <p className="text-sm font-semibold text-gray-900 dark:text-white max-w-[200px] truncate">{formData.productName}</p>
                             </div>
                             <div className="h-8 w-px bg-gray-200 dark:bg-white/10"></div>
                             <div className="text-right">
                                 <p className="text-xs text-gray-400">维度覆盖</p>
                                 <p className="text-sm font-semibold text-gray-900 dark:text-white">15 维全景扫描</p>
                             </div>
                         </div>
                         <button
                            onClick={clearAnalysis}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-white bg-gray-50 dark:bg-white/5 hover:bg-indigo-50 dark:hover:bg-white/10 rounded-lg transition-all"
                         >
                            <RefreshCw className="w-4 h-4" />
                            新分析
                         </button>
                    </div>
                )}
            </div>
        </header>

      {isCenteredLayout ? (
        // CENTERED LAYOUT (Initial State)
        <div className="w-full max-w-5xl mx-auto px-6 mt-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
             <div className="bg-white dark:bg-transparent dark:glass-panel rounded-3xl border border-gray-100 dark:border-[var(--border-color)] p-10 lg:p-14 shadow-2xl dark:shadow-[0_0_40px_rgba(0,0,0,0.3)] relative overflow-hidden">
                 {/* Decorative background elements */}
                 <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3"></div>
                 <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3"></div>

                 <div className="relative z-10">
                     <div className="text-center mb-12">
                         <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">开启您的深度商业洞察</h2>
                         <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
                            配置 5 大核心参数，AI 将为您生成包含核心定位、市场机会、用户画像等 15 个维度的专业级商业分析报告。
                         </p>
                     </div>

                     <AnalysisForm layout="centered" />
                     
                     {/* Dimensions Preview */}
                     <div className="mt-12 pt-8 border-t border-gray-100 dark:border-white/5">
                        <p className="text-center text-xs font-semibold text-gray-400 uppercase tracking-widest mb-6">Powered by 15-Dimension Logic</p>
                        <div className="flex flex-wrap justify-center gap-3 opacity-60">
                             {[
                                 ['核心定位', Target], ['市场机会', TrendingUp], ['用户画像', Users], 
                                 ['竞争格局', Crown], ['视觉设计', Palette], ['创新策略', Lightbulb], 
                                 ['定价方案', DollarSign], ['全域营销', Megaphone], ['渠道布局', ShoppingBag], 
                                 ['风险评估', AlertTriangle]
                             ].map(([label, Icon]: any, i) => (
                                 <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                                     <Icon className="w-3 h-3 text-indigo-500" />
                                     <span className="text-xs text-gray-500 dark:text-gray-400">{label}</span>
                                 </div>
                             ))}
                        </div>
                     </div>
                 </div>
             </div>
        </div>
      ) : (
        // SIDEBAR LAYOUT (Result/Loading State)
        <div className="w-full max-w-[2400px] px-4 lg:px-8 mx-auto mt-6">
            <div className="grid grid-cols-12 gap-6">
            {/* Left Sidebar - Input */}
            <div className="col-span-12 lg:col-span-3 2xl:col-span-2">
                <div className="lg:sticky lg:top-24 space-y-4">
                    <div className="bg-white dark:bg-transparent dark:glass-panel rounded-2xl border border-gray-100 dark:border-[var(--border-color)] p-5 shadow-sm dark:shadow-none animate-in slide-in-from-left-4 duration-500">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="p-1.5 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                                <LayoutDashboard className="w-4 h-4 text-indigo-600 dark:text-[var(--neon-blue)]" />
                            </div>
                            <h2 className="font-semibold text-gray-900 dark:text-white text-sm">分析配置</h2>
                        </div>
                        <AnalysisForm layout="sidebar" />
                    </div>

                    {/* Dimensions List - Compact (Optional in this view, maybe just hide or keep simple) */}
                </div>
            </div>

            {/* Right Content - Results */}
            <div className="col-span-12 lg:col-span-9 2xl:col-span-10 min-h-[600px]">
                {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl border border-red-100 dark:border-red-900/50 flex items-center gap-3 mb-6">
                        <AlertTriangle className="w-5 h-5" />
                        <p>{error}</p>
                    </div>
                )}

                {loading && (
                    <div className="flex flex-col items-center justify-center h-[600px] bg-white dark:bg-transparent dark:glass-panel rounded-3xl border border-gray-100 dark:border-white/10 relative overflow-hidden">
                        <div className="absolute inset-0 bg-grid-indigo-500/[0.02] bg-[size:20px_20px]"></div>
                        <div className="relative z-10 text-center">
                            <div className="w-20 h-20 bg-indigo-600 dark:bg-[var(--neon-blue)] rounded-2xl flex items-center justify-center mb-8 mx-auto shadow-xl shadow-indigo-500/30 animate-bounce">
                                <Sparkles className="w-10 h-10 text-white dark:text-black" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">正在进行深度运算...</h3>
                            <p className="text-gray-500 dark:text-gray-400">AI 正在分析市场数据与竞争策略</p>
                        </div>
                    </div>
                )}

                {result && parsedSections.length > 0 && (
                    <div className="animate-in fade-in duration-500">
                        {/* Report Title Card - Full Width */}
                        <div className="mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-blue-900/40 dark:to-purple-900/40 rounded-3xl p-8 lg:p-10 text-white relative overflow-hidden shadow-2xl dark:shadow-none border border-transparent dark:border-[var(--border-color)]">
                            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                            <div className="relative z-10">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-sm font-medium mb-6 border border-white/20">
                                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                    分析完成
                                </div>
                                <h1 className="text-3xl lg:text-4xl font-bold mb-4">{result.productName} 深度选品报告</h1>
                                <p className="text-indigo-100 dark:text-blue-200 text-lg opacity-90 max-w-2xl">
                                    基于 {formData.category} 类目的全维度市场洞察，为您梳理从产品定位到市场落地的完整策略。
                                </p>
                            </div>
                        </div>

                        {/* Modular Cards - Masonry Layout via CSS Columns */}
                        <div className="columns-1 xl:columns-2 3xl:columns-3 gap-6 space-y-6">
                            {parsedSections.map((section, idx) => (
                                <div 
                                    key={idx} 
                                    className="break-inside-avoid bg-white dark:bg-transparent dark:glass-panel rounded-2xl border border-gray-100 dark:border-[var(--border-color)] overflow-hidden hover:shadow-lg dark:hover:shadow-[0_0_20px_rgba(0,0,0,0.3)] transition-all duration-300 flex flex-col mb-6"
                                >
                                    <div className="px-6 py-4 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/5 flex items-center justify-between">
                                        <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-3">
                                            <span className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-blue-500/20 flex items-center justify-center text-indigo-600 dark:text-[var(--neon-blue)] font-mono text-sm font-bold">
                                                {idx + 1}
                                            </span>
                                            {section.title}
                                        </h3>
                                        <div className="flex gap-1">
                                            <div className="w-1 h-1 rounded-full bg-gray-300 dark:bg-white/20"></div>
                                            <div className="w-1 h-1 rounded-full bg-gray-300 dark:bg-white/20"></div>
                                            <div className="w-1 h-1 rounded-full bg-gray-300 dark:bg-white/20"></div>
                                        </div>
                                    </div>
                                    
                                    <div className="p-6">
                                        <article className="prose prose-sm prose-slate dark:prose-invert max-w-none 
                                            prose-p:leading-relaxed prose-p:text-gray-600 dark:prose-p:text-gray-300
                                            prose-li:text-gray-600 dark:prose-li:text-gray-300
                                            prose-strong:text-gray-900 dark:prose-strong:text-white dark:prose-strong:font-bold
                                            prose-headings:text-gray-900 dark:prose-headings:text-white
                                            prose-blockquote:border-l-4 prose-blockquote:border-indigo-500 dark:prose-blockquote:border-[var(--neon-blue)] prose-blockquote:bg-gray-50 dark:prose-blockquote:bg-white/5 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-lg prose-blockquote:not-italic
                                        ">
                                            <ReactMarkdown 
                                                remarkPlugins={[remarkGfm]}
                                                components={{
                                                    ul: ({node, ...props}) => <ul className="space-y-2 my-2" {...props} />,
                                                    li: ({node, ...props}) => (
                                                        <li className="flex items-start gap-2 pl-0 my-1" {...props}>
                                                            <span className="mt-1.5 w-1 h-1 rounded-full bg-indigo-500 dark:bg-[var(--neon-blue)] flex-shrink-0"></span>
                                                            <div className="flex-1">{props.children}</div>
                                                        </li>
                                                    ),
                                                    strong: ({node, ...props}) => <strong className="text-indigo-900 dark:text-blue-100 font-bold" {...props} />
                                                }}
                                            >
                                                {section.content}
                                            </ReactMarkdown>
                                        </article>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            </div>
        </div>
      )}
    </div>
  );
}
