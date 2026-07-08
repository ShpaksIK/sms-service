<script setup lang="ts">
import { useSmsStore } from '@/stores/sms.ts';
import HomeLayout from '../layouts/HomeLayout.vue';
import { computed, onMounted } from 'vue';
import { formatTimestamp } from '@/utils/dateFormatter.ts';
import { useUserStore } from '@/stores/user.ts';

const smsStore = useSmsStore();
const userStore = useUserStore();
const smsStats = computed(() => smsStore.smsStats);

const fetchStats = async () => {
  await smsStore.fetchStats();
};

onMounted(() => {
  const access_token = localStorage.getItem('accessToken');

  if (access_token) {
    fetchStats();
  }
});
</script>

<template>
  <home-layout>
    <h2>Статистика</h2>
    <p v-if="!smsStats">Загрузка...</p>

    <div v-else class="general__stats">
      <div class="general__stats__stat">
        <b>{{ smsStats.total }}</b>
        <p class="general__stats__stat_yellow">Всего</p>
      </div>

      <div class="general__stats__stat">
        <b>{{ smsStats.incoming }}</b>
        <p class="general__stats__stat_blue">Входящие</p>
      </div>

      <div class="general__stats__stat">
        <b>{{ smsStats.outgoing }}</b>
        <p class="general__stats__stat_light_blue">Исходящие</p>
      </div>

      <div class="general__stats__stat">
        <b>{{ smsStats.delivered }}</b>
        <p class="general__stats__stat_green">Доставлено</p>
      </div>

      <div class="general__stats__stat">
        <b>{{ smsStats.failed }}</b>
        <p class="general__stats__stat_red">Не удалось</p>
      </div>

      <div class="general__stats__stat">
        <b>{{ smsStats.pending }}</b>
        <p class="general__stats__stat_gray">Ожидающие</p>
      </div>

      <div class="general__stats__stat" v-if="smsStats.last_message_at">
        <b>{{ formatTimestamp(smsStats.last_message_at) }}</b>
        <p class="general__stats__stat_dark_gray">Последнее сообщение</p>
      </div>
    </div>
  </home-layout>
</template>

<style scoped>
.general__stats {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.general__stats__stat {
  border-radius: var(--border-radius-large);
  background-color: var(--color-block);
  padding: 20px 10px;
  flex-grow: 1;
}

.general__stats__stat b {
  font-size: var(--font-size-accent);
  font-weight: normal;
}

.general__stats__stat p {
  font-weight: bold;
}

.general__stats__stat_blue {
  color: #1374ce;
}

.general__stats__stat_green {
  color: rgb(40 199 111);
}

.general__stats__stat_light_blue {
  color: rgb(6, 182, 212);
}

.general__stats__stat_red {
  color: rgb(255, 67, 67);
}

.general__stats__stat_yellow {
  color: rgb(255 159 67);
}

.general__stats__stat_gray {
  color: rgb(164, 164, 164);
}

.general__stats__stat_dark_gray {
  color: rgb(68, 68, 68);
}
</style>
