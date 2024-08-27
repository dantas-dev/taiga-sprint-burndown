import { defineConfig } from 'vite';
import type { UserConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        app: './popup.html',
      }
    }
  },
  server: {
    open: './popup.html'
  }
}) satisfies UserConfig;
