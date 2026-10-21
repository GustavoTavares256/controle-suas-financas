import { createContext, useContext } from 'react';
import useLocalStorage from '../../hooks/useLocalStorage';
import { STORAGE_KEYS } from '../../utils/constants';

export const DEFAULT_AI_CONFIG = {
  provider: 'openai',
  apiKey: '',
  model: '',
  baseUrl: '',
};

const AiConfigContext = createContext(null);

export function AiConfigProvider({ children }) {
  const [config, setConfig] = useLocalStorage(STORAGE_KEYS.AI_CONFIG, DEFAULT_AI_CONFIG);

  const merged = { ...DEFAULT_AI_CONFIG, ...config };

  function updateConfig(patch) {
    setConfig((current) => ({ ...DEFAULT_AI_CONFIG, ...current, ...patch }));
  }

  const configured = Boolean(merged.apiKey && merged.apiKey.trim());

  return (
    <AiConfigContext.Provider value={{ config: merged, updateConfig, configured }}>
      {children}
    </AiConfigContext.Provider>
  );
}

export function useAiConfig() {
  const context = useContext(AiConfigContext);
  if (!context) {
    throw new Error('useAiConfig deve ser usado dentro de um AiConfigProvider.');
  }
  return context;
}
