import { solidStart } from '@solidjs/start/config';
import { default as tailwindcss } from '@tailwindcss/vite';
import { nitro } from 'nitro/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  define: {
    PAPA_BROWSER_CONTEXT: 'true',
  },
  plugins: [solidStart(), nitro(), tailwindcss()],
});
