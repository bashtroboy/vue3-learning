<script setup lang="ts">
import { computed } from 'vue'
import type { Node } from '../../types'

// Define props interface
interface Props {
  node: Node
  selectable?: boolean
  variant?: 'default' | 'compact' | 'detailed'
}

// Use defineProps with defaults
const props = withDefaults(defineProps<Props>(), {
  selectable: false,
  variant: 'default'
})

// Define emits (we'll use this in the next section)
const emit = defineEmits<{
  select: [nodeId: number]
  open: [node: Node]
}>()

const icon = computed(() => {
  switch (props.node.type) {
    case 'folder':
      return '📁'
    case 'document':
      return '📄'
    case 'link':
      return '🔗'
    default:
      return '📎'
  }
})

const formattedDate = computed(() => {
  return new Date(props.node.modifiedAt).toLocaleDateString()
})

const handleClick = () => {
  if (props.selectable) {
    emit('select', props.node.id)
  }
  emit('open', props.node)
}
</script>

<template>
  <div :class="['node-card', variant, { selectable }]" @click="handleClick">
    <div class="node-icon">{{ icon }}</div>
    <div class="node-content">
      <div class="node-name">{{ node.name }}</div>
      <div class="node-meta">
        <span class="node-type">{{ node.type }}</span>
        <span class="node-date">{{ formattedDate }}</span>
      </div>
      <div v-if="node.metadata && variant === 'detailed'" class="node-metadata">
        <div v-for="(value, key) in node.metadata" :key="key" class="metadata-item">
          <strong>{{ key }}:</strong> {{ JSON.stringify(value) }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.node-card {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: white;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  transition: all 0.2s;
}

.node-card.selectable {
  cursor: pointer;
}

.node-card.selectable:hover {
  border-color: #667eea;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.2);
}

.node-card.compact {
  padding: 0.5rem;
}

.node-card.compact .node-icon {
  font-size: 1.5rem;
}

.node-card.detailed {
  flex-direction: column;
}

.node-icon {
  font-size: 2rem;
  flex-shrink: 0;
}

.node-content {
  flex: 1;
  min-width: 0;
}

.node-name {
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.25rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.node-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.85rem;
  color: #6c757d;
}

.node-type {
  text-transform: capitalize;
}

.node-metadata {
  margin-top: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px solid #e9ecef;
  font-size: 0.85rem;
}

.metadata-item {
  margin: 0.25rem 0;
  color: #6c757d;
}
</style>
