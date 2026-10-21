import { lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import { ToastProvider } from './components/ui/ToastContext';
import { PreferencesProvider } from './components/ui/PreferencesContext';
import { AiConfigProvider } from './components/ui/AiConfigContext';
import EmptyState from './components/ui/EmptyState';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Movimentacoes = lazy(() => import('./pages/Movimentacoes'));
const Receitas = lazy(() => import('./pages/Receitas'));
const Despesas = lazy(() => import('./pages/Despesas'));
const Categorias = lazy(() => import('./pages/Categorias'));
const Configuracoes = lazy(() => import('./pages/Configuracoes'));
const Assistente = lazy(() => import('./pages/Assistente'));

export default function App() {
  return (
    <PreferencesProvider>
      <AiConfigProvider>
        <ToastProvider>
          <BrowserRouter>
          <Routes>
            <Route element={<AppLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="/movimentacoes" element={<Movimentacoes />} />
              <Route path="/receitas" element={<Receitas />} />
              <Route path="/despesas" element={<Despesas />} />
              <Route path="/assistente" element={<Assistente />} />
              <Route path="/categorias" element={<Categorias />} />
              <Route path="/configuracoes" element={<Configuracoes />} />
              <Route
                path="*"
                element={
                  <EmptyState
                    title="Página não encontrada"
                    description="O endereço acessado não existe nesta aplicação."
                  />
                }
              />
            </Route>
          </Routes>
          </BrowserRouter>
        </ToastProvider>
      </AiConfigProvider>
    </PreferencesProvider>
  );
}
