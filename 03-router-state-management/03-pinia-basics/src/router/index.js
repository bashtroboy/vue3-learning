import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import NodeDetail from '@/views/NodeDetail.vue'

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
    props: true
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
