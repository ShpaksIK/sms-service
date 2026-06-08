<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { formatSmsDate } from '@/utils/dateFormatter';
import { smsAPI } from '@/api/sms';
import { useAlertStore } from '@/stores/alert';

const alertStore = useAlertStore();

interface Message {
  id: string;
  text: string;
  type: 'incoming' | 'outgoing';
  contact_number: string;
  created_at: string;
  status?: string;
  cost?: number;
  source?: string;
}

const messages = ref<Message[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

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

const loadMessages = async () => {
  loading.value = true;
  error.value = null;

  try {
    const response = await smsAPI.get();
    messages.value = response.data.data;
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Не удалось загрузить сообщения';
    alertStore.setAlert({
      content: error.value || 'Не удалось загрузить сообщения',
      type: 'error',
    });
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadMessages();
});
</script>

<template>
  <div class="sms-container">
    <div class="sms-container">
      <div class="sms-header">
        <h2>История сообщений</h2>
        <button @click="loadMessages" class="refresh-btn" :disabled="loading">
          {{ loading ? 'Обновление...' : 'Обновить' }}
        </button>
      </div>

      <div v-if="loading && messages.length === 0" class="loading-state">Загрузка сообщений...</div>

      <div v-else-if="messages.length === 0" class="empty-state">Нет сообщений</div>

      <div v-else class="table-wrapper">
        <table class="sms-table">
          <thead>
            <tr>
              <th>Тип</th>
              <th>Номер</th>
              <th>Сообщение</th>
              <th>Дата</th>
              <th>Статус</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="message in messages" :key="message.id">
              <td class="type-cell">
                <span :class="['type-badge', message.type]">
                  {{ message.type === 'incoming' ? 'Входящее' : 'Исходящее' }}
                </span>
              </td>
              <td class="phone-cell">
                {{ message.contact_number }}
              </td>
              <td class="message-cell" :title="message.text">
                {{ message.text }}
              </td>
              <td class="date-cell">
                {{ formatSmsDate(message.created_at) }}
              </td>
              <td class="status-cell">
                <span :class="['status-badge', getStatusClass(message.status)]">
                  {{ getStatusText(message.status) }}
                </span>
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
