<script setup lang="ts">
import { computed } from 'vue'
import NodeCard from './examples/NodeCard.vue'
import type { Node } from '../types'

// Create sample nodes
const nodes: Node[] = [
  {
    id: 1,
    name: 'Documents',
    type: 'folder',
    parentId: null,
    createdAt: '2025-01-10T09:00:00Z',
    modifiedAt: '2025-01-10T09:00:00Z'
  },
  {
    id: 2,
    name: 'Report.pdf',
    type: 'document',
    parentId: 1,
    createdAt: '2025-01-15T10:00:00Z',
    modifiedAt: '2025-01-15T14:30:00Z'
  },
  {
    id: 3,
    name: 'Images',
    type: 'folder',
    parentId: 1,
    createdAt: '2025-01-12T11:00:00Z',
    modifiedAt: '2025-01-12T11:00:00Z',
    metadata: { tags: ['media', 'assets'] }
  }
]
</script>

<template>
  <div class="example">
    <h2>Typed Props</h2>
    <p class="description">
      Use <code>defineProps&lt;T&gt;()</code> for type-safe props.
      TypeScript validates that components receive the correct prop types.
    </p>

    <div class="section">
      <h3>Example: NodeCard Component</h3>
      <div class="code-block">
        <pre><code>// Define props interface
interface Props {
  node: Node
  selectable?: boolean
  variant?: 'default' | 'compact' | 'detailed'
}

// Use with defineProps
const props = defineProps&lt;Props&gt;()

// Or with defaults
const props = withDefaults(defineProps&lt;Props&gt;(), {
  selectable: false,
  variant: 'default'
})</code></pre>
      </div>
    </div>

    <div class="section">
      <h3>Live Examples</h3>
      <div class="cards-grid">
        <NodeCard
          v-for="node in nodes"
          :key="node.id"
          :node="node"
          :selectable="true"
          variant="default"
        />
      </div>
    </div>

    <div class="tips">
      <h4>💡 Props Best Practices</h4>
      <ul>
        <li>Always define an interface for props</li>
        <li>Use optional properties (<code>?</code>) for non-required props</li>
        <li>Use <code>withDefaults()</code> for default values</li>
        <li>Prefer union types for variants (e.g., <code>'default' | 'compact'</code>)</li>
        <li>Document complex prop types with JSDoc comments</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.example {
  padding: 1rem;
}

h2 {
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.description {
  color: #7f8c8d;
  margin-bottom: 2rem;
  font-size: 1.05rem;
}

.description code {
  background: #f8f9fa;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 0.9em;
}

.section {
  margin-bottom: 2rem;
}

.section h3 {
  color: #34495e;
  margin-bottom: 1rem;
  font-size: 1.3rem;
}

.code-block {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 1rem;
  overflow-x: auto;
  margin-bottom: 1rem;
}

.code-block pre {
  margin: 0;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.85rem;
  line-height: 1.6;
  color: #2c3e50;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
}

.tips {
  background: #e7f3ff;
  border-left: 4px solid #2196F3;
  padding: 1rem 1.5rem;
  border-radius: 4px;
}

.tips h4 {
  color: #1976D2;
  margin-bottom: 0.5rem;
}

.tips ul {
  margin-left: 1.5rem;
  color: #2c3e50;
}

.tips li {
  margin: 0.5rem 0;
  line-height: 1.6;
}

.tips code {
  background: #bbdefb;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 0.85em;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
}
</style>
