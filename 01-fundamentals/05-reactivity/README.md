# Deep Dive Reactivity: watch & watchEffect

## What We're Building

A **Reactivity Demonstration Dashboard** that showcases all the ways to watch and react to data changes in Vue 3, including:
- Auto-saving user preferences with `watchEffect`
- Debounced search with `watch`
- Deep watching nested objects
- Watching multiple sources simultaneously
- Stoppable watchers
- Flush timing control

This lesson builds on previous lessons to master reactive programming patterns essential for real-world applications.

## Key Concepts Learned

1. **watchEffect** - Automatic dependency tracking that runs immediately
2. **watch** - Explicit watching with access to old and new values
3. **Deep Watching** - Tracking changes in nested objects and arrays
4. **Multiple Sources** - Watching several reactive values at once
5. **Stopping Watchers** - Cleanup and lifecycle management
6. **Flush Timing** - Control when watchers execute relative to DOM updates
7. **Immediate Execution** - Running watchers immediately on creation
8. **Debouncing** - Delaying execution to reduce frequency

## Features

### 1. watchEffect - Auto-Save Preferences

```vue
<script setup>
import { reactive, watchEffect } from 'vue'

const preferences = reactive({
  darkMode: false,
  notifications: true,
  fontSize: 16
})

// watchEffect runs immediately and tracks all dependencies automatically
watchEffect(() => {
  // Any reactive property accessed here is automatically tracked
  const data = JSON.stringify(preferences)
  localStorage.setItem('userPreferences', data)
  console.log('Preferences saved!')
})
</script>
```

**When to use watchEffect:**
- Auto-saving data
- Syncing to external systems
- Side effects that depend on multiple reactive properties
- When you don't need the old value

### 2. watch - Explicit Watching with Old/New Values

```vue
<script setup>
import { ref, watch } from 'vue'

const searchQuery = ref('')

// watch gives you both old and new values
watch(searchQuery, (newValue, oldValue) => {
  console.log(`Search changed from "${oldValue}" to "${newValue}"`)

  // You can implement debouncing, validation, etc.
  performSearch(newValue)
})
</script>
```

**When to use watch:**
- Comparing old vs new values
- Debouncing or throttling
- Conditional execution based on the change
- Async operations triggered by changes

### 3. Deep Watching Nested Objects

```vue
<script setup>
import { reactive, watch } from 'vue'

const user = reactive({
  name: 'John',
  contact: {
    email: 'john@example.com',
    phone: '555-0100'
  },
  tags: ['developer']
})

// Deep watch tracks ALL nested property changes
watch(user, (newUser) => {
  console.log('User data changed anywhere in the object!')
  saveUserData(newUser)
}, { deep: true })

// This will trigger the watcher:
user.contact.email = 'newemail@example.com'
user.tags.push('vue')
</script>
```

**Deep watch options:**
- `{ deep: true }` - Watch all nested properties
- Performance consideration: Deep watching can be expensive for large objects
- Alternative: Watch specific nested properties individually

### 4. Watching Multiple Sources

```vue
<script setup>
import { reactive, ref, watch } from 'vue'

const dimensions = reactive({ width: 10, height: 5 })
const pricePerUnit = ref(2.5)

// Watch multiple sources - array of sources
watch(
  [() => dimensions.width, () => dimensions.height, pricePerUnit],
  ([newWidth, newHeight, newPrice], [oldWidth, oldHeight, oldPrice]) => {
    console.log('Any of the watched values changed!')
    const area = newWidth * newHeight
    const total = area * newPrice
    console.log(`Total cost: $${total}`)
  }
)
</script>
```

**Multiple source patterns:**
- Array of refs: `[ref1, ref2, ref3]`
- Array of getters: `[() => obj.prop1, () => obj.prop2]`
- Mixed: `[someRef, () => reactive.prop]`

### 5. Stopping Watchers

