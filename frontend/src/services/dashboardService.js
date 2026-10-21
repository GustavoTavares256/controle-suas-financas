import { request } from './api';
import { getPeriodRange, getMonthLabel } from '../utils/date';

/**
 * Usa endpoint de agregação do backend: GET /api/dashboard/resumo
 * Retorno esperado:
 * {
 *   totalReceitas: number,
 *   totalDespesas: number,
 *   saldo: number,
 *   receitasPorCategoria: [{ categoria: string, total: number }, ...],
 *   despesasPorCategoria: [{ categoria: string, total: number }, ...]
 * }
 */

export async function getResumoPeriodo(periodId) {
  const { dataInicio, dataFim } = getPeriodRange(periodId);
  const params = new URLSearchParams();
  if (dataInicio) params.set('inicio', dataInicio);
  if (dataFim) params.set('fim', dataFim);

  const data = await request({ method: 'get', url: `/dashboard/resumo?${params.toString()}` });
  return {
    totalMovimentacoes: 0, // backend não retorna contagem total
    receitas: data.totalReceitas ?? 0,
    despesas: data.totalDespesas ?? 0,
    saldoPeriodo: data.saldo ?? 0,
  };
}

export async function getSaldoTotal() {
  const data = await request({ method: 'get', url: '/dashboard/resumo' });
  return data.saldo ?? 0;
}

export async function getSerieMensal(months = 6) {
  // O backend não expõe série mensal ainda; calculamos no frontend
  // como fallback, buscamos todas as transações dos últimos N meses
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() - (months - 1), 1);
  const params = new URLSearchParams();
  params.set('inicio', `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, '0')}-01`);
  params.set('page', '0');
  params.set('size', '10000');
  params.set('sort', 'data,desc');

  const page = await request({ method: 'get', url: `/transacoes?${params.toString()}` });
  const movimentacoes = page.content || [];

  const buckets = new Map();

  for (let i = 0; i < months; i += 1) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    buckets.set(key, { mes: key, mesLabel: getMonthLabel(`${key}-01`), receitas: 0, despesas: 0 });
  }

  for (const m of movimentacoes) {
    const key = String(m.data).slice(0, 7);
    const bucket = buckets.get(key);
    if (!bucket) continue;
    const valor = Number(m.valor) || 0;
    if (m.tipo === 'RECEITA') bucket.receitas += valor;
    else if (m.tipo === 'DESPESA') bucket.despesas += valor;
  }

  return Array.from(buckets.values()).reverse();
}

export async function getDespesasPorCategoria(periodId) {
  const { dataInicio, dataFim } = getPeriodRange(periodId);
  const params = new URLSearchParams();
  if (dataInicio) params.set('inicio', dataInicio);
  if (dataFim) params.set('fim', dataFim);

  const data = await request({ method: 'get', url: `/dashboard/resumo?${params.toString()}` });
  return (data.despesasPorCategoria || []).map((item) => ({
    name: item.categoria,
    value: Number(item.total.toFixed(2)),
  })).sort((a, b) => b.value - a.value);
}

export async function getReceitasPorCategoria(periodId) {
  const { dataInicio, dataFim } = getPeriodRange(periodId);
  const params = new URLSearchParams();
  if (dataInicio) params.set('inicio', dataInicio);
  if (dataFim) params.set('fim', dataFim);

  const data = await request({ method: 'get', url: `/dashboard/resumo?${params.toString()}` });
  return (data.receitasPorCategoria || []).map((item) => ({
    name: item.categoria,
    value: Number(item.total.toFixed(2)),
  })).sort((a, b) => b.value - a.value);
}

export async function getMovimentacoesRecentes(limit = 6) {
  const params = new URLSearchParams();
  params.set('page', '0');
  params.set('size', String(limit));
  params.set('sort', 'data,desc');

  const page = await request({ method: 'get', url: `/transacoes?${params.toString()}` });
  return page.content || [];
}
