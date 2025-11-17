import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { mockApi } from '@/data/mockNodes'

/**
 * Authentication Store
 *
 * Manages user authentication state
 */
export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null)
  const token = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // Getters
  const isAuthenticated = computed(() => !!token.value)
  const authHeaders = computed(() => ({
    Authorization: `Bearer ${token.value}`
  }))

  // Actions
  async function login(username, password) {
    loading.value = true
    error.value = null

    try {
      const response = await mockApi.login(username, password)
      user.value = response.data.user
      token.value = response.data.token

      console.log('✅ Login successful:', user.value.username)
      return response.data
    } catch (err) {
      error.value = err.message
      console.error('❌ Login failed:', err.message)
      throw err
    } finally {
      loading.value = false
    }
  }

  function logout() {
    user.value = null
    token.value = null
    error.value = null
    console.log('👋 Logged out')
  }

  function clearError() {
    error.value = null
  }

  return {
    // State
    user,
    token,
    loading,
    error,
    // Getters
    isAuthenticated,
    authHeaders,
    // Actions
    login,
    logout,
    clearError
  }
}, {
  // Persist auth state across page reloads
  persist: ['user', 'token']
})
