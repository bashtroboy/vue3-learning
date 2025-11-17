# Pinia Advanced Patterns - Detailed Notes

## Overview

This demo showcases **advanced Pinia patterns** with a multi-store Content Server application. You'll learn about store composition, plugins, advanced caching, optimistic updates, and request deduplication.

## What This Demo Shows

### 1. Multiple Interconnected Stores

This application uses several stores that work together:

- **Content Server Store** (`stores/contentServer.js`) - Manages node data
- **Auth Store** (`stores/auth.js`) - Handles authentication
- **Favorites Store** (`stores/favorites.js`) - Manages user favorites
- **Cache Store** (`stores/cache.js`) - Provides caching with TTL
- **UI Store** (`stores/ui.js`) - Manages UI state (notifications, loading)

**Key Pattern:** Stores can use other stores by simply importing and calling them:

```javascript
// stores/contentServer.js
import { useAuthStore } from './auth'
import { useCacheStore } from './cache'

export const useContentServerStore = defineStore('contentServer', () => {
  const authStore = useAuthStore()
  const cacheStore = useCacheStore()

  async function fetchNode(id) {
    // Use auth token
    const headers = { Authorization: `Bearer ${authStore.token}` }

    // Check cache first
    const cached = cacheStore.get(`node-${id}`)
    if (cached) return cached

    // Fetch and cache
    const data = await api.getNode(id, { headers })
    cacheStore.set(`node-${id}`, data)
    return data
  }
})
```

### 2. Pinia Plugins

#### Persistence Plugin

Automatically saves and loads store state from localStorage:

```javascript
// plugins/persistence.js
export function persistencePlugin({ options, store }) {
  if (!options.persist) return

  const key = `pinia-${store.$id}`

  // Load saved state
  const savedState = localStorage.getItem(key)
  if (savedState) {
    store.$patch(JSON.parse(savedState))
  }

  // Save on every change
  store.$subscribe((mutation, state) => {
    localStorage.setItem(key, JSON.stringify(state))
  })
}
```

**Usage:**
```javascript
// In a store
export const useFavoritesStore = defineStore('favorites', () => {
  // ... store implementation
}, {
  persist: true  // Enable persistence
})
```

#### Logger Plugin

Logs all actions with timing information:

```javascript
// plugins/logger.js
export function loggerPlugin({ store }) {
  store.$onAction(({ name, args, after, onError }) => {
    const startTime = Date.now()
    console.log(`[${store.$id}] ${name}`, args)

    after((result) => {
      console.log(`[${store.$id}] ${name} completed in ${Date.now() - startTime}ms`)
    })

    onError((error) => {
      console.error(`[${store.$id}] ${name} failed:`, error)
    })
  })
}
```

**Benefits:**
- Debug action calls
- Track performance
- Monitor errors
- No code changes needed in stores

### 3. Advanced Caching with TTL

The Cache Store provides time-to-live (TTL) caching:

```javascript
// stores/cache.js
export const useCacheStore = defineStore('cache', () => {
  const cache = ref(new Map())

  function set(key, value, ttl = 5 * 60 * 1000) {
    cache.value.set(key, {
      value,
      expires: Date.now() + ttl
    })
  }

  function get(key) {
    const item = cache.value.get(key)
    if (!item) return null

    // Check expiration
    if (Date.now() > item.expires) {
      cache.value.delete(key)
      return null
    }

    return item.value
  }

  // Auto-cleanup expired items
  setInterval(() => {
    const now = Date.now()
    for (const [key, item] of cache.value.entries()) {
      if (now > item.expires) {
        cache.value.delete(key)
      }
    }
  }, 60 * 1000)  // Every minute

  return { set, get, has, clear }
})
```

**Features:**
- Time-based expiration
- Automatic cleanup
- Configurable TTL per item
- Memory efficient

### 4. Optimistic Updates

The Favorites Store demonstrates optimistic updates:

