import api from './api'
import type { Estudiante, EstudianteForm } from '@/types'

export const estudianteService = {
  async getAll(): Promise<Estudiante[]> {
    const response = await api.get<Estudiante[]>('/estudiantes')
    return response.data
  },

  async getByCurso(cursoId: number): Promise<Estudiante[]> {
    const response = await api.get<Estudiante[]>(`/estudiantes?cursoId=${cursoId}`)
    return response.data
  },

  async getById(id: number): Promise<Estudiante> {
    const response = await api.get<Estudiante>(`/estudiantes/${id}`)
    return response.data
  },

  async create(data: EstudianteForm): Promise<Estudiante> {
    const payload = { ...data, createdAt: new Date().toISOString().split('T')[0] }
    const response = await api.post<Estudiante>('/estudiantes', payload)
    return response.data
  },

  async update(id: number, data: EstudianteForm): Promise<Estudiante> {
    const response = await api.put<Estudiante>(`/estudiantes/${id}`, data)
    return response.data
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/estudiantes/${id}`)
  }
}
