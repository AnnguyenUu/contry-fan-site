const TMDB_IMAGE_BASE_URL = import.meta.env.VITE_TMDB_IMAGE_BASE_URL ?? "https://image.tmdb.org/t/p";
const POSTER_SIZE = "w342";
const BACKDROP_SIZE = "w780";

export function posterUrl(posterPath: string | null): string | null {
  return posterPath ? `${TMDB_IMAGE_BASE_URL}/${POSTER_SIZE}${posterPath}` : null;
}

export function backdropUrl(backdropPath: string | null): string | null {
  return backdropPath ? `${TMDB_IMAGE_BASE_URL}/${BACKDROP_SIZE}${backdropPath}` : null;
}
