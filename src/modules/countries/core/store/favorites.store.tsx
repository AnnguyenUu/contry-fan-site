import { useCallback, useMemo } from "react";
import { context } from "@/shared/lib/context";
import { generateId } from "@/shared/lib/generateId";
import { useLocalStorage } from "@/shared/lib/useLocalStorage";
import { FAVORITES_STORAGE_KEY } from "@/modules/countries/configuration/storage-keys";
import type {
  CountrySummary,
  FavoriteCountry,
  Group,
} from "@/modules/countries/domain/country.types";

interface FavoritesState {
  favorites: FavoriteCountry[];
  groups: Group[];
}

const INITIAL_STATE: FavoritesState = { favorites: [], groups: [] };

function useFavoritesStoreValue() {
  const [state, setState] = useLocalStorage<FavoritesState>(
    FAVORITES_STORAGE_KEY,
    INITIAL_STATE,
  );

  const isFavorite = useCallback(
    (countryCode: string) =>
      state.favorites.some((favorite) => favorite.countryCode === countryCode),
    [state.favorites],
  );

  const toggleFavorite = useCallback(
    (country: CountrySummary) => {
      setState((previous) => {
        const alreadyFavorited = previous.favorites.some(
          (favorite) => favorite.countryCode === country.code,
        );
        if (alreadyFavorited) {
          return {
            ...previous,
            favorites: previous.favorites.filter(
              (favorite) => favorite.countryCode !== country.code,
            ),
          };
        }

        const favorite: FavoriteCountry = {
          countryCode: country.code,
          commonName: country.commonName,
          flagEmoji: country.flagEmoji,
          flagPngUrl: country.flagPngUrl,
          region: country.region,
          groupId: null,
          addedAt: new Date().toISOString(),
        };
        return { ...previous, favorites: [...previous.favorites, favorite] };
      });
    },
    [setState],
  );

  const deleteFavorite = useCallback(
    (countryCode: string) => {
      setState((previous) => ({
        ...previous,
        favorites: previous.favorites.filter(
          (favorite) => favorite.countryCode !== countryCode,
        ),
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
        groups: [
          ...previous.groups,
          {
            id: generateId(),
            name: trimmed,
            createdAt: new Date().toISOString(),
          },
        ],
      }));
    },
    [setState],
  );

  const deleteGroup = useCallback(
    (groupId: string) => {
      setState((previous) => ({
        groups: previous.groups.filter((group) => group.id !== groupId),
        favorites: previous.favorites.map((favorite) =>
          favorite.groupId === groupId
            ? { ...favorite, groupId: null }
            : favorite,
        ),
      }));
    },
    [setState],
  );

  const assignToGroup = useCallback(
    (countryCode: string, groupId: string | null) => {
      setState((previous) => ({
        ...previous,
        favorites: previous.favorites.map((favorite) =>
          favorite.countryCode === countryCode
            ? { ...favorite, groupId }
            : favorite,
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
    [
      state.favorites,
      state.groups,
      isFavorite,
      toggleFavorite,
      deleteFavorite,
      createGroup,
      deleteGroup,
      assignToGroup,
    ],
  );
}

export const [FavoritesStoreProvider, useFavoritesStore] = context(
  "Favorites",
  useFavoritesStoreValue,
);
