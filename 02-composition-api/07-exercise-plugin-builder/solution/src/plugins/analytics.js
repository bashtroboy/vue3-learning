import { reactive } from 'vue'

const key = Symbol('analytics')

export default {
  install(app, options = {}) {
    const events = reactive([])

    const api = {
      track(event, data = {}) {
        events.push({ event, data, timestamp: Date.now() })
      },
      getEvents() {
        return events
      }
    }

    app.provide(key, api)
  }
}

export { key }
