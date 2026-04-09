import api from './api'
import type { Proyecto, ProyectoForm } from '@/types'

export const proyectoService = {
  async getAll(): Promise<Proyecto[]> {
    const response = await api.get<Proyecto[]>('/proyectos')
    return response.data
  },

  async getById(id: number): Promise<Proyecto> {
    const response = await api.get<Proyecto>(`/proyectos/${id}`)
    return response.data
  },

  async create(data: ProyectoForm): Promise<Proyecto> {
    const response = await api.post<Proyecto>('/proyectos', data)
    return response.data
  },

  async update(id: number, data: ProyectoForm): Promise<Proyecto> {
    const response = await api.put<Proyecto>(`/proyectos/${id}`, data)
    return response.data
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/proyectos/${id}`)
  }
}
