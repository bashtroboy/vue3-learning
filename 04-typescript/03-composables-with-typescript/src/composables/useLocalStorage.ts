import { ref, watch, type Ref } from 'vue'

/**
 * Generic local storage composable with type safety
 */
export function useLocalStorage<T>(
  key: string,
  defaultValue: T
): Ref<T> {
  // Try to load from localStorage
  const loadValue = (): T => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch (error) {
      console.warn(`Error loading localStorage key "${key}":`, error)
      return defaultValue
    }
  }

  const storedValue = ref<T>(loadValue()) as Ref<T>

  // Watch for changes and save to localStorage
  watch(
    storedValue,
    (newValue) => {
      try {
        window.localStorage.setItem(key, JSON.stringify(newValue))
      } catch (error) {
        console.error(`Error saving localStorage key "${key}":`, error)
      }
    },
    { deep: true }
  )

  return storedValue
}
