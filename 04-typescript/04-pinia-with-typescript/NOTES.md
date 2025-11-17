# Lesson 4: Pinia with TypeScript

## Overview

Pinia is Vue's official state management library with excellent TypeScript support. Learn to create fully typed stores with type-safe state, getters, and actions.

## Setup Store Syntax (Recommended)

```typescript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Node } from './types'

export const useNodesStore = defineStore('nodes', () => {
  // State - typed refs
  const nodes = ref<Node[]>([])
  const loading = ref<boolean>(false)

  // Getters - typed computed
  const nodeCount = computed<number>(() => nodes.value.length)

  // Actions - typed functions
  async function fetchNodes(): Promise<void> {
    loading.value = true
    // Fetch logic
  }

  return {
    nodes,
    loading,
    nodeCount,
    fetchNodes
  }
})
```

## Options Store Syntax

```typescript
export const useNodesStore = defineStore('nodes', {
  state: () => ({
    nodes: [] as Node[],
    loading: false
  }),

  getters: {
    nodeCount(): number {
      return this.nodes.length
    }
  },

  actions: {
    async fetchNodes(): Promise<void> {
      this.loading = true
      // Fetch logic
    }
  }
})
```

## Using Stores in Components

```typescript
<script setup lang="ts">
import { useNodesStore } from './stores/nodes'

const nodesStore = useNodesStore()

// Access state
console.log(nodesStore.nodes)

// Access getters
console.log(nodesStore.nodeCount)

// Call actions
await nodesStore.fetchNodes()
</script>
```

## Best Practices

1. **Use setup syntax** for better TypeScript inference
2. **Type all state** with explicit types
3. **Type action parameters** and return values
4. **Use generics** for reusable store patterns
5. **Export store types** for testing

## Resources

- [Pinia Documentation](https://pinia.vuejs.org/)
- [Pinia TypeScript Guide](https://pinia.vuejs.org/core-concepts/#typescript)
