import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function ErrorState({ error, onRetry }) {
  const message =
    error?.message || 'Ocorreu um erro ao carregar as informações. Tente novamente.';

  return (
    <div className="error-state" role="alert">
      <div className="state-icon">
        <AlertTriangle size={24} />
      </div>
      <h3>Não foi possível carregar os dados</h3>
      <p>{message}</p>
      {onRetry && (
        <button type="button" className="btn btn-secondary btn-sm" onClick={onRetry}>
          <RefreshCw size={14} />
          Tentar novamente
        </button>
      )}
    </div>
  );
}
