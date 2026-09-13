import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import type { FavoriteCountry, Group } from "../domain/country.types";
import { GroupSelect } from "./GroupSelect";

interface FavoriteCountryCardProps {
  favorite: FavoriteCountry;
  groups: Group[];
  onAssignGroup: (groupId: string | null) => void;
  onRemove: () => void;
}

export function FavoriteCountryCard({ favorite, groups, onAssignGroup, onRemove }: FavoriteCountryCardProps) {
  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="flex gap-3 rounded-xl bg-white p-3 shadow-sm ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700"
    >
      <Link
        to={`/countries/${favorite.countryCode}`}
        className="flex h-16 w-24 shrink-0 items-center justify-center overflow-hidden rounded-md bg-slate-100 dark:bg-slate-700"
      >
        <img src={favorite.flagPngUrl} alt="" loading="lazy" className="h-full w-full object-cover" />
      </Link>
      <div className="flex flex-1 flex-col justify-between gap-2 py-0.5">
        <div>
          <Link
            to={`/countries/${favorite.countryCode}`}
            className="text-sm font-semibold text-slate-900 hover:underline dark:text-white"
          >
            <span aria-hidden="true">{favorite.flagEmoji} </span>
            {favorite.commonName}
          </Link>
          <p className="text-xs text-slate-500 dark:text-slate-400">{favorite.region}</p>
        </div>
        <div className="flex items-center justify-between gap-2">
          <GroupSelect
            countryName={favorite.commonName}
            groups={groups}
            value={favorite.groupId}
            onChange={onAssignGroup}
          />
          <button
            type="button"
            onClick={onRemove}
            aria-label={`Remove ${favorite.commonName} from favourites`}
            className="rounded-md px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 dark:text-red-400 dark:hover:bg-red-950/40"
          >
            Remove
          </button>
        </div>
      </div>
    </motion.li>
  );
}
