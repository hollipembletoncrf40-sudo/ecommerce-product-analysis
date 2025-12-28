import React, { useState } from 'react';
import { X, CreditCard, Check, AlertCircle } from 'lucide-react';

interface RechargeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRedeem: (key: string) => Promise<any>;
}

export function RechargeModal({ isOpen, onClose, onRedeem }: RechargeModalProps) {
  const [key, setKey] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!key.trim()) return;

    setStatus('loading');
    setMessage('');

    try {
      const result = await onRedeem(key);
      setStatus('success');
      setMessage(`充值成功！虽然增加了 ${result.addedQuota} 次使用额度。`);
      setKey('');
      setTimeout(() => {
          onClose();
          setStatus('idle');
          setMessage('');
      }, 2000);
    } catch (err: any) {
      setStatus('error');
      setMessage(err.message || '充值失败，请检查卡密是否正确');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-white/10 overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-white/5 flex justify-between items-center bg-gray-50/50 dark:bg-white/5">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-indigo-500" />
            充值额度
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            请输入您的卡密以增加使用次数。每个卡密可兑换 30 次深度分析额度。
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="请输入卡密 (例如: KEY-XXXX...)"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder:text-gray-400 font-mono text-center tracking-widest uppercase"
              />
            </div>

            {status === 'error' && (
                <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    {message}
                </div>
            )}
            
            {status === 'success' && (
                <div className="flex items-center gap-2 text-green-500 text-sm bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                    <Check className="w-4 h-4 flex-shrink-0" />
                    {message}
                </div>
            )}

            <button
              type="submit"
              disabled={status === 'loading' || status === 'success'}
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium shadow-lg shadow-indigo-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              {status === 'loading' ? '充值中...' : '立即充值'}
            </button>
          </form>
          
          <div className="mt-6 pt-6 border-t border-gray-100 dark:border-white/5 text-center">
             <a href="#" className="text-xs text-gray-400 hover:text-indigo-500 transition-colors">没有卡密？点击这里购买</a>
          </div>
        </div>
      </div>
    </div>
  );
}
