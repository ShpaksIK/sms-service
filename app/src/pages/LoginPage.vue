<script setup lang="ts">
import AuthLayout from '../layouts/AuthLayout.vue';
</script>

<template>
    <auth-layout class="login__box">
        <h2>Добро пожаловать</h2>
        <p>Вход в профиль</p>

        <form class="form">
            <div class="form__control">
                <label for="email">Email</label>
                <input type="email" id="email" />
            </div>
            <div class="form__control">
                <label for="password">Пароль</label>
                <input type="password" id="password" />
            </div>

            <button class="btn">Войти</button>
            <router-link
                :to="{name: 'Registration'}"
                class="nav__link login__link"
            >Создать профиль</router-link>
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
