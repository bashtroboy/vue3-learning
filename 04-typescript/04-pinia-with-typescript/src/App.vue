<script setup lang="ts">
import { onMounted } from 'vue'
import { useNodesStore } from './stores/nodes'
import type { Node } from './types'

const nodesStore = useNodesStore()

onMounted(() => {
  nodesStore.fetchNodes()
})

const handleAdd = () => {
  nodesStore.addNode({
    name: `New Document ${Date.now()}`,
    type: 'document',
    parentId: 1
  })
}
</script>

<template>
  <div class="app">
    <header class="header">
      <h1>🗃️ Pinia with TypeScript</h1>
      <p>Type-safe state management</p>
    </header>

    <main class="content">
      <div class="section">
        <h2>Nodes Store</h2>

        <div class="stats">
          <div class="stat">
            <div class="stat-label">Total Nodes</div>
            <div class="stat-value">{{ nodesStore.nodeCount }}</div>
          </div>
          <div class="stat">
            <div class="stat-label">Folders</div>
            <div class="stat-value">{{ nodesStore.folders.length }}</div>
          </div>
          <div class="stat">
            <div class="stat-label">Documents</div>
            <div class="stat-value">{{ nodesStore.documents.length }}</div>
          </div>
        </div>

        <div class="actions">
          <button @click="handleAdd" class="btn">Add Document</button>
          <button @click="nodesStore.fetchNodes" class="btn">Refresh</button>
        </div>

        <div v-if="nodesStore.loading" class="loading">Loading...</div>
        <div v-else-if="nodesStore.error" class="error">{{ nodesStore.error }}</div>

        <div class="nodes-list">
          <div
            v-for="node in nodesStore.nodes"
            :key="node.id"
            :class="['node-card', { selected: nodesStore.selectedId === node.id }]"
            @click="nodesStore.selectNode(node.id)"
          >
            <div class="node-icon">{{ node.type === 'folder' ? '📁' : '📄' }}</div>
            <div class="node-info">
              <div class="node-name">{{ node.name }}</div>
              <div class="node-type">{{ node.type }}</div>
            </div>
          </div>
        </div>

        <div v-if="nodesStore.selectedNode" class="selected-info">
          <h3>Selected Node</h3>
          <pre>{{ nodesStore.selectedNode }}</pre>
        </div>
      </div>

      <div class="section">
        <h3>Code Example</h3>
        <div class="code-block">
          <pre><code>// Define typed store
export const useNodesStore = defineStore('nodes', () => {
  const nodes = ref&lt;Node[]&gt;([])
  const loading = ref&lt;boolean&gt;(false)

  const nodeCount = computed&lt;number&gt;(() => nodes.value.length)

  async function fetchNodes(): Promise&lt;void&gt; {
    loading.value = true
    // Fetch logic
  }

  return { nodes, loading, nodeCount, fetchNodes }
})

// Use in component
const store = useNodesStore()
await store.fetchNodes()
console.log(store.nodeCount)</code></pre>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.app { max-width: 1200px; margin: 0 auto; }
.header { background: white; padding: 2rem; border-radius: 12px; text-align: center; margin-bottom: 2rem; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
.header h1 { color: #2c3e50; font-size: 2.5rem; margin-bottom: 0.5rem; }
.header p { color: #7f8c8d; font-size: 1.1rem; }
.content { background: white; padding: 2rem; border-radius: 12px; }
.section { margin-bottom: 2rem; }
.section h2 { color: #2c3e50; margin-bottom: 1.5rem; }
.stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem; margin-bottom: 1.5rem; }
.stat { background: #f8f9fa; padding: 1.5rem; border-radius: 8px; text-align: center; }
.stat-label { color: #6c757d; font-size: 0.85rem; margin-bottom: 0.5rem; }
.stat-value { font-size: 2rem; font-weight: 700; color: #667eea; }
.actions { display: flex; gap: 1rem; margin-bottom: 1.5rem; }
.btn { padding: 0.75rem 1.5rem; background: #667eea; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; }
.btn:hover { background: #5568d3; }
.nodes-list { display: grid; gap: 0.75rem; }
.node-card { display: flex; align-items: center; gap: 1rem; padding: 1rem; background: #f8f9fa; border: 2px solid #e9ecef; border-radius: 8px; cursor: pointer; transition: all 0.2s; }
.node-card:hover { border-color: #667eea; }
.node-card.selected { background: #e7f3ff; border-color: #667eea; }
.node-icon { font-size: 2rem; }
.node-info { flex: 1; }
.node-name { font-weight: 600; color: #2c3e50; }
.node-type { font-size: 0.85rem; color: #6c757d; text-transform: capitalize; }
.selected-info { margin-top: 1.5rem; padding: 1rem; background: #f8f9fa; border-radius: 8px; }
.selected-info h3 { margin-bottom: 0.5rem; }
.selected-info pre { font-family: Monaco, monospace; font-size: 0.85rem; overflow-x: auto; }
.code-block { background: #f8f9fa; border-radius: 8px; padding: 1rem; overflow-x: auto; }
.code-block pre { margin: 0; font-family: Monaco, monospace; font-size: 0.85rem; line-height: 1.6; }
.loading, .error { padding: 1rem; border-radius: 8px; margin-bottom: 1rem; }
.loading { background: #fff3cd; color: #856404; }
.error { background: #f8d7da; color: #721c24; }
</style>
