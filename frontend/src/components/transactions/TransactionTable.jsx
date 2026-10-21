import { Eye, Pencil, Trash2 } from 'lucide-react';
import { formatCurrency } from '../../utils/format';
import { formatDate } from '../../utils/date';
import {
  TIPO,
  FORMA_PAGAMENTO,
  FORMA_PAGAMENTO_LABELS,
  STATUS_PAGAMENTO,
  STATUS_PAGAMENTO_LABELS,
} from '../../utils/constants';
import TypeBadge from './TypeBadge';

function ExpenseMeta({ mov }) {
  const parts = [];
  if (mov.local) parts.push(mov.local);
  if (mov.formaPagamento) {
    let pagamento = FORMA_PAGAMENTO_LABELS[mov.formaPagamento] || mov.formaPagamento;
    if (
      mov.formaPagamento === FORMA_PAGAMENTO.PARCELADO &&
      mov.totalParcelas &&
      mov.parcelaAtual
    ) {
      pagamento = `${mov.parcelaAtual}/${mov.totalParcelas}x`;
    }
    parts.push(pagamento);
  }
  if (!parts.length) return null;
  return <div className="cell-sub">{parts.join(' · ')}</div>;
}

export default function TransactionTable({ movimentacoes, onView, onEdit, onDelete }) {
  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            <th>Descrição</th>
            <th>Categoria</th>
            <th>Data</th>
            <th className="align-right">Valor</th>
            <th className="align-right">Ações</th>
          </tr>
        </thead>
        <tbody>
          {movimentacoes.map((mov) => {
            const isEntrada = mov.tipo === TIPO.RECEITA;
            const isPendente = mov.statusPagamento === STATUS_PAGAMENTO.PENDENTE;
            return (
              <tr key={mov.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span className="cell-title">{mov.descricao}</span>
                    {isPendente && (
                      <span
                        className="badge badge-neutral"
                        style={{ background: 'var(--warning-50)', color: 'var(--warning-600)' }}
                        title={STATUS_PAGAMENTO_LABELS.PENDENTE}
                      >
                        Dívida
                      </span>
                    )}
                  </div>
                  <div className="cell-sub" style={{ display: 'inline-block' }}>
                    <TypeBadge tipo={mov.tipo} />
                  </div>
                  {!isEntrada && <ExpenseMeta mov={mov} />}
                </td>
                <td>{mov.categoria}</td>
                <td style={{ whiteSpace: 'nowrap' }}>{formatDate(mov.data)}</td>
                <td className="align-right">
                  <span className={`cell-value ${isEntrada ? 'value-positive' : 'value-negative'}`}>
                    {isEntrada ? '+' : '−'} {formatCurrency(mov.valor)}
                  </span>
                  {mov.formaPagamento === FORMA_PAGAMENTO.PARCELADO && mov.totalParcelas > 1 && (
                    <div className="cell-sub">de {formatCurrency(mov.valor * mov.totalParcelas)}</div>
                  )}
                </td>
                <td className="align-right">
                  <div className="row-actions">
                    <button
                      type="button"
                      className="btn btn-ghost btn-icon"
                      onClick={() => onView(mov)}
                      aria-label={`Ver detalhes de ${mov.descricao}`}
                      title="Visualizar"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      type="button"
                      className="btn btn-ghost btn-icon"
                      onClick={() => onEdit(mov)}
                      aria-label={`Editar ${mov.descricao}`}
                      title="Editar"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      type="button"
                      className="btn btn-ghost btn-icon"
                      onClick={() => onDelete(mov)}
                      aria-label={`Excluir ${mov.descricao}`}
                      title="Excluir"
                      style={{ color: 'var(--danger-600)' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
