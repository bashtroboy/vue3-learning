<template>
  <div class="data-component">
    <h4>Data Component</h4>
    <p v-if="data">{{ data.message }}</p>
  </div>
</template>

<script setup>
import { ref, onErrorCaptured } from 'vue'

const props = defineProps({
  shouldError: Boolean
})

const data = ref(null)

onErrorCaptured((err) => {
  console.error('Error in async component:', err)
  return false
})

// Simulate async data fetch with potential error
await new Promise((resolve, reject) => {
  setTimeout(() => {
    if (props.shouldError) {
      reject(new Error('Failed to load data'))
    } else {
      resolve()
    }
  }, 1000)
})

data.value = {
  message: 'Data loaded successfully!'
}
</script>

<style scoped>
.data-component {
  padding: 15px;
  background: #f0f9ff;
  border-radius: 8px;
}
</style>
