<template>
  <div class="node-list">
    <div class="node-list__header">
      <h2>{{ title }}</h2>
      <div class="node-list__filters">
        <button
          v-for="filter in filters"
          :key="filter.value"
          @click="activeFilter = filter.value"
          :class="{ active: activeFilter === filter.value }"
          class="filter-btn"
        >
          {{ filter.label }}
        </button>
      </div>
    </div>

    <div v-if="filteredNodes.length === 0" class="node-list__empty">
      <p>No {{ activeFilter === 'all' ? 'nodes' : activeFilter }} found</p>
    </div>

    <div v-else class="node-list__grid" :class="`node-list__grid--${viewMode}`">
      <router-link
        v-for="node in paginatedNodes"
        :key="node.id"
        :to="{ name: 'node-detail', params: { id: node.id } }"
        class="node-list__item"
      >
        <NodeCard :node="node" />
      </router-link>
    </div>

    <div v-if="totalPages > 1" class="node-list__pagination">
      <button
        @click="currentPage--"
        :disabled="currentPage === 1"
        class="pagination-btn"
      >
        Previous
      </button>
      <span class="pagination-info">
        Page {{ currentPage }} of {{ totalPages }}
      </span>
      <button
        @click="currentPage++"
        :disabled="currentPage === totalPages"
        class="pagination-btn"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { usePreferencesStore } from '@/stores/preferences'
import NodeCard from './NodeCard.vue'

const props = defineProps({
  nodes: {
    type: Array,
    required: true
  },
  title: {
    type: String,
    default: 'Nodes'
  }
})

const preferencesStore = usePreferencesStore()
const { itemsPerPage, defaultView } = storeToRefs(preferencesStore)

const activeFilter = ref('all')
const currentPage = ref(1)
const viewMode = ref(defaultView.value)

const filters = [
  { label: 'All', value: 'all' },
  { label: 'Folders', value: 'folders' },
  { label: 'Documents', value: 'documents' }
]

const filteredNodes = computed(() => {
  if (activeFilter.value === 'folders') {
    return props.nodes.filter(node => node.type === 'folder')
  }
  if (activeFilter.value === 'documents') {
    return props.nodes.filter(node => node.type === 'document')
  }
  return props.nodes
})

const totalPages = computed(() => {
  return Math.ceil(filteredNodes.value.length / itemsPerPage.value)
})

const paginatedNodes = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredNodes.value.slice(start, end)
})

// Reset page when filter changes
function setFilter(filter) {
  activeFilter.value = filter
  currentPage.value = 1
}
</script>

<style scoped>
.node-list {
  width: 100%;
}

.node-list__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.node-list__header h2 {
  margin: 0;
  color: var(--text-primary);
}

.node-list__filters {
  display: flex;
  gap: 0.5rem;
}

.filter-btn {
  padding: 0.5rem 1rem;
  border: 1px solid var(--border-color);
  background: var(--card-bg);
  color: var(--text-primary);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.9rem;
}

.filter-btn:hover {
  border-color: var(--primary-color);
}

.filter-btn.active {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.node-list__empty {
  text-align: center;
  padding: 3rem;
  color: var(--text-muted);
  font-size: 1.1rem;
}

.node-list__grid {
  display: grid;
  gap: 1rem;
}

.node-list__grid--list {
  grid-template-columns: 1fr;
}

.node-list__grid--grid {
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
}

.node-list__item {
  text-decoration: none;
  color: inherit;
}

.node-list__pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid var(--border-color);
}

.pagination-btn {
  padding: 0.5rem 1rem;
  border: 1px solid var(--border-color);
  background: var(--card-bg);
  color: var(--text-primary);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.pagination-btn:hover:not(:disabled) {
  border-color: var(--primary-color);
  background: var(--primary-color);
  color: white;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-info {
  color: var(--text-secondary);
  font-size: 0.9rem;
}
</style>
