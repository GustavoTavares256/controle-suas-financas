import Modal from '../ui/Modal';
import TypeBadge from './TypeBadge';
import { formatCurrency } from '../../utils/format';
import { formatDateLong } from '../../utils/date';
import {
  TIPO,
  FORMA_PAGAMENTO,
  FORMA_PAGAMENTO_LABELS,
  STATUS_PAGAMENTO,
  STATUS_PAGAMENTO_LABELS,
} from '../../utils/constants';

export default function TransactionDetails({ movimentacao, onClose, onEdit }) {
  const isEntrada = movimentacao?.tipo === TIPO.RECEITA;

  return (
    <Modal
      open={Boolean(movimentacao)}
      onClose={onClose}
      title="Detalhes da movimentação"
      subtitle={movimentacao?.descricao}
      size="sm"
      footer={
        <>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Fechar
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              onClose();
              onEdit(movimentacao);
            }}
          >
            Editar
          </button>
        </>
      }
    >
      {movimentacao && (
        <div className="detail-list">
          <div className="detail-row">
            <span className="detail-label">Valor</span>
            <span className={`detail-value ${isEntrada ? 'value-positive' : 'value-negative'}`}>
              {formatCurrency(movimentacao.valor)}
              {movimentacao.formaPagamento === FORMA_PAGAMENTO.PARCELADO &&
                movimentacao.totalParcelas > 1 && (
                  <span className="text-muted" style={{ fontWeight: 500 }}>
                    {' '}
                    (de {formatCurrency(movimentacao.valor * movimentacao.totalParcelas)})
                  </span>
                )}
            </span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Tipo</span>
            <span className="detail-value">
              <TypeBadge tipo={movimentacao.tipo} />
            </span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Categoria</span>
            <span className="detail-value">{movimentacao.categoria}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Data</span>
            <span className="detail-value">{formatDateLong(movimentacao.data)}</span>
          </div>

          {!isEntrada && (
            <>
              {movimentacao.local && (
                <div className="detail-row">
                  <span className="detail-label">O que foi comprado</span>
                  <span className="detail-value">{movimentacao.local}</span>
                </div>
              )}
              {movimentacao.formaPagamento && (
                <div className="detail-row">
                  <span className="detail-label">Forma de pagamento</span>
                  <span className="detail-value">
                    {FORMA_PAGAMENTO_LABELS[movimentacao.formaPagamento] ||
                      movimentacao.formaPagamento}
                    {movimentacao.formaPagamento === FORMA_PAGAMENTO.PARCELADO &&
                      movimentacao.totalParcelas > 1 &&
                      ` — ${movimentacao.parcelaAtual || '?'}/${movimentacao.totalParcelas}x`}
                  </span>
                </div>
              )}
              {movimentacao.statusPagamento && (
                <div className="detail-row">
                  <span className="detail-label">Situação</span>
                  <span className="detail-value">
                    <span
                      className={`badge ${
                        movimentacao.statusPagamento === STATUS_PAGAMENTO.PENDENTE
                          ? 'badge-neutral'
                          : 'badge-receita'
                      }`}
                      style={
                        movimentacao.statusPagamento === STATUS_PAGAMENTO.PENDENTE
                          ? { background: 'var(--warning-50)', color: 'var(--warning-600)' }
                          : undefined
                      }
                    >
                      {STATUS_PAGAMENTO_LABELS[movimentacao.statusPagamento] ||
                        movimentacao.statusPagamento}
                    </span>
                  </span>
                </div>
              )}
            </>
          )}

          <div className="detail-row">
            <span className="detail-label">Observações</span>
            <span className="detail-value" style={{ fontWeight: 500, maxWidth: 260 }}>
              {movimentacao.observacao || '—'}
            </span>
          </div>
        </div>
      )}
    </Modal>
  );
}
