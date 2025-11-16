# Provide/Inject - Dependency Injection

## 🎯 Overview

Learn how to use Vue 3's `provide` and `inject` API for dependency injection. This powerful pattern allows you to pass data through the component tree without "prop drilling" - passing props through every intermediate component.

## What You'll Build

A **multi-level theme system** demonstrating:
- Theme provider/consumer pattern
- User authentication context
- Global configuration
- Reactive injection
- Type-safe injection with symbols
- Default values

## Key Concepts

### What is Provide/Inject?

**Provide/Inject** is Vue's dependency injection system. A parent component can "provide" data, and any descendant component (no matter how deep) can "inject" that data.

```vue
<!-- Parent/Ancestor -->
<script setup>
import { provide, ref } from 'vue'

const theme = ref('dark')
provide('theme', theme)
</script>

<!-- Child/Descendant (any level deep) -->
<script setup>
import { inject } from 'vue'

const theme = inject('theme')
</script>
```

### Why Use Provide/Inject?

**Problem: Prop Drilling**

```vue
<!-- Without provide/inject - prop drilling -->
<App>
  <Layout :theme="theme">
    <Sidebar :theme="theme">
      <Menu :theme="theme">
        <MenuItem :theme="theme" />  <!-- 😫 Props through 4 levels! -->
      </Menu>
    </Sidebar>
  </Layout>
</App>
```

**Solution: Provide/Inject**

```vue
<!-- With provide/inject - clean! -->
<App>  <!-- provide('theme', theme) -->
  <Layout>
    <Sidebar>
      <Menu>
        <MenuItem />  <!-- inject('theme') ✨ -->
      </Menu>
    </Sidebar>
  </Layout>
</App>
```

## Basic Usage

### 1. Providing Values

```vue
<script setup>
import { provide, ref, reactive } from 'vue'

// Provide a ref
const count = ref(0)
provide('count', count)

// Provide a reactive object
const user = reactive({
  name: 'John',
  email: 'john@example.com'
})
provide('user', user)

// Provide a plain value
provide('apiUrl', 'https://api.example.com')
</script>
```

### 2. Injecting Values

```vue
<script setup>
import { inject } from 'vue'

// Inject without default
const count = inject('count')

// Inject with default value
const apiUrl = inject('apiUrl', 'https://default-api.com')

// Inject and destructure
const user = inject('user')
console.log(user.name, user.email)
</script>
```

### 3. Reactive Injection

Injected refs and reactive objects remain reactive:

```vue
<!-- Provider -->
<script setup>
import { provide, ref } from 'vue'

const count = ref(0)
provide('count', count)

function increment() {
  count.value++ // All consumers update automatically!
}
</script>

<!-- Consumer -->
<script setup>
import { inject } from 'vue'

const count = inject('count')
// count.value updates automatically when provider changes it
</script>

<template>
  <div>Count: {{ count }}</div>
</template>
```

## Advanced Patterns

### 1. Symbol Keys for Type Safety

Use symbols to prevent naming conflicts and improve type safety:

```javascript
// keys.js
export const ThemeKey = Symbol('theme')
export const UserKey = Symbol('user')
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

const theme = inject(ThemeKey) // Type-safe!
</script>
```

### 2. Provide/Inject with Composables

Create reusable composables for common injection patterns:

```javascript
// useTheme.js
import { inject } from 'vue'

export function useTheme() {
  const theme = inject('theme')

  if (!theme) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }

  return theme
}
```

```vue
<!-- Usage -->
<script setup>
import { useTheme } from './composables/useTheme'

const theme = useTheme()
</script>
```

### 3. Readonly Injection

Prevent child components from modifying provided values:

```vue
<script setup>
import { provide, ref, readonly } from 'vue'

const count = ref(0)

// Provide readonly version
provide('count', readonly(count))

// Provide methods to modify
provide('increment', () => count.value++)
</script>
```

### 4. Multi-Level Provision

Descendants can override provided values:

```vue
<!-- Root -->
<script setup>
provide('theme', 'light')
</script>

<!-- Middle Component -->
<script setup>
provide('theme', 'dark') // Overrides for its descendants
</script>

<!-- Leaf Component -->
<script setup>
const theme = inject('theme') // Gets 'dark' from nearest provider
</script>
```

