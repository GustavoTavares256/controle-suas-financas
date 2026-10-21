/**
 * Chamadas de baixo nível aos provedores de IA. Cada função recebe uma
 * conversa normalizada ({ role: 'user'|'assistant', content }) e devolve o
 * texto bruto da resposta.
 *
 * Aviso de segurança: por ser um frontend sem backend, a chave de API é
 * usada diretamente no navegador (armazenada apenas no seu localStorage).
 * Use uma chave restrita/apenas para uso pessoal e nunca a comite no código.
 */

export class ProviderError extends Error {
  constructor(message, status = 0, retryable = false) {
    super(message);
    this.name = 'ProviderError';
    this.status = status;
    this.retryable = retryable;
  }
}

const TRANSIENT_STATUS = [408, 429, 500, 502, 503, 504];

function looksTransient(message) {
  return /high demand|overload|temporar|try again|unavailable|capacity|rate limit|resource.?exhausted/i.test(
    message || ''
  );
}

async function readError(response) {
  let detail = '';
  try {
    const data = await response.json();
    detail = data?.error?.message || data?.message || data?.error?.status || '';
    if (!detail && data?.error) detail = String(data.error);
  } catch {
    /* corpo não-JSON — ignora */
  }
  return { status: response.status, detail: detail && detail !== 'undefined' ? detail : '' };
}

function buildFriendlyMessage({ status, detail }) {
  if (status === 401 || status === 403) {
    return 'Chave de API inválida ou sem permissão. Verifique em Configurações.';
  }
  if (status === 404) {
    return 'O modelo informado não está disponível para a sua conta. Escolha outro modelo em Configurações.';
  }
  if (status === 429) {
    return 'Limite de uso do provedor atingido. Aguarde alguns instantes e tente novamente.';
  }
  if (status === 503 || looksTransient(detail)) {
    return 'O provedor está com alta demanda neste momento. Tente novamente em alguns instantes ou escolha outro modelo em Configurações.';
  }
  if (status >= 500) {
    return 'O provedor apresentou uma instabilidade temporária. Tente novamente.';
  }
  return detail
    ? `O provedor retornou um erro: ${detail}`
    : `O provedor retornou um erro (${status}). Tente novamente.`;
}

function isRetryable(status, detail) {
  return TRANSIENT_STATUS.includes(status) || looksTransient(detail);
}

function normalizeBaseUrl(baseUrl, fallback) {
  const value = (baseUrl || '').trim();
  if (!value) return fallback;
  return value.replace(/\/+$/, '');
}

async function callOpenAI({ apiKey, model, baseUrl, system, messages, signal }) {
  const url = `${normalizeBaseUrl(baseUrl, 'https://api.openai.com/v1')}/chat/completions`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      response_format: { type: 'json_object' },
      messages: [{ role: 'system', content: system }, ...messages],
    }),
    signal,
  });

  if (!response.ok) {
    const info = await readError(response);
    throw new ProviderError(buildFriendlyMessage(info), info.status, isRetryable(info.status, info.detail));
  }

  const data = await response.json();
  return data?.choices?.[0]?.message?.content || '';
}

async function callGemini({ apiKey, model, baseUrl, system, messages, signal }) {
  const base = normalizeBaseUrl(baseUrl, 'https://generativelanguage.googleapis.com/v1beta');
  const url = `${base}/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;
  const contents = messages.map((message) => ({
    role: message.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: message.content }],
  }));

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents,
      systemInstruction: { parts: [{ text: system }] },
      generationConfig: { temperature: 0.2, responseMimeType: 'application/json' },
    }),
    signal,
  });

  if (!response.ok) {
    const info = await readError(response);
    throw new ProviderError(buildFriendlyMessage(info), info.status, isRetryable(info.status, info.detail));
  }

  const data = await response.json();
  const candidate = data?.candidates?.[0];
  const parts = candidate?.content?.parts || [];
  return parts.map((part) => part.text || '').join('');
}

function delay(ms, signal) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(Object.assign(new Error('Abortado'), { name: 'AbortError' }));
      return;
    }
    const timer = setTimeout(resolve, ms);
    signal?.addEventListener(
      'abort',
      () => {
        clearTimeout(timer);
        reject(Object.assign(new Error('Abortado'), { name: 'AbortError' }));
      },
      { once: true }
    );
  });
}

export async function chatCompletion(params) {
  const { provider, signal, onRetry, retries = 3 } = params;
  const call = provider === 'gemini' ? callGemini : callOpenAI;
  let lastError;

  for (let attempt = 1; attempt <= retries; attempt += 1) {
    try {
      return await call(params);
    } catch (error) {
      if (error?.name === 'AbortError') throw error;

      const providerError =
        error instanceof ProviderError
          ? error
          : new ProviderError(
              'Não foi possível conectar ao provedor de IA. Verifique sua internet e se o provedor permite chamadas a partir do navegador (CORS).',
              0,
              true
            );

      lastError = providerError;

      if (providerError.retryable && attempt < retries) {
        if (onRetry) onRetry(attempt, providerError);
        // eslint-disable-next-line no-await-in-loop
        await delay(attempt * 1500, signal);
        continue;
      }
      break;
    }
  }

  throw lastError;
}
