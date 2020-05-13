import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from "@pages/home/index.vue";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/list',
    name: 'List',
    component: () => import('@pages/list/index.vue')
  },
  {
    path: '/communication',
    name: 'Communication',
    component: () => import('@pages/communication/index.vue')
  },
]

export default routes
