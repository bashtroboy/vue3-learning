import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { mockApi } from '@/data/mockNodes'
import { useAuthStore } from './auth'
import { useCacheStore } from './cache'

/**
 * Content Server Store
 *
 * Manages node data with authentication, caching, and request deduplication
 */
export const useContentServerStore = defineStore('contentServer', () => {
  // Get other stores
  const authStore = useAuthStore()
  const cacheStore = useCacheStore()

  // State
  const nodes = ref([])
  const currentNode = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // Track pending requests for deduplication
  const pendingRequests = ref(new Map())

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

  const getChildNodes = computed(() => {
    return (parentId) => {
      return nodes.value.filter(node => node.parent_id === parentId)
    }
  })

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
  async function fetchNodes(options = {}) {
    const cacheKey = 'all-nodes'
    const forceReload = options.forceReload || false

    // Check cache first (unless force reload)
    if (!forceReload) {
      const cached = cacheStore.get(cacheKey)
      if (cached) {
        console.log('📦 Using cached nodes')
        nodes.value = cached
        return cached
      }
    }

    loading.value = true
    error.value = null

    try {
      const response = await mockApi.getNodes({
        headers: authStore.authHeaders
      })
      nodes.value = response.data

      // Cache for 5 minutes
      cacheStore.set(cacheKey, response.data, 5 * 60 * 1000)

      console.log('✅ Fetched nodes:', nodes.value.length)
      return response.data
    } catch (err) {
      error.value = err.message
      console.error('❌ Failed to fetch nodes:', err.message)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchNode(id, options = {}) {
    const cacheKey = `node-${id}`
    const forceReload = options.forceReload || false

    // Check cache first (unless force reload)
    if (!forceReload) {
      const cached = cacheStore.get(cacheKey)
      if (cached) {
        console.log(`📦 Using cached node ${id}`)
        currentNode.value = cached
        return cached
      }
    }

    // Request deduplication - return existing promise if pending
    if (pendingRequests.value.has(cacheKey)) {
      console.log(`⏳ Returning pending request for node ${id}`)
      return pendingRequests.value.get(cacheKey)
    }

    loading.value = true
    error.value = null

    // Create the request promise
    const requestPromise = mockApi.getNode(id, {
      headers: authStore.authHeaders
    })
      .then(response => {
        currentNode.value = response.data

        // Update cache
        const index = nodes.value.findIndex(n => n.id === id)
        if (index >= 0) {
          nodes.value[index] = response.data
        } else {
          nodes.value.push(response.data)
        }

        // Cache for 5 minutes
        cacheStore.set(cacheKey, response.data, 5 * 60 * 1000)

        // Remove from pending requests
        pendingRequests.value.delete(cacheKey)

        console.log(`✅ Fetched node ${id}:`, response.data.name)
        return response.data
      })
      .catch(err => {
        error.value = err.message
        pendingRequests.value.delete(cacheKey)
        console.error(`❌ Failed to fetch node ${id}:`, err.message)
        throw err
      })
      .finally(() => {
        loading.value = false
      })

    // Store the pending request
    pendingRequests.value.set(cacheKey, requestPromise)

    return requestPromise
  }

  function setCurrentNode(node) {
    currentNode.value = node
  }

  function clearCache() {
    nodes.value = []
    currentNode.value = null
    error.value = null
    cacheStore.clear()
    pendingRequests.value.clear()
    console.log('🗑️ Cache cleared')
  }

  function clearError() {
    error.value = null
  }

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
