import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://nova-ai-backend-sene.onrender.com',
        changeOrigin: true,
      },
    },
  },
});
