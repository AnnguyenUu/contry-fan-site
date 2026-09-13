import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { MovieSummary } from "../../domain/movie.types";
import { FavoritesStoreProvider, useFavoritesStore } from "./favorites.store";

const movie: MovieSummary = {
  id: 1,
  title: "Inception",
  overview: "A thief who steals corporate secrets.",
  posterPath: "/poster.jpg",
  releaseYear: "2010",
  voteAverage: 8.8,
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

    expect(result.current.isFavorite(movie.id)).toBe(false);

    act(() => result.current.toggleFavorite(movie));
    expect(result.current.isFavorite(movie.id)).toBe(true);
    expect(result.current.favorites).toHaveLength(1);
    expect(result.current.favorites[0].groupId).toBeNull();

    act(() => result.current.toggleFavorite(movie));
    expect(result.current.isFavorite(movie.id)).toBe(false);
    expect(result.current.favorites).toHaveLength(0);
  });

  it("deletes a favorite directly", () => {
    const { result } = renderStore();

    act(() => result.current.toggleFavorite(movie));
    act(() => result.current.deleteFavorite(movie.id));

    expect(result.current.favorites).toHaveLength(0);
  });

  it("creates a group and assigns a favorite to it", () => {
    const { result } = renderStore();

    act(() => result.current.toggleFavorite(movie));
    act(() => result.current.createGroup("Sci-fi"));

    const group = result.current.groups[0];
    expect(group.name).toBe("Sci-fi");

    act(() => result.current.assignToGroup(movie.id, group.id));
    expect(result.current.favorites[0].groupId).toBe(group.id);
  });

  it("ignores blank group names", () => {
    const { result } = renderStore();
    act(() => result.current.createGroup("   "));
    expect(result.current.groups).toHaveLength(0);
  });

  it("un-assigns favorites back to ungrouped when their group is deleted", () => {
    const { result } = renderStore();

    act(() => result.current.toggleFavorite(movie));
    act(() => result.current.createGroup("Sci-fi"));
    const group = result.current.groups[0];
    act(() => result.current.assignToGroup(movie.id, group.id));

    act(() => result.current.deleteGroup(group.id));

    expect(result.current.groups).toHaveLength(0);
    expect(result.current.favorites[0].groupId).toBeNull();
  });
});
