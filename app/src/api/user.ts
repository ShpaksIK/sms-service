import { instance } from '.';

export const userAPI = {
  get: () => instance.get('users'),
  update: (data: { firstName?: string; email?: string }) => instance.patch(`users`, data),
  delete: () => instance.delete('users'),
};
