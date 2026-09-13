import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { FavoritesStoreProvider } from "@/modules/movies/core/store/favorites.store";
import * as moviesRepository from "@/modules/movies/repository/movies.repository";
import { SearchPage } from "./SearchPage";

vi.mock("@/modules/movies/repository/movies.repository");

function renderSearchPage() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <FavoritesStoreProvider>
        <MemoryRouter>
          <SearchPage />
        </MemoryRouter>
      </FavoritesStoreProvider>
    </QueryClientProvider>,
  );
}

describe("SearchPage", () => {
  it("prompts the user before any search is entered", () => {
    renderSearchPage();
    expect(screen.getByText(/search for a movie above/i)).toBeInTheDocument();
  });

  it("shows results once the debounced query resolves", async () => {
    vi.mocked(moviesRepository.searchMovies).mockResolvedValue({
      movies: [{ id: 1, title: "Inception", overview: "", posterPath: null, releaseYear: "2010", voteAverage: 8.8 }],
      page: 1,
      totalPages: 1,
    });

    renderSearchPage();
    await userEvent.type(screen.getByLabelText(/search movies/i), "Inception");

    await waitFor(() => expect(screen.getByText("Inception")).toBeInTheDocument());
  });

  it("shows an empty state when there are no results", async () => {
    vi.mocked(moviesRepository.searchMovies).mockResolvedValue({ movies: [], page: 1, totalPages: 0 });

    renderSearchPage();
    await userEvent.type(screen.getByLabelText(/search movies/i), "zzznotarealmovie");

    await waitFor(() => expect(screen.getByText(/no movies found/i)).toBeInTheDocument());
  });

  it("shows an error state when the repository rejects", async () => {
    vi.mocked(moviesRepository.searchMovies).mockRejectedValue(new Error("Could not reach the movie database."));

    renderSearchPage();
    await userEvent.type(screen.getByLabelText(/search movies/i), "Inception");

    await waitFor(() =>
      expect(screen.getByRole("alert")).toHaveTextContent("Could not reach the movie database."),
    );
  });

  it("lets a user favourite a movie from the results", async () => {
    vi.mocked(moviesRepository.searchMovies).mockResolvedValue({
      movies: [{ id: 1, title: "Inception", overview: "", posterPath: null, releaseYear: "2010", voteAverage: 8.8 }],
      page: 1,
      totalPages: 1,
    });

    renderSearchPage();
    await userEvent.type(screen.getByLabelText(/search movies/i), "Inception");

    const favoriteButton = await screen.findByRole("button", { name: "Add Inception to favourites" });
    await userEvent.click(favoriteButton);

    expect(await screen.findByRole("button", { name: "Remove Inception from favourites" })).toBeInTheDocument();
  });
});
