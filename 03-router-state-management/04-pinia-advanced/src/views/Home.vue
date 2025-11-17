<template>
  <div class="home">
    <div class="home__actions">
      <button @click="loadNodesWithCache" :disabled="loading" class="action-btn primary">
        {{ loading ? 'Loading...' : 'Load Nodes' }}
      </button>
      <button @click="reloadNodes" :disabled="loading" class="action-btn">
        🔄 Force Reload
      </button>
      <button @click="clearAllCache" :disabled="loading" class="action-btn">
        🗑️ Clear Cache
      </button>
    </div>

    <div class="home__info">
      <div class="info-card">
        <h3>Cache Statistics</h3>
        <div class="stats-grid">
          <div class="stat">
            <span class="stat-label">Total Items:</span>
            <span class="stat-value">{{ cacheStats.total }}</span>
          </div>
          <div class="stat">
            <span class="stat-label">Valid:</span>
            <span class="stat-value">{{ cacheStats.valid }}</span>
          </div>
          <div class="stat">
            <span class="stat-label">Expired:</span>
            <span class="stat-value">{{ cacheStats.expired }}</span>
          </div>
        </div>
      </div>

      <div class="info-card">
        <h3>Node Statistics</h3>
        <div class="stats-grid">
          <div class="stat">
            <span class="stat-label">Total:</span>
            <span class="stat-value">{{ nodeCount }}</span>
          </div>
          <div class="stat">
            <span class="stat-label">Folders:</span>
            <span class="stat-value">{{ folderCount }}</span>
          </div>
          <div class="stat">
            <span class="stat-label">Documents:</span>
            <span class="stat-value">{{ documentCount }}</span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="loading && nodeCount === 0" class="loading-state">
      <div class="spinner"></div>
      <p>Loading nodes...</p>
    </div>

    <div v-else-if="nodeCount === 0" class="empty-state">
      <p>No nodes loaded. Click "Load Nodes" to fetch data.</p>
    </div>

    <div v-else class="home__nodes">
      <h2>All Nodes</h2>
      <div class="nodes-grid">
        <router-link
          v-for="node in nodes"
          :key="node.id"
          :to="{ name: 'node-detail', params: { id: node.id } }"
          class="node-link"
        >
          <NodeCard :node="node" :show-favorite="true" />
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useContentServerStore } from '@/stores/contentServer'
import { useNodeCache } from '@/composables/useNodeCache'
import NodeCard from '@/components/NodeCard.vue'

const contentStore = useContentServerStore()
const { nodes, loading, nodeCount, folderCount, documentCount } = storeToRefs(contentStore)

const { loadNodes, clearCache, getCacheStats } = useNodeCache()

const cacheStats = computed(() => getCacheStats())

async function loadNodesWithCache() {
  try {
    await loadNodes()
  } catch (error) {
    // Error is handled by composable
  }
}

async function reloadNodes() {
  try {
    await loadNodes({ forceReload: true })
  } catch (error) {
    // Error is handled by composable
  }
}

function clearAllCache() {
  clearCache()
}

// Auto-load nodes on mount
onMounted(() => {
  if (nodeCount.value === 0) {
    loadNodesWithCache()
  }
})
</script>

<style scoped>
.home {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.home__actions {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.action-btn {
  padding: 0.75rem 1.5rem;
  border: 1px solid var(--border-color);
  background: var(--card-bg);
  color: var(--text-primary);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 1rem;
  font-weight: 500;
}

.action-btn:hover:not(:disabled) {
  border-color: var(--primary-color);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.action-btn.primary {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.action-btn.primary:hover:not(:disabled) {
  background: #2563eb;
  border-color: #2563eb;
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.home__info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.info-card {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 1.5rem;
}

.info-card h3 {
  margin: 0 0 1rem 0;
  color: var(--text-primary);
  font-size: 1rem;
}

.stats-grid {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.stat {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stat-label {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.stat-value {
  color: var(--primary-color);
  font-weight: 600;
  font-size: 1.1rem;
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

.loading-state p,
.empty-state p {
  color: var(--text-secondary);
  font-size: 1.1rem;
}

.home__nodes h2 {
  margin: 0 0 1.5rem 0;
  color: var(--text-primary);
}

.nodes-grid {
  display: grid;
  gap: 1rem;
}

.node-link {
  text-decoration: none;
  color: inherit;
}
</style>
