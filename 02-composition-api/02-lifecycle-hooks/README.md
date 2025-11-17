# Lesson 2: Lifecycle Hooks in Vue 3

## Overview

Vue component lifecycle hooks are special functions that allow you to execute code at specific stages in a component's lifecycle. In Vue 3's Composition API, lifecycle hooks are imported functions that you call within your `setup()` function or `<script setup>`.

This lesson provides a comprehensive exploration of Vue 3 lifecycle hooks with interactive examples demonstrating all hooks, common patterns, and best practices.

## What You'll Learn

- All Vue 3 lifecycle hooks and when they fire
- Common lifecycle patterns (data fetching, cleanup, DOM manipulation)
- Advanced hooks (`onErrorCaptured`, `onRenderTracked`, `onRenderTriggered`)
- Keep-Alive lifecycle hooks (`onActivated`, `onDeactivated`)
- Best practices for using lifecycle hooks effectively
- Debugging and understanding lifecycle timing

## Prerequisites

- Understanding of Vue 3 Composition API basics
- Familiarity with reactive data (`ref`, `reactive`)
- Basic knowledge of Vue components

## Lifecycle Hooks Overview

### Creation Phase

1. **onBeforeMount**
   - Called right before the component is mounted
   - DOM not yet created
   - Good for last-minute setup before rendering

2. **onMounted**
   - Called after the component has been mounted
   - DOM is available
   - Perfect for data fetching, DOM manipulation, third-party integrations

### Update Phase

3. **onBeforeUpdate**
   - Called before component re-renders due to reactive data changes
   - Good for accessing DOM before updates

4. **onUpdated**
   - Called after component has re-rendered
   - DOM reflects new data
   - Be careful: avoid state changes here (can cause infinite loops)

### Destruction Phase

5. **onBeforeUnmount**
   - Called right before component is unmounted
   - Component still fully functional
   - Last chance to perform cleanup

6. **onUnmounted**
   - Called after component has been unmounted
   - Perfect for cleanup: timers, subscriptions, event listeners

### Error Handling

7. **onErrorCaptured**
   - Captures errors from child components
   - Useful for error boundaries
   - Can prevent error propagation

### Debugging Hooks

8. **onRenderTracked** (dev mode only)
   - Called when reactive dependency is tracked during render
   - Useful for debugging what triggers renders

9. **onRenderTriggered** (dev mode only)
   - Called when reactive dependency triggers component re-render
   - Helps identify unnecessary re-renders

### Keep-Alive Hooks

10. **onActivated**
    - Called when component is activated from `<keep-alive>` cache
    - Resume operations paused during deactivation

11. **onDeactivated**
    - Called when component is deactivated into `<keep-alive>` cache
    - Pause expensive operations

## Getting Started

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Project Structure

```
02-lifecycle-hooks/
├── src/
│   ├── App.vue                      # Main demo with all examples
│   ├── components/
│   │   ├── LifecycleDemo.vue        # Visualize all lifecycle hooks
│   │   ├── DataFetcher.vue          # Data fetching pattern
│   │   ├── DomManipulator.vue       # DOM access pattern
│   │   ├── UpdateTracker.vue        # Track updates pattern
│   │   ├── TimerComponent.vue       # Cleanup pattern
│   │   ├── ErrorBoundary.vue        # Error handling hook
│   │   ├── ErrorProneComponent.vue  # Test error boundary
│   │   ├── RenderDebugger.vue       # Debug render hooks
│   │   ├── TabOne.vue               # Keep-Alive demo
│   │   ├── TabTwo.vue               # Keep-Alive demo
│   │   └── TimingDemo.vue           # Lifecycle timing
│   └── main.js
├── package.json
└── README.md
```

## Interactive Examples

### Example 1: Lifecycle Visualizer

The `LifecycleDemo` component demonstrates all lifecycle hooks in action:

