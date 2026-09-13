import { ExternalLink } from "lucide-react";
import type { CountryDetails } from "../domain/country.types";

interface CountryDetailAboutProps {
  country: CountryDetails;
}

export function CountryDetailAbout({ country }: CountryDetailAboutProps) {
  return (
    <>
      {country.flagDescription ? (
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          <span className="font-medium">About the flag: </span>
          {country.flagDescription}
        </p>
      ) : null}

      {country.shortDescription ? (
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">{country.shortDescription}</p>
      ) : null}

      {country.wikipediaUrl ? (
        <a
          href={country.wikipediaUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:underline dark:text-indigo-400"
        >
          Read more on Wikipedia
          <ExternalLink aria-hidden="true" className="h-4 w-4" />
        </a>
      ) : null}
    </>
  );
}
