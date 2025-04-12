import { defineConfig } from '@solidjs/start/config';
import { default as tailwindcss } from '@tailwindcss/vite';

export default defineConfig({
  vite: {
    define: {
      PAPA_BROWSER_CONTEXT: 'true',
    },
    plugins: [tailwindcss()],
  },
});
