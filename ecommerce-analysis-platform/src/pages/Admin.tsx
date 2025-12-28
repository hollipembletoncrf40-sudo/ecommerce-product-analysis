import { useState, useEffect } from 'react';
import { Lock, Key, Plus, Copy, Check, LogOut, Users, CreditCard, TrendingUp, Eye, EyeOff, Loader2, Shield, Zap } from 'lucide-react';

interface AccessKey {
  key: string;
  usesAmount: number;
  isUsed: boolean;
  usedByClientId?: string;
  usedAt?: string;
  createdAt: string;
}

interface Stats {
  totalUsers: number;
  totalKeys: number;
  usedKeys: number;
  totalUsage: number;
}

export function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [generateCount, setGenerateCount] = useState(5);
  const [generatedKeys, setGeneratedKeys] = useState<AccessKey[]>([]);
  const [allKeys, setAllKeys] = useState<AccessKey[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    const session = localStorage.getItem('admin_session');
    if (session) {
      setIsLoggedIn(true);
      loadData();
    }
  }, []);

  const loadData = async () => {
    const session = localStorage.getItem('admin_session');
    try {
      const keysRes = await fetch('/api/admin/keys', {
        headers: { 'Authorization': `Bearer ${session}` }
      });
      if (keysRes.ok) {
        const data = await keysRes.json();
        setAllKeys(data.keys || []);
        setStats(data.stats || null);
      }
    } catch (err) {
      console.error('Failed to load data', err);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || '登录失败');
      }

      localStorage.setItem('admin_session', data.token);
      setIsLoggedIn(true);
      setPassword('');
      loadData();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_session');
    setIsLoggedIn(false);
    setAllKeys([]);
    setStats(null);
  };

  const handleGenerate = async () => {
    setLoading(true);
    const session = localStorage.getItem('admin_session');
    
    try {
      const res = await fetch('/api/admin/keys/generate', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session}`
        },
        body: JSON.stringify({ count: generateCount })
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || '生成失败');
      }

      setGeneratedKeys(data.keys);
      loadData();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const copyAllKeys = () => {
    const keyText = generatedKeys.map(k => k.key).join('\n');
    navigator.clipboard.writeText(keyText);
    setCopiedKey('all');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // 登录页面 - 纯黑设计
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        {/* 微妙网格图案 */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
        
        <div className="w-full max-w-md p-8 relative z-10">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-8 shadow-2xl">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(255,255,255,0.1)]">
                <Shield className="w-10 h-10 text-black" />
              </div>
              <h1 className="text-3xl font-black text-white tracking-tight">管理后台</h1>
              <p className="text-zinc-500 mt-2 text-sm font-medium">请输入管理员密码登录</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="请输入密码"
                  className="w-full px-5 py-4 bg-black border-2 border-zinc-800 rounded-xl text-white placeholder:text-zinc-600 focus:border-white focus:ring-0 outline-none transition-all font-mono tracking-wider"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {error && (
                <div className="text-red-500 text-sm bg-red-500/10 border border-red-500/30 px-4 py-3 rounded-lg font-medium">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !password}
                className="w-full py-4 bg-white hover:bg-zinc-200 text-black rounded-xl font-bold text-lg shadow-[0_0_30px_rgba(255,255,255,0.15)] disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Lock className="w-5 h-5" />}
                {loading ? '验证中...' : '登 录'}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // 管理后台主页 - 纯黑高对比度
  return (
    <div className="min-h-screen bg-black text-white">
      {/* 网格背景 */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />
      
      <div className="relative z-10 p-8 max-w-7xl mx-auto">
        {/* 顶部标题 */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.1)]">
              <Key className="w-7 h-7 text-black" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white tracking-tight">卡密管理系统</h1>
              <p className="text-zinc-500 text-sm font-medium mt-1">管理员控制台</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-5 py-3 text-zinc-400 hover:text-white hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-xl transition-all font-medium"
          >
            <LogOut className="w-5 h-5" />
            退出登录
          </button>
        </div>

        {/* 数据统计 */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-zinc-500 text-xs font-bold">用户数</p>
                  <p className="text-3xl font-black text-white">{stats.totalUsers}</p>
                </div>
              </div>
            </div>
            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-500 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-zinc-500 text-xs font-bold">总卡密</p>
                  <p className="text-3xl font-black text-white">{stats.totalKeys}</p>
                </div>
              </div>
            </div>
            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-500 rounded-lg flex items-center justify-center">
                  <Check className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-zinc-500 text-xs font-bold">已兑换</p>
                  <p className="text-3xl font-black text-white">{stats.usedKeys}</p>
                </div>
              </div>
            </div>
            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-rose-500 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-zinc-500 text-xs font-bold">总使用次数</p>
                  <p className="text-3xl font-black text-white">{stats.totalUsage}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 生成卡密面板 */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-8">
            <h2 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <Plus className="w-5 h-5 text-black" />
              </div>
              <span>生成新卡密</span>
            </h2>

            <div className="flex items-end gap-4 mb-8">
              <div className="flex-1">
                <label className="text-xs font-bold text-zinc-500 mb-3 block">生成数量</label>
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={generateCount}
                  onChange={(e) => setGenerateCount(Number(e.target.value))}
                  className="w-full px-5 py-4 bg-black border-2 border-zinc-800 rounded-xl text-white text-2xl font-bold text-center focus:border-white outline-none transition-all"
                />
              </div>
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="px-8 py-4 bg-white hover:bg-zinc-200 text-black rounded-xl font-bold shadow-[0_0_30px_rgba(255,255,255,0.1)] disabled:opacity-30 transition-all flex items-center gap-3"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
                立即生成
              </button>
            </div>

            {/* 新生成的卡密 */}
            {generatedKeys.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-xs font-bold text-zinc-500">新生成的卡密</p>
                  <button
                    onClick={copyAllKeys}
                    className="text-xs font-bold text-zinc-400 hover:text-white flex items-center gap-2 transition-colors"
                  >
                    {copiedKey === 'all' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    {copiedKey === 'all' ? '已复制！' : '复制全部'}
                  </button>
                </div>
                <div className="bg-black border border-zinc-800 rounded-xl p-2 max-h-72 overflow-y-auto space-y-1">
                  {generatedKeys.map((k) => (
                    <div
                      key={k.key}
                      onClick={() => copyToClipboard(k.key)}
                      className="flex items-center justify-between bg-zinc-900 hover:bg-zinc-800 px-4 py-3 rounded-lg cursor-pointer transition-colors group"
                    >
                      <code className="text-emerald-400 font-mono font-bold text-sm tracking-wider">{k.key}</code>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-zinc-600 font-bold">{k.usesAmount}次</span>
                        {copiedKey === k.key ? (
                          <Check className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <Copy className="w-4 h-4 text-zinc-600 group-hover:text-white transition-colors" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 卡密列表面板 */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-8">
            <h2 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-black" />
              </div>
              <span>卡密列表</span>
              <span className="ml-auto text-sm font-bold text-zinc-600">共 {allKeys.length} 个</span>
            </h2>

            <div className="space-y-2 max-h-[450px] overflow-y-auto pr-2">
              {allKeys.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-zinc-900 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Key className="w-8 h-8 text-zinc-700" />
                  </div>
                  <p className="text-zinc-600 font-bold">暂无卡密</p>
                </div>
              ) : (
                allKeys.map((k) => (
                  <div
                    key={k.key}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl border transition-all ${
                      k.isUsed 
                        ? 'bg-zinc-900/50 border-zinc-800/50 opacity-50' 
                        : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700 cursor-pointer'
                    }`}
                    onClick={() => !k.isUsed && copyToClipboard(k.key)}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-2.5 h-2.5 rounded-full ${k.isUsed ? 'bg-zinc-600' : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]'}`} />
                      <code className={`font-mono font-bold text-sm tracking-wider ${k.isUsed ? 'text-zinc-600' : 'text-white'}`}>{k.key}</code>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xs font-bold text-zinc-600">{k.usesAmount}次</span>
                      {k.isUsed ? (
                        <span className="text-xs font-bold text-red-500 bg-red-500/10 px-2 py-1 rounded">已使用</span>
                      ) : (
                        copiedKey === k.key ? (
                          <Check className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <Copy className="w-4 h-4 text-zinc-700 hover:text-white transition-colors" />
                        )
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* 底部 */}
        <div className="mt-10 text-center">
          <p className="text-zinc-700 text-xs font-bold">电商选品分析平台 · 管理后台 v1.0</p>
        </div>
      </div>
    </div>
  );
}
