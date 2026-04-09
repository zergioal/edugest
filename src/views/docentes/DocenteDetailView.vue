<template>
  <div>
    <!-- Back -->
    <RouterLink to="/docentes" class="back-link">
      <i class="bi bi-arrow-left me-1"></i> Volver a docentes
    </RouterLink>

    <!-- Spinner -->
    <div v-if="loading" class="spinner-wrap">
      <div class="spinner-border text-primary" role="status"></div>
    </div>

    <template v-else-if="docente">
      <!-- Header card -->
      <div class="detail-hero">
        <div class="detail-avatar">{{ docente.nombre[0] }}{{ docente.apellido[0] }}</div>
        <div class="detail-info">
          <h1 class="detail-name">{{ docente.nombre }} {{ docente.apellido }}</h1>
          <div class="detail-meta">
            <span class="badge-especialidad">
              <i class="bi bi-award me-1"></i>{{ docente.area }}
            </span>
            <span :class="['badge-estado', docente.estado === 'activo' ? 'badge-activo' : 'badge-inactivo']">
              {{ docente.estado }}
            </span>
          </div>
          <div class="detail-contact">
            <span><i class="bi bi-envelope me-1"></i>{{ docente.email }}</span>
            <span><i class="bi bi-telephone me-1"></i>{{ docente.telefono }}</span>
            <span><i class="bi bi-calendar3 me-1"></i>Registrado el {{ docente.createdAt }}</span>
          </div>
        </div>
      </div>

      <!-- Cursos del docente -->
      <div class="section-card">
        <div class="section-header">
          <h5 class="section-title">
            <i class="bi bi-journal-bookmark me-2"></i>
            Cursos asignados
            <span class="section-count">{{ cursos.length }}</span>
          </h5>
        </div>

        <div v-if="loadingCursos" class="spinner-wrap">
          <div class="spinner-border spinner-border-sm text-primary" role="status"></div>
        </div>

        <div v-else-if="cursos.length === 0" class="section-empty">
          <i class="bi bi-journal-x section-empty-icon"></i>
          <p>Este docente no tiene cursos asignados aún</p>
        </div>

        <div v-else class="cursos-grid">
          <RouterLink
            v-for="curso in cursos"
            :key="curso.id"
            :to="`/cursos/${curso.id}`"
            class="curso-card"
          >
            <div class="curso-card-header">
              <span class="curso-nivel">{{ curso.año }} Sec</span>
              <span :class="['badge-estado', curso.estado === 'activo' ? 'badge-activo' : 'badge-inactivo']">
                {{ curso.estado }}
              </span>
            </div>
            <div class="curso-nombre">{{ cursoLabel(curso) }}</div>
            <div class="curso-footer">
              <span><i class="bi bi-clock me-1"></i>{{ curso.turno }}</span>
              <span><i class="bi bi-people me-1"></i>Cupo: {{ curso.cupo }}</span>
            </div>
          </RouterLink>
        </div>
      </div>
    </template>

    <!-- Not found -->
    <div v-else class="not-found">
      <i class="bi bi-person-x not-found-icon"></i>
      <p>Docente no encontrado</p>
      <RouterLink to="/docentes" class="btn-primary">Volver</RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { docenteService } from '@/services/docenteService'
import { cursoService } from '@/services/cursoService'
import { cursoLabel } from '@/types'
import type { Docente, Curso } from '@/types'

const route = useRoute()
const docente = ref<Docente | null>(null)
const cursos = ref<Curso[]>([])
const loading = ref(true)
const loadingCursos = ref(true)

onMounted(async () => {
  const id = Number(route.params.id)
  try {
    docente.value = await docenteService.getById(id)
  } finally {
    loading.value = false
  }

  if (docente.value) {
    try {
      const ids = docente.value.cursoIds ?? []
      if (ids.length > 0) {
        const todos = await cursoService.getAll()
        cursos.value = todos.filter(c => ids.includes(c.id))
      }
    } finally {
      loadingCursos.value = false
    }
  }
})
</script>

