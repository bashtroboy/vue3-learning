# Content Server Explorer - Starter

This is the starter code for the final exercise. Your task is to complete the implementation by filling in the TODO sections.

## Setup

```bash
npm install
npm run dev
```

## Your Tasks

### 1. Complete the Stores

- **stores/auth.js** - Implement authentication logic
- **stores/contentServer.js** - Implement node fetching with caching
- **stores/favorites.js** - Implement favorites with optimistic updates
- **stores/preferences.js** - Implement preferences with persistence
- **stores/search.js** - Implement search functionality

### 2. Complete the Router

- **router/index.js** - Add all routes and authentication guard

### 3. Complete the Views

- **views/Home.vue** - Display nodes with cache management
- **views/NodeDetail.vue** - Show node details with favorites
- **views/Search.vue** - Implement search with filters
- **views/Favorites.vue** - Display favorite nodes
- **views/Settings.vue** - Implement settings panel
- **views/Login.vue** - Login form (mostly complete)
- **views/NotFound.vue** - 404 page (mostly complete)

### 4. Test Your Implementation

- Login with demo/demo
- Browse and search nodes
- Add/remove favorites
- Change settings
- Verify persistence after page reload

## Tips

- Refer to Lessons 3 and 4 for examples
- Check the solution folder if you get stuck
- Test each feature as you implement it
- Use the browser console to debug
- Check Vue DevTools for Pinia state

## Success Criteria

- All routes work correctly
- Authentication guard prevents unauthorized access
- Favorites persist after reload
- Settings persist after reload
- Search works with filters
- Cache reduces duplicate API calls
- Optimistic updates provide instant feedback
