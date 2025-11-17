import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean
    title?: string
  }
}

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/Home.vue'),
    meta: { title: 'Home' }
  },
  {
    path: '/nodes',
    name: 'nodes',
    component: () => import('../views/Nodes.vue'),
    meta: { requiresAuth: true, title: 'Nodes' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
