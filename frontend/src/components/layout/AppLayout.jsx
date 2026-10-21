import { useState, Suspense, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Menu, X, Wallet } from 'lucide-react';
import Sidebar from './Sidebar';
import LoadingBlock from '../ui/LoadingBlock';
import { usePreferences } from '../ui/PreferencesContext';

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { prefs } = usePreferences();

  useEffect(() => {
    document.documentElement.classList.toggle('dense', Boolean(prefs.denseMode));
    document.documentElement.classList.toggle('dark', Boolean(prefs.darkMode));
    return () => {
      document.documentElement.classList.remove('dense');
      document.documentElement.classList.remove('dark');
    };
  }, [prefs.denseMode, prefs.darkMode]);

  return (
    <div className="app-layout">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="app-main">
        <header className="mobile-topbar">
          {sidebarOpen ? (
            <button
              type="button"
              className="btn btn-ghost btn-icon"
              onClick={() => setSidebarOpen(false)}
              aria-label="Fechar menu"
            >
              <X size={20} />
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-ghost btn-icon"
              onClick={() => setSidebarOpen(true)}
              aria-label="Abrir menu"
            >
              <Menu size={20} />
            </button>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700 }}>
            <Wallet size={18} color="var(--primary-600)" />
            Controle suas Finanças
          </div>
        </header>

        <main className="app-content" key={location.pathname}>
          <Suspense fallback={<LoadingBlock message="Carregando página…" />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