```vue
<script setup>
import { ref, watch } from 'vue'

const counter = ref(0)
let stopWatcher

function startWatching() {
  // watch returns a stop function
  stopWatcher = watch(counter, (newVal) => {
    console.log(`Counter: ${newVal}`)

    // Auto-stop at 10
    if (newVal >= 10) {
      stopWatcher()
      console.log('Watcher stopped!')
    }
  })
}

function manualStop() {
  if (stopWatcher) {
    stopWatcher()
  }
}
</script>
```

**When to stop watchers:**
- Cleanup on component unmount (though Vue does this automatically)
- Conditional watching (start/stop based on application state)
- Performance optimization (stop when no longer needed)
- Preventing memory leaks in long-running apps

### 6. Flush Timing Control

```vue
<script setup>
import { ref, watch } from 'vue'

const count = ref(0)

// Pre flush - runs BEFORE DOM updates (default for watchEffect)
watch(count, (newVal) => {
  console.log('[PRE] Before DOM update')
}, { flush: 'pre' })

// Post flush - runs AFTER DOM updates (default for watch)
watch(count, (newVal) => {
  console.log('[POST] After DOM update - DOM is updated')
}, { flush: 'post' })

// Sync flush - runs SYNCHRONOUSLY (use sparingly!)
watch(count, (newVal) => {
  console.log('[SYNC] Runs immediately')
}, { flush: 'sync' })
</script>
```

**Flush timing options:**
- `pre` - Before component updates (good for side effects)
- `post` - After DOM updates (good for DOM manipulation)
- `sync` - Synchronously (rarely needed, can hurt performance)

## Complete Examples

### Example: Debounced Search

```vue
<script setup>
import { ref, watch } from 'vue'

const searchQuery = ref('')
const searchResults = ref([])
const isSearching = ref(false)

let searchTimeout

watch(searchQuery, (newQuery) => {
  // Clear previous timeout
  clearTimeout(searchTimeout)

  if (!newQuery) {
    searchResults.value = []
    return
  }

  isSearching.value = true

  // Debounce by 500ms
  searchTimeout = setTimeout(async () => {
    searchResults.value = await fetchResults(newQuery)
    isSearching.value = false
  }, 500)
})
</script>
```

### Example: Form Validation with Old/New Comparison

```vue
<script setup>
import { ref, watch } from 'vue'

const password = ref('')
const confirmPassword = ref('')
const error = ref('')

watch([password, confirmPassword], ([newPass, newConfirm]) => {
  if (!newConfirm) {
    error.value = ''
    return
  }

  if (newPass !== newConfirm) {
    error.value = 'Passwords do not match'
  } else {
    error.value = ''
  }
})
</script>
```

### Example: Sync to External System

```vue
<script setup>
import { reactive, watchEffect } from 'vue'

const state = reactive({
  user: null,
  settings: {},
  preferences: {}
})

// Automatically sync to localStorage whenever ANY property changes
watchEffect(() => {
  const serialized = JSON.stringify(state)
  localStorage.setItem('appState', serialized)
})

// Automatically sync to analytics
watchEffect(() => {
  if (state.user) {
    analytics.identify(state.user.id, {
      settings: state.settings,
      preferences: state.preferences
    })
  }
})
</script>
```

## watch vs watchEffect: Quick Reference

| Feature | watch | watchEffect |
|---------|-------|-------------|
| **When it runs** | Only when watched source changes | Immediately + when dependencies change |
| **Dependencies** | Explicit (you specify) | Automatic (tracks what you use) |
| **Old value** | ✅ Available | ❌ Not available |
| **Lazy by default** | ✅ Yes (use `immediate: true` to change) | ❌ No, runs immediately |
| **Default flush** | `post` | `pre` |
| **Use case** | Specific sources, need old value, debouncing | Auto-tracking, side effects, syncing |

## Common Patterns

### 1. Auto-save with Debounce

```vue
<script setup>
import { reactive, watch } from 'vue'

const formData = reactive({ /* ... */ })
let saveTimeout

watch(formData, () => {
  clearTimeout(saveTimeout)
  saveTimeout = setTimeout(() => {
    saveToServer(formData)
  }, 1000)
}, { deep: true })
</script>
```

