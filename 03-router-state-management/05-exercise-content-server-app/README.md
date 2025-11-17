# Exercise: Content Server Explorer

## 🎯 Capstone Project

Build a complete multi-page Content Server application that combines everything you've learned about Vue Router and Pinia.

## 📋 Requirements

### Features to Implement

1. **Multi-page Navigation**
   - Home/Browse page
   - Node detail page (dynamic route)
   - Search page
   - Favorites page
   - Settings page

2. **Routing**
   - Vue Router with history mode
   - Dynamic routes for nodes (`/node/:id`)
   - Query parameters for search and filters
   - Nested routes for admin section
   - Navigation guards for authentication
   - 404 page for invalid routes

3. **State Management**
   - Content Server nodes store
   - User authentication store
   - Favorites store (persisted)
   - Preferences store (persisted)
   - Search history store

4. **Advanced Features**
   - Node caching with TTL
   - Optimistic updates for favorites
   - Request deduplication
   - Loading states
   - Error handling
   - Breadcrumb navigation

## 🏗️ Project Structure

```
05-exercise-content-server-app/
├── starter/                    # Starting point
│   ├── src/
│   │   ├── views/
│   │   │   ├── Home.vue
│   │   │   ├── NodeDetail.vue
│   │   │   ├── Search.vue
│   │   │   ├── Favorites.vue
│   │   │   ├── Settings.vue
│   │   │   └── NotFound.vue
│   │   ├── components/
│   │   │   ├── Navigation.vue
│   │   │   ├── NodeCard.vue
│   │   │   ├── Breadcrumbs.vue
│   │   │   └── SearchFilters.vue
│   │   ├── stores/
│   │   │   ├── nodes.js
│   │   │   ├── auth.js
│   │   │   ├── favorites.js
│   │   │   ├── preferences.js
│   │   │   └── search.js
│   │   ├── router/
│   │   │   └── index.js
│   │   ├── plugins/
│   │   │   └── persistence.js
│   │   ├── composables/
│   │   │   └── useNodeCache.js
│   │   ├── App.vue
│   │   └── main.js
│   └── package.json
└── solution/                   # Complete solution
```

## 📝 Detailed Requirements

### 1. Home/Browse Page

**Route:** `/`

**Features:**
- Display list of nodes from Content Server
- Filter by type (folder, document, all)
- Sort by name, date, type
- Pagination
- Click node to view details

**Store Actions:**
- `fetchNodes()` - Load all nodes
- Filter and sort using getters

### 2. Node Detail Page

**Route:** `/node/:id`

**Features:**
- Display node metadata
- Breadcrumb navigation showing path
- Add/remove from favorites button
- Link to parent node
- List of child nodes (if folder)

**Store Actions:**
- `fetchNode(id)` - Load single node
- `addToFavorites(id)` - Add to favorites
- `removeFromFavorites(id)` - Remove from favorites

### 3. Search Page

**Route:** `/search?q=...&type=...&owner=...`

**Features:**
- Search input
- Filters (type, owner, date range)
- Results list
- Update URL query params on filter change
- Search history (last 10 searches)

**Store Actions:**
- `search(query, filters)` - Search nodes
- `addToHistory(query)` - Save search to history

### 4. Favorites Page

**Route:** `/favorites`

**Features:**
- Display favorited nodes
- Remove from favorites
- Empty state if no favorites
- Persist favorites in localStorage

**Store:**
- Favorites store with persistence plugin
- Optimistic updates

### 5. Settings Page

**Route:** `/settings`

**Features:**
- Theme selection (light/dark)
- Items per page setting
- Default view (list/grid)
- Clear cache button
- Clear favorites button

**Store:**
- Preferences store with persistence
- Settings apply immediately

### 6. Authentication Guard

**Implementation:**
- Mock authentication (username/password)
- Login page at `/login`
- Redirect to login if not authenticated
- Redirect to intended page after login
- Logout functionality

### 7. Stores to Implement

#### Nodes Store
```javascript
// stores/nodes.js
export const useNodesStore = defineStore('nodes', () => {
  const nodes = ref([])
  const currentNode = ref(null)
  const loading = ref(false)
  const error = ref(null)

  async function fetchNodes() { /* ... */ }
  async function fetchNode(id) { /* ... */ }
  function clearCache() { /* ... */ }

  return { /* ... */ }
})
```

#### Auth Store
```javascript
// stores/auth.js
export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(null)
  const isAuthenticated = computed(() => !!token.value)

  async function login(credentials) { /* ... */ }
  function logout() { /* ... */ }

  return { /* ... */ }
})
```

