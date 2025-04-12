/// <reference types="@solidjs/start/env" />

interface ImportMetaEnv {
  readonly VITE_DEFAULT_STORE?: string;
  readonly VITE_ENABLE_SOURCE_QUERY?: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
