<script setup lang="ts">
import { ref } from 'vue'
import type { NodeType, Permission, AnyNode, AuditedNode, Document, Folder } from '../types/content-server'

// Union Types - value can be one of several types
type Status = 'idle' | 'loading' | 'success' | 'error'
const status = ref<Status>('idle')

type StringOrNumber = string | number
const value1: StringOrNumber = 'hello'
const value2: StringOrNumber = 42

// Intersection Types - combine multiple types
type Person = {
  name: string
  age: number
}

type Employee = {
  employeeId: number
  department: string
}

type EmployeePerson = Person & Employee

const employee: EmployeePerson = {
  name: 'Alice',
  age: 30,
  employeeId: 12345,
  department: 'Engineering'
}

// Discriminated Unions - unions with a common discriminator property
const nodes = ref<AnyNode[]>([
  {
    id: 1,
    name: 'Documents',
    type: 'folder',
    parentId: null,
    createdAt: '2025-01-10T09:00:00Z',
    modifiedAt: '2025-01-10T09:00:00Z',
    children: [2, 3]
  } as Folder,
  {
    id: 2,
    name: 'Report.pdf',
    type: 'document',
    parentId: 1,
    createdAt: '2025-01-15T10:00:00Z',
    modifiedAt: '2025-01-15T14:30:00Z',
    content: 'Report content...',
    size: 2048,
    mimeType: 'application/pdf'
  } as Document
])

// Function using discriminated union
function getNodeDescription(node: AnyNode): string {
  switch (node.type) {
    case 'folder':
      return `Folder with ${node.children.length} items`
    case 'document':
      return `Document (${node.size} bytes, ${node.mimeType})`
    case 'link':
      return `Link to ${node.targetPath}`
    default:
      // Exhaustiveness checking
      const _exhaustive: never = node
      return _exhaustive
  }
}

// Intersection example with Node
const auditedDocument = ref<AuditedNode>({
  id: 1,
  name: 'Audited Doc',
  type: 'document',
  parentId: null,
  createdAt: '2025-01-15T10:00:00Z',
  modifiedAt: '2025-01-15T14:30:00Z',
  createdBy: 100,
  modifiedBy: 101,
  version: 3
})

// Union with null (nullable types)
type NullableString = string | null
const maybeString = ref<NullableString>(null)

// Union with undefined (optional types)
type MaybeNumber = number | undefined
const maybeNumber = ref<MaybeNumber>(undefined)

const examples = [
  `Status: ${status.value}`,
  `StringOrNumber: '${value1}' or ${value2}`,
  `Employee: ${employee.name} (${employee.department})`,
  `Nodes: ${nodes.value.length} items`,
  `Audited: v${auditedDocument.value.version} by user ${auditedDocument.value.modifiedBy}`
]
</script>

<template>
  <div class="example">
    <h2>Unions & Intersections</h2>
    <p class="description">
      Union types represent values that can be one of several types.
      Intersection types combine multiple types into one.
    </p>

    <div class="section">
      <h3>Union Types (OR)</h3>
      <div class="code-block">
        <pre><code>type Status = 'idle' | 'loading' | 'success' | 'error'
type StringOrNumber = string | number
type NodeType = 'folder' | 'document' | 'link'

const status: Status = 'loading'
const value: StringOrNumber = 42</code></pre>
      </div>
      <div class="info-box union">
        <strong>Union:</strong> A value can be <em>any one</em> of the specified types
      </div>
    </div>

    <div class="section">
      <h3>Intersection Types (AND)</h3>
      <div class="code-block">
        <pre><code>type Person = { name: string; age: number }
type Employee = { employeeId: number; department: string }
type EmployeePerson = Person & Employee

const emp: EmployeePerson = {
  name: 'Alice',
  age: 30,
  employeeId: 12345,
  department: 'Engineering'
}</code></pre>
      </div>
      <div class="info-box intersection">
        <strong>Intersection:</strong> A value must have <em>all</em> properties from all types
      </div>
      <div class="card">
        <div class="card-body">
          <div class="property">
            <span class="key">Name:</span>
            <span class="value">{{ employee.name }}</span>
          </div>
          <div class="property">
            <span class="key">Age:</span>
            <span class="value">{{ employee.age }}</span>
          </div>
          <div class="property">
            <span class="key">Employee ID:</span>
            <span class="value">{{ employee.employeeId }}</span>
          </div>
          <div class="property">
            <span class="key">Department:</span>
            <span class="value">{{ employee.department }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="section">
      <h3>Discriminated Unions</h3>
      <div class="info-box">
        Unions with a common "discriminator" property for type narrowing
      </div>
      <div class="node-list">
        <div v-for="node in nodes" :key="node.id" class="node-card">
          <div :class="['node-icon', node.type]">
            {{ node.type === 'folder' ? '📁' : '📄' }}
          </div>
          <div class="node-info">
            <div class="node-name">{{ node.name }}</div>
            <div class="node-desc">{{ getNodeDescription(node) }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="section">
      <h3>Audited Node (Intersection)</h3>
      <div class="card">
        <div class="card-header">
          <span class="icon">📋</span>
          <strong>{{ auditedDocument.name }}</strong>
        </div>
        <div class="card-body">
          <div class="property">
            <span class="key">Version:</span>
            <span class="value">{{ auditedDocument.version }}</span>
          </div>
          <div class="property">
            <span class="key">Created By:</span>
            <span class="value">User #{{ auditedDocument.createdBy }}</span>
          </div>
          <div class="property">
            <span class="key">Modified By:</span>
            <span class="value">User #{{ auditedDocument.modifiedBy }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="tips">
      <h4>💡 When to Use</h4>
      <ul>
        <li><strong>Unions:</strong> When a value can be one of several types (status, ID types)</li>
        <li><strong>Intersections:</strong> When combining properties from multiple types (mixins, extensions)</li>
        <li><strong>Discriminated Unions:</strong> For type-safe polymorphism (different node types)</li>
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
  border-left: 4px solid #6c757d;
}

.info-box.union {
  background: #fff3cd;
  border-left-color: #ffc107;
}

.info-box.intersection {
  background: #d1ecf1;
  border-left-color: #17a2b8;
}

.info-box strong {
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

.node-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.node-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: white;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  transition: all 0.2s;
}

.node-card:hover {
  border-color: #667eea;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.2);
}

.node-icon {
  font-size: 2rem;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
}

.node-icon.folder {
  background: #fff3cd;
}

.node-icon.document {
  background: #d1ecf1;
}

.node-info {
  flex: 1;
}

.node-name {
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.25rem;
}

.node-desc {
  color: #6c757d;
  font-size: 0.9rem;
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
