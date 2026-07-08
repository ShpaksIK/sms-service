<script setup lang="ts">
import { onMounted } from 'vue';
import { useUserStore } from './stores/user';
import Alert from '@/components/Alert.vue';

const userStore = useUserStore();

onMounted(() => {
  const access_token = localStorage.getItem('accessToken');

  if (access_token) {
    userStore.fetchUser();
  }
});
</script>

<template>
  <div>
    <router-view />
    <alert></alert>
  </div>
</template>

<style scoped></style>
