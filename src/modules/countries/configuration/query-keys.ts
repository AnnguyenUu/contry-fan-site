export const countryQueryKeys = {
  all: ["countries"] as const,
  search: (query: string) => [...countryQueryKeys.all, "search", query] as const,
  details: (code: string | undefined) => [...countryQueryKeys.all, "details", code] as const,
};
