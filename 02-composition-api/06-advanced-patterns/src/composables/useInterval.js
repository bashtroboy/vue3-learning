import { ref, onUnmounted } from 'vue'

export function useInterval(callback, delay) {
  const isActive = ref(false)
  let intervalId = null

  function start() {
    if (!isActive.value) {
      isActive.value = true
      intervalId = setInterval(callback, delay)
    }
  }

  function stop() {
    if (isActive.value) {
      isActive.value = false
      clearInterval(intervalId)
      intervalId = null
    }
  }

  onUnmounted(() => {
    stop()
  })

  return {
    isActive,
    start,
    stop
  }
}
