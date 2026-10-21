import { getProvider, TIPO, FORMA_PAGAMENTO, STATUS_PAGAMENTO } from '../../utils/constants';
import { isValidISODate, todayISO } from '../../utils/date';
import { chatCompletion, ProviderError } from './providers';
import { buildSystemPrompt } from './prompt';

export class AgentError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AgentError';
  }
}

function extractJson(raw) {
  if (!raw) return null;
  let text = String(raw).trim();
  text = text.replace(/^```(?:json)?/i, '').replace(/```$/i, '').trim();
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start === -1 || end === -1 || end < start) return null;
  try {
    return JSON.parse(text.slice(start, end + 1));
  } catch {
    return null;
  }
}

function toPositiveNumber(value) {
  const number = typeof value === 'number' ? value : Number(String(value).replace(',', '.'));
  if (!Number.isFinite(number) || number <= 0) return null;
  return Math.round(number * 100) / 100;
}

function toInteger(value, fallback) {
  const number = parseInt(value, 10);
  return Number.isFinite(number) && number >= 1 ? number : fallback;
}

function sanitizeProposta(raw) {
  if (!raw || typeof raw !== 'object') return null;
  const valor = toPositiveNumber(raw.valor);
  if (valor === null) return null;

  const tipo = raw.tipo === TIPO.RECEITA ? TIPO.RECEITA : TIPO.DESPESA;
  const data = isValidISODate(raw.data) ? raw.data : todayISO();
  const isDespesa = tipo === TIPO.DESPESA;

  const proposta = {
    descricao: String(raw.descricao || '').trim() || 'Movimentação',
    valor,
    tipo,
    categoria: String(raw.categoria || '').trim() || 'Outros',
    data,
    observacao: String(raw.observacao || '').trim(),
  };

  if (isDespesa) {
    const totalParcelas = toInteger(raw.totalParcelas, 1);
    proposta.local = String(raw.local || '').trim();
    proposta.formaPagamento =
      raw.formaPagamento === FORMA_PAGAMENTO.PARCELADO && totalParcelas > 1
        ? FORMA_PAGAMENTO.PARCELADO
        : FORMA_PAGAMENTO.A_VISTA;
    proposta.totalParcelas = proposta.formaPagamento === FORMA_PAGAMENTO.PARCELADO ? totalParcelas : 1;
    proposta.parcelaAtual = Math.min(toInteger(raw.parcelaAtual, 1), proposta.totalParcelas);
    proposta.statusPagamento =
      raw.statusPagamento === STATUS_PAGAMENTO.PENDENTE ? STATUS_PAGAMENTO.PENDENTE : STATUS_PAGAMENTO.PAGO;
  }

  return proposta;
}

export function parseAgentResponse(raw) {
  const parsed = extractJson(raw);
  if (!parsed || typeof parsed !== 'object') {
    throw new AgentError('O assistente retornou uma resposta inesperada. Tente reformular a mensagem.');
  }

  const mensagem = String(parsed.mensagem || '').trim() || 'Entendi. Confira a proposta abaixo.';
  const propostas = Array.isArray(parsed.propostas)
    ? parsed.propostas.map(sanitizeProposta).filter(Boolean)
    : [];

  return { mensagem, propostas };
}

/**
 * Envia a conversa ao provedor configurado e devolve { mensagem, propostas }.
 *
 * @param {object}   params
 * @param {object}   params.config      Configuração do assistente (provider, apiKey, model, baseUrl).
 * @param {Array}    params.messages    Histórico no formato [{ role: 'user'|'assistant', content }].
 * @param {Array}    params.categorias  Categorias conhecidas (para o prompt).
 * @param {AbortSignal} [params.signal]
 * @param {Function}  [params.onRetry]  Chamado a cada nova tentativa (attempt, erro).
 */
export async function runAgent({ config, messages, categorias = [], signal, onRetry }) {
  const apiKey = (config?.apiKey || '').trim();
  if (!apiKey) {
    throw new AgentError('Configure sua chave de API em Configurações para usar o assistente.');
  }

  const provider = getProvider(config?.provider);
  const model = (config?.model || '').trim() || provider.defaultModel;
  const system = buildSystemPrompt({ categorias });

  const chat = messages
    .filter((m) => m.role === 'user' || m.role === 'assistant')
    .map((m) => ({ role: m.role, content: m.content }));

  try {
    const raw = await chatCompletion({
      provider: provider.id,
      apiKey,
      model,
      baseUrl: config?.baseUrl,
      system,
      messages: chat,
      signal,
      onRetry,
    });
    return parseAgentResponse(raw);
  } catch (error) {
    if (error instanceof ProviderError) throw new AgentError(error.message);
    if (error instanceof AgentError) throw error;
    if (error?.name === 'AbortError') throw error;
    throw new AgentError('Ocorreu um erro ao falar com o assistente. Tente novamente.');
  }
}
