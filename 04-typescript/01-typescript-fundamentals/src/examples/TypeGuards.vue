<script setup lang="ts">
import { ref } from 'vue'
import type { AnyNode, Document, Folder, Link } from '../types/content-server'
import { isDocument, isFolder, isLink, isDefined, hasProperty } from '../types/guards'

// Example nodes
const nodes = ref<AnyNode[]>([
  {
    id: 1,
    name: 'Root',
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
  } as Document,
  {
    id: 3,
    name: 'Shortcut',
    type: 'link',
    parentId: 1,
    createdAt: '2025-01-16T11:00:00Z',
    modifiedAt: '2025-01-16T11:00:00Z',
    targetId: 10,
    targetPath: '/documents/important.txt'
  } as Link
])

// Function using type guards
function processNode(node: AnyNode): { type: string; info: string } {
  if (isDocument(node)) {
    // TypeScript knows node is Document here
    return {
      type: 'Document',
      info: `${node.size} bytes, ${node.mimeType}`
    }
  } else if (isFolder(node)) {
    // TypeScript knows node is Folder here
    return {
      type: 'Folder',
      info: `${node.children.length} items`
    }
  } else if (isLink(node)) {
    // TypeScript knows node is Link here
    return {
      type: 'Link',
      info: `Points to ${node.targetPath}`
    }
  }

  // Exhaustiveness check - ensures we handled all cases
  const _exhaustive: never = node
  return _exhaustive
}

// Typeof type guard (built-in)
function processValue(value: string | number | boolean): string {
  if (typeof value === 'string') {
    return value.toUpperCase()
  } else if (typeof value === 'number') {
    return value.toFixed(2)
  } else {
    return value ? 'TRUE' : 'FALSE'
  }
}

// Instanceof type guard (built-in)
function processError(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  return String(error)
}

// Nullable type guards
const maybeString = ref<string | null>('Hello')
const maybeNumber = ref<number | undefined>(42)

function useNullableValue() {
  if (isDefined(maybeString.value)) {
    // TypeScript knows it's string here
    return maybeString.value.toUpperCase()
  }
  return 'N/A'
}

// Property checking with type guard
interface WithMetadata {
  metadata: Record<string, unknown>
}

function getMetadataValue(node: AnyNode, key: string): unknown {
  if (hasProperty(node, 'metadata') && node.metadata) {
    return node.metadata[key]
  }
  return null
}

const processedNodes = ref(nodes.value.map(processNode))
const examples = ref([
  `typeof 'hello': ${typeof 'hello'}`,
  `typeof 42: ${typeof 42}`,
  `typeof true: ${typeof true}`,
  `processValue('hello'): ${processValue('hello')}`,
  `processValue(3.14159): ${processValue(3.14159)}`,
  `isDefined(${maybeString.value}): ${isDefined(maybeString.value)}`
])
</script>

<template>
  <div class="example">
    <h2>Type Guards</h2>
    <p class="description">
      Type guards are functions or expressions that help TypeScript narrow down types.
      They make your code type-safe when working with unions and unknown types.
    </p>

    <div class="section">
      <h3>Custom Type Guards</h3>
      <div class="code-block">
        <pre><code>function isDocument(node: AnyNode): node is Document {
  return node.type === 'document'
}

function processNode(node: AnyNode) {
  if (isDocument(node)) {
    // TypeScript knows node is Document here!
    console.log(node.size, node.mimeType)
  }
}</code></pre>
      </div>
    </div>

    <div class="section">
      <h3>Processed Nodes</h3>
      <div class="node-list">
        <div v-for="(node, index) in nodes" :key="node.id" class="node-card">
          <div :class="['node-type', node.type]">
            {{ processedNodes[index].type }}
          </div>
          <div class="node-details">
            <div class="node-name">{{ node.name }}</div>
            <div class="node-info">{{ processedNodes[index].info }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="section">
      <h3>Built-in Type Guards</h3>
      <div class="guards-grid">
        <div class="guard-card">
          <div class="guard-name">typeof</div>
          <div class="guard-desc">Check primitive types</div>
          <div class="code-block">
            <pre><code>if (typeof value === 'string') {
  value.toUpperCase()
}</code></pre>
          </div>
        </div>

        <div class="guard-card">
          <div class="guard-name">instanceof</div>
          <div class="guard-desc">Check class instances</div>
          <div class="code-block">
            <pre><code>if (error instanceof Error) {
  console.log(error.message)
}</code></pre>
          </div>
        </div>

        <div class="guard-card">
          <div class="guard-name">in operator</div>
          <div class="guard-desc">Check property existence</div>
          <div class="code-block">
            <pre><code>if ('metadata' in node) {
  console.log(node.metadata)
}</code></pre>
          </div>
        </div>

        <div class="guard-card">
          <div class="guard-name">Truthiness</div>
          <div class="guard-desc">Check null/undefined</div>
          <div class="code-block">
            <pre><code>if (value) {
  // value is not null/undefined
}</code></pre>
          </div>
        </div>
      </div>
    </div>

    <div class="section">
      <h3>Discriminated Union Pattern</h3>
      <div class="info-box">
        Using a common discriminator property (like <code>type</code>) makes type guards automatic:
      </div>
      <div class="code-block">
        <pre><code>type AnyNode = Document | Folder | Link

function getInfo(node: AnyNode): string {
  switch (node.type) {
    case 'document':
      // node is Document
      return `${node.size} bytes`
    case 'folder':
      // node is Folder
      return `${node.children.length} items`
    case 'link':
      // node is Link
      return node.targetPath
    default:
      // Exhaustiveness check
      const _exhaustive: never = node
      return _exhaustive
  }
}</code></pre>
      </div>
    </div>

    <div class="section">
      <h3>Examples</h3>
      <ul class="results">
        <li v-for="(example, index) in examples" :key="index">
          {{ example }}
        </li>
      </ul>
    </div>

    <div class="tips">
      <h4>💡 Type Guard Best Practices</h4>
      <ul>
        <li>Use <code>is</code> keyword in return type for custom type guards</li>
        <li>Leverage discriminated unions for automatic type narrowing</li>
        <li>Use <code>never</code> type for exhaustiveness checking</li>
        <li>Prefer type guards over type assertions (<code>as</code>)</li>
        <li>Keep type guard logic simple and focused</li>
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

.code-block code {
  background: #e9ecef;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 0.9em;
}

.node-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
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

.node-type {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  min-width: 100px;
  text-align: center;
}

.node-type.folder {
  background: #fff3cd;
  color: #856404;
}

.node-type.document {
  background: #d1ecf1;
  color: #0c5460;
}

.node-type.link {
  background: #f8d7da;
  color: #721c24;
}

.node-details {
  flex: 1;
}

.node-name {
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.25rem;
  font-size: 1.05rem;
}

.node-info {
  color: #6c757d;
  font-size: 0.9rem;
}

.guards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.guard-card {
  background: white;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  padding: 1rem;
  transition: all 0.2s;
}

.guard-card:hover {
  border-color: #667eea;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.2);
}

.guard-name {
  font-weight: 600;
  color: #667eea;
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
}

.guard-desc {
  color: #6c757d;
  font-size: 0.9rem;
  margin-bottom: 0.75rem;
}

.info-box {
  background: #e7f3ff;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  border-left: 4px solid #2196F3;
  color: #2c3e50;
}

.info-box code {
  background: #bbdefb;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 0.9em;
}

.results {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
  list-style: none;
}

.results li {
  padding: 0.5rem 0;
  border-bottom: 1px solid #e9ecef;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.9rem;
  color: #2c3e50;
}

.results li:last-child {
  border-bottom: none;
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
