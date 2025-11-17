# Exercise: Fully Typed Content Server Application

## 🎯 Capstone Project

Build a complete Content Server application with 100% TypeScript coverage, no `any` types, and strict mode enabled.

## 📋 Requirements

### Technical Requirements

1. **Strict Mode Enabled**
   ```json
   {
     "compilerOptions": {
       "strict": true,
       "noImplicitAny": true,
       "strictNullChecks": true,
       "strictFunctionTypes": true
     }
   }
   ```

2. **No `any` Types**
   - Use proper types for all variables
   - Use `unknown` when type is truly unknown
   - Create custom type guards

3. **Complete Type Coverage**
   - All components fully typed
   - All composables fully typed
   - All stores fully typed
   - All routes fully typed
   - API client fully typed

### Features to Implement

1. **Type-Safe API Client**
   ```typescript
   class ApiClient {
     async getNode<T = ContentServerNode>(id: number): Promise<ApiResponse<T>>
     async getNodes(params: NodesParams): Promise<PaginatedResponse<ContentServerNode>>
     async createNode(data: CreateNodeData): Promise<ApiResponse<ContentServerNode>>
   }
   ```

2. **Typed Stores**
   - Nodes store with full types
   - Auth store with user types
   - Preferences store with settings types
   - All stores tested with TypeScript

3. **Typed Components**
   - All props typed
   - All emits typed
   - All refs typed
   - Generic components where appropriate

4. **Typed Composables**
   - useNode composable
   - useFetch composable
   - useAuth composable
   - All with proper return types

5. **Typed Routes**
   - All routes typed
   - Typed route params
   - Typed route meta
   - Typed navigation guards

## 🏆 Success Criteria

- ✅ `npm run type-check` passes with zero errors
- ✅ No `any` types in codebase (check with ESLint)
- ✅ Strict mode enabled
- ✅ All tests pass with TypeScript
- ✅ Full autocomplete in IDE
- ✅ No type assertions without guards

## 📚 Bonus Challenges

1. Create custom type utilities
2. Implement discriminated unions for all API responses
3. Add runtime type validation with Zod
4. Generate types from OpenAPI schema
5. Create type-safe event bus

---

**Time:** 4-6 hours | **Difficulty:** Advanced
