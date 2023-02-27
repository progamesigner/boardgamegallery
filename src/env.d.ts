/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DEFAULT_STORE: string

  readonly VITE_ENABLE_SOURCE_QUERY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
