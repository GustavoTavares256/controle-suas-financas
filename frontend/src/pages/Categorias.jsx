import useFetch from '../hooks/useFetch';
import { listCategorias } from '../services/categoriasService';
import { listMovimentacoes } from '../services/movimentacoesService';
import LoadingBlock from '../components/ui/LoadingBlock';
import ErrorState from '../components/ui/ErrorState';
import EmptyState from '../components/ui/EmptyState';
import { TIPO } from '../utils/constants';
import { formatCurrency } from '../utils/format';

/**
 * A API atual permite apenas a LEITURA de categorias (GET /api/categorias).
 * Não há endpoints de criação, edição ou exclusão — por isso a página
 * exibe apenas visualização e estatísticas de uso.
 */
export default function Categorias() {
  const {
    data: categorias,
    loading,
    error,
    reload,
  } = useFetch(listCategorias, []);

  const {
    data: movimentacoesPage,
    loading: loadingMov,
    error: errorMov,
  } = useFetch(() => listMovimentacoes({ pagina: 0, tamanho: 10000 }), []);

  const stats = new Map();
  const movimentacoes = movimentacoesPage?.content || [];
  for (const mov of movimentacoes) {
    const entry = stats.get(mov.categoria) || { count: 0, total: 0 };
    entry.count += 1;
    entry.total += Number(mov.valor) || 0;
    stats.set(mov.categoria, entry);
  }

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Categorias</h1>
          <p>
            Categorias disponíveis na API para organizar suas movimentações. Apenas leitura — a
            API atual não possui operações de criação, edição ou exclusão de categorias.
          </p>
        </div>
      </div>

      {loading && <LoadingBlock message="Carregando categorias…" />}
      {error && <ErrorState error={error} onRetry={reload} />}

      {!loading && !error && categorias?.length === 0 && (
        <div className="card">
          <EmptyState
            title="Nenhuma categoria disponível"
            description="A API não retornou categorias. Verifique o cadastro no backend."
          />
        </div>
      )}

      {!loading && !error && categorias?.length > 0 && (
        <div className="card">
          <div className="card-header">
            <div>
              <h2>Categorias cadastradas</h2>
              <div className="card-subtitle">
                {categorias.length} categoria(s) · uso calculado sobre as movimentações
              </div>
            </div>
          </div>
          <div className="card-body">
            {loadingMov && <LoadingBlock message="Calculando uso das categorias…" />}
            {!loadingMov && errorMov && (
              <p className="text-muted" style={{ fontSize: 13 }}>
                Não foi possível calcular o uso das categorias: {errorMov.message}
              </p>
            )}
            {!loadingMov && !errorMov && (
              <div className="category-grid">
                {categorias.map((categoria) => {
                  const stat = stats.get(categoria.nome) || { count: 0, total: 0 };
                  const isReceita = categoria.tipo === TIPO.RECEITA;
                  return (
                    <div key={categoria.id ?? categoria.nome} className="category-card">
                      <span className="category-dot" style={{ background: categoria.cor || '#6366f1' }} />
                      <div>
                        <div className="category-name">{categoria.nome}</div>
                        <div className="category-type">{isReceita ? 'Entrada' : 'Despesa'}</div>
                      </div>
                      <div className="category-stats">
                        <div className="category-count">
                          {stat.count} registro{stat.count === 1 ? '' : 's'}
                        </div>
                        <div
                          className={`category-count ${isReceita ? 'value-positive' : 'value-negative'}`}
                          style={{ fontSize: 12 }}
                        >
                          {formatCurrency(stat.total)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
