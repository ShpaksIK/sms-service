<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { formatDate } from '@/utils/dateFormatter';
import DeviceMoreModal from '@/components/DeviceMoreModal.vue';
import DeviceChangeModal from '@/components/DeviceChangeModal.vue';
import { useDeviceStore } from '@/stores/device';

const deviceStore = useDeviceStore();

export interface SimCards {
  id: string;
  operator: string;
  phone_number: string;
  slot_index: number;
  is_active: boolean;
}

type DeviceStatus = 'online' | 'offline';

export interface Device {
  id: string;
  name: string;
  device_id: string;
  status: DeviceStatus;
  battery_level: number;
  app_version: string;
  last_sync_at: string;
  created_at: string;
  sim_cards: SimCards[];
}

const devices = computed(() => deviceStore.devices);
const loading = computed(() => deviceStore.loading);
const openCurrentDeviceMoreModal = ref<Device | null>(null);
const openCurrentDeviceChangeModal = ref<Device | null>(null);

const getStatusText = (status?: DeviceStatus) => {
  switch (status) {
    case 'online':
      return 'Онлайн';
    case 'offline':
      return 'Офлайн';
  }
};

const getStatusClass = (status?: DeviceStatus) => {
  switch (status) {
    case 'online':
      return 'status-online';
    case 'offline':
      return 'status-offline';
  }
};

const loadDevices = async () => {
  try {
    await deviceStore.fetchDevices();
  } catch (e) {}
};

const openDeviceMoreModal = (device: Device) => {
  openCurrentDeviceMoreModal.value = device;
};
const closeDeviceMoreModal = () => {
  openCurrentDeviceMoreModal.value = null;
};

const openDeviceChangeModal = (device: Device) => {
  openCurrentDeviceChangeModal.value = device;
};
const closeDeviceChangeModal = () => {
  openCurrentDeviceChangeModal.value = null;
};

onMounted(() => {
  loadDevices();
});
</script>

<template>
  <div class="device-container">
    <div class="device-container">
      <DeviceMoreModal
        :device="openCurrentDeviceMoreModal"
        :close-device-more-modal="closeDeviceMoreModal"
        v-if="openCurrentDeviceMoreModal"
      ></DeviceMoreModal>

      <DeviceChangeModal
        :device="openCurrentDeviceChangeModal"
        :close-device-change-modal="closeDeviceChangeModal"
        v-if="openCurrentDeviceChangeModal"
      ></DeviceChangeModal>

      <div class="device-header">
        <button @click="loadDevices" class="refresh-btn" :disabled="loading">
          {{ loading ? 'Обновление...' : 'Обновить' }}
        </button>
      </div>

      <div v-if="loading && devices.length === 0" class="loading-state">Загрузка...</div>

      <div v-else-if="devices.length === 0" class="empty-state">Нет устройств</div>

      <div v-else class="table-wrapper">
        <table class="device-table">
          <thead>
            <tr>
              <th>Название</th>
              <th>Статус</th>
              <th>Заряд</th>
              <th>Синхронизирован</th>
              <th>Кол-во SIM</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="device in devices" :key="device.id">
              <td>
                {{ device.name }}
              </td>
              <td>
                <span :class="['status-badge', getStatusClass(device.status)]">
                  {{ getStatusText(device.status) }}
                </span>
              </td>
              <td>
                <span :style="device.battery_level <= 15 ? { color: 'var(--color-danger)' } : ''">{{
                  device.battery_level
                }}</span>
              </td>
              <td class="date-sync">
                {{ formatDate(device.last_sync_at) }}
              </td>
              <td>
                {{ device.sim_cards.length }}
              </td>
              <td class="controllers">
                <button class="btn_secondary" @click="openDeviceChangeModal(device)">
                  Редактировать
                </button>
                <button class="btn" @click="openDeviceMoreModal(device)">Подробнее</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.device-container {
  max-width: var(--container-width);
  margin: 0 auto;
  background: var(--color-block);
  border-radius: var(--border-radius-large);
  overflow: hidden;
}

.device-header {
  padding: 20px 24px;
  border-bottom: 1px solid var(--color-line);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--color-block);
}

.device-header h2 {
  font-family: var(--font-family-accent);
  font-size: var(--font-size-title);
  font-weight: var(--font-weight-title);
  color: var(--color-text-title);
  margin: 0;
}

.refresh-btn {
  padding: 8px 16px;
  background: var(--color-element);
  color: var(--color-block);
  border: none;
  border-radius: var(--border-radius-small);
  font-family: var(--font-family-base);
  font-size: var(--font-size-small);
  font-weight: var(--font-weight-base);
  cursor: pointer;
  transition: background var(--transition-duration);
}

.refresh-btn:hover:not(:disabled) {
  background: var(--color-element-hover);
}

.refresh-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.loading-state,
.empty-state {
  text-align: center;
  padding: 60px 24px;
  color: var(--color-text-transparent);
  font-family: var(--font-family-base);
  font-size: var(--font-size-text);
}

.table-wrapper {
  overflow-x: auto;
}

.device-table {
  width: 100%;
  border-collapse: collapse;
  font-family: var(--font-family-base);
  font-size: var(--font-size-text);
}

.device-table thead {
  background: var(--color-background);
  border-bottom: 1px solid var(--color-line);
}

.device-table th {
  padding: 16px 12px;
  text-align: left;
  font-weight: var(--font-weight-bold);
  color: var(--color-text-base);
  font-size: var(--font-size-small);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.device-table td {
  padding: 16px 12px;
  border-bottom: 1px solid var(--color-line);
  vertical-align: middle;
  color: var(--color-text-base);
}

.device-table tbody tr:hover {
  background: var(--color-element-transparent);
}

.date-sync {
  color: var(--color-text-transparent);
  font-size: var(--font-size-small);
  white-space: nowrap;
}

.status-badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: var(--border-radius-small);
  font-size: var(--font-size-small);
  font-weight: var(--font-weight-base);
}

.status-online {
  background: var(--color-alert-success-background);
  color: var(--color-alert-success-text);
}

.status-offline {
  background: var(--color-element-secondary);
  color: var(--color-block);
}

.controllers {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

@media (max-width: 700px) {
  .device-header {
    padding: 16px;
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }

  .device-table th,
  .device-table td {
    padding: 12px 8px;
  }
}
</style>
