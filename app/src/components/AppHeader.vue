<script setup lang="ts">
import { useUserStore } from '@/stores/user';
import { computed } from 'vue';

const userStore = useUserStore();

const firstName = computed(() => userStore.firstName);
const email = computed(() => userStore.email);
</script>

<template>
  <header class="header">
    <div class="header__user">
      <div class="header__user__info">
        <b>{{ firstName }}</b>
        <p>{{ email }}</p>
      </div>
    </div>
  </header>
</template>

<style scoped>
.header {
  padding: 10px 20px;
  border-radius: var(--border-radius-large);
  background-color: var(--color-block);
  display: flex;
  justify-content: flex-end;
}

.header__user {
  text-align: right;
  display: flex;
  align-items: center;
  gap: 10px;
}

.header__user__info b {
  font-size: var(--font-size-accent);
}

.header__user__button {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-items: center;
  outline: none;
  border-radius: var(--border-radius-small);
  border: 1px solid var(--color-element);
  background-color: var(--color-element-transparent);
  cursor: pointer;
}

.header__user__button img {
  width: 100%;
  height: 100%;
}
</style>
