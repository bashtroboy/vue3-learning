<template>
  <div class="filter-bar">
    <div class="search-section">
      <input
        type="text"
        v-model="localSearch"
        placeholder="🔍 Search tasks..."
        class="search-input"
      />
    </div>

    <div class="filter-section">
      <div class="filter-group">
        <label>Status:</label>
        <div class="button-group">
          <button
            v-for="status in statuses"
            :key="status.value"
            :class="{ active: modelValue.status === status.value }"
            @click="updateFilter('status', status.value)"
          >
            {{ status.label }}
          </button>
        </div>
      </div>

      <div class="filter-group">
        <label>Priority:</label>
        <select :value="modelValue.priority" @change="updateFilter('priority', $event.target.value)">
          <option value="all">All Priorities</option>
          <option value="high">🔴 High</option>
          <option value="medium">🟡 Medium</option>
          <option value="low">🟢 Low</option>
        </select>
      </div>

      <div class="filter-group" v-if="projects.length > 0">
        <label>Project:</label>
        <select :value="modelValue.projectId" @change="updateFilter('projectId', $event.target.value)">
          <option value="">All Projects</option>
          <option v-for="project in projects" :key="project.id" :value="project.id">
            {{ project.name }}
          </option>
        </select>
      </div>

      <button class="clear-btn" @click="$emit('clear')" title="Clear all filters">
        Clear Filters
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Object,
    required: true
  },
  searchQuery: {
    type: String,
    default: ''
  },
  projects: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue', 'update:searchQuery', 'clear'])

const localSearch = ref(props.searchQuery)

const statuses = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' }
]

function updateFilter(key, value) {
  emit('update:modelValue', {
    ...props.modelValue,
    [key]: value
  })
}

watch(localSearch, (newValue) => {
  emit('update:searchQuery', newValue)
})

watch(() => props.searchQuery, (newValue) => {
  localSearch.value = newValue
})
</script>

<style scoped>
.filter-bar {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.search-section {
  width: 100%;
}

.search-input {
  width: 100%;
  padding: 12px 16px;
  font-size: 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  transition: all 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.filter-section {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-group label {
  font-size: 0.9rem;
  font-weight: 600;
  color: #666;
}

.button-group {
  display: flex;
  gap: 4px;
  background: #f0f0f0;
  padding: 4px;
  border-radius: 8px;
}

.button-group button {
  padding: 8px 16px;
  border: none;
  background: transparent;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  color: #666;
  transition: all 0.2s;
}

.button-group button:hover {
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
}

.button-group button.active {
  background: #667eea;
  color: white;
}

select {
  padding: 8px 12px;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  background: white;
  transition: all 0.2s;
}

select:focus {
  outline: none;
  border-color: #667eea;
}

.clear-btn {
  padding: 8px 16px;
  border: 2px solid #e0e0e0;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  color: #666;
  transition: all 0.2s;
  margin-left: auto;
}

.clear-btn:hover {
  border-color: #dc3545;
  color: #dc3545;
  background: #fee;
}

@media (max-width: 768px) {
  .filter-section {
    flex-direction: column;
    align-items: stretch;
  }

  .filter-group {
    flex-direction: column;
    align-items: stretch;
  }

  .clear-btn {
    margin-left: 0;
  }
}
</style>