```vue
<template>
  <div class="demo">
    <p>Count: {{ count }}</p>
    <button @click="count++">Increment</button>
  </div>
</template>

<script setup>
import { ref, onBeforeMount, onMounted, onBeforeUpdate,
         onUpdated, onBeforeUnmount, onUnmounted } from 'vue'

const count = ref(0)

onBeforeMount(() => {
  console.log('onBeforeMount - Component about to mount')
})

onMounted(() => {
  console.log('onMounted - Component is mounted, DOM ready')
})

onBeforeUpdate(() => {
  console.log('onBeforeUpdate - About to update')
})

onUpdated(() => {
  console.log('onUpdated - Component updated')
})

onBeforeUnmount(() => {
  console.log('onBeforeUnmount - About to unmount')
})

onUnmounted(() => {
  console.log('onUnmounted - Component unmounted')
})
</script>
```

**When to use each hook:**
- **onBeforeMount**: Initialize data structures before rendering
- **onMounted**: Fetch data, set up subscriptions, access DOM
- **onBeforeUpdate**: Capture pre-update state
- **onUpdated**: React to DOM updates, third-party library sync
- **onBeforeUnmount**: Save state, confirm navigation
- **onUnmounted**: Clear timers, remove listeners, cleanup subscriptions

### Example 2: Data Fetching Pattern

Common pattern for loading data when component mounts:

```vue
<script setup>
import { ref, onMounted } from 'vue'

const data = ref(null)
const loading = ref(true)
const error = ref(null)

onMounted(async () => {
  try {
    const response = await fetch('https://api.example.com/data')
    data.value = await response.json()
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
})
</script>
```

**Key points:**
- Use `onMounted` for async data fetching
- Track loading and error states
- Handle cleanup if needed (abort controllers)

### Example 3: DOM Manipulation

Access and manipulate DOM elements after mounting:

```vue
<template>
  <canvas ref="canvasRef"></canvas>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const canvasRef = ref(null)

onMounted(() => {
  const canvas = canvasRef.value
  const ctx = canvas.getContext('2d')

  // Now you can safely use the canvas
  ctx.fillStyle = 'blue'
  ctx.fillRect(0, 0, 150, 100)
})
</script>
```

**Why onMounted:**
- Template refs are only populated after mount
- DOM elements are guaranteed to exist
- Third-party libraries requiring DOM elements

### Example 4: Cleanup Pattern

Properly clean up side effects to prevent memory leaks:

```vue
<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const seconds = ref(0)
let intervalId = null

onMounted(() => {
  // Start timer
  intervalId = setInterval(() => {
    seconds.value++
  }, 1000)
})

onUnmounted(() => {
  // Clean up timer
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
  }
})
</script>
```

**Common cleanup tasks:**
- Clear intervals and timeouts
- Remove event listeners
- Cancel pending requests
- Unsubscribe from observables
- Disconnect from WebSocket connections

### Example 5: Error Boundary

Use `onErrorCaptured` to catch errors from child components:

```vue
<script setup>
import { ref, onErrorCaptured } from 'vue'

const hasError = ref(false)
const errorMessage = ref('')

onErrorCaptured((err, instance, info) => {
  hasError.value = true
  errorMessage.value = err.message

  console.error('Error captured:', err)
  console.error('Component:', instance)
  console.error('Error info:', info)

  // Return false to prevent error from propagating
  return false
})
</script>
```

**Error handling benefits:**
- Prevent entire app from crashing
- Display user-friendly error messages
- Log errors for monitoring
- Provide recovery options

### Example 6: Render Tracking (Development)

Debug what causes component re-renders:

```vue
<script setup>
import { onRenderTracked, onRenderTriggered } from 'vue'

onRenderTracked((event) => {
  console.log('Dependency tracked:', event)
  // event contains: { effect, target, type, key }
})

onRenderTriggered((event) => {
  console.log('Re-render triggered by:', event)
  // Helps identify unnecessary re-renders
})
</script>
```

**Debugging use cases:**
- Identify performance bottlenecks
- Find unnecessary reactivity
- Understand component dependencies
- Optimize render performance

### Example 7: Keep-Alive Hooks

Special hooks for cached components:

