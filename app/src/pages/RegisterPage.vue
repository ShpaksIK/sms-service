<script setup lang="ts">
import AuthLayout from '../layouts/AuthLayout.vue';
</script>

<template>
    <auth-layout class="reg__box">
        <h2>Добро пожаловать</h2>
        <p>Регистрация</p>

        <form class="form">
            <div class="form__control">
                <label for="email">Email</label>
                <input type="email" id="email" />
            </div>
            <div class="form__control">
                <label for="firstName">Ваше имя</label>
                <input type="text" id="firstName" />
            </div>
            <div class="form__control">
                <label for="password">Пароль</label>
                <input type="password" id="password" />
            </div>
            <div class="form__control">
                <label for="confirmPassword">Повтор пароля</label>
                <input type="password" id="confirmPassword" />
            </div>

            <button class="btn">Войти</button>
            <router-link
                :to="{name: 'Login'}"
                class="nav__link reg__link"
            >Войти в профиль</router-link>
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
