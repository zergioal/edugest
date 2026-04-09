<template>
  <div>
    <div class="page-header">
      <div>
        <h1 class="page-header-title">Proyectos</h1>
        <p class="page-header-subtitle">Gestiona todos tus proyectos</p>
      </div>
      <button class="btn-primary-custom" @click="openCreate">
        <i class="bi bi-plus-lg" /> Nuevo Proyecto
      </button>
    </div>

    <!-- Filtros y buscador -->
    <div class="filters-bar">
      <div class="search-input-wrapper" style="max-width: 320px">
        <i class="bi bi-search" />
        <input
          v-model="searchText"
          type="text"
          class="form-control"
          placeholder="Buscar proyectos..."
        />
      </div>

      <select v-model="filterEstado" class="form-select" style="width: auto">
        <option value="">Todos los estados</option>
        <option value="activo">Activo</option>
        <option value="pausado">Pausado</option>
        <option value="completado">Completado</option>
      </select>

      <select v-model="filterPrioridad" class="form-select" style="width: auto">
        <option value="">Todas las prioridades</option>
        <option value="alta">Alta</option>
        <option value="media">Media</option>
        <option value="baja">Baja</option>
      </select>

      <small class="text-muted ms-auto">
        {{ filteredProyectos.length }} resultado(s)
      </small>
    </div>

    <AppSpinner v-if="loading" />

    <template v-else>
      <div v-if="filteredProyectos.length === 0" class="table-wrapper">
        <div class="empty-state">
          <i class="bi bi-folder-x" />
          <p>No se encontraron proyectos</p>
        </div>
      </div>

      <div v-else class="row g-3">
        <div
          v-for="p in filteredProyectos"
          :key="p.id"
          class="col-sm-6 col-xl-4"
        >
          <div class="proyecto-card">
            <div class="proyecto-card-top" :style="{ background: p.color }" />
            <div class="proyecto-card-body">
              <div class="d-flex align-items-start justify-content-between gap-2 mb-2">
                <span class="proyecto-card-title">{{ p.nombre }}</span>
                <span :class="['badge-prioridad flex-shrink-0', p.prioridad]">{{ p.prioridad }}</span>
              </div>
              <p class="proyecto-card-desc">{{ p.descripcion }}</p>
              <div class="d-flex gap-2 mt-3 flex-wrap">
                <span :class="['badge-estado', p.estado]">{{ labelEstado(p.estado) }}</span>
                <span style="font-size: 0.75rem; color: var(--text-muted)">
                  <i class="bi bi-calendar3 me-1" />{{ p.fechaFin }}
                </span>
              </div>
            </div>
            <div class="proyecto-card-footer">
              <RouterLink
                :to="`/proyectos/${p.id}`"
                class="btn-primary-custom"
                style="font-size: 0.8rem; padding: 0.35rem 0.9rem"
              >
                <i class="bi bi-eye" /> Ver detalle
              </RouterLink>
              <div class="proyecto-card-actions">
                <button class="btn-icon edit" title="Editar" @click.stop="openEdit(p)">
                  <i class="bi bi-pencil" />
                </button>
                <button class="btn-icon delete" title="Eliminar" @click.stop="confirmDelete(p)">
                  <i class="bi bi-trash" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- Modal crear/editar -->
    <AppModal v-model="showModal" :title="editingId ? 'Editar Proyecto' : 'Nuevo Proyecto'" width="580px">
      <form @submit.prevent="handleSubmit">
        <div class="row g-3">
          <div class="col-12">
            <div class="form-group">
              <label class="form-label">Nombre del proyecto *</label>
              <input v-model="form.nombre" type="text" class="form-control" required placeholder="Ej: Rediseño de Sitio Web" />
            </div>
          </div>
          <div class="col-12">
            <div class="form-group">
              <label class="form-label">Descripción</label>
              <textarea v-model="form.descripcion" class="form-control" placeholder="Describe el objetivo del proyecto..." />
            </div>
          </div>
          <div class="col-sm-6">
            <div class="form-group">
              <label class="form-label">Estado</label>
              <select v-model="form.estado" class="form-select">
                <option value="activo">Activo</option>
                <option value="pausado">Pausado</option>
                <option value="completado">Completado</option>
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
          <div class="col-sm-6">
            <div class="form-group">
              <label class="form-label">Fecha inicio</label>
              <input v-model="form.fechaInicio" type="date" class="form-control" required />
            </div>
          </div>
          <div class="col-sm-6">
            <div class="form-group">
              <label class="form-label">Fecha fin</label>
              <input v-model="form.fechaFin" type="date" class="form-control" required />
            </div>
          </div>
          <div class="col-12">
            <div class="form-group">
              <label class="form-label">Color identificador</label>
              <div class="d-flex align-items-center gap-3">
                <input v-model="form.color" type="color" class="form-control" style="width: 60px; height: 40px; padding: 4px; cursor: pointer" />
                <div class="d-flex gap-2 flex-wrap">
                  <span
                    v-for="c in colorPresets"
                    :key="c"
                    class="color-dot cursor-pointer"
                    :style="{ background: c, width: '24px', height: '24px', border: form.color === c ? '3px solid #1e293b' : '2px solid transparent' }"
                    @click="form.color = c"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
      <template #footer>
        <button class="btn btn-sm btn-outline-secondary" @click="showModal = false">Cancelar</button>
        <button class="btn-primary-custom btn-sm" :disabled="saving" @click="handleSubmit">
          <span v-if="saving" class="spinner-border spinner-border-sm me-1" />
          <i v-else class="bi bi-check2 me-1" />
          {{ editingId ? 'Guardar cambios' : 'Crear proyecto' }}
        </button>
      </template>
    </AppModal>

    <!-- Confirmación eliminación -->
    <ConfirmDialog
      v-model="showConfirm"
      :message="`¿Eliminar el proyecto &quot;${deletingNombre}&quot;? Esta acción no se puede deshacer.`"
      @confirm="handleDelete"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { proyectoService } from '@/services/proyectoService'
