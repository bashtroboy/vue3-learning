import { inject } from 'vue'
import { i18nKey } from '../plugins/i18n'

export function useI18n() {
  const i18n = inject(i18nKey)

  if (!i18n) {
    throw new Error('I18n plugin not installed. Use app.use(i18nPlugin)')
  }

  return i18n
}
