import { TIPO, CORES_CATEGORIAS } from '../../utils/constants';

/**
 * Categorias simuladas — a API real deve fornecer esta lista via GET /api/categorias.
 * Edite esta lista para refletir as categorias que o backend expuser.
 */
export const MOCK_CATEGORIAS = [
  { id: 1, nome: 'Salário', tipo: TIPO.RECEITA, cor: CORES_CATEGORIAS[1] },
  { id: 2, nome: 'Freelance', tipo: TIPO.RECEITA, cor: CORES_CATEGORIAS[2] },
  { id: 3, nome: 'Investimentos', tipo: TIPO.RECEITA, cor: CORES_CATEGORIAS[3] },
  { id: 4, nome: 'Outras entradas', tipo: TIPO.RECEITA, cor: CORES_CATEGORIAS[9] },
  { id: 5, nome: 'Moradia', tipo: TIPO.DESPESA, cor: CORES_CATEGORIAS[4] },
  { id: 6, nome: 'Alimentação', tipo: TIPO.DESPESA, cor: CORES_CATEGORIAS[5] },
  { id: 7, nome: 'Transporte', tipo: TIPO.DESPESA, cor: CORES_CATEGORIAS[6] },
  { id: 8, nome: 'Saúde', tipo: TIPO.DESPESA, cor: CORES_CATEGORIAS[10] },
  { id: 9, nome: 'Educação', tipo: TIPO.DESPESA, cor: CORES_CATEGORIAS[11] },
  { id: 10, nome: 'Lazer', tipo: TIPO.DESPESA, cor: CORES_CATEGORIAS[7] },
  { id: 11, nome: 'Assinaturas', tipo: TIPO.DESPESA, cor: CORES_CATEGORIAS[8] },
  { id: 12, nome: 'Outras despesas', tipo: TIPO.DESPESA, cor: CORES_CATEGORIAS[0] },
];

/**
 * Store de movimentações — INICIALMENTE VAZIA.
 * Em modo local (sem backend), os registros criados pela interface são persistidos
 * no localStorage do navegador para sobreviverem ao recarregamento.
 */
const STORAGE_KEY = 'csf:mock-movimentacoes';

function loadStore() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function persist() {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    /* armazenamento indisponível — ignora */
  }
}

let store = loadStore();
let nextId = store.reduce((max, m) => Math.max(max, Number(m.id) || 0), 0) + 1;

export function resetStore() {
  store = [];
  nextId = 1;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignora */
  }
}

export function listStore() {
  return store;
}

export function findById(id) {
  return store.find((m) => m.id === Number(id)) || null;
}

export function createRecord(payload) {
  const record = {
    id: nextId++,
    descricao: payload.descricao.trim(),
    valor: Number(payload.valor),
    tipo: payload.tipo,
    categoria: payload.categoria,
    data: payload.data,
    observacao: payload.observacao || '',
    local: payload.local || '',
    formaPagamento: payload.formaPagamento || null,
    totalParcelas: payload.totalParcelas ?? null,
    parcelaAtual: payload.parcelaAtual ?? null,
    statusPagamento: payload.statusPagamento || null,
  };
  store = [record, ...store];
  persist();
  return record;
}

export function updateRecord(id, payload) {
  const index = store.findIndex((m) => m.id === Number(id));
  if (index === -1) return null;
  const updated = {
    ...store[index],
    descricao: payload.descricao.trim(),
    valor: Number(payload.valor),
    tipo: payload.tipo,
    categoria: payload.categoria,
    data: payload.data,
    observacao: payload.observacao || '',
    local: payload.local || '',
    formaPagamento: payload.formaPagamento || null,
    totalParcelas: payload.totalParcelas ?? null,
    parcelaAtual: payload.parcelaAtual ?? null,
    statusPagamento: payload.statusPagamento || null,
  };
  store = store.map((m) => (m.id === Number(id) ? updated : m));
  persist();
  return updated;
}

export function deleteRecord(id) {
  const exists = store.some((m) => m.id === Number(id));
  if (!exists) return false;
  store = store.filter((m) => m.id !== Number(id));
  persist();
  return true;
}
