# Lesson 3: Composables with TypeScript

## Overview

Composables are reusable functions that encapsulate stateful logic using Vue's Composition API. With TypeScript, composables become even more powerful through type safety.

## Basic Composable Structure

```typescript
import { ref, type Ref } from 'vue'

export interface UseCounterReturn {
  count: Ref<number>
  increment: () => void
}

export function useCounter(initial: number = 0): UseCounterReturn {
  const count = ref<number>(initial)

  const increment = (): void => {
    count.value++
  }

  return { count, increment }
}
```

## Generic Composables

```typescript
export function useLocalStorage<T>(key: string, defaultValue: T): Ref<T> {
  const value = ref<T>(defaultValue)

  watch(value, (newValue) => {
    localStorage.setItem(key, JSON.stringify(newValue))
  })

  return value as Ref<T>
}
```

## Best Practices

1. **Define return type interfaces** for clarity
2. **Use generics** for reusable composables
3. **Type all parameters** and return values
4. **Export type definitions** for consumers
5. **Document with JSDoc** for better IDE support

## Resources

- [Vue Composables Guide](https://vuejs.org/guide/reusability/composables.html)
- [TypeScript with Composition API](https://vuejs.org/guide/typescript/composition-api.html)
