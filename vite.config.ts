import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import path from 'path'; // Import the 'path' module

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // Alias for the src folder
      '~': path.resolve(__dirname, './'), // Alias for the root directory
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});