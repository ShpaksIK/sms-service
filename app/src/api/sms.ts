import { instance } from '.';

export const smsAPI = {
  get: () => instance.get('sms'),
};
