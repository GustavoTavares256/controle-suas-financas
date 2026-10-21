import { createContext, useContext } from 'react';
import useLocalStorage from '../../hooks/useLocalStorage';
import { STORAGE_KEYS } from '../../utils/constants';

export const DEFAULT_PREFERENCES = {
  nome: '',
  denseMode: false,
  showChartAnimations: true,
  darkMode: false,
};

const PreferencesContext = createContext(null);

export function PreferencesProvider({ children }) {
  const [prefs, setPrefs] = useLocalStorage(STORAGE_KEYS.PREFERENCIAS, DEFAULT_PREFERENCES);

  const merged = { ...DEFAULT_PREFERENCES, ...prefs };

  function updatePreferences(patch) {
    setPrefs((current) => ({ ...DEFAULT_PREFERENCES, ...current, ...patch }));
  }

  return (
    <PreferencesContext.Provider value={{ prefs: merged, updatePreferences }}>
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error('usePreferences deve ser usado dentro de um PreferencesProvider.');
  }
  return context;
}
