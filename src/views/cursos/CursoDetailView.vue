<template>
  <div>
    <!-- Back -->
    <RouterLink to="/cursos" class="back-link">
      <i class="bi bi-arrow-left me-1"></i> Volver a cursos
    </RouterLink>

    <!-- Spinner -->
    <div v-if="loading" class="spinner-wrap">
      <div class="spinner-border text-primary" role="status"></div>
    </div>

    <template v-else-if="curso">
      <!-- Hero del curso -->
      <div class="detail-hero">
        <div class="curso-hero-icon"><i class="bi bi-book-fill"></i></div>
        <div class="detail-info">
          <div class="detail-badges">
            <span class="badge-nivel">{{ curso.año }} Sec</span>
            <span class="badge-paralelo">Paralelo {{ curso.paralelo }}</span>
            <span :class="['badge-estado', curso.estado === 'activo' ? 'badge-activo' : 'badge-inactivo']">
              {{ curso.estado }}
            </span>
          </div>
          <h1 class="detail-name">{{ cursoLabel(curso) }}</h1>
          <div class="detail-meta-row">
            <span class="meta-chip"><i class="bi bi-clock me-1"></i>{{ curso.turno }}</span>
            <span class="meta-chip"><i class="bi bi-people me-1"></i>Cupo: {{ curso.cupo }}</span>
          </div>
        </div>
      </div>

      <!-- Estudiantes del curso -->
      <div class="section-card">
        <div class="section-header">
          <h5 class="section-title">
            <i class="bi bi-people-fill me-2"></i>
            Estudiantes matriculados
            <span class="section-count">{{ estudiantes.length }}</span>
          </h5>
          <button class="btn-primary btn-sm" @click="openCreateEstudiante">
            <i class="bi bi-plus-lg me-1"></i> Agregar estudiante
          </button>
        </div>

        <div v-if="loadingEst" class="spinner-wrap">
          <div class="spinner-border spinner-border-sm text-primary" role="status"></div>
        </div>

        <!-- Buscador de estudiantes -->
        <div v-else class="section-search-bar">
          <div class="search-wrap-sm">
            <i class="bi bi-search search-icon"></i>
            <input
              v-model="searchEst"
              type="text"
              class="search-input-sm"
              placeholder="Buscar estudiante..."
            />
          </div>
        </div>

        <div v-if="!loadingEst" class="table-responsive">
          <table class="edu-table">
            <thead>
              <tr>
                <th>Estudiante</th>
                <th>Matrícula</th>
                <th>Email</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="estudiantesFiltrados.length === 0">
                <td colspan="5" class="table-empty">
                  <i class="bi bi-people me-2"></i>
                  {{ searchEst ? 'Sin resultados' : 'No hay estudiantes matriculados' }}
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
                  <span :class="['badge-estado', est.estado === 'activo' ? 'badge-activo' : 'badge-inactivo']">
                    {{ est.estado }}
                  </span>
                </td>
                <td>
                  <div class="td-actions">
                    <button class="btn-action btn-action--edit" @click="openEditEstudiante(est)">
                      <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn-action btn-action--del" @click="confirmDeleteEst(est)">
                      <i class="bi bi-trash3"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>

    <!-- Not found -->
    <div v-else class="not-found">
      <i class="bi bi-journal-x not-found-icon"></i>
      <p>Curso no encontrado</p>
      <RouterLink to="/cursos" class="btn-primary">Volver</RouterLink>
    </div>

    <!-- Modal Estudiante -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-box">
        <div class="modal-header">
          <h5 class="modal-title">{{ editingEstId ? 'Editar estudiante' : 'Agregar estudiante' }}</h5>
          <button class="modal-close" @click="closeModal"><i class="bi bi-x-lg"></i></button>
        </div>
        <form @submit.prevent="saveEstudiante" class="modal-body">
          <div class="row g-3">
            <div class="col-6">
              <label class="form-label-edu">Nombre *</label>
              <input v-model="estForm.nombre" type="text" class="form-input-edu" required placeholder="Nombre" />
            </div>
            <div class="col-6">
              <label class="form-label-edu">Apellido *</label>
              <input v-model="estForm.apellido" type="text" class="form-input-edu" required placeholder="Apellido" />
            </div>
            <div class="col-12">
              <label class="form-label-edu">Email *</label>
              <input v-model="estForm.email" type="email" class="form-input-edu" required placeholder="email@alumno.edu" />
            </div>
            <div class="col-6">
              <label class="form-label-edu">Matrícula *</label>
              <input v-model="estForm.matricula" type="text" class="form-input-edu" required placeholder="ALU-2024-000" />
            </div>
            <div class="col-6">
              <label class="form-label-edu">Estado</label>
              <select v-model="estForm.estado" class="form-input-edu">
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </select>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn-secondary" @click="closeModal">Cancelar</button>
            <button type="submit" class="btn-primary" :disabled="saving">
              <span v-if="saving" class="spinner-border spinner-border-sm me-1" role="status"></span>
              {{ saving ? 'Guardando...' : (editingEstId ? 'Actualizar' : 'Agregar') }}
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
import { useRoute, RouterLink } from 'vue-router'
import { cursoService } from '@/services/cursoService'
import { estudianteService } from '@/services/estudianteService'
import { useNotification } from '@/composables/useNotification'
import { cursoLabel } from '@/types'
import type { Curso, Estudiante, EstudianteForm } from '@/types'

