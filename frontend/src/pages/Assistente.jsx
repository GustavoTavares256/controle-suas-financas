import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Bot,
  Send,
  Loader2,
  Trash2,
  Settings,
  Check,
  X,
  Sparkles,
  ShieldAlert,
  RotateCw,
} from 'lucide-react';
import useLocalStorage from '../hooks/useLocalStorage';
import useFetch from '../hooks/useFetch';
import { listCategorias } from '../services/categoriasService';
import { createMovimentacao } from '../services/movimentacoesService';
import { runAgent } from '../services/ai/agentService';
import { useAiConfig } from '../components/ui/AiConfigContext';
import { useToast } from '../components/ui/ToastContext';
import TypeBadge from '../components/transactions/TypeBadge';
import {
  STORAGE_KEYS,
  TIPO,
  FORMA_PAGAMENTO,
  FORMA_PAGAMENTO_LABELS,
  STATUS_PAGAMENTO,
} from '../utils/constants';
import { formatCurrency } from '../utils/format';
import { formatDate } from '../utils/date';

const EXEMPLOS = [
  'Gastei 50 reais no almoço hoje',
  'Recebi 3200 de salário',
  'Comprei uma TV de 2000 em 10x no cartão',
  'Paguei 120 de internet ontem',
];

let idCounter = 0;
function uid() {
  idCounter += 1;
  return `${Date.now()}-${idCounter}`;
}

function propostaToPayload(proposta) {
  const payload = {
    descricao: proposta.descricao,
    valor: proposta.valor,
    tipo: proposta.tipo,
    categoria: proposta.categoria,
    data: proposta.data,
    observacao: proposta.observacao || '',
  };

  if (proposta.tipo === TIPO.DESPESA) {
    payload.local = proposta.local || '';
    payload.formaPagamento = proposta.formaPagamento;
    payload.totalParcelas = proposta.totalParcelas;
    payload.parcelaAtual = proposta.parcelaAtual;
    payload.statusPagamento = proposta.statusPagamento;
  }

  return payload;
}

function PropostaCard({ proposta, onConfirm, onDiscard }) {
  const isDespesa = proposta.tipo === TIPO.DESPESA;
  const pendente = proposta._status === 'pendente';
  const lancando = proposta._status === 'lancando';

  return (
    <div className={`proposta-card ${proposta._status}`}>
      <div className="proposta-head">
        <TypeBadge tipo={proposta.tipo} />
        <span className="proposta-valor">{formatCurrency(proposta.valor)}</span>
      </div>

      <div className="proposta-desc">{proposta.descricao}</div>

      <div className="proposta-meta">
        <span>{proposta.categoria}</span>
        <span>{formatDate(proposta.data)}</span>
        {isDespesa && proposta.local && <span>{proposta.local}</span>}
        {isDespesa && proposta.formaPagamento === FORMA_PAGAMENTO.PARCELADO && (
          <span>
            {proposta.parcelaAtual}/{proposta.totalParcelas}x ·{' '}
            {FORMA_PAGAMENTO_LABELS[proposta.formaPagamento]}
          </span>
        )}
        {isDespesa && proposta.statusPagamento === STATUS_PAGAMENTO.PENDENTE && (
          <span className="badge-divida">Dívida</span>
        )}
      </div>

      {(pendente || lancando) && (
        <div className="proposta-actions">
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={onConfirm}
            disabled={lancando}
          >
            {lancando ? <Loader2 size={14} className="spin" /> : <Check size={14} />}
            Confirmar e lançar
          </button>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={onDiscard}
            disabled={lancando}
          >
            <X size={14} />
            Descartar
          </button>
        </div>
      )}

      {proposta._status === 'lancada' && (
        <div className="proposta-status ok">
          <Check size={14} /> Lançada nas suas movimentações
        </div>
      )}

      {proposta._status === 'descartada' && (
        <div className="proposta-status muted">
          <X size={14} /> Proposta descartada
        </div>
      )}
    </div>
  );
}

