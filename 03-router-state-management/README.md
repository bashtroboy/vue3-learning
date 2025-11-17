# Section 3: Router & State Management

## 🎯 Overview

This section bridges the gap between learning Vue fundamentals and building production applications. You'll master Vue Router for navigation and Pinia for state management—two essential tools for building real-world, multi-page applications.

## Prerequisites

Before starting this section, you should have completed:
- ✅ **Section 1: Fundamentals** (Lessons 1-6 + Exercise)
- ✅ **Section 2: Composition API** (Lessons 1-6 + Exercise)
- ✅ Understanding of components, reactivity, and composables
- ✅ Comfortable with Vue 3 `<script setup>` syntax

## 📚 Lessons

### Lesson 1: Vue Router Basics
**Topics:** Routing fundamentals, route configuration, navigation, dynamic routes, route parameters

**What You'll Build:** Content Server node browser with multi-page navigation

**Key Concepts:**
- Setting up Vue Router
- Defining routes and route components
- Router links and navigation
- Dynamic route parameters (`:id`)
- Accessing route params with `useRoute()`
- Programmatic navigation with `useRouter()`
- Query parameters for filtering

**Time:** 2-3 hours

---

### Lesson 2: Vue Router Advanced
**Topics:** Nested routes, navigation guards, route meta fields, lazy loading

**What You'll Build:** Protected admin interface with role-based access

**Key Concepts:**
- Nested routes and `<router-view>`
- Route guards (beforeEach, beforeEnter, beforeRouteEnter)
- Navigation guards for authentication
- Route meta fields for permissions
- Lazy loading route components
- Route transitions
- Handling 404 pages
- Breadcrumb navigation

**Time:** 2-3 hours

---

### Lesson 3: Pinia State Management
**Topics:** Pinia setup, stores, state, getters, actions, composition API style

**What You'll Build:** Content Server object cache and user preferences store

**Key Concepts:**
- Installing and setting up Pinia
- Creating stores with `defineStore()`
- State management patterns
- Getters for computed state
- Actions for business logic
- Using stores in components
- Composition API store syntax
- State persistence
- DevTools integration

**Time:** 2-3 hours

---

### Lesson 4: Pinia Advanced Patterns
**Topics:** Multiple stores, store composition, plugins, TypeScript, testing

**What You'll Build:** Multi-store application with API integration

**Key Concepts:**
- Multiple stores and dependencies
- Store composition patterns
- Cross-store communication
- Pinia plugins (persistence, sync)
- API integration in actions
- Loading and error states
- Optimistic updates
- Store reset and hydration
- Testing stores

**Time:** 2-3 hours

---

### Lesson 5: Exercise - Content Server Explorer
**Capstone Project:** Build a multi-page Content Server application with routing and state management

**Integration:** Combines all concepts from Lessons 1-4

**Features:**
- Multi-page navigation (Browse, Search, Favorites, Settings)
- Route-based node viewing
- Global state for current user and preferences
- Content Server API integration
- Navigation guards for auth
- Persistent favorites in Pinia
- Search with query parameters
- Lazy-loaded route components

**Time:** 4-6 hours

---

## 🎓 Learning Path

```
Section 2: Composition API
       ↓
01. Vue Router Basics ─────→ Navigation & routing fundamentals
       ↓
02. Vue Router Advanced ───→ Guards, nested routes, lazy loading
       ↓
03. Pinia Basics ──────────→ State management fundamentals
       ↓
04. Pinia Advanced ────────→ Multi-store patterns, plugins
       ↓
05. Exercise ──────────────→ Content Server Explorer (Capstone)
       ↓
Section 4: Real Tools
```

## 🎯 Learning Objectives

By the end of this section, you will be able to:

1. ✅ Set up and configure Vue Router in a Vue 3 application
2. ✅ Create multi-page applications with navigation
3. ✅ Use dynamic routes and route parameters
4. ✅ Implement navigation guards for authentication
5. ✅ Create nested routes for complex layouts
6. ✅ Set up Pinia for state management
7. ✅ Create and use multiple stores
8. ✅ Integrate API calls with Pinia actions
9. ✅ Persist state across page reloads
10. ✅ Build production-ready SPA applications

## 📊 Section Statistics

- **Lessons:** 4 lessons + 1 exercise
- **Total Time:** 12-16 hours
- **Code Examples:** 40+ working examples
- **Projects:** 5 hands-on projects
- **Difficulty:** Intermediate

## 🛠️ What You'll Build

### Lesson Projects
1. **Node Browser** - Multi-page navigation for Content Server nodes
2. **Admin Interface** - Protected routes with role-based access
3. **Object Cache** - Pinia store for API response caching
4. **Multi-Store App** - Coordinated state across multiple stores

### Capstone Exercise
**Content Server Explorer** - A complete SPA featuring:
- Browse nodes by hierarchy
- Search with filters (query params)
- Favorites management (persisted)
- User settings and preferences
- Authentication and route guards
- API integration with error handling
- Loading states and optimistic updates

