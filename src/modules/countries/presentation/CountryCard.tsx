import { motion } from "framer-motion";
import { memo } from "react";
import { Link } from "react-router-dom";
import type { CountrySummary } from "../domain/country.types";
import { FavoriteButton } from "./FavoriteButton";

interface CountryCardProps {
  country: CountrySummary;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export const CountryCard = memo(function CountryCard({ country, isFavorite, onToggleFavorite }: CountryCardProps) {
  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="group relative flex flex-col overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-200 transition hover:shadow-md dark:bg-slate-800 dark:ring-slate-700"
    >
      <div className="absolute right-2 top-2 z-10">
        <FavoriteButton isFavorite={isFavorite} name={country.commonName} onToggle={onToggleFavorite} />
      </div>
      <Link to={`/countries/${country.code}`} className="flex flex-1 flex-col focus:outline-none">
        <div className="flex aspect-[3/2] w-full items-center justify-center bg-slate-100 dark:bg-slate-700">
          <img
            src={country.flagPngUrl}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        </div>
        <div className="flex flex-1 flex-col gap-1 p-3">
          <h3 className="line-clamp-2 text-sm font-semibold text-slate-900 group-hover:underline dark:text-white">
            <span aria-hidden="true">{country.flagEmoji} </span>
            {country.commonName}
          </h3>
          <div className="mt-auto flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>{country.capital ?? "No capital"}</span>
            <span>{country.region}</span>
          </div>
        </div>
      </Link>
    </motion.li>
  );
});
