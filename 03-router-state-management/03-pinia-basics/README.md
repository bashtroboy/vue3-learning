# Lesson 3: Pinia State Management

## 🎯 Learning Objectives

- Understand why state management is needed
- Install and configure Pinia
- Create stores with `defineStore()`
- Use state, getters, and actions
- Access stores in components
- Persist state with plugins

## 📚 What You'll Build

A **Content Server Object Cache** with:
- Centralized node data storage
- User preferences store
- API integration
- State persistence

## 🔑 Key Concepts

### 1. Why State Management?

**Without State Management (Prop Drilling):**
```
App
 ├─ Sidebar (needs user data)
 │   └─ UserMenu (needs user data)
 └─ Content
     ├─ Header (needs user data)
     └─ Dashboard (needs user data)
```

**Problem:** Passing props through every component is tedious!

**With Pinia:**
```javascript
// Any component can access the store directly
const userStore = useUserStore()
const user = userStore.currentUser
```

### 2. Installing Pinia

```bash
npm install pinia
```

```javascript
// main.js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.mount('#app')
```

### 3. Creating a Store (Composition API Style)

```javascript
// stores/contentServer.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useContentServerStore = defineStore('contentServer', () => {
  // State (ref)
  const nodes = ref([])
  const currentNode = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // Getters (computed)
  const nodeCount = computed(() => nodes.value.length)

  const folderNodes = computed(() =>
    nodes.value.filter(node => node.type === 'folder')
  )

  const documentNodes = computed(() =>
    nodes.value.filter(node => node.type === 'document')
  )

  // Actions (functions)
  async function fetchNodes() {
    loading.value = true
    error.value = null

    try {
      const response = await api.getNodes()
      nodes.value = response.data
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  async function fetchNode(id) {
    loading.value = true

    try {
      const response = await api.getNode(id)
      currentNode.value = response.data

      // Cache the node
      const index = nodes.value.findIndex(n => n.id === id)
      if (index >= 0) {
        nodes.value[index] = response.data
      } else {
        nodes.value.push(response.data)
      }
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  function clearCache() {
    nodes.value = []
    currentNode.value = null
  }

  // Return everything you want to expose
  return {
    // State
    nodes,
    currentNode,
    loading,
    error,
    // Getters
    nodeCount,
    folderNodes,
    documentNodes,
    // Actions
    fetchNodes,
    fetchNode,
    clearCache
  }
})
```

### 4. Using Store in Components

```vue
<script setup>
import { useContentServerStore } from '@/stores/contentServer'
import { onMounted } from 'vue'

const store = useContentServerStore()

onMounted(() => {
  store.fetchNodes()
})

function loadNode(id) {
  store.fetchNode(id)
}
</script>

<template>
  <div>
    <div v-if="store.loading">Loading...</div>
    <div v-if="store.error">Error: {{ store.error }}</div>

    <div v-else>
      <p>Total nodes: {{ store.nodeCount }}</p>
      <p>Folders: {{ store.folderNodes.length }}</p>
      <p>Documents: {{ store.documentNodes.length }}</p>

      <div v-for="node in store.nodes" :key="node.id">
        <button @click="loadNode(node.id)">
          {{ node.name }}
        </button>
      </div>
    </div>
  </div>
</template>
```

### 5. Destructuring with `storeToRefs()`

```vue
<script setup>
import { storeToRefs } from 'pinia'
import { useContentServerStore } from '@/stores/contentServer'

const store = useContentServerStore()

// ❌ This loses reactivity!
const { nodes, loading } = store

// ✅ This maintains reactivity
const { nodes, loading, nodeCount } = storeToRefs(store)

// Actions can be destructured normally
const { fetchNodes, clearCache } = store
</script>

<template>
  <div>
    <!-- ✅ Reactive! -->
    <div v-if="loading">Loading...</div>
    <div>Count: {{ nodeCount }}</div>

    <button @click="fetchNodes">Refresh</button>
  </div>
</template>
```

### 6. Options API Style (Alternative)

