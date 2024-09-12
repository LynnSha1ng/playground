import { createRouter, createWebHashHistory } from 'vue-router';
import { generateRoutes } from './generator';
import Homepage from '@/views/index.vue';

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
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
