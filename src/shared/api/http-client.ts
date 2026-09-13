import axios from "axios";

// Relative, same-origin path — resolved by the Vite dev proxy locally and by
// api/movies/[...path].ts once deployed. The repository layer never talks to
// TMDB directly, so the API key never has to reach the browser.
export const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "/api/movies",
  timeout: 10_000,
});
