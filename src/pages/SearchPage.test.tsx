import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { FavoritesStoreProvider } from "@/modules/countries/core/store/favorites.store";
import * as countriesRepository from "@/modules/countries/repository/countries.repository";
import { SearchPage } from "./SearchPage";

vi.mock("@/modules/countries/repository/countries.repository");

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

const canada = {
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

describe("SearchPage", () => {
  it("prompts the user before any search is entered", () => {
    renderSearchPage();
    expect(screen.getByText(/search for a country above/i)).toBeInTheDocument();
  });

  it("shows results once the debounced query resolves", async () => {
    vi.mocked(countriesRepository.searchCountries).mockResolvedValue([canada]);

    renderSearchPage();
    await userEvent.type(screen.getByLabelText(/search countries/i), "Canada");

    await waitFor(() => expect(screen.getByText("Canada")).toBeInTheDocument());
  });

  it("shows an empty state when there are no results", async () => {
    vi.mocked(countriesRepository.searchCountries).mockResolvedValue([]);

    renderSearchPage();
    await userEvent.type(screen.getByLabelText(/search countries/i), "zzznotarealcountry");

    await waitFor(() => expect(screen.getByText(/no countries found/i)).toBeInTheDocument());
  });

  it("shows an error state when the repository rejects", async () => {
    vi.mocked(countriesRepository.searchCountries).mockRejectedValue(
      new Error("Could not reach the country database."),
    );

    renderSearchPage();
    await userEvent.type(screen.getByLabelText(/search countries/i), "Canada");

    await waitFor(() =>
      expect(screen.getByRole("alert")).toHaveTextContent("Could not reach the country database."),
    );
  });

  it("lets a user favourite a country from the results", async () => {
    vi.mocked(countriesRepository.searchCountries).mockResolvedValue([canada]);

    renderSearchPage();
    await userEvent.type(screen.getByLabelText(/search countries/i), "Canada");

    const favoriteButton = await screen.findByRole("button", { name: "Add Canada to favourites" });
    await userEvent.click(favoriteButton);

    expect(await screen.findByRole("button", { name: "Remove Canada from favourites" })).toBeInTheDocument();
  });
});