const route = useRoute()
const { notify } = useNotification()

const curso = ref<Curso | null>(null)
const estudiantes = ref<Estudiante[]>([])
const loading = ref(true)
const loadingEst = ref(true)
const saving = ref(false)
const searchEst = ref('')

const showModal = ref(false)
const showConfirm = ref(false)
const editingEstId = ref<number | null>(null)
const deleteTarget = ref<Estudiante | null>(null)

const emptyEstForm = (): EstudianteForm => ({
  nombre: '', apellido: '', email: '', matricula: '',
  cursoId: Number(route.params.id), estado: 'activo'
})
const estForm = reactive<EstudianteForm>(emptyEstForm())

const estudiantesFiltrados = computed(() => {
  const q = searchEst.value.toLowerCase()
  if (!q) return estudiantes.value
  return estudiantes.value.filter(e =>
    [e.nombre, e.apellido, e.email, e.matricula].some(v => v.toLowerCase().includes(q))
  )
})

onMounted(async () => {
  const id = Number(route.params.id)
  try {
    curso.value = await cursoService.getById(id)
  } finally {
    loading.value = false
  }

  if (curso.value) {
    try {
      estudiantes.value = await estudianteService.getByCurso(id)
    } finally {
      loadingEst.value = false
    }
  }
})

function openCreateEstudiante() {
  editingEstId.value = null
  Object.assign(estForm, emptyEstForm())
  showModal.value = true
}

function openEditEstudiante(est: Estudiante) {
  editingEstId.value = est.id
  Object.assign(estForm, {
    nombre: est.nombre, apellido: est.apellido, email: est.email,
    matricula: est.matricula, cursoId: est.cursoId, estado: est.estado
  })
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  editingEstId.value = null
}

async function saveEstudiante() {
  saving.value = true
  try {
    if (editingEstId.value) {
      const updated = await estudianteService.update(editingEstId.value, { ...estForm })
      const idx = estudiantes.value.findIndex(e => e.id === editingEstId.value)
      if (idx !== -1) estudiantes.value[idx] = updated
      notify('Estudiante actualizado', 'success')
    } else {
      const created = await estudianteService.create({ ...estForm })
      estudiantes.value.unshift(created)
      notify('Estudiante agregado al curso', 'success')
    }
    closeModal()
  } catch {
    notify('Ocurrió un error al guardar', 'danger')
  } finally {
    saving.value = false
  }
}

