# Technical Notes: Vue 3 Lifecycle Hooks

## Deep Dive into Implementation

### How Lifecycle Hooks Work Internally

Vue 3's lifecycle hooks are implemented as functions that register callbacks with the current component instance. When you call a lifecycle hook like `onMounted`, Vue:

1. Gets the current active component instance
2. Adds your callback to that instance's lifecycle hook queue
3. Executes all callbacks for that hook at the appropriate time

```javascript
// Simplified internal implementation
function onMounted(callback) {
  const instance = getCurrentInstance()
  if (!instance) {
    warn('onMounted can only be called during setup()')
    return
  }

  // Add to the instance's mounted hooks queue
  if (!instance.mounted) {
    instance.mounted = []
  }
  instance.mounted.push(callback)
}
```

### Lifecycle Hook Execution Order

When multiple components are involved, the execution order is:

```
Parent beforeMount
  Child beforeMount
  Child mounted
Parent mounted

(on update)
Parent beforeUpdate
  Child beforeUpdate
  Child updated
Parent updated

(on unmount)
Parent beforeUnmount
  Child beforeUnmount
  Child unmounted
Parent unmounted
```

**Key insight**: Child components complete their lifecycle phase before the parent completes the same phase.

## Comparison: Options API vs Composition API

### Options API

```vue
<script>
export default {
  beforeCreate() {
    // Before instance initialization
  },
  created() {
    // Instance initialized, before mount
  },
  beforeMount() {
    // Before DOM mounting
  },
  mounted() {
    // After DOM mounting
  },
  beforeUpdate() {
    // Before reactive update
  },
  updated() {
    // After reactive update
  },
  beforeUnmount() {
    // Before component unmount
  },
  unmounted() {
    // After component unmount
  }
}
</script>
```

### Composition API Equivalents

```vue
<script setup>
import {
  onBeforeMount,
  onMounted,
  onBeforeUpdate,
  onUpdated,
  onBeforeUnmount,
  onUnmounted
} from 'vue'

// No direct equivalent to beforeCreate/created
// setup() itself runs at that phase

onBeforeMount(() => {})
onMounted(() => {})
onBeforeUpdate(() => {})
onUpdated(() => {})
onBeforeUnmount(() => {})
onUnmounted(() => {})
</script>
```

**Note**: There's no `onBeforeCreate` or `onCreated` in Composition API because `setup()` runs during that phase.

## Advanced Hook Behavior

### 1. onErrorCaptured - Error Propagation

`onErrorCaptured` follows a bubbling mechanism:

```vue
<script setup>
import { onErrorCaptured } from 'vue'

onErrorCaptured((err, instance, info) => {
  // err: The error object
  // instance: Component instance that threw the error
  // info: Vue-specific error info (e.g., "render function")

  console.error(`Captured error in ${info}:`, err)

  // Return value determines propagation:
  // - return false: Stop propagation (error handled)
  // - return true or nothing: Continue bubbling up
  return false
})
</script>
```

**Error propagation chain**:
```
GrandchildComponent (throws error)
    ↓
ChildComponent (onErrorCaptured - returns true)
    ↓
ParentComponent (onErrorCaptured - returns false)
    ↓
(Error stopped, doesn't reach app.config.errorHandler)
```

### 2. onRenderTracked & onRenderTriggered

These hooks are only active in development mode and provide debugging info:

```vue
<script setup>
import { ref, onRenderTracked, onRenderTriggered } from 'vue'

const count = ref(0)
const message = ref('hello')

onRenderTracked((event) => {
  /*
    event = {
      target: { count: 0 },  // The reactive object
      type: 'get',            // Operation type
      key: 'count',           // Property accessed
      effect: ReactiveEffect  // The effect tracking this
    }
  */
  console.log('Tracked:', event.key)
})

onRenderTriggered((event) => {
  /*
    event = {
      target: { count: 1 },
      type: 'set',            // Operation that triggered
      key: 'count',
      oldValue: 0,
      newValue: 1
    }
  */
  console.log('Triggered by:', event.key, 'changing from', event.oldValue, 'to', event.newValue)
})
</script>
```

