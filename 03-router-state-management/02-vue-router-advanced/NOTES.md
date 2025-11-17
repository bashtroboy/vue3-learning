# Vue Router Advanced - Deep Dive Notes

## Navigation Guards

### Guard Execution Order

1. **In-Component Guards** (on the component being left)
   - `beforeRouteLeave`

2. **Global Before Guards**
   - `router.beforeEach`

3. **Route Configuration Guards**
   - `beforeEnter`

4. **In-Component Guards** (on the component being entered)
   - `beforeRouteEnter`

5. **Global Resolve Guards**
   - `router.beforeResolve`

6. **Navigation Confirmed**

7. **Global After Hooks**
   - `router.afterEach`

8. **DOM Updates**

9. **In-Component Callbacks**
   - Callback in `beforeRouteEnter`

### Guard Return Values

Guards can return:
- `false` - Cancel navigation
- `undefined` / `true` - Confirm navigation
- Route location object - Redirect to different route
- Error - Cancel navigation and pass error to `router.onError()`

## Nested Routes

### Key Concepts

1. **Parent route must have `<router-view>`** to display children
2. **Child paths are relative** - no leading slash
3. **Empty path child** - matches parent route exactly
4. **Named views** - multiple router-views in one route

### Layout Pattern

```
AdminLayout (parent)
  ├── <router-view /> (renders children)
  │   ├── AdminDashboard (child with path: '')
  │   ├── UserManagement (child with path: 'users')
  │   └── Settings (child with path: 'settings')
```

## Lazy Loading

### Benefits

1. **Smaller initial bundle** - Faster initial load
2. **On-demand loading** - Components loaded when needed
3. **Code splitting** - Separate chunks for different routes

### Strategies

```javascript
// Basic lazy loading
component: () => import('./views/About.vue')

// With webpack chunk names
component: () => import(/* webpackChunkName: "admin" */ './views/Admin.vue')

// Prefetching - download during idle time
component: () => import(/* webpackPrefetch: true */ './views/Dashboard.vue')

// Preloading - download in parallel with parent
component: () => import(/* webpackPreload: true */ './views/Critical.vue')
```

## Authentication Patterns

### Token Storage Options

1. **localStorage** - Persists across sessions, XSS vulnerable
2. **sessionStorage** - Cleared on tab close
3. **Memory only** - Most secure, lost on refresh
4. **Cookies** - Can be httpOnly (CSRF vulnerable)

### Best Practices

1. **Store minimal data** - Just token and user ID
2. **Validate on server** - Never trust client
3. **Refresh tokens** - Automatic renewal
4. **Logout on 401** - Handle unauthorized globally

## Route Meta Fields

### Common Uses

```javascript
meta: {
  requiresAuth: true,      // Authentication required
  requiresAdmin: true,     // Admin role required
  permissions: [],         // Required permissions
  title: 'Page Title',     // Document title
  breadcrumb: 'Label',     // Breadcrumb text
  layout: 'admin',         // Layout component
  keepAlive: true,         // Cache component
  transition: 'fade'       // Transition name
}
```

## Route Transitions

### Transition Modes

- `in-out` - New element transitions in first, then current element transitions out
- `out-in` - Current element transitions out first, then new element transitions in (most common)
- No mode - Both elements transition simultaneously

### Performance Tips

1. **Use CSS transitions** - Hardware accelerated
2. **Avoid layout triggers** - opacity and transform are fast
3. **Keep short** - 200-300ms is good
4. **Test on slow devices** - May need to disable

## Error Handling

### Navigation Failures

```javascript
import { NavigationFailureType, isNavigationFailure } from 'vue-router'

router.push('/admin').catch(failure => {
  if (isNavigationFailure(failure, NavigationFailureType.aborted)) {
    // Navigation aborted
  } else if (isNavigationFailure(failure, NavigationFailureType.cancelled)) {
    // Navigation cancelled
  } else if (isNavigationFailure(failure, NavigationFailureType.duplicated)) {
    // Navigation to same location
  }
})
```

