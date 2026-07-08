<script setup lang="ts">
import Modal from '@/components/Modal.vue';
import type { Sms, SmsStatus, SmsType } from '@/types/SmsType';
import { formatDate, formatTimestamp } from '@/utils/dateFormatter';
import { formatPhoneNumber } from '@/utils/phoneNumberFormatter';

const props = defineProps<{
  message: Sms;
  closeMessageMoreModal: () => void;
}>();

const getStatusText = (status?: string) => {
  switch (status) {
    case 'pending':
      return 'Отправляется';
    case 'sent':
      return 'Отправлено';
    case 'delivered':
      return 'Доставлено';
    case 'failed':
      return 'Ошибка';
    case 'cancelled':
      return 'Отменено';
    default:
      return status === 'incoming' ? 'Получено' : 'Отправлено';
  }
};

const getStatusClass = (status?: SmsStatus) => {
  switch (status) {
    case 'delivered':
      return 'status-delivered';
    case 'sent':
      return 'status-sent';
    case 'pending':
      return 'status-pending';
    case 'failed':
      return 'status-failed';
    default:
      return 'status-default';
  }
};

const getTypeClass = (type?: SmsType) => {
  switch (type) {
    case 'incoming':
      return 'type-incoming';
    case 'outgoing':
      return 'type-outgoing';
  }
};
</script>

<template>
  <Modal
    @close="closeMessageMoreModal"
    v-model="props.message"
    title="Подробнее"
    close-on-overlay-click
  >
    <div class="modal">
      <div class="field">
        <b>Тип</b>
        <p :class="['message-status', getTypeClass(props.message.type)]">
          {{ props.message.type === 'incoming' ? 'Входящее' : 'Исходящее' }}
        </p>
      </div>
      <div class="field">
        <b>Статус</b>
        <p :class="['message-status', getStatusClass(props.message.status)]">
          {{ getStatusText(props.message.status) }}
        </p>
      </div>
      <div class="field">
        <b>Номер телефона</b>
        <p>{{ formatPhoneNumber(props.message.phone_number) }}</p>
      </div>
      <div class="field">
        <b>Сообщение</b>
        <p>{{ props.message.text }}</p>
      </div>
      <div v-if="props.message.error_message" class="field">
        <b>Ошибка</b>
        <p>{{ props.message.error_message }}</p>
      </div>
      <div v-if="props.message.scheduled_at" class="field">
        <b>Расписание</b>
        <p>{{ props.message.scheduled_at }}</p>
      </div>
      <div class="field">
        <b>Создано</b>
        <p>{{ formatTimestamp(props.message.created_at) }}</p>
      </div>
      <div class="field">
        <b>Устройство</b>
        <p>{{ props.message.device_name }}</p>
      </div>
      <div class="field">
        <b>Номер слота</b>
        <p>{{ props.message.sim_slot }}</p>
      </div>
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

.message-status {
  padding: 3px 5px;
  border-radius: 3px;
  font-size: var(--font-size-small);
}

.type-incoming {
  background: var(--color-alert-success-background);
  color: var(--color-alert-success-text);
}

.type-outgoing {
  background: var(--color-alert-info-background);
  color: var(--color-alert-info-text);
}

.status-badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: var(--border-radius-small);
  font-size: var(--font-size-small);
  font-weight: var(--font-weight-base);
}

.status-delivered {
  background: var(--color-alert-success-background);
  color: var(--color-alert-success-text);
}

.status-sent {
  background: var(--color-alert-info-background);
  color: var(--color-alert-info-text);
}

.status-pending {
  background: var(--color-alert-warning-background);
  color: var(--color-alert-warning-text);
}

.status-failed {
  background: var(--color-alert-error-background);
  color: var(--color-alert-error-text);
}

.status-default {
  background: var(--color-element-secondary);
  color: var(--color-block);
}
</style>
