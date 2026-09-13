import { useCallback, useMemo } from "react";
import { context } from "@/shared/lib/context";
import { generateId } from "@/shared/lib/generateId";
import { useLocalStorage } from "@/shared/lib/useLocalStorage";
import { FAVORITES_STORAGE_KEY } from "../../configuration/storage-keys";
import type { FavoriteMovie, Group, MovieSummary } from "../../domain/movie.types";

interface FavoritesState {
  favorites: FavoriteMovie[];
  groups: Group[];
}

const INITIAL_STATE: FavoritesState = { favorites: [], groups: [] };

function useFavoritesStoreValue() {
  const [state, setState] = useLocalStorage<FavoritesState>(FAVORITES_STORAGE_KEY, INITIAL_STATE);

  const isFavorite = useCallback(
    (movieId: number) => state.favorites.some((favorite) => favorite.movieId === movieId),
    [state.favorites],
  );

  const toggleFavorite = useCallback(
    (movie: MovieSummary) => {
      setState((previous) => {
        const alreadyFavorited = previous.favorites.some((favorite) => favorite.movieId === movie.id);
        if (alreadyFavorited) {
          return { ...previous, favorites: previous.favorites.filter((favorite) => favorite.movieId !== movie.id) };
        }

        const favorite: FavoriteMovie = {
          movieId: movie.id,
          title: movie.title,
          posterPath: movie.posterPath,
          releaseYear: movie.releaseYear,
          groupId: null,
          addedAt: new Date().toISOString(),
        };
        return { ...previous, favorites: [...previous.favorites, favorite] };
      });
    },
    [setState],
  );

  const deleteFavorite = useCallback(
    (movieId: number) => {
      setState((previous) => ({
        ...previous,
        favorites: previous.favorites.filter((favorite) => favorite.movieId !== movieId),
      }));
    },
    [setState],
  );

  const createGroup = useCallback(
    (name: string) => {
      const trimmed = name.trim();
      if (!trimmed) return;
      setState((previous) => ({
        ...previous,
        groups: [...previous.groups, { id: generateId(), name: trimmed, createdAt: new Date().toISOString() }],
      }));
    },
    [setState],
  );

  const deleteGroup = useCallback(
    (groupId: string) => {
      setState((previous) => ({
        groups: previous.groups.filter((group) => group.id !== groupId),
        favorites: previous.favorites.map((favorite) =>
          favorite.groupId === groupId ? { ...favorite, groupId: null } : favorite,
        ),
      }));
    },
    [setState],
  );

  const assignToGroup = useCallback(
    (movieId: number, groupId: string | null) => {
      setState((previous) => ({
        ...previous,
        favorites: previous.favorites.map((favorite) =>
          favorite.movieId === movieId ? { ...favorite, groupId } : favorite,
        ),
      }));
    },
    [setState],
  );

  return useMemo(
    () => ({
      favorites: state.favorites,
      groups: state.groups,
      isFavorite,
      toggleFavorite,
      deleteFavorite,
      createGroup,
      deleteGroup,
      assignToGroup,
    }),
    [state.favorites, state.groups, isFavorite, toggleFavorite, deleteFavorite, createGroup, deleteGroup, assignToGroup],
  );
}

export const [FavoritesStoreProvider, useFavoritesStore] = context(useFavoritesStoreValue);
