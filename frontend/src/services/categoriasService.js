import { request } from './api';

/**
 * Contrato da API (Spring Boot):
 *   GET    /api/categorias          → List<CategoriaResponse>
 *   POST   /api/categorias          → CategoriaResponse criada
 *   GET    /api/categorias/{id}     → CategoriaResponse
 *   PUT    /api/categorias/{id}     → CategoriaResponse atualizada
 *   DELETE /api/categorias/{id}     → 204 No Content
 *
 * CategoriaResponse: { id, nome, tipo: "RECEITA"|"DESPESA", cor }
 */

export function listCategorias() {
  return request({ method: 'get', url: '/categorias' });
}

export function getCategoria(id) {
  return request({ method: 'get', url: `/categorias/${id}` });
}

export function createCategoria(payload) {
  return request({ method: 'post', url: '/categorias', data: payload });
}

export function updateCategoria(id, payload) {
  return request({ method: 'put', url: `/categorias/${id}`, data: payload });
}

export function deleteCategoria(id) {
  return request({ method: 'delete', url: `/categorias/${id}` });
}
