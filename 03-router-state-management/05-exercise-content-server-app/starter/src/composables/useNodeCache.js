import { useContentServerStore } from '@/stores/contentServer'
import { useCacheStore } from '@/stores/cache'
import { useUIStore } from '@/stores/ui'

/**
 * Node Cache Composable
 *
 * Combines multiple stores to provide a high-level API for node loading
 * with caching, loading states, and notifications
 */
export function useNodeCache() {
  const contentStore = useContentServerStore()
  const cacheStore = useCacheStore()
  const uiStore = useUIStore()

  /**
   * Load a node with caching and UI feedback
   * @param {number} id - Node ID
   * @param {object} options - Options { forceReload: boolean }
   */
  async function loadNode(id, options = {}) {
    const cacheKey = `node-${id}`

    // Check cache first unless force reload
    if (!options.forceReload) {
      const cached = cacheStore.get(cacheKey)
      if (cached) {
        contentStore.setCurrentNode(cached)
        return cached
      }
    }

    // Show loading state
    uiStore.setLoading(true)

    try {
      const node = await contentStore.fetchNode(id, options)
      uiStore.showNotification('Node loaded successfully', 'success')
      return node
    } catch (error) {
      uiStore.showNotification(
        `Failed to load node: ${error.message}`,
        'error'
      )
      throw error
    } finally {
      uiStore.setLoading(false)
    }
  }

  /**
   * Load all nodes with caching and UI feedback
   * @param {object} options - Options { forceReload: boolean }
   */
  async function loadNodes(options = {}) {
    uiStore.setLoading(true)

    try {
      const nodes = await contentStore.fetchNodes(options)
      uiStore.showNotification(
        `Loaded ${nodes.length} nodes`,
        'success'
      )
      return nodes
    } catch (error) {
      uiStore.showNotification(
        `Failed to load nodes: ${error.message}`,
        'error'
      )
      throw error
    } finally {
      uiStore.setLoading(false)
    }
  }

  /**
   * Clear all caches
   */
  function clearCache() {
    contentStore.clearCache()
    cacheStore.clear()
    uiStore.showNotification('Cache cleared', 'info')
  }

  /**
   * Get cache statistics
   */
  function getCacheStats() {
    return cacheStore.getStats()
  }

  return {
    loadNode,
    loadNodes,
    clearCache,
    getCacheStats
  }
}
