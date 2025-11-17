# Exercise: Advanced Plugin Builder

## Overview

Build a comprehensive plugin system that demonstrates mastery of all Vue 3 Composition API concepts covered in this section. You'll create a modular notification/toast system with multiple plugins, custom directives, composables, and advanced patterns.

## Learning Objectives

Apply all concepts from Section 2:
- ✅ Provide/Inject for dependency injection
- ✅ Lifecycle hooks for setup and cleanup
- ✅ Custom directives for DOM manipulation
- ✅ Teleport for rendering notifications
- ✅ Suspense for async plugin loading
- ✅ Plugin system architecture
- ✅ Advanced composable patterns

## Project Requirements

### Core Features

1. **Notification Plugin System**
   - Multiple notification types (success, error, warning, info)
   - Configurable positions (top-left, top-right, bottom-left, bottom-right)
   - Auto-dismiss with configurable duration
   - Manual dismiss
   - Maximum notification limit
   - Queue management

2. **Theme Plugin**
   - Light/dark mode
   - Custom color schemes
   - Persistent theme storage
   - Theme injection throughout app

3. **Analytics Plugin**
   - Track notification events
   - Click tracking
   - Custom event tracking
   - Export analytics data

4. **Custom Directives**
   - `v-toast`: Show toast on element interaction
   - `v-track`: Track element interactions
   - `v-theme`: Apply theme to elements

5. **Composables**
   - `useNotification`: Access notification system
   - `useTheme`: Access theme system
   - `useAnalytics`: Access analytics
   - `usePluginConfig`: Access plugin configuration

## Technical Requirements

### Architecture

```
plugins/
├── notification/
│   ├── index.js              # Plugin definition
│   ├── NotificationContainer.vue
│   ├── Notification.vue
│   └── composables/
│       └── useNotification.js
├── theme/
│   ├── index.js
│   └── composables/
│       └── useTheme.js
├── analytics/
│   ├── index.js
│   └── composables/
│       └── useAnalytics.js
└── index.js                   # Main plugin installer
```

### Implementation Guide

#### 1. Notification Plugin

```javascript
// plugins/notification/index.js
import { reactive } from 'vue'
import NotificationContainer from './NotificationContainer.vue'

const notificationKey = Symbol('notification')

export default {
  install(app, options = {}) {
    const config = {
      position: 'top-right',
      duration: 3000,
      max: 5,
      ...options
    }

    const state = reactive({
      notifications: [],
      config
    })

    const api = {
      show(message, type = 'info') {
        // Implementation
      },
      success(message) {
        return this.show(message, 'success')
      },
      error(message) {
        return this.show(message, 'error')
      },
      warning(message) {
        return this.show(message, 'warning')
      },
      info(message) {
        return this.show(message, 'info')
      },
      dismiss(id) {
        // Implementation
      },
      dismissAll() {
        // Implementation
      }
    }

    app.provide(notificationKey, { ...api, state })
    app.component('NotificationContainer', NotificationContainer)
  }
}

// composables/useNotification.js
export function useNotification() {
  const notification = inject(notificationKey)
  if (!notification) {
    throw new Error('Notification plugin not installed')
  }
  return notification
}
```

#### 2. Theme Plugin

```javascript
// plugins/theme/index.js
import { ref, watch } from 'vue'

const themeKey = Symbol('theme')

export default {
  install(app, options = {}) {
    const currentTheme = ref(
      localStorage.getItem('theme') || options.default || 'light'
    )

    const themes = {
      light: {
        primary: '#3498db',
        background: '#ffffff',
        text: '#2c3e50'
      },
      dark: {
        primary: '#3498db',
        background: '#2c3e50',
        text: '#ecf0f1'
      },
      ...options.themes
    }

    watch(currentTheme, (theme) => {
      localStorage.setItem('theme', theme)
      applyTheme(themes[theme])
    }, { immediate: true })

    function applyTheme(colors) {
      Object.entries(colors).forEach(([key, value]) => {
        document.documentElement.style.setProperty(`--${key}`, value)
      })
    }

    const api = {
      current: currentTheme,
      themes,
      setTheme(theme) {
        if (themes[theme]) {
          currentTheme.value = theme
        }
      },
      toggle() {
        const current = currentTheme.value
        currentTheme.value = current === 'light' ? 'dark' : 'light'
      }
    }

    app.provide(themeKey, api)
  }
}
```

#### 3. Analytics Plugin

```javascript
// plugins/analytics/index.js
import { reactive } from 'vue'

const analyticsKey = Symbol('analytics')

export default {
  install(app, options = {}) {
    const events = reactive([])

    const api = {
      track(event, data = {}) {
        events.push({
          event,
          data,
          timestamp: Date.now()
        })

        // Send to analytics service if configured
        if (options.endpoint) {
          fetch(options.endpoint, {
            method: 'POST',
            body: JSON.stringify({ event, data })
          })
        }
      },

      getEvents() {
        return events
      },

      export() {
        return JSON.stringify(events, null, 2)
      },

      clear() {
        events.length = 0
      }
    }

    app.provide(analyticsKey, api)
    app.config.globalProperties.$analytics = api
  }
}
```

