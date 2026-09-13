import axios from "axios";

// Relative, same-origin path — resolved by the Vite dev proxy locally and by
// api/countries/[...path].ts once deployed. The repository layer never talks
// to RestCountries directly, so the API key never has to reach the browser.
export const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "/api/countries",
  timeout: 10_000,
});
