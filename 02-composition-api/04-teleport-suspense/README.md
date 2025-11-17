# Lesson 4: Teleport & Suspense

## Overview

Vue 3 introduces two powerful built-in components: `<Teleport>` for rendering content in different parts of the DOM, and `<Suspense>` for handling async components with loading states. These features solve common challenges in modern web applications.

## What You'll Learn

- Using `<Teleport>` for modals, tooltips, and notifications
- Conditional and multiple teleports
- `<Suspense>` for async component loading
- Nested Suspense boundaries
- Error handling with async components
- Combining Teleport and Suspense

## Getting Started

```bash
npm install
npm run dev
```

## Part 1: Teleport

### What is Teleport?

`<Teleport>` renders its content in a different location in the DOM while maintaining the component's logical position in the Vue component tree.

### Basic Syntax

```vue
<template>
  <div>
    <button @click="show = true">Open Modal</button>

    <Teleport to="body">
      <div v-if="show" class="modal">
        Modal content
      </div>
    </Teleport>
  </div>
</template>
```

**Key points:**
- Content teleports to target selector
- Maintains component context (props, events, state)
- Perfect for modals, tooltips, notifications

### Example 1: Modal Dialog

```vue
<script setup>
import { ref } from 'vue'

const showModal = ref(false)
</script>

<template>
  <button @click="showModal = true">Open</button>

  <Teleport to="body">
    <div v-if="showModal" class="modal-overlay">
      <div class="modal-content">
        <h3>Modal</h3>
        <button @click="showModal = false">Close</button>
      </div>
    </div>
  </Teleport>
</template>
```

**Why teleport modals:**
- Escape parent `overflow: hidden` or `z-index` constraints
- Consistent stacking context
- Accessibility improvements

### Example 2: Notification System

```vue
<Teleport to="#notification-container">
  <TransitionGroup name="notification">
    <div
      v-for="notif in notifications"
      :key="notif.id"
      class="notification"
    >
      {{ notif.message }}
    </div>
  </TransitionGroup>
</Teleport>
```

**Benefits:**
- Fixed positioning relative to viewport
- Independent of parent layout
- Easy to manage global notifications

### Conditional Teleport

Use `:disabled` prop to conditionally teleport:

```vue
<Teleport :to="target" :disabled="!shouldTeleport">
  <div>Content</div>
</Teleport>
```

### Multiple Teleports

Multiple components can teleport to the same target:

```vue
<Teleport to="#target">
  <div>First</div>
</Teleport>

<Teleport to="#target">
  <div>Second</div>
</Teleport>

<!-- Both render in #target in order -->
```

## Part 2: Suspense

### What is Suspense?

`<Suspense>` handles async dependencies in components, showing fallback content while waiting for async operations to complete.

### Basic Syntax

```vue
<Suspense>
  <template #default>
    <AsyncComponent />
  </template>
  <template #fallback>
    <div>Loading...</div>
  </template>
</Suspense>
```

### Async Components

Components using top-level `await`:

```vue
<script setup>
const data = ref(null)

// Top-level await makes component async
await fetchData().then(result => {
  data.value = result
})
</script>

<template>
  <div>{{ data }}</div>
</template>
```

### Example: User Data Loading

```vue
<!-- AsyncUserData.vue -->
<script setup>
import { ref } from 'vue'

const user = ref(null)

await fetch('/api/user')
  .then(r => r.json())
  .then(data => user.value = data)
</script>

<template>
  <div class="user-card">
    <h4>{{ user.name }}</h4>
    <p>{{ user.email }}</p>
  </div>
</template>

<!-- Parent.vue -->
<Suspense>
  <template #default>
    <AsyncUserData />
  </template>
  <template #fallback>
    <div>Loading user...</div>
  </template>
</Suspense>
```

### Nested Suspense

Suspense boundaries can be nested:

```vue
<Suspense>
  <template #default>
    <ParentComponent>
      <Suspense>
        <template #default>
          <ChildComponent />
        </template>
        <template #fallback>
          <div>Loading child...</div>
        </template>
      </Suspense>
    </ParentComponent>
  </template>
  <template #fallback>
    <div>Loading parent...</div>
  </template>
</Suspense>
```

