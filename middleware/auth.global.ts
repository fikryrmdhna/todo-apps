import { useUserStore } from '~/stores/user';

export default defineNuxtRouteMiddleware((to, from) => {
  console.log('init Auth!')
  const userStore = useUserStore();

  if (!userStore.user) {
    userStore.initAuth();
    return;
  }

  if (to.path === '/' && userStore.user) {
    return navigateTo('/todo');
  }
  
  if (to.path === '/todo' && !userStore.user) {
    return navigateTo('/');
  }
});