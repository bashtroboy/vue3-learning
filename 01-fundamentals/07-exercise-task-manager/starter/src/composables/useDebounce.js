import { ref, watch } from 'vue'

/**
 * useDebounce - Debounce a reactive value
 *
 * @param {Ref} value - Reactive value to debounce
 * @param {Number} delay - Delay in milliseconds
 * @returns {Ref} Debounced value
 */
export function useDebounce(value, delay = 500) {
  const debouncedValue = ref(value.value)
  let timeout

  watch(value, (newValue) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      debouncedValue.value = newValue
    }, delay)
  })

  return debouncedValue
}

/**
 * useDebouncedFn - Debounce a function call
 *
 * @param {Function} fn - Function to debounce
 * @param {Number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
export function useDebouncedFn(fn, delay = 500) {
  let timeout

  return function (...args) {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}
