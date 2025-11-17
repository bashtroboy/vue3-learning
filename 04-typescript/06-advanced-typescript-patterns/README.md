# Lesson 6: Advanced TypeScript Patterns

## 🎯 Learning Objectives

- Master conditional and mapped types
- Use template literal types
- Implement module augmentation
- Work in strict mode
- Create advanced type utilities

## 🔑 Key Patterns

### Conditional Types

```typescript
type IsFolder<T> = T extends { type: 'folder' } ? T : never
type IsDocument<T> = T extends { type: 'document' } ? T : never

type ExtractFolders<T> = T extends { type: 'folder' } ? T : never
type Folders = ExtractFolders<ContentServerNode>  // Only FolderNode
```

### Mapped Types

```typescript
type Nullable<T> = {
  [K in keyof T]: T[K] | null
}

type NullableNode = Nullable<ContentServerNode>
// All properties can be null

type ReadonlyNode = {
  readonly [K in keyof ContentServerNode]: ContentServerNode[K]
}
```

### Template Literal Types

```typescript
type EventName = 'node' | 'user' | 'permission'
type EventAction = 'created' | 'updated' | 'deleted'

type Event = `${EventName}:${EventAction}`
// 'node:created' | 'node:updated' | 'node:deleted' | ...
```

### Module Augmentation

```typescript
// Extend Vue's ComponentCustomProperties
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $api: ApiClient
    $auth: AuthService
  }
}

// Now available in all components
this.$api.getNode(123)
```

### Type Predicates

```typescript
function isFolder(node: ContentServerNode): node is FolderNode {
  return node.type === 'folder'
}

function processNode(node: ContentServerNode) {
  if (isFolder(node)) {
    // TypeScript knows node is FolderNode
    console.log(node.child_count)
  }
}
```

**Time:** 3-4 hours | **Difficulty:** Advanced
