<template>
  <div class="app-wrapper">
    <template v-if="isAuthenticated">
      <AppNavbar />
      <div class="main-content">
        <div class="page-content">
          <RouterView />
        </div>
      </div>
    </template>

    <template v-else>
      <RouterView />
    </template>

    <!-- Notificaciones toast -->
    <div class="notification-container">
      <TransitionGroup name="notif">
        <div
          v-for="n in notifications"
          :key="n.id"
          :class="['notification', `notification--${n.type}`]"
          @click="remove(n.id)"
        >
          <i :class="iconFor(n.type)" />
          <span>{{ n.message }}</span>
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useNotification } from '@/composables/useNotification'
import AppNavbar from '@/components/layout/AppNavbar.vue'

const { isAuthenticated } = useAuth()
const { notifications, remove } = useNotification()

function iconFor(type: string) {
  const map: Record<string, string> = {
    success: 'bi bi-check-circle-fill',
    danger: 'bi bi-x-circle-fill',
    warning: 'bi bi-exclamation-triangle-fill',
    info: 'bi bi-info-circle-fill'
  }
  return map[type] ?? 'bi bi-info-circle-fill'
}
</script>

<style>
.notif-enter-active,
.notif-leave-active {
  transition: all 0.3s ease;
}
.notif-enter-from,
.notif-leave-to {
  opacity: 0;
  transform: translateX(110%);
}
</style>