### Starter Template Structure

```
starter/
├── index.html
├── package.json
├── vite.config.js
├── src/
│   ├── main.js
│   ├── App.vue
│   ├── plugins/
│   │   ├── notification/
│   │   │   ├── index.js             # TODO: Implement
│   │   │   ├── NotificationContainer.vue  # TODO: Implement
│   │   │   ├── Notification.vue     # TODO: Implement
│   │   │   └── composables/
│   │   │       └── useNotification.js  # TODO: Implement
│   │   ├── theme/
│   │   │   ├── index.js             # TODO: Implement
│   │   │   └── composables/
│   │   │       └── useTheme.js      # TODO: Implement
│   │   ├── analytics/
│   │   │   ├── index.js             # TODO: Implement
│   │   │   └── composables/
│   │   │       └── useAnalytics.js  # TODO: Implement
│   │   └── index.js                 # Main installer
│   ├── directives/
│   │   ├── toast.js                 # TODO: Implement
│   │   ├── track.js                 # TODO: Implement
│   │   └── theme.js                 # TODO: Implement
│   └── components/
│       └── Demo.vue                 # Pre-built demo component
```

## Step-by-Step Guide

### Phase 1: Notification Plugin (40 min)

1. Create notification state management
2. Implement notification API (show, dismiss, etc.)
3. Build NotificationContainer component with Teleport
4. Build Notification component with transitions
5. Create useNotification composable
6. Test with demo component

### Phase 2: Theme Plugin (20 min)

1. Implement theme storage and switching
2. Create CSS variable system
3. Build useTheme composable
4. Add theme persistence with localStorage
5. Test theme switching

### Phase 3: Analytics Plugin (15 min)

1. Create event tracking system
2. Implement analytics API
3. Build useAnalytics composable
4. Add export functionality
5. Test event tracking

### Phase 4: Custom Directives (25 min)

1. **v-toast**: Show notification on click/hover
   ```javascript
   <button v-toast="'Button clicked!'">Click me</button>
   <button v-toast.hover="'Hovering!'">Hover me</button>
   ```

2. **v-track**: Track element interactions
   ```javascript
   <button v-track:click="'button-clicked'">Track Click</button>
   ```

3. **v-theme**: Apply theme colors
   ```javascript
   <div v-theme:primary>Primary colored</div>
   ```

### Phase 5: Integration & Polish (20 min)

1. Combine all plugins
2. Test interactions between plugins
3. Add error handling
4. Polish UI/UX
5. Write tests

## Success Criteria

- [ ] All plugins install correctly
- [ ] Notifications appear and dismiss properly
- [ ] Theme switches persist across reloads
- [ ] Analytics tracks all events
- [ ] Custom directives work as expected
- [ ] No memory leaks (proper cleanup)
- [ ] TypeScript types (bonus)
- [ ] Unit tests for core functionality (bonus)

## Bonus Challenges

1. **Notification Queue**: Implement smart queuing when max limit reached
2. **Notification Actions**: Add action buttons to notifications
3. **Theme Builder**: UI to create custom themes
4. **Analytics Dashboard**: Visualize tracked events
5. **Plugin Marketplace**: System to dynamically load plugins
6. **Suspense Integration**: Lazy load plugin components
7. **Accessibility**: ARIA labels, keyboard navigation

## Testing Guidelines

### Unit Tests

```javascript
describe('Notification Plugin', () => {
  it('shows notification', () => {
    const { show } = useNotification()
    const id = show('Test message', 'success')
    expect(id).toBeDefined()
  })

  it('dismisses notification', () => {
    const { show, dismiss, state } = useNotification()
    const id = show('Test')
    dismiss(id)
    expect(state.notifications).toHaveLength(0)
  })
})
```

### Integration Tests

```javascript
describe('Plugin Integration', () => {
  it('tracks notification events', () => {
    const { show } = useNotification()
    const { getEvents } = useAnalytics()

    show('Test notification')

    const events = getEvents()
    expect(events).toContainEqual(
      expect.objectContaining({ event: 'notification:show' })
    )
  })
})
```

## Solution Structure

The `solution/` folder contains a complete implementation with:
- All plugins fully implemented
- Custom directives
- Comprehensive tests
- TypeScript definitions
- Demo application
- Documentation

## Estimated Time

- **Starter**: 2-3 hours
- **With Bonuses**: 4-5 hours
- **Review Solution**: 30 minutes

## Resources

- [Vue 3 Plugin Guide](https://vuejs.org/guide/reusability/plugins.html)
- [Composition API Documentation](https://vuejs.org/guide/extras/composition-api-faq.html)
- [Custom Directives Guide](https://vuejs.org/guide/reusability/custom-directives.html)
- [Teleport Documentation](https://vuejs.org/guide/built-ins/teleport.html)

## Next Steps

After completing this exercise:
1. Review the solution code
2. Compare your implementation
3. Identify areas for improvement
4. Try bonus challenges
5. Apply patterns to your own projects

Good luck! This exercise brings together everything you've learned in Section 2.
