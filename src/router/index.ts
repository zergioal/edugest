import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // ─── Públicas ─────────────────────────────────────────────
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/auth/LoginView.vue'),
      meta: { public: true }
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/auth/RegisterView.vue'),
      meta: { public: true }
    },

    // ─── Privadas ──────────────────────────────────────────────
    {
      path: '/',
      name: 'dashboard',
      component: () => import('@/views/DashboardView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/docentes',
      name: 'docentes',
      component: () => import('@/views/docentes/DocentesView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/docentes/:id',
      name: 'docente-detail',
      component: () => import('@/views/docentes/DocenteDetailView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/cursos',
      name: 'cursos',
      component: () => import('@/views/cursos/CursosView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/cursos/:id',
      name: 'curso-detail',
      component: () => import('@/views/cursos/CursoDetailView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/estudiantes',
      name: 'estudiantes',
      component: () => import('@/views/estudiantes/EstudiantesView.vue'),
      meta: { requiresAuth: true }
    },

    // ─── Fallback ──────────────────────────────────────────────
    { path: '/:pathMatch(.*)*', redirect: '/' }
  ]
})

// Navigation guard
router.beforeEach((to) => {
  const { isAuthenticated } = useAuth()

  if (to.meta.requiresAuth && !isAuthenticated.value) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  if (to.meta.public && isAuthenticated.value) {
    return { name: 'dashboard' }
  }
})

export default router
