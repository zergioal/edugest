import { ref, computed } from 'vue'
import type { User } from '@/types'

// Instancia reactiva a nivel de módulo (singleton)
const token = ref<string | null>(localStorage.getItem('token'))
const currentUser = ref<User | null>(
  JSON.parse(localStorage.getItem('user') || 'null')
)

export function useAuth() {
  const isAuthenticated = computed(() => !!token.value)

  function setAuth(accessToken: string, userData: User) {
    token.value = accessToken
    currentUser.value = userData
    localStorage.setItem('token', accessToken)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  function clearAuth() {
    token.value = null
    currentUser.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  return {
    token,
    currentUser,
    isAuthenticated,
    setAuth,
    clearAuth
  }
}
