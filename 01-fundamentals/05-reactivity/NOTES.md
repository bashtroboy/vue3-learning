# Deep Dive: Vue 3 Reactivity - watch & watchEffect

## Table of Contents

1. [Introduction to Reactive Programming](#introduction-to-reactive-programming)
2. [Understanding Reactivity in Vue 3](#understanding-reactivity-in-vue-3)
3. [watchEffect - Automatic Dependency Tracking](#watcheffect---automatic-dependency-tracking)
4. [watch - Explicit Watching](#watch---explicit-watching)
5. [Deep Watching](#deep-watching)
6. [Watching Multiple Sources](#watching-multiple-sources)
7. [Stopping and Cleanup](#stopping-and-cleanup)
8. [Flush Timing](#flush-timing)
9. [Advanced Patterns](#advanced-patterns)
10. [Performance Considerations](#performance-considerations)
11. [Common Pitfalls and Solutions](#common-pitfalls-and-solutions)
12. [Real-World Use Cases](#real-world-use-cases)

---

## Introduction to Reactive Programming

**Reactive programming** is a programming paradigm oriented around data flows and the propagation of change. In simple terms: when data changes, things that depend on that data automatically update.

### Traditional Imperative Approach

```javascript
let price = 10
let quantity = 2
let total = price * quantity // total = 20

price = 15
// total is still 20 - we need to manually recalculate!
total = price * quantity // total = 30
```

### Reactive Approach

```vue
<script setup>
import { ref, computed } from 'vue'

const price = ref(10)
const quantity = ref(2)
const total = computed(() => price.value * quantity.value)

console.log(total.value) // 20

price.value = 15
console.log(total.value) // 30 - automatically updated!
</script>
```

---

## Understanding Reactivity in Vue 3

Vue 3 uses **JavaScript Proxies** to create reactive objects. When you access or modify reactive data, Vue tracks those operations.

### The Reactivity Primitives

```vue
<script setup>
import { ref, reactive, computed } from 'vue'

// ref - for primitive values and object references
const count = ref(0)
const user = ref({ name: 'John' })

// reactive - for objects (automatically deep)
const state = reactive({
  count: 0,
  user: { name: 'John' }
})

// computed - derived reactive values
const doubleCount = computed(() => count.value * 2)
</script>
```

### How Vue Tracks Dependencies

```javascript
// Simplified version of how Vue tracks dependencies
let activeEffect = null

function watchEffect(fn) {
  activeEffect = fn
  fn() // Run the function, which triggers getters
  activeEffect = null
}

// In a reactive object's getter
function get(target, key) {
  const value = target[key]

  // Track: activeEffect depends on this property
  if (activeEffect) {
    track(target, key, activeEffect)
  }

  return value
}

// In a reactive object's setter
function set(target, key, value) {
  target[key] = value

  // Trigger: run all effects that depend on this property
  trigger(target, key)
}
```

---

## watchEffect - Automatic Dependency Tracking

`watchEffect` immediately runs a function and automatically tracks any reactive dependencies it accesses.

### Basic Syntax

```vue
<script setup>
import { ref, watchEffect } from 'vue'

const count = ref(0)

// Runs immediately and whenever count changes
watchEffect(() => {
  console.log(`Count is: ${count.value}`)
})

// Output immediately: "Count is: 0"
count.value++ // Output: "Count is: 1"
</script>
```

### How watchEffect Works

1. **Immediate execution**: Runs the function immediately
2. **Dependency tracking**: Tracks all reactive properties accessed
3. **Re-run on change**: Automatically re-runs when any dependency changes
4. **Returns cleanup**: Returns a function to stop watching

```vue
<script setup>
import { ref, watchEffect } from 'vue'

const firstName = ref('John')
const lastName = ref('Doe')

watchEffect(() => {
  // Automatically tracks BOTH firstName and lastName
  console.log(`Full name: ${firstName.value} ${lastName.value}`)
})

// Both will trigger the watchEffect:
firstName.value = 'Jane'
lastName.value = 'Smith'
</script>
```

### Cleanup Side Effects

When a watchEffect re-runs or the component unmounts, you may need to cleanup previous side effects.

```vue
<script setup>
import { ref, watchEffect } from 'vue'

const userId = ref(1)

watchEffect((onCleanup) => {
  // Start a new request
  const controller = new AbortController()

  fetch(`/api/users/${userId.value}`, {
    signal: controller.signal
  })
    .then(response => response.json())
    .then(data => console.log(data))

  // Cleanup: abort the previous request when userId changes
  onCleanup(() => {
    controller.abort()
  })
})
</script>
```

### Example: Real-time Data Sync

```vue
<script setup>
import { reactive, watchEffect } from 'vue'

const preferences = reactive({
  theme: 'light',
  language: 'en',
  notifications: true
})

// Auto-save to localStorage
watchEffect(() => {
  const data = JSON.stringify(preferences)
  localStorage.setItem('preferences', data)
  console.log('Preferences saved!')
})

// Any change to preferences automatically saves
preferences.theme = 'dark' // Saves immediately
preferences.language = 'fr' // Saves immediately
</script>
```

### Example: Conditional Dependency Tracking

```vue
<script setup>
import { ref, watchEffect } from 'vue'

const showDetails = ref(false)
const userDetails = ref({ name: 'John', email: 'john@example.com' })

watchEffect(() => {
  console.log('Running watchEffect')

  if (showDetails.value) {
    // userDetails is only tracked when showDetails is true
    console.log(`User: ${userDetails.value.name}`)
  }
})

// This triggers watchEffect
showDetails.value = true

// This now triggers watchEffect (because showDetails is true)
userDetails.value.name = 'Jane'

// This stops triggering from userDetails
showDetails.value = false

// This does NOT trigger watchEffect (showDetails is false)
userDetails.value.name = 'Bob'
</script>
```

---

## watch - Explicit Watching

`watch` is more explicit than `watchEffect`. You specify exactly what to watch and have access to both old and new values.

### Basic Syntax

```vue
<script setup>
import { ref, watch } from 'vue'

const count = ref(0)

// Watch a single ref
watch(count, (newValue, oldValue) => {
  console.log(`Count changed from ${oldValue} to ${newValue}`)
})

count.value++ // "Count changed from 0 to 1"
</script>
```

### Watching Different Source Types

#### 1. Watch a ref

```vue
<script setup>
import { ref, watch } from 'vue'

const count = ref(0)

watch(count, (newVal, oldVal) => {
  console.log(`${oldVal} -> ${newVal}`)
})
</script>
```

#### 2. Watch a getter function

```vue
<script setup>
import { reactive, watch } from 'vue'

const state = reactive({ count: 0 })

// Watch a specific property of a reactive object
watch(
  () => state.count,
  (newVal, oldVal) => {
    console.log(`${oldVal} -> ${newVal}`)
  }
)
</script>
```

#### 3. Watch a computed

```vue
<script setup>
import { ref, computed, watch } from 'vue'

const firstName = ref('John')
const lastName = ref('Doe')
const fullName = computed(() => `${firstName.value} ${lastName.value}`)

watch(fullName, (newVal, oldVal) => {
  console.log(`Name changed from "${oldVal}" to "${newVal}"`)
})
</script>
```

#### 4. Watch a reactive object (requires getter)

```vue
<script setup>
import { reactive, watch } from 'vue'

const state = reactive({
  count: 0,
  name: 'John'
})

// Watch the entire object (must use getter)
watch(
  () => state,
  (newVal, oldVal) => {
    console.log('State changed')
  },
  { deep: true } // Needed to track nested properties
)
</script>
```

### Watch Options

```vue
<script setup>
import { ref, watch } from 'vue'

const count = ref(0)

watch(
  count,
  (newVal, oldVal) => {
    console.log(`${oldVal} -> ${newVal}`)
  },
  {
    immediate: true,  // Run immediately on creation
    deep: true,       // Watch nested properties
    flush: 'post',    // Timing: 'pre', 'post', or 'sync'
    onTrack(e) {      // Debug: called when a reactive property is tracked
      console.log('Tracked:', e)
    },
    onTrigger(e) {    // Debug: called when the watcher is triggered
      console.log('Triggered:', e)
    }
  }
)
</script>
```

### Example: Debounced Search

```vue
<script setup>
import { ref, watch } from 'vue'

const searchQuery = ref('')
const searchResults = ref([])
const isSearching = ref(false)

let timeout

watch(searchQuery, (newQuery, oldQuery) => {
  console.log(`Search changed: "${oldQuery}" -> "${newQuery}"`)

  // Clear previous timeout
  clearTimeout(timeout)

  if (!newQuery) {
    searchResults.value = []
    return
  }

  isSearching.value = true

  // Debounce: wait 500ms after user stops typing
  timeout = setTimeout(async () => {
    try {
      const response = await fetch(`/api/search?q=${newQuery}`)
      searchResults.value = await response.json()
    } catch (error) {
      console.error('Search failed:', error)
    } finally {
      isSearching.value = false
    }
  }, 500)
})
</script>
```

### Example: Form Validation

```vue
<script setup>
import { ref, watch } from 'vue'

const email = ref('')
const emailError = ref('')

watch(email, (newEmail, oldEmail) => {
  console.log(`Email changed: "${oldEmail}" -> "${newEmail}"`)

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!newEmail) {
    emailError.value = ''
  } else if (!emailRegex.test(newEmail)) {
    emailError.value = 'Please enter a valid email address'
  } else {
    emailError.value = ''
  }
})
</script>
```

---

## Deep Watching

Deep watching tracks changes to nested properties in objects and arrays.

### Basic Deep Watching

```vue
<script setup>
import { reactive, watch } from 'vue'

const user = reactive({
  name: 'John',
  address: {
    city: 'New York',
    country: 'USA'
  },
  hobbies: ['reading', 'coding']
})

// Without deep: only watches the user object reference
watch(user, () => {
  console.log('User reference changed')
})

// This won't trigger (nested change):
user.address.city = 'Los Angeles'

// With deep: watches all nested properties
watch(
  user,
  () => {
    console.log('User or any nested property changed')
  },
  { deep: true }
)

// This WILL trigger:
user.address.city = 'San Francisco'
user.hobbies.push('gaming')
</script>
```

### Deep Watch vs Shallow Watch

```vue
<script setup>
import { ref, watch } from 'vue'

const user = ref({
  name: 'John',
  address: { city: 'NYC' }
})

// Shallow watch - only watches the ref value assignment
watch(user, (newVal, oldVal) => {
  console.log('User ref changed')
})

// This triggers (replacing the entire object):
user.value = { name: 'Jane', address: { city: 'LA' } }

// This does NOT trigger (mutating nested property):
user.value.address.city = 'Boston'

// Deep watch - watches nested mutations
watch(
  user,
  (newVal, oldVal) => {
    console.log('User or nested property changed')
  },
  { deep: true }
)

// This now triggers:
user.value.address.city = 'Chicago'
</script>
```

### Performance Consideration

Deep watching can be expensive for large, complex objects:

```vue
<script setup>
import { reactive, watch } from 'vue'

const largeDataset = reactive({
  items: [], // 10,000 items
  metadata: {}
})

// ❌ Expensive: watches every property of every item
watch(largeDataset, () => {
  console.log('Data changed')
}, { deep: true })

// ✅ Better: watch specific properties
watch(
  () => largeDataset.items.length,
  (newLength) => {
    console.log(`Items count: ${newLength}`)
  }
)

watch(
  () => largeDataset.metadata.lastUpdated,
  (newTime) => {
    console.log(`Updated at: ${newTime}`)
  }
)
</script>
```

### Watching Arrays

```vue
<script setup>
import { reactive, watch } from 'vue'

const todos = reactive([
  { id: 1, text: 'Learn Vue', done: false },
  { id: 2, text: 'Build app', done: false }
])

// Watch for array mutations (push, pop, splice, etc.)
watch(
  todos,
  (newTodos, oldTodos) => {
    console.log('Todos changed')
    console.log('New length:', newTodos.length)
  },
  { deep: true }
)

// All of these trigger the watcher:
todos.push({ id: 3, text: 'Deploy', done: false })
todos[0].done = true
todos.splice(1, 1)
</script>
```

---

## Watching Multiple Sources

You can watch multiple reactive sources simultaneously by passing an array.

### Basic Multiple Sources

```vue
<script setup>
import { ref, watch } from 'vue'

const firstName = ref('John')
const lastName = ref('Doe')

// Watch both - callback receives arrays of new and old values
watch(
  [firstName, lastName],
  ([newFirst, newLast], [oldFirst, oldLast]) => {
    console.log(`Name changed:`)
    console.log(`  First: ${oldFirst} -> ${newFirst}`)
    console.log(`  Last: ${oldLast} -> ${newLast}`)
  }
)

firstName.value = 'Jane' // Triggers
lastName.value = 'Smith'  // Triggers
</script>
```

### Mixing Source Types

```vue
<script setup>
import { ref, reactive, computed, watch } from 'vue'

const count = ref(0)
const state = reactive({ multiplier: 2 })
const result = computed(() => count.value * state.multiplier)

// Watch: ref, reactive property getter, and computed
watch(
  [count, () => state.multiplier, result],
  ([newCount, newMult, newResult], [oldCount, oldMult, oldResult]) => {
    console.log(`Count: ${oldCount} -> ${newCount}`)
    console.log(`Multiplier: ${oldMult} -> ${newMult}`)
    console.log(`Result: ${oldResult} -> ${newResult}`)
  }
)
</script>
```

### Example: Calculated Total

```vue
<script setup>
import { reactive, ref, watch, computed } from 'vue'

const dimensions = reactive({
  width: 10,
  height: 5,
  depth: 3
})

const pricePerCubicUnit = ref(1.5)
const taxRate = ref(0.1)

const volume = computed(() =>
  dimensions.width * dimensions.height * dimensions.depth
)

const subtotal = computed(() => volume.value * pricePerCubicUnit.value)
const total = computed(() => subtotal.value * (1 + taxRate.value))

// Watch all pricing inputs
watch(
  [
    () => dimensions.width,
    () => dimensions.height,
    () => dimensions.depth,
    pricePerUnit,
    taxRate
  ],
  () => {
    console.log('Price calculation updated:')
    console.log(`  Volume: ${volume.value}`)
    console.log(`  Subtotal: $${subtotal.value}`)
    console.log(`  Total: $${total.value.toFixed(2)}`)
  }
)
</script>
```

### Example: Form Validation with Multiple Fields

```vue
<script setup>
import { ref, watch } from 'vue'

const username = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')

const errors = ref({})

// Watch all form fields together
watch(
  [username, email, password, confirmPassword],
  ([user, mail, pass, confirm]) => {
    const newErrors = {}

    // Username validation
    if (user.length < 3) {
      newErrors.username = 'Username must be at least 3 characters'
    }

    // Email validation
    if (!mail.includes('@')) {
      newErrors.email = 'Please enter a valid email'
    }

    // Password validation
    if (pass.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }

    // Confirm password validation
    if (pass !== confirm) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    errors.value = newErrors
  }
)
</script>
```

---

## Stopping and Cleanup

Watchers can be stopped manually, and they should clean up side effects.

### Stopping a Watcher

```vue
<script setup>
import { ref, watch } from 'vue'

const count = ref(0)

// watch returns a stop function
const stopWatch = watch(count, (newVal) => {
  console.log(`Count: ${newVal}`)

  // Auto-stop at 10
  if (newVal >= 10) {
    stopWatch()
    console.log('Watcher stopped')
  }
})

// You can also call stopWatch() manually anytime
function manualStop() {
  stopWatch()
}
</script>
```

### Cleanup Functions

```vue
<script setup>
import { ref, watchEffect } from 'vue'

const userId = ref(1)

watchEffect((onCleanup) => {
  // Setup: start fetching data
  console.log(`Fetching user ${userId.value}...`)
  const controller = new AbortController()

  fetch(`/api/users/${userId.value}`, {
    signal: controller.signal
  })

  // Cleanup: cancel the request if userId changes
  onCleanup(() => {
    console.log(`Canceling request for user ${userId.value}`)
    controller.abort()
  })
})
</script>
```

### Example: Event Listeners

```vue
<script setup>
import { ref, watchEffect } from 'vue'

const elementId = ref('button1')

watchEffect((onCleanup) => {
  const element = document.getElementById(elementId.value)

  const handler = () => console.log('Clicked!')
  element?.addEventListener('click', handler)

  // Cleanup: remove previous event listener
  onCleanup(() => {
    element?.removeEventListener('click', handler)
  })
})
</script>
```

### Example: Timers and Intervals

```vue
<script setup>
import { ref, watchEffect } from 'vue'

const interval = ref(1000)
const tick = ref(0)

watchEffect((onCleanup) => {
  console.log(`Starting interval at ${interval.value}ms`)

  const timer = setInterval(() => {
    tick.value++
  }, interval.value)

  // Cleanup: clear the old interval when interval.value changes
  onCleanup(() => {
    console.log('Clearing interval')
    clearInterval(timer)
  })
})
</script>
```

### Component Unmount Cleanup

Watchers are automatically stopped when the component unmounts, but you can still perform custom cleanup:

```vue
<script setup>
import { onUnmounted, watch } from 'vue'

const stopWatch = watch(/* ... */)

// Manual cleanup on unmount (if needed)
onUnmounted(() => {
  stopWatch()
  console.log('Component unmounted, watcher stopped')
})
</script>
```

---

## Flush Timing

Flush timing controls **when** the watcher callback runs relative to Vue's component rendering cycle.

### Three Flush Timing Options

1. **`pre`** (default for `watchEffect`): Before component updates
2. **`post`** (default for `watch`): After component updates
3. **`sync`**: Synchronously, immediately when data changes

```vue
<script setup>
import { ref, watch } from 'vue'

const count = ref(0)

// Pre flush - runs BEFORE the DOM updates
watch(
  count,
  () => {
    console.log('[PRE] Before DOM update')
    console.log('DOM value:', document.getElementById('count')?.innerText)
  },
  { flush: 'pre' }
)

// Post flush - runs AFTER the DOM updates
watch(
  count,
  () => {
    console.log('[POST] After DOM update')
    console.log('DOM value:', document.getElementById('count')?.innerText)
  },
  { flush: 'post' }
)

// Sync flush - runs IMMEDIATELY and SYNCHRONOUSLY
watch(
  count,
  () => {
    console.log('[SYNC] Immediately')
  },
  { flush: 'sync' }
)
</script>

<template>
  <div id="count">{{ count }}</div>
  <button @click="count++">Increment</button>
</template>
```

### When to Use Each

#### Use `pre` (Default for watchEffect)

- Most side effects (logging, analytics, etc.)
- When you don't need to access the updated DOM
- Better performance (batches with component updates)

```vue
<script setup>
import { ref, watchEffect } from 'vue'

const count = ref(0)

watchEffect(() => {
  // Analytics, logging, etc.
  console.log(`Count changed to ${count.value}`)
  analytics.track('count_changed', { value: count.value })
})
</script>
```

#### Use `post` (Default for watch)

- When you need to access the updated DOM
- DOM measurements or manipulations
- Third-party library integration that reads the DOM

```vue
<script setup>
import { ref, watch, nextTick } from 'vue'

const items = ref(['Item 1', 'Item 2'])

watch(
  items,
  async () => {
    // DOM is now updated, we can measure/manipulate it
    await nextTick() // Not needed with flush: 'post', but shown for clarity

    const list = document.querySelector('.item-list')
    console.log('List height:', list?.scrollHeight)

    // Scroll to bottom after items update
    list?.scrollTo(0, list.scrollHeight)
  },
  { flush: 'post', deep: true }
)
</script>
```

#### Use `sync` (Rare - Be Careful!)

- When you need immediate synchronous execution
- Debugging and development
- **Warning**: Can hurt performance, use sparingly!

```vue
<script setup>
import { ref, watch } from 'vue'

const value = ref(0)

watch(
  value,
  (newVal) => {
    // This runs IMMEDIATELY, blocking further execution
    console.log('Sync:', newVal)
  },
  { flush: 'sync' }
)

value.value = 1
console.log('After assignment')

// Output:
// "Sync: 1"
// "After assignment"
</script>
```

### Example: Comparing Flush Timing

```vue
<script setup>
import { ref, watch } from 'vue'

const message = ref('Initial')

watch(message, () => console.log('[PRE]'), { flush: 'pre' })
watch(message, () => console.log('[POST]'), { flush: 'post' })
watch(message, () => console.log('[SYNC]'), { flush: 'sync' })

console.log('Before change')
message.value = 'Changed'
console.log('After change')

// Output:
// "Before change"
// "[SYNC]"
// "After change"
// "[PRE]"
// "[POST]"
</script>
```

---

## Advanced Patterns

### Pattern 1: Undo/Redo

```vue
<script setup>
import { ref, watch } from 'vue'

const currentValue = ref('Hello')
const history = ref(['Hello'])
const historyIndex = ref(0)

// Track changes for undo/redo
watch(currentValue, (newVal) => {
  // Remove any "future" history
  history.value = history.value.slice(0, historyIndex.value + 1)

  // Add new value
  history.value.push(newVal)
  historyIndex.value = history.value.length - 1
})

function undo() {
  if (historyIndex.value > 0) {
    historyIndex.value--
    currentValue.value = history.value[historyIndex.value]
  }
}

function redo() {
  if (historyIndex.value < history.value.length - 1) {
    historyIndex.value++
    currentValue.value = history.value[historyIndex.value]
  }
}
</script>
```

### Pattern 2: Auto-save with Conflict Detection

```vue
<script setup>
import { ref, watch } from 'vue'

const localData = ref({ text: 'Hello' })
const serverData = ref({ text: 'Hello', version: 1 })
const hasConflict = ref(false)

// Auto-save to server
watch(
  localData,
  async (newData) => {
    try {
      const response = await fetch('/api/save', {
        method: 'POST',
        body: JSON.stringify({
          ...newData,
          version: serverData.value.version
        })
      })

      const result = await response.json()

      if (result.conflict) {
        hasConflict.value = true
        console.warn('Conflict detected!')
      } else {
        serverData.value = result.data
        hasConflict.value = false
      }
    } catch (error) {
      console.error('Save failed:', error)
    }
  },
  { deep: true }
)
</script>
```

### Pattern 3: Conditional Watching

```vue
<script setup>
import { ref, watch } from 'vue'

const isMonitoring = ref(false)
const cpuUsage = ref(0)
let stopCpuWatch = null

// Start/stop watching based on isMonitoring
watch(isMonitoring, (shouldMonitor) => {
  if (shouldMonitor) {
    // Start monitoring
    stopCpuWatch = watch(
      cpuUsage,
      (newUsage) => {
        if (newUsage > 80) {
          alert('High CPU usage!')
        }
      }
    )
  } else {
    // Stop monitoring
    if (stopCpuWatch) {
      stopCpuWatch()
      stopCpuWatch = null
    }
  }
})
</script>
```

### Pattern 4: Throttling vs Debouncing

```vue
<script setup>
import { ref, watch } from 'vue'

const searchQuery = ref('')

// Debouncing: wait for user to stop typing
let debounceTimeout
watch(searchQuery, (newQuery) => {
  clearTimeout(debounceTimeout)
  debounceTimeout = setTimeout(() => {
    console.log('Debounced search:', newQuery)
  }, 500)
})

// Throttling: execute at most once per interval
let lastRun = 0
const scrollPosition = ref(0)

watch(scrollPosition, (newPos) => {
  const now = Date.now()
  if (now - lastRun >= 200) {
    lastRun = now
    console.log('Throttled scroll:', newPos)
  }
})
</script>
```

### Pattern 5: Chained Watchers

```vue
<script setup>
import { ref, watch } from 'vue'

const userId = ref(null)
const userData = ref(null)
const userPosts = ref([])

// Step 1: Watch userId, fetch user data
watch(userId, async (newUserId) => {
  if (!newUserId) {
    userData.value = null
    return
  }

  const response = await fetch(`/api/users/${newUserId}`)
  userData.value = await response.json()
})

// Step 2: Watch userData, fetch user posts
watch(userData, async (newUserData) => {
  if (!newUserData) {
    userPosts.value = []
    return
  }

  const response = await fetch(`/api/users/${newUserData.id}/posts`)
  userPosts.value = await response.json()
})
</script>
```

---

## Performance Considerations

### 1. Avoid Unnecessary Deep Watching

```vue
<script setup>
import { reactive, watch } from 'vue'

const largeState = reactive({
  items: [], // 10,000 items
  metadata: {}
})

// ❌ Bad: watches everything
watch(largeState, () => {
  console.log('State changed')
}, { deep: true })

// ✅ Good: watch specific properties
watch(() => largeState.items.length, (length) => {
  console.log('Items count:', length)
})
</script>
```

### 2. Use Computed Instead of Watch When Possible

```vue
<script setup>
import { ref, watch, computed } from 'vue'

const firstName = ref('John')
const lastName = ref('Doe')

// ❌ Less ideal: using watch to derive a value
const fullName = ref('')
watch([firstName, lastName], ([first, last]) => {
  fullName.value = `${first} ${last}`
})

// ✅ Better: use computed
const fullName = computed(() => `${firstName.value} ${lastName.value}`)
</script>
```

### 3. Debounce Expensive Operations

```vue
<script setup>
import { ref, watch } from 'vue'

const searchQuery = ref('')

let timeout
watch(searchQuery, (newQuery) => {
  clearTimeout(timeout)

  // ✅ Debounce expensive API calls
  timeout = setTimeout(async () => {
    const results = await expensiveSearchAPI(newQuery)
    console.log(results)
  }, 500)
})
</script>
```

### 4. Stop Watchers When No Longer Needed

```vue
<script setup>
import { ref, watch } from 'vue'

const isFeatureEnabled = ref(false)
const featureData = ref(null)

let stopWatcher = null

watch(isFeatureEnabled, (enabled) => {
  if (enabled) {
    // Start watching when feature is enabled
    stopWatcher = watch(featureData, (data) => {
      console.log('Feature data:', data)
    })
  } else {
    // ✅ Stop watching when feature is disabled
    if (stopWatcher) {
      stopWatcher()
      stopWatcher = null
    }
  }
})
</script>
```

---

## Common Pitfalls and Solutions

### Pitfall 1: Watching Non-Reactive Values

```vue
<script setup>
import { watch } from 'vue'

// ❌ This doesn't work - not reactive
let count = 0
watch(count, () => console.log('Changed')) // ERROR!

// ✅ Solution: use ref
const count = ref(0)
watch(count, () => console.log('Changed'))
</script>
```

### Pitfall 2: Forgetting to Use Getters for Reactive Object Properties

```vue
<script setup>
import { reactive, watch } from 'vue'

const state = reactive({ count: 0 })

// ❌ This doesn't work
watch(state.count, () => console.log('Changed')) // Won't react

// ✅ Solution: use a getter function
watch(() => state.count, () => console.log('Changed'))
</script>
```

### Pitfall 3: Infinite Watch Loops

```vue
<script setup>
import { ref, watch } from 'vue'

const count = ref(0)

// ❌ Infinite loop!
watch(count, (newVal) => {
  count.value = newVal + 1 // This triggers the watcher again!
})

// ✅ Solution: use a condition or different approach
watch(count, (newVal) => {
  if (newVal < 10) {
    count.value = newVal + 1
  }
})
</script>
```

### Pitfall 4: Not Cleaning Up Side Effects

```vue
<script setup>
import { ref, watchEffect } from 'vue'

const userId = ref(1)

// ❌ Memory leak - previous intervals keep running
watchEffect(() => {
  setInterval(() => {
    console.log(`Fetching data for user ${userId.value}`)
  }, 1000)
})

// ✅ Solution: cleanup with onCleanup
watchEffect((onCleanup) => {
  const timer = setInterval(() => {
    console.log(`Fetching data for user ${userId.value}`)
  }, 1000)

  onCleanup(() => {
    clearInterval(timer)
  })
})
</script>
```

### Pitfall 5: Watching Arrays Without Deep

```vue
<script setup>
import { ref, watch } from 'vue'

const items = ref([1, 2, 3])

// ❌ This only triggers on array replacement, not mutations
watch(items, () => {
  console.log('Items changed')
})

items.value.push(4) // Doesn't trigger!
items.value = [...items.value, 4] // Triggers

// ✅ Solution: use deep watch or watch specific properties
watch(items, () => {
  console.log('Items changed')
}, { deep: true })

// Or watch array length
watch(() => items.value.length, () => {
  console.log('Array length changed')
})
</script>
```

---

## Real-World Use Cases

### Use Case 1: Auto-Save Draft

```vue
<script setup>
import { ref, watch } from 'vue'

const draft = ref({
  title: '',
  content: '',
  lastSaved: null
})

let saveTimeout

watch(
  draft,
  (newDraft) => {
    clearTimeout(saveTimeout)

    // Debounce auto-save by 2 seconds
    saveTimeout = setTimeout(async () => {
      try {
        await fetch('/api/drafts/save', {
          method: 'POST',
          body: JSON.stringify(newDraft)
        })

        draft.value.lastSaved = new Date()
        console.log('Draft auto-saved')
      } catch (error) {
        console.error('Auto-save failed:', error)
      }
    }, 2000)
  },
  { deep: true }
)
</script>
```

### Use Case 2: URL Query Sync

```vue
<script setup>
import { reactive, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const filters = reactive({
  search: route.query.search || '',
  category: route.query.category || 'all',
  sort: route.query.sort || 'date'
})

// Sync filters to URL query
watch(
  filters,
  (newFilters) => {
    router.push({
      query: newFilters
    })
  },
  { deep: true }
)

// Sync URL query to filters (for browser back/forward)
watch(
  () => route.query,
  (newQuery) => {
    filters.search = newQuery.search || ''
    filters.category = newQuery.category || 'all'
    filters.sort = newQuery.sort || 'date'
  }
)
</script>
```

### Use Case 3: Real-Time Validation

```vue
<script setup>
import { ref, watch } from 'vue'

const username = ref('')
const isAvailable = ref(null)
const isChecking = ref(false)

let checkTimeout

watch(username, async (newUsername) => {
  clearTimeout(checkTimeout)

  if (newUsername.length < 3) {
    isAvailable.value = null
    return
  }

  isChecking.value = true

  checkTimeout = setTimeout(async () => {
    try {
      const response = await fetch(`/api/check-username?username=${newUsername}`)
      const data = await response.json()
      isAvailable.value = data.available
    } catch (error) {
      console.error('Check failed:', error)
    } finally {
      isChecking.value = false
    }
  }, 500)
})
</script>
```

### Use Case 4: Analytics Tracking

```vue
<script setup>
import { reactive, watchEffect } from 'vue'

const userActivity = reactive({
  currentPage: 'home',
  timeSpent: 0,
  interactions: 0,
  scrollDepth: 0
})

// Track page views
watchEffect(() => {
  analytics.page(userActivity.currentPage, {
    timeSpent: userActivity.timeSpent,
    interactions: userActivity.interactions
  })
})

// Track scroll depth
watchEffect(() => {
  if (userActivity.scrollDepth > 75) {
    analytics.track('deep_scroll', {
      depth: userActivity.scrollDepth
    })
  }
})
</script>
```

### Use Case 5: Dependent Data Fetching

```vue
<script setup>
import { ref, watch } from 'vue'

const categoryId = ref(null)
const productId = ref(null)

const categoryData = ref(null)
const productData = ref(null)
const productReviews = ref([])

// Fetch category when categoryId changes
watch(categoryId, async (newId) => {
  if (!newId) {
    categoryData.value = null
    productId.value = null
    return
  }

  const response = await fetch(`/api/categories/${newId}`)
  categoryData.value = await response.json()
}, { immediate: true })

// Fetch product when productId changes
watch(productId, async (newId) => {
  if (!newId) {
    productData.value = null
    return
  }

  const response = await fetch(`/api/products/${newId}`)
  productData.value = await response.json()
}, { immediate: true })

// Fetch reviews when product loads
watch(productData, async (newProduct) => {
  if (!newProduct) {
    productReviews.value = []
    return
  }

  const response = await fetch(`/api/products/${newProduct.id}/reviews`)
  productReviews.value = await response.json()
})
</script>
```

---

## Summary

### watchEffect

- ✅ Automatic dependency tracking
- ✅ Runs immediately
- ✅ Great for side effects
- ❌ No access to old value
- ❌ Less explicit

### watch

- ✅ Explicit dependencies
- ✅ Access to old and new values
- ✅ Lazy by default (use `immediate: true` to change)
- ✅ Can watch multiple sources
- ❌ More verbose

### Best Practices

1. **Use computed for derived values**, watch for side effects
2. **Debounce expensive operations** (API calls, heavy computations)
3. **Clean up side effects** with onCleanup
4. **Stop watchers** when no longer needed
5. **Use deep watching sparingly** - it can be expensive
6. **Prefer watching specific properties** over entire objects
7. **Use flush: 'post'** when you need to access updated DOM
8. **Avoid infinite loops** - don't modify the watched value inside the callback

---

**Congratulations!** You now have a deep understanding of Vue 3's reactivity system and watchers. This knowledge is essential for building responsive, real-world applications!
