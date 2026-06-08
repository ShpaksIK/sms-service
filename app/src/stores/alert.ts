import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

type AlertModeType = 'success' | 'info' | 'warning' | 'error' | null;

interface AlertData {
  content: string;
  status?: number;
  type: AlertModeType;
}

export const useAlertStore = defineStore('alert', () => {
  const alert = ref<AlertData>({
    content: '',
    type: null,
  });

  const content = computed(() => alert.value.content);
  const status = computed(() => alert.value.status);
  const type = computed(() => alert.value.type);

  const setAlert = async (data: AlertData) => {
    alert.value = {
      ...data,
    };

    setTimeout(() => {
      disableAlert();
    }, 5000);
  };

  const disableAlert = async () => {
    alert.value = {
      content: '',
      type: null,
    };
  };

  return {
    alert,
    content,
    status,
    type,

    setAlert,
    disableAlert,
  };
});
