import { AnimatePresence } from "framer-motion";
import type { FavoriteCountry, Group } from "../domain/country.types";
import { FavoriteCountryCard } from "./FavoriteCountryCard";

interface GroupSectionProps {
  title: string;
  group: Group | null;
  favorites: FavoriteCountry[];
  groups: Group[];
  onAssignGroup: (countryCode: string, groupId: string | null) => void;
  onRemoveFavorite: (countryCode: string) => void;
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
        <p className="text-sm text-slate-400">No countries in this group yet.</p>
      ) : (
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence initial={false}>
            {favorites.map((favorite) => (
              <FavoriteCountryCard
                key={favorite.countryCode}
                favorite={favorite}
                groups={groups}
                onAssignGroup={(groupId) => onAssignGroup(favorite.countryCode, groupId)}
                onRemove={() => onRemoveFavorite(favorite.countryCode)}
              />
            ))}
          </AnimatePresence>
        </ul>
      )}
    </section>
  );
}
