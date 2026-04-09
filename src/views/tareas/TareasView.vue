<template>
  <div>
    <div class="page-header">
      <div>
        <h1 class="page-header-title">Tareas</h1>
        <p class="page-header-subtitle">Gestiona todas las tareas de tus proyectos</p>
      </div>
      <button class="btn-primary-custom" @click="openCreate">
        <i class="bi bi-plus-lg" /> Nueva Tarea
      </button>
    </div>

    <!-- Filtros y buscador -->
    <div class="filters-bar">
      <div class="search-input-wrapper" style="max-width: 280px">
        <i class="bi bi-search" />
        <input
          v-model="searchText"
          type="text"
          class="form-control"
          placeholder="Buscar tarea..."
        />
      </div>

      <!-- Filtro por proyecto (relación entre entidades) -->
      <select v-model="filterProyecto" class="form-select" style="width: auto; max-width: 200px">
        <option value="">Todos los proyectos</option>
        <option v-for="p in proyectos" :key="p.id" :value="p.id">
          {{ p.nombre }}
        </option>
      </select>

      <!-- Filtro por estado -->
      <select v-model="filterEstado" class="form-select" style="width: auto">
        <option value="">Todos los estados</option>
        <option value="pendiente">Pendiente</option>
        <option value="en_progreso">En Progreso</option>
        <option value="completada">Completada</option>
      </select>

      <!-- Filtro por prioridad -->
      <select v-model="filterPrioridad" class="form-select" style="width: auto">
        <option value="">Toda prioridad</option>
        <option value="alta">Alta</option>
        <option value="media">Media</option>
        <option value="baja">Baja</option>
      </select>

      <small class="text-muted ms-auto">{{ filteredTareas.length }} resultado(s)</small>
    </div>

    <AppSpinner v-if="loading" />

    <template v-else>
      <div class="table-wrapper">
        <div v-if="filteredTareas.length === 0" class="empty-state">
          <i class="bi bi-clipboard-x" />
          <p>No se encontraron tareas</p>
        </div>

        <table v-else class="table">
          <thead>
            <tr>
              <th>Tarea</th>
              <th>Proyecto</th>
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
                <div style="font-size: 0.75rem; color: var(--text-muted)" class="d-none d-lg-block">
                  {{ t.descripcion }}
                </div>
              </td>
              <td>
                <div class="d-flex align-items-center gap-2">
                  <span
                    class="color-dot flex-shrink-0"
                    :style="{ background: proyectoColor(t.proyectoId) }"
                  />
                  <span style="font-size: 0.82rem">{{ proyectoNombre(t.proyectoId) }}</span>
                </div>
              </td>
              <td>
                <span :class="['badge-estado', t.estado]">{{ labelEstado(t.estado) }}</span>
              </td>
              <td>
                <span :class="['badge-prioridad', t.prioridad]">{{ t.prioridad }}</span>
              </td>
              <td style="font-size: 0.82rem; color: var(--text-secondary); white-space: nowrap">
                {{ t.fechaVencimiento }}
              </td>
              <td class="text-end">
                <div class="d-flex gap-1 justify-content-end">
                  <RouterLink
                    :to="`/proyectos/${t.proyectoId}`"
                    class="btn-icon view"
                    title="Ver proyecto"
                  >
                    <i class="bi bi-eye" />
                  </RouterLink>
                  <button class="btn-icon edit" title="Editar" @click="openEdit(t)">
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

    <!-- Modal crear/editar tarea -->
    <AppModal v-model="showModal" :title="editingId ? 'Editar Tarea' : 'Nueva Tarea'" width="540px">
      <form @submit.prevent="handleSubmit">
        <div class="row g-3">
          <div class="col-12">
            <div class="form-group">
              <label class="form-label">Título *</label>
              <input v-model="form.titulo" type="text" class="form-control" required placeholder="¿Qué hay que hacer?" />
            </div>
          </div>
          <div class="col-12">
            <div class="form-group">
              <label class="form-label">Descripción</label>
              <textarea v-model="form.descripcion" class="form-control" placeholder="Detalles de la tarea..." />
            </div>
          </div>
          <div class="col-12">
            <div class="form-group">
              <label class="form-label">Proyecto *</label>
              <select v-model="form.proyectoId" class="form-select" required>
                <option :value="0" disabled>Selecciona un proyecto</option>
                <option v-for="p in proyectos" :key="p.id" :value="p.id">
                  {{ p.nombre }}
                </option>
              </select>
            </div>
          </div>
          <div class="col-sm-6">
            <div class="form-group">
              <label class="form-label">Estado</label>
              <select v-model="form.estado" class="form-select">
                <option value="pendiente">Pendiente</option>
                <option value="en_progreso">En Progreso</option>
                <option value="completada">Completada</option>
              </select>
            </div>
          </div>
          <div class="col-sm-6">
            <div class="form-group">
              <label class="form-label">Prioridad</label>
              <select v-model="form.prioridad" class="form-select">
                <option value="baja">Baja</option>
                <option value="media">Media</option>
                <option value="alta">Alta</option>
              </select>
            </div>
          </div>
          <div class="col-12">
            <div class="form-group">
              <label class="form-label">Fecha de vencimiento *</label>
              <input v-model="form.fechaVencimiento" type="date" class="form-control" required />
            </div>
          </div>
        </div>
      </form>
      <template #footer>
        <button class="btn btn-sm btn-outline-secondary" @click="showModal = false">Cancelar</button>
        <button class="btn-primary-custom btn-sm" :disabled="saving" @click="handleSubmit">
          <span v-if="saving" class="spinner-border spinner-border-sm me-1" />
          <i v-else class="bi bi-check2 me-1" />
          {{ editingId ? 'Guardar cambios' : 'Crear tarea' }}
        </button>
      </template>
    </AppModal>

    <ConfirmDialog
      v-model="showConfirm"
      :message="`¿Eliminar la tarea &quot;${deletingNombre}&quot;?`"
      @confirm="handleDelete"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { tareaService } from '@/services/tareaService'
