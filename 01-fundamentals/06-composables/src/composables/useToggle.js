import { ref } from 'vue'

/**
 * useToggle - Boolean state toggle utility
 *
 * @param {Boolean} initialValue - Initial boolean value
 * @returns {Object} Toggle utilities
 */
export function useToggle(initialValue = false) {
  const value = ref(initialValue)

  function toggle() {
    value.value = !value.value
  }

  function setTrue() {
    value.value = true
  }

  function setFalse() {
    value.value = false
  }

  function setValue(newValue) {
    value.value = newValue
  }

  return {
    value,
    toggle,
    setTrue,
    setFalse,
    setValue
  }
}
