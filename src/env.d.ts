/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_URL?: string
  readonly VITE_DEFAULT_STORE?: string
  readonly VITE_ENABLE_SOURCE_QUERY?: boolean
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
