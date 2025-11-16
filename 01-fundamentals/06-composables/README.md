# Composables: Reusable Composition Functions

## What We're Building

A **Composables Demonstration Dashboard** that showcases how to create and use reusable composition functions in Vue 3:
- `useCounter` - Bounded counter with min/max
- `useToggle` - Boolean state management
- `useDebounce` - Debounced values
- `useLocalStorage` - Persistent reactive state
- `useForm` - Form state management
- `useValidation` - Validation rules
- `useFetch` - Data fetching with loading/error states

This lesson demonstrates the power of Vue 3's Composition API for creating clean, reusable, and testable logic.

## Key Concepts Learned

1. **What are Composables** - Reusable composition functions
2. **Naming Convention** - `use*` prefix for composables
3. **State Management** - Encapsulating reactive state
4. **Logic Reuse** - Share logic across components
5. **Composition** - Combine multiple composables
6. **Side Effects** - Managing lifecycle and cleanup
7. **TypeScript Support** - Full type inference
8. **Best Practices** - Organizing and structuring composables

## What are Composables?

**Composables** are functions that leverage Vue's Composition API to encapsulate and reuse stateful logic. They're the Vue 3 equivalent of mixins and higher-order components, but more powerful and flexible.

### The Problem They Solve

Before composables:

```vue
<!-- Component A -->
<script setup>
import { ref } from 'vue'

const count = ref(0)

function increment() {
  count.value++
}

function decrement() {
  count.value--
}

function reset() {
  count.value = 0
}
</script>

<!-- Component B - duplicate logic! -->
<script setup>
import { ref } from 'vue'

const count = ref(0)

function increment() {
  count.value++
}

function decrement() {
  count.value--
}

function reset() {
  count.value = 0
}
</script>
```

### With Composables

```javascript
// composables/useCounter.js
import { ref } from 'vue'

export function useCounter(initialValue = 0) {
  const count = ref(initialValue)

  function increment() {
    count.value++
  }

  function decrement() {
    count.value--
  }

  function reset() {
    count.value = initialValue
  }

  return { count, increment, decrement, reset }
}
```

```vue
<!-- Component A -->
<script setup>
import { useCounter } from './composables/useCounter'

const counter = useCounter(0)
</script>

<!-- Component B -->
<script setup>
import { useCounter } from './composables/useCounter'

const counter = useCounter(10)
</script>
```

## Built-in Composables

### 1. useCounter - Bounded Counter

```javascript
import { useCounter } from './composables/useCounter'

const counter = useCounter(5, { min: 0, max: 10, step: 1 })

// Usage
counter.increment()  // count: 6
counter.decrement()  // count: 5
counter.reset()      // count: 5

// Computed properties
counter.canIncrement  // true if count < max
counter.canDecrement  // true if count > min
```

**Features:**
- Min/max bounds
- Custom step size
- Reset to initial value
- Helper computed properties

### 2. useToggle - Boolean State

```javascript
import { useToggle } from './composables/useToggle'

const darkMode = useToggle(false)

// Usage
darkMode.toggle()     // Flip the value
darkMode.setTrue()    // Set to true
darkMode.setFalse()   // Set to false
darkMode.setValue(true)  // Set to specific value

// Access value
console.log(darkMode.value)  // true/false
```

**Use Cases:**
- Dark mode toggle
- Modal open/close
- Feature flags
- Any boolean state

### 3. useDebounce - Debounced Values

```javascript
import { ref } from 'vue'
import { useDebounce } from './composables/useDebounce'

const searchQuery = ref('')
const debouncedSearch = useDebounce(searchQuery, 500)

// searchQuery updates immediately
// debouncedSearch updates 500ms after last change
```

**Use Cases:**
- Search input
- Auto-save
- API calls
- Expensive computations

### 4. useLocalStorage - Persistent State

```javascript
import { useLocalStorage } from './composables/useLocalStorage'

const preferences = useLocalStorage('userPrefs', {
  theme: 'light',
  language: 'en'
})

// Automatically synced to localStorage!
preferences.data.theme = 'dark'

// Clear localStorage
preferences.clear()
```

**Features:**
- Automatic persistence
- Deep reactivity
- JSON serialization
- Clear utility

### 5. useForm - Form Management

```javascript
import { useForm } from './composables/useForm'

const form = useForm({
  name: '',
  email: '',
  age: null
})

// Form utilities
form.setFieldValue('name', 'John')
form.setFieldError('email', 'Invalid email')
form.setFieldTouched('name', true)
form.resetForm()
form.clearErrors()

// Form state
form.formData    // Current values
form.errors      // Error messages
form.touched     // Touched fields
form.hasErrors   // Boolean
form.isValid     // Boolean
form.values      // Readonly values
```

