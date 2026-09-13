import { useQuery } from "@tanstack/react-query";
import { countryQueryKeys } from "../../configuration/query-keys";
import { searchCountries } from "../../repository/countries.repository";

export function useSearchCountries(query: string) {
  const trimmed = query.trim();

  return useQuery({
    queryKey: countryQueryKeys.search(trimmed),
    queryFn: () => searchCountries(trimmed),
    enabled: trimmed.length > 0,
    placeholderData: (previous) => previous,
  });
}
