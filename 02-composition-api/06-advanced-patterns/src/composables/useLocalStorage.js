import { ref, watch } from 'vue'

export function useLocalStorage(key, defaultValue) {
  const data = ref(defaultValue)

  const stored = localStorage.getItem(key)
  if (stored) {
    try {
      data.value = JSON.parse(stored)
    } catch {
      data.value = stored
    }
  }

  watch(data, (newValue) => {
    if (typeof newValue === 'string') {
      localStorage.setItem(key, newValue)
    } else {
      localStorage.setItem(key, JSON.stringify(newValue))
    }
  }, { deep: true })

  return data
}
