import { createRouter, createWebHashHistory } from 'vue-router';
import { generateRoutes } from './generator';

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'homepage',
      component: () => import('@/views/index.vue'),
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('@/views/components/HomeView.vue'),
        },
        ...generateRoutes({
          rootAsParent: true,
        }),
      ],
    },
  ],
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
});

export default router;
