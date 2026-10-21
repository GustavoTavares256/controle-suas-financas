import { useNavigate } from 'react-router-dom';
import { Plus, ArrowLeftRight, Tags, TrendingUp } from 'lucide-react';

export default function Shortcuts({ onNovaMovimentacao }) {
  const navigate = useNavigate();

  const shortcuts = [
    {
      label: 'Nova movimentação',
      desc: 'Registrar entrada ou despesa',
      icon: Plus,
      action: onNovaMovimentacao,
    },
    {
      label: 'Movimentações',
      desc: 'Ver todos os registros',
      icon: ArrowLeftRight,
      action: () => navigate('/movimentacoes'),
    },
    {
      label: 'Entradas',
      desc: 'Acompanhar entradas',
      icon: TrendingUp,
      action: () => navigate('/receitas'),
    },
    {
      label: 'Categorias',
      desc: 'Organizar seus gastos',
      icon: Tags,
      action: () => navigate('/categorias'),
    },
  ];

  return (
    <div className="shortcut-grid">
      {shortcuts.map((shortcut) => (
        <button key={shortcut.label} type="button" className="shortcut-card" onClick={shortcut.action}>
          <span className="shortcut-icon">
            <shortcut.icon size={18} />
          </span>
          <span>
            <span className="shortcut-label">{shortcut.label}</span>
            <span className="shortcut-desc" style={{ display: 'block' }}>
              {shortcut.desc}
            </span>
          </span>
        </button>
      ))}
    </div>
  );
}
