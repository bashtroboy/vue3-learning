<template>
  <div class="search">
    <header class="page-header">
      <h1>Search Nodes</h1>
      <p class="subtitle">Find nodes by name, description, or owner</p>
    </header>

    <div class="search-box">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Enter search term..."
        class="search-input"
        @input="handleSearch"
      />
      <button @click="handleSearch" class="btn">
        🔍 Search
      </button>
      <button v-if="searchQuery" @click="clearSearch" class="btn btn-secondary">
        Clear
      </button>
    </div>

    <div class="search-info">
      <p v-if="searchQuery">
        Showing <strong>{{ searchResults.length }}</strong> results for
        "<strong>{{ searchQuery }}</strong>"
      </p>
      <p v-else class="text-muted">
        Enter a search term to find nodes
      </p>
    </div>

    <div v-if="searchQuery && searchResults.length === 0" class="empty-state">
      <h2>No results found</h2>
      <p>Try a different search term</p>
    </div>

    <div v-else-if="searchResults.length > 0" class="results-grid">
      <NodeCard
        v-for="node in searchResults"
        :key="node.id"
        :node="node"
      />
    </div>

    <div v-else class="help-section">
      <h2>Search Tips</h2>
      <ul>
        <li>Search by node name (e.g., "Invoice", "Project")</li>
        <li>Search by owner name (e.g., "John", "Admin")</li>
        <li>Search by description keywords</li>
        <li>Search is case-insensitive</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { searchNodes } from '../data/mockNodes'
import NodeCard from '../components/NodeCard.vue'

const route = useRoute()
const router = useRouter()

// Initialize search query from URL query parameter
const searchQuery = ref(route.query.q || '')

// Compute search results
const searchResults = computed(() => {
  return searchNodes(searchQuery.value)
})

// Handle search - update URL query parameter
function handleSearch() {
  router.push({
    name: 'search',
    query: { q: searchQuery.value }
  })
}

// Clear search
function clearSearch() {
  searchQuery.value = ''
  router.push({ name: 'search' })
}
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

.search-box {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  gap: 1rem;
}

.search-input {
  flex: 1;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  border: 2px solid #ddd;
  border-radius: 4px;
  outline: none;
  transition: border-color 0.3s;
}

.search-input:focus {
  border-color: #42b983;
}

.btn {
  padding: 0.75rem 1.5rem;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;
  white-space: nowrap;
}

.btn:hover {
  background-color: #359268;
}

.btn-secondary {
  background-color: #6c757d;
}

.btn-secondary:hover {
  background-color: #5a6268;
}

.search-info {
  background: white;
  padding: 1rem 1.5rem;
  border-radius: 4px;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.search-info p {
  margin: 0;
  color: #666;
}

.text-muted {
  color: #999 !important;
}

.results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.help-section {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.help-section h2 {
  color: #2c3e50;
  margin-bottom: 1rem;
}

.help-section ul {
  color: #666;
  line-height: 1.8;
}

.help-section li {
  margin-bottom: 0.5rem;
}

@media (max-width: 768px) {
  .page-header h1 {
    font-size: 2rem;
  }

  .search-box {
    flex-direction: column;
  }

  .results-grid {
    grid-template-columns: 1fr;
  }
}
</style>
