<script setup lang="ts">
import { useUserStore } from '@/stores/user';
import { computed, watch, ref } from 'vue';

const userStore = useUserStore();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const formData = ref({
  firstName: userStore.firstName,
  email: userStore.email,
});

const isFormValid = computed(() => {
  return (
    formData.value.firstName.length >= 2 &&
    /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/.test(formData.value.email)
  );
});

const handleSubmit = async () => {
  if (!isFormValid.value) return;

  try {
    await userStore.updateUser({
      firstName: formData.value.firstName,
      email: formData.value.email,
    });
    emit('close');
  } catch (error) {
    console.error('Ошибка:', error);
  }
};

const handleCancel = () => {
  emit('close');
};

watch(
  () => ({
    firstName: userStore.firstName,
    email: userStore.email,
  }),
  (newValues) => {
    formData.value = { ...newValues };
  },
);
</script>

<template>
  <form class="form" @submit.prevent="handleSubmit">
    <div class="form__control">
      <label for="firstName">Имя</label>
      <input type="text" id="firstName" v-model="formData.firstName" />
    </div>
    <div class="form__control">
      <label for="email">Email</label>
      <input type="email" id="email" v-model="formData.email" />
    </div>
    <button class="btn" :disabled="!isFormValid">Применить</button>
    <button class="btn_secondary" type="button" @click="handleCancel">Отменить</button>
  </form>
</template>

<style scoped></style>
