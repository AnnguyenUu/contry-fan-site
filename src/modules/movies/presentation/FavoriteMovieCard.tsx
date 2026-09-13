import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { posterUrl } from "../configuration/constants";
import type { FavoriteMovie, Group } from "../domain/movie.types";
import { GroupSelect } from "./GroupSelect";

interface FavoriteMovieCardProps {
  favorite: FavoriteMovie;
  groups: Group[];
  onAssignGroup: (groupId: string | null) => void;
  onRemove: () => void;
}

export function FavoriteMovieCard({ favorite, groups, onAssignGroup, onRemove }: FavoriteMovieCardProps) {
  const poster = posterUrl(favorite.posterPath);

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="flex gap-3 rounded-xl bg-white p-3 shadow-sm ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700"
    >
      <Link to={`/movies/${favorite.movieId}`} className="h-24 w-16 shrink-0 overflow-hidden rounded-md bg-slate-100 dark:bg-slate-700">
        {poster ? (
          <img src={poster} alt="" loading="lazy" className="h-full w-full object-cover" />
        ) : null}
      </Link>
      <div className="flex flex-1 flex-col justify-between gap-2 py-0.5">
        <div>
          <Link to={`/movies/${favorite.movieId}`} className="text-sm font-semibold text-slate-900 hover:underline dark:text-white">
            {favorite.title}
          </Link>
          <p className="text-xs text-slate-500 dark:text-slate-400">{favorite.releaseYear}</p>
        </div>
        <div className="flex items-center justify-between gap-2">
          <GroupSelect movieTitle={favorite.title} groups={groups} value={favorite.groupId} onChange={onAssignGroup} />
          <button
            type="button"
            onClick={onRemove}
            aria-label={`Remove ${favorite.title} from favourites`}
            className="rounded-md px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 dark:text-red-400 dark:hover:bg-red-950/40"
          >
            Remove
          </button>
        </div>
      </div>
    </motion.li>
  );
}
