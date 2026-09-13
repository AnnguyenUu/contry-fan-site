import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { posterUrl } from "../configuration/constants";
import type { MovieSummary } from "../domain/movie.types";
import { FavoriteButton } from "./FavoriteButton";

interface MovieCardProps {
  movie: MovieSummary;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export function MovieCard({ movie, isFavorite, onToggleFavorite }: MovieCardProps) {
  const poster = posterUrl(movie.posterPath);

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="group relative flex flex-col overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-200 transition hover:shadow-md dark:bg-slate-800 dark:ring-slate-700"
    >
      <div className="absolute right-2 top-2 z-10">
        <FavoriteButton isFavorite={isFavorite} title={movie.title} onToggle={onToggleFavorite} />
      </div>
      <Link to={`/movies/${movie.id}`} className="flex flex-1 flex-col focus:outline-none">
        <div className="aspect-[2/3] w-full bg-slate-100 dark:bg-slate-700">
          {poster ? (
            <img
              src={poster}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center px-4 text-center text-sm text-slate-400">
              No poster available
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-col gap-1 p-3">
          <h3 className="line-clamp-2 text-sm font-semibold text-slate-900 group-hover:underline dark:text-white">
            {movie.title}
          </h3>
          <div className="mt-auto flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>{movie.releaseYear}</span>
            <span aria-label={`Rated ${movie.voteAverage.toFixed(1)} out of 10`}>
              ★ {movie.voteAverage.toFixed(1)}
            </span>
          </div>
        </div>
      </Link>
    </motion.li>
  );
}