**Use case example**:
```vue
<script setup>
import { ref, computed, onRenderTriggered } from 'vue'

const firstName = ref('John')
const lastName = ref('Doe')
const age = ref(30)

// This computed is used in template
const fullName = computed(() => `${firstName.value} ${lastName.value}`)

onRenderTriggered((e) => {
  console.log('Re-render triggered by:', e.key)
})

// If you change age, onRenderTriggered will fire even though
// fullName doesn't depend on age - this helps identify unnecessary reactivity
</script>
```

### 3. Keep-Alive Lifecycle Mechanics

Components wrapped in `<keep-alive>` have special lifecycle behavior:

```vue
<!-- Parent component -->
<template>
  <keep-alive>
    <component :is="currentTab"></component>
  </keep-alive>
</template>
```

**Lifecycle flow with keep-alive**:

```
First activation:
  beforeMount → mounted → activated

Switch away:
  deactivated (component cached, NOT unmounted)

Switch back:
  activated (component reused from cache)

Keep-alive destroyed:
  deactivated → beforeUnmount → unmounted
```

**Important behaviors**:
- State is preserved between activations
- onMounted only runs once (first time)
- onActivated runs every time component becomes active
- onDeactivated runs every time component is cached

```vue
<script setup>
import { ref, onMounted, onActivated, onDeactivated } from 'vue'

const mountCount = ref(0)
const activationCount = ref(0)

onMounted(() => {
  mountCount.value++  // Will be 1, never increments again
  console.log('Mounted once')
})

onActivated(() => {
  activationCount.value++  // Increments every activation
  console.log('Activated:', activationCount.value, 'times')
})

onDeactivated(() => {
  console.log('Deactivated, state preserved')
})
</script>
```

## Memory Management and Cleanup Patterns

### Pattern 1: Timer Management

```vue
<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// ❌ BAD: Variable can be garbage collected
onMounted(() => {
  const id = setInterval(() => console.log('tick'), 1000)
})

// ❌ BAD: Can't clean up
onUnmounted(() => {
  clearInterval(id) // ReferenceError: id is not defined
})

// ✅ GOOD: Keep reference in outer scope
let intervalId = null

onMounted(() => {
  intervalId = setInterval(() => console.log('tick'), 1000)
})

onUnmounted(() => {
  if (intervalId !== null) {
    clearInterval(intervalId)
    intervalId = null
  }
})
</script>
```

### Pattern 2: Multiple Timers

```vue
<script setup>
import { onMounted, onUnmounted } from 'vue'

const timers = []

onMounted(() => {
  timers.push(setInterval(() => console.log('A'), 1000))
  timers.push(setInterval(() => console.log('B'), 2000))
  timers.push(setTimeout(() => console.log('C'), 5000))
})

onUnmounted(() => {
  timers.forEach(id => clearInterval(id))
  timers.length = 0
})
</script>
```

### Pattern 3: Event Listener Cleanup

```vue
<script setup>
import { onMounted, onUnmounted } from 'vue'

// Store handlers to ensure same reference for removal
const handleResize = () => console.log('resized')
const handleScroll = () => console.log('scrolled')
const handleClick = () => console.log('clicked')

onMounted(() => {
  window.addEventListener('resize', handleResize)
  window.addEventListener('scroll', handleScroll)
  document.addEventListener('click', handleClick)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  window.removeEventListener('scroll', handleScroll)
  document.removeEventListener('click', handleClick)
})
</script>
```

### Pattern 4: AbortController for Fetch

```vue
<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const data = ref(null)
let controller = null

onMounted(async () => {
  controller = new AbortController()

  try {
    const response = await fetch('/api/data', {
      signal: controller.signal
    })
    data.value = await response.json()
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log('Fetch aborted')
    } else {
      console.error('Fetch failed:', error)
    }
  }
})

onUnmounted(() => {
  // Cancel pending request if component unmounts
  if (controller) {
    controller.abort()
  }
})
</script>
```

