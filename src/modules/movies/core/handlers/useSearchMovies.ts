import { useQuery } from "@tanstack/react-query";
import { movieQueryKeys } from "../../configuration/query-keys";
import { searchMovies } from "../../repository/movies.repository";

export function useSearchMovies(query: string, page = 1) {
  const trimmed = query.trim();

  return useQuery({
    queryKey: movieQueryKeys.search(trimmed, page),
    queryFn: () => searchMovies(trimmed, page),
    enabled: trimmed.length > 0,
    placeholderData: (previous) => previous,
  });
}
