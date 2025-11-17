<template>
  <div class="error-prone">
    <h4>Error Prone Component</h4>
    <p>This component can throw errors to test error boundary</p>

    <button @click="throwOnClick" class="danger-btn">
      Throw Error on Click
    </button>

    <button @click="triggerRenderError" class="danger-btn">
      Trigger Render Error
    </button>

    <div v-if="shouldError">
      {{ willThrowError }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const shouldError = ref(false)

const throwOnClick = () => {
  throw new Error('Intentional error thrown from click handler!')
}

const triggerRenderError = () => {
  shouldError.value = true
}

// This will throw an error during rendering if shouldError is true
const willThrowError = computed(() => {
  if (shouldError.value) {
    throw new Error('Intentional error thrown during render!')
  }
  return 'Safe value'
})
</script>

<style scoped>
.error-prone {
  padding: 15px;
  background: #fff3cd;
  border: 2px dashed #ffc107;
  border-radius: 6px;
}

.error-prone h4 {
  margin-top: 0;
  color: #856404;
}

.danger-btn {
  background: #dc3545;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 10px;
  margin-top: 5px;
}

.danger-btn:hover {
  background: #c82333;
}
</style>
