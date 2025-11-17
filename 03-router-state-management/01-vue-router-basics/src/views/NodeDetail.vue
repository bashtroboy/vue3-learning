<template>
  <div class="node-detail">
    <div v-if="!node" class="error-state">
      <h2>Node Not Found</h2>
      <p>The requested node (ID: {{ nodeId }}) does not exist.</p>
      <router-link to="/" class="btn">
        Back to Home
      </router-link>
    </div>

    <div v-else>
      <!-- Breadcrumb Navigation -->
      <nav class="breadcrumb" aria-label="breadcrumb">
        <router-link
          v-for="(crumb, index) in breadcrumbs"
          :key="crumb.id"
          :to="{ name: 'node-detail', params: { id: crumb.id } }"
          class="breadcrumb-item"
        >
          {{ crumb.name }}
          <span v-if="index < breadcrumbs.length - 1" class="separator">/</span>
        </router-link>
      </nav>

      <!-- Node Header -->
      <div class="node-header">
        <div class="node-icon-large">
          {{ node.type === 'folder' ? '📁' : '📄' }}
        </div>
        <div>
          <h1>{{ node.name }}</h1>
          <p class="node-type-badge" :class="node.type">
            {{ node.type }}
          </p>
        </div>
      </div>

      <!-- Node Details -->
      <div class="node-info">
        <h2>Details</h2>
        <dl class="detail-list">
          <dt>ID:</dt>
          <dd>{{ node.id }}</dd>

          <dt>Name:</dt>
          <dd>{{ node.name }}</dd>

          <dt>Type:</dt>
          <dd>{{ node.type }}</dd>

          <dt>Owner:</dt>
          <dd>{{ node.owner }}</dd>

          <dt>Created:</dt>
          <dd>{{ node.created }}</dd>

          <dt>Description:</dt>
          <dd>{{ node.description }}</dd>

          <dt v-if="node.size">Size:</dt>
          <dd v-if="node.size">{{ node.size }}</dd>

          <dt>Parent ID:</dt>
          <dd>
            <router-link
              v-if="node.parent_id"
              :to="{ name: 'node-detail', params: { id: node.parent_id } }"
              class="link"
            >
              {{ node.parent_id }}
            </router-link>
            <span v-else>None (Root)</span>
          </dd>
        </dl>
      </div>

      <!-- Child Nodes (if folder) -->
      <div v-if="node.type === 'folder' && childNodes.length > 0" class="children-section">
        <h2>Child Nodes</h2>
        <div class="children-grid">
          <NodeCard
            v-for="child in childNodes"
            :key="child.id"
            :node="child"
          />
        </div>
      </div>

      <div v-else-if="node.type === 'folder'" class="empty-state">
        <p>This folder is empty.</p>
      </div>

      <!-- Actions -->
      <div class="actions">
        <button @click="goBack" class="btn btn-secondary">
          ← Go Back
        </button>
        <router-link to="/" class="btn">
          🏠 Home
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getNodeById, getChildNodes, getBreadcrumbPath } from '../data/mockNodes'
import NodeCard from '../components/NodeCard.vue'

const route = useRoute()
const router = useRouter()

// Get node ID from route params (reactive!)
const nodeId = computed(() => route.params.id)

// Get node data
const node = computed(() => getNodeById(nodeId.value))

// Get child nodes (if folder)
const childNodes = computed(() => {
  if (!node.value || node.value.type !== 'folder') return []
  return getChildNodes(node.value.id)
})

// Get breadcrumb path
const breadcrumbs = computed(() => {
  if (!node.value) return []
  return getBreadcrumbPath(node.value.id)
})

// Navigation
function goBack() {
  router.back()
}
</script>

<style scoped>
.error-state {
  text-align: center;
  padding: 3rem;
}

.error-state h2 {
  color: #e74c3c;
  margin-bottom: 1rem;
}

.breadcrumb {
  background: white;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.breadcrumb-item {
  color: #42b983;
  text-decoration: none;
  font-weight: 500;
}

.breadcrumb-item:hover {
  text-decoration: underline;
}

.separator {
  margin: 0 0.5rem;
  color: #999;
}

.node-header {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.node-icon-large {
  font-size: 4rem;
}

.node-header h1 {
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
}

.node-type-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
}

.node-type-badge.folder {
  background-color: #fff3cd;
  color: #856404;
}

.node-type-badge.document {
  background-color: #d1ecf1;
  color: #0c5460;
}

.node-info {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.node-info h2 {
  margin: 0 0 1.5rem 0;
  color: #2c3e50;
  border-bottom: 2px solid #42b983;
  padding-bottom: 0.5rem;
}

.detail-list {
  display: grid;
  grid-template-columns: 150px 1fr;
  gap: 1rem;
  margin: 0;
}

.detail-list dt {
  font-weight: 600;
  color: #2c3e50;
}

.detail-list dd {
  margin: 0;
  color: #666;
}

.link {
  color: #42b983;
  text-decoration: none;
}

.link:hover {
  text-decoration: underline;
}

.children-section {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.children-section h2 {
  margin: 0 0 1.5rem 0;
  color: #2c3e50;
  border-bottom: 2px solid #42b983;
  padding-bottom: 0.5rem;
}

.children-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
}

.btn {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background-color: #42b983;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;
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

@media (max-width: 768px) {
  .detail-list {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }

  .detail-list dt {
    margin-top: 1rem;
  }

  .children-grid {
    grid-template-columns: 1fr;
  }

  .actions {
    flex-direction: column;
  }
}
</style>
