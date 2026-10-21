import { Link } from 'react-router-dom';
import { Moon, Sun, Sparkles, Layout, Globe, User, Bot, KeyRound, Cpu, ShieldAlert, ArrowUpRight } from 'lucide-react';
import { usePreferences } from '../components/ui/PreferencesContext';
import { useAiConfig } from '../components/ui/AiConfigContext';
import { API_URL } from '../services/api';
import { AI_PROVIDERS, getProvider } from '../utils/constants';

/**
 * Preferências visuais locais da interface (armazenadas no navegador).
 * Não há gerenciamento de conta, senha ou segurança — o backend atual
 * não possui autenticação nem endpoints de usuário.
 */
export default function Configuracoes() {
  const { prefs, updatePreferences } = usePreferences();
  const { config, updateConfig } = useAiConfig();
  const provider = getProvider(config.provider);

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Configurações</h1>
          <p>Preferências da interface e informações de conexão com a API.</p>
        </div>
      </div>

      <div className="card settings-section">
        <div className="card-header">
          <div>
            <h2>Perfil</h2>
            <div className="card-subtitle">Exibido na saudação do dashboard — salvo neste navegador</div>
          </div>
        </div>
        <div style={{ marginTop: 12 }}>
          <div className="settings-row">
            <div className="settings-info">
              <h3>
                <User size={14} style={{ verticalAlign: 'middle', marginRight: 6 }} />
                Seu nome
              </h3>
              <p>Usado apenas para personalizar a saudação. Opcional.</p>
            </div>
            <input
              className="input"
              style={{ maxWidth: 240 }}
              type="text"
              maxLength={40}
              placeholder="Ex.: Maria"
              value={prefs.nome}
              onChange={(event) => updatePreferences({ nome: event.target.value })}
              aria-label="Seu nome para a saudação"
            />
          </div>
        </div>
      </div>

      <div className="card settings-section">
        <div className="card-header">
          <div>
            <h2>Aparência</h2>
            <div className="card-subtitle">Preferências visuais armazenadas neste navegador</div>
          </div>
        </div>
        <div style={{ marginTop: 12 }}>
          <div className="settings-row">
            <div className="settings-info">
              <h3>
                {prefs.darkMode ? (
                  <Sun size={14} style={{ verticalAlign: 'middle', marginRight: 6 }} />
                ) : (
                  <Moon size={14} style={{ verticalAlign: 'middle', marginRight: 6 }} />
                )}
                Modo noturno
              </h3>
              <p>Tema escuro da interface.</p>
            </div>
            <button
              type="button"
              className={`toggle ${prefs.darkMode ? 'on' : ''}`}
              onClick={() => updatePreferences({ darkMode: !prefs.darkMode })}
              role="switch"
              aria-checked={prefs.darkMode}
              aria-label="Ativar modo noturno"
            />
          </div>
          <div className="settings-row">
            <div className="settings-info">
              <h3>
                <Layout size={14} style={{ verticalAlign: 'middle', marginRight: 6 }} />
                Modo compacto
              </h3>
              <p>Reduz o espaçamento entre os elementos das listagens.</p>
            </div>
            <button
              type="button"
              className={`toggle ${prefs.denseMode ? 'on' : ''}`}
              onClick={() => updatePreferences({ denseMode: !prefs.denseMode })}
              role="switch"
              aria-checked={prefs.denseMode}
              aria-label="Ativar modo compacto"
            />
          </div>
          <div className="settings-row">
            <div className="settings-info">
              <h3>
                <Sparkles size={14} style={{ verticalAlign: 'middle', marginRight: 6 }} />
                Animações nos gráficos
              </h3>
              <p>Exibe animações de entrada nos gráficos do dashboard.</p>
            </div>
            <button
              type="button"
              className={`toggle ${prefs.showChartAnimations ? 'on' : ''}`}
              onClick={() => updatePreferences({ showChartAnimations: !prefs.showChartAnimations })}
              role="switch"
              aria-checked={prefs.showChartAnimations}
              aria-label="Ativar animações nos gráficos"
            />
          </div>
        </div>
      </div>

      <div className="card settings-section">
        <div className="card-header">
          <div>
            <h2>Assistente de IA</h2>
            <div className="card-subtitle">
              Conecte um provedor para interpretar frases e lançar movimentações
            </div>
          </div>
          <Link to="/assistente" className="btn btn-secondary btn-sm">
            <Bot size={15} />
            Abrir assistente
            <ArrowUpRight size={14} />
          </Link>
        </div>
        <div style={{ marginTop: 12 }}>
          <div className="settings-row">
            <div className="settings-info">
              <h3>
                <Bot size={14} style={{ verticalAlign: 'middle', marginRight: 6 }} />
                Provedor
              </h3>
              <p>Serviço de IA usado para interpretar suas mensagens.</p>
            </div>
            <select
              className="select"
              style={{ maxWidth: 240 }}
              value={config.provider}
              onChange={(event) => updateConfig({ provider: event.target.value })}
              aria-label="Provedor de IA"
            >
              {AI_PROVIDERS.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
          <div className="settings-row">
            <div className="settings-info">
              <h3>
                <KeyRound size={14} style={{ verticalAlign: 'middle', marginRight: 6 }} />
                Chave de API
              </h3>
              <p>Salva somente neste navegador e enviada apenas ao provedor escolhido.</p>
            </div>
            <input
              className="input"
              style={{ maxWidth: 240 }}
              type="password"
              autoComplete="off"
              placeholder="Cole sua chave aqui"
              value={config.apiKey}
              onChange={(event) => updateConfig({ apiKey: event.target.value })}
              aria-label="Chave de API do provedor"
            />
          </div>
          <div className="settings-row">
            <div className="settings-info">
              <h3>
                <Cpu size={14} style={{ verticalAlign: 'middle', marginRight: 6 }} />
                Modelo
              </h3>
              <p>Opcional — deixe em branco para usar o padrão do provedor.</p>
            </div>
            <input
              className="input"
              style={{ maxWidth: 240 }}
              placeholder={`Padrão: ${provider.defaultModel}`}
              value={config.model}
              onChange={(event) => updateConfig({ model: event.target.value })}
              aria-label="Modelo de IA"
            />
          </div>
          <div className="settings-row">
            <div className="settings-info">
              <h3>
                <Globe size={14} style={{ verticalAlign: 'middle', marginRight: 6 }} />
                URL base (avançado)
              </h3>
              <p>Opcional — aponte para um proxy/gateway compatível com o provedor.</p>
            </div>
            <input
              className="input"
              style={{ maxWidth: 240 }}
              placeholder="Usar endereço padrão"
              value={config.baseUrl}
              onChange={(event) => updateConfig({ baseUrl: event.target.value })}
              aria-label="URL base do provedor de IA"
            />
          </div>
          <div className="assistente-warning">
            <ShieldAlert size={15} />
            <span>
              Por este app não ter backend, sua chave fica acessível no navegador. Use uma chave
              restrita e apenas para uso pessoal — nunca comite a chave no código.
            </span>
          </div>
        </div>
      </div>

      <div className="card settings-section">
        <div className="card-header">
          <div>
            <h2>Conexão com a API</h2>
            <div className="card-subtitle">Informações sobre a origem dos dados</div>
          </div>
        </div>
        <div style={{ marginTop: 12 }}>
          <div className="settings-row">
            <div className="settings-info">
              <h3>
                <Globe size={14} style={{ verticalAlign: 'middle', marginRight: 6 }} />
                URL da API
              </h3>
              <p>Configurada pela variável de ambiente VITE_API_URL.</p>
            </div>
            <code style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>{API_URL}</code>
          </div>
          <div className="settings-row">
            <div className="settings-info">
              <h3>Autenticação</h3>
              <p>
                O backend atual não possui autenticação. Nenhum dado de acesso é coletado ou
                armazenado por este frontend.
              </p>
            </div>
            <span className="badge badge-neutral">Não implementada</span>
          </div>
        </div>
      </div>
    </>
  );
}
