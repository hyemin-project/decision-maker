import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import NewDecisionView from '@/views/NewDecisionView.vue'
import HistoryView from '@/views/HistoryView.vue'
import LoginPage from '@/components/Login.vue'
import SignUpPage from '@/components/SignUp.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
  },
  {
    path: '/new-decision',
    name: 'NewDecision',
    component: NewDecisionView,
  },
  {
    path: '/history',
    name: 'History',
    component: HistoryView,
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage,
  },
  {
    path: '/signup',
    name: 'SignUp',
    component: SignUpPage,
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
