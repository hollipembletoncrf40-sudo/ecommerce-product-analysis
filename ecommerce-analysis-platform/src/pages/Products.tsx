import { useEffect, useState } from 'react';
import { Package, Calendar, Eye, Search, Loader2 } from 'lucide-react';

interface ProductAnalysis {
  id: string;
  productName: string;
  category: string;
  targetAudience: string;
  fullReport: string;
  createdAt: string;
}

export function Products() {
  const [products, setProducts] = useState<ProductAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<ProductAnalysis | null>(null);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const filteredProducts = products.filter(p =>
    p.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (selectedProduct) {
    return (
      <div className="min-h-screen">
        <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-500">
          <button
            onClick={() => setSelectedProduct(null)}
            className="mb-6 px-4 py-2 text-indigo-600 dark:text-[var(--neon-blue)] hover:text-indigo-800 dark:hover:text-white font-medium flex items-center gap-2 transition-colors rounded-lg hover:bg-white/50 dark:hover:bg-white/5"
          >
            ← 返回产品库
          </button>
          
          <div className="bg-white/95 dark:bg-transparent dark:glass-panel rounded-2xl shadow-2xl dark:shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden border border-gray-100 dark:border-[var(--border-color)]">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 dark:from-blue-900/50 dark:to-purple-900/50 p-8 text-white relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              <h1 className="text-3xl font-bold relative z-10">{selectedProduct.productName}</h1>
              <p className="text-indigo-100 dark:text-blue-200 mt-2 relative z-10 flex items-center gap-2">
                <span className="bg-white/20 px-2 py-0.5 rounded text-sm backdrop-blur-sm">{selectedProduct.category}</span>
                <span className="text-sm opacity-80">· {formatDate(selectedProduct.createdAt)}</span>
              </p>
            </div>
            
            <div className="p-10 prose prose-slate dark:prose-invert max-w-none 
              prose-headings:text-gray-800 dark:prose-headings:text-white
              prose-p:text-gray-600 dark:prose-p:text-gray-300
              prose-a:text-indigo-600 dark:prose-a:text-[var(--neon-blue)]
              prose-strong:text-gray-900 dark:prose-strong:text-white
              prose-blockquote:border-l-indigo-500 dark:prose-blockquote:border-[var(--neon-purple)] dark:prose-blockquote:text-gray-400
            ">
              <div dangerouslySetInnerHTML={{ __html: selectedProduct.fullReport?.replace(/\n/g, '<br/>') || '暂无报告内容' }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto animate-in fade-in duration-500">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <div className="p-2 bg-indigo-100 dark:bg-transparent rounded-xl dark:border dark:border-[var(--neon-blue)] dark:shadow-[0_0_10px_rgba(0,240,255,0.3)]">
                <Package className="w-8 h-8 text-indigo-600 dark:text-[var(--neon-blue)]" />
              </div>
              产品库
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 ml-1">查看所有已分析的产品报告</p>
          </div>
          
          {/* Search */}
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-500 dark:group-focus-within:text-[var(--neon-blue)] transition-colors" />
            <input
              type="text"
              placeholder="搜索产品..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white/80 dark:bg-white/5 dark:border-white/10 dark:text-white focus:ring-4 focus:ring-indigo-100 dark:focus:ring-blue-500/20 focus:border-indigo-400 dark:focus:border-[var(--neon-blue)] outline-none w-72 transition-all shadow-sm dark:shadow-inner"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-10 h-10 text-indigo-500 dark:text-[var(--neon-blue)] animate-spin" />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-white/80 dark:bg-transparent dark:glass-panel rounded-2xl border border-gray-100 dark:border-[var(--border-color)] p-16 text-center">
            <div className="w-20 h-20 bg-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="w-10 h-10 text-gray-300 dark:text-gray-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300">
              {searchTerm ? '未找到匹配的产品' : '暂无产品记录'}
            </h3>
            <p className="text-gray-400 dark:text-gray-500 mt-2">
              {searchTerm ? '尝试其他搜索词' : '前往"选品分析"页面创建第一个产品分析'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map(product => (
              <div
                key={product.id}
                className="bg-white/90 dark:bg-transparent dark:glass-panel rounded-xl border border-gray-100 dark:border-[var(--border-color)] shadow-sm dark:shadow-none hover:shadow-xl dark:hover:shadow-[0_0_20px_rgba(59,130,246,0.2)] transition-all duration-300 overflow-hidden group cursor-pointer hover:-translate-y-1"
                onClick={() => setSelectedProduct(product)}
              >
                <div className="h-1.5 bg-gradient-to-r from-indigo-500 to-purple-500 dark:from-[var(--neon-blue)] dark:to-[var(--neon-purple)] opacity-70 group-hover:opacity-100 transition-opacity" />
                <div className="p-6">
                  <div className="flex items-start justify-between min-h-[60px]">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 dark:text-white text-lg group-hover:text-indigo-600 dark:group-hover:text-[var(--neon-blue)] transition-colors line-clamp-2 leading-tight">
                        {product.productName}
                      </h3>
                      <span className="inline-block mt-3 px-2.5 py-1 bg-indigo-50 dark:bg-blue-900/20 text-indigo-600 dark:text-blue-300 text-xs font-medium rounded-full border border-indigo-100 dark:border-blue-800/30">
                        {product.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-gray-100 dark:border-white/10 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      {formatDate(product.createdAt)}
                    </span>
                    <span className="flex items-center gap-1 text-indigo-500 dark:text-[var(--neon-blue)] opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                      <Eye className="w-4 h-4" />
                      查看报告
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Stats */}
        {!loading && filteredProducts.length > 0 && (
          <div className="mt-8 text-center text-sm text-gray-400 dark:text-gray-600">
            共 {products.length} 个产品分析 {searchTerm && `· 显示 ${filteredProducts.length} 个结果`}
          </div>
        )}
      </div>
    </div>
  );
}
