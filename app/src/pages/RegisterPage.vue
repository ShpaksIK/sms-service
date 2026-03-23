<script setup lang="ts">
import { computed, reactive } from 'vue';
import AuthLayout from '../layouts/AuthLayout.vue';
import { useUserStore } from './../stores/user';
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const router = useRouter();

const formData = reactive({
  firstName: '',
  email: '',
  password: '',
  confirmPassword: '',
});

const handleSubmit = async () => {
  if (!isFormValid.value) return;

  try {
    await userStore.registration({
      email: formData.email,
      firstName: formData.firstName,
      password: formData.password,
    });
    router.push('/sign-in');
  } catch (error) {}
};

const isFormValid = computed(() => {
  return (
    formData.firstName.length >= 1 &&
    /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/.test(formData.email) &&
    formData.password.length >= 5 &&
    formData.confirmPassword === formData.password
  );
});

const comparePasswordsError = computed(() => {
  if (formData.confirmPassword === '') return '';
  if (formData.confirmPassword !== formData.confirmPassword) {
    return 'Пароли не совпадают';
  }
  return '';
});

const passwordError = computed(() => {
  if (formData.password === '') return;
  if (formData.password.length < 5) {
    return 'Минимальная длина пароля - 5 символов';
  } else if (formData.password.length > 255) {
    return 'Максимальная длина пароля - 255 символов';
  }
  return '';
});

const emailError = computed(() => {
  if (formData.email === '') return;
  if (formData.email.length > 255) {
    return 'Максимальная длина email - 255 символов';
  } else if (!/^[^\s@]+@([^\s@]+\.)+[^\s@]+$/.test(formData.email)) {
    return 'Некорректный формат email';
  }
  return '';
});

const firstNameError = computed(() => {
  if (formData.firstName === '') return;
  if (formData.firstName.length > 255) {
    return 'Минимальная длина имени - 255 символов';
  } else if (!/^[^\s@]+@([^\s@]+\.)+[^\s@]+$/.test(formData.email)) {
    return 'Некорректный формат email';
  }
  return '';
});
</script>

<template>
  <auth-layout class="reg__box">
    <h2>Добро пожаловать</h2>
    <p>Регистрация</p>

    <form class="form" @submit.prevent="handleSubmit">
      <div class="form__control">
        <label for="email">Email</label>
        <input type="email" id="email" v-model="formData.email" />
        <span v-if="emailError" class="form__error">
          {{ emailError }}
        </span>
      </div>
      <div class="form__control">
        <label for="firstName">Ваше имя</label>
        <input type="text" id="firstName" v-model="formData.firstName" />
        <span v-if="firstNameError" class="form__error">
          {{ firstNameError }}
        </span>
      </div>
      <div class="form__control">
        <label for="password">Пароль</label>
        <input type="password" id="password" v-model="formData.password" />
        <span v-if="passwordError" class="form__error">
          {{ passwordError }}
        </span>
      </div>
      <div class="form__control">
        <label for="confirmPassword">Повтор пароля</label>
        <input type="password" id="confirmPassword" v-model="formData.confirmPassword" />
        <span v-if="comparePasswordsError" class="form__error">
          {{ comparePasswordsError }}
        </span>
      </div>

      <button class="btn" :disabled="!isFormValid">Зарегистрироваться</button>
      <router-link :to="{ name: 'Login' }" class="nav__link reg__link">Войти в профиль</router-link>
    </form>
  </auth-layout>
</template>

<style scoped>
.reg__box {
  text-align: center;
}

.reg__box p {
  color: var(--color-text-transparent);
}

.reg__link {
  align-self: center;
}
</style>
