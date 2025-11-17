<template>
  <Teleport to="#toast-container">
    <TransitionGroup name="toast" tag="div" class="toast-container">
      <div
        v-for="notif in notifications"
        :key="notif.id"
        class="toast"
        :class="`toast-${notif.type}`"
        @click="notify.dismiss(notif.id)"
      >
        {{ notif.message }}
        <button class="close">×</button>
      </div>
    </TransitionGroup>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue'
import { useNotification } from '../composables/useNotification'

const notify = useNotification()
const notifications = computed(() => notify.state.notifications)
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.toast {
  min-width: 300px;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  color: white;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.toast-success { background: #27ae60; }
.toast-error { background: #e74c3c; }
.toast-warning { background: #f39c12; }
.toast-info { background: #3498db; }

.close {
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
}

.toast-enter-active, .toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100px);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(-100px);
}
</style>
