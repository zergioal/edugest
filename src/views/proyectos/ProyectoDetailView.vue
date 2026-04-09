<template>
  <div>
    <AppSpinner v-if="loading" />

    <template v-else-if="proyecto">
      <!-- Header del proyecto -->
      <div class="page-header">
        <div class="d-flex align-items-center gap-3">
          <RouterLink to="/proyectos" class="btn-icon" title="Volver">
            <i class="bi bi-arrow-left" />
          </RouterLink>
          <div>
            <div class="d-flex align-items-center gap-2">
              <span class="color-dot" :style="{ background: proyecto.color, width: '14px', height: '14px' }" />
              <h1 class="page-header-title">{{ proyecto.nombre }}</h1>
            </div>
            <p class="page-header-subtitle mb-0">{{ proyecto.descripcion }}</p>
          </div>
        </div>
        <button class="btn-primary-custom" @click="openCreateTarea">
          <i class="bi bi-plus-lg" /> Nueva Tarea
        </button>
      </div>

      <!-- Info del proyecto -->
      <div class="row g-3 mb-4">
        <div class="col-sm-6 col-lg-3">
          <div class="stat-card">
            <div class="stat-icon primary"><i class="bi bi-list-task" /></div>
            <div>
              <div class="stat-number">{{ tareas.length }}</div>
              <div class="stat-label">Total Tareas</div>
            </div>
          </div>
        </div>
        <div class="col-sm-6 col-lg-3">
          <div class="stat-card">
            <div class="stat-icon success"><i class="bi bi-check2-circle" /></div>
            <div>
              <div class="stat-number">{{ tareas.filter(t => t.estado === 'completada').length }}</div>
              <div class="stat-label">Completadas</div>
            </div>
          </div>
        </div>
        <div class="col-sm-6 col-lg-3">
          <div class="stat-card">
            <div class="stat-icon warning"><i class="bi bi-play-circle" /></div>
            <div>
              <div class="stat-number">{{ tareas.filter(t => t.estado === 'en_progreso').length }}</div>
              <div class="stat-label">En Progreso</div>
            </div>
          </div>
        </div>
        <div class="col-sm-6 col-lg-3">
          <div class="stat-card">
            <div class="stat-icon danger"><i class="bi bi-circle" /></div>
            <div>
              <div class="stat-number">{{ tareas.filter(t => t.estado === 'pendiente').length }}</div>
              <div class="stat-label">Pendientes</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Info fecha y estado -->
      <div class="card mb-4">
        <div class="card-body">
          <div class="row g-3">
            <div class="col-sm-4">
              <div style="font-size: 0.78rem; color: var(--text-muted); font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em">Estado</div>
              <span :class="['badge-estado mt-1', proyecto.estado]">{{ labelEstado(proyecto.estado) }}</span>
            </div>
            <div class="col-sm-4">
              <div style="font-size: 0.78rem; color: var(--text-muted); font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em">Prioridad</div>
              <span :class="['badge-prioridad mt-1', proyecto.prioridad]">{{ proyecto.prioridad }}</span>
            </div>
            <div class="col-sm-4">
              <div style="font-size: 0.78rem; color: var(--text-muted); font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em">Período</div>
              <div style="font-size: 0.875rem; font-weight: 500; margin-top: 0.25rem">
                {{ proyecto.fechaInicio }} → {{ proyecto.fechaFin }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabla de tareas -->
      <div class="d-flex align-items-center justify-content-between mb-3">
        <h5 class="fw-600 mb-0">Tareas del Proyecto</h5>
        <div class="search-input-wrapper" style="max-width: 260px">
          <i class="bi bi-search" />
          <input v-model="searchText" type="text" class="form-control" placeholder="Buscar tarea..." />
        </div>
      </div>

      <div class="table-wrapper">
        <div v-if="filteredTareas.length === 0" class="empty-state">
          <i class="bi bi-clipboard-x" />
          <p>No hay tareas en este proyecto</p>
        </div>
        <table v-else class="table">
          <thead>
            <tr>
              <th>Tarea</th>
              <th>Estado</th>
              <th>Prioridad</th>
              <th>Vencimiento</th>
              <th class="text-end">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="t in filteredTareas" :key="t.id">
              <td>
                <div class="fw-600" style="font-size: 0.875rem">{{ t.titulo }}</div>
                <div style="font-size: 0.78rem; color: var(--text-muted)" class="d-none d-md-block">{{ t.descripcion }}</div>
              </td>
              <td>
                <span :class="['badge-estado', t.estado]">{{ labelTareaEstado(t.estado) }}</span>
              </td>
              <td>
                <span :class="['badge-prioridad', t.prioridad]">{{ t.prioridad }}</span>
              </td>
              <td style="font-size: 0.82rem; color: var(--text-secondary)">{{ t.fechaVencimiento }}</td>
              <td class="text-end">
                <div class="d-flex gap-1 justify-content-end">
                  <button class="btn-icon edit" title="Editar" @click="openEditTarea(t)">
                    <i class="bi bi-pencil" />
                  </button>
                  <button class="btn-icon delete" title="Eliminar" @click="confirmDelete(t)">
                    <i class="bi bi-trash" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>

    <div v-else class="empty-state">
      <i class="bi bi-exclamation-circle" />
      <p>Proyecto no encontrado</p>
    </div>

    <!-- Modal tarea -->
    <AppModal v-model="showTareaModal" :title="editingTareaId ? 'Editar Tarea' : 'Nueva Tarea'" width="540px">
      <form @submit.prevent="handleTareaSubmit">
        <div class="row g-3">
          <div class="col-12">
            <div class="form-group">
              <label class="form-label">Título *</label>
              <input v-model="tareaForm.titulo" type="text" class="form-control" required placeholder="¿Qué hay que hacer?" />
            </div>
          </div>
          <div class="col-12">
            <div class="form-group">
              <label class="form-label">Descripción</label>
              <textarea v-model="tareaForm.descripcion" class="form-control" placeholder="Detalles adicionales..." />
            </div>
          </div>
          <div class="col-sm-6">
            <div class="form-group">
              <label class="form-label">Estado</label>
              <select v-model="tareaForm.estado" class="form-select">
                <option value="pendiente">Pendiente</option>
                <option value="en_progreso">En Progreso</option>
                <option value="completada">Completada</option>
              </select>
            </div>
          </div>
          <div class="col-sm-6">
            <div class="form-group">
              <label class="form-label">Prioridad</label>
              <select v-model="tareaForm.prioridad" class="form-select">
                <option value="baja">Baja</option>
                <option value="media">Media</option>
                <option value="alta">Alta</option>
              </select>
            </div>
          </div>
          <div class="col-12">
            <div class="form-group">
              <label class="form-label">Fecha de vencimiento</label>
              <input v-model="tareaForm.fechaVencimiento" type="date" class="form-control" required />
            </div>
          </div>
        </div>
      </form>
      <template #footer>
        <button class="btn btn-sm btn-outline-secondary" @click="showTareaModal = false">Cancelar</button>
        <button class="btn-primary-custom btn-sm" :disabled="savingTarea" @click="handleTareaSubmit">
          <span v-if="savingTarea" class="spinner-border spinner-border-sm me-1" />
          <i v-else class="bi bi-check2 me-1" />
          {{ editingTareaId ? 'Guardar' : 'Crear tarea' }}
        </button>
      </template>
    </AppModal>

    <ConfirmDialog
      v-model="showConfirm"
      :message="`¿Eliminar la tarea &quot;${deletingTareaNombre}&quot;?`"
      @confirm="handleDeleteTarea"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { proyectoService } from '@/services/proyectoService'
import { tareaService } from '@/services/tareaService'
import { useNotification } from '@/composables/useNotification'
import AppModal from '@/components/common/AppModal.vue'
import AppSpinner from '@/components/common/AppSpinner.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import type { Proyecto, Tarea, TareaForm } from '@/types'

const route = useRoute()
const { notify } = useNotification()

const loading = ref(true)
const proyecto = ref<Proyecto | null>(null)
const tareas = ref<Tarea[]>([])

const searchText = ref('')

const showTareaModal = ref(false)
const editingTareaId = ref<number | null>(null)
const savingTarea = ref(false)

const showConfirm = ref(false)
const deletingTareaId = ref<number | null>(null)
const deletingTareaNombre = ref('')

const emptyTareaForm = (): TareaForm => ({
  titulo: '',
  descripcion: '',
  proyectoId: Number(route.params.id),
  estado: 'pendiente',
  prioridad: 'media',
  fechaVencimiento: ''
})

const tareaForm = reactive<TareaForm>(emptyTareaForm())

const filteredTareas = computed(() =>
  tareas.value.filter((t) =>
    !searchText.value || t.titulo.toLowerCase().includes(searchText.value.toLowerCase())
  )
)

function labelEstado(e: string) {
  return { activo: 'Activo', pausado: 'Pausado', completado: 'Completado' }[e] ?? e
}

function labelTareaEstado(e: string) {
  return { pendiente: 'Pendiente', en_progreso: 'En Progreso', completada: 'Completada' }[e] ?? e
}

function openCreateTarea() {
  editingTareaId.value = null
  Object.assign(tareaForm, emptyTareaForm())
  showTareaModal.value = true
}

function openEditTarea(t: Tarea) {
  editingTareaId.value = t.id
  Object.assign(tareaForm, {
    titulo: t.titulo,
    descripcion: t.descripcion,
    proyectoId: t.proyectoId,
    estado: t.estado,
    prioridad: t.prioridad,
    fechaVencimiento: t.fechaVencimiento
  })
  showTareaModal.value = true
}

function confirmDelete(t: Tarea) {
  deletingTareaId.value = t.id
  deletingTareaNombre.value = t.titulo
  showConfirm.value = true
}

async function handleTareaSubmit() {
  if (!tareaForm.titulo.trim() || !tareaForm.fechaVencimiento) return
  savingTarea.value = true
  try {
    if (editingTareaId.value) {
      const updated = await tareaService.update(editingTareaId.value, { ...tareaForm })
      const idx = tareas.value.findIndex((t) => t.id === editingTareaId.value)
      if (idx !== -1) tareas.value[idx] = updated
      notify('Tarea actualizada', 'success')
    } else {
      const created = await tareaService.create({ ...tareaForm })
      tareas.value.push(created)
      notify('Tarea creada', 'success')
    }
    showTareaModal.value = false
  } catch {
    notify('Error al guardar la tarea', 'danger')
  } finally {
    savingTarea.value = false
  }
}

async function handleDeleteTarea() {
  if (!deletingTareaId.value) return
  try {
    await tareaService.delete(deletingTareaId.value)
    tareas.value = tareas.value.filter((t) => t.id !== deletingTareaId.value)
    notify('Tarea eliminada', 'success')
  } catch {
    notify('Error al eliminar la tarea', 'danger')
  }
}

onMounted(async () => {
  const id = Number(route.params.id)
  try {
    const [p, t] = await Promise.all([proyectoService.getById(id), tareaService.getByProyecto(id)])
    proyecto.value = p
    tareas.value = t
  } catch {
    notify('Error al cargar el proyecto', 'danger')
  } finally {
    loading.value = false
  }
})
</script>
