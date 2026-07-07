<script setup lang="ts">
import { ref, computed } from 'vue';
import HomeLayout from '@/layouts/HomeLayout.vue';
import Modal from '@/components/Modal.vue';
import ChangeProfileForm from '@/components/ChangeProfileForm.vue';
import ChangePasswordForm from '@/components/ChangePasswordForm.vue';
import { useUserStore } from '@/stores/user';
import { useRouter } from 'vue-router';
import { formatTimestamp } from '@/utils/dateFormatter';

const isChangeProfileModalOpen = ref(false);
const isChangePasswordModalOpen = ref(false);
const isRemoveProfileModalOpen = ref(false);

const userStore = useUserStore();
const router = useRouter();

const firstName = computed(() => userStore.firstName);
const email = computed(() => userStore.email);
const createdAt = computed(() => userStore.createdAt);

const onLogout = async () => {
  try {
    await userStore.logout();
    router.push('/sign-in');
  } catch (error) {}
};

const removeProfile = async () => {
  try {
    await userStore.deleteProfile();
  } catch (error) {}
};
</script>

<template>
  <home-layout>
    <div class="profile__who">
      <p>Профиль пользователя</p>
      <b>{{ email }}</b>
    </div>

    <div class="profile__info">
      <div class="profile__info__main">
        <h3>{{ firstName }}</h3>
        <button class="btn_danger" @click="onLogout">Выйти</button>
      </div>

      <div class="profile__info__more">
        <p>{{ email }}</p>
        <p>Присоединился {{ formatTimestamp(createdAt) }}</p>
      </div>
    </div>

    <div class="profile__controls">
      <button class="btn-link" @click="isChangeProfileModalOpen = true">Редактировать</button>
      <button class="btn-link" @click="isChangePasswordModalOpen = true">Изменить пароль</button>
      <button class="btn-link_danger" @click="isRemoveProfileModalOpen = true">
        Удалить профиль
      </button>
    </div>

    <modal v-model="isChangeProfileModalOpen" title="Редактирование">
      <change-profile-form @close="isChangeProfileModalOpen = false"></change-profile-form>
    </modal>

    <modal v-model="isChangePasswordModalOpen" title="Редактирование">
      <change-password-form @close="isChangePasswordModalOpen = false"></change-password-form>
    </modal>

    <modal
      v-model="isRemoveProfileModalOpen"
      title="Подтверждение"
      @close="isRemoveProfileModalOpen = false"
      close-on-overlay-click
    >
      <p class="modal-text">
        Вы уверены, что хотите удалить профиль? После удаления профиль и данные нельзя будет
        восстановить.
      </p>

      <div class="btns">
        <button class="btn_secondary" type="button" @click="isRemoveProfileModalOpen = false">
          Отменить
        </button>
        <button class="btn_danger" type="button" @click="removeProfile(id)">Удалить</button>
      </div>
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

.btns {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.modal-text {
  max-width: 400px;
}
</style>
