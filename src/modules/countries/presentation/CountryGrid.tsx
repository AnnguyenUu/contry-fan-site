import { AnimatePresence } from "framer-motion";
import type { CountrySummary } from "../domain/country.types";
import { CountryCard } from "./CountryCard";

interface CountryGridProps {
  countries: CountrySummary[];
  isFavorite: (code: string) => boolean;
  onToggleFavorite: (country: CountrySummary) => void;
}

export function CountryGrid({ countries, isFavorite, onToggleFavorite }: CountryGridProps) {
  return (
    <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      <AnimatePresence initial={false}>
        {countries.map((country) => (
          <CountryCard
            key={country.code}
            country={country}
            isFavorite={isFavorite(country.code)}
            onToggleFavorite={() => onToggleFavorite(country)}
          />
        ))}
      </AnimatePresence>
    </ul>
  );
}
