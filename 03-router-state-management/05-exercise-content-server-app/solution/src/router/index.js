import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Home from '@/views/Home.vue'
import NodeDetail from '@/views/NodeDetail.vue'
import Search from '@/views/Search.vue'
import Favorites from '@/views/Favorites.vue'
import Settings from '@/views/Settings.vue'
import Login from '@/views/Login.vue'
import NotFound from '@/views/NotFound.vue'

const routes = [
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: { public: true, title: 'Login' }
  },
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: { requiresAuth: true, title: 'Home' }
  },
  {
    path: '/node/:id',
    name: 'node-detail',
    component: NodeDetail,
    props: true,
    meta: { requiresAuth: true, title: 'Node Detail' }
  },
  {
    path: '/search',
    name: 'search',
    component: Search,
    meta: { requiresAuth: true, title: 'Search' }
  },
  {
    path: '/favorites',
    name: 'favorites',
    component: Favorites,
    meta: { requiresAuth: true, title: 'Favorites' }
  },
  {
    path: '/settings',
    name: 'settings',
    component: Settings,
    meta: { requiresAuth: true, title: 'Settings' }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFound,
    meta: { title: '404 Not Found' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard for authentication
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  // Update page title
  document.title = to.meta.title
    ? `${to.meta.title} - Content Server Explorer`
    : 'Content Server Explorer'

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    // Redirect to login if not authenticated
    next({ name: 'login', query: { redirect: to.fullPath } })
  } else if (to.name === 'login' && authStore.isAuthenticated) {
    // Redirect to home if already authenticated
    next({ name: 'home' })
  } else {
    next()
  }
})

export default router
