import { reactive } from 'vue'

const loggerKey = Symbol('logger')

const LEVELS = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
}

export default {
  install(app, options = {}) {
    const config = {
      enabled: true,
      level: 'info',
      maxLogs: 100,
      ...options
    }

    const state = reactive({
      logs: []
    })

    const shouldLog = (level) => {
      return config.enabled && LEVELS[level] >= LEVELS[config.level]
    }

    const log = (level, message, data) => {
      if (!shouldLog(level)) return

      const entry = {
        level,
        message,
        data,
        timestamp: Date.now()
      }

      state.logs.push(entry)

      // Enforce max logs
      if (state.logs.length > config.maxLogs) {
        state.logs.shift()
      }

      // Console output
      const consoleFn = console[level] || console.log
      if (data) {
        consoleFn(`[${level.toUpperCase()}]`, message, data)
      } else {
        consoleFn(`[${level.toUpperCase()}]`, message)
      }
    }

    const api = {
      debug(message, data) {
        log('debug', message, data)
      },

      info(message, data) {
        log('info', message, data)
      },

      warn(message, data) {
        log('warn', message, data)
      },

      error(message, data) {
        log('error', message, data)
      },

      getLogs() {
        return state.logs
      },

      clear() {
        state.logs.length = 0
      }
    }

    app.provide(loggerKey, api)
    app.config.globalProperties.$logger = api
  }
}

export { loggerKey }