export default function Assistente() {
  const [messages, setMessages] = useLocalStorage(STORAGE_KEYS.AI_CONVERSA, []);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const abortRef = useRef(null);
  const scrollRef = useRef(null);
  const { config, configured } = useAiConfig();
  const toast = useToast();
  const { data: categorias } = useFetch(listCategorias, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, loading]);

  function updateProposta(messageId, index, patch) {
    setMessages((current) =>
      current.map((message) => {
        if (message.id !== messageId || !message.propostas) return message;
        return {
          ...message,
          propostas: message.propostas.map((p, i) => (i === index ? { ...p, ...patch } : p)),
        };
      })
    );
  }

  async function requestAgent(history) {
    setLoading(true);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const { mensagem, propostas } = await runAgent({
        config,
        messages: history.map((m) => ({ role: m.role, content: m.content })),
        categorias: categorias || [],
        signal: controller.signal,
        onRetry: (attempt) => {
          if (attempt === 1) {
            toast.info('O provedor está com alta demanda — tentando novamente…');
          }
        },
      });

      const assistantMessage = {
        id: uid(),
        role: 'assistant',
        content: mensagem,
        propostas: propostas.map((p) => ({ ...p, _status: 'pendente' })),
        createdAt: Date.now(),
      };
      setMessages((current) => [...current, assistantMessage]);
    } catch (error) {
      if (error?.name !== 'AbortError') {
        setMessages((current) => [
          ...current,
          {
            id: uid(),
            role: 'assistant',
            content: error.message || 'Não foi possível falar com o assistente.',
            error: true,
            createdAt: Date.now(),
          },
        ]);
      }
    } finally {
      setLoading(false);
      abortRef.current = null;
    }
  }

  async function sendMessage(text) {
    const content = text.trim();
    if (!content || loading) return;

    const userMessage = { id: uid(), role: 'user', content, createdAt: Date.now() };
    const history = [...messages, userMessage];
    setMessages(history);
    setInput('');
    await requestAgent(history);
  }

  async function retryMessage(messageId) {
    if (loading) return;
    const index = messages.findIndex((m) => m.id === messageId);
    if (index < 1) return;
    const history = messages.slice(0, index);
    setMessages(history);
    await requestAgent(history);
  }

  function handleKeyDown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage(input);
    }
  }

  async function confirmProposta(messageId, index) {
    const message = messages.find((m) => m.id === messageId);
    const proposta = message?.propostas?.[index];
    if (!proposta || proposta._status !== 'pendente') return;

    updateProposta(messageId, index, { _status: 'lancando' });
    try {
      const created = await createMovimentacao(propostaToPayload(proposta));
      updateProposta(messageId, index, { _status: 'lancada', _criadoId: created?.id });
      toast.success('Movimentação lançada com sucesso!');
    } catch (error) {
      updateProposta(messageId, index, { _status: 'pendente' });
      toast.error(error.message || 'Não foi possível lançar a movimentação.');
    }
  }

  async function confirmTodas(messageId) {
    const message = messages.find((m) => m.id === messageId);
    const pendentes = (message?.propostas || [])
      .map((p, index) => ({ p, index }))
      .filter(({ p }) => p._status === 'pendente');
    for (const { index } of pendentes) {
      // eslint-disable-next-line no-await-in-loop
      await confirmProposta(messageId, index);
    }
  }

  function discardProposta(messageId, index) {
    updateProposta(messageId, index, { _status: 'descartada' });
  }

  function clearHistory() {
    if (messages.length === 0) return;
    if (window.confirm('Apagar todo o histórico da conversa?')) {
      setMessages([]);
    }
  }

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Assistente IA</h1>
          <p>
            Descreva seus gastos e recebimentos em linguagem natural. O assistente interpreta,
            calcula e propõe o lançamento — você confirma antes de salvar.
          </p>
        </div>
        {messages.length > 0 && (
          <button type="button" className="btn btn-secondary" onClick={clearHistory}>
            <Trash2 size={16} />
            Limpar conversa
          </button>
        )}
      </div>

      {!configured && (
        <div className="card assistente-setup">
          <div className="state-icon">
            <ShieldAlert size={24} />
          </div>
          <h3>Conecte um provedor de IA</h3>
          <p>
            Para o assistente funcionar, informe sua chave de API e escolha o provedor (OpenAI ou
            Google Gemini) em Configurações. A chave fica salva apenas neste navegador — nunca é
            enviada para nossos servidores.
          </p>
          <Link to="/configuracoes" className="btn btn-primary">
            <Settings size={16} />
            Ir para Configurações
          </Link>
        </div>
      )}

      {configured && (
        <div className="card chat-card">
          <div className="chat-window" ref={scrollRef}>
            {messages.length === 0 && !loading && (
              <div className="chat-welcome">
                <div className="state-icon">
                  <Sparkles size={24} />
                </div>
                <h3>Como posso ajudar?</h3>
                <p>Escreva uma frase como “Gastei 50 reais no almoço hoje” e eu monto o lançamento.</p>
                <div className="chat-exemplos">
                  {EXEMPLOS.map((exemplo) => (
                    <button
                      key={exemplo}
                      type="button"
                      className="chat-exemplo"
                      onClick={() => sendMessage(exemplo)}
                    >
                      {exemplo}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((message) => (
              <div key={message.id} className={`chat-message ${message.role}`}>
                {message.role === 'assistant' && (
                  <div className="chat-avatar">
                    <Bot size={16} />
                  </div>
                )}
                <div className="chat-bubble-wrap">
                  <div className={`chat-bubble ${message.error ? 'error' : ''}`}>{message.content}</div>
                  {message.error && (
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => retryMessage(message.id)}
                      disabled={loading}
                    >
                      <RotateCw size={14} />
                      Tentar novamente
                    </button>
                  )}
                  {message.propostas?.length > 0 && (
                    <div className="chat-propostas">
                      {message.propostas.length > 1 &&
                        message.propostas.some((p) => p._status === 'pendente') && (
                          <button
                            type="button"
                            className="btn btn-primary btn-sm"
                            onClick={() => confirmTodas(message.id)}
                          >
                            <Check size={14} />
                            Confirmar todas ({message.propostas.filter((p) => p._status === 'pendente').length})
                          </button>
                        )}
                      {message.propostas.map((proposta, index) => (
                        <PropostaCard
                          key={`${message.id}-${index}`}
                          proposta={proposta}
                          onConfirm={() => confirmProposta(message.id, index)}
                          onDiscard={() => discardProposta(message.id, index)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="chat-message assistant">
                <div className="chat-avatar">
                  <Bot size={16} />
                </div>
                <div className="chat-bubble typing">
                  <Loader2 size={15} className="spin" />
                  Pensando…
                </div>
              </div>
            )}
          </div>

          <div className="chat-input-bar">
            <textarea
              className="chat-input"
              rows={1}
              placeholder="Ex.: Gastei 50 reais no almoço hoje"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
              aria-label="Mensagem para o assistente"
            />
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => sendMessage(input)}
              disabled={loading || !input.trim()}
              aria-label="Enviar mensagem"
            >
              {loading ? <Loader2 size={16} className="spin" /> : <Send size={16} />}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
