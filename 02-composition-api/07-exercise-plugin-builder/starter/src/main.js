import { createApp } from 'vue'
import App from './App.vue'

// TODO: Import your plugins
// import plugins from './plugins'

const app = createApp(App)

// TODO: Install your plugins
// app.use(plugins, {
//   notification: { position: 'top-right', duration: 3000 },
//   theme: { default: 'light' },
//   analytics: { enabled: true }
// })

app.mount('#app')
