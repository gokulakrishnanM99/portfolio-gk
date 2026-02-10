declare module '*.png' {
  const value: string;
  export default value;
}
declare module '*.jpg' {
  const value: string;
  export default value;
}
declare module '*.jpeg' {
  const value: string;
  export default value;
}
declare module '*.svg' {
  const value: string;
  export default value;
}
declare module '*.gif' {
  const value: string;
  export default value;
}
declare module '*.webp' {
  const value: string;
  export default value;
}
declare module '*.bmp' {
  const value: string;
  export default value;
}

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
