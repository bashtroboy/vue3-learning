<template>
  <div class="search-page">
    <h1>Search Nodes</h1>

    <div class="search-container">
      <div class="search-input-group">
        <input
          v-model="localQuery"
          @input="handleSearch"
          type="text"
          placeholder="Search by name or description..."
          class="search-input"
        />
        <button @click="performSearch" class="search-btn">
          Search
        </button>
      </div>

      <div class="filters">
        <div class="filter-group">
          <label>Type:</label>
          <select v-model="searchStore.typeFilter" class="filter-select">
            <option value="all">All Types</option>
            <option value="folder">Folders</option>
            <option value="document">Documents</option>
          </select>
        </div>

        <div class="filter-group">
          <label>Owner:</label>
          <input
            v-model="searchStore.ownerFilter"
            type="text"
            placeholder="Filter by owner..."
            class="filter-input"
          />
        </div>

        <button @click="clearFilters" class="clear-filters-btn">
          Clear Filters
        </button>
      </div>
    </div>

    <div v-if="searchHistory.length > 0" class="search-history">
      <h3>Recent Searches</h3>
      <div class="history-items">
        <button
          v-for="(item, index) in searchHistory"
          :key="index"
          @click="useHistoryItem(item)"
          class="history-item"
        >
          {{ item }}
        </button>
        <button @click="searchStore.clearHistory()" class="clear-history-btn">
          Clear History
        </button>
      </div>
    </div>

    <div class="results-header">
      <h2>Results ({{ resultCount }})</h2>
    </div>

    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Loading...</p>
    </div>

    <div v-else-if="searchResults.length === 0" class="empty-state">
      <p>No results found. Try different search criteria.</p>
    </div>

    <div v-else class="results-grid">
      <router-link
        v-for="node in searchResults"
        :key="node.id"
        :to="{ name: 'node-detail', params: { id: node.id } }"
        class="result-link"
      >
        <NodeCard :node="node" :show-favorite="true" />
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useSearchStore } from '@/stores/search'
import { useContentServerStore } from '@/stores/contentServer'
import { useNodeCache } from '@/composables/useNodeCache'
import NodeCard from '@/components/NodeCard.vue'

const route = useRoute()
const router = useRouter()
const searchStore = useSearchStore()
const contentStore = useContentServerStore()

const { searchResults, resultCount, searchHistory } = storeToRefs(searchStore)
const { loading } = storeToRefs(contentStore)
const { loadNodes } = useNodeCache()

const localQuery = ref(searchStore.query || route.query.q || '')

// Load nodes if not already loaded
if (contentStore.nodeCount === 0) {
  loadNodes()
}

// Initialize from URL query params
if (route.query.q) {
  searchStore.setQuery(route.query.q)
  localQuery.value = route.query.q
}
if (route.query.type) {
  searchStore.setTypeFilter(route.query.type)
}
if (route.query.owner) {
  searchStore.setOwnerFilter(route.query.owner)
}

function handleSearch() {
  searchStore.setQuery(localQuery.value)
  updateURL()
}

function performSearch() {
  searchStore.setQuery(localQuery.value)
  if (localQuery.value) {
    searchStore.addToHistory(localQuery.value)
  }
  updateURL()
}

function clearFilters() {
  searchStore.clearFilters()
  localQuery.value = ''
  updateURL()
}

function useHistoryItem(item) {
  localQuery.value = item
  searchStore.setQuery(item)
  updateURL()
}

function updateURL() {
  const query = {}
  if (searchStore.query) query.q = searchStore.query
  if (searchStore.typeFilter !== 'all') query.type = searchStore.typeFilter
  if (searchStore.ownerFilter) query.owner = searchStore.ownerFilter

  router.replace({ query })
}

// Watch for URL changes
watch(() => route.query, (newQuery) => {
  if (newQuery.q !== searchStore.query) {
    localQuery.value = newQuery.q || ''
    searchStore.setQuery(newQuery.q || '')
  }
})
</script>

<style scoped>
.search-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

h1 {
  margin: 0 0 2rem 0;
  color: var(--text-primary);
}

.search-container {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.search-input-group {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.search-input {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  font-size: 1rem;
  background: var(--bg-primary);
  color: var(--text-primary);
}

.search-btn {
  padding: 0.75rem 1.5rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
}

.filters {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  align-items: flex-end;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
  min-width: 150px;
}

.filter-group label {
  font-size: 0.9rem;
  color: var(--text-secondary);
  font-weight: 500;
}

.filter-select,
.filter-input {
  padding: 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background: var(--bg-primary);
  color: var(--text-primary);
}

.clear-filters-btn {
  padding: 0.5rem 1rem;
  border: 1px solid var(--border-color);
  background: var(--bg-primary);
  color: var(--text-primary);
  border-radius: 6px;
  cursor: pointer;
}

.search-history {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.search-history h3 {
  margin: 0 0 1rem 0;
  font-size: 1rem;
  color: var(--text-primary);
}

.history-items {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.history-item {
  padding: 0.5rem 1rem;
  border: 1px solid var(--border-color);
  background: var(--bg-primary);
  color: var(--text-primary);
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
}

.history-item:hover {
  border-color: var(--primary-color);
}

.clear-history-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #ef4444;
  background: transparent;
  color: #ef4444;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
}

.results-header {
  margin-bottom: 1.5rem;
}

.results-header h2 {
  margin: 0;
  color: var(--text-primary);
}

.loading-state,
.empty-state {
  text-align: center;
  padding: 4rem;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid var(--border-color);
  border-top-color: var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.results-grid {
  display: grid;
  gap: 1rem;
}

.result-link {
  text-decoration: none;
  color: inherit;
}
</style>
