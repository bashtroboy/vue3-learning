# Lesson 6: Advanced Composable Patterns

## Overview

This lesson explores advanced patterns for creating powerful, reusable composables in Vue 3. We'll cover state management, async patterns, composition strategies, and performance optimization.

## Advanced Patterns Covered

1. Stateful vs Stateless Composables
2. Composable Composition
3. Async Composables
4. Side Effect Management
5. Reactive Arguments
6. Return Value Patterns
7. TypeScript Integration

## Pattern 1: Stateful vs Stateless

### Stateless Composable

Returns new state each time:

```javascript
// composables/useCounter.js
import { ref } from 'vue'

export function useCounter(initial = 0) {
  const count = ref(initial)

  function increment() {
    count.value++
  }

  function decrement() {
    count.value--
  }

  return {
    count,
    increment,
    decrement
  }
}

// Each call creates new state
const counter1 = useCounter() // Independent
const counter2 = useCounter() // Independent
```

### Stateful (Singleton) Composable

Shares state across calls:

```javascript
// composables/useGlobalState.js
import { ref } from 'vue'

const state = ref({ user: null, theme: 'light' })

export function useGlobalState() {
  function setUser(user) {
    state.value.user = user
  }

  function setTheme(theme) {
    state.value.theme = theme
  }

  return {
    state,
    setUser,
    setTheme
  }
}

// All calls share same state
const state1 = useGlobalState() // Shared
const state2 = useGlobalState() // Same state
```

## Pattern 2: Composable Composition

Build complex composables from simple ones:

```javascript
// composables/useLocalStorage.js
import { ref, watch } from 'vue'

export function useLocalStorage(key, defaultValue) {
  const data = ref(defaultValue)

  const stored = localStorage.getItem(key)
  if (stored) {
    data.value = JSON.parse(stored)
  }

  watch(data, (newValue) => {
    localStorage.setItem(key, JSON.stringify(newValue))
  }, { deep: true })

  return data
}

// composables/useAuth.js
import { computed } from 'vue'
import { useLocalStorage } from './useLocalStorage'

export function useAuth() {
  const user = useLocalStorage('user', null)

  const isAuthenticated = computed(() => !!user.value)

  function login(credentials) {
    // Login logic
    user.value = { /* user data */ }
  }

  function logout() {
    user.value = null
  }

  return {
    user,
    isAuthenticated,
    login,
    logout
  }
}
```

## Pattern 3: Async Composables

Handle async operations:

```javascript
// composables/useAsyncData.js
import { ref, onMounted } from 'vue'

export function useAsyncData(fetcher) {
  const data = ref(null)
  const error = ref(null)
  const loading = ref(false)

  async function execute() {
    loading.value = true
    error.value = null

    try {
      data.value = await fetcher()
    } catch (e) {
      error.value = e
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    execute()
  })

  return {
    data,
    error,
    loading,
    refresh: execute
  }
}

// Usage
const { data, error, loading, refresh } = useAsyncData(
  () => fetch('/api/users').then(r => r.json())
)
```

## Pattern 4: Reactive Arguments

Accept reactive parameters:

```javascript
// composables/useDebounce.js
import { ref, watch, unref, isRef } from 'vue'

export function useDebounce(value, delay = 300) {
  const debounced = ref(unref(value))

  watch(
    () => unref(value),
    (newValue) => {
      const timeout = setTimeout(() => {
        debounced.value = newValue
      }, delay)

      return () => clearTimeout(timeout)
    }
  )

  return debounced
}

// Works with refs and values
const search = ref('')
const debouncedSearch = useDebounce(search, 500)

// Or
const staticDebounced = useDebounce('static value')
```

## Pattern 5: Event Bus Pattern

```javascript
// composables/useEventBus.js
import { ref, onUnmounted } from 'vue'

const handlers = new Map()

export function useEventBus() {
  function emit(event, ...args) {
    handlers.get(event)?.forEach(handler => handler(...args))
  }

  function on(event, handler) {
    if (!handlers.has(event)) {
      handlers.set(event, new Set())
    }
    handlers.get(event).add(handler)

    onUnmounted(() => {
      off(event, handler)
    })
  }

  function off(event, handler) {
    handlers.get(event)?.delete(handler)
  }

  return {
    emit,
    on,
    off
  }
}

// Usage
const bus = useEventBus()

bus.on('user:login', (user) => {
  console.log('User logged in:', user)
})

bus.emit('user:login', { name: 'John' })
```

## Pattern 6: Resource Management

Automatic cleanup of resources:

```javascript
// composables/useInterval.js
import { ref, onUnmounted } from 'vue'

export function useInterval(callback, delay) {
  const isActive = ref(false)
  let intervalId = null

  function start() {
    if (!isActive.value) {
      isActive.value = true
      intervalId = setInterval(callback, delay)
    }
  }

  function stop() {
    if (isActive.value) {
      isActive.value = false
      clearInterval(intervalId)
      intervalId = null
    }
  }

  onUnmounted(() => {
    stop()
  })

  return {
    isActive,
    start,
    stop
  }
}

// Usage
const { start, stop, isActive } = useInterval(() => {
  console.log('Tick')
}, 1000)

start()
```

## Pattern 7: Composable Factory

Create configurable composables:

```javascript
// composables/createFetch.js
export function createFetch(config = {}) {
  const baseURL = config.baseURL || ''

  return function useFetch(endpoint, options = {}) {
    const data = ref(null)
    const error = ref(null)
    const loading = ref(false)

    async function execute() {
      loading.value = true

      try {
        const response = await fetch(`${baseURL}${endpoint}`, {
          ...config.fetchOptions,
          ...options
        })
        data.value = await response.json()
      } catch (e) {
        error.value = e
      } finally {
        loading.value = false
      }
    }

    return {
      data,
      error,
      loading,
      execute
    }
  }
}

// Setup
const useFetch = createFetch({
  baseURL: 'https://api.example.com',
  fetchOptions: {
    headers: { 'Authorization': 'Bearer token' }
  }
})

// Usage
const { data, loading } = useFetch('/users')
```

## Best Practices

### 1. Consistent Naming

- Use `use` prefix
- Describe functionality
- Be specific

```javascript
// Good
useAuth()
useLocalStorage()
useDebounce()

// Bad
auth()
storage()
debounce()
```

### 2. Return Object Pattern

```javascript
// Preferred
return {
  data,
  loading,
  error,
  refresh
}

// Avoid returning array unless order matters
return [data, loading] // Less clear
```

### 3. Handle Cleanup

Always clean up side effects:

```javascript
export function useEventListener(target, event, handler) {
  onMounted(() => {
    target.addEventListener(event, handler)
  })

  onUnmounted(() => {
    target.removeEventListener(event, handler)
  })
}
```

### 4. Accept Reactive Parameters

Use `unref()` and `isRef()`:

```javascript
import { unref, watch } from 'vue'

export function useMyComposable(value) {
  // Works with refs and values
  watch(() => unref(value), (newValue) => {
    // Handle change
  })
}
```

## Summary

Advanced composable patterns enable:
- Reusable logic across components
- Clean separation of concerns
- Easy testing and maintenance
- Type-safe code with TypeScript
- Efficient resource management

Master these patterns to build scalable Vue 3 applications.

## Next Steps

- **Exercise**: Build a Plugin System combining all concepts learned
