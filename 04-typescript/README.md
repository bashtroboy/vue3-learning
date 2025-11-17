# Section 4: TypeScript with Vue 3

## 🎯 Overview

Master TypeScript with Vue 3 to build type-safe, maintainable applications. This section takes you from TypeScript fundamentals to advanced patterns used in production Vue applications.

TypeScript adds static typing to JavaScript, catching errors at compile-time rather than runtime. Combined with Vue 3's excellent TypeScript support, you'll write more reliable code with better IDE support and easier refactoring.

## Prerequisites

Before starting this section, you should have completed:
- ✅ **Section 1: Fundamentals**
- ✅ **Section 2: Composition API**
- ✅ **Section 3: Router & State Management**
- ✅ Comfortable with JavaScript ES6+ features
- ✅ Understanding of Vue 3 Composition API

**No prior TypeScript experience needed!** We start from the basics.

## 📚 Lessons

### Lesson 1: TypeScript Fundamentals
**Topics:** Basic types, interfaces, type aliases, generics, utility types

**What You'll Build:** TypeScript playground with Content Server types

**Key Concepts:**
- Primitive types (string, number, boolean)
- Arrays and tuples
- Objects and interfaces
- Type aliases vs interfaces
- Union and intersection types
- Generics basics
- Utility types (Partial, Pick, Omit, etc.)
- Type guards and narrowing

**Time:** 2-3 hours

---

### Lesson 2: Components with TypeScript
**Topics:** Typing props, emits, refs, computed, and template refs

**What You'll Build:** Type-safe Content Server components

**Key Concepts:**
- `<script setup lang="ts">`
- Typing props with `defineProps<T>()`
- Typing emits with `defineEmits<T>()`
- Typing refs and computed
- Template refs with types
- Typing slots
- Component instance types
- Generic components

**Time:** 2-3 hours

---

### Lesson 3: Composables with TypeScript
**Topics:** Type-safe composables, generic composables, return types

**What You'll Build:** Typed utility composables for Content Server

**Key Concepts:**
- Typing composable parameters
- Typing return values
- Generic composables
- Typed lifecycle hooks
- Overloaded functions
- Type inference
- Error handling with types

**Time:** 2-3 hours

---

### Lesson 4: Pinia with TypeScript
**Topics:** Typed stores, store types, typed actions and getters

**What You'll Build:** Fully typed Content Server state management

**Key Concepts:**
- Defining store state types
- Typing getters
- Typing actions
- Store composition with types
- Plugin types
- Testing stores with types
- Type-safe store access

**Time:** 2-3 hours

---

### Lesson 5: Vue Router with TypeScript
**Topics:** Typed routes, route params, navigation guards, route meta

**What You'll Build:** Type-safe routing for Content Server app

**Key Concepts:**
- Typing route definitions
- Route params and query types
- Typed navigation
- Typed route meta fields
- Navigation guard types
- Route name types
- Link types

**Time:** 2 hours

---

### Lesson 6: Advanced TypeScript Patterns
**Topics:** Advanced types, module augmentation, declaration merging, strict mode

**What You'll Build:** Production-ready typed application

**Key Concepts:**
- Conditional types
- Mapped types
- Template literal types
- Module augmentation
- Declaration merging
- Strict null checks
- Unknown vs any
- Type predicates
- Discriminated unions

**Time:** 3-4 hours

---

### Lesson 7: Exercise - Typed Content Server Application
**Capstone Project:** Build a fully type-safe Content Server application

**Integration:** Uses all TypeScript concepts from Lessons 1-6

**Features:**
- 100% type coverage
- No `any` types
- Strict mode enabled
- Type-safe API client
- Typed stores and routes
- Type-safe composables
- Custom type guards

**Time:** 4-6 hours

---

## 🎓 Learning Path

```
Section 3: Router & State
       ↓
01. TypeScript Fundamentals ────→ Core TypeScript concepts
       ↓
02. Components with TypeScript ─→ Vue component typing
       ↓
03. Composables with TypeScript ─→ Reusable logic typing
       ↓
04. Pinia with TypeScript ──────→ State management typing
       ↓
05. Router with TypeScript ─────→ Navigation typing
       ↓
06. Advanced Patterns ──────────→ Production patterns
       ↓
07. Exercise ───────────────────→ Complete typed app
       ↓
Section 5: Real Tools
```

## 🎯 Learning Objectives

By the end of this section, you will be able to:

1. ✅ Write type-safe TypeScript code
2. ✅ Type Vue 3 components correctly
3. ✅ Create type-safe composables
4. ✅ Build typed Pinia stores
5. ✅ Configure type-safe routing
6. ✅ Use advanced TypeScript features
7. ✅ Work in strict mode without errors
8. ✅ Create custom type guards
9. ✅ Debug type errors effectively
10. ✅ Migrate JavaScript to TypeScript

## 📊 Section Statistics

- **Lessons:** 6 lessons + 1 exercise
- **Total Time:** 16-22 hours
- **Code Examples:** 60+ working examples
- **Projects:** 7 hands-on projects
- **Difficulty:** Beginner to Advanced

## 🛠️ What You'll Build