```javascript
async function addFavorite(nodeId) {
  // Optimistically update UI
  favoriteIds.value.push(nodeId)

  try {
    // Make API call
    await api.addFavorite(nodeId)
    // Success! Keep the optimistic update
  } catch (error) {
    // Rollback on error
    favoriteIds.value = favoriteIds.value.filter(id => id !== nodeId)
    throw error
  }
}
```

**Benefits:**
- Instant UI feedback
- Better user experience
- Automatic rollback on errors

### 5. Request Deduplication

Prevents multiple simultaneous requests for the same data:

```javascript
const pendingRequests = ref(new Map())

async function fetchNode(id) {
  const key = `node-${id}`

  // Return existing promise if request is pending
  if (pendingRequests.value.has(key)) {
    return pendingRequests.value.get(key)
  }

  // Create new request
  const promise = api.getNode(id)
    .then(response => {
      pendingRequests.value.delete(key)
      return response.data
    })
    .catch(error => {
      pendingRequests.value.delete(key)
      throw error
    })

  pendingRequests.value.set(key, promise)
  return promise
}
```

**Benefits:**
- Reduces server load
- Prevents race conditions
- Improves performance

### 6. Composable for Store Logic

The `useNodeCache` composable combines multiple stores:

```javascript
// composables/useNodeCache.js
export function useNodeCache() {
  const contentStore = useContentServerStore()
  const cacheStore = useCacheStore()
  const uiStore = useUIStore()

  async function loadNode(id, options = {}) {
    const cacheKey = `node-${id}`

    // Check cache unless force reload
    if (!options.forceReload) {
      const cached = cacheStore.get(cacheKey)
      if (cached) {
        contentStore.setCurrentNode(cached)
        return cached
      }
    }

    // Show loading
    uiStore.setLoading(true)

    try {
      const node = await contentStore.fetchNode(id)

      // Cache for 5 minutes
      cacheStore.set(cacheKey, node, 5 * 60 * 1000)

      uiStore.showNotification('Node loaded successfully', 'success')
      return node
    } catch (error) {
      uiStore.showNotification(error.message, 'error')
      throw error
    } finally {
      uiStore.setLoading(false)
    }
  }

  return { loadNode }
}
```

## Key Architectural Patterns

### 1. Store Separation of Concerns

Each store has a single responsibility:

- **Domain Stores** - Business logic (content, auth)
- **Utility Stores** - Cross-cutting concerns (cache, ui)
- **Feature Stores** - Specific features (favorites, search)

### 2. Plugin Architecture

Plugins add functionality without modifying store code:

```javascript
// main.js
import { persistencePlugin } from './plugins/persistence'
import { loggerPlugin } from './plugins/logger'

const pinia = createPinia()
pinia.use(persistencePlugin)
pinia.use(loggerPlugin)  // Only in development
```

### 3. Composable Pattern

Composables combine multiple stores for specific use cases:

```javascript
// Component usage
const { loadNode } = useNodeCache()

// Handles caching, loading, notifications automatically
loadNode(nodeId)
```

## Advanced Techniques Demonstrated

### 1. Store Reset Functionality

```javascript
export const useStore = defineStore('store', () => {
  const items = ref([])
  const loading = ref(false)

  function $reset() {
    items.value = []
    loading.value = false
  }

  return { items, loading, $reset }
})
```

### 2. Selective State Persistence

The persistence plugin can persist only specific fields:

```javascript
export const usePreferencesStore = defineStore('preferences', () => {
  const theme = ref('light')
  const tempData = ref(null)  // Won't be persisted

  return { theme, tempData }
}, {
  persist: ['theme']  // Only persist theme
})
```

### 3. Action Queuing

Ensures sequential execution of async operations:

```javascript
const queue = ref([])
const processing = ref(false)

async function addToQueue(action) {
  queue.value.push(action)
  processQueue()
}

async function processQueue() {
  if (processing.value) return

  processing.value = true
  while (queue.value.length > 0) {
    const action = queue.value.shift()
    await action()
  }
  processing.value = false
}
```

### 4. Cross-Store Reactivity

Changes in one store automatically affect others:

