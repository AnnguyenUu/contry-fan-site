import { useState } from "react";
import { useSearchCountries } from "@/modules/countries/core/handlers/useSearchCountries";
import { useFavoritesStore } from "@/modules/countries/core/store/favorites.store";
import { CountryGrid } from "@/modules/countries/presentation/CountryGrid";
import { CountryGridSkeleton } from "@/modules/countries/presentation/CountryGridSkeleton";
import { SearchBar } from "@/modules/countries/presentation/SearchBar";
import { EmptyState } from "@/shared/presentation/EmptyState";
import { ErrorState } from "@/shared/presentation/ErrorState";
import { useDebouncedValue } from "@/shared/lib/useDebouncedValue";

export function SearchPage() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query, 400);
  const { data, isLoading, isError, error, refetch } =
    useSearchCountries(debouncedQuery);
  const { isFavorite, toggleFavorite } = useFavoritesStore();

  function renderResults() {
    if (isLoading) {
      return (
        <output aria-label={`Searching for "${debouncedQuery}"`} className="block">
          <CountryGridSkeleton />
        </output>
      );
    }
    if (isError) {
      return (
        <ErrorState
          message={
            error instanceof Error ? error.message : "Something went wrong."
          }
          onRetry={() => refetch()}
        />
      );
    }
    if (debouncedQuery.trim().length === 0) {
      return (
        <EmptyState>
          Search for a country above to get started — try a name, a capital
          city, or a country code.
        </EmptyState>
      );
    }
    if (data && data.length === 0) {
      return (
        <EmptyState>
          No countries found for "{debouncedQuery}". Try a different search.
        </EmptyState>
      );
    }
    return (
      <CountryGrid
        countries={data || []}
        isFavorite={isFavorite}
        onToggleFavorite={toggleFavorite}
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <SearchBar value={query} onChange={setQuery} />
      <div aria-live="polite" className="sr-only">
        {data ? `${data.length} results found` : ""}
      </div>
      {renderResults()}
    </div>
  );
}
