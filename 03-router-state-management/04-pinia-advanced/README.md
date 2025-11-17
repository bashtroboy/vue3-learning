# Lesson 4: Pinia Advanced Patterns

## 🎯 Learning Objectives

- Compose multiple stores together
- Create Pinia plugins for persistence and logging
- Implement advanced caching strategies
- Handle complex async operations
- Test stores effectively
- Use TypeScript with Pinia

## 📚 What You'll Build

A **Multi-Store Content Server Application** with:
- Multiple interconnected stores
- Automatic persistence plugin
- Advanced caching with TTL
- Optimistic updates with rollback

## 🔑 Key Concepts

### 1. Using Multiple Stores

```javascript
// stores/auth.js
export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(null)

  return { user, token }
})

// stores/nodes.js
import { useAuthStore } from './auth'

export const useNodesStore = defineStore('nodes', () => {
  const auth = useAuthStore()  // ✅ Use other stores!

  const nodes = ref([])

  async function fetchNodes() {
    // Access auth store data
    const headers = { Authorization: `Bearer ${auth.token}` }
    const response = await api.getNodes({ headers })
    nodes.value = response.data
  }

  return { nodes, fetchNodes }
})
```

### 2. Store Composition Pattern

```javascript
// composables/useNodeManagement.js
import { useNodesStore } from '@/stores/nodes'
import { useAuthStore } from '@/stores/auth'
import { useUIStore } from '@/stores/ui'

export function useNodeManagement() {
  const nodesStore = useNodesStore()
  const authStore = useAuthStore()
  const uiStore = useUIStore()

  async function loadAndDisplayNode(id) {
    uiStore.setLoading(true)

    try {
      await nodesStore.fetchNode(id)
      uiStore.showNotification('Node loaded successfully')
    } catch (error) {
      if (error.status === 401) {
        authStore.logout()
      }
      uiStore.showError(error.message)
    } finally {
      uiStore.setLoading(false)
    }
  }

  return {
    loadAndDisplayNode
  }
}
```

### 3. Pinia Plugins

**Persistence Plugin:**
```javascript
// plugins/persistence.js
export function persistencePlugin({ store }) {
  // Load state from localStorage on init
  const savedState = localStorage.getItem(store.$id)
  if (savedState) {
    store.$patch(JSON.parse(savedState))
  }

  // Save state to localStorage on every change
  store.$subscribe((mutation, state) => {
    localStorage.setItem(store.$id, JSON.stringify(state))
  })
}

// main.js
import { createPinia } from 'pinia'
import { persistencePlugin } from './plugins/persistence'

const pinia = createPinia()
pinia.use(persistencePlugin)
```

**Logger Plugin:**
```javascript
// plugins/logger.js
export function loggerPlugin({ store }) {
  store.$onAction(({ name, args, after, onError }) => {
    const startTime = Date.now()

    console.log(`[${store.$id}] Action "${name}" called with:`, args)

    after((result) => {
      console.log(
        `[${store.$id}] Action "${name}" completed in ${Date.now() - startTime}ms`,
        result
      )
    })

    onError((error) => {
      console.error(`[${store.$id}] Action "${name}" failed:`, error)
    })
  })
}
```

**Selective Persistence Plugin:**
```javascript
// plugins/selectivePersistence.js
export function selectivePersistencePlugin({ options, store }) {
  if (options.persist) {
    const savedState = localStorage.getItem(store.$id)
    if (savedState) {
      const parsed = JSON.parse(savedState)

      // Only restore specified fields
      const toRestore = {}
      for (const key of options.persist) {
        if (key in parsed) {
          toRestore[key] = parsed[key]
        }
      }

      store.$patch(toRestore)
    }

    store.$subscribe((mutation, state) => {
      // Only save specified fields
      const toPersist = {}
      for (const key of options.persist) {
        if (key in state) {
          toPersist[key] = state[key]
        }
      }

      localStorage.setItem(store.$id, JSON.stringify(toPersist))
    })
  }
}

// Usage
export const usePreferencesStore = defineStore('preferences', () => {
  const theme = ref('light')
  const tempData = ref(null)  // Won't be persisted

  return { theme, tempData }
}, {
  persist: ['theme']  // Only persist theme
})
```

### 4. Advanced Caching with TTL

```javascript
// stores/cache.js
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCacheStore = defineStore('cache', () => {
  const cache = ref(new Map())

  function set(key, value, ttl = 5 * 60 * 1000) {  // 5 min default
    cache.value.set(key, {
      value,
      expires: Date.now() + ttl
    })
  }

  function get(key) {
    const item = cache.value.get(key)

    if (!item) return null

    // Check if expired
    if (Date.now() > item.expires) {
      cache.value.delete(key)
      return null
    }

    return item.value
  }

  function has(key) {
    return get(key) !== null
  }

  function clear() {
    cache.value.clear()
  }

  function clearExpired() {
    const now = Date.now()
    for (const [key, item] of cache.value.entries()) {
      if (now > item.expires) {
        cache.value.delete(key)
      }
    }
  }

  // Clear expired items every minute
  setInterval(clearExpired, 60 * 1000)

  return { set, get, has, clear, clearExpired }
})

// Usage in another store
export const useNodesStore = defineStore('nodes', () => {
  const cache = useCacheStore()

  async function fetchNode(id) {
    // Check cache first
    const cached = cache.get(`node-${id}`)
    if (cached) {
      return cached
    }

    // Fetch from API
    const response = await api.getNode(id)

    // Cache for 5 minutes
    cache.set(`node-${id}`, response.data)

    return response.data
  }

  return { fetchNode }
})
```

