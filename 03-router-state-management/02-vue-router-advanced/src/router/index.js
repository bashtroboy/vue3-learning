import { createRouter, createWebHistory } from 'vue-router'
import { authService } from '../services/auth'

// Eager-loaded components (always loaded)
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'

// Lazy-loaded components (loaded on demand)
const AdminLayout = () => import('../views/admin/AdminLayout.vue')
const AdminDashboard = () => import('../views/admin/AdminDashboard.vue')
const UserManagement = () => import('../views/admin/UserManagement.vue')
const Settings = () => import('../views/admin/Settings.vue')
const Reports = () => import('../views/admin/Reports.vue')
const NotFound = () => import('../views/NotFound.vue')
const Unauthorized = () => import('../views/Unauthorized.vue')

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: {
      title: 'Home'
    }
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: {
      title: 'Login'
    },
    beforeEnter: (to, from, next) => {
      // Redirect to home if already logged in
      if (authService.isAuthenticated()) {
        next({ name: 'home' })
      } else {
        next()
      }
    }
  },
  {
    path: '/admin',
    component: AdminLayout,
    meta: {
      requiresAuth: true,
      breadcrumb: 'Admin'
    },
    beforeEnter: (to, from, next) => {
      // Check if user is admin before allowing access to admin section
      if (authService.isAdmin()) {
        next()
      } else {
        next({ name: 'unauthorized' })
      }
    },
    children: [
      {
        path: '',
        name: 'admin-dashboard',
        component: AdminDashboard,
        meta: {
          title: 'Admin Dashboard',
          requiresAuth: true,
          breadcrumb: 'Dashboard'
        }
      },
      {
        path: 'users',
        name: 'admin-users',
        component: UserManagement,
        meta: {
          title: 'User Management',
          requiresAuth: true,
          requiresAdmin: true,
          permissions: ['users.read'],
          breadcrumb: 'Users'
        }
      },
      {
        path: 'settings',
        name: 'admin-settings',
        component: Settings,
        meta: {
          title: 'Settings',
          requiresAuth: true,
          requiresAdmin: true,
          permissions: ['settings.read'],
          breadcrumb: 'Settings'
        }
      },
      {
        path: 'reports',
        name: 'admin-reports',
        component: Reports,
        meta: {
          title: 'Reports',
          requiresAuth: true,
          permissions: ['reports.read'],
          breadcrumb: 'Reports'
        }
      }
    ]
  },
  {
    path: '/unauthorized',
    name: 'unauthorized',
    component: Unauthorized,
    meta: {
      title: 'Unauthorized'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFound,
    meta: {
      title: '404 - Not Found'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// Global navigation guard for authentication
router.beforeEach((to, from, next) => {
  // Update document title
  document.title = to.meta.title ? `${to.meta.title} - Admin Dashboard` : 'Admin Dashboard'

  // Check authentication requirement
  if (to.meta.requiresAuth && !authService.isAuthenticated()) {
    // Store the intended destination
    next({
      name: 'login',
      query: { redirect: to.fullPath }
    })
    return
  }

  // Check permission requirements
  if (to.meta.permissions) {
    const hasAllPermissions = to.meta.permissions.every(permission =>
      authService.hasPermission(permission)
    )

    if (!hasAllPermissions) {
      next({ name: 'unauthorized' })
      return
    }
  }

  next()
})

// Global after hook for analytics or logging
router.afterEach((to, from) => {
  // You could send analytics here
  console.log(`Navigated from ${from.path} to ${to.path}`)
})

// Error handler
router.onError((error) => {
  console.error('Router error:', error)
})

export default router
