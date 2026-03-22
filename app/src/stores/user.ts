import { userAPI } from "@/api/user";
import type { AxiosError } from "axios";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

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
        createdAt: null
    });
    const loading = ref(false);
    const error = ref<string | null>(null);
    const updateLoading = ref(false);
    const updateSuccess = ref(false);

    const id = computed(() => user.value.id);
    const firstName = computed(() => user.value.firstName);
    const email = computed(() => user.value.email);
    const createdAt = computed(() => user.value.createdAt);
    const isUserLoaded = computed(() => !!user.value.id);
    
    const fetchUser = async () => {
        loading.value = true;
        error.value = null;

        try {
            const response = await userAPI.get();
            const { id, firstName, email, createdAt } = response.data;

            user.value = {
                id,
                firstName,
                email,
                createdAt
            };

            return response.data;
        } catch (err) {
            const axiosError = err as AxiosError<{ message: string; }>
            error.value = axiosError.response?.data?.message || 'Ошибка загрузки профиля';
            throw err;
        } finally {
            loading.value = false;
        }
    }

    const updateUser = async (data: { firstName?: string; email?: string }) => {
        updateLoading.value = true;
        updateSuccess.value = false;
        error.value = null;

        try {
            const response = await userAPI.update(data);
            user.value = {
                ...user.value,
                ...data
            };

            updateSuccess.value = true;

            return response.data;
        } catch (err) {
            const axiosError = err as AxiosError<{ message: string; }>
            error.value = axiosError.response?.data?.message || 'Ошибка обновления профиля';
            throw err;
        } finally {
            updateLoading.value = false;
        }
    }

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
    };
});
