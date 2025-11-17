import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Home from '@/views/Home.vue'
import NodeDetail from '@/views/NodeDetail.vue'
import Search from '@/views/Search.vue'
import Favorites from '@/views/Favorites.vue'
import Settings from '@/views/Settings.vue'
import Login from '@/views/Login.vue'
import NotFound from '@/views/NotFound.vue'

// TODO: Define all routes
// Include: login, home, node-detail (with :id param), search, favorites, settings, not-found
// Add meta data for requiresAuth and title
const routes = [
  // TODO: Add your routes here
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// TODO: Add navigation guard for authentication
// - Check if route requires auth
// - Redirect to login if not authenticated
// - Redirect to home if already authenticated and trying to access login
// - Update page title based on route meta

export default router
