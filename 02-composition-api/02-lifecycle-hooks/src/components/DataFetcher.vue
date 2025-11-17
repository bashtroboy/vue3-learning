<template>
  <div class="data-fetcher">
    <div v-if="loading">Loading...</div>
    <div v-else-if="error">Error: {{ error }}</div>
    <div v-else>
      <strong>User:</strong> {{ data.name }} ({{ data.email }})
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const data = ref(null)
const loading = ref(true)
const error = ref(null)

onMounted(async () => {
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    data.value = { name: 'John Doe', email: 'john@example.com' }
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
})
</script>
