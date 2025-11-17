import { inject } from 'vue'
import { loggerKey } from '../plugins/logger'

export function useLogger() {
  const logger = inject(loggerKey)

  if (!logger) {
    throw new Error('Logger plugin not installed. Use app.use(loggerPlugin)')
  }

  return logger
}
