import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

import HomePage from '../components/pages/HomePage.vue'
import DecksPage from '../components/pages/DecksPage.vue'
import DeckDetailPage from '../components/pages/DeckDetailPage.vue'
import DeckRevisionPage from '../components/pages/DeckRevisionPage.vue'
import TagsPage from '../components/pages/TagsPage.vue'
import TagDetailPage from '../components/pages/TagDetailPage.vue'
import CreateDeckPage from '../components/pages/CreateDeckPage.vue'
import LoginPage from '../components/pages/LoginPage.vue'
import UserDashboardPage from '../components/pages/UserDashboardPage.vue'
import NotFoundPage from '../components/pages/NotFoundPage.vue'
import RegisterPage from '../components/pages/RegisterPage.vue'
import UserDecksPage from '@/components/pages/UserDecksPage.vue'
import DashboardPage from '@/components/pages/DashboardPage.vue'
import ClassementPage from '@/components/pages/ClassementPage.vue'


const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: HomePage },

    { path: '/decks', component: DecksPage, meta: { requiresAuth: true } },
    { path: '/decks/creer', component: CreateDeckPage, meta: { requiresAuth: true } },
    { path: '/decks/:id', component: DeckDetailPage, meta: { requiresAuth: true } },
    { path: '/decks/:id/revision', component: DeckRevisionPage, meta: { requiresAuth: true } },

    { path: '/tags', component: TagsPage, meta: { requiresAuth: true } },
    { path: '/tags/:id', component: TagDetailPage, meta: { requiresAuth: true } },
    { path: '/classement', component: ClassementPage, meta: { requiresAuth: true } },


    { path: '/login', component: LoginPage },
    { path: '/profil', component: UserDashboardPage, meta: { requiresAuth: true } },
    { path: '/stats', component: DashboardPage, meta: { requiresAuth: true } },
    { path: '/mesdecks', component: UserDecksPage, meta: { requiresAuth: true } },
    { path: '/register', component: RegisterPage },


    { path: '/:pathMatch(.*)*', component: NotFoundPage }
  ]
})



router.beforeEach((to) => {
  const auth = useAuthStore()
  auth.loadToken()

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return '/login'
  }

  return true
})


export default router
