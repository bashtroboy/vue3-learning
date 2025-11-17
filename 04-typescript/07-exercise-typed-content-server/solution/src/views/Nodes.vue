<script setup lang="ts">
import { onMounted } from 'vue'
import { useNodesStore } from '../stores/nodes'

const nodesStore = useNodesStore()

onMounted(() => {
  nodesStore.fetchNodes()
})
</script>

<template>
  <div class="view">
    <h2>Nodes</h2>
    <div v-if="nodesStore.loading">Loading...</div>
    <div v-else class="nodes-list">
      <div v-for="node in nodesStore.nodes" :key="node.id" class="node-card">
        <div class="node-icon">{{ node.type === 'folder' ? '📁' : '📄' }}</div>
        <div class="node-name">{{ node.name }}</div>
        <div class="node-type">{{ node.type }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.view h2 { color: #2c3e50; margin-bottom: 1rem; }
.nodes-list { display: grid; gap: 0.75rem; }
.node-card { display: flex; align-items: center; gap: 1rem; padding: 1rem; background: #f8f9fa; border-radius: 8px; }
.node-icon { font-size: 1.5rem; }
.node-name { flex: 1; font-weight: 600; }
.node-type { color: #6c757d; font-size: 0.85rem; text-transform: capitalize; }
</style>
