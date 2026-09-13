import { createRequest } from "@/shared/api/request-builder";
import { toMovieDetails, toMovieSummary } from "../domain/movie.mapper";
import { movieDetailsSchema, searchMoviesResponseSchema } from "../domain/movie.schema";
import type { MovieDetails, MovieSummary } from "../domain/movie.types";

export interface SearchMoviesResult {
  movies: MovieSummary[];
  page: number;
  totalPages: number;
}

function parseOrThrow<T>(schema: { parse: (input: unknown) => T }, raw: unknown, context: string): T {
  try {
    return schema.parse(raw);
  } catch {
    throw new Error(`TMDB returned an unexpected response shape for ${context}.`);
  }
}

export async function searchMovies(query: string, page = 1): Promise<SearchMoviesResult> {
  const raw = await createRequest("/search/movie")
    .withParams({ query, page, include_adult: false })
    .send();
  const parsed = parseOrThrow(searchMoviesResponseSchema, raw, "a movie search");

  return {
    movies: parsed.results.map(toMovieSummary),
    page: parsed.page,
    totalPages: parsed.total_pages,
  };
}

export async function getMovieDetails(movieId: number): Promise<MovieDetails> {
  const raw = await createRequest(`/movie/${movieId}`).send();
  const parsed = parseOrThrow(movieDetailsSchema, raw, "movie details");
  return toMovieDetails(parsed);
}