```javascript
// stores/counter.js
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', {
  // State
  state: () => ({
    count: 0,
    name: 'Counter'
  }),

  // Getters
  getters: {
    doubleCount: (state) => state.count * 2,

    // Access other getters
    quadrupleCount() {
      return this.doubleCount * 2
    }
  },

  // Actions
  actions: {
    increment() {
      this.count++
    },

    async fetchData() {
      const response = await api.getData()
      this.count = response.count
    }
  }
})
```

## 🎨 Common Patterns

### Pattern 1: User Preferences Store

```javascript
// stores/preferences.js
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePreferencesStore = defineStore('preferences', () => {
  const theme = ref('light')
  const itemsPerPage = ref(25)
  const defaultView = ref('list')

  function setTheme(newTheme) {
    theme.value = newTheme
    // Save to localStorage
    localStorage.setItem('theme', newTheme)
  }

  function setItemsPerPage(count) {
    itemsPerPage.value = count
    localStorage.setItem('itemsPerPage', count)
  }

  function loadPreferences() {
    theme.value = localStorage.getItem('theme') || 'light'
    itemsPerPage.value = parseInt(localStorage.getItem('itemsPerPage')) || 25
    defaultView.value = localStorage.getItem('defaultView') || 'list'
  }

  // Load on initialization
  loadPreferences()

  return {
    theme,
    itemsPerPage,
    defaultView,
    setTheme,
    setItemsPerPage,
    loadPreferences
  }
})
```

### Pattern 2: API Integration Pattern

```javascript
// stores/api-pattern.js
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useDataStore = defineStore('data', () => {
  const items = ref([])
  const loading = ref(false)
  const error = ref(null)

  async function fetchItems() {
    loading.value = true
    error.value = null

    try {
      const response = await api.getItems()
      items.value = response.data
      return response.data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function createItem(data) {
    loading.value = true

    try {
      const response = await api.createItem(data)
      items.value.push(response.data)
      return response.data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateItem(id, data) {
    loading.value = true

    try {
      const response = await api.updateItem(id, data)
      const index = items.value.findIndex(item => item.id === id)
      if (index >= 0) {
        items.value[index] = response.data
      }
      return response.data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteItem(id) {
    loading.value = true

    try {
      await api.deleteItem(id)
      items.value = items.value.filter(item => item.id !== id)
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    items,
    loading,
    error,
    fetchItems,
    createItem,
    updateItem,
    deleteItem
  }
})
```

### Pattern 3: Optimistic Updates

```javascript
async function deleteNode(id) {
  // Store original state
  const originalNodes = [...nodes.value]

  // Optimistic update - remove immediately
  nodes.value = nodes.value.filter(n => n.id !== id)

  try {
    await api.deleteNode(id)
    // Success! Keep the optimistic update
  } catch (err) {
    // Rollback on error
    nodes.value = originalNodes
    error.value = 'Failed to delete node'
  }
}
```

## 💡 Best Practices

1. **One store per domain** - User, Content Server, Preferences, etc.
2. **Use Composition API style** - Better TypeScript support
3. **Keep actions async** - All API calls in actions
4. **Use storeToRefs for destructuring** - Maintains reactivity
5. **Initialize in actions** - Not in state definitions
6. **Return explicit values** - Don't return entire state object

## ⚠️ Common Mistakes

1. **Destructuring without storeToRefs**
   ```javascript
   // ❌ Loses reactivity
   const { count } = useCounterStore()

   // ✅ Maintains reactivity
   const { count } = storeToRefs(useCounterStore())
   ```

2. **Modifying state outside actions**
   ```javascript
   // ❌ Direct modification (works but not recommended)
   store.count++

   // ✅ Use actions
   store.increment()
   ```

3. **Creating store outside setup**
   ```javascript
   // ❌ Don't create at module level
   const store = useMyStore()

   export default {
     setup() {
       // ✅ Create in setup
       const store = useMyStore()
     }
   }
   ```

## 🎯 Exercises

1. Create a Content Server node cache store
2. Build a user preferences store
3. Implement favorites functionality
4. Add state persistence
5. Create a search history store

## 🔗 Next Steps

- [Lesson 4: Pinia Advanced](../04-pinia-advanced/README.md)
- Read NOTES.md for detailed explanations
- Complete the exercises

---

**Time:** 2-3 hours | **Difficulty:** Intermediate