### Lesson Projects
1. **Type Playground** - Content Server type definitions
2. **Typed Components** - Type-safe UI components
3. **Typed Composables** - Utility function library
4. **Typed Stores** - State management with types
5. **Typed Routes** - Navigation with type safety
6. **Advanced Patterns** - Production-grade typing

### Capstone Exercise
**Complete Content Server App** featuring:
- Full type coverage
- No `any` types
- Strict mode enabled
- Type-safe API integration
- Typed stores and routing
- Custom type utilities
- Comprehensive type guards

## 🎨 Key Patterns You'll Learn

### 1. Component Props Typing
```typescript
interface Props {
  nodeId: number
  nodeName: string
  nodeType?: 'folder' | 'document'
  metadata?: Record<string, unknown>
}

const props = defineProps<Props>()
```

### 2. Composable Typing
```typescript
export function useNode(id: Ref<number>) {
  const node = ref<Node | null>(null)
  const loading = ref<boolean>(false)

  async function fetchNode(): Promise<void> {
    // Implementation
  }

  return {
    node: readonly(node),
    loading: readonly(loading),
    fetchNode
  }
}
```

### 3. Store Typing
```typescript
interface NodesState {
  nodes: Node[]
  currentNode: Node | null
  loading: boolean
  error: string | null
}

export const useNodesStore = defineStore('nodes', () => {
  const nodes = ref<Node[]>([])

  async function fetchNodes(): Promise<Node[]> {
    // Implementation
  }

  return { nodes, fetchNodes }
})
```

### 4. Route Typing
```typescript
declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean
    requiresAdmin?: boolean
    title?: string
  }
}

const routes: RouteRecordRaw[] = [
  {
    path: '/admin',
    meta: {
      requiresAuth: true,
      requiresAdmin: true,
      title: 'Admin'
    }
  }
]
```

## 📖 Why TypeScript Matters

### Benefits for Your Content Server Tools

1. **Catch Errors Early**
   ```typescript
   // TypeScript catches this at compile time!
   const node: ContentServerNode = {
     id: 123,
     name: 'Document',
     // ❌ Error: Property 'type' is missing
   }
   ```

2. **Better IDE Support**
   - Autocomplete for all properties
   - Inline documentation
   - Refactoring support
   - Go to definition

3. **Self-Documenting Code**
   ```typescript
   // The types tell you exactly what's expected
   function createNode(
     name: string,
     type: 'folder' | 'document',
     parent?: number
   ): Promise<Node>
   ```

4. **Safer Refactoring**
   - Rename across entire codebase
   - Type errors show what to update
   - Confidence in changes

5. **Team Collaboration**
   - Clear contracts between components
   - Prevents misuse of APIs
   - Reduces bugs in production

## 🔗 Relationship to Real Projects

TypeScript is used in:
- **Vue 3 Core** - Written entirely in TypeScript
- **Vite** - Build tool written in TypeScript
- **Pinia** - State management with TypeScript
- **Nuxt 3** - Full TypeScript support
- **Enterprise Applications** - Standard for large projects

## 📚 Additional Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Vue TypeScript Guide](https://vuejs.org/guide/typescript/overview.html)
- [Pinia TypeScript](https://pinia.vuejs.org/core-concepts/#typescript)
- [Vue Router TypeScript](https://router.vuejs.org/guide/advanced/typed-routes.html)

## 🚀 Getting Started

```bash
# Navigate to a lesson
cd 04-typescript/01-typescript-fundamentals

# Install dependencies
npm install

# Run development server (with type checking)
npm run dev

# Type check only
npm run type-check
```

Each lesson includes:
- `README.md` - Quick reference
- `NOTES.md` - Deep explanations
- `src/` - Working TypeScript examples
- `tsconfig.json` - TypeScript configuration
- `package.json` - Dependencies

## 💡 Tips for Success

1. **Start with Strict Mode Off** - Enable gradually
2. **Read Error Messages** - TypeScript errors are helpful
3. **Use Type Inference** - Don't over-annotate
4. **Experiment** - Change types and see what breaks
5. **Use IDE Features** - Hover for type info
6. **Check Official Docs** - Vue's TypeScript docs are excellent
7. **Practice Daily** - TypeScript has a learning curve

## ⚠️ Common Pitfalls

- **Overusing `any`** - Defeats the purpose of TypeScript
- **Type assertions** - Use sparingly, prefer type guards
- **Complex types** - Keep types simple and readable
- **Ignoring errors** - Don't use `@ts-ignore` without good reason
- **Not enabling strict mode** - Start loose, tighten gradually

## 🎯 Progressive Adoption

You don't need to convert everything at once:

1. **Phase 1:** Add TypeScript to new files
2. **Phase 2:** Convert utilities and composables
3. **Phase 3:** Convert components
4. **Phase 4:** Enable strict mode
5. **Phase 5:** Remove all `any` types

## 🎓 After This Section

You'll be ready for:
- **Section 5: Real Tools** - Build type-safe production apps
- **Section 6: Testing** - Test TypeScript code
- **Section 7: Migration** - Migrate Application Analyzer to TypeScript
- **Professional Development** - TypeScript is industry standard

---

**TypeScript will transform how you write Vue applications!** 🚀

Start with [Lesson 1: TypeScript Fundamentals](./01-typescript-fundamentals/README.md)
