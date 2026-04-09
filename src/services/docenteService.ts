import api from './api'
import type { Docente, DocenteForm } from '@/types'

export const docenteService = {
  async getAll(): Promise<Docente[]> {
    const response = await api.get<Docente[]>('/docentes')
    return response.data
  },

  async getById(id: number): Promise<Docente> {
    const response = await api.get<Docente>(`/docentes/${id}`)
    return response.data
  },

  async create(data: DocenteForm): Promise<Docente> {
    const payload = { ...data, createdAt: new Date().toISOString().split('T')[0] }
    const response = await api.post<Docente>('/docentes', payload)
    return response.data
  },

  async update(id: number, data: DocenteForm): Promise<Docente> {
    const response = await api.put<Docente>(`/docentes/${id}`, data)
    return response.data
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/docentes/${id}`)
  }
}
