export const movieQueryKeys = {
  all: ["movies"] as const,
  search: (query: string, page: number) => [...movieQueryKeys.all, "search", query, page] as const,
  details: (movieId: number | undefined) => [...movieQueryKeys.all, "details", movieId] as const,
};
