# Lesson 3: Composables with TypeScript

## 🎯 Learning Objectives

- Type composable parameters and return values
- Create generic composables
- Use TypeScript with lifecycle hooks
- Handle async operations with types

## 🔑 Key Examples

### Basic Typed Composable

```typescript
// composables/useNode.ts
import { ref, Ref } from 'vue'

export function useNode(initialId?: number) {
  const node = ref<ContentServerNode | null>(null)
  const loading = ref<boolean>(false)
  const error = ref<string | null>(null)

  async function fetchNode(id: number): Promise<void> {
    loading.value = true
    error.value = null

    try {
      const response = await api.getNode(id)
      node.value = response.data
    } catch (err) {
      error.value = (err as Error).message
    } finally {
      loading.value = false
    }
  }

  if (initialId) {
    fetchNode(initialId)
  }

  return {
    node: readonly(node),
    loading: readonly(loading),
    error: readonly(error),
    fetchNode
  }
}
```

### Generic Composable

```typescript
// composables/useFetch.ts
export function useFetch<T>(url: string) {
  const data = ref<T | null>(null)
  const loading = ref(false)
  const error = ref<Error | null>(null)

  async function fetch(): Promise<void> {
    loading.value = true
    try {
      const response = await fetch(url)
      data.value = await response.json() as T
    } catch (e) {
      error.value = e as Error
    } finally {
      loading.value = false
    }
  }

  return {
    data: readonly(data),
    loading: readonly(loading),
    error: readonly(error),
    fetch
  }
}

// Usage
const { data } = useFetch<ContentServerNode>('/api/node/123')
```

**Time:** 2-3 hours | **Difficulty:** Intermediate
