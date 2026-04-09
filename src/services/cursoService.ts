import api from './api'
import type { Curso, CursoForm } from '@/types'

export const cursoService = {
  async getAll(): Promise<Curso[]> {
    const response = await api.get<Curso[]>('/cursos')
    return response.data
  },

  async getById(id: number): Promise<Curso> {
    const response = await api.get<Curso>(`/cursos/${id}`)
    return response.data
  },

  async create(data: CursoForm): Promise<Curso> {
    const payload = { ...data, createdAt: new Date().toISOString().split('T')[0] }
    const response = await api.post<Curso>('/cursos', payload)
    return response.data
  },

  async update(id: number, data: CursoForm): Promise<Curso> {
    const response = await api.put<Curso>(`/cursos/${id}`, data)
    return response.data
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/cursos/${id}`)
  }
}
