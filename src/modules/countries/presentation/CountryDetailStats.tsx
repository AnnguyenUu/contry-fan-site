import type { CountryDetails } from "../domain/country.types";

const numberFormatter = new Intl.NumberFormat("en-US");

interface CountryDetailStatsProps {
  country: CountryDetails;
}

export function CountryDetailStats({ country }: CountryDetailStatsProps) {
  return (
    <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm text-slate-600 sm:grid-cols-3 dark:text-slate-300">
      <div>
        <dt className="text-xs uppercase tracking-wide text-slate-400">Capital</dt>
        <dd>{country.capital ?? "—"}</dd>
      </div>
      <div>
        <dt className="text-xs uppercase tracking-wide text-slate-400">Region</dt>
        <dd>
          {country.region}
          {country.subregion ? ` · ${country.subregion}` : ""}
        </dd>
      </div>
      <div>
        <dt className="text-xs uppercase tracking-wide text-slate-400">Population</dt>
        <dd>{numberFormatter.format(country.population)}</dd>
      </div>
      {country.areaKm2 ? (
        <div>
          <dt className="text-xs uppercase tracking-wide text-slate-400">Area</dt>
          <dd>{numberFormatter.format(country.areaKm2)} km²</dd>
        </div>
      ) : null}
      {country.languages.length > 0 ? (
        <div>
          <dt className="text-xs uppercase tracking-wide text-slate-400">Languages</dt>
          <dd>{country.languages.join(", ")}</dd>
        </div>
      ) : null}
      {country.currencies.length > 0 ? (
        <div>
          <dt className="text-xs uppercase tracking-wide text-slate-400">Currencies</dt>
          <dd>
            {country.currencies
              .map((currency) => `${currency.name}${currency.symbol ? ` (${currency.symbol})` : ""}`)
              .join(", ")}
          </dd>
        </div>
      ) : null}
    </dl>
  );
}
