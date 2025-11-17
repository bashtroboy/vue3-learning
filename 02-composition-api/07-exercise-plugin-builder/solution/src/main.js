import { createApp } from 'vue'
import App from './App.vue'
import plugins from './plugins'

const app = createApp(App)

app.use(plugins, {
  notification: {
    position: 'top-right',
    duration: 3000,
    max: 5
  },
  theme: {
    default: 'light'
  },
  analytics: {
    enabled: true
  }
})

app.mount('#app')
