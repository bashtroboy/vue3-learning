<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Node, Document, ApiResponse } from '../types/content-server'
import { DataStore, QueryBuilder } from '../types/generics'

// Generic function examples
function identity<T>(value: T): T {
  return value
}

function wrapInArray<T>(value: T): T[] {
  return [value]
}

function first<T>(arr: T[]): T | undefined {
  return arr[0]
}

// Using generics with Node types
const nodeStore = new DataStore<Node>()

// Add some nodes
nodeStore.add({
  id: 1,
  name: 'Root Folder',
  type: 'folder',
  parentId: null,
  createdAt: '2025-01-10T09:00:00Z',
  modifiedAt: '2025-01-10T09:00:00Z'
})

nodeStore.add({
  id: 2,
  name: 'Document 1',
  type: 'document',
  parentId: 1,
  createdAt: '2025-01-15T10:00:00Z',
  modifiedAt: '2025-01-15T14:30:00Z'
})

nodeStore.add({
  id: 3,
  name: 'Document 2',
  type: 'document',
  parentId: 1,
  createdAt: '2025-01-16T11:00:00Z',
  modifiedAt: '2025-01-16T11:00:00Z'
})

// Generic API response
const documentResponse = ref<ApiResponse<Document>>({
  success: true,
  data: {
    id: 1,
    name: 'Example.txt',
    type: 'document',
    parentId: null,
    createdAt: '2025-01-15T10:00:00Z',
    modifiedAt: '2025-01-15T14:30:00Z',
    content: 'Example content',
    size: 256,
    mimeType: 'text/plain'
  },
  error: null,
  timestamp: new Date().toISOString()
})

const errorResponse = ref<ApiResponse<Node>>({
  success: false,
  data: null,
  error: 'Node not found',
  timestamp: new Date().toISOString()
})

// QueryBuilder example
const allNodes = nodeStore.getAll()
const queryBuilder = new QueryBuilder<Node>()
const filteredNodes = queryBuilder
  .where(node => node.type === 'document')
  .sort((a, b) => a.name.localeCompare(b.name))
  .limit(10)
  .execute(allNodes)

const examples = ref<string[]>([])

onMounted(() => {
  examples.value = [
    `identity<string>('hello') = ${identity<string>('hello')}`,
    `identity<number>(42) = ${identity<number>(42)}`,
    `wrapInArray<string>('test') = [${wrapInArray<string>('test')}]`,
    `first<number>([1, 2, 3]) = ${first<number>([1, 2, 3])}`,
    `DataStore has ${nodeStore.getAll().length} nodes`,
    `Filtered: ${filteredNodes.length} documents found`
  ]
})
</script>

<template>
  <div class="example">
    <h2>Generics</h2>
    <p class="description">
      Generics allow you to write reusable, type-safe code that works with any type.
      They're like placeholders for types that get filled in when you use them.
    </p>

    <div class="section">
      <h3>Generic Functions</h3>
      <div class="code-block">
        <pre><code>function identity&lt;T&gt;(value: T): T {
  return value
}

// TypeScript infers the type
const str = identity('hello')  // string
const num = identity(42)       // number

// Or specify explicitly
const result = identity&lt;string&gt;('hello')</code></pre>
      </div>
      <div class="results">
        <li v-for="(example, i) in examples.slice(0, 4)" :key="i">{{ example }}</li>
      </div>
    </div>

    <div class="section">
      <h3>Generic DataStore&lt;T&gt;</h3>
      <div class="info-box">
        <p>A DataStore that works with any type that has an <code>id</code> property:</p>
      </div>
      <div class="card">
        <div class="card-header">
          <span class="icon">🗄️</span>
          <strong>DataStore&lt;Node&gt;</strong>
        </div>
        <div class="card-body">
          <div class="property" v-for="node in nodeStore.getAll()" :key="node.id">
            <span class="key">{{ node.type }}:</span>
            <span class="value">{{ node.name }} (ID: {{ node.id }})</span>
          </div>
        </div>
      </div>
    </div>

    <div class="section">
      <h3>Generic API Response</h3>
      <div class="response-grid">
        <div class="card">
          <div class="card-header success">
            <span class="icon">✅</span>
            <strong>Success Response</strong>
          </div>
          <div class="card-body">
            <div class="property">
              <span class="key">Success:</span>
              <span class="value">{{ documentResponse.success }}</span>
            </div>
            <div class="property">
              <span class="key">Data:</span>
              <span class="value">{{ documentResponse.data?.name }}</span>
            </div>
            <div class="property">
              <span class="key">Error:</span>
              <span class="value">{{ documentResponse.error || 'null' }}</span>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-header error">
            <span class="icon">❌</span>
            <strong>Error Response</strong>
          </div>
          <div class="card-body">
            <div class="property">
              <span class="key">Success:</span>
              <span class="value">{{ errorResponse.success }}</span>
            </div>
            <div class="property">
              <span class="key">Data:</span>
              <span class="value">{{ errorResponse.data || 'null' }}</span>
            </div>
            <div class="property">
              <span class="key">Error:</span>
              <span class="value">{{ errorResponse.error }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="section">
      <h3>Generic QueryBuilder</h3>
      <div class="code-block">
        <pre><code>const query = new QueryBuilder&lt;Node&gt;()
  .where(node => node.type === 'document')
  .sort((a, b) => a.name.localeCompare(b.name))
  .limit(10)
  .execute(allNodes)</code></pre>
      </div>
      <div class="results">
        <li v-for="node in filteredNodes" :key="node.id">
          {{ node.name }} ({{ node.type }})
        </li>
      </div>
    </div>

    <div class="tips">
      <h4>💡 When to Use Generics</h4>
      <ul>
        <li>Data structures that work with multiple types (arrays, maps, stores)</li>
        <li>API responses with different data types</li>
        <li>Utility functions that should work with any type</li>
        <li>When you want type safety without repeating code</li>
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

.info-box {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.info-box code {
  background: #e9ecef;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 0.9em;
}

.card {
  background: #ffffff;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 1rem;
}

.card-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.card-header.success {
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
}

.card-header.error {
  background: linear-gradient(135deg, #eb3349 0%, #f45c43 100%);
}

.icon {
  font-size: 1.5rem;
}

.card-body {
  padding: 1rem;
}

.property {
  display: flex;
  padding: 0.5rem 0;
  border-bottom: 1px solid #f8f9fa;
}

.property:last-child {
  border-bottom: none;
}

.key {
  font-weight: 600;
  color: #495057;
  min-width: 100px;
}

.value {
  color: #6c757d;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.9rem;
}

.results {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1rem;
  list-style: none;
}

.results li {
  padding: 0.5rem;
  border-bottom: 1px solid #e9ecef;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.9rem;
}

.results li:last-child {
  border-bottom: none;
}

.response-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
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
</style>
