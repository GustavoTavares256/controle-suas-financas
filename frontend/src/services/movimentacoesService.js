import { request } from './api';

/**
 * Contrato da API (Spring Boot):
 *   GET    /api/transacoes?tipo=&categoria=&inicio=&fim=&busca=&page=&size=&sort=
 *         → Spring Data Page<TransacaoResponse>: { content, totalElements, totalPages, number, size, ... }
 *   POST   /api/transacoes           → TransacaoResponse criada
 *   GET    /api/transacoes/{id}      → TransacaoResponse
 *   PUT    /api/transacoes/{id}      → TransacaoResponse atualizada
 *   DELETE /api/transacoes/{id}      → 204 No Content
 *
 * TransacaoResponse: { id, descricao, valor, tipo: "RECEITA"|"DESPESA", categoria, data: "YYYY-MM-DD", observacao }
 *
 * Mapeamento de parâmetros frontend → backend:
 *   dataInicio → inicio, dataFim → fim, pagina → page, tamanho → size
 *   ordenacao (ex: "-data" ou "valor,asc") → sort[] (ex: "data,desc" ou "valor,asc")
 *   busca → busca (novo no backend)
 */

function mapParamsToBackend(params = {}) {
  const { dataInicio, dataFim, pagina, tamanho, ordenacao, busca, ...rest } = params;
  const backendParams = { ...rest };

  if (dataInicio) backendParams.inicio = dataInicio;
  if (dataFim) backendParams.fim = dataFim;
  if (pagina !== undefined) backendParams.page = pagina;
  if (tamanho !== undefined) backendParams.size = tamanho;
  if (busca) backendParams.busca = busca;

  if (ordenacao) {
    // ordenacao formato: "-data" ou "valor" ou "data,desc" ou "-valor,asc"
    let field = ordenacao.replace(/^-/, '');
    let dir = ordenacao.startsWith('-') ? 'desc' : 'asc';
    if (ordenacao.includes(',')) {
      [field, dir] = ordenacao.split(',');
    }
    backendParams.sort = [`${field},${dir}`];
  }

  return backendParams;
}

export function listTransacoes(params = {}) {
  return request({ method: 'get', url: '/transacoes', params: mapParamsToBackend(params) });
}

export function getTransacao(id) {
  return request({ method: 'get', url: `/transacoes/${id}` });
}

export function createTransacao(payload) {
  return request({ method: 'post', url: '/transacoes', data: payload });
}

export function updateTransacao(id, payload) {
  return request({ method: 'put', url: `/transacoes/${id}`, data: payload });
}

export function deleteTransacao(id) {
  return request({ method: 'delete', url: `/transacoes/${id}` });
}

// Aliases para compatibilidade com código existente
export const listMovimentacoes = listTransacoes;
export const getMovimentacao = getTransacao;
export const createMovimentacao = createTransacao;
export const updateMovimentacao = updateTransacao;
export const deleteMovimentacao = deleteTransacao;
