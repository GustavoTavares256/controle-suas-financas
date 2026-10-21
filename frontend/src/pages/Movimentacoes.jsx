import { useState, useCallback, useMemo } from 'react';
import { Plus, TrendingUp, TrendingDown, Scale } from 'lucide-react';
import { useToast } from '../components/ui/ToastContext';
import TransactionTable from '../components/transactions/TransactionTable';
import TransactionFilters from '../components/transactions/TransactionFilters';
import TransactionForm from '../components/transactions/TransactionForm';
import TransactionDetails from '../components/transactions/TransactionDetails';
import ConfirmDialog from '../components/transactions/ConfirmDialog';
import Pagination from '../components/ui/Pagination';
import EmptyState from '../components/ui/EmptyState';
import ErrorState from '../components/ui/ErrorState';
import LoadingBlock from '../components/ui/LoadingBlock';
import StatCard from '../components/dashboard/StatCard';
import useFetch from '../hooks/useFetch';
import {
  listMovimentacoes,
  createMovimentacao,
  updateMovimentacao,
  deleteMovimentacao,
} from '../services/movimentacoesService';
import { listCategorias } from '../services/categoriasService';
import { getResumoPeriodo } from '../services/dashboardService';
import { getPeriodRange } from '../utils/date';
import { formatCurrency } from '../utils/format';
import { TIPO } from '../utils/constants';

const PAGE_SIZE = 10;

const defaultFilters = {
  busca: '',
  periodo: 'todos',
  categoria: '',
  tipo: '',
  ordenacao: '-data',
};

const PAGE_META = {
  movimentacoes: {
    titulo: 'Movimentações',
    descricao: 'Gerencie suas entradas e despesas em um único lugar.',
  },
  receitas: {
    titulo: 'Entradas',
    descricao: 'Acompanhe todas as suas entradas financeiras.',
  },
  despesas: {
    titulo: 'Despesas',
    descricao: 'Acompanhe todas as suas saídas financeiras.',
  },
};

