import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ArrowLeftRight,
  TrendingUp,
  TrendingDown,
  Tags,
  Settings,
  Wallet,
  Bot,
  Moon,
  Sun,
} from 'lucide-react';
import { usePreferences } from '../ui/PreferencesContext';

const mainLinks = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/movimentacoes', label: 'Movimentações', icon: ArrowLeftRight },
  { to: '/receitas', label: 'Entradas', icon: TrendingUp },
  { to: '/despesas', label: 'Despesas', icon: TrendingDown },
  { to: '/assistente', label: 'Assistente IA', icon: Bot },
];

const secondaryLinks = [
  { to: '/categorias', label: 'Categorias', icon: Tags },
  { to: '/configuracoes', label: 'Configurações', icon: Settings },
];

function NavItem({ to, label, icon: Icon, end }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
    >
      <Icon size={18} />
      {label}
    </NavLink>
  );
}

export default function Sidebar({ open, onClose }) {
  const { prefs, updatePreferences } = usePreferences();

  return (
    <>
      <div className={`sidebar-backdrop ${open ? 'open' : ''}`} onClick={onClose} aria-hidden="true" />
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <div className="brand-icon">
            <Wallet size={20} />
          </div>
          <div className="brand-text">
            Controle suas
            <span>Finanças</span>
          </div>
        </div>

        <nav className="sidebar-nav" aria-label="Navegação principal">
          <span className="nav-section-label">Geral</span>
          {mainLinks.map((link) => (
            <NavItem key={link.to} {...link} />
          ))}

          <span className="nav-section-label">Organização</span>
          {secondaryLinks.map((link) => (
            <NavItem key={link.to} {...link} />
          ))}
        </nav>

        <div className="sidebar-footer">
          <button
            type="button"
            className="theme-toggle"
            onClick={() => updatePreferences({ darkMode: !prefs.darkMode })}
            aria-pressed={prefs.darkMode}
            aria-label={prefs.darkMode ? 'Ativar modo claro' : 'Ativar modo noturno'}
          >
            <span className="theme-toggle-text">
              {prefs.darkMode ? <Sun size={17} /> : <Moon size={17} />}
              {prefs.darkMode ? 'Modo claro' : 'Modo noturno'}
            </span>
            <span className={`switch-ui ${prefs.darkMode ? 'on' : ''}`} aria-hidden="true" />
          </button>
        </div>
      </aside>
    </>
  );
}