### 6. useValidation - Validation Rules

```javascript
import { useValidation } from './composables/useValidation'

const validation = useValidation()

// Built-in validators
validation.required(value, 'Name')
validation.minLength(value, 3, 'Name')
validation.maxLength(value, 100, 'Name')
validation.email(value)
validation.numberRange(value, 1, 100, 'Age')
validation.url(value)
validation.pattern(value, /^[A-Z]/, 'Name', 'Must start with capital')
validation.matches(password, confirmPassword, 'Password', 'Confirm Password')

// Compose validators
const error = validation.validate(value, [
  (v) => validation.required(v, 'Name'),
  (v) => validation.minLength(v, 3, 'Name')
])
```

### 7. useFetch - Data Fetching

```javascript
import { useFetch } from './composables/useFetch'

const userFetch = useFetch('https://api.example.com/users')

async function loadUsers() {
  await userFetch.execute()

  // Access data
  console.log(userFetch.data.value)
  console.log(userFetch.error.value)
  console.log(userFetch.isLoading.value)
}
```

**Features:**
- Loading state
- Error handling
- Configurable options
- POST helper

## Complete Example: Form with Validation

```vue
<template>
  <form @submit.prevent="handleSubmit">
    <div>
      <input
        v-model="form.formData.email"
        @blur="validateEmail"
        :class="{ error: form.errors.email }"
      />
      <span v-if="form.errors.email">{{ form.errors.email }}</span>
    </div>

    <button type="submit" :disabled="form.hasErrors">
      Submit
    </button>
  </form>
</template>

<script setup>
import { useForm } from './composables/useForm'
import { useValidation } from './composables/useValidation'

const form = useForm({
  email: '',
  password: ''
})

const validation = useValidation()

function validateEmail() {
  const error = validation.validate(form.formData.email, [
    (v) => validation.required(v, 'Email'),
    (v) => validation.email(v)
  ])
  form.setFieldError('email', error)
}

function handleSubmit() {
  validateEmail()

  if (form.hasErrors) return

  console.log('Submitting:', form.values)
}
</script>
```

## Creating Your Own Composables

### Basic Structure

```javascript
// composables/useExample.js
import { ref, computed } from 'vue'

export function useExample(initialValue) {
  // 1. Reactive state
  const state = ref(initialValue)

  // 2. Computed properties
  const doubled = computed(() => state.value * 2)

  // 3. Methods
  function update(newValue) {
    state.value = newValue
  }

  // 4. Return public API
  return {
    state,
    doubled,
    update
  }
}
```

### Best Practices

1. **Use the `use*` naming convention**

```javascript
// ✅ Good
export function useCounter() { }
export function useFetch() { }
export function useAuth() { }

// ❌ Bad
export function counter() { }
export function fetchData() { }
```

2. **Return an object, not individual refs**

```javascript
// ✅ Good
export function useCounter() {
  const count = ref(0)
  const increment = () => count.value++

  return { count, increment }
}

// ❌ Bad - hard to destructure
export function useCounter() {
  const count = ref(0)
  const increment = () => count.value++

  return [count, increment]
}
```

3. **Accept configuration options**

```javascript
// ✅ Good - flexible
export function useFetch(url, options = {}) {
  const { method = 'GET', headers = {} } = options
  // ...
}

// ❌ Less flexible
export function useFetch(url) {
  // ...
}
```

4. **Clean up side effects**

```javascript
export function useEventListener(target, event, handler) {
  onMounted(() => {
    target.addEventListener(event, handler)
  })

  onUnmounted(() => {
    target.removeEventListener(event, handler)
  })
}
```

5. **Make composables composable**

```javascript
// Combine multiple composables
export function useAuthenticatedFetch(url) {
  const { user } = useAuth()
  const { execute, data, error, isLoading } = useFetch(url)

  async function fetch() {
    if (!user.value) {
      error.value = 'Not authenticated'
      return
    }

    await execute({
      headers: {
        'Authorization': `Bearer ${user.value.token}`
      }
    })
  }

  return { fetch, data, error, isLoading }
}
```

## Common Composables Patterns

### 1. Mouse Position Tracker

```javascript
import { ref, onMounted, onUnmounted } from 'vue'

export function useMouse() {
  const x = ref(0)
  const y = ref(0)

  function update(event) {
    x.value = event.pageX
    y.value = event.pageY
  }

  onMounted(() => {
    window.addEventListener('mousemove', update)
  })

  onUnmounted(() => {
    window.removeEventListener('mousemove', update)
  })

  return { x, y }
}
```

### 2. Window Resize Observer

