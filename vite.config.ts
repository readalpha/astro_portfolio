import { defineConfig } from 'vite';

export default defineConfig({
  resolve: {
    alias: {
      '@public': '/public'
    }
  }
});
