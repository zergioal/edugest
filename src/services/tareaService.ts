import api from './api'
import type { Tarea, TareaForm } from '@/types'

export const tareaService = {
  async getAll(): Promise<Tarea[]> {
    const response = await api.get<Tarea[]>('/tareas')
    return response.data
  },

  async getByProyecto(proyectoId: number): Promise<Tarea[]> {
    const response = await api.get<Tarea[]>(`/tareas?proyectoId=${proyectoId}`)
    return response.data
  },

  async getById(id: number): Promise<Tarea> {
    const response = await api.get<Tarea>(`/tareas/${id}`)
    return response.data
  },

  async create(data: TareaForm): Promise<Tarea> {
    const response = await api.post<Tarea>('/tareas', data)
    return response.data
  },

  async update(id: number, data: TareaForm): Promise<Tarea> {
    const response = await api.put<Tarea>(`/tareas/${id}`, data)
    return response.data
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/tareas/${id}`)
  }
}
