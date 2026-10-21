import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ page, totalPages, totalElements, onPageChange }) {
  if (!totalElements) return null;

  const current = page.number ?? 0;
  const totalPagesSafe = Math.max(page.totalPages ?? 1, 1);
  const size = page.size ?? 10;
  const from = current * size + 1;
  const to = Math.min((current + 1) * size, totalElements);

  return (
    <div className="pagination">
      <span className="pagination-info">
        Exibindo <strong>{from}–{to}</strong> de <strong>{totalElements}</strong> registro
        {totalElements === 1 ? '' : 's'}
      </span>
      <div className="pagination-controls">
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={() => onPageChange(current - 1)}
          disabled={current === 0}
          aria-label="Página anterior"
        >
          <ChevronLeft size={14} />
          Anterior
        </button>
        <span className="text-muted" style={{ fontSize: 12.5, padding: '0 6px' }}>
          Página {current + 1} de {totalPagesSafe}
        </span>
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={() => onPageChange(current + 1)}
          disabled={current >= totalPagesSafe - 1}
          aria-label="Próxima página"
        >
          Próxima
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
