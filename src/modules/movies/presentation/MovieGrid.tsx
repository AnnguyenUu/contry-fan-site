import { AnimatePresence } from "framer-motion";
import type { MovieSummary } from "../domain/movie.types";
import { MovieCard } from "./MovieCard";

interface MovieGridProps {
  movies: MovieSummary[];
  isFavorite: (movieId: number) => boolean;
  onToggleFavorite: (movie: MovieSummary) => void;
}

export function MovieGrid({ movies, isFavorite, onToggleFavorite }: MovieGridProps) {
  return (
    <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      <AnimatePresence initial={false}>
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            isFavorite={isFavorite(movie.id)}
            onToggleFavorite={() => onToggleFavorite(movie)}
          />
        ))}
      </AnimatePresence>
    </ul>
  );
}
