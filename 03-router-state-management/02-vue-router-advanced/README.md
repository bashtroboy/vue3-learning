# Lesson 2: Vue Router Advanced

## 🎯 Learning Objectives

- Implement nested routes for complex layouts
- Use navigation guards for authentication and authorization
- Configure route meta fields for permissions
- Implement lazy loading for better performance
- Handle 404 and error pages
- Create route transitions

## 📚 What You'll Build

An **Admin Dashboard** with:
- Nested routes (Admin → Users, Settings, Reports)
- Authentication guards
- Role-based access control
- Lazy-loaded components
- Custom 404 page

## 🔑 Key Concepts

### 1. Nested Routes

```javascript
const routes = [
  {
    path: '/admin',
    component: AdminLayout,
    children: [
      {
        path: '',  // /admin
        component: AdminDashboard
      },
      {
        path: 'users',  // /admin/users
        component: UserManagement
      },
      {
        path: 'settings',  // /admin/settings
        component: Settings
      }
    ]
  }
]
```

**AdminLayout.vue:**
```vue
<template>
  <div class="admin-layout">
    <aside>
      <router-link to="/admin">Dashboard</router-link>
      <router-link to="/admin/users">Users</router-link>
      <router-link to="/admin/settings">Settings</router-link>
    </aside>

    <main>
      <!-- Child routes render here -->
      <router-view />
    </main>
  </div>
</template>
```

### 2. Navigation Guards

**Global Guards:**
```javascript
// router/index.js
router.beforeEach((to, from, next) => {
  const isAuthenticated = checkAuth()

  if (to.meta.requiresAuth && !isAuthenticated) {
    // Redirect to login
    next({ name: 'login', query: { redirect: to.fullPath } })
  } else {
    next()
  }
})

router.afterEach((to, from) => {
  // Update page title
  document.title = to.meta.title || 'Content Server Admin'
})
```

**Per-Route Guards:**
```javascript
{
  path: '/admin',
  component: AdminLayout,
  beforeEnter: (to, from, next) => {
    if (user.isAdmin) {
      next()
    } else {
      next({ name: 'unauthorized' })
    }
  }
}
```

**In-Component Guards:**
```vue
<script setup>
import { onBeforeRouteLeave, onBeforeRouteUpdate } from 'vue-router'

// Warn before leaving unsaved form
onBeforeRouteLeave((to, from, next) => {
  if (hasUnsavedChanges.value) {
    const answer = window.confirm('You have unsaved changes. Leave anyway?')
    next(answer)
  } else {
    next()
  }
})

// React to param changes in same component
onBeforeRouteUpdate((to, from, next) => {
  loadData(to.params.id)
  next()
})
</script>
```

### 3. Route Meta Fields

```javascript
const routes = [
  {
    path: '/admin',
    component: AdminLayout,
    meta: {
      requiresAuth: true,
      requiresAdmin: true,
      title: 'Admin Dashboard',
      breadcrumb: 'Admin'
    },
    children: [
      {
        path: 'users',
        component: UserManagement,
        meta: {
          title: 'User Management',
          permissions: ['users.read']
        }
      }
    ]
  }
]

// Access in guards
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    // Check authentication
  }

  if (to.meta.permissions) {
    // Check permissions
  }

  next()
})
```

### 4. Lazy Loading

```javascript
const routes = [
  {
    path: '/',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/admin',
    component: () => import('../views/AdminLayout.vue'),
    children: [
      {
        path: 'users',
        // This component is loaded only when route is visited
        component: () => import('../views/UserManagement.vue')
      }
    ]
  }
]
```

**With webpack magic comments:**
```javascript
{
  path: '/admin',
  component: () => import(
    /* webpackChunkName: "admin" */
    /* webpackPrefetch: true */
    '../views/AdminLayout.vue'
  )
}
```

### 5. 404 and Catch-All Routes

```javascript
const routes = [
  // ... other routes

  // Catch-all route (must be last!)
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('../views/NotFound.vue')
  }
]
```

**NotFound.vue:**
```vue
<template>
  <div class="not-found">
    <h1>404 - Page Not Found</h1>
    <p>The page {{ $route.fullPath }} does not exist.</p>
    <router-link to="/">Go Home</router-link>
  </div>
</template>
```

### 6. Route Transitions

```vue
<template>
  <router-view v-slot="{ Component, route }">
    <transition name="fade" mode="out-in">
      <component :is="Component" :key="route.path" />
    </transition>
  </router-view>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
```

## 🎨 Common Patterns

### Pattern 1: Authentication Flow

```javascript
// stores/auth.js
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(localStorage.getItem('token'))

  const isAuthenticated = computed(() => !!token.value)
  const isAdmin = computed(() => user.value?.role === 'admin')

  async function login(credentials) {
    const response = await api.login(credentials)
    token.value = response.token
    user.value = response.user
    localStorage.setItem('token', response.token)
  }

  function logout() {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
  }

  return { user, isAuthenticated, isAdmin, login, logout }
})

// router/index.js
import { useAuthStore } from '../stores/auth'

router.beforeEach((to, from, next) => {
  const auth = useAuthStore()

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    next({ name: 'login', query: { redirect: to.fullPath } })
  } else if (to.meta.requiresAdmin && !auth.isAdmin) {
    next({ name: 'unauthorized' })
  } else {
    next()
  }
})
```

### Pattern 2: Permission-Based Rendering

```vue
<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()

const canEdit = computed(() => {
  return auth.user?.permissions.includes('nodes.edit')
})
</script>

<template>
  <div>
    <h1>Node Details</h1>

    <button v-if="canEdit" @click="editNode">Edit</button>
  </div>
</template>
```

### Pattern 3: Redirect After Login

```vue
<!-- Login.vue -->
<script setup>
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

async function handleLogin(credentials) {
  await auth.login(credentials)

  // Redirect to intended page or home
  const redirect = route.query.redirect || '/'
  router.push(redirect)
}
</script>
```

## 💡 Best Practices

1. **Order matters for catch-all routes** - Put them last
2. **Use route meta for common data** - Auth, permissions, titles
3. **Lazy load heavy components** - Improve initial load time
4. **Guard both globally and per-route** - Defense in depth
5. **Use named routes in guards** - Easier to maintain
6. **Handle navigation failures** - Provide good UX

## ⚠️ Common Mistakes

1. **Forgetting to call `next()`** - Route navigation will hang
2. **Infinite redirect loops** - Check your guard logic carefully
3. **Not handling async guards** - Use promises or async/await
4. **Catch-all route in wrong position** - Must be last

## 🎯 Exercises

1. Build admin dashboard with nested routes
2. Implement authentication with guards
3. Add role-based access control
4. Create lazy-loaded route chunks
5. Build custom 404 page

## 🔗 Next Steps

- [Lesson 3: Pinia Basics](../03-pinia-basics/README.md)
- Read NOTES.md for detailed explanations
- Complete the exercises

---

**Time:** 2-3 hours | **Difficulty:** Intermediate
