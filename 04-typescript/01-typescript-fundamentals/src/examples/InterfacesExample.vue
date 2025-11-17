<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Node, Document, Folder, User } from '../types/content-server'

// Create example nodes
const document = ref<Document>({
  id: 1,
  name: 'Meeting Notes.txt',
  type: 'document',
  parentId: 2,
  createdAt: '2025-01-15T10:00:00Z',
  modifiedAt: '2025-01-15T14:30:00Z',
  content: 'Notes from the quarterly meeting...',
  size: 1024,
  mimeType: 'text/plain'
})

const folder = ref<Folder>({
  id: 2,
  name: 'Documents',
  type: 'folder',
  parentId: null,
  createdAt: '2025-01-10T09:00:00Z',
  modifiedAt: '2025-01-15T14:30:00Z',
  children: [1, 3, 4]
})

const user = ref<User>({
  id: 100,
  username: 'alice',
  email: 'alice@example.com',
  permissions: ['read', 'write'],
  createdAt: '2024-12-01T00:00:00Z'
})

// Using interface properties
const documentInfo = computed(() => {
  const doc = document.value
  return {
    name: doc.name,
    size: `${(doc.size / 1024).toFixed(2)} KB`,
    type: doc.mimeType,
    modified: new Date(doc.modifiedAt).toLocaleDateString()
  }
})

// Type-safe function using interfaces
function getNodeSummary(node: Node): string {
  return `${node.type}: ${node.name} (ID: ${node.id})`
}

// Function that accepts specific interface
function formatDocument(doc: Document): string {
  return `Document "${doc.name}" (${doc.size} bytes) - ${doc.mimeType}`
}

const examples = ref<string[]>([
  getNodeSummary(document.value),
  getNodeSummary(folder.value),
  formatDocument(document.value),
  `User: ${user.value.username} (${user.value.email})`
])
</script>

<template>
  <div class="example">
    <h2>Interfaces</h2>
    <p class="description">
      Interfaces define the shape of objects. They're perfect for describing
      data structures like Content Server nodes and users.
    </p>

    <div class="section">
      <h3>Document Interface</h3>
      <div class="card">
        <div class="card-header">
          <span class="icon">📄</span>
          <strong>{{ document.name }}</strong>
        </div>
        <div class="card-body">
          <div class="property">
            <span class="key">ID:</span>
            <span class="value">{{ document.id }}</span>
          </div>
          <div class="property">
            <span class="key">Type:</span>
            <span class="value">{{ document.type }}</span>
          </div>
          <div class="property">
            <span class="key">Size:</span>
            <span class="value">{{ document.size }} bytes</span>
          </div>
          <div class="property">
            <span class="key">MIME Type:</span>
            <span class="value">{{ document.mimeType }}</span>
          </div>
          <div class="property">
            <span class="key">Parent ID:</span>
            <span class="value">{{ document.parentId }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="section">
      <h3>Folder Interface</h3>
      <div class="card">
        <div class="card-header">
          <span class="icon">📁</span>
          <strong>{{ folder.name }}</strong>
        </div>
        <div class="card-body">
          <div class="property">
            <span class="key">ID:</span>
            <span class="value">{{ folder.id }}</span>
          </div>
          <div class="property">
            <span class="key">Type:</span>
            <span class="value">{{ folder.type }}</span>
          </div>
          <div class="property">
            <span class="key">Children:</span>
            <span class="value">[{{ folder.children.join(', ') }}]</span>
          </div>
          <div class="property">
            <span class="key">Created:</span>
            <span class="value">{{ new Date(folder.createdAt).toLocaleDateString() }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="section">
      <h3>User Interface</h3>
      <div class="card">
        <div class="card-header">
          <span class="icon">👤</span>
          <strong>{{ user.username }}</strong>
        </div>
        <div class="card-body">
          <div class="property">
            <span class="key">Email:</span>
            <span class="value">{{ user.email }}</span>
          </div>
          <div class="property">
            <span class="key">Permissions:</span>
            <span class="value">{{ user.permissions.join(', ') }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="section">
      <h3>Code Example</h3>
      <div class="code-block">
        <pre><code>interface Document extends Node {
  type: 'document'
  content: string
  size: number
  mimeType: string
}

const document: Document = {
  id: 1,
  name: 'Meeting Notes.txt',
  type: 'document',
  parentId: 2,
  createdAt: '2025-01-15T10:00:00Z',
  modifiedAt: '2025-01-15T14:30:00Z',
  content: 'Notes from the quarterly meeting...',
  size: 1024,
  mimeType: 'text/plain'
}</code></pre>
      </div>
    </div>

    <div class="tips">
      <h4>💡 Interface vs Type Alias</h4>
      <ul>
        <li><strong>Interfaces:</strong> Better for object shapes, can be extended and merged</li>
        <li><strong>Type Aliases:</strong> More flexible, can represent unions, primitives, tuples</li>
        <li><strong>Best Practice:</strong> Use interfaces for objects, type aliases for unions and complex types</li>
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
  min-width: 120px;
}

.value {
  color: #6c757d;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.9rem;
}

.code-block {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 1rem;
  overflow-x: auto;
}

.code-block pre {
  margin: 0;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.85rem;
  line-height: 1.6;
  color: #2c3e50;
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

.tips strong {
  color: #1976D2;
}
</style>
