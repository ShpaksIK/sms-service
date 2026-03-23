<script setup lang="ts">
import { useUserStore } from '@/stores/user';
import { reactive, computed } from 'vue';

const userStore = useUserStore();

const firstName = computed(() => userStore.firstName);
const email = computed(() => userStore.email);

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const formData = reactive({
  firstName,
  email,
});

const isFormValid = computed(() => {
  return formData.firstName.length >= 2 && /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/.test(formData.email);
});

const handleSubmit = async () => {
  if (!isFormValid.value) return;
  console.log(formData);
  try {
    await userStore.updateUser({
      firstName: formData.firstName,
      email: formData.email,
    });
    emit('close');
  } catch (error) {
    console.error('Ошибка:', error);
  }
};

const handleCancel = () => {
  emit('close');
};
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
