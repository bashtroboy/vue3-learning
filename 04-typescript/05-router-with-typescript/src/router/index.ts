import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

// Augment route meta type
declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean
    title?: string
    roles?: string[]
  }
}

// Define routes with full typing
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/Home.vue'),
    meta: {
      title: 'Home'
    }
  },
  {
    path: '/nodes',
    name: 'nodes',
    component: () => import('../views/Nodes.vue'),
    meta: {
      requiresAuth: true,
      title: 'Nodes'
    }
  },
  {
    path: '/nodes/:id',
    name: 'node-detail',
    component: () => import('../views/NodeDetail.vue'),
    meta: {
      requiresAuth: true,
      title: 'Node Detail'
    },
    props: (route) => ({ id: Number(route.params.id) })
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Typed navigation guard
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !isAuthenticated()) {
    next({ name: 'home' })
  } else {
    next()
  }
})

function isAuthenticated(): boolean {
  return true // Simplified for demo
}

export default router