import { proyectoService } from '@/services/proyectoService'
import { useNotification } from '@/composables/useNotification'
import AppModal from '@/components/common/AppModal.vue'
import AppSpinner from '@/components/common/AppSpinner.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import type { Tarea, TareaForm, Proyecto } from '@/types'

const { notify } = useNotification()

const tareas = ref<Tarea[]>([])
const proyectos = ref<Proyecto[]>([])
const loading = ref(true)
const saving = ref(false)

// Filtros
const searchText = ref('')
const filterProyecto = ref<number | ''>('')
const filterEstado = ref('')
const filterPrioridad = ref('')

// Modal
const showModal = ref(false)
const editingId = ref<number | null>(null)

// Confirmar eliminación
const showConfirm = ref(false)
const deletingId = ref<number | null>(null)
const deletingNombre = ref('')

const emptyForm = (): TareaForm => ({
  titulo: '',
  descripcion: '',
  proyectoId: 0,
  estado: 'pendiente',
  prioridad: 'media',
  fechaVencimiento: ''
})

const form = reactive<TareaForm>(emptyForm())

// Computed: tareas filtradas con búsqueda + filtros
const filteredTareas = computed(() =>
  tareas.value.filter((t) => {
    const matchText = !searchText.value || t.titulo.toLowerCase().includes(searchText.value.toLowerCase())
    const matchProyecto = !filterProyecto.value || t.proyectoId === Number(filterProyecto.value)
    const matchEstado = !filterEstado.value || t.estado === filterEstado.value
    const matchPrioridad = !filterPrioridad.value || t.prioridad === filterPrioridad.value
    return matchText && matchProyecto && matchEstado && matchPrioridad
  })
)

function proyectoNombre(id: number) {
  return proyectos.value.find((p) => p.id === id)?.nombre ?? 'Sin proyecto'
}

function proyectoColor(id: number) {
  return proyectos.value.find((p) => p.id === id)?.color ?? '#94a3b8'
}

function labelEstado(e: string) {
  return { pendiente: 'Pendiente', en_progreso: 'En Progreso', completada: 'Completada' }[e] ?? e
}

function openCreate() {
  editingId.value = null
  Object.assign(form, emptyForm())
  showModal.value = true
}

function openEdit(t: Tarea) {
  editingId.value = t.id
  Object.assign(form, {
    titulo: t.titulo,
    descripcion: t.descripcion,
    proyectoId: t.proyectoId,
    estado: t.estado,
    prioridad: t.prioridad,
    fechaVencimiento: t.fechaVencimiento
  })
  showModal.value = true
}

function confirmDelete(t: Tarea) {
  deletingId.value = t.id
  deletingNombre.value = t.titulo
  showConfirm.value = true
}

async function handleSubmit() {
  if (!form.titulo.trim() || !form.proyectoId || !form.fechaVencimiento) return
  saving.value = true
  try {
    if (editingId.value) {
      const updated = await tareaService.update(editingId.value, { ...form })
      const idx = tareas.value.findIndex((t) => t.id === editingId.value)
      if (idx !== -1) tareas.value[idx] = updated
      notify('Tarea actualizada correctamente', 'success')
    } else {
      const created = await tareaService.create({ ...form })
      tareas.value.unshift(created)
      notify('Tarea creada correctamente', 'success')
    }
    showModal.value = false
  } catch {
    notify('Error al guardar la tarea', 'danger')
  } finally {
    saving.value = false
  }
}

async function handleDelete() {
  if (!deletingId.value) return
  try {
    await tareaService.delete(deletingId.value)
    tareas.value = tareas.value.filter((t) => t.id !== deletingId.value)
    notify('Tarea eliminada', 'success')
  } catch {
    notify('Error al eliminar la tarea', 'danger')
  }
}

onMounted(async () => {
  try {
    const [t, p] = await Promise.all([tareaService.getAll(), proyectoService.getAll()])
    tareas.value = t
    proyectos.value = p
  } catch {
    notify('Error al cargar tareas', 'danger')
  } finally {
    loading.value = false
  }
})
</script>
