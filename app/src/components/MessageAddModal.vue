<script setup lang="ts">
import type { Device } from '@/components/DevicesTable.vue';
import Modal from '@/components/Modal.vue';
import { useDeviceStore } from '@/stores/device';
import { useSmsStore } from '@/stores/sms';
import type { UpdateDeviceDto } from '@/types/DeviceType';
import type { SmsSend } from '@/types/SmsType';
import { formatDate, formatTimestamp } from '@/utils/dateFormatter';
import { formatPhoneNumber, parsePhoneNumber } from '@/utils/phoneNumberFormatter';
import { computed, onMounted, ref } from 'vue';

const smsStore = useSmsStore();
const deviceStore = useDeviceStore();
const devices = computed(() => deviceStore.devices);

const props = defineProps<{
  closeMessageAddModal: () => void;
}>();

const formData = ref<SmsSend & { device?: Device | null }>({
  phoneNumber: '',
  text: '',
  deviceId: '',
  simSlot: -1,
  device: null,
});

const isFormValid = computed(() => {
  console.log(formData.value);
  return (
    formData.value.phoneNumber.length >= 11 &&
    formData.value.phoneNumber.length <= 32 &&
    formData.value.text.length >= 2 &&
    formData.value.text.length <= 2048 &&
    formData.value.simSlot > 0
  );
});

const handleSubmit = async () => {
  if (formData.value.device) {
    formData.value.deviceId = formData.value.device.id;
  }
  delete formData.value.device;

  formData.value.phoneNumber = parsePhoneNumber(formData.value.phoneNumber);

  if (!isFormValid.value) {
    return;
  }

  try {
    await smsStore.sendSms(formData.value);
    smsStore.fetchSms();

    props.closeMessageAddModal();
  } catch (error) {
    console.error('Ошибка:', error);
  }
};

onMounted(() => {
  deviceStore.fetchDevices();
});
</script>

<template>
  <Modal model-value @close="closeMessageAddModal" title="Отправка SMS">
    <form class="modal" @submit.prevent="handleSubmit">
      <div class="form__control">
        <label for="deviceId">Устройство</label>
        <select id="deviceId" v-model="formData.device">
          <option v-for="device in devices" :key="device.id" :value="device">
            {{ device.name }} ({{ device.battery_level }}%)
          </option>
        </select>
      </div>
      <div class="form__control">
        <label for="slotIndex">SIM-карта</label>
        <select id="slotIndex" :disabled="!formData.device" v-model="formData.simSlot">
          <option v-if="!formData.device" :value="-1">Выберите устройство</option>
          <option
            v-else
            v-for="simCard in formData.device.sim_cards.filter((card) => card.is_active)"
            :key="simCard.id"
            :value="simCard.slot_index"
          >
            {{ formatPhoneNumber(simCard.phone_number) }} ({{ simCard.operator }})
          </option>
        </select>
      </div>
      <div class="form__control">
        <label for="phoneNumber">Номер телефона</label>
        <input type="tel" id="phoneNumber" v-model="formData.phoneNumber" />
      </div>
      <div class="form__control">
        <label for="message">Сообщение</label>
        <textarea type="text" id="message" v-model="formData.text" />
      </div>
      <button class="btn" :disabled="!isFormValid">Применить</button>
      <button class="btn_secondary" type="button" @click="closeMessageAddModal">Отменить</button>
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

.text-operator {
  color: var(--color-text-link);
}
</style>
