# Vue Router Basics - Detailed Notes

## Table of Contents
1. [Introduction](#introduction)
2. [Installation and Setup](#installation-and-setup)
3. [Core Concepts](#core-concepts)
4. [Dynamic Routes](#dynamic-routes)
5. [Navigation](#navigation)
6. [Route Parameters and Query Strings](#route-parameters-and-query-strings)
7. [History Modes](#history-modes)
8. [Best Practices](#best-practices)
9. [Common Patterns](#common-patterns)
10. [Troubleshooting](#troubleshooting)

---

## Introduction

### What is Vue Router?

Vue Router is the official routing library for Vue.js. It enables you to build Single Page Applications (SPAs) with multiple views, where navigation between pages happens without full page reloads.

### Why Do We Need a Router?

**Without Router:**
```vue
<!-- ❌ Poor approach: Conditional rendering for "pages" -->
<template>
  <div v-if="currentPage === 'home'">Home content</div>
  <div v-else-if="currentPage === 'about'">About content</div>
  <div v-else-if="currentPage === 'node'">Node content</div>
</template>

<script setup>
import { ref } from 'vue'
const currentPage = ref('home')
</script>
```

**Problems:**
- URL doesn't change (can't bookmark or share)
- Browser back/forward doesn't work
- No deep linking
- Code becomes messy quickly
- Can't lazy load pages

**With Router:**
```vue
<!-- ✅ Clean approach: Router handles everything -->
<template>
  <nav>
    <router-link to="/">Home</router-link>
    <router-link to="/about">About</router-link>
  </nav>
  <router-view />
</template>
```

**Benefits:**
- URLs reflect application state
- Browser navigation works
- Deep linking supported
- Clean code separation
- Lazy loading built-in
- Route guards for authentication

### Vue Router 3 vs Vue Router 4

**Vue Router 4** (for Vue 3) has significant changes:

| Feature | Vue Router 3 (Vue 2) | Vue Router 4 (Vue 3) |
|---------|---------------------|---------------------|
| **Creation** | `new VueRouter({})` | `createRouter({})` |
| **History** | `mode: 'history'` | `history: createWebHistory()` |
| **Installation** | `Vue.use(VueRouter)` | `app.use(router)` |
| **In Components** | `this.$router`, `this.$route` | `useRouter()`, `useRoute()` |
| **Wildcards** | `path: '*'` | `path: '/:pathMatch(.*)*'` |

---

## Installation and Setup

### Step 1: Install Vue Router

```bash
npm install vue-router@4
```

### Step 2: Create Router Configuration

```javascript
// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'

// Import view components
import Home from '../views/Home.vue'
import About from '../views/About.vue'

// Define routes
const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/about',
    name: 'about',
    component: About
  }
]

// Create router instance
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
```

### Step 3: Add Router to Vue App

```javascript
// src/main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(router)
app.mount('#app')
```

### Step 4: Add Router View to App

```vue
<!-- src/App.vue -->
<template>
  <div id="app">
    <nav>
      <router-link to="/">Home</router-link>
      <router-link to="/about">About</router-link>
    </nav>

    <!-- Current route component renders here -->
    <router-view />
  </div>
</template>
```

---

## Core Concepts

### The `<router-view>` Component

`<router-view>` is a placeholder that renders the component for the current route.

```vue
<template>
  <div class="container">
    <header>My App Header</header>

    <!-- Route component renders here -->
    <router-view />

    <footer>My App Footer</footer>
  </div>
</template>
```

**How it works:**
1. User navigates to `/about`
2. Router finds matching route
3. Router renders `About` component in `<router-view>`
4. Header and footer remain unchanged (SPA behavior!)

### The `<router-link>` Component

`<router-link>` creates navigation links with special features:

```vue
<!-- Basic link -->
<router-link to="/about">About</router-link>

<!-- Named route -->
<router-link :to="{ name: 'about' }">About</router-link>

<!-- With params -->
<router-link :to="{ name: 'node-detail', params: { id: 123 } }">
  Node 123
</router-link>

<!-- With query -->
<router-link :to="{ path: '/search', query: { q: 'test' } }">
  Search
</router-link>
```

**Benefits of `<router-link>` over `<a>`:**
- Automatically adds `router-link-active` class
- Prevents page reload (SPA behavior)
- Handles base URL automatically
- Works with both hash and history mode
- Supports custom active class

**Renders as:**
```html
<!-- router-link renders as an <a> tag -->
<a href="/about" class="router-link-active">About</a>
```

### Active Link Classes

Vue Router automatically adds CSS classes to active links:

```css
/* Applied when the link's route is active */
.router-link-active {
  color: #42b983;
}

/* Applied only when the link's route is exact match */
.router-link-exact-active {
  font-weight: bold;
}
```

**Example:**
```
Current URL: /admin/users

Links:
/                     (no classes)
/admin                router-link-active
/admin/users          router-link-active router-link-exact-active
```

**Customizing classes:**
```javascript
const router = createRouter({
  history: createWebHistory(),
  routes,
  linkActiveClass: 'my-active-class',
  linkExactActiveClass: 'my-exact-active-class'
})
```

---

## Dynamic Routes

### Basic Dynamic Route

```javascript
const routes = [
  {
    path: '/node/:id',
    name: 'node-detail',
    component: NodeDetail
  }
]
```

**Matches:**
- `/node/123` → params.id = '123'
- `/node/abc` → params.id = 'abc'
- `/node/2000` → params.id = '2000'

**Doesn't match:**
- `/node` (missing id)
- `/node/123/edit` (extra segment)

### Multiple Parameters

```javascript
const routes = [
  {
    path: '/user/:username/post/:postId',
    component: UserPost
  }
]
```

**Example:**
- URL: `/user/john/post/42`
- Params: `{ username: 'john', postId: '42' }`

### Optional Parameters

```javascript
// Using regex
{
  path: '/node/:id(\\d+)?',  // Optional numeric id
  component: NodeDetail
}

// Matches both:
// /node → params.id = undefined
// /node/123 → params.id = '123'
```

### Parameter Patterns with Regex

```javascript
const routes = [
  // Only numbers
  {
    path: '/node/:id(\\d+)',
    component: NodeDetail
  },

  // Only letters
  {
    path: '/user/:name([a-z]+)',
    component: UserProfile
  },

  // Custom pattern
  {
    path: '/product/:code([A-Z]{3}-\\d{4})',  // ABC-1234
    component: ProductDetail
  }
]
```

### Accessing Route Params

**Composition API (Vue 3):**
```vue
<script setup>
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()

// ❌ Not reactive to route changes!
const nodeId = route.params.id

// ✅ Reactive to route changes
const nodeId = computed(() => route.params.id)

// Watch for changes
watch(
  () => route.params.id,
  (newId, oldId) => {
    console.log(`Route changed from ${oldId} to ${newId}`)
    fetchNodeData(newId)
  }
)
</script>

<template>
  <div>
    <h1>Node {{ nodeId }}</h1>
  </div>
</template>
```

**Why use `computed`?**

When navigating from `/node/123` to `/node/456`, Vue Router reuses the same component instance for performance. Without `computed`, your component won't react to the change!

```javascript
// ❌ Problem: Component doesn't update
<script setup>
const route = useRoute()
const id = route.params.id  // Still '123' when route changes to '456'
fetchData(id)
</script>

// ✅ Solution: Use computed or watch
<script setup>
const route = useRoute()
const id = computed(() => route.params.id)

watch(id, (newId) => {
  fetchData(newId)  // Called when route changes!
})
</script>
```

---

## Navigation

### Declarative Navigation with `<router-link>`

```vue
<template>
  <!-- String path -->
  <router-link to="/about">About</router-link>

  <!-- Object with path -->
  <router-link :to="{ path: '/about' }">About</router-link>

  <!-- Named route -->
  <router-link :to="{ name: 'about' }">About</router-link>

  <!-- With params -->
  <router-link :to="{ name: 'node-detail', params: { id: 123 } }">
    Node 123
  </router-link>

  <!-- With query -->
  <router-link :to="{ path: '/search', query: { q: 'vue', type: 'docs' } }">
    Search Vue Docs
  </router-link>

  <!-- With hash -->
  <router-link :to="{ path: '/about', hash: '#team' }">
    About Us - Team
  </router-link>
</template>
```

### Programmatic Navigation with `useRouter()`

```vue
<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

// Push (adds to history)
function goToNode(id) {
  router.push(`/node/${id}`)
}

// Replace (doesn't add to history)
function replaceRoute() {
  router.replace('/new-path')
}

// Go back
function goBack() {
  router.back()
  // or
  router.go(-1)
}

// Go forward
function goForward() {
  router.forward()
  // or
  router.go(1)
}

// Go to specific history position
function goToPosition() {
  router.go(-3)  // Go back 3 pages
}

// Object syntax
function navigate() {
  router.push({
    name: 'node-detail',
    params: { id: 123 },
    query: { view: 'full' },
    hash: '#metadata'
  })
  // Results in: /node/123?view=full#metadata
}

// Handle navigation success/failure
router.push('/node/123')
  .then(() => {
    console.log('Navigation successful')
  })
  .catch((error) => {
    console.log('Navigation failed:', error)
  })
</script>
```

### Push vs Replace

```javascript
// push - Adds to browser history
router.push('/about')
// User can click back button to return

// replace - Replaces current history entry
router.replace('/about')
// User cannot return to previous page with back button

// Use cases for replace:
// - Login redirects
// - After form submission
// - Error pages
// - Wizard completion
```

---

## Route Parameters and Query Strings

### Route Params vs Query Strings

**Route Params:** Part of the path, required for the route to match

```javascript
// Route definition
{ path: '/node/:id', component: NodeDetail }

// URL: /node/123
// Access: route.params.id → '123'
```

**Query Strings:** Optional, added after `?`

```javascript
// URL: /search?q=vue&type=docs
// Access: route.query.q → 'vue'
//         route.query.type → 'docs'
```

**When to use which?**

| Use Params When | Use Query When |
|----------------|----------------|
| Resource identification (`/node/:id`) | Filtering (`?type=folder`) |
| Required data (`/user/:username`) | Optional data (`?page=2`) |
| Part of hierarchy (`/category/:cat/item/:id`) | Search terms (`?q=search`) |
| SEO important | Not SEO critical |

### Working with Query Parameters

```vue
<script setup>
import { useRoute, useRouter } from 'vue-router'
import { computed, watch } from 'vue'

const route = useRoute()
const router = useRouter()

// Read query params
const searchQuery = computed(() => route.query.q || '')
const filter = computed(() => route.query.filter || 'all')
const page = computed(() => parseInt(route.query.page) || 1)

// Update query params
function updateFilter(newFilter) {
  router.push({
    query: {
      ...route.query,  // Keep existing query params
      filter: newFilter  // Update filter
    }
  })
}

function updateSearch(searchTerm) {
  router.push({
    query: {
      q: searchTerm,
      page: 1  // Reset to page 1 on new search
    }
  })
}

// Watch for query changes
watch(
  () => route.query,
  (newQuery) => {
    console.log('Query changed:', newQuery)
    fetchResults(newQuery)
  },
  { deep: true }
)
</script>

<template>
  <div>
    <input
      :value="searchQuery"
      @input="updateSearch($event.target.value)"
      placeholder="Search..."
    />

    <select @change="updateFilter($event.target.value)">
      <option value="all">All</option>
      <option value="folders">Folders</option>
      <option value="documents">Documents</option>
    </select>

    <div>Page: {{ page }}</div>
  </div>
</template>
```

### Array Query Parameters

```javascript
// URL: /search?tags=vue&tags=router&tags=typescript
// Access: route.query.tags → ['vue', 'router', 'typescript']

// Setting array query params
router.push({
  path: '/search',
  query: {
    tags: ['vue', 'router', 'typescript']
  }
})
```

---

## History Modes

### Hash Mode

```javascript
import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
  routes
})
```

**URLs look like:**
- `http://example.com/#/`
- `http://example.com/#/about`
- `http://example.com/#/node/123`

**Pros:**
- ✅ No server configuration needed
- ✅ Works on all servers (even file://)
- ✅ No 404 errors

**Cons:**
- ❌ URLs look less clean (has #)
- ❌ SEO is harder
- ❌ Hash is not sent to server

**Best for:**
- Local development
- Static hosting (GitHub Pages)
- Legacy browser support

### HTML5 History Mode

```javascript
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes
})
```

**URLs look like:**
- `http://example.com/`
- `http://example.com/about`
- `http://example.com/node/123`

**Pros:**
- ✅ Clean URLs
- ✅ Better for SEO
- ✅ More professional appearance

**Cons:**
- ❌ Requires server configuration
- ❌ Will get 404s without proper setup

**Server configuration needed:**

```nginx
# Nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

```apache
# Apache (.htaccess)
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

**Why is server config needed?**

When user visits `/node/123` directly:
1. Browser requests `/node/123` from server
2. Server looks for `/node/123.html` or `/node/123/index.html`
3. File doesn't exist → 404 error
4. **Solution:** Server should return `index.html` for all routes
5. Vue Router then handles the `/node/123` route client-side

### Base URL

If your app is deployed to a subdirectory:

```javascript
const router = createRouter({
  history: createWebHistory('/my-app/'),
  routes
})

// URLs will be:
// https://example.com/my-app/
// https://example.com/my-app/about
```

**With Vite:**
```javascript
// vite.config.js
export default {
  base: '/my-app/'
}

// router/index.js
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})
```

---

## Best Practices

### 1. File Organization

```
src/
├── views/              # Route components (pages)
│   ├── Home.vue
│   ├── About.vue
│   └── NodeDetail.vue
├── components/         # Reusable components
│   ├── Navigation.vue
│   └── NodeCard.vue
└── router/
    └── index.js        # Router configuration
```

### 2. Always Use Named Routes

```javascript
// ✅ Good: Named routes
const routes = [
  {
    path: '/node/:id',
    name: 'node-detail',
    component: NodeDetail
  }
]

// Navigate
router.push({ name: 'node-detail', params: { id: 123 } })

// Link
<router-link :to="{ name: 'node-detail', params: { id: 123 } }">
```

**Why?**
- Easier refactoring (change path in one place)
- Type safety with TypeScript
- Auto-completion in IDE
- No string concatenation errors

### 3. Make Route Params Reactive

```vue
<script setup>
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// ✅ Reactive
const id = computed(() => route.params.id)

// Or use watch
watch(
  () => route.params.id,
  (id) => {
    fetchData(id)
  },
  { immediate: true }  // Run immediately on mount
)
</script>
```

### 4. Content Server Specific Patterns

```javascript
// Content Server route patterns
const routes = [
  // Node browsing
  {
    path: '/browse/:nodeId?',
    name: 'browse',
    component: NodeBrowser
  },

  // Document viewing
  {
    path: '/document/:documentId',
    name: 'document-view',
    component: DocumentViewer
  },

  // Search with query params
  {
    path: '/search',
    name: 'search',
    component: Search
    // URL: /search?q=invoice&type=document&dateFrom=2024-01-01
  },

  // WebReports
  {
    path: '/webreport/:reportId',
    name: 'webreport',
    component: WebReportViewer
  }
]
```

---

## Common Patterns

### Pattern 1: Breadcrumb Navigation

```vue
<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const breadcrumbs = computed(() => {
  return route.matched.map(record => ({
    name: record.meta.breadcrumb || record.name,
    path: record.path
  }))
})
</script>

<template>
  <nav class="breadcrumb">
    <router-link
      v-for="(crumb, index) in breadcrumbs"
      :key="index"
      :to="crumb.path"
    >
      {{ crumb.name }}
    </router-link>
  </nav>
</template>
```

### Pattern 2: Pagination with Query Params

```vue
<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const currentPage = computed(() => parseInt(route.query.page) || 1)

function goToPage(page) {
  router.push({
    query: {
      ...route.query,
      page
    }
  })
}
</script>

<template>
  <div class="pagination">
    <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1">
      Previous
    </button>

    <span>Page {{ currentPage }}</span>

    <button @click="goToPage(currentPage + 1)">
      Next
    </button>
  </div>
</template>
```

### Pattern 3: Filter Sidebar

```vue
<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const filters = computed(() => ({
  type: route.query.type || 'all',
  status: route.query.status || 'active',
  owner: route.query.owner || ''
}))

function updateFilter(key, value) {
  router.push({
    query: {
      ...route.query,
      [key]: value,
      page: 1  // Reset to page 1
    }
  })
}

function clearFilters() {
  router.push({ query: {} })
}
</script>

<template>
  <aside class="filters">
    <h3>Filters</h3>

    <div>
      <label>Type</label>
      <select
        :value="filters.type"
        @change="updateFilter('type', $event.target.value)"
      >
        <option value="all">All</option>
        <option value="folder">Folders</option>
        <option value="document">Documents</option>
      </select>
    </div>

    <button @click="clearFilters">Clear All</button>
  </aside>
</template>
```

---

## Troubleshooting

### Issue 1: Component Not Updating on Route Change

**Problem:**
```vue
<script setup>
const route = useRoute()
const id = route.params.id  // ❌ Doesn't update!

onMounted(() => {
  fetchData(id)  // Only runs once!
})
</script>
```

**Solution:**
```vue
<script setup>
const route = useRoute()

watch(
  () => route.params.id,
  (id) => {
    fetchData(id)  // ✅ Runs on every route change!
  },
  { immediate: true }
)
</script>
```

### Issue 2: 404 on Page Refresh (History Mode)

**Problem:** Visiting `/node/123` directly gives 404

**Solution:** Configure your server to return `index.html` for all routes

### Issue 3: Base URL Issues in Production

**Problem:** Links break when app is deployed to subdirectory

**Solution:**
```javascript
// vite.config.js
export default {
  base: process.env.NODE_ENV === 'production' ? '/my-app/' : '/'
}
```

### Issue 4: Cannot Read params.id

**Problem:**
```javascript
const id = route.params.id  // undefined!
```

**Possible causes:**
1. Route doesn't have `:id` parameter
2. Using wrong route path
3. Params name mismatch

**Solution:** Check route definition matches param name

---

## Summary

### Key Takeaways

1. **Vue Router enables SPAs** with multiple views and clean URLs
2. **Use `<router-view>`** to render current route component
3. **Use `<router-link>`** for declarative navigation
4. **Use `useRouter()` and `useRoute()`** in Composition API
5. **Make params reactive** with `computed()` or `watch()`
6. **Params are for required data**, query strings for optional
7. **Named routes** make refactoring easier
8. **History mode** requires server configuration

### Next Steps

1. ✅ Complete the exercises in README.md
2. ✅ Build the Content Server Node Browser
3. ✅ Experiment with dynamic routes and query params
4. ✅ Move on to [Lesson 2: Vue Router Advanced](../02-vue-router-advanced/README.md)

---

**Time to master:** 2-3 hours of practice
**Difficulty:** Intermediate
**Essential for:** Any multi-page Vue application
