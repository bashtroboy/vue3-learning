import { inject } from 'vue'
import { key } from '../plugins/analytics'

export function useAnalytics() {
  const analytics = inject(key)
  if (!analytics) throw new Error('Analytics plugin not installed')
  return analytics
}