<style scoped>
.back-link {
  display: inline-flex;
  align-items: center;
  color: #2B5494;
  font-size: 0.875rem;
  font-weight: 600;
  text-decoration: none;
  margin-bottom: 1.25rem;
  transition: color 0.15s;
}
.back-link:hover { color: #1e3c6e; text-decoration: underline; }

.spinner-wrap { display: flex; justify-content: center; padding: 3rem; }

/* ── Hero ─────────────────────────────────────────────────── */
.detail-hero {
  background: #fff;
  border-radius: 1rem;
  padding: 1.75rem;
  display: flex;
  align-items: flex-start;
  gap: 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
  margin-bottom: 1.25rem;
  flex-wrap: wrap;
}
.detail-avatar {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: #2B5494;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 800;
  flex-shrink: 0;
}
.detail-name {
  font-size: 1.4rem;
  font-weight: 800;
  color: #1F2937;
  margin: 0 0 0.5rem;
}
.detail-meta {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 0.75rem;
}
.detail-contact {
  display: flex;
  gap: 1.25rem;
  flex-wrap: wrap;
  font-size: 0.85rem;
  color: #6B7280;
}
.detail-contact span { display: flex; align-items: center; }

.badge-especialidad {
  background: #eef3fb;
  color: #2B5494;
  padding: 0.25rem 0.75rem;
  border-radius: 0.4rem;
  font-size: 0.8rem;
  font-weight: 600;
}
.badge-estado {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.8rem;
  font-weight: 600;
}
.badge-activo { background: #dcfce7; color: #166534; }
.badge-inactivo { background: #F3F4F6; color: #6B7280; }

/* ── Section ─────────────────────────────────────────────── */
.section-card {
  background: #fff;
  border-radius: 1rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
  overflow: hidden;
}
.section-header {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #F3F4F6;
}
.section-title {
  font-size: 0.95rem;
  font-weight: 700;
  color: #1F2937;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.35rem;
}
.section-count {
  background: #eef3fb;
  color: #2B5494;
  padding: 0.1rem 0.55rem;
  border-radius: 9999px;
  font-size: 0.78rem;
  font-weight: 700;
}
.section-empty {
  padding: 3rem;
  text-align: center;
  color: #9CA3AF;
  font-size: 0.875rem;
}
.section-empty-icon { font-size: 2.5rem; margin-bottom: 0.5rem; display: block; }

/* ── Cursos grid ─────────────────────────────────────────── */
.cursos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1rem;
  padding: 1.25rem;
}
.curso-card {
  border: 1.5px solid #E5E9F0;
  border-radius: 0.75rem;
  padding: 1rem;
  text-decoration: none;
  color: inherit;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  transition: border-color 0.2s, box-shadow 0.2s, transform 0.15s;
}
.curso-card:hover {
  border-color: #2B5494;
  box-shadow: 0 4px 16px rgba(43,84,148,0.12);
  transform: translateY(-2px);
}
.curso-card-header { display: flex; justify-content: space-between; align-items: center; }
.curso-nivel {
  background: #fffde6;
  color: #a16207;
  padding: 0.15rem 0.5rem;
  border-radius: 0.35rem;
  font-size: 0.72rem;
  font-weight: 600;
}
.curso-nombre { font-weight: 700; color: #1F2937; font-size: 0.95rem; }
.curso-desc {
  font-size: 0.78rem;
  color: #6B7280;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex: 1;
}
.curso-footer {
  display: flex;
  gap: 0.85rem;
  font-size: 0.78rem;
  color: #9CA3AF;
  border-top: 1px solid #F3F4F6;
  padding-top: 0.5rem;
  margin-top: auto;
}

/* ── Not found ───────────────────────────────────────────── */
.not-found {
  text-align: center;
  padding: 4rem 2rem;
  color: #9CA3AF;
}
.not-found-icon { font-size: 3rem; margin-bottom: 0.75rem; display: block; }

.btn-primary {
  background: #2B5494;
  color: #fff;
  border: none;
  padding: 0.6rem 1.5rem;
  border-radius: 0.6rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  margin-top: 0.5rem;
  transition: background 0.2s;
}
.btn-primary:hover { background: #1e3c6e; }
</style>
