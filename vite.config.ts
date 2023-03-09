// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { default as adapter } from 'solid-start-netlify'
import { default as solid } from 'solid-start/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  define: {
    'process.env.URL': JSON.stringify(process.env.URL),
  },
  plugins: [
    solid({
      adapter: adapter({
        edge: true,
      }),
      ssr: true,
    }),
  ],
})
