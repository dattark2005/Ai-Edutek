import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src', // No need for 'path.resolve' in browser environments
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});

