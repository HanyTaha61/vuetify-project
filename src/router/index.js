import Vue from 'vue'
import VueRouter from 'vue-router'
import Projects from '../views/projects.vue'
import Home from '../views/dashboard.vue'
import Team from '../views/team.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/projects',
    name: 'projects',
    component: Projects
  },
  {
    path: '/team',
    name: 'team',
    component: Team
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
