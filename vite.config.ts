import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [react()],
    server: {
      port: Number(env.VITE_PORT) || 3000,
    },
    resolve: {
      // потрібен для коректної роботи з React Router (або іншим SPA роутером)
      alias: {
        '@': '/src',
      },
    },
    build: {
      rollupOptions: {
        input: '/index.html',
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '',
        },
      },
    },
  };
});
