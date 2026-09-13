import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { CountrySummary } from "@/modules/countries/domain/country.types";
import { FavoritesStoreProvider, useFavoritesStore } from "./favorites.store";

const country: CountrySummary = {
  code: "CAN",
  commonName: "Canada",
  officialName: "Canada",
  flagEmoji: "🇨🇦",
  flagPngUrl: "https://flags.example.com/ca.png",
  region: "Americas",
  subregion: "North America",
  capital: "Ottawa",
  population: 38_000_000,
};

function renderStore() {
  return renderHook(() => useFavoritesStore(), {
    wrapper: ({ children }) => <FavoritesStoreProvider>{children}</FavoritesStoreProvider>,
  });
}

describe("favorites store", () => {
  it("throws when used outside its provider", () => {
    expect(() => renderHook(() => useFavoritesStore())).toThrow(
      "This hook must be used within its matching Provider.",
    );
  });

  it("adds and removes a favorite via toggleFavorite", () => {
    const { result } = renderStore();

    expect(result.current.isFavorite(country.code)).toBe(false);

    act(() => result.current.toggleFavorite(country));
    expect(result.current.isFavorite(country.code)).toBe(true);
    expect(result.current.favorites).toHaveLength(1);
    expect(result.current.favorites[0].groupId).toBeNull();

    act(() => result.current.toggleFavorite(country));
    expect(result.current.isFavorite(country.code)).toBe(false);
    expect(result.current.favorites).toHaveLength(0);
  });

  it("deletes a favorite directly", () => {
    const { result } = renderStore();

    act(() => result.current.toggleFavorite(country));
    act(() => result.current.deleteFavorite(country.code));

    expect(result.current.favorites).toHaveLength(0);
  });

  it("creates a group and assigns a favorite to it", () => {
    const { result } = renderStore();

    act(() => result.current.toggleFavorite(country));
    act(() => result.current.createGroup("Places to visit"));

    const group = result.current.groups[0];
    expect(group.name).toBe("Places to visit");

    act(() => result.current.assignToGroup(country.code, group.id));
    expect(result.current.favorites[0].groupId).toBe(group.id);
  });

  it("ignores blank group names", () => {
    const { result } = renderStore();
    act(() => result.current.createGroup("   "));
    expect(result.current.groups).toHaveLength(0);
  });

  it("un-assigns favorites back to ungrouped when their group is deleted", () => {
    const { result } = renderStore();

    act(() => result.current.toggleFavorite(country));
    act(() => result.current.createGroup("Places to visit"));
    const group = result.current.groups[0];
    act(() => result.current.assignToGroup(country.code, group.id));

    act(() => result.current.deleteGroup(group.id));

    expect(result.current.groups).toHaveLength(0);
    expect(result.current.favorites[0].groupId).toBeNull();
  });
});
