# Pinia Basics - Detailed Notes

## Overview

This demo showcases **Pinia state management** with a Content Server node cache application. You'll learn how to create stores, manage state, use getters and actions, and persist data.

## What This Demo Shows

### 1. Store Creation (Composition API Style)

**Why Composition API style?**
- Better TypeScript support
- More flexible composition
- Familiar to Vue 3 Composition API users
- Easier to test

**Content Server Store** (`stores/contentServer.js`):
- Manages node data (folders and documents)
- Handles loading states and errors
- Provides getters for filtered data
- Implements caching logic

**Preferences Store** (`stores/preferences.js`):
- Stores user preferences (theme, view mode, items per page)
- Persists to localStorage
- Auto-loads on initialization

### 2. State Management Patterns

**State (ref):**
```javascript
const nodes = ref([])
const loading = ref(false)
const error = ref(null)
```
- Use `ref()` for reactive state
- Similar to component state

**Getters (computed):**
```javascript
const nodeCount = computed(() => nodes.value.length)
const folderNodes = computed(() =>
  nodes.value.filter(node => node.type === 'folder')
)
```
- Use `computed()` for derived state
- Automatically updates when dependencies change
- Cached until dependencies change

**Actions (functions):**
```javascript
async function fetchNodes() {
  loading.value = true
  try {
    // Simulate API call
    const response = await mockApi.getNodes()
    nodes.value = response.data
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}
```
- Regular async functions
- Can modify state
- Can call other actions
- Can use other stores

### 3. Using Stores in Components

**Direct Access:**
```vue
<script setup>
import { useContentServerStore } from '@/stores/contentServer'

const store = useContentServerStore()

// Access state
console.log(store.nodes)

// Call actions
store.fetchNodes()
</script>

<template>
  <div>{{ store.nodeCount }}</div>
</template>
```

**With Destructuring:**
```vue
<script setup>
import { storeToRefs } from 'pinia'
import { useContentServerStore } from '@/stores/contentServer'

const store = useContentServerStore()

// Destructure state/getters (maintains reactivity)
const { nodes, loading, nodeCount } = storeToRefs(store)

// Destructure actions (no need for storeToRefs)
const { fetchNodes, clearCache } = store
</script>
```

### 4. Multi-Store Coordination

This demo shows how multiple stores work together:

1. **Content Server Store** - Main data
2. **Preferences Store** - User settings

Components can use multiple stores:
```javascript
const contentStore = useContentServerStore()
const prefsStore = usePreferencesStore()

// Use data from both
const itemsToShow = computed(() =>
  contentStore.nodes.slice(0, prefsStore.itemsPerPage)
)
```

### 5. State Persistence

The Preferences store demonstrates manual persistence:

```javascript
function setTheme(newTheme) {
  theme.value = newTheme
  // Save to localStorage
  localStorage.setItem('pinia-preferences-theme', newTheme)
}

function loadPreferences() {
  const savedTheme = localStorage.getItem('pinia-preferences-theme')
  if (savedTheme) {
    theme.value = savedTheme
  }
}

// Load on store creation
loadPreferences()
```

**Why manual persistence here?**
- Educational: Shows how it works under the hood
- Simple: No plugins needed for basic cases
- In Lesson 4, we'll use a persistence plugin

### 6. Mock API Pattern

This demo uses a mock API to simulate async operations:

```javascript
// Simulate network delay
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export const mockApi = {
  async getNodes() {
    await delay(500)
    return { data: mockNodes }
  },

  async getNode(id) {
    await delay(300)
    const node = mockNodes.find(n => n.id === id)
    if (!node) throw new Error('Node not found')
    return { data: node }
  }
}
```

**Benefits:**
- No backend needed
- Predictable data
- Test loading states
- Simulate errors

## Key Takeaways

### 1. When to Use Pinia

**Use Pinia when:**
- Multiple components need the same data
- Data needs to persist across route changes
- You have complex state logic
- You need global state management

**Don't use Pinia for:**
- Component-local state (use `ref`/`reactive`)
- Simple prop passing (1-2 levels)
- Temporary UI state

### 2. Store Organization

**One store per domain:**
- `useContentServerStore` - Content Server data
- `usePreferencesStore` - User preferences
- `useAuthStore` - Authentication (Lesson 4)
- `useFavoritesStore` - User favorites (Lesson 4)

