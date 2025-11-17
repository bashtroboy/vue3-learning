# Lesson 5: Vue Plugin System

## Overview

Plugins are self-contained code that add global-level functionality to Vue. They can add global components, directives, provide/inject values, or add instance properties. This lesson covers creating, using, and distributing Vue 3 plugins.

## What You'll Learn

- Creating Vue 3 plugins
- Plugin installation and configuration
- Global vs scoped plugins
- Plugin composition patterns
- Publishing reusable plugins
- Testing plugins

## Plugin Structure

### Basic Plugin

```javascript
// plugins/myPlugin.js
export default {
  install(app, options) {
    // 1. Add global components
    app.component('MyComponent', MyComponent)

    // 2. Add global directives
    app.directive('my-directive', {
      mounted(el, binding) {
        // directive logic
      }
    })

    // 3. Add global properties
    app.config.globalProperties.$myMethod = () => {
      // method logic
    }

    // 4. Provide values
    app.provide('myPlugin', {
      config: options
    })
  }
}
```

### Installation

```javascript
import { createApp } from 'vue'
import myPlugin from './plugins/myPlugin'

const app = createApp(App)
app.use(myPlugin, {
  // plugin options
})
app.mount('#app')
```

## Common Plugin Patterns

### 1. Component Library Plugin

```javascript
// plugins/componentLibrary.js
import Button from './components/Button.vue'
import Input from './components/Input.vue'
import Modal from './components/Modal.vue'

export default {
  install(app) {
    app.component('UiButton', Button)
    app.component('UiInput', Input)
    app.component('UiModal', Modal)
  }
}
```

### 2. Utility Plugin

```javascript
// plugins/utils.js
export default {
  install(app, options) {
    const utils = {
      formatDate(date) {
        return new Date(date).toLocaleDateString()
      },
      formatCurrency(amount) {
        return `$${amount.toFixed(2)}`
      }
    }

    app.provide('utils', utils)
    app.config.globalProperties.$utils = utils
  }
}
```

### 3. API Client Plugin

```javascript
// plugins/api.js
export default {
  install(app, options) {
    const apiClient = {
      baseURL: options.baseURL,

      async get(endpoint) {
        const response = await fetch(`${this.baseURL}${endpoint}`)
        return response.json()
      },

      async post(endpoint, data) {
        const response = await fetch(`${this.baseURL}${endpoint}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        })
        return response.json()
      }
    }

    app.provide('api', apiClient)
    app.config.globalProperties.$api = apiClient
  }
}

// Usage
app.use(apiPlugin, {
  baseURL: 'https://api.example.com'
})
```

### 4. Router Integration Plugin

```javascript
// plugins/router.js
import { inject } from 'vue'

const routerSymbol = Symbol('router')

export default {
  install(app, router) {
    app.provide(routerSymbol, router)

    app.config.globalProperties.$router = router
    app.config.globalProperties.$route = router.currentRoute
  }
}

// Composable
export function useRouter() {
  return inject(routerSymbol)
}
```

## Best Practices

### 1. Use Symbols for Injection Keys

```javascript
const configKey = Symbol('config')

export default {
  install(app, options) {
    app.provide(configKey, options)
  }
}

export function useConfig() {
  const config = inject(configKey)
  if (!config) {
    throw new Error('Config plugin not installed')
  }
  return config
}
```

### 2. Provide TypeScript Support

```typescript
// types.ts
export interface PluginOptions {
  apiKey: string
  timeout?: number
}

export interface MyPlugin {
  method(): void
}

// plugin.ts
import type { Plugin } from 'vue'
import type { PluginOptions, MyPlugin } from './types'

const plugin: Plugin = {
  install(app, options: PluginOptions) {
    // Type-safe plugin logic
  }
}

export default plugin
```

### 3. Allow Configuration

```javascript
export default {
  install(app, options = {}) {
    const config = {
      prefix: 'app',
      debug: false,
      ...options
    }

    app.provide('config', config)
  }
}
```

### 4. Conditional Installation

```javascript
let installed = false

export default {
  install(app, options) {
    if (installed) {
      console.warn('Plugin already installed')
      return
    }

    installed = true

    // Plugin logic
  }
}
```

## Real-World Example: Notification Plugin

```javascript
// plugins/notification.js
import { reactive } from 'vue'

export default {
  install(app, options = {}) {
    const state = reactive({
      notifications: []
    })

    let id = 0

    const notification = {
      show(message, type = 'info', duration = 3000) {
        const notif = {
          id: id++,
          message,
          type
        }

        state.notifications.push(notif)

        if (duration > 0) {
          setTimeout(() => {
            this.dismiss(notif.id)
          }, duration)
        }

        return notif.id
      },

      success(message, duration) {
        return this.show(message, 'success', duration)
      },

      error(message, duration) {
        return this.show(message, 'error', duration)
      },

      dismiss(id) {
        const index = state.notifications.findIndex(n => n.id === id)
        if (index > -1) {
          state.notifications.splice(index, 1)
        }
      },

      state
    }

    app.provide('notification', notification)
    app.config.globalProperties.$notify = notification
  }
}

// Usage in components
import { inject } from 'vue'

const notify = inject('notification')
notify.success('Operation successful!')

// Or with global property
this.$notify.error('Something went wrong')
```

## Plugin Composition

Combine multiple plugins:

```javascript
// plugins/index.js
import api from './api'
import notification from './notification'
import utils from './utils'

export default {
  install(app, options) {
    app.use(api, options.api)
    app.use(notification, options.notification)
    app.use(utils)
  }
}

// Usage
import plugins from './plugins'

app.use(plugins, {
  api: { baseURL: 'https://api.example.com' },
  notification: { position: 'top-right' }
})
```

## Testing Plugins

```javascript
import { describe, it, expect } from 'vitest'
import { createApp } from 'vue'
import myPlugin from './myPlugin'

describe('myPlugin', () => {
  it('installs successfully', () => {
    const app = createApp({})
    app.use(myPlugin)

    expect(app.config.globalProperties.$myMethod).toBeDefined()
  })

  it('provides correct values', () => {
    const app = createApp({})
    app.use(myPlugin, { option: 'value' })

    // Test provided values
  })
})
```

## Summary

- Plugins add global functionality to Vue apps
- Use `install(app, options)` method
- Can provide components, directives, properties
- Follow best practices for reusability
- Support TypeScript for better DX

## Next Steps

- **Lesson 6**: Advanced Composable Patterns
- **Exercise**: Build a Complete Plugin System
