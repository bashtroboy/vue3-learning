import { inject } from 'vue'
import { key } from '../plugins/theme'

export function useTheme() {
  const theme = inject(key)
  if (!theme) throw new Error('Theme plugin not installed')
  return theme
}
