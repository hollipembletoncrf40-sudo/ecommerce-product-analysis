import { Sidebar } from './Sidebar';
import { Outlet } from 'react-router-dom';

export function Layout() {
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-black transition-colors duration-300">
      <Sidebar />
      <main className="pl-20 min-h-screen delay-200 transition-all duration-500">
        <div className="max-w-7xl mx-auto px-8 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
