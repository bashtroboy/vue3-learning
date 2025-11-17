import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import NodeDetail from '../views/NodeDetail.vue'
import Search from '../views/Search.vue'
import About from '../views/About.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: {
      title: 'Home - Content Server Browser'
    }
  },
  {
    path: '/node/:id',
    name: 'node-detail',
    component: NodeDetail,
    meta: {
      title: 'Node Detail'
    }
  },
  {
    path: '/search',
    name: 'search',
    component: Search,
    meta: {
      title: 'Search'
    }
  },
  {
    path: '/about',
    name: 'about',
    component: About,
    meta: {
      title: 'About'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Update page title on route change
router.afterEach((to) => {
  document.title = to.meta.title || 'Content Server Browser'
})

export default router
