# Technical Notes: Advanced Composable Patterns

## Pattern Categories

### 1. State Management
- **Stateless**: New state per call
- **Stateful**: Shared state (singleton)

### 2. Async Handling
- Loading states
- Error handling
- Refresh capability

### 3. Reactive Parameters
- Accept refs or values
- Use `unref()` for flexibility

### 4. Resource Cleanup
- Always use `onUnmounted()`
- Clear timers, listeners, observers

## Key Principles

### Composable Naming
```javascript
use + PascalCase
useCounter, useAuth, useAsyncData
```

### Return Object Pattern
```javascript
return {
  // State
  data,
  loading,
  error,

  // Actions
  refresh,
  reset
}
```

### Reactive Arguments
```javascript
import { unref, watch } from 'vue'

export function useComposable(value) {
  watch(() => unref(value), (newValue) => {
    // Works with refs and raw values
  })
}
```

## Advanced Techniques

### 1. Composable Factories
```javascript
export function createFetch(config) {
  return function useFetch(endpoint) {
    // Configured fetch logic
  }
}
```

### 2. Composable Composition
```javascript
export function useAuth() {
  const storage = useLocalStorage('user')
  const http = useHttp()

  // Combine multiple composables
  return { /* ... */ }
}
```

### 3. Type Safety
```typescript
export function useCounter(initial: number = 0) {
  // TypeScript composable
}
```

## Testing Composables

```javascript
import { mount } from '@vue/test-utils'
import { useCounter } from './useCounter'

describe('useCounter', () => {
  it('increments', () => {
    const { count, increment } = useCounter(0)
    increment()
    expect(count.value).toBe(1)
  })
})
```

## Summary

Composables enable:
- Code reuse
- Separation of concerns
- Testable logic
- Type safety

Master these patterns for scalable Vue 3 apps.
