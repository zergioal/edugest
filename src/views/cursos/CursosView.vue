<template>
  <div>
    <!-- Header -->
    <div class="page-header">
      <div>
        <h1 class="page-header-title">
          <i class="bi bi-journal-bookmark-fill me-2 text-blue"></i>Cursos
        </h1>
        <p class="page-header-sub">Gestión de cursos y paralelos</p>
      </div>
      <button class="btn-primary" @click="openCreate">
        <i class="bi bi-plus-lg me-1"></i> Nuevo curso
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
          placeholder="Buscar por año o paralelo..."
        />
        <button v-if="search" class="search-clear" @click="search = ''">
          <i class="bi bi-x-lg"></i>
        </button>
      </div>
      <select v-model="filtroAño" class="filter-select">
        <option value="">Todos los años</option>
        <option v-for="a in AÑOS_CURSO" :key="a" :value="a">{{ a }} Sec</option>
      </select>
      <select v-model="filtroParalelo" class="filter-select">
        <option value="">Todos los paralelos</option>
        <option v-for="p in PARALELOS_CURSO" :key="p" :value="p">Paralelo {{ p }}</option>
      </select>
      <select v-model="filtroTurno" class="filter-select">
        <option value="">Todos los turnos</option>
        <option value="Mañana">Mañana</option>
        <option value="Tarde">Tarde</option>
        <option value="Noche">Noche</option>
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
      <div class="table-info">{{ cursosFiltrados.length }} resultado{{ cursosFiltrados.length !== 1 ? 's' : '' }}</div>
      <div class="table-responsive">
        <table class="edu-table">
          <thead>
            <tr>
              <th>Curso</th>
              <th>Paralelo</th>
              <th>Turno</th>
              <th>Cupo</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="cursosFiltrados.length === 0">
              <td colspan="6" class="table-empty">
                <i class="bi bi-search me-2"></i>No se encontraron cursos
              </td>
            </tr>
            <tr v-for="curso in cursosFiltrados" :key="curso.id">
              <td>
                <div class="td-curso-nombre">
                  <div class="td-curso-icon">{{ curso.año[0] }}</div>
                  <div>
                    <div class="td-name">{{ curso.año }} Sec</div>
                    <div class="td-meta">ID #{{ curso.id }}</div>
                  </div>
                </div>
              </td>
              <td>
                <span class="badge-paralelo">Paralelo {{ curso.paralelo }}</span>
              </td>
              <td class="td-muted">{{ curso.turno }}</td>
              <td class="td-muted">{{ curso.cupo }}</td>
              <td>
                <span :class="['badge-estado', curso.estado === 'activo' ? 'badge-activo' : 'badge-inactivo']">
                  {{ curso.estado }}
                </span>
              </td>
              <td>
                <div class="td-actions">
                  <RouterLink :to="`/cursos/${curso.id}`" class="btn-action btn-action--view" title="Ver estudiantes">
                    <i class="bi bi-eye"></i>
                  </RouterLink>
                  <button class="btn-action btn-action--edit" title="Editar" @click="openEdit(curso)">
                    <i class="bi bi-pencil"></i>
                  </button>
                  <button class="btn-action btn-action--del" title="Eliminar" @click="confirmDelete(curso)">
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
          <h5 class="modal-title">{{ editingId ? 'Editar curso' : 'Nuevo curso' }}</h5>
          <button class="modal-close" @click="closeModal"><i class="bi bi-x-lg"></i></button>
        </div>
        <form @submit.prevent="saveCurso" class="modal-body">
          <div class="row g-3">
            <!-- Año -->
            <div class="col-6">
              <label class="form-label-edu">Año *</label>
              <select v-model="form.año" class="form-input-edu" required>
                <option value="">Seleccionar...</option>
                <option v-for="a in AÑOS_CURSO" :key="a" :value="a">{{ a }} Sec</option>
              </select>
            </div>
            <!-- Paralelo -->
            <div class="col-6">
              <label class="form-label-edu">Paralelo *</label>
              <select v-model="form.paralelo" class="form-input-edu" required>
                <option value="">Seleccionar...</option>
                <option v-for="p in PARALELOS_CURSO" :key="p" :value="p">{{ p }}</option>
              </select>
            </div>

            <!-- Vista previa del nombre -->
            <div class="col-12" v-if="form.año && form.paralelo">
              <div class="preview-nombre">
                <i class="bi bi-eye me-1"></i>
                Nombre del curso: <strong>{{ form.año }} "{{ form.paralelo }}" Sec</strong>
              </div>
            </div>

            <!-- Turno -->
            <div class="col-6">
              <label class="form-label-edu">Turno *</label>
              <select v-model="form.turno" class="form-input-edu" required>
                <option value="Mañana">Mañana</option>
                <option value="Tarde">Tarde</option>
                <option value="Noche">Noche</option>
              </select>
            </div>
            <!-- Cupo -->
            <div class="col-6">
              <label class="form-label-edu">Cupo máximo</label>
              <input v-model.number="form.cupo" type="number" class="form-input-edu" min="1" max="60" />
            </div>
            <!-- Estado -->
            <div class="col-6">
              <label class="form-label-edu">Estado</label>
              <select v-model="form.estado" class="form-input-edu">
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </select>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn-secondary" @click="closeModal">Cancelar</button>
            <button type="submit" class="btn-primary" :disabled="saving">
              <span v-if="saving" class="spinner-border spinner-border-sm me-1" role="status"></span>
              {{ saving ? 'Guardando...' : (editingId ? 'Actualizar' : 'Crear curso') }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Confirm Eliminar -->
    <div v-if="showConfirm" class="modal-overlay" @click.self="showConfirm = false">
      <div class="modal-box modal-box--sm">
        <div class="confirm-icon"><i class="bi bi-exclamation-triangle-fill"></i></div>
        <h5 class="confirm-title">¿Eliminar curso?</h5>
        <p class="confirm-text">
          Se eliminará <strong>{{ deleteTarget ? `${deleteTarget.año} "${deleteTarget.paralelo}" Sec` : '' }}</strong>.
          Los estudiantes vinculados quedarán sin curso.
        </p>
        <div class="modal-footer">
          <button class="btn-secondary" @click="showConfirm = false">Cancelar</button>
          <button class="btn-danger" @click="deleteCurso" :disabled="saving">
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
import { cursoService } from '@/services/cursoService'
import { useNotification } from '@/composables/useNotification'
import { AÑOS_CURSO, PARALELOS_CURSO } from '@/types'
import type { Curso, CursoForm } from '@/types'

const { notify } = useNotification()

const cursos = ref<Curso[]>([])
const loading = ref(true)
const saving = ref(false)
const search = ref('')
const filtroAño = ref('')
const filtroParalelo = ref('')
const filtroTurno = ref('')
const filtroEstado = ref('')

const showModal = ref(false)
const showConfirm = ref(false)
const editingId = ref<number | null>(null)
const deleteTarget = ref<Curso | null>(null)

const emptyForm = (): CursoForm => ({
  año: '1ro', paralelo: 'A', turno: 'Mañana', cupo: 35, estado: 'activo'
})
const form = reactive<CursoForm>(emptyForm())

const cursosFiltrados = computed(() => {
  return cursos.value.filter(c => {
    const q = search.value.toLowerCase()
    const matchSearch = !q || [`${c.año} ${c.paralelo}`, c.año, c.paralelo].some(v => v.toLowerCase().includes(q))
    const matchAño = !filtroAño.value || c.año === filtroAño.value
    const matchPar = !filtroParalelo.value || c.paralelo === filtroParalelo.value
    const matchTurno = !filtroTurno.value || c.turno === filtroTurno.value
    const matchEstado = !filtroEstado.value || c.estado === filtroEstado.value
    return matchSearch && matchAño && matchPar && matchTurno && matchEstado
  })
})

onMounted(async () => {
  try {
    cursos.value = await cursoService.getAll()
  } finally {
    loading.value = false
  }
})

function openCreate() {
  editingId.value = null
  Object.assign(form, emptyForm())
  showModal.value = true
}

function openEdit(curso: Curso) {
  editingId.value = curso.id
  Object.assign(form, {
    año: curso.año, paralelo: curso.paralelo,
    turno: curso.turno, cupo: curso.cupo, estado: curso.estado
  })
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  editingId.value = null
}

async function saveCurso() {
  saving.value = true
  try {
    if (editingId.value) {
      const updated = await cursoService.update(editingId.value, { ...form })
      const idx = cursos.value.findIndex(c => c.id === editingId.value)
      if (idx !== -1) cursos.value[idx] = updated
      notify('Curso actualizado correctamente', 'success')
    } else {
      const created = await cursoService.create({ ...form })
      cursos.value.push(created)
      cursos.value.sort((a, b) => {
        const ai = AÑOS_CURSO.indexOf(a.año), bi = AÑOS_CURSO.indexOf(b.año)
        return ai !== bi ? ai - bi : a.paralelo.localeCompare(b.paralelo)
      })
      notify('Curso creado correctamente', 'success')
    }
    closeModal()
  } catch {
    notify('Ocurrió un error al guardar', 'danger')
  } finally {
    saving.value = false
  }
}

function confirmDelete(curso: Curso) {
  deleteTarget.value = curso
  showConfirm.value = true
}

async function deleteCurso() {
  if (!deleteTarget.value) return
  saving.value = true
  try {
    await cursoService.delete(deleteTarget.value.id)
    cursos.value = cursos.value.filter(c => c.id !== deleteTarget.value!.id)
    notify('Curso eliminado', 'success')
    showConfirm.value = false
  } catch {
    notify('No se pudo eliminar el curso', 'danger')
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.page-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; margin-bottom: 1.5rem; flex-wrap: wrap; }
.page-header-title { font-size: 1.45rem; font-weight: 700; color: #1F2937; margin: 0 0 0.2rem; }
.page-header-sub { color: #6B7280; margin: 0; font-size: 0.875rem; }
.text-blue { color: #2b5494; }

.filters-bar { display: flex; gap: 0.75rem; margin-bottom: 1.25rem; flex-wrap: wrap; }
.search-wrap { position: relative; flex: 1; min-width: 200px; }
.search-icon { position: absolute; left: 0.85rem; top: 50%; transform: translateY(-50%); color: #9CA3AF; font-size: 0.9rem; }
.search-input { width: 100%; padding: 0.6rem 2.5rem; border: 1.5px solid #E5E9F0; border-radius: 0.6rem; font-size: 0.875rem; outline: none; background: #fff; transition: border-color 0.2s; }
.search-input:focus { border-color: #2b5494; box-shadow: 0 0 0 3px rgba(43,84,148,0.08); }
.search-clear { position: absolute; right: 0.75rem; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: #9CA3AF; padding: 0; font-size: 0.8rem; }
.filter-select { padding: 0.6rem 0.85rem; border: 1.5px solid #E5E9F0; border-radius: 0.6rem; font-size: 0.875rem; outline: none; background: #fff; min-width: 140px; }
.filter-select:focus { border-color: #2b5494; }

.spinner-wrap { display: flex; justify-content: center; padding: 3rem; }
.table-card { background: #fff; border-radius: 1rem; box-shadow: 0 2px 8px rgba(0,0,0,0.07); overflow: hidden; }
.table-info { padding: 0.75rem 1.25rem; font-size: 0.8rem; color: #6B7280; border-bottom: 1px solid #F3F4F6; }
.edu-table { width: 100%; border-collapse: collapse; }
.edu-table th { padding: 0.85rem 1rem; text-align: left; font-size: 0.78rem; font-weight: 600; color: #6B7280; text-transform: uppercase; letter-spacing: 0.04em; background: #F9FAFB; border-bottom: 1px solid #F3F4F6; }
.edu-table td { padding: 0.85rem 1rem; font-size: 0.875rem; color: #1F2937; border-bottom: 1px solid #F9FAFB; vertical-align: middle; }
.edu-table tbody tr:hover { background: #FAFBFD; }
.table-empty { text-align: center; color: #9CA3AF; padding: 2.5rem !important; }

.td-curso-nombre { display: flex; align-items: center; gap: 0.75rem; }
.td-curso-icon {
  width: 36px; height: 36px; border-radius: 0.6rem;
  background: linear-gradient(135deg, #2b5494, #3d6cb5);
  color: #fff; display: flex; align-items: center; justify-content: center;
  font-size: 1rem; font-weight: 800; flex-shrink: 0;
}
.td-name { font-weight: 700; color: #1F2937; }
.td-meta { font-size: 0.75rem; color: #9CA3AF; }
.td-muted { color: #6B7280; font-size: 0.85rem; }

.badge-paralelo {
  background: #eef3fb; color: #2b5494;
  padding: 0.2rem 0.7rem; border-radius: 0.4rem;
  font-size: 0.78rem; font-weight: 700;
}
.badge-estado { padding: 0.2rem 0.65rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 600; }
.badge-activo { background: #dcfce7; color: #166534; }
.badge-inactivo { background: #F3F4F6; color: #6B7280; }

.td-actions { display: flex; gap: 0.35rem; }
.btn-action { width: 32px; height: 32px; border-radius: 0.45rem; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 0.85rem; transition: background 0.15s, transform 0.1s; text-decoration: none; }
.btn-action:hover { transform: scale(1.1); }
.btn-action--view { background: #eef3fb; color: #2b5494; }
.btn-action--edit { background: #fffde6; color: #b45309; }
.btn-action--del  { background: #fee2e2; color: #EF4444; }
.btn-action--view:hover { background: #2b5494; color: #fff; }
.btn-action--edit:hover { background: #b45309; color: #fff; }
.btn-action--del:hover  { background: #EF4444; color: #fff; }

.btn-primary { background: #2b5494; color: #fff; border: none; padding: 0.6rem 1.25rem; border-radius: 0.6rem; font-size: 0.875rem; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; gap: 0.35rem; transition: background 0.2s, transform 0.15s; }
.btn-primary:hover:not(:disabled) { background: #1e3c6e; transform: translateY(-1px); }
.btn-primary:disabled { opacity: 0.7; cursor: not-allowed; }
.btn-secondary { background: #F3F4F6; color: #374151; border: none; padding: 0.6rem 1.25rem; border-radius: 0.6rem; font-size: 0.875rem; font-weight: 600; cursor: pointer; }
.btn-secondary:hover { background: #E5E7EB; }
.btn-danger { background: #EF4444; color: #fff; border: none; padding: 0.6rem 1.25rem; border-radius: 0.6rem; font-size: 0.875rem; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; gap: 0.35rem; }
.btn-danger:hover:not(:disabled) { background: #b91c1c; }
.btn-danger:disabled { opacity: 0.7; cursor: not-allowed; }

.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.45); display: flex; align-items: center; justify-content: center; z-index: 2000; padding: 1rem; }
.modal-box { background: #fff; border-radius: 1rem; width: 100%; max-width: 480px; box-shadow: 0 24px 64px rgba(0,0,0,0.18); max-height: 90vh; overflow-y: auto; }
.modal-box--sm { max-width: 380px; padding: 2rem; text-align: center; }
.modal-header { display: flex; align-items: center; justify-content: space-between; padding: 1.25rem 1.5rem; border-bottom: 1px solid #F3F4F6; }
.modal-title { font-size: 1rem; font-weight: 700; color: #1F2937; margin: 0; }
.modal-close { background: none; border: none; cursor: pointer; color: #9CA3AF; font-size: 1.1rem; padding: 0.25rem; border-radius: 0.35rem; }
.modal-close:hover { background: #F3F4F6; }
.modal-body { padding: 1.5rem; }
.modal-footer { display: flex; gap: 0.75rem; justify-content: flex-end; padding: 1rem 1.5rem; border-top: 1px solid #F3F4F6; }

.form-label-edu { display: block; font-size: 0.8rem; font-weight: 600; color: #374151; margin-bottom: 0.4rem; }
.form-input-edu { width: 100%; padding: 0.6rem 0.85rem; border: 1.5px solid #E5E9F0; border-radius: 0.55rem; font-size: 0.875rem; outline: none; transition: border-color 0.2s; }
.form-input-edu:focus { border-color: #2b5494; box-shadow: 0 0 0 3px rgba(43,84,148,0.08); }

.preview-nombre {
  background: #eef3fb; border: 1.5px solid #c7d7f0;
  border-radius: 0.55rem; padding: 0.6rem 1rem;
  font-size: 0.875rem; color: #2b5494;
}

.confirm-icon { font-size: 2.5rem; color: #F59E0B; margin-bottom: 0.75rem; }
.confirm-title { font-size: 1.1rem; font-weight: 700; color: #1F2937; margin: 0 0 0.5rem; }
.confirm-text { font-size: 0.875rem; color: #6B7280; margin: 0 0 1.5rem; }
.modal-box--sm .modal-footer { justify-content: center; padding: 0; border: none; }
</style>