### Suspense Events

Listen to Suspense lifecycle events:

```vue
<Suspense
  @pending="onPending"
  @resolve="onResolve"
  @fallback="onFallback"
>
  <template #default>
    <AsyncComponent />
  </template>
  <template #fallback>
    <LoadingSpinner />
  </template>
</Suspense>

<script setup>
const onPending = () => {
  console.log('Async component loading')
}

const onResolve = () => {
  console.log('Async component loaded')
}

const onFallback = () => {
  console.log('Showing fallback')
}
</script>
```

### Error Handling

Use `onErrorCaptured` in parent components:

```vue
<script setup>
import { onErrorCaptured, ref } from 'vue'

const error = ref(null)

onErrorCaptured((err) => {
  error.value = err
  return false // Prevent propagation
})
</script>

<template>
  <div v-if="error" class="error">
    Error: {{ error.message }}
  </div>

  <Suspense v-else>
    <template #default>
      <AsyncComponent />
    </template>
    <template #fallback>
      <LoadingState />
    </template>
  </Suspense>
</template>
```

### Timeout

Set a timeout for showing fallback:

```vue
<Suspense :timeout="1000">
  <template #default>
    <AsyncComponent />
  </template>
  <template #fallback>
    <div>Taking longer than expected...</div>
  </template>
</Suspense>
```

## Part 3: Combining Teleport + Suspense

Perfect for async modals and dialogs:

```vue
<script setup>
import { ref } from 'vue'

const showModal = ref(false)
</script>

<template>
  <button @click="showModal = true">Open Async Modal</button>

  <Teleport to="body">
    <div v-if="showModal" class="modal-overlay">
      <div class="modal-content">
        <Suspense>
          <template #default>
            <AsyncModalContent />
          </template>
          <template #fallback>
            <div class="loading">Loading content...</div>
          </template>
        </Suspense>
        <button @click="showModal = false">Close</button>
      </div>
    </div>
  </Teleport>
</template>
```

## Best Practices

### Teleport

1. **Target must exist**: Ensure teleport target exists in DOM
2. **Multiple teleports**: Order matters - they render in sequence
3. **SSR**: Teleport doesn't work during SSR, needs client hydration
4. **Cleanup**: Teleported content is cleaned up when component unmounts

### Suspense

1. **Error boundaries**: Always wrap Suspense in error handlers
2. **Loading states**: Provide meaningful fallback content
3. **Nested boundaries**: Use nested Suspense for granular loading states
4. **Timeout**: Set appropriate timeout values
5. **Testing**: Test both loading and loaded states

## Common Patterns

### Pattern 1: Global Modal Manager

```vue
<!-- ModalManager.vue -->
<Teleport to="body">
  <TransitionGroup name="modal">
    <div
      v-for="modal in openModals"
      :key="modal.id"
      class="modal-overlay"
    >
      <component :is="modal.component" v-bind="modal.props" />
    </div>
  </TransitionGroup>
</Teleport>
```

### Pattern 2: Lazy Route Loading

```vue
<router-view v-slot="{ Component }">
  <Suspense>
    <template #default>
      <component :is="Component" />
    </template>
    <template #fallback>
      <PageLoader />
    </template>
  </Suspense>
</router-view>
```

### Pattern 3: Progressive Enhancement

```vue
<Suspense>
  <template #default>
    <EnhancedComponent />
  </template>
  <template #fallback>
    <BasicComponent />
  </template>
</Suspense>
```

## Summary

**Teleport:**
- Renders content anywhere in DOM
- Maintains component context
- Perfect for modals, tooltips, overlays

**Suspense:**
- Handles async component loading
- Declarative loading states
- Supports nesting and error handling

Together they solve complex UI challenges elegantly.

## Next Steps

- **Lesson 5**: Plugin System
- **Lesson 6**: Advanced Composable Patterns
- **Exercise**: Build a Plugin System
