import { createBrowserRouter } from "react-router-dom";
import { AppLayout } from "./AppLayout";
import { CountryDetailPage } from "./pages/CountryDetailPage";
import { FavoritesPage } from "./pages/FavoritesPage";
import { SearchPage } from "./pages/SearchPage";

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { index: true, element: <SearchPage /> },
      { path: "favorites", element: <FavoritesPage /> },
      { path: "countries/:code", element: <CountryDetailPage /> },
    ],
  },
]);
