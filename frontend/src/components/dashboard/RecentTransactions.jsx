import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { formatCurrency } from '../../utils/format';
import { formatDate } from '../../utils/date';
import { TIPO } from '../../utils/constants';
import TypeBadge from '../transactions/TypeBadge';
import EmptyState from '../ui/EmptyState';

export default function RecentTransactions({ movimentacoes, loading, error }) {
  if (loading) {
    return (
      <div className="card-body">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="skeleton" style={{ height: 44, marginBottom: 10 }} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="card-body">
        <p className="text-muted" style={{ fontSize: 13 }}>
          {error.message}
        </p>
      </div>
    );
  }

  if (!movimentacoes?.length) {
    return (
      <div className="card-body" style={{ padding: 0 }}>
        <EmptyState
          title="Nenhuma movimentação registrada"
          description="Cadastre sua primeira entrada ou despesa para começar a acompanhar suas finanças."
        />
      </div>
    );
  }

  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            <th>Descrição</th>
            <th>Data</th>
            <th className="align-right">Valor</th>
          </tr>
        </thead>
        <tbody>
          {movimentacoes.map((mov) => {
            const isReceita = mov.tipo === TIPO.RECEITA;
            return (
              <tr key={mov.id}>
                <td>
                  <div className="cell-title">{mov.descricao}</div>
                  <div className="cell-sub">
                    {mov.categoria} · <TypeBadge tipo={mov.tipo} />
                  </div>
                </td>
                <td style={{ whiteSpace: 'nowrap' }}>{formatDate(mov.data)}</td>
                <td className="align-right">
                  <span className={`cell-value ${isReceita ? 'value-positive' : 'value-negative'}`}>
                    {isReceita ? '+' : '−'} {formatCurrency(mov.valor)}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border)' }}>
        <Link
          to="/movimentacoes"
          className="btn btn-ghost btn-sm"
          style={{ color: 'var(--primary-600)' }}
        >
          Ver todas as movimentações
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
