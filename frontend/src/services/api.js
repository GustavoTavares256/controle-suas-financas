import axios from 'axios';
import { mockAdapter } from './mock/adapter';

export const USE_MOCKS = String(import.meta.env.VITE_USE_MOCKS ?? 'true').toLowerCase() === 'true';

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

if (USE_MOCKS) {
  api.defaults.adapter = mockAdapter;
}

export class ApiError extends Error {
  constructor(message, status = 0, details = null, fieldErrors = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
    this.fieldErrors = fieldErrors; // { campo: "mensagem" } para 400
  }
}

function extractErrorMessage(error) {
  const data = error.response?.data;
  if (data) {
    // RFC 7807 ProblemDetail / Spring Boot ProblemDetail
    if (data.detail) return data.detail;
    if (data.message) return data.message;
    if (typeof data === 'string' && data.trim()) return data;
    // 400 com field errors: { erros: { campo: "msg" } }
    if (data.erros && typeof data.erros === 'object') {
      const msgs = Object.entries(data.erros).map(([k, v]) => `${k}: ${v}`);
      return msgs.join('; ');
    }
    if (Array.isArray(data.errors) && data.errors.length) {
      return data.errors
        .map((e) => e.defaultMessage || e.message || String(e))
        .join('; ');
    }
  }
  if (error.code === 'ECONNABORTED') {
    return 'A requisição demorou demais. Verifique sua conexão e tente novamente.';
  }
  if (!error.response) {
    return 'Não foi possível conectar ao servidor. Verifique se a API está em execução.';
  }
  return `Erro inesperado (${error.response.status}). Tente novamente.`;
}

function extractFieldErrors(error) {
  const data = error.response?.data;
  if (data?.erros && typeof data.erros === 'object') {
    return data.erros;
  }
  return null;
}

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error instanceof ApiError) return Promise.reject(error);
    const message = extractErrorMessage(error);
    const fieldErrors = extractFieldErrors(error);
    return Promise.reject(
      new ApiError(message, error.response?.status ?? 0, error.response?.data ?? null, fieldErrors)
    );
  }
);

export async function request(config) {
  try {
    const response = await api.request(config);
    return response.data;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    const message = extractErrorMessage(error);
    const fieldErrors = extractFieldErrors(error);
    throw new ApiError(message, error.response?.status ?? 0, error.response?.data ?? null, fieldErrors);
  }
}

export default api;
