<template>
  <AppModal :model-value="modelValue" title="Confirmar acción" width="400px" @update:model-value="$emit('update:modelValue', $event)">
    <p style="color: var(--text-secondary); font-size: 0.9rem; margin: 0">
      {{ message }}
    </p>
    <template #footer>
      <button class="btn btn-sm btn-outline-secondary" @click="$emit('update:modelValue', false)">
        Cancelar
      </button>
      <button class="btn btn-sm btn-danger" @click="confirm">
        <i class="bi bi-trash me-1" />
        Eliminar
      </button>
    </template>
  </AppModal>
</template>

<script setup lang="ts">
import AppModal from './AppModal.vue'

defineProps<{
  modelValue: boolean
  message: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', val: boolean): void
  (e: 'confirm'): void
}>()

function confirm() {
  emit('confirm')
  emit('update:modelValue', false)
}
</script>
