<template>
  <div>
    <!-- Header -->
    <div class="page-header">
      <div>
        <h1 class="page-header-title">
          <i class="bi bi-grid-1x2-fill me-2 text-blue"></i>Panel de Control
        </h1>
        <p class="page-header-sub">Resumen general del sistema académico</p>
      </div>
    </div>

    <!-- Stats -->
    <div class="row g-3 mb-4">
      <div class="col-6 col-lg-3">
        <div class="stat-card stat-card--blue">
          <div class="stat-icon"><i class="bi bi-person-video3"></i></div>
          <div class="stat-body">
            <div class="stat-num">{{ loading ? '—' : stats.docentes }}</div>
            <div class="stat-label">Docentes</div>
          </div>
        </div>
      </div>
      <div class="col-6 col-lg-3">
        <div class="stat-card stat-card--yellow">
          <div class="stat-icon"><i class="bi bi-journal-bookmark-fill"></i></div>
          <div class="stat-body">
            <div class="stat-num">{{ loading ? '—' : stats.cursos }}</div>
            <div class="stat-label">Cursos</div>
          </div>
        </div>
      </div>
      <div class="col-6 col-lg-3">
        <div class="stat-card stat-card--green">
          <div class="stat-icon"><i class="bi bi-people-fill"></i></div>
          <div class="stat-body">
            <div class="stat-num">{{ loading ? '—' : stats.estudiantes }}</div>
            <div class="stat-label">Estudiantes</div>
          </div>
        </div>
      </div>
      <div class="col-6 col-lg-3">
        <div class="stat-card stat-card--purple">
          <div class="stat-icon"><i class="bi bi-check-circle-fill"></i></div>
          <div class="stat-body">
            <div class="stat-num">{{ loading ? '—' : stats.activos }}</div>
            <div class="stat-label">Cursos activos</div>
          </div>
        </div>
      </div>
    </div>

    <div class="row g-3">
      <!-- Cursos recientes -->
      <div class="col-lg-7">
        <div class="dash-card">
          <div class="dash-card-header">
            <h5 class="dash-card-title">
              <i class="bi bi-journal-bookmark me-2"></i>Cursos recientes
            </h5>
            <RouterLink to="/cursos" class="dash-card-link">Ver todos →</RouterLink>
          </div>
          <div v-if="loading" class="dash-loading">
            <div class="spinner-border spinner-border-sm text-primary" role="status"></div>
          </div>
          <div v-else class="dash-list">
            <div
              v-for="curso in cursosRecientes"
              :key="curso.id"
              class="dash-list-item"
            >
              <div class="dash-item-icon dash-item-icon--blue">
                <i class="bi bi-book"></i>
              </div>
              <div class="dash-item-body">
                <div class="dash-item-title">{{ cursoLabel(curso) }}</div>
                <div class="dash-item-meta">
                  <span class="badge-nivel">{{ curso.año }} Sec</span>
                  <span class="dash-item-dot">·</span>
                  <span>{{ curso.turno }}</span>
                </div>
              </div>
              <span :class="['badge-estado', curso.estado === 'activo' ? 'badge-activo' : 'badge-inactivo']">
                {{ curso.estado }}
              </span>
            </div>
            <div v-if="cursosRecientes.length === 0" class="dash-empty">
              No hay cursos registrados
            </div>
          </div>
        </div>
      </div>

      <!-- Docentes del sistema -->
      <div class="col-lg-5">
        <div class="dash-card">
          <div class="dash-card-header">
            <h5 class="dash-card-title">
              <i class="bi bi-person-video3 me-2"></i>Docentes
            </h5>
            <RouterLink to="/docentes" class="dash-card-link">Ver todos →</RouterLink>
          </div>
          <div v-if="loading" class="dash-loading">
            <div class="spinner-border spinner-border-sm text-primary" role="status"></div>
          </div>
          <div v-else class="dash-list">
            <div
              v-for="doc in docentesRecientes"
              :key="doc.id"
              class="dash-list-item"
            >
              <div class="dash-avatar">
                {{ doc.nombre[0] }}{{ doc.apellido[0] }}
              </div>
              <div class="dash-item-body">
                <div class="dash-item-title">{{ doc.nombre }} {{ doc.apellido }}</div>
                <div class="dash-item-meta">{{ doc.area }}</div>
              </div>
              <span :class="['badge-estado', doc.estado === 'activo' ? 'badge-activo' : 'badge-inactivo']">
                {{ doc.estado }}
              </span>
            </div>
            <div v-if="docentesRecientes.length === 0" class="dash-empty">
              No hay docentes registrados
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { docenteService } from '@/services/docenteService'
import { cursoService } from '@/services/cursoService'
import { estudianteService } from '@/services/estudianteService'
import { cursoLabel } from '@/types'
import type { Docente, Curso } from '@/types'

