import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@pages/home/index.vue')
  },
  {
    path: '/vue',
    name: 'Home',
    component: () => import('@pages/home/index.vue')
  },
  {
    path: '/vue/list',
    name: 'List',
    component: () => import('@pages/list/index.vue')
  },
  {
    path: '/vue/status',
    name: 'List',
    component: () => import('@pages/status/index.vue')
  },
]

const router = new VueRouter({
  mode: "history",
  routes
});

export default router
