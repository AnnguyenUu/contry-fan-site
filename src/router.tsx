import { createBrowserRouter } from "react-router-dom";
import { AppLayout } from "./AppLayout";
import { FavoritesPage } from "./pages/FavoritesPage";
import { MovieDetailPage } from "./pages/MovieDetailPage";
import { SearchPage } from "./pages/SearchPage";

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { index: true, element: <SearchPage /> },
      { path: "favorites", element: <FavoritesPage /> },
      { path: "movies/:movieId", element: <MovieDetailPage /> },
    ],
  },
]);
