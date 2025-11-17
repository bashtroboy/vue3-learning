<template>
  <div class="notification-container">
    <transition-group name="notification">
      <div
        v-for="notification in notifications"
        :key="notification.id"
        class="notification"
        :class="`notification--${notification.type}`"
      >
        <div class="notification__content">
          <span class="notification__icon">
            {{ getIcon(notification.type) }}
          </span>
          <span class="notification__message">
            {{ notification.message }}
          </span>
        </div>
        <button
          @click="removeNotification(notification.id)"
          class="notification__close"
        >
          ×
        </button>
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useUIStore } from '@/stores/ui'

const uiStore = useUIStore()
const { notifications } = storeToRefs(uiStore)
const { removeNotification } = uiStore

function getIcon(type) {
  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  }
  return icons[type] || icons.info
}
</script>

<style scoped>
.notification-container {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-width: 400px;
}

.notification {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  min-width: 300px;
}

.notification--success {
  border-left: 4px solid #10b981;
}

.notification--error {
  border-left: 4px solid #ef4444;
}

.notification--warning {
  border-left: 4px solid #f59e0b;
}

.notification--info {
  border-left: 4px solid #3b82f6;
}

.notification__content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
}

.notification__icon {
  font-size: 1.25rem;
  line-height: 1;
}

.notification__message {
  color: var(--text-primary);
  font-size: 0.9rem;
}

.notification__close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--text-muted);
  padding: 0;
  width: 1.5rem;
  height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s;
}

.notification__close:hover {
  background: var(--border-color);
  color: var(--text-primary);
}

/* Animations */
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.notification-move {
  transition: transform 0.3s ease;
}
</style>
