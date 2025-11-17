# Starter Instructions

## Your Task

Complete the TODOs throughout the codebase to create a fully type-safe Content Server application.

## Steps

1. **Define Types** (`src/types/index.ts`)
   - [ ] Define `Node` interface
   - [ ] Define `Document`, `Folder`, `Link` types
   - [ ] Define `User` interface
   - [ ] Define `ApiResponse<T>` generic
   - [ ] Create type guards

2. **Create Stores** (`src/stores/`)
   - [ ] Implement `useNodesStore` with full typing
   - [ ] Implement `useAuthStore` with full typing
   - [ ] Type all state, getters, and actions

3. **Create Composables** (`src/composables/`)
   - [ ] Implement `useNodes()` composable
   - [ ] Implement generic `useFetch<T>()` composable
   - [ ] Type all parameters and return values

4. **Create Components** (`src/components/`)
   - [ ] Create `NodesList.vue` with typed props and emits
   - [ ] Create `NodeCard.vue` with typed props
   - [ ] Create `NodeForm.vue` with typed v-model

5. **Setup Router** (`src/router/`)
   - [ ] Define typed routes
   - [ ] Augment route meta types
   - [ ] Create typed navigation guards

6. **Build Views** (`src/views/`)
   - [ ] Create `Nodes.vue` using stores and composables
   - [ ] Create `NodeDetail.vue` with typed route params

## Testing

Run type checking:
```bash
npm run type-check
```

Should pass with no errors!

## Tips

- Start with type definitions
- Use strict mode
- No `any` types allowed
- Refer to lessons 1-6 for examples
