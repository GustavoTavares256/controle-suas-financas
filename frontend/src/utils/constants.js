export const TIPO = {
  RECEITA: 'RECEITA',
  DESPESA: 'DESPESA',
};

export const TIPO_LABELS = {
  RECEITA: 'Entrada',
  DESPESA: 'Despesa',
};

export const FORMA_PAGAMENTO = {
  A_VISTA: 'A_VISTA',
  PARCELADO: 'PARCELADO',
};

export const FORMA_PAGAMENTO_LABELS = {
  A_VISTA: 'À vista',
  PARCELADO: 'Parcelado',
};

export const STATUS_PAGAMENTO = {
  PAGO: 'PAGO',
  PENDENTE: 'PENDENTE',
};

export const STATUS_PAGAMENTO_LABELS = {
  PAGO: 'Pago',
  PENDENTE: 'Pendente (dívida)',
};

export const PERIODOS = [
  { id: 'mes_atual', label: 'Este mês' },
  { id: 'mes_passado', label: 'Mês passado' },
  { id: 'ultimos_30_dias', label: '30 dias' },
  { id: 'ultimos_90_dias', label: '90 dias' },
  { id: 'ano_atual', label: 'Este ano' },
  { id: 'todos', label: 'Tudo' },
];

export const CORES_CATEGORIAS = [
  '#6366f1',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#0ea5e9',
  '#8b5cf6',
  '#14b8a6',
  '#f97316',
  '#64748b',
  '#ec4899',
  '#84cc16',
  '#06b6d4',
];

export const STORAGE_KEYS = {
  PREFERENCIAS: 'csf:preferencias',
  AI_CONVERSA: 'csf:ai:conversa',
  AI_CONFIG: 'csf:ai:config',
};

export const AI_PROVIDERS = [
  { id: 'openai', label: 'OpenAI (ChatGPT)', defaultModel: 'gpt-4o-mini' },
  { id: 'gemini', label: 'Google Gemini', defaultModel: 'gemini-3.8-flash' },
];

export function getProvider(id) {
  return AI_PROVIDERS.find((p) => p.id === id) || AI_PROVIDERS[0];
}
