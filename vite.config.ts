import type { UserConfigExport } from 'vite'

import { default as adapter } from 'solid-start-static'
import { default as solid } from 'solid-start/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    solid({
      adapter: adapter(),
    }),
  ],
}) as UserConfigExport
