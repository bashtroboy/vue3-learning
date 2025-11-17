import { inject } from 'vue'
import { httpKey } from '../plugins/http'

export function useHttp() {
  const http = inject(httpKey)

  if (!http) {
    throw new Error('HTTP plugin not installed. Use app.use(httpPlugin)')
  }

  return http
}
