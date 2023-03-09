/// <reference types="vite/client" />

declare const APP_BASE_URL: string | undefined

interface ImportMetaEnv {
  readonly VITE_DEFAULT_STORE?: string
  readonly VITE_ENABLE_SOURCE_QUERY?: boolean
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