## Real-World Examples

### Example 1: Theme System

```vue
<!-- App.vue -->
<script setup>
import { provide, reactive } from 'vue'

const theme = reactive({
  mode: 'light',
  colors: {
    primary: '#667eea',
    secondary: '#764ba2'
  }
})

provide('theme', theme)

function toggleTheme() {
  theme.mode = theme.mode === 'light' ? 'dark' : 'light'
}
</script>

<!-- Any Descendant Component -->
<script setup>
import { inject, computed } from 'vue'

const theme = inject('theme')

const styles = computed(() => ({
  background: theme.mode === 'dark' ? '#1a1a1a' : '#ffffff',
  color: theme.mode === 'dark' ? '#ffffff' : '#333333'
}))
</script>

<template>
  <div :style="styles">
    Themed content
  </div>
</template>
```

### Example 2: Authentication Context

```vue
<!-- App.vue -->
<script setup>
import { provide, reactive } from 'vue'

const auth = reactive({
  user: null,
  isAuthenticated: false,
  login: async (credentials) => {
    const user = await api.login(credentials)
    auth.user = user
    auth.isAuthenticated = true
  },
  logout: () => {
    auth.user = null
    auth.isAuthenticated = false
  }
})

provide('auth', auth)
</script>

<!-- Anywhere in the app -->
<script setup>
import { inject } from 'vue'

const auth = inject('auth')
</script>

<template>
  <div v-if="auth.isAuthenticated">
    Welcome, {{ auth.user.name }}!
    <button @click="auth.logout">Logout</button>
  </div>
  <div v-else>
    <button @click="auth.login()">Login</button>
  </div>
</template>
```

### Example 3: Feature Flags

```vue
<!-- App.vue -->
<script setup>
import { provide, reactive } from 'vue'

const features = reactive({
  darkMode: true,
  notifications: true,
  analytics: false,
  betaFeatures: false
})

provide('features', features)
</script>

<!-- Any Component -->
<script setup>
import { inject } from 'vue'

const features = inject('features')
</script>

<template>
  <div v-if="features.betaFeatures">
    <BetaFeature />
  </div>
</template>
```

## Common Patterns

### 1. Provider Component Pattern

Create dedicated provider components:

```vue
<!-- ThemeProvider.vue -->
<script setup>
import { provide, reactive } from 'vue'

const theme = reactive({
  mode: 'light',
  toggle: () => {
    theme.mode = theme.mode === 'light' ? 'dark' : 'light'
  }
})

provide('theme', theme)
</script>

<template>
  <slot></slot>
</template>

<!-- Usage -->
<ThemeProvider>
  <App />
</ThemeProvider>
```

### 2. Composable + Provide/Inject

```javascript
// useAuth.js
import { inject } from 'vue'

const AuthKey = Symbol('auth')

export function provideAuth(auth) {
  provide(AuthKey, auth)
}

export function useAuth() {
  const auth = inject(AuthKey)
  if (!auth) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return auth
}
```

## Best Practices

### ✅ Do

1. **Use for cross-cutting concerns**: Theme, i18n, auth, config
2. **Provide reactive values**: Use ref/reactive for reactivity
3. **Use symbols for keys**: Prevents conflicts
4. **Provide default values**: Makes components more robust
5. **Document injection keys**: Create a keys file
6. **Combine with composables**: Encapsulate injection logic

### ❌ Don't

1. **Don't use for all component communication**: Props are clearer
2. **Don't provide non-reactive values expecting reactivity**
3. **Don't use string keys in large apps**: Use symbols
4. **Don't inject without defaults in reusable components**
5. **Don't overuse**: Not everything needs to be injected

## When to Use Provide/Inject

**✅ Good Use Cases:**

- Theme systems
- i18n/localization
- User authentication state
- App configuration
- Feature flags
- Global services (analytics, logging)
- Form context in complex forms

**❌ Not Recommended:**

- Simple parent-child communication (use props)
- State management (use Pinia/Vuex)
- Event handling (use emits)
- Data that changes frequently (consider performance)

## Provide/Inject vs Props

