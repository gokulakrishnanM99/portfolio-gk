/// <reference types="vite/client" />

interface ImportMetaGlobOptions {
  as?: string;
  eager?: boolean;
  import?: string;
  query?: string | Record<string, string | number | boolean>;
}

interface ImportMetaEnv {
  [key: string]: any;
  BASE_URL: string;
  MODE: string;
  DEV: boolean;
  PROD: boolean;
  SSR: boolean;
}

interface ImportMeta {
  url: string;
  readonly env: ImportMetaEnv;
  glob(pattern: string, options?: ImportMetaGlobOptions): Record<string, any>;
}
