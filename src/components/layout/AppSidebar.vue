<template>
  <aside class="sidebar" :class="{ open: open }">
    <!-- Marca -->
    <div class="sidebar-brand">
      <div class="sidebar-brand-icon">
        <i class="bi bi-kanban-fill" />
      </div>
      <span class="sidebar-brand-text">TaskFlow</span>
    </div>

    <!-- Navegación -->
    <nav class="sidebar-section">
      <div class="sidebar-label">Principal</div>

      <RouterLink to="/" class="sidebar-link" @click="$emit('close')">
        <i class="bi bi-grid-fill" />
        Dashboard
      </RouterLink>

      <RouterLink to="/proyectos" class="sidebar-link" @click="$emit('close')">
        <i class="bi bi-folder-fill" />
        Proyectos
      </RouterLink>

      <RouterLink to="/tareas" class="sidebar-link" @click="$emit('close')">
        <i class="bi bi-check2-square" />
        Tareas
      </RouterLink>
    </nav>

    <!-- Footer con usuario y logout -->
    <div class="sidebar-footer">
      <div class="sidebar-user">
        <div class="sidebar-avatar">
          {{ avatarLetter }}
        </div>
        <div class="sidebar-user-info">
          <div class="sidebar-user-email">{{ currentUser?.email }}</div>
        </div>
        <button class="btn-icon" title="Cerrar sesión" @click="handleLogout">
          <i class="bi bi-box-arrow-right" style="color: #ef4444" />
        </button>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useNotification } from '@/composables/useNotification'

defineProps<{ open: boolean }>()
defineEmits<{ (e: 'close'): void }>()

const { currentUser, clearAuth } = useAuth()
const { notify } = useNotification()
const router = useRouter()

const avatarLetter = computed(
  () => currentUser.value?.email?.charAt(0).toUpperCase() ?? '?'
)

function handleLogout() {
  clearAuth()
  notify('Sesión cerrada correctamente', 'info')
  router.push('/login')
}
</script>
