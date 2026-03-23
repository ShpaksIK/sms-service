<script setup lang="ts">
import { useRoute } from 'vue-router';

const route = useRoute();

const isActive = (path: string) => {
  return route.path === path;
};
</script>

<template>
  <nav class="nav">
    <router-link :to="{ name: 'General' }" class="nav__title">
      <h1>SMS Сервис</h1>
    </router-link>

    <router-link
      :to="{ name: 'General' }"
      class="nav__link"
      :class="{ nav__link_active: isActive('/') }"
      >Главная</router-link
    >

    <router-link
      :to="{ name: 'Messages' }"
      class="nav__link"
      :class="{ nav__link_active: isActive('/sms') }"
      >SMS Сообщения</router-link
    >

    <router-link
      :to="{ name: 'Profile' }"
      class="nav__link"
      :class="{ nav__link_active: isActive('/profile') }"
      >Профиль</router-link
    >
  </nav>
</template>

<style scoped>
.nav {
  height: 100vh;
  min-width: 250px;
  background-color: var(--color-block);
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.nav h1 {
  font-size: var(--font-size-title);
}

.nav__title {
  padding: 10px;
  background-color: var(--color-element-transparent);
  border-radius: var(--border-radius-small);
}

.nav__link {
  width: 100%;
  padding: 8px 15px;
  background-color: transparent;
  border-radius: var(--border-radius-small);
}

.nav__link_active {
  background-color: var(--color-element);
  color: var(--color-block);
}
</style>
