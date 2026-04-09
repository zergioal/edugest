<template>
  <div>
    <!-- Header -->
    <div class="page-header">
      <div>
        <h1 class="page-header-title">
          <i class="bi bi-people-fill me-2 text-blue"></i>Estudiantes
        </h1>
        <p class="page-header-sub">Gestión de estudiantes matriculados</p>
      </div>
      <button class="btn-primary" @click="openCreate">
        <i class="bi bi-plus-lg me-1"></i> Nuevo estudiante
      </button>
    </div>

    <!-- Filtros -->
    <div class="filters-bar">
      <div class="search-wrap">
        <i class="bi bi-search search-icon"></i>
        <input
          v-model="search"
          type="text"
          class="search-input"
          placeholder="Buscar por nombre, apellido o matrícula..."
        />
        <button v-if="search" class="search-clear" @click="search = ''">
          <i class="bi bi-x-lg"></i>
        </button>
      </div>
      <select v-model="filtroCurso" class="filter-select">
        <option value="">Todos los cursos</option>
        <option v-for="c in cursosOrdenados" :key="c.id" :value="c.id">{{ cursoLabel(c) }}</option>
      </select>
      <select v-model="filtroEstado" class="filter-select">
        <option value="">Todos los estados</option>
        <option value="activo">Activo</option>
        <option value="inactivo">Inactivo</option>
      </select>
    </div>

    <!-- Spinner -->
    <div v-if="loading" class="spinner-wrap">
      <div class="spinner-border text-primary" role="status"></div>
    </div>

    <!-- Tabla -->
    <div v-else class="table-card">
      <div class="table-info">{{ estudiantesFiltrados.length }} resultado{{ estudiantesFiltrados.length !== 1 ? 's' : '' }}</div>
      <div class="table-responsive">
        <table class="edu-table">
          <thead>
            <tr>
              <th>Estudiante</th>
              <th>Matrícula</th>
              <th>Email</th>
              <th>Curso</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="estudiantesFiltrados.length === 0">
              <td colspan="6" class="table-empty">
                <i class="bi bi-search me-2"></i>No se encontraron estudiantes
              </td>
            </tr>
            <tr v-for="est in estudiantesFiltrados" :key="est.id">
              <td>
                <div class="td-persona">
                  <div class="td-avatar">{{ est.nombre[0] }}{{ est.apellido[0] }}</div>
                  <div>
                    <div class="td-name">{{ est.nombre }} {{ est.apellido }}</div>
                    <div class="td-meta">ID #{{ est.id }}</div>
                  </div>
                </div>
              </td>
              <td><code class="td-code">{{ est.matricula }}</code></td>
              <td class="td-muted">{{ est.email }}</td>
              <td>
                <RouterLink :to="`/cursos/${est.cursoId}`" class="td-curso-link">
                  {{ cursoNombre(est.cursoId) }}
                </RouterLink>
              </td>
              <td>
                <span :class="['badge-estado', est.estado === 'activo' ? 'badge-activo' : 'badge-inactivo']">
                  {{ est.estado }}
                </span>
              </td>
              <td>
                <div class="td-actions">
                  <button class="btn-action btn-action--edit" title="Editar" @click="openEdit(est)">
                    <i class="bi bi-pencil"></i>
                  </button>
                  <button class="btn-action btn-action--del" title="Eliminar" @click="confirmDelete(est)">
                    <i class="bi bi-trash3"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Crear/Editar -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-box">
        <div class="modal-header">
          <h5 class="modal-title">{{ editingId ? 'Editar estudiante' : 'Nuevo estudiante' }}</h5>
          <button class="modal-close" @click="closeModal"><i class="bi bi-x-lg"></i></button>
        </div>
        <form @submit.prevent="saveEstudiante" class="modal-body">
          <div class="row g-3">
            <div class="col-6">
              <label class="form-label-edu">Nombre *</label>
              <input v-model="form.nombre" type="text" class="form-input-edu" required placeholder="Nombre" />
            </div>
            <div class="col-6">
              <label class="form-label-edu">Apellido *</label>
              <input v-model="form.apellido" type="text" class="form-input-edu" required placeholder="Apellido" />
            </div>
            <div class="col-12">
              <label class="form-label-edu">Email *</label>
              <input v-model="form.email" type="email" class="form-input-edu" required placeholder="email@alumno.edu" />
            </div>
            <div class="col-6">
              <label class="form-label-edu">Matrícula *</label>
              <input v-model="form.matricula" type="text" class="form-input-edu" required placeholder="ALU-2024-000" />
            </div>
            <div class="col-6">
              <label class="form-label-edu">Estado</label>
              <select v-model="form.estado" class="form-input-edu">
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </select>
            </div>
            <div class="col-12">
              <label class="form-label-edu">Curso *</label>
              <select v-model.number="form.cursoId" class="form-input-edu" required>
                <option :value="0">Seleccionar curso...</option>
                <option v-for="c in cursosOrdenados" :key="c.id" :value="c.id">{{ cursoLabel(c) }}</option>
              </select>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn-secondary" @click="closeModal">Cancelar</button>
            <button type="submit" class="btn-primary" :disabled="saving">
              <span v-if="saving" class="spinner-border spinner-border-sm me-1" role="status"></span>
              {{ saving ? 'Guardando...' : (editingId ? 'Actualizar' : 'Crear estudiante') }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Confirm Eliminar -->
    <div v-if="showConfirm" class="modal-overlay" @click.self="showConfirm = false">
      <div class="modal-box modal-box--sm">
        <div class="confirm-icon"><i class="bi bi-exclamation-triangle-fill"></i></div>
        <h5 class="confirm-title">¿Eliminar estudiante?</h5>
        <p class="confirm-text">
          Se eliminará a <strong>{{ deleteTarget?.nombre }} {{ deleteTarget?.apellido }}</strong>.
        </p>
        <div class="modal-footer">
          <button class="btn-secondary" @click="showConfirm = false">Cancelar</button>
          <button class="btn-danger" @click="deleteEstudiante" :disabled="saving">
            <span v-if="saving" class="spinner-border spinner-border-sm me-1" role="status"></span>
            {{ saving ? 'Eliminando...' : 'Sí, eliminar' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue'
import { RouterLink } from 'vue-router'
import { estudianteService } from '@/services/estudianteService'
import { cursoService } from '@/services/cursoService'
import { useNotification } from '@/composables/useNotification'
import { cursoLabel, AÑOS_CURSO } from '@/types'
import type { Estudiante, EstudianteForm, Curso } from '@/types'

const { notify } = useNotification()

const estudiantes = ref<Estudiante[]>([])
const cursos = ref<Curso[]>([])
const loading = ref(true)
const saving = ref(false)
const search = ref('')
const filtroCurso = ref<number | ''>('')
const filtroEstado = ref('')

const showModal = ref(false)
const showConfirm = ref(false)
const editingId = ref<number | null>(null)
const deleteTarget = ref<Estudiante | null>(null)

const emptyForm = (): EstudianteForm => ({
  nombre: '', apellido: '', email: '', matricula: '', cursoId: 0, estado: 'activo'
})
const form = reactive<EstudianteForm>(emptyForm())

const cursosOrdenados = computed(() =>
  [...cursos.value].sort((a, b) => {
    const ai = AÑOS_CURSO.indexOf(a.año), bi = AÑOS_CURSO.indexOf(b.año)
    return ai !== bi ? ai - bi : a.paralelo.localeCompare(b.paralelo)
  })
)

const cursoMap = computed(() => {
  const m: Record<number, string> = {}
  cursos.value.forEach(c => { m[c.id] = cursoLabel(c) })
  return m
})

const estudiantesFiltrados = computed(() => {
  return estudiantes.value.filter(e => {
    const q = search.value.toLowerCase()
    const matchSearch = !q || [e.nombre, e.apellido, e.email, e.matricula].some(v => v.toLowerCase().includes(q))
    const matchCurso = filtroCurso.value === '' || e.cursoId === Number(filtroCurso.value)
    const matchEstado = !filtroEstado.value || e.estado === filtroEstado.value
    return matchSearch && matchCurso && matchEstado
  })
})

function cursoNombre(id: number) {
  return cursoMap.value[id] ?? '—'
}

onMounted(async () => {
  try {
    const [e, c] = await Promise.all([estudianteService.getAll(), cursoService.getAll()])
    estudiantes.value = e
    cursos.value = c
  } finally {
    loading.value = false
  }
})

function openCreate() {
  editingId.value = null
  Object.assign(form, emptyForm())
  showModal.value = true
}

function openEdit(est: Estudiante) {
  editingId.value = est.id
  Object.assign(form, {
    nombre: est.nombre, apellido: est.apellido, email: est.email,
    matricula: est.matricula, cursoId: est.cursoId, estado: est.estado
  })
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  editingId.value = null
}

async function saveEstudiante() {
  saving.value = true
  try {
    if (editingId.value) {
      const updated = await estudianteService.update(editingId.value, { ...form })
      const idx = estudiantes.value.findIndex(e => e.id === editingId.value)
      if (idx !== -1) estudiantes.value[idx] = updated
      notify('Estudiante actualizado correctamente', 'success')
    } else {
      const created = await estudianteService.create({ ...form })
      estudiantes.value.unshift(created)
      notify('Estudiante creado correctamente', 'success')
    }
    closeModal()
  } catch {
    notify('Ocurrió un error al guardar', 'danger')
  } finally {
    saving.value = false
  }
}

function confirmDelete(est: Estudiante) {
  deleteTarget.value = est
  showConfirm.value = true
}

async function deleteEstudiante() {
  if (!deleteTarget.value) return
  saving.value = true
  try {
    await estudianteService.delete(deleteTarget.value.id)
    estudiantes.value = estudiantes.value.filter(e => e.id !== deleteTarget.value!.id)
    notify('Estudiante eliminado', 'success')
    showConfirm.value = false
  } catch {
    notify('No se pudo eliminar el estudiante', 'danger')
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.page-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; margin-bottom: 1.5rem; flex-wrap: wrap; }
.page-header-title { font-size: 1.45rem; font-weight: 700; color: #1F2937; margin: 0 0 0.2rem; }
.page-header-sub { color: #6B7280; margin: 0; font-size: 0.875rem; }
.text-blue { color: #2B5494; }

.filters-bar { display: flex; gap: 0.75rem; margin-bottom: 1.25rem; flex-wrap: wrap; }
.search-wrap { position: relative; flex: 1; min-width: 200px; }
.search-icon { position: absolute; left: 0.85rem; top: 50%; transform: translateY(-50%); color: #9CA3AF; font-size: 0.9rem; }
.search-input { width: 100%; padding: 0.6rem 2.5rem; border: 1.5px solid #E5E9F0; border-radius: 0.6rem; font-size: 0.875rem; outline: none; background: #fff; transition: border-color 0.2s; }
.search-input:focus { border-color: #2B5494; box-shadow: 0 0 0 3px rgba(43,84,148,0.08); }
.search-clear { position: absolute; right: 0.75rem; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: #9CA3AF; padding: 0; font-size: 0.8rem; }
.filter-select { padding: 0.6rem 0.85rem; border: 1.5px solid #E5E9F0; border-radius: 0.6rem; font-size: 0.875rem; outline: none; background: #fff; min-width: 160px; }
.filter-select:focus { border-color: #2B5494; }

.spinner-wrap { display: flex; justify-content: center; padding: 3rem; }
.table-card { background: #fff; border-radius: 1rem; box-shadow: 0 2px 8px rgba(0,0,0,0.07); overflow: hidden; }
.table-info { padding: 0.75rem 1.25rem; font-size: 0.8rem; color: #6B7280; border-bottom: 1px solid #F3F4F6; }
.edu-table { width: 100%; border-collapse: collapse; }
.edu-table th { padding: 0.85rem 1rem; text-align: left; font-size: 0.78rem; font-weight: 600; color: #6B7280; text-transform: uppercase; letter-spacing: 0.04em; background: #F9FAFB; border-bottom: 1px solid #F3F4F6; }
.edu-table td { padding: 0.85rem 1rem; font-size: 0.875rem; color: #1F2937; border-bottom: 1px solid #F9FAFB; vertical-align: middle; }
.edu-table tbody tr:hover { background: #FAFBFD; }
.table-empty { text-align: center; color: #9CA3AF; padding: 2.5rem !important; }

.td-persona { display: flex; align-items: center; gap: 0.75rem; }
.td-avatar { width: 36px; height: 36px; border-radius: 50%; background: #2B5494; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 0.72rem; font-weight: 700; flex-shrink: 0; }
.td-name { font-weight: 600; color: #1F2937; }
.td-meta { font-size: 0.75rem; color: #9CA3AF; }
.td-muted { color: #6B7280; font-size: 0.85rem; }
.td-code { background: #F3F4F6; padding: 0.15rem 0.5rem; border-radius: 0.35rem; font-size: 0.8rem; color: #374151; }
.td-curso-link { color: #2B5494; font-weight: 600; font-size: 0.85rem; text-decoration: none; }
.td-curso-link:hover { text-decoration: underline; }
.td-actions { display: flex; gap: 0.35rem; }
.badge-estado { padding: 0.2rem 0.65rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 600; }
.badge-activo { background: #dcfce7; color: #166534; }
.badge-inactivo { background: #F3F4F6; color: #6B7280; }
.btn-action { width: 32px; height: 32px; border-radius: 0.45rem; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 0.85rem; transition: background 0.15s, transform 0.1s; text-decoration: none; }
.btn-action:hover { transform: scale(1.1); }
.btn-action--edit { background: #fffde6; color: #d9cb00; }
.btn-action--del  { background: #fee2e2; color: #EF4444; }
.btn-action--edit:hover { background: #d9cb00; color: #fff; }
.btn-action--del:hover  { background: #EF4444; color: #fff; }

.btn-primary { background: #2B5494; color: #fff; border: none; padding: 0.6rem 1.25rem; border-radius: 0.6rem; font-size: 0.875rem; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; gap: 0.35rem; transition: background 0.2s, transform 0.15s; }
.btn-primary:hover:not(:disabled) { background: #1e3c6e; transform: translateY(-1px); }
.btn-primary:disabled { opacity: 0.7; cursor: not-allowed; }
.btn-secondary { background: #F3F4F6; color: #374151; border: none; padding: 0.6rem 1.25rem; border-radius: 0.6rem; font-size: 0.875rem; font-weight: 600; cursor: pointer; transition: background 0.15s; }
.btn-secondary:hover { background: #E5E7EB; }
.btn-danger { background: #EF4444; color: #fff; border: none; padding: 0.6rem 1.25rem; border-radius: 0.6rem; font-size: 0.875rem; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; gap: 0.35rem; transition: background 0.15s; }
.btn-danger:hover:not(:disabled) { background: #b91c1c; }
.btn-danger:disabled { opacity: 0.7; cursor: not-allowed; }

.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.45); display: flex; align-items: center; justify-content: center; z-index: 2000; padding: 1rem; }
.modal-box { background: #fff; border-radius: 1rem; width: 100%; max-width: 520px; box-shadow: 0 24px 64px rgba(0,0,0,0.18); max-height: 90vh; overflow-y: auto; }
.modal-box--sm { max-width: 380px; padding: 2rem; text-align: center; }
.modal-header { display: flex; align-items: center; justify-content: space-between; padding: 1.25rem 1.5rem; border-bottom: 1px solid #F3F4F6; }
.modal-title { font-size: 1rem; font-weight: 700; color: #1F2937; margin: 0; }
.modal-close { background: none; border: none; cursor: pointer; color: #9CA3AF; font-size: 1.1rem; padding: 0.25rem; border-radius: 0.35rem; }
.modal-close:hover { background: #F3F4F6; color: #374151; }
.modal-body { padding: 1.5rem; }
.modal-footer { display: flex; gap: 0.75rem; justify-content: flex-end; padding: 1rem 1.5rem; border-top: 1px solid #F3F4F6; }
.form-label-edu { display: block; font-size: 0.8rem; font-weight: 600; color: #374151; margin-bottom: 0.4rem; }
.form-input-edu { width: 100%; padding: 0.6rem 0.85rem; border: 1.5px solid #E5E9F0; border-radius: 0.55rem; font-size: 0.875rem; outline: none; transition: border-color 0.2s; }
.form-input-edu:focus { border-color: #2B5494; box-shadow: 0 0 0 3px rgba(43,84,148,0.08); }
.confirm-icon { font-size: 2.5rem; color: #F59E0B; margin-bottom: 0.75rem; }
.confirm-title { font-size: 1.1rem; font-weight: 700; color: #1F2937; margin: 0 0 0.5rem; }
.confirm-text { font-size: 0.875rem; color: #6B7280; margin: 0 0 1.5rem; }
.modal-box--sm .modal-footer { justify-content: center; padding: 0; border: none; }
</style>
