<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import type { Node } from '../types'

// Typed ref
const count = ref<number>(0)
const message = ref<string>('Hello')

// Typed ref with interface
const node = ref<Node>({
  id: 1,
  name: 'Document.txt',
  type: 'document',
  parentId: null,
  createdAt: '2025-01-15T10:00:00Z',
  modifiedAt: '2025-01-15T14:30:00Z'
})

// Typed ref with union
const status = ref<'idle' | 'loading' | 'success' | 'error'>('idle')

// Typed reactive
interface State {
  nodes: Node[]
  selectedId: number | null
  filter: string
}

const state = reactive<State>({
  nodes: [
    { id: 1, name: 'Folder 1', type: 'folder', parentId: null, createdAt: '', modifiedAt: '' },
    { id: 2, name: 'Doc 1', type: 'document', parentId: 1, createdAt: '', modifiedAt: '' }
  ],
  selectedId: null,
  filter: ''
})

// Typed computed
const doubleCount = computed<number>(() => count.value * 2)
const filteredNodes = computed<Node[]>(() => {
  return state.nodes.filter(n => n.name.includes(state.filter))
})

const increment = () => count.value++
const simulateLoading = () => {
  status.value = 'loading'
  setTimeout(() => { status.value = 'success' }, 1000)
}
</script>

<template>
  <div class="example">
    <h2>Typed Refs & Computed</h2>
    <p class="description">
      Type your reactive state for full type safety.
    </p>

    <div class="section">
      <h3>Code Examples</h3>
      <div class="code-block">
        <pre><code>// Typed ref
const count = ref&lt;number&gt;(0)
const message = ref&lt;string&gt;('Hello')

// Typed ref with interface
const node = ref&lt;Node&gt;({ ... })

// Typed reactive
interface State {
  nodes: Node[]
  selectedId: number | null
}

const state = reactive&lt;State&gt;({
  nodes: [],
  selectedId: null
})

// Typed computed
const doubled = computed&lt;number&gt;(() => count.value * 2)</code></pre>
      </div>
    </div>

    <div class="section">
      <h3>Live Examples</h3>

      <div class="demo-card">
        <h4>Counter</h4>
        <p>Count: {{ count }} (Double: {{ doubleCount }})</p>
        <button @click="increment">Increment</button>
      </div>

      <div class="demo-card">
        <h4>Status</h4>
        <p>Current: <span :class="'status-' + status">{{ status }}</span></p>
        <button @click="simulateLoading">Simulate Loading</button>
      </div>

      <div class="demo-card">
        <h4>Filtered Nodes</h4>
        <input v-model="state.filter" placeholder="Filter nodes..." />
        <ul>
          <li v-for="node in filteredNodes" :key="node.id">{{ node.name }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.example { padding: 1rem; }
h2 { color: #2c3e50; margin-bottom: 0.5rem; }
.description { color: #7f8c8d; margin-bottom: 2rem; font-size: 1.05rem; }
.section { margin-bottom: 2rem; }
.section h3 { color: #34495e; margin-bottom: 1rem; }
.code-block { background: #f8f9fa; border: 1px solid #e9ecef; border-radius: 8px; padding: 1rem; overflow-x: auto; }
.code-block pre { margin: 0; font-family: Monaco, monospace; font-size: 0.85rem; line-height: 1.6; }
.demo-card { background: #f8f9fa; padding: 1rem; border-radius: 8px; margin-bottom: 1rem; }
.demo-card h4 { margin-bottom: 0.5rem; }
.demo-card button { margin-top: 0.5rem; padding: 0.5rem 1rem; background: #667eea; color: white; border: none; border-radius: 4px; cursor: pointer; }
.demo-card input { width: 100%; padding: 0.5rem; margin: 0.5rem 0; border: 2px solid #e9ecef; border-radius: 4px; }
.status-idle { color: #6c757d; }
.status-loading { color: #ffc107; }
.status-success { color: #28a745; }
.status-error { color: #dc3545; }
</style>
