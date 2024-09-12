import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';

export default defineConfig({
  base: '/playground/',
  plugins: [vue(), vueJsx()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@import "@/assets/styles/util.scss";',
      },
    },
  },
  server: {
    open: true,
  },
  build: {
    // 大致在2022下半年
    target: ['es2022', 'edge104', 'chrome104', 'firefox104', 'safari16'],
  },
});
