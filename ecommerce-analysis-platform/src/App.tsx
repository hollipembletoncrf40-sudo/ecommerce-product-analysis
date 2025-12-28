import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Analysis } from './pages/Analysis';
import { Products } from './pages/Products';
import { Settings } from './pages/Settings';
import { Admin } from './pages/Admin';
import { AnalysisProvider } from './context/AnalysisContext';

function App() {
  return (
    <BrowserRouter>
      <AnalysisProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="analysis" element={<Analysis />} />
            <Route path="products" element={<Products />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          {/* Admin route - outside Layout for full-screen experience */}
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </AnalysisProvider>
    </BrowserRouter>
  );
}

export default App;
