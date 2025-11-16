# Deep Dive: Provide/Inject - Dependency Injection in Vue 3

## Table of Contents

1. [Introduction](#introduction)
2. [The Problem: Prop Drilling](#the-problem-prop-drilling)
3. [How Provide/Inject Works](#how-provide-inject-works)
4. [Reactivity Considerations](#reactivity-considerations)
5. [Symbol Keys](#symbol-keys)
6. [TypeScript Integration](#typescript-integration)
7. [Advanced Patterns](#advanced-patterns)
8. [Performance](#performance)
9. [Comparison with Other Patterns](#comparison-with-other-patterns)
10. [Best Practices](#best-practices)

---

## Introduction

Provide/Inject is Vue 3's built-in dependency injection system. It solves the "prop drilling" problem by allowing ancestor components to provide data that any descendant can inject, regardless of component tree depth.

### Core Concept

```
Root Component (provides)
  ↓
Parent Component (doesn't care)
  ↓
Child Component (doesn't care)
  ↓
Grandchild Component (injects) ✨
```

The grandchild can access data from the root without props passing through parent and child.

---

## The Problem: Prop Drilling

### Prop Drilling Example

```vue
<!-- App.vue -->
<script setup>
import { ref } from 'vue'
const theme = ref('dark')
</script>

<template>
  <Layout :theme="theme">  <!-- Pass down -->
</template>

<!-- Layout.vue -->
<script setup>
defineProps(['theme'])
</script>

<template>
  <Sidebar :theme="theme">  <!-- Pass down again -->
</template>

<!-- Sidebar.vue -->
<script setup>
defineProps(['theme'])
</script>

<template>
  <Menu :theme="theme">  <!-- Keep passing... -->
</template>

<!-- Menu.vue -->
<script setup>
defineProps(['theme'])
</script>

<template>
  <MenuItem :theme="theme">  <!-- Still passing... -->
</template>

<!-- MenuItem.vue -->
<script setup>
const props = defineProps(['theme'])  <!-- Finally used here! -->
</script>
```

**Problems:**
- 🔴 Props passed through 4 components
- 🔴 Intermediate components don't use the data
- 🔴 Hard to refactor (changing the tree breaks things)
- 🔴 Coupling between unrelated components

### Solution with Provide/Inject

```vue
<!-- App.vue -->
<script setup>
import { provide, ref } from 'vue'

const theme = ref('dark')
provide('theme', theme)  <!-- Provide once -->
</script>

<template>
  <Layout>  <!-- No props! -->
</template>

<!-- Layout.vue, Sidebar.vue, Menu.vue -->
<!-- No props needed! Just pass through -->
<template>
  <slot></slot>
</template>

<!-- MenuItem.vue -->
<script setup>
import { inject } from 'vue'

const theme = inject('theme')  <!-- Inject directly! -->
</script>
```

**Benefits:**
- ✅ No prop drilling
- ✅ Intermediate components are cleaner
- ✅ Easy to refactor tree structure
- ✅ Loose coupling

---

## How Provide/Inject Works

### Mechanism

Vue maintains an **injection context** for each component. When you `provide` a value:

1. Vue adds it to the current component's context
2. The context is passed down to all descendants
3. Any descendant can `inject` from this context

```javascript
// Simplified internals
class Component {
  constructor(parent) {
    // Inherit parent's context
    this.provides = parent ? Object.create(parent.provides) : {}
  }

  provide(key, value) {
    this.provides[key] = value
  }

  inject(key, defaultValue) {
    // Walk up the prototype chain
    return key in this.provides ? this.provides[key] : defaultValue
  }
}
```

### Prototype Chain

Provide/inject uses JavaScript's prototype chain:

```javascript
// Root provides
rootProvides = { theme: 'dark' }

// Child inherits
childProvides = Object.create(rootProvides)
// childProvides.__proto__ === rootProvides

// Grandchild inherits
grandchildProvides = Object.create(childProvides)
// Can access rootProvides.theme through prototype chain
```

This allows:
- **Inheritance**: Children inherit parent provides
- **Overriding**: Children can override parent values
- **Efficiency**: No copying, just prototype references

---

## Reactivity Considerations

### Reactive Provides

For reactivity, provide refs or reactive objects:

```vue
<script setup>
import { provide, ref, reactive } from 'vue'

// ✅ Reactive - uses ref
const count = ref(0)
provide('count', count)

// ✅ Reactive - uses reactive
const user = reactive({ name: 'John' })
provide('user', user)

// ❌ Not reactive - plain value
provide('static', 'hello')
</script>
```

### How Reactivity Propagates

```vue
<!-- Provider -->
<script setup>
import { provide, ref } from 'vue'

const count = ref(0)
provide('count', count)

// When this changes...
function increment() {
  count.value++
}
</script>

<!-- Consumer -->
<script setup>
import { inject } from 'vue'

// The ref itself is injected (not just the value)
const count = inject('count')

// So this automatically updates!
</script>

<template>
  <div>{{ count }}</div>  <!-- Reactive! -->
</template>
```

### Deep Reactivity

```vue
<script setup>
import { provide, reactive } from 'vue'

const state = reactive({
  user: {
    name: 'John',
    address: {
      city: 'NYC'
    }
  }
})

provide('state', state)

// All levels are reactive
state.user.address.city = 'LA'  // Consumers update!
</script>
```

### Readonly Injection

Prevent consumers from modifying provided state:

```vue
<script setup>
import { provide, ref, readonly } from 'vue'

const count = ref(0)

// Provide readonly version
provide('count', readonly(count))

// Provide methods to modify
provide('increment', () => count.value++)
provide('decrement', () => count.value--)
</script>
```

Consumer:

```vue
<script setup>
import { inject } from 'vue'

const count = inject('count')
const increment = inject('increment')

// ❌ This will warn/error
// count.value++

// ✅ This works
increment()
</script>
```

---

## Symbol Keys

### Why Symbols?

String keys can conflict:

```vue
<!-- Library A -->
<script setup>
provide('config', { theme: 'dark' })
</script>

<!-- Library B (in same app) -->
<script setup>
provide('config', { apiUrl: 'https://...' })  // Conflict!
</script>
```

Symbols are unique:

```javascript
const sym1 = Symbol('config')
const sym2 = Symbol('config')

sym1 === sym2  // false - unique!
```

### Using Symbols

```javascript
// keys.js
export const ThemeKey = Symbol('theme')
export const UserKey = Symbol('user')
export const ConfigKey = Symbol('config')
```

```vue
<!-- Provider -->
<script setup>
import { provide } from 'vue'
import { ThemeKey } from './keys'

provide(ThemeKey, { mode: 'dark' })
</script>

<!-- Consumer -->
<script setup>
import { inject } from 'vue'
import { ThemeKey } from './keys'

const theme = inject(ThemeKey)
</script>
```

### Symbol Benefits

1. **No Conflicts**: Symbols are guaranteed unique
2. **Type Safety**: Better TypeScript support
3. **Private**: Can't be accessed without importing the symbol
4. **Intentional**: Must explicitly import to use

---

## TypeScript Integration

### Basic Typing

```typescript
// keys.ts
import { InjectionKey } from 'vue'

export interface Theme {
  mode: 'light' | 'dark'
  colors: {
    primary: string
    secondary: string
  }
}

export const ThemeKey: InjectionKey<Theme> = Symbol('theme')
```

### Provider

```vue
<script setup lang="ts">
import { provide } from 'vue'
import { ThemeKey, type Theme } from './keys'

const theme: Theme = {
  mode: 'dark',
  colors: {
    primary: '#667eea',
    secondary: '#764ba2'
  }
}

provide(ThemeKey, theme)  // Fully typed!
</script>
```

### Consumer

```vue
<script setup lang="ts">
import { inject } from 'vue'
import { ThemeKey } from './keys'

// theme is typed as Theme | undefined
const theme = inject(ThemeKey)

// With default - typed as Theme
const theme = inject(ThemeKey, {
  mode: 'light',
  colors: { primary: '#000', secondary: '#fff' }
})

// Non-null assertion (use carefully)
const theme = inject(ThemeKey)!
</script>
```

### Complex Types

```typescript
// keys.ts
import { InjectionKey, Ref } from 'vue'

export interface AuthContext {
  user: Ref<User | null>
  isAuthenticated: Ref<boolean>
  login: (credentials: Credentials) => Promise<void>
  logout: () => void
}

export const AuthKey: InjectionKey<AuthContext> = Symbol('auth')
```

---

## Advanced Patterns

### Pattern 1: Provider Component

```vue
<!-- ThemeProvider.vue -->
<script setup>
import { provide, reactive } from 'vue'

const theme = reactive({
  mode: 'light',
  colors: {
    primary: '#667eea',
    secondary: '#764ba2'
  },
  toggle() {
    this.mode = this.mode === 'light' ? 'dark' : 'light'
  }
})

provide('theme', theme)
</script>

<template>
  <slot :theme="theme"></slot>
</template>
```

Usage:

```vue
<ThemeProvider v-slot="{ theme }">
  <div>
    <button @click="theme.toggle">Toggle Theme</button>
    <App />
  </div>
</ThemeProvider>
```

### Pattern 2: Composable Abstraction

```javascript
// useTheme.js
import { inject } from 'vue'

const ThemeKey = Symbol('theme')

export function provideTheme(theme) {
  provide(ThemeKey, theme)
}

export function useTheme() {
  const theme = inject(ThemeKey)

  if (!theme) {
    throw new Error('useTheme() must be used within a ThemeProvider')
  }

  return theme
}
```

Usage:

```vue
<script setup>
import { useTheme } from './composables/useTheme'

const theme = useTheme()
</script>
```

### Pattern 3: Nested Providers

```vue
<!-- App.vue -->
<script setup>
provide('level', 1)
provide('theme', 'light')
</script>

<!-- Component A (child of App) -->
<script setup>
provide('level', 2)  // Override level
// theme is inherited as 'light'
</script>

<!-- Component B (child of A) -->
<script setup>
const level = inject('level')  // 2 (from A)
const theme = inject('theme')  // 'light' (from App)
</script>
```

### Pattern 4: Context Object

```vue
<script setup>
import { provide, reactive } from 'vue'

// Single context object with multiple values
const appContext = reactive({
  theme: { mode: 'light' },
  user: { name: 'John' },
  config: { apiUrl: 'https://...' },

  // Methods
  toggleTheme() {
    this.theme.mode = this.theme.mode === 'light' ? 'dark' : 'light'
  },

  setUser(user) {
    this.user = user
  }
})

provide('appContext', appContext)
</script>
```

---

## Performance

### Performance Characteristics

- **Provide**: O(1) - just sets a property
- **Inject**: O(n) where n is component tree depth (walks prototype chain)
- **Memory**: Minimal - uses prototype chain, no copying

### Performance Comparison

```javascript
// Props: O(1) lookup, passed directly
props.theme

// Inject: O(n) lookup, walks up tree
inject('theme')
```

For deeply nested trees, inject is slightly slower than props. But:
- Difference is negligible (microseconds)
- Code clarity often outweighs performance cost
- Only relevant in extreme cases (thousands of components)

### Optimization Tips

1. **Cache injected values**:
```vue
<script setup>
// ✅ Good - inject once
const theme = inject('theme')

// ❌ Bad - inject multiple times
function getTheme() {
  return inject('theme')
}
</script>
```

2. **Use symbols for frequently injected values**:
```javascript
// Faster lookup than strings
const ThemeKey = Symbol('theme')
```

3. **Don't over-inject**:
```vue
<!-- ❌ Too much injection -->
<script setup>
const value1 = inject('value1')
const value2 = inject('value2')
const value3 = inject('value3')
// ... 20 more injections
</script>

<!-- ✅ Group related values -->
<script setup>
const context = inject('context')
// context.value1, context.value2, etc.
</script>
```

---

## Comparison with Other Patterns

### Provide/Inject vs Props

| Feature | Props | Provide/Inject |
|---------|-------|----------------|
| Explicitness | Very explicit | Implicit |
| Type checking | Excellent | Good (with TS) |
| Debugging | Easy | Harder |
| Refactoring | Harder (breaks chain) | Easier |
| Best for | Direct parent-child | Cross-cutting concerns |

### Provide/Inject vs Pinia/Vuex

| Feature | Provide/Inject | Pinia/Vuex |
|---------|----------------|------------|
| Scope | Component tree | Global |
| DevTools | Limited | Excellent |
| Time travel | No | Yes |
| Plugins | No | Yes |
| Best for | App config, theme | Application state |

### Provide/Inject vs Event Bus

| Feature | Provide/Inject | Event Bus |
|---------|----------------|-----------|
| Direction | Down tree only | Any to any |
| Type | Data sharing | Event communication |
| Reactivity | Built-in | Manual |
| Best for | Shared state | Decoupled events |

---

## Best Practices

### ✅ Do

1. **Use for cross-cutting concerns**: Theme, i18n, permissions
2. **Provide reactive values**: Use ref/reactive
3. **Use symbols in libraries**: Prevent conflicts
4. **Provide defaults**: Make components resilient
5. **Document injection keys**: Create keys file
6. **Combine with composables**: Encapsulate logic
7. **Use readonly when appropriate**: Prevent accidental mutations

### ❌ Don't

1. **Don't use for simple parent-child**: Use props
2. **Don't use for global state**: Use Pinia
3. **Don't provide primitive values expecting reactivity**
4. **Don't create implicit dependencies**: Document clearly
5. **Don't use string keys in large apps**: Use symbols
6. **Don't inject in setup without defaults**: May be undefined
7. **Don't overuse**: Not everything needs injection

### When to Choose What

**Use Props when:**
- Direct parent-child relationship
- Component API/interface
- Need explicit contract
- Reusable component library

**Use Provide/Inject when:**
- Deep component tree
- Cross-cutting concern (theme, locale)
- Avoiding prop drilling
- Context (form, dialog, etc.)

**Use Pinia when:**
- Global application state
- Need devtools
- Complex state logic
- Multiple components need same state

---

## Summary

**Provide/Inject** is a powerful pattern for dependency injection in Vue 3:

- ✅ Solves prop drilling
- ✅ Clean component trees
- ✅ Reactive by default
- ✅ Type-safe with symbols/TS
- ✅ Perfect for themes, i18n, auth

**Key Takeaways:**

1. Use for cross-cutting concerns, not all data flow
2. Provide reactive values (ref/reactive)
3. Use symbols for type safety
4. Provide defaults for resilience
5. Don't replace props or state management
6. Document what's provided/injected

**Remember:** Provide/Inject is a tool, not a hammer. Use it where it makes sense, and choose simpler patterns when possible.

---

**Next:** Learn about [Lifecycle Hooks](../02-lifecycle-hooks/README.md) to understand component lifecycle deeply!
