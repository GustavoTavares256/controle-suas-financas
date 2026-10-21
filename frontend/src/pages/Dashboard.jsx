import { useMemo, useState } from 'react';
import { Wallet, TrendingUp, TrendingDown, Activity, Plus } from 'lucide-react';
import { useToast } from '../components/ui/ToastContext';
import { usePreferences } from '../components/ui/PreferencesContext';
import StatCard from '../components/dashboard/StatCard';
import PeriodSelector from '../components/dashboard/PeriodSelector';
import RevenueExpenseChart from '../components/dashboard/RevenueExpenseChart';
import CategoryChart from '../components/dashboard/CategoryChart';
import RecentTransactions from '../components/dashboard/RecentTransactions';
import Shortcuts from '../components/dashboard/Shortcuts';
import TransactionForm from '../components/transactions/TransactionForm';
import LoadingBlock from '../components/ui/LoadingBlock';
import ErrorState from '../components/ui/ErrorState';
import useFetch from '../hooks/useFetch';
import {
  getResumoPeriodo,
  getSaldoTotal,
  getSerieMensal,
  getDespesasPorCategoria,
  getMovimentacoesRecentes,
} from '../services/dashboardService';
import { createMovimentacao } from '../services/movimentacoesService';
import { listCategorias } from '../services/categoriasService';
import { formatCurrency } from '../utils/format';

export default function Dashboard() {
  const toast = useToast();
  const { prefs } = usePreferences();
  const [periodo, setPeriodo] = useState('mes_atual');
  const [formOpen, setFormOpen] = useState(false);

  const { data: categorias = [] } = useFetch(listCategorias, []);

  const {
    data: dashboardData,
    loading,
    error,
    reload,
  } = useFetch(
    async () => {
      const [resumo, saldo, serie, categoriasDespesa, recentes] = await Promise.all([
        getResumoPeriodo(periodo),
        getSaldoTotal(),
        getSerieMensal(6),
        getDespesasPorCategoria(periodo),
        getMovimentacoesRecentes(6),
      ]);
      return { resumo, saldo, serie, categoriasDespesa, recentes };
    },
    [periodo]
  );

  const saudacao = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  }, []);

  async function handleCreate(payload) {
    try {
      await createMovimentacao(payload);
      toast.success('Movimentação cadastrada com sucesso.');
      reload();
    } catch (err) {
      toast.error(err.message || 'Não foi possível cadastrar a movimentação.');
      throw err;
    }
  }

  return (
    <>
      <div className="page-header">
        <div>
          <h1>
            {saudacao}
            {prefs.nome ? `, ${prefs.nome}` : ''}
          </h1>
          <p>Acompanhe o panorama das suas finanças em um só lugar.</p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <PeriodSelector value={periodo} onChange={setPeriodo} />
          <button type="button" className="btn btn-primary" onClick={() => setFormOpen(true)}>
            <Plus size={16} />
            Nova movimentação
          </button>
        </div>
      </div>

      {loading && !dashboardData && <LoadingBlock message="Carregando seu resumo financeiro…" />}

      {error && <ErrorState error={error} onRetry={reload} />}

      {dashboardData && (
        <>
          <div className="stat-grid">
            <StatCard
              label="Saldo total"
              value={formatCurrency(dashboardData.saldo)}
              icon={Wallet}
              iconClass="saldo"
              valueClass={dashboardData.saldo >= 0 ? 'value-positive' : 'value-negative'}
              hint="Soma de todas as entradas e despesas"
            />
            <StatCard
              label="Entradas do período"
              value={formatCurrency(dashboardData.resumo.receitas)}
              icon={TrendingUp}
              iconClass="receita"
              valueClass="value-positive"
              hint={`${dashboardData.resumo.totalMovimentacoes} movimentações no período`}
            />
            <StatCard
              label="Despesas do período"
              value={formatCurrency(dashboardData.resumo.despesas)}
              icon={TrendingDown}
              iconClass="despesa"
              valueClass="value-negative"
              hint="Total de saídas no período selecionado"
            />
            <StatCard
              label="Resultado do período"
              value={formatCurrency(dashboardData.resumo.saldoPeriodo)}
              icon={Activity}
              iconClass="resultado"
              valueClass={dashboardData.resumo.saldoPeriodo >= 0 ? 'value-positive' : 'value-negative'}
              hint={
                dashboardData.resumo.saldoPeriodo >= 0
                  ? 'No período, suas entradas superaram as despesas'
                  : 'No período, suas despesas superaram as entradas'
              }
            />
          </div>

          <Shortcuts onNovaMovimentacao={() => setFormOpen(true)} />

          <div className="dashboard-grid">
            <div className="card chart-card">
              <div className="card-header">
                <div>
                  <h2>Entradas × Despesas</h2>
                  <div className="card-subtitle">Evolução dos últimos 6 meses</div>
                </div>
              </div>
              <div className="card-body">
                <RevenueExpenseChart data={dashboardData.serie} animations={prefs.showChartAnimations} />
              </div>
            </div>

            <div className="card chart-card">
              <div className="card-header">
                <div>
                  <h2>Despesas por categoria</h2>
                  <div className="card-subtitle">Distribuição no período selecionado</div>
                </div>
              </div>
              <div className="card-body">
                {dashboardData.categoriasDespesa.length > 0 ? (
                  <CategoryChart data={dashboardData.categoriasDespesa} animations={prefs.showChartAnimations} />
                ) : (
                  <div
                    style={{
                      height: '100%',
                      display: 'grid',
                      placeItems: 'center',
                      color: 'var(--text-muted)',
                      fontSize: 13,
                    }}
                  >
                    Nenhuma despesa no período selecionado.
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <div>
                <h2>Movimentações recentes</h2>
                <div className="card-subtitle">Últimos registros adicionados</div>
              </div>
            </div>
            <div style={{ marginTop: 12 }}>
              <RecentTransactions movimentacoes={dashboardData.recentes} loading={loading} />
            </div>
          </div>
        </>
      )}

      <TransactionForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleCreate}
        categorias={categorias}
      />
    </>
  );
}
