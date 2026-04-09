import api from './api'
import type { AuthResponse } from '@/types'

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/login', { email, password })
    return response.data
  },

  async register(email: string, password: string): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/register', { email, password })
    return response.data
  }
}
