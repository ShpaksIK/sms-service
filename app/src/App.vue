<script setup lang="ts">
import { onMounted } from 'vue';
import { useUserStore } from './stores/user';
import Alert from '@/components/Alert.vue';

const userStore = useUserStore();

onMounted(() => {
  userStore.fetchUser();
});
</script>

<template>
  <div>
    <router-view />
    <alert></alert>
  </div>
</template>

<style scoped></style>
