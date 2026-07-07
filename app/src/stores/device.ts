import type { AxiosError } from 'axios';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useAlertStore } from './alert';
import type { Device } from '@/components/DevicesTable.vue';
import { deviceAPI } from '@/api/device';
import type { UpdateDeviceDto } from '@/types/DeviceType';

export const useDeviceStore = defineStore('device', () => {
  const devices = ref<Device[]>([]);
  const currentDevice = ref<Device>({
    id: '',
    name: '',
    device_id: '',
    status: 'offline',
    battery_level: -1,
    app_version: '',
    last_sync_at: '',
    created_at: '',
    sim_cards: [],
  });
  const loading = ref(false);
  const error = ref<string | null>(null);
  const updateLoading = ref(false);
  const updateSuccess = ref(false);

  const alertStore = useAlertStore();

  const fetchDevices = async () => {
    loading.value = true;
    error.value = null;

    try {
      const response = await deviceAPI.getAll();
      devices.value = response.data.data;

      return response.data;
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      error.value = axiosError.response?.data?.message || 'Ошибка при загрузке устройств';
      alertStore.setAlert({
        content: axiosError.response?.data.message || 'Ошибка при загрузке устройств',
        type: 'error',
      });
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const fetchDeviceById = async (id: string) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await deviceAPI.getById(id);
      currentDevice.value = response.data.data;

      return response.data;
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      error.value = axiosError.response?.data?.message || 'Ошибка при загрузке устройства';
      alertStore.setAlert({
        content: axiosError.response?.data.message || 'Ошибка при загрузке устройства',
        type: 'error',
      });
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateDevice = async (id: string, data: UpdateDeviceDto) => {
    updateLoading.value = true;
    updateSuccess.value = false;
    error.value = null;

    try {
      const response = await deviceAPI.update(id, data);
      currentDevice.value = {
        ...currentDevice.value,
        ...data,
      };

      updateSuccess.value = true;

      return response.data;
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      error.value = axiosError.response?.data?.message || 'Ошибка обновления устройства';
      alertStore.setAlert({
        content: axiosError.response?.data.message || 'Ошибка обновления устройства',
        type: 'error',
      });
      throw err;
    } finally {
      updateLoading.value = false;
    }
  };

  const deleteDevice = async (id: string) => {
    updateLoading.value = true;
    updateSuccess.value = false;
    error.value = null;

    try {
      const response = await deviceAPI.delete(id);

      updateSuccess.value = true;

      return response.data;
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      error.value = axiosError.response?.data?.message || 'Ошибка обновления устройства';
      alertStore.setAlert({
        content: axiosError.response?.data.message || 'Ошибка обновления устройства',
        type: 'error',
      });
      throw err;
    } finally {
      updateLoading.value = false;
    }
  };

  return {
    devices,
    currentDevice,
    loading,
    error,
    updateLoading,
    updateSuccess,

    fetchDevices,
    fetchDeviceById,
    updateDevice,
    deleteDevice,
  };
});
