import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useCountryDetails } from "@/modules/countries/core/handlers/useCountryDetails";
import { useFavoritesStore } from "@/modules/countries/core/store/favorites.store";
import { CountryDetailAbout } from "@/modules/countries/presentation/CountryDetailAbout";
import { CountryDetailBorders } from "@/modules/countries/presentation/CountryDetailBorders";
import { CountryDetailHeading } from "@/modules/countries/presentation/CountryDetailHeading";
import { CountryDetailImage } from "@/modules/countries/presentation/CountryDetailImage";
import { CountryDetailSkeleton } from "@/modules/countries/presentation/CountryDetailSkeleton";
import { CountryDetailStats } from "@/modules/countries/presentation/CountryDetailStats";
import { ErrorState } from "@/shared/presentation/ErrorState";

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
        <output aria-label="Loading country" className="block">
          <CountryDetailSkeleton />
        </output>
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
        <CountryDetailImage src={country.flagPngUrl} />
        <div className="flex flex-col gap-4 p-6">
          <CountryDetailHeading
            country={country}
            isFavorite={isFavorite(country.code)}
            onToggleFavorite={() => toggleFavorite(country)}
          />
          <CountryDetailStats country={country} />
          <CountryDetailBorders borders={country.borders} />
          <CountryDetailAbout country={country} />
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
        data-testid="back-to-search-link"
        className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:underline dark:text-indigo-400"
      >
        <ArrowLeft aria-hidden="true" className="h-4 w-4" />
        Back to search
      </Link>
      {children}
    </div>
  );
};
