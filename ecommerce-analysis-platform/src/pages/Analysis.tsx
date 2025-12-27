import React, { useMemo, useState, useEffect } from 'react';
import { useAnalysis } from '../context/AnalysisContext';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Target, Crown, TrendingUp, Megaphone, AlertTriangle, ArrowRight, BrainCircuit, Sparkles, RefreshCw, Zap } from 'lucide-react';
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

// Loading Screen Component with Siri-style Orb
function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [msgIndex, setMsgIndex] = useState(0);

  const messages = [
    "正在接入全球市场数据库...",
    "AI 正在解构竞品策略...",
    "正在进行 15 维度交叉分析...",
    "正在生成用户画像与核心痛点...",
    "正在撰写万字级商业报告..."
  ];

  useEffect(() => {
    // Simulate progress
    const timer = setInterval(() => {
      setProgress(old => {
        if (old >= 95) return 95;
        const diff = Math.random() * 5;
        return Math.min(old + diff, 95);
      });
    }, 500);

    // Cycle messages
    const msgTimer = setInterval(() => {
      setMsgIndex(old => (old + 1) % messages.length);
    }, 2500);

    return () => {
      clearInterval(timer);
      clearInterval(msgTimer);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/40 via-black to-black animate-pulse-slow"></div>
      
      {/* Radiant Orb Animation */}
      <div className="relative w-56 h-56 mb-20 flex items-center justify-center">
         {/* Ambient Glows */}
         <div className="absolute -inset-10 bg-cyan-500/30 rounded-full blur-[60px] animate-pulse"></div>
         <div className="absolute -inset-10 bg-purple-600/30 rounded-full blur-[60px] animate-pulse animation-delay-2000"></div>

         {/* Spinning Gradient Rings */}
         <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-400 via-transparent to-purple-500 blur-xl animate-spin-slow opacity-80"></div>
         <div className="absolute inset-2 rounded-full bg-gradient-to-bl from-pink-500 via-transparent to-blue-500 blur-lg animate-spin-reverse-slow opacity-80"></div>
         
         {/* Sharp Ring Border */}
         <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-cyan-400/80 border-l-purple-500/80 blur-[1px] animate-spin-slow"></div>

         {/* Core Sphere - Siri-like Fluid Light */}
         <div className="relative w-40 h-40 rounded-full border border-white/20 shadow-[0_0_80px_rgba(34,211,238,0.4),_inset_0_0_20px_rgba(255,255,255,0.2)] flex items-center justify-center z-10 overflow-hidden bg-black/50 backdrop-blur-xl">
             
             {/* Liquid Blobs */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] animate-spin-slower opacity-60">
                <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-cyan-500 blur-[40px] mix-blend-screen animate-blob"></div>
                <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-purple-600 blur-[40px] mix-blend-screen animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-blue-500 blur-[40px] mix-blend-screen animate-blob animation-delay-4000"></div>
             </div>

             {/* Central White Hotspot */}
             <div className="absolute inset-0 flex items-center justify-center">
                 <div className="w-20 h-20 bg-white/40 blur-[30px] rounded-full animate-pulse-glow mix-blend-overlay"></div>
             </div>

             {/* Internal Reflection / Gloss */}
             <div className="absolute inset-0 bg-gradient-to-tr from-white/30 via-transparent to-transparent opacity-40 rounded-full z-20 pointer-events-none"></div>
         </div>
      </div>

      {/* Text Content */}
      <div className="relative z-10 text-center space-y-6 max-w-lg w-full px-6">
        <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-gray-200 tracking-wide leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-500 drop-shadow-lg">
           {messages[msgIndex]}
        </h3>
        
        {/* Radiant Progress Bar */}
        <div className="w-full h-1 bg-gray-900/50 rounded-full overflow-hidden backdrop-blur-sm border border-white/5 relative">
            <div className="absolute inset-0 bg-white/5 animate-pulse"></div>
            <div 
                className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 shadow-[0_0_20px_rgba(34,211,238,0.8)] transition-all duration-300 ease-out relative"
                style={{ width: `${progress}%` }}
            ></div>
        </div>

        <div className="flex items-center justify-between text-xs font-medium text-gray-500 uppercase tracking-widest">
            <span>AI Processing</span>
            <span>{Math.round(progress)}%</span>
        </div>

        <p className="text-gray-400 text-sm animate-pulse pt-4">
            深度分析运算量较大，请耐心等待 1-2 分钟...
        </p>
      </div>
    </div>
  );
}

export function Analysis() {
  const { formData, loading, result, error, clearAnalysis, runAnalysis } = useAnalysis();
  
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
                <div className="flex items-center gap-3">
                    {/* Professional Logo - No Background Box */}
                    <BrainCircuit className="w-8 h-8 text-indigo-500" strokeWidth={1.5} />
                    
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-black text-white tracking-tight leading-none">
                                AI 智能选品分析
                            </h1>
                            <span className="px-1.5 py-0.5 rounded-md border border-indigo-500/30 text-[10px] font-bold text-indigo-400 bg-indigo-500/10 tracking-widest">
                                专业版
                            </span>
                        </div>
                        <p className="text-[10px] font-medium text-gray-500 uppercase tracking-widest mt-0.5">
                            MIMO AI · 商业洞察模型 V2.0
                        </p>
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
                            type="button"
                            onClick={() => runAnalysis()}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] rounded-lg transition-all transform hover:scale-105"
                         >
                            <Zap className="w-4 h-4 fill-white" />
                            再次深度分析
                         </button>
                         <button
                            type="button"
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
        // CENTERED LAYOUT (Initial State - Minimalist Hero)
        <div className="w-full min-h-screen flex flex-col items-center justify-center relative overflow-hidden py-20">
             
             {/* Dynamic Spotlight Background */}
             <div className="absolute inset-0 overflow-hidden pointer-events-none">
                 <div className="absolute top-[-20%] left-[10%] w-[600px] h-[600px] bg-indigo-800/20 rounded-full blur-[180px] opacity-40 animate-pulse-slow"></div>
                 <div className="absolute bottom-[-10%] right-[10%] w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[160px] opacity-40"></div>
             </div>

             <div className="relative z-10 w-full max-w-6xl text-center flex flex-col items-center animate-in fade-in zoom-in-95 duration-1000">
                 
                 {/* Top Pill */}
                 <div className="mb-10 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-colors">
                     <span className="relative flex h-2 w-2">
                       <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                       <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                     </span>
                     <span className="text-xs font-medium text-indigo-200 tracking-wide">V2.0 商业洞察模型已就绪</span>
                 </div>

                {/* Massive Hero Title - PRO & HARMONIZED */}
                 <h1 className="flex flex-col items-center justify-center font-black text-white tracking-[-0.02em] leading-none select-none drop-shadow-2xl">
                     <span className="text-5xl md:text-6xl lg:text-[4.5rem] text-white mb-2 tracking-tighter shadow-black drop-shadow-lg">
                         洞察市场
                     </span>
                     <span className="text-6xl md:text-7xl lg:text-[6rem] bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent pb-4 filter drop-shadow-[0_0_50px_rgba(168,85,247,0.3)]">
                         预见爆款未来
                     </span>
                 </h1>

                 {/* Description */}
                 <p className="mt-10 mb-16 text-lg text-gray-400 max-w-3xl mx-auto leading-loose tracking-[0.08em] font-light">
                     <span className="block">输入产品信息，AI 将为您生成包含核心定位、市场机会、用户画像等 15 个维度的</span>
                     <span className="block text-gray-300 font-normal mt-1">万字级专业商业分析报告。</span>
                 </p>

                 {/* EMBEDDED ANALYSIS FORM - GLASS & CLEAN */}
                 <div className="w-full max-w-4xl bg-white/[0.02] backdrop-blur-2xl border border-white/[0.05] rounded-[2rem] p-10 shadow-[0_0_80px_rgba(0,0,0,0.4)] transform transition-all duration-500 hover:shadow-[0_0_100px_rgba(34,211,238,0.1)]">
                     <AnalysisForm layout="centered" />
                 </div>

                 {/* Footer Stats - Moved down */}
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-16 md:gap-24 pt-20 opacity-40 hover:opacity-100 transition-opacity duration-500">
                      {[
                          { label: '全景扫描', val: '15维', icon: Target },
                          { label: '深度报告', val: '10000字', icon: Crown },
                          { label: '竞品分析', val: '精准', icon: TrendingUp },
                          { label: '文案生成', val: '爆款', icon: Megaphone },
                      ].map((item, i) => (
                          <div key={i} className="flex flex-col items-center gap-2 group cursor-default">
                              <item.icon className="w-5 h-5 text-gray-500 group-hover:text-cyan-400 transition-colors mb-1" strokeWidth={1.5} />
                              <div className="text-sm font-bold text-gray-300 group-hover:text-white transition-colors">{item.val}</div>
                              <div className="text-[10px] text-gray-600 uppercase tracking-[0.2em]">{item.label}</div>
                          </div>
                      ))}
                 </div>
             </div>

        </div>
      ) : (
        // RESULT / LOADING LAYOUT (Full Page, No Sidebar)
        <div className="w-full max-w-[2400px] px-4 lg:px-8 mx-auto mt-6">
            
            {/* Full Width Content */}
            <div className="w-full min-h-[600px]">
                {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl border border-red-100 dark:border-red-900/50 flex items-center gap-3 mb-6 max-w-2xl mx-auto">
                        <AlertTriangle className="w-5 h-5" />
                        <p>{error}</p>
                    </div>
                )}

                {loading && (
                    <LoadingScreen />
                )}

                {result && parsedSections.length > 0 && (
                    <div className="animate-in fade-in duration-700 max-w-4xl mx-auto pb-24">
                        
                        {/* Report Header / Cover */}
                        <div className="mb-16 text-center space-y-6 pt-10 border-b border-gray-100 dark:border-white/10 pb-12">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-widest mb-4">
                                <Sparkles className="w-3 h-3" />
                                Professional Analysis Report
                            </div>
                            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
                                {result.productName}
                                <span className="block text-2xl lg:text-3xl font-medium text-gray-500 dark:text-gray-400 mt-3">
                                    深度商业选品分析报告
                                </span>
                            </h1>
                            <div className="flex items-center justify-center gap-6 text-sm text-gray-400">
                                <span className="flex items-center gap-1.5">
                                    <Target className="w-4 h-4" />
                                    {formData.category} 类目
                                </span>
                                <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-white/20"></span>
                                <span className="flex items-center gap-1.5">
                                    <Crown className="w-4 h-4" />
                                    AI 智能生成
                                </span>
                                <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-white/20"></span>
                                <span>{new Date().toLocaleDateString()}</span>
                            </div>
                        </div>

                        {/* Document Content - Sequential Layout */}
                        <div className="space-y-16">
                            {parsedSections.map((section, idx) => (
                                <div key={idx} className="group section-block">
                                    {/* Section Header */}
                                    <div className="flex items-baseline gap-4 mb-8 border-l-4 border-indigo-600 dark:border-[var(--neon-blue)] pl-6">
                                        <span className="text-6xl font-black text-gray-100 dark:text-white/5 font-mono select-none -ml-4 absolute -translate-x-full">
                                            {String(idx + 1).padStart(2, '0')}
                                        </span>
                                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                                            {section.title}
                                        </h2>
                                    </div>
                                    
                                    {/* Content Body */}
                                    <article className="prose prose-lg prose-slate dark:prose-invert max-w-none 
                                        prose-headings:scroll-mt-20
                                        prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white
                                        prose-p:text-gray-600 dark:prose-p:text-gray-300 prose-p:leading-8 prose-p:my-6 prose-p:text-[17px]
                                        prose-li:text-gray-600 dark:prose-li:text-gray-300 prose-li:my-3 prose-li:leading-relaxed
                                        prose-strong:text-indigo-700 dark:prose-strong:text-indigo-300 dark:prose-strong:font-bold 
                                        prose-blockquote:border-l-4 prose-blockquote:border-indigo-500 dark:prose-blockquote:border-[var(--neon-blue)] prose-blockquote:bg-gray-50 dark:prose-blockquote:bg-white/5 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-xl prose-blockquote:not-italic prose-blockquote:text-gray-700 dark:prose-blockquote:text-gray-200
                                        prose-ul:list-none prose-ul:pl-0
                                    ">
                                        <ReactMarkdown 
                                            remarkPlugins={[remarkGfm]}
                                            components={{
                                                ul: ({node, ...props}) => <ul className="space-y-4 my-6" {...props} />,
                                                li: ({node, ...props}) => (
                                                    <li className="flex items-start gap-3 pl-2 group-hover/li:text-gray-900 dark:group-hover/li:text-white transition-colors" {...props}>
                                                        <span className="mt-2.5 w-1.5 h-1.5 rounded-full bg-indigo-500 dark:bg-[var(--neon-blue)] flex-shrink-0 shadow shadow-indigo-500/50"></span>
                                                        <div className="flex-1">{props.children}</div>
                                                    </li>
                                                ),
                                                h3: ({node, ...props}) => <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-12 mb-6 flex items-center gap-3 pb-2 border-b border-gray-100 dark:border-white/5" {...props} />,
                                                h4: ({node, ...props}) => <h4 className="text-lg font-bold text-gray-800 dark:text-gray-100 mt-8 mb-4 flex items-center gap-2" {...props} />,
                                                strong: ({node, ...props}) => <strong className="font-bold text-indigo-700 dark:text-indigo-300 border-b border-indigo-200 dark:border-indigo-800/50 pb-0.5" {...props} />,
                                                table: ({node, ...props}) => (
                                                    <div className="my-8 overflow-hidden rounded-xl border border-gray-100 dark:border-white/10 shadow-sm bg-white/50 dark:bg-white/5">
                                                        <table className="w-full text-sm text-left" {...props} />
                                                    </div>
                                                ),
                                                thead: ({node, ...props}) => <thead className="bg-gray-50 dark:bg-white/10 text-gray-900 dark:text-white font-bold" {...props} />,
                                                th: ({node, ...props}) => <th className="px-6 py-4" {...props} />,
                                                td: ({node, ...props}) => <td className="px-6 py-4 border-t border-gray-100 dark:border-white/5" {...props} />,
                                            }}
                                        >
                                            {/* Preprocess: Fix malformed markdown bold syntax */}
                                            {section.content
                                                .replace(/\*\*\s+/g, '**')  // "** text" -> "**text"
                                                .replace(/\s+\*\*/g, '**')  // "text **" -> "text**"
                                            }
                                        </ReactMarkdown>
                                    </article>
                                </div>
                            ))}
                            
                            {/* Ending */}
                            <div className="pt-20 text-center border-t border-gray-100 dark:border-white/10 mt-20">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 dark:bg-white/5 mb-6">
                                    <Sparkles className="w-6 h-6 text-gray-400" />
                                </div>
                                <p className="text-gray-400 text-sm">此报告由 AI 基于实时商业模型生成，仅供决策参考</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
      )}
    </div>
  );
}
