import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";
import { FavoritesStoreProvider } from "@/modules/countries/core/store/favorites.store";
import { router } from "./router";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 60_000,
    },
  },
});

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <FavoritesStoreProvider>
        <RouterProvider router={router} />
      </FavoritesStoreProvider>
    </QueryClientProvider>
  );
}

export default App;
