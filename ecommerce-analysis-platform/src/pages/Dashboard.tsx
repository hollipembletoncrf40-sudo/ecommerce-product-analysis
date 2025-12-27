import { useEffect, useState } from 'react';

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
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">仪表盘</h1>
        <p className="text-gray-500 mt-1">欢迎回来，查看最新的选品分析动态</p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">已分析产品</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalProducts}</p>
        </div>
        {/* Placeholders for other stats */}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">最近分析</h3>
        </div>
        <div className="p-6">
             {stats.recentAnalyses.length === 0 ? (
                <p className="text-gray-500 text-sm">暂无数据</p>
             ) : (
                 <ul className="space-y-4">
                     {stats.recentAnalyses.map((item: Product) => (
                         <li key={item.id} className="flex justify-between items-center pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                             <div>
                                 <p className="font-medium text-gray-900">{item.productName}</p>
                                 <p className="text-sm text-gray-500">{new Date(item.createdAt).toLocaleDateString()}</p>
                             </div>
                             <span className="px-3 py-1 bg-green-50 text-green-700 text-xs rounded-full">已完成</span>
                         </li>
                     ))}
                 </ul>
             )}
        </div>
      </div>
    </div>
  );
}
