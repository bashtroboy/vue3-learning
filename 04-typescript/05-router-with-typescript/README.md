# Lesson 5: Vue Router with TypeScript

## 🎯 Learning Objectives

- Type route definitions
- Create typed route params
- Type navigation guards
- Use typed route meta fields

## 🔑 Key Examples

### Typed Routes

```typescript
// router/index.ts
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/node/:id',
    name: 'node-detail',
    component: () => import('../views/NodeDetail.vue'),
    props: (route) => ({ id: Number(route.params.id) })
  }
]
```

### Typed Route Meta

```typescript
declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean
    requiresAdmin?: boolean
    title?: string
    breadcrumb?: string
  }
}

const routes: RouteRecordRaw[] = [
  {
    path: '/admin',
    meta: {
      requiresAuth: true,
      requiresAdmin: true,
      title: 'Admin Dashboard'
    }
  }
]
```

### Typed Navigation Guards

```typescript
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !isAuthenticated()) {
    next({ name: 'login', query: { redirect: to.fullPath } })
  } else {
    next()
  }
})
```

**Time:** 2 hours | **Difficulty:** Intermediate
