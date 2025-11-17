# Lesson 2: Components with TypeScript - Detailed Notes

## Overview

This lesson covers how to create type-safe Vue 3 components using TypeScript. You'll learn to type props, emits, refs, computed properties, template refs, and create generic components.

## Typed Props

### Basic Usage

```typescript
<script setup lang="ts">
interface Props {
  title: string
  count: number
  enabled?: boolean  // Optional prop
}

const props = defineProps<Props>()
</script>
```

### With Default Values

```typescript
<script setup lang="ts">
interface Props {
  title: string
  variant?: 'default' | 'primary' | 'danger'
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'md'
})
</script>
```

### Complex Props

```typescript
import type { Node } from '../types'

interface Props {
  node: Node
  metadata?: Record<string, unknown>
  permissions: Array<'read' | 'write' | 'admin'>
  onUpdate?: (node: Node) => void
}

const props = defineProps<Props>()
```

## Typed Emits

### Basic Emits

```typescript
<script setup lang="ts">
// Tuple syntax: [eventName: [param1Type, param2Type]]
const emit = defineEmits<{
  submit: [value: string]
  cancel: []
  update: [id: number, value: string]
}>()

// Usage
emit('submit', 'hello')      // ✅ OK
emit('submit')               // ❌ Error: missing argument
emit('submit', 123)          // ❌ Error: wrong type
</script>
```

### Component with Emits

```typescript
<script setup lang="ts">
interface Props {
  modelValue: string
}

const emit = defineEmits<{
  'update:modelValue': [value: string]
  blur: [event: FocusEvent]
  change: [newValue: string, oldValue: string]
}>()

const handleInput = (e: Event) => {
  const value = (e.target as HTMLInputElement).value
  emit('update:modelValue', value)
}
</script>
```

## Typed Refs and Reactive

### Basic Refs

```typescript
import { ref } from 'vue'

// TypeScript infers the type
const count = ref(0)           // Ref<number>
const message = ref('hello')   // Ref<string>

// Explicit typing
const count = ref<number>(0)
const name = ref<string | null>(null)
```

### Refs with Interfaces

```typescript
import { ref } from 'vue'
import type { Node } from './types'

const node = ref<Node>({
  id: 1,
  name: 'Document',
  type: 'document',
  // ...
})

// Nullable ref
const currentNode = ref<Node | null>(null)
```

### Reactive Objects

```typescript
import { reactive } from 'vue'

interface State {
  nodes: Node[]
  selectedId: number | null
  loading: boolean
  error: string | null
}

const state = reactive<State>({
  nodes: [],
  selectedId: null,
  loading: false,
  error: null
})
```

### Typed Computed

```typescript
import { computed } from 'vue'

const count = ref(0)

// Inferred type
const doubled = computed(() => count.value * 2)  // ComputedRef<number>

// Explicit type
const formatted = computed<string>(() => {
  return `Count: ${count.value}`
})

// Complex computed
interface Summary {
  total: number
  average: number
}

const summary = computed<Summary>(() => ({
  total: numbers.value.reduce((a, b) => a + b, 0),
  average: numbers.value.length > 0
    ? numbers.value.reduce((a, b) => a + b, 0) / numbers.value.length
    : 0
}))
```

## Template Refs

### DOM Element Refs

```typescript
import { ref, onMounted } from 'vue'

// HTML element refs
const inputRef = ref<HTMLInputElement | null>(null)
const divRef = ref<HTMLDivElement | null>(null)
const buttonRef = ref<HTMLButtonElement | null>(null)

onMounted(() => {
  // TypeScript knows the element type
  inputRef.value?.focus()
  console.log(divRef.value?.textContent)
  buttonRef.value?.click()
})
```

### Component Instance Refs

```typescript
import { ref } from 'vue'
import MyComponent from './MyComponent.vue'

// Component instance ref
const componentRef = ref<InstanceType<typeof MyComponent> | null>(null)

// Access component methods (if exposed via defineExpose)
const callComponentMethod = () => {
  componentRef.value?.someMethod()
}
```

### defineExpose

```typescript
// ChildComponent.vue
<script setup lang="ts">
import { ref } from 'vue'

const count = ref(0)

const increment = () => {
  count.value++
}

// Expose to parent
defineExpose({
  count,
  increment
})
</script>

// ParentComponent.vue
<script setup lang="ts">
import { ref } from 'vue'
import ChildComponent from './ChildComponent.vue'

const childRef = ref<InstanceType<typeof ChildComponent> | null>(null)

const incrementChild = () => {
  childRef.value?.increment()
  console.log(childRef.value?.count) // Access exposed state
}
</script>
```

## Generic Components

### Basic Generic Component

```typescript
<script setup lang="ts" generic="T extends { id: number }">
interface Props {
  items: T[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  select: [item: T]
}>()
</script>

<template>
  <div
    v-for="item in items"
    :key="item.id"
    @click="emit('select', item)"
  >
    <slot name="item" :item="item">
      {{ item }}
    </slot>
  </div>
</template>
```

