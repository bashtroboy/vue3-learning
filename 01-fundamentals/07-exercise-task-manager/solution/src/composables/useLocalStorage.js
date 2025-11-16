import { ref, watch } from 'vue'

/**
 * useLocalStorage - Sync reactive state with localStorage
 *
 * @param {String} key - localStorage key
 * @param {*} defaultValue - Default value if key doesn't exist
 * @returns {Ref} Reactive reference synced with localStorage
 */
export function useLocalStorage(key, defaultValue) {
  // Try to get initial value from localStorage
  const storedValue = localStorage.getItem(key)
  const initialValue = storedValue ? JSON.parse(storedValue) : defaultValue

  const data = ref(initialValue)

  // Watch for changes and sync to localStorage
  watch(
    data,
    (newValue) => {
      localStorage.setItem(key, JSON.stringify(newValue))
    },
    { deep: true }
  )

  // Clear the value
  function clear() {
    localStorage.removeItem(key)
    data.value = defaultValue
  }

  return {
    data,
    clear
  }
}
