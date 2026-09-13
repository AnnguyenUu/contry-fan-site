import type { IncomingMessage, ServerResponse } from "node:http";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const PROXY_PREFIX = "/api/movies";

/**
 * Mirrors vite.config.ts's dev-server proxy exactly (same prefix stripped,
 * same upstream, same Bearer-header injection) so the repository layer's
 * requests to "/api/movies/*" behave identically in dev and once deployed —
 * the one architectural gap the reference project (Dog Finder) had called
 * out as unresolved.
 */
export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (req.method !== "GET") {
    res.statusCode = 405;
    res.end(JSON.stringify({ error: "Method not allowed" }));
    return;
  }

  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "API_KEY is not configured on the server." }));
    return;
  }

  const rawUrl = req.url ?? "";
  const upstreamPath = rawUrl.startsWith(PROXY_PREFIX) ? rawUrl.slice(PROXY_PREFIX.length) : rawUrl;

  const upstreamResponse = await fetch(`${TMDB_BASE_URL}${upstreamPath}`, {
    headers: { Authorization: `Bearer ${apiKey}`, Accept: "application/json" },
  });

  const body = await upstreamResponse.text();
  res.statusCode = upstreamResponse.status;
  res.setHeader("Content-Type", upstreamResponse.headers.get("content-type") ?? "application/json");
  res.end(body);
}
