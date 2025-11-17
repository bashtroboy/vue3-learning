import { onUnmounted } from 'vue'

const handlers = new Map()

export function useEventBus() {
  function emit(event, ...args) {
    handlers.get(event)?.forEach(handler => handler(...args))
  }

  function on(event, handler) {
    if (!handlers.has(event)) {
      handlers.set(event, new Set())
    }
    handlers.get(event).add(handler)

    onUnmounted(() => {
      off(event, handler)
    })
  }

  function off(event, handler) {
    handlers.get(event)?.delete(handler)
  }

  return {
    emit,
    on,
    off
  }
}
