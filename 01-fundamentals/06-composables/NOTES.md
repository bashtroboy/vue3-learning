# Deep Dive: Vue 3 Composables

## Table of Contents

1. [Introduction to Composables](#introduction-to-composables)
2. [The Evolution: Mixins to Composables](#the-evolution-mixins-to-composables)
3. [Anatomy of a Composable](#anatomy-of-a-composable)
4. [Best Practices and Patterns](#best-practices-and-patterns)
5. [Advanced Composables](#advanced-composables)
6. [Composable Composition](#composable-composition)
7. [State Management with Composables](#state-management-with-composables)
8. [Testing Composables](#testing-composables)
9. [Performance Considerations](#performance-considerations)
10. [Real-World Examples](#real-world-examples)
11. [Common Pitfalls](#common-pitfalls)

---

## Introduction to Composables

**Composables** are functions that use Vue's Composition API to encapsulate and reuse stateful logic. They are the recommended way to share logic between components in Vue 3.

### What Makes a Function a Composable?

A function becomes a composable when it:
1. Uses Vue's Composition API (`ref`, `reactive`, `computed`, `watch`, etc.)
2. Returns reactive state or functions
3. Follows the `use*` naming convention
4. Can be reused across multiple components

```javascript
// This is a composable
import { ref } from 'vue'

export function useCounter(initialValue = 0) {
  const count = ref(initialValue)
  const increment = () => count.value++

  return { count, increment }
}

// This is just a regular function (not a composable)
export function addNumbers(a, b) {
  return a + b
}
```

### Why Composables?

**Problems with previous approaches:**

1. **Mixins** - Name collisions, unclear data sources, difficult composition
2. **Higher-Order Components** - Wrapper hell, props naming conflicts
3. **Renderless Components** - Performance overhead, template complexity

**Composables solve these problems:**
- ✅ No naming conflicts (explicit imports)
- ✅ Clear data sources
- ✅ Easy composition
- ✅ Better TypeScript support
- ✅ More flexible and powerful

---

## The Evolution: Mixins to Composables

### Vue 2: Mixins

```javascript
// mixins/counterMixin.js
export default {
  data() {
    return {
      count: 0
    }
  },
  methods: {
    increment() {
      this.count++
    }
  }
}

// Component.vue
export default {
  mixins: [counterMixin],
  mounted() {
    console.log(this.count) // Where does this come from? 🤔
  }
}
```

**Problems:**
- Unclear property sources
- Naming conflicts between multiple mixins
- Implicit dependencies
- Hard to reason about

### Vue 3: Composables

```javascript
// composables/useCounter.js
import { ref } from 'vue'

export function useCounter(initialValue = 0) {
  const count = ref(initialValue)

  function increment() {
    count.value++
  }

  return { count, increment }
}

// Component.vue
import { useCounter } from './composables/useCounter'

const counter = useCounter(0)
// Clear where 'counter' comes from! ✅
```

**Advantages:**
- ✅ Explicit imports and naming
- ✅ No conflicts (rename on import)
- ✅ Clear data flow
- ✅ Better IDE support

---

## Anatomy of a Composable

### Basic Structure

```javascript
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

export function useExample(initialValue, options = {}) {
  // 1. Configuration
  const { enableFeature = true, timeout = 1000 } = options

  // 2. Reactive State
  const state = ref(initialValue)
  const internalState = ref(null) // Can be private

  // 3. Computed Properties
  const derivedValue = computed(() => state.value * 2)

  // 4. Watchers
  watch(state, (newValue) => {
    console.log('State changed:', newValue)
  })

  // 5. Lifecycle Hooks
  onMounted(() => {
    console.log('Component using this composable mounted')
  })

  onUnmounted(() => {
    console.log('Cleanup')
  })

  // 6. Methods
  function update(newValue) {
    state.value = newValue
  }

  function reset() {
    state.value = initialValue
  }

  // 7. Side Effects
  const intervalId = setInterval(() => {
    // Do something
  }, timeout)

  onUnmounted(() => {
    clearInterval(intervalId)
  })

  // 8. Return Public API
  return {
    // Expose only what's needed
    state,
    derivedValue,
    update,
    reset
    // internalState is private
  }
}
```

### Naming Conventions

```javascript
// ✅ Good - use* prefix
export function useCounter() { }
export function useFetch() { }
export function useAuth() { }
export function useLocalStorage() { }

// ❌ Bad - doesn't follow convention
export function counter() { }
export function fetch() { }
export function getAuth() { }
```

---

## Best Practices and Patterns

### 1. Return Objects, Not Arrays

```javascript
// ✅ Good - easy to destructure selectively
export function useCounter() {
  const count = ref(0)
  const increment = () => count.value++
  const decrement = () => count.value--

  return { count, increment, decrement }
}

// Usage - can pick what you need
const { count, increment } = useCounter()

// ❌ Bad - must destructure in order
export function useCounter() {
  const count = ref(0)
  const increment = () => count.value++

  return [count, increment] // Like React hooks
}

// Usage - awkward renaming
const [myCount, myIncrement] = useCounter()
```

### 2. Accept Configuration Options

```javascript
// ✅ Good - flexible and extensible
export function useFetch(url, options = {}) {
  const {
    method = 'GET',
    headers = {},
    immediate = false,
    onSuccess,
    onError
  } = options

  // Implementation
}

// Usage
const api = useFetch('/api/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  immediate: true,
  onSuccess: (data) => console.log(data)
})
```

### 3. Provide Default Values

```javascript
export function useCounter(initialValue = 0, options = {}) {
  const { min = -Infinity, max = Infinity, step = 1 } = options

  const count = ref(initialValue)

  function increment() {
    const newValue = count.value + step
    if (newValue <= max) {
      count.value = newValue
    }
  }

  function decrement() {
    const newValue = count.value - step
    if (newValue >= min) {
      count.value = newValue
    }
  }

  return { count, increment, decrement }
}

// Usage with defaults
const counter1 = useCounter() // 0, no limits
const counter2 = useCounter(5, { min: 0, max: 10 }) // bounded
```

### 4. Clean Up Side Effects

```javascript
import { ref, onUnmounted } from 'vue'

export function useEventListener(target, event, handler) {
  // Setup
  onMounted(() => {
    target.addEventListener(event, handler)
  })

  // Cleanup
  onUnmounted(() => {
    target.removeEventListener(event, handler)
  })
}

export function useInterval(callback, delay) {
  const intervalId = ref(null)

  function start() {
    intervalId.value = setInterval(callback, delay)
  }

  function stop() {
    if (intervalId.value) {
      clearInterval(intervalId.value)
      intervalId.value = null
    }
  }

  // Auto-cleanup on unmount
  onUnmounted(() => {
    stop()
  })

  return { start, stop }
}
```

### 5. Make Composables Composable

Composables can use other composables!

```javascript
import { ref } from 'vue'
import { useEventListener } from './useEventListener'
import { useDebounce } from './useDebounce'

export function useWindowSize() {
  const width = ref(window.innerWidth)
  const height = ref(window.innerHeight)

  function update() {
    width.value = window.innerWidth
    height.value = window.innerHeight
  }

  // Use another composable
  useEventListener(window, 'resize', update)

  return { width, height }
}

export function useDebouncedWindowSize(delay = 200) {
  // Compose multiple composables
  const { width, height } = useWindowSize()
  const debouncedWidth = useDebounce(width, delay)
  const debouncedHeight = useDebounce(height, delay)

  return {
    width: debouncedWidth,
    height: debouncedHeight
  }
}
```

---

## Advanced Composables

### 1. Async Data Fetching

```javascript
import { ref, isRef, unref, watchEffect } from 'vue'

export function useFetch(url) {
  const data = ref(null)
  const error = ref(null)
  const isLoading = ref(false)

  async function doFetch() {
    isLoading.value = true
    error.value = null
    data.value = null

    // Unwrap potential ref
    const urlValue = unref(url)

    try {
      const response = await fetch(urlValue)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      data.value = await response.json()
    } catch (e) {
      error.value = e
    } finally {
      isLoading.value = false
    }
  }

  // Auto-refetch if url is a ref and changes
  if (isRef(url)) {
    watchEffect(() => {
      doFetch()
    })
  } else {
    // URL is static, fetch once
    doFetch()
  }

  return { data, error, isLoading, refetch: doFetch }
}

// Usage
const userId = ref(1)
const url = computed(() => `/api/users/${userId.value}`)

// Auto-refetches when userId changes
const { data, error, isLoading } = useFetch(url)
```

### 2. Mouse Position Tracker

```javascript
import { ref, onMounted, onUnmounted } from 'vue'

export function useMouse(options = {}) {
  const { type = 'page' } = options // 'page' | 'client' | 'screen'

  const x = ref(0)
  const y = ref(0)

  function update(event) {
    if (type === 'page') {
      x.value = event.pageX
      y.value = event.pageY
    } else if (type === 'client') {
      x.value = event.clientX
      y.value = event.clientY
    } else if (type === 'screen') {
      x.value = event.screenX
      y.value = event.screenY
    }
  }

  onMounted(() => {
    window.addEventListener('mousemove', update)
  })

  onUnmounted(() => {
    window.removeEventListener('mousemove', update)
  })

  return { x, y }
}

// Usage
const { x, y } = useMouse()
```

### 3. Intersection Observer

```javascript
import { ref, onMounted, onUnmounted } from 'vue'

export function useIntersectionObserver(target, options = {}) {
  const isIntersecting = ref(false)
  const intersectionRatio = ref(0)
  let observer = null

  onMounted(() => {
    observer = new IntersectionObserver((entries) => {
      const entry = entries[0]
      isIntersecting.value = entry.isIntersecting
      intersectionRatio.value = entry.intersectionRatio
    }, options)

    if (target.value) {
      observer.observe(target.value)
    }
  })

  onUnmounted(() => {
    if (observer) {
      observer.disconnect()
    }
  })

  return { isIntersecting, intersectionRatio }
}

// Usage
<template>
  <div ref="imageRef">
    <img v-if="isVisible" :src="imageSrc" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useIntersectionObserver } from './composables/useIntersectionObserver'

const imageRef = ref(null)
const { isIntersecting: isVisible } = useIntersectionObserver(imageRef, {
  threshold: 0.5
})
</script>
```

### 4. Geolocation

```javascript
import { ref, onUnmounted } from 'vue'

export function useGeolocation(options = {}) {
  const coords = ref({ latitude: 0, longitude: 0 })
  const error = ref(null)
  const isSupported = 'navigator' in window && 'geolocation' in navigator

  let watcher = null

  if (isSupported) {
    watcher = navigator.geolocation.watchPosition(
      (position) => {
        coords.value = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          altitude: position.coords.altitude,
          altitudeAccuracy: position.coords.altitudeAccuracy,
          heading: position.coords.heading,
          speed: position.coords.speed
        }
        error.value = null
      },
      (err) => {
        error.value = err.message
      },
      options
    )
  }

  onUnmounted(() => {
    if (watcher) {
      navigator.geolocation.clearWatch(watcher)
    }
  })

  return { coords, error, isSupported }
}
```

### 5. Media Query Listener

```javascript
import { ref, onMounted, onUnmounted } from 'vue'

export function useMediaQuery(query) {
  const matches = ref(false)
  let mediaQuery = null

  onMounted(() => {
    mediaQuery = window.matchMedia(query)
    matches.value = mediaQuery.matches

    const handler = (e) => {
      matches.value = e.matches
    }

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handler)
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handler)
    }
  })

  onUnmounted(() => {
    if (mediaQuery) {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handler)
      } else {
        mediaQuery.removeListener(handler)
      }
    }
  })

  return matches
}

// Usage
const isMobile = useMediaQuery('(max-width: 768px)')
const isDark = useMediaQuery('(prefers-color-scheme: dark)')
const isLandscape = useMediaQuery('(orientation: landscape)')
```

---

## Composable Composition

One of the most powerful aspects of composables is their ability to be combined.

### Example: Authenticated API Fetch

```javascript
// useAuth.js
export function useAuth() {
  const user = ref(null)
  const token = ref(localStorage.getItem('token'))

  function login(username, password) {
    // Login logic
  }

  function logout() {
    user.value = null
    token.value = null
    localStorage.removeItem('token')
  }

  return { user, token, login, logout }
}

// useFetch.js
export function useFetch(url, options = {}) {
  const data = ref(null)
  const error = ref(null)
  const isLoading = ref(false)

  async function execute(fetchOptions = {}) {
    isLoading.value = true

    try {
      const response = await fetch(url, { ...options, ...fetchOptions })
      data.value = await response.json()
    } catch (e) {
      error.value = e
    } finally {
      isLoading.value = false
    }
  }

  return { data, error, isLoading, execute }
}

// useAuthenticatedFetch.js - Combines both!
export function useAuthenticatedFetch(url, options = {}) {
  const { token } = useAuth()
  const { data, error, isLoading, execute } = useFetch(url, options)

  async function authenticatedExecute(fetchOptions = {}) {
    if (!token.value) {
      error.value = new Error('Not authenticated')
      return
    }

    await execute({
      ...fetchOptions,
      headers: {
        ...fetchOptions.headers,
        'Authorization': `Bearer ${token.value}`
      }
    })
  }

  return { data, error, isLoading, execute: authenticatedExecute }
}
```

### Example: Form with Auto-save

```javascript
// useAutoSave.js
import { watch } from 'vue'
import { useDebouncedFn } from './useDebounce'

export function useAutoSave(data, saveFn, delay = 2000) {
  const isSaving = ref(false)
  const lastSaved = ref(null)
  const error = ref(null)

  const debouncedSave = useDebouncedFn(async () => {
    isSaving.value = true
    error.value = null

    try {
      await saveFn(data)
      lastSaved.value = new Date()
    } catch (e) {
      error.value = e
    } finally {
      isSaving.value = false
    }
  }, delay)

  watch(data, () => {
    debouncedSave()
  }, { deep: true })

  return { isSaving, lastSaved, error }
}

// Usage with useForm
const form = useForm({ title: '', content: '' })

const { isSaving, lastSaved, error } = useAutoSave(
  form.formData,
  async (data) => {
    await fetch('/api/save', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  },
  3000 // Save 3 seconds after last change
)
```

---

## State Management with Composables

Composables can be used for simple state management without Vuex/Pinia.

### Shared State Pattern

```javascript
// stores/useUserStore.js
import { ref, computed } from 'vue'

// State is created outside the composable - shared across all usages
const user = ref(null)
const isAuthenticated = computed(() => user.value !== null)

export function useUserStore() {
  function login(userData) {
    user.value = userData
    localStorage.setItem('user', JSON.stringify(userData))
  }

  function logout() {
    user.value = null
    localStorage.removeItem('user')
  }

  function updateProfile(updates) {
    if (user.value) {
      user.value = { ...user.value, ...updates }
    }
  }

  return {
    user,
    isAuthenticated,
    login,
    logout,
    updateProfile
  }
}

// All components using useUserStore() share the same state!
```

### Scoped State Pattern

```javascript
// Each call creates independent state
export function useCounter(initialValue = 0) {
  const count = ref(initialValue)
  const increment = () => count.value++

  return { count, increment }
}

// Usage in ComponentA
const counter1 = useCounter(0) // Independent state

// Usage in ComponentB
const counter2 = useCounter(10) // Different independent state
```

---

## Testing Composables

Composables are easy to test because they're just functions!

### Basic Test Example

```javascript
// useCounter.test.js
import { describe, it, expect } from 'vitest'
import { useCounter } from './useCounter'

describe('useCounter', () => {
  it('initializes with default value', () => {
    const { count } = useCounter()
    expect(count.value).toBe(0)
  })

  it('initializes with custom value', () => {
    const { count } = useCounter(10)
    expect(count.value).toBe(10)
  })

  it('increments count', () => {
    const { count, increment } = useCounter(0)
    increment()
    expect(count.value).toBe(1)
  })

  it('respects max boundary', () => {
    const { count, increment } = useCounter(9, { min: 0, max: 10 })
    increment() // 10
    increment() // Should stay at 10
    expect(count.value).toBe(10)
  })

  it('resets to initial value', () => {
    const { count, increment, reset } = useCounter(5)
    increment()
    increment()
    expect(count.value).toBe(7)
    reset()
    expect(count.value).toBe(5)
  })
})
```

### Testing Async Composables

```javascript
// useFetch.test.js
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useFetch } from './useFetch'

describe('useFetch', () => {
  beforeEach(() => {
    // Mock fetch
    global.fetch = vi.fn()
  })

  it('fetches data successfully', async () => {
    const mockData = { id: 1, name: 'Test' }
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => mockData
    })

    const { data, error, isLoading, execute } = useFetch('/api/test')

    expect(isLoading.value).toBe(false)

    await execute()

    expect(isLoading.value).toBe(false)
    expect(data.value).toEqual(mockData)
    expect(error.value).toBeNull()
  })

  it('handles errors', async () => {
    global.fetch.mockRejectedValue(new Error('Network error'))

    const { data, error, isLoading, execute } = useFetch('/api/test')

    await execute()

    expect(data.value).toBeNull()
    expect(error.value).toBeTruthy()
    expect(error.value.message).toBe('Network error')
  })
})
```

---

## Performance Considerations

### 1. Avoid Creating Unnecessary Refs

```javascript
// ❌ Bad - creating new refs on every call
export function useExample() {
  const data = ref([1, 2, 3, 4, 5])

  const filtered = ref(data.value.filter(x => x > 2))

  return { data, filtered }
}

// ✅ Good - use computed for derived values
export function useExample() {
  const data = ref([1, 2, 3, 4, 5])

  const filtered = computed(() => data.value.filter(x => x > 2))

  return { data, filtered }
}
```

### 2. Cleanup Resources

```javascript
// ✅ Always cleanup intervals, event listeners, etc.
export function useInterval(callback, delay) {
  const intervalId = ref(null)

  function start() {
    intervalId.value = setInterval(callback, delay)
  }

  function stop() {
    clearInterval(intervalId.value)
  }

  onUnmounted(() => {
    stop()
  })

  return { start, stop }
}
```

### 3. Lazy Initialization

```javascript
// ✅ Don't do expensive operations immediately
export function useHeavyComputation() {
  const result = ref(null)
  const isComputing = ref(false)

  // Don't compute immediately - wait for explicit call
  async function compute(data) {
    isComputing.value = true
    result.value = await expensiveOperation(data)
    isComputing.value = false
  }

  return { result, isComputing, compute }
}
```

---

## Real-World Examples

### 1. Complete Form with Validation

```javascript
// useFormValidation.js
import { reactive, computed } from 'vue'

export function useFormValidation(initialValues, validationRules) {
  const formData = reactive({ ...initialValues })
  const errors = reactive({})
  const touched = reactive({})

  function validateField(field) {
    const rules = validationRules[field]
    if (!rules) return

    for (const rule of rules) {
      const error = rule(formData[field])
      if (error) {
        errors[field] = error
        return
      }
    }

    delete errors[field]
  }

  function validateAll() {
    Object.keys(validationRules).forEach(validateField)
  }

  function setFieldValue(field, value) {
    formData[field] = value
    touched[field] = true
    validateField(field)
  }

  function resetForm() {
    Object.keys(formData).forEach(key => {
      formData[key] = initialValues[key]
      delete errors[key]
      delete touched[key]
    })
  }

  const isValid = computed(() => Object.keys(errors).length === 0)

  return {
    formData,
    errors,
    touched,
    setFieldValue,
    validateField,
    validateAll,
    resetForm,
    isValid
  }
}

// Usage
const form = useFormValidation(
  { email: '', password: '' },
  {
    email: [
      (v) => v ? null : 'Email is required',
      (v) => /.+@.+/.test(v) ? null : 'Email must be valid'
    ],
    password: [
      (v) => v ? null : 'Password is required',
      (v) => v.length >= 8 ? null : 'Password must be 8+ characters'
    ]
  }
)
```

### 2. Pagination

```javascript
export function usePagination(items, options = {}) {
  const { itemsPerPage = 10 } = options

  const currentPage = ref(1)
  const pageSize = ref(itemsPerPage)

  const totalPages = computed(() =>
    Math.ceil(items.value.length / pageSize.value)
  )

  const paginatedItems = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value
    const end = start + pageSize.value
    return items.value.slice(start, end)
  })

  function nextPage() {
    if (currentPage.value < totalPages.value) {
      currentPage.value++
    }
  }

  function prevPage() {
    if (currentPage.value > 1) {
      currentPage.value--
    }
  }

  function goToPage(page) {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page
    }
  }

  const canGoNext = computed(() => currentPage.value < totalPages.value)
  const canGoPrev = computed(() => currentPage.value > 1)

  return {
    currentPage,
    pageSize,
    totalPages,
    paginatedItems,
    nextPage,
    prevPage,
    goToPage,
    canGoNext,
    canGoPrev
  }
}
```

---

## Common Pitfalls

### 1. Forgetting to Return Values

```javascript
// ❌ Bad - nothing returned
export function useCounter() {
  const count = ref(0)
  const increment = () => count.value++
  // Forgot to return!
}

// ✅ Good
export function useCounter() {
  const count = ref(0)
  const increment = () => count.value++

  return { count, increment }
}
```

### 2. Mutating Props Directly

```javascript
// ❌ Bad - mutating props
export function useExample(props) {
  props.value = 'changed' // Don't do this!
}

// ✅ Good - create internal reactive state
export function useExample(initialValue) {
  const value = ref(initialValue)

  function update(newValue) {
    value.value = newValue
  }

  return { value, update }
}
```

### 3. Not Cleaning Up Side Effects

```javascript
// ❌ Bad - memory leak!
export function useTimer() {
  setInterval(() => {
    console.log('tick')
  }, 1000)
  // Interval never gets cleared!
}

// ✅ Good
export function useTimer() {
  const intervalId = ref(null)

  function start() {
    intervalId.value = setInterval(() => {
      console.log('tick')
    }, 1000)
  }

  function stop() {
    clearInterval(intervalId.value)
  }

  onUnmounted(() => {
    stop()
  })

  return { start, stop }
}
```

---

## Summary

### Key Takeaways

1. **Composables are functions** that use Vue's Composition API
2. **Use the `use*` naming convention** for clarity
3. **Return objects** for flexible destructuring
4. **Clean up side effects** to prevent memory leaks
5. **Compose composables** to build complex functionality
6. **Make them configurable** with options parameters
7. **Test independently** from components

### When to Create a Composable

Create a composable when you have:
- ✅ Logic used in multiple components
- ✅ Complex stateful logic that deserves its own module
- ✅ Side effects that need lifecycle management
- ✅ Logic that should be testable independently

Don't create a composable for:
- ❌ Simple one-time logic
- ❌ Component-specific logic
- ❌ Pure utility functions (just use regular functions)

### Composables vs Other Patterns

| Pattern | When to Use |
|---------|-------------|
| **Composables** | Reusable reactive logic across components |
| **Components** | Reusable UI with logic |
| **Utility Functions** | Pure functions without reactivity |
| **Stores (Pinia)** | Global state management |
| **Directives** | Reusable DOM manipulation |
| **Plugins** | Adding global functionality |

---

**Congratulations!** You now have a deep understanding of Vue 3 composables. This is one of the most powerful features for creating maintainable, reusable, and testable applications!
