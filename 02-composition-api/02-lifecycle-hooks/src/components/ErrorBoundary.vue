<template>
  <div class="error-boundary">
    <div v-if="hasError" class="error-display">
      <h3>⚠️ Error Caught!</h3>
      <p class="error-message">{{ errorMessage }}</p>
      <pre class="error-stack">{{ errorStack }}</pre>
      <button @click="resetError" class="reset-btn">Reset</button>
    </div>
    <slot v-else></slot>
  </div>
</template>

<script setup>
import { ref, onErrorCaptured } from 'vue'

const hasError = ref(false)
const errorMessage = ref('')
const errorStack = ref('')

// Capture errors from child components
onErrorCaptured((err, instance, info) => {
  hasError.value = true
  errorMessage.value = err.message
  errorStack.value = err.stack || 'No stack trace available'

  console.error('Error captured:', err)
  console.error('Component:', instance)
  console.error('Error info:', info)

  // Return false to prevent error from propagating further
  return false
})

const resetError = () => {
  hasError.value = false
  errorMessage.value = ''
  errorStack.value = ''
}
</script>

<style scoped>
.error-boundary {
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  padding: 15px;
  margin: 10px 0;
}

.error-display {
  background: #fee;
  border: 2px solid #fcc;
  border-radius: 6px;
  padding: 20px;
}

.error-display h3 {
  color: #c33;
  margin-top: 0;
}

.error-message {
  color: #c33;
  font-weight: bold;
  margin: 10px 0;
}

.error-stack {
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 10px;
  font-size: 12px;
  overflow-x: auto;
  max-height: 200px;
  overflow-y: auto;
}

.reset-btn {
  background: #c33;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
}

.reset-btn:hover {
  background: #a22;
}
</style>
