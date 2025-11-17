<script setup lang="ts">
import { ref } from 'vue'

// Type-safe emits
const emit = defineEmits<{
  search: [query: string]
  clear: []
}>()

const query = ref<string>('')

const handleSubmit = () => {
  if (query.value.trim()) {
    emit('search', query.value)
  }
}

const handleClear = () => {
  query.value = ''
  emit('clear')
}
</script>

<template>
  <div class="search-input">
    <input
      v-model="query"
      type="text"
      placeholder="Search..."
      @keyup.enter="handleSubmit"
    />
    <button @click="handleSubmit" class="btn-search">Search</button>
    <button @click="handleClear" class="btn-clear">Clear</button>
  </div>
</template>

<style scoped>
.search-input {
  display: flex;
  gap: 0.5rem;
}

input {
  flex: 1;
  padding: 0.75rem;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
}

input:focus {
  outline: none;
  border-color: #667eea;
}

button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-search {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-search:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(102, 126, 234, 0.3);
}

.btn-clear {
  background: #e9ecef;
  color: #6c757d;
}

.btn-clear:hover {
  background: #dee2e6;
}
</style>
