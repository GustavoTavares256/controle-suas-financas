import {
  listStore,
  findById,
  createRecord,
  updateRecord,
  deleteRecord,
  MOCK_CATEGORIAS,
} from './mockData';

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function ok(data) {
  return {
    data,
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {},
  };
}

function fail(status, message) {
  const error = new Error(message);
  error.response = { status, data: { message }, headers: {}, config: {} };
  error.isAxiosError = true;
  return Promise.reject(error);
}

const SORTERS = {
  data: (a, b) => b.data.localeCompare(a.data) || b.id - a.id,
  '-data': (a, b) => a.data.localeCompare(b.data) || a.id - b.id,
  valor: (a, b) => a.valor - b.valor,
  '-valor': (a, b) => b.valor - a.valor,
};

function filterMovimentacoes(params = {}) {
  const { tipo, categoria, dataInicio, dataFim, busca, ordenacao } = params;

  let items = [...listStore()];

  if (tipo) items = items.filter((m) => m.tipo === tipo);
  if (categoria) items = items.filter((m) => m.categoria === categoria);
  if (dataInicio) items = items.filter((m) => m.data >= dataInicio);
  if (dataFim) items = items.filter((m) => m.data <= dataFim);
  if (busca) {
    const termo = busca.toLowerCase();
    items = items.filter((m) => m.descricao.toLowerCase().includes(termo));
  }

  const sorter = SORTERS[ordenacao] || SORTERS['-data'];
  items.sort(sorter);
  return items;
}

function paginate(items, page = 0, size = 10) {
  const totalElements = items.length;
  const totalPages = Math.ceil(totalElements / size) || 1;
  const number = Math.min(Math.max(Number(page), 0), totalPages - 1);
  const content = items.slice(number * size, number * size + size);
  return {
    content,
    totalElements,
    totalPages,
    number,
    size,
    first: number === 0,
    last: number >= totalPages - 1,
    empty: totalElements === 0,
  };
}

/**
 * Adaptador Axios que simula a API REST esperada do backend.
 * Contrato simulado (espelha o que se espera do Spring Boot):
 *   GET    /api/movimentacoes?tipo=&categoria=&dataInicio=&dataFim=&busca=&ordenacao=&pagina=&tamanho=
 *   POST   /api/movimentacoes
 *   GET    /api/movimentacoes/{id}
 *   PUT    /api/movimentacoes/{id}
 *   DELETE /api/movimentacoes/{id}
 *   GET    /api/categorias
 */
export async function mockAdapter(config) {
  await delay(250 + Math.random() * 250);

  const method = (config.method || 'get').toLowerCase();
  const url = (config.url || '').replace(/^\/api/, '');
  const params = config.params || {};
  const body = typeof config.data === 'string' ? JSON.parse(config.data) : config.data || {};

  const movimentacaoMatch = url.match(/^\/movimentacoes(?:\/(\d+))?$/);

  if (movimentacaoMatch) {
    const id = movimentacaoMatch[1];

    if (method === 'get' && !id) {
      const items = filterMovimentacoes(params);
      const page = params.pagina ?? 0;
      const size = params.tamanho ?? 10;
      return ok(paginate(items, page, size));
    }

    if (method === 'get' && id) {
      const found = findById(id);
      if (!found) return fail(404, 'Movimentação não encontrada.');
      return ok(found);
    }

    if (method === 'post' && !id) {
      if (!body.descricao || !body.valor || !body.tipo || !body.categoria || !body.data) {
        return fail(400, 'Dados inválidos. Preencha todos os campos obrigatórios.');
      }
      return ok(createRecord(body));
    }

    if (method === 'put' && id) {
      const updated = updateRecord(id, body);
      if (!updated) return fail(404, 'Movimentação não encontrada.');
      return ok(updated);
    }

    if (method === 'delete' && id) {
      if (!deleteRecord(id)) return fail(404, 'Movimentação não encontrada.');
      return ok({});
    }
  }

  if (url === '/categorias' && method === 'get') {
    return ok(MOCK_CATEGORIAS);
  }

  return fail(404, `Rota não encontrada: ${method.toUpperCase()} ${url}`);
}
