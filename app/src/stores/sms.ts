import type { AxiosError } from 'axios';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useAlertStore } from './alert';
import type { Sms, SmsSend, SmsStats } from '@/types/SmsType';
import { smsAPI } from '@/api/sms';

export const useSmsStore = defineStore('sms', () => {
  const sms = ref<Sms[]>([]);
  const currentSms = ref<Sms | null>(null);
  const smsStats = ref<SmsStats | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const updateLoading = ref(false);
  const updateSuccess = ref(false);

  const alertStore = useAlertStore();

  const fetchSms = async () => {
    loading.value = true;
    error.value = null;

    try {
      const response = await smsAPI.get();
      sms.value = response.data.data;

      return response.data;
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      error.value = axiosError.response?.data?.message || 'Ошибка при загрузке SMS';
      alertStore.setAlert({
        content: axiosError.response?.data.message || 'Ошибка при загрузке SMS',
        type: 'error',
      });
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const fetchSmsById = async (id: string) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await smsAPI.getById(id);
      currentSms.value = response.data.data;

      return response.data;
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      error.value = axiosError.response?.data?.message || 'Ошибка при загрузке SMS';
      alertStore.setAlert({
        content: axiosError.response?.data.message || 'Ошибка при загрузке SMS',
        type: 'error',
      });
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const fetchStats = async () => {
    loading.value = true;
    error.value = null;

    try {
      const response = await smsAPI.getStats();
      smsStats.value = response.data.data;

      return response.data;
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      error.value = axiosError.response?.data?.message || 'Ошибка при загрузке статистики';
      alertStore.setAlert({
        content: axiosError.response?.data.message || 'Ошибка при загрузке статистики',
        type: 'error',
      });
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const sendSms = async (data: SmsSend) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await smsAPI.send(data);

      return response.data;
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      error.value = axiosError.response?.data?.message || 'Ошибка при отправке SMS';
      alertStore.setAlert({
        content: axiosError.response?.data.message || 'Ошибка при отправке SMS',
        type: 'error',
      });
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    sms,
    currentSms,
    smsStats,
    loading,
    error,
    updateLoading,
    updateSuccess,

    fetchSms,
    fetchSmsById,
    fetchStats,
    sendSms,
  };
});
