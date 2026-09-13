import type { MovieDetailsRaw, MovieSummaryRaw } from "./movie.schema";
import type { MovieDetails, MovieSummary } from "./movie.types";

export function toMovieSummary(raw: MovieSummaryRaw): MovieSummary {
  return {
    id: raw.id,
    title: raw.title,
    overview: raw.overview,
    posterPath: raw.poster_path,
    releaseYear: raw.release_date ? raw.release_date.slice(0, 4) : "Unknown",
    voteAverage: raw.vote_average,
  };
}

export function toMovieDetails(raw: MovieDetailsRaw): MovieDetails {
  return {
    ...toMovieSummary(raw),
    runtimeMinutes: raw.runtime ?? null,
    tagline: raw.tagline || null,
    genres: raw.genres.map((genre) => genre.name),
    backdropPath: raw.backdrop_path ?? null,
  };
}
