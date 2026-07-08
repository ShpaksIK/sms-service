<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { formatDate } from '@/utils/dateFormatter';
import { useSmsStore } from '@/stores/sms';
import type { Sms } from '@/types/SmsType';
import MessageMoreModal from '@/components/MessageMoreModal.vue';
import MessageAddModal from '@/components/MessageAddModal.vue';
import { formatPhoneNumber } from '@/utils/phoneNumberFormatter';

const smsStore = useSmsStore();

const sms = computed(() => smsStore.sms);
const loading = computed(() => smsStore.loading);
const openCurrentMessageMoreModal = ref<Sms | null>(null);
const isOpenMessageAddModal = ref<boolean>(false);

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

const getStatusClass = (status?: string) => {
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

const openMessageMoreModal = (message: Sms) => {
  openCurrentMessageMoreModal.value = message;
};
const closeMessageMoreModal = () => {
  openCurrentMessageMoreModal.value = null;
};

const openMessageAddModal = () => {
  isOpenMessageAddModal.value = true;
};
const closeMessageAddModal = () => {
  isOpenMessageAddModal.value = false;
};

const loadMessages = async () => {
  try {
    await smsStore.fetchSms();
  } catch {}
};

onMounted(() => {
  loadMessages();
});
</script>

<template>
  <div class="sms-container">
    <div class="sms-container">
      <MessageMoreModal
        :message="openCurrentMessageMoreModal"
        :close-message-more-modal="closeMessageMoreModal"
        v-if="openCurrentMessageMoreModal"
      ></MessageMoreModal>

      <MessageAddModal :close-message-add-modal="closeMessageAddModal" v-if="isOpenMessageAddModal">
      </MessageAddModal>

      <div class="sms-header">
        <button @click="loadMessages" class="refresh-btn" :disabled="loading">
          {{ loading ? 'Обновление...' : 'Обновить' }}
        </button>
        <button class="btn" @click="openMessageAddModal">+</button>
      </div>

      <div v-if="loading && sms.length === 0" class="loading-state">Загрузка сообщений...</div>

      <div v-else-if="sms.length === 0" class="empty-state">Нет сообщений</div>

      <div v-else class="table-wrapper">
        <table class="sms-table">
          <thead>
            <tr>
              <th>Тип</th>
              <th>Номер</th>
              <th>Сообщение</th>
              <th>Дата</th>
              <th>Статус</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="message in sms" :key="message.id">
              <td class="type-cell">
                <span :class="['type-badge', message.type]">
                  {{ message.type === 'incoming' ? 'Входящее' : 'Исходящее' }}
                </span>
              </td>
              <td class="phone-cell">
                {{ formatPhoneNumber(message.phone_number) }}
              </td>
              <td class="message-cell" :title="message.text">
                {{ message.text }}
              </td>
              <td class="date-cell">
                {{ formatDate(message.created_at) }}
              </td>
              <td class="status-cell">
                <span :class="['status-badge', getStatusClass(message.status)]">
                  {{ getStatusText(message.status) }}
                </span>
              </td>
              <td class="controllers">
                <button class="btn" @click="openMessageMoreModal(message)">Подробнее</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sms-container {
  max-width: var(--container-width);
  margin: 0 auto;
  background: var(--color-block);
  border-radius: var(--border-radius-large);
  overflow: hidden;
}

.sms-header {
  padding: 20px 24px;
  border-bottom: 1px solid var(--color-line);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--color-block);
}

.sms-header h2 {
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

.sms-table {
  width: 100%;
  border-collapse: collapse;
  font-family: var(--font-family-base);
  font-size: var(--font-size-text);
}

.sms-table thead {
  background: var(--color-background);
  border-bottom: 1px solid var(--color-line);
}

.sms-table th {
  padding: 16px 12px;
  text-align: left;
  font-weight: var(--font-weight-bold);
  color: var(--color-text-base);
  font-size: var(--font-size-small);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.sms-table td {
  padding: 16px 12px;
  border-bottom: 1px solid var(--color-line);
  vertical-align: middle;
  color: var(--color-text-base);
}

.sms-table tbody tr:hover {
  background: var(--color-element-transparent);
}

.type-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: var(--border-radius-small);
  font-size: var(--font-size-small);
  font-weight: var(--font-weight-base);
}

.type-badge.incoming {
  background: var(--color-alert-success-background);
  color: var(--color-alert-success-text);
}

.type-badge.outgoing {
  background: var(--color-alert-info-background);
  color: var(--color-alert-info-text);
}

.phone-cell {
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: var(--font-size-small);
  font-weight: var(--font-weight-base);
}

.message-cell {
  color: var(--color-text-base);
  max-width: 300px;
  word-wrap: break-word;
}

.date-cell {
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

.info-cell {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: var(--font-size-small);
}

.cost,
.source {
  display: inline-block;
  padding: 2px 6px;
  background: var(--color-element-transparent);
  border-radius: var(--border-radius-small);
  color: var(--color-element-hover);
}

.controllers {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

@media (max-width: 700px) {
  .sms-header {
    padding: 16px;
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }

  .sms-table th,
  .sms-table td {
    padding: 12px 8px;
  }

  .type-badge {
    padding: 2px 8px;
    font-size: 11px;
  }

  .phone-cell,
  .date-cell {
    font-size: 11px;
  }
}
</style>