### Using Generic Components

```typescript
<script setup lang="ts">
import GenericList from './GenericList.vue'
import type { Node, User } from './types'

const nodes = ref<Node[]>([...])
const users = ref<User[]>([...])

const handleNodeSelect = (node: Node) => {
  // TypeScript knows this is a Node
  console.log(node.name)
}

const handleUserSelect = (user: User) => {
  // TypeScript knows this is a User
  console.log(user.email)
}
</script>

<template>
  <GenericList :items="nodes" @select="handleNodeSelect" />
  <GenericList :items="users" @select="handleUserSelect" />
</template>
```

### Advanced Generic Component

```typescript
<script setup lang="ts" generic="T extends Record<string, any>, K extends keyof T">
interface Props {
  items: T[]
  keyField: K
  filterFn?: (item: T) => boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'item-click': [item: T]
  'update:items': [items: T[]]
}>()

const filteredItems = computed(() => {
  if (!props.filterFn) return props.items
  return props.items.filter(props.filterFn)
})
</script>
```

## Typed Slots

### Defining Slot Types

```typescript
<script setup lang="ts">
interface Props {
  items: Node[]
}

const props = defineProps<Props>()
</script>

<template>
  <div>
    <!-- Default slot -->
    <slot />

    <!-- Named slot with typed scope -->
    <div v-for="item in items" :key="item.id">
      <slot name="item" :item="item" :index="index">
        {{ item.name }}
      </slot>
    </div>

    <!-- Footer slot -->
    <slot name="footer" :count="items.length" />
  </div>
</template>
```

### Using Typed Slots

```typescript
<template>
  <MyComponent :items="nodes">
    <!-- TypeScript knows item is Node -->
    <template #item="{ item, index }">
      <div>{{ item.name }} ({{ index }})</div>
    </template>

    <!-- TypeScript knows count is number -->
    <template #footer="{ count }">
      Total: {{ count }} items
    </template>
  </MyComponent>
</template>
```

## Component Type Utilities

### ComponentInstance

```typescript
import type { ComponentPublicInstance } from 'vue'
import MyComponent from './MyComponent.vue'

// Get the instance type
type MyComponentInstance = InstanceType<typeof MyComponent>

// Or use ComponentPublicInstance
type Instance = ComponentPublicInstance<typeof MyComponent>
```

### Props Type Extraction

```typescript
import type { ExtractPropTypes } from 'vue'

// If using runtime props
const props = {
  title: String,
  count: Number
}

type Props = ExtractPropTypes<typeof props>
// Result: { title?: string; count?: number }
```

## Best Practices

### 1. Always Type Props and Emits

```typescript
// ❌ Bad
const props = defineProps(['title', 'count'])

// ✅ Good
interface Props {
  title: string
  count: number
}

const props = defineProps<Props>()
```

### 2. Use Interfaces for Props

```typescript
// ✅ Good - clear and reusable
interface Props {
  node: Node
  editable?: boolean
}

const props = defineProps<Props>()
```

### 3. Type Template Refs Correctly

```typescript
// ✅ Good
const inputRef = ref<HTMLInputElement | null>(null)

onMounted(() => {
  inputRef.value?.focus()
})
```

### 4. Use Generic Components for Reusability

```typescript
// Generic component works with any type
<script setup lang="ts" generic="T">
interface Props {
  items: T[]
}
</script>
```

### 5. Expose Component APIs with defineExpose

```typescript
// ChildComponent.vue
const doSomething = () => { ... }

defineExpose({
  doSomething
})
```

## Common Patterns

### Form Input Component

```typescript
<script setup lang="ts">
interface Props {
  modelValue: string
  label?: string
  error?: string
  type?: 'text' | 'email' | 'password'
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text'
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  blur: []
  focus: []
}>()

const handleInput = (e: Event) => {
  const value = (e.target as HTMLInputElement).value
  emit('update:modelValue', value)
}
</script>
```

### List Component with Selection

```typescript
<script setup lang="ts">
interface Props {
  items: Node[]
  selectedId?: number
  multiSelect?: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  select: [id: number]
  'select-multiple': [ids: number[]]
}>()
</script>
```

### Modal Component

```typescript
<script setup lang="ts">
interface Props {
  show: boolean
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md'
})

const emit = defineEmits<{
  close: []
  confirm: []
}>()
</script>
```

## Next Steps

- **Lesson 3:** Type-safe composables
- **Lesson 4:** Typed Pinia stores
- Practice creating your own typed components
- Explore Vue 3 TypeScript documentation

## Resources

- [Vue TypeScript Guide](https://vuejs.org/guide/typescript/composition-api.html)
- [defineProps with TypeScript](https://vuejs.org/api/sfc-script-setup.html#typescript-only-features)
- [Generic Components](https://blog.vuejs.org/posts/vue-3-3#generic-components)
