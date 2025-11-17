<template>
  <div class="node-detail">
    <div class="node-detail__header">
      <router-link to="/" class="back-link">
        ← Back to Home
      </router-link>
    </div>

    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Loading node details...</p>
    </div>

    <div v-else-if="error" class="error-state">
      <h2>Error Loading Node</h2>
      <p>{{ error }}</p>
      <router-link to="/" class="action-btn">Return Home</router-link>
    </div>

    <div v-else-if="currentNode" class="node-detail__content">
      <div class="breadcrumbs">
        <router-link
          v-for="(node, index) in breadcrumbPath"
          :key="node.id"
          :to="{ name: 'node-detail', params: { id: node.id } }"
          class="breadcrumb-item"
        >
          {{ node.name }}
          <span v-if="index < breadcrumbPath.length - 1" class="breadcrumb-separator">/</span>
        </router-link>
      </div>

      <div class="node-header">
        <div class="node-icon">
          {{ currentNode.type === 'folder' ? '📁' : '📄' }}
        </div>
        <div class="node-title">
          <h1>{{ currentNode.name }}</h1>
          <span class="node-type">{{ currentNode.type }}</span>
        </div>
      </div>

      <div class="node-metadata">
        <div class="metadata-grid">
          <div class="metadata-item">
            <strong>ID:</strong>
            <span>{{ currentNode.id }}</span>
          </div>
          <div class="metadata-item">
            <strong>Owner:</strong>
            <span>👤 {{ currentNode.owner }}</span>
          </div>
          <div class="metadata-item">
            <strong>Created:</strong>
            <span>📅 {{ currentNode.created }}</span>
          </div>
          <div v-if="currentNode.size" class="metadata-item">
            <strong>Size:</strong>
            <span>💾 {{ currentNode.size }}</span>
          </div>
          <div class="metadata-item">
            <strong>Type:</strong>
            <span>{{ currentNode.type }}</span>
          </div>
          <div v-if="currentNode.parent_id" class="metadata-item">
            <strong>Parent:</strong>
            <router-link
              :to="{ name: 'node-detail', params: { id: currentNode.parent_id } }"
              class="parent-link"
            >
              View Parent
            </router-link>
          </div>
        </div>

        <div class="description">
          <strong>Description:</strong>
          <p>{{ currentNode.description }}</p>
        </div>
      </div>

      <div v-if="childNodes.length > 0" class="children-section">
        <h2>Children ({{ childNodes.length }})</h2>
        <div class="children-grid">
          <router-link
            v-for="child in childNodes"
            :key="child.id"
            :to="{ name: 'node-detail', params: { id: child.id } }"
            class="child-card"
          >
            <div class="child-icon">
              {{ child.type === 'folder' ? '📁' : '📄' }}
            </div>
            <div class="child-info">
              <div class="child-name">{{ child.name }}</div>
              <div class="child-meta">{{ child.type }}</div>
            </div>
          </router-link>
        </div>
      </div>

      <div v-else-if="currentNode.type === 'folder'" class="empty-folder">
        <p>This folder is empty</p>
      </div>
    </div>

    <div v-else class="error-state">
      <h2>Node Not Found</h2>
      <p>The requested node could not be found.</p>
      <router-link to="/" class="action-btn">Return Home</router-link>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useContentServerStore } from '@/stores/contentServer'

const route = useRoute()
const contentStore = useContentServerStore()

const { currentNode, loading, error } = storeToRefs(contentStore)
const { fetchNode, getChildNodes, getBreadcrumbPath } = contentStore

const nodeId = computed(() => parseInt(route.params.id))

const childNodes = computed(() => {
  if (!currentNode.value) return []
  return getChildNodes.value(currentNode.value.id)
})

const breadcrumbPath = computed(() => {
  if (!currentNode.value) return []
  return getBreadcrumbPath.value(currentNode.value.id)
})

onMounted(() => {
  fetchNode(nodeId.value)
})

// Watch for route changes (when navigating between nodes)
watch(() => route.params.id, (newId) => {
  if (newId) {
    fetchNode(parseInt(newId))
  }
})
</script>

<style scoped>
.node-detail {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.node-detail__header {
  margin-bottom: 2rem;
}

.back-link {
  display: inline-flex;
  align-items: center;
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 500;
  transition: transform 0.2s;
}

.back-link:hover {
  transform: translateX(-4px);
}

.loading-state,
.error-state {
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

.error-state h2 {
  color: #ef4444;
}

.breadcrumbs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 2rem;
  padding: 0.75rem 1rem;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-size: 0.9rem;
}

.breadcrumb-item {
  color: var(--primary-color);
  text-decoration: none;
  transition: color 0.2s;
}

.breadcrumb-item:hover {
  text-decoration: underline;
}

.breadcrumb-item:last-child {
  color: var(--text-primary);
  font-weight: 500;
}

.breadcrumb-separator {
  margin: 0 0.5rem;
  color: var(--text-muted);
}

.node-header {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 2px solid var(--border-color);
}

.node-icon {
  font-size: 4rem;
}

.node-title h1 {
  margin: 0 0 0.5rem 0;
  color: var(--text-primary);
}

.node-type {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: var(--primary-color);
  color: white;
  border-radius: 4px;
  font-size: 0.85rem;
  text-transform: uppercase;
}

.node-metadata {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.metadata-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.metadata-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.metadata-item strong {
  color: var(--text-muted);
  font-size: 0.85rem;
}

.metadata-item span {
  color: var(--text-primary);
}

.parent-link {
  color: var(--primary-color);
  text-decoration: none;
}

.parent-link:hover {
  text-decoration: underline;
}

.description {
  padding-top: 1.5rem;
  border-top: 1px solid var(--border-color);
}

.description strong {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--text-muted);
  font-size: 0.85rem;
}

.description p {
  margin: 0;
  color: var(--text-primary);
  line-height: 1.6;
}

.children-section {
  margin-top: 2rem;
}

.children-section h2 {
  margin: 0 0 1rem 0;
  color: var(--text-primary);
}

.children-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
}

.child-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  text-decoration: none;
  color: inherit;
  transition: all 0.2s;
}

.child-card:hover {
  border-color: var(--primary-color);
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.child-icon {
  font-size: 2rem;
}

.child-info {
  flex: 1;
  min-width: 0;
}

.child-name {
  font-weight: 500;
  color: var(--text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.child-meta {
  font-size: 0.85rem;
  color: var(--text-muted);
  margin-top: 0.25rem;
}

.empty-folder {
  text-align: center;
  padding: 3rem;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  color: var(--text-muted);
}

.action-btn {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background: var(--primary-color);
  color: white;
  border-radius: 8px;
  text-decoration: none;
  margin-top: 1rem;
  transition: background 0.2s;
}

.action-btn:hover {
  background: #2563eb;
}
</style>