const loading = ref(true)
const docentes = ref<Docente[]>([])
const cursos = ref<Curso[]>([])
const totalEstudiantes = ref(0)

const stats = computed(() => ({
  docentes: docentes.value.length,
  cursos: cursos.value.length,
  estudiantes: totalEstudiantes.value,
  activos: cursos.value.filter(c => c.estado === 'activo').length
}))

const cursosRecientes = computed(() => cursos.value.slice(0, 5))
const docentesRecientes = computed(() => docentes.value.slice(0, 5))

onMounted(async () => {
  try {
    const [d, c, e] = await Promise.all([
      docenteService.getAll(),
      cursoService.getAll(),
      estudianteService.getAll()
    ])
    docentes.value = d
    cursos.value = c
    totalEstudiantes.value = e.length
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
/* ── Page Header ─────────────────────────────────────────── */
.page-header { margin-bottom: 1.75rem; }
.page-header-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1F2937;
  margin: 0 0 0.25rem;
}
.page-header-sub { color: #6B7280; margin: 0; font-size: 0.875rem; }
.text-blue { color: #2B5494; }

/* ── Stat Cards ──────────────────────────────────────────── */
.stat-card {
  background: #fff;
  border-radius: 1rem;
  padding: 1.25rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
  border-left: 4px solid transparent;
  transition: transform 0.2s, box-shadow 0.2s;
}
.stat-card:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,0,0,0.1); }
.stat-card--blue  { border-left-color: #2B5494; }
.stat-card--yellow { border-left-color: #d9cb00; }
.stat-card--green { border-left-color: #22C55E; }
.stat-card--purple { border-left-color: #8B5CF6; }

.stat-icon {
  font-size: 1.75rem;
  min-width: 2.5rem;
  text-align: center;
}
.stat-card--blue   .stat-icon { color: #2B5494; }
.stat-card--yellow .stat-icon { color: #d9cb00; }
.stat-card--green  .stat-icon { color: #22C55E; }
.stat-card--purple .stat-icon { color: #8B5CF6; }

.stat-num {
  font-size: 1.75rem;
  font-weight: 800;
  color: #1F2937;
  line-height: 1;
}
.stat-label {
  font-size: 0.8rem;
  color: #6B7280;
  font-weight: 500;
  margin-top: 0.2rem;
}

/* ── Dash Cards ──────────────────────────────────────────── */
.dash-card {
  background: #fff;
  border-radius: 1rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
  overflow: hidden;
}
.dash-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid #F3F4F6;
}
.dash-card-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: #1F2937;
  margin: 0;
}
.dash-card-link {
  font-size: 0.8rem;
  color: #2B5494;
  font-weight: 600;
  text-decoration: none;
}
.dash-card-link:hover { text-decoration: underline; }

.dash-loading {
  display: flex;
  justify-content: center;
  padding: 2rem;
}
.dash-list { padding: 0.5rem 0; }
.dash-list-item {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 0.75rem 1.25rem;
  transition: background 0.15s;
}
.dash-list-item:hover { background: #F9FAFB; }

.dash-item-icon {
  width: 36px;
  height: 36px;
  border-radius: 0.6rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.95rem;
  flex-shrink: 0;
}
.dash-item-icon--blue { background: #eef3fb; color: #2B5494; }

.dash-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #2B5494;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
  flex-shrink: 0;
}

.dash-item-body { flex: 1; min-width: 0; }
.dash-item-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1F2937;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.dash-item-meta {
  font-size: 0.78rem;
  color: #6B7280;
  display: flex;
  align-items: center;
  gap: 0.35rem;
  margin-top: 0.1rem;
}
.dash-item-dot { color: #D1D5DB; }
.dash-empty { padding: 1.5rem; text-align: center; color: #9CA3AF; font-size: 0.85rem; }

/* ── Badges ──────────────────────────────────────────────── */
.badge-nivel {
  background: #eef3fb;
  color: #2B5494;
  padding: 0.1rem 0.45rem;
  border-radius: 0.35rem;
  font-size: 0.72rem;
  font-weight: 600;
}
.badge-estado {
  padding: 0.2rem 0.6rem;
  border-radius: 9999px;
  font-size: 0.72rem;
  font-weight: 600;
  flex-shrink: 0;
}
.badge-activo { background: #dcfce7; color: #166534; }
.badge-inactivo { background: #F3F4F6; color: #6B7280; }
</style>
