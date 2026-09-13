import { useQuery } from "@tanstack/react-query";
import { movieQueryKeys } from "../../configuration/query-keys";
import { getMovieDetails } from "../../repository/movies.repository";

export function useMovieDetails(movieId: number | undefined) {
  return useQuery({
    queryKey: movieQueryKeys.details(movieId),
    queryFn: () => getMovieDetails(movieId as number),
    enabled: movieId !== undefined && Number.isFinite(movieId),
  });
}
