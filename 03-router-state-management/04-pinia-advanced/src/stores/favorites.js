import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { mockApi } from '@/data/mockNodes'
import { useAuthStore } from './auth'
import { useUIStore } from './ui'

/**
 * Favorites Store
 *
 * Manages user's favorite nodes with optimistic updates and rollback
 */
export const useFavoritesStore = defineStore('favorites', () => {
  const authStore = useAuthStore()
  const uiStore = useUIStore()

  // State
  const favoriteIds = ref([])
  const loading = ref(false)

  // Getters
  const favoriteCount = computed(() => favoriteIds.value.length)

  const isFavorite = computed(() => {
    return (nodeId) => favoriteIds.value.includes(nodeId)
  })

  // Actions
  async function addFavorite(nodeId) {
    // Store original state for rollback
    const originalIds = [...favoriteIds.value]

    // Optimistic update - add immediately
    favoriteIds.value.push(nodeId)
    console.log(`⭐ Optimistically added favorite ${nodeId}`)

    try {
      // Make API call
      await mockApi.addFavorite(nodeId, {
        headers: authStore.authHeaders
      })

      // Success! Keep the optimistic update
      console.log(`✅ Successfully added favorite ${nodeId}`)
      uiStore.showNotification('Added to favorites', 'success')
    } catch (error) {
      // Rollback on error
      favoriteIds.value = originalIds
      console.error(`❌ Failed to add favorite ${nodeId}, rolling back`)

      uiStore.showNotification(
        `Failed to add favorite: ${error.message}`,
        'error'
      )
      throw error
    }
  }

  async function removeFavorite(nodeId) {
    // Store original state for rollback
    const originalIds = [...favoriteIds.value]

    // Optimistic update - remove immediately
    favoriteIds.value = favoriteIds.value.filter(id => id !== nodeId)
    console.log(`⭐ Optimistically removed favorite ${nodeId}`)

    try {
      // Make API call
      await mockApi.removeFavorite(nodeId, {
        headers: authStore.authHeaders
      })

      // Success! Keep the optimistic update
      console.log(`✅ Successfully removed favorite ${nodeId}`)
      uiStore.showNotification('Removed from favorites', 'success')
    } catch (error) {
      // Rollback on error
      favoriteIds.value = originalIds
      console.error(`❌ Failed to remove favorite ${nodeId}, rolling back`)

      uiStore.showNotification(
        `Failed to remove favorite: ${error.message}`,
        'error'
      )
      throw error
    }
  }

  async function toggleFavorite(nodeId) {
    if (isFavorite.value(nodeId)) {
      await removeFavorite(nodeId)
    } else {
      await addFavorite(nodeId)
    }
  }

  function clearFavorites() {
    favoriteIds.value = []
    console.log('🗑️ Cleared all favorites')
  }

  return {
    // State
    favoriteIds,
    loading,
    // Getters
    favoriteCount,
    isFavorite,
    // Actions
    addFavorite,
    removeFavorite,
    toggleFavorite,
    clearFavorites
  }
}, {
  // Persist favorites across page reloads
  persist: true
})
