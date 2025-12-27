import { Home, BarChart2, Settings, Box } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import clsx from 'clsx';

const navItems = [
  { icon: Home, label: '仪表盘', path: '/' },
  { icon: BarChart2, label: '选品分析', path: '/analysis' },
  { icon: Box, label: '产品库', path: '/products' },
  { icon: Settings, label: '设置', path: '/settings' },
];

export function Sidebar() {
  return (
    <aside className="w-64 bg-white dark:bg-[var(--bg-card)] border-r border-gray-200 dark:border-[var(--border-color)] h-screen flex flex-col fixed left-0 top-0 z-50 transition-colors duration-300">
      <div className="h-16 flex items-center px-6 border-b border-gray-100 dark:border-[var(--border-color)]">
        <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
          选品大脑
        </span>
      </div>
      
      <nav className="flex-1 py-6 px-3 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              clsx(
                "flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 shadow-sm dark:shadow-[0_0_10px_rgba(59,130,246,0.15)]"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-gray-200"
              )
            }
          >
            <item.icon className="w-5 h-5 mr-3 opacity-75" />
            {item.label}
          </NavLink>
        ))}
      </nav>
      
      <div className="p-4 border-t border-gray-100 dark:border-[var(--border-color)]">
        <div className="flex items-center p-3 bg-gray-50 dark:bg-white/5 rounded-lg border border-transparent dark:border-white/5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-purple-500/20">
            JP
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-200">Josephine</p>
            <p className="text-xs text-gray-500 dark:text-gray-500">管理员</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