### Global Error Handler

```javascript
router.onError(error => {
  console.error('Navigation error:', error)
  // Show error notification
  // Log to error tracking service
})
```

## Advanced Patterns

### Redirect After Login

```javascript
// Store intended route
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !isAuthenticated()) {
    next({
      name: 'login',
      query: { redirect: to.fullPath }
    })
  } else {
    next()
  }
})

// After login, redirect back
async function login(credentials) {
  await authenticate(credentials)
  const redirect = route.query.redirect || '/'
  router.push(redirect)
}
```

### Per-Route Configuration

```javascript
{
  path: '/admin',
  component: AdminLayout,
  beforeEnter: (to, from, next) => {
    // Only runs when entering /admin routes
    if (user.isAdmin) {
      next()
    } else {
      next('/unauthorized')
    }
  }
}
```

### Component Guards with Composition API

```javascript
import { onBeforeRouteLeave, onBeforeRouteUpdate } from 'vue-router'

// Warn before leaving unsaved form
onBeforeRouteLeave((to, from, next) => {
  if (hasUnsavedChanges.value) {
    const answer = confirm('Leave without saving?')
    next(answer)
  } else {
    next()
  }
})

// React to route param changes
onBeforeRouteUpdate((to, from, next) => {
  loadData(to.params.id)
  next()
})
```

## Testing

### Testing Routes

```javascript
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'

const router = createRouter({
  history: createMemoryHistory(),
  routes: [/* your routes */]
})

const wrapper = mount(App, {
  global: {
    plugins: [router]
  }
})

// Navigate and test
await router.push('/admin')
await router.isReady()
expect(wrapper.html()).toContain('Admin Dashboard')
```

### Testing Guards

```javascript
describe('Auth Guard', () => {
  it('redirects to login when not authenticated', async () => {
    const to = { path: '/admin', meta: { requiresAuth: true } }
    const from = { path: '/' }
    const next = vi.fn()

    authGuard(to, from, next)

    expect(next).toHaveBeenCalledWith({ name: 'login' })
  })
})
```

## Performance Optimization

### Route-Based Code Splitting

```javascript
const routes = [
  {
    path: '/dashboard',
    component: () => import('./views/Dashboard.vue')
  },
  {
    path: '/admin',
    component: () => import('./layouts/AdminLayout.vue'),
    children: [
      {
        path: 'users',
        component: () => import('./views/admin/Users.vue')
      }
    ]
  }
]
```

### Prefetching Strategy

```javascript
// Prefetch when hovering over link
<router-link
  to="/admin"
  @mouseenter="prefetchAdmin"
>
  Admin
</router-link>

<script setup>
function prefetchAdmin() {
  import('./views/Admin.vue')
}
</script>
```

## Common Pitfalls

1. **Forgetting next()** - Navigation will hang
2. **Calling next() multiple times** - Errors in console
3. **Infinite redirects** - Guard logic error
4. **Not handling async guards** - Race conditions
5. **Catch-all route position** - Must be last
6. **Losing reactivity** - Use computed for route.params

## Security Considerations

1. **Never trust client-side auth** - Always validate server-side
2. **Don't expose sensitive routes** - Remove from production build
3. **Rate limit navigation** - Prevent route brute-forcing
4. **Validate route params** - Prevent injection attacks
5. **Use HTTPS** - Protect tokens in transit

## Best Practices Summary

1. **Use named routes** - Easier to maintain
2. **Guard both globally and per-route** - Defense in depth
3. **Lazy load large components** - Better performance
4. **Handle navigation errors** - Better UX
5. **Use route meta** - Keep route config DRY
6. **Test your guards** - Critical for auth
7. **Document guard logic** - Complex flows need explanation
8. **Keep guards simple** - Complex logic in services
9. **Handle async properly** - Use async/await
10. **Monitor navigation** - Track analytics and errors
