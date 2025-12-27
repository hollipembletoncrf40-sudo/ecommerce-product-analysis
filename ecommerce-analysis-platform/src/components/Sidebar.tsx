import { Home, LayoutGrid, Settings, Package } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import clsx from 'clsx';
import { useState } from 'react';

// Main Navigation
const navItems = [
  { icon: Home, label: '仪表盘', path: '/' },
  { icon: LayoutGrid, label: '选品分析', path: '/analysis' },
  { icon: Package, label: '产品库', path: '/products' },
  { icon: Settings, label: '设置', path: '/settings' },
];

export function Sidebar() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <aside 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={clsx(
        "fixed right-0 top-1/2 -translate-y-1/2 z-50 flex flex-col transition-all duration-200 ease-out",
        "bg-black/80 backdrop-blur-2xl shadow-[-10px_0_40px_rgba(0,0,0,0.6)] rounded-l-3xl overflow-hidden border-l border-white/5 py-3 h-auto",
        isHovered ? "w-[170px]" : "w-[68px]"
      )}
    >
      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar px-3 space-y-2 pt-8">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.path}
            className={({ isActive }) =>
              clsx(
                "group flex items-center h-12 rounded-2xl transition-all duration-300 relative",
                isActive
                  ? "bg-[#2f2f46] text-[#818CF8]" // Dark Indigo pill
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              )
            }
          >
            {({ isActive }) => (
                <>
                    <div className="w-[44px] flex items-center justify-center shrink-0 ml-[1px]">
                         <item.icon 
                            className={clsx(
                                "w-6 h-6 transition-colors duration-300", 
                                isActive ? "text-[#818CF8]" : "text-gray-400 group-hover:text-white"
                            )} 
                         />
                    </div>
                         
                    <span className={clsx(
                        "whitespace-nowrap text-sm font-medium transition-all duration-300 ml-1", 
                        isHovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4 overflow-hidden"
                    )}>
                        {item.label}
                    </span>
                </>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
