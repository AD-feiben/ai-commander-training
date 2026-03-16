import { useSettingsStore } from '../store';
import { getTranslation } from '../i18n';

export function useTranslation() {
  const language = useSettingsStore((state) => state.language);
  return getTranslation(language);
}
