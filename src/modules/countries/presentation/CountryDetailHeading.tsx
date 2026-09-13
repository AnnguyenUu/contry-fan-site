import type { CountryDetails } from "../domain/country.types";
import { FavoriteButton } from "./FavoriteButton";

interface CountryDetailHeadingProps {
  country: CountryDetails;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export function CountryDetailHeading({ country, isFavorite, onToggleFavorite }: CountryDetailHeadingProps) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          <span aria-hidden="true">{country.flagEmoji} </span>
          {country.commonName}
        </h1>
        {country.officialName !== country.commonName ? (
          <p className="italic text-slate-500 dark:text-slate-400">{country.officialName}</p>
        ) : null}
      </div>
      <FavoriteButton isFavorite={isFavorite} name={country.commonName} onToggle={onToggleFavorite} />
    </div>
  );
}
