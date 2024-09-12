import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router';
import { generateRoutes } from './generator';
import Homepage from '@/views/index.vue';

function createHistoryFunc(base: string) {
  return import.meta.env.DEV ? createWebHistory(base) : createWebHashHistory(base);
}

const router = createRouter({
  history: createHistoryFunc(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'homepage',
      component: Homepage,
    },
    ...generateRoutes(),
  ],
});

export default router;
