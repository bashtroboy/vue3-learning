import { ref } from 'vue'

export function useAsyncData(fetcher) {
  const data = ref(null)
  const error = ref(null)
  const loading = ref(false)

  async function execute() {
    loading.value = true
    error.value = null

    try {
      data.value = await fetcher()
    } catch (e) {
      error.value = e
    } finally {
      loading.value = false
    }
  }

  execute()

  return {
    data,
    error,
    loading,
    refresh: execute
  }
}
