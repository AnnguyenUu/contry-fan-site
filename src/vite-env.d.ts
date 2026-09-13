/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Relative path proxied to TMDB in dev, and to api/movies/[...path].ts in production. Defaults to "/api/movies". */
  readonly VITE_API_BASE_URL?: string;
  /** TMDB's public image CDN base. No API key required — safe to expose to the client. Defaults to "https://image.tmdb.org/t/p". */
  readonly VITE_TMDB_IMAGE_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
