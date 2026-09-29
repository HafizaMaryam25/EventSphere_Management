import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    proxy: {
      '/auth': {
        target: 'https://eventsphere-backend-mocha.vercel.app',
        changeOrigin: true,
      },
      '/admin': {
        target: 'https://eventsphere-backend-mocha.vercel.app',
        changeOrigin: true,
      },
      '/api': {
        target: 'https://eventsphere-backend-mocha.vercel.app',
        changeOrigin: true,
      },
      '/attendee': {
        target: 'https://eventsphere-backend-mocha.vercel.app',
        changeOrigin: true,
      },
    },
  },
  preview: {
    host: '0.0.0.0',
    port: 4173,
  },
});
