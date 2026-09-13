import { AnimatePresence } from "framer-motion";
import type { FavoriteMovie, Group } from "../domain/movie.types";
import { FavoriteMovieCard } from "./FavoriteMovieCard";

interface GroupSectionProps {
  title: string;
  group: Group | null;
  favorites: FavoriteMovie[];
  groups: Group[];
  onAssignGroup: (movieId: number, groupId: string | null) => void;
  onRemoveFavorite: (movieId: number) => void;
  onDeleteGroup?: (groupId: string) => void;
}

export function GroupSection({
  title,
  group,
  favorites,
  groups,
  onAssignGroup,
  onRemoveFavorite,
  onDeleteGroup,
}: GroupSectionProps) {
  return (
    <section aria-labelledby={`group-${group?.id ?? "ungrouped"}`} className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 id={`group-${group?.id ?? "ungrouped"}`} className="text-base font-semibold text-slate-900 dark:text-white">
          {title} <span className="font-normal text-slate-400">({favorites.length})</span>
        </h2>
        {group && onDeleteGroup ? (
          <button
            type="button"
            onClick={() => onDeleteGroup(group.id)}
            aria-label={`Delete group ${group.name}`}
            className="rounded-md px-2 py-1 text-xs font-medium text-slate-500 hover:bg-slate-100 hover:text-red-600 dark:text-slate-400 dark:hover:bg-slate-800"
          >
            Delete group
          </button>
        ) : null}
      </div>
      {favorites.length === 0 ? (
        <p className="text-sm text-slate-400">No movies in this group yet.</p>
      ) : (
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence initial={false}>
            {favorites.map((favorite) => (
              <FavoriteMovieCard
                key={favorite.movieId}
                favorite={favorite}
                groups={groups}
                onAssignGroup={(groupId) => onAssignGroup(favorite.movieId, groupId)}
                onRemove={() => onRemoveFavorite(favorite.movieId)}
              />
            ))}
          </AnimatePresence>
        </ul>
      )}
    </section>
  );
}
