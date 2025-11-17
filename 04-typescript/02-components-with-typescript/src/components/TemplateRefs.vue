<script setup lang="ts">
import { ref, onMounted } from 'vue'
import NodeCard from './examples/NodeCard.vue'
import type { Node } from '../types'

// Template ref to DOM element
const inputRef = ref<HTMLInputElement | null>(null)
const divRef = ref<HTMLDivElement | null>(null)

// Template ref to component instance
const cardRef = ref<InstanceType<typeof NodeCard> | null>(null)

const node: Node = {
  id: 1,
  name: 'Example.txt',
  type: 'document',
  parentId: null,
  createdAt: '2025-01-15T10:00:00Z',
  modifiedAt: '2025-01-15T14:30:00Z'
}

onMounted(() => {
  // Access DOM element methods
  if (inputRef.value) {
    inputRef.value.focus()
  }

  // Access component instance (if component exposes props/methods via defineExpose)
  console.log('Component ref:', cardRef.value)
})

const focusInput = () => {
  inputRef.value?.focus()
}

const logDivContent = () => {
  console.log('Div content:', divRef.value?.textContent)
}
</script>

<template>
  <div class="example">
    <h2>Template Refs</h2>
    <p class="description">
      Type template refs to access DOM elements and component instances safely.
    </p>

    <div class="section">
      <h3>Code Example</h3>
      <div class="code-block">
        <pre><code>// DOM element ref
const inputRef = ref&lt;HTMLInputElement | null&gt;(null)

// Component instance ref
const cardRef = ref&lt;InstanceType&lt;typeof NodeCard&gt; | null&gt;(null)

onMounted(() => {
  inputRef.value?.focus()
})</code></pre>
      </div>
    </div>

    <div class="section">
      <h3>Live Examples</h3>

      <div class="demo-card">
        <h4>Input Ref</h4>
        <input ref="inputRef" type="text" placeholder="This will auto-focus" />
        <button @click="focusInput">Focus Input</button>
      </div>

      <div class="demo-card">
        <h4>Div Ref</h4>
        <div ref="divRef" class="content-div">
          This is some content in a div
        </div>
        <button @click="logDivContent">Log Content (check console)</button>
      </div>

      <div class="demo-card">
        <h4>Component Ref</h4>
        <NodeCard ref="cardRef" :node="node" />
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
.demo-card input { width: 100%; padding: 0.5rem; margin: 0.5rem 0; border: 2px solid #e9ecef; border-radius: 4px; }
.demo-card button { margin-top: 0.5rem; padding: 0.5rem 1rem; background: #667eea; color: white; border: none; border-radius: 4px; cursor: pointer; }
.content-div { padding: 1rem; background: white; border-radius: 4px; margin: 0.5rem 0; }
</style>
