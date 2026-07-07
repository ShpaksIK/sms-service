import type { UpdateDeviceDto } from '@/types/DeviceType';
import { instance } from '.';

export const deviceAPI = {
  getAll: () => instance.get('device'),
  getById: (id: string) => instance.get(`device/${id}`),
  update: (id: string, data: UpdateDeviceDto) => instance.put(`device/${id}/status`, data),
  delete: (id: string) => instance.delete(`device/${id}`),
};