## 🎨 Key Patterns Covered

### 1. Route Configuration
```javascript
const routes = [
  { path: '/', component: Home },
  { path: '/node/:id', component: NodeDetail },
  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAuth: true },
    children: [
      { path: 'users', component: Users },
      { path: 'settings', component: Settings }
    ]
  }
]
```

### 2. Using Router in Components
```vue
<script setup>
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const nodeId = route.params.id

function navigateToNode(id) {
  router.push(`/node/${id}`)
}
</script>
```

### 3. Navigation Guards
```javascript
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !isAuthenticated()) {
    next('/login')
  } else {
    next()
  }
})
```

### 4. Pinia Store
```javascript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useContentServerStore = defineStore('contentServer', () => {
  const nodes = ref([])
  const currentNode = ref(null)

  const nodeCount = computed(() => nodes.value.length)

  async function fetchNode(id) {
    const response = await api.getNode(id)
    currentNode.value = response.data
  }

  return { nodes, currentNode, nodeCount, fetchNode }
})
```

### 5. Using Store in Components
```vue
<script setup>
import { useContentServerStore } from '@/stores/contentServer'

const store = useContentServerStore()

// Access state
const nodes = store.nodes

// Call actions
store.fetchNode(123)
</script>
```

## 📖 Recommended Learning Path

### For Beginners (from Section 2)
1. Start with Lesson 1 (Vue Router Basics)
2. Work through lessons sequentially
3. Build each lesson's project
4. Read NOTES.md for deep understanding
5. Complete the capstone exercise

### For Experienced Developers
1. Review README for each lesson
2. Focus on Pinia if you know routing
3. Focus on Vue Router if you know state management
4. Jump to the capstone exercise
5. Use as reference documentation

### For Quick Reference
- Use lesson READMEs for syntax and examples
- Check NOTES.md for deep explanations
- Review solution code for patterns
- Use search to find specific topics

## 🔗 Why These Tools Matter

### Vue Router is Essential For:
- Multi-page applications (SPAs)
- Deep linking to specific content
- Browser back/forward navigation
- SEO-friendly URLs
- Code splitting by route
- Authentication flows

### Pinia is Essential For:
- Sharing state between components
- Caching API responses
- Managing complex application state
- User session and preferences
- Centralized business logic
- DevTools debugging

## 🔗 Relationship to Real Projects

These patterns are used in:
- **Your Goal:** Content Server tools (Node Browser, Query Builder, Dashboard)
- **Content Management Systems:** WordPress admin, Drupal
- **Enterprise Apps:** Salesforce, SAP
- **SaaS Applications:** GitHub, GitLab, Notion
- **All modern Vue applications:** Nuxt, Quasar, VuePress

## 📚 Additional Resources

- [Vue Router Documentation](https://router.vuejs.org/)
- [Pinia Documentation](https://pinia.vuejs.org/)
- [Vue Router Migration Guide](https://router.vuejs.org/guide/migration/)
- [Pinia vs Vuex](https://pinia.vuejs.org/introduction.html#comparison-with-vuex)

## 🚀 Getting Started

```bash
# Navigate to a lesson
cd 03-router-state-management/01-vue-router-basics

# Install dependencies
npm install

# Run development server
npm run dev
```

Each lesson follows the same structure:
- `README.md` - Quick reference and examples
- `NOTES.md` - Deep technical documentation
- `src/` - Working code examples
- `package.json` - Dependencies and scripts

## 💡 Tips for Success

1. **Understand the Problem** - Know why you need routing and state management
2. **Start Simple** - Basic routing before nested routes and guards
3. **Build Real Examples** - Use Content Server context
4. **Use DevTools** - Vue DevTools shows routes and Pinia state
5. **Read Official Docs** - Both Vue Router and Pinia have excellent documentation
6. **Practice Patterns** - Try different ways to structure stores
7. **Plan Your Routes** - Sketch out your app's navigation before coding

## ⚠️ Common Pitfalls

- **Too many stores** - Don't create a store for every component
- **Prop drilling** - Use Pinia when passing props gets messy, not immediately
- **Complex routes** - Keep route structure simple and logical
- **Forgetting navigation guards** - Always protect routes that need auth
- **Mutating state directly** - Always use actions to modify Pinia state
- **Over-engineering** - Start simple, add complexity when needed

## 🎓 After This Section

You'll be ready for:
- **Section 4: Real Tools** - Build production Content Server utilities
- **Section 5: Testing & Production** - Professional development practices
- **Section 6: Migration Patterns** - Vue 2 → Vue 3 migration
- **Real Projects** - You can build complete applications!

---

**This section is the bridge from learning to building real applications!** 🚀

Start with [Lesson 1: Vue Router Basics](./01-vue-router-basics/README.md)
