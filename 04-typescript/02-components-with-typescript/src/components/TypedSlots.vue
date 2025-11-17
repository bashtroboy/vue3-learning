<script setup lang="ts">
import { ref } from 'vue'
import GenericComponent from './GenericComponent.vue'
import type { Node, User } from '../types'

const nodes = ref<Node[]>([
  { id: 1, name: 'Documents', type: 'folder', parentId: null, createdAt: '', modifiedAt: '' },
  { id: 2, name: 'Report.pdf', type: 'document', parentId: 1, createdAt: '', modifiedAt: '' }
])

const users = ref<User[]>([
  { id: 1, username: 'alice', email: 'alice@example.com', role: 'admin' },
  { id: 2, username: 'bob', email: 'bob@example.com', role: 'user' }
])

const selectedNodeId = ref<number>()
const selectedUserId = ref<number>()

const handleNodeSelect = (node: Node) => {
  selectedNodeId.value = node.id
  console.log('Selected node:', node)
}

const handleUserSelect = (user: User) => {
  selectedUserId.value = user.id
  console.log('Selected user:', user)
}
</script>

<template>
  <div class="example">
    <h2>Generic Components & Typed Slots</h2>
    <p class="description">
      Create reusable generic components that work with any type.
    </p>

    <div class="section">
      <h3>Code Example</h3>
      <div class="code-block">
        <pre><code>// Generic component definition
&lt;script setup lang="ts" generic="T extends { id: number }"&gt;
interface Props {
  items: T[]
  selectedId?: number
}

const props = defineProps&lt;Props&gt;()
const emit = defineEmits&lt;{
  select: [item: T]
}&gt;()
&lt;/script&gt;</code></pre>
      </div>
    </div>

    <div class="section">
      <h3>Generic List with Nodes</h3>
      <GenericComponent
        :items="nodes"
        :selected-id="selectedNodeId"
        @select="handleNodeSelect"
      >
        <template #item="{ item }">
          <div class="node-item">
            <strong>{{ item.name }}</strong>
            <span class="badge">{{ item.type }}</span>
          </div>
        </template>
      </GenericComponent>
    </div>

    <div class="section">
      <h3>Generic List with Users</h3>
      <GenericComponent
        :items="users"
        :selected-id="selectedUserId"
        @select="handleUserSelect"
      >
        <template #item="{ item }">
          <div class="user-item">
            <strong>{{ item.username }}</strong>
            <span class="email">{{ item.email }}</span>
            <span :class="['role-badge', item.role]">{{ item.role }}</span>
          </div>
        </template>
      </GenericComponent>
    </div>
  </div>
</template>

<style scoped>
.example { padding: 1rem; }
h2 { color: #2c3e50; margin-bottom: 0.5rem; }
.description { color: #7f8c8d; margin-bottom: 2rem; }
.section { margin-bottom: 2rem; }
.section h3 { color: #34495e; margin-bottom: 1rem; }
.code-block { background: #f8f9fa; border: 1px solid #e9ecef; border-radius: 8px; padding: 1rem; overflow-x: auto; }
.code-block pre { margin: 0; font-family: Monaco, monospace; font-size: 0.85rem; line-height: 1.6; }
.node-item, .user-item { display: flex; align-items: center; gap: 1rem; }
.badge, .role-badge { padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; }
.badge { background: #e7f3ff; color: #1976D2; }
.role-badge.admin { background: #f8d7da; color: #721c24; }
.role-badge.user { background: #d4edda; color: #155724; }
.email { color: #6c757d; font-size: 0.85rem; }
</style>
