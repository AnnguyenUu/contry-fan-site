export interface MovieSummary {
  id: number;
  title: string;
  overview: string;
  posterPath: string | null;
  releaseYear: string;
  voteAverage: number;
}

export interface MovieDetails extends MovieSummary {
  runtimeMinutes: number | null;
  tagline: string | null;
  genres: string[];
  backdropPath: string | null;
}

export interface Group {
  id: string;
  name: string;
  createdAt: string;
}

export interface FavoriteMovie {
  movieId: number;
  title: string;
  posterPath: string | null;
  releaseYear: string;
  groupId: string | null;
  addedAt: string;
}
