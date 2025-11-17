import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { persistencePlugin } from './plugins/persistence'
import { loggerPlugin } from './plugins/logger'

const app = createApp(App)
const pinia = createPinia()

// Add plugins to Pinia
pinia.use(persistencePlugin)

// Only use logger in development
if (import.meta.env.DEV) {
  pinia.use(loggerPlugin)
}

app.use(pinia)
app.use(router)
app.mount('#app')
