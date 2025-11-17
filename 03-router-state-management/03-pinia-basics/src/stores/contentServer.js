import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { mockApi } from '@/data/mockNodes'

export const useContentServerStore = defineStore('contentServer', () => {
  // State
  const nodes = ref([])
  const currentNode = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // Getters
  const nodeCount = computed(() => nodes.value.length)

  const folderNodes = computed(() =>
    nodes.value.filter(node => node.type === 'folder')
  )

  const documentNodes = computed(() =>
    nodes.value.filter(node => node.type === 'document')
  )

  const folderCount = computed(() => folderNodes.value.length)
  const documentCount = computed(() => documentNodes.value.length)

  // Get children of a specific node
  const getChildNodes = computed(() => {
    return (parentId) => {
      return nodes.value.filter(node => node.parent_id === parentId)
    }
  })

  // Get breadcrumb path for a node
  const getBreadcrumbPath = computed(() => {
    return (nodeId) => {
      const path = []
      let currentId = nodeId

      while (currentId) {
        const node = nodes.value.find(n => n.id === currentId)
        if (node) {
          path.unshift(node)
          currentId = node.parent_id
        } else {
          break
        }
      }

      return path
    }
  })

  // Actions
  async function fetchNodes() {
    loading.value = true
    error.value = null

    try {
      const response = await mockApi.getNodes()
      nodes.value = response.data
    } catch (err) {
      error.value = err.message
      console.error('Failed to fetch nodes:', err)
    } finally {
      loading.value = false
    }
  }

  async function fetchNode(id) {
    loading.value = true
    error.value = null

    try {
      const response = await mockApi.getNode(id)
      currentNode.value = response.data

      // Update cache if node exists, otherwise add it
      const index = nodes.value.findIndex(n => n.id === id)
      if (index >= 0) {
        nodes.value[index] = response.data
      } else {
        nodes.value.push(response.data)
      }

      return response.data
    } catch (err) {
      error.value = err.message
      console.error('Failed to fetch node:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  function setCurrentNode(node) {
    currentNode.value = node
  }

  function clearCache() {
    nodes.value = []
    currentNode.value = null
    error.value = null
  }

  function clearError() {
    error.value = null
  }

  // Return everything to expose
  return {
    // State
    nodes,
    currentNode,
    loading,
    error,
    // Getters
    nodeCount,
    folderNodes,
    documentNodes,
    folderCount,
    documentCount,
    getChildNodes,
    getBreadcrumbPath,
    // Actions
    fetchNodes,
    fetchNode,
    setCurrentNode,
    clearCache,
    clearError
  }
})
