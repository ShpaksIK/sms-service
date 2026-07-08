<script setup lang="ts">
import type { Device } from '@/components/DevicesTable.vue';
import Modal from '@/components/Modal.vue';
import { useDeviceStore } from '@/stores/device';
import { formatDate, formatTimestamp } from '@/utils/dateFormatter';
import { ref } from 'vue';

const props = defineProps<{
  device: Device;
  closeDeviceMoreModal: () => void;
}>();

const deviceStore = useDeviceStore();

const isOpenAgreeRemove = ref<boolean>(false);

const openAgreeRemove = () => {
  isOpenAgreeRemove.value = true;
};

const closeAgreeRemove = () => {
  isOpenAgreeRemove.value = false;
};

const removeDevice = async (id: string) => {
  closeAgreeRemove();
  await deviceStore.deleteDevice(id);
  await deviceStore.fetchDevices();
  props.closeDeviceMoreModal();
};
</script>

<template>
  <Modal
    @close="closeDeviceMoreModal"
    v-model="props.device"
    title="Подробнее"
    close-on-overlay-click
  >
    <Modal v-model="isOpenAgreeRemove" title="Подтверждение" @close="closeAgreeRemove">
      <p>Вы уверены, что хотите удалить устройство?</p>
      <div class="btns">
        <button class="btn_secondary" type="button" @click="closeAgreeRemove">Отменить</button>
        <button class="btn_danger" type="button" @click="removeDevice(props.device.id)">
          Удалить
        </button>
      </div>
    </Modal>
    <div class="modal">
      <div class="field">
        <b>Название</b>
        <p>{{ props.device.name }}</p>
      </div>
      <div class="field">
        <b>Статус</b>
        <p
          :class="[
            'sim-status',
            props.device.status === 'online' ? 'sim-status-active' : 'sim-status-no-active',
          ]"
        >
          {{ props.device.status === 'online' ? 'Онлайн' : 'Офлайн' }}
        </p>
      </div>
      <div class="field">
        <b>Заряд</b>
        <p :style="props.device.battery_level <= 15 ? { color: 'var(--color-danger)' } : ''">
          {{ props.device.battery_level }}
        </p>
      </div>
      <div class="field">
        <b>Версия приложения</b>
        <p>{{ props.device.app_version }}</p>
      </div>
      <div class="field">
        <b>Последняя синхронизация</b>
        <p>{{ formatDate(props.device.last_sync_at) }}</p>
      </div>
      <div class="field">
        <b>Создан</b>
        <p>{{ formatTimestamp(props.device.created_at) }}</p>
      </div>
      <div class="field" v-if="props.device.sim_cards.length > 0">
        <b>SIM карты</b>
        <div class="field-group" v-for="card in props.device.sim_cards" :key="card.id">
          <div>
            <b>Оператор</b>
            <p>{{ card.operator }}</p>
          </div>
          <div>
            <b>Номер</b>
            <p>{{ card.phone_number }}</p>
          </div>
          <div>
            <b>Номер слота</b>
            <p>{{ card.slot_index }}</p>
          </div>
          <div>
            <b>Статус</b>
            <p
              :class="['sim-status', card.is_active ? 'sim-status-active' : 'sim-status-no-active']"
            >
              {{ card.is_active ? 'Активна' : 'Не активна' }}
            </p>
          </div>
        </div>
      </div>
      <button class="btn_danger" type="button" @click="openAgreeRemove">Удалить</button>
    </div>
  </Modal>
</template>

<style scoped>
.modal {
  max-width: 400px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.btns {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.field {
  border-radius: var(--border-radius-small);
  padding: 5px;
}

.field-group {
  padding: 5px;
  border-radius: var(--border-radius-small);
  border: 1px solid var(--color-element);
  background-color: var(--color-block);
}

.field-group > div {
  display: flex;
  gap: 10px;
  align-items: center;
}

.sim-status {
  padding: 3px 5px;
  border-radius: 3px;
  font-size: var(--font-size-small);
}

.sim-status-active {
  background-color: var(--color-alert-success-background);
  color: var(--color-alert-success-text);
}

.sim-status-no-active {
  background-color: var(--color-alert-error-background);
  color: var(--color-alert-error-text);
}
</style>
