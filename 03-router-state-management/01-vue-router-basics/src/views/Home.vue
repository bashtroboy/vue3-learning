<template>
  <div class="home">
    <header class="page-header">
      <h1>Content Server Browser</h1>
      <p class="subtitle">Browse and explore all nodes in the content server</p>
    </header>

    <div class="filters">
      <div class="filter-group">
        <label for="typeFilter">Filter by type:</label>
        <select id="typeFilter" v-model="selectedType" class="filter-select">
          <option value="all">All Types</option>
          <option value="folder">Folders</option>
          <option value="document">Documents</option>
        </select>
      </div>

      <div class="stats">
        <span class="stat-item">
          Total Nodes: <strong>{{ filteredNodes.length }}</strong>
        </span>
      </div>
    </div>

    <div v-if="filteredNodes.length === 0" class="empty-state">
      <h2>No nodes found</h2>
      <p>Try changing your filter settings</p>
    </div>

    <div v-else class="nodes-grid">
      <NodeCard
        v-for="node in filteredNodes"
        :key="node.id"
        :node="node"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { mockNodes } from '../data/mockNodes'
import NodeCard from '../components/NodeCard.vue'

// Filter state
const selectedType = ref('all')

// Computed filtered nodes
const filteredNodes = computed(() => {
  if (selectedType.value === 'all') {
    return mockNodes
  }
  return mockNodes.filter(node => node.type === selectedType.value)
})
</script>

<style scoped>
.page-header {
  text-align: center;
  margin-bottom: 2rem;
}

.page-header h1 {
  color: #2c3e50;
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: #666;
  font-size: 1.1rem;
}

.filters {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.filter-group label {
  font-weight: 500;
  color: #2c3e50;
}

.filter-select {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
}

.stats {
  display: flex;
  gap: 1.5rem;
}

.stat-item {
  color: #666;
}

.stat-item strong {
  color: #42b983;
  font-size: 1.1rem;
}

.nodes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

@media (max-width: 768px) {
  .page-header h1 {
    font-size: 2rem;
  }

  .nodes-grid {
    grid-template-columns: 1fr;
  }

  .filters {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
