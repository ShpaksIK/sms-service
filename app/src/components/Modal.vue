<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  modelValue?: boolean
  title?: string
  closeOnOverlayClick?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'open'): void
  (e: 'close'): void
}>()

const isOpen = ref(props.modelValue || false)

watch(() => props.modelValue, (newVal) => {
  isOpen.value = newVal
})

watch(isOpen, (newVal) => {
  emit('update:modelValue', newVal)
  if (newVal) {
    emit('open')
    document.body.style.overflow = 'hidden'
  } else {
    emit('close')
    document.body.style.overflow = ''
  }
})

const close = () => {
  isOpen.value = false
}

const handleOverlayClick = () => {
  if (props.closeOnOverlayClick !== false) {
    close()
  }
}

defineExpose({ close, open: () => isOpen.value = true })
</script>

<template>
  <div v-if="isOpen" class="modal__overlay" @click="handleOverlayClick">
    <div class="modal__content" @click.stop>
      <div class="modal__header">
        <slot name="header">
          <h3>{{ title }}</h3>
        </slot>
        <button class="btn__close" @click="close">
            <img src="@/assets/svg/close.svg" alt="Закрыть">
        </button>
      </div>
      
      <div class="modal__body">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal__overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal__content {
  background: white;
  border-radius: 12px;
  min-width: 300px;
  max-width: 90vw;
  max-height: 90vh;
  overflow: auto;
}

.modal__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #e5e7eb;
  gap: 20px;
}

.modal__body {
  padding: 20px;
}

.btn__close {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0 8px;
}

.btn__close img {
    width: 20px;
    height: 20px;
}
</style>