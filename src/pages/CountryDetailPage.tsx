import { ArrowLeft, ExternalLink } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useCountryDetails } from "@/modules/countries/core/handlers/useCountryDetails";
import { useFavoritesStore } from "@/modules/countries/core/store/favorites.store";
import { FavoriteButton } from "@/modules/countries/presentation/FavoriteButton";
import { ErrorState } from "@/shared/presentation/ErrorState";
import { LoadingState } from "@/shared/presentation/LoadingState";

const numberFormatter = new Intl.NumberFormat("en-US");

export function CountryDetailPage() {
  const { code } = useParams<{ code: string }>();
  const {
    data: country,
    isLoading,
    isError,
    error,
    refetch,
  } = useCountryDetails(code);
  const { isFavorite, toggleFavorite } = useFavoritesStore();

  if (isLoading) {
    return (
      <CountryDetailPageWrapper>
        <LoadingState label="Loading country…" />;
      </CountryDetailPageWrapper>
    );
  }

  if (isError || !country) {
    return (
      <CountryDetailPageWrapper>
        <ErrorState
          message={
            error instanceof Error ? error.message : "Country not found."
          }
          onRetry={() => refetch()}
        />
      </CountryDetailPageWrapper>
    );
  }

  return (
    <CountryDetailPageWrapper>
      <article className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">
        <div className="flex max-h-56 items-center justify-center overflow-hidden bg-slate-100 dark:bg-slate-700">
          <img
            src={country.flagPngUrl}
            alt=""
            className="w-full object-cover"
          />
        </div>
        <div className="flex flex-col gap-4 p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                <span aria-hidden="true">{country.flagEmoji} </span>
                {country.commonName}
              </h1>
              {country.officialName !== country.commonName ? (
                <p className="italic text-slate-500 dark:text-slate-400">
                  {country.officialName}
                </p>
              ) : null}
            </div>
            <FavoriteButton
              isFavorite={isFavorite(country.code)}
              name={country.commonName}
              onToggle={() => toggleFavorite(country)}
            />
          </div>

          <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm text-slate-600 sm:grid-cols-3 dark:text-slate-300">
            <div>
              <dt className="text-xs uppercase tracking-wide text-slate-400">
                Capital
              </dt>
              <dd>{country.capital ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-slate-400">
                Region
              </dt>
              <dd>
                {country.region}
                {country.subregion ? ` · ${country.subregion}` : ""}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-slate-400">
                Population
              </dt>
              <dd>{numberFormatter.format(country.population)}</dd>
            </div>
            {country.areaKm2 ? (
              <div>
                <dt className="text-xs uppercase tracking-wide text-slate-400">
                  Area
                </dt>
                <dd>{numberFormatter.format(country.areaKm2)} km²</dd>
              </div>
            ) : null}
            {country.languages.length > 0 ? (
              <div>
                <dt className="text-xs uppercase tracking-wide text-slate-400">
                  Languages
                </dt>
                <dd>{country.languages.join(", ")}</dd>
              </div>
            ) : null}
            {country.currencies.length > 0 ? (
              <div>
                <dt className="text-xs uppercase tracking-wide text-slate-400">
                  Currencies
                </dt>
                <dd>
                  {country.currencies
                    .map(
                      (currency) =>
                        `${currency.name}${currency.symbol ? ` (${currency.symbol})` : ""}`,
                    )
                    .join(", ")}
                </dd>
              </div>
            ) : null}
          </dl>

          {country.borders.length > 0 ? (
            <div>
              <h2 className="text-xs uppercase tracking-wide text-slate-400">
                Borders
              </h2>
              <ul className="mt-1 flex flex-wrap gap-2">
                {country.borders.map((borderCode) => (
                  <li
                    key={borderCode}
                    className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600 dark:bg-slate-700 dark:text-slate-300"
                  >
                    {borderCode}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {country.flagDescription ? (
            <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
              <span className="font-medium">About the flag: </span>
              {country.flagDescription}
            </p>
          ) : null}

          {country.shortDescription ? (
            <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
              {country.shortDescription}
            </p>
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
        </div>
      </article>
    </CountryDetailPageWrapper>
  );
}

const CountryDetailPageWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className="flex flex-col gap-4">
      <Link
        to="/"
        className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:underline dark:text-indigo-400"
      >
        <ArrowLeft aria-hidden="true" className="h-4 w-4" />
        Back to search
      </Link>
      {children}
    </div>
  );
};