### 2. Fetch Data on Route Change

```vue
<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const data = ref(null)

watch(() => route.params.id, async (newId) => {
  data.value = await fetchData(newId)
}, { immediate: true })
</script>
```

### 3. Sync Reactive State to URL Query

```vue
<script setup>
import { reactive, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const filters = reactive({
  search: '',
  category: 'all',
  sort: 'date'
})

watch(filters, (newFilters) => {
  router.push({
    query: newFilters
  })
}, { deep: true })
</script>
```

## Getting Started

```bash
cd 01-fundamentals/05-reactivity

# Install dependencies
npm install

# Run development server
npm run dev
```

Opens `http://localhost:5173` with hot reload.

## Project Structure

```
05-reactivity/
├── index.html              # Entry point
├── vite.config.js          # Vite configuration
├── package.json            # Dependencies
├── src/
│   ├── main.js             # App initialization
│   └── App.vue             # Main demo with 6 examples
├── README.md               # This file
└── NOTES.md                # Deep-dive technical notes
```

## What You'll Learn

1. ✅ **watchEffect** - Automatic dependency tracking
2. ✅ **watch** - Explicit watching with old/new values
3. ✅ **Deep watching** - Nested object tracking
4. ✅ **Multiple sources** - Watch arrays of values
5. ✅ **Stopping watchers** - Lifecycle management
6. ✅ **Flush timing** - Control execution timing
7. ✅ **Immediate option** - Run immediately on creation
8. ✅ **Debouncing** - Delay execution patterns

## Exercises

Try these challenges to master reactivity:

1. **Exercise 1**: Add a "undo" feature that tracks the last 5 changes to the user object
2. **Exercise 2**: Create a countdown timer that stops automatically at 0
3. **Exercise 3**: Implement a "shopping cart total" that watches items and prices
4. **Exercise 4**: Build an auto-complete search with debouncing
5. **Exercise 5**: Create a form validator that watches multiple fields and shows errors

## Common Pitfalls

### ❌ Watching non-reactive values

```vue
<script setup>
let count = 0 // Plain variable, not reactive!

watch(count, () => {
  // This will NOT work - count is not reactive
})
</script>
```

### ✅ Correct approach

```vue
<script setup>
import { ref, watch } from 'vue'

const count = ref(0) // Reactive!

watch(count, () => {
  // This works!
})
</script>
```

### ❌ Forgetting to return cleanup function

```vue
<script setup>
watchEffect(() => {
  const interval = setInterval(() => {
    console.log('tick')
  }, 1000)

  // Missing cleanup! This will leak
})
</script>
```

### ✅ Proper cleanup

```vue
<script setup>
watchEffect((onCleanup) => {
  const interval = setInterval(() => {
    console.log('tick')
  }, 1000)

  // Cleanup when effect re-runs or component unmounts
  onCleanup(() => {
    clearInterval(interval)
  })
})
</script>
```

## Next Steps

After mastering reactivity, you're ready for:
- **Lesson 6**: Composables - Extract reusable reactive logic
- **Project 1**: Content Server Node Browser with reactive data fetching
- **Advanced**: Custom reactive utilities and patterns

## Relationship to Application Analyzer

The **Application Analyzer** uses these reactivity patterns extensively:
- **watchEffect** for auto-syncing analysis results to the UI
- **watch** for monitoring file changes and triggering re-analysis
- **Deep watching** for tracking complex configuration objects
- **Debouncing** for search and filter operations

## Additional Resources

- [Vue 3 Reactivity API Docs](https://vuejs.org/api/reactivity-core.html)
- [Reactivity Fundamentals](https://vuejs.org/guide/essentials/reactivity-fundamentals.html)
- [Watchers Guide](https://vuejs.org/guide/essentials/watchers.html)

---

**You've completed Lesson 5!** 🎉 You now understand how to create reactive, responsive applications that automatically sync data and respond to changes. Next up: extracting this logic into reusable composables!
