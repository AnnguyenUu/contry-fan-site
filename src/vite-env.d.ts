/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Relative path proxied to RestCountries in dev, and to api/countries/[...path].ts in production. Defaults to "/api/countries". */
  readonly VITE_API_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
