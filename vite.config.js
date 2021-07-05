import { defineConfig } from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';
import path from 'path';
import mdPlugin from 'vite-plugin-markdown'

export default defineConfig({
  plugins: [reactRefresh(), mdPlugin({ mode: 'html' })],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '/src'),
    },
  },
  server: {
    open: false,
    proxy: {
      '/api': {
        target: 'http://localhost:8888/.netlify/functions',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, ''),
      },
    },
  },
});