export default function Movimentacoes({ tipoFixo = null }) {
  const toast = useToast();
  const [filters, setFilters] = useState({
    ...defaultFilters,
    tipo: tipoFixo || '',
  });
  const [page, setPage] = useState(0);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [viewing, setViewing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [deletingLoading, setDeletingLoading] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  const { data: categorias = [] } = useFetch(listCategorias, []);

  const queryParams = useMemo(() => {
    const { dataInicio, dataFim } = getPeriodRange(filters.periodo);
    return {
      busca: filters.busca.trim() || undefined,
      tipo: filters.tipo || undefined,
      categoria: filters.categoria || undefined,
      dataInicio: dataInicio || undefined,
      dataFim: dataFim || undefined,
      ordenacao: filters.ordenacao,
      pagina: page,
      tamanho: PAGE_SIZE,
    };
  }, [filters, page]);

  const { data, loading, error, reload } = useFetch(
    () => listMovimentacoes(queryParams),
    [JSON.stringify(queryParams), reloadKey]
  );

  const { data: resumo, loading: resumoLoading } = useFetch(
    () => getResumoPeriodo(filters.periodo),
    [filters.periodo, reloadKey]
  );

  const reloadAll = useCallback(() => {
    setReloadKey((key) => key + 1);
  }, []);

  const movimentacoes = data?.content || [];

  function handleFiltersChange(nextFilters) {
    setFilters(nextFilters);
    setPage(0);
  }

  async function handleCreate(payload) {
    try {
      await createMovimentacao(payload);
      toast.success('Movimentação cadastrada com sucesso.');
      setPage(0);
      reloadAll();
    } catch (err) {
      toast.error(err.message || 'Não foi possível cadastrar a movimentação.');
      throw err;
    }
  }

  async function handleUpdate(payload) {
    try {
      await updateMovimentacao(editing.id, payload);
      toast.success('Movimentação atualizada com sucesso.');
      reloadAll();
    } catch (err) {
      toast.error(err.message || 'Não foi possível atualizar a movimentação.');
      throw err;
    }
  }

  async function handleDelete() {
    if (!deleting) return;
    setDeletingLoading(true);
    try {
      await deleteMovimentacao(deleting.id);
      toast.success('Movimentação excluída com sucesso.');
      setDeleting(null);
      reloadAll();
    } catch (err) {
      toast.error(err.message || 'Não foi possível excluir a movimentação.');
    } finally {
      setDeletingLoading(false);
    }
  }

  const configKey =
    tipoFixo === TIPO.RECEITA ? 'receitas' : tipoFixo === TIPO.DESPESA ? 'despesas' : 'movimentacoes';
  const meta = PAGE_META[configKey];

  return (
    <>
      <div className="page-header">
        <div>
          <h1>{meta.titulo}</h1>
          <p>{meta.descricao}</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={() => setFormOpen(true)}>
          <Plus size={16} />
          Nova movimentação
        </button>
      </div>

      <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <StatCard
          label="Entradas do período"
          value={resumo ? formatCurrency(resumo.receitas) : '—'}
          icon={TrendingUp}
          iconClass="receita"
          valueClass="value-positive"
          hint={resumoLoading ? 'Calculando…' : 'Total de entradas no período'}
        />
        <StatCard
          label="Despesas do período"
          value={resumo ? formatCurrency(resumo.despesas) : '—'}
          icon={TrendingDown}
          iconClass="despesa"
          valueClass="value-negative"
          hint={resumoLoading ? 'Calculando…' : 'Total de saídas no período'}
        />
        <StatCard
          label="Resultado do período"
          value={resumo ? formatCurrency(resumo.saldoPeriodo) : '—'}
          icon={Scale}
          iconClass="resultado"
          valueClass={resumo && resumo.saldoPeriodo >= 0 ? 'value-positive' : 'value-negative'}
          hint={resumoLoading ? 'Calculando…' : 'Entradas menos despesas no período'}
        />
      </div>

      <TransactionFilters
        filters={filters}
        onChange={handleFiltersChange}
        categorias={categorias}
        hideTipo={Boolean(tipoFixo)}
      />

      <div className="card">
        <div className="card-header" style={{ paddingBottom: 16 }}>
          <div>
            <h2>Registros</h2>
            <div className="card-subtitle">
              {data ? `${data.totalElements} movimentação(ões) encontrada(s)` : '…'}
            </div>
          </div>
        </div>

        {loading && !data && <LoadingBlock message="Carregando movimentações…" />}

        {error && <ErrorState error={error} onRetry={reload} />}

        {data && movimentacoes.length === 0 && (
          <EmptyState
            title="Nenhuma movimentação encontrada"
            description="Ajuste os filtros ou cadastre uma nova movimentação para começar."
            action={
              <button type="button" className="btn btn-primary btn-sm" onClick={() => setFormOpen(true)}>
                <Plus size={14} />
                Cadastrar movimentação
              </button>
            }
          />
        )}

        {data && movimentacoes.length > 0 && (
          <>
            <TransactionTable
              movimentacoes={movimentacoes}
              onView={setViewing}
              onEdit={(mov) => setEditing(mov)}
              onDelete={setDeleting}
            />
            <Pagination page={data} totalElements={data.totalElements} onPageChange={setPage} />
          </>
        )}
      </div>

      <TransactionForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleCreate}
        categorias={categorias}
        defaultTipo={tipoFixo || undefined}
      />

      <TransactionForm
        open={Boolean(editing)}
        onClose={() => setEditing(null)}
        onSubmit={handleUpdate}
        categorias={categorias}
        movimentacao={editing}
      />

      <TransactionDetails
        movimentacao={viewing}
        onClose={() => setViewing(null)}
        onEdit={(mov) => setEditing(mov)}
      />

      <ConfirmDialog
        open={Boolean(deleting)}
        title="Excluir movimentação"
        message={`Tem certeza que deseja excluir "${deleting?.descricao}"? Esta ação não pode ser desfeita.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
        loading={deletingLoading}
      />
    </>
  );
}