**Don't create:**
- A single giant store (hard to maintain)
- Too many tiny stores (overhead)

### 3. Composition API vs Options API

**Composition API (used here):**
```javascript
export const useStore = defineStore('store', () => {
  const count = ref(0)
  const doubleCount = computed(() => count.value * 2)
  function increment() { count.value++ }
  return { count, doubleCount, increment }
})
```

**Options API (alternative):**
```javascript
export const useStore = defineStore('store', {
  state: () => ({ count: 0 }),
  getters: {
    doubleCount: (state) => state.count * 2
  },
  actions: {
    increment() { this.count++ }
  }
})
```

**Recommendation:** Use Composition API for:
- Better TypeScript support
- More flexibility
- Easier testing
- Consistency with Vue 3 Composition API

### 4. Common Patterns Demonstrated

**Loading Pattern:**
```javascript
async function fetchData() {
  loading.value = true
  error.value = null

  try {
    const response = await api.getData()
    data.value = response.data
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}
```

**Cache Pattern:**
```javascript
async function fetchNode(id) {
  // Check cache first
  const cached = nodes.value.find(n => n.id === id)
  if (cached) return cached

  // Fetch from API
  const response = await api.getNode(id)

  // Update cache
  nodes.value.push(response.data)

  return response.data
}
```

**Filter Pattern:**
```javascript
const folderNodes = computed(() =>
  nodes.value.filter(node => node.type === 'folder')
)

const searchResults = computed(() => {
  if (!searchQuery.value) return nodes.value

  return nodes.value.filter(node =>
    node.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})
```

## Common Mistakes to Avoid

### 1. Losing Reactivity

```javascript
// ❌ WRONG - Loses reactivity!
const { count } = useCounterStore()

// ✅ CORRECT - Maintains reactivity
const { count } = storeToRefs(useCounterStore())
```

### 2. Creating Stores Outside Setup

```javascript
// ❌ WRONG - Outside setup
const store = useMyStore()

export default {
  setup() {
    // store might not work correctly
  }
}

// ✅ CORRECT - Inside setup
export default {
  setup() {
    const store = useMyStore()
  }
}
```

### 3. Direct State Mutation (in Options API)

```javascript
// In Composition API: ✅ OK
store.count++

// Better practice: Use actions
store.increment()
```

### 4. Forgetting to Return from Store

```javascript
// ❌ WRONG - Forgot to return
export const useStore = defineStore('store', () => {
  const count = ref(0)
  // Missing return!
})

// ✅ CORRECT
export const useStore = defineStore('store', () => {
  const count = ref(0)
  return { count }
})
```

## Testing the Demo

### Things to Try

1. **View Nodes**
   - Click "Load Nodes" to fetch all nodes
   - Observe the loading state
   - See folders and documents appear

2. **View Node Details**
   - Click on any node card
   - Navigate to detail page
   - See breadcrumb navigation

3. **Change Preferences**
   - Open preferences panel
   - Change theme (light/dark)
   - Change items per page
   - Change default view (list/grid)
   - Refresh page - settings persist!

4. **Filter Nodes**
   - Use the filter buttons (All/Folders/Documents)
   - See computed getters in action

5. **Clear Cache**
   - Click "Clear Cache"
   - See nodes cleared
   - Reload to fetch again

### Open DevTools

In Vue DevTools, you can:
- Inspect Pinia stores
- View state in real-time
- See getters update
- Track actions being called
- Modify state directly (for debugging)

## Next Steps

After completing this lesson, you should understand:
- ✅ How to create stores with `defineStore()`
- ✅ Using state, getters, and actions
- ✅ Accessing stores in components
- ✅ `storeToRefs()` for destructuring
- ✅ Basic state persistence
- ✅ Mock API patterns

**Continue to Lesson 4** to learn:
- Advanced store composition
- Pinia plugins
- Advanced caching with TTL
- Optimistic updates
- Request deduplication
- TypeScript integration

## Resources

- [Pinia Documentation](https://pinia.vuejs.org/)
- [Vue 3 Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)
- [Pinia vs Vuex](https://pinia.vuejs.org/introduction.html#comparison-with-vuex)