function confirmDeleteEst(est: Estudiante) {
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
.back-link {
  display: inline-flex; align-items: center;
  color: #2B5494; font-size: 0.875rem; font-weight: 600;
  text-decoration: none; margin-bottom: 1.25rem; transition: color 0.15s;
}
.back-link:hover { color: #1e3c6e; text-decoration: underline; }
.spinner-wrap { display: flex; justify-content: center; padding: 3rem; }

/* ── Hero ─────────────────────────────────────────────────── */
.detail-hero {
  background: #fff; border-radius: 1rem; padding: 1.75rem;
  display: flex; align-items: flex-start; gap: 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07); margin-bottom: 1.25rem; flex-wrap: wrap;
}
.curso-hero-icon {
  width: 72px; height: 72px; border-radius: 1rem;
  background: linear-gradient(135deg, #2B5494, #3d6cb5);
  color: #fff; display: flex; align-items: center; justify-content: center;
  font-size: 1.75rem; flex-shrink: 0;
}
.detail-badges { display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 0.5rem; }
.detail-name { font-size: 1.5rem; font-weight: 800; color: #1F2937; margin: 0 0 0.5rem; }
.detail-desc { color: #6B7280; font-size: 0.9rem; margin: 0 0 0.85rem; }
.detail-meta-row { display: flex; gap: 0.6rem; flex-wrap: wrap; }
.meta-chip {
  display: inline-flex; align-items: center;
  background: #F3F4F6; color: #374151;
  padding: 0.3rem 0.75rem; border-radius: 9999px;
  font-size: 0.78rem; font-weight: 500;
}
.meta-chip--blue { background: #eef3fb; color: #2B5494; }
.meta-link { color: inherit; text-decoration: none; font-weight: 600; }
.meta-link:hover { text-decoration: underline; }

.badge-nivel { background: #fffde6; color: #a16207; padding: 0.25rem 0.75rem; border-radius: 0.4rem; font-size: 0.8rem; font-weight: 600; }
.badge-paralelo { background: #eef3fb; color: #2B5494; padding: 0.25rem 0.75rem; border-radius: 0.4rem; font-size: 0.8rem; font-weight: 600; }
.badge-estado { padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.8rem; font-weight: 600; }
.badge-activo { background: #dcfce7; color: #166534; }
.badge-inactivo { background: #F3F4F6; color: #6B7280; }

/* ── Section ─────────────────────────────────────────────── */
.section-card { background: #fff; border-radius: 1rem; box-shadow: 0 2px 8px rgba(0,0,0,0.07); overflow: hidden; }
.section-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 1rem 1.5rem; border-bottom: 1px solid #F3F4F6; flex-wrap: wrap; gap: 0.75rem;
}
.section-title { font-size: 0.95rem; font-weight: 700; color: #1F2937; margin: 0; display: flex; align-items: center; gap: 0.35rem; }
.section-count { background: #eef3fb; color: #2B5494; padding: 0.1rem 0.55rem; border-radius: 9999px; font-size: 0.78rem; font-weight: 700; }

.section-search-bar { padding: 0.75rem 1.25rem; border-bottom: 1px solid #F9FAFB; }
.search-wrap-sm { position: relative; max-width: 320px; }
.search-icon { position: absolute; left: 0.75rem; top: 50%; transform: translateY(-50%); color: #9CA3AF; font-size: 0.85rem; }
.search-input-sm {
  width: 100%; padding: 0.5rem 0.75rem 0.5rem 2.25rem;
  border: 1.5px solid #E5E9F0; border-radius: 0.55rem;
  font-size: 0.85rem; outline: none; background: #fff;
}
.search-input-sm:focus { border-color: #2B5494; }

.edu-table { width: 100%; border-collapse: collapse; }
.edu-table th {
  padding: 0.85rem 1rem; text-align: left; font-size: 0.78rem;
  font-weight: 600; color: #6B7280; text-transform: uppercase;
  letter-spacing: 0.04em; background: #F9FAFB; border-bottom: 1px solid #F3F4F6;
}
.edu-table td { padding: 0.85rem 1rem; font-size: 0.875rem; color: #1F2937; border-bottom: 1px solid #F9FAFB; vertical-align: middle; }
.edu-table tbody tr:hover { background: #FAFBFD; }
.table-empty { text-align: center; color: #9CA3AF; padding: 2.5rem !important; }

.td-persona { display: flex; align-items: center; gap: 0.75rem; }
.td-avatar { width: 36px; height: 36px; border-radius: 50%; background: #2B5494; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 0.72rem; font-weight: 700; flex-shrink: 0; }
.td-name { font-weight: 600; color: #1F2937; }
.td-meta { font-size: 0.75rem; color: #9CA3AF; }
.td-muted { color: #6B7280; font-size: 0.85rem; }
.td-code { background: #F3F4F6; padding: 0.15rem 0.5rem; border-radius: 0.35rem; font-size: 0.8rem; color: #374151; }
.td-actions { display: flex; gap: 0.35rem; }

.btn-action { width: 32px; height: 32px; border-radius: 0.45rem; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 0.85rem; transition: background 0.15s, transform 0.1s; text-decoration: none; }
.btn-action:hover { transform: scale(1.1); }
.btn-action--edit { background: #fffde6; color: #d9cb00; }
.btn-action--del  { background: #fee2e2; color: #EF4444; }
.btn-action--edit:hover { background: #d9cb00; color: #fff; }
.btn-action--del:hover  { background: #EF4444; color: #fff; }

.btn-primary { background: #2B5494; color: #fff; border: none; padding: 0.6rem 1.25rem; border-radius: 0.6rem; font-size: 0.875rem; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; gap: 0.35rem; transition: background 0.2s, transform 0.15s; text-decoration: none; }
.btn-primary:hover:not(:disabled) { background: #1e3c6e; transform: translateY(-1px); }
.btn-primary:disabled { opacity: 0.7; cursor: not-allowed; }
.btn-sm { padding: 0.45rem 0.9rem; font-size: 0.82rem; }

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
.not-found { text-align: center; padding: 4rem 2rem; color: #9CA3AF; }
.not-found-icon { font-size: 3rem; margin-bottom: 0.75rem; display: block; }
</style>
