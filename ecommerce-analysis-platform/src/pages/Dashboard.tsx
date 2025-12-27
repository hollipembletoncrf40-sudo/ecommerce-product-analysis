import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, TrendingUp } from 'lucide-react';

interface Product {
  id: number;
  productName: string;
  createdAt: string;
}

export function Dashboard() {
  const [stats, setStats] = useState<{ totalProducts: number; recentAnalyses: Product[] }>({ totalProducts: 0, recentAnalyses: [] });

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        setStats({
          totalProducts: Array.isArray(data) ? data.length : 0,
          recentAnalyses: Array.isArray(data) ? data.slice(0, 5) : []
        });
      })
      .catch(console.error);
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">欢迎回来, Josephine</h1>
        <p className="text-gray-500 dark:text-gray-400">这里是您的选品分析中心</p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-transparent dark:glass-panel p-6 rounded-2xl border border-gray-100 dark:border-[var(--border-color)] shadow-sm dark:shadow-[0_0_15px_rgba(0,0,0,0.3)] group transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">已分析产品</h3>
            <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/40 transition-colors">
              <Package className="w-5 h-5 text-indigo-600 dark:text-[var(--neon-blue)]" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalProducts}</p>
        </div>
        
        <div className="bg-white dark:bg-transparent dark:glass-panel p-6 rounded-2xl border border-gray-100 dark:border-[var(--border-color)] shadow-sm dark:shadow-[0_0_15px_rgba(0,0,0,0.3)] group transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">近7天分析</h3>
            <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg group-hover:bg-purple-100 dark:group-hover:bg-purple-900/40 transition-colors">
              <TrendingUp className="w-5 h-5 text-purple-600 dark:text-[var(--neon-purple)]" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.recentAnalyses.length}</p>
        </div>

        <div className="bg-white dark:bg-transparent dark:glass-panel p-6 rounded-2xl border border-gray-100 dark:border-[var(--border-color)] shadow-sm dark:shadow-[0_0_15px_rgba(0,0,0,0.3)] group transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">系统状态</h3>
            <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg group-hover:bg-green-100 dark:group-hover:bg-green-900/40 transition-colors">
              <div className="w-5 h-5 flex items-center justify-center">
                <div className="w-2.5 h-2.5 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse"></div>
              </div>
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">运行中</p>
        </div>
      </div>

      <div className="bg-white dark:bg-transparent dark:glass-panel rounded-2xl border border-gray-100 dark:border-[var(--border-color)] shadow-sm dark:shadow-[0_0_20px_rgba(0,0,0,0.4)] overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 dark:border-[var(--border-color)] flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <span className="w-1 h-5 bg-indigo-500 dark:bg-[var(--neon-blue)] rounded-full"></span>
            最近分析动态
          </h3>
          <Link to="/products" className="text-sm text-indigo-600 dark:text-[var(--neon-blue)] hover:underline">查看全部</Link>
        </div>
        <div className="p-6">
             {stats.recentAnalyses.length === 0 ? (
                <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                  <Package className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p>暂无数据</p>
                </div>
             ) : (
                 <ul className="space-y-2">
                     {stats.recentAnalyses.map((item: Product) => (
                         <li key={item.id} className="flex justify-between items-center p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group cursor-pointer border border-transparent hover:border-gray-100 dark:hover:border-white/10">
                             <div className="flex items-center gap-4">
                               <div className="w-10 h-10 bg-gray-100 dark:bg-white/10 rounded-lg flex items-center justify-center text-gray-500 dark:text-gray-400 font-bold text-xs">
                                 AI
                               </div>
                               <div>
                                   <p className="font-medium text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-[var(--neon-blue)] transition-colors">{item.productName}</p>
                                   <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{new Date(item.createdAt).toLocaleDateString()}</p>
                               </div>
                             </div>
                             <span className="px-3 py-1 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-xs font-medium rounded-full border border-green-100 dark:border-green-800">已完成</span>
                         </li>
                     ))}
                 </ul>
             )}
        </div>
      </div>
    </div>
  );
}
