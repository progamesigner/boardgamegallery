// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { default as adapter } from 'solid-start-netlify'
import { default as solid } from 'solid-start/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  define: {
    APP_BASE_URL: JSON.stringify(process.env.URL),
    PAPA_BROWSER_CONTEXT: 'true',
  },
  plugins: [
    solid({
      adapter: adapter({
        edge: false,
      }),
      ssr: true,
    }),
  ],
  resolve: {
    alias: {
      papaparse: 'papaparse/papaparse.min',
      qrcode: 'qrcode/lib/browser',
    },
  },
})
