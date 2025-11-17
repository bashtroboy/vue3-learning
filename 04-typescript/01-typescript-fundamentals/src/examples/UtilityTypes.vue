<script setup lang="ts">
import { ref } from 'vue'
import type { Node, Document } from '../types/content-server'

// Partial<T> - Makes all properties optional
type PartialNode = Partial<Node>
const partialUpdate: PartialNode = {
  name: 'Updated name'
  // Other properties are optional
}

// Required<T> - Makes all properties required
type Config = {
  apiUrl?: string
  timeout?: number
  debug?: boolean
}
type RequiredConfig = Required<Config>
const config: RequiredConfig = {
  apiUrl: 'https://api.example.com',
  timeout: 5000,
  debug: true
}

// Pick<T, K> - Pick specific properties
type NodeSummary = Pick<Node, 'id' | 'name' | 'type'>
const summary: NodeSummary = {
  id: 1,
  name: 'Document.txt',
  type: 'document'
}

// Omit<T, K> - Omit specific properties
type NodeWithoutDates = Omit<Node, 'createdAt' | 'modifiedAt'>
const nodeData: NodeWithoutDates = {
  id: 2,
  name: 'Folder',
  type: 'folder',
  parentId: null
}

// Readonly<T> - Makes all properties readonly
type ReadonlyNode = Readonly<Node>
const immutableNode: ReadonlyNode = {
  id: 1,
  name: 'Immutable',
  type: 'document',
  parentId: null,
  createdAt: '2025-01-15T10:00:00Z',
  modifiedAt: '2025-01-15T10:00:00Z'
}
// immutableNode.name = 'New name' // Error!

// Record<K, T> - Object with specific key and value types
type NodeMap = Record<number, Node>
const nodeMap: NodeMap = {
  1: {
    id: 1,
    name: 'First',
    type: 'folder',
    parentId: null,
    createdAt: '2025-01-15T10:00:00Z',
    modifiedAt: '2025-01-15T10:00:00Z'
  },
  2: {
    id: 2,
    name: 'Second',
    type: 'document',
    parentId: 1,
    createdAt: '2025-01-15T10:00:00Z',
    modifiedAt: '2025-01-15T10:00:00Z'
  }
}

// Exclude<T, U> - Exclude types from union
type NodeTypeNoLink = Exclude<'folder' | 'document' | 'link', 'link'>
const validType: NodeTypeNoLink = 'folder' // 'folder' or 'document', not 'link'

// Extract<T, U> - Extract types from union
type DocumentOrLink = Extract<'folder' | 'document' | 'link', 'document' | 'link'>
const extracted: DocumentOrLink = 'document' // 'document' or 'link'

// NonNullable<T> - Remove null and undefined
type NullableString = string | null | undefined
type DefiniteString = NonNullable<NullableString>
const definite: DefiniteString = 'hello' // Cannot be null or undefined

// ReturnType<T> - Get return type of function
function getNode(): Node {
  return {
    id: 1,
    name: 'Test',
    type: 'document',
    parentId: null,
    createdAt: '2025-01-15T10:00:00Z',
    modifiedAt: '2025-01-15T10:00:00Z'
  }
}
type GetNodeReturn = ReturnType<typeof getNode> // Node

// Parameters<T> - Get parameter types of function
function createNode(name: string, type: 'folder' | 'document', parentId?: number): Node {
  return {
    id: Math.random(),
    name,
    type,
    parentId: parentId || null,
    createdAt: new Date().toISOString(),
    modifiedAt: new Date().toISOString()
  }
}
type CreateNodeParams = Parameters<typeof createNode>
// [string, 'folder' | 'document', number | undefined]

const utilityExamples = ref([
  { name: 'Partial<Node>', desc: 'All properties optional', value: JSON.stringify(partialUpdate, null, 2) },
  { name: 'Required<Config>', desc: 'All properties required', value: JSON.stringify(config, null, 2) },
  { name: 'Pick<Node, "id" | "name" | "type">', desc: 'Selected properties only', value: JSON.stringify(summary, null, 2) },
  { name: 'Omit<Node, "createdAt" | "modifiedAt">', desc: 'Exclude specific properties', value: JSON.stringify(nodeData, null, 2) },
  { name: 'Record<number, Node>', desc: 'Map of IDs to Nodes', value: `{ 1: {...}, 2: {...} }` },
  { name: 'Readonly<Node>', desc: 'Immutable node', value: 'Cannot modify properties' }
])
</script>

