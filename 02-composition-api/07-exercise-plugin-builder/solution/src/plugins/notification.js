import { reactive } from 'vue'

const key = Symbol('notification')
let id = 0

export default {
  install(app, options = {}) {
    const config = { position: 'top-right', duration: 3000, max: 5, ...options }
    const state = reactive({ notifications: [] })

    const api = {
      state,
      show(message, type = 'info') {
        const notification = { id: id++, message, type }
        state.notifications.push(notification)
        if (state.notifications.length > config.max) state.notifications.shift()
        if (config.duration > 0) {
          setTimeout(() => this.dismiss(notification.id), config.duration)
        }
        return notification.id
      },
      success(msg) { return this.show(msg, 'success') },
      error(msg) { return this.show(msg, 'error') },
      warning(msg) { return this.show(msg, 'warning') },
      info(msg) { return this.show(msg, 'info') },
      dismiss(id) {
        const index = state.notifications.findIndex(n => n.id === id)
        if (index > -1) state.notifications.splice(index, 1)
      }
    }

    app.provide(key, api)
  }
}

export { key }
