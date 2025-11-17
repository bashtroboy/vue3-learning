import { inject } from 'vue'
import { key } from '../plugins/notification'

export function useNotification() {
  const notification = inject(key)
  if (!notification) throw new Error('Notification plugin not installed')
  return notification
}
