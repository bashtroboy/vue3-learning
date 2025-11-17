import { createApp } from 'vue'
import App from './App.vue'
import plugins from './plugins'

const app = createApp(App)

// Install all plugins
app.use(plugins, {
  toast: {
    position: 'top-right',
    duration: 3000
  },
  i18n: {
    locale: 'en',
    fallback: 'en'
  },
  logger: {
    enabled: true,
    level: 'info'
  }
})

app.mount('#app')
