# Lesson 5: Router with TypeScript

## Overview

Learn to create type-safe routing with Vue Router and TypeScript.

## Route Definitions

```typescript
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/nodes/:id',
    name: 'node-detail',
    component: () => import('./NodeDetail.vue'),
    props: (route) => ({ id: Number(route.params.id) })
  }
]
```

## Route Meta Typing

```typescript
declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean
    title?: string
    roles?: string[]
  }
}
```

## Typed Navigation Guards

```typescript
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    // TypeScript knows about requiresAuth
  }
  next()
})
```

## Type-Safe Navigation

```typescript
<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

// Type-safe navigation
router.push({ name: 'node-detail', params: { id: 1 } })
</script>
```

## Resources

- [Vue Router TypeScript Guide](https://router.vuejs.org/guide/advanced/typed-routes.html)
