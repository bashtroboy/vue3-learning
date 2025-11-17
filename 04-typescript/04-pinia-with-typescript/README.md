# Lesson 4: Pinia with TypeScript

## 🎯 Learning Objectives

- Type Pinia stores completely
- Use typed getters and actions
- Compose stores with types
- Test stores with TypeScript

## 🔑 Key Examples

### Fully Typed Store

```typescript
// stores/nodes.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

interface NodesState {
  nodes: ContentServerNode[]
  currentNode: ContentServerNode | null
  loading: boolean
  error: string | null
}

export const useNodesStore = defineStore('nodes', () => {
  // State
  const nodes = ref<ContentServerNode[]>([])
  const currentNode = ref<ContentServerNode | null>(null)
  const loading = ref<boolean>(false)
  const error = ref<string | null>(null)

  // Getters
  const nodeCount = computed<number>(() => nodes.value.length)

  const folderNodes = computed<FolderNode[]>(() =>
    nodes.value.filter((n): n is FolderNode => n.type === 'folder')
  )

  // Actions
  async function fetchNodes(): Promise<ContentServerNode[]> {
    loading.value = true
    try {
      const response = await api.getNodes()
      nodes.value = response.data
      return response.data
    } catch (err) {
      error.value = (err as Error).message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchNode(id: number): Promise<ContentServerNode> {
    const response = await api.getNode(id)
    currentNode.value = response.data
    return response.data
  }

  return {
    nodes,
    currentNode,
    loading,
    error,
    nodeCount,
    folderNodes,
    fetchNodes,
    fetchNode
  }
})

// Type-safe store access
type NodesStore = ReturnType<typeof useNodesStore>
```

**Time:** 2-3 hours | **Difficulty:** Intermediate
