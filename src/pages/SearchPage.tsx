import { useState } from "react";
import { useSearchMovies } from "@/modules/movies/core/handlers/useSearchMovies";
import { useFavoritesStore } from "@/modules/movies/core/store/favorites.store";
import { MovieGrid } from "@/modules/movies/presentation/MovieGrid";
import { SearchBar } from "@/modules/movies/presentation/SearchBar";
import { EmptyState } from "@/shared/presentation/EmptyState";
import { ErrorState } from "@/shared/presentation/ErrorState";
import { LoadingState } from "@/shared/presentation/LoadingState";
import { useDebouncedValue } from "@/shared/lib/useDebouncedValue";

export function SearchPage() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query, 400);
  const { data, isLoading, isError, error, refetch } = useSearchMovies(debouncedQuery);
  const { isFavorite, toggleFavorite } = useFavoritesStore();

  return (
    <div className="flex flex-col gap-6">
      <SearchBar value={query} onChange={setQuery} />
      <div aria-live="polite" className="sr-only">
        {data ? `${data.movies.length} results found` : ""}
      </div>
      {debouncedQuery.trim().length === 0 ? (
        <EmptyState>
          Search for a movie above to get started — try a title, an actor's film, or a franchise.
        </EmptyState>
      ) : isLoading ? (
        <LoadingState label={`Searching for "${debouncedQuery}"…`} />
      ) : isError ? (
        <ErrorState
          message={error instanceof Error ? error.message : "Something went wrong."}
          onRetry={() => refetch()}
        />
      ) : data && data.movies.length === 0 ? (
        <EmptyState>No movies found for "{debouncedQuery}". Try a different search.</EmptyState>
      ) : data ? (
        <MovieGrid movies={data.movies} isFavorite={isFavorite} onToggleFavorite={toggleFavorite} />
      ) : null}
    </div>
  );
}