### Pattern 5: WebSocket Cleanup

```vue
<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const messages = ref([])
let socket = null

onMounted(() => {
  socket = new WebSocket('ws://example.com/socket')

  socket.addEventListener('open', () => {
    console.log('WebSocket connected')
  })

  socket.addEventListener('message', (event) => {
    messages.value.push(event.data)
  })

  socket.addEventListener('error', (error) => {
    console.error('WebSocket error:', error)
  })
})

onUnmounted(() => {
  if (socket) {
    // Close connection gracefully
    if (socket.readyState === WebSocket.OPEN) {
      socket.close(1000, 'Component unmounted')
    }
    socket = null
  }
})
</script>
```

## Performance Considerations

### 1. Avoid Expensive Operations in onUpdated

```vue
<script setup>
import { ref, onUpdated } from 'vue'

const items = ref([1, 2, 3, 4, 5])

// ❌ BAD: Runs on every update
onUpdated(() => {
  // Expensive DOM query
  const elements = document.querySelectorAll('.item')
  elements.forEach(el => {
    // Heavy computation
    const computedStyle = window.getComputedStyle(el)
    // ...
  })
})

// ✅ GOOD: Use watchers for specific changes
import { watch } from 'vue'

watch(items, (newItems) => {
  // Only runs when items change
  performExpensiveOperation(newItems)
})
</script>
```

### 2. Debounce onUpdated Callbacks

```vue
<script setup>
import { onUpdated } from 'vue'

const debounce = (fn, delay) => {
  let timeoutId
  return (...args) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), delay)
  }
}

const syncWithThirdParty = debounce(() => {
  // Expensive sync operation
  console.log('Syncing...')
}, 300)

onUpdated(() => {
  syncWithThirdParty()
})
</script>
```

### 3. Conditional Expensive Operations

```vue
<script setup>
import { ref, onMounted } from 'vue'

const shouldLoadHeavyLibrary = ref(false)

onMounted(async () => {
  if (shouldLoadHeavyLibrary.value) {
    // Lazy load only when needed
    const module = await import('./heavy-library')
    module.init()
  }
})
</script>
```

## Edge Cases and Gotchas

### 1. Hook Registration Timing

```vue
<script setup>
import { onMounted } from 'vue'

// ✅ GOOD: Synchronous registration
onMounted(() => {
  console.log('This works')
})

// ❌ BAD: Async registration
setTimeout(() => {
  onMounted(() => {
    console.log('This will NOT work!')
  })
}, 100)

// ❌ BAD: Conditional at top level
if (someCondition) {
  onMounted(() => {
    // Might not register correctly
  })
}

// ✅ GOOD: Condition inside hook
onMounted(() => {
  if (someCondition) {
    // This works fine
  }
})
</script>
```

### 2. Multiple Hook Registrations

You can register the same hook multiple times, and all callbacks will execute:

```vue
<script setup>
import { onMounted } from 'vue'

// All three will execute
onMounted(() => console.log('First'))
onMounted(() => console.log('Second'))
onMounted(() => console.log('Third'))

// Output:
// First
// Second
// Third
</script>
```

### 3. Parent-Child Update Cycles

```vue
<!-- Parent.vue -->
<script setup>
import { ref, onUpdated } from 'vue'

const parentCount = ref(0)

onUpdated(() => {
  console.log('Parent updated')
})
</script>

<template>
  <div>
    <Child :count="parentCount" />
    <button @click="parentCount++">Increment</button>
  </div>
</template>

<!-- Child.vue -->
<script setup>
import { onUpdated } from 'vue'

defineProps(['count'])

onUpdated(() => {
  console.log('Child updated')
})
</script>

<!-- When button clicked:
     1. Parent beforeUpdate
     2. Child beforeUpdate
     3. Child updated
     4. Parent updated
-->
```

### 4. Refs Timing

