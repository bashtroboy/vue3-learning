<template>
  <div class="home">
    <header class="home__header">
      <h1>Content Server Node Cache</h1>
      <p class="subtitle">Pinia State Management Demo</p>
    </header>

    <div class="home__actions">
      <button @click="loadNodes" :disabled="loading" class="action-btn primary">
        {{ loading ? 'Loading...' : 'Load Nodes' }}
      </button>
      <button @click="clearCache" :disabled="loading || nodeCount === 0" class="action-btn">
        Clear Cache
      </button>
      <button @click="showPreferences = !showPreferences" class="action-btn">
        {{ showPreferences ? 'Hide' : 'Show' }} Preferences
      </button>
    </div>

    <div v-if="error" class="error-message">
      <strong>Error:</strong> {{ error }}
      <button @click="contentStore.clearError()" class="close-btn">×</button>
    </div>

    <div class="home__stats">
      <div class="stat-card">
        <div class="stat-value">{{ nodeCount }}</div>
        <div class="stat-label">Total Nodes</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{{ folderCount }}</div>
        <div class="stat-label">Folders</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{{ documentCount }}</div>
        <div class="stat-label">Documents</div>
      </div>
    </div>

    <div v-if="showPreferences" class="home__preferences">
      <PreferencesPanel />
    </div>

    <div v-if="loading && nodeCount === 0" class="loading-state">
      <div class="spinner"></div>
      <p>Loading nodes...</p>
    </div>

    <div v-else-if="nodeCount === 0" class="empty-state">
      <p>No nodes loaded. Click "Load Nodes" to fetch data.</p>
    </div>

    <div v-else class="home__content">
      <NodeList :nodes="nodes" title="All Nodes" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useContentServerStore } from '@/stores/contentServer'
import NodeList from '@/components/NodeList.vue'
import PreferencesPanel from '@/components/PreferencesPanel.vue'

const contentStore = useContentServerStore()
const { nodes, loading, error, nodeCount, folderCount, documentCount } = storeToRefs(contentStore)
const { fetchNodes, clearCache } = contentStore

const showPreferences = ref(false)

function loadNodes() {
  fetchNodes()
}
</script>

<style scoped>
.home {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.home__header {
  text-align: center;
  margin-bottom: 2rem;
}

.home__header h1 {
  margin: 0 0 0.5rem 0;
  color: var(--text-primary);
  font-size: 2rem;
}

.subtitle {
  margin: 0;
  color: var(--text-secondary);
  font-size: 1.1rem;
}

.home__actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
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

.error-message {
  background: #fee;
  border: 1px solid #fcc;
  color: #c33;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #c33;
  padding: 0;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.home__stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 1.5rem;
  text-align: center;
}

.stat-value {
  font-size: 2.5rem;
  font-weight: bold;
  color: var(--primary-color);
  margin-bottom: 0.5rem;
}

.stat-label {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.home__preferences {
  margin-bottom: 2rem;
}

.loading-state {
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

.loading-state p {
  color: var(--text-secondary);
  font-size: 1.1rem;
}

.empty-state {
  text-align: center;
  padding: 4rem;
  color: var(--text-muted);
  font-size: 1.1rem;
}

.home__content {
  margin-top: 2rem;
}
</style>