```vue
<script setup>
import { ref, onActivated, onDeactivated } from 'vue'

const timer = ref(0)
let intervalId = null

onActivated(() => {
  // Resume when component becomes active
  console.log('Component activated')
  intervalId = setInterval(() => {
    timer.value++
  }, 1000)
})

onDeactivated(() => {
  // Pause when component is cached
  console.log('Component deactivated')
  if (intervalId) {
    clearInterval(intervalId)
  }
})
</script>
```

**When to use:**
- Pause/resume expensive operations
- Maintain state across tab switches
- Optimize performance for cached routes
- Control resource usage

## Common Patterns

### Pattern 1: Resource Management

```vue
<script setup>
import { onMounted, onUnmounted } from 'vue'

let connection = null

onMounted(() => {
  // Acquire resource
  connection = createWebSocketConnection()
  connection.on('message', handleMessage)
})

onUnmounted(() => {
  // Release resource
  if (connection) {
    connection.off('message', handleMessage)
    connection.close()
    connection = null
  }
})
</script>
```

### Pattern 2: Third-Party Integration

```vue
<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const chartRef = ref(null)
let chart = null

onMounted(() => {
  // Initialize third-party library
  chart = new Chart(chartRef.value, {
    type: 'bar',
    data: { /* ... */ }
  })
})

onUnmounted(() => {
  // Cleanup
  if (chart) {
    chart.destroy()
  }
})
</script>
```

### Pattern 3: Window Event Listeners

```vue
<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const windowWidth = ref(window.innerWidth)

const handleResize = () => {
  windowWidth.value = window.innerWidth
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>
```

### Pattern 4: Async Setup with Cleanup

```vue
<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const data = ref([])
let abortController = null

onMounted(async () => {
  abortController = new AbortController()

  try {
    const response = await fetch('/api/data', {
      signal: abortController.signal
    })
    data.value = await response.json()
  } catch (err) {
    if (err.name !== 'AbortError') {
      console.error('Fetch error:', err)
    }
  }
})

onUnmounted(() => {
  if (abortController) {
    abortController.abort()
  }
})
</script>
```

## Best Practices

### 1. Always Clean Up

```vue
<!-- BAD: Memory leak -->
<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  setInterval(() => console.log('tick'), 1000)
  // ❌ Never cleaned up!
})
</script>

<!-- GOOD: Proper cleanup -->
<script setup>
import { onMounted, onUnmounted } from 'vue'

let intervalId = null

onMounted(() => {
  intervalId = setInterval(() => console.log('tick'), 1000)
})

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId)
  }
})
</script>
```

### 2. Avoid State Changes in onUpdated

```vue
<!-- BAD: Infinite loop -->
<script setup>
import { ref, onUpdated } from 'vue'

const count = ref(0)

onUpdated(() => {
  count.value++ // ❌ Causes another update!
})
</script>

<!-- GOOD: Use watchers for reactive updates -->
<script setup>
import { ref, watch } from 'vue'

const count = ref(0)
const doubled = ref(0)

watch(count, (newValue) => {
  doubled.value = newValue * 2
})
</script>
```

### 3. Use Async Carefully in onMounted

```vue
<!-- BAD: Unhandled errors -->
<script setup>
import { onMounted } from 'vue'

onMounted(async () => {
  await fetchData() // ❌ Errors not handled
})
</script>

<!-- GOOD: Proper error handling -->
<script setup>
import { ref, onMounted } from 'vue'

const error = ref(null)

onMounted(async () => {
  try {
    await fetchData()
  } catch (err) {
    error.value = err.message
    console.error('Mount error:', err)
  }
})
</script>
```

### 4. Keep Hooks at Top Level

```vue
<!-- BAD: Conditional hooks -->
<script setup>
import { onMounted } from 'vue'

if (someCondition) {
  onMounted(() => {}) // ❌ Don't do this!
}
</script>

<!-- GOOD: Hooks always called -->
<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  if (someCondition) {
    // Conditional logic inside
  }
})
</script>
```

### 5. Use Multiple Hook Calls

