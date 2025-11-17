import { inject } from 'vue'
import { toastKey } from '../plugins/toast'

export function useToast() {
  const toast = inject(toastKey)

  if (!toast) {
    throw new Error('Toast plugin not installed. Use app.use(toastPlugin)')
  }

  return toast
}
