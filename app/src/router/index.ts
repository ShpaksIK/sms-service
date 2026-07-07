import DevicePage from '@/pages/DevicePage.vue';
import GeneralPage from '@/pages/GeneralPage.vue';
import LoginPage from '@/pages/LoginPage.vue';
import MessagePage from '@/pages/MessagePage.vue';
import ProfilePage from '@/pages/ProfilePage.vue';
import RegisterPage from '@/pages/RegisterPage.vue';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/sign-in',
      name: 'Login',
      component: LoginPage,
    },
    {
      path: '/sign-up',
      name: 'Registration',
      component: RegisterPage,
    },
    {
      path: '/',
      name: 'General',
      component: GeneralPage,
    },
    {
      path: '/devices',
      name: 'Devices',
      component: DevicePage,
    },
    {
      path: '/sms',
      name: 'Messages',
      component: MessagePage,
    },
    {
      path: '/profile',
      name: 'Profile',
      component: ProfilePage,
    },
  ],
});

export default router;
