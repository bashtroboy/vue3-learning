import toast from './toast'
import i18n from './i18n'
import logger from './logger'
import http from './http'

export default {
  install(app, options = {}) {
    app.use(toast, options.toast)
    app.use(i18n, options.i18n)
    app.use(logger, options.logger)
    app.use(http, options.http)
  }
}
