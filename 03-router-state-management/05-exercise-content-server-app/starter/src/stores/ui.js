import { defineStore } from 'pinia'
import { ref } from 'vue'

/**
 * UI Store
 *
 * Manages global UI state like loading indicators and notifications
 */
export const useUIStore = defineStore('ui', () => {
  // State
  const globalLoading = ref(false)
  const notifications = ref([])

  let notificationId = 0

  // Actions
  function setLoading(isLoading) {
    globalLoading.value = isLoading
  }

  function showNotification(message, type = 'info', duration = 3000) {
    const id = ++notificationId

    const notification = {
      id,
      message,
      type, // 'success', 'error', 'warning', 'info'
      timestamp: Date.now()
    }

    notifications.value.push(notification)

    // Auto-remove after duration
    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id)
      }, duration)
    }

    return id
  }

  function removeNotification(id) {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index >= 0) {
      notifications.value.splice(index, 1)
    }
  }

  function clearNotifications() {
    notifications.value = []
  }

  return {
    // State
    globalLoading,
    notifications,
    // Actions
    setLoading,
    showNotification,
    removeNotification,
    clearNotifications
  }
})
