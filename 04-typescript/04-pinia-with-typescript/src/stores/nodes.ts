import { defineStore } from 'pinia'
import { ref, computed, type Ref, type ComputedRef } from 'vue'
import type { Node } from '../types'

/**
 * Fully typed Pinia store using setup syntax
 */
export const useNodesStore = defineStore('nodes', () => {
  // State
  const nodes = ref<Node[]>([])
  const loading = ref<boolean>(false)
  const error = ref<string | null>(null)
  const selectedId = ref<number | null>(null)

  // Getters
  const nodeCount = computed<number>(() => nodes.value.length)

  const selectedNode = computed<Node | null>(() => {
    if (!selectedId.value) return null
    return nodes.value.find(n => n.id === selectedId.value) || null
  })

  const folders = computed<Node[]>(() => {
    return nodes.value.filter(n => n.type === 'folder')
  })

  const documents = computed<Node[]>(() => {
    return nodes.value.filter(n => n.type === 'document')
  })

  // Actions
  async function fetchNodes(): Promise<void> {
    loading.value = true
    error.value = null

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))

      nodes.value = [
        {
          id: 1,
          name: 'Documents',
          type: 'folder',
          parentId: null,
          createdAt: '2025-01-10T09:00:00Z',
          modifiedAt: '2025-01-10T09:00:00Z'
        },
        {
          id: 2,
          name: 'Report.pdf',
          type: 'document',
          parentId: 1,
          createdAt: '2025-01-15T10:00:00Z',
          modifiedAt: '2025-01-15T14:30:00Z'
        }
      ]
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Unknown error'
    } finally {
      loading.value = false
    }
  }

  function addNode(node: Omit<Node, 'id' | 'createdAt' | 'modifiedAt'>): void {
    const newNode: Node = {
      ...node,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      modifiedAt: new Date().toISOString()
    }
    nodes.value.push(newNode)
  }

  function updateNode(id: number, updates: Partial<Node>): void {
    const index = nodes.value.findIndex(n => n.id === id)
    if (index !== -1) {
      nodes.value[index] = {
        ...nodes.value[index],
        ...updates,
        modifiedAt: new Date().toISOString()
      }
    }
  }

  function deleteNode(id: number): void {
    const index = nodes.value.findIndex(n => n.id === id)
    if (index !== -1) {
      nodes.value.splice(index, 1)
    }
  }

  function selectNode(id: number | null): void {
    selectedId.value = id
  }

  return {
    // State
    nodes,
    loading,
    error,
    selectedId,
    // Getters
    nodeCount,
    selectedNode,
    folders,
    documents,
    // Actions
    fetchNodes,
    addNode,
    updateNode,
    deleteNode,
    selectNode
  }
})
