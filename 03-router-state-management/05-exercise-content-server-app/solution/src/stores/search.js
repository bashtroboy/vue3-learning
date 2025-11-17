import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useContentServerStore } from './contentServer'

/**
 * Search Store
 *
 * Manages search functionality and search history
 */
export const useSearchStore = defineStore('search', () => {
  const contentStore = useContentServerStore()

  // State
  const query = ref('')
  const typeFilter = ref('all')  // 'all', 'folder', 'document'
  const ownerFilter = ref('')
  const searchHistory = ref([])

  const maxHistoryItems = 10

  // Getters
  const searchResults = computed(() => {
    if (!query.value && !ownerFilter.value) {
      return contentStore.nodes
    }

    let results = contentStore.nodes

    // Filter by search query
    if (query.value) {
      const lowerQuery = query.value.toLowerCase()
      results = results.filter(node =>
        node.name.toLowerCase().includes(lowerQuery) ||
        node.description.toLowerCase().includes(lowerQuery)
      )
    }

    // Filter by type
    if (typeFilter.value !== 'all') {
      results = results.filter(node => node.type === typeFilter.value)
    }

    // Filter by owner
    if (ownerFilter.value) {
      const lowerOwner = ownerFilter.value.toLowerCase()
      results = results.filter(node =>
        node.owner.toLowerCase().includes(lowerOwner)
      )
    }

    return results
  })

  const resultCount = computed(() => searchResults.value.length)

  // Actions
  function setQuery(newQuery) {
    query.value = newQuery
  }

  function setTypeFilter(type) {
    typeFilter.value = type
  }

  function setOwnerFilter(owner) {
    ownerFilter.value = owner
  }

  function addToHistory(searchQuery) {
    if (!searchQuery || searchQuery.trim() === '') return

    // Remove if already exists
    searchHistory.value = searchHistory.value.filter(q => q !== searchQuery)

    // Add to beginning
    searchHistory.value.unshift(searchQuery)

    // Limit history size
    if (searchHistory.value.length > maxHistoryItems) {
      searchHistory.value = searchHistory.value.slice(0, maxHistoryItems)
    }
  }

  function clearHistory() {
    searchHistory.value = []
  }

  function clearFilters() {
    query.value = ''
    typeFilter.value = 'all'
    ownerFilter.value = ''
  }

  return {
    // State
    query,
    typeFilter,
    ownerFilter,
    searchHistory,
    // Getters
    searchResults,
    resultCount,
    // Actions
    setQuery,
    setTypeFilter,
    setOwnerFilter,
    addToHistory,
    clearHistory,
    clearFilters
  }
}, {
  persist: ['searchHistory']
})
