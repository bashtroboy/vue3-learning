<template>
  <div class="modal-data">
    <div class="data-grid">
      <div v-for="item in items" :key="item.id" class="data-item">
        <h5>{{ item.title }}</h5>
        <p>{{ item.description }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const items = ref([])

// Simulate async data fetch for modal
await new Promise(resolve => setTimeout(resolve, 1500))

items.value = [
  { id: 1, title: 'Item 1', description: 'First async item' },
  { id: 2, title: 'Item 2', description: 'Second async item' },
  { id: 3, title: 'Item 3', description: 'Third async item' }
]
</script>

<style scoped>
.modal-data {
  margin: 20px 0;
}

.data-grid {
  display: grid;
  gap: 15px;
}

.data-item {
  padding: 15px;
  background: #f8f9fa;
  border-radius: 6px;
  border-left: 4px solid #3498db;
}

.data-item h5 {
  margin: 0 0 8px 0;
  color: #2c3e50;
}

.data-item p {
  margin: 0;
  color: #7f8c8d;
}
</style>
