<script setup lang="ts">
import { useUserStore } from '@/stores/user';
import { reactive, computed } from 'vue';

const userStore = useUserStore();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const formData = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
});

const isFormValid = computed(() => {
  return (
    formData.currentPassword.length >= 5 &&
    formData.newPassword.length >= 5 &&
    formData.confirmPassword === formData.newPassword
  );
});

const passwordError = computed(() => {
  if (formData.confirmPassword === '') return '';
  if (formData.newPassword !== formData.confirmPassword) {
    return 'Пароли не совпадают';
  }
  return '';
});

const currentPasswordError = computed(() => {
  if (formData.currentPassword === '') return;
  if (formData.currentPassword.length < 5) {
    return 'Минимальная длина пароля - 5 символов';
  }
  return '';
});

const newPasswordError = computed(() => {
  if (formData.newPassword === '') return;
  if (formData.newPassword.length < 5) {
    return 'Минимальная длина пароля - 5 символов';
  }
  return '';
});

const handleSubmit = async () => {
  if (!isFormValid.value) return;

  try {
    await userStore.changePassword({
      currentPassword: formData.currentPassword,
      newPassword: formData.newPassword,
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
      <label for="currentPassword">Текущий пароль</label>
      <input type="password" id="currentPassword" v-model="formData.currentPassword" />
      <span v-if="currentPasswordError" class="form__error">
        {{ currentPasswordError }}
      </span>
    </div>
    <div class="form__control">
      <label for="newPassword">Новый пароль</label>
      <input type="password" id="newPassword" v-model="formData.newPassword" />
      <span v-if="newPasswordError" class="form__error">
        {{ newPasswordError }}
      </span>
    </div>
    <div class="form__control">
      <label for="confirmPassword">Повтор нового пароля</label>
      <input type="password" id="confirmPassword" v-model="formData.confirmPassword" />
      <span v-if="passwordError" class="form__error">
        {{ passwordError }}
      </span>
    </div>
    <button class="btn" type="submit" :disabled="!isFormValid">Применить</button>
    <button class="btn_secondary" type="button" @click="handleCancel">Отменить</button>
  </form>
</template>

<style scoped></style>
