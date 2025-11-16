import { ref } from 'vue'

/**
 * useFetch - Reusable data fetching with loading and error states
 *
 * @param {String} url - API endpoint URL
 * @param {Object} options - Fetch options
 * @returns {Object} Fetch utilities
 */
export function useFetch(url, options = {}) {
  const data = ref(null)
  const error = ref(null)
  const isLoading = ref(false)

  async function execute(fetchOptions = {}) {
    isLoading.value = true
    error.value = null

    try {
      const response = await fetch(url, { ...options, ...fetchOptions })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      data.value = result
      return result
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return {
    data,
    error,
    isLoading,
    execute
  }
}

/**
 * usePost - POST request helper
 */
export function usePost(url) {
  const { data, error, isLoading, execute } = useFetch(url)

  async function post(body) {
    return execute({
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
  }

  return {
    data,
    error,
    isLoading,
    post
  }
}
