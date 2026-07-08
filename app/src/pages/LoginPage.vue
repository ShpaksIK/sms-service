<script setup lang="ts">
import { computed, onMounted, reactive } from 'vue';
import AuthLayout from '../layouts/AuthLayout.vue';
import { useUserStore } from './../stores/user';
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const router = useRouter();

const authSuccess = computed(() => userStore.authSuccess);

const formData = reactive({
  email: '',
  password: '',
});

const handleSubmit = async () => {
  if (!isFormValid.value) {
    return;
  }

  try {
    await userStore.login({
      email: formData.email,
      password: formData.password,
    });
    if (authSuccess.value) {
      router.push('/');
    }
  } catch (error) {}
};

const isFormValid = computed(() => {
  return (
    /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/.test(formData.email) &&
    formData.password.length >= 5 &&
    formData.password.length <= 255
  );
});

const passwordError = computed(() => {
  if (formData.password === '') {
    return;
  }
  if (formData.password.length < 5) {
    return 'Минимальная длина пароля - 5 символов';
  } else if (formData.password.length > 255) {
    return 'Максимальная длина пароля - 255 символов';
  }
  return '';
});

const emailError = computed(() => {
  if (formData.email === '') {
    return;
  }
  if (formData.email.length > 255) {
    return 'Минимальная длина email - 255 символов';
  } else if (!/^[^\s@]+@([^\s@]+\.)+[^\s@]+$/.test(formData.email)) {
    return 'Некорректный формат email';
  }
  return '';
});

// Check user auth
const user = computed(() => userStore.user);

const fetchUser = async () => {
  await userStore.fetchUser();

  if (user.value) {
    router.push('/');
  }
};

onMounted(() => {
  const access_token = localStorage.getItem('accessToken');
  if (access_token) {
    fetchUser();
  }
});
</script>

<template>
  <auth-layout class="login__box">
    <h2>Добро пожаловать</h2>
    <p>Вход в профиль</p>

    <form class="form" @submit.prevent="handleSubmit">
      <div class="form__control">
        <label for="email">Email</label>
        <input type="email" id="email" v-model="formData.email" />
        <span v-if="emailError" class="form__error">
          {{ emailError }}
        </span>
      </div>
      <div class="form__control">
        <label for="password">Пароль</label>
        <input type="password" id="password" v-model="formData.password" />
        <span v-if="passwordError" class="form__error">
          {{ passwordError }}
        </span>
      </div>

      <button class="btn" :disabled="!isFormValid">Войти</button>
      <router-link :to="{ name: 'Registration' }" class="nav__link login__link"
        >Создать профиль</router-link
      >
    </form>
  </auth-layout>
</template>

<style scoped>
.login__box {
  text-align: center;
}

.login__box p {
  color: var(--color-text-transparent);
}

.login__link {
  align-self: center;
}
</style>