#### Favorites Store (with persistence)
```javascript
// stores/favorites.js
export const useFavoritesStore = defineStore('favorites', () => {
  const favoriteIds = ref([])

  function addFavorite(id) { /* ... */ }
  function removeFavorite(id) { /* ... */ }
  function isFavorite(id) { /* ... */ }

  return { /* ... */ }
}, {
  persist: true  // Custom option for persistence plugin
})
```

### 8. Router Configuration

```javascript
// router/index.js
const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/node/:id',
    name: 'node-detail',
    component: NodeDetail,
    meta: { requiresAuth: true }
  },
  {
    path: '/search',
    name: 'search',
    component: Search
  },
  {
    path: '/favorites',
    name: 'favorites',
    component: Favorites,
    meta: { requiresAuth: true }
  },
  {
    path: '/settings',
    name: 'settings',
    component: Settings
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFound
  }
]

router.beforeEach((to, from, next) => {
  // Implement auth guard
})
```

## 🎨 UI/UX Requirements

1. **Navigation Menu**
   - Home, Search, Favorites, Settings links
   - User menu (logout if authenticated)
   - Active link highlighting

2. **Loading States**
   - Show loading spinner during API calls
   - Disable buttons while loading
   - Skeleton screens for content

3. **Error Handling**
   - Display error messages
   - Retry button for failed requests
   - 404 page for invalid routes

4. **Responsive Design**
   - Mobile-friendly layout
   - Hamburger menu on mobile
   - Responsive grid for node cards

## 🧪 Testing Checklist

### Routing
- [ ] All routes load correctly
- [ ] Dynamic routes work with different IDs
- [ ] Query parameters update URL
- [ ] Browser back/forward buttons work
- [ ] Auth guard redirects to login
- [ ] After login, redirects to intended page
- [ ] 404 page shows for invalid routes

### State Management
- [ ] Nodes load and display
- [ ] Node detail loads correct data
- [ ] Favorites persist after page reload
- [ ] Settings persist after page reload
- [ ] Search history stores last 10 searches
- [ ] Cache prevents duplicate API calls

### Features
- [ ] Add to favorites (optimistic update)
- [ ] Remove from favorites (optimistic update)
- [ ] Search filters update results
- [ ] Pagination works correctly
- [ ] Sorting works correctly
- [ ] Clear cache clears all cached data

## 💡 Hints

1. **Mock API:**
   ```javascript
   // api/mockData.js
   export const mockNodes = [
     { id: 1, name: 'Documents', type: 'folder', parent_id: null },
     { id: 2, name: 'Invoice.pdf', type: 'document', parent_id: 1 },
     // ... more nodes
   ]

   export const api = {
     async getNodes() {
       await delay(500)
       return { data: mockNodes }
     },
     async getNode(id) {
       await delay(300)
       return { data: mockNodes.find(n => n.id === id) }
     }
   }
   ```

2. **Persistence Plugin:**
   ```javascript
   // plugins/persistence.js
   export function persistencePlugin({ options, store }) {
     if (options.persist) {
       // Load from localStorage
       // Save on changes
     }
   }
   ```

3. **Cache Composable:**
   ```javascript
   // composables/useNodeCache.js
   export function useNodeCache() {
     const cache = new Map()

     function get(id) { /* ... */ }
     function set(id, data, ttl) { /* ... */ }
     function has(id) { /* ... */ }

     return { get, set, has }
   }
   ```

## 📚 Bonus Challenges

1. **Advanced Caching**
   - Implement cache invalidation
   - Add "Refresh" button to force reload
   - Show cache age indicator

2. **Offline Support**
   - Show offline indicator
   - Queue actions when offline
   - Sync when back online

3. **Bulk Operations**
   - Select multiple nodes
   - Bulk add to favorites
   - Bulk delete

4. **Advanced Search**
   - Full-text search
   - Fuzzy matching
   - Search suggestions

## 🏆 Success Criteria

Your project is complete when:
- ✅ All routes work correctly
- ✅ All stores implement required functionality
- ✅ Favorites and settings persist
- ✅ Authentication guard works
- ✅ Caching reduces duplicate requests
- ✅ Optimistic updates provide instant feedback
- ✅ Error handling is graceful
- ✅ UI is responsive and user-friendly

## 🔗 Resources

- [Vue Router Docs](https://router.vuejs.org/)
- [Pinia Docs](https://pinia.vuejs.org/)
- [Previous Lessons](../README.md)

---

**Estimated Time:** 4-6 hours
**Difficulty:** Intermediate-Advanced
**Skills Practiced:** Routing, State Management, Composition, Persistence