import { useNotification } from '@/composables/useNotification'
import AppModal from '@/components/common/AppModal.vue'
import AppSpinner from '@/components/common/AppSpinner.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import type { Proyecto, ProyectoForm } from '@/types'

const { notify } = useNotification()

const proyectos = ref<Proyecto[]>([])
const loading = ref(true)
const saving = ref(false)

// Filtros
const searchText = ref('')
const filterEstado = ref('')
const filterPrioridad = ref('')

// Modal
const showModal = ref(false)
const editingId = ref<number | null>(null)

// Confirmación eliminar
const showConfirm = ref(false)
const deletingId = ref<number | null>(null)
const deletingNombre = ref('')

const colorPresets = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#3B82F6', '#EC4899', '#06B6D4']

const emptyForm = (): ProyectoForm => ({
  nombre: '',
  descripcion: '',
  color: '#4F46E5',
  estado: 'activo',
  prioridad: 'media',
  fechaInicio: new Date().toISOString().split('T')[0],
  fechaFin: ''
})

const form = reactive<ProyectoForm>(emptyForm())

const filteredProyectos = computed(() => {
  return proyectos.value.filter((p) => {
    const matchText = !searchText.value || p.nombre.toLowerCase().includes(searchText.value.toLowerCase())
    const matchEstado = !filterEstado.value || p.estado === filterEstado.value
    const matchPrioridad = !filterPrioridad.value || p.prioridad === filterPrioridad.value
    return matchText && matchEstado && matchPrioridad
  })
})

function labelEstado(e: string) {
  return { activo: 'Activo', pausado: 'Pausado', completado: 'Completado' }[e] ?? e
}

function openCreate() {
  editingId.value = null
  Object.assign(form, emptyForm())
  showModal.value = true
}

function openEdit(p: Proyecto) {
  editingId.value = p.id
  Object.assign(form, {
    nombre: p.nombre,
    descripcion: p.descripcion,
    color: p.color,
    estado: p.estado,
    prioridad: p.prioridad,
    fechaInicio: p.fechaInicio,
    fechaFin: p.fechaFin
  })
  showModal.value = true
}

function confirmDelete(p: Proyecto) {
  deletingId.value = p.id
  deletingNombre.value = p.nombre
  showConfirm.value = true
}

async function handleSubmit() {
  if (!form.nombre.trim() || !form.fechaFin) return
  saving.value = true
  try {
    if (editingId.value) {
      const updated = await proyectoService.update(editingId.value, { ...form })
      const idx = proyectos.value.findIndex((p) => p.id === editingId.value)
      if (idx !== -1) proyectos.value[idx] = updated
      notify('Proyecto actualizado correctamente', 'success')
    } else {
      const created = await proyectoService.create({ ...form })
      proyectos.value.unshift(created)
      notify('Proyecto creado correctamente', 'success')
    }
    showModal.value = false
  } catch {
    notify('Error al guardar el proyecto', 'danger')
  } finally {
    saving.value = false
  }
}

async function handleDelete() {
  if (!deletingId.value) return
  try {
    await proyectoService.delete(deletingId.value)
    proyectos.value = proyectos.value.filter((p) => p.id !== deletingId.value)
    notify('Proyecto eliminado', 'success')
  } catch {
    notify('Error al eliminar el proyecto', 'danger')
  }
}

onMounted(async () => {
  try {
    proyectos.value = await proyectoService.getAll()
  } catch {
    notify('Error al cargar proyectos', 'danger')
  } finally {
    loading.value = false
  }
})
</script>
