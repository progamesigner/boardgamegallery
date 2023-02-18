import type { UserConfigExport } from 'vite'

import { default as solid } from 'solid-start/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    solid({
      ssr: false,
    }),
  ],
}) satisfies UserConfigExport
