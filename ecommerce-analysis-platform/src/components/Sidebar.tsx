import { ArrowUp, Home, LayoutGrid, Settings, Package } from 'lucide-react';
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

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <aside 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={clsx(
        "fixed left-0 top-0 h-screen z-50 flex flex-col transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1)",
        "bg-black shadow-[10px_0_30px_rgba(0,0,0,0.5)] rounded-r-[40px] overflow-hidden border-r border-white/5",
        isHovered ? "w-[240px]" : "w-[68px]"
      )}
    >
      {/* Header: Back to Top */}
      <div className="h-20 flex items-center shrink-0 px-0 relative group/head cursor-pointer" onClick={scrollToTop}>
        <div className="w-[68px] flex items-center justify-center">
            <ArrowUp className="w-5 h-5 text-gray-400 group-hover/head:text-white transition-colors" />
        </div>
        <span className={clsx(
            "text-base font-medium text-gray-400 whitespace-nowrap transition-all duration-300 group-hover/head:text-white", 
            isHovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4 pointer-events-none"
        )}>
          Back to Top
        </span>
      </div>

      {/* Divider */}
      <div className="mx-4 h-px bg-white/10 shrink-0 mb-4" />
      
      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar px-3 space-y-2">
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
      
      {/* User Avatar (Optional - kept small at bottom) */}
       <div className="p-4 shrink-0 mb-2">
        <div className={clsx(
          "flex items-center p-2 rounded-2xl transition-all duration-300",
          isHovered ? "bg-white/5" : "justify-center"
        )}>
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white text-[10px] font-bold shadow-lg shrink-0">
            JP
          </div>
          <div className={clsx("ml-3 overflow-hidden transition-all duration-300", isHovered ? "w-auto opacity-100" : "w-0 opacity-0")}>
            <p className="text-xs font-bold text-white whitespace-nowrap">Josephine</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
