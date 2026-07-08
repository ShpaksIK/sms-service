<script setup lang="ts">
import type { Device } from '@/components/DevicesTable.vue';
import Modal from '@/components/Modal.vue';
import { useDeviceStore } from '@/stores/device';
import type { UpdateDeviceDto } from '@/types/DeviceType';
import { formatDate, formatTimestamp } from '@/utils/dateFormatter';
import { computed, ref } from 'vue';

const deviceStore = useDeviceStore();

const props = defineProps<{
  device: Device;
  closeDeviceChangeModal: () => void;
}>();

const formData = ref<UpdateDeviceDto>({
  name: props.device.name,
});

const isFormValid = computed(() => {
  return formData.value.name.length >= 2 && formData.value.name.length <= 255;
});

const handleSubmit = async () => {
  if (!isFormValid.value) {
    return;
  }

  try {
    await deviceStore.updateDevice(props.device.id, formData.value);
    await deviceStore.fetchDevices();

    props.closeDeviceChangeModal();
  } catch (error) {
    console.error('Ошибка:', error);
  }
};
</script>

<template>
  <Modal @close="closeDeviceChangeModal" v-model="props.device" title="Редактирование">
    <form class="modal" @submit.prevent="handleSubmit">
      <div class="form__control">
        <label for="firstName">Название</label>
        <input type="text" id="firstName" v-model="formData.name" />
      </div>
      <button class="btn" :disabled="!isFormValid">Применить</button>
      <button class="btn_secondary" type="button" @click="closeDeviceChangeModal">Отменить</button>
    </form>
  </Modal>
</template>

<style scoped>
.modal {
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 10px;
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
  padding: 3px;
  border-radius: 3px;
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
