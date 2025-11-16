import { ref, computed } from 'vue'

/**
 * useCounter - Counter utility with min/max bounds
 *
 * @param {Number} initialValue - Initial counter value
 * @param {Object} options - Options { min, max, step }
 * @returns {Object} Counter utilities
 */
export function useCounter(initialValue = 0, options = {}) {
  const { min, max, step = 1 } = options

  const count = ref(initialValue)

  function increment() {
    const newValue = count.value + step
    if (max === undefined || newValue <= max) {
      count.value = newValue
    }
  }

  function decrement() {
    const newValue = count.value - step
    if (min === undefined || newValue >= min) {
      count.value = newValue
    }
  }

  function reset() {
    count.value = initialValue
  }

  function setValue(newValue) {
    if ((min === undefined || newValue >= min) &&
        (max === undefined || newValue <= max)) {
      count.value = newValue
    }
  }

  const canIncrement = computed(() => max === undefined || count.value < max)
  const canDecrement = computed(() => min === undefined || count.value > min)

  return {
    count,
    increment,
    decrement,
    reset,
    setValue,
    canIncrement,
    canDecrement
  }
}