```vue
<script setup>
import { ref, onBeforeMount, onMounted } from 'vue'

const elementRef = ref(null)

onBeforeMount(() => {
  console.log(elementRef.value) // null - template not rendered yet
})

onMounted(() => {
  console.log(elementRef.value) // HTMLElement - now available
})
</script>

<template>
  <div ref="elementRef">Content</div>
</template>
```

## Testing Lifecycle Hooks

### Unit Testing Example

```javascript
import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import Component from './Component.vue'

describe('Component lifecycle', () => {
  it('calls onMounted', () => {
    const onMountedSpy = vi.fn()

    // Component that uses onMounted
    const wrapper = mount({
      setup() {
        onMounted(onMountedSpy)
        return {}
      },
      template: '<div>Test</div>'
    })

    expect(onMountedSpy).toHaveBeenCalledTimes(1)
  })

  it('cleans up on unmount', () => {
    const clearIntervalSpy = vi.spyOn(global, 'clearInterval')

    const wrapper = mount(Component)
    wrapper.unmount()

    expect(clearIntervalSpy).toHaveBeenCalled()
  })

  it('handles errors with onErrorCaptured', async () => {
    const errorHandler = vi.fn()

    const Parent = {
      setup() {
        onErrorCaptured((err) => {
          errorHandler(err)
          return false
        })
      },
      template: '<ErrorProneChild />'
    }

    mount(Parent)

    expect(errorHandler).toHaveBeenCalled()
  })
})
```

## Migration from Vue 2

### Vue 2 Lifecycle Hooks

```javascript
// Vue 2
export default {
  beforeCreate() {},
  created() {},
  beforeMount() {},
  mounted() {},
  beforeUpdate() {},
  updated() {},
  beforeDestroy() {},
  destroyed() {}
}
```

### Vue 3 Composition API Equivalent

```vue
<!-- Vue 3 -->
<script setup>
import {
  onBeforeMount,
  onMounted,
  onBeforeUpdate,
  onUpdated,
  onBeforeUnmount,
  onUnmounted
} from 'vue'

// Note: setup() replaces beforeCreate and created

onBeforeMount(() => {})
onMounted(() => {})
onBeforeUpdate(() => {})
onUpdated(() => {})
onBeforeUnmount(() => {})  // was beforeDestroy
onUnmounted(() => {})       // was destroyed
</script>
```

**Key differences**:
1. `beforeDestroy` → `onBeforeUnmount`
2. `destroyed` → `onUnmounted`
3. No `beforeCreate`/`created` equivalents (use `setup()`)
4. All hooks are imported functions, not methods
5. Hooks can be called multiple times
6. Hooks can be extracted into composables

## Composable Pattern for Lifecycle

You can extract lifecycle logic into reusable composables:

```javascript
// useWindowSize.js
import { ref, onMounted, onUnmounted } from 'vue'

export function useWindowSize() {
  const width = ref(window.innerWidth)
  const height = ref(window.innerHeight)

  const handleResize = () => {
    width.value = window.innerWidth
    height.value = window.innerHeight
  }

  onMounted(() => {
    window.addEventListener('resize', handleResize)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
  })

  return { width, height }
}

// Usage in component
import { useWindowSize } from './useWindowSize'

const { width, height } = useWindowSize()
```

This pattern:
- Encapsulates setup and cleanup
- Makes code reusable
- Improves testability
- Separates concerns

## Summary

Key takeaways:
1. **Lifecycle hooks register callbacks** to execute at specific component phases
2. **Always clean up** resources in `onUnmounted`
3. **Child lifecycles complete before parent** in the same phase
4. **Keep-alive components** use `onActivated`/`onDeactivated` for cache management
5. **Error boundaries** use `onErrorCaptured` to catch child errors
6. **Debug rendering** with `onRenderTracked`/`onRenderTriggered` in dev mode
7. **Multiple registrations** are supported and all callbacks execute
8. **Hooks must be registered synchronously** during `setup()`
9. **Extract reusable logic** into composables with lifecycle hooks
10. **Performance matters**: avoid expensive operations in `onUpdated`