<template>
  <div class="example">
    <h2>Utility Types</h2>
    <p class="description">
      TypeScript provides built-in utility types for common type transformations.
      These save you from writing repetitive type definitions.
    </p>

    <div class="section">
      <h3>Common Utility Types</h3>
      <div class="utility-grid">
        <div v-for="(util, index) in utilityExamples" :key="index" class="utility-card">
          <div class="utility-header">
            <code>{{ util.name }}</code>
          </div>
          <div class="utility-body">
            <p class="utility-desc">{{ util.desc }}</p>
            <div class="utility-example" v-if="util.value.includes('{')">
              <pre>{{ util.value }}</pre>
            </div>
            <div v-else class="utility-note">
              {{ util.value }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="section">
      <h3>Code Examples</h3>
      <div class="code-block">
        <pre><code>// Partial - Update partial properties
type PartialNode = Partial&lt;Node&gt;
const update: PartialNode = { name: 'New name' }

// Pick - Select specific properties
type NodeSummary = Pick&lt;Node, 'id' | 'name' | 'type'&gt;

// Omit - Exclude specific properties
type CreateNodeData = Omit&lt;Node, 'id' | 'createdAt' | 'modifiedAt'&gt;

// Record - Type-safe maps
type NodeMap = Record&lt;number, Node&gt;
const nodes: NodeMap = {
  1: { id: 1, name: 'First', ... },
  2: { id: 2, name: 'Second', ... }
}

// ReturnType - Extract function return type
function getNodes(): Node[] { ... }
type NodesArray = ReturnType&lt;typeof getNodes&gt; // Node[]</code></pre>
      </div>
    </div>

    <div class="section">
      <h3>Practical Example: Form Data</h3>
      <div class="card">
        <div class="card-header">
          <span class="icon">📝</span>
          <strong>Creating a Node (Omit ID & Timestamps)</strong>
        </div>
        <div class="card-body">
          <div class="code-block">
            <pre><code>type CreateNodeInput = Omit&lt;Node, 'id' | 'createdAt' | 'modifiedAt'&gt;

const newNode: CreateNodeInput = {
  name: 'New Document',
  type: 'document',
  parentId: 1,
  metadata: { tags: ['important'] }
}</code></pre>
          </div>
        </div>
      </div>
    </div>

    <div class="section">
      <h3>Practical Example: Updating Data</h3>
      <div class="card">
        <div class="card-header">
          <span class="icon">✏️</span>
          <strong>Partial Updates</strong>
        </div>
        <div class="card-body">
          <div class="code-block">
            <pre><code>function updateNode(id: number, data: Partial&lt;Node&gt;): Node {
  const existingNode = getNode(id)
  return { ...existingNode, ...data }
}

// Only update the name
updateNode(1, { name: 'Updated Name' })</code></pre>
          </div>
        </div>
      </div>
    </div>

    <div class="tips">
      <h4>💡 Most Useful Utility Types</h4>
      <ul>
        <li><code>Partial&lt;T&gt;</code> - For update operations where not all fields are provided</li>
        <li><code>Pick&lt;T, K&gt;</code> - For creating summary or preview types</li>
        <li><code>Omit&lt;T, K&gt;</code> - For create operations (exclude id, timestamps)</li>
        <li><code>Record&lt;K, T&gt;</code> - For dictionaries and maps</li>
        <li><code>Required&lt;T&gt;</code> - When you need all properties to be mandatory</li>
        <li><code>Readonly&lt;T&gt;</code> - For immutable data structures</li>
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

.section {
  margin-bottom: 2rem;
}

.section h3 {
  color: #34495e;
  margin-bottom: 1rem;
  font-size: 1.3rem;
}

.utility-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
}

.utility-card {
  background: white;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.2s;
}

.utility-card:hover {
  border-color: #667eea;
  box-shadow: 0 4px 8px rgba(102, 126, 234, 0.2);
}

.utility-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0.75rem 1rem;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.85rem;
}

.utility-body {
  padding: 1rem;
}

.utility-desc {
  color: #6c757d;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.utility-example {
  background: #f8f9fa;
  padding: 0.5rem;
  border-radius: 4px;
  overflow-x: auto;
}

.utility-example pre {
  margin: 0;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.75rem;
  color: #2c3e50;
  line-height: 1.4;
}

.utility-note {
  background: #fff3cd;
  padding: 0.5rem;
  border-radius: 4px;
  font-size: 0.85rem;
  color: #856404;
  font-style: italic;
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

.card {
  background: #ffffff;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 1rem;
}

.card-header {
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
  color: white;
  padding: 1rem;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.icon {
  font-size: 1.5rem;
}

.card-body {
  padding: 1rem;
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
