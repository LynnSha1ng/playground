import { fileURLToPath, URL } from 'node:url';
import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_REPO_NAME');
  return {
    base: `/${env.VITE_REPO_NAME}/`,
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
    build: {
      // 大致在2023上半年
      target: ['es2022', 'edge114', 'chrome114', 'firefox113', 'safari16'],
    },
  };
});