### 5. Optimistic Updates with Rollback

```javascript
// stores/todos.js
export const useTodosStore = defineStore('todos', () => {
  const todos = ref([])

  async function toggleTodo(id) {
    // Find todo
    const todo = todos.value.find(t => t.id === id)
    if (!todo) return

    // Save original state
    const originalCompleted = todo.completed

    // Optimistic update
    todo.completed = !todo.completed

    try {
      // Make API call
      await api.updateTodo(id, { completed: todo.completed })
    } catch (error) {
      // Rollback on error
      todo.completed = originalCompleted

      // Show error
      console.error('Failed to update todo:', error)
      throw error
    }
  }

  async function deleteTodo(id) {
    // Find index
    const index = todos.value.findIndex(t => t.id === id)
    if (index === -1) return

    // Save original
    const originalTodo = todos.value[index]

    // Optimistic removal
    todos.value.splice(index, 1)

    try {
      await api.deleteTodo(id)
    } catch (error) {
      // Rollback - restore at original position
      todos.value.splice(index, 0, originalTodo)
      throw error
    }
  }

  return { todos, toggleTodo, deleteTodo }
})
```

### 6. Async Queue Pattern

```javascript
// stores/queue.js
export const useQueueStore = defineStore('queue', () => {
  const queue = ref([])
  const processing = ref(false)

  async function addToQueue(action) {
    queue.value.push(action)
    await processQueue()
  }

  async function processQueue() {
    if (processing.value || queue.value.length === 0) return

    processing.value = true

    while (queue.value.length > 0) {
      const action = queue.value[0]

      try {
        await action()
        queue.value.shift()  // Remove from queue
      } catch (error) {
        console.error('Queue action failed:', error)
        // Optionally: remove from queue or retry
        queue.value.shift()
      }
    }

    processing.value = false
  }

  return { queue, processing, addToQueue }
})

// Usage
const queueStore = useQueueStore()

// Add actions to queue
queueStore.addToQueue(() => api.updateNode(1, data))
queueStore.addToQueue(() => api.updateNode(2, data))
queueStore.addToQueue(() => api.updateNode(3, data))
// All execute in order!
```

## 🎨 Advanced Patterns

### Pattern 1: Request Deduplication

```javascript
export const useAPIStore = defineStore('api', () => {
  const pendingRequests = ref(new Map())

  async function fetchNode(id) {
    const key = `node-${id}`

    // Return pending request if exists
    if (pendingRequests.value.has(key)) {
      return pendingRequests.value.get(key)
    }

    // Create new request
    const promise = api.getNode(id).then(response => {
      pendingRequests.value.delete(key)
      return response.data
    }).catch(error => {
      pendingRequests.value.delete(key)
      throw error
    })

    pendingRequests.value.set(key, promise)
    return promise
  }

  return { fetchNode }
})
```

### Pattern 2: Store Reset

```javascript
export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const name = ref('Counter')

  function $reset() {
    count.value = 0
    name.value = 'Counter'
  }

  return { count, name, $reset }
})

// Usage
const store = useCounterStore()
store.$reset()  // Reset to initial state
```

### Pattern 3: TypeScript Support

```typescript
// stores/nodes.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

interface Node {
  id: number
  name: string
  type: 'folder' | 'document'
  parent_id: number | null
}

interface NodeState {
  nodes: Node[]
  loading: boolean
  error: string | null
}

export const useNodesStore = defineStore('nodes', () => {
  // Typed state
  const nodes = ref<Node[]>([])
  const loading = ref<boolean>(false)
  const error = ref<string | null>(null)

  // Typed getters
  const folderCount = computed<number>(() =>
    nodes.value.filter(n => n.type === 'folder').length
  )

  // Typed actions
  async function fetchNode(id: number): Promise<Node> {
    loading.value = true

    try {
      const response = await api.getNode<Node>(id)
      return response.data
    } catch (err) {
      error.value = (err as Error).message
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    nodes,
    loading,
    error,
    folderCount,
    fetchNode
  }
})
```

## 💡 Best Practices

1. **Use stores composition** - Stores can use other stores
2. **Create plugins for cross-cutting concerns** - Logging, persistence, etc.
3. **Implement caching** - Reduce API calls
4. **Use optimistic updates** - Better UX
5. **Add TypeScript** - Better type safety
6. **Test your stores** - Unit test actions and getters
7. **Handle errors gracefully** - Show user-friendly messages

## 🎯 Exercises

1. Create a multi-store application
2. Build a persistence plugin
3. Implement caching with TTL
4. Add optimistic updates
5. Create a request queue system

## 🔗 Next Steps

- [Lesson 5: Exercise](../05-exercise-content-server-app/README.md)
- Read NOTES.md for testing strategies
- Complete all exercises

---

**Time:** 2-3 hours | **Difficulty:** Advanced
