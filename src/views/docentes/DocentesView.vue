<template>
  <div>
    <!-- Header -->
    <div class="page-header">
      <div>
        <h1 class="page-header-title">
          <i class="bi bi-person-video3 me-2 text-blue"></i>Docentes
        </h1>
        <p class="page-header-sub">Gestión del cuerpo docente</p>
      </div>
      <button class="btn-primary" @click="openCreate">
        <i class="bi bi-plus-lg me-1"></i> Nuevo docente
      </button>
    </div>

    <!-- Filtros y buscador -->
    <div class="filters-bar">
      <div class="search-wrap">
        <i class="bi bi-search search-icon"></i>
        <input
          v-model="search"
          type="text"
          class="search-input"
          placeholder="Buscar por nombre, apellido o email..."
        />
        <button v-if="search" class="search-clear" @click="search = ''">
          <i class="bi bi-x-lg"></i>
        </button>
      </div>
      <select v-model="filtroArea" class="filter-select">
        <option value="">Todas las áreas</option>
        <option v-for="a in AREAS_DOCENTE" :key="a" :value="a">{{ a }}</option>
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
      <div class="table-info">
        {{ docentesFiltrados.length }} resultado{{ docentesFiltrados.length !== 1 ? 's' : '' }}
      </div>
      <div class="table-responsive">
        <table class="edu-table">
          <thead>
            <tr>
              <th>Docente</th>
              <th>Área</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="docentesFiltrados.length === 0">
              <td colspan="6" class="table-empty">
                <i class="bi bi-search me-2"></i>No se encontraron docentes
              </td>
            </tr>
            <tr v-for="doc in docentesFiltrados" :key="doc.id">
              <td>
                <div class="td-persona">
                  <div class="td-avatar">{{ doc.nombre[0] }}{{ doc.apellido[0] }}</div>
                  <div>
                    <div class="td-name">{{ doc.nombre }} {{ doc.apellido }}</div>
                    <div class="td-meta">ID #{{ doc.id }}</div>
                  </div>
                </div>
              </td>
              <td>
                <span class="badge-especialidad">{{ doc.area }}</span>
              </td>
              <td class="td-muted">{{ doc.email }}</td>
              <td class="td-muted">{{ doc.telefono }}</td>
              <td>
                <span :class="['badge-estado', doc.estado === 'activo' ? 'badge-activo' : 'badge-inactivo']">
                  {{ doc.estado }}
                </span>
              </td>
              <td>
                <div class="td-actions">
                  <RouterLink
                    :to="`/docentes/${doc.id}`"
                    class="btn-action btn-action--view"
                    title="Ver detalle"
                  >
                    <i class="bi bi-eye"></i>
                  </RouterLink>
                  <button class="btn-action btn-action--edit" title="Editar" @click="openEdit(doc)">
                    <i class="bi bi-pencil"></i>
                  </button>
                  <button class="btn-action btn-action--del" title="Eliminar" @click="confirmDelete(doc)">
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
          <h5 class="modal-title">
            {{ editingId ? 'Editar docente' : 'Nuevo docente' }}
          </h5>
          <button class="modal-close" @click="closeModal">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
        <form @submit.prevent="saveDocente" class="modal-body">
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
              <input v-model="form.email" type="email" class="form-input-edu" required placeholder="email@ejemplo.com" />
            </div>
            <div class="col-6">
              <label class="form-label-edu">Área *</label>
              <select v-model="form.area" class="form-input-edu" required>
                <option value="">Seleccionar...</option>
                <option v-for="a in AREAS_DOCENTE" :key="a" :value="a">{{ a }}</option>
              </select>
            </div>
            <div class="col-6">
              <label class="form-label-edu">Teléfono</label>
              <input v-model="form.telefono" type="text" class="form-input-edu" placeholder="099-000-000" />
            </div>
            <div class="col-6">
              <label class="form-label-edu">Estado</label>
              <select v-model="form.estado" class="form-input-edu">
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </select>
            </div>
            <!-- Cursos asignados -->
            <div class="col-12">
              <label class="form-label-edu">Cursos asignados</label>
              <div class="cursos-check-grid">
                <label
                  v-for="c in cursosOrdenados"
                  :key="c.id"
                  class="curso-check-item"
                >
                  <input
                    type="checkbox"
                    :value="c.id"
                    v-model="form.cursoIds"
                    class="curso-check-input"
                  />
                  <span class="curso-check-label">{{ cursoLabel(c) }}</span>
                </label>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn-secondary" @click="closeModal">Cancelar</button>
            <button type="submit" class="btn-primary" :disabled="saving">
              <span v-if="saving" class="spinner-border spinner-border-sm me-1" role="status"></span>
              {{ saving ? 'Guardando...' : (editingId ? 'Actualizar' : 'Crear docente') }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal Confirmar Eliminar -->
    <div v-if="showConfirm" class="modal-overlay" @click.self="showConfirm = false">
      <div class="modal-box modal-box--sm">
        <div class="confirm-icon"><i class="bi bi-exclamation-triangle-fill"></i></div>
        <h5 class="confirm-title">¿Eliminar docente?</h5>
        <p class="confirm-text">
          Se eliminará a <strong>{{ deleteTarget?.nombre }} {{ deleteTarget?.apellido }}</strong>.
          Esta acción no se puede deshacer.
        </p>
        <div class="modal-footer">
          <button class="btn-secondary" @click="showConfirm = false">Cancelar</button>
          <button class="btn-danger" @click="deleteDocente" :disabled="saving">
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
import { docenteService } from '@/services/docenteService'
import { cursoService } from '@/services/cursoService'
import { useNotification } from '@/composables/useNotification'
import { AREAS_DOCENTE, AÑOS_CURSO, cursoLabel } from '@/types'
import type { Docente, DocenteForm, Curso } from '@/types'

const { notify } = useNotification()

const docentes = ref<Docente[]>([])
const cursos = ref<Curso[]>([])
const loading = ref(true)
const saving = ref(false)
const search = ref('')
const filtroArea = ref('')
const filtroEstado = ref('')

const showModal = ref(false)
const showConfirm = ref(false)
const editingId = ref<number | null>(null)
const deleteTarget = ref<Docente | null>(null)

const cursosOrdenados = computed(() =>
  [...cursos.value].sort((a, b) => {
    const ai = AÑOS_CURSO.indexOf(a.año), bi = AÑOS_CURSO.indexOf(b.año)
    return ai !== bi ? ai - bi : a.paralelo.localeCompare(b.paralelo)
  })
)

const emptyForm = (): DocenteForm => ({
  nombre: '', apellido: '', email: '', area: '', telefono: '', estado: 'activo', cursoIds: []
})
const form = reactive<DocenteForm>(emptyForm())

const docentesFiltrados = computed(() => {
  return docentes.value.filter(d => {
    const q = search.value.toLowerCase()
    const matchSearch = !q || [d.nombre, d.apellido, d.email].some(v => v.toLowerCase().includes(q))
    const matchEsp = !filtroArea.value || d.area === filtroArea.value
    const matchEstado = !filtroEstado.value || d.estado === filtroEstado.value
    return matchSearch && matchEsp && matchEstado
  })
})

onMounted(async () => {
  loading.value = true
  try {
    const [d, c] = await Promise.all([docenteService.getAll(), cursoService.getAll()])
    docentes.value = d
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

function openEdit(doc: Docente) {
  editingId.value = doc.id
  Object.assign(form, {
    nombre: doc.nombre, apellido: doc.apellido, email: doc.email,
    area: doc.area, telefono: doc.telefono, estado: doc.estado,
    cursoIds: [...(doc.cursoIds ?? [])]
  })
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  editingId.value = null
}

async function saveDocente() {
  saving.value = true
  try {
    if (editingId.value) {
      const updated = await docenteService.update(editingId.value, { ...form })
      const idx = docentes.value.findIndex(d => d.id === editingId.value)
      if (idx !== -1) docentes.value[idx] = updated
      notify('Docente actualizado correctamente', 'success')
    } else {
      const created = await docenteService.create({ ...form })
      docentes.value.unshift(created)
      notify('Docente creado correctamente', 'success')
    }
    closeModal()
  } catch {
    notify('Ocurrió un error al guardar', 'danger')
  } finally {
    saving.value = false
  }
}

function confirmDelete(doc: Docente) {
  deleteTarget.value = doc
  showConfirm.value = true
}

async function deleteDocente() {
  if (!deleteTarget.value) return
  saving.value = true
  try {
    await docenteService.delete(deleteTarget.value.id)
    docentes.value = docentes.value.filter(d => d.id !== deleteTarget.value!.id)
    notify('Docente eliminado', 'success')
    showConfirm.value = false
  } catch {
    notify('No se pudo eliminar el docente', 'danger')
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
/* ── Page Header ─────────────────────────────────────────── */
.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}
.page-header-title { font-size: 1.45rem; font-weight: 700; color: #1F2937; margin: 0 0 0.2rem; }
.page-header-sub { color: #6B7280; margin: 0; font-size: 0.875rem; }
.text-blue { color: #2B5494; }

/* ── Filters ─────────────────────────────────────────────── */
.filters-bar {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
  flex-wrap: wrap;
}
.search-wrap { position: relative; flex: 1; min-width: 200px; }
.search-icon {
  position: absolute;
  left: 0.85rem;
  top: 50%;
  transform: translateY(-50%);
  color: #9CA3AF;
  font-size: 0.9rem;
}
.search-input {
  width: 100%;
  padding: 0.6rem 2.5rem;
  border: 1.5px solid #E5E9F0;
  border-radius: 0.6rem;
  font-size: 0.875rem;
  outline: none;
  transition: border-color 0.2s;
  background: #fff;
}
.search-input:focus { border-color: #2B5494; box-shadow: 0 0 0 3px rgba(43,84,148,0.08); }
.search-clear {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: #9CA3AF;
  padding: 0;
  font-size: 0.8rem;
}
.filter-select {
  padding: 0.6rem 0.85rem;
  border: 1.5px solid #E5E9F0;
  border-radius: 0.6rem;
  font-size: 0.875rem;
  outline: none;
  background: #fff;
  min-width: 160px;
}
.filter-select:focus { border-color: #2B5494; }

/* ── Spinner ─────────────────────────────────────────────── */
.spinner-wrap { display: flex; justify-content: center; padding: 3rem; }

/* ── Table Card ──────────────────────────────────────────── */
.table-card {
  background: #fff;
  border-radius: 1rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
  overflow: hidden;
}
.table-info {
  padding: 0.75rem 1.25rem;
  font-size: 0.8rem;
  color: #6B7280;
  border-bottom: 1px solid #F3F4F6;
}
.edu-table {
  width: 100%;
  border-collapse: collapse;
}
.edu-table th {
  padding: 0.85rem 1rem;
  text-align: left;
  font-size: 0.78rem;
  font-weight: 600;
  color: #6B7280;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  background: #F9FAFB;
  border-bottom: 1px solid #F3F4F6;
}
.edu-table td {
  padding: 0.85rem 1rem;
  font-size: 0.875rem;
  color: #1F2937;
  border-bottom: 1px solid #F9FAFB;
  vertical-align: middle;
}
.edu-table tbody tr:hover { background: #FAFBFD; }
.table-empty { text-align: center; color: #9CA3AF; padding: 2.5rem !important; }

/* ── Table cell helpers ───────────────────────────────────── */
.td-persona { display: flex; align-items: center; gap: 0.75rem; }
.td-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #2B5494;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.72rem;
  font-weight: 700;
  flex-shrink: 0;
}
.td-name { font-weight: 600; color: #1F2937; }
.td-meta { font-size: 0.75rem; color: #9CA3AF; }
.td-muted { color: #6B7280; font-size: 0.85rem; }

.badge-especialidad {
  background: #eef3fb;
  color: #2B5494;
  padding: 0.2rem 0.65rem;
  border-radius: 0.4rem;
  font-size: 0.75rem;
  font-weight: 600;
}
.badge-estado {
  padding: 0.2rem 0.65rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
}
.badge-activo { background: #dcfce7; color: #166534; }
.badge-inactivo { background: #F3F4F6; color: #6B7280; }

.td-actions { display: flex; gap: 0.35rem; }
.btn-action {
  width: 32px;
  height: 32px;
  border-radius: 0.45rem;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  transition: background 0.15s, transform 0.1s;
  text-decoration: none;
}
.btn-action:hover { transform: scale(1.1); }
.btn-action--view { background: #eef3fb; color: #2B5494; }
.btn-action--edit { background: #fffde6; color: #d9cb00; }
.btn-action--del  { background: #fee2e2; color: #EF4444; }
.btn-action--view:hover { background: #2B5494; color: #fff; }
.btn-action--edit:hover { background: #d9cb00; color: #fff; }
.btn-action--del:hover  { background: #EF4444; color: #fff; }

/* ── Buttons ─────────────────────────────────────────────── */
.btn-primary {
  background: #2B5494;
  color: #fff;
  border: none;
  padding: 0.6rem 1.25rem;
  border-radius: 0.6rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  transition: background 0.2s, transform 0.15s;
}
.btn-primary:hover:not(:disabled) { background: #1e3c6e; transform: translateY(-1px); }
.btn-primary:disabled { opacity: 0.7; cursor: not-allowed; }

.btn-secondary {
  background: #F3F4F6;
  color: #374151;
  border: none;
  padding: 0.6rem 1.25rem;
  border-radius: 0.6rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
}
.btn-secondary:hover { background: #E5E7EB; }

.btn-danger {
  background: #EF4444;
  color: #fff;
  border: none;
  padding: 0.6rem 1.25rem;
  border-radius: 0.6rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  transition: background 0.15s;
}
.btn-danger:hover:not(:disabled) { background: #b91c1c; }
.btn-danger:disabled { opacity: 0.7; cursor: not-allowed; }

/* ── Modal ───────────────────────────────────────────────── */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 1rem;
}
.modal-box {
  background: #fff;
  border-radius: 1rem;
  width: 100%;
  max-width: 560px;
  box-shadow: 0 24px 64px rgba(0,0,0,0.18);
  max-height: 90vh;
  overflow-y: auto;
}
.modal-box--sm { max-width: 380px; padding: 2rem; text-align: center; }
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #F3F4F6;
}
.modal-title { font-size: 1rem; font-weight: 700; color: #1F2937; margin: 0; }
.modal-close {
  background: none;
  border: none;
  cursor: pointer;
  color: #9CA3AF;
  font-size: 1.1rem;
  padding: 0.25rem;
  border-radius: 0.35rem;
}
.modal-close:hover { background: #F3F4F6; color: #374151; }
.modal-body { padding: 1.5rem; }
.modal-footer {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  padding: 1rem 1.5rem;
  border-top: 1px solid #F3F4F6;
}

.form-label-edu {
  display: block;
  font-size: 0.8rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.4rem;
}
.form-input-edu {
  width: 100%;
  padding: 0.6rem 0.85rem;
  border: 1.5px solid #E5E9F0;
  border-radius: 0.55rem;
  font-size: 0.875rem;
  outline: none;
  transition: border-color 0.2s;
}
.form-input-edu:focus { border-color: #2B5494; box-shadow: 0 0 0 3px rgba(43,84,148,0.08); }

/* ── Cursos checkboxes ───────────────────────────────────── */
.cursos-check-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 0.45rem;
  max-height: 180px;
  overflow-y: auto;
  padding: 0.6rem;
  border: 1.5px solid #E5E9F0;
  border-radius: 0.55rem;
  background: #FAFAFA;
}
.curso-check-item {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  cursor: pointer;
  padding: 0.3rem 0.4rem;
  border-radius: 0.35rem;
  transition: background 0.12s;
}
.curso-check-item:hover { background: #eef3fb; }
.curso-check-input { accent-color: #2B5494; cursor: pointer; flex-shrink: 0; }
.curso-check-label { font-size: 0.82rem; color: #374151; font-weight: 500; }

/* ── Confirm ─────────────────────────────────────────────── */
.confirm-icon { font-size: 2.5rem; color: #F59E0B; margin-bottom: 0.75rem; }
.confirm-title { font-size: 1.1rem; font-weight: 700; color: #1F2937; margin: 0 0 0.5rem; }
.confirm-text { font-size: 0.875rem; color: #6B7280; margin: 0 0 1.5rem; }
.modal-box--sm .modal-footer { justify-content: center; padding: 0; border: none; }
</style>
