# Lesson 2: Components with TypeScript

## 🎯 Learning Objectives

- Type component props with `defineProps<T>()`
- Type emits with `defineEmits<T>()`
- Type refs, computed, and reactive values
- Use template refs with types
- Create generic components

## 🔑 Key Examples

### Typing Props

```vue
<script setup lang="ts">
interface Props {
  nodeId: number
  nodeName: string
  nodeType?: 'folder' | 'document'
  metadata?: Record<string, unknown>
}

const props = defineProps<Props>()

// With defaults
const props = withDefaults(defineProps<Props>(), {
  nodeType: 'folder',
  metadata: () => ({})
})
</script>
```

### Typing Emits

```vue
<script setup lang="ts">
interface Emits {
  (e: 'update:modelValue', value: string): void
  (e: 'delete', id: number): void
  (e: 'select', node: ContentServerNode): void
}

const emit = defineEmits<Emits>()

emit('delete', 123)
emit('select', node)
</script>
```

### Typing Refs and Computed

```vue
<script setup lang="ts">
import { ref, computed } from 'vue'

const count = ref<number>(0)
const name = ref<string>('')

// Type inference works!
const doubled = computed(() => count.value * 2)  // number

// Explicit typing
const nodes = ref<ContentServerNode[]>([])

// Complex types
const cache = ref<Map<number, Node>>(new Map())
</script>
```

### Template Refs

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'

const inputRef = ref<HTMLInputElement>()
const componentRef = ref<InstanceType<typeof MyComponent>>()

onMounted(() => {
  inputRef.value?.focus()
  componentRef.value?.someMethod()
})
</script>

<template>
  <input ref="inputRef" />
  <MyComponent ref="componentRef" />
</template>
```

### Generic Components

```vue
<script setup lang="ts" generic="T extends { id: number }">
interface Props {
  items: T[]
  selected?: T
}

const props = defineProps<Props>()
const emit = defineEmits<{
  select: [item: T]
}>()
</script>

<template>
  <div v-for="item in items" :key="item.id" @click="emit('select', item)">
    <slot :item="item" />
  </div>
</template>
```

## 📚 Full Examples

See NOTES.md for complete component examples and patterns.

**Time:** 2-3 hours | **Difficulty:** Intermediate
