<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="modelValue"
        class="modal-overlay"
        @click.self="$emit('update:modelValue', false)"
      >
        <div class="modal-box" :style="{ maxWidth: width }">
          <div class="modal-header">
            <h5 class="modal-title">{{ title }}</h5>
            <button class="modal-close" @click="$emit('update:modelValue', false)">
              <i class="bi bi-x-lg" />
            </button>
          </div>

          <div class="modal-body">
            <slot />
          </div>

          <div v-if="$slots.footer" class="modal-footer">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    modelValue: boolean
    title: string
    width?: string
  }>(),
  { width: '520px' }
)

defineEmits<{
  (e: 'update:modelValue', val: boolean): void
}>()
</script>
