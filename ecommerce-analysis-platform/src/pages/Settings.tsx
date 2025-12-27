import { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Key, Palette, Database, Save, Check, AlertTriangle, Trash2, RefreshCw } from 'lucide-react';

interface SettingsData {
  apiKey: string;
  apiBaseUrl: string;
  modelName: string;
  theme: 'light' | 'dark' | 'auto';
  language: 'zh' | 'en';
  autoSave: boolean;
  maxHistoryCount: number;
}

export function Settings() {
  const [settings, setSettings] = useState<SettingsData>({
    apiKey: '',
    apiBaseUrl: 'https://api.xiaomimimo.com/v1',
    modelName: 'mimo-v2-flash',
    theme: 'dark',
    language: 'zh',
    autoSave: true,
    maxHistoryCount: 100
  });
  const [saved, setSaved] = useState(false);
  const [productCount, setProductCount] = useState(0);

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('appSettings');
    if (savedSettings) {
      setSettings({ ...settings, ...JSON.parse(savedSettings) });
    }
    
    // Get product count
    fetch('/api/products')
      .then(res => res.json())
      .then(data => setProductCount(Array.isArray(data) ? data.length : 0))
      .catch(() => setProductCount(0));
  }, []);

  const handleSave = () => {
    localStorage.setItem('appSettings', JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleClearHistory = () => {
    if (confirm('确定要清除所有产品分析历史记录吗？此操作不可恢复。')) {
      // This would require a backend endpoint
      alert('此功能需要后端支持，请手动删除 data/analyses.json 文件');
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-500">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <div className="p-2 bg-indigo-100 dark:bg-transparent rounded-xl dark:border dark:border-[var(--neon-blue)] dark:shadow-[0_0_10px_rgba(0,240,255,0.3)]">
              <SettingsIcon className="w-8 h-8 text-indigo-600 dark:text-[var(--neon-blue)]" />
            </div>
            系统设置
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 ml-1">配置 AI 服务、外观和数据管理</p>
        </div>

        {/* Settings Sections */}
        <div className="space-y-8">
          
          {/* API Configuration */}
          <section className="bg-white/90 dark:bg-transparent dark:glass-panel backdrop-blur rounded-2xl border border-gray-100 dark:border-[var(--border-color)] shadow-sm dark:shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-[var(--border-color)] flex items-center gap-3 bg-gray-50/50 dark:bg-white/5">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                <Key className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-semibold text-gray-900 dark:text-white text-lg">API 配置</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">配置 AI 模型服务连接</p>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 pl-1">API 密钥</label>
                <input
                  type="password"
                  value={settings.apiKey}
                  onChange={e => setSettings({...settings, apiKey: e.target.value})}
                  placeholder="sk-xxxx..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 dark:bg-black/30 dark:border-white/10 focus:bg-white dark:focus:bg-black/50 focus:border-indigo-400 dark:focus:border-[var(--neon-blue)] focus:ring-4 focus:ring-indigo-100 dark:focus:ring-blue-500/20 outline-none transition-all dark:text-white"
                />
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 pl-1">当前使用服务端配置的密钥，此处设置仅用于本地测试</p>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 pl-1">API 地址</label>
                  <input
                    type="text"
                    value={settings.apiBaseUrl}
                    onChange={e => setSettings({...settings, apiBaseUrl: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 dark:bg-black/30 dark:border-white/10 focus:bg-white dark:focus:bg-black/50 focus:border-indigo-400 dark:focus:border-[var(--neon-blue)] focus:ring-4 focus:ring-indigo-100 dark:focus:ring-blue-500/20 outline-none transition-all text-sm dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 pl-1">模型名称</label>
                  <div className="relative">
                    <select
                      value={settings.modelName}
                      onChange={e => setSettings({...settings, modelName: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 dark:bg-black/30 dark:border-white/10 focus:bg-white dark:focus:bg-black/50 focus:border-indigo-400 dark:focus:border-[var(--neon-blue)] focus:ring-4 focus:ring-indigo-100 dark:focus:ring-blue-500/20 outline-none transition-all appearance-none dark:text-white"
                    >
                      <option value="mimo-v2-flash">MiMo v2 Flash</option>
                      <option value="gpt-4o-mini">GPT-4o Mini</option>
                      <option value="gpt-4o">GPT-4o</option>
                      <option value="claude-3-5-sonnet">Claude 3.5 Sonnet</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Appearance */}
          <section className="bg-white/90 dark:bg-transparent dark:glass-panel backdrop-blur rounded-2xl border border-gray-100 dark:border-[var(--border-color)] shadow-sm dark:shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-[var(--border-color)] flex items-center gap-3 bg-gray-50/50 dark:bg-white/5">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <Palette className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-semibold text-gray-900 dark:text-white text-lg">外观设置</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">个性化界面显示</p>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 pl-1">主题模式</label>
                  <div className="flex gap-2 bg-gray-100 dark:bg-black/30 p-1 rounded-xl border border-gray-200 dark:border-white/5">
                    {(['light', 'dark', 'auto'] as const).map(theme => (
                      <button
                        key={theme}
                        onClick={() => {
                          const newSettings = {...settings, theme};
                          setSettings(newSettings);
                          if (theme === 'dark' || (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                            document.documentElement.classList.add('dark');
                          } else {
                            document.documentElement.classList.remove('dark');
                          }
                        }}
                        className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                          settings.theme === theme
                            ? 'bg-white dark:bg-[var(--bg-card)] text-indigo-600 dark:text-[var(--neon-blue)] shadow-sm dark:shadow-[0_0_10px_rgba(0,240,255,0.2)] dark:border dark:border-[var(--neon-blue)]/30'
                            : 'text-gray-500 dark:text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'
                        }`}
                      >
                        {theme === 'light' ? '浅色' : theme === 'dark' ? '深色' : '跟随系统'}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 pl-1">语言</label>
                  <div className="relative">
                    <select
                      value={settings.language}
                      onChange={e => setSettings({...settings, language: e.target.value as 'zh' | 'en'})}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 dark:bg-black/30 dark:border-white/10 focus:bg-white dark:focus:bg-black/50 focus:border-indigo-400 dark:focus:border-[var(--neon-blue)] focus:ring-4 focus:ring-indigo-100 dark:focus:ring-blue-500/20 outline-none transition-all appearance-none dark:text-white"
                    >
                      <option value="zh">简体中文</option>
                      <option value="en">English</option>
                    </select>
                     <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Data Management */}
          <section className="bg-white/90 dark:bg-transparent dark:glass-panel backdrop-blur rounded-2xl border border-gray-100 dark:border-[var(--border-color)] shadow-sm dark:shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-[var(--border-color)] flex items-center gap-3 bg-gray-50/50 dark:bg-white/5">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
                <Database className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-semibold text-gray-900 dark:text-white text-lg">数据管理</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">管理本地存储的数据</p>
              </div>
            </div>
            <div className="p-6 space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-4 text-center border border-gray-100 dark:border-white/5">
                  <p className="text-2xl font-bold text-indigo-600 dark:text-[var(--neon-blue)]">{productCount}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">产品分析</p>
                </div>
                <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-4 text-center border border-gray-100 dark:border-white/5">
                  <p className="text-2xl font-bold text-purple-600 dark:text-[var(--neon-purple)]">{settings.maxHistoryCount}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">最大保留数</p>
                </div>
                <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-4 text-center border border-gray-100 dark:border-white/5">
                  <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{settings.autoSave ? '开启' : '关闭'}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">自动保存</p>
                </div>
              </div>
              
              {/* Options */}
              <div className="flex items-center justify-between py-4 border-b border-gray-100 dark:border-[var(--border-color)]">
                <div>
                  <p className="font-medium text-gray-800 dark:text-white">自动保存分析结果</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">每次分析完成后自动保存到本地数据库</p>
                </div>
                <button
                  onClick={() => setSettings({...settings, autoSave: !settings.autoSave})}
                  className={`relative w-14 h-7 rounded-full transition-colors ${
                    settings.autoSave ? 'bg-indigo-500 dark:bg-[var(--neon-blue)]' : 'bg-gray-300 dark:bg-white/20'
                  }`}
                >
                  <span className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform shadow-sm ${
                    settings.autoSave ? 'left-8' : 'left-1'
                  }`} />
                </button>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 pl-1">最大历史记录数</label>
                <input
                  type="number"
                  min={10}
                  max={500}
                  value={settings.maxHistoryCount}
                  onChange={e => setSettings({...settings, maxHistoryCount: parseInt(e.target.value) || 100})}
                  className="w-32 px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 dark:bg-black/30 dark:border-white/10 focus:bg-white dark:focus:bg-black/50 focus:border-indigo-400 dark:focus:border-[var(--neon-blue)] outline-none dark:text-white"
                />
              </div>

              {/* Danger Zone */}
              <div className="pt-4 border-t border-gray-100 dark:border-[var(--border-color)]">
                <div className="flex items-center gap-2 text-amber-600 dark:text-amber-500 mb-4">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-sm font-medium">危险操作</span>
                </div>
                <button
                  onClick={handleClearHistory}
                  className="flex items-center gap-2 px-5 py-2.5 bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors border border-transparent dark:border-red-900/20"
                >
                  <Trash2 className="w-4 h-4" />
                  清除所有历史记录
                </button>
              </div>
            </div>
          </section>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={saved}
            className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 dark:from-blue-700 dark:to-purple-700 text-white font-semibold rounded-xl shadow-lg shadow-indigo-200 dark:shadow-[0_0_20px_rgba(79,70,229,0.4)] transition-all duration-300 disabled:opacity-80 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99]"
          >
            {saved ? (
              <>
                <Check className="w-5 h-5" />
                已保存
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                保存设置
              </>
            )}
          </button>

          {/* System Info */}
          <div className="text-center text-sm text-gray-400 dark:text-gray-600 pt-4">
            <p className="font-medium">电商智能选品分析平台 v1.0.0</p>
            <p className="mt-1 opacity-70">Powered by MiMo AI · Built with React + Vite</p>
          </div>
        </div>
      </div>
    </div>
  );
}
