<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import HomeLayout from '@/layouts/HomeLayout.vue';
import Modal from '@/components/Modal.vue';
import ChangeProfileForm from '@/components/ChangeProfileForm.vue';
import ChangePasswordForm from '@/components/ChangePasswordForm.vue';
import { useUserStore } from '@/stores/user';

const isChangeProfileModalOpen = ref(false);
const isChangePasswordModalOpen = ref(false);

const userStore = useUserStore();

const firstName = computed(() => userStore.firstName);
const email = computed(() => userStore.email);
const createdAt = computed(() => userStore.createdAt);
const loading = computed(() => userStore.loading);
const error = computed(() => userStore.error);
const isProfileLoaded = computed(() => userStore.isUserLoaded);

onMounted(() => {
    userStore.fetchUser();
});
</script>

<template>
    <home-layout>
        <div class="profile__who">
            <p>Профиль пользователя</p>
            <b>{{ email }}</b>
        </div>

        <div class="profile__info">
            <div class="profile__info__main">
                <h3>{{ firstName  }}</h3>
                <button class="btn_danger">Выйти</button>
            </div>

            <div class="profile__info__more">
                <p>{{ email }}</p>
                <p>Присоединился {{ createdAt }}</p>
            </div>
        </div>

        <div class="profile__controls">
            <button class="btn-link" @click="isChangeProfileModalOpen = true">Редактировать</button>
            <button class="btn-link" @click="isChangePasswordModalOpen = true">Изменить пароль</button>
        </div>

        <modal v-model="isChangeProfileModalOpen" title="Редактирование">
            <change-profile-form @close="isChangeProfileModalOpen = false"></change-profile-form>
        </modal>

        <modal v-model="isChangePasswordModalOpen" title="Редактирование">
            <change-password-form @close="isChangePasswordModalOpen = false"></change-password-form>
        </modal>
    </home-layout>
</template>

<style scoped>
.profile__who p {
    font-weight: lighter;
    font-size: var(--font-size-accent);
    color: var(--color-text-transparent);
}

.profile__who b {
    font-size: 1.6rem;
    font-weight: normal;
}

.profile__info {
    margin-top: 20px;
    background-color: var(--color-block);
    border-radius: var(--border-radius-large);
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
    padding: 20px;
    align-items: center;
}

.profile__info__main button {
    width: 100%;
    max-width: 300px;
}

.profile__controls {
    margin-top: 20px;
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
}
</style>
