import type { SmsSend } from '@/types/SmsType';
import { instance } from '.';

export const smsAPI = {
  get: () => instance.get('sms'),
  getById: (id: string) => instance.get(`sms/${id}`),
  getStats: () => instance.get('sms/stats'),
  send: (data: SmsSend) => instance.post('sms/send', data),
};