```javascript
import { ref, onMounted, onUnmounted } from 'vue'

export function useWindowSize() {
  const width = ref(window.innerWidth)
  const height = ref(window.innerHeight)

  function update() {
    width.value = window.innerWidth
    height.value = window.innerHeight
  }

  onMounted(() => {
    window.addEventListener('resize', update)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', update)
  })

  return { width, height }
}
```

### 3. Async State Manager

```javascript
import { ref } from 'vue'

export function useAsync(fn) {
  const data = ref(null)
  const error = ref(null)
  const isLoading = ref(false)

  async function execute(...args) {
    isLoading.value = true
    error.value = null

    try {
      data.value = await fn(...args)
    } catch (err) {
      error.value = err
    } finally {
      isLoading.value = false
    }
  }

  return { data, error, isLoading, execute }
}
```

### 4. Interval/Timer

```javascript
import { ref, onUnmounted } from 'vue'

export function useInterval(callback, delay) {
  const isActive = ref(false)
  let intervalId = null

  function start() {
    if (isActive.value) return

    isActive.value = true
    intervalId = setInterval(callback, delay)
  }

  function stop() {
    isActive.value = false
    clearInterval(intervalId)
  }

  onUnmounted(() => {
    stop()
  })

  return { isActive, start, stop }
}
```

## Getting Started

```bash
cd 01-fundamentals/06-composables

# Install dependencies
npm install

# Run development server
npm run dev
```

Opens `http://localhost:5173` with hot reload.

## Project Structure

```
06-composables/
├── index.html
├── vite.config.js
├── package.json
├── src/
│   ├── main.js
│   ├── App.vue              # Demo application
│   └── composables/
│       ├── useCounter.js    # Counter with bounds
│       ├── useToggle.js     # Boolean toggle
│       ├── useDebounce.js   # Debounced values
│       ├── useLocalStorage.js  # Persistent state
│       ├── useForm.js       # Form management
│       ├── useValidation.js # Validation rules
│       └── useFetch.js      # Data fetching
├── README.md                # This file
└── NOTES.md                 # Deep-dive documentation
```

## What You'll Learn

1. ✅ **What composables are** and why they're powerful
2. ✅ **How to create** reusable composables
3. ✅ **Best practices** and naming conventions
4. ✅ **Combining composables** for complex functionality
5. ✅ **Managing side effects** and cleanup
6. ✅ **State management** patterns
7. ✅ **Real-world examples** (forms, validation, fetching)

## Composables vs Mixins

| Feature | Composables | Mixins |
|---------|------------|--------|
| **Conflict resolution** | Explicit (renamed on import) | Implicit (can conflict) |
| **Source clarity** | Clear where values come from | Unclear origin |
| **Type inference** | Full TypeScript support | Limited support |
| **Composition** | Easy to combine | Hard to compose |
| **Flexibility** | Accept parameters | Fixed configuration |
| **Code reuse** | Excellent | Good |

## Benefits of Composables

1. **♻️ Reusability** - Write once, use everywhere
2. **🧹 Clean Code** - Separate concerns effectively
3. **🧪 Testability** - Test logic without components
4. **📦 Organization** - Group related logic
5. **🔄 Composition** - Combine multiple composables
6. **⚡ Performance** - Tree-shakeable, efficient
7. **🎯 Type Safety** - Full TypeScript support

## Exercises

Try these challenges to master composables:

1. **Exercise 1**: Create `useClipboard()` that copies text to clipboard
2. **Exercise 2**: Create `useIntersectionObserver()` for lazy loading
3. **Exercise 3**: Create `useWebSocket()` for real-time connections
4. **Exercise 4**: Create `useGeolocation()` for location tracking
5. **Exercise 5**: Create `useMediaQuery()` for responsive design
6. **Exercise 6**: Combine `useForm` + `useFetch` for a complete CRUD form

## Next Steps

After mastering composables, you're ready for:
- **Project 1**: Content Server Node Browser (using composables)
- **Advanced Patterns**: Custom directives and plugins
- **State Management**: Pinia with composables
- **Testing**: Unit testing composables

## Relationship to Application Analyzer

The **Application Analyzer** uses composables extensively:
- `useFileSystem` - File and directory operations
- `useAnalyzer` - Code analysis logic
- `useDependencyGraph` - Dependency tracking
- `useSearch` - Search and filtering
- `useSettings` - User preferences management

All these composables make the codebase modular, testable, and maintainable!

## Additional Resources

- [Vue 3 Composables Guide](https://vuejs.org/guide/reusability/composables.html)
- [VueUse](https://vueuse.org/) - Collection of essential composables
- [Composition API FAQ](https://vuejs.org/guide/extras/composition-api-faq.html)

---

**Congratulations!** 🎉 You've mastered Vue 3 composables! You can now create clean, reusable, and testable logic that works across your entire application. This is one of the most powerful features of Vue 3!
