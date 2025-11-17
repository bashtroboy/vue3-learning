import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Node, AnyNode, CreateNodeInput, UpdateNodeInput, NodeId } from '../types'

export const useNodesStore = defineStore('nodes', () => {
  // State
  const nodes = ref<Node[]>([])
  const loading = ref<boolean>(false)
  const error = ref<string | null>(null)
  const selectedId = ref<NodeId | null>(null)

  // Getters
  const allNodes = computed<Node[]>(() => nodes.value)
  const folders = computed<Node[]>(() => nodes.value.filter(n => n.type === 'folder'))
  const documents = computed<Node[]>(() => nodes.value.filter(n => n.type === 'document'))
  const selectedNode = computed<Node | null>(() =>
    selectedId.value ? nodes.value.find(n => n.id === selectedId.value) || null : null
  )

  // Actions
  async function fetchNodes(): Promise<void> {
    loading.value = true
    error.value = null

    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      nodes.value = [
        {
          id: 1,
          name: 'Root',
          type: 'folder',
          parentId: null,
          createdAt: new Date().toISOString(),
          modifiedAt: new Date().toISOString()
        },
        {
          id: 2,
          name: 'Document.txt',
          type: 'document',
          parentId: 1,
          createdAt: new Date().toISOString(),
          modifiedAt: new Date().toISOString()
        }
      ]
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Unknown error'
    } finally {
      loading.value = false
    }
  }

  function addNode(input: CreateNodeInput): Node {
    const newNode: Node = {
      ...input,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      modifiedAt: new Date().toISOString()
    }
    nodes.value.push(newNode)
    return newNode
  }

  function updateNode(id: NodeId, updates: UpdateNodeInput): boolean {
    const index = nodes.value.findIndex(n => n.id === id)
    if (index === -1) return false

    nodes.value[index] = {
      ...nodes.value[index],
      ...updates,
      modifiedAt: new Date().toISOString()
    }
    return true
  }

  function deleteNode(id: NodeId): boolean {
    const index = nodes.value.findIndex(n => n.id === id)
    if (index === -1) return false

    nodes.value.splice(index, 1)
    return true
  }

  function selectNode(id: NodeId | null): void {
    selectedId.value = id
  }

  return {
    // State
    nodes: allNodes,
    loading,
    error,
    selectedId,
    // Getters
    folders,
    documents,
    selectedNode,
    // Actions
    fetchNodes,
    addNode,
    updateNode,
    deleteNode,
    selectNode
  }
})
