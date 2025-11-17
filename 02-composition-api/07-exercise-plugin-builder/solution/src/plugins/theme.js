import { ref, watch } from 'vue'

const key = Symbol('theme')

export default {
  install(app, options = {}) {
    const current = ref(localStorage.getItem('theme') || options.default || 'light')

    watch(current, (theme) => {
      localStorage.setItem('theme', theme)
    })

    const api = {
      current,
      toggle() {
        current.value = current.value === 'light' ? 'dark' : 'light'
      }
    }

    app.provide(key, api)
  }
}

export { key }
