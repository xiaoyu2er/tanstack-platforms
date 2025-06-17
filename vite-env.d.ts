/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ROOT_DOMAIN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
