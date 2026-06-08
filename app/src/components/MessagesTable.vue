<script setup lang="ts">
import { useAlertStore } from '@/stores/alert';
import { computed } from 'vue';

const alertStore = useAlertStore();

const alert = computed(() => alertStore.alert);
</script>

<template>
  <div class="table">
    
  </div>
</template>

<style scoped>
</style>
