# Lesson 1: Vue Router Basics

## 🎯 Learning Objectives

By the end of this lesson, you will be able to:
- Install and configure Vue Router in a Vue 3 application
- Define routes and link them to components
- Navigate between pages using `<router-link>` and programmatic navigation
- Use dynamic route parameters (e.g., `/node/:id`)
- Access route params and query strings in components
- Understand the difference between hash and history mode

## 📚 What You'll Build

A **Content Server Node Browser** with multiple pages:
- Home page with navigation
- Node detail page (dynamic route with `:id` parameter)
- Search page with query parameters
- About page

## ⚡ Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:5173 and explore the multi-page application!

## 🔑 Key Concepts

### 1. Installing Vue Router

```bash
npm install vue-router@4
```

### 2. Basic Router Setup

```javascript
// router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import NodeDetail from '../views/NodeDetail.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/node/:id',
    name: 'node-detail',
    component: NodeDetail
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
```

### 3. Adding Router to Your App

```javascript
// main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

createApp(App)
  .use(router)
  .mount('#app')
```

### 4. Router View and Links

```vue
<!-- App.vue -->
<template>
  <nav>
    <router-link to="/">Home</router-link>
    <router-link to="/about">About</router-link>
    <router-link :to="{ name: 'node-detail', params: { id: 123 } }">
      Node 123
    </router-link>
  </nav>

  <router-view />
</template>
```

### 5. Accessing Route Parameters

```vue
<!-- views/NodeDetail.vue -->
<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()

// Access route params
const nodeId = route.params.id

// Access query parameters
const filter = route.query.filter
</script>

<template>
  <div>
    <h1>Node Details</h1>
    <p>Node ID: {{ nodeId }}</p>
    <p>Filter: {{ filter }}</p>
  </div>
</template>
```

### 6. Programmatic Navigation

```vue
<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function goToNode(id) {
  // Using path
  router.push(`/node/${id}`)

  // Using named route
  router.push({ name: 'node-detail', params: { id } })

  // With query parameters
  router.push({
    path: '/search',
    query: { q: 'documents', type: 'folder' }
  })
}

function goBack() {
  router.back()
}
</script>
```

## 🎨 Common Patterns

### Pattern 1: Dynamic Routes for Content Server Nodes

```javascript
const routes = [
  { path: '/node/:id', component: NodeDetail },
  { path: '/folder/:folderId', component: FolderView },
  { path: '/document/:docId', component: DocumentViewer }
]
```

### Pattern 2: Query Parameters for Filters

```javascript
// Navigate with filters
router.push({
  path: '/browse',
  query: {
    type: 'document',
    owner: 'John',
    date: '2024'
  }
})

// URL: /browse?type=document&owner=John&date=2024
```

### Pattern 3: Active Link Styling

```vue
<style>
.router-link-active {
  font-weight: bold;
  color: #42b983;
}

.router-link-exact-active {
  text-decoration: underline;
}
</style>
```

### Pattern 4: Named Views (Multiple Router Views)

```javascript
const routes = [
  {
    path: '/dashboard',
    components: {
      default: Dashboard,
      sidebar: DashboardSidebar,
      footer: DashboardFooter
    }
  }
]
```

```vue
<template>
  <router-view />
  <router-view name="sidebar" />
  <router-view name="footer" />
</template>
```

## 📖 Core Concepts

### Hash Mode vs History Mode

```javascript
// Hash Mode (default, works without server config)
// URLs look like: http://example.com/#/node/123
const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// History Mode (clean URLs, requires server config)
// URLs look like: http://example.com/node/123
const router = createRouter({
  history: createWebHistory(),
  routes
})
```

### Route Object Properties

When using `useRoute()`, you get access to:

```javascript
const route = useRoute()

route.path       // '/node/123'
route.params     // { id: '123' }
route.query      // { filter: 'active' }
route.hash       // '#section1'
route.name       // 'node-detail'
route.fullPath   // '/node/123?filter=active#section1'
route.matched    // Array of matched route records
```

## 🏗️ Project Structure

```
01-vue-router-basics/
├── src/
│   ├── views/               # Route components (pages)
│   │   ├── Home.vue
│   │   ├── NodeDetail.vue
│   │   ├── Search.vue
│   │   └── About.vue
│   ├── components/          # Reusable components
│   │   ├── Navigation.vue
│   │   └── NodeCard.vue
│   ├── router/
│   │   └── index.js         # Router configuration
│   ├── App.vue
│   └── main.js
├── package.json
└── README.md
```

## 💡 Best Practices

1. **Views vs Components**
   - `views/` folder: Route components (pages)
   - `components/` folder: Reusable UI components

2. **Named Routes**
   - Always use named routes for easier refactoring
   - Provides type safety with TypeScript

3. **Route Parameters**
   - Use params for entity IDs (`:id`, `:nodeId`)
   - Use query for filters and optional data

4. **Reactive Route Data**
   ```vue
   <script setup>
   import { computed } from 'vue'
   import { useRoute } from 'vue-router'

   const route = useRoute()

   // Reactive to route changes!
   const nodeId = computed(() => route.params.id)
   </script>
   ```

## ⚠️ Common Mistakes

1. **Forgetting to use `computed` for route params**
   ```javascript
   // ❌ Won't update when route changes
   const id = route.params.id

   // ✅ Reactive to route changes
   const id = computed(() => route.params.id)
   ```

2. **Wrong router import**
   ```javascript
   // ❌ This is for setup, not component use
   import router from './router'

   // ✅ Use the composable
   import { useRouter } from 'vue-router'
   const router = useRouter()
   ```

3. **Mixing push and replace**
   ```javascript
   // push - adds to history
   router.push('/node/123')

   // replace - doesn't add to history
   router.replace('/node/123')
   ```

## 🎯 Exercises

### Exercise 1: Basic Navigation
Create a Content Server object browser with:
- Home page listing objects
- Detail page for each object (dynamic route)
- Navigation between pages

### Exercise 2: Search with Query Parameters
Add a search page that:
- Accepts search term via query parameter
- Shows results based on query
- Updates URL when search changes

### Exercise 3: Breadcrumb Navigation
Create a breadcrumb component that:
- Shows the current route path
- Allows navigation to parent routes
- Uses route meta data for labels

## 🔗 Related Topics

- [Vue Router Advanced](../02-vue-router-advanced/README.md) - Guards, nested routes, lazy loading
- [Pinia Basics](../03-pinia-basics/README.md) - State management
- [Composition API](../../02-composition-api/README.md) - Review composables

## 📚 Further Reading

- [Vue Router Official Docs](https://router.vuejs.org/)
- [Composition API with Router](https://router.vuejs.org/guide/advanced/composition-api.html)
- [Dynamic Route Matching](https://router.vuejs.org/guide/essentials/dynamic-matching.html)

## 🚀 Next Steps

Once you're comfortable with basic routing:
1. Complete the exercises
2. Read through NOTES.md for deep understanding
3. Move on to [Lesson 2: Vue Router Advanced](../02-vue-router-advanced/README.md)

---

**Time to build:** 2-3 hours
**Difficulty:** Intermediate
**Prerequisites:** Section 1 & 2 completed