```vue
<!-- You can call the same hook multiple times -->
<script setup>
import { onMounted } from 'vue'

// Feature A setup
onMounted(() => {
  setupFeatureA()
})

// Feature B setup
onMounted(() => {
  setupFeatureB()
})

// All onMounted callbacks will execute
</script>
```

## Lifecycle Flow Diagram

```
Component Creation
       ↓
   setup() runs
       ↓
onBeforeMount ──→ Component instance created, template compiled
       ↓
  [Mounting]
       ↓
   onMounted ──→ DOM created and inserted, refs available
       ↓
   [Active] ──→ Component is interactive
       ↓
 Data changes?
       ↓
onBeforeUpdate ──→ DOM about to update
       ↓
  [Re-render]
       ↓
   onUpdated ──→ DOM updated
       ↓
 (back to Active)
       ↓
Component unmounting?
       ↓
onBeforeUnmount ──→ Component still functional
       ↓
 [Unmounting]
       ↓
  onUnmounted ──→ Cleanup complete
       ↓
   [Destroyed]
```

## Testing Lifecycle Hooks

When writing tests, you may need to trigger or verify lifecycle behavior:

```javascript
import { mount } from '@vue/test-utils'
import MyComponent from './MyComponent.vue'

describe('MyComponent', () => {
  it('fetches data on mount', async () => {
    const wrapper = mount(MyComponent)

    // onMounted has run
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.data).toBeDefined()
  })

  it('cleans up on unmount', () => {
    const wrapper = mount(MyComponent)
    const clearSpy = vi.spyOn(global, 'clearInterval')

    wrapper.unmount()

    expect(clearSpy).toHaveBeenCalled()
  })
})
```

## Common Pitfalls

### 1. Accessing Refs Too Early

```vue
<!-- BAD -->
<script setup>
import { ref } from 'vue'

const myRef = ref(null)
console.log(myRef.value) // null - not mounted yet!
</script>

<!-- GOOD -->
<script setup>
import { ref, onMounted } from 'vue'

const myRef = ref(null)

onMounted(() => {
  console.log(myRef.value) // ✓ Available now
})
</script>
```

### 2. Forgetting Return Value in onErrorCaptured

```vue
<script setup>
import { onErrorCaptured } from 'vue'

onErrorCaptured((err) => {
  logError(err)
  // No return - error propagates up!
})

// Should return false to stop propagation
onErrorCaptured((err) => {
  logError(err)
  return false // ✓ Error stops here
})
</script>
```

### 3. Memory Leaks from Event Listeners

```vue
<!-- BAD -->
<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  document.addEventListener('scroll', handleScroll)
  // ❌ Never removed!
})
</script>

<!-- GOOD -->
<script setup>
import { onMounted, onUnmounted } from 'vue'

onMounted(() => {
  document.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  document.removeEventListener('scroll', handleScroll)
})
</script>
```

## Performance Tips

1. **Lazy load in onMounted**: Don't import heavy libraries during setup
2. **Debounce in onUpdated**: Avoid expensive operations on every update
3. **Use onActivated/onDeactivated**: Pause background work when cached
4. **Profile with render hooks**: Identify unnecessary reactivity
5. **Clean up aggressively**: Free resources as soon as possible

## Additional Resources

- [Vue 3 Lifecycle Hooks Official Docs](https://vuejs.org/api/composition-api-lifecycle.html)
- [Composition API RFC](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0013-composition-api.md)
- [Vue 3 Best Practices](https://vuejs.org/style-guide/)

## Next Steps

After mastering lifecycle hooks, explore:
- **Lesson 3**: Custom Directives
- **Lesson 4**: Teleport & Suspense
- **Lesson 5**: Plugin System
- **Lesson 6**: Advanced Composable Patterns

## Summary

Lifecycle hooks are essential for:
- Fetching data when components load
- Integrating with third-party libraries
- Managing resources and preventing memory leaks
- Handling errors gracefully
- Debugging render performance
- Optimizing cached components

The key to mastering lifecycle hooks is understanding when each hook fires and using them appropriately for setup, updates, and cleanup.