```javascript
// Auth Store
const user = ref(null)
const isAuthenticated = computed(() => !!user.value)

// Content Store
const authStore = useAuthStore()

// Automatically re-runs when auth changes
const canEdit = computed(() =>
  authStore.isAuthenticated && authStore.user.role === 'admin'
)
```

## Testing Strategies

### 1. Testing Stores in Isolation

```javascript
import { setActivePinia, createPinia } from 'pinia'
import { useContentServerStore } from '@/stores/contentServer'

describe('Content Server Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should fetch nodes', async () => {
    const store = useContentServerStore()
    await store.fetchNodes()
    expect(store.nodes.length).toBeGreaterThan(0)
  })
})
```

### 2. Testing Store Composition

```javascript
it('should use auth token when fetching', async () => {
  const authStore = useAuthStore()
  const contentStore = useContentServerStore()

  authStore.login('user', 'pass')
  await contentStore.fetchNodes()

  // Verify API was called with auth header
  expect(mockApi).toHaveBeenCalledWith(
    expect.objectContaining({
      headers: { Authorization: expect.any(String) }
    })
  )
})
```

### 3. Testing Plugins

```javascript
it('should persist favorites', () => {
  const pinia = createPinia()
  pinia.use(persistencePlugin)

  const store = useFavoritesStore(pinia)
  store.addFavorite(1)

  // Check localStorage
  const saved = JSON.parse(localStorage.getItem('pinia-favorites'))
  expect(saved.favoriteIds).toContain(1)
})
```

## Performance Considerations

### 1. Cache Effectively

- Use TTL to balance freshness vs performance
- Clear cache when user logs out
- Invalidate cache on mutations

### 2. Debounce Expensive Operations

```javascript
import { debounce } from 'lodash-es'

const debouncedSearch = debounce((query) => {
  searchNodes(query)
}, 300)
```

### 3. Lazy Load Stores

Only create stores when needed:

```javascript
// ❌ Created at module load
const store = useMyStore()

// ✅ Created when component mounts
onMounted(() => {
  const store = useMyStore()
})
```

### 4. Use Getters for Filtering

```javascript
// ✅ Cached and reactive
const activeItems = computed(() =>
  items.value.filter(item => item.active)
)

// ❌ Recalculates every time
function getActiveItems() {
  return items.value.filter(item => item.active)
}
```

## Common Pitfalls

### 1. Circular Store Dependencies

```javascript
// ❌ AVOID
// storeA imports storeB
// storeB imports storeA
// = Circular dependency!

// ✅ SOLUTION
// Create a third store for shared logic
// Or use events/composables
```

### 2. Memory Leaks in Cache

```javascript
// ❌ Cache grows forever
cache.set(key, value)

// ✅ Use TTL and cleanup
cache.set(key, value, 5 * 60 * 1000)
setInterval(cleanupExpired, 60 * 1000)
```

### 3. Not Handling Plugin Options

```javascript
// ❌ Plugin always runs
export function myPlugin({ store }) {
  // Runs for all stores
}

// ✅ Check options
export function myPlugin({ options, store }) {
  if (!options.myFeature) return
  // Only run when enabled
}
```

## Best Practices Summary

1. **Keep stores focused** - One responsibility per store
2. **Use plugins for cross-cutting concerns** - Logging, persistence, etc.
3. **Implement caching wisely** - Balance freshness and performance
4. **Use optimistic updates** - Better UX with rollback
5. **Deduplicate requests** - Prevent unnecessary API calls
6. **Test stores in isolation** - Unit test each store
7. **Document store APIs** - Clear function names and comments
8. **Handle errors gracefully** - Always have error states
9. **Monitor performance** - Use logger plugin in development
10. **Clean up resources** - Clear caches, cancel requests on unmount

## Resources

- [Pinia Documentation](https://pinia.vuejs.org/)
- [Pinia Plugins](https://pinia.vuejs.org/core-concepts/plugins.html)
- [Testing Pinia](https://pinia.vuejs.org/cookbook/testing.html)
- [Composition Patterns](https://vuejs.org/guide/reusability/composables.html)
