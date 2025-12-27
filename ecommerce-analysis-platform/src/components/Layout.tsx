import { Sidebar } from './Sidebar';
import { Outlet } from 'react-router-dom';

export function Layout() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[var(--bg-dark)] transition-colors duration-300">
      <Sidebar />
      <main className="pl-64 min-h-screen">
        <div className="max-w-7xl mx-auto px-8 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
