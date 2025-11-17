# Vue 3 Learning Journey

A practical learning repository focused on Vue 3 fundamentals and building real tools for OpenText Content Server consulting work.

## Learning Path

### Section 1: Fundamentals ✅
Basic Vue 3 concepts with simple, practical examples
- Reactivity and data binding
- Components and props
- Events and state management
- Forms and validation
- Basic reactivity patterns
- Composables introduction

### Section 2: Composition API ✅
Understanding Vue 3's modern approach
- Provide/Inject for dependency injection
- Lifecycle hooks deep dive
- Custom directives
- Teleport and Suspense
- Plugin system
- Advanced composable patterns

### Section 3: Router & State Management (NEW!)
Essential tools for building real applications
- **Vue Router Basics** - Navigation and routing
- **Vue Router Advanced** - Guards, nested routes, lazy loading
- **Pinia Basics** - State management fundamentals
- **Pinia Advanced** - Multi-store patterns, plugins, caching
- **Capstone Exercise** - Content Server Explorer app

### Section 4: TypeScript with Vue 3 (NEW!)
Build type-safe, maintainable applications
- **TypeScript Fundamentals** - Types, interfaces, generics
- **Components with TypeScript** - Typed props, emits, refs
- **Composables with TypeScript** - Type-safe reusable logic
- **Pinia with TypeScript** - Fully typed stores
- **Router with TypeScript** - Type-safe navigation
- **Advanced Patterns** - Conditional types, mapped types, utilities
- **Capstone Exercise** - Fully typed Content Server app

### Section 5: Real Tools
Building production Content Server utilities
- **Content Server Node Browser** - Navigate and explore CS nodes
- **WebReports Query Builder** - Visual interface for building queries
- **Application Analyzer Dashboard** - Widgets for analyzing CS applications
- **AI Integration Prototype** - RAG/Claude integration for Seaside.ai

### Section 6: Testing & Production (NEW!)
Professional development practices
- **Vitest Basics** - Unit testing
- **Component Testing** - Test Vue components
- **Composable & Store Testing** - Test business logic
- **E2E Testing** - End-to-end with Playwright
- **Build Optimization** - Performance and bundle size
- **Deployment** - Production deployment strategies

### Section 7: Migration Patterns
Preparing for Vue 2 → Vue 3 migration
- Common migration scenarios
- Side-by-side comparisons
- Refactoring patterns from Application Analyzer
- Incremental migration strategies

## Project Structure

```
vue3-learning/
├── 01-fundamentals/           # ✅ Section 1: Basics (Complete)
│   ├── 01-hello-vue/
│   ├── 02-components/
│   ├── 03-lists-and-conditionals/
│   ├── 04-forms/
│   ├── 05-reactivity/
│   ├── 06-composables/
│   └── 07-exercise-task-manager/
│
├── 02-composition-api/        # ✅ Section 2: Advanced patterns (Complete)
│   ├── 01-provide-inject/
│   ├── 02-lifecycle-hooks/
│   ├── 03-custom-directives/
│   ├── 04-teleport-suspense/
│   ├── 05-plugin-system/
│   ├── 06-advanced-patterns/
│   └── 07-exercise-plugin-builder/
│
├── 03-router-state-management/ # NEW Section 3: Routing & State
│   ├── 01-vue-router-basics/
│   ├── 02-vue-router-advanced/
│   ├── 03-pinia-basics/
│   ├── 04-pinia-advanced/
│   └── 05-exercise-content-server-app/
│
├── 04-typescript/             # NEW Section 4: TypeScript
│   ├── 01-typescript-fundamentals/
│   ├── 02-components-with-typescript/
│   ├── 03-composables-with-typescript/
│   ├── 04-pinia-with-typescript/
│   ├── 05-router-with-typescript/
│   ├── 06-advanced-typescript-patterns/
│   └── 07-exercise-typed-content-server/
│
├── 05-real-tools/             # Section 5: Production applications
│   ├── node-browser/
│   ├── query-builder/
│   ├── dashboard-widgets/
│   └── ai-integration/
│
├── 06-testing-production/     # NEW Section 6: Testing & deployment
│   ├── 01-vitest-basics/
│   ├── 02-component-testing/
│   ├── 03-composable-testing/
│   ├── 04-e2e-testing/
│   ├── 05-build-optimization/
│   └── 06-deployment/
│
└── 07-migration-patterns/     # Section 7: Vue 2 → Vue 3 migration
```

## Current Progress

- [x] **Section 1: Fundamentals** - Complete with 6 lessons + exercise
- [x] **Section 2: Composition API** - Complete with 6 lessons + exercise
- [x] **Section 3: Router & State** - Curriculum created, ready to start
- [x] **Section 4: TypeScript** - Curriculum created, ready to start
- [ ] **Section 5: Real Tools** - To be started after Section 4
- [x] **Section 6: Testing & Production** - Curriculum outline created
- [ ] **Section 7: Migration Patterns** - To be created

## Setup Instructions

Each project folder contains its own README with specific setup instructions. Generally:

```bash
cd [project-folder]
npm install
npm run dev
```

## Learning Notes

This section will be updated with key learnings, gotchas, and insights as we progress.

### Key Concepts Learned
- (To be filled in as we learn)

### Common Patterns
- (To be documented)

### Vue 2 vs Vue 3 Differences
- (Notes for migration prep)

---

**Goal:** Master Vue 3 to upgrade Ravenblack's Application Analyzer and build new Content Server consulting tools.
