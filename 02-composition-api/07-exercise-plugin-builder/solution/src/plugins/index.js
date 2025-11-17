import notification from './notification'
import theme from './theme'
import analytics from './analytics'

export default {
  install(app, options = {}) {
    app.use(notification, options.notification)
    app.use(theme, options.theme)
    app.use(analytics, options.analytics)
  }
}
