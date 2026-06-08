import { authAPI, type ChangePasswordType, type LoginType, type RegisterType } from '@/api/auth';
import { userAPI } from '@/api/user';
import type { AxiosError } from 'axios';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { useAlertStore } from './alert';

interface UserData {
  id: string;
  firstName: string;
  email: string;
  createdAt: Date | null;
}

export const useUserStore = defineStore('user', () => {
  const user = ref<UserData>({
    id: '',
    firstName: '',
    email: '',
    createdAt: null,
  });
  const loading = ref(false);
  const error = ref<string | null>(null);
  const updateLoading = ref(false);
  const updateSuccess = ref(false);
  const authLoading = ref(false);
  const authSuccess = ref(false);

  const id = computed(() => user.value.id);
  const firstName = computed(() => user.value.firstName);
  const email = computed(() => user.value.email);
  const createdAt = computed(() => user.value.createdAt);
  const isUserLoaded = computed(() => !!user.value.id);

  const alertStore = useAlertStore();

  const fetchUser = async () => {
    loading.value = true;
    error.value = null;

    try {
      const response = await userAPI.get();
      const { id, firstName, email, createdAt } = response.data.data;

      user.value = {
        id,
        firstName,
        email,
        createdAt,
      };

      return response.data;
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      error.value = axiosError.response?.data?.message || 'Ошибка загрузки профиля';
      alertStore.setAlert({
        content: axiosError.response?.data.message || 'Ошибка загрузки профиля',
        type: 'error'
      });
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateUser = async (data: { firstName?: string; email?: string }) => {
    updateLoading.value = true;
    updateSuccess.value = false;
    error.value = null;

    try {
      const response = await userAPI.update(data);
      user.value = {
        ...user.value,
        ...data,
      };

      updateSuccess.value = true;

      return response.data;
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      error.value = axiosError.response?.data?.message || 'Ошибка обновления профиля';
      alertStore.setAlert({
        content: axiosError.response?.data.message || 'Ошибка обновления профиля',
        type: 'error'
      });
      throw err;
    } finally {
      updateLoading.value = false;
    }
  };

  const changePassword = async (data: ChangePasswordType) => {
    updateLoading.value = true;
    updateSuccess.value = false;
    error.value = null;

    try {
      const response = await authAPI.changePassword(data);

      updateSuccess.value = true;

      return response.data;
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      error.value = axiosError.response?.data?.message || 'Ошибка обновления пароля';
      alertStore.setAlert({
        content: axiosError.response?.data.message || 'Ошибка обновления пароля',
        type: 'error'
      });
      throw err;
    } finally {
      updateLoading.value = false;
    }
  };

  const login = async (data: LoginType) => {
    error.value = null;
    authLoading.value = true;
    authSuccess.value = false;

    try {
      const response = await authAPI.login(data);

      authSuccess.value = true;

      localStorage.setItem('accessToken', response.data.access_token);

      return response.data;
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      error.value = axiosError.response?.data?.message || 'Ошибка входа';
      alertStore.setAlert({
        content: axiosError.response?.data.message || 'Ошибка входа',
        type: 'error'
      });
      throw err;
    } finally {
      authLoading.value = false;
    }
  };

  const registration = async (data: RegisterType) => {
    error.value = null;
    authLoading.value = true;
    authSuccess.value = false;

    try {
      const response = await authAPI.registration(data);

      authSuccess.value = true;

      return response.data;
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      error.value = axiosError.response?.data?.message || 'Ошибка регистрации';
      alertStore.setAlert({
        content: axiosError.response?.data.message || 'Ошибка регистрации',
        type: 'error'
      });
      throw err;
    } finally {
      authLoading.value = false;
    }
  };

  const logout = async () => {
    error.value = null;
    authLoading.value = true;
    authSuccess.value = false;

    try {
      const response = await authAPI.logout();

      authSuccess.value = true;

      localStorage.removeItem('accessToken');

      return response.data;
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      error.value = axiosError.response?.data?.message || 'Ошибка при выходе';
      alertStore.setAlert({
        content: axiosError.response?.data.message || 'Ошибка при выходе',
        type: 'error'
      });
      throw err;
    } finally {
      authLoading.value = false;
    }
  };

  return {
    user,
    loading,
    error,
    updateLoading,
    updateSuccess,
    isUserLoaded,

    id,
    firstName,
    email,
    createdAt,

    fetchUser,
    updateUser,
    changePassword,
    login,
    registration,
    logout,
  };
});
