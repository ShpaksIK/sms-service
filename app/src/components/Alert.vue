<script setup lang="ts">
import { useAlertStore } from '@/stores/alert';
import { computed } from 'vue';

const alertStore = useAlertStore();

const alert = computed(() => alertStore.alert);
</script>

<template>
  <div class="alert_block" v-if="alert.type !== null">
    <div class="alert" :class="alert.type">
      <p>{{ alert.content }}</p>
    </div>
  </div>
</template>

<style scoped>
.alert_block {
  width: 100vw;
  display: flex;
  justify-content: center;
  position: fixed;
  bottom: 20px;
  z-index: 1000;
}

.alert {
  display: flex;
  align-items: center;
  gap: 10px;
  border-radius: 10px;
  padding: 20px;
}

.error {
  border: 1px solid var(--color-alert-error-border);
  background-color: var(--color-alert-error-background);
  color: var(--color-alert-error-text);
}

.info {
  border: 1px solid var(--color-alert-info-border);
  background-color: var(--color-alert-info-background);
  color: var(--color-alert-info-text);
}

.warning {
  border: 1px solid var(--color-alert-warning-border);
  background-color: var(--color-alert-warning-background);
  color: var(--color-alert-warning-text);
}

.success {
  border: 1px solid var(--color-alert-success-border);
  background-color: var(--color-alert-success-background);
  color: var(--color-alert-success-text);
}
</style>
