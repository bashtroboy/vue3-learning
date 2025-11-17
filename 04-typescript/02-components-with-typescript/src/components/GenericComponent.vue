<script setup lang="ts" generic="T extends { id: number }">
import { computed } from 'vue'

// Generic component props
interface Props {
  items: T[]
  selectedId?: number
  keyField?: keyof T
}

const props = withDefaults(defineProps<Props>(), {
  keyField: 'id' as keyof T
})

const emit = defineEmits<{
  select: [item: T]
}>()

const selectedItem = computed(() => {
  return props.items.find(item => item[props.keyField as 'id'] === props.selectedId)
})

const handleSelect = (item: T) => {
  emit('select', item)
}
</script>

<template>
  <div class="generic-list">
    <div
      v-for="item in items"
      :key="String(item[keyField])"
      :class="['list-item', { selected: item[keyField] === selectedId }]"
      @click="handleSelect(item)"
    >
      <slot name="item" :item="item">
        <pre>{{ item }}</pre>
      </slot>
    </div>
  </div>
</template>

<style scoped>
.generic-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.list-item {
  padding: 1rem;
  background: white;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.list-item:hover {
  border-color: #667eea;
}

.list-item.selected {
  background: #e7f3ff;
  border-color: #667eea;
}

pre {
  margin: 0;
  font-family: Monaco, monospace;
  font-size: 0.85rem;
}
</style>
