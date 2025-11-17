import { ref, watch, unref } from 'vue'

export function useDebounce(value, delay = 300) {
  const debounced = ref(unref(value))

  watch(
    () => unref(value),
    (newValue) => {
      const timeout = setTimeout(() => {
        debounced.value = newValue
      }, delay)

      return () => clearTimeout(timeout)
    }
  )

  return debounced
}
