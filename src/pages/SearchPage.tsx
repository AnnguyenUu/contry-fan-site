import { useState } from "react";
import { useSearchCountries } from "@/modules/countries/core/handlers/useSearchCountries";
import { useFavoritesStore } from "@/modules/countries/core/store/favorites.store";
import { CountryGrid } from "@/modules/countries/presentation/CountryGrid";
import { SearchBar } from "@/modules/countries/presentation/SearchBar";
import { EmptyState } from "@/shared/presentation/EmptyState";
import { ErrorState } from "@/shared/presentation/ErrorState";
import { LoadingState } from "@/shared/presentation/LoadingState";
import { useDebouncedValue } from "@/shared/lib/useDebouncedValue";

export function SearchPage() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query, 400);
  const { data, isLoading, isError, error, refetch } = useSearchCountries(debouncedQuery);
  const { isFavorite, toggleFavorite } = useFavoritesStore();

  return (
    <div className="flex flex-col gap-6">
      <SearchBar value={query} onChange={setQuery} />
      <div aria-live="polite" className="sr-only">
        {data ? `${data.length} results found` : ""}
      </div>
      {debouncedQuery.trim().length === 0 ? (
        <EmptyState>
          Search for a country above to get started — try a name, a capital city, or a country code.
        </EmptyState>
      ) : isLoading ? (
        <LoadingState label={`Searching for "${debouncedQuery}"…`} />
      ) : isError ? (
        <ErrorState
          message={error instanceof Error ? error.message : "Something went wrong."}
          onRetry={() => refetch()}
        />
      ) : data && data.length === 0 ? (
        <EmptyState>No countries found for "{debouncedQuery}". Try a different search.</EmptyState>
      ) : data ? (
        <CountryGrid countries={data} isFavorite={isFavorite} onToggleFavorite={toggleFavorite} />
      ) : null}
    </div>
  );
}
