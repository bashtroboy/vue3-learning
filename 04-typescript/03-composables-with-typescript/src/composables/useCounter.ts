import { ref, computed, type Ref, type ComputedRef } from 'vue'

/**
 * Simple counter composable with TypeScript
 */
export interface UseCounterReturn {
  count: Ref<number>
  doubled: ComputedRef<number>
  increment: () => void
  decrement: () => void
  reset: () => void
}

export function useCounter(initialValue: number = 0): UseCounterReturn {
  const count = ref<number>(initialValue)

  const doubled = computed<number>(() => count.value * 2)

  const increment = (): void => {
    count.value++
  }

  const decrement = (): void => {
    count.value--
  }

  const reset = (): void => {
    count.value = initialValue
  }

  return {
    count,
    doubled,
    increment,
    decrement,
    reset
  }
}
