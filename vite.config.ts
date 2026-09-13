/// <reference types="vitest/config" />
import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

const rootDir = import.meta.dirname;

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(rootDir, "src"),
      },
    },
    server: {
      proxy: {
        // Mirrors api/countries/[...path].ts (the production Vercel function)
        // exactly, so the repository layer never knows whether it's talking to
        // this dev proxy or the deployed serverless function.
        "/api/countries": {
          target: "https://api.restcountries.com",
          changeOrigin: true,
          rewrite: (requestPath) => requestPath.replace(/^\/api\/countries/, "/countries/v5"),
          headers: env.API_KEY ? { Authorization: `Bearer ${env.API_KEY}` } : undefined,
        },
      },
    },
    test: {
      environment: "jsdom",
      globals: false,
      setupFiles: ["./src/test/setup.ts"],
    },
  };
});
