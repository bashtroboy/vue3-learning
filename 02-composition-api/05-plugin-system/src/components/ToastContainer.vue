<template>
  <Teleport to="#toast-container">
    <TransitionGroup name="toast" tag="div" class="toast-container" :class="`position-${position}`">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="toast"
        :class="`toast-${toast.type}`"
        @click="dismiss(toast.id)"
      >
        <div class="toast-icon">
          <span v-if="toast.type === 'success'">✓</span>
          <span v-else-if="toast.type === 'error'">✕</span>
          <span v-else-if="toast.type === 'warning'">!</span>
          <span v-else>ℹ</span>
        </div>
        <div class="toast-message">{{ toast.message }}</div>
        <button class="toast-close">×</button>
      </div>
    </TransitionGroup>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue'
import { useToast } from '../composables/useToast'

const toast = useToast()

const toasts = computed(() => toast.state.toasts)
const position = computed(() => toast.state.config.position)

const dismiss = (id) => {
  toast.dismiss(id)
}
</script>

<style scoped>
.toast-container {
  position: fixed;
  z-index: 9999;
  pointer-events: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.position-top-right {
  top: 20px;
  right: 20px;
}

.position-top-left {
  top: 20px;
  left: 20px;
}

.position-bottom-right {
  bottom: 20px;
  right: 20px;
}

.position-bottom-left {
  bottom: 20px;
  left: 20px;
}

.toast {
  min-width: 300px;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  display: flex;
  align-items: center;
  gap: 12px;
  pointer-events: all;
  cursor: pointer;
  transition: all 0.3s;
}

.toast:hover {
  transform: translateX(-5px);
}

.toast-success {
  background: #27ae60;
  color: white;
}

.toast-error {
  background: #e74c3c;
  color: white;
}

.toast-warning {
  background: #f39c12;
  color: white;
}

.toast-info {
  background: #3498db;
  color: white;
}

.toast-icon {
  font-size: 20px;
  font-weight: bold;
}

.toast-message {
  flex: 1;
}

.toast-close {
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  padding: 0;
  line-height: 1;
  opacity: 0.8;
}

.toast-close:hover {
  opacity: 1;
}

.toast-enter-active,
.toast-leave-active {
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