| Feature | Props | Provide/Inject |
|---------|-------|----------------|
| **Explicitness** | Very explicit | Implicit |
| **Type Safety** | Excellent | Good (with symbols/TS) |
| **Debugging** | Easy to trace | Harder to trace |
| **Use Case** | Direct parent-child | Cross-cutting concerns |
| **Performance** | Faster | Slightly slower |
| **Best For** | Component APIs | App-level concerns |

## TypeScript Support

```typescript
// keys.ts
import { InjectionKey, Ref } from 'vue'

export interface Theme {
  mode: 'light' | 'dark'
  colors: {
    primary: string
    secondary: string
  }
}

export const ThemeKey: InjectionKey<Theme> = Symbol('theme')
```

```vue
<script setup lang="ts">
import { provide } from 'vue'
import { ThemeKey, Theme } from './keys'

const theme: Theme = {
  mode: 'light',
  colors: {
    primary: '#667eea',
    secondary: '#764ba2'
  }
}

provide(ThemeKey, theme)
</script>
```

```vue
<script setup lang="ts">
import { inject } from 'vue'
import { ThemeKey } from './keys'

const theme = inject(ThemeKey) // Fully typed!
</script>
```

## Getting Started

```bash
cd 02-composition-api/01-provide-inject
npm install
npm run dev
```

## Project Structure

```
01-provide-inject/
├── src/
│   ├── App.vue                      # Main app with providers
│   ├── components/
│   │   ├── ThemedCard.vue           # Injects theme
│   │   ├── ThemedButton.vue         # Injects theme
│   │   ├── UserProfile.vue          # Injects user
│   │   ├── DeeplyNestedComponent.vue # Shows no prop drilling
│   │   ├── ConfigDisplay.vue        # Injects config
│   │   ├── SymbolExample.vue        # Symbol key example
│   │   ├── CounterDisplay.vue       # Reactive injection
│   │   └── DefaultExample.vue       # Default values
│   └── main.js
├── index.html
├── package.json
├── vite.config.js
├── README.md                        # This file
└── NOTES.md                         # Deep dive documentation
```

## What You'll Learn

1. ✅ Understanding provide/inject fundamentals
2. ✅ Avoiding prop drilling
3. ✅ Creating reactive providers
4. ✅ Using symbols for type safety
5. ✅ Providing default values
6. ✅ Multi-level provision
7. ✅ Real-world patterns (theme, auth, config)
8. ✅ Best practices and anti-patterns

## Exercises

Try these to master provide/inject:

1. **Exercise 1**: Create a `LocaleProvider` that provides language and translations
2. **Exercise 2**: Build a `PermissionsProvider` that checks user permissions
3. **Exercise 3**: Implement a `ModalProvider` that manages modal state globally
4. **Exercise 4**: Create a `ToastProvider` for app-wide notifications
5. **Exercise 5**: Build a `FormProvider` that shares form state with nested fields

## Common Pitfalls

### Pitfall 1: Non-Reactive Values

```vue
<!-- ❌ Bad - not reactive -->
<script setup>
provide('count', 0) // Plain number, not reactive
</script>

<!-- ✅ Good - reactive -->
<script setup>
import { provide, ref } from 'vue'
provide('count', ref(0)) // Reactive ref
</script>
```

### Pitfall 2: No Default Values

```vue
<!-- ❌ Risky - no default -->
<script setup>
const theme = inject('theme') // Might be undefined!
</script>

<!-- ✅ Safe - has default -->
<script setup>
const theme = inject('theme', { mode: 'light' })
</script>
```

### Pitfall 3: String Key Conflicts

```vue
<!-- ❌ Risky - string key can conflict -->
<script setup>
provide('user', userData)
</script>

<!-- ✅ Safe - symbol key -->
<script setup>
const UserKey = Symbol('user')
provide(UserKey, userData)
</script>
```

## Next Steps

After mastering provide/inject, move on to:
- **Lesson 2**: Lifecycle Hooks - Component lifecycle management
- **Lesson 3**: Custom Directives - DOM manipulation patterns

## Additional Resources

- [Vue 3 Provide/Inject Docs](https://vuejs.org/guide/components/provide-inject.html)
- [Dependency Injection API](https://vuejs.org/api/composition-api-dependency-injection.html)

---

**Congratulations!** You now understand how to use provide/inject for clean, maintainable dependency injection in Vue 3. This pattern is essential for building scalable applications!
