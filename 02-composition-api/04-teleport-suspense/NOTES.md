# Technical Notes: Teleport & Suspense

## Teleport Implementation

### How Teleport Works Internally

```javascript
// Simplified teleport rendering
function renderTeleport(vnode, container) {
  const target = document.querySelector(vnode.props.to)

  if (vnode.props.disabled) {
    // Render in place
    render(vnode.children, container)
  } else {
    // Render to target
    render(vnode.children, target)
  }

  // Track for cleanup
  teleportMap.set(vnode, target)
}
```

**Key behaviors:**
- Content unmounts when component unmounts
- Target must exist before teleport renders
- Props/events work normally despite DOM location

### SSR Considerations

Teleport doesn't work during SSR:

```vue
<Teleport to="body">
  <div>Won't render on server</div>
</Teleport>
```

**Solution**: Use `<ClientOnly>` wrapper or conditional rendering:

```vue
<ClientOnly>
  <Teleport to="body">
    <Modal />
  </Teleport>
</ClientOnly>
```

## Suspense Implementation

### Async Component Resolution

```javascript
// How Suspense tracks async dependencies
class SuspenseBoundary {
  pending = new Set()
  resolved = false

  registerDep(promise) {
    this.pending.add(promise)

    promise
      .then(() => {
        this.pending.delete(promise)
        if (this.pending.size === 0) {
          this.resolved = true
          this.showDefault()
        }
      })
      .catch(err => {
        this.handleError(err)
      })
  }

  showDefault() {
    // Render default slot
  }

  showFallback() {
    // Render fallback slot
  }
}
```

### Top-Level Await

Components with top-level `await` return a Promise:

```vue
<script setup>
// This makes the component async
await fetchData()
</script>
```

**Compiled output:**
```javascript
export default {
  async setup() {
    await fetchData()
    return { /* bindings */ }
  }
}
```

## Advanced Patterns

### Pattern 1: Teleport Manager

Centralized teleport management:

```javascript
// usePortal.js
import { ref, provide, inject } from 'vue'

const portalKey = Symbol('portal')

export function providePortal() {
  const portals = ref(new Map())

  const register = (id, component) => {
    portals.value.set(id, component)
  }

  const unregister = (id) => {
    portals.value.delete(id)
  }

  provide(portalKey, {
    portals,
    register,
    unregister
  })

  return { portals }
}

export function usePortal() {
  const portal = inject(portalKey)
  if (!portal) {
    throw new Error('Portal not provided')
  }
  return portal
}
```

### Pattern 2: Suspense State Machine

Track Suspense states:

```javascript
import { ref, watch } from 'vue'

export function useSuspenseState() {
  const state = ref('idle')
  const isLoading = computed(() => state.value === 'loading')
  const isResolved = computed(() => state.value === 'resolved')
  const hasError = computed(() => state.value === 'error')

  return {
    state,
    isLoading,
    isResolved,
    hasError,
    onPending: () => state.value = 'loading',
    onResolve: () => state.value = 'resolved',
    onError: () => state.value = 'error'
  }
}
```

### Pattern 3: Retry Logic

Implement retry for failed async components:

```vue
<script setup>
import { ref, computed } from 'vue'

const retryCount = ref(0)
const maxRetries = 3

const componentKey = computed(() => `async-${retryCount.value}`)

const handleError = () => {
  if (retryCount.value < maxRetries) {
    retryCount.value++
  }
}
</script>

<template>
  <Suspense :key="componentKey" @error="handleError">
    <template #default>
      <AsyncComponent />
    </template>
    <template #fallback>
      <div>Loading... (attempt {{ retryCount + 1 }})</div>
    </template>
  </Suspense>
</template>
```

## Performance Considerations

### Teleport Performance

**Minimize teleports**: Each teleport adds overhead

```vue
<!-- BAD: Many individual teleports -->
<Teleport to="body" v-for="item in items" :key="item.id">
  <div>{{ item }}</div>
</Teleport>

<!-- GOOD: Single teleport with loop inside -->
<Teleport to="body">
  <div v-for="item in items" :key="item.id">
    {{ item }}
  </div>
</Teleport>
```

### Suspense Performance

**Code splitting**: Use Suspense with dynamic imports

```javascript
const AsyncComponent = defineAsyncComponent(() =>
  import('./HeavyComponent.vue')
)
```

**Prefetching**: Preload critical async components

```javascript
import('./CriticalComponent.vue') // Starts loading immediately
```

## Testing

### Testing Teleport

```javascript
import { mount } from '@vue/test-utils'

describe('Modal with Teleport', () => {
  beforeEach(() => {
    const el = document.createElement('div')
    el.id = 'modal-container'
    document.body.appendChild(el)
  })

  afterEach(() => {
    document.getElementById('modal-container')?.remove()
  })

  it('teleports content', async () => {
    const wrapper = mount(ModalComponent)

    await wrapper.find('button').trigger('click')

    const teleportTarget = document.getElementById('modal-container')
    expect(teleportTarget.innerHTML).toContain('Modal content')
  })
})
```

### Testing Suspense

```javascript
import { flushPromises } from '@vue/test-utils'

describe('Suspense component', () => {
  it('shows fallback then content', async () => {
    const wrapper = mount(SuspenseWrapper)

    // Initially shows fallback
    expect(wrapper.text()).toContain('Loading')

    // Wait for async resolution
    await flushPromises()

    // Now shows content
    expect(wrapper.text()).toContain('Loaded')
  })
})
```

## Browser Support

- Teleport: All modern browsers
- Suspense: All modern browsers
- SSR: Teleport requires client-side hydration

## Migration from Vue 2

### Portal (Vue 2) to Teleport (Vue 3)

```vue
<!-- Vue 2 (portal-vue library) -->
<portal to="destination">
  <div>Content</div>
</portal>

<!-- Vue 3 (built-in) -->
<Teleport to="#destination">
  <div>Content</div>
</Teleport>
```

### Async Components

```javascript
// Vue 2
Vue.component('async-component', () => import('./Component.vue'))

// Vue 3
import { defineAsyncComponent } from 'vue'

const AsyncComp = defineAsyncComponent(() =>
  import('./Component.vue')
)
```

## Summary

**Teleport:**
- Renders content in different DOM locations
- Maintains component relationship
- Use for overlays, modals, notifications

**Suspense:**
- Handles async component loading
- Declarative loading states
- Essential for code splitting

Both are fundamental for modern Vue 3 applications.
