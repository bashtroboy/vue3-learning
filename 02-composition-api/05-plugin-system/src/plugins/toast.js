import { reactive } from 'vue'
import ToastContainer from '../components/ToastContainer.vue'

const toastKey = Symbol('toast')

let toastId = 0

export default {
  install(app, options = {}) {
    const config = {
      position: 'top-right',
      duration: 3000,
      max: 5,
      ...options
    }

    const state = reactive({
      toasts: [],
      config
    })

    const api = {
      state,

      show(message, type = 'info', duration = config.duration) {
        const id = toastId++
        const toast = { id, message, type }

        state.toasts.push(toast)

        // Enforce max limit
        if (state.toasts.length > config.max) {
          state.toasts.shift()
        }

        // Auto dismiss
        if (duration > 0) {
          setTimeout(() => {
            this.dismiss(id)
          }, duration)
        }

        return id
      },

      success(message, duration) {
        return this.show(message, 'success', duration)
      },

      error(message, duration) {
        return this.show(message, 'error', duration)
      },

      warning(message, duration) {
        return this.show(message, 'warning', duration)
      },

      info(message, duration) {
        return this.show(message, 'info', duration)
      },

      dismiss(id) {
        const index = state.toasts.findIndex(t => t.id === id)
        if (index > -1) {
          state.toasts.splice(index, 1)
        }
      },

      dismissAll() {
        state.toasts.length = 0
      }
    }

    app.provide(toastKey, api)
    app.component('ToastContainer', ToastContainer)
    app.config.globalProperties.$toast = api
  }
}

export { toastKey }
